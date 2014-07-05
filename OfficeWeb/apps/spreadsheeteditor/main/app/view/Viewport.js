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
 window.cancelButtonText = "Cancel";
Ext.define("SSE.view.Viewport", {
    extend: "Ext.container.Viewport",
    alias: "widget.sseviewport",
    layout: "fit",
    uses: ["SSE.view.DocumentHolder", "SSE.view.MainMenu", "SSE.view.File", "SSE.view.DocumentStatusInfo", "SSE.view.CellInfo", "Common.view.ChatPanel", "Common.view.CommentsPanel", "Common.view.Header", "SSE.view.Toolbar", "Common.view.SearchDialog", "Common.view.About", "SSE.view.RightMenu"],
    initComponent: function () {
        this.header = Ext.widget("commonheader", {
            config: {
                headerCaption: "Spreadsheet Editor"
            }
        });
        this.applicationUI = Ext.widget("container", {
            layout: {
                type: "vbox",
                align: "stretch"
            },
            flex: 1,
            hidden: true,
            items: [{
                xtype: "container",
                flex: 1,
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "ssemainmenu",
                    id: "view-main-menu",
                    maxWidth: 600,
                    listeners: {
                        panelshow: function (panel, fulscreen) {
                            if (fulscreen) {
                                var menu = Ext.getCmp("view-main-menu");
                                menu.clearSelection({
                                    id: menu.currentFullScaleMenuBtn.id
                                });
                            }
                        }
                    },
                    buttonCollection: [{
                        cls: "menuFile",
                        tooltip: this.tipFile + " (Alt+F)",
                        id: "id-menu-file",
                        scale: "full",
                        disabled: true,
                        items: [{
                            xtype: "ssefile",
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
                        cls: "menuComments",
                        id: "id-menu-comments",
                        hideMode: "display",
                        scale: 300,
                        tooltip: this.tipComments + " (Ctrl+Shift+H)",
                        disabled: true,
                        items: [{
                            xtype: "commoncommentspanel",
                            height: "100%"
                        }]
                    },
                    {
                        cls: "menuChat",
                        id: "id-menu-chat",
                        scale: 300,
                        tooltip: this.tipChat + " (Ctrl+Alt+Q)",
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
                        disabled: true,
                        items: [{
                            xtype: "commonabout",
                            id: "main-menu-about",
                            width: "100%",
                            height: "100%"
                        }]
                    }]
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
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    maintainFlex: true,
                    flex: 1,
                    items: [{
                        xtype: "ssecellinfo",
                        id: "cell-edit",
                        style: "border-left:solid 1px #afafaf;"
                    },
                    {
                        xtype: "splitter",
                        id: "field-formula-splitter",
                        defaultSplitMin: 23,
                        cls: "splitter-document-area"
                    },
                    {
                        id: "editor_sdk",
                        minHeight: 70,
                        xtype: "ssedocumentholder",
                        maintainFlex: true,
                        flex: 1
                    }]
                }]
            },
            {
                xtype: "documentstatusinfo",
                id: "view-status"
            }]
        });
        this.items = {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [this.header, this.applicationUI]
        };
        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
    },
    applyMode: function () {
        this.hkSaveAs[this.mode.canDownload ? "enable" : "disable"]();
        this.hkChat[this.mode.canCoAuthoring ? "enable" : "disable"]();
        this.hkComments[(this.mode.canCoAuthoring && this.mode.isEdit) ? "enable" : "disable"]();
    },
    setMode: function (m, delay) {
        m.isDisconnected ? this.mode.canDownload = this.mode.canCoAuthoring = false : this.mode = m;
        if (!delay) {
            this.applyMode();
        }
    },
    applyEditorMode: function () {
        var me = this;
        me._toolbar = Ext.widget("ssetoolbar", {
            id: "view-toolbar"
        });
        me._rightMenu = Ext.widget("sserightmenu", {
            id: "view-right-menu"
        });
        me.applicationUI.insert(0, me._toolbar);
        me.applicationUI.items.items[1].add(me._rightMenu);
        me._toolbar.setVisible(true);
    },
    createDelayedElements: function () {
        var _self = this;
        this.hotKeys = new Ext.util.KeyMap(document, [{
            key: "f",
            ctrl: true,
            shift: false,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (canHotKey()) {
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuSearch");
                    }
                }
            }
        },
        {
            key: [Ext.EventObject.PAGE_DOWN, Ext.EventObject.PAGE_UP],
            ctrl: false,
            shift: false,
            alt: true,
            defaultEventAction: "stopEvent",
            fn: function (key, event) {
                if (canHotKey()) {
                    var cmp = Ext.getCmp("view-status");
                    if (cmp) {
                        cmp.setActiveWorksheet(undefined, key == event.PAGE_DOWN ? ACTIVE_TAB_NEXT : ACTIVE_TAB_PREV);
                    }
                }
            }
        },
        {
            key: "f",
            alt: true,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (canHotKey()) {
                    Ext.menu.Manager.hideAll();
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuFile");
                    }
                }
            }
        }]);
        this.hkSaveAs = new Ext.util.KeyMap(document, {
            key: "s",
            ctrl: true,
            shift: true,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (canHotKey()) {
                    Ext.menu.Manager.hideAll();
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuFile");
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
                if (canHotKey()) {
                    Ext.menu.Manager.hideAll();
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuFile");
                    }
                }
            }
        });
        this.hkChat = new Ext.util.KeyMap(document, {
            key: "q",
            ctrl: true,
            alt: true,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (canHotKey()) {
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuChat");
                    }
                }
            }
        });
        this.hkComments = new Ext.util.KeyMap(document, {
            key: "H",
            ctrl: true,
            shift: true,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (canHotKey()) {
                    var cmp = Ext.getCmp("view-main-menu");
                    if (cmp) {
                        cmp.selectMenu("menuComments");
                    }
                }
            }
        });
    },
    tipChat: "Chat",
    tipComments: "Comments",
    tipFile: "File",
    tipSearch: "Search"
});