---
title: All posts
tags: []
---

All posts for editting

# Production

{% for item in site.posts %}
{{item.title}}
{{item.path}}
{% endfor %}

# Drafts

{% for item in site.d %}
{{item.title}}
{{item.path}}
{% endfor %}

# Tech Diary

{% for item in site.td %}

{{item.title}}
{{item.path}}

{% endfor %}
