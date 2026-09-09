import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export async function generateResumePdfBlob({
  content,
  templateId,
}: {
  content: ResumeContent;
  templateId: TemplateId;
}) {
  const [{ pdf }, { ResumePdf }, { registerResumeFonts }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/pdf/resume-pdf"),
    import("@/lib/pdf/fonts"),
  ]);
  await registerResumeFonts();

  let photoSrc = content.personal.photoUrl;
  if (photoSrc) {
    try {
      const response = await fetch(photoSrc);
      const imageBlob = await response.blob();
      photoSrc = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(imageBlob);
      });
    } catch {
      photoSrc = content.personal.photoUrl;
    }
  }

  return pdf(
    <ResumePdf
      content={content}
      templateId={templateId}
      photoSrc={photoSrc || undefined}
    />,
  ).toBlob();
}

export function safeResumeFilename(title: string) {
  return title.trim().replace(/[^\w\- ]+/g, "") || "resume";
}
