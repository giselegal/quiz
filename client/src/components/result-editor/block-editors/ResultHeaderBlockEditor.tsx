
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ResultHeaderBlockContent } from '@/types/resultPageBlocks';

interface ResultHeaderBlockEditorProps {
  content: ResultHeaderBlockContent;
  onUpdate: (content: Partial<ResultHeaderBlockContent>) => void;
}

export const ResultHeaderBlockEditor: React.FC<ResultHeaderBlockEditorProps> = ({
  content,
  onUpdate
}) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-[#432818]">Configurações do Cabeçalho de Resultado</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="userName">Nome do Usuário</Label>
          <Input
            id="userName"
            value={content.userName || ''}
            onChange={(e) => onUpdate({ userName: e.target.value })}
            placeholder="Nome personalizado (opcional)"
          />
        </div>

        <div>
          <Label htmlFor="styleCategory">Estilo Principal</Label>
          <Input
            id="styleCategory"
            value={content.primaryStyle?.category || ''}
            onChange={(e) => onUpdate({ 
              primaryStyle: { 
                ...content.primaryStyle, 
                category: e.target.value 
              }
            })}
            placeholder="Natural, Clássico, etc."
          />
        </div>

        <div>
          <Label htmlFor="stylePercentage">Porcentagem do Estilo (%)</Label>
          <Input
            id="stylePercentage"
            type="number"
            min="0"
            max="100"
            value={content.primaryStyle?.percentage || 85}
            onChange={(e) => onUpdate({ 
              primaryStyle: { 
                ...content.primaryStyle, 
                percentage: parseInt(e.target.value) 
              }
            })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showPersonalization"
            checked={content.showPersonalization}
            onCheckedChange={(checked) => onUpdate({ showPersonalization: checked })}
          />
          <Label htmlFor="showPersonalization">Mostrar personalização</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showSecondaryStyles"
            checked={content.showSecondaryStyles}
            onCheckedChange={(checked) => onUpdate({ showSecondaryStyles: checked })}
          />
          <Label htmlFor="showSecondaryStyles">Mostrar estilos secundários</Label>
        </div>
      </div>
    </Card>
  );
};
