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
 define(["core", "irregularstack", "common/main/lib/component/Window", "common/main/lib/component/LoadMask", "common/main/lib/component/Tooltip", "common/main/lib/controller/Fonts", "documenteditor/main/app/collection/ShapeGroups", "documenteditor/main/app/collection/EquationGroups"], function () {
    DE.Controllers.Main = Backbone.Controller.extend(_.extend((function () {
        var ApplyEditRights = -255;
        var LoadingDocument = -256;
        var mapCustomizationElements = {
            about: "button#left-btn-about",
            feedback: "button#left-btn-support",
            goback: "#fm-btn-back > a, #header-back > div"
        };
        return {
            models: [],
            collections: ["ShapeGroups", "EquationGroups", "Common.Collections.HistoryUsers"],
            views: [],
            initialize: function () {},
            onLaunch: function () {
                var me = this;
                window.storagename = "text";
                this.stackLongActions = new Common.IrregularStack({
                    strongCompare: function (obj1, obj2) {
                        return obj1.id === obj2.id && obj1.type === obj2.type;
                    },
                    weakCompare: function (obj1, obj2) {
                        return obj1.type === obj2.type;
                    }
                });
                this._state = {
                    isDisconnected: false
                };
                if (!Common.Utils.isBrowserSupported()) {
                    Common.Utils.showBrowserRestriction();
                    Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
                    return;
                }
                var value = window.localStorage.getItem("de-settings-fontrender");
                if (value === null) {
                    window.devicePixelRatio > 1 ? value = "1" : "0";
                }
                this.api = new asc_docs_api("editor_sdk");
                if (this.api) {
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
                    window["flat_desine"] = true;
                    this.api.CreateComponents();
                    this.api.SetFontsPath("../../../sdk/Fonts/");
                    this.api.Init();
                    this.api.asc_registerCallback("asc_onError", _.bind(this.onError, this));
                    this.api.asc_registerCallback("asc_onDocumentContentReady", _.bind(this.onDocumentContentReady, this));
                    this.api.asc_registerCallback("asc_onOpenDocumentProgress2", _.bind(this.onOpenDocument, this));
                    this.api.asc_registerCallback("asc_onDocumentUpdateVersion", _.bind(this.onUpdateVersion, this));
                    Common.NotificationCenter.on("api:disconnect", _.bind(this.onCoAuthoringDisconnect, this));
                    this.editorConfig = {};
                    this.appOptions = {};
                    Common.Gateway.on("init", _.bind(this.loadConfig, this));
                    Common.Gateway.on("showmessage", _.bind(this.onExternalMessage, this));
                    Common.Gateway.on("opendocument", _.bind(this.loadDocument, this));
                    Common.Gateway.ready();
                    this.getApplication().getController("Viewport").setApi(this.api);
                    this.getApplication().getController("Statusbar").setApi(this.api);
                    this.contComments = this.getApplication().getController("Common.Controllers.Comments");
                    $(document.body).on("focus", "input, textarea", function (e) {
                        if (!/area_id/.test(e.target.id)) {
                            me.api.asc_enableKeyEvents(false);
                        }
                    });
                    $("#editor_sdk").focus(function (e) {
                        if (!me.isModalShowed) {
                            me.api.asc_enableKeyEvents(true);
                        }
                    });
                    $(document.body).on("blur", "input, textarea", function (e) {
                        if (!me.isModalShowed) {
                            if (! (Common.Utils.isSafari && Common.Utils.isMac)) {
                                me.api.asc_enableKeyEvents(true);
                            }
                        }
                    });
                    Common.NotificationCenter.on({
                        "modal:show": function () {
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
                        "settings:unitschanged": _.bind(this.unitsChanged, this),
                        "dataview:focus": function (e) {
                            me.api.asc_enableKeyEvents(false);
                        },
                        "dataview:blur": function (e) {
                            if (!me.isModalShowed) {
                                me.api.asc_enableKeyEvents(true);
                                me.onEditComplete();
                            }
                        },
                        "edit:complete": _.bind(me.onEditComplete, me)
                    });
                    this.initNames();
                }
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
                this.appOptions.user = this.editorConfig.user;
                this.appOptions.canBack = this.editorConfig.nativeApp !== true && this.editorConfig.canBackToFolder === true;
                this.appOptions.nativeApp = this.editorConfig.nativeApp === true;
                this.appOptions.isDesktopApp = this.editorConfig.targetApp == "desktop";
                this.appOptions.canCreateNew = !_.isEmpty(this.editorConfig.createUrl) && !this.appOptions.isDesktopApp;
                this.appOptions.canOpenRecent = this.editorConfig.nativeApp !== true && this.editorConfig.recent !== undefined && !this.appOptions.isDesktopApp;
                this.appOptions.templates = this.editorConfig.templates;
                this.appOptions.recent = this.editorConfig.recent;
                this.appOptions.createUrl = this.editorConfig.createUrl;
                this.appOptions.lang = this.editorConfig.lang;
                this.appOptions.sharingSettingsUrl = this.editorConfig.sharingSettingsUrl;
                this.appOptions.canAnalytics = false;
                this.getApplication().getController("Viewport").getView("Common.Views.Header").setCanBack(this.editorConfig.canBackToFolder === true);
                if (this.editorConfig.lang) {
                    this.api.asc_setLocale(this.editorConfig.lang);
                }
            },
            loadDocument: function (data) {
                this.permissions = {};
                this.document = data.doc;
                var docInfo = {};
                if (data.doc) {
                    this.permissions = $.extend(this.permissions, data.doc.permissions);
                    docInfo = new CDocInfo();
                    docInfo.put_Id(data.doc.key);
                    docInfo.put_Url(data.doc.url);
                    docInfo.put_Title(data.doc.title);
                    docInfo.put_Format(data.doc.fileType);
                    docInfo.put_VKey(data.doc.vkey);
                    docInfo.put_Options(data.doc.options);
                    docInfo.put_UserId(this.editorConfig.user.id);
                    docInfo.put_UserName(this.editorConfig.user.name);
                    docInfo.put_CallbackUrl(this.editorConfig.callbackUrl);
                }
                this.api.asc_registerCallback("asc_onGetEditorPermissions", _.bind(this.onEditorPermissions, this));
                this.api.asc_setDocInfo(docInfo);
                this.api.asc_getEditorPermissions();
                if (data.doc) {
                    this.getApplication().getController("Viewport").getView("Common.Views.Header").setDocumentCaption(data.doc.title);
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
                    this.getApplication().getController("LeftMenu").leftMenu.getMenu("file").panels["rights"].onLostEditRights();
                    Common.UI.warning({
                        title: this.notcriticalErrorTitle,
                        msg: _.isEmpty(data.message) ? this.warnProcessRightsChange : data.message
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
            onRefreshHistory: function (opts) {
                this.loadMask && this.loadMask.hide();
                if (opts.data.error) {
                    var config = {
                        closable: false,
                        title: this.notcriticalErrorTitle,
                        msg: opts.data.error,
                        iconCls: "warn",
                        buttons: ["ok"],
                        callback: _.bind(function (btn) {
                            this.onEditComplete();
                        },
                        this)
                    };
                    Common.UI.alert(config);
                } else {
                    this.api.asc_coAuthoringDisconnect();
                    this.getApplication().getController("LeftMenu").getView("LeftMenu").showHistory();
                    this.disableEditing(true);
                    var versions = opts.data.history,
                    historyStore = this.getApplication().getCollection("Common.Collections.HistoryVersions"),
                    currentVersion = null;
                    if (historyStore) {
                        var arrVersions = [],
                        ver,
                        version,
                        group = -1,
                        prev_ver = -1,
                        arrColors = [],
                        docIdPrev = "",
                        usersStore = this.getApplication().getCollection("Common.Collections.HistoryUsers"),
                        user = null,
                        usersCnt = 0;
                        for (ver = versions.length - 1; ver >= 0; ver--) {
                            version = versions[ver];
                            if (version && version.user) {
                                docIdPrev = (ver > 0 && versions[ver - 1]) ? versions[ver - 1].key : version.key + "0";
                                user = usersStore.findUser(version.user.id);
                                if (!user) {
                                    user = new Common.Models.User({
                                        id: version.user.id,
                                        username: version.user.name,
                                        colorval: c_oAscArrUserColors[usersCnt],
                                        color: this.generateUserColor(c_oAscArrUserColors[usersCnt++])
                                    });
                                    usersStore.add(user);
                                }
                                arrVersions.push(new Common.Models.HistoryVersion({
                                    version: version.version_group,
                                    revision: version.version,
                                    userid: version.user.id,
                                    username: version.user.name,
                                    usercolor: user.get("color"),
                                    created: version.created,
                                    docId: version.key,
                                    markedAsVersion: (group !== version.version_group),
                                    selected: (opts.data.currentVersion == version.version)
                                }));
                                if (opts.data.currentVersion == version.version) {
                                    currentVersion = arrVersions[arrVersions.length - 1];
                                }
                                group = version.version_group;
                                if (prev_ver !== version.version) {
                                    prev_ver = version.version;
                                    arrColors.reverse();
                                    for (i = 0; i < arrColors.length; i++) {
                                        arrVersions[arrVersions.length - i - 2].set("arrColors", arrColors);
                                    }
                                    arrColors = [];
                                }
                                arrColors.push(user.get("colorval"));
                                var changes = version.changes,
                                change, i;
                                if (changes && changes.length > 0) {
                                    arrVersions[arrVersions.length - 1].set("changeid", changes.length - 1);
                                    arrVersions[arrVersions.length - 1].set("docIdPrev", docIdPrev);
                                    for (i = changes.length - 2; i >= 0; i--) {
                                        change = changes[i];
                                        user = usersStore.findUser(change.user.id);
                                        if (!user) {
                                            user = new Common.Models.User({
                                                id: change.user.id,
                                                username: change.user.name,
                                                colorval: c_oAscArrUserColors[usersCnt],
                                                color: this.generateUserColor(c_oAscArrUserColors[usersCnt++])
                                            });
                                            usersStore.add(user);
                                        }
                                        arrVersions.push(new Common.Models.HistoryVersion({
                                            version: version.version_group,
                                            revision: version.version,
                                            changeid: i,
                                            userid: change.user.id,
                                            username: change.user.name,
                                            usercolor: user.get("color"),
                                            created: change.created,
                                            docId: version.key,
                                            docIdPrev: docIdPrev,
                                            selected: false
                                        }));
                                        arrColors.push(user.get("colorval"));
                                    }
                                } else {
                                    if (ver == 0 && versions.length == 1) {
                                        arrVersions[arrVersions.length - 1].set("docId", version.key + "1");
                                    }
                                }
                            }
                        }
                        if (arrColors.length > 0) {
                            arrColors.reverse();
                            for (i = 0; i < arrColors.length; i++) {
                                arrVersions[arrVersions.length - i - 1].set("arrColors", arrColors);
                            }
                            arrColors = [];
                        }
                        historyStore[historyStore.size() > 0 ? "add" : "reset"](arrVersions);
                        if (currentVersion) {
                            this.getApplication().getController("Common.Controllers.History").onSelectRevision(null, null, currentVersion);
                        }
                    }
                }
            },
            generateUserColor: function (color) {
                return "#" + ("000000" + color.toString(16)).substr(-6);
            },
            disableEditing: function (disable) {
                var app = this.getApplication();
                if (this.appOptions.isEdit) {
                    app.getController("Toolbar").DisableToolbar(disable, disable);
                    app.getController("RightMenu").SetDisabled(disable, false);
                    app.getController("Statusbar").getView("Statusbar").btnLanguage.setDisabled(disable);
                    app.getController("Statusbar").getView("Statusbar").btnDocLanguage.setDisabled(disable);
                    var tooltip = app.getController("Toolbar").getView("Toolbar").synchTooltip;
                    if (tooltip) {
                        tooltip.hide();
                    }
                }
                app.getController("LeftMenu").SetDisabled(disable);
            },
            goBack: function () {
                Common.Gateway.goBack();
            },
            onEditComplete: function (cmp) {
                var application = this.getApplication(),
                toolbarController = application.getController("Toolbar"),
                toolbarView = toolbarController.getView("Toolbar");
                if (this.appOptions.isEdit && toolbarView && (toolbarView.btnInsertShape.pressed || toolbarView.btnInsertText.pressed) && (!_.isObject(arguments[1]) || arguments[1].id !== "id-toolbar-btn-insertshape")) {
                    if (this.api) {
                        this.api.StartAddShape("", false);
                    }
                    toolbarView.btnInsertShape.toggle(false, false);
                    toolbarView.btnInsertText.toggle(false, false);
                }
                application.getController("DocumentHolder").getView("DocumentHolder").focus();
                if (this.api) {
                    var cansave = this.api.asc_isDocumentCanSave();
                    var isSyncButton = $(".btn-icon", toolbarView.btnSave.cmpEl).hasClass("btn-synch");
                    if (toolbarView.btnSave.isDisabled() !== (!cansave && !isSyncButton)) {
                        toolbarView.btnSave.setDisabled(!cansave && !isSyncButton);
                    }
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
                this.getApplication().getController("Viewport").getView("Common.Views.Header").setDocumentCaption(this.api.get_DocumentName());
                this.updateWindowTitle(true);
                action = this.stackLongActions.get({
                    type: c_oAscAsyncActionType.Information
                });
                if (action) {
                    this.setLongActionView(action);
                } else {
                    this.getApplication().getController("Statusbar").setStatusCaption("");
                }
                action = this.stackLongActions.get({
                    type: c_oAscAsyncActionType.BlockInteraction
                });
                action ? this.setLongActionView(action) : this.loadMask && this.loadMask.hide();
                if (id == c_oAscAsyncAction["Save"]) {
                    this.synchronizeChanges();
                }
                if (type == c_oAscAsyncActionType.BlockInteraction && (!this.getApplication().getController("LeftMenu").dlgSearch || !this.getApplication().getController("LeftMenu").dlgSearch.isVisible())) {
                    this.onEditComplete(this.loadMask);
                    this.api.asc_enableKeyEvents(true);
                }
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
                        this.loadMask = new Common.UI.LoadMask({
                            owner: $("#viewport")
                        });
                    }
                    this.loadMask.setTitle(title);
                    this.loadMask.show();
                } else {
                    this.getApplication().getController("Statusbar").setStatusCaption(text);
                }
            },
            onApplyEditRights: function (data) {
                var application = this.getApplication();
                application.getController("Statusbar").setStatusCaption("");
                if (data) {
                    if (data.allowed) {
                        data.requestrights = true;
                        this.appOptions.isEdit = true;
                        this.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], ApplyEditRights);
                        var me = this;
                        setTimeout(function () {
                            me.applyModeCommonElements();
                            me.applyModeEditorElements();
                            me.api.SetViewMode(false);
                            var timer_rp = setInterval(function () {
                                clearInterval(timer_rp);
                                var toolbarController = application.getController("Toolbar"),
                                rightmenuController = application.getController("RightMenu"),
                                leftmenuController = application.getController("LeftMenu"),
                                documentHolderController = application.getController("DocumentHolder"),
                                fontsControllers = application.getController("Common.Controllers.Fonts");
                                leftmenuController.setMode(me.appOptions).createDelayedElements();
                                rightmenuController.createDelayedElements();
                                Common.NotificationCenter.trigger("layout:changed", "main");
                                var timer_sl = setInterval(function () {
                                    if (window.styles_loaded) {
                                        clearInterval(timer_sl);
                                        fontsControllers.loadFonts();
                                        documentHolderController.getView("DocumentHolder").createDelayedElements();
                                        documentHolderController.getView("DocumentHolder").changePosition();
                                        me.loadLanguages();
                                        var shapes = me.api.get_PropertyEditorShapes();
                                        if (shapes) {
                                            me.fillAutoShapes(shapes[0], shapes[1]);
                                        }
                                        me.updateThemeColors();
                                        toolbarController.activateControls();
                                        me.api.UpdateInterfaceState();
                                    }
                                },
                                50);
                            },
                            50);
                        },
                        100);
                    } else {
                        Common.UI.info({
                            title: this.requestEditFailedTitleText,
                            msg: data.message || this.requestEditFailedMessageText
                        });
                    }
                }
            },
            onDocumentContentReady: function () {
                if (this._isDocReady) {
                    return;
                }
                var me = this,
                value, tips = [];
                me._isDocReady = true;
                me.api.SetDrawingFreeze(false);
                me.hidePreloader();
                me.onLongActionEnd(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                value = window.localStorage.getItem("de-settings-livecomment");
                this.isLiveCommenting = !(value !== null && parseInt(value) == 0);
                this.isLiveCommenting ? this.api.asc_showComments() : this.api.asc_hideComments();
                value = window.localStorage.getItem("de-settings-zoom");
                this.api.zoom((value !== null) ? parseInt(value) : 100);
                value = window.localStorage.getItem("de-show-hiddenchars");
                me.api.put_ShowParaMarks((value !== null) ? eval(value) : false);
                value = window.localStorage.getItem("de-show-tableline");
                me.api.put_ShowTableEmptyLine((value !== null) ? eval(value) : true);
                value = window.localStorage.getItem("de-settings-spellcheck");
                me.api.asc_setSpellCheck(value === null || parseInt(value) == 1);
                window.localStorage.setItem("de-settings-showsnaplines", me.api.get_ShowSnapLines() ? 1 : 0);
                if ( !! window["AscDesktopEditor"]) {
                    Common.Utils.isIE9m && tips.push(me.warnBrowserIE9); ! Common.Utils.isGecko && (Math.abs(me.getBrowseZoomLevel() - 1) > 0.1) && tips.push(Common.Utils.String.platformKey(me.warnBrowserZoom, "{0}"));
                    if (tips.length) {
                        me.showTips(tips);
                    }
                }
                me.api.asc_registerCallback("asc_onStartAction", _.bind(me.onLongActionBegin, me));
                me.api.asc_registerCallback("asc_onEndAction", _.bind(me.onLongActionEnd, me));
                me.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(me.onCoAuthoringDisconnect, me));
                var application = me.getApplication();
                application.getController("Viewport").getView("Common.Views.Header").setDocumentCaption(me.api.get_DocumentName());
                me.updateWindowTitle(true);
                value = window.localStorage.getItem("de-settings-inputmode");
                me.api.SetTextBoxInputMode(value !== null && parseInt(value) == 1);
                value = window.localStorage.getItem("de-settings-showchanges");
                me.api.SetCollaborativeMarksShowType(value == "all" ? c_oAscCollaborativeMarksShowType.All : value == "none" ? c_oAscCollaborativeMarksShowType.None : c_oAscCollaborativeMarksShowType.LastChanges);
                var toolbarController = application.getController("Toolbar"),
                statusbarController = application.getController("Statusbar"),
                documentHolderController = application.getController("DocumentHolder"),
                fontsController = application.getController("Common.Controllers.Fonts"),
                rightmenuController = application.getController("RightMenu"),
                leftmenuController = application.getController("LeftMenu"),
                chatController = application.getController("Common.Controllers.Chat");
                leftmenuController.getView("LeftMenu").getMenu("file").loadDocument({
                    doc: me.document
                });
                leftmenuController.setMode(me.appOptions).createDelayedElements().setApi(me.api);
                chatController.setApi(this.api).setMode(this.appOptions);
                application.getController("Common.Controllers.ExternalDiagramEditor").setApi(this.api).loadConfig({
                    config: this.editorConfig
                });
                documentHolderController.setApi(me.api);
                documentHolderController.createDelayedElements();
                statusbarController.createDelayedElements();
                leftmenuController.getView("LeftMenu").disableMenu("all", false);
                if (me.appOptions.canBranding) {
                    me.getApplication().getController("LeftMenu").leftMenu.getMenu("about").setLicInfo(me.editorConfig.customization);
                }
                documentHolderController.getView("DocumentHolder").setApi(me.api).on("editcomplete", _.bind(me.onEditComplete, me));
                if (me.appOptions.isEdit) {
                    if (me.needToUpdateVersion) {
                        Common.NotificationCenter.trigger("api:disconnect");
                    }
                    var timer_sl = setInterval(function () {
                        if (window.styles_loaded) {
                            clearInterval(timer_sl);
                            toolbarController.getView("Toolbar").createDelayedElements();
                            fontsController.loadFonts();
                            documentHolderController.getView("DocumentHolder").createDelayedElements();
                            me.loadLanguages();
                            rightmenuController.createDelayedElements();
                            var shapes = me.api.get_PropertyEditorShapes();
                            if (shapes) {
                                me.fillAutoShapes(shapes[0], shapes[1]);
                            }
                            me.updateThemeColors();
                            toolbarController.activateControls();
                            if (me.needToUpdateVersion) {
                                toolbarController.onApiCoAuthoringDisconnect();
                            }
                            me.api.UpdateInterfaceState();
                        }
                    },
                    50);
                }
                if (me.appOptions.canAutosave) {
                    value = window.localStorage.getItem("de-settings-autosave");
                    value = (value !== null) ? parseInt(value) : 1;
                } else {
                    value = 0;
                }
                me.api.asc_setAutoSaveGap(value);
                if (this.appOptions.canAnalytics) {
                    Common.component.Analytics.initialize("UA-12442749-13", "Document Editor");
                }
                Common.Gateway.on("applyeditrights", _.bind(me.onApplyEditRights, me));
                Common.Gateway.on("processsaveresult", _.bind(me.onProcessSaveResult, me));
                Common.Gateway.on("processrightschange", _.bind(me.onProcessRightsChange, me));
                Common.Gateway.on("processmouse", _.bind(me.onProcessMouse, me));
                Common.Gateway.on("refreshhistory", _.bind(me.onRefreshHistory, me));
                $(document).on("contextmenu", _.bind(me.onContextMenu, me));
            },
            onOpenDocument: function () {},
            onEditorPermissions: function (params) {
                this.permissions.edit !== false && (this.permissions.edit = params.asc_getCanEdit());
                this.permissions.download !== false && (this.permissions.download = params.asc_getCanDownload());
                this.appOptions.canCoAuthoring = true;
                this.appOptions.canEdit = this.permissions.edit === true;
                this.appOptions.isEdit = this.appOptions.canEdit && this.editorConfig.mode !== "view";
                this.appOptions.canDownload = !this.appOptions.nativeApp && this.permissions.download;
                this.appOptions.canAutosave = this.editorConfig.canAutosave !== false && params.asc_getIsAutosaveEnable();
                this.appOptions.canAnalytics = params.asc_getIsAnalyticsEnable();
                this.appOptions.canLicense = params.asc_getCanLicense ? params.asc_getCanLicense() : false;
                this.appOptions.canComments = this.appOptions.canLicense && !((typeof(this.editorConfig.customization) == "object") && this.editorConfig.customization.comments === false);
                this.appOptions.canChat = this.appOptions.canLicense && !((typeof(this.editorConfig.customization) == "object") && this.editorConfig.customization.chat === false);
                this.appOptions.customization = this.editorConfig.customization;
                this.appOptions.canUseHistory = this.appOptions.canLicense && this.editorConfig.canUseHistory && this.appOptions.canEdit && this.appOptions.canCoAuthoring;
                this.appOptions.canBranding = params.asc_getCanBranding() && (typeof(this.editorConfig.customization) == "object");
                if (this.appOptions.canBranding) {
                    this.getApplication().getController("Viewport").getView("Common.Views.Header").setBranding(this.editorConfig.customization);
                }
                this.applyModeCommonElements();
                this.applyModeEditorElements();
                this.api.SetViewMode(!this.appOptions.isEdit);
                this.api.LoadDocument();
                if (!this.appOptions.isEdit) {
                    this.hidePreloader();
                    this.onLongActionBegin(c_oAscAsyncActionType["BlockInteraction"], LoadingDocument);
                }
            },
            applyModeCommonElements: function () {
                window.editor_elements_prepared = true;
                var value = window.localStorage.getItem("de-hidden-title");
                value = this.appOptions.isEdit && (value !== null && parseInt(value) == 1);
                var app = this.getApplication(),
                viewport = app.getController("Viewport").getView("Viewport"),
                headerView = app.getController("Viewport").getView("Common.Views.Header"),
                statusbarView = app.getController("Statusbar").getView("Statusbar"),
                documentHolder = app.getController("DocumentHolder").getView("DocumentHolder");
                if (headerView) {
                    headerView.setHeaderCaption(this.appOptions.isEdit ? "Document Editor" : "Document Viewer");
                    headerView.setVisible(!this.appOptions.nativeApp && !value && !this.appOptions.isDesktopApp);
                }
                if (this.appOptions.nativeApp) {
                    $("body").removeClass("safari");
                }
                viewport && viewport.setMode(this.appOptions);
                statusbarView && statusbarView.setMode(this.appOptions);
                documentHolder.setMode(this.appOptions);
                this.api.asc_registerCallback("asc_onSendThemeColors", _.bind(this.onSendThemeColors, this));
            },
            applyModeEditorElements: function () {
                if (this.appOptions.isEdit) {
                    var me = this,
                    application = this.getApplication(),
                    toolbarController = application.getController("Toolbar"),
                    rightmenuController = application.getController("RightMenu"),
                    fontsControllers = application.getController("Common.Controllers.Fonts");
                    fontsControllers && fontsControllers.setApi(me.api);
                    toolbarController && toolbarController.setApi(me.api);
                    me.contComments.setMode(this.appOptions);
                    me.contComments.setConfig({
                        config: me.editorConfig
                    },
                    me.api);
                    rightmenuController && rightmenuController.setApi(me.api);
                    var viewport = this.getApplication().getController("Viewport").getView("Viewport");
                    viewport.applyEditorMode();
                    var toolbarView = (toolbarController) ? toolbarController.getView("Toolbar") : null;
                    _.each([toolbarView, rightmenuController.getView("RightMenu")], function (view) {
                        if (view) {
                            view.setApi(me.api);
                            view.on("editcomplete", _.bind(me.onEditComplete, me));
                            view.setMode(me.appOptions);
                        }
                    });
                    if (toolbarView) {
                        toolbarView.on("insertimage", _.bind(me.onInsertImage, me));
                        toolbarView.on("inserttable", _.bind(me.onInsertTable, me));
                        toolbarView.on("insertshape", _.bind(me.onInsertShape, me));
                        toolbarView.on("insertchart", _.bind(me.onInsertChart, me));
                    }
                    var value = window.localStorage.getItem("de-settings-unit");
                    Common.Utils.Metric.setCurrentMetric((value !== null) ? parseInt(value) : Common.Utils.Metric.c_MetricUnits.cm);
                    value = window.localStorage.getItem("de-hidden-rulers");
                    me.api.asc_SetViewRulers(value === null || parseInt(value) === 0);
                    me.api.asc_registerCallback("asc_onDocumentModifiedChanged", _.bind(me.onDocumentModifiedChanged, me));
                    me.api.asc_registerCallback("asc_onDocumentCanSaveChanged", _.bind(me.onDocumentCanSaveChanged, me));
                    me.api.asc_registerCallback("asc_onSaveUrl", _.bind(me.onSaveUrl, me));
                    me.api.asc_registerCallback("asc_onCollaborativeChanges", _.bind(me.onCollaborativeChanges, me));
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
                case c_oAscError.ID.StockChartError:
                    config.msg = this.errorStockChart;
                    break;
                case c_oAscError.ID.DataRangeError:
                    config.msg = this.errorDataRange;
                    break;
                case c_oAscError.ID.Database:
                    config.msg = this.errorDatabaseConnection;
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
                Common.UI.alert(config);
                Common.component.Analytics.trackEvent("Internal Error", id.toString());
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
                        owner: this.getApplication().getController("Toolbar").getView("Toolbar"),
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
            updateWindowTitle: function (force) {
                var isModified = this.api.isDocumentModified();
                if (this._state.isDocModified !== isModified || force) {
                    var title = this.defaultTitleText;
                    var headerView = this.getApplication().getController("Viewport").getView("Common.Views.Header");
                    if (!_.isEmpty(headerView.getDocumentCaption())) {
                        title = headerView.getDocumentCaption() + " - " + title;
                    }
                    if (isModified) {
                        if (!_.isUndefined(title)) {
                            title = "* " + title;
                            headerView.setDocumentCaption(headerView.getDocumentCaption() + "*", true);
                        }
                    } else {
                        headerView.setDocumentCaption(headerView.getDocumentCaption());
                    }
                    if (window.document.title != title) {
                        window.document.title = title;
                    }
                    Common.Gateway.setDocumentModified(isModified);
                    this._state.isDocModified = isModified;
                }
            },
            onDocumentModifiedChanged: function () {
                var isModified = this.api.asc_isDocumentCanSave();
                if (this._state.isDocModified !== isModified) {
                    Common.Gateway.setDocumentModified(this.api.isDocumentModified());
                }
                this.updateWindowTitle();
                var toolbarView = this.getApplication().getController("Toolbar").getView("Toolbar");
                if (toolbarView) {
                    var isSyncButton = $(".btn-icon", toolbarView.btnSave.cmpEl).hasClass("btn-synch");
                    if (toolbarView.btnSave.isDisabled() !== (!isModified && !isSyncButton)) {
                        toolbarView.btnSave.setDisabled(!isModified && !isSyncButton);
                    }
                }
                if (this.contComments.isDummyComment) {
                    this.contComments.clearDummyComment();
                }
            },
            onDocumentCanSaveChanged: function (isCanSave) {
                var application = this.getApplication(),
                toolbarController = application.getController("Toolbar"),
                toolbarView = toolbarController.getView("Toolbar");
                if (toolbarView && this.api) {
                    var isSyncButton = $(".btn-icon", toolbarView.btnSave.cmpEl).hasClass("btn-synch");
                    if (toolbarView.btnSave.isDisabled() !== (!isCanSave && !isSyncButton)) {
                        toolbarView.btnSave.setDisabled(!isCanSave && !isSyncButton);
                    }
                }
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
            onBeforeUnload: function () {
                if (this.api.isDocumentModified()) {
                    return this.leavePageText;
                }
            },
            hidePreloader: function () {
                if ( !! this.appOptions.customization && !this.appOptions.customization.done) {
                    this.appOptions.customization.done = true;
                    Common.Utils.applyCustomization(this.appOptions.customization, mapCustomizationElements);
                }
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
                Common.UI.warning({
                    title: me.titleUpdateVersion,
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
            fillUserStore: function (users) {
                if (!_.isEmpty(users)) {
                    var userStore = this.getCommonStoreUsersStore();
                    if (userStore) {
                        userStore.add(users);
                    }
                }
            },
            onCollaborativeChanges: function () {
                if (this._state.hasCollaborativeChanges) {
                    return;
                }
                this._state.hasCollaborativeChanges = true;
                if (this.appOptions.isEdit) {
                    this.getApplication().getController("Statusbar").setStatusCaption(this.txtNeedSynchronize);
                }
            },
            synchronizeChanges: function () {
                this.getApplication().getController("Statusbar").setStatusCaption("");
                this.getApplication().getController("DocumentHolder").getView("DocumentHolder").hideTips();
                this.getApplication().getController("Toolbar").getView("Toolbar").synchronizeChanges();
                this._state.hasCollaborativeChanges = false;
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
                        model: DE.Models.ShapeModel
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
                        model: DE.Models.ShapeModel
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
                    me.getApplication().getController("DocumentHolder").getView("DocumentHolder").updateThemeColors();
                },
                50);
                setTimeout(function () {
                    me.getApplication().getController("Toolbar").updateThemeColors();
                },
                50);
            },
            onSendThemeColors: function (colors, standart_colors) {
                Common.Utils.ThemeColor.setColors(colors, standart_colors);
                if (window.styles_loaded) {
                    this.updateThemeColors();
                }
            },
            loadLanguages: function () {
                var langs = this.api.asc_getSpellCheckLanguages();
                this.getApplication().getController("DocumentHolder").getView("DocumentHolder").setLanguages(langs);
                this.getApplication().getController("Statusbar").setLanguages(langs);
            },
            onInsertTable: function () {
                this.getApplication().getController("RightMenu").onInsertTable();
            },
            onInsertImage: function () {
                this.getApplication().getController("RightMenu").onInsertImage();
            },
            onInsertChart: function () {
                this.getApplication().getController("RightMenu").onInsertChart();
            },
            onInsertShape: function () {
                this.getApplication().getController("RightMenu").onInsertShape();
            },
            unitsChanged: function (m) {
                var value = window.localStorage.getItem("de-settings-unit");
                Common.Utils.Metric.setCurrentMetric((value !== null) ? parseInt(value) : Common.Utils.Metric.c_MetricUnits.cm);
                this.getApplication().getController("RightMenu").updateMetricUnit();
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
            errorProcessSaveResult: "Saving is failed.",
            textCloseTip: "\nClick to close the tip.",
            textShape: "Shape",
            errorStockChart: "Incorrect row order. To build a stock chart place the data on the sheet in the following order:<br> opening price, max price, min price, closing price.",
            errorDataRange: "Incorrect data range.",
            errorDatabaseConnection: "External error.<br>Database connection error. Please, contact support.",
            titleUpdateVersion: "Version changed",
            errorUpdateVersion: "The file version has been changed. The page will be reloaded.",
            errorUserDrop: "The file cannot be accessed right now."
        };
    })(), DE.Controllers.Main || {}));
});