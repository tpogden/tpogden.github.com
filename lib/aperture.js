// The gaps in a wall that the Fourier posts draw on: a few presets, each a mask of 1 where
// the wall is open and 0 where it is shut. Import it from an {ojs} cell with:
//   const aperture = await import(new URL("../lib/aperture.js", document.baseURI).href);
//
//   aperture.fill(mask, 512, "two");   // mask: a Float32Array of n * n, row by row

// The slits are tall bars, 80 cells high. Widths and centres (from the middle) are in cells
export const slitHeight = 80;
export const slits = {
  one: { width: 12, centres: [0] },
  two: { width: 8, centres: [-24, 24] },
  grating: { width: 6, centres: [-64, -32, 0, 32, 64] },
};

// Fill `mask` for one of "one", "two", "grating" or "circle". Anything else empties it
export function fill(mask, n, kind) {
  mask.fill(0);
  if (kind === "circle") {
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if ((x - n / 2) ** 2 + (y - n / 2) ** 2 < 40 ** 2) mask[y * n + x] = 1;
      }
    }
  } else if (slits[kind]) {
    const { width, centres } = slits[kind];
    for (const c of centres) {
      for (let y = n / 2 - slitHeight / 2; y < n / 2 + slitHeight / 2; y++) {
        for (let x = n / 2 + c - width / 2; x < n / 2 + c + width / 2; x++) mask[y * n + x] = 1;
      }
    }
  }
}
