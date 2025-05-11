import { useState, useEffect } from 'react';

/**
 * Hook otimizado para carregamento de imagens com suporte a lazy loading,
 * cache em sessionStorage e fallback progressivo.
 */
export const useOptimizedImage = (
  imageUrl: string,
  placeholderUrl?: string,
  cacheKey?: string
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [src, setSrc] = useState(placeholderUrl || '');
  const actualCacheKey = cacheKey || `img_cache_${imageUrl}`;

  useEffect(() => {
    // Verifica cache primeiro
    const cachedImage = sessionStorage.getItem(actualCacheKey);
    
    if (cachedImage) {
      setSrc(cachedImage);
      setIsLoaded(true);
      return;
    }

    // Se não estiver em cache, carrega normalmente
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setSrc(imageUrl);
      setIsLoaded(true);
      
      // Guarda em cache para futuras visitas na mesma sessão
      try {
        sessionStorage.setItem(actualCacheKey, imageUrl);
      } catch (e) {
        // Ignora erros de storage (quota excedida, etc)
      }
    };
    
    // Cleanup
    return () => {
      img.onload = null;
    };
  }, [imageUrl, actualCacheKey]);

  return { src, isLoaded };
};
