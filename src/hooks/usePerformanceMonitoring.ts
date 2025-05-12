
import { useEffect } from 'react';

/**
 * Hook para monitorar e reportar métricas de desempenho Web Vitals
 * Coleta FCP, LCP, CLS, TTFB e FID para análise de desempenho
 */
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Importar web-vitals apenas quando necessário
    const reportWebVitals = async () => {
      try {
        // Import the correct named exports from web-vitals
        const webVitals = await import('web-vitals');
        
        // Função para enviar métricas
        const sendMetric = ({ name, value, id }) => {
          // Log para desenvolvimento (remova em produção)
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Web Vitals] ${name}: ${value} (ID: ${id})`);
          }
          
          // Em produção, envie para seu serviço de analytics
          // Exemplo para Google Analytics:
          // window.gtag?.('event', name, { value, event_category: 'Web Vitals', event_label: id });
        };
        
        // Use the web-vitals methods through the imported object
        webVitals.onCLS(sendMetric);
        webVitals.onFID(sendMetric);
        webVitals.onFCP(sendMetric);
        webVitals.onLCP(sendMetric);
        webVitals.onTTFB(sendMetric);
      } catch (error) {
        console.error('Erro ao carregar web-vitals:', error);
      }
    };
    
    // Reportar métricas apenas após carregamento completo
    if (document.readyState === 'complete') {
      reportWebVitals();
    } else {
      window.addEventListener('load', reportWebVitals);
      return () => window.removeEventListener('load', reportWebVitals);
    }
  }, []);
  
  return null;
};

export default usePerformanceMonitoring;
