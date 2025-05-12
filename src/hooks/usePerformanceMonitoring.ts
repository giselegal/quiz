import { useEffect } from 'react';
import { onCLS, onFID, onLCP } from 'web-vitals';

interface PerformanceMonitoringProps {
  analyticsId: string;
}

export const usePerformanceMonitoring = ({ analyticsId }: PerformanceMonitoringProps) => {
  useEffect(() => {
    const logMetric = (metric: any) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value * 100) / 100, // Convert to ms for FID/LCP
          non_interaction: true, // Doesn't affect bounce rate
        });
        console.log(`[Performance] ${metric.name}: ${metric.value}`);
      }
    };

    onCLS(logMetric);
    onFID(logMetric);
    onLCP(logMetric);
  }, [analyticsId]);
};

export default usePerformanceMonitoring;
