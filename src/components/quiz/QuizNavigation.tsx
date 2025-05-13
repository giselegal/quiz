
import * as React from 'react';
import { Button } from '../ui/button';

interface QuizNavigationProps {
  canProceed: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  currentQuestionType: 'normal' | 'strategic';
  selectedOptionsCount: number;
  isLastQuestion?: boolean;
  requiredOptionsCount?: number;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  canProceed,
  onNext,
  onPrevious,
  currentQuestionType,
  selectedOptionsCount,
  isLastQuestion = false,
  requiredOptionsCount = 3
}) => {
  // Estado para controlar a animação de ativação do botão
  const [showActivationEffect, setShowActivationEffect] = React.useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = React.useState<NodeJS.Timeout | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  console.log(`QuizNavigation - CanProceed: ${canProceed}, Type: ${currentQuestionType}, SelectedCount: ${selectedOptionsCount}, Required: ${requiredOptionsCount}`);

  // Verificar quando o botão se torna disponível para mostrar o efeito e auto-avançar
  React.useEffect(() => {
    // Limpar qualquer timer existente para evitar conflitos
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    // Só configurar auto-avanço para questões normais, não para estratégicas
    if (canProceed && currentQuestionType === 'normal' && selectedOptionsCount === requiredOptionsCount) {
      console.log("Auto-avanço ativado - configurando timers");
      
      // Mostrar a ativação visual do botão primeiro
      setShowActivationEffect(true);
      
      // Timer visual - mantém o efeito visual por um tempo 
      const visualTimer = setTimeout(() => {
        console.log("Finalizando efeito visual de ativação");
        setShowActivationEffect(false);
      }, 2500);
      
      // Timer para auto-avanço - usar ref para manter controle consistente
      timerRef.current = setTimeout(() => {
        console.log("Executando auto-avanço");
        onNext();
      }, 2000);
      
      // Armazenar também no state para trigger de useEffect
      setAutoAdvanceTimer(timerRef.current);
      
      return () => {
        clearTimeout(visualTimer);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      console.log("Auto-avanço não ativado - condições não satisfeitas");
    }
  }, [canProceed, currentQuestionType, onNext, selectedOptionsCount, requiredOptionsCount]);

  // Limpar timers quando o componente for desmontado
  React.useEffect(() => {
    return () => {
      console.log("QuizNavigation desmontando - limpando timers");
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);

  const getHelperText = () => {
    if (!canProceed) {
      if (currentQuestionType === 'strategic') {
        return 'Selecione 1 opção para continuar';
      }
      return `Selecione ${requiredOptionsCount} opções para continuar`;
    }
    return '';
  };

  return (
    <div className="mt-6 w-full px-4 md:px-0">
      <div className="flex flex-col items-center w-full">
        {!canProceed && (
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

          {/* O botão "Próximo" será sempre renderizado */}
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
            {isLastQuestion ? 'Ver Resultado' : currentQuestionType === 'strategic' ? 'Continuar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
