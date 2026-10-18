# Moving Figures: Trefethen's 13

Design notes, 2026-10-18. Follows `moving-figures-ideas.md`, section B. Source list: <https://web.stanford.edu/class/cme324/classics/>.

**Decision (2026-10-18):** this is not a standalone series. Each paper is absorbed into whichever arc needs it, when that arc needs it, and is pointed out in the post (see section 6). Arcs interleave and posts take the next number. So the paper-by-paper plans in section 5 are the content of those posts, and the order in section 6 is the order the arcs happen to reach each paper, not a schedule of its own.

The aim is posts that are visually interesting, interactive, narrative-led and well cited, in the same register as 000 to 017.

**Fact status.** Claims marked ✔ were checked against a source in this session. Claims marked ? come from memory and must be checked before they go in a post. Nothing marked ? should ship unverified.

## 1. The list, and where it came from

- Compiled by Nick Trefethen (then Cornell) after teaching CS 722, "Classic Papers in Numerical Analysis", Spring 1993. He sent it to the NA-Net mailing list in May 1993. ✔
- The seminar met weekly, built around one paper each. Students took roles: a **Historian**, a **Mathematician**, two **Experimentalists** (computer demonstrations, usually in Matlab) and the **Professor** (closing remarks). ✔
- The page says the papers fall into three groups: finite algorithms for finite problems, infinite algorithms for infinite problems, and infinite algorithms for finite problems. ✔ I did not get which paper sits in which group; check before using the grouping.
- Metropolis is not on the list. ✔

**Narrative device worth stealing:** the four seminar roles are a ready-made post skeleton and a nice nod to the source. See section 3.

## 2. What "interesting, interactive, narrative-led, well cited" should mean here

Taken from what the existing posts already do (016 and 017 are the model):

- **Open with a failure or a question from the previous post**, not with the paper. Each paper exists because something did not work.
- **One picture that carries the idea**, live, from the first screen. A reader who never touches a control should still see the point.
- **Few controls, good defaults, a "Try these" list** that tells the reader what to break.
- **An Analysis section** under the sim, with charts that measure what the pictures show (error against N, iteration counts, order of accuracy).
- **Show-code fold** for the algorithm, as now.
- **Honest about the limits**: say plainly where the demo simplifies the paper.

What is new for this series:

1. **The paper is a character.** Each post names the paper, the year, the problem the authors were stuck on, and what they actually wrote. Keep quotation under 15 words (copyright), and paraphrase the rest.
2. **Every post answers three questions:** what could people not do before this? what did the paper do? what do we do with it now? The third ties the 1950s paper to something the reader uses today (FFT in audio, SVD in recommendation, multigrid in simulation).
3. **A "Sources" section** with the primary paper (DOI), one or two secondary history sources, and anything the sim implements. Distinguish primary from secondary.

## 3. Post template (the four strands)

This follows the general rule in `moving-figures-ideas.md`, "How every post works": history, maths, physics or other application, and computer science, woven together. The seminar's two Experimentalists map onto the last two strands.

| Section | Strand (role) | Content |
|---|---|---|
| Opening | History (Historian) | The problem as the authors faced it, in a few paragraphs, with sources |
| The sim | Application (Experimentalist) | The interactive picture of what the algorithm is used for, with "Try these" |
| The idea | Maths (Mathematician) | The one equation or recurrence, explained against the picture; no more than a screen |
| How it runs | Computer science (Experimentalist) | Data layout, parallelism, cost; the show-code fold; what the GPU makes cheap or hard |
| Analysis | Application and computer science | Charts measuring the claim (scaling, error, iterations) |
| Closing | Professor | What it led to; what the paper got wrong or left out; link to the next post |
| Sources | | Primary paper with DOI, secondary sources, further reading |

For a numerical-analysis paper the "application" strand is whatever the method is used for: the PDE, the chemistry, the image, the particles. Name it early so the reader knows why the algorithm exists.

The table is a skeleton, not a list of headings: the post should still read as one story, with the strands interleaved. Use the role names in at most one or two places.

## 4. Citation mechanics

