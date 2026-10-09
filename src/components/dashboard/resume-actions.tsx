"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteResume, duplicateResume } from "@/lib/resume/actions";

type ResumeActionsProps = {
  id: string;
  title: string;
};

export function ResumeActions({ id, title }: ResumeActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<"duplicate" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDuplicate() {
    setPending("duplicate");
    setError(null);
    const result = await duplicateResume(id);
    if (result?.error) {
      setError(result.error);
      setPending(null);
    }
  }

  async function handleDelete() {
    setPending("delete");
    setError(null);
    const result = await deleteResume(id);
    if (result?.error) {
      setError(result.error);
      setPending(null);
      return;
    }
    setOpen(false);
    setPending(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/resumes/${id}/edit`}
          className={buttonVariants({ size: "sm" })}
        >
          Edit
        </Link>
        <Link
          href={`/resumes/${id}/preview`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Preview
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDuplicate}
          disabled={pending !== null}
        >
          {pending === "duplicate" ? "Duplicating..." : "Duplicate"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={pending !== null}
        >
          Delete
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete “{title}”. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={pending === "delete"}
            >
              {pending === "delete" ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
