import { db } from './db';
import { quiz_questions, question_options } from '../shared/schema';

export async function seedStrategicQuestions(quizId: string) {
  console.log('📝 Adding strategic questions...');

  // Strategic Question 1
  const [strategic1] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "Como você se sente em relação ao seu estilo pessoal hoje?",
    type: "strategic",
    order_index: 11,
    required_selections: 1,
    active: true
  }).returning();

  const s1Options = [
    { text: "Completamente perdida, não sei o que combina comigo", style: "natural" },
    { text: "Tenho algumas ideias, mas não sei como aplicá-las", style: "contemporaneo" },
    { text: "Conheço meu estilo, mas quero refiná-lo", style: "elegante" },
    { text: "Estou satisfeita, só buscando inspiração", style: "criativo" }
  ];

  for (let i = 0; i < s1Options.length; i++) {
    const option = s1Options[i];
    await db.insert(question_options).values({
      question_id: strategic1.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Strategic Question 2
  const [strategic2] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "Qual é o maior desafio que você enfrenta ao se vestir?",
    type: "strategic",
    order_index: 12,
    required_selections: 1,
    active: true
  }).returning();

  const s2Options = [
    { text: "Nunca sei o que combina com o quê", style: "natural" },
    { text: "Tenho muitas roupas, mas sempre sinto que não tenho nada para vestir", style: "contemporaneo" },
    { text: "Não consigo criar looks diferentes das peças que tenho", style: "criativo" },
    { text: "Compro peças por impulso que depois não uso", style: "dramatico" }
  ];

  for (let i = 0; i < s2Options.length; i++) {
    const option = s2Options[i];
    await db.insert(question_options).values({
      question_id: strategic2.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Strategic Question 3
  const [strategic3] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "Como você aprende melhor sobre estilo e moda?",
    type: "strategic",
    order_index: 13,
    required_selections: 1,
    active: true
  }).returning();

  const s3Options = [
    { text: "Vendo exemplos visuais e imagens de referência", style: "romantico" },
    { text: "Lendo guias detalhados com explicação passo-a-passo", style: "classico" },
    { text: "Com exemplos práticos que posso aplicar no meu dia a dia", style: "natural" },
    { text: "Com orientação personalizada para o meu caso específico", style: "elegante" }
  ];

  for (let i = 0; i < s3Options.length; i++) {
    const option = s3Options[i];
    await db.insert(question_options).values({
      question_id: strategic3.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Strategic Question 4
  const [strategic4] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "O que você mais valoriza em um guia de estilo?",
    type: "strategic",
    order_index: 14,
    required_selections: 1,
    active: true
  }).returning();

  const s4Options = [
    { text: "Praticidade e facilidade de aplicação", style: "natural" },
    { text: "Exemplos de looks montados para diferentes ocasiões", style: "contemporaneo" },
    { text: "Explicações detalhadas sobre o porquê das recomendações", style: "elegante" },
    { text: "Dicas para economizar e aproveitar melhor o que já tenho", style: "classico" }
  ];

  for (let i = 0; i < s4Options.length; i++) {
    const option = s4Options[i];
    await db.insert(question_options).values({
      question_id: strategic4.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Strategic Question 5
  const [strategic5] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "Você já investiu em algum guia ou consultoria de estilo no passado?",
    type: "strategic",
    order_index: 15,
    required_selections: 1,
    active: true
  }).returning();

  const s5Options = [
    { text: "Sim, já pesquisei mas não cheguei a comprar", style: "contemporaneo" },
    { text: "Sim, já investi em algum curso/guia/consultoria", style: "elegante" },
    { text: "Não, esta é a primeira vez que considero isso", style: "natural" },
    { text: "Prefiro não responder", style: "classico" }
  ];

  for (let i = 0; i < s5Options.length; i++) {
    const option = s5Options[i];
    await db.insert(question_options).values({
      question_id: strategic5.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Strategic Question 6
  const [strategic6] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "Quanto você estaria interessada em investir em um guia completo de estilo personalizado?",
    type: "strategic",
    order_index: 16,
    required_selections: 1,
    active: true
  }).returning();

  const s6Options = [
    { text: "Menos de R$ 100", style: "natural" },
    { text: "Entre R$ 100 e R$ 300", style: "classico" },
    { text: "Entre R$ 300 e R$ 500", style: "contemporaneo" },
    { text: "Mais de R$ 500", style: "elegante" }
  ];

  for (let i = 0; i < s6Options.length; i++) {
    const option = s6Options[i];
    await db.insert(question_options).values({
      question_id: strategic6.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Strategic Question 7
  const [strategic7] = await db.insert(quiz_questions).values({
    quiz_id: quizId,
    title: "Quais desses resultados você mais gostaria de alcançar com os Guias de Estilo e Imagem?",
    type: "strategic",
    order_index: 17,
    required_selections: 1,
    active: true
  }).returning();

  const s7Options = [
    { text: "Montar looks com mais facilidade e confiança", style: "natural" },
    { text: "Usar o que já tenho e me sentir estilosa", style: "classico" },
    { text: "Comprar com mais consciência e sem culpa", style: "contemporaneo" },
    { text: "Ser admirada pela imagem que transmito", style: "elegante" },
    { text: "Resgatar peças esquecidas e criar novos looks com estilo", style: "criativo" }
  ];

  for (let i = 0; i < s7Options.length; i++) {
    const option = s7Options[i];
    await db.insert(question_options).values({
      question_id: strategic7.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  console.log('✅ Strategic questions added successfully');
}