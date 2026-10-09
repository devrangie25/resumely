"use client";

import { useLayoutEffect, useRef } from "react";

import { ClassicTemplate } from "@/components/resume/templates/classic";
import { MinimalTemplate } from "@/components/resume/templates/minimal";
import { ModernTemplate } from "@/components/resume/templates/modern";
import { paginateResume } from "@/lib/resume/page-breaks";
import {
  getTemplateFamily,
  type ResumeContent,
  type TemplateId,
} from "@/lib/resume/schema";
import { resolveTheme } from "@/lib/resume/theme";
import { cn } from "@/lib/utils";

export function ResumePreview({
  content,
  templateId,
  className,
  chrome = true,
  paginate = false,
  pageHeight = 0,
  onPages,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  className?: string;
  chrome?: boolean;
  paginate?: boolean;
  pageHeight?: number;
  onPages?: (pages: number) => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const family = getTemplateFamily(templateId);
  const theme = resolveTheme(templateId, content.theme?.primary);

  useLayoutEffect(() => {
    if (!paginate) return;
    const sheet = sheetRef.current;
    if (!sheet || !pageHeight) return;

    let cancelled = false;
    const run = () => {
      if (cancelled || !sheetRef.current) return;
      const pages = paginateResume(sheetRef.current, pageHeight);
      onPages?.(pages);
    };

    run();
    const images = [...sheet.querySelectorAll("img")];
    for (const image of images) {
      if (image.complete) continue;
      image.addEventListener("load", run, { once: true });
      image.addEventListener("error", run, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, [paginate, pageHeight, content, templateId, onPages]);

  return (
    <div
      ref={sheetRef}
      data-resume-sheet=""
      data-resume-family={family}
      className={cn(
        "w-[210mm] min-h-[297mm] text-zinc-900",
        chrome && "shadow-lg ring-1 ring-zinc-200",
        theme.fullBleed ? "p-0" : "px-10 py-10",
        className,
      )}
      style={{ backgroundColor: theme.pageBg }}
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
