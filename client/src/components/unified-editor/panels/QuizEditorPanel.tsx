
import React from 'react';

interface QuizEditorPanelProps {
  isVisible: boolean;
  isPreviewing: boolean;
}

const QuizEditorPanel: React.FC<QuizEditorPanelProps> = ({ 
  isVisible, 
  isPreviewing 
}) => {
  if (!isVisible) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">Editor de Quiz</h2>
        <p className="text-sm text-gray-600">Crie e edite seu quiz interativo</p>
      </div>
      
      <div className="flex-1 p-6">
        {isPreviewing ? (
          <div className="h-full bg-gray-50 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Preview do Quiz</h1>
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Pergunta de Exemplo</h2>
              <p className="text-gray-600 mb-4">Esta é uma visualização do seu quiz.</p>
              <div className="space-y-2">
                <button className="w-full p-3 text-left border rounded hover:bg-gray-50">
                  Opção A
                </button>
                <button className="w-full p-3 text-left border rounded hover:bg-gray-50">
                  Opção B
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <h3 className="text-lg font-medium mb-4">Configurações do Quiz</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Perguntas</h4>
                <p className="text-sm text-gray-600">Configure as perguntas do seu quiz</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Estilo Visual</h4>
                <p className="text-sm text-gray-600">Personalize a aparência</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEditorPanel;
