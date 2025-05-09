import { preloadCriticalImages, getLowQualityPlaceholder } from '@/utils/imageManager';

/**
 * Pré-carrega imagens de antes e depois para melhorar a experiência do usuário
 * @param transformations Array de transformações com URLs de imagens antes/depois
 */
export const preloadTransformationImages = (transformations) => {
  if (!transformations || !Array.isArray(transformations) || transformations.length === 0) {
    console.warn('Não foi possível pré-carregar imagens de transformação: dados inválidos');
    return;
  }

  // Primeiro, carregue todas as imagens de baixa qualidade para uma exibição rápida
  transformations.forEach(transformation => {
    if (transformation.beforeImage) {
      const beforeLowQuality = getLowQualityPlaceholder(transformation.beforeImage);
      if (beforeLowQuality) {
        const imgLow = new Image();
        imgLow.src = beforeLowQuality;
        imgLow.decoding = "async";
      }
    }
    
    if (transformation.afterImage) {
      const afterLowQuality = getLowQualityPlaceholder(transformation.afterImage);
      if (afterLowQuality) {
        const imgLow = new Image();
        imgLow.src = afterLowQuality;
        imgLow.decoding = "async";
      }
    }
  });

  // Depois, inicie o carregamento da primeira transformação em alta qualidade
  if (transformations[0]) {
    const firstTransformation = transformations[0];
    
    if (firstTransformation.beforeImage) {
      const imgBefore = new Image();
      imgBefore.src = `${firstTransformation.beforeImage}?q=80&f=auto&w=400`;
      imgBefore.fetchPriority = "high";
    }
    
    if (firstTransformation.afterImage) {
      const imgAfter = new Image();
      imgAfter.src = `${firstTransformation.afterImage}?q=80&f=auto&w=400`;
      imgAfter.fetchPriority = "high";
    }
  }

  // Em segundo plano, pré-carregue as outras transformações
  setTimeout(() => {
    for (let i = 1; i < transformations.length; i++) {
      const transformation = transformations[i];
      
      if (transformation.beforeImage) {
        const imgBefore = new Image();
        imgBefore.src = `${transformation.beforeImage}?q=80&f=auto&w=400`;
      }
      
      if (transformation.afterImage) {
        const imgAfter = new Image();
        imgAfter.src = `${transformation.afterImage}?q=80&f=auto&w=400`;
      }
    }
  }, 2000); // Atraso para priorizar o carregamento inicial
};

/**
 * Melhora a qualidade da URL de uma imagem do Cloudinary
 * @param url URL da imagem do Cloudinary
 * @returns URL otimizada
 */
export const getHighQualityImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Remove qualquer transformação existente que possa estar causando baixa qualidade
  if (url.includes('/upload/')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Extrair a versão se existir
      const versionMatch = parts[1].match(/^v\d+\//);
      const version = versionMatch ? versionMatch[0] : '';
      
      // Extrair o path após a versão ou usar todo o path se não houver versão
      const path = version ? parts[1].substring(version.length) : parts[1];
      
      // Aplicar transformações de alta qualidade
      return `${parts[0]}/upload/${version}f_auto,q_85,e_sharpen:60/${path}`;
    }
  }
  
  return url;
};

/**
 * Corrige problemas comuns em imagens embaçadas
 * @param imageElement Elemento DOM da imagem
 */
export const fixBlurryImage = (imageElement) => {
  if (!imageElement || !imageElement.src) return;
  
  const currentSrc = imageElement.src;
  const newSrc = getHighQualityImageUrl(currentSrc);
  
  if (newSrc !== currentSrc) {
    const tempImg = new Image();
    tempImg.onload = () => {
      imageElement.src = newSrc;
      console.log('Imagem corrigida:', newSrc);
    };
    tempImg.src = newSrc;
  }
};
