import {
  Document,
  Image,
  Page,
  Path,
  Svg,
  Text,
  View,
  type Styles,
} from "@react-pdf/renderer";

import { dateRange, joinNonEmpty } from "@/components/resume/shared";
import {
  SECTION_LABELS,
  getTemplateFamily,
  type ResumeContent,
  type SectionId,
  type TemplateId,
} from "@/lib/resume/schema";
import {
  photoRadiusPx,
  resolveTheme,
  type ResolvedTheme,
} from "@/lib/resume/theme";
import { getVisibleSections } from "@/lib/resume/visibility";

function bullets(items: string[]) {
  return items.filter((item) => item.trim());
}

function PdfBullets({
  items,
  style,
}: {
  items: string[];
  style: Styles[string];
}) {
  const list = bullets(items);
  if (!list.length) return null;

  return (
    <View style={{ marginTop: 3 }}>
      {list.map((item) => (
        <Text key={item} style={style}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

const ICON_PATHS: Record<string, string> = {
  email:
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  website: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  github:
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
};

function PdfIcon({ kind, color }: { kind: string; color: string }) {
  const d = ICON_PATHS[kind];
  if (!d) return null;
  return (
    <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginTop: 1 }}>
      <Path
        d={d}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function pdfContacts(content: ResumeContent) {
  return [
    { kind: "email", value: content.personal.email },
    { kind: "phone", value: content.personal.phone },
    { kind: "location", value: content.personal.location },
    { kind: "website", value: content.personal.website },
    { kind: "linkedin", value: content.personal.linkedin },
    { kind: "github", value: content.personal.github },
  ].filter((item) => item.value.trim());
}

function PdfSectionBody({
  content,
  section,
  companyColor,
  mutedColor = "#71717a",
  boldColor = "#18181b",
}: {
  content: ResumeContent;
  section: SectionId;
  companyColor?: string;
  mutedColor?: string;
  boldColor?: string;
}) {
  switch (section) {
    case "summary":
      return <Text>{content.summary}</Text>;
    case "experience":
      return (
        <View>
          {content.experience.map((item) => (
            <View key={item.id} style={{ marginBottom: 8 }} wrap={false}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", color: boldColor }}>
                  {item.title || joinNonEmpty([item.title, item.company], ", ")}
                </Text>
                <Text style={{ fontSize: 9, color: mutedColor }}>
                  {dateRange(item.startDate, item.endDate, item.current)}
                </Text>
              </View>
              <Text style={{ color: companyColor ?? mutedColor }}>
                {joinNonEmpty([item.company, item.location])}
              </Text>
              <PdfBullets items={item.bullets} style={{ fontSize: 10, marginLeft: 8, marginTop: 1 }} />
            </View>
          ))}
        </View>
      );
    case "education":
      return (
        <View>
          {content.education.map((item) => (
            <View key={item.id} style={{ marginBottom: 8 }} wrap={false}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", color: boldColor }}>
                  {item.school}
                </Text>
                <Text style={{ fontSize: 9, color: mutedColor }}>
                  {dateRange(item.startDate, item.endDate)}
                </Text>
              </View>
              <Text>{joinNonEmpty([item.degree, item.field, item.location], ", ")}</Text>
              {item.details ? <Text>{item.details}</Text> : null}
            </View>
          ))}
        </View>
      );
    case "skills":
      return (
        <Text>
          {content.skills.map((skill) => skill.name).filter(Boolean).join(" · ")}
        </Text>
      );
    case "projects":
      return (
        <View>
          {content.projects.map((item) => (
            <View key={item.id} style={{ marginBottom: 8 }} wrap={false}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: boldColor }}>
                {joinNonEmpty([item.name, item.url], " — ")}
              </Text>
              {item.description ? <Text>{item.description}</Text> : null}
              <PdfBullets items={item.bullets} style={{ fontSize: 10, marginLeft: 8, marginTop: 1 }} />
            </View>
          ))}
        </View>
      );
    case "certifications":
      return (
        <View>
          {content.certifications.map((item) => (
            <Text key={item.id} style={{ marginBottom: 6 }}>
              {joinNonEmpty([item.name, item.issuer, item.date], ", ")}
            </Text>
          ))}
        </View>
      );
    case "languages":
      return (
        <Text>
          {content.languages
            .filter((item) => item.name.trim())
            .map((item) =>
              item.proficiency ? `${item.name} (${item.proficiency})` : item.name,
            )
            .join(" · ")}
        </Text>
      );
    case "awards":
      return (
        <View>
          {content.awards.map((item) => (
            <Text key={item.id} style={{ marginBottom: 6 }}>
              {joinNonEmpty([item.title, item.issuer, item.date], " — ")}
              {item.description ? `. ${item.description}` : ""}
            </Text>
          ))}
        </View>
      );
    case "references":
      return (
        <View>
          {content.references.map((item) => (
            <Text key={item.id} style={{ marginBottom: 6 }}>
              {joinNonEmpty(
                [item.name, item.title, item.company, item.email, item.phone],
              )}
            </Text>
          ))}
        </View>
      );
  }
}

function PdfHeading({
  section,
  color,
}: {
  section: SectionId;
  color: string;
}) {
  return (
    <Text
      minPresenceAhead={28}
      style={{
        marginTop: 12,
        marginBottom: 6,
        fontSize: 10,
        letterSpacing: 1.1,
        textTransform: "uppercase",
        color,
        fontFamily: "Helvetica-Bold",
      }}
    >
      {SECTION_LABELS[section]}
    </Text>
  );
}

function ClassicPdf({
  content,
  theme,
}: {
  content: ResumeContent;
  theme: ResolvedTheme;
}) {
  const sections = getVisibleSections(content);
  const contacts = pdfContacts(content);
  const align = theme.classicAlign;

  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={{
          paddingTop: 36,
          paddingBottom: 40,
          paddingHorizontal: 42,
          fontFamily: "Times-Roman",
          fontSize: 10,
          color: "#18181b",
          lineHeight: 1.4,
        }}
      >
        <View wrap={false}>
          <Text
            style={{
              fontSize: 22,
              textAlign: align,
              fontFamily: "Times-Bold",
              color: theme.heading,
            }}
          >
            {content.personal.fullName || "Your Name"}
          </Text>
          {content.personal.headline ? (
            <Text
              style={{
                marginTop: 4,
                fontSize: 11,
                textAlign: align,
                fontFamily: "Times-Italic",
              }}
            >
              {content.personal.headline}
            </Text>
          ) : null}
          {contacts.length ? (
            <Text
              style={{
                marginTop: 8,
                fontSize: 9,
                textAlign: align,
                color: "#3f3f46",
              }}
            >
              {contacts.map((item) => item.value).join("  ·  ")}
            </Text>
          ) : null}
        </View>

        {sections.map((section) => (
          <View key={section}>
            <Text
              minPresenceAhead={28}
              style={{
                marginTop: 14,
                marginBottom: 6,
                fontSize: 10,
                fontFamily: "Times-Bold",
                textTransform: "uppercase",
                letterSpacing: 1.4,
                color: theme.heading,
                borderBottomWidth: 1,
                borderBottomColor: theme.rule,
                paddingBottom: 2,
              }}
            >
              {SECTION_LABELS[section]}
            </Text>
            <PdfSectionBody
              content={content}
              section={section}
              companyColor={theme.company}
            />
          </View>
        ))}
      </Page>
    </Document>
  );
}

function ContactRows({
  content,
  color,
  itemColor,
}: {
  content: ResumeContent;
  color: string;
  itemColor: string;
}) {
  return (
    <View>
      {pdfContacts(content).map((item) => (
        <View
          key={item.kind}
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 5, marginBottom: 4 }}
        >
          <PdfIcon kind={item.kind} color={color} />
          <Text style={{ fontSize: 9, color: itemColor, flex: 1 }}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SkillPillsPdf({ names, color }: { names: string[]; color: string }) {
  const skills = names.filter(Boolean);
  if (!skills.length) return null;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      {skills.map((name) => (
        <Text
          key={name}
          style={{
            fontSize: 8,
            color,
            borderWidth: 1,
            borderColor: color,
            borderRadius: 8,
            paddingHorizontal: 5,
            paddingVertical: 2,
          }}
        >
          {name}
        </Text>
      ))}
    </View>
  );
}

function ModernPdf({
  content,
  photoSrc,
  theme,
}: {
  content: ResumeContent;
  photoSrc?: string;
  theme: ResolvedTheme;
}) {
  const sections = getVisibleSections(content);
  const sidebar = sections.filter((section) =>
    ["skills", "languages", "certifications"].includes(section),
  );
  const main = sections.filter((section) => !sidebar.includes(section));
  const skills = content.skills.map((skill) => skill.name);

  if (theme.modernLayout === "banner") {
    return (
      <Document>
        <Page
          size="A4"
          wrap
          style={{ fontFamily: "Helvetica", fontSize: 10, color: "#27272a" }}
        >
          <View
            wrap={false}
            style={{
              backgroundColor: theme.sidebar,
              paddingHorizontal: 28,
              paddingVertical: 22,
              flexDirection: "row",
              gap: 16,
              alignItems: "center",
            }}
          >
            {photoSrc ? (
              <Image
                src={photoSrc}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: photoRadiusPx(theme.photo, 72),
                  objectFit: "cover",
                }}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>
                {content.personal.fullName || "Your Name"}
              </Text>
              {content.personal.headline ? (
                <Text style={{ marginTop: 4, fontSize: 11, color: theme.accent }}>
                  {content.personal.headline}
                </Text>
              ) : null}
              <View style={{ marginTop: 10 }}>
                <ContactRows
                  content={content}
                  color={theme.accent}
                  itemColor={theme.sidebarText}
                />
              </View>
            </View>
          </View>
          <View style={{ paddingHorizontal: 32, paddingVertical: 24, paddingBottom: 36 }}>
            {main.map((section) => (
              <View key={section}>
                <PdfHeading section={section} color={theme.heading} />
                <PdfSectionBody
                  content={content}
                  section={section}
                  companyColor={theme.company}
                />
              </View>
            ))}
            {sidebar.includes("skills") ? (
              <View>
                <PdfHeading section="skills" color={theme.heading} />
                <SkillPillsPdf names={skills} color={theme.heading} />
              </View>
            ) : null}
            {sidebar
              .filter((section) => section !== "skills")
              .map((section) => (
                <View key={section}>
                  <PdfHeading section={section} color={theme.heading} />
                  <PdfSectionBody content={content} section={section} />
                </View>
              ))}
          </View>
        </Page>
      </Document>
    );
  }

  if (theme.modernLayout === "rail") {
    return (
      <Document>
        <Page
          size="A4"
          wrap
          style={{
            fontFamily: "Helvetica",
            fontSize: 10,
            color: "#27272a",
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 32,
            paddingBottom: 36,
          }}
        >
          <View
            fixed
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 10,
              backgroundColor: theme.sidebar,
            }}
          />
          <View wrap={false} style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
            {photoSrc ? (
              <Image
                src={photoSrc}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: photoRadiusPx(theme.photo, 72),
                  objectFit: "cover",
                }}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: "#09090b" }}>
                {content.personal.fullName || "Your Name"}
              </Text>
              {content.personal.headline ? (
                <Text style={{ marginTop: 4, color: theme.heading }}>
                  {content.personal.headline}
                </Text>
              ) : null}
              <View style={{ marginTop: 8 }}>
                <ContactRows
                  content={content}
                  color={theme.heading}
                  itemColor="#52525b"
                />
              </View>
            </View>
          </View>
          {[...main, ...sidebar].map((section) => (
            <View key={section}>
              <PdfHeading section={section} color={theme.heading} />
              {section === "skills" && theme.skillStyle === "pills" ? (
                <SkillPillsPdf names={skills} color={theme.heading} />
              ) : (
                <PdfSectionBody
                  content={content}
                  section={section}
                  companyColor={theme.company}
                />
              )}
            </View>
          ))}
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={{
          fontFamily: "Helvetica",
          fontSize: 10,
          color: "#27272a",
          paddingLeft: 206,
          paddingRight: 28,
          paddingTop: 28,
          paddingBottom: 36,
        }}
      >
        <View
          fixed
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 190,
            backgroundColor: theme.sidebar,
            color: theme.sidebarText,
            padding: 24,
          }}
        >
          {photoSrc ? (
            <Image
              src={photoSrc}
              style={{
                width: 80,
                height: 80,
                borderRadius: photoRadiusPx(theme.photo),
                objectFit: "cover",
                marginBottom: 14,
              }}
            />
          ) : null}
          <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>
            {content.personal.fullName || "Your Name"}
          </Text>
          {content.personal.headline ? (
            <Text style={{ marginTop: 8, fontSize: 10, color: theme.accent }}>
              {content.personal.headline}
            </Text>
          ) : null}
          <Text
            style={{
              marginTop: 18,
              marginBottom: 6,
              fontSize: 9,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: theme.accent,
              fontFamily: "Helvetica-Bold",
            }}
          >
            Contact
          </Text>
          <ContactRows
            content={content}
            color={theme.accent}
            itemColor={theme.sidebarText}
          />
          {sidebar.includes("skills") ? (
            <View>
              <Text
                style={{
                  marginTop: 16,
                  marginBottom: 6,
                  fontSize: 9,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: theme.accent,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Skills
              </Text>
              {theme.skillStyle === "pills" ? (
                <SkillPillsPdf names={skills} color={theme.accent} />
              ) : (
                content.skills
                  .filter((skill) => skill.name.trim())
                  .map((skill) => (
                    <Text
                      key={skill.id}
                      style={{ fontSize: 9, color: theme.sidebarText, marginBottom: 4 }}
                    >
                      {skill.name}
                    </Text>
                  ))
              )}
            </View>
          ) : null}
          {sidebar.includes("languages") ? (
            <View>
              <Text
                style={{
                  marginTop: 16,
                  marginBottom: 6,
                  fontSize: 9,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: theme.accent,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Languages
              </Text>
              {content.languages
                .filter((item) => item.name.trim())
                .map((item) => (
                  <Text
                    key={item.id}
                    style={{ fontSize: 9, color: theme.sidebarText, marginBottom: 4 }}
                  >
                    {item.name}
                    {item.proficiency ? ` · ${item.proficiency}` : ""}
                  </Text>
                ))}
            </View>
          ) : null}
          {sidebar.includes("certifications") ? (
            <View>
              <Text
                style={{
                  marginTop: 16,
                  marginBottom: 6,
                  fontSize: 9,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: theme.accent,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Certifications
              </Text>
              {content.certifications.map((item) => (
                <Text
                  key={item.id}
                  style={{ fontSize: 9, color: theme.sidebarText, marginBottom: 4 }}
                >
                  {joinNonEmpty([item.name, item.issuer, item.date])}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        {main.map((section, index) => (
          <View key={section}>
            <Text
              minPresenceAhead={28}
              style={{
                marginTop: index === 0 ? 0 : 12,
                marginBottom: 6,
                fontSize: 10,
                letterSpacing: 1.1,
                textTransform: "uppercase",
                color: theme.heading,
                fontFamily: "Helvetica-Bold",
              }}
            >
              {SECTION_LABELS[section]}
            </Text>
            <PdfSectionBody
              content={content}
              section={section}
              companyColor={theme.company}
            />
          </View>
        ))}
      </Page>
    </Document>
  );
}

function MinimalPdf({
  content,
  theme,
}: {
  content: ResumeContent;
  theme: ResolvedTheme;
}) {
  const sections = getVisibleSections(content);
  const contacts = pdfContacts(content);
  const skills = content.skills.map((skill) => skill.name);

  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={{
          paddingTop: 40,
          paddingBottom: 40,
          paddingHorizontal: 44,
          paddingLeft: theme.modernLayout === "rail" ? 52 : 44,
          fontFamily: "Helvetica",
          fontSize: 10,
          color: "#27272a",
          lineHeight: 1.45,
        }}
      >
        {theme.modernLayout === "rail" ? (
          <View
            fixed
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              backgroundColor: theme.heading,
            }}
          />
        ) : null}
        <View
          wrap={false}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.rule,
            paddingBottom: 12,
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              letterSpacing: -0.4,
              color: theme.heading,
              fontFamily: theme.font === "serif" ? "Times-Roman" : "Helvetica",
            }}
          >
            {content.personal.fullName || "Your Name"}
          </Text>
          {content.personal.headline ? (
            <Text style={{ marginTop: 6, fontSize: 12, color: "#52525b" }}>
              {content.personal.headline}
            </Text>
          ) : null}
          <View style={{ marginTop: 10 }}>
            {theme.heading !== "#71717a" ? (
              <ContactRows
                content={content}
                color={theme.heading}
                itemColor="#52525b"
              />
            ) : contacts.length ? (
              <Text style={{ fontSize: 9, color: "#71717a" }}>
                {contacts.map((item) => item.value).join("  /  ")}
              </Text>
            ) : null}
          </View>
        </View>
        {sections.map((section) => (
          <View key={section}>
            <Text
              minPresenceAhead={28}
              style={{
                marginTop: 16,
                marginBottom: 8,
                fontSize: 9,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: theme.heading,
                borderBottomWidth: 1,
                borderBottomColor: theme.rule,
                paddingBottom: 3,
              }}
            >
              {SECTION_LABELS[section]}
            </Text>
            {section === "skills" && theme.skillStyle === "pills" ? (
              <SkillPillsPdf names={skills} color={theme.heading} />
            ) : (
              <PdfSectionBody
                content={content}
                section={section}
                companyColor={theme.company}
              />
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}

export function ResumePdf({
  content,
  templateId,
  photoSrc,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  photoSrc?: string;
}) {
  const family = getTemplateFamily(templateId);
  const theme = resolveTheme(templateId, content.theme?.primary);
  if (family === "modern") {
    return (
      <ModernPdf
        content={content}
        photoSrc={photoSrc || content.personal.photoUrl || undefined}
        theme={theme}
      />
    );
  }
  if (family === "minimal") {
    return <MinimalPdf content={content} theme={theme} />;
  }
  return <ClassicPdf content={content} theme={theme} />;
}
