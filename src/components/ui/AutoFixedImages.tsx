/**
 * Componente que substitui automaticamente as imagens da introdução do quiz
 * por versões de alta qualidade, eliminando o problema de imagens embaçadas.
 */
import React, { useEffect, useState } from 'react';
import { getHighQualityImageUrl } from '../../utils/images/blurry-image-fixer';

interface AutoFixedImagesProps {
  selector?: string;
  children: React.ReactNode;
  autoFix?: boolean;
}

/**
 * Componente que envolve a seção de introdução e corrige automaticamente imagens embaçadas
 */
const AutoFixedImages: React.FC<AutoFixedImagesProps> = ({ 
  selector = '.quiz-intro img, [data-section="intro"] img',
  children,
  autoFix = true
}) => {
  const [isFixed, setIsFixed] = useState(false);
  
  useEffect(() => {
    if (autoFix) {
      // Pequeno atraso para garantir que as imagens tenham sido renderizadas
      const timer = setTimeout(() => {
        fixImagesInContainer(selector);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selector, autoFix]);
  
  const fixImagesInContainer = (imgSelector: string) => {
    const images = document.querySelectorAll(imgSelector);
    console.log(`🔍 Localizadas ${images.length} imagens para correção automática`);
    
    if (images.length === 0) return;
    
    let fixedCount = 0;
    
    images.forEach((img: HTMLImageElement) => {
      const originalSrc = img.src;
      const highQualitySrc = getHighQualityImageUrl(originalSrc);
      
      if (highQualitySrc !== originalSrc) {
        // Criar nova imagem para pré-carregar
        const newImg = new Image();
        newImg.onload = () => {
          // Substituir a fonte da imagem original
          img.src = highQualitySrc;
          
          // Remover qualquer filtro de embaçamento
          img.style.filter = 'none';
          img.classList.remove('blur', 'placeholder');
          
          if (img.parentElement?.classList.contains('blur-wrapper')) {
            img.parentElement.classList.remove('blur-wrapper');
          }
          
          fixedCount++;
          console.log(`✅ Imagem corrigida (${fixedCount}/${images.length}): ${originalSrc}`);
          
          if (fixedCount === images.length) {
            console.log('🎉 Todas as imagens foram corrigidas com sucesso!');
            setIsFixed(true);
          }
        };
        
        newImg.onerror = () => {
          console.error(`❌ Erro ao carregar nova imagem: ${highQualitySrc}`);
        };
        
        // Iniciar carregamento
        newImg.src = highQualitySrc;
      } else {
        console.log(`⚠️ Imagem já parece otimizada: ${originalSrc}`);
      }
    });
  };
  
  return (
    <div className={`auto-fixed-images ${isFixed ? 'all-fixed' : 'fixing'}`}>
      {children}
    </div>
  );
};

export default AutoFixedImages;
