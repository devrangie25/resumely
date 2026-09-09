import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  LanguagesIcon,
  SparklesIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import {
  BulletList,
  MeterList,
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
import {
  languageBarWidth,
  photoRadiusClass,
  resolveTheme,
  skillBarWidth,
} from "@/lib/resume/theme";
import { getVisibleSections } from "@/lib/resume/visibility";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  summary: SparklesIcon,
  experience: BriefcaseIcon,
  education: GraduationCapIcon,
  skills: BookOpenIcon,
  projects: FolderGit2Icon,
  certifications: AwardIcon,
  languages: LanguagesIcon,
  awards: AwardIcon,
  references: UsersIcon,
};

function Heading({
  id,
  color,
  style = "plain",
  icons = true,
  className,
}: {
  id: SectionId;
  color: string;
  style?: "plain" | "bar" | "boxed";
  icons?: boolean;
  className?: string;
}) {
  const Icon = SECTION_ICONS[id];
  return (
    <h2
      className={cn(
        "mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase",
        style === "boxed" && "w-fit border px-2 py-0.5",
        className,
      )}
      style={{ color, borderColor: style === "boxed" ? color : undefined }}
    >
      {style === "bar" ? (
        <span className="inline-block h-3 w-1" style={{ backgroundColor: color }} />
      ) : icons ? (
        <Icon className="size-3.5 shrink-0" />
      ) : null}
      {SECTION_LABELS[id]}
    </h2>
  );
}

function ContactList({
  content,
  className,
  iconColor,
  compact = false,
}: {
  content: ResumeContent;
  className?: string;
  iconColor?: string;
  compact?: boolean;
}) {
  const contacts = contactEntries(content);
  if (!contacts.length) return null;

  return (
    <ul className={className}>
      {contacts.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.kind}
            className={cn(
              "flex items-start gap-1.5 break-words",
              compact ? "text-[10px]" : "text-[10.5px]",
            )}
          >
            <Icon
              className="mt-0.5 size-3 shrink-0"
              style={iconColor ? { color: iconColor } : undefined}
            />
            <span>{item.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ExperienceBlock({
  content,
  companyColor,
}: {
  content: ResumeContent;
  companyColor: string;
}) {
  return (
    <div className="space-y-3.5">
      {content.experience.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold text-zinc-900">{item.title}</p>
            <p className="shrink-0 text-[10px] text-zinc-500">
              {dateRange(item.startDate, item.endDate, item.current)}
            </p>
          </div>
          <p style={{ color: companyColor }}>
            {joinNonEmpty([item.company, item.location])}
          </p>
          <BulletList items={item.bullets} />
        </div>
      ))}
    </div>
  );
}

function EducationBlock({ content }: { content: ResumeContent }) {
  return (
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
  );
}

function ProjectBlock({
  content,
  companyColor,
}: {
  content: ResumeContent;
  companyColor: string;
}) {
  return (
    <div className="space-y-2.5">
      {content.projects.map((item) => (
        <div key={item.id}>
          <p className="font-semibold text-zinc-900">{item.name}</p>
          {item.url ? (
            <p className="text-[10.5px]" style={{ color: companyColor }}>
              {item.url}
            </p>
          ) : null}
          {item.description ? <p>{item.description}</p> : null}
          <BulletList items={item.bullets} />
        </div>
      ))}
    </div>
  );
}

function AwardsBlock({ content }: { content: ResumeContent }) {
  return (
    <>
      {content.awards.map((item) => (
        <p key={item.id} className="mb-1.5">
          <span className="font-semibold">{item.title}</span>
          {item.issuer ? ` — ${item.issuer}` : ""}
          {item.date ? ` (${item.date})` : ""}
          {item.description ? `. ${item.description}` : ""}
        </p>
      ))}
    </>
  );
}

function ReferencesBlock({ content }: { content: ResumeContent }) {
  return (
    <>
      {content.references.map((item) => (
        <p key={item.id} className="mb-1.5">
          {joinNonEmpty([item.name, item.title, item.company, item.email, item.phone])}
        </p>
      ))}
    </>
  );
}

function MainBody({
  content,
  sections,
  heading,
  company,
  headingStyle = "plain",
}: {
  content: ResumeContent;
  sections: SectionId[];
  heading: string;
  company: string;
  headingStyle?: "plain" | "bar" | "boxed";
}) {
  return (
    <>
      {sections.includes("summary") ? (
        <section className="mt-4 first:mt-0">
          <Heading id="summary" color={heading} style={headingStyle} />
          <p>{content.summary}</p>
        </section>
      ) : null}
      {sections.includes("experience") ? (
        <section className="mt-4 first:mt-0">
          <Heading id="experience" color={heading} style={headingStyle} />
          <ExperienceBlock content={content} companyColor={company} />
        </section>
      ) : null}
      {sections.includes("education") ? (
        <section className="mt-4 first:mt-0">
          <Heading id="education" color={heading} style={headingStyle} />
          <EducationBlock content={content} />
        </section>
      ) : null}
      {sections.includes("projects") ? (
        <section className="mt-4 first:mt-0">
          <Heading id="projects" color={heading} style={headingStyle} />
          <ProjectBlock content={content} companyColor={company} />
        </section>
      ) : null}
      {sections.includes("awards") ? (
        <section className="mt-4 first:mt-0">
          <Heading id="awards" color={heading} style={headingStyle} />
          <AwardsBlock content={content} />
        </section>
      ) : null}
      {sections.includes("references") ? (
        <section className="mt-4 first:mt-0">
          <Heading id="references" color={heading} style={headingStyle} />
          <ReferencesBlock content={content} />
        </section>
      ) : null}
    </>
  );
}

function Photo({
  url,
  name,
  shape,
  className,
}: {
  url: string;
  name: string;
  shape: ReturnType<typeof resolveTheme>["photo"];
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name || "Profile photo"}
      className={cn("object-cover", photoRadiusClass(shape), className)}
    />
  );
}

