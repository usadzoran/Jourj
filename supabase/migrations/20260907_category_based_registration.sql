-- =========================================================
-- MIGRATION: Category-Based Registration & Strict Owner Isolation
-- Target: JOUR J Platform
-- =========================================================

-- 1. Safely add category_id to registration_links if not already present
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
      and table_name = 'registration_links' 
      and column_name = 'category_id'
  ) then
    alter table public.registration_links add column category_id text references public.categories(id) on delete cascade;
  end if;
end $$;

-- 2. Migrate existing links: copy category_id from the referenced business before dropping business_id
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
      and table_name = 'registration_links' 
      and column_name = 'business_id'
  ) then
    update public.registration_links rl
    set category_id = b.category_id
    from public.businesses b
    where rl.business_id = b.id and rl.category_id is null;

    -- Make sure any remaining fallback to an active category
    update public.registration_links
    set category_id = (select id from public.categories limit 1)
    where category_id is null;

    alter table public.registration_links alter column category_id set not null;
    alter table public.registration_links drop column business_id;
  end if;
end $$;

-- 3. Security: Prevent any Owner from altering category_id on their Business
create or replace function public.prevent_business_category_change()
returns trigger as $$
begin
  if old.category_id is distinct from new.category_id then
    -- Only allow admins to re-categorize, reject if normal owner
    if auth.uid() is not null and not exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Security Violation: Business Owner is strictly forbidden from changing the business category.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_prevent_business_category_change on public.businesses;
create trigger trg_prevent_business_category_change
before update on public.businesses
for each row
execute function public.prevent_business_category_change();

-- 4. RLS Security Hardening for registration_links
alter table public.registration_links enable row level security;

drop policy if exists "Admin full access registration_links" on public.registration_links;
create policy "Admin full access registration_links"
  on public.registration_links for all
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Allow public verification of unused & unexpired tokens by token value
drop policy if exists "Public can verify token validity" on public.registration_links;
create policy "Public can verify token validity"
  on public.registration_links for select
  using (used = false and expires_at > timezone('utc'::text, now()));

-- 5. Hardened RLS for Businesses & Owners
drop policy if exists "Owner can view own business" on public.businesses;
create policy "Owner can view own business"
  on public.businesses for select
  using (owner_id = auth.uid());

drop policy if exists "Owner can update own business" on public.businesses;
create policy "Owner can update own business"
  on public.businesses for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- 6. Insert new Category-based registration links for testing
insert into public.registration_links (category_id, token, used, expires_at)
values 
  ('wedding-halls', 'WEDDING2026', false, timezone('utc'::text, now() + interval '30 days')),
  ('traiteur', 'TRAITEUR2026', false, timezone('utc'::text, now() + interval '30 days'))
on conflict (token) do nothing;
