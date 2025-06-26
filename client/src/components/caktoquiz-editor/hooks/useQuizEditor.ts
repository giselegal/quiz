import { useState, useCallback, useRef } from 'react'

interface QuizComponent {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'option' | 'input' | 'options' | 'spacer' | 'divider' | 'script' | 'html'
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface QuizStep {
  id: string
  name: string
  type: 'intro' | 'question' | 'result' | 'transition'
  components: QuizComponent[]
  settings: Record<string, any>
  progress: number
}

interface QuizData {
  id: string
  name: string
  steps: QuizStep[]
  settings: {
    theme: string
    colors: Record<string, string>
    fonts: Record<string, string>
  }
}

interface HistoryEntry {
  quizData: QuizData
  timestamp: number
}

export const useQuizEditor = () => {
  const [quizData, setQuizData] = useState<QuizData>({
    id: 'quiz-1',
    name: 'Meu Quiz',
    steps: [
      {
        id: 'intro',
        name: 'Introdução',
        type: 'intro',
        progress: 85,
        components: [
          {
            id: 'intro-title',
            type: 'heading',
            props: {
              text: 'Bem-vindo ao Quiz',
              fontSize: '2rem',
              fontWeight: '700',
              textAlign: 'center',
              color: '#ffffff'
            },
            position: { x: 50, y: 100 },
            size: { width: 300, height: 60 }
          },
          {
            id: 'intro-subtitle',
            type: 'text',
            props: {
              text: 'Descubra seu estilo pessoal em poucos minutos',
              fontSize: '1.125rem',
              textAlign: 'center',
              color: '#9ca3af'
            },
            position: { x: 50, y: 180 },
            size: { width: 300, height: 40 }
          },
          {
            id: 'start-button',
            type: 'button',
            props: {
              text: 'Começar Quiz',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '12px 24px'
            },
            position: { x: 150, y: 280 },
            size: { width: 150, height: 48 }
          }
        ],
        settings: {
          backgroundColor: '#1f2937',
          backgroundImage: '',
          showProgress: false
        }
      },
      {
        id: 'question-1',
        name: 'Pergunta 1',
        type: 'question',
        progress: 45,
        components: [
          {
            id: 'q1-title',
            type: 'heading',
            props: {
              text: 'Qual seu estilo favorito?',
              fontSize: '1.5rem',
              fontWeight: '600',
              textAlign: 'center',
              color: '#ffffff'
            },
            position: { x: 50, y: 80 },
            size: { width: 300, height: 50 }
          },
          {
            id: 'q1-options',
            type: 'options',
            props: {
              gridCols: 2,
              selectionType: 'multiple',
              maxSelections: 3,
              choices: [
                {
                  id: '1a',
                  value: 'conforto',
                  text: 'Conforto, leveza e praticidade no vestir.',
                  image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp'
                },
                {
                  id: '1b',
                  value: 'classico',
                  text: 'Discrição, caimento clássico e sobriedade.',
                  image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp'
                },
                {
                  id: '1c',
                  value: 'contemporaneo',
                  text: 'Praticidade com um toque de estilo atual.',
                  image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp'
                },
                {
                  id: '1d',
                  value: 'elegante',
                  text: 'Elegância refinada, moderna e sem exageros.',
                  image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp'
                }
              ]
            },
            position: { x: 20, y: 150 },
            size: { width: 360, height: 400 }
          },
          {
            id: 'q1-button',
            type: 'button',
            props: {
              buttonText: 'Continuar',
              backgroundColor: '#8B4513',
              color: '#ffffff',
              borderRadius: '8px',
              disabled: false
            },
            position: { x: 150, y: 580 },
            size: { width: 120, height: 48 }
          }
        ],
        settings: {
          backgroundColor: '#1f2937',
          backgroundImage: '',
          showProgress: true
        }
      },
      {
        id: 'result-page',
        name: 'Resultado',
        type: 'result',
        progress: 100,
        components: [
          {
            id: 'result-title',
            type: 'heading',
            props: {
              text: 'Seu Resultado',
              fontSize: '2rem',
              fontWeight: '700',
              textAlign: 'center',
              color: '#ffffff'
            },
            position: { x: 50, y: 100 },
            size: { width: 300, height: 60 }
          }
        ],
        settings: {
          backgroundColor: '#1f2937',
          backgroundImage: '',
          showProgress: false
        }
      }
    ],
    settings: {
      theme: 'dark',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#1f2937',
        surface: '#374151',
        text: '#ffffff'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    }
  })

  const [selectedComponent, setSelectedComponent] = useState<QuizComponent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const historyRef = useRef<HistoryEntry[]>([{
    quizData,
    timestamp: Date.now()
  }])
  const historyIndexRef = useRef(0)

  const addToHistory = useCallback((newQuizData: QuizData) => {
    const history = historyRef.current
    const currentIndex = historyIndexRef.current
    
    // Remove future history if we're not at the end
    if (currentIndex < history.length - 1) {
      historyRef.current = history.slice(0, currentIndex + 1)
    }
    
    // Add new entry
    historyRef.current.push({
      quizData: newQuizData,
      timestamp: Date.now()
    })
    
    // Limit history size
    if (historyRef.current.length > 50) {
      historyRef.current = historyRef.current.slice(-50)
    }
    
    historyIndexRef.current = historyRef.current.length - 1
  }, [])

  const updateComponent = useCallback((componentId: string, updates: Partial<QuizComponent>) => {
    setQuizData(prev => {
      const newData = {
        ...prev,
        steps: prev.steps.map(step => ({
          ...step,
          components: step.components.map(comp =>
            comp.id === componentId ? { ...comp, ...updates } : comp
          )
        }))
      }
      addToHistory(newData)
      return newData
    })
  }, [addToHistory])

  const addComponent = useCallback((component: Omit<QuizComponent, 'id'>) => {
    const newComponent: QuizComponent = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setQuizData(prev => {
      const newData = {
        ...prev,
        steps: prev.steps.map((step, index) => 
          index === 0 ? { // Add to first step for now
            ...step,
            components: [...step.components, newComponent]
          } : step
        )
      }
      addToHistory(newData)
      return newData
    })
  }, [addToHistory])

  const removeComponent = useCallback((componentId: string) => {
    setQuizData(prev => {
      const newData = {
        ...prev,
        steps: prev.steps.map(step => ({
          ...step,
          components: step.components.filter(comp => comp.id !== componentId)
        }))
      }
      addToHistory(newData)
      return newData
    })
    
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null)
    }
  }, [selectedComponent, addToHistory])

  const undo = useCallback(() => {
    const currentIndex = historyIndexRef.current
    if (currentIndex > 0) {
      historyIndexRef.current = currentIndex - 1
      setQuizData(historyRef.current[historyIndexRef.current].quizData)
    }
  }, [])

  const redo = useCallback(() => {
    const currentIndex = historyIndexRef.current
    const history = historyRef.current
    if (currentIndex < history.length - 1) {
      historyIndexRef.current = currentIndex + 1
      setQuizData(history[historyIndexRef.current].quizData)
    }
  }, [])

  const saveQuiz = useCallback(async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Quiz saved:', quizData)
    } catch (error) {
      console.error('Error saving quiz:', error)
    } finally {
      setIsSaving(false)
    }
  }, [quizData])

  const previewQuiz = useCallback(() => {
    // Open preview in new tab/window
    window.open('/quiz-preview', '_blank')
  }, [])

  const canUndo = historyIndexRef.current > 0
  const canRedo = historyIndexRef.current < historyRef.current.length - 1

  return {
    quizData,
    selectedComponent,
    history: historyRef.current,
    isLoading,
    isSaving,
    canUndo,
    canRedo,
    updateComponent,
    addComponent,
    removeComponent,
    setSelectedComponent,
    undo,
    redo,
    saveQuiz,
    previewQuiz
  }
}