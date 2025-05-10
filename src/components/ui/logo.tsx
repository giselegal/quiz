
import React from 'react';
import OptimizedImage from './OptimizedImage';

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
  className = "h-14", 
  style,
  priority = true,
  width = 200,
  height = 100
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      style={style}
      priority={priority}
      width={width}
      height={height}
      objectFit="contain"
    />
  );
};

export default Logo;
