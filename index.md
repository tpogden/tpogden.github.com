---
layout: home
title: Tommy Ogden
---

<section>
<h4>Research</h4>
<dl>
{% for post in site.categories.research %}
<dt>
<a href="{{ post.url }}">{{ post.title }}</a>
</dt>
<dd class="stamp">
{{ post.date | date: "%Y-%m-%d" }}
</dd>
{% endfor %}
</dl>
</section>

<section>
<h4>Bookshelf</h4>
<dl>
{% for post in site.categories.bookshelf %}
<dt>
<a href="{{ post.url }}">{{ post.title }}</a>
</dt>
<dd class="stamp">
{{ post.date | date: "%Y-%m-%d" }}
</dd>
{% endfor %}
</dl>
</section>

<section>
<h4>Photo Journal</h4>
<dl>
{% for post in site.categories.photos %}
<dt>
<a href="{{ post.url }}">{{ post.title }}</a>
</dt>
<dd class="stamp">
{{ post.date | date: "%Y-%m-%d" }}
</dd>
{% endfor %}
</dl>
</section>

<section>
<h4>&amp;</h4>
<dl>
{% for post in site.categories.notes %}
<dt>
<a href="{{ post.url }}">{{ post.title }}</a>
</dt>
<dd class="stamp">
{{ post.date | date: "%Y-%m-%d" }}
</dd>
{% endfor %}
</dl>
</section>
