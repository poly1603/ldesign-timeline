/**
 * Color utilities
 */

/**
 * Parse color string to RGBA
 */
export function parseColor(color: string): { r: number; g: number; b: number; a: number } {
  // Default color
  const defaultColor = { r: 0, g: 0, b: 0, a: 1 };

  // Hex color
  if (color.startsWith('#')) {
    const hex = color.slice(1);

    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b, a: 1 };
    }

    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 1 };
    }

    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return { r, g, b, a };
    }
  }

  // RGB/RGBA color
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  return defaultColor;
}

/**
 * Convert RGBA to hex string
 */
export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');

  if (a < 1) {
    const aHex = Math.round(a * 255).toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  return `#${rHex}${gHex}${bHex}`;
}

/**
 * Convert RGBA to CSS string
 */
export function rgbaToCss(r: number, g: number, b: number, a: number = 1): string {
  if (a < 1) {
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/**
 * Lighten color
 */
export function lighten(color: string, amount: number): string {
  const { r, g, b, a } = parseColor(color);

  const newR = Math.min(255, r + amount * 255);
  const newG = Math.min(255, g + amount * 255);
  const newB = Math.min(255, b + amount * 255);

  return rgbaToCss(newR, newG, newB, a);
}

/**
 * Darken color
 */
export function darken(color: string, amount: number): string {
  const { r, g, b, a } = parseColor(color);

  const newR = Math.max(0, r - amount * 255);
  const newG = Math.max(0, g - amount * 255);
  const newB = Math.max(0, b - amount * 255);

  return rgbaToCss(newR, newG, newB, a);
}

/**
 * Set color opacity
 */
export function setOpacity(color: string, opacity: number): string {
  const { r, g, b } = parseColor(color);
  return rgbaToCss(r, g, b, opacity);
}

/**
 * Mix two colors
 */
export function mixColors(color1: string, color2: string, ratio: number = 0.5): string {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  const r = c1.r + (c2.r - c1.r) * ratio;
  const g = c1.g + (c2.g - c1.g) * ratio;
  const b = c1.b + (c2.b - c1.b) * ratio;
  const a = c1.a + (c2.a - c1.a) * ratio;

  return rgbaToCss(r, g, b, a);
}

/**
 * Generate gradient colors
 */
export function generateGradient(startColor: string, endColor: string, steps: number): string[] {
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    colors.push(mixColors(startColor, endColor, ratio));
  }

  return colors;
}

/**
 * Get contrasting color (black or white)
 */
export function getContrastColor(color: string): string {
  const { r, g, b } = parseColor(color);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Predefined color palette
 */
export const colorPalette = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#13c2c2',
  purple: '#722ed1',
  pink: '#eb2f96',
  orange: '#fa8c16',
  cyan: '#13c2c2',
  lime: '#a0d911',
  gold: '#faad14',
  volcano: '#fa541c',
  magenta: '#eb2f96',
  geekblue: '#2f54eb',
};

/**
 * Get color from palette
 */
export function getColorFromPalette(index: number): string {
  const colors = Object.values(colorPalette);
  return colors[index % colors.length];
}

