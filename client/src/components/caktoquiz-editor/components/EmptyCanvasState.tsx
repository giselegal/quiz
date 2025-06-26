import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Type, CheckSquare, MousePointer, Image } from 'lucide-react'

interface EmptyCanvasStateProps {
  onAddComponent: (componentData: { type: string }) => void
}

export const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({ onAddComponent }) => {
  return (
    <div className="text-center py-12 px-6 h-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
        <Plus className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-100 mb-2">Adicione seu primeiro componente</h3>
      <p className="text-zinc-400 mb-6 max-w-sm">Arraste componentes da barra lateral ou clique nos botões abaixo para começar</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent({ type: 'heading' })}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
        >
          <Type className="w-4 h-4 mr-2" />
          Título
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent({ type: 'options' })}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Opções
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent({ type: 'button' })}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
        >
          <MousePointer className="w-4 h-4 mr-2" />
          Botão
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent({ type: 'image' })}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
        >
          <Image className="w-4 h-4 mr-2" />
          Imagem
        </Button>
      </div>
    </div>
  )
}