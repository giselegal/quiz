import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useQuizLogic } from '../hooks/useQuizLogic';
import { UserResponse } from '@/types/quiz';
import { toast } from './ui/use-toast';
import { QuizContainer } from './quiz/QuizContainer';
import { QuizContent } from './quiz/QuizContent';
import { QuizTransitionManager } from './quiz/QuizTransitionManager';
import QuizNavigation from './quiz/QuizNavigation';
import { strategicQuestions } from '@/data/strategicQuestions';
import { useAuth } from '../context/AuthContext';
import { trackQuizStart, trackQuizAnswer, trackQuizComplete, trackResultView } from '../utils/analytics';
import { preloadImages } from '@/utils/imageManager';
import LoadingManager from './quiz/LoadingManager';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage: React.FC = () => {
  // Get auth context
  const { user } = useAuth();
  
  // State declarations
  const [showingStrategicQuestions, setShowingStrategicQuestions] = useState(false);
  const [showingTransition, setShowingTransition] = useState(false);
  const [showingFinalTransition, setShowingFinalTransition] = useState(false);
  const [currentStrategicQuestionIndex, setCurrentStrategicQuestionIndex] = useState(0);
  const [strategicAnswers, setStrategicAnswers] = useState<Record<string, string[]>>({});
  const [quizStartTracked, setQuizStartTracked] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [pageIsReady, setPageIsReady] = useState(false);

  // Get quiz logic functions
  const {
    currentQuestion,
    nextQuestion,
    currentQuestionIndex,
    currentAnswers,
    isLastQuestion,
    handleAnswer,
    handleNext,
    handlePrevious,
    totalQuestions,
    calculateResults,
    handleStrategicAnswer: saveStrategicAnswer,
    submitQuizIfComplete,
    canProceed,
    allQuestions,
    isInitialLoadComplete
  } = useQuizLogic();

  // Set page as ready when initial load is complete
  useEffect(() => {
    if (isInitialLoadComplete) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setPageIsReady(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialLoadComplete]);

  // Calcular e atualizar a porcentagem de progresso
  useEffect(() => {
    const totalSteps = totalQuestions + strategicQuestions.length;
    let currentStep = 0;
    
    if (showingStrategicQuestions) {
      currentStep = totalQuestions + currentStrategicQuestionIndex;
    } else {
      currentStep = currentQuestionIndex;
    }
    
    const percentage = Math.round((currentStep / totalSteps) * 100);
    setProgressPercentage(percentage);
  }, [currentQuestionIndex, currentStrategicQuestionIndex, showingStrategicQuestions, totalQuestions]);

  // Track quiz start on component mount and save start time
  useEffect(() => {
    if (!quizStartTracked) {
      // Salvar o timestamp de início para calcular o tempo decorrido
      localStorage.setItem('quiz_start_time', Date.now().toString());
      
      // Obter informações do usuário, se disponível
      const userName = user?.userName || localStorage.getItem('userName') || 'Anônimo';
      // Obter o email do usuário se disponível, com segurança para tipos
      const userEmail = user?.email || localStorage.getItem('userEmail');
      
      trackQuizStart(userName, userEmail);
      setQuizStartTracked(true);
      
      console.log('Quiz iniciado por', userName, userEmail ? `(${userEmail})` : '');
    }
  }, [quizStartTracked, user]);

  // Handle strategic answer with improved image preloading
  const handleStrategicAnswer = useCallback((response: UserResponse) => {
    try {
      setStrategicAnswers(prev => ({
        ...prev,
        [response.questionId]: response.selectedOptions
      }));
      
      saveStrategicAnswer(response.questionId, response.selectedOptions);
      
      // Track strategic answer with additional progress info
      trackQuizAnswer(
        response.questionId, 
        response.selectedOptions,
        currentStrategicQuestionIndex + totalQuestions,
        totalQuestions + strategicQuestions.length
      );
      
      // Calculate completion percentage for funnel tracking
      const currentProgress = ((currentStrategicQuestionIndex + totalQuestions + 1) / 
                              (totalQuestions + strategicQuestions.length)) * 100;
      
      // Track funnel milestone if this is approximately halfway through
      if (currentProgress >= 45 && currentProgress <= 55) {
        trackQuizAnswer('quiz_middle_point', ['reached'], 
                       currentStrategicQuestionIndex + totalQuestions,
                       totalQuestions + strategicQuestions.length);
      }
      
      if (currentStrategicQuestionIndex === strategicQuestions.length - 1) {
        setShowingFinalTransition(true);
        // Track quiz completion
        trackQuizComplete();
      } else {
        // Preload next strategic question with higher priority
        const nextIndex = currentStrategicQuestionIndex + 1;
        if (nextIndex < strategicQuestions.length) {
          const nextQuestion = strategicQuestions[nextIndex];
          
          // Pré-carregar a próxima questão estratégica imediatamente com alta prioridade
          if (nextQuestion.imageUrl) {
            preloadImages([{ 
              src: nextQuestion.imageUrl, 
              id: `strategic-${nextIndex}`,
              category: 'strategic',
              tags: [],
              alt: `Question ${nextIndex}`,
              preloadPriority: 5 // Prioridade aumentada
            }], { quality: 90 }); // Qualidade ligeiramente reduzida para carregamento mais rápido
          }
          
          // Pré-carregar também as imagens das opções da próxima questão
          const optionImages = nextQuestion.options
            .map(option => option.imageUrl)
            .filter(Boolean) as string[];
            
          if (optionImages.length > 0) {
            preloadImages(optionImages.map((src, i) => ({ 
              src, 
              id: `strategic-${nextIndex}-option-${i}`,
              category: 'strategic',
              tags: ['option'],
              alt: `Option ${i}`,
              preloadPriority: 4
            })), { quality: 85, batchSize: 3 });
          }
          
          // Também pré-carregar a questão depois da próxima com prioridade mais baixa
          if (nextIndex + 1 < strategicQuestions.length) {
            const nextNextQuestion = strategicQuestions[nextIndex + 1];
            if (nextNextQuestion.imageUrl) {
              preloadImages([{ 
                src: nextNextQuestion.imageUrl,
                id: `strategic-${nextIndex+1}`,
                category: 'strategic',
                tags: [],
                alt: `Question ${nextIndex+1}`,
                preloadPriority: 2
              }], { quality: 85 });
            }
          }
        }
        
        setCurrentStrategicQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Erro no processamento da resposta",
        description: "Não foi possível processar sua resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [currentStrategicQuestionIndex, saveStrategicAnswer, totalQuestions]);

  // Handle answer submission
  const handleAnswerSubmit = useCallback((response: UserResponse) => {
    try {
      handleAnswer(response.questionId, response.selectedOptions);
      
      // Track answer submission with more detailed info
      trackQuizAnswer(
        response.questionId, 
        response.selectedOptions, 
        currentQuestionIndex, 
        totalQuestions
      );
      
      // Calculate completion percentage for funnel tracking
      const currentProgress = ((currentQuestionIndex + 1) / 
                              (totalQuestions + strategicQuestions.length)) * 100;
      
      // Track funnel milestone if this is approximately halfway through the main questions
      if (currentProgress >= 20 && currentProgress <= 30) {
        trackQuizAnswer('quiz_first_quarter', ['reached'], 
                       currentQuestionIndex,
                       totalQuestions + strategicQuestions.length);
      }
    } catch (error) {
      toast({
        title: "Erro na submissão da resposta",
        description: "Não foi possível processar sua resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [currentQuestionIndex, handleAnswer, totalQuestions]);

  // Handle showing result
  const handleShowResult = useCallback(() => {
    try {
      const results = submitQuizIfComplete();
      localStorage.setItem('strategicAnswers', JSON.stringify(strategicAnswers));
      
      if (results?.primaryStyle) {
        // Track result view with primary style
        trackResultView(results.primaryStyle.category);
      }
      
      window.location.href = '/resultado';
    } catch (error) {
      toast({
        title: "Erro ao mostrar resultado",
        description: "Não foi possível carregar o resultado. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [strategicAnswers, submitQuizIfComplete]);

  // Handle next click
  const handleNextClick = useCallback(() => {
    if (!isLastQuestion) {
      handleNext();
    } else {
      calculateResults();
      setShowingTransition(true);
      // Track quiz main part completion with more context
      trackQuizAnswer(
        "quiz_main_complete", 
        ["completed"], 
        totalQuestions, 
        totalQuestions + strategicQuestions.length
      );
    }
  }, [calculateResults, handleNext, isLastQuestion, totalQuestions]);

  // Determine if we can proceed based on the question type and selected answers
  const getCurrentCanProceed = useCallback(() => {
    if (!currentQuestion) return false;
    
    const requiredSelections = currentQuestion.multiSelect || 1;
    const currentAnswersLength = currentAnswers?.length || 0;
    
    return currentAnswersLength >= requiredSelections;
  }, [currentAnswers?.length, currentQuestion]);

  return (
    <LoadingManager isLoading={!pageIsReady} useQuizIntroLoading={true}>
      <div className="relative">
        {/* Barra de progresso */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-[#b29670]"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        
        <QuizContainer>
          <AnimatePresence mode="wait">
            {showingTransition || showingFinalTransition ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <QuizTransitionManager
                  showingTransition={showingTransition}
                  showingFinalTransition={showingFinalTransition}
                  handleStrategicAnswer={handleStrategicAnswer}
                  strategicAnswers={strategicAnswers}
                  handleShowResult={handleShowResult}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                
                {/* Botões de navegação centralizados apenas aqui para evitar duplicação */}
                <QuizNavigation
                  key={`nav-${currentQuestionIndex}-${currentStrategicQuestionIndex}`}
                  currentQuestionType={showingStrategicQuestions ? 'strategic' : 'normal'}
                  selectedOptionsCount={currentAnswers?.length || 0}
                  isLastQuestion={isLastQuestion}
                  onNext={handleNextClick}
                  onPrevious={handlePrevious}
                  canProceed={canProceed}
                  requiredOptionsCount={currentQuestion?.multiSelect || 3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </QuizContainer>
      </div>
    </LoadingManager>
  );
};

export default QuizPage;
