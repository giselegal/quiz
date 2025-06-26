
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizComponentData } from '@/types/quizBuilder';

interface MultipleChoicePropertiesProps {
  data: QuizComponentData['data'];
  onUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
  componentId: string;
}

export const MultipleChoiceProperties: React.FC<MultipleChoicePropertiesProps> = ({
  data,
  onUpdate,
  componentId
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Pergunta</Label>
        <Input
          value={data.question || ''}
          onChange={(e) => onUpdate(componentId, { 
            data: { ...data, question: e.target.value } 
          })}
          placeholder="Digite a pergunta"
        />
      </div>

      <div>
        <Label>Número mínimo de seleções</Label>
        <Input
          type="number"
          value={data.minSelections || 1}
          onChange={(e) => onUpdate(componentId, { 
            data: { ...data, minSelections: Number(e.target.value) } 
          })}
        />
      </div>

      <div>
        <Label>Número máximo de seleções</Label>
        <Input
          type="number"
          value={data.maxSelections || 1}
          onChange={(e) => onUpdate(componentId, { 
            data: { ...data, maxSelections: Number(e.target.value) } 
          })}
        />
      </div>

      <div>
        <Label>Tipo de exibição</Label>
        <Select 
          value={data.displayType || 'text'}
          onValueChange={(value) => onUpdate(componentId, { 
            data: { ...data, displayType: value as 'text' | 'image' | 'both' } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Apenas texto</SelectItem>
            <SelectItem value="image">Apenas imagem</SelectItem>
            <SelectItem value="both">Texto e imagem</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