function SkillBlock({
  content,
  theme,
  color,
}: {
  content: ResumeContent;
  theme: ReturnType<typeof resolveTheme>;
  color: string;
}) {
  const skills = content.skills.map((skill) => skill.name);
  if (theme.skillStyle === "bars") {
    return (
      <MeterList
        items={content.skills
          .filter((skill) => skill.name.trim())
          .map((skill) => ({
            id: skill.id,
            label: skill.name,
            width: skillBarWidth(skill.name),
          }))}
        color={color}
      />
    );
  }
  if (theme.skillStyle === "pills") {
    return <SkillPills names={skills} color={color} />;
  }
  return (
    <ul className="space-y-1 text-[10.5px]">
      {skills.filter(Boolean).map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

function LanguageBlock({
  content,
  bars,
  color,
}: {
  content: ResumeContent;
  bars?: boolean;
  color?: string;
}) {
  const items = content.languages.filter((item) => item.name.trim());
  if (bars && color) {
    return (
      <MeterList
        items={items.map((item) => ({
          id: item.id,
          label: item.proficiency ? `${item.name} · ${item.proficiency}` : item.name,
          width: languageBarWidth(item.proficiency),
        }))}
        color={color}
      />
    );
  }
  return (
    <ul className="space-y-1 text-[10.5px]">
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          {item.proficiency ? ` · ${item.proficiency}` : ""}
        </li>
      ))}
    </ul>
  );
}

function ProfileAside({
  content,
  sections,
  theme,
  photoUrl,
  showName,
}: {
  content: ResumeContent;
  sections: SectionId[];
  theme: ReturnType<typeof resolveTheme>;
  photoUrl?: string;
  showName: boolean;
}) {
  const light = theme.modernLayout === "light-sidebar";
  return (
    <aside
      className="px-5 py-8"
      style={{ backgroundColor: theme.sidebar, color: theme.sidebarText }}
    >
      {photoUrl ? (
        <Photo
          url={photoUrl}
          name={content.personal.fullName}
          shape={theme.photo}
          className={cn("mb-5 size-24", !light && "ring-2 ring-white/20")}
        />
      ) : null}
      {showName ? (
        <>
          <h1
            className={cn(
              "text-[22px] leading-tight font-semibold tracking-tight",
              light ? "text-zinc-950" : "text-white",
            )}
          >
            {content.personal.fullName || "Your Name"}
          </h1>
          {content.personal.headline ? (
            <p className="mt-2 text-[11px]" style={{ color: theme.accent }}>
              {content.personal.headline}
            </p>
          ) : null}
        </>
      ) : null}
      <div className={showName ? "mt-8" : "mt-2"}>
        <h2
          className="mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: theme.accent }}
        >
          Contact
        </h2>
        <ContactList
          content={content}
          className="space-y-1.5"
          iconColor={theme.accent}
        />
      </div>
      <SidebarMeta
        content={content}
        sections={sections}
        theme={theme}
        headingColor={theme.accent}
        dark={!light}
      />
    </aside>
  );
}

