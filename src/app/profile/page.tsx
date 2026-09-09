import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { CredentialsForm } from "@/components/profile/credentials-form";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProfile } from "@/lib/profile/actions";

export const metadata = {
  title: "Profile · Resumely",
};

export default async function ProfilePage() {
  const { profile, email } = await getProfile();

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader email={email} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-8"
      >
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Dashboard
              </Link>{" "}
              / Profile
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Your profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Save your resume details once — personal info, summary, experience,
              education, and more. Choose to use them when you create a new
              resume.
            </p>
          </div>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Back
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume details</CardTitle>
              <CardDescription>
                The same fields as the resume editor. They can be applied when
                you create a new resume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditor profile={profile} authEmail={email} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account credentials</CardTitle>
              <CardDescription>
                View your sign-in email and update your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CredentialsForm email={email} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
