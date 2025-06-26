import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Monitor, 
  Smartphone, 
  ArrowLeft, 
  Edit3,
  Palette,
  Save,
  Play,
  Settings,
  Eye,
  FileText,
  HelpCircle,
  Heart,
  Star,
  Gift,
  Target
} from "lucide-react";
import "@/styles/advanced-editor.css";

// Cores da marca Gisele Galvão
const brandColors = {
  primary: '#8B4513',      // brown
  dark: '#432818',         // dark brown  
  medium: '#8B5A3C',       // medium brown
  accent: '#D2691E',       // chocolate
  light: '#CD853F',        // peru
  cream: '#FAF9F7'         // cream
};

// Dados das etapas do quiz de estilo pessoal
const quizSteps = [
  {
    id: 'intro',
    title: 'Introdução',
    type: 'intro',
    icon: <Heart className="w-4 h-4" />,
    description: 'Página inicial do quiz com captura de nome'
  },
  {
    id: 'q1',
    title: 'Questão 1 - Tipo de Roupa',
    type: 'question',
    icon: <HelpCircle className="w-4 h-4" />,
    description: 'Qual o seu tipo de roupa favorita?'
  },
  {
    id: 'q2', 
    title: 'Questão 2 - Ocasiões Especiais',
    type: 'question',
    icon: <HelpCircle className="w-4 h-4" />,
    description: 'Para ocasiões especiais, você prefere...'
  },
  {
    id: 'q3',
    title: 'Questão 3 - Cores Preferidas',
    type: 'question', 
    icon: <HelpCircle className="w-4 h-4" />,
    description: 'Que cores mais te atraem?'
  },
  {
    id: 'transition',
    title: 'Transição',
    type: 'transition',
    icon: <Star className="w-4 h-4" />,
    description: 'Página de transição para perguntas estratégicas'
  },
  {
    id: 'strategic1',
    title: 'E-mail',
    type: 'strategic',
    icon: <Target className="w-4 h-4" />,
    description: 'Captura de e-mail'
  },
  {
    id: 'strategic2',
    title: 'WhatsApp',
    type: 'strategic',
    icon: <Target className="w-4 h-4" />,
    description: 'Captura de WhatsApp'
  },
  {
    id: 'result',
    title: 'Resultado',
    type: 'result',
    icon: <Gift className="w-4 h-4" />,
    description: 'Resultado do quiz com estilo predominante'
  }
];

