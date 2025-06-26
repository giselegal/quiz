
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StyleResult } from '@/types/quiz';
import { StyleOptions } from '@/types/resultPageConfig';
import { Edit, Eye, EyeOff, Palette } from 'lucide-react';
import ResultHeader from '@/components/quiz-result/ResultHeader';
import PrimaryStyleCard from '@/components/quiz-result/PrimaryStyleCard';
import SecondaryStylesSection from '@/components/quiz-result/SecondaryStylesSection';
import HeroSection from '@/components/quiz-result/sales/HeroSection';
import PricingSection from '@/components/quiz-result/sales/PricingSection';

interface EditableSectionProps {
  title: string;
  sectionPath: string;
  content: any;
  style?: StyleOptions;
  visible: boolean;
  isPreview: boolean;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onStyleEdit: () => void;
  primaryStyle: StyleResult;
  secondaryStyles?: StyleResult[];
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  sectionPath,
  content,
  style,
  visible,
  isPreview,
  onEdit,
  onToggleVisibility,
  onStyleEdit,
  primaryStyle,
  secondaryStyles = []
}) => {
  if (!visible && isPreview) return null;

  // Apply section styles
  const sectionStyle = {
    fontSize: style?.fontSize,
    fontWeight: style?.fontWeight,
    color: style?.color,
    backgroundColor: style?.backgroundColor,
    padding: style?.padding,
    margin: style?.margin,
    width: style?.width || '100%',
    borderRadius: style?.borderRadius,
    textAlign: style?.textAlign as any,
    fontFamily: style?.fontFamily,
  };

  return (
    <div 
      className={`mb-8 relative ${!visible ? 'opacity-50' : ''}`}
      style={sectionStyle}
    >
      {!isPreview && (
        <div className="absolute top-0 right-0 z-10 flex space-x-1 m-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onStyleEdit}
            className="bg-white/80 hover:bg-white"
          >
            <Palette className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            className="bg-white/80 hover:bg-white"
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleVisibility}
            className="bg-white/80 hover:bg-white"
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>
      )}
      
      <Card className={`overflow-hidden ${!isPreview ? 'border border-dashed border-gray-300' : ''}`}>
        <div className={`p-4 ${!isPreview ? 'min-h-24' : ''}`}>
          {renderSectionContent(sectionPath, content, primaryStyle, secondaryStyles)}
        </div>
      </Card>
      
      {!isPreview && (
        <div className="mt-2 text-xs text-[#8F7A6A]">
          {title}
        </div>
      )}
    </div>
  );
};

// Helper function to render the appropriate content based on section type
function renderSectionContent(
  sectionPath: string, 
  content: any, 
  primaryStyle: StyleResult,
  secondaryStyles: StyleResult[]
) {
  switch(sectionPath) {
    case 'header':
      return <ResultHeader userName={content.userName || 'Visitante'} customTitle={content.title} />;
    
    case 'mainContent':
      return (
        <PrimaryStyleCard 
          primaryStyle={primaryStyle} 
          customDescription={content.description}
          customImage={content.customImage}
        />
      );
    
    case 'secondaryStyles':
      return <SecondaryStylesSection secondaryStyles={secondaryStyles} />;
    
    case 'offer.hero':
      return (
        <HeroSection 
          title={content.title}
          subtitle={content.subtitle}
          imageUrl={content.heroImage}
          ctaText={content.ctaText || 'Clique aqui'}
          onCtaClick={() => console.log('CTA clicked')}
        />
      );
    
    case 'offer.pricing':
      return (
        <PricingSection 
          price={content.price}
          regularPrice={content.regularPrice}
          ctaText={content.ctaText}
          ctaUrl={content.ctaUrl}
        />
      );
    
    default:
      // If no specific renderer, show a generic representation
      return (
        <div className="text-center py-4 text-[#8F7A6A]">
          {content.title ? (
            <h3 className="text-lg font-medium">{content.title}</h3>
          ) : (
            <p>Clique para editar esta seção</p>
          )}
        </div>
      );
  }
}

export default EditableSection;
