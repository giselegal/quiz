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

  try {
    // Divide a URL em partes
    const uploadMarker = '/image/upload/';
    const parts = url.split(uploadMarker);
    if (parts.length !== 2) {
      console.warn('[ImageManager] URL structure unexpected:', url);
      return url;
    }

    const baseUrl = parts[0] + uploadMarker;
    const pathAfterUpload = parts[1];

    // Regex melhorada para encontrar a versão e o public_id, ignorando TODAS as transformações
    const versionAndPublicIdPattern = /^(?:.*?\/)*?(v\d+\/)?([^/]+(?:\/[^/]+)*)$/;
    const match = pathAfterUpload.match(versionAndPublicIdPattern);

    if (!match) {
      console.warn('[ImageManager] Could not parse version and public_id:', pathAfterUpload);
      return url;
    }

    const version = match[1] || ''; // Inclui o 'v' e a barra se existir
    const publicId = match[2];

    // Define configurações padrão
    const {
      quality = 85,
      format = 'auto',
      width,
      height,
      crop = 'limit'
    } = settings;

    // Constrói transformações otimizadas
    const transforms = [
      `f_${format}`,            // Formato (auto por padrão)
      `q_${quality}`,           // Qualidade conforme settings
      'dpr_auto',               // Densidade de pixel automática
      crop ? `c_${crop}` : '',  // Modo de crop conforme settings
      width ? `w_${width}` : '', // Largura se especificada
      height ? `h_${height}` : '', // Altura se especificada
      'e_sharpen:60'            // Nitidez moderada
    ].filter(Boolean).join(',');

    // Construir URL final: baseUrl + transformações + versão (se existir) + publicId
    const finalUrl = `${baseUrl}${transforms}/${version}${publicId}`;
    console.log('[ImageManager] Optimized URL:', finalUrl);
    return finalUrl;

  } catch (error) {
    console.error('[ImageManager] Error optimizing URL:', error);
    return url; // Retorna URL original em caso de erro
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
