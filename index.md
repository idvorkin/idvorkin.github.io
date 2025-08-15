---
layout: post
title: Igor's Blog
no-render-title: true
---

<style>
/* Style the autocomplete container to be visible and prominent */
#autocomplete-search-box {
    display: block !important;
    margin: 20px auto;
    max-width: 800px;
    padding: 0 20px;
}

/* Make sure the autocomplete dropdown is visible */
.aa-Autocomplete {
    width: 100%;
}

.aa-Panel {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
}

/* Style the search input */
.aa-Input {
    width: 100%;
    padding: 12px 16px;
    font-size: 18px;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
}

.aa-Input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

/* Add a welcome message */
.welcome-message {
    text-align: center;
    margin: 40px 20px 20px;
}

.welcome-message h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

.welcome-message p {
    font-size: 1.2em;
    color: #666;
}
</style>

<div class="welcome-message">
    <h1>Welcome to Igor's Blog</h1>
    <p>Start typing to search, or explore featured, recent, and random posts below</p>
</div>

<div id="autocomplete-search-box"></div>

<script type="module">
    import { CreateAutoComplete } from "/assets/js/index.js";
    
    $(document).ready(function() {
        // Create the autocomplete with the right configuration
        CreateAutoComplete(
            "{{ site.algolia.application_id }}",
            "{{ site.algolia.search_only_api_key }}",
            "{{ site.algolia.index_name }}",
            "#autocomplete-search-box",
            false,
            5,  // featuredCount - show more featured posts
            6,  // recentCount - show more recent posts
            4   // randomCount - show some random posts
        ).then(autocomplete => {
            // Focus the search input and trigger the dropdown to open
            setTimeout(() => {
                const searchInput = document.querySelector('#autocomplete-search-box input');
                if (searchInput) {
                    searchInput.focus();
                    // Trigger input event to open dropdown with default content
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 100);
        });
    });
</script>
