---
layout: page
title: All Blog Posts
permalink: /all/
redirect_from:
  - /all-posts/
---

# All Blog Posts

This page lists all blog posts for link checking purposes.

## Posts
{% assign posts = site.posts | sort: 'date' | reverse %}
<ul>
{% for post in posts %}
  {% if post.title %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    {% if post.date %}
    <span class="post-date">({{ post.date | date: "%Y-%m-%d" }})</span>
    {% endif %}
    {% if post.tags %}
    <span class="post-tags">
      Tags: 
      {% for tag in post.tags %}
        <span class="tag">{{ tag }}</span>{% unless forloop.last %}, {% endunless %}
      {% endfor %}
    </span>
    {% endif %}
    <a href="https://github.com/idvorkin/idvorkin.github.io/blob/main/{{ post.path }}" class="github-link" target="_blank">
      <i class="fab fa-github"></i>
    </a>
  </li>
  {% endif %}
{% endfor %}
</ul>

## Pages
{% assign pages = site.pages | where_exp: "item", "item.url != '/all/'" | where_exp: "item", "item.title" | sort: 'title' %}
<ul>
{% for page in pages %}
  <li>
    <a href="{{ page.url | relative_url }}">{{ page.title }}</a>
    {% if page.date %}
    <span class="post-date">({{ page.date | date: "%Y-%m-%d" }})</span>
    {% endif %}
    <a href="https://github.com/idvorkin/idvorkin.github.io/blob/main/{{ page.path }}" class="github-link" target="_blank">
      <i class="fab fa-github"></i>
    </a>
  </li>
{% endfor %}
</ul>

## D Collection
{% assign d_items = site.d | sort: 'date' | reverse %}
<ul>
{% for item in d_items %}
  {% if item.title %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    {% if item.date %}
    <span class="post-date">({{ item.date | date: "%Y-%m-%d" }})</span>
    {% endif %}
    <a href="https://github.com/idvorkin/idvorkin.github.io/blob/main/{{ item.path }}" class="github-link" target="_blank">
      <i class="fab fa-github"></i>
    </a>
  </li>
  {% endif %}
{% endfor %}
</ul>

## IG66 Collection
{% assign ig66_items = site.ig66 | sort: 'date' | reverse %}
<ul>
{% for item in ig66_items %}
  {% if item.title %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    {% if item.date %}
    <span class="post-date">({{ item.date | date: "%Y-%m-%d" }})</span>
    {% endif %}
    <a href="https://github.com/idvorkin/idvorkin.github.io/blob/main/{{ item.path }}" class="github-link" target="_blank">
      <i class="fab fa-github"></i>
    </a>
  </li>
  {% endif %}
{% endfor %}
</ul>

## TD Collection
{% assign td_items = site.td | sort: 'date' | reverse %}
<ul>
{% for item in td_items %}
  {% if item.title %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    {% if item.date %}
    <span class="post-date">({{ item.date | date: "%Y-%m-%d" }})</span>
    {% endif %}
    <a href="https://github.com/idvorkin/idvorkin.github.io/blob/main/{{ item.path }}" class="github-link" target="_blank">
      <i class="fab fa-github"></i>
    </a>
  </li>
  {% endif %}
{% endfor %}
</ul>

<style>
.post-date {
  color: #666;
  font-size: 0.9em;
  margin-left: 10px;
}
.post-tags {
  color: #888;
  font-size: 0.85em;
  margin-left: 10px;
}
.tag {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}
.github-link {
  margin-left: 10px;
  color: #666;
  text-decoration: none;
}
.github-link:hover {
  color: #333;
}
</style>