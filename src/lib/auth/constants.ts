export const DEV_LOGIN_EMAIL =
  process.env.NEXT_PUBLIC_DEV_LOGIN_EMAIL ?? "dev@resumely.local";

export const DEV_LOGIN_PASSWORD =
  process.env.NEXT_PUBLIC_DEV_LOGIN_PASSWORD ?? "devpassword123";

export const isDevLoginEnabled =
  process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true";
