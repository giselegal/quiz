import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

// Interfaces para o sistema de quiz
interface QuizPage {
  id: string;
  type: "intro" | "question" | "result" | "loading";
  title: string;
  subtitle?: string;
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

interface QuizComponent {
  id: string;
  type:
    | "title"
    | "subtitle"
    | "image"
    | "input"
    | "button"
    | "options"
    | "spacer";
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
}

interface QuizOption {
  id: string;
  text: string;
  image?: string;
  value: string;
  category?: string;
}

// CSS do quiz original - copiado fielmente
const QUIZ_ORIGINAL_CSS = `
  .quiz-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #FFFBF7 0%, #FDF8F3 100%);
    font-family: 'Inter', sans-serif;
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
  
  .quiz-back-button {
    position: absolute;
    left: 1rem;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  .quiz-back-button:hover {
    background-color: rgba(184, 155, 122, 0.1);
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
  
  .quiz-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #432818;
    text-align: center;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  
  .quiz-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: #6B4F43;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  .quiz-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 16px;
    margin: 0 auto 2rem;
    display: block;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .quiz-input-group {
    margin-bottom: 2rem;
  }
  
  .quiz-input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #432818;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .quiz-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.2s;
    background: white;
  }
  
  .quiz-input:focus {
    outline: none;
    border-color: #B89B7A;
    box-shadow: 0 0 0 3px rgba(184, 155, 122, 0.1);
  }
  
  .quiz-button {
    width: 100%;
    padding: 1.25rem 2rem;
    background: linear-gradient(135deg, #B89B7A 0%, #aa6b5d 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 1rem;
  }
  
  .quiz-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(184, 155, 122, 0.3);
  }
  
  .quiz-options {
    display: grid;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .quiz-option {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    background: white;
    border: 2px solid #E5E7EB;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .quiz-option:hover {
    border-color: #B89B7A;
    box-shadow: 0 4px 20px rgba(184, 155, 122, 0.1);
  }
  
  .quiz-option.selected {
    border-color: #B89B7A;
    background: rgba(184, 155, 122, 0.05);
  }
  
  .quiz-option-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .quiz-option-text {
    font-size: 1rem;
    color: #432818;
    font-weight: 500;
    line-height: 1.4;
  }
  
  @media (max-width: 640px) {
    .quiz-content {
      padding: 0 1rem 1rem;
    }
    
    .quiz-option {
      padding: 1rem;
    }
    
    .quiz-option-image {
      width: 60px;
      height: 60px;
    }
    
    .quiz-button {
      padding: 1rem 1.5rem;
      font-size: 1rem;
    }
  }
`;

// Templates das páginas reais do quiz
const QUIZ_TEMPLATES = {
  intro: {
    title: "Teste de Estilo Pessoal",
    subtitle:
      "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
    image:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
    inputLabel: "NOME",
    inputPlaceholder: "Digite seu nome aqui...",
    buttonText: "COMEÇAR AGORA",
  },

  visualQuestion: {
    title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    options: [
      {
        text: "Conforto, leveza e praticidade no vestir",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
        category: "Natural",
      },
      {
        text: "Discrição, caimento clássico e sobriedade",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
        category: "Clássico",
      },
      {
        text: "Informação de moda, inovação e funcionalidade",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/13_qccdqv.webp",
        category: "Contemporâneo",
      },
      {
        text: "Luxo, refinamento e qualidade",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_rqy7yh.webp",
        category: "Elegante",
      },
      {
        text: "Feminilidade, delicadeza e charme",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/15_kpqhgl.webp",
        category: "Romântico",
      },
      {
        text: "Sensualidade, glamour e sedução",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735331/16_oqc9gd.webp",
        category: "Sexy",
      },
      {
        text: "Imponência, sofisticação e poder",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735331/17_iqr8th.webp",
        category: "Dramático",
      },
      {
        text: "Originalidade, criatividade e personalidade",
        image:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735331/18_o5gzhu.webp",
        category: "Criativo",
      },
    ],
  },

  textQuestion: {
    title: "RESUMA A SUA PERSONALIDADE:",
    options: [
      {
        text: "Informal, espontânea, alegre, essencialista",
        category: "Natural",
      },
      { text: "Conservadora, séria, organizada", category: "Clássico" },
      { text: "Informada, ativa, prática", category: "Contemporâneo" },
      { text: "Exigente, sofisticada, seletiva", category: "Elegante" },
      { text: "Feminina, meiga, delicada, sensível", category: "Romântico" },
      { text: "Glamorosa, vaidosa, sensual", category: "Sexy" },
      { text: "Cosmopolita, moderna e audaciosa", category: "Dramático" },
      { text: "Exótica, aventureira, livre", category: "Criativo" },
    ],
  },
};

const FaithfulQuizEditor: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<QuizPage>({
    id: "page-1",
    type: "intro",
    title: "Página de Introdução",
    config: {
      showHeader: true,
      showProgress: true,
      showBackButton: false,
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      backgroundColor: "#FFFBF7",
      progressValue: 14,
    },
    components: [
      {
        id: "title-1",
        type: "title",
        data: { text: "Teste de Estilo Pessoal" },
        style: {
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#432818",
        },
      },
      {
        id: "image-1",
        type: "image",
        data: {
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
          alt: "Imagem de introdução",
        },
        style: {},
      },
      {
        id: "subtitle-1",
        type: "subtitle",
        data: {
          text: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
        },
        style: { textAlign: "center", fontSize: "1.25rem", color: "#6B4F43" },
      },
      {
        id: "input-1",
        type: "input",
        data: {
          label: "NOME",
          placeholder: "Digite seu nome aqui...",
          required: true,
        },
        style: {},
      },
      {
        id: "button-1",
        type: "button",
        data: { text: "COMEÇAR AGORA" },
        style: {},
      },
    ],
  });

  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Aplicar CSS personalizado
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = QUIZ_ORIGINAL_CSS;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Funções de manipulação
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

