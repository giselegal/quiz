import { useState, useEffect, useCallback } from "react";
import { EditorState, EditorStep, EditorElement } from "@/types/editor";
import { EditorStorageService } from "@/services/editorStorage";

export interface QuizRuntimeConfig {
  currentStepIndex: number;
  totalSteps: number;
  steps: EditorStep[];
  answers: Record<string, string | number | boolean | string[]>;
  score: number;
  startTime: Date;
  endTime?: Date;
}

export const useQuizRuntime = () => {
  const [config, setConfig] = useState<QuizRuntimeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar configuração do editor
  const loadQuizConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const savedConfig = EditorStorageService.loadConfig();

      if (!savedConfig) {
        throw new Error(
          "Nenhuma configuração de quiz encontrada. Configure o quiz no editor primeiro."
        );
      }

      const runtimeConfig: QuizRuntimeConfig = {
        currentStepIndex: 0,
        totalSteps: savedConfig.state.steps.length,
        steps: savedConfig.state.steps,
        answers: {},
        score: 0,
        startTime: new Date(),
      };

      setConfig(runtimeConfig);
      console.log(
        "✅ Quiz configurado com",
        runtimeConfig.totalSteps,
        "etapas"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("❌ Erro ao carregar quiz:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Avançar para próxima etapa
  const nextStep = useCallback(() => {
    if (!config) return false;

    if (config.currentStepIndex < config.totalSteps - 1) {
      setConfig((prev) =>
        prev
          ? {
              ...prev,
              currentStepIndex: prev.currentStepIndex + 1,
            }
          : null
      );
      return true;
    }
    return false;
  }, [config]);

  // Voltar para etapa anterior
  const previousStep = useCallback(() => {
    if (!config) return false;

    if (config.currentStepIndex > 0) {
      setConfig((prev) =>
        prev
          ? {
              ...prev,
              currentStepIndex: prev.currentStepIndex - 1,
            }
          : null
      );
      return true;
    }
    return false;
  }, [config]);

  // Ir para etapa específica
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (!config) return false;

      if (stepIndex >= 0 && stepIndex < config.totalSteps) {
        setConfig((prev) =>
          prev
            ? {
                ...prev,
                currentStepIndex: stepIndex,
              }
            : null
        );
        return true;
      }
      return false;
    },
    [config]
  );

  // Salvar resposta
  const saveAnswer = useCallback(
    (
      questionKey: string,
      answer: string | number | boolean | string[],
      points: number = 0
    ) => {
      if (!config) return;

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              answers: {
                ...prev.answers,
                [questionKey]: answer,
              },
              score: prev.score + points,
            }
          : null
      );
    },
    [config]
  );

  // Finalizar quiz
  const finishQuiz = useCallback(() => {
    if (!config) return null;

    const finalConfig = {
      ...config,
      endTime: new Date(),
    };

    setConfig(finalConfig);
    return finalConfig;
  }, [config]);

  // Reiniciar quiz
  const resetQuiz = useCallback(() => {
    loadQuizConfig();
  }, [loadQuizConfig]);

  // Obter etapa atual
  const getCurrentStep = useCallback((): EditorStep | null => {
    if (!config) return null;
    return config.steps[config.currentStepIndex] || null;
  }, [config]);

  // Verificar se tem configuração salva no editor
  const hasEditorConfig = useCallback(() => {
    return EditorStorageService.hasConfig();
  }, []);

  useEffect(() => {
    loadQuizConfig();
  }, [loadQuizConfig]);

  return {
    config,
    loading,
    error,
    currentStep: getCurrentStep(),
    nextStep,
    previousStep,
    goToStep,
    saveAnswer,
    finishQuiz,
    resetQuiz,
    hasEditorConfig,
    loadQuizConfig,
  };
};
