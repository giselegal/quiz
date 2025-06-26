
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Image, 
  MousePointer, 
  Square,
  Play,
  FileText,
  HelpCircle,
  Trash2,
  Palette
} from 'lucide-react';
import { EditorElement } from './InLeadEditor';

interface InLeadSidebarProps {
  selectedElement: EditorElement | undefined;
  onAddElement: (type: EditorElement['type']) => void;
  onUpdateElement: (updates: Partial<EditorElement>) => void;
  onDeleteElement: () => void;
}

const elements = [
  { type: 'heading' as const, name: 'Título', icon: Type, color: 'blue' },
  { type: 'text' as const, name: 'Texto', icon: FileText, color: 'gray' },
  { type: 'image' as const, name: 'Imagem', icon: Image, color: 'green' },
  { type: 'button' as const, name: 'Botão', icon: MousePointer, color: 'purple' },
  { type: 'form' as const, name: 'Formulário', icon: Square, color: 'orange' },
  { type: 'video' as const, name: 'Vídeo', icon: Play, color: 'red' },
  { type: 'quiz-question' as const, name: 'Pergunta Quiz', icon: HelpCircle, color: 'pink' }
];

export const InLeadSidebar: React.FC<InLeadSidebarProps> = ({
  selectedElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement
}) => {
  const handleContentUpdate = (key: string, value: any) => {
    onUpdateElement({
      content: { ...selectedElement?.content, [key]: value }
    });
  };

  const handleStyleUpdate = (key: string, value: any) => {
    onUpdateElement({
      style: { ...selectedElement?.style, [key]: value }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <Tabs defaultValue="elements" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="elements">Elementos</TabsTrigger>
          <TabsTrigger value="properties">Propriedades</TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="flex-1 p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Adicionar Elementos</h3>
          <div className="grid grid-cols-2 gap-2">
            {elements.map((element) => {
              const IconComponent = element.icon;
              return (
                <Card
                  key={element.type}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                  onClick={() => onAddElement(element.type)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {element.name}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="properties" className="flex-1 p-4">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Propriedades</h3>
                <Button size="sm" variant="outline" onClick={onDeleteElement}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Content Properties */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 text-sm">Conteúdo</h4>
                
                {selectedElement.type === 'heading' && (
                  <>
                    <div>
                      <Label htmlFor="heading-text">Texto do Título</Label>
                      <Input
                        id="heading-text"
                        value={selectedElement.content.text || ''}
                        onChange={(e) => handleContentUpdate('text', e.target.value)}
                        placeholder="Digite o título..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="heading-level">Nível do Título</Label>
                      <Select
                        value={selectedElement.content.level || 'h1'}
                        onValueChange={(value) => handleContentUpdate('level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h1">H1 - Principal</SelectItem>
                          <SelectItem value="h2">H2 - Subtítulo</SelectItem>
                          <SelectItem value="h3">H3 - Seção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {selectedElement.type === 'text' && (
                  <div>
                    <Label htmlFor="text-content">Texto</Label>
                    <Textarea
                      id="text-content"
                      value={selectedElement.content.text || ''}
                      onChange={(e) => handleContentUpdate('text', e.target.value)}
                      placeholder="Digite seu texto..."
                      rows={4}
                    />
                  </div>
                )}

                {selectedElement.type === 'button' && (
                  <>
                    <div>
                      <Label htmlFor="button-text">Texto do Botão</Label>
                      <Input
                        id="button-text"
                        value={selectedElement.content.text || ''}
                        onChange={(e) => handleContentUpdate('text', e.target.value)}
                        placeholder="Clique aqui"
                      />
                    </div>
                    <div>
                      <Label htmlFor="button-url">URL do Link</Label>
                      <Input
                        id="button-url"
                        value={selectedElement.content.url || ''}
                        onChange={(e) => handleContentUpdate('url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                {selectedElement.type === 'image' && (
                  <>
                    <div>
                      <Label htmlFor="image-src">URL da Imagem</Label>
                      <Input
                        id="image-src"
                        value={selectedElement.content.src || ''}
                        onChange={(e) => handleContentUpdate('src', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-alt">Texto Alternativo</Label>
                      <Input
                        id="image-alt"
                        value={selectedElement.content.alt || ''}
                        onChange={(e) => handleContentUpdate('alt', e.target.value)}
                        placeholder="Descrição da imagem"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Style Properties */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Estilo
                </h4>
                
                <div>
                  <Label htmlFor="text-color">Cor do Texto</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={selectedElement.style.color || '#333333'}
                    onChange={(e) => handleStyleUpdate('color', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="font-size">Tamanho da Fonte</Label>
                  <Input
                    id="font-size"
                    value={selectedElement.style.fontSize || '16px'}
                    onChange={(e) => handleStyleUpdate('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>

                {selectedElement.type === 'button' && (
                  <div>
                    <Label htmlFor="bg-color">Cor de Fundo</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={selectedElement.style.backgroundColor || '#007bff'}
                      onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <Square className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="font-medium mb-2">Nenhum elemento selecionado</h3>
              <p className="text-sm">Clique em um elemento no canvas para editar suas propriedades</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
