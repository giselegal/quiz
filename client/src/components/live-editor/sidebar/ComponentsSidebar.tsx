
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Image, 
  MousePointer, 
  Layout,
  Star,
  Gift,
  MessageCircle,
  Timer,
  DollarSign,
  ShoppingCart,
  Award,
  Users,
  Grid3X3,
  Heart,
  Shield,
  Target,
  Palette
} from 'lucide-react';
import { EditorStage } from '@/hooks/useLiveEditor';

interface ComponentsSidebarProps {
  onAddComponent: (type: string) => void;
  stageType?: EditorStage['type'];
}

const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onAddComponent,
  stageType
}) => {
  const getComponentsForStage = (type?: EditorStage['type']) => {
    const baseComponents = [
      { id: 'heading', name: 'Título', icon: Type, color: 'blue' },
      { id: 'text', name: 'Texto', icon: Type, color: 'gray' },
      { id: 'image', name: 'Imagem', icon: Image, color: 'green' },
      { id: 'button', name: 'Botão', icon: MousePointer, color: 'purple' },
      { id: 'spacer', name: 'Espaçador', icon: Layout, color: 'gray' }
    ];

    const stageSpecific = {
      intro: [
        { id: 'hero', name: 'Hero Section', icon: Star, color: 'yellow' },
        { id: 'benefits', name: 'Benefícios', icon: Gift, color: 'green' }
      ],
      question: [
        { id: 'question-title', name: 'Título da Questão', icon: Type, color: 'purple' },
        { id: 'options-grid', name: 'Grade de Opções', icon: Grid3X3, color: 'blue' },
        { id: 'progress-bar', name: 'Barra de Progresso', icon: Timer, color: 'orange' }
      ],
      result: [
        { id: 'result-header', name: 'Cabeçalho do Resultado', icon: Award, color: 'yellow' },
        { id: 'style-card', name: 'Card dos Estilos', icon: Palette, color: 'green' },
        { id: 'testimonials', name: 'Depoimentos', icon: MessageCircle, color: 'blue' },
        { id: 'transformation', name: 'Transformação', icon: Star, color: 'yellow' }
      ],
      offer: [
        { id: 'pricing', name: 'Preços', icon: DollarSign, color: 'green' },
        { id: 'product-grid', name: 'Grade de Produtos', icon: ShoppingCart, color: 'blue' },
        { id: 'guarantee', name: 'Garantia', icon: Shield, color: 'yellow' },
        { id: 'social-proof', name: 'Prova Social', icon: Users, color: 'purple' },
        { id: 'countdown', name: 'Contador', icon: Timer, color: 'red' },
        { id: 'testimonials', name: 'Depoimentos', icon: Heart, color: 'pink' }
      ]
    };

    return [
      ...baseComponents,
      ...(stageSpecific[type as keyof typeof stageSpecific] || [])
    ];
  };

  const components = getComponentsForStage(stageType);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      red: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      gray: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
      orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      pink: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="h-full flex flex-col bg-[#2A2F3E] border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Componentes</h2>
        {stageType && (
          <Badge variant="secondary" className="text-xs">
            {stageType === 'intro' && 'Introdução'}
            {stageType === 'question' && 'Questão'}
            {stageType === 'result' && 'Resultado'}
            {stageType === 'offer' && 'Oferta'}
          </Badge>
        )}
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2">
          {components.map((component) => {
            const IconComponent = component.icon;
            return (
              <Card
                key={component.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md border ${getColorClasses(component.color)}`}
                onClick={() => onAddComponent(component.id)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium text-sm">{component.name}</h3>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <p>💡 Clique para adicionar</p>
          <p>🎨 Componentes pré-configurados</p>
          <p>📱 Preview responsivo</p>
        </div>
      </div>
    </div>
  );
};

export default ComponentsSidebar;
