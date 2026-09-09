export const SUPERADMIN_ROLE = "superadmin";

type AppMetadata = {
  role?: string;
};

type AuthClaims = {
  email?: string;
  app_metadata?: AppMetadata;
};

export function getSuperadminEmails() {
  return (process.env.SUPERADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperadminEmail(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  return Boolean(normalizedEmail && getSuperadminEmails().includes(normalizedEmail));
}

export function isSuperAdmin(claims: unknown) {
  if (!claims || typeof claims !== "object") {
    return false;
  }

  const { email, app_metadata } = claims as AuthClaims;
  if (app_metadata?.role === SUPERADMIN_ROLE) {
    return true;
  }

  return isSuperadminEmail(email);
}
