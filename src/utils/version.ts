
// Versão da aplicação para fins de rastreamento e debugging
export const VERSION = {
  number: '1.0.0',
  buildNumber: '101',
  lastUpdated: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
};

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
    version: VERSION.number,
    buildDate: BUILD_DATE,
    environment: ENV,
    buildNumber: VERSION.buildNumber,
    lastUpdated: VERSION.lastUpdated
  };
};

// Função para exibir informações de versão no console
export const displayVersion = () => {
  console.log(`App Version: ${VERSION.number} (Build ${VERSION.buildNumber})`);
  console.log(`Build Date: ${new Date(VERSION.lastUpdated).toLocaleString()}`);
  console.log(`Environment: ${ENV}`);
  return VERSION;
};

export default {
  VERSION,
  BUILD_DATE,
  ENV,
  isLatestVersion,
  getVersionInfo,
  displayVersion
};
