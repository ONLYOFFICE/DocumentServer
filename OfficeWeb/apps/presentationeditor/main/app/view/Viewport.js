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
 Ext.define("PE.view.Viewport", {
    extend: "Ext.container.Viewport",
    alias: "widget.peviewport",
    layout: "fit",
    requires: ["Common.view.Header", "PE.view.DocumentHolder", "PE.view.MainMenu", "PE.view.File", "PE.view.DocumentStatusInfo", "PE.view.DocumentPreview", "Common.view.ChatPanel"],
    uses: ["PE.view.Toolbar", "PE.view.RightMenu", "PE.view.CreateFile", "PE.view.RecentFiles", "Common.view.CommentsPanel"],
    initComponent: function () {
        this.header = Ext.widget("commonheader", {
            config: {
                headerCaption: "Presentation Editor"
            }
        });
        this._documentHolder = Ext.widget("pedocumentholder", {
            id: "editor_sdk",
            flex: 1,
            maintainFlex: true,
            style: "background-color:#b0b0b0;"
        });
        this.applicationUI = Ext.widget("container", {
            id: "pe-applicationUI",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            flex: 1,
            hidden: true,
            hideMode: "offsets",
            items: [{
                xtype: "container",
                flex: 1,
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "pemainmenu",
                    id: "view-main-menu",
                    maxWidth: 600,
                    buttonCollection: [{
                        cls: "menuFile",
                        id: "id-menu-file",
                        tooltip: this.tipFile + " (Alt+F)",
                        scale: "full",
                        disabled: true,
                        toggleGroup: "tbMainMenu",
                        items: [{
                            xtype: "pefile",
                            id: "main-menu-file-options",
                            width: "100%",
                            height: "100%"
                        }]
                    },
                    {
                        cls: "menuSearch",
                        scale: "modal",
                        id: "main-menu-search",
                        disabled: true,
                        tooltip: this.tipSearch + " (Ctrl+F)"
                    },
                    {
                        cls: "menuSlides",
                        id: "main-menu-slides",
                        scale: "modal",
                        tooltip: this.tipSlides,
                        disabled: true,
                        listeners: {
                            click: Ext.Function.bind(function (btnCall) {
                                var mainmenu = Ext.getCmp("view-main-menu");
                                mainmenu.slidesBtnVisible = btnCall.pressed;
                                if (btnCall.pressed) {
                                    mainmenu.clearSelection(["menuSlides", "menuSearch"]);
                                }
                            }),
                            toggle: function (btn, pressed) {
                                var api = btn.getApi();
                                if (api) {
                                    api.ShowThumbnails(pressed);
                                }
                            }
                        }
                    },
                    {
                        cls: "menuComments",
                        id: "id-menu-comments",
                        hideMode: "display",
                        scale: 300,
                        tooltip: this.tipComments + " (Ctrl+Shift+H)",
                        toggleGroup: "tbMainMenu",
                        disabled: true,
                        items: [{
                            xtype: "commoncommentspanel",
                            noQuotes: true,
                            height: "100%"
                        }]
                    },
                    {
                        cls: "menuChat",
                        id: "id-menu-chat",
                        scale: 300,
                        tooltip: this.tipChat + " (Ctrl+Alt+Q)",
                        toggleGroup: "tbMainMenu",
                        disabled: true,
                        items: [{
                            xtype: "commonchatpanel",
                            height: "100%"
                        }]
                    },
                    {
                        cls: "menuAbout",
                        id: "id-menu-about",
                        tooltip: "About",
                        scale: "full",
                        toggleGroup: "tbMainMenu",
                        disabled: true,
                        items: [{
                            xtype: "commonabout",
                            id: "main-menu-about",
                            width: "100%",
                            height: "100%"
                        }]
                    }],
                    listeners: {
                        panelshow: Ext.bind(function (panel, fullScale) {
                            if (fullScale) {
                                var btn = Ext.getCmp("main-menu-search");
                                if (btn.pressed) {
                                    btn.toggle();
                                }
                            }
                            var mainmenu = Ext.getCmp("view-main-menu");
                            mainmenu.selectThumbnailsBtn(false);
                            if (!fullScale) {
                                this._documentHolder.changePosition();
                            }
                        },
                        this),
                        panelhide: Ext.bind(function (panel, fullScale) {
                            var mainmenu = Ext.getCmp("view-main-menu");
                            mainmenu.selectThumbnailsBtn(true);
                            if (!fullScale) {
                                this._documentHolder.changePosition();
                            }
                        },
                        this)
                    }
                },
                {
                    xtype: "splitter",
                    id: "main-menu-splitter",
                    cls: "splitter-document-area",
                    defaultSplitMin: 300,
                    hidden: true
                },
                {
                    xtype: "container",
                    flex: 1,
                    maintainFlex: true,
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [this._documentHolder]
                }]
            },
            this._documentStatus = Ext.widget("documentstatusinfo", {
                id: "view-status"
            })]
        });
        this.items = {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                id: "pe-preview",
                xtype: "pedocumentpreview"
            },
            this.header, this.applicationUI]
        };
        this.callParent(arguments);
    },
    checkCanHotKey: function () {
        var winElements = Ext.getDoc().query(".x-window");
        for (var i = 0; i < winElements.length; i++) {
            var cmp = Ext.getCmp(winElements[i].id);
            if (cmp && cmp.isVisible() && cmp.modal) {
                return false;
            }
        }
        return true;
    },
    applyMode: function () {
        this.hkSaveAs[this.mode.canDownload ? "enable" : "disable"]();
        this.hkCoAuth[this.mode.canCoAuthoring ? "enable" : "disable"]();
        this.hkComments[(this.mode.canCoAuthoring && this.mode.isEdit) ? "enable" : "disable"]();
    },
    setMode: function (mode, delay) {
        if (mode.isDisconnected) {
            if (this.mode === undefined) {
                this.mode = {};
            }
            this.mode.canCoAuthoring = false;
        } else {
            this.mode = mode;
        }
        if (!delay) {
            this.applyMode();
        }
    },
    setApi: function (o) {
        this.api = o;
        return this;
    },
    applyEditorMode: function () {
        var me = this;
        me._toolbar = Ext.widget("petoolbar", {
            id: "view-toolbar"
        });
        me.applicationUI.insert(0, me._toolbar);
        me._rightMenu = Ext.widget("perightmenu", {
            id: "view-right-menu"
        });
        me.applicationUI.items.items[1].add(me._rightMenu);
        var value = window.localStorage.getItem("pe-hidden-status");
        if (value !== null && parseInt(value) == 1) {
            this._documentStatus.setVisible(false);
        }
    },
    createDelayedElements: function () {
        var _self = this;
        this.hk = new Ext.util.KeyMap(document, [{
            key: "f",
            ctrl: true,
            shift: false,
            defaultEventAction: "stopEvent",
            fn: function (key, e) {
                var cmp = Ext.getCmp("pe-preview");
                if (cmp && cmp.isVisible()) {
                    return;
                }
                if (_self.checkCanHotKey()) {
                    cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuSearch", "menuSlides");
                    }
                }
            }
        },
        {
            key: "f",
            alt: true,
            defaultEventAction: "stopEvent",
            fn: function (key, e) {
                var cmp = Ext.getCmp("pe-preview");
                if (cmp && cmp.isVisible()) {
                    return;
                }
                if (_self.checkCanHotKey()) {
                    Ext.menu.Manager.hideAll();
                    cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuFile", "menuSlides");
                    }
                }
            }
        }]);
        this.hkSaveAs = new Ext.util.KeyMap(document, {
            key: "s",
            ctrl: true,
            shift: true,
            defaultEventAction: "stopEvent",
            fn: function (key, e) {
                var cmp = Ext.getCmp("pe-preview");
                if (cmp && cmp.isVisible()) {
                    return;
                }
                if (_self.checkCanHotKey()) {
                    Ext.menu.Manager.hideAll();
                    cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuFile", "menuSlides");
                    }
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
                var cmp = Ext.getCmp("pe-preview");
                if (cmp && cmp.isVisible()) {
                    return;
                }
                if (_self.checkCanHotKey()) {
                    Ext.menu.Manager.hideAll();
                    cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuFile", "menuSlides");
                    }
                }
            }
        });
        this.hkCoAuth = new Ext.util.KeyMap(document, [{
            key: "q",
            ctrl: true,
            alt: true,
            defaultEventAction: "stopEvent",
            fn: function (key, e) {
                var cmp = Ext.getCmp("pe-preview");
                if (cmp && cmp.isVisible()) {
                    return;
                }
                if (_self.checkCanHotKey()) {
                    cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuChat");
                    }
                }
            }
        }]);
        this.hkComments = new Ext.util.KeyMap(document, {
            key: "H",
            ctrl: true,
            shift: true,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (_self.checkCanHotKey()) {
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuComments");
                    }
                }
            }
        });
        Ext.tip.QuickTipManager.init();
        this.applyMode();
    },
    tipFile: "File",
    tipTitles: "Titles",
    tipSlides: "Slides",
    tipSearch: "Search",
    tipChat: "Chat",
    tipComments: "Comments"
});