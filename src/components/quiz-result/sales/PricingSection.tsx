import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, Lock, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PricingSectionProps {
  price?: string;
  regularPrice?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  price = "39,00",
  regularPrice = "175,00",
  ctaText = "Transformar Meu Estilo Agora",
  ctaUrl = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePurchase = () => {
    setIsLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      window.location.href = ctaUrl;
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="p-8 border-[#aa6b5d] border-2 bg-white relative overflow-hidden card-elegant">
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 shimmer pointer-events-none"></div>
      
      <div className="space-y-6">
        {/* Value Stack */}
        <div className="bg-[#fff7f3] p-4 rounded-lg border border-[#B89B7A]/10">
          <h4 className="text-[#432818] text-sm mb-3 text-center">Valor de cada componente:</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Guia Principal</span>
              <span className="font-medium">R$ 67,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Bônus 1 - Peças-chave</span>
              <span className="font-medium">R$ 79,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Bônus 2 - Visagismo Facial</span>
              <span className="font-medium">R$ 29,00</span>
            </div>
            <div className="border-t border-[#B89B7A]/20 pt-2 mt-2 flex justify-between items-center">
              <span className="font-medium">Valor Total</span>
              <span className="font-medium relative">
                R$ {regularPrice}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div>
              </span>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="transform rotate-[-5deg] relative">
            <p className="text-sm text-[#3a3a3a]/60 mb-1">De</p>
            <p className="text-2xl line-through text-[#3a3a3a]/60">R$ {regularPrice}</p>
            <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-[#ff5a5a] transform rotate-[-8deg] rounded-sm"></div>
          </div>
          <div className="text-center transform rotate-[2deg]">
            <p className="text-sm text-[#aa6b5d] mb-1">Por apenas</p>
            <div className="flex items-baseline gap-1 justify-center relative">
              <span className="text-sm">R$</span>
              <p className="text-5xl font-bold gold-text">{price.split(',')[0]}</p>
              <span className="text-lg">,{price.split(',')[1] || '00'}</span>
              <div className="absolute -top-2 -right-4 rotate-12 text-xs bg-[#aa6b5d] text-white px-2 py-0.5 rounded-full">HOJE</div>
            </div>
            <p className="text-xs text-[#3a3a3a]/60 mt-1">Pagamento único ou em 4x de R$ 10,86</p>
          </div>
        </div>
        
        {/* Payment method images */}
        <div className="mt-3 mb-4 text-center">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good,w_320/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
            alt="Métodos de pagamento"
            className="w-full max-w-xs mx-auto"
            width={320}
            height={48}
            loading="lazy"
          />
        </div>

        {/* Security Badge */}
        <SecurePurchaseElement />

        {/* CTA Button - Now GREEN for better conversion */}
        <div className="relative">
          <Button 
            className="w-full text-white py-6 rounded-md text-base transition-all duration-300 shadow-lg"
            onClick={handlePurchase}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            style={{
              background: "linear-gradient(to right, #4CAF50, #45a049)",
              boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)"
            }}
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="inline-block">
                    <LoadingSpinner size="xs" color="#FFFFFF" />
                  </div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className={`w-5 h-5 mr-2 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  {ctaText}
                </>
              )}
            </span>
          </Button>
          
          {/* Elegant shadow beneath button */}
          <div className="h-2 bg-gradient-to-r from-transparent via-[#45a049]/30 to-transparent rounded-full mt-2 mx-auto w-3/4"></div>
        </div>

        {/* Limited Time Offer */}
        <p className="text-center text-sm flex items-center justify-center gap-1 text-[#aa6b5d]">
          <Clock className="w-3 h-3" />
          <span>Oferta por tempo limitado</span>
        </p>

        {/* Payment Methods */}
        <p className="text-center text-sm text-[#3a3a3a]/70">
          Aceitamos PIX, cartão de crédito e boleto
        </p>
      </div>
    </Card>
  );
};

export default PricingSection;
