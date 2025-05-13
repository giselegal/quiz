
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { strategicQuestions } from '@/data/strategicQuestions';
import { AnimatedWrapper } from '../ui/animated-wrapper';
import { preloadCriticalImages } from '@/utils/imageManager';
import QuizNavigation from './QuizNavigation';

interface StrategicQuestionsProps {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  onAnswer: (response: UserResponse) => void;
  onNextClick?: () => void;
}

export const StrategicQuestions: React.FC<StrategicQuestionsProps> = ({
  currentQuestionIndex,
  answers,
  onAnswer,
  onNextClick
}) => {
  const [mountKey, setMountKey] = useState(Date.now());
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  
  const currentQuestion = strategicQuestions[currentQuestionIndex];
  const currentAnswers = currentQuestion ? (answers[currentQuestion.id] || []) : [];
  const canProceed = currentAnswers.length >= 1; // Questões estratégicas requerem apenas 1 seleção
  
  console.log('Rendering strategic question:', currentQuestion?.id);
  console.log('Current answers for strategic question:', currentAnswers);
  console.log('Question has image:', !!currentQuestion?.imageUrl);
  
  // Preload strategic images on first render
  useEffect(() => {
    if (!imagesPreloaded) {
      console.log('Preloading strategic images...');
      preloadCriticalImages('strategic');
      setImagesPreloaded(true);
    }
  }, [imagesPreloaded]);
  
  // Remount component when question changes to ensure clean state
  useEffect(() => {
    setMountKey(Date.now());
  }, [currentQuestionIndex]);

  if (currentQuestionIndex >= strategicQuestions.length) {
    console.error('Strategic question index out of bounds:', currentQuestionIndex, 'max:', strategicQuestions.length - 1);
    return <div>Erro: Questão estratégica não encontrada.</div>;
  }

  if (!currentQuestion) {
    console.error('Strategic question not found for index:', currentQuestionIndex);
    return <div>Erro: Dados da questão estratégica ausentes.</div>;
  }

  return (
    <AnimatedWrapper key={mountKey}>
      <QuizQuestion
        question={currentQuestion}
        onAnswer={onAnswer}
        currentAnswers={currentAnswers}
        showQuestionImage={true}
        isStrategicQuestion={true}
      />
      
      {/* Navegação das questões estratégicas */}
      <QuizNavigation
        canProceed={canProceed}
        onNext={onNextClick || (() => {})}
        currentQuestionType="strategic"
        selectedOptionsCount={currentAnswers.length}
        requiredOptionsCount={1}
        isLastQuestion={currentQuestionIndex === strategicQuestions.length - 1}
      />
    </AnimatedWrapper>
  );
};
