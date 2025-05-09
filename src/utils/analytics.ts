/**
 * Inicializa o Pixel do Facebook
 */
import { getPixelId, getCurrentFunnelConfig, getFacebookToken, getCtaUrl, getUtmCampaign, trackFunnelEvent } from '@/services/pixelManager';

export const initFacebookPixel = () => {
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
    console.log('Inicializando Facebook Pixel com ID:', pixelId);

    // Inicializa o Pixel
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    
    // Registra adicionalmente o funil atual para análises
    const funnelConfig = getCurrentFunnelConfig();
    console.log('Funil atual:', funnelConfig.funnelName, '(', funnelConfig.utmCampaign, ')');

  } catch (error) {
    console.error('Erro ao inicializar o Facebook Pixel:', error);
  }
};

// Utilitário para adicionar parâmetros UTM aos eventos - REMOVIDO - duplicado abaixo

/**
 * Rastreia um evento de geração de lead
 * @param email Email do lead
 */
export const trackLeadGeneration = (email: string) => {
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      email: email
    });
    console.log('Lead tracked with email:', email);
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'lead_generation', {
      event_category: 'lead',
      event_label: email
    });
  }
};

/**
 * Captura parâmetros UTM da URL atual e armazena no localStorage
 * Retorna os parâmetros UTM capturados
 */
export const captureUTMParameters = (): Record<string, string> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    // Parâmetros UTM padrão
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
    utmKeys.forEach(key => {
      if (urlParams.has(key)) {
        const value = urlParams.get(key);
        if (value) {
          utmParams[key] = value;
        }
      }
    });
    
    // Parâmetro específico do Facebook
    if (urlParams.has('fbclid')) {
      utmParams['fbclid'] = urlParams.get('fbclid') || '';
    }
    
    // Gclid para Google Ads
    if (urlParams.has('gclid')) {
      utmParams['gclid'] = urlParams.get('gclid') || '';
    }
    
    // Se encontrou algum parâmetro UTM, armazena no localStorage
    if (Object.keys(utmParams).length > 0) {
      localStorage.setItem('utm_parameters', JSON.stringify(utmParams));
      
      // Track UTM parameters if Facebook Pixel is available
      if (window.fbq) {
        window.fbq('trackCustom', 'UTMCaptured', utmParams);
      }
      
      console.log('UTM parameters captured:', utmParams);
    }
    
    return utmParams;
  } catch (error) {
    console.error('Error capturing UTM parameters:', error);
    return {};
  }
};

/**
 * Adiciona parâmetros UTM armazenados ao evento do Facebook Pixel
 */
export const addUtmParamsToEvent = (eventData: Record<string, any> = {}): Record<string, any> => {
  try {
    const storedUtmParams = localStorage.getItem('utm_parameters');
    if (storedUtmParams) {
      const utmParams = JSON.parse(storedUtmParams);
      // Adiciona parâmetros UTM ao objeto eventData para o Facebook Pixel
      return {
        ...eventData,
        utm_source: utmParams.utm_source || utmParams.source,
        utm_medium: utmParams.utm_medium || utmParams.medium,
        utm_campaign: utmParams.utm_campaign || utmParams.campaign,
        utm_content: utmParams.utm_content || utmParams.content,
        utm_term: utmParams.utm_term || utmParams.term,
        fbclid: utmParams.fbclid
      };
    }
    return eventData;
  } catch (error) {
    console.error('Error adding UTM parameters to event:', error);
    return eventData;
  }
};

/**
 * Rastreia o início do quiz
 * @param userName Nome do usuário
 * @param userEmail Email do usuário (opcional)
 */
export const trackQuizStart = (userName?: string, userEmail?: string) => {
  if (window.fbq) {
    const eventData = addUtmParamsToEvent({
      username: userName || 'Anônimo',
      user_email: userEmail || '',
      funnel: getCurrentFunnelConfig().funnelName
    });
    window.fbq('trackCustom', 'QuizStart', eventData);
    
    // Adicionar tracking específico para análises de funil
    trackFunnelEvent('FunnelQuizStart', {
      username: userName || 'Anônimo',
      has_email: !!userEmail
    });
    
    console.log('QuizStart tracked with UTM data');
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'quiz_start', {
      event_category: 'quiz',
      event_label: userEmail ? 'with_email' : 'anonymous',
      funnel: getCurrentFunnelConfig().funnelName
    });
  }
};

/**
 * Rastreia uma resposta no quiz
 * @param questionId ID da pergunta
 * @param selectedOptions IDs das opções selecionadas
 * @param currentQuestionIndex Índice da pergunta atual
 * @param totalQuestions Número total de perguntas
 */
