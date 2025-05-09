/**
 * FixedIntroImage - Componente otimizado e sem embaçamento para as imagens da introdução
 * 
 * Este componente foi criado especificamente para resolver o problema de imagens embaçadas
 * na introdução do Quiz Sell Genius. Ele usa URLs de alta qualidade e força a exibição
 * de imagens nítidas, sem placeholders embaçados.
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
  console.log('[FixedIntroImage] getHighQualityUrl input:', url);
  if (!url || (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com'))) {
    console.log('[FixedIntroImage] URL is not Cloudinary or empty, returning as is:', url);
    return url;
  }

  const uploadMarker = '/image/upload/';
  const parts = url.split(uploadMarker);
  if (parts.length !== 2) {
    console.warn('[FixedIntroImage] URL structure unexpected (no /image/upload/ marker):', url);
    return url;
  }

  const baseUrl = parts[0] + uploadMarker;
  let pathAfterUpload = parts[1];

  // Regex para encontrar a versão e o public_id, ignorando TODAS as transformações
  const versionAndPublicIdPattern = /^(?:.*?\/)*?(v\d+\/)?([^/]+(?:\/[^/]+)*)$/;
  const match = pathAfterUpload.match(versionAndPublicIdPattern);

  if (!match) {
    console.warn('[FixedIntroImage] Could not parse version and public_id:', pathAfterUpload);
    return url;
  }

  const version = match[1] || ''; // Inclui o 'v' e a barra se existir
  const publicId = match[2];

  console.log('[FixedIntroImage] Parsed parts:', {
    baseUrl,
    version,
    publicId,
    originalPath: pathAfterUpload
  });

  // Aplicar apenas nossas transformações otimizadas
  const transforms = [
    'f_auto',         // Formato automático (webp/avif)
    'q_99',           // Qualidade máxima (99%)
    'dpr_auto',       // Densidade de pixel automática para telas de alta resolução
    'w_auto',         // Largura automática baseada no contêiner
    'c_limit',        // Limitar redimensionamento para manter qualidade
    'e_sharpen:80'    // Nitidez aumentada para compensar qualquer compressão
  ].join(',');

  // Construir URL final: baseUrl + transformações + versão (se existir) + publicId
  const finalUrl = `${baseUrl}${transforms}/${version}${publicId}`;
  console.log('[FixedIntroImage] Final URL:', finalUrl);
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
  console.log('[FixedIntroImage] Props:', { src, alt, width, height, priority, className });
  // Obter URL de alta qualidade
  const highQualitySrc = getHighQualityUrl(src);
  console.log('[FixedIntroImage] Input src:', src);
  console.log('[FixedIntroImage] Generated highQualitySrc:', highQualitySrc);

  // Calcular a proporção para o estilo
  const aspectRatio = height / width;
  const paddingBottom = `${aspectRatio * 100}%`;

  console.log('[FixedIntroImage] Rendering with:', { highQualitySrc, aspectRatio, paddingBottom });

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
