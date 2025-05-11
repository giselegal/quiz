
import { initLazyLoading } from './utils/lazyScript';
import { initFontOptimization } from './utils/fontPreload';
import { initImageOptimizations } from './utils/imageOptimization';
import { registerServiceWorker } from './utils/serviceWorkerManager';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { VERSION, getVersionInfo } from './utils/version';
import { injectCriticalCSS, initialCriticalCSS, removeCriticalCSS } from './utils/critical-css';
import { checkSiteHealth } from './utils/siteHealthCheck';
import { monitorFunnelRoutes } from './utils/funnelMonitor';

// Adicionar preload de fontes críticas
initFontOptimization();

// Injetar CSS crítico para renderização inicial mais rápida
injectCriticalCSS(initialCriticalCSS);

// Inicializar otimizações de imagem
initImageOptimizations();

// Exibir informações de versão no console apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  console.log(`App Version: ${VERSION.number} (Build ${VERSION.buildNumber})`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.time('App Render');
}

// Inicializar lazy loading de scripts não críticos
initLazyLoading();

// Renderizar aplicativo com tratamento de erro
try {
  const rootElement = document.getElementById('root');
  
  // Usar um callback de renderização para medir o tempo de renderização
  const renderApp = () => {
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Aplicativo renderizado com sucesso!');
      }
      
      // Registrar o Service Worker no final da renderização (apenas em produção)
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          // Pequeno atraso para garantir que os recursos essenciais sejam carregados primeiro
          setTimeout(() => {
            registerServiceWorker().then(reg => {
              if (reg) {
                console.log('Service Worker registrado com sucesso');
              }
            });
          }, 1000);
        });
      }
    } else {
      console.error('Elemento root não encontrado!');
      // Fallback para quando o elemento root não é encontrado
      const bodyElement = document.body;
      if (bodyElement) {
        const fallbackRoot = document.createElement('div');
        fallbackRoot.id = 'root';
        bodyElement.appendChild(fallbackRoot);
        // Tentar renderizar novamente
        ReactDOM.createRoot(fallbackRoot).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Aplicativo renderizado no elemento fallback!');
        }
      }
    }
  };
  
  // Verificar se o documento já está pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
} catch (error) {
  console.error('Erro ao renderizar o aplicativo:', error);
  // Tentar renderização alternativa
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Oops! Algo deu errado.</h2>
        <p>Estamos trabalhando para resolver. Por favor, tente recarregar a página.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #B89B7A; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px;">
          Recarregar Página
        </button>
      </div>
    `;
  }
}

// Remover CSS crítico após carregamento completo
window.addEventListener('load', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd('App Render');
    console.log('Componentes carregados, removendo CSS crítico');
  }
  
  // Programar remoção do CSS crítico após carregamento completo - agora mais rápido
  setTimeout(removeCriticalCSS, 200);
  
  // Aplicar correção para imagens borradas - usando RequestIdleCallback para melhor performance
  if (typeof window.fixBlurryIntroQuizImages === 'function') {
    // Executar imediatamente para as imagens já carregadas
    window.fixBlurryIntroQuizImages();
    
    // Usar IntersectionObserver para corrigir imagens apenas quando visíveis
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('.lazy-image');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (typeof window.requestIdleCallback === 'function') {
              window.requestIdleCallback(() => window.fixBlurryIntroQuizImages(), { timeout: 500 });
            } else {
              window.fixBlurryIntroQuizImages();
            }
            imageObserver.unobserve(entry.target);
          }
        });
      });
      
      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
    } else {
      // Fallback para navegadores sem suporte a IntersectionObserver
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => window.fixBlurryIntroQuizImages(), { timeout: 500 });
      } else {
        setTimeout(window.fixBlurryIntroQuizImages, 500);
      }
    }
  }
});
