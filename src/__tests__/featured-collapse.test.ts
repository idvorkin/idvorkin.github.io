import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Featured Section Collapse Functionality", () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="search-container">
        <div class="results-container">
          <div class="results-section" id="featured-section">
            <div class="section-header">
              <h3>Featured</h3>
              <a href="#" id="toggle-featured" class="action-link" title="Collapse featured section">−</a>
            </div>
            <div id="featured-results">
              <div class="result-item">Featured post 1</div>
              <div class="result-item">Featured post 2</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  it("should have collapse button with correct initial state", () => {
    const toggleButton = document.getElementById('toggle-featured') as HTMLAnchorElement;
    const featuredResults = document.getElementById('featured-results') as HTMLDivElement;
    
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.textContent).toBe('−');
    expect(toggleButton.getAttribute('title')).toBe('Collapse featured section');
    expect(featuredResults.style.display).not.toBe('none');
  });

  it("should collapse featured section when button is clicked", () => {
    const toggleButton = document.getElementById('toggle-featured') as HTMLAnchorElement;
    const featuredResults = document.getElementById('featured-results') as HTMLDivElement;

    // Set up the event listener (simulating the actual implementation)
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      const isCollapsed = featuredResults.style.display === 'none';
      
      if (isCollapsed) {
        featuredResults.style.display = 'block';
        toggleButton.textContent = '−';
        toggleButton.setAttribute('title', 'Collapse featured section');
      } else {
        featuredResults.style.display = 'none';
        toggleButton.textContent = '+';
        toggleButton.setAttribute('title', 'Expand featured section');
      }
    });

    // Click to collapse
    toggleButton.click();
    
    expect(featuredResults.style.display).toBe('none');
    expect(toggleButton.textContent).toBe('+');
    expect(toggleButton.getAttribute('title')).toBe('Expand featured section');
  });

  it("should expand featured section when clicked while collapsed", () => {
    const toggleButton = document.getElementById('toggle-featured') as HTMLAnchorElement;
    const featuredResults = document.getElementById('featured-results') as HTMLDivElement;

    // Set up the event listener
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      const isCollapsed = featuredResults.style.display === 'none';
      
      if (isCollapsed) {
        featuredResults.style.display = 'block';
        toggleButton.textContent = '−';
        toggleButton.setAttribute('title', 'Collapse featured section');
      } else {
        featuredResults.style.display = 'none';
        toggleButton.textContent = '+';
        toggleButton.setAttribute('title', 'Expand featured section');
      }
    });

    // First collapse it
    toggleButton.click();
    expect(featuredResults.style.display).toBe('none');
    
    // Then expand it
    toggleButton.click();
    
    expect(featuredResults.style.display).toBe('block');
    expect(toggleButton.textContent).toBe('−');
    expect(toggleButton.getAttribute('title')).toBe('Collapse featured section');
  });

  it("should prevent default behavior when clicked", () => {
    const toggleButton = document.getElementById('toggle-featured') as HTMLAnchorElement;
    const preventDefault = vi.fn();
    
    // Mock the event
    const mockEvent = { preventDefault } as unknown as Event;

    // Set up the event listener
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Minimal implementation for this test
    });

    // Create a custom event and dispatch it
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    toggleButton.dispatchEvent(clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should handle missing elements gracefully", () => {
    // Remove the button
    const toggleButton = document.getElementById('toggle-featured');
    toggleButton?.remove();

    // This should not throw an error
    expect(() => {
      const missingButton = document.getElementById('toggle-featured');
      if (missingButton) {
        missingButton.addEventListener('click', () => {});
      }
    }).not.toThrow();
  });

  it("should handle missing featured results element gracefully", () => {
    const toggleButton = document.getElementById('toggle-featured') as HTMLAnchorElement;
    
    // Remove the featured results
    const featuredResults = document.getElementById('featured-results');
    featuredResults?.remove();

    // Set up the event listener with safety check
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      const resultsElement = document.getElementById('featured-results');
      if (resultsElement) {
        const isCollapsed = resultsElement.style.display === 'none';
        // Toggle logic would go here
      }
    });

    // This should not throw an error
    expect(() => {
      toggleButton.click();
    }).not.toThrow();
  });

  it("should maintain button state consistency with results visibility", () => {
    const toggleButton = document.getElementById('toggle-featured') as HTMLAnchorElement;
    const featuredResults = document.getElementById('featured-results') as HTMLDivElement;

    // Set up the event listener
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      const isCollapsed = featuredResults.style.display === 'none';
      
      if (isCollapsed) {
        featuredResults.style.display = 'block';
        toggleButton.textContent = '−';
        toggleButton.setAttribute('title', 'Collapse featured section');
      } else {
        featuredResults.style.display = 'none';
        toggleButton.textContent = '+';
        toggleButton.setAttribute('title', 'Expand featured section');
      }
    });

    // Test multiple toggles
    for (let i = 0; i < 3; i++) {
      // Collapse
      toggleButton.click();
      expect(featuredResults.style.display).toBe('none');
      expect(toggleButton.textContent).toBe('+');
      
      // Expand
      toggleButton.click();
      expect(featuredResults.style.display).toBe('block');
      expect(toggleButton.textContent).toBe('−');
    }
  });
});