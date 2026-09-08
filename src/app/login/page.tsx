import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in · Resumely",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      description="Continue to your resumes."
      footer={
        <>
          New to Resumely?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
