
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BlockEditorProps } from './types';
import { StyleResultPreview } from './StyleResultPreview';
import { StyleResult } from '@/types/quiz';

export const StyleResultBlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onUpdate
}) => {
  // Using a properly typed StyleResult object
  const selectedStyle: StyleResult = {
    category: "Natural",
    score: 100,
    percentage: 100
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Descrição Personalizada</Label>
          <Textarea
            id="description"
            value={block.content.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Descreva o estilo predominante..."
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="customImage">URL da Imagem Personalizada</Label>
          <Input
            id="customImage"
            value={block.content.customImage || ''}
            onChange={(e) => onUpdate({ customImage: e.target.value })}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-[#432818] mb-4">Pré-visualização</h3>
        <StyleResultPreview 
          primaryStyle={selectedStyle}
          description={block.content.description}
          customImage={block.content.customImage}
        />
      </div>
    </div>
  );
};
