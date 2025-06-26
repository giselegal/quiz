import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  VisualElement,
  VisualEditorState,
  VisualEditorData,
  ElementUpdate,
  ElementContent,
  ElementStyle,
  GlobalStyles,
  EditorSettings,
} from "../types/visualEditor";

const defaultGlobalStyles: GlobalStyles = {
  backgroundColor: "#ffffff",
  fontFamily: "Inter, sans-serif",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  containerMaxWidth: "1200px",
  customCSS: "",
};

const defaultSettings: EditorSettings = {
  showGrid: false,
  snapToGrid: false,
  gridSize: 20,
  showRulers: false,
  showBoundingBoxes: false,
  autoSave: true,
  autoSaveInterval: 30000,
};

const defaultEditorState: VisualEditorState = {
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
  globalStyles: defaultGlobalStyles,
  selectedElementId: null,
  hoveredElementId: null,
  viewport: "desktop",
  zoomLevel: 100,
  isPreviewMode: false,
  settings: defaultSettings,
};

// Component templates for different element types
const getComponentDefaults = (
  type: string
): { content: ElementContent; style: ElementStyle } => {
  const defaults = {
    title: {
      content: { text: "Nova seção" },
      style: {
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center" as const,
        padding: "20px",
        margin: "10px 0",
      },
    },
    text: {
      content: { text: "Digite seu texto aqui..." },
      style: {
        fontSize: "16px",
        textAlign: "left" as const,
        padding: "10px",
        margin: "10px 0",
      },
    },
    button: {
      content: { text: "Clique aqui", href: "#" },
      style: {
        backgroundColor: "#2563eb",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "6px",
        textAlign: "center" as const,
        display: "inline-block",
        margin: "10px 0",
      },
    },
    image: {
      content: {
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmMWYxIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkltYWdlbTwvdGV4dD4KPHN2Zz4=",
        alt: "Imagem",
      },
      style: {
        width: "100%",
        height: "auto",
        margin: "10px 0",
      },
    },
    spacer: {
      content: {},
      style: {
        height: "40px",
        margin: "10px 0",
      },
    },
  };

  return defaults[type as keyof typeof defaults] || defaults.text;
};

export function useEditorState(initialData?: VisualEditorData) {
  const [editorState, setEditorState] = useState<VisualEditorState>(() => {
    if (initialData?.editorState) {
      return initialData.editorState;
    }

    // Try to load from localStorage
    const savedState = localStorage.getItem("visual-editor-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return { ...defaultEditorState, ...parsed };
      } catch (error) {
        console.warn("Failed to parse saved editor state:", error);
      }
    }

    return defaultEditorState;
  });

  const nextElementId = useRef(editorState.elements.length + 1);

  // Auto-save to localStorage
  const saveToLocalStorage = useCallback((state: VisualEditorState) => {
    try {
      localStorage.setItem("visual-editor-state", JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save editor state to localStorage:", error);
    }
  }, []);

  const addElement = useCallback(
    (componentType: string, position?: number): string => {
      const id = uuidv4();
      const { content, style } = getComponentDefaults(componentType);
      const order =
        position !== undefined ? position : editorState.elements.length;

      const newElement: VisualElement = {
        id,
        type: componentType as any,
        stageId:
          editorState.activeStageId || editorState.stages[0]?.id || "stage-1",
        content,
        style,
        visible: true,
        locked: false,
        order,
      };

      setEditorState((prev) => {
        const newElements = [...prev.elements];

        if (position !== undefined) {
          // Insert at specific position and update order of subsequent elements
          newElements.splice(position, 0, newElement);
          newElements.forEach((el, index) => {
            el.order = index;
          });
        } else {
          // Add to end
          newElements.push(newElement);
        }

        const newState = { ...prev, elements: newElements };
        saveToLocalStorage(newState);
        return newState;
      });

      nextElementId.current += 1;
      return id;
    },
    [
      editorState.elements.length,
      editorState.activeStageId,
      editorState.stages,
      saveToLocalStorage,
    ]
  );

  const updateElement = useCallback(
    (elementId: string, updates: ElementUpdate) => {
      setEditorState((prev) => {
        const newElements = prev.elements.map((el) => {
          if (el.id === elementId) {
            return {
              ...el,
              content: updates.content
                ? { ...el.content, ...updates.content }
                : el.content,
              style: updates.style
                ? { ...el.style, ...updates.style }
                : el.style,
              visible:
                updates.visible !== undefined ? updates.visible : el.visible,
              locked: updates.locked !== undefined ? updates.locked : el.locked,
            };
          }
          return el;
        });

        const newState = { ...prev, elements: newElements };
        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const removeElement = useCallback(
    (elementId: string) => {
      setEditorState((prev) => {
        const newElements = prev.elements
          .filter((el) => el.id !== elementId)
          .map((el, index) => ({ ...el, order: index }));

        const newState = { ...prev, elements: newElements };
        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const moveElement = useCallback(
    (elementId: string, direction: "up" | "down") => {
      setEditorState((prev) => {
        const elementIndex = prev.elements.findIndex(
          (el) => el.id === elementId
        );
        if (elementIndex === -1) return prev;

        const newElements = [...prev.elements];
        const targetIndex =
          direction === "up" ? elementIndex - 1 : elementIndex + 1;

        if (targetIndex < 0 || targetIndex >= newElements.length) return prev;

        // Swap elements
        [newElements[elementIndex], newElements[targetIndex]] = [
          newElements[targetIndex],
          newElements[elementIndex],
        ];

        // Update order
        newElements.forEach((el, index) => {
          el.order = index;
        });

        const newState = { ...prev, elements: newElements };
        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const duplicateElement = useCallback(
    (elementId: string) => {
      setEditorState((prev) => {
        const elementToDuplicate = prev.elements.find(
          (el) => el.id === elementId
        );
        if (!elementToDuplicate) return prev;

        const newElement: VisualElement = {
          ...elementToDuplicate,
          id: uuidv4(),
          order: elementToDuplicate.order + 1,
        };

        const newElements = [...prev.elements];
        newElements.splice(elementToDuplicate.order + 1, 0, newElement);

        // Update order for subsequent elements
        newElements.forEach((el, index) => {
          el.order = index;
        });

        const newState = { ...prev, elements: newElements };
        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const updateGlobalStyles = useCallback(
    (updates: Partial<GlobalStyles>) => {
      setEditorState((prev) => {
        const newState = {
          ...prev,
          globalStyles: { ...prev.globalStyles!, ...updates },
        };
        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const reorderElements = useCallback(
    (startIndex: number, endIndex: number) => {
      setEditorState((prev) => {
        const newElements = [...prev.elements];
        const [removed] = newElements.splice(startIndex, 1);
        newElements.splice(endIndex, 0, removed);

        // Update order
        newElements.forEach((el, index) => {
          el.order = index;
        });

        const newState = { ...prev, elements: newElements };
        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const exportState = useCallback(() => {
    return JSON.stringify(editorState);
  }, [editorState]);

  const importState = useCallback(
    (stateJson: string) => {
      try {
        const imported = JSON.parse(stateJson);
        const newState = { ...defaultEditorState, ...imported };
        setEditorState(newState);
        saveToLocalStorage(newState);
      } catch (error) {
        console.error("Failed to import state:", error);
        throw new Error("Invalid state format");
      }
    },
    [saveToLocalStorage]
  );

  return {
    editorState,
    addElement,
    updateElement,
    removeElement,
    moveElement,
    duplicateElement,
    updateGlobalStyles,
    reorderElements,
    exportState,
    importState,
  };
}
