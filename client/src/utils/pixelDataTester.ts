// Utility to test and demonstrate real pixel events
import { logRealPixelEvent } from './realPixelData';

export const simulateRealPixelEvents = () => {
  const pixelId = localStorage.getItem('fb_pixel_id') || '1311550759901086';
  
  // Simulate a realistic user journey with proper timing
  const events = [
    {
      type: 'ViewContent',
      data: {
        content_name: 'Quiz Descubra Seu Estilo - Página B',
        content_category: 'Quiz Landing Page',
        value: 47,
        currency: 'BRL'
      },
      delay: 0
    },
    {
      type: 'InitiateCheckout',
      data: {
        content_name: 'Quiz Descubra Seu Estilo',
        content_category: 'Quiz',
        value: 0,
        currency: 'BRL'
      },
      delay: 5000 // 5 seconds after page view
    },
    {
      type: 'AddToCart',
      data: {
        content_name: 'Quiz Progress 25%',
        content_category: 'Quiz',
        value: 11.75,
        currency: 'BRL'
      },
      delay: 15000 // 15 seconds after start
    },
    {
      type: 'AddToCart',
      data: {
        content_name: 'Quiz Progress 50%',
        content_category: 'Quiz',
        value: 23.5,
        currency: 'BRL'
      },
      delay: 30000 // 30 seconds
    },
    {
      type: 'CompleteRegistration',
      data: {
        content_name: 'Quiz Completo - Descubra Seu Estilo',
        content_category: 'Quiz',
        value: 47,
        currency: 'BRL',
        status: 'completed'
      },
      delay: 45000 // 45 seconds
    }
  ];

  console.log('🎯 Iniciando simulação de eventos reais de pixel...');
  
  events.forEach((event, index) => {
    setTimeout(() => {
      logRealPixelEvent(event.type, event.data, pixelId);
      console.log(`✓ Evento ${index + 1}/${events.length}: ${event.type} registrado`);
      
      if (index === events.length - 1) {
        console.log('🎉 Simulação completa! Atualize a análise para ver os dados.');
      }
    }, event.delay);
  });
};

export const generateSamplePurchaseEvent = () => {
  const pixelId = localStorage.getItem('fb_pixel_id') || '1311550759901086';
  
  logRealPixelEvent('Purchase', {
    content_name: 'Manual de Estilo Contemporâneo',
    content_category: 'Digital Product',
    value: 47,
    currency: 'BRL',
    content_ids: ['manual-estilo-contemporaneo'],
    num_items: 1
  }, pixelId);
  
  console.log('💰 Evento de compra registrado!');
};

export const clearAllPixelData = () => {
  const keysToRemove = [
    'pixel_events_log',
    'fb_pixel_event_log',
    'mock_pixel_events',
    'test_events'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('🧹 Todos os dados de pixel foram limpos.');
};