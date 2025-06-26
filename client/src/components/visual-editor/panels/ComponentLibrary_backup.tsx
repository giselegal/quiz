import React from "react";
import {
  Heading1,
  Text,
  Image,
  MousePointer,
  SquareCheckBig,
  Play,
  RectangleHorizontal,
  TriangleAlert,
  Music,
  LoaderCircle,
  GalleryHorizontalEnd,
  ChartArea,
  Quote,
  MessageCircleQuestion,
  CircleDollarSign,
  Scale,
  Code,
  List,
  ArrowRightLeft,
  ChartNoAxesColumnIncreasing,
  AlignHorizontalDistributeEnd,
  Sparkles,
} from "lucide-react";

interface ComponentLibraryProps {
  onComponentAdd: (componentType: string) => void;
}

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  isAvailable: boolean;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onComponentAdd }) => {
  const componentCategories = [
    {
      name: "Básicos",
      color: "blue",
      components: [
        {
          id: "heading",
          name: "Título",
          category: "Básicos",
          icon: Heading1,
          description: "Títulos e subtítulos para organizar o conteúdo",
          isAvailable: true,
        },
        {
          id: "text",
          name: "Texto",
          category: "Básicos",
          icon: Text,
          description: "Parágrafos e blocos de texto descritivo",
          isAvailable: true,
        },
        {
          id: "image",
          name: "Imagem",
          category: "Básicos",
          icon: Image,
          description: "Imagens, fotos e ilustrações",
          isAvailable: true,
        },
        {
          id: "spacer",
          name: "Espaçador",
          category: "Básicos",
          icon: RectangleHorizontal,
          description: "Espaçamento entre elementos",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Interação",
      color: "green",
      components: [
        {
          id: "button",
          name: "Botão",
          category: "Interação",
          icon: MousePointer,
          description: "Botões de ação e navegação",
          isAvailable: true,
        },
        {
          id: "input",
          name: "Campo de Entrada",
          category: "Interação",
          icon: Text,
          description: "Campos para capturar dados do usuário",
          isAvailable: true,
        },
        {
          id: "options",
          name: "Opções de Escolha",
          category: "Interação",
          icon: SquareCheckBig,
          description: "Múltipla escolha, seleção única",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Mídia",
      color: "purple",
      components: [
        {
          id: "video",
          name: "Vídeo",
          category: "Mídia",
          icon: Play,
          description: "Reprodução de vídeos YouTube, Vimeo",
          isAvailable: true,
        },
        {
          id: "audio",
          name: "Áudio",
          category: "Mídia",
          icon: Music,
          description: "Reprodução de arquivos de áudio",
          isAvailable: true,
        },
        {
          id: "carousel",
          name: "Carrossel",
          category: "Mídia",
          icon: GalleryHorizontalEnd,
          description: "Galeria de imagens em carrossel",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Feedback",
      color: "orange",
      components: [
        {
          id: "alert",
          name: "Alerta",
          category: "Notificações",
          icon: TriangleAlert,
          description: "Mensagens de aviso, erro, sucesso",
          isAvailable: true,
        },
        {
          id: "loading",
          name: "Carregamento",
          icon: LoaderCircle,
          description: "Indicadores de progresso",
          isAvailable: true,
        },
        {
          id: "confetti",
          name: "Confetti",
          icon: Sparkles,
          description: "Efeito de celebração com confetti",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Avançados",
      color: "indigo",
      components: [
        {
          id: "charts",
          name: "Gráficos",
          icon: ChartArea,
          description: "Visualização de dados em gráficos",
          isAvailable: true,
        },
        {
          id: "testimonials",
          name: "Depoimentos",
          icon: Quote,
          description: "Seção de depoimentos e avaliações",
          isAvailable: true,
        },
        {
          id: "faq",
          name: "FAQ",
          icon: MessageCircleQuestion,
          description: "Perguntas frequentes expansíveis",
          isAvailable: true,
        },
        {
          id: "price",
          name: "Preço",
          icon: CircleDollarSign,
          description: "Exibição de preços e ofertas",
          isAvailable: true,
        },
        {
          id: "compare",
          name: "Comparação",
          icon: Scale,
          description: "Tabelas de comparação",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Desenvolvimento",
      color: "gray",
      components: [
        {
          id: "script",
          name: "Script",
          icon: Code,
          description: "Código JavaScript personalizado",
          isAvailable: true,
        },
        {
          id: "list",
          name: "Lista",
          icon: List,
          description: "Listas ordenadas e não ordenadas",
          isAvailable: true,
        },
        {
          id: "marquee",
          name: "Marquee",
          icon: ArrowRightLeft,
          description: "Texto em movimento horizontal",
          isAvailable: true,
        },
        {
          id: "level",
          name: "Indicador de Nível",
          icon: ChartNoAxesColumnIncreasing,
          description: "Barras de progresso e níveis",
          isAvailable: true,
        },
        {
          id: "cartesian",
          name: "Coordenadas",
          icon: AlignHorizontalDistributeEnd,
          description: "Sistema de coordenadas cartesianas",
          isAvailable: false,
        },
        {
          id: "arguments",
          name: "Argumentos",
          icon: MessageCircleQuestion,
          description: "Argumentos e contra-argumentos",
          isAvailable: false,
        },
        {
          id: "terms",
          name: "Termos",
          icon: Text,
          description: "Termos de uso e políticas",
          isAvailable: false,
        },
      ] as ComponentItem[],
    },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData("componentType", componentType);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleComponentClick = (componentType: string) => {
    onComponentAdd(componentType);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "border-blue-500 bg-blue-50",
      green: "border-green-500 bg-green-50",
      purple: "border-purple-500 bg-purple-50",
      orange: "border-orange-500 bg-orange-50",
      indigo: "border-indigo-500 bg-indigo-50",
      gray: "border-gray-500 bg-gray-50",
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      indigo: "text-indigo-600",
      gray: "text-gray-600",
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-700 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-lg font-semibold text-white">Componentes</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Arraste ou clique para adicionar
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {componentCategories.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.components.map((component) => {
                const Icon = component.icon;
                return (
                  <div
                    key={component.id}
                    draggable={component.isAvailable}
                    onDragStart={(e) =>
                      component.isAvailable && handleDragStart(e, component.id)
                    }
                    onClick={() =>
                      component.isAvailable && handleComponentClick(component.id)
                    }
                    className={`
                      group relative p-3 rounded-lg border transition-all duration-200
                      ${
                        component.isAvailable
                          ? `${getCategoryColor(category.color)} hover:shadow-md cursor-pointer hover:scale-105`
                          : "border-zinc-600 bg-zinc-800 opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`
                        flex-shrink-0 p-2 rounded-md 
                        ${
                          component.isAvailable
                            ? `${getIconColor(category.color)} bg-white`
                            : "text-zinc-500 bg-zinc-700"
                        }
                      `}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`
                          text-sm font-medium mb-1
                          ${component.isAvailable ? "text-zinc-800" : "text-zinc-400"}
                        `}
                        >
                          {component.name}
                        </div>
                        <div
                          className={`
                          text-xs leading-tight
                          ${component.isAvailable ? "text-zinc-600" : "text-zinc-500"}
                        `}
                        >
                          {component.description}
                        </div>
                      </div>
                    </div>

                    {!component.isAvailable && (
                      <div className="absolute top-2 right-2">
                        <div className="text-xs bg-zinc-700 text-zinc-400 px-2 py-1 rounded">
                          Em breve
                        </div>
                      </div>
                    )}

                    {component.isAvailable && (
                      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-zinc-300 transition-all duration-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-700">
        <div className="text-xs text-zinc-500 text-center">
          💡 <strong>Dica:</strong> Arraste os componentes para o canvas ou clique
          para adicionar no final da etapa atual
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;
