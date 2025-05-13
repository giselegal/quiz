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
    // canProceed: canProceedFromLogic, // Removido para evitar confusão
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

  // Define a questão atual com base no tipo (normal ou estratégica)
  const actualCurrentQuestionData = showingStrategicQuestions
    ? strategicQuestions[currentStrategicQuestionIndex]
    : currentQuestion;

  // Determina o tipo da questão para navegação
  const currentQuestionTypeForNav = showingStrategicQuestions ? 'strategic' : 'normal';
  
  // Calcula as opções requeridas com base na questão atual
  // Fallback para 1 para estratégicas, 3 para normais, se multiSelect não estiver definido
  const calculatedRequiredOptions = actualCurrentQuestionData?.multiSelect || (showingStrategicQuestions ? 1 : 3);

  let determinedCanProceed;
  let finalSelectedCountForNav; // Usado para QuizNavigation e logs

  if (showingStrategicQuestions) {
      // Para questões estratégicas, usa a contagem de strategicAnswers
      const strategicQuestionId = actualCurrentQuestionData?.id;
      const currentStrategicSelectedCount = strategicQuestionId ? (strategicAnswers[strategicQuestionId]?.length || 0) : 0;
      finalSelectedCountForNav = currentStrategicSelectedCount;
      
      console.log(`[QuizPage] Cálculo Strategic CanProceed - ID: ${strategicQuestionId}, Selecionadas (strategicAnswers): ${currentStrategicSelectedCount}, Requeridas: ${calculatedRequiredOptions}, Resultado: ${currentStrategicSelectedCount >= calculatedRequiredOptions}`);
      determinedCanProceed = currentStrategicSelectedCount >= calculatedRequiredOptions;
  } else { // Questões Normais
      // Para questões normais, usa a contagem de currentAnswers
      const currentNormalSelectedCount = currentAnswers?.length || 0;
      finalSelectedCountForNav = currentNormalSelectedCount;

      console.log(`[QuizPage] Cálculo Normal CanProceed - ID: ${actualCurrentQuestionData?.id}, Selecionadas (currentAnswers): ${currentNormalSelectedCount}, Requeridas: ${calculatedRequiredOptions}, Resultado: ${currentNormalSelectedCount === calculatedRequiredOptions}`);
      determinedCanProceed = currentNormalSelectedCount === calculatedRequiredOptions;
  }

  console.log('[QuizPage] Props para QuizNavigation:', {
    currentQuestionId: actualCurrentQuestionData?.id,
    currentQuestionTypeForNav,
    currentSelectedCountForNav: finalSelectedCountForNav,
    calculatedRequiredOptions,
    finalCanProceedForNav: determinedCanProceed,
  });

  // Render QuizNavigation
  const renderQuizNavigation = () => (
    <QuizNavigation
      canProceed={determinedCanProceed}
      onNext={
        showingStrategicQuestions && actualCurrentQuestionData
          ? () => handleStrategicAnswer({
              questionId: actualCurrentQuestionData.id,
              selectedOptions: strategicAnswers[actualCurrentQuestionData.id] || []
            })
          : handleNextClick
      }
      onPrevious={
        showingStrategicQuestions
          ? () => setCurrentStrategicQuestionIndex(prev => Math.max(0, prev - 1))
          : handlePrevious
      }
      currentQuestionType={currentQuestionTypeForNav}
      selectedOptionsCount={finalSelectedCountForNav}
      isLastQuestion={
        showingStrategicQuestions
          ? currentStrategicQuestionIndex === strategicQuestions.length - 1
          : isLastQuestion // Usar a prop isLastQuestion do useQuizLogic para questões normais
      }
      requiredOptionsCount={calculatedRequiredOptions}
    />
  );

  // DEBUG: Informações visuais temporárias
  const renderDebugInfo = () => {
    // TEMPORARIAMENTE REMOVIDA A CONDIÇÃO PARA TESTE:
    // if (showingStrategicQuestions) {
    //   return null; 
    // }
    return (
      <div style={{ position: 'fixed', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', zIndex: 9999, fontSize: '12px', borderRadius: '5px' }}>
        <p>DEBUG INFO (Visível Sempre):</p>
        <p>- ID Questão Atual: {actualCurrentQuestionData?.id || 'N/A'}</p>
        <p>- Opções Selecionadas (currentAnswers): {currentAnswers?.length || 0}</p>
        <p>- Opções Requeridas (calculatedRequiredOptions): {calculatedRequiredOptions}</p>
        <p>- Pode Prosseguir (determinedCanProceed): {determinedCanProceed ? 'SIM' : 'NÃO'}</p>
        <p>- Tipo Questão p/ Nav (currentQuestionTypeForNav): {currentQuestionTypeForNav}</p>
        <p>- Contagem p/ Nav (finalSelectedCountForNav): {finalSelectedCountForNav}</p>
        <p>- Showing Strategic Qs: {showingStrategicQuestions ? 'SIM' : 'NÃO'}</p>
      </div>
    );
  };

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
                {renderQuizNavigation()}
              </motion.div>
            )}
          </AnimatePresence>
        </QuizContainer>
        {/* DEBUG: Renderiza as informações de depuração */}
        {renderDebugInfo()}
      </div>
    </LoadingManager>
  );
};

export default QuizPage;
