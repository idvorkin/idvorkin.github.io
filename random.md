---
layout: page
title: Random Page
permalink: /random
---

<div id="random-redirect">
  <p>Finding a random page for you...</p>
</div>

<script type="module">
import { goToRandomPage, topicFromSearch } from '/assets/js/index.js';

// Replace /random in history so Back skips the redirect page, and mark the
// landing so it shows the re-roll dice. ?topic=ai rolls from one topic.
goToRandomPage((url) => window.location.replace(url), undefined, topicFromSearch(window.location.search)).catch((error) => {
  console.error('Error getting random page:', error);
  window.location.href = '/';
});
</script>
