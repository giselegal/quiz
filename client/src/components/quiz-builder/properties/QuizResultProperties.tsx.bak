
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizComponentData } from '@/types/quizBuilder';

interface QuizResultPropertiesProps {
  data: QuizComponentData['data'];
  onUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
  componentId: string;
}

export const QuizResultProperties: React.FC<QuizResultPropertiesProps> = ({
  data,
  onUpdate,
  componentId
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Título do estilo primário</Label>
        <Input
          value={data.primaryStyleTitle || ''}
          onChange={(e) => onUpdate(componentId, { 
            data: { ...data, primaryStyleTitle: e.target.value } 
          })}
          placeholder="Seu estilo predominante é"
        />
      </div>

      <div>
        <Label>Título dos estilos secundários</Label>
        <Input
          value={data.secondaryStylesTitle || ''}
          onChange={(e) => onUpdate(componentId, { 
            data: { ...data, secondaryStylesTitle: e.target.value } 
          })}
          placeholder="Seus estilos secundários"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={data.showPercentages || false}
          onCheckedChange={(checked) => onUpdate(componentId, { 
            data: { ...data, showPercentages: checked } 
          })}
        />
        <Label>Mostrar percentuais</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={data.showDescriptions || false}
          onCheckedChange={(checked) => onUpdate(componentId, { 
            data: { ...data, showDescriptions: checked } 
          })}
        />
        <Label>Mostrar descrições</Label>
      </div>

      <div>
        <Label>Layout do resultado</Label>
        <Select 
          value={data.resultLayout || 'classic'}
          onValueChange={(value) => onUpdate(componentId, { 
            data: { ...data, resultLayout: value } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Clássico</SelectItem>
            <SelectItem value="modern">Moderno</SelectItem>
            <SelectItem value="minimal">Minimalista</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
