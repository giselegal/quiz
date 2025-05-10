// Registra o Service Worker para cache e estratégias offline
export const register = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
};

// Verifica se o Service Worker pode ser instalado
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};
