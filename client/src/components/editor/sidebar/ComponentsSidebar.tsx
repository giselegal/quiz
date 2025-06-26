import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Image, 
  ListChecks, 
  MessageSquare, 
  DollarSign, 
  Shield, 
  MousePointer,
  Layout,
  Award,
  Gift,
  LayoutTemplate,
  Quote,
  ImagePlus
} from 'lucide-react';
import { EditorBlock } from '@/types/editor';

interface ComponentsSidebarProps {
  onComponentSelect: (type: EditorBlock['type']) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ 
  onComponentSelect 
}) => {
  const components = [
    { type: 'header', label: 'Cabeçalho', icon: LayoutTemplate },
    { type: 'hero-section', label: 'Seção Hero', icon: Quote },
    { type: 'bonus-carousel', label: 'Carrossel de Bônus', icon: ImagePlus },
    { type: 'headline', label: 'Título', icon: Type },
    { type: 'image', label: 'Imagem', icon: Image },
    { type: 'text', label: 'Texto', icon: Type },
    { type: 'benefits', label: 'Benefícios', icon: ListChecks },
    { type: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
    { type: 'pricing', label: 'Preço', icon: DollarSign },
    { type: 'guarantee', label: 'Garantia', icon: Shield },
    { type: 'cta', label: 'Botão CTA', icon: MousePointer },
    { type: 'style-result', label: 'Resultado do Estilo', icon: Award },
    { type: 'secondary-styles', label: 'Estilos Secundários', icon: Layout },
    { type: 'bonus', label: 'Bônus', icon: Gift }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-playfair text-lg text-[#432818]">Componentes</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {components.map((component) => (
            <Button
              key={component.type}
              variant="ghost"
              className="w-full justify-start text-[#8F7A6A] hover:text-[#432818] hover:bg-[#FAF9F7]"
              onClick={() => onComponentSelect(component.type as EditorBlock['type'])}
            >
              <component.icon className="w-4 h-4 mr-2" />
              {component.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
