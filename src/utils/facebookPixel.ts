
/**
 * Utility para gerenciar Facebook Pixel
 */

declare global {
  interface Window {
    fbq: (event: string, eventName: string, params?: any, eventId?: { eventID: string }) => void;
    _fbq?: any;
  }
}

// Configuração do ID do Pixel
const FACEBOOK_PIXEL_ID = '1234567890123456'; // Substitua pelo seu ID real do Facebook Pixel

// Inicialização do Facebook Pixel
export const initFacebookPixel = (pixelId: string): void => {
  if (typeof window !== 'undefined') {
    // Inicialização do código do pixel
    !function(f: any, b: any, e: any, v: any, n: any, t: any, s: any)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    if(s?.parentNode) s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
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
