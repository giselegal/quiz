/**
 * ImageDiagnostic.ts
 * Utilitário para diagnóstico e monitoramento de imagens no Quiz Sell Genius
 */

import { imageCache } from './images/caching';
import { analyzeImageUrl as jsAnalyzeImageUrl } from '../ImageChecker';

interface ImageDiagnosticReport {
  url: string;
  optimizedUrl?: string;
  hasPlaceholder: boolean;
  loadStatus?: 'loading' | 'loaded' | 'error';
  isCloudinary: boolean;
  dimensionsProvided: boolean;
  transformationsApplied: string[];
  loadTime?: number;
  quality?: number | string;
  format?: string;
  version?: string | null;
  width?: string | number;
  height?: string | number;
  suggestions: string[];
}

/**
 * Analisa uma URL de imagem e retorna um relatório diagnóstico
 * @param url URL da imagem para análise
 */
export const analyzeImageUrl = (url: string): ImageDiagnosticReport => {
  // Usar a função avançada de análise do ImageChecker
  const jsAnalysis = jsAnalyzeImageUrl(url);
  
  const isCloudinary = url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  const cacheEntry = imageCache.get(url);
  
  // Combinar resultados de ambas as análises
  const report: ImageDiagnosticReport = {
    url,
    optimizedUrl: cacheEntry?.optimizedUrl,
    hasPlaceholder: !!cacheEntry?.lowQualityUrl,
    loadStatus: cacheEntry?.loadStatus,
    isCloudinary,
    dimensionsProvided: jsAnalysis.width !== 'não especificado' || jsAnalysis.height !== 'não especificado',
    transformationsApplied: jsAnalysis.transformations || [],
    quality: jsAnalysis.quality,
    format: jsAnalysis.format,
    version: jsAnalysis.version,
    width: jsAnalysis.width,
    height: jsAnalysis.height,
    suggestions: [...(jsAnalysis.suggestions || [])]
  };
  
  // Verificar informações adicionais específicas do cache
  if (cacheEntry) {
    if (cacheEntry.loadTime) {
      report.loadTime = cacheEntry.loadTime;
      
      if (cacheEntry.loadTime > 1000) {
        report.suggestions.push('Imagem com tempo de carregamento alto (>1s), considerar otimização adicional');
      }
    }
    
    if (cacheEntry.sizeFactor && cacheEntry.sizeFactor > 2) {
      report.suggestions.push(`Imagem sendo servida em tamanho muito maior (${cacheEntry.sizeFactor}x) que o necessário`);
    }
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
  const results: {url: string, issues: string[], element: HTMLImageElement}[] = [];
  
  console.group('📷 Diagnóstico de Imagens Renderizadas');
  console.log(`Analisando ${imgElements.length} imagens na página atual...`);
  
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
    
    // Analisa URL para otimizações avançadas
    const report = analyzeImageUrl(src);
    if (report.suggestions.length > 0) {
      issues.push(...report.suggestions);
    }
    
    // Verifica visibilidade
    const rect = img.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible && img.loading === 'lazy') {
      issues.push('Imagem visível na abertura usando loading="lazy" - deve usar eager ou priority');
    }
    
    // Verifica se o tamanho real é muito menor que o tamanho exibido (pixelado)
    if (img.naturalWidth > 0 && img.width > 0 && img.naturalWidth / img.width < 0.5) {
      issues.push(`Imagem sendo esticada (${img.naturalWidth}px para ${img.width}px) - possível pixelação`);
    }
    
    if (issues.length > 0) {
      results.push({url: src, issues, element: img});
      
      // Adicionar borda vermelha em modo de desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        img.style.border = '2px solid red';
        img.setAttribute('title', issues.join('\n'));
      }
    }
  });
  
  if (results.length > 0) {
    console.warn(`⚠️ Encontrados ${results.length} problemas em imagens:`);
    results.forEach((result, i) => {
      console.group(`Imagem ${i+1}: ${result.url.substring(0, 50)}...`);
      console.log('Elemento:', result.element);
      console.log('Problemas:');
      result.issues.forEach(issue => console.log(`- ${issue}`));
      console.groupEnd();
    });
  } else {
    console.log('✅ Nenhum problema encontrado nas imagens renderizadas!');
  }
  
  console.groupEnd();
  return results;
};

/**
 * Gera um relatório completo de diagnóstico de imagens
 * para uma análise detalhada de desempenho de imagens no site
 */
export const generateImageReport = () => {
  const renderedImages = checkRenderedImages();
  const cachedImagesCount = Object.keys(imageCache.getAll()).length;
  const totalDownloadedBytes = Object.values(imageCache.getAll())
    .reduce((sum, entry: any) => sum + (entry.size || 0), 0);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImagesRendered: document.querySelectorAll('img').length,
      totalImagesWithIssues: renderedImages.length,
      totalImagesCached: cachedImagesCount,
      totalDownloadedBytes,
      estimatedPerformanceImpact: renderedImages.length > 5 ? 'Alto' : renderedImages.length > 0 ? 'Médio' : 'Baixo',
    },
    issuesByCategory: {
      optimization: 0,
      sizing: 0,
      format: 0,
      loading: 0,
      others: 0
    },
    detailedIssues: renderedImages
  };
  
  // Classificar problemas por categoria
  renderedImages.forEach(item => {
    item.issues.forEach(issue => {
      if (issue.includes('qualidade') || issue.includes('otimiz')) {
        report.issuesByCategory.optimization++;
      } else if (issue.includes('tamanho') || issue.includes('grande') || issue.includes('pequen')) {
        report.issuesByCategory.sizing++;
      } else if (issue.includes('formato') || issue.includes('webp') || issue.includes('avif')) {
        report.issuesByCategory.format++;
      } else if (issue.includes('carreg') || issue.includes('lazy') || issue.includes('eager')) {
        report.issuesByCategory.loading++;
      } else {
        report.issuesByCategory.others++;
      }
    });
  });
  
  console.group('📊 Relatório Completo de Diagnóstico de Imagens');
  console.log('Sumário:', report.summary);
  console.log('Problemas por categoria:', report.issuesByCategory);
  console.log('Data e hora:', report.timestamp);
  console.groupEnd();
  
  return report;
};

/**
 * Exporta utilitários de diagnóstico de imagem
 */
export default {
  analyzeImageUrl,
  checkRenderedImages,
  generateImageReport
};
