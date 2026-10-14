// Random numbers for the Moving Figures posts, on the GPU. Import from an {ojs} cell
// with:
//   const random = await import(new URL("../lib/random.js", document.baseURI).href);
//
// Every thread (particle, needle, grid cell) keeps its own 32-bit state in a storage
// buffer, advanced by a PCG hash, so there is no shared generator to contend on:
//
//   const state = gpu.storageBuffer(device, random.seeds(count));
//   // in WGSL, with `${random.rngWGSL}` pasted into the shader:
//   var state = rng[i];
//   let u = rand(&state);        // uniform in [0, 1)
//   let g = gaussian2(&state);   // two independent standard normal numbers
//   rng[i] = state;

// WGSL for per-thread random numbers: `pcg`, `rand` and `gaussian2`. Paste into a
// compute shader with `${random.rngWGSL}`.
export const rngWGSL = `
      // PCG hash: advance the state, scramble it into a random u32
      fn pcg(state: ptr<function, u32>) -> u32 {
        *state = *state * 747796405u + 2891336453u;
        let word = ((*state >> ((*state >> 28u) + 4u)) ^ *state) * 277803737u;
        return (word >> 22u) ^ word;
      }

      // A uniform number in [0, 1), with 24 bits of resolution
      fn rand(state: ptr<function, u32>) -> f32 {
        return f32(pcg(state) >> 8u) * (1.0 / 16777216.0);
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

// `count` random 32-bit seeds, one per thread, from the browser's own generator.
// crypto.getRandomValues refuses more than 65,536 bytes a call, so it is filled in
// chunks.
export function seeds(count) {
  const out = new Uint32Array(count);
  const chunk = 8192; // 32 KB
  for (let k = 0; k < count; k += chunk) {
    crypto.getRandomValues(out.subarray(k, Math.min(count, k + chunk)));
  }
  return out;
}
