
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultEditorPanelProps {
  isPreviewing: boolean;
  primaryStyle: StyleResult;
}

const ResultEditorPanel: React.FC<ResultEditorPanelProps> = ({ 
  isPreviewing, 
  primaryStyle 
}) => {
  console.log('ResultEditorPanel carregando:', { isPreviewing, primaryStyle });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">Editor de Página de Resultado</h2>
        <p className="text-sm text-gray-600">Estilo: {primaryStyle.category}</p>
      </div>
      
      <div className="flex-1 p-6">
        {isPreviewing ? (
          <div className="h-full bg-gray-50 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Preview da Página de Resultado</h1>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Seu Estilo: {primaryStyle.category}</h2>
              <p className="text-gray-600 mb-4">
                Baseado nas suas respostas, identificamos que seu estilo é {primaryStyle.category.toLowerCase()}.
              </p>
              <p className="text-sm text-gray-500">
                Score: {primaryStyle.score} | Percentual: {primaryStyle.percentage}%
              </p>
            </Card>
          </div>
        ) : (
          <div className="h-full">
            <h3 className="text-lg font-medium mb-4">Configurações do Editor</h3>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Cabeçalho</h4>
                <Button variant="outline" size="sm">Editar</Button>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">Conteúdo Principal</h4>
                <Button variant="outline" size="sm">Editar</Button>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">Seção de Oferta</h4>
                <Button variant="outline" size="sm">Editar</Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultEditorPanel;
