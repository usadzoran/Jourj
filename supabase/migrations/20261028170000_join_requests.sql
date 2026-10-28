-- Jour J: Replace direct invitation registration with moderated join requests.
-- Safe and non-destructive: existing invitation, profile, business and data tables remain intact.

create table if not exists public.join_requests (
  id uuid primary key default uuid_generate_v4(),
  category_id text not null references public.categories(id) on delete restrict,
  business_name text not null check (char_length(trim(business_name)) between 2 and 160),
  owner_name text not null check (char_length(trim(owner_name)) between 2 and 160),
  wilaya text not null check (char_length(trim(wilaya)) between 2 and 100),
  municipality text not null check (char_length(trim(municipality)) between 2 and 120),
  address text not null check (char_length(trim(address)) between 2 and 500),
  phone text not null check (char_length(trim(phone)) between 5 and 50),
  email text,
  description text not null check (char_length(trim(description)) between 10 and 4000),
  price_range text,
  image_urls jsonb not null default '[]'::jsonb check (jsonb_typeof(image_urls) = 'array'),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_join_requests_status_created_at on public.join_requests(status, created_at desc);
create index if not exists idx_join_requests_category_id on public.join_requests(category_id);

alter table public.join_requests enable row level security;

drop policy if exists "Public can submit join requests" on public.join_requests;
create policy "Public can submit join requests"
  on public.join_requests for insert
  with check (status = 'pending' and reviewed_at is null and reviewed_by is null);

drop policy if exists "Admin full access join requests" on public.join_requests;
create policy "Admin full access join requests"
  on public.join_requests for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Applicants never receive read access, so pending applications cannot be enumerated publicly.
comment on table public.join_requests is 'Public applications reviewed by Jour J admins before a business/account is created.';
