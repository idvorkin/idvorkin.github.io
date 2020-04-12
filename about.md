---
layout: post
permalink: /about
title: "Why?"
tags:
---

Ira Glass, the host of This American Life, eloquently explains this blog's Raison d'Etre in the video below.
<iframe src="https://player.vimeo.com/video/176325518?color=1fc9a2&portrait=0" width="100%" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
Expressed plainly - getting good at hard stuff takes LOTS of practice and LOTS of feedback, during which time the stuff you do will suck.

I want to get great at understanding, reasoning, and presenting ideas, and have no fear of sucking, so I'll use this blog to collect, massage, and present ideas.

This is also my implementation of [evergreen notes](https://notes.andymatuschak.org/z4SDCZQeRo4xFEQ8H4qrSqd68ucpgE6LU155C), which is a very interesting concept that was "discovered" in 2020, where I started in 2013 :)

A few of the posts here will be finished, but most posts will be incomplete, and many will be incoherent. If anything strikes your fancy holler, I'd love to riff on the ideas.

Finally the metaphorical small print: These are my personal opinions, not those of my employer.

{% assign total_words = 0 %}
{% assign total_readtime = 0 %}
{% assign featuredcount = 0 %}
{% assign statuscount = 0 %}

{% for post in site.posts %}
    {% assign post_words = post.content | strip_html | number_of_words %}
    {% assign readtime = post_words | append: '.0' | divided_by:200 %}
    {% assign total_words = total_words | plus: post_words %}
    {% assign total_readtime = total_readtime | plus: readtime %}
    {% if post.featured %}
    {% assign featuredcount = featuredcount | plus: 1 %}
    {% endif %}
{% endfor %}


My name is **Igor Dvorkin**, and this is my personal blog. It currently has {{ site.posts | size }} posts. There are <a href="{{ site.url }}/featured">{{ featuredcount }} featured posts</a>, you should definitely check those out. The most recent post is {% for post in site.posts limit:1 %}{% if post.description %}<a href="{{ site.url }}{{ post.url }}" title="{{ post.description }}">"{{ post.title }}"</a>{% else %}<a href="{{ site.url }}{{ post.url }}" title="{{ post.description }}" title="Read more about {{ post.title }}">"{{ post.title }}"</a>{% endif %}{% endfor %} which was published on {% for post in site.posts limit:1 %}{% assign modifiedtime = post.modified | date: "%Y%m%d" %}{% assign posttime = post.date | date: "%Y%m%d" %}<time datetime="{{ post.date | date_to_xmlschema }}" class="post-time">{{ post.date | date: "%d %b %Y" }}</time>{% if post.modified %}{% if modifiedtime != posttime %} and last modified on <time datetime="{{ post.modified | date: "%Y-%m-%d" }}" itemprop="dateModified">{{ post.modified | date: "%d %b %Y" }}</time>{% endif %}{% endif %}{% endfor %}. The last commit was on {{ site.time | date: "%A, %d %b %Y" }} at {{ site.time | date: "%I:%M %p" }} [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time "Temps Universel Coordonné").

