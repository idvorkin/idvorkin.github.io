// Featured section collapse functionality

export interface CollapseState {
  isCollapsed: boolean;
}

export interface CollapseElements {
  button: HTMLElement | null;
  content: HTMLElement | null;
}

export class FeaturedCollapseManager {
  private state: CollapseState;
  private elements: CollapseElements;
  private storageKey: string;

  constructor(
    buttonId = "featured-collapse-btn",
    contentId = "featured-results",
    storageKey = "featured-section-collapsed",
  ) {
    this.storageKey = storageKey;
    // Load initial state from localStorage
    this.state = { isCollapsed: this.loadState() };
    this.elements = {
      button: document.getElementById(buttonId),
      content: document.getElementById(contentId),
    };
  }

  public initialize(): boolean {
    if (!this.elements.button || !this.elements.content) {
      console.warn("Featured collapse elements not found");
      return false;
    }

    // Apply initial state from localStorage
    this.updateUI();

    this.elements.button.addEventListener("click", (e) => this.handleClick(e));
    return true;
  }

  public handleClick(event: Event): void {
    event.preventDefault();
    this.toggle();
  }

  public toggle(): void {
    this.state.isCollapsed = !this.state.isCollapsed;
    this.saveState();
    this.updateUI();
  }

  public collapse(): void {
    this.state.isCollapsed = true;
    this.saveState();
    this.updateUI();
  }

  public expand(): void {
    this.state.isCollapsed = false;
    this.saveState();
    this.updateUI();
  }

  public isCollapsed(): boolean {
    return this.state.isCollapsed;
  }

  private updateUI(): void {
    if (!this.elements.button || !this.elements.content) {
      return;
    }

    if (this.state.isCollapsed) {
      this.elements.content.style.display = "none";
      this.elements.button.textContent = "Expand +";
      this.elements.button.title = "Expand section";
    } else {
      this.elements.content.style.display = "block";
      this.elements.button.textContent = "Collapse −";
      this.elements.button.title = "Collapse section";
    }
  }

  // For testing purposes
  public getElements(): CollapseElements {
    return this.elements;
  }

  public getState(): CollapseState {
    return { ...this.state };
  }

  // localStorage helpers
  private loadState(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === "true";
    } catch {
      // localStorage might not be available (e.g., in tests or private browsing)
      return false;
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.storageKey, this.state.isCollapsed.toString());
    } catch {
      // Fail silently if localStorage is not available
    }
  }

  // Clear saved state (useful for testing)
  public clearSavedState(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Fail silently
    }
  }
}

// Export a simple setup function for easy integration
export function setupFeaturedCollapse(): FeaturedCollapseManager | null {
  const manager = new FeaturedCollapseManager();
  const initialized = manager.initialize();
  return initialized ? manager : null;
}
