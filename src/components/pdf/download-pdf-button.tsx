"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export function DownloadPdfButton({
  content,
  templateId,
  title,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  title: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleDownload() {
    setPending(true);
    try {
      const [{ pdf }, { ResumePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/resume-pdf"),
      ]);
      const blob = await pdf(
        <ResumePdf content={content} templateId={templateId} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeTitle = title.trim().replace(/[^\w\- ]+/g, "") || "resume";
      link.href = url;
      link.download = `${safeTitle}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
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
