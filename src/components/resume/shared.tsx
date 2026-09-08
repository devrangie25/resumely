import {
  Code2Icon,
  GlobeIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  type LucideIcon,
} from "lucide-react";

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

export type ContactKind =
  | "email"
  | "phone"
  | "location"
  | "website"
  | "linkedin"
  | "github";

export type ContactEntry = {
  kind: ContactKind;
  value: string;
  icon: LucideIcon;
};

const CONTACT_FIELDS: Array<{
  kind: ContactKind;
  icon: LucideIcon;
  key: keyof ResumeContent["personal"];
}> = [
  { kind: "email", icon: MailIcon, key: "email" },
  { kind: "phone", icon: PhoneIcon, key: "phone" },
  { kind: "location", icon: MapPinIcon, key: "location" },
  { kind: "website", icon: GlobeIcon, key: "website" },
  { kind: "linkedin", icon: LinkIcon, key: "linkedin" },
  { kind: "github", icon: Code2Icon, key: "github" },
];

export function contactEntries(content: ResumeContent): ContactEntry[] {
  return CONTACT_FIELDS.flatMap((field) => {
    const value = content.personal[field.key]?.trim();
    if (!value || field.key === "fullName" || field.key === "headline" || field.key === "photoUrl") {
      return [];
    }
    return [{ kind: field.kind, value, icon: field.icon }];
  });
}

export function contactItems(content: ResumeContent) {
  return contactEntries(content).map((item) => item.value);
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

export function SkillPills({
  names,
  color,
}: {
  names: string[];
  color: string;
}) {
  const skills = names.filter((name) => name.trim());
  if (!skills.length) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {skills.map((name) => (
        <li
          key={name}
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{
            backgroundColor: `${color}18`,
            color,
          }}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
