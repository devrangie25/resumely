import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  type Styles,
} from "@react-pdf/renderer";

import { dateRange, joinNonEmpty } from "@/components/resume/shared";
import {
  SECTION_LABELS,
  type ResumeContent,
  type SectionId,
  type TemplateId,
} from "@/lib/resume/schema";
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

const classic = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 42,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#18181b",
    lineHeight: 1.4,
  },
  name: { fontSize: 22, textAlign: "center", fontFamily: "Times-Bold" },
  headline: { marginTop: 4, fontSize: 11, textAlign: "center", fontFamily: "Times-Italic" },
  contact: { marginTop: 8, fontSize: 9, textAlign: "center", color: "#3f3f46" },
  heading: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 10,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    paddingBottom: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  bold: { fontFamily: "Times-Bold" },
  muted: { fontSize: 9, color: "#52525b" },
  block: { marginBottom: 8 },
  bullet: { fontSize: 10, marginLeft: 8, marginTop: 1 },
});

function ClassicPdf({ content }: { content: ResumeContent }) {
  const sections = getVisibleSections(content);
  const contacts = [
    content.personal.email,
    content.personal.phone,
    content.personal.location,
    content.personal.website,
    content.personal.linkedin,
    content.personal.github,
  ].filter((item) => item.trim());

  return (
    <Document>
      <Page size="A4" style={classic.page}>
        <Text style={classic.name}>{content.personal.fullName || "Your Name"}</Text>
        {content.personal.headline ? (
          <Text style={classic.headline}>{content.personal.headline}</Text>
        ) : null}
        {contacts.length ? (
          <Text style={classic.contact}>{contacts.join("  ·  ")}</Text>
        ) : null}

        {sections.map((section) => (
          <View key={section}>
            <Text style={classic.heading}>{SECTION_LABELS[section]}</Text>
            <ClassicSection content={content} section={section} />
          </View>
        ))}
      </Page>
    </Document>
  );
}

function ClassicSection({
  content,
  section,
}: {
  content: ResumeContent;
  section: SectionId;
}) {
  switch (section) {
    case "summary":
      return <Text>{content.summary}</Text>;
    case "experience":
      return (
        <View>
          {content.experience.map((item) => (
            <View key={item.id} style={classic.block}>
              <View style={classic.row}>
                <Text style={classic.bold}>
                  {joinNonEmpty([item.title, item.company], ", ")}
                </Text>
                <Text style={classic.muted}>
                  {dateRange(item.startDate, item.endDate, item.current)}
                </Text>
              </View>
              {item.location ? (
                <Text style={classic.muted}>{item.location}</Text>
              ) : null}
              <PdfBullets items={item.bullets} style={classic.bullet} />
            </View>
          ))}
        </View>
      );
    case "education":
      return (
        <View>
          {content.education.map((item) => (
            <View key={item.id} style={classic.block}>
              <View style={classic.row}>
                <Text style={classic.bold}>{item.school}</Text>
                <Text style={classic.muted}>
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
            <View key={item.id} style={classic.block}>
              <Text style={classic.bold}>
                {joinNonEmpty([item.name, item.url], " — ")}
              </Text>
              {item.description ? <Text>{item.description}</Text> : null}
              <PdfBullets items={item.bullets} style={classic.bullet} />
            </View>
          ))}
        </View>
      );
    case "certifications":
      return (
        <View>
          {content.certifications.map((item) => (
            <Text key={item.id} style={classic.block}>
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
            <Text key={item.id} style={classic.block}>
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
            <Text key={item.id} style={classic.block}>
              {joinNonEmpty(
                [item.name, item.title, item.company, item.email, item.phone],
              )}
            </Text>
          ))}
        </View>
      );
  }
}

const modern = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#27272a" },
  sidebar: { width: 190, backgroundColor: "#18181b", color: "#fafafa", padding: 24 },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  headline: { marginTop: 8, fontSize: 10, color: "#99f6e4" },
  sideHeading: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#99f6e4",
    fontFamily: "Helvetica-Bold",
  },
  sideItem: { fontSize: 9, color: "#e4e4e7", marginBottom: 4 },
  main: { flex: 1, padding: 28 },
  heading: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#115e59",
    fontFamily: "Helvetica-Bold",
  },
  firstHeading: {
    marginTop: 0,
    marginBottom: 6,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#115e59",
    fontFamily: "Helvetica-Bold",
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  bold: { fontFamily: "Helvetica-Bold", color: "#18181b" },
  company: { color: "#115e59", marginBottom: 2 },
  muted: { fontSize: 9, color: "#71717a" },
  block: { marginBottom: 10 },
  bullet: { fontSize: 10, marginLeft: 8, marginTop: 1 },
});

