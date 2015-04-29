<?php
    require_once( dirname(__FILE__) . '/config.php' );
    require_once( dirname(__FILE__) . '/common.php' );
    require_once( dirname(__FILE__) . '/functions.php' );

    $filename;
    $fileuri;

    $externalUrl = $_GET["fileUrl"];
    if (!empty($externalUrl))
    {
        $filename = DoUpload($externalUrl);
    }
    else
    {
        $filename = $_GET["fileID"];
    }
    $type = $_GET["type"];

    if (!empty($type))
    {
        $filename = tryGetDefaultByType($type);

        $new_url = "doceditor.php?fileID=" . $filename;
        header('Location: ' . $new_url, true);
        exit;
    }

    $fileuri = FileUri($filename);


    function tryGetDefaultByType($type) {
        $ext;
        switch ($type)
        {
            case "document":
                $ext = ".docx";
                break;
            case "spreadsheet":
                $ext = ".xlsx";
                break;
            case "presentation":
                $ext = ".pptx";
                break;
            default:
                return;
        }

        $demoName = "demo" . $ext;
        $demoFilename = GetCorrectName($demoName);

        if(!@copy(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . $demoName, getStoragePath($demoFilename)))
        {
            sendlog("Copy file error to ". getStoragePath($demoFilename), "logs/common.log");
            //Copy error!!!
        }

        return $demoFilename;
    }

    function getDocEditorKey($fileUri) {
        return GenerateRevisionId(getCurUserHostAddress() . "/" . basename($fileUri));
    }

    function getDocEditorValidateKey($fileUri) {
        return GenerateValidateKey(getDocEditorKey($fileUri));
    }

    function getCallbackUrl($fileName) {
        return rtrim(WEB_ROOT_URL, '/') . '/'
                    . "webeditor-ajax.php"
                    . "?type=track&userAddress=" . getClientIp()
                    . "&fileName=" . urlencode($fileName);
    }

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="icon" href="./favicon.ico" type="image/x-icon" />
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

    <script type="text/javascript" src="<?php echo $GLOBALS["DOC_SERV_API_URL"] ?>"></script>

    <script type="text/javascript">

        var docEditor;
        var fileName = "<?php echo $filename ?>";
        var fileType = "<?php echo strtolower(pathinfo($filename, PATHINFO_EXTENSION)) ?>";

        var innerAlert = function (message) {
            if (console && console.log)
                console.log(message);
            ;
        };

        var onReady = function () {
            innerAlert("Document editor ready");
        };

        var onBack = function () {
            location.href = "index.php";
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

                    type: "<?php echo ($_GET["action"] != "embedded" ?  "desktop" : "embedded") ?>",
                    documentType: "<?php echo getDocumentType($filename) ?>",
                    document: {
                        title: fileName,
                        url: "<?php echo $fileuri ?>",
                        fileType: fileType,
                        key: "<?php echo getDocEditorKey($fileuri) ?>",
                        vkey: "<?php echo getDocEditorValidateKey($fileuri) ?>",

                        info: {
                            author: "Me",
                            created: "<?php echo date('d.m.y') ?>"
                        },

                        permissions: {
                            edit: <?php echo (in_array(strtolower('.' . pathinfo($filename, PATHINFO_EXTENSION)), $GLOBALS['DOC_SERV_EDITED']) ? "true" : "false") ?>,
                            download: true
                        }
                    },
                    editorConfig: {
                        mode: '<?php echo $GLOBALS['MODE'] != 'view' && in_array(strtolower('.' . pathinfo($filename, PATHINFO_EXTENSION)), $GLOBALS['DOC_SERV_EDITED']) && $_GET["action"] != "view" ? "edit" : "view"  ?>',

                        lang: "en",

                        callbackUrl: "<?php echo getCallbackUrl($filename) ?>",

                        embedded: {
                            saveUrl: "<?php echo $fileuri ?>",
                            embedUrl: "<?php echo $fileuri ?>",
                            shareUrl: "<?php echo $fileuri ?>",
                            toolbarDocked: "top"
                        }
                    },
                    events: {
                        'onReady': onReady,
                        'onBack': <?php echo ($_GET["action"] != "embeded" ?  "onBack" : "undefined") ?>,
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

            var requestAddress = "webeditor-ajax.php"
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
    <form id="form1">
        <div id="iframeEditor">
        </div>
    </form>
</body>
</html>