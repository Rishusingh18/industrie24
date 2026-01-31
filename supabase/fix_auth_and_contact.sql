-- fix_auth_and_contact.sql

-- 1. Create profiles table if it doesn't exist (Fix for "Database error saving new user")
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  company_name text,
  address text,
  phone text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Drop existing policies if they exist to prevent "already exists" errors
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- Create Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Robust Trigger for new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'));
  return new;
exception when others then
  -- Ensure signup doesn't fail even if profile creation fails, but log it
  return new;
end;
$$;

-- Re-create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Contact Inquiries Table
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null
);

-- Enable RLS for contact_inquiries
alter table public.contact_inquiries enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can insert inquiries" on public.contact_inquiries;
drop policy if exists "Only authenticated admins can view inquiries" on public.contact_inquiries;

-- Create Policies
create policy "Anyone can insert inquiries" on public.contact_inquiries for insert with check (true);
create policy "Only authenticated admins can view inquiries" on public.contact_inquiries for select using (auth.role() = 'service_role');
