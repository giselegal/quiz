
import { BankImage, getAllImages, getImageBySrc, getImageById } from '@/data/imageBank';
import { ImageCacheEntry } from './types';

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
 * Update the image cache with new entry
 */
export const updateImageCache = (
  url: string, 
  entry: Partial<ImageCacheEntry> & { url: string }
): void => {
  if (imageCache.has(url)) {
    const existingEntry = imageCache.get(url)!;
    imageCache.set(url, { ...existingEntry, ...entry });
  } else {
    imageCache.set(url, {
      url: entry.url,
      lastAccessed: Date.now(),
      ...entry
    });
  }
};

/**
 * Get an image entry from cache
 */
export const getImageFromCache = (url: string): ImageCacheEntry | undefined => {
  return imageCache.get(url);
};

/**
 * Check if an image is in cache with specified status
 */
export const hasImageWithStatus = (url: string, status: 'idle' | 'loading' | 'loaded' | 'error'): boolean => {
  if (imageCache.has(url)) {
    const entry = imageCache.get(url);
    return entry?.loadStatus === status;
  }
  return false;
};

// Initialize the cache on module load
initializeImageCache();

// Export the cache for use in other modules
export { imageCache, urlToMetadataCache };
