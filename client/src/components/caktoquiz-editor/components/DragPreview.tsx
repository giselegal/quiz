import React from 'react'
import { Type, Image, MousePointer, Layout, CheckSquare, Minus, Code, FileText } from 'lucide-react'

interface DragPreviewProps {
  componentType: string
  isDragging: boolean
}

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'heading': return Type
    case 'text': return FileText
    case 'image': return Image
    case 'button': return MousePointer
    case 'input': return Layout
    case 'options': return CheckSquare
    case 'spacer': return Layout
    case 'divider': return Minus
    case 'script': return Code
    case 'html': return Code
    default: return Layout
  }
}

const getComponentLabel = (type: string) => {
  switch (type) {
    case 'heading': return 'Título'
    case 'text': return 'Texto'
    case 'image': return 'Imagem'
    case 'button': return 'Botão'
    case 'input': return 'Campo'
    case 'options': return 'Opções'
    case 'spacer': return 'Espaçador'
    case 'divider': return 'Divisor'
    case 'script': return 'Script'
    case 'html': return 'HTML'
    default: return type
  }
}

export const DragPreview: React.FC<DragPreviewProps> = ({ componentType, isDragging }) => {
  const Icon = getComponentIcon(componentType)
  const label = getComponentLabel(componentType)

  if (!isDragging) return null

  return (
    <div className="fixed pointer-events-none z-50 bg-white rounded-lg shadow-lg p-3 border-2 border-blue-500 transform rotate-3">
      <div className="flex items-center gap-2 text-sm text-gray-900">
        <Icon className="w-4 h-4" />
        {label}
      </div>
    </div>
  )
}