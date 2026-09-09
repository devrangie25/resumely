"use client";

import { useState } from "react";

import { ColorPicker } from "@/components/editor/color-picker";
import { Button } from "@/components/ui/button";

export function AccentColorPanel({
  value,
  templateId,
  onChange,
}: {
  value: string;
  templateId: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Accent color</p>
          <p className="text-xs text-muted-foreground">
            Optional. Hidden until you want to override the template.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Hide" : "Customize"}
        </Button>
      </div>
      {open ? (
        <div className="mt-3 border-t pt-3">
          <ColorPicker
            value={value}
            templateId={templateId}
            onChange={onChange}
          />
        </div>
      ) : null}
    </div>
  );
}
