import React, { useState, useEffect } from 'react';
import { getLowQualityImage } from '@/utils/imageManager';
import { AspectRatioContainer } from './aspect-ratio-container';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  placeholderColor?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

/**
 * OptimizedImage - Componente de imagem que implementa as melhores práticas para performance:
 * - Usa placeholders de alta qualidade
 * - Define dimensões explícitas para evitar CLS (Content Layout Shift)
 * - Otimiza formatos de imagem automaticamente via Cloudinary
 * - Suporta lazy loading e priority loading
 * - Adicionado melhor tratamento de erro e estados de transição
 * - Transição suave entre placeholder e imagem principal
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  priority = false,
  quality = 80,
  placeholderColor = '#f5f5f5',
  objectFit = 'cover',
  onLoad
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualitySrc, setLowQualitySrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [placeholderFading, setPlaceholderFading] = useState(false);
  
  /**
   * Otimiza URLs do Cloudinary aplicando transformações para melhor qualidade e performance.
   * Detecta se a URL já tem transformações para não aplicar duplicadamente.
   */
  const optimizeCloudinaryUrl = (url: string): string => {
    if (!url.includes('cloudinary.com')) return url;
    
    // Extrair partes da URL do Cloudinary
    const baseUrlPattern = /(https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/)(.*)/;
    const match = url.match(baseUrlPattern);
    
    if (!match) return url;
    
    const [, baseUrl, pathAndQuery] = match;
    
    // Verificar se a URL já contém parâmetros de otimização
    const hasExistingParams = /f_auto|q_auto|w_\d+|dpr_auto/.test(pathAndQuery);
    
    // Se já tiver parâmetros, apenas devolver a URL original
    if (hasExistingParams) return url;
    
    // Transformações avançadas para melhorar a performance e qualidade
    const transforms = [
      'f_auto',              // formato automático (webp/avif para navegadores compatíveis)
      `q_auto:${quality}`,   // qualidade adaptativa com base no parâmetro quality
      `w_${width}`,          // largura exata
      'dpr_auto',            // densidade de pixel adaptativa (para retina displays)
      'c_limit',             // modo de corte limitado para preservar proporção
      'e_sharpen:60'         // leve nitidez para melhorar a qualidade percebida
    ].join(',');
    
    // Verifica se a URL tem formato de versão (v12345)
    const versionMatch = pathAndQuery.match(/^(v\d+)\//);
    if (versionMatch) {
      const version = versionMatch[1];
      const rest = pathAndQuery.substring(version.length + 1);
      // Preserva a versão na URL
      return `${baseUrl}${version}/${transforms}/${rest}`;
    }
    
    // URL normal sem versão
    return `${baseUrl}${transforms}/${pathAndQuery}`;
  };
  
  const optimizedSrc = optimizeCloudinaryUrl(src);
  
  // Gerar e carregar o placeholder de baixa qualidade
  useEffect(() => {
    // Resetar estados quando a fonte muda
    setImageLoaded(false);
    setHasError(false);
    setPlaceholderFading(false);
    
    // Gerar LQIP apenas para imagens do Cloudinary
    if (src.includes('cloudinary.com')) {
      const lqip = getLowQualityImage(src);
      if (lqip) {
        setLowQualitySrc(lqip);
        
        // Pré-carregar a imagem de baixa qualidade
        const imgPlaceholder = new Image();
        imgPlaceholder.src = lqip;
        imgPlaceholder.decoding = "async";
      }
    }
  }, [src]);

  // Lidar com o carregamento da imagem
  const handleImageLoad = () => {
    // Primeiro marca o placeholder como em transição
    setPlaceholderFading(true);
    
    // Após um breve atraso, marca a imagem como carregada
    setTimeout(() => {
      setImageLoaded(true);
      if (onLoad) {
        onLoad();
      }
    }, 150); // Pequeno atraso para permitir uma transição suave
  };
  
  // Lidar com erros de carregamento
  const handleImageError = () => {
    setHasError(true);
    console.error(`Falha ao carregar imagem: ${src}`);
  };
  
  // Calcular a proporção de aspecto para o container
  const aspectRatio = height / width;
  
  // Convert width and height to string for img element
  const widthStr = String(width);
  const heightStr = String(height);
  
  return (
    <AspectRatioContainer 
      ratio={aspectRatio} 
      className={`${containerClassName} relative overflow-hidden`}
      bgColor={placeholderColor}
    >
      {/* Placeholder de baixa qualidade - visível enquanto a imagem principal carrega */}
      {lowQualitySrc && !imageLoaded && !hasError && (
        <img
          src={lowQualitySrc}
          alt={alt}
          width={widthStr}
          height={heightStr}
          className={`w-full h-full object-${objectFit} absolute inset-0 transition-all duration-500 ease-in-out ${className} ${placeholderFading ? 'opacity-50' : 'opacity-100'}`}
          loading="eager"
          decoding="async"
        />
      )}
      
      {/* Imagem principal otimizada */}
      {!hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={widthStr}
          height={heightStr}
          className={`w-full h-full object-${objectFit} absolute inset-0 transition-all duration-700 ease-in-out ${className} ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
        />
      )}
      
      {/* Mensagem de erro caso o carregamento falhe */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
          Não foi possível carregar a imagem
        </div>
      )}
    </AspectRatioContainer>
  );
};
