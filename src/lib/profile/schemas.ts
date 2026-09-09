import { z } from "zod";

import {
  awardItemSchema,
  certificationItemSchema,
  educationItemSchema,
  experienceItemSchema,
  languageItemSchema,
  projectItemSchema,
  referenceItemSchema,
  skillItemSchema,
} from "@/lib/resume/schema";

export const profileResumeSectionsSchema = z.object({
  summary: z.string(),
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(skillItemSchema),
  projects: z.array(projectItemSchema),
  certifications: z.array(certificationItemSchema),
  languages: z.array(languageItemSchema),
  awards: z.array(awardItemSchema),
  references: z.array(referenceItemSchema),
});

export const profileSchema = z
  .object({
    fullName: z.string().min(1, "Name is required."),
    headline: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    website: z.string(),
    linkedin: z.string(),
    github: z.string(),
  })
  .merge(profileResumeSectionsSchema);

export const changePasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
