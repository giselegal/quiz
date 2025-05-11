
import React from 'react';

/**
 * Componente especializado para o carregamento da página QuizIntro
 * Usa o spinner padronizado para manter a consistência visual
 */
export const QuizIntroLoading: React.FC = () => {
  // Logo otimizada
  const logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_140,h_60,c_fit,dpr_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FBF8F4]">
      {/* Apenas o logo, sem spinner */}
      <div className="w-36 h-auto mb-6">
        <img 
          src={logoUrl}
          alt="Logo Gisele Galvão"
          width={140}
          height={60}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            objectFit: 'contain',
            imageRendering: 'crisp-edges',
            maxWidth: '100%',
            background: 'none'
          }}
        />
      </div>
      
      <p className="text-[#432818] font-medium font-inter">Preparando sua experiência...</p>
    </div>
  );
};

export default QuizIntroLoading;
