
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Block } from '@/types/editor';

interface ProductsBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const ProductsBlockEditor: React.FC<ProductsBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  
  const images = content.images || [
    {
      url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp',
      alt: 'Guia de Estilo - 3 Revistas'
    },
    {
      url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp',
      alt: 'Todos os produtos e bônus'
    }
  ];
  
  const handleAddImage = () => {
    if (newImageUrl.trim() && newImageAlt.trim()) {
      onUpdate({ 
        images: [...images, { url: newImageUrl.trim(), alt: newImageAlt.trim() }] 
      });
      setNewImageUrl('');
      setNewImageAlt('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onUpdate({ images: newImages });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="O que você vai receber:"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Produtos</Label>
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="p-4 border rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Produto {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`image-url-${index}`}>URL da Imagem</Label>
                <Input
                  id={`image-url-${index}`}
                  value={image.url}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = { ...newImages[index], url: e.target.value };
                    onUpdate({ images: newImages });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`image-alt-${index}`}>Descrição</Label>
                <Input
                  id={`image-alt-${index}`}
                  value={image.alt}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = { ...newImages[index], alt: e.target.value };
                    onUpdate({ images: newImages });
                  }}
                />
              </div>
              
              {image.url && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <img 
                    src={image.url} 
                    alt={image.alt} 
                    className="h-20 object-contain mx-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border rounded-md space-y-4">
        <h4 className="font-medium">Adicionar Novo Produto</h4>
        
        <div className="space-y-2">
          <Label htmlFor="new-image-url">URL da Imagem</Label>
          <Input
            id="new-image-url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://exemplo.com/produto.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-image-alt">Descrição</Label>
          <Input
            id="new-image-alt"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            placeholder="Descrição do produto"
          />
        </div>
        
        <Button type="button" onClick={handleAddImage}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
};

export default ProductsBlockEditor;
