
import { getAnalyticsEvents } from './analytics';

// Helper functions for data analysis
export const formatAnalyticsData = (data: any[]) => {
  return data.map(event => ({
    ...event,
    timestamp: new Date(event.timestamp).toLocaleString()
  }));
};

// Functions for summaries and statistics
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

// Get user progress data
export const getUserProgressData = () => {
  // Implementation for getting user progress data
  return {
    completionRate: 75,
    averageTimePerQuestion: 12,
    dropOffPoints: [2, 5, 8],
    totalUsers: 1250
  };
};

// Reset metrics cache
export const resetMetricsCache = () => {
  console.log("Metrics cache reset");
  // Implementation for resetting metrics cache
};

// Get cached metrics
export const getCachedMetrics = (timeRange?: '7d' | '30d' | 'all') => {
  // Implementation for getting cached metrics
  return {
    lastUpdated: new Date().toISOString(),
    metrics: {
      totalUsers: 1250,
      activeUsers: 850,
      conversionRate: 23.5
    }
  };
};

// Filter events by time range
export const filterEventsByTimeRange = (events: any[], timeRange: '7d' | '30d' | 'all') => {
  if (timeRange === 'all' || !events || !events.length) {
    return events || [];
  }

  const now = new Date();
  const daysToFilter = timeRange === '7d' ? 7 : 30;
  const cutoffDate = new Date(now.setDate(now.getDate() - daysToFilter));

  return events.filter(event => {
    if (!event.timestamp) return true;
    const eventDate = new Date(event.timestamp);
    return eventDate >= cutoffDate;
  });
};

export default { 
  formatAnalyticsData, 
  getEventsSummary,
  getUserProgressData,
  resetMetricsCache,
  getCachedMetrics,
  filterEventsByTimeRange
};
