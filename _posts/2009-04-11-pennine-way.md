---
layout: note
title: The Pennine Way
location: Manchester
category: notes
published: true
description:
permalink: /pennine-way/
redirect_from:
  - /pennine-way/edale-to-crowden/
  - /pennine-way/crowden-to-blackstone-edge/
  - /pennine-way/blackstone-edge-to-ponden/
  - /pennine-way/ponden-to-gargrave/
  - /pennine-way/gargrave-to-malham/
  - /pennine-way/malham-to-horton-in-ribblesdale/
  - /pennine-way/horton-in-ribblesdale-to-hardraw-force/
  - /pennine-way/hardraw-force-to-tan-hill/
  - /pennine-way/tan-hill-to-middleton-in-teesdale/
  - /pennine-way/middleton-in-teesdale-to-dufton/
  - /pennine-way/dufton-to-alston/
  - /pennine-way/alston-to-greenhead/
  - /pennine-way/greenhead-to-bellingham/
  - /pennine-way/bellingham-to-byreness/
  - /pennine-way/byreness-to-kirk-yetholm/
  - /notes/edale-to-crowden/
  - /notes/crowden-to-blackstone-edge/
  - /notes/blackstone-edge-to-ponden/
  - /notes/ponden-to-gargrave/
  - /notes/gargrave-to-malham/
  - /notes/malham-to-horton-in-ribblesdale/
  - /notes/horton-in-ribblesdale-to-hardraw-force/
  - /notes/hardraw-force-to-tan-hill/
  - /notes/tan-hill-to-middleton-in-teesdale/
  - /notes/middleton-in-teesdale-to-dufton/
  - /notes/dufton-to-alston/
  - /notes/alston-to-greenhead/
  - /notes/greenhead-to-bellingham/
  - /notes/bellingham-to-byreness/
  - /notes/byreness-to-kirk-yetholm/
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

    <h4>Itinerary</h4>

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
<aside class="stamp">{{  post.date | date:"%Y-%m-%d" }}</aside>

{{ post.content}}
{% endfor %}
