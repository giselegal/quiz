
/**
 * Utility para inicializar scripts não-críticos de forma lazy
 */

export const initLazyLoading = () => {
  // Variável para controlar se os scripts já foram carregados
  let scriptsLoaded = false;

  // Usar requestIdleCallback para carregar scripts quando o browser estiver ocioso
  const loadNonCriticalScripts = () => {
    // Evitar carregamento duplicado
    if (scriptsLoaded) return;
    scriptsLoaded = true;
    
    // Priorizar scripts conforme necessidade
    const loadScript = (src: string, priority = 'low', async = true, defer = true) => {
      const script = document.createElement('script');
      script.src = src;
      if (async) script.async = true;
      if (defer) script.defer = true;
      
      // Usar fetchpriority para otimizar a aquisição de recursos
      if ('fetchPriority' in script) {
        (script as any).fetchPriority = priority;
      }
      
      // Usar módulos quando possível para melhor paralelização
      if (src.endsWith('.mjs')) {
        script.type = 'module';
      }
      
      // Adicionar estratégia de preload para scripts críticos
      return script;
    };
    
    // Batcher para inserção otimizada no DOM (melhor performance)
    const fragment = document.createDocumentFragment();
    const scripts: HTMLScriptElement[] = [];
    
    // Adicionar scripts não críticos aqui
    // Definir scripts para serem carregados quando necessário
    
    // Inserir todos os scripts de uma vez (melhor performance)
    scripts.forEach(script => fragment.appendChild(script));
    document.body.appendChild(fragment);
  };
  
  // Usar IntersectionObserver para detectar quando o usuário está rolando a página
  // e carregar scripts apenas quando necessário
  if ('IntersectionObserver' in window && document.querySelector('footer')) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNonCriticalScripts, { timeout: 1000 });
        } else {
          setTimeout(loadNonCriticalScripts, 1000);
        }
        observer.disconnect();
      }
    });
    
    // Observar footer ou outro elemento que indica que o usuário rolou a página
    const footer = document.querySelector('footer');
    if (footer) observer.observe(footer);
  } else {
    // Fallback: carregar após a página estar "idle"
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNonCriticalScripts, { timeout: 1500 });
    } else {
      setTimeout(loadNonCriticalScripts, 1500);
    }
  }
};
