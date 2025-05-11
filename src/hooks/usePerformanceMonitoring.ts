
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
        // Web-vitals tem uma API diferente nas versões mais recentes
        const webVitals = await import('web-vitals');
        
        // Função para enviar métricas
        const sendMetric = (metric: any) => {
          const { name, value, id } = metric;
          // Log para desenvolvimento (remova em produção)
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Web Vitals] ${name}: ${value} (ID: ${id})`);
          }
          
          // Em produção, envie para seu serviço de analytics
          // Exemplo para Google Analytics:
          // window.gtag?.('event', name, { value, event_category: 'Web Vitals', event_label: id });
        };
        
        // Registrar callbacks para cada métrica
        if (webVitals.onCLS) webVitals.onCLS(sendMetric);
        if (webVitals.onFCP) webVitals.onFCP(sendMetric);
        if (webVitals.onLCP) webVitals.onLCP(sendMetric);
        if (webVitals.onTTFB) webVitals.onTTFB(sendMetric);
        
        // Verificar se onFID ou onINP existe (API versão 3.x)
        // Nas versões mais recentes, onINP pode substituir onFID
        if ('onINP' in webVitals) {
          webVitals.onINP(sendMetric);
        } else if ('onFID' in webVitals) {
          // @ts-ignore - Handle older web-vitals versions
          webVitals.onFID?.(sendMetric);
        }
        
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
