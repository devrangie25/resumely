import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { ResumeEditor } from "@/components/editor/resume-editor";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit resume · Resumely",
};

export default async function EditResumePage({
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

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader email={userData.user?.email} />
      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Dashboard
              </Link>{" "}
              / Edit
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Edit resume
            </h1>
          </div>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Back
          </Link>
        </div>
        <ResumeEditor
          resumeId={resume.id}
          initialTitle={resume.title}
          initialTemplateId={resume.template_id}
          initialContent={resume.content}
        />
      </main>
    </div>
  );
}
