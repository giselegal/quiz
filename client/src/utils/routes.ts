
export const ROUTES = {
  // Rotas principais do SPA
  HOME: '/',
  QUIZ: '/quiz',
  RESULTADO: '/resultado',
  DESCUBRA_SEU_ESTILO: '/descubra-seu-estilo',
  QUIZ_DESCUBRA_SEU_ESTILO: '/quiz-descubra-seu-estilo',
  UNIFIED_EDITOR: '/unified-editor',
  QUIZ_OFFER_EDITOR: '/quiz-offer-editor'
}

export function isValidRoute(path: string): boolean {
  const validRoutes = [
    ROUTES.HOME,
    ROUTES.QUIZ,
    ROUTES.RESULTADO,
    ROUTES.DESCUBRA_SEU_ESTILO,
    ROUTES.QUIZ_DESCUBRA_SEU_ESTILO,
    ROUTES.UNIFIED_EDITOR,
    ROUTES.QUIZ_OFFER_EDITOR
  ];
  
  return validRoutes.includes(path);
}
