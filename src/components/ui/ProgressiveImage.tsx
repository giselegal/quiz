
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {/* Low quality placeholder */}
      {lowQualitySrc && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt={`Loading ${alt}`}
          className="w-full h-full object-cover absolute inset-0 blur-sm"
          width={width}
          height={height}
        />
      )}
      
      {/* Actual image with loading state */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
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
          <span className="text-gray-500">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
