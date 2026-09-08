import type { ResumeContent, SectionId } from "@/lib/resume/schema";

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

export function isSectionPopulated(content: ResumeContent, section: SectionId) {
  switch (section) {
    case "summary":
      return hasText(content.summary);
    case "experience":
      return content.experience.some(
        (item) => hasText(item.company) || hasText(item.title),
      );
    case "education":
      return content.education.some(
        (item) => hasText(item.school) || hasText(item.degree),
      );
    case "skills":
      return content.skills.some((item) => hasText(item.name));
    case "projects":
      return content.projects.some((item) => hasText(item.name));
    case "certifications":
      return content.certifications.some((item) => hasText(item.name));
    case "languages":
      return content.languages.some((item) => hasText(item.name));
    case "awards":
      return content.awards.some((item) => hasText(item.title));
    case "references":
      return content.references.some((item) => hasText(item.name));
  }
}

export function getVisibleSections(content: ResumeContent) {
  return content.sectionOrder.filter(
    (section) =>
      content.sectionVisibility[section] &&
      isSectionPopulated(content, section),
  );
}

export function hasPersonalInfo(content: ResumeContent) {
  const { personal } = content;
  return [
    personal.fullName,
    personal.headline,
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
    personal.github,
  ].some(hasText);
}
