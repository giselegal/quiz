import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grip, MoreVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "@/hooks/useEditorNew";
import { createStep } from "@/utils/editorUtils";

export const StepsSidebar: React.FC = () => {
  const { state, dispatch } = useEditor();

  const handleAddStep = () => {
    const newStep = createStep(`Etapa ${state.steps.length + 1}`);
    dispatch({ type: "ADD_STEP", payload: newStep });
  };

  const handleSelectStep = (stepId: string) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: stepId });
  };

  return (
    <div className="w-full min-h-[3rem] relative border-b overflow-auto none-scrollbar md:max-w-[13rem] border-r">
      <ScrollArea className="relative overflow-hidden flex md:grid h-full">
        <div className="flex flex-col">
          {state.steps.map((step, index) => (
            <div
              key={step.id}
              role="button"
              tabIndex={0}
              className="group border-r md:border-y md:border-r-0 min-w-[10rem] -mt-[1px] flex pl-2 relative items-center cursor-pointer"
              onClick={() => handleSelectStep(step.id)}
            >
              {/* Indicador de step ativo */}
              <div
                className={`absolute bottom-0 z-[5] left-0 w-full md:w-0 md:h-full border md:border-2 ${
                  state.currentStepId === step.id
                    ? "border-blue-600"
                    : "border-transparent"
                }`}
              />

              <span>
                <Grip className="w-4 h-4 text-zinc-100" />
              </span>

              <div className="w-full relative z-[5]">
                <span className="block h-[3rem] w-full cursor-pointer bg-transparent p-3 placeholder:italic text-zinc-100">
                  {step.name}
                </span>
              </div>

              {index === 0 && (
                <MoreVertical
                  className="mr-2 w-4 h-4 cursor-pointer text-zinc-100"
                  type="button"
                />
              )}
            </div>
          ))}

          <div className="grid md:p-1 relative">
            <Button
              variant="ghost"
              className="hover:bg-primary hover:text-foreground h-10 px-4 py-2"
              onClick={handleAddStep}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Etapa
            </Button>
          </div>
          <div className="py-10"></div>
        </div>
      </ScrollArea>
    </div>
  );
};
