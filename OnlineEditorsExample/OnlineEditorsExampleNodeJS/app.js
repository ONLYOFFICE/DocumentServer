var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var fileSystem = require("fs");
var formidable = require("formidable");
var syncRequest = require("sync-request");
var config = require("./config");
var docManager = require("./helpers/docManager");
var serviceConverter = require("./helpers/serviceConverter");
var fileUtility = require("./helpers/fileUtility");


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


String.prototype.hashCode = function () {
    for (var ret = 0, i = 0, len = this.length; i < len; i++) {
        ret = (31 * ret + this.charCodeAt(i)) << 0;
    }
    return ret;
};
String.prototype.format = function () {
    var text = this.toString();
    
    if (!arguments.length) return text;
    
    for (var i = 0; i < arguments.length; i++) {
        text = text.replace(new RegExp("\\{" + i + "\\}", "gi"), arguments[i]);
    }
    
    return text;
};


var app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")


app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/images/favicon.ico"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", function (req, res) {
    res.redirect("index")
});

app.get("/index", function (req, res) {
    res.render("index", {
        preloaderUrl: config.preloaderUrl,
        convertExts: config.convertedDocs.join(","),
        editedExts: config.editedDocs.join(",")
    });
});

app.post("/upload", function (req, res) {

    docManager.init(__dirname, req, res);
    docManager.storagePath(""); //mkdir if not exist

    var userIp = docManager.curUserHostAddress();
    var uploadDir = "./public/" + config.storageFolder + "/" + userIp;

    var form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    
    form.parse(req, function (err, fields, files) {

        var file = files.uploadedFile;
        
        file.name = docManager.getCorrectName(file.name);

        if (config.maxFileSize < file.size || file.size <= 0) {
            fileSystem.unlinkSync(file.path);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write("{ \"error\": \"File size is incorrect\"}");
            res.end();
            return;
        }
        
        var exts = new Array().concat(config.viewedDocs, config.editedDocs, config.convertedDocs);
        var curExt = fileUtility.getFileExtension(file.name);

        if (exts.indexOf(curExt) == -1) {
            fileSystem.unlinkSync(file.path);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write("{ \"error\": \"File type is not supported\"}");
            res.end();
            return;
        }
        
        fileSystem.rename(file.path, uploadDir + "/" + file.name, function (err) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            if (err)
                res.write("{ \"error\": \"" + err + "\"}");
            else
                res.write("{ \"filename\": \"" + file.name + "\"}");
            res.end();
        });
    });
});

app.get("/convert", function (req, res) {

    var fileName = req.query.filename;
    var fileUri = docManager.getFileUri(fileName);
    var fileExt = fileUtility.getFileExtension(fileName);
    var fileType = fileUtility.getFileType(fileName);
    var internalFileExt = docManager.getInternalExtension(fileType);
    var response = res;

    var writeResult = function (filename, step, error) {
        var result = {};
        
        if (filename != null)
            result["filename"] = filename;

        if (step != null)
            result["step"] = step;

        if (error != null)
            result["error"] = error;
        
        response.write(JSON.stringify(result));
        response.end();
    }

    var callback = function (err, data) {
        if (err) {
            if (err.name === "ConnectionTimeoutError") {
                console.log("check convert timeout")
                writeResult(fileName, 0, null);
                return;
            } else {
                throw { message: err };
            }
        }
        
        try {
            var responseUri = serviceConverter.getResponseUri(data.toString())
            var result = responseUri.key;
            var newFileUri = responseUri.value;
        
            if (result != 100) {
                writeResult(fileName, result, null)
                return;
            }
        
            var correctName = docManager.getCorrectName(fileUtility.getFileName(fileName, true) + internalFileExt);
        
            var file = syncRequest("GET", newFileUri);
            fileSystem.writeFileSync(docManager.storagePath(correctName), file.getBody());
            
            writeResult(correctName, null, null)
        } catch (ex) {
            writeResult(null, null, ex.message)
        }
    }
    
    try {
        if (config.convertedDocs.indexOf(fileExt) != -1) {
            var key = serviceConverter.generateRevisionId(fileUri);
            var res = serviceConverter.getConvertedUriAsync(fileUri, fileExt, internalFileExt, key, callback);
        } else {
            writeResult(fileName, null, null)
        }
    } catch (ex) {
        writeResult(null, null, ex.message)
    }
    
});

