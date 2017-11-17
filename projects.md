---
layout: projects
title: Projects
permalink: /projects/
---

<h1>{{ page.title }}</h1>

<h4>Research</h4>

{% for post in site.tags.physics %}

<h3><a href="{{ post.url }}">{{ post.title }}</a></h3>

<p class="description">{{ post.description }}</p>

{% endfor %}