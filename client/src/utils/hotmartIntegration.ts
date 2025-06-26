export const hotmartIntegration = {
  trackSaleConversion: (value: number, currency: string = 'BRL', productName: string = 'Guia de Estilo') => {
    if (typeof window !== 'undefined') {
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: value,
          currency: currency,
          content_name: productName
        });
      }
      
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: 'T_' + Date.now(),
          value: value,
          currency: currency,
          items: [{
            name: productName,
            price: value
          }]
        });
      }
    }
    
    console.log(`[Hotmart] Sale conversion tracked: ${value} ${currency}`);
  },
};
