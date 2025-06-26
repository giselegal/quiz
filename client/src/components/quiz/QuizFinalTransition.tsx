import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface QuizFinalTransitionProps {
  onContinue: () => void;
}

export const QuizFinalTransition: React.FC<QuizFinalTransitionProps> = ({
  onContinue,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F3F0] to-[#F0EDE8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-4xl font-light text-[#2C2C2C] mb-6"
        >
          Obrigada por compartilhar.
        </motion.h1>

        {/* Texto principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-6 text-lg md:text-xl text-[#4A4A4A] leading-relaxed"
        >
          <p>
            Chegar até aqui já mostra que você está pronta para se olhar com mais amor, 
            se vestir com mais intenção e deixar sua imagem comunicar quem você é de verdade 
            — com leveza, presença e propósito.
          </p>

          <p>
            Agora, é hora de revelar o seu <span className="font-medium text-[#2C2C2C]">Estilo Predominante</span> — 
            e os seus <span className="font-medium text-[#2C2C2C]">Estilos Complementares</span>. 
            E, mais do que isso, uma oportunidade real de aplicar o seu Estilo com leveza e confiança — todos os dias.
          </p>

          <p>
            Ah, e lembra do valor que mencionamos? Prepare-se para uma surpresa: o que você vai receber 
            vale muito mais do que imagina — e vai custar muito menos do que você esperava.
          </p>
        </motion.div>

        {/* Botão de ação */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="pt-8"
        >
          <Button
            onClick={onContinue}
            className="bg-[#8B4513] hover:bg-[#7A3E12] text-white px-12 py-4 text-lg rounded-full 
                     shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Vamos ao resultado?
          </Button>
        </motion.div>


      </motion.div>
    </div>
  );
};

export default QuizFinalTransition;