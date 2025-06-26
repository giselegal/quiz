
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { HeaderBlockEditor } from './blocks/HeaderBlockEditor';
import { HeroSectionBlockEditor } from './blocks/HeroSectionBlockEditor';
import { BonusCarouselBlockEditor } from './blocks/BonusCarouselBlockEditor';
import { HeadlineBlockEditor } from './blocks/HeadlineBlockEditor';
import { TextBlockEditor } from './blocks/TextBlockEditor';
import { ImageBlockEditor } from './blocks/ImageBlockEditor';
import { BenefitsBlockEditor } from './blocks/BenefitsBlockEditor';
import { PricingBlockEditor } from './blocks/PricingBlockEditor';
import { GuaranteeBlockEditor } from './blocks/GuaranteeBlockEditor';
import { CTABlockEditor } from './blocks/CTABlockEditor';
import { StyleResultBlockEditor } from './blocks/StyleResultBlockEditor';
import { SecondaryStylesBlockEditor } from './blocks/SecondaryStylesBlockEditor';

interface EditBlockContentProps {
  block: EditorBlock;
  onUpdate: (content: any) => void;
}

export const EditBlockContent: React.FC<EditBlockContentProps> = ({
  block,
  onUpdate
}) => {
  switch (block.type) {
    case 'header':
      return <HeaderBlockEditor block={block} onUpdate={onUpdate} />;
      
    case 'hero-section':
      return <HeroSectionBlockEditor block={block} onUpdate={onUpdate} />;
      
    case 'bonus-carousel':
      return <BonusCarouselBlockEditor block={block} onUpdate={onUpdate} />;
    
    case 'headline':
      return <HeadlineBlockEditor block={block} onUpdate={onUpdate} />;
    
    case 'text':
      return <TextBlockEditor block={block} onUpdate={onUpdate} />;
    
    case 'image':
      return <ImageBlockEditor block={block} onUpdate={onUpdate} />;
    
    case 'benefits':
      return <BenefitsBlockEditor block={block} onUpdate={onUpdate} />;
      
    case 'pricing':
      return <PricingBlockEditor block={block} onUpdate={onUpdate} />;
      
    case 'guarantee':
      return <GuaranteeBlockEditor block={block} onUpdate={onUpdate} />;
      
    case 'cta':
      return <CTABlockEditor block={block} onUpdate={onUpdate} />;

    case 'style-result':
      return <StyleResultBlockEditor block={block} onUpdate={onUpdate} />;

    case 'secondary-styles':
      return <SecondaryStylesBlockEditor block={block} onUpdate={onUpdate} />;
      
    case 'products':
      return (
        <div className="p-4 rounded-md bg-[#FAF9F7] border border-[#B89B7A]/20">
          <p className="text-sm text-[#8F7A6A]">
            Os produtos são carregados do banco de dados. Para gerenciar produtos, 
            acesse o painel administrativo.
          </p>
        </div>
      );
      
    case 'testimonials':
      return (
        <div className="p-4 rounded-md bg-[#FAF9F7] border border-[#B89B7A]/20">
          <p className="text-sm text-[#8F7A6A]">
            Os depoimentos são carregados do banco de dados. Para gerenciar depoimentos, 
            acesse o painel administrativo.
          </p>
        </div>
      );
      
    default:
      return <p>Tipo de bloco não suportado: {block.type}</p>;
  }
};
