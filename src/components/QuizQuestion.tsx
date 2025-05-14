import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QuizQuestion as QuizQuestionType, UserResponse } from '../types/quiz';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuizOption } from './quiz/QuizOption';
import { highlightStrategicWords } from '@/utils/textHighlight';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuestionScroll } from '@/hooks/useQuestionScroll';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
  autoAdvance?: boolean;
  hideTitle?: boolean;
  onNextClick?: () => void;
  onPreviousClick?: () => void;
  showQuestionImage?: boolean;
  isStrategicQuestion?: boolean; // Nova prop
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentAnswers,
  autoAdvance = false,
  hideTitle = false,
  onNextClick,
  onPreviousClick,
  showQuestionImage = false,
  isStrategicQuestion = false // Padrão para false
}) => {
  const isMobile = useIsMobile();
  // const isStrategicQuestion = question.id.startsWith('strategic'); // Removido para usar a prop
  const hasImageOptions = question.type !== 'text';
  const [imageError, setImageError] = useState(false);
  const { scrollToQuestion } = useQuestionScroll();
  const [isButtonActive, setIsButtonActive] = useState(false); // Novo estado para efeito visual

  useEffect(() => {
    scrollToQuestion(question.id);
  }, [question.id, scrollToQuestion]);

  // Efeito para o botão de questões estratégicas
  useEffect(() => {
    if (isStrategicQuestion) {
      const isActive = currentAnswers.length > 0;
      if (isActive !== isButtonActive) { // Apenas atualiza se o estado mudar
        setIsButtonActive(isActive);
      }
    }
  }, [currentAnswers, isStrategicQuestion, isButtonActive]); // Adicionado isButtonActive às dependências
  
  const handleOptionSelect = (optionId: string) => {
    let newSelectedOptions: string[];
    
    if (currentAnswers.includes(optionId)) {
      newSelectedOptions = currentAnswers.filter(id => id !== optionId);
    } else {
      if (isStrategicQuestion) {
        newSelectedOptions = [optionId];
      } else if (question.multiSelect && currentAnswers.length >= question.multiSelect) {
        newSelectedOptions = [...currentAnswers.slice(1), optionId];
      } else {
        newSelectedOptions = [...currentAnswers, optionId];
      }
    }
    
    onAnswer({ // Movido onAnswer para fora do bloco condicional de auto-avanço
      questionId: question.id,
      selectedOptions: newSelectedOptions
    });

    const shouldAutoAdvance = 
      !isStrategicQuestion &&
      autoAdvance && 
      newSelectedOptions.length === question.multiSelect;
    
    if (shouldAutoAdvance && onNextClick) {
      onNextClick();
    }
  };
  
  const getGridColumns = () => {
    if (question.type === 'text') {
      if (isStrategicQuestion) {
        return "grid-cols-1 gap-3 px-2";
      }
      return isMobile ? "grid-cols-1 gap-3 px-2" : "grid-cols-1 gap-4 px-4";
    }
    return isMobile ? "grid-cols-2 gap-1 px-0.5" : "grid-cols-2 gap-3 px-2";
  };
  
  return (
    <div className={cn("w-full max-w-6xl mx-auto pb-5 relative", 
      isMobile && "px-2", 
      isStrategicQuestion && "max-w-3xl"
    )} id={`question-${question.id}`}>
      {!hideTitle && (
        <>
          <h2 className={cn(
            "font-playfair text-center mb-5 px-3 pt-3 text-brand-coffee font-semibold tracking-normal",
            isMobile ? "text-base" : "text-base sm:text-xl",
            isStrategicQuestion && "text-[#432818] mb-6 font-medium whitespace-pre-line"
          )}>
            {highlightStrategicWords(question.title)}
          </h2>
          
          {isStrategicQuestion && question.imageUrl && !imageError && showQuestionImage && (
            <div className="w-full mb-6">
              <img 
                src={question.imageUrl} 
                alt="Question visual" 
                className="w-full max-w-md mx-auto rounded-lg shadow-sm" 
                onError={() => {
                  console.error(`Failed to load image: ${question.imageUrl}`);
                  setImageError(true);
                }}
              />
            </div>
          )}
          
          <p className="text-xs sm:text-sm text-[#1A1818]/70 px-2 py-2 mb-4 text-center font-medium">
            {isStrategicQuestion 
              ? "Selecione 1 opção para avançar"
              : `Selecione ${question.multiSelect} opções para avançar`
            }
          </p>
        </>
      )}
      
      <div className={cn(
        "grid h-full",
        getGridColumns(),
        hasImageOptions && "mb-4 relative",
        isStrategicQuestion && "gap-4"
      )}>
        {question.options.map(option => (
          <QuizOption 
            key={option.id} 
            option={option} 
            isSelected={currentAnswers.includes(option.id)} 
            onSelect={handleOptionSelect}
            type={question.type}
            questionId={question.id}
            isDisabled={!currentAnswers.includes(option.id) && 
              !isStrategicQuestion && 
              currentAnswers.length >= question.multiSelect}
            isStrategicOption={isStrategicQuestion} // Passar para QuizOption
          />
        ))}
      </div>
      
      {/* Botão Continuar para Questões Estratégicas */}
      {isStrategicQuestion && onNextClick && (
        <div className="mt-8 text-center">
          <Button 
            onClick={onNextClick}
            disabled={currentAnswers.length === 0}
            className={cn(
              "text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
              isButtonActive && !(currentAnswers.length === 0) // Aplicar efeito apenas se ativo e não desabilitado
                ? "bg-brand-primary hover:bg-brand-primary/90 transform hover:scale-105 focus:ring-brand-primary hover:shadow-lg" 
                : "bg-brand-primary", // Estilo base quando não está no efeito "ativo" mas pode estar habilitado
              currentAnswers.length === 0 && "bg-gray-300 hover:bg-gray-300" // Estilo para desabilitado
            )}
          >
            Continuar <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center gap-3 mt-6">
        {!autoAdvance && !isStrategicQuestion && ( // Não mostrar para estratégicas
          <p className="text-xs sm:text-sm text-[#1A1818]/70 px-2 py-2 text-center font-medium">
            Selecione {question.multiSelect} {question.multiSelect === 1 ? 'Opção' : 'Opções'} para avançar
          </p>
        )}
        
        <div className="ml-auto">
          {/* Navigation buttons would go here if needed */}
        </div>
      </div>
    </div>
  );
};

export { QuizQuestion };

