/// <reference types="vite/client" />

interface Window {
  fbq?: (event: string, eventName: string, params?: any, eventId?: {eventID: string}) => void;
  gtag?(command: string, target: string, params?: object): void;
  _fbq?: any; // Mantendo _fbq se for usado em algum lugar
}
