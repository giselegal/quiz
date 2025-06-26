// API service to replace Supabase client calls
export class ApiService {
  private baseUrl = '/api';

  async getQuiz(id: string) {
    const response = await fetch(`${this.baseUrl}/quiz/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar quiz');
    }
    return response.json();
  }

  async getQuizQuestions(quizId: string) {
    const response = await fetch(`${this.baseUrl}/quiz/${quizId}/questions`);
    if (!response.ok) {
      throw new Error('Erro ao buscar questões');
    }
    return response.json();
  }

  async getQuestionOptions(questionId: string) {
    const response = await fetch(`${this.baseUrl}/question/${questionId}/options`);
    if (!response.ok) {
      throw new Error('Erro ao buscar opções');
    }
    return response.json();
  }

  async submitQuiz(participantData: any, answers: any[]) {
    const response = await fetch(`${this.baseUrl}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participantData, answers }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao submeter quiz');
    }
    return response.json();
  }

  async getStyles() {
    const response = await fetch(`${this.baseUrl}/styles`);
    if (!response.ok) {
      throw new Error('Erro ao buscar estilos');
    }
    return response.json();
  }

  async getUtmAnalytics() {
    const response = await fetch(`${this.baseUrl}/analytics/utm`);
    if (!response.ok) {
      throw new Error('Erro ao buscar analytics UTM');
    }
    return response.json();
  }
}

export const apiService = new ApiService();