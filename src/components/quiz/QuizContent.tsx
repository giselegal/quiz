
import React from 'react';
import { QuizQuestion } from '../QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { QuizHeader } from './QuizHeader';
import { StrategicQuestions } from './StrategicQuestions';
import QuizNavigation from './QuizNavigation';

interface QuizContentProps {
  user: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  showingStrategicQuestions: boolean;
  currentStrategicQuestionIndex: number;
  currentQuestion: any;
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
  const userName = user?.userName || localStorage.getItem('userName') || '';
  
  // Determine the required selections based on question type
  const requiredSelections = showingStrategicQuestions ? 1 : (currentQuestion?.multiSelect || 3);
  
  // Check if we have enough selections to proceed
  const canProceed = currentAnswers?.length >= requiredSelections;
  
  // Log important state for debugging
  console.log(`QuizContent - currentQuestion: ${currentQuestion?.id}, answers: ${currentAnswers?.length || 0}, isStrategic: ${showingStrategicQuestions}, canProceed: ${canProceed}`);
  
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
            answers={{
              [currentQuestion?.id]: currentAnswers || [] // Garantir que as respostas atuais são passadas
            }}
            onAnswer={handleAnswerSubmit}
            onNextClick={handleNextClick}
          />
        ) : (
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            currentAnswers={currentAnswers || []}
            showQuestionImage={true}
            onPreviousClick={handlePrevious}
            isStrategicQuestion={false}
          />
        )}

        {/* Usar apenas um componente de navegação unificado */}
        {!showingStrategicQuestions && (
          <QuizNavigation
            canProceed={canProceed}
            onNext={handleNextClick}
            onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
            currentQuestionType="normal"
            selectedOptionsCount={currentAnswers?.length || 0}
            isLastQuestion={currentQuestionIndex === totalQuestions - 1}
            requiredOptionsCount={requiredSelections}
          />
        )}
      </div>
    </>
  );
};
