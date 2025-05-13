import React, { useState, useEffect, useRef } from 'react';
import { useIntersection } from '@uidotdev/usehooks';
import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  className?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
  unoptimized?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoadingComplete?: (image: HTMLImageElement) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  sizes?: string;
}

const OptimizedImageV2: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  loading = 'lazy',
  style,
  className,
  objectFit = 'cover',
  objectPosition = 'center',
  unoptimized = false,
  placeholder = 'empty',
  blurDataURL,
  onLoadingComplete,
  onLoad,
  onError,
  sizes,
  ...props
}) => {
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useIntersection(imageRef, (entry) => {
    if (entry.isIntersecting) {
      setIsIntersecting(true);
    }
  });

  useEffect(() => {
    if (priority) {
      setIsIntersecting(true);
    }
  }, [priority]);

  const imageProps = {
    src,
    alt,
    width: width,
    height: height,
    quality: quality,
    priority: priority,
    loading: loading,
    style: style,
    className: className,
    objectFit: objectFit,
    objectPosition: objectPosition,
    unoptimized: unoptimized,
    placeholder: placeholder === 'blur' ? 'blur' : undefined,
    blurDataURL: blurDataURL,
    onLoadingComplete: onLoadingComplete,
    onLoad: onLoad,
    onError: onError,
    sizes: sizes,
    ...props,
  };

  if (width && height) {
    return isIntersecting ? (
      <img
        {...imageProps}
        width={String(width)}
        height={String(height)}
        ref={imageRef}
        loading="lazy"
      />
    ) : (
      <div style={{ width: width, height: height, position: 'relative', ...style }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f2f2f2', // Cor de fundo placeholder
          }}
        />
      </div>
    );
  }

  return isIntersecting ? (
    <img
      {...imageProps}
      ref={imageRef}
      loading="lazy"
    />
  ) : (
    <div style={{ position: 'relative', ...style }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#f2f2f2', // Cor de fundo placeholder
        }}
      />
    </div>
  );
};

export default OptimizedImageV2;
