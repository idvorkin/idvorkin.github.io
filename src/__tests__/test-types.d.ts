// ABOUTME: Type declarations for test globals and mocks
// ABOUTME: Extends global/globalThis with jQuery and other mocked globals

/* eslint-disable no-var */
import type { Mock } from "vitest";

// Extend NodeJS global (used in tests as global.$)
declare global {
  // jQuery mock - allow both real type and mock
  var $: JQueryStatic & { getJSON?: Mock };
  var jQuery: JQueryStatic;

  // Mousetrap global
  var Mousetrap: MousetrapStatic;

  // Plotly global
  var Plotly: typeof import("plotly.js");
}
