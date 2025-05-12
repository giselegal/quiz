
import { useEffect } from 'react';
import { onCLS, onLCP } from 'web-vitals';

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
          value: Math.round(metric.value * 100) / 100, // Convert to ms
          non_interaction: true, // Doesn't affect bounce rate
        });
        console.log(`[Performance] ${metric.name}: ${metric.value}`);
      }
    };

    // Monitor Core Web Vitals
    onCLS(logMetric);
    onLCP(logMetric);
    
    // Note: FID (First Input Delay) has been replaced in the latest web-vitals
    // If you need INP (Interaction to Next Paint), you can add it here
    // import { onINP } from 'web-vitals';
    // onINP(logMetric);
  }, [analyticsId]);
};

export default usePerformanceMonitoring;
