import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QuizQuestion as QuizQuestionType, UserResponse } from '../types/quiz';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuizOption } from './quiz/QuizOption';
import { highlightStrategicWords } from '@/utils/textHighlight';
import { useQuestionScroll } from '@/hooks/useQuestionScroll';
import '@/styles/quiz-animations.css';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
  autoAdvance?: boolean;
  hideTitle?: boolean;
  onNextClick?: () => void;
  onPreviousClick?: () => void;
  showQuestionImage?: boolean;
  isStrategicQuestion?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = (props) => {
  const {
    question,
    onAnswer,
    currentAnswers,
    autoAdvance = false,
    hideTitle = false,
    onNextClick,
    onPreviousClick,
    showQuestionImage = false,
    isStrategicQuestion = false
  } = props;

  // Fallback defensivo para evitar tela branca
  if (!question || !question.title || !Array.isArray(question.options)) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 text-center text-red-700">
        Erro: Dados da questão ausentes ou inválidos. Por favor, recarregue a página ou tente novamente mais tarde.
      </div>
    );
  }

  const isMobile = useIsMobile();
  const hasImageOptions = question.type !== 'text';
  const [imageError, setImageError] = useState(false);
  const { scrollToQuestion } = useQuestionScroll();
  
  useEffect(() => {
    scrollToQuestion(question.id);
  }, [question.id, scrollToQuestion]);

  const handleOptionSelect = (optionId: string) => {
    let newSelectedOptions: string[];
    
    if (currentAnswers.includes(optionId)) {
      // Se já está selecionado, remova da seleção
      newSelectedOptions = currentAnswers.filter(id => id !== optionId);
    } else {
      if (isStrategicQuestion) {
        // Para questões estratégicas, apenas uma opção pode ser selecionada
        newSelectedOptions = [optionId];
      } else if (question.multiSelect && currentAnswers.length >= question.multiSelect) {
        // Se já atingiu o máximo de seleções, substitua a primeira seleção pela nova
        newSelectedOptions = [...currentAnswers.slice(1), optionId];
      } else {
        // Adicione a nova seleção às existentes
        newSelectedOptions = [...currentAnswers, optionId];
      }
    }
    
    // Atualizar as respostas imediatamente
    onAnswer({
      questionId: question.id,
      selectedOptions: newSelectedOptions
    });
    
    // Para questões normais, verificar se atingiu exatamente o número de opções necessárias
    // e acionar o avanço automático se autoAdvance estiver habilitado
    if (autoAdvance && 
        !isStrategicQuestion && 
        onNextClick && 
        newSelectedOptions.length === (question.multiSelect || 3)) {
      // Pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        onNextClick();
      }, 50);
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
          <h2
            id={`question-title-${question.id}`}
            className={cn(
              "font-playfair text-center mb-5 px-3 pt-3 text-brand-coffee font-semibold tracking-normal",
              isMobile ? "text-base" : "text-base sm:text-xl",
              isStrategicQuestion && "text-[#432818] mb-6 font-medium whitespace-pre-line"
            )}
          >
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
          
          {/* Mensagem de instrução */}
          <p className="text-xs sm:text-sm text-[#1A1818]/70 px-2 py-2 mb-4 text-center font-medium">
            {isStrategicQuestion 
              ? "Selecione 1 opção para avançar"
              : `Selecione ${question.multiSelect || 3} opções para avançar`
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
              currentAnswers.length >= (question.multiSelect || 3)}
            isStrategicOption={isStrategicQuestion}
          />
        ))}
      </div>
    </div>
  );
};

export { QuizQuestion };
