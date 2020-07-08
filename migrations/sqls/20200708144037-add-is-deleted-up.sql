/* Replace with your SQL commands */

alter table freelance
    add is_deleted tinyint(1) null;
alter table freelance alter column is_deleted set default 0;