function ModernPdf({ content }: { content: ResumeContent }) {
  const sections = getVisibleSections(content);
  const sidebar = sections.filter((section) =>
    ["skills", "languages", "certifications"].includes(section),
  );
  const main = sections.filter((section) => !sidebar.includes(section));
  const contacts = [
    content.personal.email,
    content.personal.phone,
    content.personal.location,
    content.personal.website,
    content.personal.linkedin,
    content.personal.github,
  ].filter((item) => item.trim());

  return (
    <Document>
      <Page size="A4" style={modern.page}>
        <View style={modern.sidebar}>
          <Text style={modern.name}>{content.personal.fullName || "Your Name"}</Text>
          {content.personal.headline ? (
            <Text style={modern.headline}>{content.personal.headline}</Text>
          ) : null}
          {contacts.length ? (
            <View>
              <Text style={modern.sideHeading}>Contact</Text>
              {contacts.map((item) => (
                <Text key={item} style={modern.sideItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}
          {sidebar.includes("skills") ? (
            <View>
              <Text style={modern.sideHeading}>Skills</Text>
              {content.skills
                .filter((skill) => skill.name.trim())
                .map((skill) => (
                  <Text key={skill.id} style={modern.sideItem}>
                    {skill.name}
                  </Text>
                ))}
            </View>
          ) : null}
          {sidebar.includes("languages") ? (
            <View>
              <Text style={modern.sideHeading}>Languages</Text>
              {content.languages
                .filter((item) => item.name.trim())
                .map((item) => (
                  <Text key={item.id} style={modern.sideItem}>
                    {item.name}
                    {item.proficiency ? ` · ${item.proficiency}` : ""}
                  </Text>
                ))}
            </View>
          ) : null}
          {sidebar.includes("certifications") ? (
            <View>
              <Text style={modern.sideHeading}>Certifications</Text>
              {content.certifications.map((item) => (
                <Text key={item.id} style={modern.sideItem}>
                  {joinNonEmpty([item.name, item.issuer, item.date])}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
        <View style={modern.main}>
          {main.map((section, index) => (
            <View key={section}>
              <Text style={index === 0 ? modern.firstHeading : modern.heading}>
                {SECTION_LABELS[section]}
              </Text>
              <ClassicSection content={content} section={section} />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

const minimal = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#27272a",
    lineHeight: 1.45,
  },
  name: { fontSize: 24, fontFamily: "Helvetica", letterSpacing: -0.4 },
  headline: { marginTop: 6, fontSize: 12, color: "#52525b" },
  contact: { marginTop: 10, marginBottom: 14, fontSize: 9, color: "#71717a" },
  rule: { borderBottomWidth: 1, borderBottomColor: "#e4e4e7", marginBottom: 6 },
  heading: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "#71717a",
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  title: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#09090b" },
  muted: { fontSize: 9, color: "#71717a" },
  block: { marginBottom: 10 },
  bullet: { fontSize: 10, marginLeft: 8, marginTop: 1 },
});

function MinimalPdf({ content }: { content: ResumeContent }) {
  const sections = getVisibleSections(content);
  const contacts = [
    content.personal.email,
    content.personal.phone,
    content.personal.location,
    content.personal.website,
    content.personal.linkedin,
    content.personal.github,
  ].filter((item) => item.trim());

  return (
    <Document>
      <Page size="A4" style={minimal.page}>
        <Text style={minimal.name}>{content.personal.fullName || "Your Name"}</Text>
        {content.personal.headline ? (
          <Text style={minimal.headline}>{content.personal.headline}</Text>
        ) : null}
        {contacts.length ? (
          <Text style={minimal.contact}>{contacts.join("  /  ")}</Text>
        ) : (
          <View style={minimal.rule} />
        )}
        <View style={minimal.rule} />
        {sections.map((section) => (
          <View key={section}>
            <Text style={minimal.heading}>{SECTION_LABELS[section]}</Text>
            <ClassicSection content={content} section={section} />
          </View>
        ))}
      </Page>
    </Document>
  );
}

export function ResumePdf({
  content,
  templateId,
}: {
  content: ResumeContent;
  templateId: TemplateId;
}) {
  if (templateId === "modern") {
    return <ModernPdf content={content} />;
  }
  if (templateId === "minimal") {
    return <MinimalPdf content={content} />;
  }
  return <ClassicPdf content={content} />;
}