  const addComponent = (type: QuizComponent["type"]) => {
    const newComponent: QuizComponent = {
      id: `${type}-${Date.now()}`,
      type: type,
      data: getDefaultComponentData(type),
      style: getDefaultComponentStyle(type),
    };

    setCurrentPage((prev) => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));
  };

  const getDefaultComponentData = (type: string) => {
    switch (type) {
      case "title":
        return { text: "Novo Título" };
      case "subtitle":
        return { text: "Novo subtítulo" };
      case "image":
        return {
          src: "https://via.placeholder.com/400x300",
          alt: "Nova imagem",
        };
      case "input":
        return {
          label: "CAMPO",
          placeholder: "Digite aqui...",
          required: false,
        };
      case "button":
        return { text: "BOTÃO" };
      case "options":
        return {
          multiSelect: false,
          options: [
            { id: "opt-1", text: "Opção 1", value: "option1" },
            { id: "opt-2", text: "Opção 2", value: "option2" },
          ],
        };
      case "spacer":
        return { height: 32 };
      default:
        return {};
    }
  };

  const getDefaultComponentStyle = (type: string): ComponentStyle => {
    switch (type) {
      case "title":
        return {
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#432818",
        };
      case "subtitle":
        return { textAlign: "center", fontSize: "1.25rem", color: "#6B4F43" };
      default:
        return {};
    }
  };

  const deleteComponent = (componentId: string) => {
    setCurrentPage((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId),
    }));
    setSelectedComponent(null);
  };

  const loadTemplate = (templateType: keyof typeof QUIZ_TEMPLATES) => {
    const template = QUIZ_TEMPLATES[templateType];
    let components: QuizComponent[] = [];

    if (templateType === "intro") {
      components = [
        {
          id: "title-template",
          type: "title",
          data: { text: template.title },
          style: {
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#432818",
          },
        },
        {
          id: "image-template",
          type: "image",
          data: { src: template.image, alt: "Imagem de introdução" },
          style: {},
        },
        {
          id: "subtitle-template",
          type: "subtitle",
          data: { text: template.subtitle },
          style: { textAlign: "center", fontSize: "1.25rem", color: "#6B4F43" },
        },
        {
          id: "input-template",
          type: "input",
          data: {
            label: template.inputLabel,
            placeholder: template.inputPlaceholder,
            required: true,
          },
          style: {},
        },
        {
          id: "button-template",
          type: "button",
          data: { text: template.buttonText },
          style: {},
        },
      ];
    } else if (
      templateType === "visualQuestion" ||
      templateType === "textQuestion"
    ) {
      components = [
        {
          id: "title-template",
          type: "title",
          data: { text: template.title },
          style: {
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "700",
            color: "#432818",
          },
        },
        {
          id: "options-template",
          type: "options",
          data: {
            multiSelect: false,
            hasImages: templateType === "visualQuestion",
            options: template.options,
          },
          style: {},
        },
      ];
    }

    setCurrentPage((prev) => ({
      ...prev,
      type: templateType === "intro" ? "intro" : "question",
      components,
    }));
  };

  // Renderização fiel do quiz original
  const renderFaithfulPreview = () => {
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
      <div className={`quiz-container min-h-screen ${getDeviceClass()}`}>
        {/* Header */}
        {currentPage.config.showHeader && (
          <div className="quiz-header">
            {currentPage.config.showBackButton && (
              <button className="quiz-back-button">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
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

        {/* Content */}
        <div className="quiz-content">
          {currentPage.components.map((component) => (
            <div
              key={component.id}
              className={`component-wrapper ${
                selectedComponent === component.id
                  ? "ring-2 ring-blue-500 ring-offset-2 rounded-lg"
                  : ""
              }`}
              onClick={() =>
                viewMode === "edit" && setSelectedComponent(component.id)
              }
              style={{ cursor: viewMode === "edit" ? "pointer" : "default" }}
            >
              {renderFaithfulComponent(component)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFaithfulComponent = (component: QuizComponent) => {
    const { type, data, style } = component;

    switch (type) {
      case "title":
        return (
          <h1 className="quiz-title" style={style}>
            {data.text}
          </h1>
        );

      case "subtitle":
        return (
          <p className="quiz-subtitle" style={style}>
            {data.text}
          </p>
        );

      case "image":
        return <img src={data.src} alt={data.alt} className="quiz-image" />;

      case "input":
        return (
          <div className="quiz-input-group">
            <label className="quiz-input-label">
              {data.label}
              {data.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <input
              type="text"
              className="quiz-input"
              placeholder={data.placeholder}
              required={data.required}
            />
          </div>
        );

      case "button":
        return <button className="quiz-button">{data.text}</button>;

      case "options":
        return (
          <div className="quiz-options">
            {data.options.map((option: QuizOption) => (
              <div
                key={option.id}
                className={`quiz-option ${
                  selectedOptions.includes(option.id) ? "selected" : ""
                }`}
                onClick={() => {
                  if (data.multiSelect) {
                    setSelectedOptions((prev) =>
                      prev.includes(option.id)
                        ? prev.filter((id) => id !== option.id)
                        : [...prev, option.id]
                    );
                  } else {
                    setSelectedOptions([option.id]);
                  }
                }}
              >
                {data.hasImages && option.image && (
                  <img
                    src={option.image}
                    alt={option.text}
                    className="quiz-option-image"
                  />
                )}
                <div className="quiz-option-text">{option.text}</div>
              </div>
            ))}
          </div>
        );

      case "spacer":
        return (
          <div
            style={{ height: `${data.height}px` }}
            className="opacity-30 border border-dashed border-gray-400 rounded"
          />
        );

      default:
        return null;
    }
  };

  // Painel de propriedades
  const renderPropertiesPanel = () => {
    const component = currentPage.components.find(
      (c) => c.id === selectedComponent
    );
    if (!component) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Propriedades - {component.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Propriedades do conteúdo */}
          {component.type === "title" || component.type === "subtitle" ? (
            <div>
              <Label>Texto</Label>
              <Textarea
                value={component.data.text}
                onChange={(e) =>
                  updateComponent(component.id, { text: e.target.value })
                }
                rows={3}
              />
            </div>
          ) : null}

          {component.type === "image" && (
            <>
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={component.data.src}
                  onChange={(e) =>
                    updateComponent(component.id, { src: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Texto Alternativo</Label>
                <Input
                  value={component.data.alt}
                  onChange={(e) =>
                    updateComponent(component.id, { alt: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {component.type === "input" && (
            <>
              <div>
                <Label>Rótulo</Label>
                <Input
                  value={component.data.label}
                  onChange={(e) =>
                    updateComponent(component.id, { label: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Placeholder</Label>
                <Input
                  value={component.data.placeholder}
                  onChange={(e) =>
                    updateComponent(component.id, {
                      placeholder: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={component.data.required}
                  onCheckedChange={(checked) =>
                    updateComponent(component.id, { required: checked })
                  }
                />
                <Label>Obrigatório</Label>
              </div>
            </>
          )}

          {component.type === "button" && (
            <div>
              <Label>Texto do Botão</Label>
              <Input
                value={component.data.text}
                onChange={(e) =>
                  updateComponent(component.id, { text: e.target.value })
                }
              />
            </div>
          )}

          {/* Propriedades de estilo */}
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Estilo</Label>

            {(component.type === "title" || component.type === "subtitle") && (
              <>
                <div>
                  <Label>Alinhamento</Label>
                  <Select
                    value={component.style.textAlign || "center"}
                    onValueChange={(value: "left" | "center" | "right") =>
                      updateComponentStyle(component.id, { textAlign: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="center">Centro</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cor do Texto</Label>
                  <Input
                    type="color"
                    value={component.style.color || "#432818"}
                    onChange={(e) =>
                      updateComponentStyle(component.id, {
                        color: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Tamanho da Fonte</Label>
                  <Input
                    value={component.style.fontSize || ""}
                    onChange={(e) =>
                      updateComponentStyle(component.id, {
                        fontSize: e.target.value,
                      })
                    }
                    placeholder="ex: 1.5rem, 24px"
                  />
                </div>
              </>
            )}
          </div>

          <Separator />
          <Button
            variant="destructive"
            onClick={() => deleteComponent(component.id)}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover Componente
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Painel Lateral */}
      <div className="w-80 border-r bg-muted/30 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quiz Editor Fiel</h2>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("edit")}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("preview")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Dispositivos */}
          <div className="flex gap-1">
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
                <CardTitle className="text-sm">
                  Configurações da Página
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Tipo da Página</Label>
                  <Select
                    value={currentPage.type}
                    onValueChange={(value: QuizPage["type"]) =>
                      setCurrentPage((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intro">Introdução</SelectItem>
                      <SelectItem value="question">Questão</SelectItem>
                      <SelectItem value="result">Resultado</SelectItem>
                      <SelectItem value="loading">Carregamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label>Mostrar Header</Label>
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
                  <Label>Mostrar Progresso</Label>
                </div>

                {currentPage.config.showProgress && (
                  <div>
                    <Label>Valor do Progresso (%)</Label>
                    <Input
                      type="number"
                      value={currentPage.config.progressValue}
                      onChange={(e) =>
                        setCurrentPage((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            progressValue: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Templates do Quiz Original
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => loadTemplate("intro")}
                >
                  📝 Página de Introdução
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => loadTemplate("visualQuestion")}
                >
                  🖼️ Questão Visual
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => loadTemplate("textQuestion")}
                >
                  📄 Questão de Texto
                </Button>
              </CardContent>
            </Card>

            {/* Componentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Adicionar Componentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("title")}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Título
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("subtitle")}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Subtítulo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("image")}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Imagem
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("input")}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Campo de Entrada
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("button")}
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  Botão
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("options")}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Opções de Resposta
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addComponent("spacer")}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Espaçamento
                </Button>
              </CardContent>
            </Card>

            {/* Painel de Propriedades */}
            {selectedComponent && renderPropertiesPanel()}
          </div>
        </ScrollArea>
      </div>

      {/* Área de Preview */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentPage.type}</Badge>
              <span className="font-medium">{currentPage.title}</span>
            </div>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>

          {/* Preview do Quiz */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {renderFaithfulPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaithfulQuizEditor;
