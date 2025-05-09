
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { displayVersion } from './utils/version';
import { injectCriticalCSS, initialCriticalCSS, removeCriticalCSS } from './utils/critical-css';

// Injetar CSS crítico para renderização inicial mais rápida
injectCriticalCSS(initialCriticalCSS);

// Display version information in console
displayVersion();

// Iniciar medição de performance
if (process.env.NODE_ENV !== 'production') {
  console.time('App Render');
}

// Renderizar aplicativo com tratamento de erro
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('Aplicativo renderizado com sucesso!');
  } else {
    console.error('Elemento root não encontrado!');
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
  
  // Programar remoção do CSS crítico após carregamento completo
  setTimeout(removeCriticalCSS, 1000);
  
  // Aplicar correção para imagens borradas
  if (typeof window.fixBlurryIntroQuizImages === 'function') {
    // Tentar corrigir imagens várias vezes para pegar aquelas carregadas tardiamente
    window.fixBlurryIntroQuizImages();
    setTimeout(window.fixBlurryIntroQuizImages, 500);
    setTimeout(window.fixBlurryIntroQuizImages, 1500);
    setTimeout(window.fixBlurryIntroQuizImages, 3000);
  }
});
