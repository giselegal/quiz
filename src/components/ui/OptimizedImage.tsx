
import React from 'react';
import { cn } from '@/lib/utils';
import { isImagePreloaded, optimizeImageUrl } from '@/utils/preloadUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  width?: number | string; 
  height?: number | string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  style,
  sizes,
  priority = false,
  onLoad,
  onError,
  width,
  height
}) => {
  // Converter width e height para string, se forem números
  const widthStr = width !== undefined ? String(width) : undefined;
  const heightStr = height !== undefined ? String(height) : undefined;
  
  const isPreloaded = isImagePreloaded(src);
  
  // Se a imagem já foi pré-carregada, podemos renderizá-la diretamente
  // sem precisar de estado de loading
  const [loaded, setLoaded] = React.useState(isPreloaded);

  // Para imagens não pré-carregadas, rastreamos o carregamento
  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    onError?.();
  };

  // Otimizar a URL da imagem se necessário
  const optimizedSrc = optimizeImageUrl(src, {
    quality: priority ? 95 : 85
  });
  
  return (
    <>
      {!loaded && (
        <div 
          className={cn(
            "flex items-center justify-center bg-gray-100",
            className
          )}
          style={style}
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          className,
          !loaded && "hidden"
        )}
        style={style}
        sizes={sizes}
        width={widthStr}
        height={heightStr}
      />
    </>
  );
};

export default OptimizedImage;
