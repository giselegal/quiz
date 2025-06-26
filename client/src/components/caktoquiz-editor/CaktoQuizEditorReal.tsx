import React, { useState, useCallback, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Type, 
  Heading1, 
  Image, 
  MousePointer, 
  FileText, 
  Minus, 
  CheckSquare,
  Save,
  Eye,
  Undo,
  Redo,
  Play,
  Plus,
  GripVertical,
  Settings,
  Palette,
  Layout,
  Video,
  Users,
  DollarSign,
  Clock,
  Shield,
  Gift,
  HelpCircle,
  Star,
  BarChart3
} from 'lucide-react';

// Interfaces
interface CaktoComponent {
  id: string;
  type: "text" | "heading" | "image" | "button" | "input" | "spacer" | "options" | "video" | "testimonial" | "price" | "countdown" | "guarantee" | "bonus" | "faq" | "social-proof" | "logo" | "progress";
  props: {
    text?: string;
    src?: string;
    alt?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    options?: Array<{ id: string; text: string; value: string; image?: string }>;
    multiSelect?: boolean;
    columns?: number;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    padding?: string;
    margin?: string;
    price?: string;
    originalPrice?: string;
    videoUrl?: string;
    testimonialText?: string;
    testimonialAuthor?: string;
    guaranteeDays?: number;
    bonusItems?: Array<{ title: string; value: string }>;
    faqItems?: Array<{ question: string; answer: string }>;
    socialProofCount?: number;
    progressValue?: number;
  };
}

interface CaktoStep {
  id: string;
  title: string;
  type: "intro" | "question" | "loading" | "result" | "offer" | "transition" | "sales" | "checkout" | "upsell" | "thankyou" | "webinar";
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: CaktoComponent[];
  settings: {
    backgroundColor?: string;
    backgroundImage?: string;
    autoAdvance?: boolean;
    timeLimit?: number;
    redirectUrl?: string;
  };
}

interface CaktoProject {
  id: string;
  name: string;
  steps: CaktoStep[];
  config: {
    domain: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
    };
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
    tracking: {
      facebookPixelId: string;
      googleAnalyticsId: string;
    };
  };
}

// Component categories for the library
const componentCategories = {
  "Texto": [
    { type: "text", name: "Texto", icon: Type, description: "Parágrafo de texto" },
    { type: "heading", name: "Título", icon: Heading1, description: "Título ou subtítulo" },
  ],
  "Mídia": [
    { type: "image", name: "Imagem", icon: Image, description: "Imagem ou foto" },
    { type: "video", name: "Vídeo", icon: Video, description: "Player de vídeo" },
    { type: "logo", name: "Logo", icon: Image, description: "Logotipo" },
  ],
  "Interação": [
    { type: "button", name: "Botão", icon: MousePointer, description: "Botão clicável" },
    { type: "input", name: "Campo", icon: FileText, description: "Campo de entrada" },
    { type: "options", name: "Opções", icon: CheckSquare, description: "Múltipla escolha" },
  ],
  "Layout": [
    { type: "spacer", name: "Espaço", icon: Minus, description: "Espaçamento" },
    { type: "progress", name: "Progresso", icon: BarChart3, description: "Barra de progresso" },
  ],
  "Vendas": [
    { type: "testimonial", name: "Depoimento", icon: Users, description: "Testemunho" },
    { type: "price", name: "Preço", icon: DollarSign, description: "Tabela de preços" },
    { type: "countdown", name: "Contador", icon: Clock, description: "Contagem regressiva" },
    { type: "guarantee", name: "Garantia", icon: Shield, description: "Selo de garantia" },
    { type: "bonus", name: "Bônus", icon: Gift, description: "Lista de bônus" },
    { type: "faq", name: "FAQ", icon: HelpCircle, description: "Perguntas frequentes" },
    { type: "social-proof", name: "Prova Social", icon: Star, description: "Prova social" },
  ]
};

// Sortable Step Button Component
function SortableStepButton({ step, isActive, onClick }: { step: CaktoStep; isActive: boolean; onClick: () => void }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group border-r md:border-y md:border-r-0 min-w-[10rem] -mt-[1px] flex pl-2 relative items-center ${
        isActive ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        {...listeners}
        className="absolute left-0 top-0 h-full w-4 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100"
      >
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>
      <button
        onClick={onClick}
        className="flex-1 text-left py-3 pl-4 pr-2 text-sm"
      >
        <div className="font-medium text-gray-900">{step.title}</div>
        <div className="text-xs text-gray-500 capitalize">{step.type}</div>
      </button>
    </div>
  );
}

