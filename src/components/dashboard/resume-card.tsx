"use client";

import { formatDistanceToNow } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteResume, duplicateResume } from "@/lib/resume/actions";
import { getTemplateDisplayLabel } from "@/lib/resume/schema";

type ResumeCardProps = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
};

export function ResumeCard({
  id,
  title,
  templateId,
  updatedAt,
}: ResumeCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<"duplicate" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const templateLabel = getTemplateDisplayLabel(templateId);

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
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription>
          Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{templateLabel}</Badge>
        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
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
      </CardFooter>

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
    </Card>
  );
}
