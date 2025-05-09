/**
 * Helper function to generate Cloudinary optimization parameters
 * @param url Original Cloudinary URL
 * @param options Optimization options
 * @returns Optimized Cloudinary URL
 */
export const optimizeCloudinaryUrl = (
  url: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
    crop?: 'fill' | 'fit' | 'limit';
  } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Default optimization options with better quality/size tradeoff
  const defaults = {
    width: 0,
    height: 0,
    quality: 80, // Reduced from 95 to 80 for better performance
    format: 'auto',
    crop: 'fill'
  };

  const settings = { ...defaults, ...options };
  
  // Extract base URL parts to handle URLs with existing transformations
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  // Extract any path after the version ID (vXXXXXX)
  const secondPart = baseUrlParts[1];
  const parts = secondPart.split('/');
  
  // Check if there are existing transformations
  const hasTransformations = parts[0].includes('_') || parts[0].includes(',') || parts[0].startsWith('f_');
  
  // Build transformation string
  let transformations = `f_${settings.format}`;
  
  if (settings.quality) {
    transformations += `,q_${settings.quality}`;
  }
  
  if (settings.width && settings.height) {
    transformations += `,c_${settings.crop},w_${settings.width},h_${settings.height}`;
  } else if (settings.width) {
    transformations += `,w_${settings.width}`;
  } else if (settings.height) {
    transformations += `,h_${settings.height}`;
  }
  
  // Apply transformations to URL with proper handling of existing transformations
  if (hasTransformations) {
    // URL already has transformations, replace them
    return `${baseUrlParts[0]}/upload/${transformations}/${parts.slice(1).join('/')}`;
  } else {
    // URL has no transformations, add them
    return `${baseUrlParts[0]}/upload/${transformations}/${secondPart}`;
  }
};

/**
 * Strategic image preloading system
 * - Supports priority levels and callbacks
 * - Avoids duplicate preloads
 * - Tracks loading state
 */
const preloadedImages = new Set<string>();
const preloadQueue: Array<{url: string, priority: number, onLoad?: () => void}> = [];
let isProcessingQueue = false;

/**
 * Preload images with priority system
 * @param urls Array of image URLs or config objects to preload
 * @param options Additional options for batch preloading
 */
export const preloadImages = (
  urls: Array<string | {url: string, priority?: number, onLoad?: () => void}>,
  options: {
    batchSize?: number, 
    quality?: number,
    onComplete?: () => void
  } = {}
): void => {
  const { batchSize = 3, quality = 95, onComplete } = options;
  
  // Process each URL, standardizing the format
  const processedUrls = urls.map(item => {
    if (typeof item === 'string') {
      return {
        url: optimizeCloudinaryUrl(item, { quality, format: 'auto' }),
        priority: 1,
      };
    } else {
      return {
        url: optimizeCloudinaryUrl(item.url, { quality, format: 'auto' }),
        priority: item.priority || 1,
        onLoad: item.onLoad
      };
    }
  });
  
  // Add to queue, avoiding duplicates
  processedUrls.forEach(item => {
    if (!preloadedImages.has(item.url)) {
      preloadQueue.push(item);
    }
  });
  
  // Sort queue by priority (higher numbers = higher priority)
  preloadQueue.sort((a, b) => b.priority - a.priority);
  
  // Start processing if not already in progress
  if (!isProcessingQueue) {
    processPreloadQueue(batchSize, onComplete);
  }
};

/**
 * Process the preload queue
 * @param batchSize Number of images to load concurrently
 * @param onComplete Callback when all are loaded
 */
const processPreloadQueue = (batchSize: number, onComplete?: () => void): void => {
  if (preloadQueue.length === 0) {
    isProcessingQueue = false;
    if (onComplete) onComplete();
    return;
  }

  isProcessingQueue = true;
  const batch = preloadQueue.splice(0, batchSize);
  let completedCount = 0;

  batch.forEach(item => {
    const img = new Image();
    
    img.onload = () => {
      preloadedImages.add(item.url);
      if (item.onLoad) item.onLoad();
      completedCount++;
      
      if (completedCount === batch.length) {
        // Process next batch when current batch is done
        processPreloadQueue(batchSize, onComplete);
      }
    };
    
    img.onerror = () => {
      console.error(`Failed to preload image: ${item.url}`);
      completedCount++;
      
      if (completedCount === batch.length) {
        // Continue with next batch even if there were errors
        processPreloadQueue(batchSize, onComplete);
      }
    };
    
    img.src = item.url;
  });
};

