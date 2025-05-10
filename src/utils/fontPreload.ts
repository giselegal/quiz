/**
 * Utility para pré-carregar fontes para melhorar a performance
 */

export const preloadFonts = () => {
  // Fontes importantes que podem ser pré-carregadas para melhorar CLS
  const criticalFonts = [
    // Adicione aqui as fontes críticas que são usadas em componentes visíveis imediatamente
    // Por exemplo:
    // '/fonts/minha-fonte-primaria.woff2',
    // '/fonts/minha-fonte-secundaria.woff2',
  ];

  // Preload de fontes críticas
  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preconnect para domínios de fontes externas
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Inicializa o carregamento otimizado de fontes
 */
export const initFontOptimization = () => {
  // Preload de fontes críticas
  preloadFonts();

  // Carregar fontes restantes de forma assíncrona
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      const fontStylesheet = document.createElement('link');
      fontStylesheet.rel = 'stylesheet';
      fontStylesheet.href = 'COLOQUE_AQUI_O_URL_DA_SUA_FONTE_NÃO_CRÍTICA';
      document.head.appendChild(fontStylesheet);
    }, { timeout: 1000 });
  } else {
    setTimeout(() => {
      const fontStylesheet = document.createElement('link');
      fontStylesheet.rel = 'stylesheet';
      fontStylesheet.href = 'COLOQUE_AQUI_O_URL_DA_SUA_FONTE_NÃO_CRÍTICA';
      document.head.appendChild(fontStylesheet);
    }, 1000);
  }
};
