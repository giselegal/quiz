import React, { useState } from 'react'

interface QuizComponent {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'option' | 'input' | 'options' | 'spacer' | 'divider' | 'script' | 'html'
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface Choice {
  id: string
  value: string
  text: string
  image?: string
}

interface ComponentRendererProps {
  component: QuizComponent
  isSelected: boolean
  viewportMode: 'mobile' | 'desktop'
}

// Componente de Opções Interativo
const OptionsComponent: React.FC<{
  component: QuizComponent
  isSelected: boolean
  onSelect: (id: string) => void
  viewMode: 'mobile' | 'desktop'
}> = ({ component, isSelected, onSelect, viewMode }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set<string>())

  const handleOptionClick = (optionValue: string) => {
    const newSelected = new Set(selectedOptions)
    
    if (component.props.selectionType === 'single') {
      newSelected.clear()
      newSelected.add(optionValue)
    } else {
      if (newSelected.has(optionValue)) {
        newSelected.delete(optionValue)
      } else if (newSelected.size < (component.props.maxSelections || 3)) {
        newSelected.add(optionValue)
      }
    }
    
    setSelectedOptions(newSelected)
  }

  const choices: Choice[] = component.props.choices || [
    {
      id: '1',
      value: 'option1',
      text: 'Opção 1',
      image: 'https://via.placeholder.com/200x150'
    },
    {
      id: '2',
      value: 'option2',
      text: 'Opção 2',
      image: 'https://via.placeholder.com/200x150'
    }
  ]

