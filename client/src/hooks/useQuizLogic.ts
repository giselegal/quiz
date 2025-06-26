import { useState, useCallback, useEffect } from "react";
import { quizQuestions } from "../data/quizQuestions";
import { QuizResult, StyleResult } from "../types/quiz";
import {
  preloadImagesByUrls,
  preloadCriticalImages,
} from "../utils/imageManager";

export const useQuizLogic = () => {
  console.log("useQuizLogic: Hook inicializado");

  // 1. State declarations (all at the top)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [strategicAnswers, setStrategicAnswers] = useState<
    Record<string, string[]>
  >({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(() => {
    const savedResult = localStorage.getItem("quizResult");
    return savedResult ? JSON.parse(savedResult) : null;
  });
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  console.log("useQuizLogic: Estados inicializados", {
    currentQuestionIndex,
    isInitialLoadComplete,
    totalQuestions: quizQuestions.length,
  });

  // 2. Computed values
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const nextQuestion = quizQuestions[currentQuestionIndex + 1] || null;
  const nextNextQuestion = quizQuestions[currentQuestionIndex + 2] || null;
  const currentAnswers = answers[currentQuestion?.id] || [];
  const canProceed =
    currentAnswers.length === (currentQuestion?.multiSelect || 0);
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const totalQuestions = quizQuestions.length;
  const allQuestions = quizQuestions;

  // Preload first question images on component mount
  useEffect(() => {
    console.log(
      "useQuizLogic: useEffect executado, currentQuestion:",
      currentQuestion
    );

    // Set a safety timeout to ensure loading completes even if images fail
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout: Setting initial load complete");
      setIsInitialLoadComplete(true);
    }, 1000); // Reduzido para 1 segundo para teste

    // Simplificação temporária: sempre completar o carregamento
    console.log(
      "useQuizLogic: Definindo isInitialLoadComplete como true imediatamente"
    );
    setIsInitialLoadComplete(true);
    clearTimeout(safetyTimeout);

    // Cleanup timeout on unmount
    return () => {
      console.log("useQuizLogic: Limpando timeout");
      clearTimeout(safetyTimeout);
    };
  }, []);

  // 3. Simple utility functions that don't depend on other functions
  const handleAnswer = useCallback(
    (questionId: string, selectedOptions: string[]) => {
      if (!currentQuestion) {
        console.warn("❌ Tentativa de responder sem pergunta atual");
        return;
      }

      if (!selectedOptions || selectedOptions.length === 0) {
        console.warn("❌ Tentativa de responder sem opções selecionadas");
        return;
      }

      console.log("📝 Resposta registrada:", { questionId, selectedOptions });

      const newAnswer = {
        questionId,
        selectedOptions,
        timestamp: new Date().toISOString(),
      };

      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedOptions,
      }));

      // Preload next question images whenever an answer is provided
      if (nextQuestion) {
        const nextImages = nextQuestion.options
          .map((option) => {
            if (typeof option === "string") return null;
            if (option.imageUrl) return option.imageUrl;
            return null;
          })
          .filter(Boolean) as string[];

        if (nextImages.length > 0) {
          preloadImagesByUrls(nextImages, {
            quality: 85,
            batchSize: 3,
          });
        }

        // Also start preloading next-next question with lower priority
        if (nextNextQuestion) {
          const nextNextImages = nextNextQuestion.options
            .map((option) => {
              if (typeof option === "string") return null;
              if (option.imageUrl) return option.imageUrl;
              return null;
            })
            .filter(Boolean) as string[];

          if (nextNextImages.length > 0) {
            preloadImagesByUrls(nextNextImages, {
              quality: 85,
              batchSize: 2,
            });
          }
        }
      }
    },
    [nextQuestion, nextNextQuestion, currentQuestion]
  );

  const handleStrategicAnswer = useCallback(
    (questionId: string, selectedOptions: string[]) => {
      // Para questões estratégicas, garantimos que SEMPRE haja apenas UMA opção selecionada
      // Se houver múltiplas, usamos apenas a última selecionada
      const finalOptions =
        selectedOptions.length > 0
          ? [selectedOptions[selectedOptions.length - 1]]
          : selectedOptions;

      // Não permitimos que o usuário desmarque uma opção em questões estratégicas
      // Se o array estiver vazio e já tiver uma seleção anterior, mantemos a seleção anterior
      if (finalOptions.length === 0) {
        const previousAnswer = strategicAnswers[questionId];
        if (previousAnswer && previousAnswer.length > 0) {
          return; // Mantém a seleção anterior, não permite desmarcar
        }
      }

      setStrategicAnswers((prev) => {
        const newAnswers = {
          ...prev,
          [questionId]: finalOptions,
        };
        // Don't save to localStorage to keep strategic questions fresh

        // Aproveitar questões estratégicas para pré-carregar imagens da página de resultados
        // Isso melhora significativamente o tempo de carregamento dos resultados
        const strategicQuestionsProgress = Object.keys(newAnswers).length;

        // A cada resposta estratégica, carregamos um novo conjunto de imagens da página de resultados
        // Isso distribui a carga de rede durante as questões que não pontuam
        if (strategicQuestionsProgress === 1) {
          // Na primeira questão estratégica, iniciamos o preload das imagens principais de resultado
          preloadCriticalImages(["results"], {
            quality: 80,
            batchSize: 2,
          });
          console.log(
            "[Otimização] Iniciando pré-carregamento das imagens principais de resultado"
          );
        } else if (strategicQuestionsProgress === 2) {
          // Na segunda questão, carregamos imagens de transformação
          preloadCriticalImages(["transformation"], {
            quality: 75,
            batchSize: 2,
          });
          console.log("[Otimização] Pré-carregando imagens de transformação");
        } else if (strategicQuestionsProgress >= 3) {
          // Na terceira ou posterior, começamos a carregar imagens de bônus e depoimentos
          preloadCriticalImages(["bonus", "testimonials"], {
            quality: 75,
            batchSize: 2,
          });
          console.log(
            "[Otimização] Pré-carregando imagens de bônus e depoimentos"
          );
        }

        return newAnswers;
      });
    },
    []
  );

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setQuizResult(null);
    localStorage.removeItem("quizResult");
    localStorage.removeItem("strategicAnswers");
    setStrategicAnswers({});
    console.log("Quiz reset");
  }, []);

  // 4. Complex function that others depend on
  const calculateResults = useCallback(
    (clickOrderInternal: string[] = []) => {
      const styleCounter: Record<string, number> = {
        Natural: 0,
        Clássico: 0,
        Contemporâneo: 0,
        Elegante: 0,
        Romântico: 0,
        Sexy: 0,
        Dramático: 0,
        Criativo: 0,
      };

      let totalSelections = 0;

      Object.entries(answers).forEach(([questionId, optionIds]) => {
        const question = quizQuestions.find((q) => q.id === questionId);
        if (!question) return;

        optionIds.forEach((optionId) => {
          const option = question.options.find((o) => o.id === optionId);
          if (option) {
            styleCounter[option.styleCategory]++;
            totalSelections++;
          }
        });
      });

      console.log("Style counts:", styleCounter);
      console.log("Total selections:", totalSelections);

      const styleResults: StyleResult[] = Object.entries(styleCounter)
        .map(([category, score]) => ({
          category: category as StyleResult["category"],
          score,
          percentage:
            totalSelections > 0
              ? Math.round((score / totalSelections) * 100)
              : 0,
        }))
        .sort((a, b) => {
          if (a.score === b.score && clickOrderInternal.length > 0) {
            const indexA = clickOrderInternal.indexOf(a.category);
            const indexB = clickOrderInternal.indexOf(b.category);
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
          }
          return b.score - a.score;
        });

      const primaryStyle = styleResults[0] || null;
      const secondaryStyles = styleResults.slice(1);

      const result: QuizResult = {
        primaryStyle,
        secondaryStyles,
        totalSelections,
        userName: "User", // Add default userName to fix type error
      };

      setQuizResult(result);
      localStorage.setItem("quizResult", JSON.stringify(result));
      localStorage.setItem(
        "strategicAnswers",
        JSON.stringify(strategicAnswers)
      );
      console.log("Results calculated and saved to localStorage:", result);

      return result;
    },
    [answers, strategicAnswers, quizQuestions]
  );

  // 5. Functions that depend on other complex functions
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, calculateResults, quizQuestions.length]);

  const submitQuizIfComplete = useCallback(
    (clickOrderInternal: string[] = []) => {
      const results = calculateResults(clickOrderInternal);
      setQuizCompleted(true);
      // localStorage is already saved by calculateResults
      console.log("Results saved to localStorage before redirect:", results);
      return results;
    },
    [calculateResults]
  );

  // 6. Side effects
  useEffect(() => {
    if (quizResult) {
      localStorage.setItem("quizResult", JSON.stringify(quizResult));
      console.log("QuizResult saved to localStorage:", quizResult);
    }
  }, [quizResult]);

  useEffect(() => {
    if (Object.keys(strategicAnswers).length > 0) {
      localStorage.setItem(
        "strategicAnswers",
        JSON.stringify(strategicAnswers)
      );
      console.log("Strategic answers saved to localStorage:", strategicAnswers);
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
    isInitialLoadComplete,
  };
};