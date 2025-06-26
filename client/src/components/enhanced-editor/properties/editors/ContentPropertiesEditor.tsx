import React from "react";
import { Block } from "@/types/editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface ContentPropertiesEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

export function ContentPropertiesEditor({
  block,
  onUpdate,
}: ContentPropertiesEditorProps) {
  const blockContent = block.content as any;

  switch (block.type) {
    case "headline":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={String(blockContent?.title || "")}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Digite o título..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={String(blockContent?.subtitle || "")}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Digite o subtítulo..."
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Texto</Label>
            <Textarea
              id="text"
              value={String(blockContent?.text || "")}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Digite o texto..."
              rows={6}
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={String(blockContent?.imageUrl || "")}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageAlt">Texto Alternativo</Label>
            <Input
              id="imageAlt"
              value={String(blockContent?.imageAlt || "")}
              onChange={(e) => onUpdate({ imageAlt: e.target.value })}
              placeholder="Descrição da imagem para acessibilidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Legenda</Label>
            <Input
              id="caption"
              value={String(blockContent?.caption || "")}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Legenda da imagem"
            />
          </div>

          {/* Add file upload button here later */}
        </div>
      );

    case "benefits": {
      const benefitItems = blockContent?.items || [
        "Benefício 1",
        "Benefício 2",
      ];
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="benefitsTitle">Título dos Benefícios</Label>
            <Input
              id="benefitsTitle"
              value={String(blockContent?.title || "")}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Principais benefícios..."
            />
          </div>

          <div className="space-y-2">
            <Label>Lista de Benefícios</Label>
            {benefitItems.map((item: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={String(item)}
                  onChange={(e) => {
                    const newItems = [...benefitItems];
                    newItems[index] = e.target.value;
                    onUpdate({ items: newItems });
                  }}
                  placeholder={`Benefício ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newItems = benefitItems.filter(
                      (_, i: number) => i !== index
                    );
                    onUpdate({ items: newItems });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItems = [
                  ...benefitItems,
                  `Novo benefício ${benefitItems.length + 1}`,
                ];
                onUpdate({ items: newItems });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Benefício
            </Button>
          </div>
        </div>
      );
    }

    case "testimonials":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testimonialName">Nome do Cliente</Label>
            <Input
              id="testimonialName"
              value={String(blockContent?.name || "")}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Nome do cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonialText">Depoimento</Label>
            <Textarea
              id="testimonialText"
              value={String(blockContent?.testimonial || "")}
              onChange={(e) => onUpdate({ testimonial: e.target.value })}
              placeholder="Digite o depoimento..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonialRole">Cargo/Função</Label>
            <Input
              id="testimonialRole"
              value={String(blockContent?.role || "")}
              onChange={(e) => onUpdate({ role: e.target.value })}
              placeholder="Cargo ou função"
            />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ctaText">Texto do Botão</Label>
            <Input
              id="ctaText"
              value={String(blockContent?.text || "")}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Clique aqui"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaUrl">URL de Destino</Label>
            <Input
              id="ctaUrl"
              value={String(blockContent?.url || "")}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaStyle">Estilo do Botão</Label>
            <Select
              value={String(blockContent?.buttonStyle || "primary")}
              onValueChange={(value) => onUpdate({ buttonStyle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha o estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primário</SelectItem>
                <SelectItem value="secondary">Secundário</SelectItem>
                <SelectItem value="outline">Contorno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "pricing":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pricingTitle">Título do Preço</Label>
            <Input
              id="pricingTitle"
              value={String(blockContent?.title || "")}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Oferta Especial"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              value={String(blockContent?.price || "")}
              onChange={(e) => onUpdate({ price: e.target.value })}
              placeholder="R$ 97,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPrice">Preço Original (opcional)</Label>
            <Input
              id="originalPrice"
              value={String(blockContent?.originalPrice || "")}
              onChange={(e) => onUpdate({ originalPrice: e.target.value })}
              placeholder="R$ 197,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricingDescription">Descrição</Label>
            <Textarea
              id="pricingDescription"
              value={String(blockContent?.description || "")}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Descrição da oferta..."
              rows={3}
            />
          </div>
        </div>
      );

    // Add more block types here...

    default:
      return (
        <div className="p-4 border border-[#B89B7A]/20 rounded-md bg-[#FAF9F7]">
          <p className="text-[#8F7A6A]">
            Editor não implementado para: {block.type}
          </p>
        </div>
      );
  }
}
