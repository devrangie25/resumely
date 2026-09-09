"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { trackResumeEvent } from "@/lib/analytics/events";
import { applyProfileToNewResume } from "@/lib/profile/content";
import type { ProfileRow } from "@/lib/profile/defaults";
import { emptyResumeContent, parseResumeContent } from "@/lib/resume/defaults";
import {
  isTemplateId,
  resumeContentSchema,
  type ResumeContent,
  type TemplateId,
} from "@/lib/resume/schema";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  return { supabase, userId: data.claims.sub as string };
}

export async function createResume({ useProfile = false } = {}) {
  const { supabase, userId } = await requireUserId();

  let content = emptyResumeContent();

  if (useProfile) {
    const [{ data: profile }, { data: userData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.auth.getUser(),
    ]);

    content = applyProfileToNewResume(
      profile as ProfileRow | null,
      userData.user?.email ?? "",
    );
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title: "Untitled Resume",
      template_id: "classic",
      content: content as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Unable to create resume." };
  }

  await trackResumeEvent(supabase, {
    userId,
    type: "created",
    resumeId: data.id,
  });

  revalidatePath("/dashboard");
  redirect(`/resumes/${data.id}/edit`);
}

export async function updateResume(
  id: string,
  payload: {
    title?: string;
    templateId?: TemplateId;
    content?: ResumeContent;
  },
) {
  const { supabase, userId } = await requireUserId();

  const updates: {
    title?: string;
    template_id?: TemplateId;
    content?: Json;
  } = {};

  if (payload.title !== undefined) {
    updates.title = payload.title.trim() || "Untitled Resume";
  }

  if (payload.templateId && isTemplateId(payload.templateId)) {
    updates.template_id = payload.templateId;
  }

  if (payload.content) {
    const parsed = resumeContentSchema.safeParse(payload.content);
    updates.content = (parsed.success
      ? parsed.data
      : parseResumeContent(payload.content)) as unknown as Json;
  }

  const { error } = await supabase
    .from("resumes")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/resumes/${id}/edit`);
  revalidatePath(`/resumes/${id}/preview`);
  return { error: null };
}

export async function duplicateResume(id: string) {
  const { supabase, userId } = await requireUserId();
  const { data: source, error: sourceError } = await supabase
    .from("resumes")
    .select("title, template_id, content")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (sourceError || !source) {
    return { error: sourceError?.message ?? "Resume not found." };
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title: `Copy of ${source.title}`,
      template_id: source.template_id,
      content: parseResumeContent(source.content) as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Unable to duplicate resume." };
  }

  await trackResumeEvent(supabase, {
    userId,
    type: "duplicated",
    resumeId: data.id,
    metadata: { sourceResumeId: id },
  });

  revalidatePath("/dashboard");
  redirect(`/resumes/${data.id}/edit`);
}

export async function deleteResume(id: string) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  await trackResumeEvent(supabase, {
    userId,
    type: "deleted",
    metadata: { resumeId: id },
  });

  revalidatePath("/dashboard");
  return { error: null };
}

export async function trackResumeDownload(id: string) {
  const { supabase, userId } = await requireUserId();
  const { data } = await supabase
    .from("resumes")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (!data) {
    return { error: "Resume not found." };
  }

  await trackResumeEvent(supabase, {
    userId,
    type: "downloaded",
    resumeId: id,
  });

  return { error: null };
}
