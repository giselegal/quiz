
/**
 * Utility para gerenciar Facebook Pixel
 */

export const loadFacebookPixel = () => {
  // Configuração do Facebook Pixel apenas se não estiver em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    try {
      // Inicialização padrão do Facebook Pixel
      // Este código normalmente é fornecido pelo Facebook
      const pixelId = '123456789012345'; // Substituir pelo ID real do pixel
      
      // Criar objeto fbq se não existir
      if (!(window as any).fbq) {
        (window as any).fbq = function() {
          (window as any).fbq.queue.push(arguments);
        };
        (window as any).fbq.queue = [];
      }
      
      console.log('[Analytics] Facebook Pixel inicializado');
      
      // Adicionar script do Facebook
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://connect.facebook.net/en_US/fbevents.js`;
      document.head.appendChild(script);
      
      // Inicializar pixel
      (window as any).fbq('init', pixelId);
      (window as any).fbq('track', 'PageView');
      
    } catch (error) {
      console.error('[Analytics] Erro ao inicializar Facebook Pixel:', error);
    }
  } else {
    console.log('[Analytics] Facebook Pixel não inicializado em ambiente de desenvolvimento');
  }
};
