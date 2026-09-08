import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";

export function AppHeader({ email }: { email?: string }) {
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
          {email ? (
            <p className="hidden text-sm text-muted-foreground sm:block">
              {email}
            </p>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
