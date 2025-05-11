
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
  responsive?: boolean;
};

export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type ImageCacheEntry = {
  url: string;
  loadStatus?: LoadStatus;
  element?: HTMLImageElement;
  optimizedUrl?: string;
  lowQualityUrl?: string;
  lastAccessed?: number; // Adding missing property
};

export interface PreloadImageDefinition {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: number;
}

// Image Settings type needed by optimization files
export type ImageSettings = {
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  width?: number;
  height?: number;
  crop?: 'fill' | 'limit' | 'fit';
};

// Image Analysis types
export interface ImageAnalysis {
  url: string;
  size?: number;
  dimensions?: { width: number; height: number };
  format?: string;
  optimized?: boolean;
  recommendations?: string[];
  quality?: number | string; // Support both number and string
  isResponsive?: boolean;
  suggestedImprovements?: string[];
  estimatedSizeReduction?: number;
}

export interface ImageDiagnosticResult {
  status?: 'success' | 'error';
  analysis?: ImageAnalysis;
  error?: string;
  summary?: {
    totalImages?: number;
    optimizedImages?: number;
    totalSize?: number;
    potentialSavings?: number;
    totalImagesRendered?: number;
    totalImagesWithIssues?: number;
    totalDownloadedBytes?: number;
    estimatedPerformanceImpact?: string;
  };
  detailedIssues?: Array<{
    url: string;
    element: HTMLImageElement;
    issues: string[];
    dimensions?: {
      natural: { width: number; height: number };
      display: { width: number; height: number };
    };
  }>;
}
