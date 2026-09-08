import { ClassicTemplate } from "@/components/resume/templates/classic";
import { MinimalTemplate } from "@/components/resume/templates/minimal";
import { ModernTemplate } from "@/components/resume/templates/modern";
import {
  getTemplateFamily,
  type ResumeContent,
  type TemplateId,
} from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

export function ResumePreview({
  content,
  templateId,
  className,
  chrome = true,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  className?: string;
  chrome?: boolean;
}) {
  const family = getTemplateFamily(templateId);

  return (
    <div
      className={cn(
        "w-[210mm] min-h-[297mm] bg-white text-zinc-900",
        chrome && "shadow-lg ring-1 ring-zinc-200",
        family === "modern" ? "p-0" : "px-10 py-10",
        className,
      )}
    >
      {family === "modern" ? (
        <ModernTemplate content={content} variant={templateId} />
      ) : family === "minimal" ? (
        <MinimalTemplate content={content} variant={templateId} />
      ) : (
        <ClassicTemplate content={content} variant={templateId} />
      )}
    </div>
  );
}
