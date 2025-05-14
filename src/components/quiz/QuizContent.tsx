
import React, { useEffect } from 'react';
import { QuizQuestion } from '../QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { QuizHeader } from './QuizHeader';
import { StrategicQuestions } from './StrategicQuestions';

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
  
  // Log importante para depuração
  useEffect(() => {
    console.log(`QuizContent renderizado - Questão atual(id=${currentQuestion?.id}, type=${currentQuestion?.type}), respostas: ${currentAnswers?.length || 0}, isStrategic: ${showingStrategicQuestions}`);
  }, [currentQuestion, currentAnswers, showingStrategicQuestions]);
  
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
            autoAdvance={true} // Questões normais sempre usam autoAdvance
          />
        )}
        
        {/* A navegação agora é exibida apenas no QuizPage para evitar duplicação */}
      </div>
    </>
  );
};
