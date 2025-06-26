import React from "react";

// Componente temporário para evitar erros de build
const ModernVisualEditor: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">ModernVisualEditor</h1>
        <p className="text-zinc-400">Em desenvolvimento...</p>
        <p className="text-xs text-zinc-500 mt-2">
          Use o AdvancedQuizEditor em /advanced-editor
        </p>
      </div>
    </div>
  );
};

export default ModernVisualEditor;
