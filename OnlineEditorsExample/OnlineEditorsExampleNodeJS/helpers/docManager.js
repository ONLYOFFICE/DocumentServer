var path = require("path");
var fileSystem = require("fs");
var fileUtility = require("./fileUtility");
var serviceConverter = require("./serviceConverter");
var cacheManager = require("./cacheManager");
var guidManager = require("./guidManager");
var config = require("../config");

var docManager = {};

docManager.dir = null;
docManager.req = null;
docManager.res = null;

docManager.init = function (dir, req, res) {
    docManager.dir = dir;
    docManager.req = req;
    docManager.res = res;
}

docManager.getCorrectName = function (fileName)
{
    var baseName = fileUtility.getFileName(fileName, true);
    var ext = fileUtility.getFileExtension(fileName);
    var name = baseName + ext;
    var index = 1;

    while(fileSystem.existsSync(docManager.storagePath(name))) {
        name = baseName + " (" + index + ")" + ext;
        index++;
    }

    return name;
}

docManager.createDemo = function (fileExt)
{
    var demoName = "sample." + fileExt;
    
    var fileName = docManager.getCorrectName(demoName);
    
    docManager.copyFile(path.join(docManager.dir, "public", "samples", demoName), docManager.storagePath(fileName));
    
    return fileName;
}

docManager.getFileUri = function (fileName)
{
    var filePath = docManager.getlocalFileUri(fileName);
        
    if (config.haveExternalIp) {
        return filePath;
    }
        
    return docManager.getExternalUri(filePath);
}

docManager.getlocalFileUri = function (fileName) {
    var serverPath = docManager.req.protocol + "://" + docManager.req.get("host");
    var storagePath = config.storageFolder;
    var hostAddress = docManager.curUserHostAddress();
    
    return serverPath + "/" + storagePath + "/" + hostAddress + "/" + encodeURIComponent(fileName);
}

docManager.getCallback = function (fileName)
{
    var server = docManager.req.protocol + "://" + docManager.req.get("host");
    var hostAddress = docManager.curUserHostAddress();
    var handler = "/track?useraddress=" + encodeURIComponent(hostAddress) + "&filename=" + encodeURIComponent(fileName);
    
    return server + handler;
}

docManager.storagePath = function (fileName, userAddress)
{
    var directory = path.join(docManager.dir, "public", config.storageFolder, docManager.curUserHostAddress(userAddress));
    if (!fileSystem.existsSync(directory)) {
        fileSystem.mkdirSync(directory);
    }
    return path.join(directory, fileName);
}

docManager.curUserHostAddress = function (userAddress)
{
    if (!userAddress)
        userAddress = docManager.req.headers["x-forwarded-for"] || docManager.req.connection.remoteAddress;
    
    return userAddress.replace(new RegExp("[^0-9a-zA-Z.=]", "g"), "_");
}

docManager.copyFile = function (exist, target)
{
    fileSystem.writeFileSync(target, fileSystem.readFileSync(exist));
}
 
docManager.getExternalUri = function (localUri)
{
    var documentRevisionId = serviceConverter.generateRevisionId(localUri);
        
    if (cacheManager.containsKey(documentRevisionId))
        return cacheManager.get(documentRevisionId);
        
    try {

        var fileName = fileUtility.getFileName(localUri);
        var storagePath = docManager.storagePath(decodeURIComponent(fileName));
        var content = fileSystem.readFileSync(storagePath);
            
        var externalUri = serviceConverter.getExternalUri(content, content.length, null, documentRevisionId);

        cacheManager.put(documentRevisionId, externalUri);
            
        return externalUri;
    }
    catch (ex)
    {
        throw ex;
    }
}
        
docManager.getInternalExtension = function (fileType)
{
    if (fileType == fileUtility.fileType.text)
        return ".docx";
            
    if (fileType == fileUtility.fileType.spreadsheet)
        return ".xlsx";
            
    if (fileType == fileUtility.fileType.presentation)
        return ".pptx";
            
    return ".docx";
}

docManager.getKey = function (fileName)
{
    var uri = docManager.getlocalFileUri(fileName);
    return serviceConverter.generateRevisionId(uri);
}

docManager.getValidateKey = function (fileName)
{
    var key = docManager.getKey(fileName);
    return serviceConverter.generateValidateKey(key, false);
}

module.exports = docManager;