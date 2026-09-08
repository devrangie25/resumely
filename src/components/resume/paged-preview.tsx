"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { ResumePreview } from "@/components/resume/resume-preview";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
const MM_TO_PX = 96 / 25.4;

export function PagedPreview({
  content,
  templateId,
  scale = 0.72,
  fitToWidth = false,
  showPageLabel = false,
}: {
  content: ResumeContent;
  templateId: TemplateId;
  scale?: number;
  fitToWidth?: boolean;
  showPageLabel?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fittedScale, setFittedScale] = useState(scale);
  const [pageCount, setPageCount] = useState(1);

  const activeScale = fitToWidth ? fittedScale : scale;

  useLayoutEffect(() => {
    const measure = () => {
      const height = measureRef.current?.scrollHeight ?? 0;
      const pageHeight = PAGE_HEIGHT_MM * MM_TO_PX;
      setPageCount(Math.max(1, Math.ceil(height / pageHeight - 0.02)));
    };

    const node = measureRef.current;
    if (!node) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [content, templateId]);

  useLayoutEffect(() => {
    if (!fitToWidth) return;
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const pageWidthPx = PAGE_WIDTH_MM * MM_TO_PX;
      const available = frame.clientWidth;
      setFittedScale(Math.min(1, available / pageWidthPx));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [fitToWidth]);

  return (
    <div ref={frameRef} className="relative w-full overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none"
        style={{ position: "fixed", left: -10000, top: 0, visibility: "hidden" }}
      >
        <div ref={measureRef}>
          <ResumePreview content={content} templateId={templateId} chrome={false} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {Array.from({ length: pageCount }, (_, index) => (
          <div key={index} className="w-full">
            {showPageLabel && pageCount > 1 ? (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                Page {index + 1} of {pageCount}
              </p>
            ) : null}
            <div
              className="mx-auto overflow-hidden bg-white shadow-lg ring-1 ring-zinc-200"
              style={{
                width: `calc(${PAGE_WIDTH_MM}mm * ${activeScale})`,
                height: `calc(${PAGE_HEIGHT_MM}mm * ${activeScale})`,
              }}
            >
              <div
                className="origin-top-left"
                style={{
                  transform: `scale(${activeScale}) translateY(-${index * PAGE_HEIGHT_MM}mm)`,
                }}
              >
                <ResumePreview
                  content={content}
                  templateId={templateId}
                  chrome={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
