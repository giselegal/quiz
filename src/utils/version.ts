
// Versão da aplicação para fins de rastreamento e debugging
export const VERSION = '1.0.0';

// Data de build
export const BUILD_DATE = new Date().toISOString();

// Ambiente atual
export const ENV = process.env.NODE_ENV || 'development';

// Função para verificar se é a versão mais recente
export const isLatestVersion = (): boolean => {
  // Implementar lógica de verificação de versão aqui
  return true;
};

// Obter informações completas da versão
export const getVersionInfo = () => {
  return {
    version: VERSION,
    buildDate: BUILD_DATE,
    environment: ENV
  };
};

export default {
  VERSION,
  BUILD_DATE,
  ENV,
  isLatestVersion,
  getVersionInfo
};
