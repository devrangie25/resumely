"use client";

import { formatDistanceToNow } from "date-fns";
import { LayoutGridIcon, TableIcon } from "lucide-react";
import { useState } from "react";

import { ResumeActions } from "@/components/dashboard/resume-actions";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FAMILY_LABELS,
  TEMPLATE_FAMILIES,
  getTemplateDisplayLabel,
  getTemplateFamily,
} from "@/lib/resume/schema";

export type DashboardResume = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
};

const FAMILY_FILTERS = ["all", ...TEMPLATE_FAMILIES] as const;
type FamilyFilter = (typeof FAMILY_FILTERS)[number];
type ResumeListView = "cards" | "table";

function filterLabel(filter: FamilyFilter) {
  if (filter === "all") return "All";
  return FAMILY_LABELS[filter];
}

function resumesForFilter(resumes: DashboardResume[], filter: FamilyFilter) {
  if (filter === "all") return resumes;
  return resumes.filter(
    (resume) => getTemplateFamily(resume.templateId) === filter,
  );
}

export function ResumeList({ resumes }: { resumes: DashboardResume[] }) {
  const [filter, setFilter] = useState<FamilyFilter>("all");
  const [view, setView] = useState<ResumeListView>("cards");
  const visible = resumesForFilter(resumes, filter);
  const showingCards = view === "cards";

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by template family"
          className="inline-flex w-fit flex-wrap gap-1 rounded-lg bg-muted p-1"
        >
          {FAMILY_FILTERS.map((option) => {
            const selected = filter === option;
            return (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={selected ? "default" : "ghost"}
                aria-pressed={selected}
                onClick={() => setFilter(option)}
              >
                {filterLabel(option)}
              </Button>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setView(showingCards ? "table" : "cards")}
        >
          {showingCards ? <TableIcon /> : <LayoutGridIcon />}
          {showingCards ? "Table view" : "Card view"}
        </Button>
      </div>

      {visible.length === 0 ? (
        <FamilyEmptyState family={filter} />
      ) : showingCards ? (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {visible.map((resume) => (
            <li key={resume.id}>
              <ResumeCard
                id={resume.id}
                title={resume.title}
                templateId={resume.templateId}
                updatedAt={resume.updatedAt}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ResumeTable resumes={visible} />
      )}
    </div>
  );
}

function FamilyEmptyState({ family }: { family: FamilyFilter }) {
  if (family === "all") return null;
  const label = FAMILY_LABELS[family];

  return (
    <div className="mt-4 rounded-xl border border-dashed p-10 text-center">
      <h2 className="font-heading text-lg font-medium">No {label} resumes</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        None of your resumes use a {label} template. Choose another family or
        show every resume.
      </p>
    </div>
  );
}

function ResumeTable({ resumes }: { resumes: DashboardResume[] }) {
  return (
    <div className="mt-4 rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume.id}>
              <TableCell className="max-w-xs truncate font-medium">
                {resume.title}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getTemplateDisplayLabel(resume.templateId)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(resume.updatedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="whitespace-normal">
                <ResumeActions id={resume.id} title={resume.title} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
