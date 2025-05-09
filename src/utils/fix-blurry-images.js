/**
 * Script para substituição imediata de imagens embaçadas
 * Este script detecta e substitui imagens embaçadas assim que são carregadas
 * Coloque este script no início da sua página para evitar qualquer flash de imagens embaçadas
 */

// Configurações
const IMAGE_QUALITY = 95; // Qualidade muito alta para imagens críticas
const MIN_IMAGE_WIDTH = 1200; // Largura mínima para garantir nitidez

/**
 * Remove parâmetros de blur e aplicar alta qualidade a uma URL de imagem
 */
function getHighQualityUrl(url) {
  if (!url) return url;
  
  // Se não for uma URL do Cloudinary, retornar sem alterações
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return url;
  }
  
  let newUrl = url;
  
  // 1. Remover parâmetros de blur
  if (newUrl.includes('e_blur')) {
    newUrl = newUrl.replace(/[,/]e_blur:[0-9]+/g, '');
  }
  
  // 2. Substituir qualidade baixa por alta qualidade
  if (newUrl.includes('q_')) {
    newUrl = newUrl.replace(/q_[0-9]+/g, `q_${IMAGE_QUALITY}`);
  } else if (newUrl.includes('/upload/')) {
    // Adicionar parâmetro de qualidade se não existir
    newUrl = newUrl.replace('/upload/', `/upload/q_${IMAGE_QUALITY},`);
  }
  
  // 3. Garantir formato automático para melhor qualidade
  if (!newUrl.includes('f_auto')) {
    newUrl = newUrl.replace('/upload/', '/upload/f_auto,');
  }
  
  // 4. Se a largura for muito pequena (placeholder), aumentar
  if (newUrl.match(/w_[0-9]+/) && newUrl.match(/w_[0-9]+/)[0].replace('w_', '') < 100) {
    newUrl = newUrl.replace(/w_[0-9]+/, `w_${MIN_IMAGE_WIDTH}`);
  }
  
  // 5. Adicionar nitidez para melhorar a qualidade percebida
  if (!newUrl.includes('e_sharpen')) {
    newUrl = newUrl.replace('/upload/', '/upload/e_sharpen:60,');
  }
  
  return newUrl;
}

/**
 * Substitui imediatamente a URL da imagem por uma versão de alta qualidade
 */
function fixBlurryImage(img) {
  // Salvar a URL original
  const originalSrc = img.src;
  
  // Obter URL de alta qualidade
  const highQualitySrc = getHighQualityUrl(originalSrc);
  
  // Se houver diferença, substituir
  if (highQualitySrc !== originalSrc) {
    // Substituir imediatamente
    img.src = highQualitySrc;
    
    // Remover classes e estilos de embaçamento
    img.style.filter = 'none';
    img.classList.remove('blur', 'placeholder');
    
    // Remover também de elementos pais que podem ter blur
    if (img.parentElement) {
      if (img.parentElement.classList.contains('blur-wrapper')) {
        img.parentElement.classList.remove('blur-wrapper');
      }
      img.parentElement.style.filter = 'none';
    }
    
    // Retornar que a imagem foi corrigida
    return true;
  }
  
  // A imagem já estava boa
  return false;
}

/**
 * Corrige todas as imagens na página
 */
function fixAllBlurryImages() {
  const images = document.querySelectorAll('img');
  let fixedCount = 0;
  
  images.forEach(img => {
    if (fixBlurryImage(img)) {
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Observa novas imagens sendo adicionadas à página e corrige-as
 */
function setupImageObserver() {
  // Criar um MutationObserver para detectar novas imagens
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        // Se for uma imagem
        if (node.nodeName === 'IMG') {
          fixBlurryImage(node);
        }
        // Se contiver imagens
        else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(img => {
            fixBlurryImage(img);
          });
        }
      });
    });
  });
  
  // Observar mudanças no documento
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

/**
 * Prevenir placeholders embaçados interceptando requisições de imagem
 */
function preventBlurryPlaceholders() {
  // Interceptar o método Image.prototype.src
  const originalSet = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;
  
  // Substituir pelo nosso método que melhora as URLs
  Object.defineProperty(Image.prototype, 'src', {
    set: function(url) {
      // Aplicar a URL melhorada
      originalSet.call(this, getHighQualityUrl(url));
    }
  });
}

// Execução imediata ao carregar
(function() {
  // 1. Corrigir imagens existentes
  const fixedCount = fixAllBlurryImages();
  console.log(`🔍 Corrigidas ${fixedCount} imagens embaçadas existentes`);
  
  // 2. Observar novas imagens
  const observer = setupImageObserver();
  console.log('👀 Monitorando novas imagens para correção automática');
  
  // 3. Evitar placeholders embaçados
  preventBlurryPlaceholders();
  console.log('🛡️ Prevenção de placeholders embaçados ativada');
  
  // 4. Corrigir novamente após um tempo (garantia)
  setTimeout(() => {
    const additionalFixed = fixAllBlurryImages();
    if (additionalFixed > 0) {
      console.log(`🔄 Corrigidas mais ${additionalFixed} imagens em uma segunda verificação`);
    }
  }, 1500);
})();

// Exportar funções para uso externo
window.ImageFixer = {
  fixBlurryImage,
  fixAllBlurryImages,
  getHighQualityUrl
};
