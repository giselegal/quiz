// Utilitário para monitorar e otimizar o funil de vendas
export function monitorFunnelRoutes() {
  console.log('🔄 Inicializando monitoramento do funil de vendas...');
  
  // Detectar a rota atual
  const currentPath = window.location.pathname;
  const validRoutes = ['/', '/resultado', '/quiz-descubra-seu-estilo'];
  if (!validRoutes.includes(currentPath)) {
    console.warn(`⚠️ Rota atual inválida: ${currentPath}. As rotas válidas são: ${validRoutes.join(', ')}`);
  } else {
    console.log(`✅ Rota atual válida: ${currentPath}`);
  }
  const currentRoute = currentPath === '/' ? 'home' : 
                      currentPath === '/resultado' ? 'resultado' : 
                      currentPath === '/quiz-descubra-seu-estilo' ? 'venda' : 'other';
  
  console.log(`📍 Rota atual: ${currentRoute} (${currentPath})`);
  
  // Otimizações e verificações específicas por rota
  switch (currentRoute) {
    case 'home':
      console.log('🏠 Página Inicial e Quiz - Verificando recursos críticos...');
      // Verificar componentes do quiz
      checkQuizComponents();
      break;
      
    case 'resultado':
      console.log('📊 Página de Resultados (Funil 1) - Preparando transição de vendas...');
      // Pré-carregar recursos da página de vendas
      preloadSalesPage();
      break;
      
    case 'venda':
      console.log('💰 Página de Vendas (Funil 2) - Otimizando conversão...');
      // Verificar componentes de vendas
      checkSalesComponents();
      break;
      
    default:
      console.log('⚠️ Rota não reconhecida - Verificando recursos genéricos...');
      break;
  }
  
  // Registrar progresso no funil
  registerFunnelProgress(currentRoute);
  
  // Monitorar eventos de navegação
  setupNavigationMonitoring();
  
  return {
    currentRoute,
    timestamp: new Date().toISOString(),
    success: true
  };
}

// Verifica componentes específicos do quiz
function checkQuizComponents() {
  try {
    // Verificar componentes críticos
    const quizContainer = document.querySelector('.quiz-container, [data-component="quiz"]');
    const quizIntro = document.querySelector('.quiz-intro, [data-section="intro"]');
    const quizContent = document.querySelector('.quiz-content, [data-section="questions"]');
    
    if (!quizContainer) {
      console.warn('⚠️ Container do quiz não encontrado');
    }
    
    if (!quizIntro && !quizContent) {
      console.warn('⚠️ Conteúdo do quiz não encontrado');
    }
    
    // Otimizar imagens se a função estiver disponível
    if (typeof window.fixBlurryIntroQuizImages === 'function') {
      window.fixBlurryIntroQuizImages();
    }
    
    console.log('✅ Verificação de componentes do quiz concluída');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar componentes do quiz:', error);
    return false;
  }
}

// Pré-carregar recursos da página de vendas
function preloadSalesPage() {
  try {
    // Pré-carregar a página de vendas para transição mais rápida
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.href = '/quiz-descubra-seu-estilo';
    document.head.appendChild(preloadLink);
    
    // Pré-carregar imagens críticas da página de vendas
    const salesImages = [
      'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_99,dpr_auto,e_sharpen:80/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
    ];
    
    salesImages.forEach(imgUrl => {
      const imgPreload = document.createElement('link');
      imgPreload.rel = 'preload';
      imgPreload.as = 'image';
      imgPreload.href = imgUrl;
      document.head.appendChild(imgPreload);
    });
    
    console.log('✅ Pré-carregamento da página de vendas concluído');
    return true;
  } catch (error) {
    console.error('❌ Erro ao pré-carregar página de vendas:', error);
    return false;
  }
}

// Verificar componentes da página de vendas
function checkSalesComponents() {
  try {
    // Verificar componentes críticos de vendas
    const offerContainer = document.querySelector('.offer-container, [data-component="offer"]');
    const ctaButton = document.querySelector('.cta-button, [data-component="cta"]');
    
    if (!offerContainer) {
      console.warn('⚠️ Container da oferta não encontrado');
    }
    
    if (!ctaButton) {
      console.warn('⚠️ Botão de CTA não encontrado');
    }
    
    // Otimizar imagens se a função estiver disponível
    if (typeof window.fixBlurryIntroQuizImages === 'function') {
      window.fixBlurryIntroQuizImages();
    }
    
    console.log('✅ Verificação de componentes de vendas concluída');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar componentes de vendas:', error);
    return false;
  }
}

// Registrar progresso no funil para analytics
function registerFunnelProgress(currentRoute) {
  try {
    // Se o Facebook Pixel estiver disponível, registrar evento
    if (typeof window.fbq === 'function') {
      // Enviar evento específico baseado na rota
      switch (currentRoute) {
        case 'home':
          window.fbq('track', 'ViewContent', { content_name: 'quiz_start' });
          break;
        case 'resultado':
          window.fbq('track', 'ViewContent', { content_name: 'quiz_result' });
          break;
        case 'venda':
          window.fbq('track', 'ViewContent', { content_name: 'sales_page' });
          break;
      }
      
      console.log('✅ Evento de progresso do funil registrado');
    }
    
    // Armazenar progresso no localStorage para análise posterior
    try {
      const funnelData = JSON.parse(localStorage.getItem('funnelProgress') || '{}');
      funnelData[currentRoute] = {
        timestamp: new Date().toISOString(),
        visits: (funnelData[currentRoute]?.visits || 0) + 1
      };
      localStorage.setItem('funnelProgress', JSON.stringify(funnelData));
    } catch (e) {
      console.warn('Não foi possível armazenar progresso do funil:', e);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao registrar progresso do funil:', error);
    return false;
  }
}

// Configurar monitoramento de navegação
function setupNavigationMonitoring() {
  try {
    // Monitorar cliques em links para páginas do funil
    document.addEventListener('click', (event) => {
      const target = event.target;
      
      // Verificar se o clique foi em um link ou em um elemento dentro de um link
      const linkElement = target.tagName === 'A' ? target : target.closest('a');
      
      if (linkElement && linkElement.href) {
        const href = linkElement.getAttribute('href');
        
        // Verificar se é um link interno para uma rota do funil
        if (href === '/' || href === '/resultado' || href === '/quiz-descubra-seu-estilo') {
          console.log(`🔄 Navegação detectada para: ${href}`);
          
          // Registrar clique em link do funil
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'ClickButton', { 
              button_text: linkElement.textContent.trim(),
              destination: href
            });
          }
        }
      }
    });
    
    console.log('✅ Monitoramento de navegação configurado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao configurar monitoramento de navegação:', error);
    return false;
  }
}

// Expor função globalmente
if (typeof window !== 'undefined') {
  window.monitorFunnelRoutes = monitorFunnelRoutes;
}

// Auto-executar quando a página for carregada
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monitorFunnelRoutes);
  } else {
    monitorFunnelRoutes();
  }
}

export default monitorFunnelRoutes;
