import { EditorState, EditorStep, EditorElement } from "@/types/editor";

export const getCurrentStep = (state: EditorState): EditorStep | undefined => {
  return state.steps.find((step) => step.id === state.currentStepId);
};

export const getSelectedElement = (
  state: EditorState
): EditorElement | undefined => {
  const currentStep = getCurrentStep(state);
  if (!currentStep || !state.selectedElementId) return undefined;
  return currentStep.elements.find((el) => el.id === state.selectedElementId);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createElement = (
  type: EditorElement["type"],
  content: EditorElement["content"]
): EditorElement => {
  return {
    id: generateId(),
    type,
    content,
    styles: {},
    position: Date.now(),
  };
};

export const createStep = (name: string): EditorStep => {
  return {
    id: generateId(),
    name,
    elements: [],
    settings: {
      showLogo: true,
      showProgress: true,
      allowReturn: true,
    },
  };
};
