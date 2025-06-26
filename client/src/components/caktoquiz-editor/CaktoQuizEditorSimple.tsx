import React, { useState } from 'react'
import { Monitor, Smartphone, Settings, Save, Play, MoreVertical, Plus, Type, Image, MousePointer, CheckSquare, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Componente BottomSheet para mobile
const BottomSheet = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-xl border-t border-zinc-700 max-h-[80vh]">
        <div className="w-12 h-1 bg-zinc-600 rounded mx-auto mt-3 mb-4" />
        {children}
      </div>
    </div>
  )
}

// MobileNavbar
const MobileNavbar = ({ onBottomSheetOpen }: { onBottomSheetOpen: () => void }) => (
  <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
        <Layout className="w-4 h-4 text-white" />
      </div>
      <span className="font-semibold text-zinc-100">CaktoQuiz</span>
    </div>
    
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="text-zinc-300">
        <Save className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-zinc-300">
        <Play className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBottomSheetOpen}
        className="text-zinc-300"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  </div>
)

// EmptyCanvasState
const EmptyCanvasState = ({ onAddComponent }: { onAddComponent: (type: string) => void }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center space-y-6 max-w-sm">
      <div className="w-16 h-16 bg-zinc-700 rounded-xl mx-auto flex items-center justify-center">
        <Plus className="w-8 h-8 text-zinc-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-zinc-100 mb-2">Adicione seu primeiro componente</h3>
        <p className="text-zinc-400 text-sm">Escolha um componente abaixo para começar a construir seu quiz</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent('heading')}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 flex-col h-auto py-3"
        >
          <Type className="w-4 h-4 mb-1" />
          Título
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent('image')}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 flex-col h-auto py-3"
        >
          <Image className="w-4 h-4 mb-1" />
          Imagem
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent('button')}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 flex-col h-auto py-3"
        >
          <MousePointer className="w-4 h-4 mb-1" />
          Botão
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddComponent('options')}
          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 flex-col h-auto py-3"
        >
          <CheckSquare className="w-4 h-4 mb-1" />
          Opções
        </Button>
      </div>
    </div>
  </div>
)

// Canvas Principal
const Canvas = ({ viewMode }: { viewMode: 'mobile' | 'desktop' }) => {
  const isMobile = viewMode === 'mobile'
  
  return (
    <div className="flex-1 bg-zinc-800 flex flex-col">
      {/* Header do Canvas */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300">Preview {isMobile ? 'Mobile' : 'Desktop'}</span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Monitor className="w-3 h-3 mr-1" />
            Desktop
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className={`mx-auto bg-white rounded-xl shadow-2xl overflow-hidden ${
            isMobile ? 'max-w-[400px]' : 'max-w-[800px]'
          }`}>
            {/* Quiz Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <img 
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
                <div className="flex items-center gap-2 text-white">
                  <span className="text-sm font-medium">1/10</span>
                  <div className="w-20 h-2 bg-white/20 rounded-full">
                    <div className="h-full bg-white rounded-full w-1/5" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Canvas Content Area */}
            <div className="p-6 min-h-[400px]">
              <EmptyCanvasState onAddComponent={(type) => console.log('Add component:', type)} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// Componente Principal
export default function CaktoQuizEditorSimple() {
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop')

  const stepItems = [
    { id: '1', name: 'Introdução', type: 'intro', progress: 100 },
    { id: '2', name: 'Pergunta 1', type: 'question', progress: 0 },
    { id: '3', name: 'Pergunta 2', type: 'question', progress: 0 },
    { id: '4', name: 'Resultado', type: 'result', progress: 0 }
  ]

  const componentItems = [
    { id: 'heading', name: 'Título', icon: Type },
    { id: 'image', name: 'Imagem', icon: Image },
    { id: 'button', name: 'Botão', icon: MousePointer },
    { id: 'options', name: 'Opções', icon: CheckSquare }
  ]

  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      {/* Mobile Navbar */}
      <MobileNavbar onBottomSheetOpen={() => setShowBottomSheet(true)} />

      {/* Desktop Header */}
      <div className="hidden md:flex bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800 px-6 py-3 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-100">CaktoQuiz Editor</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-zinc-100">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Play className="w-4 h-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: Steps Sidebar */}
        <div className="hidden md:flex w-[250px] bg-zinc-900 border-r border-zinc-800">
          <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-100 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Etapas do Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stepItems.map((step, index) => (
                <div key={step.id} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer hover:bg-zinc-750">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <span className="text-zinc-200 text-sm font-medium">{step.name}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Desktop: Components Sidebar */}
        <div className="hidden md:flex w-[280px] bg-zinc-900 border-r border-zinc-800">
          <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-100 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Componentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {componentItems.map((component) => (
                <Button
                  key={component.id}
                  variant="ghost"
                  className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  onClick={() => console.log('Add component:', component.id)}
                >
                  <component.icon className="w-4 h-4 mr-2" />
                  {component.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <Canvas viewMode={viewMode} />

        {/* Desktop: Properties Panel */}
        <div className="hidden lg:flex w-[380px] bg-zinc-900 border-l border-zinc-800">
          <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-100 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Propriedades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-zinc-400 text-sm">
                Selecione um componente para editar suas propriedades
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <BottomSheet isOpen={showBottomSheet} onClose={() => setShowBottomSheet(false)}>
        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800 border-zinc-700">
            <TabsTrigger value="steps" className="data-[state=active]:bg-amber-600">Etapas</TabsTrigger>
            <TabsTrigger value="components" className="data-[state=active]:bg-amber-600">Componentes</TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-amber-600">Propriedades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="mt-0 h-[50vh] overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                {stepItems.map((step, index) => (
                  <div key={step.id} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <span className="text-zinc-200 text-sm font-medium">{step.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="components" className="mt-0 h-[50vh] overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                {componentItems.map((component) => (
                  <Button
                    key={component.id}
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => {
                      console.log('Add component:', component.id)
                      setShowBottomSheet(false)
                    }}
                  >
                    <component.icon className="w-4 h-4 mr-2" />
                    {component.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="properties" className="mt-0 h-[50vh] overflow-hidden">
            <div className="p-4 text-center text-zinc-400 text-sm">
              Selecione um componente para editar suas propriedades
            </div>
          </TabsContent>
        </Tabs>
      </BottomSheet>
    </div>
  )
}