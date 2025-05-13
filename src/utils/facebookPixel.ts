
// Corrigir a definição de fbq para resolver "All declarations of 'fbq' must have identical modifiers."
// Sem acesso ao arquivo original, a correção seria unificar as declarações:

interface FacebookPixelEvent {
  (event: string, eventId: string): void;
  (event: string, eventId: string, data: any): void;
}

// Declare fb pixel
declare global {
  interface Window {
    fbq: FacebookPixelEvent;
  }
}

// Inicializar o Facebook Pixel
export const initFacebookPixel = (pixelId: string = '1234567890123456'): void => {
  if (typeof window === 'undefined') return;

  // Verificar se o script já foi carregado
  if (window.fbq) return;

  // Criar o script do Facebook Pixel
  window.fbq = function() {
    // @ts-ignore
    window.fbq.callMethod ? 
    // @ts-ignore
    window.fbq.callMethod.apply(window.fbq, arguments) : 
    // @ts-ignore
    window.fbq.queue.push(arguments);
  };

  // @ts-ignore
  if (!window._fbq) window._fbq = window.fbq;
  // @ts-ignore
  window.fbq.push = window.fbq;
  // @ts-ignore
  window.fbq.loaded = true;
  // @ts-ignore
  window.fbq.version = '2.0';
  // @ts-ignore
  window.fbq.queue = [];

  // Carregar o script do Facebook
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  // Inicializar o Pixel
  if (window.fbq) {
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
};

// Função para carregar o Facebook Pixel
export const loadFacebookPixel = (): void => {
  try {
    initFacebookPixel();
  } catch (error) {
    console.error('Erro ao carregar o Facebook Pixel:', error);
  }
};

// Função para rastrear eventos do Facebook Pixel
export const trackPixelEvent = (event: string, data?: any): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, data);
  }
};
