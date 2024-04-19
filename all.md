---
layout: post
title: All posts
tags: []
---

Here are all the posts

# Production

{% for item in site.posts %}
[{{item.title}}]({{item.url}}) - [{{item.url }}]
{{item.path}}

{% endfor %}

# Drafts

{% for item in site.d %}
[{{item.title}}]({{item.url}}) - [{{item.url }}]
{{item.path}}

{% endfor %}

# Tech Diary

{% for item in site.td %}
[{{item.title}}]({{item.url}}) - [{{item.url }}]
{{item.path}}

{% endfor %}

# Ig66

{% for item in site.ig66 %}
[{{item.title}}]({{item.url}}) - [{{item.url }}]
{{item.path}}

{% endfor %}
