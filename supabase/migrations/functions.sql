-- Function to get user statistics
create or replace function get_user_statistics(
  start_date timestamp with time zone default null,
  end_date timestamp with time zone default null
)
returns table (
  total_users bigint,
  active_users bigint,
  pending_approvals bigint,
  user_types jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    count(*) as total_users,
    count(*) filter (where last_login > coalesce(start_date, now() - interval '30 days')) as active_users,
    count(*) filter (where status = 'pending') as pending_approvals,
    jsonb_object_agg(role, count(*)) as user_types
  from profiles
  where role not in ('admin', 'superadmin')
  and created_at >= coalesce(start_date, '-infinity'::timestamp)
  and created_at <= coalesce(end_date, 'infinity'::timestamp);
end;
$$;

-- Function to get order statistics
create or replace function get_order_statistics(
  start_date timestamp with time zone default null,
  end_date timestamp with time zone default null
)
returns table (
  total_orders bigint,
  total_revenue numeric,
  average_order_value numeric,
  status_breakdown jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    count(*) as total_orders,
    sum(total_amount) as total_revenue,
    avg(total_amount) as average_order_value,
    jsonb_object_agg(status, count(*)) as status_breakdown
  from orders
  where created_at >= coalesce(start_date, '-infinity'::timestamp)
  and created_at <= coalesce(end_date, 'infinity'::timestamp);
end;
$$;

-- Function to get product statistics
create or replace function get_product_statistics()
returns table (
  total_products bigint,
  active_products bigint,
  low_stock_products bigint,
  out_of_stock_products bigint,
  category_breakdown jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    count(*) as total_products,
    count(*) filter (where status = 'active') as active_products,
    count(*) filter (where stock <= moq) as low_stock_products,
    count(*) filter (where stock = 0) as out_of_stock_products,
    jsonb_object_agg(
      c.name,
      count(*)
    ) as category_breakdown
  from products p
  left join product_categories c on c.id = any(p.categories);
end;
$$;