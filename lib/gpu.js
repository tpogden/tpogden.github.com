// Shared WebGPU boilerplate for the Moving Figures posts. Import it from an {ojs}
// cell with:
//   const gpu = await import(new URL("../lib/gpu.js", document.baseURI).href);

// Canvas, adapter, device, context and preferred format. The canvas is scaled to
// fill its column, and its aspect ratio is width:height.
//
//   resolution: "fixed" (default)  the drawing buffer is width x height, however
//                                  large the canvas is displayed
//               "auto"             the drawing buffer follows the displayed size
//                                  times devicePixelRatio (capped at maxWidth), so
//                                  it stays sharp on large and high-density screens
export async function setup({
  width = 640,
  height = 480,
  resolution = "fixed",
  maxWidth = 2048,
} = {}) {
  if (!navigator.gpu) throw new Error("WebGPU is not supported in this browser.");
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  if (resolution === "auto") {
    new ResizeObserver(() => {
      const w = Math.min(Math.round(canvas.clientWidth * devicePixelRatio), maxWidth);
      if (w > 0 && w !== canvas.width) {
        canvas.width = w;
        canvas.height = Math.round((w * height) / width);
      }
    }).observe(canvas);
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No WebGPU adapter is available.");
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format });
  return { canvas, device, context, format };
}

// A storage buffer initialised from a typed array. COPY_SRC lets it be copied into
// a staging buffer and read back (see the Reading Back post).
export function storageBuffer(device, data) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

// A unit square (two triangles, corners at +-1) to instance once per particle,
// and the vertex-buffer layout that goes with it.
export function unitSquare(device) {
  const corners = new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]);
  const buffer = device.createBuffer({
    size: corners.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, corners);
  return buffer;
}

export const squareLayout = {
  arrayStride: 2 * 4,
  attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
};

// Standard alpha blending for a render target, so a fragment's alpha (for example
// a soft anti-aliased edge) mixes with what is already on the canvas.
export const alphaBlend = {
  color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
  alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
};

// Begin a render pass that clears the canvas to the series background, #1a1a1a.
export function beginRenderPass(encoder, context) {
  return encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.102, g: 0.102, b: 0.102, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
}

// Call `frame(ms)` before every repaint until the cell re-runs or the page goes
// away (`invalidation` resolves), then stop and free the device.
export function run(invalidation, device, frame) {
  let running = true;
  invalidation.then(() => {
    running = false;
    device.destroy();
  });
  function tick(ms) {
    if (!running) return;
    frame(ms);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
