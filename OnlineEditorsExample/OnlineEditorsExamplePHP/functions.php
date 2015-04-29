<?php

require_once( dirname(__FILE__) . '/config.php' );
require_once( dirname(__FILE__) . '/common.php' );


function servConvGetKey() {
    if (defined('ServiceConverterTenantId'))
        return ServiceConverterTenantId;
    return "OnlyOfficeAppsExample";
}

function servConvGetSKey() {
    if (defined('ServiceConverterKey'))
        return ServiceConverterKey;
    return "ONLYOFFICE";
}

function HaveExternalIP() {
    $_haveExternalIPCacheFile = "cache/haveExternalIP.txt";
    $_cacheTimeSeconds = 1 * 60 * 60; // cache for 1 hour

    $_haveExternalIPObj = unserialize(file_get_contents($_haveExternalIPCacheFile));

    if (!(isset($_haveExternalIPObj) &&
        is_array($_haveExternalIPObj) &&
        isset($_haveExternalIPObj['haveExternalIP']) &&
        isset($_haveExternalIPObj['updDate']) &&
        is_bool($_haveExternalIPObj['haveExternalIP']) &&
        is_int($_haveExternalIPObj['updDate']) &&
        $_haveExternalIPObj['updDate'] + $_cacheTimeSeconds >= time()))
    {
        $convertUri = "";
        try
        {
            $demoName = "demo.docx";
            $fileUri = getVirtualPath() . $demoName;

            if (!file_exists($fileUri)){
                if(!@copy(dirname(__FILE__) . DIRECTORY_SEPARATOR . "app_data" . DIRECTORY_SEPARATOR . $demoName, getStoragePath($demoName)))
                {
                    $errors= error_get_last();
                    $err = "Copy demo file error: " . $errors['type'] . "\r\n".$errors['message'];

                    sendlog("HaveExternalIP errors: " . $err, "logs/common.log");
                    throw new Exception($err);
                } else {
                    GetConvertedUri($fileUri, "docx", "docx", guid(), FALSE, $convertUri);
                }
            }
        }
        catch (Exception $e) {
            $convertUri = "";
        }

        $_haveExternalIPObj = array(
                            'haveExternalIP' => ($convertUri != ""),
                            'updDate' => time()
                           );

        file_put_contents($_haveExternalIPCacheFile, serialize($_haveExternalIPObj));
    }

    return $_haveExternalIPObj['haveExternalIP'];
}

function FileUri($file_name) {
    $uri = getVirtualPath() . $file_name;

    if (HaveExternalIP()) {
        return $uri;
    }

    return GetExternalFileUri($uri);
}

function GetExternalFileUri($local_uri) {
    $externalUri = '';

    try
    {
        $documentRevisionId = GenerateRevisionId($local_uri);

        if (($fileContents = file_get_contents(str_replace(" ","%20", $local_uri)))===FALSE){
            throw new Exception("Bad Request");
        } else {
            $contentType =  mime_content_type($local_uri);

            $validateKey = GenerateValidateKey($documentRevisionId, false);

            $urlToService = generateUrlToStorage('', '', '', '', $documentRevisionId, $validateKey);

            $opts = array('http' => array(
                    'method'  => 'POST',
                    'header'  => "User-Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\r\n" .
                                    "Content-Type: " . $contentType . "\r\n" .
                                    "Content-Length: " . strlen($fileContents) . "\r\n",
                    'content' => $fileContents,
                    'timeout' => $GLOBALS['DOC_SERV_TIMEOUT'] 
                )
            );

            if (substr($urlToService, 0, strlen("https")) === "https") {
                $opts['ssl'] = array( 'verify_peer'   => FALSE );
            }
 

            $context  = stream_context_create($opts);

            if (($response_data = file_get_contents($urlToService, FALSE, $context))===FALSE){
                throw new Exception ("Could not get an answer");
            } else {
                sendlog("GetExternalUri response_data:" . PHP_EOL . $response_data, "logs/common.log");
                GetResponseUri($response_data, $externalUri);
            }

            sendlog("GetExternalFileUri. externalUri = " . $externalUri, "logs/common.log");
            return $externalUri . "";
        }
    }
    catch (Exception $e)
    {
        sendlog("GetExternalFileUri Exception: " . $e->getMessage(), "logs/common.log");
    }
    return $local_uri;
}


function DoUpload($fileUri) {
    $_fileName = GetCorrectName($fileUri);

    $ext = strtolower('.' . pathinfo($_fileName, PATHINFO_EXTENSION));
    if (!in_array($ext, getFileExts()))
    {
        throw new Exception("File type is not supported");
    }

    if(!@copy($fileUri, getStoragePath($_fileName)))
    {
        $errors= error_get_last();
        $err = "Copy file error: " . $errors['type'] . "<br />\n" . $errors['message'];
        throw new Exception($err);
    }

    return $_fileName;
}


