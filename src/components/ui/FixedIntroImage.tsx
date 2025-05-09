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
    return url; // Retorna a URL original se a estrutura for inesperada
  }

  const baseUrl = parts[0] + uploadMarker;
  const pathAfterUpload = parts[1];

  let version = '';
  let publicId = '';

  // Regex para extrair a versão (opcional, ex: "v123/") e o public_id,
  // ignorando quaisquer transformações ("pastas" de transformação) que venham antes da versão ou do public_id.
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
    console.warn('[FixedIntroImage] Regex did not match path, assuming entire path is publicId:', pathAfterUpload);
  }
  
  // console.log('[FixedIntroImage] Parsed URL parts - Base:', baseUrl, 'Version:', version, 'PublicID:', publicId);

  // Novas transformações de alta qualidade a serem aplicadas.
  const newTransforms = [
    'f_auto',         // Formato automático (webp/avif)
    'q_95',           // Qualidade muito alta (95%)
    'dpr_auto',       // Densidade de pixel automática
    'e_sharpen:60'    // Nitidez para melhorar qualidade visual
  ].join(',');
  // console.log('[FixedIntroImage] New transforms to apply:', newTransforms);

  // Montar a URL final: baseUrl + newTransforms + / + version (se existir) + publicId
  // A barra entre newTransforms e version/publicId é adicionada explicitamente.
  // A 'version', se existir, já contém uma barra no final (ex: "v123/").
  let finalUrl = `${baseUrl}${newTransforms}/`;
  if (version) {
    finalUrl += version; // Adiciona a versão (ex: v12345/) que já tem a barra
  }
  finalUrl += publicId; // Adiciona o ID público (ex: imagem.jpg ou pasta/imagem.jpg)

  console.log('[FixedIntroImage] getHighQualityUrl output:', finalUrl);
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
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  );
};

export default FixedIntroImage;
