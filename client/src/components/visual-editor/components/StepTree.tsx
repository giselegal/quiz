import React from "react";
import { Step } from "../types";

interface StepTreeProps {
  steps: Step[];
  currentStepId: string;
  onStepSelect: (stepId: string) => void;
  onStepAdd: () => void;
  onStepDuplicate: (stepId: string) => void;
  onStepDelete: (stepId: string) => void;
}

const StepTree: React.FC<StepTreeProps> = ({
  steps,
  currentStepId,
  onStepSelect,
  onStepAdd,
  onStepDuplicate,
  onStepDelete,
}) => {
  return (
    <div className="step-tree">
      <div className="tree-header">
        <h3 className="tree-title">📋 Estrutura do Quiz</h3>
        <button
          className="add-step-btn"
          onClick={onStepAdd}
          title="Adicionar Nova Etapa"
        >
          + Etapa
        </button>
      </div>

      <div className="steps-list">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-item ${currentStepId === step.id ? "active" : ""}`}
          >
            <div className="step-header" onClick={() => onStepSelect(step.id)}>
              <span className="step-number">{index + 1}</span>
              <span className="step-name">{step.name}</span>
              <span className="component-count">
                {step.components.length} componente(s)
              </span>
            </div>

            <div className="step-actions">
              <button
                className="step-action-btn duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  onStepDuplicate(step.id);
                }}
                title="Duplicar Etapa"
              >
                📋
              </button>
              <button
                className="step-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onStepDelete(step.id);
                }}
                title="Excluir Etapa"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepTree;
