
import React, { useEffect, useRef } from 'react';

interface OptimizedTrackingProps {
  category: string;
  event?: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  delay?: number;
  children?: React.ReactNode;
}

export const OptimizedTracking: React.FC<OptimizedTrackingProps> = ({
  category,
  event = 'view',
  label,
  value,
  nonInteraction = true,
  delay = 2000,
  children
}) => {
  const tracked = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only track once
    if (tracked.current) return;

    // Track after delay
    timerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event, {
          event_category: category,
          event_label: label,
          value: value,
          non_interaction: nonInteraction
        });
        
        console.log(`[Analytics] Tracked: ${category} - ${event} - ${label}`);
      }
      
      tracked.current = true;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [category, event, label, value, nonInteraction, delay]);

  // Simply render children
  return <>{children}</>;
};

export default OptimizedTracking;
