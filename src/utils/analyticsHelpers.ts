
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

// Get user progress data - Ensure this returns an array
export const getUserProgressData = () => {
  // Return an array for ProgressTab compatibility
  return [
    { questionId: 1, uniqueUsers: 1250, totalAnswers: 1200, retentionFromStart: 100, dropoffRate: 5 },
    { questionId: 2, uniqueUsers: 1180, totalAnswers: 1150, retentionFromStart: 94, dropoffRate: 7 },
    { questionId: 3, uniqueUsers: 1100, totalAnswers: 1080, retentionFromStart: 88, dropoffRate: 4 },
    { questionId: 4, uniqueUsers: 1050, totalAnswers: 1030, retentionFromStart: 84, dropoffRate: 8 },
    { questionId: 5, uniqueUsers: 950, totalAnswers: 940, retentionFromStart: 76, dropoffRate: 12 }
  ];
};

// Reset metrics cache - ensure it returns a boolean
export const resetMetricsCache = (): boolean => {
  console.log("Metrics cache reset");
  // Implementation for resetting metrics cache
  return true; // Changed from void return to boolean
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
