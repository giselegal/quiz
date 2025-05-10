
/**
 * Utilitário otimizado para corrigir imagens borradas na seção de introdução do quiz
 */

// Função principal para corrigir imagens borradas
export const fixBlurryIntroQuizImages = (): number => {
  console.log('Iniciando correção de imagens borradas na seção de introdução do quiz...');
  
  // 1. Identificar todas as imagens na seção de introdução do quiz com seletores precisos
  const quizIntroImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img, .quiz-intro-image');
  let count = 0;
  
  if (quizIntroImages.length === 0) {
    console.log("Nenhuma imagem encontrada para correção");
    return 0;
  }
  
  console.log(`Encontradas ${quizIntroImages.length} imagens para verificação`);
  
  quizIntroImages.forEach(imgElement => {
    // Converter para HTMLImageElement para ter acesso às propriedades de imagem
    const img = imgElement as HTMLImageElement;
    const src = img.src;
    
    // 2. Verificar se é uma imagem do Cloudinary que pode estar borrada
    if (src && src.includes('cloudinary.com')) {
      // 3. Criar uma URL de alta qualidade com algoritmo melhorado
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
      
      // Garantir formato automático para melhor compatibilidade
      if (!highQualitySrc.includes('f_auto')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/f_auto,');
      }
      
      // Adicionar DPR automático para telas de alta resolução
      if (!highQualitySrc.includes('dpr_')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/dpr_auto,');
      }
      
      // Adicionar nitidez avançada para imagens mais nítidas
      if (!highQualitySrc.includes('e_sharpen')) {
        highQualitySrc = highQualitySrc.replace('/upload/', '/upload/e_sharpen:80,');
      }
      
      // 4. Substituir a URL somente se for diferente e aplicar otimizações adicionais
      if (highQualitySrc !== src) {
        img.src = highQualitySrc;
        
        // 5. Remover filtros CSS e classes que podem causar embaçamento
        img.style.filter = 'none';
        img.classList.remove('blur', 'placeholder', 'lazy-load');
        
        // 6. Adicionar atributos de renderização para melhorar a qualidade
        img.style.imageRendering = 'crisp-edges';
        if (!img.hasAttribute('decoding')) {
          img.decoding = 'sync';
        }
        
        console.log(`Imagem corrigida: ${img.alt || 'sem-alt'}`);
        count++;
      }
    }
  });
  
  console.log(`Correção finalizada: ${count} imagens corrigidas de ${quizIntroImages.length} total`);
  return count;
};

// Expor a função globalmente para acesso externo
declare global {
  interface Window {
    fixBlurryIntroQuizImages: typeof fixBlurryIntroQuizImages;
  }
}

// Registrar a função no objeto window
if (typeof window !== 'undefined') {
  window.fixBlurryIntroQuizImages = fixBlurryIntroQuizImages;
}

// Executar a correção automaticamente quando o documento for carregado
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(fixBlurryIntroQuizImages, 100);
    });
  } else {
    // Executar uma única vez após o carregamento completo
    setTimeout(fixBlurryIntroQuizImages, 100);
  }
}

export default fixBlurryIntroQuizImages;
