import type { ResumeContent } from "@/lib/resume/schema";

export function joinNonEmpty(values: Array<string | undefined>, separator = " · ") {
  return values.map((value) => value?.trim()).filter(Boolean).join(separator);
}

export function dateRange(
  startDate: string,
  endDate: string,
  current?: boolean,
) {
  const start = startDate.trim();
  const end = current ? "Present" : endDate.trim();
  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

export function contactItems(content: ResumeContent) {
  const { personal } = content;
  return [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
    personal.github,
  ].filter((item) => item.trim());
}

export function BulletList({ items }: { items: string[] }) {
  const bullets = items.filter((item) => item.trim());
  if (!bullets.length) return null;

  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {bullets.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
