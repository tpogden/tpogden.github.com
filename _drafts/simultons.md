---
layout: note
title: What is a Simulton?
location: Manchester
category: research
published: true
description:
permalink:
asset_path:
include_math: true
---

In December _Quasisimultons in Thermal Atomic Vapours_, a paper I wrote with
colleagues at Durham QLM, was published in Physical Review Letters. PRL is ranked
first among physics and mathematics journals by the Google Scholar five-year
_h_-index. It was also highlighted by the editors as an Editors’ Suggestion.
According to the letter they sent us to annouce this,

> A highlighted Letter has additional significance, because only about one
> Letter in six is highlighted as a Suggestion due to its particular importance,
> innovation, and broad appeal.

We were pleased with this reception of the work. The research came out of work I
did during my PhD. The first question you might have is 'What is a
quasisimulton?' and the second 'What is significant about it?' I'll try to
answer those questions in this post.

## From Solitons to Simultons

In an earlier post I introduced the concept of an optical soliton: a pulse of 
light that can hold its shape without dispersion and travel at fixed speed over
large distances thorugh a medium that would ordinarily absorb it. If you haven't
read that post yet I would suggest to do that now and come back.

The key concept I introduced in that post was the pulse area

$$
\theta(z)  = \int^\infty_{-\infty} \Omega(z, t) \mathrm{d} t
$$

[has to be 2pi etc.]

A soliton forms in a field consisting of a single frequency of light
near-resonant with the transition in a two-level system, such as
between two electronic excitation levels in an atom.

In 1981, Konopnicki & Eberly showed theoretically that simultaneous optical
solitons can form analytic solutions in a _three-level_ system coupled by a
field containing two near-resonant frequencies, under the condition that the
pulses are matched[^1] and the two transitions have the same oscillator
strength.

A three-level system can be coupled in different ways. We'll consider the _V_
configuration, where the atom has two excited states $\left| 1 \right>$ and
$\left| 2 \right>$, and a single ground state level $\left| 0 \right>$ which is
coupled to both excited states. The field component resonant with $\left| 0
\right> \leftrightarrow \left| 1 \right>$ we'll call $A$ and the field component
resonant with $\left| 0 \right> \leftrightarrow \left| 2 \right>$ we'll call
$B$.

```
|1> ____    ____ |2>
      \      /
    A  \    /  B
        \  /
        ____ |0>
```

[describe vee atom and draw]

$$
\theta(z) = \sqrt{\theta_A(z) + \theta_B(z)} 
$$

[[FIGURE: Simulton propagation, together vs apart]]


These conditions made simultons difficult to realise experimentally, and they
had never been observed in an atomic vapour. [Also no broadening or decay]

What we were able to show in theory, and then with simulations, is that the
conditions were too strict: if the pulses aren't initially matched, the simulton
will bring them together.


If the couplings have different oscillator strengths int can still propagate.

We also added thermal broadening, spontaneous decay and hyperfine pumping, and
the simulton still propagates. Simultons are more robust than we thought!

[[FIGURE: Solitons to simultons, pulse breakup]]

We also showed that it is not necessary to put in two matched pulses. If one
field is weak continuous wave, and the other is a 2pi pulse, it will 'pick up'
a part of the cw field and carry it along like a surfer on a wave. So we call
these optical surfers.

[[FIGURE: Optical surfer]]

Why is this useful? The simulton area theorem applies just to the pair. One field
can be arbitrarily weak, even a few or one photon. 

If we encode quantum information, say in the polarisation, we could use 
a strong pulse to transmit it through a material that would otherwise absorb it.
[Interacting rydbergs]

- https://physics.aps.org/articles/v12/s143

[^1]: i.e. they have the same time profile
