"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field, ResumeContentSections } from "@/components/editor/resume-content-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileToEditorContent } from "@/lib/profile/content";
import type { ProfileRow } from "@/lib/profile/defaults";
import { updateProfile } from "@/lib/profile/actions";
import type { ProfileFormValues } from "@/lib/profile/schemas";
import type { ResumeContent } from "@/lib/resume/schema";

export function ProfileEditor({
  profile,
  authEmail,
}: {
  profile: ProfileRow | null;
  authEmail: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState<ResumeContent>(() =>
    profileToEditorContent(profile, authEmail),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  function updatePersonal<K extends keyof ResumeContent["personal"]>(
    key: K,
    value: ResumeContent["personal"][K],
  ) {
    setContent((current) => ({
      ...current,
      personal: { ...current.personal, [key]: value },
    }));
  }

  async function onSubmit() {
    setFormError(null);
    setSaved(false);
    setPending(true);

    const values: ProfileFormValues = {
      fullName: content.personal.fullName,
      headline: content.personal.headline,
      email: content.personal.email,
      phone: content.personal.phone,
      location: content.personal.location,
      website: content.personal.website,
      linkedin: content.personal.linkedin,
      github: content.personal.github,
      summary: content.summary,
      experience: content.experience,
      education: content.education,
      skills: content.skills,
      projects: content.projects,
      certifications: content.certifications,
      languages: content.languages,
      awards: content.awards,
      references: content.references,
    };

    const result = await updateProfile(values);
    setPending(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            value={content.personal.fullName}
            onChange={(event) => updatePersonal("fullName", event.target.value)}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="headline">Job title or headline</Label>
          <Input
            id="headline"
            placeholder="e.g. Senior Software Engineer"
            value={content.personal.headline}
            onChange={(event) => updatePersonal("headline", event.target.value)}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={content.personal.email}
            onChange={(event) => updatePersonal("email", event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Contact email for your resumes. This can differ from your sign-in
            email.
          </p>
        </div>
        <Field label="Phone">
          <Input
            type="tel"
            autoComplete="tel"
            value={content.personal.phone}
            onChange={(event) => updatePersonal("phone", event.target.value)}
          />
        </Field>
        <Field label="Location">
          <Input
            placeholder="e.g. San Francisco, CA"
            autoComplete="address-level2"
            value={content.personal.location}
            onChange={(event) => updatePersonal("location", event.target.value)}
          />
        </Field>
        <Field label="Website">
          <Input
            type="url"
            placeholder="https://"
            autoComplete="url"
            value={content.personal.website}
            onChange={(event) => updatePersonal("website", event.target.value)}
          />
        </Field>
        <Field label="LinkedIn">
          <Input
            placeholder="https://linkedin.com/in/..."
            value={content.personal.linkedin}
            onChange={(event) => updatePersonal("linkedin", event.target.value)}
          />
        </Field>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            placeholder="https://github.com/..."
            value={content.personal.github}
            onChange={(event) => updatePersonal("github", event.target.value)}
          />
        </div>
      </div>

      <ResumeContentSections
        content={content}
        setContent={setContent}
        showVisibility={false}
        defaultOpen={["summary", "experience", "education"]}
      />

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {saved ? (
        <p className="text-sm text-muted-foreground">Profile saved.</p>
      ) : null}
      <div>
        <Button type="button" onClick={onSubmit} disabled={pending}>
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
