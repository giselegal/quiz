import * as React from 'react';
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
  const [showActivationEffect, setShowActivationEffect] = React.useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = React.useState<NodeJS.Timeout | null>(null);

  // Atualizar lógica para desativar auto-avanço em questões estratégicas
  React.useEffect(() => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (canProceed && currentQuestionType === 'normal') {
      setShowActivationEffect(true);
      const visualTimer = setTimeout(() => {
        setShowActivationEffect(false);
      }, 2000);

      const newTimer = setTimeout(() => {
        onNext();
      }, 1500);
      setAutoAdvanceTimer(newTimer);
    }
  }, [canProceed, currentQuestionType, onNext]);

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
      <div className="flex flex-col items-center w-full">
        {!canProceed && currentQuestionType !== 'strategic' && (
          <p className="text-sm text-[#8F7A6A] mb-3">{getHelperText()}</p>
        )}
        
        <div className="flex justify-center items-center w-full gap-3">
          {onPrevious && (
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="text-[#8F7A6A] border-[#8F7A6A] hover:bg-[#F3E8E6]/50 hover:text-[#A38A69] py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-opacity-50"
            >
              Voltar
            </Button>
          )}

          {/* O botão "Próximo" só será renderizado se não for uma questão estratégica OU se for estratégica e puder prosseguir */}
          {/* Para questões estratégicas, o botão "Continuar" é renderizado dentro de QuizQuestion.tsx */}
          {currentQuestionType === 'strategic' ? (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${!canProceed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-primary hover:bg-brand-primary/90 text-white focus:ring-brand-primary'}
              `}
            >
              Continuar
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${!canProceed 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-brand-primary hover:bg-brand-primary/90 text-white focus:ring-brand-primary'
                } 
                ${showActivationEffect 
                  ? 'scale-105 shadow-lg ring-2 ring-brand-primary ring-opacity-75' // Efeito de ativação atualizado
                  : ''
                }
              `}
            >
              {isLastQuestion ? 'Ver Resultado' : 'Próximo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
