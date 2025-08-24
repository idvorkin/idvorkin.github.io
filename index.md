---
layout: post
title: Igor's Blog
no-render-title: true
---

<style>
/* Container styling */
.search-container {
    max-width: 1000px;
    margin: 10px auto;
    padding: 0 10px;
}

/* Style the search input */
.search-input {
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    box-sizing: border-box;
}

.search-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

/* Results container */
.results-container {
    margin-top: 12px;
}

/* Section styling */
.results-section {
    margin-bottom: 12px;
    border: none;
    border-radius: 0;
    padding: 0;
    background: transparent;
}

/* Section header with integrated actions */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 0 0 4px 0;
    padding-bottom: 2px;
    border-bottom: 1px solid #e5e5e5;
}

.section-header h3 {
    margin: 0;
    color: #666;
    font-size: 0.85em;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.section-header .action-link {
    font-size: 0.8em;
    color: #0066cc;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0 2px;
}

.section-header .action-link:hover {
    color: #0052a3;
    text-decoration: underline;
}

/* Individual result items */
.result-item {
    padding: 4px 0;
    margin-bottom: 4px;
    background: transparent;
    border-radius: 0;
    border: none;
    transition: all 0.2s;
    cursor: pointer;
    line-height: 1.3;
}

.result-item:hover {
    background: #f5f5f5;
    padding-left: 6px;
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
    font-size: 0.85em;
    line-height: 1.2;
}

/* Highlight matching text */
.highlight {
    background: yellow;
    padding: 2px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .search-container {
        margin: 5px auto;
        padding: 0 8px;
    }
    
    .search-input {
        padding: 6px 10px;
        font-size: 15px;
    }
    
    .results-container {
        margin-top: 8px;
    }
    
    .results-section {
        margin-bottom: 8px;
    }
    
    .section-header {
        margin: 0 0 3px 0;
    }
    
    .section-header h3 {
        font-size: 0.75em;
    }
    
    .section-header .action-link {
        font-size: 0.7em;
    }
    
    .result-item {
        padding: 3px 0;
        margin-bottom: 2px;
        line-height: 1.2;
    }
    
    .result-item a {
        font-size: 0.95em;
    }
    
    .result-item .description {
        font-size: 0.8em;
        line-height: 1.15;
    }
}
</style>

<div class="search-container">
    <input type="text" class="search-input" id="search-input" placeholder="Search Igor's Blog, or browse featured/recent/random posts below..." />
    
    <div class="results-container" id="results-container">
        <div class="results-section" id="featured-section">
            <div class="section-header">
                <h3>Featured</h3>
                <a class="action-link" id="featured-collapse-btn" href="#" title="Collapse section">Collapse −</a>
            </div>
            <div id="featured-results">
                <div class="result-item" style="color: #999;">Loading featured posts...</div>
            </div>
        </div>
        
        <div class="results-section" id="recent-section">
            <div class="section-header">
                <h3>Recent</h3>
                <a href="/recent" class="action-link">View all →</a>
            </div>
            <div id="recent-results">
                <div class="result-item" style="color: #999;">Loading recent posts...</div>
            </div>
        </div>
        
        <div class="results-section" id="random-section">
            <div class="section-header">
                <h3>Random</h3>
                <a href="#" id="refresh-random-posts" class="action-link">Refresh ↻</a>
            </div>
            <div id="random-results">
                <div class="result-item" style="color: #999;">Loading random posts...</div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import { get_recent_posts, get_random_post, get_random_posts_batch, get_link_info } from "/assets/js/index.js";
    
    // Algolia configuration
    const appId = "{{ site.algolia.application_id }}";
    const apiKey = "{{ site.algolia.search_only_api_key }}";
    const indexName = "{{ site.algolia.index_name }}";
    
    // Initialize Algolia client
    const searchClient = algoliasearch(appId, apiKey);
    const index = searchClient.initIndex(indexName);
    
    // Cache frequently used DOM elements for better performance
    const cachedElements = {
        featuredResults: document.getElementById('featured-results'),
        recentResults: document.getElementById('recent-results'),
        randomResults: document.getElementById('random-results'),
        recentSection: document.getElementById('recent-section'),
        randomSection: document.getElementById('random-section'),
        searchInput: document.getElementById('search-input'),
        refreshButton: document.getElementById('refresh-random-posts')
    };
    
    // Helper function to escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
    
    // Helper function to validate URLs
    function isValidUrl(url) {
        if (!url) return false;
        
        // Allow relative URLs (starting with /)
        if (url.startsWith('/')) {
            return true;
        }
        
        // Allow well-formed absolute URLs
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }
    
    // Function to render a result item
    function renderResultItem(item) {
        const url = item.url + (item.anchor ? `#${item.anchor}` : '');
        if (!isValidUrl(url)) {
            console.warn('Invalid URL skipped:', url);
            return '';
        }
        
        // Extract text from highlighted results (they contain HTML)
        const titleHtml = item._highlightResult?.title?.value || '';
        const contentHtml = item._highlightResult?.content?.value || '';
        
        // For highlighted results, preserve the highlight spans but escape the rest
        const title = titleHtml || escapeHtml(item.title || '');
        let description = contentHtml || escapeHtml(item.description || '');
        
        // Truncate description to ~150 characters
        if (description.length > 150) {
            description = description.substring(0, 147) + '...';
        }
        
        const safeUrl = escapeHtml(url);
        return `
            <div class="result-item" onclick="window.location='${safeUrl}';">
                <div><a href="${safeUrl}">${title}</a> <span class="description">${description}</span></div>
            </div>
        `;
    }
    
    // Function to render basic item (for recent/random)
    function renderBasicItem(item) {
        if (!isValidUrl(item.url)) {
            console.warn('Invalid URL skipped:', item.url);
            return '';
        }
        
        const safeUrl = escapeHtml(item.url);
        const safeTitle = escapeHtml(item.title || '');
        let safeDescription = escapeHtml(item.description || '');
        
        // Truncate description to ~150 characters
        if (safeDescription.length > 150) {
            safeDescription = safeDescription.substring(0, 147) + '...';
        }
        
        return `
            <div class="result-item" onclick="window.location='${safeUrl}';">
                <div><a href="${safeUrl}">${safeTitle}</a> <span class="description">${safeDescription}</span></div>
            </div>
        `;
    }
    
    // Function to show loading state
    function showLoading(elementId) {
        // Don't show loading state since we already have placeholders
        // This prevents flashing content
    }
    
    // Load featured posts (with lazy loading)
    async function loadFeaturedPosts() {
        const startTime = performance.now();
        console.log('⏱️ [Featured] Starting load...');
        showLoading('featured-results');
        try {
            // Featured post URLs from _data/featured.yml (rendered by Jekyll)
            const featuredUrls = [
                {% for url in site.data.featured.featured_posts %}
                "{{ url }}"{% unless forloop.last %},{% endunless %}
                {% endfor %}
            ];
            
            // Fetch all link info from backlinks.json
            const allLinkInfo = await get_link_info();
            
            // Map URLs to post data from backlinks
            const featuredPosts = featuredUrls.map(url => {
                const postInfo = allLinkInfo[url];
                if (postInfo) {
                    return {
                        title: postInfo.title || url,
                        url: url,
                        description: postInfo.description || ""
                    };
                }
                // Fallback if not found in backlinks
                return {
                    title: url.replace(/^\//, '').replace(/-/g, ' '),
                    url: url,
                    description: "Loading..."
                };
            }).filter(post => post !== null);
            
            cachedElements.featuredResults.innerHTML = 
                featuredPosts.map(renderBasicItem).join('');
            const loadTime = performance.now() - startTime;
            console.log(`✅ [Featured] Loaded in ${loadTime.toFixed(0)}ms`);
        } catch (error) {
            console.error('❌ [Featured] Error:', error);
            cachedElements.featuredResults.innerHTML = 
                '<div class="result-item">Failed to load featured posts</div>';
        }
    }
    
    // Load recent posts (with lazy loading)
    async function loadRecentPosts() {
        const startTime = performance.now();
        console.log('⏱️ [Recent] Starting load...');
        showLoading('recent-results');
        try {
            const recentPosts = await get_recent_posts(4);
            const html = recentPosts.map(renderBasicItem).join('');
            cachedElements.recentResults.innerHTML = html;
            const loadTime = performance.now() - startTime;
            console.log(`✅ [Recent] Loaded in ${loadTime.toFixed(0)}ms`);
        } catch (error) {
            console.error('❌ [Recent] Error:', error);
            cachedElements.recentResults.innerHTML = 
                '<div class="result-item">Failed to load recent posts</div>';
        }
    }
    
    // Load random posts (with refresh capability)
    async function loadRandomPosts() {
        const startTime = performance.now();
        console.log('⏱️ [Random] Starting load...');
        showLoading('random-results');
        try {
            // Use optimized batch function instead of multiple calls
            const randomPosts = await get_random_posts_batch(4);
            const html = randomPosts.map(renderBasicItem).join('');
            cachedElements.randomResults.innerHTML = html;
            const loadTime = performance.now() - startTime;
            console.log(`✅ [Random] Loaded in ${loadTime.toFixed(0)}ms`);
        } catch (error) {
            console.error('❌ [Random] Error:', error);
            cachedElements.randomResults.innerHTML = 
                '<div class="result-item">Failed to load random posts</div>';
        }
    }
    
    // Add event listener for refresh random posts button
    const refreshButton = cachedElements.refreshButton;
    if (refreshButton) {
        refreshButton.addEventListener('click', function(e) {
            e.preventDefault();
            loadRandomPosts();
        });
    }
    
    // Add global click handler for data-url elements (safer than onclick)
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-url]');
        if (target && target.dataset.url) {
            const url = target.dataset.url;
            // Additional URL validation before navigation
            if (url && (url.startsWith('/') || url.startsWith('http'))) {
                window.location = url;
            }
        }
    });
    
    // Load initial content with lazy loading
    async function loadInitialContent() {
        // Start all loads in parallel for better performance
        const loadPromises = [
            loadFeaturedPosts(),
            loadRecentPosts(),
            loadRandomPosts()
        ];
        
        // Wait for all to complete (but they'll show as they finish)
        await Promise.allSettled(loadPromises);
    }
    
    // Search function with proper state management
    async function performSearch(query) {
        if (!query || query.trim() === '') {
            // Restore original header text
            document.querySelector('#featured-section .section-header h3').textContent = 'Featured';
            
            // Show all sections with their action links
            cachedElements.recentSection.style.display = 'block';
            cachedElements.randomSection.style.display = 'block';
            document.querySelector('#recent-section .action-link').style.display = 'inline';
            document.querySelector('#random-section .action-link').style.display = 'inline';
            
            // Reset loaded state to allow reloading
            ['featured-section', 'recent-section', 'random-section'].forEach(id => {
                const element = document.getElementById(id);
                if (element) delete element.dataset.loaded;
            });
            
            // Restore collapsed state if it was collapsed
            if (featuredIsCollapsed) {
                document.getElementById('featured-results').style.display = 'none';
            }
            
            // Reload content lazily or immediately based on browser support
            if ('IntersectionObserver' in window) {
                setupLazyLoading();
            } else {
                loadInitialContent();
            }
            return;
        }
        
        // Hide recent and random sections when searching
        cachedElements.recentSection.style.display = 'none';
        cachedElements.randomSection.style.display = 'none';
        
        // Always show featured results when searching (override collapsed state)
        document.getElementById('featured-results').style.display = 'block';
        
        // Update featured section title for search results
        document.querySelector('#featured-section .section-header h3').textContent = 'Search Results';
        document.getElementById('featured-results').innerHTML = 
            '<div class="result-item" style="color: #999;">Searching...</div>';
        
        try {
            const { hits } = await index.search(query, {
                hitsPerPage: 20,
                filters: 'NOT tags:family-journal',
                highlightPreTag: '<span class="highlight">',
                highlightPostTag: '</span>'
            });
            
            if (hits.length === 0) {
                cachedElements.featuredResults.innerHTML = 
                    '<div class="result-item">No results found. Try different keywords.</div>';
            } else {
                cachedElements.featuredResults.innerHTML = 
                    hits.map(renderResultItem).join('');
            }
        } catch (error) {
            console.error('Search error:', error);
            cachedElements.featuredResults.innerHTML = 
                `<div class="result-item">Error performing search. <a href="#" onclick="performSearch('${query.replace(/'/g, "\\'")}')">Try again</a></div>`;
        }
    }
    
    // Set up search input handler with debouncing and error handling
    let searchTimeout;
    let intersectionObserver; // Store observer reference for cleanup
    const searchInput = cachedElements.searchInput;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                try {
                    performSearch(e.target.value);
                } catch (error) {
                    console.error('❌ Search input error:', error);
                    cachedElements.featuredResults.innerHTML = 
                        '<div class="result-item">Search error. Please refresh the page.</div>';
                }
            }, 300);
        });
    }
    
    // Set up intersection observer for lazy loading
    function setupLazyLoading() {
        console.log('🚀 [Init] Setting up lazy loading...');
        // Always load featured posts immediately for better UX
        loadFeaturedPosts();
        
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };
        
        const sectionLoaders = {
            'recent-section': loadRecentPosts,
            'random-section': loadRandomPosts
        };
        
        intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const loader = sectionLoaders[sectionId];
                    if (loader && !entry.target.dataset.loaded) {
                        console.log(`👁️ [Observer] ${sectionId} is visible, loading...`);
                        entry.target.dataset.loaded = 'true';
                        loader();
                    }
                }
            });
        }, observerOptions);
        
        // Observe only recent and random sections (featured loads immediately)
        Object.keys(sectionLoaders).forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                intersectionObserver.observe(element);
                console.log(`👁️ [Observer] Watching ${sectionId}`);
            }
        });
    }
    
    // Track page load time
    const pageLoadStart = performance.now();
    
    // Setup collapse button for featured section
    const STORAGE_KEY = 'featured-section-collapsed';
    let featuredIsCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    function setupFeaturedCollapse() {
        const collapseBtn = document.getElementById('featured-collapse-btn');
        const featuredResults = document.getElementById('featured-results');
        
        if (!collapseBtn || !featuredResults) {
            console.warn('Featured collapse elements not found');
            return;
        }
        
        // Apply initial state from localStorage
        if (featuredIsCollapsed) {
            featuredResults.style.display = 'none';
            collapseBtn.textContent = 'Expand +';
            collapseBtn.title = 'Expand section';
        }
        
        collapseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            featuredIsCollapsed = !featuredIsCollapsed;
            
            // Save state to localStorage
            localStorage.setItem(STORAGE_KEY, featuredIsCollapsed.toString());
            
            if (featuredIsCollapsed) {
                featuredResults.style.display = 'none';
                collapseBtn.textContent = 'Expand +';
                collapseBtn.title = 'Expand section';
            } else {
                featuredResults.style.display = 'block';
                collapseBtn.textContent = 'Collapse −';
                collapseBtn.title = 'Collapse section';
            }
        });
    }
    
    // Load initial content when page loads
    $(document).ready(() => {
        const domReadyTime = performance.now() - pageLoadStart;
        console.log(`📄 [Page] DOM ready in ${domReadyTime.toFixed(0)}ms`);
        console.log('🔍 [Page] Algolia configured, starting content load...');
        
        // Setup collapse button
        setupFeaturedCollapse();
        
        // Use intersection observer for truly lazy loading
        if ('IntersectionObserver' in window) {
            setupLazyLoading();
        } else {
            console.log('⚠️ [Page] IntersectionObserver not supported, loading all content');
            loadInitialContent();
        }
        
        if (cachedElements.searchInput) {
            cachedElements.searchInput.focus();
        }
        
        // Log total time when everything is likely loaded
        setTimeout(() => {
            const totalTime = performance.now() - pageLoadStart;
            console.log(`🏁 [Page] Total initial load time: ${totalTime.toFixed(0)}ms`);
        }, 2000);
    });
    
    // Cleanup function to prevent memory leaks
    function cleanup() {
        console.log('🧹 [Cleanup] Cleaning up resources...');
        
        // Clear any pending search timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            searchTimeout = null;
        }
        
        // Disconnect intersection observer
        if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
        }
    }
    
    // Add cleanup listeners
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
</script>
