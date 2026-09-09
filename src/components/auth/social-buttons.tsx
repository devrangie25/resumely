"use client";

import { useState } from "react";

import {
  FacebookIcon,
  GitHubIcon,
  GoogleIcon,
} from "@/components/auth/provider-icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const providers = [
  { id: "google" as const, label: "Continue with Google", Icon: GoogleIcon },
  { id: "github" as const, label: "Continue with GitHub", Icon: GitHubIcon },
  { id: "facebook" as const, label: "Continue with Facebook", Icon: FacebookIcon },
];

export function SocialButtons() {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: (typeof providers)[number]["id"]) {
    setError(null);
    setPending(provider);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });

    if (oauthError) {
      setError(
        `${oauthError.message} Add the ${provider} client ID in the Supabase Auth dashboard to enable this provider.`,
      );
      setPending(null);
    }
  }

  return (
    <div className="grid gap-2">
      {providers.map((provider) => {
        const Icon = provider.Icon;
        return (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending !== null}
            onClick={() => signIn(provider.id)}
          >
            {pending === provider.id ? null : <Icon className="size-4" />}
            {pending === provider.id ? "Redirecting..." : provider.label}
          </Button>
        );
      })}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
