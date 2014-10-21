---
layout: note
title: Moldy Argon I&#58; Introduction
location: Manchester
category: notes
published: true
description: Lorem ipsum
---

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

I'm starting a little computational physics hobby project, and I'm going to write about it here as I code. The idea is to build a molecular dynamics model, a key tool in simulating statistical physics. For simplicity, I'm going to ignore any internal degrees of freedom in the molecule (vibration, rotation), which is reasonable if we're modelling an inert element like argon. So the project's called *Moldy Argon*, with a [nod][peaches].

Why do I want to write a molecular dynamics simulator? 

1. This is a field I've worked and [published][nitrate] in but isn't what I research now. It will be useful to document some of what I know to refer back to. 
2. Thinking about what readers of *A blog about doing physics with computers* might be interested in, one useful thing I can do is write a good introduction for anyone new to the subject.
3. Visualising molecules bouncing around is fun, and I want to try that in-browser.

<!-- <aside>&nbsp;</aside> -->

## What is Molecular Dynamics?

<aside>
&lsquo;It all works because Avogadro's number is closer to infinity than to ten.&rsquo; I'm fond of Ralph Baierlein's quip on thermal physics because it&rsquo;s a mathematical horror, but physically astute.
</aside>

Avogadro tells us that any macroscopic bit of matter, like the hot cup of tea sat here on my desk, contains a huge (on the order of $10^{23}$) number of molecules. To model every possible way all these molecules can be arranged, yet alone track how they behave, is clearly impossible. 


<aside>
This is the same principle of getting from a sample of microscopic trajectories to macroscopic behaviour I introduced in my post on <a href="/random-walks">random walks</a>.</aside>

But don't worry, there's a way around this. After Boltzmann we know that the thermodynamic properties of the tea are a result of the statistical aggeragation of the molecules&rsquo; motion. By taking some small subset of the possible states of the molecules in the tea and taking averages, we can get a good quantitative understanding of how it behaves. I can simulate the tea as I drink it.

The idea is to use a computer to solve Newton's equations of motion for a sample of the interacting molecules. Work started with the advancement of computers in the late 1950s, and a [paper][rahman] by A. Rahman in 1964 was the first to use smoothly varying potentials, modelling 864 particles of liquid argon. This project will be something of an homage to that work.

<figure>
<img class="text-framed" src="/assets/notes/moldy-argon-1/rahman.png" />
<figcaption>A Rahman. <a href="http://journals.aps.org/pr/abstract/10.1103/PhysRev.136.A405">Correlations in the Motion of Atoms in Liquid Argon</a>. <em>Phys. Rev</em>, 136 (2A):405–411, 1964</figcaption>
</figure>

## Skateboards

One thing before we start. It's an idea from a talk by an engineer at Spotify on how they build products.

<figure>
<img class="text-framed" src="/assets/notes/moldy-argon-1/spotify-build.png" />
<figcaption>How <a href="https://labs.spotify.com/">Spotify</a> builds a product. I can&rsquo;t find the original source of this slide. If you see it on your travels let me know so I can properly credit.</figcaption>
</figure>

I'll try to work to this principle. In the next post we'll get a basic molecular dynamics simulator up and running. Let's build a skateboard.

{% include send-comments.html %}

[peaches]: http://en.wikipedia.org/wiki/The_Moldy_Peaches_(album)
[nitrate]: http://tommyogden.com/nitrate/
[wiki-md]: http://en.wikipedia.org/wiki/Molecular_dynamics
[rahman]: http://journals.aps.org/pr/abstract/10.1103/PhysRev.136.A405