/**
 * @file ImageChecker.js
 * 
 * Utilitário para verificar o status das imagens utilizadas na aplicação
 * Ajuda a diagnosticar problemas de performance e qualidade de imagem
 */

import { imageCache } from '../utils/images/caching';
import { getAllImages } from '../data/imageBank';
import { optimizeCloudinaryUrl } from '../utils/images/optimization';

/**
 * Verifica e apresenta ao console informações sobre as imagens carregadas
 * Útil para debug de problemas de carregamento e qualidade de imagem
 */
export const checkImageStatus = () => {
  console.group('📊 Status das Imagens');
  
  // Estatísticas do cache
  const cacheSize = imageCache.size;
  console.log(`📦 Total no Cache: ${cacheSize} imagens`);
  
  // Contadores
  let loaded = 0;
  let loading = 0;
  let error = 0;
  let noStatus = 0;
  let withLowQuality = 0;
  
  // Verificar cada entrada no cache
  imageCache.forEach((data, key) => {
    if (data.loadStatus === 'loaded') loaded++;
    else if (data.loadStatus === 'loading') loading++;
    else if (data.loadStatus === 'error') error++;
    else noStatus++;
    
    if (data.lowQualityUrl) withLowQuality++;
  });
  
  // Exibir estatísticas
  console.log(`✅ Carregadas: ${loaded}`);
  console.log(`⏳ Carregando: ${loading}`);
  console.log(`❌ Erros: ${error}`);
  console.log(`❓ Sem status: ${noStatus}`);
  console.log(`🔍 Com placeholders: ${withLowQuality}`);
  
  // Verificar problemas comuns
  if (error > 0) {
    console.warn(`⚠️ ${error} imagens falharam ao carregar. Verifique os console.error acima.`);
  }
  
  if (withLowQuality < cacheSize * 0.8 && cacheSize > 5) {
    console.warn(`⚠️ Apenas ${withLowQuality} de ${cacheSize} imagens têm placeholders de baixa qualidade.`);
  }
  
  // Verificar imagens do banco
  const bankImages = getAllImages();
  console.log(`📚 Total no ImageBank: ${bankImages.length} imagens`);
  
  const uncachedImages = bankImages.filter(img => {
    const optimizedUrl = optimizeCloudinaryUrl(img.src, { quality: 85, format: 'auto' });
    return !imageCache.has(optimizedUrl);
  });
  
  if (uncachedImages.length > 0) {
    console.warn(`⚠️ ${uncachedImages.length} imagens no banco de dados não estão em cache.`);
    if (uncachedImages.length < 10) {
      console.log('Imagens não cacheadas:', uncachedImages.map(img => img.id));
    }
  }
  
  console.groupEnd();
  
  return {
    cacheSize,
    loaded,
    loading,
    error,
    noStatus,
    withLowQuality,
    uncachedCount: uncachedImages.length
  };
};

/**
 * Verifica a estrutura e qualidade das imagens na página de introdução
 */
export const checkIntroImages = () => {
  console.group('🖼️ Verificação de Imagens da Introdução');
  
  // Encontrar elementos de imagem no DOM
  const allImages = document.querySelectorAll('img');
  console.log(`🔍 Total de imagens no DOM: ${allImages.length}`);
  
  // Verificar cada imagem
  let blurryImages = 0;
  let missingDimensions = 0;
  let notOptimized = 0;
  
  allImages.forEach((img, index) => {
    // Verificar dimensões
    if (!img.width || !img.height || img.width === 0 || img.height === 0) {
      missingDimensions++;
      console.warn(`⚠️ Imagem #${index} não tem dimensões definidas:`, img.src);
    }
    
    // Verificar otimização (apenas para Cloudinary)
    if (img.src.includes('cloudinary.com') && 
        !img.src.includes('f_auto') && 
        !img.src.includes('q_auto')) {
      notOptimized++;
      console.warn(`⚠️ Imagem Cloudinary não otimizada:`, img.src);
    }
    
    // Verificar placeholders/blur
    const style = window.getComputedStyle(img);
    if (style.filter && style.filter.includes('blur') && img.complete) {
      blurryImages++;
      console.warn(`⚠️ Imagem #${index} parece estar embaçada:`, img.src);
    }
  });
  
  console.log(`👍 Status:
    - Imagens sem dimensões: ${missingDimensions}
    - Imagens não otimizadas: ${notOptimized}
    - Imagens possivelmente embaçadas: ${blurryImages}
  `);
  
  if (missingDimensions === 0 && notOptimized === 0 && blurryImages === 0) {
    console.log('✅ Todas as imagens parecem estar configuradas corretamente!');
  }
  
  console.groupEnd();
  
  return {
    totalImages: allImages.length,
    blurryImages,
    missingDimensions,
    notOptimized
  };
};

export default {
  checkImageStatus,
  checkIntroImages
};
