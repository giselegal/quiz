
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentItem } from './ComponentItem';
import { EditorBlockType } from '@/types/editor';
import { 
  Type, 
  Image, 
  Video, 
  MousePointer, 
  Minus,
  Layout,
  Star,
  Gift
} from 'lucide-react';

interface ComponentsSidebarProps {
  onAddBlock: (type: EditorBlockType) => void;
}

const componentCategories = [
  {
    title: 'Texto',
    icon: Type,
    items: [
      { type: 'headline' as EditorBlockType, label: 'Título', icon: Type },
      { type: 'text' as EditorBlockType, label: 'Texto', icon: Type },
      { type: 'spacer' as EditorBlockType, label: 'Espaçador', icon: Minus }
    ]
  },
  {
    title: 'Mídia',
    icon: Image,
    items: [
      { type: 'image' as EditorBlockType, label: 'Imagem', icon: Image },
      { type: 'video' as EditorBlockType, label: 'Vídeo', icon: Video }
    ]
  },
  {
    title: 'Interação',
    icon: MousePointer,
    items: [
      { type: 'button' as EditorBlockType, label: 'Botão', icon: MousePointer },
      { type: 'form' as EditorBlockType, label: 'Formulário', icon: Layout }
    ]
  },
  {
    title: 'Vendas',
    icon: Star,
    items: [
      { type: 'testimonials' as EditorBlockType, label: 'Depoimentos', icon: Star },
      { type: 'bonus' as EditorBlockType, label: 'Bônus', icon: Gift },
      { type: 'guarantee' as EditorBlockType, label: 'Garantia', icon: Star }
    ]
  }
];

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onAddBlock }) => {
  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-[#432818]">Componentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-4 space-y-4">
            {componentCategories.map((category) => (
              <div key={category.title} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-[#8F7A6A] uppercase tracking-wide">
                  <category.icon className="w-3 h-3" />
                  {category.title}
                </div>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <ComponentItem
                      key={item.type}
                      type={item.type}
                      label={item.label}
                      icon={item.icon}
                      onAdd={() => onAddBlock(item.type)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
