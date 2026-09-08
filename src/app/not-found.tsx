import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-16 text-center">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That page does not exist or you do not have access to it.
      </p>
      <Link href="/" className={`${buttonVariants()} mt-6 self-center`}>
        Back home
      </Link>
    </main>
  );
}
