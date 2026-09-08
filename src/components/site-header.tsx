import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-base font-semibold tracking-tight">
          Resumely
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "sm" })}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Create resume
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
