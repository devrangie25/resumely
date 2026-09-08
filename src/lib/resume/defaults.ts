import {
  SECTION_IDS,
  type ResumeContent,
  type SectionId,
} from "@/lib/resume/schema";

export function createId() {
  return crypto.randomUUID();
}

export function emptyVisibility(): Record<SectionId, boolean> {
  return {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    awards: true,
    references: false,
  };
}

export function emptyResumeContent(): ResumeContent {
  return {
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photoUrl: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    references: [],
    sectionOrder: [...SECTION_IDS],
    sectionVisibility: emptyVisibility(),
    theme: { primary: "" },
  };
}

export function parseResumeContent(value: unknown): ResumeContent {
  const fallback = emptyResumeContent();
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const input = value as Partial<ResumeContent>;
  return {
    personal: { ...fallback.personal, ...input.personal },
    summary: input.summary ?? "",
    experience: input.experience ?? [],
    education: input.education ?? [],
    skills: input.skills ?? [],
    projects: input.projects ?? [],
    certifications: input.certifications ?? [],
    languages: input.languages ?? [],
    awards: input.awards ?? [],
    references: input.references ?? [],
    sectionOrder: input.sectionOrder?.length
      ? SECTION_IDS.filter((id) => input.sectionOrder?.includes(id))
      : fallback.sectionOrder,
    sectionVisibility: {
      ...fallback.sectionVisibility,
      ...input.sectionVisibility,
    },
    theme: {
      primary:
        input.theme && typeof input.theme.primary === "string"
          ? input.theme.primary
          : "",
    },
  };
}
