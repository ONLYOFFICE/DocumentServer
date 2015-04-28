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
 define(["core", "irregularstack", "common/main/lib/component/Window", "common/main/lib/component/LoadMask", "common/main/lib/component/Tooltip", "common/main/lib/controller/Fonts", "spreadsheeteditor/main/app/collection/ShapeGroups", "spreadsheeteditor/main/app/collection/TableTemplates", "spreadsheeteditor/main/app/controller/FormulaDialog", "spreadsheeteditor/main/app/view/OpenDialog"], function () {
    SSE.Controllers.Main = Backbone.Controller.extend(_.extend((function () {
        var InitApplication = -254;
        var ApplyEditRights = -255;
        var LoadingDocument = -256;
        return {
            models: [],
            collections: ["ShapeGroups", "TableTemplates"],
            views: [],
            initialize: function () {},
            onLaunch: function () {
                window.asc_CCommentData = window.Asc.asc_CCommentData || window.asc_CCommentData;
                window.storagename = "table";
                this._state = {};
                if (!Common.Utils.isBrowserSupported()) {
                    Common.Utils.showBrowserRestriction();
                    Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
                    return;
                } else {}
                var value = window.localStorage.getItem("sse-settings-fontrender");
                if (value === null) {
                    value = window.devicePixelRatio > 1 ? "1" : "3";
                }
                this.api = new Asc.spreadsheet_api("editor_sdk", "ce-cell-content");
                this.api.asc_setFontRenderingMode(parseInt(value));
                this.api.asc_Init("../../../sdk/Fonts/");
                this.api.asc_registerCallback("asc_onOpenDocumentProgress", _.bind(this.onOpenDocument, this));
                this.api.asc_registerCallback("asc_onEndAction", _.bind(this.onLongActionEnd, this));
                this.api.asc_registerCallback("asc_onError", _.bind(this.onError, this));
                this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onCoAuthoringDisconnect, this));
                this.api.asc_registerCallback("asc_onAdvancedOptions", _.bind(this.onAdvancedOptions, this));
                this.api.asc_registerCallback("asc_onDocumentUpdateVersion", _.bind(this.onUpdateVersion, this));
                Common.NotificationCenter.on("api:disconnect", _.bind(this.onCoAuthoringDisconnect, this));
                this.stackLongActions = new Common.IrregularStack({
                    strongCompare: this._compareActionStrong,
                    weakCompare: this._compareActionWeak
                });
                this.stackLongActions.push({
                    id: InitApplication,
                    type: c_oAscAsyncActionType.BlockInteraction
                });
                this.isShowOpenDialog = false;
                this.editorConfig = {};
                Common.Gateway.on("init", _.bind(this.loadConfig, this));
                Common.Gateway.on("showmessage", _.bind(this.onExternalMessage, this));
                Common.Gateway.on("opendocument", _.bind(this.loadDocument, this));
                Common.Gateway.on("internalcommand", _.bind(this.onInternalCommand, this));
                Common.Gateway.ready();
                this.getApplication().getController("Viewport").setApi(this.api);
                var me = this;
                $(document.body).on("focus", "input, textarea:not(#ce-cell-content)", function (e) {
                    if (e && e.target && e.target.id && e.target.id === "clipboard-helper-text") {
                        me.api.asc_enableKeyEvents(true);
                        return;
                    }
                    if (this.isAppDisabled === true) {
                        return;
                    }
                    me.api.asc_enableKeyEvents(false);
                });
                $("#editor_sdk").focus(function (e) {
                    if (this.isAppDisabled === true) {
                        return;
                    }
                    if (!me.isModalShowed) {
                        me.api.asc_enableKeyEvents(true);
                    }
                });
                $(document.body).on("blur", "input, textarea", function (e) {
                    if (this.isAppDisabled === true) {
                        return;
                    }
                    if (!me.isModalShowed) {
                        me.api.asc_enableKeyEvents(true);
                    }
                });
                Common.NotificationCenter.on({
                    "modal:show": function (e) {
                        me.isModalShowed = true;
                        me.api.asc_enableKeyEvents(false);
                    },
                    "modal:close": function (dlg) {
                        if (dlg && dlg.$lastmodal && dlg.$lastmodal.size() < 1) {
                            me.isModalShowed = false;
                            me.api.asc_enableKeyEvents(true);
                        }
                    },
                    "modal:hide": function (dlg) {
                        if (dlg && dlg.$lastmodal && dlg.$lastmodal.size() < 1) {
                            me.isModalShowed = false;
                            me.api.asc_enableKeyEvents(true);
                        }
                    },
                    "edit:complete": _.bind(this.onEditComplete, this),
                    "settings:unitschanged": _.bind(this.unitsChanged, this)
                });
                this.initNames();
                Common.util.Shortcuts.delegateShortcuts({
                    shortcuts: {
                        "command+s,ctrl+s": _.bind(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                        this)
                    }
                });
            },
            loadConfig: function (data) {
                this.editorConfig = $.extend(this.editorConfig, data.config);
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
                this.editorConfig.user.id = this.editorConfig.user.id || ("uid-" + Date.now());
                this.editorConfig.user.name = this.editorConfig.user.name || this.textAnonymous;
                this.appOptions = {};
                this.appOptions.user = this.editorConfig.user;
                this.appOptions.canBack = this.editorConfig.nativeApp !== true && this.editorConfig.canBackToFolder === true;
                this.appOptions.nativeApp = this.editorConfig.nativeApp === true;
                this.appOptions.canCreateNew = !_.isEmpty(this.editorConfig.createUrl);
                this.appOptions.canOpenRecent = this.editorConfig.nativeApp !== true && this.editorConfig.recent !== undefined;
                this.appOptions.templates = this.editorConfig.templates;
                this.appOptions.recent = this.editorConfig.recent;
                this.appOptions.createUrl = this.editorConfig.createUrl;
                this.appOptions.lang = this.editorConfig.lang;
                this.appOptions.canAutosave = -1;
                this.appOptions.canAnalytics = false;
                this.appOptions.sharingSettingsUrl = this.editorConfig.sharingSettingsUrl;
                this.appOptions.isEditDiagram = this.editorConfig.mode == "editdiagram";
                this.headerView = this.getApplication().getController("Viewport").getView("Common.Views.Header");
                this.headerView.setCanBack(this.editorConfig.canBackToFolder === true);
                if (this.editorConfig.lang) {
                    this.api.asc_setLocale(this.editorConfig.lang);
                }
            },
            loadDocument: function (data) {
                this.appOptions.spreadsheet = data.doc;
                this.permissions = {};
                var docInfo = {};
                if (data.doc) {
                    this.permissions = _.extend(this.permissions, data.doc.permissions);
                    docInfo.Id = data.doc.key;
                    docInfo.Url = data.doc.url;
                    docInfo.Title = data.doc.title;
                    docInfo.Format = data.doc.fileType;
                    docInfo.Options = data.doc.options;
                    docInfo.UserId = this.editorConfig.user.id;
                    docInfo.UserName = this.editorConfig.user.name;
                    docInfo.VKey = data.doc.vkey;
                    docInfo.Origin = data.doc.origin;
                    docInfo.CallbackUrl = this.editorConfig.callbackUrl;
                    docInfo.OfflineApp = this.editorConfig.nativeApp === true;
                    this.headerView.setDocumentCaption(data.doc.title);
                }
                if (this.appOptions.isEditDiagram) {
                    this.onEditorPermissions(undefined);
                } else {
                    this.api.asc_registerCallback("asc_onGetEditorPermissions", _.bind(this.onEditorPermissions, this));
                    this.api.asc_setDocInfo(docInfo);
                    this.api.asc_getEditorPermissions();
                }
            },
            onProcessSaveResult: function (data) {
                this.api.asc_OnSaveEnd(data.result);
                if (data && data.result === false) {
                    Common.UI.error({
                        title: this.criticalErrorTitle,
                        msg: _.isEmpty(data.message) ? this.errorProcessSaveResult : data.message
                    });
                }
            },
            onProcessRightsChange: function (data) {
                if (data && data.enabled === false) {
                    this.api.asc_coAuthoringDisconnect();
                    this.getApplication().getController("LeftMenu").leftMenu.getMenu("file").panels["info"].onLostEditRights();
                    Common.UI.warning({
                        title: this.notcriticalErrorTitle,
                        msg: _.isEmpty(data.message) ? this.warnProcessRightsChange : data.message
                    });
                }
            },
            onProcessMouse: function (data) {
                if (data.type == "mouseup") {
                    var editor = document.getElementById("editor_sdk");
                    if (editor) {
                        var rect = editor.getBoundingClientRect();
                        var event = window.event || arguments.callee.caller.arguments[0];
                        this.api.asc_onMouseUp(event, data.x - rect.left, data.y - rect.top);
                    }
                }
            },
            goBack: function () {
                Common.Gateway.goBack();
            },
            onEditComplete: function (cmp, opts) {
                if (opts && opts.restorefocus && this.api.isCEditorFocused) {
                    this.formulaInput.blur();
                    this.formulaInput.focus();
                } else {
                    this.getApplication().getController("DocumentHolder").getView("DocumentHolder").focus();
                    this.api.isCEditorFocused = false;
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
            onLongActionEnd: function (type, id) {
                var action = {
                    id: id,
                    type: type
                };
                this.stackLongActions.pop(action);
                this.headerView.setDocumentCaption(this.api.asc_getDocumentName());
                this.updateWindowTitle(this.api.asc_isDocumentModified(), true);
                if (type === c_oAscAsyncActionType.BlockInteraction && id == c_oAscAsyncAction.Open) {
                    Common.Gateway.internalMessage("documentReady", {});
                    this.onDocumentReady();
                }
                action = this.stackLongActions.get({
                    type: c_oAscAsyncActionType.Information
                });
                action && this.setLongActionView(action);
                if (id == c_oAscAsyncAction.Save) {
                    this.toolbarView.synchronizeChanges();
                }
                action = this.stackLongActions.get({
                    type: c_oAscAsyncActionType.BlockInteraction
                });
                if (action) {
                    this.setLongActionView(action);
                } else {
                    this.loadMask && this.loadMask.hide();
                    if (type == c_oAscAsyncActionType.BlockInteraction) {
                        this.onEditComplete(this.loadMask, {
                            restorefocus: true
                        });
                    }
                }
            },
            setLongActionView: function (action) {
                var title = "";
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
                    title = this.savePreparingText;
                    break;
                case ApplyEditRights:
                    title = this.txtEditingMode;
                    break;
                case LoadingDocument:
                    title = this.loadingDocumentTitleText;
                    break;
                }
                if (action.type == c_oAscAsyncActionType.BlockInteraction) { ! this.loadMask && (this.loadMask = new Common.UI.LoadMask({
                        owner: $("#viewport")
                    }));
                    this.loadMask.setTitle(title);
                    if (!this.isShowOpenDialog) {
                        this.loadMask.show();
                    }
                }
            },
            onApplyEditRights: function (data) {
                if (data) {
                    if (data.allowed) {
                        this.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], ApplyEditRights);
                        this.appOptions.isEdit = true;
                        var me = this;
                        setTimeout(function () {
                            me.applyModeCommonElements();
                            me.applyModeEditorElements("view");
                            me.api.asc_setViewerMode(false);
                            var application = me.getApplication();
                            var documentHolderController = application.getController("DocumentHolder");
                            application.getController("LeftMenu").setMode(me.appOptions).createDelayedElements();
                            Common.NotificationCenter.trigger("layout:changed", "main");
                            var timer_sl = setInterval(function () {
                                if (window.styles_loaded) {
                                    clearInterval(timer_sl);
                                    documentHolderController.getView("DocumentHolder").createDelayedElements();
                                    documentHolderController.resetApi();
                                    application.getController("Toolbar").createDelayedElements();
                                    application.getController("RightMenu").createDelayedElements();
                                    application.getController("Statusbar").getView("Statusbar").update();
                                    application.getController("CellEditor").setMode(me.appOptions);
                                    me.api.asc_registerCallback("asc_onInitEditorShapes", _.bind(me.fillAutoShapes, me));
                                    me.api.asc_registerCallback("asc_onSaveUrl", _.bind(me.onSaveUrl, me));
                                    me.api.asc_registerCallback("asc_onDocumentModifiedChanged", _.bind(me.onDocumentModifiedChanged, me));
                                    me.api.asc_registerCallback("asc_onDocumentCanSaveChanged", _.bind(me.onDocumentCanSaveChanged, me));
                                    me.updateThemeColors();
                                    application.getController("FormulaDialog").setApi(me.api);
                                }
                            },
                            50);
                        },
                        50);
                    } else {
                        Common.UI.info({
                            title: this.requestEditFailedTitleText,
                            msg: data.message || this.requestEditFailedMessageText
                        });
                    }
                }
            },
            onDocumentReady: function () {
                if (this._isDocReady) {
                    return;
                }
                var me = this,
                value, tips = [];
                me._isDocReady = true;
                me.hidePreloader();
                me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                value = this.appOptions.isEditDiagram ? 100 : window.localStorage.getItem("sse-settings-zoom");
                this.api.asc_setZoom(!value ? 1 : parseInt(value) / 100);
                value = window.localStorage.getItem("sse-settings-livecomment");
                this.isLiveCommenting = !(value !== null && parseInt(value) == 0);
                this.isLiveCommenting ? this.api.asc_showComments() : this.api.asc_hideComments();
                me.api.asc_registerCallback("asc_onStartAction", _.bind(me.onLongActionBegin, me));
                me.api.asc_registerCallback("asc_onConfirmAction", _.bind(me.onConfirmAction, me));
                me.api.asc_registerCallback("asc_onActiveSheetChanged", _.bind(me.onActiveSheetChanged, me));
                var application = me.getApplication();
                me.headerView.setDocumentCaption(me.api.asc_getDocumentName());
                me.updateWindowTitle(me.api.asc_isDocumentModified(), true);
                var toolbarController = application.getController("Toolbar"),
                statusbarController = application.getController("Statusbar"),
                documentHolderController = application.getController("DocumentHolder"),
                rightmenuController = application.getController("RightMenu"),
                leftmenuController = application.getController("LeftMenu"),
                celleditorController = application.getController("CellEditor"),
                statusbarView = statusbarController.getView("Statusbar"),
                leftMenuView = leftmenuController.getView("LeftMenu"),
                documentHolderView = documentHolderController.getView("DocumentHolder"),
                chatController = application.getController("Common.Controllers.Chat");
                leftMenuView.getMenu("file").loadDocument({
                    doc: me.appOptions.spreadsheet
                });
                leftmenuController.setMode(me.appOptions).createDelayedElements().setApi(me.api);
                leftMenuView.disableMenu("all", false);
                if (!me.appOptions.isEditDiagram && me.appOptions.canBranding) {
                    me.getApplication().getController("LeftMenu").leftMenu.getMenu("about").setLicInfo(me.editorConfig.branding);
                }
                documentHolderController.setApi(me.api).loadConfig({
                    config: me.editorConfig
                });
                celleditorController.setApi(me.api).setMode(this.appOptions);
                celleditorController.onApiCellSelection(me.api.asc_getCellInfo());
                chatController.setApi(this.api).setMode(this.appOptions);
                statusbarController.createDelayedElements();
                statusbarController.setApi(me.api);
                documentHolderView.setApi(me.api);
                statusbarView.update();
                this.formulaInput = celleditorController.getView("CellEditor").$el.find("textarea");
                if (me.appOptions.isEdit) {
                    if (me.needToUpdateVersion) {
                        Common.NotificationCenter.trigger("api:disconnect");
                        toolbarController.onApiCoAuthoringDisconnect();
                    }
                    var timer_sl = setInterval(function () {
                        if (window.styles_loaded || me.appOptions.isEditDiagram) {
                            clearInterval(timer_sl);
                            Common.NotificationCenter.trigger("comments:updatefilter", {
                                property: "uid",
                                value: new RegExp("^(doc_|sheet" + me.api.asc_getActiveWorksheetId() + "_)")
                            });
                            documentHolderView.createDelayedElements();
                            toolbarController.createDelayedElements();
                            rightmenuController.createDelayedElements();
                            if (!me.appOptions.isEditDiagram) {
                                me.api.asc_registerCallback("asc_onInitEditorShapes", _.bind(me.fillAutoShapes, me));
                                me.updateThemeColors();
                            }
                            me.api.asc_registerCallback("asc_onSaveUrl", _.bind(me.onSaveUrl, me));
                            me.api.asc_registerCallback("asc_onDocumentModifiedChanged", _.bind(me.onDocumentModifiedChanged, me));
                            me.api.asc_registerCallback("asc_onDocumentCanSaveChanged", _.bind(me.onDocumentCanSaveChanged, me));
                            var formulasDlgController = application.getController("FormulaDialog");
                            if (formulasDlgController) {
                                formulasDlgController.setApi(me.api);
                            }
                            if (me.needToUpdateVersion) {
                                toolbarController.onApiCoAuthoringDisconnect();
                            }
                        }
                    },
                    50);
                }
                if (me.appOptions.canAutosave) {
                    value = window.localStorage.getItem("sse-settings-autosave");
                    value = (value !== null) ? parseInt(value) : 1;
                } else {
                    value = 0;
                }
                me.api.asc_setAutoSaveGap(value);
                if (me.appOptions.canAnalytics) {
                    Common.Gateway.on("applyeditrights", _.bind(me.onApplyEditRights, me));
                }
                Common.Gateway.on("processsaveresult", _.bind(me.onProcessSaveResult, me));
                Common.Gateway.on("processrightschange", _.bind(me.onProcessRightsChange, me));
                Common.Gateway.on("processmouse", _.bind(me.onProcessMouse, me));
                $(document).on("contextmenu", _.bind(me.onContextMenu, me));
                Common.Utils.isIE9m && tips.push(me.warnBrowserIE9); ! Common.Utils.isGecko && !me.appOptions.isEditDiagram && !me.appOptions.nativeApp && (Math.abs(me.getBrowseZoomLevel() - 1) > 0.1) && tips.push(Common.Utils.String.platformKey(me.warnBrowserZoom, "{0}"));
                if (tips.length) {
                    me.showTips(tips);
                }
            },
            onOpenDocument: function (progress) {
                var elem = document.getElementById("loadmask-text");
                var proc = (progress.CurrentFont + progress.CurrentImage) / (progress.FontsCount + progress.ImagesCount);
                proc = this.textLoadingDocument + ": " + Math.round(proc * 100) + "%";
                elem ? elem.innerHTML = proc : this.loadMask.setTitle(proc);
            },
            onEditorPermissions: function (params) {
                if (params) {
                    this.permissions.edit !== false && (this.permissions.edit = params.asc_getCanEdit());
                    this.permissions.download !== false && (this.permissions.download = params.asc_getCanDownload());
                    this.appOptions.canAutosave = this.editorConfig.canAutosave !== false && params.asc_getIsAutosaveEnable();
                    this.appOptions.canAnalytics = params.asc_getIsAnalyticsEnable();
                    this.appOptions.canCoAuthoring = params.asc_getCanCoAuthoring();
                    this.appOptions.canBranding = params.asc_getCanBranding() && (typeof(this.editorConfig.branding) == "object");
                    if (this.appOptions.canBranding) {
                        this.headerView.setBranding(this.editorConfig.branding);
                    }
                }
                this.appOptions.canEdit = this.permissions.edit === true;
                this.appOptions.isEdit = this.permissions.edit === true && this.editorConfig.mode !== "view";
                this.appOptions.canDownload = !this.appOptions.nativeApp && (this.permissions.download !== undefined ? this.permissions.download : true);
                this.applyModeCommonElements();
                this.applyModeEditorElements();
                this.api.asc_setViewerMode(!this.appOptions.isEdit);
                this.appOptions.isEditDiagram ? this.api.asc_LoadEmptyDocument() : this.api.asc_LoadDocument();
                if (!this.appOptions.isEdit) {
                    this.hidePreloader();
                    this.onLongActionBegin(c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
                }
            },
            applyModeCommonElements: function () {
                window.editor_elements_prepared = true;
                var value = window.localStorage.getItem("sse-hidden-title");
                value = this.appOptions.isEdit && (value !== null && parseInt(value) == 1);
                var app = this.getApplication(),
                viewport = app.getController("Viewport").getView("Viewport"),
                statusbarView = app.getController("Statusbar").getView("Statusbar");
                if (this.headerView) {
                    this.headerView.setHeaderCaption(this.appOptions.isEdit ? "Spreadsheet Editor" : "Spreadsheet Viewer");
                    this.headerView.setVisible(!this.appOptions.nativeApp && !value && !this.appOptions.isEditDiagram);
                }
                viewport && viewport.setMode(this.appOptions, true);
                statusbarView && statusbarView.setMode(this.appOptions);
                app.getController("DocumentHolder").setMode(this.appOptions);
                if (this.appOptions.isEditDiagram) {
                    statusbarView.hide();
                    app.getController("LeftMenu").getView("LeftMenu").hide();
                    $(window).mouseup(function (e) {
                        Common.Gateway.internalMessage("processMouse", {
                            event: "mouse:up"
                        });
                    }).mousemove($.proxy(function (e) {
                        if (this.isDiagramDrag) {
                            Common.Gateway.internalMessage("processMouse", {
                                event: "mouse:move",
                                pagex: e.pageX,
                                pagey: e.pageY
                            });
                        }
                    },
                    this));
                }
                if (this.api) {
                    var translateChart = new Asc.asc_CChartTranslate();
                    translateChart.asc_setTitle(this.txtDiagramTitle);
                    translateChart.asc_setXAxis(this.txtXAxis);
                    translateChart.asc_setYAxis(this.txtYAxis);
                    translateChart.asc_setSeries(this.txtSeries);
                    this.api.asc_setChartTranslate(translateChart);
                }
                if (!this.appOptions.isEditDiagram) {
                    this.api.asc_registerCallback("asc_onSendThemeColors", _.bind(this.onSendThemeColors, this));
                }
            },
            applyModeEditorElements: function (prevmode) {
                if (this.appOptions.isEdit) {
                    var me = this,
                    application = this.getApplication(),
                    toolbarController = application.getController("Toolbar"),
                    statusbarController = application.getController("Statusbar"),
                    rightmenuController = application.getController("RightMenu"),
                    printController = application.getController("Print"),
                    commentsController = application.getController("Common.Controllers.Comments"),
                    fontsControllers = application.getController("Common.Controllers.Fonts");
                    fontsControllers && fontsControllers.setApi(me.api);
                    toolbarController && toolbarController.setApi(me.api);
                    if (commentsController) {
                        commentsController.setMode(this.appOptions);
                        commentsController.setConfig({
                            config: me.editorConfig,
                            sdkviewname: "#ws-canvas-outer",
                            hintmode: true
                        },
                        me.api);
                    }
                    rightmenuController && rightmenuController.setApi(me.api);
                    printController && printController.setApi(me.api);
                    if (statusbarController) {
                        statusbarController.getView("Statusbar").changeViewMode(true);
                    }
                    if (prevmode == "view") {
                        if (commentsController) {
                            Common.NotificationCenter.trigger("comments:updatefilter", {
                                property: "uid",
                                value: new RegExp("^(doc_|sheet" + this.api.asc_getActiveWorksheetId() + "_)")
                            });
                        }
                    }
                    var viewport = this.getApplication().getController("Viewport").getView("Viewport");
                    viewport.applyEditorMode();
                    this.toolbarView = toolbarController.getView("Toolbar");
                    _.each([this.toolbarView, rightmenuController.getView("RightMenu")], function (view) {
                        if (view) {
                            view.setMode(me.appOptions);
                            view.setApi(me.api);
                        }
                    });
                    if (this.toolbarView) {
                        this.toolbarView.on("insertimage", _.bind(me.onInsertImage, me));
                        this.toolbarView.on("insertshape", _.bind(me.onInsertShape, me));
                        this.toolbarView.on("insertchart", _.bind(me.onInsertChart, me));
                    }
                    var value = window.localStorage.getItem("sse-settings-unit");
                    Common.Utils.Metric.setCurrentMetric((value !== null) ? parseInt(value) : Common.Utils.Metric.c_MetricUnits.cm);
                    if (!me.appOptions.isEditDiagram) {
                        var options = {};
                        JSON.parse(window.localStorage.getItem("sse-hidden-title")) && (options.title = true);
                        JSON.parse(window.localStorage.getItem("sse-hidden-formula")) && (options.formula = true);
                        JSON.parse(window.localStorage.getItem("sse-hidden-headings")) && (options.headings = true);
                        application.getController("Toolbar").hideElements(options);
                    } else {
                        rightmenuController.getView("RightMenu").hide();
                    }
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
                    window.onbeforeunload = _.bind(me.onBeforeUnload, me);
                }
            },
            onExternalMessage: function (msg) {
                if (msg) {
                    var tip = msg.msg.charAt(0).toUpperCase() + msg.msg.substring(1),
                    title = (msg.severity.indexOf("error") >= 0) ? this.criticalErrorTitle : this.notcriticalErrorTitle;
                    this.showTips([tip], false, title);
                    Common.component.Analytics.trackEvent("External Error", msg.title);
                }
            },
            onError: function (id, level, errData) {
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
                case c_oAscError.ID.CannotFillRange:
                    config.msg = this.errorFillRange;
                    break;
                case c_oAscError.ID.UserDrop:
                    config.msg = this.errorUserDrop;
                    break;
                default:
                    config.msg = this.errorDefaultMessage.replace("%1", id);
                    break;
                }
                if (level == c_oAscError.Level.Critical) {
                    Common.Gateway.reportError(id, config.msg);
                    config.title = this.criticalErrorTitle;
                    config.iconCls = "error";
                    if (this.editorConfig.canBackToFolder) {
                        config.msg += "<br/><br/>" + this.criticalErrorExtText;
                        config.callback = function (btn) {
                            if (btn == "ok") {
                                Common.Gateway.goBack();
                            }
                        };
                    }
                } else {
                    config.title = this.notcriticalErrorTitle;
                    config.iconCls = "warn";
                    config.buttons = ["ok"];
                    config.callback = _.bind(function (btn) {
                        this.onEditComplete();
                    },
                    this);
                }
                if ($(".asc-window.modal.alert:visible").length < 1) {
                    Common.UI.alert(config);
                    Common.component.Analytics.trackEvent("Internal Error", id.toString());
                }
            },
            onCoAuthoringDisconnect: function () {
                this.getApplication().getController("Viewport").getView("Viewport").setMode({
                    isDisconnected: true
                });
            },
            getBrowseZoomLevel: function () {
                if (Common.Utils.isIE) {
                    return screen.logicalXDPI / screen.deviceXDPI;
                } else {
                    var zoom = window.outerWidth / document.documentElement.clientWidth;
                    if (Common.Utils.isSafari) {
                        zoom = Math.floor(zoom * 10) / 10;
                    }
                    return zoom;
                }
            },
            showTips: function (strings, autohide, title) {
                var me = this;
                if (!strings.length) {
                    return;
                }
                if (typeof(strings) != "object") {
                    strings = [strings];
                }
                function showNextTip() {
                    var str_tip = strings.shift();
                    if (str_tip) {
                        str_tip += me.textCloseTip;
                        tooltip.setTitle(str_tip);
                        tooltip.show();
                    }
                }
                if (!this.tooltip) {
                    this.tooltip = new Common.UI.Tooltip({
                        owner: this.toolbarView,
                        hideonclick: true,
                        placement: "bottom",
                        cls: "main-info",
                        offset: 30
                    });
                }
                var tooltip = this.tooltip;
                tooltip.on("tooltip:hide", function () {
                    setTimeout(showNextTip, 300);
                });
                showNextTip();
            },
            updateWindowTitle: function (change, force) {
                if (this._state.isDocModified !== change || force) {
                    var title = this.defaultTitleText;
                    if (!_.isEmpty(this.headerView.getDocumentCaption())) {
                        title = this.headerView.getDocumentCaption() + " - " + title;
                    }
                    if (change) {
                        if (!_.isUndefined(title)) {
                            title = "* " + title;
                            this.headerView.setDocumentCaption(this.headerView.getDocumentCaption() + "*", true);
                        }
                    } else {
                        this.headerView.setDocumentCaption(this.headerView.getDocumentCaption());
                    }
                    if (window.document.title != title) {
                        window.document.title = title;
                    }
                    this._state.isDocModified = change;
                }
            },
            onDocumentChanged: function () {},
            onDocumentModifiedChanged: function (change) {
                this.updateWindowTitle(change);
                Common.Gateway.setDocumentModified(change);
                if (this.toolbarView && this.api) {
                    var isSyncButton = $(".btn-icon", this.toolbarView.btnSave.cmpEl).hasClass("btn-synch");
                    var cansave = this.api.asc_isDocumentCanSave();
                    if (this.toolbarView.btnSave.isDisabled() !== (!cansave && !isSyncButton)) {
                        this.toolbarView.btnSave.setDisabled(!cansave);
                    }
                }
            },
            onDocumentCanSaveChanged: function (isCanSave) {
                if (this.toolbarView) {
                    var isSyncButton = $(".btn-icon", this.toolbarView.btnSave.cmpEl).hasClass("btn-synch");
                    if (this.toolbarView.btnSave.isDisabled() !== (!isCanSave && !isSyncButton)) {
                        this.toolbarView.btnSave.setDisabled(!isCanSave && !isSyncButton);
                    }
                }
            },
            onBeforeUnload: function () {
                var isEdit = this.permissions.edit === true && this.editorConfig.mode !== "view" && this.editorConfig.mode !== "editdiagram";
                if (isEdit && this.api.asc_isDocumentModified()) {
                    return this.leavePageText;
                }
            },
            hidePreloader: function () {
                this.stackLongActions.pop({
                    id: InitApplication,
                    type: c_oAscAsyncActionType.BlockInteraction
                });
                Common.NotificationCenter.trigger("layout:changed", "main");
                $("#loading-mask").hide().remove();
            },
            onSaveUrl: function (url) {
                Common.Gateway.save(url);
            },
            onUpdateVersion: function (callback) {
                var me = this;
                me.needToUpdateVersion = true;
                me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                Common.UI.error({
                    msg: this.errorUpdateVersion,
                    callback: function () {
                        _.defer(function () {
                            Common.Gateway.updateVersion();
                            if (callback) {
                                callback.call(me);
                            }
                            me.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                        });
                    }
                });
            },
            onAdvancedOptions: function (advOptions) {
                if (advOptions.asc_getOptionId() == c_oAscAdvancedOptionsID.CSV) {
                    var me = this;
                    var dlg = new SSE.Views.OpenDialog({
                        codepages: advOptions.asc_getOptions().asc_getCodePages(),
                        settings: advOptions.asc_getOptions().asc_getRecommendedSettings(),
                        handler: function (encoding, delimiter) {
                            me.isShowOpenDialog = false;
                            if (me && me.api) {
                                me.api.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new Asc.asc_CCSVAdvancedOptions(encoding, delimiter));
                                me.loadMask && me.loadMask.show();
                            }
                        }
                    });
                    this.isShowOpenDialog = true;
                    this.loadMask && this.loadMask.hide();
                    this.onLongActionEnd(c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
                    dlg.show();
                }
            },
            onActiveSheetChanged: function (index) {
                if (!this.appOptions.isEditDiagram && window.editor_elements_prepared) {
                    this.application.getController("Statusbar").selectTab(index);
                    if (this.appOptions.isEdit) {
                        Common.NotificationCenter.trigger("comments:updatefilter", {
                            property: "uid",
                            value: new RegExp("^(doc_|sheet" + this.api.asc_getWorksheetId(index) + "_)")
                        },
                        false);
                    }
                }
            },
            onConfirmAction: function (id, apiCallback) {
                if (id == c_oAscConfirm.ConfirmReplaceRange) {
                    var me = this;
                    Common.UI.warning({
                        closable: false,
                        title: this.notcriticalErrorTitle,
                        msg: this.confirmMoveCellRange,
                        buttons: ["yes", "no"],
                        callback: _.bind(function (btn) {
                            if (apiCallback) {
                                apiCallback(btn === "ok");
                            }
                            if (btn == "ok") {
                                me.onEditComplete(me.application.getController("DocumentHolder").getView("DocumentHolder"));
                            }
                        },
                        this)
                    });
                }
            },
            initNames: function () {
                this.shapeGroupNames = [this.txtBasicShapes, this.txtFiguredArrows, this.txtMath, this.txtCharts, this.txtStarsRibbons, this.txtCallouts, this.txtButtons, this.txtRectangles, this.txtLines];
            },
            fillAutoShapes: function (groupNames, shapes) {
                if (_.isEmpty(shapes) || _.isEmpty(groupNames) || shapes.length != groupNames.length) {
                    return;
                }
                var me = this,
                shapegrouparray = [],
                shapeStore = this.getCollection("ShapeGroups");
                shapeStore.reset();
                var groupscount = groupNames.length;
                _.each(groupNames, function (groupName, index) {
                    var store = new Backbone.Collection([], {
                        model: SSE.Models.ShapeModel
                    });
                    var cols = (shapes[index].length) > 18 ? 7 : 6,
                    height = Math.ceil(shapes[index].length / cols) * 35 + 3,
                    width = 30 * cols;
                    _.each(shapes[index], function (shape, idx) {
                        store.add({
                            imageUrl: shape.Image,
                            data: {
                                shapeType: shape.Type
                            },
                            tip: me.textShape + " " + (idx + 1),
                            allowSelected: false,
                            selected: false
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
                    var store = new Backbone.Collection([], {
                        model: SSE.Models.ShapeModel
                    });
                    var cols = (shapes[groupscount - 1].length - 3) > 18 ? 7 : 6,
                    height = Math.ceil((shapes[groupscount - 1].length - 3) / cols) * 35 + 3,
                    width = 30 * cols;
                    for (var i = 0; i < shapes[groupscount - 1].length - 3; i++) {
                        var shape = shapes[groupscount - 1][i];
                        store.add({
                            imageUrl: shape.Image,
                            data: {
                                shapeType: shape.Type
                            },
                            allowSelected: false,
                            selected: false
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
                    me.getApplication().getController("Toolbar").fillAutoShapes();
                },
                50);
            },
            updateThemeColors: function () {
                var me = this;
                setTimeout(function () {
                    me.getApplication().getController("RightMenu").UpdateThemeColors();
                },
                50);
                setTimeout(function () {
                    me.getApplication().getController("Toolbar").updateThemeColors();
                },
                50);
                setTimeout(function () {
                    me.getApplication().getController("Statusbar").updateThemeColors();
                },
                50);
            },
            onSendThemeColors: function (colors, standart_colors) {
                Common.Utils.ThemeColor.setColors(colors, standart_colors);
                if (window.styles_loaded && !this.appOptions.isEditDiagram) {
                    this.updateThemeColors();
                }
            },
            loadLanguages: function () {},
            onInsertImage: function () {
                this.getApplication().getController("RightMenu").onInsertImage();
            },
            onInsertChart: function () {
                this.getApplication().getController("RightMenu").onInsertChart();
            },
            onInsertShape: function () {
                this.getApplication().getController("RightMenu").onInsertShape();
            },
            onInternalCommand: function (data) {
                if (data) {
                    switch (data.command) {
                    case "setChartData":
                        this.setChartData(data.data);
                        break;
                    case "getChartData":
                        this.getChartData();
                        break;
                    case "clearChartData":
                        this.clearChartData();
                        break;
                    case "setAppDisabled":
                        this.isAppDisabled = data.data;
                        this.api.asc_enableKeyEvents(false);
                        break;
                    case "queryClose":
                        if ($("body .asc-window:visible").length === 0) {
                            Common.Gateway.internalMessage("canClose", {
                                mr: data.data.mr,
                                answer: true
                            });
                        }
                        break;
                    case "window:drag":
                        this.isDiagramDrag = data.data;
                        break;
                    case "processmouse":
                        this.onProcessMouse(data.data);
                        break;
                    }
                }
            },
            setChartData: function (chart) {
                if (typeof chart === "object" && this.api) {
                    this.api.asc_addChartDrawingObject(chart);
                }
            },
            getChartData: function () {
                if (this.api) {
                    var chartData = this.api.asc_getWordChartObject();
                    if (typeof chartData === "object") {
                        Common.Gateway.internalMessage("chartData", {
                            data: chartData
                        });
                    }
                }
            },
            clearChartData: function () {
                this.api && this.api.asc_cleanWorksheet();
            },
            unitsChanged: function (m) {
                var value = window.localStorage.getItem("sse-settings-unit");
                Common.Utils.Metric.setCurrentMetric((value !== null) ? parseInt(value) : Common.Utils.Metric.c_MetricUnits.cm);
                this.getApplication().getController("RightMenu").updateMetricUnit();
                this.getApplication().getController("Print").getView("MainSettingsPrint").updateMetricUnit();
            },
            _compareActionStrong: function (obj1, obj2) {
                return obj1.id === obj2.id && obj1.type === obj2.type;
            },
            _compareActionWeak: function (obj1, obj2) {
                return obj1.type === obj2.type;
            },
            onContextMenu: function (event) {
                var canCopyAttr = event.target.getAttribute("data-can-copy"),
                isInputEl = (event.target instanceof HTMLInputElement) || (event.target instanceof HTMLTextAreaElement);
                if ((isInputEl && canCopyAttr === "false") || (!isInputEl && canCopyAttr !== "true")) {
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
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
            errorStockChart: "Incorrect row order. To build a stock chart place the data on the sheet in the following order:<br> opening price, max price, min price, closing price.",
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
            txtDiagramTitle: "Diagram Title",
            txtXAxis: "X Axis",
            txtYAxis: "Y Axis",
            txtSeries: "Seria",
            warnProcessRightsChange: "You have been denied the right to edit the file.",
            errorProcessSaveResult: "Saving is failed.",
            errorAutoFilterDataRange: "The operation could not be done for the selected range of cells.<br>Select a uniform data range inside or outside the table and try again.",
            errorAutoFilterChangeFormatTable: "The operation could not be done for the selected cells as you cannot move a part of the table.<br>Select another data range so that the whole table was shifted and try again.",
            errorAutoFilterChange: "The operation is not allowed, as it is attempting to shift cells in a table on your worksheet.",
            textCloseTip: "\nClick to close the tip.",
            textShape: "Shape",
            errorFillRange: "Could not fill the selected range of cells.<br>All the merged cells need to be the same size.",
            errorUpdateVersion: "The file version has been changed. The page will be reloaded.",
            defaultTitleText: "ONLYOFFICE Spreadsheet Editor",
            errorUserDrop: "The file cannot be accessed right now."
        };
    })(), SSE.Controllers.Main || {}));
});