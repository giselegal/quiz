
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

// Renderizar aplicativo
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remover CSS crítico após carregamento completo
window.addEventListener('load', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd('App Render');
    console.log('Componentes carregados, removendo CSS crítico');
  }
  // Programar remoção do CSS crítico após carregamento completo
  setTimeout(removeCriticalCSS, 1000);
});
