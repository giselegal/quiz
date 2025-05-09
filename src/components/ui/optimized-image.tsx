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
    if (!url.includes('cloudinary.com')) {
        // Adicionado log para URLs não Cloudinary
        console.log('[OptimizedImage] URL is not Cloudinary, returning as is:', url);
        return url;
    }

    // Regex para capturar a base da URL, transformações existentes (opcional e não capturado para uso),
    // versão (opcional) e o public_id (caminho do arquivo)
    const cloudinaryPattern = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:[^/]+?\/)?(?:(v\d+)\/)?(.+)$/;
    const match = url.match(cloudinaryPattern);

    if (!match) {
        console.warn('[OptimizedImage] URL looks like Cloudinary but does not match expected pattern:', url);
        return url; // Retorna a URL original se não corresponder ao padrão
    }

    const [, cloudUrlBase, existingVersionPath, publicIdFilePath] = match;
    // existingTransformationsPath (o segundo grupo de captura (?:[^/]+?\/)?) é ignorado intencionalmente.

    // Logs para depuração da análise da URL
    // console.log('[OptimizedImage] Parsing URL for optimization:', url);
    // console.log('[OptimizedImage] Parsed components:', { cloudUrlBase, existingVersionPath, publicIdFilePath });

    const newTransforms = [
      'f_auto',        // Formato automático
      `q_${quality}`,  // Qualidade baseada na prop (ex: q_80)
      `w_${width}`,    // Largura baseada na prop
      'dpr_auto',      // Densidade de pixel automática
      'c_limit',       // Modo de corte: redimensiona a imagem para caber nas dimensões sem cortar.
      'e_sharpen:60'   // Aplica um leve efeito de nitidez
    ].join(',');

    let finalOptimizedUrl = cloudUrlBase;
    finalOptimizedUrl += newTransforms + '/';

    if (existingVersionPath) {
      finalOptimizedUrl += existingVersionPath + '/'; // Adiciona a versão se existir
    }

    finalOptimizedUrl += publicIdFilePath; // Adiciona o caminho público do arquivo

    // Logs para depuração da URL gerada
    // console.log('[OptimizedImage] Original src for optimization:', url);
    // console.log('[OptimizedImage] Applied new transforms:', newTransforms);
    // console.log('[OptimizedImage] Resulting optimizedSrc:', finalOptimizedUrl);

    return finalOptimizedUrl;
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
