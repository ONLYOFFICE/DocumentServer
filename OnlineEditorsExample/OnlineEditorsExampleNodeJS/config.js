var config = {}

config.maxFileSize = 5242880;
config.storageFolder = "app_data";

config.viewedDocs = [".ppt", ".pps", ".odp", ".pdf", ".djvu", ".fb2", ".epub", ".xps"];
config.editedDocs = [".docx", ".doc", ".odt", ".xlsx", ".xls", ".ods", ".csv", ".pptx", ".ppsx", ".rtf", ".txt", ".mht", ".html", ".htm"];
config.convertedDocs = [".doc", ".odt", ".xls", ".ods", ".ppt", ".pps", ".odp", ".rtf", ".mht", ".html", ".htm", ".fb2", ".epub"];

config.tenantId = "ContactUs";
config.key = "ContactUs";

config.storageUrl = "https://doc.onlyoffice.com/FileUploader.ashx";
config.converterUrl = "https://doc.onlyoffice.com/ConvertService.ashx";
config.tempStorageUrl = "https://doc.onlyoffice.com/ResourceService.ashx";
config.apiUrl = "https://doc.onlyoffice.com/OfficeWeb/apps/api/documents/api.js?_dc=2014-12-19";
config.preloaderUrl = "https://doc.onlyoffice.com/OfficeWeb/apps/api/documents/cache-scripts.html?_dc=2014-12-19";

config.haveExternalIp = false; //service can access the document on the url

module.exports = config;