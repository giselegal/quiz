import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Check, AlertTriangle } from "lucide-react";

interface QuizNavigationProps {
  canProceed: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  currentQuestionType: "normal" | "strategic";
  selectedOptionsCount: number;
  isLastQuestion?: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  canProceed,
  onNext,
  onPrevious,
  currentQuestionType,
  selectedOptionsCount,
  isLastQuestion = false,
}) => {
  const [showActivationEffect, setShowActivationEffect] = useState(false);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoAdvancedRef = useRef(false);

  // Reset auto-advance flag when question changes
  useEffect(() => {
    hasAutoAdvancedRef.current = false;
  }, [currentQuestionType, selectedOptionsCount]);

  useEffect(() => {
    // Clear any existing timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (canProceed) {
      setShowActivationEffect(true);
      const visualTimer = setTimeout(() => {
        setShowActivationEffect(false);
      }, 2000);

      // Auto-advance only for normal questions with 3+ selections and not already advanced
      // Strategic questions do NOT auto-advance
      const shouldAutoAdvance = 
        currentQuestionType === "normal" && 
        selectedOptionsCount >= 3 && 
        !hasAutoAdvancedRef.current;

      if (shouldAutoAdvance) {
        hasAutoAdvancedRef.current = true;
        autoAdvanceTimerRef.current = setTimeout(() => {
          onNext();
        }, 1200);
      }

      return () => {
        clearTimeout(visualTimer);
      };
    } else {
      setShowActivationEffect(false);
    }
  }, [canProceed, selectedOptionsCount, currentQuestionType, onNext]);

  const getHelperText = (): string => {
    if (!canProceed) {
      return currentQuestionType === "strategic"
        ? "Selecione 1 opção para continuar"
        : `Selecione ${Math.max(
            0,
            3 - selectedOptionsCount
          )} mais opções para continuar`;
    }
    // Show auto-advance message for normal questions with 3+ options
    if (currentQuestionType === "normal" && selectedOptionsCount >= 3) {
      return "Avançando automaticamente...";
    }
    // Strategic questions ready to proceed manually
    if (currentQuestionType === "strategic" && selectedOptionsCount >= 1) {
      return "Clique em Avançar para continuar";
    }
    return "";
  };

  const nextButtonText = isLastQuestion ? "Ver Resultado" : "Avançar";

  return (
    <div className="mt-6 w-full px-4 md:px-0">
      <div className="flex flex-col items-center w-full">
        {/* Texto de ajuda dinâmico */}
        {!canProceed && (
          <p className="text-sm text-[#8F7A6A] mb-3 text-center">
            {getHelperText()}
          </p>
        )}

        {/* Feedback de auto-avanço para questões normais */}
        {canProceed && currentQuestionType === "normal" && (
          <p className="text-sm text-green-600 mb-3 text-center animate-pulse">
            {getHelperText()}
          </p>
        )}

        <div className="flex justify-center items-center w-full gap-4">
          {onPrevious && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="text-[#8F7A6A] border-[#8F7A6A] hover:bg-[#F3E8E6]/50 hover:text-[#A38A69] py-3 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-opacity-50"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          )}

          {/* Botão Avançar sempre visível com estados apropriados */}
          <Button
            onClick={onNext}
            disabled={!canProceed}
            variant="default"
            className={`text-lg px-8 py-3 flex items-center transition-all duration-300 ease-in-out rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b29670]
              ${
                canProceed
                  ? `bg-[#b29670] text-white hover:bg-[#a0845c] border-[#b29670] ${
                      showActivationEffect
                        ? "scale-105 shadow-lg ring-2 ring-[#b29670] ring-opacity-50"
                        : ""
                    }`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 hover:scale-100"
              }`}
            aria-label={nextButtonText}
            aria-disabled={!canProceed}
          >
            {nextButtonText}
            {isLastQuestion ? (
              <Check className="ml-2 h-5 w-5" />
            ) : (
              <ChevronRight className="ml-2 h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
