
import React from 'react';
import { UnifiedEditorLayout } from '@/components/editor/UnifiedEditorLayout';
import { StyleResult } from '@/types/quiz';

const ResultVisualEditorPage: React.FC = () => {
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
    
    // Estilo padrão se não houver resultado salvo
    return {
      category: 'Elegante',
      score: 12,
      percentage: 40
    };
  };

  const primaryStyle = getDefaultPrimaryStyle();
  
  return (
    <div className="result-visual-editor-page h-screen overflow-hidden">
      <div className="h-full">
        <UnifiedEditorLayout primaryStyle={primaryStyle} />
      </div>
    </div>
  );
};

export default ResultVisualEditorPage;
