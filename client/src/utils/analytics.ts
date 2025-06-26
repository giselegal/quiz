/**
 * Utilitários para tracking e analytics
 */

/**
 * Registra clique em botão
 */
export const trackButtonClick = (buttonId: string, buttonText: string, section: string, additionalData?: Record<string, any>) => {
  console.log('Button click tracked:', { buttonId, buttonText, section, additionalData });
  
  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ButtonClick', {
      button_id: buttonId,
      button_text: buttonText,
      section: section,
      ...additionalData
    });
  }

  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'Button',
      event_label: buttonText,
      custom_parameter_button_id: buttonId,
      custom_parameter_section: section,
      ...additionalData
    });
  }
};

/**
 * Registra conversão de venda
 */
export const trackSaleConversion = (email: string, value: number) => {
  console.log('Sale conversion tracked:', { email, value });
  
  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: 'BRL',
      content_type: 'product',
      content_ids: ['quiz-completo'],
      email: email
    });
  }

  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: value,
      currency: 'BRL',
      items: [{
        item_id: 'quiz-completo',
        item_name: 'Quiz Completo + Bônus',
        category: 'Digital Product',
        quantity: 1,
        price: value
      }]
    });
  }
};

/**
 * Registra visualização de página
 */
export const trackPageView = (pageName: string, additionalData?: Record<string, any>) => {
  console.log('Page view tracked:', { pageName, additionalData });
  
  const pageUrl = additionalData?.page_url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView', {
      page_name: pageName,
      page_url: pageUrl,
      ...additionalData
    });
  }

  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: pageUrl,
      ...additionalData
    });
  }
};

/**
 * Registra evento personalizado
 */
export const trackCustomEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  console.log('Custom event tracked:', { eventName, eventData });
  
  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, eventData);
  }

  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

/**
 * Registra início do quiz
 */
export const trackQuizStart = (quizName: string, additionalData?: Record<string, any>) => {
  trackCustomEvent('QuizStart', {
    quiz_name: quizName,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

/**
 * Registra resposta do quiz
 */
export const trackQuizAnswer = (quizName: string, questionId: string, answer: string, additionalData?: Record<string, any>) => {
  trackCustomEvent('QuizAnswer', {
    quiz_name: quizName,
    question_id: questionId,
    answer: answer,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

/**
 * Registra conclusão do quiz
 */
export const trackQuizComplete = (quizName: string, additionalData?: Record<string, any>) => {
  trackCustomEvent('QuizComplete', {
    quiz_name: quizName,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

/**
 * Registra visualização de resultado
 */
export const trackResultView = (quizName: string, result: string, additionalData?: Record<string, any>) => {
  trackCustomEvent('ResultView', {
    quiz_name: quizName,
    quiz_result: result,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

/**
 * Registra lead (captura de email)
 */
export const trackLead = (email: string, source: string) => {
  console.log('Lead tracked:', { email, source });
  
  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      email: email,
      source: source
    });
  }

  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'BRL',
      value: 0,
      lead_source: source
    });
  }
};

/**
 * Inicializa Facebook Pixel
 */
export const initFacebookPixel = () => {
  console.log('Initializing Facebook Pixel...');
  // This function is a placeholder for pixel initialization
  // The actual pixel initialization should be handled by the pixel manager
};

/**
 * Obtém eventos de analytics armazenados
 */
export const getAnalyticsEvents = () => {
  try {
    const events = localStorage.getItem('analytics_events');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error getting analytics events:', error);
    return [];
  }
};

/**
 * Armazena evento de analytics
 */
export const storeAnalyticsEvent = (event: any) => {
  try {
    const events = getAnalyticsEvents();
    events.push({
      ...event,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('analytics_events', JSON.stringify(events));
  } catch (error) {
    console.error('Error storing analytics event:', error);
  }
};
