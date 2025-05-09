import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EditorTab } from '../UnifiedVisualEditor';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Dummy template data - in a real application, these would come from an API or database
const quizTemplates = [
  { 
    id: 'quiz-template-1', 
    title: 'Quiz Básico', 
    description: 'Template básico com capa, perguntas e resultado', 
    thumbnail: 'https://via.placeholder.com/150?text=Quiz+Basico',
    stages: [
      { id: 'stage-cover', title: 'Capa', type: 'cover', order: 0 },
      { id: 'stage-q1', title: 'Pergunta 1', type: 'question', order: 1 },
      { id: 'stage-result', title: 'Resultado', type: 'result', order: 2 }
    ],
    components: []
  },
  { 
    id: 'quiz-template-2', 
    title: 'Quiz de Estilo', 
    description: 'Template para quiz de estilo pessoal', 
    thumbnail: 'https://via.placeholder.com/150?text=Quiz+Estilo',
    stages: [
      { id: 'stage-cover', title: 'Capa', type: 'cover', order: 0 },
      { id: 'stage-q1', title: 'Pergunta 1', type: 'question', order: 1 },
      { id: 'stage-q2', title: 'Pergunta 2', type: 'question', order: 2 },
      { id: 'stage-q3', title: 'Pergunta 3', type: 'question', order: 3 },
      { id: 'stage-result', title: 'Resultado', type: 'result', order: 4 }
    ],
    components: []
  }
];

const resultTemplates = [
  { 
    id: 'result-template-1', 
    title: 'Resultado Elegante', 
    description: 'Design elegante para página de resultados', 
    thumbnail: 'https://via.placeholder.com/150?text=Resultado+Elegante',
    styleType: 'Elegante',
    blocks: [
      { id: 'block-header', type: 'header', content: { title: 'Seu Estilo é Elegante', style: {} } },
      { id: 'block-desc', type: 'styleDescription', content: { description: 'Descrição do estilo elegante', style: {} } }
    ]
  },
  { 
    id: 'result-template-2', 
    title: 'Resultado Contemporâneo', 
    description: 'Design contemporâneo para página de resultados', 
    thumbnail: 'https://via.placeholder.com/150?text=Resultado+Contemporaneo',
    styleType: 'Contemporâneo',
    blocks: [
      { id: 'block-header', type: 'header', content: { title: 'Seu Estilo é Contemporâneo', style: {} } },
      { id: 'block-desc', type: 'styleDescription', content: { description: 'Descrição do estilo contemporâneo', style: {} } }
    ]
  }
];

const salesTemplates = [
  { 
    id: 'sales-template-1', 
    title: 'Página de Vendas Básica', 
    description: 'Template básico para página de vendas', 
    thumbnail: 'https://via.placeholder.com/150?text=Vendas+Basica',
    blocks: [
      { id: 'block-hero', type: 'hero', content: { title: 'Título do Produto', description: 'Descrição do produto', style: {} } },
      { id: 'block-pricing', type: 'pricing', content: { price: 'R$ 97,00', installments: '12x R$ 8,90', style: {} } }
    ]
  }
];

interface TemplateCardProps {
  title: string;
  description: string;
  thumbnail: string;
  onApply: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, description, thumbnail, onApply }) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`;
          }}
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-2">
        <Button onClick={onApply} className="w-full">Aplicar Template</Button>
      </CardFooter>
    </Card>
  );
};

interface UnifiedTemplateModalProps {
  activeTab: EditorTab;
  onClose: () => void;
  onApplyTemplate: (templateData: any) => boolean;
}

export const UnifiedTemplateModal: React.FC<UnifiedTemplateModalProps> = ({
  activeTab,
  onClose,
  onApplyTemplate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const getTemplatesForTab = () => {
    switch (activeTab) {
      case 'quiz':
        return quizTemplates;
      case 'result':
        return resultTemplates;
      case 'sales':
        return salesTemplates;
      default:
        return [];
    }
  };

  const handleApplyTemplate = (template: any) => {
    setIsLoading(true);
    setSelectedTemplate(template);
    
    // Simulate API request
    setTimeout(() => {
      try {
        const success = onApplyTemplate(template);
        
        if (success) {
          toast({
            title: "Template aplicado com sucesso",
            description: `O template "${template.title}" foi aplicado ao editor de ${
              activeTab === 'quiz' ? 'Quiz' : activeTab === 'result' ? 'Resultado' : 'Página de Vendas'
            }.`,
          });
          onClose();
        } else {
          toast({
            title: "Erro ao aplicar template",
            description: "Não foi possível aplicar o template selecionado.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao aplicar template:', error);
        toast({
          title: "Erro ao aplicar template",
          description: "Ocorreu um erro inesperado ao aplicar o template.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setSelectedTemplate(null);
      }
    }, 1000);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Escolha um Template para {activeTab === 'quiz' ? 'Quiz' : activeTab === 'result' ? 'Página de Resultado' : 'Página de Vendas'}
          </DialogTitle>
          <DialogDescription>
            Selecione um template para começar. Você poderá personalizar todos os elementos depois.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="flex-1 flex flex-col mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                {getTemplatesForTab().map((template) => (
                  <TemplateCard
                    key={template.id}
                    title={template.title}
                    description={template.description}
                    thumbnail={template.thumbnail}
                    onApply={() => handleApplyTemplate(template)}
                  />
                ))}
                {getTemplatesForTab().length === 0 && (
                  <div className="col-span-3 py-12 text-center">
                    <p className="text-gray-500">Nenhum template disponível para este tipo de editor.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-0">
              <div className="py-12 text-center">
                <p className="text-gray-500">Você ainda não tem templates favoritos.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-0">
              <div className="py-12 text-center">
                <p className="text-gray-500">Você não usou nenhum template recentemente.</p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <LoadingSpinner size="lg" color="#B89B7A" className="mb-2" />
              <p>Aplicando template...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
