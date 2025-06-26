
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { EditorTab } from '../UnifiedVisualEditor';
import { 
  Layout, 
  Type, 
  FileText, 
  Image, 
  CheckSquare, 
  AlertCircle,
  BarChart2,
  Columns,
  MessageCircle,
  Star,
  PanelLeft,
  ArrowRight,
  ShoppingCart,
  CreditCard,
  Tag,
  List,
  Users
} from 'lucide-react';

interface UnifiedComponentsSidebarProps {
  activeTab: EditorTab;
  onComponentSelect: (type: string) => void;
  activeStageType: string | null;
}

interface ComponentItem {
  type: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ComponentGroup {
  title: string;
  items: ComponentItem[];
}

export const UnifiedComponentsSidebar: React.FC<UnifiedComponentsSidebarProps> = ({
  activeTab,
  onComponentSelect,
  activeStageType
}) => {
  // Get the appropriate components based on the active tab
  const getComponentsForTab = (): ComponentGroup[] => {
    switch (activeTab) {
      case 'quiz':
        return getQuizComponents();
      case 'result':
        return getResultComponents();
      case 'sales':
        return getSalesComponents();
      default:
        return [];
    }
  };

  const getQuizComponents = (): ComponentGroup[] => {
    const basicComponents: ComponentGroup = {
      title: 'Componentes Básicos',
      items: [
        {
          type: 'headline',
          name: 'Título',
          icon: <Type className="w-4 h-4" />,
          description: 'Título e subtítulo para seu quiz'
        },
        {
          type: 'text',
          name: 'Texto',
          icon: <FileText className="w-4 h-4" />,
          description: 'Bloco de texto para explicações'
        },
        {
          type: 'image',
          name: 'Imagem',
          icon: <Image className="w-4 h-4" />,
          description: 'Imagem com legenda opcional'
        }
      ]
    };

    // Quiz specific components based on stage type
    if (activeStageType === 'question') {
      return [
        {
          title: 'Componentes de Questão',
          items: [
            {
              type: 'stageQuestion',
              name: 'Questão',
              icon: <AlertCircle className="w-4 h-4" />,
              description: 'Questão principal com opções'
            },
            {
              type: 'singleChoice',
              name: 'Escolha Única',
              icon: <CheckSquare className="w-4 h-4" />,
              description: 'Questão com uma única resposta'
            },
            {
              type: 'multipleChoice',
              name: 'Múltipla Escolha',
              icon: <Columns className="w-4 h-4" />,
              description: 'Questão com várias respostas'
            }
          ]
        },
        basicComponents
      ];
    } else if (activeStageType === 'cover') {
      return [
        {
          title: 'Componentes de Capa',
          items: [
            {
              type: 'stageCover',
              name: 'Capa do Quiz',
              icon: <Layout className="w-4 h-4" />,
              description: 'Capa inicial do quiz com título e imagem'
            }
          ]
        },
        basicComponents
      ];
    } else if (activeStageType === 'result') {
      return [
        {
          title: 'Componentes de Resultado',
          items: [
            {
              type: 'stageResult',
              name: 'Resultado do Quiz',
              icon: <BarChart2 className="w-4 h-4" />,
              description: 'Mostra os resultados do quiz'
            }
          ]
        },
        basicComponents
      ];
    }

    return [basicComponents];
  };

  const getResultComponents = (): ComponentGroup[] => {
    return [
      {
        title: 'Componentes de Resultado',
        items: [
          {
            type: 'header',
            name: 'Cabeçalho',
            icon: <PanelLeft className="w-4 h-4" />,
            description: 'Cabeçalho da página de resultado'
          },
          {
            type: 'resultsSummary',
            name: 'Resumo',
            icon: <BarChart2 className="w-4 h-4" />,
            description: 'Resumo visual dos resultados'
          },
          {
            type: 'styleDescription',
            name: 'Descrição de Estilo',
            icon: <FileText className="w-4 h-4" />,
            description: 'Descrição detalhada do estilo'
          },
          {
            type: 'styleImage',
            name: 'Imagem de Estilo',
            icon: <Image className="w-4 h-4" />,
            description: 'Imagem representativa do estilo'
          },
          {
            type: 'recommendations',
            name: 'Recomendações',
            icon: <Star className="w-4 h-4" />,
            description: 'Dicas e recomendações personalizadas'
          },
          {
            type: 'callToAction',
            name: 'Chamada para Ação',
            icon: <ArrowRight className="w-4 h-4" />,
            description: 'Botão de chamada para ação'
          }
        ]
      },
      {
        title: 'Componentes Básicos',
        items: [
          {
            type: 'headline',
            name: 'Título',
            icon: <Type className="w-4 h-4" />,
            description: 'Título com destaque'
          },
          {
            type: 'text',
            name: 'Texto',
            icon: <FileText className="w-4 h-4" />,
            description: 'Bloco de texto para explicações'
          },
          {
            type: 'image',
            name: 'Imagem',
            icon: <Image className="w-4 h-4" />,
            description: 'Imagem com legenda opcional'
          }
        ]
      }
    ];
  };

  const getSalesComponents = (): ComponentGroup[] => {
    return [
      {
        title: 'Componentes de Página de Vendas',
        items: [
          {
            type: 'hero',
            name: 'Seção Hero',
            icon: <Layout className="w-4 h-4" />,
            description: 'Seção principal com título e imagem'
          },
          {
            type: 'productInfo',
            name: 'Informação do Produto',
            icon: <ShoppingCart className="w-4 h-4" />,
            description: 'Detalhes do produto ou serviço'
          },
          {
            type: 'pricing',
            name: 'Preço',
            icon: <CreditCard className="w-4 h-4" />,
            description: 'Informações de preço e pagamento'
          },
          {
            type: 'benefits',
            name: 'Benefícios',
            icon: <Star className="w-4 h-4" />,
            description: 'Lista de benefícios do produto'
          },
          {
            type: 'testimonials',
            name: 'Depoimentos',
            icon: <MessageCircle className="w-4 h-4" />,
            description: 'Depoimentos de clientes'
          },
          {
            type: 'faq',
            name: 'Perguntas Frequentes',
            icon: <AlertCircle className="w-4 h-4" />,
            description: 'Seção de perguntas frequentes'
          }
        ]
      },
      {
        title: 'Componentes de Conversão',
        items: [
          {
            type: 'callToAction',
            name: 'Chamada para Ação',
            icon: <ArrowRight className="w-4 h-4" />,
            description: 'Botão de chamada para ação'
          },
          {
            type: 'countdown',
            name: 'Contagem Regressiva',
            icon: <AlertCircle className="w-4 h-4" />,
            description: 'Temporizador de urgência'
          },
          {
            type: 'guarantee',
            name: 'Garantia',
            icon: <Tag className="w-4 h-4" />,
            description: 'Política de garantia'
          },
          {
            type: 'featureList',
            name: 'Lista de Recursos',
            icon: <List className="w-4 h-4" />,
            description: 'Lista de recursos ou características'
          },
          {
            type: 'socialProof',
            name: 'Prova Social',
            icon: <Users className="w-4 h-4" />,
            description: 'Prova social para aumentar confiança'
          }
        ]
      }
    ];
  };

  const components = getComponentsForTab();

  return (
    <div className="h-full flex flex-col border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-[#432818]">Componentes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Arraste ou clique para adicionar à página
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {components.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-gray-700">{group.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="flex flex-col h-auto py-3 px-2 items-center justify-center text-center hover:bg-[#B89B7A]/10 hover:border-[#B89B7A]"
                    onClick={() => onComponentSelect(item.type)}
                  >
                    <div className="mb-1.5 text-[#B89B7A]">{item.icon}</div>
                    <span className="text-xs font-medium mb-1">{item.name}</span>
                    <p className="text-[10px] text-gray-500 leading-tight">{item.description}</p>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {activeTab === 'quiz' && !activeStageType && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="w-8 h-8 mb-2 text-amber-500 opacity-80" />
              <p className="text-sm text-gray-600 mb-1">
                Selecione uma etapa do quiz para visualizar os componentes disponíveis.
              </p>
              <p className="text-xs text-gray-500">
                Cada tipo de etapa tem componentes específicos.
              </p>
            </div>
          )}
          
          {components.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="w-8 h-8 mb-2 text-amber-500 opacity-80" />
              <p className="text-sm text-gray-600">
                Nenhum componente disponível para esta seção.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
