import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Trash2, GripVertical, Layout, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import "@/styles/enhanced-editor.css";

// Tipos simplificados
interface SimpleComponent {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface SimplePage {
  id: string;
  title: string;
  type: string;
  progress: number;
  components: SimpleComponent[];
}

interface QuizFunnel {
  id: string;
  name: string;
  pages: SimplePage[];
}

// Dados iniciais para o quiz
const INITIAL_QUIZ_PAGES: SimplePage[] = [
  { id: "intro", title: "Introdução", type: "intro", progress: 0, components: [] },
  { id: "q1", title: "Pergunta 1 - Estilo Favorito", type: "question", progress: 6, components: [] },
  { id: "q2", title: "Pergunta 2 - Tipo de Roupa", type: "question", progress: 12, components: [] },
  { id: "q3", title: "Pergunta 3 - Cores Preferidas", type: "question", progress: 18, components: [] },
  { id: "q4", title: "Pergunta 4 - Ocasiões", type: "question", progress: 24, components: [] },
  { id: "q5", title: "Pergunta 5 - Acessórios", type: "question", progress: 30, components: [] },
  { id: "q6", title: "Pergunta 6 - Estampas", type: "question", progress: 36, components: [] },
  { id: "q7", title: "Pergunta 7 - Silhuetas", type: "question", progress: 42, components: [] },
  { id: "q8", title: "Pergunta 8 - Inspirações", type: "question", progress: 48, components: [] },
  { id: "q9", title: "Pergunta 9 - Shopping", type: "question", progress: 54, components: [] },
  { id: "q10", title: "Pergunta 10 - Personalidade", type: "question", progress: 60, components: [] },
  { id: "transition", title: "Transição", type: "transition", progress: 65, components: [] },
  { id: "sq1", title: "Estratégica 1 - Nome", type: "strategic", progress: 70, components: [] },
  { id: "sq2", title: "Estratégica 2 - Email", type: "strategic", progress: 75, components: [] },
  { id: "sq3", title: "Estratégica 3 - WhatsApp", type: "strategic", progress: 80, components: [] },
  { id: "sq4", title: "Estratégica 4 - Idade", type: "strategic", progress: 85, components: [] },
  { id: "sq5", title: "Estratégica 5 - Orçamento", type: "strategic", progress: 90, components: [] },
  { id: "sq6", title: "Estratégica 6 - Interesse", type: "strategic", progress: 95, components: [] },
  { id: "sq7", title: "Estratégica 7 - Compra", type: "strategic", progress: 98, components: [] },
  { id: "loading", title: "Carregamento", type: "loading", progress: 99, components: [] },
  { id: "result", title: "Resultado", type: "result", progress: 100, components: [] },
  { id: "offer", title: "Oferta", type: "offer", progress: 100, components: [] },
];

// Componentes disponíveis
const COMPONENT_PALETTE = [
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

const CATEGORIES = {
  branding: "Marca",
  ui: "Interface",
  content: "Conteúdo", 
  media: "Mídia",
  form: "Formulário",
  layout: "Layout",
  social: "Social"
};

export default function EnhancedEditorSimple() {
  const [currentFunnel, setCurrentFunnel] = useState<QuizFunnel>({
    id: "quiz-funnel",
    name: "Quiz de Estilo Pessoal",
    pages: INITIAL_QUIZ_PAGES,
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);

  const currentPage = currentFunnel.pages[currentPageIndex];

  // Funções auxiliares
  const getPageTypeLabel = (type: string): string => {
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

  // Manipulação de páginas
  const handlePageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPageIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handlePageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedPageIndex === null || draggedPageIndex === dropIndex) return;
    
    const newPages = [...currentFunnel.pages];
    const draggedPage = newPages[draggedPageIndex];
    newPages.splice(draggedPageIndex, 1);
    newPages.splice(dropIndex, 0, draggedPage);
    
    setCurrentFunnel(prev => ({ ...prev, pages: newPages }));
    setDraggedPageIndex(null);
  };

  const addNewPage = () => {
    const newPage: SimplePage = {
      id: `page_${Date.now()}`,
      title: `Etapa ${currentFunnel.pages.length + 1}`,
      type: "question",
      progress: Math.round(((currentFunnel.pages.length + 1) / 21) * 100),
      components: []
    };
    
    setCurrentFunnel(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
    setCurrentPageIndex(currentFunnel.pages.length);
  };

  const duplicatePage = (index: number) => {
    const originalPage = currentFunnel.pages[index];
    const duplicatedPage: SimplePage = {
      ...originalPage,
      id: `page_${Date.now()}`,
      title: `${originalPage.title} (Cópia)`,
      components: originalPage.components.map(comp => ({
        ...comp,
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    
    const newPages = [...currentFunnel.pages];
    newPages.splice(index + 1, 0, duplicatedPage);
    
    setCurrentFunnel(prev => ({ ...prev, pages: newPages }));
  };

  const deletePage = (index: number) => {
    if (currentFunnel.pages.length <= 1) return;
    
    const newPages = currentFunnel.pages.filter((_, i) => i !== index);
    setCurrentFunnel(prev => ({ ...prev, pages: newPages }));
    
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    } else if (currentPageIndex > index) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Manipulação de componentes
  const addComponent = (type: string, index?: number) => {
    const newComponent: SimpleComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultComponentData(type)
    };

    const newComponents = [...currentPage.components];
    const insertIndex = index !== undefined ? index : newComponents.length;
    newComponents.splice(insertIndex, 0, newComponent);

    updateCurrentPage({ components: newComponents });
    setSelectedComponent(newComponent.id);
  };

  const duplicateComponent = (componentId: string) => {
    const component = currentPage.components.find(c => c.id === componentId);
    if (!component) return;
    
    const duplicatedComponent: SimpleComponent = {
      ...component,
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const componentIndex = currentPage.components.findIndex(c => c.id === componentId);
    const newComponents = [...currentPage.components];
    newComponents.splice(componentIndex + 1, 0, duplicatedComponent);
    
    updateCurrentPage({ components: newComponents });
  };

  const deleteComponent = (componentId: string) => {
    const newComponents = currentPage.components.filter(c => c.id !== componentId);
    updateCurrentPage({ components: newComponents });
    
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
  };

  const updateCurrentPage = (updates: Partial<SimplePage>) => {
    const newPages = [...currentFunnel.pages];
    newPages[currentPageIndex] = { ...currentPage, ...updates };
    setCurrentFunnel(prev => ({ ...prev, pages: newPages }));
  };

  // Dados padrão para componentes
  const getDefaultComponentData = (type: string): Record<string, any> => {
    switch (type) {
      case "title":
        return { text: "Novo Título", size: "large" };
      case "subtitle":
        return { text: "Novo Subtítulo", size: "medium" };
      case "text":
        return { text: "Digite seu texto aqui..." };
      case "image":
        return { src: "", alt: "Descrição da imagem", width: 400 };
      case "input":
        return { label: "Campo", placeholder: "Digite aqui...", required: false };
      case "button":
        return { text: "Clique Aqui", variant: "primary" };
      case "options":
        return { 
          question: "Escolha uma opção:",
          options: ["Opção A", "Opção B", "Opção C"],
          multiSelect: false
        };
      default:
        return {};
    }
  };

  // Renderização de preview de componentes
  const renderComponentPreview = (component: SimpleComponent) => {
    switch (component.type) {
      case "title":
        return <h2 className="text-xl font-bold">{component.data.text}</h2>;
      case "subtitle":
        return <h3 className="text-lg font-medium">{component.data.text}</h3>;
      case "text":
        return <p className="text-sm text-gray-600">{component.data.text}</p>;
      case "image":
        return (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded p-4 text-center">
            <span className="text-gray-500 text-sm">🖼️ Imagem</span>
          </div>
        );
      case "button":
        return (
          <Button variant="outline" size="sm">
            {component.data.text}
          </Button>
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
            <div className="grid gap-1">
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
              {COMPONENT_PALETTE.find(p => p.type === component.type)?.icon} {component.type}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="enhanced-editor">
      {/* Header */}
      <div className="editor-header">
        <div className="header-left">
          <h1 className="editor-title">Editor Avançado - Quiz de Estilo</h1>
        </div>
        <div className="header-center">
          <Badge variant="outline">
            {currentFunnel.pages.length} etapas
          </Badge>
        </div>
        <div className="header-right">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Layout de 4 Colunas */}
      <div className="editor-content">
        <div className="editor-layout-4cols">
          
          {/* Coluna 1: Etapas do Quiz */}
          <div className="editor-sidebar steps">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Etapas do Quiz</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {currentFunnel.pages.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {currentFunnel.pages.map((page, index) => (
                      <div
                        key={page.id}
                        className={`step-item ${index === currentPageIndex ? "active" : ""} ${
                          draggedPageIndex === index ? "dragging" : ""
                        }`}
                        onClick={() => setCurrentPageIndex(index)}
                        draggable
                        onDragStart={(e) => handlePageDragStart(e, index)}
                        onDragOver={handlePageDragOver}
                        onDrop={(e) => handlePageDrop(e, index)}
                      >
                        <div className="step-header">
                          <div className="drag-handle">
                            <GripVertical className="w-3 h-3 text-gray-400" />
                          </div>
                          <div className="step-number">{index + 1}</div>
                          <div className="step-info">
                            <div className="step-title">{page.title}</div>
                            <div className="step-type">{getPageTypeLabel(page.type)}</div>
                          </div>
                          <div className="step-actions">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicatePage(index);
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePage(index);
                              }}
                              disabled={currentFunnel.pages.length <= 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="step-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${page.progress}%` }}
                            />
                          </div>
                          <span className="progress-text">{page.progress}%</span>
                        </div>
                        <div className="step-components">
                          {page.components.length} componente{page.components.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={addNewPage}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Etapa
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Componentes */}
          <div className="editor-sidebar components">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Componentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  {Object.entries(CATEGORIES).map(([categoryKey, categoryName]) => (
                    <div key={categoryKey} className="mb-4">
                      <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                        {categoryName}
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {COMPONENT_PALETTE
                          .filter(comp => comp.category === categoryKey)
                          .map(component => (
                            <Button
                              key={component.type}
                              variant="ghost"
                              size="sm"
                              className="justify-start h-8 px-2 cursor-grab"
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
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Canvas Central */}
          <div className="editor-canvas">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {currentPage.title} ({currentPageIndex + 1}/{currentFunnel.pages.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                      disabled={currentPageIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPageIndex(Math.min(currentFunnel.pages.length - 1, currentPageIndex + 1))}
                      disabled={currentPageIndex === currentFunnel.pages.length - 1}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  <div 
                    className="edit-mode"
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
                    {currentPage.components.length === 0 ? (
                      <div className="empty-canvas">
                        <div className="text-center text-gray-500 py-12">
                          <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="text-sm">Arraste componentes da barra lateral</p>
                          <p className="text-xs text-gray-400 mt-1">ou clique nos componentes para adicionar</p>
                        </div>
                      </div>
                    ) : (
                      <div className="components-list">
                        {currentPage.components.map((component, index) => (
                          <div
                            key={component.id}
                            className={`component-item ${selectedComponent === component.id ? "selected" : ""}`}
                            onClick={() => setSelectedComponent(component.id)}
                          >
                            <div className="component-header">
                              <div className="drag-handle">
                                <GripVertical className="w-3 h-3 text-gray-400" />
                              </div>
                              <div className="component-info">
                                <span className="component-type">
                                  {COMPONENT_PALETTE.find(p => p.type === component.type)?.icon}
                                </span>
                                <span className="component-label">
                                  {COMPONENT_PALETTE.find(p => p.type === component.type)?.label}
                                </span>
                              </div>
                              <div className="component-actions">
                                <Button
                                  variant="ghost"
                                  size="sm"
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteComponent(component.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="component-preview">
                              {renderComponentPreview(component)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 4: Propriedades */}
          <div className="editor-sidebar right">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Propriedades</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  {selectedComponent ? (
                    <div className="properties-panel">
                      <p className="text-sm text-gray-600">
                        Editando: {COMPONENT_PALETTE.find(p => p.type === currentPage.components.find(c => c.id === selectedComponent)?.type)?.label}
                      </p>
                      <div className="mt-4 space-y-3">
                        <div>
                          <Label className="text-xs">ID do Componente</Label>
                          <Input 
                            value={selectedComponent} 
                            disabled 
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Tipo</Label>
                          <Input 
                            value={currentPage.components.find(c => c.id === selectedComponent)?.type || ""} 
                            disabled 
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-selection">
                      <div className="text-center text-gray-500 py-8">
                        <Settings className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Selecione um componente</p>
                        <p className="text-xs text-gray-400 mt-1">para editar suas propriedades</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}