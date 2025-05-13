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
  console.log("QuizNavigation RENDERED"); // Adicionado para verificar a renderização
  // Estado para controlar a animação de ativação do botão
  const [showActivationEffect, setShowActivationEffect] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Registrar informações sobre a questão atual para depuração
    console.log(`QuizNavigation - Tipo: ${currentQuestionType}, Selecionadas: ${selectedOptionsCount}, Requeridas: ${requiredOptionsCount}, Pode prosseguir: ${canProceed}`);
  }, [currentQuestionType, selectedOptionsCount, requiredOptionsCount, canProceed]);

  // Verificar quando o botão se torna disponível para mostrar o efeito e auto-avançar
  React.useEffect(() => {
    // Limpar qualquer timer existente para evitar conflitos
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Adicionar log detalhado para depuração
    console.log(`[QuizNavigation] Estado atual - Tipo: ${currentQuestionType}, Selecionadas: ${selectedOptionsCount}, Requeridas: ${requiredOptionsCount}, Pode prosseguir: ${canProceed}`);
    
    // Condição para auto-avanço: Apenas para questões normais (não estratégicas) E 
    // quando selecionou EXATAMENTE o número requerido
    if (canProceed && 
        selectedOptionsCount === requiredOptionsCount && 
        currentQuestionType !== 'strategic') {
      
      console.log(`Auto-avanço ativado: Tipo=${currentQuestionType}, Selected=${selectedOptionsCount}, Required=${requiredOptionsCount}`);
      
      // Mostrar a ativação visual do botão imediatamente
      setShowActivationEffect(true);
      
      // Configurar um timer para avançar com um delay suficiente para permitir o feedback visual
      // Aumentado para 400ms para dar tempo de visualizar o botão ativado
      timerRef.current = setTimeout(() => {
        console.log("Executando auto-avanço para questão normal");
        onNext();
        setShowActivationEffect(false); // Resetar o efeito visual após o avanço
        timerRef.current = null; // Limpar referência após execução
      }, 400); // Aumentado para 400ms para ser perceptível
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } else if (canProceed && currentQuestionType === 'strategic') {
      // Para questões estratégicas, apenas mostrar o efeito visual, sem auto-avanço
      // O usuário precisa clicar no botão "Continuar"
      setShowActivationEffect(true);
    } else {
      // Se as condições não são mais satisfeitas
      setShowActivationEffect(false); // Resetar o efeito visual
    }
  }, [canProceed, onNext, selectedOptionsCount, requiredOptionsCount, currentQuestionType]);

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
    <div className="mt-6 w-full px-4 md:px-0 mb-8">
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
            {isLastQuestion ? 'Ver Resultado' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
