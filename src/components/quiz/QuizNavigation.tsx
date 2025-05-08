
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { colors } from '@/styles/tailwind.config';

interface QuizNavigationProps {
  canProceed: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  currentQuestionType: 'normal' | 'strategic';
  selectedOptionsCount: number;
  isLastQuestion?: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  canProceed,
  onNext,
  onPrevious,
  currentQuestionType,
  selectedOptionsCount,
  isLastQuestion = false
}) => {
  // Estado para controlar a animação de ativação do botão
  const [showActivationEffect, setShowActivationEffect] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  // Verificar quando o botão se torna disponível para mostrar o efeito
  useEffect(() => {
    if (canProceed) {
      // Mostrar o efeito de ativação
      setShowActivationEffect(true);
      
      // Configurar tempo para esconder o efeito visual
      const visualTimer = setTimeout(() => {
        setShowActivationEffect(false);
      }, 2000);
      
      // Auto-avançar quando selecionar a terceira opção em perguntas normais
      if (currentQuestionType === 'normal' && selectedOptionsCount === 3) {
        const timer = setTimeout(() => {
          onNext();
        }, 800); // Pequeno delay antes de avançar automaticamente
        setAutoAdvanceTimer(timer);
      }
      
      return () => {
        clearTimeout(visualTimer);
        if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
      };
    }
  }, [canProceed, currentQuestionType, selectedOptionsCount, onNext]);
  
  // Limpar o timer quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    };
  }, [autoAdvanceTimer]);

  const getHelperText = () => {
    if (!canProceed) {
      if (currentQuestionType === 'strategic') {
        return 'Selecione 1 opção para continuar';
      }
      return 'Selecione 3 opções para continuar';
    }
    return '';
  };

  return (
    <div className="mt-6 w-full px-4 md:px-0">
      {/* Container centralizado para todos os elementos */}
      <div className="flex flex-col items-center w-full">
        {/* Texto ajuda acima do botão */}
        {!canProceed && (
          <p className="text-sm text-[#8F7A6A] mb-3">{getHelperText()}</p>
        )}
        
        {/* Container do botão com melhor alinhamento central */}
        <div className="flex justify-center w-full">
          {/* Contêiner com posicionamento relativo para o botão anterior */}
          <div className="relative w-full max-w-[180px]">
            {/* Botão Próximo (centralizado) */}
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                w-full transition-all duration-300
                ${!canProceed 
                  ? 'bg-gray-400 text-white opacity-50' 
                  : 'bg-[#B89B7A] hover:bg-[#A38A69] text-white opacity-100'
                } 
                ${showActivationEffect 
                  ? 'animate-enhanced-pulse scale-110 shadow-md ring-2 ring-[#B89B7A]/50' 
                  : ''
                }
              `}
            >
              {isLastQuestion ? 'Ver Resultado' : 'Próximo'}
            </Button>
            
            {/* Botão Anterior (posicionado à esquerda absoluto) */}
            {onPrevious && (
              <Button 
                variant="outline" 
                onClick={onPrevious}
                className="text-[#8F7A6A] border-[#8F7A6A] absolute left-0 -translate-x-[120%] top-0"
              >
                Voltar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
