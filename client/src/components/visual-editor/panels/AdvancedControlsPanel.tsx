import { Sliders } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Settings,
  Image,
  Type,
  Layout,
  Palette,
  Move,
  Eye,
  Sliders,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

interface AdvancedControlsPanelProps {
  selectedElementId: string | null;
  onElementUpdate: (
    elementId: string,
    updates: Record<string, unknown>
  ) => void;
  onResetElement: (elementId: string) => void;
  onDeleteElement: (elementId: string) => void;
}

export const AdvancedControlsPanel: React.FC<AdvancedControlsPanelProps> = ({
  selectedElementId,
  onElementUpdate,
  onResetElement,
  onDeleteElement,
}) => {
  const [imageSize, setImageSize] = useState([70]);
  const [textSize, setTextSize] = useState([16]);
  const [gridColumns, setGridColumns] = useState([2]);
  const [spacing, setSpacing] = useState([20]);
  const [borderRadius, setBorderRadius] = useState([8]);
  const [opacity, setOpacity] = useState([100]);

  const handleSliderChange = (value: number[], type: string) => {
    if (!selectedElementId) return;

    const updates: Record<string, unknown> = {};

    switch (type) {
      case "imageSize":
        setImageSize(value);
        updates.style = { width: `${value[0]}%` };
        break;
      case "textSize":
        setTextSize(value);
        updates.style = { fontSize: `${value[0]}px` };
        break;
      case "gridColumns":
        setGridColumns(value);
        updates.properties = { gridColumns: value[0] };
        break;
      case "spacing":
        setSpacing(value);
        updates.style = { gap: `${value[0]}px` };
        break;
      case "borderRadius":
        setBorderRadius(value);
        updates.style = { borderRadius: `${value[0]}px` };
        break;
      case "opacity":
        setOpacity(value);
        updates.style = { opacity: value[0] / 100 };
        break;
    }

    onElementUpdate(selectedElementId, updates);
  };

  if (!selectedElementId) {
    return (
      <div className="p-4 h-full">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/60">
          <Sliders className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-medium text-slate-800">
            Controles Avançados
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
          <Settings className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-xs text-slate-600">
            Selecione um elemento para editar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-medium text-slate-800">
            Controles Avançados
          </h3>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          Elemento Ativo
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="space-y-4">
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="layout" className="text-xs h-6">
                <Layout className="w-3 h-3 mr-1" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs h-6">
                <Palette className="w-3 h-3 mr-1" />
                Estilo
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs h-6">
                <Type className="w-3 h-3 mr-1" />
                Conteúdo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-3 mt-3">
              {/* Controles de Imagem */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="w-3 h-3 text-blue-600" />
                  <Label className="text-xs font-medium">
                    Tamanho da Imagem
                  </Label>
                </div>
                <div className="space-y-1">
                  <Slider
                    value={imageSize}
                    onValueChange={(value) =>
                      handleSliderChange(value, "imageSize")
                    }
                    max={100}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>20%</span>
                    <span className="font-medium">{imageSize[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Controles de Grid */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-3 h-3 text-green-600" />
                  <Label className="text-xs font-medium">Colunas do Grid</Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={gridColumns}
                    onValueChange={(value) =>
                      handleSliderChange(value, "gridColumns")
                    }
                    max={4}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 col</span>
                    <span className="font-medium">
                      {gridColumns[0]} colunas
                    </span>
                    <span>4 cols</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Controles de Espaçamento */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-orange-600" />
                  <Label className="text-sm font-medium">Espaçamento</Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={spacing}
                    onValueChange={(value) =>
                      handleSliderChange(value, "spacing")
                    }
                    max={50}
                    min={0}
                    step={2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0px</span>
                    <span className="font-medium">{spacing[0]}px</span>
                    <span>50px</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              {/* Controles de Texto */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-purple-600" />
                  <Label className="text-sm font-medium">
                    Tamanho do Texto
                  </Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={textSize}
                    onValueChange={(value) =>
                      handleSliderChange(value, "textSize")
                    }
                    max={32}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10px</span>
                    <span className="font-medium">{textSize[0]}px</span>
                    <span>32px</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Controles de Bordas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded bg-gray-100"></div>
                  <Label className="text-sm font-medium">Arredondamento</Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={borderRadius}
                    onValueChange={(value) =>
                      handleSliderChange(value, "borderRadius")
                    }
                    max={25}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0px</span>
                    <span className="font-medium">{borderRadius[0]}px</span>
                    <span>25px</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Controles de Opacidade */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <Label className="text-sm font-medium">Opacidade</Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={opacity}
                    onValueChange={(value) =>
                      handleSliderChange(value, "opacity")
                    }
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10%</span>
                    <span className="font-medium">{opacity[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              {/* Controles de Alinhamento */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Alinhamento de Texto
                </Label>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onElementUpdate(selectedElementId, {
                        style: { textAlign: "left" },
                      })
                    }
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onElementUpdate(selectedElementId, {
                        style: { textAlign: "center" },
                      })
                    }
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onElementUpdate(selectedElementId, {
                        style: { textAlign: "right" },
                      })
                    }
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Controles de Formatação */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Formatação</Label>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onElementUpdate(selectedElementId, {
                        style: { fontWeight: "bold" },
                      })
                    }
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onElementUpdate(selectedElementId, {
                        style: { fontStyle: "italic" },
                      })
                    }
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      onElementUpdate(selectedElementId, {
                        style: { textDecoration: "underline" },
                      })
                    }
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Campo de Texto para Edição */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Conteúdo do Texto</Label>
                <Textarea
                  placeholder="Digite o texto aqui..."
                  className="min-h-[80px] resize-none"
                  onChange={(e) =>
                    onElementUpdate(selectedElementId, {
                      content: { text: e.target.value },
                    })
                  }
                />
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Ações do Elemento */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ações do Elemento</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onResetElement(selectedElementId)}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Resetar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => onDeleteElement(selectedElementId)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
