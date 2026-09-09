export type PublicStats = {
  users: number;
  resumes: number;
  downloads: number;
  emails_sent: number;
};

export type AdminOverview = PublicStats & {
  created: number;
  duplicated: number;
  deleted: number;
};

export type AdminDailyPoint = {
  day: string;
  downloads: number;
  emails_sent: number;
  created: number;
  duplicated: number;
  deleted: number;
};

export type AdminUserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  is_superadmin: boolean;
  resume_count: number;
  download_count: number;
  email_send_count: number;
  deleted_count: number;
  duplicated_count: number;
  created_count: number;
};

export type AdminDashboardData = {
  overview: AdminOverview;
  daily: AdminDailyPoint[];
  users: AdminUserRow[];
};

const emptyPublicStats: PublicStats = {
  users: 0,
  resumes: 0,
  downloads: 0,
  emails_sent: 0,
};

const emptyOverview: AdminOverview = {
  ...emptyPublicStats,
  created: 0,
  duplicated: 0,
  deleted: 0,
};

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown) {
  return value === true;
}

export function parsePublicStats(value: unknown): PublicStats {
  if (!value || typeof value !== "object") {
    return emptyPublicStats;
  }

  const input = value as Record<string, unknown>;
  return {
    users: asNumber(input.users),
    resumes: asNumber(input.resumes),
    downloads: asNumber(input.downloads),
    emails_sent: asNumber(input.emails_sent),
  };
}

export function parseAdminDashboard(value: unknown): AdminDashboardData {
  if (!value || typeof value !== "object") {
    return { overview: emptyOverview, daily: [], users: [] };
  }

  const input = value as Record<string, unknown>;
  const overviewInput =
    input.overview && typeof input.overview === "object"
      ? (input.overview as Record<string, unknown>)
      : {};

  return {
    overview: {
      ...parsePublicStats(overviewInput),
      created: asNumber(overviewInput.created),
      duplicated: asNumber(overviewInput.duplicated),
      deleted: asNumber(overviewInput.deleted),
    },
    daily: Array.isArray(input.daily)
      ? input.daily.map((point) => {
          const row =
            point && typeof point === "object"
              ? (point as Record<string, unknown>)
              : {};
          return {
            day: asString(row.day),
            downloads: asNumber(row.downloads),
            emails_sent: asNumber(row.emails_sent),
            created: asNumber(row.created),
            duplicated: asNumber(row.duplicated),
            deleted: asNumber(row.deleted),
          };
        })
      : [],
    users: Array.isArray(input.users)
      ? input.users.map((user) => {
          const row =
            user && typeof user === "object"
              ? (user as Record<string, unknown>)
              : {};
          return {
            id: asString(row.id),
            email: typeof row.email === "string" ? row.email : null,
            full_name: typeof row.full_name === "string" ? row.full_name : null,
            created_at: asString(row.created_at),
            is_superadmin: asBoolean(row.is_superadmin),
            resume_count: asNumber(row.resume_count),
            download_count: asNumber(row.download_count),
            email_send_count: asNumber(row.email_send_count),
            deleted_count: asNumber(row.deleted_count),
            duplicated_count: asNumber(row.duplicated_count),
            created_count: asNumber(row.created_count),
          };
        })
      : [],
  };
}
