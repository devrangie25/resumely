"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createResume } from "@/lib/resume/actions";

export function CreateResumeButton({
  label = "Create resume",
}: {
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [useProfile, setUseProfile] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setPending(true);
    setError(null);
    const result = await createResume({ useProfile });
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!pending) {
      setOpen(nextOpen);
      if (!nextOpen) {
        setUseProfile(false);
        setError(null);
      }
    }
  }

  return (
    <div className="grid gap-2">
      <Button onClick={() => setOpen(true)} disabled={pending}>
        {label}
      </Button>
      {error && !open ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create resume</DialogTitle>
            <DialogDescription>
              Start with a blank template, or prefill personal details from your
              profile if this resume is for you.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
            <div className="grid gap-1">
              <Label htmlFor="use-profile">Use my profile details</Label>
              <p className="text-sm text-muted-foreground">
                Copies all saved profile sections — personal info, summary,
                experience, education, and more. Leave off for someone
                else&apos;s resume.
              </p>
            </div>
            <Switch
              id="use-profile"
              checked={useProfile}
              onCheckedChange={setUseProfile}
              disabled={pending}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={pending}>
              {pending ? "Creating..." : "Create resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
