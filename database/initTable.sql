SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userid` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '/default-avatar.jpg',
  `level` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'root', 'lightnote', 'root@example.com', '/default-avatar.jpg', '0');


-- ----------------------------
-- Table structure for note
-- ----------------------------
DROP TABLE IF EXISTS `note`;
CREATE TABLE `note` (
  `noteid` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `desc` varchar(500) NOT NULL DEFAULT '',
  `public` tinyint unsigned NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `viewCount` int unsigned NOT NULL DEFAULT '0',
  `visitorCount` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`noteid`),
  UNIQUE KEY `notetitle` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of note
-- ----------------------------


-- ----------------------------
-- Table structure for archive
-- ----------------------------
DROP TABLE IF EXISTS `archive`;
CREATE TABLE `archive` (
  `archiveid` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `desc` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`archiveid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of archive
-- ----------------------------


-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `tagid` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`tagid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of tag
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
  `createAt` datetime NOT NULL,
  PRIMARY KEY (`commentid`),
  KEY `from` (`from`),
  KEY `note` (`note`),
  KEY `to` (`to`),
  CONSTRAINT `from` FOREIGN KEY (`from`) REFERENCES `user` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `note` FOREIGN KEY (`note`) REFERENCES `note` (`noteid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `to` FOREIGN KEY (`to`) REFERENCES `user` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of comment
-- ----------------------------


-- ----------------------------
-- Table structure for note_archive
-- ----------------------------
DROP TABLE IF EXISTS `note_archive`;
CREATE TABLE `note_archive` (
  `noteid` int unsigned NOT NULL,
  `archiveid` int unsigned NOT NULL,
  PRIMARY KEY (`noteid`),
  KEY `archive2` (`archiveid`),
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
  PRIMARY KEY (`noteid`),
  KEY `tag1` (`tagid`),
  CONSTRAINT `note1` FOREIGN KEY (`noteid`) REFERENCES `note` (`noteid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag1` FOREIGN KEY (`tagid`) REFERENCES `tag` (`tagid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of note_tag
-- ----------------------------


-- ----------------------------
-- Table structure for star
-- ----------------------------
DROP TABLE IF EXISTS `star`;
CREATE TABLE `star` (
  `starid` int unsigned NOT NULL AUTO_INCREMENT,
  `userid` int unsigned NOT NULL,
  `noteid` int unsigned DEFAULT NULL,
  `tagid` int unsigned DEFAULT NULL,
  `archiveid` int unsigned DEFAULT NULL,
  `commentid` int unsigned DEFAULT NULL,
  PRIMARY KEY (`starid`),
  KEY `user3` (`userid`),
  KEY `note3` (`noteid`),
  KEY `tag3` (`tagid`),
  KEY `archive3` (`archiveid`),
  KEY `comment3` (`commentid`),
  CONSTRAINT `archive3` FOREIGN KEY (`archiveid`) REFERENCES `archive` (`archiveid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment3` FOREIGN KEY (`commentid`) REFERENCES `comment` (`commentid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `note3` FOREIGN KEY (`noteid`) REFERENCES `note` (`noteid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag3` FOREIGN KEY (`tagid`) REFERENCES `tag` (`tagid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user3` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of star
-- ----------------------------
