<?php
    require_once( dirname(__FILE__) . '/config.php' );
    require_once( dirname(__FILE__) . '/common.php' );
    require_once( dirname(__FILE__) . '/functions.php' );
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>ONLYOFFICE™</title>

        <link rel="icon" href="./favicon.ico" type="image/x-icon" />

        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:900,800,700,600,500,400,300&subset=latin,cyrillic-ext,cyrillic,latin-ext" />

        <link rel="stylesheet" type="text/css" href="css/stylesheet.css" />

        <link rel="stylesheet" type="text/css" href="css/jquery-ui.css" />

        <script type="text/javascript" src="js/jquery-1.9.0.min.js"></script>

        <script type="text/javascript" src="js/jquery-ui.min.js"></script>

        <script type="text/javascript" src="js/jquery.blockUI.js"></script>

        <script type="text/javascript" src="js/jquery.iframe-transport.js"></script>

        <script type="text/javascript" src="js/jquery.fileupload.js"></script>

        <script type="text/javascript" src="js/jquery.dropdownToggle.js"></script>

        <script type="text/javascript" src="js/jscript.js"></script>

        <script type="text/javascript">
            var ConverExtList = '<?php echo implode(",", $GLOBALS["DOC_SERV_CONVERT"]) ?>';
            var EditedExtList = '<?php echo implode(",", $GLOBALS["DOC_SERV_EDITED"]) ?>';
        </script>
    </head>
    <body>
        <form id="form1">

        <div class="top-panel"></div>
        <div class="main-panel">
            <span class="portal-name">ONLYOFFICE™ Online Editors</span>
            <br />
            <br />
            <span class="portal-descr">Get started with a demo-sample of ONLYOFFICE™ Online Editors, the first html5-based editors. You may upload your own documents for testing using the "Choose file" button and selecting the necessary files on your PC.</span>

            <div class="file-upload button gray">
                <span>Choose file</span>
                <input type="file" id="fileupload" name="files" data-url="webeditor-ajax.php?type=upload" />
            </div>
            <label class="save-original">
                <input type="checkbox" id="checkOriginalFormat" />Save document in original format
            </label>
            <span class="question"></span>
            <br />
            <br />
            <br />
            <span class="try-descr">You are also enabled to view and edit documents pre-uploaded to the portal.</span>
            <ul class="try-editor-list">
                <li><a class="try-editor document" href="doceditor.php?type=document" target="_blank">Sample Document</a></li>
                <li><a class="try-editor spreadsheet" href="doceditor.php?type=spreadsheet" target="_blank">Sample Spreadsheet</a></li>
                <li><a class="try-editor presentation" href="doceditor.php?type=presentation" target="_blank">Sample Presentation</a></li>
            </ul>
            <br />
            <br />
            <br />
            <div class="help-block">
                <span>Want to learn how it works?</span>

                <?php if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . "OnlineEditorsExample.zip") ||
                         file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . "OnlineEditorsExampleMVC.zip") ||
                         file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . "OnlineEditorsExampleJS.zip")) { ?>
                    <br />
                    Download the code for the sample of ONLYOFFICE™ Online Editors to find out the details.
                    <br />
                    <br />
                    <?php if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . "OnlineEditorsExample.zip")) { ?>
                    <a class="sample button gray" href="app_data/OnlineEditorsExample.zip">C#</a>
                    <?php } ?>

                    <?php if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . "OnlineEditorsExampleMVC.zip")) { ?>
                    <a class="sample button gray" href="app_data/OnlineEditorsExampleMVC.zip">C# MVC</a>
                    <?php } ?>

                    <?php if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . "OnlineEditorsExampleJS.zip")) { ?>
                    <a class="sample button gray" href="app_data/OnlineEditorsExampleJS.zip">JavaScript</a>
                    <?php } ?>
                    <br />
                <br />
                <?php } ?>

                <br />
                Read the editor <a href="http://api.onlyoffice.com/editors/howitworks">API Documentation</a>
            </div>
            <br />
            <br />
            <br />
            <div class="help-block">
                <span>Any questions?</span>
                <br />
                Please, <a href="mailto:sales@onlyoffice.com">submit your request</a> and we'll help you shortly.
            </div>
        </div>

        <div id="hint">
            <div class="corner"></div>
            If you check this option the file will be saved both in the original and converted into Office Open XML format for faster viewing and editing. In other case the document will be overwritten by its copy in Office Open XML format.
        </div>

        <div id="mainProgress">
            <div id="uploadSteps">
                <span id="step1" class="step">1. Loading the file</span>
                <span class="step-descr">The file loading process will take some time depending on the file size, presence or absence of additional elements in it (macros, etc.) and the connection speed.</span>
                <br />
                <span id="step2" class="step">2. File conversion</span>
                <span class="step-descr">The file is being converted into Office Open XML format for the document faster viewing and editing.</span>
                <br />
                <span id="step3" class="step">3. Loading editor scripts</span>
                <span class="step-descr">The scripts for the editor are loaded only once and are will be cached on your computer in future. It might take some time depending on the connection speed.</span>
                <input type="hidden" name="hiddenFileName" id="hiddenFileName" />
                <br />
                <br />
                <span class="progress-descr">Please note, that the speed of all operations greatly depends on the server and the client locations. In case they differ or are located in differernt countries/continents, there might be lack of speed and greater wait time. The best results are achieved when the server and client computers are located in one and the same place (city).</span>
                <br />
                <br />
                <div class="error-message">
                    <span></span>
                    <br />
                    Please select another file and try again. If you have questions please <a href="mailto:sales@onlyoffice.com">contact us.</a>
                </div>
            </div>
            <iframe id="embeddedView" src="" height="345px" width="600px" frameborder="0" scrolling="no" allowtransparency></iframe>
            <br />
            <div id="beginEmbedded" class="button disable">Embedded view</div>
            <div id="beginView" class="button disable">View</div>
            
            <?php if (($GLOBALS['MODE']) != "view") { ?>
            <div id="beginEdit" class="button disable">Edit</div>
            <?php } ?>
            <div id="cancelEdit" class="button gray">Cancel</div>
        </div>

        <span id="loadScripts" data-docs="<?php echo $GLOBALS['DOC_SERV_PRELOADER_URL'] ?>"></span>
        <div class="bottom-panel">&copy; Ascensio System SIA <?php echo date("Y") ?>. All rights reserved.</div>

    </form>
    </body>
</html>
