
// Analytics utilities

// UTM tracking
export const captureUTMParameters = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    // Capture standard UTM parameters
    if (urlParams.has('utm_source')) utmParams.utm_source = urlParams.get('utm_source') || '';
    if (urlParams.has('utm_medium')) utmParams.utm_medium = urlParams.get('utm_medium') || '';
    if (urlParams.has('utm_campaign')) utmParams.utm_campaign = urlParams.get('utm_campaign') || '';
    if (urlParams.has('utm_content')) utmParams.utm_content = urlParams.get('utm_content') || '';
    if (urlParams.has('utm_term')) utmParams.utm_term = urlParams.get('utm_term') || '';
    
    // Facebook click ID
    if (urlParams.has('fbclid')) utmParams.fbclid = urlParams.get('fbclid') || '';
    
    // Store UTM parameters in localStorage for session tracking
    if (Object.keys(utmParams).length > 0) {
      localStorage.setItem('utm_parameters', JSON.stringify(utmParams));
      console.log('UTM parameters captured:', utmParams);
    }
    
    return utmParams;
  } catch (error) {
    console.error('Error capturing UTM parameters:', error);
    return {};
  }
};

/**
 * Track a page view event
 */
export const trackPageView = (page: string) => {
  console.log(`Page view: ${page}`);
  // Implement your analytics tracking here
};

/**
 * Track a button click event
 * @param buttonId Identifier for the button
 * @param buttonText Optional button text
 * @param section Optional section where the button is located
 * @param category Optional category for the button
 */
export const trackButtonClick = (
  buttonId: string, 
  buttonText?: string,
  section?: string,
  category?: string
) => {
  console.log(`Button click: ${buttonId} - ${buttonText || 'No text'} (${section || 'unknown section'}, ${category || 'unknown category'})`);
  // Full implementation would go here
};

/**
 * Track a form submission event
 */
export const trackFormSubmit = (formId: string, data?: Record<string, any>) => {
  console.log(`Form submit: ${formId}`);
  // Implement your analytics tracking here
};

/**
 * Track a quiz answer
 * @param questionId ID of the question
 * @param answerId Selected answer(s)
 * @param currentQuestionIndex Optional current question index
 * @param totalQuestions Optional total questions count
 */
export const trackQuizAnswer = (
  questionId: string, 
  selectedOptions: string[],
  currentQuestionIndex?: number,
  totalQuestions?: number
) => {
  console.log(`Quiz answer: ${questionId} - ${selectedOptions.join(", ")}${
    currentQuestionIndex !== undefined ? ` (Q${currentQuestionIndex + 1}/${totalQuestions})` : ""
  }`);
  // Implement full tracking here
};

/**
 * Track quiz start
 */
export const trackQuizStart = (userName: string, userEmail?: string) => {
  console.log(`Quiz started by ${userName}${userEmail ? ` (${userEmail})` : ''}`);
  // Implement quiz start tracking here
};

/**
 * Track quiz completion
 */
export const trackQuizComplete = () => {
  console.log('Quiz completed');
  // Implement quiz completion tracking
};

/**
 * Track view of result page
 */
export const trackResultView = (resultType: string) => {
  console.log(`Result viewed: ${resultType}`);
  // Implement result view tracking
};

/**
 * Track lead generation
 */
export const trackLeadGeneration = (email: string, source?: string) => {
  console.log(`Lead generated: ${email} from ${source || 'direct'}`);
  // Implement lead generation tracking
};

/**
 * Track sale conversion
 */
export const trackSaleConversion = (value: number, productName: string, currency: string = 'BRL') => {
  console.log(`Sale conversion: ${productName} - ${currency} ${value}`);
  // Implement sale tracking
};

/**
 * Get analytics events for the admin panel
 */
export const getAnalyticsEvents = () => {
  // Implement your analytics retrieval logic here
  return [];
};

/**
 * Clear analytics data for testing purposes
 */
export const clearAnalyticsData = () => {
  console.log('Analytics data cleared');
  // Implement your analytics clearing logic here
};

/**
 * Initialize Facebook Pixel
 */
export const initFacebookPixel = (pixelId?: string) => {
  const defaultPixelId = '1234567890123456'; // Default ID if none provided
  const id = pixelId || defaultPixelId;
  
  console.log(`Initializing Facebook Pixel: ${id}`);
  // Implement Facebook Pixel initialization
  
  try {
    if (typeof window !== 'undefined' && !window.fbq) {
      // Standard Facebook Pixel initialization code
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', id);
      window.fbq('track', 'PageView');
    }
  } catch (error) {
    console.error('Error initializing Facebook Pixel:', error);
  }
};

/**
 * Test Facebook Pixel
 */
export const testFacebookPixel = () => {
  console.log('Testing Facebook Pixel');
  // Implement Facebook Pixel test
};

/**
 * Track an event in Facebook Pixel
 */
export const trackPixelEvent = (eventName: string, params?: Record<string, any>) => {
  console.log(`Tracking pixel event: ${eventName}`);
  // Implement Facebook Pixel event tracking
  
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, params);
    }
  } catch (error) {
    console.error(`Error tracking pixel event ${eventName}:`, error);
  }
};

// Add global type definition for fbq
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}
