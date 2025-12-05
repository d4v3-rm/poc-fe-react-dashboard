export type HexColor = string;

export const DEFAULT_THEME_PALETTE = {
  light: {
    layout: "#EEF4FF",
    panel: "#FFFFFF",
    panelStrong: "#F6FAFF",
  },
  dark: {
    layout: "#0F1524",
    panel: "#1A2540",
    panelStrong: "#22314E",
  },
};

const normalizeHex = (value: string): string | null => {
  const normalized = value.replace("#", "").trim();
  if (/^[0-9a-fA-F]{3}$/.test(normalized)) {
    return normalized
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  if (/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return normalized;
  }

  return null;
};

export const getFallbackColor = (hex: string): string => {
  if (normalizeHex(hex) === null) {
    return "#0d8bff";
  }

  return `#${normalizeHex(hex)}`;
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return null;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return [red, green, blue];
};

export const toRgba = (hex: string, alpha: number): string => {
  const parsed = hexToRgb(hex);

  if (!parsed) {
    return `rgba(13, 139, 255, ${alpha})`;
  }

  const [red, green, blue] = parsed;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const srgbToLinear = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (rgb: [number, number, number]): number =>
  0.2126 * srgbToLinear(rgb[0]) +
  0.7152 * srgbToLinear(rgb[1]) +
  0.0722 * srgbToLinear(rgb[2]);

const contrastRatio = (
  first: [number, number, number],
  second: [number, number, number],
): number => {
  const luminanceFirst = relativeLuminance(first);
  const luminanceSecond = relativeLuminance(second);
  const lighter = Math.max(luminanceFirst, luminanceSecond);
  const darker = Math.min(luminanceFirst, luminanceSecond);
  return (lighter + 0.05) / (darker + 0.05);
};

const blendColor = (
  foreground: [number, number, number],
  background: [number, number, number],
  alpha: number,
): [number, number, number] => {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  return [
    Math.round(
      foreground[0] * clampedAlpha + background[0] * (1 - clampedAlpha),
    ),
    Math.round(
      foreground[1] * clampedAlpha + background[1] * (1 - clampedAlpha),
    ),
    Math.round(
      foreground[2] * clampedAlpha + background[2] * (1 - clampedAlpha),
    ),
  ];
};

const BLACK_RGB: [number, number, number] = [22, 22, 22];
const WHITE_RGB: [number, number, number] = [255, 255, 255];

const pickReadableText = (background: [number, number, number]): string => {
  const blackContrast = contrastRatio(background, BLACK_RGB);
  const whiteContrast = contrastRatio(background, WHITE_RGB);

  return blackContrast >= whiteContrast ? "#161616" : "#ffffff";
};

export const textColorFor = (hex: string): string => {
  const parsed = hexToRgb(hex);

  if (!parsed) {
    return "#ffffff";
  }

  return pickReadableText(parsed);
};

export const semanticTagStyle = (
  hex: string,
  alphaBackground = 0.16,
  alphaBorder = 0.42,
  surfaceHex = "#ffffff",
): Record<string, string> => {
  const safeHex = getFallbackColor(hex);
  const safeSurface = getFallbackColor(surfaceHex);
  const tagRgb = hexToRgb(safeHex) ?? [13, 139, 255];
  const surfaceRgb = hexToRgb(safeSurface) ?? [255, 255, 255];
  const blendedBackground = blendColor(tagRgb, surfaceRgb, alphaBackground);

  return {
    backgroundColor: toRgba(safeHex, alphaBackground),
    borderColor: toRgba(safeHex, alphaBorder),
    color: pickReadableText(blendedBackground),
  };
};

export const statusTagStyle = (
  hex: string,
  surfaceHex = "#ffffff",
): Record<string, string> => {
  const safeHex = getFallbackColor(hex);
  const safeSurface = getFallbackColor(surfaceHex);
  const surfaceRgb = hexToRgb(safeSurface) ?? [255, 255, 255];
  const darkSurface = relativeLuminance(surfaceRgb) < 0.2;
  const alphaBackground = darkSurface ? 0.38 : 0.24;
  const alphaBorder = darkSurface ? 0.62 : 0.52;
  const tagRgb = hexToRgb(safeHex) ?? [13, 139, 255];
  const blendedBackground = blendColor(tagRgb, surfaceRgb, alphaBackground);

  return {
    backgroundColor: toRgba(safeHex, alphaBackground),
    borderColor: toRgba(safeHex, alphaBorder),
    color: pickReadableText(blendedBackground),
    fontWeight: "600",
  };
};
