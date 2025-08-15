---
layout: post
title: Igor's Blog
no-render-title: true
---

<style>
/* Container styling */
.search-container {
    max-width: 1000px;
    margin: 20px auto;
    padding: 0 20px;
}

/* Style the search input */
.search-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 18px;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    box-sizing: border-box;
}

.search-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

/* Results container */
.results-container {
    margin-top: 30px;
}

/* Section styling */
.results-section {
    margin-bottom: 20px;
    border: none;
    border-radius: 0;
    padding: 0;
    background: transparent;
}

.results-section h3 {
    margin: 0 0 8px 0;
    color: #999;
    font-size: 0.9em;
    font-style: italic;
    font-weight: normal;
}

/* Individual result items */
.result-item {
    padding: 8px 0;
    margin-bottom: 8px;
    background: transparent;
    border-radius: 0;
    border: none;
    transition: all 0.2s;
    cursor: pointer;
    line-height: 1.4;
}

.result-item:hover {
    background: #f5f5f5;
    padding-left: 8px;
    transform: none;
}

.result-item a {
    font-weight: 600;
    color: #0066cc;
    text-decoration: none;
    font-size: 1em;
}

.result-item a:hover {
    text-decoration: underline;
}

.result-item .description {
    color: #666;
    font-size: 0.9em;
    line-height: 1.3;
}

/* Welcome message */
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

/* Highlight matching text */
.highlight {
    background: yellow;
    padding: 2px;
}
</style>

<div class="welcome-message">
    <h1>Welcome to Igor's Blog</h1>
    <p>Start typing to search, or explore featured, recent, and random posts below</p>
</div>

<div class="search-container">
    <input type="text" class="search-input" id="search-input" placeholder="Search Igor's Musings..." />
    
    <div class="results-container" id="results-container">
        <div class="results-section" id="featured-section">
            <h3>Featured posts ...</h3>
            <div id="featured-results"></div>
        </div>
        
        <div class="results-section" id="recent-section">
            <h3>Recent posts ...</h3>
            <div id="recent-results"></div>
        </div>
        
        <div class="results-section" id="random-section">
            <h3>Random posts ...</h3>
            <div id="random-results"></div>
        </div>
    </div>
</div>

<script type="module">
    import { get_recent_posts, get_random_post } from "/assets/js/index.js";
    
    // Algolia configuration
    const appId = "{{ site.algolia.application_id }}";
    const apiKey = "{{ site.algolia.search_only_api_key }}";
    const indexName = "{{ site.algolia.index_name }}";
    
    // Initialize Algolia client
    const searchClient = algoliasearch(appId, apiKey);
    const index = searchClient.initIndex(indexName);
    
    // Function to render a result item
    function renderResultItem(item) {
        const url = item.url + (item.anchor ? `#${item.anchor}` : '');
        const title = item._highlightResult?.title?.value || item.title || '';
        let description = item._highlightResult?.content?.value || item.description || '';
        
        // Truncate description to ~150 characters
        if (description.length > 150) {
            description = description.substring(0, 147) + '...';
        }
        
        return `
            <div class="result-item" onclick="window.location='${url}';">
                <div><a href="${url}">${title}</a> <span class="description">${description}</span></div>
            </div>
        `;
    }
    
    // Function to render basic item (for recent/random)
    function renderBasicItem(item) {
        let description = item.description || '';
        
        // Truncate description to ~150 characters
        if (description.length > 150) {
            description = description.substring(0, 147) + '...';
        }
        
        return `
            <div class="result-item" onclick="window.location='${item.url}';">
                <div><a href="${item.url}">${item.title}</a> <span class="description">${description}</span></div>
            </div>
        `;
    }
    
    // Load initial content
    async function loadInitialContent() {
        // Load featured posts from Algolia
        try {
            const { hits } = await index.search(' ', { 
                hitsPerPage: 3,
                filters: 'NOT tags:family-journal'
            });
            document.getElementById('featured-results').innerHTML = 
                hits.map(renderResultItem).join('');
        } catch (error) {
            console.error('Error loading featured posts:', error);
        }
        
        // Load recent posts
        try {
            const recentPosts = await get_recent_posts(3);
            document.getElementById('recent-results').innerHTML = 
                recentPosts.map(renderBasicItem).join('');
        } catch (error) {
            console.error('Error loading recent posts:', error);
        }
        
        // Load random posts
        try {
            const randomPosts = await Promise.all(
                [1, 2, 3].map(() => get_random_post())
            );
            document.getElementById('random-results').innerHTML = 
                randomPosts.map(renderBasicItem).join('');
        } catch (error) {
            console.error('Error loading random posts:', error);
        }
    }
    
    // Search function
    async function performSearch(query) {
        if (!query || query.trim() === '') {
            // If empty, reload initial content
            loadInitialContent();
            document.getElementById('recent-section').style.display = 'block';
            document.getElementById('random-section').style.display = 'block';
            return;
        }
        
        // Hide recent and random sections when searching
        document.getElementById('recent-section').style.display = 'none';
        document.getElementById('random-section').style.display = 'none';
        
        // Update featured section title
        document.querySelector('#featured-section h3').textContent = 'Search results ...';
        
        try {
            const { hits } = await index.search(query, {
                hitsPerPage: 20,
                filters: 'NOT tags:family-journal',
                highlightPreTag: '<span class="highlight">',
                highlightPostTag: '</span>'
            });
            
            if (hits.length === 0) {
                document.getElementById('featured-results').innerHTML = 
                    '<div class="result-item">No results found. Try different keywords.</div>';
            } else {
                document.getElementById('featured-results').innerHTML = 
                    hits.map(renderResultItem).join('');
            }
        } catch (error) {
            console.error('Search error:', error);
            document.getElementById('featured-results').innerHTML = 
                '<div class="result-item">Error performing search. Please try again.</div>';
        }
    }
    
    // Set up search input handler with debouncing
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
    
    // Load initial content when page loads
    $(document).ready(() => {
        loadInitialContent();
        document.getElementById('search-input').focus();
    });
</script>
