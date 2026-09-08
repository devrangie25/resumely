"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createResume } from "@/lib/resume/actions";

export function CreateResumeButton({
  label = "Create resume",
}: {
  label?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setPending(true);
    setError(null);
    const result = await createResume();
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button onClick={handleCreate} disabled={pending}>
        {pending ? "Creating..." : label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
