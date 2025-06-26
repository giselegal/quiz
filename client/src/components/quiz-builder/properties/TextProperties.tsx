
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TextPropertiesProps {
  data: QuizComponentData['data'];
  onUpdate: (data: any) => void;
  isHeadline?: boolean;
}

const TextProperties: React.FC<TextPropertiesProps> = ({ 
  data, 
  onUpdate,
  isHeadline = false
}) => {
  if (isHeadline) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => onUpdate({ ...data, title: e.target.value })}
            placeholder="Título da Seção"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Textarea
            id="subtitle"
            value={data.subtitle || ''}
            onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
            placeholder="Subtítulo opcional"
            rows={2}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={data.text || ''}
          onChange={(e) => onUpdate({ ...data, text: e.target.value })}
          placeholder="Insira seu texto aqui..."
          rows={6}
        />
      </div>
    </div>
  );
};

export default TextProperties;
