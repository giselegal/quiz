/**
 * Utility para gerenciar Facebook Pixel
 */

declare global {
  interface Window {
    fbq: any;
  }
}

// Inicialização do Facebook Pixel
export const initFacebookPixel = (pixelId: string): void => {
  if (typeof window !== 'undefined') {
    // Inicialização do código do pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', pixelId);
    fbq('track', 'PageView');
  }
};

// Função para rastrear eventos - esta é a função que está faltando
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
