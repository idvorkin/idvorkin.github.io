---
title: Personal Journal
layout: post

no-render-title: true
---

<script type=module>
    import { load_ig66 } from '/assets/js/page-loader.js'
    defer(load_ig66)
</script>

{% assign display_order_posts  = site.ig66 | reverse %}
{% for item in  display_order_posts limit:2 %}

{%if item.week %}
{%else%}
{% continue %}
{% endif%}

### [{{item.title}}]({{item.url}})

[![montage](https://github.com/idvorkin/blob/raw/master/ig66/{{item.week}}/montage.jpg)]({{item.url}})
{{item.excerpt}}

{% endfor %}

<br/>

<div class='alert alert-info' id="achievment">
</div>

<div class='alert alert-success' id="random-post">
</div>

<div class='alert alert-primary' id="random-recent">
</div>
