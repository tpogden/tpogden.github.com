---
layout: note
title: Moldy Argon II&#58; Atoms in Motion
location: Manchester
category: notes
published: false
description: Lorem ipsum
---

<style>

/*  body {
    background-color: rgba(245,243,242,1);
    font-family: "Helvetica", sans-serif;
    font-size: 10px;
    margin: 8px;
  }*/

  .svg-canvas {
    background-color: white;
    border: solid 1px rgba(208,199,198,1);
  }

  .axis {
    font: 10px sans-serif;
  }

  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .circle {

    fill: rgba(189,54,19,1);
    stroke: white;

  }

  .play path {
    stroke: rgba(255,255,255,1);
    stroke-width: 16px;
    /*fill: black;*/
  }

  .play:hover path {
    fill: rgba(189,54,19,1);
  }

  .play rect {
    fill: none;
    pointer-events: all;
    cursor: pointer;
  }

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<aside class="sidebox">

    <h1>Moldy Argon</h1>

    <ul>
        <li><a href="">I. Introduction</a></li>
        <li><a href="">II. Atoms in Motion</a></li>
    </ul>

    <ul>
            <li>&rarr; <a href="https://github.com/tommyogden/moldy-argon">Moldy Argon on Github</a></li>
    </ul>
</aside>

## Object Model

The model is simple, we have two classes of object:

- Atoms: a collection of atoms, with arrays representing their masses, positions and velocities. The Atoms class contains methods to move the atoms around and calculate forces between them.
- Sim: a simulation, containing an Atoms object and the current time of the simulation. The Sim class contains methods to run the simulator and to save results data to file.

<aside>Maybe `Atoms` should have a collective name like `AtomCollection` or `Ensemble` but Atoms works for me to remember where the atoms are.</aside>

The first thing we want to do is decide on the spatial dimensions of our simulation, which we'll do by setting a box length member for Sim. The simulation will then represent a cube (or square in 2D) defined by `box_length`. Then we give the atoms some positions within that box. We don't know, of course, how the atoms will be distributed to begin with so we'll just throw them into the box randomly.

<figure>
{% highlight cpp %}
 int Atoms::set_pos_random(float box_length_i) {
  ArrayXXf rand_pos(num_dims_, num_atoms_);
  rand_pos.setRandom(); rand_pos = rand_pos*box_length_i/2.0;
  set_pos(rand_pos);
  return 0;
}
{% endhighlight %}
<figcaption>Listing 1: Setting the atom positions with a random distribution within the box.</figcaption>
</figure>

The result of that distribution might look something like this.

<figure>
<script src="/assets/notes/moldy-argon-2/js/moldy-argon-2-1.js"></script>
<figcaption>Fig 1:50 atoms given a uniform random distribution in a box of length 10. Note that a random distribution does not mean <em>evenly</em> spaced. Click on the box to generate a new distribution.</figcaption>
</figure>

## Temperature & Maxwell-Boltzmann Distributions

## Dynamics

<script src="/assets/notes/moldy-argon-2/js/moldy-argon-2-2.js"></script>

## Boundary Conditions

{% highlight cpp %}
// TODO: Doc
int Atoms::apply_toroidal_box_bc(float box_length_i) {
  for (int idx = 0; idx < num_atoms_; idx++) {
    for (int d = 0; d < num_dims_; d++) {
      if (pos_.col(idx)[d] < -box_length_i/2) // Low boundary in each dim
        pos_.col(idx)[d] = box_length_i/2;
      else if (pos_.col(idx)[d] > box_length_i/2) // High boundary in each dim
        pos_.col(idx)[d] = -box_length_i/2;
    }
  }
  return 0;
}
{% endhighlight %}

## (Conclusions)