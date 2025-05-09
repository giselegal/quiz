
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string; 
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  onLoad?: () => void;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  lowQualitySrc,
  alt,
  className,
  style,
  width,
  height,
  priority = false,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
    
    // Check if image is already in browser cache
    if (imageRef.current?.complete) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [src, onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
    
    // Log performance metrics
    if (priority) {
      console.log(`Priority image loaded: ${src}`);
      
      // Report to performance observer if available
      if ('performance' in window && 'measure' in performance) {
        try {
          performance.mark(`img-loaded-${src.substring(0, 20)}`);
        } catch (e) {
          // Ignore errors with performance marking
        }
      }
    }
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {/* Low quality placeholder - only show when high quality isn't loaded */}
      {lowQualitySrc && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt={`Carregando ${alt}`}
          className="w-full h-full object-cover absolute inset-0 blur-sm"
          width={width}
          height={height}
        />
      )}
      
      {/* Actual image with loading state */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">Imagem indisponível</span>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