function generateUrlToConverter($document_uri, $from_extension, $to_extension, $title, $document_revision_id, $validateKey, $is_async) {
    $urlToConverterParams = array(
                                "url" => $document_uri,
                                "outputtype" => trim($to_extension,'.'),
                                "filetype" => trim($from_extension, '.'),
                                "title" => $title,
                                "key" => $document_revision_id,
                                "vkey" => $validateKey);

    $urlToConverter = $GLOBALS['DOC_SERV_CONVERTER_URL'] . "?" . http_build_query($urlToConverterParams);

    if ($is_async)
        $urlToConverter = $urlToConverter . "&async=true";

    return $urlToConverter;
}


function generateUrlToStorage($document_uri, $from_extension, $to_extension, $title, $document_revision_id, $validateKey) {

    return $GLOBALS['DOC_SERV_STORAGE_URL'] . "?" . http_build_query(
                            array(
                                "url" => $document_uri,
                                "outputtype" => trim($to_extension,'.'),
                                "filetype" => trim($from_extension, '.'),
                                "title" => $title,
                                "key" => $document_revision_id,
                                "vkey" => $validateKey));
}


/**
* Encoding string from object
*
* @param object $primary_key     Json of primary key
* @param string $secret          Secret key for encoding
*
* @return Encoding string
*/
function signature_Create($primary_key, $secret) {
    $payload = base64_encode( hash( 'sha256', ($primary_key . $secret), true ) ) . "?" . $primary_key;
    $base64Str = base64_encode($payload);

    $ind = 0;
    for ($n = strlen($base64Str); $n > 0; $n--){
        if ($base64Str[$n-1] === '='){
            $ind++;
        } else {
            break;
        }
    }
    $base64Str = str_replace(array('+', '/'), array('-', '_'), trim($base64Str, '==')) . $ind;

    return urlencode($base64Str);
}


/**
* Generate an error code table
*
* @param string $errorCode   Error code
*
* @return null
*/
function ProcessConvServResponceError($errorCode) {
    $errorMessageTemplate = "Error occurred in the document service: ";
    $errorMessage = '';

    switch ($errorCode)
    {
        case -8:
            $errorMessage = $errorMessageTemplate . "Error document VKey";
            break;
        case -7:
            $errorMessage = $errorMessageTemplate . "Error document request";
            break;
        case -6:
            $errorMessage = $errorMessageTemplate . "Error database";
            break;
        case -5:
            $errorMessage = $errorMessageTemplate . "Error unexpected guid";
            break;
        case -4:
            $errorMessage = $errorMessageTemplate . "Error download error";
            break;
        case -3:
            $errorMessage = $errorMessageTemplate . "Error convertation error";
            break;
        case -2:
            $errorMessage = $errorMessageTemplate . "Error convertation timeout";
            break;
        case -1:
            $errorMessage = $errorMessageTemplate . "Error convertation unknown";
            break;
        case 0:
            break;
        default:
            $errorMessage = $errorMessageTemplate . "ErrorCode = " . $errorCode;
            break;
    }

    throw new Exception($errorMessage);
}


/**
* Translation key to a supported form.
*
* @param string $expected_key  Expected key
*
* @return Supported key
*/
function GenerateRevisionId($expected_key) {
    if (strlen($expected_key) > 20) $expected_key = crc32( $expected_key);
    $key = preg_replace("[^0-9-.a-zA-Z_=]", "_", $expected_key);
    $key = substr($key, 0, min(array(strlen($key), 20)));
    return $key;
}

/**
*  Generate validate key for editor by documentId
*
* LFJ7 or "http://helpcenter.onlyoffice.com/content/GettingStarted.pdf"
*
* @param string $document_revision_id     Key for caching on service, whose used in editor
* @param bool   $add_host_for_validate    Add host address to the key
*
* @return Validation key
*/
function GenerateValidateKey($document_revision_id, $add_host_for_validate = true) {
    if (empty($document_revision_id)) return '';

    $document_revision_id = GenerateRevisionId($document_revision_id);

    $keyId = servConvGetKey();

    $primaryKey = NULL;
    $ms = number_format(round(microtime(true) * 1000),0,'.','');

    if ($add_host_for_validate)
    {
        $userIp = getClientIp();

        if (!empty($userIp)) {
            $primaryKey = "{\"expire\":\"\\/Date(" . $ms . ")\\/\",\"key\":\"" . $document_revision_id . "\",\"key_id\":\"" . $keyId . "\",\"user_count\":0,\"ip\":\"" . $userIp . "\"}";
        }
    }

    if ($primaryKey == NULL)
        $primaryKey = "{\"expire\":\"\\/Date(" . $ms . ")\\/\",\"key\":\"" . $document_revision_id . "\",\"key_id\":\"" . $keyId . "\",\"user_count\":0}";

    sendlog("GenerateValidateKey. primaryKey = " . $primaryKey, "logs/common.log");

    return signature_Create($primaryKey, servConvGetSKey());
}


