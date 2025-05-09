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
  generateLowQuality?: boolean;
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
  const optimizedUrl = optimizeCloudinaryUrl(url, { quality: 80, format: 'auto' });
  
  // Check if the image is in the cache and loaded
  if (imageCache.has(optimizedUrl)) {
    const entry = imageCache.get(optimizedUrl)!;
    return entry.loadStatus === 'loaded';
  }
  
  return false;
};

/**
 * Generate low quality placeholder URL for cloudinary images
 * @param url Original image URL
 */
export const getLowQualityPlaceholder = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) return '';
  
  // Extract base URL parts to create tiny placeholder
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  // Create a very low quality, small version for placeholders
  return `${baseUrlParts[0]}/upload/f_auto,q_10,w_20/${baseUrlParts[1].split('/').slice(1).join('/')}`;
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
  // Create temporary BankImage objects for each URL
  const tempImages: BankImage[] = urls.map(url => ({
    id: url,
    src: url,
    alt: 'Preloaded image',
    category: 'external',
  }));
  
  const { generateLowQuality = true, ...restOptions } = options;
  
  // If requested, also generate and cache low quality placeholders
  if (generateLowQuality) {
    urls.forEach(url => {
      const lowQualityUrl = getLowQualityPlaceholder(url);
      if (lowQualityUrl) {
        // Add low quality version to cache
        const optimizedUrl = optimizeCloudinaryUrl(url, { 
          quality: options.quality || 80,  // Reduced from 95 to 80
          format: 'auto',
          width: options.width,
          height: options.height
        });
        
        // Update cache with low quality URL if entry exists
        if (imageCache.has(optimizedUrl)) {
          const entry = imageCache.get(optimizedUrl)!;
          imageCache.set(optimizedUrl, {
            ...entry,
            lowQualityUrl
          });
        }
        
        // Also preload the low quality version
        const img = new Image();
        img.src = lowQualityUrl;
        img.decoding = "sync"; // Fast decode for placeholders
        img.fetchPriority = "high"; // High priority for tiny placeholders
      }
    });
  }
  
  return preloadImages(tempImages, restOptions);
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
    batchSize = 3,
    generateLowQuality = true
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
      
      // Generate low quality placeholder if needed
      let lowQualityUrl;
      if (generateLowQuality && img.src.includes('cloudinary.com')) {
        lowQualityUrl = getLowQualityPlaceholder(img.src);
      }
      
      // Mark as loading
      imageCache.set(optimizedUrl, {
        url: img.src,
        loadStatus: 'loading',
        lowQualityUrl
      });
      
      const imgElement = new Image();
      
      imgElement.onload = () => {
        // Update cache with loaded status
        imageCache.set(optimizedUrl, {
          url: img.src,
          loadStatus: 'loaded',
          element: imgElement,
          optimizedUrl,
          lowQualityUrl
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
          loadStatus: 'error',
          lowQualityUrl
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
 * Get a low quality placeholder for an image URL
 * @param url Original image URL
 */
export const getLowQualityImage = (url: string): string => {
  if (!url) return '';
  
  // Check if we already have this in the cache
  const optimizedUrl = optimizeCloudinaryUrl(url, { quality: 95, format: 'auto' });
  if (imageCache.has(optimizedUrl)) {
    const entry = imageCache.get(optimizedUrl)!;
    if (entry.lowQualityUrl) return entry.lowQualityUrl;
  }
  
  // Generate a low quality version
  return getLowQualityPlaceholder(url);
};

/**
 * Preload critical images for a page
 * @param page 'intro', 'quiz', 'results' or 'strategic'
 */
export const preloadCriticalImages = (page: 'intro' | 'quiz' | 'results' | 'strategic') => {
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
      // Also preload transformation images
      preloadImagesByCategory('transformation', { quality: 95, batchSize: 2 });
      categoryFilter = undefined;
      break;
    case 'strategic':
      categoryFilter = 'strategic';
      minPriority = 3;
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

/**
 * Preload images from a specific category
 * @param category Category name to preload
 * @param options Preload options
 */
export const preloadImagesByCategory = (
  category: string,
  options: PreloadOptions = {}
) => {
  const images = getAllImages().filter(img => img.category === category);
  
  if (images.length > 0) {
    console.log(`Preloading ${images.length} images from ${category} category`);
    preloadImages(images, options);
  }
};

/**
 * Create responsive image sources for different screen sizes
 * @param url Base image URL
 * @param sizes Array of sizes to generate
 * @return Object with srcset and sizes attributes
 */
export const getResponsiveImageSources = (
  url: string,
  sizes: number[] = [400, 600, 800, 1200]
): { srcSet: string, sizes: string } => {
  if (!url || !url.includes('cloudinary.com')) {
    return { srcSet: url, sizes: '100vw' };
  }
  
  // Extract base URL parts
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return { srcSet: url, sizes: '100vw' };
  
  // Generate srcSet with multiple sizes
  const srcSet = sizes.map(size => {
    const optimizedUrl = `${baseUrlParts[0]}/upload/f_auto,q_80,w_${size}/${baseUrlParts[1].split('/').slice(1).join('/')}`;
    return `${optimizedUrl} ${size}w`;
  }).join(', ');
  
  return {
    srcSet,
    sizes: '(max-width: 768px) 100vw, 50vw'
  };
};

/**
 * Get an optimized version of any image URL with explicit dimensions
 * @param url Original image URL
 * @param options Width, height, and quality options
 */
export const getOptimizedImageUrl = (
  url: string, 
  options: { width?: number, height?: number, quality?: number } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Extract base URL parts
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  const { width = 800, quality = 80 } = options;
  
  // Build transformation string
  let transformString = `f_auto,q_${quality}`;
  
  if (width) {
    transformString += `,w_${width}`;
  }
  
  if (options.height) {
    transformString += `,h_${options.height}`;
  }
  
  // Return optimized URL
  return `${baseUrlParts[0]}/upload/${transformString}/${baseUrlParts[1].split('/').slice(1).join('/')}`;
};

// Export new utility functions
export { getOptimizedImageUrl, getResponsiveImageSources };

// Initialize the cache on module load
initializeImageCache();

export default {
  preloadImages,
  preloadImagesByIds,
  preloadImagesByUrls,
  preloadImagesByCategory,
  isImagePreloaded,
  getImageMetadata,
  preloadCriticalImages,
  getOptimizedImage,
  getLowQualityPlaceholder,
  getLowQualityImage
};
