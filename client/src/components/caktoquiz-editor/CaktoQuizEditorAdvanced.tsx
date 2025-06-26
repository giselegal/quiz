import React, { useState, useCallback, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Play, 
  Undo2, 
  Redo2, 
  Settings, 
  Plus, 
  GripVertical, 
  Type, 
  Image as ImageIcon, 
  MousePointer, 
  CheckSquare, 
  AlignLeft,
  Palette,
  Trash2,
  Copy,
  Eye,
  Smartphone,
  Monitor,
  MoreVertical
} from 'lucide-react'

// Types
interface QuizComponent {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'options' | 'input' | 'spacer'
  data: Record<string, any>
  style: Record<string, any>
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
  }
}

interface QuizData {
  id: string
  title: string
  steps: QuizStep[]
  settings: {
    primaryColor: string
    backgroundColor: string
    logoUrl: string
  }
}

// Component Library Items
const COMPONENT_LIBRARY = [
  {
    type: 'heading',
    name: 'Título',
    icon: Type,
    description: 'Texto principal da página',
    defaultData: { text: 'Título da Seção' },
    defaultStyle: { fontSize: '2rem', fontWeight: '700', textAlign: 'center', color: '#000' }
  },
  {
    type: 'text',
    name: 'Texto',
    icon: AlignLeft,
    description: 'Parágrafo de texto',
    defaultData: { text: 'Seu texto aqui...' },
    defaultStyle: { fontSize: '1rem', textAlign: 'left', color: '#666' }
  },
  {
    type: 'image',
    name: 'Imagem',
    icon: ImageIcon,
    description: 'Imagem ou foto',
    defaultData: { src: '', alt: 'Imagem' },
    defaultStyle: { width: '100%', borderRadius: '8px' }
  },
  {
    type: 'button',
    name: 'Botão',
    icon: MousePointer,
    description: 'Botão de ação',
    defaultData: { text: 'Clique aqui', action: 'next' },
    defaultStyle: { backgroundColor: '#007bff', color: '#fff', padding: '12px 24px', borderRadius: '6px' }
  },
  {
    type: 'options',
    name: 'Opções',
    icon: CheckSquare,
    description: 'Lista de escolhas',
    defaultData: { 
      options: [
        { id: '1', text: 'Opção 1', value: 'option1' },
        { id: '2', text: 'Opção 2', value: 'option2' }
      ],
      multiple: false
    },
    defaultStyle: { gap: '12px' }
  },
  {
    type: 'input',
    name: 'Campo de Texto',
    icon: Type,
    description: 'Campo para entrada de dados',
    defaultData: { placeholder: 'Digite aqui...', required: false },
    defaultStyle: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }
  }
]

