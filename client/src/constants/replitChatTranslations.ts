// Traduções para o chat do Replit
export const replitChatTranslations = {
  // Interface do chat
  chatTitle: "Chat",
  chatPlaceholder: "Digite sua mensagem...",
  sendMessage: "Enviar",
  sendButton: "Enviar",
  clearChat: "Limpar chat",
  
  // Estados do chat
  connecting: "Conectando...",
  connected: "Conectado",
  disconnected: "Desconectado",
  reconnecting: "Reconectando...",
  typing: "Digitando...",
  
  // Comandos e ações
  newChat: "Nova conversa",
  exportChat: "Exportar conversa",
  deleteMessage: "Excluir mensagem",
  copyMessage: "Copiar mensagem",
  editMessage: "Editar mensagem",
  
  // Status e feedback
  messageSent: "Mensagem enviada",
  messageDelivered: "Mensagem entregue",
  messageRead: "Mensagem lida",
  messageFailed: "Falha ao enviar",
  
  // Configurações
  settings: "Configurações",
  notifications: "Notificações",
  soundEnabled: "Som habilitado",
  autoScroll: "Rolagem automática",
  
  // Erros comuns
  errorConnection: "Erro de conexão",
  errorSending: "Erro ao enviar mensagem",
  errorLoading: "Erro ao carregar mensagens",
  tryAgain: "Tentar novamente",
  
  // Tempo
  now: "agora",
  minutesAgo: "minutos atrás",
  hoursAgo: "horas atrás",
  yesterday: "ontem",
  
  // Acessibilidade
  chatInput: "Campo de entrada do chat",
  sendButtonAria: "Enviar mensagem",
  chatHistory: "Histórico do chat",
  
  // Atalhos
  pressEnter: "Pressione Enter para enviar",
  pressShiftEnter: "Shift+Enter para nova linha"
};

export type ReplitChatTranslationKey = keyof typeof replitChatTranslations;