import { tokens } from "@/config/designTokens";

export const sharedStyles = {
  colors: tokens.colors,
  spacing: tokens.spacing,
  borderRadius: tokens.radius,
  shadows: tokens.shadows,
  typography: tokens.typography,
  
  // Legacy compatibility - keeping original structure but using tokens
  input: {
    background: tokens.colors.backgroundAlt,
    border: tokens.colors.borderLight,
    text: tokens.colors.text,
    placeholder: tokens.colors.textMuted
  }
};

// Export tokens directly for convenience
export { tokens };