Existing MF posts have no references section. Research posts link to sources inline. Options:

| Option | Pros | Cons |
|---|---|---|
| **Quarto citeproc with one shared `.bib`** (`[@cooley1965]`, auto bibliography) | One source of truth; consistent formatting; reusable across posts | Needs testing with the shadow-dir symlinks (the repo notes `_posts/_metadata.yml` does not cascade); path to the `.bib` must resolve from the shadow dir |
| Hand-written "Sources" list with DOI links | Zero tooling risk; matches existing posts | Easy to drift; no shared keys |

Recommendation: try citeproc with a root-level `lib/mf.bib` (or `_metadata.yml` at the repo root, which is the effective one), tested with a single-file build first. Fall back to hand-written lists if the symlinks break it. The `.bib` also doubles as the audit list for the ? items in this note.

Rules for sources:

- Link the DOI or publisher page. Link the Stanford PDF too if it is a clean copy, but do not host copies (copyright).
- Prefer a primary source for each hard date, and a named historian for each story (Heideman et al. for Gauss and the FFT, Stewart for the SVD, Golub and O'Leary for CG, and so on).
- If a story only exists on a wiki or a blog, either find a primary source or leave it out.
- Verify against the paper itself for what it claims. The 1952 CG paper, for example, does not describe CG as we know it.

## 5. Paper by paper

Difficulty: S = a weekend, M = a week, L = a big build. "GPU" says whether the sim needs the GPU or whether the GPU is just a good fit.

### T1. Cooley & Tukey (1965), FFT

*Math. Comp.* 19, 297 to 301.

- **Story:** Gauss had the algorithm around 1805, working out the orbit of an asteroid, and never published it in his lifetime. ✔ (Heideman, Johnson & Burrus, "Gauss and the history of the fast Fourier transform", 1984, with a longer 1985 version in the *Archive for History of Exact Sciences*; the venue and year vary across sources, so cite from the paper itself.) Runge and König (1924) and Danielson and Lanczos are earlier pieces. ✔ The Garwin story (a push from a physicist who wanted fast spectra, linked to nuclear test detection) is widely told but I did not confirm it. ? Source to check: Cooley's own "How the FFT gained acceptance" or his IBM account of the rediscovery.
- **Picture:** draw a waveform and see its spectrum live; then a 2D image and its 2D FFT, with a paintable mask (blur, sharpen, remove a stripe). The butterfly network drawn as the algorithm runs, for N = 8 or 16.
- **Interactive:** draw or choose a signal; slider for N; toggle between the naive DFT and the FFT with a cost counter. Analysis: operation count against N on log axes (N² vs N log N), with measured GPU time.
- **GPU:** Stockham radix-2 or radix-4 in workgroup memory. This builds `lib/fft.js`, which waves (ship wakes), cosmology and the NLSE all need. Difficulty M, and it is the most reused piece in the whole programme.
- **Sources:** Cooley & Tukey 1965; Heideman, Johnson & Burrus 1984; Cooley's reminiscences.

### T2. Courant, Friedrichs & Lewy (1928), difference methods

*Math. Ann.* 100, 32 to 74. English translation: *IBM J. Res. Dev.* 11 (1967), 215 to 234 (DOI 10.1147/rd.112.0215), with a companion review by Lax in the same issue. ✔

- **Story:** it was written to prove that solutions of PDEs exist, using difference equations as a tool. The stability condition fell out as a necessary requirement for convergence: the numerical domain of dependence must contain the true one. ✔ This was long before computers, which is the fun fact. A 1956 AEC report translation by Phyllis Fox also circulated. ✔
- **Picture:** the 1D wave equation on a grid, with the physical light cone and the numerical stencil's cone drawn over it. Raise the timestep past the limit and the cone no longer covers: the solution blows up in a visible sawtooth.
- **Interactive:** a pulse; slider for the Courant number; toggle for a scheme (upwind, Lax-Friedrichs, leapfrog). Analysis: the amplification factor against the Courant number.
- **Plan:** it began as a section of the ripple tank post and became its own post, 020 "Too Big a Step" (the Courant slider, a measured growth-per-step chart against the von Neumann prediction, the stencil diamond, and a note that stable is not the same as accurate). Difficulty S. Needs the 2D stencil from 018.
- **Sources:** CFL 1967 translation; Lax 1967 review; the Springer volume *The CFL Condition: 80 Years After Its Discovery* ✔ (listed; not read).

### T3. Householder (1958), QR by reflections

*J. ACM* 5, 339 to 342. ?

- **Story:** the problem is that Gram-Schmidt loses orthogonality on hard matrices. ? Source needed: Householder's paper, plus Trefethen & Bau, *Numerical Linear Algebra* (1997), which covers it and is the natural secondary source.
- **Picture:** a vector in 2D or 3D mirrored onto an axis by a reflection plane you can drag; repeat for each column. Beside it, the columns of a matrix being made orthogonal.
- **Interactive:** choose the matrix's conditioning (a Hilbert-like matrix, with a slider for size); race classical Gram-Schmidt against Householder. Analysis: the loss of orthogonality, ‖QᵀQ − I‖, against condition number.
- **GPU:** not needed. This is the weakest GPU fit, so keep it light and honest: CPU JavaScript is fine. Difficulty S to M.
- **Link:** the QR algorithm for eigenvalues (Francis 1961) is a separate story and not in this paper. Do not conflate them.

### T4. Curtiss & Hirschfelder (1952), stiff equations

*Proc. Natl. Acad. Sci.* 38, 235 to 243 (DOI 10.1073/pnas.38.3.235). ✔

- **Story:** they were doing chemical kinetics and found that explicit methods failed on reactions where fast components reach equilibrium almost instantly while slow ones barely move. ✔ They named the property "stiffness". ✔ Why that word was chosen: not found. ? The stability explanation (Dahlquist, 1963) is the follow-on. ✔
- **Picture:** a reacting system with a fast and a slow species; the fast one collapses onto a slow manifold in an instant, and an explicit solver zigzags or explodes unless the step is tiny.
- **Interactive:** stiffness slider; step size slider; explicit Euler vs RK4 vs backward Euler, plotted on the same axes. The stability region in the complex plane with the point λh moving in and out. Analysis: steps needed against stiffness for each method.
- **GPU:** not needed. Pair with T11 as a two-parter (see below). Difficulty M.
- **Sources:** the 1952 paper; Söderlind's work on the history of stiffness (his talk on the evolution of the concept was found; find the matching paper); Hairer & Wanner, *Solving ODEs II*.
- **Check:** the Robertson problem and Gear's BDF methods are my additions. ? Verify before using.

### T5. de Boor (1972), B-splines

*J. Approx. Theory* 6, 50 to 62. ? Cox published the same recurrence independently (*J. Inst. Math. Appl.*). ? Both need checking.

- **Story:** "spline" is a draftsman's tool, a flexible strip held by weights. Schoenberg (1946) gave the mathematical name. ? The recurrence is stable and cheap, which is what made B-splines usable by everyone. de Casteljau (Citroën) and Bézier (Renault) worked on the same family in the 1960s from the car-body side. ?
- **Picture:** a curve you shape by dragging control points, with the basis functions drawn underneath, each lighting up where it contributes. The de Boor recurrence animated as repeated linear interpolation.
- **Interactive:** degree slider (1 to 5); open vs clamped knot vectors; drag a knot to see local control (only a few basis functions move). Optional: a simulated flexible strip with weights, to show the physical spline settling to a minimum of bending energy, which links to T6.
- **GPU:** not needed; this is a canvas post. Difficulty S. A 3D tensor-product surface is an optional extension.
- **Sources:** de Boor 1972; Cox 1972; Schoenberg 1946; de Boor, *A Practical Guide to Splines*.

### T6. Courant (1943), finite elements by variational methods

*Bull. Amer. Math. Soc.* 49, 1 to 23. ?

- **Story:** Courant proposed piecewise-linear trial functions on triangles for a torsion problem, using Rayleigh-Ritz. ✔ He presented it in 1941; the paper is 1943. ✔ Hrennikoff (1941) took the lattice route. ✔ The engineering take-up came from Turner, Clough, Martin & Topp (1956) at Boeing. ✔ Clough gave the method its name in 1960. ✔ (sources differ; 1960 is the safe date). Good narrative: the mathematics existed years before engineers needed it. Check that "Courant 1943 was mostly ignored" is true before saying it. ?
- **Picture:** draw a shape; it is meshed into triangles; the drum's vibration modes appear and animate (Kac's "can you hear the shape of a drum"). Alternatively a torsion bar, as in the paper, coloured by stress.
- **Interactive:** paint a domain; mesh-size slider; pick a mode. Analysis: error in the lowest eigenvalue against mesh size, showing the convergence rate.
- **GPU:** assembly and a sparse eigen or Poisson solve. Use CG on the GPU (T9) and share the code. Difficulty L, because of the mesher. A fixed structured triangulation is a fair first version.
- **Sources:** Courant 1943; Turner et al. 1956; Clough 1960; Clough & Wilson (1999), "Early finite element research at Berkeley"; the "Eighty Years of the Finite Element Method" survey ✔ (listed; arXiv 2107.04960).

