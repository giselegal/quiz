import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  Settings, 
  Eye, 
  Code, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Layout,
  MousePointer,
  ArrowLeft,
  CheckCircle,
  CircleDot,
  Move,
  Edit3,
  Save,
  Smartphone,
  Monitor,
  Tablet,
  Copy,
  ChevronUp,
  ChevronDown
} from "lucide-react";

// Interfaces baseadas na análise completa dos layouts do funil
interface QuizStep {
  id: string;
  type: 'intro' | 'question' | 'transition' | 'strategic' | 'result';
  name: string;
  title: string;
  subtitle?: string;
  hasHeader: boolean;
  headerConfig: {
    showLogo: boolean;
    showProgress: boolean;
    allowReturn: boolean;
    logoUrl?: string;
  };
  questionConfig?: {
    questionType: 'visual-options' | 'text-options' | 'strategic-question' | 'input-name';
    multipleSelection: boolean;
    maxSelections: number;
    hasImages: boolean;
    showCategories: boolean;
  };
  content: QuizComponent[];
}

interface QuizComponent {
  id: string;
  type: 'heading' | 'subtitle' | 'image' | 'input' | 'button' | 'spacer' | 'visual-options' | 'text-options' | 'strategic-question';
  data: any;
  selected?: boolean;
}

interface QuizOption {
  id: string;
  text: string;
  image?: string;
  value: string;
  category?: string;
  strategicValue?: number;
}

// Dados reais do funil
const STYLE_CATEGORIES = [
  'Natural', 'Clássico', 'Contemporâneo', 'Elegante', 
  'Romântico', 'Sexy', 'Dramático', 'Criativo'
];

// Templates baseados nos layouts reais do funil
const QUIZ_TEMPLATES = {
  intro: {
    name: "Etapa de Introdução",
    title: "Teste de Estilo Pessoal",
    subtitle: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up"
  },
  
  visualQuestion: {
    name: "Questão Visual",
    title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    options: [
      {
        text: "Conforto, leveza e praticidade no vestir",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
        category: "Natural"
      },
      {
        text: "Discrição, caimento clássico e sobriedade",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
        category: "Clássico"
      },
      {
        text: "Informação de moda, inovação e funcionalidade",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/13_qccdqv.webp",
        category: "Contemporâneo"
      },
      {
        text: "Luxo, refinamento e qualidade",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_rqy7yh.webp",
        category: "Elegante"
      },
      {
        text: "Feminilidade, delicadeza e charme",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/15_kpqhgl.webp",
        category: "Romântico"
      },
      {
        text: "Sensualidade, glamour e sedução",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735331/16_oqc9gd.webp",
        category: "Sexy"
      },
      {
        text: "Imponência, sofisticação e poder",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735331/17_iqr8th.webp",
        category: "Dramático"
      },
      {
        text: "Originalidade, criatividade e personalidade",
        image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735331/18_o5gzhu.webp",
        category: "Criativo"
      }
    ]
  },
  
  textQuestion: {
    name: "Questão de Texto",
    title: "RESUMA A SUA PERSONALIDADE:",
    options: [
      { text: "Informal, espontânea, alegre, essencialista", category: "Natural" },
      { text: "Conservadora, séria, organizada", category: "Clássico" },
      { text: "Informada, ativa, prática", category: "Contemporâneo" },
      { text: "Exigente, sofisticada, seletiva", category: "Elegante" },
      { text: "Feminina, meiga, delicada, sensível", category: "Romântico" },
      { text: "Glamorosa, vaidosa, sensual", category: "Sexy" },
      { text: "Cosmopolita, moderna e audaciosa", category: "Dramático" },
      { text: "Exótica, aventureira, livre", category: "Criativo" }
    ]
  },

  strategicQuestion: {
    name: "Questão Estratégica",
    title: "COMO É O SEU ATUAL ESTILO DE VIDA?",
    subtitle: "Considere sua rotina e atividades principais:",
    options: [
      { text: "Trabalho em casa, home office, flexibilidade", strategicValue: 1 },
      { text: "Trabalho presencial, reuniões frequentes", strategicValue: 2 },
      { text: "Vida social intensa, eventos, festas", strategicValue: 3 },
      { text: "Foco na família, atividades domésticas", strategicValue: 4 },
      { text: "Estudante, vida acadêmica", strategicValue: 5 },
      { text: "Aposentada, mais tempo livre", strategicValue: 6 }
    ]
  }
};

