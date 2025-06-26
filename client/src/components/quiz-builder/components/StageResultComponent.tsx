
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tokens } from '@/config/designTokens';

interface StageResultComponentProps {
  data: {
    category?: string;
    description?: string;
    score?: number;
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
}

const StageResultComponent: React.FC<StageResultComponentProps> = ({ 
  data, 
  style, 
  isSelected 
}) => {
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // This would typically update through a parent callback
    console.log('Description changed:', e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Category changed:', e.target.value);
  }, []);

  const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value, 10) || 0;
    console.log('Score changed:', newScore);
  }, []);

  return (
    <div 
      className={`space-y-4 p-4 ${isSelected ? 'ring-2 ring-blue-500 rounded' : ''}`}
      style={{
        backgroundColor: style?.backgroundColor || 'transparent',
        color: style?.textColor || 'inherit'
      }}
    >
      <h3 
        className="text-lg font-semibold"
        style={{ color: tokens.colors.text }}
      >
        Configurações do Resultado
      </h3>
      
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Input
          type="text"
          id="category"
          value={data.category || ''}
          onChange={handleCategoryChange}
          placeholder="Ex: Elegante"
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          type="text"
          id="description"
          value={data.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Ex: Você tem um estilo elegante..."
        />
      </div>

      <div>
        <Label htmlFor="score">Pontuação</Label>
        <Input
          type="number"
          id="score"
          value={data.score || 0}
          onChange={handleScoreChange}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default StageResultComponent;
