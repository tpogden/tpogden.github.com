// Helpers shared by the molecular-dynamics posts (Jiggling Atoms, Falling Atoms,
// Reading Back). Import from an {ojs} cell with:
//   const md = await import(new URL("../lib/md.js", document.baseURI).href);
//
// Deliberately small: the force kernel and the integrator are what those posts
// teach, so they stay in the posts. Reduced units throughout: sigma = epsilon =
// mass = k_B = 1.

import { alphaBlend, squareLayout, unitSquare } from "./gpu.js";

// A gas of `count` particles in a box [0, Lx] x [0, Ly]: random positions that never
// start closer than `minDistance` (so no pair begins with a huge repulsive force),
// and Gaussian velocities with the mean removed and rescaled so the mean kinetic
// energy per particle is exactly `temperature` (in 2D, <v^2> = 2 T).
//
//   periodic: which axes wrap, used for the distance test
//   margin:   keep centres at least this far from the edges (walls), in y only
//             when y is not periodic
export function randomGas({
  count,
  box: [Lx, Ly],
  temperature,
  periodic = [true, true],
  margin = 0,
  minDistance = 0.9,
}) {
  const min2 = minDistance * minDistance;
  const positions = new Float32Array(count * 2);
  for (let k = 0; k < count; ) {
    const x = Math.random() * Lx;
    const y = margin + Math.random() * (Ly - 2 * margin);
    let ok = true;
    for (let j = 0; j < k && ok; j++) {
      let dx = x - positions[2 * j];
      let dy = y - positions[2 * j + 1];
      if (periodic[0]) dx -= Lx * Math.round(dx / Lx);
      if (periodic[1]) dy -= Ly * Math.round(dy / Ly);
      ok = dx * dx + dy * dy > min2;
    }
    if (ok) {
      positions[2 * k] = x;
      positions[2 * k + 1] = y;
      k++;
    }
  }

  const gauss = () =>
    Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
  const velocities = Float32Array.from({ length: count * 2 }, gauss);
  for (let axis = 0; axis < 2; axis++) {
    let mean = 0;
    for (let i = 0; i < count; i++) mean += velocities[2 * i + axis] / count;
    for (let i = 0; i < count; i++) velocities[2 * i + axis] -= mean;
  }
  const meanSquare = velocities.reduce((s, v) => s + v * v, 0) / count;
  const scale = Math.sqrt((2 * temperature) / meanSquare);
  for (let k = 0; k < velocities.length; k++) velocities[k] *= scale;

  return { positions, velocities };
}

// WGSL for per-particle random numbers, to paste into a compute shader with
// `${md.rngWGSL}`. Each particle keeps its own u32 state in a storage buffer:
//   var state = rng[i];  ...  gaussian2(&state) ...  rng[i] = state;
export const rngWGSL = `
      // PCG hash: advance the state, scramble it into a random u32
      fn pcg(state: ptr<function, u32>) -> u32 {
        *state = *state * 747796405u + 2891336453u;
        let word = ((*state >> ((*state >> 28u) + 4u)) ^ *state) * 277803737u;
        return (word >> 22u) ^ word;
      }

      // Two independent standard normal numbers (Box-Muller)
      fn gaussian2(state: ptr<function, u32>) -> vec2f {
        let u1 = (f32(pcg(state) >> 8u) + 0.5) / 16777216.0; // in (0, 1)
        let u2 = (f32(pcg(state) >> 8u) + 0.5) / 16777216.0;
        let radius = sqrt(-2.0 * log(u1));
        let angle = 6.2831853 * u2;
        return radius * vec2f(cos(angle), sin(angle));
      }
`;

// Draws every particle as a disc of diameter sigma, coloured by its speed, from the
// position and velocity storage buffers (box coordinates; `box` is [Lx, Ly]). The
// rim is anti-aliased about one pixel wide using fwidth and alpha blending.
//
//   const discs = md.discs(device, { format, positionBuffer, velocityBuffer, box });
//   ... inside a render pass:  discs.draw(pass, count);
export function discs(
  device,
  { format, positionBuffer, velocityBuffer, box: [Lx, Ly], referenceSpeed = 1.5 }
) {
  const module = device.createShaderModule({
    code: `
      const L = vec2f(${Lx}, ${Ly});

      @group(0) @binding(0) var<storage, read> positions: array<vec2f>;
      @group(0) @binding(1) var<storage, read> velocities: array<vec2f>;

      struct Frag {
        @builtin(position) position: vec4f,
        @location(0) uv: vec2f,
        @location(1) @interpolate(flat) colour: vec3f,
      }

      @vertex
      fn vs(
        @location(0) corner: vec2f,
        @builtin(instance_index) i: u32,
      ) -> Frag {
        // Box coordinates to clip space; the radius is sigma / 2
        let centre = positions[i] / L * 2.0 - 1.0;
        let radius = 1.0 / L;

        let t = clamp(length(velocities[i]) / ${referenceSpeed}, 0.0, 1.0);
        let cold = vec3f(0.35, 0.5, 0.8);
        let hot = vec3f(1.0, 0.282, 0.204); // #FF4834

        var out: Frag;
        out.position = vec4f(centre + corner * radius, 0.0, 1.0);
        out.uv = corner;
        out.colour = mix(cold, hot, t);
        return out;
      }

      @fragment
      fn fs(in: Frag) -> @location(0) vec4f {
        // Square to disc, with a soft rim about a pixel wide: alpha falls from 1 to
        // 0 across the circle's edge (blended, so overlapping squares are fine)
        let d = length(in.uv);
        let alpha = 1.0 - smoothstep(1.0 - fwidth(d), 1.0, d);
        return vec4f(in.colour, alpha);
      }
    `,
  });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module, entryPoint: "vs", buffers: [squareLayout] },
    fragment: {
      module,
      entryPoint: "fs",
      targets: [{ format, blend: alphaBlend }],
    },
    primitive: { topology: "triangle-list" },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: positionBuffer } },
      { binding: 1, resource: { buffer: velocityBuffer } },
    ],
  });

  const cornerBuffer = unitSquare(device);

  return {
    draw(pass, count) {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.setVertexBuffer(0, cornerBuffer);
      pass.draw(6, count); // 6 vertices per square, `count` instances
    },
  };
}