const COMPONENT_LIBRARY = [
  { 
    type: 'heading', 
    icon: Type, 
    label: 'Título',
    description: 'Adicionar título principal'
  },
  { 
    type: 'subtitle', 
    icon: Type, 
    label: 'Subtítulo',
    description: 'Adicionar subtítulo'
  },
  { 
    type: 'image', 
    icon: ImageIcon, 
    label: 'Imagem',
    description: 'Adicionar imagem'
  },
  { 
    type: 'input', 
    icon: Edit3, 
    label: 'Campo de Entrada',
    description: 'Campo para nome ou texto'
  },
  { 
    type: 'button', 
    icon: MousePointer, 
    label: 'Botão',
    description: 'Botão de ação'
  },
  { 
    type: 'spacer', 
    icon: Layout, 
    label: 'Espaçamento',
    description: 'Espaço entre elementos'
  },
  { 
    type: 'visual-options', 
    icon: CircleDot, 
    label: 'Opções Visuais',
    description: 'Opções com imagens'
  },
  { 
    type: 'text-options', 
    icon: CheckCircle, 
    label: 'Opções de Texto',
    description: 'Opções somente texto'
  },
  { 
    type: 'strategic-question', 
    icon: Settings, 
    label: 'Questão Estratégica',
    description: 'Pergunta para segmentação'
  }
];

