
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllImages, 
  getImagesByCategory, 
  getImagesByStyleCategory,
  getImageById
} from '@/data/imageBank';
import { 
  preloadImages, 
  preloadImagesByIds, 
  preloadImagesByUrls, 
  preloadCriticalImages,
  preloadImagesByCategory
} from '@/utils/imageManager';
import type { BankImage } from '@/data/imageBank';
import type { StyleCategory } from '@/types/quiz';

interface UseImageBankProps {
  initialCategory?: string;
  autoPreload?: boolean;
  preloadPriority?: number;
}

export const useImageBank = ({ 
  initialCategory,
  autoPreload = false,
  preloadPriority = 3
}: UseImageBankProps = {}) => {
  const [isLoading, setIsLoading] = useState(autoPreload);
  const [images, setImages] = useState<BankImage[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(initialCategory);
  const [error, setError] = useState<string | null>(null);

  // Load images based on category
  const loadImages = useCallback((category?: string) => {
    try {
      let resultImages: BankImage[];
      
      if (!category) {
        resultImages = getAllImages();
      } else {
        resultImages = getImagesByCategory(category);
      }
      
      setImages(resultImages);
      setCurrentCategory(category);
      setError(null);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images');
    }
  }, []);

  // Load images by style category
  const loadImagesByStyle = useCallback((styleCategory: StyleCategory) => {
    try {
      const resultImages = getImagesByStyleCategory(styleCategory);
      setImages(resultImages);
      setCurrentCategory(undefined); // Not a standard category
      setError(null);
    } catch (err) {
      console.error('Error loading images by style:', err);
      setError('Failed to load images by style');
    }
  }, []);

  // Get a single image by ID
  const getImage = useCallback((id: string): BankImage | undefined => {
    return getImageById(id);
  }, []);

  // Preload specific images
  const preloadSelectedImages = useCallback((imageIds: string[]) => {
    setIsLoading(true);
    
    preloadImagesByIds(imageIds, {
      onComplete: () => {
        setIsLoading(false);
      }
    });
  }, []);

  // Preload images by category
  const preloadByCategory = useCallback((category: string) => {
    setIsLoading(true);
    
    preloadImagesByCategory(category, {
      onComplete: () => {
        setIsLoading(false);
      }
    });
  }, []);

  // Initialize with category if provided
  useEffect(() => {
    loadImages(initialCategory);
    
    // Auto preload if enabled
    if (autoPreload && initialCategory) {
      setIsLoading(true);
      
      const images = getImagesByCategory(initialCategory);
      preloadImages(images, {
        onComplete: () => {
          setIsLoading(false);
        },
        batchSize: 4
      });
    }
  }, [initialCategory, autoPreload, loadImages]);

  return {
    images,
    isLoading,
    error,
    currentCategory,
    loadImages,
    loadImagesByStyle,
    getImage,
    preloadImages: preloadSelectedImages,
    preloadCriticalImages,
    preloadByUrls: preloadImagesByUrls,
    preloadByCategory
  };
};

export default useImageBank;
