
/**
 * FixedIntroImage - Componente otimizado e sem embaçamento para as imagens da introdução
 */
import React from 'react';

interface FixedIntroImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/**
 * Transforma qualquer URL do Cloudinary em uma versão de alta qualidade
 */
function getHighQualityUrl(url: string): string {
  if (!url || (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com'))) {
    return url;
  }

  const uploadMarker = '/image/upload/';
  const parts = url.split(uploadMarker);
  if (parts.length !== 2) {
    return url;
  }

  const baseUrl = parts[0] + uploadMarker;
  let pathAfterUpload = parts[1];

  // Regex para encontrar a versão e o public_id, ignorando transformações
  const versionAndPublicIdPattern = /^(?:.*?\/)*?(v\d+\/)?([^/]+(?:\/[^/]+)*)$/;
  const match = pathAfterUpload.match(versionAndPublicIdPattern);

  if (!match) {
    return url;
  }

  const version = match[1] || ''; 
  const publicId = match[2];

  // Aplicar apenas transformações otimizadas
  const transforms = [
    'f_auto',         // Formato automático (webp/avif)
    'q_99',           // Qualidade máxima (99%)
    'dpr_auto',       // Densidade de pixel automática para telas de alta resolução
    'w_auto',         // Largura automática baseada no contêiner
    'c_limit',        // Limitar redimensionamento para manter qualidade
    'e_sharpen:80'    // Nitidez aumentada para compensar qualquer compressão
  ].join(',');

  // Construir URL final
  const finalUrl = `${baseUrl}${transforms}/${version}${publicId}`;
  return finalUrl;
}

/**
 * Componente de imagem de alta qualidade sem embaçamento para a introdução
 */
const FixedIntroImage: React.FC<FixedIntroImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = true
}) => {
  // Obter URL de alta qualidade
  const highQualitySrc = getHighQualityUrl(src);

  // Calcular a proporção para o estilo
  const aspectRatio = height / width;
  const paddingBottom = `${aspectRatio * 100}%`;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ paddingBottom }}
    >
      <img
        src={highQualitySrc}
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full object-cover quiz-intro-image"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        style={{imageRendering: 'crisp-edges'}}
      />
    </div>
  );
};

export default FixedIntroImage;
