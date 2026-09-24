-- Run the entire file once in the project's SQL Editor. Safe to rerun for this schema.
begin;
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create schema if not exists wedding_private;
revoke all on schema wedding_private from public, anon, authenticated;

create table if not exists wedding_private.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table wedding_private.admins enable row level security;
revoke all on wedding_private.admins from public, anon, authenticated;

create or replace function public.is_wedding_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from wedding_private.admins where user_id = auth.uid()); $$;
revoke all on function public.is_wedding_admin() from public, anon, authenticated;
grant execute on function public.is_wedding_admin() to authenticated;

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 30),
  side text not null check (side in ('groom','bride')),
  attendance_status text not null check (attendance_status in ('attending','not_attending')),
  guest_count integer not null,
  meal_status text not null,
  message text not null default '' check (char_length(message) <= 300),
  created_at timestamptz not null default now(),
  constraint attendance_consistent check (
    (attendance_status = 'attending' and guest_count between 1 and 20 and meal_status in ('yes','no','undecided'))
    or (attendance_status = 'not_attending' and guest_count = 0 and meal_status = 'not_applicable')
  )
);
create index if not exists attendance_created_idx on public.attendance(created_at desc, id desc);
alter table public.attendance enable row level security;
revoke all on public.attendance from public, anon, authenticated;
grant insert (id,name,side,attendance_status,guest_count,meal_status,message) on public.attendance to anon, authenticated;
grant select on public.attendance to authenticated;
drop policy if exists attendance_submit on public.attendance;
create policy attendance_submit on public.attendance for insert to anon, authenticated with check (true);
drop policy if exists attendance_admin_read on public.attendance;
create policy attendance_admin_read on public.attendance for select to authenticated using ((select public.is_wedding_admin()));

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  name text not null check (char_length(btrim(name)) between 1 and 30),
  message text not null check (char_length(btrim(message)) between 1 and 300),
  password_hash text not null check (char_length(password_hash) = 60),
  created_at timestamptz not null default now(),
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_until timestamptz
);
create index if not exists guestbook_created_idx on public.guestbook(created_at desc, id desc);
alter table public.guestbook enable row level security;
-- No direct SELECT / INSERT / UPDATE / DELETE, including authenticated non-admins.
-- Public access goes only through narrowly scoped RPCs; hashes never leave the DB.
revoke all on public.guestbook from public, anon, authenticated;

create or replace function public.list_guestbook(p_limit integer default 3, p_offset integer default 0)
returns table(id uuid, name text, message text, created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select g.id,g.name,g.message,g.created_at from public.guestbook g
  order by g.created_at desc,g.id desc
  limit least(greatest(coalesce(p_limit,3),1),20) offset greatest(coalesce(p_offset,0),0);
$$;

create or replace function public.create_guestbook(p_name text, p_message text, p_password text, p_request_id uuid)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare result uuid;
begin
  if p_name is null or char_length(btrim(p_name)) not between 1 and 30
     or p_message is null or char_length(btrim(p_message)) not between 1 and 300
     or p_password is null or char_length(p_password) not between 6 and 64
     or octet_length(p_password) > 72 or char_length(btrim(p_password)) = 0 or p_request_id is null then
    raise exception 'Invalid input' using errcode = '22023';
  end if;
  insert into public.guestbook(request_id,name,message,password_hash)
  values (p_request_id,btrim(p_name),btrim(p_message),extensions.crypt(p_password,extensions.gen_salt('bf',10)))
  on conflict (request_id) do nothing returning id into result;
  if result is null then select g.id into result from public.guestbook g where g.request_id=p_request_id; end if;
  return result;
end;
$$;

create or replace function public.delete_guestbook(p_id uuid, p_password text)
returns text language plpgsql security definer set search_path = ''
as $$
declare entry public.guestbook%rowtype;
begin
  if p_password is null or octet_length(p_password) > 72 or char_length(p_password) not between 6 and 64 then
    return 'wrong_password';
  end if;
  select * into entry from public.guestbook where id=p_id for update;
  if not found then return 'not_found'; end if;
  if entry.locked_until > now() then return 'locked'; end if;
  if entry.password_hash = extensions.crypt(p_password,entry.password_hash) then
    delete from public.guestbook where id=p_id;
    return 'deleted';
  end if;
  if entry.locked_until is not null and entry.locked_until <= now() then entry.failed_attempts := 0; end if;
  update public.guestbook set failed_attempts=entry.failed_attempts+1,
    locked_until=case when entry.failed_attempts+1 >= 5 then now()+interval '5 minutes' else null end where id=p_id;
  return 'wrong_password';
end;
$$;

revoke all on function public.list_guestbook(integer,integer) from public, anon, authenticated;
revoke all on function public.create_guestbook(text,text,text,uuid) from public, anon, authenticated;
revoke all on function public.delete_guestbook(uuid,text) from public, anon, authenticated;
grant execute on function public.list_guestbook(integer,integer) to anon, authenticated;
grant execute on function public.create_guestbook(text,text,text,uuid) to anon, authenticated;
grant execute on function public.delete_guestbook(uuid,text) to anon, authenticated;
notify pgrst, 'reload schema';
commit;
