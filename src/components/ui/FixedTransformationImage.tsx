/**
 * FixedTransformationImage - Componente otimizado para imagens de transformação
 * 
 * Este componente foi criado para resolver o problema de imagens embaçadas
 * nas transformações de antes e depois. Usa a mesma tecnologia do FixedIntroImage
 * mas com configurações específicas para imagens de transformação.
 */
import React, { useState } from 'react';

interface FixedTransformationImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * Transforma qualquer URL do Cloudinary em uma versão de alta qualidade
 */
function getHighQualityUrl(url: string): string {
  if (!url) return url;
  
  // Se não for Cloudinary, retornar sem alterações
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // Dividir a URL para trabalhar com ela
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  const baseUrl = parts[0] + '/upload/';
  let pathAndQuery = parts[1];
  
  // Remover qualquer parâmetro de blur existente
  pathAndQuery = pathAndQuery.replace(/[,/]e_blur:[0-9]+/g, '');
  
  // Detectar versão na URL (v12345678)
  const versionMatch = pathAndQuery.match(/^(v\d+)\//);
  let version = '';
  let finalPath = pathAndQuery;
  
  if (versionMatch) {
    version = versionMatch[1] + '/';
    finalPath = pathAndQuery.substring(version.length);
  }
  
  // Parâmetros de alta qualidade específicos para transformações
  const transforms = [
    'f_auto',         // Formato automático (webp/avif)
    'q_90',           // Qualidade alta (90%)
    'dpr_auto',       // Densidade de pixel automática
    'e_sharpen:50'    // Nitidez para melhorar qualidade visual
  ].join(',');
  
  // Montar URL final com alta qualidade
  return `${baseUrl}${version}${transforms}/${finalPath}`;
}

/**
 * Componente de imagem de alta qualidade para transformações
 */
const FixedTransformationImage: React.FC<FixedTransformationImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  priority = true,
  onLoad
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(getHighQualityUrl(src));
  
  // Fallback para quando a imagem falha
  const handleImageError = () => {
    if (imgSrc === src) {
      // Se já estamos usando a URL original, não há mais o que tentar
      setHasError(true);
      console.error(`Falha ao carregar imagem após tentativas: ${src}`);
      // Chamar onLoad mesmo em caso de erro para não bloquear a UI
      if (onLoad) {
        onLoad();
      }
      return;
    }
    
    // Se a URL otimizada falhou, tentar a URL original
    console.warn(`Falha ao carregar imagem otimizada, tentando URL original: ${src}`);
    setImgSrc(src);
  };
  
  // Calcular a proporção para o estilo
  const aspectRatio = height / width;
  const paddingBottom = `${aspectRatio * 100}%`;
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ paddingBottom }}
    >
      {hasError ? (
        // Estado de erro - mostrar placeholder ou mensagem
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Imagem não disponível</p>
          </div>
        </div>
      ) : (
        // Imagem normal
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          data-fallback-src={src} // Armazenar URL original para uso pelo script de correção
        />
      )}
    </div>
  );
};

export default FixedTransformationImage;
