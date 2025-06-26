import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { QuizQuestion as QuizQuestionType, UserResponse } from "../types/quiz";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuizOption } from "./quiz/QuizOption";
import { highlightStrategicWords } from "@/utils/textHighlight";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useQuestionScroll } from "@/hooks/useQuestionScroll";
import { StaggeredOptionAnimations } from "./effects/StaggeredOptionAnimations";
import { useQuizStyles } from "@/hooks/useQuizConfig";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
  autoAdvance?: boolean;
  hideTitle?: boolean;
  showQuestionImage?: boolean;
  isStrategicQuestion?: boolean; // Nova prop
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentAnswers,
  autoAdvance = false,
  hideTitle = false,
  showQuestionImage = false,
  isStrategicQuestion = false,
}) => {
  const isMobile = useIsMobile();
  const hasImageOptions = question.type !== "text";
  const [imageError, setImageError] = useState(false);
  const { scrollToQuestion } = useQuestionScroll();
  const { cssVariables, theme, layout } = useQuizStyles();

  useEffect(() => {
    scrollToQuestion(question.id);
  }, [question.id, scrollToQuestion]);

  const handleOptionSelect = (optionId: string) => {
    let newSelectedOptions: string[];

    if (currentAnswers.includes(optionId)) {
      // Questões estratégicas: não permitem desmarcar (sempre 1 seleção)
      if (isStrategicQuestion) {
        return; // Não permite desmarcar em questões estratégicas
      }
      // Questões normais: permite desmarcar
      newSelectedOptions = currentAnswers.filter((id) => id !== optionId);
    } else {
      if (isStrategicQuestion) {
        // Questões estratégicas: máximo 1 seleção (substitui anterior)
        newSelectedOptions = [optionId];
      } else {
        // Questões normais: máximo 3 seleções
        const maxSelections = 3;
        if (currentAnswers.length >= maxSelections) {
          // Remove a primeira seleção e adiciona a nova
          newSelectedOptions = [...currentAnswers.slice(1), optionId];
        } else {
          newSelectedOptions = [...currentAnswers, optionId];
        }
      }
    }

    onAnswer({
      questionId: question.id,
      selectedOptions: newSelectedOptions,
    });
  };

  const getGridColumns = () => {
    if (question.type === "text") {
      if (isStrategicQuestion) {
        return "grid-cols-1 gap-3 px-2";
      }
      return isMobile ? "grid-cols-1 gap-3 px-2" : "grid-cols-1 gap-4 px-4";
    }
    return isMobile ? "grid-cols-2 gap-1 px-0.5" : "grid-cols-2 gap-3 px-2";
  };

  return (
    <div
      className={cn(
        "w-full max-w-6xl mx-auto pb-5 relative quiz-container quiz-background quiz-dynamic-theme",
        isMobile && "px-2",
        isStrategicQuestion && "max-w-3xl strategic-question",
        question.type === "text" &&
          !isStrategicQuestion &&
          "text-only-question",
        layout.cardStyle && `card-style-${layout.cardStyle}`,
        layout.spacing && `layout-${layout.spacing}`,
        layout.gridType &&
          layout.gridType !== "auto" &&
          `grid-${layout.gridType}`
      )}
      id={`question-${question.id}`}
      style={{
        ...cssVariables,
        backgroundColor: theme.backgroundColor,
      }}
    >
      {!hideTitle && (
        <>
          <h2
            className={cn(
              "font-playfair text-center mb-5 px-3 pt-3 font-semibold tracking-normal",
              isMobile ? "text-base" : "text-base sm:text-xl",
              isStrategicQuestion &&
                "strategic-question-title mb-6 font-bold whitespace-pre-line",
              isStrategicQuestion && isMobile && "text-[1.25rem] sm:text-2xl", // Texto maior para questões estratégicas em mobile
              question.type === "text" &&
                !isStrategicQuestion &&
                ".text-only-question & " &&
                "text-[1.15rem] sm:text-xl" // Texto maior para títulos em questões só texto
            )}
          >
            {highlightStrategicWords(question.title)}
          </h2>

          {isStrategicQuestion &&
            question.imageUrl &&
            !imageError &&
            showQuestionImage && (
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
        </>
      )}

      <div className="w-full">
        <StaggeredOptionAnimations
          questionId={question.id}
          isVisible={true}
          className={cn(
            "grid h-full",
            getGridColumns(),
            hasImageOptions && "mb-4 relative",
            isStrategicQuestion && "gap-4"
          )}
        >
          {question.options.map((option, index) => (
            <QuizOption
              key={option.id}
              option={option}
              isSelected={currentAnswers.includes(option.id)}
              onSelect={handleOptionSelect}
              type={question.type}
              questionId={question.id}
              isDisabled={
                // Questões estratégicas: desabilita outras opções quando uma está selecionada
                (isStrategicQuestion &&
                  currentAnswers.length > 0 &&
                  !currentAnswers.includes(option.id)) ||
                // Questões normais: desabilita quando já tem o limite de seleções e esta não está selecionada
                (!isStrategicQuestion &&
                  !currentAnswers.includes(option.id) &&
                  currentAnswers.length >= (question.multiSelect || 3))
              }
              isStrategicOption={isStrategicQuestion}
            />
          ))}
        </StaggeredOptionAnimations>
      </div>
    </div>
  );
};

export { QuizQuestion };
