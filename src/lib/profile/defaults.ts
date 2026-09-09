import type { PersonalInfo } from "@/lib/resume/schema";
import type { Database } from "@/lib/supabase/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** Resume personal fields stored on profile (photo stays per-resume). */
export const PROFILE_PERSONAL_KEYS = [
  "fullName",
  "headline",
  "email",
  "phone",
  "location",
  "website",
  "linkedin",
  "github",
] as const satisfies readonly (keyof PersonalInfo)[];

export function emptyProfileFormValues() {
  return {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  };
}

export function profileRowToFormValues(
  profile: ProfileRow | null,
  authEmail = "",
) {
  if (!profile) {
    return { ...emptyProfileFormValues(), email: authEmail };
  }

  return {
    fullName: profile.full_name ?? "",
    headline: profile.headline ?? "",
    email: profile.email?.trim() || authEmail,
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    website: profile.website ?? "",
    linkedin: profile.linkedin ?? "",
    github: profile.github ?? "",
  };
}

export function profileToPersonalInfo(
  profile: ProfileRow | null,
  authEmail = "",
): Partial<PersonalInfo> {
  const email = profile?.email?.trim() || authEmail;

  return {
    fullName: profile?.full_name ?? "",
    headline: profile?.headline ?? "",
    email,
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    website: profile?.website ?? "",
    linkedin: profile?.linkedin ?? "",
    github: profile?.github ?? "",
  };
}

export function mergeProfileIntoPersonal(
  personal: PersonalInfo,
  profile: ProfileRow | null,
  authEmail = "",
): PersonalInfo {
  const fromProfile = profileToPersonalInfo(profile, authEmail);
  const merged = { ...personal };

  for (const key of PROFILE_PERSONAL_KEYS) {
    const value = fromProfile[key]?.trim();
    if (value) {
      merged[key] = value;
    }
  }

  return merged;
}
