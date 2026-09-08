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
    <section className="mt-4">
      <h2 className="border-b border-zinc-800 pb-0.5 text-[11px] font-semibold tracking-[0.16em] uppercase">
        {SECTION_LABELS[id]}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function ClassicTemplate({ content }: { content: ResumeContent }) {
  const sections = getVisibleSections(content);
  const contacts = contactItems(content);

  return (
    <article className="font-serif text-[11.5px] leading-relaxed text-zinc-900">
      <header className="text-center">
        <h1 className="text-[26px] leading-none font-semibold tracking-tight">
          {content.personal.fullName || "Your Name"}
        </h1>
        {content.personal.headline ? (
          <p className="mt-1 text-[12px] italic text-zinc-700">
            {content.personal.headline}
          </p>
        ) : null}
        {contacts.length ? (
          <p className="mt-2 text-[10.5px] text-zinc-700">
            {contacts.join("  ·  ")}
          </p>
        ) : null}
      </header>

      {sections.includes("summary") ? (
        <Section id="summary">
          <p>{content.summary}</p>
        </Section>
      ) : null}

      {sections.includes("experience") ? (
        <Section id="experience">
          <div className="space-y-3">
            {content.experience.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold">
                    {joinNonEmpty([item.title, item.company], ", ")}
                  </p>
                  <p className="shrink-0 text-[10.5px]">
                    {dateRange(item.startDate, item.endDate, item.current)}
                  </p>
                </div>
                {item.location ? (
                  <p className="text-[10.5px] italic text-zinc-600">
                    {item.location}
                  </p>
                ) : null}
                <BulletList items={item.bullets} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("education") ? (
        <Section id="education">
          <div className="space-y-2">
            {content.education.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold">{item.school}</p>
                  <p className="shrink-0 text-[10.5px]">
                    {dateRange(item.startDate, item.endDate)}
                  </p>
                </div>
                <p>
                  {joinNonEmpty([item.degree, item.field, item.location], ", ")}
                </p>
                {item.details ? <p>{item.details}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("skills") ? (
        <Section id="skills">
          <p>{content.skills.map((skill) => skill.name).filter(Boolean).join(" · ")}</p>
        </Section>
      ) : null}

      {sections.includes("projects") ? (
        <Section id="projects">
          <div className="space-y-2">
            {content.projects.map((item) => (
              <div key={item.id}>
                <p className="font-semibold">
                  {joinNonEmpty([item.name, item.url], " — ")}
                </p>
                {item.description ? <p>{item.description}</p> : null}
                <BulletList items={item.bullets} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("certifications") ? (
        <Section id="certifications">
          <div className="space-y-1.5">
            {content.certifications.map((item) => (
              <p key={item.id}>
                <span className="font-semibold">{item.name}</span>
                {item.issuer ? `, ${item.issuer}` : ""}
                {item.date ? ` (${item.date})` : ""}
              </p>
            ))}
          </div>
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
              .join(" · ")}
          </p>
        </Section>
      ) : null}

      {sections.includes("awards") ? (
        <Section id="awards">
          <div className="space-y-1.5">
            {content.awards.map((item) => (
              <p key={item.id}>
                <span className="font-semibold">{item.title}</span>
                {item.issuer ? ` — ${item.issuer}` : ""}
                {item.date ? ` (${item.date})` : ""}
                {item.description ? `. ${item.description}` : ""}
              </p>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("references") ? (
        <Section id="references">
          <div className="space-y-1.5">
            {content.references.map((item) => (
              <p key={item.id}>
                {joinNonEmpty(
                  [item.name, item.title, item.company, item.email, item.phone],
                  " · ",
                )}
              </p>
            ))}
          </div>
        </Section>
      ) : null}
    </article>
  );
}
