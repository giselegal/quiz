import { QuizQuestion } from "../../types/quiz";

export const guideValueQuestions: QuizQuestion[] = [
  {
    id: "strategic-4",
    title: "O que você mais valoriza em um guia de estilo?",
    type: "text",
    multiSelect: 1,
    // A questão 14 (strategic-4) não deve ter imagem
    options: [
      {
        id: "strategic-4-1",
        text: "Praticidade e facilidade de aplicação",
        styleCategory: "Strategic",
      },
      {
        id: "strategic-4-2",
        text: "Exemplos de looks montados para diferentes ocasiões",
        styleCategory: "Strategic",
      },
      {
        id: "strategic-4-3",
        text: "Explicações detalhadas sobre o porquê das recomendações",
        styleCategory: "Strategic",
      },
      {
        id: "strategic-4-4",
        text: "Dicas para economizar e aproveitar melhor o que já tenho",
        styleCategory: "Strategic",
      },
    ],
  },
];

export const investmentQuestions: QuizQuestion[] = [
  {
    id: "strategic-6",
    title:
      "Quanto você estaria disposta a investir em um guia completo de estilo personalizado?",
    type: "text",
    multiSelect: 1,
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920677/Espanhol_Portugu%C3%AAs_6_jxqlxx.webp",
    options: [
      {
        id: "strategic-6-1",
        text: "Menos de R$100",
        styleCategory: "Strategic",
      },
      {
        id: "strategic-6-2",
        text: "Entre R$100 e R$300",
        styleCategory: "Strategic",
      },
      {
        id: "strategic-6-3",
        text: "Entre R$300 e R$500",
        styleCategory: "Strategic",
      },
      {
        id: "strategic-6-4",
        text: "Mais de R$500",
        styleCategory: "Strategic",
      },
    ],
  },
];
