# Supabase Setup

Run the schema in [migrations/20260512_initial_schema.sql](migrations/20260512_initial_schema.sql) against your Supabase project before testing the full SkinAid flow.

You can apply it in either of these ways:

```sh
npx supabase db push
```

Or paste the SQL into the Supabase SQL editor and execute it once.

The migration creates:

- `profiles`
- `skin_checks`
- the `skin-images` storage bucket
- row-level security policies for tables and storage uploads

For the privileged account-deletion endpoint, also set `SUPABASE_SERVICE_ROLE_KEY` in Vercel.