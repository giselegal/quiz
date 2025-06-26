import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Copy, Trash2, GripVertical, Layout, Settings, 
  ArrowLeft, ArrowRight, Eye, Monitor, Tablet, Smartphone,
  Type, Image as ImageIcon, MousePointer, Video, Star,
  Save, Undo2, Redo2, Play, Download
} from "lucide-react";

// Tipos para o editor no estilo Cakto
interface CaktoComponent {
  id: string;
  type: string;
  data: Record<string, any>;
  style?: Record<string, any>;
}

interface CaktoStep {
  id: string;
  title: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'loading' | 'result' | 'offer';
  progress: number;
  components: CaktoComponent[];
  settings: {
    showHeader: boolean;
    showProgress: boolean;
    backgroundColor: string;
  };
}

interface CaktoFunnel {
  id: string;
  name: string;
  steps: CaktoStep[];
}

// Dados iniciais para o quiz no estilo Cakto
const INITIAL_CAKTO_STEPS: CaktoStep[] = [
  { 
    id: "intro", 
    title: "Introdução", 
    type: "intro", 
    progress: 0, 
    components: [],
    settings: { showHeader: true, showProgress: false, backgroundColor: "#ffffff" }
  },
  { 
    id: "q1", 
    title: "Pergunta 1 - Estilo Favorito", 
    type: "question", 
    progress: 6, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q2", 
    title: "Pergunta 2 - Tipo de Roupa", 
    type: "question", 
    progress: 12, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q3", 
    title: "Pergunta 3 - Cores Preferidas", 
    type: "question", 
    progress: 18, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q4", 
    title: "Pergunta 4 - Ocasiões", 
    type: "question", 
    progress: 24, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q5", 
    title: "Pergunta 5 - Acessórios", 
    type: "question", 
    progress: 30, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q6", 
    title: "Pergunta 6 - Estampas", 
    type: "question", 
    progress: 36, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q7", 
    title: "Pergunta 7 - Silhuetas", 
    type: "question", 
    progress: 42, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q8", 
    title: "Pergunta 8 - Inspirações", 
    type: "question", 
    progress: 48, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q9", 
    title: "Pergunta 9 - Shopping", 
    type: "question", 
    progress: 54, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "q10", 
    title: "Pergunta 10 - Personalidade", 
    type: "question", 
    progress: 60, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "transition", 
    title: "Transição", 
    type: "transition", 
    progress: 65, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq1", 
    title: "Estratégica 1 - Nome", 
    type: "strategic", 
    progress: 70, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq2", 
    title: "Estratégica 2 - Email", 
    type: "strategic", 
    progress: 75, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq3", 
    title: "Estratégica 3 - WhatsApp", 
    type: "strategic", 
    progress: 80, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq4", 
    title: "Estratégica 4 - Idade", 
    type: "strategic", 
    progress: 85, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq5", 
    title: "Estratégica 5 - Orçamento", 
    type: "strategic", 
    progress: 90, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq6", 
    title: "Estratégica 6 - Interesse", 
    type: "strategic", 
    progress: 95, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "sq7", 
    title: "Estratégica 7 - Compra", 
    type: "strategic", 
    progress: 98, 
    components: [],
    settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
  },
  { 
    id: "loading", 
    title: "Carregamento", 
    type: "loading", 
    progress: 99, 
    components: [],
    settings: { showHeader: false, showProgress: false, backgroundColor: "#ffffff" }
  },
  { 
    id: "result", 
    title: "Resultado", 
    type: "result", 
    progress: 100, 
    components: [],
    settings: { showHeader: false, showProgress: false, backgroundColor: "#ffffff" }
  },
  { 
    id: "offer", 
    title: "Oferta", 
    type: "offer", 
    progress: 100, 
    components: [],
    settings: { showHeader: false, showProgress: false, backgroundColor: "#ffffff" }
  },
];

