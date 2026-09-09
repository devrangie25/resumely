import { parsePublicStats } from "@/lib/analytics/stats";
import { createClient } from "@/lib/supabase/server";

export async function PlatformStats() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_stats");
  const stats = parsePublicStats(data);
  const items = [
    { label: "People signed up", value: stats.users },
    { label: "Resumes created", value: stats.resumes },
    { label: "PDFs downloaded", value: stats.downloads },
    { label: "Resumes emailed", value: stats.emails_sent },
  ];

  return (
    <section className="border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Real usage
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
          Built and used by people applying right now.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.label} className="rounded-xl border bg-background p-5">
              <p className="font-heading text-3xl font-semibold tabular-nums">
                {item.value.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
