import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResultPageConfig, BlockType } from '@/types/editor';
import { QuizBuilderConfig } from '@/types/quizBuilder';
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
  const { config, saveConfig, loadConfig } = useEditor();
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    // Load config based on pageType and style
    if (pageType && style) {
      loadConfig(pageType, style);
    } else {
      // Set default config
      const defaultConfig = {
        styleType: 'default',
        header: {
          content: {
            title: 'Descubra Seu Estilo de Decoração',
            subtitle: 'Faça o quiz e encontre o estilo perfeito para você!',
          },
          style: {
            paddingY: 'md',
            paddingX: 'md',
            backgroundColor: '#f8f1ed',
            textColor: '#432818',
            borderRadius: 'sm',
          },
          visible: true,
        },
        mainContent: {
          content: {
            description: 'Encontre o estilo que mais combina com você e transforme sua casa!',
          },
          style: {
            paddingY: 'md',
            paddingX: 'md',
            backgroundColor: '#f8f1ed',
            textColor: '#432818',
            borderRadius: 'sm',
          },
          visible: true,
        },
        offer: {
          content: {
            title: 'Transforme sua casa com o guia completo de decoração!',
            description: 'Aprenda a combinar cores, móveis e acessórios para criar ambientes únicos e personalizados.',
            features: [
              'Dicas de especialistas em decoração',
              'Inspirações para todos os estilos',
              'Guia de compras com os melhores produtos',
            ],
            ctaText: 'Quero transformar minha casa!',
            ctaLink: '/oferta',
            price: 'R$ 97,00',
            discountPrice: 'R$ 47,00',
          },
          style: {
            padding: 'md',
            backgroundColor: '#f8f1ed',
            accentColor: '#B89B7A',
            textColor: '#432818',
          },
          visible: true,
        },
      } as unknown as ResultPageConfig;
      
      saveConfig(defaultConfig);
    }
  }, [pageType, style, loadConfig, saveConfig]);
  
  const handleSave = async () => {
    try {
      if (pageType && style) {
        await saveConfig(config, pageType, style);
        toast({
          title: "Configuração salva com sucesso!",
          description: "As alterações foram salvas e aplicadas à página.",
        });
      } else {
        toast({
          title: "Erro ao salvar configuração",
          description: "Tipo de página ou estilo não especificados.",
          variant: "destructive",
        });
      }
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
