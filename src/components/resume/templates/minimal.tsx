import { BulletList, contactItems, dateRange, joinNonEmpty } from "@/components/resume/shared";
import { SECTION_LABELS, type ResumeContent, type SectionId } from "@/lib/resume/schema";
import { getVisibleSections } from "@/lib/resume/visibility";

function Section({
  id,
  children,
}: {
  id: SectionId;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-[10px] font-medium tracking-[0.22em] text-zinc-500 uppercase">
        {SECTION_LABELS[id]}
      </h2>
      {children}
    </section>
  );
}

export function MinimalTemplate({ content }: { content: ResumeContent }) {
  const sections = getVisibleSections(content);
  const contacts = contactItems(content);

  return (
    <article className="font-sans text-[11.5px] leading-relaxed text-zinc-800">
      <header className="border-b border-zinc-200 pb-5">
        <h1 className="text-[28px] leading-none font-light tracking-tight text-zinc-950">
          {content.personal.fullName || "Your Name"}
        </h1>
        {content.personal.headline ? (
          <p className="mt-2 text-[13px] text-zinc-600">
            {content.personal.headline}
          </p>
        ) : null}
        {contacts.length ? (
          <p className="mt-3 text-[10.5px] text-zinc-500">{contacts.join("  /  ")}</p>
        ) : null}
      </header>

      {sections.includes("summary") ? (
        <Section id="summary">
          <p className="max-w-prose">{content.summary}</p>
        </Section>
      ) : null}

      {sections.includes("experience") ? (
        <Section id="experience">
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
        <Section id="education">
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
        <Section id="skills">
          <p className="text-zinc-700">
            {content.skills.map((skill) => skill.name).filter(Boolean).join("  ·  ")}
          </p>
        </Section>
      ) : null}

      {sections.includes("projects") ? (
        <Section id="projects">
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
        <Section id="certifications">
          {content.certifications.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty([item.name, item.issuer, item.date], " · ")}
            </p>
          ))}
        </Section>
      ) : null}

      {sections.includes("languages") ? (
        <Section id="languages">
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
        <Section id="awards">
          {content.awards.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty([item.title, item.issuer, item.date], " · ")}
              {item.description ? ` — ${item.description}` : ""}
            </p>
          ))}
        </Section>
      ) : null}

      {sections.includes("references") ? (
        <Section id="references">
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
