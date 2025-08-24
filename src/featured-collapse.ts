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

  constructor(buttonId: string = 'featured-collapse-btn', contentId: string = 'featured-results') {
    this.state = { isCollapsed: false };
    this.elements = {
      button: document.getElementById(buttonId),
      content: document.getElementById(contentId)
    };
  }

  public initialize(): boolean {
    if (!this.elements.button || !this.elements.content) {
      console.warn('Featured collapse elements not found');
      return false;
    }

    this.elements.button.addEventListener('click', (e) => this.handleClick(e));
    return true;
  }

  public handleClick(event: Event): void {
    event.preventDefault();
    this.toggle();
  }

  public toggle(): void {
    this.state.isCollapsed = !this.state.isCollapsed;
    this.updateUI();
  }

  public collapse(): void {
    this.state.isCollapsed = true;
    this.updateUI();
  }

  public expand(): void {
    this.state.isCollapsed = false;
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
      this.elements.content.style.display = 'none';
      this.elements.button.textContent = '+';
      this.elements.button.title = 'Expand section';
    } else {
      this.elements.content.style.display = 'block';
      this.elements.button.textContent = '−';
      this.elements.button.title = 'Collapse section';
    }
  }

  // For testing purposes
  public getElements(): CollapseElements {
    return this.elements;
  }

  public getState(): CollapseState {
    return { ...this.state };
  }
}

// Export a simple setup function for easy integration
export function setupFeaturedCollapse(): FeaturedCollapseManager | null {
  const manager = new FeaturedCollapseManager();
  const initialized = manager.initialize();
  return initialized ? manager : null;
}