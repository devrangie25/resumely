"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/lib/profile/actions";
import { changePasswordSchema } from "@/lib/profile/schemas";

type PasswordValues = z.infer<typeof changePasswordSchema>;

export function CredentialsForm({ email }: { email: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: PasswordValues) {
    setFormError(null);
    setSaved(false);
    const result = await updatePassword(values);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    form.reset();
    setSaved(true);
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} readOnly disabled />
        <p className="text-xs text-muted-foreground">
          Your sign-in email cannot be changed here.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <Label htmlFor="password">New password</Label>
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
        <div className="grid gap-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        {saved ? (
          <p className="text-sm text-muted-foreground">Password updated.</p>
        ) : null}
        <div>
          <Button type="submit" variant="outline" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
