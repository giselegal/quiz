
// Type definitions for image utility functions

// Options for preloading images
export interface PreloadOptions {
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  batchSize?: number;
  generateLowQuality?: boolean;
  timeout?: number; // Added for preload-critical.ts
}

// Image definition for preloading
export interface PreloadImageDefinition {
  src: string; // Changed from 'url' to 'src' for consistency
  priority?: number;
  width?: number;
  height?: number;
  quality?: number;
}

// Type for image metadata cache
export interface ImageMetadata {
  width: number;
  height: number;
  format?: string;
  aspectRatio?: number;
  dominantColor?: string;
  lastAccessed: number;
}

// Type for comprehensive image analysis
export interface ImageAnalysis {
  url: string;
  format: string;
  quality: string | number;
  width: string | number;
  height: string | number;
  isOptimized: boolean;
  isResponsive: boolean;
  suggestedImprovements: string[];
  estimatedSizeReduction?: number;
}

// Type for image diagnostic result
export interface ImageDiagnosticResult {
  summary: {
    totalImagesRendered: number;
    totalImagesWithIssues: number;
    totalDownloadedBytes: number;
    estimatedPerformanceImpact: string;
  };
  detailedIssues: {
    url: string;
    element: HTMLImageElement;
    issues: string[];
    dimensions?: {
      natural: { width: number, height: number };
      display: { width: number, height: number };
    }
  }[];
}
