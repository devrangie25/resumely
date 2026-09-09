import {
  BulletList,
  contactEntries,
  contactItems,
  dateRange,
  joinNonEmpty,
} from "@/components/resume/shared";
import {
  SECTION_LABELS,
  type ResumeContent,
  type SectionId,
  type TemplateId,
} from "@/lib/resume/schema";
import { resolveTheme } from "@/lib/resume/theme";
import { getVisibleSections } from "@/lib/resume/visibility";
import { cn } from "@/lib/utils";

function Heading({
  id,
  theme,
  className,
}: {
  id: SectionId;
  theme: ReturnType<typeof resolveTheme>;
  className?: string;
}) {
  if (theme.headingStyle === "smallcaps") {
    return (
      <h2
        className={cn("text-[11px] font-semibold tracking-[0.22em] uppercase", className)}
        style={{ color: theme.heading }}
      >
        {SECTION_LABELS[id]}
      </h2>
    );
  }

  if (theme.headingStyle === "bar") {
    return (
      <h2
        className={cn(
          "flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase",
          className,
        )}
        style={{ color: theme.heading }}
      >
        <span className="inline-block h-3 w-1.5" style={{ backgroundColor: theme.heading }} />
        {SECTION_LABELS[id]}
      </h2>
    );
  }

  return (
    <h2
      className={cn(
        "border-b pb-0.5 text-[11px] font-semibold tracking-[0.16em] uppercase",
        className,
      )}
      style={{ color: theme.heading, borderColor: theme.rule }}
    >
      {SECTION_LABELS[id]}
    </h2>
  );
}

function ExperienceList({
  content,
  compact,
}: {
  content: ResumeContent;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
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
            <p className="text-[10.5px] italic text-zinc-600">{item.location}</p>
          ) : null}
          <BulletList items={item.bullets} />
        </div>
      ))}
    </div>
  );
}

