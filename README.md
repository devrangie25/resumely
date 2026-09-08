# Resumely

Free web-based resume generator. Create an account, pick a template, edit your details, preview, and download a PDF.

## Stack

- Next.js, TypeScript, Tailwind CSS, shadcn/ui
- Supabase Auth and Postgres with Row Level Security

## Setup

1. Use Node 22 (`nvm use`).
2. Copy `.env.example` to `.env.local` and add your Supabase URL and publishable key.
3. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Local Supabase

```bash
npx supabase start
npx supabase db reset
```

`supabase/seed.sql` creates the confirmed dev user.

### Dev login

When `NEXT_PUBLIC_ENABLE_DEV_LOGIN=true`:

- Email: `dev@resumely.local`
- Password: `devpassword123`

Turn this flag off in production.

### Social login

Google, GitHub, and Facebook buttons are wired in the app. Add each provider’s client ID and secret in the Supabase Auth dashboard (and in `supabase/config.toml` for local), plus redirect URLs:

- `http://localhost:3000/auth/callback`
- Your production origin `/auth/callback`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
