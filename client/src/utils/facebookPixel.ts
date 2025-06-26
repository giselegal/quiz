
// Facebook Pixel utility functions
import {
  getPixelId,
  getCurrentFunnelConfig,
  trackFunnelEvent,
} from "../services/pixelManager";

/**
 * Initialize Facebook Pixel with the provided ID
 * @param pixelId Facebook Pixel ID to initialize
 * @returns True if initialization was successful
 */
export const initFacebookPixel = (pixelId: string): boolean => {
  try {
    if (!pixelId) {
      console.warn("Facebook Pixel ID not provided");
      return false;
    }

    // Initialize Facebook Pixel
    if (!window.fbq) {
      window.fbq = function (...args: any[]) {
        (window.fbq as any).q = (window.fbq as any).q || [];
        (window.fbq as any).q.push(args);
      };
      window._fbq = window.fbq;
      (window.fbq as any).loaded = true;
      (window.fbq as any).version = "2.0";
    }

    window.fbq("track", "init", { pixelId });
    // Facebook Pixel - PageView será disparado manualmente quando necessário

    console.log(`Facebook Pixel initialized with ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error("Error initializing Facebook Pixel:", error);
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
  params?: Record<string, unknown>
): void => {
  try {
    if (typeof window === "undefined" || !window.fbq) {
      console.warn("Facebook Pixel not initialized");
      return;
    }

    // Track the actual event
    window.fbq("track", eventName, params);

    // Log real event data for analysis
    const pixelId = getPixelId();
    if (pixelId) {
      import('./realPixelData').then(({ logRealPixelEvent }) => {
        logRealPixelEvent(eventName, params || {}, pixelId);
      });
    }

    console.log(`Tracked Facebook Pixel event: ${eventName}`, params || "");
  } catch (error) {
    console.error(`Error tracking Facebook Pixel event ${eventName}:`, error);
  }
};

/**
 * Track PageView event on route change - OTIMIZADO
 * @param url The URL to track
 */
export const trackPageView = (url?: string): void => {
  try {
    if (typeof window === "undefined" || !window.fbq) {
      return;
    }

    // Facebook Pixel - REMOVIDO: PageView não é evento principal
    // window.fbq('track', 'PageView');

    if (url) {
      console.log(`Facebook Pixel PageView removido para otimização: ${url}`);
    }
  } catch (error) {
    console.error("Error tracking Facebook Pixel PageView:", error);
  }
};

// Adding the loadFacebookPixel function to use dynamic pixel management
export const loadFacebookPixel = (): void => {
  try {
    // Usa o pixelManager para obter o pixel ID correto baseado na rota atual
    const pixelId = getPixelId();
    const funnelConfig = getCurrentFunnelConfig();

    if (pixelId) {
      initFacebookPixel(pixelId);
      console.log(
        `Loaded Facebook Pixel for funnel: ${funnelConfig.funnelName} (${pixelId})`
      );

      // Dispara evento de inicialização específico do funil
      trackFunnelEvent("PixelInitialized", {
        pixel_id: pixelId,
        funnel_type: funnelConfig.funnelName,
        page_url: window.location.href,
      });
    } else {
      console.warn("No Facebook Pixel ID found for current route");
    }
  } catch (error) {
    console.error("Error loading Facebook Pixel:", error);
  }
};

export default {
  initFacebookPixel,
  trackPixelEvent,
  trackPageView,
  loadFacebookPixel,
};
