---
layout: note
title: Moldy Argon II&#58; Atoms in Motion
location: Manchester
category: notes
published: true
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

We have two classes of object:

- Atoms: a collection of atoms, with their masses, positions and velocities. Methods to move the atoms around and calculate forces between them.
- Sim: a simulation, containing an Atoms object and the current time of the simulation. Methods to run the simulator and to save results data to file.
<aside>
Maybe `Atoms` should have a collective name like `AtomCollection` or `Ensemble` but Atoms seemed to fit best for me to remember where the atoms are.
</aside>

<!-- <figure>
<img class="text-framed" src="/assets/notes/moldy-argon-2/moldy-argon-object-model.png" />
<figcaption>How <a href="https://labs.spotify.com/">Spotify</a> builds a product. I can&rsquo;t find the original source of this slide. If you see it on your travels let me know so I can properly credit.</figcaption>
</figure>
 -->

{% highlight cpp %}
 int Atoms::set_pos_random(float box_length_i) {
  ArrayXXf rand_pos(num_dims_, num_atoms_);
  rand_pos.setRandom(); rand_pos = rand_pos*box_length_i/2.0;    
  set_pos(rand_pos);
  return 0;
}
{% endhighlight %}

<script src="/assets/notes/moldy-argon-2/js/moldy-argon-2-1.js"></script>

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

<script src="/assets/notes/moldy-argon-2/js/moldy-argon-2-2.js"></script>
