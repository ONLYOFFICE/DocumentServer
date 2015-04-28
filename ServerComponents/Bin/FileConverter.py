#
# (c) Copyright Ascensio System SIA 2010-2015
#
# This program is a free software product. You can redistribute it and/or 
# modify it under the terms of the GNU Affero General Public License (AGPL) 
# version 3 as published by the Free Software Foundation. In accordance with 
# Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
# that Ascensio System SIA expressly excludes the warranty of non-infringement
# of any third-party rights.
#
# This program is distributed WITHOUT ANY WARRANTY; without even the implied 
# warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
# details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
#
# You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
# EU, LV-1021.
#
# The  interactive user interfaces in modified source and object code versions
# of the Program must display Appropriate Legal Notices, as required under 
# Section 5 of the GNU AGPL version 3.
#
# Pursuant to Section 7(b) of the License you must retain the original Product
# logo when distributing the program. Pursuant to Section 7(e) we decline to
# grant you any rights under trademark law for use of our trademarks.
#
# All the Product's GUI elements, including illustrations and icon sets, as
# well as technical writing content are licensed under the terms of the
# Creative Commons Attribution-ShareAlike 4.0 International. See the License
# terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
#

#----Import---
import datetime
import logging
import os #makedirs
import os.path # check file exists
import xml.etree.ElementTree as ET # read xml
import subprocess
import shutil # copy file
import uno
from os.path import abspath, isfile, splitext, split, join
from com.sun.star.beans import PropertyValue
from com.sun.star.task import ErrorCodeIOException
from com.sun.star.connection import NoConnectException

#----Const----

converterToXport = "2002"
converterToXarg = "socket,host=localhost,port=" + converterToXport + ";urp;StarOffice"
converterToX = 'sudo soffice --headless "--accept=' + converterToXarg + '.ServiceManager"'

converterToT = "./x2t"
AVS_OFFICESTUDIO_FILE_UNKNOWN = "0"
AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX = "65"
AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX = "129"
AVS_OFFICESTUDIO_FILE_PRESENTATION_PPSX = "132"
AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX = "257"
AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF = "513"
AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY = "4097"
AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY = "4098"
AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY = "4099"
AVS_OFFICESTUDIO_FILE_CANVAS_WORD = "8193"
AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET = "8194"
AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION = "8195"
AVS_OFFICESTUDIO_FILE_OTHER_HTMLZIP = "2051"
AVS_OFFICESTUDIO_FILE_OTHER_ZIP = "2057"

InternalFormatsCode = {
    AVS_OFFICESTUDIO_FILE_TEAMLAB_DOCY: ("docx", AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX),
    AVS_OFFICESTUDIO_FILE_TEAMLAB_XLSY: ("xlsx", AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX),
    AVS_OFFICESTUDIO_FILE_TEAMLAB_PPTY: ("pptx", AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX),
    AVS_OFFICESTUDIO_FILE_CANVAS_WORD: ("docx", AVS_OFFICESTUDIO_FILE_DOCUMENT_DOCX),
    AVS_OFFICESTUDIO_FILE_CANVAS_SPREADSHEET: ("xlsx", AVS_OFFICESTUDIO_FILE_SPREADSHEET_XLSX),
    AVS_OFFICESTUDIO_FILE_CANVAS_PRESENTATION: ("pptx", AVS_OFFICESTUDIO_FILE_PRESENTATION_PPTX)
}

ErrorTypes = {
    "ConvertLibreOffice" : 87,
    "ConvertReadFile" : 84,
    "Convert" : 80,
    "Unknown" : 1,
    "NoError" : 0,
}

importFilterMap = {
    "csv": {
        "FilterName": "Text - txt - csv (StarCalc)",
        "FilterOptions": "44,34,0"
    },
    "html": {
        "FilterName": "HTML Document"
    },
    "odp": {
        "FilterName": "OpenDocument Presentation (Flat XML)"
    },
    "rtf": {
        "FilterName": "Rich Text Format"
    },
    "txt": {
        "FilterName": "Text (encoded)",
        "FilterOptions": "utf8"
    }
}

