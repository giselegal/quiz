
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditorTab } from '../UnifiedVisualEditor';

interface UnifiedTemplateModalProps {
  activeTab: EditorTab;
  onClose: () => void;
  onApplyTemplate: (template: any) => void;
}

export const UnifiedTemplateModal: React.FC<UnifiedTemplateModalProps> = ({
  activeTab,
  onClose,
  onApplyTemplate
}) => {
  const templates = [
    {
      id: 'basic',
      name: 'Template Básico',
      description: 'Um template simples para começar'
    },
    {
      id: 'advanced',
      name: 'Template Avançado',
      description: 'Template com mais recursos'
    }
  ];

  const handleApplyTemplate = (templateId: string) => {
    // Mock template data
    const templateData = {
      id: templateId,
      type: activeTab,
      content: {}
    };
    
    onApplyTemplate(templateData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Escolher Template - {activeTab === 'quiz' ? 'Quiz' : activeTab === 'result' ? 'Resultado' : 'Vendas'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <Button
                size="sm"
                onClick={() => handleApplyTemplate(template.id)}
              >
                Aplicar Template
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
