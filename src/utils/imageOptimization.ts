/**
 * Utility para otimização de imagens
 */

// Detecção de suporte a webp
export const detectWebpSupport = (): Promise<boolean> => {
  return new Promise(resolve => {
    const webpImg = new Image();
    webpImg.onload = () => resolve(true);
    webpImg.onerror = () => resolve(false);
    webpImg.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
};

// Adicionar classe CSS para navegadores com suporte a webp
export const markWebpSupport = async () => {
  const supportsWebp = await detectWebpSupport();
  if (supportsWebp) {
    document.documentElement.classList.add('webp-support');
  } else {
    document.documentElement.classList.add('no-webp-support');
  }
};

// Carregamento de imagens com lazy loading usando IntersectionObserver
export const setupLazyImagesLoading = () => {
  if (!('IntersectionObserver' in window)) {
    // Para navegadores que não suportam IntersectionObserver,
    // simplesmente deixar o carregamento normal acontecer
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      // Garantir que img.dataset.src seja atribuído a img.src se existir
      if ((img as HTMLImageElement).dataset.src) {
        (img as HTMLImageElement).src = (img as HTMLImageElement).dataset.src;
      }
    });
    return;
  }
  
  const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target as HTMLImageElement;
        
        // Carregar a imagem original a partir do atributo data-src
        if (lazyImage.dataset.src) {
          lazyImage.src = lazyImage.dataset.src;
          
          // Adicionar classe para efeito de fade-in
          lazyImage.classList.add('loaded');
          
          // Se houver srcset, também configurar
          if (lazyImage.dataset.srcset) {
            lazyImage.srcset = lazyImage.dataset.srcset;
          }
          
          // Parar de observar esse elemento
          lazyImageObserver.unobserve(lazyImage);
        }
      }
    });
  }, {
    rootMargin: '200px 0px', // Começar a carregar quando estiver a 200px da viewport
    threshold: 0.01 // Trigger com apenas 1% visível
  });

  // Observar todas as imagens com lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(image => {
    lazyImageObserver.observe(image);
  });
};

// Inicializar todas as otimizações de imagem
export const initImageOptimizations = () => {
  // Detectar suporte a webp
  markWebpSupport();
  
  // Configurar lazy loading de imagens
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyImagesLoading);
  } else {
    setupLazyImagesLoading();
  }
  
  // Adicionar tratamento para erros de carregamento de imagens
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) {
      // Substituir por imagem de fallback ou adicionar classe para estilização CSS
      event.target.classList.add('image-error');
      
      // Tente carregar uma imagem de fallback se disponível
      const fallbackImage = event.target.dataset.fallback;
      if (fallbackImage) {
        event.target.src = fallbackImage;
      }
    }
  }, true); // Usando captura para pegar o evento antes dele chegar ao elemento
};
