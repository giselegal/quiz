
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { HeaderBlock } from './blocks/HeaderBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { BonusCarouselBlock } from './blocks/BonusCarouselBlock';
import { HeadlineBlock } from './blocks/HeadlineBlock';
import { TextBlock } from './blocks/TextBlock';
import { BenefitsBlock } from './blocks/BenefitsBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';
import { PricingBlock } from './blocks/PricingBlock';
import { GuaranteeBlock } from './blocks/GuaranteeBlock';
import { CTABlock } from './blocks/CTABlock';
import { ResultHeaderBlock } from './blocks/ResultHeaderBlock';
import { TransitionBlock } from './blocks/TransitionBlock';
import { FinalCtaBlock } from './blocks/FinalCtaBlock';
import { ResultHeaderBlockContent, TransitionBlockContent, FinalCtaBlockContent } from '@/types/resultPageBlocks';

interface BlockRendererProps {
  block: EditorBlock;
  onSelect: () => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onSelect }) => {
  switch (block.type) {
    case 'header':
      return <HeaderBlock content={block.content} onClick={onSelect} />;
    case 'result-header':
      return <ResultHeaderBlock content={block.content as ResultHeaderBlockContent} onClick={onSelect} />;
    case 'hero-section':
      return <HeroBlock content={block.content} onClick={onSelect} />;
    case 'bonus-carousel':
      return <BonusCarouselBlock content={block.content} onClick={onSelect} />;
    case 'headline':
      return <HeadlineBlock content={block.content} onClick={onSelect} />;
    case 'text':
      return <TextBlock content={block.content} onClick={onSelect} />;
    case 'benefits':
      return <BenefitsBlock content={block.content} onClick={onSelect} />;
    case 'testimonials':
      return <TestimonialsBlock content={block.content} onClick={onSelect} />;
    case 'pricing':
      return <PricingBlock content={block.content} onClick={onSelect} />;
    case 'guarantee':
      return <GuaranteeBlock content={block.content} onClick={onSelect} />;
    case 'transition':
      return <TransitionBlock content={block.content as TransitionBlockContent} onClick={onSelect} />;
    case 'final-cta':
      return <FinalCtaBlock content={block.content as FinalCtaBlockContent} onClick={onSelect} />;
    case 'cta':
      return <CTABlock content={block.content} onClick={onSelect} />;
    case 'products':
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <h3 className="font-medium text-[#432818]">Produtos</h3>
          <p className="text-sm text-[#8F7A6A]">Clique para editar esta seção de produtos</p>
        </div>
      );
    case 'style-result':
    case 'secondary-styles':
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <h3 className="font-medium text-[#432818]">{block.type === 'style-result' ? 'Estilo Principal' : 'Estilos Secundários'}</h3>
          <p className="text-sm text-[#8F7A6A]">Clique para editar esta seção</p>
        </div>
      );
    default:
      return (
        <div 
          className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
          onClick={onSelect}
        >
          <p className="text-[#8F7A6A]">Bloco do tipo: {block.type}</p>
        </div>
      );
  }
};
