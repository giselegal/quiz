
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuizComponentData } from '@/types/quizBuilder';

interface HeaderPropertiesProps {
  data: QuizComponentData['data'];
  onUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
  componentId: string;
}

export const HeaderProperties: React.FC<HeaderPropertiesProps> = ({
  data,
  onUpdate,
  componentId
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Título</Label>
        <Input
          value={data.title || ''}
          onChange={(e) => onUpdate(componentId, { data: { ...data, title: e.target.value } })}
          placeholder="Título do Quiz"
        />
      </div>
      
      <div>
        <Label>Subtítulo</Label>
        <Input
          value={data.subtitle || ''}
          onChange={(e) => onUpdate(componentId, { data: { ...data, subtitle: e.target.value } })}
          placeholder="Descrição ou instruções do quiz"
        />
      </div>
    </div>
  );
};
