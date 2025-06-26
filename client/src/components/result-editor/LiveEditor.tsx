
"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Palette,
  Save,
  RefreshCw,
  Eye,
  Code,
  Monitor,
  Smartphone
} from 'lucide-react';

interface LiveEditorProps {
  onSave: (config: any) => void;
}

export const LiveEditor: React.FC<LiveEditorProps> = ({ onSave }) => {
  const [config, setConfig] = useState({
    colors: {
      primary: '#B89B7A',
      secondary: '#aa6b5d',
      background: '#fffaf7',
      backgroundCard: '#ffffff',
      text: '#432818',
      textMuted: '#8F7A6A'
    },
    typography: {
      h1: 48,
      h2: 36,
      h3: 24,
      body: 16
    },
    layout: {
      padding: 24,
      borderRadius: 12,
      maxWidth: 1200
    },
    content: {
      title: 'Seu Estilo Descoberto',
      subtitle: 'Guia Personalizado de Estilo',
      description: 'Transforme sua imagem e conquiste mais confiança com um guia feito especialmente para você.',
      buttonText: 'Adquirir Agora',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    }
  });

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'content'>('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Aplicar mudanças em tempo real
  useEffect(() => {
    const applyStyles = () => {
      const root = document.documentElement;
      
      // Aplicar variáveis CSS
      root.style.setProperty('--live-primary', config.colors.primary);
      root.style.setProperty('--live-secondary', config.colors.secondary);
      root.style.setProperty('--live-background', config.colors.background);
      root.style.setProperty('--live-background-card', config.colors.backgroundCard);
      root.style.setProperty('--live-text', config.colors.text);
      root.style.setProperty('--live-text-muted', config.colors.textMuted);
      root.style.setProperty('--live-h1-size', `${config.typography.h1}px`);
      root.style.setProperty('--live-h2-size', `${config.typography.h2}px`);
      root.style.setProperty('--live-h3-size', `${config.typography.h3}px`);
      root.style.setProperty('--live-body-size', `${config.typography.body}px`);
      root.style.setProperty('--live-padding', `${config.layout.padding}px`);
      root.style.setProperty('--live-border-radius', `${config.layout.borderRadius}px`);
    };

    applyStyles();
  }, [config]);

  const updateConfig = useCallback((path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  }, []);

  const handleSave = () => {
    onSave(config);
  };

  const resetToDefaults = () => {
    setConfig({
      colors: {
        primary: '#B89B7A',
        secondary: '#aa6b5d',
        background: '#fffaf7',
        backgroundCard: '#ffffff',
        text: '#432818',
        textMuted: '#8F7A6A'
      },
      typography: {
        h1: 48,
        h2: 36,
        h3: 24,
        body: 16
      },
      layout: {
        padding: 24,
        borderRadius: 12,
        maxWidth: 1200
      },
      content: {
        title: 'Seu Estilo Descoberto',
        subtitle: 'Guia Personalizado de Estilo',
        description: 'Transforme sua imagem e conquiste mais confiança com um guia feito especialmente para você.',
        buttonText: 'Adquirir Agora',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar de Controles */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg mb-3">Editor Ao Vivo</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={resetToDefaults}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'colors', label: 'Cores', icon: Palette },
            { id: 'typography', label: 'Texto', icon: Type },
            { id: 'layout', label: 'Layout', icon: Square },
            { id: 'content', label: 'Conteúdo', icon: Code }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 p-2 text-xs font-medium flex flex-col items-center gap-1 ${
                activeTab === id 
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Controles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'colors' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">Cor Primária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.colors.primary}
                    onChange={(e) => updateConfig('colors.primary', e.target.value)}
                    className="w-12 h-8 border rounded"
                  />
                  <Input
                    value={config.colors.primary}
                    onChange={(e) => updateConfig('colors.primary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Cor Secundária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.colors.secondary}
                    onChange={(e) => updateConfig('colors.secondary', e.target.value)}
                    className="w-12 h-8 border rounded"
                  />
                  <Input
                    value={config.colors.secondary}
                    onChange={(e) => updateConfig('colors.secondary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.colors.background}
                    onChange={(e) => updateConfig('colors.background', e.target.value)}
                    className="w-12 h-8 border rounded"
                  />
                  <Input
                    value={config.colors.background}
                    onChange={(e) => updateConfig('colors.background', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Texto Principal</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.colors.text}
                    onChange={(e) => updateConfig('colors.text', e.target.value)}
                    className="w-12 h-8 border rounded"
                  />
                  <Input
                    value={config.colors.text}
                    onChange={(e) => updateConfig('colors.text', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'typography' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Título H1: {config.typography.h1}px
                </label>
                <Slider
                  value={[config.typography.h1]}
                  onValueChange={([value]) => updateConfig('typography.h1', value)}
                  min={24}
                  max={72}
                  step={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Título H2: {config.typography.h2}px
                </label>
                <Slider
                  value={[config.typography.h2]}
                  onValueChange={([value]) => updateConfig('typography.h2', value)}
                  min={18}
                  max={54}
                  step={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Título H3: {config.typography.h3}px
                </label>
                <Slider
                  value={[config.typography.h3]}
                  onValueChange={([value]) => updateConfig('typography.h3', value)}
                  min={16}
                  max={36}
                  step={1}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Texto: {config.typography.body}px
                </label>
                <Slider
                  value={[config.typography.body]}
                  onValueChange={([value]) => updateConfig('typography.body', value)}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>
            </>
          )}

          {activeTab === 'layout' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Padding: {config.layout.padding}px
                </label>
                <Slider
                  value={[config.layout.padding]}
                  onValueChange={([value]) => updateConfig('layout.padding', value)}
                  min={8}
                  max={48}
                  step={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Border Radius: {config.layout.borderRadius}px
                </label>
                <Slider
                  value={[config.layout.borderRadius]}
                  onValueChange={([value]) => updateConfig('layout.borderRadius', value)}
                  min={0}
                  max={32}
                  step={2}
                />
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">Título Principal</label>
                <Input
                  value={config.content.title}
                  onChange={(e) => updateConfig('content.title', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Subtítulo</label>
                <Input
                  value={config.content.subtitle}
                  onChange={(e) => updateConfig('content.subtitle', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Descrição</label>
                <textarea
                  value={config.content.description}
                  onChange={(e) => updateConfig('content.description', e.target.value)}
                  className="w-full p-2 border rounded h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Texto do Botão</label>
                <Input
                  value={config.content.buttonText}
                  onChange={(e) => updateConfig('content.buttonText', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">URL da Imagem</label>
                <Input
                  value={config.content.imageUrl}
                  onChange={(e) => updateConfig('content.imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <h3 className="font-medium">Preview em Tempo Real</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4 mr-1" />
              Desktop
            </Button>
            <Button
              size="sm"
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div 
            className={`transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
            style={{
              backgroundColor: config.colors.background,
              borderRadius: `${config.layout.borderRadius}px`,
              padding: `${config.layout.padding}px`,
              minHeight: '400px'
            }}
          >
            <div className="text-center mb-6">
              <h1 
                className="font-bold mb-2 transition-all duration-300"
                style={{
                  fontSize: `${config.typography.h1}px`,
                  background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {config.content.title}
              </h1>
              
              <h2 
                className="font-semibold mb-4 transition-all duration-300"
                style={{
                  fontSize: `${config.typography.h2}px`,
                  color: config.colors.secondary
                }}
              >
                {config.content.subtitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: config.colors.backgroundCard,
                    borderRadius: `${config.layout.borderRadius}px`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 
                    className="font-medium mb-2 transition-all duration-300"
                    style={{
                      fontSize: `${config.typography.h3}px`,
                      color: config.colors.text
                    }}
                  >
                    Sobre Seu Estilo
                  </h3>
                  
                  <p 
                    className="transition-all duration-300"
                    style={{
                      fontSize: `${config.typography.body}px`,
                      color: config.colors.text,
                      lineHeight: '1.6'
                    }}
                  >
                    {config.content.description}
                  </p>

                  <p 
                    className="text-sm mt-2 transition-all duration-300"
                    style={{
                      color: config.colors.textMuted
                    }}
                  >
                    Personalize seu visual com confiança
                  </p>
                </div>

                <button
                  className="w-full px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                    borderRadius: `${config.layout.borderRadius / 2}px`,
                    fontSize: `${config.typography.body}px`
                  }}
                >
                  {config.content.buttonText}
                </button>
              </div>

              <div className="text-center">
                <img
                  src={config.content.imageUrl}
                  alt="Estilo"
                  className="w-full max-w-sm mx-auto transition-all duration-300 hover:scale-105"
                  style={{
                    borderRadius: `${config.layout.borderRadius}px`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Mulheres Atendidas', value: '10.000+' },
                { label: 'Satisfação', value: '98%' },
                { label: 'Estilos', value: '8 Tipos' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: config.colors.backgroundCard,
                    borderRadius: `${config.layout.borderRadius / 2}px`
                  }}
                >
                  <div 
                    className="font-bold transition-all duration-300"
                    style={{
                      fontSize: `${config.typography.h3}px`,
                      color: config.colors.primary
                    }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-sm transition-all duration-300"
                    style={{
                      color: config.colors.textMuted
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEditor;
