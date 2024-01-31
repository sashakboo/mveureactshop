insert into public.users(email, password, role, active)
values 
  ('root', '$2a$12$K/35cIvudTfGJvHAtQ6opecxe6bHR16h2sQyfdxkzcdpWheBJejhm', 'admin', true),
  ('admin', '$2a$12$K/35cIvudTfGJvHAtQ6opecxe6bHR16h2sQyfdxkzcdpWheBJejhm', 'admin', true),
  ('test', '$2a$12$K/35cIvudTfGJvHAtQ6opecxe6bHR16h2sQyfdxkzcdpWheBJejhm', 'user', true);

insert into orderstates(name, title)
values
  ('Created', 'Создано'),
  ('Done', 'Выполнено');

insert into productscategory(title, active)
values
  ('Рубашки', true),
  ('Спорт', true),
  ('Верхняя одежда', true);