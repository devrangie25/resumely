import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AppHeader } from "@/components/app-header";
import { isSuperAdmin, isSuperadminEmail } from "@/lib/admin/auth";
import { parseAdminDashboard } from "@/lib/analytics/stats";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin · Resumely",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const { data: userData } = await supabase.auth.getUser();

  if (!isSuperAdmin(claimsData?.claims)) {
    redirect("/dashboard");
  }

  const { data, error } = await supabase.rpc("admin_dashboard");
  const parsed = parseAdminDashboard(data);
  const dashboard = {
    ...parsed,
    users: parsed.users.map((user) => ({
      ...user,
      is_superadmin: user.is_superadmin || isSuperadminEmail(user.email),
    })),
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader email={userData.user?.email} />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Superadmin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            First-party usage across registered users, resumes, downloads, and
            email sends.
          </p>
          {error ? (
            <p className="mt-3 text-sm text-destructive">
              {error.message}. Sign out and sign back in if you just received
              admin access.
            </p>
          ) : null}
        </div>
        <AdminDashboard data={dashboard} />
      </main>
    </div>
  );
}
