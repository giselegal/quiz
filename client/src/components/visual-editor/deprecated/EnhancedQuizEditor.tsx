import React, { useCallback } from "react";
import ComponentPalette from "./components/ComponentPalette";
import AccessibleStepTree from "./components/AccessibleStepTree";
import AccessibleCanvas from "./components/AccessibleCanvas";
import AccessiblePropertiesPanel from "./components/AccessiblePropertiesPanel";
import { useQuizEditor, QuizComponentProps } from "../../hooks/useQuizEditorState";
import "@/styles/advanced-editor.css";

const EnhancedQuizEditor: React.FC = () => {
  const { state, currentStep, selectedComponent, actions } = useQuizEditor();
  
  // Handlers para drag and drop
  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, componentType: string) => {
    event.dataTransfer.setData("component-type", componentType);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const componentType = event.dataTransfer.getData("component-type");
    
    if (componentType) {
      actions.addComponent(componentType);
    }
  }, [actions]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Handler para atualização de propriedades
  const handlePropsUpdate = useCallback((newProps: QuizComponentProps) => {
    if (state.selectedComponentId) {
      actions.updateComponent(state.selectedComponentId, newProps);
    }
  }, [state.selectedComponentId, actions]);

  return (
    <div 
      className="advanced-quiz-editor"
      role="application"
      aria-label="Editor Visual de Quiz"
    >
      <div className="editor-layout">
        {/* Coluna 1: Paleta de Componentes */}
        <div className="editor-column palette-column">
          <ComponentPalette onDragStart={handleDragStart} />
        </div>

        {/* Coluna 2: Árvore de Etapas */}
        <div className="editor-column tree-column">
          <AccessibleStepTree
            steps={state.steps}
            currentStepId={state.currentStepId}
            onStepSelect={actions.selectStep}
            onStepAdd={actions.addStep}
            onStepDuplicate={actions.duplicateStep}
            onStepDelete={actions.deleteStep}
          />
        </div>

        {/* Coluna 3: Canvas */}
        <div className="editor-column canvas-column">
          <AccessibleCanvas
            components={currentStep?.components || []}
            selectedComponentId={state.selectedComponentId}
            onComponentSelect={actions.selectComponent}
            onComponentUpdate={actions.updateComponent}
            onComponentDelete={actions.deleteComponent}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        </div>

        {/* Coluna 4: Painel de Propriedades */}
        <div className="editor-column properties-column">
          <AccessiblePropertiesPanel
            selectedComponent={selectedComponent}
            onPropsUpdate={handlePropsUpdate}
          />
        </div>
      </div>

      {/* Status bar para feedback de acessibilidade */}
      <div className="editor-status-bar" role="status" aria-live="polite">
        <span>
          {state.steps.length} etapa{state.steps.length !== 1 ? "s" : ""} • 
          {currentStep?.components.length || 0} componente{(currentStep?.components.length || 0) !== 1 ? "s" : ""} na etapa atual
          {selectedComponent && ` • ${selectedComponent.type} selecionado`}
        </span>
      </div>
    </div>
  );
};

export default EnhancedQuizEditor;
};

export default EnhancedQuizEditor;