const ModernVisualEditor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>({
    id: "step-1",
    type: "intro",
    name: "Etapa 1 - Introdução",
    title: "Teste de Estilo Pessoal",
    subtitle: "Descubra seu estilo pessoal único",
    hasHeader: true,
    headerConfig: {
      showLogo: true,
      showProgress: true,
      allowReturn: true,
      logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2"
    },
    content: [
      {
        id: "heading-1",
        type: "heading",
        data: { text: "Teste de Estilo Pessoal", level: 1, align: "center" }
      },
      {
        id: "image-1",
        type: "image",
        data: { 
          src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up",
          alt: "Imagem de introdução",
          width: "100%",
          height: "auto",
          borderRadius: 8
        }
      },
      {
        id: "subtitle-1",
        type: "subtitle",
        data: { 
          text: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
          align: "center"
        }
      },
      {
        id: "input-1",
        type: "input",
        data: { 
          label: "NOME",
          placeholder: "Digite seu nome aqui...",
          required: true,
          type: "text"
        }
      },
      {
        id: "button-1",
        type: "button",
        data: { 
          text: "COMEÇAR AGORA", 
          variant: "primary",
          fullWidth: true,
          size: "large"
        }
      }
    ]
  });

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Funções de manipulação de componentes
  const addComponent = (type: string) => {
    const newComponent: QuizComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      data: getDefaultComponentData(type)
    };

    setCurrentStep(prev => ({
      ...prev,
      content: [...prev.content, newComponent]
    }));
  };

  const getDefaultComponentData = (type: string) => {
    switch (type) {
      case 'heading':
        return { text: "Novo Título", level: 1, align: "center" };
      case 'subtitle':
        return { text: "Novo subtítulo", align: "center" };
      case 'image':
        return { 
          src: "https://via.placeholder.com/400x300",
          alt: "Nova Imagem",
          width: "100%",
          height: "auto",
          borderRadius: 8
        };
      case 'input':
        return { 
          label: "Campo",
          placeholder: "Digite aqui...",
          required: false,
          type: "text"
        };
      case 'button':
        return { 
          text: "Botão", 
          variant: "primary",
          fullWidth: true,
          size: "medium"
        };
      case 'spacer':
        return { height: 32 };
      case 'visual-options':
        return {
          title: "QUAL SUA PREFERÊNCIA?",
          multiSelect: false,
          maxSelections: 1,
          showImages: true,
          options: [
            { 
              id: "opt-1", 
              text: "Opção com imagem 1", 
              value: "option1",
              image: "https://via.placeholder.com/80x80",
              category: "Natural"
            },
            { 
              id: "opt-2", 
              text: "Opção com imagem 2", 
              value: "option2",
              image: "https://via.placeholder.com/80x80",
              category: "Clássico"
            }
          ]
        };
      case 'text-options':
        return {
          title: "ESCOLHA UMA OPÇÃO:",
          multiSelect: false,
          maxSelections: 1,
          showImages: false,
          options: [
            { id: "opt-1", text: "Primeira opção", value: "option1", category: "Natural" },
            { id: "opt-2", text: "Segunda opção", value: "option2", category: "Clássico" }
          ]
        };
      case 'strategic-question':
        return {
          title: "QUESTÃO ESTRATÉGICA:",
          subtitle: "Esta pergunta nos ajuda a personalizar sua experiência",
          multiSelect: false,
          options: [
            { id: "opt-1", text: "Opção estratégica 1", value: "strategic1", strategicValue: 1 },
            { id: "opt-2", text: "Opção estratégica 2", value: "strategic2", strategicValue: 2 }
          ]
        };
      default:
        return {};
    }
  };

  const updateComponent = (componentId: string, newData: any) => {
    setCurrentStep(prev => ({
      ...prev,
      content: prev.content.map(comp => 
        comp.id === componentId 
          ? { ...comp, data: { ...comp.data, ...newData } }
          : comp
      )
    }));
  };

  const deleteComponent = (componentId: string) => {
    setCurrentStep(prev => ({
      ...prev,
      content: prev.content.filter(comp => comp.id !== componentId)
    }));
  };

  const duplicateComponent = (componentId: string) => {
    const component = currentStep.content.find(c => c.id === componentId);
    if (component) {
      const newComponent = {
        ...component,
        id: `${component.type}-${Date.now()}`
      };
      setCurrentStep(prev => ({
        ...prev,
        content: [...prev.content, newComponent]
      }));
    }
  };

  const moveComponent = (componentId: string, direction: 'up' | 'down') => {
    setCurrentStep(prev => {
      const components = [...prev.content];
      const index = components.findIndex(c => c.id === componentId);
      
      if ((direction === 'up' && index > 0) || (direction === 'down' && index < components.length - 1)) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [components[index], components[newIndex]] = [components[newIndex], components[index]];
      }
      
      return { ...prev, content: components };
    });
  };

  // Renderização de componentes no preview
  const renderComponentActions = (componentId: string) => {
    const isSelected = selectedComponent === componentId;
    if (!isSelected) return null;
    
    return (
      <div className="absolute -top-10 left-0 flex gap-1 bg-white shadow-lg rounded-md p-1 border z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            moveComponent(componentId, 'up');
          }}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            moveComponent(componentId, 'down');
          }}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            duplicateComponent(componentId);
          }}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            deleteComponent(componentId);
          }}
        >
          <Trash2 className="h-3 w-3 text-red-500" />
        </Button>
      </div>
    );
  };

  const renderPreviewComponent = (component: QuizComponent) => {
    const isSelected = selectedComponent === component.id;
    const baseClasses = `
      group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto
      ${isSelected ? 'border-2 border-blue-500 rounded-md' : 'hover:border-2 hover:border-blue-500 hover:rounded-md hover:border-dashed'}
    `;

    switch (component.type) {
      case 'heading':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            <h1 className="min-w-full text-3xl font-bold text-center">
              {component.data.text}
            </h1>
          </div>
        );

      case 'image':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="grid">
              <div className="text-lg flex items-center justify-center">
                <img 
                  src={component.data.src}
                  alt={component.data.alt}
                  className="object-cover w-full h-auto rounded-lg max-w-96"
                />
              </div>
            </div>
          </div>
        );

      case 'input':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="grid w-full items-center gap-1.5">
              <label className="text-sm font-medium leading-none">
                {component.data.label} {component.data.required && <span>*</span>}
              </label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background p-4"
                placeholder={component.data.placeholder}
                type="text"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            <button className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 min-w-full h-14 rounded-md">
              {component.data.text}
            </button>
          </div>
        );

      case 'spacer':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div 
              className="min-w-full border-dashed border-yellow-500 border rounded-lg"
              style={{ height: `${component.data.height}px` }}
            />
          </div>
        );

      case 'visual-options':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            {renderComponentActions(component.id)}
            <div className="space-y-4">
              {component.data.title && (
                <h3 className="text-xl font-bold text-center">{component.data.title}</h3>
              )}
              <div className="grid gap-3">
                {component.data.options.map((option: QuizOption) => (
                  <button 
                    key={option.id}
                    className="flex items-center justify-between p-4 border rounded-md hover:shadow-md transition-all bg-white hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {option.image && (
                        <img 
                          src={option.image} 
                          alt={option.text}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="text-left">
                        <div className="font-medium">{option.text}</div>
                        {option.category && (
                          <div className="text-sm text-gray-500">{option.category}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'text-options':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            {renderComponentActions(component.id)}
            <div className="space-y-4">
              {component.data.title && (
                <h3 className="text-xl font-bold text-center">{component.data.title}</h3>
              )}
              <div className="grid gap-2">
                {component.data.options.map((option: QuizOption) => (
                  <button 
                    key={option.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:shadow-sm transition-all bg-white hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium">{option.text}</div>
                    {option.category && (
                      <Badge variant="secondary" className="text-xs">{option.category}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'strategic-question':
        return (
          <div 
            key={component.id}
            className={baseClasses}
            onClick={() => setSelectedComponent(component.id)}
          >
            {renderComponentActions(component.id)}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold">{component.data.title}</h3>
                {component.data.subtitle && (
                  <p className="text-gray-600 mt-2">{component.data.subtitle}</p>
                )}
              </div>
              <div className="grid gap-2">
                {component.data.options.map((option: QuizOption) => (
                  <button 
                    key={option.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:shadow-sm transition-all bg-blue-50 hover:bg-blue-100 text-left"
                  >
                    <div className="font-medium">{option.text}</div>
                    <Badge variant="outline" className="text-xs">
                      Valor: {option.strategicValue}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Painel de propriedades baseado no componente selecionado
  const renderPropertiesPanel = () => {
    const component = currentStep.content.find(c => c.id === selectedComponent);
    if (!component) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Propriedades - {component.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {component.type === 'heading' && (
            <>
              <div>
                <Label>Texto</Label>
                <Input 
                  value={component.data.text}
                  onChange={(e) => updateComponent(component.id, { text: e.target.value })}
                />
              </div>
              <div>
                <Label>Nível</Label>
                <Select 
                  value={component.data.level.toString()}
                  onValueChange={(value) => updateComponent(component.id, { level: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">H1</SelectItem>
                    <SelectItem value="2">H2</SelectItem>
                    <SelectItem value="3">H3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {component.type === 'image' && (
            <>
              <div>
                <Label>URL da Imagem</Label>
                <Input 
                  value={component.data.src}
                  onChange={(e) => updateComponent(component.id, { src: e.target.value })}
                />
              </div>
              <div>
                <Label>Texto Alternativo</Label>
                <Input 
                  value={component.data.alt}
                  onChange={(e) => updateComponent(component.id, { alt: e.target.value })}
                />
              </div>
            </>
          )}

          {component.type === 'input' && (
            <>
              <div>
                <Label>Rótulo</Label>
                <Input 
                  value={component.data.label}
                  onChange={(e) => updateComponent(component.id, { label: e.target.value })}
                />
              </div>
              <div>
                <Label>Placeholder</Label>
                <Input 
                  value={component.data.placeholder}
                  onChange={(e) => updateComponent(component.id, { placeholder: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={component.data.required}
                  onCheckedChange={(checked) => updateComponent(component.id, { required: checked })}
                />
                <Label>Obrigatório</Label>
              </div>
            </>
          )}

          {component.type === 'button' && (
            <>
              <div>
                <Label>Texto</Label>
                <Input 
                  value={component.data.text}
                  onChange={(e) => updateComponent(component.id, { text: e.target.value })}
                />
              </div>
              <div>
                <Label>Variante</Label>
                <Select 
                  value={component.data.variant}
                  onValueChange={(value) => updateComponent(component.id, { variant: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(component.type === 'visual-options' || component.type === 'text-options' || component.type === 'strategic-question') && (
            <>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={component.data.multiSelect}
                  onCheckedChange={(checked) => updateComponent(component.id, { multiSelect: checked })}
                />
                <Label>Seleção Múltipla</Label>
              </div>
              
              {component.data.multiSelect && (
                <div>
                  <Label>Máximo de Seleções</Label>
                  <Input 
                    type="number"
                    value={component.data.maxSelections}
                    onChange={(e) => updateComponent(component.id, { maxSelections: parseInt(e.target.value) })}
                  />
                </div>
              )}

              <div>
                <Label>Opções</Label>
                <div className="space-y-2">
                  {component.data.options.map((option: QuizOption, index: number) => (
                    <Card key={option.id} className="p-3">
                      <div className="space-y-2">
                        <Input 
                          placeholder="Texto da opção"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...component.data.options];
                            newOptions[index].text = e.target.value;
                            updateComponent(component.id, { options: newOptions });
                          }}
                        />
                        <Input 
                          placeholder="URL da imagem (opcional)"
                          value={option.image || ''}
                          onChange={(e) => {
                            const newOptions = [...component.data.options];
                            newOptions[index].image = e.target.value;
                            updateComponent(component.id, { options: newOptions });
                          }}
                        />
                        <Select 
                          value={option.category || ''}
                          onValueChange={(value) => {
                            const newOptions = [...component.data.options];
                            newOptions[index].category = value;
                            updateComponent(component.id, { options: newOptions });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Categoria de estilo" />
                          </SelectTrigger>
                          <SelectContent>
                            {STYLE_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            const newOptions = component.data.options.filter((_: any, i: number) => i !== index);
                            updateComponent(component.id, { options: newOptions });
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newOption = {
                        id: `opt-${Date.now()}`,
                        text: "Nova opção",
                        value: `option${component.data.options.length + 1}`
                      };
                      updateComponent(component.id, { 
                        options: [...component.data.options, newOption] 
                      });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar Opção
                  </Button>
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
            Remover Componente
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Painel Lateral Esquerdo - Ferramentas */}
      <div className="w-80 border-r bg-muted/30 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quiz Editor</h2>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('edit')}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* Configurações da Etapa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configurações da Etapa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Nome da Etapa</Label>
                  <Input 
                    value={currentStep.title}
                    onChange={(e) => setCurrentStep(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select 
                    value={currentStep.type}
                    onValueChange={(value: any) => setCurrentStep(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intro">Introdução</SelectItem>
                      <SelectItem value="question">Questão</SelectItem>
                      <SelectItem value="transition">Transição</SelectItem>
                      <SelectItem value="result">Resultado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Configurações do Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={currentStep.headerConfig.showLogo}
                    onCheckedChange={(checked) => setCurrentStep(prev => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, showLogo: checked }
                    }))}
                  />
                  <Label>Mostrar Logo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={currentStep.headerConfig.showProgress}
                    onCheckedChange={(checked) => setCurrentStep(prev => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, showProgress: checked }
                    }))}
                  />
                  <Label>Mostrar Progresso</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={currentStep.headerConfig.allowReturn}
                    onCheckedChange={(checked) => setCurrentStep(prev => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, allowReturn: checked }
                    }))}
                  />
                  <Label>Permitir Voltar</Label>
                </div>
              </CardContent>
            </Card>

            {/* Biblioteca de Componentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Componentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('heading')}>
                    <Type className="h-4 w-4 mr-2" />
                    Título
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('subtitle')}>
                    <Type className="h-4 w-4 mr-2" />
                    Subtítulo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('image')}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Imagem
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('input')}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Campo de Entrada
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('button')}>
                    <MousePointer className="h-4 w-4 mr-2" />
                    Botão
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('spacer')}>
                    <Layout className="h-4 w-4 mr-2" />
                    Espaçamento
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('visual-options')}>
                    <CircleDot className="h-4 w-4 mr-2" />
                    Opções Visuais
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('text-options')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Opções de Texto
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent('strategic-question')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Questão Estratégica
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Templates Pré-definidos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Palette className="h-4 w-4 mr-2" />
                    Questão Visual
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Type className="h-4 w-4 mr-2" />
                    Questão Texto
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Layout className="h-4 w-4 mr-2" />
                    Página Intro
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Painel de Propriedades */}
            {selectedComponent && renderPropertiesPanel()}
          </div>
        </ScrollArea>
      </div>

      {/* Área Principal - Preview */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header do Preview */}
          <div className="border-b bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentStep.type}</Badge>
                <span className="font-medium">{currentStep.title}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Ver Código
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto bg-background">
            <div className="group relative main-content w-full min-h-full mx-auto">
              <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 md:p-5 pb-10">
                
                {/* Header Simulado */}
                {currentStep.headerConfig.showLogo || currentStep.headerConfig.showProgress || currentStep.headerConfig.allowReturn ? (
                  <div className="grid gap-4 opacity-100">
                    <div className="flex flex-row w-full h-auto justify-center relative">
                      {currentStep.headerConfig.allowReturn && (
                        <button className="inline-flex items-center justify-center h-10 w-10 absolute left-0">
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                      )}
                      <div className="flex flex-col w-full justify-start items-center gap-4">
                        {currentStep.headerConfig.showLogo && (
                          <img 
                            width="96" 
                            height="96" 
                            className="max-w-24 object-cover" 
                            alt="Logo" 
                            src={currentStep.headerConfig.logoUrl || "https://via.placeholder.com/96x96"}
                          />
                        )}
                        {currentStep.headerConfig.showProgress && (
                          <div className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2">
                            <div className="progress h-full w-full flex-1 bg-primary transition-all" style={{transform: "translateX(-85.7143%)"}}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Conteúdo Principal */}
                <div className="main-content w-full relative mx-auto h-full">
                  <div className="flex flex-row flex-wrap pb-10">
                    {currentStep.content.map(renderPreviewComponent)}
                  </div>
                </div>

                <div className="pt-10 md:pt-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ModernVisualEditor };
export default ModernVisualEditor;
