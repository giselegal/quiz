
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { cn } from '@/lib/utils';

interface StyleResultPreviewProps {
  primaryStyle: StyleResult;
  description?: string;
  customImage?: string;
}

export const StyleResultPreview: React.FC<StyleResultPreviewProps> = ({
  primaryStyle,
  description,
  customImage
}) => {
  const getStyleImage = (styleType: string): string => {
    const defaultImage = 'https://placehold.co/600x400/png';
    
    // Mapa de imagens por estilo (você pode substituir por imagens reais)
    const styleImages = {
      'Elegante': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Contemporâneo': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Natural': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Clássico': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Romântico': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Sexy': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Dramático': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
      'Criativo': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp'
    };
    
    return customImage || styleImages[styleType] || defaultImage;
  };

  const getStyleDescription = (styleType: string): string => {
    // Descrições padrão para cada estilo
    const styleDescriptions = {
      'Elegante': 'O estilo Elegante valoriza a sofisticação e o requinte. Você prefere peças de qualidade, com bom caimento e acabamento impecável.',
      'Contemporâneo': 'O estilo Contemporâneo é moderno e atual. Você gosta de acompanhar as tendências e adaptar-se às mudanças da moda.',
      'Natural': 'O estilo Natural valoriza o conforto e a praticidade. Você prefere peças confortáveis, tecidos naturais e um visual despretensioso.',
      'Clássico': 'O estilo Clássico é atemporal e tradicional. Você prefere peças que nunca saem de moda e tem um guarda-roupa versátil e duradouro.',
      'Romântico': 'O estilo Romântico valoriza a feminilidade e a delicadeza. Você gosta de peças com detalhes românticos, como babados e rendas.',
      'Sexy': 'O estilo Sexy valoriza a sensualidade. Você gosta de destacar seus pontos fortes e não tem medo de mostrar um pouco mais da sua silhueta.',
      'Dramático': 'O estilo Dramático é ousado e impactante. Você gosta de peças que chamam a atenção e criar looks que não passam despercebidos.',
      'Criativo': 'O estilo Criativo é único e original. Você gosta de experimentar, misturar e criar seu próprio estilo sem seguir regras.'
    };
    
    return description || styleDescriptions[styleType] || 'Descrição não disponível para este estilo.';
  };

  return (
    <div className="p-4 border rounded-lg bg-[#FAF9F7]">
      <div className="text-center mb-4">
        <h3 className="text-xl font-playfair text-[#432818]">
          Seu estilo predominante é <span className="font-bold">{primaryStyle.category}</span>
        </h3>
        <div className="inline-block bg-[#B89B7A] text-white px-3 py-1 rounded-full text-sm mt-2">
          {primaryStyle.percentage}% de compatibilidade
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={getStyleImage(primaryStyle.category)}
            alt={`Estilo ${primaryStyle.category}`}
            className="w-full h-auto object-cover rounded-lg shadow-sm"
          />
        </div>
        <div>
          <p className="text-[#5A5A5A] leading-relaxed">
            {getStyleDescription(primaryStyle.category)}
          </p>
          <div className="mt-4 text-sm text-[#8F7A6A]">
            <p>
              Pontuação: <span className="font-medium">{primaryStyle.score} pontos</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
