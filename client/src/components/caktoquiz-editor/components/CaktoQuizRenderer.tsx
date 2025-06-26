import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'

interface QuestionOption {
  id: string
  letter: string
  text: string
  image: string
  points: Record<string, number>
  visible: boolean
}

interface QuizComponent {
  id: string
  type: string
  data: any
  style: any
}

interface CaktoQuizRendererProps {
  components: QuizComponent[]
  headerConfig: any
  onSelectionChange?: (selections: string[]) => void
  viewMode?: 'desktop' | 'mobile'
}

export const CaktoQuizRenderer: React.FC<CaktoQuizRendererProps> = ({
  components,
  headerConfig,
  onSelectionChange,
  viewMode = 'desktop'
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const [isValidSelection, setIsValidSelection] = useState(false)

  // Find options component and its configuration
  const optionsComponent = components.find(comp => comp.type === 'options')
  const options: QuestionOption[] = optionsComponent?.data?.options || []
  const multipleSelection = optionsComponent?.data?.multipleSelection || false
  const selectionLimit = optionsComponent?.data?.selectionLimit || 3
  const gridCols = optionsComponent?.data?.gridCols || '2'

  useEffect(() => {
    if (multipleSelection) {
      setIsValidSelection(selectedOptions.size >= 2 && selectedOptions.size <= selectionLimit)
    } else {
      setIsValidSelection(selectedOptions.size === 1)
    }
  }, [selectedOptions, multipleSelection, selectionLimit])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedOptions))
    }
  }, [selectedOptions, onSelectionChange])

  const handleOptionClick = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelections = new Set(prev)
      
      if (newSelections.has(optionId)) {
        newSelections.delete(optionId)
      } else {
        if (multipleSelection) {
          if (newSelections.size < selectionLimit) {
            newSelections.add(optionId)
          }
        } else {
          newSelections.clear()
          newSelections.add(optionId)
        }
      }
      
      return newSelections
    })
  }

  const renderComponent = (component: QuizComponent) => {
    switch (component.type) {
      case 'heading':
        return (
          <motion.h1 
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-zinc-900 mb-6"
          >
            {component.data?.text || 'Título da Questão'}
          </motion.h1>
        )

      case 'spacer':
        return (
          <div 
            key={component.id}
            className="w-full"
            style={{ height: component.data?.height || '20px' }}
          />
        )

      case 'options':
        return (
          <motion.div 
            key={component.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`grid grid-cols-${gridCols} gap-2`}
          >
            {options.filter(opt => opt.visible).map((option) => {
              const isSelected = selectedOptions.has(option.id)
              
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleOptionClick(option.id)}
                  className={`
                    whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
                    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
                    disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary 
                    hover:text-foreground px-4 hover:shadow-2xl overflow-hidden min-w-full 
                    gap-2 flex h-auto py-2 flex-col items-center justify-start border 
                    drop-shadow-md option-button
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                      : 'hover:border-primary/50'
                    }
                  `}
                >
                  {option.image && (
                    <img 
                      src={option.image} 
                      alt={option.text}
                      width="256" 
                      height="256" 
                      className="w-full rounded-t-md bg-white h-full object-cover"
                      style={{ aspectRatio: '1/1' }}
                    />
                  )}
                  <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
                    <div className="break-words w-full custom-quill quill ql-editor quill-option text-centered mt-2">
                      <p>
                        <strong>{option.letter})</strong> {option.text}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )

      case 'button':
        return (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <Button
              disabled={!isValidSelection}
              className={`
                w-full h-14 text-base font-medium
                ${!isValidSelection 
                  ? 'opacity-50 pointer-events-none' 
                  : 'hover:shadow-lg transform hover:scale-[1.02] transition-all'
                }
              `}
            >
              {component.data?.text || 'Continuar'}
            </Button>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`
      flex flex-col gap-4 md:gap-6 h-full justify-between p-3 
      ${viewMode === 'mobile' ? 'p-3' : 'md:p-5'} pb-10
    `}>
      <div className="grid gap-4 opacity-100">
        {/* Quiz Header */}
        {headerConfig?.showHeader && (
          <div className="flex flex-row w-full h-auto justify-center relative">
            {headerConfig?.showBackButton && (
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute left-0 h-10 w-10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex flex-col w-full justify-start items-center gap-4">
              {headerConfig?.showLogo && headerConfig?.logoUrl && (
                <img 
                  width="96" 
                  height="96" 
                  className="max-w-24 object-cover" 
                  alt="Logo" 
                  src={headerConfig.logoUrl}
                />
              )}
              
              {headerConfig?.showProgress && (
                <div className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ 
                      width: `${Math.max(20, (selectedOptions.size / Math.max(1, selectionLimit)) * 80)}%`,
                      transform: `translateX(-${100 - Math.max(20, (selectedOptions.size / Math.max(1, selectionLimit)) * 80)}%)`
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="main-content w-full relative mx-auto h-full">
          <div className="flex flex-row flex-wrap pb-10">
            {components.map(renderComponent)}
          </div>
        </div>
      </div>

      {/* Selection Status */}
      {multipleSelection && (
        <div className="text-center text-sm text-zinc-600">
          {selectedOptions.size === 0 && (
            <span>Selecione entre 2 e {selectionLimit} opções</span>
          )}
          {selectedOptions.size === 1 && (
            <span>Selecione mais {selectionLimit - 1} opções</span>
          )}
          {selectedOptions.size >= 2 && selectedOptions.size <= selectionLimit && (
            <span className="text-green-600">
              {selectedOptions.size} opções selecionadas ✓
            </span>
          )}
          {selectedOptions.size > selectionLimit && (
            <span className="text-red-600">
              Máximo {selectionLimit} opções permitidas
            </span>
          )}
        </div>
      )}

      {/* Auto-generated JavaScript for multiple selection */}
      {multipleSelection && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("DOMContentLoaded", function () {
                const buttons = document.querySelectorAll("button.option");
                const continuarButton = document.querySelector("button.bg-primary");
                let selectedOptions = new Set();

                function updateContinueButton() {
                  if (selectedOptions.size >= 2 && selectedOptions.size <= ${selectionLimit}) {
                    continuarButton.disabled = false;
                    continuarButton.classList.remove("opacity-50", "pointer-events-none");
                  } else {
                    continuarButton.disabled = true;
                    continuarButton.classList.add("opacity-50", "pointer-events-none");
                  }
                }

                buttons.forEach((button) => {
                  button.addEventListener("click", function () {
                    const optionText = this.innerText.trim();
                    
                    if (selectedOptions.has(optionText)) {
                      selectedOptions.delete(optionText);
                      this.classList.remove("selected");
                    } else {
                      if (selectedOptions.size < ${selectionLimit}) {
                        selectedOptions.add(optionText);
                        this.classList.add("selected");
                      }
                    }

                    console.log("Opções selecionadas:", [...selectedOptions]);
                    updateContinueButton();
                  });
                });

                continuarButton.addEventListener("click", function () {
                  if (selectedOptions.size >= 2 && selectedOptions.size <= ${selectionLimit}) {
                    console.log("Clique no botão Continuar. Dados:", [...selectedOptions]);
                  }
                });

                updateContinueButton();
              });
            `
          }}
        />
      )}
    </div>
  )
}

export default CaktoQuizRenderer