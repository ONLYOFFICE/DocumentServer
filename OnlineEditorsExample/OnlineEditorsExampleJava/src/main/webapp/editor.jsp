
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Arrays"%>
<%@page import="entities.FileModel"%>
<%@page import="helpers.DocumentManager"%>
<%@page import="helpers.FileUtility"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ONLYOFFICE™</title>
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" type="text/css" href="css/editor.css" />

        <% FileModel Model = (FileModel)request.getAttribute("file"); %>

        <script type="text/javascript" src="${docserviceApiUrl}"></script>
        
        <script type="text/javascript" language="javascript">

        var docEditor;
        var fileName = "<%= Model.GetFileName() %>";
        var fileType = "<%= FileUtility.GetFileExtension(Model.GetFileName()).replace(".", "") %>";

        var innerAlert = function (message) {
            if (console && console.log)
                console.log(message);
        };

        var onReady = function () {
            innerAlert("Document editor ready");
        };

        var onBack = function () {
            location.href = "IndexServlet";
        };

        var onDocumentStateChange = function (event) {
            var title = document.title.replace(/\*$/g, "");
            document.title = title + (event.data ? "*" : "");
        };

        var onRequestEditRights = function () {
            if (typeof DocsAPI.DocEditor.version == "function") {
                var version = DocsAPI.DocEditor.version();
                if ((parseFloat(version) || 0) >= 3) {
                    location.href = location.href.replace(RegExp("action=view\&?", "i"), "");
                    return;
                }
            }
            docEditor.applyEditRights(true);
        };

        var onDocumentSave = function (event) {
            SaveFileRequest(fileName, fileType, event.data);
        };

        var onError = function (event) {
            if (console && console.log && event)
                console.log(event.data);
        };

        var сonnectEditor = function () {

            docEditor = new DocsAPI.DocEditor("iframeEditor",
                {
                    width: "100%",
                    height: "100%",
                    type: "${type}",
                    documentType: "<%= Model.GetDocumentType() %>",
                    
                    document: {
                        title: fileName,
                        url: "<%= Model.GetFileUri() %>",
                        fileType: fileType,
                        key: "<%= Model.GetKey() %>",
                        vkey: "<%= Model.GetValidateKey() %>",

                        info: {
                            author: "Me",
                            created: "<%= new SimpleDateFormat("MM/dd/yyyy").format(new Date()) %>"
                        },

                        permissions: {
                            edit: <%= Boolean.toString(DocumentManager.GetEditedExts().contains(FileUtility.GetFileExtension(Model.GetFileName()))).toLowerCase() %>,
                            download: true
                        }
                    },
                    editorConfig: {
                        mode: "<%= DocumentManager.GetEditedExts().contains(FileUtility.GetFileExtension(Model.GetFileName())) && !"view".equals(request.getAttribute("mode")) ? "edit" : "view" %>",
                        lang: "en",
                        callbackUrl: "<%= Model.GetCallbackUrl() %>",

                        embedded: {
                            saveUrl: "<%= Model.GetFileUri() %>",
                            embedUrl: "<%= Model.GetFileUri() %>",
                            shareUrl: "<%= Model.GetFileUri() %>",
                            toolbarDocked: "top"
                        }
                    },
                    events: {
                        "onReady": onReady,
                        "onBack": <%= "embedded".equals(request.getAttribute("type")) ? "" : "onBack" %>,
                        "onDocumentStateChange": onDocumentStateChange,
                        'onRequestEditRights': onRequestEditRights,
                        "onSave": onDocumentSave,
                        "onError": onError
                    }
                });
        };

            if (window.addEventListener) {
                window.addEventListener("load", сonnectEditor);
            } else if (window.attachEvent) {
                window.attachEvent("load", сonnectEditor);
            }

            function getXmlHttp() {
                var xmlhttp;
                try {
                    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (ex) {
                        xmlhttp = false;
                    }
                }
                if (!xmlhttp && typeof XMLHttpRequest !== "undefined") {
                    xmlhttp = new XMLHttpRequest();
                }
                return xmlhttp;
            }

            function SaveFileRequest(fileName, fileType, fileUri) {
                var req = getXmlHttp();
                if (console && console.log) {
                    req.onreadystatechange = function () {
                        if (req.readyState === 4) {
                            console.log(req.statusText);
                            if (req.status === 200) {
                                console.log(req.responseText);
                            }
                        }
                    };
                }

                var requestAddress = "/OnlineEditorsExampleJava/IndexServlet?type=save"
                    + "&filename=" + encodeURIComponent(fileName)
                    + "&filetype=" + encodeURIComponent(fileType)
                    + "&fileuri=" + encodeURIComponent(fileUri);
            
                req.open("GET", requestAddress, true);
                req.send();
            }

    </script>
        
    </head>
    <body>
        <div class="form">
            <div id="iframeEditor"></div>
        </div>
    </body>
</html>