function SidebarMeta({
  content,
  sections,
  theme,
  headingColor,
  dark,
}: {
  content: ResumeContent;
  sections: SectionId[];
  theme: ReturnType<typeof resolveTheme>;
  headingColor: string;
  dark?: boolean;
}) {
  return (
    <>
      {sections.includes("skills") ? (
        <div className="mt-7">
          <h2
            className="mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: headingColor }}
          >
            Skills
          </h2>
          <SkillBlock content={content} theme={theme} color={headingColor} />
        </div>
      ) : null}
      {sections.includes("languages") ? (
        <div className="mt-7">
          <h2
            className="mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: headingColor }}
          >
            Languages
          </h2>
          <LanguageBlock
            content={content}
            bars={theme.skillStyle === "bars"}
            color={headingColor}
          />
        </div>
      ) : null}
      {sections.includes("certifications") ? (
        <div className="mt-7">
          <h2
            className="mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: headingColor }}
          >
            Certifications
          </h2>
          <ul className="space-y-2 text-[10.5px]">
            {content.certifications.map((item) => (
              <li key={item.id}>
                <p className={cn("font-medium", dark && "text-white")}>{item.name}</p>
                <p className={dark ? "opacity-80" : "text-zinc-500"}>
                  {joinNonEmpty([item.issuer, item.date])}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export function ModernTemplate({
  content,
  variant = "modern",
}: {
  content: ResumeContent;
  variant?: TemplateId;
}) {
  const theme = resolveTheme(variant, content.theme?.primary);
  const sections = getVisibleSections(content);
  const sidebarSections = sections.filter((section) =>
    ["skills", "languages", "certifications"].includes(section),
  );
  const mainSections = sections.filter(
    (section) => !sidebarSections.includes(section),
  );
  const photoUrl = content.personal.photoUrl?.trim();
  const headingLook =
    theme.headingStyle === "boxed" || theme.headingStyle === "bar"
      ? theme.headingStyle
      : "plain";

  if (theme.modernLayout === "banner") {
    return (
      <article className="min-h-[297mm] font-sans text-[11px] leading-relaxed text-zinc-800">
        <header
          className="flex items-center gap-5 px-8 py-7"
          style={{ backgroundColor: theme.sidebar, color: theme.sidebarText }}
        >
          {photoUrl ? (
            <Photo
              url={photoUrl}
              name={content.personal.fullName}
              shape={theme.photo}
              className="size-20 shrink-0 ring-2 ring-white/40"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] leading-tight font-semibold tracking-tight text-white">
              {content.personal.fullName || "Your Name"}
            </h1>
            {content.personal.headline ? (
              <p className="mt-1 text-[12px]" style={{ color: theme.accent }}>
                {content.personal.headline}
              </p>
            ) : null}
            <ContactList
              content={content}
              className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1"
              iconColor={theme.accent}
              compact
            />
          </div>
        </header>
        <div className="grid grid-cols-[1fr_58mm] gap-7 px-8 py-7">
          <div>
            <MainBody
              content={content}
              sections={mainSections}
              heading={theme.heading}
              company={theme.company}
              headingStyle="bar"
            />
          </div>
          <aside>
            <SidebarMeta
              content={content}
              sections={sidebarSections}
              theme={theme}
              headingColor={theme.heading}
            />
          </aside>
        </div>
      </article>
    );
  }

  if (theme.modernLayout === "rail") {
    return (
      <article className="flex min-h-[297mm] font-sans text-[11px] leading-relaxed text-zinc-800">
        <div className="w-2.5 shrink-0" style={{ backgroundColor: theme.sidebar }} />
        <div className="flex-1 px-8 py-8">
          <header className="mb-6 flex items-start gap-5">
            {photoUrl ? (
              <Photo
                url={photoUrl}
                name={content.personal.fullName}
                shape={theme.photo}
                className="size-20 shrink-0 ring-2"
                />
            ) : null}
            <div>
              <h1 className="text-[24px] leading-tight font-semibold tracking-tight text-zinc-950">
                {content.personal.fullName || "Your Name"}
              </h1>
              {content.personal.headline ? (
                <p className="mt-1 text-[12px]" style={{ color: theme.heading }}>
                  {content.personal.headline}
                </p>
              ) : null}
              <ContactList
                content={content}
                className="mt-3 space-y-1 text-zinc-600"
                iconColor={theme.heading}
              />
            </div>
          </header>
          <MainBody
            content={content}
            sections={mainSections}
            heading={theme.heading}
            company={theme.company}
            headingStyle={headingLook}
          />
          {sidebarSections.includes("skills") ? (
            <section className="mt-4">
              <Heading id="skills" color={theme.heading} style={headingLook} />
              <SkillBlock content={content} theme={theme} color={theme.heading} />
            </section>
          ) : null}
          {sidebarSections.includes("languages") ? (
            <section className="mt-4">
              <Heading id="languages" color={theme.heading} style={headingLook} />
              <LanguageBlock content={content} />
            </section>
          ) : null}
          {sidebarSections.includes("certifications") ? (
            <section className="mt-4">
              <Heading id="certifications" color={theme.heading} style={headingLook} />
              {content.certifications.map((item) => (
                <p key={item.id} className="mb-1">
                  {joinNonEmpty([item.name, item.issuer, item.date])}
                </p>
              ))}
            </section>
          ) : null}
        </div>
      </article>
    );
  }

  if (theme.modernLayout === "infographic") {
    return (
      <article className="min-h-[297mm] font-sans text-[11px] leading-relaxed text-zinc-800">
        <header
          className="flex flex-col items-center px-8 py-8 text-center"
          style={{ backgroundColor: theme.sidebar, color: theme.sidebarText }}
        >
          {photoUrl ? (
            <Photo
              url={photoUrl}
              name={content.personal.fullName}
              shape={theme.photo}
              className="mb-4 size-24 ring-4 ring-white/20"
            />
          ) : null}
          <h1 className="text-[24px] leading-tight font-semibold tracking-tight text-white">
            {content.personal.fullName || "Your Name"}
          </h1>
          {content.personal.headline ? (
            <p className="mt-1 text-[12px]" style={{ color: theme.accent }}>
              {content.personal.headline}
            </p>
          ) : null}
          <ContactList
            content={content}
            className="mt-4 flex max-w-[160mm] flex-wrap justify-center gap-x-4 gap-y-1"
            iconColor={theme.accent}
            compact
          />
        </header>
        <div className="grid grid-cols-[1fr_62mm] gap-7 px-8 py-7">
          <div>
            <MainBody
              content={content}
              sections={mainSections}
              heading={theme.heading}
              company={theme.company}
            />
          </div>
          <aside>
            <SidebarMeta
              content={content}
              sections={sidebarSections}
              theme={theme}
              headingColor={theme.heading}
            />
          </aside>
        </div>
      </article>
    );
  }

  if (theme.modernLayout === "header-band") {
    return (
      <article
        className="min-h-[297mm] font-sans text-[11px] leading-relaxed text-zinc-800"
        style={{ backgroundColor: theme.pageBg }}
      >
        <div className="h-2.5" style={{ backgroundColor: theme.heading }} />
        <header className="flex items-start justify-between gap-6 px-8 pt-7 pb-5">
          <div>
            <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-zinc-950">
              {content.personal.fullName || "Your Name"}
            </h1>
            {content.personal.headline ? (
              <p className="mt-1 text-[12px]" style={{ color: theme.heading }}>
                {content.personal.headline}
              </p>
            ) : null}
            <ContactList
              content={content}
              className="mt-3 space-y-1 text-zinc-600"
              iconColor={theme.heading}
            />
          </div>
          {photoUrl ? (
            <Photo
              url={photoUrl}
              name={content.personal.fullName}
              shape={theme.photo}
              className="size-24 shrink-0"
            />
          ) : null}
        </header>
        <div className="grid grid-cols-[1fr_58mm] gap-7 px-8 pb-8">
          <div>
            <MainBody
              content={content}
              sections={mainSections}
              heading={theme.heading}
              company={theme.company}
              headingStyle="bar"
            />
          </div>
          <aside className="rounded-xl px-4 py-4" style={{ backgroundColor: theme.sidebar }}>
            <SidebarMeta
              content={content}
              sections={sidebarSections}
              theme={theme}
              headingColor={theme.heading}
            />
          </aside>
        </div>
      </article>
    );
  }

  const right = theme.modernLayout === "sidebar-right";
  const aside = (
    <ProfileAside
      content={content}
      sections={sidebarSections}
      theme={theme}
      photoUrl={photoUrl}
      showName={!right}
    />
  );

  return (
    <article
      className={cn(
        "grid min-h-[297mm] font-sans text-[11px] leading-relaxed text-zinc-800",
        right ? "grid-cols-[1fr_72mm]" : "grid-cols-[72mm_1fr]",
      )}
    >
      {right ? null : aside}
      <div className="bg-white px-7 py-8">
        {right ? (
          <header className="mb-5">
            <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-zinc-950">
              {content.personal.fullName || "Your Name"}
            </h1>
            {content.personal.headline ? (
              <p className="mt-1 text-[12px]" style={{ color: theme.heading }}>
                {content.personal.headline}
              </p>
            ) : null}
          </header>
        ) : null}
        <MainBody
          content={content}
          sections={mainSections}
          heading={theme.heading}
          company={theme.company}
        />
      </div>
      {right ? aside : null}
    </article>
  );
}
