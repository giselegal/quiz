import React, { useState, useEffect } from 'react';
import { getLowQualityImage } from '@/utils/imageManager';
import { AspectRatioContainer } from './aspect-ratio-container';
// Importando o corretor de imagens embacadas direto
import '../../utils/fix-blurry-images.js';

// Declaração de tipo para o ImageFixer global
declare global {
  interface Window {
    ImageFixer?: {
      getHighQualityUrl: (url: string) => string;
      fixBlurryImage: (img: HTMLImageElement) => boolean;
      fixAllBlurryImages: () => number;
    };
  }
}

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
  style?: React.CSSProperties; // Adicionada a prop style
}

/**
 * OptimizedImage - Componente de imagem que implementa as melhores práticas para performance:
 * - Usa placeholders de alta qualidade
 * - Define dimensões explícitas para evitar CLS (Content Layout Shift)
 * - Otimiza formatos de imagem automaticamente via Cloudinary
 * - Suporta lazy loading e priority loading
 * - Adicionado melhor tratamento de erro e estados de transição
 * - Transição suave entre placeholder e imagem principal
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
  onLoad,
  style // Destruturar a prop style
}) => {
  console.log('[OptimizedImage] Props:', { src, alt, width, height, priority, quality, objectFit });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualitySrc, setLowQualitySrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [placeholderFading, setPlaceholderFading] = useState(false);

  const optimizeCloudinaryUrl = (url: string, currentQuality: number, currentWidth: number): string => {
    console.log('[OptimizedImage] optimizeCloudinaryUrl input:', url);
    if (!url || (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com'))) {
      console.log('[OptimizedImage] URL is not Cloudinary or empty, returning as is:', url);
      return url;
    }
  
    const uploadMarker = '/image/upload/';
    const parts = url.split(uploadMarker);
    if (parts.length !== 2) {
      console.warn('[OptimizedImage] URL structure unexpected (no /upload/ marker):', url);
      return url;
    }
  
    const baseUrl = parts[0] + uploadMarker;
    let pathAfterUpload = parts[1];
  
    // Regex melhorada para encontrar a versão e o public_id, ignorando TODAS as transformações
    const versionAndPublicIdPattern = /^(?:.*?\/)*?(v\d+\/)?([^/]+(?:\/[^/]+)*)$/;
    const match = pathAfterUpload.match(versionAndPublicIdPattern);
  
    if (!match) {
      console.warn('[OptimizedImage] Could not parse version and public_id:', pathAfterUpload);
      return url;
    }
  
    const version = match[1] || ''; // Inclui o 'v' e a barra se existir
    const publicId = match[2];
  
    console.log('[OptimizedImage] Parsed parts:', {
      baseUrl,
      version,
      publicId,
      originalPath: pathAfterUpload
    });
  
    // Aplicar transformações otimizadas
    const transforms = [
      'f_auto',                    // Formato automático (webp/avif)
      `q_${currentQuality}`,       // Qualidade conforme parâmetro
      `w_${currentWidth}`,         // Largura conforme parâmetro
      'dpr_auto',                  // Densidade de pixel automática
      'c_limit',                   // Limitar redimensionamento
      'e_sharpen:60'               // Nitidez moderada
    ].join(',');
  
    // Construir URL final: baseUrl + transformações + versão (se existir) + publicId
    const finalUrl = `${baseUrl}${transforms}/${version}${publicId}`;
    console.log('[OptimizedImage] Final URL:', finalUrl);
    return finalUrl;
  };

  const optimizedSrc = optimizeCloudinaryUrl(src, quality, width); // Passa quality e width
  // ... (console.logs existentes para optimizedSrc e input src podem ser mantidos ou removidos se muito verboso)

  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    setPlaceholderFading(false);

    if (src && src.includes('cloudinary.com')) {
      // Para LQIP, podemos usar uma largura menor e qualidade bem baixa
      const lqip = getLowQualityImage(src); // getLowQualityImage também precisa ser robusto
      console.log(`[OptimizedImage] Generated lowQualitySrc for ${src}:`, lqip);
      if (lqip) {
        setLowQualitySrc(lqip);
        const imgPlaceholder = new Image();
        imgPlaceholder.src = lqip;
        imgPlaceholder.decoding = "async";
      }
    } else {
      setLowQualitySrc(''); // Limpa se não for cloudinary
    }
  }, [src, width, quality]); // Adiciona width e quality como dependências se forem usados para gerar LQIP dinamicamente

  // Lidar com o carregamento da imagem
  const handleImageLoad = () => {
    // Primeiro marca o placeholder como em transição
    setPlaceholderFading(true);
    
    // Após um breve atraso, marca a imagem como carregada
    setTimeout(() => {
      setImageLoaded(true);
      if (onLoad) {
        onLoad();
      }
    }, 150); // Pequeno atraso para permitir uma transição suave
  };
  
  // Lidar com erros de carregamento
  const handleImageError = () => {
    setHasError(true);
    console.error(`Falha ao carregar imagem: ${src}`);
  };
  
  // Se width e height são strings, convert para number
  const widthNum = typeof width === 'string' ? parseInt(width, 10) : width;
  const heightNum = typeof height === 'string' ? parseInt(height, 10) : height;
  
  // Garante que widthNum e heightNum são números válidos e > 0 antes de dividir
  const numericAspectRatio = (widthNum && heightNum && widthNum > 0 && heightNum > 0) ? heightNum / widthNum : 1; // Default aspect ratio 1:1

  // Convertendo o aspectRatio numérico para string para o AspectRatioContainer
  const stringAspectRatio = String(numericAspectRatio);

  console.log('[OptimizedImage] Rendering with:', { optimizedSrc, lowQualitySrc, imageLoaded, hasError, widthNum, heightNum, stringAspectRatio });

  return (
    <AspectRatioContainer 
      ratio={stringAspectRatio} // Passando a string
      className={`${containerClassName} relative overflow-hidden`}
      bgColor={placeholderColor}
    >
      {/* Placeholder de baixa qualidade */}
      {lowQualitySrc && !imageLoaded && !hasError && (
        <img
          src={lowQualitySrc}
          alt={`${alt} placeholder`}
          width={widthNum}
          height={heightNum}
          className={`w-full h-full object-${objectFit} absolute inset-0 transition-all duration-500 ease-in-out ${className} ${placeholderFading ? 'opacity-50' : 'opacity-100'}`}
          style={style} // Aplicar style
          loading="eager"
          decoding="async"
        />
      )}
      
      {/* Imagem principal otimizada */}
      {!hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={widthNum}
          height={heightNum}
          className={`w-full h-full object-${objectFit} absolute inset-0 transition-all duration-700 ease-in-out ${className} ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
          style={style} // Aplicar style
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
        />
      )}
      
      {/* Mensagem de erro */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
          Não foi possível carregar a imagem
        </div>
      )}
    </AspectRatioContainer>
  );
};
