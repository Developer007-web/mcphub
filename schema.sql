create table users (
  id uuid primary key,
  email text unique not null,
  username text,
  created_at timestamp default now()
);

create table servers (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id),

  name text not null,

  description text,

  github_url text,

  category text,

  install_command text,

  likes integer default 0,

  views integer default 0,

  created_at timestamp default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),

  server_id uuid references servers(id),

  tag_name text
);

create table favorites (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id),

  server_id uuid references servers(id)
);