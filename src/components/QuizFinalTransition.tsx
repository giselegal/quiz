import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { preloadCriticalImages } from '@/utils/imageManager';
import { useNavigate } from 'react-router-dom';
import { OptimizedImage } from './ui/optimized-image'; // Importar OptimizedImage

interface QuizFinalTransitionProps {
  onShowResult?: () => void;
}

const QuizFinalTransition: React.FC<QuizFinalTransitionProps> = ({ onShowResult }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  
  const steps = [
    "Analisando suas escolhas...",
    "Identificando seu estilo predominante...",
    "Calculando combinações complementares...",
    "Preparando seu resultado personalizado..."
  ];

  useEffect(() => {
    // Iniciamos o preload de imagens em paralelo com a animação
    const preloadPromise = Promise.resolve().then(() => {
      preloadCriticalImages('results');
      return true;
    });
    
    // Fake progress animation - com velocidade aumentada (8ms)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Aceleração da progressão para finalizar em ~800ms
        return prev + (prev < 50 ? 1.3 : 1.5);
      });
    }, 8); // Reduzido para 8ms para um total de ~800ms

    // Update step based on progress - mostra passos mais rapidamente
    const stepInterval = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 200); // Reduzido para 200ms para mostrar passos mais rapidamente

    // Cleanup
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  useEffect(() => {
    // Transição mais rápida quando o progresso atinge 98%
    if (progress >= 98) {
      // Navegamos imediatamente quando atingir 98% para eliminar espera
      if (onShowResult) {
        onShowResult();
      } else {
        navigate('/resultado');
      }
    }
  }, [progress, onShowResult, navigate]);

  return (
    <div className="fixed inset-0 bg-[#fffaf7] z-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <OptimizedImage 
            src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto,dpr_auto,e_sharpen:80/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Gisele Galvão"
            className="h-16 w-auto"
            width={128} // Exemplo de largura, ajuste conforme o design original da logo (h-16 implica uma largura) 
            height={64} // Altura correspondente a h-16 (16 * 4 = 64px)
            priority={true} // Garante que a logo seja carregada com prioridade
            objectFit="contain"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-2">
            Finalizando Seu Quiz
          </h2>
          <p className="text-[#3a3a3a]">
            Estamos preparando seu resultado personalizado
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="h-2 w-full bg-[#F3E8E6] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            ></motion.div>
          </div>
          <div className="text-right text-sm text-[#8F7A6A] mt-1">
            {progress}%
          </div>
        </div>

        {/* Current step message */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-[#3a3a3a] font-medium"
        >
          {steps[step]}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#aa6b5d]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default QuizFinalTransition;
