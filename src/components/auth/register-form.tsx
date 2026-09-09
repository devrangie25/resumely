"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { registerSchema } from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/client";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    if (!data.session) {
      setInfo("Check your email to confirm your account, then sign in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <SocialButtons />
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          or email
        </span>
        <Separator className="flex-1" />
      </div>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.fullName.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? null : <MailIcon />}
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
