
import { useEffect } from 'react';

interface CriticalCSSLoaderProps {
  cssContent: string;
  id?: string;
  removeOnLoad?: boolean;
}

/**
 * Componente que injeta CSS crítico no head
 * e opcionalmente o remove após carregamento da página
 */
const CriticalCSSLoader = ({
  cssContent,
  id = 'critical-css',
  removeOnLoad = false
}: CriticalCSSLoaderProps) => {
  useEffect(() => {
    // Injetar CSS no head
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = cssContent;
    document.head.appendChild(style);

    // Remover CSS após carregamento se necessário
    if (removeOnLoad) {
      const handleLoad = () => {
        // Pequeno atraso para garantir que os estilos permanentes foram aplicados
        setTimeout(() => {
          if (style && style.parentNode) {
            style.parentNode.removeChild(style);
          }
        }, 1000);
      };

      window.addEventListener('load', handleLoad);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        if (style && style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    }
    
    return () => {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [cssContent, id, removeOnLoad]);

  return null;
};

export default CriticalCSSLoader;
