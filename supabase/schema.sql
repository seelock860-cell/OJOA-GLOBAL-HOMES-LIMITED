-- =============================================================================
-- OJOA GLOBAL HOMES LIMITED — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this entire script in the Supabase SQL Editor (https://app.supabase.com)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. ADMIN USERS ALLOWLIST (Protects admin operations in RLS)
-- Add your administrator's Supabase Auth user UUID or email here after creating
-- the user in Authentication -> Users.
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
       or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create policy "Admins can view admin list"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. PROPERTY CATEGORIES
-- -----------------------------------------------------------------------------
create table if not exists public.property_categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  description text default '',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.property_categories enable row level security;

create policy "Public can read property categories"
  on public.property_categories for select
  using (true);

create policy "Admins can manage property categories"
  on public.property_categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.property_categories (name, slug, description, display_order)
values
  ('Houses', 'houses', 'Detached duplexes, terrace residences, and residential homes.', 1),
  ('Land', 'land', 'Serviced residential and investment land parcels.', 2),
  ('Apartments', 'apartments', 'Modern luxury apartments and multi-unit residences.', 3),
  ('Commercial Properties', 'commercial-properties', 'Office plazas, retail spaces, and commercial developments.', 4)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- 3. PROPERTIES
-- -----------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  category_id uuid references public.property_categories(id) on delete set null,
  category_name text not null default 'Houses',
  location text not null,
  price numeric(15, 2) not null default 0,
  price_label text default '',
  status text not null default 'Available' check (status in ('Available', 'Under Offer', 'Sold', 'Sample Listing')),
  short_description text not null default '',
  description text not null default '',
  bedrooms int,
  bathrooms int,
  size_sqm text default '',
  features text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "Public can view published properties"
  on public.properties for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert properties"
  on public.properties for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update properties"
  on public.properties for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete properties"
  on public.properties for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. PROPERTY IMAGES
-- -----------------------------------------------------------------------------
create table if not exists public.property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  storage_path text default '',
  alt_text text default '',
  is_primary boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.property_images enable row level security;

create policy "Public can view images of published properties"
  on public.property_images for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_images.property_id
        and (p.is_published = true or public.is_admin())
    )
  );

create policy "Admins can manage property images"
  on public.property_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. ENQUIRIES
-- -----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null,
  property_id uuid references public.properties(id) on delete set null,
  property_interest text not null default 'General Property Enquiry',
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

-- Public visitors can submit enquiries, but only admins can read/update/delete them.
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  with check (true);

create policy "Admins can view enquiries"
  on public.enquiries for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. TESTIMONIALS
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_role text not null default 'Property Buyer',
  quote text not null,
  is_published boolean not null default true,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Public can view published testimonials"
  on public.testimonials for select
  using (is_published = true or public.is_admin());

create policy "Admins can manage testimonials"
  on public.testimonials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. WEBSITE CONTENT (CMS key-value table for admin text updates)
-- -----------------------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read site content"
  on public.site_content for select
  using (true);

create policy "Admins can manage site content"
  on public.site_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.site_content (key, value)
values
  ('hero_heading', 'FIND YOUR PLACE IN A BETTER FUTURE.'),
  ('hero_subheading', 'Discover premium estates and property opportunities with Ojoa Global Homes Limited.'),
  ('welcome_title', 'Welcome to Ojoa Global Homes Limited'),
  ('welcome_body', 'As an Abuja-based real estate developer, Ojoa Global Homes Limited is dedicated to creating well-planned residential estates and dependable property investment opportunities across the Federal Capital Territory.'),
  ('about_heading', 'BUILDING CONFIDENCE IN EVERY PROPERTY DECISION.'),
  ('about_intro', 'Ojoa Global Homes Limited is an Abuja-based real estate developer focused on premium estates, residential homes, and strategic property opportunities designed with long-term value and client trust at the centre.'),
  ('about_vision', 'To set a dependable benchmark for residential estate development and property acquisition in Abuja through transparency, thoughtful planning, and enduring build quality.'),
  ('about_mission', 'To guide buyers and investors toward secure, well-located real estate opportunities in Abuja with clear communication, professional advisory, and dedicated service at every step.')
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- 8. SUPABASE STORAGE BUCKET FOR PROPERTY IMAGES
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "Public can view property images storage"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Admins can upload property images storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images' and public.is_admin());

create policy "Admins can update property images storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images' and public.is_admin());

create policy "Admins can delete property images storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images' and public.is_admin());
