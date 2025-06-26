
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FinalCtaBlockContent } from '@/types/resultPageBlocks';

interface FinalCtaBlockProps {
  content: FinalCtaBlockContent;
  onClick: () => void;
}

export const FinalCtaBlock: React.FC<FinalCtaBlockProps> = ({
  content,
  onClick
}) => {
  const products = content.products || [];
  const hasProducts = products.length > 0;

  return (
    <div
      className="border-2 border-dashed border-transparent hover:border-[#B89B7A] rounded-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-gradient-to-br from-[#432818] to-[#8F7A6A] text-white p-8 rounded-2xl">
        {content.timer?.enabled && (
          <div className="text-center mb-8">
            <Badge className="bg-red-500 text-white px-4 py-2 text-lg animate-pulse">
              ⏰ {content.timer.message || 'Oferta por tempo limitado!'}
            </Badge>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-4">
            Transforme Seu Estilo Agora
          </h2>
          {content.discount && (
            <p className="text-xl text-[#B89B7A]">
              {content.discount.message || `${content.discount.percentage}% OFF - Oferta Especial!`}
            </p>
          )}
        </div>

        {hasProducts && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {products.map((product, index) => (
              <Card key={product.id} className="p-6 bg-white text-[#432818]">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-[#8F7A6A] mb-4">{product.description}</p>
                <div className="text-center">
                  <div className="text-sm line-through text-gray-500">
                    R$ {product.originalPrice.toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold text-[#B89B7A]">
                    R$ {product.salePrice.toFixed(2)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            size="lg"
            className="text-xl px-12 py-6 font-bold text-white transform hover:scale-105 transition-all"
            style={{ backgroundColor: content.buttonColor || '#22c55e' }}
          >
            {content.buttonText || 'QUERO TRANSFORMAR MEU ESTILO AGORA'}
          </Button>
          
          <p className="text-sm mt-4 text-white/80">
            🔒 Pagamento 100% seguro via Hotmart
          </p>
        </div>
      </div>
    </div>
  );
};