export const trackQuizAnswer = (questionId: string, selectedOptions: string[], currentQuestionIndex: number, totalQuestions: number) => {
  if (window.fbq) {
    const eventData = addUtmParamsToEvent({
      question_id: questionId,
      selected_options: selectedOptions.join(', '),
      current_question_index: currentQuestionIndex,
      total_questions: totalQuestions
    });
    window.fbq('trackCustom', 'QuizAnswer', eventData);
    console.log(`QuizAnswer tracked for question ${questionId} with options ${selectedOptions.join(', ')}`);
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'quiz_answer', {
      event_category: 'quiz',
      question_id: questionId,
      selected_options: selectedOptions.join(', '),
      current_question_index: currentQuestionIndex,
      total_questions: totalQuestions
    });
  }
};

/**
 * Rastreia a conclusão do quiz
 */
export const trackQuizComplete = () => {
  // Calcular o tempo decorrido desde o início do quiz
  const startTime = localStorage.getItem('quiz_start_time');
  const endTime = Date.now();
  const duration = startTime ? (endTime - parseInt(startTime, 10)) / 1000 : 0; // em segundos
  
  if (window.fbq) {
    const eventData = addUtmParamsToEvent({
      quiz_duration: duration
    });
    window.fbq('trackCustom', 'QuizComplete', eventData);
    console.log('QuizComplete tracked');
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'quiz_complete', {
      event_category: 'quiz',
      quiz_duration: duration
    });
  }
};

/**
 * Rastreia a visualização do resultado
 * @param styleCategory Categoria do estilo predominante
 */
export const trackResultView = (styleCategory: string) => {
  if (window.fbq) {
    const eventData = addUtmParamsToEvent({
      style_category: styleCategory
    });
    window.fbq('trackCustom', 'ResultView', eventData);
    console.log('ResultView tracked with UTM data for style:', styleCategory);
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'result_view', {
      event_category: 'quiz',
      event_label: styleCategory
    });
  }
};

/**
 * Registra cliques em botões para análise
 * @param buttonId ID do botão (opcional)
 * @param buttonText Texto do botão (opcional)
 * @param buttonLocation Localização do botão na interface (opcional)
 * @param actionType Tipo de ação associada ao botão (opcional)
 */
export const trackButtonClick = (
  buttonId?: string, 
  buttonText?: string, 
  buttonLocation?: string,
  actionType?: string
) => {
  if (window.fbq) {
    const eventData = addUtmParamsToEvent({
      button_id: buttonId || 'unknown',
      button_text: buttonText || 'unknown',
      button_location: buttonLocation || 'unknown',
      action_type: actionType || 'click',
      funnel: getCurrentFunnelConfig().funnelName
    });
    
    window.fbq('trackCustom', 'ButtonClick', eventData);
    console.log(`Button click tracked: ${buttonText || buttonId}`);
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'button_click', {
      event_category: 'interaction',
      event_label: buttonText || buttonId,
      button_location: buttonLocation,
      funnel: getCurrentFunnelConfig().funnelName
    });
  }
};

/**
 * Registra conversões de vendas
 * @param value Valor da venda
 * @param productName Nome do produto (opcional)
 */
export const trackSaleConversion = (value: number, productName?: string) => {
  if (window.fbq) {
    const eventData = addUtmParamsToEvent({
      value: value,
      currency: 'BRL',
      content_name: productName || 'Guia de Estilo',
      content_type: 'product',
      funnel: getCurrentFunnelConfig().funnelName
    });
    
    // Standard Purchase event
    window.fbq('track', 'Purchase', eventData);
    
    // Adicionar tracking específico para análises de funil
    trackFunnelEvent('FunnelPurchase', {
      value: value,
      product_name: productName || 'Guia de Estilo'
    });
    
    console.log(`Sale conversion tracked: ${value} BRL for ${productName || 'Guia de Estilo'}`);
  }
  
  // Track in Google Analytics, if available
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: 'T_' + Date.now(),
      value: value,
      currency: 'BRL',
      items: [{
        name: productName || 'Guia de Estilo',
        price: value,
        funnel: getCurrentFunnelConfig().funnelName
      }]
    });
  }
};

/**
 * Obtém todos os eventos analytics armazenados
 */
export const getAnalyticsEvents = () => {
  try {
    const eventsJson = localStorage.getItem('analytics_events');
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error getting analytics events:', error);
    return [];
  }
};

/**
 * Limpa todos os dados de analytics armazenados
 */
export const clearAnalyticsData = () => {
  try {
    localStorage.removeItem('analytics_events');
    localStorage.removeItem('fb_pixel_event_log');
    localStorage.removeItem('analytics_metrics_cache');
    console.log('Analytics data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing analytics data:', error);
    return false;
  }
};

/**
 * Testa a funcionalidade do Facebook Pixel
 */
export const testFacebookPixel = () => {
  if (window.fbq) {
    window.fbq('trackCustom', 'TestEvent', { test_value: 'test' });
    console.log('Test event sent to Facebook Pixel');
    return true;
  } else {
    console.error('Facebook Pixel not initialized');
    return false;
  }
};
