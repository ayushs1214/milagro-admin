-- Add indexes for frequently queried columns
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_profiles_email on public.profiles(email);

create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_product_id on public.products(product_id);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_created_at on public.orders(created_at);

create index if not exists idx_sample_requests_status on public.sample_requests(status);
create index if not exists idx_sample_requests_user_id on public.sample_requests(user_id);

create index if not exists idx_user_activity_logs_user_id on public.user_activity_logs(user_id);
create index if not exists idx_user_activity_logs_created_at on public.user_activity_logs(created_at);

-- Add GIN indexes for JSON/JSONB columns
create index if not exists idx_products_colors_gin on public.products using gin (colors);
create index if not exists idx_products_media_gin on public.products using gin (media);
create index if not exists idx_products_specifications_gin on public.products using gin (specifications);

create index if not exists idx_orders_items_gin on public.orders using gin (items);
create index if not exists idx_orders_payment_details_gin on public.orders using gin (payment_details);

-- Add text search indexes
create index if not exists idx_products_search on public.products using gin (
  to_tsvector('english',
    coalesce(product_id, '') || ' ' ||
    coalesce(series_name, '') || ' ' ||
    coalesce(finished_name, '')
  )
);

create index if not exists idx_profiles_search on public.profiles using gin (
  to_tsvector('english',
    coalesce(name, '') || ' ' ||
    coalesce(email, '')
  )
);