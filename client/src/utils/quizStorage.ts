import { EditorState } from "@/types/editor";

const STORAGE_KEY = "quiz-editor-config";

export const saveQuizConfig = (config: EditorState): void => {
  try {
    const serializedConfig = JSON.stringify(config);
    localStorage.setItem(STORAGE_KEY, serializedConfig);
    console.log("Quiz configuration saved to localStorage");
  } catch (error) {
    console.error("Failed to save quiz configuration:", error);
  }
};

export const loadQuizConfig = (): EditorState | null => {
  try {
    const serializedConfig = localStorage.getItem(STORAGE_KEY);
    if (serializedConfig === null) {
      return null;
    }
    return JSON.parse(serializedConfig) as EditorState;
  } catch (error) {
    console.error("Failed to load quiz configuration:", error);
    return null;
  }
};

export const clearQuizConfig = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Quiz configuration cleared from localStorage");
  } catch (error) {
    console.error("Failed to clear quiz configuration:", error);
  }
};

export const hasQuizConfig = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
