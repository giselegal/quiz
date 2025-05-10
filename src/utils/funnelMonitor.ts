
/**
 * Utility para monitorar rotas do funil de conversão
 */

export const monitorFunnelRoutes = () => {
  // Array com as rotas do funil em ordem
  const funnelRoutes = [
    '/', // Página inicial
    '/quiz', // Quiz
    '/resultado', // Página de resultado
    '/oferta-direta' // Página de oferta
  ];
  
  // Mapear rotas para etapas do funil
  const routeToStepMap: Record<string, string> = {
    '/': 'homepage',
    '/quiz': 'quiz_start',
    '/resultado': 'quiz_result',
    '/oferta-direta': 'offer_page'
  };
  
  // Registrar navegação entre páginas do funil
  const trackFunnelNavigation = (from: string, to: string) => {
    const fromStep = routeToStepMap[from] || 'unknown';
    const toStep = routeToStepMap[to] || 'unknown';
    
    console.log(`[Funnel] Navegação: ${fromStep} -> ${toStep}`);
    
    // Aqui poderia enviar evento para analytics
    if (window.fbq) {
      window.fbq('trackCustom', 'FunnelNavigation', {
        from: fromStep,
        to: toStep
      });
    }
  };
  
  return {
    funnelRoutes,
    routeToStepMap,
    trackFunnelNavigation
  };
};
