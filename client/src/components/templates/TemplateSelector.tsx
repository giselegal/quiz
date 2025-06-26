
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StyleResult } from '@/types/quiz';

interface TemplateSelectorProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  primaryStyle,
  secondaryStyles
}) => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'sales-page',
      title: 'Página de Vendas Completa',
      description: 'Template completo com todas as seções necessárias para uma página de vendas de alta conversão.',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp',
      path: '/templates/sales-page'
    },
    {
      id: 'minimal-result',
      title: 'Resultado Minimalista',
      description: 'Design clean e minimalista focado apenas no resultado do quiz.',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp',
      path: '/templates/minimal'
    },
    {
      id: 'cta-focused',
      title: 'Foco em Conversão',
      description: 'Página otimizada para maximizar taxas de conversão com múltiplos CTAs.',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp',
      path: '/templates/cta-focused'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair text-[#432818] mb-8 text-center">
        Selecione um Modelo de Página
      </h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden border border-[#B89B7A]/20">
            <div className="aspect-video overflow-hidden bg-[#FAF9F7]">
              <img 
                src={template.image} 
                alt={template.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-playfair text-[#432818] mb-2">{template.title}</h3>
              <p className="text-[#8F7A6A] mb-4">{template.description}</p>
              <Button 
                onClick={() => navigate(template.path, { 
                  state: { primaryStyle, secondaryStyles } 
                })}
                className="w-full bg-[#B89B7A] hover:bg-[#A38A69]"
              >
                Usar este modelo
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
