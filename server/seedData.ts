import { db } from './db';
import { style_types, quizzes, quiz_questions, question_options } from '../shared/schema';
import { seedStrategicQuestions } from './seedStrategicQuestions';

export async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...');

  // Insert style types
  const styleTypes = [
    {
      id: 'elegante',
      name: 'Elegante',
      description: 'Sofisticado, refinado e atemporal',
      color_primary: '#1a1a1a',
      color_secondary: '#d4af37'
    },
    {
      id: 'romantico',
      name: 'Romântico',
      description: 'Feminino, delicado e suave',
      color_primary: '#f8c8dc',
      color_secondary: '#ff69b4'
    },
    {
      id: 'contemporaneo',
      name: 'Contemporâneo',
      description: 'Moderno, prático e funcional',
      color_primary: '#333333',
      color_secondary: '#4169e1'
    },
    {
      id: 'natural',
      name: 'Natural',
      description: 'Casual, confortável e autêntico',
      color_primary: '#8fbc8f',
      color_secondary: '#228b22'
    },
    {
      id: 'classico',
      name: 'Clássico',
      description: 'Tradicional, conservador e estruturado',
      color_primary: '#000080',
      color_secondary: '#b8860b'
    },
    {
      id: 'dramatico',
      name: 'Dramático',
      description: 'Ousado, marcante e impactante',
      color_primary: '#8b0000',
      color_secondary: '#ff4500'
    },
    {
      id: 'criativo',
      name: 'Criativo',
      description: 'Único, artístico e expressivo',
      color_primary: '#9400d3',
      color_secondary: '#ff6347'
    },
    {
      id: 'sexy',
      name: 'Sexy',
      description: 'Sensual, confiante e atraente',
      color_primary: '#dc143c',
      color_secondary: '#ff1493'
    }
  ];

  // Insert style types
  for (const style of styleTypes) {
    await db.insert(style_types).values(style).onConflictDoNothing();
  }

  // Create a default quiz
  const [quiz] = await db.insert(quizzes).values({
    title: 'Quiz de Estilo Pessoal',
    description: 'Descubra qual estilo combina mais com você',
    active: true
  }).returning();

  // Insert quiz questions
  console.log('📝 Adding quiz questions...');
  
  // Questão 1: Tipo de Roupa Favorita (Visual + Texto)
  const [question1] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    type: "multiple-choice",
    order_index: 1,
    required_selections: 3,
    active: true
  }).returning();

  const q1Options = [
    { text: "Conforto, leveza e praticidade no vestir", style: "natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp" },
    { text: "Discrição, caimento clássico e sobriedade", style: "classico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp" },
    { text: "Praticidade com um toque de estilo atual", style: "contemporaneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp" },
    { text: "Elegância refinada, moderna e sem exageros", style: "elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp" },
    { text: "Delicadeza em tecidos suaves e fluidos", style: "romantico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp" },
    { text: "Sensualidade com destaque para o corpo", style: "sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp" },
    { text: "Impacto visual com peças estruturadas e assimétricas", style: "dramatico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp" },
    { text: "Mix criativo com formas ousadas e originais", style: "criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp" }
  ];

  for (let i = 0; i < q1Options.length; i++) {
    const option = q1Options[i];
    await db.insert(question_options).values({
      question_id: question1.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      image_url: option.image,
      order_index: i + 1
    });
  }

  // Questão 2: Personalidade (Apenas texto)
  const [question2] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "RESUMA A SUA PERSONALIDADE:",
    type: "multiple-choice",
    order_index: 2,
    required_selections: 3,
    active: true
  }).returning();

  const q2Options = [
    { text: "Informal, espontânea, alegre, essencialista", style: "natural" },
    { text: "Conservadora, séria, organizada", style: "classico" },
    { text: "Informada, ativa, prática", style: "contemporaneo" },
    { text: "Exigente, sofisticada, seletiva", style: "elegante" },
    { text: "Feminina, meiga, delicada, sensível", style: "romantico" },
    { text: "Glamorosa, vaidosa, sensual", style: "sexy" },
    { text: "Cosmopolita, moderna e audaciosa", style: "dramatico" },
    { text: "Exótica, aventureira, livre", style: "criativo" }
  ];

  for (let i = 0; i < q2Options.length; i++) {
    const option = q2Options[i];
    await db.insert(question_options).values({
      question_id: question2.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Questão 3: Visual de Identificação (Visual + Texto)
  const [question3] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
    type: "multiple-choice",
    order_index: 3,
    required_selections: 3,
    active: true
  }).returning();

  const q3Options = [
    { text: "Visual leve, despojado e natural", style: "natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp" },
    { text: "Visual clássico e tradicional", style: "classico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp" },
    { text: "Visual casual com toque atual", style: "contemporaneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp" },
    { text: "Visual refinado e imponente", style: "elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp" },
    { text: "Visual romântico, feminino e delicado", style: "romantico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp" },
    { text: "Visual sensual, com saia justa e decote", style: "sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp" },
    { text: "Visual marcante e urbano (jeans + jaqueta)", style: "dramatico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp" },
    { text: "Visual criativo, colorido e ousado", style: "criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp" }
  ];

  for (let i = 0; i < q3Options.length; i++) {
    const option = q3Options[i];
    await db.insert(question_options).values({
      question_id: question3.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      image_url: option.image,
      order_index: i + 1
    });
  }

  // Questão 4: Detalhes (Apenas texto)
  const [question4] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAIS DETALHES VOCÊ GOSTA?",
    type: "multiple-choice",
    order_index: 4,
    required_selections: 3,
    active: true
  }).returning();

  const q4Options = [
    { text: "Poucos detalhes, básicos e práticos", style: "natural" },
    { text: "Bem discretos e sutis, limpos e clássicos", style: "classico" },
    { text: "Básico, mas com um toque de estilo", style: "contemporaneo" },
    { text: "Detalhes refinados, chiques e que consideram status", style: "elegante" },
    { text: "Detalhes delicados, laços, babados", style: "romantico" },
    { text: "Roupas que valorizam meu corpo: couro, zíper, fendas", style: "sexy" },
    { text: "Detalhes marcantes, firmeza e peso", style: "dramatico" },
    { text: "Detalhes diferentes do convencional, produções ousadas", style: "criativo" }
  ];

  for (let i = 0; i < q4Options.length; i++) {
    const option = q4Options[i];
    await db.insert(question_options).values({
      question_id: question4.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Questão 5: Estampas (Visual + Texto)
  const [question5] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
    type: "multiple-choice",
    order_index: 5,
    required_selections: 3,
    active: true
  }).returning();

  const q5Options = [
    { text: "Estampas limpas, com poucas informações", style: "natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp" },
    { text: "Estampas clássicas e atemporais", style: "classico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp" },
    { text: "Atemporais, mas que têm uma pegada de atual e moderna", style: "contemporaneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp" },
    { text: "Estampas clássicas e atemporais, mas sofisticadas", style: "elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp" },
    { text: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações", style: "romantico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp" },
    { text: "Estampas de animal print, como onça, zebra e cobra", style: "sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp" },
    { text: "Estampas geométricas, abstratas e exageradas como grandes poás", style: "dramatico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp" },
    { text: "Estampas diferentes do usual, como africanas, xadrez grandes", style: "criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp" }
  ];

  for (let i = 0; i < q5Options.length; i++) {
    const option = q5Options[i];
    await db.insert(question_options).values({
      question_id: question5.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      image_url: option.image,
      order_index: i + 1
    });
  }

  // Questão 6: Casacos (Visual + Texto)
  const [question6] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAL CASACO É SEU FAVORITO?",
    type: "multiple-choice",
    order_index: 6,
    required_selections: 3,
    active: true
  }).returning();

  const q6Options = [
    { text: "Cardigã bege confortável e casual", style: "natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp" },
    { text: "Blazer verde estruturado", style: "classico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp" },
    { text: "Trench coat bege tradicional", style: "contemporaneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp" },
    { text: "Blazer branco orgânico", style: "elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp" },
    { text: "Casaco rosa vibrante e moderno", style: "romantico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp" },
    { text: "Jaqueta vinho de couro estilosa", style: "sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp" },
    { text: "Jaqueta preta estilo rocker", style: "dramatico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp" },
    { text: "Casaco estampado criativo e colorido", style: "criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp" }
  ];

  for (let i = 0; i < q6Options.length; i++) {
    const option = q6Options[i];
    await db.insert(question_options).values({
      question_id: question6.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      image_url: option.image,
      order_index: i + 1
    });
  }

  // Questão 7: Calças (Visual + Texto)
  const [question7] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAL SUA CALÇA FAVORITA?",
    type: "multiple-choice",
    order_index: 7,
    required_selections: 3,
    active: true
  }).returning();

  const q7Options = [
    { text: "Calça fluida acetinada bege", style: "natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp" },
    { text: "Calça de alfaiataria cinza", style: "classico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp" },
    { text: "Jeans reto e básico", style: "contemporaneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp" },
    { text: "Calça reta bege de tecido", style: "elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp" },
    { text: "Calça ampla rosa alfaiatada", style: "romantico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp" },
    { text: "Legging preta de couro", style: "sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp" },
    { text: "Calça reta preta de couro", style: "dramatico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp" },
    { text: "Calça estampada floral leve e ampla", style: "criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp" }
  ];

  for (let i = 0; i < q7Options.length; i++) {
    const option = q7Options[i];
    await db.insert(question_options).values({
      question_id: question7.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      image_url: option.image,
      order_index: i + 1
    });
  }

  // Questão 8: Sapatos (Visual + Texto)
  const [question8] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
    type: "multiple-choice",
    order_index: 8,
    required_selections: 3,
    active: true
  }).returning();

  const q8Options = [
    { text: "Tênis nude casual e confortável", style: "natural", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp" },
    { text: "Scarpin nude de salto baixo", style: "classico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp" },
    { text: "Sandália dourada com salto bloco", style: "contemporaneo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp" },
    { text: "Scarpin nude salto alto e fino", style: "elegante", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp" },
    { text: "Sandália anabela off white", style: "romantico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp" },
    { text: "Sandália rosa de tiras finas", style: "sexy", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp" },
    { text: "Scarpin preto moderno com vinil transparente", style: "dramatico", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp" },
    { text: "Scarpin colorido estampado", style: "criativo", image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp" }
  ];

  for (let i = 0; i < q8Options.length; i++) {
    const option = q8Options[i];
    await db.insert(question_options).values({
      question_id: question8.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      image_url: option.image,
      order_index: i + 1
    });
  }

  // Questão 9: Acessórios (Apenas texto)
  const [question9] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
    type: "multiple-choice",
    order_index: 9,
    required_selections: 3,
    active: true
  }).returning();

  const q9Options = [
    { text: "Pequenos e discretos, às vezes nem uso", style: "natural" },
    { text: "Brincos pequenos e discretos. Corrente fininha", style: "classico" },
    { text: "Acessórios que elevem meu look com um toque moderno", style: "contemporaneo" },
    { text: "Acessórios sofisticados, joias ou semijoias", style: "elegante" },
    { text: "Peças delicadas e com um toque feminino", style: "romantico" },
    { text: "Brincos longos, colares que valorizam minha beleza", style: "sexy" },
    { text: "Acessórios pesados, que causam um impacto", style: "dramatico" },
    { text: "Acessórios diferentes, grandes e marcantes", style: "criativo" }
  ];

  for (let i = 0; i < q9Options.length; i++) {
    const option = q9Options[i];
    await db.insert(question_options).values({
      question_id: question9.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Questão 10: Tecidos (Apenas texto)
  const [question10] = await db.insert(quiz_questions).values({
    quiz_id: quiz.id,
    title: "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...",
    type: "multiple-choice",
    order_index: 10,
    required_selections: 3,
    active: true
  }).returning();

  const q10Options = [
    { text: "São simples de cuidar", style: "natural" },
    { text: "São de excelente qualidade", style: "classico" },
    { text: "São simples de cuidar e modernos", style: "contemporaneo" },
    { text: "São sofisticados", style: "elegante" },
    { text: "São delicados", style: "romantico" },
    { text: "São perfeitos ao meu corpo", style: "sexy" },
    { text: "São diferentes, e trazem um efeito para minha roupa", style: "dramatico" },
    { text: "São exclusivos, criam identidade no look", style: "criativo" }
  ];

  for (let i = 0; i < q10Options.length; i++) {
    const option = q10Options[i];
    await db.insert(question_options).values({
      question_id: question10.id,
      text: option.text,
      style_code: option.style,
      points: 1,
      order_index: i + 1
    });
  }

  // Add strategic questions
  await seedStrategicQuestions(quiz.id);

  console.log(`✅ Database seeded successfully with quiz ID: ${quiz.id}`);
  return quiz;
}