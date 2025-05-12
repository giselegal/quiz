import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CrispIntroImageProps {
  src?: string;
  srcSetAvif?: string;
  srcSetWebp?: string;
  srcPng?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
}

/**
 * Componente otimizado para imagens da introdução do quiz
 * Foca especificamente em resolver problemas de embaçamento e melhorar o LCP
 */
const CrispIntroImage: React.FC<CrispIntroImageProps> = ({
  src,
  srcSetAvif,
  srcSetWebp,
  srcPng,
  alt,
  width = 345,
  height = 360,
  className,
  priority = true,
  onLoad,
  sizes = "(max-width: 640px) 345px, (max-width: 768px) 400px, 450px",
  loading = 'eager',
  fetchPriority = 'high',
  decoding = 'sync'
}) => {
  // Determinar a URL da imagem principal
  const sourceUrl = srcPng || src;
  
  // Processar a URL para garantir imagens de alta qualidade
  const optimizedSrc = React.useMemo(() => {
    if (!sourceUrl || !sourceUrl.includes('cloudinary.com')) return sourceUrl;
    
    // Extrair a URL base e o caminho
    const urlParts = sourceUrl.split('/upload/');
    if (urlParts.length !== 2) return sourceUrl;
    
    const baseUrl = urlParts[0];
    const pathPart = urlParts[1];
    
    // Remover parâmetros de blur e melhorar qualidade (reduzida para melhor performance)
    let cleanedPath = pathPart
      .replace(/,e_blur:[0-9]+/g, '')
      .replace(/e_blur:[0-9]+,/g, '')
      .replace(/e_blur:[0-9]+/g, '')
      .replace(/q_[0-9]+/g, 'q_70');
    
    // Garantir parâmetros de qualidade média-alta para balancear desempenho e qualidade
    return `${baseUrl}/upload/f_auto,q_70,dpr_1.0,e_sharpen:40/${cleanedPath}`;
  }, [sourceUrl]);
  
  // Preload da imagem de forma mais eficiente para o LCP
  useEffect(() => {
    if (priority && optimizedSrc) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = optimizedSrc;
      preloadLink.setAttribute('fetchpriority', 'high');
      document.head.appendChild(preloadLink);
      
      return () => {
        if (preloadLink.parentNode) {
          preloadLink.parentNode.removeChild(preloadLink);
        }
      };
    }
  }, [optimizedSrc, priority]);
  
  // Estilos otimizados para evitar blur e melhorar o LCP
  const imageStyles = {
    imageRendering: 'crisp-edges',
    objectFit: 'contain',
    aspectRatio: `${width}/${height}`,
    display: 'block',
    margin: '0 auto',
    filter: 'none',
    transform: 'none',
    transition: 'none'
  } as React.CSSProperties;
  
  // Se temos srcSets para AVIF ou WebP, usamos a tag picture
  if (srcSetAvif || srcSetWebp) {
    return (
      <picture>
        {srcSetAvif && (
          <source 
            srcSet={srcSetAvif}
            type="image/avif" 
            sizes={sizes}
          />
        )}
        {srcSetWebp && (
          <source 
            srcSet={srcSetWebp}
            type="image/webp" 
            sizes={sizes}
          />
        )}
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "w-full h-auto object-contain quiz-intro-image",
            className
          )}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          onLoad={onLoad}
          style={imageStyles}
          sizes={sizes}
        />
      </picture>
    );
  }
  
  // Se não temos srcSets, usamos a tag img diretamente
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "w-full h-auto object-contain quiz-intro-image",
        className
      )}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      onLoad={onLoad}
      style={imageStyles}
      sizes={sizes}
    />
  );
};

export default CrispIntroImage;
