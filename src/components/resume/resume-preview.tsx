import { ClassicTemplate } from "@/components/resume/templates/classic";
import { MinimalTemplate } from "@/components/resume/templates/minimal";
import { ModernTemplate } from "@/components/resume/templates/modern";
import { cn } from "@/lib/utils";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

export function ResumePreview({
  content,
  templateId,
  className,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  className?: string;
}) {
  const Template = templates[templateId] ?? ClassicTemplate;

  return (
    <div
      className={cn(
        "w-[210mm] min-h-[297mm] overflow-hidden bg-white text-zinc-900 shadow-lg ring-1 ring-zinc-200",
        templateId === "modern" ? "p-0" : "px-10 py-10",
        className,
      )}
    >
      <Template content={content} />
    </div>
  );
}
