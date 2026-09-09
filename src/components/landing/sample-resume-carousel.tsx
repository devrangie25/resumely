"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { ScaledPreview } from "@/components/resume/scaled-preview";
import {
  FAMILY_LABELS,
  TEMPLATE_FAMILIES,
  TEMPLATE_VARIANTS,
  type ResumeContent,
  type TemplateFamily,
  type TemplateId,
} from "@/lib/resume/schema";

const SHOWCASE_TEMPLATES: { family: TemplateFamily; templateId: TemplateId }[] =
  TEMPLATE_FAMILIES.map((family) => ({
    family,
    templateId: family as TemplateId,
  }));

const AUTO_ADVANCE_MS = 5000;

function getFamilyDescription(family: TemplateFamily) {
  const variant = TEMPLATE_VARIANTS.find((item) => item.id === family);
  return variant?.description ?? "";
}

export function SampleResumeCarousel({ content }: { content: ResumeContent }) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(0.48);
  const [paused, setPaused] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const current = SHOWCASE_TEMPLATES[index];

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const pageWidthPx = (210 / 25.4) * 96;
      setScale(Math.min(0.48, (frame.clientWidth - 8) / pageWidthPx));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % SHOWCASE_TEMPLATES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="text-center">
        <p
          key={current.family}
          className="text-sm font-medium animate-in fade-in duration-300"
        >
          {FAMILY_LABELS[current.family]} template
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {getFamilyDescription(current.family)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          {TEMPLATE_FAMILIES.length} families · {TEMPLATE_VARIANTS.length} designs
        </p>
      </div>

      <div
        ref={frameRef}
        className="relative w-full overflow-hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SHOWCASE_TEMPLATES.map((item) => (
            <div
              key={item.family}
              id={`template-slide-${item.family}`}
              className="flex w-full shrink-0 justify-center"
              role="tabpanel"
              aria-hidden={item.family !== current.family}
            >
              <ScaledPreview
                content={content}
                templateId={item.templateId}
                scale={scale}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center gap-2"
        role="tablist"
        aria-label="Resume template families"
      >
        {SHOWCASE_TEMPLATES.map((item, itemIndex) => {
          const selected = itemIndex === index;
          return (
            <button
              key={item.family}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`template-slide-${item.family}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                selected
                  ? "bg-foreground text-background"
                  : "bg-background/70 text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
              onClick={() => setIndex(itemIndex)}
            >
              {FAMILY_LABELS[item.family]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
