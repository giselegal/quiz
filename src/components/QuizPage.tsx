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
  const { user } = useAuth();
  
  const [showingStrategicQuestions, setShowingStrategicQuestions] = useState(false);
  const [showingTransition, setShowingTransition] = useState(false);
  const [showingFinalTransition, setShowingFinalTransition] = useState(false);
  const [currentStrategicQuestionIndex, setCurrentStrategicQuestionIndex] = useState(0);
  const [strategicAnswers, setStrategicAnswers] = useState<Record<string, string[]>>({});
  const [quizStartTracked, setQuizStartTracked] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [pageIsReady, setPageIsReady] = useState(false);

  const {
    currentQuestion,
    // nextQuestion, // Não usado diretamente aqui após refatoração
    currentQuestionIndex,
    currentAnswers,
    isLastQuestion,
    handleAnswer,
    handleNext, // Original handleNext from useQuizLogic
    handlePrevious,
    totalQuestions,
    calculateResults,
    handleStrategicAnswer: saveStrategicAnswer,
    submitQuizIfComplete,
    // allQuestions, // Não usado diretamente aqui
    isInitialLoadComplete
  } = useQuizLogic();

  useEffect(() => {
    if (isInitialLoadComplete) {
      const timer = setTimeout(() => {
        setPageIsReady(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoadComplete]);

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

  useEffect(() => {
    if (!quizStartTracked) {
      localStorage.setItem('quiz_start_time', Date.now().toString());
      const userName = user?.userName || localStorage.getItem('userName') || 'Anônimo';
      const userEmail = user?.email || localStorage.getItem('userEmail');
      trackQuizStart(userName, userEmail);
      setQuizStartTracked(true);
      // console.log('Quiz iniciado por', userName, userEmail ? `(${userEmail})` : '');
    }
  }, [quizStartTracked, user]);

  const actualCurrentQuestionData = showingStrategicQuestions
    ? strategicQuestions[currentStrategicQuestionIndex]
    : currentQuestion;

  const calculatedRequiredOptions = actualCurrentQuestionData?.multiSelect !== undefined 
    ? actualCurrentQuestionData.multiSelect 
    : (showingStrategicQuestions ? 1 : 3);

  const handleStrategicAnswerInternal = useCallback((response: UserResponse) => {
    try {
      setStrategicAnswers(prev => ({
        ...prev,
        [response.questionId]: response.selectedOptions
      }));
      saveStrategicAnswer(response.questionId, response.selectedOptions);
      trackQuizAnswer(
        response.questionId, 
        response.selectedOptions,
        currentStrategicQuestionIndex + totalQuestions,
        totalQuestions + strategicQuestions.length
      );
      const currentProgress = ((currentStrategicQuestionIndex + totalQuestions + 1) / 
                              (totalQuestions + strategicQuestions.length)) * 100;
      if (currentProgress >= 45 && currentProgress <= 55) {
        trackQuizAnswer('quiz_middle_point', ['reached'], 
                       currentStrategicQuestionIndex + totalQuestions,
                       totalQuestions + strategicQuestions.length);
      }
      if (currentStrategicQuestionIndex === strategicQuestions.length - 1) {
        setShowingFinalTransition(true);
        trackQuizComplete();
      } else {
        const nextIndex = currentStrategicQuestionIndex + 1;
        if (nextIndex < strategicQuestions.length) {
          const nextQuestionData = strategicQuestions[nextIndex];
          if (nextQuestionData.imageUrl) {
            preloadImages([{ 
              src: nextQuestionData.imageUrl, 
              id: `strategic-${nextIndex}`,
              category: 'strategic',
              tags: [],
              alt: `Question ${nextIndex}`,
              preloadPriority: 5 
            }], { quality: 90 });
          }
          const optionImages = nextQuestionData.options
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
        title: "Erro no processamento da resposta estratégica",
        description: "Não foi possível processar sua resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [currentStrategicQuestionIndex, saveStrategicAnswer, totalQuestions, strategicQuestions.length]); // Adicionado strategicQuestions.length

  const handleAnswerSubmitInternal = useCallback((response: UserResponse) => { // Renomeado
    try {
      handleAnswer(response.questionId, response.selectedOptions);
      trackQuizAnswer(
        response.questionId, 
        response.selectedOptions, 
        currentQuestionIndex, 
        totalQuestions
      );
      const currentProgress = ((currentQuestionIndex + 1) / 
                              (totalQuestions + strategicQuestions.length)) * 100;
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
  }, [currentQuestionIndex, handleAnswer, totalQuestions, strategicQuestions.length]); // Adicionado strategicQuestions.length

  const handleShowResult = useCallback(() => {
    try {
      const results = submitQuizIfComplete();
      localStorage.setItem('strategicAnswers', JSON.stringify(strategicAnswers));
      if (results?.primaryStyle) {
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

  const handleNextClickInternal = useCallback(() => {
    if (!showingStrategicQuestions) {
      const currentNormalSelectedCount = currentAnswers?.length || 0;
      const canActuallyProceed = currentNormalSelectedCount === calculatedRequiredOptions;

      if (!canActuallyProceed) {
        toast({
          title: "Seleção incompleta",
          description: `Por favor, selecione ${calculatedRequiredOptions} ${calculatedRequiredOptions === 1 ? 'opção' : 'opções'} para continuar.`,
          variant: "default",
        });
        return; 
      }
    }

    if (!isLastQuestion) {
      handleNext(); 
    } else {
      calculateResults();
      setShowingTransition(true); 
      trackQuizAnswer(
        "quiz_main_complete", 
        ["completed"], 
        totalQuestions, 
        totalQuestions + strategicQuestions.length
      );
    }
  }, [
    showingStrategicQuestions, 
    currentAnswers, 
    calculatedRequiredOptions, 
    isLastQuestion, 
    handleNext, 
    calculateResults, 
    totalQuestions,
    strategicQuestions.length // Adicionado strategicQuestions.length
  ]);
  
  const currentQuestionTypeForNav = showingStrategicQuestions ? 'strategic' : 'normal';
  
  let finalSelectedCountForNav: number;
  let actualCanProceed: boolean; 
  let visualCanProceedButton: boolean;

  if (showingStrategicQuestions) {
    const strategicQuestionId = actualCurrentQuestionData?.id;
    const currentStrategicSelectedCount = strategicQuestionId ? (strategicAnswers[strategicQuestionId]?.length || 0) : 0;
    finalSelectedCountForNav = currentStrategicSelectedCount;
    actualCanProceed = currentStrategicSelectedCount >= calculatedRequiredOptions;
    visualCanProceedButton = actualCanProceed; 
  } else { 
    const currentNormalSelectedCount = currentAnswers?.length || 0;
    finalSelectedCountForNav = currentNormalSelectedCount;
    actualCanProceed = currentNormalSelectedCount === calculatedRequiredOptions;

    if (calculatedRequiredOptions >= 3) { // Verifica se calculatedRequiredOptions é um número
         visualCanProceedButton = currentNormalSelectedCount >= 3;
    } else {
        visualCanProceedButton = currentNormalSelectedCount >= calculatedRequiredOptions;
    }
  }

  const renderQuizNavigation = () => (
    <QuizNavigation
      canProceed={visualCanProceedButton} 
      onNext={
        showingStrategicQuestions && actualCurrentQuestionData
          ? () => handleStrategicAnswerInternal({ 
              questionId: actualCurrentQuestionData.id,
              selectedOptions: strategicAnswers[actualCurrentQuestionData.id] || []
            })
          : handleNextClickInternal 
      }
      onPrevious={
        showingStrategicQuestions
          ? () => setCurrentStrategicQuestionIndex(prev => Math.max(0, prev - 1))
          : handlePrevious
      }
      currentQuestionType={currentQuestionTypeForNav}
      selectedOptionsCount={finalSelectedCountForNav}
      isLastQuestion={
        showingStrategicQuestions &&
        currentStrategicQuestionIndex === strategicQuestions.length - 1
      }
      requiredOptionsCount={calculatedRequiredOptions}
    />
  );

  const renderDebugInfo = () => {
    // Comentado para não poluir a tela, mas pode ser reativado para debug
    /*
    return (
      <div style={{ position: 'fixed', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', zIndex: 9999, fontSize: '12px', borderRadius: '5px' }}>
        <p>DEBUG INFO:</p>
        <p>- ID Questão: {actualCurrentQuestionData?.id || 'N/A'}</p>
        <p>- Tipo: {currentQuestionTypeForNav}</p>
        <p>- Selecionadas: {finalSelectedCountForNav}</p>
        <p>- Requeridas: {calculatedRequiredOptions}</p>
        <p>- Pode Avançar (Real): {actualCanProceed ? 'SIM' : 'NÃO'}</p>
        <p>- Botão Ativo (Visual): {visualCanProceedButton ? 'SIM' : 'NÃO'}</p>
        <p>- Showing Strategic: {showingStrategicQuestions ? 'SIM' : 'NÃO'}</p>
      </div>
    );
    */
    return null;
  };

  return (
    <LoadingManager isLoading={!pageIsReady} useQuizIntroLoading={true}>
      <div className="relative">
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
                  handleStrategicAnswer={handleStrategicAnswerInternal} 
                  strategicAnswers={strategicAnswers}
                  handleShowResult={handleShowResult}
                />
              </motion.div>
            ) : (
              actualCurrentQuestionData && ( 
                <motion.div
                  key={actualCurrentQuestionData.id || 'content'} 
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
                    currentQuestion={actualCurrentQuestionData} 
                    currentAnswers={showingStrategicQuestions && actualCurrentQuestionData.id ? strategicAnswers[actualCurrentQuestionData.id] || [] : currentAnswers}
                    handleAnswerSubmit={showingStrategicQuestions ? handleStrategicAnswerInternal : handleAnswerSubmitInternal}
                    handleNextClick={handleNextClickInternal} 
                    handlePrevious={handlePrevious} 
                  />
                  {renderQuizNavigation()}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </QuizContainer>
        {renderDebugInfo()}
      </div>
    </LoadingManager>
  );
};

export default QuizPage;