// Componentes disponíveis no estilo Cakto
const CAKTO_COMPONENTS = [
  { type: "logo", label: "Logo", icon: "🏷️", category: "branding" },
  { type: "progress", label: "Barra de Progresso", icon: "📊", category: "ui" },
  { type: "title", label: "Título", icon: "📝", category: "content" },
  { type: "subtitle", label: "Subtítulo", icon: "📄", category: "content" },
  { type: "text", label: "Texto", icon: "📃", category: "content" },
  { type: "image", label: "Imagem", icon: "🖼️", category: "media" },
  { type: "input", label: "Campo de Entrada", icon: "📝", category: "form" },
  { type: "options", label: "Opções/Botões", icon: "🔘", category: "form" },
  { type: "button", label: "Botão", icon: "🔲", category: "form" },
  { type: "spacer", label: "Espaçador", icon: "📏", category: "layout" },
  { type: "video", label: "Vídeo", icon: "🎥", category: "media" },
  { type: "testimonial", label: "Depoimento", icon: "💬", category: "social" },
];

const CAKTO_CATEGORIES = {
  branding: "Marca",
  ui: "Interface",
  content: "Conteúdo", 
  media: "Mídia",
  form: "Formulário",
  layout: "Layout",
  social: "Social"
};

export default function CaktoStyleEditor() {
  const [currentFunnel, setCurrentFunnel] = useState<CaktoFunnel>({
    id: "cakto-quiz-funnel",
    name: "Quiz de Estilo Pessoal - Cakto Style",
    steps: INITIAL_CAKTO_STEPS,
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);

  const currentStep = currentFunnel.steps[currentStepIndex];

  // Funções auxiliares
  const getStepTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      intro: "Introdução",
      question: "Pergunta",
      strategic: "Estratégica",
      transition: "Transição",
      loading: "Carregamento",
      result: "Resultado",
      offer: "Oferta"
    };
    return labels[type] || type;
  };

  const getStepTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      intro: "bg-blue-100 text-blue-800",
      question: "bg-green-100 text-green-800",
      strategic: "bg-orange-100 text-orange-800",
      transition: "bg-purple-100 text-purple-800",
      loading: "bg-gray-100 text-gray-800",
      result: "bg-yellow-100 text-yellow-800",
      offer: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Manipulação de etapas
  const handleStepDragStart = (e: React.DragEvent, index: number) => {
    setDraggedStepIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleStepDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleStepDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedStepIndex === null || draggedStepIndex === dropIndex) return;
    
    const newSteps = [...currentFunnel.steps];
    const draggedStep = newSteps[draggedStepIndex];
    newSteps.splice(draggedStepIndex, 1);
    newSteps.splice(dropIndex, 0, draggedStep);
    
    setCurrentFunnel(prev => ({ ...prev, steps: newSteps }));
    setDraggedStepIndex(null);
  };

  const addNewStep = () => {
    const newStep: CaktoStep = {
      id: `step_${Date.now()}`,
      title: `Etapa ${currentFunnel.steps.length + 1}`,
      type: "question",
      progress: Math.round(((currentFunnel.steps.length + 1) / 22) * 100),
      components: [],
      settings: { showHeader: true, showProgress: true, backgroundColor: "#ffffff" }
    };
    
    setCurrentFunnel(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    setCurrentStepIndex(currentFunnel.steps.length);
  };

  const duplicateStep = (index: number) => {
    const originalStep = currentFunnel.steps[index];
    const duplicatedStep: CaktoStep = {
      ...originalStep,
      id: `step_${Date.now()}`,
      title: `${originalStep.title} (Cópia)`,
      components: originalStep.components.map(comp => ({
        ...comp,
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    
    const newSteps = [...currentFunnel.steps];
    newSteps.splice(index + 1, 0, duplicatedStep);
    
    setCurrentFunnel(prev => ({ ...prev, steps: newSteps }));
  };

  const deleteStep = (index: number) => {
    if (currentFunnel.steps.length <= 1) return;
    
    const newSteps = currentFunnel.steps.filter((_, i) => i !== index);
    setCurrentFunnel(prev => ({ ...prev, steps: newSteps }));
    
    if (currentStepIndex >= newSteps.length) {
      setCurrentStepIndex(newSteps.length - 1);
    } else if (currentStepIndex > index) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Manipulação de componentes
  const addComponent = (type: string, index?: number) => {
    const newComponent: CaktoComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultComponentData(type)
    };

    const newComponents = [...currentStep.components];
    const insertIndex = index !== undefined ? index : newComponents.length;
    newComponents.splice(insertIndex, 0, newComponent);

    updateCurrentStep({ components: newComponents });
    setSelectedComponent(newComponent.id);
  };

  const duplicateComponent = (componentId: string) => {
    const component = currentStep.components.find(c => c.id === componentId);
    if (!component) return;
    
    const duplicatedComponent: CaktoComponent = {
      ...component,
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const componentIndex = currentStep.components.findIndex(c => c.id === componentId);
    const newComponents = [...currentStep.components];
    newComponents.splice(componentIndex + 1, 0, duplicatedComponent);
    
    updateCurrentStep({ components: newComponents });
  };

  const deleteComponent = (componentId: string) => {
    const newComponents = currentStep.components.filter(c => c.id !== componentId);
    updateCurrentStep({ components: newComponents });
    
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
  };

  const updateCurrentStep = (updates: Partial<CaktoStep>) => {
    const newSteps = [...currentFunnel.steps];
    newSteps[currentStepIndex] = { ...currentStep, ...updates };
    setCurrentFunnel(prev => ({ ...prev, steps: newSteps }));
  };

  // Dados padrão para componentes
  const getDefaultComponentData = (type: string): Record<string, any> => {
    switch (type) {
      case "title":
        return { text: "Novo Título", size: "large", alignment: "center" };
      case "subtitle":
        return { text: "Novo Subtítulo", size: "medium", alignment: "center" };
      case "text":
        return { text: "Digite seu texto aqui...", alignment: "left" };
      case "image":
        return { src: "", alt: "Descrição da imagem", width: 400, alignment: "center" };
      case "input":
        return { label: "Campo", placeholder: "Digite aqui...", required: false, type: "text" };
      case "button":
        return { text: "Clique Aqui", variant: "primary", size: "medium" };
      case "options":
        return { 
          question: "Escolha uma opção:",
          options: ["Opção A", "Opção B", "Opção C"],
          multiSelect: false,
          layout: "grid"
        };
      default:
        return {};
    }
  };

  // Renderização de preview de componentes
  const renderComponentPreview = (component: CaktoComponent) => {
    switch (component.type) {
      case "title":
        return (
          <div className={`text-${component.data.alignment || 'center'}`}>
            <h2 className="text-xl font-bold">{component.data.text}</h2>
          </div>
        );
      case "subtitle":
        return (
          <div className={`text-${component.data.alignment || 'center'}`}>
            <h3 className="text-lg font-medium">{component.data.text}</h3>
          </div>
        );
      case "text":
        return (
          <div className={`text-${component.data.alignment || 'left'}`}>
            <p className="text-sm text-gray-600">{component.data.text}</p>
          </div>
        );
      case "image":
        return (
          <div className={`flex justify-${component.data.alignment === 'center' ? 'center' : component.data.alignment || 'center'}`}>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded p-4 text-center w-32 h-20">
              <span className="text-gray-500 text-xs">🖼️ Imagem</span>
            </div>
          </div>
        );
      case "button":
        return (
          <div className="flex justify-center">
            <Button variant="outline" size="sm">
              {component.data.text}
            </Button>
          </div>
        );
      case "input":
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium">{component.data.label}</label>
            <div className="bg-gray-50 border rounded px-3 py-2 text-sm">
              {component.data.placeholder}
            </div>
          </div>
        );
      case "options":
        return (
          <div className="space-y-2">
            <p className="text-sm font-medium">{component.data.question}</p>
            <div className={component.data.layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-1'}>
              {component.data.options.map((option: string, i: number) => (
                <div key={i} className="bg-gray-50 border rounded px-3 py-2 text-sm">
                  {option}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 border rounded p-3 text-center">
            <span className="text-gray-500 text-sm">
              {CAKTO_COMPONENTS.find(p => p.type === component.type)?.icon} {component.type}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="cakto-editor min-h-screen bg-gray-50">
      {/* Header no estilo Cakto */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">Editor CaktoQuiz</h1>
            <Badge variant="outline" className="text-xs">
              {currentFunnel.steps.length} etapas
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Controles de dispositivo */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
                className="rounded-none rounded-l-lg"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('tablet')}
                className="rounded-none"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
                className="rounded-none rounded-r-lg"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Controles de ação */}
            <Button variant="ghost" size="sm">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Layout principal no estilo Cakto */}
      <div className="flex h-[calc(100vh-64px)]">
        
        {/* Coluna 1: Etapas (Sidebar esquerda no estilo Cakto) */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Etapas do Quiz</h3>
              <Badge variant="secondary" className="text-xs">
                {currentFunnel.steps.length}
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {currentFunnel.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`group relative border rounded-lg p-3 cursor-pointer transition-all ${
                    index === currentStepIndex 
                      ? "bg-blue-50 border-blue-200 shadow-sm" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  } ${draggedStepIndex === index ? "opacity-50 rotate-1" : ""}`}
                  onClick={() => setCurrentStepIndex(index)}
                  draggable
                  onDragStart={(e) => handleStepDragStart(e, index)}
                  onDragOver={handleStepDragOver}
                  onDrop={(e) => handleStepDrop(e, index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="drag-handle opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        <Badge variant="secondary" className={`text-xs ${getStepTypeColor(step.type)}`}>
                          {getStepTypeLabel(step.type)}
                        </Badge>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-900 truncate mb-2">
                        {step.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all" 
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{step.progress}%</span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {step.components.length} componente{step.components.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateStep(index);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStep(index);
                        }}
                        disabled={currentFunnel.steps.length <= 1}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={addNewStep}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Etapa
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Coluna 2: Canvas Central */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          {/* Header do canvas */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {currentStep.title}
                </h3>
                <Badge variant="outline" className={`text-xs ${getStepTypeColor(currentStep.type)}`}>
                  {getStepTypeLabel(currentStep.type)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-500">
                  {currentStepIndex + 1} de {currentFunnel.steps.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStepIndex(Math.min(currentFunnel.steps.length - 1, currentStepIndex + 1))}
                  disabled={currentStepIndex === currentFunnel.steps.length - 1}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas de edição */}
          <div className="flex-1 p-4">
            <div className={`mx-auto bg-white rounded-lg shadow-sm border border-gray-200 h-full ${
              deviceView === 'mobile' ? 'max-w-sm' : 
              deviceView === 'tablet' ? 'max-w-2xl' : 
              'max-w-4xl'
            }`}>
              <ScrollArea className="h-full">
                <div 
                  className="p-6 min-h-full"
                  style={{ backgroundColor: currentStep.settings.backgroundColor }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const componentType = e.dataTransfer.getData("component-type");
                    if (componentType) {
                      addComponent(componentType);
                    }
                  }}
                >
                  {currentStep.components.length === 0 ? (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center text-gray-500">
                        <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm">Arraste componentes aqui</p>
                        <p className="text-xs text-gray-400 mt-1">ou use a barra lateral</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentStep.components.map((component, index) => (
                        <div
                          key={component.id}
                          className={`group relative border rounded-lg p-4 transition-all ${
                            selectedComponent === component.id 
                              ? "border-blue-300 bg-blue-50/50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedComponent(component.id)}
                        >
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateComponent(component.id);
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteComponent(component.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="pr-16">
                            {renderComponentPreview(component)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Coluna 3: Componentes e Propriedades */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="border-b border-gray-200">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Componentes</h3>
            </div>
            
            <div className="px-4 pb-4">
              <ScrollArea className="h-64">
                {Object.entries(CAKTO_CATEGORIES).map(([categoryKey, categoryName]) => (
                  <div key={categoryKey} className="mb-4">
                    <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                      {categoryName}
                    </h4>
                    <div className="space-y-1">
                      {CAKTO_COMPONENTS
                        .filter(comp => comp.category === categoryKey)
                        .map(component => (
                          <Button
                            key={component.type}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2"
                            onClick={() => addComponent(component.type)}
                            onDragStart={(e) => {
                              e.dataTransfer.setData("component-type", component.type);
                              e.dataTransfer.effectAllowed = "copy";
                            }}
                            draggable
                          >
                            <span className="mr-2 text-sm">{component.icon}</span>
                            <span className="text-xs">{component.label}</span>
                          </Button>
                        ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>

          {/* Propriedades */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Propriedades</h3>
            
            {selectedComponent ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-600">Componente Selecionado</Label>
                  <p className="text-sm font-medium">
                    {CAKTO_COMPONENTS.find(c => c.type === currentStep.components.find(comp => comp.id === selectedComponent)?.type)?.label}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">ID do Componente</Label>
                    <Input 
                      value={selectedComponent} 
                      disabled 
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tipo</Label>
                    <Input 
                      value={currentStep.components.find(c => c.id === selectedComponent)?.type || ""} 
                      disabled 
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-center text-gray-500">
                <div>
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Selecione um componente</p>
                  <p className="text-xs text-gray-400 mt-1">para editar propriedades</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}