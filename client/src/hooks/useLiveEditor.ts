import { useState, useCallback, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';
import { quizQuestions } from '@/data/quizQuestions';
import { strategicQuestions } from '@/data/strategicQuestions';
import { styleConfig } from '@/config/styleConfig';

export interface EditorStage {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'result' | 'offer';
  order: number;
  components: EditorComponent[];
  settings: Record<string, any>;
}

export interface EditorComponent {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const createIntroStage = (): EditorStage => ({
  id: 'intro',
  name: 'Introdução',
  type: 'intro',
  order: 0,
  components: [
    {
      id: 'intro-hero',
      type: 'hero',
      content: {
        title: 'Descubra Seu Estilo Único',
        subtitle: 'Responda ao quiz e encontre sua identidade visual personalizada',
        buttonText: 'Começar Quiz',
        backgroundImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp'
      },
      style: {
        backgroundColor: '#FAF9F7',
        textColor: '#432818'
      },
      position: { x: 0, y: 0 },
      size: { width: 100, height: 400 }
    }
  ],
  settings: {}
});

const createQuestionStages = (): EditorStage[] => {
  const stages: EditorStage[] = [];
  
  // Regular quiz questions (1-10)
  quizQuestions.forEach((question, index) => {
    stages.push({
      id: `question-${question.id}`,
      name: `Questão ${index + 1}`,
      type: 'question',
      order: index + 1,
      components: [
        {
          id: `question-title-${question.id}`,
          type: 'question-title',
          content: {
            text: question.title,
            selections: question.multiSelect
          },
          style: {},
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 }
        },
        ...(question.imageUrl ? [{
          id: `question-image-${question.id}`,
          type: 'image',
          content: {
            src: question.imageUrl,
            alt: `Imagem da questão ${index + 1}`
          },
          style: {},
          position: { x: 0, y: 100 },
          size: { width: 100, height: 200 }
        }] : []),
        {
          id: `options-grid-${question.id}`,
          type: 'options-grid',
          content: {
            options: question.options.map(option => ({
              id: option.id,
              text: option.text,
              imageUrl: option.imageUrl,
              styleCategory: option.styleCategory,
              points: option.points || 1
            }))
          },
          style: {},
          position: { x: 0, y: question.imageUrl ? 300 : 100 },
          size: { width: 100, height: 300 }
        }
      ],
      settings: {
        questionIndex: index,
        questionType: question.type,
        multiSelect: question.multiSelect
      }
    });
  });

  // Strategic questions (11-17)
  strategicQuestions.forEach((question, index) => {
    stages.push({
      id: `strategic-${question.id}`,
      name: `Questão Estratégica ${index + 1}`,
      type: 'question',
      order: quizQuestions.length + index + 1,
      components: [
        {
          id: `strategic-title-${question.id}`,
          type: 'question-title',
          content: {
            text: question.title,
            selections: question.multiSelect
          },
          style: {},
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 }
        },
        ...(question.imageUrl ? [{
          id: `strategic-image-${question.id}`,
          type: 'image',
          content: {
            src: question.imageUrl,
            alt: `Imagem da questão estratégica ${index + 1}`
          },
          style: {},
          position: { x: 0, y: 100 },
          size: { width: 100, height: 200 }
        }] : []),
        {
          id: `strategic-options-${question.id}`,
          type: 'options-grid',
          content: {
            options: question.options.map(option => ({
              id: option.id,
              text: option.text,
              styleCategory: 'Strategic'
            }))
          },
          style: {},
          position: { x: 0, y: question.imageUrl ? 300 : 100 },
          size: { width: 100, height: 200 }
        }
      ],
      settings: {
        questionIndex: index,
        isStrategic: true,
        multiSelect: question.multiSelect
      }
    });
  });

  return stages;
};

const createResultStage = (): EditorStage => ({
  id: 'result',
  name: 'Resultado',
  type: 'result',
  order: 50,
  components: [
    {
      id: 'result-header',
      type: 'result-header',
      content: {
        title: 'Seu Estilo Predominante',
        subtitle: 'Descubra mais sobre seu estilo único'
      },
      style: {},
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 }
    },
    {
      id: 'style-card',
      type: 'style-card',
      content: {
        showAllStyles: true,
        styles: Object.entries(styleConfig).map(([key, config]) => ({
          category: key,
          name: key,
          description: config.description,
          image: config.guideImage,
          characteristics: []
        }))
      },
      style: {},
      position: { x: 0, y: 100 },
      size: { width: 100, height: 400 }
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      content: {
        testimonials: [
          {
            text: "O guia transformou completamente minha forma de me vestir. Agora sei exatamente o que comprar e como combinar!",
            author: "Maria Silva",
            rating: 5,
            image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744923890/testimonial1_vw8gzx.webp"
          },
          {
            text: "Finalmente encontrei meu estilo! As dicas são práticas e fáceis de aplicar no dia a dia.",
            author: "Ana Costa",
            rating: 5,
            image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744923891/testimonial2_kx9pql.webp"
          }
        ]
      },
      style: {},
      position: { x: 0, y: 500 },
      size: { width: 100, height: 200 }
    }
  ],
  settings: {}
});

