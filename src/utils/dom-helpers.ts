/**
 * DOM Helper Functions
 *
 * This module contains utility functions for DOM manipulation.
 */

/**
 * Toggles a class on an element
 * @param element The element or selector to toggle class on
 * @param className The class to toggle
 * @param force If provided, adds class when true and removes when false
 * @returns The element
 */
export function toggleClass(
  element: string | HTMLElement,
  className: string,
  force?: boolean
): HTMLElement {
  const el =
    typeof element === "string"
      ? (document.querySelector(element) as HTMLElement)
      : element;

  if (!el) return null;

  if (force === undefined) {
    el.classList.toggle(className);
  } else if (force) {
    el.classList.add(className);
  } else {
    el.classList.remove(className);
  }

  return el;
}

/**
 * Creates an element with attributes and children
 * @param tag The tag name
 * @param attributes Optional attributes to set
 * @param children Optional children to append
 * @returns The created element
 */
export function createElement<T extends HTMLElement>(
  tag: string,
  attributes?: Record<string, string>,
  children?: (string | Node)[]
): T {
  const element = document.createElement(tag) as T;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (children) {
    children.forEach(child => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
}
