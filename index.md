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
    max-width: 1000px;
    padding: 0 20px;
}

/* Make sure the autocomplete dropdown is visible */
.aa-Autocomplete {
    width: 100%;
}

/* Force the panel to be inline and always visible */
.aa-Panel {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    position: static !important;
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
    margin-top: 20px;
}

.aa-PanelLayout {
    background: white;
    border-radius: 8px;
    padding: 20px;
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

/* Style the results sections */
.aa-Source {
    margin-bottom: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    background: #fafafa;
}

.aa-SourceHeader {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
}

.aa-List {
    list-style: none;
    padding: 0;
    margin: 0;
}

.aa-Item {
    padding: 10px;
    margin-bottom: 10px;
    background: white;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s;
}

.aa-Item:hover {
    background: #f0f0f0;
    border-color: #007bff;
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

/* Keep the dropdown always open */
.aa-DetachedContainer {
    display: none !important;
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
            // Focus the search input and keep panel open
            setTimeout(() => {
                const searchInput = document.querySelector('#autocomplete-search-box input');
                if (searchInput) {
                    searchInput.focus();
                    // Trigger input event to open dropdown with default content
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    // Force the panel to stay open and inline
                    const panel = document.querySelector('.aa-Panel');
                    if (panel) {
                        panel.style.position = 'static';
                        panel.style.display = 'block';
                    }
                }
            }, 100);
            
            // Keep the panel always visible
            setInterval(() => {
                const panel = document.querySelector('.aa-Panel');
                if (panel && panel.style.display === 'none') {
                    panel.style.display = 'block';
                    panel.style.position = 'static';
                }
            }, 100);
        });
    });
</script>
