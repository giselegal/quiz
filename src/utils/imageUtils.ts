
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
    quality: 95,
    format: 'auto',
    crop: 'fill'
  };

  const settings = { ...defaults, ...options };
  
  // Extract the upload path from the URL
  const uploadMatch = url.match(/\/upload(\/.*)/);
  if (!uploadMatch) {
    return url;
  }
  
  // Check if the URL already has transformation parameters
  if (url.includes('/upload/q_') || url.includes('/upload/f_')) {
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
  
  // Apply transformations to URL
  return url.replace(/\/upload/, `/upload/${transformations}`);
};

/**
 * Preload critical images for faster rendering
 * @param urls Array of image URLs to preload with quality optimization
 */
export const preloadImages = (urls: string[]): void => {
  urls.forEach(url => {
    const img = new Image();
    // Optimize Cloudinary URLs before preloading
    img.src = optimizeCloudinaryUrl(url, { quality: 95, format: 'auto' });
  });
};

/**
 * Get optimized Cloudinary params string
 * @returns Optimized parameter string to append to Cloudinary URLs
 */
export const getOptimizedCloudinaryParams = (): string => {
  return 'q_95,f_auto';
};
