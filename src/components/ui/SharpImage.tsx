
import React, { useState, useEffect } from 'react';

interface SharpImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * SharpImage - Componente básico para exibição de imagens que
 * implementa boas práticas sem efeitos avançados
 */
export const SharpImage: React.FC<SharpImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);

    if (src && priority) {
      // Preload high priority images
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoaded(true);
        if (onLoad) onLoad();
      };
      img.onerror = () => setError(true);
    }
  }, [src, priority, onLoad]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default SharpImage;
