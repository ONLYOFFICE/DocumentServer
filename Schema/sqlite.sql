DROP TABLE IF EXISTS `convert_queue`;
CREATE TABLE `convert_queue` (
  `cq_id` INTEGER PRIMARY KEY,
  `cq_data` text NOT NULL,
  `cq_priority` tinyint(3) NOT NULL,
  `cq_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cq_isbusy` tinyint(3) NOT NULL
);

DROP TABLE IF EXISTS `tast_result`;
CREATE TABLE `tast_result` (
  `tr_key` varchar(255) NOT NULL,
  `tr_format` varchar(45) NOT NULL,
  `tr_status` tinyint(3) NOT NULL,
  `tr_status_info` int(10) NOT NULL,
  `tr_last_open_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tr_title` varchar(255) NOT NULL,
  PRIMARY KEY (`tr_key`)
);

DROP TABLE IF EXISTS `file_statistic2`;
CREATE TABLE  `file_statistic2` (
  `fsc_id` INTEGER PRIMARY KEY,
  `fsc_affiliate` varchar(255) NOT NULL DEFAULT '',
  `fsc_filename` varchar(255) NOT NULL DEFAULT '',
  `fsc_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fsc_tag` varchar(255) NOT NULL DEFAULT ''
);