function TimelineExperience({ content }: { content: ResumeContent }) {
  return (
    <div className="space-y-3">
      {content.experience.map((item) => (
        <div key={item.id} className="grid grid-cols-[28mm_1fr] gap-4">
          <p className="pt-0.5 text-[10px] leading-snug font-semibold tracking-wide uppercase">
            {dateRange(item.startDate, item.endDate, item.current)}
          </p>
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-[10.5px] italic text-zinc-600">
              {joinNonEmpty([item.company, item.location], ", ")}
            </p>
            <BulletList items={item.bullets} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationList({ content }: { content: ResumeContent }) {
  return (
    <div className="space-y-2">
      {content.education.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold">{item.school}</p>
            <p className="shrink-0 text-[10.5px]">
              {dateRange(item.startDate, item.endDate)}
            </p>
          </div>
          <p>{joinNonEmpty([item.degree, item.field, item.location], ", ")}</p>
          {item.details ? <p>{item.details}</p> : null}
        </div>
      ))}
    </div>
  );
}

function TimelineEducation({ content }: { content: ResumeContent }) {
  return (
    <div className="space-y-2">
      {content.education.map((item) => (
        <div key={item.id} className="grid grid-cols-[28mm_1fr] gap-4">
          <p className="text-[10px] font-semibold tracking-wide uppercase">
            {dateRange(item.startDate, item.endDate)}
          </p>
          <div>
            <p className="font-semibold">{item.school}</p>
            <p>{joinNonEmpty([item.degree, item.field, item.location], ", ")}</p>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionBody({
  content,
  section,
  timeline,
  compact,
}: {
  content: ResumeContent;
  section: SectionId;
  timeline?: boolean;
  compact?: boolean;
}) {
  switch (section) {
    case "summary":
      return <p>{content.summary}</p>;
    case "experience":
      return timeline ? (
        <TimelineExperience content={content} />
      ) : (
        <ExperienceList content={content} compact={compact} />
      );
    case "education":
      return timeline ? (
        <TimelineEducation content={content} />
      ) : (
        <EducationList content={content} />
      );
    case "skills":
      return (
        <p>{content.skills.map((skill) => skill.name).filter(Boolean).join(" · ")}</p>
      );
    case "projects":
      return (
        <div className="space-y-2">
          {content.projects.map((item) => (
            <div key={item.id}>
              <p className="font-semibold">{joinNonEmpty([item.name, item.url], " — ")}</p>
              {item.description ? <p>{item.description}</p> : null}
              <BulletList items={item.bullets} />
            </div>
          ))}
        </div>
      );
    case "certifications":
      return (
        <div className="space-y-1.5">
          {content.certifications.map((item) => (
            <p key={item.id}>
              <span className="font-semibold">{item.name}</span>
              {item.issuer ? `, ${item.issuer}` : ""}
              {item.date ? ` (${item.date})` : ""}
            </p>
          ))}
        </div>
      );
    case "languages":
      return (
        <p>
          {content.languages
            .filter((item) => item.name.trim())
            .map((item) =>
              item.proficiency ? `${item.name} (${item.proficiency})` : item.name,
            )
            .join(" · ")}
        </p>
      );
    case "awards":
      return (
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
      );
    case "references":
      return (
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
      );
  }
}

export function ClassicTemplate({
  content,
  variant = "classic",
}: {
  content: ResumeContent;
  variant?: TemplateId;
}) {
  const theme = resolveTheme(variant, content.theme?.primary);
  const sections = getVisibleSections(content);
  const contacts = contactItems(content);
  const compact = theme.classicLayout === "timeline";
  const spacious = theme.classicLayout === "academic";
  const gap = spacious ? "mt-6" : compact ? "mt-3.5" : "mt-4";

  const body = sections.map((section) => (
    <section key={section} className={gap}>
      <Heading id={section} theme={theme} />
      <div className="mt-2">
        <SectionBody
          content={content}
          section={section}
          timeline={theme.classicLayout === "timeline"}
          compact={compact}
        />
      </div>
    </section>
  ));

  if (theme.classicLayout === "stripe") {
    return (
      <article className="grid min-h-[297mm] grid-cols-[42mm_1fr] font-serif text-[11.5px] leading-relaxed text-zinc-900">
        <aside
          className="px-4 py-10 text-[10.5px] leading-5"
          style={{ backgroundColor: theme.sidebar, color: theme.sidebarText }}
        >
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase">
            Contact
          </p>
          <ul className="mt-3 space-y-2">
            {contactEntries(content).map((item) => (
              <li key={item.kind}>{item.value}</li>
            ))}
          </ul>
        </aside>
        <div className="px-8 py-10">
          <header>
            <h1
              className="text-[26px] leading-none font-semibold tracking-tight"
              style={{ color: theme.heading }}
            >
              {content.personal.fullName || "Your Name"}
            </h1>
            {content.personal.headline ? (
              <p className="mt-2 text-[12px] italic text-zinc-700">
                {content.personal.headline}
              </p>
            ) : null}
          </header>
          {body}
        </div>
      </article>
    );
  }

  if (theme.classicLayout === "banner") {
    return (
      <article
        className="min-h-[297mm] font-serif text-[11.5px] leading-relaxed text-zinc-900"
        style={{ backgroundColor: theme.pageBg }}
      >
        <header
          className="px-10 py-8 text-center"
          style={{ backgroundColor: theme.sidebar, color: theme.sidebarText }}
        >
          <h1 className="text-[26px] leading-none font-semibold tracking-tight text-white">
            {content.personal.fullName || "Your Name"}
          </h1>
          {content.personal.headline ? (
            <p className="mt-2 text-[12px] italic opacity-90">
              {content.personal.headline}
            </p>
          ) : null}
          {contacts.length ? (
            <p className="mt-3 text-[10.5px] opacity-90">{contacts.join("  ·  ")}</p>
          ) : null}
        </header>
        <div className="px-10 py-8">{body}</div>
      </article>
    );
  }

  const name = content.personal.fullName || "Your Name";

  return (
    <article
      className={cn(
        "font-serif text-zinc-900",
        compact ? "text-[11px] leading-snug" : "text-[11.5px] leading-relaxed",
        spacious && "leading-7",
      )}
    >
      <header
        className={theme.classicAlign === "center" ? "text-center" : "text-left"}
      >
        {theme.classicLayout === "gold" ? (
          <>
            <div className="mx-auto mb-3 h-px w-24" style={{ backgroundColor: theme.rule }} />
            <h1
              className="text-[26px] leading-none font-semibold tracking-[0.08em] uppercase"
              style={{ color: theme.heading }}
            >
              {name}
            </h1>
            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-10" style={{ backgroundColor: theme.rule }} />
              <span
                className="inline-block size-1.5 rotate-45"
                style={{ backgroundColor: theme.rule }}
              />
              <span className="h-px w-10" style={{ backgroundColor: theme.rule }} />
            </div>
          </>
        ) : theme.classicLayout === "centered" ? (
          <>
            <div className="mb-2 border-t-2" style={{ borderColor: theme.rule }} />
            <h1
              className="text-[26px] leading-none font-semibold tracking-tight"
              style={{ color: theme.heading }}
            >
              {name}
            </h1>
            <div className="mt-2 border-b-2" style={{ borderColor: theme.rule }} />
          </>
        ) : (
          <h1
            className="text-[26px] leading-none font-semibold tracking-tight"
            style={{ color: theme.heading }}
          >
            {name}
          </h1>
        )}
        {content.personal.headline ? (
          <p className="mt-2 text-[12px] italic text-zinc-700">
            {content.personal.headline}
          </p>
        ) : null}
        {contacts.length ? (
          <p className="mt-2 text-[10.5px] text-zinc-700">{contacts.join("  ·  ")}</p>
        ) : null}
      </header>
      {body}
    </article>
  );
}
