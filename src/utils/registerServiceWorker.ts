/**
 * Registra o Service Worker para cache e estratégias offline
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.log('Falha ao registrar o ServiceWorker:', error);
        });
    });
  }
};
