import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Eye, Trash2, ChevronRight } from "lucide-react";
import { EditorStage } from "@/hooks/useLiveEditor";

interface StagesSidebarProps {
  stages: EditorStage[];
  activeStageId: string | null;
  onStageSelect: (stageId: string) => void;
  onAddStage: (type: EditorStage["type"]) => void;
  onUpdateStage: (stageId: string, updates: Partial<EditorStage>) => void;
  onDeleteStage: (stageId: string) => void;
}

const StagesSidebar: React.FC<StagesSidebarProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onAddStage,
  onUpdateStage,
  onDeleteStage,
}) => {
  const getStageIcon = (type: EditorStage["type"]) => {
    switch (type) {
      case "intro":
        return "🏠";
      case "question":
        return "❓";
      case "result":
        return "🎯";
      case "offer":
        return "💰";
      default:
        return "📄";
    }
  };

  const getStageColor = (type: EditorStage["type"]) => {
    switch (type) {
      case "intro":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "question":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "result":
        return "bg-green-50 text-green-700 border-green-200";
      case "offer":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#252A3A] border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-3">
          Etapas do Quiz
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onAddStage("question")}
            className="bg-[#B89B7A] hover:bg-[#A1835D] text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Nova Questão
          </Button>
        </div>
      </div>

      {/* Stages List com barra de rolagem customizada */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {stages.map((stage, index) => (
          <Card
            key={stage.id}
            className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md scroll-fade-in ${
              activeStageId === stage.id
                ? "bg-[#B89B7A] text-white shadow-md border-[#B89B7A]"
                : "bg-[#2A2F3E] text-gray-300 hover:bg-[#323749] border-gray-600"
            }`}
            onClick={() => onStageSelect(stage.id)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg filter drop-shadow-sm">
                  {getStageIcon(stage.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{stage.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs transition-all duration-200 ${getStageColor(
                        stage.type
                      )}`}
                    >
                      {stage.type}
                    </Badge>
                    {stage.components.length > 0 && (
                      <Badge
                        variant="outline"
                        className={`text-xs transition-all duration-200 ${
                          activeStageId === stage.id
                            ? "border-white text-white"
                            : "border-gray-500 text-gray-400"
                        }`}
                      >
                        {stage.components.length} componentes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {activeStageId === stage.id && (
                  <ChevronRight className="w-4 h-4 animate-pulse" />
                )}
              </div>
            </div>
          </Card>
        ))}

        {stages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm">Nenhuma etapa criada</p>
            <p className="text-xs text-gray-600 mt-1">
              Clique em "Nova Questão" para começar
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Total: {stages.length} etapas
        </div>
      </div>
    </div>
  );
};

export default StagesSidebar;
