"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";

import { trackResumeEvent } from "@/lib/analytics/events";
import { createClient } from "@/lib/supabase/server";

const sendSchema = z.object({
  resumeId: z.string().uuid(),
  to: z.string().email("Enter a valid email address."),
  title: z.string().min(1),
  pdfBase64: z.string().min(1),
});

export async function sendResumeEmail(input: {
  resumeId: string;
  to: string;
  title: string;
  pdfBase64: string;
}) {
  const parsed = sendSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email details." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      error:
        "Email sending is not configured yet. Add RESEND_API_KEY to send resumes.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub as string;
  const { data: resume } = await supabase
    .from("resumes")
    .select("id, title")
    .eq("id", parsed.data.resumeId)
    .eq("user_id", userId)
    .single();

  if (!resume) {
    return { error: "Resume not found." };
  }

  const filename = `${parsed.data.title.trim().replace(/[^\w\- ]+/g, "") || "resume"}.pdf`;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Resumely <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from,
      to: parsed.data.to,
      subject: `${resume.title} — resume from Resumely`,
      html: `<p>A resume is attached as a PDF.</p>`,
      attachments: [
        {
          filename,
          content: Buffer.from(parsed.data.pdfBase64, "base64"),
        },
      ],
    });

    if (sendError) {
      return { error: sendError.message };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to send email.",
    };
  }

  await trackResumeEvent(supabase, {
    userId,
    type: "emailed",
    resumeId: resume.id,
    metadata: { to: parsed.data.to },
  });

  return { error: null };
}
