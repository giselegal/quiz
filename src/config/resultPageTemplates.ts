export const defaultResultTemplate = {
  styleType: 'default', // Adicionado styleType
  header: {
    content: {
      title: 'Seu Estilo Predominante',
      subtitle: 'Descubra mais sobre seu estilo único e como aproveitar ao máximo suas características'
    },
    style: {
      paddingY: '24',
      paddingX: '16',
      backgroundColor: '#FAF9F7',
      textColor: '#432818',
      borderRadius: '0' // Changed from number to string
    },
    visible: true
  },
  mainContent: {
    content: {
      description: 'Aqui será exibida uma descrição detalhada do seu estilo predominante, com características, recomendações e dicas personalizadas.',
      mainImage: 'https://placehold.co/600x400?text=Estilo+Predominante',
      tabletImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      showSecondaryStyles: true,
      showOffer: true
    },
    style: {
      padding: '20px',
      backgroundColor: '#FFFFFF',
      textColor: '#432818'
    },
    visible: true
  },
  offer: {
    content: {
      title: 'Guia de Estilo e Imagem Personalizado',
      description: 'Adquira seu guia completo com análise detalhada, paleta de cores personalizada e recomendações de peças específicas para o seu tipo de estilo.',
      features: [
        'Análise detalhada do seu estilo pessoal',
        'Paleta de cores personalizada',
        'Guia de peças essenciais para o seu guarda-roupa',
        'Dicas de tecidos e modelagens ideais'
      ],
      ctaText: 'Adquirir meu Guia de Estilo',
      ctaLink: '#',
      price: 'R$ 97,00',
      discountPrice: 'R$ 67,00'
    },
    style: {
      padding: '24px',
      backgroundColor: '#FAF9F7',
      accentColor: '#B89B7A',
      textColor: '#432818'
    },
    visible: true
  }
};

export const directOfferTemplate = {
  styleType: 'direct-offer', // Adicionado styleType
  header: {
    content: {
      title: 'Oferta Exclusiva Para Você!',
      subtitle: 'Descubra como transformar seu estilo com nosso guia especializado.'
    },
    style: {
      paddingY: '24',
      paddingX: '16',
      backgroundColor: '#FAF9F7',
      textColor: '#432818',
      borderRadius: '0'
    },
    visible: true
  },
  mainContent: { // Adicionado mainContent mínimo e oculto
    content: {},
    style: { padding: '0' },
    visible: false
  },
  offer: { // Reestruturado para OfferSection
    hero: {
      visible: true,
      content: { // OfferContent
        title: 'Transforme Seu Estilo Hoje Mesmo',
        description: 'Acesse nosso Guia Completo de Estilo e Imagem, desenvolvido por especialistas para revelar a melhor versão de você.',
        ctaText: 'Quero Meu Guia Agora!',
        ctaUrl: '#pagina-de-checkout', // Atualize com o link real do checkout
        // As 'features' do modelo simples podem ser mapeadas para 'benefitItems' ou um bloco customizado depois
      },
      style: {
        padding: '24px',
        backgroundColor: '#FFFFFF',
        // accentColor: '#B89B7A', // accentColor não é padrão em StyleOptions, tratar no componente ou remover
        textColor: '#432818'
      }
    },
    benefits: { visible: true, content: { title: 'Principais Benefícios', items: [ { title: 'Análise de estilo aprofundada', description: ''}, { title: 'Paleta de cores ideal para você', description: ''}, { title: 'Recomendações de looks e peças-chave', description: ''}, { title: 'Dicas práticas para o dia a dia', description: ''} ] }, style: { padding: '20px', backgroundColor: '#FAF9F7'} },
    products: { visible: false, content: {}, style: {} }, // Pode ser usado para mostrar o que está incluído
    pricing: {
      visible: true,
      content: { // OfferContent
        // title: 'Condição Especial', // Título opcional para a seção de preço
        price: 'R$ 97,00 (Oferta Especial!)', // Mapeado para OfferContent.price
        regularPrice: 'R$ 197,00', // Mapeado para OfferContent.regularPrice
        ctaText: 'Quero Meu Guia Agora!', // CTA pode ser repetido ou específico para preço
        ctaUrl: '#pagina-de-checkout',
      },
      style: { padding: '24px', backgroundColor: '#FDFDFD', textAlign: 'center' }
    },
    testimonials: { visible: false, content: {}, style: {} }, // Adicionar depoimentos se desejar
    guarantee: { visible: false, content: {}, style: {} }    // Adicionar garantia se desejar
  },
  globalStyles: { // Adicionar se quiser substituir os padrões do EditorPage
    // primaryColor: '#B89B7A',
    // backgroundColor: '#FFFFFF',
  },
  blocks: [] // Se este template usar o sistema de blocos do editor visual
  // Você pode adicionar mais seções/blocos aqui conforme necessário,
  // ...existing code...
};
