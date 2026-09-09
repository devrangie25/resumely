import {
  getTemplateFamily,
  type TemplateId,
} from "@/lib/resume/schema";

export type PhotoShape = "circle" | "rounded" | "square";
export type ModernLayout =
  | "sidebar"
  | "sidebar-right"
  | "banner"
  | "rail"
  | "light-sidebar"
  | "infographic"
  | "header-band";
export type ClassicLayout =
  | "centered"
  | "stripe"
  | "timeline"
  | "academic"
  | "banner"
  | "gold";
export type MinimalLayout =
  | "stack"
  | "two-column"
  | "rail"
  | "editorial"
  | "centered"
  | "band"
  | "split"
  | "sand";
export type SkillStyle = "list" | "pills" | "bars";
export type HeadingStyle = "rule" | "plain" | "bar" | "boxed" | "smallcaps";

export type ResolvedTheme = {
  primary: string;
  sidebar: string;
  sidebarText: string;
  accent: string;
  heading: string;
  company: string;
  rule: string;
  pageBg: string;
  photo: PhotoShape;
  modernLayout: ModernLayout;
  classicLayout: ClassicLayout;
  minimalLayout: MinimalLayout;
  skillStyle: SkillStyle;
  headingStyle: HeadingStyle;
  splitHeader: boolean;
  classicAlign: "center" | "left";
  font: "sans" | "serif";
  fullBleed: boolean;
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
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "rule",
    splitHeader: false,
    classicAlign: "center",
    font: "serif",
    fullBleed: false,
  },
  "classic-navy": {
    primary: "#1e3a5f",
    sidebar: "#1e3a5f",
    sidebarText: "#f8fafc",
    accent: "#334155",
    heading: "#1e3a5f",
    company: "#1e3a5f",
    rule: "#1e3a5f",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "stripe",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "bar",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
    fullBleed: true,
  },
  "classic-executive": {
    primary: "#111827",
    sidebar: "#111827",
    sidebarText: "#f9fafb",
    accent: "#374151",
    heading: "#111827",
    company: "#111827",
    rule: "#111827",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "timeline",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "rule",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
    fullBleed: false,
  },
  "classic-academic": {
    primary: "#57534e",
    sidebar: "#44403c",
    sidebarText: "#fafaf9",
    accent: "#78716c",
    heading: "#44403c",
    company: "#57534e",
    rule: "#a8a29e",
    pageBg: "#fffdf8",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "academic",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "smallcaps",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
    fullBleed: false,
  },
  "classic-burgundy": {
    primary: "#7f1d1d",
    sidebar: "#7f1d1d",
    sidebarText: "#fef2f2",
    accent: "#7f1d1d",
    heading: "#7f1d1d",
    company: "#7f1d1d",
    rule: "#7f1d1d",
    pageBg: "#fffbf7",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "banner",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "rule",
    splitHeader: false,
    classicAlign: "center",
    font: "serif",
    fullBleed: true,
  },
  "classic-gold": {
    primary: "#b45309",
    sidebar: "#292524",
    sidebarText: "#fafaf9",
    accent: "#d4a017",
    heading: "#292524",
    company: "#78716c",
    rule: "#d4a017",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "gold",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "rule",
    splitHeader: false,
    classicAlign: "center",
    font: "serif",
    fullBleed: false,
  },
  modern: {
    primary: "#115e59",
    sidebar: "#18181b",
    sidebarText: "#f4f4f5",
    accent: "#99f6e4",
    heading: "#115e59",
    company: "#115e59",
    rule: "#115e59",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "bars",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-navy": {
    primary: "#1e3a8a",
    sidebar: "#0f2744",
    sidebarText: "#f1f5f9",
    accent: "#bae6fd",
    heading: "#1e3a8a",
    company: "#1e3a8a",
    rule: "#1e3a8a",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar-right",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-emerald": {
    primary: "#047857",
    sidebar: "#ecfdf5",
    sidebarText: "#064e3b",
    accent: "#047857",
    heading: "#047857",
    company: "#047857",
    rule: "#047857",
    pageBg: "#ffffff",
    photo: "square",
    modernLayout: "light-sidebar",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "pills",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-sunset": {
    primary: "#c2410c",
    sidebar: "#fff7ed",
    sidebarText: "#9a3412",
    accent: "#c2410c",
    heading: "#c2410c",
    company: "#c2410c",
    rule: "#fdba74",
    pageBg: "#fffaf5",
    photo: "rounded",
    modernLayout: "header-band",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "pills",
    headingStyle: "bar",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-coral": {
    primary: "#ea580c",
    sidebar: "#1c1917",
    sidebarText: "#fff7ed",
    accent: "#fdba74",
    heading: "#c2410c",
    company: "#c2410c",
    rule: "#ea580c",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "infographic",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "bars",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-indigo": {
    primary: "#4f46e5",
    sidebar: "#1e1b4b",
    sidebarText: "#eef2ff",
    accent: "#c7d2fe",
    heading: "#3730a3",
    company: "#3730a3",
    rule: "#4f46e5",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "rail",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "pills",
    headingStyle: "boxed",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-banner": {
    primary: "#0f2744",
    sidebar: "#0f2744",
    sidebarText: "#f8fafc",
    accent: "#eab308",
    heading: "#0f2744",
    company: "#0f2744",
    rule: "#eab308",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "banner",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "pills",
    headingStyle: "bar",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "modern-mist": {
    primary: "#52525b",
    sidebar: "#f4f4f5",
    sidebarText: "#18181b",
    accent: "#3f3f46",
    heading: "#3f3f46",
    company: "#52525b",
    rule: "#d4d4d8",
    pageBg: "#ffffff",
    photo: "rounded",
    modernLayout: "light-sidebar",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  minimal: {
    primary: "#71717a",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#71717a",
    heading: "#71717a",
    company: "#52525b",
    rule: "#e4e4e7",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "stack",
    skillStyle: "list",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: false,
  },
  "minimal-serif": {
    primary: "#78716c",
    sidebar: "#44403c",
    sidebarText: "#fafaf9",
    accent: "#a16207",
    heading: "#6b4f3a",
    company: "#78716c",
    rule: "#d6c7b2",
    pageBg: "#f6f0e6",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "editorial",
    skillStyle: "list",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "serif",
    fullBleed: false,
  },
  "minimal-split": {
    primary: "#52525b",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#52525b",
    heading: "#3f3f46",
    company: "#52525b",
    rule: "#e4e4e7",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "two-column",
    skillStyle: "list",
    headingStyle: "rule",
    splitHeader: true,
    classicAlign: "left",
    font: "sans",
    fullBleed: false,
  },
  "minimal-accent": {
    primary: "#18181b",
    sidebar: "#18181b",
    sidebarText: "#fafafa",
    accent: "#18181b",
    heading: "#18181b",
    company: "#3f3f46",
    rule: "#d4d4d8",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "rail",
    classicLayout: "centered",
    minimalLayout: "rail",
    skillStyle: "list",
    headingStyle: "boxed",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "minimal-mint": {
    primary: "#0f766e",
    sidebar: "#0f766e",
    sidebarText: "#f0fdfa",
    accent: "#0f766e",
    heading: "#0f766e",
    company: "#0f766e",
    rule: "#99f6e4",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "band",
    skillStyle: "pills",
    headingStyle: "rule",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
  },
  "minimal-coral": {
    primary: "#c2410c",
    sidebar: "#c2410c",
    sidebarText: "#fff7ed",
    accent: "#c2410c",
    heading: "#c2410c",
    company: "#9a3412",
    rule: "#fdba74",
    pageBg: "#fffaf5",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "centered",
    skillStyle: "pills",
    headingStyle: "rule",
    splitHeader: false,
    classicAlign: "center",
    font: "sans",
    fullBleed: false,
  },
  "minimal-navy": {
    primary: "#1e3a5f",
    sidebar: "#1e3a5f",
    sidebarText: "#f8fafc",
    accent: "#c9a227",
    heading: "#1e3a5f",
    company: "#1e3a5f",
    rule: "#c9a227",
    pageBg: "#ffffff",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "split",
    skillStyle: "pills",
    headingStyle: "bar",
    splitHeader: true,
    classicAlign: "left",
    font: "sans",
    fullBleed: false,
  },
  "minimal-sand": {
    primary: "#a16207",
    sidebar: "#f3e8d4",
    sidebarText: "#44403c",
    accent: "#a16207",
    heading: "#78716c",
    company: "#78716c",
    rule: "#e7d3b0",
    pageBg: "#fffdf8",
    photo: "circle",
    modernLayout: "sidebar",
    classicLayout: "centered",
    minimalLayout: "sand",
    skillStyle: "list",
    headingStyle: "plain",
    splitHeader: false,
    classicAlign: "left",
    font: "sans",
    fullBleed: true,
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
  "#b45309",
  "#c9a227",
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
  const sidebarBase = isLightColor(override) ? darken(override, 0.28) : override;
  const lightSidebar =
    preset.modernLayout === "light-sidebar" ||
    preset.classicLayout === "academic";
  const sidebar = lightSidebar ? lighten(override, 0.88) : sidebarBase;
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

export function skillBarWidth(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash + char.charCodeAt(0)) % 37;
  return 58 + hash;
}

export function languageBarWidth(proficiency: string) {
  const key = proficiency.trim().toLowerCase();
  if (key === "native") return 100;
  if (key === "fluent") return 90;
  if (key === "professional") return 78;
  if (key === "intermediate") return 58;
  if (key === "basic") return 36;
  return 70;
}
