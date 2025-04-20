
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResultPageVisualEditor } from '@/components/result-editor/ResultPageVisualEditor';
import { TemplateList } from '@/components/editor/templates/TemplateList';
import { Button } from '@/components/ui/button';
import { defaultResultTemplate } from '@/config/resultPageTemplates';

export const EditorPage = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  const { style } = useParams<{ style?: string }>();
  
  const styleCategory = (style as "Natural" | "Clássico" | "Contemporâneo" | "Elegante" | "Romântico" | "Sexy" | "Dramático" | "Criativo") || 'Natural';
  
  const selectedStyle = {
    category: styleCategory,
    score: 100,
    percentage: 100
  };
  
  // Ensure the initialConfig follows the ResultPageConfig type structure with visible property
  const initialConfig = {
    ...defaultResultTemplate,
    styleType: styleCategory,
    header: {
      ...defaultResultTemplate.header,
      visible: true,
      style: {
        ...defaultResultTemplate.header.style,
        borderRadius: '0' // Changed from number to string
      }
    },
    mainContent: {
      ...defaultResultTemplate.mainContent,
      visible: true
    },
    offer: {
      ...defaultResultTemplate.offer,
      visible: true
    }
  };
  
  return (
    <div className="h-screen">
      {showTemplates ? (
        <div className="p-8 max-w-4xl mx-auto">
          <Button
            onClick={() => setShowTemplates(false)}
            variant="outline"
            className="mb-4"
          >
            Voltar ao Editor
          </Button>
          <TemplateList onSelectTemplate={() => setShowTemplates(false)} />
        </div>
      ) : (
        <ResultPageVisualEditor 
          selectedStyle={selectedStyle} 
          onShowTemplates={() => setShowTemplates(true)}
          initialConfig={initialConfig}
        />
      )}
    </div>
  );
};

export default EditorPage;
