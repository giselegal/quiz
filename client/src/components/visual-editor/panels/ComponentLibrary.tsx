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

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentAdd,
}) => {
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
      name: "Notificações",
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
          category: "Notificações",
          icon: LoaderCircle,
          description: "Indicadores de progresso e carregamento",
          isAvailable: true,
        },
        {
          id: "testimonial",
          name: "Depoimento",
          category: "Notificações",
          icon: Quote,
          description: "Citações e depoimentos de clientes",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Análise",
      color: "cyan",
      components: [
        {
          id: "charts",
          name: "Gráficos",
          category: "Análise",
          icon: ChartArea,
          description: "Visualização de dados em gráficos",
          isAvailable: true,
        },
        {
          id: "progress",
          name: "Barra de Progresso",
          category: "Análise",
          icon: ChartNoAxesColumnIncreasing,
          description: "Indicadores de progresso do quiz",
          isAvailable: true,
        },
        {
          id: "score",
          name: "Pontuação",
          category: "Análise",
          icon: Scale,
          description: "Exibição de pontuação e resultados",
          isAvailable: true,
        },
      ] as ComponentItem[],
    },
    {
      name: "Avançado",
      color: "red",
      components: [
        {
          id: "script",
          name: "Script",
          category: "Avançado",
          icon: Code,
          description: "Código JavaScript personalizado",
          isAvailable: true,
        },
        {
          id: "customComponent",
          name: "Componente Personalizado",
          category: "Avançado",
          icon: Sparkles,
          description: "Componentes React personalizados",
          isAvailable: false,
        },
        {
          id: "conditionalLogic",
          name: "Lógica Condicional",
          category: "Avançado",
          icon: ArrowRightLeft,
          description: "Fluxo e ramificação de quiz",
          isAvailable: false,
        },
        {
          id: "leadCapture",
          name: "Captura de Lead",
          category: "Avançado",
          icon: CircleDollarSign,
          description: "Formulários de captura e CRM",
          isAvailable: false,
        },
        {
          id: "quizLogic",
          name: "Lógica de Quiz",
          category: "Avançado",
          icon: MessageCircleQuestion,
          description: "Pontuação e resultados complexos",
          isAvailable: false,
        },
        {
          id: "listBuilder",
          name: "Construtor de Lista",
          category: "Avançado",
          icon: List,
          description: "Listas dinâmicas e repetição",
          isAvailable: false,
        },
      ] as ComponentItem[],
    },
  ];

  return (
    <div className="w-64 h-full bg-zinc-900 border-r border-zinc-700 overflow-y-auto">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-lg font-semibold text-white mb-2">Componentes</h2>
        <p className="text-sm text-zinc-400">
          Arraste os componentes para o canvas
        </p>
      </div>

      <div className="p-2 space-y-4">
        {componentCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <div
                className={`w-2 h-2 rounded-full bg-${category.color}-500`}
              ></div>
              <h3 className="text-sm font-medium text-zinc-300">
                {category.name}
              </h3>
              <span className="text-xs text-zinc-500">
                {category.components.filter((c) => c.isAvailable).length}
              </span>
            </div>

            <div className="grid gap-1">
              {category.components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => {
                    if (component.isAvailable) {
                      onComponentAdd(component.id);
                    }
                  }}
                  disabled={!component.isAvailable}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg text-left transition-all
                    ${
                      component.isAvailable
                        ? "text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer"
                        : "text-zinc-600 cursor-not-allowed opacity-50"
                    }
                  `}
                  title={
                    component.isAvailable
                      ? `Adicionar ${component.name}`
                      : `${component.name} - Em breve`
                  }
                >
                  <component.icon size={16} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {component.name}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {component.description}
                    </div>
                  </div>
                  {!component.isAvailable && (
                    <div className="text-xs bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded text-center">
                      Em breve
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-700 mt-4">
        <div className="text-xs text-zinc-500 space-y-1">
          <div>💡 Dica: Arraste os componentes para adicioná-los</div>
          <div>🎨 Use o painel direito para configurar</div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;
