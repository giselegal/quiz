
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizIntro from "@/components/QuizIntro";
import { QuizContent } from "@/components/QuizContent";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import { UserResponse } from "@/types/quiz";
import { StrategicQuestions } from "@/components/quiz/StrategicQuestions";
import QuizTransition from "@/components/QuizTransition";
import { storeUserForHotmart } from "@/utils/hotmartWebhook";
import { Button } from "@/components/ui/button";
import { Settings, Edit } from "lucide-react";
import {
  trackQuizStart,
  trackQuizAnswer,
  trackQuizComplete,
  trackResultView,
  trackButtonClick,
  trackPageView,
} from "../utils/analytics";

// Componente de acesso direto ao editor
const QuickEditorAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        onClick={() => navigate("/unified-editor")}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="sm"
      >
        <Edit className="w-4 h-4 mr-2" />
        Editor Completo
      </Button>
      <Button
        onClick={() => navigate("/modern-editor")}
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        size="sm"
      >
        <Settings className="w-4 h-4 mr-2" />
        Editor Moderno
      </Button>
    </div>
  );
};

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [user, setUser] = useState<{ userName: string } | null>(null);
  const [showingTransition, setShowingTransition] = useState(false);
  const [showingStrategicQuestions, setShowingStrategicQuestions] =
    useState(false);
  const [currentStrategicQuestionIndex, setCurrentStrategicQuestionIndex] =
    useState(0);

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
  } = useQuizLogic();

  // Store user data for Hotmart integration when quiz starts
  useEffect(() => {
    if (user?.userName) {
      storeUserForHotmart(user.userName, {
        name: user.userName,
        quizStarted: true,
        timestamp: Date.now(),
      });
    }
  }, [user?.userName]);

  // Track page view when component mounts
  useEffect(() => {
    trackPageView(window.location.pathname, {
      page_type: "quiz",
      page_name: "quiz-descubra-seu-estilo",
    });
  }, []);

  const handleStart = (userName: string) => {
    // Verificar se já não foi iniciado para evitar duplicação
    if (hasStarted || !userName || userName.trim() === '') {
      return;
    }

    setUser({ userName });
    setHasStarted(true);
    localStorage.setItem("userName", userName);

    // Track quiz start apenas uma vez
    try {
      trackQuizStart("quiz-descubra-seu-estilo", {
        user_name: userName,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao rastrear início do quiz:", error);
    }
  };

  const handleAnswerSubmit = (response: UserResponse) => {
    if (!response || !response.selectedOptions || response.selectedOptions.length === 0) {
      console.warn("Resposta inválida:", response);
      return;
    }

    try {
      if (showingStrategicQuestions) {
        handleStrategicAnswer(response.questionId, response.selectedOptions);

        // Track strategic question answer
        trackQuizAnswer(
          "quiz-descubra-seu-estilo",
          `strategic_${response.questionId}`,
          response.selectedOptions.join(", "),
          {
            question_type: "strategic",
            user_name: user?.userName || "unknown",
          }
        );
      } else {
        handleAnswer(response.questionId, response.selectedOptions);

        // Track regular question answer
        trackQuizAnswer(
          "quiz-descubra-seu-estilo",
          response.questionId,
          response.selectedOptions.join(", "),
          {
            question_type: "regular",
            user_name: user?.userName || "unknown",
          }
        );
      }
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
    }
  };

  const handleNextClick = () => {
    console.log("🔄 Navegação:", {
      showingStrategicQuestions,
      currentStrategicQuestionIndex,
      currentQuestionIndex,
      totalQuestions,
      showingTransition
    });

    try {
      if (showingStrategicQuestions) {
        if (currentStrategicQuestionIndex < 6) {
          setCurrentStrategicQuestionIndex((prev) => prev + 1);

          // Track navigation between strategic questions
          trackButtonClick(
            "strategic-next-button",
            "Próxima Pergunta Estratégica",
            "strategic-questions",
            {
              current_question: currentStrategicQuestionIndex,
              next_question: currentStrategicQuestionIndex + 1,
            }
          );
        } else {
          // Strategic questions completed, track completion and navigate to result
          trackQuizComplete("quiz-descubra-seu-estilo", {
            user_name: user?.userName || "unknown",
            total_questions: totalQuestions + 7, // Regular + strategic questions
            completion_time: new Date().toISOString(),
          });

          trackResultView("quiz-descubra-seu-estilo", "style-result", {
            user_name: user?.userName || "unknown",
          });

          console.log("✅ Quiz completo, navegando para resultado");
          navigate("/resultado");
        }
      } else {
        if (currentQuestionIndex < totalQuestions - 1) {
          handleNext();

          // Track navigation between regular questions
          trackButtonClick(
            "quiz-next-button",
            "Próxima Pergunta",
            "quiz-questions",
            {
              current_question: currentQuestionIndex,
              next_question: currentQuestionIndex + 1,
            }
          );
        } else {
          // Regular questions completed, show transition page first
          console.log("✅ Questões regulares completas, mostrando transição");
          setShowingTransition(true);

          trackButtonClick(
            "show-transition",
            "Mostrar Página de Transição",
            "quiz-transition",
            {
              regular_questions_completed: totalQuestions,
            }
          );
        }
      }
    } catch (error) {
      console.error("❌ Erro na navegação:", error);
    }
  };

  const handlePreviousClick = () => {
    if (showingStrategicQuestions && currentStrategicQuestionIndex > 0) {
      setCurrentStrategicQuestionIndex((prev) => prev - 1);

      trackButtonClick(
        "strategic-previous-button",
        "Pergunta Anterior Estratégica",
        "strategic-questions",
        {
          current_question: currentStrategicQuestionIndex,
          previous_question: currentStrategicQuestionIndex - 1,
        }
      );
    } else if (!showingStrategicQuestions) {
      handlePrevious();

      trackButtonClick(
        "quiz-previous-button",
        "Pergunta Anterior",
        "quiz-questions",
        {
          current_question: currentQuestionIndex,
          previous_question: currentQuestionIndex - 1,
        }
      );
    }
  };

  // Redirect to result if quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      navigate("/resultado");
    }
  }, [quizCompleted, navigate]);

  // Função para continuar da transição para as questões estratégicas
  const handleContinueFromTransition = () => {
    setShowingTransition(false);
    setShowingStrategicQuestions(true);
    setCurrentStrategicQuestionIndex(0);

    trackButtonClick(
      "transition-continue",
      "Continuar para Questões Estratégicas",
      "transition-page",
      {
        user_name: user?.userName || "unknown",
      }
    );
  };

  // Função para lidar com a primeira resposta estratégica na transição
  const handleTransitionAnswer = (response: UserResponse) => {
    handleStrategicAnswer(response.questionId, response.selectedOptions);

    trackQuizAnswer(
      "quiz-descubra-seu-estilo",
      `strategic_${response.questionId}`,
      response.selectedOptions.join(", "),
      {
        question_type: "strategic_transition",
        user_name: user?.userName || "unknown",
      }
    );
  };

  if (!isInitialLoadComplete) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <QuickEditorAccess />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#432818]">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <>
        <QuickEditorAccess />
        <QuizIntro onStart={handleStart} />
      </>
    );
  }

  if (showingTransition) {
    return (
      <>
        <QuickEditorAccess />
        <QuizTransition
          onContinue={handleContinueFromTransition}
          onAnswer={handleTransitionAnswer}
          currentAnswers={
            strategicAnswers["550e8400-e29b-41d4-a716-446655440012"] || []
          }
        />
      </>
    );
  }

  if (showingStrategicQuestions) {
    return (
      <>
        <QuickEditorAccess />
        <StrategicQuestions
          currentQuestionIndex={currentStrategicQuestionIndex}
          answers={strategicAnswers}
          onAnswer={handleAnswerSubmit}
        />
      </>
    );
  }

  return (
    <>
      <QuickEditorAccess />
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
        handlePrevious={handlePreviousClick}
      />
    </>
  );
};

export default QuizPage;
