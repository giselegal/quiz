
/**
 * Utility para gerenciar Facebook Pixel
 */

// Define proper types for Facebook Pixel
interface FacebookPixel {
  (event: string, eventName: string, params?: object): void;
  (event: 'init', pixelId: string): void;
  (event: 'track', eventName: string, params?: object): void;
  (event: 'trackCustom', eventName: string, params?: object): void;
  push: (args: any[]) => void;
  loaded: boolean;
  version: string;
  queue: any[];
}

// Extend Window interface correctly
declare global {
  interface Window {
    fbq?: FacebookPixel;
    _fbq?: any;
  }
}

// Configuração do ID do Pixel
const FACEBOOK_PIXEL_ID = '1234567890123456'; // Substitua pelo seu ID real do Facebook Pixel

// Inicialização do Facebook Pixel
export const initFacebookPixel = (pixelId: string): void => {
  if (typeof window !== 'undefined') {
    // Inicialização do código do pixel
    // Add separate functions to avoid type errors with if conditions
    const loadFbPixelScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    };
    
    const setupFbPixel = () => {
      window._fbq = window._fbq || [];
      window.fbq = function() {
        if (window._fbq) window._fbq.push(arguments);
      } as any;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];
    };
    
    if (!window.fbq) {
      setupFbPixel();
      loadFbPixelScript();
    }
    
    if (window.fbq) {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }
  }
};

// Função conveniente para inicializar o pixel com o ID padrão
export const loadFacebookPixel = (): void => {
  try {
    initFacebookPixel(FACEBOOK_PIXEL_ID);
    console.log('Facebook Pixel inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar o Facebook Pixel:', error);
  }
};

// Função para rastrear eventos
export const trackPixelEvent = (eventName: string, params?: object): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  } else {
    console.log(`Facebook Pixel Event (simulado): ${eventName}`, params);
  }
};

// Outras funções de utilidade para o pixel podem ser adicionadas aqui
export const trackLead = (value?: number, currency?: string): void => {
  trackPixelEvent('Lead', { value, currency });
};

export const trackPurchase = (value: number, currency?: string): void => {
  trackPixelEvent('Purchase', { value, currency });
};
