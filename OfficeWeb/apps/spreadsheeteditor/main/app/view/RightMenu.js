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
 var SCALE_MIN = 40;
var MENU_SCALE_PART = 260;
var RIGHTMENU_TOOLBAR_ID = "rightmenu-toolbar-id";
var RIGHTMENU_PANEL_ID = "rightmenu-panel-id";
Ext.define("SSE.view.RightMenu", {
    extend: "Ext.panel.Panel",
    alias: "widget.sserightmenu",
    requires: ["Ext.toolbar.Toolbar", "Ext.button.Button", "Ext.container.Container", "Ext.toolbar.Spacer", "SSE.view.RightPanel", "Ext.util.Cookies"],
    cls: "rm-style",
    id: RIGHTMENU_PANEL_ID,
    bodyCls: "rm-body",
    width: SCALE_MIN,
    buttonCollection: [],
    listeners: {
        afterrender: function () {
            var owner = this.ownerCt;
            if (Ext.isDefined(owner)) {
                owner.addListener("resize", Ext.bind(this.resizeMenu, this));
            }
        }
    },
    initComponent: function () {
        this.dockedItems = this.buildDockedItems();
        this._rightSettings = Ext.widget("sserightpanel", {
            id: "view-right-panel-settings",
            btnImage: this.btnImage,
            btnShape: this.btnShape,
            btnText: this.btnText
        });
        this.items = [this._rightSettings];
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    buildDockedItems: function () {
        var me = this;
        me.btnShape = Ext.create("Ext.button.Button", {
            id: "id-right-menu-shape",
            cls: "asc-main-menu-buttons",
            iconCls: "asc-main-menu-btn menuShape",
            asctype: c_oAscTypeSelectElement.Shape,
            enableToggle: true,
            allowDepress: true,
            toggleGroup: "tabpanelbtnsGroup",
            disabled: true,
            style: "margin-bottom:8px;"
        });
        me.btnImage = Ext.create("Ext.Button", {
            id: "id-right-menu-image",
            cls: "asc-main-menu-buttons",
            iconCls: "asc-main-menu-btn menuImage",
            asctype: c_oAscTypeSelectElement.Image,
            enableToggle: true,
            allowDepress: true,
            toggleGroup: "tabpanelbtnsGroup",
            disabled: true,
            style: "margin-bottom:8px;"
        });
        me.btnText = Ext.create("Ext.Button", {
            id: "id-right-menu-text",
            cls: "asc-main-menu-buttons",
            iconCls: "asc-main-menu-btn menuText",
            asctype: c_oAscTypeSelectElement.Paragraph,
            enableToggle: true,
            allowDepress: true,
            disabled: true,
            toggleGroup: "tabpanelbtnsGroup"
        });
        this.rightToolbar = Ext.create("Ext.toolbar.Toolbar", {
            cls: "rm-default-toolbar",
            width: this.width || SCALE_MIN,
            vertical: true,
            dock: "right",
            defaultType: "button",
            style: "padding-top:15px",
            items: [me.btnShape, me.btnImage, me.btnText]
        });
        return this.rightToolbar;
    },
    resizeMenu: function (Component, adjWidth, adjHeight, eOpts) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items.items[i].el && adjHeight != this.items.items[i].getHeight()) {
                this.items.items[i].setHeight(adjHeight);
            }
        }
        this.doComponentLayout();
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        return this;
    },
    disableMenu: function (disabled) {
        var btn, i;
        var tbMain = this.rightToolbar;
        if (Ext.isDefined(tbMain)) {
            for (i = 0; i < tbMain.items.length; i++) {
                btn = tbMain.items.items[i];
                if (btn) {
                    btn.pressed && btn.toggle(false);
                    btn.setDisabled(disabled);
                }
            }
        }
    },
    onCoAuthoringDisconnect: function () {
        this.disableMenu(true);
        if (this._rightSettings) {
            this._rightSettings.setDisabled(true);
            this._rightSettings.setMode({
                isEdit: false
            });
        }
    },
    onSelectionChanged: function (info) {
        var SelectedObjects = [];
        if (info.asc_getFlags().asc_getSelectionType() == c_oAscSelectionType.RangeImage || info.asc_getFlags().asc_getSelectionType() == c_oAscSelectionType.RangeShape || info.asc_getFlags().asc_getSelectionType() == c_oAscSelectionType.RangeShapeText) {
            SelectedObjects = this.api.asc_getGraphicObjectProps();
        }
        if (SelectedObjects.length <= 0 && !this._rightSettings.minimizedMode) {
            this.clearSelection();
            this._rightSettings.minimizedMode = true;
            this.setWidth(SCALE_MIN);
        }
        this._rightSettings.onFocusObject(SelectedObjects);
    },
    clearSelection: function (exclude) {
        var btn, i;
        var tbMain = this.rightToolbar;
        if (Ext.isDefined(tbMain)) {
            for (i = 0; i < tbMain.items.length; i++) {
                btn = tbMain.items.items[i];
                if (Ext.isDefined(btn) && btn.componentCls === "x-btn") {
                    if (btn.pressed) {
                        if (exclude) {
                            if (typeof exclude == "object") {
                                if (exclude.id == btn.id) {
                                    continue;
                                }
                            } else {
                                if (btn.iconCls && !(btn.iconCls.search(exclude) < 0)) {
                                    continue;
                                }
                            }
                        }
                        btn.toggle(false);
                    }
                }
            }
        }
    },
    createDelayedElements: function () {
        var me = this;
        this.api.asc_registerCallback("asc_onSelectionChanged", Ext.bind(this.onSelectionChanged, this));
        me._rightSettings.setHeight(me.getHeight());
        var toggleHandler = function (btn, pressed) {
            if (pressed && !me._rightSettings.minimizedMode) {
                btn.addCls("asc-main-menu-btn-selected");
                var panel = me._rightSettings._settings[btn.asctype].panel;
                var props = me._rightSettings._settings[btn.asctype].props;
                me._rightSettings.TabPanel.getLayout().setActiveItem(panel);
                me._rightSettings.TabPanel.setHeight(panel.initialHeight);
                if (props) {
                    panel.ChangeSettings.call(panel, props);
                }
            }
        };
        var clickHandler = function (btn) {
            if (btn.pressed) {
                if (me._rightSettings.minimizedMode) {
                    if (me._rightSettings.TabPanel.hidden) {
                        me._rightSettings.TabPanel.setVisible(true);
                    }
                    me.setWidth(MENU_SCALE_PART);
                    me._rightSettings.minimizedMode = false;
                    toggleHandler(btn, btn.pressed);
                } else {
                    btn.addCls("asc-main-menu-btn-selected");
                }
            } else {
                me._rightSettings.minimizedMode = true;
                me.setWidth(SCALE_MIN);
                btn.removeCls("asc-main-menu-btn-selected");
            }
            me.fireEvent("editcomplete", me);
        };
        var button;
        var tips = [me.txtShapeSettings, me.txtImageSettings, me.txtParagraphSettings];
        for (var i = this.rightToolbar.items.items.length; i--;) {
            button = this.rightToolbar.items.items[i];
            button.on({
                "click": clickHandler,
                "toggle": toggleHandler
            });
            button.setTooltip(tips[i]);
        }
    },
    txtImageSettings: "Image Settings",
    txtShapeSettings: "Shape Settings",
    txtParagraphSettings: "Text Settings"
});