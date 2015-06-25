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
 Ext.define("DE.controller.Main", {
    extend: "Ext.app.Controller",
    editMode: false,
    requires: ["Ext.Anim", "Ext.LoadMask", "Ext.MessageBox"],
    launch: function () {
        if (!this._isSupport()) {
            Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
            return;
        }
        this.initControl();
        Common.component.Analytics.initialize("UA-12442749-13", "Document Editor Mobile");
        var api = this.api,
        app = this.getApplication();
        api = new asc_docs_api("id-sdkeditor");
        api.SetMobileVersion(true);
        api.CreateComponents();
        api.SetFontsPath("../../../sdk/Fonts/");
        api.Init();
        api.initEvents2MobileAdvances();
        api.asc_registerCallback("asc_onStartAction", Ext.bind(this.onLongActionBegin, this));
        api.asc_registerCallback("asc_onError", Ext.bind(this.onError, this));
        api.asc_registerCallback("asc_onEndAction", Ext.bind(this.onLongActionEnd, this));
        api.asc_registerCallback("asc_onDocumentContentReady", Ext.bind(this.onDocumentContentReady, this));
        api.asc_registerCallback("asc_onOpenDocumentProgress2", Ext.bind(this.onOpenDocument, this));
        api.asc_registerCallback("asc_onSaveUrl", Ext.bind(this.onSaveUrl, this));
        api.asc_registerCallback("asc_onGetEditorPermissions", Ext.bind(this.onEditorPermissions, this));
        Ext.each(app.getControllers(), function (controllerName) {
            var controller = this.getApplication().getController(controllerName);
            controller && Ext.isFunction(controller.setApi) && controller.setApi(api);
        },
        this);
        this.initApi();
        this.editorConfig = {};
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
        Common.Gateway.on("opendocument", Ext.bind(this.loadDocument, this));
        Common.Gateway.on("showmessage", Ext.bind(this.onExternalMessage, this));
        Common.Gateway.on("resetfocus", Ext.bind(this.onResetFocus, this));
        Common.Gateway.on("processsaveresult", Ext.bind(this.onProcessSaveResult, this));
        Common.Gateway.on("processrightschange", Ext.bind(this.onProcessRightsChange, this));
        Common.Gateway.ready();
    },
    initControl: function () {},
    initApi: function () {},
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
    },
    loadDocument: function (data) {
        if (data.doc) {
            this.permissions = data.doc.permissions;
            var docInfo = new CDocInfo();
            docInfo.put_Id(data.doc.key);
            docInfo.put_Url(data.doc.url);
            docInfo.put_Title(data.doc.title);
            docInfo.put_Format(data.doc.fileType);
            docInfo.put_VKey(data.doc.vkey);
            docInfo.put_Options(data.doc.options);
            docInfo.put_UserId(this.editorConfig.user.id);
            docInfo.put_UserName(this.editorConfig.user.name);
            this.api.asc_setDocInfo(docInfo);
            this.api.asc_getEditorPermissions();
            Common.component.Analytics.trackEvent("Load", "Start");
        }
    },
    onEditorPermissions: function (params) {
        this.permissions.edit !== false && (this.permissions.edit = params.asc_getCanEdit());
        this.permissions.reader !== false && (this.permissions.reader = params.asc_getCanReaderMode());
        var profile = this.getApplication().getCurrentProfile(),
        deviceController = this.getApplication().getController("Main", profile ? profile.getNamespace() : null),
        editMode = (this.permissions.edit === true && this.editorConfig.mode !== "view"),
        readerMode = this.permissions.reader === true;
        if (deviceController) {
            if (Ext.os.is.Phone) {
                if (readerMode) {
                    this.api.SetReaderModeOnly();
                    editMode = false;
                }
            }
            if (Ext.isFunction(deviceController.setMode)) {
                deviceController.setMode(editMode ? "edit" : "view");
            }
            if (Ext.isFunction(deviceController.setReadableMode)) {
                deviceController.setReadableMode(readerMode);
            }
        }
        this.api.SetViewMode(!editMode);
        this.api.LoadDocument();
        this.api.Resize();
    },
    goBack: function () {
        Common.Gateway.goBack();
    },
    onDocumentContentReady: function () {
        if (this.api) {
            this.api.Resize();
            this.api.zoomFitToWidth();
        }
        this._hideLoadSplash();
        Common.component.Analytics.trackEvent("Load", "Complete");
    },
    onOpenDocument: function (progress) {
        var elem = document.getElementById("loadmask-text");
        if (elem) {
            elem.innerHTML = this.loadingDocText + ": " + Math.round(progress) + "%";
        }
    },
    onSaveUrl: function (url) {
        Common.Gateway.save(url);
    },
    onLongActionBegin: function (type, id) {
        var text = "";
        switch (id) {
        case c_oAscAsyncAction["Save"]:
            text = this.saveText;
            break;
        case c_oAscAsyncAction["Print"]:
            text = this.printText;
        }
        if (type == c_oAscAsyncActionType["BlockInteraction"]) {
            Ext.Viewport.setMasked({
                xtype: "loadmask",
                message: text
            });
        }
    },
    onLongActionEnd: function (type) {
        Ext.Viewport.unmask();
    },
    onError: function (id, level, errData) {
        this._hideLoadSplash();
        var config = {
            closable: false
        };
        switch (id) {
        case c_oAscError.ID.Unknown:
            config.message = this.unknownErrorText;
            break;
        case c_oAscError.ID.ConvertationTimeout:
            config.message = this.convertationTimeoutText;
            break;
        case c_oAscError.ID.ConvertationError:
            config.message = this.convertationErrorText;
            break;
        case c_oAscError.ID.DownloadError:
            config.message = this.downloadErrorText;
            break;
        case c_oAscError.ID.UplImageSize:
            config.message = this.uploadImageSizeMessage;
            break;
        case c_oAscError.ID.UplImageExt:
            config.message = this.uploadImageExtMessage;
            break;
        case c_oAscError.ID.UplImageFileCount:
            config.message = this.uploadImageFileCountMessage;
            break;
        case c_oAscError.ID.SplitCellMaxRows:
            config.message = this.splitMaxRowsErrorText.replace("%1", errData.get_Value());
            break;
        case c_oAscError.ID.SplitCellMaxCols:
            config.message = this.splitMaxColsErrorText.replace("%1", errData.get_Value());
            break;
        case c_oAscError.ID.SplitCellRowsDivider:
            config.message = this.splitDividerErrorText.replace("%1", errData.get_Value());
            break;
        case c_oAscError.ID.VKeyEncrypt:
            config.message = this.errorKeyEncrypt;
            break;
        case c_oAscError.ID.KeyExpire:
            config.message = this.errorKeyExpire;
            break;
        case c_oAscError.ID.UserCountExceed:
            config.message = this.errorUsersExceed;
            break;
        case c_oAscError.ID.CoAuthoringDisconnect:
            config.message = this.errorCoAuthoringDisconnect;
            break;
        case c_oAscError.ID.MobileUnexpectedCharCount:
            config.message = this.errorDocTooBig;
            config.out = true;
            break;
        default:
            config.message = this.errorDefaultMessage.replace("%1", id);
            break;
        }
        if (level == c_oAscError.Level.Critical) {
            Common.Gateway.reportError(id, config.message);
            config.title = this.criticalErrorTitle;
            config.message += "<br/>" + this.criticalErrorExtText;
            config.buttons = Ext.Msg.OK;
            config.fn = function (btn) {
                if (btn == "ok") {
                    if (config.out === true) {
                        Common.Gateway.goBack();
                    } else {
                        window.location.reload();
                    }
                }
            };
        } else {
            config.title = this.notcriticalErrorTitle;
            config.buttons = Ext.Msg.OK;
            config.fn = Ext.emptyFn;
        }
        Ext.Msg.show(config);
        Common.component.Analytics.trackEvent("Internal Error", id.toString());
    },
    onExternalMessage: function (msg) {
        if (msg) {
            this._hideLoadSplash();
            Ext.Msg.show({
                title: msg.title,
                msg: "<br/>" + msg.msg,
                icon: Ext.Msg[msg.severity.toUpperCase()],
                buttons: Ext.Msg.OK
            });
            Common.component.Analytics.trackEvent("External Error", msg.title);
        }
    },
    onResetFocus: function (data) {
        var activeElement = document.activeElement;
        activeElement.focus();
    },
    onProcessSaveResult: function (data) {
        this.api && this.api.asc_OnSaveEnd(data.result);
    },
    onProcessRightsChange: function (data) {
        if (this.api && data && data.enabled === false) {
            this.api.asc_coAuthoringDisconnect();
        }
    },
    _hideLoadSplash: function () {
        var preloader = Ext.get("loading-mask");
        if (preloader) {
            Ext.Anim.run(preloader, "fade", {
                out: true,
                duration: 250,
                after: function () {
                    preloader.destroy();
                }
            });
        }
    },
    _isSupport: function () {
        return (Ext.browser.is.WebKit && (Ext.os.is.iOS || Ext.os.is.Android || Ext.os.is.Desktop));
    },
    loadingDocText: "LOADING DOCUMENT",
    saveText: "Saving...",
    printText: "Printing...",
    criticalErrorTitle: "Error",
    notcriticalErrorTitle: "Warning",
    errorDefaultMessage: "Error code: %1",
    criticalErrorExtText: 'Press "Ok" to reload view page.',
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
    errorKeyEncrypt: "Unknown key descriptor",
    errorKeyExpire: "Key descriptor expired",
    errorUsersExceed: "Count of users was exceed",
    errorCoAuthoringDisconnect: "Server connection lost. You can't edit anymore.",
    errorDocTooBig: "The document you are trying to open has more than 30000 characters or 1000 paragraphs in it and cannot by opened on your mobile device. Please try open it using a desktop PC.",
    textAnonymous: "Anonymous"
});