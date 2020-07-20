ALTER TABLE `address` 
CHANGE COLUMN `street` `street` VARCHAR(100) NULL ,
CHANGE COLUMN `zip_code` `zip_code` VARCHAR(11) NULL ,
CHANGE COLUMN `city` `city` VARCHAR(100) NULL ,
CHANGE COLUMN `country` `country` VARCHAR(50) NULL ;
