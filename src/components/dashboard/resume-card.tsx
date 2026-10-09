"use client";

import { formatDistanceToNow } from "date-fns";

import { ResumeActions } from "@/components/dashboard/resume-actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTemplateDisplayLabel } from "@/lib/resume/schema";

type ResumeCardProps = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
};

export function ResumeCard({
  id,
  title,
  templateId,
  updatedAt,
}: ResumeCardProps) {
  const templateLabel = getTemplateDisplayLabel(templateId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription>
          Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{templateLabel}</Badge>
      </CardContent>
      <CardFooter>
        <ResumeActions id={id} title={title} />
      </CardFooter>
    </Card>
  );
}
