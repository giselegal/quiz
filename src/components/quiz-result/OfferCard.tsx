
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { StyleResult } from '@/types/quiz';
import BenefitList from './sales/BenefitList';
import Testimonials from './sales/Testimonials';
import Guarantee from './sales/Guarantee';
import Logo from '../ui/logo';
import { OfferContent } from '@/types/resultPageConfig';

interface OfferCardProps {
  primaryStyle: StyleResult;
  config: OfferContent;
}

const OfferCard: React.FC<OfferCardProps> = ({ primaryStyle, config }) => {
  // Defaults with fallbacks for missing config values
  const title = config?.title || "Seu estilo foi revelado. Agora é hora da transformação.";
  const subtitle = config?.subtitle || `Você descobriu seu estilo ${primaryStyle.category}. Mas o verdadeiro poder dessa descoberta está no que você faz com ela. 🌟`;
  const regularPrice = config?.regularPrice || "175,00";
  const salePrice = config?.price || "39,00";
  const ctaText = config?.ctaText || `Quero meu Guia + Bônus por R$${salePrice}`;
  const ctaUrl = config?.ctaUrl || "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
  
  // Images with fallbacks
  const heroImage = config?.heroImage || "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp";
  const productsImage = config?.allProductsImage || "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp";
  const mentorImage = config?.mentorImage || "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.webp";
  const bonusImage = config?.bonusImage || "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp";
  
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="space-y-6 bg-[#fffaf7] px-4 py-8 rounded-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#aa6b5d]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="text-center relative z-10">
        <Logo className="h-20 mx-auto mb-8" />
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-full text-[#aa6b5d] text-sm font-medium mb-2">
          EXCLUSIVO PARA VOCÊ
        </div>
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-3">
          {title}
        </h2>
        <div className="elegant-divider w-32 mx-auto"></div>
        <p className="text-[#3a3a3a]">
          {subtitle}
        </p>
      </div>

      <div className="relative z-10">
        <img
          src={heroImage}
          alt="Resultado do Quiz Visagismo"
          className="w-full rounded-lg mb-8 hover:scale-105 transition-transform duration-300 shadow-lg"
        />
      </div>

      <Card className="p-6 border-[#aa6b5d]/20 bg-white card-elegant relative z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FAF9F7]/50 to-transparent pointer-events-none"></div>
        
        <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-4">
          {config?.productTitle || "Guia de Estilo e Imagem + Bônus Exclusivos"}
        </h2>
        
        <img
          src={productsImage}
          alt="Todos os produtos e bônus mockup"
          className="w-full rounded-lg mb-6 hover:scale-105 transition-transform duration-300 shadow-md"
        />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-6 p-4 bg-[#fff7f3] rounded-lg border border-[#B89B7A]/10">
            <div className="text-center md:text-right transform rotate-[-5deg]">
              <p className="text-sm text-[#3a3a3a]/60 mb-1">Valor Total</p>
              <p className="text-lg line-through text-[#3a3a3a]/60">R$ {regularPrice}</p>
            </div>
            <div className="text-center transform rotate-[2deg]">
              <p className="text-sm text-[#aa6b5d] mb-1">Oferta especial</p>
              <p className="text-3xl font-bold gold-text">R$ {salePrice}</p>
              <div className="absolute -top-2 -right-2 bg-[#aa6b5d] text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12 shadow-md">HOJE</div>
            </div>
          </div>

          <Button 
            className="w-full btn-elegant btn-pulse text-white py-6 rounded-md text-lg transition-all duration-300"
            onClick={() => window.location.href = ctaUrl}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
              {ctaText}
            </span>
          </Button>
          
          {/* Elegant shadow beneath button */}
          <div className="h-2 bg-gradient-to-r from-transparent via-[#aa6b5d]/30 to-transparent rounded-full mx-auto w-3/4"></div>
        </div>
      </Card>

      <BenefitList items={config?.benefitItems} />
      
      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        <div className="interactive-section">
          <img
            src={bonusImage}
            alt="Mockup celular peças-chave por dentro"
            className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="interactive-section">
          <img
            src={mentorImage}
            alt="Foto Gisele Galvão"
            className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      
      <Testimonials items={config?.testimonials} />
      <Guarantee text={config?.guaranteeText} />
      
      <div className="text-center mt-8 relative z-10">
        <Button 
          className="btn-elegant btn-3d text-white py-6 rounded-md text-lg px-8"
          onClick={() => window.location.href = ctaUrl}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="flex items-center gap-2">
            <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
            {ctaText}
          </span>
        </Button>
        
        <p className="text-sm text-[#aa6b5d] mt-3">
          ⏳ Oferta exclusiva por tempo limitado
        </p>
      </div>
    </div>
  );
};

export default OfferCard;