const createOfferStage = (): EditorStage => ({
  id: 'offer',
  name: 'Oferta',
  type: 'offer',
  order: 51,
  components: [
    {
      id: 'offer-hero',
      type: 'hero',
      content: {
        title: 'Guia de Estilo e Imagem Personalizado',
        subtitle: 'Transforme seu guarda-roupa com orientação profissional',
        buttonText: 'Adquirir Agora'
      },
      style: {},
      position: { x: 0, y: 0 },
      size: { width: 100, height: 200 }
    },
    {
      id: 'pricing-main',
      type: 'pricing',
      content: {
        title: 'Oferta Especial',
        price: '67',
        originalPrice: '197',
        buttonText: 'Comprar Agora',
        features: [
          'Análise completa do seu estilo pessoal',
          'Paleta de cores personalizada',
          'Guia de peças essenciais',
          'Dicas de tecidos e modelagens',
          'Suporte por 30 dias'
        ],
        hotmartUrl: 'https://pay.hotmart.com/your-product-url'
      },
      style: {},
      position: { x: 0, y: 200 },
      size: { width: 100, height: 300 }
    },
    {
      id: 'product-grid',
      type: 'product-grid',
      content: {
        products: [
          {
            name: 'Guia Natural',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
            description: 'Para quem prefere conforto e praticidade'
          },
          {
            name: 'Guia Clássico',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
            description: 'Elegância atemporal e sofisticada'
          },
          {
            name: 'Guia Romântico',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
            description: 'Feminino, delicado e encantador'
          }
        ]
      },
      style: {},
      position: { x: 0, y: 500 },
      size: { width: 100, height: 250 }
    },
    {
      id: 'guarantee',
      type: 'guarantee',
      content: {
        title: 'Garantia de 7 dias',
        description: 'Se não ficar satisfeita, devolvemos 100% do seu dinheiro',
        icon: '🛡️'
      },
      style: {},
      position: { x: 0, y: 750 },
      size: { width: 100, height: 100 }
    }
  ],
  settings: {}
});

export const useLiveEditor = () => {
  const [stages, setStages] = useState<EditorStage[]>([]);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Initialize with real quiz data
  useEffect(() => {
    const realStages: EditorStage[] = [
      createIntroStage(),
      ...createQuestionStages(),
      createResultStage(),
      createOfferStage()
    ];

    setStages(realStages);
    setActiveStageId('intro');
  }, []);

  const setActiveStage = useCallback((stageId: string) => {
    setActiveStageId(stageId);
    setSelectedComponentId(null);
  }, []);

  const setSelectedComponent = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);
  }, []);

  const addStage = useCallback((stage: EditorStage) => {
    setStages(prev => [...prev, stage].sort((a, b) => a.order - b.order));
  }, []);

  const updateStage = useCallback((stageId: string, updates: Partial<EditorStage>) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ));
  }, []);

  const deleteStage = useCallback((stageId: string) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
    if (activeStageId === stageId) {
      setActiveStageId(stages[0]?.id || null);
    }
  }, [activeStageId, stages]);

  const addComponent = useCallback((stageId: string, component: EditorComponent) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? { ...stage, components: [...stage.components, component] }
        : stage
    ));
  }, []);

  const updateComponent = useCallback((stageId: string, componentId: string, updates: Partial<EditorComponent>) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? {
            ...stage,
            components: stage.components.map(comp => 
              comp.id === componentId ? { ...comp, ...updates } : comp
            )
          }
        : stage
    ));
  }, []);

  const deleteComponent = useCallback((stageId: string, componentId: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? { ...stage, components: stage.components.filter(comp => comp.id !== componentId) }
        : stage
    ));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const togglePreview = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const saveEditor = useCallback(async () => {
    const editorData = {
      stages,
      activeStageId,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('liveQuizEditor', JSON.stringify(editorData));
    console.log('Editor saved:', editorData);
  }, [stages, activeStageId]);

  const loadEditor = useCallback(() => {
    const savedData = localStorage.getItem('liveQuizEditor');
    if (savedData) {
      const data = JSON.parse(savedData);
      setStages(data.stages || []);
      setActiveStageId(data.activeStageId || null);
    }
  }, []);

  return {
    stages,
    activeStageId,
    selectedComponentId,
    isPreviewMode,
    setActiveStage,
    setSelectedComponent,
    addStage,
    updateStage,
    deleteStage,
    addComponent,
    updateComponent,
    deleteComponent,
    togglePreview,
    saveEditor,
    loadEditor
  };
};
