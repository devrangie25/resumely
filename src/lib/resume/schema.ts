import { z } from "zod";

export const TEMPLATE_IDS = ["classic", "modern", "minimal"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

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

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
};

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
