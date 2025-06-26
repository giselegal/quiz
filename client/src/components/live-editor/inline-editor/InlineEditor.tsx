
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  Underline, 
  Palette, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Save,
  X,
  Wand2
} from 'lucide-react';

interface InlineEditorProps {
  content: any;
  type: 'text' | 'heading' | 'button' | 'image';
  position: { x: number; y: number };
  onSave: (content: any) => void;
  onCancel: () => void;
  onAIEnhance?: (text: string) => Promise<string>;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  content,
  type,
  position,
  onSave,
  onCancel,
  onAIEnhance
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Position the editor near the clicked element
    if (editorRef.current) {
      const editor = editorRef.current;
      const rect = editor.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = position.x;
      let top = position.y + 10;

      // Adjust if editor would go off-screen
      if (left + rect.width > viewportWidth) {
        left = viewportWidth - rect.width - 20;
      }
      if (top + rect.height > viewportHeight) {
        top = position.y - rect.height - 10;
      }

      editor.style.left = `${Math.max(10, left)}px`;
      editor.style.top = `${Math.max(10, top)}px`;
    }
  }, [position]);

  const handleAIEnhance = async () => {
    if (!onAIEnhance || !editedContent.text) return;
    
    setIsAIEnhancing(true);
    try {
      const enhanced = await onAIEnhance(editedContent.text);
      setEditedContent({ ...editedContent, text: enhanced });
    } catch (error) {
      console.error('Erro ao melhorar com IA:', error);
    } finally {
      setIsAIEnhancing(false);
    }
  };

  const renderEditor = () => {
    switch (type) {
      case 'text':
      case 'heading':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <Button size="sm" variant="ghost">
                <Bold className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Italic className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Underline className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button size="sm" variant="ghost">
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <AlignRight className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button size="sm" variant="ghost">
                <Type className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Palette className="w-4 h-4" />
              </Button>
            </div>
            
            <Textarea
              value={editedContent.text || ''}
              onChange={(e) => setEditedContent({ ...editedContent, text: e.target.value })}
              placeholder={type === 'heading' ? 'Digite o título...' : 'Digite o texto...'}
              className="min-h-[100px] resize-none"
              autoFocus
            />

            {onAIEnhance && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAIEnhance}
                disabled={isAIEnhancing}
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isAIEnhancing ? 'Melhorando...' : 'Melhorar com IA'}
              </Button>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="space-y-3">
            <Input
              value={editedContent.text || ''}
              onChange={(e) => setEditedContent({ ...editedContent, text: e.target.value })}
              placeholder="Texto do botão..."
              autoFocus
            />
            
            <Input
              value={editedContent.url || ''}
              onChange={(e) => setEditedContent({ ...editedContent, url: e.target.value })}
              placeholder="URL do link..."
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Cor de fundo</label>
                <Input
                  type="color"
                  value={editedContent.backgroundColor || '#B89B7A'}
                  onChange={(e) => setEditedContent({ ...editedContent, backgroundColor: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Cor do texto</label>
                <Input
                  type="color"
                  value={editedContent.textColor || '#ffffff'}
                  onChange={(e) => setEditedContent({ ...editedContent, textColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <Input
              value={editedContent.src || ''}
              onChange={(e) => setEditedContent({ ...editedContent, src: e.target.value })}
              placeholder="URL da imagem..."
              autoFocus
            />
            
            <Input
              value={editedContent.alt || ''}
              onChange={(e) => setEditedContent({ ...editedContent, alt: e.target.value })}
              placeholder="Texto alternativo..."
            />

            {editedContent.src && (
              <div className="border rounded p-2">
                <img 
                  src={editedContent.src} 
                  alt={editedContent.alt || 'Preview'}
                  className="max-w-full h-auto max-h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return <div>Tipo de editor não suportado</div>;
    }
  };

  return (
    <div
      ref={editorRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[300px] max-w-[400px]"
      style={{ position: 'fixed' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-[#432818]">
          Editar {type === 'heading' ? 'Título' : 
                  type === 'text' ? 'Texto' : 
                  type === 'button' ? 'Botão' : 'Imagem'}
        </h3>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {renderEditor()}

      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          onClick={() => onSave(editedContent)}
          className="flex-1 bg-[#B89B7A] hover:bg-[#A1835D] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default InlineEditor;
