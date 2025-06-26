
"use client";
import { safeLocalStorage } from "@/utils/safeLocalStorage";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Palette, 
  Type, 
  Layout, 
  Save, 
  Eye, 
  RefreshCw,
  Monitor,
  Smartphone,
  Settings
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EditorConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    cardBg: string;
  };
  typography: {
    titleSize: number;
    subtitleSize: number;
    bodySize: number;
  };
  layout: {
    padding: number;
    borderRadius: number;
    spacing: number;
  };
  content: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
  };
}

const EditorCompleto: React.FC = () => {
  const [config, setConfig] = useState<EditorConfig>({
    colors: {
      primary: '#B89B7A',
      secondary: '#aa6b5d', 
      background: '#fffaf7',
      text: '#432818',
      cardBg: '#ffffff'
    },
    typography: {
      titleSize: 48,
      subtitleSize: 32,
      bodySize: 16
    },
    layout: {
      padding: 24,
      borderRadius: 12,
      spacing: 16
    },
    content: {
      title: 'Descubra Seu Estilo Único',
      subtitle: 'Guia Personalizado de Estilo',
      description: 'Transforme sua imagem e conquiste mais confiança com um guia feito especialmente para você.',
      buttonText: 'Adquirir Agora'
    }
  });
  
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'editor-live-styles';
    
    style.textContent = `
      .live-preview {
        background-color: ${config.colors.background};
        color: ${config.colors.text};
        padding: ${config.layout.padding}px;
        border-radius: ${config.layout.borderRadius}px;
      }
      
      .live-preview h1 {
        font-size: ${config.typography.titleSize}px;
        background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary});
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        margin-bottom: ${config.layout.spacing}px;
      }
      
      .live-preview h2 {
        font-size: ${config.typography.subtitleSize}px;
        color: ${config.colors.secondary};
        margin-bottom: ${config.layout.spacing}px;
      }
      
      .live-preview p {
        font-size: ${config.typography.bodySize}px;
        line-height: 1.6;
        margin-bottom: ${config.layout.spacing * 1.5}px;
      }
      
      .live-preview .card {
        background-color: ${config.colors.cardBg};
        border-radius: ${config.layout.borderRadius}px;
        padding: ${config.layout.padding}px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .live-preview .btn {
        background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary});
        color: white;
        padding: ${config.layout.padding / 2}px ${config.layout.padding}px;
        border-radius: ${config.layout.borderRadius / 2}px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .live-preview .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
    `;

    const oldStyle = document.getElementById('editor-live-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    document.head.appendChild(style);
    
    return () => {
      style.remove();
    };
  }, [config]);

  const updateConfig = (section: keyof EditorConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    try {
      safeLocalStorage.setItem('editorConfig', JSON.stringify(config));
      safeLocalStorage.setItem('pageEditorConfig', JSON.stringify(config));
      toast({
        title: "Configuração salva!",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetConfig = () => {
    setConfig({
      colors: {
        primary: '#B89B7A',
        secondary: '#aa6b5d',
        background: '#fffaf7',
        text: '#432818',
        cardBg: '#ffffff'
      },
      typography: {
        titleSize: 48,
        subtitleSize: 32,
        bodySize: 16
      },
      layout: {
        padding: 24,
        borderRadius: 12,
        spacing: 16
      },
      content: {
        title: 'Descubra Seu Estilo Único',
        subtitle: 'Guia Personalizado de Estilo',
        description: 'Transforme sua imagem e conquiste mais confiança com um guia feito especialmente para você.',
        buttonText: 'Adquirir Agora'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editor Visual Completo</h1>
            <p className="text-gray-600">Edite em tempo real e veja as mudanças instantaneamente</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
            >
              {previewMode === 'desktop' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              {previewMode === 'desktop' ? 'Mobile' : 'Desktop'}
            </Button>
            
            <Button variant="outline" onClick={resetConfig}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-80 bg-white border-r p-6 overflow-y-auto max-h-screen">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">
                <Palette className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="typography">
                <Type className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="layout">
                <Layout className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="content">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <div>
                <Label>Cor Primária</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={config.colors.primary}
                    onChange={(e) => updateConfig('colors', 'primary', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={config.colors.primary}
                    onChange={(e) => updateConfig('colors', 'primary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <div>
                <Label>Tamanho do Título: {config.typography.titleSize}px</Label>
                <Slider
                  value={[config.typography.titleSize]}
                  onValueChange={([value]) => updateConfig('typography', 'titleSize', value)}
                  min={24}
                  max={72}
                  step={2}
                  className="mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div>
                <Label>Padding: {config.layout.padding}px</Label>
                <Slider
                  value={[config.layout.padding]}
                  onValueChange={([value]) => updateConfig('layout', 'padding', value)}
                  min={8}
                  max={64}
                  step={4}
                  className="mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={config.content.title}
                  onChange={(e) => updateConfig('content', 'title', e.target.value)}
                  className="mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 p-6">
          <div className={`mx-auto ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'}`}>
            <div className="live-preview">
              <div className="card">
                <h1 className="font-bold">{config.content.title}</h1>
                <h2 className="font-semibold">{config.content.subtitle}</h2>
                <p>{config.content.description}</p>
                
                <button className="btn w-full md:w-auto">
                  {config.content.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCompleto;
