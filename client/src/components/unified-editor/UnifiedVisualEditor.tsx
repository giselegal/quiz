
import React, { useState, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizEditorPanel from './panels/QuizEditorPanel';
import ResultEditorPanel from './panels/ResultEditorPanel';
import SalesEditorPanel from './panels/SalesEditorPanel';
import { useUnifiedEditor } from '@/hooks/useUnifiedEditor';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { UnifiedTemplateModal } from './modals/UnifiedTemplateModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export type EditorTab = 'quiz' | 'result' | 'sales';

interface UnifiedVisualEditorProps {
  primaryStyle: StyleResult;
  initialActiveTab?: EditorTab;
}

export const UnifiedVisualEditor: React.FC<UnifiedVisualEditorProps> = ({ 
  primaryStyle, 
  initialActiveTab = 'quiz' 
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>(initialActiveTab);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  
  const {
    isPreviewing,
    togglePreview,
    saveAll,
    openTemplateModal,
    isTemplateModalOpen,
    closeTemplateModal,
    loadTemplateForCurrentEditor,
    setActiveMode
  } = useUnifiedEditor(primaryStyle);

  useEffect(() => {
    // Update the active mode in the unified editor hook
    setActiveMode(activeTab);
  }, [activeTab, setActiveMode]);
  
  const handleTabChange = (value: string) => {
    const newTab = value as EditorTab;
    setActiveTab(newTab);
    toast({
      description: `Editor de ${newTab === 'quiz' ? 'Quiz' : newTab === 'result' ? 'Resultado' : 'Vendas'} ativado`,
      duration: 2000,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    toast({
      title: "Salvando alterações",
      description: "Por favor, aguarde...",
      duration: 2000,
    });
    
    try {
      const success = await saveAll();
      
      if (success) {
        toast({
          title: "Alterações salvas",
          description: "Todas as alterações foram salvas com sucesso.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <EditorToolbar
        isPreviewing={isPreviewing}
        onPreviewToggle={togglePreview}
        onSave={handleSave}
        onOpenTemplateModal={openTemplateModal}
        viewportSize={viewportSize}
        onViewportSizeChange={setViewportSize}
      />
      
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex-1 overflow-hidden"
      >
        <TabsList className="w-full border-b bg-white px-4 pt-2">
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="result">Resultado</TabsTrigger>
          <TabsTrigger value="sales">Página de Vendas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quiz" className="flex-1 h-[calc(100%-40px)] overflow-hidden">
          <TooltipProvider>
            <QuizEditorPanel 
              isVisible={activeTab === 'quiz'} 
              isPreviewing={isPreviewing} 
            />
          </TooltipProvider>
        </TabsContent>
        
        <TabsContent value="result" className="flex-1 h-[calc(100%-40px)] overflow-hidden">
          <TooltipProvider>
            <ResultEditorPanel isPreviewing={isPreviewing} primaryStyle={primaryStyle} />
          </TooltipProvider>
        </TabsContent>
        
        <TabsContent value="sales" className="flex-1 h-[calc(100%-40px)] overflow-hidden">
          <TooltipProvider>
            <SalesEditorPanel isPreviewing={isPreviewing} primaryStyle={primaryStyle} />
          </TooltipProvider>
        </TabsContent>
      </Tabs>

      {isTemplateModalOpen && (
        <UnifiedTemplateModal
          activeTab={activeTab}
          onClose={closeTemplateModal}
          onApplyTemplate={loadTemplateForCurrentEditor}
        />
      )}
      
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <LoadingSpinner size="sm" color="#3b82f6" />
            <span>Salvando alterações...</span>
          </div>
        </div>
      )}
    </div>
  );
};
