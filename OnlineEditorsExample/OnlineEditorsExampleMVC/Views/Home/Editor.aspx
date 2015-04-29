<%@ Page Title="ONLYOFFICE™" Language="C#" Inherits="System.Web.Mvc.ViewPage<OnlineEditorsExampleMVC.Models.FileModel>" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Configuration" %>
<%@ Import Namespace="OnlineEditorsExampleMVC.Helpers" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" href="~/favicon.ico" type="image/x-icon" />
    <title><%= Model.FileName + " - ONLYOFFICE™" %></title>
    
    <%: Styles.Render("~/Content/editor") %>

</head>
<body>
    <div class="form">
        <div id="iframeEditor">
        </div>
    </div>
    
    <%: Scripts.Render(new []{ WebConfigurationManager.AppSettings["files.docservice.url.api"] }) %>

    <script type="text/javascript" language="javascript">

        var docEditor;
        var fileName = "<%= Model.FileName %>";
        var fileType = "<%= Path.GetExtension(Model.FileName).Trim('.') %>";

        var innerAlert = function (message) {
            if (console && console.log)
                console.log(message);
            ;
        };

        var onReady = function () {
            innerAlert("Document editor ready");
        };

        var onBack = function () {
            location.href = "<%= Url.Action("Index", "Home") %>";
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

                    type: '<%= Request["mode"] != "embedded" ? "desktop" : "embedded" %>',
                    documentType: "<%= Model.DocumentType %>",
                    document: {
                        title: fileName,
                        url: "<%= Model.FileUri %>",
                        fileType: fileType,
                        key: "<%= Model.Key %>",
                        vkey: "<%= Model.ValidateKey %>",

                        info: {
                            author: "Me",
                            created: "<%= DateTime.Now.ToShortDateString() %>"
                        },

                        permissions: {
                            edit: "<%= DocManagerHelper.EditedExts.Contains(Path.GetExtension(Model.FileName)) %>" == "True",
                            download: true
                        }
                    },
                    editorConfig: {
                        mode: '<%= DocManagerHelper.EditedExts.Contains(Path.GetExtension(Model.FileName)) && Request["mode"] != "view" ? "edit" : "view" %>',

                        lang: "en",

                        callbackUrl: "<%= Model.CallbackUrl %>",

                        user : {
                            id: "<%= DocManagerHelper.CurUserHostAddress() %>",
                            name: "User"
                        },

                        embedded: {
                            saveUrl: "<%= Model.FileUri %>",
                            embedUrl: "<%= Model.FileUri %>",
                            shareUrl: "<%= Model.FileUri %>",
                            toolbarDocked: "top"
                        }
                    },
                    events: {
                        'onReady': onReady,
                        'onBack': <%= Request["mode"] != "embedded" ? "onBack" : "" %>,
                        'onDocumentStateChange': onDocumentStateChange,
                        'onRequestEditRights': onRequestEditRights,
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

                var requestAddress = "<%= Url.Content("~/webeditor.ashx?type=save") %>"
                    + "&filename=" + encodeURIComponent(fileName)
                    + "&filetype=" + encodeURIComponent(fileType)
                    + "&fileuri=" + encodeURIComponent(fileUri);
                req.open('get', requestAddress, true);

                req.send(fileUri);
            }

    </script>
</body>
</html>
