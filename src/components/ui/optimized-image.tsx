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
 * - Usa placeholders de baixa qualidade
 * - Define dimensões explícitas para evitar CLS
 * - Otimiza formatos de imagem
 * - Suporta lazy loading
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
  
  // Otimizar URL da imagem para Cloudinary
  const optimizeCloudinaryUrl = (url: string): string => {
    if (!url.includes('cloudinary.com')) return url;
    
    // Extrair partes da URL do Cloudinary
    const baseUrlPattern = /(https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/)(.*)/;
    const match = url.match(baseUrlPattern);
    
    if (!match) return url;
    
    const [, baseUrl, pathAndOptions] = match;
    
    // Adicionar ou substituir parâmetros de otimização
    return `${baseUrl}f_auto,q_auto:${quality},w_${width}/${pathAndOptions.replace(/\.[^.]+$/, '.webp')}`;
  };
  
  const optimizedSrc = optimizeCloudinaryUrl(src);
  
  // Gerar e carregar o placeholder de baixa qualidade
  useEffect(() => {
    // Gerar LQIP apenas para imagens do Cloudinary
    if (src.includes('cloudinary.com')) {
      const lqip = getLowQualityImage(src);
      if (lqip) {
        setLowQualitySrc(lqip);
      }
    }
  }, [src]);

  // Lidar com o carregamento da imagem
  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  // Calcular a proporção para o container
  const aspectRatio = `${width}/${height}`;

  return (
    <AspectRatioContainer 
      ratio={aspectRatio} 
      className={containerClassName}
      bgColor={placeholderColor}
    >
      {lowQualitySrc && !imageLoaded && (
        <img
          src={lowQualitySrc}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-${objectFit} absolute inset-0 blur-sm transition-opacity duration-300 ${className}`}
        />
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-${objectFit} absolute inset-0 transition-opacity duration-500 ${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleImageLoad}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </AspectRatioContainer>
  );
};
