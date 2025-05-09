
import { OptimizationOptions } from './types';

/**
 * Helper function to generate Cloudinary optimization parameters
 * @param url Original Cloudinary URL
 * @param options Optimization options
 * @returns Optimized Cloudinary URL
 */
export const optimizeCloudinaryUrl = (
  url: string, 
  options: OptimizationOptions = {}
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
 * Generate a low quality placeholder URL for cloudinary images
 * @param url Original image URL
 * @param options Width and quality options
 */
export const getLowQualityPlaceholder = (url: string, options: { width?: number, quality?: number } = {}): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  const { width = 40, quality = 30 } = options;
  
  // Extract base URL parts
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  // Split the path to extract the version and file name
  const pathParts = baseUrlParts[1].split('/');
  const fileName = pathParts[pathParts.length - 1];
  
  // Create an optimized placeholder with better parameters
  return `${baseUrlParts[0]}/upload/f_auto,q_${quality},w_${width},e_blur:1000/${fileName}`;
};

/**
 * Get an optimized image URL with explicit dimensions
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
 * Get an optimized version of any image URL
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
  
  return optimizeCloudinaryUrl(url, {
    quality: options.quality || 95,
    format: options.format || 'auto',
    width: options.width,
    height: options.height
  });
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

/**
 * Extract dimensions from a Cloudinary URL
 * @param url Cloudinary image URL
 * @returns Width and height if found in URL
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
