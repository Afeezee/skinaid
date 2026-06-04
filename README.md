# SkinAid

SkinAid is a React 18 + Vite application for AI-assisted skin screening. This version is self-managed and uses Supabase for authentication, PostgreSQL, and storage, with a Vercel serverless function that proxies multimodal analysis requests to Groq.

## Stack

- Frontend: React 18, Vite, React Router v6, Tailwind CSS, shadcn/ui
- Auth and data: Supabase Auth, PostgreSQL, Storage
- AI inference: Groq `meta-llama/llama-4-scout-17b-16e-instruct`
- Deployment: Vercel

## Environment variables

Create a local `.env.local` file for frontend-safe values and configure the server-side secret in Vercel.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe for the browser. `SUPABASE_SERVICE_ROLE_KEY` and `GROQ_API_KEY` must remain server-side and should only be stored in Vercel environment settings or a local `.env.local` used for serverless testing.

## Local development

```sh
npm install
npm run dev
```

The Vite dev server now includes a local bridge for the app's serverless routes, so plain local development supports `/api/analyze` and `/api/account/delete` without Vercel.

If you still want full Vercel parity locally, use:

```sh
npm run dev:vercel
```

If you keep environment variables in Vercel, you can also pull them locally with `vercel env pull .env.local` before running `vercel dev`.

## Supabase requirements

Create the following Supabase resources before running the complete workflow:

- Storage bucket: `skin-images`
- Table: `skin_checks`
	- `id`
	- `user_id`
	- `image_url`
	- `result` (`jsonb`)
	- `created_at`
- Table: `profiles`
	- `id`
	- `full_name`
	- `email`
	- `created_at`

Configure row-level security so authenticated users can only access their own rows and uploads.

An exact schema and policy migration is included in [supabase/migrations/20260512_initial_schema.sql](supabase/migrations/20260512_initial_schema.sql). You can run it through the Supabase SQL editor or via the Supabase CLI after linking the project.

## Deployment

Deploy the app to Vercel and set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `GROQ_API_KEY` in the project environment settings. Vercel will automatically detect the serverless functions in `api/`.

Client-side routes such as `/login`, `/skin-check`, and `/history` are rewritten to `index.html` through `vercel.json` so React Router can handle OAuth callbacks and direct visits.

## Google Sign-In

SkinAid now includes a Google sign-in button backed by Supabase OAuth.

To enable it:

1. In Supabase, open Authentication > Providers > Google and enable the provider.
2. Create Google OAuth credentials in Google Cloud and paste the client ID and client secret into Supabase.
3. Add your allowed redirect URLs in Supabase and Google Cloud, including your local and deployed login routes.

Typical redirect URLs:

- `http://127.0.0.1:4173/login`
- `https://your-vercel-domain/login`

Once enabled, users can continue with Google and Supabase will return them to the login route before redirecting them back into the app.

## Account deletion

SkinAid now includes a privileged deletion endpoint at `api/account/delete.js`. It verifies the currently signed-in user from their Supabase access token, deletes their saved scan rows, removes uploaded files from `skin-images`, deletes their profile, and then removes the auth user through the Supabase admin API. This endpoint requires `SUPABASE_SERVICE_ROLE_KEY`.
