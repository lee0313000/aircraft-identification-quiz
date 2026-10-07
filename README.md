# Aircraft Identification QUIZ

Korean subtitle: 항공기 맞추기 QUIZ

## Overview
This project is a real working quiz application for identifying aircraft. It includes:

- Auth flows for sign up, login, logout
- Quiz engine with scoring and answers
- Profile and quiz history
- Ranking page
- Encyclopedia section
- Admin question management with publish/unpublish
- Responsive aviation-themed UI
- Supabase-ready configuration

## Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase JS client

## Quick start

1. Install dependencies

```bash
npm install
```
2. Copy environment variables

```bash
cp .env.example .env.local
```
3. Set your own Supabase values in `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
4. Run the app

```bash
npm run dev
```

## Demo admin account
The application includes a local demo admin account for immediate use when Supabase is not configured:

- Email: admin@aircraftquiz.local
- Password: admin123

## Supabase database schema
A starter SQL schema is included in `supabase/schema.sql`.

## Important notes
- Do not expose Supabase service-role credentials in frontend code.
- Use RLS policies in production.
- The local demo store is intentionally included so the app remains usable before Supabase is configured.
