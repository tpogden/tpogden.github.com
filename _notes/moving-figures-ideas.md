# Moving Figures: ideas

Brainstorm of future series, written 2026-10-18 and updated the same day after the first three waves posts (018 to 020). This file lives in `_notes/` so Quarto ignores it (underscore-prefixed directories are not rendered). Nothing here is committed to; it is a menu.

## Where things stand

Posts 000 to 017 are published, and 018 to 020 are in PR #142:

| Range | Arc |
|---|---|
| 000 to 004 | GPU basics: hello world, animation loop, bouncing particles, compute shader |
| 005 to 012 | Molecular dynamics: Lennard-Jones, gravity, energy conservation, phases, Brownian motion, 20k atoms, weather in a box, blast wave |
| 013 to 017 | Monte Carlo interlude: Buffon's needle, Mandelbrot darts, many-dimensional darts, Metropolis walkers, Ising model |
| 018 to 020 | Waves, first steps: Skimming Stones (a 2D wave tank), Hole in the Wall (one and two slits), A Step too Far (the Courant number) |

Shared code in `lib/`: `gpu.js` (setup, buffers, loop), `random.js` (per-thread RNG, Gaussians), `md.js` (cell lists, MD), `ui.js` (controls, charts).

The waves-to-solitons arc (see memory `moving-figures-waves-to-solitons-plan`) is under way and continues in section A, followed by a later optics arc (NLSE bright solitons, Maxwell-Bloch self-induced transparency). The three tank posts each carry their own copy of the engine (the height arrays, the step kernel and the beaches). As with `md.js`, extract it into a `lib/` module once a fourth post needs it.

## How every post works: four strands

Prompted by Trefethen's CS 722 seminar, where each paper was covered by a Historian, a Mathematician and two Experimentalists (computer demonstrations), then closed by the Professor. This applies to all Moving Figures posts, not only the Trefethen papers. Each post weaves four strands into one story:

| Strand | Seminar role | What it brings |
|---|---|---|
| **History** | Historian | Who was stuck on what, when, and what they did about it; sourced |
| **Maths** | Mathematician | The one idea or equation that makes it work, explained against the picture |
| **Physics, or the other application** | Experimentalist | What the system does and why anyone cares: the waves, the magnet, the galaxy, the classifier |
| **Computer science** | Experimentalist | How the algorithm is built and why it suits the GPU: data layout, parallelism, cost, where it breaks |

The Professor's closing is the fifth beat: what it led to, and what was left out or got wrong.

The strands are not sections. A post should interleave them (a historical hook, then the physics picture, then the maths that explains what is on screen, then the code that makes it fast), the way 016 and 017 already do informally. The test for a draft: can each strand be pointed to, and does each one set up the next?

