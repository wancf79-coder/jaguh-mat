-- =========================================================
-- Jaguh Mat — papan skor online (Supabase)
-- Jalankan sekali dalam SQL Editor projek Supabase.
-- Semua akses dari app melalui fungsi RPC sahaja;
-- jadual dikunci (RLS tanpa polisi + REVOKE).
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------- Jadual ----------
create table if not exists public.mk_players (
  id            uuid primary key default gen_random_uuid(),
  nickname      text not null,
  nickname_key  text generated always as (lower(nickname)) stored unique,
  tahun         smallint not null check (tahun between 1 and 3),
  sekolah       text not null default '',
  negeri        text not null default '',
  pin_hash      text not null,
  token         uuid not null default gen_random_uuid() unique,
  failed_logins int not null default 0,
  locked_until  timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.mk_scores (
  id          bigint generated always as identity primary key,
  player_id   uuid not null references public.mk_players(id) on delete cascade,
  tahun       smallint not null check (tahun between 1 and 3),
  bab_id      text not null check (bab_id ~ '^t[1-3]b[0-9]{1,2}$'),
  score       int not null check (score between 0 and 5000),
  correct     smallint not null,
  total       smallint not null,
  duration_ms int not null,
  created_at  timestamptz not null default now()
);

create index if not exists mk_scores_player_idx on public.mk_scores(player_id);
create index if not exists mk_scores_bab_idx on public.mk_scores(bab_id, score desc);
create index if not exists mk_scores_created_idx on public.mk_scores(created_at);

alter table public.mk_players enable row level security;
alter table public.mk_scores  enable row level security;
revoke all on public.mk_players, public.mk_scores from anon, authenticated;

-- ---------- Daftar ----------
create or replace function public.mk_register(
  p_nickname text, p_tahun int, p_sekolah text, p_negeri text, p_pin text)
returns json language plpgsql security definer
set search_path = public, extensions as $$
declare v public.mk_players;
begin
  p_nickname := btrim(coalesce(p_nickname,''));
  if p_nickname !~ '^[A-Za-z0-9 _.-]{3,20}$' then raise exception 'BAD_NICKNAME'; end if;
  if coalesce(p_pin,'') !~ '^[0-9]{4,6}$' then raise exception 'BAD_PIN'; end if;
  if p_tahun not between 1 and 3 then raise exception 'BAD_TAHUN'; end if;
  begin
    insert into public.mk_players(nickname, tahun, sekolah, negeri, pin_hash)
    values (p_nickname, p_tahun, left(btrim(coalesce(p_sekolah,'')),60),
            left(btrim(coalesce(p_negeri,'')),30), crypt(p_pin, gen_salt('bf')))
    returning * into v;
  exception when unique_violation then raise exception 'NICKNAME_TAKEN';
  end;
  return json_build_object('token',v.token,'nickname',v.nickname,'tahun',v.tahun,
                           'sekolah',v.sekolah,'negeri',v.negeri);
end $$;

-- ---------- Log masuk (peranti lain) ----------
create or replace function public.mk_login(p_nickname text, p_pin text)
returns json language plpgsql security definer
set search_path = public, extensions as $$
declare v public.mk_players;
begin
  select * into v from public.mk_players where nickname_key = lower(btrim(coalesce(p_nickname,'')));
  if not found then raise exception 'NOT_FOUND'; end if;
  if v.locked_until is not null and v.locked_until > now() then raise exception 'LOCKED'; end if;
  if v.pin_hash <> crypt(coalesce(p_pin,''), v.pin_hash) then
    update public.mk_players
       set failed_logins = failed_logins + 1,
           locked_until = case when failed_logins + 1 >= 5 then now() + interval '15 minutes' end
     where id = v.id;
    raise exception 'BAD_PIN';
  end if;
  update public.mk_players set failed_logins = 0, locked_until = null where id = v.id;
  return json_build_object('token',v.token,'nickname',v.nickname,'tahun',v.tahun,
                           'sekolah',v.sekolah,'negeri',v.negeri);
end $$;

-- ---------- Kemas kini profil (naik tahun / tukar sekolah) ----------
create or replace function public.mk_update_profile(p_token uuid, p_tahun int, p_sekolah text, p_negeri text)
returns json language plpgsql security definer
set search_path = public, extensions as $$
declare v public.mk_players;
begin
  if p_tahun not between 1 and 3 then raise exception 'BAD_TAHUN'; end if;
  update public.mk_players
     set tahun = p_tahun, sekolah = left(btrim(coalesce(p_sekolah,'')),60),
         negeri = left(btrim(coalesce(p_negeri,'')),30)
   where token = p_token returning * into v;
  if not found then raise exception 'BAD_TOKEN'; end if;
  return json_build_object('token',v.token,'nickname',v.nickname,'tahun',v.tahun,
                           'sekolah',v.sekolah,'negeri',v.negeri);
end $$;

-- ---------- Hantar skor kuiz ----------
create or replace function public.mk_submit_score(
  p_token uuid, p_bab_id text, p_score int, p_correct int, p_total int, p_duration_ms int)
returns json language plpgsql security definer
set search_path = public, extensions as $$
declare v_pid uuid; v_last timestamptz; v_best int; v_rank bigint; v_n bigint; v_tahun int;
begin
  select id into v_pid from public.mk_players where token = p_token;
  if v_pid is null then raise exception 'BAD_TOKEN'; end if;
  if p_bab_id !~ '^t[1-3]b[0-9]{1,2}$' then raise exception 'BAD_BAB'; end if;
  if p_total not between 5 and 20 or p_correct not between 0 and p_total
     or p_score not between 0 and p_total * 200 or p_score > p_correct * 200
     or p_duration_ms < p_total * 800 then
    raise exception 'BAD_SCORE';
  end if;
  select max(created_at) into v_last from public.mk_scores where player_id = v_pid;
  if v_last is not null and v_last > now() - interval '20 seconds' then raise exception 'TOO_FAST'; end if;
  v_tahun := substr(p_bab_id,2,1)::int;
  insert into public.mk_scores(player_id,tahun,bab_id,score,correct,total,duration_ms)
  values (v_pid, v_tahun, p_bab_id, p_score, p_correct, p_total, p_duration_ms);

  with best as (select player_id, max(score) b from public.mk_scores where bab_id = p_bab_id group by 1),
       r as (select player_id, b, rank() over (order by b desc) rk, count(*) over () n from best)
  select b, rk, n into v_best, v_rank, v_n from r where player_id = v_pid;
  return json_build_object('best',v_best,'rank',v_rank,'players',v_n);
end $$;

-- ---------- Papan skor ----------
-- Mata = jumlah skor terbaik setiap bab (atau skor terbaik bab tertentu).
create or replace function public.mk_leaderboard(
  p_tahun int default null, p_bab_id text default null, p_period text default 'all',
  p_sekolah text default null, p_limit int default 50)
returns table(rank bigint, nickname text, sekolah text, negeri text, tahun smallint, points bigint, quizzes bigint)
language sql stable security definer
set search_path = public, extensions as $$
  with s as (
    select * from public.mk_scores
     where (p_bab_id is null or bab_id = p_bab_id)
       and (p_tahun is null or tahun = p_tahun)
       and (coalesce(p_period,'all') = 'all'
            or created_at >= (date_trunc('week', now() at time zone 'Asia/Kuala_Lumpur') at time zone 'Asia/Kuala_Lumpur'))
  ), best as (
    select player_id, bab_id, max(score) b from s group by 1,2
  ), agg as (
    select a.player_id, sum(a.b)::bigint pts, count(*)::bigint q
      from best a join public.mk_players p on p.id = a.player_id
     where p_sekolah is null or lower(p.sekolah) = lower(btrim(p_sekolah))
     group by 1
  )
  select rank() over (order by a.pts desc), p.nickname, p.sekolah, p.negeri, p.tahun, a.pts, a.q
    from agg a join public.mk_players p on p.id = a.player_id
   order by a.pts desc, p.nickname
   limit least(greatest(coalesce(p_limit,50),1),100);
$$;

-- Kedudukan pemain sendiri (dengan penapis yang sama)
create or replace function public.mk_my_rank(
  p_token uuid, p_tahun int default null, p_bab_id text default null,
  p_period text default 'all', p_sekolah text default null)
returns json language sql stable security definer
set search_path = public, extensions as $$
  with s as (
    select * from public.mk_scores
     where (p_bab_id is null or bab_id = p_bab_id)
       and (p_tahun is null or tahun = p_tahun)
       and (coalesce(p_period,'all') = 'all'
            or created_at >= (date_trunc('week', now() at time zone 'Asia/Kuala_Lumpur') at time zone 'Asia/Kuala_Lumpur'))
  ), best as (
    select player_id, bab_id, max(score) b from s group by 1,2
  ), agg as (
    select a.player_id, sum(a.b)::bigint pts
      from best a join public.mk_players p on p.id = a.player_id
     where p_sekolah is null or lower(p.sekolah) = lower(btrim(p_sekolah))
     group by 1
  ), r as (
    select player_id, pts, rank() over (order by pts desc) rk, count(*) over () n from agg
  )
  select json_build_object('rank', r.rk, 'points', r.pts, 'players', r.n)
    from r join public.mk_players p on p.id = r.player_id
   where p.token = p_token;
$$;

-- ---------- Kebenaran ----------
revoke execute on function public.mk_register(text,int,text,text,text) from public;
revoke execute on function public.mk_login(text,text) from public;
revoke execute on function public.mk_update_profile(uuid,int,text,text) from public;
revoke execute on function public.mk_submit_score(uuid,text,int,int,int,int) from public;
revoke execute on function public.mk_leaderboard(int,text,text,text,int) from public;
revoke execute on function public.mk_my_rank(uuid,int,text,text,text) from public;

grant execute on function public.mk_register(text,int,text,text,text) to anon, authenticated;
grant execute on function public.mk_login(text,text) to anon, authenticated;
grant execute on function public.mk_update_profile(uuid,int,text,text) to anon, authenticated;
grant execute on function public.mk_submit_score(uuid,text,int,int,int,int) to anon, authenticated;
grant execute on function public.mk_leaderboard(int,text,text,text,int) to anon, authenticated;
grant execute on function public.mk_my_rank(uuid,int,text,text,text) to anon, authenticated;
