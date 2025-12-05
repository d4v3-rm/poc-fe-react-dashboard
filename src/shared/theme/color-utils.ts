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

export const textColorFor = (hex: string): string => {
  const parsed = hexToRgb(hex);

  if (!parsed) {
    return "#ffffff";
  }

  const [red, green, blue] = parsed;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance > 165 ? "#1f1f1f" : "#ffffff";
};

export const semanticTagStyle = (
  hex: string,
  alphaBackground = 0.16,
  alphaBorder = 0.42,
): Record<string, string> => {
  const safeHex = getFallbackColor(hex);

  return {
    backgroundColor: toRgba(safeHex, alphaBackground),
    borderColor: toRgba(safeHex, alphaBorder),
    color: textColorFor(safeHex),
  };
};
