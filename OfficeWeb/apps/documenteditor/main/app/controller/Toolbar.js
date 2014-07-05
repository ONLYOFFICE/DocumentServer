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
 Ext.define("DE.controller.Toolbar", (function () {
    var _onLongActionBegin = function (type, id) {
        switch (id) {
        case c_oAscAsyncAction.Save:
            this.getToolbar().btnSave.disable();
            Ext.ComponentQuery.query("defile")[0].btnSave.disable();
            break;
        }
    };
    var _onLongActionEnd = function (type, id) {
        switch (id) {
        case c_oAscAsyncAction.Save:
            this.getToolbar().btnSave.enable();
            Ext.ComponentQuery.query("defile")[0].btnSave.enable();
            break;
        }
    };
    return {
        extend: "Ext.app.Controller",
        requires: ["Common.view.ImageFromUrlDialog", "Common.view.CopyWarning", "DE.view.HyperlinkSettingsDialog", "DE.view.InsertTableDialog", "Common.plugin.MenuExpand", "Ext.util.Cookies", "DE.view.DropcapSettingsAdvanced"],
        views: ["Toolbar"],
        refs: [{
            ref: "toolbar",
            selector: "detoolbar"
        },
        {
            ref: "cmbFontSize",
            selector: "#toolbar-combo-font-size"
        },
        {
            ref: "menuLineSpace",
            selector: "#toolbar-menu-line-space"
        },
        {
            ref: "btnPageSize",
            selector: "#toolbar-button-pagesize"
        },
        {
            ref: "listStyles",
            selector: "#toolbar-combo-view-styles"
        },
        {
            ref: "btnInsertShape",
            selector: "#toolbar-button-insert-shape"
        },
        {
            ref: "btnHorizontalAlign",
            selector: "#toolbar-button-halign"
        },
        {
            ref: "btnDropCap",
            selector: "#toolbar-button-dropcap"
        },
        {
            ref: "mnuDropCapAdvanced",
            selector: "#mnu-dropcap-advanced"
        }],
        flg: {},
        init: function () {
            this._state = {
                bullets: {
                    type: undefined,
                    subtype: undefined
                },
                prstyle: undefined,
                prstyleNoStyles: true,
                undo: undefined,
                redo: undefined,
                prcontrolsdisable: undefined,
                dropcap: c_oAscDropCap.None
            };
            this._isAddingShape = false;
            this.control({
                "detoolbar": {
                    afterrender: function (cmp) {
                        cmp.ownerCt.addListener("resize", Ext.bind(this.resizeToolbar, this));
                        Ext.FocusManager.unsubscribe(cmp);
                    }
                },
                "#toolbar-combo-fonts": {
                    select: function (combo, records, eOpts) {
                        if (this.api) {
                            this.api.put_TextPrFontName(records[0].data.name);
                        }
                        this.getToolbar().fireEvent("editcomplete", this);
                        Common.component.Analytics.trackEvent("ToolBar", "Font Name");
                    },
                    collapse: function (field, opts) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-combo-font-size": {
                    select: this._fontsizeSelect,
                    beforequery: this._fontsizeBeforeQuery,
                    collapse: this._fontsizeCollapse,
                    specialkey: this._fontsizeSpecialKey
                },
                "#toolbar-button-bold": {
                    click: this._clickBold
                },
                "#toolbar-button-italic": {
                    click: this._clickItalic
                },
                "#toolbar-button-underline": {
                    click: this._clickUnderline
                },
                "#toolbar-strikeout": {
                    click: this._clickStrikeout
                },
                "#toolbar-button-superscript": {
                    click: this._clickSuperscript
                },
                "#toolbar-button-subscript": {
                    click: this._clickSubscript
                },
                "#toolbar-button-print": {
                    click: this._handlePrint
                },
                "#toolbar-button-save": {
                    click: this._handleSave
                },
                "#toolbar-button-copy": {
                    click: {
                        fn: this.handleCopyPaste,
                        action: "copy"
                    }
                },
                "#toolbar-button-paste": {
                    click: {
                        fn: this.handleCopyPaste,
                        action: "paste"
                    }
                },
                "#toolbar-button-undo": {
                    click: this._handleUndo
                },
                "#toolbar-button-redo": {
                    click: this._handleRedo
                },
                "#toolbar-button-increase-font": {
                    click: this._handleIncrease
                },
                "#toolbar-button-decrease-font": {
                    click: this._handleDecrease
                },
                "#toolbar-btn-markers": {
                    click: function (btn) {
                        var record = {
                            data: {
                                data: {
                                    type: 0,
                                    subtype: btn.pressed ? 0 : -1
                                }
                            }
                        };
                        this._onSelectBullets(btn.menu.picker, record, btn.id, btn.pressed);
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-btn-numbering": {
                    click: function (btn) {
                        var record = {
                            data: {
                                data: {
                                    type: 1,
                                    subtype: btn.pressed ? 0 : -1
                                }
                            }
                        };
                        this._onSelectBullets(btn.menu.picker, record, btn.id, btn.pressed);
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-button-align-left": {
                    click: Ext.bind(this._handleHorizontalAlign, this, [1])
                },
                "#toolbar-button-align-center": {
                    click: Ext.bind(this._handleHorizontalAlign, this, [2])
                },
                "#toolbar-button-align-right": {
                    click: Ext.bind(this._handleHorizontalAlign, this, [0])
                },
                "#toolbar-button-align-just": {
                    click: Ext.bind(this._handleHorizontalAlign, this, [3])
                },
                "#toolbar-button-dec-left-offset": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.DecreaseIndent();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Indent");
                    }
                },
                "#toolbar-button-inc-left-offset": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.IncreaseIndent();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Indent");
                    }
                },
                "#toolbar-menu-insertimage": {
                    click: function (menu, item, opt) {
                        if (item.from == "file") {
                            this.getToolbar().fireEvent("insertimage", this.getToolbar());
                            if (this.api) {
                                this.api.AddImage();
                            }
                            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                            Common.component.Analytics.trackEvent("ToolBar", "Image");
                        } else {
                            this._mnuOpenImageFromURL();
                        }
                    },
                    hide: function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-line-space": {
                    hide: function (item) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-line-space menuitem": {
                    click: function (item) {
                        if (this.api) {
                            this.api.put_PrLineSpacing(c_paragraphLinerule.LINERULE_AUTO, item.linespace);
                        }
                        Common.component.Analytics.trackEvent("ToolBar", "Line Spacing");
                    }
                },
                "#toolbar-button-page-break": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.put_AddPageBreak();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Page Break");
                    }
                },
                "#toolbar-menu-edit-header": {
                    hide: function (item) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-edit-header menuitem": {
                    click: function (item) {
                        if (item.place == "Header") {
                            this.api.GoToHeader(this.api.getCurrentPage());
                        } else {
                            if (item.place == "Footer") {
                                this.api.GoToFooter(this.api.getCurrentPage());
                            } else {
                                return;
                            }
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Edit " + item.place);
                    }
                },
                "#toolbar-button-insert-hyperlink": {
                    click: function (btn) {
                        this._handleHyperlinkOptions();
                    }
                },
                "#toolbar-button-clear-style": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.ClearFormating();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-button-copy-style": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.SetPaintFormat(btn.pressed);
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#menu-page-size menuitem": {
                    click: function (item) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#menu-page-size": {
                    hide: function (item) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-button-pageorient": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.change_PageOrient(!btn.pressed);
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Page Orientation");
                    }
                },
                "#toolbar-button-newdocument": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.OpenNewDocument();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "New Document");
                    }
                },
                "#toolbar-button-opendocument": {
                    click: function (btn) {
                        if (this.api) {
                            this.api.LoadDocumentFromDisk();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Open Document");
                    }
                },
                "#toolbar-combo-view-styles": {
                    select: function (combo, record) {
                        if (this.api) {
                            this.api.put_Style(record.data.title);
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Style");
                    },
                    menuhide: function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    },
                    releasecapture: function (cnt) {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    },
                    render: function (o) {
                        if (this.styles) {
                            this._onInitEditorStyles(this.styles);
                            delete this.styles;
                        }
                    },
                    afterrender: function (o) {
                        if (this.getListStyles().dataMenu.picker.store.getCount() > 0) {
                            this.getListStyles().fillComboView(this.getListStyles().dataMenu.picker.store.getAt(0), true);
                        }
                    }
                },
                "#toolbar-button-insert-shape": {
                    click: function (btn) {
                        if (!btn.pressed) {
                            if (this.api) {
                                this._addAutoshape(false);
                            }
                            btn.hideMenu();
                            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        } else {
                            if (this.getToolbar().btnInsertText.pressed) {
                                this.getToolbar().btnInsertText.toggle(false, true);
                                if (this.api) {
                                    this._addAutoshape(false);
                                }
                            }
                        }
                    },
                    afterrender: Ext.bind(function (btn) {
                        var me = this;
                        btn.getEl().on("mousedown", function (event, element, eOpts) {
                            me._toggleFromMenuHide = false;
                        },
                        me);
                    },
                    this)
                },
                "#toolbar-menu-insert-shape": {
                    hide: function () {
                        if (this.getBtnInsertShape().pressed && !this._isAddingShape && this._toggleFromMenuHide) {
                            this._toggleFromMenuHide = false;
                            this.getBtnInsertShape().toggle(false, false);
                        }
                        this._isAddingShape = false;
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), this.getBtnInsertShape());
                    },
                    show: function () {
                        this._toggleFromMenuHide = true;
                    }
                },
                "#toolbar-button-insert-text": {
                    click: function (btn) {
                        if (this.api) {
                            this._addAutoshape(btn.pressed, "textRect");
                        }
                        if (this.getBtnInsertShape().pressed) {
                            this.getBtnInsertShape().toggle(false, true);
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar(), this.getBtnInsertShape());
                        Common.component.Analytics.trackEvent("ToolBar", "Add Text");
                    }
                },
                "#toolbar-menu-insert-table": {
                    hide: function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-insert-table dedimensionpicker": {
                    beforerender: function (cmp) {
                        if (cmp.stalign == "top") {
                            var elem = cmp.renderTpl.splice(6, 1);
                            cmp.renderTpl.splice(1, 0, elem[0]);
                        }
                    },
                    select: function (o, columns, rows) {
                        if (this.api) {
                            this.getToolbar().fireEvent("inserttable", this.getToolbar());
                            this.api.put_Table(columns, rows);
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Ext.menu.Manager.hideAll();
                        Common.component.Analytics.trackEvent("ToolBar", "Table");
                    },
                    afterrender: function (cmp) {
                        $("#" + cmp.id).mouseleave(function () {
                            Ext.getCmp(this.id).setTableSize(0, 0);
                        });
                    }
                },
                "#toolbar-insert-custom-table": {
                    click: function (btn) {
                        var win = Ext.create("DE.view.InsertTableDialog", {});
                        var me = this;
                        win.addListener("onmodalresult", function (o, mr, s) {
                            if (mr && me.api) {
                                me.getToolbar().fireEvent("inserttable", me.getToolbar());
                                me.api.put_Table(s[0], s[1]);
                            }
                            me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                            Common.component.Analytics.trackEvent("ToolBar", "Table");
                        },
                        false);
                        win.show();
                    }
                },
                "#toolbar-menu-color-schemas": {
                    hide: function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    },
                    click: this._handleMenuSchemas
                },
                "#toolbar-menu-horalign": {
                    click: this._handleMenuHorizontalAlign
                },
                "#toolbar-menu-horalign menuitem": {
                    beforecheckchange: function (item) {
                        if (!item.checked) {
                            this._clearChecked(this.getBtnHorizontalAlign().menu.items.items);
                        }
                    }
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
                "#toolbar-menu-fit-page": {
                    click: function (item) {
                        if (this.api) {
                            if (item.checked) {
                                this.api.zoomFitToPage();
                            } else {
                                this.api.zoomCustomMode();
                            }
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-fit-width": {
                    click: function (item) {
                        if (this.api) {
                            if (item.checked) {
                                this.api.zoomFitToWidth();
                            } else {
                                this.api.zoomCustomMode();
                            }
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-zoomin": {
                    click: function () {
                        if (this.api) {
                            this.api.zoomIn();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-zoomout": {
                    click: function () {
                        if (this.api) {
                            this.api.zoomOut();
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-zoom-text": {
                    afterrender: function (ct) {
                        ct.setWidth(Ext.util.TextMetrics.measure(ct.getEl(), "100%").width);
                    }
                },
                "#menu-hide-bars": {
                    hide: function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                },
                "#toolbar-menu-dropcap": {
                    click: this._handleDropCap,
                    hide: Ext.bind(function () {
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    },
                    this)
                },
                "#toolbar-menu-dropcap menuitem": {
                    beforecheckchange: function (item) {
                        if (!item.checked) {
                            this._clearChecked(this.getBtnDropCap().menu.items.items);
                        }
                    }
                },
                "#mnu-dropcap-advanced": {
                    click: this._handleDropCapAdvanced
                },
                "#mnu-hide-bars-toolbar": {
                    click: function (item) {
                        this.getToolbar().changeViewMode(item.checked);
                        window.localStorage.setItem("de-compact-toolbar", item.checked ? 1 : 0);
                        if (this._state.prstyleNoStyles && !item.checked) {
                            if (this.getListStyles().dataMenu.picker.store.getCount() > 0) {
                                var styleIndex = this.getListStyles().dataMenu.picker.store.findBy(function (record, id) {
                                    return (record.data.title === this._state.prstyle);
                                },
                                this);
                                this.getListStyles().selectByIndex((styleIndex >= 0) ? styleIndex : 0);
                            }
                        }
                        this._state.prstyleNoStyles = false;
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    }
                }
            });
        },
        setApi: function (o) {
            this.api = o;
        },
        resizeToolbar: function (cmp, adjWidth, adjHeight) {
            var w = this.getToolbar().getWidth();
            if (w !== adjWidth) {
                this.getToolbar().setWidth(adjWidth);
            }
            this.shapeMenuExpandLeft = (adjWidth < 1072);
        },
        _getApiTextSize: function () {
            var out_value = 12,
            textPr = this.api.get_TextProps();
            if (textPr && textPr.get_TextPr) {
                out_value = textPr.get_TextPr().get_FontSize();
            }
            return out_value;
        },
        _fontsizeCollapse: function (field, eOpts) {
            if (!this.flg.setFontSize) {
                var raw_value = field.getRawValue(),
                api_value = this._getApiTextSize();
                if (api_value && raw_value != api_value) {
                    field.getStore().clearFilter(false);
                    field.setValue(api_value);
                }
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        },
        _fontsizeSelect: function (combo, records, eOpts) {
            this.flg.setFontSize = true;
            if (this.api) {
                this.api.put_TextPrFontSize(records[0].data.sizevalue);
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            this.flg.setFontSize = false;
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
                    var value = combo.getPicker().getRecord(record).data.sizestring;
                } else {
                    value = /^\+?(\d*\.?\d+)$|^\+?(\d+\.?\d*)$/.exec(combo.getValue());
                    if (!value) {
                        value = this._getApiTextSize();
                        readsize = true;
                    } else {
                        value = value[0] ? parseFloat(value[0]) : parseFloat(value[1]);
                        value = value > 100 ? 100 : value < 1 ? 1 : Math.floor((value + 0.4) * 2) / 2;
                    }
                }
                combo.getStore().clearFilter(false);
                combo.setRawValue(value);
                this.flg.setFontSize = true;
                combo.collapse();
                if (!readsize) {
                    this.api.put_TextPrFontSize(value);
                } else {
                    Ext.Msg.show({
                        title: this.textWarning,
                        msg: this.textFontSizeErr,
                        icon: Ext.Msg.WARNING,
                        buttons: Ext.Msg.OK,
                        fn: function () {
                            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        },
                        scope: this
                    });
                }
                this.flg.setFontSize = false;
            }
        },
        _onFontSize: function (size) {
            if (!this.flg.setFontSize) {
                var str_size = Ext.isNumber(size) ? String(size) : "";
                if (this.getCmbFontSize().getValue() != str_size) {
                    this.getCmbFontSize().setValue(str_size);
                }
            }
        },
        _onBold: function (on) {
            this.getToolbar().btnBold.toggle(on === true, true);
        },
        _clickBold: function (btn) {
            if (this.api) {
                this.api.put_TextPrBold(btn.pressed);
            }
            this.getToolbar().fireEvent("editcomplete", this);
            Common.component.Analytics.trackEvent("ToolBar", "Bold");
        },
        _onItalic: function (on) {
            this.getToolbar().btnItalic.toggle(on === true, true);
        },
        _clickItalic: function (btn) {
            if (this.api) {
                this.api.put_TextPrItalic(btn.pressed);
            }
            this.getToolbar().fireEvent("editcomplete", this);
            Common.component.Analytics.trackEvent("ToolBar", "Italic");
        },
        _onUnderline: function (on) {
            this.getToolbar().btnUnderline.toggle(on === true, true);
        },
        _clickUnderline: function (btn) {
            if (this.api) {
                this.api.put_TextPrUnderline(btn.pressed);
            }
            this.getToolbar().fireEvent("editcomplete", this);
            Common.component.Analytics.trackEvent("ToolBar", "Underline");
        },
        _onStrikeout: function (on) {
            this.getToolbar().btnStrikeout.toggle(on === true, true);
        },
        _clickStrikeout: function (btn) {
            if (this.api) {
                this.api.put_TextPrStrikeout(btn.pressed);
            }
            this.getToolbar().fireEvent("editcomplete", this);
            Common.component.Analytics.trackEvent("ToolBar", "Strikeout");
        },
        _clickSuperscript: function (btn) {
            if (!this.getToolbar().btnSubscript.pressed) {
                if (this.api) {
                    this.api.put_TextPrBaseline(btn.pressed ? 1 : 0);
                }
                this.getToolbar().fireEvent("editcomplete", this);
                Common.component.Analytics.trackEvent("ToolBar", "Superscript");
            }
        },
        _clickSubscript: function (btn) {
            if (!this.getToolbar().btnSuperscript.pressed) {
                if (this.api) {
                    this.api.put_TextPrBaseline(btn.pressed ? 2 : 0);
                }
                this.getToolbar().fireEvent("editcomplete", this);
                Common.component.Analytics.trackEvent("ToolBar", "Subscript");
            }
        },
        _onVerticalAlign: function (typeBaseline) {
            this.getToolbar().btnSuperscript.toggle(false, true);
            this.getToolbar().btnSubscript.toggle(false, true);
            switch (typeBaseline) {
            case 1:
                this.getToolbar().btnSuperscript.toggle(true, true);
                break;
            case 2:
                this.getToolbar().btnSubscript.toggle(true, true);
                break;
            }
        },
        _handlePrint: function (btn) {
            if (this.api) {
                this.api.asc_Print();
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("Print");
            Common.component.Analytics.trackEvent("ToolBar", "Print");
        },
        _handleSave: function (btn) {
            if (this.api) {
                this.api.asc_Save();
            }
            Common.component.Analytics.trackEvent("Save");
            Common.component.Analytics.trackEvent("ToolBar", "Save");
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        },
        handleCopyPaste: function (o, e, opts) {
            var me = this;
            if (me.api) {
                var result = opts.action == "copy" ? me.api.Copy() : me.api.Paste();
                if (!result) {
                    Ext.create("Common.view.CopyWarning", {
                        listeners: {
                            close: function (cnt, eOpts) {
                                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                            }
                        }
                    }).show();
                }
                Common.component.Analytics.trackEvent("ToolBar", "Copy Warning");
            } else {
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            }
        },
        _handleUndo: function (btn) {
            if (this.api) {
                this.api.Undo();
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Undo");
        },
        _handleRedo: function (btn) {
            if (this.api) {
                this.api.Redo();
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Redo");
        },
        _onCanRevert: function (can, which) {
            if (which == "undo") {
                this._state.undo !== can && (this.getToolbar()["btnUndo"].setDisabled(!can));
                this._state.undo = can;
            } else {
                this._state.redo !== can && (this.getToolbar()["btnRedo"].setDisabled(!can));
                this._state.redo = can;
            }
        },
        _handleIncrease: function (btn) {
            if (this.api) {
                this.api.FontSizeIn();
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        _handleDecrease: function (btn) {
            if (this.api) {
                this.api.FontSizeOut();
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        _onSelectBullets: function (picker, record, id, pressed) {
            var btn = Ext.getCmp(id);
            if (btn) {
                if (typeof(pressed) == "boolean") {
                    btn.toggle(pressed, true);
                } else {
                    btn.toggle(!(record.data.data.subtype < 0), true);
                }
            }
            if (this.api) {
                this.api.put_ListType(record.data.data.type, record.data.data.subtype);
            }
            Common.component.Analytics.trackEvent("ToolBar", "List Type");
        },
        _clearBullets: function () {
            this.getToolbar().btnMarkers.toggle(false, true);
            this.getToolbar().btnNumbers.toggle(false, true);
            this.getToolbar().btnMultilevels.toggle(false, true);
            this.getToolbar().btnMarkers.menu.picker.selectByIndex(0);
            this.getToolbar().btnNumbers.menu.picker.selectByIndex(0);
            this.getToolbar().btnMultilevels.menu.picker.selectByIndex(0);
        },
        _onBullets: function (v) {
            var type = v.get_ListType();
            if (this._state.bullets.type != type || this._state.bullets.subtype != v.get_ListSubType() || this.getToolbar().btnMarkers.pressed && (type !== 0) || this.getToolbar().btnNumbers.pressed && (type !== 1) || this.getToolbar().btnMultilevels.pressed && (type !== 2)) {
                this._state.bullets.type = type;
                this._state.bullets.subtype = v.get_ListSubType();
                this._clearBullets();
                switch (this._state.bullets.type) {
                case 0:
                    this.getToolbar().btnMarkers.toggle(true, true);
                    this.getToolbar().btnMarkers.menu.picker.selectByIndex(this._state.bullets.subtype);
                    break;
                case 1:
                    var idx = 0;
                    switch (this._state.bullets.subtype) {
                    case 1:
                        idx = 4;
                        break;
                    case 2:
                        idx = 5;
                        break;
                    case 3:
                        idx = 6;
                        break;
                    case 4:
                        idx = 1;
                        break;
                    case 5:
                        idx = 2;
                        break;
                    case 6:
                        idx = 3;
                        break;
                    case 7:
                        idx = 7;
                        break;
                    }
                    this.getToolbar().btnNumbers.toggle(true, true);
                    this.getToolbar().btnNumbers.menu.picker.selectByIndex(idx);
                    break;
                case 2:
                    this.getToolbar().btnMultilevels.toggle(true, true);
                    this.getToolbar().btnMultilevels.menu.picker.selectByIndex(this._state.bullets.subtype);
                    break;
                }
            }
        },
        _clearChecked: function (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].setChecked) {
                    items[i].setChecked(false, true);
                }
            }
        },
        _handleHorizontalAlign: function (type) {
            if (this.api) {
                this.api.put_PrAlign(type);
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Align");
        },
        _handleMenuHorizontalAlign: function (menu, item, opt) {
            this.getBtnHorizontalAlign().removeCls(this.getBtnHorizontalAlign().icls);
            this.getBtnHorizontalAlign().icls = !item.checked ? "halign-left" : item.icls;
            this.getBtnHorizontalAlign().addCls(this.getBtnHorizontalAlign().icls);
            if (this.api && item.checked) {
                this.api.put_PrAlign(item.halign);
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Horizontal Align");
        },
        _onParagraphAlign: function (v) {
            var index = -1,
            align, toolbar = this.getToolbar();
            switch (v) {
            case 0:
                index = 2;
                align = "halign-right";
                break;
            case 1:
                index = 0;
                align = "halign-left";
                break;
            case 2:
                index = 1;
                align = "halign-center";
                break;
            case 3:
                index = 3;
                align = "halign-just";
                break;
            default:
                index = -255;
                align = "halign-left";
                break;
            }
            if (! (index < 0)) {
                this.getBtnHorizontalAlign().menu.items.items[index].setChecked(true);
            } else {
                if (index == -255) {
                    this._clearChecked(this.getBtnHorizontalAlign().menu.items.items);
                }
            }
            this.getBtnHorizontalAlign().removeCls(this.getBtnHorizontalAlign().icls);
            this.getBtnHorizontalAlign().icls = align;
            this.getBtnHorizontalAlign().addCls(align);
            if (v === null || v === undefined) {
                toolbar.btnAlignRight.rendered && toolbar.btnAlignRight.toggle(false, true);
                toolbar.btnAlignLeft.rendered && toolbar.btnAlignLeft.toggle(false, true);
                toolbar.btnAlignCenter.rendered && toolbar.btnAlignCenter.toggle(false, true);
                toolbar.btnAlignJust.rendered && toolbar.btnAlignJust.toggle(false, true);
                return;
            }
            switch (v) {
            case 0:
                toolbar.btnAlignRight.rendered && toolbar.btnAlignRight.toggle(true, false);
                break;
            case 1:
                toolbar.btnAlignLeft.rendered && toolbar.btnAlignLeft.toggle(true, false);
                break;
            case 2:
                toolbar.btnAlignCenter.rendered && toolbar.btnAlignCenter.toggle(true, false);
                break;
            case 3:
                toolbar.btnAlignJust.rendered && toolbar.btnAlignJust.toggle(true, false);
                break;
            }
        },
        _mnuOpenImageFromURL: function () {
            var w = Ext.create("Common.view.ImageFromUrlDialog", {});
            w.addListener("onmodalresult", Ext.bind(this._onOpenImageFromURL, [this, w]), false);
            w.addListener("close", Ext.bind(function (cnt, eOpts) {
                this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            },
            this));
            w.show();
        },
        _onOpenImageFromURL: function (mr) {
            var self = this[0];
            var url = this[1].txtUrl;
            if (mr == 1 && self.api) {
                var checkurl = url.value.replace(/ /g, "");
                if (checkurl != "") {
                    self.getToolbar().fireEvent("insertimage", self.getToolbar());
                    self.api.AddImageUrl(url.value);
                    Common.component.Analytics.trackEvent("ToolBar", "Image");
                } else {
                    Ext.MessageBox.show({
                        msg: self.textEmptyImgUrl,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR,
                        width: 300,
                        fn: Ext.bind(function (buttonId, text, opt) {
                            self.getToolbar().fireEvent("editcomplete", self.getToolbar());
                        },
                        self)
                    });
                }
            }
        },
        _onLineSpacing: function (vc) {
            if (vc.get_Line() === null || vc.get_LineRule() === null || vc.get_LineRule() != 1) {
                Ext.each(this.getMenuLineSpace().items.items, function (item) {
                    item.setChecked(false, true);
                },
                this);
                return;
            }
            var line = vc.get_Line();
            if (Math.abs(line - 1) < 0.0001) {
                this.getMenuLineSpace().items.items[0].setChecked(true, true);
            } else {
                if (Math.abs(line - 1.15) < 0.0001) {
                    this.getMenuLineSpace().items.items[1].setChecked(true, true);
                } else {
                    if (Math.abs(line - 1.5) < 0.0001) {
                        this.getMenuLineSpace().items.items[2].setChecked(true, true);
                    } else {
                        if (Math.abs(line - 2) < 0.0001) {
                            this.getMenuLineSpace().items.items[3].setChecked(true, true);
                        } else {
                            if (Math.abs(line - 2.5) < 0.0001) {
                                this.getMenuLineSpace().items.items[4].setChecked(true, true);
                            } else {
                                if (Math.abs(line - 3) < 0.0001) {
                                    this.getMenuLineSpace().items.items[5].setChecked(true, true);
                                } else {
                                    Ext.each(this.getMenuLineSpace().items.items, function (item) {
                                        item.setChecked(false, true);
                                    },
                                    this);
                                }
                            }
                        }
                    }
                }
            }
        },
        _handleHyperlinkOptions: function (btn) {
            var win, props, text;
            var me = this;
            if (me.api) {
                text = me.api.can_AddHyperlink();
                if (text !== false) {
                    win = Ext.create("DE.view.HyperlinkSettingsDialog");
                    props = new CHyperlinkProperty();
                    props.put_Text(text);
                    win.setSettings(props);
                } else {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && Ext.isArray(selectedElements)) {
                        for (var i = 0; i < selectedElements.length; i++) {
                            if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.Hyperlink) {
                                props = selectedElements[i].get_ObjectValue();
                            }
                        }
                    }
                    if (props) {
                        win = Ext.create("DE.view.HyperlinkSettingsDialog");
                        win.setSettings(props);
                    }
                }
            }
            if (win) {
                win.addListener("onmodalresult", function (mr) {
                    if (mr == 1) {
                        props = win.getSettings();
                        (text !== false) ? me.api.add_Hyperlink(props) : me.api.change_Hyperlink(props);
                    }
                    me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                },
                false);
                win.addListener("close", function () {
                    me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                },
                false);
                win.show();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Add Hyperlink");
        },
        _onCanAddHyperlink: function (value) {
            var need_disable = !value || this._state.prcontrolsdisable;
            if (need_disable != this.getToolbar().btnInsertHyperlink.isDisabled()) {
                this.getToolbar().btnInsertHyperlink.setDisabled(need_disable);
            }
        },
        _onFocusObject: function (SelectedObjects) {
            var pr, sh, i = -1,
            type;
            var paragraph_locked = false,
            header_locked = false,
            can_add_table = false,
            enable_dropcap = undefined,
            disable_dropcapadv = true;
            var frame_pr = undefined;
            while (++i < SelectedObjects.length) {
                type = SelectedObjects[i].get_ObjectType();
                pr = SelectedObjects[i].get_ObjectValue();
                if (type == c_oAscTypeSelectElement.Paragraph) {
                    paragraph_locked = pr.get_Locked();
                    can_add_table = pr.get_CanAddTable();
                    frame_pr = pr;
                } else {
                    if (type == c_oAscTypeSelectElement.Header) {
                        header_locked = pr.get_Locked();
                    }
                }
                if (type === c_oAscTypeSelectElement.Table || type === c_oAscTypeSelectElement.Header || type === c_oAscTypeSelectElement.Image) {
                    enable_dropcap = false;
                }
                if (enable_dropcap !== false && type == c_oAscTypeSelectElement.Paragraph) {
                    enable_dropcap = true;
                }
            }
            var need_disable = paragraph_locked || header_locked;
            if (this._state.prcontrolsdisable != need_disable) {
                this._state.prcontrolsdisable = need_disable;
                Ext.each(this.getToolbar().paragraphControls, function (item) {
                    item.setDisabled(need_disable);
                },
                this);
            }
            if (enable_dropcap && frame_pr) {
                var value = frame_pr.get_FramePr();
                var drop_value = c_oAscDropCap.None;
                if (value !== undefined) {
                    drop_value = value.get_DropCap();
                    enable_dropcap = (drop_value === c_oAscDropCap.Drop || drop_value === c_oAscDropCap.Margin);
                    disable_dropcapadv = false;
                } else {
                    enable_dropcap = frame_pr.get_CanAddDropCap();
                }
                if (enable_dropcap) {
                    this._onDropCap(drop_value);
                }
            }
            need_disable = need_disable || !enable_dropcap;
            if (need_disable !== this.getToolbar().btnDropCap.isDisabled()) {
                this.getToolbar().btnDropCap.setDisabled(need_disable);
            }
            if (!this.getToolbar().btnDropCap.isDisabled() && disable_dropcapadv !== this.getMnuDropCapAdvanced().isDisabled()) {
                this.getMnuDropCapAdvanced().setDisabled(disable_dropcapadv);
            }
            need_disable = !can_add_table || header_locked;
            if (need_disable != this.getToolbar().btnInsertTable.isDisabled()) {
                this.getToolbar().btnInsertTable.setDisabled(need_disable);
            }
            need_disable = this.getToolbar().pageNumCurrentPos.isDisabled() && this.getToolbar().pageNumHeaderFooter.isDisabled();
            if (need_disable != this.getToolbar().mnuInsertPageNum.isDisabled()) {
                this.getToolbar().mnuInsertPageNum.setDisabled(need_disable);
            }
        },
        _onStyleChange: function (v) {
            this.getToolbar().btnCopyStyle.toggle(v, true);
        },
        _onPageSize: function (w, h) {
            var cmp_w = w,
            cmp_h = h;
            if (this.getBtnPageSize()) {
                Ext.each(this.getBtnPageSize().menu.items.items, function (item) {
                    if (Math.abs(item.pagesize[0] - cmp_w) < 0.01 && Math.abs(item.pagesize[1] - cmp_h) < 0.01) {
                        item.setChecked(true, true);
                        this.getBtnPageSize().pagesize[0] = cmp_w;
                        this.getBtnPageSize().pagesize[1] = cmp_h;
                    }
                },
                this);
            }
        },
        _onPageOrient: function (isportrait) {
            if (this.getToolbar()) {
                this.getToolbar().btnPageOrient.toggle(!isportrait, true);
            }
        },
        _onLockDocumentProps: function () {
            this.getToolbar().btnPageOrient.setDisabled(true);
            this.getBtnPageSize().setDisabled(true);
        },
        _onUnLockDocumentProps: function () {
            this.getToolbar().btnPageOrient.setDisabled(false);
            this.getBtnPageSize().setDisabled(false);
        },
        _onLockDocumentSchema: function () {
            this.getToolbar().btnColorSchemas.setDisabled(true);
        },
        _onUnLockDocumentSchema: function () {
            this.getToolbar().btnColorSchemas.setDisabled(false);
        },
        _onParagraphStyleChange: function (name) {
            if (this._state.prstyle != name) {
                this._state.prstyle = name;
                var listStylesVisible = (this.getListStyles().rendered && this.getListStyles().getEl() && this.getListStyles().getEl().up("#id-toolbar-full-group-styles") && this.getListStyles().getEl().up("#id-toolbar-full-group-styles").isVisible());
                if (listStylesVisible) {
                    this.getListStyles().suspendEvents(false);
                    var styleIndex = this.getListStyles().dataMenu.picker.store.findBy(function (record, id) {
                        return (record.data.title === name);
                    },
                    this);
                    this.getListStyles().selectByIndex(styleIndex);
                    this.getListStyles().resumeEvents();
                }
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
            var canvasDocStyles = document.createElement("canvas");
            canvasDefaultStyles.id = "bigimgdefaultstyles";
            canvasDocStyles.id = "bigimgdocstyles";
            var isDefaultStylesLoad = !(styles.get_DefaultStylesImage().length > 0);
            var isDocStylesLoad = !(styles.get_DocStylesImage().length > 0);
            var fillStyles = function () {
                if (isDefaultStylesLoad && isDocStylesLoad) {
                    self.getListStyles().dataMenu.picker.store.removeAll();
                    Ext.each(styles.get_MergedStyles(), function (style) {
                        var thumb = document.createElement("canvas");
                        thumb.width = styles.get_STYLE_THUMBNAIL_WIDTH();
                        thumb.height = styles.get_STYLE_THUMBNAIL_HEIGHT();
                        var ctx = thumb.getContext("2d");
                        ctx.save();
                        ctx.translate(0, -style.get_ThumbnailOffset() * styles.get_STYLE_THUMBNAIL_HEIGHT());
                        ctx.drawImage(((style.get_Type() == c_oAscStyleImage.Default) ? canvasDefaultStyles : canvasDocStyles), 0, 0);
                        ctx.restore();
                        self.getListStyles().dataMenu.picker.store.add({
                            imageUrl: thumb.toDataURL(),
                            title: style.get_Name(),
                            uid: Ext.id()
                        });
                    });
                    var listStylesVisible = (self.getListStyles().rendered && self.getListStyles().getEl() && self.getListStyles().getEl().up("#id-toolbar-full-group-styles") && self.getListStyles().getEl().up("#id-toolbar-full-group-styles").isVisible());
                    if (self.getListStyles().dataMenu.picker.store.getCount() > 0 && listStylesVisible) {
                        self.getListStyles().fillComboView(self.getListStyles().dataMenu.picker.store.getAt(0), true);
                        self.getListStyles().selectByIndex(0);
                        self.getToolbar().fireEvent("editcomplete", this);
                    }
                }
                window.styles_loaded = true;
            };
            var imgDefaultStyles = new Image();
            var imgDocStyles = new Image();
            imgDefaultStyles.onload = function () {
                canvasDefaultStyles.width = imgDefaultStyles.width;
                canvasDefaultStyles.height = imgDefaultStyles.height;
                canvasDefaultStyles.getContext("2d").drawImage(imgDefaultStyles, 0, 0);
                isDefaultStylesLoad = true;
                fillStyles();
            };
            imgDocStyles.onload = function () {
                canvasDocStyles.width = imgDocStyles.width;
                canvasDocStyles.height = imgDocStyles.height;
                canvasDocStyles.getContext("2d").drawImage(imgDocStyles, 0, 0);
                isDocStylesLoad = true;
                fillStyles();
            };
            imgDefaultStyles.src = styles.get_DefaultStylesImage();
            imgDocStyles.src = styles.get_DocStylesImage();
        },
        FillAutoShapes: function () {
            var shapesStore = Ext.getStore("ShapeGroups");
            var me = this;
            me.getBtnInsertShape().menu.removeAll();
            for (var i = 0; i < shapesStore.getCount() - 1; i++) {
                var shapeGroup = shapesStore.getAt(i);
                var mnu = Ext.widget("menuitem", {
                    text: shapeGroup.data.groupName,
                    hideOnClick: false,
                    cls: "menu-item-noicon",
                    menu: Ext.create("Common.component.MenuDataViewPicker", {
                        width: shapeGroup.data.groupWidth,
                        height: shapeGroup.data.groupHeight,
                        store: shapeGroup.data.groupStore,
                        viewData: [],
                        contentWidth: shapeGroup.data.groupWidth - 20,
                        listeners: {
                            select: Ext.bind(function (picker, record) {
                                if (me.api) {
                                    me._addAutoshape(true, record.data.data.shapeType);
                                    me._isAddingShape = true;
                                    Common.component.Analytics.trackEvent("ToolBar", "Add Shape");
                                }
                            },
                            this),
                            hide: function () {
                                me.getToolbar().fireEvent("editcomplete", me.getToolbar(), me.getBtnInsertShape());
                            },
                            show: function (cmp) {
                                cmp.picker.selectByIndex(-1, false);
                            }
                        },
                        plugins: [{
                            ptype: "menuexpand"
                        }]
                    }),
                    deferExpandMenu: function () {
                        if (!this.menu.rendered || !this.menu.isVisible()) {
                            this.parentMenu.activeChild = this.menu;
                            this.menu.parentItem = this;
                            this.menu.parentMenu = this.menu.ownerCt = this.parentMenu;
                            (me.shapeMenuExpandLeft) ? this.menu.showBy(this, "tr-tl?", [-this.menu.width, 0]) : this.menu.showBy(this, "tl-tr?");
                        }
                    }
                });
                me.getBtnInsertShape().menu.add(mnu);
            }
        },
        _onEndAddShape: function () {
            this.getToolbar().fireEvent("insertshape", this.getToolbar());
            if (this.getBtnInsertShape().pressed) {
                this.getBtnInsertShape().toggle(false, true);
            }
            if (this.getToolbar().btnInsertText.pressed) {
                this.getToolbar().btnInsertText.toggle(false, true);
            }
            Ext.FocusManager.removeListener("componentfocus", this.checkInsertAutoshape, this);
        },
        _addAutoshape: function (isstart, type) {
            if (isstart) {
                this.api.StartAddShape(type, true);
                Ext.FocusManager.addListener("componentfocus", this.checkInsertAutoshape, this);
            } else {
                this.api.StartAddShape("", false);
                Ext.FocusManager.removeListener("componentfocus", this.checkInsertAutoshape, this);
            }
        },
        checkInsertAutoshape: function (fm, cmp) {
            if (this.getToolbar().btnInsertText.pressed || this.getBtnInsertShape().pressed) {
                if (cmp.id != "editor_sdk" && ((this.getToolbar().btnInsertText.pressed && cmp.id != this.getToolbar().btnInsertText.id) || (this.getBtnInsertShape().pressed && cmp.id != this.getBtnInsertShape().id))) {
                    this._toggleFromMenuHide = false;
                    this._isAddingShape = false;
                    this._addAutoshape(false);
                    this.getBtnInsertShape().toggle(false, false);
                    this.getToolbar().btnInsertText.toggle(false, false);
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            }
        },
        getHexColor: function (r, g, b) {
            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
            if (r.length == 1) {
                r = "0" + r;
            }
            if (g.length == 1) {
                g = "0" + g;
            }
            if (b.length == 1) {
                b = "0" + b;
            }
            return r + g + b;
        },
        onCoAuthoringDisconnect: function () {
            this.getToolbar().setMode({
                isDisconnected: true
            });
        },
        onZoomChange: function (percent, type) {
            this.getToolbar().btnFitPage.setChecked(type == 2, true);
            this.getToolbar().btnFitWidth.setChecked(type == 1, true);
            this.getToolbar().txtZoom.setText(percent + "%");
        },
        _handleDropCap: function (menu, item, opt) {
            if (item.dropcap === undefined) {
                return;
            }
            if (this.api && item.checked) {
                if (item.dropcap === c_oAscDropCap.None) {
                    this.api.removeDropcap(true);
                } else {
                    var SelectedObjects = this.api.getSelectedElements(),
                    i = -1;
                    while (++i < SelectedObjects.length) {
                        if (SelectedObjects[i].get_ObjectType() == c_oAscTypeSelectElement.Paragraph) {
                            var pr = SelectedObjects[i].get_ObjectValue();
                            var value = pr.get_FramePr();
                            if (value !== undefined) {
                                value = new CParagraphFrame();
                                value.put_FromDropCapMenu(true);
                                value.put_DropCap(item.dropcap);
                                this.api.put_FramePr(value);
                            } else {
                                this.api.asc_addDropCap((item.dropcap === c_oAscDropCap.Drop));
                            }
                            break;
                        }
                    }
                }
            }
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            Common.component.Analytics.trackEvent("ToolBar", "Drop Cap");
        },
        _onDropCap: function (v) {
            if (this._state.dropcap === v) {
                return;
            }
            var index = -1;
            switch (v) {
            case c_oAscDropCap.None:
                index = 0;
                break;
            case c_oAscDropCap.Drop:
                index = 1;
                break;
            case c_oAscDropCap.Margin:
                index = 2;
                break;
            }
            if (index < 0) {
                this._clearChecked(this.getBtnDropCap().menu.items.items);
            } else {
                this.getBtnDropCap().menu.items.items[index].setChecked(true);
            }
            this._state.dropcap = v;
        },
        _handleDropCapAdvanced: function () {
            var win, props, text;
            var me = this;
            if (me.fontstore === undefined) {
                me.fontstore = Ext.create("Ext.data.Store", {
                    storeId: Ext.id(),
                    model: "Common.model.Font"
                });
                var fonts = me.getToolbar().cmbFont.getStore().data.items;
                var arr = [];
                Ext.each(fonts, function (font, index) {
                    if (!font.data.cloneid) {
                        arr.push(Ext.clone(font.data));
                    }
                });
                me.fontstore.loadData(arr);
            }
            if (me.api) {
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && Ext.isArray(selectedElements)) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.Paragraph) {
                            props = selectedElements[i].get_ObjectValue();
                            break;
                        }
                    }
                }
                if (props) {
                    var paragraph_config = {
                        tableStylerRows: 2,
                        tableStylerColumns: 1,
                        fontStore: me.fontstore
                    };
                    win = Ext.create("DE.view.DropcapSettingsAdvanced", paragraph_config);
                    if (win) {
                        win.updateMetricUnit();
                        win.setSettings({
                            paragraphProps: props,
                            borderProps: me.borderAdvancedProps,
                            api: me.api,
                            colorProps: [me.getToolbar().effectcolors, me.getToolbar().standartcolors]
                        });
                        win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                            if (mr == 1 && s) {
                                me.borderAdvancedProps = s.borderProps;
                                if (s.paragraphProps && s.paragraphProps.get_DropCap() === c_oAscDropCap.None) {
                                    me.api.removeDropcap(true);
                                } else {
                                    me.api.put_FramePr(s.paragraphProps);
                                }
                            }
                            me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                        },
                        me), false);
                        win.addListener("close", function () {
                            me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                        },
                        false);
                        win.show();
                    }
                }
            }
        },
        _handleMenuSchemas: function (menu, menuitem) {
            this.api.ChangeColorScheme(menuitem.schemaType);
            Common.component.Analytics.trackEvent("ToolBar", "Color Scheme");
        },
        loadStyles: function () {
            var styles = this.api.get_PropertyEditorStyles();
            if (styles) {
                this._onInitEditorStyles(styles);
            }
        },
        createDelayedElements: function () {
            var btn = this.getToolbar().btnMarkers;
            btn.menu.addListener("select", Ext.bind(this._onSelectBullets, this, [btn.id, 2], 2), this);
            btn.menu.addListener("hide", Ext.bind(function () {
                this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            },
            this));
            btn = this.getToolbar().btnNumbers;
            btn.menu.addListener("select", Ext.bind(this._onSelectBullets, this, [btn.id, 2], 2), this);
            btn.menu.addListener("hide", Ext.bind(function () {
                this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            },
            this));
            btn = this.getToolbar().btnMultilevels;
            btn.menu.addListener("select", Ext.bind(this._onSelectBullets, this, [btn.id, 2], 2), this);
            btn.menu.addListener("hide", Ext.bind(function () {
                this.getToolbar().fireEvent("editcomplete", this.getToolbar());
            },
            this));
            this.api.asc_registerCallback("asc_onFontSize", Ext.bind(this._onFontSize, this));
            this.api.asc_registerCallback("asc_onBold", Ext.bind(this._onBold, this));
            this.api.asc_registerCallback("asc_onItalic", Ext.bind(this._onItalic, this));
            this.api.asc_registerCallback("asc_onUnderline", Ext.bind(this._onUnderline, this));
            this.api.asc_registerCallback("asc_onStrikeout", Ext.bind(this._onStrikeout, this));
            this.api.asc_registerCallback("asc_onVerticalAlign", Ext.bind(this._onVerticalAlign, this));
            this.api.asc_registerCallback("asc_onCanUndo", Ext.bind(this._onCanRevert, this, ["undo"], true));
            this.api.asc_registerCallback("asc_onCanRedo", Ext.bind(this._onCanRevert, this, ["redo"], true));
            this.api.asc_registerCallback("asc_onListType", Ext.bind(this._onBullets, this));
            this.api.asc_registerCallback("asc_onPrAlign", Ext.bind(this._onParagraphAlign, this));
            this.api.asc_registerCallback("asc_onParaSpacingLine", Ext.bind(this._onLineSpacing, this));
            this.api.asc_registerCallback("asc_onCanAddHyperlink", Ext.bind(this._onCanAddHyperlink, this));
            this.api.asc_registerCallback("asc_onFocusObject", Ext.bind(this._onFocusObject, this));
            this.api.asc_registerCallback("asc_onPaintFormatChanged", Ext.bind(this._onStyleChange, this));
            this.api.asc_registerCallback("asc_onDocSize", Ext.bind(this._onPageSize, this));
            this.api.asc_registerCallback("asc_onPageOrient", Ext.bind(this._onPageOrient, this));
            this.api.asc_registerCallback("asc_onLockDocumentProps", Ext.bind(this._onLockDocumentProps, this));
            this.api.asc_registerCallback("asc_onUnLockDocumentProps", Ext.bind(this._onUnLockDocumentProps, this));
            this.api.asc_registerCallback("asc_onParaStyleName", Ext.bind(this._onParagraphStyleChange, this));
            this.api.asc_registerCallback("asc_onEndAddShape", Ext.bind(this._onEndAddShape, this));
            this.api.asc_registerCallback("asc_onLockDocumentSchema", Ext.bind(this._onLockDocumentSchema, this));
            this.api.asc_registerCallback("asc_onUnLockDocumentSchema", Ext.bind(this._onUnLockDocumentSchema, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
            this.api.asc_registerCallback("asc_onZoomChange", Ext.bind(this.onZoomChange, this));
            this.api.asc_registerCallback("asc_onStartAction", Ext.bind(_onLongActionBegin, this));
            this.api.asc_registerCallback("asc_onEndAction", Ext.bind(_onLongActionEnd, this));
            this._onPageSize(this.api.get_DocumentWidth(), this.api.get_DocumentHeight());
        },
        textEmptyImgUrl: "You need to specify image URL.",
        textWarning: "Warning",
        textFontSizeErr: "The entered value must be more than 0"
    };
} ()));