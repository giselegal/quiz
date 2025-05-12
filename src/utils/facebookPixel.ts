
// Define Facebook Pixel interface for TypeScript
interface FacebookPixel {
  (event: string, eventName: string, params?: any): void;
  push: Array<any>;
  loaded: boolean;
  version: string;
  queue: Array<any>;
}

declare global {
  interface Window {
    fbq: FacebookPixel;
    _fbq: any;
  }
}

export const initFacebookPixel = () => {
  if (typeof window !== 'undefined') {
    // Initialize Facebook Pixel
    !function(f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if(f.fbq) return;
      n=f.fbq=function() {
        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
      };
      
      if(!f._fbq) f._fbq=n;
      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];
      t=b.createElement(e);
      t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s && s.parentNode && s.parentNode.insertBefore(t,s);
    }(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    // Initialize with your pixel ID
    window.fbq('init', 'YOUR_PIXEL_ID');
    window.fbq('track', 'PageView');
  }
};

// Alias for loadFacebookPixel to fix App.tsx import error
export const loadFacebookPixel = initFacebookPixel;

// Facebook Pixel tracking functions
export const trackFacebookPixelEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
    console.log(`[Facebook Pixel] Tracked event: ${eventName}`, parameters);
  }
};

// Alias for trackPixelEvent to fix Funil2OfertaDireta.tsx import error
export const trackPixelEvent = trackFacebookPixelEvent;

export const trackFacebookPixelCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
    console.log(`[Facebook Pixel] Tracked custom event: ${eventName}`, parameters);
  }
};
