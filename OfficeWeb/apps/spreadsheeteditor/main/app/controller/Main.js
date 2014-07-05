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
 var LoadingDocument = -256;
var ApplyEditRights = -255;
var InitApplication = -254;
Ext.define("SSE.controller.Main", {
    extend: "Ext.app.Controller",
    uses: ["Common.component.LoadMask", "Ext.window.MessageBox", "SSE.view.OpenDialog"],
    views: ["Common.view.Header", "DocumentHolder", "DocumentInfo"],
    stores: ["Common.store.Users"],
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
        selector: "ssemainmenu"
    },
    {
        ref: "documentHolder",
        selector: "ssedocumentholder"
    },
    {
        ref: "viewport",
        selector: "sseviewport"
    },
    {
        ref: "documentInfo",
        selector: "ssedocumentinfo"
    },
    {
        ref: "cellInfo",
        selector: "ssecellinfo"
    },
    {
        ref: "documentHelp",
        selector: "ssedocumenthelp"
    },
    {
        ref: "toolbar",
        selector: "ssetoolbar"
    },
    {
        ref: "formulaInput",
        selector: "#infobox-cell-edit"
    },
    {
        ref: "fileMenu",
        selector: "ssefile"
    },
    {
        ref: "chatPanel",
        selector: "commonchatpanel"
    },
    {
        ref: "rightPanel",
        selector: "sserightpanel"
    },
    {
        ref: "rightMenu",
        selector: "sserightmenu"
    },
    {
        ref: "documentAbout",
        selector: "commonabout"
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
            "ssedocumentholder": {
                resize: this.onDocumentHolderResize
            },
            "ssefile": {
                editdocument: this.requestEditRights,
                downloadas: function () {
                    this.onLongActionBegin(c_oAscAsyncAction.DownloadAs, c_oAscAsyncActionType.BlockInteraction);
                }
            },
            "#view-main-menu": {
                panelshow: function (panel, fulscreen) {
                    if (fulscreen) {
                        this.fullscalemenu = true;
                        this.api.asc_enableKeyEvents(false);
                    } else {
                        if (!Ext.isEmpty(panel.query("commonchatpanel"))) {
                            this.api.asc_Resize();
                            this.api.asc_enableKeyEvents(false);
                            Ext.getCmp("id-menu-chat").removeCls("notify");
                            var cmp = Ext.getCmp("id-chat-textarea");
                            cmp && cmp.focus();
                        } else {
                            if (!Ext.isEmpty(panel.query("commoncommentspanel"))) {
                                if (!this.isLiveCommenting) {
                                    this.api.asc_showComments();
                                }
                            }
                        }
                    }
                },
                panelhide: {
                    scope: this,
                    fn: function (panel, fulscreen) {
                        this.api.asc_Resize();
                        if (fulscreen) {
                            this.fullscalemenu = false;
                        }
                        if (!this.isLiveCommenting) {
                            this.api.asc_hideComments();
                        }
                        this.onEditComplete(this.getMainMenu());
                    }
                }
            },
            "documentstatusinfo tabbar": {
                change: function (tabBar, tab, card, eOpts) {
                    this.onActiveSheetChanged(this.api.asc_getActiveWorksheetIndex());
                }
            },
            "ssedocumentsettings": {
                savedocsettings: function () {
                    value = window.localStorage.getItem("sse-settings-livecomment");
                    this.isLiveCommenting = !(value !== null && parseInt(value) == 0);
                    this.isLiveCommenting ? this.api.asc_showComments() : this.api.asc_hideComments();
                    this.api.asc_setFontRenderingMode(parseInt(window.localStorage.getItem("sse-settings-fontrender")));
                    var value = window.localStorage.getItem("sse-settings-autosave");
                    if (this.appComputedMode.canAutosave > -1) {
                        this.api.asc_setAutoSaveGap((value !== null) ? parseInt(value) : 600);
                    }
                    this.getDocumentHolder().setLiveCommenting(this.isLiveCommenting);
                },
                changemeasureunit: function () {
                    var value = window.localStorage.getItem("sse-settings-unit");
                    Common.MetricSettings.setCurrentMetric((value !== null) ? parseInt(value) : Common.MetricSettings.c_MetricUnits.cm);
                    this.getRightPanel().updateMetricUnit();
                }
            }
        });
    },
    onLaunch: function () {
        window.asc_CCommentData = window.Asc.asc_CCommentData || window.asc_CCommentData;
        window.storagename = "spreadsheet";
        $(document.body).css("position", "absolute");
        if (typeof isBrowserSupported !== "undefined" && !isBrowserSupported()) {
            Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
            return;
        } else {
            var viewport = this.getViewport();
            if (!viewport) {
                throw Error("SSE.controller.Main failed: could not get Viewport.");
            }
            this.getViewport().getEl().on("keypress", this.lockEscapeKey, this);
            viewport.applicationUI.setVisible(true);
        }
        var value = window.localStorage.getItem("sse-settings-fontrender");
        if (value === null) {
            value = window.devicePixelRatio > 1 ? "1" : "3";
        }
        this.api = new Asc.spreadsheet_api("editor_sdk", "infobox-cell-input");
        this.api.asc_setFontRenderingMode(parseInt(value));
        this.api.asc_Init("../../../sdk/Fonts/");
        this.api.asc_registerCallback("asc_onOpenDocumentProgress", Ext.bind(this.onOpenDocument, this));
        this.api.asc_registerCallback("asc_onEndAction", Ext.bind(this.onLongActionEnd, this));
        this.api.asc_registerCallback("asc_onError", Ext.bind(this.onError, this));
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        this.api.asc_registerCallback("asc_onAdvancedOptions", Ext.bind(this.onAdvancedOptions, this));
        this.stackLongActions = new Common.IrregularStack({
            strongCompare: this._compareActionStrong,
            weakCompare: this._compareActionWeak
        });
        this.stackLongActions.push({
            id: InitApplication,
            type: c_oAscAsyncActionType.BlockInteraction
        });
        this.editorConfig = {};
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
        Common.Gateway.on("showmessage", Ext.bind(this.onExternalMessage, this));
        Common.Gateway.on("opendocument", Ext.bind(this.loadDocument, this));
        Common.Gateway.on("internalcommand", Ext.bind(this.onInternalCommand, this));
        Common.Gateway.ready();
        this.recognizeBrowser();
        Ext.isIE = Common.userAgent.isIE;
        Ext.isIE9 = Common.userAgent.ieVersion == 9;
    },
    bindComponent: function (xtype) {
        var a = Ext.ComponentQuery.query(xtype);
        for (var i = 0; i < a.length; ++i) {
            a[i].setApi(this.api);
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
        if (this.editorConfig.lang) {
            this.api.asc_setLocale(this.editorConfig.lang);
        }
    },
    applyModeCommonElements: function () {
        window.editor_elements_prepared = true;
        this.getHeader().setHeaderCaption(this.appComputedMode.isEdit ? "Spreadsheet Editor" : "Spreadsheet Viewer");
        this.getHeader().setCanBack(this.appComputedMode.canBack === true);
        if (this.appComputedMode.nativeApp === true || JSON.parse(window.localStorage.getItem("sse-hidden-title"))) {
            this.getHeader().setVisible(false);
        }
        this.getViewport().setMode(this.appComputedMode, true);
        this.getStatusInfo().setDisabled(false);
        this.getStatusInfo().setMode(this.appComputedMode);
        this.getCellInfo().setMode(this.appComputedMode);
        this.getFileMenu() && this.getFileMenu().setMode(this.appComputedMode);
        this.getController("DocumentHolder").setMode(this.appComputedMode);
        var commentsPanelCmp = this.getMainMenu().down("#id-menu-comments"),
        chatPanelCmp = this.getMainMenu().down("#id-menu-chat");
        if (this.appComputedMode.canCoAuthoring) {
            commentsPanelCmp[this.appComputedMode.isEdit ? "show" : "hide"]();
            chatPanelCmp.show();
        } else {
            chatPanelCmp.hide();
            commentsPanelCmp.hide();
        }
    },
    applyModeEditorElements: function (prevmode) {
        if (this.appComputedMode.isEdit) {
            var me = this;
            window.editor_elements_prepared = false;
            var onsuccess = function () {
                if (typeof Common.Locale !== "undefined") {
                    Common.Locale.apply();
                }
                me.getController("Common.controller.Fonts").init();
                me.getController("Common.controller.Fonts").setApi(me.api);
                me.getController("Toolbar").init();
                me.getController("Toolbar").setApi(me.api);
                me.getController("Common.controller.CommentsList").init();
                me.getController("Common.controller.CommentsList").setConfig({
                    config: me.editorConfig
                },
                me.api);
                me.getController("Common.controller.CommentsList").registerCallbacks();
                me.getController("Common.controller.CommentsList").doDelayedTask();
                me.getController("Common.controller.CommentsPopover").init();
                me.getController("Common.controller.CommentsPopover").setConfig({
                    config: me.editorConfig,
                    sdkviewname: "#ws-canvas-outer",
                    movingtoplimit: -20
                },
                me.api);
                me.getController("Common.controller.CommentsPopover").registerCallbacks();
                if (prevmode == "view") {
                    me.getController("Common.controller.CommentsList").onApiAddComments(me.api.asc_getWorkbookComments());
                    me.getController("Common.controller.CommentsPopover").onDocumentContentReady();
                }
                me.initNames();
                me.getController("Print").init();
                me.getController("Print").setApi(me.api);
                me.getViewport().applyEditorMode();
                me.getRightMenu().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                me.getToolbar().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                me.getToolbar().setMode(me.appComputedMode);
                me.getRightPanel().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
                me.getRightPanel().setMode(me.appComputedMode);
                window.editor_elements_prepared = true;
                var value = window.localStorage.getItem("sse-settings-unit");
                Common.MetricSettings.setCurrentMetric((value !== null) ? parseInt(value) : Common.MetricSettings.c_MetricUnits.cm);
                var options = {};
                JSON.parse(window.localStorage.getItem("sse-hidden-title")) && (options.title = true);
                JSON.parse(window.localStorage.getItem("sse-hidden-formula")) && (options.formula = true);
                JSON.parse(window.localStorage.getItem("sse-hidden-headings")) && (options.headings = true);
                me.getController("Toolbar").hideElements(options);
                if (me.stackLongActions.exist({
                    id: ApplyEditRights,
                    type: c_oAscAsyncActionType["BlockInteraction"]
                })) {
                    me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], ApplyEditRights);
                } else {
                    if (me.stackLongActions.exist({
                        id: InitApplication,
                        type: c_oAscAsyncActionType.BlockInteraction
                    })) {
                        me.hidePreloader();
                        me.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                    }
                }
                window.onbeforeunload = Ext.bind(me.onBeforeUnload, me);
            };
            this.loadEditorStylesheets(onsuccess);
        }
    },
    loadDocument: function (data) {
        this.spreadsheet = data.doc;
        this.permissions = {};
        var docInfo = {};
        if (data.doc) {
            this.permissions = Ext.merge(this.permissions, data.doc.permissions);
            docInfo.Id = data.doc.key;
            docInfo.Url = data.doc.url;
            docInfo.Title = data.doc.title;
            docInfo.Format = data.doc.fileType;
            docInfo.Options = data.doc.options;
            docInfo.UserId = this.editorConfig.user.id;
            docInfo.UserName = this.editorConfig.user.name;
            docInfo.VKey = data.doc.vkey;
            docInfo.Origin = data.doc.origin;
            docInfo.OfflineApp = this.editorConfig.nativeApp === true;
        }
        this.appComputedMode = {
            canAutosave: -1,
            canBack: this.editorConfig.nativeApp !== true && this.editorConfig.canBackToFolder === true,
            canOpenRecent: this.editorConfig.nativeApp !== true && this.editorConfig.recent !== undefined,
            canCreateNew: !Ext.isEmpty(this.editorConfig.createUrl),
            nativeApp: this.editorConfig.nativeApp === true,
            canCoAuthoring: this.editorConfig.canCoAuthoring === true,
            user: this.editorConfig.user
        };
        this.api.asc_registerCallback("asc_onGetEditorPermissions", Ext.bind(this.onEditorPermissions, this));
        this.api.asc_setDocInfo(docInfo);
        this.api.asc_getEditorPermissions();
        if (data.doc) {
            this.getHeader().setDocumentCaption(data.doc.title);
        }
    },
    onEditorPermissions: function (params) {
        if (params) {
            params.asc_getIsAutosaveEnable() && (this.appComputedMode.canAutosave = params.asc_getAutosaveMinInterval());
            this.permissions.edit !== false && (this.permissions.edit = params.asc_getCanEdit());
            this.permissions.download !== false && (this.permissions.download = params.asc_getCanDownload());
            this.appComputedMode.canCoAuthoring !== false && (this.appComputedMode.canCoAuthoring = params.asc_getCanCoAuthoring());
            if (this.editorConfig.canAutosave === false) {
                this.appComputedMode.canAutosave = -1;
                this.api.asc_setAutoSaveGap(0);
            }
        }
        this.appComputedMode.canEdit = this.permissions.edit === true;
        this.appComputedMode.isEdit = this.permissions.edit === true && this.editorConfig.mode !== "view";
        this.appComputedMode.canDownload = this.editorConfig.nativeApp !== true && (this.permissions.download !== undefined ? this.permissions.download : true);
        this.applyModeCommonElements();
        this.applyModeEditorElements();
        this.api.asc_setViewerMode(!this.appComputedMode.isEdit);
        this.api.asc_LoadDocument();
        if (!this.appComputedMode.isEdit) {
            this.hidePreloader();
            this.onLongActionBegin(c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
        }
    },
    onInternalCommand: function (data) {
        if (data) {
            switch (data.command) {
            case "setAppDisabled":
                this.isAppDisabled = data.data;
                this.api.asc_enableKeyEvents(false);
                break;
            }
        }
    },
    onProcessSaveResult: function (data) {
        this.api && this.api.asc_OnSaveEnd(data.result);
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
    goBack: function () {
        Common.Gateway.goBack();
    },
    onDocumentHolderResize: function () {
        if (this.api) {
            this.api.asc_Resize();
            Ext.menu.Manager.hideAll();
        }
    },
    onEditComplete: function (cmp, opts) {
        this.getMainMenu().closeFullScaleMenu();
        if (opts && opts.checkorder && this.api.isTextAreaBlur) {
            this.getFormulaInput().blur();
            this.getFormulaInput().focus(false, 10);
        } else {
            this.getDocumentHolder().blur();
            this.getDocumentHolder().focus(false, 50);
            this.api.isTextAreaBlur = false;
        }
    },
    onLongActionBegin: function (type, id) {
        var action = {
            id: id,
            type: type
        };
        this.stackLongActions.push(action);
        this.setLongActionView(action);
    },
    setLongActionView: function (action) {
        var title = "",
        text = "";
        switch (action.id) {
        case c_oAscAsyncAction.Open:
            title = this.openTitleText;
            break;
        case c_oAscAsyncAction.Save:
            title = this.saveTitleText;
            break;
        case c_oAscAsyncAction.LoadDocumentFonts:
            title = this.loadFontsTitleText;
            break;
        case c_oAscAsyncAction.LoadDocumentImages:
            title = this.loadImagesTitleText;
            break;
        case c_oAscAsyncAction.LoadFont:
            title = this.loadFontTitleText;
            break;
        case c_oAscAsyncAction.LoadImage:
            title = this.loadImageTitleText;
            break;
        case c_oAscAsyncAction.DownloadAs:
            title = this.downloadTitleText;
            break;
        case c_oAscAsyncAction.Print:
            title = this.printTitleText;
            break;
        case c_oAscAsyncAction.UploadImage:
            title = this.uploadImageTitleText;
            break;
        case c_oAscAsyncAction.Recalc:
            title = this.titleRecalcFormulas;
            break;
        case c_oAscAsyncAction.SlowOperation:
            title = this.textPleaseWait;
            break;
        case c_oAscAsyncAction["PrepareToSave"]:
            this.getController("Common.controller.CommentsPopover").setAutoPopup(false);
            title = this.savePreparingText;
            break;
        case ApplyEditRights:
            title = this.txtEditingMode;
            break;
        case LoadingDocument:
            title = this.loadingDocumentTitleText;
            break;
        }
        if (action.type == c_oAscAsyncActionType.BlockInteraction) { ! this.loadMask && (this.loadMask = Ext.widget("cmdloadmask", Ext.getBody()));
            this.loadMask.setTitle(title);
            this.loadMask.show();
        }
    },
    onDocumentReady: function () {
        var hide_preloader = true;
        if (window.editor_elements_prepared) {
            this.onDocumentHolderResize();
            this.hidePreloader();
            this.onLongActionEnd(c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
            hide_preloader = false;
        }
        var value = window.localStorage.getItem("sse-settings-zoom");
        this.api.asc_setZoom(!value ? 1 : parseInt(value) / 100);
        value = window.localStorage.getItem("sse-settings-livecomment");
        this.isLiveCommenting = !(value !== null && parseInt(value) == 0);
        this.isLiveCommenting ? this.api.asc_showComments() : this.api.asc_hideComments();
        var me = this;
        setTimeout(function () {
            me.api.asc_setCoAuthoringEnable(me.appComputedMode.canCoAuthoring);
            me.api.asc_registerCallback("asc_onStartAction", Ext.bind(me.onLongActionBegin, me));
            me.api.asc_registerCallback("asc_onConfirmAction", Ext.bind(me.onConfirmAction, me));
            me.api.asc_registerCallback("asc_onActiveSheetChanged", Ext.bind(me.onActiveSheetChanged, me));
            me.getHeader().setDocumentCaption(me.api.asc_getDocumentName());
            Common.Gateway.on("applyeditrights", Ext.bind(me.onApplyEditRights, me));
            Common.Gateway.on("processsaveresult", Ext.bind(me.onProcessSaveResult, me));
            Common.Gateway.on("processrightschange", Ext.bind(me.onProcessRightsChange, me));
            Common.Gateway.on("processmouse", Ext.bind(me.onProcessMouse, me));
            me.getController("DocumentHolder").setApi(me.api).loadConfig({
                config: me.editorConfig
            });
            me.getController("CreateFile").init();
            me.getController("CreateFile").setApi(me.api).loadConfig({
                config: me.editorConfig
            });
            me.getController("RecentFiles").init();
            me.getController("RecentFiles").loadConfig({
                config: me.editorConfig
            });
            me.getController("Search").init();
            me.getController("Search").setApi(me.api);
            me.getController("Search").setMode(me.appComputedMode);
            me.getController("CellEdit").init();
            me.getController("CellEdit").setApi(me.api);
            me.getController("Common.controller.Chat").init();
            me.getController("Common.controller.Chat").setApi(me.api).loadConfig({
                config: me.editorConfig
            });
            me.getMainMenu().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
            me.getStatusInfo().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
            me.getDocumentHolder().setApi(me.api).addListener("editcomplete", me.onEditComplete, me);
            me.getCellInfo().addListener("editcomplete", me.onEditComplete, me);
            me.getViewport().createDelayedElements();
            me.getStatusInfo().createDelayedElements();
            me.getMainMenu().createDelayedElements();
            me.getChatPanel().createDelayedElements();
            var timer_rp = setInterval(function () {
                if (window.editor_elements_prepared) {
                    clearInterval(timer_rp);
                    if (hide_preloader) {
                        me.onDocumentHolderResize();
                        me.hidePreloader();
                        me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                    }
                    me.getFileMenu().loadConfig({
                        config: me.editorConfig
                    });
                    me.getFileMenu().setMode(me.appComputedMode, true);
                    me.getFileMenu().createDelayedElements();
                    me.getMainMenu().disableMenu("all", false);
                    me.getCellInfo().updateCellInfo(me.api.asc_getCellInfo());
                    me.getStatusInfo().updateInfo();
                    me.getDocumentInfo().loadConfig({
                        config: me.editorConfig
                    }).updateInfo(me.spreadsheet);
                    if (me.appComputedMode.isEdit) {
                        var timer_sl = setInterval(function () {
                            if (window.styles_loaded) {
                                clearInterval(timer_sl);
                                me.getController("Common.controller.CommentsList").onApiAddComments(me.api.asc_getWorkbookComments());
                                me.getController("Common.controller.CommentsPopover").onDocumentContentReady();
                                me.getDocumentHolder().createDelayedElements();
                                me.getToolbar().createDelayedElements();
                                me.getController("Toolbar").createDelayedElements();
                                me.getRightMenu().createDelayedElements();
                                me.getRightPanel().createDelayedElements();
                                me.bindComponent.call(me, "sseimagesettings");
                                me.bindComponent.call(me, "sseshapesettings");
                                me.api.asc_registerCallback("asc_onInitEditorShapes", Ext.bind(me.fillAutoShapes, me));
                                me.api.asc_registerCallback("asc_onSendThemeColors", Ext.bind(me._onSendThemeColors, me));
                                me.api.asc_registerCallback("asc_onSaveUrl", Ext.bind(me.onSaveUrl, me));
                                me.api.asc_registerCallback("asc_onDocumentModifiedChanged", Ext.bind(me.onDocumentModifiedChanged, me));
                                window.dlgFormulas = Ext.create("SSE.view.FormulaDialog", {
                                    closeAction: "hide"
                                });
                            }
                        },
                        50);
                    }
                }
            },
            50);
            if (me.appComputedMode.canAutosave > -1) {
                value = window.localStorage.getItem("sse-settings-autosave");
                value = (value !== null) ? parseInt(value) : 600;
                if (value > 0 && me.appComputedMode.canAutosave > value) {
                    value = me.appComputedMode.canAutosave;
                    window.localStorage.setItem("sse-settings-autosave", value);
                }
                me.api.asc_setAutoSaveGap(value);
            }
            Common.component.Analytics.initialize("UA-12442749-13", "Spreadsheet Editor");
            var isInstance, documentHolder = me.getDocumentHolder(),
            formulaInput = me.getFormulaInput();
            Ext.FocusManager.enable();
            Ext.FocusManager.addXTypeToWhitelist("button");
            Ext.FocusManager.keyNav.disable();
            Ext.FocusManager.addListener("componentfocus", function (fm, cmp) {
                if (this.isAppDisabled === true) {
                    return;
                }
                isInstance = cmp instanceof Ext.form.field.Text && cmp.id != "infobox-cell-edit"; ! isInstance && (isInstance = cmp instanceof Ext.window.Window); ! isInstance && (isInstance = this.fullscalemenu === true); ! isInstance && (isInstance = $("body > .x-mask").filter(":visible").length > 0); ! isInstance && (isInstance = $("body > .x-boundlist").filter(":visible").length > 0);
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
                if (!isInstance && !/infobox-cell-input|editor_sdk/.test(document.activeElement.id) && !/sdk-element/.test(document.activeElement.className)) {
                    (this.api.isTextAreaBlur ? formulaInput : documentHolder).focus(false, false);
                }
                this.api.asc_enableKeyEvents(isInstance == false);
            },
            me);
            Ext.getDoc().on("contextmenu", Ext.bind(me.onContextMenu, me));
            me.getViewport().getEl().un("keypress", me.lockEscapeKey, me);
            var tips = [],
            html = Ext.fly(document.body.parentNode);
            if (Ext.isSafari && Ext.safariVersion >= 7) {
                html.addCls("safari-7");
            }
            Common.userAgent.ieVersion == 9 && tips.push(me.warnBrowserIE9); ! Ext.isGecko && !me.appComputedMode.nativeApp && Math.abs(me.getBrowseZoomLevel() - 1) > 0.011 && tips.push(me.warnBrowserZoom);
            if (tips.length) {
                me.showTips(tips);
            }
            window.canHotKey = function () {
                var winElements = Ext.ComponentQuery.query("window");
                for (var i = winElements.length; --i;) {
                    if (winElements[i].isVisible() && winElements[i].modal) {
                        return false;
                    }
                }
                return true;
            };
        },
        50);
    },
    onLongActionEnd: function (type, id) {
        var action = {
            id: id,
            type: type
        };
        this.stackLongActions.pop(action);
        this.getHeader().setDocumentCaption(this.api.asc_getDocumentName());
        this.updateWindowTitle();
        if (type === c_oAscAsyncActionType.BlockInteraction) {
            if (id == c_oAscAsyncAction.Open) {
                Common.Gateway.internalMessage("documentReady", {});
                this.onDocumentReady();
            } else {
                if (id == c_oAscAsyncAction.PrepareToSave) {
                    this.getToolbar().synchronizeChanges();
                    this.getController("Common.controller.CommentsPopover").setAutoPopup(true);
                }
            }
        }
        action = this.stackLongActions.get({
            type: c_oAscAsyncActionType.Information
        });
        action ? this.setLongActionView(action) : null;
        action = this.stackLongActions.get({
            type: c_oAscAsyncActionType.BlockInteraction
        });
        if (action) {
            this.setLongActionView(action);
        } else {
            this.loadMask && this.loadMask.hide();
            this.onEditComplete(this.loadMask, {
                checkorder: true
            });
        }
    },
    _compareActionStrong: function (obj1, obj2) {
        return obj1.id === obj2.id && obj1.type === obj2.type;
    },
    _compareActionWeak: function (obj1, obj2) {
        return obj1.type === obj2.type;
    },
    onError: function (id, level) {
        this.hidePreloader();
        this.onLongActionEnd(c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
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
        case c_oAscError.ID.PastInMergeAreaError:
            config.msg = this.pastInMergeAreaError;
            break;
        case c_oAscError.ID.FrmlWrongCountParentheses:
            config.msg = this.errorWrongBracketsCount;
            break;
        case c_oAscError.ID.FrmlWrongOperator:
            config.msg = this.errorWrongOperator;
            break;
        case c_oAscError.ID.FrmlWrongMaxArgument:
            config.msg = this.errorCountArgExceed;
            break;
        case c_oAscError.ID.FrmlWrongCountArgument:
            config.msg = this.errorCountArg;
            break;
        case c_oAscError.ID.FrmlWrongFunctionName:
            config.msg = this.errorFormulaName;
            break;
        case c_oAscError.ID.FrmlAnotherParsingError:
            config.msg = this.errorFormulaParsing;
            break;
        case c_oAscError.ID.FrmlWrongArgumentRange:
            config.msg = this.errorArgsRange;
            break;
        case c_oAscError.ID.UnexpectedGuid:
            config.msg = this.errorUnexpectedGuid;
            break;
        case c_oAscError.ID.Database:
            config.msg = this.errorDatabaseConnection;
            break;
        case c_oAscError.ID.FileRequest:
            config.msg = this.errorFileRequest;
            break;
        case c_oAscError.ID.FileVKey:
            config.msg = this.errorFileVKey;
            break;
        case c_oAscError.ID.StockChartError:
            config.msg = this.errorStockChart;
            break;
        case c_oAscError.ID.DataRangeError:
            config.msg = this.errorDataRange;
            break;
        case c_oAscError.ID.FrmlOperandExpected:
            config.msg = this.errorOperandExpected;
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
        case c_oAscError.ID.CannotMoveRange:
            config.msg = this.errorMoveRange;
            break;
        case c_oAscError.ID.UplImageUrl:
            config.msg = this.errorBadImageUrl;
            break;
        case c_oAscError.ID.CoAuthoringDisconnect:
            config.msg = this.errorCoAuthoringDisconnect;
            break;
        case c_oAscError.ID.ConvertationPassword:
            config.msg = this.errorFilePassProtect;
            break;
        case c_oAscError.ID.AutoFilterDataRangeError:
            config.msg = this.errorAutoFilterDataRange;
            break;
        case c_oAscError.ID.AutoFilterChangeFormatTableError:
            config.msg = this.errorAutoFilterChangeFormatTable;
            break;
        case c_oAscError.ID.AutoFilterChangeError:
            config.msg = this.errorAutoFilterChange;
            break;
        default:
            config.msg = this.errorDefaultMessage.replace("%1", id);
            break;
        }
        if (Common.userAgent.isIE) {
            var oldFn = Ext.FocusManager.navigateIn;
            Ext.FocusManager.navigateIn = Ext.emptyFn;
        }
        if (level == c_oAscError.Level.Critical) {
            Common.Gateway.reportError(id, config.msg);
            config.title = this.criticalErrorTitle;
            config.icon = Ext.Msg.ERROR;
            if (this.editorConfig.canBackToFolder) {
                config.msg += "<br/><br/>" + this.criticalErrorExtText + "<br/>&nbsp;";
                config.buttons = Ext.Msg.OK;
                config.fn = function (btn) {
                    if (oldFn) {
                        Ext.FocusManager.navigateIn = oldFn;
                    }
                    if (btn == "ok") {
                        Common.Gateway.goBack();
                    }
                };
            }
        } else {
            var tm = new Ext.util.TextMetrics();
            config.title = this.notcriticalErrorTitle;
            config.icon = Ext.Msg.WARNING;
            config.buttons = Ext.Msg.OK;
            config.width = tm.getWidth(config.msg) + 85;
            config.fn = Ext.bind(function (btn) {
                if (oldFn) {
                    Ext.FocusManager.navigateIn = oldFn;
                }
                this.onEditComplete();
            },
            this);
        }
        if (!Ext.FocusManager.enabled) {
            Ext.FocusManager.enable();
        }
        Ext.Msg.show(config);
    },
    onCoAuthoringDisconnect: function () {
        if (this.getFileMenu()) {
            this.getFileMenu().setMode({
                isDisconnected: true
            });
        }
        this.getViewport().setMode({
            isDisconnected: true
        });
    },
    onExternalMessage: function (msg) {
        if (msg) {
            var tip = msg.msg.charAt(0).toUpperCase() + msg.msg.substring(1);
            var title = (msg.severity.indexOf("error") >= 0) ? this.criticalErrorTitle : this.notcriticalErrorTitle;
            this.showTips([tip], false, title);
        }
    },
    onDocumentModifiedChanged: function () {
        this.updateWindowTitle();
        Common.Gateway.setDocumentModified(this.api.asc_isDocumentModified());
    },
    onContextMenu: function (event, el) {
        if (! ((el instanceof HTMLInputElement) || (el instanceof HTMLTextAreaElement) || new Boolean(el.getAttribute("data-can-copy")).valueOf())) {
            event.stopEvent();
            return false;
        }
    },
    onBeforeUnload: function () {
        var isEdit = this.permissions.edit === true && this.editorConfig.mode !== "view";
        if (isEdit && this.api.asc_isDocumentModified()) {
            return this.leavePageText;
        }
    },
    onApplyEditRights: function (data) {
        if (data) {
            if (data.allowed) {
                this.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], ApplyEditRights);
                var me = this;
                setTimeout(function () {
                    me.appComputedMode.isEdit = true;
                    me.applyModeCommonElements();
                    me.applyModeEditorElements("view");
                    me.api.asc_setViewerMode(false);
                    me.getController("Search").setMode(me.appComputedMode);
                    var timer_rp = setInterval(function () {
                        if (window.editor_elements_prepared) {
                            clearInterval(timer_rp);
                            me.getController("Toolbar").loadStyles();
                            var timer_sl = setInterval(function () {
                                if (window.styles_loaded) {
                                    clearInterval(timer_sl);
                                    me.getDocumentHolder().createDelayedElements();
                                    me.getToolbar().createDelayedElements();
                                    me.getController("Toolbar").createDelayedElements();
                                    me.getController("DocumentHolder").resetApi();
                                    me.getRightMenu().createDelayedElements();
                                    me.getRightPanel().createDelayedElements();
                                    me.getStatusInfo().updateInfo();
                                    me.api.asc_registerCallback("asc_onInitEditorShapes", Ext.bind(me.fillAutoShapes, me));
                                    me.api.asc_registerCallback("asc_onSendThemeColors", Ext.bind(me._onSendThemeColors, me));
                                    me.bindComponent.call(me, "sseimagesettings");
                                    me.bindComponent.call(me, "sseshapesettings");
                                    me.api.asc_registerCallback("asc_onSaveUrl", Ext.bind(me.onSaveUrl, me));
                                    me.api.asc_registerCallback("asc_onDocumentModifiedChanged", Ext.bind(me.onDocumentModifiedChanged, me));
                                    window.dlgFormulas = Ext.create("SSE.view.FormulaDialog", {
                                        closeAction: "hide"
                                    });
                                }
                            },
                            50);
                        }
                    },
                    50);
                },
                50);
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
    requestEditRights: function () {
        Common.Gateway.requestEditRights();
    },
    updateWindowTitle: function () {
        var title = this.defaultTitleText;
        if (this.getHeader().getDocumentCaption().length > 0) {
            title = this.getHeader().getDocumentCaption() + " - " + title;
        }
        if (this.api.asc_isDocumentModified()) {
            title = "* " + title;
        }
        window.document.title = title;
    },
    hidePreloader: function () {
        this.stackLongActions.pop({
            id: InitApplication,
            type: c_oAscAsyncActionType.BlockInteraction
        });
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
        var proc = (progress.CurrentFont + progress.CurrentImage) / (progress.FontsCount + progress.ImagesCount);
        if (elem) {
            elem.innerHTML = this.textLoadingDocument + ": " + Ext.util.Format.round(proc * 100, 0) + "%";
        } else {
            if (this.loadMask) {
                this.loadMask.setTitle(this.textLoadingDocument + ": " + Ext.util.Format.round(proc * 100, 0) + "%");
            }
        }
    },
    onAdvancedOptions: function (advOptions) {
        if (advOptions.asc_getOptionId() == c_oAscAdvancedOptionsID.CSV) {
            var win = Ext.create("SSE.view.OpenDialog", {
                codepages: advOptions.asc_getOptions().asc_getCodePages()
            });
            win.setSettings(advOptions.asc_getOptions().asc_getRecommendedSettings());
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr && this.api) {
                    this.api.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new Asc.asc_CCSVAdvancedOptions(s.encoding, s.delimiter));
                }
            },
            this), false);
            this.onDocumentHolderResize();
            this.hidePreloader();
            this.onLongActionEnd(c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
            win.show();
        }
    },
    lockEscapeKey: function (event) {
        if (event.getKey() == event.ESC) {
            event.preventDefault();
            event.stopPropagation();
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
        function showNextTip() {
            var str_tip = strings.shift();
            if (str_tip) {
                tipWindow.update(str_tip);
                tipWindow.show();
                var xy = tipWindow.getEl().getAlignToXY("infobox-cell-edit", "t-b?", [-65, 30]);
                tipWindow.showAt(xy);
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
    onActiveSheetChanged: function (index) {
        if (this.appComputedMode.isEdit && !this.appComputedMode.isEditDiagram && window.editor_elements_prepared) {
            this.getController("Common.controller.CommentsPopover").onApiHideComment();
            this.getController("Common.controller.CommentsList").applyCommentsFilter([{
                property: "id",
                value: new RegExp("^(doc_|sheet" + this.api.asc_getWorksheetId(index) + "_)")
            }]);
        }
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
    onConfirmAction: function (id, callback) {
        if (id == c_oAscConfirm.ConfirmReplaceRange) {
            var me = this;
            Ext.create("Ext.window.MessageBox", {
                buttonText: {
                    ok: "OK",
                    yes: this.textYes,
                    no: this.textNo,
                    cancel: "Cancel"
                }
            }).show({
                title: this.textConfirm,
                msg: this.confirmMoveCellRange,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.YESNO,
                fn: function (btn) {
                    if (callback) {
                        callback(btn == "yes");
                    }
                    me.onEditComplete(me.getDocumentHolder());
                }
            });
        }
    },
    onProcessMouse: function (data) {
        if (data.type == "mouseup") {
            var editor = document.getElementById("editor_sdk");
            if (editor) {
                var rect = editor.getBoundingClientRect();
                this.api.asc_onMouseUp(data.x - rect.left, data.y - rect.top);
            }
        }
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
                model: "SSE.model.ShapeModel"
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
                model: "SSE.model.ShapeModel"
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
            me.getController("Toolbar").FillAutoShapes();
        },
        50);
    },
    onInsertImage: function () {
        var rightpan = this.getRightPanel();
        if (rightpan) {
            rightpan.onInsertImage();
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
            me.getToolbar()._onSendThemeColors(colors, standart_colors);
        },
        50);
    },
    leavePageText: "You have unsaved changes in this document. Click 'Stay on this Page' then 'Save' to save them. Click 'Leave this Page' to discard all the unsaved changes.",
    criticalErrorTitle: "Error",
    notcriticalErrorTitle: "Warning",
    errorDefaultMessage: "Error code: %1",
    criticalErrorExtText: 'Press "Ok" to to back to document list.',
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
    loadingDocumentTitleText: "Loading Document",
    uploadImageSizeMessage: "Maximium image size limit exceeded.",
    uploadImageExtMessage: "Unknown image format.",
    uploadImageFileCountMessage: "No images uploaded.",
    reloadButtonText: "Reload Page",
    unknownErrorText: "Unknown error.",
    convertationTimeoutText: "Convertation timeout exceeded.",
    convertationErrorText: "Convertation failed.",
    downloadErrorText: "Download failed.",
    unsupportedBrowserErrorText: "Your browser is not supported.",
    requestEditRightsText: "Requesting editing rights...",
    requestEditFailedTitleText: "Access denied",
    requestEditFailedMessageText: "Someone is editing this document right now. Please try again later.",
    warnBrowserZoom: "Your browser's current zoom setting is not fully supported. Please reset to the default zoom by pressing Ctrl+0.",
    warnBrowserIE9: "The application has low capabilities on IE9. Use IE10 or higher",
    pastInMergeAreaError: "Cannot change part of a merged cell",
    titleRecalcFormulas: "Calculating formulas...",
    textRecalcFormulas: "Calculating formulas...",
    textPleaseWait: "It's working hard. Please wait...",
    errorWrongBracketsCount: "Found an error in the formula entered.<br>Wrong cout of brackets.",
    errorWrongOperator: "Found an error in the formula entered.<br>Wrong operator.",
    errorCountArgExceed: "Found an error in the formula entered.<br>Count of arguments exceeded.",
    errorCountArg: "Found an error in the formula entered.<br>Invalid number of arguments.",
    errorFormulaName: "Found an error in the formula entered.<br>Incorrect formula name.",
    errorFormulaParsing: "Internal error while the formula parsing.",
    errorArgsRange: "Found an error in the formula entered.<br>Incorrect arguments range.",
    errorUnexpectedGuid: "External error.<br>Unexpected Guid. Please, contact support.",
    errorDatabaseConnection: "External error.<br>Database connection error. Please, contact support.",
    errorFileRequest: "External error.<br>File Request. Please, contact support.",
    errorFileVKey: "External error.<br>Incorrect securety key. Please, contact support.",
    errorStockChart: "Incorrect rows order.",
    errorDataRange: "Incorrect data range.",
    errorOperandExpected: "Operand expected",
    errorKeyEncrypt: "Unknown key descriptor",
    errorKeyExpire: "Key descriptor expired",
    errorUsersExceed: "Count of users was exceed",
    errorMoveRange: "Cann't change a part of merged cell",
    errorBadImageUrl: "Image url is incorrect",
    errorCoAuthoringDisconnect: "Server connection lost. You can't edit anymore.",
    errorFilePassProtect: "The document is password protected.",
    txtEditingMode: "Set editing mode...",
    textLoadingDocument: "LOADING DOCUMENT",
    textConfirm: "Confirmation",
    confirmMoveCellRange: "The destination cell's range can contain data. Continue the operation?",
    textYes : "Yes",
    textNo: "No",
    textAnonymous: "Anonymous",
    txtBasicShapes: "Basic Shapes",
    txtFiguredArrows: "Figured Arrows",
    txtMath: "Math",
    txtCharts: "Charts",
    txtStarsRibbons: "Stars & Ribbons",
    txtCallouts: "Callouts",
    txtButtons: "Buttons",
    txtRectangles: "Rectangles",
    txtLines: "Lines",
    txtXAxis: "X Axis",
    txtYAxis: "Y Axis",
    txtSeries: "Seria",
    warnProcessRightsChange: "You have been denied the right to edit the file.",
    errorProcessSaveResult: "Saving is failed.",
    errorAutoFilterDataRange: "The operation could not be done for the selected range of cells. Select a single cell and then try again.",
    errorAutoFilterChangeFormatTable: "The operation is attempting to change a filtered range on the worksheet and cannot be completed. Remove Auto Filters from the sheet to complete the operation.",
    errorAutoFilterChange: "The operation is not allowed, as it is attempting to shift cells in a table on your worksheet."
});