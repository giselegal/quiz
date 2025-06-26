
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImagePropertiesProps {
  data: QuizComponentData['data'];
  onUpdate: (data: any) => void;
}

const ImageProperties: React.FC<ImagePropertiesProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={data.imageUrl || ''}
          onChange={(e) => onUpdate({ ...data, imageUrl: e.target.value })}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        
        <div className="mt-2">
          <Button 
            variant="outline" 
            className="w-full h-24 border-dashed flex flex-col gap-2"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs">Upload de Imagem</span>
          </Button>
        </div>
        
        {data.imageUrl && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <img 
              src={data.imageUrl} 
              alt={data.alt || 'Preview'} 
              className="max-h-32 rounded-md object-contain"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="alt">Texto Alternativo</Label>
        <Input
          id="alt"
          value={data.alt || ''}
          onChange={(e) => onUpdate({ ...data, alt: e.target.value })}
          placeholder="Descrição da imagem"
        />
        <p className="text-xs text-gray-500 mt-1">
          Forneça uma descrição da imagem para acessibilidade
        </p>
      </div>
    </div>
  );
};

export default ImageProperties;
