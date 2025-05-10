/**
 * Utilitário otimizado para corrigir imagens borradas na seção de introdução do quiz
 * 
 * NOTA: Este utilitário foi otimizado para minimizar impacto na performance:
 * - Executa apenas uma vez quando necessário
 * - Direcionado apenas para imagens que precisam de correção
 * - Remove manipulações desnecessárias do DOM
 */

// Função principal para corrigir imagens borradas
export const fixBlurryIntroQuizImages = (): number => {
  // 1. Identificar apenas imagens Cloudinary que podem ter problemas de nitidez
  const quizIntroImages = document.querySelectorAll<HTMLImageElement>('img[src*="cloudinary.com"]');
  let count = 0;
  
  if (quizIntroImages.length === 0) {
    return 0; // Sem imagens para corrigir
  }
  
  quizIntroImages.forEach(img => {
    const src = img.src;
    
    // 2. Verificar se a imagem precisa de otimização (evita modificações desnecessárias)
    if (src && 
        (src.includes('q_auto') || 
         src.includes('q_') && !src.includes('q_90') && !src.includes('q_95') && !src.includes('q_100') ||
         src.includes('e_blur'))) {
      
      // 3. Criar uma URL de alta qualidade sem manipulação de DOM excessiva
      let highQualitySrc = src;
      
      // Remover parâmetros de blur
      if (highQualitySrc.includes('e_blur')) {
        highQualitySrc = highQualitySrc.replace(/[,/]e_blur:[0-9]+/g, '');
      }
      
      // Substituir qualidade baixa por alta
      if (highQualitySrc.includes('q_')) {
        highQualitySrc = highQualitySrc.replace(/q_[0-9]+/g, 'q_95');
      }
      
      // 4. Aplicar apenas se a URL for diferente (evita reflows desnecessários)
      if (highQualitySrc !== src) {
        img.src = highQualitySrc;
        img.style.imageRendering = 'crisp-edges';
        count++;
      }
    }
  });
  
  return count;
};

export default fixBlurryIntroQuizImages;
