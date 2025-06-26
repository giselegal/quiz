import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Save,
  Undo,
  Redo,
  Play,
  Cloud,
  Settings,
  Palette,
  Workflow,
  PencilRuler,
  UserRoundSearch,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import { useEditor } from "@/hooks/useEditorNew";
import { EditorStorageService } from "@/services/editorStorage";
import { importRealQuizData } from "@/utils/importQuizDataReal";

export const EditorNavbar: React.FC = () => {
  const { state } = useEditor();
  const navigate = useNavigate();

  const handleSave = () => {
    EditorStorageService.saveConfig(state);
    console.log("Quiz configuration saved!");
  };

  const handlePreview = () => {
    handleSave(); // Salva antes de fazer preview
    navigate("/new-quiz"); // Vai para a nova página de quiz
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "quiz-config.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportRealQuiz = async () => {
    try {
      await importRealQuizData();
      console.log("Quiz real importado com sucesso!");
      // Recarregar a página para mostrar os novos dados
      window.location.reload();
    } catch (error) {
      console.error("Erro ao importar quiz real:", error);
    }
  };

  return (
    <div className="h-fit border-b relative z-[20] bg-zinc-950/50 backdrop-blur-lg">
      <div className="w-full flex flex-wrap md:flex-nowrap justify-between">
        {/* Left section - Logo and basic controls */}
        <div className="order-0 md:order-0 flex w-full max-w-[5.75rem] lg:max-w-[18rem]">
          <div className="border-r">
            <Button
              variant="ghost"
              className="inline-block relative font-bold px-4 py-[1rem] text-zinc-100 border border-transparent hover:-100 rounded-none h-full md:px-5"
            >
              <span className="h-full flex items-center w-full justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </span>
            </Button>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex p-3 gap-1 md:gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Middle section - Main actions */}
        <div className="order-2 md:order-1 flex w-full max-w-full md:max-w-fit">
          <div className="flex p-3 gap-1 md:gap-2 flex-wrap justify-center">
            <Button
              variant="default"
              className="h-10 gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>

            <Button
              variant="outline"
              className="h-10 gap-2"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            <Button
              variant="outline"
              className="h-10 gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>

            <Button
              variant="default"
              className="h-10 gap-2"
              onClick={handleImportRealQuiz}
            >
              <Upload className="h-4 w-4" />
              Importar Quiz Real
            </Button>

            <Button variant="outline" size="icon" className="h-10 w-10">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right section - Tools and settings */}
        <div className="order-1 md:order-2 flex w-full max-w-full md:max-w-fit">
          <div className="flex p-3 gap-1 md:gap-2 flex-wrap justify-end">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Palette className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Workflow className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <PencilRuler className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <UserRoundSearch className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Cloud className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
