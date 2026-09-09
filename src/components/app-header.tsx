import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { buttonVariants } from "@/components/ui/button";
import { isSuperAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export async function AppHeader({ email }: { email?: string }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const resolvedEmail =
    email ??
    (typeof data?.claims?.email === "string" ? data.claims.email : undefined);
  const showAdmin = isSuperAdmin(data?.claims);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="font-heading text-base font-semibold tracking-tight"
        >
          Resumely
        </Link>
        <div className="flex items-center gap-3">
          {showAdmin ? (
            <Link
              href="/admin"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Admin
            </Link>
          ) : null}
          {resolvedEmail ? (
            <p className="hidden text-sm text-muted-foreground sm:block">
              {resolvedEmail}
            </p>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
