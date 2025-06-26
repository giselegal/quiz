import React, { useCallback, useMemo } from "react";
import { Step } from "../../../hooks/useQuizEditorState";

interface AccessibleStepTreeProps {
  steps: Step[];
  currentStepId: string;
  onStepSelect: (stepId: string) => void;
  onStepAdd: () => void;
  onStepDuplicate: (stepId: string) => void;
  onStepDelete: (stepId: string) => void;
}

const AccessibleStepTree: React.FC<AccessibleStepTreeProps> = React.memo(({
  steps,
  currentStepId,
  onStepSelect,
  onStepAdd,
  onStepDuplicate,
  onStepDelete,
}) => {
  // Memoizar índice da etapa atual
  const currentStepIndex = useMemo(() => 
    steps.findIndex(step => step.id === currentStepId),
    [steps, currentStepId]
  );

  // Handler para navegação por teclado
  const handleStepKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLDivElement>,
    stepId: string
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        onStepSelect(stepId);
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        navigateSteps(event.key === "ArrowDown" ? 1 : -1);
        break;
      case "Delete":
        if (steps.length > 1) {
          event.preventDefault();
          onStepDelete(stepId);
        }
        break;
      case "d":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onStepDuplicate(stepId);
        }
        break;
    }
  }, [steps.length, onStepSelect, onStepDelete, onStepDuplicate]);

  // Navegação entre etapas
  const navigateSteps = useCallback((direction: number) => {
    if (steps.length === 0) return;
    
    let nextIndex = currentStepIndex + direction;
    if (nextIndex < 0) nextIndex = steps.length - 1;
    if (nextIndex >= steps.length) nextIndex = 0;
    
    onStepSelect(steps[nextIndex].id);
  }, [steps, currentStepIndex, onStepSelect]);

  // Handler para botão de adicionar etapa
  const handleAddStepKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStepAdd();
    }
  }, [onStepAdd]);

  return (
    <div 
      className="step-tree"
      role="region"
      aria-label="Estrutura e navegação do quiz"
    >
      <div className="tree-header">
        <h3 className="tree-title" id="steps-title">📋 Estrutura do Quiz</h3>
        <button 
          className="add-step-btn"
          onClick={onStepAdd}
          onKeyDown={handleAddStepKeyDown}
          aria-label="Adicionar nova etapa ao quiz"
          title="Adicionar Nova Etapa (Ctrl+N)"
        >
          + Etapa
        </button>
      </div>
      
      <div 
        className="steps-list"
        role="list"
        aria-labelledby="steps-title"
        aria-describedby="steps-instructions"
      >
        <div id="steps-instructions" className="sr-only">
          Lista de etapas do quiz. Use as setas para navegar, Enter para selecionar, Delete para excluir, Ctrl+D para duplicar.
        </div>
        
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-item ${currentStepId === step.id ? "active" : ""}`}
            role="listitem"
          >
            <div 
              className="step-header"
              role="button"
              tabIndex={0}
              aria-selected={currentStepId === step.id}
              aria-label={`Etapa ${index + 1}: ${step.name}, ${step.components.length} componente${step.components.length !== 1 ? "s" : ""}`}
              onClick={() => onStepSelect(step.id)}
              onKeyDown={(e) => handleStepKeyDown(e, step.id)}
            >
              <span 
                className="step-number"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="step-name">{step.name}</span>
              <span 
                className="component-count"
                aria-label={`${step.components.length} componente${step.components.length !== 1 ? "s" : ""}`}
              >
                {step.components.length} componente{step.components.length !== 1 ? "s" : ""}
              </span>
            </div>
            
            <div 
              className="step-actions"
              role="toolbar"
              aria-label={`Ações para etapa ${index + 1}`}
            >
              <button
                className="step-action-btn duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  onStepDuplicate(step.id);
                }}
                aria-label={`Duplicar etapa ${index + 1}: ${step.name}`}
                title="Duplicar Etapa (Ctrl+D)"
              >
                📋
              </button>
              <button
                className="step-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onStepDelete(step.id);
                }}
                disabled={steps.length <= 1}
                aria-label={`Excluir etapa ${index + 1}: ${step.name}`}
                title={steps.length <= 1 ? "Não é possível excluir a única etapa" : "Excluir Etapa (Delete)"}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        
        {steps.length === 0 && (
          <div className="no-steps" role="status" aria-live="polite">
            <p>Nenhuma etapa criada. Clique em "+ Etapa" para começar.</p>
          </div>
        )}
      </div>
      
      <div className="step-tree-footer" aria-live="polite">
        <span className="steps-summary">
          Total: {steps.length} etapa{steps.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
});

AccessibleStepTree.displayName = "AccessibleStepTree";

export default AccessibleStepTree;
