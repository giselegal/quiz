
import { useEffect, useState, useRef } from 'react';

interface TrackingProps {
  event: string;
  data?: Record<string, any>;
  delay?: number;
  onTracked?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Componente para rastreamento de eventos com otimizações de performance
 * Suporta atraso, deduplicação e gerenciamento de dependências
 */
export const OptimizedTracking: React.FC<TrackingProps> = ({
  event,
  data,
  delay = 0,
  onTracked,
  onError
}) => {
  const [isTracked, setIsTracked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Função para enviar o evento
    const trackEvent = async () => {
      try {
        // Implementar o rastreamento aqui
        console.log(`[Tracking] Event: ${event}`, data);
        
        // Simular uma chamada de API
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Marcar como rastreado
        setIsTracked(true);
        
        // Callback de sucesso
        if (onTracked) {
          onTracked();
        }
      } catch (error) {
        console.error(`[Tracking] Error tracking event ${event}:`, error);
        
        // Callback de erro
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    };
    
    // Se já rastreou, não faça novamente
    if (isTracked) {
      return;
    }
    
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Rastrear imediatamente ou com atraso
    if (delay <= 0) {
      void trackEvent();
    } else {
      timeoutRef.current = setTimeout(() => {
        void trackEvent();
      }, delay);
    }
    
    // Limpar timeout ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [event, data, delay, isTracked, onTracked, onError]);
  
  // Este componente não renderiza nada visualmente
  return null;
};

export default OptimizedTracking;
