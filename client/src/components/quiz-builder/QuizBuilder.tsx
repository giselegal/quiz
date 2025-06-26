import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { QuizComponentType, QuizStage, QuizBuilderState } from '@/types/quizBuilder';
import { useQuizBuilder } from '@/hooks/useQuizBuilder';
import { toast } from '@/components/ui/use-toast';
import { QuizResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import BuilderLayout from './components/BuilderLayout';
import BuilderToolbar from './components/BuilderToolbar';
import QuizTemplateImporter from './components/QuizTemplateImporter';
import QuizPreview from './preview/QuizPreview';
import { ResultPageConfig } from '@/types/resultPageConfig';
import { resultPageStorage } from '@/services/resultPageStorage';
import { createBuilderStateFromQuiz, loadQuizResultConfig } from '@/services/quizBuilderService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const QuizBuilder: React.FC = () => {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewResult, setPreviewResult] = useState<QuizResult | null>(null);
  const [isTemplateImporterOpen, setIsTemplateImporterOpen] = useState(false);
  const [isImportingFromResult, setIsImportingFromResult] = useState(false);
  
  const { 
    components, 
    stages,
    activeStageId,
    addComponent, 
    updateComponent, 
    deleteComponent,
    moveComponent,
    addStage,
    updateStage,
    deleteStage,
    moveStage,
    setActiveStage,
    saveCurrentState,
    initializeStages,
    initializeComponents,
    loading
  } = useQuizBuilder();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/resultado' && !isImportingFromResult) {
      setIsImportingFromResult(true);
      
      const styleTypes = [
        'Elegante', 'Contemporâneo', 'Natural', 'Clássico', 
        'Romântico', 'Sexy', 'Dramático', 'Criativo'
      ];
      
      let foundConfig = false;
      
      for (const styleType of styleTypes) {
        const config = loadQuizResultConfig(styleType);
        
        if (config) {
          toast({
            title: "Configuração de Resultado Encontrada",
            description: `Encontramos uma configuração de página de resultado para o estilo ${styleType}. Deseja importar para o editor?`,
            action: (
              <Button 
                onClick={() => handleImportResultPage(config)}
                className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
              >
                Importar
              </Button>
            ),
            duration: 10000
          });
          
          foundConfig = true;
          break;
        }
      }
      
      if (!foundConfig) {
        setIsImportingFromResult(false);
      }
    }
  }, []);

  const handleComponentSelect = (type: QuizComponentType) => {
    const newComponentId = addComponent(type, activeStageId);
    setSelectedComponentId(newComponentId);
  };

  const handleSave = () => {
    const success = saveCurrentState();
    if (success) {
      toast({
        title: "Quiz salvo",
        description: "Todas as alterações foram salvas com sucesso.",
      });
    }
  };

  const handlePreviewQuizResult = () => {
    const savedResult = localStorage.getItem('quiz_result');
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        setPreviewResult(parsedResult);
        return;
      } catch (error) {
        console.error('Error parsing saved quiz result:', error);
      }
    }
    
    const previewResult: QuizResult = {
      primaryStyle: {
        category: 'Elegante',
        score: 12,
        percentage: 40
      },
      secondaryStyles: [
        {
          category: 'Romântico',
          score: 9,
          percentage: 30
        },
        {
          category: 'Clássico',
          score: 6,
          percentage: 20
        },
        {
          category: 'Contemporâneo',
          score: 3,
          percentage: 10
        }
      ],
      totalSelections: 30
    };
    
    setPreviewResult(previewResult);
  };

  const handleImportTemplate = (template: QuizBuilderState) => {
    initializeStages(template.stages);
    initializeComponents(template.components);
    
    if (template.stages.length > 0) {
      setActiveStage(template.stages[0].id);
    }
    
    toast({
      title: "Template importado",
      description: "O template foi carregado com sucesso. Você pode começar a editar.",
    });
  };

  const handleImportResultPage = (config: ResultPageConfig) => {
    // Create a new stage for the result page
    const resultStageId = `stage-${Date.now()}`;
    
    const resultStage: QuizStage = {
      id: resultStageId,
      title: 'Página de Resultado',
      type: 'result',
      order: 0
    };
    
    // Create components based on blocks in the config
    const resultComponents = config.blocks?.map((block, index) => ({
      id: `component-${Date.now()}-${index}`,
      type: 'headline' as QuizComponentType, // Default to headline, modify as needed
      order: index,
      stageId: resultStageId,
      content: {
        title: block.content.title || 'Sem título',
        subtitle: block.content.subtitle || '',
        alignment: block.content.alignment || 'center'
      }
    })) || [];
    
    initializeStages([resultStage]);
    initializeComponents(resultComponents);
    setActiveStage(resultStage.id);
    
    toast({
      title: "Página de resultado importada",
      description: "A configuração da página de resultado foi importada com sucesso.",
    });
    
    setIsImportingFromResult(false);
  };

  const activeStage = activeStageId
    ? stages.find(s => s.id === activeStageId)
    : null;

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#1A1F2C]">
        <LoadingSpinner size="lg" color="#9b87f5" className="mb-4" />
        <p className="text-white text-lg">Carregando construtor de quiz...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#1A1F2C]">
      <BuilderToolbar
        activeView={activeView}
        isPreviewing={isPreviewing}
        onViewChange={setActiveView}
        onPreviewToggle={() => setIsPreviewing(!isPreviewing)}
        onSave={handleSave}
        onPreviewResultPage={handlePreviewQuizResult}
        onImportQuizTemplate={() => setIsTemplateImporterOpen(true)}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'editor' ? (
          <BuilderLayout
            components={components}
            stages={stages}
            activeStageId={activeStageId}
            selectedComponentId={selectedComponentId}
            activeStage={activeStage}
            isPreviewing={isPreviewing}
            onComponentSelect={handleComponentSelect}
            onStageAdd={addStage}
            onStageSelect={setActiveStage}
            onComponentMove={moveComponent}
            onStageMove={moveStage}
            onStageUpdate={updateStage}
            onStageDelete={deleteStage}
            onComponentUpdate={updateComponent}
            onComponentDelete={deleteComponent}
            onSelectComponent={setSelectedComponentId}
          />
        ) : (
          <QuizPreview 
            stages={stages}
            components={components}
            previewResult={previewResult}
          />
        )}
      </div>
      
      <QuizTemplateImporter 
        isOpen={isTemplateImporterOpen}
        onClose={() => setIsTemplateImporterOpen(false)}
        onImportTemplate={handleImportTemplate}
      />
    </div>
  );
};

export default QuizBuilder;
