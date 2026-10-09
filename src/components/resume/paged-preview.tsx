"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { ResumePreview } from "@/components/resume/resume-preview";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;

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
  const rulerRef = useRef<HTMLDivElement>(null);
  const [fittedScale, setFittedScale] = useState(scale);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const activeScale = fitToWidth ? fittedScale : scale;

  const handlePages = useCallback((pages: number) => {
    setPageCount((current) => (current === pages ? current : pages));
  }, []);

  useLayoutEffect(() => {
    const height = rulerRef.current?.offsetHeight ?? 0;
    if (height) setPageHeight(height);
  }, [content, templateId]);

  useLayoutEffect(() => {
    if (!fitToWidth) return;
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const pageWidthPx = rulerRef.current?.offsetWidth ?? 0;
      if (!pageWidthPx) return;
      setFittedScale(Math.min(1, frame.clientWidth / pageWidthPx));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [fitToWidth, content, templateId]);

  return (
    <div ref={frameRef} className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none"
        style={{ position: "fixed", left: -10000, top: 0, visibility: "hidden" }}
      >
        <div
          ref={rulerRef}
          style={{ width: `${PAGE_WIDTH_MM}mm`, height: `${PAGE_HEIGHT_MM}mm` }}
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        {Array.from({ length: pageCount }, (_, index) => (
          <div key={index} className="w-full">
            {showPageLabel || pageCount > 1 ? (
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
                  transform: `translateY(calc(-${index} * ${PAGE_HEIGHT_MM}mm * ${activeScale})) scale(${activeScale})`,
                }}
              >
                <ResumePreview
                  content={content}
                  templateId={templateId}
                  chrome={false}
                  paginate
                  pageHeight={pageHeight}
                  onPages={index === 0 ? handlePages : undefined}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
