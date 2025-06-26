import React from "react";

const AdvancedQuizEditorTest: React.FC = () => {
  console.log("🚀 AdvancedQuizEditorTest está renderizando!");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Editor de Quiz Avançado - Teste
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Teste de Funcionalidade
          </h2>
          <p className="text-gray-600">
            Se você está vendo esta mensagem, o editor está funcionando
            corretamente.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Painel de Componentes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Componentes</h3>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border">📝 Texto</div>
                <div className="bg-white p-2 rounded border">🖼️ Imagem</div>
                <div className="bg-white p-2 rounded border">🔘 Opções</div>
                <div className="bg-white p-2 rounded border">📊 Botão</div>
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-96">
              <h3 className="font-medium text-gray-900 mb-2">Canvas</h3>
              <p className="text-gray-500">Área de trabalho do quiz</p>
            </div>

            {/* Painel de Propriedades */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Propriedades</h3>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border">
                  ⚙️ Configurações
                </div>
                <div className="bg-white p-2 rounded border">🎨 Estilo</div>
                <div className="bg-white p-2 rounded border">📐 Layout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedQuizEditorTest;