exportFilterMap = {
    "docx": {
        "com.sun.star.text.TextDocument": { "FilterName": "MS Word 2007 XML" },
        "com.sun.star.text.WebDocument": { "FilterName": "MS Word 2007 XML" }
        },
    "xlsx": {
        #"com.sun.star.sheet.SpreadsheetDocument": { "FilterName": "Calc MS Excel 2007 XML" }
        "com.sun.star.sheet.SpreadsheetDocument": { "FilterName": "Calc Office Open XML" }
        },
    "pptx": {
        "com.sun.star.presentation.PresentationDocument": { "FilterName": "Impress MS PowerPoint 2007 XML" }
        },
    "pdf": {
        "com.sun.star.text.TextDocument": { "FilterName": "writer_pdf_Export" },
        "com.sun.star.text.WebDocument": { "FilterName": "writer_web_pdf_Export" },
        "com.sun.star.sheet.SpreadsheetDocument": { "FilterName": "calc_pdf_Export" },
        "com.sun.star.presentation.PresentationDocument": { "FilterName": "impress_pdf_Export" },
        "com.sun.star.drawing.DrawingDocument": { "FilterName": "draw_pdf_Export" }
        },
    "html": {
        "com.sun.star.text.TextDocument": { "FilterName": "HTML (StarWriter)" },
        "com.sun.star.sheet.SpreadsheetDocument": { "FilterName": "HTML (StarCalc)" },
        "com.sun.star.presentation.PresentationDocument": { "FilterName": "impress_html_Export" }
        },
    "odt": {
        "com.sun.star.text.TextDocument": { "FilterName": "writer8" },
        "com.sun.star.text.WebDocument": { "FilterName": "writerweb8_writer" }
        },
    "doc": {
        "com.sun.star.text.TextDocument": { "FilterName": "MS Word 97" }
        },
    "rtf": {
        "com.sun.star.text.TextDocument": { "FilterName": "Rich Text Format" }
        },
    "txt": {
        "com.sun.star.text.TextDocument": {
            "FilterName": "Text",
            "FilterOptions": "utf8"
            }
        },
    "ods": {
        "com.sun.star.sheet.SpreadsheetDocument": { "FilterName": "calc8" }
        },
    "xls": {
        "com.sun.star.sheet.SpreadsheetDocument": { "FilterName": "MS Excel 97" }
        },
    "csv": {
        "com.sun.star.sheet.SpreadsheetDocument": {
            "FilterName": "Text - txt - csv (StarCalc)",
            "FilterOptions": "44,34,0"
            }
        },
    "odp": {
        "com.sun.star.presentation.PresentationDocument": { "FilterName": "impress8" }
        },
    "ppt": {
        "com.sun.star.presentation.PresentationDocument": { "FilterName": "MS PowerPoint 97" }
        }
    }

pageStyleProp = {
    "com.sun.star.sheet.SpreadsheetDocument": {
        #--- Scale options: uncomment 1 of the 3 ---
        # a) 'Reduce / enlarge printout': 'Scaling factor'
        "PageScale": 100,
        # b) 'Fit print range(s) to width / height': 'Width in pages' and 'Height in pages'
        #"ScaleToPagesX": 1, "ScaleToPagesY": 1000,
        # c) 'Fit print range(s) on number of pages': 'Fit print range(s) on number of pages'
        #"ScaleToPages": 1,
        "PrintGrid": False
    }
}


#---Fun---
writeAlert = True
logging.basicConfig(filename="/var/log/onlyoffice/documentserver/FileConverter.log",level=logging.ERROR,format="%(asctime)s %(levelname)s %(name)s - %(message)s")
def alert(text, err=False):
    if writeAlert:
        if err:
            logging.error(text)
        else:
            logging.debug(text)
        print(text)

def readXml(pathToXml):
    parser = ET.XMLParser(encoding="utf-8")
    tree = ET.parse(pathToXml, parser=parser)
    root = tree.getroot()
    oTaskQueueDataConvert = {}
    for child in root:
        oTaskQueueDataConvert[child.tag] = child.text
    alert("Reading xml complete")
    return (oTaskQueueDataConvert, tree)

def writeXml(pathToXml, postfix, tree, sFileFrom, sFormatFrom, sFileTo, sFormatTo):
    newXml = None
    eResult = ErrorTypes["NoError"]
    try:
        root = tree.getroot()
        for child in root:
            if "m_sFileFrom" == child.tag:
                child.text = sFileFrom
            elif  "m_nFormatFrom" == child.tag:
                child.text = sFormatFrom
            elif  "m_sFileTo" == child.tag:
                child.text = sFileTo
            elif  "m_nFormatTo" == child.tag:
                child.text = sFormatTo
        pathSplit = splitext(pathToXml)
        newXml = pathSplit[0] + postfix + pathSplit[1]
        tree.write(newXml, encoding='utf-8', xml_declaration=True, default_namespace=None, method="xml")
    except :
        alert("Error writeXml", True)
        eResult = ErrorTypes["Convert"]
    else :
        alert("Write xml complete:" + newXml)
    return (eResult, newXml)

