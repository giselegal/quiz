import React from "react";
import { Block } from "@/types/editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPropertiesEditor } from "./editors/ContentPropertiesEditor";
import { StylePropertiesEditor } from "./editors/StylePropertiesEditor";

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, content: any) => void;
}

export function PropertiesPanel({
  selectedBlock,
  onUpdateBlock,
}: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm text-[#8F7A6A]">Propriedades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#8F7A6A]">
            Selecione um componente para editar suas propriedades
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleContentUpdate = (updates: any) => {
    const currentContent = selectedBlock.content as any;
    const newContent = { ...currentContent, ...updates };
    onUpdateBlock(selectedBlock.id, newContent);
  };

  const handleStyleUpdate = (styleUpdates: any) => {
    const currentContent = selectedBlock.content as any;
    const currentStyle = currentContent.style || {};
    const newStyle = { ...currentStyle, ...styleUpdates };
    const newContent = { ...currentContent, style: newStyle };
    onUpdateBlock(selectedBlock.id, newContent);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm text-[#432818]">
          Propriedades: {selectedBlock.type}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content" className="text-xs">
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              Estilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            <ContentPropertiesEditor
              block={selectedBlock}
              onUpdate={handleContentUpdate}
            />
          </TabsContent>

          <TabsContent value="style" className="p-4">
            <StylePropertiesEditor
              style={(selectedBlock.content as any)?.style || {}}
              onUpdate={handleStyleUpdate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PropertiesPanel;
