import { useState, useCallback, useMemo } from "react";

export interface OptionChoice {
  text: string;
  value: string;
  nextStepId?: string;
  nextPageType?: "resultPage" | "quizOfferPage" | "transitionPage";
  scoreValue?: number;
  image?: string;
}

export interface QuizComponentProps {
  text?: string;
  isHidden?: boolean;
  styles?: { [key: string]: string };
  src?: string;
  alt?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  label?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "number" | "tel";
  required?: boolean;
  validationRegex?: string;
  errorMessage?: string;
  storeAsLeadField?: string;
  buttonText?: string;
  buttonStyle?: "primary" | "secondary" | "outline" | "ghost";
  actionType?: "goToNextStep" | "submitForm" | "redirectUrl" | "customFunction";
  actionTargetId?: string;
  actionUrl?: string;
  customFunctionName?: string;
  questionText?: string;
  choices?: OptionChoice[];
  selectionType?: "single" | "multiple";
  maxSelections?: number;
  minSelections?: number;
  conditionalLogic?: {
    rule: "allSelected" | "anySelected" | "scoreThreshold";
    threshold?: number;
    targetStepId?: string;
    fallbackStepId?: string;
  };
  alertType?: "info" | "warning" | "error" | "success";
  alertMessage?: string;
  videoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  images?: { src: string; alt: string; caption?: string }[];
  autoSlide?: boolean;
  slideInterval?: number;
  height?: number;
  resultType?: "styleAnalysis" | "personalityProfile";
  offerHeadline?: string;
  offerDescription?: string;
  offerCtaButtonText?: string;
  offerCtaUrl?: string;
  resultMapping?: {
    scoreRange: [number, number];
    resultId: string;
    offerId: string;
  }[];
  offerProductSku?: string;
  [key: string]: unknown;
}

export interface QuizComponent {
  id: string;
  type: string;
  props: QuizComponentProps;
}

export interface Step {
  id: string;
  name: string;
  components: QuizComponent[];
}

export interface EditorState {
  steps: Step[];
  currentStepId: string;
  selectedComponentId: string | null;
  isDirty: boolean;
  lastSaved: Date | null;
}

export const useQuizEditor = () => {
  const [state, setState] = useState<EditorState>({
    steps: [
      {
        id: "step-1",
        name: "Boas-vindas",
        components: [
          {
            id: "comp-1",
            type: "heading",
            props: { text: "Bem-vindo ao Quiz!" },
          },
        ],
      },
    ],
    currentStepId: "step-1",
    selectedComponentId: null,
    isDirty: false,
    lastSaved: null,
  });

  // Seletores memoizados
  const currentStep = useMemo(
    () =>
      state.steps.find((step) => step.id === state.currentStepId) ||
      state.steps[0],
    [state.steps, state.currentStepId]
  );

  const selectedComponent = useMemo(
    () =>
      currentStep?.components.find(
        (comp) => comp.id === state.selectedComponentId
      ) || null,
    [currentStep, state.selectedComponentId]
  );

  // Actions otimizadas
  const actions = useMemo(
    () => ({
      selectStep: (stepId: string) => {
        setState((prev) => ({
          ...prev,
          currentStepId: stepId,
          selectedComponentId: null,
        }));
      },

      selectComponent: (componentId: string) => {
        setState((prev) => ({
          ...prev,
          selectedComponentId: componentId,
        }));
      },

      addStep: () => {
        const newStep: Step = {
          id: `step-${Date.now()}`,
          name: `Etapa ${state.steps.length + 1}`,
          components: [],
        };

        setState((prev) => ({
          ...prev,
          steps: [...prev.steps, newStep],
          currentStepId: newStep.id,
          selectedComponentId: null,
          isDirty: true,
        }));
      },

      duplicateStep: (stepId: string) => {
        const stepToDuplicate = state.steps.find((step) => step.id === stepId);
        if (stepToDuplicate) {
          const duplicatedStep: Step = {
            id: `step-${Date.now()}`,
            name: `${stepToDuplicate.name} (Cópia)`,
            components: stepToDuplicate.components.map((comp) => ({
              ...comp,
              id: `comp-${Date.now()}-${Math.random()}`,
            })),
          };

          setState((prev) => ({
            ...prev,
            steps: [...prev.steps, duplicatedStep],
            isDirty: true,
          }));
        }
      },

      deleteStep: (stepId: string) => {
        if (state.steps.length > 1) {
          setState((prev) => {
            const newSteps = prev.steps.filter((step) => step.id !== stepId);
            const newCurrentStepId =
              prev.currentStepId === stepId
                ? newSteps[0]?.id || ""
                : prev.currentStepId;

            return {
              ...prev,
              steps: newSteps,
              currentStepId: newCurrentStepId,
              selectedComponentId: null,
              isDirty: true,
            };
          });
        }
      },

      addComponent: (componentType: string) => {
        const newComponent: QuizComponent = {
          id: `comp-${Date.now()}`,
          type: componentType,
          props: getDefaultProps(componentType),
        };

        setState((prev) => ({
          ...prev,
          steps: prev.steps.map((step) =>
            step.id === prev.currentStepId
              ? { ...step, components: [...step.components, newComponent] }
              : step
          ),
          isDirty: true,
        }));
      },

      updateComponent: (componentId: string, newProps: QuizComponentProps) => {
        setState((prev) => ({
          ...prev,
          steps: prev.steps.map((step) =>
            step.id === prev.currentStepId
              ? {
                  ...step,
                  components: step.components.map((comp) =>
                    comp.id === componentId
                      ? { ...comp, props: { ...comp.props, ...newProps } }
                      : comp
                  ),
                }
              : step
          ),
          isDirty: true,
        }));
      },

      deleteComponent: (componentId: string) => {
        setState((prev) => ({
          ...prev,
          steps: prev.steps.map((step) =>
            step.id === prev.currentStepId
              ? {
                  ...step,
                  components: step.components.filter(
                    (comp) => comp.id !== componentId
                  ),
                }
              : step
          ),
          selectedComponentId:
            prev.selectedComponentId === componentId
              ? null
              : prev.selectedComponentId,
          isDirty: true,
        }));
      },

      markSaved: () => {
        setState((prev) => ({
          ...prev,
          isDirty: false,
          lastSaved: new Date(),
        }));
      },
    }),
    [state.steps]
  );

  return {
    state,
    currentStep,
    selectedComponent,
    actions,
  };
};

// Função utilitária para propriedades padrão
function getDefaultProps(componentType: string): QuizComponentProps {
  switch (componentType) {
    case "heading":
      return { text: "Novo Título" };
    case "text":
      return { text: "Texto de exemplo" };
    case "image":
      return { src: "", alt: "Imagem" };
    case "button":
      return { buttonText: "Clique aqui", buttonStyle: "primary" };
    case "input":
      return {
        label: "Campo",
        placeholder: "Digite aqui...",
        inputType: "text",
      };
    case "options":
      return {
        questionText: "Escolha uma opção:",
        selectionType: "single",
        choices: [
          { text: "Opção 1", value: "option1" },
          { text: "Opção 2", value: "option2" },
        ],
      };
    case "alert":
      return { alertType: "info", alertMessage: "Mensagem de alerta" };
    case "video":
      return { videoUrl: "", controls: true };
    case "spacer":
      return { height: 20 };
    default:
      return {};
  }
}
