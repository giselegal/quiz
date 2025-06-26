
import { QuizTemplate } from '@/types/quizTemplate';
import { clothingQuestions } from '@/data/questions/clothingQuestions';
import { personalityQuestions } from '@/data/questions/personalityQuestions';
import { accessoriesQuestions } from '@/data/questions/accessoriesQuestions';
import { strategicQuestions } from '@/data/strategicQuestions';

// Template padrão para quiz de estilo pessoal
export const styleQuizTemplate: QuizTemplate = {
  id: 'style-quiz-default',
  name: 'Quiz de Estilo Pessoal',
  description: 'Quiz completo para descobrir o estilo pessoal predominante.',
  questions: [
    ...clothingQuestions,
    ...personalityQuestions,
    ...accessoriesQuestions,
    ...strategicQuestions
  ],
  resultPageSettings: {
    styleType: 'default',
    blocks: [],
    headerConfig: {
      title: 'Seu Resultado de Estilo Pessoal',
      subtitle: 'Descubra como valorizar seu estilo único'
    },
    mainContentConfig: {
      description: 'Seu estilo predominante reflete sua personalidade e preferências únicas. Use essas informações para criar looks que expressem quem você é.',
      customImage: '/styles/default-style.jpg'
    },
    offerConfig: {
      title: 'Aprimore seu Estilo',
      subtitle: 'Consultoria personalizada para valorizar suas características',
      buttonText: 'Quero Saber Mais',
      buttonUrl: '#oferta',
      benefits: [
        'Análise completa do seu perfil de estilo',
        'Sugestões de peças que valorizam seu tipo físico',
        'Paleta de cores personalizada',
        'E-book com dicas específicas para seu estilo'
      ]
    }
  },
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
