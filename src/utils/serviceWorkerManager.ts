/**
 * Utilitário para registrar e gerenciar o service worker
 */

// Variável para controlar se o service worker já foi registrado
let registration: ServiceWorkerRegistration | null = null;

/**
 * Registra o service worker com estratégias para melhor desempenho
 * @returns Promise com o registro do service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers não são suportados neste navegador');
    return null;
  }
  
  try {
    // Registrar o service worker com opções de desempenho
    registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none' // Sempre verificar atualizações do SW
    });
    
    console.log('Service worker registrado com sucesso:', registration.scope);
    
    // Configurar atualização automática do service worker
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      
      console.log('Nova versão do service worker encontrada, instalando...');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('Nova versão do service worker instalada, pronta para ativação');
          
          // Notificar o usuário sobre a atualização
          if (window.confirm('Uma nova versão está disponível. Atualizar agora?')) {
            // Forçar atualização imediata
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      });
    });
    
    // Verificar e limpar caches periodicamente para economizar espaço
    setInterval(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAN_CACHES' });
      }
    }, 24 * 60 * 60 * 1000); // Uma vez por dia
    
    return registration;
  } catch (error) {
    console.error('Falha ao registrar service worker:', error);
    return null;
  }
};

/**
 * Verifica se há uma nova versão do service worker disponível
 * e oferece atualização ao usuário
 */
export const checkForServiceWorkerUpdate = async (): Promise<void> => {
  if (!registration) return;
  
  try {
    await registration.update();
    console.log('Verificação de atualizações do service worker concluída');
  } catch (error) {
    console.error('Erro ao verificar atualizações do service worker:', error);
  }
};

/**
 * Força a ativação do novo service worker
 */
export const applyServiceWorkerUpdate = (): void => {
  if (!registration || !registration.waiting) return;
  
  // Enviar mensagem para o SW em espera para assumir o controle
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  
  // Recarregar a página para usar o novo service worker
  window.location.reload();
};
