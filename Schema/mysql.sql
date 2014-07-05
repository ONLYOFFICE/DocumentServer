-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.15


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema onlyoffice
--

CREATE DATABASE IF NOT EXISTS onlyoffice;
USE onlyoffice;

--
-- Definition of table `convert_queue`
--

DROP TABLE IF EXISTS `convert_queue`;
CREATE TABLE `convert_queue` (
  `cq_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cq_data` text NOT NULL,
  `cq_priority` tinyint(3) unsigned NOT NULL,
  `cq_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cq_isbusy` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`cq_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `convert_queue`
--

/*!40000 ALTER TABLE `convert_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `convert_queue` ENABLE KEYS */;


--
-- Definition of table `tast_result`
--

DROP TABLE IF EXISTS `tast_result`;
CREATE TABLE `tast_result` (
  `tr_key` varchar(255) NOT NULL,
  `tr_format` varchar(45) NOT NULL,
  `tr_status` tinyint(3) NOT NULL,
  `tr_status_info` int(10) NOT NULL,
  `tr_last_open_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tr_title` varchar(255) NOT NULL,
  PRIMARY KEY (`tr_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tast_result`
--

/*!40000 ALTER TABLE `tast_result` DISABLE KEYS */;
/*!40000 ALTER TABLE `tast_result` ENABLE KEYS */;


--
-- Definition of table `file_statistic2`
--


DROP TABLE IF EXISTS `file_statistic2`;
CREATE TABLE  `file_statistic2` (
  `fsc_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fsc_affiliate` varchar(255) NOT NULL DEFAULT '',
  `fsc_filename` varchar(255) NOT NULL DEFAULT '',
  `fsc_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fsc_tag` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`fsc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `file_statistic2`
--

/*!40000 ALTER TABLE `file_statistic2` DISABLE KEYS */;
/*!40000 ALTER TABLE `file_statistic2` ENABLE KEYS */;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
