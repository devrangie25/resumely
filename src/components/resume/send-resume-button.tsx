"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  generateResumePdfBlob,
  safeResumeFilename,
} from "@/components/pdf/generate-resume-pdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResumeEmail } from "@/lib/resume/email";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

async function blobToBase64(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function SendResumeButton({
  resumeId,
  content,
  templateId,
  title,
}: {
  resumeId: string;
  content: ResumeContent;
  templateId: TemplateId;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setPending(true);
    setError(null);
    try {
      const blob = await generateResumePdfBlob({ content, templateId });
      const pdfBase64 = await blobToBase64(blob);
      const result = await sendResumeEmail({
        resumeId,
        to,
        title: safeResumeFilename(title),
        pdfBase64,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setTo("");
      toast.success("Resume sent");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Send to email
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send resume</DialogTitle>
            <DialogDescription>
              We’ll attach a PDF of this resume and email it to the address you
              enter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="resume-email-to">Recipient email</Label>
            <Input
              id="resume-email-to"
              type="email"
              autoComplete="email"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="hiring@company.com"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={pending || !to.trim()}>
              {pending ? "Sending..." : "Send PDF"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
