"use client";

import { useState } from "react";

import {
  generateResumePdfBlob,
  safeResumeFilename,
} from "@/components/pdf/generate-resume-pdf";
import { Button } from "@/components/ui/button";
import { trackResumeDownload } from "@/lib/resume/actions";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export function DownloadPdfButton({
  resumeId,
  content,
  templateId,
  title,
}: {
  resumeId?: string;
  content: ResumeContent;
  templateId: TemplateId;
  title: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleDownload() {
    setPending(true);
    try {
      const blob = await generateResumePdfBlob({ content, templateId });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeResumeFilename(title)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      if (resumeId) {
        await trackResumeDownload(resumeId);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Button onClick={handleDownload} disabled={pending}>
      {pending ? "Preparing PDF..." : "Download PDF"}
    </Button>
  );
}