// Canvas Drop Zone Component
function CanvasDropZone({ 
  components, 
  onComponentSelect, 
  selectedComponentId, 
  onComponentUpdate, 
  onComponentDelete 
}: {
  components: CaktoComponent[];
  onComponentSelect: (id: string) => void;
  selectedComponentId: string | null;
  onComponentUpdate: (id: string, updates: Partial<CaktoComponent>) => void;
  onComponentDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  const renderComponent = (component: CaktoComponent) => {
    const isSelected = selectedComponentId === component.id;
    
    return (
      <div
        key={component.id}
        onClick={() => onComponentSelect(component.id)}
        className={`relative group cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'
        }`}
      >
        {/* Component Content */}
        <div className="min-h-[40px] p-2">
          {component.type === 'text' && (
            <p style={{ 
              color: component.props.textColor,
              fontSize: component.props.fontSize,
              textAlign: component.props.textAlign,
              padding: component.props.padding,
              margin: component.props.margin
            }}>
              {component.props.text || 'Texto padrão'}
            </p>
          )}
          {component.type === 'heading' && (
            <h2 style={{ 
              color: component.props.textColor,
              fontSize: component.props.fontSize || '24px',
              textAlign: component.props.textAlign
            }}>
              {component.props.text || 'Título padrão'}
            </h2>
          )}
          {component.type === 'image' && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-8 text-center">
              {component.props.src ? (
                <img src={component.props.src} alt={component.props.alt} className="max-w-full h-auto" />
              ) : (
                <div>
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Clique para adicionar imagem</p>
                </div>
              )}
            </div>
          )}
          {component.type === 'button' && (
            <button 
              className="px-4 py-2 rounded"
              style={{ 
                backgroundColor: component.props.backgroundColor || '#3B82F6',
                color: component.props.textColor || '#FFFFFF'
              }}
            >
              {component.props.text || 'Botão'}
            </button>
          )}
          {component.type === 'input' && (
            <div>
              {component.props.label && (
                <label className="block text-sm font-medium mb-1">{component.props.label}</label>
              )}
              <input 
                type="text" 
                placeholder={component.props.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
          {component.type === 'options' && (
            <div className="space-y-3">
              <div className="font-medium text-sm mb-3">
                {component.props.multiSelect ? 'Selecione até 3 opções:' : 'Selecione uma opção:'}
              </div>
              {component.props.options?.some(opt => opt.image) ? (
                // Questões com imagens - Grid 2x4 do CaktoQuiz real
                <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                  {component.props.options?.map((option, index) => (
                    <button
                      key={option.id}
                      className="option relative group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-gray-200 rounded-lg overflow-hidden bg-white"
                      style={{ aspectRatio: '1' }}
                      data-value={option.value}
                    >
                      {option.image && (
                        <img
                          src={option.image}
                          alt={option.text}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                        <p className="text-xs text-center font-medium leading-tight">
                          {option.text}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full hidden"></div>
                      </div>
                    </button>
                  )) || Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center text-xs text-gray-400">
                      Opção {i + 1}
                    </div>
                  ))}
                </div>
              ) : (
                // Questões só texto - Layout vertical
                <div className="space-y-2">
                  {component.props.options?.map((option, index) => (
                    <button
                      key={option.id}
                      className="option w-full p-3 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                      data-value={option.value}
                    >
                      <span className="text-sm">{option.text}</span>
                    </button>
                  )) || (
                    <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 text-center">
                      Clique para configurar opções
                    </div>
                  )}
                </div>
              )}
              
              {/* Botão Continuar com JavaScript de Controle */}
              <div className="mt-4 pt-2">
                <button 
                  id="continue-btn"
                  className="bg-primary w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors opacity-50 pointer-events-none disabled:opacity-50 disabled:pointer-events-none"
                  disabled
                >
                  Continuar
                </button>
              </div>
              
              {/* JavaScript Incorporado para Controle de Seleção */}
              <script dangerouslySetInnerHTML={{
                __html: `
                document.addEventListener("DOMContentLoaded", function() {
                  const buttons = document.querySelectorAll("button.option");
                  const continueBtn = document.getElementById("continue-btn");
                  let selectedOptions = new Set();
                  const maxSelections = ${component.props.multiSelect ? '3' : '1'};
                  const minSelections = ${component.props.multiSelect ? '2' : '1'};

                  function updateContinueButton() {
                    if (selectedOptions.size >= minSelections && selectedOptions.size <= maxSelections) {
                      if (continueBtn) {
                        continueBtn.disabled = false;
                        continueBtn.classList.remove("opacity-50", "pointer-events-none");
                      }
                    } else {
                      if (continueBtn) {
                        continueBtn.disabled = true;
                        continueBtn.classList.add("opacity-50", "pointer-events-none");
                      }
                    }
                  }

                  buttons.forEach((button, index) => {
                    button.addEventListener("click", function(e) {
                      e.preventDefault();
                      const optionValue = this.getAttribute("data-value") || "option-" + index;

                      if (selectedOptions.has(optionValue)) {
                        // Desselecionar
                        selectedOptions.delete(optionValue);
                        this.classList.remove("selected");
                        this.style.borderColor = "#d1d5db";
                        
                        // Atualizar checkbox visual
                        const checkbox = this.querySelector(".w-3.h-3");
                        if (checkbox) checkbox.classList.add("hidden");
                      } else {
                        // Verificar limite de seleções
                        if (!${component.props.multiSelect}) {
                          // Modo single: limpar outras seleções
                          buttons.forEach(btn => {
                            btn.classList.remove("selected");
                            btn.style.borderColor = "#d1d5db";
                            const cb = btn.querySelector(".w-3.h-3");
                            if (cb) cb.classList.add("hidden");
                          });
                          selectedOptions.clear();
                        } else if (selectedOptions.size >= maxSelections) {
                          return; // Não permitir mais seleções
                        }
                        
                        // Selecionar atual
                        selectedOptions.add(optionValue);
                        this.classList.add("selected");
                        this.style.borderColor = "#3b82f6";
                        this.style.borderWidth = "2px";
                        
                        // Atualizar checkbox visual
                        const checkbox = this.querySelector(".w-3.h-3");
                        if (checkbox) checkbox.classList.remove("hidden");
                      }

                      updateContinueButton();
                    });
                  });

                  updateContinueButton();
                });
                `
              }} />
            </div>
          )}
          {component.type === 'spacer' && (
            <div 
              className="bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center"
              style={{ height: '40px' }}
            >
              <span className="text-xs text-gray-500">Espaçamento</span>
            </div>
          )}
        </div>

        {/* Component Actions */}
        {isSelected && (
          <div className="absolute -top-8 right-0 flex gap-1 bg-white shadow-lg rounded border p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onComponentDelete(component.id)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[500px] p-4 space-y-4 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
      }`}
    >
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400 text-center border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div>
            <Layout className="mx-auto h-12 w-12 mb-4" />
            <p>Arraste componentes aqui</p>
          </div>
        </div>
      ) : (
        components.map(renderComponent)
      )}
    </div>
  );
}

// Draggable Component Item
function DraggableComponent({ type, name, icon: Icon, description }: { type: string; name: string; icon: any; description: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `component-${type}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white relative hover:z-30 rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  );
}

// Main Editor Component
export default function CaktoQuizEditorReal() {
  const [project, setProject] = useState<CaktoProject>({
    id: "project-1",
    name: "Quiz de Estilo Pessoal - Gisele Galvão",
    steps: [
      // 1. INTRODUÇÃO
      {
        id: "step-intro",
        title: "Introdução",
        type: "intro",
        progress: 0,
        showHeader: true,
        showProgress: false,
        components: [
          {
            id: "logo-intro",
            type: "logo",
            props: {
              src: "https://res.cloudinary.com/dpprqqpqt/image/upload/v1734828891/logo-gisele-galvao_mfj5qr.png",
              alt: "Gisele Galvão Logo",
              textAlign: "center"
            }
          },
          {
            id: "heading-intro",
            type: "heading",
            props: {
              text: "Qual é o SEU ESTILO PESSOAL?",
              fontSize: "32px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "text-intro",
            type: "text",
            props: {
              text: "Descubra seu estilo pessoal único e receba dicas personalizadas para expressar sua personalidade através da moda.",
              fontSize: "16px",
              textAlign: "center",
              textColor: "#6B7280"
            }
          },
          {
            id: "input-name",
            type: "input",
            props: {
              label: "Como você gostaria de ser chamada?",
              placeholder: "Digite seu nome...",
              required: true
            }
          },
          {
            id: "button-start",
            type: "button",
            props: {
              text: "COMEÇAR O QUIZ",
              backgroundColor: "#8B4513",
              textColor: "#FFFFFF",
              fontSize: "16px"
            }
          }
        ],
        settings: {
          backgroundColor: "#FAF9F7"
        }
      },
      // 2. QUESTÃO 1 - TIPO DE ROUPA FAVORITA
      {
        id: "step-q1",
        title: "Questão 1 - Tipo de Roupa",
        type: "question",
        progress: 5,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-1",
            type: "heading",
            props: {
              text: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-1",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "1a", text: "Conforto, leveza e praticidade no vestir.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp" },
                { id: "1b", text: "Discrição, caimento clássico e sobriedade.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp" },
                { id: "1c", text: "Praticidade com um toque de estilo atual.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp" },
                { id: "1d", text: "Elegância refinada, moderna e sem exageros.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp" },
                { id: "1e", text: "Delicadeza em tecidos suaves e fluidos.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp" },
                { id: "1f", text: "Sensualidade com destaque para o corpo.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp" },
                { id: "1g", text: "Sofisticação, impacto e modernidade.", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/17_mpqpew.webp" },
                { id: "1h", text: "Jovialidade urbana e despojada.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/18_mpqpew.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 3. QUESTÃO 2 - PERSONALIDADE
      {
        id: "step-q2",
        title: "Questão 2 - Personalidade",
        type: "question",
        progress: 10,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-2",
            type: "heading",
            props: {
              text: "RESUMA A SUA PERSONALIDADE:",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-2",
            type: "options",
            props: {
              multiSelect: true,
              columns: 1,
              options: [
                { id: "2a", text: "Informal, espontânea, alegre, essencialista.", value: "Natural" },
                { id: "2b", text: "Conservadora, séria, organizada.", value: "Clássico" },
                { id: "2c", text: "Informada, ativa, prática.", value: "Contemporâneo" },
                { id: "2d", text: "Exigente, sofisticada, seletiva.", value: "Elegante" },
                { id: "2e", text: "Feminina, meiga, delicada, sensível.", value: "Romântico" },
                { id: "2f", text: "Glamorosa, vaidosa, sensual.", value: "Sexy" },
                { id: "2g", text: "Cosmopolita, moderna e audaciosa.", value: "Dramático" },
                { id: "2h", text: "Descolada, despojada, autêntica.", value: "Criativo" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 4. QUESTÃO 3 - VISUAL DE IDENTIFICAÇÃO
      {
        id: "step-q3",
        title: "Questão 3 - Visual",
        type: "question",
        progress: 15,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-3",
            type: "heading",
            props: {
              text: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-3",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "3a", text: "Visual leve, despojado e natural.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp" },
                { id: "3b", text: "Visual clássico e tradicional.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp" },
                { id: "3c", text: "Visual casual com toque atual.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp" },
                { id: "3d", text: "Visual refinado e imponente.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp" },
                { id: "3e", text: "Visual romântico, feminino e delicado.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp" },
                { id: "3f", text: "Visual sensual, com saia justa e decote.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp" },
                { id: "3g", text: "Visual marcante e urbano (jeans + jaqueta).", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp" },
                { id: "3h", text: "Visual criativo e despojado.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/1_c9tbbk.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 5. QUESTÃO 4 - DETALHES
      {
        id: "step-q4",
        title: "Questão 4 - Detalhes",
        type: "question",
        progress: 20,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-4",
            type: "heading",
            props: {
              text: "QUAIS DETALHES VOCÊ GOSTA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-4",
            type: "options",
            props: {
              multiSelect: true,
              columns: 1,
              options: [
                { id: "4a", text: "Poucos detalhes, básico e prático.", value: "Natural" },
                { id: "4b", text: "Bem discretos e sutis, clean e clássico.", value: "Clássico" },
                { id: "4c", text: "Básico, mas com um toque de estilo.", value: "Contemporâneo" },
                { id: "4d", text: "Detalhes refinados, chic e que deem status.", value: "Elegante" },
                { id: "4e", text: "Detalhes delicados, laços, babados.", value: "Romântico" },
                { id: "4f", text: "Roupas que valorizem meu corpo: couro, zíper, fendas.", value: "Sexy" },
                { id: "4g", text: "Detalhes marcantes, firmeza e peso.", value: "Dramático" },
                { id: "4h", text: "Detalhes únicos, autênticos e diferentes.", value: "Criativo" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 6. QUESTÃO 5 - ESTAMPAS
      {
        id: "step-q5",
        title: "Questão 5 - Estampas",
        type: "question",
        progress: 25,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-5",
            type: "heading",
            props: {
              text: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-5",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "5a", text: "Estampas clean, com poucas informações.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp" },
                { id: "5b", text: "Estampas clássicas e atemporais.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp" },
                { id: "5c", text: "Atemporais, mas que tenham uma pegada de atual e moderna.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp" },
                { id: "5d", text: "Estampas clássicas e atemporais, mas sofisticadas.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp" },
                { id: "5e", text: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp" },
                { id: "5f", text: "Estampas de animal print, como onça, zebra e cobra.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp" },
                { id: "5g", text: "Estampas geométricas, abstratas e exageradas como grandes poás.", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp" },
                { id: "5h", text: "Estampas urbanas como camuflado e listras assimétricas.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_k7xwms.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 7. QUESTÃO 6 - CASACOS
      {
        id: "step-q6",
        title: "Questão 6 - Casacos",
        type: "question",
        progress: 30,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-6",
            type: "heading",
            props: {
              text: "QUAL CASACO É SEU FAVORITO?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-6",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "6a", text: "Cardigã bege confortável e casual.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp" },
                { id: "6b", text: "Blazer verde estruturado.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp" },
                { id: "6c", text: "Trench coat bege tradicional.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp" },
                { id: "6d", text: "Blazer branco refinado.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp" },
                { id: "6e", text: "Casaco pink vibrante e moderno.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp" },
                { id: "6f", text: "Jaqueta vinho de couro estilosa.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp" },
                { id: "6g", text: "Jaqueta preta estilo rocker.", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp" },
                { id: "6h", text: "Jaqueta jeans desestruturada.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/36_w2q9my.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 8. QUESTÃO 7 - CALÇAS
      {
        id: "step-q7",
        title: "Questão 7 - Calças",
        type: "question",
        progress: 35,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-7",
            type: "heading",
            props: {
              text: "QUAL SUA CALÇA FAVORITA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-7",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "7a", text: "Calça fluida acetinada bege.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp" },
                { id: "7b", text: "Calça de alfaiataria cinza.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp" },
                { id: "7c", text: "Jeans reto e básico.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp" },
                { id: "7d", text: "Calça reta bege de tecido.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp" },
                { id: "7e", text: "Calça ampla rosa alfaiatada.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp" },
                { id: "7f", text: "Legging preta de couro.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp" },
                { id: "7g", text: "Calça reta preta de couro.", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp" },
                { id: "7h", text: "Calça estampada floral leve e ampla.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 9. QUESTÃO 8 - SAPATOS
      {
        id: "step-q8",
        title: "Questão 8 - Sapatos",
        type: "question",
        progress: 40,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-8",
            type: "heading",
            props: {
              text: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-8",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "8a", text: "Tênis nude casual e confortável.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp" },
                { id: "8b", text: "Scarpin nude de salto baixo.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp" },
                { id: "8c", text: "Sandália dourada com salto bloco.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp" },
                { id: "8d", text: "Scarpin nude salto alto e fino.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp" },
                { id: "8e", text: "Sandália anabela off white.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp" },
                { id: "8f", text: "Sandália rosa de tiras finas.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp" },
                { id: "8g", text: "Scarpin preto moderno com vinil transparente.", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp" },
                { id: "8h", text: "Bota caramelo de cano baixo.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/54_fyfcxa.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 10. QUESTÃO 9 - ACESSÓRIOS
      {
        id: "step-q9",
        title: "Questão 9 - Acessórios",
        type: "question",
        progress: 45,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-9",
            type: "heading",
            props: {
              text: "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-9",
            type: "options",
            props: {
              multiSelect: true,
              columns: 2,
              options: [
                { id: "9a", text: "Pequenos e discretos, às vezes nem uso.", value: "Natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.webp" },
                { id: "9b", text: "Brincos pequenos e discretos. Corrente fininha.", value: "Clássico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp" },
                { id: "9c", text: "Acessórios que elevem meu look com um toque moderno.", value: "Contemporâneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.webp" },
                { id: "9d", text: "Acessórios sofisticados, joias ou semijoias.", value: "Elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.webp" },
                { id: "9e", text: "Peças delicadas e com um toque feminino.", value: "Romântico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.webp" },
                { id: "9f", text: "Brincos longos, colares que valorizem minha beleza.", value: "Sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.webp" },
                { id: "9g", text: "Acessórios pesados, que causem um impacto.", value: "Dramático", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.webp" },
                { id: "9h", text: "Acessórios diferentes, grandes e marcantes.", value: "Criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.webp" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 11. QUESTÃO 10 - TECIDOS
      {
        id: "step-q10",
        title: "Questão 10 - Tecidos",
        type: "question",
        progress: 50,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "question-10",
            type: "heading",
            props: {
              text: "OS TECIDOS QUE VOCÊ GOSTA:",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "options-10",
            type: "options",
            props: {
              multiSelect: true,
              columns: 1,
              options: [
                { id: "10a", text: "São confortáveis.", value: "Natural" },
                { id: "10b", text: "São de excelente qualidade.", value: "Clássico" },
                { id: "10c", text: "São fáceis de cuidar e modernos.", value: "Contemporâneo" },
                { id: "10d", text: "São sofisticados.", value: "Elegante" },
                { id: "10e", text: "São delicados.", value: "Romântico" },
                { id: "10f", text: "São perfeitos ao meu corpo.", value: "Sexy" },
                { id: "10g", text: "São diferentes, e trazem um efeito para minha roupa.", value: "Dramático" },
                { id: "10h", text: "São exclusivos, criam identidade no look.", value: "Criativo" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 12. TRANSIÇÃO
      {
        id: "step-transition",
        title: "Transição",
        type: "transition",
        progress: 55,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "transition-heading",
            type: "heading",
            props: {
              text: "Estamos quase terminando!",
              fontSize: "28px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "transition-text",
            type: "text",
            props: {
              text: "Agora vamos fazer algumas perguntas estratégicas para personalizar ainda mais seu resultado.",
              fontSize: "18px",
              textAlign: "center",
              textColor: "#6B7280"
            }
          },
          {
            id: "transition-button",
            type: "button",
            props: {
              text: "CONTINUAR",
              backgroundColor: "#8B4513",
              textColor: "#FFFFFF",
              fontSize: "16px"
            }
          }
        ],
        settings: { backgroundColor: "#FAF9F7" }
      },
      // 13. QUESTÃO ESTRATÉGICA 1 - NOME
      {
        id: "step-strategic-1",
        title: "Dados Pessoais - Nome",
        type: "question",
        progress: 60,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q1",
            type: "heading",
            props: {
              text: "Para finalizar, confirme seu nome:",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-input-1",
            type: "input",
            props: {
              label: "Nome completo",
              placeholder: "Digite seu nome completo...",
              required: true
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 14. QUESTÃO ESTRATÉGICA 2 - EMAIL
      {
        id: "step-strategic-2",
        title: "Dados Pessoais - Email",
        type: "question",
        progress: 65,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q2",
            type: "heading",
            props: {
              text: "Qual é o seu melhor email?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-input-2",
            type: "input",
            props: {
              label: "Email",
              placeholder: "seu@email.com",
              required: true
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 15. QUESTÃO ESTRATÉGICA 3 - WHATSAPP
      {
        id: "step-strategic-3",
        title: "Dados Pessoais - WhatsApp",
        type: "question",
        progress: 70,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q3",
            type: "heading",
            props: {
              text: "Compartilhe seu WhatsApp para receber dicas exclusivas:",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-input-3",
            type: "input",
            props: {
              label: "WhatsApp",
              placeholder: "(11) 99999-9999",
              required: true
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 16. QUESTÃO ESTRATÉGICA 4 - IDADE
      {
        id: "step-strategic-4",
        title: "Perfil - Idade",
        type: "question",
        progress: 75,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q4",
            type: "heading",
            props: {
              text: "Qual sua faixa etária?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-options-4",
            type: "options",
            props: {
              multiSelect: false,
              columns: 1,
              options: [
                { id: "18-25", text: "18-25 anos", value: "18-25" },
                { id: "26-35", text: "26-35 anos", value: "26-35" },
                { id: "36-45", text: "36-45 anos", value: "36-45" },
                { id: "46-55", text: "46-55 anos", value: "46-55" },
                { id: "56+", text: "56+ anos", value: "56+" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 17. QUESTÃO ESTRATÉGICA 5 - ORÇAMENTO
      {
        id: "step-strategic-5",
        title: "Perfil - Orçamento",
        type: "question",
        progress: 80,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q5",
            type: "heading",
            props: {
              text: "Qual seu orçamento mensal para roupas?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-options-5",
            type: "options",
            props: {
              multiSelect: false,
              columns: 1,
              options: [
                { id: "ate-200", text: "Até R$ 200", value: "ate-200" },
                { id: "200-500", text: "R$ 200 - R$ 500", value: "200-500" },
                { id: "500-1000", text: "R$ 500 - R$ 1.000", value: "500-1000" },
                { id: "1000-2000", text: "R$ 1.000 - R$ 2.000", value: "1000-2000" },
                { id: "2000+", text: "Mais de R$ 2.000", value: "2000+" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 18. QUESTÃO ESTRATÉGICA 6 - OBJETIVO
      {
        id: "step-strategic-6",
        title: "Objetivo",
        type: "question",
        progress: 85,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q6",
            type: "heading",
            props: {
              text: "Qual seu principal objetivo com o estilo?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-options-6",
            type: "options",
            props: {
              multiSelect: false,
              columns: 1,
              options: [
                { id: "profissional", text: "Melhorar aparência profissional", value: "profissional" },
                { id: "autoestima", text: "Aumentar autoestima e confiança", value: "autoestima" },
                { id: "relacionamento", text: "Impressionar no relacionamento", value: "relacionamento" },
                { id: "social", text: "Se destacar socialmente", value: "social" },
                { id: "pessoal", text: "Expressar personalidade", value: "pessoal" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 19. QUESTÃO ESTRATÉGICA 7 - DESAFIO
      {
        id: "step-strategic-7",
        title: "Desafio",
        type: "question",
        progress: 90,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: "strategic-q7",
            type: "heading",
            props: {
              text: "Qual seu maior desafio com moda?",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "strategic-options-7",
            type: "options",
            props: {
              multiSelect: false,
              columns: 1,
              options: [
                { id: "combinar", text: "Não sei combinar peças", value: "combinar" },
                { id: "corpo", text: "Não sei o que fica bom no meu corpo", value: "corpo" },
                { id: "orcamento", text: "Orçamento limitado", value: "orcamento" },
                { id: "tempo", text: "Falta de tempo para me arrumar", value: "tempo" },
                { id: "tendencias", text: "Dificuldade em acompanhar tendências", value: "tendencias" }
              ]
            }
          }
        ],
        settings: { backgroundColor: "#FFFFFF" }
      },
      // 20. RESULTADO
      {
        id: "step-result",
        title: "Resultado",
        type: "result",
        progress: 100,
        showHeader: true,
        showProgress: false,
        components: [
          {
            id: "result-greeting",
            type: "heading",
            props: {
              text: "Parabéns! Descobrimos seu estilo!",
              fontSize: "32px",
              textAlign: "center",
              textColor: "#1F2937"
            }
          },
          {
            id: "result-style",
            type: "heading",
            props: {
              text: "Seu estilo é: [ESTILO_PREDOMINANTE]",
              fontSize: "24px",
              textAlign: "center",
              textColor: "#8B4513"
            }
          },
          {
            id: "result-description",
            type: "text",
            props: {
              text: "Você tem um estilo único que reflete sua personalidade. Aqui estão algumas dicas personalizadas para você.",
              fontSize: "18px",
              textAlign: "center",
              textColor: "#6B7280"
            }
          },
          {
            id: "result-cta",
            type: "button",
            props: {
              text: "RECEBER DICAS PERSONALIZADAS",
              backgroundColor: "#8B4513",
              textColor: "#FFFFFF",
              fontSize: "16px"
            }
          }
        ],
        settings: { backgroundColor: "#FAF9F7" }
      }
    ],
    config: {
      domain: "quiz-estilo-gisele.com",
      theme: {
        primaryColor: "#8B4513",
        secondaryColor: "#432818",
        fontFamily: "Inter"
      },
      seo: {
        title: "Quiz de Estilo Pessoal - Gisele Galvão",
        description: "Descubra seu estilo pessoal único com a consultora Gisele Galvão",
        keywords: "estilo pessoal, consultoria de moda, quiz de estilo, gisele galvão"
      },
      tracking: {
        facebookPixelId: "",
        googleAnalyticsId: ""
      }
    }
  });

  const [activeStepId, setActiveStepId] = useState<string>("step-intro");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [activeColorScheme, setActiveColorScheme] = useState('gisele-brown');

  // Color Palette Generator System
  const colorSchemes = {
    'gisele-brown': {
      name: 'Gisele Brown (Original)',
      primary: '#8B4513',
      secondary: '#432818', 
      accent: '#D2691E',
      background: '#FAF9F7',
      text: '#1F2937',
      light: '#CD853F'
    },
    'modern-blue': {
      name: 'Modern Blue',
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#F8FAFC',
      text: '#1E293B',
      light: '#DBEAFE'
    },
    'elegant-purple': {
      name: 'Elegant Purple',
      primary: '#7C3AED',
      secondary: '#5B21B6',
      accent: '#A78BFA',
      background: '#FAFAF9',
      text: '#374151',
      light: '#EDE9FE'
    },
    'warm-orange': {
      name: 'Warm Orange',
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#FB923C',
      background: '#FFFBEB',
      text: '#292524',
      light: '#FED7AA'
    },
    'fresh-green': {
      name: 'Fresh Green',
      primary: '#059669',
      secondary: '#047857',
      accent: '#34D399',
      background: '#F0FDF4',
      text: '#1F2937',
      light: '#BBF7D0'
    },
    'luxury-gold': {
      name: 'Luxury Gold',
      primary: '#D97706',
      secondary: '#92400E',
      accent: '#FBBF24',
      background: '#FFFBEB',
      text: '#1C1917',
      light: '#FDE68A'
    }
  };

  // Color generation utilities
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const generateColorPalette = (baseColor: string) => {
    const [h, s, l] = hexToHsl(baseColor);
    
    return {
      primary: baseColor,
      secondary: hslToHex(h, Math.min(s + 10, 100), Math.max(l - 20, 10)),
      accent: hslToHex(h, Math.max(s - 20, 20), Math.min(l + 20, 90)),
      background: hslToHex(h, Math.max(s - 40, 5), Math.min(l + 45, 95)),
      text: hslToHex(h, Math.min(s + 5, 30), Math.max(l - 50, 10)),
      light: hslToHex(h, Math.max(s - 30, 15), Math.min(l + 35, 85))
    };
  };

  const applyColorScheme = (scheme: typeof colorSchemes['gisele-brown']) => {
    // Apply to project config
    setProject(prev => ({
      ...prev,
      config: {
        ...prev.config,
        theme: {
          ...prev.config.theme,
          primaryColor: scheme.primary,
          secondaryColor: scheme.secondary,
          accentColor: scheme.accent,
          backgroundColor: scheme.background,
          textColor: scheme.text,
          lightColor: scheme.light
        }
      }
    }));

    // Apply to all components in current step
    if (activeStep) {
      setProject(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === activeStepId 
            ? {
                ...step,
                components: step.components.map(comp => ({
                  ...comp,
                  props: {
                    ...comp.props,
                    textColor: comp.props.textColor ? scheme.text : comp.props.textColor,
                    backgroundColor: comp.props.backgroundColor ? scheme.primary : comp.props.backgroundColor
                  }
                })),
                settings: {
                  ...step.settings,
                  backgroundColor: scheme.background
                }
              }
            : step
        )
      }));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeStep = project.steps.find(step => step.id === activeStepId);
  const selectedComponent = activeStep?.components.find(comp => comp.id === selectedComponentId);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.id.toString().startsWith('component-')) {
      const componentType = active.id.toString().replace('component-', '');
      setDraggedComponent({ type: componentType });
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedComponent(null);

    if (!over) return;

    // Handle component drag to canvas - Check if dropped over canvas area
    if (active.id.toString().startsWith('component-') && 
        (over.id === 'canvas-drop-zone' || over.id.toString().includes('canvas'))) {
      const componentType = active.id.toString().replace('component-', '');
      const newComponent: CaktoComponent = {
        id: `comp-${Date.now()}`,
        type: componentType as any,
        props: {
          text: componentType === 'text' ? 'Novo texto' : 
                componentType === 'heading' ? 'Novo título' : 
                componentType === 'button' ? 'Clique aqui' : '',
          placeholder: componentType === 'input' ? 'Digite aqui...' : undefined,
          options: componentType === 'options' ? [
            { id: '1', text: 'Opção 1', value: '1' },
            { id: '2', text: 'Opção 2', value: '2' }
          ] : undefined,
        }
      };

      setProject(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === activeStepId 
            ? { ...step, components: [...step.components, newComponent] }
            : step
        )
      }));
      
      // Select the newly added component
      setSelectedComponentId(newComponent.id);
    }

    // Handle step reordering
    if (!active.id.toString().startsWith('component-') && !over.id.toString().startsWith('component-')) {
      const oldIndex = project.steps.findIndex(step => step.id === active.id);
      const newIndex = project.steps.findIndex(step => step.id === over.id);

      if (oldIndex !== newIndex) {
        setProject(prev => ({
          ...prev,
          steps: arrayMove(prev.steps, oldIndex, newIndex)
        }));
      }
    }
  }, [activeStepId, project.steps]);

  const addNewStep = () => {
    const newStep: CaktoStep = {
      id: `step-${Date.now()}`,
      title: `Etapa ${project.steps.length + 1}`,
      type: "question",
      progress: Math.round((project.steps.length / (project.steps.length + 1)) * 100),
      showHeader: true,
      showProgress: true,
      components: [],
      settings: {}
    };

    setProject(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    setActiveStepId(newStep.id);
  };

  const updateComponent = (componentId: string, updates: Partial<CaktoComponent>) => {
    setProject(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === activeStepId 
          ? {
              ...step,
              components: step.components.map(comp => 
                comp.id === componentId 
                  ? { ...comp, ...updates }
                  : comp
              )
            }
          : step
      )
    }));
  };

  const deleteComponent = (componentId: string) => {
    setProject(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === activeStepId 
          ? {
              ...step,
              components: step.components.filter(comp => comp.id !== componentId)
            }
          : step
      )
    }));
    setSelectedComponentId(null);
  };



  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">CaktoQuiz Editor</h1>
            <div className="h-4 w-px bg-gray-300" />
            <Input
              value={project.name}
              onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              className="w-48 h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowColorPalette(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
            >
              <Palette className="h-4 w-4 mr-1" />
              Cores
            </Button>
            <Button variant="outline" size="sm" disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-1" />
              Publicar
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Steps Sidebar */}
          <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Etapas</h3>
                <Button size="sm" variant="ghost" onClick={addNewStep} className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <SortableContext items={project.steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {project.steps.map(step => (
                  <SortableStepButton
                    key={step.id}
                    step={step}
                    isActive={activeStepId === step.id}
                    onClick={() => setActiveStepId(step.id)}
                  />
                ))}
              </SortableContext>
            </ScrollArea>
          </div>

          {/* Components Library */}
          <div className="w-[220px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium">Componentes</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-4">
                {Object.entries(componentCategories).map(([category, components]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1">
                      {category}
                    </h4>
                    <SortableContext items={components.map(c => `component-${c.type}`)} strategy={verticalListSortingStrategy}>
                      {components.map(component => (
                        <DraggableComponent
                          key={component.type}
                          type={component.type}
                          name={component.name}
                          icon={component.icon}
                          description={component.description}
                        />
                      ))}
                    </SortableContext>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Canvas - Preview Autêntico do CaktoQuiz */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header Autêntico do CaktoQuiz */}
              {activeStep?.showHeader && (
                <div className="h-16 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/logo-gisele_fqp0wa.png" 
                      alt="Gisele Galvão"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-white">Quiz de Estilo Pessoal</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    {activeStep.progress}% completo
                  </div>
                </div>
              )}
              
              {/* Progress Bar Autêntico */}
              {activeStep?.showProgress && (
                <div className="h-1 bg-zinc-200">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500 ease-out"
                    style={{ width: `${activeStep.progress}%` }}
                  />
                </div>
              )}

              {/* Canvas Content com Styling Autêntico */}
              <div className="min-h-[500px] bg-gradient-to-b from-zinc-50 to-white">
                <CanvasDropZone 
                  components={activeStep?.components || []}
                  onComponentSelect={setSelectedComponentId}
                  selectedComponentId={selectedComponentId}
                  onComponentUpdate={updateComponent}
                  onComponentDelete={deleteComponent}
                />
              </div>
              
              {/* Footer Informativo */}
              <div className="bg-zinc-50 border-t px-4 py-2 text-xs text-zinc-500 text-center">
                Preview: {activeStep?.title || 'Selecione uma etapa'} • Tipo: {activeStep?.type || 'N/A'}
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium">
                {selectedComponent ? 'Propriedades do Componente' : 'Configurações da Etapa'}
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {selectedComponent ? (
                  // Component Properties
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Conteúdo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(selectedComponent.type === 'text' || selectedComponent.type === 'heading' || selectedComponent.type === 'button') && (
                          <div>
                            <Label className="text-xs">Texto</Label>
                            <Input
                              value={selectedComponent.props.text || ''}
                              onChange={(e) => updateComponent(selectedComponent.id, {
                                props: { ...selectedComponent.props, text: e.target.value }
                              })}
                              className="h-8"
                            />
                          </div>
                        )}
                        {selectedComponent.type === 'image' && (
                          <>
                            <div>
                              <Label className="text-xs">URL da Imagem</Label>
                              <Input
                                value={selectedComponent.props.src || ''}
                                onChange={(e) => updateComponent(selectedComponent.id, {
                                  props: { ...selectedComponent.props, src: e.target.value }
                                })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Texto Alternativo</Label>
                              <Input
                                value={selectedComponent.props.alt || ''}
                                onChange={(e) => updateComponent(selectedComponent.id, {
                                  props: { ...selectedComponent.props, alt: e.target.value }
                                })}
                                className="h-8"
                              />
                            </div>
                          </>
                        )}
                        {selectedComponent.type === 'input' && (
                          <>
                            <div>
                              <Label className="text-xs">Label</Label>
                              <Input
                                value={selectedComponent.props.label || ''}
                                onChange={(e) => updateComponent(selectedComponent.id, {
                                  props: { ...selectedComponent.props, label: e.target.value }
                                })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Placeholder</Label>
                              <Input
                                value={selectedComponent.props.placeholder || ''}
                                onChange={(e) => updateComponent(selectedComponent.id, {
                                  props: { ...selectedComponent.props, placeholder: e.target.value }
                                })}
                                className="h-8"
                              />
                            </div>
                          </>
                        )}
                        
                        {/* Editor Avançado de Questões - Baseado no CaktoQuiz Real */}
                        {selectedComponent.type === 'options' && (
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Editor de Questões</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Seleção Múltipla</Label>
                                <Switch
                                  checked={selectedComponent.props.multiSelect || false}
                                  onCheckedChange={(checked) => updateComponent(selectedComponent.id, {
                                    props: { ...selectedComponent.props, multiSelect: checked }
                                  })}
                                />
                              </div>
                              
                              {selectedComponent.props.multiSelect && (
                                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                  ⚠️ Seleção múltipla: 2-3 opções (como no CaktoQuiz real)
                                </div>
                              )}
                              
                              <div>
                                <Label className="text-xs mb-2 block">Opções da Questão (Grid 2x4)</Label>
                                <div className="space-y-3">
                                  {Array.from({ length: 8 }, (_, i) => {
                                    const option = selectedComponent.props.options?.[i] || { id: `opt-${i}`, text: '', value: '', image: '' };
                                    return (
                                      <div key={i} className="border rounded-lg p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <Label className="text-xs font-medium">Opção {String.fromCharCode(65 + i)}</Label>
                                          <span className="text-xs text-gray-500">Posição {Math.floor(i / 2) + 1}x{(i % 2) + 1}</span>
                                        </div>
                                        
                                        <div>
                                          <Label className="text-xs">Texto</Label>
                                          <Input
                                            value={option.text}
                                            onChange={(e) => {
                                              const updatedOptions = [...(selectedComponent.props.options || Array.from({ length: 8 }, (_, idx) => ({ id: `opt-${idx}`, text: '', value: '', image: '' })))];
                                              updatedOptions[i] = { ...option, text: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                                              updateComponent(selectedComponent.id, {
                                                props: { ...selectedComponent.props, options: updatedOptions }
                                              });
                                            }}
                                            placeholder={`Texto da opção ${String.fromCharCode(65 + i)}`}
                                            className="h-7 text-xs"
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label className="text-xs">URL da Imagem</Label>
                                          <Input
                                            value={option.image || ''}
                                            onChange={(e) => {
                                              const updatedOptions = [...(selectedComponent.props.options || Array.from({ length: 8 }, (_, idx) => ({ id: `opt-${idx}`, text: '', value: '', image: '' })))];
                                              updatedOptions[i] = { ...option, image: e.target.value };
                                              updateComponent(selectedComponent.id, {
                                                props: { ...selectedComponent.props, options: updatedOptions }
                                              });
                                            }}
                                            placeholder="https://exemplo.com/imagem.jpg"
                                            className="h-7 text-xs"
                                          />
                                        </div>
                                        
                                        {option.image && (
                                          <div className="mt-2">
                                            <img 
                                              src={option.image} 
                                              alt={option.text}
                                              className="w-full h-20 object-cover rounded border"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2">
                                <div className="font-medium text-gray-700">Estrutura do CaktoQuiz Real:</div>
                                <div className="text-gray-600">• Grid 2 colunas x 4 linhas (8 opções A-H)</div>
                                <div className="text-gray-600">• Imagens com aspect-ratio 1:1</div>
                                <div className="text-gray-600">• Texto sobreposto na parte inferior</div>
                                <div className="text-gray-600">• Checkbox no canto superior direito</div>
                                <div className="text-gray-600">• JavaScript para controle de seleção múltipla</div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    // Preencher com dados de exemplo baseados no quiz real - Questão 1
                                    const exampleOptions = [
                                      { id: 'opt-0', text: 'Roupas Clássicas', value: 'classicas', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-classicas_bwlpex.jpg' },
                                      { id: 'opt-1', text: 'Roupas Românticas', value: 'romanticas', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-romanticas_lk8tpy.jpg' },
                                      { id: 'opt-2', text: 'Roupas Dramáticas', value: 'dramaticas', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-dramaticas_fcxrlu.jpg' },
                                      { id: 'opt-3', text: 'Roupas Naturais', value: 'naturais', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-naturais_o23kdp.jpg' },
                                      { id: 'opt-4', text: 'Roupas Criativas', value: 'criativas', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-criativas_l9rwex.jpg' },
                                      { id: 'opt-5', text: 'Roupas Ingênuas', value: 'ingenuas', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-ingenuas_hwu1dd.jpg' },
                                      { id: 'opt-6', text: 'Roupas Sensuais', value: 'sensuais', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-sensuais_ezbp1r.jpg' },
                                      { id: 'opt-7', text: 'Roupas Elegantes', value: 'elegantes', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/roupas-elegantes_fhqzmt.jpg' }
                                    ];
                                    updateComponent(selectedComponent.id, {
                                      props: { ...selectedComponent.props, options: exampleOptions, multiSelect: true }
                                    });
                                  }}
                                  className="flex-1"
                                >
                                  Q1: Roupas
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    // Questão de personalidade
                                    const personalityOptions = [
                                      { id: 'opt-0', text: 'Extrovertida', value: 'extrovertida', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-extrovertida_xzy1ab.jpg' },
                                      { id: 'opt-1', text: 'Introvertida', value: 'introvertida', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-introvertida_def2cd.jpg' },
                                      { id: 'opt-2', text: 'Criativa', value: 'criativa', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-criativa_ghi3ef.jpg' },
                                      { id: 'opt-3', text: 'Prática', value: 'pratica', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-pratica_jkl4gh.jpg' },
                                      { id: 'opt-4', text: 'Aventureira', value: 'aventureira', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-aventureira_mno5ij.jpg' },
                                      { id: 'opt-5', text: 'Tranquila', value: 'tranquila', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-tranquila_pqr6kl.jpg' },
                                      { id: 'opt-6', text: 'Ambiciosa', value: 'ambiciosa', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-ambiciosa_stu7mn.jpg' },
                                      { id: 'opt-7', text: 'Empática', value: 'empatica', image: 'https://res.cloudinary.com/dvovypj9k/image/upload/v1730426626/personalidade-empatica_vwx8op.jpg' }
                                    ];
                                    updateComponent(selectedComponent.id, {
                                      props: { ...selectedComponent.props, options: personalityOptions, multiSelect: true }
                                    });
                                  }}
                                  className="flex-1"
                                >
                                  Q2: Personalidade
                                </Button>
                              </div>
                              
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => {
                                  // Limpar todas as opções
                                  updateComponent(selectedComponent.id, {
                                    props: { 
                                      ...selectedComponent.props, 
                                      options: Array.from({ length: 8 }, (_, i) => ({ 
                                        id: `opt-${i}`, 
                                        text: '', 
                                        value: '', 
                                        image: '' 
                                      })),
                                      multiSelect: false 
                                    }
                                  });
                                }}
                                className="w-full"
                              >
                                Limpar Opções
                              </Button>
                            </CardContent>
                          </Card>
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
                            value={selectedComponent.props.textColor || '#000000'}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              props: { ...selectedComponent.props, textColor: e.target.value }
                            })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Cor de Fundo</Label>
                          <Input
                            type="color"
                            value={selectedComponent.props.backgroundColor || '#FFFFFF'}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              props: { ...selectedComponent.props, backgroundColor: e.target.value }
                            })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Alinhamento</Label>
                          <Select
                            value={selectedComponent.props.textAlign || 'left'}
                            onValueChange={(value: 'left' | 'center' | 'right') => updateComponent(selectedComponent.id, {
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
                  // Step Properties
                  activeStep && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Configurações da Etapa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-xs">Título</Label>
                            <Input
                              value={activeStep.title}
                              onChange={(e) => {
                                setProject(prev => ({
                                  ...prev,
                                  steps: prev.steps.map(step => 
                                    step.id === activeStepId 
                                      ? { ...step, title: e.target.value }
                                      : step
                                  )
                                }));
                              }}
                              className="h-8"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Tipo</Label>
                            <Select
                              value={activeStep.type}
                              onValueChange={(value: CaktoStep['type']) => {
                                setProject(prev => ({
                                  ...prev,
                                  steps: prev.steps.map(step => 
                                    step.id === activeStepId 
                                      ? { ...step, type: value }
                                      : step
                                  )
                                }));
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="intro">Introdução</SelectItem>
                                <SelectItem value="question">Pergunta</SelectItem>
                                <SelectItem value="loading">Carregamento</SelectItem>
                                <SelectItem value="result">Resultado</SelectItem>
                                <SelectItem value="offer">Oferta</SelectItem>
                                <SelectItem value="transition">Transição</SelectItem>
                                <SelectItem value="sales">Vendas</SelectItem>
                                <SelectItem value="checkout">Checkout</SelectItem>
                                <SelectItem value="upsell">Upsell</SelectItem>
                                <SelectItem value="thankyou">Obrigado</SelectItem>
                                <SelectItem value="webinar">Webinar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Mostrar Header</Label>
                            <Switch
                              checked={activeStep.showHeader}
                              onCheckedChange={(checked) => {
                                setProject(prev => ({
                                  ...prev,
                                  steps: prev.steps.map(step => 
                                    step.id === activeStepId 
                                      ? { ...step, showHeader: checked }
                                      : step
                                  )
                                }));
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Mostrar Progresso</Label>
                            <Switch
                              checked={activeStep.showProgress}
                              onCheckedChange={(checked) => {
                                setProject(prev => ({
                                  ...prev,
                                  steps: prev.steps.map(step => 
                                    step.id === activeStepId 
                                      ? { ...step, showProgress: checked }
                                      : step
                                  )
                                }));
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedComponent && (
          <div className="bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
            <div className="text-sm font-medium">{draggedComponent.type}</div>
          </div>
        )}
      </DragOverlay>

      {/* Color Palette Generator Modal */}
      <Dialog open={showColorPalette} onOpenChange={setShowColorPalette}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gerador de Paletas de Cores para Quiz
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="presets">Temas Predefinidos</TabsTrigger>
              <TabsTrigger value="custom">Gerador Personalizado</TabsTrigger>
              <TabsTrigger value="advanced">Configuração Avançada</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <Card 
                    key={key} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      activeColorScheme === key ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setActiveColorScheme(key);
                      applyColorScheme(scheme);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="text-sm font-medium mb-3">{scheme.name}</div>
                      <div className="grid grid-cols-3 gap-1 mb-3">
                        <div 
                          className="h-8 rounded" 
                          style={{ backgroundColor: scheme.primary }}
                          title={`Primary: ${scheme.primary}`}
                        />
                        <div 
                          className="h-8 rounded" 
                          style={{ backgroundColor: scheme.secondary }}
                          title={`Secondary: ${scheme.secondary}`}
                        />
                        <div 
                          className="h-8 rounded" 
                          style={{ backgroundColor: scheme.accent }}
                          title={`Accent: ${scheme.accent}`}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div 
                          className="h-6 rounded border" 
                          style={{ backgroundColor: scheme.background }}
                          title={`Background: ${scheme.background}`}
                        />
                        <div 
                          className="h-6 rounded" 
                          style={{ backgroundColor: scheme.text }}
                          title={`Text: ${scheme.text}`}
                        />
                        <div 
                          className="h-6 rounded" 
                          style={{ backgroundColor: scheme.light }}
                          title={`Light: ${scheme.light}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gerador Automático de Paletas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Cor Base</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        className="w-16 h-10"
                        onChange={(e) => {
                          const generatedPalette = generateColorPalette(e.target.value);
                          const customScheme = {
                            name: 'Personalizado',
                            ...generatedPalette
                          };
                          applyColorScheme(customScheme);
                        }}
                      />
                      <Input
                        type="text"
                        placeholder="#8B4513"
                        className="flex-1"
                        onChange={(e) => {
                          if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
                            const generatedPalette = generateColorPalette(e.target.value);
                            const customScheme = {
                              name: 'Personalizado',
                              ...generatedPalette
                            };
                            applyColorScheme(customScheme);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Paletas Rápidas</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['#8B4513', '#3B82F6', '#7C3AED', '#EA580C', '#059669', '#D97706', '#EF4444', '#EC4899'].map((color, index) => (
                        <button
                          key={index}
                          className="h-10 rounded border-2 border-gray-200 hover:border-gray-400"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const generatedPalette = generateColorPalette(color);
                            const customScheme = {
                              name: 'Personalizado',
                              ...generatedPalette
                            };
                            applyColorScheme(customScheme);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuração Manual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Cor Primária</Label>
                      <Input
                        type="color"
                        value={project.config.theme.primaryColor}
                        onChange={(e) => setProject(prev => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            theme: {
                              ...prev.config.theme,
                              primaryColor: e.target.value
                            }
                          }
                        }))}
                        className="w-full h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Cor Secundária</Label>
                      <Input
                        type="color"
                        value={project.config.theme.secondaryColor}
                        onChange={(e) => setProject(prev => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            theme: {
                              ...prev.config.theme,
                              secondaryColor: e.target.value
                            }
                          }
                        }))}
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Preview do Tema</Label>
                    <div className="border rounded-lg p-4 mt-2" style={{ backgroundColor: project.config.theme.primaryColor + '10' }}>
                      <div 
                        className="text-lg font-bold mb-2"
                        style={{ color: project.config.theme.primaryColor }}
                      >
                        Título do Quiz
                      </div>
                      <div 
                        className="text-sm mb-3"
                        style={{ color: project.config.theme.secondaryColor }}
                      >
                        Esta é uma prévia de como as cores ficam no quiz
                      </div>
                      <button 
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: project.config.theme.primaryColor }}
                      >
                        Botão de Ação
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Tema ativo: {colorSchemes[activeColorScheme as keyof typeof colorSchemes]?.name || 'Personalizado'}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowColorPalette(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                // Apply current theme to all steps
                const currentScheme = colorSchemes[activeColorScheme as keyof typeof colorSchemes];
                if (currentScheme) {
                  setProject(prev => ({
                    ...prev,
                    steps: prev.steps.map(step => ({
                      ...step,
                      settings: {
                        ...step.settings,
                        backgroundColor: currentScheme.background
                      }
                    }))
                  }));
                }
                setShowColorPalette(false);
              }}>
                Aplicar a Todo o Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}