import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Save, Palette, Type, ArrowLeft } from "lucide-react";

// Using SimpleDragDropEditor as primary editor
import SimpleDragDropEditor from "@/components/visual-editor/SimpleDragDropEditor";

const EditorPage: React.FC = () => {
  const [activeEditor, setActiveEditor] = useState<string | null>(null);

  if (activeEditor === "quiz-offer") {
    return (
      <div className="h-screen">
        <div className="bg-white border-b p-4">
          <Button
            variant="ghost"
            onClick={() => setActiveEditor(null)}
            className="flex items-center gap-2 text-[#432818] hover:text-[#B89B7A]"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </div>
        <SimpleDragDropEditor />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#432818]">Editor Visual</h1>
          <p className="text-[#8F7A6A] mt-2">
            Edite e personalize seus quizzes e páginas
          </p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveEditor("quiz-offer")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editor Visual Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8F7A6A]">
              Editor completo da página de quiz e oferta com design ao vivo
            </p>
            <Button
              variant="outline"
              className="w-full bg-[#B89B7A] hover:bg-[#A0895B] text-white border-[#B89B7A]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Abrir Editor Completo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Página de Resultado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8F7A6A]">
              Personalize a página de resultados
            </p>
            <Button variant="outline" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              Abrir Editor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Temas & Cores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8F7A6A]">
              Ajuste cores e temas globais
            </p>
            <Button variant="outline" className="w-full">
              <Palette className="w-4 h-4 mr-2" />
              Personalizar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditorPage;
