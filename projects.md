---
layout: page
title: Projects
permalink: /projects/
---

<h1>{{ page.title }}</h1>

- [MaxwellBloch][mb] --- A Python package for solving the coupled Maxwell-Bloch
  equations describing the nonlinear propagation of near-resonant light through
  thermal atomic vapours.

- [Euler][euler] --- My solutions to [Project Euler][pe] problems.

{% for post in site.tags.physics %}

- <a href="{{ post.url }}">{{ post.title }}</a> --- {{ post.description }}

{% endfor %}

[mb]: https://github.com/tommyogden/maxwellbloch
[euler]: http://tommyogden.com/euler/
[pe]: https://projecteuler.net/
