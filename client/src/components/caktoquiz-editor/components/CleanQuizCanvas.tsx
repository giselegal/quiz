import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Monitor, Smartphone, ArrowLeft, Edit3 } from 'lucide-react'

interface QuizStep {
  id: string
  title: string
  type: 'intro' | 'question' | 'result' | 'transition'
}

interface CleanQuizCanvasProps {
  step: QuizStep
  selectedComponentId: string | null
  onComponentSelect: (componentId: string | null) => void
  viewMode: 'desktop' | 'mobile'
  onViewModeChange: (mode: 'desktop' | 'mobile') => void
}

// Cores da marca Gisele Galvão
const brandColors = {
  primary: '#8B4513',      // brown
  dark: '#432818',         // dark brown  
  medium: '#8B5A3C',       // medium brown
  accent: '#D2691E',       // chocolate
  light: '#CD853F',        // peru
  cream: '#FAF9F7'         // cream
}

const QuizStepPreview: React.FC<{
  step: QuizStep
  selectedComponentId: string | null
  onComponentSelect: (componentId: string | null) => void
}> = ({ step, selectedComponentId, onComponentSelect }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])

  // Etapa de introdução limpa
  const renderIntroStep = () => (
    <div className="space-y-12 text-center px-6 py-12">
      {/* Logo da marca */}
      <div className="flex justify-center">
        <img 
          src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
          alt="Gisele Galvão"
          className="h-20 w-auto"
        />
      </div>

      {/* Título principal editável */}
      <div 
        className={`cursor-pointer p-4 rounded-xl transition-all duration-200 ${
          selectedComponentId === 'intro-title' 
            ? 'ring-2 ring-amber-400 bg-amber-50' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onComponentSelect('intro-title')}
      >
        <h1 className="text-5xl font-bold leading-tight" style={{ color: brandColors.dark }}>
          DESCUBRA SEU ESTILO PESSOAL
        </h1>
        {selectedComponentId === 'intro-title' && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-amber-500 text-white">
              <Edit3 className="w-3 h-3 mr-1" />
              Editando Título
            </Badge>
          </div>
        )}
      </div>

      {/* Subtítulo editável */}
      <div 
        className={`cursor-pointer p-3 rounded-xl transition-all duration-200 ${
          selectedComponentId === 'intro-subtitle' 
            ? 'ring-2 ring-amber-400 bg-amber-50' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onComponentSelect('intro-subtitle')}
      >
        <p className="text-xl" style={{ color: brandColors.medium }}>
          Responda algumas perguntas e descubra qual estilo combina mais com você!
        </p>
      </div>

      {/* Campo nome */}
      <div className="max-w-md mx-auto space-y-6">
        <div 
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
            selectedComponentId === 'intro-name' 
              ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-300' 
              : 'border-gray-200 hover:border-amber-300'
          }`}
          onClick={() => onComponentSelect('intro-name')}
        >
          <Label className="block text-sm font-bold text-left mb-3" style={{ color: brandColors.dark }}>
            SEU NOME *
          </Label>
          <Input 
            placeholder="Digite seu primeiro nome aqui..."
            className="w-full border-0 bg-white shadow-sm text-base"
          />
        </div>

        {/* Botão iniciar */}
        <div 
          className={`cursor-pointer rounded-xl transition-all duration-200 ${
            selectedComponentId === 'intro-button' 
              ? 'ring-2 ring-amber-400' 
              : ''
          }`}
          onClick={() => onComponentSelect('intro-button')}
        >
          <Button 
            className="w-full py-4 px-8 text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: brandColors.accent, 
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = brandColors.light
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = brandColors.accent
            }}
          >
            COMEÇAR TESTE
          </Button>
        </div>
      </div>
    </div>
  )

  // Etapa de questão limpa
  const renderQuestionStep = () => {
    const questionData = {
      title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
      subtitle: "Escolha 3 opções que mais se identificam com você",
      options: [
        {
          id: "1a",
          text: "Conforto, leveza e praticidade no vestir.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
          letter: "A"
        },
        {
          id: "1b", 
          text: "Discrição, caimento clássico e sobriedade.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
          letter: "B"
        },
        {
          id: "1c",
          text: "Praticidade com um toque de estilo atual.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
          letter: "C"
        },
        {
          id: "1d",
          text: "Elegância refinada, moderna e sem exageros.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
          letter: "D"
        }
      ]
    }

    return (
      <div className="space-y-8 px-6 py-8">
        {/* Cabeçalho da questão */}
        <div 
          className={`text-center cursor-pointer p-4 rounded-xl transition-all duration-200 ${
            selectedComponentId === 'question-header' 
              ? 'ring-2 ring-amber-400 bg-amber-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onComponentSelect('question-header')}
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: brandColors.dark }}>
            {questionData.title}
          </h2>
          <p className="text-base" style={{ color: brandColors.medium }}>
            {questionData.subtitle}
          </p>
        </div>

        {/* Grid de opções */}
        <div 
          className={`cursor-pointer p-4 rounded-xl transition-all duration-200 ${
            selectedComponentId === 'question-options' 
              ? 'ring-2 ring-amber-400 bg-amber-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onComponentSelect('question-options')}
        >
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {questionData.options.map((option) => (
              <div
                key={option.id}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedAnswers.includes(option.id)
                    ? 'bg-amber-50 shadow-md'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
                style={{
                  borderColor: selectedAnswers.includes(option.id) ? brandColors.accent : '#e5e7eb'
                }}
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
                    alt={`Opção ${option.letter}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-sm text-center leading-relaxed text-gray-700">
                    {option.text}
                  </p>
                </div>
                
                {/* Checkmark de seleção */}
                {selectedAnswers.includes(option.id) && (
                  <div 
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: brandColors.accent }}
                  >
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                
                {/* Letra da opção */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {option.letter}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Contador de seleções */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {selectedAnswers.length}/3 opções selecionadas
            </p>
          </div>
        </div>

        {/* Botão continuar */}
        <div className="text-center">
          <Button 
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
              selectedAnswers.length === 3
                ? 'shadow-lg hover:shadow-xl'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: selectedAnswers.length === 3 ? brandColors.accent : '#9ca3af',
              color: 'white'
            }}
            disabled={selectedAnswers.length !== 3}
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Etapa de transição limpa
  const renderTransitionStep = () => (
    <div className="text-center space-y-10 px-6 py-12">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold" style={{ color: brandColors.dark }}>
          Ótimo! Quase terminamos...
        </h2>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: brandColors.medium }}>
          Agora precisamos de algumas informações para personalizar ainda mais seu resultado!
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Button 
          className="w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ 
            backgroundColor: brandColors.accent, 
            color: 'white' 
          }}
        >
          Continuar para Perguntas Estratégicas
        </Button>
      </div>
    </div>
  )

  // Etapa de resultado limpa
  const renderResultStep = () => (
    <div className="text-center space-y-10 px-6 py-12">
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
            Sua personalidade se reflete em roupas que destacam sua sensibilidade e doçura.
          </p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto">
        <Button 
          className="w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ 
            backgroundColor: brandColors.accent, 
            color: 'white' 
          }}
        >
          Ver Consultoria Personalizada
        </Button>
      </div>
    </div>
  )

  // Renderizador principal baseado no tipo da etapa
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
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Tipo de etapa: {step.type}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="relative" style={{ backgroundColor: brandColors.cream }}>
      {renderStepContent()}
    </div>
  )
}

export const CleanQuizCanvas: React.FC<CleanQuizCanvasProps> = ({
  step,
  selectedComponentId,
  onComponentSelect,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex-1 bg-gray-100 flex flex-col">
      {/* Header limpo */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900 text-lg">
            {step.title}
          </h3>
          <Badge 
            variant="outline" 
            className="text-xs capitalize"
            style={{ 
              borderColor: brandColors.accent,
              color: brandColors.accent 
            }}
          >
            {step.type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('desktop')}
            className="px-4"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('mobile')}
            className="px-4"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>
      </div>

      {/* Canvas área */}
      <div className="flex-1 p-8 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <motion.div
            layout
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
                  width: step.type === 'intro' ? '10%' : 
                         step.type === 'question' ? '50%' : 
                         step.type === 'transition' ? '80%' : '100%'
                }}
              />
            </div>

            {/* Conteúdo do quiz */}
            <ScrollArea className="h-full">
              <QuizStepPreview
                step={step}
                selectedComponentId={selectedComponentId}
                onComponentSelect={onComponentSelect}
              />
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CleanQuizCanvas