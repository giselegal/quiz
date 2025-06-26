import React, { useState } from "react";
import {
  Settings,
  Palette,
  Layout,
  Type,
  Image,
  Square,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Minus,
} from "lucide-react";

interface OptionChoice {
  text: string;
  value: string;
  nextStepId?: string;
  nextPageType?: "resultPage" | "quizOfferPage" | "transitionPage";
  scoreValue?: number;
}

interface QuizComponent {
  id: string;
  type: string;
  props: QuizComponentProps;
}

interface QuizComponentProps {
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
  discountCode?: string;
  componentName?: string;
  // Propriedades adicionais de estilo
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  textColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  borderRadius?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  padding?: number;
  margin?: number;
  hidden?: boolean;
}

interface QuizHeaderConfig {
  showLogo: boolean;
  showProgressBar: boolean;
  allowReturnButton: boolean;
  logoUrl?: string;
  progressColor?: string;
  title?: string;
  subtitle?: string;
}

interface AdvancedConfigSidebarProps {
  selectedComponent: QuizComponent;
  updateComponent: (
    componentId: string,
    newProps: Record<string, unknown>
  ) => void;
  updateHeaderConfig: (newConfig: Partial<QuizHeaderConfig>) => void;
  headerConfig: QuizHeaderConfig;
}

