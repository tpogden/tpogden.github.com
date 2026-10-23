// Shared code for the Moving Figures wave-tank posts: a sheet of water on a grid, stepped
// with the leapfrog rule and shown from above. Import it from an {ojs} cell with:
//   const wave = await import(new URL("../lib/wave.js", document.baseURI).href);
//
// It shares the kernels and the bookkeeping. Each post keeps its own controls, frame
// loop and charts. The shader modules are built from the options a post asks for:
//
//   walls    a water/wall field (1 or 0 a cell) at binding 1: a cell pulls only on
//            neighbours that are water, and a wall cell stays at 0
//   source   a plane-wave paddle at column params.sourceX, driven by a step counter at
//            binding 5 (the `clock` buffer, advanced by the one-thread `tick` kernel)
//   clamp    keep the heights within +-1e6, so an unstable run stays drawable
//   screen   (show only) draw a faint line down column params.screenX
//
// Bindings: 0 params, 1 water, 2 one step ago, 3 now, 4 being made, 5 clock.

export const groupSide = 16; // workgroups are groupSide x groupSide cells
export const maxSplashes = 8;
export const heightGain = 2.5; // how strongly a height shows as colour

// How many workgroups cover a width x height grid
export const groups = (width, height) => ({
  x: Math.ceil(width / groupSide),
  y: Math.ceil(height / groupSide),
});

// The Params struct, its binding and beachFraction. Every field is always present, a
// kernel just ignores what it does not use.
export const commonWGSL = ({ walls = false } = {}) => `
  struct Params {
    width: u32,
    height: u32,
    courant2: f32,
    sponge: f32,        // damping per step at the very edge of the tank
    edge: f32,          // width of the beach, in cells
    screenX: u32,       // the column the pattern is measured on
    sourceX: u32,
    sourceStart: u32,   // step at which the paddle started
    rampSteps: f32,
    sourceAmp: f32,     // forcing added each step
    sourceOmega: f32,   // radians a step
    gain: f32,
    splashCount: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
    splashes: array<vec4f, ${maxSplashes}>, // x, y, height, radius
  }

  @group(0) @binding(0) var<uniform> params: Params;
  ${walls ? "@group(0) @binding(1) var<storage, read> water: array<f32>;" : ""}

  // 0 in open water, rising to 1 at the border: how far into the beach a cell is
  fn beachFraction(x: u32, y: u32) -> f32 {
    let ex = min(f32(x), f32(params.width - 1u - x));
    let ey = min(f32(y), f32(params.height - 1u - y));
    let e = min(ex, ey);
    return select(0.0, (params.edge - e) / params.edge, e < params.edge);
  }
`;

