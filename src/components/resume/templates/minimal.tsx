import {
  BulletList,
  SkillPills,
  contactEntries,
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
  align = "left",
}: {
  id: SectionId;
  theme: ReturnType<typeof resolveTheme>;
  align?: "left" | "center";
}) {
  const boxed = theme.headingStyle === "boxed";
  const bar = theme.headingStyle === "bar";
  const underline = theme.headingStyle === "rule";

  return (
    <h2
      className={cn(
        "mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase",
        underline && "border-b pb-1",
        boxed && "w-fit border px-2 py-0.5",
        align === "center" && "text-center",
        bar && "flex items-center gap-2",
      )}
      style={{
        color: theme.heading,
        borderColor: underline || boxed ? theme.rule : undefined,
      }}
    >
      {bar ? (
        <span className="inline-block h-px w-6" style={{ backgroundColor: theme.rule }} />
      ) : null}
      {SECTION_LABELS[id]}
    </h2>
  );
}

function SectionBody({
  content,
  section,
  theme,
}: {
  content: ResumeContent;
  section: SectionId;
  theme: ReturnType<typeof resolveTheme>;
}) {
  const skills = content.skills.map((skill) => skill.name);

  switch (section) {
    case "summary":
      return <p className="max-w-prose">{content.summary}</p>;
    case "experience":
      return (
        <div className="space-y-5">
          {content.experience.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[13px] font-medium text-zinc-950">{item.title}</p>
                <p className="shrink-0 text-[10.5px] text-zinc-500">
                  {dateRange(item.startDate, item.endDate, item.current)}
                </p>
              </div>
              <p style={{ color: theme.company }}>
                {joinNonEmpty([item.company, item.location], " · ")}
              </p>
              <BulletList items={item.bullets} />
            </div>
          ))}
        </div>
      );
    case "education":
      return (
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
      );
    case "skills":
      return theme.skillStyle === "pills" ? (
        <SkillPills names={skills} color={theme.heading} />
      ) : (
        <p className="text-zinc-700">{skills.filter(Boolean).join("  ·  ")}</p>
      );
    case "projects":
      return (
        <div className="space-y-3">
          {content.projects.map((item) => (
            <div key={item.id}>
              <p className="font-medium text-zinc-950">{item.name}</p>
              {item.url ? (
                <p className="text-[10.5px]" style={{ color: theme.company }}>
                  {item.url}
                </p>
              ) : null}
              {item.description ? <p>{item.description}</p> : null}
              <BulletList items={item.bullets} />
            </div>
          ))}
        </div>
      );
    case "certifications":
      return content.certifications.map((item) => (
        <p key={item.id} className="mb-1">
          {joinNonEmpty([item.name, item.issuer, item.date], " · ")}
        </p>
      ));
    case "languages":
      return (
        <p>
          {content.languages
            .filter((item) => item.name.trim())
            .map((item) =>
              item.proficiency ? `${item.name} (${item.proficiency})` : item.name,
            )
            .join("  ·  ")}
        </p>
      );
    case "awards":
      return content.awards.map((item) => (
        <p key={item.id} className="mb-1">
          {joinNonEmpty([item.title, item.issuer, item.date], " · ")}
          {item.description ? ` — ${item.description}` : ""}
        </p>
      ));
    case "references":
      return content.references.map((item) => (
        <p key={item.id} className="mb-1">
          {joinNonEmpty([item.name, item.title, item.company, item.email, item.phone])}
        </p>
      ));
  }
}

