// Uma única função para corrigir as imagens borradas do quiz de introdução
export function fixBlurryIntroQuizImages() {
  console.log('Iniciando correção de imagens borradas na seção de introdução do quiz...');
  
  // 1. Identificar todas as imagens na seção de introdução do quiz
  const quizIntroImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img, .quiz-intro-image, img');
  let count = 0;
  
  quizIntroImages.forEach(imgElement => {
    // Converter para HTMLImageElement para ter acesso às propriedades de imagem
    const img = imgElement as HTMLImageElement;
    const src = img.src;
    
    // 2. Verificar se é uma imagem do Cloudinary que pode estar borrada
    if (src && src.includes('cloudinary.com')) {
      // 3. Criar uma URL de alta qualidade
      let highQualitySrc = src;
      
      // Remover parâmetros de blur
      if (highQualitySrc.includes('e_blur')) {
        highQualitySrc = highQualitySrc.replace(/[,/]e_blur:[0-9]+/g, '');
      }
      
      // Substituir qualidade baixa por alta
      if (highQualitySrc.includes('q_')) {
        highQualitySrc = highQualitySrc.replace(/q_[0-9]+/g, 'q_99');
      } else if (highQualitySrc.includes('/upload/')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/q_99,');
      }
      
      // Garantir formato automático e adicionar nitidez avançada
      if (!highQualitySrc.includes('f_auto')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/f_auto,');
      }
      
      // Adicionar nitidez avançada se ainda não existir
      if (!highQualitySrc.includes('e_sharpen')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/e_sharpen:80,');
      }
      
      // 4. Substituir a URL somente se for diferente
      if (highQualitySrc !== src) {
        img.src = highQualitySrc;
        
        // 5. Remover filtros CSS e classes que podem causar embaçamento
        img.style.filter = 'none';
        img.classList.remove('blur', 'placeholder', 'lazy-load');
        
        console.log(`Imagem corrigida: ${src} → ${highQualitySrc}`);
        count++;
      }
    }
  });
  
  console.log(`Correção finalizada: ${count} imagens corrigidas de ${quizIntroImages.length} total`);
  return count;
}

// Declarar a função globalmente para acesso externo
declare global {
  interface Window {
    fixBlurryIntroQuizImages: typeof fixBlurryIntroQuizImages;
  }
}

// Expor a função globalmente
if (typeof window !== 'undefined') {
  window.fixBlurryIntroQuizImages = fixBlurryIntroQuizImages;
}

// Executar a correção automaticamente quando o documento for carregado
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixBlurryIntroQuizImages);
    // Executar múltiplas vezes para pegar imagens carregadas dinamicamente
    setTimeout(fixBlurryIntroQuizImages, 500);
    setTimeout(fixBlurryIntroQuizImages, 1000);
    setTimeout(fixBlurryIntroQuizImages, 2000);
    setTimeout(fixBlurryIntroQuizImages, 3500);
  } else {
    fixBlurryIntroQuizImages();
    // Executar múltiplas vezes para pegar imagens carregadas dinamicamente
    setTimeout(fixBlurryIntroQuizImages, 500);
    setTimeout(fixBlurryIntroQuizImages, 1000);
    setTimeout(fixBlurryIntroQuizImages, 2000);
    setTimeout(fixBlurryIntroQuizImages, 3500);
  }
}
