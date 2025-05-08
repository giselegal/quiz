import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { optimizeCloudinaryUrl, getResponsiveImageUrl, getLowQualityPlaceholder, isImagePreloaded } from '@/utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
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
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [blurredLoaded, setBlurredLoaded] = useState(false);
  
  // Generate placeholders and optimized URLs only once
  const placeholderSrc = React.useMemo(
    () => src ? getLowQualityPlaceholder(src) : '', 
    [src]
  );
  
  // Otimizar URLs do Cloudinary automaticamente
  const optimizedSrc = React.useMemo(
    () => optimizeCloudinaryUrl(src, { 
      quality: 95, 
      format: 'auto',
      width: width || undefined,
      height: height || undefined
    }),
    [src, width, height]
  );
  
  // Get responsive image attributes if needed
  const responsiveImageProps = React.useMemo(
    () => width && width > 300 ? getResponsiveImageUrl(src) : { srcSet: '', sizes: '' },
    [src, width]
  );
  
  // For priority images, we check if they're already preloaded and update state accordingly
  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setBlurredLoaded(false);
    setError(false);
    
    if (src && priority) {
      if (isImagePreloaded(src)) {
        // If already preloaded, mark as loaded
        setLoaded(true);
        onLoad?.();
      } else {
        // Otherwise load it now
        const img = new Image();
        img.src = optimizedSrc;
        img.onload = () => {
          setLoaded(true);
          onLoad?.();
        };
        img.onerror = () => setError(true);
      }
      
      // Always load the blurred version for smoother transitions
      const blurImg = new Image();
      blurImg.src = placeholderSrc;
      blurImg.onload = () => setBlurredLoaded(true);
    }
  }, [optimizedSrc, placeholderSrc, priority, src, onLoad]);
  
  return (
    <div 
      className={cn(
        "relative inline-block overflow-hidden",
        className
      )} 
      style={{
        width: width || 'auto',
        height: height || 'auto'
      }}
    >
      {!loaded && !error && (
        <>
          {/* Low quality placeholder image */}
          {blurredLoaded && (
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
        srcSet={responsiveImageProps.srcSet || undefined}
        sizes={responsiveImageProps.sizes || undefined}
        className={cn(
          "max-w-full h-auto",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
          !loaded && "opacity-0",
          loaded && "opacity-100 transition-opacity duration-300"
        )}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-sm text-gray-500">Imagem não disponível</span>
        </div>
      )}
    </div>
  );
}
