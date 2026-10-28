-- =========================================================
-- JOUR J — Supabase Database Schema & RLS Security Policies
-- Slogan: "Le moment qu'on attend"
-- Hierarchy: Category -> Businesses -> Business Owner
-- Target: Algerian Wedding & Event Venues, Traiteurs, Photographers, etc.
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Admins & Business Owners)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text,
  email text unique not null,
  role text not null check (role in ('admin', 'owner')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CATEGORIES TABLE (e.g., قاعة الأعراس, Traiteur, مصورون, ديكور, سيارات, ...)
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  image_url text,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BUSINESSES TABLE (Real Venues, Caterers, Service Providers)
-- businesses.category_id -> categories.id
-- businesses.owner_id -> profiles.id
create table if not exists public.businesses (
  id text primary key,
  category_id text references public.categories(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  title text not null,
  description text,
  phone text not null,
  email text,
  address text not null,
  location text default 'وهران، الجزائر',
  price numeric not null,
  price_unit text default 'دج',
  rating numeric default 5.0 check (rating >= 1.0 and rating <= 5.0),
  main_image text not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PORTFOLIO TABLE (Gallery Photos for each business)
create table if not exists public.portfolio (
  id uuid primary key default uuid_generate_v4(),
  business_id text references public.businesses(id) on delete cascade not null,
  image_url text not null,
  title text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. AVAILABILITY TABLE (Working Days: السبت - الجمعة)
create table if not exists public.availability (
  id uuid primary key default uuid_generate_v4(),
  business_id text references public.businesses(id) on delete cascade not null,
  day text not null check (day in ('السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة')),
  available boolean default true not null,
  unique(business_id, day)
);

-- 6. REGISTRATION_LINKS TABLE (Category-Based Invitation Tokens created by Admin)
-- registration_link -> category_id
create table if not exists public.registration_links (
  id uuid primary key default uuid_generate_v4(),
  category_id text references public.categories(id) on delete cascade not null,
  token text unique not null,
  used boolean default false not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================
-- DATABASE SECURITY TRIGGER: Prevent Owner From Changing Category
-- =========================================================
create or replace function public.prevent_business_category_change()
returns trigger as $$
begin
  if old.category_id is distinct from new.category_id then
    if auth.uid() is not null and not exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Security Violation: Business Owner cannot change the business category.';
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

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.portfolio enable row level security;
alter table public.availability enable row level security;
alter table public.registration_links enable row level security;

-- Public Visitors (Unauthenticated): READ ONLY on active public data
create policy "Public can view active categories" 
  on public.categories for select 
  using (active = true);

create policy "Public can view active businesses" 
  on public.businesses for select 
  using (active = true);

create policy "Public can view portfolio for active businesses" 
  on public.portfolio for select 
  using (exists (select 1 from public.businesses where id = portfolio.business_id and active = true));

create policy "Public can view availability for active businesses" 
  on public.availability for select 
  using (exists (select 1 from public.businesses where id = availability.business_id and active = true));

create policy "Public can verify valid registration token"
  on public.registration_links for select
  using (used = false and expires_at > timezone('utc'::text, now()));

-- Admins: FULL ACCESS across all tables
create policy "Admin full access profiles" 
  on public.profiles for all 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admin full access categories" 
  on public.categories for all 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admin full access businesses" 
  on public.businesses for all 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admin full access portfolio" 
  on public.portfolio for all 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admin full access availability" 
  on public.availability for all 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admin full access registration_links" 
  on public.registration_links for all 
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Business Owners: Isolated access to their own business ONLY
create policy "Owner can view own business" 
  on public.businesses for select 
  using (owner_id = auth.uid());

create policy "Owner can update own business" 
  on public.businesses for update 
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owner can manage own portfolio" 
  on public.portfolio for all 
  using (exists (select 1 from public.businesses where id = portfolio.business_id and owner_id = auth.uid()));

create policy "Owner can manage own availability" 
  on public.availability for all 
  using (exists (select 1 from public.businesses where id = availability.business_id and owner_id = auth.uid()));

-- =========================================================
-- INITIAL SEED DATA
-- =========================================================

-- 1. Seed Categories
insert into public.categories (id, name, description, image_url, active) values
  ('wedding-halls', 'قاعة الأعراس', 'أفخم وأرقى قاعات الحفلات والأعراس المصممة لأجمل الليالي', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80', true),
  ('traiteur', 'Traiteur', 'أشهى المأكولات الجزائرية والعالمية وبوفيهات الحلويات الراقية للمناسبات', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80', true),
  ('photographers', 'مصورون', 'استوديوهات تصوير فوتوغرافي وسينمائي احترافي لتخليد أجمل اللحظات', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80', true),
  ('decorations', 'ديكور', 'تنسيق قاعات وكوشات أعراس، زهور طبيعية وتصاميم ديكور فاخرة', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', true),
  ('luxury-cars', 'سيارات الأعراس', 'مواكب سيارات فارهة وكلاسيكية مع سائق خاص لمرافقة العروسين', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', true),
  ('sports-clubs', 'قاعات الرياضة', 'نوادي رياضية وصحية راقية لتجهيز العروسين قبل اليوم الموعود', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', true)
on conflict (id) do nothing;

-- 2. Seed Businesses (Multiple distinct businesses under categories)
insert into public.businesses (id, category_id, name, title, description, phone, email, address, location, price, price_unit, rating, main_image, active) values
  (
    'salle-el-louloua', 
    'wedding-halls', 
    'قاعة اللؤلؤة', 
    'قاعة اللؤلؤة للأعراس والاحتفالات الفاخرة',
    'قاعة راقية متكاملة تتسع لأكثر من 500 ضيف، مزودة بأحدث أنظمة الإضاءة الليزرية، ديكورات ملكية ذهبية، جناح خاص للعروسين، ومواقف سيارات واسعة ومحروسة.',
    '+213 555 12 34 56',
    'contact@el-louloua-oran.dz',
    'حي العقيد لطفي، بالقرب من الواجهة البحرية',
    'وهران، الجزائر',
    120000,
    'دج',
    4.9,
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'salle-nour', 
    'wedding-halls', 
    'قاعة النور', 
    'قاعة النور الكبرى للمناسبات السعيدة',
    'قاعة عصرية تتسع لـ 650 شخص مع جناح فندقي مجهز، إطلالة بانورامية وتكييف مركزي متطور.',
    '+213 550 88 77 66',
    'salle.nour.oran@gmail.com',
    'طريق الميناء الجديد، بئر الجير',
    'وهران، الجزائر',
    110000,
    'دج',
    4.9,
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'salle-layali-oran', 
    'wedding-halls', 
    'قاعة ليالي وهران', 
    'قاعة ليالي وهران الملكية',
    'ديكور أندلسي فاخر، ثريات كريستال عملاقة، خدمة استقبال VIP ومسرح زفاف مضيء بتأثيرات ساحرة.',
    '+213 552 44 33 22',
    'layali.oran@gmail.com',
    'حي كنستال، الواجهة البحرية الشرقية',
    'وهران، الجزائر',
    135000,
    'دج',
    4.8,
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'saveurs-doran', 
    'traiteur', 
    'Saveurs d''Oran Traiteur', 
    'خدمات الإطعام الفاخر والبوفيهات الملكية للأعراس والمؤتمرات',
    'نقدم أرقى تشكيلات الأطباق التقليدية الجزائرية (طاجين الزيتون، الشواء، الحريرة الوهرانية) بالإضافة إلى بوفيهات مقبلات عالمية، حلويات شرقية وغربية، وتنسيق طاولات فاخر.',
    '+213 661 98 76 54',
    'traiteur@saveurs-oran.dz',
    'شارع العربي بن مهيدي، وسط المدينة',
    'وهران، الجزائر',
    3500,
    'دج / شخص',
    4.8,
    'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'studio-el-bahia',
    'photographers',
    'ستوديو الباهية للتصوير',
    'تغطية فوتوغرافية وسينمائية احترافية بطائرات درون وأحدث كاميرات 4K',
    'فريق محترف من المصورين والمصورات بخبرة تزيد عن 10 سنوات في تصوير الأعراس والمناسبات الكبرى بألبومات حرارية إيطالية فاخرة.',
    '+213 556 77 88 99',
    'elbahia.studio@gmail.com',
    'حي كاستور، مقابل قصر الثقافة',
    'وهران، الجزائر',
    45000,
    'دج / باقة',
    4.9,
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    true
  )
on conflict (id) do nothing;

-- 3. Seed Portfolio for قاعة اللؤلؤة
insert into public.portfolio (business_id, image_url, title, sort_order) values
  ('salle-el-louloua', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', 'ديكور القاعة الملكي', 1),
  ('salle-el-louloua', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', 'تنسيق الطاولات والورود', 2),
  ('salle-el-louloua', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80', 'كوشة العروسين والإضاءة', 3),
  ('salle-el-louloua', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', 'إضاءة المسرح والأعراس', 4);

-- 4. Seed Availability Days for Businesses
insert into public.availability (business_id, day, available) values
  ('salle-el-louloua', 'السبت', true),
  ('salle-el-louloua', 'الأحد', true),
  ('salle-el-louloua', 'الإثنين', false),
  ('salle-el-louloua', 'الثلاثاء', true),
  ('salle-el-louloua', 'الأربعاء', true),
  ('salle-el-louloua', 'الخميس', true),
  ('salle-el-louloua', 'الجمعة', true),

  ('salle-nour', 'السبت', true),
  ('salle-nour', 'الأحد', true),
  ('salle-nour', 'الإثنين', true),
  ('salle-nour', 'الثلاثاء', true),
  ('salle-nour', 'الأربعاء', false),
  ('salle-nour', 'الخميس', true),
  ('salle-nour', 'الجمعة', true),

  ('saveurs-doran', 'السبت', true),
  ('saveurs-doran', 'الأحد', true),
  ('saveurs-doran', 'الإثنين', true),
  ('saveurs-doran', 'الثلاثاء', true),
  ('saveurs-doran', 'الأربعاء', true),
  ('saveurs-doran', 'الخميس', true),
  ('saveurs-doran', 'الجمعة', true)
on conflict (business_id, day) do update set available = excluded.available;

-- 5. Seed Category-Based Registration Links
insert into public.registration_links (category_id, token, used, expires_at) values
  ('wedding-halls', 'WEDDING2026', false, timezone('utc'::text, now() + interval '30 days')),
  ('traiteur', 'TRAITEUR2026', false, timezone('utc'::text, now() + interval '30 days')),
  ('photographers', 'PHOTO2026', false, timezone('utc'::text, now() + interval '30 days'))
on conflict (token) do nothing;

-- =========================================================
-- 6. ENABLE REAL-TIME REPLICATION FOR ALL TABLES
-- Allows automatic WebSocket instant updates for all clients
-- =========================================================
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.businesses;
alter publication supabase_realtime add table public.portfolio;
alter publication supabase_realtime add table public.availability;
alter publication supabase_realtime add table public.registration_links;
alter publication supabase_realtime add table public.profiles;

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
