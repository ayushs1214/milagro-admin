-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Drop all existing tables and views (if any)
drop table if exists public.payments cascade;
drop table if exists public.order_status_history cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.sample_requests cascade;
drop table if exists public.sample_feedback cascade;
drop table if exists public.stock_movements cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.products cascade;
drop table if exists public.product_categories cascade;
drop table if exists public.expo_participants cascade;
drop table if exists public.expo_products cascade;
drop table if exists public.expos cascade;
drop table if exists public.user_activity_logs cascade;
drop table if exists public.admin_profiles cascade;
drop table if exists public.profiles cascade;

-- Drop analytics tables
drop table if exists public.order_analytics cascade;
drop table if exists public.user_analytics cascade;
drop table if exists public.revenue_analytics cascade;

-- Drop all views
drop view if exists public.dashboard_metrics cascade;
drop view if exists public.revenue_trend cascade;
drop view if exists public.user_trend cascade;
drop view if exists public.user_distribution cascade;
drop view if exists public.order_status_distribution cascade;

-- Base Tables

-- 1. Profiles (User Management)
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text not null,
  role text not null check (role in ('superadmin', 'admin', 'dealer', 'architect', 'builder', 'user')), -- Added all roles
  status text not null check (status in ('active', 'inactive', 'pending', 'rejected')),
  avatar_url text,
  phone text,
  business_info jsonb,
  permissions jsonb default '[]'::jsonb,
  settings jsonb default '{}'::jsonb,
  last_login timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint business_info_check check (
    case 
      when role in ('dealer', 'architect', 'builder') then 
        business_info is not null and 
        business_info ? 'companyName' and 
        business_info ? 'phone' and 
        business_info ? 'gstNumber' and 
        business_info ? 'panNumber' and 
        business_info ? 'address'
      else true
    end
  )
);

-- Update the check constraint for roles
alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check
check (role in ('superadmin', 'admin', 'dealer', 'architect', 'builder', 'user'));

-- 2. Admin Profiles
create table public.admin_profiles (
  id uuid references public.profiles on delete cascade primary key,
  department text,
  signature_url text,
  permissions text[] not null default array[]::text[],
  reports_to uuid references public.profiles on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. User Activity Logs
create table public.user_activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Product Categories
create table public.product_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  parent_id uuid references public.product_categories on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  product_id text not null unique,
  series_name text not null,
  finished_name text not null,
  colors jsonb not null default '[]'::jsonb,
  categories uuid[] not null,
  application_type text not null,
  stock integer not null check (stock >= 0),
  price decimal(10,2) not null check (price > 0),
  moq integer not null check (moq > 0),
  msp decimal(10,2) check (msp > price),
  media jsonb not null default '{
    "images": [],
    "videos": [],
    "documents": [],
    "models3d": []
  }'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  manufactured_in text not null,
  check_material_depot boolean not null default false,
  size jsonb not null,
  inventory_qty integer not null check (inventory_qty >= 0),
  status text not null check (status in ('active', 'inactive', 'discontinued')),
  metadata jsonb default '{}'::jsonb,
  created_by uuid references public.profiles not null,
  updated_by uuid references public.profiles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint size_check check (
    size ? 'length' and 
    size ? 'width' and 
    size ? 'height' and 
    size ? 'unit'
  ),
  
  constraint media_check check (
    media ? 'images' and 
    jsonb_array_length(media->'images') > 0
  )
);

-- 6. Product Variants
create table public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade not null,
  sku text not null unique,
  color text,
  size jsonb,
  price decimal(10,2) not null check (price > 0),
  stock integer not null check (stock >= 0),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Stock Movements
