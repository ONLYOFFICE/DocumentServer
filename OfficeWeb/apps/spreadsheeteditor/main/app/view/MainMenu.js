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
var SCALE_FULL = "100%";
var SCALE_PART = 300;
var MAINMENU_TOOLBAR_ID = "mainmenu-toolbar-id";
var MAINMENU_PANEL_ID = "mainmenu-panel-id";
var MAINMENU_FULL_PANEL_ID = "mainmenu-full-panel-id";
Ext.define("SSE.view.MainMenu", {
    extend: "Ext.panel.Panel",
    alias: "widget.ssemainmenu",
    requires: ["Ext.toolbar.Toolbar", "Ext.button.Button", "Ext.container.Container", "Ext.toolbar.Spacer"],
    cls: "lm-style",
    id: MAINMENU_PANEL_ID,
    bodyCls: "lm-body",
    width: SCALE_MIN,
    layout: "card",
    currentFullScaleMenuBtn: undefined,
    fullScaledItemCnt: undefined,
    buttonCollection: [],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    listeners: {
        afterrender: function () {
            var owner = this.ownerCt;
            if (Ext.isDefined(owner)) {
                owner.addListener("resize", Ext.bind(this.resizeMenu, this));
            }
        }
    },
    initComponent: function () {
        this.items = [];
        this.dockedItems = this.buildDockedItems();
        this.addEvents("panelshow", "panelhide");
        this.callParent(arguments);
    },
    buildDockedItems: function () {
        var addedButtons = [],
        item,
        cardId,
        config;
        var me = this;
        for (var i = 0; i < this.buttonCollection.length; i++) {
            item = this.buttonCollection[i];
            cardId = -1;
            config = {
                xtype: "button",
                id: item.id,
                itemScale: item.scale,
                tooltip: item.tooltip,
                disabled: item.disabled === true,
                cls: "asc-main-menu-buttons",
                iconCls: "asc-main-menu-btn " + item.cls,
                style: "margin-bottom: 8px;"
            };
            if (item.scale == "modal") {
                config.enableToggle = true;
                config.listeners = item.listeners;
                config.getApi = function () {
                    return me.api;
                };
            } else {
                config.isFullScale = item.scale == "full";
                config.bodyItems = item.items;
                config.toggleGroup = "tbMainMenu";
                config.listeners = {
                    click: function (btnCall) {
                        if (btnCall.pressed) {
                            me.openButtonMenu(btnCall);
                        }
                    },
                    toggle: function (btnCall, pressed) {
                        btnCall[pressed ? "addCls" : "removeCls"]("asc-main-menu-btn-selected");
                        if (!pressed) {
                            me.fireEvent("panelbeforehide");
                            if (btnCall.isFullScale) {
                                if (Ext.isDefined(me.fullScaledItemCnt) && me.fullScaledItemCnt.isVisible()) {
                                    me.fullScaledItemCnt.hide();
                                    me.currentFullScaleMenuBtn = undefined;
                                }
                                var panel = me.fullScaledItemCnt;
                            } else {
                                window.localStorage.setItem("sse-mainmenu-width", me.getWidth());
                                panel = Ext.getCmp(btnCall.bodyCardId);
                                me.setWidth(SCALE_MIN);
                            }
                            me.fireEvent("panelhide", panel, btnCall.isFullScale);
                        }
                    }
                };
            }
            addedButtons.push(config);
        }
        this.mainToolbar = Ext.create("Ext.toolbar.Toolbar", {
            cls: "lm-default-toolbar",
            width: this.width || SCALE_MIN,
            vertical: true,
            dock: "left",
            defaultType: "button",
            items: addedButtons,
            style: "padding-top:15px;",
            listeners: {
                afterrender: function (cmp) {
                    cmp.getEl().on("keydown", me._onMenuKeyDown, me, {
                        button: undefined
                    });
                }
            }
        });
        return this.mainToolbar;
    },
    closeFullScaleMenu: function () {
        if (Ext.isDefined(this.currentFullScaleMenuBtn)) {
            this.currentFullScaleMenuBtn.toggle(false);
        }
    },
    openButtonMenu: function (btn) {
        this.fireEvent("panelbeforeshow", btn.isFullScale);
        if (Ext.isNumber(btn.itemScale)) {
            var saved_width = window.localStorage.getItem("sse-mainmenu-width");
            saved_width = saved_width ? parseInt(saved_width) : btn.itemScale;
            this.setSize({
                width: saved_width
            });
        } else {
            this.setWidth(btn.isFullScale ? SCALE_MIN : SCALE_PART);
        }
        if (btn.isFullScale) {
            var ownerEl = this.ownerCt.el;
            var startPos = ownerEl.getXY();
            var panel = this.fullScaledItemCnt;
            this.currentFullScaleMenuBtn = btn;
            this.fullScaledItemCnt.setSize(ownerEl.getWidth() - SCALE_MIN, ownerEl.getHeight());
            this.fullScaledItemCnt.setPosition(startPos[0] + this.width, startPos[1]);
            this.fullScaledItemCnt.show();
            this.fullScaledItemCnt.getLayout().setActiveItem(Ext.getCmp(btn.bodyCardId));
        } else {
            panel = Ext.getCmp(btn.bodyCardId);
            this.getLayout().setActiveItem(btn.bodyCardId);
        }
        btn.removeCls("notify");
        this.fireEvent("panelshow", panel, btn.isFullScale);
        this.doComponentLayout();
        Common.component.Analytics.trackEvent("Main Menu", btn.tooltip);
    },
    resizeMenu: function (Component, adjWidth, adjHeight, eOpts) {
        if (Ext.isDefined(this.fullScaledItemCnt) && this.fullScaledItemCnt.isVisible()) {
            var ownerEl = this.ownerCt.el;
            var startPos = ownerEl.getXY();
            this.fullScaledItemCnt.setSize(adjWidth - SCALE_MIN, adjHeight);
            this.fullScaledItemCnt.setPosition(startPos[0] + this.width, startPos[1]);
        } else {
            for (var i = 0; i < this.items.length; i++) {
                var h = this.items.items[i].getHeight();
                if (adjHeight != h) {
                    this.items.items[i].setHeight(adjHeight);
                }
            }
        }
        this.doComponentLayout();
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onCoAuthoringChatReceiveMessage", Ext.bind(this.onCoAuthoringChatReceiveMessage, this));
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        this.api.asc_registerCallback("asc_onGetLicense", Ext.bind(this.onGetLicense, this));
        return this;
    },
    selectMenu: function (clsname) {
        var btnCall, btn, i, panel;
        var tbMain = this.mainToolbar;
        for (i = tbMain.items.length; i > 0; i--) {
            btnCall = tbMain.items.items[i - 1];
            if (btnCall.iconCls && !(btnCall.iconCls.search(clsname) < 0)) {
                break;
            } else {
                btnCall = undefined;
            }
        }
        if (btnCall && !btnCall.pressed) {
            if (Ext.isDefined(tbMain)) {
                for (i = 0; i < tbMain.items.length; i++) {
                    btn = tbMain.items.items[i];
                    if (Ext.isDefined(btn) && btn.componentCls === "x-btn") {
                        if (btn.id != btnCall.id && btn.pressed) {
                            btn.toggle(false);
                        }
                    }
                }
            }
            btnCall.toggle(true);
            if (btnCall.itemScale != "modal") {
                this.openButtonMenu(btnCall);
            }
        }
    },
    clearSelection: function (exclude) {
        var btn, i;
        var tbMain = this.mainToolbar;
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
    disableMenu: function (btns, disabled) {
        var btn, i;
        var tbMain = this.mainToolbar;
        if (Ext.isDefined(tbMain)) {
            var apply_all = false;
            typeof btns == "string" && (btns == "all" ? apply_all = true : btns = [btns]);
            for (i = 0; i < tbMain.items.length; i++) {
                btn = tbMain.items.items[i];
                if (Ext.isDefined(btn) && btn.componentCls === "x-btn") {
                    if (apply_all || !(btns.indexOf(btn.id) < 0)) {
                        btn.pressed && btn.toggle(false);
                        btn.setDisabled(disabled);
                    }
                }
            }
        }
    },
    onCoAuthoringChatReceiveMessage: function (messages) {
        var mainMenu = Ext.getCmp("view-main-menu");
        if (mainMenu) {
            var activeStep;
            mainMenu.getLayout().getActiveItem() && (activeStep = mainMenu.getLayout().getActiveItem().down("container"));
            var btnChat = Ext.getCmp("id-menu-chat");
            if (btnChat) {
                if (!activeStep || !activeStep.isXType("commonchatpanel") || activeStep.getWidth() < 1) {
                    btnChat.addCls("notify");
                }
            }
        }
    },
    onCoAuthoringDisconnect: function () {
        this.disableMenu(["id-menu-comments", "id-menu-chat"], true);
    },
    onGetLicense: function (license) {
        var panel = Ext.getCmp("main-menu-about");
        if (panel) {
            panel.setLicInfo(license);
        }
    },
    createDelayedElements: function () {
        var me = this;
        this.hkEsc = new Ext.util.KeyMap(document, [{
            key: Ext.EventObject.ESC,
            fn: function (key, e) {
                if (Ext.isDefined(me.currentFullScaleMenuBtn)) {
                    e.stopPropagation();
                    e.preventDefault();
                    me.currentFullScaleMenuBtn.toggle(false);
                }
            }
        }]);
        var addedItems = [],
        addedButtons = this.mainToolbar.items.items,
        item;
        for (var i = 0; i < this.buttonCollection.length; i++) {
            item = this.buttonCollection[i];
            if (item.scale == "modal") {} else {
                if (item.scale != "full") {
                    var cardPanel = Ext.create("Ext.container.Container", {
                        items: item.items,
                        menubutton: addedButtons[i],
                        listeners: {
                            afterrender: function (cmp) {
                                cmp.getEl().on("keydown", me._onMenuKeyDown, me, {
                                    button: cmp.menubutton
                                });
                            }
                        }
                    });
                    addedButtons[i].bodyCardId = cardPanel.getId();
                    addedItems.push(cardPanel);
                } else {
                    if (this.fullScaledItemCnt === undefined) {
                        this.fullScaledItemCnt = Ext.create("Ext.container.Container", {
                            id: MAINMENU_FULL_PANEL_ID,
                            layout: "card",
                            shadow: false,
                            floating: true,
                            toFrontOnShow: true,
                            closeMenu: function () {
                                me.closeFullScaleMenu();
                            },
                            getApi: function () {
                                return me.api;
                            }
                        });
                    }
                    addedButtons[i].bodyCardId = item.items[0].id;
                    this.fullScaledItemCnt.add(item.items);
                }
            }
        }
        me.api.asc_getLicense();
        this.add(addedItems);
    },
    _onMenuKeyDown: function (event, target, opt) {
        if (event.getKey() == event.ESC) {
            if (opt.button) {
                opt.button.toggle(false);
            } else {
                this.clearSelection();
            }
        }
    }
});