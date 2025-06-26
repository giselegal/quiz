
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { QuizComponentType, QuizStage } from '@/types/quizBuilder';
import { FileText, Image, SquareStack, Type, AlignLeft, CheckSquare, ListFilter, Calendar, HelpCircle, FileCheck, CreditCard } from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: QuizComponentType) => void;
  activeStage: QuizStage | null;
}

interface ComponentGroup {
  title: string;
  items: {
    type: QuizComponentType;
    name: string;
    icon: React.ReactNode;
    description: string;
  }[];
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onComponentSelect,
  activeStage
}) => {
  // Basic components available for all stage types
  const basicComponents: ComponentGroup = {
    title: 'Básicos',
    items: [
      {
        type: 'header',
        name: 'Cabeçalho',
        icon: <Type className="w-4 h-4" />,
        description: 'Título principal e subtítulo'
      },
      {
        type: 'headline',
        name: 'Título',
        icon: <AlignLeft className="w-4 h-4" />,
        description: 'Título de seção e subtítulo'
      },
      {
        type: 'text',
        name: 'Texto',
        icon: <FileText className="w-4 h-4" />,
        description: 'Bloco de texto simples'
      },
      {
        type: 'image',
        name: 'Imagem',
        icon: <Image className="w-4 h-4" />,
        description: 'Imagem com legenda'
      }
    ]
  };

  // Get components based on active stage type
  const getStageComponents = (): ComponentGroup => {
    if (!activeStage) {
      return { title: 'Componentes de Etapa', items: [] };
    }

    switch (activeStage.type) {
      case 'cover':
        return {
          title: 'Componentes de Capa',
          items: [
            {
              type: 'image',
              name: 'Imagem de Fundo',
              icon: <Image className="w-4 h-4" />,
              description: 'Imagem de fundo para a capa'
            },
            {
              type: 'text',
              name: 'Descrição',
              icon: <FileText className="w-4 h-4" />,
              description: 'Texto descritivo para a capa'
            }
          ]
        };
      case 'question':
        return {
          title: 'Componentes de Questão',
          items: [
            {
              type: 'multipleChoice',
              name: 'Múltipla Escolha',
              icon: <CheckSquare className="w-4 h-4" />,
              description: 'Questão com várias opções'
            },
            {
              type: 'singleChoice',
              name: 'Escolha Única',
              icon: <SquareStack className="w-4 h-4" />,
              description: 'Questão com uma opção'
            },
            {
              type: 'scale',
              name: 'Escala',
              icon: <ListFilter className="w-4 h-4" />,
              description: 'Questão com escala numérica'
            }
          ]
        };
      case 'result':
        return {
          title: 'Componentes de Resultado',
          items: [
            {
              type: 'quizResult',
              name: 'Resultado Principal',
              icon: <FileCheck className="w-4 h-4" />,
              description: 'Mostra o resultado principal do quiz'
            },
            {
              type: 'benefitsList',
              name: 'Lista de Benefícios',
              icon: <CheckSquare className="w-4 h-4" />,
              description: 'Lista de benefícios do produto'
            },
            {
              type: 'faq',
              name: 'Perguntas Frequentes',
              icon: <HelpCircle className="w-4 h-4" />,
              description: 'Seção de perguntas frequentes'
            }
          ]
        };
      default:
        return { title: 'Componentes', items: [] };
    }
  };

  const stageComponents = getStageComponents();

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-[#432818]">Componentes</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {!activeStage ? (
            <div className="flex flex-col items-center justify-center h-32 text-center p-4">
              <p className="text-gray-500">
                Selecione uma etapa para adicionar componentes
              </p>
            </div>
          ) : (
            <>
              {/* Stage-specific components */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-gray-700">{stageComponents.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {stageComponents.items.map((item) => (
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
              
              {/* Basic components */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-700">{basicComponents.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {basicComponents.items.map((item) => (
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
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
