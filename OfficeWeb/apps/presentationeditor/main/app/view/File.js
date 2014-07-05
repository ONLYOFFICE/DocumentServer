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
 Ext.define("PE.view.File", {
    extend: "Ext.panel.Panel",
    alias: "widget.pefile",
    cls: "pe-file-body",
    layout: "card",
    toolbarWidth: 260,
    activeBtn: undefined,
    requires: ["Ext.toolbar.Toolbar", "Ext.button.Button", "Ext.container.Container"],
    uses: ["PE.view.DocumentInfo", "PE.view.DocumentHelp", "PE.view.DocumentSettings", "Common.view.About"],
    listeners: {
        afterrender: function (Component, eOpts) {
            var cnt = this.ownerCt;
            if (Ext.isDefined(cnt)) {
                cnt.addListener("show", Ext.Function.bind(this._onShow, this));
            }
        }
    },
    initComponent: function () {
        this.addEvents("editdocument");
        this.callParent(arguments);
    },
    loadConfig: function (data) {
        this.editorConfig = data.config;
    },
    loadDocument: function (data) {
        this.document = data.doc;
    },
    _onShow: function () {
        if (this.activeBtn === undefined) {
            var btn = this[this.btnDomnloadAs.isVisible() ? "btnDomnloadAs" : "btnDocumentInfo"];
            this.activeBtn = btn.toggle(true);
        } else {
            this.redrawButton(this.activeBtn);
        }
        if (this.activeBtn == this.btnDocumentInfo) {
            this.getLayout().setActiveItem(this.cardDocumentInfo);
        } else {
            if (this.activeBtn == this.btnDocumentSettings) {
                this.getLayout().setActiveItem(this.cardDocumentSettings);
                this.cardDocumentSettings.updateSettings();
            }
        }
    },
    buildItems: function () {
        var docInfo = [{
            name: "PDF",
            imgCls: "doc-format btn-pdf",
            type: c_oAscFileType.PDF
        },
        {
            name: "PPTX",
            imgCls: "doc-format btn-pptx",
            type: c_oAscFileType.PPTX
        }];
        this.cardDownloadAs = Ext.widget("container", {
            cls: "pe-file-table",
            layout: {
                type: "table",
                columns: 4
            }
        });
        var me = this;
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
                    margin: "65px 25px 0 25px",
                    listeners: {
                        click: Ext.bind(function (btn) {
                            var api = me.ownerCt.getApi();
                            if (api) {
                                api.asc_DownloadAs(btn.docType);
                                me.closeMenu();
                            }
                            Common.component.Analytics.trackEvent("Download As", item.name);
                        },
                        this)
                    }
                }]
            });
        },
        this);
        this.cardDocumentInfo = Ext.widget("pedocumentinfo");
        this.cardCreateNew = Ext.widget("pecreatenew");
        this.cardRecentFiles = Ext.widget("perecentfiles");
        this.cardHelp = Ext.widget("pedocumenthelp");
        this.cardDocumentSettings = Ext.widget("pedocumentsettings");
        this.cardDocumentSettings.addListener("savedocsettings", Ext.bind(this.closeMenu, this));
        return [this.cardDownloadAs, this.cardDocumentInfo, this.cardCreateNew, this.cardRecentFiles, this.cardHelp, this.cardDocumentSettings];
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
        this.btnDomnloadAs = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnDownloadCaption, this.cardDownloadAs), {
            id: "file-button-download"
        }));
        this.btnDocumentInfo = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnInfoCaption, this.cardDocumentInfo), {
            id: "file-button-info"
        }));
        this.btnDocumentSettings = Ext.create("Ext.button.Button", Ext.applyIf(this.getFileMenuButton(this.btnSettingsCaption, this.cardDocumentSettings), {
            id: "file-button-settings"
        }));
        this.btnBack = this.btnSave.cloneConfig({
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
        this.btnCreateNew = Ext.create("Ext.button.Button", {
            id: "file-button-createnew",
            text: this.btnCreateNewCaption,
            textAlign: "left",
            enableToggle: true,
            cls: "asc-filemenu-btn",
            padding: "0 27px",
            height: 27
        });
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
            cls: "pe-file-toolbar",
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
            this.btnReturn, this.getSeparator(), this.btnSave, this.btnToEdit, this.btnDomnloadAs, this.btnPrint, this.getSeparator(), this.btnOpenRecent, this.btnCreateNew, this.getSeparator(), this.btnDocumentInfo, this.getSeparator(), this.btnDocumentSettings, this.getSeparator(), this.btnHelp, this.getSeparator(), this.btnBack]
        });
        return this.tbFileMenu;
    },
    setApi: function (api) {
        this.api = api;
    },
    getSeparator: function () {
        return {
            xtype: "container",
            html: '<hr class="pe-file-separator" />'
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
                click: Ext.Function.bind(function (btnCall) {
                    if (btnCall.pressed) {
                        if (this.activeBtn != btnCall) {
                            this.getLayout().setActiveItem(card);
                            this.activeBtn = btnCall;
                        }
                        Common.component.Analytics.trackEvent("File Menu", btnCall.label);
                    }
                },
                this),
                toggle: Ext.Function.bind(function (btnCall) {
                    this.redrawButton(btnCall);
                },
                this)
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
    applyMode: function () {
        this.cardDocumentInfo.updateInfo(this.document);
        this.btnBack.setVisible(this.mode.canBack);
        this.tbFileMenu.items.items[16].setVisible(this.mode.canBack);
        this.btnOpenRecent.setVisible(this.mode.canOpenRecent);
        this.btnCreateNew.setVisible(this.mode.canCreateNew);
        this.tbFileMenu.items.items[10].setVisible(this.mode.canCreateNew);
        this.btnDomnloadAs.setVisible(this.mode.canDownload);
        this.hkSaveAs[this.mode.canDownload ? "enable" : "disable"]();
        this.btnSave.setVisible(this.mode.isEdit);
        this.btnToEdit.setVisible(this.mode.canEdit && this.mode.isEdit === false);
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
        this.hkSaveAs = new Ext.util.KeyMap(document, {
            key: "s",
            ctrl: true,
            shift: true,
            defaultEventAction: "stopEvent",
            scope: this,
            fn: function () {
                if (this.ownerCt && this.ownerCt.isVisible()) {
                    this.btnDomnloadAs.toggle(true);
                    this.btnDomnloadAs.fireEvent("click", this.btnDomnloadAs);
                }
            }
        });
        this.hkHelp = new Ext.util.KeyMap(document, {
            key: Ext.EventObject.F1,
            ctrl: false,
            shift: false,
            defaultEventAction: "stopEvent",
            scope: this,
            fn: function () {
                if (this.ownerCt && this.ownerCt.isVisible()) {
                    this.btnHelp.toggle(true);
                    this.btnHelp.fireEvent("click", this.btnHelp);
                }
            }
        });
        this.add(this.buildItems.call(this));
        this.addDocked(this.buildDockedItems());
        this.setConfig();
        this.applyMode();
    },
    setConfig: function () {
        var me = this;
        if (this.editorConfig.templates && this.editorConfig.templates.length > 0) {
            this.btnCreateNew.setText(this.btnCreateNew.getText() + "...");
            this.btnCreateNew.enableToggle = true;
            this.btnCreateNew.on("click", function (btnCall) {
                if (btnCall.pressed) {
                    if (me.activeBtn != btnCall) {
                        me.getLayout().setActiveItem(me.cardCreateNew);
                        me.activeBtn = btnCall;
                    }
                    Common.component.Analytics.trackEvent("File Menu", "Create");
                }
            });
            this.btnCreateNew.on("toggle", function (btnCall) {
                me.redrawButton(btnCall);
            });
        } else {
            this.btnCreateNew.on("click", function (btnCall) {
                if (Ext.isEmpty(me.editorConfig.createUrl)) {
                    Ext.MessageBox.show({
                        title: me.textError,
                        msg: me.textCanNotCreateNewDoc,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR,
                        width: 300
                    });
                } else {
                    if (btnCall.pressed) {
                        var newDocumentPage = window.open(Ext.String.format("{0}?title={1}&action=create&doctype=presentation", me.editorConfig.createUrl, me.newDocumentTitle));
                        if (newDocumentPage) {
                            newDocumentPage.focus();
                        }
                        Common.component.Analytics.trackEvent("Create New", "Blank");
                    }
                }
                this.closeMenu();
            });
        }
        this.cardHelp.setLangConfig(this.editorConfig.lang);
    },
    btnSaveCaption: "Save",
    btnDownloadCaption: "Download as...",
    btnInfoCaption: "Document Info...",
    btnCreateNewCaption: "Create New",
    btnRecentFilesCaption: "Open Recent...",
    btnPrintCaption: "Print",
    btnHelpCaption: "Help...",
    btnReturnCaption: "Back to Document",
    btnToEditCaption: "Edit Document",
    btnBackCaption: "Go to Documents",
    newDocumentTitle: "Unnamed presentation",
    textError: "Error",
    textCanNotCreateNewDoc: "Can not create a new presentation. Address to create a document is not configured.",
    btnSettingsCaption: "Advanced Settings...",
    btnAboutCaption: "About"
});