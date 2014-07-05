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
 Ext.define("SSE.view.File", {
    extend: "Ext.panel.Panel",
    alias: "widget.ssefile",
    cls: "sse-file-body",
    layout: "card",
    btnSaveCaption: "Save",
    btnDownloadCaption: "Download as...",
    btnInfoCaption: "Document Info...",
    btnCreateNewCaption: "Create New...",
    btnRecentFilesCaption: "Open Recent...",
    btnPrintCaption: "Print",
    btnHelpCaption: "Help...",
    btnReturnCaption: "Back to Document",
    btnToEditCaption: "Edit Document",
    btnBackCaption: "Go to Documents",
    btnSettingsCaption: "Advanced Settings...",
    toolbarWidth: 260,
    activeBtn: undefined,
    uses: ["Ext.container.Container", "Ext.toolbar.Toolbar", "Ext.button.Button", "SSE.view.DocumentInfo", "SSE.view.RecentFiles", "SSE.view.CreateFile", "SSE.view.DocumentHelp", "SSE.view.DocumentSettings"],
    listeners: {
        afterrender: function (Component, eOpts) {
            var cnt = this.ownerCt;
            if (Ext.isDefined(cnt)) {
                cnt.addListener("show", Ext.Function.bind(this._onShow, this));
            }
        }
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        this.addEvents("editdocument", "downloadas");
        this.callParent(arguments);
    },
    loadConfig: function (data) {
        this.editorConfig = data.config;
    },
    _onShow: function () {
        if (this.activeBtn === undefined) {
            this.activeBtn = this.btnDownloadAs.isVisible() ? this.btnCreateNew : this.btnDocumentInfo;
        }
        if (this.activeBtn == this.btnDocumentInfo) {
            this.getLayout().setActiveItem(this.cardDocumentInfo);
        } else {
            if (this.activeBtn == this.btnDocumentSettings) {
                this.getLayout().setActiveItem(this.cardDocumentSettings);
                this.cardDocumentSettings.updateSettings();
            } else {
                if (this.activeBtn == this.btnCreateNew) {
                    if (this.btnDownloadAs.isVisible()) {
                        this.getLayout().setActiveItem(this.cardDownloadAs);
                        this.activeBtn = this.btnDownloadAs;
                    } else {
                        this.getLayout().setActiveItem(this.cardDocumentInfo);
                        this.activeBtn = this.btnDocumentInfo;
                    }
                }
            }
        }
        this.redrawButton(this.activeBtn);
    },
    buildDockedItems: function () {
        this.btnSave = Ext.create("Ext.button.Button", {
            id: "file-button-save",
            text: this.btnSaveCaption,
            textAlign: "left",
            enableToggle: true,
            cls: "asc-filemenu-btn",
            padding: "0 27px",
            height: 27,
            listeners: {
                click: Ext.bind(function (btnCall) {
                    if (btnCall.pressed) {
                        this.api = this.ownerCt.getApi();
                        if (this.api) {
                            this.redrawButton(btnCall);
                            this.api.asc_Save();
                            this.closeMenu();
                        }
                        Common.component.Analytics.trackEvent("Save");
                        Common.component.Analytics.trackEvent("File Menu", "Save");
                    }
                },
                this)
            }
        });
        this.btnPrint = this.btnSave.cloneConfig({
            id: "file-button-print",
            text: this.btnPrintCaption,
            listeners: {
                click: Ext.bind(function (btnCall) {
                    if (btnCall.pressed) {
                        this.api = this.ownerCt.getApi();
                        if (this.api) {
                            this.api.asc_Print();
                            this.closeMenu();
                        }
                        Common.component.Analytics.trackEvent("Print");
                        Common.component.Analytics.trackEvent("File Menu", "Print");
                    }
                },
                this)
            }
        });
        this.btnToEdit = this.btnSave.cloneConfig({
            id: "file-button-edit",
            text: this.btnToEditCaption,
            listeners: {
                click: Ext.bind(function (btnCall) {
                    this.redrawButton(btnCall);
                    if (btnCall.pressed) {
                        this.closeMenu();
                        this.fireEvent("editdocument");
                        Common.component.Analytics.trackEvent("Edit");
                        Common.component.Analytics.trackEvent("File Menu", "Edit");
                    }
                },
                this)
            }
        });
        this.btnDownloadAs = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnDownloadCaption, this.cardDownloadAs), {
            id: "file-button-download"
        }));
        this.btnDocumentInfo = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnInfoCaption, this.cardDocumentInfo), {
            id: "file-button-info"
        }));
        this.btnDocumentSettings = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnSettingsCaption, this.cardDocumentSettings), {
            id: "file-button-settings"
        }));
        this.btnBack = this.btnPrint.cloneConfig({
            id: "file-button-back",
            text: this.btnBackCaption,
            listeners: {
                click: Ext.bind(function (btnCall) {
                    this.redrawButton(btnCall);
                    if (btnCall.pressed) {
                        Common.Gateway.goBack();
                        this.closeMenu();
                    }
                },
                this)
            }
        });
        this.btnHelp = Ext.create("Ext.button.Button", this.getFileMenuButton(this.btnHelpCaption, this.cardHelp));
        this.btnReturn = Ext.create("Ext.button.Button", {
            id: "file-button-return",
            text: this.btnReturnCaption,
            textAlign: "left",
            enableToggle: true,
            cls: "asc-filemenu-btn",
            padding: "0 27px",
            height: 27,
            listeners: {
                click: Ext.bind(function (btnCall) {
                    if (btnCall.pressed) {
                        this.closeMenu();
                        Common.component.Analytics.trackEvent("File Menu", "Return");
                    }
                },
                this)
            }
        });
        this.btnCreateNew = Ext.create("Ext.button.Button", Ext.apply(this.getFileMenuButton(this.btnCreateNewCaption, this.cardCreateNew), {
            id: "file-button-createnew",
            label: "Create",
            listeners: {},
            enableToggle: false
        }));
        this.btnOpenRecent = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnRecentFilesCaption, this.cardRecentFiles), {
            id: "file-button-recentfiles",
            label: "Recent"
        }));
        this.tbFileMenu = Ext.create("Ext.toolbar.Toolbar", {
            dock: "left",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            cls: "sse-file-toolbar",
            vertical: true,
            width: this.toolbarWidth,
            defaults: {
                height: 22,
                width: "100%"
            },
            items: [{
                xtype: "container",
                height: 15
            },
            this.btnReturn, this.getSeparator(), this.btnSave, this.btnToEdit, this.btnDownloadAs, this.btnPrint, this.getSeparator(), this.btnOpenRecent, this.btnCreateNew, this.getSeparator(), this.btnDocumentInfo, this.getSeparator(), this.btnDocumentSettings, this.getSeparator(), this.btnHelp, this.getSeparator(), this.btnBack]
        });
        return this.tbFileMenu;
    },
    setApi: function (api) {
        this.api = api;
    },
    getSeparator: function () {
        return {
            xtype: "container",
            html: '<hr class="sse-file-separator" />'
        };
    },
    getFileMenuButton: function (caption, card) {
        return {
            text: caption,
            textAlign: "left",
            enableToggle: true,
            cls: "asc-filemenu-btn",
            padding: "0 27px",
            height: 27,
            listeners: {
                click: Ext.Function.bind(this._itemClick, this, [card], true),
                toggle: Ext.Function.bind(this._itemTogglge, this)
            }
        };
    },
    redrawButton: function (btnCall) {
        var tb = this.tbFileMenu;
        for (var i = 0; i < tb.items.length; i++) {
            var btn = tb.items.items[i];
            if (btn.componentCls === "x-btn") {
                if (btn.id != btnCall.id && btn.pressed) {
                    btn.toggle(false, true);
                }
            }
        }
        btnCall.toggle(true, true);
    },
    closeMenu: function () {
        this.ownerCt.closeMenu();
    },
    _itemClick: function (btnCall, event, opt, card) {
        if (btnCall.pressed) {
            if (this.activeBtn != btnCall) {
                this.getLayout().setActiveItem(card);
                this.activeBtn = btnCall;
            }
            Common.component.Analytics.trackEvent("File Menu", btnCall.label);
        }
    },
    _itemTogglge: function (btnCall) {
        this.redrawButton(btnCall);
    },
    applyMode: function () {
        this.btnDownloadAs.setVisible(this.mode.canDownload);
        this.hkSaveAs[this.mode.canDownload ? "enable" : "disable"]();
        this.hkSave[this.mode.isEdit ? "enable" : "disable"]();
        this.hkHelp.enable();
        this.btnSave.setVisible(this.mode.isEdit);
        this.btnToEdit.setVisible(this.mode.canEdit && this.mode.isEdit === false);
        this.btnDocumentSettings.setVisible(this.mode.isEdit);
        this.tbFileMenu.items.items[14].setVisible(this.mode.isEdit);
        this.btnBack.setVisible(this.mode.canBack);
        this.tbFileMenu.items.items[16].setVisible(this.mode.canBack);
        this.btnOpenRecent.setVisible(this.mode.canOpenRecent);
        this.btnCreateNew.setVisible(this.mode.canCreateNew);
        this.tbFileMenu.items.items[10].setVisible(this.mode.canCreateNew || this.mode.canOpenRecent);
        this.cardDocumentSettings.setMode(this.mode);
    },
    setMode: function (mode, delay) {
        if (mode.isDisconnected) {
            this.mode.canEdit = this.mode.isEdit = false;
            this.mode.canOpenRecent = this.mode.canCreateNew = false;
        } else {
            this.mode = mode;
        }
        if (!delay) {
            this.applyMode();
        }
    },
    createDelayedElements: function () {
        var me = this;
        this.hkSaveAs = new Ext.util.KeyMap(document, [{
            key: "s",
            ctrl: true,
            shift: true,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (me.ownerCt && me.ownerCt.isVisible()) {
                    me.btnDownloadAs.toggle(true);
                    me.btnDownloadAs.fireEvent("click", me.btnDownloadAs);
                }
            }
        }]);
        this.hkSave = new Ext.util.KeyMap(document, [{
            key: "s",
            ctrl: true,
            shift: false,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (canHotKey()) {
                    var api = me.ownerCt.getApi();
                    if (api) {
                        api.asc_Save();
                    }
                }
            }
        }]);
        this.hkHelp = new Ext.util.KeyMap(document, {
            key: Ext.EventObject.F1,
            ctrl: false,
            shift: false,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (me.ownerCt && me.ownerCt.isVisible()) {
                    me.btnHelp.toggle(true);
                    me.btnHelp.fireEvent("click", me.btnHelp, [me.cardHelp]);
                }
            }
        });
        var docInfo = [{
            name: "XLSX",
            imgCls: "tabular-format btn-xlsx",
            type: c_oAscFileType.XLSX
        }];
        this.cardDownloadAs = Ext.widget("container", {
            cls: "sse-file-table",
            layout: {
                type: "table",
                columns: 2
            }
        });
        Ext.each(docInfo, function (item) {
            this.cardDownloadAs.add({
                xtype: "container",
                items: [{
                    xtype: "button",
                    id: "file-format-" + item.name,
                    cls: item.imgCls + " download-button-style",
                    docType: item.type,
                    width: 102,
                    height: 129,
                    margin: "65px 25px 0 25px"
                }]
            });
        },
        this);
        this.cardDocumentInfo = Ext.widget("ssedocumentinfo");
        this.cardCreateNew = Ext.widget("ssecreatenew");
        this.cardRecentFiles = Ext.widget("sserecentfiles");
        this.cardHelp = Ext.widget("ssedocumenthelp");
        this.cardDocumentSettings = Ext.widget("ssedocumentsettings");
        this.cardDocumentSettings.addListener("savedocsettings", Ext.bind(this.closeMenu, this));
        this.add([this.cardDownloadAs, this.cardHelp, this.cardDocumentInfo, this.cardRecentFiles, this.cardDocumentSettings]);
        this.addDocked(this.buildDockedItems());
        this.setConfig();
        this.applyMode();
    },
    setConfig: function () {
        this.cardHelp.setLangConfig(this.editorConfig.lang);
        if (this.editorConfig.templates && this.editorConfig.templates.length > 0) {
            this.btnCreateNew.enableToggle = true;
            this.btnCreateNew.on("click", Ext.bind(this._itemClick, this, [this.cardCreateNew], true));
            this.btnCreateNew.on("toggle", Ext.bind(this._itemTogglge, this));
        }
    }
});