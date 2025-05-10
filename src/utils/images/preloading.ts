
import { BankImage, getImageById } from '@/data/imageBank';
import { PreloadOptions } from './types';
import { optimizeCloudinaryUrl, getLowQualityPlaceholder } from './optimization';
import { updateImageCache, hasImageWithStatus, imageCache } from './caching';
import { getAllImages } from '@/data/imageBank';

/**
 * Check if an image is preloaded
 * @param url URL of the image to check
 */
export const isImagePreloaded = (url: string): boolean => {
  if (!url) return false;
  
  // First optimize the URL if needed
  const optimizedUrl = optimizeCloudinaryUrl(url, { quality: 80, format: 'auto' });
  
  // Check if the image is loaded
  return hasImageWithStatus(optimizedUrl, 'loaded');
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
    category: 'external',
    tags: [],
    alt: 'Preloaded image' // Add required alt property
  }));
  
  const { generateLowQuality = true, ...restOptions } = options;
  
  // If requested, also generate and cache low quality placeholders
  if (generateLowQuality) {
    urls.forEach(url => {
      const lowQualityUrl = getLowQualityPlaceholder(url, {
        width: 40,   // Better quality placeholders
        quality: 35  // Better quality placeholders
      });
      
      if (lowQualityUrl) {
        // Add low quality version to cache
        const optimizedUrl = optimizeCloudinaryUrl(url, { 
          quality: options.quality || 85, // Improved default quality
          format: 'auto',
          width: options.width,
          height: options.height
        });
        
        // Update cache with low quality URL
        updateImageCache(optimizedUrl, {
          url: url,
          lowQualityUrl: lowQualityUrl
        });
        
        // Also preload the low quality version
        const img = new Image();
        img.src = lowQualityUrl;
        img.decoding = "async"; // Allow async decode for better perf
        img.fetchPriority = "high"; // High priority for placeholders
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
    format = 'auto',
    onProgress,
    onComplete,
    batchSize = 3,
    generateLowQuality = true
  } = options;
  
  // Skip any already loaded or loading images
  const imagesToLoad = images.filter(img => {
    const optimizedUrl = optimizeCloudinaryUrl(img.src, { 
      quality, 
      format,
      width,
      height
    });
    
    return !hasImageWithStatus(optimizedUrl, 'loaded') && !hasImageWithStatus(optimizedUrl, 'loading');
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
        format,
        width: width || img.width,
        height: height || img.height
      });
      
      // Generate high quality placeholder if needed
      let lowQualityUrl;
      if (generateLowQuality && img.src.includes('cloudinary.com')) {
        // Usa a versão melhorada do placeholder com qualidade e tamanho aumentados
        lowQualityUrl = getLowQualityPlaceholder(img.src, {
          width: 40,
          quality: 35
        });
      }
      
      // Mark as loading
      updateImageCache(optimizedUrl, {
        url: img.src,
        loadStatus: 'loading',
        lowQualityUrl: lowQualityUrl
      });
      
      const imgElement = new Image();
      
      imgElement.onload = () => {
        // Update cache with loaded status
        updateImageCache(optimizedUrl, {
          url: img.src,
          loadStatus: 'loaded',
          element: imgElement,
          optimizedUrl,
          lowQualityUrl: lowQualityUrl
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
        updateImageCache(optimizedUrl, {
          url: img.src,
          loadStatus: 'error',
          lowQualityUrl: lowQualityUrl
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
 * Get a low quality placeholder for an image URL
 * @param url Original image URL
 */
export const getLowQualityImage = (url: string): string => {
  if (!url) return '';
  
  // Check if we already have this in the cache
  const optimizedUrl = optimizeCloudinaryUrl(url, { quality: 90, format: 'auto' });
  
  // Get cache entry first
  const cacheEntry = imageCache.get(optimizedUrl);
  
  // Then check if the cache entry has a lowQualityUrl
  if (cacheEntry && cacheEntry.lowQualityUrl) {
    return cacheEntry.lowQualityUrl;
  }
  
  // Make sure we add it to the cache properly
  updateImageCache(optimizedUrl, { url });
  
  // Generate a better quality version of the placeholder to avoid blurry images
  return getLowQualityPlaceholder(url, {
    width: 40,   // Increased from default 20px
    quality: 35  // Increased from default 10% 
  });
};

/**
 * Preload critical images for a page
 * @param page 'intro', 'quiz', 'results' or 'strategic'
 */
export const preloadCriticalImages = (page: 'intro' | 'quiz' | 'results' | 'strategic') => {
  // Determine which images are critical based on the page
  let minPriority = 4;
  let categoryFilter: string | undefined;
  let batchSize = 3; // Padrão
  
  switch (page) {
    case 'intro':
      categoryFilter = 'branding';
      batchSize = 2;
      // Apenas preload otimizadas do logo e imagens de marca
      preloadImagesByCategory('branding', { 
        quality: 90, 
        batchSize: 2,
        width: 160, // Reduzindo para apenas o tamanho visível inicialmente
        format: 'auto'
      });
      break;
    case 'quiz':
      categoryFilter = undefined; // All high priority images
      batchSize = 4; // Mais imagens em paralelo para quiz
      break;
    case 'results':
      minPriority = 3;
      batchSize = 2;
      // Otimização específica para imagens de transformação
      preloadImagesByCategory('transformation', { 
        quality: 85, 
        batchSize: 2,
        width: 640, // Largura reduzida para carregamento mais rápido
        format: 'webp' // Formato moderno mais eficiente
      });
      categoryFilter = undefined;
      break;
    case 'strategic':
      categoryFilter = 'strategic';
      minPriority = 3;
      batchSize = 3;
      break;
  }
  
  // Get high priority images, filtered by category if needed
  const highPriorityImages = getAllImages().filter(img => {
    const meetsMinPriority = (img.preloadPriority || 0) >= minPriority;
    return categoryFilter 
      ? meetsMinPriority && img.category === categoryFilter
      : meetsMinPriority;
  });
  
  // Calcula largura otimizada com base na página
  const optimalWidth = page === 'intro' ? 300 : 
                       page === 'results' ? 600 : 
                       page === 'strategic' ? 400 : 500;
  
  // Preload these images with optimized settings - revisados para melhor performance
  preloadImages(highPriorityImages, {
    quality: page === 'results' ? 85 : 90, // Qualidade adaptada por contexto
    batchSize: batchSize, // Configuração adaptada por contexto
    width: optimalWidth, // Largura adaptativa
    format: 'auto', // Auto format for best browser compatibility
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
