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
  onLoad
}) => {
  console.log('[OptimizedImage] Props:', { src, alt, width, height, priority, quality, objectFit });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualitySrc, setLowQualitySrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [placeholderFading, setPlaceholderFading] = useState(false);
  
  /**
   * Otimiza URLs do Cloudinary aplicando transformações para melhor qualidade e performance.
   * Detecta se a URL já tem transformações para não aplicar duplicadamente.
   */
  const optimizeCloudinaryUrl = (url: string): string => {
    console.log('[OptimizedImage] Original src for optimization:', url);
    if (!url.includes('cloudinary.com')) {
        console.log('[OptimizedImage] URL is not Cloudinary, returning as is:', url);
        return url;
    }

    const uploadMarker = '/image/upload/';
    const parts = url.split(uploadMarker);
    if (parts.length !== 2) {
        console.warn('[OptimizedImage] URL structure unexpected (no /image/upload/ marker):', url);
        return url;
    }

    const baseUrl = parts[0] + uploadMarker;
    const pathAfterUpload = parts[1];
    // console.log('[OptimizedImage] Base URL:', baseUrl, 'Path after upload:', pathAfterUpload);

    let version = '';
    let publicId = '';

    // Regex para extrair a versão (opcional, ex: "v123/") e o public_id,
    // ignorando quaisquer transformações ("pastas") que venham antes da versão ou do public_id.
    const pathPattern = /^(?:[^/]+\/)*(v\d+\/)?(.+)$/;
    const pathMatch = pathAfterUpload.match(pathPattern);

    if (pathMatch) {
        // pathMatch[1] é o grupo da versão (ex: "v123/") ou undefined se não houver versão.
        // pathMatch[2] é o grupo do public_id (ex: "imagem.jpg" ou "pasta/imagem.jpg").
        if (pathMatch[1]) {
            version = pathMatch[1]; // Captura a versão, que já inclui a barra no final.
        }
        publicId = pathMatch[2];
    } else {
        // Fallback: se a regex não casar (improvável para URLs Cloudinary válidas mas possível para estruturas muito simples),
        // assume que todo o pathAfterUpload é o public_id.
        publicId = pathAfterUpload;
        console.warn('[OptimizedImage] Regex did not match path, assuming entire path is publicId:', pathAfterUpload);
    }
    
    // console.log('[OptimizedImage] Parsed URL parts - Version:', version, 'PublicID:', publicId);

    // Novas transformações a serem aplicadas.
    // A prop 'quality' é um número, então `q_auto:${quality}` é usado para qualidade adaptativa com base nesse número.
    // `w_${width}` define a largura exata.
    const newTransforms = [
        'f_auto',             // Formato automático (webp/avif para navegadores compatíveis)
        `q_auto:${quality}`,  // Qualidade adaptativa (ex: q_auto:80 se quality for 80)
        `w_${width}`,         // Largura exata baseada na prop width
        'dpr_auto',           // Densidade de pixel adaptativa (para retina displays)
        'c_limit',            // Modo de corte: redimensiona para caber, preservando proporção, sem aumentar se for menor.
        'e_sharpen:60'        // Leve nitidez para melhorar a qualidade percebida
    ].join(',');
    // console.log('[OptimizedImage] New transforms to apply:', newTransforms);

    // Montar a URL final: baseUrl + newTransforms + / + version (se existir) + publicId
    // A barra entre newTransforms e version/publicId é adicionada explicitamente.
    // A 'version', se existir, já contém uma barra no final (ex: "v123/").
    let finalUrl = `${baseUrl}${newTransforms}/`;
    if (version) {
        finalUrl += version;
    }
    finalUrl += publicId;

    console.log('[OptimizedImage] Resulting optimizedSrc:', finalUrl);
    return finalUrl;
  };

  const optimizedSrc = optimizeCloudinaryUrl(src);
  console.log('[OptimizedImage] Input src:', src);
  console.log('[OptimizedImage] Generated optimizedSrc:', optimizedSrc);
  
  // Gerar e carregar o placeholder de baixa qualidade
  useEffect(() => {
    // Resetar estados quando a fonte muda
    setImageLoaded(false);
    setHasError(false);
    setPlaceholderFading(false);
    
    // Gerar LQIP apenas para imagens do Cloudinary
    if (src.includes('cloudinary.com')) {
      const lqip = getLowQualityImage(src);
      console.log(`[OptimizedImage] Generated lowQualitySrc for ${src}:`, lqip);
      if (lqip) {
        setLowQualitySrc(lqip);
        
        // Pré-carregar a imagem de baixa qualidade
        const imgPlaceholder = new Image();
        imgPlaceholder.src = lqip;
        imgPlaceholder.decoding = "async";
      }
    }
  }, [src]);

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
  
  // Calcular a proporção de aspecto para o container
  const aspectRatio = heightNum / widthNum; // Correção aqui
  
  console.log('[OptimizedImage] Rendering with:', { optimizedSrc, lowQualitySrc, imageLoaded, hasError, widthNum, heightNum, aspectRatio });

  return (
    <AspectRatioContainer 
      ratio={aspectRatio} 
      className={`${containerClassName} relative overflow-hidden`}
      bgColor={placeholderColor}
    >
      {/* Placeholder de baixa qualidade - visível enquanto a imagem principal carrega */}
      {lowQualitySrc && !imageLoaded && !hasError && (
        <img
          src={lowQualitySrc}
          alt={alt}
          width={widthNum}
          height={heightNum}
          className={`w-full h-full object-${objectFit} absolute inset-0 transition-all duration-500 ease-in-out ${className} ${placeholderFading ? 'opacity-50' : 'opacity-100'}`}
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
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
        />
      )}
      
      {/* Mensagem de erro caso o carregamento falhe */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
          Não foi possível carregar a imagem
        </div>
      )}
    </AspectRatioContainer>
  );
};