def incorrectXmlData(oTaskQueueDataConvert):
    sFileFrom = oTaskQueueDataConvert.get("m_sFileFrom")
    if not sFileFrom:
        return "m_sFileFrom is null"
    if not os.path.exists(sFileFrom):
        return "{} not found".format(sFileFrom)
    
    sFileTo = oTaskQueueDataConvert.get("m_sFileTo")
    if not sFileTo:
        return "m_sFileTo is null"
    if os.path.exists(sFileTo):
        os.remove(sFileTo)

    return None

def getFileExt(path):
    ext = splitext(path)[1]
    if ext is not None:
        return ext[1:].lower()

def getStoreProperties(document, outputExt):
    family = detectFamily(document)
    try:
        propertiesByFamily = exportFilterMap[outputExt]
    except KeyError:
        raise Exception("unknown output format: '{}'".format(outputExt))
    try:
        return propertiesByFamily[family]
    except KeyError:
        raise Exception("unsupported conversion: from '{}' to '{}'".format(family, outputExt))

def detectFamily(document):
    if document.supportsService("com.sun.star.text.WebDocument"):
        return "com.sun.star.text.WebDocument"
    if document.supportsService("com.sun.star.text.GenericTextDocument"):
        # must be TextDocument or GlobalDocument
        return "com.sun.star.text.TextDocument"
    if document.supportsService("com.sun.star.sheet.SpreadsheetDocument"):
        return "com.sun.star.sheet.SpreadsheetDocument"
    if document.supportsService("com.sun.star.presentation.PresentationDocument"):
        return "com.sun.star.presentation.PresentationDocument"
    raise Exception("unknown document family: {}".format(document))

def overridePageStyleProperties(document, family):
    if pageStyleProp.get(family):
        properties = pageStyleProp[family]
        pageStyles = document.getStyleFamilies().getByName("PageStyles")
        for styleName in pageStyles.getElementNames():
            pageStyle = pageStyles.getByName(styleName)
            for name, value in properties.items():
                pageStyle.setPropertyValue(name, value)

def toProperties(dict):
    props = []
    for key in dict:
        prop = PropertyValue()
        prop.Name = key
        prop.Value = dict[key]
        props.append(prop)
    return tuple(props)

def initOffice():
    alert("init office")

    #subprocess.Popen(converterToX, shell = True)
    alert("office started")

    componentContext = uno.getComponentContext()
    alert("uno context")

    resolver = componentContext.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", componentContext)
    alert("instance created")

    try:
        officeContext = resolver.resolve("uno:" + converterToXarg + ".ComponentContext")
        alert("ComponentContext resolved")
    except NoConnectException:
        alert("failed to connect to OpenOffice.org on port " + converterToXport, True)
        raise Exception("failed to connect to OpenOffice.org on port " + converterToXport)

    return officeContext.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop", officeContext)

def convertOfficeWithHtmlZip(inputFileUrl, outputFileUrl, outputFormatCode, pathToXml, tree):
    eResult = ErrorTypes["NoError"]
    if AVS_OFFICESTUDIO_FILE_OTHER_HTMLZIP == outputFormatCode :
        outputHtmlDir = join(split(inputFileUrl)[0], "htmlzip")
        if not os.path.exists(outputHtmlDir):
            os.makedirs(outputHtmlDir)
        outputFileUrlHtml = join(outputHtmlDir, "output.html")
        eResult = convertOffice(inputFileUrl, outputFileUrlHtml)
        if eResult == ErrorTypes["NoError"] :
            writeXmlRes = writeXml(pathToXml, "_htmlzip", tree, outputHtmlDir, AVS_OFFICESTUDIO_FILE_UNKNOWN, outputFileUrl, AVS_OFFICESTUDIO_FILE_OTHER_ZIP)
            eResult = writeXmlRes[0]
            if eResult == ErrorTypes["NoError"] :
                eResult = convertASC(writeXmlRes[1])
    else :
        eResult = convertOffice(inputFileUrl, outputFileUrl)
    return eResult

def convertOffice(inputFileUrl, outputFileUrl):
    nRes = ErrorTypes["NoError"]
    try:
        desktop = initOffice()
        alert("office desktop created")
        
        inputFileUrl = uno.systemPathToFileUrl(abspath(inputFileUrl))
        alert("from " + inputFileUrl)
        outputFileUrl = uno.systemPathToFileUrl(abspath(outputFileUrl))
        alert("to " + outputFileUrl)

        loadProperties = { "Hidden": True }
        inputExt = getFileExt(inputFileUrl)
        if importFilterMap.get(inputExt):
            loadProperties.update(importFilterMap[inputExt])

        alert("document loading")
        document = desktop.loadComponentFromURL(inputFileUrl, "_blank", 0, toProperties(loadProperties))
        alert("document loaded")

        try:
            document.refresh()
        except AttributeError:
            pass

        family = detectFamily(document)
        overridePageStyleProperties(document, family)

        outputExt = getFileExt(outputFileUrl)
        storeProperties = getStoreProperties(document, outputExt)

        alert("document storing")
        try:
            document.storeToURL(outputFileUrl, toProperties(storeProperties))
            alert("document stored")
        finally:
            document.close(True)        
    except:
        alert("Error convert", True)
        nRes = ErrorTypes["ConvertLibreOffice"]
    return nRes

