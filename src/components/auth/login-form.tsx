"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DEV_LOGIN_EMAIL, DEV_LOGIN_PASSWORD, isDevLoginEnabled } from "@/lib/auth/constants";
import { loginSchema } from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/client";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [formError, setFormError] = useState<string | null>(null);
  const [devPending, setDevPending] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function onDevLogin() {
    setFormError(null);
    setDevPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: DEV_LOGIN_EMAIL,
      password: DEV_LOGIN_PASSWORD,
    });
    setDevPending(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      {isDevLoginEnabled ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={onDevLogin}
          disabled={devPending || form.formState.isSubmitting}
        >
          {devPending ? null : <TerminalIcon />}
          {devPending ? "Signing in..." : "Continue as Dev"}
        </Button>
      ) : null}

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
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? null : <MailIcon />}
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
