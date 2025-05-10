/**
 * Utilitário para carregar scripts de terceiros de forma lazy
 * Reduz o impacto dos scripts não essenciais no carregamento inicial
 */

// Carregar scripts de análise e tracking somente após interação do usuário
export function loadAnalyticsScripts() {
  // Detectar primeira interação do usuário
  const handleUserInteraction = () => {
    // Remover todos os listeners após a primeira interação
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
      document.removeEventListener(event, handleUserInteraction);
    });
    
    // Carregamento dos scripts
    setTimeout(() => {
      // Facebook
      if (typeof window.fbq === 'undefined') {
        const fbScript = document.createElement('script');
        fbScript.async = true;
        fbScript.defer = true;
        fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.body.appendChild(fbScript);
      }
      
      // GPT Engineer (se necessário)
      const gptScript = document.querySelector('script[src*="gpteng.co"]');
      if (!gptScript) {
        const gptLoadScript = document.createElement('script');
        gptLoadScript.type = 'module';
        gptLoadScript.async = true;
        gptLoadScript.defer = true;
        gptLoadScript.src = 'https://cdn.gpteng.co/gptengineer.js';
        document.body.appendChild(gptLoadScript);
      }
    }, 2000); // Atraso de 2 segundos para priorizar o conteúdo principal
  };

  // Adicionar listeners para detectar interação do usuário
  ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
    document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
  });

  // Fallback para carregar após 5 segundos mesmo sem interação
  setTimeout(() => {
    handleUserInteraction();
  }, 5000);
}

// Inicializar a função de carregamento lazy para scripts de terceiros
export function initLazyLoading() {
  // Detectar se a página já carregou
  if (document.readyState === 'complete') {
    loadAnalyticsScripts();
  } else {
    window.addEventListener('load', loadAnalyticsScripts);
  }
}
