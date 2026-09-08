import { BulletList, contactItems, dateRange, joinNonEmpty } from "@/components/resume/shared";
import {
  SECTION_LABELS,
  type ResumeContent,
  type SectionId,
  type TemplateId,
} from "@/lib/resume/schema";
import { getVisibleSections } from "@/lib/resume/visibility";
import { cn } from "@/lib/utils";

const modernThemes = {
  modern: {
    sidebar: "bg-zinc-900 text-zinc-100",
    accent: "text-teal-200",
    heading: "text-teal-800",
    company: "text-teal-800",
    photo: "size-24 rounded-full",
  },
  "modern-navy": {
    sidebar: "bg-[#0f2744] text-slate-100",
    accent: "text-sky-200",
    heading: "text-sky-900",
    company: "text-sky-800",
    photo: "size-24 rounded-full ring-2 ring-sky-200/70",
  },
  "modern-emerald": {
    sidebar: "bg-emerald-950 text-emerald-50",
    accent: "text-emerald-200",
    heading: "text-emerald-800",
    company: "text-emerald-800",
    photo: "size-24 rounded-md",
  },
  "modern-sunset": {
    sidebar: "bg-orange-950 text-orange-50",
    accent: "text-orange-200",
    heading: "text-orange-800",
    company: "text-orange-800",
    photo: "size-24 rounded-2xl",
  },
} as const;

function SidebarHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <h2
      className={cn(
        "mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function MainSection({
  id,
  headingClass,
  children,
}: {
  id: SectionId;
  headingClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4 first:mt-0">
      <h2
        className={cn(
          "mb-2 text-[11px] font-semibold tracking-[0.16em] uppercase",
          headingClass,
        )}
      >
        {SECTION_LABELS[id]}
      </h2>
      {children}
    </section>
  );
}

export function ModernTemplate({
  content,
  variant = "modern",
}: {
  content: ResumeContent;
  variant?: TemplateId;
}) {
  const theme =
    modernThemes[variant as keyof typeof modernThemes] ?? modernThemes.modern;
  const sections = getVisibleSections(content);
  const contacts = contactItems(content);
  const sidebarSections = sections.filter((section) =>
    ["skills", "languages", "certifications"].includes(section),
  );
  const mainSections = sections.filter(
    (section) => !sidebarSections.includes(section),
  );
  const photoUrl = content.personal.photoUrl?.trim();

  return (
    <article className="grid min-h-[297mm] grid-cols-[72mm_1fr] font-sans text-[11px] leading-relaxed text-zinc-800">
      <aside className={cn("px-5 py-8", theme.sidebar)}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={content.personal.fullName || "Profile photo"}
            className={cn("mb-5 object-cover", theme.photo)}
          />
        ) : null}
        <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-white">
          {content.personal.fullName || "Your Name"}
        </h1>
        {content.personal.headline ? (
          <p className={cn("mt-2 text-[11px]", theme.accent)}>
            {content.personal.headline}
          </p>
        ) : null}

        {contacts.length ? (
          <div className="mt-8">
            <SidebarHeading className={theme.accent}>Contact</SidebarHeading>
            <ul className="space-y-1.5 break-words text-[10.5px] text-zinc-200">
              {contacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {sidebarSections.includes("skills") ? (
          <div className="mt-7">
            <SidebarHeading className={theme.accent}>Skills</SidebarHeading>
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
            <SidebarHeading className={theme.accent}>Languages</SidebarHeading>
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
            <SidebarHeading className={theme.accent}>Certifications</SidebarHeading>
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
          <MainSection id="summary" headingClass={theme.heading}>
            <p>{content.summary}</p>
          </MainSection>
        ) : null}

        {mainSections.includes("experience") ? (
          <MainSection id="experience" headingClass={theme.heading}>
            <div className="space-y-3.5">
              {content.experience.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-zinc-900">{item.title}</p>
                    <p className="shrink-0 text-[10px] text-zinc-500">
                      {dateRange(item.startDate, item.endDate, item.current)}
                    </p>
                  </div>
                  <p className={theme.company}>
                    {joinNonEmpty([item.company, item.location])}
                  </p>
                  <BulletList items={item.bullets} />
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {mainSections.includes("education") ? (
          <MainSection id="education" headingClass={theme.heading}>
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
          <MainSection id="projects" headingClass={theme.heading}>
            <div className="space-y-2.5">
              {content.projects.map((item) => (
                <div key={item.id}>
                  <p className="font-semibold text-zinc-900">{item.name}</p>
                  {item.url ? (
                    <p className={cn("text-[10.5px]", theme.company)}>{item.url}</p>
                  ) : null}
                  {item.description ? <p>{item.description}</p> : null}
                  <BulletList items={item.bullets} />
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {mainSections.includes("awards") ? (
          <MainSection id="awards" headingClass={theme.heading}>
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
          <MainSection id="references" headingClass={theme.heading}>
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
