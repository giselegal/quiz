
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { giseleStyleTemplate } from '@/services/templates/giseleStyleTemplate';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import { toast } from '@/components/ui/use-toast';

interface TemplateListProps {
  onSelectTemplate?: () => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({ onSelectTemplate }) => {
  const { resultPageConfig, importConfig } = useResultPageConfig("Natural");
  
  // Use the styleType from the current config
  const styleType = resultPageConfig?.styleType || "Natural";

  const handleSelectTemplate = (template: any) => {
    try {
      if (importConfig) {
        importConfig(template);
      }
      
      toast({
        title: "Template aplicado",
        description: "O template foi aplicado com sucesso",
      });
      
      if (onSelectTemplate) {
        onSelectTemplate();
      }
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: "Erro ao aplicar template",
        description: "Ocorreu um erro ao aplicar o template",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2 text-[#432818]">Modelo de Página - Estilo Gisele Galvão</h3>
        <p className="text-[#8F7A6A] mb-4">Página de vendas otimizada com design exclusivo e elementos estratégicos.</p>
        <Button 
          onClick={() => handleSelectTemplate(giseleStyleTemplate)}
          className="w-full bg-[#B89B7A] hover:bg-[#A38A69]"
        >
          Usar este modelo
        </Button>
      </Card>
    </div>
  );
};
