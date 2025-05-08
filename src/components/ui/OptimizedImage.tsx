
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
}

/**
 * Componente de imagem otimizado que implementa:
 * - Lazy loading
 * - Carregamento prioritário opcional
 * - Fallback para imagens que falham
 * - Estado de carregamento com placeholder
 * - Otimização automática de URLs do Cloudinary
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
  
  // Otimizar URLs do Cloudinary automaticamente
  const optimizedSrc = src.includes('cloudinary.com') && !src.includes('q_') 
    ? src.replace('/upload/', '/upload/q_95,f_auto/')
    : src;
  
  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);
    
    if (priority) {
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => {
        setLoaded(true);
        onLoad?.();
      };
      img.onerror = () => setError(true);
    }
  }, [optimizedSrc, priority, onLoad]);
  
  return (
    <div 
      className={cn(
        "relative inline-block",
        className
      )} 
      style={{
        width: width || 'auto',
        height: height || 'auto'
      }}
    >
      {!loaded && !error && !priority && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
      
      <img 
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
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
