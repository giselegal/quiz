
import React from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { StyleResult } from '@/types/quiz';
import { StyleControls } from '@/components/editor/controls/StyleControls';
import HeaderBlockPreview from './block-previews/HeaderBlockPreview';
import HeadlineBlockPreview from './block-previews/HeadlineBlockPreview';
import TextBlockPreview from './block-previews/TextBlockPreview';
import ImageBlockPreview from './block-previews/ImageBlockPreview';
import BenefitsBlockPreview from './block-previews/BenefitsBlockPreview';
import PricingBlockPreview from './block-previews/PricingBlockPreview';
import GuaranteeBlockPreview from './block-previews/GuaranteeBlockPreview';
import CTABlockPreview from './block-previews/CTABlockPreview';
import StyleResultBlockPreview from './block-previews/StyleResultBlockPreview';
import SecondaryStylesBlockPreview from './block-previews/SecondaryStylesBlockPreview';
import HeroSectionBlockPreview from './block-previews/HeroSectionBlockPreview';
import ProductsBlockPreview from './block-previews/ProductsBlockPreview';
import TestimonialsBlockPreview from './block-previews/TestimonialsBlockPreview';
import SpacerBlockPreview from './block-previews/SpacerBlockPreview';
import VideoBlockPreview from './block-previews/VideoBlockPreview';
import TwoColumnBlockPreview from './block-previews/TwoColumnBlockPreview';
import IconBlockPreview from './block-previews/IconBlockPreview';
import FAQBlockPreview from './block-previews/FAQBlockPreview';
import CarouselBlockPreview from './block-previews/CarouselBlockPreview';
import CustomCodeBlockPreview from './block-previews/CustomCodeBlockPreview';
import AnimationBlockPreview from './block-previews/AnimationBlockPreview';

interface BlockRendererProps {
  block: Block;
  primaryStyle: StyleResult;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate?: (content: any) => void;
  isDragging?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  primaryStyle,
  isSelected,
  onSelect,
  onUpdate,
  isDragging = false
}) => {
  // Render different block types with their styles
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header':
        return <HeaderBlockPreview content={block.content} />;
      case 'headline':
        return <HeadlineBlockPreview content={block.content} />;
      case 'text':
        return <TextBlockPreview content={block.content} />;
      case 'image':
        return <ImageBlockPreview content={block.content} />;
      case 'benefits':
        return <BenefitsBlockPreview content={block.content} />;
      case 'pricing':
        return <PricingBlockPreview content={block.content} />;
      case 'guarantee':
        return <GuaranteeBlockPreview content={block.content} />;
      case 'cta':
        return <CTABlockPreview content={block.content} />;
      case 'style-result':
        return <StyleResultBlockPreview content={block.content} primaryStyle={primaryStyle} />;
      case 'secondary-styles':
        return <SecondaryStylesBlockPreview content={block.content} />;
      case 'hero-section':
        return <HeroSectionBlockPreview content={block.content} primaryStyle={primaryStyle} />;
      case 'products':
        return <ProductsBlockPreview content={block.content} />;
      case 'testimonials':
        return <TestimonialsBlockPreview content={block.content} />;
      case 'spacer':
        return <SpacerBlockPreview content={block.content} />;
      case 'video':
        return <VideoBlockPreview content={block.content} />;
      case 'two-column':
        return <TwoColumnBlockPreview content={block.content} />;
      case 'icon':
        return <IconBlockPreview content={block.content} />;
      case 'faq':
        return <FAQBlockPreview content={block.content} />;
      case 'carousel':
        return <CarouselBlockPreview content={block.content} />;
      case 'custom-code':
        return <CustomCodeBlockPreview content={block.content} />;
      case 'animation-block':
        return <AnimationBlockPreview content={block.content} />;
      default:
        return <p>Bloco não reconhecido: {block.type}</p>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative transition-all duration-200",
        isSelected ? "ring-2 ring-[#B89B7A] bg-[#FAF9F7]" : "border-2 border-dashed border-gray-300 hover:border-[#B89B7A]/50",
        isDragging && "opacity-50"
      )}
    >
      {renderBlockContent()}
      
      {isSelected && onUpdate && (
        <div className="mt-4 p-4 border-t">
          <StyleControls
            style={block.content.style || {}}
            onUpdate={(newStyle) => {
              onUpdate({
                ...block.content,
                style: newStyle
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
