import { useState, useCallback, useRef } from "react";
import {
  VisualElement,
  VisualStage,
  VisualEditorState,
  BlockType,
} from "@/types/visualEditor";
import { toast } from "@/components/ui/use-toast";

export const useVisualEditor = () => {
  const [state, setState] = useState<VisualEditorState>({
    elements: [],
    stages: [
      {
        id: "stage-1",
        title: "Etapa 1",
        order: 0,
        type: "quiz",
        settings: {
          showHeader: true,
          showProgress: true,
          allowBack: true,
        },
      },
    ],
    activeStageId: "stage-1",
    history: [],
    historyIndex: -1,
  });

  const saveToHistory = useCallback(() => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      return {
        ...prev,
        history: [...newHistory, { ...prev }],
        historyIndex: newHistory.length,
      };
    });
  }, []);

  const addElement = useCallback(
    (type: BlockType, stageId?: string, position?: number) => {
      const elementId = `element-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const targetStageId =
        stageId || state.activeStageId || state.stages[0]?.id;

      if (!targetStageId) return elementId;

      const newElement: VisualElement = {
        id: elementId,
        type,
        stageId: targetStageId,
        order:
          position ??
          state.elements.filter((el) => el.stageId === targetStageId).length,
        content: getDefaultContent(type),
        style: getDefaultStyle(type),
        visible: true,
        locked: false,
      };

      saveToHistory();
      setState((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
      }));

      return elementId;
    },
    [state.activeStageId, state.stages, state.elements, saveToHistory]
  );

  const updateElement = useCallback(
    (elementId: string, updates: Partial<VisualElement>) => {
      saveToHistory();
      setState((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el
        ),
      }));
    },
    [saveToHistory]
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      saveToHistory();
      setState((prev) => ({
        ...prev,
        elements: prev.elements.filter((el) => el.id !== elementId),
      }));
    },
    [saveToHistory]
  );

  const moveElement = useCallback(
    (elementId: string, direction: "up" | "down") => {
      saveToHistory();
      setState((prev) => {
        const element = prev.elements.find((el) => el.id === elementId);
        if (!element) return prev;

        const stageElements = prev.elements
          .filter((el) => el.stageId === element.stageId)
          .sort((a, b) => a.order - b.order);

        const currentIndex = stageElements.findIndex(
          (el) => el.id === elementId
        );
        const newIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= stageElements.length) return prev;

        const updatedElements = prev.elements.map((el) => {
          if (el.id === elementId) {
            return { ...el, order: stageElements[newIndex].order };
          }
          if (el.id === stageElements[newIndex].id) {
            return { ...el, order: element.order };
          }
          return el;
        });

        return { ...prev, elements: updatedElements };
      });
    },
    [saveToHistory]
  );

  const addStage = useCallback(() => {
    const stageId = `stage-${Date.now()}`;
    const newStage: VisualStage = {
      id: stageId,
      title: `Etapa ${state.stages.length + 1}`,
      order: state.stages.length,
      type: "quiz",
      settings: {
        showHeader: true,
        showProgress: true,
        allowBack: true,
      },
    };

    saveToHistory();
    setState((prev) => ({
      ...prev,
      stages: [...prev.stages, newStage],
      activeStageId: stageId,
    }));

    return stageId;
  }, [state.stages.length, saveToHistory]);

  const setActiveStage = useCallback((stageId: string) => {
    setState((prev) => ({
      ...prev,
      activeStageId: stageId,
    }));
  }, []);

  const saveProject = useCallback(async () => {
    try {
      localStorage.setItem("visual-editor-project", JSON.stringify(state));
      toast({
        title: "Projeto salvo",
        description: "Todas as alterações foram salvas com sucesso.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o projeto.",
        variant: "destructive",
      });
      return false;
    }
  }, [state]);

  const undo = useCallback(() => {
    if (state.historyIndex > 0) {
      setState((prev) => ({
        ...prev.history[prev.historyIndex - 1],
        historyIndex: prev.historyIndex - 1,
      }));
    }
  }, [state.historyIndex]);

  const redo = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      setState((prev) => ({
        ...prev.history[prev.historyIndex + 1],
        historyIndex: prev.historyIndex + 1,
      }));
    }
  }, [state.historyIndex, state.history.length]);

  return {
    elements: state.elements,
    stages: state.stages,
    activeStageId: state.activeStageId,
    addElement,
    updateElement,
    deleteElement,
    moveElement,
    addStage,
    setActiveStage,
    saveProject,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    undo,
    redo,
  };
};

const getDefaultContent = (type: BlockType): any => {
  switch (type) {
    case "text":
      return { text: "Clique para editar este texto" };
    case "title":
      return { text: "Título Principal", level: "h2" };
    case "button":
      return { text: "Clique Aqui", href: "#" };
    case "image":
      return {
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmMWYxIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbTwvdGV4dD4KPHN2Zz4=",
        alt: "Imagem",
      };
    case "input":
      return { placeholder: "Digite aqui...", type: "text" };
    case "email":
      return { placeholder: "seu@email.com", type: "email" };
    case "phone":
      return { placeholder: "(11) 99999-9999", type: "tel" };
    case "loading":
      return { text: "Carregando...", type: "spinner" };
    case "level":
      return { level: 1, maxLevel: 5, label: "Nível" };
    case "calendar":
      return { placeholder: "Selecione uma data", type: "date" };
    default:
      return {};
  }
};

const getDefaultStyle = (type: BlockType): any => {
  switch (type) {
    case "title":
      return {
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
        margin: "1rem 0",
      };
    case "text":
      return { fontSize: "1rem", lineHeight: "1.5", margin: "0.5rem 0" };
    case "button":
      return {
        backgroundColor: "var(--primary-color, #3b82f6)",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
      };
    case "image":
      return { width: "100%", height: "auto", borderRadius: "0.5rem" };
    case "loading":
      return { textAlign: "center", padding: "1rem", color: "#666" };
    case "level":
      return {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem",
      };
    case "calendar":
      return {
        width: "100%",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        border: "1px solid #ccc",
      };
    default:
      return {};
  }
};
