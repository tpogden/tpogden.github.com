---
layout: home
title: Thomas P. Ogden
---

<section>

{% for post in site.posts  %}
{% unless post.tags contains "pennine-way" %}
    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
    {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
    {% if forloop.first %}
    <h4 id="{{ this_year }}-ref">{{this_year}}</h4>
    <dl>
    {% endif %}
    <dt><a href="{{ post.url }}">{{ post.title }}</a></dt>
    <!-- <dd class="stamp">{{ post.date | date: "%Y-%m-%d" }}</dd> -->
    {% if forloop.last %}
    </dl>
    {% else %}
        {% if this_year != next_year %}
        </dl>
        <h4 id="{{ next_year }}-ref">{{next_year}}</h4>
        <dl>
        {% endif %}
    {% endif %}
{% endunless %}
{% endfor %}

<!-- </section> -->