// Sortable Step Item
const SortableStepItem = ({ step, isSelected, onSelect }: { 
  step: QuizStep
  isSelected: boolean
  onSelect: () => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group border-r md:border-y md:border-r-0 min-w-[10rem] -mt-[1px] flex pl-2 relative items-center cursor-pointer ${
        isSelected ? 'bg-amber-50 border-amber-200' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-2 cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>
      
      <div className="flex-1 p-3 pl-4">
        <div className="flex items-center gap-2">
          <Badge variant={step.type === 'question' ? 'default' : 'secondary'} className="text-xs">
            {step.type}
          </Badge>
          <span className="font-medium text-sm truncate">{step.title}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {step.components.length} componentes
        </div>
      </div>
    </div>
  )
}

// Sortable Component Item
const SortableComponentItem = ({ component, isSelected, onSelect }: {
  component: any
  isSelected: boolean
  onSelect: () => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.type })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = component.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-zinc-950/50 relative hover:z-30 cursor-grab active:cursor-grabbing"
      onClick={onSelect}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-sm">{component.name}</div>
              <div className="text-xs text-gray-500">{component.description}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Canvas Component Renderer
const CanvasComponentRenderer = ({ component, isSelected, onSelect }: {
  component: QuizComponent
  isSelected: boolean
  onSelect: () => void
}) => {
  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <h2 style={component.style}>
            {component.data.text || 'Título'}
          </h2>
        )
      case 'text':
        return (
          <p style={component.style}>
            {component.data.text || 'Texto'}
          </p>
        )
      case 'image':
        return (
          <img 
            src={component.data.src || '/api/placeholder/400/300'} 
            alt={component.data.alt || 'Imagem'}
            style={component.style}
          />
        )
      case 'button':
        return (
          <button style={component.style}>
            {component.data.text || 'Botão'}
          </button>
        )
      case 'options':
        return (
          <div className="space-y-2">
            {(component.data.options || []).map((option: any) => (
              <div key={option.id} className="flex items-center gap-2 p-2 border rounded">
                <input 
                  type={component.data.multiple ? 'checkbox' : 'radio'} 
                  name={component.id}
                />
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        )
      case 'input':
        return (
          <input
            type="text"
            placeholder={component.data.placeholder}
            style={component.style}
          />
        )
      default:
        return <div>Componente não reconhecido</div>
    }
  }

  return (
    <div 
      className={`relative p-2 rounded transition-all ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      {renderComponent()}
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
            <Copy className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Main Editor Component
export default function CaktoQuizEditorAdvanced() {
  const [quizData, setQuizData] = useState<QuizData>({
    id: 'quiz-1',
    title: 'Meu Quiz',
    settings: {
      primaryColor: '#deb57d',
      backgroundColor: '#ffffff',
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
    },
    steps: [
      {
        id: 'step-1',
        title: 'Introdução',
        type: 'intro',
        components: [],
        settings: {
          showHeader: true,
          showProgress: true,
          backgroundColor: '#ffffff'
        }
      }
    ]
  })

  const [activeStepId, setActiveStepId] = useState<string>('step-1')
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeStep = useMemo(() => 
    quizData.steps.find(step => step.id === activeStepId) || quizData.steps[0],
    [quizData.steps, activeStepId]
  )

  const selectedComponent = useMemo(() =>
    activeStep?.components.find(comp => comp.id === selectedComponentId) || null,
    [activeStep, selectedComponentId]
  )

  const stepIds = useMemo(() => quizData.steps.map(step => step.id), [quizData.steps])

  // Drag handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    
    // Check if dragging from component library
    const libraryItem = COMPONENT_LIBRARY.find(item => item.type === active.id)
    if (libraryItem) {
      setDraggedItem(libraryItem)
    }
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setDraggedItem(null)

    if (!over) return

    // Handle step reordering
    if (active.id !== over.id && quizData.steps.some(step => step.id === active.id)) {
      const oldIndex = quizData.steps.findIndex(step => step.id === active.id)
      const newIndex = quizData.steps.findIndex(step => step.id === over.id)
      
      setQuizData(prev => ({
        ...prev,
        steps: arrayMove(prev.steps, oldIndex, newIndex)
      }))
    }

    // Handle component drop from library
    const libraryItem = COMPONENT_LIBRARY.find(item => item.type === active.id)
    if (libraryItem && over.id === 'canvas-drop-zone') {
      const newComponent: QuizComponent = {
        id: `${libraryItem.type}-${Date.now()}`,
        type: libraryItem.type as any,
        data: libraryItem.defaultData,
        style: libraryItem.defaultStyle
      }

      setQuizData(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === activeStepId 
            ? { ...step, components: [...step.components, newComponent] }
            : step
        )
      }))
    }
  }, [quizData.steps, activeStepId])

  // Component update handler
  const updateComponent = useCallback((componentId: string, updates: Partial<QuizComponent>) => {
    setQuizData(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === activeStepId
          ? {
              ...step,
              components: step.components.map(comp =>
                comp.id === componentId ? { ...comp, ...updates } : comp
              )
            }
          : step
      )
    }))
  }, [activeStepId])

  // Add new step
  const addStep = useCallback(() => {
    const newStep: QuizStep = {
      id: `step-${Date.now()}`,
      title: `Nova Etapa ${quizData.steps.length + 1}`,
      type: 'question',
      components: [],
      settings: {
        showHeader: true,
        showProgress: true,
        backgroundColor: '#ffffff'
      }
    }

    setQuizData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }, [quizData.steps.length])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen bg-zinc-950 flex flex-col">
        {/* Header */}
        <div className="bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-zinc-100">CaktoQuiz Editor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-zinc-300">
              <Undo2 className="w-4 h-4 mr-2" />
              Desfazer
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-300">
              <Redo2 className="w-4 h-4 mr-2" />
              Refazer
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-300">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Steps Sidebar */}
          <div className="w-[250px] bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-zinc-100">Etapas</h3>
                <Button size="sm" variant="ghost" onClick={addStep}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
                {quizData.steps.map(step => (
                  <SortableStepItem
                    key={step.id}
                    step={step}
                    isSelected={step.id === activeStepId}
                    onSelect={() => setActiveStepId(step.id)}
                  />
                ))}
              </SortableContext>
            </ScrollArea>
          </div>

          {/* Components Library */}
          <div className="w-[280px] bg-zinc-900 border-r border-zinc-800">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="font-medium text-zinc-100">Componentes</h3>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                <SortableContext items={COMPONENT_LIBRARY.map(item => item.type)}>
                  {COMPONENT_LIBRARY.map(component => (
                    <SortableComponentItem
                      key={component.type}
                      component={component}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  ))}
                </SortableContext>
              </div>
            </ScrollArea>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-zinc-800 flex flex-col">
            {/* Canvas Header */}
            <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Preview {viewMode === 'mobile' ? 'Mobile' : 'Desktop'}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'desktop' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="w-3 h-3 mr-1" />
                  Desktop
                </Button>
                <Button 
                  variant={viewMode === 'mobile' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  Mobile
                </Button>
              </div>
            </div>

            {/* Canvas Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div 
                  id="canvas-drop-zone"
                  className={`mx-auto bg-white rounded-xl shadow-2xl overflow-hidden ${
                    viewMode === 'mobile' ? 'max-w-[400px]' : 'max-w-[800px]'
                  }`}
                >
                  {/* Quiz Header */}
                  {activeStep?.settings.showHeader && (
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <img 
                          src={quizData.settings.logoUrl} 
                          alt="Logo" 
                          className="h-8 w-auto"
                        />
                        {activeStep.settings.showProgress && (
                          <div className="flex items-center gap-2 text-white">
                            <span className="text-sm font-medium">1/{quizData.steps.length}</span>
                            <div className="w-20 h-2 bg-white/20 rounded-full">
                              <div className="h-full bg-white rounded-full w-1/4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Canvas Components */}
                  <div className="p-6 min-h-[400px]">
                    {activeStep?.components.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center">
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-zinc-200 rounded-lg mx-auto flex items-center justify-center">
                            <Plus className="w-8 h-8 text-zinc-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-zinc-600 mb-2">Canvas vazio</h3>
                            <p className="text-zinc-500 text-sm">Arraste componentes da biblioteca para começar</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeStep.components.map(component => (
                          <CanvasComponentRenderer
                            key={component.id}
                            component={component}
                            isSelected={component.id === selectedComponentId}
                            onSelect={() => setSelectedComponentId(component.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Properties Panel */}
          <div className="w-[380px] bg-zinc-900 border-l border-zinc-800">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="font-medium text-zinc-100">Propriedades</h3>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {selectedComponent ? (
                  <>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Conteúdo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedComponent.type === 'heading' && (
                          <div className="space-y-2">
                            <Label htmlFor="text">Texto</Label>
                            <Input
                              id="text"
                              value={selectedComponent.data.text || ''}
                              onChange={(e) => updateComponent(selectedComponent.id, {
                                data: { ...selectedComponent.data, text: e.target.value }
                              })}
                            />
                          </div>
                        )}
                        
                        {selectedComponent.type === 'text' && (
                          <div className="space-y-2">
                            <Label htmlFor="text">Texto</Label>
                            <Textarea
                              id="text"
                              value={selectedComponent.data.text || ''}
                              onChange={(e) => updateComponent(selectedComponent.id, {
                                data: { ...selectedComponent.data, text: e.target.value }
                              })}
                            />
                          </div>
                        )}
                        
                        {selectedComponent.type === 'image' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="src">URL da Imagem</Label>
                              <Input
                                id="src"
                                value={selectedComponent.data.src || ''}
                                onChange={(e) => updateComponent(selectedComponent.id, {
                                  data: { ...selectedComponent.data, src: e.target.value }
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="alt">Texto Alternativo</Label>
                              <Input
                                id="alt"
                                value={selectedComponent.data.alt || ''}
                                onChange={(e) => updateComponent(selectedComponent.id, {
                                  data: { ...selectedComponent.data, alt: e.target.value }
                                })}
                              />
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Estilo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                          <Select
                            value={selectedComponent.style.fontSize || '1rem'}
                            onValueChange={(value) => updateComponent(selectedComponent.id, {
                              style: { ...selectedComponent.style, fontSize: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.875rem">Pequeno</SelectItem>
                              <SelectItem value="1rem">Normal</SelectItem>
                              <SelectItem value="1.25rem">Médio</SelectItem>
                              <SelectItem value="1.5rem">Grande</SelectItem>
                              <SelectItem value="2rem">Extra Grande</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="textAlign">Alinhamento</Label>
                          <Select
                            value={selectedComponent.style.textAlign || 'left'}
                            onValueChange={(value) => updateComponent(selectedComponent.id, {
                              style: { ...selectedComponent.style, textAlign: value }
                            })}
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

                        <div className="space-y-2">
                          <Label htmlFor="color">Cor do Texto</Label>
                          <Input
                            id="color"
                            type="color"
                            value={selectedComponent.style.color || '#000000'}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              style: { ...selectedComponent.style, color: e.target.value }
                            })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-8 text-zinc-400 text-sm">
                    Selecione um componente para editar suas propriedades
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedItem ? (
            <Card className="opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <draggedItem.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{draggedItem.name}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}