
/**
 * Utility para exibir informações de versão da aplicação
 */

export const displayVersion = () => {
  const version = '1.0.0'; // Versão atual da aplicação
  const buildDate = new Date().toISOString();
  
  // Exibir informações no console
  console.log(
    `%cQuiz App %c v${version} %c${buildDate}`,
    'background: #432818; color: white; padding: 2px 4px; border-radius: 3px 0 0 3px;',
    'background: #B89B7A; color: white; padding: 2px 4px;',
    'background: #E5DCD3; color: #432818; padding: 2px 4px; border-radius: 0 3px 3px 0;'
  );
};
