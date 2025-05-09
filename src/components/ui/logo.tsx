import React from 'react';
import { OptimizedImage } from './optimized-image'; // Corrigido: importação nomeada e nome do arquivo em minúsculas com hífen

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  src = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
  alt = "Logo Gisele Galvão",
  className = "h-14 mx-auto", 
  style,
  priority = true,
  width = 200,
  height = 100
}) => {
  return (
    <div className="flex justify-center items-center w-full">
      <OptimizedImage
        src={src}
        alt={alt}
        className={`${className} mx-auto`}
        style={style}
        priority={priority} // Controla fetchPriority="high" internamente em OptimizedImage
        width={width}
        height={height}
        objectFit="contain"
        quality={99} // quality é uma prop válida de OptimizedImageProps
      />
    </div>
  );
};

export default Logo;
