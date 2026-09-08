"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { ScaledPreview } from "@/components/resume/scaled-preview";
import { Button } from "@/components/ui/button";
import {
  FAMILY_LABELS,
  variantsForFamily,
  type ResumeContent,
  type TemplateFamily,
  type TemplateId,
} from "@/lib/resume/schema";

export function TemplateCarousel({
  family,
  content,
  onSelect,
}: {
  family: TemplateFamily;
  content: ResumeContent;
  onSelect: (templateId: TemplateId) => void;
}) {
  const variants = variantsForFamily(family);
  const [index, setIndex] = useState(0);
  const current = variants[index];

  useEffect(() => {
    setIndex(0);
  }, [family]);

  function go(direction: -1 | 1) {
    setIndex((currentIndex) => {
      const next = currentIndex + direction;
      if (next < 0) return variants.length - 1;
      if (next >= variants.length) return 0;
      return next;
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm font-medium">
          Choose a {FAMILY_LABELS[family]} design
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {current.label} — {current.description}
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex w-full shrink-0 justify-center px-2"
            >
              <button
                type="button"
                className="rounded-xl text-left outline-none transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => onSelect(variant.id)}
              >
                <ScaledPreview
                  content={content}
                  templateId={variant.id}
                  scale={0.52}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous design"
          onClick={() => go(-1)}
        >
          <ChevronLeftIcon />
        </Button>
        <div className="flex items-center gap-1.5" aria-hidden>
          {variants.map((variant, variantIndex) => (
            <button
              key={variant.id}
              type="button"
              aria-label={`Show ${variant.label}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                variantIndex === index
                  ? "w-6 bg-foreground"
                  : "w-2 bg-muted-foreground/40"
              }`}
              onClick={() => setIndex(variantIndex)}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next design"
          onClick={() => go(1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <Button type="button" onClick={() => onSelect(current.id)}>
        Use {current.label}
      </Button>
    </div>
  );
}
