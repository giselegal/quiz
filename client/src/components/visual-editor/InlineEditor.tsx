import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Check, Image, Link, Palette } from 'lucide-react';

interface InlineEditorProps {
  component: any;
  isVisible: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  component,
  isVisible,
  onSave,
  onCancel,
  position
}) => {
  const [editData, setEditData] = useState(component?.data || {});
  const [editStyle, setEditStyle] = useState(component?.style || {});
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

  const handleSave = () => {
    onSave({
      ...component,
      data: editData,
      style: editStyle
    });
  };

  const handleDataChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (field: string, value: any) => {
    setEditStyle((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderEditor = () => {
    switch (component.type) {
      case 'title':
      case 'subtitle':
      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Texto</label>
              <Textarea
                value={editData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Digite o texto..."
                className="min-h-[60px] resize-none"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Cor</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={editStyle.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                  <Input
                    value={editStyle.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tamanho</label>
                <Input
                  value={editStyle.fontSize || '1rem'}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  placeholder="1rem"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">URL da Imagem</label>
              <Input
                value={editData.src || ''}
                onChange={(e) => handleDataChange('src', e.target.value)}
                placeholder="https://..."
                className="h-8"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Texto Alternativo</label>
              <Input
                value={editData.alt || ''}
                onChange={(e) => handleDataChange('alt', e.target.value)}
                placeholder="Descrição da imagem"
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Largura</label>
                <Input
                  value={editStyle.width || 'auto'}
                  onChange={(e) => handleStyleChange('width', e.target.value)}
                  placeholder="auto"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Altura</label>
                <Input
                  value={editStyle.height || 'auto'}
                  onChange={(e) => handleStyleChange('height', e.target.value)}
                  placeholder="auto"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Texto do Botão</label>
              <Input
                value={editData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Clique aqui"
                className="h-8"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Link (URL)</label>
              <Input
                value={editData.url || '#'}
                onChange={(e) => handleDataChange('url', e.target.value)}
                placeholder="#"
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Cor de Fundo</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={editStyle.backgroundColor || '#B89B7A'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                  <Input
                    value={editStyle.backgroundColor || '#B89B7A'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Cor do Texto</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={editStyle.color || '#ffffff'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                  <Input
                    value={editStyle.color || '#ffffff'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Label do Campo</label>
              <Input
                value={editData.label || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                placeholder="Nome do campo"
                className="h-8"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Placeholder</label>
              <Input
                value={editData.placeholder || ''}
                onChange={(e) => handleDataChange('placeholder', e.target.value)}
                placeholder="Digite aqui..."
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.required || false}
                onChange={(e) => handleDataChange('required', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-xs font-medium text-gray-600">Campo obrigatório</label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500 text-sm">
            Editor não disponível para este tipo de componente
          </div>
        );
    }
  };

  return (
    <div
      ref={editorRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px]"
      style={{
        left: Math.min(position.x, window.innerWidth - 420),
        top: Math.min(position.y, window.innerHeight - 300),
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {component.type}
          </Badge>
          <span className="text-sm font-medium text-gray-700">Edição Rápida</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {renderEditor()}

      <div className="flex gap-2 mt-4 pt-3 border-t">
        <Button
          onClick={handleSave}
          size="sm"
          className="flex-1 h-8"
        >
          <Check className="h-3 w-3 mr-1" />
          Salvar
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="flex-1 h-8"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default InlineEditor;