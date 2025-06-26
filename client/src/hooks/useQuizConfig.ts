
import { useState, useEffect } from "react";
import { EditorState, EditorStep } from "@/types/editor";
import { loadQuizConfig } from "@/utils/quizStorage";

// Importar do hook original para manter compatibilidade
import {
  useQuizStyles as originalUseQuizStyles,
  useQuizTheme as originalUseQuizTheme,
  useQuizBehavior as originalUseQuizBehavior,
  useQuizLayout as originalUseQuizLayout,
  useQuizConfig as originalUseQuizConfig,
  QuizConfigProvider as originalQuizConfigProvider,
} from "./useQuizConfig.tsx";

export const useQuizConfig = () => {
  const [config, setConfig] = useState<EditorState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = loadQuizConfig();
        setConfig(savedConfig);
      } catch (error) {
        console.error("Error loading quiz config:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const getCurrentStep = (): EditorStep | null => {
    if (!config) return null;
    return (
      config.steps.find((step) => step.id === config.currentStepId) || null
    );
  };

  const getStepByIndex = (index: number): EditorStep | null => {
    if (!config || index < 0 || index >= config.steps.length) return null;
    return config.steps[index];
  };

  const getAllSteps = (): EditorStep[] => {
    return config?.steps || [];
  };

  const getStepById = (stepId: string): EditorStep | null => {
    if (!config) return null;
    return config.steps.find((step) => step.id === stepId) || null;
  };

  const getTotalSteps = (): number => {
    return config?.steps.length || 0;
  };

  const getCurrentStepIndex = (): number => {
    if (!config) return -1;
    return config.steps.findIndex((step) => step.id === config.currentStepId);
  };

  const exportConfig = () => {
    return config;
  };

  const state = config;

  return {
    config,
    loading,
    getCurrentStep,
    getStepByIndex,
    getAllSteps,
    getStepById,
    getTotalSteps,
    getCurrentStepIndex,
    exportConfig,
    state,
  };
};

// Re-exportar hooks para manter compatibilidade
export const useQuizStyles = originalUseQuizStyles;
export const useQuizTheme = originalUseQuizTheme;
export const useQuizBehavior = originalUseQuizBehavior;
export const useQuizLayout = originalUseQuizLayout;
export const QuizConfigProvider = originalQuizConfigProvider;

// Criar alias para o hook original para não conflitar
export const useQuizConfigOriginal = originalUseQuizConfig;
