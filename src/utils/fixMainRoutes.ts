/**
 * Script para verificar e corrigir problemas específicos nas URLs principais da Gisele Galvão
 * - https://giselegalvao.com.br/
 * - https://giselegalvao.com.br/resultado
 * - https://giselegalvao.com.br/quiz-descubra-seu-estilo
 */

// URLs principais para monitorar e corrigir
const MAIN_ROUTES = [
  {
    path: '/',
    title: 'Descubra Seu Estilo com Gisele Galvão | Vista-se de Você!'
  },
  {
    path: '/resultado',
    title: 'Seu Resultado | Descubra Seu Estilo com Gisele Galvão'
  },
  {
    path: '/quiz-descubra-seu-estilo',
    title: 'Quiz de Estilo | Gisele Galvão'
  }
];

/**
 * Verifica e corrige problemas de navegação para as rotas principais
 */
export function fixMainRoutes() {
  // 1. Verificar se estamos no domínio correto
  const isCorrectDomain = window.location.hostname === 'giselegalvao.com.br' || 
                          window.location.hostname === 'www.giselegalvao.com.br';

  if (!isCorrectDomain) {
    console.log('Domínio de desenvolvimento detectado - ignorando correções específicas');
    return false;
  }

  // 2. Verificar se a rota atual é uma das rotas principais
  const currentPath = window.location.pathname;
  
  // 3. Verificar problemas comuns e corrigi-los
  
  // 3.1 Verificar se há '/index.html' no final da URL e remover
  if (currentPath.endsWith('/index.html')) {
    const newPath = currentPath.replace('/index.html', '/');
    console.log(`Corrigindo URL: removendo '/index.html' da URL`);
    window.history.replaceState({}, document.title, newPath);
    return true;
  }
  
  // 3.2 Verificar se falta uma barra no final de URLs principais
  const mainRoute = MAIN_ROUTES.find(route => 
    route.path !== '/' && currentPath.startsWith(route.path) && !currentPath.endsWith('/')
  );
  
  if (mainRoute && !currentPath.endsWith('/')) {
    const newPath = `${currentPath}/`;
    console.log(`Corrigindo URL: adicionando '/' ao final da URL`);
    window.history.replaceState({}, document.title, newPath);
    return true;
  }
  
  // 3.3 Corrigir letras maiúsculas nas URLs (para SEO e consistência)
  if (currentPath !== currentPath.toLowerCase()) {
    const newPath = currentPath.toLowerCase();
    console.log(`Corrigindo URL: convertendo para minúsculas`);
    window.history.replaceState({}, document.title, newPath);
    return true;
  }
  
  // 3.4 Garantir que o título da página esteja correto
  const matchingRoute = MAIN_ROUTES.find(route => route.path === currentPath);
  if (matchingRoute && document.title !== matchingRoute.title) {
    console.log(`Corrigindo título da página para: ${matchingRoute.title}`);
    document.title = matchingRoute.title;
    return true;
  }
  
  return false;
}

// Expor a função globalmente
if (typeof window !== 'undefined') {
  window.fixMainRoutes = fixMainRoutes;
  
  // Executar ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(fixMainRoutes, 1000);
  });
  
  // Executar em cada mudança de rota
  if (typeof window.history !== 'undefined') {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(fixMainRoutes, 100);
    };
    
    window.addEventListener('popstate', () => {
      setTimeout(fixMainRoutes, 100);
    });
  }
}

export default fixMainRoutes;
