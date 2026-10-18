# Moving Figures: ideas

Brainstorm of future series, written 2026-10-18. This file lives in `_notes/` so Quarto ignores it (underscore-prefixed directories are not rendered). Nothing here is committed to; it is a menu.

## Where things stand

Posts 000 to 017 are done:

| Range | Arc |
|---|---|
| 000 to 004 | GPU basics: hello world, animation loop, bouncing particles, compute shader |
| 005 to 012 | Molecular dynamics: Lennard-Jones, gravity, energy conservation, phases, Brownian motion, 20k atoms, weather in a box, blast wave |
| 013 to 017 | Monte Carlo interlude: Buffon's needle, Mandelbrot darts, many-dimensional darts, Metropolis walkers, Ising model |

Shared code in `lib/`: `gpu.js` (setup, buffers, loop), `random.js` (per-thread RNG, Gaussians), `md.js` (cell lists, MD), `ui.js` (controls, charts).

Already planned (see memory `moving-figures-waves-to-solitons-plan`): a waves-to-solitons arc, 018 to 024, then a later optics arc (NLSE bright solitons, Maxwell-Bloch self-induced transparency).

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

## Series at a glance

| # | Series | Size | Needs first | Reuses |
|---|---|---|---|---|
| A | Waves to solitons (planned) | 7 posts | none | `gpu.js` stencils |
| B | Trefethen's 13 (absorbed into other arcs, flagged in each) | 13 papers across ~11 posts | varies | MD, FFT, stencils |
| C | Numerical electrodynamics (FDTD) | 4 to 5 posts | ripple tank (018) | 2D stencil |
| D | Computational cosmology | 3 to 4 posts | FFT post, gravity (006) | `md.js`, FFT |
| E | From Metropolis to ML | 5 to 7 posts | Ising (017) | `random.js` |
| F | Deep learning | 5 to 8 posts | a backprop kernel post | new GPU code |
| G | Bayesian statistics | 3 to 5 posts | Metropolis (016) | `random.js` |
| H | Quantum Monte Carlo (path integrals) | 3 to 4 posts | Metropolis (016) | `md.js` springs |
| I | Maze algorithms | 3 to 4 posts | none | `random.js` |
| J | Durham project-book picks | mixed | varies | varies |

## A. Waves to solitons (planned)

| # | Post | Picture | Idea |
|---|---|---|---|
| 018 | Ripple tank | click for pebbles; walls, gap, double slit | 2D stencil, reflection, diffraction, interference |
| 019 | Ship wakes | V-shaped Kelvin wake | dispersion alone (deep water is non-local: needs FFT or a stated simplification) |
| 020 | Waves on a beach | depth shelf, steepening, breaking | nonlinearity alone |
| 021 | Scott Russell's canal | long channel and piston | nonlinearity and dispersion cancel: a soliton |
| 022 | Soliton collisions | overtaking, head-on, 2D KP line solitons | pass through with a phase shift |
| 023 | Sine-Gordon in 2D | ring kinks on a pendulum surface | topological soliton |
| 024 | FPU / Toda | particle chain | recurrence; bridge back to MD |

Later: NLSE bright solitons (split-step FFT) and Maxwell-Bloch, linking to the existing optical-solitons and simultons posts.

This arc is the foundation for C (FDTD), D (FFT) and the optics arc, so it goes first. 018 can carry a "what goes wrong" section on the CFL condition (item B2).

## B. Trefethen's 13 classic papers

Source: <https://web.stanford.edu/class/cme324/classics/>. The list is numerical analysis, so Metropolis is not on it (it belongs to the Dongarra and Sullivan top 10, and already has its own posts). Idea: each post is tied to one paper, with a one-line "why it mattered" and a picture of the algorithm doing its work.

| # | Paper | Topic | GPU and visual fit | Post idea |
|---|---|---|---|---|
| 1 | Cooley & Tukey 1965 | FFT | strong | Image filtering and diffraction patterns; the shared FFT module for D and the NLSE |
| 2 | Courant, Friedrichs & Lewy 1928 | finite differences, stability | strong | Fold into 018: raise the timestep until the tank explodes |
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
3. Double slit with real fields, a direct comparison with 018.
4. Absorbing boundaries (PML): the reason waves do not bounce off the edge of the screen.
5. Photonic crystal or a lens: refraction from a dielectric map you can paint.

Connects to the research (Maxwell-Bloch): the final step is putting a two-level medium on the grid.

## D. Computational cosmology

1. Particle-mesh gravity: deposit particles on a grid, solve Poisson with the FFT, interpolate the force back. Needs the FFT post.
2. Structure formation from a Gaussian random field: the cosmic web emerging from tiny initial ripples, in comoving coordinates.
3. Zel'dovich pancake: the 1D collapse that predicts caustics (ties to waves breaking in 020).
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

Reuses the spring and chain machinery from `md.js`, and links to 024 (a particle chain).

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

1. Waves arc A (018 to 024).
2. FFT post (B1), which unlocks ship wakes, D and the NLSE.
3. C (FDTD) while the 2D stencil is fresh, and the Poisson trio (B8, B9) in the same stretch.
4. D (cosmology), using the FFT.
5. E1 (Hopfield), cheap after 017, then the rest of E.
6. H (path-integral MC), sharing a sampler with G.
7. I (mazes) between arcs as a lighter set.
8. F (deep learning) last, as it is the most new code.

## Decisions (2026-10-18)

- **Interleaved**, not strict sequence, so a heavy arc does not stall the site.
- **Numbering:** a new post always takes the next number. Arcs do not get number blocks, so the arc tables above list post titles but their numbers (018 to 024 for waves, etc.) are provisional and will shift as arcs interleave.
- **Trefethen's 13 (B) is not a standalone series.** Each paper is absorbed into whichever arc needs it, and is pointed out where it appears. See `trefethen-13.md`, section 6, for the paper-to-arc mapping and the pointer.

## Open questions

- For ML (F): train real networks in WebGPU, or keep to energy-based models? Undecided. Not blocking: E (Metropolis to ML) starts with Hopfield either way.
