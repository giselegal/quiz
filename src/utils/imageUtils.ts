
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
