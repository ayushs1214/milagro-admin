-- Drop existing tables and views safely
drop view if exists public.dashboard_metrics cascade;
drop view if exists public.revenue_trend cascade;
drop view if exists public.user_trend cascade;
drop view if exists public.user_distribution cascade;
drop view if exists public.order_status_distribution cascade;

drop table if exists public.order_analytics cascade;
drop table if exists public.user_analytics cascade;
drop table if exists public.revenue_analytics cascade;

-- Add analytics tables for dashboard

-- Order Analytics Table
create table public.order_analytics (
  id uuid default gen_random_uuid() primary key, -- Ensured UUID is generated
  total_amount decimal(10,2) not null default 0,
  tax_amount decimal(10,2) not null default 0,
  shipping_amount decimal(10,2) not null default 0,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Analytics Table
create table public.user_analytics (
  id uuid default gen_random_uuid() primary key, -- Ensured UUID is generated
  total_users integer not null default 0,
  active_users integer not null default 0,
  user_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Revenue Analytics Table
create table public.revenue_analytics (
  id uuid default gen_random_uuid() primary key, -- Ensured UUID is generated
  amount decimal(10,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Analytics Views

-- Dashboard Metrics View
create or replace view public.dashboard_metrics as
select 
  (select count(*) from public.profiles where role not in ('admin', 'superadmin')) as total_users,
  (select count(*) from public.orders where status in ('pending', 'processing')) as active_orders,
  (select coalesce(sum(amount), 0) from public.revenue_analytics) as total_revenue,
  (select count(*) from public.profiles where status = 'pending' and role not in ('admin', 'superadmin')) as pending_approvals;

-- Revenue Trend View
create or replace view public.revenue_trend as
select 
  to_char(dates.date, 'YYYY-MM-DD') as name,
  coalesce(sum(revenue_analytics.amount), 0) as value
from generate_series(
  current_date - interval '30 days',
  current_date,
  '1 day'::interval
) as dates(date)
left join public.revenue_analytics 
  on date_trunc('day', revenue_analytics.created_at) = dates.date
group by dates.date
order by dates.date;

-- User Trend View
create or replace view public.user_trend as
select 
  to_char(dates.date, 'YYYY-MM-DD') as name,
  count(profiles.id) as value
from generate_series(
  current_date - interval '30 days',
  current_date,
  '1 day'::interval
) as dates(date)
left join public.profiles 
  on date_trunc('day', profiles.created_at) = dates.date
  and profiles.role not in ('admin', 'superadmin')
group by dates.date
order by dates.date;

-- User Distribution View
create or replace view public.user_distribution as
select 
  role as name,
  count(*) as value
from public.profiles
where role not in ('admin', 'superadmin')
group by role;

-- Order Status Distribution View
create or replace view public.order_status_distribution as
select 
  status as name,
  count(*) as value
from public.orders
group by status;

-- Enable Row-Level Security (RLS) for Tables
alter table public.order_analytics enable row level security;
alter table public.user_analytics enable row level security;
alter table public.revenue_analytics enable row level security;

-- Create RLS Policies for Admins
create policy "Admins can view order analytics"
  on public.order_analytics for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'superadmin')
    )
  );

create policy "Admins can view user analytics"
  on public.user_analytics for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'superadmin')
    )
  );

create policy "Admins can view revenue analytics"
  on public.revenue_analytics for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'admin' or profiles.role = 'superadmin')
    )
  );

-- Create Function for Real-Time Metrics
create or replace function get_dashboard_metrics()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
  current_users int;
  previous_users int;
  current_orders int;
  previous_orders int;
  current_revenue decimal;
  previous_revenue decimal;
  current_approvals int;
  previous_approvals int;
begin
  -- Get Current Metrics
  select count(*) into current_users 
  from public.profiles 
  where role not in ('admin', 'superadmin');
  
  select count(*) into current_orders 
  from public.orders 
  where status in ('pending', 'processing');
  
  select coalesce(sum(amount), 0) into current_revenue 
  from public.revenue_analytics 
  where created_at >= current_date - interval '30 days';
  
  select count(*) into current_approvals 
  from public.profiles 
  where status = 'pending' and role not in ('admin', 'superadmin');

  -- Get Previous Metrics
  select count(*) into previous_users 
  from public.profiles 
  where role not in ('admin', 'superadmin')
  and created_at < current_date - interval '30 days';
  
  select count(*) into previous_orders 
  from public.orders 
  where status in ('pending', 'processing')
  and created_at < current_date - interval '30 days';
  
  select coalesce(sum(amount), 0) into previous_revenue 
  from public.revenue_analytics 
  where created_at >= current_date - interval '60 days'
  and created_at < current_date - interval '30 days';
  
  select count(*) into previous_approvals 
  from public.profiles 
  where status = 'pending' 
  and role not in ('admin', 'superadmin')
  and created_at < current_date - interval '30 days';

  -- Calculate Percentage Changes
  select json_build_object(
    'totalUsers', json_build_object(
      'value', current_users,
      'change', case 
        when previous_users = 0 then 0
        else round(((current_users - previous_users)::numeric / previous_users * 100)::numeric, 1)
      end
    ),
    'activeOrders', json_build_object(
      'value', current_orders,
      'change', case 
        when previous_orders = 0 then 0
        else round(((current_orders - previous_orders)::numeric / previous_orders * 100)::numeric, 1)
      end
    ),
    'revenue', json_build_object(
      'value', current_revenue,
      'change', case 
        when previous_revenue = 0 then 0
        else round(((current_revenue - previous_revenue) / previous_revenue * 100)::numeric, 1)
      end
    ),
    'pendingApprovals', json_build_object(
      'value', current_approvals,
      'change', case 
        when previous_approvals = 0 then 0
        else round(((current_approvals - previous_approvals)::numeric / previous_approvals * 100)::numeric, 1)
      end
    )
  ) into result;
  
  return result;
end;
$$;