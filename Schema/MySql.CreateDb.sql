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

CREATE DATABASE IF NOT EXISTS onlyoffice DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
USE onlyoffice;

--
-- Drop tables
--
DROP TABLE IF EXISTS `doc_callbacks`;
DROP TABLE IF EXISTS `doc_changes`;
DROP TABLE IF EXISTS `doc_pucker`;

--
-- Definition of table `convert_queue`
--

CREATE TABLE IF NOT EXISTS `convert_queue` (
  `cq_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cq_data` text NOT NULL,
  `cq_priority` tinyint(3) unsigned NOT NULL,
  `cq_create_time` timestamp(3) NOT NULL DEFAULT '0000-00-00 00:00:00.000',  
  `cq_update_time` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `cq_isbusy` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`cq_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `convert_queue`
--

/*!40000 ALTER TABLE `convert_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `convert_queue` ENABLE KEYS */;

--
-- Definition of table `doc_callbacks`
--

CREATE TABLE IF NOT EXISTS `doc_callbacks` (
  `dc_key` varchar(255) NOT NULL,
  `dc_callback` text NOT NULL,
  PRIMARY KEY (`dc_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `doc_callbacks`
--

/*!40000 ALTER TABLE `doc_callbacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `doc_callbacks` ENABLE KEYS */;

--
-- Definition of table `doc_changes`
--

CREATE TABLE IF NOT EXISTS `doc_changes` (
  `dc_key` varchar(255) NOT NULL,
  `dc_change_id` int(10) unsigned NOT NULL,
  `dc_user_id` varchar(255) NOT NULL,
  `dc_user_id_original` varchar(255) NOT NULL,
  `dc_user_name` varchar(255) NOT NULL,
  `dc_data` longtext NOT NULL,
  `dc_date` datetime NOT NULL,
  PRIMARY KEY (`dc_key`,`dc_change_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `doc_changes`
--

/*!40000 ALTER TABLE `doc_changes` DISABLE KEYS */;
/*!40000 ALTER TABLE `doc_changes` ENABLE KEYS */;

--
-- Definition of table `doc_pucker`
--

CREATE TABLE IF NOT EXISTS `doc_pucker` (
  `dp_key` varchar(255) NOT NULL,
  `dp_callback` text NOT NULL,
  `dp_documentFormatSave` int(10) NOT NULL,
  `dp_indexUser` int(10) NOT NULL,
  PRIMARY KEY (`dp_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `doc_pucker`
--

/*!40000 ALTER TABLE `doc_pucker` DISABLE KEYS */;
/*!40000 ALTER TABLE `doc_pucker` ENABLE KEYS */;

--
-- Definition of table `tast_result`
--

CREATE TABLE IF NOT EXISTS `tast_result` (
  `tr_key` varchar(255) NOT NULL,
  `tr_format` varchar(45) NOT NULL,
  `tr_status` tinyint(3) NOT NULL,
  `tr_status_info` int(10) NOT NULL,
  `tr_last_open_date` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
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


CREATE TABLE IF NOT EXISTS `file_statistic2` (
  `fsc_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fsc_affiliate` varchar(255) NOT NULL DEFAULT '',
  `fsc_filename` varchar(255) NOT NULL DEFAULT '',
  `fsc_time` timestamp(3) NOT NULL DEFAULT '0000-00-00 00:00:00.000',
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
