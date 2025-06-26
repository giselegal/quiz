import React from "react";
import "@/styles/advanced-editor.css";

const SimpleRefactoredEditor: React.FC = () => {
  return (
    <div className="advanced-quiz-editor">
      <div className="editor-layout">
        {/* Coluna 1: Paleta de Componentes */}
        <div className="editor-column palette-column">
          <div style={{ padding: "16px" }}>
            <h3>🧩 Componentes</h3>
            <div>Editor funcionando!</div>
          </div>
        </div>

        {/* Coluna 2: Árvore de Etapas */}
        <div className="editor-column tree-column">
          <div style={{ padding: "16px" }}>
            <h3>📋 Estrutura</h3>
            <div>Etapas do quiz</div>
          </div>
        </div>

        {/* Coluna 3: Canvas */}
        <div className="editor-column canvas-column">
          <div style={{ padding: "16px" }}>
            <h3>🎨 Canvas</h3>
            <div>Área de edição</div>
          </div>
        </div>

        {/* Coluna 4: Propriedades */}
        <div className="editor-column properties-column">
          <div style={{ padding: "16px" }}>
            <h3>⚙️ Propriedades</h3>
            <div>Painel de configurações</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRefactoredEditor;
