import { AppHeader } from "@/components/app-header";
import { CreateResumeButton } from "@/components/dashboard/create-resume-button";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard · Resumely",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, template_id, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader email={userData.user?.email} />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Your resumes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, edit, duplicate, or export whenever you need.
            </p>
          </div>
          <CreateResumeButton />
        </div>

        {resumes?.length ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {resumes.map((resume) => (
              <li key={resume.id}>
                <ResumeCard
                  id={resume.id}
                  title={resume.title}
                  templateId={resume.template_id}
                  updatedAt={resume.updated_at}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed p-10 text-center">
            <h2 className="font-heading text-lg font-medium">No resumes yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Start with a clean template, add your experience, and download a
              PDF when you are ready.
            </p>
            <div className="mx-auto mt-6 max-w-xs">
              <CreateResumeButton label="Create your first resume" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
