"use client";
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, Eye, Plus } from 'lucide-react';

interface DragDropEditorProps {
  onSave: (config: any) => void;
  initialBlocks?: any[];
  mode?: 'quiz' | 'result' | 'offer';
  quizId?: string;
}

export const DragDropEditor: React.FC<DragDropEditorProps> = ({ 
  onSave, 
  initialBlocks = [], 
  mode = 'quiz',
  quizId 
}) => {
  const [steps, setSteps] = useState([]);
  const [activeStepId, setActiveStepId] = useState('step-1');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleSave = useCallback(() => {
    const editorConfig = {
      steps,
      activeStepId,
      previewMode,
      timestamp: Date.now(),
      version: '2.0',
      mode
    };
    onSave(editorConfig);
  }, [steps, activeStepId, previewMode, mode, onSave]);

  const getModeTitle = () => {
    switch (mode) {
      case 'quiz': return 'Editor de Quiz';
      case 'result': return 'Editor de Resultado';
      case 'offer': return 'Editor de Oferta';
      default: return 'Editor Visual';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{getModeTitle()}</h1>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {mode.toUpperCase()}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Quiz ID: {quizId}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full mt-16">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Componentes
            </h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600">Editor simplificado - funcionalidades básicas disponíveis.</p>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Preview: {previewMode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-6">
            <Card className="p-8">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Editor {getModeTitle()}</h3>
                <p>Área de edição será implementada aqui.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropEditor;
