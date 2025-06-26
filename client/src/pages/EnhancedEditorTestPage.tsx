import React, { useState } from "react";
import { EnhancedEditorLayout } from "@/components/enhanced-editor/EnhancedEditorLayout";
import { Block } from "@/types/editor";

// Exemplo de dados iniciais para teste
const initialBlocks: Block[] = [
  {
    id: "1",
    type: "headline",
    content: {
      title: "Título de Exemplo",
      subtitle: "Subtítulo de exemplo",
    },
    order: 0,
  },
  {
    id: "2",
    type: "text",
    content: {
      text: "Este é um texto de exemplo para demonstrar o editor.",
    },
    order: 1,
  },
  {
    id: "3",
    type: "image",
    content: {
      imageUrl: "https://via.placeholder.com/400x200",
      imageAlt: "Imagem de exemplo",
      caption: "Legenda da imagem",
    },
    order: 2,
  },
];

export function EnhancedEditorTestPage() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleBlockAdd = (type: string) => {
    const newBlock: Block = {
      id: `block_${Date.now()}`,
      type: type as any,
      content: getDefaultContentForType(type),
      order: blocks.length,
    };

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleBlockUpdate = (id: string, content: any) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  const handleBlockDelete = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleBlocksReorder = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    console.log("Salvando blocos:", blocks);
    // Aqui você pode implementar a lógica de salvamento
    // Por exemplo, enviar para uma API ou salvar no localStorage
    localStorage.setItem(
      "enhanced_editor_saved_blocks",
      JSON.stringify(blocks)
    );
    alert("Blocos salvos com sucesso!");
  };

  return (
    <div className="h-screen">
      <EnhancedEditorLayout
        blocks={blocks}
        selectedBlockId={selectedBlockId}
        onBlockSelect={setSelectedBlockId}
        onBlockAdd={handleBlockAdd}
        onBlockUpdate={handleBlockUpdate}
        onBlockDelete={handleBlockDelete}
        onBlocksReorder={handleBlocksReorder}
        onSave={handleSave}
        primaryStyle={{
          category: "Natural",
          colors: {
            primary: "#B89B7A",
            secondary: "#8F7A6A",
          },
        }}
      />
    </div>
  );
}

// Função helper para criar conteúdo padrão baseado no tipo
function getDefaultContentForType(type: string) {
  switch (type) {
    case "headline":
      return {
        title: "Novo Título",
        subtitle: "Novo Subtítulo",
      };
    case "text":
      return {
        text: "Digite seu texto aqui...",
      };
    case "image":
      return {
        imageUrl: "",
        imageAlt: "Descrição da imagem",
        caption: "",
      };
    case "benefits":
      return {
        title: "Benefícios",
        items: ["Benefício 1", "Benefício 2", "Benefício 3"],
      };
    case "testimonials":
      return {
        name: "Nome do Cliente",
        testimonial: "Depoimento do cliente aqui...",
        role: "Cargo/Função",
      };
    case "cta":
      return {
        text: "Clique Aqui",
        url: "#",
        buttonStyle: "primary",
      };
    case "pricing":
      return {
        title: "Oferta Especial",
        price: "R$ 97,00",
        originalPrice: "R$ 197,00",
        description: "Descrição da oferta...",
      };
    default:
      return {};
  }
}

export default EnhancedEditorTestPage;
