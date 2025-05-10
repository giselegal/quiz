
// Facebook Pixel utility functions

// Define types for fbq function
declare global {
  interface Window {
    fbq?: (event: string, eventName: string, params?: any) => void;
    _fbq?: any;
  }
}

/**
 * Initialize Facebook Pixel with the provided ID
 * @param pixelId Facebook Pixel ID to initialize
 * @returns True if initialization was successful
 */
export const initFacebookPixel = (pixelId: string): boolean => {
  try {
    if (!pixelId) {
      console.warn('Facebook Pixel ID not provided');
      return false;
    }

    // Initialize Facebook Pixel
    window.fbq = window.fbq || function() {
      (window.fbq as any).q = (window.fbq as any).q || [];
      (window.fbq as any).q.push(arguments);
    };
    
    window._fbq = window._fbq || window.fbq;
    
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    
    console.log(`Facebook Pixel initialized with ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error('Error initializing Facebook Pixel:', error);
    return false;
  }
};

/**
 * Track a custom event with Facebook Pixel
 * @param eventName Name of the event to track
 * @param params Additional parameters to send
 */
export const trackPixelEvent = (
  eventName: string, 
  params?: Record<string, any>
): void => {
  try {
    if (typeof window === 'undefined' || !window.fbq) {
      console.warn('Facebook Pixel not initialized');
      return;
    }

    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
    
    console.log(`Tracked Facebook Pixel event: ${eventName}`, params || '');
  } catch (error) {
    console.error(`Error tracking Facebook Pixel event ${eventName}:`, error);
  }
};

/**
 * Track PageView event on route change
 * @param url The URL to track
 */
export const trackPageView = (url?: string): void => {
  try {
    if (typeof window === 'undefined' || !window.fbq) {
      return;
    }

    window.fbq('track', 'PageView');
    
    if (url) {
      console.log(`Tracked Facebook Pixel PageView: ${url}`);
    }
  } catch (error) {
    console.error('Error tracking Facebook Pixel PageView:', error);
  }
};

// Adding the loadFacebookPixel function to match App.tsx import
export const loadFacebookPixel = (): void => {
  const pixelId = process.env.REACT_APP_FACEBOOK_PIXEL_ID || '';
  if (pixelId) {
    initFacebookPixel(pixelId);
  } else {
    console.warn('Facebook Pixel ID not found in environment variables');
  }
};

export default {
  initFacebookPixel,
  trackPixelEvent,
  trackPageView,
  loadFacebookPixel
};
