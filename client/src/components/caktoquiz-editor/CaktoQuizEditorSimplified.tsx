import React, { useState, useCallback } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Undo, Redo, Play, Save, X, Smartphone, Monitor,
  PencilRuler, Workflow, Palette, Type, Image, 
  RectangleHorizontal, TextCursorInput, Space,
  Music, Video, HelpCircle, Star, DollarSign,
  List, FileText, Plus, GripVertical, Eye,
  Trash2, Copy, Move, ChevronLeft, ChevronRight,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interfaces simplificadas
interface CaktoComponent {
  id: string;
  type: "text" | "heading" | "image" | "button" | "input" | "spacer" | "options";
  props: {
    text?: string;
    src?: string;
    alt?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    options?: Array<{ id: string; text: string; value: string }>;
    multiSelect?: boolean;
    columns?: number;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    textAlign?: "left" | "center" | "right";
    padding?: string;
    margin?: string;
  };
}

interface CaktoStep {
  id: string;
  title: string;
  type: "intro" | "question" | "result" | "offer";
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: CaktoComponent[];
}

interface CaktoProject {
  id: string;
  name: string;
  steps: CaktoStep[];
}

// Componente de item da biblioteca
const LibraryItem = ({ component, onDragStart }: { 
  component: { id: string; label: string; icon: React.ElementType };
  onDragStart: (component: any) => void;
}) => {
  const Icon = component.icon;
  
  return (
    <motion.div
      draggable
      onDragStart={() => onDragStart(component)}
      className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-grab active:cursor-grabbing transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 text-center">
        {component.label}
      </span>
    </motion.div>
  );
};

