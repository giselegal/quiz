
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { FinalCtaBlockContent } from '@/types/resultPageBlocks';

interface FinalCtaBlockEditorProps {
  content: FinalCtaBlockContent;
  onUpdate: (content: Partial<FinalCtaBlockContent>) => void;
}

export const FinalCtaBlockEditor: React.FC<FinalCtaBlockEditorProps> = ({
  content,
  onUpdate
}) => {
  const addProduct = () => {
    const newProduct = {
      id: `product-${Date.now()}`,
      name: 'Novo Produto',
      description: 'Descrição do produto',
      originalPrice: 175,
      salePrice: 39.90,
      image: ''
    };
    
    onUpdate({
      products: [...(content.products || []), newProduct]
    });
  };

  const updateProduct = (index: number, updates: any) => {
    const updatedProducts = [...(content.products || [])];
    updatedProducts[index] = { ...updatedProducts[index], ...updates };
    onUpdate({ products: updatedProducts });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = (content.products || []).filter((_, i) => i !== index);
    onUpdate({ products: updatedProducts });
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-[#432818]">Configurações da CTA Final</h3>
      
      <div className="space-y-4">
        {/* Produtos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Produtos</Label>
            <Button onClick={addProduct} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
          
          {(content.products || []).map((product, index) => (
            <Card key={product.id} className="p-3 mb-3 border-l-4 border-[#B89B7A]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Produto {index + 1}</Label>
                  <Button
                    onClick={() => removeProduct(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                
                <Input
                  value={product.name}
                  onChange={(e) => updateProduct(index, { name: e.target.value })}
                  placeholder="Nome do produto"
                />
                
                <Textarea
                  value={product.description}
                  onChange={(e) => updateProduct(index, { description: e.target.value })}
                  placeholder="Descrição do produto"
                  rows={2}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Preço Original (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.originalPrice}
                      onChange={(e) => updateProduct(index, { originalPrice: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Preço Promocional (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.salePrice}
                      onChange={(e) => updateProduct(index, { salePrice: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Timer */}
        <div>
          <Label>Timer de Contagem</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={content.timer?.enabled || false}
                onCheckedChange={(checked) => onUpdate({
                  timer: { ...content.timer, enabled: checked }
                })}
              />
              <Label className="text-sm">Ativar timer</Label>
            </div>
            
            {content.timer?.enabled && (
              <>
                <Input
                  type="number"
                  value={content.timer.duration || 30}
                  onChange={(e) => onUpdate({
                    timer: { ...content.timer, duration: parseInt(e.target.value) }
                  })}
                  placeholder="Duração em minutos"
                />
                <Input
                  value={content.timer.message || 'Oferta por tempo limitado!'}
                  onChange={(e) => onUpdate({
                    timer: { ...content.timer, message: e.target.value }
                  })}
                  placeholder="Mensagem do timer"
                />
              </>
            )}
          </div>
        </div>

        {/* Botão */}
        <div className="space-y-2">
          <Label>Configurações do Botão</Label>
          <Input
            value={content.buttonText || 'QUERO TRANSFORMAR MEU ESTILO AGORA'}
            onChange={(e) => onUpdate({ buttonText: e.target.value })}
            placeholder="Texto do botão"
          />
          <Input
            type="color"
            value={content.buttonColor || '#22c55e'}
            onChange={(e) => onUpdate({ buttonColor: e.target.value })}
          />
        </div>

        {/* Hotmart URL */}
        <div>
          <Label htmlFor="hotmartUrl">URL do Hotmart</Label>
          <Input
            id="hotmartUrl"
            value={content.hotmartUrl || ''}
            onChange={(e) => onUpdate({ hotmartUrl: e.target.value })}
            placeholder="https://pay.hotmart.com/..."
          />
        </div>
      </div>
    </Card>
  );
};
