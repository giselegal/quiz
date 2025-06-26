import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Monitor,
  Smartphone,
  ArrowLeft,
  Edit3,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface QuizStep {
  id: string
  title: string
  type: 'intro' | 'question' | 'result' | 'transition'
  components: QuizComponent[]
  settings: {
    showHeader: boolean
    showProgress: boolean
    backgroundColor: string
    backgroundImage?: string
    padding: number
  }
}

interface QuizComponent {
  id: string
  type: string
  data: Record<string, any>
  style: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface QuizStepCanvasProps {
  step: QuizStep
  selectedComponentId: string | null
  onComponentSelect: (componentId: string | null) => void
  onComponentUpdate: (componentId: string, updates: Partial<QuizComponent>) => void
  onComponentDelete: (componentId: string) => void
  onComponentDuplicate: (componentId: string) => void
  onComponentMove: (componentId: string, direction: 'up' | 'down') => void
  viewMode: 'desktop' | 'mobile'
  onViewModeChange: (mode: 'desktop' | 'mobile') => void
}

// Renderizador específico para cada tipo de etapa do quiz de estilo pessoal
const QuizStepRenderer: React.FC<{
  step: QuizStep
  viewMode: 'desktop' | 'mobile'
  selectedComponentId: string | null
  onComponentSelect: (componentId: string | null) => void
  onComponentEdit: (componentId: string) => void
  onComponentDelete: (componentId: string) => void
  onComponentDuplicate: (componentId: string) => void
  onComponentMove: (componentId: string, direction: 'up' | 'down') => void
}> = ({ 
  step, 
  viewMode, 
  selectedComponentId, 
  onComponentSelect, 
  onComponentEdit, 
  onComponentDelete, 
  onComponentDuplicate, 
  onComponentMove 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])

