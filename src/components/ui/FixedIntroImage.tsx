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
  
  // Parâmetros de alta qualidade
  const transforms = [
    'f_auto',         // Formato automático (webp/avif)
    'q_95',           // Qualidade muito alta (95%)
    'dpr_auto',       // Densidade de pixel automática
    'e_sharpen:60'    // Nitidez para melhorar qualidade visual
  ].join(',');
  
  // Montar URL final com alta qualidade
  return `${baseUrl}${version}${transforms}/${finalPath}`;
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
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  );
};

export default FixedIntroImage;
