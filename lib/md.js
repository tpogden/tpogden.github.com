// Helpers shared by the molecular-dynamics posts (Jiggling Atoms, Falling Atoms,
// Is Energy Conserved?, Solid Liquid Gas, Brownian Motion). Import from an {ojs}
// cell with:
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
//   exclude:  circles [{ x, y, radius }] that no centre may land in, for example
//             to leave room for a large particle added afterwards
export function randomGas({
  count,
  box: [Lx, Ly],
  temperature,
  periodic = [true, true],
  margin = 0,
  minDistance = 0.9,
  exclude = [],
}) {
  const min2 = minDistance * minDistance;
  const positions = new Float32Array(count * 2);
  for (let k = 0; k < count; ) {
    const x = Math.random() * Lx;
    const y = margin + Math.random() * (Ly - 2 * margin);
    let ok = exclude.every((c) => {
      let dx = x - c.x;
      let dy = y - c.y;
      if (periodic[0]) dx -= Lx * Math.round(dx / Lx);
      if (periodic[1]) dy -= Ly * Math.round(dy / Ly);
      return dx * dx + dy * dy > c.radius * c.radius;
    });
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

  return { positions, velocities: gaussianVelocities(count, temperature) };
}

// Gaussian velocities for `count` particles, 2D, with the mean removed and rescaled
// so the mean kinetic energy per particle is exactly `temperature` (<v^2> = 2 T).
export function gaussianVelocities(count, temperature) {
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
  return velocities;
}

// A perfect triangular lattice (the 2D crystal) of nx x ny particles, alternate
// rows shifted by half a spacing, with Gaussian velocities. `ny` must be even for
// it to tile across a periodic boundary. Returns the box it exactly fills.
export function triangularLattice({ nx, ny, spacing, temperature }) {
  const rowSpacing = (spacing * Math.sqrt(3)) / 2;
  const count = nx * ny;
  const positions = new Float32Array(count * 2);
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const k = iy * nx + ix;
      positions[2 * k] = (ix + 0.5 * (iy % 2) + 0.25) * spacing;
      positions[2 * k + 1] = (iy + 0.5) * rowSpacing;
    }
  }
  return {
    positions,
    velocities: gaussianVelocities(count, temperature),
    box: [nx * spacing, ny * rowSpacing],
  };
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

