
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

// Adicionar declaração para o fbq global
declare global {
  interface Window {
    fbq?: any;
  }
}

export default {
  captureUTMParameters,
  initFacebookPixel,
  trackQuizStart,
  trackLeadGeneration
};
