
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { EditorConfig, BlockType } from '@/types/editor';
import { VisualEditor } from '@/components/visual-editor/VisualEditor';
import QuizBuilder from '@/components/quiz-builder/QuizBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useEditor } from '@/hooks/useEditor';

const EditorPage: React.FC = () => {
  const { pageType, style } = useParams<{ pageType?: string; style?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'result';
  const { config, saveConfig } = useEditor();
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    // Create a default config if needed
    if (!config || Object.keys(config).length === 0) {
      const defaultConfig = {
        blocks: [],
        meta: {
          title: 'Editor Page',
          description: 'Editor page description'
        }
      };
      
      saveConfig(defaultConfig as EditorConfig);
    }
  }, [config, saveConfig]);
  
  const handleSave = async () => {
    try {
      saveConfig(config);
      toast({
        title: "Configuração salva com sucesso!",
        description: "As alterações foram salvas e aplicadas à página.",
      });
    } catch (error) {
      console.error("Erro ao salvar a configuração:", error);
      toast({
        title: "Erro ao salvar configuração",
        description: "Ocorreu um erro ao salvar a configuração. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Editor de Páginas</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Voltar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} className="flex flex-col h-full">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="result" onClick={() => setActiveTab('result')}>Página de Resultado</TabsTrigger>
          <TabsTrigger value="quiz" onClick={() => setActiveTab('quiz')}>Quiz Builder</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="result" className="h-full">
            <VisualEditor />
          </TabsContent>
          <TabsContent value="quiz" className="h-full">
            <QuizBuilder />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditorPage;
