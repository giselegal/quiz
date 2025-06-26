import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuizTransitionProps {
  onContinue: () => void;
}

export const QuizTransition: React.FC<QuizTransitionProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#B89B7A] to-[#8B7355] rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-[#432818] mb-6"
          >
            Enquanto calculamos o seu resultado...
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-6 mb-8"
        >
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.
          </p>
          
          <p className="text-base text-[#6B5A4F] leading-relaxed">
            A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.
          </p>
          
          <p className="text-base text-[#6B5A4F] leading-relaxed font-medium">
            Responda com sinceridade. Isso é só entre você e a sua nova versão.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button
            onClick={onContinue}
            className="bg-[#B89B7A] hover:bg-[#A08B6F] text-white font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizTransition;