---
layout: note
title: What is a Simulton?
location: Manchester
category: research
published: true
description:
permalink:
asset_path: /assets/notes/simultons/
include_math: true
---

<style>
  /* svg {
    background-color: white;
    border: solid 1px rgba(208,199,198,1);
  } */
  .level {
    stroke: #8c8c8c; /* deep-grey */
    stroke-width: 2px;
  }
  .field {
    stroke-width: 2px;
    marker-start: url(#arrow-start);
    marker-end: url(#arrow-end);
  }
  .stroke-red{
    stroke: #c44e52;
  }
  .stroke-green {
    stroke: #55a868;
  }
  .fill-red {
    fill: #c44e52;
  }
  .fill-green {
    stroke: #55a868;
  }
</style>

In December _Physical Review Letters_ published [Quasisimultons in Thermal
Atomic Vapours][prl-simultons], a paper detailing work I did with colleagues at
[Durham Quantum Light and Matter][dqlm]. It was highlighted as an Editors’
Suggestion 'due to its particular importance, innovation, and broad appeal' and
[featured in APS Physics][aps-syn]. We were pleased with this reception of the
work, which came out of my PhD research.

I'll try to answer three questions in this blogpost:

1. What is a simulton?
2. What is a quasisimulton?
3. What is significant about simultons?

## From Solitons to Simultons

In [an earlier post I introduced the concept of an optical soliton](): a pulse
of light that can hold its shape without dispersion and travel at fixed speed
over large distances through a medium that would otherwise absorb it. If you
haven't read that post yet I would suggest to do that now and come back.

The key idea I introduced in that post was the pulse area

$$
\theta(z)  = \int^\infty_{-\infty} \Omega(z, t) \mathrm{d} t.
$$

A pulse with an area of $2\pi$ (the units don't matter for now) will form a
sech-shaped soliton in a field consisting of a single frequency of light
near-resonant with the transition in a two-level quantised system, such as
between two electronic excitation levels in an atom.

In a 1981 paper [Konopnicki & Eberly showed theoretically][ke1981] that it would
be possible for soliton-like pulses to form analytic solutions in a
_three-level_ system coupled by a field consisting of two near-resonant
frequencies, under the condition that the pulses are matched[^1] and the two
transitions have the same oscillator strength.

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<figure>
<script src="/assets/notes/simultons/src/vee-atom.js"></script>
<!-- <figcaption>Hello world.</figcaption> -->
</figure>

A three-level system can be coupled in different ways. Here we'll consider the
_V_ configuration, where the atom has two excited states, $\left| 1 \right>$ and
$\left| 2 \right>$, and a single ground state level $\left| 0 \right>$ which is
coupled to both excited states. The field component resonant with $\left| 0
\right> \leftrightarrow \left| 1 \right>$ we'll call $A$ and the field component
resonant with $\left| 0 \right> \leftrightarrow \left| 2 \right>$ we'll call
$B$.

If we synchronise the input field envelopes $\Omega_A(z=0, t)$ and
$\Omega_B(z=0, t)$ such that 

$$
\Omega_B(0, t) = r\Omega_A(0, t)
$$

for some constant $r$, the three-level system in superposition acts like a
two-level system and the concept of the area theorem then extends to the pair of
field envelopes. If we likewise define the pulse areas of $A$ and $B$ with

$$
\theta_{\{A,B\}}(z) = \int^\infty_{-\infty} \Omega_{\{A,B\}}(z, t) \mathrm{d} t
$$

we can derive a matched pulse area

$$
\theta'(z) = \sqrt{\theta_A^2(z) + \theta_B^2(z)}
$$

where, like a soliton, if the area $\theta'(z) = 2\pi$ the pulse can move
through the atoms unimpeded. But note here that the area theorem applies to the
sum of squares, and looks like the hypotenuse from Pythagora's theorem. This
means we can fix the length of the 'hypotenuse' at $2\pi$ and make $\theta_A(z)$
bigger or smaller like the base of the right-angled triangle.

Let's see what this looks like. In [figure 1](#fig-1) a $\theta_A(z) = 1\pi$
pulse in field $A$ approaches from the left and enters a cell of
$V$-configuration atoms represented by the blue region. There is no matched
pulse in field $B$, so the system acts like a two-level system where the pulse
does not have enough area to propagate as a soliton. The pulse is quickly
absorbed on entry ($z = 0$) and, apart from some small oscillations, no pulse
reaches the back of the medium at the right ($z = 1$).

<figure id="fig-1">
<video class="full" autoplay loop muted>
  <source src="{{ page.asset_path }}src/anim_mbs-vee-sech-sqrt1-sqrt0.mp4" 
    type="video/mp4" />
</video>
<figcaption>
<em>Fig. 1 &mdash; </em> A $1\pi$ pulse in field $A$ (green) 
  propagates through a three-level atomic vapour with V-configuration (blue 
  region).
</figcaption>
</figure>

In [figure 2](#fig-2) the same $\theta_A(z) = 1\pi$ pulse in field $A$
approaches from the left, but this time it is matched with a $\theta_B(z) =
\sqrt{3}\pi$ pulse in field $B$. We see that both pulses travel through the
atoms without absorption and are received at the back of the cell on the right
with the same profile.

<figure id="fig-2">
<video class="full" autoplay loop muted>
  <source src="{{ page.asset_path }}src/anim_mbs-vee-sech-sqrt1-sqrt3.mp4" 
    type="video/mp4" />
</video>
<figcaption>
<em>Fig. 2 &mdash; </em> A $1\pi$ pulse in field $A$ (green) and a
$\sqrt{3}\pi$ pulse in field $B$ (red) propagate through a three-level atomic 
vapour with V-configuration (blue region).
</figcaption>
</figure>

We can understand this result by looking at the matched pulse area:

$$
\theta'(z) = \sqrt{\theta_A^2(z) + \theta_B^2(z)} = \sqrt{1 + 3}\pi = 2\pi.
$$

The two pulses are able to travel together as one _simulton_ connected by
quantum superposition in the three-level atom. Solitons are observed in
classical situations, such as water waves, but simultons are a purely quantal
phenomenon.

## Observing Simultons

The requirement of matched pulses and equal oscillator strengths, along with
some other fairly strict conditions[^cond], made simultons difficult to realise
experimentally, and in nearly 40 years since that original prediction they had
never been observed in an atomic vapour.

What we were able to show in theory and then in simulations like the ones I'm
showing here is that the conditions were too strict. If the pulses aren't
initially matched, the simulton can bring them together. If the couplings have
different oscillator strengths, the simulton can _hold_ them together. The
different oscillator strengths mean that the propagating pulses don't match the
exact Konopnicki & Eberly definition of a simulton, so in the PRL paper we
give the generalised pulses the name _quasisimultons_ to be precise. Here I'll
just call them simultons.

We can see this robustness of simulton propagation in [figure 3](#fig-3). Two
seperate $2\pi$ pulses, one in field $A$ (green) and one in field $B$ (red), are
shown entering the medium. These each have the pulse area to travel individually
as solitons. The $A$ field has a stronger interaction strength[^tdme] and so
travels slower than the $B$ soliton, which catches it up. When the pulses meet
about half way across the medium, they combine. The matched pulse area is now
$4\pi$, so the combined pulse breaks up and forms two $2\pi$ simultons. Note
that the sign of field $A$ has flipped in the later simulton.

<figure id="fig-3">
<video class="full" autoplay loop muted>
  <source src="{{ page.asset_path }}src/anim_mbs-vee-sech-sqrt2-sqrt2-collide.mp4" 
    type="video/mp4" />
</video>
<figcaption>
<em>Fig. 3 &mdash; </em> A $2\pi$ pulse in field $A$ (green) and a
$2\pi$ pulse in field $B$ (red) propagate through a three-level atomic 
vapour with V-configuration (blue region). The $A$ field has a stronger 
interaction with respect to its transitions than the $B$.
</figcaption>
</figure>

We also added thermal broadening, spontaneous decay and hyperfine pumping to the
simulations, and it was still possible for simultons to form. Simultons are
robust!

## Simulton Surfers

Finally, we demonstrated that it is not necessary to put in two matched pulses.
If one field is weak continuous wave and the other is a $2\pi$ pulse, it will
'pick up' a part of the continuous field and carry it along like a surfer on a
wave. So we informally call these _simulton surfers_. An example is shown in 
[figure 4](#fig-4).

<figure id="fig-4">
<video class="full" autoplay loop muted>
  <source src="{{ page.asset_path }}src/anim_mbs-vee-cw-weak-sech-2.mp4" 
    type="video/mp4" />
</video>
<figcaption>
<em>Fig. 4 &mdash; </em> A $2\pi$ pulse in field $A$ (green) and a
weak continuous field $B$ (red) propagate through a three-level atomic 
vapour with V-configuration (blue region).
</figcaption>
</figure>

## What is Significant About Simultons?

Our colleagues in the lab set up an innovative optical experiment with this kind
of simulton surfer configuration and were able to observe simulton formation in
a thermal atomic vapour for the first time since the prediction in 1981.

Simultons promise to open up an interesting domain of research in quantum
technologies. The fact that the simulton area theorem applies to the pulses in
combination gives us an extra degree of freedom. For example, we might make one
field arbitrarily weak, even just a few photons. If we encode quantum
information in the polarisation of a photon, we could use a strong pulse in a
simulton to transmit it through a material that would otherwise absorb it. Using
[Rydberg atom interactions][ca-rydberg], we might then be able to make simultons
interact in a controllable way for use in quantum computation.

[^1]: By matched we mean that they are simultaneous, i.e. have the same time profile.

[^cond]: The analytic model assumed no thermal broadening, which would require the atomic vapour to be close to absolute zero. It also neglected spontaneous decay of the atoms, following the quantum dynamics of a pure state via the Schrödinger equation.

[^tdme]: The interaction strength of a field with an atomic transition is proportional to the square of the [transition dipole moment][tdm].

## References

1. Ogden et al. (2019), _Quasisimultons in Thermal Atomic Vapours_. [Physical
   Review Letters 123 (24)][prl-simultons] | [arXiv:1909.07161][arxiv-simultons]

2. M. J. Konopnicki and J. H. Eberly (1981), _Simultaneous propagation of short 
    different-wavelength optical pulses_. [Physical Review A 24 (5)][ke1981]

[prl-simultons]: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.123.243604
[arxiv-simultons]: https://arxiv.org/abs/1909.07161
[dqlm]: https://www.dur.ac.uk/qlm/
[aps-syn]: https://physics.aps.org/synopsis-for/10.1103/PhysRevLett.123.243604
[tdm]: https://en.wikipedia.org/wiki/Transition_dipole_moment
[ke1981]: https://journals.aps.org/pra/abstract/10.1103/PhysRevA.24.2567
[ca-rydberg]: https://arxiv.org/abs/1907.09231