app.get("/save", function (req, res) {
    var downloadUri = req.query.fileuri;
    var fileName = req.query.filename;
    var fileType = req.query.filetype;
    
    if (!downloadUri || !fileName) {
        res.write("error: empty fileuri or filename");
        res.end();
        return;
    }
    
    if (!fileType) {
        fileType = fileUtility.getFileExtension(fileName, true);
    }
    
    var newType = fileUtility.getFileExtension(downloadUri, true);

    if (newType !== fileType) {
        var key = serviceConverter.generateRevisionId(downloadUri);
        var newFileUri = "";
        
        try
        {
            var res = serviceConverter.getConvertedUri(downloadUri, newType, fileType, key);

            var result = res.key;
            newFileUri = res.value;

            if (result != 100) {
                throw {message: "error: percwent != 100"};
            }
        }
        catch (ex)
        {
            res.write("error:" + ex.message);
            res.end();
            return;
        }

        downloadUri = newFileUri;
        newType = fileType;
    }

    fileName = fileUtility.getFileName(fileName, true) + "." + newType;

    var file = syncRequest("GET", downloadUri);
    fileSystem.writeFileSync(docManager.storagePath(fileName), file.getBody());

    res.write("success");
    res.end();
});

app.post("/track", function (req, res) {
    var userAddress = req.query.useraddress;
    var fileName = req.query.filename;
    var storagePath = docManager.storagePath(fileName, userAddress);

    var updateFile = function (response, body, path) {
        if (body.status == 2 || body.status == 3)//MustSave, Corrupted
        {
            try {
                var file = syncRequest("GET", body.url);
                fileSystem.writeFileSync(storagePath, file.getBody());
                response.write("{{\"c\":\"saved\",\"status\":1}}");
            } catch (ex) {
                response.write("{{\"c\":\"saved\",\"status\":0}}");
            }
        }
        response.end();
    }
    
    var readbody = function (request, response, path) {
        var content = "";
        request.on('data', function (data) {
            content += data;
        });
        request.on('end', function () {
            var body = JSON.parse(content);
            updateFile(response, body, path);
        });
    }

    if (req.body.hasOwnProperty("status")) {
        updateFile(res, req.body, storagePath);
    } else {
        readbody(req, res, storagePath)
    }
});

app.get("/editor", function (req, res) {
    
    docManager.init(__dirname, req, res);

    var mode = req.query.mode;
    var fileExt = req.query.fileExt;
    var fileName = req.query.fileName;
    
    if (fileExt != null) {
        try {
            fileName = docManager.createDemo(fileExt);
        }
        catch (ex) {
            res.status(500);
            res.render("error", { message: ex.message, error: ex });
            return;
        }
    }
    
    var desktopMode = mode != "embedded";

    var type = desktopMode ? "desktop" : "embedded"; // desktop, embedded
    var canEdit = config.editedDocs.indexOf(fileUtility.getFileExtension(fileName)) != -1;
            
    res.render("editor",  {
        apiUrl: config.apiUrl,
        file: {
            name: fileName,
            ext: fileUtility.getFileExtension(fileName, true),
            uri: docManager.getFileUri(fileName)
        },
        editor: {
            type: type,
            documentType: fileUtility.getFileType(fileName),
            key: docManager.getKey(fileName),
            vKey: docManager.getValidateKey(fileName),
            callbackUrl: docManager.getCallback(fileName),
            isEdit: canEdit,
            mode: canEdit && mode != "view" ? "edit" : "view",
            canBackToFolder: type != "embedded"
        }
    });
});

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
    });
});


module.exports = app;