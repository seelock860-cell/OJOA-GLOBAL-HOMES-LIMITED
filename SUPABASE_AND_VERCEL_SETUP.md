# Ojoa Global Homes Limited — Supabase & Vercel Setup Guide

## 1. Environment Variables
Create a `.env` file locally (or configure these in **Vercel Project Settings -> Environment Variables**):

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"
```

> **Security Note:** Never add your Supabase `service_role` key to `VITE_*` variables or frontend code.

---

## 2. Supabase Database & Storage Setup
1. Sign in to [Supabase](https://app.supabase.com) and create a new project.
2. Open **SQL Editor** -> **New Query**.
3. Copy the entire contents of `supabase/schema.sql` and click **Run**.
   This creates:
   - `admin_users` (administrator allowlist for RLS)
   - `property_categories` (pre-seeded with Houses, Land, Apartments, Commercial Properties)
   - `properties`
   - `property_images`
   - `enquiries`
   - `testimonials`
   - `site_content`
   - Public storage bucket `property-images` + Row Level Security (RLS) policies.

---

## 3. Creating Your Administrator Account
1. In Supabase Dashboard, go to **Authentication -> Users -> Add user -> Create new user**.
2. Enter the administrator email and a strong password, and check **Auto Confirm User**.
3. Run the following SQL in the **SQL Editor** (replace with your administrator's email):

```sql
insert into public.admin_users (email)
values ('ojoaglobalhomes@gmail.com')
on conflict (email) do nothing;
```

4. You can now sign in at `/admin/login` to add verified Abuja property listings, upload photos, manage enquiries, update testimonials, and edit website copy.

---

## 4. Deploying to Vercel
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite** (`npm run build`, output directory `dist`).
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Environment Variables.
5. `vercel.json` is already included to rewrite SPA routes cleanly to `/index.html`.
6. Click **Deploy**.
