/**
 * Utility para funções de analytics e tracking
 */

// Tipo para parâmetros UTM
interface UTMParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  fbclid?: string;
  gclid?: string;
}

// Capturar parâmetros UTM da URL
export const captureUTMParameters = (): UTMParameters => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const utmParams: UTMParameters = {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
    term: urlParams.get('utm_term') || undefined,
    content: urlParams.get('utm_content') || undefined,
    fbclid: urlParams.get('fbclid') || undefined,
    gclid: urlParams.get('gclid') || undefined
  };
  
  // Salvar no localStorage para uso posterior
  if (Object.values(utmParams).some(value => value !== undefined)) {
    localStorage.setItem('utm_params', JSON.stringify(utmParams));
    console.log('[Analytics] UTM parameters capturados:', utmParams);
  }
  
  return utmParams;
};

// Inicializar Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'development') {
    // Importar dinamicamente para evitar carregamento desnecessário em desenvolvimento
    import('./facebookPixel').then(module => {
      module.loadFacebookPixel();
    });
  }
};

// Track específico para início do quiz
export const trackQuizStart = (name: string, email?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'QuizStart', { name, email });
    console.log('[Analytics] Quiz iniciado por:', name, email || '');
  }
};

// Track específico para geração de lead
export const trackLeadGeneration = (email: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', { email });
    console.log('[Analytics] Lead gerado:', email);
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
    const eventData = { // Idealmente, adicionar UTMs aqui também se necessário
      question_id: questionId,
      selected_options: selectedOptions.join(', '),
      current_question_index: currentQuestionIndex,
      total_questions: totalQuestions
    };
    window.fbq('trackCustom', 'QuizAnswer', eventData);
    console.log(`[Analytics] QuizAnswer tracked for question ${questionId}`);
  }
  
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
  const startTime = localStorage.getItem('quiz_start_time');
  const endTime = Date.now();
  const duration = startTime ? (endTime - parseInt(startTime, 10)) / 1000 : 0; // em segundos
  
  if (window.fbq) {
    const eventData = { quiz_duration: duration }; // Adicionar UTMs se necessário
    window.fbq('trackCustom', 'QuizComplete', eventData);
    console.log('[Analytics] QuizComplete tracked');
  }
  
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
    const eventData = { style_category: styleCategory }; // Adicionar UTMs se necessário
    window.fbq('trackCustom', 'ResultView', eventData);
    console.log('[Analytics] ResultView tracked for style:', styleCategory);
  }
  
  if (window.gtag) {
    window.gtag('event', 'result_view', {
      event_category: 'quiz',
      event_label: styleCategory
    });
  }
};

/**
 * Registra cliques em botões para análise
 */
export const trackButtonClick = (
  buttonId?: string, 
  buttonText?: string, 
  buttonLocation?: string,
  actionType?: string
) => {
  if (window.fbq) {
    const eventData = { // Adicionar UTMs se necessário
      button_id: buttonId || 'unknown',
      button_text: buttonText || 'unknown',
      button_location: buttonLocation || 'unknown',
      action_type: actionType || 'click',
      // funnel: getCurrentFunnelConfig().funnelName // getCurrentFunnelConfig não está definida neste escopo
    };
    
    window.fbq('trackCustom', 'ButtonClick', eventData);
    console.log(`[Analytics] Button click tracked: ${buttonText || buttonId}`);
  }
  
  if (window.gtag) {
    window.gtag('event', 'button_click', {
      event_category: 'interaction',
      event_label: buttonText || buttonId,
      button_location: buttonLocation,
      // funnel: getCurrentFunnelConfig().funnelName // getCurrentFunnelConfig não está definida
    });
  }
};

/**
 * Registra conversões de vendas
 */
export const trackSaleConversion = (value: number, productName?: string) => {
  if (window.fbq) {
    const eventData = { // Adicionar UTMs se necessário
      value: value,
      currency: 'BRL',
      content_name: productName || 'Guia de Estilo',
      content_type: 'product',
      // funnel: getCurrentFunnelConfig().funnelName // getCurrentFunnelConfig não está definida
    };
    
    window.fbq('track', 'Purchase', eventData);
    console.log(`[Analytics] Sale conversion tracked: ${value} BRL for ${productName || 'Guia de Estilo'}`);
  }
  
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: 'T_' + Date.now(),
      value: value,
      currency: 'BRL',
      items: [{
        name: productName || 'Guia de Estilo',
        price: value,
        // funnel: getCurrentFunnelConfig().funnelName // getCurrentFunnelConfig não está definida
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

// Exportações padrão podem não ser necessárias se todas as funções são exportadas nomeadamente
// export default {
//   captureUTMParameters,
//   initFacebookPixel,
//   trackQuizStart,
//   trackLeadGeneration,
//   getAnalyticsEvents,
//   clearAnalyticsData,
//   testFacebookPixel
// };

// Funções que estavam na versão local e podem precisar ser reintegradas ou foram substituídas:
// - addUtmParamsToEvent (a lógica de UTM agora está em captureUTMParameters e precisa ser aplicada aos eventos)
// - A inicialização manual do script do FB pixel (agora em ./facebookPixel, presumivelmente)
// - As chamadas para trackFunnelEvent e getCurrentFunnelConfig (precisam ser verificadas/reintegradas se necessário)
