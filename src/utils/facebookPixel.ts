import { getPixelId } from '@/services/pixelManager';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Carrega e inicializa o Facebook Pixel de forma robusta
 */
export const loadFacebookPixel = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Verifica se o objeto fbq já existe
    if (!window.fbq) {
      // Se não existir, criamos o script do Facebook Pixel manualmente
      (function(f,b,e,v,n,t,s) {
        if (f.fbq) return; n=f.fbq=function() {
          n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
        n.queue=[]; t=b.createElement(e); t.async=!0;
        t.src=v; s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      
      console.log('Facebook Pixel script carregado manualmente');
    }
    
    // Obtém o ID do pixel para o funil atual
    const pixelId = getPixelId();
    
    // Função segura para inicializar e rastrear
    const safeInitPixel = () => {
      if (window.fbq) {
        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
        console.log('Facebook Pixel inicializado com ID:', pixelId);
        return true;
      }
      return false;
    };
    
    // Tenta inicializar imediatamente
    if (!safeInitPixel()) {
      // Se falhar, tenta novamente após 1 segundo
      setTimeout(() => {
        if (!safeInitPixel()) {
          // Última tentativa após 3 segundos
          setTimeout(safeInitPixel, 3000);
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Erro ao inicializar o Facebook Pixel:', error);
  }
};

/**
 * Rastreia um evento personalizado
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  try {
    window.fbq('track', eventName, eventData);
    console.log(`Evento rastreado: ${eventName}`, eventData);
  } catch (error) {
    console.error(`Erro ao rastrear evento ${eventName}:`, error);
  }
};
