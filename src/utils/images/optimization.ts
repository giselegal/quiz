import { ImageSettings } from './types';

/**
 * Otimiza URLs do Cloudinary aplicando transformações para imagens.
 * 
 * @param url URL da imagem do Cloudinary
 * @param settings Configurações de otimização (qualidade, formato, etc)
 * @returns URL otimizada
 */
export const optimizeCloudinaryUrl = (
  url: string, 
  settings: ImageSettings = {}
): string => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;
  
  // Define configurações padrão
  const {
    quality = 85,
    format = 'auto',
    width,
    height,
    crop = 'limit',
    removeParams = [] // Parâmetros para remover
  } = settings;
  
  // Detecta se a URL já tem transformações
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  let baseUrlParts = parts;
  let secondPart = baseUrlParts[1];
  
  // Remove parâmetros problemáticos se especificados
  if (removeParams.length > 0) {
    // Verifica se a URL tem versão (v12345)
    const versionMatch = secondPart.match(/^(v\d+)\//);
    let version = '';
    let finalPath = secondPart;

    if (versionMatch) {
      version = versionMatch[1] + '/';
      finalPath = secondPart.substring(version.length);
    }

    // Remove parâmetros específicos de transformação
    let transformParts = finalPath.split('/')[0].split(',');
    transformParts = transformParts.filter(part => {
      // Manter o parâmetro se não estiver na lista de remoção
      return !removeParams.some(param => part.startsWith(param));
    });

    // Remonta a URL sem os parâmetros removidos
    if (finalPath.includes('/')) {
      const rest = finalPath.split('/').slice(1).join('/');
      finalPath = transformParts.join(',') + '/' + rest;
    } else {
      finalPath = transformParts.join(',');
    }

    // Atualiza a segunda parte da URL com versão (se existir) e caminho processado
    secondPart = version + finalPath;
    baseUrlParts[1] = secondPart;
  }
  const hasTransformations = secondPart.includes('/') && 
                            !/v\d+\//.test(secondPart.split('/')[0]); // Distingue transforms de version strings
  
  // Constrói a string de transformação
  let transformations = `f_${format === 'auto' ? 'auto' : format},q_${quality}`;
  
  // Adiciona crop mode se especificado
  if (crop) {
    transformations += `,c_${crop}`;
  }
  
  // Adiciona dimensões se especificadas
  if (width) {
    transformations += `,w_${width}`;
  } else if (settings.width) {
    transformations += `,w_${settings.width}`;
  }
  
  if (height) {
    transformations += `,h_${height}`;
  } else if (settings.height) {
    transformations += `,h_${settings.height}`;
  }
  
  // Adiciona nitidez para melhorar a qualidade visual
  transformations += ',e_sharpen:60';
  
  // Aplica transformações à URL com tratamento adequado para versões
  if (hasTransformations) {
    // URL já tem transformações, substitui-as
    return `${baseUrlParts[0]}/upload/${transformations}/${parts.slice(1).join('/')}`;
  } else {
    // Verifica se a URL tem formato de versão (v12345)
    const versionMatch = secondPart.match(/^(v\d+)\//);
    if (versionMatch) {
      const version = versionMatch[1];
      const rest = secondPart.substring(version.length + 1);
      // Preserva a versão na URL
      return `${baseUrlParts[0]}/upload/${version}/${transformations}/${rest}`;
    }
    // URL sem versão e sem transformações
    return `${baseUrlParts[0]}/upload/${transformations}/${secondPart}`;
  }
};

/**
 * Gera uma URL de placeholder de baixa qualidade para imagens do Cloudinary
 * Versão aprimorada para melhor qualidade visual dos placeholders
 * 
 * @param url URL original da imagem
 * @param options Opções de largura e qualidade do placeholder
 */
export const getLowQualityPlaceholder = (url: string, options: { width?: number, quality?: number } = {}): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Melhorou a qualidade dos placeholders para evitar embaçamento excessivo
  const { width = 80, quality = 50 } = options;
  
  // Extrai partes base da URL
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  // Extrai versão e nome do arquivo de forma mais precisa
  const pathParts = baseUrlParts[1].split('/');
  const hasVersioning = pathParts[0].match(/^v\d+$/);
  
  // Se tem versionamento, precisamos preservá-lo
  if (hasVersioning && pathParts.length > 1) {
    const version = pathParts[0];
    const fileName = pathParts.slice(1).join('/');
    // Usa um efeito de blur muito mais leve (300) para reduzir embaçamento
    return `${baseUrlParts[0]}/upload/${version}/f_auto,q_${quality},w_${width},e_blur:300/${fileName}`;
  }
  
  // Sem versionamento, usa apenas o nome do arquivo
  const fileName = pathParts.join('/');
  
  // Usa um efeito de blur muito mais leve para reduzir o embaçamento
  return `${baseUrlParts[0]}/upload/f_auto,q_${quality},w_${width},e_blur:300/${fileName}`;
};

/**
 * Obtém uma URL de imagem otimizada com dimensões explícitas
 * 
 * @param url URL original da imagem
 * @param options Opções de largura, altura e qualidade
 */
export const getOptimizedImageUrl = (
  url: string, 
  options: { width?: number, height?: number, quality?: number } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Extrai partes base da URL
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;
  
  const { width = 800, height, quality = 80 } = options;
  
  // Constrói string de transformação
  let transformations = `f_auto,q_${quality},w_${width}`;
  if (height) {
    transformations += `,h_${height}`;
  }
  
  // Extrai componentes do caminho
  const pathParts = baseUrlParts[1].split('/');
  const fileName = pathParts[pathParts.length - 1];
  
  // Retorna URL construída
  return `${baseUrlParts[0]}/upload/${transformations}/${fileName}`;
};

/**
 * Otimiza uma imagem com configurações específicas
 * 
 * @param url URL da imagem
 * @param settings Configurações de otimização
 */
export const getOptimizedImage = (
  url: string,
  settings?: ImageSettings
): string => {
  if (!url) return '';
  return optimizeCloudinaryUrl(url, settings);
};

/**
 * Gera URLs para imagens responsivas (diferentRes tamanhos de tela)
 * 
 * @param url URL base da imagem
 * @param widths Array de larguras para diferentes breakpoints
 * @param options Opções adicionais
 */
export const getResponsiveImageSources = (
  url: string,
  widths: number[] = [640, 768, 1024, 1280],
  options: { quality?: number } = {}
): string[] => {
  if (!url || !url.includes('cloudinary.com')) return [url];
  
  const { quality = 80 } = options;
  
  return widths.map(width => getOptimizedImageUrl(url, { width, quality }));
};