/**
* Request for conversion to a service
*
* @param string $document_uri            Uri for the document to convert
* @param string $from_extension          Document extension
* @param string $to_extension            Extension to which to convert
* @param string $document_revision_id    Key for caching on service
* @param bool   $is_async                Perform conversions asynchronously
*
* @return Xml document request result of conversion
*/
function SendRequestToConvertService($document_uri, $from_extension, $to_extension, $document_revision_id, $is_async) {
    if (empty($from_extension))
    {
        $path_parts = pathinfo($document_uri);
        $from_extension = $path_parts['extension'];
    }

    $title = basename($document_uri);
    if (empty($title)) {
        $title = guid();
    }

    if (empty($document_revision_id)) {
        $document_revision_id = $document_uri;
    }

    $document_revision_id = GenerateRevisionId($document_revision_id);
    $validateKey = GenerateValidateKey($document_revision_id, false);

    $urlToConverter = generateUrlToConverter($document_uri, $from_extension, $to_extension, $title, $document_revision_id, $validateKey, $is_async);

    $response_xml_data;
    $countTry = 0;

    $opts = array('http' => array(
            'method'  => 'GET',
            'timeout' => $GLOBALS['DOC_SERV_TIMEOUT'] 
        )
    );

    if (substr($urlToConverter, 0, strlen("https")) === "https") {
        $opts['ssl'] = array( 'verify_peer'   => FALSE );
    }
 
    $context  = stream_context_create($opts);
    while ($countTry < ServiceConverterMaxTry)
    {
        $countTry = $countTry + 1;
        $response_xml_data = file_get_contents($urlToConverter, FALSE, $context);
        if ($response_xml_data !== false){ break; }
    }

    if ($countTry == ServiceConverterMaxTry)
    {
        throw new Exception ("Bad Request or timeout error");
    }

    libxml_use_internal_errors(true);
    $data = simplexml_load_string($response_xml_data);
    if (!$data) {
        $exc = "Bad Response. Errors: ";
        foreach(libxml_get_errors() as $error) {
            $exc = $exc . "\t" . $error->message;
        }
        throw new Exception ($exc);
    }

    return $data;
}


/**
* The method is to convert the file to the required format
*
* Example:
* string convertedDocumentUri;
* GetConvertedUri("http://helpcenter.onlyoffice.com/content/GettingStarted.pdf", ".pdf", ".docx", "http://helpcenter.onlyoffice.com/content/GettingStarted.pdf", false, out convertedDocumentUri);
* 
* @param string $document_uri            Uri for the document to convert
* @param string $from_extension          Document extension
* @param string $to_extension            Extension to which to convert
* @param string $document_revision_id    Key for caching on service
* @param bool   $is_async                Perform conversions asynchronously
* @param string $converted_document_uri  Uri to the converted document
*
* @return The percentage of completion of conversion
*/
function GetConvertedUri($document_uri, $from_extension, $to_extension, $document_revision_id, $is_async, &$converted_document_uri) {
    $converted_document_uri = "";
    $responceFromConvertService = SendRequestToConvertService($document_uri, $from_extension, $to_extension, $document_revision_id, $is_async);

    $errorElement = $responceFromConvertService->Error;
    if ($errorElement != NULL && $errorElement != "") ProcessConvServResponceError($errorElement);

    $isEndConvert = $responceFromConvertService->EndConvert;
    $percent = $responceFromConvertService->Percent . "";

    if ($isEndConvert != NULL && strtolower($isEndConvert) == "true")
    {
        $converted_document_uri = $responceFromConvertService->FileUrl;
        $percent = 100;
    }
    else if ($percent >= 100)
        $percent = 99;

    return $percent;
}


/**
* Processing document received from the editing service.
*
* @param string $x_document_response   The resulting xml from editing service
* @param string $response_uri          Uri to the converted document
*
* @return The percentage of completion of conversion
*/
function GetResponseUri($x_document_response, &$response_uri) {
    $response_uri = "";
    $resultPercent = 0;

    libxml_use_internal_errors(true);
    $data = simplexml_load_string($x_document_response);

    if (!$data) {
        $errs = "Invalid answer format. Errors: ";
        foreach(libxml_get_errors() as $error) {
           $errs = $errs . '\t' . $error->message;
        }

        throw new Exception ($errs);
    }

    $errorElement = $data->Error;
    if ($errorElement != NULL && $errorElement != "") ProcessConvServResponceError($data->Error);

    $endConvert = $data->EndConvert;
    if ($endConvert != NULL && $endConvert == "") throw new Exception("Invalid answer format");

    if ($endConvert != NULL && strtolower($endConvert) == true)
    {
        $fileUrl = $data->FileUrl;
        if ($fileUrl == NULL || $fileUrl == "") throw new Exception("Invalid answer format");

        $response_uri = $fileUrl;
        $resultPercent = 100;
    }
    else
    {
        $percent = $data->Percent;

        if ($percent != NULL && $percent != "")
            $resultPercent = $percent;
        if ($resultPercent >= 100)
            $resultPercent = 99;
    }

    return $resultPercent;
}

?>