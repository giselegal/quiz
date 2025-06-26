
import { QuizQuestion } from '../../types/quiz';

export const stylePreferencesQuestions: QuizQuestion[] = [
  {
    id: '5',
    title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    type: 'both',
    multiSelect: 3,
    options: [
      {
        id: '5a',
        text: 'Estampas clean, com poucas informações.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '5b',
        text: 'Estampas clássicas e atemporais.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '5c',
        text: 'Atemporais, mas que tenham uma pegada de atual e moderna.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '5d',
        text: 'Estampas clássicas e atemporais, mas sofisticadas.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '5e',
        text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '5f',
        text: 'Estampas de animal print, como onça, zebra e cobra.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '5g',
        text: 'Estampas geométricas, abstratas e exageradas como grandes poás.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '5h',
        text: 'Estampas diferentes do usual, como africanas, xadrez grandes.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  },
  {
    id: '10',
    title: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
    type: 'text',
    multiSelect: 3,
    options: [
      {
        id: '10a',
        text: 'São fáceis de cuidar.',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '10b',
        text: 'São de excelente qualidade.',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '10c',
        text: 'São fáceis de cuidar e modernos.',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '10d',
        text: 'São sofisticados.',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '10e',
        text: 'São delicados.',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '10f',
        text: 'São perfeitos ao meu corpo.',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '10g',
        text: 'São diferentes, e trazem um efeito para minha roupa.',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '10h',
        text: 'São exclusivos, criam identidade no look.',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  }
];
