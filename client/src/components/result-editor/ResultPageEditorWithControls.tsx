
import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import QuizResult from '../QuizResult';
import EditableComponent from './EditableComponent';
import { useQuizResultConfig } from '@/hooks/useQuizResultConfig';
import { useAutosave } from '@/hooks/useAutosave';

interface ResultPageEditorWithControlsProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

export const ResultPageEditorWithControls: React.FC<ResultPageEditorWithControlsProps> = ({
  primaryStyle,
  secondaryStyles
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { config, updateConfig, saveConfig } = useQuizResultConfig(primaryStyle.category);
  
  // Use our new autosave hook
  const { isSaving, lastSaved, saveNow } = useAutosave({
    data: config,
    onSave: saveConfig,
    interval: 5000,
    enabled: !isPreviewMode // Only enable autosave when not in preview mode
  });

  const handleConfigUpdate = (sectionKey: string, data: any) => {
    updateConfig(sectionKey, data);
    // No need to call save here, autosave will handle it
  };
  
  const togglePreviewMode = () => {
    // If we're switching from edit to preview, save immediately
    if (!isPreviewMode) {
      saveNow();
    }
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de ferramentas do editor */}
      <div className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/resultado">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-playfair text-[#432818]">Editor da Página de Resultados</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!isPreviewMode && (
            <div className="text-sm text-muted-foreground">
              {isSaving ? (
                <span>Salvando...</span>
              ) : (
                lastSaved && (
                  <span>Salvo às {lastSaved.toLocaleTimeString()}</span>
                )
              )}
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={togglePreviewMode}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Editar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </>
            )}
          </Button>
          
          <Button 
            className="bg-[#B89B7A] hover:bg-[#A38A69]" 
            onClick={saveNow}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
      
      {/* Conteúdo da página */}
      <div className="flex-1">
        {isPreviewMode ? (
          // Modo de visualização: mostra a página exatamente como o usuário verá
          <QuizResult 
            primaryStyle={primaryStyle} 
            secondaryStyles={secondaryStyles} 
          />
        ) : (
          // Modo de edição: envolve cada seção com controles de edição
          <EditableComponent
            components={{
              primaryStyle,
              secondaryStyles,
              config
            }}
            onUpdate={handleConfigUpdate}
          />
        )}
      </div>
    </div>
  );
};