create table public.stock_movements (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products not null,
  variant_id uuid references public.product_variants,
  type text not null check (type in ('in', 'out', 'adjustment')),
  quantity integer not null,
  previous_stock integer not null,
  new_stock integer not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_by uuid references public.profiles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text not null unique,
  user_id uuid references public.profiles not null,
  status text not null check (status in (
    'pending', 'confirmed', 'processing', 
    'ready_to_ship', 'shipped', 'delivered', 
    'cancelled', 'returned'
  )),
  items jsonb not null,
  subtotal decimal(10,2) not null check (subtotal >= 0),
  tax_amount decimal(10,2) not null check (tax_amount >= 0),
  shipping_amount decimal(10,2) not null check (shipping_amount >= 0),
  discount_amount decimal(10,2) not null default 0 check (discount_amount >= 0),
  total_amount decimal(10,2) not null check (total_amount >= 0),
  shipping_address jsonb not null,
  billing_address jsonb not null,
  payment_status text not null check (payment_status in (
    'pending', 'partial', 'paid', 'refunded', 'failed'
  )),
  payment_details jsonb default '{}'::jsonb,
  notes text,
  metadata jsonb default '{}'::jsonb,
  created_by uuid references public.profiles not null,
  updated_by uuid references public.profiles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Order Items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders not null,
  product_id uuid references public.products not null,
  variant_id uuid references public.product_variants,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null check (unit_price >= 0),
  total_price decimal(10,2) not null check (total_price >= 0),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Order Status History
create table public.order_status_history (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders not null,
  status text not null,
  notes text,
  created_by uuid references public.profiles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Payments
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders not null,
  amount decimal(10,2) not null check (amount > 0),
  payment_method text not null,
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Sample Requests
create table public.sample_requests (
  id uuid default uuid_generate_v4() primary key,
  request_number text not null unique,
  user_id uuid references public.profiles not null,
  product_id uuid references public.products not null,
  quantity integer not null check (quantity > 0),
  status text not null check (status in (
    'pending', 'approved', 'rejected', 
    'processing', 'shipped', 'delivered'
  )),
  shipping_address jsonb not null,
  tracking_number text,
  notes text,
  feedback jsonb default null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Sample Feedback
create table public.sample_feedback (
  id uuid default uuid_generate_v4() primary key,
  sample_id uuid references public.sample_requests not null,
  rating integer not null check (rating between 1 and 5),
  comments text,
  images jsonb default '[]'::jsonb,
  created_by uuid references public.profiles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Expos
create table public.expos (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  start_date date not null,
  end_date date not null,
  location jsonb not null,
  status text not null check (status in (
    'draft', 'upcoming', 'ongoing', 'completed', 'cancelled'
  )),
  banner_image text,
  gallery jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_by uuid references public.profiles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. Expo Products
create table public.expo_products (
  id uuid default uuid_generate_v4() primary key,
  expo_id uuid references public.expos not null,
  product_id uuid references public.products not null,
  display_order integer,
  special_price decimal(10,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 16. Expo Participants
create table public.expo_participants (
  id uuid default uuid_generate_v4() primary key,
  expo_id uuid references public.expos not null,
  user_id uuid references public.profiles not null,
  role text not null check (role in ('exhibitor', 'visitor', 'staff')),
  status text not null check (status in ('registered', 'confirmed', 'attended')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics Tables

-- 17. Order Analytics
create table public.order_analytics (
  id uuid default uuid_generate_v4() primary key,
  total_amount decimal(10,2) not null default 0,
  tax_amount decimal(10,2) not null default 0,
  shipping_amount decimal(10,2) not null default 0,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 18. User Analytics
create table public.user_analytics (
  id uuid default uuid_generate_v4() primary key,
  total_users integer not null default 0,
  active_users integer not null default 0,
  user_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 19. Revenue Analytics
create table public.revenue_analytics (
  id uuid default uuid_generate_v4() primary key,
  amount decimal(10,2) not null default 0,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
do $$
declare
  table_name text;
begin
  for table_name in (select tablename from pg_tables where schemaname = 'public')
  loop
    execute format('alter table public.%I enable row level security;', table_name);
  end loop;
end
$$;