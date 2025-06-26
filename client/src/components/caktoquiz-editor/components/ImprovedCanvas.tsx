import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Monitor,
  Smartphone,
  Plus
} from 'lucide-react'

interface QuizComponent {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'options' | 'input' | 'spacer' | 'divider' | 'logo'
  data: Record<string, any>
  style: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

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

interface ImprovedCanvasProps {
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

// Componente para renderizar cada tipo de elemento
const ComponentRenderer: React.FC<{
  component: QuizComponent
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}> = ({
  component,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const renderComponentContent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <h1 
            className="font-bold text-center"
            style={{
              fontSize: component.data.fontSize || '2rem',
              color: component.data.color || '#000',
              fontWeight: component.data.fontWeight || '700',
              textAlign: component.data.textAlign || 'center',
              margin: component.data.margin || '0',
              ...component.style
            }}
          >
            {component.data.text || 'Título'}
          </h1>
        )
      
      case 'text':
        return (
          <p 
            style={{
              fontSize: component.data.fontSize || '1rem',
              color: component.data.color || '#000',
              textAlign: component.data.textAlign || 'left',
              margin: component.data.margin || '0',
              ...component.style
            }}
          >
            {component.data.text || 'Texto'}
          </p>
        )
      
      case 'image':
        return (
          <div className="flex justify-center">
            <img 
              src={component.data.src || 'https://placehold.co/400x200/e2e8f0/64748b?text=Imagem'}
              alt={component.data.alt || 'Imagem'}
              className="max-w-full h-auto rounded-lg"
              style={{
                width: component.data.width || 'auto',
                height: component.data.height || 'auto',
                objectFit: component.data.objectFit || 'cover',
                ...component.style
              }}
            />
          </div>
        )
      
      case 'button':
        return (
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg"
              style={{
                backgroundColor: component.data.backgroundColor || '#d97706',
                color: component.data.color || '#fff',
                fontSize: component.data.fontSize || '1rem',
                padding: component.data.padding || '12px 32px',
                borderRadius: component.data.borderRadius || '8px',
                ...component.style
              }}
            >
              {component.data.text || 'Botão'}
            </Button>
          </div>
        )
      
      case 'input':
        return (
          <div className="w-full max-w-md mx-auto">
            {component.data.label && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.data.label}
              </label>
            )}
            <input
              type={component.data.type || 'text'}
              placeholder={component.data.placeholder || 'Digite aqui...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              style={{
                fontSize: component.data.fontSize || '1rem',
                padding: component.data.padding || '12px 16px',
                borderRadius: component.data.borderRadius || '8px',
                ...component.style
              }}
            />
          </div>
        )
      
      case 'spacer':
        return (
          <div 
            className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm"
            style={{ 
              height: component.data.height || 20,
              ...component.style
            }}
          >
            Espaçador ({component.data.height || 20}px)
          </div>
        )
      
      case 'options':
        return (
          <div className="w-full">
            <div className={`grid gap-3 ${component.data.gridCols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {(component.data.choices || []).slice(0, 4).map((choice: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-amber-500 transition-colors cursor-pointer">
                  {choice.image && (
                    <img 
                      src={choice.image} 
                      alt={choice.text}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-sm text-center">{choice.text}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'logo':
        return (
          <div className="flex justify-center">
            <img 
              src={component.data.src || 'https://placehold.co/200x80/e2e8f0/64748b?text=Logo'}
              alt={component.data.alt || 'Logo'}
              className="h-16 w-auto"
              style={{
                height: component.data.height || '64px',
                width: component.data.width || 'auto',
                ...component.style
              }}
            />
          </div>
        )
      
      default:
        return (
          <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded text-center text-gray-500">
            Componente {component.type}
          </div>
        )
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative group mb-4 ${isSelected ? 'z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Overlay de seleção */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg bg-blue-500/10 pointer-events-none z-20" />
      )}
      
      {/* Controles de hover */}
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-10 left-0 right-0 z-30 flex items-center justify-center gap-1"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex items-center overflow-hidden">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="h-8 px-2 text-blue-600 hover:bg-blue-50"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate()
                }}
                className="h-8 px-2 text-green-600 hover:bg-green-50"
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              {canMoveUp && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveUp()
                  }}
                  className="h-8 px-2 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
              )}
              
              {canMoveDown && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveDown()
                  }}
                  className="h-8 px-2 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="h-8 px-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Badge do tipo do componente */}
      {isSelected && (
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 z-30 bg-blue-600 text-white text-xs"
        >
          {component.type}
        </Badge>
      )}
      
      {/* Conteúdo do componente */}
      <div className="relative">
        {renderComponentContent()}
      </div>
    </motion.div>
  )
}

export const ImprovedCanvas: React.FC<ImprovedCanvasProps> = ({
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
  const handleComponentMove = useCallback((componentId: string, direction: 'up' | 'down') => {
    onComponentMove(componentId, direction)
  }, [onComponentMove])

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Header do Canvas */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Canvas - {step.title}</h3>
          <Badge variant="outline" className="text-xs">
            {step.components.length} componente{step.components.length !== 1 ? 's' : ''}
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
                    ← Voltar
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
                <AnimatePresence>
                  {step.components.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex items-center justify-center text-gray-500"
                    >
                      <div className="text-center">
                        <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Canvas vazio</p>
                        <p className="text-sm">Arraste componentes da biblioteca para começar</p>
                      </div>
                    </motion.div>
                  ) : (
                    step.components.map((component, index) => (
                      <ComponentRenderer
                        key={component.id}
                        component={component}
                        isSelected={selectedComponentId === component.id}
                        onSelect={() => onComponentSelect(component.id)}
                        onEdit={() => onComponentSelect(component.id)}
                        onDelete={() => onComponentDelete(component.id)}
                        onDuplicate={() => onComponentDuplicate(component.id)}
                        onMoveUp={() => handleComponentMove(component.id, 'up')}
                        onMoveDown={() => handleComponentMove(component.id, 'down')}
                        canMoveUp={index > 0}
                        canMoveDown={index < step.components.length - 1}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ImprovedCanvas