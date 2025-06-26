import React, { useState } from "react";
import {
  ModularTitle,
  ModularParagraph,
  ModularImage,
  ModularButton,
  ModularVideo,
  ModularTestimonial,
  ModularPrice,
  ModularSpacer,
  ModularForm,
  ModularQuestionTextOnly,
  TitleComponentData,
  ParagraphComponentData,
  ImageComponentData,
  ButtonComponentData,
  VideoComponentData,
  TestimonialComponentData,
  PriceComponentData,
  SpacerComponentData,
  FormComponentData,
  QuestionTextOnlyData,
} from "./ModularComponents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { X, Plus, Trash2, Upload } from "lucide-react";

// Interface para componente genérico
export interface ModularComponent {
  id: string;
  type: string;
  data: any;
  style?: React.CSSProperties;
}

// Interface para o editor modular
interface ModularEditorProps {
  isVisible: boolean;
  component: ModularComponent | null;
  onSave: (component: ModularComponent) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export const ModularEditor: React.FC<ModularEditorProps> = ({
  isVisible,
  component,
  onSave,
  onClose,
  onDelete,
}) => {
  const [localComponent, setLocalComponent] = useState<ModularComponent | null>(component);

  // Atualiza o estado local quando o componente muda
  React.useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  if (!isVisible || !localComponent) {
    return null;
  }

  const updateData = (newData: Partial<any>) => {
    setLocalComponent(prev => ({
      ...prev!,
      data: { ...prev!.data, ...newData }
    }));
  };

  const updateStyle = (newStyle: Partial<React.CSSProperties>) => {
    setLocalComponent(prev => ({
      ...prev!,
      style: { ...prev!.style, ...newStyle }
    }));
  };

  const handleSave = () => {
    if (localComponent) {
      onSave(localComponent);
      onClose();
    }
  };

  const renderContentTab = () => {
    const data = localComponent.data;

    switch (localComponent.type) {
      case "title":
        return (
          <div className="space-y-4">
            <div>
              <Label>Texto</Label>
              <Input
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="Digite o título"
              />
            </div>
            <div>
              <Label>Nível do Título</Label>
              <Select value={String(data.level || 2)} onValueChange={(value) => updateData({ level: Number(value) })}>
                <SelectTrigger>
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
              <Label>Alinhamento</Label>
              <Select value={data.alignment || "center"} onValueChange={(value) => updateData({ alignment: value })}>
                <SelectTrigger>
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
              <Label>Texto</Label>
              <Textarea
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="Digite o texto do parágrafo"
                rows={4}
              />
            </div>
            <div>
              <Label>Alinhamento</Label>
              <Select value={data.alignment || "left"} onValueChange={(value) => updateData({ alignment: value })}>
                <SelectTrigger>
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
              <Label>URL da Imagem</Label>
              <Input
                value={data.src || ""}
                onChange={(e) => updateData({ src: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <Label>Texto Alternativo</Label>
              <Input
                value={data.alt || ""}
                onChange={(e) => updateData({ alt: e.target.value })}
                placeholder="Descrição da imagem"
              />
            </div>
            <div>
              <Label>Largura Máxima</Label>
              <Input
                value={data.maxWidth || "100%"}
                onChange={(e) => updateData({ maxWidth: e.target.value })}
                placeholder="400px ou 100%"
              />
            </div>
            <div>
              <Label>Alinhamento</Label>
              <Select value={data.alignment || "center"} onValueChange={(value) => updateData({ alignment: value })}>
                <SelectTrigger>
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
              <Label>Texto do Botão</Label>
              <Input
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="CLIQUE AQUI"
              />
            </div>
            <div>
              <Label>Variante</Label>
              <Select value={data.variant || "primary"} onValueChange={(value) => updateData({ variant: value })}>
                <SelectTrigger>
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
              <Label>Tamanho</Label>
              <Select value={data.size || "medium"} onValueChange={(value) => updateData({ size: value })}>
                <SelectTrigger>
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
              <Label>Largura total</Label>
            </div>
            <div>
              <Label>Ação/URL</Label>
              <Input
                value={data.action || ""}
                onChange={(e) => updateData({ action: e.target.value })}
                placeholder="https://exemplo.com"
              />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label>URL do Vídeo</Label>
              <Input
                value={data.videoUrl || ""}
                onChange={(e) => updateData({ videoUrl: e.target.value })}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            <div>
              <Label>Título do Vídeo</Label>
              <Input
                value={data.title || ""}
                onChange={(e) => updateData({ title: e.target.value })}
                placeholder="Vídeo de Vendas"
              />
            </div>
            <div>
              <Label>URL da Thumbnail</Label>
              <Input
                value={data.thumbnail || ""}
                onChange={(e) => updateData({ thumbnail: e.target.value })}
                placeholder="https://exemplo.com/thumbnail.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.autoPlay || false}
                onCheckedChange={(checked) => updateData({ autoPlay: checked })}
              />
              <Label>Reprodução automática</Label>
            </div>
          </div>
        );

      case "testimonial":
        return (
          <div className="space-y-4">
            <div>
              <Label>Depoimento</Label>
              <Textarea
                value={data.text || ""}
                onChange={(e) => updateData({ text: e.target.value })}
                placeholder="Este produto mudou minha vida..."
                rows={3}
              />
            </div>
            <div>
              <Label>Nome</Label>
              <Input
                value={data.name || ""}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="João Silva"
              />
            </div>
            <div>
              <Label>Cargo/Posição</Label>
              <Input
                value={data.role || ""}
                onChange={(e) => updateData({ role: e.target.value })}
                placeholder="Cliente verificado"
              />
            </div>
            <div>
              <Label>URL do Avatar</Label>
              <Input
                value={data.avatar || ""}
                onChange={(e) => updateData({ avatar: e.target.value })}
                placeholder="https://exemplo.com/avatar.jpg"
              />
            </div>
            <div>
              <Label>Avaliação (estrelas)</Label>
              <Select value={String(data.rating || 5)} onValueChange={(value) => updateData({ rating: Number(value) })}>
                <SelectTrigger>
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
              <Label>Preço</Label>
              <Input
                value={data.price || ""}
                onChange={(e) => updateData({ price: e.target.value })}
                placeholder="97"
              />
            </div>
            <div>
              <Label>Preço Original (opcional)</Label>
              <Input
                value={data.originalPrice || ""}
                onChange={(e) => updateData({ originalPrice: e.target.value })}
                placeholder="197"
              />
            </div>
            <div>
              <Label>Parcelas (opcional)</Label>
              <Input
                value={data.installments || ""}
                onChange={(e) => updateData({ installments: e.target.value })}
                placeholder="8,08"
              />
            </div>
            <div>
              <Label>Moeda</Label>
              <Select value={data.currency || "R$"} onValueChange={(value) => updateData({ currency: value })}>
                <SelectTrigger>
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
              <Label>Destacar preço</Label>
            </div>
          </div>
        );

      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label>Altura (px)</Label>
              <div className="space-y-2">
                <Slider
                  value={[data.height || 32]}
                  onValueChange={(value) => updateData({ height: value[0] })}
                  max={200}
                  min={8}
                  step={8}
                />
                <div className="text-sm text-gray-600 text-center">
                  {data.height || 32}px
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.showInEditor !== false}
                onCheckedChange={(checked) => updateData({ showInEditor: checked })}
              />
              <Label>Mostrar no editor</Label>
            </div>
          </div>
        );

      case "form":
        return (
          <div className="space-y-4">
            <div>
              <Label>Texto do Botão</Label>
              <Input
                value={data.submitText || ""}
                onChange={(e) => updateData({ submitText: e.target.value })}
                placeholder="ENVIAR"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Campos do Formulário</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const newField = {
                      type: "text",
                      label: "Campo",
                      placeholder: "Digite aqui",
                      required: false
                    };
                    updateData({
                      fields: [...(data.fields || []), newField]
                    });
                  }}
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar Campo
                </Button>
              </div>
              {data.fields?.map((field: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Campo {index + 1}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newFields = data.fields.filter((_: any, i: number) => i !== index);
                        updateData({ fields: newFields });
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <Input
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...data.fields];
                      newFields[index].label = e.target.value;
                      updateData({ fields: newFields });
                    }}
                    placeholder="Rótulo do campo"
                  />
                  <Input
                    value={field.placeholder}
                    onChange={(e) => {
                      const newFields = [...data.fields];
                      newFields[index].placeholder = e.target.value;
                      updateData({ fields: newFields });
                    }}
                    placeholder="Placeholder"
                  />
                  <Select
                    value={field.type}
                    onValueChange={(value) => {
                      const newFields = [...data.fields];
                      newFields[index].type = value;
                      updateData({ fields: newFields });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Telefone</SelectItem>
                      <SelectItem value="textarea">Área de texto</SelectItem>
                      <SelectItem value="select">Seleção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        );

      case "question-text-only":
        const { QuestionTextOnlyEditor } = require("./QuestionTextOnlyEditor");
        return (
          <QuestionTextOnlyEditor
            data={data}
            onChange={(newData: QuestionTextOnlyData) => updateData(newData)}
          />
        );

      default:
        return <div>Editor não implementado para este tipo de componente.</div>;
    }
  };

  const renderStyleTab = () => {
    const style = localComponent.style || {};

    return (
      <div className="space-y-4">
        <div>
          <Label>Cor do Texto</Label>
          <Input
            type="color"
            value={style.color || "#000000"}
            onChange={(e) => updateStyle({ color: e.target.value })}
          />
        </div>
        <div>
          <Label>Cor de Fundo</Label>
          <Input
            type="color"
            value={style.backgroundColor || "#ffffff"}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
          />
        </div>
        <div>
          <Label>Tamanho da Fonte</Label>
          <Input
            value={style.fontSize || ""}
            onChange={(e) => updateStyle({ fontSize: e.target.value })}
            placeholder="1rem, 16px, 1.2em"
          />
        </div>
        <div>
          <Label>Peso da Fonte</Label>
          <Select
            value={String(style.fontWeight || "normal")}
            onValueChange={(value) => updateStyle({ fontWeight: value })}
          >
            <SelectTrigger>
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
          <Label>Margem</Label>
          <Input
            value={style.margin || ""}
            onChange={(e) => updateStyle({ margin: e.target.value })}
            placeholder="16px, 1rem 0, 10px 20px"
          />
        </div>
        <div>
          <Label>Padding</Label>
          <Input
            value={style.padding || ""}
            onChange={(e) => updateStyle({ padding: e.target.value })}
            placeholder="16px, 1rem 0, 10px 20px"
          />
        </div>
        <div>
          <Label>Borda</Label>
          <Input
            value={style.border || ""}
            onChange={(e) => updateStyle({ border: e.target.value })}
            placeholder="1px solid #ccc"
          />
        </div>
        <div>
          <Label>Raio da Borda</Label>
          <Input
            value={style.borderRadius || ""}
            onChange={(e) => updateStyle({ borderRadius: e.target.value })}
            placeholder="8px, 50%"
          />
        </div>
        <div>
          <Label>Sombra</Label>
          <Input
            value={style.boxShadow || ""}
            onChange={(e) => updateStyle({ boxShadow: e.target.value })}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            Editar {localComponent.type === "title" ? "Título" : 
                   localComponent.type === "paragraph" ? "Parágrafo" :
                   localComponent.type === "image" ? "Imagem" :
                   localComponent.type === "button" ? "Botão" :
                   localComponent.type === "video" ? "Vídeo" :
                   localComponent.type === "testimonial" ? "Depoimento" :
                   localComponent.type === "price" ? "Preço" :
                   localComponent.type === "spacer" ? "Espaçamento" :
                   localComponent.type === "form" ? "Formulário" :
                   "Componente"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="style">Estilo</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              {renderContentTab()}
            </TabsContent>
            <TabsContent value="style" className="mt-4">
              {renderStyleTab()}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div>
            {onDelete && (
              <Button variant="outline" onClick={onDelete} className="text-red-600 border-red-300 hover:bg-red-50">
                <Trash2 size={16} className="mr-2" />
                Excluir
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para renderizar componente modular
export const renderModularComponent = (
  component: ModularComponent,
  isSelected: boolean = false,
  onClick?: () => void
) => {
  const commonProps = {
    isSelected,
    onClick,
    style: component.style,
  };

  switch (component.type) {
    case "title":
      return <ModularTitle key={component.id} data={component.data as TitleComponentData} {...commonProps} />;
    case "paragraph":
      return <ModularParagraph key={component.id} data={component.data as ParagraphComponentData} {...commonProps} />;
    case "image":
      return <ModularImage key={component.id} data={component.data as ImageComponentData} {...commonProps} />;
    case "button":
      return <ModularButton key={component.id} data={component.data as ButtonComponentData} {...commonProps} />;
    case "video":
      return <ModularVideo key={component.id} data={component.data as VideoComponentData} {...commonProps} />;
    case "testimonial":
      return <ModularTestimonial key={component.id} data={component.data as TestimonialComponentData} {...commonProps} />;
    case "price":
      return <ModularPrice key={component.id} data={component.data as PriceComponentData} {...commonProps} />;
    case "spacer":
      return <ModularSpacer key={component.id} data={component.data as SpacerComponentData} {...commonProps} />;
    case "form":
      return <ModularForm key={component.id} data={component.data as FormComponentData} {...commonProps} />;
    case "question-text-only":
      return <ModularQuestionTextOnly key={component.id} data={component.data as QuestionTextOnlyData} {...commonProps} />;
    default:
      return <div key={component.id}>Componente não suportado: {component.type}</div>;
  }
};