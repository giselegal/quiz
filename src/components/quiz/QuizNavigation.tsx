import * as React from 'react';
import { Button } from '../ui/button';
import '@/styles/quiz-animations.css';
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';

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

  // Debug logs aprimorados
  React.useEffect(() => {
    console.log(`QuizNavigation - Tipo: ${currentQuestionType}, Selecionadas: ${selectedOptionsCount}, Requeridas: ${requiredOptionsCount}, Pode prosseguir: ${canProceed}`);
  }, [currentQuestionType, selectedOptionsCount, requiredOptionsCount, canProceed]);

  // Verificar quando o botão se torna disponível para mostrar o efeito e auto-avançar
  React.useEffect(() => {
    // Limpar qualquer timer existente para evitar conflitos
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Condição para auto-avanço: Para questões normais (não estratégicas) E 
    // quando selecionou EXATAMENTE o número requerido
    if (canProceed && 
        selectedOptionsCount === requiredOptionsCount && 
        currentQuestionType !== 'strategic') {
      
      console.log(`Auto-avanço ativado: Tipo=${currentQuestionType}, Selected=${selectedOptionsCount}, Required=${requiredOptionsCount}`);
      
      // Mostrar a ativação visual do botão imediatamente
      setShowActivationEffect(true);
      
      // Configurar timer para avançar com delay reduzido
      timerRef.current = setTimeout(() => {
        console.log("Executando auto-avanço para questão normal");
        onNext();
        setShowActivationEffect(false);
        timerRef.current = null;
      }, 50); // Reduzido de 100ms para 50ms para feedback mais rápido
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } else if (canProceed && currentQuestionType === 'strategic') {
      // Para questões estratégicas, apenas mostrar o efeito visual, sem auto-avanço
      setShowActivationEffect(true);
    } else {
      // Se as condições não são mais satisfeitas
      setShowActivationEffect(false);
    }
  }, [canProceed, onNext, selectedOptionsCount, requiredOptionsCount, currentQuestionType]);

  // Limpar timers quando o componente for desmontado
  React.useEffect(() => {
    return () => {
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

  const nextButtonText = isLastQuestion ? "Ver Resultado" : (currentQuestionType === 'strategic' ? "Próxima Pergunta Estratégica" : "Próxima Pergunta");
  const previousButtonText = currentQuestionType === 'strategic' ? "Pergunta Estratégica Anterior" : "Pergunta Anterior";

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
              className="text-[#8F7A6A] border-[#8F7A6A] hover:bg-[#F3E8E6]/50 hover:text-[#A38A69] py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-opacity-50"
            >
              Voltar
            </Button>
          )}

          {/* Condição de renderização do botão Próximo/Continuar/Ver Resultado ajustada */}
          {/* Sempre renderiza o botão se não for uma questão estratégica normal que não pode prosseguir */}
          {/* Ou se for estratégica ou última questão */}
          {(currentQuestionType !== 'strategic' || canProceed || isLastQuestion) && (
             <Button
              onClick={onNext}
              disabled={!canProceed}
              variant="outline" // Mantido de fix/revert-quiz-state
              className={`text-lg px-6 py-3 flex items-center transition-all duration-300 ease-in-out
                ${canProceed 
                  ? 'bg-[#b29670] text-white hover:bg-[#a0845c] border-[#b29670]' // Estilo de fix/revert-quiz-state quando habilitado
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300' // Estilo de fix/revert-quiz-state quando desabilitado
                } focus:ring-2 focus:ring-offset-2 focus:ring-[#b29670]
                ${showActivationEffect && currentQuestionType === 'strategic' && canProceed // Adiciona animação se estratégica e pode prosseguir
                  ? 'auto-advance-ready' 
                  : ''
                }
              `}
              aria-label={nextButtonText}
              aria-disabled={!canProceed}
            >
              {nextButtonText}
              {isLastQuestion ? <CheckCircle className="ml-2 h-5 w-5" /> : <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
