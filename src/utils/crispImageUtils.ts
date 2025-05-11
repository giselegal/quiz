/**
 * Utilitário para garantir URLs de alta qualidade para imagens do Cloudinary
 * Foca em resolver problemas de embaçamento e melhorar o desempenho de carregamento
 */

/**
 * Otimiza uma URL do Cloudinary para alta qualidade e nitidez
 * @param url URL da imagem do Cloudinary
 * @returns URL otimizada para alta qualidade
 */
export const optimizeForCrispImage = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Extrair partes da URL
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;
  
  const baseUrl = urlParts[0];
  const pathPart = urlParts[1];
  
  // Verificar e remover parâmetros de blur existentes
  let cleanedPath = pathPart;
  
  if (cleanedPath.includes('e_blur')) {
    cleanedPath = cleanedPath.replace(/,e_blur:[0-9]+/g, '');
  }
  
  // Substituir qualidade baixa por alta qualidade
  if (cleanedPath.includes('q_')) {
    cleanedPath = cleanedPath.replace(/q_[0-9]+/g, 'q_95');
  }
  
  // Adicionar parâmetros otimizados
  return `${baseUrl}/upload/f_auto,q_95,dpr_auto,e_sharpen:60/${cleanedPath}`;
};

/**
 * Verifica se uma URL é provavelmente um placeholder desfocado
 * @param url URL da imagem para verificar
 * @returns true se for provavelmente um placeholder desfocado
 */
export const isBlurredPlaceholder = (url: string): boolean => {
  if (!url) return false;
  
  return (
    url.includes('e_blur') ||
    url.includes('q_1') ||
    url.includes('q_5') ||
    url.includes('q_10') ||
    url.includes('q_20') ||
    url.includes('q_30') ||
    url.includes('q_auto') ||
    url.includes('w_20') ||
    url.includes('w_30') ||
    url.includes('w_50')
  );
};

/**
 * Aplica otimização de URLs para todas as imagens no documento
 * @returns Número de imagens otimizadas
 */
export const optimizeAllImages = (): number => {
  if (typeof document === 'undefined') return 0;
  
  const images = document.querySelectorAll<HTMLImageElement>('img[src*="cloudinary.com"]');
  let count = 0;
  
  images.forEach(img => {
    const originalSrc = img.src;
    const optimizedSrc = optimizeForCrispImage(originalSrc);
    
    if (originalSrc !== optimizedSrc) {
      img.src = optimizedSrc;
      img.style.imageRendering = 'crisp-edges';
      count++;
    }
  });
  
  return count;
};

export default {
  optimizeForCrispImage,
  isBlurredPlaceholder,
  optimizeAllImages
};
