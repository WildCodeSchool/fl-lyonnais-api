/* Replace with your SQL commands */
ALTER TABLE `user`
CHANGE COLUMN `firstname` `firstname` VARCHAR(100) NULL ,
CHANGE COLUMN `lastname` `lastname` VARCHAR(150) NULL ,
CHANGE COLUMN `email` `email` VARCHAR(100) NULL ,
CHANGE COLUMN `password` `password` VARCHAR(200) NULL ,
CHANGE COLUMN `last_connection_date` `last_connection_date` DATE NULL ,
CHANGE COLUMN `registration_date` `registration_date` DATE NULL ,
CHANGE COLUMN `key` `key` VARCHAR(20) NULL ;