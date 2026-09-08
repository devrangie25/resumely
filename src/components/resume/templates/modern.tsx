import { BulletList, contactItems, dateRange, joinNonEmpty } from "@/components/resume/shared";
import { SECTION_LABELS, type ResumeContent, type SectionId } from "@/lib/resume/schema";
import { getVisibleSections } from "@/lib/resume/visibility";

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-teal-200 uppercase">
      {children}
    </h2>
  );
}

function MainSection({
  id,
  children,
}: {
  id: SectionId;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4 first:mt-0">
      <h2 className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
        {SECTION_LABELS[id]}
      </h2>
      {children}
    </section>
  );
}

export function ModernTemplate({ content }: { content: ResumeContent }) {
  const sections = getVisibleSections(content);
  const contacts = contactItems(content);
  const sidebarSections = sections.filter((section) =>
    ["skills", "languages", "certifications"].includes(section),
  );
  const mainSections = sections.filter(
    (section) => !sidebarSections.includes(section),
  );

  return (
    <article className="grid min-h-[297mm] grid-cols-[72mm_1fr] font-sans text-[11px] leading-relaxed text-zinc-800">
      <aside className="bg-zinc-900 px-5 py-8 text-zinc-100">
        <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-white">
          {content.personal.fullName || "Your Name"}
        </h1>
        {content.personal.headline ? (
          <p className="mt-2 text-[11px] text-teal-200">
            {content.personal.headline}
          </p>
        ) : null}

        {contacts.length ? (
          <div className="mt-8">
            <SidebarHeading>Contact</SidebarHeading>
            <ul className="space-y-1.5 break-words text-[10.5px] text-zinc-200">
              {contacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {sidebarSections.includes("skills") ? (
          <div className="mt-7">
            <SidebarHeading>Skills</SidebarHeading>
            <ul className="space-y-1 text-[10.5px]">
              {content.skills
                .filter((skill) => skill.name.trim())
                .map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
            </ul>
          </div>
        ) : null}

        {sidebarSections.includes("languages") ? (
          <div className="mt-7">
            <SidebarHeading>Languages</SidebarHeading>
            <ul className="space-y-1 text-[10.5px]">
              {content.languages
                .filter((item) => item.name.trim())
                .map((item) => (
                  <li key={item.id}>
                    {item.name}
                    {item.proficiency ? ` · ${item.proficiency}` : ""}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {sidebarSections.includes("certifications") ? (
          <div className="mt-7">
            <SidebarHeading>Certifications</SidebarHeading>
            <ul className="space-y-2 text-[10.5px]">
              {content.certifications.map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-zinc-300">
                    {joinNonEmpty([item.issuer, item.date])}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="bg-white px-7 py-8">
        {mainSections.includes("summary") ? (
          <MainSection id="summary">
            <p>{content.summary}</p>
          </MainSection>
        ) : null}

        {mainSections.includes("experience") ? (
          <MainSection id="experience">
            <div className="space-y-3.5">
              {content.experience.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-zinc-900">{item.title}</p>
                    <p className="shrink-0 text-[10px] text-zinc-500">
                      {dateRange(item.startDate, item.endDate, item.current)}
                    </p>
                  </div>
                  <p className="text-teal-800">
                    {joinNonEmpty([item.company, item.location])}
                  </p>
                  <BulletList items={item.bullets} />
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {mainSections.includes("education") ? (
          <MainSection id="education">
            <div className="space-y-2.5">
              {content.education.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-zinc-900">{item.school}</p>
                    <p className="shrink-0 text-[10px] text-zinc-500">
                      {dateRange(item.startDate, item.endDate)}
                    </p>
                  </div>
                  <p>{joinNonEmpty([item.degree, item.field, item.location])}</p>
                  {item.details ? <p>{item.details}</p> : null}
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {mainSections.includes("projects") ? (
          <MainSection id="projects">
            <div className="space-y-2.5">
              {content.projects.map((item) => (
                <div key={item.id}>
                  <p className="font-semibold text-zinc-900">{item.name}</p>
                  {item.url ? (
                    <p className="text-[10.5px] text-teal-800">{item.url}</p>
                  ) : null}
                  {item.description ? <p>{item.description}</p> : null}
                  <BulletList items={item.bullets} />
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {mainSections.includes("awards") ? (
          <MainSection id="awards">
            {content.awards.map((item) => (
              <p key={item.id} className="mb-1.5">
                <span className="font-semibold">{item.title}</span>
                {item.issuer ? ` — ${item.issuer}` : ""}
                {item.date ? ` (${item.date})` : ""}
                {item.description ? `. ${item.description}` : ""}
              </p>
            ))}
          </MainSection>
        ) : null}

        {mainSections.includes("references") ? (
          <MainSection id="references">
            {content.references.map((item) => (
              <p key={item.id} className="mb-1.5">
                {joinNonEmpty(
                  [item.name, item.title, item.company, item.email, item.phone],
                )}
              </p>
            ))}
          </MainSection>
        ) : null}
      </div>
    </article>
  );
}
