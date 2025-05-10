
import React, { useEffect } from 'react';
import { fixBlurryIntroQuizImages } from '@/utils/fixBlurryIntroQuizImages';

interface AutoFixedImagesProps {
  children: React.ReactNode;
  fixOnMount?: boolean;
  fixOnUpdate?: boolean;
  className?: string;
}

/**
 * Componente wrapper que aplica correções de imagens borradas automaticamente
 * Este componente observa mudanças no DOM para corrigir imagens adicionadas dinamicamente
 */
const AutoFixedImages: React.FC<AutoFixedImagesProps> = ({
  children,
  fixOnMount = true,
  fixOnUpdate = true,
  className = ''
}) => {
  // Aplicar correção na montagem inicial
  useEffect(() => {
    if (fixOnMount) {
      // Pequeno atraso para permitir que a renderização seja completada
      const timer = setTimeout(() => {
        fixBlurryIntroQuizImages();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [fixOnMount]);
  
  // Observar mudanças no DOM para corrigir imagens adicionadas dinamicamente
  useEffect(() => {
    if (fixOnUpdate) {
      // Configurar MutationObserver para detectar mudanças no DOM
      const observer = new MutationObserver((mutations) => {
        let needsFix = false;
        
        // Verificar se alguma mutação adicionou imagens
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if ((node as Element).tagName === 'IMG' || 
                  (node as Element).querySelector?.('img')) {
                needsFix = true;
              }
            });
          }
        });
        
        // Aplicar correção apenas se novas imagens foram adicionadas
        if (needsFix) {
          fixBlurryIntroQuizImages();
        }
      });
      
      // Iniciar observação
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      return () => observer.disconnect();
    }
  }, [fixOnUpdate]);
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default AutoFixedImages;
