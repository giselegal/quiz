import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Monitor, Tablet, Maximize2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ComponentRenderer } from './ComponentRenderer'
import CaktoQuizRenderer from './CaktoQuizRenderer'

interface QuizComponent {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'options' | 'input' | 'spacer' | 'divider' | 'html' | 'script' | 'video' | 'testimonial' | 'price' | 'countdown' | 'guarantee' | 'bonus' | 'faq' | 'social-proof' | 'logo' | 'progress'
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface QuizData {
  id: string
  name: string
  steps: any[]
  settings: Record<string, any>
}

interface CanvasProps {
  className?: string
  quizData: QuizData
  selectedComponent: QuizComponent | null
  onComponentSelect: (component: QuizComponent) => void
  onComponentUpdate: (componentId: string, updates: Partial<QuizComponent>) => void
  onComponentRemove: (componentId: string) => void
  viewMode?: 'desktop' | 'mobile'
}

type ViewportMode = 'mobile' | 'desktop'

const viewportSizes = {
  mobile: { width: 400, height: 600 },
  desktop: { width: 800, height: 600 }
}

// Quiz Header Component
const QuizHeader: React.FC<{
  config: any
  currentStep: number
  totalSteps: number
}> = ({ config, currentStep, totalSteps }) => (
  <div className="flex flex-col gap-4 p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
    {config.showLogo && (
      <div className="flex items-center justify-center relative">
        {config.showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute left-0 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <img 
          src={config.logoUrl || 'https://via.placeholder.com/64x64'} 
          alt="Logo" 
          className="w-16 h-16 rounded-lg object-cover"
        />
      </div>
    )}
    
    {config.showProgress && (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progresso</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    )}
  </div>
)

// Empty Canvas State
const EmptyCanvasState: React.FC = () => (
  <div className="flex items-center justify-center min-h-[300px] text-center">
    <div className="text-gray-500">
      <div className="text-6xl mb-4">📱</div>
      <h3 className="text-lg font-medium mb-2">Canvas vazio</h3>
      <p className="text-sm">Adicione componentes da barra lateral</p>
    </div>
  </div>
)

// Components Renderer
const ComponentsRenderer: React.FC<{
  components: any[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  viewMode: ViewportMode
}> = ({ components, selectedId, onSelect, viewMode }) => (
  <div className="space-y-4">
    {components.map((component) => (
      <motion.div
        key={component.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative cursor-pointer transition-all duration-200 ${
          selectedId === component.id
            ? 'ring-2 ring-amber-500 ring-offset-2'
            : 'hover:ring-1 hover:ring-gray-300'
        }`}
        onClick={() => onSelect(component.id)}
      >
        <ComponentRenderer 
          component={component}
          isSelected={selectedId === component.id}
          viewportMode={viewMode}
        />
      </motion.div>
    ))}
  </div>
)

export const Canvas: React.FC<CanvasProps> = ({
  className = '',
  quizData,
  selectedComponent,
  onComponentSelect,
  onComponentUpdate,
  onComponentRemove,
  viewMode = 'desktop'
}) => {
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)

  const isMobile = viewMode === 'mobile'
  const progress = 20
  const currentStep = quizData.steps[0] || { components: [] }
  
  const headerConfig = {
    showLogo: true,
    showBackButton: false,
    showProgress: true,
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('text/plain')
    console.log('Component dropped:', componentType)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className={`flex-1 bg-zinc-800 flex flex-col ${className}`}>
      {/* Header do Canvas */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300">Preview Mobile</span>
          <div className="flex items-center gap-1 ml-4">
            <Button 
              variant={viewMode === 'mobile' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => console.log('Switch to mobile')}
              className={viewMode === 'mobile' ? 'bg-amber-600 text-white' : 'text-zinc-400'}
            >
              <Smartphone className="w-3 h-3" />
            </Button>
            <Button 
              variant={viewMode === 'desktop' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => console.log('Switch to desktop')}
              className={viewMode === 'desktop' ? 'bg-amber-600 text-white' : 'text-zinc-400'}
            >
              <Monitor className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
            {viewMode === 'mobile' ? '400px' : '800px'}
          </Badge>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Área do Canvas */}
      <div className="flex-1 p-8 overflow-y-auto flex justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
        <div 
          className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
            viewMode === 'mobile' ? 'w-[400px] max-w-[400px]' : 'w-[800px] max-w-[800px]'
          }`}
          style={{ minHeight: '600px' }}
        >
          {/* Quiz Header - Igual CaktoQuiz */}
          <QuizHeader 
            config={headerConfig}
            currentStep={currentStepIndex + 1}
            totalSteps={quizData.steps.length}
          />
          
          {/* Canvas Content Area */}
          <div 
            className="quiz-content p-4 md:p-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!currentStep?.components || currentStep.components.length === 0 ? (
              <EmptyCanvasState />
            ) : (
              <div className="text-center py-8 text-zinc-400">
                Components renderizados aqui
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}