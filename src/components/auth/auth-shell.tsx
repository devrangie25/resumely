import Link from "next/link";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-8 font-heading text-lg font-semibold">
        Resumely
      </Link>
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
    </main>
  );
}
