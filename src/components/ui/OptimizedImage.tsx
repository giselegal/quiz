
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  style?: React.CSSProperties;
}

/**
 * Componente de imagem otimizado que implementa:
 * - Lazy loading
 * - Carregamento prioritário opcional
 * - Fallback para imagens que falham
 * - Estado de carregamento com placeholder
 * - Otimização automática de URLs do Cloudinary
 * - Carregamento progressivo com efeito blur
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onLoad,
  objectFit = 'cover',
  style
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [blurredLoaded, setBlurredLoaded] = useState(false);

  // Generate placeholders and optimized URLs only once
  const placeholderSrc = React.useMemo(() => {
    if (!src || !src.includes('cloudinary.com')) return '';
    
    // Extract base URL parts
    const baseUrlParts = src.split('/upload/');
    if (baseUrlParts.length !== 2) return '';
    
    // Create low quality placeholder
    return `${baseUrlParts[0]}/upload/w_40,q_35,e_blur:800/f_auto/${baseUrlParts[1]}`;
  }, [src]);

  // Otimizar URLs do Cloudinary automaticamente
  const optimizedSrc = React.useMemo(() => {
    if (!src || !src.includes('cloudinary.com')) return src;
    
    // Extract base URL parts
    const baseUrlParts = src.split('/upload/');
    if (baseUrlParts.length !== 2) return src;
    
    // Add optimization parameters
    let params = 'f_auto,q_auto:good';
    
    if (width) {
      params += `,w_${width}`;
    }
    
    if (height) {
      params += `,h_${height}`;
    }
    
    params += ',dpr_auto,e_sharpen:30';
    
    return `${baseUrlParts[0]}/upload/${params}/${baseUrlParts[1]}`;
  }, [src, width, height]);

  // For priority images, preload them
  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setBlurredLoaded(false);
    setError(false);
    
    if (src && priority) {
      // Load the image
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => {
        setLoaded(true);
        if (onLoad) onLoad();
      };
      img.onerror = () => setError(true);

      // Always load the blurred version for smoother transitions
      if (placeholderSrc) {
        const blurImg = new Image();
        blurImg.src = placeholderSrc;
        blurImg.onload = () => setBlurredLoaded(true);
      }
    }
  }, [optimizedSrc, placeholderSrc, priority, src, onLoad]);
  
  return (
    <div 
      className="relative"
      style={{
        width: style?.width || '100%',
        height: style?.height || (height ? `${height}px` : 'auto'),
        ...style
      }} 
    >
      {!loaded && !error && (
        <>
          {/* Low quality placeholder image */}
          {blurredLoaded && placeholderSrc && (
            <img 
              src={placeholderSrc} 
              alt="" 
              width={width} 
              height={height} 
              className={cn(
                "absolute inset-0 w-full h-full",
                objectFit === 'cover' && "object-cover",
                objectFit === 'contain' && "object-contain",
                objectFit === 'fill' && "object-fill",
                objectFit === 'none' && "object-none",
                objectFit === 'scale-down' && "object-scale-down",
                "blur-xl scale-110" // Blur effect for placeholders
              )}
              aria-hidden="true"
            />
          )}
          
          {/* Shimmer loading effect */}
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
        </>
      )}
      
      <img 
        src={optimizedSrc} 
        alt={alt}
        width={width} 
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => {
          setLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          !loaded && "opacity-0",
          loaded && "opacity-100",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
          className
        )}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-sm text-gray-500">Imagem não disponível</span>
        </div>
      )}
    </div>
  );
}
