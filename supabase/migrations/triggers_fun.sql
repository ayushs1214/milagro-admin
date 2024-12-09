-- Drop existing triggers and functions safely
drop trigger if exists update_products_updated_at on public.products;
drop trigger if exists update_product_variants_updated_at on public.product_variants;
drop trigger if exists process_stock_movement_after_insert on public.stock_movements;
drop trigger if exists process_order_status_change_after_update on public.orders;
drop trigger if exists process_sample_request_status_change_after_update on public.sample_requests;

drop function if exists update_updated_at_column cascade;
drop function if exists process_stock_movement cascade;
drop function if exists process_order_status_change cascade;
drop function if exists process_sample_request_status_change cascade;
drop function if exists process_bulk_upload cascade;

-- Create Functions and Triggers

-- Function: Update timestamps
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger: Update timestamps for products
create trigger update_products_updated_at
  before update on public.products
  for each row
  execute function update_updated_at_column();

-- Trigger: Update timestamps for product variants
create trigger update_product_variants_updated_at
  before update on public.product_variants
  for each row
  execute function update_updated_at_column();

-- Function: Process stock movement
create or replace function process_stock_movement()
returns trigger
language plpgsql
as $$
begin
  -- Update product stock
  if new.type = 'in' then
    update public.products
    set stock = stock + new.quantity,
        inventory_qty = inventory_qty + new.quantity
    where id = new.product_id;
  elsif new.type = 'out' then
    update public.products
    set stock = stock - new.quantity,
        inventory_qty = inventory_qty - new.quantity
    where id = new.product_id;
  elsif new.type = 'adjustment' then
    update public.products
    set stock = new.new_stock,
        inventory_qty = new.new_stock
    where id = new.product_id;
  end if;

  -- Update variant stock if applicable
  if new.variant_id is not null then
    if new.type = 'in' then
      update public.product_variants
      set stock = stock + new.quantity
      where id = new.variant_id;
    elsif new.type = 'out' then
      update public.product_variants
      set stock = stock - new.quantity
      where id = new.variant_id;
    elsif new.type = 'adjustment' then
      update public.product_variants
      set stock = new.new_stock
      where id = new.variant_id;
    end if;
  end if;

  return new;
end;
$$;

-- Trigger: Process stock movement after insert
create trigger process_stock_movement_after_insert
  after insert on public.stock_movements
  for each row
  execute function process_stock_movement();

-- Function: Process order status change
create or replace function process_order_status_change()
returns trigger
language plpgsql
as $$
begin
  -- Record status change in history
  insert into public.order_status_history (
    order_id,
    status,
    created_by
  ) values (
    new.id,
    new.status,
    new.updated_by
  );

  -- Update revenue analytics
  if new.status = 'delivered' then
    insert into public.revenue_analytics (
      amount,
      date
    ) values (
      new.total_amount,
      new.created_at::date
    );
  end if;

  return new;
end;
$$;

-- Trigger: Process order status change after update
create trigger process_order_status_change_after_update
  after update of status on public.orders
  for each row
  when (old.status is distinct from new.status)
  execute function process_order_status_change();

-- Function: Process sample request status change
create or replace function process_sample_request_status_change()
returns trigger
language plpgsql
as $$
begin
  -- Handle stock movement for shipped samples
  if new.status = 'shipped' and old.status != 'shipped' then
    insert into public.stock_movements (
      product_id,
      type,
      quantity,
      previous_stock,
      new_stock,
      reference_type,
      reference_id,
      created_by
    )
    select
      new.product_id,
      'out',
      new.quantity,
      p.stock,
      p.stock - new.quantity,
      'sample',
      new.id,
      auth.uid()
    from public.products p
    where p.id = new.product_id;
  end if;

  return new;
end;
$$;

-- Trigger: Process sample request status change after update
create trigger process_sample_request_status_change_after_update
  after update of status on public.sample_requests
  for each row
  when (old.status is distinct from new.status)
  execute function process_sample_request_status_change();

-- Function: Bulk upload for products
create or replace function process_bulk_upload(
  products_data jsonb
)
returns setof uuid
language plpgsql
security definer
as $$
declare
  product_id uuid;
  product_data jsonb;
begin
  -- Iterate through each product in the input JSON array
  for product_data in select * from jsonb_array_elements(products_data)
  loop
    insert into public.products (
      product_id,
      series_name,
      finished_name,
      colors,
      categories,
      application_type,
      stock,
      price,
      moq,
      msp,
      media,
      manufactured_in,
      size,
      inventory_qty,
      status,
      created_by,
      updated_by
    )
    values (
      (product_data->>'productId')::text,
      (product_data->>'seriesName')::text,
      (product_data->>'finishedName')::text,
      (product_data->'colors')::jsonb,
      (product_data->'categories')::uuid[],
      (product_data->>'applicationType')::text,
      (product_data->>'stock')::integer,
      (product_data->>'price')::decimal,
      (product_data->>'moq')::integer,
      (product_data->>'msp')::decimal,
      (product_data->'media')::jsonb,
      (product_data->>'manufacturedIn')::text,
      (product_data->'size')::jsonb,
      (product_data->>'inventoryQty')::integer,
      'active',
      auth.uid(),
      auth.uid()
    )
    returning id into product_id;

    return next product_id;
  end loop;
end;
$$;