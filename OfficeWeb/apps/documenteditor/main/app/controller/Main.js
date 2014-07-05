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
 var ApplyEditRights = -255;
var LoadingDocument = -256;
Ext.define("DE.controller.Main", {
    extend: "Ext.app.Controller",
    uses: ["Common.component.LoadMask", "Ext.window.MessageBox", "DE.view.ChromeRecommendation", "Ext.util.Cookies"],
    stores: ["Common.store.Users"],
    views: ["Common.view.Header", "DocumentHolder", "DocumentInfo"],
    refs: [{
        ref: "header",
        selector: "commonheader"
    },
    {
        ref: "statusInfo",
        selector: "documentstatusinfo"
    },
    {
        ref: "mainMenu",
        selector: "demainmenu"
    },
    {
        ref: "fileMenu",
        selector: "defile"
    },
    {
        ref: "documentHolder",
        selector: "dedocumentholder"
    },
    {
        ref: "viewport",
        selector: "deviewport"
    },
    {
        ref: "rightPanel",
        selector: "derightpanel"
    },
    {
        ref: "rightMenu",
        selector: "derightmenu"
    },
    {
        ref: "documentInfo",
        selector: "dedocumentinfo"
    },
    {
        ref: "documentHelp",
        selector: "dedocumenthelp"
    },
    {
        ref: "toolbar",
        selector: "detoolbar"
    },
    {
        ref: "documentSettings",
        selector: "dedocumentsettings"
    },
    {
        ref: "chatPanel",
        selector: "commonchatpanel"
    }],
    init: function () {
        this.getController("DocumentHolder").init();
        if (Ext.isSafari && Ext.safariVersion >= 7) {
            Ext.getBody().on("mousewheel", function (e) {
                e.stopEvent();
            },
            this);
        }
        this.control({
            "dedocumentholder": {
                resize: this.onDocumentHolderResize
            },
            "defile": {
                editdocument: this.requestEditRights
            },
            "demainmenu": {
                panelshow: function (panel, fullscale) {
                    if (this.api) {
                        if (fullscale) {
                            this.fullscalemenu = true;
                            this.api.asc_enableKeyEvents(false);
                        } else {
                            if (!Ext.isEmpty(panel.query("commonchatpanel"))) {
                                Ext.defer(function () {
                                    Ext.getCmp("id-chat-textarea").focus();
                                },
                                100);
                                var btnChat = Ext.getCmp("id-menu-chat");
                                btnChat && btnChat.removeCls("notify");
                                this.api.asc_enableKeyEvents(false);
                            } else {
                                if (!Ext.isEmpty(panel.query("commoncommentspanel"))) {
                                    if (!this.isLiveCommenting) {
                                        this.api.asc_showComments();
                                    }
                                    this.onEditComplete();
                                }
                            }
                        }
                    }
                },
                panelhide: function (panel, fullscale) {
                    if (this.api) {
                        if (!this.isLiveCommenting) {
                            this.api.asc_hideComments();
                        }
                        if (fullscale) {
                            this.fullscalemenu = false;
                        }
                        this.onEditComplete();
                    }
                }
            },
            "detoolbar": {
                inserttable: this.onInsertTable,
                insertimage: this.onInsertImage,
                insertchart: this.onInsertChart,
                insertshape: this.onInsertShape
            },
            "dedocumentsettings": {
                savedocsettings: function () {
                    var value = window.localStorage.getItem("de-settings-livecomment");
                    this.isLiveCommenting = !(value !== null && parseInt(value) == 0);
                    this.getDocumentHolder().setLiveCommenting(this.isLiveCommenting);
                    if (this.isLiveCommenting) {
                        this.api.asc_showComments();
                    } else {
                        this.api.asc_hideComments();
                    }
                },
                changemeasureunit: function () {
                    var value = window.localStorage.getItem("de-settings-unit");
                    Common.MetricSettings.setCurrentMetric((value !== null) ? parseInt(value) : Common.MetricSettings.c_MetricUnits.cm);
                    this.getRightPanel().updateMetricUnit();
                }
            }
        });
    },
    onLaunch: function () {
        window.storagename = "text";
        this.stackLongActions = new Common.IrregularStack({
            strongCompare: function (obj1, obj2) {
                return obj1.id === obj2.id && obj1.type === obj2.type;
            },
            weakCompare: function (obj1, obj2) {
                return obj1.type === obj2.type;
            }
        });
        if (typeof isBrowserSupported !== "undefined" && !isBrowserSupported()) {
            Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
            return;
        } else {
            var viewport = this.getViewport();
            if (!viewport) {
                throw Error("DE.controller.Main failed: could not get Viewport.");
            }
            viewport.applicationUI.setVisible(true);
        }
        var value = window.localStorage.getItem("de-settings-fontrender");
        if (value === null) {
            window.devicePixelRatio > 1 ? value = "1" : "0";
        }
        this.api = new asc_docs_api("editor_sdk");
        switch (value) {
        case "0":
            this.api.SetFontRenderingMode(3);
            break;
        case "1":
            this.api.SetFontRenderingMode(1);
            break;
        case "2":
            this.api.SetFontRenderingMode(2);
            break;
        }
        this.api.CreateComponents();
        this.api.SetDrawingFreeze(true);
        this.api.SetFontsPath("../../../sdk/Fonts/");
        this.api.Init();
        this.api.asc_registerCallback("asc_onError", Ext.bind(this.onError, this));
        this.api.asc_registerCallback("asc_onDocumentContentReady", Ext.bind(this.onDocumentContentReady, this));
        this.api.asc_registerCallback("asc_onOpenDocumentProgress2", Ext.bind(this.onOpenDocument, this));
        this.getStatusInfo().setApi(this.api).addListener("editcomplete", this.onEditComplete, this);
        this.editorConfig = {};
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
        Common.Gateway.on("showmessage", Ext.bind(this.onExternalMessage, this));
        Common.Gateway.on("opendocument", Ext.bind(this.loadDocument, this));
        Common.Gateway.ready();
        this.initNames();
        this.recognizeBrowser();
        Ext.isIE = Common.userAgent.isIE;
        Ext.isIE9 = Common.userAgent.ieVersion == 9;
    },
    bindComponent: function (xtype) {
        var a = Ext.ComponentQuery.query(xtype);
        for (var i = 0; i < a.length; ++i) {
            a[i].addListener("editcomplete", this.onEditComplete, this);
        }
    },
    loadConfig: function (data) {
        this.editorConfig = Ext.merge(this.editorConfig, data.config);
        if ((this.editorConfig.user === undefined || this.editorConfig.user === null)) {
            this.editorConfig.user = {};
            if (this.editorConfig.users) {
                this.editorConfig.userId = this.editorConfig.userId || 0;
                for (var i = 0; i < this.editorConfig.users.length; i++) {
                    if (this.editorConfig.users[i].id === this.editorConfig.userId) {
                        this.editorConfig.user = {
                            id: this.editorConfig.users[i].id,
                            name: this.editorConfig.users[i].username
                        };
                        break;
                    }
                }
            }
        }
        this.editorConfig.user.id = this.editorConfig.user.id || ("uid-" + Ext.Date.now());
        this.editorConfig.user.name = this.editorConfig.user.name || this.textAnonymous;
        this.getHeader().setCanBack(this.editorConfig.canBackToFolder === true);
        if (this.editorConfig.lang) {
            this.api.asc_setLocale(this.editorConfig.lang);
        }
    },
    applyModeCommonElements: function () {
        window.editor_elements_prepared = true;
        var mode = {
            canDownload: this.editorConfig.nativeApp !== true && (this.permissions.download !== undefined ? this.permissions.download : true),
            canEdit: this.permissions.edit === true,
            isEdit: this.modeEdit,
            canBack: this.editorConfig.nativeApp !== true && this.editorConfig.canBackToFolder === true,
            canOpenRecent: this.editorConfig.nativeApp !== true && this.editorConfig.recent !== undefined,
            canCreateNew: !Ext.isEmpty(this.editorConfig.createUrl),
            nativeApp: this.editorConfig.nativeApp === true,
            canCoAuthoring: this.editorConfig.canCoAuthoring === true,
            user: this.editorConfig.user,
            canAutosave: this.canAutosave
        };
        var value = window.localStorage.getItem("de-hidden-title");
        value = this.modeEdit && (value !== null && parseInt(value) == 1);
        this.getHeader().setHeaderCaption(this.modeEdit ? "Document Editor" : "Document Viewer");
        this.getHeader().setVisible(mode.nativeApp !== true && !value);
        this.getViewport().setMode(mode, true);
        this.getDocumentHolder().setMode(mode);
        this.getMainMenu().setVisible(true);
        this.getStatusInfo().setDisabled(false);
        this.getStatusInfo().setMode(mode);
        this.getFileMenu() && this.getFileMenu().setMode(mode, false);
        var commentsPanelCmp = Ext.getCmp("id-menu-comments"),
        chatPanelCmp = Ext.getCmp("id-menu-chat");
        if (mode.canCoAuthoring) {
            commentsPanelCmp[mode.isEdit ? "show" : "hide"]();
            chatPanelCmp.show();
        } else {
            chatPanelCmp.hide();
            commentsPanelCmp.hide();
        }
    },
    applyModeEditorElements: function (prevmode) {
        if (this.modeEdit) {
            var me = this;
            window.editor_elements_prepared = false;
            var onsuccess = function () {
                if (typeof Common.Locale !== "undefined") {
                    Common.Locale.apply();
                }
                me.getController("Common.controller.Fonts").init();
                me.getController("Common.controller.Fonts").setApi(me.api);
                me.getController("DE.controller.Toolbar").init();
                me.getController("DE.controller.Toolbar").setApi(me.api);
                me.getController("Common.controller.CommentsList").init();
                me.getController("Common.controller.CommentsList").setConfig({
                    config: me.editorConfig
                },
                me.api);
                me.getController("Common.controller.CommentsList").doDelayedTask();
                me.getController("Common.controller.CommentsPopover").init();
                me.getController("Common.controller.CommentsPopover").setConfig({
                    config: me.editorConfig
                },
                me.api);
                me.getController("Common.controller.CommentsPopover").onDocumentContentReady();
                if (prevmode == "view") {
                    me.getController("Common.controller.CommentsList").onApiAddComments(me.api.asc_getComments());
                    me.getController("Common.controller.CommentsList").registerCallbacks();
                    me.getController("Common.controller.CommentsPopover").registerCallbacks();
                }
                me.getViewport().applyEditorMode();
                var mode = {
                    canDownload: me.editorConfig.nativeApp !== true && (me.permissions.download !== undefined ? me.permissions.download : true),
                    canEdit: me.permissions.edit === true,
                    isEdit: me.modeEdit,
                    canBack: me.editorConfig.nativeApp !== true && me.editorConfig.canBackToFolder === true,
                    canOpenRecent: me.editorConfig.nativeApp !== true && me.editorConfig.recent !== undefined,
                    canCreateNew: !Ext.isEmpty(me.editorConfig.createUrl),
                    nativeApp: me.editorConfig.nativeApp === true,
                    canCoAuthoring: me.editorConfig.canCoAuthoring === true
                };
                me.getToolbar().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                me.getToolbar().setMode(mode);
                me.getRightMenu().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                me.getRightPanel().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                me.getRightPanel().setMode(mode);
                window.editor_elements_prepared = true;
                var value = window.localStorage.getItem("de-settings-unit");
                Common.MetricSettings.setCurrentMetric((value !== null) ? parseInt(value) : Common.MetricSettings.c_MetricUnits.cm);
                me.api.asc_registerCallback("asc_onDocumentModifiedChanged", Ext.bind(me.onDocumentModifiedChanged, me));
                me.api.asc_registerCallback("asc_onSaveUrl", Ext.bind(me.onSaveUrl, me));
                me.api.asc_registerCallback("asc_onCollaborativeChanges", Ext.bind(me.onCollaborativeChanges, me));
                me.getStatusInfo().setCaption("");
                if (me.stackLongActions.exist({
                    id: ApplyEditRights,
                    type: c_oAscAsyncActionType["BlockInteraction"]
                })) {
                    me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], ApplyEditRights);
                } else {
                    if (!this._isDocReady) {
                        me.hidePreloader();
                        me.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                    }
                }
                window.onbeforeunload = Ext.bind(me.onBeforeUnload, me);
            };
            this.getStatusInfo().setCaption(this.txtEditingMode);
            this.loadEditorStylesheets(onsuccess);
        }
    },
    loadLanguages: function () {
        if (this.api) {
            var arr = this.api.asc_getSpellCheckLanguages();
            this.getDocumentHolder().setLanguages(arr);
            this.getStatusInfo().setLanguages(arr);
        }
    },
    onEditorPermissions: function (params) {
        this.permissions.edit !== false && (this.permissions.edit = params.asc_getCanEdit());
        this.permissions.download !== false && (this.permissions.download = params.asc_getCanDownload());
        this.modeEdit = this.permissions.edit === true && this.editorConfig.mode !== "view";
        this.canAutosave = (params.asc_getIsAutosaveEnable()) ? params.asc_getAutosaveMinInterval() : -1;
        this.editorConfig.canCoAuthoring !== false && (this.editorConfig.canCoAuthoring = params.asc_getCanCoAuthoring());
        if (this.editorConfig.canAutosave === false) {
            this.canAutosave = -1;
            this.api.asc_setAutoSaveGap(0);
        }
        if (this.editorConfig.branding && params.asc_getCanBranding()) {
            this.getHeader().setBranding(this.editorConfig.branding);
        }
        this.applyModeCommonElements();
        this.applyModeEditorElements();
        this.api.asc_setCoAuthoringEnable(this.editorConfig.canCoAuthoring === true);
        this.api.SetViewMode(!this.modeEdit);
        this.api.LoadDocument();
        if (!this.modeEdit) {
            this.hidePreloader();
            this.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
        }
    },
    loadDocument: function (data) {
        this.permissions = {};
        this.document = data.doc;
        var docInfo = {};
        if (data.doc) {
            this.permissions = Ext.merge(this.permissions, data.doc.permissions);
            docInfo = new CDocInfo();
            docInfo.put_Id(data.doc.key);
            docInfo.put_Url(data.doc.url);
            docInfo.put_Title(data.doc.title);
            docInfo.put_Format(data.doc.fileType);
            docInfo.put_VKey(data.doc.vkey);
            docInfo.put_Options(data.doc.options);
            docInfo.put_UserId(this.editorConfig.user.id);
            docInfo.put_UserName(this.editorConfig.user.name);
            docInfo.put_OfflineApp(this.editorConfig.nativeApp === true);
        }
        this.api.asc_registerCallback("asc_onGetEditorPermissions", Ext.bind(this.onEditorPermissions, this));
        this.api.asc_setDocInfo(docInfo);
        this.api.asc_getEditorPermissions();
        if (data.doc) {
            this.getHeader().setDocumentCaption(data.doc.title);
        }
    },
    onProcessSaveResult: function (data) {
        this.api.asc_OnSaveEnd(data.result);
        if (data && data.result === false) {
            Ext.Msg.show({
                title: this.criticalErrorTitle,
                msg: Ext.isEmpty(data.message) ? this.errorProcessSaveResult : data.message,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
        }
    },
    onProcessRightsChange: function (data) {
        if (data && data.enabled === false) {
            this.api.asc_coAuthoringDisconnect();
            this.getDocumentInfo().onLostEditRights();
            Ext.Msg.show({
                title: this.notcriticalErrorTitle,
                msg: Ext.isEmpty(data.message) ? this.warnProcessRightsChange : data.message,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
        }
    },
    onProcessMouse: function (data) {
        if (data.type == "mouseup") {
            var e = document.getElementById("editor_sdk");
            if (e) {
                var r = e.getBoundingClientRect();
                this.api.OnMouseUp(data.x - r.left, data.y - r.top);
            }
        }
    },
    goBack: function () {
        Common.Gateway.goBack();
    },
    onDocumentHolderResize: function () {
        if (this.api) {
            this.api.Resize();
            setTimeout(Ext.bind(function () {
                this.api.Resize();
                Ext.menu.Manager.hideAll();
            },
            this), 50);
        }
    },
    onEditComplete: function (cmp) {
        this.getMainMenu().closeFullScaleMenu();
        if (this.modeEdit && this.getToolbar() && (this.getToolbar().btnInsertShape.pressed || this.getToolbar().btnInsertText.pressed) && (!Ext.isObject(arguments[1]) || arguments[1].id !== "toolbar-button-insert-shape")) {
            if (this.api) {
                this.api.StartAddShape("", false);
            }
            this.getToolbar().btnInsertShape.toggle(false, false);
            this.getToolbar().btnInsertText.toggle(false, false);
        }
        this.getDocumentHolder().blur();
        this.getDocumentHolder().focus(false, 50);
    },
    onLongActionBegin: function (type, id) {
        var action = {
            id: id,
            type: type
        };
        this.stackLongActions.push(action);
        this.setLongActionView(action);
    },
    onLongActionEnd: function (type, id) {
        var action = {
            id: id,
            type: type
        };
        this.stackLongActions.pop(action);
        this.getHeader().setDocumentCaption(this.api.get_DocumentName());
        this.updateWindowTitle();
        action = this.stackLongActions.get({
            type: c_oAscAsyncActionType.Information
        });
        action ? this.setLongActionView(action) : this.getStatusInfo().setCaption("");
        action = this.stackLongActions.get({
            type: c_oAscAsyncActionType.BlockInteraction
        });
        action ? this.setLongActionView(action) : this.loadMask && this.loadMask.hide();
        if (id == c_oAscAsyncAction["Save"]) {
            this.synchronizeChanges();
        }
        this.onEditComplete(this.loadMask);
        this.api.asc_enableKeyEvents(true);
    },
    setLongActionView: function (action) {
        var title = "",
        text = "";
        switch (action.id) {
        case c_oAscAsyncAction["Open"]:
            title = this.openTitleText;
            text = this.openTextText;
            break;
        case c_oAscAsyncAction["Save"]:
            title = this.saveTitleText;
            text = this.saveTextText;
            break;
        case c_oAscAsyncAction["LoadDocumentFonts"]:
            title = this.loadFontsTitleText;
            text = this.loadFontsTextText;
            break;
        case c_oAscAsyncAction["LoadDocumentImages"]:
            title = this.loadImagesTitleText;
            text = this.loadImagesTextText;
            break;
        case c_oAscAsyncAction["LoadFont"]:
            title = this.loadFontTitleText;
            text = this.loadFontTextText;
            break;
        case c_oAscAsyncAction["LoadImage"]:
            title = this.loadImageTitleText;
            text = this.loadImageTextText;
            break;
        case c_oAscAsyncAction["DownloadAs"]:
            title = this.downloadTitleText;
            text = this.downloadTextText;
            break;
        case c_oAscAsyncAction["Print"]:
            title = this.printTitleText;
            text = this.printTextText;
            break;
        case c_oAscAsyncAction["UploadImage"]:
            title = this.uploadImageTitleText;
            text = this.uploadImageTextText;
            break;
        case c_oAscAsyncAction["ApplyChanges"]:
            title = this.applyChangesTitleText;
            text = this.applyChangesTextText;
            break;
        case c_oAscAsyncAction["PrepareToSave"]:
            title = this.savePreparingText;
            text = this.savePreparingTitle;
            break;
        case ApplyEditRights:
            title = this.txtEditingMode;
            text = this.txtEditingMode;
            break;
        case LoadingDocument:
            title = this.loadingDocumentTitleText;
            text = this.loadingDocumentTextText;
            break;
        }
        if (action.type == c_oAscAsyncActionType["BlockInteraction"]) {
            if (!this.loadMask) {
                this.loadMask = Ext.widget("cmdloadmask", Ext.getBody());
            }
            this.loadMask.setTitle(title);
            this.loadMask.show();
        } else {
            this.getStatusInfo().setCaption(text);
        }
    },
    onError: function (id, level, errData) {
        this.hidePreloader();
        this.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
        var config = {
            closable: false
        };
        switch (id) {
        case c_oAscError.ID.Unknown:
            config.msg = this.unknownErrorText;
            break;
        case c_oAscError.ID.ConvertationTimeout:
            config.msg = this.convertationTimeoutText;
            break;
        case c_oAscError.ID.ConvertationError:
            config.msg = this.convertationErrorText;
            break;
        case c_oAscError.ID.DownloadError:
            config.msg = this.downloadErrorText;
            break;
        case c_oAscError.ID.UplImageSize:
            config.msg = this.uploadImageSizeMessage;
            break;
        case c_oAscError.ID.UplImageExt:
            config.msg = this.uploadImageExtMessage;
            break;
        case c_oAscError.ID.UplImageFileCount:
            config.msg = this.uploadImageFileCountMessage;
            break;
        case c_oAscError.ID.SplitCellMaxRows:
            config.msg = this.splitMaxRowsErrorText.replace("%1", errData.get_Value());
            break;
        case c_oAscError.ID.SplitCellMaxCols:
            config.msg = this.splitMaxColsErrorText.replace("%1", errData.get_Value());
            break;
        case c_oAscError.ID.SplitCellRowsDivider:
            config.msg = this.splitDividerErrorText.replace("%1", errData.get_Value());
            break;
        case c_oAscError.ID.VKeyEncrypt:
            config.msg = this.errorKeyEncrypt;
            break;
        case c_oAscError.ID.KeyExpire:
            config.msg = this.errorKeyExpire;
            break;
        case c_oAscError.ID.UserCountExceed:
            config.msg = this.errorUsersExceed;
            break;
        case c_oAscError.ID.CoAuthoringDisconnect:
            config.msg = this.errorCoAuthoringDisconnect;
            break;
        case c_oAscError.ID.ConvertationPassword:
            config.msg = this.errorFilePassProtect;
            break;
        default:
            config.msg = this.errorDefaultMessage.replace("%1", id);
            break;
        }
        if (level == c_oAscError.Level.Critical) {
            Common.Gateway.reportError(id, config.msg);
            config.title = this.criticalErrorTitle;
            config.icon = Ext.Msg.ERROR;
            if (this.editorConfig.canBackToFolder) {
                config.msg += "<br/><br/>" + this.criticalErrorExtText + "<br/>&nbsp;";
                config.buttons = Ext.Msg.OK;
                config.fn = function (btn) {
                    if (btn == "ok") {
                        Common.Gateway.goBack();
                    }
                };
            }
        } else {
            config.title = this.notcriticalErrorTitle;
            config.icon = Ext.Msg.WARNING;
            config.buttons = Ext.Msg.OK;
            config.fn = Ext.bind(function (btn) {
                this.onEditComplete();
            },
            this);
        }
        Ext.Msg.show(config);
        Common.component.Analytics.trackEvent("Internal Error", id.toString());
    },
    onCoAuthoringDisconnect: function () {
        this.getFileMenu().setMode({
            isDisconnected: true
        });
        this.getViewport().setMode({
            isDisconnected: true
        });
    },
    onExternalMessage: function (msg) {
        if (msg) {
            var tip = msg.msg.charAt(0).toUpperCase() + msg.msg.substring(1);
            var title = (msg.severity.indexOf("error") >= 0) ? this.criticalErrorTitle : this.notcriticalErrorTitle;
            this.showTips([tip], false, title);
            Common.component.Analytics.trackEvent("External Error", msg.title);
        }
    },
    onApplyEditRights: function (data) {
        this.getStatusInfo().setCaption("");
        if (data) {
            if (data.allowed) {
                data.requestrights = true;
                this.modeEdit = true;
                this.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], ApplyEditRights);
                var me = this;
                setTimeout(function () {
                    me.api.SetViewMode(!me.modeEdit);
                    me.applyModeCommonElements();
                    me.applyModeEditorElements("view");
                    var timer_rp = setInterval(function () {
                        if (window.editor_elements_prepared) {
                            clearInterval(timer_rp);
                            me.getController("DE.controller.Toolbar").loadStyles();
                            me.getViewport().applyMode();
                            me.getRightMenu().createDelayedElements();
                            me.getRightPanel().createDelayedElements();
                            var timer_sl = setInterval(function () {
                                if (window.styles_loaded) {
                                    clearInterval(timer_sl);
                                    me.getToolbar().createDelayedElements();
                                    me.getController("DE.controller.Toolbar").createDelayedElements();
                                    me.getController("Common.controller.Fonts").loadFonts();
                                    me.getDocumentHolder().createDelayedElements();
                                    me.getDocumentHolder().changePosition();
                                    me.loadLanguages();
                                    me.getController("Search").setMode({
                                        isEdit: me.modeEdit
                                    });
                                    me.bindComponent.call(me, "deheaderfootersettings");
                                    me.bindComponent.call(me, "deimagesettings");
                                    me.bindComponent.call(me, "deparagraphsettings");
                                    me.bindComponent.call(me, "detablesettings");
                                    me.bindComponent.call(me, "deshapesettings");
                                    me.api.asc_registerCallback("asc_onSendThemeColors", Ext.bind(me._onSendThemeColors, me));
                                    var shapes = me.api.get_PropertyEditorShapes();
                                    if (shapes) {
                                        me.fillAutoShapes(shapes[0], shapes[1]);
                                    }
                                    var colors = me.api.get_PropertyThemeColors();
                                    if (colors) {
                                        me._onSendThemeColors(colors[0], colors[1]);
                                    }
                                    me.api.UpdateInterfaceState();
                                }
                            },
                            50);
                        }
                    },
                    50);
                },
                100);
            } else {
                Ext.Msg.show({
                    title: this.requestEditFailedTitleText,
                    msg: data.message || this.requestEditFailedMessageText,
                    icon: Ext.Msg.INFO,
                    buttons: Ext.Msg.OK
                });
            }
        }
    },
    onDocumentContentReady: function () {
        if (this._isDocReady) {
            return;
        }
        this._isDocReady = true;
        var hide_preloader = true;
        if (window.editor_elements_prepared) {
            this.api.SetDrawingFreeze(false);
            this.onDocumentHolderResize();
            this.hidePreloader();
            this.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
            hide_preloader = false;
        }
        var value;
        value = window.localStorage.getItem("de-settings-livecomment");
        this.isLiveCommenting = !(value !== null && parseInt(value) == 0);
        this.isLiveCommenting ? this.api.asc_showComments() : this.api.asc_hideComments();
        value = window.localStorage.getItem("de-settings-zoom");
        this.api.zoom((value !== null) ? parseInt(value) : 100);
        var me = this;
        setTimeout(function () {
            var tips = [],
            html = Ext.fly(document.body.parentNode);
            if (Ext.isSafari && Ext.safariVersion >= 7) {
                html.addCls("safari-7");
            }
            Common.userAgent.ieVersion == 9 && tips.push(me.warnBrowserIE9); ! Ext.isGecko && Math.abs(me.getBrowseZoomLevel() - 1) > 0.1 && tips.push(me.warnBrowserZoom);
            if (tips.length) {
                me.showTips(tips);
            }
            me.api.asc_registerCallback("asc_onStartAction", Ext.bind(me.onLongActionBegin, me));
            me.api.asc_registerCallback("asc_onEndAction", Ext.bind(me.onLongActionEnd, me));
            me.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(me.onCoAuthoringDisconnect, me));
            me.getHeader().setDocumentCaption(me.api.get_DocumentName());
            me.updateWindowTitle();
            value = window.localStorage.getItem("de-settings-inputmode");
            me.api.SetTextBoxInputMode(value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-settings-showchanges");
            me.api.SetCollaborativeMarksShowType((value !== null && parseInt(value) == 0) ? c_oAscCollaborativeMarksShowType.All : c_oAscCollaborativeMarksShowType.LastChanges);
            me.getController("Search").init();
            me.getController("Search").setApi(me.api);
            me.getController("Search").setMode({
                isEdit: me.modeEdit
            });
            me.getController("Common.controller.Chat").init();
            me.getController("Common.controller.Chat").setApi(me.api).loadConfig({
                config: me.editorConfig
            });
            me.getController("RecentFiles").init();
            me.getController("RecentFiles").loadConfig({
                config: me.editorConfig
            });
            me.getController("CreateFile").init();
            me.getController("CreateFile").setApi(me.api).applyConfig(me.editorConfig);
            me.getController("DocumentHolder").setApi(me.api);
            me.getViewport().createDelayedElements();
            me.getStatusInfo().createDelayedElements();
            me.getMainMenu().createDelayedElements();
            me.getChatPanel().createDelayedElements();
            var timer_rp = setInterval(function () {
                if (window.editor_elements_prepared) {
                    clearInterval(timer_rp);
                    if (hide_preloader) {
                        me.api.SetDrawingFreeze(false);
                        me.onDocumentHolderResize();
                        me.hidePreloader();
                        me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                    }
                    var mode = {
                        canDownload: me.editorConfig.nativeApp !== true && (me.permissions.download !== undefined ? me.permissions.download : true),
                        canEdit: me.permissions.edit === true,
                        isEdit: me.modeEdit,
                        canBack: me.editorConfig.nativeApp !== true && me.editorConfig.canBackToFolder === true,
                        canOpenRecent: me.editorConfig.nativeApp !== true && me.editorConfig.recent !== undefined,
                        canCreateNew: !Ext.isEmpty(me.editorConfig.createUrl),
                        nativeApp: me.editorConfig.nativeApp === true,
                        canCoAuthoring: me.editorConfig.canCoAuthoring === true,
                        user: me.editorConfig.user,
                        canAutosave: me.canAutosave
                    };
                    if (mode.isEdit) {
                        me.getController("DE.controller.Toolbar").loadStyles();
                    }
                    me.getFileMenu().loadConfig({
                        config: me.editorConfig
                    });
                    me.getFileMenu().loadDocument({
                        doc: me.document
                    });
                    me.getFileMenu().setMode(mode, true);
                    me.getFileMenu().createDelayedElements();
                    me.getMainMenu().disableMenu("all", false);
                    me.getDocumentInfo().setApi(me.api).loadConfig({
                        config: me.editorConfig
                    }).addListener("editcomplete", me.onEditComplete, me);
                    me.getDocumentSettings().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                    me.getMainMenu().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                    me.getDocumentHolder().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                    me.getDocumentHolder().changePosition();
                    me.getViewport().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                    if (mode.isEdit) {
                        var timer_sl = setInterval(function () {
                            if (window.styles_loaded) {
                                clearInterval(timer_sl);
                                me.getController("Common.controller.CommentsList").onApiAddComments(me.api.asc_getComments());
                                me.getController("Common.controller.CommentsList").registerCallbacks();
                                me.getController("Common.controller.CommentsPopover").registerCallbacks();
                                me.getToolbar().createDelayedElements();
                                me.getController("DE.controller.Toolbar").createDelayedElements();
                                me.getController("Common.controller.Fonts").loadFonts();
                                me.getDocumentHolder().createDelayedElements();
                                me.loadLanguages();
                                me.getRightMenu().createDelayedElements();
                                me.getRightPanel().createDelayedElements();
                                me.bindComponent.call(me, "deheaderfootersettings");
                                me.bindComponent.call(me, "deimagesettings");
                                me.bindComponent.call(me, "deparagraphsettings");
                                me.bindComponent.call(me, "detablesettings");
                                me.bindComponent.call(me, "deshapesettings");
                                me.api.asc_registerCallback("asc_onSendThemeColors", Ext.bind(me._onSendThemeColors, me));
                                var shapes = me.api.get_PropertyEditorShapes();
                                if (shapes) {
                                    me.fillAutoShapes(shapes[0], shapes[1]);
                                }
                                var colors = me.api.get_PropertyThemeColors();
                                if (colors) {
                                    me._onSendThemeColors(colors[0], colors[1]);
                                }
                                me.api.UpdateInterfaceState();
                            }
                        },
                        50);
                    }
                }
            },
            50);
            if (me.canAutosave > -1) {
                value = window.localStorage.getItem("de-settings-autosave");
                value = (value !== null) ? parseInt(value) : 600;
                if (value > 0 && me.canAutosave > value) {
                    value = me.canAutosave;
                    window.localStorage.setItem("de-settings-autosave", value);
                }
                me.api.asc_setAutoSaveGap(value);
            }
            Common.Gateway.on("applyeditrights", Ext.bind(me.onApplyEditRights, me));
            Common.Gateway.on("processsaveresult", Ext.bind(me.onProcessSaveResult, me));
            Common.Gateway.on("processrightschange", Ext.bind(me.onProcessRightsChange, me));
            Common.Gateway.on("processmouse", Ext.bind(me.onProcessMouse, me));
            Ext.getDoc().on("contextmenu", Ext.bind(me.onContextMenu, me));
            Ext.FocusManager.enable();
            Ext.FocusManager.addXTypeToWhitelist("button");
            Ext.FocusManager.keyNav.disable();
            Ext.FocusManager.addListener("componentfocus", function (fm, cmp) {
                var isInstance = cmp instanceof Ext.form.field.Text; ! isInstance && (isInstance = this.fullscalemenu === true); ! isInstance && (isInstance = $("body > .x-mask").filter(":visible").length > 0); ! isInstance && (isInstance = $("body > .x-boundlist").filter(":visible").length > 0);
                if (!isInstance) {
                    var elvis = $("body > .x-menu").filter(":visible");
                    var len = elvis.length;
                    elvis.each(function (i, e) {
                        if ($(e).css("visibility") == "hidden") {
                            len--;
                        } else {
                            if (e.style.left === "-10000px" || e.style.top === "-10000px") {
                                len--;
                            }
                        }
                    });
                    isInstance = len > 0;
                }
                me.api.asc_enableKeyEvents(isInstance == false);
            },
            this);
            Common.component.Analytics.initialize("UA-12442749-13", "Document Editor");
        },
        50);
    },
    onDocumentChanged: function () {},
    onDocumentModifiedChanged: function () {
        this.updateWindowTitle();
        Common.Gateway.setDocumentModified(this.api.isDocumentModified());
    },
    onContextMenu: function (event, el) {
        if (! ((el instanceof HTMLInputElement) || (el instanceof HTMLTextAreaElement) || new Boolean(el.getAttribute("data-can-copy")).valueOf())) {
            event.stopEvent();
            return false;
        }
    },
    onBeforeUnload: function () {
        if (this.api.isDocumentModified()) {
            return this.leavePageText;
        }
    },
    requestEditRights: function () {
        this.getStatusInfo().setCaption(this.requestEditRightsText);
        Common.Gateway.requestEditRights();
    },
    updateWindowTitle: function () {
        var title = this.defaultTitleText;
        if (this.getHeader().getDocumentCaption().length > 0) {
            title = this.getHeader().getDocumentCaption() + " - " + title;
        }
        if (this.api.isDocumentModified()) {
            title = "* " + title;
        }
        if (window.document.title != title) {
            window.document.title = title;
        }
    },
    hidePreloader: function () {
        var preloader = Ext.fly("loading-mask");
        if (preloader) {
            preloader.hide();
            preloader.dom.parentNode.removeChild(preloader.dom);
        }
    },
    onSaveUrl: function (url) {
        Common.Gateway.save(url);
    },
    onOpenDocument: function (progress) {
        var elem = document.getElementById("loadmask-text");
        if (elem) {
            elem.innerHTML = this.textLoadingDocument + ": " + Ext.util.Format.round(progress, 0) + "%";
        } else {
            if (this.loadMask) {
                this.loadMask.setTitle(this.loadingDocumentTitleText + ": " + Ext.util.Format.round(progress, 0) + "%");
            }
        }
    },
    fillUserStore: function (users) {
        if (!Ext.isEmpty(users)) {
            var userStore = this.getCommonStoreUsersStore();
            if (userStore) {
                userStore.add(users);
            }
        }
    },
    onCollaborativeChanges: function () {
        if (this.modeEdit) {
            this.getStatusInfo().setCaption(this.txtNeedSynchronize);
        }
    },
    synchronizeChanges: function () {
        this.getStatusInfo().setCaption("");
        this.getDocumentHolder().hideTips();
        this.getToolbar().synchronizeChanges();
    },
    onInsertTable: function () {
        var rightpan = this.getRightPanel();
        if (rightpan) {
            rightpan.onInsertTable();
        }
    },
    onInsertImage: function () {
        var rightpan = this.getRightPanel();
        if (rightpan) {
            rightpan.onInsertImage();
        }
    },
    onInsertShape: function () {
        var rightpan = this.getRightPanel();
        if (rightpan) {
            rightpan.onInsertShape();
        }
    },
    getBrowseZoomLevel: function () {
        if (Common.userAgent.isIE) {
            return screen.logicalXDPI / screen.deviceXDPI;
        } else {
            var zoom = window.outerWidth / document.documentElement.clientWidth;
            if (Ext.isSafari) {
                zoom = Math.floor(zoom * 10) / 10;
            }
            return zoom;
        }
    },
    showTips: function (strings, autohide, title) {
        if (!strings.length) {
            return;
        }
        if (typeof(strings) != "object") {
            strings = [strings];
        }
        var top_elem = Ext.ComponentQuery.query("detoolbar"); ! top_elem.length && (top_elem = Ext.select(".common-header").first()) || (top_elem = top_elem[0].getEl());
        function showNextTip() {
            var str_tip = strings.shift();
            if (str_tip) {
                tipWindow.update(str_tip);
                if (top_elem) {
                    tipWindow.show();
                    var xy = tipWindow.getEl().getAlignToXY(top_elem, "t-b?");
                    xy[1] += 40;
                    tipWindow.showAt(xy);
                }
            } else {
                tipWindow.destroy();
            }
        }
        var tipWindow = Ext.create("Ext.tip.ToolTip", {
            closable: true,
            title: Ext.isDefined(title) ? title : this.notcriticalErrorTitle,
            maxWidth: 800,
            minWidth: 200,
            style: "white-space: nowrap;",
            autoHide: Ext.isDefined(autohide) ? autohide : true,
            listeners: {
                beforehide: function (obj) {
                    setTimeout(showNextTip, 200);
                },
                show: function (tip) {
                    tip.getEl().setStyle("z-index", "20003");
                }
            }
        });
        showNextTip();
    },
    initNames: function () {
        this.shapeGroupNames = [this.txtBasicShapes, this.txtFiguredArrows, this.txtMath, this.txtCharts, this.txtStarsRibbons, this.txtCallouts, this.txtButtons, this.txtRectangles, this.txtLines];
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
    },
    fillAutoShapes: function (groupNames, shapes) {
        if (Ext.isEmpty(shapes) || Ext.isEmpty(groupNames) || shapes.length != groupNames.length) {
            return;
        }
        var me = this;
        var shapegrouparray = [];
        var shapeStore = this.getStore("ShapeGroups");
        shapeStore.removeAll();
        var groupscount = groupNames.length;
        Ext.each(groupNames, function (groupName, index) {
            var store = Ext.create("Ext.data.Store", {
                model: "DE.model.ShapeModel"
            });
            var cols = (shapes[index].length) > 18 ? 7 : 6;
            var height = Math.ceil(shapes[index].length / cols) * 35 + 3;
            var width = 30 * cols;
            Ext.each(shapes[index], function (shape) {
                store.add({
                    imageUrl: shape.Image,
                    data: {
                        shapeType: shape.Type
                    }
                });
            });
            shapegrouparray.push({
                groupName: me.shapeGroupNames[index],
                groupStore: store,
                groupWidth: width,
                groupHeight: height
            });
        });
        if (groupscount > 0) {
            var store = Ext.create("Ext.data.Store", {
                model: "DE.model.ShapeModel"
            });
            var cols = (shapes[groupscount - 1].length - 3) > 18 ? 7 : 6;
            var height = Math.ceil((shapes[groupscount - 1].length - 3) / cols) * 35 + 3;
            var width = 30 * cols;
            for (var i = 0; i < shapes[groupscount - 1].length - 3; i++) {
                var shape = shapes[groupscount - 1][i];
                store.add({
                    imageUrl: shape.Image,
                    data: {
                        shapeType: shape.Type
                    }
                });
            }
            shapegrouparray.push({
                groupName: me.shapeGroupNames[groupscount - 1],
                groupStore: store,
                groupWidth: width,
                groupHeight: height
            });
        }
        shapeStore.add(shapegrouparray);
        setTimeout(function () {
            me.getController("DE.controller.Toolbar").FillAutoShapes();
        },
        50);
    },
    getHexColor: function (r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        if (r.length == 1) {
            r = "0" + r;
        }
        if (g.length == 1) {
            g = "0" + g;
        }
        if (b.length == 1) {
            b = "0" + b;
        }
        return r + g + b;
    },
    _onSendThemeColors: function (colors, standart_colors) {
        var me = this;
        var standartcolors = [];
        if (standart_colors) {
            for (var i = 0; i < standart_colors.length; i++) {
                var item = this.getHexColor(standart_colors[i].get_r(), standart_colors[i].get_g(), standart_colors[i].get_b());
                standartcolors.push(item);
            }
        }
        var effectcolors = [];
        for (i = 0; i < 6; i++) {
            for (var j = 0; j < 10; j++) {
                var idx = i + j * 6;
                var item = {
                    color: this.getHexColor(colors[idx].get_r(), colors[idx].get_g(), colors[idx].get_b()),
                    effectId: idx,
                    effectValue: this.ThemeValues[j]
                };
                effectcolors.push(item);
            }
        }
        setTimeout(function () {
            me.getRightPanel().SendThemeColors(effectcolors, standartcolors);
        },
        50);
        setTimeout(function () {
            me.getDocumentHolder().SendThemeColors(effectcolors, standartcolors);
        },
        50);
        setTimeout(function () {
            me.getToolbar()._onSendThemeColors(colors, standart_colors);
        },
        50);
    },
    loadEditorStylesheets: function (callback) {
        var links = getEditorStylesheets();
        var me = this;
        var count = links.length,
        loaded = 0;
        if (!Ext.isSafari) {
            function oncssload() {
                if (! (++loaded < count)) {
                    setTimeout(function () {
                        me.loadEditorScripts.call(me, callback);
                    },
                    10);
                }
            }
            for (i = 0; i < count; i++) {
                link = document.createElement("link");
                link.setAttribute("rel", "stylesheet");
                link.type = "text/css";
                if (link.addEventListener) {
                    link.addEventListener("load", oncssload, false);
                } else {
                    link.onload = oncssload;
                }
                link.href = links[i];
                document.head.appendChild(link);
            }
        } else {
            var cssnum = document.styleSheets.length;
            for (var i = 0; i < count; i++) {
                var link = document.createElement("link");
                link.setAttribute("rel", "stylesheet");
                link.type = "text/css";
                link.href = links[i];
                document.head.appendChild(link);
            }
            var checksheet = setInterval(function () {
                if (document.styleSheets.length >= cssnum + count) {
                    clearInterval(checksheet);
                    me.loadEditorScripts.call(me, callback);
                }
            },
            30);
        }
    },
    loadEditorScripts: function (callback) {
        var scripts = [];
        var me = this;
        if (typeof getEditorScripts !== "undefined") {
            scripts = getEditorScripts();
        } else {
            setTimeout(function () {
                callback();
            },
            10);
            return;
        }
        var count = scripts.length,
        loaded = 0;
        function onscriptload() {
            loaded++;
            if (! (loaded < count)) {
                setTimeout(function () {
                    callback();
                },
                10);
            }
        }
        for (var i = 0; i < count; i++) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.addEventListener) {
                script.addEventListener("load", onscriptload, false);
            } else {
                script.onload = onscriptload;
            }
            script.src = scripts[i];
            document.body.appendChild(script);
        }
    },
    recognizeBrowser: function () {
        var res = /trident\/(\d+)\.(\d+)/i.exec(navigator.userAgent);
        Common.userAgent = {
            isIE: !!res
        };
        if (Common.userAgent.isIE && res.length > 1) {
            switch (res[1]) {
            case "5":
                Common.userAgent.ieVersion = 9;
                break;
            case "6":
                Common.userAgent.ieVersion = 10;
                break;
            case "7":
                Common.userAgent.ieVersion = 11;
                break;
            default:
                Common.userAgent.ieVersion = 0;
            }
        }
    },
    leavePageText: "You have unsaved changes in this document. Click 'Stay on this Page' then 'Save' to save them. Click 'Leave this Page' to discard all the unsaved changes.",
    defaultTitleText: "ONLYOFFICE Document Editor",
    criticalErrorTitle: "Error",
    notcriticalErrorTitle: "Warning",
    errorDefaultMessage: "Error code: %1",
    criticalErrorExtText: 'Press "Ok" to back to document list.',
    openTitleText: "Opening Document",
    openTextText: "Opening document...",
    saveTitleText: "Saving Document",
    saveTextText: "Saving document...",
    loadFontsTitleText: "Loading Data",
    loadFontsTextText: "Loading data...",
    loadImagesTitleText: "Loading Images",
    loadImagesTextText: "Loading images...",
    loadFontTitleText: "Loading Data",
    loadFontTextText: "Loading data...",
    loadImageTitleText: "Loading Image",
    loadImageTextText: "Loading image...",
    downloadTitleText: "Downloading Document",
    downloadTextText: "Downloading document...",
    printTitleText: "Printing Document",
    printTextText: "Printing document...",
    uploadImageTitleText: "Uploading Image",
    uploadImageTextText: "Uploading image...",
    savePreparingText: "Preparing to save",
    savePreparingTitle: "Preparing to save. Please wait...",
    uploadImageSizeMessage: "Maximium image size limit exceeded.",
    uploadImageExtMessage: "Unknown image format.",
    uploadImageFileCountMessage: "No images uploaded.",
    reloadButtonText: "Reload Page",
    unknownErrorText: "Unknown error.",
    convertationTimeoutText: "Convertation timeout exceeded.",
    convertationErrorText: "Convertation failed.",
    downloadErrorText: "Download failed.",
    unsupportedBrowserErrorText: "Your browser is not supported.",
    splitMaxRowsErrorText: "The number of rows must be less than %1",
    splitMaxColsErrorText: "The number of columns must be less than %1",
    splitDividerErrorText: "The number of rows must be a divisor of %1",
    requestEditRightsText: "Requesting editing rights...",
    requestEditFailedTitleText: "Access denied",
    requestEditFailedMessageText: "Someone is editing this document right now. Please try again later.",
    txtNeedSynchronize: "You have an updates",
    textLoadingDocument: "LOADING DOCUMENT",
    warnBrowserZoom: "Your browser's current zoom setting is not fully supported. Please reset to the default zoom by pressing Ctrl+0.",
    warnBrowserIE9: "The application has low capabilities on IE9. Use IE10 or higher",
    applyChangesTitleText: "Loading Data",
    applyChangesTextText: "Loading data...",
    errorKeyEncrypt: "Unknown key descriptor",
    errorKeyExpire: "Key descriptor expired",
    errorUsersExceed: "Count of users was exceed",
    errorCoAuthoringDisconnect: "Server connection lost. You can't edit anymore.",
    errorFilePassProtect: "The document is password protected.",
    txtBasicShapes: "Basic Shapes",
    txtFiguredArrows: "Figured Arrows",
    txtMath: "Math",
    txtCharts: "Charts",
    txtStarsRibbons: "Stars & Ribbons",
    txtCallouts: "Callouts",
    txtButtons: "Buttons",
    txtRectangles: "Rectangles",
    txtLines: "Lines",
    txtEditingMode: "Set editing mode...",
    textAnonymous: "Anonymous",
    loadingDocumentTitleText: "Loading Document",
    loadingDocumentTextText: "Loading document...",
    warnProcessRightsChange: "You have been denied the right to edit the file.",
    errorProcessSaveResult: "Saving is failed."
});