# Milagro Admin Dashboard - Backend Documentation

## Overview
This document outlines the comprehensive backend architecture and requirements for the Milagro Admin Dashboard using Supabase as the backend service. The system is designed to handle product management, order processing, user management, and analytics for a tile and sanitaryware business.

## Technology Stack

### Core Infrastructure (Supabase)
1. **PostgreSQL Database**
   - Primary database with PostGIS extension
   - Real-time capabilities
   - Row Level Security (RLS)
   - Database functions and triggers

2. **Supabase Auth**
   - JWT-based authentication
   - Role-based access control
   - Custom claims for permissions
   - OAuth providers (optional)

3. **Supabase Storage**
   - Product images and documents
   - User avatars and signatures
   - Organized bucket structure
   - Access control policies

4. **Supabase Real-time**
   - Order status updates
   - Inventory changes
   - User activity tracking
   - Real-time notifications

5. **Edge Functions**
   - Complex business logic
   - Scheduled tasks
   - External integrations
   - Data processing

### External Services Integration
1. **Email Service (SendGrid/Resend)**
   - Order notifications
   - User registration
   - Password reset
   - Marketing communications

2. **SMS Gateway**
   - Order status updates
   - Delivery notifications
   - OTP verification

3. **Payment Gateway (Razorpay/Stripe)**
   - Payment processing
   - Subscription management
   - Refund handling
   - Payment reconciliation

4. **CDN (Cloudflare/AWS CloudFront)**
   - Static asset delivery
   - Image optimization
   - Global content distribution

## Database Schema

### 1. Authentication & Users

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null unique,
  name text not null,
  role text not null check (role in ('superadmin', 'admin', 'dealer', 'architect', 'builder')),
  status text not null check (status in ('active', 'inactive', 'pending')),
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

