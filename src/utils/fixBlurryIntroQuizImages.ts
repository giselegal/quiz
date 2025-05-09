// Uma única função para corrigir as imagens borradas do quiz de introdução
export function fixBlurryIntroQuizImages() {
  console.log('Iniciando correção de imagens borradas na seção de introdução do quiz...');
  
  // 1. Identificar todas as imagens na seção de introdução do quiz
  const quizIntroImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img, img');
  let count = 0;
  
  quizIntroImages.forEach(img => {
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
        highQualitySrc = highQualitySrc.replace(/q_[0-9]+/g, 'q_95');
      } else if (highQualitySrc.includes('/upload/')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/q_95,');
      }
      
      // Garantir formato automático
      if (!highQualitySrc.includes('f_auto')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/f_auto,');
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

// Executar a correção automaticamente quando o documento for carregado
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixBlurryIntroQuizImages);
    // Executar novamente após 1 segundo para pegar imagens carregadas dinamicamente
    setTimeout(fixBlurryIntroQuizImages, 1000);
  } else {
    fixBlurryIntroQuizImages();
    // Executar novamente após 1 segundo para pegar imagens carregadas dinamicamente
    setTimeout(fixBlurryIntroQuizImages, 1000);
  }
}
