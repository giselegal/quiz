import React from 'react';

interface LoadingStateProps {
  message?: string;
  showLogo?: boolean;
  role?: string;
  'aria-busy'?: "true" | "false" | boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Carregando...', 
  showLogo = true,
  role = 'status',
  'aria-busy': ariaBusy = true
}) => {
  // Logo otimizada com parâmetros otimizados
  const logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_112,h_56,c_fit,dpr_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FEFEFE]" role={role} aria-busy={ariaBusy}>
      {showLogo && (
        <div className="w-28 h-auto mb-8">
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
      
      {/* Barra de progresso simplificada com animação CSS mais eficiente */}
      <div className="relative w-40 h-[4px] bg-[#f1e8db] rounded-full overflow-hidden mb-4">
        <div className="absolute inset-0 w-1/3 bg-[#b29670] rounded-full" 
          style={{
            animation: 'loadingBar 1.5s ease-in-out infinite'
          }}
        />
      </div>
      
      <p className="text-[#432818] font-medium">{message}</p>
      
      {/* Adiciona keyframe de animação inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `
      }} />
    </div>
  );
};
