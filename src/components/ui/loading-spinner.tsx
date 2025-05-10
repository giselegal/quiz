
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  thickness?: 'thin' | 'normal' | 'thick';
  showText?: boolean;
  text?: string;
}

/**
 * Componente de spinner de carregamento padronizado e elegante
 * Usado em todas as páginas do quiz para manter consistência visual
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#B89B7A',
  className = '',
  thickness = 'normal',
  showText = false,
  text = 'Carregando'
}) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const thicknessMap = {
    thin: 'border-2',
    normal: 'border-3',
    thick: 'border-4'
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const thicknessClass = thicknessMap[thickness] || thicknessMap.normal;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite" aria-label={text}>
      <div
        className={`${sizeClass} ${thicknessClass} rounded-full animate-spin`}
        style={{
          borderColor: `${color} transparent transparent transparent`,
          animationDuration: '0.8s'
        }}
      />
      {showText && <p className="mt-2 text-sm text-gray-600 font-inter">{text}</p>}
    </div>
  );
};
