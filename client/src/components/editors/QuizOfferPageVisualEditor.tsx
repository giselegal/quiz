
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Save, Eye, Settings, Palette } from 'lucide-react';
import QuizOfferPage from '@/components/QuizOfferPage';

interface OfferPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  price: string;
  regularPrice: string;
  ctaText: string;
  ctaUrl: string;
  benefits: string[];
  testimonials: {
    name: string;
    text: string;
    rating: number;
  }[];
}

const QuizOfferPageVisualEditor: React.FC = () => {
  const [config, setConfig] = useState<OfferPageConfig>({
    heroTitle: 'Descubra Seu Estilo Pessoal e Transforme Seu Guarda-Roupa',
    heroSubtitle: 'Um teste exclusivo que revela seu estilo autêntico e como expressar sua verdadeira essência através das roupas que você escolhe.',
    price: '39,00',
    regularPrice: '175,00',
    ctaText: 'Quero o Quiz Completo + Bônus',
    ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    benefits: [
      'Descubra seu estilo pessoal com análises profundas',
      'Identifique as roupas essenciais para seu estilo',
      'Adapte seu visual às suas características faciais',
      'Ganhe confiança em suas escolhas de moda'
    ],
    testimonials: [
      {
        name: 'Maria Silva',
        text: 'O quiz me ajudou a descobrir meu verdadeiro estilo!',
        rating: 5
      },
      {
        name: 'Ana Santos',
        text: 'Finalmente entendo como me vestir bem.',
        rating: 5
      }
    ]
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleConfigChange = (key: keyof OfferPageConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...config.benefits];
    newBenefits[index] = value;
    handleConfigChange('benefits', newBenefits);
  };

  const addBenefit = () => {
    handleConfigChange('benefits', [...config.benefits, 'Novo benefício']);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = config.benefits.filter((_, i) => i !== index);
    handleConfigChange('benefits', newBenefits);
  };

  const saveConfig = () => {
    console.log('Salvando configuração:', config);
    // Aqui você pode implementar a lógica de salvamento
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Editor Visual - Quiz Offer Page
            </h1>
            <p className="text-sm text-gray-600">
              Edite visualmente a página de oferta do quiz
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Modo Edição' : 'Preview'}
            </Button>
            
            <Button onClick={saveConfig} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-73px)]">
        {/* Editor Panel */}
        {!isPreviewMode && (
          <>
            <ResizablePanel defaultSize={30} minSize={25}>
              <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                      <TabsTrigger value="pricing">Preços</TabsTrigger>
                      <TabsTrigger value="style">Estilo</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="heroTitle">Título Principal</Label>
                        <Textarea
                          id="heroTitle"
                          value={config.heroTitle}
                          onChange={(e) => handleConfigChange('heroTitle', e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Subtítulo</Label>
                        <Textarea
                          id="heroSubtitle"
                          value={config.heroSubtitle}
                          onChange={(e) => handleConfigChange('heroSubtitle', e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Benefícios</Label>
                        {config.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={benefit}
                              onChange={(e) => handleBenefitChange(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeBenefit(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addBenefit}>
                          + Adicionar Benefício
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pricing" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Preço Principal</Label>
                        <Input
                          id="price"
                          value={config.price}
                          onChange={(e) => handleConfigChange('price', e.target.value)}
                          placeholder="39,00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="regularPrice">Preço Original</Label>
                        <Input
                          id="regularPrice"
                          value={config.regularPrice}
                          onChange={(e) => handleConfigChange('regularPrice', e.target.value)}
                          placeholder="175,00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ctaText">Texto do Botão</Label>
                        <Input
                          id="ctaText"
                          value={config.ctaText}
                          onChange={(e) => handleConfigChange('ctaText', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ctaUrl">URL do Botão</Label>
                        <Input
                          id="ctaUrl"
                          value={config.ctaUrl}
                          onChange={(e) => handleConfigChange('ctaUrl', e.target.value)}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="style" className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                          <Palette className="w-4 h-4" />
                          <Label>Configurações de Estilo</Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Configurações de cores e tipografia em desenvolvimento.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
          </>
        )}
        
        {/* Preview Panel */}
        <ResizablePanel defaultSize={isPreviewMode ? 100 : 70}>
          <div className="h-full bg-white overflow-auto">
            <QuizOfferPage />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QuizOfferPageVisualEditor;
