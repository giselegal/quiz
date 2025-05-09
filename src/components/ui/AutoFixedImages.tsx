/**
 * Componente que substitui diretamente as imagens embaçadas usando solução JavaScript pura
 * Esta versão não depende do ciclo de vida do React e funciona imediatamente
 */
import React, { useEffect } from 'react';

// Importar o script de correção de imagens
import '../../utils/fix-blurry-images.js';

// Declaração de tipos para window.ImageFixer
declare global {
  interface Window {
    ImageFixer?: {
      fixBlurryImage: (img: HTMLImageElement) => boolean;
      fixAllBlurryImages: () => number;
      getHighQualityUrl: (url: string) => string;
    };
  }
}

interface AutoFixedImagesProps {
  children: React.ReactNode;
  priority?: boolean;
}

/**
 * Componente que corrige imediatamente as imagens embaçadas
 * Esta versão usa um script direto de JS que substitui todas as imagens embaçadas
 * sem depender do ciclo de vida do React
 */
const AutoFixedImages: React.FC<AutoFixedImagesProps> = ({ 
  children,
  priority = true
}) => {
  useEffect(() => {
    // Usando variáveis globais configuradas pelo script
    if (window.ImageFixer && priority) {
      // Executar imediatamente
      window.ImageFixer.fixAllBlurryImages();
      
      // Executar novamente em intervalos diferentes para capturar 
      // imagens carregadas assincronamente
      setTimeout(() => {
        window.ImageFixer?.fixAllBlurryImages();
      }, 200);
      
      setTimeout(() => {
        window.ImageFixer?.fixAllBlurryImages();
      }, 500);
      
      setTimeout(() => {
        window.ImageFixer?.fixAllBlurryImages();
      }, 1000);
      
      setTimeout(() => {
        window.ImageFixer?.fixAllBlurryImages();
      }, 2000);
      
      setTimeout(() => {
        window.ImageFixer?.fixAllBlurryImages();
      }, 3500);
    }
  }, [priority]);
  
  return (
    <div className="auto-fixed-images">
      {children}
    </div>
  );
};

export default AutoFixedImages;
