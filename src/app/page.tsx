import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { ScaledPreview } from "@/components/resume/scaled-preview";
import { buttonVariants } from "@/components/ui/button";
import { sampleResumeContent } from "@/lib/resume/sample";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Free resume builder
            </p>
            <h1 className="mt-3 max-w-xl font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              A professional resume without the design work.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Create an account, pick a template, fill in your experience, and
              download a clean PDF. Come back later to edit or duplicate it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className={buttonVariants({ size: "lg" })}>
                Create a free account
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="flex justify-center overflow-hidden rounded-2xl bg-zinc-100 p-4 shadow-inner">
            <ScaledPreview
              content={sampleResumeContent}
              templateId="classic"
              scale={0.48}
            />
          </div>
        </section>

        <section className="border-t bg-zinc-50">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
            {[
              {
                title: "Guided editing",
                body: "Fill in personal details, experience, education, skills, and the rest. Empty sections stay hidden.",
              },
              {
                title: "Three templates",
                body: "Classic, Modern, and Minimal layouts that stay readable for recruiters and applicant tracking systems.",
              },
              {
                title: "Save and export",
                body: "Your resumes stay in your account. Preview on screen and download a text-based PDF when you apply.",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border bg-background p-5"
              >
                <h2 className="font-heading text-base font-medium">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Resumely — free resume generator</p>
          <p>Built for job seekers, graduates, and career changers.</p>
        </div>
      </footer>
    </div>
  );
}
