"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { AccentColorPanel } from "@/components/editor/accent-color-panel";
import {
  Field,
  ResumeContentSections,
} from "@/components/editor/resume-content-sections";
import { PhotoUpload } from "@/components/editor/photo-upload";
import { TemplateCarousel } from "@/components/editor/template-carousel";
import { DownloadPdfButton } from "@/components/pdf/download-pdf-button";
import { PagedPreview } from "@/components/resume/paged-preview";
import { SendResumeButton } from "@/components/resume/send-resume-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { updateResume } from "@/lib/resume/actions";
import { parseResumeContent } from "@/lib/resume/defaults";
import {
  FAMILY_LABELS,
  TEMPLATE_FAMILIES,
  getTemplateFamily,
  getTemplateVariant,
  isTemplateId,
  type ResumeContent,
  type SectionId,
  type TemplateFamily,
  type TemplateId,
} from "@/lib/resume/schema";
import type { Json } from "@/lib/supabase/database.types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function ResumeEditor({
  resumeId,
  initialTitle,
  initialTemplateId,
  initialContent,
}: {
  resumeId: string;
  initialTitle: string;
  initialTemplateId: string;
  initialContent: Json;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [templateId, setTemplateId] = useState<TemplateId>(
    isTemplateId(initialTemplateId) ? initialTemplateId : "classic",
  );
  const [content, setContent] = useState<ResumeContent>(() =>
    parseResumeContent(initialContent),
  );
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [browsingFamily, setBrowsingFamily] = useState<TemplateFamily | null>(
    null,
  );
  const skipFirstSave = useRef(true);
  const family = getTemplateFamily(templateId);
  const variant = getTemplateVariant(templateId);

  const snapshot = useMemo(
    () => JSON.stringify({ title, templateId, content }),
    [title, templateId, content],
  );

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }

    const timeout = window.setTimeout(async () => {
      setStatus("saving");
      const result = await updateResume(resumeId, {
        title,
        templateId,
        content,
      });
      if (result.error) {
        setError(result.error);
        setStatus("error");
        return;
      }
      setError(null);
      setStatus("saved");
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [snapshot, resumeId, title, templateId, content]);

  function updatePersonal<K extends keyof ResumeContent["personal"]>(
    key: K,
    value: ResumeContent["personal"][K],
  ) {
    setContent((current) => ({
      ...current,
      personal: { ...current.personal, [key]: value },
    }));
  }

  function toggleSection(section: SectionId, visible: boolean) {
    setContent((current) => ({
      ...current,
      sectionVisibility: { ...current.sectionVisibility, [section]: visible },
    }));
  }

  function selectFamily(nextFamily: TemplateFamily) {
    setBrowsingFamily(nextFamily);
  }

  function selectVariant(nextTemplateId: TemplateId) {
    setTemplateId(nextTemplateId);
    setBrowsingFamily(null);
  }

  const preview = browsingFamily ? (
    <TemplateCarousel
      family={browsingFamily}
      content={content}
      onSelect={selectVariant}
    />
  ) : (
    <div className="grid justify-items-center gap-3">
      <PagedPreview content={content} templateId={templateId} fitToWidth />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setBrowsingFamily(family)}
      >
        Browse {FAMILY_LABELS[family]} designs
      </Button>
    </div>
  );
  const mobilePreview = browsingFamily ? (
    <TemplateCarousel
      family={browsingFamily}
      content={content}
      onSelect={selectVariant}
    />
  ) : (
    <PagedPreview
      content={content}
      templateId={templateId}
      fitToWidth
      showPageLabel
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {status === "saving"
              ? "Saving..."
              : status === "saved"
                ? "Saved"
                : status === "error"
                  ? error ?? "Save failed"
                  : "All changes save automatically"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setPreviewOpen(true)}
              >
                Preview
              </Button>
              <SheetContent
                side="bottom"
                className="h-[92vh] max-h-[92vh] gap-0 overflow-hidden p-0"
              >
                <SheetHeader className="border-b">
                  <SheetTitle>Resume preview</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 space-y-4 overflow-auto px-3 py-4">
                  <AccentColorPanel
                    value={content.theme?.primary ?? ""}
                    templateId={templateId}
                    onChange={(primary) =>
                      setContent((current) => ({
                        ...current,
                        theme: { primary },
                      }))
                    }
                  />
                  {mobilePreview}
                </div>
              </SheetContent>
            </Sheet>
            <Link
              href={`/resumes/${resumeId}/preview`}
              className={buttonVariants({ variant: "outline" })}
            >
              Full preview
            </Link>
            <SendResumeButton
              resumeId={resumeId}
              content={content}
              templateId={templateId}
              title={title}
            />
            <DownloadPdfButton
              resumeId={resumeId}
              content={content}
              templateId={templateId}
              title={title}
            />
          </div>
        </div>

        <div className="grid items-start gap-x-3 gap-y-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="resume-title">Resume title</Label>
            <Input
              id="resume-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="resume-template">Template</Label>
            <Select
              value={browsingFamily ?? family}
              onValueChange={(value) => {
                if (
                  value &&
                  TEMPLATE_FAMILIES.includes(value as TemplateFamily)
                ) {
                  selectFamily(value as TemplateFamily);
                }
              }}
            >
              <SelectTrigger id="resume-template" className="h-8 w-full min-w-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_FAMILIES.map((id) => (
                  <SelectItem key={id} value={id}>
                    {FAMILY_LABELS[id]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            {!browsingFamily ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Using {variant.label}.
                </p>
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  className="h-auto px-0"
                  onClick={() => setBrowsingFamily(family)}
                >
                  Browse designs
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Slide through the designs, then choose one to lock it in.
              </p>
            )}
          </div>
        </div>

        <ResumeContentSections
          content={content}
          setContent={setContent}
          onToggleSection={toggleSection}
          defaultOpen={["personal", "summary", "experience"]}
          prepend={
            <AccordionItem value="personal">
              <AccordionTrigger>Personal information</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {family === "modern" || browsingFamily === "modern" ? (
                    <PhotoUpload
                      resumeId={resumeId}
                      photoUrl={content.personal.photoUrl}
                      onChange={(url) => updatePersonal("photoUrl", url)}
                    />
                  ) : null}
                  <Field label="Full name">
                    <Input
                      value={content.personal.fullName}
                      onChange={(event) =>
                        updatePersonal("fullName", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Headline">
                    <Input
                      value={content.personal.headline}
                      onChange={(event) =>
                        updatePersonal("headline", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={content.personal.email}
                      onChange={(event) =>
                        updatePersonal("email", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Phone">
                    <Input
                      value={content.personal.phone}
                      onChange={(event) =>
                        updatePersonal("phone", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={content.personal.location}
                      onChange={(event) =>
                        updatePersonal("location", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Website">
                    <Input
                      value={content.personal.website}
                      onChange={(event) =>
                        updatePersonal("website", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="LinkedIn">
                    <Input
                      value={content.personal.linkedin}
                      onChange={(event) =>
                        updatePersonal("linkedin", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="GitHub">
                    <Input
                      value={content.personal.github}
                      onChange={(event) =>
                        updatePersonal("github", event.target.value)
                      }
                    />
                  </Field>
                </div>
              </AccordionContent>
            </AccordionItem>
          }
        />
      </div>

      <div className="hidden space-y-4 overflow-auto rounded-xl bg-zinc-100 p-4 lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)] lg:self-start xl:p-6">
        <AccentColorPanel
          value={content.theme?.primary ?? ""}
          templateId={templateId}
          onChange={(primary) =>
            setContent((current) => ({
              ...current,
              theme: { primary },
            }))
          }
        />
        {preview}
      </div>
    </div>
  );
}
