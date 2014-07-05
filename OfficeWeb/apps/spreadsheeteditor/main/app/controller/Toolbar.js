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
 Ext.define("SSE.controller.Toolbar", {
    extend: "Ext.app.Controller",
    requires: ["Common.view.ImageFromUrlDialog", "Common.view.CopyWarning", "SSE.view.HyperlinkSettings"],
    uses: ["SSE.view.TableOptionsDialog"],
    stores: ["TableTemplates"],
    views: ["Toolbar"],
    refs: [{
        ref: "toolbar",
        selector: "ssetoolbar"
    },
    {
        ref: "btnHorizontalAlign",
        selector: "#toolbar-button-halign"
    },
    {
        ref: "btnVerticalAlign",
        selector: "#toolbar-button-valign"
    },
    {
        ref: "btnNumberFormat",
        selector: "#toolbar-button-num-format"
    },
    {
        ref: "btnBorders",
        selector: "#toolbar-button-borders"
    },
    {
        ref: "btnInsertShape",
        selector: "#toolbar-button-insertshape"
    },
    {
        ref: "menuHideOptions",
        selector: "#toolbar-menu-app-hide"
    },
    {
        ref: "listStyles",
        selector: "#toolbar-combo-viewstyles"
    }],
    init: function () {
        this.control({
            "ssetoolbar": {
                afterrender: function (cmp) {
                    Ext.FocusManager.unsubscribe(cmp);
                }
            },
            "#toolbar-menu-merge": {
                click: this._handleMergeCellsMenu
            },
            "#toolbar-button-insert-hyperlink": {
                click: function (btn) {
                    this._handleHyperlinkOptions();
                    Common.component.Analytics.trackEvent("ToolBar", "Add Hyperlink");
                }
            },
            "menuitem[action=insert-hyperlink]": {
                click: function (btn) {
                    this._handleHyperlinkOptions();
                }
            },
            "#toolbar-menuitem-print": {
                click: function (item, opt) {
                    this._handleSimpleAction({
                        action: "Print"
                    });
                }
            },
            "#toolbar-menu-insertimage": {
                click: function (menu, item, opt) {
                    if (item.from == "file") {
                        if (this.api) {
                            this.api.asc_showImageFileDialog();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Image");
                    } else {
                        this._handleImageFromURL();
                    }
                },
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "#toolbar-menu-horalign": {
                click: this._handleMenuHorizontalAlign
            },
            "button[toggleGroup=alignGroup]": {
                click: this._handleButtonHorizontalAlign
            },
            "#toolbar-menu-vertalign": {
                click: this._handleMenuVerticalAlign
            },
            "button[toggleGroup=vAlignGroup]": {
                click: this._handleButtonVerticalAlign
            },
            "#toolbar-menu-horalign menuitem": {
                beforecheckchange: function (item) {
                    if (!item.checked) {
                        var items = this.getBtnHorizontalAlign().menu.items.items;
                        for (var n in items) {
                            items[n].setChecked(false, true);
                        }
                    }
                }
            },
            "#toolbar-menu-clearstyle": {
                click: function (menu, item, opt) {
                    if (!item.isDisabled()) {
                        this.api.asc_emptyCells(item.action);
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
                            checkorder: true
                        });
                        Common.component.Analytics.trackEvent("ToolBar", "Clear");
                    } else {
                        opt.stopEvent();
                    }
                }
            },
            "#toolbar-menu-borders": {
                click: this._handleBordersMenu
            },
            "#toolbar-button-borders": {
                click: function (btn) {
                    var item = btn.menu.items.get(btn.menu.items.findIndex("icls", btn.icls));
                    if (item) {
                        this._handleBordersMenu(btn.menu, item);
                    }
                }
            },
            "#toolbar-menu-borders-width": {
                click: function (menu, item, opt) {
                    Ext.menu.Manager.get("toolbar-menu-borders-width").hide();
                    this.getBtnBorders().borderswidth = item.value;
                    Common.component.Analytics.trackEvent("ToolBar", "Border Width");
                }
            },
            "#toolbar-menu-borders-color": {
                select: function (picker, color, opts) {
                    $("#picker-borders-color").css("border-color", Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color));
                    picker.ownerCt.hide();
                    this.getBtnBorders().borderscolor = this.getRgbColor(color);
                    this.getToolbar().colorsBorder.currentColor = color;
                    Common.component.Analytics.trackEvent("ToolBar", "Border Color");
                }
            },
            "button[group=simple-toggle]": {
                toggle: this._toggleSimpleAction
            },
            "button[group=simple-click]": {
                click: this._handleSimpleAction
            },
            "#toolbar-combo-fonts": {
                select: function (combo, records, eOpts) {
                    this.api.asc_setCellFontName(records[0].data.name);
                    Common.component.Analytics.trackEvent("ToolBar", "Font Family");
                },
                collapse: function (field, opts) {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
                        checkorder: true
                    });
                },
                render: function (obj) {
                    this.getController("Common.controller.Fonts").fillFonts();
                }
            },
            "#toolbar-combo-font-size": {
                select: this._fontsizeSelect,
                beforequery: this._fontsizeBeforeQuery,
                collapse: this._fontsizeCollapse,
                specialkey: this._fontsizeSpecialKey
            },
            "button[group=copy-paste]": {
                click: function (btn) {
                    this.handleCopyPaste({
                        action: btn.action
                    });
                }
            },
            "menuitem[group=copy-paste]": {
                click: function (item) {
                    this.handleCopyPaste({
                        action: item.action
                    });
                }
            },
            "#toolbar-menu-autofilter": {
                click: function (menu, item, opt) {
                    if (item.direction) {
                        this.api.asc_sortColFilter(item.direction, "");
                    } else {
                        if (item.action == "set-filter") {
                            var result = this.api.asc_addAutoFilter();
                            item.setChecked(result == true);
                        }
                    }
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "button[group=sort]": {
                click: this._handleButtonSort
            },
            "button[action=number-format]": {
                click: this._handleNumberFormatButton
            },
            "#toolbar-menu-color-schemas": {
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "#toolbar-button-newdocument": {
                click: function (btn) {
                    this.api.asc_openNewDocument();
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    Common.component.Analytics.trackEvent("ToolBar", "New Document");
                }
            },
            "#toolbar-button-opendocument": {
                click: function (btn) {
                    this.api.asc_loadDocumentFromDisk();
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    Common.component.Analytics.trackEvent("ToolBar", "Open Document");
                }
            },
            "#toolbar-menu-app-hide": {
                click: this._handleMenuAppHide
            },
            "#toolbar-button-settings": {
                click: function () {
                    Ext.menu.Manager.hideAll();
                    var needhide = false;
                    var cmp = Ext.getCmp("main-menu-file-options");
                    if (cmp) {
                        if (cmp.activeBtn === cmp.btnDocumentSettings) {
                            needhide = true;
                        }
                        cmp.activeBtn = cmp.btnDocumentSettings;
                    }
                    var mnucmp = Ext.getCmp("view-main-menu");
                    if (mnucmp) {
                        if (mnucmp.currentFullScaleMenuBtn == undefined || mnucmp.currentFullScaleMenuBtn.id != "id-menu-file") {
                            mnucmp.selectMenu("menuFile");
                        } else {
                            if (needhide) {
                                mnucmp.closeFullScaleMenu();
                            } else {
                                cmp._onShow();
                            }
                        }
                    }
                }
            },
            "#toolbar-menu-text-orientation": {
                click: this._handleMenuTextOrientation
            },
            "menu[group=picker-autoshapes]": {
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                },
                show: function (cmp) {
                    cmp.picker.selectByIndex(-1, false);
                }
            },
            "#toolbar-menu-insertshape": {
                hide: function () {
                    if (this.getBtnInsertShape().pressed && !this._isAddingShape && this._toggleFromMenuHide) {
                        this._toggleFromMenuHide = false;
                        this.getBtnInsertShape().toggle(false, false);
                    }
                    this._isAddingShape = false;
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                },
                show: function () {
                    this._toggleFromMenuHide = true;
                }
            },
            "#toolbar-button-insertshape": {
                click: {
                    fn: this._clickButtonAutoshape,
                    action: "insert-shape"
                },
                afterrender: function (btn) {
                    btn.getEl().on("mousedown", function (event, element, eOpts) {
                        this._toggleFromMenuHide = false;
                    },
                    this);
                }
            },
            "#toolbar-button-inserttext": {
                click: {
                    fn: this._clickButtonAutoshape,
                    action: "insert-text"
                }
            },
            "#toolbar-menu-zoomin": {
                click: function () {
                    if (this.api) {
                        var f = this.api.asc_getZoom() + 0.1;
                        if (f > 0 && !(f > 2)) {
                            this.api.asc_setZoom(f);
                        }
                    }
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "#toolbar-menu-zoomout": {
                click: function () {
                    if (this.api) {
                        var f = this.api.asc_getZoom() - 0.1;
                        if (! (f < 0.5)) {
                            this.api.asc_setZoom(f);
                        }
                    }
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "#toolbar-menu-zoom-text": {
                afterrender: function (ct) {
                    ct.setWidth(Ext.util.TextMetrics.measure(ct.getEl(), "100%").width);
                }
            },
            "button[group=font-size]": {
                click: this._btnChangeFontSize
            },
            "#toolbar-combo-viewstyles": {
                select: this.onCellStyleSelect,
                menuhide: function (obj, menu) {
                    if (menu.getPosition()[0] > -1000) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                releasecapture: function (cnt) {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                },
                render: function (o) {},
                afterrender: function (o) {
                    if (this.getListStyles().dataMenu.picker.store.getCount() > 0) {
                        this.getListStyles().fillComboView(this.getListStyles().dataMenu.picker.store.getAt(0), true);
                    }
                }
            },
            "tabbar": {
                change: this.onSheetChanged
            },
            "commonextendedcolordialog": {
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            }
        });
        this.hotKeys = new Ext.util.KeyMap(document, [{
            key: "k",
            ctrl: true,
            shift: false,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (!this.api.isCellEdited && canHotKey()) {
                    this._handleHyperlinkOptions();
                }
            },
            scope: this
        }]);
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onInitTablePictures", Ext.bind(this._onInitTableTemplates, this));
        this.api.asc_registerCallback("asc_onInitEditorStyles", Ext.bind(this._onInitEditorStyles, this));
    },
    _handleHyperlinkOptions: function () {
        var me = this;
        var win, props;
        if (me.api) {
            var wc = me.api.asc_getWorksheetsCount(),
            i = -1;
            var items = [];
            while (++i < wc) {
                if (!this.api.asc_isWorksheetHidden(i)) {
                    items.push([me.api.asc_getWorksheetName(i)]);
                }
            }
            var cell = me.api.asc_getCellInfo();
            props = cell.asc_getHyperlink();
            win = Ext.widget("ssehyperlinksettings", {
                sheets: items
            });
            win.setSettings(props, cell.asc_getText(), cell.asc_getFlags().asc_getLockText());
        }
        if (win) {
            win.addListener("onmodalresult", function (o, mr) {
                if (mr == 1) {
                    props = win.getSettings();
                    me.api.asc_insertHyperlink(props);
                }
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            },
            false);
            win.show();
        }
    },
    _handleImageFromURL: function () {
        var me = this;
        var w = Ext.create("Common.view.ImageFromUrlDialog", {});
        w.addListener("close", function (cnt, eOpts) {
            me.getToolbar().fireEvent("editcomplete", me.getToolbar());
        });
        w.addListener("onmodalresult", function (mr) {
            var url = w.txtUrl;
            if (mr == 1 && me.api) {
                var checkurl = url.value.replace(/ /g, "");
                if (checkurl != "") {
                    me.api.asc_addImageDrawingObject(url.value);
                    Common.component.Analytics.trackEvent("ToolBar", "Image");
                }
            }
        },
        false);
        w.show();
    },
    _handleMergeCellsMenu: function (menu, item, opt) {
        var me = this;
        function domergecells(how) {
            me.api.asc_mergeCells(how);
            me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Merge");
        }
        if (me.api) {
            var merged = me.api.asc_getCellInfo().asc_getFlags().asc_getMerge();
            if (!merged && me.api.asc_mergeCellsDataLost(item.action)) {
                Ext.create("Ext.window.MessageBox", {
                    buttonText: {
                        ok: "OK",
                        yes: "Yes",
                        no: "No",
                        cancel: this.textCancel
                    }
                }).show({
                    title: this.textWarning,
                    msg: this.warnMergeLostData,
                    icon: Ext.Msg.WARNING,
                    buttons: Ext.Msg.OKCANCEL,
                    fn: function (btn, text) {
                        btn == "ok" && (domergecells(item.action));
                    }
                });
            } else {
                domergecells(item.action);
            }
        }
    },
    _handleMenuHorizontalAlign: function (menu, item, opt) {
        this.getBtnHorizontalAlign().removeCls(this.getBtnHorizontalAlign().icls);
        this.getBtnHorizontalAlign().icls = !item.checked ? "halign-left" : item.icls;
        this.getBtnHorizontalAlign().addCls(this.getBtnHorizontalAlign().icls);
        this.api.asc_setCellAlign(!item.checked ? "none" : item.halign);
        this.getToolbar().btnWrap.allowDepress = !(item.halign == "justify");
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Horizontal Align");
    },
    _handleButtonHorizontalAlign: function (obj, event, opts) {
        if (!obj.pressed) {
            this.api.asc_setCellAlign("left");
        } else {
            switch (obj.initialConfig.cls) {
            case "halign-left":
                var align = "left";
                break;
            case "halign-right":
                align = "right";
                break;
            case "halign-center":
                align = "center";
                break;
            case "halign-just":
                align = "justify";
                break;
            }
            this.api.asc_setCellAlign(align);
        }
        this.getToolbar().btnWrap.allowDepress = !(align == "justify");
    },
    _handleMenuVerticalAlign: function (menu, item, opt) {
        if (this.api) {
            this.api.asc_setCellVertAlign(item.valign);
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Vertical Align");
    },
    _handleButtonVerticalAlign: function (obj, event, opts) {
        if (!obj.pressed) {
            this.api.asc_setCellVertAlign("bottom");
        } else {
            switch (obj.initialConfig.cls) {
            case "valign-top":
                var align = "top";
                break;
            case "valign-middle":
                align = "center";
                break;
            case "valign-bottom":
                align = "bottom";
                break;
            }
            this.api.asc_setCellVertAlign(align);
        }
    },
    _handleNumberFormatMenu: function (menu, item, opt) {
        if (item.menu == undefined) {
            if (this.api) {
                this.api.asc_setCellFormat(item.formatId);
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Number Format");
        }
    },
    _handleNumberFormatButton: function (btn, event, opt) {
        this.api.asc_setCellFormat(btn.formatId);
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Number Format");
    },
    getRgbColor: function (clr) {
        var color = (typeof(clr) == "object") ? clr.color : clr;
        color = color.replace(/#/, "");
        if (color.length == 3) {
            color = color.replace(/(.)/g, "$1$1");
        }
        color = parseInt(color, 16);
        var c = new CAscColor();
        c.put_type((typeof(clr) == "object") ? c_oAscColor.COLOR_TYPE_SCHEME : c_oAscColor.COLOR_TYPE_SRGB);
        c.put_r(color >> 16);
        c.put_g((color & 65280) >> 8);
        c.put_b(color & 255);
        c.put_a(255);
        if (clr.effectId !== undefined) {
            c.put_value(clr.effectId);
        }
        return c;
    },
    _handleBordersMenu: function (menu, item, opt) {
        var me = this;
        if (me.api && item.borderId !== undefined) {
            me.getBtnBorders().removeCls(me.getBtnBorders().icls);
            me.getBtnBorders().addCls(item.icls);
            me.getBtnBorders().icls = item.icls;
            var new_borders = [];
            if (item.borderId == "inner") {
                new_borders[c_oAscBorderOptions.InnerV] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                new_borders[c_oAscBorderOptions.InnerH] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
            } else {
                if (item.borderId == "all") {
                    new_borders[c_oAscBorderOptions.InnerV] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                    new_borders[c_oAscBorderOptions.InnerH] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                    new_borders[c_oAscBorderOptions.Left] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                    new_borders[c_oAscBorderOptions.Top] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                    new_borders[c_oAscBorderOptions.Right] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                    new_borders[c_oAscBorderOptions.Bottom] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                } else {
                    if (item.borderId == "outer") {
                        new_borders[c_oAscBorderOptions.Left] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                        new_borders[c_oAscBorderOptions.Top] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                        new_borders[c_oAscBorderOptions.Right] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                        new_borders[c_oAscBorderOptions.Bottom] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                    } else {
                        if (item.borderId != "none") {
                            new_borders[item.borderId] = new Asc.asc_CBorder(me.getBtnBorders().borderswidth, me.getBtnBorders().borderscolor);
                        }
                    }
                }
            }
            me.api.asc_setCellBorders(new_borders);
        }
        me.getToolbar().fireEvent("editcomplete", me.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Borders");
    },
    _handleSimpleAction: function (obj) {
        var analytic_cm, toggle_fn, fn;
        switch (obj.action) {
        case "Save":
            fn = "asc_Save";
            analytic_cm = "Save";
            break;
        case "Print":
            fn = "asc_Print";
            analytic_cm = "Print";
            break;
        case "Undo":
            fn = "asc_Undo";
            var extras = {
                checkorder: true
            };
            break;
        case "Redo":
            fn = "asc_Redo";
            extras = {
                checkorder: true
            };
            break;
        case "Decrement":
            fn = "asc_decreaseCellDigitNumbers";
            break;
        case "Increment":
            fn = "asc_increaseCellDigitNumbers";
            break;
        case "Filter":
            fn = "asc_addAutoFilter";
            break;
        default:
            return;
        }
        if (this.api && fn) {
            this.api[fn]();
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), extras);
        if (analytic_cm) {
            Common.component.Analytics.trackEvent(analytic_cm);
        }
        Common.component.Analytics.trackEvent("ToolBar", obj.action);
    },
    _toggleSimpleAction: function (btn) {
        var analytic_cm, toggle_fn;
        switch (btn.action) {
        case "Bold":
            toggle_fn = "asc_setCellBold";
            break;
        case "Italic":
            toggle_fn = "asc_setCellItalic";
            break;
        case "Underline":
            toggle_fn = "asc_setCellUnderline";
            break;
        case "Wrap":
            toggle_fn = "asc_setCellTextWrap";
            break;
        default:
            return;
        }
        if (this.api && toggle_fn) {
            this.api[toggle_fn](btn.pressed);
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
            checkorder: true
        });
        if (analytic_cm) {
            Common.component.Analytics.trackEvent(analytic_cm);
        }
        Common.component.Analytics.trackEvent("ToolBar", btn.action);
    },
    _getApiTextSize: function (info) {
        return info ? info.asc_getFont().asc_getSize() : 12;
    },
    _fontsizeCollapse: function (field, eOpts) {
        if (!field.eventsSuspended) {
            var raw_value = field.getRawValue(),
            api_value = this._getApiTextSize(this.api.asc_getCellInfo());
            if (api_value && raw_value != api_value) {
                field.getStore().clearFilter(false);
                field.setValue(api_value);
            }
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
            checkorder: true
        });
    },
    _fontsizeSelect: function (combo, records, eOpts) {
        if (this.api) {
            this.api.asc_setCellFontSize(records[0].data.sizevalue);
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
            checkorder: true
        });
        Common.component.Analytics.trackEvent("ToolBar", "Font Size");
    },
    _fontsizeBeforeQuery: function (event, eOpts) {
        event.forceAll = true;
        event.cancel = true;
        event.combo.expand();
        var picker = event.combo.getPicker();
        var index = event.combo.store.find("sizestring", event.query, undefined, undefined, undefined, true);
        if (! (index < 0)) {
            var record = event.combo.store.getAt(index);
            (record = picker.getNode(record)) && picker.highlightItem(record);
        } else {
            picker.clearHighlight();
            picker.highlightedItem = undefined;
        }
    },
    _fontsizeSpecialKey: function (combo, event, eOpts) {
        if (event.getKey() == event.ENTER) {
            var record = combo.getPicker().highlightedItem,
            readsize = false;
            if (record) {
                var value = [combo.getPicker().getRecord(record).data.sizestring];
            } else {
                value = /^\+?(\d*\.?\d+)$|^\+?(\d+\.?\d*)$/.exec(combo.getValue());
                if (!value) {
                    value = this._getApiTextSize(this.api.asc_getCellInfo());
                    readsize = true;
                } else {
                    value = value[0] ? parseFloat(value[0]) : parseFloat(value[1]);
                    value = value > 100 ? 100 : value < 1 ? 1 : Math.floor((value + 0.4) * 2) / 2;
                }
            }
            combo.suspendEvents(false);
            combo.getStore().clearFilter(false);
            combo.setRawValue(value);
            combo.collapse();
            if (!readsize) {
                this.api.asc_setCellFontSize(value);
                this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
                    checkorder: true
                });
            } else {
                Ext.Msg.show({
                    title: this.textWarning,
                    msg: this.textFontSizeErr,
                    icon: Ext.Msg.WARNING,
                    buttons: Ext.Msg.OK,
                    scope: this,
                    fn: function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), {
                            checkorder: true
                        });
                    }
                });
            }
            combo.resumeEvents();
        }
    },
    handleCopyPaste: function (opts) {
        var func = opts.action == "copy" ? "asc_Copy" : opts.action == "paste" ? "asc_Paste" : "asc_Cut";
        var me = this;
        if (!me.api[func]()) {
            Ext.create("Common.view.CopyWarning", {
                listeners: {
                    close: function (cnt, eOpts) {
                        me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                    }
                }
            }).show();
            Common.component.Analytics.trackEvent("ToolBar", "Copy Warning");
        }
    },
    _onCanRevert: function (can, btn) {
        this.getToolbar()[btn == "undo" ? "btnUndo" : "btnRedo"].setDisabled(!can);
    },
    _onTemplatesStoreDataChanged: function () {},
    _onInitTableTemplates: function (images) {
        var store = this.getTableTemplatesStore();
        if (store) {
            var in_array = [];
            images.forEach(function (item, index, array) {
                in_array.push({
                    name: item.asc_getName(),
                    caption: item.asc_getDisplayName(),
                    type: item.asc_getType(),
                    imageUrl: item.asc_getImage()
                });
            });
            store.removeAll();
            store.add(in_array);
        }
    },
    _onEditCell: function (state) {
        var toolbar = this.getToolbar();
        if (state == c_oAscCellEditorState.editStart || state == c_oAscCellEditorState.editEnd) {
            var is_cell_edited = (state == c_oAscCellEditorState.editStart);
            toolbar.btnInsertHyperlink.setDisabled(is_cell_edited);
            toolbar.btnPrint.setDisabled(is_cell_edited);
            toolbar.btnParagraphColor.setDisabled(is_cell_edited);
            toolbar.btnVerticalAlign.setDisabled(is_cell_edited);
            toolbar.btnHorizontalAlign.setDisabled(is_cell_edited);
            toolbar.btnBorders.setDisabled(is_cell_edited);
            toolbar.btnAlignLeft.setDisabled(is_cell_edited);
            toolbar.btnAlignCenter.setDisabled(is_cell_edited);
            toolbar.btnAlignRight.setDisabled(is_cell_edited);
            toolbar.btnAlignJust.setDisabled(is_cell_edited);
            toolbar.btnAlignJust.setDisabled(is_cell_edited);
            toolbar.btnAlignTop.setDisabled(is_cell_edited);
            toolbar.btnAlignMiddle.setDisabled(is_cell_edited);
            toolbar.btnAlignBottom.setDisabled(is_cell_edited);
            toolbar.btnTextOrient.setDisabled(is_cell_edited);
            toolbar.btnMerge.setDisabled(is_cell_edited);
            toolbar.btnInsertImage.setDisabled(is_cell_edited);
            toolbar.btnInsertHyperlink.setDisabled(is_cell_edited);
            toolbar.btnInsertText.setDisabled(is_cell_edited);
            toolbar.btnInsertShape.setDisabled(is_cell_edited);
            toolbar.btnSortDown.setDisabled(is_cell_edited);
            toolbar.btnSortUp.setDisabled(is_cell_edited);
            toolbar.btnTableTemplate.setDisabled(is_cell_edited);
            toolbar.btnSetAutofilter.setDisabled(is_cell_edited);
            toolbar.btnPercentStyle.setDisabled(is_cell_edited);
            toolbar.btnCurrencyStyle.setDisabled(is_cell_edited);
            toolbar.btnDecDecimal.setDisabled(is_cell_edited);
            toolbar.btnIncDecimal.setDisabled(is_cell_edited);
            toolbar.btnAddCell.setDisabled(is_cell_edited);
            toolbar.btnDeleteCell.setDisabled(is_cell_edited);
            toolbar.btnNumberFormat.setDisabled(is_cell_edited);
            toolbar.btnWrap.setDisabled(is_cell_edited);
            toolbar.btnClearStyle.menu.items.items[1].setDisabled(is_cell_edited);
            toolbar.btnClearStyle.menu.items.items[2].setDisabled(is_cell_edited);
            toolbar.btnAutofilter.setDisabled(is_cell_edited);
            toolbar.btnShowMode.setDisabled(is_cell_edited);
            toolbar.btnSettings.setDisabled(is_cell_edited);
            toolbar.listStyles.setDisabled(is_cell_edited);
            if (!is_cell_edited) {
                toolbar.cmbFont.setDisabled(false);
                toolbar.cmbFontSize.setDisabled(false);
                toolbar.btnIncFontSize.setDisabled(false);
                toolbar.btnDecFontSize.setDisabled(false);
                toolbar.btnBold.setDisabled(false);
                toolbar.btnItalic.setDisabled(false);
                toolbar.btnUnderline.setDisabled(false);
                toolbar.btnFontColor.setDisabled(false);
                toolbar.btnInsertFormula.setDisabled(false);
            }
        } else {
            if (state == c_oAscCellEditorState.editText) {
                var is_text = true,
                is_formula = false;
            } else {
                if (state == c_oAscCellEditorState.editFormula) {
                    is_text = !(is_formula = true);
                } else {
                    if (state == c_oAscCellEditorState.editEmptyCell) {
                        is_text = is_formula = false;
                    }
                }
            }
            toolbar.cmbFont.setDisabled(is_formula);
            toolbar.cmbFontSize.setDisabled(is_formula);
            toolbar.btnIncFontSize.setDisabled(is_formula);
            toolbar.btnDecFontSize.setDisabled(is_formula);
            toolbar.btnBold.setDisabled(is_formula);
            toolbar.btnItalic.setDisabled(is_formula);
            toolbar.btnUnderline.setDisabled(is_formula);
            toolbar.btnFontColor.setDisabled(is_formula);
            toolbar.btnInsertFormula.setDisabled(is_text);
        }
        this.checkInsertAutoshape({},
        {
            action: "cancel"
        });
    },
    _handleMenuAppHide: function (menu, item, opt) {
        var params = {},
        str_item;
        switch (item.action) {
        case "title":
            params.title = item.checked;
            str_item = "sse-hidden-title";
            break;
        case "compact":
            params.compact = item.checked;
            str_item = "sse-toolbar-compact";
            break;
        case "formula":
            params.formula = item.checked;
            str_item = "sse-hidden-formula";
            break;
        case "headings":
            params.headings = item.checked;
            break;
        case "gridlines":
            params.gridlines = item.checked;
            break;
        }
        this.hideElements(params);
        str_item && localStorage.setItem(str_item, item.checked);
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
    },
    hideElements: function (opts, setcheck) {
        var menu = this.getMenuHideOptions();
        if (opts.title !== undefined) {
            var targetbar = Ext.ComponentQuery.query("commonheader")[0];
            targetbar[opts.title ? "hide" : "show"]();
            if (setcheck) {
                menu.items.getAt(1).setChecked(opts.title);
            }
        }
        if (opts.compact !== undefined) {
            this.changeViewMode(opts.compact);
            if (setcheck) {
                menu.items.getAt(0).setChecked(opts.compact);
            }
        }
        if (opts.formula !== undefined) {
            var component = Ext.ComponentQuery.query("ssecellinfo")[0];
            var splitter = Ext.ComponentQuery.query("#field-formula-splitter")[0];
            var holder = Ext.ComponentQuery.query("ssedocumentholder")[0];
            if (opts.formula) {
                component.lastHeight = component.getHeight();
                component.hide();
                splitter.hide();
                holder.removeCls("top-border");
            } else {
                component.setHeight(component.lastHeight || 23);
                component.show();
                splitter.show();
                holder.addCls("top-border");
            }
            if (setcheck) {
                menu.items.getAt(2).setChecked(opts.formula);
            }
        }
        if (opts.headings !== undefined) {
            if (this.api) {
                var current = this.api.asc_getSheetViewSettings();
                current.asc_setShowRowColHeaders(!opts.headings);
                this.api.asc_setSheetViewSettings(current);
            }
        }
        if (opts.gridlines !== undefined) {
            if (this.api) {
                current = this.api.asc_getSheetViewSettings();
                current.asc_setShowGridLines(!opts.gridlines);
                this.api.asc_setSheetViewSettings(current);
            }
        }
    },
    _handleButtonSort: function (btn, event) {
        this.api.asc_sortColFilter(btn.direction, "");
    },
    _handleMenuTextOrientation: function (menu, item, opt) {
        var angle = 0;
        switch (item.angle) {
        case "countcw":
            angle = 45;
            break;
        case "clockwise":
            angle = -45;
            break;
        case "rotateup":
            angle = 90;
            break;
        case "rotatedown":
            angle = -90;
            break;
        }
        this.api.asc_setCellAngle(angle);
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
    },
    onCoAuthoringDisconnect: function () {
        this.hotKeys.disable();
        this.getToolbar().setMode({
            isDisconnected: true
        });
    },
    FillAutoShapes: function () {
        var me = this;
        var shapesStore = Ext.getStore("ShapeGroups");
        me.getBtnInsertShape().menu.removeAll();
        for (var i = 0; i < shapesStore.getCount() - 1; i++) {
            var shapeGroup = shapesStore.getAt(i);
            var menugroup = Ext.widget("menuitem", {
                hideOnClick: false,
                text: shapeGroup.data.groupName,
                cls: "menu-item-noicon",
                menu: Ext.create("Common.component.MenuDataViewPicker", {
                    width: shapeGroup.data.groupWidth,
                    height: shapeGroup.data.groupHeight,
                    store: shapeGroup.data.groupStore,
                    group: "picker-autoshapes",
                    viewData: [],
                    contentWidth: shapeGroup.data.groupWidth - 20,
                    listeners: {
                        select: function (picker, record) {
                            me._addAutoshape(true, record.get("data").shapeType);
                            me._isAddingShape = true;
                            Common.component.Analytics.trackEvent("ToolBar", "Add Shape");
                        }
                    },
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                })
            });
            me.getBtnInsertShape().menu.add(menugroup);
        }
    },
    _onEndAddShape: function () {
        if (this.getBtnInsertShape().pressed) {
            this.getBtnInsertShape().toggle(false, true);
        }
        if (this.getToolbar().btnInsertText.pressed) {
            this.getToolbar().btnInsertText.toggle(false, true);
        }
    },
    _clickButtonAutoshape: function (btn, event, opts) {
        if (opts.action == "insert-text") {
            this._addAutoshape(btn.pressed, "textRect");
            Ext.ComponentQuery.query("ssedocumentholder")[0].focus();
            if (this.getBtnInsertShape().pressed) {
                this.getBtnInsertShape().toggle(false, true);
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Add Text");
        } else {
            if (opts.action == "insert-shape") {
                if (!btn.pressed) {
                    btn.hideMenu();
                    this._addAutoshape(false);
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                } else {
                    if (this.getToolbar().btnInsertText.pressed) {
                        this._addAutoshape(false);
                        this.getToolbar().btnInsertText.toggle(false, true);
                    }
                }
            }
        }
    },
    loadStyles: function () {
        if (this.styles) {
            this._onInitEditorStyles(this.styles);
        }
    },
    _onInitEditorStyles: function (styles) {
        window.styles_loaded = false;
        var self = this;
        if (!self.getListStyles()) {
            self.styles = styles;
            return;
        }
        var canvasDefaultStyles = document.createElement("canvas");
        canvasDefaultStyles.id = "bigimgdefaultstyles";
        var isDocStyles = styles.asc_getDocStylesImage().length > 0;
        var fillStyles = function () {
            self.getListStyles().dataMenu.picker.store.removeAll();
            var merged_array = styles.asc_getDefaultStyles();
            isDocStyles && (merged_array = merged_array.concat(styles.asc_getDocStyles()));
            merged_array.forEach(function (style) {
                var thumb = document.createElement("canvas");
                thumb.width = styles.asc_getStyleThumbnailWidth();
                thumb.height = styles.asc_getStyleThumbnailHeight();
                var ctx = thumb.getContext("2d");
                ctx.save();
                ctx.translate(0, -style.asc_getThumbnailOffset() * styles.asc_getStyleThumbnailHeight());
                ctx.drawImage(((style.asc_getType() == c_oAscStyleImage.Default) ? canvasDefaultStyles : canvasDocStyles), 0, 0);
                ctx.restore();
                self.getListStyles().dataMenu.picker.store.add({
                    imageUrl: thumb.toDataURL(),
                    name: style.asc_getName(),
                    uid: Ext.id()
                });
            });
            var listStylesVisible = (self.getListStyles().rendered && self.getListStyles().getEl() && self.getListStyles().getEl().up("#id-toolbar-full-group-styles") && self.getListStyles().getEl().up("#id-toolbar-full-group-styles").isVisible());
            if (self.getListStyles().dataMenu.picker.store.getCount() > 0 && listStylesVisible) {
                self.getListStyles().fillComboView(self.getListStyles().dataMenu.picker.store.getAt(0), true);
                self.getListStyles().selectByIndex(0);
            }
            window.styles_loaded = true;
        };
        var imgDefaultStyles = new Image(),
        imgLoaded = 1;
        if (isDocStyles) {
            imgLoaded++;
            var canvasDocStyles = document.createElement("canvas");
            canvasDocStyles.id = "bigimgdocstyles";
            var imgDocStyles = new Image();
            imgDocStyles.onload = function () {
                canvasDocStyles.width = imgDocStyles.width;
                canvasDocStyles.height = imgDocStyles.height;
                canvasDocStyles.getContext("2d").drawImage(imgDocStyles, 0, 0);
                if (! (--imgLoaded > 0)) {
                    fillStyles();
                }
            };
        }
        imgDefaultStyles.onload = function () {
            canvasDefaultStyles.width = imgDefaultStyles.width;
            canvasDefaultStyles.height = imgDefaultStyles.height;
            canvasDefaultStyles.getContext("2d").drawImage(imgDefaultStyles, 0, 0);
            if (! (--imgLoaded > 0)) {
                fillStyles();
            }
        };
        imgDefaultStyles.src = styles.asc_getDefaultStylesImage();
        imgDocStyles && (imgDocStyles.src = styles.asc_getDocStylesImage());
    },
    onCellStyleSelect: function (combo, record) {
        var list = this.getListStyles();
        this.api.refusechange = true;
        this.api.asc_setCellStyle(list.dataMenu.picker.store.getAt(list.dataMenu.picker.store.find("uid", record.get("uid"))).get("name"));
        this.api.refusechange = false;
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Style");
    },
    onZoomChange: function (zf, type) {
        switch (type) {
        case 1:
            case 2:
            case 0:
            default:
            this.getToolbar().txtZoom.setText(Math.floor((zf + 0.005) * 100) + "%");
        }
    },
    _btnChangeFontSize: function (btn) {
        btn.action == "inc" ? this.api.asc_increaseFontSize() : this.api.asc_decreaseFontSize();
    },
    _onMenuTableTemplate: function (picker, record) {
        if (this.api.asc_getAddFormatTableOptions() != false) {
            var me = this;
            var wc = me.api.asc_getWorksheetsCount(),
            names = [],
            i = -1;
            while (++i < wc) {
                names.push(me.api.asc_getWorksheetName(i));
            }
            var win = Ext.widget("tableoptionsdialog", {
                api: this.api,
                names: names
            });
            win.addListener("onmodalresult", function (o, mr, params) {
                if (mr == 1) {
                    me.api.asc_setSelectionDialogMode(false);
                    me.api.asc_addAutoFilter(record.data.name, params);
                }
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            },
            false);
            win.addListener("show", function () {
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            },
            false);
            win.show();
        } else {
            this.api.asc_addAutoFilter(record.data.name);
        }
    },
    onSheetChanged: function () {
        var params = this.api.asc_getSheetViewSettings();
        var menu = this.getMenuHideOptions();
        if (menu) {
            menu.items.getAt(3).setChecked(!params.asc_getShowRowColHeaders());
            menu.items.getAt(4).setChecked(!params.asc_getShowGridLines());
        }
    },
    checkInsertAutoshape: function (fm, cmp) {
        if (this.api.asc_isAddAutoshape()) {
            if (cmp.id != "editor_sdk" || cmp.action == "cancel") {
                this._toggleFromMenuHide = false;
                this._isAddingShape = false;
                this._addAutoshape(false);
                this.getBtnInsertShape().toggle(false, false);
                this.getToolbar().btnInsertText.toggle(false, false);
                this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            }
        }
    },
    _addAutoshape: function (isstart, type) {
        if (isstart) {
            this.api.asc_startAddShape(type);
            Ext.FocusManager.addListener("componentfocus", this.checkInsertAutoshape, this);
        } else {
            this.api.asc_endAddShape();
            Ext.FocusManager.removeListener("componentfocus", this.checkInsertAutoshape, this);
        }
    },
    createDelayedElements: function () {
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        this.api.asc_registerCallback("asc_onCanUndoChanged", Ext.bind(this._onCanRevert, this, ["undo"], true));
        this.api.asc_registerCallback("asc_onCanRedoChanged", Ext.bind(this._onCanRevert, this, ["redo"], true));
        this.api.asc_registerCallback("asc_onEditCell", Ext.bind(this._onEditCell, this));
        this.api.asc_registerCallback("asc_onEndAddShape", Ext.bind(this._onEndAddShape, this));
        this.api.asc_registerCallback("asc_onZoomChanged", Ext.bind(this.onZoomChange, this));
        this.api.asc_registerCallback("asc_onSheetsChanged", Ext.bind(this.onSheetChanged, this));
        this.wrapOnSelectionChanged = Ext.bind(this._onSelectionChanged, this);
        this.api.asc_registerCallback("asc_onSelectionChanged", this.wrapOnSelectionChanged);
        this._onSelectionChanged(this.api.asc_getCellInfo());
        this.attachToControlEvents();
    },
    attachToControlEvents: function () {
        this.control({
            "menu[action=table-templates]": {
                select: this._onMenuTableTemplate,
                itemmouseenter: function (obj, record, item, index, event, eOpts) {
                    if (obj.tooltip) {
                        obj.tooltip.close();
                    }
                    obj.tooltip = Ext.create("Ext.tip.ToolTip", {
                        closeAction: "destroy",
                        dismissDelay: 2000,
                        html: record.get("caption")
                    });
                    var xy = event.getXY();
                    obj.tooltip.showAt([xy[0] + 10, xy[1] + 10]);
                },
                itemmouseleave: function (obj, record, item, index, e, eOpts) {
                    if (obj.tooltip) {
                        obj.tooltip.close();
                    }
                },
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "menu[action=number-format]": {
                click: this._handleNumberFormatMenu
            }
        });
    },
    changeViewMode: function (compact) {
        var toolbar = this.getToolbar(),
        toolbarFull = Ext.get("id-toolbar-full"),
        toolbarShort = Ext.get("id-toolbar-short");
        toolbar.isCompactView = compact;
        if (toolbarFull && toolbarShort) {
            this.api.asc_unregisterCallback("asc_onSelectionChanged", this.wrapOnSelectionChanged);
            if (compact) {
                toolbarShort.setStyle({
                    display: "table"
                });
                toolbarFull.setStyle({
                    display: "none"
                });
                toolbar.setHeight(38);
                toolbar.rendererComponents("short");
            } else {
                toolbarShort.setStyle({
                    display: "none"
                });
                toolbarFull.setStyle({
                    display: "table"
                });
                toolbar.setHeight(68);
                toolbar.rendererComponents("full");
                Ext.defer(function () {
                    var listStylesVisible = (toolbar.listStyles.rendered && toolbar.listStyles.getEl() && toolbar.listStyles.getEl().up("#id-toolbar-full-group-styles") && toolbar.listStyles.getEl().up("#id-toolbar-full-group-styles").isVisible());
                    if (toolbar.listStyles.dataMenu.picker.store.getCount() > 0 && listStylesVisible) {
                        toolbar.listStyles.doComponentLayout();
                        toolbar.listStyles.fillComboView(toolbar.listStyles.dataMenu.picker.getSelectedRec(), true);
                    }
                },
                100);
            }
            this.api.asc_registerCallback("asc_onSelectionChanged", this.wrapOnSelectionChanged);
            this._onSelectionChanged(this.api.asc_getCellInfo());
        }
    },
    _disableEditOptions: function (seltype) {
        var toolbar = this.getToolbar();
        var is_shape_text = seltype == c_oAscSelectionType.RangeShapeText,
        is_shape = seltype == c_oAscSelectionType.RangeShape,
        is_image = seltype == c_oAscSelectionType.RangeImage;
        var is_mode_1 = is_image;
        var is_mode_2 = seltype == c_oAscSelectionType.RangeShapeText || is_shape;
        toolbar.btnPrint.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnParagraphColor.setDisabled(is_mode_1);
        toolbar.btnVerticalAlign.setDisabled(is_mode_1);
        toolbar.btnHorizontalAlign.setDisabled(is_mode_1);
        toolbar.btnBorders.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnAlignLeft.setDisabled(is_mode_1);
        toolbar.btnAlignCenter.setDisabled(is_mode_1);
        toolbar.btnAlignRight.setDisabled(is_mode_1);
        toolbar.btnAlignJust.setDisabled(is_mode_1);
        toolbar.btnAlignJust.setDisabled(is_mode_1);
        toolbar.btnAlignTop.setDisabled(is_mode_1);
        toolbar.btnAlignMiddle.setDisabled(is_mode_1);
        toolbar.btnAlignBottom.setDisabled(is_mode_1);
        toolbar.btnTextOrient.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnMerge.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnInsertHyperlink.setDisabled(is_image);
        toolbar.btnInsertImage.setDisabled(is_image);
        toolbar.btnInsertText.setDisabled(is_image);
        toolbar.btnInsertShape.setDisabled(is_image);
        toolbar.btnSortDown.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnSortUp.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnTableTemplate.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnSetAutofilter.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnPercentStyle.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnCurrencyStyle.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnDecDecimal.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnIncDecimal.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnAddCell.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnDeleteCell.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnNumberFormat.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnWrap.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnInsertFormula.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnClearStyle.menu.items.items[1].setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnClearStyle.menu.items.items[2].setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnAutofilter.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnShowMode.setDisabled(is_mode_1 || is_mode_2);
        toolbar.btnSettings.setDisabled(is_mode_1 || is_mode_2);
        if (is_mode_1 || is_mode_2) {
            toolbar.listStyles.suspendEvents(false);
            toolbar.listStyles.selectByIndex(-1);
            toolbar.listStyles.resumeEvents();
        }
        toolbar.listStyles.setDisabled(is_mode_1 || is_mode_2);
        toolbar.cmbFont.setDisabled(is_mode_1);
        toolbar.cmbFontSize.setDisabled(is_mode_1);
        toolbar.btnIncFontSize.setDisabled(is_mode_1);
        toolbar.btnDecFontSize.setDisabled(is_mode_1);
        toolbar.btnBold.setDisabled(is_mode_1);
        toolbar.btnItalic.setDisabled(is_mode_1);
        toolbar.btnUnderline.setDisabled(is_mode_1);
        toolbar.btnFontColor.setDisabled(is_mode_1);
        return is_mode_1;
    },
    _onSelectionChanged: function (info) {
        var selectionType = info.asc_getFlags().asc_getSelectionType();
        if (this._disableEditOptions(selectionType)) {
            return;
        }
        var toolbar = this.getToolbar();
        var fontobj = info.asc_getFont();
        var fontparam = fontobj.asc_getName();
        if (fontparam != toolbar.cmbFont.getValue()) {
            var rec = toolbar.cmbFont.store.findRecord("name", fontparam);
            if (rec) {
                toolbar.cmbFont.select(rec);
            } else {
                toolbar.cmbFont.setRawValue(fontparam);
            }
        }
        toolbar.btnBold.toggle(fontobj.asc_getBold(), true);
        toolbar.btnItalic.toggle(fontobj.asc_getItalic(), true);
        toolbar.btnUnderline.toggle(fontobj.asc_getUnderline(), true);
        var str_size = String(fontobj.asc_getSize());
        if (toolbar.cmbFontSize.getValue() != str_size) {
            toolbar.cmbFontSize.setValue(str_size);
        }
        var clr, color;
        if (!toolbar.btnFontColor.ischanged) {
            color = fontobj.asc_getColor();
            if (color) {
                if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                    clr = {
                        color: toolbar.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                        effectValue: color.get_value()
                    };
                } else {
                    clr = toolbar.getHexColor(color.get_r(), color.get_g(), color.get_b());
                }
            }
            toolbar.colorsText.suspendEvents(false);
            if (typeof(clr) == "object") {
                for (var i = 0; i < 10; i++) {
                    if (toolbar.ThemeValues[i] == clr.effectValue) {
                        toolbar.colorsText.select(clr, false);
                        break;
                    }
                }
            } else {
                toolbar.colorsText.select(clr, false);
            }
            toolbar.colorsText.resumeEvents();
        }
        if (!toolbar.btnParagraphColor.ischanged) {
            color = info.asc_getFill().asc_getColor();
            if (color) {
                if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                    clr = {
                        color: toolbar.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                        effectValue: color.get_value()
                    };
                } else {
                    clr = toolbar.getHexColor(color.get_r(), color.get_g(), color.get_b());
                }
            } else {
                clr = "transparent";
            }
            toolbar.colorsBack.suspendEvents(false);
            if (typeof(clr) == "object") {
                for (i = 0; i < 10; i++) {
                    if (toolbar.ThemeValues[i] == clr.effectValue) {
                        toolbar.colorsBack.select(clr, false);
                        break;
                    }
                }
            } else {
                toolbar.colorsBack.select(clr, false);
            }
            toolbar.colorsBack.resumeEvents();
        }
        fontparam = info.asc_getHorAlign();
        var index = -1,
        align, btn, btn_press = Ext.ButtonToggleManager.getPressed("alignGroup");
        switch (fontparam) {
        case "left":
            index = 0;
            align = "halign-left";
            btn = toolbar.btnAlignLeft;
            break;
        case "center":
            index = 1;
            align = "halign-center";
            btn = toolbar.btnAlignCenter;
            break;
        case "right":
            index = 2;
            align = "halign-right";
            btn = toolbar.btnAlignRight;
            break;
        case "justify":
            index = 3;
            align = "halign-just";
            btn = toolbar.btnAlignJust;
            break;
        default:
            index = -255;
            align = "halign-left";
            break;
        }
        if (! (index < 0)) {
            if (!toolbar.isCompactView && !btn.pressed) {
                btn_press && btn_press.toggle(false, true);
                btn.toggle(true, true);
            }
            toolbar.btnHorizontalAlign.menu.items.getAt(index).setChecked(true);
        } else {
            if (index == -255) { ! toolbar.isCompactView && btn_press && btn_press.toggle(false, true);
                this._clearChecked(toolbar.btnHorizontalAlign.menu.items.items);
            }
        }
        toolbar.btnHorizontalAlign.removeCls(toolbar.btnHorizontalAlign.icls);
        toolbar.btnHorizontalAlign.icls = align;
        toolbar.btnHorizontalAlign.addCls(align);
        toolbar.btnTextOrient.menu.items.getAt(1).setDisabled(fontparam == "justify");
        toolbar.btnTextOrient.menu.items.getAt(2).setDisabled(fontparam == "justify");
        fontparam = info.asc_getVertAlign();
        index = -1;
        align = "";
        switch (fontparam) {
        case "top":
            index = 0;
            align = "valign-top";
            btn = toolbar.btnAlignTop;
            break;
        case "center":
            index = 1;
            align = "valign-middle";
            btn = toolbar.btnAlignMiddle;
            break;
        case "bottom":
            index = 2;
            align = "valign-bottom";
            btn = toolbar.btnAlignBottom;
            break;
        }
        if (! (index < 0)) {
            if (!toolbar.isCompactView && !btn.pressed) {
                btn_press = Ext.ButtonToggleManager.getPressed("vAlignGroup");
                btn_press && btn_press.toggle(false, true);
                btn.toggle(true, true);
            }
            toolbar.btnVerticalAlign.menu.items.items[index].setChecked(true);
            toolbar.btnVerticalAlign.removeCls(toolbar.btnVerticalAlign.icls);
            toolbar.btnVerticalAlign.icls = align;
            toolbar.btnVerticalAlign.addCls(align);
        } ! toolbar.api.isCellEdited && toolbar.btnMerge.setDisabled(info.asc_getIsFormatTable() === true);
        toolbar.btnMerge.toggle(info.asc_getFlags().asc_getMerge(), true);
        toolbar.btnWrap.toggle(info.asc_getFlags().asc_getWrapText(), true);
        var need_disable = info.asc_getLocked();
        if (toolbar.coauthdisable != need_disable) {
            toolbar.coauthdisable = need_disable;
            setTimeout(function () {
                toolbar.btnParagraphColor.setDisabled(need_disable);
                toolbar.btnFontColor.setDisabled(need_disable);
                Ext.each(toolbar.coauthControls, function (item, index) {
                    item.setDisabled(need_disable);
                },
                toolbar);
            },
            10);
        }
        fontparam = toolbar.numFormatTypes[info.asc_getNumFormatType()];
        if (!fontparam) {
            fontparam = toolbar.numFormatTypes[1];
        }
        toolbar.btnNumberFormat.setText(fontparam);
        this._clearChecked(toolbar.btnTextOrient.menu.items.items);
        switch (info.asc_getAngle()) {
        case 45:
            toolbar.btnTextOrient.menu.items.getAt(1).setChecked(true, true);
            break;
        case -45:
            toolbar.btnTextOrient.menu.items.getAt(2).setChecked(true, true);
            break;
        case 90:
            toolbar.btnTextOrient.menu.items.getAt(3).setChecked(true, true);
            break;
        case -90:
            toolbar.btnTextOrient.menu.items.getAt(4).setChecked(true, true);
            break;
        default:
            toolbar.btnTextOrient.menu.items.getAt(0).setChecked(true, true);
            break;
        }
        if (!this.api.refusechange) {
            toolbar.listStyles.suspendEvents(false);
            toolbar.listStyles.selectByIndex(toolbar.listStyles.dataMenu.picker.store.find("name", info.asc_getStyleName()));
            toolbar.listStyles.resumeEvents();
        }
        toolbar.btnAddCell.menu.items.getAt(0).setDisabled(selectionType == c_oAscSelectionType.RangeRow);
        toolbar.btnAddCell.menu.items.getAt(1).setDisabled(selectionType == c_oAscSelectionType.RangeCol);
        toolbar.btnAddCell.menu.items.getAt(2).setDisabled(selectionType == c_oAscSelectionType.RangeCol);
        toolbar.btnAddCell.menu.items.getAt(3).setDisabled(selectionType == c_oAscSelectionType.RangeRow);
        toolbar.btnDeleteCell.menu.items.getAt(0).setDisabled(selectionType == c_oAscSelectionType.RangeRow);
        toolbar.btnDeleteCell.menu.items.getAt(1).setDisabled(selectionType == c_oAscSelectionType.RangeCol);
        toolbar.btnDeleteCell.menu.items.getAt(2).setDisabled(selectionType == c_oAscSelectionType.RangeCol);
        toolbar.btnDeleteCell.menu.items.getAt(3).setDisabled(selectionType == c_oAscSelectionType.RangeRow);
    },
    _clearChecked: function (items) {
        for (var n in items) {
            items[n].setChecked(false, true);
        }
    },
    textEmptyImgUrl: "You need to specify image URL.",
    warnMergeLostData: "Operation will can destroy data in the selected cells.<br>Continue?",
    textWarning : "Warning",
    textFontSizeErr: "The entered value must be more than 0",
    textCancel: "Cancel"
});