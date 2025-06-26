import React from "react";
import { QuizQuestion } from "./QuizQuestion";
import { UserResponse, QuizQuestion as QuizQuestionType } from "@/types/quiz";
import { QuizHeader } from "./quiz/QuizHeader";
import { StrategicQuestions } from "./quiz/StrategicQuestions";
import QuizNavigation from "./quiz/QuizNavigation";

interface QuizContentProps {
  user: { userName: string } | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  showingStrategicQuestions: boolean;
  currentStrategicQuestionIndex: number;
  currentQuestion: QuizQuestionType;
  currentAnswers: string[];
  handleAnswerSubmit: (response: UserResponse) => void;
  handleNextClick: () => void;
  handlePrevious: () => void;
}

export const QuizContent: React.FC<QuizContentProps> = ({
  user,
  currentQuestionIndex,
  totalQuestions,
  showingStrategicQuestions,
  currentStrategicQuestionIndex,
  currentQuestion,
  currentAnswers,
  handleAnswerSubmit,
  handleNextClick,
  handlePrevious,
}) => {
  // Get user name from localStorage if not provided in props
  const userName = user?.userName || localStorage.getItem("userName") || "";

  // Determine the required selections based on question type
  const requiredSelections = showingStrategicQuestions ? 1 : (currentQuestion?.multiSelect || 3);

  // Check if we have enough selections to proceed
  const canProceed = currentAnswers?.length >= requiredSelections;

  // Determine question type for navigation component
  const currentQuestionType: "normal" | "strategic" = showingStrategicQuestions
    ? "strategic"
    : "normal";
  
  // Debug log for transition detection
  if (!showingStrategicQuestions && currentQuestionIndex === 9) {
    console.log("🎯 DEBUG: Na 10ª questão (índice 9), canProceed:", canProceed, "answers:", currentAnswers?.length);
  }

  // Check if it's the last question
  const isLastQuestion = showingStrategicQuestions
    ? currentStrategicQuestionIndex >= 6
    : currentQuestionIndex >= totalQuestions - 1;

  return (
    <>
      <QuizHeader
        userName={userName}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        showingStrategicQuestions={showingStrategicQuestions}
        currentStrategicQuestionIndex={currentStrategicQuestionIndex}
      />

      <div className="container mx-auto px-4 py-8 w-full max-w-5xl">
        {showingStrategicQuestions ? (
          <StrategicQuestions
            currentQuestionIndex={currentStrategicQuestionIndex}
            answers={
              showingStrategicQuestions
                ? currentAnswers.reduce((acc, optionId) => {
                    if (currentQuestion?.id) {
                      acc[currentQuestion.id] = [optionId];
                    }
                    return acc;
                  }, {})
                : {}
            }
            onAnswer={handleAnswerSubmit}
          />
        ) : (
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            currentAnswers={currentAnswers || []}
            showQuestionImage={true}
            isStrategicQuestion={false}
          />
        )}

        {/* Navigation Component */}
        <QuizNavigation
          canProceed={canProceed}
          onNext={handleNextClick}
          onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
          currentQuestionType={currentQuestionType}
          selectedOptionsCount={currentAnswers?.length || 0}
          isLastQuestion={isLastQuestion}
        />
      </div>
    </>
  );
};
