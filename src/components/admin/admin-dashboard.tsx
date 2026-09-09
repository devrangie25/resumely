"use client";

import { format, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminDashboardData } from "@/lib/analytics/stats";

const chartConfig = {
  downloads: { label: "Downloads", color: "var(--chart-1)" },
  emails_sent: { label: "Emails sent", color: "var(--chart-2)" },
  created: { label: "Created", color: "var(--chart-3)" },
} satisfies ChartConfig;

function formatDay(value: string) {
  try {
    return format(parseISO(value), "MMM d");
  } catch {
    return value;
  }
}

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const { overview, daily, users } = data;
  const cards = [
    { label: "Registered users", value: overview.users },
    { label: "Resumes", value: overview.resumes },
    { label: "Downloads", value: overview.downloads },
    { label: "Emails sent", value: overview.emails_sent },
    { label: "Created", value: overview.created },
    { label: "Duplicated", value: overview.duplicated },
    { label: "Deleted", value: overview.deleted },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} size="sm">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="font-heading text-2xl tabular-nums">
                {card.value.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Last 30 days</CardTitle>
              <CardDescription>
                Downloads, emails sent, and new resumes created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="aspect-auto h-72">
                <AreaChart data={daily} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatDay}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatDay(String(value ?? ""))}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="var(--color-downloads)"
                    fill="var(--color-downloads)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="emails_sent"
                    stroke="var(--color-emails_sent)"
                    fill="var(--color-emails_sent)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stroke="var(--color-created)"
                    fill="var(--color-created)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Registered users</CardTitle>
              <CardDescription>
                Resume inventory plus first-party event counts per account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Resumes</TableHead>
                    <TableHead className="text-right">Downloads</TableHead>
                    <TableHead className="text-right">Emails</TableHead>
                    <TableHead className="text-right">Duplicated</TableHead>
                    <TableHead className="text-right">Deleted</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="grid">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">
                                {user.full_name || "Unnamed"}
                              </span>
                              {user.is_superadmin ? (
                                <Badge
                                  variant="outline"
                                  className="border-violet-500/35 bg-violet-500/10 text-violet-800 dark:border-violet-400/35 dark:bg-violet-400/10 dark:text-violet-300"
                                >
                                  Superadmin
                                </Badge>
                              ) : null}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {user.resume_count}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {user.download_count}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {user.email_send_count}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {user.duplicated_count}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {user.deleted_count}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.created_at
                            ? format(parseISO(user.created_at), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No registered users yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