function ContactIcons({
  content,
  color,
  align = "left",
}: {
  content: ResumeContent;
  color: string;
  align?: "left" | "right" | "center";
}) {
  const contacts = contactEntries(content);
  if (!contacts.length) return null;
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-zinc-600",
        align === "right" && "flex-col items-end space-y-1",
        align === "center" && "justify-center",
      )}
    >
      {contacts.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.kind}
            className={cn(
              "flex items-center gap-1.5",
              align === "right" && "flex-row-reverse",
            )}
          >
            <Icon className="size-3 shrink-0" style={{ color }} />
            <span>{item.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function MinimalTemplate({
  content,
  variant = "minimal",
}: {
  content: ResumeContent;
  variant?: TemplateId;
}) {
  const theme = resolveTheme(variant, content.theme?.primary);
  const sections = getVisibleSections(content);
  const contacts = contactEntries(content);
  const serif = theme.font === "serif";
  const layout = theme.minimalLayout;
  const sideSections = sections.filter((section) =>
    ["skills", "languages", "certifications"].includes(section),
  );
  const mainSections = sections.filter((section) => !sideSections.includes(section));

  const name = content.personal.fullName || "Your Name";

  if (layout === "two-column") {
    return (
      <article
        className={cn(
          "text-[11.5px] leading-relaxed text-zinc-800",
          serif ? "font-serif" : "font-sans",
        )}
      >
        <header className="mb-6 grid grid-cols-[1.4fr_0.6fr] items-end gap-6 border-b pb-5" style={{ borderColor: theme.rule }}>
          <div>
            <h1 className="text-[28px] leading-none font-light tracking-tight text-zinc-950">
              {name}
            </h1>
            {content.personal.headline ? (
              <p className="mt-2 text-[13px] text-zinc-600">{content.personal.headline}</p>
            ) : null}
          </div>
          <ContactIcons content={content} color={theme.heading} align="right" />
        </header>
        <div className="grid grid-cols-[1.4fr_0.6fr] gap-8">
          <div>
            {mainSections.map((section) => (
              <section key={section} className="mt-6 first:mt-0">
                <Heading id={section} theme={theme} />
                <SectionBody content={content} section={section} theme={theme} />
              </section>
            ))}
          </div>
          <aside>
            {sideSections.map((section) => (
              <section key={section} className="mt-6 first:mt-0">
                <Heading id={section} theme={theme} />
                <SectionBody content={content} section={section} theme={theme} />
              </section>
            ))}
          </aside>
        </div>
      </article>
    );
  }

  if (layout === "rail") {
    return (
      <article className="flex min-h-[297mm] font-sans text-[11.5px] leading-relaxed text-zinc-800">
        <div className="w-3 shrink-0" style={{ backgroundColor: theme.heading }} />
        <div className="flex-1 px-8 py-10">
          <header className="mb-8">
            <h1 className="text-[28px] leading-none font-medium tracking-tight text-zinc-950">
              {name}
            </h1>
            {content.personal.headline ? (
              <p className="mt-2 text-[13px] text-zinc-600">{content.personal.headline}</p>
            ) : null}
            <div className="mt-3">
              <ContactIcons content={content} color={theme.heading} />
            </div>
          </header>
          {sections.map((section) => (
            <section key={section} className="mt-7">
              <Heading id={section} theme={theme} />
              <SectionBody content={content} section={section} theme={theme} />
            </section>
          ))}
        </div>
      </article>
    );
  }

  if (layout === "band") {
    return (
      <article className="min-h-[297mm] font-sans text-[11.5px] leading-relaxed text-zinc-800">
        <header
          className="px-10 py-8"
          style={{ backgroundColor: theme.sidebar, color: theme.sidebarText }}
        >
          <h1 className="text-[26px] leading-none font-medium tracking-tight text-white">
            {name}
          </h1>
          {content.personal.headline ? (
            <p className="mt-2 text-[13px] text-white/85">{content.personal.headline}</p>
          ) : null}
          {contacts.length ? (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-white/90">
              {contacts.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.kind} className="flex items-center gap-1.5">
                    <Icon className="size-3 shrink-0" />
                    <span>{item.value}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </header>
        <div className="px-10 py-8">
          {sections.map((section) => (
            <section key={section} className="mt-7 first:mt-0">
              <Heading id={section} theme={theme} />
              <SectionBody content={content} section={section} theme={theme} />
            </section>
          ))}
        </div>
      </article>
    );
  }

  if (layout === "sand") {
    return (
      <article
        className="min-h-[297mm] font-sans text-[11.5px] leading-relaxed text-zinc-800"
        style={{ backgroundColor: theme.pageBg }}
      >
        <header className="px-10 py-9" style={{ backgroundColor: theme.sidebar }}>
          <p
            className="text-[10px] tracking-[0.28em] uppercase"
            style={{ color: theme.accent }}
          >
            Curriculum Vitae
          </p>
          <h1 className="mt-2 text-[28px] leading-none font-light tracking-tight text-zinc-900">
            {name}
          </h1>
          {content.personal.headline ? (
            <p className="mt-2 text-[13px] text-zinc-600">{content.personal.headline}</p>
          ) : null}
          <div className="mt-4">
            <ContactIcons content={content} color={theme.accent} />
          </div>
        </header>
        <div className="px-10 py-8">
          {sections.map((section) => (
            <section key={section} className="mt-7 first:mt-0">
              <Heading id={section} theme={theme} />
              <SectionBody content={content} section={section} theme={theme} />
            </section>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "text-[11.5px] leading-relaxed text-zinc-800",
        serif ? "font-serif" : "font-sans",
      )}
    >
      <header
        className={cn(
          "pb-5",
          layout === "centered" && "text-center",
        )}
        style={{ borderBottomWidth: 1, borderBottomColor: theme.rule }}
      >
        {layout === "split" ? (
          <div className="grid grid-cols-[1.3fr_0.7fr] items-end gap-6">
            <div>
              <h1
                className="text-[26px] leading-none font-medium tracking-tight"
                style={{ color: theme.heading }}
              >
                {name}
              </h1>
              {content.personal.headline ? (
                <p className="mt-2 text-[13px] text-zinc-600">
                  {content.personal.headline}
                </p>
              ) : null}
            </div>
            <ContactIcons content={content} color={theme.heading} align="right" />
          </div>
        ) : (
          <>
            <h1
              className={cn(
                "leading-none tracking-tight",
                layout === "editorial"
                  ? "text-[32px] font-normal"
                  : layout === "centered"
                    ? "text-[26px] font-medium"
                    : "text-[28px] font-light",
              )}
              style={{
                color:
                  layout === "editorial" || layout === "centered"
                    ? theme.heading
                    : "#09090b",
              }}
            >
              {name}
            </h1>
            {layout === "centered" ? (
              <div
                className="mx-auto mt-3 h-px w-16"
                style={{ backgroundColor: theme.rule }}
              />
            ) : null}
            {content.personal.headline ? (
              <p
                className={cn(
                  "mt-2 text-[13px] text-zinc-600",
                  layout === "editorial" && "italic",
                )}
              >
                {content.personal.headline}
              </p>
            ) : null}
            {contacts.length ? (
              layout === "stack" ? (
                <p className="mt-3 text-[10.5px] text-zinc-500">
                  {contacts.map((item) => item.value).join("  /  ")}
                </p>
              ) : (
                <div className="mt-3">
                  <ContactIcons
                    content={content}
                    color={theme.heading}
                    align={layout === "centered" ? "center" : "left"}
                  />
                </div>
              )
            ) : null}
          </>
        )}
      </header>

      {sections.map((section) => (
        <section key={section} className="mt-7">
          <Heading
            id={section}
            theme={theme}
            align={layout === "centered" ? "center" : "left"}
          />
          <SectionBody content={content} section={section} theme={theme} />
        </section>
      ))}
    </article>
  );
}
