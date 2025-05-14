
interface WindowWithFBQ extends Window {
  fbq?: FacebookPixelEvent;
}

export type FacebookPixelEvent = (
  event: string,
  eventName: string,
  params?: any,
  eventId?: { eventID: string }
) => void;

declare global {
  interface Window {
    fbq?: FacebookPixelEvent;
  }
}

export const initFacebookPixel = (pixelId: string): void => {
  // Only initialize if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Add the Facebook pixel code
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
    
    // Add the noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  }
};

export const trackQuizEvent = (eventName: string, params?: any): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Facebook Pixel] Tracked event: ${eventName}`, params);
  } else {
    console.warn(`[Facebook Pixel] Failed to track event: ${eventName}. Pixel not initialized.`);
  }
};

export const trackQuizCompletion = (primaryStyle: string): void => {
  trackQuizEvent('QuizCompleted', { primaryStyle });
};

// Add the missing export for loadFacebookPixel
export const loadFacebookPixel = (): void => {
  // Default pixel ID - can be configured from environment variables if needed
  const pixelId = process.env.FACEBOOK_PIXEL_ID || '1234567890';
  initFacebookPixel(pixelId);
};

// Add the missing export for trackPixelEvent
export const trackPixelEvent = (eventName: string, params?: any): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Facebook Pixel] Tracked event: ${eventName}`, params);
  } else {
    console.warn(`[Facebook Pixel] Failed to track event: ${eventName}. Pixel not initialized.`);
  }
};
