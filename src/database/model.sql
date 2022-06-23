create database smax;

drop table if exists logins;
create table logins(
    login_id int generated always as identity primary key,
    login_name varchar(128) not null,
    login varchar(128) not null,
    login_password varchar(128) not null
);