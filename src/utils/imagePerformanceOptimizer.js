/**
 * Script otimizado para eliminar efeitos de blur nas imagens e melhorar o LCP/FCP
 * 
 * Este script resolve vários problemas relacionados a imagens embaçadas:
 * 1. Detecta e conserta URLs de Cloudinary com parâmetros de baixa qualidade
 * 2. Remove efeitos CSS de blur (classes e estilos inline)
 * 3. Aplica propriedades CSS para garantir renderização nítida
 * 4. Otimiza imagens LCP para carregamento prioritário
 * 5. Monitora mudanças no DOM para aplicar correções em novas imagens
 */

(function() {
  // Cache para evitar reprocessar as mesmas URLs
  const processedUrls = new Set();
  
  // Função para otimizar URLs do Cloudinary
  function getHighQualityUrl(url) {
    // Verificar se a URL já foi processada
    if (processedUrls.has(url)) {
      return url;
    }
    
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }
    
    // Extrair base e caminho da URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
      return url;
    }
    
    const baseUrl = urlParts[0];
    const pathPart = urlParts[1];
    
    // Remover parâmetros de baixa qualidade
    let optimizedPath = pathPart
      .replace(/,e_blur:[0-9]+/g, '')
      .replace(/e_blur:[0-9]+,/g, '')
      .replace(/e_blur:[0-9]+/g, '')
      .replace(/q_[0-9]+/g, 'q_95')
      .replace(/w_20/g, 'w_auto');
    
    // Criar URL otimizada
    const optimizedUrl = `${baseUrl}/upload/f_auto,q_95,dpr_auto,e_sharpen:60/${optimizedPath}`;
    
    // Adicionar ao cache
    processedUrls.add(optimizedUrl);
    
    return optimizedUrl;
  }
  
  // Função para detectar se uma URL é um placeholder de baixa qualidade
  function isLowQualityPlaceholder(url) {
    if (!url) return false;
    
    return (
      url.includes('q_1') ||
      url.includes('q_5') ||
      url.includes('q_10') ||
      url.includes('q_20') ||
      url.includes('q_30') ||
      url.includes('w_20') ||
      url.includes('w_30') ||
      url.includes('w_50') ||
      url.includes('e_blur')
    );
  }
  
  // Função para otimizar todas as imagens
  function optimizeAllImages() {
    const images = document.querySelectorAll('img[src*="cloudinary.com"]');
    let count = 0;
    
    images.forEach(img => {
      const currentSrc = img.src;
      const optimizedSrc = getHighQualityUrl(currentSrc);
      
      // Aplicar otimizações na imagem
      if (currentSrc !== optimizedSrc) {
        // Precarregar para evitar FOUC
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = optimizedSrc;
        preloadLink.setAttribute('fetchpriority', 'high');
        document.head.appendChild(preloadLink);
        
        // Atualizar src da imagem
        img.src = optimizedSrc;
        count++;
      }
      
      // Aplicar estilos de otimização
      applyOptimizedStyles(img);
      
      // Especialmente para imagens críticas (LCP)
      if (img.classList.contains('quiz-intro-image') || 
          img.parentElement?.classList.contains('quiz-intro')) {
        optimizeForLCP(img);
      }
    });
    
    return count;
  }
  
  // Aplicar estilos otimizados na imagem
  function applyOptimizedStyles(img) {
    img.style.imageRendering = 'crisp-edges';
    img.style.filter = 'none';
    img.style.transform = 'none';
    img.style.transition = 'none';
    
    // Remover classes de blur
    img.classList.remove('blur', 'blur-sm', 'blur-md', 'blur-lg', 'blur-xl', 'blur-2xl', 'blur-3xl');
    
    // Adicionar classe para CSS global
    img.classList.add('crisp-image');
  }
  
  // Otimizar imagens LCP
  function optimizeForLCP(img) {
    // Definir atributos de prioridade
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
    img.decoding = 'sync';
    
    // Otimizar também elementos pai que podem aplicar filtros
    let parent = img.parentElement;
    while (parent && parent !== document.body) {
      parent.style.filter = 'none';
      parent.style.backdropFilter = 'none';
      
      // Remover background-image que possa estar usando placeholder
      if (parent.style.backgroundImage && isLowQualityPlaceholder(parent.style.backgroundImage)) {
        parent.style.backgroundImage = 'none';
      }
      
      parent = parent.parentElement;
    }
  }
  
  // Remover efeitos de blur
  function removeBlurEffects() {
    // Remover classes de blur
    document.querySelectorAll('.blur, .blur-sm, .blur-md, .blur-lg, .blur-xl, .blur-2xl, .blur-3xl').forEach(el => {
      if (el.tagName.toLowerCase() === 'img' || el.querySelector('img')) {
        el.classList.remove('blur', 'blur-sm', 'blur-md', 'blur-lg', 'blur-xl', 'blur-2xl', 'blur-3xl');
      }
    });
    
    // Remover estilos inline
    document.querySelectorAll('*[style*="blur"]').forEach(el => {
      if (el.tagName.toLowerCase() === 'img' || el.querySelector('img')) {
        el.style.filter = el.style.filter.replace(/blur\([^)]*\)/g, '');
        if (el.style.filter.trim() === '') {
          el.style.filter = '';
        }
      }
    });
    
    // Remover backgrounds com placeholders
    document.querySelectorAll('div[style*="background-image"]').forEach(div => {
      const bgImage = div.style.backgroundImage;
      if (div.querySelector('img') && bgImage && isLowQualityPlaceholder(bgImage)) {
        div.style.backgroundImage = 'none';
      }
    });
  }
  
  // Injetar CSS otimizado
  function injectCriticalCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Imagens de alta qualidade */
      img {
        image-rendering: crisp-edges !important;
        filter: none !important;
        transform: none !important;
      }
      
      /* Correções específicas para imagens do quiz */
      .quiz-intro-image, .crisp-image {
        image-rendering: crisp-edges !important;
        filter: none !important;
        transform: none !important;
      }
      
      /* Remover efeitos indesejados */
      [class*="blur"] {
        filter: none !important;
      }
      
      /* Remover placeholders em elementos pai */
      .quiz-intro [style*="background-image"] {
        background-image: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Observer para monitorar mudanças no DOM
  function setupImageObserver() {
    const observer = new MutationObserver(mutations => {
      let needsOptimization = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'IMG' || 
                (node.nodeType === 1 && node.querySelector && node.querySelector('img'))) {
              needsOptimization = true;
            }
          });
        } else if (mutation.type === 'attributes') {
          if (mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
            needsOptimization = true;
          }
        }
      });
      
      if (needsOptimization) {
        const count = optimizeAllImages();
        removeBlurEffects();
        if (count > 0) {
          console.log(`🔍 Otimizadas ${count} novas imagens adicionadas ao DOM`);
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style', 'class']
    });
    
    return observer;
  }
  
  // Aplicar otimizações imediatamente
  function applyOptimizations() {
    const count = optimizeAllImages();
    removeBlurEffects();
    console.log(`🔍 Otimizadas ${count} imagens para melhorar LCP/FCP`);
  }
  
  // Função principal
  function init() {
    // Injetar CSS crítico
    injectCriticalCSS();
    
    // Aplicar otimizações imediatamente
    applyOptimizations();
    
    // Monitorar mudanças no DOM
    const observer = setupImageObserver();
    
    // Aplicar otimizações novamente após carregamento do documento
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(applyOptimizations, 100);
      });
    }
    
    // Aplicar novamente após um pequeno delay
    setTimeout(applyOptimizations, 500);
    
    // Aplicar após carregamento completo da página
    window.addEventListener('load', () => {
      setTimeout(applyOptimizations, 300);
    });
    
    // Adicionar funções ao objeto window
    window.ImageOptimizer = {
      optimizeAllImages,
      removeBlurEffects,
      getHighQualityUrl
    };
  }
  
  // Iniciar
  init();
})();
