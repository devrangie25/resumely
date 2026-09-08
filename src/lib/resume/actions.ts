"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emptyResumeContent, parseResumeContent } from "@/lib/resume/defaults";
import {
  resumeContentSchema,
  TEMPLATE_IDS,
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

export async function createResume() {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title: "Untitled Resume",
      template_id: "classic",
      content: emptyResumeContent() as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Unable to create resume." };
  }

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

  if (payload.templateId && TEMPLATE_IDS.includes(payload.templateId)) {
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

  revalidatePath("/dashboard");
  return { error: null };
}