  return (
    <div
      role="button"
      tabIndex={0}
      aria-roledescription="sortable"
      className={`group/canvas-item canvas-item cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-amber-500' : ''
      }`}
      onClick={() => onSelect(component.id)}
    >
      <div className={`min-h-[1.25rem] relative box-border rounded-md transition-all ${
        isSelected 
          ? 'border-2 border-amber-500' 
          : 'group-hover/canvas-item:border-2 border-dashed hover:border-2 border-amber-500'
      }`}>
        <div className={`grid gap-3 ${
          component.props.gridCols === 1 ? 'grid-cols-1' :
          component.props.gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
          component.props.gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 md:grid-cols-2'
        }`}>
          {choices.map((choice: Choice) => (
            <button
              key={choice.id}
              onClick={(e) => {
                e.stopPropagation()
                handleOptionClick(choice.value)
              }}
              className={`group option-button overflow-hidden rounded-lg border transition-all duration-200 ${
                selectedOptions.has(choice.value)
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                  : 'border-zinc-200 bg-white hover:border-amber-300 hover:shadow-lg'
              }`}
            >
              {choice.image && (
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={choice.image} 
                    alt={choice.text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="p-3">
                <div 
                  className="text-sm text-gray-800 text-center leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: choice.text }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente de Botão com Estados
const ButtonComponent: React.FC<{
  component: QuizComponent
  isSelected: boolean
  onSelect: (id: string) => void
}> = ({ component, isSelected, onSelect }) => {
  const [isDisabled, setIsDisabled] = useState(component.props.disabled || false)

  return (
    <div
      className={`canvas-item cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-amber-500' : ''
      }`}
      onClick={() => onSelect(component.id)}
    >
      <div className="relative group">
        <button
          className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg active:scale-95'
          }`}
          disabled={isDisabled}
          onClick={(e) => {
            e.stopPropagation()
            if (!isDisabled) {
              console.log('Button clicked:', component.props.buttonText)
            }
          }}
        >
          {component.props.buttonText || component.props.text || 'Botão'}
        </button>
        
        {/* Indicators de Estado */}
        {isDisabled && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Desabilitado
          </div>
        )}
        
        {/* Indicador de hover no editor */}
        {isSelected && (
          <div className="absolute -bottom-2 -left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Selecionado
          </div>
        )}
      </div>
    </div>
  )
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  viewportMode
}) => {
  const { type, props } = component

  const getResponsiveStyles = () => {
    const baseStyles = {
      fontSize: props.fontSize || '1rem',
      fontWeight: props.fontWeight || 'normal',
      color: props.color || '#000000',
      textAlign: props.textAlign || 'left',
      backgroundColor: props.backgroundColor || 'transparent',
      borderRadius: props.borderRadius || '0px',
      padding: props.padding || '0px',
      border: props.border || 'none'
    }

    // Adjust font sizes for mobile
    if (viewportMode === 'mobile' && props.fontSize) {
      const fontSize = parseFloat(props.fontSize)
      if (props.fontSize.includes('rem')) {
        baseStyles.fontSize = `${fontSize * 0.9}rem`
      } else if (props.fontSize.includes('px')) {
        baseStyles.fontSize = `${fontSize * 0.9}px`
      }
    }

    return baseStyles
  }

  const styles = getResponsiveStyles()

  switch (type) {
    case 'heading':
      return (
        <h1 
          style={styles}
          className={`w-full h-full flex items-center ${isSelected ? 'outline-none' : ''}`}
        >
          {props.text || 'Título'}
        </h1>
      )

    case 'text':
      return (
        <p 
          style={styles}
          className={`w-full h-full flex items-center ${isSelected ? 'outline-none' : ''}`}
        >
          {props.text || 'Texto'}
        </p>
      )

    case 'image':
      return (
        <img
          src={props.src || 'https://via.placeholder.com/300x200'}
          alt={props.alt || 'Imagem'}
          style={{
            ...styles,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          className={`${isSelected ? 'outline-none' : ''}`}
        />
      )

    case 'button':
      return (
        <ButtonComponent
          component={component}
          isSelected={isSelected}
          onSelect={(id) => console.log('Button component selected:', id)}
        />
      )

    case 'option':
      return (
        <div
          style={styles}
          className={`w-full h-full flex items-center px-4 cursor-pointer transition-all hover:opacity-90 ${isSelected ? 'outline-none' : ''}`}
        >
          <div className="w-4 h-4 border-2 border-current rounded mr-3 flex-shrink-0"></div>
          <span>{props.text || 'Opção'}</span>
        </div>
      )

    case 'options':
      return (
        <OptionsComponent
          component={component}
          isSelected={isSelected}
          onSelect={(id) => console.log('Option component selected:', id)}
          viewMode={viewportMode}
        />
      )

    case 'spacer':
      return (
        <div
          style={{ height: props.height || '40px' }}
          className={`w-full ${isSelected ? 'bg-gray-100 border-2 border-dashed border-gray-300' : ''}`}
        >
          {isSelected && (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Espaçador ({props.height || '40px'})
            </div>
          )}
        </div>
      )

    case 'divider':
      return (
        <div
          style={{
            backgroundColor: props.backgroundColor || '#374151',
            height: props.height || '1px'
          }}
          className={`w-full ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
        />
      )

    case 'script':
      return (
        <div
          className={`w-full h-full p-4 bg-gray-100 border border-gray-300 rounded ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
        >
          <div className="text-sm text-gray-600 font-mono">
            {'<script>'}<br />
            {props.code || '// JavaScript personalizado'}<br />
            {'</script>'}
          </div>
        </div>
      )

    case 'html':
      return (
        <div
          className={`w-full h-full p-4 bg-gray-100 border border-gray-300 rounded ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
        >
          <div className="text-sm text-gray-600 font-mono">
            {props.content || '<div>HTML personalizado</div>'}
          </div>
        </div>
      )

    case 'input':
      return (
        <input
          type="text"
          placeholder={props.placeholder || 'Digite aqui...'}
          style={styles}
          className={`w-full h-full px-3 border ${isSelected ? 'outline-none' : ''}`}
        />
      )

    default:
      return (
        <div
          style={styles}
          className={`w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 ${isSelected ? 'outline-none' : ''}`}
        >
          Componente desconhecido: {type}
        </div>
      )
  }
}