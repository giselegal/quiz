
import { useState, useCallback, useEffect } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { QuizResult, StyleResult } from '../types/quiz';
import { preloadImages, preloadCriticalImages } from '../utils/imageManager';

export const useQuizLogic = () => {
  // 1. State declarations (all at the top)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [strategicAnswers, setStrategicAnswers] = useState<Record<string, string[]>>(() => {
    const savedAnswers = localStorage.getItem('strategicAnswers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(() => {
    const savedResult = localStorage.getItem('quizResult');
    return savedResult ? JSON.parse(savedResult) : null;
  });
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // 2. Computed values
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const nextQuestion = quizQuestions[currentQuestionIndex + 1] || null;
  const nextNextQuestion = quizQuestions[currentQuestionIndex + 2] || null;
  const currentAnswers = answers[currentQuestion?.id] || [];
  const canProceed = currentAnswers.length === (currentQuestion?.multiSelect || 0);
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const totalQuestions = quizQuestions.length;
  const allQuestions = quizQuestions;

  // Preload first question images on component mount
  useEffect(() => {
    // Collect all images from first question
    if (currentQuestion) {
      const firstQuestionImages = currentQuestion.options
        .map(option => {
          if (typeof option === 'string') return null;
          if (option.imageUrl) return option.imageUrl;
          return null;
        })
        .filter(Boolean) as string[];

      if (firstQuestionImages.length > 0) {
        // High priority preload for first question
        preloadImages(
          firstQuestionImages.map(url => ({ url, priority: 3 })),
          { 
            quality: 95,
            batchSize: 4,
            onComplete: () => {
              setIsInitialLoadComplete(true);
            }
          }
        );

        // Start preloading next question with lower priority
        if (nextQuestion) {
          const nextQuestionImages = nextQuestion.options
            .map(option => {
              if (typeof option === 'string') return null;
              if (option.imageUrl) return option.imageUrl;
              return null;
            })
            .filter(Boolean) as string[];

          if (nextQuestionImages.length > 0) {
            preloadImages(
              nextQuestionImages.map(url => ({ url, priority: 2 })),
              { quality: 95, batchSize: 2 }
            );
          }
        }
      } else {
        setIsInitialLoadComplete(true);
      }
    }
    
    // Also start preloading strategic images in the background
    preloadCriticalImages('strategic');
  }, []);

  // 3. Simple utility functions that don't depend on other functions
  const handleAnswer = useCallback((questionId: string, selectedOptions: string[]) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: selectedOptions
      };
      console.log(`Question ${questionId} answered with options:`, selectedOptions);
      return newAnswers;
    });
    
    // Preload next question images whenever an answer is provided
    if (nextQuestion) {
      const nextImages = nextQuestion.options
        .map(option => {
          if (typeof option === 'string') return null;
          if (option.imageUrl) return option.imageUrl;
          return null;
        })
        .filter(Boolean) as string[];

      if (nextImages.length > 0) {
        preloadImages(
          nextImages.map(url => ({ url, priority: 2 })),
          { quality: 95, batchSize: 3 }
        );
      }
      
      // Also start preloading next-next question with lower priority
      if (nextNextQuestion) {
        const nextNextImages = nextNextQuestion.options
          .map(option => {
            if (typeof option === 'string') return null;
            if (option.imageUrl) return option.imageUrl;
            return null;
          })
          .filter(Boolean) as string[];

        if (nextNextImages.length > 0) {
          preloadImages(
            nextNextImages.map(url => ({ url, priority: 1 })),
            { quality: 95, batchSize: 2 }
          );
        }
      }
    }
  }, [nextQuestion, nextNextQuestion]);

  const handleStrategicAnswer = useCallback((questionId: string, selectedOptions: string[]) => {
    setStrategicAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: selectedOptions
      };
      localStorage.setItem('strategicAnswers', JSON.stringify({
        ...prev,
        [questionId]: selectedOptions
      }));
      return newAnswers;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setQuizResult(null);
    localStorage.removeItem('quizResult');
    localStorage.removeItem('strategicAnswers');
    setStrategicAnswers({});
    console.log('Quiz reset');
  }, []);

  // 4. Complex function that others depend on
  const calculateResults = useCallback(() => {
    const styleCounter: Record<string, number> = {
      'Natural': 0,
      'Clássico': 0,
      'Contemporâneo': 0,
      'Elegante': 0,
      'Romântico': 0,
      'Sexy': 0,
      'Dramático': 0,
      'Criativo': 0
    };

    let totalSelections = 0;

    // Garantir que todas as respostas sejam contabilizadas
    Object.entries(answers).forEach(([questionId, optionIds]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (!question) return;

      optionIds.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId);
        if (option) {
          styleCounter[option.styleCategory]++;
          totalSelections++;
        }
      });
    });

    console.log('Style counts:', styleCounter);
    console.log('Total selections:', totalSelections);

    // Calcular resultados
    const styleResults: StyleResult[] = Object.entries(styleCounter)
      .map(([category, score]) => ({
        category: category as StyleResult['category'],
        score,
        percentage: totalSelections > 0 ? Math.round((score / totalSelections) * 100) : 0
      }))
      .sort((a, b) => b.score - a.score);

    const primaryStyle = styleResults[0];
    const secondaryStyles = styleResults.slice(1);

    const result = {
      primaryStyle,
      secondaryStyles,
      totalSelections
    };

    setQuizResult(result);
    // Save to localStorage immediately
    localStorage.setItem('quizResult', JSON.stringify(result));
    // Also save strategic answers
    localStorage.setItem('strategicAnswers', JSON.stringify(strategicAnswers));
    console.log('Results calculated and saved to localStorage:', result);

    // Begin preloading result page assets
    preloadImages([
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/antes_adriana_pmdn8y.webp",
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/depois_adriana_pmdn8y.webp",
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/antes_mariangela_cpugfj.webp",
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/depois_mariangela_cpugfj.webp"
    ], {
      quality: 95,
      batchSize: 2
    });

    return result;
  }, [answers, strategicAnswers]);

  // 5. Functions that depend on other complex functions
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, calculateResults, quizQuestions.length]);

  const submitQuizIfComplete = useCallback(() => {
    // Calculate final results
    const results = calculateResults();
    setQuizCompleted(true);
    
    // Save everything to localStorage before navigating
    localStorage.setItem('quizResult', JSON.stringify(results));
    localStorage.setItem('strategicAnswers', JSON.stringify(strategicAnswers));
    console.log('Results saved to localStorage before redirect:', results);
    
    return results;
  }, [calculateResults, strategicAnswers]);

  // 6. Side effects 
  useEffect(() => {
    if (quizResult) {
      localStorage.setItem('quizResult', JSON.stringify(quizResult));
      console.log('QuizResult saved to localStorage:', quizResult);
    }
  }, [quizResult]);

  useEffect(() => {
    if (Object.keys(strategicAnswers).length > 0) {
      localStorage.setItem('strategicAnswers', JSON.stringify(strategicAnswers));
      console.log('Strategic answers saved to localStorage:', strategicAnswers);
    }
  }, [strategicAnswers]);

  // 7. Return all needed functions and values
  return {
    currentQuestion,
    nextQuestion,
    currentQuestionIndex,
    currentAnswers,
    canProceed,
    isLastQuestion,
    quizCompleted,
    quizResult,
    handleAnswer,
    handleNext,
    handlePrevious,
    resetQuiz,
    submitQuizIfComplete,
    calculateResults,
    totalQuestions,
    strategicAnswers,
    handleStrategicAnswer,
    allQuestions,
    isInitialLoadComplete
  };
};
