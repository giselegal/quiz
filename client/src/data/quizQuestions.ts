import { QuizQuestion } from "@/types/quiz";
import { clothingQuestions } from "./questions/clothingQuestions";
import { personalityQuestions } from "./questions/personalityQuestions";
import { detailsQuestions } from "./questions/detailsQuestions";
import { stylePreferencesQuestions } from "./questions/stylePreferencesQuestions";
import { outerwearQuestions } from "./questions/outerwearQuestions";
import { accessoriesQuestions } from "./questions/accessoriesQuestions";
import { accessoryStyleQuestions } from "./questions/accessoryStyleQuestions";
// Importar todas as questões estratégicas (testes A/B)
import { selfPerceptionQuestions } from "./questions/selfPerceptionQuestions";
import { styleExperienceQuestions } from "./questions/styleExperienceQuestions";
import {
  guideValueQuestions,
  investmentQuestions,
} from "./questions/guideValueQuestions";
import { purchaseIntentQuestions } from "./questions/purchaseIntentQuestions";
import { desiredOutcomesQuestions } from "./questions/desiredOutcomesQuestions";

// Questões normais do quiz (1-10) - ORDEM CORRETA
export const normalQuestions: QuizQuestion[] = [
  // Questão 1: Tipo de roupa favorita
  ...clothingQuestions.filter((q) => q.id === "1"),

  // Questão 2: Personalidade
  ...personalityQuestions.filter((q) => q.id === "2"),

  // Questão 3: Visual de identificação
  ...clothingQuestions.filter((q) => q.id === "3"),

  // Questão 4: Detalhes preferidos
  ...detailsQuestions.filter((q) => q.id === "4"),

  // Questão 5: Estampas
  ...stylePreferencesQuestions.filter((q) => q.id === "5"),

  // Questão 6: Casacos
  ...outerwearQuestions.filter((q) => q.id === "6"),

  // Questão 7: Calças
  ...outerwearQuestions.filter((q) => q.id === "7"),

  // Questão 8: Sapatos
  ...accessoriesQuestions.filter((q) => q.id === "8"),

  // Questão 9: Acessórios
  ...accessoryStyleQuestions.filter((q) => q.id === "9"),

  // Questão 10: Tecidos
  ...stylePreferencesQuestions.filter((q) => q.id === "10"),
];

// Questões estratégicas (testes A/B) - ORDEM CORRETA
export const strategicQuestions: QuizQuestion[] = [
  // Strategic-1: Autopercepção do estilo
  ...selfPerceptionQuestions.filter((q) => q.id === "strategic-1"),

  // Strategic-2: Desafios ao se vestir
  ...selfPerceptionQuestions.filter((q) => q.id === "strategic-2"),

  // Strategic-3: Como aprende sobre estilo
  ...styleExperienceQuestions.filter((q) => q.id === "strategic-3"),

  // Strategic-4: O que valoriza em guia
  ...guideValueQuestions.filter((q) => q.id === "strategic-4"),

  // Strategic-5: Experiência anterior com guias
  ...purchaseIntentQuestions.filter((q) => q.id === "strategic-5"),

  // Strategic-6: Investimento disposta
  ...investmentQuestions.filter((q) => q.id === "strategic-6"),

  // Strategic-7: Resultados desejados
  ...desiredOutcomesQuestions.filter((q) => q.id === "strategic-7"),
];

// Todas as questões combinadas
export const quizQuestions: QuizQuestion[] = [
  ...normalQuestions,
  ...strategicQuestions,
];
