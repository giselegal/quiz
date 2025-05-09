
import { BankImage } from '@/data/imageBank';

/**
 * Interface for the image cache entry
 */
export interface ImageCacheEntry {
  url: string;
  loadStatus: 'idle' | 'loading' | 'loaded' | 'error';
  element?: HTMLImageElement;
  optimizedUrl?: string;
  lowQualityUrl?: string;
}

/**
 * Image preload options
 */
export interface PreloadOptions {
  quality?: number;
  width?: number;
  height?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  batchSize?: number;
  generateLowQuality?: boolean;
}

/**
 * Image optimization options
 */
export interface OptimizationOptions {
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit';
}
