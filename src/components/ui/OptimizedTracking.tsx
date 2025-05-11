
import { useEffect } from 'react';

interface TrackingScript {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  onLoad?: () => void;
  dataAttributes?: Record<string, string>;
}

/**
 * Componente para carregamento otimizado de scripts de rastreamento
 * Carrega scripts de analytics e rastreamento de forma não bloqueante
 * 
 * @param scripts Lista de scripts de rastreamento para carregar
 * @param waitForInteraction Se verdadeiro, carrega apenas após interação do usuário
 * @param delay Atraso em ms antes de carregar (padrão: 1000ms)
 */
export const OptimizedTracking: React.FC<{
  scripts: TrackingScript[];
  waitForInteraction?: boolean;
  delay?: number;
}> = ({ scripts, waitForInteraction = false, delay = 1000 }) => {
  useEffect(() => {
    // Função para carregar os scripts
    const loadScripts = () => {
      // Primeiro verificamos se já existe um timeout em andamento
      const existingTimeout = window._scriptLoadTimeout;
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      
      // Configuramos um novo timeout para o carregamento dos scripts
      const timeoutId = setTimeout(() => {
        scripts.forEach(script => {
          // Verificar se já existe
          if (document.getElementById(script.id)) {
            if (script.onLoad) script.onLoad();
            return;
          }
          
          const scriptEl = document.createElement('script');
          scriptEl.id = script.id;
          scriptEl.src = script.src;
          scriptEl.async = script.async !== false;
          scriptEl.defer = script.defer !== false;
          
          // Adicionar data attributes se especificados
          if (script.dataAttributes) {
            Object.entries(script.dataAttributes).forEach(([key, value]) => {
              scriptEl.dataset[key] = value;
            });
          }
          
          if (script.onLoad) {
            scriptEl.onload = script.onLoad;
          }
          
          document.body.appendChild(scriptEl);
        });
      }, delay);
      
      // Armazenar o ID do timeout para gerenciamento
      window._scriptLoadTimeout = timeoutId as any;
    };
    
    // Se waitForInteraction é verdadeiro, espera pela primeira interação
    if (waitForInteraction) {
      const handleInteraction = () => {
        // Carregar scripts após interação e remover listeners
        loadScripts();
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });
      };
      
      // Adicionar listeners para detectar interação
      ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
        document.addEventListener(event, handleInteraction, { passive: true, once: true });
      });
      
      // Se não houver interação após 5 segundos, carrega de qualquer forma
      const fallbackTimeout = setTimeout(() => {
        loadScripts();
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });
      }, 5000);
      
      return () => {
        // Limpeza
        clearTimeout(fallbackTimeout);
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });
      };
    } else {
      // Carrega após o delay especificado
      loadScripts();
      
      return () => {
        // Limpeza ao desmontar
        const existingTimeout = window._scriptLoadTimeout;
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
      };
    }
  }, [scripts, waitForInteraction, delay]);
  
  // Este componente não renderiza nada
  return null;
};

// Adicionar a definição para _scriptLoadTimeout global
declare global {
  interface Window {
    _scriptLoadTimeout: number | NodeJS.Timeout;
  }
}

export default OptimizedTracking;