// The step kernel (leapfrog with a damping beach) and, with `source`, the one-thread
// `tick` kernel that counts steps on the GPU
export const stepWGSL = ({ walls = false, source = false, clamp = false } = {}) => {
  // Pull towards a neighbour, but only through water: a wall has nothing to pull on,
  // and neither has a cell next to one
  const pull = (cond, nb) =>
    walls
      ? `if (${cond}) { pull += min(k, water[${nb}]) * (now[${nb}] - here); }`
      : `if (${cond}) { pull += now[${nb}] - here; }`;
  return `
  ${commonWGSL({ walls })}
  @group(0) @binding(2) var<storage, read> before: array<f32>;
  @group(0) @binding(3) var<storage, read> now: array<f32>;
  @group(0) @binding(4) var<storage, read_write> after: array<f32>;
  ${source ? "@group(0) @binding(5) var<storage, read_write> clock: array<u32>;" : ""}

  @compute @workgroup_size(${groupSide}, ${groupSide})
  fn step(@builtin(global_invocation_id) id: vec3u) {
    let w = params.width;
    let h = params.height;
    if (id.x >= w || id.y >= h) { return; }
    let x = id.x;
    let y = id.y;
    let i = y * w + x;
    ${walls ? "let k = water[i];" : ""}
    let here = now[i];

    // Pull towards each of the four neighbours. At the edge of the tank a cell has
    // nothing to pull on that side
    var pull = 0.0;
    ${pull("x > 0u", "i - 1u")}
    ${pull("x + 1u < w", "i + 1u")}
    ${pull("y > 0u", "i - w")}
    ${pull("y + 1u < h", "i + w")}

    let q = beachFraction(x, y);
    let sigma = params.sponge * q * q;
    var next = (2.0 * here - (1.0 - sigma) * before[i] + params.courant2 * pull) / (1.0 + sigma);
    ${
      source
        ? `
    // The paddle adds to the water rather than fixing it, so waves coming back pass
    // through it
    if (x == params.sourceX) {
      let t = f32(clock[0]) - f32(params.sourceStart);
      let ramp = smoothstep(0.0, 1.0, t / params.rampSteps);
      next += params.sourceAmp * ramp * cos(params.sourceOmega * t);
    }`
        : ""
    }
    ${clamp ? "// Past the stability limit the numbers grow without bound: stop them overflowing\n    next = clamp(next, -1e6, 1e6);" : ""}
    after[i] = ${walls ? "select(0.0, next, k > 0.0)" : "next"};
  }
  ${
    source
      ? `
  @compute @workgroup_size(1)
  fn tick() {
    clock[0] = clock[0] + 1u;
  }`
      : ""
  }
`;
};

// A stone: a dent with a ring round it, added to the surface and not moving to begin
// with. The ring makes the dent add up to no net water, as a real splash does
export const splashWGSL = () => `
  ${commonWGSL()}
  @group(0) @binding(2) var<storage, read_write> before: array<f32>;
  @group(0) @binding(3) var<storage, read_write> now: array<f32>;

  @compute @workgroup_size(${groupSide}, ${groupSide})
  fn splash(@builtin(global_invocation_id) id: vec3u) {
    if (id.x >= params.width || id.y >= params.height) { return; }
    let i = id.y * params.width + id.x;
    var bump = 0.0;
    for (var n = 0u; n < params.splashCount; n++) {
      let s = params.splashes[n];
      let dx = f32(id.x) - s.x;
      let dy = f32(id.y) - s.y;
      let r2 = (dx * dx + dy * dy) / (2.0 * s.w * s.w);
      bump += s.z * (1.0 - r2) * exp(-r2);
    }
    now[i] += bump;
    before[i] += bump;
  }
`;

// The drawing shader: red for a crest, blue for a trough, dark for flat, dimmed
// towards the beach. Entry points showVertex and showFragment.
//   walls    wall cells are drawn grey
//   source   the paddle is drawn as a white bar two cells wide
//   screen   a faint white line marks column params.screenX
export const showWGSL = ({ walls = false, source = false, screen = false } = {}) => `
  ${commonWGSL({ walls })}
  @group(0) @binding(3) var<storage, read> now: array<f32>;

  struct Out {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
  }

  @vertex
  fn showVertex(@location(0) corner: vec2f) -> Out {
    return Out(
      vec4f(corner, 0.0, 1.0),
      vec2f(corner.x * 0.5 + 0.5, 0.5 - corner.y * 0.5),
    );
  }

  @fragment
  fn showFragment(in: Out) -> @location(0) vec4f {
    let w = params.width;
    let h = params.height;
    let x = min(u32(in.uv.x * f32(w)), w - 1u);
    let y = min(u32(in.uv.y * f32(h)), h - 1u);
    let i = y * w + x;
    ${walls ? "if (water[i] == 0.0) { return vec4f(0.62, 0.62, 0.64, 1.0); }" : ""}

    let flat = vec3f(0.10, 0.10, 0.10);
    let v = now[i] * params.gain;
    let crest = vec3f(1.0, 0.282, 0.204);   // #FF4834
    let trough = vec3f(0.22, 0.60, 0.85);
    var colour = mix(flat, select(trough, crest, v > 0.0), clamp(abs(v), 0.0, 1.0));
    colour *= 1.0 - 0.45 * beachFraction(x, y);
    ${
      source
        ? `if (x == params.sourceX || x == params.sourceX + 1u) {
      colour = vec3f(0.92);
    }`
        : ""
    }
    ${
      screen
        ? `if (x == params.screenX) {
      colour = mix(colour, vec3f(0.92), 0.35);
    }`
        : ""
    }
    return vec4f(colour, 1.0);
  }
`;

