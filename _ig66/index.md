---
title: Personal Journal
layout: post
no-render-title: true
---

Below is my personal and family journal! Enjoy

<!-- Todo, figure out how to order by date -->
<br/>
<br/>

{% for item in site.ig66 %}

### [{{item.title}}]({{item.url}})

{{item.excerpt}}

<!-- - {{item.date | date: "%b %d, %y"}} -->

[![montage](https://github.com/idvorkin/blob/raw/master/ig66/{{item.week}}/montage.jpg)]({{item.url}})

{% endfor %}