-- Admin Profiles
create table public.admin_profiles (
  id uuid references public.users not null primary key,
  department text,
  signature_url text,
  permissions text[] not null default array[]::text[],
  reports_to uuid references public.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Activity Logs
create table public.user_activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2. Product Management

```sql
-- Product Categories
create table public.product_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  parent_id uuid references public.product_categories,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
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
  created_by uuid references public.users not null,
  updated_by uuid references public.users not null,
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
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products not null,
  sku text not null unique,
  color text,
  size jsonb,
  price decimal(10,2) not null check (price > 0),
  stock integer not null check (stock >= 0),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stock Movement
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
  created_by uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 3. Order Management

```sql
-- Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text not null unique,
  user_id uuid references public.users not null,
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
  created_by uuid references public.users not null,
  updated_by uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
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

-- Order Status History
create table public.order_status_history (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders not null,
  status text not null,
  notes text,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shipments
create table public.shipments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders not null,
  tracking_number text,
  carrier text,
  status text not null check (status in (
    'pending', 'picked_up', 'in_transit', 
    'out_for_delivery', 'delivered', 'failed'
  )),
  shipping_label_url text,
  tracking_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 4. Sample Management

```sql
-- Sample Requests
create table public.sample_requests (
  id uuid default uuid_generate_v4() primary key,
  request_number text not null unique,
  user_id uuid references public.users not null,
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

-- Sample Feedback
create table public.sample_feedback (
  id uuid default uuid_generate_v4() primary key,
  sample_id uuid references public.sample_requests not null,
  rating integer not null check (rating between 1 and 5),
  comments text,
  images jsonb default '[]'::jsonb,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 5. Expo Management

```sql
-- Expos
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
  created_by uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Expo Products
create table public.expo_products (
  id uuid default uuid_generate_v4() primary key,
  expo_id uuid references public.expos not null,
  product_id uuid references public.products not null,
  display_order integer,
  special_price decimal(10,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Expo Participants
create table public.expo_participants (
  id uuid default uuid_generate_v4() primary key,
  expo_id uuid references public.expos not null,
  user_id uuid references public.users not null,
  role text not null check (role in ('exhibitor', 'visitor', 'staff')),
  status text not null check (status in ('registered', 'confirmed', 'attended')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Real-time Subscriptions

### 1. Order Updates
```typescript
// Subscribe to order status changes
const orderSubscription = supabase
  .from('orders')
  .on('UPDATE', (payload) => {
    if (payload.new.status !== payload.old.status) {
      // Handle order status change
      notifyOrderStatusChange(payload.new);
    }
  })
  .subscribe();

// Subscribe to new orders
const newOrderSubscription = supabase
  .from('orders')
  .on('INSERT', (payload) => {
    // Handle new order
    notifyNewOrder(payload.new);
  })
  .subscribe();
```

### 2. Inventory Updates
```typescript
// Subscribe to stock changes
const stockSubscription = supabase
  .from('products')
  .on('UPDATE', (payload) => {
    const oldStock = payload.old.stock;
    const newStock = payload.new.stock;
    
    if (newStock !== oldStock) {
      // Check for low stock
      if (newStock <= payload.new.moq) {
        notifyLowStock(payload.new);
      }
      
      // Update real-time inventory dashboard
      updateInventoryStats(payload.new);
    }
  })
  .subscribe();
```

### 3. User Activity
```typescript
// Subscribe to user activity logs
const activitySubscription = supabase
  .from('user_activity_logs')
  .on('INSERT', (payload) => {
    // Update activity feed
    updateActivityFeed(payload.new);
    
    // Check for security alerts
    checkSecurityAlerts(payload.new);
  })
  .subscribe();
```

## Edge Functions

### 1. Order Processing
```typescript
// supabase/functions/process-order/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { order_id } = await req.json()
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  
  try {
    // 1. Get order details
    const { data: order } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', order_id)
      .single()
    
    // 2. Check inventory
    for (const item of order.items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single()
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`)
      }
    }
    
    // 3. Update stock
    for (const item of order.items) {
      await supabase.rpc('decrease_stock', {
        p_id: item.product_id,
        qty: item.quantity
      })
    }
    
    // 4. Update order status
    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order_id)
    
    // 5. Create shipment record
    await supabase
      .from('shipments')
      .insert({
        order_id: order_id,
        status: 'pending'
      })
    
    // 6. Send notifications
    await sendOrderNotifications(order)
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### 2. Inventory Management
```typescript
// supabase/functions/manage-inventory/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { product_id, action, quantity } = await req.json()
  
  try {
    const result = await updateInventory(product_id, action, quantity)
    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function updateInventory(productId: string, action: 'add' | 'remove' | 'set', quantity: number) {
  const supabase = createClient(...)
  
  // Start transaction
  const { data: product } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single()
  
  let newStock = product.stock
  switch (action) {
    case 'add':
      newStock += quantity
      break
    case 'remove':
      newStock -= quantity
      if (newStock < 0) throw new Error('Insufficient stock')
      break
    case 'set':
      newStock = quantity
      break
  }
  
  // Update stock
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .select()
  
  if (error) throw error
  
  // Record stock movement
  await supabase
    .from('stock_movements')
    .insert({
      product_id: productId,
      type: action,
      quantity: quantity,
      previous_stock: product.stock,
      new_stock: newStock
    })
  
  return data
}
```

### 3. Analytics Processing
```typescript
// supabase/functions/process-analytics/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { start_date, end_date } = await req.json()
  
  try {
    const analytics = await generateAnalytics(start_date, end_date)
    return new Response(
      JSON.stringify(analytics),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function generateAnalytics(startDate: string, endDate: string) {
  const supabase = createClient(...)
  
  // Get sales data
  const { data: sales } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .eq('status', 'delivered')
  
  // Get product performance
  const { data: products } = await supabase
    .from('order_items')
    .select(`
      product_id,
      products (name),
      quantity,
      unit_price
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
  
  // Calculate metrics
  const metrics = calculateMetrics(sales, products)
  
  return metrics
}
```

## Storage Configuration

### 1. Bucket Setup
```sql
-- Create storage buckets
insert into storage.buckets (id, name, public) values 
  ('products', 'products', true),
  ('documents', 'documents', false),
  ('avatars', 'avatars', true),
  ('signatures', 'signatures', false);

-- Set up bucket policies
create policy "Public read access for product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'products' and
    auth.role() in ('authenticated')
  );

create policy "Users can manage their own avatars"
  on storage.objects for all
  using (
    bucket_id = 'avatars' and
    auth.uid() = owner
  );
```

### 2. File Organization
```typescript
// File path structure
const getFilePath = (type: string, id: string, filename: string) => {
  switch (type) {
    case 'product':
      return `products/${id}/${filename}`;
    case 'document':
      return `documents/${id}/${filename}`;
    case 'avatar':
      return `avatars/${id}/${filename}`;
    case 'signature':
      return `signatures/${id}/${filename}`;
    default:
      throw new Error('Invalid file type');
  }
};
```

## Security Implementation

### 1. Row Level Security (RLS)
```sql
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.sample_requests enable row level security;

