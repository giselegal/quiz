// Análise e validação dos eventos de pixel
export interface PixelEventValidation {
  eventName: string;
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

export const analyzePixelEvents = (): PixelEventValidation[] => {
  const validations: PixelEventValidation[] = [];

  // Verificar configuração do Facebook Pixel
  const pixelConfig = {
    eventName: "Configuração do Facebook Pixel",
    isValid: true,
    issues: [],
    recommendations: []
  };

  // Verificar se o pixel ID está configurado
  try {
    const pixelId = localStorage.getItem('fb_pixel_id');
    if (!pixelId || pixelId === '') {
      pixelConfig.isValid = false;
      pixelConfig.issues.push("ID do Facebook Pixel não configurado");
      pixelConfig.recommendations.push("Configure o ID do Facebook Pixel nas configurações");
    }
  } catch (error) {
    pixelConfig.issues.push("Erro ao verificar configuração do pixel");
  }

  // Verificar se o tracking está habilitado
  try {
    const trackingEnabled = localStorage.getItem('tracking_enabled');
    if (trackingEnabled !== 'true') {
      pixelConfig.isValid = false;
      pixelConfig.issues.push("Tracking do Facebook Pixel desabilitado");
      pixelConfig.recommendations.push("Habilite o tracking nas configurações");
    }
  } catch (error) {
    pixelConfig.issues.push("Erro ao verificar status do tracking");
  }

  validations.push(pixelConfig);

  // Verificar eventos específicos
  const eventTypes = [
    { key: 'quiz_start', name: 'Início do Quiz', critical: true },
    { key: 'quiz_complete', name: 'Conclusão do Quiz', critical: true },
    { key: 'result_view', name: 'Visualização de Resultado', critical: true },
    { key: 'lead_generated', name: 'Captura de Lead', critical: true },
    { key: 'sale', name: 'Vendas', critical: true }
  ];

  eventTypes.forEach(eventType => {
    const validation: PixelEventValidation = {
      eventName: eventType.name,
      isValid: true,
      issues: [],
      recommendations: []
    };

    try {
      const trackedEvents = JSON.parse(localStorage.getItem('fb_tracked_events') || '{}');
      
      if (!trackedEvents[eventType.key]) {
        validation.isValid = false;
        validation.issues.push(`Evento ${eventType.name} não está habilitado`);
        validation.recommendations.push(`Habilite o evento ${eventType.name} para melhor tracking`);
        
        if (eventType.critical) {
          validation.recommendations.push("Este é um evento crítico para conversões");
        }
      }
    } catch (error) {
      validation.isValid = false;
      validation.issues.push("Erro ao verificar configuração de eventos");
    }

    validations.push(validation);
  });

  // Verificar se o pixel está carregado no navegador
  const browserValidation: PixelEventValidation = {
    eventName: "Carregamento do Pixel no Navegador",
    isValid: true,
    issues: [],
    recommendations: []
  };

  if (typeof window !== 'undefined') {
    if (!window.fbq) {
      browserValidation.isValid = false;
      browserValidation.issues.push("Facebook Pixel não carregado no navegador");
      browserValidation.recommendations.push("Verifique se o script do Facebook Pixel está sendo carregado");
    }
  }

  validations.push(browserValidation);

  return validations;
};

export const getPixelHealthScore = (): number => {
  const validations = analyzePixelEvents();
  const totalEvents = validations.length;
  const validEvents = validations.filter(v => v.isValid).length;
  
  return Math.round((validEvents / totalEvents) * 100);
};

export const getPixelRecommendations = (): string[] => {
  const validations = analyzePixelEvents();
  const recommendations: string[] = [];
  
  validations.forEach(validation => {
    if (!validation.isValid) {
      recommendations.push(...validation.recommendations);
    }
  });
  
  return [...new Set(recommendations)]; // Remove duplicatas
};