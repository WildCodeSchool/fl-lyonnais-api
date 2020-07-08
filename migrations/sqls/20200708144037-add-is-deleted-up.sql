/* Replace with your SQL commands */

alter table freelance
    add is_deleted tinyint(1) null;
alter table freelance alter column is_deleted set default 0;

UPDATE freelance SET random_id = LEFT(MD5(RAND()), 8);
UPDATE freelance SET is_deleted = 0