"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProfileResumeSections } from "@/lib/profile/content";
import { type ProfileRow } from "@/lib/profile/defaults";
import {
  changePasswordSchema,
  profileResumeSectionsSchema,
  profileSchema,
  type ChangePasswordValues,
  type ProfileFormValues,
} from "@/lib/profile/schemas";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub as string;
  const email =
    typeof data.claims.email === "string" ? data.claims.email : "";

  return { supabase, userId, email };
}

export async function getProfile() {
  const { supabase, userId, email } = await requireUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return { profile: null, email, error: error.message };
  }

  return { profile: data as ProfileRow, email, error: null };
}

export async function updateProfile(values: ProfileFormValues) {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile data." };
  }

  const sections = profileResumeSectionsSchema.parse({
    summary: parsed.data.summary,
    experience: parsed.data.experience,
    education: parsed.data.education,
    skills: parsed.data.skills,
    projects: parsed.data.projects,
    certifications: parsed.data.certifications,
    languages: parsed.data.languages,
    awards: parsed.data.awards,
    references: parsed.data.references,
  }) satisfies ProfileResumeSections;

  const { supabase, userId } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName.trim(),
      headline: parsed.data.headline.trim(),
      email: parsed.data.email.trim(),
      phone: parsed.data.phone.trim(),
      location: parsed.data.location.trim(),
      website: parsed.data.website.trim(),
      linkedin: parsed.data.linkedin.trim(),
      github: parsed.data.github.trim(),
      resume_content: sections as unknown as Json,
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { error: null };
}

export async function updatePassword(values: ChangePasswordValues) {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid password data." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
