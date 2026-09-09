import { z } from "zod";

export const TEMPLATE_FAMILIES = ["classic", "modern", "minimal"] as const;
export type TemplateFamily = (typeof TEMPLATE_FAMILIES)[number];

export const TEMPLATE_VARIANTS = [
  {
    id: "classic",
    family: "classic",
    label: "Traditional",
    description: "Centered serif masthead with double rules — ATS-friendly.",
  },
  {
    id: "classic-navy",
    family: "classic",
    label: "Navy Formal",
    description: "Navy contact stripe on the left, formal serif body.",
  },
  {
    id: "classic-executive",
    family: "classic",
    label: "Executive",
    description: "Compact timeline: dates in a left column, content on the right.",
  },
  {
    id: "classic-academic",
    family: "classic",
    label: "Academic",
    description: "Warm page, small-cap headings, and generous CV spacing.",
  },
  {
    id: "classic-burgundy",
    family: "classic",
    label: "Burgundy",
    description: "Wine-red banner header with a cream serif body.",
  },
  {
    id: "classic-gold",
    family: "classic",
    label: "Gold",
    description: "Charcoal and gold ornaments with a centered formal header.",
  },
  {
    id: "modern",
    family: "modern",
    label: "Slate",
    description: "Dark left sidebar with teal accents and skill bars.",
  },
  {
    id: "modern-navy",
    family: "modern",
    label: "Navy",
    description: "Navy panel on the right with a ringed portrait.",
  },
  {
    id: "modern-emerald",
    family: "modern",
    label: "Emerald",
    description: "Light sage sidebar, square photo, and mint pills.",
  },
  {
    id: "modern-sunset",
    family: "modern",
    label: "Sunset",
    description: "Warm header band, photo on the right, rust accents.",
  },
  {
    id: "modern-coral",
    family: "modern",
    label: "Coral",
    description: "Centered infographic header with skill and language bars.",
  },
  {
    id: "modern-indigo",
    family: "modern",
    label: "Indigo",
    description: "Indigo rail and boxed headings on a clean page.",
  },
  {
    id: "modern-banner",
    family: "modern",
    label: "Banner",
    description: "Navy header with gold accents and a two-column body.",
  },
  {
    id: "modern-mist",
    family: "modern",
    label: "Mist",
    description: "Light grey designer panel with a rounded photo.",
  },
  {
    id: "minimal",
    family: "minimal",
    label: "Air",
    description: "Large light name, open whitespace, and hairline rules.",
  },
  {
    id: "minimal-serif",
    family: "minimal",
    label: "Serif",
    description: "Editorial cream page with brown serif headlines.",
  },
  {
    id: "minimal-split",
    family: "minimal",
    label: "Split",
    description: "Two-column body: story on the left, facts on the right.",
  },
  {
    id: "minimal-accent",
    family: "minimal",
    label: "Accent",
    description: "Black rail and boxed section labels.",
  },
  {
    id: "minimal-mint",
    family: "minimal",
    label: "Mint",
    description: "Teal header band with icon contacts and pills.",
  },
  {
    id: "minimal-coral",
    family: "minimal",
    label: "Coral",
    description: "Centered warm header with a decorative underline.",
  },
  {
    id: "minimal-navy",
    family: "minimal",
    label: "Navy",
    description: "Navy and gold split header with a thin gold rule.",
  },
  {
    id: "minimal-sand",
    family: "minimal",
    label: "Sand",
    description: "Beige top panel and a quiet white body.",
  },
] as const;

export type TemplateId = (typeof TEMPLATE_VARIANTS)[number]["id"];
export const TEMPLATE_IDS = TEMPLATE_VARIANTS.map(
  (variant) => variant.id,
) as TemplateId[];

export const FAMILY_LABELS: Record<TemplateFamily, string> = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
};

export function isTemplateId(value: string): value is TemplateId {
  return TEMPLATE_IDS.includes(value as TemplateId);
}

export function getTemplateFamily(templateId: string): TemplateFamily {
  if (templateId.startsWith("modern")) return "modern";
  if (templateId.startsWith("minimal")) return "minimal";
  return "classic";
}

export function getTemplateVariant(templateId: string) {
  return (
    TEMPLATE_VARIANTS.find((variant) => variant.id === templateId) ??
    TEMPLATE_VARIANTS[0]
  );
}

export function variantsForFamily(family: TemplateFamily) {
  return TEMPLATE_VARIANTS.filter((variant) => variant.family === family);
}

export function getTemplateDisplayLabel(templateId: string) {
  const variant = getTemplateVariant(templateId);
  return `${FAMILY_LABELS[variant.family]} · ${variant.label}`;
}

export const SECTION_IDS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "references",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const LANGUAGE_LEVELS = [
  "Native",
  "Fluent",
  "Professional",
  "Intermediate",
  "Basic",
] as const;

export const personalSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  linkedin: z.string(),
  github: z.string(),
  photoUrl: z.string(),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  bullets: z.array(z.string()),
});

export const educationItemSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  field: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  details: z.string(),
});

export const skillItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string(),
  bullets: z.array(z.string()),
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string(),
});

export const languageItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  proficiency: z.string(),
});

export const awardItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: z.string(),
  description: z.string(),
});

export const referenceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const sectionVisibilitySchema = z.object({
  summary: z.boolean(),
  experience: z.boolean(),
  education: z.boolean(),
  skills: z.boolean(),
  projects: z.boolean(),
  certifications: z.boolean(),
  languages: z.boolean(),
  awards: z.boolean(),
  references: z.boolean(),
});

export const resumeThemeSchema = z.object({
  primary: z.string(),
});

export const resumeContentSchema = z.object({
  personal: personalSchema,
  summary: z.string(),
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(skillItemSchema),
  projects: z.array(projectItemSchema),
  certifications: z.array(certificationItemSchema),
  languages: z.array(languageItemSchema),
  awards: z.array(awardItemSchema),
  references: z.array(referenceItemSchema),
  sectionOrder: z.array(z.enum(SECTION_IDS)),
  sectionVisibility: sectionVisibilitySchema,
  theme: resumeThemeSchema.default({ primary: "" }),
});

export type PersonalInfo = z.infer<typeof personalSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type AwardItem = z.infer<typeof awardItemSchema>;
export type ReferenceItem = z.infer<typeof referenceItemSchema>;
export type ResumeContent = z.infer<typeof resumeContentSchema>;

export const TEMPLATE_LABELS: Record<TemplateId, string> = Object.fromEntries(
  TEMPLATE_VARIANTS.map((variant) => [
    variant.id,
    `${FAMILY_LABELS[variant.family]} · ${variant.label}`,
  ]),
) as Record<TemplateId, string>;

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  references: "References",
};
