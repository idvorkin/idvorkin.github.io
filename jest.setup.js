// Mock browser globals
global.$ = jest.fn(() => ({
  html: jest.fn(),
  removeClass: jest.fn(),
  addClass: jest.fn(),
  text: jest.fn(),
  get: jest.fn(() => ({ getContext: jest.fn() })),
}));

// Mock window location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:4000',
    replace: jest.fn(),
  },
  writable: true,
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document methods
document.getElementById = jest.fn();
document.querySelector = jest.fn();
document.querySelectorAll = jest.fn(() => []); 