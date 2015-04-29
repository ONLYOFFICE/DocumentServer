var config = require("../config");

var fileUtility = {}

fileUtility.getFileName = function (url, withoutExtension) {
    if (!url) return null;

    var filename;

    if (config.tempStorageUrl && url.indexOf(config.tempStorageUrl) == 0) {
        var params = getUrlParams(url);
        filename = params == null ? null : params["filename"];
    } else {
        var parts = url.toLowerCase().split("/");
        fileName = parts.pop();
    }
    
    if (withoutExtension) {
        var ext = fileUtility.getFileExtension(fileName);
        return fileName.replace(ext, "");
    }

    return fileName;
};

fileUtility.getFileExtension = function (url, withoutDot) {
    if (!url) return null;

    var fileName = fileUtility.getFileName(url);
    
    var parts = fileName.toLowerCase().split(".");

    return withoutDot ? parts.pop() : "." + parts.pop();
};

fileUtility.getFileType = function(url)
{
    var ext = fileUtility.getFileExtension(url);
    
    if (fileUtility.documentExts.indexOf(ext) != -1) return fileUtility.fileType.text;
    if (fileUtility.spreadsheetExts.indexOf(ext) != -1) return fileUtility.fileType.spreadsheet;
    if (fileUtility.presentationExts.indexOf(ext) != -1) return fileUtility.fileType.presentation;
    
    return fileUtility.fileType.text;
}

fileUtility.fileType = {
    text: "text",
    spreadsheet: "spreadsheet",
    presentation: "presentation"
}

fileUtility.documentExts = [".docx", ".doc", ".odt", ".rtf", ".txt",".html", ".htm", ".mht", ".pdf", ".djvu",".fb2", ".epub", ".xps"];

fileUtility.spreadsheetExts = [".xls", ".xlsx", ".ods", ".csv"];

fileUtility.presentationExts = [".ppt", ".pptx", ".odp"];

function getUrlParams(url)
{
    try {
        var query = url.split("?").pop();
        var params = query.split("&");
        var map = {};
        for (var i = 0; i < params.length; i++)  
        {  
            var parts = param.split("=");  
            map[parts[0]] = parts[1];  
        }
        return map;
    }
    catch (ex)
    {
        return null;
    }
}

module.exports = fileUtility;