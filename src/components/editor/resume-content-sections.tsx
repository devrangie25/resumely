"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@/lib/resume/defaults";
import {
  LANGUAGE_LEVELS,
  SECTION_LABELS,
  type ResumeContent,
  type SectionId,
} from "@/lib/resume/schema";

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  const [removed] = next.splice(index, 1);
  next.splice(target, 0, removed);
  return next;
}

export function Field({
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
  itemLabel,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disableUp: boolean;
  disableDown: boolean;
  itemLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="xs" onClick={onMoveUp} disabled={disableUp}>
        Up
      </Button>
      <Button type="button" variant="outline" size="xs" onClick={onMoveDown} disabled={disableDown}>
        Down
      </Button>
      <Button type="button" variant="destructive" size="xs" onClick={() => setOpen(true)}>
        Remove
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {itemLabel} from your resume. Anything you typed
              here will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onRemove();
                setOpen(false);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SectionVisibility({
  section,
  checked,
  onCheckedChange,
  showVisibility,
}: {
  section: SectionId;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showVisibility: boolean;
}) {
  if (!showVisibility) return null;

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
  showVisibility,
}: {
  section: SectionId;
  content: ResumeContent;
  setContent: React.Dispatch<React.SetStateAction<ResumeContent>>;
  items: T[];
  fields: Array<{ key: Exclude<keyof T, "id">; label: string }>;
  emptyItem: () => T;
  addLabel: string;
  onToggle: (section: SectionId, visible: boolean) => void;
  showVisibility: boolean;
}) {
  return (
    <AccordionItem value={section}>
      <AccordionTrigger>{SECTION_LABELS[section]}</AccordionTrigger>
      <AccordionContent>
        <SectionVisibility
          section={section}
          checked={content.sectionVisibility[section]}
          onCheckedChange={(checked) => onToggle(section, checked)}
          showVisibility={showVisibility}
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
                itemLabel={`this ${SECTION_LABELS[section].toLowerCase()} entry`}
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
  showVisibility,
}: {
  content: ResumeContent;
  setContent: React.Dispatch<React.SetStateAction<ResumeContent>>;
  onToggle: (section: SectionId, visible: boolean) => void;
  showVisibility: boolean;
}) {
  return (
    <AccordionItem value="projects">
      <AccordionTrigger>Projects</AccordionTrigger>
      <AccordionContent>
        <SectionVisibility
          section="projects"
          checked={content.sectionVisibility.projects}
          onCheckedChange={(checked) => onToggle("projects", checked)}
          showVisibility={showVisibility}
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
                itemLabel="this project"
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

export function ResumeContentSections({
  content,
  setContent,
  showVisibility = true,
  onToggleSection,
  defaultOpen = ["summary", "experience"],
  prepend,
}: {
  content: ResumeContent;
  setContent: React.Dispatch<React.SetStateAction<ResumeContent>>;
  showVisibility?: boolean;
  onToggleSection?: (section: SectionId, visible: boolean) => void;
  defaultOpen?: string[];
  prepend?: React.ReactNode;
}) {
  function toggleSection(section: SectionId, visible: boolean) {
    if (onToggleSection) {
      onToggleSection(section, visible);
      return;
    }

    setContent((current) => ({
      ...current,
      sectionVisibility: { ...current.sectionVisibility, [section]: visible },
    }));
  }

  return (
    <Accordion multiple defaultValue={defaultOpen}>
      {prepend}
      <AccordionItem value="summary">
        <AccordionTrigger>Professional summary</AccordionTrigger>
        <AccordionContent>
          <SectionVisibility
            section="summary"
            checked={content.sectionVisibility.summary}
            onCheckedChange={(checked) => toggleSection("summary", checked)}
            showVisibility={showVisibility}
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
            onCheckedChange={(checked) => toggleSection("experience", checked)}
            showVisibility={showVisibility}
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
                  itemLabel="this work experience"
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
            showVisibility={showVisibility}
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
                  itemLabel="this education entry"
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
        showVisibility={showVisibility}
      />

      <ComplexProjects
        content={content}
        setContent={setContent}
        onToggle={toggleSection}
        showVisibility={showVisibility}
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
        showVisibility={showVisibility}
      />

      <AccordionItem value="languages">
        <AccordionTrigger>Languages</AccordionTrigger>
        <AccordionContent>
          <SectionVisibility
            section="languages"
            checked={content.sectionVisibility.languages}
            onCheckedChange={(checked) => toggleSection("languages", checked)}
            showVisibility={showVisibility}
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
                  itemLabel="this language"
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
        showVisibility={showVisibility}
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
        showVisibility={showVisibility}
      />
    </Accordion>
  );
}
