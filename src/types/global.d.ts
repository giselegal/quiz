
// Global type declarations
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Extend EventTarget to include DOM-specific properties
interface EventTarget {
  tagName?: string;
  closest?: (selector: string) => Element | null;
  href?: string;
  getAttribute?: (name: string) => string | null;
  textContent?: string | null;
}

