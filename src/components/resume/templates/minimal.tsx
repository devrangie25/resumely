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

function Section({
  id,
  color,
  underline,
  children,
}: {
  id: SectionId;
  color: string;
  underline?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2
        className={cn(
          "mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase",
          underline && "border-b pb-1",
        )}
        style={{ color, borderColor: underline ? color : undefined }}
      >
        {SECTION_LABELS[id]}
      </h2>
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
  const theme = resolveTheme(variant, content.theme?.primary);
  const sections = getVisibleSections(content);
  const contacts = contactEntries(content);
  const skills = content.skills.map((skill) => skill.name);
  const colorful = ["minimal-mint", "minimal-coral", "minimal-navy"].includes(
    variant,
  );
  const serif = theme.font === "serif";

  return (
    <article
      className={cn(
        "text-[11.5px] leading-relaxed text-zinc-800",
        serif ? "font-serif" : "font-sans",
        theme.modernLayout === "rail" && "border-l-4 pl-5",
      )}
      style={
        theme.modernLayout === "rail" ? { borderColor: theme.heading } : undefined
      }
    >
      <header
        className="pb-5"
        style={{ borderBottomWidth: 1, borderBottomColor: theme.rule }}
      >
        {theme.splitHeader ? (
          <div className="grid grid-cols-[1.3fr_0.7fr] items-end gap-6">
            <div>
              <h1
                className="text-[26px] leading-none font-light tracking-tight"
                style={{ color: colorful ? theme.heading : "#09090b" }}
              >
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
                {contacts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.kind}
                      className="flex items-center justify-end gap-1.5"
                    >
                      <span>{item.value}</span>
                      <Icon
                        className="size-3 shrink-0"
                        style={{ color: theme.heading }}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : (
          <>
            <h1
              className={cn(
                "leading-none tracking-tight",
                colorful
                  ? "text-[26px] font-medium"
                  : "text-[28px] font-light",
              )}
              style={{ color: colorful ? theme.heading : "#09090b" }}
            >
              {content.personal.fullName || "Your Name"}
            </h1>
            {content.personal.headline ? (
              <p className="mt-2 text-[13px] text-zinc-600">
                {content.personal.headline}
              </p>
            ) : null}
            {contacts.length ? (
              colorful ? (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-zinc-600">
                  {contacts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.kind} className="flex items-center gap-1.5">
                        <Icon
                          className="size-3 shrink-0"
                          style={{ color: theme.heading }}
                        />
                        <span>{item.value}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-[10.5px] text-zinc-500">
                  {contacts.map((item) => item.value).join("  /  ")}
                </p>
              )
            ) : null}
          </>
        )}
      </header>

      {sections.includes("summary") ? (
        <Section id="summary" color={theme.heading} underline={colorful}>
          <p className="max-w-prose">{content.summary}</p>
        </Section>
      ) : null}

      {sections.includes("experience") ? (
        <Section id="experience" color={theme.heading} underline={colorful}>
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
                <p style={{ color: theme.company }}>
                  {joinNonEmpty([item.company, item.location], " · ")}
                </p>
                <BulletList items={item.bullets} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {sections.includes("education") ? (
        <Section id="education" color={theme.heading} underline={colorful}>
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
        <Section id="skills" color={theme.heading} underline={colorful}>
          {theme.skillStyle === "pills" ? (
            <SkillPills names={skills} color={theme.heading} />
          ) : (
            <p className="text-zinc-700">
              {skills.filter(Boolean).join("  ·  ")}
            </p>
          )}
        </Section>
      ) : null}

      {sections.includes("projects") ? (
        <Section id="projects" color={theme.heading} underline={colorful}>
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
        </Section>
      ) : null}

      {sections.includes("certifications") ? (
        <Section id="certifications" color={theme.heading} underline={colorful}>
          {content.certifications.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty([item.name, item.issuer, item.date], " · ")}
            </p>
          ))}
        </Section>
      ) : null}

      {sections.includes("languages") ? (
        <Section id="languages" color={theme.heading} underline={colorful}>
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
        <Section id="awards" color={theme.heading} underline={colorful}>
          {content.awards.map((item) => (
            <p key={item.id} className="mb-1">
              {joinNonEmpty([item.title, item.issuer, item.date], " · ")}
              {item.description ? ` — ${item.description}` : ""}
            </p>
          ))}
        </Section>
      ) : null}

      {sections.includes("references") ? (
        <Section id="references" color={theme.heading} underline={colorful}>
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
