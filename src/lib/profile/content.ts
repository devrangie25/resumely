import type { ProfileRow } from "@/lib/profile/defaults";
import { mergeProfileIntoPersonal } from "@/lib/profile/defaults";
import { emptyResumeContent } from "@/lib/resume/defaults";
import type { ResumeContent } from "@/lib/resume/schema";

export type ProfileResumeSections = Pick<
  ResumeContent,
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "references"
>;

export function emptyProfileResumeSections(): ProfileResumeSections {
  return {
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    references: [],
  };
}

export function parseProfileResumeSections(value: unknown): ProfileResumeSections {
  const fallback = emptyProfileResumeSections();
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const input = value as Partial<ProfileResumeSections>;
  return {
    summary: input.summary ?? "",
    experience: input.experience ?? [],
    education: input.education ?? [],
    skills: input.skills ?? [],
    projects: input.projects ?? [],
    certifications: input.certifications ?? [],
    languages: input.languages ?? [],
    awards: input.awards ?? [],
    references: input.references ?? [],
  };
}

export function profileResumeSectionsFromRow(
  profile: ProfileRow | null,
): ProfileResumeSections {
  return parseProfileResumeSections(profile?.resume_content);
}

export function applyProfileToNewResume(
  profile: ProfileRow | null,
  authEmail = "",
): ResumeContent {
  const content = emptyResumeContent();
  const sections = profileResumeSectionsFromRow(profile);

  return {
    ...content,
    personal: mergeProfileIntoPersonal(content.personal, profile, authEmail),
    ...sections,
  };
}

export function profileToEditorContent(
  profile: ProfileRow | null,
  authEmail = "",
): ResumeContent {
  return applyProfileToNewResume(profile, authEmail);
}
