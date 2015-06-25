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
 Ext.define("SSE.controller.Main", {
    extend: "Ext.app.Controller",
    editMode: false,
    requires: ["Ext.Anim", "Ext.MessageBox", "SSE.controller.ApiEvents", "SSE.view.OpenCsvPanel"],
    config: {
        refs: {
            mainView: "semainview"
        }
    },
    launch: function () {
        if (!this._isSupport()) {
            Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
            return;
        }
        this.initControl();
        Common.component.Analytics.initialize("UA-12442749-13", "Spreadsheet Mobile");
        var app = this.getApplication();
        this.api = new Asc.spreadsheet_api("id-sdkeditor", "", SSE.controller.ApiEvents, {},
        {});
        this.api.asc_Init("../../../sdk/Fonts/");
        this.api.asc_setMobileVersion(true);
        this.api.asc_registerCallback("asc_onAdvancedOptions", Ext.bind(this.onAdvancedOptions, this));
        this.api.asc_registerCallback("asc_onOpenDocumentProgress", Ext.bind(this.onOpenDocumentProgress, this));
        this.api.asc_registerCallback("asc_onEndAction", Ext.bind(this.onLongActionEnd, this));
        this.api.asc_registerCallback("asc_onError", Ext.bind(this.onError, this));
        this.api.asc_registerCallback("asc_onSaveUrl", Ext.bind(this.onSaveUrl, this));
        this.api.asc_registerCallback("asc_onGetEditorPermissions", Ext.bind(this.onEditorPermissions, this));
        Ext.each(app.getControllers(), function (controllerName) {
            var controller = app.getController(controllerName);
            controller && Ext.isFunction(controller.setApi) && controller.setApi(this.api);
        },
        this);
        this.initApi();
        this.editorConfig = {};
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
        Common.Gateway.on("opendocument", Ext.bind(this.loadDocument, this));
        Common.Gateway.on("showmessage", Ext.bind(this.onExternalMessage, this));
        Common.Gateway.on("processsaveresult", Ext.bind(this.onProcessSaveResult, this));
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
            var docInfo = {
                Id: data.doc.key,
                Url: data.doc.url,
                Title: data.doc.title,
                Format: data.doc.fileType,
                Options: data.doc.options,
                VKey: data.doc.vkey,
                Origin: data.doc.origin,
                UserId: this.editorConfig.user.id,
                UserName: this.editorConfig.user.name
            };
            this.api.asc_setDocInfo(docInfo);
            this.api.asc_getEditorPermissions();
            Common.component.Analytics.trackEvent("Load", "Start");
        }
    },
    onEditorPermissions: function (params) {
        this.permissions.edit !== false && (this.permissions.edit = params.asc_getCanEdit());
        var modeEdit = false;
        this.api.asc_setViewerMode(!modeEdit);
        this.api.asc_LoadDocument();
        var profileName = this.getApplication().getCurrentProfile().getName();
        this.getApplication().getController(profileName + ".Main").setMode(modeEdit);
    },
    goBack: function () {
        Common.Gateway.goBack();
    },
    onError: function (id, level) {
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
        case c_oAscError.ID.VKeyEncrypt:
            config.msg = this.errorKeyEncrypt;
            break;
        case c_oAscError.ID.KeyExpire:
            config.msg = this.errorKeyExpire;
            break;
        case c_oAscError.ID.UserCountExceed:
            config.msg = this.errorUsersExceed;
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
                    window.location.reload();
                }
            };
        } else {
            config.title = this.notcriticalErrorTitle;
            config.buttons = Ext.Msg.OK;
            config.fn = Ext.emptyFn;
        }
        Ext.Msg.show(config);
    },
    onSaveUrl: function (url) {
        Common.Gateway.save(url);
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
    onAdvancedOptions: function (advOptions) {
        if (advOptions.asc_getOptionId() == c_oAscAdvancedOptionsID["CSV"]) {
            var preloader = Ext.get("loading-mask"),
            me = this;
            Ext.Anim.run(preloader, "slide", {
                out: true,
                direction: "up",
                duration: 250,
                after: function () {
                    preloader.hide();
                }
            });
            var viewAdvOptionsCsv = Ext.Viewport.add({
                xtype: "seopencsvpanel",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            });
            Ext.Anim.run(viewAdvOptionsCsv, "slide", {
                out: false,
                direction: "up",
                duration: 1000
            });
            viewAdvOptionsCsv.on("close", Ext.bind(function (panel, result) {
                preloader.show();
                Ext.Anim.run(preloader, "slide", {
                    out: false,
                    direction: "down",
                    duration: 1000
                });
                Ext.Anim.run(viewAdvOptionsCsv, "slide", {
                    out: true,
                    direction: "down",
                    duration: 1000,
                    after: function () {
                        Ext.Viewport.remove(viewAdvOptionsCsv);
                        if (me.api) {
                            me.api.asc_setAdvancedOptions(c_oAscAdvancedOptionsID["CSV"], new Asc.asc_CCSVAdvancedOptions(result.encoding, result.delimiter));
                        }
                    }
                });
            },
            this));
        }
    },
    onOpenDocumentProgress: function (progress) {
        var elem = document.getElementById("loadmask-text");
        if (elem) {
            var proc = (progress["CurrentFont"] + progress["CurrentImage"]) / (progress["FontsCount"] + progress["ImagesCount"]);
            elem.innerHTML = this.textLoadingDocument + ": " + Math.round(proc * 100) + "%";
        }
    },
    onOpenDocument: function () {
        this._hideLoadSplash();
        this.api.asc_Resize();
        if (this.api) {
            this.api.asc_cleanSelection();
        }
    },
    onLongActionEnd: function (type, id) {
        if (type === c_oAscAsyncActionType["BlockInteraction"]) {
            switch (id) {
            case c_oAscAsyncAction["Open"]:
                this.onOpenDocument();
                break;
            }
        }
    },
    _hideLoadSplash: function () {
        var preloader = Ext.get("loading-mask");
        if (preloader) {
            Ext.Anim.run(preloader, "fade", {
                out: true,
                duration: 1000,
                after: function () {
                    preloader.destroy();
                }
            });
        }
    },
    _isSupport: function () {
        return (Ext.browser.is.WebKit && (Ext.os.is.iOS || Ext.os.is.Android || Ext.os.is.Desktop));
    },
    printText: "Printing...",
    criticalErrorTitle: "Error",
    notcriticalErrorTitle: "Warning",
    errorDefaultMessage: "Error code: %1",
    criticalErrorExtText: 'Press "Ok" to reload view page.',
    uploadImageSizeMessage: "Maximium image size limit exceeded.",
    uploadImageExtMessage: "Unknown image format.",
    uploadImageFileCountMessage: "No images uploaded.",
    unknownErrorText: "Unknown error.",
    convertationTimeoutText: "Convertation timeout exceeded.",
    convertationErrorText: "Convertation failed.",
    downloadErrorText: "Download failed.",
    unsupportedBrowserErrorText: "Your browser is not supported.",
    errorKeyEncrypt: "Unknown key descriptor",
    errorKeyExpire: "Key descriptor expired",
    errorUsersExceed: "Count of users was exceed",
    textAnonymous: "Anonymous",
    textLoadingDocument: "LOADING DOCUMENT"
});