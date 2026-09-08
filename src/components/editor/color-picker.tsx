"use client";

import { Label } from "@/components/ui/label";
import { ACCENT_SWATCHES, getVariantPreset, isValidHex } from "@/lib/resume/theme";
import { cn } from "@/lib/utils";

export function ColorPicker({
  value,
  templateId,
  onChange,
}: {
  value: string;
  templateId: string;
  onChange: (value: string) => void;
}) {
  const preset = getVariantPreset(templateId);
  const active = value.trim() && isValidHex(value) ? value : preset.primary;

  return (
    <div className="grid gap-2 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="resume-accent">Accent color</Label>
        {value.trim() ? (
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => onChange("")}
          >
            Use template color
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Template default</span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {ACCENT_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            aria-label={`Use ${swatch}`}
            className={cn(
              "size-6 rounded-full ring-2 ring-offset-2 ring-offset-background transition-shadow",
              active.toLowerCase() === swatch.toLowerCase()
                ? "ring-foreground"
                : "ring-transparent hover:ring-border",
            )}
            style={{ backgroundColor: swatch }}
            onClick={() => onChange(swatch)}
          />
        ))}
        <label className="relative size-6 overflow-hidden rounded-full ring-1 ring-border">
          <span className="sr-only">Custom color</span>
          <input
            id="resume-accent"
            type="color"
            value={active}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 size-10 -translate-x-1 -translate-y-1 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
