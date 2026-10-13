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
  enableRecording(canvas);
  return { canvas, device, context, format };
}

// Clip recording, for sharing a canvas as a short video. Open a post with `?record`
// (or `?record=12` for 12 s instead of the default 8 s), then press R to record the
// canvas and download it. Chrome gives MP4 directly; otherwise it is WebM, which
//   ffmpeg -i in.webm -c:v libx264 -crf 22 -pix_fmt yuv420p out.mp4
// converts. Does nothing without the `?record` flag, so published pages are unchanged.
// `setup` calls this; the early posts that do not use `setup` call it themselves.
export function enableRecording(canvas) {
  const params = new URLSearchParams(location.search);
  if (!params.has("record")) return;
  const seconds = Number(params.get("record")) || 8;
  let recording = false;

  const onKey = (event) => {
    if (event.key.toLowerCase() !== "r" || event.metaKey || event.ctrlKey) return;
    if (!canvas.isConnected) return removeEventListener("keydown", onKey);
    if (recording) return;
    recording = true;
    record(canvas, seconds).finally(() => (recording = false));
  };
  addEventListener("keydown", onKey);
  console.info(`Recording enabled: press R to capture ${seconds} s of the canvas.`);
}

async function record(canvas, seconds) {
  const type = ["video/mp4;codecs=avc1", "video/webm;codecs=vp9", "video/webm"].find((t) =>
    MediaRecorder.isTypeSupported(t),
  );
  const recorder = new MediaRecorder(canvas.captureStream(60), {
    mimeType: type,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const stopped = new Promise((resolve) => (recorder.onstop = resolve));

  const badge = Object.assign(document.createElement("div"), { textContent: "● REC" });
  badge.style.cssText =
    "position:fixed;top:12px;right:12px;z-index:9999;padding:4px 10px;border-radius:4px;" +
    "background:#c00;color:#fff;font:600 13px system-ui";
  document.body.append(badge);

  recorder.start();
  const start = performance.now();
  const timer = setInterval(() => {
    const left = Math.max(0, seconds - (performance.now() - start) / 1000);
    badge.textContent = `● REC ${left.toFixed(1)} s`;
  }, 100);
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  clearInterval(timer);
  recorder.stop();
  await stopped;
  badge.remove();

  const ext = recorder.mimeType.includes("mp4") ? "mp4" : "webm";
  const slug = location.pathname.split("/").filter(Boolean).pop() || "canvas";
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })),
    download: `${slug}.${ext}`,
  });
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
}

// A storage buffer initialised from a typed array. COPY_SRC lets it be copied into
// a staging buffer and read back (see the "Is Energy Conserved?" post).
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
//
// While the page is hidden (another tab, a minimised window) no frames are run and
// nothing is scheduled: a simulation here is GPU compute, and left running in the
// background it would keep the GPU busy for a page nobody is looking at. It picks
// up again from the current state when the page is shown. Time-based code should
// not assume frames are evenly spaced: after a pause the first `ms` is much later.
export function run(invalidation, device, frame) {
  let running = true;
  let scheduled = false;

  function schedule() {
    if (running && !scheduled && !document.hidden) {
      scheduled = true;
      requestAnimationFrame(tick);
    }
  }

  function tick(ms) {
    scheduled = false;
    if (!running || document.hidden) return; // `visibilitychange` restarts the loop
    frame(ms);
    schedule();
  }

  document.addEventListener("visibilitychange", schedule);
  invalidation.then(() => {
    running = false;
    document.removeEventListener("visibilitychange", schedule);
    device.destroy();
  });
  schedule();
}

// Read GPU buffers back to JavaScript. A buffer the shaders write cannot be mapped
// for reading directly, so each region is copied into a staging buffer (back to
// back) and that is mapped. Mapping is asynchronous and only resolves once the GPU
// has finished the work queued before the copy, so do this every few frames, not
// every frame.
//
//   const rb = gpu.readback(device, [
//     { buffer: positionBuffer, bytes: count * 8 },      // offset defaults to 0
//     { buffer: velocityBuffer, bytes: count * 8 },
//   ]);
//   // in the frame, before submitting:
//   const sample = !rb.pending && ++frames % 30 === 0;
//   if (sample) rb.copy(encoder);
//   // after submitting:
//   if (sample) rb.read((buffer) => { /* ArrayBuffer; rb.offsets are byte offsets */ });
//
// `copy` must not be recorded while a previous `read` is still pending, hence the
// `pending` check. If the device is destroyed (the cell re-ran) the callback is
// simply never called.
export function readback(device, regions) {
  const offsets = [];
  let size = 0;
  for (const region of regions) {
    offsets.push(size);
    size += region.bytes;
  }
  const staging = device.createBuffer({
    size,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });
  let pending = false;

  return {
    offsets,
    get pending() {
      return pending;
    },
    // Record the copies into `encoder`
    copy(encoder) {
      regions.forEach((region, i) => {
        encoder.copyBufferToBuffer(
          region.buffer,
          region.offset ?? 0,
          staging,
          offsets[i],
          region.bytes
        );
      });
    },
    // Map, copy out, unmap, then call `onData(arrayBuffer)`. Call after submit.
    read(onData) {
      pending = true;
      staging.mapAsync(GPUMapMode.READ).then(
        () => {
          const data = staging.getMappedRange().slice(0);
          staging.unmap();
          pending = false;
          onData(data);
        },
        () => {} // the device was destroyed: nothing to do
      );
    },
  };
}
