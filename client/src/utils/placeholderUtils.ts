/**
 * Utility functions for placeholder images and fallbacks
 */

// Default placeholder image that works locally
export const DEFAULT_PLACEHOLDER = "/placeholder.svg";

// Cloudinary placeholder that should work
export const CLOUDINARY_PLACEHOLDER =
  "https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300,f_auto,q_auto/v1/placeholders/default-image";

/**
 * Get a working placeholder image URL
 * @param width - Image width (optional)
 * @param height - Image height (optional)
 * @param text - Placeholder text (optional)
 * @returns Working placeholder URL
 */
export function getPlaceholderImage(
  width = 400,
  height = 300,
  text = "Imagem"
): string {
  // Use local SVG placeholder first
  return DEFAULT_PLACEHOLDER;
}

/**
 * Get logo placeholder
 * @returns Logo placeholder URL
 */
export function getLogoPlaceholder(): string {
  return DEFAULT_PLACEHOLDER;
}

/**
 * Get video placeholder
 * @returns Video placeholder URL
 */
export function getVideoPlaceholder(): string {
  // For video, we'll use a static image placeholder
  return DEFAULT_PLACEHOLDER;
}

/**
 * Replace problematic placeholder URLs with working ones
 * @param url - Original URL
 * @returns Fixed URL
 */
export function fixPlaceholderUrl(url: string): string {
  if (url.includes("via.placeholder.com")) {
    return DEFAULT_PLACEHOLDER;
  }
  return url;
}
