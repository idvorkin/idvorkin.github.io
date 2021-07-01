---
title: Personal Journal
layout: post

no-render-title: true
monkey-does-reload: true
---

<br/>

<div class='extra-random-parent-to-make-append-work'>
    <div class='alert alert-success' id="random-post">
    </div>

</div>

{% assign display_order_posts  = site.ig66 | reverse %}
{% for item in  display_order_posts limit:4 %}

{%if item.week %}
{%else%}
{% continue %}
{% endif%}

### [{{item.title}}]({{item.url}})

[![montage](https://github.com/idvorkin/blob/raw/master/ig66/{{item.week}}/montage.jpg)]({{item.url}})
{{item.excerpt}}

{% endfor %}

<div class='extra-random-parent-to-make-append-work'>
    <div class='alert alert-success' id="achievment">
    </div>

    <div id="imported-posts"/>

</div>
