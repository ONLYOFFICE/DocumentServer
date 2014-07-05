<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DocEditor.aspx.cs" Inherits="OnlineEditorsExample.DocEditor" Title="ONLYOFFICE™" %>

<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="OnlineEditorsExample" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="icon" href="~/favicon.ico" type="image/x-icon" />
    <title>ONLYOFFICE™</title>

    <style>
        html {
            height: 100%;
            width: 100%;
        }

        body {
            background: #fff;
            color: #333;
            font-family: Arial, Tahoma,sans-serif;
            font-size: 12px;
            font-weight: normal;
            height: 100%;
            margin: 0;
            overflow-y: hidden;
            padding: 0;
            text-decoration: none;
        }

        form {
            height: 100%;
        }

        div {
            margin: 0;
            padding: 0;
        }
    </style>

    <script language="javascript" type="text/javascript" src="<%= DocServiceApiUri %>"></script>

    <script type="text/javascript" language="javascript">

        var docEditor;
        var fileName = "<%= FileName %>";
        var fileType = "<%= Path.GetExtension(FileName).Trim('.') %>";

        var innerAlert = function (message) {
            if (console && console.log)
                console.log(message);
            ;
        };

        var onReady = function () {
            innerAlert("Document editor ready");
        };

        var onBack = function () {
            location.href = "default.aspx";
        };

        var onDocumentStateChange = function (event) {
            var title = document.title.replace(/\*$/g, "");
            document.title = title + (event.data ? "*" : "");
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

                    type: '<%= Request["action"] != "embedded" ? "desktop" : "embedded" %>',
                    documentType: "<%= DocumentType %>",
                    document: {
                        title: fileName,
                        url: "<%= FileUri %>",
                        fileType: fileType,
                        key: "<%= Key %>",
                        vkey: "<%= ValidateKey %>",

                        info: {
                            author: "Me",
                            created: "<%= DateTime.Now.ToShortDateString() %>"
                        },

                        permissions: {
                            edit: "<%= _Default.EditedExts.Contains(Path.GetExtension(FileName)) %>" == "True",
                            download: true
                        }
                    },
                    editorConfig: {
                        mode: '<%= _Default.EditMode && _Default.EditedExts.Contains(Path.GetExtension(FileName)) && Request["action"] != "view" ? "edit" : "view" %>',
                        canBackToFolder: "<%= Request["action"] != "embedded" %>" == "True",

                        lang: "en",

                        canCoAuthoring: false,

                        embedded: {
                            saveUrl: "<%= FileUri %>",
                            embedUrl: "<%= FileUri %>",
                            shareUrl: "<%= FileUri %>",
                            toolbarDocked: "top"
                        }
                    },
                    events: {
                        'onReady': onReady,
                        'onBack': onBack,
                        'onDocumentStateChange': onDocumentStateChange,
                        'onSave': onDocumentSave,
                        'onError': onError
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
            if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                xmlhttp = new XMLHttpRequest();
            }
            return xmlhttp;
        }

        function SaveFileRequest(fileName, fileType, fileUri) {
            var req = getXmlHttp();
            if (console && console.log) {
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        console.log(req.statusText);
                        if (req.status == 200) {
                            console.log(req.responseText);
                        }
                    }
                };
            }

            var requestAddress = "webeditor.ashx"
                + "?type=save"
                + "&filename=" + encodeURIComponent(fileName)
                + "&filetype=" + encodeURIComponent(fileType)
                + "&fileuri=" + encodeURIComponent(fileUri);
            req.open('get', requestAddress, true);

            req.send(fileUri);
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="iframeEditor">
        </div>
    </form>
</body>
</html>
