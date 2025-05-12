import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { strategicQuestions } from '@/data/strategicQuestions';
import { AnimatedWrapper } from '../ui/animated-wrapper';
import { preloadCriticalImages } from '@/utils/imageManager';
import OptimizedImage from '../ui/OptimizedImage';

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
  
  console.log('Rendering strategic question:', strategicQuestions[currentQuestionIndex]?.id);
  console.log('Question has image:', !!strategicQuestions[currentQuestionIndex]?.imageUrl);
  
  // Preload strategic images on first render
  useEffect(() => {
    if (!imagesPreloaded) {
      preloadCriticalImages('strategic');
      setImagesPreloaded(true);
    }
  }, [imagesPreloaded]);
  
  // Remount component when question changes to ensure clean state
  useEffect(() => {
    setMountKey(Date.now());
  }, [currentQuestionIndex]);

  if (currentQuestionIndex >= strategicQuestions.length) return null;

  return (
    <AnimatedWrapper key={mountKey}>
      <QuizQuestion
        question={strategicQuestions[currentQuestionIndex]}
        onAnswer={onAnswer}
        currentAnswers={answers[strategicQuestions[currentQuestionIndex].id] || []}
        autoAdvance={false}
        onNextClick={onNextClick} 
        showQuestionImage={true}
        isStrategicQuestion={true}
      />
    </AnimatedWrapper>
  );
};
