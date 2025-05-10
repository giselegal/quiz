/**
 * Utilitários para otimização de imagens com LQIP (Low Quality Image Placeholder)
 * e cache eficiente de recursos
 */

/**
 * Gera URL de imagem com qualidade progressiva para LQIP
 */
export const generateLqipUrl = (baseUrl: string, imageId: string, width = 20, blur = 80) => {
  return `${baseUrl}f_webp,q_10,w_${width},c_limit,e_blur:${blur}/${imageId}.webp`;
};

/**
 * Pré-carrega uma imagem e armazena em cache 
 */
export const preloadAndCacheImage = (url: string, cacheKey: string) => {
  // Verificar se já existe em cache
  if (sessionStorage.getItem(cacheKey)) {
    return Promise.resolve(sessionStorage.getItem(cacheKey));
  }
  
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Armazenar em cache após carregamento
      try {
        sessionStorage.setItem(cacheKey, url);
      } catch (e) {
        // Ignorar erros de storage
      }
      resolve(url);
    };
    img.onerror = () => {
      reject(new Error(`Falha ao carregar imagem: ${url}`));
    };
  });
};

/**
 * Carrega uma imagem com estratégia de fallback e observabilidade
 */
export const loadImageWithFallback = (
  primaryUrl: string, 
  fallbackUrl: string, 
  callback?: (success: boolean, usedFallback: boolean) => void
) => {
  const img = new Image();
  let usedFallback = false;
  
  // Configurar timeout para fallback
  const timeoutId = setTimeout(() => {
    if (!img.complete) {
      // Trocar para fallback se primária demorar demais
      img.src = fallbackUrl;
      usedFallback = true;
    }
  }, 2000);
  
  img.onload = () => {
    clearTimeout(timeoutId);
    if (callback) callback(true, usedFallback);
  };
  
  img.onerror = () => {
    clearTimeout(timeoutId);
    
    // Se já estiver usando fallback e falhar, reportar erro
    if (usedFallback) {
      if (callback) callback(false, true);
      return;
    }
    
    // Tentar fallback quando primária falhar
    img.src = fallbackUrl;
    usedFallback = true;
  };
  
  // Iniciar com URL primária
  img.src = primaryUrl;
  
  return img;
};
