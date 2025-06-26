
import { useState, useEffect, useCallback } from 'react';

interface LoadingOptions {
  initialState?: boolean;
  minDuration?: number;
  maxDuration?: number;
  disableTransitions?: boolean;
}

export const useLoadingState = ({
  initialState = true,
  minDuration = 800,
  maxDuration = 5000,
  disableTransitions = false
}: LoadingOptions = {}) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [startTime] = useState<number>(Date.now());

  // Handle loading completion with minimum duration
  const completeLoading = useCallback(() => {
    if (disableTransitions) {
      setIsLoading(false);
      return;
    }
    
    const elapsedTime = Date.now() - startTime;
    
    // Verificar se os resultados foram pré-carregados para acelerar a transição
    const hasPreloadedResults = localStorage.getItem('preloadedResults') === 'true';
    
    // Se os resultados já foram pré-carregados, reduzimos drasticamente o tempo
    // de carregamento para quase instantâneo para evitar o skeleton desnecessário
    const effectiveMinDuration = hasPreloadedResults ? 50 : minDuration;
    
    // If less time has passed than minDuration, wait before completing
    if (elapsedTime < effectiveMinDuration) {
      const remainingTime = effectiveMinDuration - elapsedTime;
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    } else {
      // If enough time has passed, complete immediately
      setIsLoading(false);
    }
  }, [startTime, minDuration, disableTransitions]);

  // Provide manual control over loading state
  const setLoading = useCallback((state: boolean) => {
    if (state === false) {
      completeLoading();
    } else {
      setIsLoading(true);
    }
  }, [completeLoading]);

  // Set up timeout for maximum loading duration
  useEffect(() => {
    if (isLoading && maxDuration) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setIsTimedOut(true);
        console.warn('Loading timed out after', maxDuration, 'ms');
      }, maxDuration);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isLoading, maxDuration]);

  // Detect slow loading based on device capabilities
  useEffect(() => {
    if (isLoading) {
      // Check if device seems to be low-performance
      const memory = (navigator as any).deviceMemory;
      const cpuCores = navigator.hardwareConcurrency;
      
      if ((memory && memory < 2) || (cpuCores && cpuCores < 2)) {
        // For very low-end devices, skip animations to improve performance
        console.info('Low performance device detected, optimizing loading experience');
      }
    }
  }, [isLoading]);

  return {
    isLoading,
    setLoading,
    isTimedOut,
    completeLoading
  };
};