-- User policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'superadmin')
    )
  );

-- Product policies
create policy "Anyone can view active products"
  on public.products for select
  using (status = 'active');

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'superadmin')
    )
  );
```

### 2. Function-level Security
```sql
-- Create secure functions
create function get_sensitive_data(user_id uuid)
returns jsonb
security definer
set search_path = public
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.users
    where id = auth.uid() and role in ('admin', 'superadmin')
  ) then
    raise exception 'Unauthorized';
  end if;
  
  return (
    select jsonb_build_object(
      'business_info', business_info,
      'payment_details', payment_details
    )
    from public.users
    where id = user_id
  );
end;
$$;
```

## Deployment Process

### 1. Database Migrations
```bash
# Generate migration
supabase migration new add_user_preferences

# Apply migrations
supabase db reset
supabase db push

# Generate types
supabase gen types typescript --local > src/types/database.ts
```

### 2. Edge Functions
```bash
# Deploy functions
supabase functions deploy process-order
supabase functions deploy manage-inventory
supabase functions deploy process-analytics

# Set secrets
supabase secrets set SENDGRID_API_KEY=your_api_key
supabase secrets set STRIPE_SECRET_KEY=your_secret_key
```

### 3. Storage Rules
```bash
# Deploy storage rules
supabase storage policy create products public_read
supabase storage policy create documents authenticated_only
```

## Monitoring & Maintenance

### 1. Database Health
```sql
-- Create monitoring functions
create function check_database_health()
returns table (
  metric text,
  value bigint
)
language sql
as $$
  select 'active_connections'::text, count(*)::bigint
  from pg_stat_activity
  union all
  select 'slow_queries'::text, count(*)::bigint
  from pg_stat_activity
  where state = 'active'
    and now() - query_start > interval '30 seconds';
$$;
```

### 2. Performance Optimization
```sql
-- Create indexes
create index idx_products_search 
  on public.products using gin (
    to_tsvector('english',
      coalesce(series_name, '') || ' ' ||
      coalesce(finished_name, '')
    )
  );

create index idx_orders_user_status 
  on public.orders (user_id, status);

-- Analyze tables
analyze public.products;
analyze public.orders;
```

### 3. Backup Strategy
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
supabase db dump -f "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Cleanup old backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

## Error Handling

### 1. Custom Error Types
```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 422, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}
```

### 2. Error Handlers
```typescript
// Global error handler
export const handleError = (error: any) => {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      status: error.status
    };
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error);
  
  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    status: 500
  };
};
```

## Testing Strategy

### 1. Unit Tests
```typescript
// Product service tests
describe('ProductService', () => {
  it('should create product with valid data', async () => {
    const productData = {
      productId: 'TEST001',
      seriesName: 'Test Series',
      finishedName: 'Matte Black',
      price: 100,
      stock: 50
    };
    
    const result = await createProduct(productData);
    expect(result).toHaveProperty('id');
    expect(result.productId).toBe('TEST001');
  });
});
```

### 2. Integration Tests
```typescript
// Order flow tests
describe('Order Processing', () => {
  it('should process order and update inventory', async () => {
    // Create test order
    const order = await createTestOrder();
    
    // Process order
    await processOrder(order.id);
    
    // Verify inventory updated
    const product = await getProduct(order.items[0].productId);
    expect(product.stock).toBe(initialStock - order.items[0].quantity);
    
    // Verify order status
    const updatedOrder = await getOrder(order.id);
    expect(updatedOrder.status).toBe('processing');
  });
});
```

### 3. E2E Tests
```typescript
// Admin dashboard tests
describe('Admin Dashboard', () => {
  it('should allow admin to manage products', async () => {
    // Login as admin
    await loginAsAdmin();
    
    // Create product
    const product = await createProduct(testProductData);
    
    // Update product
    await updateProduct(product.id, { price: 150 });
    
    // Verify changes
    const updated = await getProduct(product.id);
    expect(updated.price).toBe(150);
    
    // Delete product
    await deleteProduct(product.id);
    
    // Verify deletion
    const deleted = await getProduct(product.id);
    expect(deleted).toBeNull();
  });
});
```