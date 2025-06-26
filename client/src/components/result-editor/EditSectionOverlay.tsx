
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface EditSectionOverlayProps {
  section: string;
  data: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const EditSectionOverlay: React.FC<EditSectionOverlayProps> = ({
  section,
  data,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<any>({});
  
  // Initialize form data with section data
  useEffect(() => {
    setFormData(data || {});
  }, [data]);
  
  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="w-full max-w-lg p-6 bg-white overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[#432818]">
            Editar {getSectionTitle(section)}
          </h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => {
              // Skip rendering certain properties
              if (key === 'id' || key === 'type' || key === 'order') {
                return null;
              }
              
              // Render different inputs based on value type
              if (typeof value === 'string') {
                return (
                  <div key={key} className="space-y-2">
                    <label htmlFor={key} className="text-sm font-medium capitalize">
                      {formatLabel(key)}
                    </label>
                    {value.length > 80 ? (
                      <Textarea
                        id={key}
                        value={value as string}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full min-h-[100px]"
                      />
                    ) : (
                      <Input
                        id={key}
                        value={value as string}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    )}
                  </div>
                );
              }
              
              // For arrays, objects, etc. - can be expanded in the future
              return null;
            })}
          </form>
        </div>
        
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            className="bg-[#B89B7A] hover:bg-[#A38A69]" 
            onClick={handleSubmit}
          >
            <Check className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Helper functions
function getSectionTitle(section: string): string {
  const sectionMap: Record<string, string> = {
    'header.content': 'Cabeçalho',
    'mainContent.content': 'Estilo Principal',
    'offer.hero.content': 'Oferta Principal',
    'offer.products.content': 'Produtos',
    'offer.benefits.content': 'Benefícios',
    'offer.pricing.content': 'Preço',
    'offer.testimonials.content': 'Depoimentos',
    'offer.guarantee.content': 'Garantia',
  };
  
  return sectionMap[section] || section;
}

function formatLabel(key: string): string {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}
