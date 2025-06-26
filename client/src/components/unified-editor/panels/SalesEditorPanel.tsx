
import React from 'react';
import { StyleResult } from '@/types/quiz';

interface SalesEditorPanelProps {
  isPreviewing: boolean;
  primaryStyle: StyleResult;
}

const SalesEditorPanel: React.FC<SalesEditorPanelProps> = ({ 
  isPreviewing, 
  primaryStyle 
}) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">Editor de Página de Vendas</h2>
        <p className="text-sm text-gray-600">Estilo: {primaryStyle.category}</p>
      </div>
      
      <div className="flex-1 p-6">
        {isPreviewing ? (
          <div className="h-full bg-gray-50 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Preview da Página de Vendas</h1>
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-2xl font-semibold mb-4">Oferta Especial</h2>
              <p className="text-gray-600 mb-4">
                Uma oferta irresistível baseada no estilo {primaryStyle.category.toLowerCase()}.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Comprar Agora
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <h3 className="text-lg font-medium mb-4">Configurações da Página de Vendas</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Oferta Principal</h4>
                <p className="text-sm text-gray-600">Configure sua proposta de valor</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Depoimentos</h4>
                <p className="text-sm text-gray-600">Adicione prova social</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Call-to-Action</h4>
                <p className="text-sm text-gray-600">Botões de conversão</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesEditorPanel;
