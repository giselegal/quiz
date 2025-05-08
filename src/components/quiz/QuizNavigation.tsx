
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

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
  
  // Verificar quando o botão se torna disponível para mostrar o efeito
  useEffect(() => {
    if (canProceed) {
      setShowActivationEffect(true);
      const timer = setTimeout(() => {
        setShowActivationEffect(false);
      }, 600); // A duração da animação
      return () => clearTimeout(timer);
    }
  }, [canProceed]);

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
    <div className="flex justify-center items-center mt-6 w-full px-4 md:px-0">
      <div className="flex-1 text-left">
        {onPrevious && (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="text-[#8F7A6A] border-[#8F7A6A]"
          >
            Voltar
          </Button>
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1">
        {!canProceed && (
          <p className="text-sm text-[#8F7A6A] mb-2">{getHelperText()}</p>
        )}
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={`bg-[#B89B7A] hover:bg-[#A38A69] transition-all
            ${!canProceed ? 'opacity-50' : 'opacity-100'}
            ${showActivationEffect ? 'scale-105 shadow-lg' : ''}
          `}
        >
          {isLastQuestion ? 'Ver Resultado' : 'Próximo'}
        </Button>
      </div>
      
      <div className="flex-1"></div>
    </div>
  );
};

export default QuizNavigation;
