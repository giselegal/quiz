// Portuguese translations for chat interface
export const chatTranslations = {
  // Chat interface strings - Replit Chat
  chatTitle: "Chat",
  typeMessage: "Digite sua mensagem...",
  sendMessage: "Enviar",
  enterToSend: "Pressione Enter para enviar",
  connecting: "Conectando...",
  connected: "Conectado",
  disconnected: "Desconectado",
  reconnecting: "Reconectando...",
  
  // Replit specific
  replitChat: "Chat do Replit",
  aiAssistant: "Assistente IA",
  codeHelp: "Ajuda com código",
  clearConversation: "Limpar conversa",
  
  // Common actions
  send: "Enviar",
  cancel: "Cancelar",
  close: "Fechar",
  submit: "Enviar",
  continue: "Continuar",
  next: "Próximo",
  previous: "Anterior",
  finish: "Finalizar",
  
  // Quiz interface
  quizTitle: "Quiz de Estilo Pessoal",
  startQuiz: "Iniciar Quiz",
  questionOf: "Pergunta {current} de {total}",
  selectOption: "Selecione uma opção",
  selectMultiple: "Selecione até {max} opções",
  required: "Este campo é obrigatório",
  
  // Form labels
  name: "Nome",
  email: "E-mail",
  enterName: "Digite seu nome",
  enterEmail: "Digite seu e-mail",
  
  // Status messages
  loading: "Carregando...",
  saving: "Salvando...",
  saved: "Salvo!",
  error: "Erro",
  success: "Sucesso!",
  
  // Error messages
  errorGeneral: "Ocorreu um erro. Tente novamente.",
  errorNetwork: "Erro de conexão. Verifique sua internet.",
  errorRequired: "Este campo é obrigatório",
  errorInvalidEmail: "E-mail inválido",
  
  // Quiz specific
  welcomeMessage: "Bem-vindo ao Quiz de Estilo Pessoal!",
  quizDescription: "Descubra qual estilo combina mais com você respondendo algumas perguntas.",
  calculateResults: "Calculando seus resultados...",
  resultsReady: "Seus resultados estão prontos!",
  
  // Style results
  yourStyle: "Seu Estilo",
  primaryStyle: "Estilo Principal",
  secondaryStyles: "Estilos Secundários",
  styleMatch: "Combinação de {percentage}%",
  
  // Call to action
  getYourResults: "Ver Seus Resultados",
  learnMore: "Saiba Mais",
  startNow: "Começar Agora",
  
  // Navigation
  backToQuiz: "Voltar ao Quiz",
  retakeQuiz: "Refazer Quiz",
  shareResults: "Compartilhar Resultados"
};

export type ChatTranslationKey = keyof typeof chatTranslations;