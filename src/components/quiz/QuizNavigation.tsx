
import * as React from 'react';
import { Button } from '../ui/button';
import '@/styles/quiz-animations.css';

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
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  console.log(`QuizNavigation - CanProceed: ${canProceed}, Type: ${currentQuestionType}, SelectedCount: ${selectedOptionsCount}, Required: ${requiredOptionsCount}`);

  // Verificar quando o botão se torna disponível para mostrar o efeito e auto-avançar
  React.useEffect(() => {
    // Limpar qualquer timer existente para evitar conflitos
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Configurar auto-avanço para todas as questões quando atingir o número de seleções necessárias
    if (canProceed && selectedOptionsCount === requiredOptionsCount) {
      console.log("Auto-avanço ativado - configurando timer");
      
      // Mostrar a ativação visual do botão imediatamente
      setShowActivationEffect(true);
      
      // Timer para auto-avanço - reduzido para 800ms para ser mais rápido, mas ainda perceptível
      timerRef.current = setTimeout(() => {
        console.log("Executando auto-avanço");
        onNext();
        setShowActivationEffect(false); // Resetar o efeito visual após o avanço
      }, 800);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      // Resetar o efeito visual se as condições não forem satisfeitas
      setShowActivationEffect(false);
    }
  }, [canProceed, onNext, selectedOptionsCount, requiredOptionsCount]);

  // Limpar timers quando o componente for desmontado
  React.useEffect(() => {
    return () => {
      console.log("QuizNavigation desmontando - limpando timers");
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

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

          <Button
            onClick={onNext}
            disabled={!canProceed}
            className={`
              py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${!canProceed 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-brand-primary hover:bg-brand-primary/90 text-white focus:ring-brand-primary'
              } 
              ${showActivationEffect 
                ? 'auto-advance-ready' 
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
