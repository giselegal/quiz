
/**
 * Utility para verificar a saúde do site
 */

export const checkSiteHealth = () => {
  console.log('[Health] Verificando saúde do site');
  
  // Métricas básicas
  const metrics = {
    javascriptErrors: 0,
    networkLatency: 0,
    resourceLoadErrors: 0
  };
  
  // Monitorar erros de JavaScript não capturados
  window.addEventListener('error', (event) => {
    metrics.javascriptErrors++;
    console.error('[Health] Erro JavaScript não capturado:', event.error);
  });
  
  // Monitorar erros de rede
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.name === 'NetworkError') {
      metrics.resourceLoadErrors++;
    }
  });
  
  return metrics;
};
