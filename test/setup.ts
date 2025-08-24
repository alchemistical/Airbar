import React from "react";
import { vi } from "vitest";

// Make React available globally for JSX
global.React = React;

// Mock browser APIs that might be missing in test environment
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock gtag for analytics
Object.defineProperty(window, "gtag", {
  writable: true,
  value: vi.fn(),
});

// Mock fetch if needed
global.fetch = vi.fn();
