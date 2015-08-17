/*
 * (c) Copyright Ascensio System SIA 2010-2015
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 "use strict";
var ASC_SPREADSHEET_API_CO_AUTHORING_ENABLE = true;
var editor;
var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";
(function ($, window, undefined) {
    var asc = window["Asc"];
    var asc_applyFunction = asc.applyFunction;
    var asc_CCollaborativeEditing = asc.CCollaborativeEditing;
    var asc_CAdjustPrint = asc.asc_CAdjustPrint;
    var asc_CAscEditorPermissions = asc.asc_CAscEditorPermissions;
    var asc_CAscLicense = asc.asc_CAscLicense;
    var asc_CTrackFile = asc.CTrackFile;
    var prot;
    var CDocsCoApi = window["CDocsCoApi"];
    function spreadsheet_api(name, inputName, eventsHandlers) {
        g_fontApplication.Init();
        this.HtmlElementName = name;
        this.topLineEditorName = inputName;
        this.HtmlElement = null;
        this.topLineEditorElement = null;
        this.controller = new asc.asc_CEventsController();
        this.handlers = new asc.asc_CHandlersList(eventsHandlers);
        this.adjustPrint = null;
        this.printPagesData = null;
        this.isMobileVersion = false;
        this.fontRenderingMode = c_oAscFontRenderingModeType.hintingAndSubpixeling;
        this.wb = null;
        this.wbModel = null;
        this.FontLoader = window.g_font_loader;
        this.FontLoader.put_Api(this);
        this.FontLoader.SetStandartFonts();
        this.LoadedObject = null;
        this.DocumentType = 0;
        this.DocumentName = "";
        this.documentId = undefined;
        this.documentUserId = undefined;
        this.documentUrl = "null";
        this.documentUrlChanges = null;
        this.documentTitle = "null";
        this.documentTitleWithoutExtention = "null";
        this.documentFormat = "null";
        this.documentVKey = null;
        this.documentFormatSave = c_oAscFileType.XLSX;
        this.documentFormatSaveCsvCodepage = 65001;
        this.documentFormatSaveCsvDelimiter = c_oAscCsvDelimiter.Comma;
        this.chartEditor = undefined;
        this.documentOpenOptions = undefined;
        this.documentCallbackUrl = undefined;
        this.DocInfo = null;
        this.guiFonts = null;
        this.guiStyles = null;
        this._gui_control_colors = null;
        this._gui_color_schemes = null;
        this.GuiControlColorsMap = null;
        this.IsSendStandartColors = false;
        this.tablePictures = null;
        this.asyncMethodCallback = undefined;
        this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
        this.FontLoadWaitComplete = false;
        this.ServerIdWaitComplete = false;
        this.DocumentLoadComplete = false;
        this.IsSendDocumentLoadCompleate = false;
        this.oRedoObjectParamNative = null;
        this.User = undefined;
        this.CoAuthoringApi = new CDocsCoApi();
        this.collaborativeEditing = null;
        this.isCoAuthoringEnable = true;
        this.isDocumentCanSave = false;
        this.lastSaveTime = null;
        this.autoSaveGapFast = 2000;
        this.autoSaveGapSlow = 10 * 60 * 1000;
        this.autoSaveGap = 0;
        this.isAutoSave = false;
        this.canSave = true;
        this.waitSave = false;
        this.isChartEditor = false;
        if (typeof ChartPreviewManager !== "undefined") {
            this.chartPreviewManager = new ChartPreviewManager();
        }
        this.chartTranslate = new asc_CChartTranslate();
        this.isStartAddShape = false;
        this.ImageLoader = window.g_image_loader;
        this.ImageLoader.put_Api(this);
        this.shapeElementId = null;
        this.isImageChangeUrl = false;
        this.isShapeImageChangeUrl = false;
        this.IsFocus = null;
        this.OpenDocumentProgress = {
            Type: c_oAscAsyncAction.Open,
            FontsCount: 0,
            CurrentFont: 0,
            ImagesCount: 0,
            CurrentImage: 0
        };
        this.isUseEmbeddedCutFonts = ("true" == ASC_DOCS_API_USE_EMBEDDED_FONTS.toLowerCase());
        this.TrackFile = null;
        this._init();
        return this;
    }
    spreadsheet_api.prototype._init = function () {
        var t = this;
        this.HtmlElement = document.getElementById(this.HtmlElementName);
        this.topLineEditorElement = document.getElementById(this.topLineEditorName);
        if ("undefined" != typeof(FileReader) && "undefined" != typeof(FormData) && null != this.HtmlElement) {
            this.HtmlElement["ondragover"] = function (e) {
                t._onDragOverImage(e);
            };
            this.HtmlElement["ondrop"] = function (e) {
                t._onDropImage(e);
            };
        }
    };
    spreadsheet_api.prototype._onDragOverImage = function (e) {
        e.preventDefault();
        if (CanDropFiles(e)) {
            e.dataTransfer.dropEffect = "copy";
        } else {
            e.dataTransfer.dropEffect = "none";
        }
        return false;
    };
    spreadsheet_api.prototype._onDropImage = function (e) {
        var t = this;
        e.preventDefault();
        var files = e.dataTransfer.files;
        var nError = ValidateUploadImage(files);
        if (c_oAscServerError.NoError == nError) {
            var worksheet = null;
            if (null != this.wbModel) {
                worksheet = this.wbModel.getWorksheet(this.wbModel.getActive());
            }
            if (null != worksheet) {
                this.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                var xhr = new XMLHttpRequest();
                var fd = new FormData();
                for (var i = 0, length = files.length; i < length; i++) {
                    fd.append("file[" + i + "]", files[i]);
                }
                xhr.open("POST", g_sUploadServiceLocalUrl + "?key=" + this.documentId + "&sheetId=" + worksheet.getId());
                xhr.onreadystatechange = function () {
                    if (4 == this.readyState) {
                        if ((this.status == 200 || this.status == 1223)) {
                            var frameWindow = GetUploadIFrame();
                            var content = this.responseText;
                            frameWindow.document.open();
                            frameWindow.document.write(content);
                            frameWindow.document.close();
                        } else {
                            t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
                        }
                        t.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                    }
                };
                xhr.send(fd);
            }
        } else {
            this.handlers.trigger("asc_onError", this.asc_mapAscServerErrorToAscError(nError), c_oAscError.Level.NoCritical);
        }
    };
    spreadsheet_api.prototype.asc_CheckGuiControlColors = function () {
        var arr_colors = new Array(10);
        var _count = arr_colors.length;
        for (var i = 0; i < _count; ++i) {
            var color = g_oColorManager.getThemeColor(i);
            arr_colors[i] = new CColor(color.getR(), color.getG(), color.getB());
        }
        var bIsSend = false;
        if (this.GuiControlColorsMap != null) {
            for (var i = 0; i < _count; ++i) {
                var _color1 = this.GuiControlColorsMap[i];
                var _color2 = arr_colors[i];
                if ((_color1.r !== _color2.r) || (_color1.g !== _color2.g) || (_color1.b !== _color2.b)) {
                    bIsSend = true;
                    break;
                }
            }
        } else {
            this.GuiControlColorsMap = new Array(_count);
            bIsSend = true;
        }
        if (bIsSend) {
            for (var i = 0; i < _count; ++i) {
                this.GuiControlColorsMap[i] = arr_colors[i];
            }
            this.asc_SendControlColors();
        }
    };
    spreadsheet_api.prototype.asc_SendControlColors = function () {
        var standart_colors = null;
        if (!this.IsSendStandartColors) {
            var _c_s = g_oStandartColors.length;
            standart_colors = new Array(_c_s);
            for (var i = 0; i < _c_s; ++i) {
                standart_colors[i] = new CColor(g_oStandartColors[i]["R"], g_oStandartColors[i]["G"], g_oStandartColors[i]["B"]);
            }
            this.IsSendStandartColors = true;
        }
        var _count = this.GuiControlColorsMap.length;
        var _ret_array = new Array(_count * 6);
        var _cur_index = 0;
        for (var i = 0; i < _count; ++i) {
            var basecolor = g_oColorManager.getThemeColor(i);
            var aTints = g_oThemeColorsDefaultModsSpreadsheet[GetDefaultColorModsIndex(basecolor.getR(), basecolor.getG(), basecolor.getB())];
            for (var j = 0, length = aTints.length; j < length; ++j) {
                var tint = aTints[j];
                var color = g_oColorManager.getThemeColor(i, tint);
                _ret_array[_cur_index] = new CColor(color.getR(), color.getG(), color.getB());
                _cur_index++;
            }
        }
        this.asc_SendThemeColors(_ret_array, standart_colors);
    };
    spreadsheet_api.prototype.asc_SendThemeColorScheme = function () {
        var infos = [];
        var _index = 0;
        var _c = null;
        var _count_defaults = g_oUserColorScheme.length;
        for (var i = 0; i < _count_defaults; ++i) {
            var _obj = g_oUserColorScheme[i];
            infos[_index] = new CAscColorScheme();
            infos[_index].Name = _obj["name"];
            _c = _obj["dk1"];
            infos[_index].Colors[0] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["lt1"];
            infos[_index].Colors[1] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["dk2"];
            infos[_index].Colors[2] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["lt2"];
            infos[_index].Colors[3] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent1"];
            infos[_index].Colors[4] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent2"];
            infos[_index].Colors[5] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent3"];
            infos[_index].Colors[6] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent4"];
            infos[_index].Colors[7] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent5"];
            infos[_index].Colors[8] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent6"];
            infos[_index].Colors[9] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["hlink"];
            infos[_index].Colors[10] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["folHlink"];
            infos[_index].Colors[11] = new CColor(_c["R"], _c["G"], _c["B"]);
            ++_index;
        }
        var _theme = this.wbModel.theme;
        var _extra = _theme.extraClrSchemeLst;
        var _count = _extra.length;
        var _rgba = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        for (var i = 0; i < _count; ++i) {
            var _scheme = _extra[i].clrScheme;
            infos[_index] = new CAscColorScheme();
            infos[_index].Name = _scheme.name;
            _scheme.colors[8].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[8].RGBA;
            infos[_index].Colors[0] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[12].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[12].RGBA;
            infos[_index].Colors[1] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[9].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[9].RGBA;
            infos[_index].Colors[2] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[13].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[13].RGBA;
            infos[_index].Colors[3] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[0].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[0].RGBA;
            infos[_index].Colors[4] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[1].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[1].RGBA;
            infos[_index].Colors[5] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[2].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[2].RGBA;
            infos[_index].Colors[6] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[3].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[3].RGBA;
            infos[_index].Colors[7] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[4].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[4].RGBA;
            infos[_index].Colors[8] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[5].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[5].RGBA;
            infos[_index].Colors[9] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[11].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[11].RGBA;
            infos[_index].Colors[10] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[10].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[10].RGBA;
            infos[_index].Colors[11] = new CColor(_c.R, _c.G, _c.B);
            _index++;
        }
        this.asc_SendThemeColorSchemes(infos);
    };
    spreadsheet_api.prototype.asc_GetFontThumbnailsPath = function () {
        return "../Common/Images/";
    };
    spreadsheet_api.prototype.asc_Init = function (fontsPath) {
        var t = this;
        asc["editor"] = (asc["editor"] || t);
        t.FontLoader.fontFilesPath = fontsPath;
        t.asc_registerCallback("loadFonts", function (fonts, callback) {
            t._loadFonts(fonts, callback);
        });
    };
    spreadsheet_api.prototype.asc_setDocInfo = function (c_DocInfo) {
        if (c_DocInfo) {
            this.DocInfo = c_DocInfo;
        }
    };
    spreadsheet_api.prototype.asc_setLocale = function (val) {};
    spreadsheet_api.prototype.asc_LoadDocument = function (c_DocInfo) {
        var t = this;
        this.asc_setDocInfo(c_DocInfo);
        if (this.DocInfo) {
            this.documentId = this.DocInfo["Id"];
            this.documentUserId = this.DocInfo["UserId"];
            this.documentUrl = this.DocInfo["Url"];
            this.documentTitle = this.DocInfo["Title"];
            this.documentFormat = this.DocInfo["Format"];
            this.documentVKey = this.DocInfo["VKey"];
            this.chartEditor = this.DocInfo["ChartEditor"];
            this.documentOpenOptions = this.DocInfo["Options"];
            this.documentCallbackUrl = this.DocInfo["CallbackUrl"];
            var nIndex = -1;
            if (this.documentTitle) {
                nIndex = this.documentTitle.lastIndexOf(".");
            }
            if (-1 != nIndex) {
                this.documentTitleWithoutExtention = this.documentTitle.substring(0, nIndex);
            } else {
                this.documentTitleWithoutExtention = this.documentTitle;
            }
            this.User = new asc.asc_CUser();
            this.User.asc_setId(this.DocInfo["UserId"]);
            this.User.asc_setUserName(this.DocInfo["UserName"]);
        }
        if (undefined !== window["AscDesktopEditor"]) {
            window["AscDesktopEditor"]["SetDocumentName"](this.documentTitle);
        }
        if (this.DocInfo["OfflineApp"] && (true == this.DocInfo["OfflineApp"])) {
            this.isCoAuthoringEnable = false;
            window["scriptBridge"] = {};
            this.offlineModeInit();
            this.offlineModeLoadDocument();
            return;
        }
        this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        if (!this.chartEditor) {
            this._asc_open(function (response) {
                t._startOpenDocument(response);
            });
        }
    };
    spreadsheet_api.prototype.asc_LoadEmptyDocument = function () {
        var emptyWorkbook = getEmptyWorkbook() + "";
        if (emptyWorkbook.length && (Asc.c_oSerFormat.Signature === emptyWorkbook.substring(0, Asc.c_oSerFormat.Signature.length))) {
            this.isChartEditor = true;
            var wb = this.asc_OpenDocument("", emptyWorkbook);
            this._startOpenDocument({
                returnCode: 0,
                val: wb
            });
        }
    };
    spreadsheet_api.prototype.asc_OpenDocument = function (url, data) {
        var wb = new Workbook(url, this.handlers, this);
        this.initGlobalObjects(wb);
        this.wbModel = wb;
        var oBinaryFileReader = new Asc.BinaryFileReader(url);
        oBinaryFileReader.Read(data, wb);
        g_oIdCounter.Set_Load(false);
        return wb;
    };
    spreadsheet_api.prototype.initGlobalObjects = function (wbModel) {
        History = new CHistory(wbModel);
        g_oIdCounter = new CIdCounter();
        g_oTableId = new CTableId();
        if (this.User) {
            g_oIdCounter.Set_UserId(this.User.asc_getId());
        }
        g_oUndoRedoCell = new UndoRedoCell(wbModel);
        g_oUndoRedoWorksheet = new UndoRedoWoorksheet(wbModel);
        g_oUndoRedoWorkbook = new UndoRedoWorkbook(wbModel);
        g_oUndoRedoCol = new UndoRedoRowCol(wbModel, false);
        g_oUndoRedoRow = new UndoRedoRowCol(wbModel, true);
        g_oUndoRedoComment = new UndoRedoComment(wbModel);
        g_oUndoRedoAutoFilters = new UndoRedoAutoFilters(wbModel);
        CHART_STYLE_MANAGER = new CChartStyleManager();
    };
    spreadsheet_api.prototype.asc_getEditorPermissions = function () {
        if (this.DocInfo && this.DocInfo["Id"] && this.DocInfo["Url"]) {
            var t = this;
            var rdata = {
                "c": "getsettings",
                "id": this.DocInfo["Id"],
                "userid": this.DocInfo["UserId"],
                "format": this.DocInfo["Format"],
                "vkey": this.DocInfo["VKey"],
                "editorid": c_oEditorId.Spreadsheet
            };
            this._asc_sendCommand(function (response) {
                t._onGetEditorPermissions(response);
            },
            rdata);
        } else {
            this.handlers.trigger("asc_onGetEditorPermissions", new asc_CAscEditorPermissions());
        }
    };
    spreadsheet_api.prototype.asc_getLicense = function () {
        var t = this;
        var rdata = {
            "c": "getlicense"
        };
        this._asc_sendCommand(function (response) {
            t._onGetLicense(response);
        },
        rdata);
    };
    spreadsheet_api.prototype.asc_DownloadAs = function (typeFile) {
        if (!this.canSave || this.isChartEditor || c_oAscAdvancedOptionsAction.None !== this.advancedOptionsAction) {
            return;
        }
        if (undefined != window["appBridge"]) {
            window["appBridge"]["dummyCommandDownloadAs"]();
            return;
        }
        this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
        var that = this;
        this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
        this._asc_downloadAs(typeFile, function (incomeObject) {
            if (null != incomeObject && "save" == incomeObject["type"]) {
                that.asc_processSavedFile(incomeObject["data"], false);
            }
            that.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
            that.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
        },
        true);
    };
    spreadsheet_api.prototype.asc_Save = function (isAutoSave) {
        if (!this.canSave || this.isChartEditor || c_oAscAdvancedOptionsAction.None !== this.advancedOptionsAction || this.waitSave) {
            return;
        }
        this.isAutoSave = !!isAutoSave;
        if (!this.isAutoSave) {
            this.asc_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
        }
        this.asc_closeCellEditor();
        this.canSave = false;
        var t = this;
        this.CoAuthoringApi.askSaveChanges(function (e) {
            t.onSaveCallback(e);
        });
    };
    spreadsheet_api.prototype.asc_Print = function (adjustPrint) {
        if (window["AscDesktopEditor"]) {
            window.AscDesktopEditor_PrintData = adjustPrint;
            window["AscDesktopEditor"]["Print"]();
            return;
        }
        this.adjustPrint = adjustPrint ? adjustPrint : new asc_CAdjustPrint();
        this.asc_DownloadAs(c_oAscFileType.PDFPRINT);
    };
    spreadsheet_api.prototype.asc_Copy = function () {
        if (window["AscDesktopEditor"]) {
            window["AscDesktopEditorButtonMode"] = true;
            var _e = {};
            _e.ctrlKey = true;
            _e.shiftKey = false;
            _e.which = 67;
            this.controller._onWindowKeyDown(_e);
            window["AscDesktopEditorButtonMode"] = false;
            return;
        }
        var result = this.wb.copyToClipboardButton();
        this.wb.restoreFocus();
        return result;
    };
    spreadsheet_api.prototype.asc_Paste = function () {
        if (window["AscDesktopEditor"]) {
            window["AscDesktopEditorButtonMode"] = true;
            var _e = {};
            _e.ctrlKey = true;
            _e.shiftKey = false;
            _e.which = 86;
            this.controller._onWindowKeyDown(_e);
            window["AscDesktopEditorButtonMode"] = false;
            return;
        }
        var result = this.wb.pasteFromClipboardButton();
        this.wb.restoreFocus();
        return result;
    };
    spreadsheet_api.prototype.asc_Cut = function () {
        if (window["AscDesktopEditor"]) {
            window["AscDesktopEditorButtonMode"] = true;
            var _e = {};
            _e.ctrlKey = true;
            _e.shiftKey = false;
            _e.which = 88;
            this.controller._onWindowKeyDown(_e);
            window["AscDesktopEditorButtonMode"] = false;
            return;
        }
        var result = this.wb.cutToClipboardButton();
        this.wb.restoreFocus();
        return result;
    };
    spreadsheet_api.prototype.asc_bIsEmptyClipboard = function () {
        var result = this.wb.bIsEmptyClipboard();
        this.wb.restoreFocus();
        return result;
    };
    spreadsheet_api.prototype.asc_Undo = function () {
        this.wb.undo();
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_Redo = function () {
        this.wb.redo();
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_Resize = function () {
        if (this.wb) {
            this.wb.resize();
        }
    };
    spreadsheet_api.prototype.asc_addAutoFilter = function (lTable, addFormatTableOptionsObj) {
        var ws = this.wb.getWorksheet();
        return ws.addAutoFilter(lTable, addFormatTableOptionsObj);
    };
    spreadsheet_api.prototype.asc_applyAutoFilter = function (type, autoFilterObject) {
        var ws = this.wb.getWorksheet();
        ws.applyAutoFilter(type, autoFilterObject);
    };
    spreadsheet_api.prototype.asc_sortColFilter = function (type, cellId) {
        var ws = this.wb.getWorksheet();
        ws.sortColFilter(type, cellId);
    };
    spreadsheet_api.prototype.asc_getAddFormatTableOptions = function () {
        var ws = this.wb.getWorksheet();
        return ws.getAddFormatTableOptions();
    };
    spreadsheet_api.prototype.asc_clearFilter = function () {
        var ws = this.wb.getWorksheet();
        return ws.clearFilter();
    };
    spreadsheet_api.prototype.asc_setAutoSaveGap = function (autoSaveGap) {
        if (typeof autoSaveGap === "number") {
            this.autoSaveGap = autoSaveGap * 1000;
        }
    };
    spreadsheet_api.prototype.asc_setMobileVersion = function (isMobile) {
        this.isMobileVersion = isMobile;
        AscBrowser.isMobileVersion = isMobile;
    };
    spreadsheet_api.prototype.asc_getViewerMode = function () {
        return this.controller.getViewerMode();
    };
    spreadsheet_api.prototype.asc_setViewerMode = function (isViewerMode) {
        this.controller.setViewerMode(isViewerMode);
        if (this.collaborativeEditing) {
            this.collaborativeEditing.setViewerMode(isViewerMode);
        }
        if (false === isViewerMode) {
            if (this.FontLoader.embedded_cut_manager.bIsCutFontsUse) {
                this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
                this.asyncMethodCallback = undefined;
                this.FontLoader.LoadDocumentFonts(this.wbModel.generateFontMap2());
            }
            this.isUseEmbeddedCutFonts = false;
            this._sendWorkbookStyles();
            if (this.wb) {
                this.wb._initCommentsToSave();
            }
            if (this.IsSendDocumentLoadCompleate && this.collaborativeEditing) {
                this.collaborativeEditing.applyChanges();
                this.collaborativeEditing.sendChanges();
            }
        }
    };
    spreadsheet_api.prototype.asc_setUseEmbeddedCutFonts = function (bUse) {
        this.isUseEmbeddedCutFonts = bUse;
    };
    spreadsheet_api.prototype.asc_setCoAuthoringEnable = function (isCoAuthoringEnable) {
        this.isCoAuthoringEnable = !!isCoAuthoringEnable;
    };
    spreadsheet_api.prototype.asc_setAdvancedOptions = function (idOption, option) {
        var t = this;
        switch (idOption) {
        case c_oAscAdvancedOptionsID.CSV:
            if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open) {
                this.documentFormatSaveCsvCodepage = option.asc_getCodePage();
                this.documentFormatSaveCsvDelimiter = option.asc_getDelimiter();
                var v = {
                    "id": this.documentId,
                    "userid": this.documentUserId,
                    "format": this.documentFormat,
                    "vkey": this.documentVKey,
                    "editorid": c_oEditorId.Spreadsheet,
                    "c": "reopen",
                    "url": this.documentUrl,
                    "title": this.documentTitle,
                    "embeddedfonts": this.isUseEmbeddedCutFonts,
                    "delimiter": option.asc_getDelimiter(),
                    "codepage": option.asc_getCodePage()
                };
                this._asc_sendCommand(function (response) {
                    t._startOpenDocument(response);
                },
                v);
            } else {
                if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Save) {
                    this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
                    this._asc_downloadAs(c_oAscFileType.CSV, function (incomeObject) {
                        if (null != incomeObject && "save" == incomeObject["type"]) {
                            t.asc_processSavedFile(incomeObject["data"], false);
                        }
                        t.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
                        t.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
                    },
                    true, option);
                }
            }
            break;
        }
    };
    spreadsheet_api.prototype.asc_processSavedFile = function (url, bInner) {
        if (bInner) {
            this.handlers.trigger("asc_onSaveUrl", url, function (hasError) {});
        } else {
            getFile(url);
        }
    };
    spreadsheet_api.prototype.asc_setPageOptions = function (options, index) {
        var sheetIndex = (undefined !== index && null !== index) ? index : this.wbModel.getActive();
        this.wbModel.getWorksheet(sheetIndex).PagePrintOptions = options;
    };
    spreadsheet_api.prototype.asc_getPageOptions = function (index) {
        var sheetIndex = (undefined !== index && null !== index) ? index : this.wbModel.getActive();
        return this.wbModel.getWorksheet(sheetIndex).PagePrintOptions;
    };
    spreadsheet_api.prototype._asc_sendCommand = function (callback, rdata) {
        var sData;
        var sRequestContentType = "application/json";
        if (null != rdata["data"] && "string" === typeof(rdata["data"]) && rdata["data"].length > g_nMaxJsonLengthChecked) {
            var sTemp = rdata["data"];
            rdata["data"] = null;
            sData = "mnuSaveAs" + cCharDelimiter + JSON.stringify(rdata) + cCharDelimiter + sTemp;
            sRequestContentType = "application/octet-stream";
        } else {
            sData = JSON.stringify(rdata);
        }
        var oThis = this;
        asc_ajax({
            type: "POST",
            url: g_sMainServiceLocalUrl,
            data: sData,
            contentType: sRequestContentType,
            error: function () {
                var result = {
                    returnCode: c_oAscError.Level.Critical,
                    val: c_oAscError.ID.Unknown
                };
                oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
                if (callback) {
                    callback(result);
                }
            },
            success: function (msg) {
                var result, rData, codePageCsv, delimiterCsv;
                if (!msg || msg.length < 1) {
                    result = {
                        returnCode: c_oAscError.Level.Critical,
                        val: c_oAscError.ID.Unknown
                    };
                    oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
                    if (callback) {
                        callback(result);
                    }
                } else {
                    var incomeObject = JSON.parse(msg);
                    switch (incomeObject["type"]) {
                    case "updateversion":
                        if (oThis.asc_getViewerMode()) {
                            oThis._onOpenCommand(callback, incomeObject["data"]);
                        } else {
                            oThis.handlers.trigger("asc_onDocumentUpdateVersion", function () {
                                oThis.asc_setViewerMode(true);
                                oThis._onOpenCommand(callback, incomeObject["data"]);
                            });
                        }
                        break;
                    case "open":
                        oThis._onOpenCommand(callback, incomeObject["data"]);
                        break;
                    case "needparams":
                        if (oThis.documentOpenOptions) {
                            codePageCsv = oThis.documentOpenOptions["codePage"];
                            delimiterCsv = oThis.documentOpenOptions["delimiter"];
                            if (null !== codePageCsv && undefined !== codePageCsv && null !== delimiterCsv && undefined !== delimiterCsv) {
                                oThis.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new asc.asc_CCSVAdvancedOptions(codePageCsv, delimiterCsv));
                                break;
                            }
                        }
                        asc_ajax({
                            url: incomeObject["data"],
                            dataType: "text",
                            success: function (result) {
                                var cp = JSON.parse(result);
                                oThis.handlers.trigger("asc_onAdvancedOptions", new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV, cp), oThis.advancedOptionsAction);
                            },
                            error: function () {
                                result = {
                                    returnCode: c_oAscError.Level.Critical,
                                    val: c_oAscError.ID.Unknown
                                };
                                oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
                                if (callback) {
                                    callback(result);
                                }
                            }
                        });
                        break;
                    case "getcodepage":
                        if (oThis.documentOpenOptions) {
                            codePageCsv = oThis.documentOpenOptions["codePage"];
                            delimiterCsv = oThis.documentOpenOptions["delimiter"];
                            if (null !== codePageCsv && undefined !== codePageCsv && null !== delimiterCsv && undefined !== delimiterCsv) {
                                oThis.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new asc.asc_CCSVAdvancedOptions(codePageCsv, delimiterCsv));
                                break;
                            }
                        }
                        var cp = JSON.parse(incomeObject["data"]);
                        oThis.handlers.trigger("asc_onAdvancedOptions", new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV, cp), oThis.advancedOptionsAction);
                        break;
                    case "save":
                        if (callback) {
                            callback(incomeObject);
                        }
                        break;
                    case "waitopen":
                        rData = {
                            "id": oThis.documentId,
                            "userid": oThis.documentUserId,
                            "format": oThis.documentFormat,
                            "vkey": oThis.documentVKey,
                            "editorid": c_oEditorId.Spreadsheet,
                            "c": "chopen"
                        };
                        setTimeout(function () {
                            oThis._asc_sendCommand(callback, rData);
                        },
                        3000);
                        break;
                    case "waitsave":
                        rData = {
                            "id": oThis.documentId,
                            "userid": oThis.documentUserId,
                            "vkey": oThis.documentVKey,
                            "title": oThis.documentTitleWithoutExtention,
                            "c": "chsave",
                            "data": incomeObject["data"]
                        };
                        setTimeout(function () {
                            oThis._asc_sendCommand(callback, rData);
                        },
                        3000);
                        break;
                    case "savepart":
                        var outputData = JSON.parse(incomeObject["data"]);
                        oThis._asc_downloadAs(outputData["format"], callback, false, null, outputData["savekey"]);
                        break;
                    case "getsettings":
                        if (callback) {
                            callback(incomeObject);
                        }
                        break;
                    case "err":
                        var nErrorLevel = c_oAscError.Level.NoCritical;
                        var errorId = incomeObject["data"] >> 0;
                        if ("getsettings" == rdata["c"] || "open" == rdata["c"] || "chopen" == rdata["c"] || "create" == rdata["c"]) {
                            nErrorLevel = c_oAscError.Level.Critical;
                        }
                        result = {
                            returnCode: nErrorLevel,
                            val: errorId
                        };
                        oThis.handlers.trigger("asc_onError", oThis.asc_mapAscServerErrorToAscError(errorId), nErrorLevel);
                        if (callback) {
                            callback(result);
                        }
                        break;
                    default:
                        if (callback) {
                            callback(incomeObject);
                        }
                        break;
                    }
                }
            },
            dataType: "text"
        });
    };
    spreadsheet_api.prototype._asc_sendTrack = function (callback, url, rdata) {
        asc_ajax({
            type: "POST",
            url: url,
            data: rdata,
            contentType: "application/json",
            error: function () {
                if (callback) {
                    callback({
                        returnCode: c_oAscError.Level.Critical,
                        val: c_oAscError.ID.Unknown
                    });
                }
            },
            success: function (msg) {
                if (!msg || msg.length < 1) {
                    if (callback) {
                        callback({
                            returnCode: c_oAscError.Level.Critical,
                            val: c_oAscError.ID.Unknown
                        });
                    }
                } else {
                    var incomeObject = JSON.parse(msg);
                    if (callback) {
                        callback(incomeObject);
                    }
                }
            },
            dataType: "text"
        });
    };
    spreadsheet_api.prototype._onOpenCommand = function (callback, data) {
        var t = this;
        g_fOpenFileCommand(data, this.documentUrlChanges, Asc.c_oSerFormat.Signature, function (error, result) {
            if (error || !result.bSerFormat) {
                var oError = {
                    returnCode: c_oAscError.Level.Critical,
                    val: c_oAscError.ID.Unknown
                };
                t.handlers.trigger("asc_onError", oError.val, oError.returnCode);
                if (callback) {
                    callback(oError);
                }
                return;
            }
            var wb = t.asc_OpenDocument(result.url, result.data);
            if (callback) {
                callback({
                    returnCode: 0,
                    val: wb
                });
            }
        });
    };
    spreadsheet_api.prototype._OfflineAppDocumentStartLoad = function (fCallback) {
        var t = this,
        src = this.FontLoader.fontFilesPath;
        src += window.g_offline_doc ? window.g_offline_doc : "../Excel/document/";
        var scriptElem = document.createElement("script");
        scriptElem.onload = scriptElem.onerror = function () {
            t._OfflineAppDocumentEndLoad(src, fCallback);
        };
        scriptElem.setAttribute("src", src + "editor.js");
        scriptElem.setAttribute("type", "text/javascript");
        document.getElementsByTagName("head")[0].appendChild(scriptElem);
    };
    spreadsheet_api.prototype._OfflineAppDocumentEndLoad = function (sUrlPath, fCallback) {
        var data = getTestWorkbook();
        var sData = data + "";
        if (Asc.c_oSerFormat.Signature === sData.substring(0, Asc.c_oSerFormat.Signature.length)) {
            var wb = this.asc_OpenDocument(sUrlPath, sData);
            fCallback({
                returnCode: 0,
                val: wb
            });
        }
    };
    spreadsheet_api.prototype._asc_open = function (fCallback) {
        if (this.chartEditor) {} else {
            if (!this.documentId || !this.documentUrl) {
                if (!this.documentId) {
                    this.documentId = "9876543210";
                }
                this._OfflineAppDocumentStartLoad(fCallback);
            } else {
                var v = {
                    "id": this.documentId,
                    "userid": this.documentUserId,
                    "format": this.documentFormat,
                    "vkey": this.documentVKey,
                    "editorid": c_oEditorId.Spreadsheet,
                    "url": this.documentUrl,
                    "title": this.documentTitle,
                    "embeddedfonts": this.isUseEmbeddedCutFonts,
                    "viewmode": this.asc_getViewerMode()
                };
                if (false && this.documentOpenOptions && this.documentOpenOptions["isEmpty"]) {
                    var sEmptyWorkbook = getEmptyWorkbook();
                    v["c"] = "create";
                    v["data"] = sEmptyWorkbook;
                    this._asc_sendCommand(fCallback, v);
                    var wb = this.asc_OpenDocument(g_sResourceServiceLocalUrl + this.documentId + "/", sEmptyWorkbook);
                    fCallback({
                        returnCode: 0,
                        val: wb
                    });
                } else {
                    this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Open;
                    v["c"] = "open";
                    this._asc_sendCommand(fCallback, v);
                }
            }
        }
    };
    spreadsheet_api.prototype._asc_save2 = function () {
        var oAdditionalData = {};
        oAdditionalData["c"] = "sfct";
        oAdditionalData["id"] = this.documentId;
        oAdditionalData["userid"] = this.documentUserId;
        oAdditionalData["vkey"] = this.documentVKey;
        oAdditionalData["outputformat"] = 4098;
        var data;
        this.wb._initCommentsToSave();
        var oBinaryFileWriter = new Asc.BinaryFileWriter(this.wbModel);
        oAdditionalData["savetype"] = "completeall";
        data = oBinaryFileWriter.Write();
        oAdditionalData["data"] = data;
        var t = this;
        this._asc_sendCommand(function (incomeObject) {
            if (null != incomeObject && "save" == incomeObject["type"]) {
                t.asc_processSavedFile(incomeObject["data"], false);
            }
        },
        oAdditionalData);
    };
    spreadsheet_api.prototype._asc_save = function () {
        var that = this;
        this.wb._initCommentsToSave();
        var oBinaryFileWriter = new Asc.BinaryFileWriter(this.wbModel);
        var data = oBinaryFileWriter.Write();
        var oAdditionalData = {};
        oAdditionalData["c"] = "save";
        oAdditionalData["id"] = this.documentId;
        oAdditionalData["userid"] = this.documentUserId;
        oAdditionalData["vkey"] = this.documentVKey;
        oAdditionalData["outputformat"] = this.documentFormatSave;
        if (c_oAscFileType.CSV == this.documentFormatSave) {
            oAdditionalData["codepage"] = this.documentFormatSaveCsvCodepage;
            oAdditionalData["delimiter"] = this.documentFormatSaveCsvDelimiter;
        }
        oAdditionalData["innersave"] = true;
        oAdditionalData["savetype"] = "completeall";
        oAdditionalData["data"] = data;
        this._asc_sendCommand(function (incomeObject) {
            if (null != incomeObject && "save" == incomeObject["type"]) {
                that.asc_processSavedFile(incomeObject["data"], true);
            }
        },
        oAdditionalData);
    };
    spreadsheet_api.prototype._asc_downloadAs = function (sFormat, fCallback, bStart, options, sSaveKey) {
        var oAdditionalData = {};
        oAdditionalData["c"] = "save";
        oAdditionalData["id"] = this.documentId;
        oAdditionalData["userid"] = this.documentUserId;
        oAdditionalData["vkey"] = this.documentVKey;
        oAdditionalData["outputformat"] = sFormat;
        if (null != sSaveKey) {
            oAdditionalData["savekey"] = sSaveKey;
        }
        var data;
        if (c_oAscFileType.PDFPRINT === sFormat) {
            if (null === this.printPagesData) {
                this.printPagesData = this.wb.calcPagesPrint(this.adjustPrint);
            }
            var pdf_writer = new CPdfPrinter(this.wbModel.sUrlPath);
            var isEndPrint = this.wb.printSheet(pdf_writer, this.printPagesData);
            data = pdf_writer.DocumentRenderer.Memory.GetBase64Memory();
            if (isEndPrint) {
                if (bStart) {
                    oAdditionalData["savetype"] = "completeall";
                } else {
                    oAdditionalData["savetype"] = "complete";
                }
                this.printPagesData = null;
            } else {
                if (bStart) {
                    oAdditionalData["savetype"] = "partstart";
                } else {
                    oAdditionalData["savetype"] = "part";
                }
            }
        } else {
            if (c_oAscFileType.CSV === sFormat && !options) {
                this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
                var v = {
                    "id": this.documentId,
                    "userid": this.documentUserId,
                    "vkey": this.documentVKey,
                    "c": "getcodepage"
                };
                return this._asc_sendCommand(fCallback, v);
            } else {
                this.wb._initCommentsToSave();
                var oBinaryFileWriter = new Asc.BinaryFileWriter(this.wbModel);
                oAdditionalData["savetype"] = "completeall";
                if (c_oAscFileType.CSV === sFormat) {
                    if (options instanceof asc.asc_CCSVAdvancedOptions) {
                        oAdditionalData["codepage"] = options.asc_getCodePage();
                        oAdditionalData["delimiter"] = options.asc_getDelimiter();
                    }
                }
                data = oBinaryFileWriter.Write();
                if (undefined != window["appBridge"]) {
                    window["appBridge"]["dummyCommandSave_CSV"](data);
                    return;
                }
            }
        }
        oAdditionalData["data"] = data;
        this._asc_sendCommand(fCallback, oAdditionalData);
    };
    spreadsheet_api.prototype.asc_getDocumentName = function () {
        return this.documentTitle;
    };
    spreadsheet_api.prototype.asc_getDocumentFormat = function () {
        return this.documentFormat;
    };
    spreadsheet_api.prototype.asc_isDocumentModified = function () {
        if (!this.canSave || this.asc_getCellEditMode()) {
            return true;
        } else {
            if (History && History.Is_Modified) {
                return History.Is_Modified();
            }
        }
        return false;
    };
    spreadsheet_api.prototype.asc_isDocumentCanSave = function () {
        return this.isDocumentCanSave;
    };
    spreadsheet_api.prototype.asc_getCanUndo = function () {
        return History.Can_Undo();
    };
    spreadsheet_api.prototype.asc_getCanRedo = function () {
        return History.Can_Redo();
    };
    spreadsheet_api.prototype.asc_StartAction = function (type, id) {
        this.handlers.trigger("asc_onStartAction", type, id);
    };
    spreadsheet_api.prototype.asc_EndAction = function (type, id) {
        this.handlers.trigger("asc_onEndAction", type, id);
    };
    spreadsheet_api.prototype.asc_registerCallback = function (name, callback, replaceOldCallback) {
        this.handlers.add(name, callback, replaceOldCallback);
        if (null !== this.guiFonts && "asc_onInitEditorFonts" === name) {
            this.handlers.trigger("asc_onInitEditorFonts", this.guiFonts);
            this.guiFonts = null;
        } else {
            if (null !== this.guiStyles && "asc_onInitEditorStyles" === name) {
                this.handlers.trigger("asc_onInitEditorStyles", this.guiStyles);
                this.guiStyles = null;
            } else {
                if (null !== this.tablePictures && "asc_onInitTablePictures" === name) {
                    this.handlers.trigger("asc_onInitTablePictures", this.tablePictures);
                    this.tablePictures = null;
                } else {
                    if (null !== this._gui_control_colors && "asc_onSendThemeColors" === name) {
                        this.handlers.trigger("asc_onSendThemeColors", this._gui_control_colors.Colors, this._gui_control_colors.StandartColors);
                        this._gui_control_colors = null;
                    } else {
                        if (null !== this._gui_color_schemes && "asc_onSendThemeColorSchemes" === name) {
                            this.handlers.trigger("asc_onSendThemeColorSchemes", this._gui_color_schemes);
                            this._gui_color_schemes = null;
                        } else {
                            if ("asc_onInitEditorShapes" === name) {
                                this.handlers.trigger("asc_onInitEditorShapes", g_oAutoShapesGroups, g_oAutoShapesTypes);
                            } else {
                                if ("asc_onInitStandartTextures" === name) {
                                    var _count = g_oUserTexturePresets.length;
                                    var arr = new Array(_count);
                                    for (var i = 0; i < _count; ++i) {
                                        arr[i] = new asc_CTexture();
                                        arr[i].Id = i;
                                        arr[i].Image = g_oUserTexturePresets[i];
                                        this.ImageLoader.LoadImage(g_oUserTexturePresets[i], 1);
                                    }
                                    this.handlers.trigger("asc_onInitStandartTextures", arr);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    spreadsheet_api.prototype.asc_unregisterCallback = function (name, callback) {
        this.handlers.remove(name, callback);
    };
    spreadsheet_api.prototype.asc_getController = function () {
        return this.controller;
    };
    spreadsheet_api.prototype.asc_SetDocumentPlaceChangedEnabled = function (val) {
        this.wb.setDocumentPlaceChangedEnabled(val);
    };
    spreadsheet_api.prototype.sheetsChanged = function () {
        this.handlers.trigger("asc_onSheetsChanged");
    };
    spreadsheet_api.prototype.sync_InitEditorFonts = function (gui_fonts) {
        if (false === this.handlers.trigger("asc_onInitEditorFonts", gui_fonts)) {
            this.guiFonts = gui_fonts;
        } else {
            this.guiFonts = null;
        }
    };
    spreadsheet_api.prototype.asyncFontsDocumentStartLoaded = function () {
        this.OpenDocumentProgress.Type = c_oAscAsyncAction.LoadDocumentFonts;
        this.OpenDocumentProgress.FontsCount = this.FontLoader.fonts_loading.length;
        this.OpenDocumentProgress.CurrentFont = 0;
        this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);
    };
    spreadsheet_api.prototype.asyncFontsDocumentEndLoaded = function () {
        this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);
        if (this.asyncMethodCallback !== undefined) {
            this.asyncMethodCallback();
            this.asyncMethodCallback = undefined;
            this.waitSave = false;
        } else {
            this.FontLoadWaitComplete = true;
            if (this.ServerIdWaitComplete) {
                this._openDocumentEndCallback();
            }
        }
    };
    spreadsheet_api.prototype.asyncFontStartLoaded = function () {
        this.asc_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    };
    spreadsheet_api.prototype.asyncFontEndLoaded = function (font) {
        this.asc_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    };
    spreadsheet_api.prototype.SendOpenProgress = function () {
        var _OpenDocumentProgress = {
            "Type": this.OpenDocumentProgress.Type,
            "FontsCount": this.OpenDocumentProgress.FontsCount,
            "CurrentFont": this.OpenDocumentProgress.CurrentFont,
            "ImagesCount": this.OpenDocumentProgress.ImagesCount,
            "CurrentImage": this.OpenDocumentProgress.CurrentImage
        };
        this.handlers.trigger("asc_onOpenDocumentProgress", _OpenDocumentProgress);
        if (undefined != window["appBridge"]) {
            var progress = (this.OpenDocumentProgress.CurrentFont + this.OpenDocumentProgress.CurrentImage) / (this.OpenDocumentProgress.ImagesCount + this.OpenDocumentProgress.FontsCount);
            window["appBridge"]["dummyCommandOpenDocumentProgress"](progress * 100);
        }
    };
    spreadsheet_api.prototype.IsNeedDefaultFonts = function () {
        return false;
    };
    spreadsheet_api.prototype._loadFonts = function (fonts, callback) {
        if (window["NATIVE_EDITOR_ENJINE"]) {
            return callback();
        }
        this.waitSave = true;
        this.asyncMethodCallback = callback;
        var arrLoadFonts = [];
        for (var i in fonts) {
            arrLoadFonts.push(new CFont(i, 0, "", 0));
        }
        History.loadFonts(arrLoadFonts);
        this.FontLoader.LoadDocumentFonts2(arrLoadFonts);
    };
    spreadsheet_api.prototype._startOpenDocument = function (response) {
        if (response.returnCode !== 0) {
            return;
        }
        this.wbModel = response.val;
        this.asyncServerIdStartLoaded();
        this.FontLoader.LoadDocumentFonts(this.wbModel.generateFontMap2());
        if (this.isMobileVersion) {
            window.USER_AGENT_SAFARI_MACOS = false;
            PASTE_ELEMENT_ID2 = "wrd_pastebin";
            ELEMENT_DISPAY_STYLE2 = "none";
        }
        if (window.USER_AGENT_SAFARI_MACOS) {
            setInterval(SafariIntervalFocus2, 10);
        }
    };
    spreadsheet_api.prototype._onGetEditorPermissions = function (response) {
        if (null != response && "getsettings" == response.type) {
            var oSettings = JSON.parse(response.data);
            window.g_cAscCoAuthoringUrl = oSettings["g_cAscCoAuthoringUrl"];
            window.g_cAscSpellCheckUrl = oSettings["g_cAscSpellCheckUrl"];
            var oEditorPermissions = new asc_CAscEditorPermissions(oSettings);
            this.handlers.trigger("asc_onGetEditorPermissions", oEditorPermissions);
            if (undefined != oSettings["trackingInfo"] && null != oSettings["trackingInfo"] && oEditorPermissions.asc_getCanEdit()) {
                this.TrackFile = new asc_CTrackFile(oSettings["trackingInfo"]);
                this.TrackFile.setDocId(this.DocInfo["Id"]);
                this.TrackFile.setUserId(this.DocInfo["UserId"]);
                var oThis = this;
                var _sendTrack = function (callback, url, data) {
                    return oThis._asc_sendTrack(callback, url, data);
                };
                this.TrackFile.setTrackFunc(_sendTrack);
                if (undefined != oSettings["TrackingInterval"] && null != oSettings["TrackingInterval"]) {
                    this.TrackFile.setInterval(oSettings["TrackingInterval"]);
                }
                this.TrackFile.Start();
            }
        }
    };
    spreadsheet_api.prototype._onGetLicense = function (response) {
        if (null != response && "getlicense" == response.type) {
            var oSettings = JSON.parse(response.data);
            var oLicense = (null != oSettings) ? new asc_CAscLicense(oSettings) : null;
            this.handlers.trigger("asc_onGetLicense", oLicense);
        }
    };
    spreadsheet_api.prototype.asyncServerIdStartLoaded = function () {
        this._coAuthoringInit();
    };
    spreadsheet_api.prototype.asyncServerIdEndLoaded = function () {
        this.ServerIdWaitComplete = true;
        if (this.FontLoadWaitComplete) {
            this._openDocumentEndCallback();
        }
    };
    spreadsheet_api.prototype.syncCollaborativeChanges = function () {
        this.handlers.trigger("asc_onCollaborativeChanges");
    };
    spreadsheet_api.prototype._applyFirstLoadChanges = function () {
        if (this.IsSendDocumentLoadCompleate) {
            return;
        }
        if (this.collaborativeEditing.applyChanges()) {
            this.IsSendDocumentLoadCompleate = true;
            this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        }
    };
    spreadsheet_api.prototype._coAuthoringInit = function () {
        var t = this;
        if (undefined !== window["g_cAscCoAuthoringUrl"]) {
            window.g_cAscCoAuthoringUrl = window["g_cAscCoAuthoringUrl"];
        }
        if (undefined !== window.g_cAscCoAuthoringUrl) {
            if (!t.isCoAuthoringEnable) {
                window.g_cAscCoAuthoringUrl = "";
            }
            t._coAuthoringSetServerUrl(window.g_cAscCoAuthoringUrl);
        }
        if (null == t.User || null == t.User.asc_getId()) {
            t.User = new asc.asc_CUser();
            t.User.asc_setId("Unknown");
            t.User.asc_setUserName("Unknown");
            t._coAuthoringSetServerUrl("");
        }
        this.collaborativeEditing = new asc_CCollaborativeEditing({
            "askLock": function () {
                t.CoAuthoringApi.askLock.apply(t.CoAuthoringApi, arguments);
            },
            "releaseLocks": function () {
                t.CoAuthoringApi.releaseLocks.apply(t.CoAuthoringApi, arguments);
            },
            "sendChanges": function () {
                t._onSaveChanges.apply(t, arguments);
            },
            "applyChanges": function () {
                t._onApplyChanges.apply(t, arguments);
            },
            "updateAfterApplyChanges": function () {
                t._onUpdateAfterApplyChanges.apply(t, arguments);
            },
            "drawSelection": function () {
                t._onDrawSelection.apply(t, arguments);
            },
            "drawFrozenPaneLines": function () {
                t._onDrawFrozenPaneLines.apply(t, arguments);
            },
            "updateAllSheetsLock": function () {
                t._onUpdateAllSheetsLock.apply(t, arguments);
            },
            "showDrawingObjects": function () {
                t._onShowDrawingObjects.apply(t, arguments);
            },
            "showComments": function () {
                t._onShowComments.apply(t, arguments);
            },
            "cleanSelection": function () {
                t._onCleanSelection.apply(t, arguments);
            },
            "updateDocumentCanSave": function () {
                t._onUpdateDocumentCanSave();
            },
            "checkCommentRemoveLock": function (lockElem) {
                return t._onCheckCommentRemoveLock(lockElem);
            }
        },
        this.asc_getViewerMode());
        if (!this.CoAuthoringApi) {
            this.asyncServerIdEndLoaded();
            return;
        }
        this.CoAuthoringApi.onParticipantsChanged = function (e, count) {
            t.handlers.trigger("asc_onParticipantsChanged", e, count);
        };
        this.CoAuthoringApi.onAuthParticipantsChanged = function (e, count) {
            t.handlers.trigger("asc_onAuthParticipantsChanged", e, count);
        };
        this.CoAuthoringApi.onMessage = function (e, clear) {
            t.handlers.trigger("asc_onCoAuthoringChatReceiveMessage", e, clear);
        };
        this.CoAuthoringApi.onConnectionStateChanged = function (e) {
            t.handlers.trigger("asc_onConnectionStateChanged", e);
        };
        this.CoAuthoringApi.onLocksAcquired = function (e) {
            if (2 != e["state"]) {
                var elementValue = e["blockValue"];
                var lockElem = t.collaborativeEditing.getLockByElem(elementValue, c_oAscLockTypes.kLockTypeOther);
                if (null === lockElem) {
                    lockElem = new asc.CLock(elementValue);
                    t.collaborativeEditing.addUnlock(lockElem);
                }
                var drawing, lockType = lockElem.Element["type"];
                var oldType = lockElem.getType();
                if (c_oAscLockTypes.kLockTypeOther2 === oldType || c_oAscLockTypes.kLockTypeOther3 === oldType) {
                    lockElem.setType(c_oAscLockTypes.kLockTypeOther3, true);
                } else {
                    lockElem.setType(c_oAscLockTypes.kLockTypeOther, true);
                }
                lockElem.setUserId(e["user"]);
                if (lockType === c_oAscLockTypeElem.Object) {
                    drawing = g_oTableId.Get_ById(lockElem.Element["rangeOrObjectId"]);
                    if (drawing) {
                        drawing.lockType = lockElem.Type;
                    }
                }
                if (t.wb) {
                    t.wb._onWSSelectionChanged(null);
                    t._onUpdateSheetsLock(lockElem);
                    var ws = t.wb.getWorksheet();
                    var lockSheetId = lockElem.Element["sheetId"];
                    if (lockSheetId === ws.model.getId()) {
                        if (lockType === c_oAscLockTypeElem.Object) {
                            if (t._onUpdateFrozenPane(lockElem)) {
                                ws.draw();
                            } else {
                                if (drawing && ws.model === drawing.worksheet) {
                                    if (ws.objectRender) {
                                        ws.objectRender.showDrawingObjects(true);
                                    }
                                }
                            }
                        } else {
                            if (lockType === c_oAscLockTypeElem.Range) {
                                ws.updateSelection();
                            }
                        }
                    } else {
                        if (-1 !== lockSheetId && 0 === lockSheetId.indexOf(CCellCommentator.sStartCommentId)) {
                            t.handlers.trigger("asc_onLockComment", lockElem.Element["rangeOrObjectId"], e["user"]);
                        }
                    }
                }
            }
        };
        this.CoAuthoringApi.onLocksReleased = function (e, bChanges) {
            var element = e["block"];
            var lockElem = t.collaborativeEditing.getLockByElem(element, c_oAscLockTypes.kLockTypeOther);
            if (null != lockElem) {
                var curType = lockElem.getType();
                var newType = c_oAscLockTypes.kLockTypeNone;
                if (curType === c_oAscLockTypes.kLockTypeOther) {
                    if (true != bChanges) {
                        newType = c_oAscLockTypes.kLockTypeNone;
                    } else {
                        newType = c_oAscLockTypes.kLockTypeOther2;
                    }
                } else {
                    if (curType === c_oAscLockTypes.kLockTypeMine) {
                        newType = c_oAscLockTypes.kLockTypeMine;
                    } else {
                        if (curType === c_oAscLockTypes.kLockTypeOther2 || curType === c_oAscLockTypes.kLockTypeOther3) {
                            newType = c_oAscLockTypes.kLockTypeOther2;
                        }
                    }
                }
                if (t.wb) {
                    t.wb.getWorksheet().cleanSelection();
                }
                var drawing;
                if (c_oAscLockTypes.kLockTypeNone !== newType) {
                    lockElem.setType(newType, true);
                } else {
                    t.collaborativeEditing.removeUnlock(lockElem);
                    if (!t._onCheckCommentRemoveLock(lockElem.Element)) {
                        if (lockElem.Element["type"] === c_oAscLockTypeElem.Object) {
                            drawing = g_oTableId.Get_ById(lockElem.Element["rangeOrObjectId"]);
                            if (drawing) {
                                drawing.lockType = c_oAscLockTypes.kLockTypeNone;
                            }
                        }
                    }
                }
                if (t.wb) {
                    t._onUpdateSheetsLock(lockElem);
                }
            }
        };
        this.CoAuthoringApi.onLocksReleasedEnd = function () {
            if (t.wb) {
                t.wb._onWSSelectionChanged(null);
                var worksheet = t.wb.getWorksheet();
                worksheet._drawSelection();
                worksheet._drawFrozenPaneLines();
                if (worksheet.objectRender) {
                    worksheet.objectRender.showDrawingObjects(true);
                }
            }
        };
        this.CoAuthoringApi.onSaveChanges = function (e, userId, bFirstLoad) {
            t.collaborativeEditing.addChanges(e);
            if (!bFirstLoad && t.IsSendDocumentLoadCompleate) {
                t.syncCollaborativeChanges();
            }
        };
        this.CoAuthoringApi.onRecalcLocks = function (excelAdditionalInfo) {
            if (!excelAdditionalInfo) {
                return;
            }
            var tmpAdditionalInfo = JSON.parse(excelAdditionalInfo);
            var oRecalcIndexColumns = t.collaborativeEditing.addRecalcIndex("0", tmpAdditionalInfo["indexCols"]);
            var oRecalcIndexRows = t.collaborativeEditing.addRecalcIndex("1", tmpAdditionalInfo["indexRows"]);
            if (null !== oRecalcIndexColumns || null !== oRecalcIndexRows) {
                t.collaborativeEditing._recalcLockArray(c_oAscLockTypes.kLockTypeMine, oRecalcIndexColumns, oRecalcIndexRows);
                t.collaborativeEditing._recalcLockArray(c_oAscLockTypes.kLockTypeOther, oRecalcIndexColumns, oRecalcIndexRows);
            }
        };
        this.CoAuthoringApi.onFirstLoadChangesEnd = function () {
            t.asyncServerIdEndLoaded();
        };
        this.CoAuthoringApi.onSetIndexUser = function (e) {
            g_oIdCounter.Set_UserId("" + e);
        };
        this.CoAuthoringApi.onStartCoAuthoring = function (isStartEvent) {
            t.startCollaborationEditing();
            if (!isStartEvent) {
                if (!t.IsSendDocumentLoadCompleate) {
                    t.CoAuthoringApi.unLockDocument(false);
                } else {
                    t.collaborativeEditing.applyChanges();
                    t.collaborativeEditing.sendChanges();
                }
            }
        };
        this.CoAuthoringApi.onEndCoAuthoring = function (isStartEvent) {
            t.endCollaborationEditing();
        };
        this.CoAuthoringApi.onDisconnect = function (e, isDisconnectAtAll, isCloseCoAuthoring) {
            if (0 === t.CoAuthoringApi.get_state()) {
                t.asyncServerIdEndLoaded();
            }
            if (isDisconnectAtAll) {
                t.handlers.trigger("asc_onСoAuthoringDisconnect");
                t.asc_setViewerMode(true);
                t.handlers.trigger("asc_onError", isCloseCoAuthoring ? c_oAscError.ID.UserDrop : c_oAscError.ID.CoAuthoringDisconnect, c_oAscError.Level.NoCritical);
            }
        };
        this.CoAuthoringApi.init(t.User, t.documentId, t.documentCallbackUrl, "fghhfgsjdgfjs", function () {},
        c_oEditorId.Spreadsheet, t.documentFormatSave, t.asc_getViewerMode());
    };
    spreadsheet_api.prototype._coAuthoringSetServerUrl = function (url) {
        if (!this.CoAuthoringApi) {
            return;
        }
        this.CoAuthoringApi.set_url(url);
    };
    spreadsheet_api.prototype._onSaveChanges = function (recalcIndexColumns, recalcIndexRows) {
        if (this.IsSendDocumentLoadCompleate) {
            var arrChanges = this.wbModel.SerializeHistory();
            var deleteIndex = History.Get_DeleteIndex();
            var excelAdditionalInfo = null;
            if (this.collaborativeEditing.getCollaborativeEditing()) {
                if (recalcIndexColumns || recalcIndexRows) {
                    excelAdditionalInfo = {
                        "indexCols": recalcIndexColumns,
                        "indexRows": recalcIndexRows
                    };
                }
            }
            if (0 < arrChanges.length || null !== deleteIndex || null !== excelAdditionalInfo) {
                this.CoAuthoringApi.saveChanges(arrChanges, deleteIndex, excelAdditionalInfo);
            } else {
                this.CoAuthoringApi.unLockDocument(true);
            }
        }
    };
    spreadsheet_api.prototype._onApplyChanges = function (changes, fCallback) {
        this.wbModel.DeserializeHistory(changes, fCallback);
    };
    spreadsheet_api.prototype._onUpdateAfterApplyChanges = function () {
        if (!this.IsSendDocumentLoadCompleate) {
            this.collaborativeEditing.clearRecalcIndex();
            this.IsSendDocumentLoadCompleate = true;
            this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        } else {
            if (this.wb && !window["NATIVE_EDITOR_ENJINE"]) {
                this.wb._onWSSelectionChanged(null);
                this.wb.getWorksheet().updateVisibleRange();
            }
        }
    };
    spreadsheet_api.prototype._onCleanSelection = function () {
        if (this.wb) {
            this.wb.getWorksheet().cleanSelection();
        }
    };
    spreadsheet_api.prototype._onDrawSelection = function () {
        if (this.wb) {
            this.wb.getWorksheet()._drawSelection();
        }
    };
    spreadsheet_api.prototype._onDrawFrozenPaneLines = function () {
        if (this.wb) {
            this.wb.getWorksheet()._drawFrozenPaneLines();
        }
    };
    spreadsheet_api.prototype._onUpdateAllSheetsLock = function () {
        var t = this;
        if (t.wbModel) {
            t.handlers.trigger("asc_onWorkbookLocked", t.asc_isWorkbookLocked());
            var i, length, wsModel, wsIndex;
            for (i = 0, length = t.wbModel.getWorksheetCount(); i < length; ++i) {
                wsModel = t.wbModel.getWorksheet(i);
                wsIndex = wsModel.getIndex();
                t.handlers.trigger("asc_onWorksheetLocked", wsIndex, t.asc_isWorksheetLockedOrDeleted(wsIndex));
            }
        }
    };
    spreadsheet_api.prototype._onShowDrawingObjects = function () {
        if (this.wb) {
            var ws = this.wb.getWorksheet();
            if (ws && ws.objectRender) {
                ws.objectRender.showDrawingObjects(true);
            }
        }
    };
    spreadsheet_api.prototype._onShowComments = function () {
        if (this.wb) {
            this.wb.getWorksheet().cellCommentator.drawCommentCells();
        }
    };
    spreadsheet_api.prototype._onUpdateSheetsLock = function (lockElem) {
        var t = this;
        if (c_oAscLockTypeElem.Sheet === lockElem.Element["type"]) {
            t.handlers.trigger("asc_onWorkbookLocked", t.asc_isWorkbookLocked());
        }
        var wsModel = t.wbModel.getWorksheetById(lockElem.Element["sheetId"]);
        if (wsModel) {
            var wsIndex = wsModel.getIndex();
            t.handlers.trigger("asc_onWorksheetLocked", wsIndex, t.asc_isWorksheetLockedOrDeleted(wsIndex));
        }
    };
    spreadsheet_api.prototype._onUpdateFrozenPane = function (lockElem) {
        return (c_oAscLockTypeElem.Object === lockElem.Element["type"] && lockElem.Element["rangeOrObjectId"] === c_oAscLockNameFrozenPane);
    };
    spreadsheet_api.prototype._sendWorkbookStyles = function () {
        if (this.wbModel) {
            if (window["NATIVE_EDITOR_ENJINE"] && (!this.handlers.hasTrigger("asc_onInitTablePictures") || !this.handlers.hasTrigger("asc_onInitEditorStyles"))) {
                return;
            }
            var tablePictures = this.wb.getTablePictures();
            var bResult = this.handlers.trigger("asc_onInitTablePictures", tablePictures);
            this.tablePictures = (false === bResult) ? tablePictures : null;
            var guiStyles = this.wb.getCellStyles();
            bResult = this.handlers.trigger("asc_onInitEditorStyles", guiStyles);
            this.guiStyles = (false === bResult) ? guiStyles : null;
        }
    };
    spreadsheet_api.prototype.startCollaborationEditing = function () {
        this.collaborativeEditing.startCollaborationEditing();
    };
    spreadsheet_api.prototype.endCollaborationEditing = function () {
        this.collaborativeEditing.endCollaborationEditing();
    };
    spreadsheet_api.prototype.setUserAlive = function () {
        if (this.TrackFile) {
            this.TrackFile.setUserAlive();
        }
    };
    spreadsheet_api.prototype._openDocumentEndCallback = function () {
        if (this.DocumentLoadComplete) {
            return;
        }
        this.wb = new asc.WorkbookView(this.wbModel, this.controller, this.handlers, this.HtmlElement, this.topLineEditorElement, this, this.collaborativeEditing, this.fontRenderingMode);
        this.DocumentLoadComplete = true;
        this.asc_CheckGuiControlColors();
        this.asc_SendThemeColorScheme();
        this.asc_ApplyColorScheme(false);
        this._applyFirstLoadChanges();
        this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
        if (this.wbModel.startActionOn == false) {
            this.wbModel.startActionOn = true;
        } else {
            var t = this;
            setTimeout(function () {
                t.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
            },
            500);
        }
        if (undefined != window["appBridge"]) {
            window["appBridge"]["dummyCommandOpenDocumentProgress"](10000);
        }
    };
    spreadsheet_api.prototype._asc_setWorksheetRange = function (val) {
        var ws = this.wbModel.getWorksheetByName(val.asc_getSheet());
        if (!ws || ws.getHidden()) {
            return;
        }
        var sheetIndex = ws.getIndex();
        if (this.asc_getActiveWorksheetIndex() !== sheetIndex) {
            this.asc_showWorksheet(sheetIndex);
            this.handlers.trigger("asc_onActiveSheetChanged", sheetIndex);
        }
        var range = ws.getRange2(val.asc_getRange());
        if (null !== range) {
            this.wb._onSetSelection(range.getBBox0(), true);
        }
    };
    spreadsheet_api.prototype.onSaveCallback = function (e) {
        var t = this;
        var nState;
        if (false == e["saveLock"]) {
            if (this.waitSave) {
                this.CoAuthoringApi.onUnSaveLock = function () {
                    t.canSave = true;
                    t.isAutoSave = false;
                    t.lastSaveTime = null;
                };
                this.CoAuthoringApi.unSaveLock();
                return;
            }
            if (this.isAutoSave) {
                this.asc_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
            }
            this.collaborativeEditing.applyChanges();
            History.Save();
            this.CoAuthoringApi.onUnSaveLock = function () {
                t.CoAuthoringApi.onUnSaveLock = null;
                if (t.collaborativeEditing.getCollaborativeEditing()) {
                    t.wb._onWSSelectionChanged(null);
                }
                t.canSave = true;
                t.isAutoSave = false;
                t.lastSaveTime = null;
                t.asc_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
                t.onUpdateDocumentModified(false);
                if (undefined !== window["AscDesktopEditor"]) {
                    window["AscDesktopEditor"]["OnSave"]();
                }
            };
            this.collaborativeEditing.sendChanges();
        } else {
            nState = t.CoAuthoringApi.get_state();
            if (3 === nState) {
                if (!this.isAutoSave) {
                    this.asc_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
                }
                this.isAutoSave = false;
                this.canSave = true;
            } else {
                if (this.isAutoSave) {
                    this.isAutoSave = false;
                    this.canSave = true;
                    return;
                }
                setTimeout(function () {
                    t.CoAuthoringApi.askSaveChanges(function (event) {
                        t.onSaveCallback(event);
                    });
                },
                1000);
            }
        }
    };
    spreadsheet_api.prototype._getIsLockObjectSheet = function (lockInfo, callback) {
        asc_applyFunction(callback, true);
    };
    spreadsheet_api.prototype._isLockedTabColor = function (index, callback) {
        asc_applyFunction(callback, true);
    };
    spreadsheet_api.prototype._getIsLockObjectSheet = function (lockInfo, callback) {
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            asc_applyFunction(callback, true);
            return;
        }
        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            asc_applyFunction(callback, true);
            callback = undefined;
        }
        if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, false)) {
            asc_applyFunction(callback, true);
            return;
        } else {
            if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                asc_applyFunction(callback, false);
                return;
            }
        }
        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock(lockInfo);
        this.collaborativeEditing.onEndCheckLock(callback);
    };
    spreadsheet_api.prototype._isLockedTabColor = function (index, callback) {
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            asc_applyFunction(callback, true);
            return;
        }
        var sheetId = this.wbModel.getWorksheet(index).getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, c_oAscLockNameTabColor);
        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            asc_applyFunction(callback, true);
            callback = undefined;
        }
        if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, false)) {
            asc_applyFunction(callback, true);
            return;
        } else {
            if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                asc_applyFunction(callback, false);
                return;
            }
        }
        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock(lockInfo);
        this.collaborativeEditing.onEndCheckLock(callback);
    };
    spreadsheet_api.prototype._addWorksheet = function (name, i) {
        this.wbModel.createWorksheet(i, name);
        this.wb.spliceWorksheet(i, 0, null);
        this.asc_showWorksheet(i);
        this.sheetsChanged();
    };
    spreadsheet_api.prototype.asc_getWorksheetsCount = function () {
        return this.wbModel.getWorksheetCount();
    };
    spreadsheet_api.prototype.asc_getWorksheetName = function (index) {
        return this.wbModel.getWorksheet(index).getName();
    };
    spreadsheet_api.prototype.asc_getWorksheetTabColor = function (index) {
        return this.wbModel.getWorksheet(index).getTabColor();
    };
    spreadsheet_api.prototype.asc_setWorksheetTabColor = function (index, color) {
        var t = this;
        var changeTabColorCallback = function (res) {
            if (res) {
                color = CorrectAscColor(color);
                t.wbModel.getWorksheet(index).setTabColor(color);
            }
        };
        this._isLockedTabColor(index, changeTabColorCallback);
    };
    spreadsheet_api.prototype.asc_getActiveWorksheetIndex = function () {
        return this.wbModel.getActive();
    };
    spreadsheet_api.prototype.asc_getActiveWorksheetId = function () {
        var activeIndex = this.wbModel.getActive();
        return this.wbModel.getWorksheet(activeIndex).getId();
    };
    spreadsheet_api.prototype.asc_getWorksheetId = function (index) {
        return this.wbModel.getWorksheet(index).getId();
    };
    spreadsheet_api.prototype.asc_isWorksheetHidden = function (index) {
        return this.wbModel.getWorksheet(index).getHidden();
    };
    spreadsheet_api.prototype.asc_isWorksheetLockedOrDeleted = function (index) {
        var ws = this.wbModel.getWorksheet(index);
        var sheetId = null;
        if (null === ws || undefined === ws) {
            sheetId = this.asc_getActiveWorksheetId();
        } else {
            sheetId = ws.getId();
        }
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            return false;
        }
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, sheetId, sheetId);
        return (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false));
    };
    spreadsheet_api.prototype.asc_isWorkbookLocked = function () {
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            return false;
        }
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, null, null);
        return (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false));
    };
    spreadsheet_api.prototype.asc_getHiddenWorksheets = function () {
        var model = this.wbModel;
        var len = model.getWorksheetCount();
        var i, ws, res = [];
        for (i = 0; i < len; ++i) {
            ws = model.getWorksheet(i);
            if (ws.getHidden()) {
                res.push({
                    "index": i,
                    "name": ws.getName()
                });
            }
        }
        return res;
    };
    spreadsheet_api.prototype.asc_showWorksheet = function (index) {
        if (typeof index === "number" && undefined !== index && null !== index) {
            var t = this;
            var ws = this.wbModel.getWorksheet(index);
            var isHidden = ws.getHidden();
            var showWorksheetCallback = function (res) {
                if (res) {
                    t.wbModel.getWorksheet(index).setHidden(false);
                    t.wb.showWorksheet(index);
                    if (isHidden) {
                        t.sheetsChanged();
                    }
                }
            };
            if (isHidden) {
                var sheetId = this.wbModel.getWorksheet(index).getId();
                var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, sheetId, sheetId);
                this._getIsLockObjectSheet(lockInfo, showWorksheetCallback);
            } else {
                showWorksheetCallback(true);
            }
        }
    };
    spreadsheet_api.prototype.asc_showActiveWorksheet = function () {
        this.wb.showWorksheet(this.wbModel.getActive());
    };
    spreadsheet_api.prototype.asc_hideWorksheet = function () {
        var t = this;
        var countWorksheets = this.asc_getWorksheetsCount();
        var arrHideWorksheets = this.asc_getHiddenWorksheets();
        var countHideWorksheets = arrHideWorksheets.length;
        if (countWorksheets <= countHideWorksheets + 1) {
            return false;
        }
        var model = this.wbModel;
        var activeWorksheet = model.getActive();
        var sheetId = this.wbModel.getWorksheet(activeWorksheet).getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, sheetId, sheetId);
        var hideWorksheetCallback = function (res) {
            if (res) {
                t.wbModel.getWorksheet(activeWorksheet).setHidden(true);
            }
        };
        this._getIsLockObjectSheet(lockInfo, hideWorksheetCallback);
        return true;
    };
    spreadsheet_api.prototype.asc_renameWorksheet = function (name) {
        if (this.collaborativeEditing.getGlobalLock()) {
            return false;
        }
        var i = this.wbModel.getActive();
        var sheetId = this.wbModel.getWorksheet(i).getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, sheetId, sheetId);
        var t = this;
        var renameCallback = function (res) {
            if (res) {
                t.wbModel.getWorksheet(i).setName(name);
            }
        };
        this._getIsLockObjectSheet(lockInfo, renameCallback);
        return true;
    };
    spreadsheet_api.prototype.asc_addWorksheet = function (name) {
        var i = this.wbModel.getActive();
        this._addWorksheet(name, i + 1);
    };
    spreadsheet_api.prototype.asc_insertWorksheet = function (name) {
        var i = this.wbModel.getActive();
        this._addWorksheet(name, i);
    };
    spreadsheet_api.prototype.asc_deleteWorksheet = function () {
        if (this.collaborativeEditing.getGlobalLock()) {
            return false;
        }
        var i = this.wbModel.getActive();
        var activeSheet = this.wbModel.getWorksheet(i);
        var activeName = activeSheet.sName;
        var sheetId = activeSheet.getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, sheetId, sheetId);
        var t = this;
        var deleteCallback = function (res) {
            if (res) {
                History.Create_NewPoint();
                History.StartTransaction();
                for (var key in t.wb.model.aWorksheets) {
                    var wsModel = t.wb.model.aWorksheets[key];
                    if (wsModel) {
                        var history_is_on = History.Is_On();
                        if (history_is_on) {
                            History.TurnOff();
                        }
                        var ws = t.wb.getWorksheet(wsModel.index);
                        if (history_is_on) {
                            History.TurnOn();
                        }
                        wsModel.oDrawingOjectsManager.updateChartReferencesWidthHistory(parserHelp.getEscapeSheetName(activeName), parserHelp.getEscapeSheetName(wsModel.sName));
                        if (ws && ws.objectRender && ws.objectRender.controller) {
                            ws.objectRender.controller.recalculate2(true);
                        }
                    }
                }
                var activeNow = t.wbModel.removeWorksheet(i);
                if (-1 !== activeNow) {
                    t.wb.removeWorksheet(i);
                    t.asc_showWorksheet(activeNow);
                    t.sheetsChanged();
                }
                History.EndTransaction();
            }
        };
        this._getIsLockObjectSheet(lockInfo, deleteCallback);
        return true;
    };
    spreadsheet_api.prototype.asc_moveWorksheet = function (where) {
        var i = this.wbModel.getActive();
        var d = i < where ? +1 : -1;
        if (1 === d) {
            where -= 1;
        }
        this.wb.replaceWorksheet(i, where);
        this.wbModel.replaceWorksheet(i, where);
        this.asc_showWorksheet(where);
        this.sheetsChanged();
    };
    spreadsheet_api.prototype.asc_copyWorksheet = function (where, newName) {
        var scale = this.asc_getZoom();
        var i = this.wbModel.getActive();
        var sheetId = this.wbModel.getWorksheet(i).getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, null, sheetId, sheetId);
        var t = this;
        var copyWorksheet = function (res) {
            if (res) {
                t.wb._initCommentsToSave();
                t.wbModel.copyWorksheet(i, where, newName);
                t.wb.copyWorksheet(i, where);
                t.asc_showWorksheet(where);
                t.asc_setZoom(scale);
                t.sheetsChanged();
            }
        };
        this._getIsLockObjectSheet(lockInfo, copyWorksheet);
    };
    spreadsheet_api.prototype.asc_cleanSelection = function () {
        this.wb.getWorksheet().cleanSelection();
    };
    spreadsheet_api.prototype.asc_getZoom = function () {
        return this.wb.getZoom();
    };
    spreadsheet_api.prototype.asc_setZoom = function (scale) {
        this.wb.changeZoom(scale);
    };
    spreadsheet_api.prototype.asc_enableKeyEvents = function (isEnabled) {
        if (this.wb) {
            this.wb.enableKeyEventsHandler(isEnabled);
        }
        this.IsFocus = isEnabled;
    };
    spreadsheet_api.prototype.asc_searchEnabled = function (bIsEnabled) {};
    spreadsheet_api.prototype.asc_findText = function (options) {
        var d = this.wb.findCellText(options);
        if (d) {
            if (d.deltaX) {
                this.controller.scrollHorizontal(d.deltaX);
            }
            if (d.deltaY) {
                this.controller.scrollVertical(d.deltaY);
            }
        }
        return !! d;
    };
    spreadsheet_api.prototype.asc_replaceText = function (options) {
        options.lookIn = c_oAscFindLookIn.Formulas;
        this.wb.replaceCellText(options);
    };
    spreadsheet_api.prototype.asc_endFindText = function () {
        this.wb._cleanFindResults();
    };
    spreadsheet_api.prototype.asc_findCell = function (reference) {
        var d = this.wb.findCell(reference);
        if (d) {
            if (d.deltaX) {
                this.controller.scrollHorizontal(d.deltaX);
            }
            if (d.deltaY) {
                this.controller.scrollVertical(d.deltaY);
            }
        }
    };
    spreadsheet_api.prototype.asc_closeCellEditor = function () {
        this.wb.closeCellEditor();
    };
    spreadsheet_api.prototype.asc_getColumnWidth = function () {
        var ws = this.wb.getWorksheet();
        return ws.getColumnWidthInSymbols(ws.getSelectedColumnIndex());
    };
    spreadsheet_api.prototype.asc_setColumnWidth = function (width) {
        this.wb.getWorksheet().changeWorksheet("colWidth", width);
    };
    spreadsheet_api.prototype.asc_insertColumnsBefore = function (count) {
        this.wb.getWorksheet().changeWorksheet("insColBefore", count);
    };
    spreadsheet_api.prototype.asc_insertColumnsAfter = function (count) {
        this.wb.getWorksheet().changeWorksheet("insColAfter", count);
    };
    spreadsheet_api.prototype.asc_deleteColumns = function () {
        this.wb.getWorksheet().changeWorksheet("delCol");
    };
    spreadsheet_api.prototype.asc_showColumns = function () {
        this.wb.getWorksheet().changeWorksheet("showCols");
    };
    spreadsheet_api.prototype.asc_hideColumns = function () {
        this.wb.getWorksheet().changeWorksheet("hideCols");
    };
    spreadsheet_api.prototype.asc_getRowHeight = function () {
        var ws = this.wb.getWorksheet();
        return ws.getRowHeight(ws.getSelectedRowIndex(), 1, true);
    };
    spreadsheet_api.prototype.asc_setRowHeight = function (height) {
        this.wb.getWorksheet().changeWorksheet("rowHeight", height);
    };
    spreadsheet_api.prototype.asc_insertRowsBefore = function (count) {
        this.wb.getWorksheet().changeWorksheet("insRowBefore", count);
    };
    spreadsheet_api.prototype.asc_insertRowsAfter = function (count) {
        this.wb.getWorksheet().changeWorksheet("insRowAfter", count);
    };
    spreadsheet_api.prototype.asc_deleteRows = function () {
        this.wb.getWorksheet().changeWorksheet("delRow");
    };
    spreadsheet_api.prototype.asc_showRows = function () {
        this.wb.getWorksheet().changeWorksheet("showRows");
    };
    spreadsheet_api.prototype.asc_hideRows = function () {
        this.wb.getWorksheet().changeWorksheet("hideRows");
    };
    spreadsheet_api.prototype.asc_insertCells = function (options) {
        this.wb.getWorksheet().changeWorksheet("insCell", options);
    };
    spreadsheet_api.prototype.asc_deleteCells = function (options) {
        this.wb.getWorksheet().changeWorksheet("delCell", options);
    };
    spreadsheet_api.prototype.asc_mergeCells = function (options) {
        this.wb.getWorksheet().setSelectionInfo("merge", options);
    };
    spreadsheet_api.prototype.asc_sortCells = function (options) {
        this.wb.getWorksheet().setSelectionInfo("sort", options);
    };
    spreadsheet_api.prototype.asc_emptyCells = function (options) {
        this.wb.emptyCells(options);
    };
    spreadsheet_api.prototype.asc_drawDepCells = function (se) {};
    spreadsheet_api.prototype.asc_mergeCellsDataLost = function (options) {
        return this.wb.getWorksheet().getSelectionMergeInfo(options);
    };
    spreadsheet_api.prototype.asc_getSheetViewSettings = function () {
        return this.wb.getWorksheet().getSheetViewSettings();
    };
    spreadsheet_api.prototype.asc_setSheetViewSettings = function (options) {
        this.wb.getWorksheet().changeWorksheet("sheetViewSettings", options);
    };
    spreadsheet_api.prototype.asc_setChartTranslate = function (translate) {
        this.chartTranslate = translate;
    };
    spreadsheet_api.prototype.asc_drawingObjectsExist = function () {
        for (var i = 0; i < this.wb.model.aWorksheets.length; i++) {
            if (this.wb.model.aWorksheets[i].Drawings && this.wb.model.aWorksheets[i].Drawings.length) {
                return true;
            }
        }
        return false;
    };
    spreadsheet_api.prototype.asc_getChartObject = function () {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.getAscChartObject();
    };
    spreadsheet_api.prototype.asc_addChartDrawingObject = function (chart) {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.addChartDrawingObject(chart);
    };
    spreadsheet_api.prototype.asc_editChartDrawingObject = function (chart) {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.editChartDrawingObject(chart);
    };
    spreadsheet_api.prototype.asc_addImageDrawingObject = function (imageUrl) {
        var rData = {
            "id": this.documentId,
            "userid": this.documentUserId,
            "vkey": this.documentVKey,
            "c": "imgurl",
            "data": imageUrl
        };
        var oThis = this;
        this.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        this._asc_sendCommand(function (incomeObject) {
            if (null != incomeObject && "imgurl" == incomeObject["type"]) {
                var ws = oThis.wb.getWorksheet();
                return ws.objectRender.addImageDrawingObject(incomeObject["data"], null);
            }
            oThis.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        },
        rData);
    };
    spreadsheet_api.prototype.asc_showImageFileDialog = function () {
        if (undefined != window["appBridge"]) {
            window["appBridge"]["dummyCommandAddImage"]();
            return;
        }
        var ws = this.wb.getWorksheet();
        ws.objectRender.showImageFileDialog(this.documentId, this.documentFormat);
    };
    spreadsheet_api.prototype.asc_setSelectedDrawingObjectLayer = function (layerType) {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.setGraphicObjectLayer(layerType);
    };
    spreadsheet_api.prototype.asc_getChartPreviews = function (chartType) {
        return this.chartPreviewManager.getChartPreviews(chartType);
    };
    spreadsheet_api.prototype.asc_checkDataRange = function (dialogType, dataRange, fullCheck, isRows, chartType) {
        return parserHelp.checkDataRange(this.wbModel, this.wb, dialogType, dataRange, fullCheck, isRows, chartType);
    };
    spreadsheet_api.prototype.asc_getBinaryFileWriter = function () {
        this.wb._initCommentsToSave();
        return new Asc.BinaryFileWriter(this.wbModel);
    };
    spreadsheet_api.prototype.asc_getWordChartObject = function () {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.getWordChartObject();
    };
    spreadsheet_api.prototype.asc_cleanWorksheet = function () {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender) {
            ws.objectRender.cleanWorksheet();
        }
    };
    spreadsheet_api.prototype.asc_addComment = function (oComment) {};
    spreadsheet_api.prototype.asc_changeComment = function (id, oComment) {
        if (oComment.bDocument) {
            this.wb.cellCommentator.asc_changeComment(id, oComment);
        } else {
            var ws = this.wb.getWorksheet();
            ws.cellCommentator.asc_changeComment(id, oComment);
        }
    };
    spreadsheet_api.prototype.asc_selectComment = function (id) {
        var ws = this.wb.getWorksheet();
        ws.cellCommentator.asc_selectComment(id, true);
    };
    spreadsheet_api.prototype.asc_showComment = function (id, bNew) {
        var ws = this.wb.getWorksheet();
        ws.cellCommentator.asc_showComment(id, bNew);
    };
    spreadsheet_api.prototype.asc_findComment = function (id) {
        var ws = this.wb.getWorksheet();
        return ws.cellCommentator.asc_findComment(id);
    };
    spreadsheet_api.prototype.asc_removeComment = function (id) {
        var ws = this.wb.getWorksheet();
        ws.cellCommentator.asc_removeComment(id);
        this.wb.cellCommentator.asc_removeComment(id);
    };
    spreadsheet_api.prototype.asc_getComments = function (col, row) {
        var ws = this.wb.getWorksheet();
        return ws.cellCommentator.asc_getComments(col, row);
    };
    spreadsheet_api.prototype.asc_getDocumentComments = function () {
        return this.wb.cellCommentator.asc_getDocumentComments();
    };
    spreadsheet_api.prototype.asc_showComments = function () {
        var ws = this.wb.getWorksheet();
        return ws.cellCommentator.asc_showComments();
    };
    spreadsheet_api.prototype.asc_hideComments = function () {
        var ws = this.wb.getWorksheet();
        return ws.cellCommentator.asc_hideComments();
    };
    spreadsheet_api.prototype.asc_getWorkbookComments = function () {
        var _this = this,
        comments = [];
        if (_this.wb) {
            for (var key in _this.wb.wsViews) {
                var ws = _this.wb.wsViews[key];
                if (ws) {
                    for (var i = 0; i < ws.cellCommentator.aComments.length; i++) {
                        var comment = ws.cellCommentator.aComments[i];
                        comments.push({
                            "Id": comment.asc_getId(),
                            "Comment": comment
                        });
                    }
                }
            }
        }
        return comments;
    };
    spreadsheet_api.prototype.setStartPointHistory = function () {
        History.Create_NewPoint();
        History.StartTransaction();
    };
    spreadsheet_api.prototype.setEndPointHistory = function () {
        History.EndTransaction();
    };
    spreadsheet_api.prototype.asc_startAddShape = function (sPreset) {
        this.isStartAddShape = this.controller.isShapeAction = true;
        var ws = this.wb.getWorksheet();
        ws.objectRender.controller.startTrackNewShape(sPreset);
    };
    spreadsheet_api.prototype.asc_endAddShape = function () {
        this.isStartAddShape = false;
        this.handlers.trigger("asc_onEndAddShape");
    };
    spreadsheet_api.prototype.asc_isAddAutoshape = function () {
        return this.isStartAddShape;
    };
    spreadsheet_api.prototype.asc_canAddShapeHyperlink = function () {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.controller.canAddHyperlink();
    };
    spreadsheet_api.prototype.asc_canGroupGraphicsObjects = function () {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.controller.canGroup();
    };
    spreadsheet_api.prototype.asc_groupGraphicsObjects = function () {
        var ws = this.wb.getWorksheet();
        ws.objectRender.groupGraphicObjects();
    };
    spreadsheet_api.prototype.asc_canUnGroupGraphicsObjects = function () {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.controller.canUnGroup();
    };
    spreadsheet_api.prototype.asc_unGroupGraphicsObjects = function () {
        var ws = this.wb.getWorksheet();
        ws.objectRender.unGroupGraphicObjects();
    };
    spreadsheet_api.prototype.asc_changeShapeType = function (value) {
        this.asc_setGraphicObjectProps(new asc_CImgProperty({
            ShapeProperties: {
                type: value
            }
        }));
    };
    spreadsheet_api.prototype.asc_getGraphicObjectProps = function () {
        var ws = this.wb.getWorksheet();
        if (ws && ws.objectRender && ws.objectRender.controller) {
            return ws.objectRender.controller.getGraphicObjectProps();
        }
        return null;
    };
    spreadsheet_api.prototype.asc_setGraphicObjectProps = function (props) {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.setGraphicObjectProps(props);
    };
    spreadsheet_api.prototype.asc_getOriginalImageSize = function () {
        var ws = this.wb.getWorksheet();
        return ws.objectRender.getOriginalImageSize();
    };
    spreadsheet_api.prototype.asc_setInterfaceDrawImagePlaceShape = function (elementId) {
        this.shapeElementId = elementId;
    };
    spreadsheet_api.prototype.asc_changeImageFromFile = function () {
        this.isImageChangeUrl = true;
        this.asc_showImageFileDialog();
    };
    spreadsheet_api.prototype.asc_changeShapeImageFromFile = function () {
        this.isShapeImageChangeUrl = true;
        this.asc_showImageFileDialog();
    };
    spreadsheet_api.prototype.asc_putPrLineSpacing = function (type, value) {
        var ws = this.wb.getWorksheet();
        ws.objectRender.controller.putPrLineSpacing(type, value);
    };
    spreadsheet_api.prototype.asc_putLineSpacingBeforeAfter = function (type, value) {
        var ws = this.wb.getWorksheet();
        ws.objectRender.controller.putLineSpacingBeforeAfter(type, value);
    };
    spreadsheet_api.prototype.asc_setDrawImagePlaceParagraph = function (element_id, props) {
        var ws = this.wb.getWorksheet();
        ws.objectRender.setDrawImagePlaceParagraph(element_id, props);
    };
    spreadsheet_api.prototype.asyncImageStartLoaded = function () {};
    spreadsheet_api.prototype.asyncImageEndLoaded = function (_image) {
        if (this.wb) {
            var ws = this.wb.getWorksheet();
            if (ws.objectRender.asyncImageEndLoaded) {
                ws.objectRender.asyncImageEndLoaded(_image);
            }
        }
    };
    spreadsheet_api.prototype.asyncImagesDocumentStartLoaded = function () {};
    spreadsheet_api.prototype.asyncImagesDocumentEndLoaded = function () {};
    spreadsheet_api.prototype.asyncImageEndLoadedBackground = function () {
        var worksheet = this.wb.getWorksheet();
        if (worksheet && worksheet.objectRender) {
            var drawing_area = worksheet.objectRender.drawingArea;
            if (drawing_area) {
                for (var i = 0; i < drawing_area.frozenPlaces.length; ++i) {
                    worksheet.objectRender.showDrawingObjects(false, new GraphicOption(worksheet, c_oAscGraphicOption.ScrollVertical, drawing_area.frozenPlaces[i].range, {
                        offsetX: 0,
                        offsetY: 0
                    }));
                }
            }
        }
    };
    spreadsheet_api.prototype.asc_freezePane = function () {
        this.wb.getWorksheet().freezePane();
    };
    spreadsheet_api.prototype.asc_getCellInfo = function (bExt) {
        return this.wb.getWorksheet().getSelectionInfo( !! bExt);
    };
    spreadsheet_api.prototype.asc_getActiveCellCoord = function () {
        return this.wb.getWorksheet().getActiveCellCoord();
    };
    spreadsheet_api.prototype.asc_getAnchorPosition = function () {
        return this.asc_getActiveCellCoord();
    };
    spreadsheet_api.prototype.asc_getCellEditMode = function () {
        return this.wb ? this.wb.getCellEditMode() : false;
    };
    spreadsheet_api.prototype.asc_setCellFontName = function (fontName) {
        var t = this,
        fonts = {};
        fonts[fontName] = 1;
        t._loadFonts(fonts, function () {
            var ws = t.wb.getWorksheet();
            if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellFontName) {
                ws.objectRender.controller.setCellFontName(fontName);
            } else {
                t.wb.setFontAttributes("fn", fontName);
                t.wb.restoreFocus();
            }
        });
    };
    spreadsheet_api.prototype.asc_setCellFontSize = function (fontSize) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellFontSize) {
            ws.objectRender.controller.setCellFontSize(fontSize);
        } else {
            this.wb.setFontAttributes("fs", fontSize);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellBold = function (isBold) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellBold) {
            ws.objectRender.controller.setCellBold(isBold);
        } else {
            this.wb.setFontAttributes("b", isBold);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellItalic = function (isItalic) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellItalic) {
            ws.objectRender.controller.setCellItalic(isItalic);
        } else {
            this.wb.setFontAttributes("i", isItalic);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellUnderline = function (isUnderline) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellUnderline) {
            ws.objectRender.controller.setCellUnderline(isUnderline);
        } else {
            this.wb.setFontAttributes("u", isUnderline ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellStrikeout = function (isStrikeout) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellStrikeout) {
            ws.objectRender.controller.setCellStrikeout(isStrikeout);
        } else {
            this.wb.setFontAttributes("s", isStrikeout);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellSubscript = function (isSubscript) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellSubscript) {
            ws.objectRender.controller.setCellSubscript(isSubscript);
        } else {
            this.wb.setFontAttributes("fa", isSubscript ? "subscript" : "none");
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellSuperscript = function (isSuperscript) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellSuperscript) {
            ws.objectRender.controller.setCellSuperscript(isSuperscript);
        } else {
            this.wb.setFontAttributes("fa", isSuperscript ? "superscript" : "none");
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellAlign = function (align) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellAlign) {
            ws.objectRender.controller.setCellAlign(align);
        } else {
            this.wb.getWorksheet().setSelectionInfo("a", align);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellVertAlign = function (align) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellVertAlign) {
            ws.objectRender.controller.setCellVertAlign(align);
        } else {
            this.wb.getWorksheet().setSelectionInfo("va", align);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellTextWrap = function (isWrapped) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextWrap) {
            ws.objectRender.controller.setCellTextWrap(isWrapped);
        } else {
            this.wb.getWorksheet().setSelectionInfo("wrap", isWrapped);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellTextShrink = function (isShrinked) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextShrink) {
            ws.objectRender.controller.setCellTextShrink(isShrinked);
        } else {
            this.wb.getWorksheet().setSelectionInfo("shrink", isShrinked);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellTextColor = function (color) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextColor) {
            ws.objectRender.controller.setCellTextColor(color);
        } else {
            if (color instanceof CAscColor) {
                color = CorrectAscColor(color);
                this.wb.setFontAttributes("c", color);
                this.wb.restoreFocus();
            }
        }
    };
    spreadsheet_api.prototype.asc_setCellBackgroundColor = function (color) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellBackgroundColor) {
            ws.objectRender.controller.setCellBackgroundColor(color);
        } else {
            if (color instanceof CAscColor || null == color) {
                if (null != color) {
                    color = CorrectAscColor(color);
                }
                this.wb.getWorksheet().setSelectionInfo("bc", color);
                this.wb.restoreFocus();
            }
        }
    };
    spreadsheet_api.prototype.asc_setCellBorders = function (borders) {
        this.wb.getWorksheet().setSelectionInfo("border", borders);
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_setCellFormat = function (format) {
        this.wb.getWorksheet().setSelectionInfo("format", format);
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_setCellAngle = function (angle) {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellAngle) {
            ws.objectRender.controller.setCellAngle(angle);
        } else {
            this.wb.getWorksheet().setSelectionInfo("angle", angle);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_setCellStyle = function (name) {
        this.wb.getWorksheet().setSelectionInfo("style", name);
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_increaseCellDigitNumbers = function () {
        this.wb.getWorksheet().setSelectionInfo("changeDigNum", +1);
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_decreaseCellDigitNumbers = function () {
        this.wb.getWorksheet().setSelectionInfo("changeDigNum", -1);
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_increaseFontSize = function () {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.increaseFontSize) {
            ws.objectRender.controller.increaseFontSize();
        } else {
            this.wb.changeFontSize("changeFontSize", true);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_decreaseFontSize = function () {
        var ws = this.wb.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.decreaseFontSize) {
            ws.objectRender.controller.decreaseFontSize();
        } else {
            this.wb.changeFontSize("changeFontSize", false);
            this.wb.restoreFocus();
        }
    };
    spreadsheet_api.prototype.asc_formatPainter = function (stateFormatPainter) {
        if (this.wb) {
            this.wb.getWorksheet().formatPainter(stateFormatPainter);
        }
    };
    spreadsheet_api.prototype.asc_onMouseUp = function (event, x, y) {
        this.controller._onWindowMouseUpExternal(event, x, y);
    };
    spreadsheet_api.prototype.asc_selectFunction = function () {};
    spreadsheet_api.prototype.asc_insertHyperlink = function (options) {
        this.wb.insertHyperlink(options);
    };
    spreadsheet_api.prototype.asc_removeHyperlink = function () {
        this.wb.removeHyperlink();
    };
    spreadsheet_api.prototype.asc_insertFormula = function (functionName, autoComplet) {
        this.wb.insertFormulaInEditor(functionName, autoComplet);
        this.wb.restoreFocus();
    };
    spreadsheet_api.prototype.asc_getFormulasInfo = function () {
        return this.wb.getFormulasInfo();
    };
    spreadsheet_api.prototype.asc_recalc = function (isRecalcWB) {
        this.wbModel.recalcWB(isRecalcWB);
    };
    spreadsheet_api.prototype.asc_setFontRenderingMode = function (mode) {
        if (mode !== this.fontRenderingMode) {
            this.fontRenderingMode = mode;
            if (this.wb) {
                this.wb.setFontRenderingMode(mode, false);
            }
        }
    };
    spreadsheet_api.prototype.asc_setSelectionDialogMode = function (selectionDialogType, selectRange) {
        this.controller.setSelectionDialogMode(c_oAscSelectionDialogType.None !== selectionDialogType);
        if (this.wb) {
            this.wb.setSelectionDialogMode(selectionDialogType, selectRange);
        }
    };
    spreadsheet_api.prototype.asc_SendThemeColors = function (colors, standart_colors) {
        this._gui_control_colors = {
            Colors: colors,
            StandartColors: standart_colors
        };
        var ret = this.handlers.trigger("asc_onSendThemeColors", colors, standart_colors);
        if (false !== ret) {
            this._gui_control_colors = null;
        }
    };
    spreadsheet_api.prototype.asc_SendThemeColorSchemes = function (param) {
        this._gui_color_schemes = param;
        var ret = this.handlers.trigger("asc_onSendThemeColorSchemes", param);
        if (false !== ret) {
            this._gui_color_schemes = null;
        }
    };
    spreadsheet_api.prototype.asc_ChangeColorScheme = function (index_scheme) {
        var t = this;
        var onChangeColorScheme = function (res) {
            if (res) {
                var theme = t.wbModel.theme;
                var oldClrScheme = theme.themeElements.clrScheme;
                var _count_defaults = g_oUserColorScheme.length;
                if (index_scheme < _count_defaults) {
                    var _obj = g_oUserColorScheme[index_scheme];
                    var scheme = new ClrScheme();
                    scheme.name = _obj["name"];
                    var _c;
                    _c = _obj["dk1"];
                    scheme.colors[8] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["lt1"];
                    scheme.colors[12] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["dk2"];
                    scheme.colors[9] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["lt2"];
                    scheme.colors[13] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["accent1"];
                    scheme.colors[0] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["accent2"];
                    scheme.colors[1] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["accent3"];
                    scheme.colors[2] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["accent4"];
                    scheme.colors[3] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["accent5"];
                    scheme.colors[4] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["accent6"];
                    scheme.colors[5] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["hlink"];
                    scheme.colors[11] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    _c = _obj["folHlink"];
                    scheme.colors[10] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);
                    theme.themeElements.clrScheme = scheme;
                } else {
                    index_scheme -= _count_defaults;
                    if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length) {
                        return;
                    }
                    theme.themeElements.clrScheme = theme.extraClrSchemeLst[index_scheme].clrScheme.createDuplicate();
                }
                History.Create_NewPoint();
                History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_ChangeColorScheme, null, null, new UndoRedoData_ClrScheme(oldClrScheme, theme.themeElements.clrScheme));
                t.asc_AfterChangeColorScheme();
            }
        };
        var sheetId = -1;
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, sheetId);
        this._getIsLockObjectSheet(lockInfo, onChangeColorScheme);
    };
    spreadsheet_api.prototype.asc_AfterChangeColorScheme = function () {
        this.wbModel.rebuildColors();
        this.asc_CheckGuiControlColors();
        this.asc_ApplyColorScheme(true);
    };
    spreadsheet_api.prototype.asc_ApplyColorScheme = function (bRedraw) {
        if (!window["NATIVE_EDITOR_ENJINE"]) {
            var wsViews = Asc["editor"].wb.wsViews;
            for (var i = 0; i < wsViews.length; ++i) {
                if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                    wsViews[i].objectRender.controller.startRecalculate();
                }
            }
            this.chartPreviewManager.clearPreviews();
        }
        if (true !== this.asc_getViewerMode() && !this.isMobileVersion) {
            this._sendWorkbookStyles();
        }
        if (bRedraw) {
            this.handlers.trigger("asc_onUpdateChartStyles");
            this.wb.drawWS();
        }
    };
    spreadsheet_api.prototype.asc_coAuthoringChatSendMessage = function (message) {
        if (!this.CoAuthoringApi) {
            return;
        }
        this.CoAuthoringApi.sendMessage(message);
    };
    spreadsheet_api.prototype.asc_coAuthoringChatGetMessages = function () {
        if (!this.CoAuthoringApi) {
            return;
        }
        this.CoAuthoringApi.getMessages();
    };
    spreadsheet_api.prototype.asc_coAuthoringGetUsers = function () {
        if (!this.CoAuthoringApi) {
            return;
        }
        this.CoAuthoringApi.getUsers();
    };
    spreadsheet_api.prototype.asc_coAuthoringDisconnect = function () {
        if (!this.CoAuthoringApi) {
            return;
        }
        this.CoAuthoringApi.disconnect();
    };
    spreadsheet_api.prototype._autoSave = function () {
        if (0 === this.autoSaveGap || this.asc_getCellEditMode() || !History.Is_Modified() || !History.IsEndTransaction() || !this.canSave) {
            return;
        }
        if (null === this.lastSaveTime) {
            this.lastSaveTime = new Date();
            return;
        }
        var isFastSave = !this.collaborativeEditing.getCollaborativeEditing();
        var gap = new Date() - this.lastSaveTime - (isFastSave ? this.autoSaveGapFast : this.autoSaveGapSlow);
        if (0 <= gap) {
            this.asc_Save(true);
        }
    };
    spreadsheet_api.prototype._onUpdateDocumentCanSave = function () {
        var tmp = this.asc_isDocumentModified() || (this.collaborativeEditing.getCollaborativeEditing() && 0 !== this.collaborativeEditing.getOwnLocksLength());
        if (tmp !== this.isDocumentCanSave) {
            this.isDocumentCanSave = tmp;
            this.handlers.trigger("asc_onDocumentCanSaveChanged", this.isDocumentCanSave);
        }
    };
    spreadsheet_api.prototype._onCheckCommentRemoveLock = function (lockElem) {
        var res = false;
        var sheetId = lockElem["sheetId"];
        if (-1 !== sheetId && 0 === sheetId.indexOf(CCellCommentator.sStartCommentId)) {
            res = true;
            this.handlers.trigger("asc_onUnLockComment", lockElem["rangeOrObjectId"]);
        }
        return res;
    };
    spreadsheet_api.prototype.onUpdateDocumentModified = function (bIsModified) {
        if (this.canSave) {
            this.handlers.trigger("asc_onDocumentModifiedChanged", bIsModified);
            this._onUpdateDocumentCanSave();
            if (undefined !== window["AscDesktopEditor"]) {
                window["AscDesktopEditor"]["onDocumentModifiedChanged"](bIsModified);
            }
        }
    };
    spreadsheet_api.prototype.asc_stopSaving = function () {
        this.waitSave = true;
    };
    spreadsheet_api.prototype.asc_continueSaving = function () {
        this.waitSave = false;
    };
    spreadsheet_api.prototype.offlineModeInit = function () {
        var t = this;
        if (window["scriptBridge"]) {
            if (!window["scriptBridge"]["_self"]) {
                window["scriptBridge"]["_self"] = t;
            }
            if (!window["scriptBridge"]["workPath"]) {
                window["scriptBridge"]["workPath"] = function () {
                    return t.documentUrl;
                };
            }
            if (!window["scriptBridge"]["print"]) {
                window["scriptBridge"]["print"] = function () {
                    var oAdditionalData = {};
                    oAdditionalData["documentId"] = t.documentId + "." + t.documentFormat;
                    oAdditionalData["vkey"] = t.documentVKey;
                    oAdditionalData["outputformat"] = c_oAscFileType.PDFPRINT;
                    t.adjustPrint = new asc_CAdjustPrint();
                    t.printPagesData = t.wb.calcPagesPrint(t.adjustPrint);
                    var pdf_writer = new CPdfPrinter(t.wbModel.sUrlPath);
                    t.wb.printSheet(pdf_writer, t.printPagesData);
                    return pdf_writer.DocumentRenderer.Memory.GetBase64Memory();
                };
            }
            if (!window["scriptBridge"]["addFileImage"]) {
                window["scriptBridge"]["addFileImage"] = function (imageUrl, x, y, width, height) {
                    t.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                    var ws = t.wb.getWorksheet();
                    var options = null;
                    if (x && y) {
                        var picker = ws.objectRender.getPositionInfo(x, y);
                        options = {
                            cell: {
                                col: picker.col,
                                row: picker.row
                            },
                            width: width,
                            height: height
                        };
                    }
                    ws.objectRender.addImageDrawingObject(imageUrl, options);
                    t.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                };
            }
            if (!window["scriptBridge"]["isDocumentModified"]) {
                window["scriptBridge"]["isDocumentModified"] = function () {
                    var f = t.asc_isDocumentModified();
                    t.isDocumentModify = false;
                    t.handlers.trigger("asc_onDocumentModifiedChanged", false);
                    return f;
                };
            }
            if (!window["scriptBridge"]["save"]) {
                window["scriptBridge"]["save"] = function (sFormat) {
                    var oAdditionalData = {};
                    oAdditionalData["documentId"] = t.documentId + "." + t.documentFormat;
                    oAdditionalData["vkey"] = t.documentVKey;
                    oAdditionalData["outputformat"] = sFormat;
                    t.wb._initCommentsToSave();
                    var oBinaryFileWriter = new Asc.BinaryFileWriter(t.wbModel);
                    oAdditionalData["savetype"] = "completeall";
                    var data = oBinaryFileWriter.Write();
                    return data;
                };
            }
            if (!window["scriptBridge"]["showAdvancedOptionsDialog"]) {
                window["scriptBridge"]["showAdvancedOptionsDialog"] = function (codepages) {
                    var cp = JSON.parse(codepages);
                    t.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
                    t.handlers.trigger("asc_onAdvancedOptions", new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV, cp), t.advancedOptionsAction);
                };
            }
            if (!window["scriptBridge"]["updateTitle"]) {
                window["scriptBridge"]["updateTitle"] = function (title) {
                    t.documentTitle = title;
                };
            }
            if (!window["scriptBridge"]["loadDocumentFromString"]) {
                window["scriptBridge"]["loadDocumentFromString"] = function (workbook) {
                    var wb = t.asc_OpenDocument("", workbook);
                    t._startOpenDocument({
                        returnCode: 0,
                        val: wb
                    });
                };
            }
        }
    };
    spreadsheet_api.prototype.offlineModeLoadDocument = function () {
        var t = this;
        t.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        function loadDocument(data) {
            var workbook = data;
            if (!data || Asc.c_oSerFormat.Signature !== data.substring(0, Asc.c_oSerFormat.Signature.length)) {
                workbook = "XLSY;v1;1001;BAKAAgAAAwwDAAAEHwMAAADgAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIgAAAAAHgAAAAEZAAAAAAAAAAABAAAAAAIAAAAABAAAAAAFAAAAAAIdAAAAAxgAAAAGBAAAAAAHBAAAAAAIBAAAAAAJBAAAAAAECgAAAAUAAAAABQAAAAAGLwAAAAcqAAAAAQYGAAAAAAQAAAD/BAYOAAAAQwBhAGwAaQBiAHIAaQAGBQAAAAAAACZADwAAAAAAAAAAAQUAAAACAAAAAL0AAAAAOgAAAAEYAAAAAAYMAAAAUwBoAGUAZQB0ADEAAQQBAAAABAQAAABBADEACwoAAAABBQAAAAAAAC5ACQAAAAAAOgAAAAEYAAAAAAYMAAAAUwBoAGUAZQB0ADIAAQQCAAAABAQAAABBADEACwoAAAABBQAAAAAAAC5ACQAAAAAAOgAAAAEYAAAAAAYMAAAAUwBoAGUAZQB0ADMAAQQDAAAABAQAAABBADEACwoAAAABBQAAAAAAAC5ACQAAAAAFAAAAAAAAAAA=";
            }
            var wb = t.asc_OpenDocument("", workbook);
            t._startOpenDocument({
                returnCode: 0,
                val: wb
            });
        }
        $.ajax({
            type: "GET",
            url: t.documentUrl + "editor.js?callback=?",
            jsonpCallback : "jsonCallback",
            async : false,
            cache: false,
            dataType: "jsonp",
            contentType: "application/json",
            crossDomain: true,
            success: function (data) {
                loadDocument(data);
            },
            error: function (jqXHR, textStatus, ex) {
                loadDocument(undefined);
            }
        });
    };
    spreadsheet_api.prototype.asc_openNewDocument = function () {
        if (undefined != window["appBridge"]) {
            window["appBridge"]["dummyCommandNewDocument"]();
        }
    };
    spreadsheet_api.prototype.asc_loadDocumentFromDisk = function () {
        if (undefined != window["appBridge"]) {
            window["appBridge"]["dummyCommandLoadDocumentFromDisk"]();
        }
    };
    spreadsheet_api.prototype.asc_mapAscServerErrorToAscError = function (nServerError) {
        var nRes = c_oAscError.ID.Unknown;
        switch (nServerError) {
        case c_oAscServerError.NoError:
            nRes = c_oAscError.ID.No;
            break;
        case c_oAscServerError.TaskQueue:
            case c_oAscServerError.TaskResult:
            nRes = c_oAscError.ID.Database;
            break;
        case c_oAscServerError.ConvertDownload:
            nRes = c_oAscError.ID.DownloadError;
            break;
        case c_oAscServerError.ConvertTimeout:
            nRes = c_oAscError.ID.ConvertationTimeout;
            break;
        case c_oAscServerError.ConvertMS_OFFCRYPTO:
            nRes = c_oAscError.ID.ConvertationPassword;
            break;
        case c_oAscServerError.ConvertUnknownFormat:
            case c_oAscServerError.ConvertReadFile:
            case c_oAscServerError.Convert:
            nRes = c_oAscError.ID.ConvertationError;
            break;
        case c_oAscServerError.UploadContentLength:
            nRes = c_oAscError.ID.UplImageSize;
            break;
        case c_oAscServerError.UploadExtension:
            nRes = c_oAscError.ID.UplImageExt;
            break;
        case c_oAscServerError.UploadCountFiles:
            nRes = c_oAscError.ID.UplImageFileCount;
            break;
        case c_oAscServerError.VKey:
            nRes = c_oAscError.ID.FileVKey;
            break;
        case c_oAscServerError.VKeyEncrypt:
            nRes = c_oAscError.ID.VKeyEncrypt;
            break;
        case c_oAscServerError.VKeyKeyExpire:
            nRes = c_oAscError.ID.KeyExpire;
            break;
        case c_oAscServerError.VKeyUserCountExceed:
            nRes = c_oAscError.ID.UserCountExceed;
            break;
        case c_oAscServerError.Storage:
            case c_oAscServerError.StorageFileNoFound:
            case c_oAscServerError.StorageRead:
            case c_oAscServerError.StorageWrite:
            case c_oAscServerError.StorageRemoveDir:
            case c_oAscServerError.StorageCreateDir:
            case c_oAscServerError.StorageGetInfo:
            case c_oAscServerError.Upload:
            case c_oAscServerError.ReadRequestStream:
            case c_oAscServerError.Unknown:
            nRes = c_oAscError.ID.Unknown;
            break;
        }
        return nRes;
    };
    spreadsheet_api.prototype.asc_nativeOpenFile = function (base64File, version) {
        this.DocumentUrl = "TeamlabNative";
        asc["editor"] = this;
        window.g_cAscCoAuthoringUrl = "";
        window.g_cAscSpellCheckUrl = "";
        this.User = new asc.asc_CUser();
        this.User.asc_setId("TM");
        this.User.asc_setUserName("native");
        this.wbModel = new Workbook(this.DocumentUrl, this.handlers, this);
        this.initGlobalObjects(this.wbModel);
        var oBinaryFileReader = new Asc.BinaryFileReader(this.DocumentUrl);
        if (undefined === version) {
            oBinaryFileReader.Read(base64File, this.wbModel);
        } else {
            g_nCurFileVersion = version;
            oBinaryFileReader.ReadData(base64File, this.wbModel);
        }
        g_oIdCounter.Set_Load(false);
        this._coAuthoringInit();
        this.wb = new asc.WorkbookView(this.wbModel, this.controller, this.handlers, window["_null_object"], window["_null_object"], this, this.collaborativeEditing, this.fontRenderingMode);
    };
    spreadsheet_api.prototype.asc_nativeCalculateFile = function () {};
    spreadsheet_api.prototype.asc_nativeApplyChanges = function (changes) {
        for (var i = 0, l = changes.length; i < l; ++i) {
            this.CoAuthoringApi.onSaveChanges(changes[i], null, true);
        }
        this.collaborativeEditing.applyChanges();
    };
    spreadsheet_api.prototype.asc_nativeApplyChanges2 = function (data, isFull) {
        if (null != this.wbModel) {
            this.oRedoObjectParamNative = this.wbModel.DeserializeHistoryNative(this.oRedoObjectParamNative, data, isFull);
        }
        if (isFull) {
            this._onUpdateAfterApplyChanges();
        }
    };
    spreadsheet_api.prototype.asc_nativeGetFile = function () {
        this.wb._initCommentsToSave();
        var oBinaryFileWriter = new Asc.BinaryFileWriter(this.wbModel);
        return oBinaryFileWriter.Write();
    };
    spreadsheet_api.prototype.asc_nativeGetFileData = function () {
        this.wb._initCommentsToSave();
        var oBinaryFileWriter = new Asc.BinaryFileWriter(this.wbModel);
        oBinaryFileWriter.Write2();
        var _header = oBinaryFileWriter.WriteFileHeader(oBinaryFileWriter.Memory.GetCurPosition());
        window["native"]["Save_End"](_header, oBinaryFileWriter.Memory.GetCurPosition());
        return oBinaryFileWriter.Memory.ImData.data;
    };
    spreadsheet_api.prototype.asc_nativeCheckPdfRenderer = function (_memory1, _memory2) {
        if (true) {
            _memory1.Copy = _memory1["Copy"];
            _memory1.ClearNoAttack = _memory1["ClearNoAttack"];
            _memory1.WriteByte = _memory1["WriteByte"];
            _memory1.WriteBool = _memory1["WriteBool"];
            _memory1.WriteLong = _memory1["WriteLong"];
            _memory1.WriteDouble = _memory1["WriteDouble"];
            _memory1.WriteString = _memory1["WriteString"];
            _memory1.WriteString2 = _memory1["WriteString2"];
            _memory2.Copy = _memory1["Copy"];
            _memory2.ClearNoAttack = _memory1["ClearNoAttack"];
            _memory2.WriteByte = _memory1["WriteByte"];
            _memory2.WriteBool = _memory1["WriteBool"];
            _memory2.WriteLong = _memory1["WriteLong"];
            _memory2.WriteDouble = _memory1["WriteDouble"];
            _memory2.WriteString = _memory1["WriteString"];
            _memory2.WriteString2 = _memory1["WriteString2"];
        }
        var _printer = new CPdfPrinter(this.wbModel.sUrlPath);
        _printer.DocumentRenderer.Memory = _memory1;
        _printer.DocumentRenderer.VectorMemoryForPrint = _memory2;
        return _printer;
    };
    spreadsheet_api.prototype.asc_nativeCalculate = function () {};
    spreadsheet_api.prototype.asc_nativePrint = function (_printer, _page) {
        var _adjustPrint = window.AscDesktopEditor_PrintData ? window.AscDesktopEditor_PrintData : new asc_CAdjustPrint();
        window.AscDesktopEditor_PrintData = undefined;
        var _printPagesData = this.wb.calcPagesPrint(_adjustPrint);
        if (undefined === _printer && _page === undefined) {
            var pdf_writer = new CPdfPrinter(this.wbModel.sUrlPath);
            while (!this.wb.printSheet(pdf_writer, _printPagesData)) {}
            if (undefined !== window["AscDesktopEditor"]) {
                var pagescount = pdf_writer.DocumentRenderer.m_lPagesCount;
                window["AscDesktopEditor"]["Print_Start"](g_sResourceServiceLocalUrl + this.documentId + "/", pagescount, "", -1);
                for (var i = 0; i < pagescount; i++) {
                    var _start = pdf_writer.DocumentRenderer.m_arrayPages[i].StartOffset;
                    var _end = pdf_writer.DocumentRenderer.Memory.pos;
                    if (i != (pagescount - 1)) {
                        _end = pdf_writer.DocumentRenderer.m_arrayPages[i + 1].StartOffset;
                    }
                    window["AscDesktopEditor"]["Print_Page"](pdf_writer.DocumentRenderer.Memory.GetBase64Memory2(_start, _end - _start), pdf_writer.DocumentRenderer.m_arrayPages[i].Width, pdf_writer.DocumentRenderer.m_arrayPages[i].Height);
                }
                window["AscDesktopEditor"]["Print_End"]();
            }
            return;
        }
        while (!this.wb.printSheet(pdf_writer, _printPagesData)) {}
        return _printer.DocumentRenderer.Memory;
    };
    spreadsheet_api.prototype.asc_nativePrintPagesCount = function () {
        return 1;
    };
    spreadsheet_api.prototype.asc_nativeGetPDF = function () {
        var _ret = this.asc_nativePrint();
        window["native"]["Save_End"]("", _ret.GetCurPosition());
        return _ret.data;
    };
    window["AscDesktopEditor_Save"] = function () {
        return window["Asc"]["editor"].asc_Save();
    };
    asc["spreadsheet_api"] = spreadsheet_api;
    prot = spreadsheet_api.prototype;
    prot["asc_GetFontThumbnailsPath"] = prot.asc_GetFontThumbnailsPath;
    prot["asc_Init"] = prot.asc_Init;
    prot["asc_setDocInfo"] = prot.asc_setDocInfo;
    prot["asc_setLocale"] = prot.asc_setLocale;
    prot["asc_getEditorPermissions"] = prot.asc_getEditorPermissions;
    prot["asc_getLicense"] = prot.asc_getLicense;
    prot["asc_LoadDocument"] = prot.asc_LoadDocument;
    prot["asc_LoadEmptyDocument"] = prot.asc_LoadEmptyDocument;
    prot["asc_DownloadAs"] = prot.asc_DownloadAs;
    prot["asc_Save"] = prot.asc_Save;
    prot["asc_Print"] = prot.asc_Print;
    prot["asc_Resize"] = prot.asc_Resize;
    prot["asc_Copy"] = prot.asc_Copy;
    prot["asc_Paste"] = prot.asc_Paste;
    prot["asc_Cut"] = prot.asc_Cut;
    prot["asc_Undo"] = prot.asc_Undo;
    prot["asc_Redo"] = prot.asc_Redo;
    prot["asc_getDocumentName"] = prot.asc_getDocumentName;
    prot["asc_getDocumentFormat"] = prot.asc_getDocumentFormat;
    prot["asc_isDocumentModified"] = prot.asc_isDocumentModified;
    prot["asc_isDocumentCanSave"] = prot.asc_isDocumentCanSave;
    prot["asc_getCanUndo"] = prot.asc_getCanUndo;
    prot["asc_getCanRedo"] = prot.asc_getCanRedo;
    prot["asc_setAutoSaveGap"] = prot.asc_setAutoSaveGap;
    prot["asc_setMobileVersion"] = prot.asc_setMobileVersion;
    prot["asc_setViewerMode"] = prot.asc_setViewerMode;
    prot["asc_setUseEmbeddedCutFonts"] = prot.asc_setUseEmbeddedCutFonts;
    prot["asc_setCoAuthoringEnable"] = prot.asc_setCoAuthoringEnable;
    prot["asc_setAdvancedOptions"] = prot.asc_setAdvancedOptions;
    prot["asc_setPageOptions"] = prot.asc_setPageOptions;
    prot["asc_getPageOptions"] = prot.asc_getPageOptions;
    prot["asc_registerCallback"] = prot.asc_registerCallback;
    prot["asc_unregisterCallback"] = prot.asc_unregisterCallback;
    prot["asc_getController"] = prot.asc_getController;
    prot["asc_SetDocumentPlaceChangedEnabled"] = prot.asc_SetDocumentPlaceChangedEnabled;
    prot["asc_getWorksheetsCount"] = prot.asc_getWorksheetsCount;
    prot["asc_getWorksheetName"] = prot.asc_getWorksheetName;
    prot["asc_getWorksheetTabColor"] = prot.asc_getWorksheetTabColor;
    prot["asc_setWorksheetTabColor"] = prot.asc_setWorksheetTabColor;
    prot["asc_getActiveWorksheetIndex"] = prot.asc_getActiveWorksheetIndex;
    prot["asc_getActiveWorksheetId"] = prot.asc_getActiveWorksheetId;
    prot["asc_getWorksheetId"] = prot.asc_getWorksheetId;
    prot["asc_isWorksheetHidden"] = prot.asc_isWorksheetHidden;
    prot["asc_isWorksheetLockedOrDeleted"] = prot.asc_isWorksheetLockedOrDeleted;
    prot["asc_isWorkbookLocked"] = prot.asc_isWorkbookLocked;
    prot["asc_getHiddenWorksheets"] = prot.asc_getHiddenWorksheets;
    prot["asc_showWorksheet"] = prot.asc_showWorksheet;
    prot["asc_showActiveWorksheet"] = prot.asc_showActiveWorksheet;
    prot["asc_hideWorksheet"] = prot.asc_hideWorksheet;
    prot["asc_renameWorksheet"] = prot.asc_renameWorksheet;
    prot["asc_addWorksheet"] = prot.asc_addWorksheet;
    prot["asc_insertWorksheet"] = prot.asc_insertWorksheet;
    prot["asc_deleteWorksheet"] = prot.asc_deleteWorksheet;
    prot["asc_moveWorksheet"] = prot.asc_moveWorksheet;
    prot["asc_copyWorksheet"] = prot.asc_copyWorksheet;
    prot["asc_cleanSelection"] = prot.asc_cleanSelection;
    prot["asc_getZoom"] = prot.asc_getZoom;
    prot["asc_setZoom"] = prot.asc_setZoom;
    prot["asc_enableKeyEvents"] = prot.asc_enableKeyEvents;
    prot["asc_searchEnabled"] = prot.asc_searchEnabled;
    prot["asc_findText"] = prot.asc_findText;
    prot["asc_replaceText"] = prot.asc_replaceText;
    prot["asc_endFindText"] = prot.asc_endFindText;
    prot["asc_findCell"] = prot.asc_findCell;
    prot["asc_closeCellEditor"] = prot.asc_closeCellEditor;
    prot["asc_getColumnWidth"] = prot.asc_getColumnWidth;
    prot["asc_setColumnWidth"] = prot.asc_setColumnWidth;
    prot["asc_insertColumnsBefore"] = prot.asc_insertColumnsBefore;
    prot["asc_insertColumnsAfter"] = prot.asc_insertColumnsAfter;
    prot["asc_deleteColumns"] = prot.asc_deleteColumns;
    prot["asc_showColumns"] = prot.asc_showColumns;
    prot["asc_hideColumns"] = prot.asc_hideColumns;
    prot["asc_getRowHeight"] = prot.asc_getRowHeight;
    prot["asc_setRowHeight"] = prot.asc_setRowHeight;
    prot["asc_insertRowsBefore"] = prot.asc_insertRowsBefore;
    prot["asc_insertRowsAfter"] = prot.asc_insertRowsAfter;
    prot["asc_deleteRows"] = prot.asc_deleteRows;
    prot["asc_showRows"] = prot.asc_showRows;
    prot["asc_hideRows"] = prot.asc_hideRows;
    prot["asc_insertCells"] = prot.asc_insertCells;
    prot["asc_deleteCells"] = prot.asc_deleteCells;
    prot["asc_mergeCells"] = prot.asc_mergeCells;
    prot["asc_sortCells"] = prot.asc_sortCells;
    prot["asc_emptyCells"] = prot.asc_emptyCells;
    prot["asc_mergeCellsDataLost"] = prot.asc_mergeCellsDataLost;
    prot["asc_getSheetViewSettings"] = prot.asc_getSheetViewSettings;
    prot["asc_setSheetViewSettings"] = prot.asc_setSheetViewSettings;
    prot["asc_addAutoFilter"] = prot.asc_addAutoFilter;
    prot["asc_applyAutoFilter"] = prot.asc_applyAutoFilter;
    prot["asc_sortColFilter"] = prot.asc_sortColFilter;
    prot["asc_getAddFormatTableOptions"] = prot.asc_getAddFormatTableOptions;
    prot["asc_clearFilter"] = prot.asc_clearFilter;
    prot["asc_showDrawingObjects"] = prot.asc_showDrawingObjects;
    prot["asc_setChartTranslate"] = prot.asc_setChartTranslate;
    prot["asc_drawingObjectsExist"] = prot.asc_drawingObjectsExist;
    prot["asc_getChartObject"] = prot.asc_getChartObject;
    prot["asc_addChartDrawingObject"] = prot.asc_addChartDrawingObject;
    prot["asc_editChartDrawingObject"] = prot.asc_editChartDrawingObject;
    prot["asc_addImageDrawingObject"] = prot.asc_addImageDrawingObject;
    prot["asc_setSelectedDrawingObjectLayer"] = prot.asc_setSelectedDrawingObjectLayer;
    prot["asc_getChartPreviews"] = prot.asc_getChartPreviews;
    prot["asc_checkDataRange"] = prot.asc_checkDataRange;
    prot["asc_getBinaryFileWriter"] = prot.asc_getBinaryFileWriter;
    prot["asc_getWordChartObject"] = prot.asc_getWordChartObject;
    prot["asc_cleanWorksheet"] = prot.asc_cleanWorksheet;
    prot["asc_showImageFileDialog"] = prot.asc_showImageFileDialog;
    prot["asc_addComment"] = prot.asc_addComment;
    prot["asc_changeComment"] = prot.asc_changeComment;
    prot["asc_findComment"] = prot.asc_findComment;
    prot["asc_removeComment"] = prot.asc_removeComment;
    prot["asc_showComment"] = prot.asc_showComment;
    prot["asc_selectComment"] = prot.asc_selectComment;
    prot["asc_showComments"] = prot.asc_showComments;
    prot["asc_hideComments"] = prot.asc_hideComments;
    prot["asc_getComments"] = prot.asc_getComments;
    prot["asc_getDocumentComments"] = prot.asc_getDocumentComments;
    prot["asc_getWorkbookComments"] = prot.asc_getWorkbookComments;
    prot["setStartPointHistory"] = prot.setStartPointHistory;
    prot["setEndPointHistory"] = prot.setEndPointHistory;
    prot["asc_startAddShape"] = prot.asc_startAddShape;
    prot["asc_endAddShape"] = prot.asc_endAddShape;
    prot["asc_isAddAutoshape"] = prot.asc_isAddAutoshape;
    prot["asc_canAddShapeHyperlink"] = prot.asc_canAddShapeHyperlink;
    prot["asc_canGroupGraphicsObjects"] = prot.asc_canGroupGraphicsObjects;
    prot["asc_groupGraphicsObjects"] = prot.asc_groupGraphicsObjects;
    prot["asc_canUnGroupGraphicsObjects"] = prot.asc_canUnGroupGraphicsObjects;
    prot["asc_unGroupGraphicsObjects"] = prot.asc_unGroupGraphicsObjects;
    prot["asc_getGraphicObjectProps"] = prot.asc_getGraphicObjectProps;
    prot["asc_setGraphicObjectProps"] = prot.asc_setGraphicObjectProps;
    prot["asc_getOriginalImageSize"] = prot.asc_getOriginalImageSize;
    prot["asc_changeShapeType"] = prot.asc_changeShapeType;
    prot["asc_setInterfaceDrawImagePlaceShape"] = prot.asc_setInterfaceDrawImagePlaceShape;
    prot["asc_changeImageFromFile"] = prot.asc_changeImageFromFile;
    prot["asc_putPrLineSpacing"] = prot.asc_putPrLineSpacing;
    prot["asc_putLineSpacingBeforeAfter"] = prot.asc_putLineSpacingBeforeAfter;
    prot["asc_setDrawImagePlaceParagraph"] = prot.asc_setDrawImagePlaceParagraph;
    prot["asc_changeShapeImageFromFile"] = prot.asc_changeShapeImageFromFile;
    prot["asc_freezePane"] = prot.asc_freezePane;
    prot["asc_getCellInfo"] = prot.asc_getCellInfo;
    prot["asc_getActiveCellCoord"] = prot.asc_getActiveCellCoord;
    prot["asc_getAnchorPosition"] = prot.asc_getAnchorPosition;
    prot["asc_setCellFontName"] = prot.asc_setCellFontName;
    prot["asc_setCellFontSize"] = prot.asc_setCellFontSize;
    prot["asc_setCellBold"] = prot.asc_setCellBold;
    prot["asc_setCellItalic"] = prot.asc_setCellItalic;
    prot["asc_setCellUnderline"] = prot.asc_setCellUnderline;
    prot["asc_setCellStrikeout"] = prot.asc_setCellStrikeout;
    prot["asc_setCellSubscript"] = prot.asc_setCellSubscript;
    prot["asc_setCellSuperscript"] = prot.asc_setCellSuperscript;
    prot["asc_setCellAlign"] = prot.asc_setCellAlign;
    prot["asc_setCellVertAlign"] = prot.asc_setCellVertAlign;
    prot["asc_setCellTextWrap"] = prot.asc_setCellTextWrap;
    prot["asc_setCellTextShrink"] = prot.asc_setCellTextShrink;
    prot["asc_setCellTextColor"] = prot.asc_setCellTextColor;
    prot["asc_setCellBackgroundColor"] = prot.asc_setCellBackgroundColor;
    prot["asc_setCellBorders"] = prot.asc_setCellBorders;
    prot["asc_setCellFormat"] = prot.asc_setCellFormat;
    prot["asc_setCellAngle"] = prot.asc_setCellAngle;
    prot["asc_setCellStyle"] = prot.asc_setCellStyle;
    prot["asc_increaseCellDigitNumbers"] = prot.asc_increaseCellDigitNumbers;
    prot["asc_decreaseCellDigitNumbers"] = prot.asc_decreaseCellDigitNumbers;
    prot["asc_increaseFontSize"] = prot.asc_increaseFontSize;
    prot["asc_decreaseFontSize"] = prot.asc_decreaseFontSize;
    prot["asc_formatPainter"] = prot.asc_formatPainter;
    prot["asc_onMouseUp"] = prot.asc_onMouseUp;
    prot["asc_mapAscServerErrorToAscError"] = prot.asc_mapAscServerErrorToAscError;
    prot["asc_selectFunction"] = prot.asc_selectFunction;
    prot["asc_insertHyperlink"] = prot.asc_insertHyperlink;
    prot["asc_removeHyperlink"] = prot.asc_removeHyperlink;
    prot["asc_insertFormula"] = prot.asc_insertFormula;
    prot["asc_getFormulasInfo"] = prot.asc_getFormulasInfo;
    prot["asc_setFontRenderingMode"] = prot.asc_setFontRenderingMode;
    prot["asc_setSelectionDialogMode"] = prot.asc_setSelectionDialogMode;
    prot["asc_ChangeColorScheme"] = prot.asc_ChangeColorScheme;
    prot["asc_coAuthoringChatSendMessage"] = prot.asc_coAuthoringChatSendMessage;
    prot["asc_coAuthoringGetUsers"] = prot.asc_coAuthoringGetUsers;
    prot["asc_coAuthoringChatGetMessages"] = prot.asc_coAuthoringChatGetMessages;
    prot["asc_coAuthoringDisconnect"] = prot.asc_coAuthoringDisconnect;
    prot["asc_stopSaving"] = prot.asc_stopSaving;
    prot["asc_continueSaving"] = prot.asc_continueSaving;
    prot["asc_openNewDocument"] = prot.asc_openNewDocument;
    prot["asc_loadDocumentFromDisk"] = prot.asc_loadDocumentFromDisk;
    prot["asc_nativeOpenFile"] = prot.asc_nativeOpenFile;
    prot["asc_nativeCalculateFile"] = prot.asc_nativeCalculateFile;
    prot["asc_nativeApplyChanges"] = prot.asc_nativeApplyChanges;
    prot["asc_nativeApplyChanges2"] = prot.asc_nativeApplyChanges2;
    prot["asc_nativeGetFile"] = prot.asc_nativeGetFile;
    prot["asc_nativeGetFileData"] = prot.asc_nativeGetFileData;
    prot["asc_nativeCheckPdfRenderer"] = prot.asc_nativeCheckPdfRenderer;
    prot["asc_nativeCalculate"] = prot.asc_nativeCalculate;
    prot["asc_nativePrint"] = prot.asc_nativePrint;
    prot["asc_nativePrintPagesCount"] = prot.asc_nativePrintPagesCount;
})(jQuery, window);