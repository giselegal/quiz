import React, { useState } from "react";
// Componente flexível para edição de propriedades
interface SimpleComponent {
  id: string;
  type: string;
  data: Record<string, any>;
  style: Record<string, any>;
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trash2, Edit3, Palette, Type } from "lucide-react";

interface ComponentPropertiesEditorProps {
  component: SimpleComponent | null;
  onSave: (component: SimpleComponent) => void;
  onDelete: () => void;
  onDeselect: () => void;
}

export const ComponentPropertiesEditor: React.FC<ComponentPropertiesEditorProps> = ({
  component,
  onSave,
  onDelete,
  onDeselect,
}) => {
  const [localComponent, setLocalComponent] = useState<SimpleComponent | null>(component);

  React.useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  if (!localComponent) {
    return (
      <div className="text-center py-8">
        <Edit3 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Selecione um componente para editar</p>
      </div>
    );
  }

  const updateData = (newData: Partial<any>) => {
    const updated = {
      ...localComponent,
      data: { ...localComponent.data, ...newData }
    };
    setLocalComponent(updated);
    onSave(updated);
  };

  const updateStyle = (newStyle: Partial<React.CSSProperties>) => {
    const updated = {
      ...localComponent,
      style: { ...localComponent.style, ...newStyle }
    };
    setLocalComponent(updated);
    onSave(updated);
  };

  const getComponentTitle = () => {
    switch (localComponent.type) {
      case "title": return "Título";
      case "paragraph": return "Parágrafo";
      case "image": return "Imagem";
      case "button": return "Botão";
      case "video": return "Vídeo";
      case "testimonial": return "Depoimento";
      case "price": return "Preço";
      case "spacer": return "Espaçamento";
      case "form": return "Formulário";
      default: return "Componente";
    }
  };

  const renderContentTab = () => {
    const data = localComponent.data;

    switch (localComponent.type) {
      case "title":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Texto</Label>
              <Input
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="Digite o título"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Nível do Título</Label>
              <Select value={String(data.level || 2)} onValueChange={(value) => updateData({ level: Number(value) })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                  <SelectItem value="5">H5</SelectItem>
                  <SelectItem value="6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Alinhamento</Label>
              <Select value={data.alignment || "center"} onValueChange={(value) => updateData({ alignment: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Texto</Label>
              <Textarea
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="Digite o texto do parágrafo"
                rows={4}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Alinhamento</Label>
              <Select value={data.alignment || "left"} onValueChange={(value) => updateData({ alignment: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">URL da Imagem</Label>
              <Input
                value={data.src || ""}
                onChange={(e) => updateData({ src: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Texto Alternativo</Label>
              <Input
                value={data.alt || ""}
                onChange={(e) => updateData({ alt: e.target.value })}
                placeholder="Descrição da imagem"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Largura Máxima</Label>
              <Input
                value={data.maxWidth || "100%"}
                onChange={(e) => updateData({ maxWidth: e.target.value })}
                placeholder="400px ou 100%"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Alinhamento</Label>
              <Select value={data.alignment || "center"} onValueChange={(value) => updateData({ alignment: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Texto do Botão</Label>
              <Input
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="CLIQUE AQUI"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Variante</Label>
              <Select value={data.variant || "primary"} onValueChange={(value) => updateData({ variant: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primário</SelectItem>
                  <SelectItem value="secondary">Secundário</SelectItem>
                  <SelectItem value="outline">Contorno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Tamanho</Label>
              <Select value={data.size || "medium"} onValueChange={(value) => updateData({ size: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.fullWidth || false}
                onCheckedChange={(checked) => updateData({ fullWidth: checked })}
              />
              <Label className="text-xs">Largura total</Label>
            </div>
            <div>
              <Label className="text-xs">Ação/URL</Label>
              <Input
                value={data.action || ""}
                onChange={(e) => updateData({ action: e.target.value })}
                placeholder="https://exemplo.com"
                className="h-8 text-sm"
              />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">URL do Vídeo</Label>
              <Input
                value={data.videoUrl || ""}
                onChange={(e) => updateData({ videoUrl: e.target.value })}
                placeholder="https://youtube.com/embed/..."
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Título do Vídeo</Label>
              <Input
                value={data.title || ""}
                onChange={(e) => updateData({ title: e.target.value })}
                placeholder="Vídeo de Vendas"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">URL da Thumbnail</Label>
              <Input
                value={data.thumbnail || ""}
                onChange={(e) => updateData({ thumbnail: e.target.value })}
                placeholder="https://exemplo.com/thumbnail.jpg"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.autoPlay || false}
                onCheckedChange={(checked) => updateData({ autoPlay: checked })}
              />
              <Label className="text-xs">Reprodução automática</Label>
            </div>
          </div>
        );

      case "testimonial":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Depoimento</Label>
              <Textarea
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="Este produto mudou minha vida..."
                rows={3}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Nome</Label>
              <Input
                value={data.name || ""}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="João Silva"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Cargo/Posição</Label>
              <Input
                value={data.role || ""}
                onChange={(e) => updateData({ role: e.target.value })}
                placeholder="Cliente verificado"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">URL do Avatar</Label>
              <Input
                value={data.avatar || ""}
                onChange={(e) => updateData({ avatar: e.target.value })}
                placeholder="https://exemplo.com/avatar.jpg"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Avaliação (estrelas)</Label>
              <Select value={String(data.rating || 5)} onValueChange={(value) => updateData({ rating: Number(value) })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 estrela</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "price":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Preço</Label>
              <Input
                value={data.price || ""}
                onChange={(e) => updateData({ price: e.target.value })}
                placeholder="97"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Preço Original (opcional)</Label>
              <Input
                value={data.originalPrice || ""}
                onChange={(e) => updateData({ originalPrice: e.target.value })}
                placeholder="197"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Parcelas (opcional)</Label>
              <Input
                value={data.installments || ""}
                onChange={(e) => updateData({ installments: e.target.value })}
                placeholder="8,08"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Moeda</Label>
              <Select value={data.currency || "R$"} onValueChange={(value) => updateData({ currency: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R$">Real (R$)</SelectItem>
                  <SelectItem value="$">Dólar ($)</SelectItem>
                  <SelectItem value="€">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.highlight || false}
                onCheckedChange={(checked) => updateData({ highlight: checked })}
              />
              <Label className="text-xs">Destacar preço</Label>
            </div>
          </div>
        );

      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Altura (px)</Label>
              <div className="space-y-2">
                <Slider
                  value={[data.height || 32]}
                  onValueChange={(value) => updateData({ height: value[0] })}
                  max={200}
                  min={8}
                  step={8}
                  className="w-full"
                />
                <div className="text-xs text-gray-600 text-center">
                  {data.height || 32}px
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.showInEditor !== false}
                onCheckedChange={(checked) => updateData({ showInEditor: checked })}
              />
              <Label className="text-xs">Mostrar no editor</Label>
            </div>
          </div>
        );

      case "form":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Texto do Botão</Label>
              <Input
                value={data.submitText || ""}
                onChange={(e) => updateData({ submitText: e.target.value })}
                placeholder="ENVIAR"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Campos do Formulário</Label>
              <div className="text-xs text-gray-500 mt-1">
                Funcionalidade de campos será implementada em versão futura
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-sm text-gray-500">Editor não implementado para este tipo de componente.</div>;
    }
  };

  const renderStyleTab = () => {
    const style = localComponent.style || {};

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Cor do Texto</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.color || "#000000"}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              value={style.color || "#000000"}
              onChange={(e) => updateStyle({ color: e.target.value })}
              placeholder="#000000"
              className="flex-1 h-8 text-sm"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Cor de Fundo</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              value={style.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1 h-8 text-sm"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Tamanho da Fonte</Label>
          <Input
            value={style.fontSize || ""}
            onChange={(e) => updateStyle({ fontSize: e.target.value })}
            placeholder="1rem, 16px, 1.2em"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Peso da Fonte</Label>
          <Select
            value={String(style.fontWeight || "normal")}
            onValueChange={(value) => updateStyle({ fontWeight: value })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Negrito</SelectItem>
              <SelectItem value="300">Leve</SelectItem>
              <SelectItem value="400">Normal</SelectItem>
              <SelectItem value="500">Médio</SelectItem>
              <SelectItem value="600">Semi-negrito</SelectItem>
              <SelectItem value="700">Negrito</SelectItem>
              <SelectItem value="800">Extra-negrito</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Margem</Label>
          <Input
            value={style.margin || ""}
            onChange={(e) => updateStyle({ margin: e.target.value })}
            placeholder="16px, 1rem 0, 10px 20px"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Padding</Label>
          <Input
            value={style.padding || ""}
            onChange={(e) => updateStyle({ padding: e.target.value })}
            placeholder="16px, 1rem 0, 10px 20px"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Borda</Label>
          <Input
            value={style.border || ""}
            onChange={(e) => updateStyle({ border: e.target.value })}
            placeholder="1px solid #ccc"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Raio da Borda</Label>
          <Input
            value={style.borderRadius || ""}
            onChange={(e) => updateStyle({ borderRadius: e.target.value })}
            placeholder="8px, 50%"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Sombra</Label>
          <Input
            value={style.boxShadow || ""}
            onChange={(e) => updateStyle({ boxShadow: e.target.value })}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
            className="h-8 text-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Type className="h-4 w-4" />
            {getComponentTitle()}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDeselect}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-7">
            <TabsTrigger value="content" className="text-xs">Conteúdo</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Estilo</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="mt-4">
            {renderContentTab()}
          </TabsContent>
          <TabsContent value="style" className="mt-4">
            {renderStyleTab()}
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 border-red-300 hover:bg-red-50 h-7 text-xs"
          >
            <Trash2 size={12} className="mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};