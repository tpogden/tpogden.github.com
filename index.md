---
layout: home
title: Tommy Ogden
---

<section>
<h4>Blogposts</h4>
<dl>
{% for post in site.posts %}
{% unless post.tags contains "pennine-way" %}
<dt>
<a href="{{ post.url }}">{{ post.title }}</a>
</dt>
<dd class="stamp">
{{ post.date | date: "%Y-%m-%d" }}
</dd>
{% endunless %}
{% endfor %}
</dl>
</section>
