
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TransitionBlockContent } from '@/types/resultPageBlocks';

interface TransitionBlockEditorProps {
  content: TransitionBlockContent;
  onUpdate: (content: Partial<TransitionBlockContent>) => void;
}

export const TransitionBlockEditor: React.FC<TransitionBlockEditorProps> = ({
  content,
  onUpdate
}) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-[#432818]">Configurações da Seção de Transição</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={content.title || 'Chegou o Momento de Agir'}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Título da seção"
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={content.description || 'Não deixe para depois a transformação que você pode começar agora!'}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Descrição motivacional"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="backgroundColor">Cor de Fundo</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={content.backgroundColor || '#f8f9fa'}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showDecorations"
            checked={content.showDecorations}
            onCheckedChange={(checked) => onUpdate({ showDecorations: checked })}
          />
          <Label htmlFor="showDecorations">Mostrar decorações</Label>
        </div>
      </div>
    </Card>
  );
};
