
import { EditorBlock } from '@/types/editor';

export const getDefaultContentForType = (type: EditorBlock['type']) => {
  switch (type) {
    case 'result-header':
      return {
        userName: '',
        primaryStyle: {
          category: 'Natural',
          percentage: 85
        },
        secondaryStyles: [
          { category: 'Clássico', percentage: 12 },
          { category: 'Contemporâneo', percentage: 8 }
        ],
        showPersonalization: true,
        showSecondaryStyles: true
      };

    case 'transition':
      return {
        title: 'Chegou o Momento de Agir',
        description: 'Não deixe para depois a transformação que você pode começar agora!',
        showDecorations: true,
        backgroundColor: '#f8f9fa'
      };

    case 'final-cta':
      return {
        products: [
          {
            id: 'manual-personalizado',
            name: 'Manual de Estilo Personalizado',
            description: 'Guia completo do seu estilo com dicas exclusivas',
            originalPrice: 97,
            salePrice: 39.90
          },
          {
            id: 'bonus-1',
            name: 'Bônus: Guia de Cores',
            description: 'Descubra as cores que mais valorizam você',
            originalPrice: 47,
            salePrice: 0
          },
          {
            id: 'bonus-2',
            name: 'Bônus: Checklist de Compras',
            description: 'Lista prática para renovar seu guarda-roupa',
            originalPrice: 27,
            salePrice: 0
          }
        ],
        timer: {
          enabled: true,
          duration: 30,
          message: 'Oferta válida por tempo limitado!'
        },
        discount: {
          percentage: 75,
          message: '75% OFF - Apenas hoje!'
        },
        buttonText: 'QUERO TRANSFORMAR MEU ESTILO AGORA',
        buttonColor: '#22c55e',
        hotmartUrl: ''
      };

    case 'header':
      return {
        title: 'Título Principal',
        subtitle: 'Subtítulo explicativo',
        showLogo: true
      };

    case 'hero-section':
      return {
        title: 'Transforme seu estilo',
        subtitle: 'Descubra seu potencial único',
        buttonText: 'Começar Agora',
        backgroundImage: '',
        showButton: true
      };

    case 'bonus-carousel':
      return {
        title: 'Bônus Exclusivos',
        bonuses: [
          { title: 'Bônus 1', description: 'Descrição do primeiro bônus' },
          { title: 'Bônus 2', description: 'Descrição do segundo bônus' }
        ]
      };

    case 'headline':
      return {
        title: 'Seu Título Aqui',
        subtitle: 'Subtítulo complementar',
        alignment: 'center' as const
      };

    case 'text':
      return {
        content: 'Adicione seu texto aqui. Você pode usar **negrito** e *itálico* para destacar partes importantes.',
        alignment: 'left' as const
      };

    case 'benefits':
      return {
        title: 'Benefícios',
        benefits: [
          'Benefício 1',
          'Benefício 2', 
          'Benefício 3'
        ]
      };

    case 'testimonials':
      return {
        title: 'O que nossos clientes dizem',
        testimonials: [
          {
            name: 'Maria Silva',
            content: 'Excelente produto!',
            image: '',
            rating: 5
          }
        ]
      };

    case 'pricing':
      return {
        title: 'Escolha seu plano',
        plans: [
          {
            name: 'Básico',
            price: 'R$ 97',
            features: ['Recurso 1', 'Recurso 2']
          }
        ]
      };

    case 'guarantee':
      return {
        title: 'Garantia de Satisfação',
        description: 'Garantia de 30 dias ou seu dinheiro de volta',
        period: '30 dias'
      };

    case 'cta':
      return {
        title: 'Pronto para começar?',
        buttonText: 'Clique Aqui',
        buttonUrl: '#',
        description: 'Não perca esta oportunidade!'
      };

    default:
      return {};
  }
};
