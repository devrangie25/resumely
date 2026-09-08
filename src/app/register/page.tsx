import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account · Resumely",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Build a professional resume in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
