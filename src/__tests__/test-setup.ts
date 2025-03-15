// Mock Algolia and other external dependencies for testing

// Setup mock for Algolia autocomplete
window["@algolia/autocomplete-js"] = {
  autocomplete: () => {},
  getAlgoliaResults: () => {},
};

// Mock Algolia search
window["algoliasearch"] = () => ({
  initIndex: () => ({
    search: () => Promise.resolve({ hits: [] }),
  }),
});

// Mock jQuery with a more complete implementation
const jQueryMock = selector => {
  // Create a mock jQuery object
  const mockObj = {
    find: () => jQueryMock(),
    text: () => "",
    html: () => "",
    attr: () => "",
    val: () => "",
    css: () => mockObj,
    addClass: () => mockObj,
    removeClass: () => mockObj,
    toggleClass: () => mockObj,
    first: () => mockObj,
    click: callback => {
      if (callback) mockObj.clickHandler = callback;
      return mockObj;
    },
    each: callback => {
      callback.call(mockObj, 0, mockObj);
      return mockObj;
    },
    on: () => mockObj,
    off: () => mockObj,
    length: 0,
    prop: () => "",
    empty: () => mockObj,
    append: () => mockObj,
    prepend: () => mockObj,
    show: () => mockObj,
    hide: () => mockObj,
    parent: () => mockObj,
    children: () => mockObj,
    remove: () => mockObj,
    data: () => mockObj,
    get: () => [],
    replaceWith: () => mockObj,
  };

  return mockObj;
};

// Add ready method to jQuery
jQueryMock.ready = callback => {
  if (callback) callback();
  return jQueryMock;
};

// Make it available as window.$ and document.ready
window.$ = jQueryMock;
window.jQuery = jQueryMock;

// Add jQuery ready function to document
jQueryMock.fn = {
  jquery: "3.6.0",
};

// Make $ work with document
window.$(document).ready = callback => {
  if (callback) callback();
  return jQueryMock();
};

// Mock Plotly
window.Plotly = {
  newPlot: () => {},
  on: () => {},
};

// Add to global so they're accessible to tests
global.$ = window.$;
global.Plotly = window.Plotly;
