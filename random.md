---
layout: page
title: Random Page
permalink: /random
---

<div id="random-redirect">
  <p>Finding a random page for you...</p>
</div>

<script type="module">
import { get_random_page_url } from '/assets/js/index.js';

async function redirectToRandomPage() {
  try {
    const randomUrl = await get_random_page_url();
    window.location.href = randomUrl;
  } catch (error) {
    console.error('Error getting random page:', error);
    // Fallback to a known page
    window.location.href = '/';
  }
}

// Redirect immediately when the page loads
redirectToRandomPage();
</script>
