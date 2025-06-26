import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "@/hooks/useEditorNew";
import { getCurrentStep } from "@/utils/editorUtils";
import { EditableElement } from "./EditableElement";
import { getPlaceholderImage } from "@/utils/placeholderUtils";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EditorCanvas: React.FC = () => {
  const { state, dispatch } = useEditor();
  const currentStep = getCurrentStep(state);

  const { isOver, setNodeRef } = useDroppable({
    id: "canvas",
  });

  if (!currentStep) {
    return <div>Nenhuma etapa selecionada</div>;
  }

  const progressValue =
    ((state.steps.findIndex((s) => s.id === state.currentStepId) + 1) /
      state.steps.length) *
    100;

  return (
    <ScrollArea className="relative w-full overflow-auto z-10">
      <div className="group relative main-content w-full min-h-full mx-auto">
        <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 group-[.screen-mobile]:p-3 md:p-5 pb-10">
          {/* Header */}
          <div className="grid gap-4 opacity-100">
            <div className="flex flex-row w-full h-auto justify-center relative">
              {currentStep.settings.allowReturn && (
                <Button variant="ghost" className="absolute left-0 h-10 w-10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}

              <div className="flex flex-col w-full customizable-width justify-start items-center gap-4">
                {currentStep.settings.showLogo && (
                  <img
                    width="96"
                    height="96"
                    className="max-w-24 object-cover"
                    alt="Logo"
                    src={getPlaceholderImage(96, 96, "Logo")}
                  />
                )}

                {currentStep.settings.showProgress && (
                  <Progress value={progressValue} className="w-full h-2" />
                )}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div
            ref={setNodeRef}
            className={`main-content w-full relative mx-auto customizable-width h-full min-h-[400px] ${
              isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
            }`}
          >
            <div className="flex flex-row flex-wrap pb-10">
              <SortableContext
                items={currentStep.elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentStep.elements.map((element) => (
                  <EditableElement
                    key={element.id}
                    element={element}
                    isSelected={state.selectedElementId === element.id}
                    onSelect={() =>
                      dispatch({ type: "SELECT_ELEMENT", payload: element.id })
                    }
                  />
                ))}
              </SortableContext>

              {/* Drop zone indicator when no elements */}
              {currentStep.elements.length === 0 && (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      Arraste elementos aqui
                    </p>
                    <p className="text-sm">
                      Use a barra de ferramentas à esquerda para adicionar
                      elementos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-10 md:pt-24"></div>
        </div>
      </div>
    </ScrollArea>
  );
};
