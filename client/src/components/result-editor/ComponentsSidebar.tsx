
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  AlignLeft, 
  Image, 
  List, 
  Star, 
  DollarSign, 
  Shield, 
  MousePointer,
  User,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { ResultPageBlockType } from '@/types/resultPageBlocks';

interface ComponentsSidebarProps {
  onAddBlock: (type: ResultPageBlockType) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onAddBlock
}) => {
  const components = [
    {
      type: 'result-header' as ResultPageBlockType,
      name: 'Cabeçalho Resultado',
      icon: User,
      description: 'Seção com nome do usuário e estilo predominante'
    },
    {
      type: 'transition' as ResultPageBlockType,
      name: 'Seção Transição',
      icon: ArrowRight,
      description: 'Seção de transição motivacional'
    },
    {
      type: 'final-cta' as ResultPageBlockType,
      name: 'CTA Final',
      icon: ShoppingCart,
      description: 'Call-to-action final com produtos e ofertas'
    },
    {
      type: 'header' as ResultPageBlockType,
      name: 'Cabeçalho',
      icon: Type,
      description: 'Título e navegação da página'
    },
    {
      type: 'headline' as ResultPageBlockType,
      name: 'Título',
      icon: Type,
      description: 'Título principal e subtítulo'
    },
    {
      type: 'text' as ResultPageBlockType,
      name: 'Texto',
      icon: AlignLeft,
      description: 'Parágrafo de texto simples'
    },
    {
      type: 'benefits' as ResultPageBlockType,
      name: 'Benefícios',
      icon: List,
      description: 'Lista de benefícios ou recursos'
    },
    {
      type: 'testimonials' as ResultPageBlockType,
      name: 'Depoimentos',
      icon: Star,
      description: 'Seção de depoimentos e avaliações'
    },
    {
      type: 'guarantee' as ResultPageBlockType,
      name: 'Garantia',
      icon: Shield,
      description: 'Seção de garantia e segurança'
    },
    {
      type: 'cta' as ResultPageBlockType,
      name: 'Call to Action',
      icon: MousePointer,
      description: 'Botão de ação principal'
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-[#B89B7A]/20 flex flex-col">
      <div className="p-4 border-b border-[#B89B7A]/20">
        <h2 className="font-semibold text-[#432818]">Componentes</h2>
        <p className="text-sm text-[#8F7A6A]">Arraste para adicionar ao canvas</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {components.map((component) => {
            const IconComponent = component.icon;
            return (
              <Card 
                key={component.type}
                className="p-3 hover:bg-[#FAF9F7] cursor-pointer transition-colors border-[#B89B7A]/20"
                onClick={() => onAddBlock(component.type)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#B89B7A]/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-[#B89B7A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#432818] text-sm mb-1">
                      {component.name}
                    </h3>
                    <p className="text-xs text-[#8F7A6A] leading-relaxed">
                      {component.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