// The pipelines
export function computePipeline(device, code, entryPoint) {
  return device.createComputePipeline({
    layout: "auto",
    compute: { module: device.createShaderModule({ code }), entryPoint },
  });
}

export function showPipeline(device, code, format, squareLayout) {
  const module = device.createShaderModule({ code });
  return device.createRenderPipeline({
    layout: "auto",
    vertex: { module, entryPoint: "showVertex", buffers: [squareLayout] },
    fragment: { module, entryPoint: "showFragment", targets: [{ format }] },
    primitive: { topology: "triangle-list" },
  });
}

// Three height arrays that take turns: one step ago, now, and the one being made
export const heightBuffers = (gpu, device, cells) =>
  [0, 1, 2].map(() => gpu.storageBuffer(device, new Float32Array(cells)));

// Bind groups for each way the three arrays can be taking turns. `fixed` is a list of
// {binding, resource} that never change. `slots` says which array goes where, as
// {binding: offset}: offset 0 is the array that is "one step ago" in turn 0, 1 the
// next, and so on round. Group r is for turn r.
export function turnGroups(device, pipeline, heights, fixed, slots) {
  return [0, 1, 2].map((r) =>
    device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        ...fixed,
        ...Object.entries(slots).map(([binding, offset]) => ({
          binding: Number(binding),
          resource: { buffer: heights[(r + offset) % 3] },
        })),
      ],
    }),
  );
}

// The slots every kernel uses: step reads before and now and writes after, splash
// adds to before and now, and show draws now
export const stepSlots = { 2: 0, 3: 1, 4: 2 };
export const splashSlots = { 2: 0, 3: 1 };
export const showSlots = { 3: 1 };

// The uniform buffer for the Params struct, written by field name. Fields left out are
// zero.
export function paramBlock(device) {
  const size = 64 + maxSplashes * 16;
  const buffer = device.createBuffer({
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const bytes = new ArrayBuffer(size);
  const u32 = new Uint32Array(bytes);
  const f32 = new Float32Array(bytes);
  const at = {
    width: [u32, 0],
    height: [u32, 1],
    courant2: [f32, 2],
    sponge: [f32, 3],
    edge: [f32, 4],
    screenX: [u32, 5],
    sourceX: [u32, 6],
    sourceStart: [u32, 7],
    rampSteps: [f32, 8],
    sourceAmp: [f32, 9],
    sourceOmega: [f32, 10],
    gain: [f32, 11],
    splashCount: [u32, 12],
  };
  return {
    buffer,
    // values: {field: number, ..., splashes: [[x, y, height, radius], ...]}
    write(values) {
      u32.fill(0);
      for (const [name, value] of Object.entries(values)) {
        if (name === "splashes") {
          u32[at.splashCount[1]] = value.length;
          value.forEach((s, n) => f32.set(s, 16 + 4 * n));
        } else {
          const [array, index] = at[name];
          array[index] = value;
        }
      }
      device.queue.writeBuffer(buffer, 0, bytes);
    },
  };
}

// The paddle's forcing for waves of a given wavelength (in cells), as fields for
// paramBlock.write: the Courant number C is the cells a ripple travels in one step
export const paddle = ({ C, wavelength, amplitude }) => ({
  rampSteps: (3 * wavelength) / C,
  sourceAmp: (4 * Math.PI * C * C * amplitude) / wavelength,
  sourceOmega: (2 * Math.PI * C) / wavelength,
});

// The tank's damping: a wave crosses the beach once and is gone
export const beach = ({ C, width }) => ({ courant2: C * C, sponge: 0.3 * C, edge: width });
