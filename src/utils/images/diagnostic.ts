/**
 * ImageDiagnostic.ts
 * Utilitário para diagnóstico e monitoramento de imagens no Quiz Sell Genius
 */

import { imageCache } from './images/caching';

interface ImageDiagnosticReport {
  url: string;
  optimizedUrl?: string;
  hasPlaceholder: boolean;
  loadStatus?: 'loading' | 'loaded' | 'error';
  isCloudinary: boolean;
  dimensionsProvided: boolean;
  transformationsApplied: string[];
  loadTime?: number;
  quality?: number;
  suggestions: string[];
}

/**
 * Analisa uma URL de imagem e retorna um relatório diagnóstico
 * @param url URL da imagem para análise
 */
export const analyzeImageUrl = (url: string): ImageDiagnosticReport => {
  const isCloudinary = url.includes('cloudinary.com');
  const cacheEntry = imageCache.get(url);
  const report: ImageDiagnosticReport = {
    url,
    optimizedUrl: cacheEntry?.optimizedUrl,
    hasPlaceholder: !!cacheEntry?.lowQualityUrl,
    loadStatus: cacheEntry?.loadStatus,
    isCloudinary,
    dimensionsProvided: false,
    transformationsApplied: [],
    suggestions: []
  };
  
  // Analisa transformações existentes na URL
  if (isCloudinary) {
    // Verifica se tem parâmetros de qualidade
    if (url.includes('q_auto') || url.match(/q_\d+/)) {
      report.transformationsApplied.push('quality');
      
      // Extrai o valor da qualidade
      const qualityMatch = url.match(/q_(\d+)/);
      if (qualityMatch) {
        report.quality = parseInt(qualityMatch[1], 10);
      } else if (url.includes('q_auto')) {
        report.quality = -1; // Auto quality
      }
    } else {
      report.suggestions.push('Adicionar controle de qualidade (q_auto ou q_85)');
    }
    
    // Verifica se tem parâmetros de formato
    if (url.includes('f_auto')) {
      report.transformationsApplied.push('format_auto');
    } else {
      report.suggestions.push('Usar formato automático (f_auto) para menor tamanho');
    }
    
    // Verifica se tem especificação de largura
    const widthMatch = url.match(/w_(\d+)/);
    if (widthMatch) {
      report.transformationsApplied.push('width');
      report.dimensionsProvided = true;
    } else {
      report.suggestions.push('Especificar largura para evitar carregar imagens grandes desnecessariamente');
    }
    
    // Verifica se tem nitidez
    if (url.includes('e_sharpen')) {
      report.transformationsApplied.push('sharpen');
    } else {
      report.suggestions.push('Adicionar nitidez (e_sharpen:60) para melhorar a qualidade percebida');
    }
    
    // Verifica transformações de blur
    if (url.includes('e_blur')) {
      const blurMatch = url.match(/e_blur:(\d+)/);
      if (blurMatch) {
        const blurValue = parseInt(blurMatch[1], 10);
        report.transformationsApplied.push(`blur:${blurValue}`);
        
        if (blurValue > 500 && url.includes('lowquality')) {
          report.suggestions.push('Reduzir valor de blur para placeholders (recomendado: 300-500)');
        }
      }
    }
  } else {
    report.suggestions.push('Considerar migrar para Cloudinary para otimização automática');
  }
  
  // Validação do cache
  if (!report.hasPlaceholder && isCloudinary) {
    report.suggestions.push('Criar placeholder para melhorar a experiência de carregamento');
  }
  
  // Validação de status de carregamento
  if (!report.loadStatus && isCloudinary) {
    report.suggestions.push('Pré-carregar a imagem para evitar atrasos no carregamento');
  }
  
  return report;
};

/**
 * Verifica imagens renderizadas na página para detecção de problemas
 */
export const checkRenderedImages = () => {
  const imgElements = document.querySelectorAll('img');
  const results: {url: string, issues: string[]}[] = [];
  
  imgElements.forEach(img => {
    const src = img.src;
    const issues: string[] = [];
    
    // Verifica tamanho real vs definido
    if (img.naturalWidth > 0) {
      if (img.width > 0 && img.naturalWidth / img.width > 2) {
        issues.push(`Imagem muito grande (${img.naturalWidth}px) para o tamanho exibido (${img.width}px)`);
      }
    }
    
    // Verifica atributos de largura e altura
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      issues.push('Faltam atributos width/height (pode causar CLS)');
    }
    
    // Verifica atributos de carregamento 
    if (img.loading !== 'lazy' && img.loading !== 'eager') {
      issues.push('Falta atributo loading (lazy/eager)');
    }
    
    // Verifica se tem uma classe de estilo de objeto definida
    if (!img.className.includes('object-')) {
      issues.push('Falta definição de object-fit');
    }
    
    // Analisa URL para otimizações Cloudinary
    if (src.includes('cloudinary.com')) {
      const report = analyzeImageUrl(src);
      issues.push(...report.suggestions);
    }
    
    if (issues.length > 0) {
      results.push({url: src, issues});
    }
  });
  
  return results;
};

/**
 * Exporta utilitários de diagnóstico de imagem
 */
export default {
  analyzeImageUrl,
  checkRenderedImages
};
