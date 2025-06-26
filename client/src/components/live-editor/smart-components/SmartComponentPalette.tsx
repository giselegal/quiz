
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wand2, 
  Sparkles, 
  Zap, 
  Brain,
  Target,
  Palette,
  Image,
  Type,
  BarChart3,
  Users,
  MessageCircle,
  Gift,
  Shield,
  Crown
} from 'lucide-react';

interface SmartComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'ai-powered' | 'conversion' | 'engagement' | 'design';
  color: string;
  features: string[];
  aiEnhanced?: boolean;
  conversionBoost?: number;
}

interface SmartComponentPaletteProps {
  onComponentSelect: (componentId: string) => void;
  stageType?: string;
}

const smartComponents: SmartComponent[] = [
  {
    id: 'ai-question-generator',
    name: 'Gerador de Perguntas IA',
    description: 'Cria perguntas personalizadas baseadas no seu nicho',
    icon: Brain,
    category: 'ai-powered',
    color: 'purple',
    features: ['IA GPT-4', 'Auto-personalização', 'A/B Testing'],
    aiEnhanced: true,
    conversionBoost: 35
  },
  {
    id: 'smart-progress-bar',
    name: 'Barra de Progresso Inteligente',
    description: 'Adapta velocidade baseada no engajamento do usuário',
    icon: BarChart3,
    category: 'engagement',
    color: 'blue',
    features: ['Velocidade adaptativa', 'Micro-animações', 'Feedback visual'],
    conversionBoost: 22
  },
  {
    id: 'conversion-optimized-cta',
    name: 'CTA Otimizado por IA',
    description: 'Botões que se adaptam baseado no comportamento do usuário',
    icon: Target,
    category: 'conversion',
    color: 'green',
    features: ['Copy dinâmico', 'Cores adaptativas', 'Urgência automática'],
    aiEnhanced: true,
    conversionBoost: 45
  },
  {
    id: 'smart-image-selector',
    name: 'Seletor de Imagens Inteligente',
    description: 'Sugere imagens baseadas no contexto e audiência',
    icon: Image,
    category: 'ai-powered',
    color: 'orange',
    features: ['Análise de contexto', 'Banco de imagens IA', 'Auto-otimização'],
    aiEnhanced: true
  },
  {
    id: 'engagement-boosters',
    name: 'Boosters de Engajamento',
    description: 'Elementos gamificados que aumentam a interação',
    icon: Zap,
    category: 'engagement',
    color: 'yellow',
    features: ['Gamificação', 'Recompensas visuais', 'Feedback instantâneo'],
    conversionBoost: 28
  },
  {
    id: 'social-proof-generator',
    name: 'Gerador de Prova Social',
    description: 'Cria depoimentos e números sociais automáticos',
    icon: Users,
    category: 'conversion',
    color: 'pink',
    features: ['Depoimentos automáticos', 'Contadores dinâmicos', 'Validação social'],
    conversionBoost: 31
  },
  {
    id: 'smart-testimonials',
    name: 'Depoimentos Inteligentes',
    description: 'Mostra depoimentos relevantes baseados nas respostas',
    icon: MessageCircle,
    category: 'conversion',
    color: 'indigo',
    features: ['Relevância contextual', 'Rotação automática', 'Análise de sentimento'],
    aiEnhanced: true,
    conversionBoost: 38
  },
  {
    id: 'premium-design-kit',
    name: 'Kit de Design Premium',
    description: 'Componentes visuais de alta conversão',
    icon: Crown,
    category: 'design',
    color: 'amber',
    features: ['Design profissional', 'Componentes premium', 'Customização avançada']
  }
];

const SmartComponentPalette: React.FC<SmartComponentPaletteProps> = ({
  onComponentSelect,
  stageType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'ai-powered', name: 'IA' },
    { id: 'conversion', name: 'Conversão' },
    { id: 'engagement', name: 'Engajamento' },
    { id: 'design', name: 'Design' }
  ];

  const filteredComponents = smartComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      pink: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
      amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="h-full flex flex-col bg-[#2A2F3E] border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-5 h-5 text-[#B89B7A]" />
          <h2 className="text-lg font-semibold text-white">Componentes Inteligentes</h2>
        </div>
        
        <Input
          placeholder="Buscar componentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#323749] border-gray-600 text-gray-200 placeholder-gray-400"
        />
      </div>

      {/* Categories */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mx-4 mt-4 bg-[#323749]">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-xs data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredComponents.map((component) => {
              const IconComponent = component.icon;
              return (
                <Card
                  key={component.id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md border ${getColorClasses(component.color)}`}
                  onClick={() => onComponentSelect(component.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/50">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{component.name}</h3>
                        {component.aiEnhanced && (
                          <Sparkles className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                      
                      <p className="text-xs opacity-75 mb-2 line-clamp-2">
                        {component.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {component.features.slice(0, 2).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs px-1 py-0">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {component.conversionBoost && (
                        <div className="text-xs font-medium text-green-600">
                          +{component.conversionBoost}% conversão
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>IA integrada</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>Otimizado para conversão</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartComponentPalette;
