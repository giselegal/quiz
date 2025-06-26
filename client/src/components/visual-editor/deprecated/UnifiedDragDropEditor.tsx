import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save, Trash2, Monitor, Smartphone, Tablet, Type, Image as ImageIcon, 
  MousePointer, Layout, Eye, Plus, ArrowLeft, ArrowRight, Play, Download,
  Video, Star, DollarSign, Clock, Shield, Gift, HelpCircle, Users
} from "lucide-react";

// @dnd-kit - Sistema unificado moderno
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import existing data and components
import { REAL_QUIZ_TEMPLATES } from "@/data/realQuizTemplates";
// Simple component renderer
const SimpleComponentRenderer = ({ component }: { component: ModularComponent }) => {
  switch (component.type) {
    case 'title':
      return <h1 className="text-2xl font-bold">{component.data.text}</h1>;
    case 'paragraph':
      return <p className="text-gray-700">{component.data.text}</p>;
    case 'image':
      return (
        <img 
          src={component.data.src || 'https://via.placeholder.com/400x300'} 
          alt={component.data.alt} 
          className="max-w-full h-auto rounded"
        />
      );
    case 'button':
      return (
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {component.data.text}
        </button>
      );
    case 'question-text-only':
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{component.data.question}</h3>
          <div className="grid grid-cols-2 gap-2">
            {component.data.options?.map((option: any, index: number) => (
              <div 
                key={option.id} 
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                {String.fromCharCode(65 + index)}. {option.text}
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div className="p-4 bg-gray-100 rounded">Componente: {component.type}</div>;
  }
};

// Types
interface ComponentType {
  type: string;
  name: string;
  icon: any;
  description: string;
}

interface ModularComponent {
  id: string;
  type: string;
  data: Record<string, any>;
  style?: Record<string, any>;
}

interface SimplePage {
  id: string;
  title: string;
  type: string;
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: ModularComponent[];
}

interface QuizFunnel {
  id: string;
  name: string;
  pages: SimplePage[];
}

// Sortable Component Wrapper
function SortableComponent({ 
  component, 
  isSelected, 
  onSelect, 
  onDelete 
}: {
  component: ModularComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-2 rounded-lg p-3 mb-2 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 opacity-50 hover:opacity-100 cursor-grab"
        title="Arraste para reposicionar"
      >
        <div className="text-gray-400 text-xs font-bold">⋮⋮</div>
      </div>

      {/* Component Content */}
      <div style={{ paddingLeft: "24px" }}>
        <SimpleComponentRenderer component={component} />
      </div>

      {/* Delete Button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
          title="Excluir componente"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Draggable Library Item
function DraggableLibraryItem({ 
  componentType 
}: { 
  componentType: ComponentType 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({ 
    id: `library-${componentType.type}`,
    data: { type: 'library-item', componentType }
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <componentType.icon className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">{componentType.name}</span>
      </div>
      <p className="text-xs text-gray-500">{componentType.description}</p>
    </div>
  );
}

export default function UnifiedDragDropEditor() {
  // State management - Simple empty funnel for demo
  const [currentFunnel, setCurrentFunnel] = useState<QuizFunnel>({
    id: 'demo-funnel',
    name: 'Demo Funnel',
    pages: [{
      id: 'demo-page',
      title: 'Página Demo',
      type: 'intro',
      progress: 0,
      showHeader: true,
      showProgress: false,
      components: []
    }]
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Component library
  const componentLibrary: ComponentType[] = [
    { type: "title", name: "Título", icon: Type, description: "Título principal" },
    { type: "paragraph", name: "Parágrafo", icon: Type, description: "Texto corrido" },
    { type: "image", name: "Imagem", icon: ImageIcon, description: "Imagem ou foto" },
    { type: "button", name: "Botão", icon: MousePointer, description: "Botão de ação" },
    { type: "video", name: "Vídeo", icon: Video, description: "Player de vídeo" },
    { type: "question-text-only", name: "Questão Texto", icon: HelpCircle, description: "Questão sem imagens" },
  ];

  const currentPage = currentFunnel.pages[currentPageIndex];

  // Create modular component with default data
  const createModularComponent = (type: string): ModularComponent => {
    const baseComponent = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      style: {},
    };

    switch (type) {
      case 'title':
        return { ...baseComponent, data: { text: 'Título Principal' } };
      case 'paragraph':
        return { ...baseComponent, data: { text: 'Este é um parágrafo de exemplo.' } };
      case 'image':
        return { ...baseComponent, data: { src: '', alt: 'Imagem', width: 400, height: 300 } };
      case 'button':
        return { ...baseComponent, data: { text: 'Clique Aqui', link: '#' } };
      case 'question-text-only':
        return {
          ...baseComponent,
          data: {
            question: 'Qual é a sua pergunta?',
            options: [
              { id: 'a', text: 'Opção A' },
              { id: 'b', text: 'Opção B' },
              { id: 'c', text: 'Opção C' },
              { id: 'd', text: 'Opção D' },
            ],
            multiSelect: false,
            maxSelections: 1,
          }
        };
      default:
        return { ...baseComponent, data: {} };
    }
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle library item drop to canvas
    if (active.data.current?.type === 'library-item' && over.id === 'canvas') {
      const componentType = active.data.current.componentType.type;
      const newComponent = createModularComponent(componentType);
      
      setCurrentFunnel(prev => ({
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === currentPageIndex
            ? { ...page, components: [...page.components, newComponent] }
            : page
        ),
      }));
      
      setSelectedComponent(newComponent.id);
      return;
    }

    // Handle component reordering
    if (active.id !== over.id && currentPage.components.find(c => c.id === active.id)) {
      const oldIndex = currentPage.components.findIndex(c => c.id === active.id);
      const newIndex = currentPage.components.findIndex(c => c.id === over.id);
      
      const reorderedComponents = arrayMove(currentPage.components, oldIndex, newIndex);
      
      setCurrentFunnel(prev => ({
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === currentPageIndex
            ? { ...page, components: reorderedComponents }
            : page
        ),
      }));
    }
  };

  // Component management
  const updateComponent = (componentId: string, newData: Partial<ModularComponent["data"]>) => {
    setCurrentFunnel(prev => ({
      ...prev,
      pages: prev.pages.map((page, index) =>
        index === currentPageIndex
          ? {
              ...page,
              components: page.components.map(comp =>
                comp.id === componentId ? { ...comp, data: { ...comp.data, ...newData } } : comp
              ),
            }
          : page
      ),
    }));
  };

  const deleteComponent = (componentId: string) => {
    setCurrentFunnel(prev => ({
      ...prev,
      pages: prev.pages.map((page, index) =>
        index === currentPageIndex
          ? { ...page, components: page.components.filter(comp => comp.id !== componentId) }
          : page
      ),
    }));
    setSelectedComponent(null);
  };

  const selectedComponentData = currentPage.components.find(c => c.id === selectedComponent);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen bg-zinc-50 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-zinc-800">Editor Visual Unificado</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-zinc-600">
                Página {currentPageIndex + 1} de {currentFunnel.pages.length}
              </span>
              <Button variant="outline" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Component Library */}
          <div className="w-64 bg-white border-r border-zinc-200">
            <div className="p-4 border-b border-zinc-200">
              <h2 className="font-semibold text-zinc-800">Componentes</h2>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <SortableContext 
                  items={componentLibrary.map(c => `library-${c.type}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {componentLibrary.map((componentType) => (
                    <DraggableLibraryItem 
                      key={componentType.type}
                      componentType={componentType}
                    />
                  ))}
                </SortableContext>
              </div>
            </ScrollArea>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
              <h3 className="font-medium text-zinc-800">{currentPage.title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              <div
                className={`mx-auto bg-white rounded-lg shadow-sm border border-zinc-200 min-h-96 ${
                  previewMode === 'mobile' ? 'max-w-sm' : 
                  previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-4xl'
                }`}
              >
                <SortableContext 
                  items={[...currentPage.components.map(c => c.id), 'canvas']}
                  strategy={verticalListSortingStrategy}
                >
                  <div 
                    id="canvas"
                    className="p-6 min-h-96"
                  >
                    {currentPage.components.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Layout className="w-12 h-12 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
                        <p className="text-center">
                          Arraste componentes da biblioteca para começar
                        </p>
                      </div>
                    ) : (
                      currentPage.components.map((component) => (
                        <SortableComponent
                          key={component.id}
                          component={component}
                          isSelected={selectedComponent === component.id}
                          onSelect={() => setSelectedComponent(component.id)}
                          onDelete={() => deleteComponent(component.id)}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-white border-l border-zinc-200">
            <div className="p-4 border-b border-zinc-200">
              <h2 className="font-semibold text-zinc-800">Propriedades</h2>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4">
                {selectedComponentData ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Editando: {selectedComponentData.type}</h3>
                    
                    {selectedComponentData.type === 'title' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Texto</label>
                        <input
                          type="text"
                          value={selectedComponentData.data.text || ''}
                          onChange={(e) => updateComponent(selectedComponentData.id, { text: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                    
                    {selectedComponentData.type === 'paragraph' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Texto</label>
                        <textarea
                          value={selectedComponentData.data.text || ''}
                          onChange={(e) => updateComponent(selectedComponentData.id, { text: e.target.value })}
                          className="w-full p-2 border rounded h-24"
                        />
                      </div>
                    )}
                    
                    {selectedComponentData.type === 'button' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Texto do Botão</label>
                        <input
                          type="text"
                          value={selectedComponentData.data.text || ''}
                          onChange={(e) => updateComponent(selectedComponentData.id, { text: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                    
                    {selectedComponentData.type === 'question-text-only' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Pergunta</label>
                          <input
                            type="text"
                            value={selectedComponentData.data.question || ''}
                            onChange={(e) => updateComponent(selectedComponentData.id, { question: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Opções</label>
                          {selectedComponentData.data.options?.map((option: any, index: number) => (
                            <div key={option.id} className="mb-2">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => {
                                  const newOptions = [...selectedComponentData.data.options];
                                  newOptions[index] = { ...option, text: e.target.value };
                                  updateComponent(selectedComponentData.id, { options: newOptions });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded"></div>
                    <p>Selecione um componente para editar suas propriedades</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
            Movendo componente...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}