import React from "react";
import { useQuizEditor } from "../../hooks/useQuizEditorState";
import ComponentPalette from "./components/ComponentPalette";
import StepTree from "./components/StepTree";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import EditorToolbar from "./components/EditorToolbar";
import "@/styles/advanced-editor.css";

const ModularRefactoredEditor: React.FC = () => {
  const { state, currentStep, selectedComponent, actions } = useQuizEditor();

  // Handlers para drag & drop
  const handleDragStart = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, componentType: string) => {
      event.dataTransfer.setData("component-type", componentType);
    },
    []
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const componentType = event.dataTransfer.getData("component-type");
      if (componentType) {
        actions.addComponent(componentType);
      }
    },
    [actions]
  );

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div className="advanced-quiz-editor">
      <div className="editor-layout">
        <div className="editor-column palette-column">
          <ComponentPalette
            onDragStart={handleDragStart}
            availableComponents={[
              "heading",
              "text",
              "image",
              "button",
              "input",
              "options",
              "alert",
              "video",
              "spacer",
            ]}
          />
        </div>

        <div className="editor-column tree-column">
          <StepTree
            steps={state.steps}
            currentStepId={currentStep?.id || ""}
            onStepSelect={actions.setCurrentStep}
            onAddStep={actions.addStep}
            onDeleteStep={actions.deleteStep}
          />
        </div>

        <div className="editor-column canvas-column">
          <Canvas
            currentStep={currentStep}
            selectedComponentId={selectedComponent?.id || ""}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onComponentSelect={actions.setSelectedComponent}
            onComponentDelete={actions.deleteComponent}
          />
        </div>

        <div className="editor-column properties-column">
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={actions.updateComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default ModularRefactoredEditor;
