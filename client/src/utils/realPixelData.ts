// Real pixel event data management - replacing mock data
export interface RealPixelEvent {
  id: string;
  event_name: string;
  event_time: number;
  custom_data: Record<string, any>;
  event_source_url: string;
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
}

export interface PixelEventLog {
  timestamp: string;
  type: string;
  data: any;
  success: boolean;
  pixel_id: string;
}

// Get real pixel events from localStorage (only real events, no mock data)
export const getRealPixelEvents = (): PixelEventLog[] => {
  try {
    // Clear any old mock data first
    const mockKeys = ['fb_pixel_event_log', 'mock_pixel_events', 'test_events'];
    mockKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });

    const events = localStorage.getItem('pixel_events_log');
    if (!events) return [];
    
    const parsedEvents = JSON.parse(events);
    // Filter only events from last 7 days and validate they're real
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    return parsedEvents.filter((event: PixelEventLog) => {
      const eventTime = new Date(event.timestamp).getTime();
      const isRecent = eventTime > sevenDaysAgo;
      
      // Validate this is a real event (not mock)
      const eventString = JSON.stringify(event).toLowerCase();
      const hasMockIndicators = ['mock', 'test', 'fake', 'demo'].some(indicator => 
        eventString.includes(indicator)
      );
      
      return isRecent && !hasMockIndicators && event.pixel_id && event.type;
    });
  } catch (error) {
    console.error('Error getting real pixel events:', error);
    return [];
  }
};

// Log real pixel event
export const logRealPixelEvent = (eventType: string, eventData: any, pixelId: string): void => {
  try {
    const event: PixelEventLog = {
      timestamp: new Date().toISOString(),
      type: eventType,
      data: eventData,
      success: true,
      pixel_id: pixelId
    };

    const existingEvents = getRealPixelEvents();
    const updatedEvents = [...existingEvents, event];
    
    // Keep only last 100 events to prevent localStorage overflow
    const recentEvents = updatedEvents.slice(-100);
    
    localStorage.setItem('pixel_events_log', JSON.stringify(recentEvents));
    
    console.log(`Logged real pixel event: ${eventType}`, event);
  } catch (error) {
    console.error('Error logging pixel event:', error);
  }
};

// Get real event statistics
export const getRealEventStatistics = () => {
  const events = getRealPixelEvents();
  
  const stats = {
    total_events: events.length,
    events_by_type: {} as Record<string, number>,
    events_last_24h: 0,
    events_last_7d: events.length,
    success_rate: 0,
    conversion_funnel: {
      page_views: 0,
      quiz_starts: 0,
      quiz_completes: 0,
      cta_clicks: 0,
      purchases: 0
    }
  };

  const last24h = Date.now() - (24 * 60 * 60 * 1000);
  let successfulEvents = 0;

  events.forEach(event => {
    // Count by type
    stats.events_by_type[event.type] = (stats.events_by_type[event.type] || 0) + 1;
    
    // Count last 24h
    if (new Date(event.timestamp).getTime() > last24h) {
      stats.events_last_24h++;
    }
    
    // Count successful events
    if (event.success) {
      successfulEvents++;
    }
    
    // Map to conversion funnel
    switch (event.type) {
      case 'ViewContent':
        stats.conversion_funnel.page_views++;
        break;
      case 'InitiateCheckout':
        stats.conversion_funnel.quiz_starts++;
        break;
      case 'CompleteRegistration':
        stats.conversion_funnel.quiz_completes++;
        break;
      case 'AddToCart':
        // Don't count progress events in CTA clicks
        break;
      case 'Purchase':
        stats.conversion_funnel.purchases++;
        stats.conversion_funnel.cta_clicks++;
        break;
    }
  });

  stats.success_rate = events.length > 0 ? (successfulEvents / events.length) * 100 : 0;

  return stats;
};

// Clear mock data and reset to real data only
export const clearMockPixelData = (): void => {
  try {
    // Remove any mock event logs
    localStorage.removeItem('fb_pixel_event_log');
    localStorage.removeItem('mock_pixel_events');
    
    console.log('Cleared mock pixel data - using real events only');
  } catch (error) {
    console.error('Error clearing mock data:', error);
  }
};

// Validate if pixel events are real vs mock
export const validateRealPixelData = (): { isReal: boolean; issues: string[] } => {
  try {
    const events = getRealPixelEvents();
    const issues: string[] = [];
    
    // If no events, it's not necessarily an error - just no data yet
    if (events.length === 0) {
      return {
        isReal: false,
        issues: ['Nenhum evento de pixel encontrado - execute ações no quiz para gerar dados']
      };
    }
    
    // Check for signs of mock data
    const mockIndicators = [
      'mock_',
      'test_',
      'fake_',
      'demo_',
      'placeholder'
    ];
    
    let hasRealData = true;
    
    events.forEach(event => {
      const eventString = JSON.stringify(event).toLowerCase();
      mockIndicators.forEach(indicator => {
        if (eventString.includes(indicator)) {
          issues.push(`Possíveis dados simulados detectados: ${indicator}`);
          hasRealData = false;
        }
      });
    });
    
    // Check for realistic event timing
    if (events.length > 1) {
      const eventTimes = events.map(e => new Date(e.timestamp).getTime());
      const timeDiffs = eventTimes.slice(1).map((time, i) => time - eventTimes[i]);
      
      // If all events happened at exactly the same time, likely mock
      if (timeDiffs.every(diff => diff === 0)) {
        issues.push('Eventos com timestamps idênticos - possíveis dados simulados');
        hasRealData = false;
      }
    }
    
    return {
      isReal: hasRealData && issues.length === 0,
      issues
    };
  } catch (error) {
    console.error('Error validating pixel data:', error);
    return {
      isReal: false,
      issues: ['Erro ao validar dados de pixel']
    };
  }
};

export default {
  getRealPixelEvents,
  logRealPixelEvent,
  getRealEventStatistics,
  clearMockPixelData,
  validateRealPixelData
};