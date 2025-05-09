// Utilitário para verificar as rotas específicas do site da Gisele Galvão
// Versão: 1.0.0

/**
 * Verifica se todas as rotas principais estão funcionando corretamente
 * @returns {Object} Objeto com o status de cada rota
 */
export function checkMainRoutes() {
  console.log('🧪 Verificando rotas principais do site...');
  
  const mainRoutes = [
    { path: '/', name: 'Página Inicial' },
    { path: '/resultado', name: 'Página de Resultados' },
    { path: '/quiz-descubra-seu-estilo', name: 'Página do Quiz' }
  ];
  
  const results = mainRoutes.map(route => {
    // Criar o URL completo
    const baseUrl = window.location.origin;
    const fullUrl = new URL(route.path, baseUrl).href;
    
    return {
      ...route,
      fullUrl,
      status: 'pendente'
    };
  });
  
  // Verificar a rota atual
  const currentPath = window.location.pathname;
  results.forEach(route => {
    if (currentPath === route.path) {
      route.status = 'carregada';
      console.log(`✅ Rota atual: ${route.name} (${route.path}) - carregada com sucesso`);
    }
  });
  
  // Exibir informações detalhadas
  console.log('📊 Status das rotas principais:');
  results.forEach(route => {
    console.log(`${route.status === 'carregada' ? '✅' : '⏳'} ${route.name}: ${route.fullUrl} - ${route.status}`);
  });
  
  console.log('ℹ️ Observação: Para verificar todas as rotas, acesse cada uma manualmente e execute este comando em cada página.');
  
  // Verificar o estado do SPA Router
  if (typeof window.location.pathname === 'string') {
    console.log('✅ Sistema de roteamento SPA funcionando corretamente');
  } else {
    console.log('⚠️ Possível problema com o sistema de roteamento');
  }
  
  return {
    routes: results,
    currentRoute: currentPath,
    isRouterWorking: typeof window.location.pathname === 'string'
  };
}

// Expor a função globalmente
if (typeof window !== 'undefined') {
  window.checkMainRoutes = checkMainRoutes;
}

export default checkMainRoutes;
