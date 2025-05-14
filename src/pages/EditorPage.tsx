
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResultPageVisualEditor } from '@/components/result-editor/ResultPageVisualEditor';
import { TemplateList } from '@/components/editor/templates/TemplateList';
import { Button } from '@/components/ui/button';
// Importar ambos os templates
import { defaultResultTemplate, directOfferTemplate } from '@/config/resultPageTemplates';
import { ResultPageConfig } from '@/types/resultPageConfig'; // Para tipagem explícita

export const EditorPage = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  // Adicionar pageType aos parâmetros da rota
  const { pageType, style } = useParams<{ pageType?: string; style?: string }>();
  
  const styleCategory = (style as "Natural" | "Clássico" | "Contemporâneo" | "Elegante" | "Romântico" | "Sexy" | "Dramático" | "Criativo") || 'Natural';
  
  // Determinar qual template base usar
  let templateToUse = defaultResultTemplate;
  if (pageType === 'direct-offer') {
    templateToUse = directOfferTemplate;
  }
  
  // Construir initialConfig com base no template selecionado
  const initialConfig: ResultPageConfig = {
    styleType: styleCategory,
    // Assumindo que header sempre existe nos templates base
    header: {
      ...(templateToUse.header || {}),
      style: {
        ...(templateToUse.header?.style || {}),
        borderRadius: '0' // Consistência
      },
      // Garantir que seja uma Section válida
      visible: true,
      content: templateToUse.header?.content || { title: 'Seu Resultado', logo: '' }
    },
    
    // Incluir mainContent com a estrutura correta e garantir todas as propriedades exigidas
    mainContent: {
      visible: templateToUse.mainContent?.visible !== undefined ? templateToUse.mainContent.visible : true,
      content: {
        introText: `Conheça seu estilo ${styleCategory}!`,
        benefits: [],
        description: templateToUse.mainContent?.content?.description || `Descrição do estilo ${styleCategory}`,
        mainImage: templateToUse.mainContent?.content?.mainImage || '',
        tabletImage: templateToUse.mainContent?.content?.tabletImage || '',
        showSecondaryStyles: templateToUse.mainContent?.content?.showSecondaryStyles || false,
        showOffer: templateToUse.mainContent?.content?.showOffer || true
      },
      style: templateToUse.mainContent?.style || {
        padding: '2rem 1rem',
        backgroundColor: '#FFFFFF'
      }
    },
    
    // Estruturar offer conforme o tipo OfferSection
    offer: {
      hero: {
        visible: true,
        content: {
          title: 'Transforme seu Guarda-Roupa',
          subtitle: 'Aprenda a vestir-se de acordo com sua personalidade',
          description: 'Com o Guia Completo de Estilo',
          heroImage: ''
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FFFFFF'
        }
      },
      benefits: {
        visible: true,
        content: {
          title: 'O que você vai aprender',
          items: []
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FAF9F7'
        }
      },
      products: {
        visible: true,
        content: {
          title: 'O que está incluído',
          items: []
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FFFFFF'
        }
      },
      pricing: {
        visible: true,
        content: {
          title: 'Invista em seu estilo pessoal',
          price: 'R$ 97,00',
          regularPrice: 'R$ 197,00',
          ctaText: 'Quero Transformar Meu Estilo',
          ctaUrl: '#comprar-agora'
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FAF9F7',
          textAlign: 'center'
        }
      },
      testimonials: {
        visible: true,
        content: {
          title: 'O que dizem nossos clientes',
          testimonials: []
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FFFFFF'
        }
      },
      guarantee: {
        visible: true,
        content: {
          title: 'Garantia de 7 dias',
          description: 'Se você não ficar satisfeito com o material, devolvemos seu dinheiro integralmente em até 7 dias após a compra.',
          image: ''
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FAF9F7',
          textAlign: 'center'
        }
      }
    },
    
    // Adicionar secondaryStyles que está faltando na interface ResultPageConfig
    secondaryStyles: {
      visible: true,
      content: {
        title: 'Seus estilos secundários',
        description: 'Estes estilos complementam seu estilo principal'
      },
      style: {
        padding: '1rem',
        backgroundColor: '#FFFFFF'
      }
    },

    globalStyles: {
      primaryColor: '#B89B7A',
      secondaryColor: '#432818',
      textColor: '#432818',
      backgroundColor: '#FAF9F7',
      fontFamily: 'Playfair Display, serif'
    },
    
    // Adicionar blocks que está faltando na interface ResultPageConfig
    blocks: [] 
  };
  
  return (
    <div className="h-screen">
      {showTemplates ? (
        <div className="p-8 max-w-4xl mx-auto">
          <Button
            onClick={() => setShowTemplates(false)}
            variant="outline"
            className="mb-4"
          >
            Voltar ao Editor
          </Button>
          <TemplateList onSelectTemplate={() => setShowTemplates(false)} />
        </div>
      ) : (
        <ResultPageVisualEditor 
          selectedStyle={{ // selectedStyle ainda é necessário pelo ResultPageVisualEditor
            category: styleCategory,
            score: 100,
            percentage: 100
          }} 
          onShowTemplates={() => setShowTemplates(true)}
          initialConfig={initialConfig} // Passar a configuração dinâmica
        />
      )}
    </div>
  );
};

export default EditorPage;
