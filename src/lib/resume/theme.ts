import {
  getTemplateFamily,
  type TemplateId,
} from "@/lib/resume/schema";

export type PhotoShape = "circle" | "rounded" | "square";
export type ModernLayout = "sidebar" | "banner" | "rail";
export type SkillStyle = "list" | "pills";

export type ResolvedTheme = {
  primary: string;
  sidebar: string;
  sidebarText: string;
  accent: string;
  heading: string;
  company: string;
  rule: string;
  photo: PhotoShape;
  modernLayout: ModernLayout;
  skillStyle: SkillStyle;
  splitHeader: boolean;
  classicAlign: "center" | "left";
  font: "sans" | "serif";
};

type VariantPreset = Omit<ResolvedTheme, "primary"> & {
  primary: string;
};

const PRESETS: Record<string, VariantPreset> = {
  classic: {
    primary: "#18181b",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#3f3f46",
    heading: "#18181b",
    company: "#3f3f46",
    rule: "#18181b",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "center",
    font: "serif",
  },
  "classic-navy": {
    primary: "#1e3a5f",
    sidebar: "#1e3a5f",
    sidebarText: "#f8fafc",
    accent: "#334155",
    heading: "#1e3a5f",
    company: "#1e3a5f",
    rule: "#1e3a5f",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
  },
  "classic-executive": {
    primary: "#111827",
    sidebar: "#111827",
    sidebarText: "#f9fafb",
    accent: "#374151",
    heading: "#111827",
    company: "#111827",
    rule: "#111827",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "center",
    font: "serif",
  },
  "classic-academic": {
    primary: "#57534e",
    sidebar: "#44403c",
    sidebarText: "#fafaf9",
    accent: "#78716c",
    heading: "#44403c",
    company: "#57534e",
    rule: "#a8a29e",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
  },
  "classic-burgundy": {
    primary: "#7f1d1d",
    sidebar: "#7f1d1d",
    sidebarText: "#fef2f2",
    accent: "#7f1d1d",
    heading: "#7f1d1d",
    company: "#7f1d1d",
    rule: "#7f1d1d",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "center",
    font: "serif",
  },
  modern: {
    primary: "#115e59",
    sidebar: "#18181b",
    sidebarText: "#f4f4f5",
    accent: "#99f6e4",
    heading: "#115e59",
    company: "#115e59",
    rule: "#115e59",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "modern-navy": {
    primary: "#1e3a8a",
    sidebar: "#0f2744",
    sidebarText: "#f1f5f9",
    accent: "#bae6fd",
    heading: "#1e3a8a",
    company: "#1e3a8a",
    rule: "#1e3a8a",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "modern-emerald": {
    primary: "#047857",
    sidebar: "#022c22",
    sidebarText: "#ecfdf5",
    accent: "#a7f3d0",
    heading: "#047857",
    company: "#047857",
    rule: "#047857",
    photo: "square",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "modern-sunset": {
    primary: "#c2410c",
    sidebar: "#431407",
    sidebarText: "#fff7ed",
    accent: "#fed7aa",
    heading: "#c2410c",
    company: "#c2410c",
    rule: "#c2410c",
    photo: "rounded",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "modern-coral": {
    primary: "#ea580c",
    sidebar: "#9a3412",
    sidebarText: "#fff7ed",
    accent: "#ffedd5",
    heading: "#c2410c",
    company: "#c2410c",
    rule: "#ea580c",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "modern-indigo": {
    primary: "#4f46e5",
    sidebar: "#1e1b4b",
    sidebarText: "#eef2ff",
    accent: "#c7d2fe",
    heading: "#3730a3",
    company: "#3730a3",
    rule: "#4f46e5",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "modern-banner": {
    primary: "#0e7490",
    sidebar: "#0e7490",
    sidebarText: "#ecfeff",
    accent: "#a5f3fc",
    heading: "#0e7490",
    company: "#0e7490",
    rule: "#0e7490",
    photo: "circle",
    modernLayout: "banner",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  minimal: {
    primary: "#71717a",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#71717a",
    heading: "#71717a",
    company: "#52525b",
    rule: "#e4e4e7",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "minimal-serif": {
    primary: "#78716c",
    sidebar: "#44403c",
    sidebarText: "#fafaf9",
    accent: "#78716c",
    heading: "#78716c",
    company: "#57534e",
    rule: "#d6d3d1",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
  },
  "minimal-split": {
    primary: "#52525b",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#52525b",
    heading: "#71717a",
    company: "#52525b",
    rule: "#e4e4e7",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "list",
    splitHeader: true,
    classicAlign: "left",
    font: "sans",
  },
  "minimal-accent": {
    primary: "#18181b",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#18181b",
    heading: "#18181b",
    company: "#3f3f46",
    rule: "#d4d4d8",
    photo: "circle",
    modernLayout: "rail",
    skillStyle: "list",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "minimal-mint": {
    primary: "#0f766e",
    sidebar: "#0f766e",
    sidebarText: "#f0fdfa",
    accent: "#0f766e",
    heading: "#0f766e",
    company: "#0f766e",
    rule: "#99f6e4",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "minimal-coral": {
    primary: "#c2410c",
    sidebar: "#c2410c",
    sidebarText: "#fff7ed",
    accent: "#c2410c",
    heading: "#c2410c",
    company: "#9a3412",
    rule: "#fdba74",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
  },
  "minimal-navy": {
    primary: "#1e3a5f",
    sidebar: "#1e3a5f",
    sidebarText: "#f8fafc",
    accent: "#1e3a5f",
    heading: "#1e3a5f",
    company: "#1e3a5f",
    rule: "#93c5fd",
    photo: "circle",
    modernLayout: "sidebar",
    skillStyle: "pills",
    splitHeader: true,
    classicAlign: "left",
    font: "sans",
  },
};

export const ACCENT_SWATCHES = [
  "#115e59",
  "#0e7490",
  "#1e3a5f",
  "#1e3a8a",
  "#4f46e5",
  "#7c3aed",
  "#9f1239",
  "#c2410c",
  "#ea580c",
  "#047857",
  "#0f766e",
  "#18181b",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function isValidHex(value: string) {
  return parseHex(value) !== null;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) =>
      clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

function mixHex(from: string, to: string, amount: number) {
  const start = parseHex(from);
  const end = parseHex(to);
  if (!start || !end) return from;
  return rgbToHex(
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount,
    start[2] + (end[2] - start[2]) * amount,
  );
}

export function isLightColor(hex: string) {
  const rgb = parseHex(hex);
  if (!rgb) return false;
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 160;
}

function lighten(hex: string, amount: number) {
  return mixHex(hex, "#ffffff", amount);
}

function darken(hex: string, amount: number) {
  return mixHex(hex, "#000000", amount);
}

export function getVariantPreset(templateId: string): VariantPreset {
  return PRESETS[templateId] ?? PRESETS.classic;
}

export function resolveTheme(
  templateId: TemplateId | string,
  primaryOverride?: string,
): ResolvedTheme {
  const preset = getVariantPreset(templateId);
  const override = primaryOverride?.trim();
  if (!override || !isValidHex(override)) {
    return preset;
  }

  const family = getTemplateFamily(templateId);
  const heading = isLightColor(override) ? darken(override, 0.45) : override;
  const sidebar = isLightColor(override) ? darken(override, 0.28) : override;
  const sidebarText = isLightColor(sidebar) ? "#18181b" : "#fafafa";
  const accent =
    family === "modern"
      ? isLightColor(sidebar)
        ? darken(override, 0.15)
        : lighten(override, 0.58)
      : heading;

  return {
    ...preset,
    primary: override,
    sidebar,
    sidebarText,
    accent,
    heading,
    company: heading,
    rule: family === "minimal" ? lighten(heading, 0.62) : heading,
  };
}

export function photoRadiusClass(shape: PhotoShape) {
  if (shape === "square") return "rounded-md";
  if (shape === "rounded") return "rounded-2xl";
  return "rounded-full";
}

export function photoRadiusPx(shape: PhotoShape, size = 80) {
  if (shape === "square") return 6;
  if (shape === "rounded") return 16;
  return size / 2;
}
