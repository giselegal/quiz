
/**
 * Utility para inicializar scripts não-críticos de forma lazy
 */

export const initLazyLoading = () => {
  // Usar requestIdleCallback para carregar scripts quando o browser estiver ocioso
  const loadNonCriticalScripts = () => {
    console.log('[Performance] Carregando scripts não-críticos');
    
    // Aqui podemos carregar scripts de analytics, tracking, etc.
    // que não são essenciais para a renderização inicial
    
    // Exemplo de como adicionar um script de forma lazy
    const loadScript = (src: string, async = true, defer = true) => {
      const script = document.createElement('script');
      script.src = src;
      if (async) script.async = true;
      if (defer) script.defer = true;
      document.body.appendChild(script);
      return script;
    };
    
    // Adicionar scripts não críticos aqui
    // Exemplo: loadScript('https://example.com/analytics.js');
  };
  
  // Usar requestIdleCallback se disponível, ou setTimeout como fallback
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadNonCriticalScripts, { timeout: 2000 });
  } else {
    setTimeout(loadNonCriticalScripts, 2000);
  }
};