Some arcs lean on one strand more than the others (the waves arc on physics, Trefethen's papers on history and maths, mazes and deep learning on computer science). That is fine as long as none is missing.

## House style, learned from 018 to 020

- **One idea per post, few controls.** 018 began as one post with stones, a plane wave, slits, a lens, rain, a beaches switch and a Courant slider. It became three posts and lost rain, the beaches switch and the lens. When a post feels like too much, split it (the early molecular dynamics posts were built up the same way). Two to five controls is the range.
- **The chart sits under the canvas, not far below.** Put the Analysis charts directly after the simulation, ahead of the text that explains them, short enough that canvas and chart can be seen together. A second picture that reacts to a slider (the stencil diamond in 020) belongs beside the chart.
- **Measure the claim.** Each post has a chart that measures what the picture shows and sets it against a prediction: the ring height against 1/sqrt(r) (018), the pattern on the far wall against the Fraunhofer formula (019), the growth per step against the von Neumann curve (020). Check the numbers in the browser before writing the text around them.
- **Maths in the open.** Equations and calculations are ordinary sections, not collapsed boxes.
- **At least one source per post,** in a Sources section, with only the date that matters (the publication date) and "around" where a date is loose. Check any story against a primary or named secondary source before it goes in, and leave it out if it cannot be checked. Where a Trefethen paper is the topic, add the "Trefethen's 13, no. N" callout.
- **Leave the reveal to the explanation.** In 020 the limit (1/sqrt(2)) is not named until the section that explains it. Do not give the answer away in the controls text or the chart text.
- **No forward-looking comments** ("a later post explains", "next time"). A short "We'll find out why later" is fine when the reader needs it.
- **Voice.** Few commas (keep one after an opening date when a name follows), no semicolons, no Oxford commas. Titles are playful (Skimming Stones, Hole in the Wall, A Step too Far) and the page addresses stay descriptive.
- **Testing.** Run each post in the browser with the page-visibility workaround in CLAUDE.md. A pane that is not painting throttles the frame loop, so a real-time check can look broken when it is not.

## Series at a glance

| # | Series | Size | Needs first | Reuses |
|---|---|---|---|---|
| A | Waves to solitons | 3 of about 8 done (018 to 020) | none | `gpu.js` stencils |
| B | Trefethen's 13 (absorbed into other arcs, flagged in each) | 13 papers across ~11 posts | varies | MD, FFT, stencils |
| C | Numerical electrodynamics (FDTD) | 4 to 5 posts | the tank and slits (018, 019) | 2D stencil |
| D | Computational cosmology | 3 to 4 posts | FFT post, gravity (006) | `md.js`, FFT |
| E | From Metropolis to ML | 5 to 7 posts | Ising (017) | `random.js` |
| F | Deep learning | 5 to 8 posts | a backprop kernel post | new GPU code |
| G | Bayesian statistics | 3 to 5 posts | Metropolis (016) | `random.js` |
| H | Quantum Monte Carlo (path integrals) | 3 to 4 posts | Metropolis (016) | `md.js` springs |
| I | Maze algorithms | 3 to 4 posts | none | `random.js` |
| J | Durham project-book picks | mixed | varies | varies |

## A. Waves to solitons

Done, in PR #142 (page addresses are `webgpu-ripple-tank`, `webgpu-two-holes-in-a-wall`, `webgpu-courant-number`):

| # | Post | Picture | Idea |
|---|---|---|---|
| 018 | Skimming Stones | click or drag to drop stones; two rings crossing | 2D stencil, interference, why a ring fades as 1/sqrt(r); source: d'Alembert 1747 |
| 019 | Hole in the Wall | a plane wave through one slit or two | diffraction and the double slit, measured against the Fraunhofer formula; Huygens and Young |
| 020 | A Step too Far | the tank blowing up, with the stencil diamond beside the chart | the Courant number and the stability limit; Trefethen no. 2 |

Still to do. Numbers are provisional because arcs interleave and a new post takes the next number:

| Post | Picture | Idea |
|---|---|---|
| Ship wakes | V-shaped Kelvin wake | dispersion alone (deep water is non-local: needs the FFT post first, or a stated simplification). Opens with what 018 left out: every wavelength moves at the same speed in the tank, but not in real water |
| Waves on a beach | depth shelf, steepening, breaking | nonlinearity alone |
| Scott Russell's canal | long channel and piston | nonlinearity and dispersion cancel: a soliton |
| Soliton collisions | overtaking, head-on, 2D KP line solitons | pass through with a phase shift |
| Sine-Gordon in 2D | ring kinks on a pendulum surface | topological soliton |
| FPU / Toda | particle chain | recurrence; bridge back to MD |

Side posts the first three suggested:

- **Refraction, a lens of shallow water.** Prototyped in 018 and cut (commit 7adcdcc): a depth field that slows the waves, so a plane wave bends and focuses. It fits the beach and shoaling posts.
- **Numerical dispersion.** 020 ends on "safe is not the same as right": even a stable scheme carries short waves too slowly (about 2% for 8 cells to a wavelength, 8% for 4) and a smaller step makes it worse along an axis. This could be a short post of its own, with a measured wave speed against the formula, and it sets up real dispersion in the ship wakes post.
- **Standing waves and drum modes.** With the beaches off the tank turns to a mess; with walls it has modes. This links to finite elements (B6) and to 019's walls.
- **The far field is a Fourier transform.** The pattern on the far wall in 019 is the Fourier transform of the slits. An FFT post (B1) can draw an aperture and show its diffraction pattern, which gives the FFT a physical reason to exist.

Later: NLSE bright solitons (split-step FFT) and Maxwell-Bloch, linking to the existing optical-solitons and simultons posts.

This arc is the foundation for C (FDTD), D (FFT) and the optics arc, so it goes first.

## B. Trefethen's 13 classic papers

Source: <https://web.stanford.edu/class/cme324/classics/>. The list is numerical analysis, so Metropolis is not on it (it belongs to the Dongarra and Sullivan top 10, and already has its own posts). Idea: each post is tied to one paper, with a one-line "why it mattered" and a picture of the algorithm doing its work.

| # | Paper | Topic | GPU and visual fit | Post idea |
|---|---|---|---|---|
| 1 | Cooley & Tukey 1965 | FFT | strong | Done: 021 Fourier's Window (paint a hole and see its diffraction pattern; `lib/fft.js` is the shared 2D FFT for ship wakes, D and the NLSE) |
| 2 | Courant, Friedrichs & Lewy 1928 | finite differences, stability | strong | Done: 020 A Step too Far |
| 3 | Householder 1958 | QR | weak | Possible: Gram-Schmidt vs Householder loss of orthogonality, shown as a drifting basis |
| 4 | Curtiss & Hirschfelder 1952 | stiff ODEs | medium | A stiff chemical oscillator: explicit steps shatter, implicit ones do not |
| 5 | de Boor 1972 | B-splines | medium | Drag control points, watch basis functions; fits a curve-fitting post |
| 6 | Courant 1943 | finite elements | medium | A mesh relaxing under load; membrane vibrations as modes |
| 7 | Golub & Kahan 1965 | SVD | strong | Live low-rank compression of an image or a fluid field with a rank slider |
| 8 | Brandt 1977 | multigrid | strong | Poisson relaxation: the error smooths out, then multigrid kills the long wavelengths. Show the error field at each level |
| 9 | Hestenes & Stiefel 1952 | conjugate gradients | strong | Race against Jacobi on the same Poisson problem; the zigzag of steepest descent vs CG on a 2D quadratic |
| 10 | Fletcher & Powell 1963 | quasi-Newton | medium | Optimisers racing on a 2D landscape; a natural bridge to F |
| 11 | Wanner, Hairer & Nørsett 1978 | order stars | weak | Skip, or one sentence in the stiff-ODE post |
| 12 | Karmarkar 1984 | interior-point LP | weak | A polytope with the path cutting through the interior, in 2D or 3D |
| 13 | Greengard & Rokhlin 1987 | fast multipole | strong | O(N^2) to O(N) gravity; the sequel to 010 and 006, and the cell lists lead straight to it |

Strongest first picks: FFT, multigrid and CG as a Poisson trio, SVD, fast multipole.

## C. Numerical electrodynamics

FDTD on a Yee grid is the EM version of the ripple tank.

1. A dipole antenna radiating: fields E and B on the grid.
2. A waveguide and cutoff frequency.
3. Double slit with real fields, a direct comparison with 019.
4. Absorbing boundaries (PML): the reason waves do not bounce off the edge of the screen.
5. Photonic crystal or a lens: refraction from a dielectric map you can paint.

Connects to the research (Maxwell-Bloch): the final step is putting a two-level medium on the grid.

## D. Computational cosmology

1. Particle-mesh gravity: deposit particles on a grid, solve Poisson with the FFT, interpolate the force back. Needs the FFT post.
2. Structure formation from a Gaussian random field: the cosmic web emerging from tiny initial ripples, in comoving coordinates.
3. Zel'dovich pancake: the 1D collapse that predicts caustics (ties to waves breaking on the beach).
4. Optional: a power-spectrum plot that reads back the clustering, in the Analysis section style.

Fast multipole (B13) is the alternative to particle-mesh and can feed a comparison post.

## E. From Metropolis to ML

The Ising model is a Boltzmann machine without the weights. The path keeps the same idea (sample from exp(-E)) while the application changes.

1. Hopfield network: store a few images as energy minima, retrieve one from a noisy start.
2. Boltzmann machine and Gibbs sampling: learning the weights from data.
3. Simulated annealing: Metropolis with a falling temperature, applied to a travelling-salesman or maze-like landscape.
4. Langevin dynamics: a gradient plus noise (links to 009 Brownian motion).
5. Hamiltonian Monte Carlo: an MD integrator (leapfrog, from 006) used as a sampler. This is a strong link, since the MD code already exists.
6. Score-based diffusion on a 2D toy distribution: the reverse process as Langevin with a learned score.

Cheapest first step after 017: Hopfield.

## F. Deep learning in general

Training a small net in WebGPU is feasible, but backprop needs hand-written kernels, so it needs one heavy up-front post.

1. A tiny MLP on the 2D spiral dataset, with the decision boundary evolving live.
2. Backprop as kernels: the forward and backward passes of a small network, with a gradient check.
3. SGD vs momentum vs Adam on the same loss surface (shares code with B10).
4. A loss-landscape walker: project to two directions and watch the trajectory.
5. Convolution: a hand-built edge detector, then a learned one on a small digit set.
6. Attention on a toy task: attention weights shown as a heatmap.
7. Optional: a transformer on characters. Probably too big, but a good horizon.

Open question: real networks trained in the browser (more credible, more work) vs energy-based models only (E), where most of the GPU code already exists.

## G. Bayesian statistics

Framing: "Metropolis, but for inference rather than physics." A single chain is serial, so the GPU-natural form is thousands of parallel chains, as in the walkers post.

1. A coin's bias: prior, likelihood, posterior, updating as flips arrive.
2. A 2D banana-shaped posterior sampled by Metropolis; why step size matters.
3. Gibbs vs Metropolis vs HMC on a correlated Gaussian.
4. Model comparison and the evidence; nested sampling as an optional extension.
5. Supernova cosmology (Durham chapter 9): fitting the matter and dark-energy densities by MCMC, bridging to D.

## H. Quantum Monte Carlo

Path-integral Monte Carlo of the harmonic oscillator: a ring polymer of beads, where the ground-state density emerges from sampled paths. This is Durham chapter 16 in a new form.

1. Harmonic oscillator: beads, spring terms, and the probability density appearing.
2. Temperature: shrink the ring and the quantum-to-classical crossover is visible.
3. Double well: tunnelling as paths crossing the barrier.
4. Optional: bosons, with exchange as polymer cross-linking.

Reuses the spring and chain machinery from `md.js`, and links to the FPU / Toda post (a particle chain).

## I. Maze algorithms

- Generation is mostly serial (recursive backtracker, Wilson, Kruskal). GPU options include Borůvka-style component merging and cellular-automaton mazes.
- Solving is where the wave link appears: breadth-first flood fill is a wavefront, and the fast-marching (eikonal) version is Fermat's principle.
- Wilson's algorithm is loop-erased random walks, so it links to 009 and 016.
- Percolation on a lattice sits next to 017.

Posts: (1) generating mazes with random walks, (2) solving by wavefront, (3) shortest paths as an eikonal wave, (4) optional percolation. A good palate cleanser between heavier arcs.

## J. Durham project booklet (PHYS3561, 2014/15)

Source: `project_book.pdf`, 16 chapters. Only the contents page and chapter 1 were read, so check a chapter for what it actually asks students to do before building on it.

| Ch | Title | Fit |
|---|---|---|
| 1 | Silicon bandstructure | Matrix eigenproblem; low visual payoff |
| 2 | Transmission through a semiconductor barrier | 1D Schrödinger, tunnelling; pairs with H |
| 3 | Simulation of a phase transition | Done in spirit (017) |
| 4 | Colloidal fluids: hard disks and hard spheres | Hard-sphere MC, a natural MD/MC follow-up |
| 5 | Light-matter interactions | Rabi oscillations, Bloch sphere; research overlap |
| 6 | Qubit dynamics and quantum computing | Bloch sphere, gates; research overlap |
| 7 | Solitons | Overlaps arc A |
| 8 | Black hole accretion disc spectrum | Specialised |
| 9 | Supernova cosmology | MCMC fit; see G5 |
| 10 | Gravitational collapse, many bodies | N-body; links to D |
| 11 | Restricted three-body problem | Lagrange points, trajectories; follows 001 and 006 |
| 12 | White dwarfs and neutron stars | Specialised |
| 13 | Resonant scattering | Resonances, 1D scattering |
| 14 | Quarkonium | Specialised |
| 15 | 3-particle quantum mechanics | Few-body QM |
| 16 | Feynman path integral | See H |

## Suggested order

1. Waves arc A: 018 to 021 are done (021 is the FFT post, B1, with the diffraction picture from 019 as its physical reason). Ship wakes is next.
2. The FFT post unlocks ship wakes, D and the NLSE.
3. C (FDTD) while the 2D stencil is fresh, and the Poisson trio (B8, B9) in the same stretch.
4. D (cosmology), using the FFT.
5. E1 (Hopfield), cheap after 017, then the rest of E.
6. H (path-integral MC), sharing a sampler with G.
7. I (mazes) between arcs as a lighter set.
8. F (deep learning) last, as it is the most new code.

## Decisions (2026-10-18)

- **Interleaved**, not strict sequence, so a heavy arc does not stall the site.
- **Numbering:** a new post always takes the next number. Arcs do not get number blocks, so the arc tables above list post titles but their numbers (018 to 024 for waves, etc.) are provisional and will shift as arcs interleave.
- **018 to 020 split** (2026-10-18). The ripple tank became three posts, and the house style above came out of it.
- **Trefethen's 13 (B) is not a standalone series.** Each paper is absorbed into whichever arc needs it, and is pointed out where it appears. See `trefethen-13.md`, section 6, for the paper-to-arc mapping and the pointer.

## Open questions

- For ML (F): train real networks in WebGPU, or keep to energy-based models? Undecided. Not blocking: E (Metropolis to ML) starts with Hopfield either way.
- What comes straight after 020: the FFT post, or a side post (refraction, numerical dispersion) while the tank engine is fresh? An FFT post first keeps ship wakes unblocked.
- Does the Trefethen's 13 pointer need a list page or a category, or is the callout in each post enough? Only 020 has a callout so far.
- When to extract the tank engine into `lib/`: the three posts each carry a copy now. The next one that needs it is the moment.
