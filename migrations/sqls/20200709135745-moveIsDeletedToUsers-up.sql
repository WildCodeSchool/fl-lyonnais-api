/* Replace with your SQL commands */
ALTER TABLE `freelance` 
DROP COLUMN `is_deleted`;

ALTER TABLE `user` 
ADD COLUMN `is_deleted` TINYINT(1) NULL DEFAULT 0 AFTER `is_validated`;
