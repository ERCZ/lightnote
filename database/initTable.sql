SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for archive
-- ----------------------------
DROP TABLE IF EXISTS `archive`;
CREATE TABLE `archive` (
  `archiveid` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `desc` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`archiveid`),
  UNIQUE KEY `archivename` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of archive
-- ----------------------------

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `commentid` int unsigned NOT NULL AUTO_INCREMENT,
  `from` int unsigned DEFAULT NULL,
  `to` int unsigned DEFAULT NULL,
  `note` int unsigned NOT NULL,
  `content` varchar(1000) NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`commentid`),
  KEY `from` (`from`),
  KEY `note` (`note`),
  KEY `to` (`to`),
  CONSTRAINT `from` FOREIGN KEY (`from`) REFERENCES `user` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `note` FOREIGN KEY (`note`) REFERENCES `note` (`noteid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `to` FOREIGN KEY (`to`) REFERENCES `user` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for note
-- ----------------------------
DROP TABLE IF EXISTS `note`;
CREATE TABLE `note` (
  `noteid` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `desc` varchar(500) NOT NULL DEFAULT '',
  `friendlyName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `public` tinyint unsigned NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `viewCount` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`noteid`),
  UNIQUE KEY `notetitle` (`title`),
  UNIQUE KEY `friendlyName` (`friendlyName`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of note
-- ----------------------------

-- ----------------------------
-- Table structure for note_archive
-- ----------------------------
DROP TABLE IF EXISTS `note_archive`;
CREATE TABLE `note_archive` (
  `noteid` int unsigned NOT NULL,
  `archiveid` int unsigned NOT NULL,
  KEY `archive2` (`archiveid`),
  KEY `note2` (`noteid`) USING BTREE,
  CONSTRAINT `archive2` FOREIGN KEY (`archiveid`) REFERENCES `archive` (`archiveid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `note2` FOREIGN KEY (`noteid`) REFERENCES `note` (`noteid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of note_archive
-- ----------------------------

-- ----------------------------
-- Table structure for note_tag
-- ----------------------------
DROP TABLE IF EXISTS `note_tag`;
CREATE TABLE `note_tag` (
  `noteid` int unsigned NOT NULL,
  `tagid` int unsigned NOT NULL,
  KEY `note1` (`noteid`),
  KEY `tag1` (`tagid`),
  CONSTRAINT `note1` FOREIGN KEY (`noteid`) REFERENCES `note` (`noteid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag1` FOREIGN KEY (`tagid`) REFERENCES `tag` (`tagid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of note_tag
-- ----------------------------

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `tagid` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`tagid`),
  UNIQUE KEY `tagname` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of tag
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userid` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `level` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'root', '26b3c11214f62fd46ed24913f0df2506368bf7bc6fc2d6526f501354eed20d77', 'root@example.com', '0');

-- ----------------------------
-- View structure for userinfo
-- ----------------------------
DROP VIEW IF EXISTS `userinfo`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `userinfo` AS select `user`.`userid` AS `userid`,`user`.`username` AS `username` from `user` ;
