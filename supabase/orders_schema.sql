-- Create orders table if it doesn't exist
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  order_id text not null, -- Readable ID like ORD-2024-XXXX
  total_amount decimal not null,
  status text default 'Pending' not null,
  shipping_address jsonb,
  billing_address jsonb,
  stripe_payment_intent_id text -- Keeping optional for future use
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create order_items table if it doesn't exist
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text not null, -- Assuming product_id from your product table is text or uuid, adjust if needed
  quantity integer default 1,
  price decimal not null
);

-- Enable RLS
alter table public.order_items enable row level security;

-- Policies
create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );

create policy "Users can insert their own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );
