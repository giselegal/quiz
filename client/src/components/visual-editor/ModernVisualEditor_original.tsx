import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getPlaceholderImage } from "@/utils/placeholderUtils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { StepsPanel } from "../result-editor/StepsPanel";
import { ComponentsPalette } from "./sidebar/ComponentsPalette";
import { AdvancedControlsPanel } from "./panels/AdvancedControlsPanel";
import { ModernConfigurationPanel } from "./panels/ModernConfigurationPanel";
import { OptionConfigurationPanel } from "./panels/OptionConfigurationPanel";
import { QuizConfigPanel } from "./panels/QuizConfigPanel";
import { EditableCanvas } from "./canvas/EditableCanvas";
import { EditorQuizPreview } from "./preview/EditorQuizPreview";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { useQuizStyles } from "@/hooks/useQuizConfig";
import { useQuizEditor } from "@/hooks/useQuizEditor";
import { useEditorSettings } from "@/hooks/useEditorSettings";
import { clothingQuestions } from "@/data/questions/clothingQuestions";
import { strategicQuestions as localStrategicQuestions } from "@/data/strategicQuestions";
import { ValidationModal } from "./ValidationModal";
import { runEditorTest } from "@/utils/editorTest";
import { UserResponse } from "@/types/quiz";
import {
  Eye,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Sliders,
} from "lucide-react";

import { QuizQuestion } from "@/types/quiz";

interface EditorStage {
  id: string;
  name: string;
  type: "intro" | "quiz" | "transition" | "result" | "offer" | "strategic";
  questionData?: QuizQuestion;
  order?: number;
}

interface CanvasElement {
  id: string;
  type:
    | "headline"
    | "text"
    | "image"
    | "form"
    | "button"
    | "question-title"
    | "question-options";
  content: {
    text?: string;
    imageUrl?: string;
    style?: Record<string, string>;
    properties?: Record<string, unknown>;
  };
  order: number;
}

interface EditorSaveData {
  stages: EditorStage[];
  currentStage: string;
  canvasElements: CanvasElement[];
  settings: {
    viewportMode: "desktop" | "tablet" | "mobile";
    isPreviewMode: boolean;
  };
}

interface ModernVisualEditorProps {
  funnelId: string;
  onSave?: (data: EditorSaveData) => void;
}

export const ModernVisualEditor: React.FC<ModernVisualEditorProps> = ({
  funnelId,
  onSave,
}) => {
  const {
    questions: supabaseQuestions,
    strategicQuestions: supabaseStrategicQuestions,
    loading,
    error,
  } = useSupabaseQuestions();

  // Use local data as fallback if Supabase is empty or has errors
  const questions =
    supabaseQuestions.length > 0 ? supabaseQuestions : clothingQuestions;
  const strategicQuestions =
    supabaseStrategicQuestions.length > 0
      ? supabaseStrategicQuestions
      : localStrategicQuestions;
  const { cssVariables } = useQuizStyles();
  const { saving, lastSaved, saveQuestion, autoSave, validateQuiz } =
    useQuizEditor();
  const [stages, setStages] = useState<EditorStage[]>([]);
  const [currentStage, setCurrentStage] = useState<string>("intro");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [showOptionConfig, setShowOptionConfig] = useState<boolean>(false);
  const [showQuizConfig, setShowQuizConfig] = useState<boolean>(false);
  const [showValidationModal, setShowValidationModal] =
    useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  // Canvas elements state
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  // Quiz preview state
  const [previewAnswers, setPreviewAnswers] = useState<string[]>([]);

  // Preview handlers
  const handlePreviewAnswer = (response: UserResponse) => {
    if (response.selectedOptions) {
      setPreviewAnswers(response.selectedOptions);
    }
  };

  const handlePreviewNext = () => {
    console.log("Preview Next clicked");
    setPreviewAnswers([]); // Reset answers for next question
  };

  const handlePreviewPrevious = () => {
    console.log("Preview Previous clicked");
    setPreviewAnswers([]);
  };

  // Generate stages from Supabase data or local fallback
  useEffect(() => {
    console.log("📊 ModernVisualEditor - Data status:", {
      loading,
      error,
      supabaseQuestions: supabaseQuestions.length,
      supabaseStrategicQuestions: supabaseStrategicQuestions.length,
      questionsUsed: questions.length,
      strategicQuestionsUsed: strategicQuestions.length,
    });

    if (!loading && (questions.length > 0 || strategicQuestions.length > 0)) {
      console.log("✅ ModernVisualEditor - Generating stages with:", {
        questionsCount: questions.length,
        strategicQuestionsCount: strategicQuestions.length,
        firstQuestion: questions[0]?.title,
        firstStrategic: strategicQuestions[0]?.title,
      });

      const newStages: EditorStage[] = [];

      // 1. Intro stage
      newStages.push({
        id: "intro",
        name: "Introdução",
        type: "intro",
        order: 0,
      });

      // 2. Regular questions (1-10)
      questions.forEach((question, index) => {
        newStages.push({
          id: `question-${question.id}`,
          name: `Questão ${index + 1}`,
          type: "quiz",
          questionData: question,
          order: index + 1,
        });
      });

      // 3. Transition to strategic questions
      if (strategicQuestions.length > 0) {
        newStages.push({
          id: "transition-strategic",
          name: "Transição Estratégica",
          type: "transition",
          order: questions.length + 1,
        });

        // 4. Strategic questions
        strategicQuestions.forEach((question, index) => {
          newStages.push({
            id: `strategic-${question.id}`,
            name: `Estratégica ${index + 1}`,
            type: "strategic",
            questionData: question,
            order: questions.length + 2 + index,
          });
        });
      }

      // 5. Final stages
      const finalOrder = questions.length + strategicQuestions.length + 2;
      newStages.push(
        {
          id: "transition-result",
          name: "Transição Resultado",
          type: "transition",
          order: finalOrder,
        },
        {
          id: "result",
          name: "Resultado",
          type: "result",
          order: finalOrder + 1,
        },
        {
          id: "offer",
          name: "Oferta",
          type: "offer",
          order: finalOrder + 2,
        }
      );

      setStages(newStages);
      console.log("✅ Generated stages from Supabase:", newStages.length);
    }
  }, [
    questions,
    strategicQuestions,
    loading,
    error,
    supabaseQuestions.length,
    supabaseStrategicQuestions.length,
  ]);

  // Generate canvas elements based on current stage
  useEffect(() => {
    const currentStageData = stages.find((s) => s.id === currentStage);
    if (!currentStageData) return;

    let elements: CanvasElement[] = [];

    switch (currentStageData.type) {
      case "intro":
        elements = [
          {
            id: "intro-headline",
            type: "headline",
            content: { text: "Descubra Seu Estilo Pessoal", level: 1 },
            order: 0,
          },
          {
            id: "intro-image",
            type: "image",
            content: {
              src: "https://cakto-quiz-br01.b-cdn.net/uploads/ecbe689b-1c0a-4071-98d3-4d391b6dd98f.png",
              alt: "Quiz de estilo",
              width: 640,
              height: 480,
            },
            order: 1,
          },
          {
            id: "intro-form",
            type: "form",
            content: {
              label: "SEU NOME",
              placeholder: "Digite seu nome aqui...",
              required: true,
              type: "text",
            },
            order: 2,
          },
          {
            id: "intro-button",
            type: "button",
            content: { text: "Começar Quiz" },
            order: 3,
          },
        ];
        break;

      case "quiz":
      case "strategic": {
        const questionData = currentStageData.questionData;
        if (questionData) {
          elements = [
            {
              id: "question-title",
              type: "question-title",
              content: { text: questionData.title || "Título da questão" },
              order: 0,
            },
            {
              id: "question-options",
              type: "question-options",
              content: {
                options: questionData.options || [],
                multiSelect: questionData.multiSelect || false,
              },
              order: 1,
            },
          ];
        }
        break;
      }

      case "transition":
        elements = [
          {
            id: "transition-headline",
            type: "headline",
            content: { text: "Você está indo muito bem!", level: 2 },
            order: 0,
          },
          {
            id: "transition-text",
            type: "text",
            content: { text: "Vamos continuar..." },
            order: 1,
          },
          {
            id: "transition-button",
            type: "button",
            content: { text: "Continuar" },
            order: 2,
          },
        ];
        break;

      case "result":
        elements = [
          {
            id: "result-headline",
            type: "headline",
            content: { text: "Seu Resultado Está Pronto!", level: 1 },
            order: 0,
          },
          {
            id: "result-text",
            type: "text",
            content: {
              text: "Descobrimos seu estilo predominante baseado nas suas respostas.",
            },
            order: 1,
          },
          {
            id: "result-button",
            type: "button",
            content: { text: "Ver Oferta Especial" },
            order: 2,
          },
        ];
        break;

      case "offer":
        elements = [
          {
            id: "offer-headline",
            type: "headline",
            content: { text: "Oferta Especial Para Você!", level: 1 },
            order: 0,
          },
          {
            id: "offer-text",
            type: "text",
            content: {
              text: "Baseado no seu estilo, temos uma consultoria exclusiva com desconto especial.",
            },
            order: 1,
          },
          {
            id: "offer-button",
            type: "button",
            content: { text: "Quero Aproveitar" },
            order: 2,
          },
        ];
        break;
    }

    setCanvasElements(elements);
    setSelectedElementId(null);
  }, [currentStage, stages]);

  const handleSave = useCallback(async () => {
    try {
      // Coletar todas as questões modificadas
      const allQuestions = [...questions, ...strategicQuestions];

      // Validar antes de salvar
      const validation = validateQuiz(allQuestions);
      if (!validation.isValid) {
        console.error("Validation errors:", validation.errors);
        return;
      }

      // Salvar usando o hook de editor
      const success = await autoSave(allQuestions);

      if (success) {
        // Dados para compatibilidade com callback existente
        const data = {
          stages,
          currentStage,
          canvasElements,
          settings: {
            viewportMode,
            isPreviewMode,
          },
        };

        console.log("✅ Saved successfully:", data);
        onSave?.(data);
      }
    } catch (error) {
      console.error("❌ Error saving:", error);
    }
  }, [
    stages,
    currentStage,
    canvasElements,
    viewportMode,
    isPreviewMode,
    onSave,
    questions,
    strategicQuestions,
    autoSave,
    validateQuiz,
  ]);

  // Auto-save effect - salva apenas quando há mudanças
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Debounce auto-save para evitar salvamentos excessivos
    const debouncedSave = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (questions.length > 0 || strategicQuestions.length > 0) {
          const allQuestions = [...questions, ...strategicQuestions];
          const validation = validateQuiz(allQuestions);

          if (validation.isValid) {
            await autoSave(allQuestions);
          }
        }
      }, 5000); // Auto-save depois de 5 segundos de inatividade
    };

    debouncedSave();

    return () => clearTimeout(timeoutId);
  }, [questions, strategicQuestions, canvasElements, autoSave, validateQuiz]);

  const handleStageSelect = (stageId: string) => {
    setCurrentStage(stageId);
    setSelectedElementId(null);
  };

  const handleComponentSelect = (componentType: string) => {
    setSelectedComponent(componentType);
    handleElementAdd(componentType);
  };

  const handleElementUpdate = (
    elementId: string,
    updates: Partial<{
      content: Partial<CanvasElement["content"]>;
      style: Record<string, string>;
      properties: Record<string, unknown>;
    }>
  ) => {
    setCanvasElements((prev) =>
      prev.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            content: updates.content
              ? { ...element.content, ...updates.content }
              : element.content,
            style: updates.style
              ? { ...element.content.style, ...updates.style }
              : element.content.style,
            properties: updates.properties
              ? { ...element.content.properties, ...updates.properties }
              : element.content.properties,
          };
        }
        return element;
      })
    );
  };

  const handleResetElement = (elementId: string) => {
    setCanvasElements((prev) =>
      prev.map((element) => {
        if (element.id === elementId) {
          const defaultContent = getDefaultContent(element.type);
          return { ...element, content: defaultContent };
        }
        return element;
      })
    );
  };

  const handleDeleteElement = (elementId: string) => {
    setCanvasElements((prev) =>
      prev.filter((element) => element.id !== elementId)
    );
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleElementAdd = (type: string, position?: number) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: type as CanvasElement["type"],
      content: getDefaultContent(type),
      order: position ?? canvasElements.length,
    };

    setCanvasElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "headline":
        return { text: "Novo Título", level: 1 };
      case "text":
        return { text: "Novo texto", size: "base", align: "left" };
      case "image":
        return {
          src: getPlaceholderImage(400, 200, "Nova imagem"),
          alt: "Nova imagem",
          width: 400,
          height: 200,
        };
      case "form":
        return {
          label: "Novo Campo",
          placeholder: "Digite aqui...",
          required: false,
          type: "text",
        };
      case "button":
        return { text: "Novo Botão" };
      case "question-title":
        return { text: "Nova Questão" };
      case "question-options":
        return { options: [], multiSelect: false };
      default:
        return {};
    }
  };

  const handleElementDelete = (id: string) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleElementReorder = (draggedId: string, targetId: string) => {
    const draggedIndex = canvasElements.findIndex((el) => el.id === draggedId);
    const targetIndex = canvasElements.findIndex((el) => el.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newElements = [...canvasElements];
    const [draggedElement] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, draggedElement);

    const updatedElements = newElements.map((el, index) => ({
      ...el,
      order: index,
    }));

    setCanvasElements(updatedElements);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questões do Supabase...</p>
          <p className="text-sm text-gray-500 mt-2">
            Aguarde enquanto carregamos as questões...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 mb-2 font-medium">
              Erro ao carregar questões:
            </p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  // Debug: verificar se temos questões
  console.log("🔍 Debug ModernVisualEditor:", {
    loading,
    error,
    questionsCount: questions.length,
    strategicQuestionsCount: strategicQuestions.length,
    stagesCount: stages.length,
    currentStage,
  });

  // Se não há questões carregadas, mostrar fallback
  if (!loading && questions.length === 0 && strategicQuestions.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Nenhuma questão encontrada
            </h2>
            <p className="text-yellow-700 mb-4">
              Parece que não há questões configuradas no Supabase para este
              quiz.
            </p>
            <div className="text-sm text-yellow-600 bg-yellow-100 rounded-md p-3 mb-4">
              <p className="font-medium">
                Quiz ID: 550e8400-e29b-41d4-a716-446655440000
              </p>
              <p>Verificando questões ativas na tabela quiz_questions</p>
            </div>
            <Button onClick={() => window.location.reload()}>Recarregar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Elegant Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Brand Identity */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Q</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Quiz Editor
                  </h1>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{funnelId}</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {questions.length + strategicQuestions.length} questões
                    </span>

                    {/* Validation Status */}
                    {(() => {
                      const allQuestions = [
                        ...questions,
                        ...strategicQuestions,
                      ];
                      const validation = validateQuiz(allQuestions);
                      return (
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <div
                            className={cn(
                              "flex items-center gap-1.5 text-xs",
                              validation.isValid
                                ? "text-emerald-600"
                                : "text-red-500"
                            )}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                validation.isValid
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              )}
                            ></div>
                            <span className="font-medium">
                              {validation.isValid
                                ? "Válido"
                                : `${validation.errors.length} erro(s)`}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Viewport Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewportMode("desktop")}
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-md transition-all",
                    viewportMode === "desktop"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewportMode("tablet")}
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-md transition-all",
                    viewportMode === "tablet"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewportMode("mobile")}
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-md transition-all",
                    viewportMode === "mobile"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Preview Toggle */}
              <Button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                variant={isPreviewMode ? "default" : "outline"}
                size="sm"
                className="h-8 gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                {isPreviewMode ? "Editar" : "Preview"}
              </Button>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="h-8 gap-2"
              >
                {saving ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Salvando
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Salvo
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Salvar
                  </>
                )}
              </Button>

              {/* Last saved indicator */}
              {lastSaved && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Resizable 4 Columns Layout */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* First Column - Steps Panel */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
            <div className="h-full border-r border-gray-200 bg-white">
              <StepsPanel
                stages={stages}
                currentStage={currentStage}
                onStageSelect={handleStageSelect}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Second Column - Components Palette */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full bg-white border-r border-gray-200">
              <ComponentsPalette
                onComponentSelect={handleElementAdd}
                selectedComponent={selectedElementId}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Third Column - Editor Canvas (Preview) */}
          <ResizablePanel defaultSize={35} minSize={30} maxSize={50}>
            <div className="h-full bg-gray-50 relative">
              <ScrollArea className="h-full">
                <div className="p-8 min-h-full">
                  <div
                    className={cn(
                      "mx-auto shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out border border-slate-200/60",
                      viewportMode === "desktop" && "max-w-4xl",
                      viewportMode === "tablet" && "max-w-2xl",
                      viewportMode === "mobile" && "max-w-sm"
                    )}
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    {isPreviewMode ? (
                      <EditorQuizPreview
                        currentStage={
                          stages.find((s) => s.id === currentStage) || stages[0]
                        }
                        questions={questions}
                        strategicQuestions={strategicQuestions}
                        currentAnswers={previewAnswers}
                        onAnswer={handlePreviewAnswer}
                        onNext={handlePreviewNext}
                        onPrevious={handlePreviewPrevious}
                        viewportMode={viewportMode}
                      />
                    ) : (
                      <EditableCanvas
                        elements={canvasElements}
                        selectedElementId={selectedElementId}
                        isPreviewMode={isPreviewMode}
                        onElementSelect={setSelectedElementId}
                        onElementUpdate={handleElementUpdate}
                        onElementAdd={handleElementAdd}
                        onElementReorder={handleElementReorder}
                        onElementDelete={handleElementDelete}
                      />
                    )}
                  </div>

                  {/* Viewport indicator */}
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          viewportMode === "desktop" && "bg-gray-600",
                          viewportMode === "tablet" && "bg-gray-600",
                          viewportMode === "mobile" && "bg-gray-600"
                        )}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {viewportMode === "desktop" && "Desktop"}
                        {viewportMode === "tablet" && "Tablet"}
                        {viewportMode === "mobile" && "Mobile"}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Fourth Column - Configuration Panel with Tabs */}
          <ResizablePanel
            defaultSize={showQuizConfig ? 24 : 30}
            minSize={showQuizConfig ? 20 : 24}
            maxSize={showQuizConfig ? 35 : 40}
          >
            <div className="h-full bg-white border-l border-gray-200">
              <Tabs defaultValue="config" className="h-full flex flex-col">
                <div className="border-b border-gray-200 bg-gray-50">
                  <TabsList className="grid w-full grid-cols-2 h-10 bg-transparent rounded-none border-0">
                    <TabsTrigger
                      value="config"
                      className="text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 text-gray-600"
                    >
                      <Settings className="w-3 h-3 mr-1.5" />
                      Configurações
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 text-gray-600"
                    >
                      <Sliders className="w-3 h-3 mr-1.5" />
                      Avançado
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="config"
                  className="flex-1 m-0 overflow-hidden"
                >
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <ModernConfigurationPanel
                        stageName={
                          stages.find((s) => s.id === currentStage)?.name || ""
                        }
                        stageType={currentStage}
                        currentStage={stages.find((s) => s.id === currentStage)}
                        questionData={
                          stages.find((s) => s.id === currentStage)
                            ?.questionData
                        }
                        onUpdate={(updatedData) => {
                          // Update the stage data
                          setStages((prev) =>
                            prev.map((stage) =>
                              stage.id === currentStage
                                ? { ...stage, questionData: updatedData }
                                : stage
                            )
                          );

                          // Update canvas elements if it's a question
                          if (
                            currentStage.startsWith("question-") ||
                            currentStage.startsWith("strategic-")
                          ) {
                            const updatedElements = canvasElements.map((el) => {
                              if (el.type === "question-title") {
                                return {
                                  ...el,
                                  content: { text: updatedData.title },
                                };
                              }
                              if (el.type === "question-options") {
                                return {
                                  ...el,
                                  content: {
                                    options: updatedData.options || [],
                                    multiSelect:
                                      updatedData.multiSelect || false,
                                  },
                                };
                              }
                              return el;
                            });
                            setCanvasElements(updatedElements);
                          }
                        }}
                        onStageUpdate={(stageId, stageData) => {
                          setStages((prev) =>
                            prev.map((stage) =>
                              stage.id === stageId
                                ? { ...stage, ...stageData }
                                : stage
                            )
                          );
                        }}
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="advanced"
                  className="flex-1 m-0 overflow-hidden"
                >
                  <ScrollArea className="h-full">
                    <AdvancedControlsPanel
                      selectedElementId={selectedElementId}
                      onElementUpdate={handleElementUpdate}
                      onResetElement={handleResetElement}
                      onDeleteElement={handleDeleteElement}
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          {/* Fifth Column - Quiz Configuration Panel (Conditional) */}
          {showQuizConfig && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <QuizConfigPanel
                  isOpen={showQuizConfig}
                  onToggle={() => setShowQuizConfig(!showQuizConfig)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Option Configuration Modal */}
      {showOptionConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <OptionConfigurationPanel
            isOpen={showOptionConfig}
            onClose={() => setShowOptionConfig(false)}
            optionId={selectedOptionId || ""}
            onConfigUpdate={(config) => {
              console.log("Configuração atualizada:", config);
            }}
          />
        </div>
      )}
    </div>
  );
};
