// Import necessary types
import { PreloadOptions, ImageCacheEntry, LoadStatus, PreloadImageDefinition } from './types';
import { initializeImageCache, getImageMetadata } from './caching';
import { optimizeCloudinaryUrl, getLowQualityPlaceholder } from './optimization';

// Timeout constants
const DEFAULT_PRELOAD_TIMEOUT = 5000;

// Cache to track preloaded images
const preloadedImages = new Map<string, ImageCacheEntry>();

/**
 * Check if an image is already preloaded
 */
export const isImagePreloaded = (url: string): boolean => {
  return preloadedImages.has(url) && preloadedImages.get(url)?.loadStatus === 'loaded';
};

/**
 * Get a low-quality placeholder for an image
 */
export const getLowQualityImage = (url: string): string => {
  if (!url) return '';
  
  // Check if in cache first
  const cacheEntry = preloadedImages.get(url);
  if (cacheEntry?.lowQualityUrl) {
    return cacheEntry.lowQualityUrl;
  }
  
  // Create a low quality placeholder
  return getLowQualityPlaceholder(url, { width: 20, quality: 10 });
};

/**
 * Preload a batch of images by URLs
 */
export const preloadImagesByUrls = async (
  urls: string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  if (!urls || urls.length === 0) return false;
  
  const {
    timeout = DEFAULT_PRELOAD_TIMEOUT,
    quality = 80,
    format = 'auto' as 'auto' | 'webp' | 'avif',
    width,
    onProgress,
    batchSize = 3,
    generateLowQuality = true
  } = options;
  
  // Track overall progress
  let loaded = 0;
  const total = urls.length;
  
  // Process in batches for better performance
  const batchProcess = async (batch: string[]) => {
    const promises = batch.map(url => {
      return new Promise<boolean>((resolve) => {
        // Skip if already loaded
        if (isImagePreloaded(url)) {
          loaded++;
          if (onProgress) onProgress(loaded, total);
          resolve(true);
          return;
        }
        
        // Create an optimized URL
        const optimizedUrl = optimizeCloudinaryUrl(url, {
          quality,
          format: format as 'auto' | 'webp' | 'avif', // Type assertion
          width: width || undefined
        });
        
        // Track in cache
        if (!preloadedImages.has(url)) {
          preloadedImages.set(url, {
            url,
            loadStatus: 'loading',
            optimizedUrl
          });
        }
        
        // Create image element
        const img = new Image();
        
        // Create a low quality placeholder if requested
        if (generateLowQuality) {
          const lowQualityUrl = getLowQualityPlaceholder(url, { width: 30, quality: 20 });
          preloadedImages.set(url, {
            ...preloadedImages.get(url)!,
            lowQualityUrl
          });
          
          // Optionally preload the low quality version too
          const lqImg = new Image();
          lqImg.src = lowQualityUrl;
        }
        
        // Set up load handlers
        const timeoutId = setTimeout(() => {
          resolve(false);
          preloadedImages.set(url, {
            ...preloadedImages.get(url)!,
            loadStatus: 'error'
          });
        }, timeout);
        
        img.onload = () => {
          clearTimeout(timeoutId);
          preloadedImages.set(url, {
            ...preloadedImages.get(url)!,
            loadStatus: 'loaded',
            element: img,
            lastAccessed: Date.now()
          });
          loaded++;
          if (onProgress) onProgress(loaded, total);
          resolve(true);
        };
        
        img.onerror = () => {
          clearTimeout(timeoutId);
          preloadedImages.set(url, {
            ...preloadedImages.get(url)!,
            loadStatus: 'error'
          });
          loaded++;
          if (onProgress) onProgress(loaded, total);
          resolve(false);
        };
        
        // Start loading
        img.src = optimizedUrl;
      });
    });
    
    return Promise.all(promises);
  };
  
  // Process in batches
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await batchProcess(batch);
  }
  
  // Return true if all were loaded successfully
  return loaded === total;
};

/**
 * Preload images by specific IDs from the image bank
 */
export const preloadImagesByIds = async (
  ids: string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  // Implementation for preloading by IDs
  // This would call preloadImagesByUrls after retrieving URLs from IDs
  return false; // Placeholder
};

/**
 * Preload images by category
 */
export const preloadImagesByCategory = async (
  category: string,
  options: PreloadOptions = {}
): Promise<boolean> => {
  // Implementation for preloading by category
  return false; // Placeholder
};

/**
 * Preload critical images for a specific section
 */
export const preloadCriticalImages = async (
  section: string | string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  // If section is a string, convert to array
  const sections = typeof section === 'string' ? [section] : section;
  
  // If section is an array of URLs, use that directly
  if (Array.isArray(section) && section.length > 0 && typeof section[0] === 'string') {
    return preloadImagesByUrls(section as string[], options);
  }
  
  // Implementation for preloading critical images by section
  return false; // Placeholder
};

/**
 * Preload images with custom configuration
 */
export const preloadImages = async (
  images: PreloadImageDefinition[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  if (!images || images.length === 0) return false;
  
  const urls = images.map(img => img.url);
  return preloadImagesByUrls(urls, options);
};

export default {
  isImagePreloaded,
  preloadImagesByUrls,
  preloadImagesByIds,
  preloadImagesByCategory,
  preloadCriticalImages,
  preloadImages,
  getLowQualityImage
};
