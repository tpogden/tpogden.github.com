---
layout: note
title: The Pennine Way
location: Manchester
category: notes
published: true
description:
permalink: /pennine-way/
---

<aside>¹ The distance varies in each account I read (paths are fractal-like and
difficult to measure), but 429km (268 statute miles) is what the National Trails
guide reckons so I’ll go with that. According to my feet, it’s a long
way.</aside>

<p>In the spring of 2009, I walked the 429km¹ of the Pennine Way, a national
trail along the hills of northern England, in 15 days.</p>

<p>Setting off from Derbyshire, I hiked over the Peak District moors into East
Lancashire; through the Yorkshire Dales into County Durham and Westmorland;
along Hadrian’s Wall and through the Kielder Forest in Northumberland; finally
traversing the Cheviot Hills to cross the border into Scotland two weeks
later.</p>

<aside class="sidebox">

    <h1>Itinerary</h1>

    <ul>
        {% for post in site.tags.pennine-way reversed %}
        <li><a href="#{{ post.slug }}">{{ post.title }}</a></li>
        {% endfor %}
    </ul>

</aside>

<p>I camped along the way; carrying my tent, sleeping bag and stove on my back.
Happily I was joined by my dad for two days, and my friend Jim for another two.
The rest of the time, I was on my own.</p>

{% for post in site.tags.pennine-way reversed %}

<h2 id="{{ post.slug }}">{{ post.title }}</h2>
<aside class="stamp">{{  post.date | {{ post.date | date:"%Y-%m-%d" }}</aside>

{{ post.content}}
{% endfor %}