const SimpleWorkingEditor: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState(quizSteps[0]);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Renderizador das etapas do quiz
  const renderQuizStep = () => {
    switch (selectedStep.type) {
      case 'intro':
        return (
          <div className="space-y-8 text-center px-6 py-12" style={{ backgroundColor: brandColors.cream }}>
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                alt="Gisele Galvão"
                className="h-20 w-auto"
              />
            </div>

            {/* Título */}
            <div 
              className={`cursor-pointer p-4 rounded-xl transition-all duration-200 ${
                selectedComponent === 'intro-title' 
                  ? 'ring-2 bg-amber-50' 
                  : 'hover:bg-gray-50'
              }`}
              style={{ ringColor: brandColors.accent }}
              onClick={() => setSelectedComponent('intro-title')}
            >
              <h1 className="text-5xl font-bold leading-tight" style={{ color: brandColors.dark }}>
                DESCUBRA SEU ESTILO PESSOAL
              </h1>
            </div>

            {/* Subtítulo */}
            <div 
              className={`cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                selectedComponent === 'intro-subtitle' 
                  ? 'ring-2 bg-amber-50' 
                  : 'hover:bg-gray-50'
              }`}
              style={{ ringColor: brandColors.accent }}
              onClick={() => setSelectedComponent('intro-subtitle')}
            >
              <p className="text-xl" style={{ color: brandColors.medium }}>
                Responda algumas perguntas e descubra qual estilo combina mais com você!
              </p>
            </div>

            {/* Campo nome */}
            <div className="max-w-md mx-auto space-y-6">
              <div 
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedComponent === 'intro-name' 
                    ? 'ring-2 bg-amber-50' 
                    : 'border-gray-200 hover:border-amber-300'
                }`}
                style={{ 
                  ringColor: brandColors.accent,
                  borderColor: selectedComponent === 'intro-name' ? brandColors.accent : undefined
                }}
                onClick={() => setSelectedComponent('intro-name')}
              >
                <Label className="block text-sm font-bold text-left mb-3" style={{ color: brandColors.dark }}>
                  SEU NOME *
                </Label>
                <Input 
                  placeholder="Digite seu primeiro nome aqui..."
                  className="w-full border-0 bg-white shadow-sm text-base"
                />
              </div>

              {/* Botão */}
              <div 
                className={`cursor-pointer rounded-xl transition-all duration-200 ${
                  selectedComponent === 'intro-button' 
                    ? 'ring-2' 
                    : ''
                }`}
                style={{ ringColor: brandColors.accent }}
                onClick={() => setSelectedComponent('intro-button')}
              >
                <Button 
                  className="w-full py-4 px-8 text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ 
                    backgroundColor: brandColors.accent, 
                    color: 'white'
                  }}
                >
                  COMEÇAR TESTE
                </Button>
              </div>
            </div>
          </div>
        );

      case 'question':
        return (
          <div className="space-y-8 px-6 py-8" style={{ backgroundColor: brandColors.cream }}>
            {/* Título da questão */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3" style={{ color: brandColors.dark }}>
                {selectedStep.description}
              </h2>
              <p className="text-base" style={{ color: brandColors.medium }}>
                Escolha 3 opções que mais se identificam com você
              </p>
            </div>

            {/* Grid de opções */}
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 hover:border-amber-300"
                >
                  <div className="space-y-3">
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Imagem {i}</span>
                    </div>
                    <p className="text-sm text-center leading-relaxed text-gray-700">
                      Opção de resposta {i} do quiz
                    </p>
                  </div>
                  
                  <div className="absolute top-2 left-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: brandColors.accent, color: 'white' }}
              >
                Continuar
              </Button>
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="text-center space-y-10 px-6 py-12" style={{ backgroundColor: brandColors.cream }}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: brandColors.dark }}>
                Parabéns! Seu estilo predominante é:
              </h2>
              <div 
                className="max-w-md mx-auto rounded-xl p-8"
                style={{ 
                  backgroundColor: `${brandColors.accent}15`,
                  border: `2px solid ${brandColors.accent}`
                }}
              >
                <h3 className="text-4xl font-bold mb-4" style={{ color: brandColors.accent }}>
                  ROMÂNTICO
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: brandColors.dark }}>
                  Você tem preferência por peças delicadas, femininas e com toque suave.
                </p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <Button 
                className="w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: brandColors.accent, color: 'white' }}
              >
                Ver Consultoria Personalizada
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20" style={{ backgroundColor: brandColors.cream }}>
            <p className="text-lg" style={{ color: brandColors.medium }}>
              {selectedStep.description}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: brandColors.dark }}>
      {/* Header com cores da marca */}
      <div className="border-b h-16 flex items-center px-6" style={{ backgroundColor: brandColors.dark, borderColor: brandColors.medium }}>
        <div className="flex items-center gap-6 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandColors.accent }}>
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: brandColors.cream }}>
              Quiz Editor - Gisele Galvão
            </h1>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" style={{ borderColor: brandColors.medium, color: brandColors.cream }}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" style={{ backgroundColor: brandColors.accent }}>
              <Play className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar de Etapas */}
        <div className="w-80 border-r flex flex-col" style={{ backgroundColor: brandColors.cream, borderColor: brandColors.medium }}>
          <div className="p-4 border-b" style={{ borderColor: brandColors.medium }}>
            <h3 className="font-semibold text-lg" style={{ color: brandColors.dark }}>
              Etapas do Quiz
            </h3>
            <p className="text-sm mt-1" style={{ color: brandColors.medium }}>
              {quizSteps.length} etapas configuradas
            </p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {quizSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    selectedStep.id === step.id 
                      ? 'shadow-md' 
                      : 'hover:bg-white/50'
                  }`}
                  style={{
                    backgroundColor: selectedStep.id === step.id ? brandColors.accent : 'transparent',
                    color: selectedStep.id === step.id ? 'white' : brandColors.dark,
                    borderColor: selectedStep.id === step.id ? brandColors.accent : 'transparent'
                  }}
                  onClick={() => setSelectedStep(step)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                         style={{ 
                           backgroundColor: selectedStep.id === step.id ? 'rgba(255,255,255,0.2)' : brandColors.medium + '20',
                           color: selectedStep.id === step.id ? 'white' : brandColors.dark
                         }}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {step.icon}
                        <Badge variant="outline" className="text-xs"
                               style={{ 
                                 borderColor: selectedStep.id === step.id ? 'rgba(255,255,255,0.3)' : brandColors.medium,
                                 color: selectedStep.id === step.id ? 'white' : brandColors.medium
                               }}>
                          {step.type}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm truncate">{step.title}</p>
                      <p className="text-xs opacity-75 truncate">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Canvas Principal */}
        <div className="flex-1 flex flex-col">
          {/* Header do Canvas */}
          <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'white', borderColor: brandColors.medium }}>
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-lg" style={{ color: brandColors.dark }}>
                {selectedStep.title}
              </h3>
              <Badge variant="outline" style={{ borderColor: brandColors.accent, color: brandColors.accent }}>
                {selectedStep.type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                onClick={() => setViewMode('desktop')}
                style={{ backgroundColor: viewMode === 'desktop' ? brandColors.accent : 'transparent' }}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                onClick={() => setViewMode('mobile')}
                style={{ backgroundColor: viewMode === 'mobile' ? brandColors.accent : 'transparent' }}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#f5f5f5' }}>
            <div className="h-full flex items-center justify-center">
              <div
                className="bg-white rounded-2xl shadow-xl border overflow-hidden"
                style={{
                  width: viewMode === 'mobile' ? '375px' : '900px',
                  height: viewMode === 'mobile' ? '667px' : '700px',
                  maxHeight: '85vh'
                }}
              >
                {/* Header do quiz */}
                <div 
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ backgroundColor: brandColors.accent }}
                >
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Quiz de Estilo Pessoal
                  </Badge>
                </div>

                {/* Barra de progresso */}
                <div 
                  className="h-2"
                  style={{ backgroundColor: `${brandColors.accent}20` }}
                >
                  <div 
                    className="h-2 transition-all duration-300"
                    style={{ 
                      backgroundColor: brandColors.accent,
                      width: selectedStep.type === 'intro' ? '10%' : 
                             selectedStep.type === 'question' ? '50%' : 
                             selectedStep.type === 'transition' ? '80%' : '100%'
                    }}
                  />
                </div>

                {/* Conteúdo do quiz */}
                <ScrollArea className="h-full">
                  {renderQuizStep()}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Propriedades */}
        <div className="w-80 border-l flex flex-col" style={{ backgroundColor: brandColors.cream, borderColor: brandColors.medium }}>
          <div className="p-4 border-b" style={{ borderColor: brandColors.medium }}>
            <h3 className="font-semibold text-lg" style={{ color: brandColors.dark }}>
              Propriedades
            </h3>
            <p className="text-sm mt-1" style={{ color: brandColors.medium }}>
              {selectedComponent ? `Editando: ${selectedComponent}` : 'Selecione um elemento'}
            </p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {selectedComponent ? (
                <>
                  <div>
                    <Label className="text-sm font-medium" style={{ color: brandColors.dark }}>
                      Texto
                    </Label>
                    <Input 
                      placeholder="Editar texto..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium" style={{ color: brandColors.dark }}>
                      Cor
                    </Label>
                    <div className="mt-1 flex gap-2">
                      {[brandColors.dark, brandColors.accent, brandColors.medium].map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium" style={{ color: brandColors.dark }}>
                      Tamanho da Fonte
                    </Label>
                    <Input 
                      type="number"
                      placeholder="16"
                      className="mt-1"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: brandColors.medium }} />
                  <p className="text-sm" style={{ color: brandColors.medium }}>
                    Clique em um elemento no canvas para editá-lo
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SimpleWorkingEditor;
