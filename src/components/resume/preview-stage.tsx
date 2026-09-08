"use client";

import { PagedPreview } from "@/components/resume/paged-preview";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export function PreviewStage({
  content,
  templateId,
}: {
  content: ResumeContent;
  templateId: TemplateId;
}) {
  return (
    <PagedPreview
      content={content}
      templateId={templateId}
      fitToWidth
      showPageLabel
    />
  );
}
