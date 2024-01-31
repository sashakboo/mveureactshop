create sequence user_id_seq;
alter sequence user_id_seq owner to root;
create sequence basket_id_seq;
alter sequence basket_id_seq owner to root;
create sequence product_id_seq;
alter sequence product_id_seq owner to root;
create sequence product_cat_id_seq;
alter sequence product_cat_id_seq owner to root;
create sequence order_id_seq;
alter sequence order_id_seq owner to root;
create sequence orderitem_id_seq;
alter sequence orderitem_id_seq owner to root;
create sequence orderstate_seq_id;
alter sequence orderstate_seq_id owner to root;
create table productscategory (
  id bigint default nextval(
    'public.product_cat_id_seq' :: REGCLASS
  ) not null constraint productscategory_pk primary key, 
  title varchar(256) not null, 
  active boolean default true not null
);
alter table 
  productscategory owner to root;
alter table 
  productscategory owner to root;
create table products (
  id bigint default nextval(
    'public.product_id_seq' :: REGCLASS
  ) not null constraint products_pk primary key, 
  title varchar(250) not null, 
  category bigint constraint products_productscategory_id_fk references productscategory, 
  price numeric, 
  tag varchar(250), 
  icon bytea, 
  active boolean default true not null
);
alter table 
  products owner to root;
create table users (
  id bigint default nextval('public.user_id_seq' :: REGCLASS) not null constraint users_pk primary key, 
  email varchar(250) not null constraint users_email_uindex unique, 
  password varchar(250) not null, 
  role text default 'user' :: STRING not null, 
  active boolean default true not null
);
alter table 
  users owner to root;
alter table 
  users owner to root;
create table basket (
  id bigint default nextval(
    'public.basket_id_seq' :: REGCLASS
  ) not null constraint basket_pk primary key, 
  customer bigint not null constraint basket_users_id_fk references users, 
  product bigint not null constraint basket_products_id_fk references products
);
alter table 
  basket owner to root;
create table orderstates (
  id bigint default nextval(
    'public.order_id_seq' :: REGCLASS
  ) not null constraint orderstates_pk primary key, 
  name varchar(250) not null constraint orderstates_name_uindex unique, 
  title varchar(250) not null
);
alter table 
  orderstates owner to root;
create table orders (
  id bigint default nextval(
    'public.order_id_seq' :: REGCLASS
  ) not null constraint orders_pk primary key, 
  customer bigint not null constraint orders_users_id_fk references users, 
  state bigint not null constraint orders_orderstates_id_fk references orderstates, 
  created date default now() not null
);
alter table 
  orders owner to root;
create table orderitems (
  id bigint default nextval(
    'public.basket_id_seq' :: REGCLASS
  ) not null constraint orderitems_pk primary key, 
  "orderid" bigint not null constraint orderitems_orders_id_fk references orders, 
  product bigint not null constraint orderitems_products_id_fk references products, 
  "orderprice" numeric
);
alter table 
  orderitems owner to root;
