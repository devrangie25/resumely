import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { DownloadPdfButton } from "@/components/pdf/download-pdf-button";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ScaledPreview } from "@/components/resume/scaled-preview";
import { buttonVariants } from "@/components/ui/button";
import { parseResumeContent } from "@/lib/resume/defaults";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/resume/schema";
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

  const templateId = TEMPLATE_IDS.includes(resume.template_id as TemplateId)
    ? (resume.template_id as TemplateId)
    : "classic";
  const content = parseResumeContent(resume.content);

  return (
    <div className="flex min-h-full flex-col bg-zinc-100">
      <AppHeader email={userData.user?.email} />
      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Dashboard
              </Link>{" "}
              / Preview
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {resume.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/resumes/${resume.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
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
        <div className="flex justify-center overflow-auto pb-10">
          <div className="lg:hidden">
            <ScaledPreview content={content} templateId={templateId} scale={0.62} />
          </div>
          <div className="hidden lg:block">
            <ResumePreview content={content} templateId={templateId} />
          </div>
        </div>
      </main>
    </div>
  );
}
