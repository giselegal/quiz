import React, { useState, useEffect } from 'react';

// Mock de dados da página (eventualmente viria de um backend ou config)
const initialPageData = {
  title: "Seu Resultado Personalizado está Pronto!",
  // Adicionar outros campos editáveis para ResultPage aqui
};

const ResultPageEditor: React.FC = () => {
  const [pageData, setPageData] = useState(initialPageData);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Salvando dados da ResultPage:", pageData);
    // Lógica para salvar os dados
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert("Alterações salvas com sucesso! (Simulação)");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna de Edição */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            Editor da Página de Resultado (Funil 1)
          </h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título da Página de Resultado
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={pageData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Adicionar mais campos de edição conforme necessário */}

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* Coluna de Preview (Simplificado) */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Preview (Simplificado)</h3>
          <div className="border border-dashed border-gray-300 p-4 rounded-md min-h-[300px]">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{pageData.title}</h1>
            {/* Adicionar mais elementos de preview */}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Nota: Este é um preview simplificado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPageEditor;