const AdvancedConfigSidebar: React.FC<AdvancedConfigSidebarProps> = ({
  selectedComponent,
  updateComponent,
  updateHeaderConfig,
  headerConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"properties" | "style" | "layout">(
    "properties"
  );

  const handlePropChange = (key: string, value: unknown) => {
    updateComponent(selectedComponent.id, {
      [key]: value,
    });
  };

  const renderPropertiesTab = () => {
    const { type, props } = selectedComponent;

    switch (type) {
      case "heading":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Texto do Título
              </label>
              <textarea
                value={props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white resize-none"
                rows={3}
                placeholder="Digite o título..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Tamanho do Título
              </label>
              <select
                value={props.level || "h2"}
                onChange={(e) => handlePropChange("level", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
              >
                <option value="h1">H1 - Extra Grande</option>
                <option value="h2">H2 - Grande</option>
                <option value="h3">H3 - Médio</option>
                <option value="h4">H4 - Pequeno</option>
              </select>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Conteúdo do Texto
              </label>
              <textarea
                value={props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white resize-none"
                rows={5}
                placeholder="Digite o texto..."
              />
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={props.src || ""}
                onChange={(e) => handlePropChange("src", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Texto Alternativo
              </label>
              <input
                type="text"
                value={props.alt || ""}
                onChange={(e) => handlePropChange("alt", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
                placeholder="Descrição da imagem"
              />
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Texto do Botão
              </label>
              <input
                type="text"
                value={props.buttonText || ""}
                onChange={(e) => handlePropChange("buttonText", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
                placeholder="Clique aqui"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Estilo do Botão
              </label>
              <select
                value={props.buttonStyle || "primary"}
                onChange={(e) =>
                  handlePropChange("buttonStyle", e.target.value)
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
              >
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="outline">Contorno</option>
                <option value="ghost">Fantasma</option>
              </select>
            </div>
          </div>
        );

      case "input":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Rótulo do Campo
              </label>
              <input
                type="text"
                value={props.label || ""}
                onChange={(e) => handlePropChange("label", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
                placeholder="Nome"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Placeholder
              </label>
              <input
                type="text"
                value={props.placeholder || ""}
                onChange={(e) =>
                  handlePropChange("placeholder", e.target.value)
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
                placeholder="Digite aqui..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Tipo de Campo
              </label>
              <select
                value={props.inputType || "text"}
                onChange={(e) => handlePropChange("inputType", e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
              >
                <option value="text">Texto</option>
                <option value="email">Email</option>
                <option value="tel">Telefone</option>
                <option value="number">Número</option>
                <option value="password">Senha</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={props.required || false}
                onChange={(e) => handlePropChange("required", e.target.checked)}
                className="bg-zinc-800 border-zinc-600"
              />
              <label htmlFor="required" className="text-sm text-zinc-300">
                Campo obrigatório
              </label>
            </div>
          </div>
        );

      case "options":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Pergunta
              </label>
              <input
                type="text"
                value={props.questionText || ""}
                onChange={(e) =>
                  handlePropChange("questionText", e.target.value)
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
                placeholder="Qual é a sua preferência?"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Tipo de Seleção
              </label>
              <select
                value={props.selectionType || "single"}
                onChange={(e) =>
                  handlePropChange("selectionType", e.target.value)
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
              >
                <option value="single">Seleção única</option>
                <option value="multiple">Múltipla seleção</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Opções
              </label>
              <div className="space-y-2">
                {(props.choices || []).map((choice, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={choice.text || ""}
                      onChange={(e) => {
                        const newChoices = [...(props.choices || [])];
                        newChoices[index] = { ...choice, text: e.target.value };
                        handlePropChange("choices", newChoices);
                      }}
                      className="flex-1 p-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm"
                      placeholder={`Opção ${index + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newChoices = (props.choices || []).filter(
                          (_, i: number) => i !== index
                        );
                        handlePropChange("choices", newChoices);
                      }}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newChoices = [
                      ...(props.choices || []),
                      {
                        text: "",
                        value: `option${(props.choices || []).length + 1}`,
                      },
                    ];
                    handlePropChange("choices", newChoices);
                  }}
                  className="w-full p-2 border border-dashed border-zinc-600 rounded text-zinc-400 hover:text-zinc-300 hover:border-zinc-500 text-sm"
                >
                  + Adicionar Opção
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-zinc-400 py-8">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              Configurações para este tipo de componente ainda não foram
              implementadas.
            </p>
            <p className="text-sm mt-2">Tipo: {type}</p>
          </div>
        );
    }
  };

  const renderStyleTab = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Cor do Texto
          </label>
          <input
            type="color"
            value={selectedComponent.props.textColor || "#ffffff"}
            onChange={(e) => handlePropChange("textColor", e.target.value)}
            className="w-full h-10 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Cor de Fundo
          </label>
          <input
            type="color"
            value={selectedComponent.props.backgroundColor || "#000000"}
            onChange={(e) =>
              handlePropChange("backgroundColor", e.target.value)
            }
            className="w-full h-10 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Tamanho da Fonte
          </label>
          <input
            type="range"
            min="12"
            max="48"
            value={selectedComponent.props.fontSize || 16}
            onChange={(e) =>
              handlePropChange("fontSize", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="text-xs text-zinc-400 mt-1">
            {selectedComponent.props.fontSize || 16}px
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Bordas Arredondadas
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={selectedComponent.props.borderRadius || 0}
            onChange={(e) =>
              handlePropChange("borderRadius", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="text-xs text-zinc-400 mt-1">
            {selectedComponent.props.borderRadius || 0}px
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutTab = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Alinhamento
          </label>
          <select
            value={selectedComponent.props.textAlign || "left"}
            onChange={(e) => handlePropChange("textAlign", e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
            <option value="justify">Justificado</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Espaçamento Interno
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedComponent.props.padding || 0}
            onChange={(e) =>
              handlePropChange("padding", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="text-xs text-zinc-400 mt-1">
            {selectedComponent.props.padding || 0}px
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-2">
            Espaçamento Externo
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedComponent.props.margin || 0}
            onChange={(e) =>
              handlePropChange("margin", parseInt(e.target.value))
            }
            className="w-full"
          />
          <div className="text-xs text-zinc-400 mt-1">
            {selectedComponent.props.margin || 0}px
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Configurações</h3>
            <p className="text-sm text-zinc-400">
              {selectedComponent.type} - {selectedComponent.id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-zinc-400 hover:text-white"
              title="Duplicar componente"
            >
              <Copy size={16} />
            </button>
            <button
              className="p-2 text-zinc-400 hover:text-white"
              title="Ocultar/Mostrar componente"
            >
              {selectedComponent.props.hidden ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
            <button
              className="p-2 text-red-400 hover:text-red-300"
              title="Deletar componente"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-700">
        <button
          onClick={() => setActiveTab("properties")}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center space-x-2 ${
            activeTab === "properties"
              ? "bg-zinc-800 text-white border-b-2 border-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Settings size={16} />
          <span>Propriedades</span>
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center space-x-2 ${
            activeTab === "style"
              ? "bg-zinc-800 text-white border-b-2 border-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Palette size={16} />
          <span>Estilo</span>
        </button>
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center space-x-2 ${
            activeTab === "layout"
              ? "bg-zinc-800 text-white border-b-2 border-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Layout size={16} />
          <span>Layout</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "properties" && renderPropertiesTab()}
        {activeTab === "style" && renderStyleTab()}
        {activeTab === "layout" && renderLayoutTab()}
      </div>
    </div>
  );
};

export default AdvancedConfigSidebar;
