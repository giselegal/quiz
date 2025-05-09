
// This file now serves as a facade/aggregator for the modularized image utilities
import { BankImage } from '@/data/imageBank';
import { PreloadOptions } from './images/types';

// Import and re-export functionality from modules
import { initializeImageCache, getImageMetadata } from './images/caching';
import { 
  optimizeCloudinaryUrl, 
  getOptimizedImage, 
  getLowQualityPlaceholder, 
  getOptimizedImageUrl,
  getResponsiveImageSources
} from './images/optimization';
import { 
  isImagePreloaded, 
  preloadImagesByIds, 
  preloadImagesByUrls, 
  preloadImages,
  preloadCriticalImages,
  preloadImagesByCategory,
  getLowQualityImage
} from './images/preloading';

// Initialize the cache
initializeImageCache();

// Re-export all functions for backward compatibility
export {
  // From caching module
  getImageMetadata,
  
  // From optimization module
  optimizeCloudinaryUrl,
  getOptimizedImage,
  getLowQualityPlaceholder,
  getOptimizedImageUrl,
  getResponsiveImageSources,
  
  // From preloading module
  isImagePreloaded,
  preloadImagesByIds,
  preloadImagesByUrls,
  preloadImages,
  preloadCriticalImages,
  preloadImagesByCategory,
  getLowQualityImage
};

// Types for backward compatibility
export type { BankImage, PreloadOptions };

// Default export with all functions
export default {
  // From caching module
  getImageMetadata,
  
  // From optimization module
  getOptimizedImage,
  getLowQualityPlaceholder,
  getOptimizedImageUrl,
  getResponsiveImageSources,
  
  // From preloading module
  isImagePreloaded,
  preloadImages,
  preloadImagesByIds,
  preloadImagesByUrls,
  preloadImagesByCategory,
  preloadCriticalImages,
  getLowQualityImage
};
