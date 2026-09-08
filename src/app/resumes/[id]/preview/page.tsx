import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { DownloadPdfButton } from "@/components/pdf/download-pdf-button";
import { PreviewStage } from "@/components/resume/preview-stage";
import { buttonVariants } from "@/components/ui/button";
import { parseResumeContent } from "@/lib/resume/defaults";
import { isTemplateId, type TemplateId } from "@/lib/resume/schema";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Preview resume · Resumely",
};

export default async function PreviewResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: resume } = await supabase
    .from("resumes")
    .select("id, title, template_id, content")
    .eq("id", id)
    .single();

  if (!resume) {
    notFound();
  }

  const templateId: TemplateId = isTemplateId(resume.template_id)
    ? resume.template_id
    : "classic";
  const content = parseResumeContent(resume.content);

  return (
    <div className="flex min-h-full flex-col bg-zinc-100">
      <AppHeader email={userData.user?.email} />
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Dashboard
              </Link>{" "}
              / Preview
            </p>
            <h1 className="font-heading truncate text-lg font-semibold tracking-tight sm:text-2xl">
              {resume.title}
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <Link
              href={`/resumes/${resume.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Edit
            </Link>
            <DownloadPdfButton
              content={content}
              templateId={templateId}
              title={resume.title}
            />
          </div>
        </div>
      </div>
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 px-3 py-4 sm:px-4 sm:py-6"
      >
        <PreviewStage content={content} templateId={templateId} />
      </main>
    </div>
  );
}
