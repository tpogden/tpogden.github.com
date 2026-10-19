// A 2D fast Fourier transform on the GPU, for the Moving Figures posts. Import it from
// an {ojs} cell with:
//   const fft = await import(new URL("../lib/fft.js", document.baseURI).href);
//
//   const transform = fft.create(device, 512);    // 512 x 512, a power of two
//   // write the input into transform.data: n * n complex numbers, row by row, as
//   // pairs of f32 (real, imaginary). Then, in a command encoder:
//   transform.encode(encoder);
//   // transform.data now holds the transform, in natural order: the zero frequency
//   // is element 0, and the frequencies run 0, 1, ... n/2 - 1, -n/2, ... -1 along
//   // each row and down each column.
//
// To stop part-way, pass the number of passes (0 to transform.passes) and use the buffer
// that encode returns, which is where the half-finished data is:
//   const buffer = transform.encode(encoder, 7);
//
// The transform is X[k] = sum over j of x[j] exp(-2 pi i j k / n), in each direction,
// with no scaling. Pass { inverse: true } to use the opposite sign.
//
// It is the Stockham form of the radix-2 algorithm: log2(n) passes along the rows and
// log2(n) along the columns. Each pass reads one array and writes the other, so the
// data goes back and forth between two buffers and comes out in order with no separate
// reordering step. One thread does one butterfly.

export function create(device, n, { inverse = false } = {}) {
  const stages = Math.log2(n);
  if (!Number.isInteger(stages) || n < 2) throw new Error("The size must be a power of two.");

  const bytes = n * n * 8;
  const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
  const buffers = [device.createBuffer({ size: bytes, usage }), device.createBuffer({ size: bytes, usage })];

  const module = device.createShaderModule({
    code: `
      struct Params {
        half: u32,    // size of the sub-transforms being joined
        axis: u32,    // 0: along each row, 1: down each column
        sign: f32,    // -1 for the forward transform
        pad: u32,
      }

      @group(0) @binding(0) var<uniform> params: Params;
      @group(0) @binding(1) var<storage, read> src: array<vec2f>;
      @group(0) @binding(2) var<storage, read_write> dst: array<vec2f>;

      const N = ${n}u;
      const HALF_N = ${n / 2}u;

      // Element m of row (or column) "line"
      fn at(line: u32, m: u32) -> u32 {
        return select(m * N + line, line * N + m, params.axis == 0u);
      }

      fn mul(a: vec2f, b: vec2f) -> vec2f {
        return vec2f(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
      }

      @compute @workgroup_size(16, 16)
      fn butterfly(@builtin(global_invocation_id) id: vec3u) {
        let j = id.x;       // which butterfly along the line
        let line = id.y;    // which row or column
        if (j >= HALF_N || line >= N) { return; }

        let p = params.half;
        let k = j & (p - 1u);               // place within the sub-transform
        let out = (j / p) * p * 2u + k;     // where the pair is written

        let a = src[at(line, j)];
        let b = src[at(line, j + HALF_N)];
        let angle = params.sign * 3.141592653589793 * f32(k) / f32(p);
        let t = mul(b, vec2f(cos(angle), sin(angle)));
        dst[at(line, out)] = a + t;
        dst[at(line, out + p)] = a - t;
      }
    `,
  });
  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module, entryPoint: "butterfly" },
  });

  // One bind group for each pass: rows first, then columns, with the two buffers
  // swapping roles each time. An even number of passes leaves the result where the
  // input was.
  const groups = [];
  let pass = 0;
  for (const axis of [0, 1]) {
    for (let half = 1; half < n; half *= 2) {
      const uniform = device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bytes = new ArrayBuffer(16);
      new Uint32Array(bytes).set([half, axis], 0);
      new Float32Array(bytes)[2] = inverse ? 1 : -1;
      device.queue.writeBuffer(uniform, 0, bytes);
      groups.push(
        device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: uniform } },
            { binding: 1, resource: { buffer: buffers[pass % 2] } },
            { binding: 2, resource: { buffer: buffers[(pass + 1) % 2] } },
          ],
        }),
      );
      pass++;
    }
  }

  return {
    n,
    // How many passes the whole transform takes: log2(n) along the rows, then the same
    // down the columns
    passes: groups.length,
    // Input and output: the transform is done in place, as far as the caller can tell
    data: buffers[0],
    // Both buffers, for the half-finished data
    buffers,
    // Record the first `passes` passes (all of them by default) into an encoder. Returns
    // the buffer that holds the result: `data` after all of them or none, and the other
    // one after an odd number
    encode(encoder, passes = groups.length) {
      const compute = encoder.beginComputePass();
      compute.setPipeline(pipeline);
      for (let i = 0; i < passes; i++) {
        compute.setBindGroup(0, groups[i]);
        compute.dispatchWorkgroups(Math.ceil(n / 2 / 16), Math.ceil(n / 16));
      }
      compute.end();
      return buffers[passes % 2];
    },
  };
}
