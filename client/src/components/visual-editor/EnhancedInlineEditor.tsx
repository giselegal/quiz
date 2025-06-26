import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Check, Image, Link, Palette, Plus, Minus, Eye, Settings } from 'lucide-react';
import QuizQuestionEditor from './QuizQuestionEditor';

interface EnhancedInlineEditorProps {
  component: any;
  isVisible: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export const EnhancedInlineEditor: React.FC<EnhancedInlineEditorProps> = ({
  component,
  isVisible,
  onSave,
  onCancel,
  position
}) => {
  const [editData, setEditData] = useState(component?.data || {});
  const [editStyle, setEditStyle] = useState(component?.style || {});
  const [activeTab, setActiveTab] = useState('content');
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (component) {
      setEditData(component.data || {});
      setEditStyle(component.style || {});
    }
  }, [component]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onCancel]);

  if (!isVisible || !component) return null;

  // Função para lidar com o salvamento do QuizQuestionEditor
  const handleQuestionEditorSave = (questionData: any) => {
    handleDataChange('text', questionData.text);
    handleDataChange('options', questionData.options);
    handleDataChange('hasImages', questionData.hasImages);
    handleDataChange('multiSelect', questionData.multiSelect);
    handleDataChange('selectionLimit', questionData.selectionLimit);
    setShowQuestionEditor(false);
  };

  // Se o QuizQuestionEditor estiver aberto, renderizar apenas ele
  if (showQuestionEditor && component.type === 'options') {
    return (
      <QuizQuestionEditor
        questionData={editData}
        onSave={handleQuestionEditorSave}
        onCancel={() => setShowQuestionEditor(false)}
      />
    );
  }

  const handleSave = () => {
    onSave({
      ...component,
      data: editData,
      style: editStyle
    });
  };

  const handleDataChange = (key: string, value: any) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleStyleChange = (key: string, value: any) => {
    setEditStyle(prev => ({ ...prev, [key]: value }));
  };

  // Função para adicionar nova opção
  const addOption = () => {
    const currentOptions = editData.options || [];
    const newOption = {
      id: `opt-${Date.now()}`,
      text: 'Nova opção',
      value: `option-${currentOptions.length + 1}`,
      category: 'Natural'
    };
    handleDataChange('options', [...currentOptions, newOption]);
  };

  // Função para remover opção
  const removeOption = (index: number) => {
    const currentOptions = editData.options || [];
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    handleDataChange('options', updatedOptions);
  };

  // Função para atualizar opção específica
  const updateOption = (index: number, field: string, value: string) => {
    const currentOptions = [...(editData.options || [])];
    currentOptions[index] = { ...currentOptions[index], [field]: value };
    handleDataChange('options', currentOptions);
  };

  const renderContentEditor = () => {
    const { type } = component;

    switch (type) {
      case 'title':
      case 'subtitle':
      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium mb-2">Texto</Label>
              <Textarea
                value={editData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Digite o texto..."
                className="w-full text-sm min-h-[80px]"
                autoFocus
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium mb-2">URL da Imagem</Label>
              <Input
                value={editData.src || ''}
                onChange={(e) => handleDataChange('src', e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="text-sm"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs font-medium mb-2">Descrição</Label>
              <Input
                value={editData.alt || ''}
                onChange={(e) => handleDataChange('alt', e.target.value)}
                placeholder="Descrição da imagem"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium mb-2">Texto do Botão</Label>
              <Input
                value={editData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Texto do botão"
                className="text-sm"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs font-medium mb-2">Link/Ação</Label>
              <Input
                value={editData.href || editData.action || ''}
                onChange={(e) => handleDataChange('href', e.target.value)}
                placeholder="#"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium mb-2">Rótulo do Campo</Label>
              <Input
                value={editData.label || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                placeholder="Nome do campo"
                className="text-sm"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs font-medium mb-2">Placeholder</Label>
              <Input
                value={editData.placeholder || ''}
                onChange={(e) => handleDataChange('placeholder', e.target.value)}
                placeholder="Digite aqui..."
                className="text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editData.required || false}
                onCheckedChange={(checked) => handleDataChange('required', checked)}
              />
              <Label className="text-xs">Campo obrigatório</Label>
            </div>
          </div>
        );

      case 'options':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Opções da Questão</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => setShowQuestionEditor(true)}
                  className="h-6 px-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Editor Avançado
                </Button>
                <Button
                  size="sm"
                  onClick={addOption}
                  className="h-6 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(editData.options || []).map((option: any, index: number) => (
                <div key={option.id || index} className="border rounded p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Opção {String.fromCharCode(65 + index)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeOption(index)}
                      className="h-5 w-5 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Input
                    value={option.text || ''}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    placeholder="Texto da opção"
                    className="text-xs"
                  />

                  {editData.hasImages && (
                    <Input
                      value={option.image || ''}
                      onChange={(e) => updateOption(index, 'image', e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="text-xs"
                    />
                  )}

                  <select
                    value={option.category || 'Natural'}
                    onChange={(e) => updateOption(index, 'category', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1"
                  >
                    <option value="Natural">Natural</option>
                    <option value="Clássico">Clássico</option>
                    <option value="Contemporâneo">Contemporâneo</option>
                    <option value="Elegante">Elegante</option>
                    <option value="Romântico">Romântico</option>
                    <option value="Sexy">Sexy</option>
                    <option value="Dramático">Dramático</option>
                    <option value="Criativo">Criativo</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editData.hasImages || false}
                  onCheckedChange={(checked) => handleDataChange('hasImages', checked)}
                />
                <Label className="text-xs">Opções com imagens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editData.multiSelect || false}
                  onCheckedChange={(checked) => handleDataChange('multiSelect', checked)}
                />
                <Label className="text-xs">Seleção múltipla</Label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500 text-sm">
            Tipo de componente não suportado para edição inline
          </div>
        );
    }
  };

  const renderStyleEditor = () => {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-medium mb-2">Cor do Texto</Label>
            <div className="flex">
              <Input
                type="color"
                value={editStyle.color || '#432818'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-12 h-8 p-0 border-0"
              />
              <Input
                value={editStyle.color || '#432818'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="flex-1 ml-2 text-xs"
                placeholder="#432818"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium mb-2">Cor de Fundo</Label>
            <div className="flex">
              <Input
                type="color"
                value={editStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-12 h-8 p-0 border-0"
              />
              <Input
                value={editStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 ml-2 text-xs"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-medium mb-2">Tamanho da Fonte</Label>
            <select
              value={editStyle.fontSize || '1rem'}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="w-full text-xs border rounded px-2 py-1"
            >
              <option value="0.75rem">Pequeno (12px)</option>
              <option value="0.875rem">Médio (14px)</option>
              <option value="1rem">Normal (16px)</option>
              <option value="1.125rem">Grande (18px)</option>
              <option value="1.25rem">Maior (20px)</option>
              <option value="1.5rem">Título (24px)</option>
              <option value="1.75rem">Título Grande (28px)</option>
              <option value="2rem">Destaque (32px)</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-medium mb-2">Peso da Fonte</Label>
            <select
              value={editStyle.fontWeight || 'normal'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              className="w-full text-xs border rounded px-2 py-1"
            >
              <option value="300">Leve</option>
              <option value="normal">Normal</option>
              <option value="500">Médio</option>
              <option value="600">Semi-negrito</option>
              <option value="700">Negrito</option>
              <option value="800">Extra-negrito</option>
            </select>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium mb-2">Alinhamento</Label>
          <div className="flex gap-1">
            {[
              { value: 'left', label: 'Esquerda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Direita' },
              { value: 'justify', label: 'Justificado' }
            ].map(align => (
              <Button
                key={align.value}
                size="sm"
                variant={editStyle.textAlign === align.value ? 'default' : 'outline'}
                onClick={() => handleStyleChange('textAlign', align.value)}
                className="flex-1 text-xs h-7"
              >
                {align.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-medium mb-2">Margem</Label>
            <Input
              value={editStyle.margin || '0'}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              placeholder="0 0 1rem 0"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs font-medium mb-2">Padding</Label>
            <Input
              value={editStyle.padding || '0'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="0.5rem 1rem"
              className="text-xs"
            />
          </div>
        </div>
      </div>
    );
  };

  const editorStyle = {
    position: 'fixed' as const,
    left: Math.min(position.x, window.innerWidth - 350),
    top: Math.min(position.y, window.innerHeight - 500),
    zIndex: 1000,
  };

  return (
    <div
      ref={editorRef}
      style={editorStyle}
      className="bg-white border border-gray-200 rounded-lg shadow-xl w-80 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Edição Rápida</span>
          <Badge variant="secondary" className="text-xs">
            {component.type}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-3 py-2 text-xs font-medium ${
            activeTab === 'content'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Conteúdo
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 px-3 py-2 text-xs font-medium ${
            activeTab === 'style'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Estilo
        </button>
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto max-h-64">
        {activeTab === 'content' ? renderContentEditor() : renderStyleEditor()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-2 p-3 border-t bg-gray-50">
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="text-xs"
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          className="text-xs"
        >
          <Check className="h-3 w-3 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default EnhancedInlineEditor;