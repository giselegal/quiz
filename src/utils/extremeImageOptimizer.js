/**
 * Otimizador extremo de imagens - elimina oscilações, força qualidade consistente
 */

(function() {
  // Configurações fixas que funcionam melhor para evitar oscilações
  const QUALITY = 70;
  const SHARPEN = 40;
  const DPR = "1.0";
  const STRIP = "fl_strip_profile";
  
  // Aplicar imediatamente
  applyExtremeOptimizations();
  
  // Aplicar após carregamento completo e em diferentes momentos
  window.addEventListener('load', function() {
    setTimeout(applyExtremeOptimizations, 100);
    setTimeout(applyExtremeOptimizations, 500);
    setTimeout(applyExtremeOptimizations, 1000);
  });
  
  // Observer para detectar mudanças na DOM (SPAs)
  const observer = new MutationObserver(function() {
    applyExtremeOptimizations();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });
  
  function applyExtremeOptimizations() {
    // Encontrar todas as imagens Cloudinary
    const images = document.querySelectorAll('img[src*="cloudinary.com"]');
    
    images.forEach(img => {
      if (img.src.includes('cloudinary.com')) {
        const originalSrc = img.src;
        const optimizedSrc = optimizeCloudinaryUrl(originalSrc);
        
        if (originalSrc !== optimizedSrc) {
          // Pré-carregar a imagem otimizada
          const preloadImage = new Image();
          preloadImage.src = optimizedSrc;
          
          // Depois de pré-carregada, aplicar na imagem real
          preloadImage.onload = function() {
            img.src = optimizedSrc;
            
            // Aplicar estilos diretos para garantir renderização
            img.style.imageRendering = 'auto';
            img.style.filter = 'none';
            img.style.transform = 'none';
            img.style.transition = 'none';
            img.style.opacity = '1';
            img.style.display = 'block';
          };
        }
      }
    });
    
    // Forçar reflow para garantir renderização
    document.body.offsetHeight;
  }
  
  function optimizeCloudinaryUrl(url) {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Extrair partes da URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;
    
    const baseUrl = urlParts[0];
    let pathPart = urlParts[1];
    
    // Remover qualquer parâmetro existente e aplicar os novos
    pathPart = pathPart
      .replace(/,e_blur:[0-9]+/g, '')
      .replace(/e_blur:[0-9]+,/g, '')
      .replace(/e_blur:[0-9]+/g, '')
      .replace(/q_[0-9]+/g, `q_${QUALITY}`)
      .replace(/dpr_[0-9.]+/g, `dpr_${DPR}`)
      .replace(/e_sharpen:[0-9]+/g, `e_sharpen:${SHARPEN}`);
    
    // Montar URL otimizada
    return `${baseUrl}/upload/f_auto,q_${QUALITY},dpr_${DPR},e_sharpen:${SHARPEN},${STRIP}/${pathPart}`;
  }
})();
