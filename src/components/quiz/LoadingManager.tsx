
import React from 'react';
import { LoadingState } from '../ui/loading-state';
import { motion } from 'framer-motion';

interface LoadingManagerProps {
  isLoading: boolean;
  children?: React.ReactNode;
  message?: string;
  useQuizIntroLoading?: boolean;
}

/**
 * Gerenciador de estados de carregamento que utiliza o spinner padronizado
 * Versão otimizada para evitar dependências circulares
 */
const LoadingManager: React.FC<LoadingManagerProps> = ({
  isLoading,
  children,
  message = 'Carregando o quiz...',
  useQuizIntroLoading = false
}) => {
  // If loading, show appropriate loading component
  if (isLoading) {
    return useQuizIntroLoading ? (
      // Simplified loading indicator instead of importing QuizIntroLoading
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FBF8F4]">
        <div className="w-36 h-auto mb-6">
          <img 
            src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_140,h_60,c_fit,dpr_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            width={140}
            height={60}
            loading="eager"
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
    ) : (
      <LoadingState message={message} spinnerSize="lg" />
    );
  }

  // When loaded, use framer-motion to smoothly fade in content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default LoadingManager;
