
/**
 * Utility functions for preloading and managing image resources
 */

// Mapa para rastrear imagens pré-carregadas
const preloadedImages = new Map<string, HTMLImageElement>();

// Cache de otimização de URLs
const optimizedUrlCache = new Map<string, string>();

// Função para pré-carregar uma única imagem
export const preloadImage = (
  src: string, 
  options: { quality?: number; width?: number; format?: string } = {}
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (preloadedImages.has(src)) {
      console.log(`Imagem já carregada, usando cache: ${src}`);
      resolve(preloadedImages.get(src)!);
      return;
    }

    // Log para debugging
    console.log(`Pré-carregando: ${src}`);
    
    const img = new Image();
    
    // Para que o preload funcione, precisamos registrar eventos
    img.onload = () => {
      preloadedImages.set(src, img);
      resolve(img);
    };
    
    img.onerror = (err) => {
      console.error(`Erro ao pré-carregar ${src}:`, err);
      reject(new Error(`Falha ao carregar imagem: ${src}`));
    };
    
    // Aplicar otimização de URL (se necessário)
    img.src = src;
  });
};

// Função para pré-carregar várias imagens em lote
export const preloadImages = (
  sources: string[], 
  options: { 
    quality?: number; 
    batchSize?: number; 
    onProgress?: (loaded: number, total: number) => void;
    onComplete?: () => void;
  } = {}
): void => {
  const { 
    batchSize = 3, // Carregar 3 imagens por vez por padrão
    onProgress, 
    onComplete 
  } = options;
  
  let loadedCount = 0;
  const totalImages = sources.length;

  // Função para processar um lote de imagens
  const processBatch = (startIndex: number) => {
    const batch = sources.slice(startIndex, startIndex + batchSize);
    
    if (batch.length === 0) {
      // Todos os lotes processados
      onComplete?.();
      return;
    }
    
    // Processar cada imagem no lote atual
    Promise.allSettled(
      batch.map(src => preloadImage(src, options))
    ).then((results) => {
      loadedCount += batch.length;
      onProgress?.(loadedCount, totalImages);
      
      // Processar o próximo lote
      processBatch(startIndex + batchSize);
    });
  };
  
  // Iniciar com o primeiro lote
  processBatch(0);
};

// Função para verificar se uma imagem específica foi pré-carregada
export const isImagePreloaded = (src: string): boolean => {
  return preloadedImages.has(src);
};

// Obter uma contagem de imagens pré-carregadas
export const getPreloadedCount = (): number => {
  return preloadedImages.size;
};

// Limpar imagens pré-carregadas (útil para liberação de memória)
export const clearPreloadedImages = (): void => {
  preloadedImages.clear();
};

// Verificar se uma imagem está no cache de otimização
export const isUrlOptimized = (url: string): boolean => {
  return optimizedUrlCache.has(url);
};

// Otimizar URL de imagem com parâmetros
export const optimizeImageUrl = (
  url: string,
  options: { quality?: number; width?: number; format?: string } = {}
): string => {
  // Se a URL já foi otimizada, retornar do cache
  const cacheKey = `${url}|${JSON.stringify(options)}`;
  if (optimizedUrlCache.has(cacheKey)) {
    return optimizedUrlCache.get(cacheKey)!;
  }
  
  // Implementação básica para modificar URLs (pode ser expandida conforme necessário)
  let optimizedUrl = url;
  
  // Cache a URL otimizada
  optimizedUrlCache.set(cacheKey, optimizedUrl);
  
  return optimizedUrl;
};
