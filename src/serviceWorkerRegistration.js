// Registra o Service Worker para cache e estratégias offline
// Versão otimizada para registro imediato e mais agressivo
export const register = () => {
  if ('serviceWorker' in navigator) {
    // Registrar o mais cedo possível, sem esperar pelo evento load
    navigator.serviceWorker.register('/quiz-de-estilo/sw.js', { scope: '/quiz-de-estilo/' })
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
        
        // Verificar atualizações a cada 4 horas (em produção)
        if (process.env.NODE_ENV === 'production') {
          setInterval(() => {
            registration.update();
          }, 4 * 60 * 60 * 1000);
        }
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });

    // Eventos adicionais para monitoramento
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });
    
    // Forçar recarregar se o service worker não responder em 3 segundos
    let swResponded = false;
    
    // Verificar se o sw está funcionando
    setTimeout(() => {
      if (!swResponded && navigator.onLine) {
        console.log('Service Worker não respondeu a tempo, recarregando...');
        // Usar sessionStorage para evitar loops infinitos
        if (!sessionStorage.getItem('sw_reload_attempted')) {
          sessionStorage.setItem('sw_reload_attempted', 'true');
          // Recarregar a página
          window.location.reload();
        }
      }
    }, 3000);
    
    // Marcar que o SW respondeu
    navigator.serviceWorker.ready.then(() => {
      swResponded = true;
      console.log('Service Worker está pronto e respondendo!');
    });
  }
};

// Verifica se o Service Worker pode ser instalado
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};
