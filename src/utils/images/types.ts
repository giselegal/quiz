
export type PreloadOptions = {
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  width?: number;
  height?: number;
  timeout?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  batchSize?: number;
  generateLowQuality?: boolean;
  crop?: 'fill' | 'limit' | 'fit';
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

// Add missing types needed by ImageDiagnosticDebugger
export interface ImageAnalysis {
  url: string;
  size?: number;
  dimensions?: { width: number; height: number };
  format?: string;
  optimized?: boolean;
  recommendations?: string[];
}

export interface ImageDiagnosticResult {
  status: 'success' | 'error';
  analysis?: ImageAnalysis;
  error?: string;
}
