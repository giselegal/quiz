/**
 * Registra o Service Worker para cache e estratégias offline
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Usar o caminho correto para o subdiretório
      const basePath = import.meta.env.BASE_URL || '/quiz-de-estilo/';
      navigator.serviceWorker.register(`${basePath}sw.js`, { scope: basePath })
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.log('Falha ao registrar o ServiceWorker:', error);
        });
    });
  }
};
