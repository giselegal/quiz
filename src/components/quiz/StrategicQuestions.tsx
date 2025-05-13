import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../QuizQuestion';
import { UserResponse } from '@/types/quiz';
import { strategicQuestions } from '@/data/strategicQuestions';
import { AnimatedWrapper } from '../ui/animated-wrapper';
import { preloadImagesByUrls, preloadCriticalImages } from '@/utils/imageManager';

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
  const preloadingRef = useRef(false);
  
  const currentQuestion = strategicQuestions[currentQuestionIndex];
  const currentAnswers = currentQuestion ? (answers[currentQuestion.id] || []) : [];
  
  // Obter a próxima questão para pré-carregar
  const nextIndex = currentQuestionIndex + 1;
  const nextQuestion = nextIndex < strategicQuestions.length ? strategicQuestions[nextIndex] : null;
  
  // Preload strategic images efficiently
  useEffect(() => {
    if (!imagesPreloaded && !preloadingRef.current) {
      preloadingRef.current = true;
      
      // Primeiro, carregue a questão atual com alta prioridade
      if (currentQuestion?.imageUrl) {
        preloadImagesByUrls([currentQuestion.imageUrl], {
          quality: 85,
          batchSize: 1,
          onComplete: () => {
            console.log('Current strategic question image loaded');
            
            // Depois, pré-carregar a próxima questão com prioridade média
            if (nextQuestion?.imageUrl) {
              preloadImagesByUrls([nextQuestion.imageUrl], {
                quality: 75,
                batchSize: 1,
                onComplete: () => {
                  console.log('Next strategic question image loaded');
                  
                  // Por fim, carregar outras imagens estratégicas em segundo plano
                  preloadCriticalImages('strategic');
                  setImagesPreloaded(true);
                  preloadingRef.current = false;
                }
              });
            } else {
              // Não há próxima questão, apenas carregue as imagens críticas
              preloadCriticalImages('strategic');
              setImagesPreloaded(true);
              preloadingRef.current = false;
            }
          }
        });
      } else {
        // Não há imagem na questão atual, pré-carregar outras imagens estratégicas
        preloadCriticalImages('strategic');
        setImagesPreloaded(true);
        preloadingRef.current = false;
      }
    }
  }, [currentQuestion, nextQuestion, imagesPreloaded]);
  
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
        autoAdvance={true}
      />
    </AnimatedWrapper>
  );
};
