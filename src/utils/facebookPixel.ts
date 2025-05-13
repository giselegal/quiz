
// Facebook Pixel Events
interface FacebookPixelEvent {
  (event: string, eventId: string): void;
  (event: string, eventId: string, data: any): void;
  (event: string, eventName: string, params?: any, eventId?: { eventID: string }): void;
}

// Declare fb pixel for global scope
declare global {
  interface Window {
    fbq: FacebookPixelEvent;
  }
}

/**
 * Load Facebook Pixel
 */
export const loadFacebookPixel = (): void => {
  // Check if already loaded
  if (typeof window !== 'undefined' && window.fbq) return;

  // Standard Facebook Pixel init code
  // eslint-disable-next-line
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  // Initialize with your pixel ID
  window.fbq('init', '799504865608858');
  window.fbq('track', 'PageView');
};

/**
 * Track a custom Facebook Pixel event
 * @param eventName The name of the event to track
 * @param params Optional parameters for the event
 * @param eventId Optional event ID for deduplication
 */
export const trackPixelEvent = (
  eventName: string, 
  params?: any, 
  eventId?: string
): void => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Facebook Pixel not loaded');
    return;
  }

  if (eventId) {
    window.fbq('track', eventName, params, { eventID: eventId });
  } else {
    window.fbq('track', eventName, params);
  }
};

export default {
  loadFacebookPixel,
  trackPixelEvent
};
