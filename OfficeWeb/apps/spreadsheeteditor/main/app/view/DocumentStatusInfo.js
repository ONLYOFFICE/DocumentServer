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
 var ACTIVE_TAB_NEXT = -255;
var ACTIVE_TAB_PREV = -254;
Ext.define("SSE.view.DocumentStatusInfo", {
    extend: "Ext.container.Container",
    alias: "widget.documentstatusinfo",
    requires: ["Ext.form.field.Number", "Ext.button.Button", "Ext.form.Label", "Ext.toolbar.Spacer", "SSE.plugin.TabBarScroller", "SSE.plugin.TabReorderer"],
    uses: ["Ext.tip.ToolTip", "Ext.menu.Menu", "SSE.view.SheetRenameDialog", "SSE.view.SheetCopyDialog", "Common.view.Participants"],
    cls: "sse-documentstatusinfo",
    height: 27,
    layout: {
        type: "hbox",
        align: "middle"
    },
    style: "padding-left:5px;padding-right:40px;",
    initComponent: function () {
        var me = this;
        this.permissions = {};
        this.txtZoom = Ext.widget("label", {
            id: "status-label-zoom",
            text: Ext.String.format(me.zoomText, 0),
            cls: "statusinfo-pages",
            style: "cursor: pointer; white-space:nowrap; text-align: center;",
            listeners: {
                afterrender: function (ct) {
                    ct.getEl().on("mousedown", onShowZoomMenu, me);
                    ct.getEl().set({
                        "data-qtip": me.tipZoomFactor,
                        "data-qalign": "bl-tl?"
                    });
                    ct.setWidth(Ext.util.TextMetrics.measure(ct.getEl(), Ext.String.format(me.zoomText, 999)).width);
                }
            }
        });
        this.btnZoomIn = Ext.widget("button", {
            id: "status-button-zoom-in",
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-statusbar-btn btn-zoomin",
            style: "margin-left:5px;"
        });
        this.btnZoomOut = Ext.widget("button", {
            id: "status-button-zoom-out",
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-statusbar-btn btn-zoomout",
            style: "margin:0 5px 0 40px;"
        });
        this.userPanel = Ext.widget("statusinfoparticipants", {
            pack: "end",
            userIconCls: "sse-icon-statusinfo-users"
        });
        var onShowZoomMenu = function (event, elem) {
            if (!elem.disabled) {
                this.menuZoomTo.show();
                this.menuZoomTo.showBy(me.txtZoom, "b-t", [0, -10]);
            }
        };
        this.setApi = function (o) {
            this.api = o;
            this.api.asc_registerCallback("asc_onZoomChanged", Ext.bind(me.onZoomChange, me));
            this.api.asc_registerCallback("asc_onSheetsChanged", Ext.bind(me.updateInfo, me));
            this.api.asc_registerCallback("asc_onEditCell", Ext.bind(me._onStartEditCell, me));
            this.api.asc_registerCallback("asc_onActiveSheetChanged", Ext.bind(me._onActiveSheetChanged, me));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(me.onCoAuthoringDisconnect, me));
            this.api.asc_registerCallback("asc_onWorkbookLocked", Ext.bind(me.onWorkbookLocked, me));
            this.api.asc_registerCallback("asc_onWorksheetLocked", Ext.bind(me.onWorksheetLocked, me));
            this.userPanel.setApi(this.api);
            return this;
        };
        var btnPageFirst = Ext.widget("button", {
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-page-scroller-btn btn-scroll-first"
        });
        var btnPageLast = Ext.widget("button", {
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-page-scroller-btn btn-scroll-last"
        });
        var btnPagePrev = Ext.widget("button", {
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-page-scroller-btn btn-scroll-prev"
        });
        var btnPageNext = Ext.widget("button", {
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-page-scroller-btn btn-scroll-next"
        });
        this.barWorksheets = Ext.widget("tabbar", {
            dock: "bottom",
            plain: true,
            width: "100%",
            style: "margin:-2px 0 0 5px;",
            plugins: [{
                ptype: "tabbarscroller",
                pluginId: "tabbarscroller",
                firstButton: btnPageFirst,
                lastButton: btnPageLast,
                prevButton: btnPagePrev,
                nextButton: btnPageNext
            },
            {
                ptype: "tabreorderer",
                pluginId: "scheetreorderer"
            }]
        });
        me.items = [btnPageFirst, btnPagePrev, btnPageNext, btnPageLast, {
            xtype: "container",
            flex: 1,
            height: "100%",
            items: [this.barWorksheets]
        },
        this.userPanel, this.btnZoomOut, this.txtZoom, this.btnZoomIn];
        me.callParent(arguments);
    },
    onZoomChange: function (zf, type) {
        switch (type) {
        case 1:
            case 2:
            case 0:
            default:
            this.txtZoom.setText(Ext.String.format(this.zoomText, Math.floor((zf + 0.005) * 100)));
        }
        this.doLayout();
    },
    updateInfo: function () {
        this.fireEvent("updatesheetsinfo", this);
        this.barWorksheets.removeAll();
        this.ssMenu.items.items[6].menu.removeAll();
        this.ssMenu.items.items[6].setVisible(false);
        if (this.api) {
            var me = this;
            var wc = this.api.asc_getWorksheetsCount(),
            i = -1;
            var hidentems = [],
            items = [],
            tab,
            locked;
            var sindex = this.api.asc_getActiveWorksheetIndex();
            while (++i < wc) {
                locked = me.api.asc_isWorksheetLockedOrDeleted(i);
                tab = {
                    sheetindex: i,
                    text: me.api.asc_getWorksheetName(i).replace(/\s/g, "&nbsp;"),
                    reorderable: !locked,
                    closable: false,
                    cls: locked ? "coauth-locked" : undefined
                };
                this.api.asc_isWorksheetHidden(i) ? hidentems.push(tab) : items.push(tab);
                if (sindex == i) {
                    sindex = items.length - 1;
                }
            }
            var checkcount = items.length;
            if (this.permissions.isEdit) {
                items.push({
                    iconCls: "asc-add-page-icon",
                    width: 36,
                    closable: false,
                    reorderable: false,
                    disabled: me.api.asc_isWorkbookLocked(),
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.getEl().on("click", me._onAddTabClick, me, {
                                preventDefault: true,
                                tabid: "tab-add-new"
                            });
                        }
                    }
                });
            }
            if (hidentems.length) {
                this.ssMenu.items.items[6].setVisible(true);
                this.ssMenu.items.items[6].menu.add(hidentems);
            }
            if (checkcount) {
                this.barWorksheets.add(items);
                if (! (sindex < 0) && sindex < checkcount) {
                    this.barWorksheets.suspendEvents();
                    this.barWorksheets.setActiveTab(this.barWorksheets.items.items[sindex]);
                    this.barWorksheets.resumeEvents();
                }
                this.barWorksheets.getPlugin("tabbarscroller").scrollToLast();
                this.barWorksheets.getPlugin("scheetreorderer").dd.unlock();
            }
            this.barWorksheets.enable(true);
            this.txtZoom.setText(Ext.String.format(this.zoomText, this.api.asc_getZoom() * 100));
        }
    },
    setMode: function (m) {
        this.permissions = m;
        this.userPanel.setMode(m);
        var plugin = this.barWorksheets.getPlugin("scheetreorderer");
        if (plugin) {
            plugin.setDisabled(!this.permissions.isEdit);
        }
    },
    setActiveWorksheet: function (index, opt) {
        if (!index) {
            var new_index = this.barWorksheets.activeTab ? this.barWorksheets.items.items.indexOf(this.barWorksheets.activeTab) : 0;
            if (opt == ACTIVE_TAB_NEXT) {
                if (! (++new_index < this.barWorksheets.items.items.length - 1)) {
                    new_index = 0;
                }
            } else {
                if (opt == ACTIVE_TAB_PREV) {
                    if (--new_index < 0) {
                        new_index = this.barWorksheets.items.items.length - 2;
                    }
                }
            }
            this.barWorksheets.setActiveTab(this.barWorksheets.items.items[new_index]);
        }
    },
    _onTabClick: function (tabBar, tab, card, eOpts) {
        if (! (tab.sheetindex < 0)) {
            this.api.asc_showWorksheet(tab.sheetindex);
            if (tab.newindex != undefined) {
                var new_index = tab.newindex + 1;
                new_index < this.barWorksheets.items.length - 1 ? new_index = this.barWorksheets.items.getAt(new_index).sheetindex : new_index = this.api.asc_getWorksheetsCount();
                this.api.asc_moveWorksheet(new_index);
                tab.newindex = undefined;
            }
        }
        this.fireEvent("editcomplete", this);
    },
    _onAddTabClick: function (e, el, opt) {
        e.stopEvent();
        if (!e.target.parentNode.disabled && this.permissions.isEdit) {
            this.api.asc_addWorksheet();
        }
    },
    _onTabContextMenu: function (event, docElement, eOpts) {
        if (this.api && this.permissions.isEdit) {
            var tab = Ext.getCmp(eOpts.tabid);
            if (tab && tab.sheetindex >= 0) {
                if (!this.barWorksheets.activeTab || tab.id != this.barWorksheets.activeTab.id) {
                    this.barWorksheets.setActiveTab(tab);
                }
                var issheetlocked = this.api.asc_isWorksheetLockedOrDeleted(tab.sheetindex),
                isdoclocked = this.api.asc_isWorkbookLocked();
                this.ssMenu.items.items[0].setDisabled(isdoclocked);
                this.ssMenu.items.items[1].setDisabled(issheetlocked);
                this.ssMenu.items.items[2].setDisabled(issheetlocked);
                this.ssMenu.items.items[3].setDisabled(issheetlocked);
                this.ssMenu.items.items[4].setDisabled(issheetlocked);
                this.ssMenu.items.items[5].setDisabled(issheetlocked);
                this.ssMenu.items.items[6].setDisabled(isdoclocked);
                this.api.asc_closeCellEditor();
                this._showPopupMenu(this.ssMenu, {},
                event, tab.getEl(), eOpts);
            }
        }
    },
    _onTabDblClick: function (event, docElement, eOpts) {
        if (this.api && this.permissions.isEdit) {
            var tab = Ext.getCmp(eOpts.tabid);
            if (tab && tab.sheetindex >= 0) {
                if (!this.api.asc_isWorksheetLockedOrDeleted(tab.sheetindex) && this.api.asc_getActiveWorksheetIndex() == tab.sheetindex) {
                    this._renameWorksheet();
                }
            }
        }
    },
    _showPopupMenu: function (menu, value, event, docElement, eOpts) {
        if (Ext.isDefined(menu)) {
            Ext.menu.Manager.hideAll();
            var showPoint = event.getXY();
            showPoint[1] += 10;
            if (Ext.isFunction(menu.initMenu)) {
                menu.initMenu(value);
            }
            menu.show();
            menu.showBy(docElement, "bl-tl");
        }
    },
    _getNewSheetName: function (n) {
        var nameindex = 1;
        var firstname = this.strSheet;
        var wc = this.api.asc_getWorksheetsCount(),
        i = -1;
        var items = [];
        while (++i < wc) {
            items.push(this.api.asc_getWorksheetName(i));
        }
        while (true) {
            if (Ext.Array.contains(items, firstname + nameindex)) {
                nameindex++;
                if (nameindex > 100) {
                    return "";
                }
            } else {
                break;
            }
        }
        return firstname + nameindex;
    },
    _insertWorksheet: function () {
        var name = this._getNewSheetName();
        this.api.asc_insertWorksheet(name);
    },
    _deleteWorksheet: function () {
        var me = this;
        if (this.barWorksheets.items.items.length == 2) {
            Ext.Msg.show({
                title: this.textWarning,
                msg: this.errorLastSheet,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
        } else {
            Ext.create("Ext.window.MessageBox", {
                buttonText: {
                    ok: "OK",
                    yes: "Yes",
                    no: "No",
                    cancel: me.textCancel
                }
            }).show({
                title: this.textWarning,
                msg: this.warnDeleteSheet,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OKCANCEL,
                fn: function (bid) {
                    if (bid == "ok") {
                        var index = me.api.asc_getActiveWorksheetIndex();
                        var uid = me.api.asc_getActiveWorksheetId();
                        if (!me.api.asc_deleteWorksheet()) {
                            Ext.Msg.show({
                                title: me.textError,
                                msg: me.msgDelSheetError,
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        } else {
                            me.fireEvent("removeworksheet", index, uid);
                        }
                    }
                }
            });
        }
    },
    _renameWorksheet: function () {
        var me = this;
        var wc = me.api.asc_getWorksheetsCount(),
        items = [],
        i = -1;
        while (++i < wc) {
            items.push(me.api.asc_getWorksheetName(i));
        }
        var win = Ext.create("SSE.view.SheetRenameDialog", {
            title: "Rename",
            renameindex: me.api.asc_getActiveWorksheetIndex(),
            names: items
        });
        win.addListener("onmodalresult", function (o, mr, s) {
            if (mr) {
                me.api.asc_renameWorksheet(s);
                me.barWorksheets.activeTab.setText(s.replace(/\s/g, "&nbsp;"));
            }
            me.fireEvent("editcomplete", me);
        },
        false);
        win.show();
        var xy = win.getEl().getAlignToXY(me.barWorksheets.activeTab.getEl(), "bl-tl");
        win.showAt(xy[0], xy[1] - 4);
    },
    _getSheetCopyName: function (n) {
        var result = /^(.*)\((\d)\)$/.exec(n);
        var nameindex = 2;
        var firstname = result ? result[1] : n + " ";
        var tn = firstname + "(" + nameindex + ")";
        var wc = this.api.asc_getWorksheetsCount(),
        i = -1;
        var items = [];
        while (++i < wc) {
            items.push(this.api.asc_getWorksheetName(i));
        }
        while (true) {
            if (Ext.Array.contains(items, tn)) {
                nameindex++;
                if (nameindex > 100) {
                    return "";
                }
                tn = firstname + "(" + nameindex + ")";
            } else {
                break;
            }
        }
        return tn;
    },
    _copyWorksheet: function (cut) {
        var me = this;
        var wc = me.api.asc_getWorksheetsCount(),
        i = -1;
        var items = [];
        while (++i < wc) {
            if (!this.api.asc_isWorksheetHidden(i)) {
                items.push({
                    name: me.api.asc_getWorksheetName(i).replace(/\s/g, "&nbsp;"),
                    sheetindex: i
                });
            }
        }
        if (items.length) {
            items.push({
                name: cut ? me.itemMoveToEnd : me.itemCopyToEnd,
                sheetindex: -255
            });
        }
        var win = Ext.create("SSE.view.SheetCopyDialog", {
            title: cut ? me.itemMoveWS : me.itemCopyWS,
            listtitle: cut ? this.textMoveBefore : undefined,
            names: items
        });
        win.addListener("onmodalresult", function (o, mr, i) {
            if (mr && me.api) {
                if (cut) {
                    me.api.asc_moveWorksheet(i == -255 ? wc : i);
                } else {
                    var new_text = me._getSheetCopyName(me.api.asc_getWorksheetName(me.api.asc_getActiveWorksheetIndex()));
                    me.api.asc_copyWorksheet(i == -255 ? wc : i, new_text);
                }
            }
            me.fireEvent("editcomplete", me);
        },
        false);
        win.show();
    },
    _showWorksheet: function (show, index) {
        Ext.menu.Manager.hideAll();
        if (!show && this.barWorksheets.items.items.length == 2) {
            Ext.Msg.show({
                title: this.textWarning,
                msg: this.errorLastSheet,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
            return;
        }
        this.api[show ? "asc_showWorksheet" : "asc_hideWorksheet"](index);
    },
    _onStartEditCell: function (isstart) {
        this.txtZoom.setDisabled(isstart);
        this.btnZoomIn.setDisabled(isstart);
        this.btnZoomOut.setDisabled(isstart);
    },
    _onActiveSheetChanged: function (index) {
        var seltab, item, ic = this.barWorksheets.items.items.length;
        while (! (--ic < 0)) {
            item = this.barWorksheets.items.items[ic];
            if (item.sheetindex == index) {
                seltab = item;
                break;
            }
        }
        if (seltab) {
            this.barWorksheets.setActiveTab(seltab);
        }
    },
    createDelayedElements: function () {
        var me = this;
        this.btnZoomIn.getEl().set({
            "data-qtip": me.tipZoomIn,
            "data-qalign": "bl-tl?"
        });
        this.btnZoomOut.getEl().set({
            "data-qtip": me.tipZoomOut,
            "data-qalign": "bl-tl?"
        });
        this.btnZoomIn.on("click", function () {
            var f = me.api.asc_getZoom() + 0.1;
            if (f > 0 && !(f > 2)) {
                me.api.asc_setZoom(f);
            }
        });
        this.btnZoomOut.on("click", function () {
            var f = me.api.asc_getZoom() - 0.1;
            if (! (f < 0.5)) {
                me.api.asc_setZoom(f);
            }
        });
        this.barWorksheets.on("change", this._onTabClick, this);
        this.barWorksheets.getEl().on({
            contextmenu: {
                fn: function (event, docElement, eOpts) {
                    var tab = /x-tab(?!\S)/.test(docElement.className) ? docElement : Ext.fly(docElement).up(".x-tab");
                    tab && me._onTabContextMenu(event, docElement, {
                        tabid: tab.id
                    });
                },
                preventDefault: true
            },
            dblclick: {
                fn: function (event, docElement, eOpts) {
                    var tab = /x-tab(?!\S)/.test(docElement.className) ? docElement : Ext.fly(docElement).up(".x-tab");
                    tab && me._onTabDblClick(event, docElement, {
                        tabid: tab.id
                    });
                },
                preventDefault: true
            }
        });
        this.barWorksheets.getPlugin("scheetreorderer").on({
            drop: function (obj, tabbar, tab, idx, nidx, opts) {
                if (nidx != idx) {
                    obj.lock();
                    tab.newindex = nidx;
                    tab.reorderable = false;
                }
            }
        });
        this.menuZoomTo = Ext.widget("menu", {
            plain: true,
            bodyCls: "status-zoom-menu",
            minWidth: 100,
            listeners: {
                click: function (menu, item) {
                    if (me.api) {
                        me.api.asc_setZoom(item.fz);
                    }
                    me.onZoomChange(item.fz);
                    me.fireEvent("editcomplete", me);
                }
            },
            items: [{
                text: "50%",
                fz: 0.5
            },
            {
                text: "75%",
                fz: 0.75
            },
            {
                text: "100%",
                fz: 1
            },
            {
                text: "125%",
                fz: 1.25
            },
            {
                text: "150%",
                fz: 1.5
            },
            {
                text: "175%",
                fz: 1.75
            },
            {
                text: "200%",
                fz: 2
            }]
        });
        this.ssMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                },
                click: function (menu, item) {
                    if (!item.isDisabled()) {
                        if (item.action == "ins") {
                            me._insertWorksheet();
                        } else {
                            if (item.action == "del") {
                                me._deleteWorksheet();
                            } else {
                                if (item.action == "ren") {
                                    me._renameWorksheet();
                                } else {
                                    if (item.action == "copy") {
                                        me._copyWorksheet(false);
                                    } else {
                                        if (item.action == "move") {
                                            me._copyWorksheet(true);
                                        } else {
                                            if (item.action == "hide") {
                                                me._showWorksheet(false);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            items: [{
                text: this.itemInsertWS,
                action: "ins"
            },
            {
                text: this.itemDeleteWS,
                action: "del"
            },
            {
                text: this.itemRenameWS,
                action: "ren"
            },
            {
                text: this.itemCopyWS,
                action: "copy"
            },
            {
                text: this.itemMoveWS,
                action: "move"
            },
            {
                text: this.itemHideWS,
                action: "hide"
            },
            {
                text: this.itemHidenWS,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    items: [],
                    listeners: {
                        click: function (menu, item) {
                            me._showWorksheet(true, item.sheetindex);
                        }
                    }
                }
            }]
        });
    },
    onCoAuthoringDisconnect: function () {
        this.permissions.isEdit = false;
        this.barWorksheets.getPlugin("scheetreorderer").setDisabled(true);
        this.updateInfo();
    },
    onWorkbookLocked: function (locked) {
        this.barWorksheets[locked ? "addCls" : "removeCls"]("coauth-locked");
        var item, ic = this.barWorksheets.items.items.length;
        while (! (--ic < 0)) {
            item = this.barWorksheets.items.items[ic];
            if (item.sheetindex >= 0) {
                if (locked) {
                    item.reorderable = false;
                } else {
                    item.reorderable = !this.api.asc_isWorksheetLockedOrDeleted(item.sheetindex);
                }
            } else {
                item.setDisabled(locked);
            }
        }
    },
    onWorksheetLocked: function (index, locked) {
        var tabs = this.barWorksheets.items.items;
        for (var i = 0; i < tabs.length; i++) {
            if (index == tabs[i].sheetindex) {
                tabs[i][locked ? "addCls" : "removeCls"]("coauth-locked");
                tabs[i].reorderable = !locked;
                break;
            }
        }
    },
    zoomText: "Zoom {0}%",
    tipZoomIn: "Zoom In",
    tipZoomOut: "Zoom Out",
    tipZoomFactor: "Magnification",
    txtFirst: "First Sheet",
    txtLast: "Last Sheet",
    txtPrev: "Previous Sheet",
    txtNext: "Next Sheet",
    itemInsertWS: "Insert",
    itemDeleteWS: "Delete",
    itemRenameWS: "Rename",
    itemCopyWS: "Copy",
    itemMoveWS: "Move",
    itemHideWS: "Hide",
    itemHidenWS: "Hiden",
    itemCopyToEnd: "(Copy to end)",
    itemMoveToEnd: "(Move to end)",
    msgDelSheetError: "Can't delete the worksheet.",
    textMoveBefore: "Move before sheet",
    warnDeleteSheet: "The worksheet maybe has data. Proceed operation?",
    errorLastSheet : "Workbook must have at least one visible worksheet.",
    strSheet: "Sheet",
    textError: "Error",
    textWarning: "Warning",
    textCancel: "Cancel"
});