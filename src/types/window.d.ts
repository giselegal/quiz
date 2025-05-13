
// Type definitions for Facebook Pixel and Google Analytics
interface Window {
  fbq?: (event: string, eventName: string, params?: any, eventId?: {eventID: string}) => void;
  gtag?: (command: string, target: string, params?: object) => void;
  _fbq?: any;
  
  // Custom utility functions exposed to the global scope
  checkMainRoutes?: () => any;
  fixMainRoutes?: () => any;
  monitorFunnelRoutes?: () => any;
  checkSiteHealth?: () => any;
  fixBlurryIntroQuizImages?: () => number;

  // Other global variables
  isDev?: boolean;
  isPreview?: boolean;
  isProduction?: boolean;
}
