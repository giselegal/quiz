
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/result-editor/ColorPicker';
import { X, Plus, CheckCircle, CircleCheck, Check, Star, Award, BadgeCheck, Shield, Sparkles } from 'lucide-react';
import { Block } from '@/types/editor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BenefitsBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const BenefitsBlockEditor: React.FC<BenefitsBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;
  const [newItem, setNewItem] = useState('');
  
  const items = content.items || [
    'Aplicar seus estilos com autenticidade',
    'Montar looks práticos para o dia a dia, trabalho e eventos',
    'Usar cores e modelagens que valorizam quem você é',
    'Parar de errar nas compras e economizar tempo'
  ];
  
  const handleAddItem = () => {
    if (newItem.trim()) {
      onUpdate({ items: [...items, newItem.trim()] });
      setNewItem('');
    }
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate({ items: newItems });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const icons = [
    { id: 'check', component: <Check className="h-4 w-4" /> },
    { id: 'check-circle', component: <CheckCircle className="h-4 w-4" /> },
    { id: 'circle-check', component: <CircleCheck className="h-4 w-4" /> },
    { id: 'badge-check', component: <BadgeCheck className="h-4 w-4" /> },
    { id: 'star', component: <Star className="h-4 w-4" /> },
    { id: 'award', component: <Award className="h-4 w-4" /> },
    { id: 'shield', component: <Shield className="h-4 w-4" /> },
    { id: 'sparkles', component: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="O que você vai aprender:"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="useIcons">Usar Ícones</Label>
        <Switch
          id="useIcons"
          checked={content.useIcons !== false}
          onCheckedChange={(checked) => onUpdate({ useIcons: checked })}
        />
      </div>
      
      {content.useIcons !== false && (
        <>
          <div className="space-y-2">
            <Label>Ícone</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {icons.find(i => i.id === content.icon)?.component || icons[0].component}
                  <span className="ml-2">
                    {content.icon || 'check'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {icons.map((icon) => (
                    <Button
                      key={icon.id}
                      variant="ghost"
                      className="h-9 w-9 p-0"
                      onClick={() => onUpdate({ icon: icon.id })}
                    >
                      {icon.component}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Cor do Ícone</Label>
            <ColorPicker
              color={content.iconColor || '#aa6b5d'}
              onChange={(color) => onUpdate({ iconColor: color })}
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label>Itens de Benefícios</Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  onUpdate({ items: newItems });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Adicionar novo benefício"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button type="button" onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default BenefitsBlockEditor;
