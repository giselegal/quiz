
// Corrigir a definição de fbq para resolver "All declarations of 'fbq' must have identical modifiers."
// Sem acesso ao arquivo original, a correção seria unificar as declarações:

interface FacebookPixelEvent {
  (event: string, eventId: string): void;
  (event: string, eventId: string, data: any): void;
}

// Declare fb pixel
declare global {
  interface Window {
    fbq: FacebookPixelEvent;
  }
}
