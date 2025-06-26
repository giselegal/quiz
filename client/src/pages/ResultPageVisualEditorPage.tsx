
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { ResultPageBuilder } from '@/components/visual-editor/ResultPageBuilder'; // Moved to deprecated
import SimpleDragDropEditor from '@/components/visual-editor/SimpleDragDropEditor';
import { StyleResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';

const ResultPageVisualEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create a default style for the editor - will be dynamic based on user data
    const defaultStyle: StyleResult = {
      category: "Natural" as any,
      score: 100,
      percentage: 85
    };
    setPrimaryStyle(defaultStyle);
    setIsLoading(false);
  }, []);

  const handleSave = (config: any) => {
    console.log('Salvando configuração da página de resultado:', config);
  };

  const handlePreview = () => {
    window.open('/resultado', '_blank');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Carregando editor...</p>
      </div>
    );
  }

  if (!primaryStyle) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Erro ao carregar o editor</p>
          <Button onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <SimpleDragDropEditor />
    </div>
  );
};

export default ResultPageVisualEditorPage;
