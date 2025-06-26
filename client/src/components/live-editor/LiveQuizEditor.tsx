
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Eye, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { useLiveEditor } from '@/hooks/useLiveEditor';
import ComponentsSidebar from './sidebar/ComponentsSidebar';
import StagesSidebar from './sidebar/StagesSidebar';
import PropertiesSidebar from './sidebar/PropertiesSidebar';
import { QuizIntroPreview } from './preview/components/QuizIntroPreview';
import { QuestionPreview } from './preview/components/QuestionPreview';
import { ResultPreview } from './preview/components/ResultPreview';
import { OfferPreview } from './preview/components/OfferPreview';
import TemplateLibrary from './templates/TemplateLibrary';
import SmartComponentPalette from './smart-components/SmartComponentPalette';
import InlineEditor from './inline-editor/InlineEditor';

const LiveQuizEditor: React.FC = () => {
  const {
    stages,
    activeStageId,
    selectedComponentId,
    isPreviewMode,
    setActiveStage,
    setSelectedComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    togglePreview,
    saveEditor
  } = useLiveEditor();

  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showSmartComponents, setShowSmartComponents] = useState(false);
  const [inlineEditor, setInlineEditor] = useState<{
    show: boolean;
    componentId: string;
    content: any;
    type: 'text' | 'heading' | 'button' | 'image';
    position: { x: number; y: number };
  } | null>(null);

  const activeStage = stages.find(stage => stage.id === activeStageId);
  const selectedComponent = activeStage?.components.find(comp => comp.id === selectedComponentId);

  const handleAddStage = (type: 'intro' | 'question' | 'result' | 'offer') => {
    // For now, we'll add a question stage by default since that's most common
    console.log('Add stage:', type);
    // This would typically call a method from useLiveEditor hook
  };

  const handleUpdateStage = (stageId: string, updates: any) => {
    console.log('Update stage:', stageId, updates);
    // This would typically call a method from useLiveEditor hook
  };

  const handleDeleteStage = (stageId: string) => {
    console.log('Delete stage:', stageId);
    // This would typically call a method from useLiveEditor hook
  };

  const handleDeleteComponent = () => {
    if (selectedComponentId && activeStageId) {
      deleteComponent(activeStageId, selectedComponentId);
      setSelectedComponent(null);
    }
  };

  const handleAddComponent = (componentType: string) => {
    if (!activeStageId) return;

    const newComponent = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      content: getDefaultContent(componentType),
      style: {},
      position: { x: 50, y: 50 },
      size: { width: 300, height: 100 }
    };

    addComponent(activeStageId, newComponent);
  };

  const handleSmartComponentSelect = (componentId: string) => {
    console.log('Smart component selected:', componentId);
    // Implementar lógica específica para componentes inteligentes
    setShowSmartComponents(false);
  };

  const handleTemplateSelect = (template: any) => {
    console.log('Template selected:', template);
    // Implementar aplicação do template
    setShowTemplateLibrary(false);
  };

  const handleInlineEdit = (componentId: string, position: { x: number; y: number }) => {
    const component = activeStage?.components.find(comp => comp.id === componentId);
    if (!component) return;

    const editorType = getEditorType(component.type);
    
    setInlineEditor({
      show: true,
      componentId,
      content: component.content,
      type: editorType,
      position
    });
  };

  const handleInlineEditorSave = (content: any) => {
    if (!inlineEditor || !activeStageId) return;

    updateComponent(activeStageId, inlineEditor.componentId, { content });
    setInlineEditor(null);
  };

  const handleInlineEditorCancel = () => {
    setInlineEditor(null);
  };

  const getDefaultContent = (type: string) => {
    const defaults: Record<string, any> = {
      heading: { text: 'Novo Título' },
      text: { text: 'Novo texto aqui...' },
      button: { text: 'Clique aqui', url: '#' },
      image: { src: '', alt: 'Imagem' },
      hero: { title: 'Título Principal', subtitle: 'Subtítulo', buttonText: 'Começar' }
    };
    return defaults[type] || {};
  };

  const getEditorType = (componentType: string): 'text' | 'heading' | 'button' | 'image' => {
    const typeMap: Record<string, 'text' | 'heading' | 'button' | 'image'> = {
      'heading': 'heading',
      'text': 'text',
      'button': 'button',
      'image': 'image',
      'hero': 'heading'
    };
    return typeMap[componentType] || 'text';
  };

  const getViewportClasses = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const renderStagePreview = () => {
    if (!activeStage) {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Layers className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Nenhuma etapa selecionada</p>
              <p className="text-sm">Selecione uma etapa para começar a editar</p>
            </div>
          </Card>
        </div>
      );
    }

    const previewProps = {
      stage: activeStage,
      selectedComponentId,
      onSelectComponent: setSelectedComponent,
      onUpdateComponent: (componentId: string, updates: any) => {
        if (activeStageId) {
          updateComponent(activeStageId, componentId, updates);
        }
      },
      isPreviewMode
    };

    switch (activeStage.type) {
      case 'intro':
        return <QuizIntroPreview {...previewProps} />;
      case 'question':
        return <QuestionPreview {...previewProps} />;
      case 'result':
        return <ResultPreview {...previewProps} />;
      case 'offer':
        return <OfferPreview {...previewProps} />;
      default:
        return <div>Tipo de etapa não suportado</div>;
    }
  };

  return (
    <div className="h-screen bg-[#1A1F2E] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#2A2F3E] border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#B89B7A]" />
            <h1 className="text-xl font-bold">Editor ao Vivo</h1>
          </div>
          <Badge variant="secondary" className="bg-[#B89B7A] text-white">
            {activeStage?.name || 'Nenhuma etapa'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Controls */}
          <div className="flex bg-[#323749] rounded-lg p-1">
            <Button
              size="sm"
              variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setViewportSize('desktop')}
              className="px-3"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setViewportSize('tablet')}
              className="px-3"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setViewportSize('mobile')}
              className="px-3"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTemplateLibrary(true)}
            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
          >
            <Palette className="w-4 h-4 mr-2" />
            Templates
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSmartComponents(true)}
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            IA
          </Button>

          <Button
            size="sm"
            variant={isPreviewMode ? 'default' : 'outline'}
            onClick={togglePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Editando' : 'Preview'}
          </Button>

          <Button size="sm" onClick={saveEditor} className="bg-[#B89B7A] hover:bg-[#A1835D]">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-[#2A2F3E] border-r border-gray-700 flex flex-col">
          <Tabs defaultValue="stages" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-[#323749] mx-4 mt-4">
              <TabsTrigger value="stages">Etapas</TabsTrigger>
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="properties">Propriedades</TabsTrigger>
            </TabsList>

            <TabsContent value="stages" className="flex-1 mt-0">
              <StagesSidebar
                stages={stages}
                activeStageId={activeStageId}
                onStageSelect={setActiveStage}
                onAddStage={handleAddStage}
                onUpdateStage={handleUpdateStage}
                onDeleteStage={handleDeleteStage}
              />
            </TabsContent>

            <TabsContent value="components" className="flex-1 mt-0">
              <ComponentsSidebar
                onAddComponent={handleAddComponent}
                stageType={activeStage?.type}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 mt-0">
              <PropertiesSidebar
                selectedComponent={selectedComponent}
                onUpdateComponent={(updates) => {
                  if (selectedComponentId && activeStageId) {
                    updateComponent(activeStageId, selectedComponentId, updates);
                  }
                }}
                onUpdateStage={(updates) => {
                  if (activeStageId) {
                    handleUpdateStage(activeStageId, updates);
                  }
                }}
                onDeleteComponent={handleDeleteComponent}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[#F5F5F5] overflow-auto">
          <div className={`min-h-full p-8 ${getViewportClasses()}`}>
            <div className="bg-white rounded-lg shadow-lg min-h-[800px] relative">
              {renderStagePreview()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}

      {showSmartComponents && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] overflow-hidden">
            <SmartComponentPalette
              onComponentSelect={handleSmartComponentSelect}
              stageType={activeStage?.type}
            />
          </div>
        </div>
      )}

      {inlineEditor && (
        <InlineEditor
          content={inlineEditor.content}
          type={inlineEditor.type}
          position={inlineEditor.position}
          onSave={handleInlineEditorSave}
          onCancel={handleInlineEditorCancel}
        />
      )}
    </div>
  );
};

export default LiveQuizEditor;
