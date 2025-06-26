import React from 'react'
import { motion } from 'framer-motion'
import { Type, AlignLeft, ImageIcon, Edit3, CheckSquare, MousePointer, Minus, Code, FileCode } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ComponentsSidebarProps {
  className?: string
  onComponentAdd: (component: any) => void
  mobile?: boolean
}

const componentCategories = {
  content: {
    name: 'Conteúdo',
    components: [
      { type: 'heading', label: 'Título', description: 'H1, H2, H3...', icon: Type },
      { type: 'text', label: 'Texto', description: 'Parágrafo', icon: AlignLeft },
      { type: 'image', label: 'Imagem', description: 'Upload ou URL', icon: ImageIcon }
    ]
  },
  forms: {
    name: 'Formulários',
    components: [
      { type: 'input', label: 'Campo Texto', description: 'Input simples', icon: Edit3 },
      { type: 'options', label: 'Opções Quiz', description: 'Grid com imagens', icon: CheckSquare },
      { type: 'button', label: 'Botão', description: 'CTA/Navegação', icon: MousePointer }
    ]
  },
  layout: {
    name: 'Layout',
    components: [
      { type: 'spacer', label: 'Espaçador', description: 'Espaço vertical', icon: Minus },
      { type: 'divider', label: 'Divisor', description: 'Linha separadora', icon: Minus }
    ]
  },
  advanced: {
    name: 'Avançado',
    components: [
      { type: 'script', label: 'JavaScript', description: 'Código customizado', icon: Code },
      { type: 'html', label: 'HTML', description: 'HTML customizado', icon: FileCode }
    ]
  }
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  className = '',
  onComponentAdd,
  mobile = false
}) => {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('text/plain', componentType)
    console.log('Drag started:', componentType)
  }

  const addComponent = (componentType: string) => {
    const defaultProps: Record<string, any> = {
      heading: { text: 'Novo Título', fontSize: '1.5rem', fontWeight: '600', color: '#ffffff' },
      text: { text: 'Novo parágrafo', fontSize: '1rem', color: '#d1d5db' },
      image: { src: 'https://via.placeholder.com/300x200', alt: 'Imagem', borderRadius: '8px' },
      input: { placeholder: 'Digite aqui...', backgroundColor: '#374151', color: '#ffffff' },
      options: { 
        text: 'Opções Quiz', 
        gridCols: 2, 
        selectionType: 'multiple', 
        maxSelections: 3,
        choices: [
          { id: '1', value: 'opt1', text: 'Opção 1', image: 'https://via.placeholder.com/200x150' },
          { id: '2', value: 'opt2', text: 'Opção 2', image: 'https://via.placeholder.com/200x150' }
        ]
      },
      button: { 
        buttonText: 'Continuar',
        text: 'Continuar', 
        backgroundColor: '#8B4513', 
        color: '#ffffff', 
        borderRadius: '8px',
        disabled: false
      },
      spacer: { height: '40px' },
      divider: { backgroundColor: '#374151', height: '1px' },
      script: { code: '// JavaScript personalizado' },
      html: { content: '<div>HTML personalizado</div>' }
    }

    onComponentAdd({
      type: componentType,
      props: defaultProps[componentType] || {},
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 }
    })
  }

  return (
    <div className={`w-[220px] bg-zinc-900 border-r border-zinc-800 ${className}`}>
      <div className="p-3 border-b border-zinc-800">
        <h3 className="text-xs font-medium text-zinc-300">Biblioteca</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(componentCategories).map(([categoryKey, category]) => (
            <div key={categoryKey} className="mb-4">
              <h4 className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                {category.name}
              </h4>
              <div className="grid gap-1.5">
                {category.components.map((component) => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.type)}
                    onClick={() => addComponent(component.type)}
                    className="flex items-center gap-2 p-2 rounded-md bg-zinc-800/50 hover:bg-zinc-700/60 cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <div className="w-6 h-6 rounded bg-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-600/60">
                      <component.icon className="w-3 h-3 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium text-zinc-200 leading-tight">{component.label}</h5>
                      <p className="text-xs text-zinc-500 leading-tight truncate">{component.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}