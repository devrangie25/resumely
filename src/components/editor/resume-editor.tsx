"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { DownloadPdfButton } from "@/components/pdf/download-pdf-button";
import { ScaledPreview } from "@/components/resume/scaled-preview";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { updateResume } from "@/lib/resume/actions";
import { createId, parseResumeContent } from "@/lib/resume/defaults";
import {
  LANGUAGE_LEVELS,
  SECTION_LABELS,
  TEMPLATE_IDS,
  TEMPLATE_LABELS,
  type ResumeContent,
  type SectionId,
  type TemplateId,
} from "@/lib/resume/schema";
import type { Json } from "@/lib/supabase/database.types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  const [removed] = next.splice(index, 1);
  next.splice(target, 0, removed);
  return next;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ItemActions({
  onMoveUp,
  onMoveDown,
  onRemove,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disableUp: boolean;
  disableDown: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="xs" onClick={onMoveUp} disabled={disableUp}>
        Up
      </Button>
      <Button type="button" variant="outline" size="xs" onClick={onMoveDown} disabled={disableDown}>
        Down
      </Button>
      <Button type="button" variant="destructive" size="xs" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}

export function ResumeEditor({
  resumeId,
  initialTitle,
  initialTemplateId,
  initialContent,
}: {
  resumeId: string;
  initialTitle: string;
  initialTemplateId: string;
  initialContent: Json;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [templateId, setTemplateId] = useState<TemplateId>(
    TEMPLATE_IDS.includes(initialTemplateId as TemplateId)
      ? (initialTemplateId as TemplateId)
      : "classic",
  );
  const [content, setContent] = useState<ResumeContent>(() =>
    parseResumeContent(initialContent),
  );
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const skipFirstSave = useRef(true);

  const snapshot = useMemo(
    () => JSON.stringify({ title, templateId, content }),
    [title, templateId, content],
  );

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }

    const timeout = window.setTimeout(async () => {
      setStatus("saving");
      const result = await updateResume(resumeId, {
        title,
        templateId,
        content,
      });
      if (result.error) {
        setError(result.error);
        setStatus("error");
        return;
      }
      setError(null);
      setStatus("saved");
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [snapshot, resumeId, title, templateId, content]);

  function updatePersonal<K extends keyof ResumeContent["personal"]>(
    key: K,
    value: ResumeContent["personal"][K],
  ) {
    setContent((current) => ({
      ...current,
      personal: { ...current.personal, [key]: value },
    }));
  }

  function toggleSection(section: SectionId, visible: boolean) {
    setContent((current) => ({
      ...current,
      sectionVisibility: { ...current.sectionVisibility, [section]: visible },
    }));
  }

  const preview = (
    <ScaledPreview content={content} templateId={templateId} scale={0.72} />
  );
  const mobilePreview = (
    <ScaledPreview content={content} templateId={templateId} scale={0.55} />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {status === "saving"
              ? "Saving..."
              : status === "saved"
                ? "Saved"
                : status === "error"
                  ? error ?? "Save failed"
                  : "All changes save automatically"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setPreviewOpen(true)}
              >
                Preview
              </Button>
              <SheetContent side="bottom" className="h-[90vh] overflow-auto">
                <SheetHeader>
                  <SheetTitle>Resume preview</SheetTitle>
                </SheetHeader>
                <div className="flex justify-center overflow-auto p-4">
                  {mobilePreview}
                </div>
              </SheetContent>
            </Sheet>
            <Link
              href={`/resumes/${resumeId}/preview`}
              className={buttonVariants({ variant: "outline" })}
            >
              Full preview
            </Link>
            <DownloadPdfButton
              content={content}
              templateId={templateId}
              title={title}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Resume title">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field label="Template">
            <Select
              value={templateId}
              onValueChange={(value) => {
                if (value && TEMPLATE_IDS.includes(value as TemplateId)) {
                  setTemplateId(value as TemplateId);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_IDS.map((id) => (
                  <SelectItem key={id} value={id}>
                    {TEMPLATE_LABELS[id]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Accordion multiple defaultValue={["personal", "summary", "experience"]}>
          <AccordionItem value="personal">
            <AccordionTrigger>Personal information</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name">
                  <Input
                    value={content.personal.fullName}
                    onChange={(event) =>
                      updatePersonal("fullName", event.target.value)
                    }
                  />
                </Field>
                <Field label="Headline">
                  <Input
                    value={content.personal.headline}
                    onChange={(event) =>
                      updatePersonal("headline", event.target.value)
                    }
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    value={content.personal.email}
                    onChange={(event) =>
                      updatePersonal("email", event.target.value)
                    }
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={content.personal.phone}
                    onChange={(event) =>
                      updatePersonal("phone", event.target.value)
                    }
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={content.personal.location}
                    onChange={(event) =>
                      updatePersonal("location", event.target.value)
                    }
                  />
                </Field>
                <Field label="Website">
                  <Input
                    value={content.personal.website}
                    onChange={(event) =>
                      updatePersonal("website", event.target.value)
                    }
                  />
                </Field>
                <Field label="LinkedIn">
                  <Input
                    value={content.personal.linkedin}
                    onChange={(event) =>
                      updatePersonal("linkedin", event.target.value)
                    }
                  />
                </Field>
                <Field label="GitHub">
                  <Input
                    value={content.personal.github}
                    onChange={(event) =>
                      updatePersonal("github", event.target.value)
                    }
                  />
                </Field>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary">
            <AccordionTrigger>Professional summary</AccordionTrigger>
            <AccordionContent>
              <SectionVisibility
                section="summary"
                checked={content.sectionVisibility.summary}
                onCheckedChange={(checked) => toggleSection("summary", checked)}
              />
              <Textarea
                rows={5}
                value={content.summary}
                onChange={(event) =>
                  setContent((current) => ({
                    ...current,
                    summary: event.target.value,
                  }))
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger>Work experience</AccordionTrigger>
            <AccordionContent>
              <SectionVisibility
                section="experience"
                checked={content.sectionVisibility.experience}
                onCheckedChange={(checked) =>
                  toggleSection("experience", checked)
                }
              />
              <div className="space-y-4">
                {content.experience.map((item, index) => (
                  <div key={item.id} className="grid gap-3 rounded-lg border p-3">
                    <Field label="Job title">
                      <Input
                        value={item.title}
                        onChange={(event) =>
                          setContent((current) => ({
                            ...current,
                            experience: current.experience.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, title: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Company">
                        <Input
                          value={item.company}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              experience: current.experience.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, company: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <Input
                          value={item.location}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              experience: current.experience.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, location: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Start date">
                        <Input
                          value={item.startDate}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              experience: current.experience.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, startDate: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="End date">
                        <Input
                          value={item.endDate}
                          disabled={item.current}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              experience: current.experience.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, endDate: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={item.current}
                        onCheckedChange={(checked) =>
                          setContent((current) => ({
                            ...current,
                            experience: current.experience.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, current: checked, endDate: checked ? "" : entry.endDate }
                                : entry,
                            ),
                          }))
                        }
                      />
                      Current role
                    </label>
                    <Field label="Highlights (one per line)">
                      <Textarea
                        rows={4}
                        value={item.bullets.join("\n")}
                        onChange={(event) =>
                          setContent((current) => ({
                            ...current,
                            experience: current.experience.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, bullets: event.target.value.split("\n") }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <ItemActions
                      disableUp={index === 0}
                      disableDown={index === content.experience.length - 1}
                      onMoveUp={() =>
                        setContent((current) => ({
                          ...current,
                          experience: moveItem(current.experience, index, -1),
                        }))
                      }
                      onMoveDown={() =>
                        setContent((current) => ({
                          ...current,
                          experience: moveItem(current.experience, index, 1),
                        }))
                      }
                      onRemove={() =>
                        setContent((current) => ({
                          ...current,
                          experience: current.experience.filter((entry) => entry.id !== item.id),
                        }))
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      experience: [
                        ...current.experience,
                        {
                          id: createId(),
                          company: "",
                          title: "",
                          location: "",
                          startDate: "",
                          endDate: "",
                          current: false,
                          bullets: [""],
                        },
                      ],
                    }))
                  }
                >
                  Add experience
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education">
            <AccordionTrigger>Education</AccordionTrigger>
            <AccordionContent>
              <SectionVisibility
                section="education"
                checked={content.sectionVisibility.education}
                onCheckedChange={(checked) => toggleSection("education", checked)}
              />
              <div className="space-y-4">
                {content.education.map((item, index) => (
                  <div key={item.id} className="grid gap-3 rounded-lg border p-3">
                    <Field label="School">
                      <Input
                        value={item.school}
                        onChange={(event) =>
                          setContent((current) => ({
                            ...current,
                            education: current.education.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, school: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Degree">
                        <Input
                          value={item.degree}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              education: current.education.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, degree: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Field of study">
                        <Input
                          value={item.field}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              education: current.education.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, field: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <Input
                          value={item.location}
                          onChange={(event) =>
                            setContent((current) => ({
                              ...current,
                              education: current.education.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, location: event.target.value }
                                  : entry,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Dates">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Start"
                            value={item.startDate}
                            onChange={(event) =>
                              setContent((current) => ({
                                ...current,
                                education: current.education.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, startDate: event.target.value }
                                    : entry,
                                ),
                              }))
                            }
                          />
                          <Input
                            placeholder="End"
                            value={item.endDate}
                            onChange={(event) =>
                              setContent((current) => ({
                                ...current,
                                education: current.education.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, endDate: event.target.value }
                                    : entry,
                                ),
                              }))
                            }
                          />
                        </div>
                      </Field>
                    </div>
                    <Field label="Details">
                      <Textarea
                        value={item.details}
                        onChange={(event) =>
                          setContent((current) => ({
                            ...current,
                            education: current.education.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, details: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <ItemActions
                      disableUp={index === 0}
                      disableDown={index === content.education.length - 1}
                      onMoveUp={() =>
                        setContent((current) => ({
                          ...current,
                          education: moveItem(current.education, index, -1),
                        }))
                      }
                      onMoveDown={() =>
                        setContent((current) => ({
                          ...current,
                          education: moveItem(current.education, index, 1),
                        }))
                      }
                      onRemove={() =>
                        setContent((current) => ({
                          ...current,
                          education: current.education.filter((entry) => entry.id !== item.id),
                        }))
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      education: [
                        ...current.education,
                        {
                          id: createId(),
                          school: "",
                          degree: "",
                          field: "",
                          location: "",
                          startDate: "",
                          endDate: "",
                          details: "",
                        },
                      ],
                    }))
                  }
                >
                  Add education
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <SimpleListSection
            section="skills"
            content={content}
            setContent={setContent}
            items={content.skills}
            fields={[{ key: "name", label: "Skill" }]}
            emptyItem={() => ({ id: createId(), name: "" })}
            addLabel="Add skill"
            onToggle={toggleSection}
          />

          <ComplexProjects
            content={content}
            setContent={setContent}
            onToggle={toggleSection}
          />

          <SimpleListSection
            section="certifications"
            content={content}
            setContent={setContent}
            items={content.certifications}
            fields={[
              { key: "name", label: "Certification" },
              { key: "issuer", label: "Issuer" },
              { key: "date", label: "Date" },
              { key: "url", label: "URL" },
            ]}
            emptyItem={() => ({
              id: createId(),
              name: "",
              issuer: "",
              date: "",
              url: "",
            })}
            addLabel="Add certification"
            onToggle={toggleSection}
          />

          <AccordionItem value="languages">
            <AccordionTrigger>Languages</AccordionTrigger>
            <AccordionContent>
              <SectionVisibility
                section="languages"
                checked={content.sectionVisibility.languages}
                onCheckedChange={(checked) => toggleSection("languages", checked)}
              />
              <div className="space-y-3">
                {content.languages.map((item, index) => (
                  <div key={item.id} className="grid gap-3 rounded-lg border p-3">
                    <Field label="Language">
                      <Input
                        value={item.name}
                        onChange={(event) =>
                          setContent((current) => ({
                            ...current,
                            languages: current.languages.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, name: event.target.value }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Proficiency">
                      <Select
                        value={item.proficiency || undefined}
                        onValueChange={(value) =>
                          setContent((current) => ({
                            ...current,
                            languages: current.languages.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, proficiency: value ?? "" }
                                : entry,
                            ),
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <ItemActions
                      disableUp={index === 0}
                      disableDown={index === content.languages.length - 1}
                      onMoveUp={() =>
                        setContent((current) => ({
                          ...current,
                          languages: moveItem(current.languages, index, -1),
                        }))
                      }
                      onMoveDown={() =>
                        setContent((current) => ({
                          ...current,
                          languages: moveItem(current.languages, index, 1),
                        }))
                      }
                      onRemove={() =>
                        setContent((current) => ({
                          ...current,
                          languages: current.languages.filter((entry) => entry.id !== item.id),
                        }))
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      languages: [
                        ...current.languages,
                        { id: createId(), name: "", proficiency: "Professional" },
                      ],
                    }))
                  }
                >
                  Add language
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <SimpleListSection
            section="awards"
            content={content}
            setContent={setContent}
            items={content.awards}
            fields={[
              { key: "title", label: "Award" },
              { key: "issuer", label: "Issuer" },
              { key: "date", label: "Date" },
              { key: "description", label: "Description" },
            ]}
            emptyItem={() => ({
              id: createId(),
              title: "",
              issuer: "",
              date: "",
              description: "",
            })}
            addLabel="Add award"
            onToggle={toggleSection}
          />

          <SimpleListSection
            section="references"
            content={content}
            setContent={setContent}
            items={content.references}
            fields={[
              { key: "name", label: "Name" },
              { key: "title", label: "Title" },
              { key: "company", label: "Company" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
            ]}
            emptyItem={() => ({
              id: createId(),
              name: "",
              title: "",
              company: "",
              email: "",
              phone: "",
            })}
            addLabel="Add reference"
            onToggle={toggleSection}
          />
        </Accordion>
      </div>

      <div className="hidden justify-center overflow-auto rounded-xl bg-zinc-100 p-6 lg:flex">
        {preview}
      </div>
    </div>
  );
}

function SectionVisibility({
  section,
  checked,
  onCheckedChange,
}: {
  section: SectionId;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="mb-3 flex items-center justify-between gap-3 text-sm">
      <span>Show {SECTION_LABELS[section]} on resume</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

function SimpleListSection<
  T extends { id: string } & Record<string, string>,
>({
  section,
  content,
  setContent,
  items,
  fields,
  emptyItem,
  addLabel,
  onToggle,
}: {
  section: SectionId;
  content: ResumeContent;
  setContent: React.Dispatch<React.SetStateAction<ResumeContent>>;
  items: T[];
  fields: Array<{ key: Exclude<keyof T, "id">; label: string }>;
  emptyItem: () => T;
  addLabel: string;
  onToggle: (section: SectionId, visible: boolean) => void;
}) {
  return (
    <AccordionItem value={section}>
      <AccordionTrigger>{SECTION_LABELS[section]}</AccordionTrigger>
      <AccordionContent>
        <SectionVisibility
          section={section}
          checked={content.sectionVisibility[section]}
          onCheckedChange={(checked) => onToggle(section, checked)}
        />
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-lg border p-3">
              {fields.map((field) => (
                <Field key={String(field.key)} label={field.label}>
                  <Input
                    value={item[field.key]}
                    onChange={(event) =>
                      setContent((current) => ({
                        ...current,
                        [section]: (current[section] as unknown as T[]).map((entry) =>
                          entry.id === item.id
                            ? { ...entry, [field.key]: event.target.value }
                            : entry,
                        ),
                      }))
                    }
                  />
                </Field>
              ))}
              <ItemActions
                disableUp={index === 0}
                disableDown={index === items.length - 1}
                onMoveUp={() =>
                  setContent((current) => ({
                    ...current,
                    [section]: moveItem(current[section] as unknown as T[], index, -1),
                  }))
                }
                onMoveDown={() =>
                  setContent((current) => ({
                    ...current,
                    [section]: moveItem(current[section] as unknown as T[], index, 1),
                  }))
                }
                onRemove={() =>
                  setContent((current) => ({
                    ...current,
                    [section]: (current[section] as unknown as T[]).filter(
                      (entry) => entry.id !== item.id,
                    ),
                  }))
                }
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setContent((current) => ({
                ...current,
                [section]: [...(current[section] as unknown as T[]), emptyItem()],
              }))
            }
          >
            {addLabel}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ComplexProjects({
  content,
  setContent,
  onToggle,
}: {
  content: ResumeContent;
  setContent: React.Dispatch<React.SetStateAction<ResumeContent>>;
  onToggle: (section: SectionId, visible: boolean) => void;
}) {
  return (
    <AccordionItem value="projects">
      <AccordionTrigger>Projects</AccordionTrigger>
      <AccordionContent>
        <SectionVisibility
          section="projects"
          checked={content.sectionVisibility.projects}
          onCheckedChange={(checked) => onToggle("projects", checked)}
        />
        <div className="space-y-4">
          {content.projects.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-lg border p-3">
              <Field label="Project name">
                <Input
                  value={item.name}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      projects: current.projects.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, name: event.target.value }
                          : entry,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="URL">
                <Input
                  value={item.url}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      projects: current.projects.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, url: event.target.value }
                          : entry,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={item.description}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      projects: current.projects.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, description: event.target.value }
                          : entry,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Highlights (one per line)">
                <Textarea
                  value={item.bullets.join("\n")}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      projects: current.projects.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, bullets: event.target.value.split("\n") }
                          : entry,
                      ),
                    }))
                  }
                />
              </Field>
              <ItemActions
                disableUp={index === 0}
                disableDown={index === content.projects.length - 1}
                onMoveUp={() =>
                  setContent((current) => ({
                    ...current,
                    projects: moveItem(current.projects, index, -1),
                  }))
                }
                onMoveDown={() =>
                  setContent((current) => ({
                    ...current,
                    projects: moveItem(current.projects, index, 1),
                  }))
                }
                onRemove={() =>
                  setContent((current) => ({
                    ...current,
                    projects: current.projects.filter((entry) => entry.id !== item.id),
                  }))
                }
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setContent((current) => ({
                ...current,
                projects: [
                  ...current.projects,
                  {
                    id: createId(),
                    name: "",
                    description: "",
                    url: "",
                    bullets: [""],
                  },
                ],
              }))
            }
          >
            Add project
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
