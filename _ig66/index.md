---
title: Personal Journal
layout: post

no-render-title: true
---

<script type=module>
    import { load_ig66 } from '/assets/js/index.js'
    defer(load_ig66)
</script>

<div class='alert alert-primary' id="random-recent">
</div>

<!-- Show the most recent blog posts -->

{% assign display_order_posts  = site.ig66 | reverse %}
{% for item in  display_order_posts limit:2 %}

{%if item.week %}
{%else%}
{% continue %}
{% endif%}

### [{{item.title}}]({{item.url}})

[![montage](https://github.com/idvorkin/blob/raw/master/ig66/{{item.week}}/montage.webp)]({{item.url}})
{{item.excerpt}}

{% endfor %}

<br/>

<div class='alert alert-success' id="random-post">
</div>

<div class='alert alert-info' id="achievment">
</div>

<!-- Show the next blog posts -->

{% assign display_order_posts  = site.ig66 | reverse %}
{% for item in  display_order_posts limit:6 offset:2 %}

{%if item.week %}
{%else%}
{% continue %}
{% endif%}

### [{{item.title}}]({{item.url}})

[![montage](https://github.com/idvorkin/blob/raw/master/ig66/{{item.week}}/montage.webp)]({{item.url}})
{{item.excerpt}}

{% endfor %}
