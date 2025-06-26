
import React from 'react';
import { UnifiedVisualEditor } from '@/components/unified-editor/UnifiedVisualEditor';
import { StyleResult } from '@/types/quiz';

const UnifiedEditorPage: React.FC = () => {
  // Obter estilo primário do localStorage ou usar padrão
  const getDefaultPrimaryStyle = (): StyleResult => {
    try {
      const savedResult = localStorage.getItem('quiz_result');
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        if (parsedResult?.primaryStyle) {
          return parsedResult.primaryStyle;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar resultado do quiz:', error);
    }
    
    // Estilo padrão para desenvolvimento
    return {
      category: 'Elegante',
      score: 15,
      percentage: 50
    };
  };

  const primaryStyle = getDefaultPrimaryStyle();
  
  console.log('UnifiedEditorPage carregando com estilo:', primaryStyle);
  
  return (
    <div className="unified-editor-page h-screen w-full overflow-hidden bg-gray-50">
      <UnifiedVisualEditor 
        primaryStyle={primaryStyle} 
        initialActiveTab="result"
      />
    </div>
  );
};

export default UnifiedEditorPage;
