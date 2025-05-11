/**
 * Utility para exibir informações de versão da aplicação
 */

export const VERSION = {
  buildNumber: '1.0.1', // Você pode atualizar isso conforme necessário
  lastUpdated: new Date().toISOString(),
};

export const displayVersion = () => {
  // Exibir informações no console
  console.log(
    `%cQuiz App %c v${VERSION.buildNumber} %c${new Date(VERSION.lastUpdated).toLocaleDateString()}`,
    'background: #432818; color: white; padding: 2px 4px; border-radius: 3px 0 0 3px;',
    'background: #B89B7A; color: white; padding: 2px 4px;',
    'background: #E5DCD3; color: #432818; padding: 2px 4px; border-radius: 0 3px 3px 0;'
  );
};
