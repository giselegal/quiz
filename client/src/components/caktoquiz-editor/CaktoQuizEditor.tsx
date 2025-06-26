import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Undo2, Redo2, Play, Settings, Menu, X, Eye, Navigation, Upload, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepsSidebar } from './components/StepsSidebar'
import { ComponentsSidebar } from './components/ComponentsSidebar'
import { Canvas } from './components/Canvas'
import { PropertiesPanel } from './components/PropertiesPanel'
import { BottomSheet } from './components/BottomSheet'
import { MobileNavbar } from './components/MobileNavbar'
import { EmptyCanvasState } from './components/EmptyCanvasState'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useQuizEditor } from './hooks/useQuizEditor'

interface CaktoQuizEditorProps {
  className?: string
}

export const CaktoQuizEditor: React.FC<CaktoQuizEditorProps> = ({ className = '' }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [activeTab, setActiveTab] = useState<'steps' | 'components'>('steps')
  const [activeMobileTab, setActiveMobileTab] = useState<'steps' | 'components' | 'properties'>('components')
  const [activeMainTab, setActiveMainTab] = useState<'builder' | 'flow' | 'design' | 'leads' | 'config'>('builder')
  const [isPublishing, setIsPublishing] = useState(false)

  // Header configuration state
  const [headerConfig, setHeaderConfig] = useState({
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    showLogo: true,
    showProgress: true,
    showBackButton: true
  })
  
  const {
    quizData,
    selectedComponent,
    history,
    isLoading,
    isSaving,
    canUndo,
    canRedo,
    updateComponent,
    addComponent,
    removeComponent,
    undo,
    redo,
    saveQuiz,
    previewQuiz
  } = useQuizEditor()

  const handleSave = useCallback(async () => {
    await saveQuiz()
  }, [saveQuiz])

  const handlePreview = useCallback(() => {
    previewQuiz()
  }, [previewQuiz])

  const handlePublish = useCallback(async () => {
    setIsPublishing(true)
    try {
      // Simulate publish process
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Quiz published!')
    } catch (error) {
      console.error('Error publishing quiz:', error)
    } finally {
      setIsPublishing(false)
    }
  }, [])

  // Check if canvas has components
  const hasComponents = false // Temporary fix for demo

  return (
    <>
      {/* Desktop Layout */}
      <div className={`hidden md:flex h-screen bg-zinc-950 text-white flex-col ${className}`}>
        {/* Navbar - Estilo CaktoQuiz */}
        <header className="h-16 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800 px-6 z-50">
          <div className="flex items-center justify-between h-full">
            {/* Esquerda */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">CaktoQuiz Editor</h1>
            
            <div className="hidden md:flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={!canUndo}
                onClick={undo}
                className="text-zinc-400 hover:text-white disabled:opacity-50"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={!canRedo}
                onClick={redo}
                className="text-zinc-400 hover:text-white disabled:opacity-50"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Centro - Abas */}
          <div className="hidden md:flex items-center bg-zinc-800 rounded-lg p-1">
            <Button 
              variant={activeMainTab === 'builder' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveMainTab('builder')}
              className={activeMainTab === 'builder' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}
            >
              Construtor
            </Button>
            <Button 
              variant={activeMainTab === 'flow' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveMainTab('flow')}
              className={activeMainTab === 'flow' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}
            >
              Fluxo
            </Button>
            <Button 
              variant={activeMainTab === 'design' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveMainTab('design')}
              className={activeMainTab === 'design' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}
            >
              Design
            </Button>
            <Button 
              variant={activeMainTab === 'leads' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveMainTab('leads')}
              className={activeMainTab === 'leads' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}
            >
              Leads
            </Button>
            <Button 
              variant={activeMainTab === 'config' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveMainTab('config')}
              className={activeMainTab === 'config' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}
            >
              Config
            </Button>
          </div>

          {/* Direita */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePreview} className="text-zinc-400 hover:text-white">
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hidden sm:flex">
              <Navigation className="w-4 h-4 mr-2" />
              Waypoints
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hidden sm:flex">
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isSaving}
              onClick={handleSave}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">Salvar</span>
            </Button>
            <Button 
              size="sm" 
              disabled={isPublishing}
              onClick={handlePublish}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">Publicar</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white lg:hidden"
              onClick={() => setIsPropertiesPanelOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop: Steps Sidebar */}
          <StepsSidebar 
            className="w-[250px] md:flex hidden"
            quizData={quizData}
            onStepSelect={(stepId) => console.log('Step selected:', stepId)}
          />

          {/* Desktop: Components Sidebar */}
          <ComponentsSidebar 
            className="w-[280px] md:flex hidden"
            onComponentAdd={(component) => addComponent(component)}
          />

          {/* Canvas - Main Editor Area */}
          <div className="flex-1 bg-zinc-800">
            {hasComponents ? (
              <Canvas 
                className="h-full"
                quizData={quizData}
                selectedComponent={selectedComponent}
                onComponentSelect={(component) => console.log('Component selected:', component)}
                onComponentUpdate={updateComponent}
                onComponentRemove={removeComponent}
              />
            ) : (
              <EmptyCanvasState onAddComponent={addComponent} />
            )}
          </div>

          {/* Desktop: Properties Panel */}
          <div className="w-[380px] lg:flex hidden">
            <PropertiesPanel 
              selectedComponent={selectedComponent}
              headerConfig={headerConfig}
              onUpdateComponent={(id, updates) => console.log('Update component:', id, updates)}
              onUpdateHeaderConfig={(updates) => setHeaderConfig(prev => ({ ...prev, ...updates }))}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen bg-zinc-950 text-white">
        <MobileNavbar
          onMenuClick={() => setShowBottomSheet(true)}
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          isSaving={isSaving}
          isPublishing={isPublishing}
        />
        
        <div className="flex-1 overflow-hidden bg-zinc-800">
          {hasComponents ? (
            <Canvas 
              className="h-full"
              quizData={quizData}
              selectedComponent={selectedComponent}
              onComponentSelect={(component) => console.log('Component selected:', component)}
              onComponentUpdate={updateComponent}
              onComponentRemove={removeComponent}
              viewMode="mobile"
            />
          ) : (
            <EmptyCanvasState onAddComponent={(data) => addComponent(data)} />
          )}
        </div>

        {/* Mobile Bottom Sheet */}
        <BottomSheet 
          isOpen={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          title="Editor"
        >
          <Tabs value={activeMobileTab} onValueChange={(value) => setActiveMobileTab(value as any)} className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
              <TabsTrigger value="steps" className="text-zinc-300 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
                Etapas
              </TabsTrigger>
              <TabsTrigger value="components" className="text-zinc-300 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
                Componentes
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-zinc-300 data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
                Propriedades
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps" className="mt-0 h-[50vh] overflow-hidden">
              <StepsSidebar 
                className="h-full"
                quizData={quizData}
                onStepSelect={(stepId) => {
                  console.log('Step selected:', stepId)
                  setShowBottomSheet(false)
                }}
              />
            </TabsContent>
            
            <TabsContent value="components" className="mt-0 h-[50vh] overflow-hidden">
              <ComponentsSidebar 
                className="h-full"
                onComponentAdd={(component) => {
                  addComponent(component)
                  setShowBottomSheet(false)
                }}
              />
            </TabsContent>
            
            <TabsContent value="properties" className="mt-0 h-[50vh] overflow-hidden">
              <div className="h-full">
                <PropertiesPanel 
                  selectedComponent={selectedComponent}
                  headerConfig={headerConfig}
                  onUpdateComponent={(id, updates) => console.log('Update component:', id, updates)}
                  onUpdateHeaderConfig={(updates) => setHeaderConfig(prev => ({ ...prev, ...updates }))}
                />
              </div>
            </TabsContent>
          </Tabs>
        </BottomSheet>
      </div>
    </>
  )
}