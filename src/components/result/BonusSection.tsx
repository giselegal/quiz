
import React from 'react';
import { Card } from '@/components/ui/card';
import { Gift, Star, Sparkles } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

const BonusSection: React.FC = () => {
  // Criar imagem otimizada de alta qualidade
  const bonus1ImageUrl = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp",
    { quality: 95, format: 'webp' }
  );

  // Criar imagem otimizada para o segundo bônus
  const bonus2ImageUrl = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp",
    { quality: 95, format: 'webp' }
  );

  return (
    <div className="py-10 px-4">
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10 px-6 py-2 rounded-full mb-4">
          <span className="text-sm font-medium text-[#aa6b5d] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Benefícios Exclusivos
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-[#aa6b5d] mb-4">
          Bônus Especiais para Você
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full mx-auto mb-4"></div>
        <p className="text-[#3a3a3a] max-w-xl mx-auto">
          Exclusivamente nesta página, você receberá estes recursos adicionais para potencializar sua transformação de imagem
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Primeiro Bônus - Card com efeito 3D */}
          <Card className="overflow-hidden rounded-2xl border-0 shadow-xl bg-white relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group">
            {/* Selo de valor */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
              Valor: R$ 79,00
            </div>
            
            {/* Imagem com efeito parallax */}
            <div className="relative overflow-hidden h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
              <picture>
                <source 
                  srcSet={`
                    ${optimizeCloudinaryUrl("https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp", { width: 400, quality: 90, format: 'webp' })} 400w,
                    ${optimizeCloudinaryUrl("https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp", { width: 600, quality: 90, format: 'webp' })} 600w
                  `}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  type="image/webp"
                />
                <img 
                  src={bonus1ImageUrl} 
                  alt="Bônus: Peças-chave do Guarda-roupa" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700" 
                  loading="lazy"
                  width="600"
                  height="350"
                />
              </picture>
              
              {/* Título sobreposto à imagem para melhor visual */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                  Peças-chave do Guarda-roupa
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center mr-3 shadow-md">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#B89B7A] text-[#B89B7A]" />
                  ))}
                </div>
                <span className="ml-2 text-xs font-medium text-[#B89B7A]">PREMIUM</span>
              </div>
              
              <p className="text-[#432818] text-base leading-relaxed">
                Descubra as peças essenciais para seu estilo que maximizam suas combinações com investimento inteligente. Aprenda a criar conjuntos versáteis que expressam sua personalidade sem precisar de um guarda-roupa imenso.
              </p>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-[#432818]/80">
                  <span className="w-1.5 h-1.5 bg-[#B89B7A] rounded-full mr-2"></span>
                  Guia personalizado por estilo
                </li>
                <li className="flex items-center text-sm text-[#432818]/80">
                  <span className="w-1.5 h-1.5 bg-[#B89B7A] rounded-full mr-2"></span>
                  Estratégia de compras inteligentes
                </li>
                <li className="flex items-center text-sm text-[#432818]/80">
                  <span className="w-1.5 h-1.5 bg-[#B89B7A] rounded-full mr-2"></span>
                  Dicas exclusivas de combinações
                </li>
              </ul>
            </div>
          </Card>
          
          {/* Segundo Bônus - Card com efeito 3D */}
          <Card className="overflow-hidden rounded-2xl border-0 shadow-xl bg-white relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group">
            {/* Selo de valor */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
              Valor: R$ 29,00
            </div>
            
            {/* Imagem com efeito parallax */}
            <div className="relative overflow-hidden h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
              <picture>
                <source 
                  srcSet={`
                    ${optimizeCloudinaryUrl("https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp", { width: 400, quality: 90, format: 'webp' })} 400w,
                    ${optimizeCloudinaryUrl("https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp", { width: 600, quality: 90, format: 'webp' })} 600w
                  `}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  type="image/webp"
                />
                <img 
                  src={bonus2ImageUrl} 
                  alt="Bônus: Visagismo Facial" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700" 
                  loading="lazy"
                  width="600"
                  height="350"
                />
              </picture>
              
              {/* Título sobreposto à imagem para melhor visual */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                  Visagismo Facial
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] flex items-center justify-center mr-3 shadow-md">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#B89B7A] text-[#B89B7A]" />
                  ))}
                </div>
                <span className="ml-2 text-xs font-medium text-[#B89B7A]">PREMIUM</span>
              </div>
              
              <p className="text-[#432818] text-base leading-relaxed">
                Aprenda a valorizar seus traços faciais com técnicas de maquiagem, cortes de cabelo e acessórios que harmonizam com seu rosto, complementando perfeitamente seu estilo de vestir.
              </p>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-[#432818]/80">
                  <span className="w-1.5 h-1.5 bg-[#B89B7A] rounded-full mr-2"></span>
                  Análise de formato facial
                </li>
                <li className="flex items-center text-sm text-[#432818]/80">
                  <span className="w-1.5 h-1.5 bg-[#B89B7A] rounded-full mr-2"></span>
                  Técnicas de maquiagem personalizadas
                </li>
                <li className="flex items-center text-sm text-[#432818]/80">
                  <span className="w-1.5 h-1.5 bg-[#B89B7A] rounded-full mr-2"></span>
                  Sugestões de cortes e acessórios ideais
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BonusSection;