// Item de etapa ordenável
const SortableStepItem = ({ step, isActive, onClick }: {
  step: CaktoStep;
  isActive: boolean;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "intro": return <Play className="h-3 w-3" />;
      case "question": return <HelpCircle className="h-3 w-3" />;
      case "result": return <Star className="h-3 w-3" />;
      case "offer": return <DollarSign className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        group relative flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all duration-200
        ${isActive 
          ? "border-blue-500 bg-blue-50 shadow-sm" 
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }
        ${isDragging ? "opacity-50 shadow-lg" : ""}
      `}
      onClick={onClick}
    >
      <div
        {...listeners}
        className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3 w-3" />
      </div>
      
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`
          flex items-center justify-center w-6 h-6 rounded text-xs
          ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}
        `}>
          {getStepIcon(step.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-900 truncate">
            {step.title}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {step.type}
          </div>
        </div>
      </div>
      
      <Badge variant="secondary" className="text-xs">
        {step.components.length}
      </Badge>
    </div>
  );
};

// Componente no canvas
const CanvasComponent = ({ component, isSelected, onSelect, onUpdate, onDelete }: {
  component: CaktoComponent;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CaktoComponent>) => void;
  onDelete: () => void;
}) => {
  const renderComponent = () => {
    switch (component.type) {
      case "heading":
        return (
          <h2 
            className="font-bold"
            style={{
              fontSize: component.props.fontSize || "1.5rem",
              color: component.props.textColor || "#000",
              textAlign: component.props.textAlign || "left"
            }}
          >
            {component.props.text || "Título"}
          </h2>
        );
      
      case "text":
        return (
          <p 
            style={{
              fontSize: component.props.fontSize || "1rem",
              color: component.props.textColor || "#000",
              textAlign: component.props.textAlign || "left"
            }}
          >
            {component.props.text || "Texto"}
          </p>
        );
      
      case "image":
        return (
          <img
            src={component.props.src || "https://via.placeholder.com/300x200"}
            alt={component.props.alt || "Imagem"}
            className="max-w-full h-auto rounded"
          />
        );
      
      case "button":
        return (
          <Button
            style={{
              backgroundColor: component.props.backgroundColor || "#3b82f6",
              color: component.props.textColor || "#fff"
            }}
          >
            {component.props.text || "Botão"}
          </Button>
        );
      
      case "options":
        return (
          <div className={`grid gap-2 ${component.props.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {(component.props.options || []).map((option, index) => (
              <div
                key={option.id || index}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-sm">{option.text || `Opção ${index + 1}`}</span>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <span className="text-sm text-gray-600">
              Componente {component.type}
            </span>
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      className={`
        relative group cursor-pointer transition-all duration-200
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:ring-1 hover:ring-gray-300"}
      `}
      onClick={onSelect}
      style={{
        padding: component.props.padding || "8px",
        margin: component.props.margin || "8px 0"
      }}
      whileHover={{ scale: 1.01 }}
    >
      {renderComponent()}
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-2 -right-2 flex gap-1"
        >
          <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
            <Move className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Componente principal
export default function CaktoQuizEditorSimplified() {
  const [project, setProject] = useState<CaktoProject>({
    id: "project-1",
    name: "Novo Projeto CaktoQuiz",
    steps: [
      {
        id: "step-intro",
        title: "Introdução",
        type: "intro",
        progress: 0,
        showHeader: true,
        showProgress: true,
        components: []
      }
    ]
  });

  const [activeStepId, setActiveStepId] = useState(project.steps[0]?.id);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"build" | "flow" | "design">("build");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeStep = project.steps.find(step => step.id === activeStepId);
  const selectedComponent = activeStep?.components.find(comp => comp.id === selectedComponentId);

  // Biblioteca de componentes
  const componentLibrary = [
    { id: "heading", label: "Título", icon: Type },
    { id: "text", label: "Texto", icon: FileText },
    { id: "image", label: "Imagem", icon: Image },
    { id: "button", label: "Botão", icon: RectangleHorizontal },
    { id: "input", label: "Entrada", icon: TextCursorInput },
    { id: "options", label: "Opções", icon: List },
    { id: "spacer", label: "Espaço", icon: Space }
  ];

  const addComponent = (componentType: string, stepId: string) => {
    const newComponent: CaktoComponent = {
      id: `comp-${Date.now()}`,
      type: componentType as any,
      props: getDefaultProps(componentType)
    };

    setProject(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, components: [...step.components, newComponent] }
          : step
      )
    }));
  };

  const updateComponent = (componentId: string, updates: Partial<CaktoComponent>) => {
    setProject(prev => ({
      ...prev,
      steps: prev.steps.map(step => ({
        ...step,
        components: step.components.map(comp =>
          comp.id === componentId ? { ...comp, ...updates } : comp
        )
      }))
    }));
  };

  const deleteComponent = (componentId: string) => {
    setProject(prev => ({
      ...prev,
      steps: prev.steps.map(step => ({
        ...step,
        components: step.components.filter(comp => comp.id !== componentId)
      }))
    }));
    
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  const getDefaultProps = (componentType: string) => {
    switch (componentType) {
      case "heading":
        return { text: "Novo Título", fontSize: "1.5rem" };
      case "text":
        return { text: "Novo texto" };
      case "button":
        return { text: "Clique aqui", backgroundColor: "#3b82f6", textColor: "#fff" };
      case "options":
        return { 
          options: [
            { id: "opt1", text: "Opção 1", value: "1" },
            { id: "opt2", text: "Opção 2", value: "2" }
          ],
          multiSelect: false,
          columns: 1
        };
      default:
        return {};
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id.toString().startsWith('library-') && over.id === 'canvas-drop-zone') {
      const componentType = active.id.toString().replace('library-', '');
      if (activeStepId) {
        addComponent(componentType, activeStepId);
      }
    }
    
    setDraggedComponent(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedComponent(event.active);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar Superior - Estilo CaktoQuiz */}
      <nav className="h-14 bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-zinc-800">
            <X className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 bg-zinc-700" />
          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={activeTab === 'build' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('build')}
            className={activeTab === 'build' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}
          >
            <PencilRuler className="h-4 w-4 mr-2" />
            Construtor
          </Button>
          <Button 
            variant={activeTab === 'flow' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('flow')}
            className={activeTab === 'flow' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}
          >
            <Workflow className="h-4 w-4 mr-2" />
            Fluxo
          </Button>
          <Button 
            variant={activeTab === 'design' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('design')}
            className={activeTab === 'design' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}
          >
            <Palette className="h-4 w-4 mr-2" />
            Design
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewportMode(viewportMode === 'desktop' ? 'mobile' : 'desktop')}
            className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            {viewportMode === 'desktop' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
            Salvar
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            Publicar
          </Button>
        </div>
      </nav>

      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar de Etapas */}
          <div className={`${sidebarCollapsed ? 'w-12' : 'w-60'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
            {!sidebarCollapsed && (
              <>
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Etapas</h3>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-2">
                  <SortableContext items={project.steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {project.steps.map((step) => (
                        <SortableStepItem
                          key={step.id}
                          step={step}
                          isActive={step.id === activeStepId}
                          onClick={() => setActiveStepId(step.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </ScrollArea>
              </>
            )}
            
            <div className="p-2 border-t border-gray-200">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Biblioteca de Componentes */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Componentes</h3>
            </div>
            
            <ScrollArea className="flex-1 p-3">
              <div className="grid grid-cols-2 gap-2">
                {componentLibrary.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={() => setDraggedComponent({ id: `library-${component.id}` })}
                  >
                    <LibraryItem
                      component={component}
                      onDragStart={() => setDraggedComponent({ id: `library-${component.id}` })}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Canvas Principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activeStep?.title || "Etapa"}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {activeStep?.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <div className={`mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
                viewportMode === 'mobile' ? 'w-80' : 'max-w-4xl'
              }`}>
                {activeStep?.showHeader && (
                  <div className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Header do Quiz</div>
                  </div>
                )}
                
                {activeStep?.showProgress && (
                  <div className="h-2 bg-gray-200">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${activeStep?.progress || 0}%` }}
                    />
                  </div>
                )}
                
                <div 
                  className="min-h-96 p-4"
                  id="canvas-drop-zone"
                >
                  {activeStep?.components.length === 0 ? (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center text-gray-500">
                        <div className="text-lg mb-2">Canvas Vazio</div>
                        <div className="text-sm">Arraste componentes da biblioteca</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeStep.components.map((component) => (
                        <CanvasComponent
                          key={component.id}
                          component={component}
                          isSelected={component.id === selectedComponentId}
                          onSelect={() => setSelectedComponentId(component.id)}
                          onUpdate={(updates) => updateComponent(component.id, updates)}
                          onDelete={() => deleteComponent(component.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Painel de Propriedades */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedComponent ? "Propriedades" : "Configurações"}
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-3">
              {selectedComponent ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Conteúdo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(selectedComponent.type === "heading" || selectedComponent.type === "text" || selectedComponent.type === "button") && (
                        <div>
                          <Label className="text-xs">Texto</Label>
                          <Input
                            value={selectedComponent.props.text || ""}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              props: { ...selectedComponent.props, text: e.target.value }
                            })}
                            className="h-8 text-sm"
                          />
                        </div>
                      )}
                      
                      {selectedComponent.type === "image" && (
                        <div>
                          <Label className="text-xs">URL da Imagem</Label>
                          <Input
                            value={selectedComponent.props.src || ""}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              props: { ...selectedComponent.props, src: e.target.value }
                            })}
                            className="h-8 text-sm"
                            placeholder="https://..."
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Estilo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs">Cor do Texto</Label>
                        <Input
                          type="color"
                          value={selectedComponent.props.textColor || "#000000"}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, textColor: e.target.value }
                          })}
                          className="h-8 w-full"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Tamanho da Fonte</Label>
                        <Select
                          value={selectedComponent.props.fontSize || "1rem"}
                          onValueChange={(value) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, fontSize: value }
                          })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.75rem">Pequeno</SelectItem>
                            <SelectItem value="1rem">Normal</SelectItem>
                            <SelectItem value="1.25rem">Grande</SelectItem>
                            <SelectItem value="1.5rem">Extra Grande</SelectItem>
                            <SelectItem value="2rem">Muito Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Alinhamento</Label>
                        <Select
                          value={selectedComponent.props.textAlign || "left"}
                          onValueChange={(value: "left" | "center" | "right") => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, textAlign: value }
                          })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Esquerda</SelectItem>
                            <SelectItem value="center">Centro</SelectItem>
                            <SelectItem value="right">Direita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Configurações da Etapa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs">Título</Label>
                        <Input
                          value={activeStep?.title || ""}
                          onChange={(e) => {
                            if (activeStep && activeStepId) {
                              setProject(prev => ({
                                ...prev,
                                steps: prev.steps.map(step =>
                                  step.id === activeStep.id
                                    ? { ...step, title: e.target.value }
                                    : step
                                )
                              }));
                            }
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Tipo</Label>
                        <Select
                          value={activeStep?.type || "intro"}
                          onValueChange={(value: "intro" | "question" | "result" | "offer") => {
                            if (activeStep && activeStepId) {
                              setProject(prev => ({
                                ...prev,
                                steps: prev.steps.map(step =>
                                  step.id === activeStep.id
                                    ? { ...step, type: value }
                                    : step
                                )
                              }));
                            }
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intro">Introdução</SelectItem>
                            <SelectItem value="question">Questão</SelectItem>
                            <SelectItem value="result">Resultado</SelectItem>
                            <SelectItem value="offer">Oferta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Mostrar Header</Label>
                        <Switch
                          checked={activeStep?.showHeader || false}
                          onCheckedChange={(checked) => {
                            if (activeStep && activeStepId) {
                              setProject(prev => ({
                                ...prev,
                                steps: prev.steps.map(step =>
                                  step.id === activeStep.id
                                    ? { ...step, showHeader: checked }
                                    : step
                                )
                              }));
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Mostrar Progresso</Label>
                        <Switch
                          checked={activeStep?.showProgress || false}
                          onCheckedChange={(checked) => {
                            if (activeStep && activeStepId) {
                              setProject(prev => ({
                                ...prev,
                                steps: prev.steps.map(step =>
                                  step.id === activeStep.id
                                    ? { ...step, showProgress: checked }
                                    : step
                                )
                              }));
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DragOverlay>
          {draggedComponent && (
            <div className="p-2 bg-white border border-blue-300 rounded-lg shadow-lg">
              <span className="text-sm font-medium text-blue-600">
                Componente sendo arrastado
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}