/*
 * (c) Copyright Ascensio System SIA 2010-2014
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
 var ASC_DOCS_API_DEBUG = true;
var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";
var documentId = undefined;
var documentUserId = undefined;
var documentUrl = "null";
var documentTitle = "null";
var documentTitleWithoutExtention = "null";
var documentFormat = "null";
var documentVKey = null;
var documentOrigin = "";
var c_oSerFormat = {
    Version: 1,
    Signature: "PPTY"
};
function CErrorData() {
    this.Value = 0;
}
CErrorData.prototype.put_Value = function (v) {
    this.Value = v;
};
CErrorData.prototype.get_Value = function () {
    return this.Value;
};
function asc_docs_api(name) {
    this.HtmlElementName = name;
    this.WordControl = new CEditorPage(this);
    this.WordControl.Name = this.HtmlElementName;
    this.ThemeLoader = new CThemeLoader();
    this.ThemeLoader.Api = this;
    this.FontLoader = window.g_font_loader;
    this.ImageLoader = window.g_image_loader;
    this.ScriptLoader = window.g_script_loader;
    this.FontLoader.put_Api(this);
    this.ImageLoader.put_Api(this);
    this.FontLoader.SetStandartFonts();
    this.LoadedObject = null;
    this.DocumentType = 0;
    this.DocumentUrl = "";
    this.DocumentName = "";
    this.DocInfo = null;
    this.bNoSendComments = false;
    this.isApplyChangesOnOpen = false;
    this.isApplyChangesOnOpenEnabled = true;
    this.IsSupportEmptyPresentation = true;
    this.ShowParaMarks = false;
    this.isAddSpaceBetweenPrg = false;
    this.isPageBreakBefore = false;
    this.isKeepLinesTogether = false;
    this.isMobileVersion = false;
    this.isPaintFormat = false;
    this.isViewMode = false;
    this.isShowTableEmptyLine = true;
    this.bInit_word_control = false;
    this.isDocumentModify = false;
    this.isImageChangeUrl = false;
    this.isShapeImageChangeUrl = false;
    this.isSlideImageChangeUrl = false;
    this.isPasteFonts_Images = false;
    this.isLoadNoCutFonts = false;
    this.isUseEmbeddedCutFonts = ("true" == ASC_DOCS_API_USE_EMBEDDED_FONTS.toLowerCase());
    this.noCreatePoint = false;
    this.pasteCallback = null;
    this.pasteImageMap = null;
    this.EndActionLoadImages = 0;
    this.isSaveFonts_Images = false;
    this.saveImageMap = null;
    this.canSave = true;
    this.ServerIdWaitComplete = false;
    this.ServerImagesWaitComplete = false;
    this.ParcedDocument = false;
    this.isStartCoAuthoringOnEndLoad = false;
    this.DocumentOrientation = orientation_Portrait ? true : false;
    this.SelectedObjectsStack = new Array();
    this.OpenDocumentProgress = new CDocOpenProgress();
    this._lastConvertProgress = 0;
    this.User = undefined;
    this.CoAuthoringApi = new CDocsCoApi();
    this.isCoAuthoringEnable = true;
    this.CoAuthoringApi.isPowerPoint = true;
    this.autoSaveGap = 0;
    this.autoSaveTimeOutId = null;
    this.isAutoSave = false;
    this.autoSaveGapAsk = 5000;
    this.canSave = true;
    if (typeof ChartStyleManager !== "undefined") {
        this.chartStyleManager = new ChartStyleManager();
    } else {
        this.chartStyleManager = null;
    }
    if (typeof ChartPreviewManager !== "undefined") {
        this.chartPreviewManager = new ChartPreviewManager();
    } else {
        this.chartPreviewManager = null;
    }
    if (typeof asc_CChartTranslate !== "undefined") {
        this.chartTranslate = new asc_CChartTranslate();
    } else {
        this.chartTranslate = null;
    }
    this._gui_fonts = null;
    this._gui_editor_themes = null;
    this._gui_document_themes = null;
    this.tableStylesIdCounter = 0;
    g_bIsDocumentCopyPaste = false;
    this.TrackFile = null;
    var oThis = this;
    if (window.addEventListener) {
        window.addEventListener("message", function () {
            oThis.OnHandleMessage.apply(oThis, arguments);
        },
        false);
    }
    if ("undefined" != typeof(FileReader) && "undefined" != typeof(FormData)) {
        var element = document.getElementById(this.HtmlElementName);
        if (null != element) {
            element["ondragover"] = function (e) {
                e.preventDefault();
                if (CanDropFiles(e)) {
                    e.dataTransfer.dropEffect = "copy";
                } else {
                    e.dataTransfer.dropEffect = "none";
                }
                return false;
            };
            element["ondrop"] = function (e) {
                e.preventDefault();
                var files = e.dataTransfer.files;
                var nError = ValidateUploadImage(files);
                if (c_oAscServerError.NoError == nError) {
                    oThis.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                    var file = files[0];
                    var xhr = new XMLHttpRequest();
                    var fd = new FormData();
                    fd.append("file", file);
                    xhr.open("POST", g_sUploadServiceLocalUrl + "?key=" + documentId);
                    xhr.onreadystatechange = function () {
                        if (4 == this.readyState) {
                            if ((this.status == 200 || this.status == 1223)) {
                                var frameWindow = GetUploadIFrame();
                                var content = this.responseText;
                                frameWindow.document.open();
                                frameWindow.document.write(content);
                                frameWindow.document.close();
                            } else {
                                oThis.asc_fireCallback("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
                            }
                            oThis.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                        }
                    };
                    xhr.send(fd);
                } else {
                    oThis.asc_fireCallback("asc_onError", _mapAscServerErrorToAscError(nError), c_oAscError.Level.NoCritical);
                }
            };
        }
    }
    if (window.editor == undefined) {
        window.editor = this;
        window["editor"] = window.editor;
    }
}
function CChatMessage(user, message) {
    this.UserId = (undefined != user_id) ? user_id : null;
    this.Message = (undefined != message) ? message : null;
}
CChatMessage.prototype.get_UserId = function () {
    return this.UserId;
};
CChatMessage.prototype.get_Message = function () {
    return this.Message;
};
asc_docs_api.prototype._coAuthoringInit = function () {
    if (!this.CoAuthoringApi) {
        g_oIdCounter.Set_Load(false);
        this.asyncServerIdEndLoaded();
        return;
    }
    if (undefined !== window["g_cAscCoAuthoringUrl"]) {
        window.g_cAscCoAuthoringUrl = window["g_cAscCoAuthoringUrl"];
    }
    if (undefined !== window.g_cAscCoAuthoringUrl) {
        if (!this.isCoAuthoringEnable) {
            window.g_cAscCoAuthoringUrl = "";
        }
        this._coAuthoringSetServerUrl(window.g_cAscCoAuthoringUrl);
    }
    if (null == this.User || null == this.User.asc_getId()) {
        var asc_user = window["Asc"].asc_CUser;
        this.User = new asc_user();
        this.User.asc_setId("Unknown");
        this.User.asc_setUserName("Unknown");
        this._coAuthoringSetServerUrl("");
    }
    var t = this;
    this.CoAuthoringApi.onParticipantsChanged = function (e) {
        t.asc_fireCallback("asc_onParticipantsChanged", e);
    };
    this.CoAuthoringApi.onAuthParticipantsChanged = function (e) {
        t.asc_fireCallback("asc_onAuthParticipantsChanged", e);
    };
    this.CoAuthoringApi.onMessage = function (e) {
        t.asc_fireCallback("asc_onCoAuthoringChatReceiveMessage", e);
    };
    this.CoAuthoringApi.onConnectionStateChanged = function (e) {
        t.asc_fireCallback("asc_onConnectionStateChanged", e);
    };
    this.CoAuthoringApi.onLocksAcquired = function (e) {
        if (2 != e["state"]) {
            var block_value = e["blockValue"];
            var classes = [];
            switch (block_value["type"]) {
            case c_oAscLockTypeElemPresentation.Object:
                classes.push(block_value["objId"]);
                break;
            case c_oAscLockTypeElemPresentation.Slide:
                classes.push(block_value["val"]);
                break;
            case c_oAscLockTypeElemPresentation.Presentation:
                break;
            }
            var Id = e["block"];
            for (var i = 0; i < classes.length; ++i) {
                var Class = g_oTableId.Get_ById(classes[i]);
                if (null != Class) {
                    var Lock = Class.Lock;
                    var OldType = Class.Lock.Get_Type();
                    if (locktype_Other2 === OldType || locktype_Other3 === OldType) {
                        Lock.Set_Type(locktype_Other3, true);
                    } else {
                        Lock.Set_Type(locktype_Other, true);
                    }
                    if (Class instanceof PropLocker) {
                        var object = g_oTableId.Get_ById(Class.objectId);
                        if (object instanceof Slide && Class === object.deleteLock) {
                            editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(object.num);
                        }
                    }
                    Lock.Set_UserId(e["user"]);
                    if (Class instanceof PropLocker) {
                        var object = g_oTableId.Get_ById(Class.objectId);
                        if (object instanceof CPresentation) {
                            if (Class === editor.WordControl.m_oLogicDocument.themeLock) {
                                editor.asc_fireCallback("asc_onLockDocumentTheme");
                            } else {
                                if (Class === editor.WordControl.m_oLogicDocument.schemeLock) {
                                    editor.asc_fireCallback("asc_onLockDocumentSchema");
                                } else {
                                    if (Class === editor.WordControl.m_oLogicDocument.slideSizeLock) {
                                        editor.asc_fireCallback("asc_onLockDocumentProps");
                                    }
                                }
                            }
                        }
                    }
                    if (Class instanceof CComment) {
                        editor.sync_LockComment(Class.Get_Id(), e["user"]);
                    }
                    editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
                } else {
                    if (classes[i].indexOf("new_object") > -1 && block_value["type"] === c_oAscLockTypeElemPresentation.Object) {
                        var slide_id = block_value["slideId"];
                        var delete_lock = g_oTableId.Get_ById(slide_id);
                        if (isRealObject(delete_lock)) {
                            var Lock = delete_lock.Lock;
                            var OldType = Lock.Get_Type();
                            if (locktype_Other2 === OldType || locktype_Other3 === OldType) {
                                Lock.Set_Type(locktype_Other3, true);
                            } else {
                                Lock.Set_Type(locktype_Other, true);
                            }
                            editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(g_oTableId.Get_ById(delete_lock.objectId).num);
                        } else {
                            CollaborativeEditing.Add_NeedLock(slide_id, e["user"]);
                        }
                    } else {
                        CollaborativeEditing.Add_NeedLock(classes[i], e["user"]);
                    }
                }
            }
        }
    };
    this.CoAuthoringApi.onLocksReleased = function (e, bChanges) {
        var Id;
        var block_value = e["block"];
        var classes = [];
        switch (block_value["type"]) {
        case c_oAscLockTypeElemPresentation.Object:
            classes.push(block_value["objId"]);
            break;
        case c_oAscLockTypeElemPresentation.Slide:
            classes.push(block_value["val"]);
            break;
        case c_oAscLockTypeElemPresentation.Presentation:
            break;
        }
        for (var i = 0; i < classes.length; ++i) {
            Id = classes[i];
            var Class = g_oTableId.Get_ById(Id);
            if (null != Class) {
                var Lock = Class.Lock;
                if ("undefined" != typeof(Lock)) {
                    var CurType = Lock.Get_Type();
                    var NewType = locktype_None;
                    if (CurType === locktype_Other) {
                        if (true != bChanges) {
                            NewType = locktype_None;
                        } else {
                            NewType = locktype_Other2;
                            CollaborativeEditing.Add_Unlock(Class);
                        }
                    } else {
                        if (CurType === locktype_Mine) {
                            NewType = locktype_Mine;
                        } else {
                            if (CurType === locktype_Other2 || CurType === locktype_Other3) {
                                NewType = locktype_Other2;
                            }
                        }
                    }
                    Lock.Set_Type(NewType, true);
                    if (Class instanceof PropLocker) {
                        var object = g_oTableId.Get_ById(Class.objectId);
                        if (object instanceof Slide && Class === object.deleteLock) {
                            if (NewType !== locktype_Mine && NewType !== locktype_None) {
                                editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(Class.num);
                            } else {
                                editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);
                            }
                        }
                        if (object instanceof CPresentation) {
                            if (Class === object.themeLock) {
                                if (NewType !== locktype_Mine && NewType !== locktype_None) {
                                    editor.asc_fireCallback("asc_onLockDocumentTheme");
                                } else {
                                    editor.asc_fireCallback("asc_onUnLockDocumentTheme");
                                }
                            }
                            if (Class === object.slideSizeLock) {
                                if (NewType !== locktype_Mine && NewType !== locktype_None) {
                                    editor.asc_fireCallback("asc_onLockDocumentProps");
                                } else {
                                    editor.asc_fireCallback("asc_onUnLockDocumentProps");
                                }
                            }
                        }
                    }
                }
            } else {
                CollaborativeEditing.Remove_NeedLock(Id);
            }
        }
    };
    this.CoAuthoringApi.onSaveChanges = function (e, bSendEvent) {
        var Count = e.length;
        for (var Index = 0; Index < Count; Index++) {
            var Changes = new CCollaborativeChanges();
            Changes.Set_Id(e[Index].m_sId);
            Changes.Set_Data(e[Index].m_pData);
            CollaborativeEditing.Add_Changes(Changes);
        }
        if (Count > 0 && false != bSendEvent && t.bInit_word_control) {
            t.sync_CollaborativeChanges();
        }
    };
    this.CoAuthoringApi.onFirstLoadChanges = function (e) {
        t.CoAuthoringApi.onSaveChanges(e, false);
        t.asyncServerIdEndLoaded();
    };
    this.CoAuthoringApi.onSetIndexUser = function (e) {
        g_oIdCounter.Set_UserId("" + e);
    };
    this.CoAuthoringApi.onStartCoAuthoring = function (isStartEvent) {
        if (t.ParcedDocument) {
            CollaborativeEditing.Start_CollaborationEditing();
            editor.WordControl.m_oLogicDocument.DrawingDocument.Start_CollaborationEditing();
            if (true != History.Is_Clear()) {
                t.asc_Save(true);
            }
        } else {
            t.isStartCoAuthoringOnEndLoad = true;
        }
    };
    this.CoAuthoringApi.onDisconnect = function (e, isDisconnectAtAll, isCloseCoAuthoring) {
        if (0 === t.CoAuthoringApi.get_state()) {
            t.asyncServerIdEndLoaded();
        }
        if (isDisconnectAtAll) {
            t.asc_fireCallback("asc_onСoAuthoringDisconnect");
            t.SetViewMode(true, true);
            if (!isCloseCoAuthoring) {
                t.sync_ErrorCallback(c_oAscError.ID.CoAuthoringDisconnect, c_oAscError.Level.NoCritical);
            }
        }
    };
    this.CoAuthoringApi.init(editor.User, documentId, "fghhfgsjdgfjs", window.location.host, g_sMainServiceLocalUrl, function () {},
    c_oEditorId.Presentation);
};
asc_docs_api.prototype.pre_Save = function (_images) {
    this.isSaveFonts_Images = true;
    this.saveImageMap = _images;
    this.WordControl.m_oDrawingDocument.CheckFontNeeds();
    this.FontLoader.LoadDocumentFonts2(this.WordControl.m_oLogicDocument.Fonts);
};
asc_docs_api.prototype.sync_CollaborativeChanges = function () {
    this.asc_fireCallback("asc_onCollaborativeChanges");
};
asc_docs_api.prototype._coAuthoringSetServerUrl = function (url) {
    if (!this.CoAuthoringApi) {
        return;
    }
    this.CoAuthoringApi.set_url(url);
};
asc_docs_api.prototype.asc_coAuthoringDisconnect = function () {
    this.SetViewMode(true);
};
asc_docs_api.prototype.asc_coAuthoringChatSendMessage = function (message) {
    if (!this.CoAuthoringApi) {
        return;
    }
    this.CoAuthoringApi.sendMessage(message);
};
asc_docs_api.prototype.asc_coAuthoringChatGetMessages = function () {
    if (!this.CoAuthoringApi) {
        return;
    }
    this.CoAuthoringApi.getMessages();
};
asc_docs_api.prototype.asc_coAuthoringGetUsers = function () {
    if (!this.CoAuthoringApi) {
        return;
    }
    this.CoAuthoringApi.getUsers();
};
asc_docs_api.prototype.autoSaveInit = function (autoSaveGap) {
    if (null !== this.autoSaveTimeOutId) {
        clearTimeout(this.autoSaveTimeOutId);
    }
    if (autoSaveGap || this.autoSaveGap) {
        var t = this;
        this.autoSaveTimeOutId = setTimeout(function () {
            t.autoSaveTimeOutId = null;
            if (t.isViewMode) {
                CollaborativeEditing.Apply_Changes();
                t.autoSaveInit();
            } else {
                if (t.isDocumentModified()) {
                    t.asc_Save(true);
                } else {
                    t.autoSaveInit();
                }
            }
        },
        (autoSaveGap || this.autoSaveGap));
    }
};
asc_docs_api.prototype.asyncServerIdStartLoaded = function () {
    this._coAuthoringInit();
};
asc_docs_api.prototype.asyncServerIdEndLoaded = function () {
    this.ServerIdWaitComplete = true;
    if (true == this.ServerImagesWaitComplete) {
        this.OpenDocumentEndCallback();
    }
};
asc_docs_api.prototype.syncCollaborativeChanges = function () {
    this.asc_fireCallback("asc_onCollaborativeChanges");
};
asc_docs_api.prototype.SetCollaborativeMarksShowType = function (Type) {
    this.CollaborativeMarksShowType = Type;
};
asc_docs_api.prototype.GetCollaborativeMarksShowType = function (Type) {
    return this.CollaborativeMarksShowType;
};
asc_docs_api.prototype.Clear_CollaborativeMarks = function () {
    CollaborativeEditing.Clear_CollaborativeMarks(true);
};
asc_docs_api.prototype.SetUnchangedDocument = function () {
    History.Reset_SavedIndex();
    this.isDocumentModify = false;
    this.asc_fireCallback("asc_onDocumentModifiedChanged");
};
asc_docs_api.prototype.isDocumentModified = function () {
    if (!this.canSave) {
        return true;
    }
    return this.isDocumentModify;
};
asc_docs_api.prototype.sync_BeginCatchSelectedElements = function () {
    if (0 != this.SelectedObjectsStack.length) {
        this.SelectedObjectsStack.splice(0, this.SelectedObjectsStack.length);
    }
};
asc_docs_api.prototype.sync_EndCatchSelectedElements = function (options) {
    if (!this.chartStyleManager.isReady() || !this.chartPreviewManager.isReady()) {
        for (var i = 0; i < this.SelectedObjectsStack.length; i++) {
            if (this.SelectedObjectsStack[i].Value.ChartProperties) {
                this.chartStyleManager.init(options);
                this.chartPreviewManager.init(options);
                this.asc_fireCallback("asc_onUpdateChartStyles");
                break;
            }
        }
    }
    this.asc_fireCallback("asc_onFocusObject", this.SelectedObjectsStack);
};
asc_docs_api.prototype.getSelectedElements = function () {
    return this.SelectedObjectsStack;
};
asc_docs_api.prototype.sync_ChangeLastSelectedElement = function (type, obj) {
    var oUnkTypeObj = null;
    switch (type) {
    case c_oAscTypeSelectElement.Paragraph:
        oUnkTypeObj = new CParagraphProp(obj);
        break;
    case c_oAscTypeSelectElement.Image:
        oUnkTypeObj = new CImgProperty(obj);
        break;
    case c_oAscTypeSelectElement.Table:
        oUnkTypeObj = new CTableProp(obj);
        break;
    case c_oAscTypeSelectElement.Shape:
        oUnkTypeObj = obj;
        break;
    }
    var _i = this.SelectedObjectsStack.length - 1;
    var bIsFound = false;
    while (_i >= 0) {
        if (this.SelectedObjectsStack[_i].Type == type) {
            this.SelectedObjectsStack[_i].Value = oUnkTypeObj;
            bIsFound = true;
            break;
        }
        _i--;
    }
    if (!bIsFound) {
        this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(type, oUnkTypeObj);
    }
};
asc_docs_api.prototype.Init = function () {
    this.WordControl.Init();
};
asc_docs_api.prototype.asc_getEditorPermissions = function () {
    if (this.DocInfo && this.DocInfo.get_Id()) {
        var rData = {
            "c": "getsettings",
            "id": this.DocInfo.get_Id(),
            "userid": this.DocInfo.get_UserId(),
            "format": this.DocInfo.get_Format(),
            "vkey": this.DocInfo.get_VKey(),
            "editorid": c_oEditorId.Presentation
        };
        sendCommand(this, this.asc_getEditorPermissionsCallback, rData);
    } else {
        var asc_CAscEditorPermissions = window["Asc"].asc_CAscEditorPermissions;
        editor.asc_fireCallback("asc_onGetEditorPermissions", new asc_CAscEditorPermissions());
    }
};
asc_docs_api.prototype.asc_getLicense = function () {
    var t = this;
    var rdata = {
        "c": "getlicense"
    };
    sendCommand(this, function (response) {
        t._onGetLicense(response);
    },
    rdata);
};
asc_docs_api.prototype.asc_getEditorPermissionsCallback = function (incomeObject) {
    if (null != incomeObject && "getsettings" == incomeObject["type"]) {
        var oSettings = JSON.parse(incomeObject["data"]);
        window.g_cAscCoAuthoringUrl = oSettings["g_cAscCoAuthoringUrl"];
        window.g_cAscSpellCheckUrl = oSettings["g_cAscSpellCheckUrl"];
        var asc_CAscEditorPermissions = window["Asc"].asc_CAscEditorPermissions;
        var oEditorPermissions = new asc_CAscEditorPermissions(oSettings);
        editor.asc_fireCallback("asc_onGetEditorPermissions", oEditorPermissions);
        if (undefined != oSettings["trackingInfo"] && null != oSettings["trackingInfo"]) {
            var asc_CTrackFile = window["Asc"].CTrackFile;
            editor.TrackFile = new asc_CTrackFile(oSettings["trackingInfo"]);
            editor.TrackFile.setDocId(editor.DocInfo.get_Id());
            editor.TrackFile.setUserId(editor.DocInfo.get_UserId());
            editor.TrackFile.setTrackFunc(sendTrack);
            var _isDocumentModified = function () {
                return editor.isDocumentModified();
            };
            editor.TrackFile.setIsDocumentModifiedFunc(_isDocumentModified);
            if (undefined != oSettings["TrackingInterval"] && null != oSettings["TrackingInterval"]) {
                editor.TrackFile.setInterval(oSettings["TrackingInterval"]);
            }
            editor.TrackFile.Start();
        }
    }
};
asc_docs_api.prototype._onGetLicense = function (response) {
    if (null != response && "getlicense" == response.type) {
        var oSettings = JSON.parse(response.data);
        var oLicense = (null != oSettings) ? new window["Asc"].asc_CAscLicense(oSettings) : null;
        this.asc_fireCallback("asc_onGetLicense", oLicense);
    }
};
asc_docs_api.prototype.asc_setDocInfo = function (c_DocInfo) {
    if (c_DocInfo) {
        this.DocInfo = c_DocInfo;
    }
};
asc_docs_api.prototype.asc_setLocale = function (val) {};
asc_docs_api.prototype.LoadDocument = function (c_DocInfo) {
    this.asc_setDocInfo(c_DocInfo);
    this.WordControl.m_oDrawingDocument.m_bIsOpeningDocument = true;
    if (this.DocInfo) {
        documentId = this.DocInfo.get_Id();
        documentUserId = this.DocInfo.get_UserId();
        documentUrl = this.DocInfo.get_Url();
        documentTitle = this.DocInfo.get_Title();
        documentFormat = this.DocInfo.get_Format();
        var nIndex = -1;
        if (documentTitle) {
            nIndex = documentTitle.lastIndexOf(".");
        }
        if (-1 != nIndex) {
            documentTitleWithoutExtention = documentTitle.substring(0, nIndex);
        } else {
            documentTitleWithoutExtention = documentTitle;
        }
        documentVKey = this.DocInfo.get_VKey();
        var sProtocol = window.location.protocol;
        var sHost = window.location.host;
        documentOrigin = "";
        if (sProtocol && "" != sProtocol) {
            documentOrigin = sProtocol + "//" + sHost;
        } else {
            documentOrigin = sHost;
        }
        var asc_user = window["Asc"].asc_CUser;
        this.User = new asc_user();
        this.User.asc_setId(this.DocInfo.get_UserId());
        this.User.asc_setUserName(this.DocInfo.get_UserName());
    }
    this.DocumentName = documentTitle;
    var oThis = this;
    if (this.DocInfo.get_OfflineApp() === true) {
        this.OfflineAppDocumentStartLoad();
        return;
    }
    if (documentId) {
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        var rData = {
            "id": documentId,
            "userid": documentUserId,
            "format": documentFormat,
            "vkey": documentVKey,
            "editorid": c_oEditorId.Presentation,
            "c": "open",
            "url": documentUrl,
            "title": documentTitle,
            "embeddedfonts": this.isUseEmbeddedCutFonts
        };
        sendCommand(oThis, function () {},
        rData);
        this.sync_zoomChangeCallback(this.WordControl.m_nZoomValue, this.WordControl.m_nZoomType);
    } else {
        documentUrl = "document/";
        this.DocInfo.put_OfflineApp(true);
        documentId = "safsasdasdfsdfsdfsdasdasdasdfsdf3";
        this.OfflineAppDocumentStartLoad();
        this.sync_zoomChangeCallback(this.WordControl.m_nZoomValue, this.WordControl.m_nZoomType);
    }
};
asc_docs_api.prototype.SetFontsPath = function (path) {
    this.FontLoader.fontFilesPath = path;
};
asc_docs_api.prototype.SetThemesPath = function (path) {
    this.ThemeLoader.ThemesUrl = path;
};
asc_docs_api.prototype.CreateCSS = function () {
    var _head = document.getElementsByTagName("head")[0];
    var style0 = document.createElement("style");
    style0.type = "text/css";
    style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
    _head.appendChild(style0);
    var style1 = document.createElement("style");
    style1.type = "text/css";
    style1.innerHTML = ".buttonTabs {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAA5CAYAAADUZxCcAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAUVJREFUWEftlr9OhEAQhwex4i0srXwWXsCERhsTKwoaCLWViY2WvgC8ipXlvQOE/wHMbGa5nHe77J57ykW+ZLLshPyyswlfsNI0HcEQF7QawWjYNObH54Y1juHm+oqtO2EPd7esqcPL2/sUttw7O9OwMAwhiiLazSMNK4qClSrSsLIsWakye7Kqqmg3zyWtB2maBmzbBs/zwHGcqeI4pjd2kZ6sbVvo+x6GYZhqHMWSWe7ndBprmMDomGdwZ6tplfm7MDRvEAS020crrOs6qOuadvtohWGQzLxaYWhdmXmlpsU7QkGicXnQ0WPiHWEQjsaDsCdiNa0+RsdcbtjptO0/3rOmDk/Pr6u2f4BSmO/7rOb4/ZPNSZGjFJbnOWRZRjsxQm27rktPW7BnWRb7r02ShLpbhCfjzv9eXOGHWO7n9C+0DfAFUOr1fzFrfLcAAAAASUVORK5CYII=);background-position: 0px 0px;background-repeat: no-repeat;}";
    _head.appendChild(style1);
    var style2 = document.createElement("style");
    style2.type = "text/css";
    style2.innerHTML = ".buttonRuler {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAYAAAAYX/pXAAAABGdBTUEAALGPC/xhBQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjMxN4N3hgAAAXlJREFUSEullk2KhDAQhWdu2iIqLlzYCxcKvWhRdOu5vErfQMjwhArqK3tSKjzyV34ppfLI7zRN7ufOA8CyLJe0br4FPB4PJ4qiyEHyaJsQII5jd1QwIEkSB6VpupMAMZ9lmV9DRrsM8jx3n8/HoRVhrAnrBCiKwgdv+xoA6wQoy3K32/P5pN1lDi0BqqravXAcIxOZQ0uAuq7V75VPaJrGryOWAK/X6xSANRGA6BPg/X47TW3brvPHlgDHSpMC6rrO9X3vhbHEUiVuIQBgPAyDG8fRt+gHAUIOmM8AnataT+MdrYCzmv9v3n+CBGp+8A1CAM0PggFWPwB4l4HVDwhg9QMCWP2AAFY/IIDVDwhg9QMCWP2AAGcFo/mBxFIlahDND0yAoFK+fZxvA+Z5dlfkf6K8rPnBNzABND8IBpz5Ae4Eci/Y3g8A3mVg9QMCWP2AAFY/IIDVDwhg9QMCWP2AAFY/IMBZwWh+ILFUiRpE8wMTIKiU7xznP/aJOAk3NTURAAAAAElFTkSuQmCC);background-position: 0px 0px;background-repeat: no-repeat;}";
    _head.appendChild(style2);
    var style3 = document.createElement("style");
    style3.type = "text/css";
    style3.innerHTML = ".buttonPrevPage {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgCAYAAAAU0fKgAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjMxN4N3hgAAAUlJREFUWEftWEEKwjAQTMVX9Su9ivgDEaGUgojXnES89iv9QB+kNLIgcXa3sqIlxlOQnTGz2UwGi2EYbs7wWRiwAZo6Qd20aovYHhBYI4EEMUgiKaQ5GIFtU4syZi5BPYI/mMQpPSi89yY/CARVVU35sZearuuS94PVeqP2hr1MBNZIIEEMkkiWaI/Xyzl8PQJpzWn5vYQ8ic6Zr7P5dQ47KMtSnXlU0Pd98n5wOJ7U3rCnQGCNBBLEIIkE+sF+tw1bH4G0ftsPviYhT+IH/EDMieoc55AVWgSbiNI5F7rhdY6LpcTOGgqBtLifqoQpI0w15rcxAQJzwMgpzTn4uKJ0zoVuOEhxsZTY2UkkkBb3VQkkZ74SxNuo6U/knyzzdTZbWk5pjB+gdM6FbngKcbGU2NljJJAW96EfPEug9XwliKOs6c9+8EhJd/Clu/4I7OgqAAAAAElFTkSuQmCC);background-position: 0px 0px;background-repeat: no-repeat;}";
    _head.appendChild(style3);
    var style4 = document.createElement("style");
    style4.type = "text/css";
    style4.innerHTML = ".buttonNextPage {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgCAYAAAAU0fKgAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjMxN4N3hgAAAUlJREFUWEftWEEKwjAQTMVX9Su9ivgDEaGUgojXnES89iv9QB+kNLIgcXa3sqIlxlOQnTGz2UwGi2EYbs7wWRiwAZo6Qd20aovYHhBYI4EEMUgiKaQ5GIFtU4syZi5BPYI/mMQpPSi89yY/CARVVU35sZearuuS94PVeqP2hr1MBNZIIEEMkkiWaI/Xyzl8PQJpzWn5vYQ8ic6Zr7P5dQ47KMtSnXlU0Pd98n5wOJ7U3rCnQGCNBBLEIIkE+sF+tw1bH4G0ftsPviYhT+IH/EDMieoc55AVWgSbiNI5F7rhdY6LpcTOGgqBtLifqoQpI0w15rcxAQJzwMgpzTn4uKJ0zoVuOEhxsZTY2UkkkBb3VQkkZ74SxNuo6U/knyzzdTZbWk5pjB+gdM6FbngKcbGU2NljJJAW96EfPEug9XwliKOs6c9+8EhJd/Clu/4I7OgqAAAAAElFTkSuQmCC);background-position: 0px -48px;background-repeat: no-repeat;}";
    _head.appendChild(style4);
};
asc_docs_api.prototype.CreateComponents = function () {
    this.CreateCSS();
    var element = document.getElementById(this.HtmlElementName);
    if (element != null) {
        element.innerHTML = '<div id="id_panel_thumbnails" class="block_elem" style="background-color:#B0B0B0;border-right-width: 1px;border-right-color: #787878; border-right-style: solid;">		                            <canvas id="id_thumbnails_background" class="block_elem" style="background-color:#EBEBEB;z-index:1"></canvas>		                            <canvas id="id_thumbnails" class="block_elem" style="z-index:2"></canvas>		                            <div id="id_vertical_scroll_thmbnl" style="left:0;top:0;width:16px;overflow:hidden;position:absolute;">									    <div id="panel_right_scroll_thmbnl" class="block_elem" style="left:0;top:0;width:16px;height:6000px;"></div>									</div>		                        </div>                            <div id="id_main" class="block_elem" style="-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:#B0B0B0;overflow:hidden;border-left-width: 1px;border-left-color: #787878; border-left-style: solid;border-bottom-width: 1px;border-bottom-color: #787878; border-bottom-style: solid;" UNSELECTABLE="on">								<div id="id_panel_left" class="block_elem">									<div id="id_buttonTabs" class="block_elem buttonTabs"></div>									<canvas id="id_vert_ruler" class="block_elem"></canvas>								</div>                                <div id="id_panel_top" class="block_elem">									<canvas id="id_hor_ruler" class="block_elem"></canvas>                                </div>                                <div id="id_main_view" class="block_elem" style="overflow:hidden">                                    <canvas id="id_viewer" class="block_elem" style="background-color:#B0B0B0;z-index:1"></canvas>                                    <canvas id="id_viewer_overlay" class="block_elem" style="z-index:2"></canvas>                                    <canvas id="id_target_cursor" class="block_elem" width="1" height="1" style="width:2px;height:13px;display:none;z-index:3;"></canvas>                                </div>							    <div id="id_panel_right" class="block_elem" style="margin-right:1px;background-color:#B0B0B0;">							        <div id="id_buttonRulers" class="block_elem buttonRuler"></div>								    <div id="id_vertical_scroll" style="left:0;top:0;width:16px;overflow:hidden;position:absolute;">									    <div id="panel_right_scroll" class="block_elem" style="left:0;top:0;width:16px;height:6000px;"></div>								    </div>								    <div id="id_buttonPrevPage" class="block_elem buttonPrevPage"></div>								    <div id="id_buttonNextPage" class="block_elem buttonNextPage"></div>                                </div>                                <div id="id_horscrollpanel" class="block_elem" style="margin-bottom:1px;background-color:#B0B0B0;">                                    <div id="id_horizontal_scroll" style="left:0;top:0;height:16px;overflow:hidden;position:absolute;width:100%;">                                        <div id="panel_hor_scroll" class="block_elem" style="left:0;top:0;width:6000px;height:16px;"></div>                                    </div>                                </div>                            </div>                            <div id="id_panel_notes" class="block_elem" style="background-color:#FFFFFF;border-left-width: 1px;border-left-color: #787878; border-left-style: solid;border-top-width: 1px;border-top-color: #787878; border-top-style: solid;">                                <canvas id="id_notes" class="block_elem" style="background-color:#FFFFFF;z-index:1"></canvas>                                <div id="id_vertical_scroll_notes" style="left:0;top:0;width:16px;overflow:hidden;position:absolute;">                                    <div id="panel_right_scroll_notes" class="block_elem" style="left:0;top:0;width:16px;height:6000px;"></div>                                </div>                            </div>';
    }
};
asc_docs_api.prototype.InitEditor = function () {
    this.WordControl.m_oLogicDocument = new CPresentation(this.WordControl.m_oDrawingDocument);
    this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
};
asc_docs_api.prototype.SetInterfaceDrawImagePlaceShape = function (div_id) {
    this.WordControl.m_oDrawingDocument.InitGuiCanvasShape(div_id);
};
asc_docs_api.prototype.SetInterfaceDrawImagePlaceSlide = function (div_id) {
    this.WordControl.m_oDrawingDocument.InitGuiCanvasSlide(div_id);
};
asc_docs_api.prototype.SetInterfaceDrawImagePlace = function () {};
asc_docs_api.prototype.OpenDocument2 = function (url, gObject) {
    this.InitEditor();
    this.DocumentUrl = url;
    this.DocumentType = 2;
    var _loader = new BinaryPPTYLoader();
    _loader.Api = this;
    _loader.Load(gObject, this.WordControl.m_oLogicDocument);
    this.LoadedObject = 1;
    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
    this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
    this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);
    this.ParcedDocument = true;
    g_oIdCounter.Set_Load(false);
    if (this.isStartCoAuthoringOnEndLoad) {
        this.CoAuthoringApi.onStartCoAuthoring(true);
        this.isStartCoAuthoringOnEndLoad = false;
    }
    if (this.isMobileVersion) {
        window.USER_AGENT_SAFARI_MACOS = false;
        PASTE_ELEMENT_ID = "wrd_pastebin";
        ELEMENT_DISPAY_STYLE = "none";
    }
    if (window.USER_AGENT_SAFARI_MACOS) {
        setInterval(SafariIntervalFocus, 10);
    }
};
asc_docs_api.prototype.get_DocumentName = function () {
    return this.DocumentName;
};
asc_docs_api.prototype.OfflineAppDocumentStartLoad = function () {
    var scriptElem = document.createElement("script");
    if (scriptElem.readyState) {
        scriptElem.onreadystatechange = function () {
            if (this.readyState == "complete" || this.readyState == "loaded") {
                scriptElem.onreadystatechange = null;
                setTimeout(editor.OfflineAppDocumentEndLoad, 0);
            }
        };
    }
    scriptElem.onload = scriptElem.onerror = this.OfflineAppDocumentEndLoad;
    scriptElem.setAttribute("src", documentUrl + "editor.js");
    scriptElem.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
};
asc_docs_api.prototype.OfflineAppDocumentEndLoad = function () {
    if (undefined == window["editor_bin"]) {
        return;
    }
    editor.OpenDocument2(documentUrl, window["editor_bin"]);
    editor.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
};
var _callbacks = {};
asc_docs_api.prototype.asc_registerCallback = function (name, callback) {
    if (!_callbacks.hasOwnProperty(name)) {
        _callbacks[name] = [];
    }
    _callbacks[name].push(callback);
};
asc_docs_api.prototype.asc_unregisterCallback = function (name, callback) {
    if (_callbacks.hasOwnProperty(name)) {
        for (var i = _callbacks[name].length - 1; i >= 0; --i) {
            if (_callbacks[name][i] == callback) {
                _callbacks[name].splice(i, 1);
            }
        }
    }
    _callbacks[name] = [];
    _callbacks[name].push(callback);
};
asc_docs_api.prototype.asc_fireCallback = function (name) {
    if (_callbacks.hasOwnProperty(name)) {
        for (var i = 0; i < _callbacks[name].length; ++i) {
            _callbacks[name][i].apply(this || window, Array.prototype.slice.call(arguments, 1));
        }
        return true;
    }
    return false;
};
asc_docs_api.prototype.asc_checkNeedCallback = function (name) {
    if (_callbacks.hasOwnProperty(name)) {
        return true;
    }
    return false;
};
asc_docs_api.prototype.get_TextProps = function () {
    var Doc = this.WordControl.m_oLogicDocument;
    var ParaPr = Doc.Get_Paragraph_ParaPr();
    var TextPr = Doc.Get_Paragraph_TextPr();
    return new CParagraphAndTextProp(ParaPr, TextPr);
};
asc_docs_api.prototype.get_PropertyEditorShapes = function () {
    var ret = [g_oAutoShapesGroups, g_oAutoShapesTypes];
    return ret;
};
asc_docs_api.prototype.get_PropertyEditorFonts = function () {
    return this._gui_fonts;
};
asc_docs_api.prototype.get_PropertyStandartTextures = function () {
    var _count = g_oUserTexturePresets.length;
    var arr = new Array(_count);
    for (var i = 0; i < _count; ++i) {
        arr[i] = new CAscTexture();
        arr[i].Id = i;
        arr[i].Image = g_oUserTexturePresets[i];
    }
    return arr;
};
asc_docs_api.prototype.get_PropertyEditorThemes = function () {
    var ret = [this._gui_editor_themes, this._gui_document_themes];
    return ret;
};
asc_docs_api.prototype.get_ContentCount = function () {
    return this.WordControl.m_oLogicDocument.Content.length;
};
asc_docs_api.prototype.select_Element = function (Index) {
    var Document = this.WordControl.m_oLogicDocument;
    if (true === Document.Selection.Use) {
        Document.Selection_Remove();
    }
    Document.DrawingDocument.SelectEnabled(true);
    Document.DrawingDocument.TargetEnd();
    Document.Selection.Use = true;
    Document.Selection.Start = false;
    Document.Selection.Flag = selectionflag_Common;
    Document.Selection.StartPos = Index;
    Document.Selection.EndPos = Index;
    Document.Content[Index].Selection.Use = true;
    Document.Content[Index].Selection.StartPos = Document.Content[Index].Internal_GetStartPos();
    Document.Content[Index].Selection.EndPos = Document.Content[Index].Content.length - 1;
    Document.Selection_Draw();
};
asc_docs_api.prototype.UpdateTextPr = function (TextPr) {
    if ("undefined" != typeof(TextPr)) {
        var oTextPrMap = {
            Bold: function (oThis, v) {
                oThis.sync_BoldCallBack(v);
            },
            Italic: function (oThis, v) {
                oThis.sync_ItalicCallBack(v);
            },
            Underline: function (oThis, v) {
                oThis.sync_UnderlineCallBack(v);
            },
            Strikeout: function (oThis, v) {
                oThis.sync_StrikeoutCallBack(v);
            },
            FontSize: function (oThis, v) {
                oThis.sync_TextPrFontSizeCallBack(v);
            },
            FontFamily: function (oThis, v) {
                oThis.sync_TextPrFontFamilyCallBack(v);
            },
            VertAlign: function (oThis, v) {
                oThis.sync_VerticalAlign(v);
            },
            Spacing: function (oThis, v) {
                oThis.sync_TextSpacing(v);
            },
            DStrikeout: function (oThis, v) {
                oThis.sync_TextDStrikeout(v);
            },
            Caps: function (oThis, v) {
                oThis.sync_TextCaps(v);
            },
            SmallCaps: function (oThis, v) {
                oThis.sync_TextSmallCaps(v);
            },
            Position: function (oThis, v) {
                oThis.sync_TextPosition(v);
            },
            Lang: function (oThis, v) {
                oThis.sync_TextLangCallBack(v);
            }
        };
        if (TextPr.Color !== undefined) {
            this.WordControl.m_oDrawingDocument.TargetCursorColor.R = TextPr.Color.r;
            this.WordControl.m_oDrawingDocument.TargetCursorColor.G = TextPr.Color.g;
            this.WordControl.m_oDrawingDocument.TargetCursorColor.B = TextPr.Color.b;
        }
        if (TextPr.Bold === undefined) {
            TextPr.Bold = false;
        }
        if (TextPr.Italic === undefined) {
            TextPr.Italic = false;
        }
        if (TextPr.Underline === undefined) {
            TextPr.Underline = false;
        }
        if (TextPr.Strikeout === undefined) {
            TextPr.Strikeout = false;
        }
        if (TextPr.FontFamily === undefined) {
            TextPr.FontFamily = {
                Index: 0,
                Name: ""
            };
        }
        if (TextPr.FontSize === undefined) {
            TextPr.FontSize = "";
        }
        for (var Item in TextPr) {
            if ("undefined" != typeof(oTextPrMap[Item])) {
                oTextPrMap[Item](this, TextPr[Item]);
            }
        }
        if (TextPr.Color !== undefined && TextPr.unifill !== undefined) {
            this.sync_TextColor2(TextPr.unifill, TextPr.Color);
        }
    }
};
asc_docs_api.prototype.sync_TextSpacing = function (Spacing) {
    this.asc_fireCallback("asc_onTextSpacing", Spacing);
};
asc_docs_api.prototype.sync_TextDStrikeout = function (Value) {
    this.asc_fireCallback("asc_onTextDStrikeout", Value);
};
asc_docs_api.prototype.sync_TextCaps = function (Value) {
    this.asc_fireCallback("asc_onTextCaps", Value);
};
asc_docs_api.prototype.sync_TextSmallCaps = function (Value) {
    this.asc_fireCallback("asc_onTextSmallCaps", Value);
};
asc_docs_api.prototype.sync_TextPosition = function (Value) {
    this.asc_fireCallback("asc_onTextPosition", Value);
};
asc_docs_api.prototype.sync_TextLangCallBack = function (Lang) {
    this.asc_fireCallback("asc_onTextLanguage", Lang.Val);
};
asc_docs_api.prototype.sync_VerticalTextAlign = function (align) {
    this.asc_fireCallback("asc_onVerticalTextAlign", align);
};
asc_docs_api.prototype.UpdateParagraphProp = function (ParaPr) {
    ParaPr.StyleName = "";
    var TextPr = editor.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
    ParaPr.Subscript = (TextPr.VertAlign === vertalign_SubScript ? true : false);
    ParaPr.Superscript = (TextPr.VertAlign === vertalign_SuperScript ? true : false);
    ParaPr.Strikeout = TextPr.Strikeout;
    ParaPr.DStrikeout = TextPr.DStrikeout;
    ParaPr.AllCaps = TextPr.Caps;
    ParaPr.SmallCaps = TextPr.SmallCaps;
    ParaPr.TextSpacing = TextPr.Spacing;
    ParaPr.Position = TextPr.Position;
    this.sync_ParaSpacingLine(ParaPr.Spacing);
    this.Update_ParaInd(ParaPr.Ind);
    this.sync_PrAlignCallBack(ParaPr.Jc);
    this.sync_ParaStyleName(ParaPr.StyleName);
    this.sync_ListType(ParaPr.ListType);
    this.sync_PrPropCallback(ParaPr);
};
asc_docs_api.prototype.asc_Print = function () {
    this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);
    var editor = this;
    _downloadAs(this, c_oAscFileType.PDF, function (incomeObject) {
        if (null != incomeObject && "save" == incomeObject["type"]) {
            editor.processSavedFile(incomeObject["data"], false);
        }
        editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);
    },
    true);
};
asc_docs_api.prototype.Undo = function () {
    this.WordControl.m_oLogicDocument.Document_Undo();
};
asc_docs_api.prototype.Redo = function () {
    this.WordControl.m_oLogicDocument.Document_Redo();
};
asc_docs_api.prototype.Copy = function () {
    return Editor_Copy_Button(this);
};
asc_docs_api.prototype.Update_ParaTab = function (Default_Tab, ParaTabs) {
    this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
};
asc_docs_api.prototype.Cut = function () {
    return Editor_Copy_Button(this, true);
};
asc_docs_api.prototype.Paste = function () {
    if (!window.GlobalPasteFlag) {
        if (!window.USER_AGENT_SAFARI_MACOS) {
            window.GlobalPasteFlag = true;
            return Editor_Paste_Button(this);
        } else {
            if (0 === window.GlobalPasteFlagCounter) {
                SafariIntervalFocus();
                window.GlobalPasteFlag = true;
                return Editor_Paste_Button(this);
            }
        }
    }
};
asc_docs_api.prototype.Share = function () {};
asc_docs_api.prototype.asc_Save = function (isAutoSave) {
    if (true === this.canSave) {
        this.canSave = false;
        this.isAutoSave = !!isAutoSave;
        if (!this.isAutoSave) {
            this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
            this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
        }
        var t = this;
        this.CoAuthoringApi.askSaveChanges(function (e) {
            t.onSaveCallback(e);
        });
    }
};
asc_docs_api.prototype.asc_OnSaveEnd = function (isDocumentSaved) {
    if (!this.isAutoSave) {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
    }
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
    this.canSave = true;
    this.isAutoSave = false;
    this.CoAuthoringApi.unSaveChanges();
    if (isDocumentSaved) {
        this.autoSaveInit();
    } else {
        this.CoAuthoringApi.disconnect();
    }
};
asc_docs_api.prototype.processSavedFile = function (url, bInner) {
    if (bInner) {
        editor.asc_fireCallback("asc_onSaveUrl", url, function (hasError) {});
    } else {
        getFile(url);
    }
};
asc_docs_api.prototype.asc_DownloadAs = function (typeFile) {
    this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
    var editor = this;
    _downloadAs(this, typeFile, function (incomeObject) {
        if (null != incomeObject && "save" == incomeObject["type"]) {
            editor.processSavedFile(incomeObject["data"], false);
        }
        editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
    },
    true);
};
asc_docs_api.prototype.Resize = function () {
    if (false === this.bInit_word_control) {
        return;
    }
    this.WordControl.OnResize(false);
};
asc_docs_api.prototype.AddURL = function (url) {};
asc_docs_api.prototype.Help = function () {};
asc_docs_api.prototype.ClearCache = function () {
    var rData = {
        "id": documentId,
        "userid": documentUserId,
        "vkey": documentVKey,
        "format": documentFormat,
        "c": "cc"
    };
    sendCommand(editor, function () {},
    rData);
};
asc_docs_api.prototype.startGetDocInfo = function () {
    this.sync_GetDocInfoStartCallback();
    this.WordControl.m_oLogicDocument.Statistics_Start();
};
asc_docs_api.prototype.stopGetDocInfo = function () {
    this.sync_GetDocInfoStopCallback();
    this.WordControl.m_oLogicDocument.Statistics_Stop();
};
asc_docs_api.prototype.sync_DocInfoCallback = function (obj) {
    this.asc_fireCallback("asc_onDocInfo", new CDocInfoProp(obj));
};
asc_docs_api.prototype.sync_GetDocInfoStartCallback = function () {
    this.asc_fireCallback("asc_onGetDocInfoStart");
};
asc_docs_api.prototype.sync_GetDocInfoStopCallback = function () {
    this.asc_fireCallback("asc_onGetDocInfoStop");
};
asc_docs_api.prototype.sync_GetDocInfoEndCallback = function () {
    this.asc_fireCallback("asc_onGetDocInfoEnd");
};
asc_docs_api.prototype.sync_CanUndoCallback = function (bCanUndo) {
    this.asc_fireCallback("asc_onCanUndo", bCanUndo);
};
asc_docs_api.prototype.sync_CanRedoCallback = function (bCanRedo) {
    this.asc_fireCallback("asc_onCanRedo", bCanRedo);
};
asc_docs_api.prototype.sync_PrintCallBack = function () {
    this.asc_fireCallback("asc_onPrint");
};
asc_docs_api.prototype.sync_UndoCallBack = function () {
    this.asc_fireCallback("asc_onUndo");
};
asc_docs_api.prototype.sync_RedoCallBack = function () {
    this.asc_fireCallback("asc_onRedo");
};
asc_docs_api.prototype.sync_CopyCallBack = function () {
    this.asc_fireCallback("asc_onCopy");
};
asc_docs_api.prototype.sync_CutCallBack = function () {
    this.asc_fireCallback("asc_onCut");
};
asc_docs_api.prototype.sync_PasteCallBack = function () {
    this.asc_fireCallback("asc_onPaste");
};
asc_docs_api.prototype.sync_ShareCallBack = function () {
    this.asc_fireCallback("asc_onShare");
};
asc_docs_api.prototype.sync_SaveCallBack = function () {
    this.asc_fireCallback("asc_onSave");
};
asc_docs_api.prototype.sync_DownloadAsCallBack = function () {
    this.asc_fireCallback("asc_onDownload");
};
asc_docs_api.prototype.sync_StartAction = function (type, id) {
    this.asc_fireCallback("asc_onStartAction", type, id);
};
asc_docs_api.prototype.sync_EndAction = function (type, id) {
    this.asc_fireCallback("asc_onEndAction", type, id);
};
asc_docs_api.prototype.sync_AddURLCallback = function () {
    this.asc_fireCallback("asc_onAddURL");
};
asc_docs_api.prototype.sync_ErrorCallback = function (errorID, errorLevel) {
    this.asc_fireCallback("asc_onError", errorID, errorLevel);
};
asc_docs_api.prototype.sync_HelpCallback = function (url) {
    this.asc_fireCallback("asc_onHelp", url);
};
asc_docs_api.prototype.sync_UpdateZoom = function (zoom) {
    this.asc_fireCallback("asc_onZoom", zoom);
};
asc_docs_api.prototype.sync_StatusMessage = function (message) {
    this.asc_fireCallback("asc_onMessage", message);
};
asc_docs_api.prototype.ClearPropObjCallback = function (prop) {
    this.asc_fireCallback("asc_onClearPropObj", prop);
};
asc_docs_api.prototype.CollectHeaders = function () {
    this.sync_ReturnHeadersCallback(_fakeHeaders);
};
asc_docs_api.prototype.GetActiveHeader = function () {};
asc_docs_api.prototype.gotoHeader = function (page, X, Y) {
    this.goToPage(page);
};
asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function (position, header) {
    this.asc_fireCallback("asc_onChangeActiveHeader", position, new CHeader(header));
};
asc_docs_api.prototype.sync_ReturnHeadersCallback = function (headers) {
    var _headers = Array();
    for (var i = 0; i < headers.length; i++) {
        _headers[i] = new CHeader(headers[i]);
    }
    this.asc_fireCallback("asc_onReturnHeaders", _headers);
};
asc_docs_api.prototype.startSearchText = function (what) {
    this._searchCur = 0;
    this.sync_SearchStartCallback();
    if (null != this.WordControl.m_oLogicDocument) {
        this.WordControl.m_oLogicDocument.Search_Start(what);
    } else {
        this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.StartSearch(what);
    }
};
asc_docs_api.prototype.goToNextSearchResult = function () {
    this.WordControl.m_oLogicDocument.goToNextSearchResult();
};
asc_docs_api.prototype.gotoSearchResultText = function (navigator) {
    this.WordControl.m_oDrawingDocument.CurrentSearchNavi = navigator;
    this.WordControl.ToSearchResult();
};
asc_docs_api.prototype.stopSearchText = function () {
    this.sync_SearchStopCallback();
    this.WordControl.m_oLogicDocument.Search_Stop();
};
asc_docs_api.prototype.findText = function (text, scanForward) {
    return this.WordControl.m_oLogicDocument.findText(text, scanForward);
};
asc_docs_api.prototype.asc_searchEnabled = function (bIsEnabled) {};
asc_docs_api.prototype.asc_findText = function (text, isNext, isMatchCase) {
    return this.WordControl.m_oLogicDocument.findText(text, isNext === true);
};
asc_docs_api.prototype.sync_SearchFoundCallback = function (obj) {
    this.asc_fireCallback("asc_onSearchFound", new CSearchResult(obj));
};
asc_docs_api.prototype.sync_SearchStartCallback = function () {
    this.asc_fireCallback("asc_onSearchStart");
};
asc_docs_api.prototype.sync_SearchStopCallback = function () {
    this.asc_fireCallback("asc_onSearchStop");
};
asc_docs_api.prototype.sync_SearchEndCallback = function () {
    this.asc_fireCallback("asc_onSearchEnd");
};
asc_docs_api.prototype.put_TextPrFontName = function (name) {
    var loader = window.g_font_loader;
    var nIndex = loader.map_font_index[name];
    var fontinfo = loader.fontInfos[nIndex];
    var isasync = loader.LoadFont(fontinfo);
    if (false === isasync) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
            FontFamily: {
                Name: fontinfo.Name,
                Index: nIndex
            }
        }));
    }
};
asc_docs_api.prototype.put_TextPrFontSize = function (size) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        FontSize: Math.min(size, 100)
    }));
};
asc_docs_api.prototype.put_TextPrBold = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        Bold: value
    }));
};
asc_docs_api.prototype.put_TextPrItalic = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        Italic: value
    }));
};
asc_docs_api.prototype.put_TextPrUnderline = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        Underline: value
    }));
};
asc_docs_api.prototype.put_TextPrStrikeout = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        Strikeout: value
    }));
};
asc_docs_api.prototype.put_PrLineSpacing = function (Type, Value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({
        LineRule: Type,
        Line: Value
    });
};
asc_docs_api.prototype.put_LineSpacingBeforeAfter = function (type, value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    switch (type) {
    case 0:
        this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({
            Before: value
        });
        break;
    case 1:
        this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({
            After: value
        });
        break;
    }
};
asc_docs_api.prototype.FontSizeIn = function () {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(true);
};
asc_docs_api.prototype.FontSizeOut = function () {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(false);
};
asc_docs_api.prototype.sync_BoldCallBack = function (isBold) {
    this.asc_fireCallback("asc_onBold", isBold);
};
asc_docs_api.prototype.sync_ItalicCallBack = function (isItalic) {
    this.asc_fireCallback("asc_onItalic", isItalic);
};
asc_docs_api.prototype.sync_UnderlineCallBack = function (isUnderline) {
    this.asc_fireCallback("asc_onUnderline", isUnderline);
};
asc_docs_api.prototype.sync_StrikeoutCallBack = function (isStrikeout) {
    this.asc_fireCallback("asc_onStrikeout", isStrikeout);
};
asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function (FontFamily) {
    this.asc_fireCallback("asc_onFontFamily", new CTextFontFamily(FontFamily));
};
asc_docs_api.prototype.sync_TextPrFontSizeCallBack = function (FontSize) {
    this.asc_fireCallback("asc_onFontSize", FontSize);
};
asc_docs_api.prototype.sync_PrLineSpacingCallBack = function (LineSpacing) {
    this.asc_fireCallback("asc_onLineSpacing", new CParagraphSpacing(LineSpacing));
};
asc_docs_api.prototype.sync_InitEditorFonts = function (gui_fonts) {
    this._gui_fonts = gui_fonts;
};
asc_docs_api.prototype.sync_InitEditorThemes = function (gui_editor_themes, gui_document_themes) {
    this._gui_editor_themes = gui_editor_themes;
    this._gui_document_themes = gui_document_themes;
};
asc_docs_api.prototype.sync_InitEditorTableStyles = function (styles) {
    this.asc_fireCallback("asc_onInitTableTemplates", styles);
};
function safe_Apply_Changes() {
    try {
        CollaborativeEditing.Apply_Changes();
    } catch(err) {}
}
asc_docs_api.prototype.onSaveCallback = function (e) {
    var t = this;
    var nState;
    if (false == e["savelock"]) {
        if (t.isAutoSave) {
            t.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
            t.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
        }
        safe_Apply_Changes();
        var data = this.WordControl.SaveDocument();
        var oAdditionalData = new Object();
        oAdditionalData["c"] = "save";
        oAdditionalData["id"] = documentId;
        oAdditionalData["userid"] = documentUserId;
        oAdditionalData["vkey"] = documentVKey;
        oAdditionalData["outputformat"] = c_oAscFileType.INNER;
        oAdditionalData["innersave"] = true;
        oAdditionalData["savetype"] = "completeall";
        oAdditionalData["data"] = data;
        sendCommand(editor, function (incomeObject) {
            if (null != incomeObject && "save" == incomeObject["type"]) {
                editor.processSavedFile(incomeObject["data"], true);
            }
        },
        oAdditionalData);
        CollaborativeEditing.Send_Changes();
        t.SetUnchangedDocument();
        t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
        if (!t.isAutoSave) {
            t.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
        }
    } else {
        nState = t.CoAuthoringApi.get_state();
        if (3 === nState) {
            if (!t.isAutoSave) {
                t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
                t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
            }
            t.isAutoSave = false;
            t.canSave = true;
        } else {
            if (t.isAutoSave) {
                t.isAutoSave = false;
                t.canSave = true;
                t.autoSaveInit(t.autoSaveGapAsk);
                return;
            }
            setTimeout(function () {
                t.CoAuthoringApi.askSaveChanges(function (event) {
                    window.setTimeout(function () {
                        t.onSaveCallback(event);
                    },
                    10);
                });
            },
            1000);
        }
    }
};
asc_docs_api.prototype.paraApply = function (Props) {
    var Additional = undefined;
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props, Additional)) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if ("undefined" != typeof(Props.ContextualSpacing) && null != Props.ContextualSpacing) {
            this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(Props.ContextualSpacing);
        }
        if ("undefined" != typeof(Props.Ind) && null != Props.Ind) {
            this.WordControl.m_oLogicDocument.Set_ParagraphIndent(Props.Ind);
        }
        if ("undefined" != typeof(Props.Jc) && null != Props.Jc) {
            this.WordControl.m_oLogicDocument.Set_ParagraphAlign(Props.Jc);
        }
        if ("undefined" != typeof(Props.KeepLines) && null != Props.KeepLines) {
            this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(Props.KeepLines);
        }
        if (undefined != Props.KeepNext && null != Props.KeepNext) {
            this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext(Props.KeepNext);
        }
        if (undefined != Props.WidowControl && null != Props.WidowControl) {
            this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl(Props.WidowControl);
        }
        if ("undefined" != typeof(Props.PageBreakBefore) && null != Props.PageBreakBefore) {
            this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore(Props.PageBreakBefore);
        }
        if ("undefined" != typeof(Props.Spacing) && null != Props.Spacing) {
            this.WordControl.m_oLogicDocument.Set_ParagraphSpacing(Props.Spacing);
        }
        if ("undefined" != typeof(Props.Shd) && null != Props.Shd) {
            this.WordControl.m_oLogicDocument.Set_ParagraphShd(Props.Shd);
        }
        if ("undefined" != typeof(Props.Brd) && null != Props.Brd) {
            this.WordControl.m_oLogicDocument.Set_ParagraphBorders(Props.Brd);
        }
        if (undefined != Props.Tabs) {
            var Tabs = new CParaTabs();
            Tabs.Set_FromObject(Props.Tabs.Tabs);
            this.WordControl.m_oLogicDocument.Set_ParagraphTabs(Tabs);
        }
        if (undefined != Props.DefaultTab) {
            this.WordControl.m_oLogicDocument.Set_DocumentDefaultTab(Props.DefaultTab);
        }
        var TextPr = new CTextPr();
        if (true === Props.Subscript) {
            TextPr.VertAlign = vertalign_SubScript;
        } else {
            if (true === Props.Superscript) {
                TextPr.VertAlign = vertalign_SuperScript;
            } else {
                if (false === Props.Superscript || false === Props.Subscript) {
                    TextPr.VertAlign = vertalign_Baseline;
                }
            }
        }
        if (undefined != Props.Strikeout) {
            TextPr.Strikeout = Props.Strikeout;
            TextPr.DStrikeout = false;
        }
        if (undefined != Props.DStrikeout) {
            TextPr.DStrikeout = Props.DStrikeout;
            if (true === TextPr.DStrikeout) {
                TextPr.Strikeout = false;
            }
        }
        if (undefined != Props.SmallCaps) {
            TextPr.SmallCaps = Props.SmallCaps;
            TextPr.AllCaps = false;
        }
        if (undefined != Props.AllCaps) {
            TextPr.Caps = Props.AllCaps;
            if (true === TextPr.AllCaps) {
                TextPr.SmallCaps = false;
            }
        }
        if (undefined != Props.TextSpacing) {
            TextPr.Spacing = Props.TextSpacing;
        }
        if (undefined != Props.Position) {
            TextPr.Position = Props.Position;
        }
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr(TextPr));
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
};
asc_docs_api.prototype.put_PrAlign = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
};
asc_docs_api.prototype.put_TextPrBaseline = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        VertAlign: value
    }));
};
asc_docs_api.prototype.put_ListType = function (type, subtype) {
    var NumberInfo = {
        Type: 0,
        SubType: -1
    };
    NumberInfo.Type = type;
    NumberInfo.SubType = subtype;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphNumbering(NumberInfo);
};
asc_docs_api.prototype.put_Style = function (name) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphStyle(name);
};
asc_docs_api.prototype.put_ShowParaMarks = function (isShow) {
    this.ShowParaMarks = isShow;
    this.WordControl.OnRePaintAttack();
    return this.ShowParaMarks;
};
asc_docs_api.prototype.get_ShowParaMarks = function () {
    return this.ShowParaMarks;
};
asc_docs_api.prototype.put_ShowTableEmptyLine = function (isShow) {
    this.isShowTableEmptyLine = isShow;
    this.WordControl.OnRePaintAttack();
    return this.isShowTableEmptyLine;
};
asc_docs_api.prototype.get_ShowTableEmptyLine = function () {
    return this.isShowTableEmptyLine;
};
asc_docs_api.prototype.put_KeepLines = function (isKeepLines) {
    this.isKeepLinesTogether = isKeepLines;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(isKeepLines);
    this.sync_KeepLinesCallback(isKeepLines);
};
asc_docs_api.prototype.put_AddSpaceBetweenPrg = function (isSpacePrg) {
    this.isAddSpaceBetweenPrg = isSpacePrg;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(isSpacePrg);
};
asc_docs_api.prototype.put_ShapeFillColor = function (is_flag, r, g, b) {
    if (false === is_flag) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        var Unifill = new CUniFill();
        Unifill.fill = new CNoFill();
        Unifill.calculate();
        this.WordControl.m_oLogicDocument.changeShapeFill(Unifill);
    } else {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        var Unifill = new CUniFill();
        Unifill.fill = new CSolidFill();
        Unifill.fill.color = new CRGBColor();
        Unifill.fill.color.RGBA = {
            R: r,
            G: g,
            B: b,
            A: 255
        };
        Unifill.calculate();
        this.WordControl.m_oLogicDocument.changeShapeFill(Unifill);
    }
};
asc_docs_api.prototype.ShapeApply = function (prop) {
    var image_url = "";
    if (prop.fill != null) {
        if (prop.fill.fill != null && prop.fill.type == c_oAscFill.FILL_TYPE_BLIP) {
            image_url = prop.fill.fill.get_url();
            var _tx_id = prop.fill.fill.get_texture_id();
            if (null != _tx_id && 0 <= _tx_id && _tx_id < g_oUserTexturePresets.length) {
                image_url = g_oUserTexturePresets[_tx_id];
            }
        }
    }
    if (image_url != "") {
        var _image = this.ImageLoader.LoadImage(image_url, 1);
        var sFindString = editor.DocumentUrl + "media/";
        if (0 == image_url.indexOf(sFindString)) {
            image_url = image_url.substring(sFindString.length);
            prop.fill.fill.put_url(image_url);
        }
        if (null != _image) {
            var doc = this.WordControl.m_oLogicDocument;
            if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.ShapeApply(prop);
                this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
            }
        } else {
            this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
            var oProp = prop;
            this.asyncImageEndLoaded2 = function (_image) {
                if (! (this.noCreatePoint === true)) {
                    var doc = this.WordControl.m_oLogicDocument;
                    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                        this.WordControl.m_oLogicDocument.ShapeApply(oProp);
                        this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
                        this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                        this.asyncImageEndLoaded2 = null;
                    }
                } else {
                    this.WordControl.m_oLogicDocument.ShapeApply(oProp);
                    this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
                    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                    this.asyncImageEndLoaded2 = null;
                }
            };
        }
    } else {
        if (!this.noCreatePoint) {
            var doc = this.WordControl.m_oLogicDocument;
            if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.ShapeApply(prop);
            }
        } else {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.ShapeApply(prop);
        }
    }
};
asc_docs_api.prototype.setStartPointHistory = function () {
    this.noCreatePoint = true;
    History.Create_NewPoint();
};
asc_docs_api.prototype.setEndPointHistory = function () {
    this.noCreatePoint = false;
};
asc_docs_api.prototype.SetSlideProps = function (prop) {
    if (null == prop) {
        return;
    }
    var arr_ind = this.WordControl.Thumbnails.GetSelectedArray();
    var _back_fill = prop.get_background();
    if (_back_fill) {
        if (_back_fill.get_type() == c_oAscFill.FILL_TYPE_NOFILL) {
            var bg = new CBg();
            bg.bgPr = new CBgPr();
            bg.bgPr.Fill = CorrectUniFill(_back_fill, null);
            this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
            return;
        }
        var _old_fill = null;
        var _oldBg = this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage].cSld.Bg;
        if (_oldBg != null && _oldBg.bgPr != null && _oldBg.bgPr.Fill != null) {
            _old_fill = _oldBg.bgPr.Fill.createDuplicate();
        }
        var bg = new CBg();
        bg.bgPr = new CBgPr();
        bg.bgPr.Fill = CorrectUniFill(_back_fill, _old_fill);
        var image_url = "";
        if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == FILL_TYPE_BLIP) {
            image_url = bg.bgPr.Fill.fill.RasterImageId;
        }
        if (image_url != "" && _back_fill.fill && _back_fill.fill.url != "" && _back_fill.fill.url != null) {
            var _image = this.ImageLoader.LoadImage(image_url, 1);
            var sFindString = editor.DocumentUrl + "media/";
            if (0 == image_url.indexOf(sFindString)) {
                image_url = image_url.substring(sFindString.length);
                bg.bgPr.Fill.fill.RasterImageId = image_url;
            }
            if (null != _image) {
                if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP) {
                    this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bg.bgPr.Fill.fill.RasterImageId);
                }
                this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
            } else {
                this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                var oProp = prop;
                this.asyncImageEndLoaded2 = function (_image) {
                    if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP) {
                        this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bg.bgPr.Fill.fill.RasterImageId);
                    }
                    this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
                    this.asyncImageEndLoaded2 = null;
                    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                };
            }
        } else {
            if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP) {
                this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bg.bgPr.Fill.fill.RasterImageId);
            }
            this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
        }
    }
    var _timing = prop.get_timing();
    if (_timing) {
        this.ApplySlideTiming(_timing);
    }
};
asc_docs_api.prototype.put_LineCap = function (_cap) {
    this.WordControl.m_oLogicDocument.putLineCap(_cap);
};
asc_docs_api.prototype.put_LineJoin = function (_join) {
    this.WordControl.m_oLogicDocument.putLineJoin(_join);
};
asc_docs_api.prototype.put_LineBeginStyle = function (_style) {
    this.WordControl.m_oLogicDocument.putLineBeginStyle(_style);
};
asc_docs_api.prototype.put_LineBeginSize = function (_size) {
    this.WordControl.m_oLogicDocument.putLineBeginSize(_size);
};
asc_docs_api.prototype.put_LineEndStyle = function (_style) {
    this.WordControl.m_oLogicDocument.putLineEndStyle(_style);
};
asc_docs_api.prototype.put_LineEndSize = function (_size) {
    this.WordControl.m_oLogicDocument.putLineEndSize(_size);
};
asc_docs_api.prototype.put_TextColor2 = function (r, g, b) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        Color: {
            r: r,
            g: g,
            b: b
        }
    }));
};
asc_docs_api.prototype.put_TextColor = function (color) {
    var _unifill = new CUniFill();
    _unifill.fill = new CSolidFill();
    _unifill.fill.color = CorrectUniColor(color, _unifill.fill.color);
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        unifill: _unifill
    }));
};
asc_docs_api.prototype.put_ParagraphShade = function (is_flag, r, g, b) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    if (false === is_flag) {
        this.WordControl.m_oLogicDocument.Set_ParagraphShd({
            Value: shd_Nil
        });
    } else {
        this.WordControl.m_oLogicDocument.Set_ParagraphShd({
            Value: shd_Clear,
            Color: {
                r: r,
                g: g,
                b: b
            }
        });
    }
};
asc_docs_api.prototype.put_PrIndent = function (value, levelValue) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphIndent({
        Left: value,
        ChangeLevel: levelValue
    });
};
asc_docs_api.prototype.IncreaseIndent = function () {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphIndent({
        ChangeLevel: 1
    });
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};
asc_docs_api.prototype.DecreaseIndent = function () {
    this.WordControl.m_oLogicDocument.Set_ParagraphIndent({
        ChangeLevel: -1
    });
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};
asc_docs_api.prototype.put_PrIndentRight = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphIndent({
        Right: value
    });
};
asc_docs_api.prototype.put_PrFirstLineIndent = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphIndent({
        FirstLine: value
    });
};
asc_docs_api.prototype.getFocusObject = function () {};
asc_docs_api.prototype.sync_VerticalAlign = function (typeBaseline) {
    this.asc_fireCallback("asc_onVerticalAlign", typeBaseline);
};
asc_docs_api.prototype.sync_PrAlignCallBack = function (value) {
    this.asc_fireCallback("asc_onPrAlign", value);
};
asc_docs_api.prototype.sync_ListType = function (NumPr) {
    this.asc_fireCallback("asc_onListType", new CListType(NumPr));
};
asc_docs_api.prototype.sync_TextColor = function (Color) {
    this.asc_fireCallback("asc_onTextColor", new CColor(Color.r, Color.g, Color.b));
};
asc_docs_api.prototype.sync_TextColor2 = function (unifill, _color) {
    if (unifill.fill == null) {
        return;
    } else {
        if (unifill.fill.type == FILL_TYPE_SOLID) {
            var color = CreateAscColor(unifill.fill.color);
            color.put_r(_color.r);
            color.put_g(_color.g);
            color.put_b(_color.b);
            this.asc_fireCallback("asc_onTextColor", color);
        } else {
            if (unifill.fill.type == FILL_TYPE_GRAD) {
                var color = CreateAscColor(unifill.fill.colors[0].color);
                color.put_r(_color.r);
                color.put_g(_color.g);
                color.put_b(_color.b);
                this.asc_fireCallback("asc_onTextColor", color);
            } else {
                var color = new CAscColor();
                color.put_r(_color.r);
                color.put_g(_color.g);
                color.put_b(_color.b);
                this.asc_fireCallback("asc_onTextColor", color);
            }
        }
    }
};
asc_docs_api.prototype.sync_TextHighLight = function (HighLight) {
    this.asc_fireCallback("asc_onTextHighLight", new CColor(HighLight.r, HighLight.g, HighLight.b));
};
asc_docs_api.prototype.sync_ParaStyleName = function (Name) {
    this.asc_fireCallback("asc_onParaStyleName", Name);
};
asc_docs_api.prototype.sync_ParaSpacingLine = function (SpacingLine) {
    this.asc_fireCallback("asc_onParaSpacingLine", new CParagraphSpacing(SpacingLine));
};
asc_docs_api.prototype.sync_PageBreakCallback = function (isBreak) {
    this.asc_fireCallback("asc_onPageBreak", isBreak);
};
asc_docs_api.prototype.sync_KeepLinesCallback = function (isKeepLines) {
    this.asc_fireCallback("asc_onKeepLines", isKeepLines);
};
asc_docs_api.prototype.sync_ShowParaMarksCallback = function () {
    this.asc_fireCallback("asc_onShowParaMarks");
};
asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function () {
    this.asc_fireCallback("asc_onSpaceBetweenPrg");
};
asc_docs_api.prototype.sync_PrPropCallback = function (prProp) {
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0) {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph) {
            this.SelectedObjectsStack[_len - 1].Value = new CParagraphProp(prProp);
            return;
        }
    }
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(c_oAscTypeSelectElement.Paragraph, new CParagraphProp(prProp));
};
asc_docs_api.prototype.SetDrawImagePlaceParagraph = function (element_id, props) {
    this.WordControl.m_oDrawingDocument.InitGuiCanvasTextProps(element_id);
    this.WordControl.m_oDrawingDocument.DrawGuiCanvasTextProps(props);
};
asc_docs_api.prototype.change_PageOrient = function (isPortrait) {
    this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    if (isPortrait) {
        this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Portrait);
        this.DocumentOrientation = orientation_Portrait ? true : false;
    } else {
        this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Landscape);
        this.DocumentOrientation = orientation_Landscape ? true : false;
    }
    this.sync_PageOrientCallback(!editor.get_DocumentOrientation());
};
asc_docs_api.prototype.get_DocumentOrientation = function () {
    return this.DocumentOrientation;
};
asc_docs_api.prototype.change_DocSize = function (width, height) {
    this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    if (this.DocumentOrientation == orientation_Portrait) {
        this.WordControl.m_oLogicDocument.Set_DocumentPageSize(width, height);
    } else {
        this.WordControl.m_oLogicDocument.Set_DocumentPageSize(height, width);
    }
};
asc_docs_api.prototype.put_AddPageBreak = function () {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaNewLine(break_Page));
};
asc_docs_api.prototype.Update_ParaInd = function (Ind) {
    FirstLine = 0;
    Left = 0;
    Right = 0;
    if ("undefined" != typeof(Ind)) {
        if ("undefined" != typeof(Ind.FirstLine)) {
            FirstLine = Ind.FirstLine;
        }
        if ("undefined" != typeof(Ind.Left)) {
            Left = Ind.Left;
        }
        if ("undefined" != typeof(Ind.Right)) {
            Right = Ind.Right;
        }
    }
    this.Internal_Update_Ind_Left(Left);
    this.Internal_Update_Ind_FirstLine(FirstLine, Left);
    this.Internal_Update_Ind_Right(Right);
};
asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function (FirstLine, Left) {
    if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left)) {
        this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
        this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.Internal_Update_Ind_Left = function (Left) {
    if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left) {
        this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
        this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.Internal_Update_Ind_Right = function (Right) {
    if (this.WordControl.m_oHorRuler.m_dIndentRight != Right) {
        this.WordControl.m_oHorRuler.m_dIndentRight = Right;
        this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.put_PageNum = function (where, align) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Document_AddPageNum(where, align);
};
asc_docs_api.prototype.put_HeadersAndFooters = function (where, options) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Document_AddHdrFtr(where, options);
};
asc_docs_api.prototype.rem_HeadersAndFooters = function (where, options) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Document_RemoveHdrFtr(where, options);
};
asc_docs_api.prototype.put_HeadersAndFootersDistance = function (value) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Document_SetHdrFtrDistance(value);
};
asc_docs_api.prototype.HeadersAndFooters_DifferentFirstPage = function (isOn) {
    if (isOn) {
        this.put_HeadersAndFooters(hdrftr_Footer, hdrftr_First);
        this.put_HeadersAndFooters(hdrftr_Header, hdrftr_First);
    } else {
        this.rem_HeadersAndFooters(hdrftr_Footer, hdrftr_First);
        this.rem_HeadersAndFooters(hdrftr_Header, hdrftr_First);
    }
};
asc_docs_api.prototype.HeadersAndFooters_DifferentOddandEvenPage = function (isOn) {
    if (isOn) {
        this.put_HeadersAndFooters(hdrftr_Footer, hdrftr_Even);
        this.put_HeadersAndFooters(hdrftr_Header, hdrftr_Even);
    } else {
        this.rem_HeadersAndFooters(hdrftr_Footer, hdrftr_Even);
        this.rem_HeadersAndFooters(hdrftr_Header, hdrftr_Even);
    }
};
asc_docs_api.prototype.sync_DocSizeCallback = function (width, height) {
    this.asc_fireCallback("asc_onDocSize", width, height);
};
asc_docs_api.prototype.sync_PageOrientCallback = function (isPortrait) {
    this.asc_fireCallback("asc_onPageOrient", isPortrait);
};
asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function (hafProp) {
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(c_oAscTypeSelectElement.Header, new CHeaderProp(hafProp));
};
asc_docs_api.prototype.put_Table = function (col, row) {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Add_FlowTable(col, row);
    }
};
asc_docs_api.prototype.addRowAbove = function (count) {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddRow(true);
    }
};
asc_docs_api.prototype.addRowBelow = function (count) {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddRow(false);
    }
};
asc_docs_api.prototype.addColumnLeft = function (count) {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddCol(true);
    }
};
asc_docs_api.prototype.addColumnRight = function (count) {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddCol(false);
    }
};
asc_docs_api.prototype.remRow = function () {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_RemoveRow();
    }
};
asc_docs_api.prototype.remColumn = function () {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_RemoveCol();
    }
};
asc_docs_api.prototype.remTable = function () {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_RemoveTable();
    }
};
asc_docs_api.prototype.selectRow = function () {
    this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Row);
};
asc_docs_api.prototype.selectColumn = function () {
    this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Column);
};
asc_docs_api.prototype.selectCell = function () {
    this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Cell);
};
asc_docs_api.prototype.selectTable = function () {
    this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Table);
};
asc_docs_api.prototype.setColumnWidth = function (width) {};
asc_docs_api.prototype.setRowHeight = function (height) {};
asc_docs_api.prototype.set_TblDistanceFromText = function (left, top, right, bottom) {};
asc_docs_api.prototype.CheckBeforeMergeCells = function () {
    return this.WordControl.m_oLogicDocument.Table_CheckMerge();
};
asc_docs_api.prototype.CheckBeforeSplitCells = function () {
    return this.WordControl.m_oLogicDocument.Table_CheckSplit();
};
asc_docs_api.prototype.MergeCells = function () {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_MergeCells();
};
asc_docs_api.prototype.SplitCell = function (Cols, Rows) {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
};
asc_docs_api.prototype.widthTable = function (width) {};
asc_docs_api.prototype.put_CellsMargin = function (left, top, right, bottom) {};
asc_docs_api.prototype.set_TblWrap = function (type) {};
asc_docs_api.prototype.set_TblIndentLeft = function (spacing) {};
asc_docs_api.prototype.set_Borders = function (typeBorders, size, Color) {};
asc_docs_api.prototype.set_TableBackground = function (Color) {};
asc_docs_api.prototype.set_AlignCell = function (align) {
    switch (align) {
    case c_oAscAlignType.LEFT:
        break;
    case c_oAscAlignType.CENTER:
        break;
    case c_oAscAlignType.RIGHT:
        break;
    }
};
asc_docs_api.prototype.set_TblAlign = function (align) {
    switch (align) {
    case c_oAscAlignType.LEFT:
        break;
    case c_oAscAlignType.CENTER:
        break;
    case c_oAscAlignType.RIGHT:
        break;
    }
};
asc_docs_api.prototype.set_SpacingBetweenCells = function (isOn, spacing) {
    if (isOn) {}
};
asc_docs_api.prototype.tblApply = function (obj) {
    var doc = this.WordControl.m_oLogicDocument;
    if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_TableProps(obj);
    }
};
asc_docs_api.prototype.sync_AddTableCallback = function () {
    this.asc_fireCallback("asc_onAddTable");
};
asc_docs_api.prototype.sync_AlignCellCallback = function (align) {
    this.asc_fireCallback("asc_onAlignCell", align);
};
asc_docs_api.prototype.sync_TblPropCallback = function (tblProp) {
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(c_oAscTypeSelectElement.Table, new CTableProp(tblProp));
};
asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function (style) {
    this.asc_fireCallback("asc_onTblWrapStyleChanged", style);
};
asc_docs_api.prototype.sync_TblAlignChangedCallback = function (style) {
    this.asc_fireCallback("asc_onTblAlignChanged", style);
};
asc_docs_api.prototype.ChangeImageFromFile = function () {
    this.isImageChangeUrl = true;
    this.AddImage();
};
asc_docs_api.prototype.ChangeShapeImageFromFile = function () {
    this.isShapeImageChangeUrl = true;
    this.AddImage();
};
asc_docs_api.prototype.ChangeSlideImageFromFile = function () {
    this.isSlideImageChangeUrl = true;
    this.AddImage();
};
asc_docs_api.prototype.AddImage = function () {
    var oImageUploader = document.getElementById("apiImageUpload");
    if (!oImageUploader) {
        var frame = document.createElement("iframe");
        frame.name = "apiImageUpload";
        frame.id = "apiImageUpload";
        frame.setAttribute("style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;");
        document.body.appendChild(frame);
    }
    var frameWindow = GetUploadIFrame();
    var content = '<html><head></head><body><form action="' + g_sUploadServiceLocalUrl + "?key=" + documentId + '" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" accept="image/*" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
    frameWindow.document.open();
    frameWindow.document.write(content);
    frameWindow.document.close();
    var fileName = frameWindow.document.getElementById("apiiuFile");
    var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");
    var oThis = this;
    fileName.onchange = function (e) {
        var bNeedSubmit = true;
        if (e && e.target && e.target.files) {
            var file = e.target.files[0];
            var nError = ValidateUploadImage(e.target.files);
            if (c_oAscServerError.NoError != nError) {
                bNeedSubmit = false;
                oThis.asc_fireCallback("asc_onError", _mapAscServerErrorToAscError(nError), c_oAscError.Level.NoCritical);
            }
        }
        if (bNeedSubmit) {
            oThis.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
            fileSubmit.click();
        }
    };
    if (window.opera != undefined) {
        setTimeout(function () {
            fileName.click();
        },
        0);
    } else {
        fileName.click();
    }
};
asc_docs_api.prototype.StartAddShape = function (prst, is_apply) {
    this.WordControl.m_oLogicDocument.StartAddShape(prst, is_apply);
    if (is_apply) {
        this.WordControl.m_oDrawingDocument.LockCursorType("crosshair");
    }
};
asc_docs_api.prototype.canGroup = function () {
    return this.WordControl.m_oLogicDocument.canGroup();
};
asc_docs_api.prototype.canUnGroup = function () {
    return this.WordControl.m_oLogicDocument.canUnGroup();
};
asc_docs_api.prototype.AddImageUrl = function (url) {
    if (0 == url.indexOf(this.DocumentUrl)) {
        this.AddImageUrlAction(url);
    } else {
        var rData = {
            "id": documentId,
            "userid": documentUserId,
            "vkey": documentVKey,
            "c": "imgurl",
            "data": url
        };
        var oThis = this;
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        sendCommand(this, function (incomeObject) {
            if (null != incomeObject && "imgurl" == incomeObject["type"]) {
                oThis.AddImageUrlAction(incomeObject["data"]);
            }
            oThis.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        },
        rData);
    }
};
asc_docs_api.prototype.AddImageUrlAction = function (url) {
    var _image = this.ImageLoader.LoadImage(url, 1);
    if (null != _image) {
        var _w = Page_Width - (X_Left_Margin + X_Right_Margin);
        var _h = Page_Height - (Y_Top_Margin + Y_Bottom_Margin);
        if (_image.Image != null) {
            var __w = Math.max((_image.Image.width * g_dKoef_pix_to_mm) >> 0, 1);
            var __h = Math.max((_image.Image.height * g_dKoef_pix_to_mm) >> 0, 1);
            _w = Math.max(5, Math.min(_w, __w));
            _h = Math.max(5, Math.min((_w * __h / __w) >> 0));
        }
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        var src = _image.src;
        if (this.isShapeImageChangeUrl) {
            var AscShapeProp = new CAscShapeProp();
            AscShapeProp.fill = new CAscFill();
            AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
            AscShapeProp.fill.fill = new CAscFillBlip();
            AscShapeProp.fill.fill.put_url(src);
            this.ShapeApply(AscShapeProp);
            this.isShapeImageChangeUrl = false;
        } else {
            if (this.isSlideImageChangeUrl) {
                var AscSlideProp = new CAscSlideProps();
                AscSlideProp.Background = new CAscFill();
                AscSlideProp.Background.type = c_oAscFill.FILL_TYPE_BLIP;
                AscSlideProp.Background.fill = new CAscFillBlip();
                AscSlideProp.Background.fill.put_url(src);
                this.SetSlideProps(AscSlideProp);
                this.isSlideImageChangeUrl = false;
            } else {
                if (this.isImageChangeUrl) {
                    var AscImageProp = new CImgProperty();
                    AscImageProp.ImageUrl = src;
                    this.ImgApply(AscImageProp);
                    this.isImageChangeUrl = false;
                } else {
                    var sFindString = editor.DocumentUrl + "media/";
                    if (0 == src.indexOf(sFindString)) {
                        src = src.substring(sFindString.length);
                    }
                    this.WordControl.m_oLogicDocument.Add_FlowImage(_w, _h, src);
                }
            }
        }
    } else {
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
        this.asyncImageEndLoaded2 = function (_image) {
            var _w = Page_Width - (X_Left_Margin + X_Right_Margin);
            var _h = Page_Height - (Y_Top_Margin + Y_Bottom_Margin);
            if (_image.Image != null) {
                var __w = Math.max((_image.Image.width * g_dKoef_pix_to_mm) >> 0, 1);
                var __h = Math.max((_image.Image.height * g_dKoef_pix_to_mm) >> 0, 1);
                _w = Math.max(5, Math.min(_w, __w));
                _h = Math.max(5, Math.min((_w * __h / __w) >> 0));
            }
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            var src = _image.src;
            if (this.isShapeImageChangeUrl) {
                var AscShapeProp = new CAscShapeProp();
                AscShapeProp.fill = new CAscFill();
                AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
                AscShapeProp.fill.fill = new CAscFillBlip();
                AscShapeProp.fill.fill.put_url(src);
                this.ShapeApply(AscShapeProp);
                this.isShapeImageChangeUrl = false;
            } else {
                if (this.isSlideImageChangeUrl) {
                    var AscSlideProp = new CAscSlideProps();
                    AscSlideProp.Background = new CAscFill();
                    AscSlideProp.Background.type = c_oAscFill.FILL_TYPE_BLIP;
                    AscSlideProp.Background.fill = new CAscFillBlip();
                    AscSlideProp.Background.fill.put_url(src);
                    this.SetSlideProps(AscSlideProp);
                    this.isSlideImageChangeUrl = false;
                } else {
                    if (this.isImageChangeUrl) {
                        var AscImageProp = new CImgProperty();
                        AscImageProp.ImageUrl = src;
                        this.ImgApply(AscImageProp);
                        this.isImageChangeUrl = false;
                    } else {
                        var sFindString = editor.DocumentUrl + "media/";
                        if (0 == src.indexOf(sFindString)) {
                            src = src.substring(sFindString.length);
                        }
                        this.WordControl.m_oLogicDocument.Add_FlowImage(_w, _h, src);
                    }
                }
            }
            this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
            this.asyncImageEndLoaded2 = null;
        };
    }
};
asc_docs_api.prototype.ImgApply = function (obj) {
    var ImagePr = new Object();
    ImagePr.Width = null === obj.Width ? null : parseFloat(obj.Width);
    ImagePr.Height = null === obj.Height ? null : parseFloat(obj.Height);
    ImagePr.WrappingStyle = obj.WrappingStyle;
    if (undefined != obj.Paddings && null != obj.Paddings) {
        ImagePr.Paddings = {
            Left: null === obj.Paddings.Left ? null : parseFloat(obj.Paddings.Left),
            Right: null === obj.Paddings.Right ? null : parseFloat(obj.Paddings.Right),
            Bottom: null === obj.Paddings.Bottom ? null : parseFloat(obj.Paddings.Bottom),
            Top: null === obj.Paddings.Top ? null : parseFloat(obj.Paddings.Top)
        };
    } else {
        ImagePr.Paddings = {
            Left: null,
            Top: null,
            Bottom: null,
            Right: null
        };
    }
    if (undefined != obj.Position) {
        ImagePr.Position = {
            X: null === obj.Position.X ? null : parseFloat(obj.Position.X),
            Y: null === obj.Position.Y ? null : parseFloat(obj.Position.Y)
        };
    } else {
        ImagePr.Position = {
            X: null,
            Y: null
        };
    }
    ImagePr.ImageUrl = obj.ImageUrl;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    if (ImagePr.ImageUrl != undefined && ImagePr.ImageUrl != null && ImagePr.ImageUrl != "") {
        var _img = this.ImageLoader.LoadImage(ImagePr.ImageUrl, 1);
        var sFindString = editor.DocumentUrl + "media/";
        if (0 == ImagePr.ImageUrl.indexOf(sFindString)) {
            ImagePr.ImageUrl = ImagePr.ImageUrl.substring(sFindString.length);
        }
        if (null != _img) {
            this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
        } else {
            this.asyncImageEndLoaded2 = function (_image) {
                this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
                this.asyncImageEndLoaded2 = null;
            };
        }
    } else {
        ImagePr.ImageUrl = null;
        this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
    }
};
asc_docs_api.prototype.ChartApply = function (obj) {
    if (this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint();
        this.WordControl.m_oLogicDocument.ChartApply(obj);
    }
};
asc_docs_api.prototype.set_Size = function (width, height) {};
asc_docs_api.prototype.set_ConstProportions = function (isOn) {
    if (isOn) {} else {}
};
asc_docs_api.prototype.set_WrapStyle = function (type) {};
asc_docs_api.prototype.deleteImage = function () {};
asc_docs_api.prototype.set_ImgDistanceFromText = function (left, top, right, bottom) {};
asc_docs_api.prototype.set_PositionOnPage = function (X, Y) {};
asc_docs_api.prototype.get_OriginalSizeImage = function () {
    if (0 == this.SelectedObjectsStack.length) {
        return null;
    }
    var obj = this.SelectedObjectsStack[this.SelectedObjectsStack.length - 1];
    if (obj == null) {
        return null;
    }
    if (obj.Type == c_oAscTypeSelectElement.Image) {
        return obj.Value.get_OriginSize(this);
    }
};
asc_docs_api.prototype.sync_AddImageCallback = function () {
    this.asc_fireCallback("asc_onAddImage");
};
asc_docs_api.prototype.sync_ImgPropCallback = function (imgProp) {
    var type = imgProp.ChartProperties ? c_oAscTypeSelectElement.Chart : c_oAscTypeSelectElement.Image;
    var prop = type === c_oAscTypeSelectElement.Chart ? new CAscChartProp(imgProp) : new CImgProperty(imgProp);
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(type, prop);
};
asc_docs_api.prototype.sync_ImgWrapStyleChangedCallback = function (style) {
    this.asc_fireCallback("asc_onImgWrapStyleChanged", style);
};
asc_docs_api.prototype.SetDrawingFreeze = function (bIsFreeze) {
    this.WordControl.DrawingFreeze = bIsFreeze;
    var _elem1 = document.getElementById("id_main");
    if (_elem1) {
        var _elem2 = document.getElementById("id_panel_thumbnails");
        var _elem3 = document.getElementById("id_panel_notes");
        if (bIsFreeze) {
            _elem1.style.display = "none";
            _elem2.style.display = "none";
            _elem3.style.display = "none";
        } else {
            _elem1.style.display = "block";
            _elem2.style.display = "block";
            _elem3.style.display = "block";
        }
    }
    if (!bIsFreeze) {
        this.WordControl.OnScroll();
    }
};
asc_docs_api.prototype.zoomIn = function () {
    this.WordControl.zoom_In();
};
asc_docs_api.prototype.zoomOut = function () {
    this.WordControl.zoom_Out();
};
asc_docs_api.prototype.zoomFitToPage = function () {
    this.WordControl.zoom_FitToPage();
};
asc_docs_api.prototype.zoomFitToWidth = function () {
    this.WordControl.zoom_FitToWidth();
};
asc_docs_api.prototype.zoomCustomMode = function () {
    this.WordControl.m_nZoomType = 0;
    this.WordControl.zoom_Fire();
};
asc_docs_api.prototype.zoom100 = function () {
    this.WordControl.m_nZoomValue = 100;
    this.WordControl.zoom_Fire();
};
asc_docs_api.prototype.zoom = function (percent) {
    this.WordControl.m_nZoomValue = percent;
    this.WordControl.zoom_Fire(0);
};
asc_docs_api.prototype.goToPage = function (number) {
    this.WordControl.GoToPage(number);
};
asc_docs_api.prototype.getCountPages = function () {
    return this.WordControl.m_oDrawingDocument.SlidesCount;
};
asc_docs_api.prototype.getCurrentPage = function () {
    return this.WordControl.m_oDrawingDocument.SlideCurrent;
};
asc_docs_api.prototype.sync_zoomChangeCallback = function (percent, type) {
    this.asc_fireCallback("asc_onZoomChange", percent, type);
};
asc_docs_api.prototype.sync_countPagesCallback = function (count) {
    this.asc_fireCallback("asc_onCountPages", count);
};
asc_docs_api.prototype.sync_currentPageCallback = function (number) {
    this.asc_fireCallback("asc_onCurrentPage", number);
};
asc_docs_api.prototype.sync_SendThemeColors = function (colors, standart_colors) {
    this.asc_fireCallback("asc_onSendThemeColors", colors, standart_colors);
};
asc_docs_api.prototype.sync_SendThemeColorSchemes = function (param) {
    this.asc_fireCallback("asc_onSendThemeColorSchemes", param);
};
asc_docs_api.prototype.ChangeColorScheme = function (index_scheme) {
    var _count_defaults = g_oUserColorScheme.length;
    if (index_scheme < _count_defaults) {
        var _obj = g_oUserColorScheme[index_scheme];
        var scheme = new ClrScheme();
        scheme.name = _obj["name"];
        var _c = null;
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
        this.WordControl.m_oLogicDocument.changeColorScheme(scheme);
    } else {
        index_scheme -= _count_defaults;
        if (null == this.WordControl.MasterLayouts) {
            return;
        }
        var theme = this.WordControl.MasterLayouts.Theme;
        if (null == theme) {
            return;
        }
        if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length) {
            return;
        }
        this.WordControl.m_oLogicDocument.changeColorScheme(theme.extraClrSchemeLst[index_scheme].clrScheme);
    }
    this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
};
asc_docs_api.prototype.asc_enableKeyEvents = function (value) {
    if (this.WordControl.IsFocus != value) {
        this.WordControl.IsFocus = value;
        this.asc_fireCallback("asc_onEnableKeyEventsChanged", value);
    }
};
function asc_CCommentData(obj) {
    if (obj) {
        this.m_sText = (undefined != obj.m_sText) ? obj.m_sText : "";
        this.m_sTime = (undefined != obj.m_sTime) ? obj.m_sTime : "";
        this.m_sUserId = (undefined != obj.m_sUserId) ? obj.m_sUserId : "";
        this.m_sQuoteText = (undefined != obj.m_sQuoteText) ? obj.m_sQuoteText : null;
        this.m_bSolved = (undefined != obj.m_bSolved) ? obj.m_bSolved : false;
        this.m_sUserName = (undefined != obj.m_sUserName) ? obj.m_sUserName : "";
        this.m_aReplies = new Array();
        if (undefined != obj.m_aReplies) {
            var Count = obj.m_aReplies.length;
            for (var Index = 0; Index < Count; Index++) {
                var Reply = new asc_CCommentData(obj.m_aReplies[Index]);
                this.m_aReplies.push(Reply);
            }
        }
    } else {
        this.m_sText = "";
        this.m_sTime = "";
        this.m_sUserId = "";
        this.m_sQuoteText = null;
        this.m_bSolved = false;
        this.m_sUserName = "";
        this.m_aReplies = new Array();
    }
}
asc_CCommentData.prototype.asc_getText = function () {
    return this.m_sText;
};
asc_CCommentData.prototype.asc_putText = function (v) {
    this.m_sText = v;
};
asc_CCommentData.prototype.asc_getTime = function () {
    return this.m_sTime;
};
asc_CCommentData.prototype.asc_putTime = function (v) {
    this.m_sTime = v;
};
asc_CCommentData.prototype.asc_getUserId = function () {
    return this.m_sUserId;
};
asc_CCommentData.prototype.asc_putUserId = function (v) {
    this.m_sUserId = v;
};
asc_CCommentData.prototype.asc_getUserName = function () {
    return this.m_sUserName;
};
asc_CCommentData.prototype.asc_putUserName = function (v) {
    this.m_sUserName = v;
};
asc_CCommentData.prototype.asc_getQuoteText = function () {
    return this.m_sQuoteText;
};
asc_CCommentData.prototype.asc_putQuoteText = function (v) {
    this.m_sQuoteText = v;
};
asc_CCommentData.prototype.asc_getSolved = function () {
    return this.m_bSolved;
};
asc_CCommentData.prototype.asc_putSolved = function (v) {
    this.m_bSolved = v;
};
asc_CCommentData.prototype.asc_getReply = function (i) {
    return this.m_aReplies[i];
};
asc_CCommentData.prototype.asc_addReply = function (v) {
    this.m_aReplies.push(v);
};
asc_CCommentData.prototype.asc_getRepliesCount = function (v) {
    return this.m_aReplies.length;
};
asc_docs_api.prototype.asc_showComments = function () {
    if (null == this.WordControl.m_oLogicDocument) {
        return;
    }
    this.WordControl.m_oLogicDocument.Show_Comments();
};
asc_docs_api.prototype.asc_hideComments = function () {
    if (null == this.WordControl.m_oLogicDocument) {
        return;
    }
    this.WordControl.m_oLogicDocument.Hide_Comments();
    editor.sync_HideComment();
};
asc_docs_api.prototype.asc_addComment = function (AscCommentData) {
    if (null == this.WordControl.m_oLogicDocument) {
        return;
    }
    var CommentData = new CCommentData();
    CommentData.Read_FromAscCommentData(AscCommentData);
    var Comment = this.WordControl.m_oLogicDocument.Add_Comment(CommentData);
    if (null != Comment) {
        this.sync_AddComment(Comment.Get_Id(), CommentData);
    }
};
asc_docs_api.prototype.asc_removeComment = function (Id) {
    if (null == this.WordControl.m_oLogicDocument) {
        return;
    }
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_MoveComment, Id)) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Remove_Comment(Id, true);
    }
};
asc_docs_api.prototype.asc_changeComment = function (Id, AscCommentData) {
    if (null == this.WordControl.m_oLogicDocument) {
        return;
    }
    var CommentData = new CCommentData();
    CommentData.Read_FromAscCommentData(AscCommentData);
    this.WordControl.m_oLogicDocument.Change_Comment(Id, CommentData);
};
asc_docs_api.prototype.asc_selectComment = function (Id) {
    if (null == this.WordControl.m_oLogicDocument) {
        return;
    }
    this.WordControl.m_oLogicDocument.Select_Comment(Id);
};
asc_docs_api.prototype.asc_showComment = function (Id) {
    this.WordControl.m_oLogicDocument.Show_Comment(Id);
};
asc_docs_api.prototype.can_AddQuotedComment = function () {
    return this.WordControl.m_oLogicDocument.CanAdd_Comment();
};
asc_docs_api.prototype.sync_RemoveComment = function (Id) {
    this.asc_fireCallback("asc_onRemoveComment", Id);
};
asc_docs_api.prototype.sync_AddComment = function (Id, CommentData) {
    if (this.bNoSendComments === false) {
        var AscCommentData = new asc_CCommentData(CommentData);
        this.asc_fireCallback("asc_onAddComment", Id, AscCommentData);
    }
};
asc_docs_api.prototype.sync_ShowComment = function (Id, X, Y) {
    if (this.WordControl.m_oMainContent) {
        X -= ((this.WordControl.m_oMainContent.Bounds.L * g_dKoef_mm_to_pix) >> 0);
    }
    this.asc_fireCallback("asc_onShowComment", [Id], X, Y);
};
asc_docs_api.prototype.sync_HideComment = function () {
    this.asc_fireCallback("asc_onHideComment");
};
asc_docs_api.prototype.sync_UpdateCommentPosition = function (Id, X, Y) {
    this.asc_fireCallback("asc_onUpdateCommentPosition", [Id], X, Y);
};
asc_docs_api.prototype.sync_ChangeCommentData = function (Id, CommentData) {
    var AscCommentData = new asc_CCommentData(CommentData);
    this.asc_fireCallback("asc_onChangeCommentData", Id, AscCommentData);
};
asc_docs_api.prototype.sync_LockComment = function (Id, UserId) {
    this.asc_fireCallback("asc_onLockComment", Id, UserId);
};
asc_docs_api.prototype.sync_UnLockComment = function (Id) {
    this.asc_fireCallback("asc_onUnLockComment", Id);
};
asc_docs_api.prototype.asyncFontsDocumentStartLoaded = function () {
    if (this.isPasteFonts_Images) {
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    } else {
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);
        var _progress = this.OpenDocumentProgress;
        _progress.Type = c_oAscAsyncAction.LoadDocumentFonts;
        _progress.FontsCount = this.FontLoader.fonts_loading.length;
        _progress.CurrentFont = 0;
        var _loader_object = this.WordControl.m_oLogicDocument;
        var _count = 0;
        if (_loader_object !== undefined && _loader_object != null) {
            for (var i in _loader_object.ImageMap) {
                ++_count;
            }
        }
        _progress.ImagesCount = _count + g_oUserTexturePresets.length;
        _progress.CurrentImage = 0;
    }
};
asc_docs_api.prototype.GenerateStyles = function () {
    return;
};
asc_docs_api.prototype.asyncFontsDocumentEndLoaded = function () {
    if (this.isPasteFonts_Images) {
        this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    } else {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);
    }
    this.EndActionLoadImages = 0;
    if (this.isPasteFonts_Images) {
        var _count = 0;
        for (var i in this.pasteImageMap) {
            ++_count;
        }
        if (_count > 0) {
            this.EndActionLoadImages = 2;
            this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
        }
        this.ImageLoader.LoadDocumentImages(this.pasteImageMap, false);
        return;
    } else {
        if (this.isSaveFonts_Images) {
            var _count = 0;
            for (var i in this.saveImageMap) {
                ++_count;
            }
            if (_count > 0) {
                this.EndActionLoadImages = 2;
                this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
            }
            this.ImageLoader.LoadDocumentImages(this.saveImageMap, false);
            return;
        }
    }
    this.GenerateStyles();
    if (this.isLoadNoCutFonts) {
        this.isLoadNoCutFonts = false;
        this.SetViewMode(false);
        return;
    }
    var _loader_object = this.WordControl.m_oLogicDocument;
    if (null == _loader_object) {
        _loader_object = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;
    }
    var _count = 0;
    for (var i in _loader_object.ImageMap) {
        ++_count;
    }
    var _st_count = g_oUserTexturePresets.length;
    for (var i = 0; i < _st_count; i++) {
        _loader_object.ImageMap[_count + i] = g_oUserTexturePresets[i];
    }
    if (_count > 0) {
        this.EndActionLoadImages = 1;
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }
    this.ImageLoader.bIsLoadDocumentFirst = true;
    this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap, true);
};
asc_docs_api.prototype.asyncImagesDocumentStartLoaded = function () {};
asc_docs_api.prototype.asyncImagesDocumentEndLoaded = function () {
    if (this.EndActionLoadImages == 1) {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    } else {
        if (this.EndActionLoadImages == 2) {
            this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
        }
    }
    this.EndActionLoadImages = 0;
    this.ImageLoader.bIsLoadDocumentFirst = false;
    if (this.isPasteFonts_Images) {
        this.isPasteFonts_Images = false;
        this.pasteImageMap = null;
        this.pasteCallback();
        window.GlobalPasteFlag = false;
        window.GlobalPasteFlagCounter = 0;
        this.pasteCallback = null;
    } else {
        if (this.isSaveFonts_Images) {
            this.isSaveFonts_Images = false;
            this.saveImageMap = null;
            this.pre_SaveCallback();
        } else {
            this.ServerImagesWaitComplete = true;
            if (true == this.ServerIdWaitComplete) {
                this.OpenDocumentEndCallback();
            }
            this.asyncServerIdStartLoaded();
        }
    }
};
asc_docs_api.prototype.asc_getComments = function () {
    var comms = [];
    if (null == this.WordControl.m_oLogicDocument) {
        return comms;
    }
    var _slides = this.WordControl.m_oLogicDocument.Slides;
    var _slidesCount = _slides.length;
    for (var i = 0; i < _slidesCount; i++) {
        var _comments = _slides[i].slideComments.comments;
        var _commentsCount = _comments.length;
        for (var j = 0; j < _commentsCount; j++) {
            var _id = _comments[j].Get_Id();
            var _ascCommentData = new asc_CCommentData(_comments[j].Data);
            comms.push({
                "Id": _id,
                "Comment": _ascCommentData
            });
        }
    }
    return comms;
};
asc_docs_api.prototype.OpenDocumentEndCallback = function () {
    this.bNoSendComments = false;
    var bIsScroll = false;
    if (0 == this.DocumentType) {
        this.WordControl.m_oLogicDocument.LoadEmptyDocument();
    } else {
        if (1 == this.DocumentType) {
            this.WordControl.m_oLogicDocument.LoadTestDocument();
        } else {
            if (this.LoadedObject) {
                if (this.LoadedObject === 1) {
                    if (this.isApplyChangesOnOpenEnabled) {
                        this.isApplyChangesOnOpenEnabled = false;
                        if (CollaborativeEditing.m_bUse == true) {
                            this.isApplyChangesOnOpen = true;
                            this.bNoSendComments = true;
                            CollaborativeEditing.Apply_Changes();
                            CollaborativeEditing.Release_Locks();
                            this.bNoSendComments = false;
                            return;
                        }
                    }
                }
                this.WordControl.m_oLogicDocument.RecalculateAfterOpen();
                var presentation = this.WordControl.m_oLogicDocument;
                presentation.DrawingDocument.OnEndRecalculate();
                this.WordControl.m_oLayoutDrawer.IsRetina = this.WordControl.bIsRetinaSupport;
                this.WordControl.m_oLayoutDrawer.WidthMM = presentation.Width;
                this.WordControl.m_oLayoutDrawer.HeightMM = presentation.Height;
                this.WordControl.m_oMasterDrawer.WidthMM = presentation.Width;
                this.WordControl.m_oMasterDrawer.HeightMM = presentation.Height;
                this.WordControl.m_oLogicDocument.GenerateThumbnails(this.WordControl.m_oMasterDrawer, this.WordControl.m_oLayoutDrawer);
                var _masters = this.WordControl.m_oLogicDocument.slideMasters;
                for (var i = 0; i < _masters.length; i++) {
                    var theme_load_info = new CThemeLoadInfo();
                    theme_load_info.Master = _masters[i];
                    theme_load_info.Theme = _masters[i].Theme;
                    var _lay_cnt = _masters[i].sldLayoutLst.length;
                    for (var j = 0; j < _lay_cnt; j++) {
                        theme_load_info.Layouts[j] = _masters[i].sldLayoutLst[j];
                    }
                    var th_info = new Object();
                    th_info["Name"] = "Doc Theme " + i;
                    th_info["Url"] = "";
                    th_info["Thumbnail"] = _masters[i].ImageBase64;
                    var th = new CAscThemeInfo(th_info);
                    this.ThemeLoader.Themes.DocumentThemes[this.ThemeLoader.Themes.DocumentThemes.length] = th;
                    th.Index = -this.ThemeLoader.Themes.DocumentThemes.length;
                    this.ThemeLoader.themes_info_document[this.ThemeLoader.Themes.DocumentThemes.length - 1] = theme_load_info;
                }
                this.sync_InitEditorThemes(this.ThemeLoader.Themes.EditorThemes, this.ThemeLoader.Themes.DocumentThemes);
                this.asc_fireCallback("asc_onPresentationSize", presentation.Width, presentation.Height);
                this.WordControl.GoToPage(0);
                bIsScroll = true;
            }
        }
    }
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
    this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    this.LoadedObject = null;
    this.bInit_word_control = true;
    var _slides = this.WordControl.m_oLogicDocument.Slides;
    var _slidesCount = _slides.length;
    for (var i = 0; i < _slidesCount; i++) {
        var slideComments = _slides[i].slideComments;
        if (slideComments) {
            var _comments = slideComments.comments;
            var _commentsCount = _comments.length;
            for (var j = 0; j < _commentsCount; j++) {
                this.sync_AddComment(_comments[j].Get_Id(), _comments[j].Data);
            }
        }
    }
    this.asc_fireCallback("asc_onDocumentContentReady");
    this.WordControl.InitControl();
    if (bIsScroll) {
        this.WordControl.OnScroll();
    }
    if (this.isViewMode) {
        this.SetViewMode(true);
    }
    this.autoSaveInit();
};
asc_docs_api.prototype.asyncFontStartLoaded = function () {
    this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
};
asc_docs_api.prototype.asyncFontEndLoaded = function (fontinfo) {
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
        FontFamily: {
            Name: fontinfo.Name,
            Index: -1
        }
    }));
};
asc_docs_api.prototype.asyncImageStartLoaded = function () {};
asc_docs_api.prototype.asyncImageEndLoaded = function (_image) {
    if (this.asyncImageEndLoaded2) {
        this.asyncImageEndLoaded2(_image);
    } else {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if (_image.Type == 0) {
            this.WordControl.m_oLogicDocument.Add_FlowImage(50, 50, _image.src);
        } else {
            this.WordControl.m_oLogicDocument.Add_InlineImage(50, 50, _image.src);
        }
    }
};
asc_docs_api.prototype.get_PresentationWidth = function () {
    if (this.WordControl.m_oLogicDocument == null) {
        return 0;
    }
    return this.WordControl.m_oLogicDocument.Width;
};
asc_docs_api.prototype.get_PresentationHeight = function () {
    if (this.WordControl.m_oLogicDocument == null) {
        return 0;
    }
    return this.WordControl.m_oLogicDocument.Height;
};
asc_docs_api.prototype.SendOpenProgress = function () {
    this.asc_fireCallback("asc_onOpenDocumentProgress", this.OpenDocumentProgress);
    var _progress = this.OpenDocumentProgress;
    var _percents = (_progress.get_CurrentFont() + _progress.get_CurrentImage()) / (_progress.get_FontsCount() + _progress.get_ImagesCount());
    _percents *= 100;
    _percents = Math.min(this._lastConvertProgress + _percents * (100 - this._lastConvertProgress) / 100, 100);
    return this.sync_SendProgress(_percents);
};
asc_docs_api.prototype.sync_SendProgress = function (Percents) {
    this.asc_fireCallback("asc_onOpenDocumentProgress2", Percents);
};
asc_docs_api.prototype.pre_Paste = function (_fonts, _images, callback) {
    this.pasteCallback = callback;
    this.pasteImageMap = _images;
    var _count = 0;
    for (var i in this.pasteImageMap) {
        ++_count;
    }
    if (0 == _count && false === this.FontLoader.CheckFontsNeedLoading(_fonts)) {
        this.pasteCallback();
        window.GlobalPasteFlag = false;
        window.GlobalPasteFlagCounter = 0;
        this.pasteCallback = null;
        return;
    }
    this.isPasteFonts_Images = true;
    this.FontLoader.LoadDocumentFonts2(_fonts);
};
asc_docs_api.prototype.pre_SaveCallback = function () {
    CollaborativeEditing.OnEnd_Load_Objects();
    if (this.isApplyChangesOnOpen) {
        this.isApplyChangesOnOpen = false;
        this.OpenDocumentEndCallback();
    }
};
asc_docs_api.prototype.initEvents2MobileAdvances = function () {
    this.WordControl.initEvents2MobileAdvances();
};
asc_docs_api.prototype.ViewScrollToX = function (x) {
    this.WordControl.m_oScrollHorApi.scrollToX(x);
};
asc_docs_api.prototype.ViewScrollToY = function (y) {
    this.WordControl.m_oScrollVerApi.scrollToY(y);
};
asc_docs_api.prototype.GetDocWidthPx = function () {
    return this.WordControl.m_dDocumentWidth;
};
asc_docs_api.prototype.GetDocHeightPx = function () {
    return this.WordControl.m_dDocumentHeight;
};
asc_docs_api.prototype.ClearSearch = function () {
    return this.WordControl.m_oDrawingDocument.EndSearch(true);
};
asc_docs_api.prototype.GetCurrentVisiblePage = function () {
    return this.WordControl.m_oDrawingDocument.SlideCurrent;
};
asc_docs_api.prototype.asc_setAutoSaveGap = function (autoSaveGap) {
    if (typeof autoSaveGap === "number") {
        this.autoSaveGap = autoSaveGap * 1000;
        this.autoSaveInit();
    }
};
asc_docs_api.prototype.SetMobileVersion = function (val) {
    this.isMobileVersion = val;
    if (this.isMobileVersion) {
        this.WordControl.bIsRetinaSupport = false;
        this.WordControl.bIsRetinaNoSupportAttack = true;
        this.WordControl.m_bIsRuler = false;
        this.ShowParaMarks = false;
    }
};
asc_docs_api.prototype.GoToHeader = function (pageNumber) {
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber)) {
        return;
    }
    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, 0, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, 0, pageNumber);
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    global_mouseEvent.ClickCount = oldClickCount;
};
asc_docs_api.prototype.changeSlideSize = function (width, height) {
    this.WordControl.m_oLogicDocument.changeSlideSize(width, height);
};
asc_docs_api.prototype.AddSlide = function (layoutIndex) {
    this.WordControl.m_oLogicDocument.addNextSlide(layoutIndex);
};
asc_docs_api.prototype.DeleteSlide = function () {
    var _delete_array = this.WordControl.Thumbnails.GetSelectedArray();
    if (!this.IsSupportEmptyPresentation) {
        if (_delete_array.length == this.WordControl.m_oDrawingDocument.SlidesCount) {
            _delete_array.splice(0, 1);
        }
    }
    if (_delete_array.length != 0) {
        this.WordControl.m_oLogicDocument.deleteSlides(_delete_array);
    }
};
asc_docs_api.prototype.DublicateSlide = function () {
    var selectionArray = this.WordControl.Thumbnails.GetSelectedArray();
    var _presentation = this.WordControl.m_oLogicDocument;
    var div = document.createElement("div");
    var copy_processor = new CopyProcessor(editor, div);
    copy_processor.oPresentationWriter.End_UseFullUrl();
    copy_processor.Start();
    var oPasteProcessor = new PasteProcessor(this, true, true, false);
    History.Create_NewPoint();
    oPasteProcessor.Start(copy_processor.ElemToSelect, copy_processor.ElemToSelect, true);
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};
asc_docs_api.prototype.SelectAllSlides = function (layoutType) {
    var drDoc = this.WordControl.m_oDrawingDocument;
    var slidesCount = drDoc.SlidesCount;
    for (var i = 0; i < slidesCount; i++) {
        this.WordControl.Thumbnails.m_arrPages[i].IsSelected = true;
    }
    this.WordControl.Thumbnails.OnUpdateOverlay();
};
asc_docs_api.prototype.AddShape = function (shapetype) {};
asc_docs_api.prototype.ChangeShapeType = function (shapetype) {
    History.Create_NewPoint();
    this.WordControl.m_oLogicDocument.changeShapeType(shapetype);
};
asc_docs_api.prototype.AddText = function () {};
asc_docs_api.prototype.groupShapes = function () {
    this.WordControl.m_oLogicDocument.groupShapes();
};
asc_docs_api.prototype.unGroupShapes = function () {
    this.WordControl.m_oLogicDocument.unGroupShapes();
};
asc_docs_api.prototype.setVerticalAlign = function (align) {
    History.Create_NewPoint();
    this.WordControl.m_oLogicDocument.setVerticalAlign(align);
};
asc_docs_api.prototype.sync_MouseMoveStartCallback = function () {
    this.asc_fireCallback("asc_onMouseMoveStart");
};
asc_docs_api.prototype.sync_MouseMoveEndCallback = function () {
    this.asc_fireCallback("asc_onMouseMoveEnd");
};
asc_docs_api.prototype.sync_MouseMoveCallback = function (Data) {
    this.asc_fireCallback("asc_onMouseMove", Data);
};
asc_docs_api.prototype.ShowThumbnails = function (bIsShow) {
    if (bIsShow) {
        this.WordControl.Splitter1Pos = this.WordControl.OldSplitter1Pos;
        if (this.WordControl.Splitter1Pos == 0) {
            this.WordControl.Splitter1Pos = 70;
        }
        this.WordControl.OnResizeSplitter();
    } else {
        var old = this.WordControl.OldSplitter1Pos;
        this.WordControl.Splitter1Pos = 0;
        this.WordControl.OnResizeSplitter();
        this.WordControl.OldSplitter1Pos = old;
    }
};
asc_docs_api.prototype.syncOnThumbnailsShow = function () {
    var bIsShow = true;
    if (0 == this.WordControl.Splitter1Pos) {
        bIsShow = false;
    }
    this.asc_fireCallback("asc_onThumbnailsShow", bIsShow);
};
asc_docs_api.prototype.can_AddHyperlink = function () {
    var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd();
    if (true === bCanAdd) {
        return this.WordControl.m_oLogicDocument.Get_SelectedText(true);
    }
    return false;
};
asc_docs_api.prototype.add_Hyperlink = function (HyperProps) {
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Add(HyperProps);
    }
};
asc_docs_api.prototype.change_Hyperlink = function (HyperProps) {
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Modify(HyperProps);
    }
};
asc_docs_api.prototype.remove_Hyperlink = function () {
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Remove();
    }
};
function CHyperlinkProperty(obj) {
    if (obj) {
        this.Text = (undefined != obj.Text) ? obj.Text : null;
        this.Value = (undefined != obj.Value) ? obj.Value : "";
        this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : null;
    } else {
        this.Text = null;
        this.Value = "";
        this.ToolTip = null;
    }
}
CHyperlinkProperty.prototype.get_Value = function () {
    return this.Value;
};
CHyperlinkProperty.prototype.put_Value = function (v) {
    this.Value = v;
};
CHyperlinkProperty.prototype.get_ToolTip = function () {
    return this.ToolTip;
};
CHyperlinkProperty.prototype.put_ToolTip = function (v) {
    this.ToolTip = v;
};
CHyperlinkProperty.prototype.get_Text = function () {
    return this.Text;
};
CHyperlinkProperty.prototype.put_Text = function (v) {
    this.Text = v;
};
asc_docs_api.prototype.sync_HyperlinkPropCallback = function (hyperProp) {
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(c_oAscTypeSelectElement.Hyperlink, new CHyperlinkProperty(hyperProp));
};
asc_docs_api.prototype.sync_HyperlinkClickCallback = function (Url) {
    this.asc_fireCallback("asc_onHyperlinkClick", Url);
};
asc_docs_api.prototype.sync_CanAddHyperlinkCallback = function (bCanAdd) {
    this.asc_fireCallback("asc_onCanAddHyperlink", bCanAdd);
};
asc_docs_api.prototype.sync_DialogAddHyperlink = function () {
    this.asc_fireCallback("asc_onDialogAddHyperlink");
};
asc_docs_api.prototype.GoToFooter = function (pageNumber) {
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber)) {
        return;
    }
    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height, pageNumber);
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    global_mouseEvent.ClickCount = oldClickCount;
};
asc_docs_api.prototype.sync_shapePropCallback = function (pr) {
    var obj = new CAscShapeProp();
    obj.type = pr.type;
    obj.fill = CreateAscFill(pr.fill);
    obj.stroke = CreateAscStroke(pr.stroke, pr.canChangeArrows);
    obj.Locked = pr.IsLocked;
    obj.paddings = pr.paddings;
    obj.w = pr.w;
    obj.h = pr.h;
    obj.verticalTextAlign = pr.verticalTextAlign;
    obj.canFill = pr.canFill;
    if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP) {
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
    } else {
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(null);
    }
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0) {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Shape) {
            this.SelectedObjectsStack[_len - 1].Value = obj;
            return;
        }
    }
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(c_oAscTypeSelectElement.Shape, obj);
};
asc_docs_api.prototype.sync_slidePropCallback = function (slide) {
    if (!slide) {
        return;
    }
    var bg = slide.cSld.Bg;
    var obj = new CAscSlideProps();
    var bgFill = null;
    if (slide.cSld && slide.cSld.Bg && slide.cSld.Bg.bgPr) {
        bgFill = slide.cSld.Bg.bgPr.Fill;
    }
    if (!bgFill) {
        obj.Background = new CAscFill();
        obj.Background.type = c_oAscFill.FILL_TYPE_NOFILL;
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(null);
    } else {
        obj.Background = CreateAscFill(bgFill);
        if (bgFill != null && bgFill.fill != null && bgFill.fill.type == FILL_TYPE_BLIP) {
            this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bgFill.fill.RasterImageId);
        } else {
            this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(null);
        }
    }
    obj.Timing = slide.timing;
    obj.lockDelete = !(slide.deleteLock.Lock.Type === locktype_Mine || slide.deleteLock.Lock.Type === locktype_None);
    obj.lockLayout = !(slide.layoutLock.Lock.Type === locktype_Mine || slide.layoutLock.Lock.Type === locktype_None);
    obj.lockTiming = !(slide.timingLock.Lock.Type === locktype_Mine || slide.timingLock.Lock.Type === locktype_None);
    obj.lockTranzition = !(slide.transitionLock.Lock.Type === locktype_Mine || slide.transitionLock.Lock.Type === locktype_None);
    obj.lockBackground = !(slide.backgroundLock.Lock.Type === locktype_Mine || slide.backgroundLock.Lock.Type === locktype_None);
    obj.lockRemove = obj.lockDelete || obj.lockLayout || obj.lockTiming || obj.lockTranzition || obj.lockBackground || slide.isLockedObject();
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0) {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Slide) {
            this.SelectedObjectsStack[_len - 1].Value = obj;
            return;
        }
    }
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject(c_oAscTypeSelectElement.Slide, obj);
};
asc_docs_api.prototype.ExitHeader_Footer = function (pageNumber) {
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber)) {
        return;
    }
    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    global_mouseEvent.ClickCount = oldClickCount;
};
asc_docs_api.prototype.GetCurrentPixOffsetY = function () {
    return this.WordControl.m_dScrollY;
};
asc_docs_api.prototype.SetPaintFormat = function (value) {
    this.isPaintFormat = value;
    this.WordControl.m_oLogicDocument.Document_Format_Copy();
};
asc_docs_api.prototype.sync_PaintFormatCallback = function (value) {
    this.isPaintFormat = value;
    return this.asc_fireCallback("asc_onPaintFormatChanged", value);
};
asc_docs_api.prototype.ClearFormating = function () {
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Paragraph_ClearFormatting();
};
asc_docs_api.prototype.SetDeviceInputHelperId = function (idKeyboard) {
    if (window.ID_KEYBOARD_AREA === undefined && this.WordControl.m_oMainView != null) {
        window.ID_KEYBOARD_AREA = document.getElementById(idKeyboard);
        window.ID_KEYBOARD_AREA.onkeypress = function (e) {
            if (false === editor.WordControl.IsFocus) {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyPress(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        };
        window.ID_KEYBOARD_AREA.onkeydown = function (e) {
            if (false === editor.WordControl.IsFocus) {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyDown(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        };
    }
    window.ID_KEYBOARD_AREA.focus();
};
asc_docs_api.prototype.SetViewMode = function (isViewMode) {
    if (isViewMode) {
        this.isViewMode = true;
        this.ShowParaMarks = false;
        this.WordControl.m_bIsRuler = false;
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.HideRulers();
        if (null != this.WordControl.m_oLogicDocument) {
            this.WordControl.m_oLogicDocument.viewMode = true;
        }
    } else {
        if (this.bInit_word_control === true && this.FontLoader.embedded_cut_manager.bIsCutFontsUse) {
            this.isLoadNoCutFonts = true;
            this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
            this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, true);
            return;
        }
        if (this.bInit_word_control === true) {
            CollaborativeEditing.Apply_Changes();
            CollaborativeEditing.Release_Locks();
        }
        this.isUseEmbeddedCutFonts = false;
        this.isViewMode = false;
        this.WordControl.checkNeedRules();
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.OnResize(true);
        if (null != this.WordControl.m_oLogicDocument) {
            this.WordControl.m_oLogicDocument.viewMode = false;
        }
    }
};
asc_docs_api.prototype.SetUseEmbeddedCutFonts = function (bUse) {
    this.isUseEmbeddedCutFonts = bUse;
};
asc_docs_api.prototype.IsNeedDefaultFonts = function () {
    if (this.WordControl.m_oLogicDocument != null) {
        return true;
    }
    return false;
};
asc_docs_api.prototype.can_AddHyperlink = function () {
    var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd();
    if (true === bCanAdd) {
        return this.WordControl.m_oLogicDocument.Get_SelectedText(true);
    }
    return false;
};
asc_docs_api.prototype.add_Hyperlink = function (HyperProps) {
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Add(HyperProps);
    }
};
asc_docs_api.prototype.sync_HyperlinkClickCallback = function (Url) {
    var indAction = Url.indexOf("ppaction://hlink");
    if (0 == indAction) {
        if (Url == "ppaction://hlinkshowjump?jump=firstslide") {
            this.WordControl.GoToPage(0);
        } else {
            if (Url == "ppaction://hlinkshowjump?jump=lastslide") {
                this.WordControl.GoToPage(this.WordControl.m_oDrawingDocument.SlidesCount - 1);
            } else {
                if (Url == "ppaction://hlinkshowjump?jump=nextslide") {
                    this.WordControl.onNextPage();
                } else {
                    if (Url == "ppaction://hlinkshowjump?jump=previousslide") {
                        this.WordControl.onPrevPage();
                    } else {
                        var mask = "ppaction://hlinksldjumpslide";
                        var indSlide = Url.indexOf(mask);
                        if (0 == indSlide) {
                            var slideNum = parseInt(Url.substring(mask.length));
                            if (slideNum >= 0 && slideNum < this.WordControl.m_oDrawingDocument.SlidesCount) {
                                this.WordControl.GoToPage(slideNum);
                            }
                        }
                    }
                }
            }
        }
        return;
    }
    this.asc_fireCallback("asc_onHyperlinkClick", Url);
};
asc_docs_api.prototype.UpdateInterfaceState = function () {
    if (this.WordControl.m_oLogicDocument != null) {
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        this.WordControl.CheckLayouts(true);
    }
};
asc_docs_api.prototype.OnMouseUp = function (x, y) {
    var _e = CreateMouseUpEventObject(x, y);
    Window_OnMouseUp(_e);
};
asc_docs_api.prototype.OnHandleMessage = function (event) {
    if (null != event && null != event.data) {
        var data = JSON.parse(event.data);
        if (null != data && null != data.type) {
            if (PostMessageType.UploadImage == data.type) {
                editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                if (c_oAscServerError.NoError == data.error) {
                    this.AddImageUrl(data.url);
                } else {
                    this.sync_ErrorCallback(_mapAscServerErrorToAscError(data.error), c_oAscError.Level.NoCritical);
                }
            }
        }
    }
};
asc_docs_api.prototype.asyncImageEndLoaded2 = null;
asc_docs_api.prototype.ChangeTheme = function (indexTheme) {
    if (!this.isViewMode && this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Theme) === false) {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.ThemeLoader.StartLoadTheme(indexTheme);
    }
};
asc_docs_api.prototype.StartLoadTheme = function () {};
asc_docs_api.prototype.EndLoadTheme = function (theme_load_info) {
    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadTheme);
    var _array = this.WordControl.Thumbnails.GetSelectedArray();
    if (_array.length <= 1) {
        this.WordControl.m_oLogicDocument.changeTheme(theme_load_info);
    } else {
        this.WordControl.m_oLogicDocument.changeTheme2(theme_load_info, _array);
    }
    this.WordControl.ThemeGenerateThumbnails(theme_load_info.Master);
    this.WordControl.CheckLayouts();
};
asc_docs_api.prototype.ChangeLayout = function (layout_index) {
    var _array = this.WordControl.Thumbnails.GetSelectedArray();
    var _master = this.WordControl.MasterLayouts;
    this.WordControl.m_oLogicDocument.changeLayout(_array, this.WordControl.MasterLayouts, layout_index);
};
asc_docs_api.prototype.put_ShapesAlign = function (type) {
    switch (type) {
    case c_oAscAlignShapeType.ALIGN_LEFT:
        this.shapes_alignLeft();
        break;
    case c_oAscAlignShapeType.ALIGN_RIGHT:
        this.shapes_alignRight();
        break;
    case c_oAscAlignShapeType.ALIGN_TOP:
        this.shapes_alignTop();
        break;
    case c_oAscAlignShapeType.ALIGN_BOTTOM:
        this.shapes_alignBottom();
        break;
    case c_oAscAlignShapeType.ALIGN_CENTER:
        this.shapes_alignCenter();
        break;
    case c_oAscAlignShapeType.ALIGN_MIDDLE:
        this.shapes_alignMiddle();
        break;
    default:
        break;
    }
};
asc_docs_api.prototype.DistributeHorizontally = function () {
    this.WordControl.m_oLogicDocument.distributeHor();
};
asc_docs_api.prototype.DistributeVertically = function () {
    this.WordControl.m_oLogicDocument.distributeVer();
};
asc_docs_api.prototype.shapes_alignLeft = function () {
    this.WordControl.m_oLogicDocument.alignLeft();
};
asc_docs_api.prototype.shapes_alignRight = function () {
    this.WordControl.m_oLogicDocument.alignRight();
};
asc_docs_api.prototype.shapes_alignTop = function () {
    this.WordControl.m_oLogicDocument.alignTop();
};
asc_docs_api.prototype.shapes_alignBottom = function () {
    this.WordControl.m_oLogicDocument.alignBottom();
};
asc_docs_api.prototype.shapes_alignCenter = function () {
    this.WordControl.m_oLogicDocument.alignCenter();
};
asc_docs_api.prototype.shapes_alignMiddle = function () {
    this.WordControl.m_oLogicDocument.alignMiddle();
};
asc_docs_api.prototype.shapes_bringToFront = function () {
    this.WordControl.m_oLogicDocument.bringToFront();
};
asc_docs_api.prototype.shapes_bringForward = function () {
    this.WordControl.m_oLogicDocument.bringForward();
};
asc_docs_api.prototype.shapes_bringToBack = function () {
    this.WordControl.m_oLogicDocument.sendToBack();
};
asc_docs_api.prototype.shapes_bringBackward = function () {
    this.WordControl.m_oLogicDocument.bringBackward();
};
asc_docs_api.prototype.sync_endDemonstration = function () {
    this.asc_fireCallback("asc_onEndDemonstration");
};
asc_docs_api.prototype.sync_DemonstrationSlideChanged = function (slideNum) {
    this.asc_fireCallback("asc_onDemonstrationSlideChanged", slideNum);
};
asc_docs_api.prototype.StartDemonstration = function (div_id, slidestart_num) {
    this.WordControl.DemonstrationManager.Start(div_id, slidestart_num, true);
};
asc_docs_api.prototype.EndDemonstration = function () {
    this.WordControl.DemonstrationManager.End();
};
asc_docs_api.prototype.DemonstrationPlay = function () {
    this.WordControl.DemonstrationManager.Play();
};
asc_docs_api.prototype.DemonstrationPause = function () {
    this.WordControl.DemonstrationManager.Pause();
};
asc_docs_api.prototype.DemonstrationEndShowMessage = function (message) {
    this.WordControl.DemonstrationManager.EndShowMessage = message;
};
asc_docs_api.prototype.DemonstrationNextSlide = function () {
    this.WordControl.DemonstrationManager.NextSlide();
};
asc_docs_api.prototype.DemonstrationPrevSlide = function () {
    this.WordControl.DemonstrationManager.PrevSlide();
};
asc_docs_api.prototype.DemonstrationGoToSlide = function (slideNum) {
    this.WordControl.DemonstrationManager.GoToSlide(slideNum);
};
asc_docs_api.prototype.ApplySlideTiming = function (oTiming) {
    if (this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_SlideTiming) === false) {
        History.Create_NewPoint();
        var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
        var _cur = this.WordControl.m_oDrawingDocument.SlideCurrent;
        if (_cur < 0 || _cur >= _count) {
            return;
        }
        var _curSlide = this.WordControl.m_oLogicDocument.Slides[_cur];
        _curSlide.applyTiming(oTiming);
    }
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};
asc_docs_api.prototype.SlideTimingApplyToAll = function () {
    var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
    var _cur = this.WordControl.m_oDrawingDocument.SlideCurrent;
    var _slides = this.WordControl.m_oLogicDocument.Slides;
    if (_cur < 0 || _cur >= _count) {
        return;
    }
    var _curSlide = _slides[_cur];
    _curSlide.timing.makeDuplicate(this.WordControl.m_oLogicDocument.DefaultSlideTiming);
    var _default = this.WordControl.m_oLogicDocument.DefaultSlideTiming;
    for (var i = 0; i < _count; i++) {
        if (i == _cur) {
            continue;
        }
        _default.makeDuplicate(_slides[i].timing);
    }
};
asc_docs_api.prototype.SlideTransitionPlay = function () {
    var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
    var _cur = this.WordControl.m_oDrawingDocument.SlideCurrent;
    if (_cur < 0 || _cur >= _count) {
        return;
    }
    var _timing = this.WordControl.m_oLogicDocument.Slides[_cur].timing;
    var _tr = this.WordControl.m_oDrawingDocument.TransitionSlide;
    _tr.Type = _timing.TransitionType;
    _tr.Param = _timing.TransitionOption;
    _tr.Duration = _timing.TransitionDuration;
    _tr.Start(true);
};
asc_docs_api.prototype.SetTextBoxInputMode = function (bIsEA) {
    this.WordControl.SetTextBoxMode(bIsEA);
};
asc_docs_api.prototype.GetTextBoxInputMode = function () {
    return this.WordControl.TextBoxInputMode;
};
asc_docs_api.prototype.asc_setCoAuthoringEnable = function (isCoAuthoringEnable) {
    this.isCoAuthoringEnable = !!isCoAuthoringEnable;
};
asc_docs_api.prototype.sync_EndAddShape = function () {
    editor.asc_fireCallback("asc_onEndAddShape");
    if (this.WordControl.m_oDrawingDocument.m_sLockedCursorType == "crosshair") {
        this.WordControl.m_oDrawingDocument.UnlockCursorType();
    }
};
asc_docs_api.prototype.asc_getChartObject = function () {
    this.isChartEditor = true;
    var graphicObject = this.WordControl.m_oLogicDocument.Get_ChartObject();
    for (var i = 0; i < this.WordControl.m_oDrawingDocument.GuiControlColorsMap.length; i++) {
        graphicObject.chart.themeColors.push(this.WordControl.m_oDrawingDocument.GuiControlColorsMap[i].get_hex());
    }
    return graphicObject;
};
asc_docs_api.prototype.asc_addChartDrawingObject = function (chartBinary) {
    if (isObject(chartBinary)) {
        var binary = chartBinary["binary"];
        History.Create_NewPoint();
        this.WordControl.m_oLogicDocument.addChart(binary);
    }
};
asc_docs_api.prototype.asc_editChartDrawingObject = function (chartBinary) {
    if (isObject(chartBinary)) {
        var binary = chartBinary["binary"];
        if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props)) {
            History.Create_NewPoint();
            this.WordControl.m_oLogicDocument.Edit_Chart(binary);
        }
    }
};
asc_docs_api.prototype.asc_getChartPreviews = function (chartType, chartSubType) {
    if (this.chartPreviewManager.isReady()) {
        return this.chartPreviewManager.getChartPreviews(chartType, chartSubType);
    }
};
asc_docs_api.prototype.sync_closeChartEditor = function () {
    this.asc_fireCallback("asc_onCloseChartEditor");
};
function CContextMenuData() {
    this.Type = c_oAscContextMenuTypes.Main;
    this.X_abs = 0;
    this.Y_abs = 0;
    this.IsSlideSelect = true;
}
CContextMenuData.prototype.get_Type = function () {
    return this.Type;
};
CContextMenuData.prototype.get_X = function () {
    return this.X_abs;
};
CContextMenuData.prototype.get_Y = function () {
    return this.Y_abs;
};
CContextMenuData.prototype.get_IsSlideSelect = function () {
    return this.IsSlideSelect;
};
asc_docs_api.prototype.sync_ContextMenuCallback = function (Data) {
    this.asc_fireCallback("asc_onContextMenu", Data);
};
var cCharDelimiter = String.fromCharCode(5);
function getURLParameter(name) {
    return (RegExp(name + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1];
}
function sendCommand(editor, fCallback, rdata) {
    var sData;
    if (null != rdata["data"] && "string" === typeof(rdata["data"]) && rdata["data"].length > g_nMaxJsonLengthChecked) {
        var sTemp = rdata["data"];
        rdata["data"] = null;
        sData = "mnuSaveAs" + cCharDelimiter + JSON.stringify(rdata) + cCharDelimiter + sTemp;
    } else {
        sData = JSON.stringify(rdata);
    }
    asc_ajax({
        type: "POST",
        url: g_sMainServiceLocalUrl,
        data: sData,
        error: function (jqXHR, textStatus, errorThrown) {
            editor.asc_fireCallback("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
            if (fCallback) {
                fCallback();
            }
        },
        success: function (msg) {
            var incomeObject = JSON.parse(msg);
            switch (incomeObject["type"]) {
            case "open":
                var sJsonUrl = g_sResourceServiceLocalUrl + incomeObject["data"];
                asc_ajax({
                    url: sJsonUrl,
                    dataType: "text",
                    success: function (result, textStatus) {
                        var url;
                        var nIndex = sJsonUrl.lastIndexOf("/");
                        if (-1 != nIndex) {
                            url = sJsonUrl.substring(0, nIndex + 1);
                        } else {
                            url = sJsonUrl;
                        }
                        var bIsViewer = false;
                        if (result.length > 0) {
                            if (c_oSerFormat.Signature != result.substring(0, c_oSerFormat.Signature.length)) {
                                bIsViewer = true;
                            }
                        }
                        if (true == bIsViewer) {
                            editor.OpenDocument(url, result);
                        } else {
                            editor.OpenDocument2(url, result);
                        }
                        editor.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
                        editor.sync_DocSizeCallback(Page_Width, Page_Height);
                        editor.sync_PageOrientCallback(editor.get_DocumentOrientation());
                        if (fCallback) {
                            fCallback(incomeObject);
                        }
                    },
                    error: function () {
                        editor.asc_fireCallback("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
                        if (fCallback) {
                            fCallback();
                        }
                    }
                });
                break;
            case "waitopen":
                if (incomeObject["data"]) {
                    editor._lastConvertProgress = incomeObject["data"] / 2;
                    editor.sync_SendProgress(editor._lastConvertProgress);
                }
                var rData = {
                    "id": documentId,
                    "userid": documentUserId,
                    "format": documentFormat,
                    "vkey": documentVKey,
                    "editorid": c_oEditorId.Presentation,
                    "c": "chopen"
                };
                setTimeout(function () {
                    sendCommand(editor, fCallback, rData);
                },
                3000);
                break;
            case "save":
                if (fCallback) {
                    fCallback(incomeObject);
                }
                break;
            case "waitsave":
                var rData = {
                    "id": documentId,
                    "userid": documentUserId,
                    "vkey": documentVKey,
                    "title": documentTitleWithoutExtention,
                    "c": "chsave",
                    "data": incomeObject["data"]
                };
                setTimeout(function () {
                    sendCommand(editor, fCallback, rData);
                },
                3000);
                break;
            case "savepart":
                var outputData = JSON.parse(incomeObject["data"]);
                _downloadAs(editor, outputData["format"], fCallback, false, outputData["savekey"]);
                break;
            case "getsettings":
                if (fCallback) {
                    fCallback(incomeObject);
                }
                break;
            case "err":
                var nErrorLevel = c_oAscError.Level.NoCritical;
                if ("getsettings" == rdata["c"] || "open" == rdata["c"] || "chopen" == rdata["c"] || "create" == rdata["c"]) {
                    nErrorLevel = c_oAscError.Level.Critical;
                }
                editor.asc_fireCallback("asc_onError", _mapAscServerErrorToAscError(parseInt(incomeObject["data"])), nErrorLevel);
                if (fCallback) {
                    fCallback(incomeObject);
                }
                break;
            default:
                if (fCallback) {
                    fCallback(incomeObject);
                }
                break;
            }
        }
    });
}
function sendTrack(fCallback, url, rdata) {
    asc_ajax({
        type: "POST",
        url: url,
        data: rdata,
        error: function (jqXHR, textStatus, errorThrown) {
            if (fCallback) {
                fCallback();
            }
        },
        success: function (msg) {
            var incomeObject = JSON.parse(msg);
            if (fCallback) {
                fCallback(incomeObject);
            }
        }
    });
}
function _downloadAs(editor, filetype, fCallback, bStart, sSaveKey) {
    var sData;
    var oAdditionalData = new Object();
    oAdditionalData["c"] = "save";
    oAdditionalData["id"] = documentId;
    oAdditionalData["userid"] = documentUserId;
    oAdditionalData["vkey"] = documentVKey;
    oAdditionalData["outputformat"] = filetype;
    if (null != sSaveKey) {
        oAdditionalData["savekey"] = sSaveKey;
    }
    if (c_oAscFileType.PDF == filetype) {
        var dd = editor.WordControl.m_oDrawingDocument;
        if (dd.isComleteRenderer2()) {
            if (false == bStart) {
                oAdditionalData["savetype"] = "complete";
            } else {
                oAdditionalData["savetype"] = "completeall";
            }
        } else {
            if (false == bStart) {
                oAdditionalData["savetype"] = "part";
            } else {
                oAdditionalData["savetype"] = "partstart";
            }
        }
        oAdditionalData["data"] = dd.ToRendererPart();
        sendCommand(editor, fCallback, oAdditionalData);
    } else {
        oAdditionalData["savetype"] = "completeall";
        oAdditionalData["data"] = editor.WordControl.SaveDocument();
        sendCommand(editor, fCallback, oAdditionalData);
    }
}
function _getFullImageSrc(src) {
    if (0 == src.indexOf("theme")) {
        return editor.ThemeLoader.ThemesUrl + src;
    }
    if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
        if (0 == src.indexOf(editor.DocumentUrl)) {
            return src;
        }
        return editor.DocumentUrl + "media/" + src;
    } else {
        return src;
    }
}
function _mapAscServerErrorToAscError(nServerError) {
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
}
function asc_ajax(obj) {
    var url = "",
    type = "GET",
    async = true,
    data = null,
    dataType = "text/xml",
    error = null,
    success = null,
    httpRequest = null,
    init = function (obj) {
        if (typeof(obj.url) != "undefined") {
            url = obj.url;
        }
        if (typeof(obj.type) != "undefined") {
            type = obj.type;
        }
        if (typeof(obj.async) != "undefined") {
            async = obj.async;
        }
        if (typeof(obj.data) != "undefined") {
            data = obj.data;
        }
        if (typeof(obj.dataType) != "undefined") {
            dataType = obj.dataType;
        }
        if (typeof(obj.error) != "undefined") {
            error = obj.error;
        }
        if (typeof(obj.success) != "undefined") {
            success = obj.success;
        }
        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
            if (httpRequest.overrideMimeType) {
                httpRequest.overrideMimeType(dataType);
            }
        } else {
            if (window.ActiveXObject) {
                try {
                    httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(e) {
                    try {
                        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch(e) {}
                }
            }
        }
        httpRequest.onreadystatechange = function () {
            respons(this);
        };
        send();
    },
    send = function () {
        httpRequest.open(type, url, async);
        if (type === "POST") {
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        httpRequest.send(data);
    },
    respons = function (httpRequest) {
        switch (httpRequest.readyState) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            if (httpRequest.status == 200 || httpRequest.status == 1223) {
                if (typeof success === "function") {
                    success(httpRequest.responseText);
                }
            } else {
                if (typeof error === "function") {
                    error(httpRequest, httpRequest.statusText, httpRequest.status);
                }
            }
            break;
        }
    };
    init(obj);
}