### T7. Golub & Kahan (1965), SVD

*SIAM J. Numer. Anal.* Ser. B 2, 205 to 224. ?

- **Story:** the SVD was known since Beltrami (1873), Jordan, Sylvester, Schmidt and Weyl. ✔ (Stewart, "On the early history of the singular value decomposition", *SIAM Review* 35 (1993), 551 to 566.) What Golub & Kahan supplied was a stable way to compute it, using Householder reflections to bidiagonalise. ✔ (the Householder link is stated in a secondary source, the details need the paper). Nice thread back to T3.
- **Picture 1:** drag a 2×2 matrix and watch the unit circle become an ellipse, with the singular vectors as its axes. **Picture 2:** an image with a rank slider; the singular-value spectrum drawn beside it.
- **Interactive:** rank slider on an image (draw your own, or pick one); the pseudo-inverse as least squares for a line fit with noise. Analysis: reconstruction error against rank, and its relation to the singular values (Eckart-Young).
- **GPU:** the one-sided Jacobi SVD (Hestenes, 1958) is parallel-friendly, and the name rhymes with T9 (Hestenes again). ? Verify before using the Hestenes connection. Difficulty M.
- **Sources:** Golub & Kahan 1965; Stewart 1993 ✔; Golub & Van Loan, *Matrix Computations*.

