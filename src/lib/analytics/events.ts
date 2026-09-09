import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/lib/supabase/database.types";

export const RESUME_EVENT_TYPES = [
  "created",
  "duplicated",
  "deleted",
  "downloaded",
  "emailed",
] as const;

export type ResumeEventType = (typeof RESUME_EVENT_TYPES)[number];

export async function trackResumeEvent(
  supabase: SupabaseClient<Database>,
  input: {
    userId: string;
    type: ResumeEventType;
    resumeId?: string | null;
    metadata?: Record<string, string>;
  },
) {
  const { error } = await supabase.from("resume_events").insert({
    user_id: input.userId,
    resume_id: input.resumeId ?? null,
    event_type: input.type,
    metadata: (input.metadata ?? {}) as Json,
  });

  if (error) {
    console.error("Failed to track resume event", error.message);
  }
}
