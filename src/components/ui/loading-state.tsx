import React from 'react';
import { LoadingSpinner } from './loading-spinner';

interface LoadingStateProps {
  message?: string;
  showLogo?: boolean;
  role?: string;
  'aria-busy'?: "true" | "false" | boolean;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  spinnerColor?: string;
}

/**
 * Componente de estado de carregamento padronizado para todo o aplicativo
 * Usa o LoadingSpinner padronizado para garantir consistência visual
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Carregando...', 
  showLogo = true,
  role = 'status',
  'aria-busy': ariaBusy = true,
  spinnerSize = 'md',
  spinnerColor = '#B89B7A'
}) => {
  // Logo otimizada com parâmetros otimizados
  const logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_112,h_56,c_fit,dpr_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FEFEFE]" role={role} aria-busy={ariaBusy}>
      {showLogo && (
        <div className="w-28 h-auto mb-6">
          <img 
            src={logoUrl}
            alt="Logo Gisele Galvão"
            width={112}
            height={56}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              objectFit: 'contain',
              imageRendering: 'crisp-edges'
            }}
          />
        </div>
      )}
      
      {/* Spinner padronizado para todo o aplicativo */}
      <LoadingSpinner 
        size={spinnerSize}
        color={spinnerColor}
        thickness="normal"
        className="mb-4"
      />
      
      <p className="text-[#432818] font-medium font-inter">{message}</p>
    </div>
  );
};
