
import { getAnalyticsEvents } from './analytics';

// Funções auxiliares para análise de dados
export const formatAnalyticsData = (data: any[]) => {
  return data.map(event => ({
    ...event,
    timestamp: new Date(event.timestamp).toLocaleString()
  }));
};

// Funções para resumos e estatísticas
export const getEventsSummary = () => {
  const events = getAnalyticsEvents();
  
  const summary = {
    total: events.length,
    byType: {} as Record<string, number>
  };
  
  events.forEach(event => {
    const type = event.type || 'unknown';
    summary.byType[type] = (summary.byType[type] || 0) + 1;
  });
  
  return summary;
};

export default { formatAnalyticsData, getEventsSummary };
