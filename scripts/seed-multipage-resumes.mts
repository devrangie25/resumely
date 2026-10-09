import { readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

import { moreMultipageSampleResumes } from "../src/lib/resume/multipage-samples-more";
import { multipageSampleResumes as originalSampleResumes } from "../src/lib/resume/multipage-samples";

const multipageSampleResumes = [
  ...originalSampleResumes,
  ...moreMultipageSampleResumes,
];

function loadEnv(path: string) {
  const values: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    values[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return values;
}

const env = loadEnv(".env.local");
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
  email: env.NEXT_PUBLIC_DEV_LOGIN_EMAIL,
  password: env.NEXT_PUBLIC_DEV_LOGIN_PASSWORD,
});

if (authError || !auth.user) {
  console.error(authError?.message ?? "Sign-in failed.");
  process.exit(1);
}

const names = [
  ...new Set(
    multipageSampleResumes.map((sample) => sample.content.personal.fullName),
  ),
];

for (const name of names) {
  const { error: deleteError } = await supabase
    .from("resumes")
    .delete()
    .eq("user_id", auth.user.id)
    .like("title", `${name}%`);

  if (deleteError) {
    console.error(deleteError.message);
    process.exit(1);
  }
}

const { data, error } = await supabase
  .from("resumes")
  .insert(
    multipageSampleResumes.map((sample) => ({
      user_id: auth.user.id,
      title: sample.title,
      template_id: sample.templateId,
      content: sample.content,
    })),
  )
  .select("id, title, template_id");

if (error || !data) {
  console.error(error?.message ?? "Insert failed.");
  process.exit(1);
}

for (const row of data) {
  console.log(`${row.id}\t${row.template_id}\t${row.title}`);
}
