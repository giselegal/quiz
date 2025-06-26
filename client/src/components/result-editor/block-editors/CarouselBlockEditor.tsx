
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { Block } from '@/types/editor';
import StyleEditor from '../style-editors/StyleEditor';

interface CarouselBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const CarouselBlockEditor: React.FC<CarouselBlockEditorProps> = ({ block, onUpdate }) => {
  const { content = {} } = block;
  const carouselImages = content.carouselImages || [];

  const handleAddImage = () => {
    const newImages = [...carouselImages, { url: '', alt: '', caption: '' }];
    onUpdate({ ...content, carouselImages: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...carouselImages];
    newImages.splice(index, 1);
    onUpdate({ ...content, carouselImages: newImages });
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    const newImages = [...carouselImages];
    newImages[index] = { ...newImages[index], [field]: value };
    onUpdate({ ...content, carouselImages: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Configurações do Carrossel</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="autoPlay"
            checked={content.autoPlay || false}
            onCheckedChange={(checked) => onUpdate({ ...content, autoPlay: checked })}
          />
          <Label htmlFor="autoPlay">Reprodução automática</Label>
        </div>
        
        {content.autoPlay && (
          <div className="space-y-2">
            <Label htmlFor="interval">Intervalo (ms)</Label>
            <Input
              id="interval"
              type="number"
              value={content.interval || 5000}
              onChange={(e) => onUpdate({ ...content, interval: parseInt(e.target.value) })}
              min={1000}
              step={500}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Switch
            id="showArrows"
            checked={content.showArrows !== false}
            onCheckedChange={(checked) => onUpdate({ ...content, showArrows: checked })}
          />
          <Label htmlFor="showArrows">Mostrar setas de navegação</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="showDots"
            checked={content.showDots !== false}
            onCheckedChange={(checked) => onUpdate({ ...content, showDots: checked })}
          />
          <Label htmlFor="showDots">Mostrar indicadores</Label>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Imagens do Carrossel</Label>
        {carouselImages.map((image, index) => (
          <Card key={index} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Imagem {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveImage(index)}
                className="h-7 w-7 p-0 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`image-url-${index}`}>URL da imagem</Label>
              <div className="flex gap-2">
                <Input
                  id={`image-url-${index}`}
                  value={image.url}
                  onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`image-alt-${index}`}>Texto alternativo</Label>
              <Input
                id={`image-alt-${index}`}
                value={image.alt}
                onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                placeholder="Descrição da imagem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`image-caption-${index}`}>Legenda (opcional)</Label>
              <Input
                id={`image-caption-${index}`}
                value={image.caption || ''}
                onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                placeholder="Legenda opcional"
              />
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleAddImage} variant="outline" className="w-full">
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar Imagem
      </Button>
      
      <div className="space-y-2">
        <Label>Estilo do Carrossel</Label>
        <StyleEditor
          style={content.style || {}}
          onUpdate={(style) => onUpdate({ ...content, style })}
        />
      </div>
    </div>
  );
};

export default CarouselBlockEditor;