  // Renderizador para a etapa de introdução
  const renderIntroStep = () => (
    <div className="space-y-8 text-center">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img 
          src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
          alt="Logo Gisele Galvão"
          className="h-16 w-auto"
        />
      </div>

      {/* Título principal */}
      <div 
        className={`cursor-pointer p-2 rounded-lg transition-all ${
          selectedComponentId === 'intro-title' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => onComponentSelect('intro-title')}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#432818] leading-tight">
          DESCUBRA SEU ESTILO PESSOAL
        </h1>
        {selectedComponentId === 'intro-title' && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white border rounded-lg shadow-lg p-1">
            <Button size="sm" variant="ghost" onClick={() => onComponentEdit('intro-title')}>
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onComponentDuplicate('intro-title')}>
              <Copy className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onComponentDelete('intro-title')}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Subtítulo */}
      <div 
        className={`cursor-pointer p-2 rounded-lg transition-all ${
          selectedComponentId === 'intro-subtitle' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => onComponentSelect('intro-subtitle')}
      >
        <p className="text-xl text-[#8B5A3C] mb-8">
          Responda algumas perguntas e descubra qual estilo combina mais com você!
        </p>
      </div>

      {/* Campo de nome */}
      <div className="max-w-md mx-auto space-y-4">
        <div 
          className={`cursor-pointer p-4 rounded-lg border transition-all ${
            selectedComponentId === 'intro-name-input' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onComponentSelect('intro-name-input')}
        >
          <Label className="block text-sm font-bold text-[#432818] mb-2 text-left">
            SEU NOME *
          </Label>
          <Input 
            placeholder="Digite seu primeiro nome aqui..."
            className="w-full"
          />
        </div>

        {/* Botão de início */}
        <div 
          className={`cursor-pointer p-2 rounded-lg transition-all ${
            selectedComponentId === 'intro-button' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onComponentSelect('intro-button')}
        >
          <Button 
            className="w-full bg-[#D2691E] hover:bg-[#CD853F] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            size="lg"
          >
            COMEÇAR TESTE
          </Button>
        </div>
      </div>
    </div>
  )

  // Renderizador para questões do quiz
  const renderQuestionStep = () => {
    // Dados de exemplo baseados na primeira questão real do quiz
    const questionData = {
      title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
      options: [
        {
          id: "1a",
          text: "Conforto, leveza e praticidade no vestir.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
          styleCategory: "Natural"
        },
        {
          id: "1b", 
          text: "Discrição, caimento clássico e sobriedade.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
          styleCategory: "Clássico"
        },
        {
          id: "1c",
          text: "Praticidade com um toque de estilo atual.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp", 
          styleCategory: "Contemporâneo"
        },
        {
          id: "1d",
          text: "Elegância refinada, moderna e sem exageros.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
          styleCategory: "Elegante"
        },
        {
          id: "1e",
          text: "Delicadeza em tecidos suaves e fluidos.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
          styleCategory: "Romântico"
        },
        {
          id: "1f",
          text: "Sensualidade com destaque para o corpo.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
          styleCategory: "Sexy"
        },
        {
          id: "1g", 
          text: "Impacto visual com peças estruturadas e assimétricas.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
          styleCategory: "Dramático"
        },
        {
          id: "1h",
          text: "Mix criativo com formas ousadas e originais.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
          styleCategory: "Criativo"
        }
      ]
    }

    return (
      <div className="space-y-8">
        {/* Título da questão */}
        <div 
          className={`cursor-pointer p-4 rounded-lg transition-all text-center ${
            selectedComponentId === 'question-title' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onComponentSelect('question-title')}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#432818] mb-2">
            {questionData.title}
          </h2>
          <p className="text-sm text-[#8B5A3C] mb-4">
            Escolha 3 opções que mais se identificam com você
          </p>
        </div>

        {/* Grid de opções */}
        <div 
          className={`cursor-pointer p-4 rounded-lg transition-all ${
            selectedComponentId === 'question-options' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onComponentSelect('question-options')}
        >
          <div className="grid grid-cols-2 gap-4">
            {questionData.options.map((option, index) => (
              <div
                key={option.id}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedAnswers.includes(option.id)
                    ? 'border-[#D2691E] bg-[#D2691E]/10'
                    : 'border-gray-200 hover:border-[#D2691E]/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedAnswers(prev => 
                    prev.includes(option.id)
                      ? prev.filter(id => id !== option.id)
                      : prev.length < 3 ? [...prev, option.id] : prev
                  )
                }}
              >
                <div className="space-y-3">
                  <img
                    src={option.imageUrl}
                    alt={`Opção ${String.fromCharCode(65 + index)}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-sm text-center text-gray-700 leading-relaxed">
                    {option.text}
                  </p>
                </div>
                
                {/* Indicador de seleção */}
                {selectedAnswers.includes(option.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#D2691E] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                
                {/* Letra da opção */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Contador de seleções */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {selectedAnswers.length}/3 opções selecionadas
            </p>
          </div>
        </div>

        {/* Botão continuar */}
        <div className="text-center">
          <Button 
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
              selectedAnswers.length === 3
                ? 'bg-[#D2691E] hover:bg-[#CD853F] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={selectedAnswers.length !== 3}
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Renderizador para página de transição
  const renderTransitionStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-[#432818]">
          Ótimo! Quase terminamos...
        </h2>
        <p className="text-xl text-[#8B5A3C]">
          Agora precisamos de algumas informações para personalizar ainda mais seu resultado!
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Button 
          className="w-full bg-[#D2691E] hover:bg-[#CD853F] text-white font-bold py-4 px-8 rounded-lg text-lg"
          size="lg"
        >
          Continuar para Perguntas Estratégicas
        </Button>
      </div>
    </div>
  )

  // Renderizador para página de resultado
  const renderResultStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-[#432818]">
          Parabéns! Seu estilo predominante é:
        </h2>
        <div className="bg-[#D2691E]/10 border-2 border-[#D2691E] rounded-lg p-6">
          <h3 className="text-4xl font-bold text-[#D2691E] mb-4">
            ROMÂNTICO
          </h3>
          <p className="text-lg text-[#432818]">
            Você tem preferência por peças delicadas, femininas e com toque suave. Sua personalidade se reflete em roupas que destacam sua sensibilidade e doçura.
          </p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto">
        <Button 
          className="w-full bg-[#D2691E] hover:bg-[#CD853F] text-white font-bold py-4 px-8 rounded-lg text-lg"
          size="lg"
        >
          Ver Consultoria Personalizada
        </Button>
      </div>
    </div>
  )

  // Selecionador de renderizador baseado no tipo da etapa
  const renderStepContent = () => {
    switch (step.type) {
      case 'intro':
        return renderIntroStep()
      case 'question':
        return renderQuestionStep()
      case 'transition':
        return renderTransitionStep()
      case 'result':
        return renderResultStep()
      default:
        return (
          <div className="text-center py-16">
            <p className="text-gray-500">Tipo de etapa não reconhecido: {step.type}</p>
          </div>
        )
    }
  }

  return (
    <div className="relative">
      {renderStepContent()}
    </div>
  )
}

export const QuizStepCanvas: React.FC<QuizStepCanvasProps> = ({
  step,
  selectedComponentId,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onComponentMove,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Header do Canvas */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">
            {step.title} ({step.type})
          </h3>
          <Badge variant="outline" className="text-xs capitalize">
            {step.type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('desktop')}
            className="px-3"
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('mobile')}
            className="px-3"
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <motion.div
            layout
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            style={{
              width: viewMode === 'mobile' ? '375px' : '800px',
              height: viewMode === 'mobile' ? '667px' : '600px',
              maxHeight: '80vh'
            }}
          >
            {/* Quiz Header */}
            {step.settings.showHeader && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Quiz de Estilo
                  </Badge>
                </div>
                {step.settings.showProgress && (
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                )}
              </div>
            )}

            {/* Canvas Content */}
            <ScrollArea className="h-full">
              <div 
                className="p-6 min-h-full"
                style={{
                  backgroundColor: step.settings.backgroundColor || '#ffffff',
                  padding: `${step.settings.padding || 24}px`
                }}
                onClick={() => onComponentSelect(null)}
              >
                <QuizStepRenderer
                  step={step}
                  viewMode={viewMode}
                  selectedComponentId={selectedComponentId}
                  onComponentSelect={onComponentSelect}
                  onComponentEdit={(id) => onComponentSelect(id)}
                  onComponentDelete={onComponentDelete}
                  onComponentDuplicate={onComponentDuplicate}
                  onComponentMove={onComponentMove}
                />
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default QuizStepCanvas