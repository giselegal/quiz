
import { BankImage, getAllImages, getImageBySrc, getImageById } from '@/data/imageBank';
import { optimizeCloudinaryUrl } from './imageUtils';

/**
 * Interface for the image cache entry
 */
interface ImageCacheEntry {
  url: string;
  loadStatus: 'idle' | 'loading' | 'loaded' | 'error';
  element?: HTMLImageElement;
  optimizedUrl?: string;
  lowQualityUrl?: string;
}

/**
 * Image preload options
 */
interface PreloadOptions {
  quality?: number;
  width?: number;
  height?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  batchSize?: number;
}

// Cache to store loaded image statuses
const imageCache = new Map<string, ImageCacheEntry>();

// Cache to store bank image metadata by URL
const urlToMetadataCache = new Map<string, BankImage>();

/**
 * Initialize the image bank cache for faster lookups
 */
export const initializeImageCache = () => {
  const allImages = getAllImages();
  
  // Populate the URL to metadata cache
  allImages.forEach(image => {
    const normalizedSrc = image.src.split('?')[0]; // Remove query parameters
    urlToMetadataCache.set(normalizedSrc, image);
  });
  
  console.log(`Image manager initialized with ${allImages.length} images`);
};

/**
 * Get metadata for an image by URL
 * @param url Image URL
 */
export const getImageMetadata = (url: string): BankImage | undefined => {
  if (!url) return undefined;
  
  // First check cache
  const normalizedUrl = url.split('?')[0];
  if (urlToMetadataCache.has(normalizedUrl)) {
    return urlToMetadataCache.get(normalizedUrl);
  }
  
  // If not in cache, try to find in bank
  const image = getImageBySrc(url);
  if (image) {
    urlToMetadataCache.set(normalizedUrl, image);
    return image;
  }
  
  return undefined;
};

/**
 * Check if an image is preloaded
 * @param url URL of the image to check
 */
export const isImagePreloaded = (url: string): boolean => {
  if (!url) return false;
  
  // First optimize the URL if needed
  const optimizedUrl = optimizeCloudinaryUrl(url, { quality: 95, format: 'auto' });
  
  // Check if the image is in the cache and loaded
  if (imageCache.has(optimizedUrl)) {
    const entry = imageCache.get(optimizedUrl)!;
    return entry.loadStatus === 'loaded';
  }
  
  return false;
};

/**
 * Preload specific images from the bank
 * @param imageIds Array of image IDs to preload
 * @param options Preload options
 */
export const preloadImagesByIds = (
  imageIds: string[],
  options: PreloadOptions = {}
) => {
  const images = imageIds
    .map(id => getImageById(id))
    .filter(img => img !== undefined) as BankImage[];
  
  return preloadImages(images, options);
};

/**
 * Preload images by their source URLs
 * @param urls Array of image URLs to preload
 * @param options Preload options
 */
export const preloadImagesByUrls = (
  urls: string[],
  options: PreloadOptions = {}
) => {
  return preloadImages(
    urls.map(url => ({
      src: url,
      id: url,
      alt: '',
      category: 'external'
    })),
    options
  );
};

/**
 * Preload bank images
 * @param images Array of bank images to preload
 * @param options Preload options 
 */
export const preloadImages = (
  images: BankImage[],
  options: PreloadOptions = {}
) => {
  const {
    quality = 95,
    width,
    height,
    onProgress,
    onComplete,
    batchSize = 3
  } = options;
  
  // Skip any already loaded or loading images
  const imagesToLoad = images.filter(img => {
    const optimizedUrl = optimizeCloudinaryUrl(img.src, { 
      quality, 
      format: 'auto',
      width,
      height
    });
    
    if (imageCache.has(optimizedUrl)) {
      const status = imageCache.get(optimizedUrl)!.loadStatus;
      return status !== 'loaded' && status !== 'loading';
    }
    
    return true;
  });
  
  if (imagesToLoad.length === 0) {
    if (onComplete) onComplete();
    return;
  }
  
  // Load images in batches
  let loadedCount = 0;
  const totalCount = imagesToLoad.length;
  
  const loadNextBatch = (startIndex: number) => {
    const batch = imagesToLoad.slice(startIndex, startIndex + batchSize);
    if (batch.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    
    let batchLoaded = 0;
    
    batch.forEach(img => {
      const optimizedUrl = optimizeCloudinaryUrl(img.src, { 
        quality, 
        format: 'auto',
        width: width || img.width,
        height: height || img.height
      });
      
      // Mark as loading
      imageCache.set(optimizedUrl, {
        url: img.src,
        loadStatus: 'loading'
      });
      
      const imgElement = new Image();
      
      imgElement.onload = () => {
        // Update cache with loaded status
        imageCache.set(optimizedUrl, {
          url: img.src,
          loadStatus: 'loaded',
          element: imgElement,
          optimizedUrl
        });
        
        loadedCount++;
        batchLoaded++;
        
        if (onProgress) {
          onProgress(loadedCount, totalCount);
        }
        
        if (batchLoaded === batch.length) {
          loadNextBatch(startIndex + batchSize);
        }
      };
      
      imgElement.onerror = () => {
        // Mark as error
        imageCache.set(optimizedUrl, {
          url: img.src,
          loadStatus: 'error'
        });
        
        console.error(`Failed to preload image: ${img.src}`);
        
        loadedCount++;
        batchLoaded++;
        
        if (onProgress) {
          onProgress(loadedCount, totalCount);
        }
        
        if (batchLoaded === batch.length) {
          loadNextBatch(startIndex + batchSize);
        }
      };
      
      // Start loading the image
      imgElement.src = optimizedUrl;
    });
  };
  
  // Start loading the first batch
  loadNextBatch(0);
};

/**
 * Get an optimized image URL with caching
 * @param url Original image URL
 * @param options Optimization options
 */
export const getOptimizedImage = (
  url: string,
  options: {
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
    width?: number;
    height?: number;
  } = {}
): string => {
  if (!url) return '';
  
  const optimizedUrl = optimizeCloudinaryUrl(url, {
    quality: options.quality || 95,
    format: options.format || 'auto',
    width: options.width,
    height: options.height
  });
  
  return optimizedUrl;
};

/**
 * Preload critical images for a page
 * @param page 'intro', 'quiz', or 'results'
 */
export const preloadCriticalImages = (page: 'intro' | 'quiz' | 'results') => {
  // Determine which images are critical based on the page
  let minPriority = 4;
  let categoryFilter: string | undefined;
  
  switch (page) {
    case 'intro':
      categoryFilter = 'branding';
      break;
    case 'quiz':
      categoryFilter = undefined; // All high priority images
      break;
    case 'results':
      minPriority = 3;
      categoryFilter = undefined;
      break;
  }
  
  // Get high priority images, filtered by category if needed
  const highPriorityImages = getAllImages().filter(img => {
    const meetsMinPriority = (img.preloadPriority || 0) >= minPriority;
    return categoryFilter 
      ? meetsMinPriority && img.category === categoryFilter
      : meetsMinPriority;
  });
  
  // Preload these images
  preloadImages(highPriorityImages, {
    quality: 95,
    batchSize: 3,
    onComplete: () => {
      console.log(`Preloaded ${highPriorityImages.length} critical images for ${page}`);
    }
  });
};

// Initialize the cache on module load
initializeImageCache();

export default {
  preloadImages,
  preloadImagesByIds,
  preloadImagesByUrls,
  isImagePreloaded,
  getImageMetadata,
  preloadCriticalImages,
  getOptimizedImage
};
