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
      const blob = await pdf(
        <ResumePdf
          content={content}
          templateId={templateId}
          photoSrc={photoSrc || undefined}
        />,
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
