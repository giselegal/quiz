
import React from 'react';
import { cn } from '@/lib/utils';

interface SharpImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Componente de imagem otimizado que renderiza imagens nítidas sem efeitos de blur
 * Projetado para resolver problemas de imagens embaçadas e melhorar métricas LCP/FCP
 */
const SharpImage: React.FC<SharpImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  objectFit = 'cover'
}) => {
  // Otimizar a URL do Cloudinary diretamente, garantindo alta qualidade
  const optimizedSrc = React.useMemo(() => {
    if (!src || !src.includes('cloudinary.com')) return src;
    
    // Extrair partes da URL do Cloudinary
    const urlParts = src.split('/upload/');
    if (urlParts.length !== 2) return src;
    
    // Construir URL otimizada com alta qualidade e sem blur
    const baseUrl = urlParts[0];
    const pathPart = urlParts[1];
    
    // Verificar se já existem transformações
    const hasTransforms = pathPart.includes('/');
    
    if (hasTransforms) {
      // Remover qualquer parâmetro de blur existente e forçar alta qualidade
      const cleanedPath = pathPart
        .replace(/,e_blur:[0-9]+/g, '')
        .replace(/q_[0-9]+/g, 'q_95');
      
      // Adicionar parâmetros para nitidez e DPR automático se não existirem
      if (!cleanedPath.includes('e_sharpen')) {
        return `${baseUrl}/upload/f_auto,q_95,dpr_auto,e_sharpen:60/${cleanedPath}`;
      }
      
      return `${baseUrl}/upload/f_auto,q_95,dpr_auto/${cleanedPath}`;
    }
    
    // Se não houver transformações, adicionar nossos próprios parâmetros otimizados
    return `${baseUrl}/upload/f_auto,q_95,dpr_auto,e_sharpen:60/${pathPart}`;
  }, [src]);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading="eager"
      fetchPriority="high" // Corrected from fetchpriority to fetchPriority
      decoding="sync"
      className={cn(
        "w-full h-full",
        objectFit === 'cover' && "object-cover",
        objectFit === 'contain' && "object-contain",
        objectFit === 'fill' && "object-fill",
        objectFit === 'none' && "object-none",
        objectFit === 'scale-down' && "object-scale-down",
        className
      )}
      style={{
        imageRendering: 'crisp-edges',
        ...style
      }}
    />
  );
};

export default SharpImage;
