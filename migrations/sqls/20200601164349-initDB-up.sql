CREATE TABLE `address`
(
    `id`       int          NOT NULL AUTO_INCREMENT,
    `street`   varchar(100) NOT NULL,
    `zip_code` varchar(11)  NOT NULL,
    `city`     varchar(100) NOT NULL,
    `country`  varchar(50)  NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `user`
(
    `id`                   int          NOT NULL AUTO_INCREMENT,
    `firstname`            varchar(100) NOT NULL,
    `lastname`             varchar(150) NOT NULL,
    `email`                varchar(100) NOT NULL,
    `password`             varchar(45)  NOT NULL,
    `siret`                varchar(20) DEFAULT NULL,
    `last_connection_date` date         NOT NULL,
    `registration_date`    date         NOT NULL,
    `key`                  varchar(20)  NOT NULL,
    `is_admin`             tinyint     DEFAULT NULL,
    `is_validated`         tinyint     DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `freelance`
(
    `id`                     int        NOT NULL AUTO_INCREMENT,
    `url_photo`              varchar(255) DEFAULT NULL,
    `phone_number`           varchar(20)  DEFAULT NULL,
    `average_daily_rate`     int          DEFAULT NULL,
    `url_web_site`           varchar(255) DEFAULT NULL,
    `job_title`              varchar(100) DEFAULT NULL,
    `bio`                    text,
    `vat_number`             varchar(15)  DEFAULT NULL,
    `last_modification_date` datetime   NOT NULL,
    `is_active`              tinyint(1) NOT NULL,
    `address_id`             int          DEFAULT NULL,
    `user_id`                int          DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_address_id_idx` (`address_id`),
    KEY `freelance_user_id_fk` (`user_id`),
    CONSTRAINT `fk_address_id` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `freelance_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `reference`
(
    `id`    int         NOT NULL AUTO_INCREMENT,
    `name`  varchar(45) NOT NULL,
    `image` varchar(255) DEFAULT NULL,
    `url`   varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `tag`
(
    `id`      int         NOT NULL AUTO_INCREMENT,
    `name`    varchar(45) NOT NULL,
    `content` text,
    `slug`    varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `freelance_reference`
(
    `freelance_id` int NOT NULL,
    `reference_id` int NOT NULL,
    KEY `fk_freelance_id_idx` (`freelance_id`),
    KEY `fk_reference_id_idx` (`reference_id`),
    CONSTRAINT `fk_freelance_id` FOREIGN KEY (`freelance_id`) REFERENCES `freelance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reference_id` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `freelance_tag`
(
    `freelance_id` int NOT NULL,
    `tag_id`       int NOT NULL,
    KEY `fr_freelance_id_idx` (`freelance_id`),
    KEY `fk_tag_id_idx` (`tag_id`),
    CONSTRAINT `fk_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fr_freelance_id` FOREIGN KEY (`freelance_id`) REFERENCES `freelance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `generic_page`
(
    `id`          int          NOT NULL AUTO_INCREMENT,
    `slug`        varchar(255) NOT NULL,
    `title`       varchar(255) DEFAULT NULL,
    `link_name`   varchar(20)  NOT NULL,
    `content`     text         NOT NULL,
    `description` varchar(150) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;