
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
    monitorFunnelRoutes?: () => any;
    checkSiteHealth?: () => any;
    fixBlurryIntroQuizImages?: (
      rootElement?: HTMLElement | null,
      opts?: { selector?: string; onFixed?: (img: HTMLImageElement) => void }
    ) => HTMLImageElement[];
  }
}

export {};