def convertASC(paramXml):
    alert("convert with x2t")
    processPath = converterToT + ' "' + paramXml + '"'
    alert(processPath)
    p = subprocess.Popen(processPath, shell = True)
    returnCode = p.wait()
    alert("convert with x2t return:{}".format(returnCode))
    return returnCode

#---Begin---
if __name__ == "__main__":
    from sys import argv, exit

    eResult = ErrorTypes["NoError"]

    if len(argv) < 2:
        alert("Not found xml")
        exit(ErrorTypes["ConvertReadFile"])
    pathToXml = argv[1]
    alert("pathToXml: " + pathToXml)

    if not os.path.exists(pathToXml):
        alert("{} not found".format(pathToXml), True)
        exit(ErrorTypes["ConvertReadFile"])

    try:
        alert("read xml")
        resultReadXml = readXml(pathToXml)
        oTaskQueueDataConvert = resultReadXml[0]
        incorrect = incorrectXmlData(oTaskQueueDataConvert)
        if incorrect:
            alert(incorrect)
            exit(ErrorTypes["ConvertReadFile"])
        alert("correct data")
    except:
        alert("Error xml read", True)
        exit(ErrorTypes["Convert"])

    inputFileUrl = oTaskQueueDataConvert.get("m_sFileFrom")
    alert("from " + inputFileUrl)
    inputFormatCode = oTaskQueueDataConvert.get("m_nFormatFrom")
    outputFileUrl = oTaskQueueDataConvert.get("m_sFileTo")
    alert("to " + outputFileUrl)
    outputFormatCode = oTaskQueueDataConvert.get("m_nFormatTo")
    fromT = InternalFormatsCode.get(inputFormatCode)
    bFromT = fromT is not None
    toT = InternalFormatsCode.get(outputFormatCode)
    bToT = toT is not None

    if inputFormatCode == outputFormatCode :
        alert("from equal to")
        if inputFileUrl != outputFileUrl :
            shutil.copyfile(inputFileUrl, outputFileUrl)
        exit(eResult)
    elif AVS_OFFICESTUDIO_FILE_UNKNOWN == inputFormatCode and AVS_OFFICESTUDIO_FILE_CROSSPLATFORM_PDF == outputFormatCode :
        alert("convert from bin to pdf")
        eResult = convertASC(pathToXml)
        exit(eResult)
    elif AVS_OFFICESTUDIO_FILE_PRESENTATION_PPSX == inputFormatCode :
        alert("convert from ppsx to")
        eResult = convertASC(pathToXml)
        exit(eResult)
    elif bFromT or bToT :
        if (bFromT and bToT) or (bFromT and fromT[1] == outputFormatCode) or (bToT and toT[1] == inputFormatCode) :
            eResult = convertASC(pathToXml)
        else :
            if bFromT :
                tempFile = join(split(inputFileUrl)[0], "temp." + fromT[0])
                alert("tempFile " + tempFile)
                writeXmlRes = writeXml(pathToXml, "_t2x", resultReadXml[1], inputFileUrl, inputFormatCode, tempFile, fromT[1])
                eResult = writeXmlRes[0]
                if eResult == ErrorTypes["NoError"] :
                    eResult = convertASC(writeXmlRes[1])
                    if eResult == ErrorTypes["NoError"] :
                        eResult = convertOfficeWithHtmlZip(tempFile, outputFileUrl, outputFormatCode, pathToXml, resultReadXml[1])
            else :
                tempFile = join(split(inputFileUrl)[0], "temp." + toT[0])
                alert("tempFile " + tempFile)
                eResult = convertOfficeWithHtmlZip(inputFileUrl, tempFile, toT[1], pathToXml, resultReadXml[1])
                if eResult == ErrorTypes["NoError"] :
                    writeXmlRes = writeXml(pathToXml, "_x2t", resultReadXml[1], tempFile, toT[1], outputFileUrl, outputFormatCode)
                    eResult = writeXmlRes[0]
                    if eResult == ErrorTypes["NoError"] :
                        eResult = convertASC(writeXmlRes[1])
    else :
        eResult = convertOfficeWithHtmlZip(inputFileUrl, outputFileUrl, outputFormatCode, pathToXml, resultReadXml[1])

    alert("Exit code:{}".format(eResult))
    exit(eResult)
