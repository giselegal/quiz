import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save,
  Eye,
  Edit3,
  Settings,
  Plus,
  Trash2,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Type,
  Image as ImageIcon,
  MousePointer,
  Layout,
  GripVertical,
  Move,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";

// CSS para drag & drop e edição inline
const DRAG_DROP_CSS = `
  .drag-drop-editor {
    font-family: 'Inter', sans-serif;
  }
  
  .component-library {
    background: #f8fafc;
    border-right: 1px solid #e2e8f0;
  }
  
  .component-item {
    cursor: grab;
    transition: all 0.2s ease;
    border: 2px dashed transparent;
  }
  
  .component-item:hover {
    background: #e2e8f0;
    border-color: #3b82f6;
    transform: translateY(-1px);
  }
  
  .component-item.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
  
  .drop-zone {
    min-height: 20px;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    margin: 4px 0;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .drop-zone.drag-over {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  .drop-zone.active {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }
  
  .component-wrapper {
    position: relative;
    margin: 8px 0;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .component-wrapper:hover {
    border-color: #e2e8f0;
  }
  
  .component-wrapper.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .component-toolbar {
    position: absolute;
    top: -40px;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 4px;
    display: flex;
    gap: 2px;
    opacity: 0;
    transform: translateY(5px);
    transition: all 0.2s ease;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .component-wrapper:hover .component-toolbar,
  .component-wrapper.selected .component-toolbar {
    opacity: 1;
    transform: translateY(0);
  }
  
  .drag-handle {
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    cursor: grab;
    color: #64748b;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .component-wrapper:hover .drag-handle {
    opacity: 1;
  }
  
  .drag-handle:active {
    cursor: grabbing;
  }
  
  .inline-editor {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    resize: none;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    text-align: inherit;
    line-height: inherit;
  }
  
  .inline-editor:focus {
    background: rgba(59, 130, 246, 0.05);
    border-radius: 4px;
    padding: 4px;
  }
  
  .formatting-toolbar {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    gap: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    z-index: 20;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .formatting-toolbar.show {
    opacity: 1;
    visibility: visible;
  }
  
  .quiz-preview {
    background: linear-gradient(135deg, #FFFBF7 0%, #FDF8F3 100%);
    min-height: 100vh;
  }
  
  .quiz-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .quiz-logo {
    max-width: 120px;
    height: auto;
    object-fit: contain;
  }
  
  .quiz-progress-container {
    padding: 0 1rem 2rem;
  }
  
  .quiz-progress-bar {
    width: 100%;
    height: 8px;
    background-color: #E5E7EB;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .quiz-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #B89B7A 0%, #aa6b5d 100%);
    transition: width 0.3s ease;
  }
  
  .quiz-content {
    padding: 0 1rem 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

// Interfaces
interface QuizComponent {
  id: string;
  type:
    | "title"
    | "subtitle"
    | "text"
    | "image"
    | "input"
    | "button"
    | "options"
    | "spacer"
    | "divider";
  data: ComponentData;
  style: ComponentStyle;
}

interface ComponentData {
  text?: string;
  src?: string;
  alt?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  multiSelect?: boolean;
  hasImages?: boolean;
  options?: QuizOption[];
  height?: number;
  width?: number;
}

interface ComponentStyle {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontStyle?: string;
  textDecoration?: string;
}

interface QuizOption {
  id: string;
  text: string;
  image?: string;
  value: string;
  category?: string;
}

interface QuizPage {
  id: string;
  type: "intro" | "question" | "result" | "loading";
  title: string;
  config: PageConfig;
  components: QuizComponent[];
}

interface PageConfig {
  showHeader: boolean;
  showProgress: boolean;
  showBackButton: boolean;
  logoUrl: string;
  backgroundColor: string;
  progressValue: number;
}

import { LucideIcon } from "lucide-react";

// Interface para itens da biblioteca
interface ComponentLibraryItem {
  type: QuizComponent["type"];
  name: string;
  icon: LucideIcon;
  description: string;
  defaultData: ComponentData;
  defaultStyle: ComponentStyle;
}

// Biblioteca de componentes
const COMPONENT_LIBRARY: ComponentLibraryItem[] = [
  {
    type: "title",
    name: "Título",
    icon: Type,
    description: "Título principal da página",
    defaultData: { text: "Novo Título" },
    defaultStyle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center" as const,
      color: "#432818",
    },
  },
  {
    type: "subtitle",
    name: "Subtítulo",
    icon: Type,
    description: "Texto secundário",
    defaultData: { text: "Novo subtítulo" },
    defaultStyle: {
      fontSize: "1.25rem",
      textAlign: "center" as const,
      color: "#6B4F43",
    },
  },
  {
    type: "text",
    name: "Texto",
    icon: Type,
    description: "Parágrafo de texto",
    defaultData: { text: "Digite seu texto aqui..." },
    defaultStyle: {
      fontSize: "1rem",
      textAlign: "left" as const,
      color: "#374151",
    },
  },
  {
    type: "image",
    name: "Imagem",
    icon: ImageIcon,
    description: "Imagem responsiva",
    defaultData: {
      src: "https://via.placeholder.com/400x300/B89B7A/FFFFFF?text=Nova+Imagem",
      alt: "Nova imagem",
    },
    defaultStyle: {},
  },
  {
    type: "input",
    name: "Campo de Entrada",
    icon: Edit3,
    description: "Campo de texto para captura",
    defaultData: {
      label: "CAMPO",
      placeholder: "Digite aqui...",
      required: false,
    },
    defaultStyle: {},
  },
  {
    type: "button",
    name: "Botão",
    icon: MousePointer,
    description: "Botão de ação",
    defaultData: { text: "CLIQUE AQUI" },
    defaultStyle: {},
  },
  {
    type: "options",
    name: "Opções",
    icon: Layout,
    description: "Lista de opções para seleção",
    defaultData: {
      multiSelect: false,
      hasImages: false,
      options: [
        { id: "opt-1", text: "Opção 1", value: "option1" },
        { id: "opt-2", text: "Opção 2", value: "option2" },
      ],
    },
    defaultStyle: {},
  },
  {
    type: "spacer",
    name: "Espaçamento",
    icon: Layout,
    description: "Espaço vertical",
    defaultData: { height: 32 },
    defaultStyle: {},
  },
  {
    type: "divider",
    name: "Divisor",
    icon: Layout,
    description: "Linha divisória",
    defaultData: {},
    defaultStyle: { color: "#e2e8f0" },
  },
];

const DragDropQuizEditor: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<QuizPage>({
    id: "page-1",
    type: "intro",
    title: "Nova Página",
    config: {
      showHeader: true,
      showProgress: true,
      showBackButton: false,
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      backgroundColor: "#FFFBF7",
      progressValue: 14,
    },
    components: [],
  });

  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [draggedComponent, setDraggedComponent] =
    useState<ComponentLibraryItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formattingToolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Aplicar CSS
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = DRAG_DROP_CSS;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Funções de drag & drop
  const handleDragStart = (
    e: React.DragEvent,
    componentType: ComponentLibraryItem
  ) => {
    setDraggedComponent(componentType);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedComponent) {
      const newComponent: QuizComponent = {
        id: `${draggedComponent.type}-${Date.now()}`,
        type: draggedComponent.type,
        data: { ...draggedComponent.defaultData },
        style: { ...draggedComponent.defaultStyle },
      };

      setCurrentPage((prev) => {
        const newComponents = [...prev.components];
        newComponents.splice(index, 0, newComponent);
        return {
          ...prev,
          components: newComponents,
        };
      });

      setSelectedComponent(newComponent.id);
      setDraggedComponent(null);
    }
  };

  const handleComponentDragStart = (
    e: React.DragEvent,
    componentId: string
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("componentId", componentId);
  };

  const handleComponentDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("componentId");

    if (draggedId) {
      const draggedIndex = currentPage.components.findIndex(
        (c) => c.id === draggedId
      );
      if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        const newComponents = [...currentPage.components];
        const [draggedItem] = newComponents.splice(draggedIndex, 1);
        newComponents.splice(targetIndex, 0, draggedItem);

        setCurrentPage((prev) => ({
          ...prev,
          components: newComponents,
        }));
      }
    }
    setDragOverIndex(null);
  };

  // Funções de edição
  const updateComponent = (
    componentId: string,
    newData: Partial<ComponentData>
  ) => {
    setCurrentPage((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.id === componentId
          ? { ...comp, data: { ...comp.data, ...newData } }
          : comp
      ),
    }));
  };

  const updateComponentStyle = (
    componentId: string,
    newStyle: Partial<ComponentStyle>
  ) => {
    setCurrentPage((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.id === componentId
          ? { ...comp, style: { ...comp.style, ...newStyle } }
          : comp
      ),
    }));
  };

  const deleteComponent = (componentId: string) => {
    setCurrentPage((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId),
    }));
    setSelectedComponent(null);
  };

  const duplicateComponent = (componentId: string) => {
    const component = currentPage.components.find((c) => c.id === componentId);
    if (component) {
      const newComponent: QuizComponent = {
        ...component,
        id: `${component.type}-${Date.now()}`,
        data: { ...component.data },
      };

      const index = currentPage.components.findIndex(
        (c) => c.id === componentId
      );
      setCurrentPage((prev) => {
        const newComponents = [...prev.components];
        newComponents.splice(index + 1, 0, newComponent);
        return {
          ...prev,
          components: newComponents,
        };
      });
    }
  };

  const moveComponent = (componentId: string, direction: "up" | "down") => {
    const index = currentPage.components.findIndex((c) => c.id === componentId);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentPage.components.length) return;

    setCurrentPage((prev) => {
      const newComponents = [...prev.components];
      [newComponents[index], newComponents[newIndex]] = [
        newComponents[newIndex],
        newComponents[index],
      ];
      return {
        ...prev,
        components: newComponents,
      };
    });
  };

  // Edição inline
  const handleInlineEdit = (
    componentId: string,
    field: string,
    value: string
  ) => {
    updateComponent(componentId, { [field]: value });
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setShowFormattingToolbar(true);
    } else {
      setShowFormattingToolbar(false);
    }
  };

  // Renderização de componentes
  const renderComponent = (component: QuizComponent, index: number) => {
    const isSelected = selectedComponent === component.id;
    const isEditing = editingComponent === component.id;

    return (
      <div key={component.id} className="relative">
        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragOverIndex === index ? "drag-over" : ""}`}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
        />

        {/* Component Wrapper */}
        <div
          className={`component-wrapper ${isSelected ? "selected" : ""}`}
          onClick={() => setSelectedComponent(component.id)}
          draggable
          onDragStart={(e) => handleComponentDragStart(e, component.id)}
          onDragOver={(e) => handleDragOver(e, index + 1)}
          onDrop={(e) => handleComponentDrop(e, index + 1)}
        >
          {/* Drag Handle */}
          <div className="drag-handle">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Component Toolbar */}
          <div className="component-toolbar">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                moveComponent(component.id, "up");
              }}
              disabled={index === 0}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                moveComponent(component.id, "down");
              }}
              disabled={index === currentPage.components.length - 1}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                duplicateComponent(component.id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                deleteComponent(component.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Component Content */}
          {renderComponentContent(component, isEditing)}
        </div>
      </div>
    );
  };

  const renderComponentContent = (
    component: QuizComponent,
    isEditing: boolean
  ) => {
    const { type, data, style } = component;

    switch (type) {
      case "title":
      case "subtitle":
      case "text":
        return (
          <div
            style={{
              fontSize: style.fontSize || "1rem",
              fontWeight: style.fontWeight || "normal",
              textAlign: style.textAlign || "left",
              color: style.color || "#000000",
              fontStyle: style.fontStyle || "normal",
              textDecoration: style.textDecoration || "none",
              padding: style.padding || "8px 0",
              margin: style.margin || "0",
            }}
            onMouseUp={handleTextSelection}
          >
            {isEditing ? (
              <textarea
                className="inline-editor"
                value={data.text || ""}
                onChange={(e) =>
                  handleInlineEdit(component.id, "text", e.target.value)
                }
                onBlur={() => setEditingComponent(null)}
                autoFocus
                style={{
                  minHeight:
                    type === "title"
                      ? "60px"
                      : type === "subtitle"
                      ? "40px"
                      : "30px",
                }}
              />
            ) : (
              <div
                onClick={() => setEditingComponent(component.id)}
                style={{ cursor: "text", minHeight: "20px" }}
              >
                {data.text || "Clique para editar..."}
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div
            className="text-center"
            style={{ padding: style.padding || "16px 0" }}
          >
            <img
              src={data.src || "https://via.placeholder.com/400x300"}
              alt={data.alt || "Imagem"}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: style.borderRadius || "8px",
                width: data.width ? `${data.width}px` : "auto",
              }}
            />
          </div>
        );

      case "input":
        return (
          <div style={{ margin: style.margin || "16px 0" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#432818",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {isEditing ? (
                <input
                  className="inline-editor"
                  value={data.label || ""}
                  onChange={(e) =>
                    handleInlineEdit(component.id, "label", e.target.value)
                  }
                  onBlur={() => setEditingComponent(null)}
                  autoFocus
                />
              ) : (
                <span onClick={() => setEditingComponent(component.id)}>
                  {data.label || "CAMPO"}
                </span>
              )}
              {data.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <input
              type="text"
              placeholder={data.placeholder || "Digite aqui..."}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>
        );

      case "button":
        return (
          <div
            style={{
              textAlign: style.textAlign || "center",
              margin: style.margin || "16px 0",
            }}
          >
            <button
              style={{
                padding: "12px 24px",
                background:
                  style.backgroundColor ||
                  "linear-gradient(135deg, #B89B7A 0%, #aa6b5d 100%)",
                color: style.color || "white",
                border: "none",
                borderRadius: style.borderRadius || "8px",
                fontSize: style.fontSize || "1rem",
                fontWeight: style.fontWeight || "600",
                cursor: "pointer",
              }}
            >
              {isEditing ? (
                <input
                  className="inline-editor"
                  value={data.text || ""}
                  onChange={(e) =>
                    handleInlineEdit(component.id, "text", e.target.value)
                  }
                  onBlur={() => setEditingComponent(null)}
                  autoFocus
                  style={{ background: "transparent", color: "inherit" }}
                />
              ) : (
                <span onClick={() => setEditingComponent(component.id)}>
                  {data.text || "BOTÃO"}
                </span>
              )}
            </button>
          </div>
        );

      case "options":
        return (
          <div style={{ margin: style.margin || "16px 0" }}>
            {data.options?.map((option: QuizOption) => (
              <div
                key={option.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  margin: "8px 0",
                  background: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                {data.hasImages && option.image && (
                  <img
                    src={option.image}
                    alt={option.text}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "12px",
                    }}
                  />
                )}
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        );

      case "spacer":
        return (
          <div
            style={{
              height: `${data.height || 32}px`,
              border: "1px dashed #cbd5e1",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "0.75rem",
              opacity: 0.5,
            }}
          >
            Espaçamento ({data.height || 32}px)
          </div>
        );

      case "divider":
        return (
          <hr
            style={{
              border: "none",
              borderTop: `1px solid ${style.color || "#e2e8f0"}`,
              margin: style.margin || "24px 0",
              opacity: 0.6,
            }}
          />
        );

      default:
        return <div>Componente não reconhecido</div>;
    }
  };

  const renderPropertiesPanel = () => {
    const component = currentPage.components.find(
      (c) => c.id === selectedComponent
    );
    if (!component) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Propriedades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Propriedades específicas do componente */}
          {component.type === "image" && (
            <>
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={component.data.src || ""}
                  onChange={(e) =>
                    updateComponent(component.id, { src: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Largura (px)</Label>
                <Input
                  type="number"
                  value={component.data.width || ""}
                  onChange={(e) =>
                    updateComponent(component.id, {
                      width: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </>
          )}

          {component.type === "spacer" && (
            <div>
              <Label>Altura (px)</Label>
              <Input
                type="number"
                value={component.data.height || 32}
                onChange={(e) =>
                  updateComponent(component.id, {
                    height: parseInt(e.target.value) || 32,
                  })
                }
              />
            </div>
          )}

          {/* Propriedades de estilo para textos */}
          {["title", "subtitle", "text"].includes(component.type) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Formatação</Label>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      component.style.textAlign === "left"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateComponentStyle(component.id, { textAlign: "left" })
                    }
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      component.style.textAlign === "center"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateComponentStyle(component.id, {
                        textAlign: "center",
                      })
                    }
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      component.style.textAlign === "right"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateComponentStyle(component.id, { textAlign: "right" })
                    }
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      component.style.fontWeight === "bold"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateComponentStyle(component.id, {
                        fontWeight:
                          component.style.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                      })
                    }
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      component.style.fontStyle === "italic"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateComponentStyle(component.id, {
                        fontStyle:
                          component.style.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                      })
                    }
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      component.style.textDecoration === "underline"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateComponentStyle(component.id, {
                        textDecoration:
                          component.style.textDecoration === "underline"
                            ? "none"
                            : "underline",
                      })
                    }
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label>Cor do Texto</Label>
                  <Input
                    type="color"
                    value={component.style.color || "#000000"}
                    onChange={(e) =>
                      updateComponentStyle(component.id, {
                        color: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Tamanho da Fonte</Label>
                  <Select
                    value={component.style.fontSize || "1rem"}
                    onValueChange={(value) =>
                      updateComponentStyle(component.id, { fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.75rem">Pequeno</SelectItem>
                      <SelectItem value="1rem">Normal</SelectItem>
                      <SelectItem value="1.25rem">Médio</SelectItem>
                      <SelectItem value="1.5rem">Grande</SelectItem>
                      <SelectItem value="2rem">Muito Grande</SelectItem>
                      <SelectItem value="2.5rem">Extra Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <Separator />
          <Button
            variant="destructive"
            onClick={() => deleteComponent(component.id)}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover
          </Button>
        </CardContent>
      </Card>
    );
  };

  const getDeviceClass = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-md mx-auto";
      case "desktop":
        return "max-w-2xl mx-auto";
      default:
        return "max-w-2xl mx-auto";
    }
  };

  return (
    <div className="h-screen flex bg-background drag-drop-editor">
      {/* Biblioteca de Componentes */}
      <div className="w-80 component-library overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Editor Modular</h2>

          <div className="flex gap-1 mb-4">
            <Button
              variant={deviceView === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* Configurações da Página */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentPage.config.showHeader}
                    onCheckedChange={(checked) =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        config: { ...prev.config, showHeader: checked },
                      }))
                    }
                  />
                  <Label>Header</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentPage.config.showProgress}
                    onCheckedChange={(checked) =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        config: { ...prev.config, showProgress: checked },
                      }))
                    }
                  />
                  <Label>Progresso</Label>
                </div>
              </CardContent>
            </Card>

            {/* Biblioteca de Componentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Componentes</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Arraste e solte no editor
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {COMPONENT_LIBRARY.map((componentType) => {
                    const Icon = componentType.icon;
                    return (
                      <div
                        key={componentType.type}
                        className="component-item p-3 rounded-lg border cursor-grab"
                        draggable
                        onDragStart={(e) => handleDragStart(e, componentType)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium text-sm">
                              {componentType.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {componentType.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Painel de Propriedades */}
            {selectedComponent && renderPropertiesPanel()}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Principal */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge>{currentPage.type}</Badge>
              <span className="font-medium">{currentPage.title}</span>
            </div>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>

          {/* Preview Area */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`quiz-preview ${getDeviceClass()}`} ref={editorRef}>
              {/* Header */}
              {currentPage.config.showHeader && (
                <div className="quiz-header">
                  <img
                    src={currentPage.config.logoUrl}
                    alt="Logo"
                    className="quiz-logo"
                  />
                </div>
              )}

              {/* Progress Bar */}
              {currentPage.config.showProgress && (
                <div className="quiz-progress-container">
                  <div className="quiz-progress-bar">
                    <div
                      className="quiz-progress-fill"
                      style={{ width: `${currentPage.config.progressValue}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className="quiz-content">
                {/* Drop Zone para componentes vazios */}
                {currentPage.components.length === 0 && (
                  <div
                    className="drop-zone active"
                    style={{
                      minHeight: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onDragOver={(e) => handleDragOver(e, 0)}
                    onDrop={(e) => handleDrop(e, 0)}
                  >
                    <p className="text-gray-500">
                      Arraste componentes aqui para começar a construir sua
                      página
                    </p>
                  </div>
                )}

                {/* Componentes */}
                {currentPage.components.map((component, index) =>
                  renderComponent(component, index)
                )}

                {/* Drop zone final */}
                {currentPage.components.length > 0 && (
                  <div
                    className={`drop-zone ${
                      dragOverIndex === currentPage.components.length
                        ? "drag-over"
                        : ""
                    }`}
                    onDragOver={(e) =>
                      handleDragOver(e, currentPage.components.length)
                    }
                    onDrop={(e) => handleDrop(e, currentPage.components.length)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar de Formatação */}
      {showFormattingToolbar && (
        <div ref={formattingToolbarRef} className="formatting-toolbar show">
          <Button size="sm" variant="outline">
            <Bold className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Italic className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Underline className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Palette className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DragDropQuizEditor;
