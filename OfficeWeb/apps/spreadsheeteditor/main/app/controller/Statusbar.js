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
 define(["core", "spreadsheeteditor/main/app/view/Statusbar"], function () {
    SSE.Controllers.Statusbar = Backbone.Controller.extend(_.extend({
        models: [],
        collections: [],
        views: ["Statusbar"],
        initialize: function () {
            this.addListeners({
                "Statusbar": {
                    "show:hidden": _.bind(function (obj, index) {
                        this.hideWorksheet(false, index);
                    },
                    this),
                    "sheet:changename": _.bind(function () {
                        this.api.asc_closeCellEditor();
                        this.renameWorksheet();
                    },
                    this),
                    "sheet:setcolor": _.bind(this.setWorksheetColor, this),
                    "sheet:updateColors": _.bind(this.updateTabsColors, this),
                    "sheet:move": _.bind(this.moveWorksheet, this)
                }
            });
            var me = this;
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: {
                    "alt+pageup": function (e) {
                        me.moveCurrentTab(-1);
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    "alt+pagedown": function (e) {
                        me.moveCurrentTab(1);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
        },
        events: function () {
            return {
                "click #status-btn-zoomdown": _.bind(this.zoomDocument, this, "down"),
                "click #status-btn-zoomup": _.bind(this.zoomDocument, this, "up"),
                "click .cnt-zoom": _.bind(this.onZoomShow, this)
            };
        },
        onLaunch: function () {
            this.statusbar = this.createView("Statusbar").render();
            this.statusbar.$el.css("z-index", 10);
            this.statusbar.labelZoom.css("min-width", 70);
            this.statusbar.zoomMenu.on("item:click", _.bind(this.menuZoomClick, this));
            this.bindViewEvents(this.statusbar, this.events);
            $("#id-tab-menu-new-color").on("click", _.bind(this.onNewBorderColor, this));
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onZoomChanged", _.bind(this.onZoomChange, this));
            this.api.asc_registerCallback("asc_onSelectionMathChanged", _.bind(this.onApiMathChanged, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiDisconnect, this));
            this.api.asc_registerCallback("asc_onUpdateTabColor", _.bind(this.onApiUpdateTabColor, this));
            this.api.asc_registerCallback("asc_onEditCell", _.bind(this.onApiEditCell, this));
            this.api.asc_registerCallback("asc_onWorkbookLocked", _.bind(this.onWorkbookLocked, this));
            this.api.asc_registerCallback("asc_onWorksheetLocked", _.bind(this.onWorksheetLocked, this));
            this.api.asc_registerCallback("asc_onAuthParticipantsChanged", _.bind(this.onApiUsersChanged, this));
            this.api.asc_registerCallback("asc_onParticipantsChanged", _.bind(this.onApiUsersChanged, this));
            this.api.asc_coAuthoringGetUsers();
            this.statusbar.setApi(api);
        },
        zoomDocument: function (d, e) {
            switch (d) {
            case "up":
                var f = this.api.asc_getZoom() + 0.1; ! (f > 2) && this.api.asc_setZoom(f);
                break;
            case "down":
                f = this.api.asc_getZoom() - 0.1; ! (f < 0.5) && this.api.asc_setZoom(f);
                break;
            }
        },
        menuZoomClick: function (menu, item) {
            this.api.asc_setZoom(item.value / 100);
        },
        onZoomChange: function (percent, type) {
            this.statusbar.labelZoom.text(Common.Utils.String.format(this.zoomText, Math.floor((percent + 0.005) * 100)));
        },
        onApiDisconnect: function () {
            this.statusbar.setMode({
                isDisconnected: true
            });
            this.statusbar.update();
        },
        onWorkbookLocked: function (locked) {
            this.statusbar.tabbar[locked ? "addClass" : "removeClass"]("coauth-locked");
            this.statusbar.btnAddWorksheet.setDisabled(locked || this.statusbar.rangeSelectionMode == c_oAscSelectionDialogType.Chart || this.statusbar.rangeSelectionMode == c_oAscSelectionDialogType.FormatTable);
            var item, i = this.statusbar.tabbar.getCount();
            while (i-->0) {
                item = this.statusbar.tabbar.getAt(i);
                if (item.sheetindex >= 0) {} else {
                    item.disable(locked);
                }
            }
        },
        onWorksheetLocked: function (index, locked) {
            var count = this.statusbar.tabbar.getCount(),
            tab;
            for (var i = count; i-->0;) {
                tab = this.statusbar.tabbar.getAt(i);
                if (index == tab.sheetindex) {
                    tab[locked ? "addClass" : "removeClass"]("coauth-locked");
                    tab.isLockTheDrag = locked || (this.statusbar.rangeSelectionMode == c_oAscSelectionDialogType.FormatTable);
                    break;
                }
            }
        },
        onApiUsersChanged: function (users) {
            var editusers = [];
            _.each(users, function (item) {
                if (!item.asc_getView()) {
                    editusers.push(item);
                }
            });
            var length = _.size(editusers);
            var panel = this.statusbar.panelUsers;
            panel[length > 1 ? "show" : "hide"]();
            this.statusbar.updateTabbarBorders();
            var ttblock = panel.find("#status-users-block");
            if (ttblock.data("bs.tooltip")) {
                ttblock.removeData("bs.tooltip");
            }
            if (length > 1) {
                panel.find("#status-users-count").text(length);
                var tip = this.tipUsers + "<br/><br/>",
                i = 0;
                for (var n in editusers) {
                    tip += "\n" + Common.Utils.String.htmlEncode(editusers[n].asc_getUserName());
                    if (++i > 3) {
                        break;
                    }
                }
                if (length > 4) {
                    tip += "<br/>" + this.tipMoreUsers.replace("%1", length - 4);
                    tip += "<br/><br/>" + this.tipShowUsers;
                }
                ttblock.tooltip({
                    title: tip,
                    html: true,
                    placement: "top"
                });
            }
        },
        onApiMathChanged: function (info) {
            this.statusbar.setMathInfo({
                count: info.asc_getCount(),
                average: info.asc_getAverage(),
                sum: info.asc_getSum()
            });
            this.statusbar.updateTabbarBorders();
        },
        onApiEditCell: function (state) {
            var disable = state != c_oAscCellEditorState.editEnd;
            this.statusbar.btnZoomUp.setDisabled(disable);
            this.statusbar.btnZoomDown.setDisabled(disable);
            this.statusbar.labelZoom[disable ? "addClass" : "removeClass"]("disabled");
        },
        createDelayedElements: function () {
            this.statusbar.$el.css("z-index", "");
            this.statusbar.tabMenu.on("item:click", _.bind(this.onTabMenu, this));
            this.statusbar.btnAddWorksheet.on("click", _.bind(this.onAddWorksheetClick, this));
            Common.NotificationCenter.on("window:resize", _.bind(this.onWindowResize, this));
            Common.NotificationCenter.on("cells:range", _.bind(this.onRangeDialogMode, this));
        },
        onWindowResize: function (area) {
            this.statusbar.onTabInvisible(undefined, this.statusbar.tabbar.checkInvisible(true));
        },
        onRangeDialogMode: function (mode) {
            var islocked = this.statusbar.tabbar.hasClass("coauth-locked"),
            currentIdx = this.api.asc_getActiveWorksheetIndex();
            this.statusbar.btnAddWorksheet.setDisabled(islocked || mode != c_oAscSelectionDialogType.None);
            var item, i = this.statusbar.tabbar.getCount();
            while (i-->0) {
                item = this.statusbar.tabbar.getAt(i);
                if (item.sheetindex !== currentIdx) {
                    item.disable(mode == c_oAscSelectionDialogType.FormatTable);
                }
                item.isLockTheDrag = (item.hasClass("coauth-locked") || (mode != c_oAscSelectionDialogType.None));
            }
            this.statusbar.rangeSelectionMode = mode;
        },
        onTabMenu: function (obj, item, e) {
            switch (item.value) {
            case "ins":
                this.api.asc_insertWorksheet(this.createSheetName());
                break;
            case "del":
                this.deleteWorksheet();
                break;
            case "ren":
                this.renameWorksheet();
                break;
            case "copy":
                this.moveWorksheet(false);
                break;
            case "move":
                this.moveWorksheet(true);
                break;
            case "hide":
                this.hideWorksheet(true);
                break;
            }
        },
        createSheetName: function () {
            var items = [],
            wc = this.api.asc_getWorksheetsCount();
            while (wc--) {
                items.push(this.api.asc_getWorksheetName(wc).toLowerCase());
            }
            var index = 0,
            name;
            while (++index < 1000) {
                name = this.strSheet + index;
                if (items.indexOf(name.toLowerCase()) < 0) {
                    break;
                }
            }
            return name;
        },
        createCopyName: function (orig) {
            var wc = this.api.asc_getWorksheetsCount(),
            names = [];
            while (wc--) {
                names.push(this.api.asc_getWorksheetName(wc).toLowerCase());
            }
            var re = /^(.*)\((\d)\)$/.exec(orig);
            var first = re ? re[1] : orig + " ";
            var index = 1,
            name;
            while (++index < 1000) {
                name = first + "(" + index + ")";
                if (names.indexOf(name.toLowerCase()) < 0) {
                    break;
                }
            }
            return name;
        },
        deleteWorksheet: function () {
            var me = this;
            if (this.statusbar.tabbar.tabs.length == 1) {
                Common.UI.warning({
                    msg: this.errorLastSheet
                });
            } else {
                Common.UI.warning({
                    msg: this.warnDeleteSheet,
                    buttons: ["ok", "cancel"],
                    callback: function (btn) {
                        if (btn == "ok" && !me.api.asc_deleteWorksheet()) {
                            _.delay(function () {
                                Common.UI.error({
                                    msg: me.errorRemoveSheet
                                });
                            },
                            10);
                        }
                    }
                });
            }
        },
        hideWorksheet: function (hide, index) {
            if (hide) {
                this.statusbar.tabbar.tabs.length == 1 ? Common.UI.warning({
                    msg: this.errorLastSheet
                }) : this.api["asc_hideWorksheet"](index);
            } else {
                this.api["asc_showWorksheet"](index);
                this.loadTabColor(index);
            }
        },
        renameWorksheet: function () {
            var me = this;
            var wc = me.api.asc_getWorksheetsCount(),
            items = [];
            if (wc > 0) {
                var sindex = me.api.asc_getActiveWorksheetIndex();
                if (me.api.asc_isWorksheetLockedOrDeleted(sindex)) {
                    return;
                }
                while (wc--) {
                    if (sindex !== wc) {
                        items.push(me.api.asc_getWorksheetName(wc).toLowerCase());
                    }
                }
                var tab = me.statusbar.tabbar.tabs[this.statusbar.tabbar.getActive()];
                var top = me.statusbar.$el.position().top - 115,
                left = tab.$el.offset().left;
                var current = me.api.asc_getWorksheetName(me.api.asc_getActiveWorksheetIndex());
                (new SSE.Views.Statusbar.RenameDialog({
                    current: current,
                    names: items,
                    handler: function (btn, s) {
                        if (btn == "ok" && s != current) {
                            me.api.asc_renameWorksheet(s);
                            tab.setCaption(s);
                            me.statusbar.fireEvent("updatesheetsinfo", me.statusbar);
                        }
                        me.api.asc_enableKeyEvents(true);
                    }
                })).show(left, top);
            }
        },
        moveWorksheet: function (cut, silent, index, destPos) {
            var me = this;
            var wc = me.api.asc_getWorksheetsCount(),
            items = [],
            i = -1;
            while (++i < wc) {
                if (!this.api.asc_isWorksheetHidden(i)) {
                    items.push({
                        value: me.api.asc_getWorksheetName(i),
                        inindex: i
                    });
                }
            }
            if (!_.isUndefined(silent)) {
                me.api.asc_showWorksheet(items[index].inindex);
                Common.NotificationCenter.trigger("comments:updatefilter", {
                    property: "uid",
                    value: new RegExp("^(doc_|sheet" + this.api.asc_getActiveWorksheetId() + "_)")
                });
                if (!_.isUndefined(destPos)) {
                    me.api.asc_moveWorksheet(items.length === destPos ? wc : items[destPos].inindex);
                }
                return;
            } (new SSE.Views.Statusbar.CopyDialog({
                title: cut ? me.statusbar.itemMove : me.statusbar.itemCopy,
                ismove: cut,
                names: items,
                handler: function (btn, i) {
                    if (btn == "ok") {
                        if (cut) {
                            me.api.asc_moveWorksheet(i == -255 ? wc : i);
                        } else {
                            var new_text = me.createCopyName(me.api.asc_getWorksheetName(me.api.asc_getActiveWorksheetIndex()));
                            me.api.asc_copyWorksheet(i == -255 ? wc : i, new_text);
                        }
                    }
                    me.api.asc_enableKeyEvents(true);
                }
            })).show();
        },
        onAddWorksheetClick: function (o, index, opts) {
            if (this.api) {
                this.api.asc_closeCellEditor();
                this.api.asc_addWorksheet(this.createSheetName());
                Common.NotificationCenter.trigger("comments:updatefilter", {
                    property: "uid",
                    value: new RegExp("^(doc_|sheet" + this.api.asc_getActiveWorksheetId() + "_)")
                },
                false);
            }
            Common.NotificationCenter.trigger("edit:complete", this.statusbar);
        },
        selectTab: function (sheetindex) {
            if (this.api) {
                var hidden = this.api.asc_isWorksheetHidden(sheetindex);
                if (!hidden) {
                    var tab = _.findWhere(this.statusbar.tabbar.tabs, {
                        sheetindex: sheetindex
                    });
                    if (tab) {
                        this.statusbar.tabbar.setActive(tab);
                    }
                }
            }
        },
        moveCurrentTab: function (direction) {
            if (this.api) {
                var indTab = 0,
                tabBar = this.statusbar.tabbar,
                index = this.api.asc_getActiveWorksheetIndex(),
                length = tabBar.tabs.length;
                this.statusbar.tabMenu.hide();
                this.api.asc_closeCellEditor();
                for (var i = 0; i < length; ++i) {
                    if (tabBar.tabs[i].sheetindex === index) {
                        indTab = i;
                        if (direction > 0) {
                            indTab++;
                            if (indTab >= length) {
                                indTab = 0;
                            }
                        } else {
                            indTab--;
                            if (indTab < 0) {
                                indTab = length - 1;
                            }
                        }
                        tabBar.setActive(indTab);
                        this.api.asc_showWorksheet(tabBar.getAt(indTab).sheetindex);
                        break;
                    }
                }
            }
        },
        onApiUpdateTabColor: function (index) {
            this.loadTabColor(index);
        },
        setWorksheetColor: function (color) {
            if (this.api) {
                var sindex = this.api.asc_getActiveWorksheetIndex();
                var tab = _.findWhere(this.statusbar.tabbar.tabs, {
                    sheetindex: sindex
                });
                if (tab) {
                    if ("transparent" === color) {
                        this.api.asc_setWorksheetTabColor(sindex, null);
                        tab.$el.find("a").css("box-shadow", "");
                    } else {
                        var asc_clr = Common.Utils.ThemeColor.getRgbColor(color);
                        if (asc_clr) {
                            this.api.asc_setWorksheetTabColor(sindex, asc_clr);
                            this.setTabLineColor(tab, asc_clr);
                        }
                    }
                }
            }
        },
        updateThemeColors: function () {
            var updateColors = function (picker, defaultColorIndex) {
                if (picker) {
                    var clr, effectcolors = Common.Utils.ThemeColor.getEffectColors();
                    for (var i = 0; i < effectcolors.length; ++i) {
                        if (typeof(picker.currentColor) == "object" && clr === undefined && picker.currentColor.effectId == effectcolors[i].effectId) {
                            clr = effectcolors[i];
                        }
                    }
                    picker.updateColors(effectcolors, Common.Utils.ThemeColor.getStandartColors());
                    if (picker.currentColor === undefined) {
                        picker.currentColor = effectcolors[defaultColorIndex];
                    } else {
                        if (clr !== undefined) {
                            picker.currentColor = clr;
                        }
                    }
                }
            };
            if (this.statusbar) {
                updateColors(this.statusbar.mnuTabColor, 1);
            }
        },
        onNewBorderColor: function () {
            if (this.statusbar && this.statusbar.mnuTabColor) {
                this.statusbar.mnuTabColor.addNewColor();
            }
        },
        updateTabsColors: function (updateCurrentColor) {
            var i = -1,
            tabind = -1,
            color = null,
            clr = null,
            ishidden = false,
            wc = this.api.asc_getWorksheetsCount(),
            sindex = this.api.asc_getActiveWorksheetIndex();
            if (!_.isUndefined(updateCurrentColor)) {
                var toolbarController = this.application.getController("Toolbar");
                if (toolbarController) {
                    this.statusbar.mnuTabColor.updateCustomColors();
                    color = this.api.asc_getWorksheetTabColor(sindex);
                    if (color) {
                        if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                            clr = {
                                color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                effectValue: color.get_value()
                            };
                        } else {
                            clr = Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                        }
                    }
                    if (_.isObject(clr)) {
                        var isselected = false;
                        for (i = 0; i < 10; i++) {
                            if (Common.Utils.ThemeColor.ThemeValues[i] === clr.effectValue) {
                                this.statusbar.mnuTabColor.select(clr, true);
                                isselected = true;
                                break;
                            }
                        }
                        if (!isselected) {
                            this.statusbar.mnuTabColor.clearSelection();
                        }
                    } else {
                        this.statusbar.mnuTabColor.select(clr || "transparent", true);
                    }
                }
            }
            i = -1;
            while (++i < wc) {
                ++tabind;
                ishidden = this.api.asc_isWorksheetHidden(i);
                if (ishidden) {
                    --tabind;
                }
                if (!ishidden) {
                    this.setTabLineColor(this.statusbar.tabbar.getAt(tabind), this.api.asc_getWorksheetTabColor(i));
                }
            }
        },
        loadTabColor: function (sheetindex) {
            if (this.api) {
                if (!this.api.asc_isWorksheetHidden(sheetindex)) {
                    var tab = _.findWhere(this.statusbar.tabbar.tabs, {
                        sheetindex: sheetindex
                    });
                    if (tab) {
                        this.setTabLineColor(tab, this.api.asc_getWorksheetTabColor(sheetindex));
                    }
                }
            }
        },
        setTabLineColor: function (tab, color) {
            if (tab) {
                if (null !== color) {
                    color = "#" + Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                } else {
                    color = "";
                }
                if (color.length) {
                    if (!tab.isActive()) {
                        color = "0px 3px 0 " + Common.Utils.RGBColor(color).toRGBA(0.7) + " inset";
                    } else {
                        color = "0px 3px 0 " + color + " inset";
                    }
                    tab.$el.find("a").css("box-shadow", color);
                } else {
                    tab.$el.find("a").css("box-shadow", "");
                }
            }
        },
        onZoomShow: function (e) {
            if (e.target.classList.contains("disabled")) {
                return false;
            }
        },
        tipUsers: "Document is in the collaborative editing mode.",
        tipMoreUsers: "and %1 users.",
        tipShowUsers: "To see all users click the icon below.",
        zoomText: "Zoom {0}%",
        errorLastSheet: "Workbook must have at least one visible worksheet.",
        errorRemoveSheet: "Can't delete the worksheet.",
        warnDeleteSheet: "The worksheet maybe has data. Proceed operation?",
        strSheet : "Sheet"
    },
    SSE.Controllers.Statusbar || {}));
});