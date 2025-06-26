import { EditorState } from "@/types/editor";

const STORAGE_KEY = "quiz-editor-config";

export interface QuizConfig {
  id: string;
  name: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  state: EditorState;
}

export class EditorStorageService {
  // Salvar configuração do editor
  static saveConfig(
    state: EditorState,
    name: string = "Quiz Principal"
  ): QuizConfig {
    const config: QuizConfig = {
      id: "main-quiz",
      name,
      version: "1.0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
      state,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      console.log("✅ Configuração salva com sucesso!");
      return config;
    } catch (error) {
      console.error("❌ Erro ao salvar configuração:", error);
      throw error;
    }
  }

  // Carregar configuração do editor
  static loadConfig(): QuizConfig | null {
    try {
      const configJson = localStorage.getItem(STORAGE_KEY);
      if (!configJson) return null;

      const config = JSON.parse(configJson) as QuizConfig;
      console.log("✅ Configuração carregada com sucesso!");
      return config;
    } catch (error) {
      console.error("❌ Erro ao carregar configuração:", error);
      return null;
    }
  }

  // Verificar se existe configuração salva
  static hasConfig(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  // Remover configuração
  static clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ Configuração removida!");
  }

  // Exportar configuração para JSON
  static exportConfig(state: EditorState): string {
    const config = this.saveConfig(state);
    return JSON.stringify(config, null, 2);
  }

  // Importar configuração de JSON
  static importConfig(configJson: string): QuizConfig {
    try {
      const config = JSON.parse(configJson) as QuizConfig;
      localStorage.setItem(STORAGE_KEY, configJson);
      return config;
    } catch (error) {
      console.error("❌ Erro ao importar configuração:", error);
      throw error;
    }
  }
}
