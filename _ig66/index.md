---
title: Personal Journal
layout: post

no-render-title: true
---

<br/>

<div class='alert alert-success' id="random-post">
A blast from the past!
</div>

{% for item in site.ig66 reversed   %}

{%if item.week %}
{%else%}
{% continue %}
{% endif%}

### [{{item.title}}]({{item.url}})

[![montage](https://github.com/idvorkin/blob/raw/master/ig66/{{item.week}}/montage.jpg)]({{item.url}})
{{item.excerpt}}

{% endfor %}

<div id="imported-posts"/>