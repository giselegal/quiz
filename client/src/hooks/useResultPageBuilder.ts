
import { useState, useCallback } from 'react';
import { ResultPageBlock, ResultPageBlockType } from '@/types/resultPageBlocks';
import { StyleResult } from '@/types/quiz';
import { toast } from '@/components/ui/use-toast';

export const useResultPageBuilder = (primaryStyle: StyleResult, secondaryStyles?: StyleResult[]) => {
  const [blocks, setBlocks] = useState<ResultPageBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getDefaultContentForBlockType = useCallback((type: ResultPageBlockType): any => {
    switch (type) {
      case 'header':
        return {
          header: {
            logo: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            logoHeight: 80,
            userName: "Visitante"
          }
        };
      case 'styleResult':
        return {
          styleResult: {
            description: `Você tem ${primaryStyle.percentage}% de compatibilidade com o estilo ${primaryStyle.category}.`,
            showSecondaryStyles: true
          }
        };
      case 'transformation':
        return {
          transformation: {
            title: "Transformações Reais",
            description: "Veja como outras mulheres transformaram seu estilo com o mesmo guia que você está prestes a receber."
          }
        };
      case 'motivation':
        return {
          motivation: {
            title: "Por que Descobrir seu Estilo é Importante?",
            subtitle: "Transforme sua relação com a moda e desperte sua confiança",
            items: [
              {
                title: "Autoconfiança",
                description: "Sinta-se segura e autêntica em suas escolhas de estilo"
              },
              {
                title: "Economia",
                description: "Compre apenas o que combina com você, sem desperdícios"
              },
              {
                title: "Praticidade",
                description: "Monte looks incríveis em minutos, para qualquer ocasião"
              },
              {
                title: "Clareza",
                description: "Tenha certeza sobre o que funciona para seu corpo e personalidade"
              }
            ]
          }
        };
      case 'bonus':
        return {
          bonus: {
            title: "Bônus Exclusivos",
            bonuses: [
              {
                title: "Guia de Peças Essenciais",
                description: "Descubra as peças-chave que não podem faltar no seu guarda-roupa",
                value: "R$ 79,00"
              },
              {
                title: "Manual de Visagismo",
                description: "Cortes de cabelo e maquiagem ideais para seu rosto",
                value: "R$ 59,00"
              }
            ]
          }
        };
      case 'testimonials':
        return {
          testimonials: {
            title: "O que nossas clientes estão dizendo",
            testimonials: [
              {
                text: "Transformou completamente minha forma de me vestir! Agora sei exatamente o que fica bem em mim.",
                author: "Maria Silva",
                rating: 5,
                location: "São Paulo, SP"
              },
              {
                text: "Nunca mais errei nas compras. O guia é muito prático e fácil de seguir.",
                author: "Ana Costa",
                rating: 5,
                location: "Rio de Janeiro, RJ"
              }
            ]
          }
        };
      case 'guarantee':
        return {
          guarantee: {
            title: "Garantia de Satisfação",
            description: "Se você não ficar 100% satisfeita com o conteúdo nos primeiros 7 dias, devolvemos seu dinheiro integralmente, sem burocracia.",
            days: 7
          }
        };
      case 'mentor':
        return {
          mentor: {
            name: "Gisele Galvão",
            title: "Consultora de Imagem e Estilo",
            description: "Especialista em coloração pessoal com certificação internacional. Mais de 10 anos ajudando mulheres a descobrirem seu estilo único.",
            image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
          }
        };
      case 'cta':
        return {
          cta: {
            title: "Transforme Seu Estilo Hoje",
            subtitle: "Guia Completo + Bônus Exclusivos",
            regularPrice: "R$ 175,00",
            salePrice: "R$ 39,00",
            installments: "5x de R$ 8,83",
            ctaText: "Quero meu Guia de Estilo Agora",
            ctaUrl: "https://pay.hotmart.com/W98977034C"
          }
        };
      case 'footer':
        return {
          footer: {
            companyName: "Gisele Galvão - Consultoria de Imagem",
            links: [
              { text: "Política de Privacidade", url: "/politica-privacidade" },
              { text: "Termos de Uso", url: "/termos-uso" },
              { text: "Contato", url: "/contato" }
            ]
          }
        };
      default:
        return {};
    }
  }, [primaryStyle]);

  const addBlock = useCallback((type: ResultPageBlockType, position?: number) => {
    const blockId = generateId();
    
    const newBlock: ResultPageBlock = {
      id: blockId,
      type,
      content: getDefaultContentForBlockType(type),
      order: position ?? blocks.length,
      visible: true
    };

    setBlocks(prev => {
      const newBlocks = [...prev];
      if (position !== undefined) {
        // Insert at specific position
        newBlocks.splice(position, 0, newBlock);
        // Update order for all blocks after insertion
        return newBlocks.map((block, index) => ({ ...block, order: index }));
      } else {
        // Add to end
        newBlocks.push(newBlock);
        return newBlocks;
      }
    });

    toast({
      title: "Bloco adicionado",
      description: `Bloco ${type} foi adicionado com sucesso.`,
      duration: 2000
    });

    return blockId;
  }, [blocks.length, getDefaultContentForBlockType]);

  const updateBlock = useCallback((blockId: string, updates: Partial<ResultPageBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));

    toast({
      title: "Bloco atualizado",
      description: "As alterações foram salvas.",
      duration: 2000
    });
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }

    toast({
      title: "Bloco removido",
      description: "O bloco foi removido da página.",
      duration: 2000
    });
  }, [selectedBlockId]);

  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(b => b.id === blockId);
      if (blockIndex === -1) return prev;

      const newBlocks = [...prev];
      const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;

      if (targetIndex < 0 || targetIndex >= newBlocks.length) return prev;

      [newBlocks[blockIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[blockIndex]];
      
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });
  }, []);

  const saveConfiguration = useCallback(async () => {
    try {
      const configToSave = {
        styleType: primaryStyle.category,
        blocks: blocks,
        primaryStyle: primaryStyle,
        secondaryStyles: secondaryStyles,
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem(`result-page-builder-${primaryStyle.category}`, JSON.stringify(configToSave));
      
      toast({
        title: "Configuração salva",
        description: "Todas as alterações foram salvas com sucesso.",
        duration: 3000
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
        duration: 5000
      });
      return false;
    }
  }, [blocks, primaryStyle, secondaryStyles]);

  const loadConfiguration = useCallback(() => {
    try {
      const saved = localStorage.getItem(`result-page-builder-${primaryStyle.category}`);
      if (saved) {
        const config = JSON.parse(saved);
        if (config.blocks) {
          setBlocks(config.blocks);
          toast({
            title: "Configuração carregada",
            description: "A configuração salva foi restaurada.",
            duration: 2000
          });
        }
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }, [primaryStyle.category]);

  return {
    blocks,
    selectedBlockId,
    isPreviewMode,
    setSelectedBlockId,
    setIsPreviewMode,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    saveConfiguration,
    loadConfiguration,
    primaryStyle,
    secondaryStyles
  };
};
