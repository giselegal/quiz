import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizTransitionEffectsProps {
  isVisible: boolean;
  type: 'question-change' | 'section-transition' | 'completion';
  onComplete?: () => void;
}

export const QuizTransitionEffects: React.FC<QuizTransitionEffectsProps> = ({
  isVisible,
  type,
  onComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'success' | 'transition'>('loading');

  useEffect(() => {
    if (isVisible) {
      setCurrentPhase('loading');
      
      const timer = setTimeout(() => {
        setCurrentPhase('success');
        
        const completeTimer = setTimeout(() => {
          setCurrentPhase('transition');
          onComplete?.();
        }, 800);

        return () => clearTimeout(completeTimer);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getTransitionContent = () => {
    switch (type) {
      case 'question-change':
        return {
          loading: 'Processando suas respostas...',
          success: 'Respostas registradas!',
          transition: 'Próxima pergunta'
        };
      case 'section-transition':
        return {
          loading: 'Analisando seu estilo...',
          success: 'Perfil identificado!',
          transition: 'Perguntas estratégicas'
        };
      case 'completion':
        return {
          loading: 'Calculando seu resultado...',
          success: 'Análise completa!',
          transition: 'Vamos aos resultados'
        };
      default:
        return {
          loading: 'Processando...',
          success: 'Concluído!',
          transition: 'Continuando'
        };
    }
  };

  const content = getTransitionContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-[#B89B7A]/90 to-[#432818]/90 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -20 }}
            className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
          >
            <div className="mb-6">
              {currentPhase === 'loading' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#B89B7A] border-t-transparent rounded-full mx-auto"
                />
              )}
              
              {currentPhase === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-green-500 rounded-full mx-auto flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {currentPhase === 'transition' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-12 h-12 bg-[#B89B7A] rounded-full mx-auto flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              )}
            </div>

            <motion.h3
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold text-[#432818] mb-2"
            >
              {content[currentPhase]}
            </motion.h3>

            {type === 'section-transition' && currentPhase === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-600"
              >
                Agora vamos conhecer melhor seus objetivos
              </motion.p>
            )}

            {type === 'completion' && currentPhase === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-600"
              >
                Seu estilo predominante foi identificado!
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizTransitionEffects;