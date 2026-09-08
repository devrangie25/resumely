import { BulletList, contactItems, dateRange, joinNonEmpty } from "@/components/resume/shared";
import {
  SECTION_LABELS,
  type ResumeContent,
  type SectionId,
  type TemplateId,
} from "@/lib/resume/schema";
import { getVisibleSections } from "@/lib/resume/visibility";

const minimalThemes = {
  minimal: {
    article: "font-sans text-[11.5px] leading-relaxed text-zinc-800",
    name: "text-[28px] leading-none font-light tracking-tight text-zinc-950",
    heading: "mb-3 text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase",
    header: "border-b border-zinc-200 pb-5",
    split: false,
  },
  "minimal-serif": {
    article: "font-serif text-[11.5px] leading-relaxed text-stone-800",
    name: "text-[28px] leading-none font-normal tracking-tight text-stone-950",
    heading: "mb-3 text-[10px] font-medium tracking-[0.2em] text-stone-500 uppercase",
    header: "border-b border-stone-300 pb-5",
    split: false,
  },
  "minimal-split": {
    article: "font-sans text-[11.5px] leading-relaxed text-zinc-800",
    name: "text-[26px] leading-none font-light tracking-tight text-zinc-950",
    heading: "mb-3 text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase",
    header: "border-b border-zinc-200 pb-5",
    split: true,
  },
  "minimal-accent": {
    article:
      "border-l-4 border-zinc-900 pl-5 font-sans text-[11.5px] leading-relaxed text-zinc-800",
    name: "text-[26px] leading-none font-medium tracking-tight text-zinc-950",
    heading: "mb-3 text-[10px] font-semibold tracking-[0.18em] text-zinc-800 uppercase",
    header: "border-b border-zinc-300 pb-5",
    split: false,
  },
} as const;

function Section({
  id,
  headingClass,
  children,
}: {
  id: SectionId;
  headingClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className={headingClass}>{SECTION_LABELS[id]}</h2>
      {children}
    </section>
  );
}

export function MinimalTemplate({
  content,
  variant = "minimal",
}: {
  content: ResumeContent;
  variant?: TemplateId;
}) {
  const theme =
    minimalThemes[variant as keyof typeof minimalThemes] ?? minimalThemes.minimal;
  const sections = getVisibleSections(content);
  const contacts = contactItems(content);

  return (
    <article className={theme.article}>
      <header className={theme.header}>
        {theme.split ? (
          <div className="grid grid-cols-[1.3fr_0.7fr] items-end gap-6">
            <div>
              <h1 className={theme.name}>
                {content.personal.fullName || "Your Name"}
              </h1>
              {content.personal.headline ? (
                <p className="mt-2 text-[13px] text-zinc-600">
                  {content.personal.headline}
                </p>
              ) : null}
            </div>
            {contacts.length ? (
              <ul className="space-y-1 text-right text-[10.5px] leading-5 text-zinc-500">
                {contacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <>
            <h1 className={theme.name}>
              {content.personal.fullName || "Your Name"}
            </h1>
            {content.personal.headline ? (
              <p className="mt-2 text-[13px] text-zinc-600">
                {content.personal.headline}
              </p>
            ) : null}
            {contacts.length ? (
              <p className="mt-3 text-[10.5px] text-zinc-500">
                {contacts.join("  /  ")}
              </p>
            ) : null}
          </>
        )}
      </header>

      {sections.includes("summary") ? (
        <Section headingClass={theme.heading} id="summary">
          <p className="max-w-prose">{content.summary}</p>
        </Section>
      ) : null}

      {sections.includes("experience") ? (
        <Section headingClass={theme.heading} id="experience">
          <div className="space-y-5">
            {content.experience.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[13px] font-medium text-zinc-950">
                    {item.title}
                  </p>
                  <p className="shrink-0 text-[10.5px] text-zinc-500">
                    {dateRange(item.startDate, item.endDate, item.current)}
                  </p>
                </div>
                <p className="text-zinc-600">
                  {joinNonEmpty([item.company, item.location], " · ")}
                </p>
                <BulletList items={item.bullets} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("education") ? (
        <Section headingClass={theme.heading} id="education">
          <div className="space-y-3">
            {content.education.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium text-zinc-950">{item.school}</p>
                  <p className="shrink-0 text-[10.5px] text-zinc-500">
                    {dateRange(item.startDate, item.endDate)}
                  </p>
                </div>
                <p className="text-zinc-600">
                  {joinNonEmpty([item.degree, item.field, item.location], " · ")}
                </p>
                {item.details ? <p>{item.details}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("skills") ? (
        <Section headingClass={theme.heading} id="skills">
          <p className="text-zinc-700">
            {content.skills.map((skill) => skill.name).filter(Boolean).join("  ·  ")}
          </p>
        </Section>
      ) : null}

      {sections.includes("projects") ? (
        <Section headingClass={theme.heading} id="projects">
          <div className="space-y-3">
            {content.projects.map((item) => (
              <div key={item.id}>
                <p className="font-medium text-zinc-950">{item.name}</p>
                {item.url ? (
                  <p className="text-[10.5px] text-zinc-500">{item.url}</p>
                ) : null}
                {item.description ? <p>{item.description}</p> : null}
                <BulletList items={item.bullets} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("certifications") ? (
        <Section headingClass={theme.heading} id="certifications">
          {content.certifications.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty([item.name, item.issuer, item.date], " · ")}
            </p>
          ))}
        </Section>
      ) : null}

      {sections.includes("languages") ? (
        <Section headingClass={theme.heading} id="languages">
          <p>
            {content.languages
              .filter((item) => item.name.trim())
              .map((item) =>
                item.proficiency
                  ? `${item.name} (${item.proficiency})`
                  : item.name,
              )
              .join("  ·  ")}
          </p>
        </Section>
      ) : null}

      {sections.includes("awards") ? (
        <Section headingClass={theme.heading} id="awards">
          {content.awards.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty([item.title, item.issuer, item.date], " · ")}
              {item.description ? ` — ${item.description}` : ""}
            </p>
          ))}
        </Section>
      ) : null}

      {sections.includes("references") ? (
        <Section headingClass={theme.heading} id="references">
          {content.references.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty(
                [item.name, item.title, item.company, item.email, item.phone],
              )}
            </p>
          ))}
        </Section>
      ) : null}
    </article>
  );
}
