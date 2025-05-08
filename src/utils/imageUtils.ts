
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

  // Default optimization options with higher quality
  const defaults = {
    width: 0,
    height: 0,
    quality: 95, // Increased from 90 to 95 for better image quality
    format: 'auto',
    crop: 'fill'
  };

  const settings = { ...defaults, ...options };
  
  // Check if URL already has transformation parameters
  if (
    url.includes('/upload/q_') || 
    url.includes('/upload/f_') ||
    url.includes('?q=')
  ) {
    // If URL already has quality and format parameters, don't modify it
    return url;
  }
  
  // Build transformation string
  let transformations = 'f_' + settings.format;
  
  if (settings.quality) {
    transformations += ',q_' + settings.quality;
  }
  
  if (settings.width && settings.height) {
    transformations += `,c_${settings.crop},w_${settings.width},h_${settings.height}`;
  } else if (settings.width) {
    transformations += `,w_${settings.width}`;
  } else if (settings.height) {
    transformations += `,h_${settings.height}`;
  }
  
  // Apply transformations to URL, ensuring we're not duplicating parameters
  return url.replace(/\/upload\//, `/upload/${transformations}/`);
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
export const getLowQualityPlaceholder = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Create a very small, blurry placeholder
  return optimizeCloudinaryUrl(url, {
    width: 20,
    quality: 40,
    format: 'auto'
  });
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
