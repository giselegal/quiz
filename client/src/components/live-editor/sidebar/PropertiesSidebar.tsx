
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  Settings,
  Palette,
  Type,
  Image as ImageIcon,
  Link
} from 'lucide-react';
import { EditorComponent, EditorStage } from '@/hooks/useLiveEditor';

interface PropertiesSidebarProps {
  selectedComponent?: EditorComponent;
  stage?: EditorStage;
  onUpdateComponent: (updates: Partial<EditorComponent>) => void;
  onUpdateStage: (updates: Partial<EditorStage>) => void;
  onDeleteComponent: () => void;
}

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  selectedComponent,
  stage,
  onUpdateComponent,
  onUpdateStage,
  onDeleteComponent
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'settings'>('content');

  const updateContent = (key: string, value: any) => {
    if (selectedComponent) {
      onUpdateComponent({
        content: { ...selectedComponent.content, [key]: value }
      });
    }
  };

  const updateStyle = (key: string, value: any) => {
    if (selectedComponent) {
      onUpdateComponent({
        style: { ...selectedComponent.style, [key]: value }
      });
    }
  };

  const renderContentEditor = () => {
    if (!selectedComponent) return null;

    const {  } = selectedComponent;

    return (
      <div className="space-y-4">
        {/* Text Content */}
        {(['heading', 'text', 'button', 'question-title'].includes(selectedComponent.type)) && (
          <div>
            <Label className="text-gray-300">Texto</Label>
            <Textarea
              value={selectedComponent.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Digite o texto..."
              className="bg-[#323749] border-gray-600 text-gray-200"
            />
          </div>
        )}

        {/* Hero Content */}
        {selectedComponent.type === 'hero' && (
          <>
            <div>
              <Label className="text-gray-300">Título Principal</Label>
              <Input
                value={selectedComponent.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                placeholder="Título principal..."
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">Subtítulo</Label>
              <Textarea
                value={selectedComponent.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                placeholder="Subtítulo..."
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">Texto do Botão</Label>
              <Input
                value={selectedComponent.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Texto do botão..."
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
          </>
        )}

        {/* Image Content */}
        {selectedComponent.type === 'image' && (
          <>
            <div>
              <Label className="text-gray-300">URL da Imagem</Label>
              <Input
                value={selectedComponent.content.src || ''}
                onChange={(e) => updateContent('src', e.target.value)}
                placeholder="https://..."
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">Texto Alternativo</Label>
              <Input
                value={selectedComponent.content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
                placeholder="Descreva a imagem..."
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
          </>
        )}

        {/* Pricing Content */}
        {selectedComponent.type === 'pricing' && (
          <>
            <div>
              <Label className="text-gray-300">Título da Oferta</Label>
              <Input
                value={selectedComponent.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                placeholder="Título da oferta..."
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">Preço</Label>
              <Input
                value={selectedComponent.content.price || ''}
                onChange={(e) => updateContent('price', e.target.value)}
                placeholder="197"
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">Preço Original</Label>
              <Input
                value={selectedComponent.content.originalPrice || ''}
                onChange={(e) => updateContent('originalPrice', e.target.value)}
                placeholder="397"
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">Texto do Botão</Label>
              <Input
                value={selectedComponent.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Comprar Agora"
                className="bg-[#323749] border-gray-600 text-gray-200"
              />
            </div>
          </>
        )}

        {/* Question Content */}
        {selectedComponent.type === 'question-title' && (
          <div>
            <Label className="text-gray-300">Número de Seleções</Label>
            <Input
              type="number"
              value={selectedComponent.content.selections || 3}
              onChange={(e) => updateContent('selections', parseInt(e.target.value))}
              min="1"
              max="6"
              className="bg-[#323749] border-gray-600 text-gray-200"
            />
          </div>
        )}
      </div>
    );
  };

  const renderStyleEditor = () => {
    if (!selectedComponent) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-gray-300">Cor do Texto</Label>
          <Input
            type="color"
            value={selectedComponent.style.color || '#432818'}
            onChange={(e) => updateStyle('color', e.target.value)}
            className="bg-[#323749] border-gray-600"
          />
        </div>
        
        <div>
          <Label className="text-gray-300">Cor de Fundo</Label>
          <Input
            type="color"
            value={selectedComponent.style.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="bg-[#323749] border-gray-600"
          />
        </div>

        <div>
          <Label className="text-gray-300">Tamanho da Fonte</Label>
          <Input
            value={selectedComponent.style.fontSize || '16px'}
            onChange={(e) => updateStyle('fontSize', e.target.value)}
            placeholder="16px"
            className="bg-[#323749] border-gray-600 text-gray-200"
          />
        </div>

        <div>
          <Label className="text-gray-300">Padding</Label>
          <Input
            value={selectedComponent.style.padding || '16px'}
            onChange={(e) => updateStyle('padding', e.target.value)}
            placeholder="16px"
            className="bg-[#323749] border-gray-600 text-gray-200"
          />
        </div>

        <div>
          <Label className="text-gray-300">Margin</Label>
          <Input
            value={selectedComponent.style.margin || '0px'}
            onChange={(e) => updateStyle('margin', e.target.value)}
            placeholder="0px"
            className="bg-[#323749] border-gray-600 text-gray-200"
          />
        </div>

        <div>
          <Label className="text-gray-300">Border Radius</Label>
          <Input
            value={selectedComponent.style.borderRadius || '8px'}
            onChange={(e) => updateStyle('borderRadius', e.target.value)}
            placeholder="8px"
            className="bg-[#323749] border-gray-600 text-gray-200"
          />
        </div>
      </div>
    );
  };

  if (!selectedComponent && !stage) {
    return (
      <div className="h-full flex flex-col bg-[#252A3A] border-l border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Propriedades</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Selecione um componente</p>
            <p className="text-sm">para editar suas propriedades</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#252A3A] border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Propriedades</h2>
          {selectedComponent && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDeleteComponent}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {selectedComponent && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {selectedComponent.type}
            </Badge>
          </div>
        )}
      </div>

      {selectedComponent && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex">
              {[
                { id: 'content', label: 'Conteúdo', icon: Type },
                { id: 'style', label: 'Estilo', icon: Palette },
                { id: 'settings', label: 'Config', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#B89B7A] border-[#B89B7A]'
                        : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'content' && renderContentEditor()}
            {activeTab === 'style' && renderStyleEditor()}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="text-sm text-gray-400">
                  Configurações avançadas em breve...
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertiesSidebar;
