import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizIntro from '@/components/QuizIntro';
import { QuizContent } from '@/components/QuizContent';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { UserResponse } from '@/types/quiz';
import { StrategicQuestions } from '@/components/quiz/StrategicQuestions';
import { storeUserForHotmart } from '@/utils/hotmartWebhook';
import QuizTransitionEffects from '@/components/quiz/QuizTransitionEffects';
import QuizTransition from '@/components/quiz/QuizTransition';
import QuizFinalTransition from '@/components/quiz/QuizFinalTransition';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [user, setUser] = useState<{ userName: string } | null>(null);
  const [showingStrategicQuestions, setShowingStrategicQuestions] = useState(false);
  const [currentStrategicQuestionIndex, setCurrentStrategicQuestionIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionType, setTransitionType] = useState<'question-change' | 'section-transition' | 'completion'>('question-change');
  const [showingTransitionPage, setShowingTransitionPage] = useState(false);
  const [showingFinalTransition, setShowingFinalTransition] = useState(false);

  const {
    currentQuestion,
    currentQuestionIndex,
    currentAnswers,
    handleAnswer,
    handleNext,
    handlePrevious,
    quizCompleted,
    strategicAnswers,
    handleStrategicAnswer,
    totalQuestions,
    isInitialLoadComplete,
    calculateResults
  } = useQuizLogic();

  // Store user data for Hotmart integration when quiz starts
  useEffect(() => {
    if (user?.userName) {
      storeUserForHotmart(user.userName, {
        name: user.userName,
        quizStarted: true,
        timestamp: Date.now()
      });
    }
  }, [user?.userName]);

  const handleStart = (userName: string) => {
    setUser({ userName });
    setHasStarted(true);
    localStorage.setItem('userName', userName);
  };

  const handleAnswerSubmit = (response: UserResponse) => {
    if (showingStrategicQuestions) {
      handleStrategicAnswer(response.questionId, response.selectedOptions);
    } else {
      handleAnswer(response.questionId, response.selectedOptions);
    }
  };

  const handleNextClick = () => {
    if (showingStrategicQuestions) {
      if (currentStrategicQuestionIndex < 6) {
        setCurrentStrategicQuestionIndex(prev => prev + 1);
      } else {
        // Strategic questions completed, calculate results and show final transition
        console.log("🎯 Questões estratégicas completas, calculando resultados");
        
        // Calculate and save results before showing transition
        const results = calculateResults();
        if (results) {
          localStorage.setItem('quizResult', JSON.stringify(results));
          console.log("Resultados salvos:", results);
          
          // Preload result page to speed up navigation
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = '/resultado';
          document.head.appendChild(link);
        }
        
        setShowingFinalTransition(true);
      }
    } else {
      if (currentQuestionIndex < 9) { // 0-9 são as 10 questões principais (índices 0-9)
        // Continue to next regular question
        handleNext();
      } else {
        // Regular questions completed (question index 9 = 10th question), show transition page
        console.log("🎯 10ª questão completa (índice 9), mostrando página de transição");
        setShowingTransitionPage(true);
      }
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    
    if (transitionType === 'question-change') {
      handleNext();
    } else if (transitionType === 'section-transition') {
      setShowingStrategicQuestions(true);
      setCurrentStrategicQuestionIndex(0);
    } else if (transitionType === 'completion') {
      navigate('/resultado');
    }
  };

  const handleTransitionPageContinue = () => {
    setShowingTransitionPage(false);
    setShowingStrategicQuestions(true);
    setCurrentStrategicQuestionIndex(0);
  };

  const handleFinalTransitionContinue = () => {
    window.location.href = "/resultado";
  };

  // Redirect to result if quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      setTransitionType('completion');
      setShowTransition(true);
    }
  }, [quizCompleted]);

  if (!isInitialLoadComplete) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#432818]">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return <QuizIntro onStart={handleStart} />;
  }

  if (showingTransitionPage) {
    return <QuizTransition onContinue={handleTransitionPageContinue} />;
  }

  if (showingFinalTransition) {
    return <QuizFinalTransition onContinue={handleFinalTransitionContinue} />;
  }

  if (showingFinalTransition) {
    return <QuizFinalTransition onContinue={handleFinalTransitionContinue} />;
  }

  if (showingStrategicQuestions) {
    return (
      <StrategicQuestions
        currentQuestionIndex={currentStrategicQuestionIndex}
        answers={strategicAnswers}
        onAnswer={handleAnswerSubmit}
        onNext={handleNextClick}
      />
    );
  }

  return (
    <>
      <QuizContent
        user={user}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        showingStrategicQuestions={showingStrategicQuestions}
        currentStrategicQuestionIndex={currentStrategicQuestionIndex}
        currentQuestion={currentQuestion}
        currentAnswers={currentAnswers}
        handleAnswerSubmit={handleAnswerSubmit}
        handleNextClick={handleNextClick}
        handlePrevious={handlePrevious}
      />
      
      <QuizTransitionEffects
        isVisible={showTransition}
        type={transitionType}
        onComplete={handleTransitionComplete}
      />
    </>
  );
};

export default QuizPage;
