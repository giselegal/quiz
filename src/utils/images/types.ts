
export type PreloadOptions = {
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | string; // Allow string for flexibility
  width?: number;
  height?: number;
  timeout?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  batchSize?: number;
  generateLowQuality?: boolean;
  crop?: 'fill' | 'limit' | 'fit';
  responsive?: boolean; // Added for ImageDiagnosticDebugger
};

export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type ImageCacheEntry = {
  url: string;
  loadStatus?: LoadStatus;
  element?: HTMLImageElement;
  optimizedUrl?: string;
  lowQualityUrl?: string;
};

export interface PreloadImageDefinition {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: number;
}

// Image Analysis types
export interface ImageAnalysis {
  url: string;
  size?: number;
  dimensions?: { width: number; height: number };
  format?: string;
  optimized?: boolean;
  recommendations?: string[];
  quality?: number; // Added for ImageDiagnosticDebugger
  isResponsive?: boolean; // Added for ImageDiagnosticDebugger
  suggestedImprovements?: string[]; // Added for ImageDiagnosticDebugger
}

export interface ImageDiagnosticResult {
  status: 'success' | 'error';
  analysis?: ImageAnalysis;
  error?: string;
  summary?: { // Added for ImageDiagnosticDebugger
    totalImages?: number;
    optimizedImages?: number;
    totalSize?: number;
    potentialSavings?: number;
  };
  detailedIssues?: string[]; // Added for ImageDiagnosticDebugger
}