### T8. Brandt (1977), multigrid

*Math. Comp.* 31, 333 to 390. ✔

- **Story:** Fedorenko described a two-grid iteration around 1962 and a multigrid algorithm in 1964; Bakhvalov extended it in 1966. ✔ (dates vary by source; use the 1964 paper as the safe citation.) Brandt made it practical, showed its results on realistic problems, and laid out the principles in 1977. ✔ Hackbusch found it independently and gave the theory. ✔ So this is a **discovery that took a decade and three people** story, with the paper as the clear exposition. The "multi-level adaptive technique" name traces to a 1972 conference paper, not the 1977 paper. ✔
- **Picture:** a 2D Poisson problem solved by Jacobi: the error field smooths quickly, then crawls. The same problem under multigrid, with the error at each level drawn in a stack of grids.
- **Interactive:** a slider for the wavenumber of the initial error, showing that high wavenumbers die fast under relaxation and low ones barely move. Switch between Jacobi, Gauss-Seidel and a V-cycle. Analysis: residual against iteration, and against work units, as grid size grows.
- **GPU:** strong fit; restriction and prolongation are simple kernels. Difficulty M. Shares the grid code with the waves arc.
- **Sources:** Brandt 1977; Fedorenko 1964; Bakhvalov 1966; Briggs, Henson & McCormick, *A Multigrid Tutorial*; Hackbusch 1985.

### T9. Hestenes & Stiefel (1952), conjugate gradients

*J. Res. Natl. Bur. Stand.* 49, 409 to 436. ✔

