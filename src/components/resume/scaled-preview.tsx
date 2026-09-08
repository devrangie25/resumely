import { ResumePreview } from "@/components/resume/resume-preview";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export function ScaledPreview({
  content,
  templateId,
  scale = 0.5,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  scale?: number;
}) {
  return (
    <div
      className="overflow-hidden shadow-lg ring-1 ring-zinc-200"
      style={{
        width: `calc(210mm * ${scale})`,
        height: `calc(297mm * ${scale})`,
      }}
    >
      <div
        className="origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <ResumePreview content={content} templateId={templateId} chrome={false} />
      </div>
    </div>
  );
}