// Draws every particle as a disc of diameter sigma, from the position storage
// buffer (box coordinates; `box` is [Lx, Ly]). The rim is anti-aliased about one
// pixel wide using fwidth and alpha blending.
//
// Colour is the particle's speed (from `velocityBuffer`) on a blue-to-red ramp, or,
// if `colour` is given, any per-particle f32 buffer mapped linearly from `range`
// onto a `low`-to-`high` ramp:
//
//   md.discs(device, { format, positionBuffer, velocityBuffer, box });
//   md.discs(device, { format, positionBuffer, box,
//                      colour: { buffer, range: [0, 1], low: [r, g, b], high: [r, g, b] } });
//
// The buffer can be an f32 per particle (the default), a vec2f, or a vec4f, so a
// post can pack several per-particle quantities into one storage binding:
// `layout: "vec4"` with `component` (scalar mode) or `components: [order, angle]`.
//
// Or `colour: { buffer, mode: "orientation" }`, where the buffer holds a vec2f per
// particle, (order, angle): the hue is the angle (0 to 1, wrapping), and the
// saturation and brightness rise with the order, so crystal grains show as
// vivid patches whose colour is their orientation and disordered atoms fade to grey.
//
// If the box changes while running, pass `boxBuffer` (a uniform buffer holding two
// f32, [Lx, Ly]) instead of `box`, and rewrite it whenever the box changes.
//
// The first particle (index 0) can be drawn larger and in a colour of its own, for
// example a big particle in a bath of small ones: `firstDiameter` in sigma, and
// `firstColour` as [r, g, b].
//
// then, inside a render pass:  discs.draw(pass, count);
export function discs(
  device,
  {
    format,
    positionBuffer,
    velocityBuffer,
    box: [Lx, Ly] = [1, 1],
    boxBuffer,
    referenceSpeed = 1.5,
    colour,
    firstDiameter = 1,
    firstColour,
  }
) {
  // The box is a constant in the shader, or a uniform when it can change
  const boxDecl = boxBuffer
    ? "@group(0) @binding(2) var<uniform> boxSize: vec2f;"
    : `const L = vec2f(${Lx}, ${Ly});`;
  const boxLet = boxBuffer ? "let L = boxSize;" : "";
  const cold = colour?.low ?? [0.35, 0.5, 0.8];
  const hot = colour?.high ?? [1.0, 0.282, 0.204]; // #FF4834
  const [lo, hi] = colour?.range ?? [0, referenceSpeed];
  const orientation = colour?.mode === "orientation";
  // The colour buffer holds an f32, a vec2f (order, angle) or a vec4f per particle.
  // With a vec4f, `component` says which one is the scalar to map onto the ramp, and
  // in orientation mode `components` are the indices of [order, angle].
  const layout = colour?.layout ?? (orientation ? "vec2" : "f32");
  const element = { f32: "f32", vec2: "vec2f", vec4: "vec4f" }[layout];
  const source = colour
    ? `@group(0) @binding(1) var<storage, read> values: array<${element}>;`
    : "@group(0) @binding(1) var<storage, read> velocities: array<vec2f>;";
  const at = (k) => (layout === "f32" ? "values[i]" : `values[i][${k}]`);
  const [orderAt, angleAt] = colour?.components ?? [0, 1];
  const value = colour ? at(colour.component ?? 0) : "length(velocities[i])";
  const first = firstColour ?? [0, 0, 0];
  const hasFirstColour = firstColour ? "true" : "false";

  const module = device.createShaderModule({
    code: `
      ${boxDecl}

      @group(0) @binding(0) var<storage, read> positions: array<vec2f>;
      ${source}

      // Hue, saturation, value (each 0 to 1) to RGB
      fn hsv(h: f32, s: f32, v: f32) -> vec3f {
        let k = vec3f(1.0, 2.0 / 3.0, 1.0 / 3.0);
        let p = abs(fract(vec3f(h) + k) * 6.0 - vec3f(3.0));
        return v * mix(vec3f(1.0), clamp(p - vec3f(1.0), vec3f(0.0), vec3f(1.0)), s);
      }

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
        ${boxLet}
        // Box coordinates to clip space; the radius is sigma / 2
        let centre = positions[i] / L * 2.0 - 1.0;
        // The first particle may be larger, so the radius is per particle
        let radius = select(1.0, f32(${firstDiameter}), i == 0u) / L;

        ${
          orientation
            ? `let order = smoothstep(0.5, 0.92, ${at(orderAt)});
        let t = 0.0;`
            : `let t = clamp((${value} - ${lo}) / (${hi} - ${lo}), 0.0, 1.0);`
        }
        let cold = vec3f(${cold[0]}, ${cold[1]}, ${cold[2]});
        let hot = vec3f(${hot[0]}, ${hot[1]}, ${hot[2]});

        var out: Frag;
        out.position = vec4f(centre + corner * radius, 0.0, 1.0);
        out.uv = corner;
        out.colour = mix(cold, hot, t);
        ${
          orientation
            ? `out.colour = hsv(${at(angleAt)}, 0.9 * order, 0.42 + 0.58 * order);`
            : ""
        }
        if (${hasFirstColour} && i == 0u) {
          out.colour = vec3f(${first[0]}, ${first[1]}, ${first[2]});
        }
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
      { binding: 1, resource: { buffer: colour ? colour.buffer : velocityBuffer } },
      ...(boxBuffer ? [{ binding: 2, resource: { buffer: boxBuffer } }] : []),
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