- **Story:** devised independently by Hestenes and Stiefel and merged into one paper at the Institute for Numerical Analysis; Lanczos had a closely related method. ✔ It was first read as an unstable direct method, and only seen as an iterative method later (Engeli et al.). ✔ Wide use came in the mid-1970s. ✔ (Golub & O'Leary, "Some history of the conjugate gradient and Lanczos algorithms: 1948 to 1976", *SIAM Review* 31 (1989).) The Reid (1971) revival is widely told but not confirmed here. ? A 20-year wait for computers to catch up is also reported. ✔
- **Picture:** contours of a 2D quadratic. Steepest descent zigzags; CG finishes in two steps. A slider for the condition number stretches the ellipse and makes the zigzag worse.
- **Interactive:** then scale up: the Poisson problem from T8 with CG, and the iteration count growing like √κ. Race Jacobi, steepest descent, CG and multigrid on the same problem. Analysis: residual curves for all four.
- **GPU:** strong; needs dot products (reductions) and a sparse matvec. Difficulty M.
- **Sources:** Hestenes & Stiefel 1952; Golub & O'Leary 1989 ✔; Shewchuk, "An Introduction to the Conjugate Gradient Method Without the Agonizing Pain" (1994), also the best model for how to teach it.

### T10. Fletcher & Powell (1963), quasi-Newton

*Comput. J.* 6 (1963/64), 163 to 168. ✔

- **Story:** it is really Davidon's method. Davidon wrote it up as Argonne report ANL-5990 (May 1959, revised November 1959), after a 1957 journal submission was rejected, partly for lacking convergence proofs. ✔ (Davidon's own 1991 account, published in *SIAM J. Optim.* 1, 1 to 17.) Powell obtained a copy of the report in 1962 after spotting a reference to it. ✔ Fletcher and Powell showed it was much faster and more reliable than existing methods, and the formula is named DFP for the three. ✔ Strong narrative: a rejected idea, then a lucky find. BFGS (1970) later replaced DFP. ?
- **Picture:** Rosenbrock's banana valley. The method learns the curvature as it goes, drawn as an ellipse (the current inverse-Hessian estimate) that rotates and stretches towards the true one.
- **Interactive:** pick a landscape; race steepest descent, momentum, DFP and BFGS from the same start. Analysis: function value against iteration. Bridge: this is where the ML arc picks up (SGD, Adam), so link forward.
- **GPU:** not needed for 2D. Optional: many starting points in parallel, coloured by where they end (a basin picture). Difficulty S to M.
- **Sources:** Fletcher & Powell 1963; Davidon 1991 ✔; Nocedal & Wright, *Numerical Optimization* (the origin account appears in chapter 6 ✔).

### T11. Wanner, Hairer & Nørsett (1978), order stars

*BIT* 18, 475 to 489. ?