/**
 * Check if an image has already been preloaded
 * @param url The image URL to check
 * @returns Boolean indicating if image is already preloaded
 */
export const isImagePreloaded = (url: string): boolean => {
  const optimizedUrl = optimizeCloudinaryUrl(url, { quality: 95, format: 'auto' });
  return preloadedImages.has(optimizedUrl);
};

/**
 * Get optimized Cloudinary params string
 * @returns Optimized parameter string to append to Cloudinary URLs
 */
export const getOptimizedCloudinaryParams = (): string => {
  return 'q_95,f_auto';
};

/**
 * Generate a responsive image URL with different sizes
 * @param baseUrl The base Cloudinary URL
 * @param sizes Array of width sizes to generate
 * @returns Object with srcset and sizes attributes for responsive images
 */
export const getResponsiveImageUrl = (
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280]
): { srcSet: string, sizes: string } => {
  if (!baseUrl || !baseUrl.includes('cloudinary.com')) {
    return { srcSet: baseUrl, sizes: '100vw' };
  }
  
  const srcSet = sizes
    .map(size => {
      const optimizedUrl = optimizeCloudinaryUrl(baseUrl, { 
        width: size,
        quality: 95,
        format: 'auto'
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
  
  return {
    srcSet,
    sizes: '(max-width: 768px) 100vw, 50vw'
  };
};

/**
 * Create a low quality image placeholder URL for progressive loading
 * @param url Original URL of the image
 * @returns Low quality placeholder image URL
 */
export const getLowQualityPlaceholder = (url: string, options: { width?: number, quality?: number } = {}): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  const { width = 20, quality = 10 } = options;
  
  // Extract base URL parts
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  // Create an optimized tiny placeholder
  return `${baseUrlParts[0]}/upload/f_auto,q_${quality},w_${width}/${baseUrlParts[1].split('/').slice(1).join('/')}`;
};

/**
 * Preload the next question images
 * @param nextQuestionImages Array of image URLs for the next question
 */
export const preloadNextQuestionImages = (nextQuestionImages: string[]): void => {
  if (!nextQuestionImages || nextQuestionImages.length === 0) {
    return;
  }
  
  // Preload with higher priority
  preloadImages(
    nextQuestionImages.map(url => ({
      url,
      priority: 2
    })),
    { quality: 95, batchSize: 4 }
  );
};

/**
 * Intelligently extract dimensions from Cloudinary URLs
 * @param url Cloudinary image URL
 * @returns Object with width and height if found
 */
export const extractDimensionsFromUrl = (url: string): { width?: number, height?: number } => {
  if (!url || !url.includes('cloudinary.com')) {
    return {};
  }
  
  const dimensions: { width?: number, height?: number } = {};
  
  // Look for width parameter
  const widthMatch = url.match(/[,/]w_(\d+)/);
  if (widthMatch && widthMatch[1]) {
    dimensions.width = parseInt(widthMatch[1], 10);
  }
  
  // Look for height parameter
  const heightMatch = url.match(/[,/]h_(\d+)/);
  if (heightMatch && heightMatch[1]) {
    dimensions.height = parseInt(heightMatch[1], 10);
  }
  
  return dimensions;
};

/**
 * Check if a browser supports modern image formats
 * @returns Object with support flags
 */
export const checkImageFormatSupport = (): { webp: boolean, avif: boolean } => {
  const result = { webp: false, avif: false };
  
  // Check for WebP support (simplified version)
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      result.webp = true;
    }
  }
  
  // AVIF detection would require more complex logic
  // For now, we assume no AVIF support
  
  return result;
};

/**
 * Get optimal format based on browser support
 * @returns Best available format
 */
export const getOptimalImageFormat = (): 'auto' | 'webp' | 'jpg' => {
  const support = checkImageFormatSupport();
  
  if (support.avif) return 'auto'; // Cloudinary will serve AVIF if available
  if (support.webp) return 'webp';
  return 'auto'; // Default to auto which will typically serve JPEG
};
