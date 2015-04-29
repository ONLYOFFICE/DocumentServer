var path = require("path");
var urllib = require("urllib");
var syncRequest = require("sync-request");
var fileSystem = require("fs");
var xml2js = require("xml2js");
var fileUtility = require("./fileUtility");
var cacheManager = require("./cacheManager");
var guidManager = require("./guidManager");
var signatureManager = require("./signatureManager");
var config = require("../config");

var serviceConverter = {};

serviceConverter.convertParams = "?url={0}&outputtype={1}&filetype={2}&title={3}&key={4}&vkey={5}";
serviceConverter.userIp = null;

serviceConverter.getConvertedUri = function (documentUri, fromExtension, toExtension, documentRevisionId)
{
    var xml = serviceConverter.sendRequestToConvertService(documentUri, fromExtension, toExtension, documentRevisionId);

    var res = serviceConverter.getResponseUri(xml);

    return res;
}

serviceConverter.getConvertedUriAsync = function (documentUri, fromExtension, toExtension, documentRevisionId, callback) {
    
    fromExtension = fromExtension || fileUtility.getFileExtension(documentUri);
    
    var title = fileUtility.getFileName(documentUri) || guidManager.newGuid();
    
    documentRevisionId = serviceConverter.generateRevisionId(documentRevisionId || documentUri);
    
    var validateKey = serviceConverter.generateValidateKey(documentRevisionId, false);
    
    var params = serviceConverter.convertParams.format(
        encodeURIComponent(documentUri), 
        toExtension.replace(".", ""),
        fromExtension.replace(".", ""),
        title,
        documentRevisionId,
        validateKey);
    
    urllib.request(config.converterUrl + params, callback);
}

serviceConverter.getExternalUri = function (fileStream, contentLength, contentType, documentRevisionId)
{
    var validateKey = serviceConverter.generateValidateKey(documentRevisionId, false);

    var params = serviceConverter.convertParams.format("", "", "", "", documentRevisionId, validateKey);
    
    var urlTostorage = config.storageUrl + params;

    var response = syncRequest("POST", urlTostorage, {
        headers: {
        "Content-Type": contentType == null ? "application/octet-stream" : contentType,
        "Content-Length": contentLength.toString(),
        "charset": "utf-8"
        },
        body : fileStream
    });

    var res = serviceConverter.getResponseUri(response.body.toString());

    return res.value;
}

serviceConverter.generateRevisionId = function (expectedKey)
{
    if (expectedKey.length > 20) {
        expectedKey = expectedKey.hashCode().toString();
    }
    
    var key = expectedKey.replace(new RegExp("[^0-9-.a-zA-Z_=]", "g"), "_");
    
    return key.substring(0, Math.min(key.length, 20));
}

serviceConverter.generateValidateKey = function (documentRevisionId, addHostForValidate)
{
    if (!documentRevisionId) return "";

    var expdate = new Date();
    var key = config.tenantId || "";
    var userCount = 0;
    var userIp = addHostForValidate ? serviceConverter.userIp : null;
    var skey = config.key || "";

    return signatureManager.create(expdate, documentRevisionId, key, userCount, userIp, skey);
}

serviceConverter.sendRequestToConvertService = function (documentUri, fromExtension, toExtension, documentRevisionId)
{
    fromExtension = fromExtension || fileUtility.getFileExtension(documentUri);

    var title = fileUtility.getFileName(documentUri) || guidManager.newGuid();

    documentRevisionId = serviceConverter.generateRevisionId(documentRevisionId || documentUri);

    var validateKey = serviceConverter.generateValidateKey(documentRevisionId, false);

    var params = serviceConverter.convertParams.format(
        encodeURIComponent(documentUri), 
        toExtension.replace(".", ""),
        fromExtension.replace(".", ""),
        title,
        documentRevisionId,
        validateKey);

    var res = syncRequest("GET", config.converterUrl + params);
    return res.getBody("utf8");
}

serviceConverter.processConvertServiceResponceError = function (errorCode)
{
    var errorMessage = "";
    var errorMessageTemplate = "Error occurred in the ConvertService: ";

    switch (errorCode)
    {
        case -20:
            errorMessage = errorMessageTemplate + "vkey deciphering error";
            break;
        case -8:
            errorMessage = errorMessageTemplate + "Error document VKey";
            break;
        case -7:
            errorMessage = errorMessageTemplate + "Error document request";
            break;
        case -6:
            errorMessage = errorMessageTemplate + "Error database";
            break;
        case -5:
            errorMessage = errorMessageTemplate + "Error unexpected guid";
            break;
        case -4:
            errorMessage = errorMessageTemplate + "Error download error";
            break;
        case -3:
            errorMessage = errorMessageTemplate + "Error convertation error";
            break;
        case -2:
            errorMessage = errorMessageTemplate + "Error convertation timeout";
            break;
        case -1:
            errorMessage = errorMessageTemplate + "Error convertation unknown";
            break;
        case 0:
            break;
        default:
            errorMessage = "ErrorCode = " + errorCode;
            break;
    }
    
    throw { message: errorMessage };
}

serviceConverter.getResponseUri = function (xml)
{
    var json = serviceConverter.convertXmlStringToJson(xml);
    
    if (!json.FileResult)
        throw { message: "FileResult node is null" };
    
    var fileResult = json.FileResult;
    
    if (fileResult.Error)
        serviceConverter.processConvertServiceResponceError(parseInt(fileResult.Error[0]));
    
    if (!fileResult.EndConvert)
        throw { message: "EndConvert node is null" };
    
    var isEndConvert = fileResult.EndConvert[0].toLowerCase() === "true";
    
    if (!fileResult.Percent)
        throw { message: "Percent node is null" };
    
    var percent = parseInt(fileResult.Percent[0]);
    var uri = null;

    if (isEndConvert) {
        if (!fileResult.FileUrl)
            throw { message: "FileUrl node is null" };
        
        uri = fileResult.FileUrl[0];
        percent = 100;
    } else {
        percent = percent >= 100 ? 99 : percent;
    }
    
    return {
        key: percent,
        value: uri
    };
}

serviceConverter.convertXmlStringToJson = function (xml)
{
    var res;            

    xml2js.parseString(xml, function (err, result) {
        res = result;
    });

    return res;
}

module.exports = serviceConverter;