- **Story:** the abstract one. A new geometric tool, the order star, gives short proofs of results that were hard (Ehle's conjecture, bounds on A-stable methods). ? Need a primary source for what exactly it proved. Pair with T4 as a "part two": stiffness says what we need (A-stability), order stars say what is possible.
- **Picture:** a rational approximation to eᶻ plotted in the complex plane; the region where |R(z)e⁻ᶻ| > 1 forms "fingers" at the origin. The number of fingers is tied to the order.
- **Interactive:** choose a Padé approximant (degree numerator, denominator); watch the star's fingers grow with the order; overlay the A-stability region. Analysis: order of accuracy measured on a test ODE against step size.
- **GPU:** it is a per-pixel complex function: a perfect fragment-shader picture, hence a good fit for the site. Difficulty S for the picture, L for the narrative; this is the hardest post to make accessible. Honest approach: treat it as a gallery plus one theorem, not a derivation.
- **Sources:** the 1978 paper; Iserles & Nørsett, *Order Stars* (1991); Hairer & Wanner, *Solving ODEs II*.

### T12. Karmarkar (1984), interior-point LP

*STOC '84; also Combinatorica 4 (1984), 373 to 395.* ?

- **Story:** Karmarkar, at Bell Labs, presented it in April 1984 at STOC. ✔ It was claimed to be about 50 times faster than simplex on the largest problems. ✔ Press coverage, including the front page of *The New York Times*, followed. ✔ (the Times piece itself not found.) Independent tests found the iteration counts were as predicted, but each iteration was expensive. ✔ AT&T filed for a patent in 1985 (US 4,744,026); the software-patent argument it caused is part of the story. ✔ The result reignited interior-point research that had a precursor in Khachiyan's 1979 ellipsoid method, which also got press. ? Check Khachiyan's coverage before mentioning it.
- **Picture:** a 2D or 3D polytope with an objective. Simplex crawls along the edges; the interior-point path cuts through the middle, following the central path as a barrier weight shrinks.
- **Interactive:** drag the objective's direction; step through both methods; barrier-weight slider; for a random LP of growing size, compare the number of steps. Analysis: iterations against problem size, showing simplex's growth against the interior-point method's near flatness.
- **GPU:** not needed. Canvas or WebGL. Difficulty M.
- **Sources:** Karmarkar 1984; Wright, *Primal-Dual Interior-Point Methods* (1997); Margaret Wright, "The interior-point revolution in optimization", *Bull. AMS* 42 (2005). ? Verify the last one.

### T13. Greengard & Rokhlin (1987), fast multipole

*J. Comput. Phys.* 73, 325 to 348. ✔

- **Story:** from Greengard's Yale thesis, "The Rapid Evaluation of Potential Fields in Particle Systems", which won an ACM Distinguished Dissertation award. ✔ Rokhlin's 1985 paper on integral equations is a root. ✔ Barnes & Hut (1986, *Nature*) is the closer rival: same quadtree, but forces from mass and centre of mass only, where the FMM carries a full multipole expansion. ✔ (Barnes-Hut dates from my memory ?). It was named one of the top ten algorithms of the century, which comes from the Dongarra & Sullivan list in *Computing in Science & Engineering* (2000). ? Some sources credit IEEE or SIAM; cite the primary article.
- **Picture:** particles in a quadtree. Click a target and see which cells it sees as near (exact) and which as far (summarised), shaded by level. Then a mass moves and the far field updates.
- **Interactive:** theta (opening angle) and expansion order sliders; N slider. Analysis: error against order, and time against N for direct, Barnes-Hut and FMM on log axes.
- **GPU:** the near field reuses the cell lists in `md.js`. Barnes-Hut is the practical first step and FMM the second. Difficulty L. A follow-up to 006 (Falling Atoms) and 010 (Twenty Thousand Atoms).
- **Sources:** Greengard & Rokhlin 1987; Barnes & Hut 1986; Dongarra & Sullivan 2000; Greengard's thesis.

## 6. Where each paper lives, and how it is pointed out

### Host arcs

Each paper goes in the arc where the problem it solves first bites. "Tentative" means no arc is a natural fit yet; the fallback is a short stand-alone post or a section of a neighbouring one.

| Paper | Host arc | Where it bites | Status |
|---|---|---|---|
| T2 CFL | Waves | The timestep blows up. Written as its own post, 020 "Too Big a Step", after the ripple tank (018) and the slits (019), with a measured growth-per-step chart against the predicted curve | done (drafted) |
| T1 FFT | Waves (ship wakes) | Deep-water dispersion is non-local and needs a spectral method; also feeds cosmology and the NLSE | natural |
| T6 FEM | Waves, after the ripple tank | Drum and membrane modes on a drawn shape | natural |
| T8 multigrid, T9 CG | Numerical electrodynamics (electrostatics) or cosmology | A Poisson solve that relaxation cannot finish | natural, either host |
| T13 FMM | Computational cosmology (N-body) | O(N²) gravity stops scaling; sequel to 006 and 010 | natural |
| T7 SVD, T3 Householder | ML / deep learning | Low-rank structure, PCA; T3 as a section inside the SVD post | natural |
| T10 quasi-Newton | ML / deep learning | Optimisers on a loss landscape, next to SGD and Adam | natural |
| T4 stiff, T11 order stars | Optics (Maxwell-Bloch) or FPU/Toda | Fast relaxation against slow dynamics; T11 as a section of T4 | tentative |
| T12 Karmarkar | ML / optimisation | Another way down a landscape | tentative |
| T5 B-splines | Mazes (smoothing a solved path) or ML (curve fitting) | A lighter post; no strong hook | tentative |

### Pointing them out

The paper should not be a hidden reference. Two small pieces, both optional until the first post needs them:

1. **A callout in the post** near the top, in the Historian voice: "Trefethen's 13, no. 9: Hestenes & Stiefel, 1952", linking to the paper's citation and to a list page.
2. **A list page** (or a Quarto category such as `trefethen`) that shows the 13 papers, ticked off as they appear and linking to the post that covers each. This also shows readers where the list came from and which papers are still waiting.

The callout needs one small shared snippet so that its look and wording stay consistent. Test it through the shadow dirs, as with the bibliography.

### Clusters, for when two papers land close together

Some papers pair naturally, and when the arcs reach them they can share a post or sit in neighbouring ones:

| Cluster | Papers | Reason |
|---|---|---|
| **The error that will not die** | T8 multigrid, T9 CG, T6 FEM | One Poisson problem, three solvers; the FEM gives the matrices |
| **Stiffness** | T4 stiff, T11 order stars | What we need, then what is possible |
| **Matrices** | T3 Householder, T7 SVD | The SVD is computed with Householder: a direct link |
| **Optimisation** | T10 quasi-Newton, T12 Karmarkar | Two ways down a landscape; leads into the ML arc |
| **Waves and Fourier** | T1 FFT, T2 CFL | Share infrastructure with the waves arc |
| **Many bodies** | T13 FMM | Sequel to the MD arc |
| **Curves** | T5 B-splines | Stand-alone, and the lightest post |

The earlier standalone order, kept for reference because the agreed host-arc order follows it closely (the user said it "adds narrative along the way"): CFL, FFT, multigrid then CG, SVD then Householder, quasi-Newton then Karmarkar, stiff then order stars, B-splines, FEM, fast multipole. Inside each arc the same logic holds: a paper arrives when the previous one has left a problem standing.

Reasonable to merge T3 into T7 and T11 into T4, which makes 11 posts for 13 papers.

## 7. Shared infrastructure to build

| Module | Used by | Notes |
|---|---|---|
| `lib/fft.js` | T1, cosmology, ship wakes, NLSE | Stockham, workgroup memory, 1D and 2D |
| `lib/grid.js` (2D stencil, ping-pong textures, boundary masks) | T2, T8, T9, waves arc, FDTD | Probably starts in 018 |
| Reductions (dot products, norms) | T9, T7 | Needed for CG |
| `lib/sparse.js` (CSR matvec) | T6, T9 | Only if FEM goes ahead |
| `lib/quadtree.js` | T13 | Builds on `md.js` cell lists |
| Complex-function shader helper | T11, T4 | Per-pixel complex arithmetic |
| `lib/mf.bib` and a citation test | all | See section 4 |

## 8. Risks and open questions

- **Citation tooling:** citeproc through the shadow-dir symlinks needs a test build. Decide this before writing post 1.
- **Verification debt:** every ? above needs a primary or named secondary source. Treat T1, T5, T10 and T12 stories as the highest value (and highest risk).
- **Uneven GPU fit:** T3, T4, T5 and T12 do not need a GPU. Decide whether the series stays strictly "WebGPU" or allows plain canvas posts. Recommendation: allow them, since the title is Moving Figures, not "WebGPU".
- **Audience:** T11 (order stars) and T6 (FEM) are the hardest to make accessible. Consider making them optional or shorter.
- **Numbering and interleaving:** decided. Posts take the next number, and arcs interleave.
- **Absorbed, not a series:** decided. The open part is the pointer: callout only, or callout plus a list page or category (section 6). Recommend both, as the list page is what makes the 13 read as a thread.
- **Tentative hosts:** T4/T11, T12 and T5 have no natural arc yet. Decide later, once the arcs they would sit in are drafted; a stand-alone post is the fallback.
- **Scope check with you:** should the closing section of each post say what the paper got wrong or left out? That is the "Professor" role and I think it adds a lot, but it needs more reading per post.
