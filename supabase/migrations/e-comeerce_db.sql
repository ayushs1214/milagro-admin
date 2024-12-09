-- Drop existing tables safely
drop table if exists public.payments cascade;
drop table if exists public.order_status_history cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.sample_requests cascade;
drop table if exists public.stock_movements cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.products cascade;
drop table if exists public.product_categories cascade;

-- Create Tables

-- Product Categories
create table public.product_categories (
  id uuid default gen_random_uuid() primary key, -- Default UUID for consistency
  name text not null unique,
  slug text not null unique,
  description text,
  parent_id uuid references public.product_categories on delete cascade, -- Cascade deletion for parent
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table public.products (
  id uuid default gen_random_uuid() primary key, -- Default UUID for consistency
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
  created_by uuid references public.profiles on delete cascade not null,
  updated_by uuid references public.profiles on delete cascade not null,
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

-- Product Variants
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

-- Stock Movements
create table public.stock_movements (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade not null,
  variant_id uuid references public.product_variants on delete cascade,
  type text not null check (type in ('in', 'out', 'adjustment')),
  quantity integer not null,
  previous_stock integer not null,
  new_stock integer not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_by uuid references public.profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sample Requests
create table public.sample_requests (
  id uuid default gen_random_uuid() primary key,
  request_number text not null unique,
  user_id uuid references public.profiles on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
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

-- Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text not null unique,
  user_id uuid references public.profiles on delete cascade not null,
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
  created_by uuid references public.profiles on delete cascade not null,
  updated_by uuid references public.profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  variant_id uuid references public.product_variants on delete cascade,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null check (unit_price >= 0),
  total_price decimal(10,2) not null check (total_price >= 0),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Status History
create table public.order_status_history (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  status text not null,
  notes text,
  created_by uuid references public.profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  amount decimal(10,2) not null check (amount > 0),
  payment_method text not null,
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row-Level Security (RLS) for All Tables
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.stock_movements enable row level security;
alter table public.sample_requests enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;

-- Create Policies

-- Products Policies
create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "Admins can manage products"
  on products for all
  using ( 
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and (role = 'admin' or role = 'superadmin')
    )
  );

-- Orders Policies
create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

create policy "Users can create their own orders"
  on orders for insert
  with check ( auth.uid() = user_id );

create policy "Admins can manage all orders"
  on orders for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and (role = 'admin' or role = 'superadmin')
    )
  );

-- Sample Requests Policies
create policy "Users can view their own sample requests"
  on sample_requests for select
  using ( auth.uid() = user_id );

create policy "Users can create their own sample requests"
  on sample_requests for insert
  with check ( auth.uid() = user_id );

create policy "Admins can manage all sample requests"
  on sample_requests for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and (role = 'admin' or role = 'superadmin')
    )
  );