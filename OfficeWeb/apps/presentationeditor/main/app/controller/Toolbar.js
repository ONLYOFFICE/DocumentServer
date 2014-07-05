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
 Ext.define("PE.controller.Toolbar", {
    extend: "Ext.app.Controller",
    requires: ["Common.view.ImageFromUrlDialog", "Common.view.CopyWarning", "PE.view.HyperlinkSettings", "PE.view.InsertTableDialog", "PE.view.SlideSizeSettings", "Common.component.MenuDataViewPicker", "Ext.data.Store", "Common.plugin.MenuExpand", "Ext.util.Cookies"],
    views: ["Toolbar"],
    refs: [{
        ref: "toolbar",
        selector: "petoolbar"
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
        ref: "listTheme",
        selector: "#toolbar-combo-view-themes"
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
        ref: "btnVerticalAlign",
        selector: "#toolbar-button-valign"
    }],
    flg: {},
    init: function () {
        this._state = {
            ThemeIdx: 0,
            bullets: {
                type: undefined,
                subtype: undefined
            },
            undo: undefined,
            redo: undefined,
            prcontrolsdisable: undefined,
            slidecontrolsdisable: undefined,
            slidelayoutdisable: undefined,
            shapecontrolsdisable: undefined,
            prstyleNoStyles: true
        };
        this._isAddingShape = false;
        this.SchemeNames = [this.txtScheme1, this.txtScheme2, this.txtScheme3, this.txtScheme4, this.txtScheme5, this.txtScheme6, this.txtScheme7, this.txtScheme8, this.txtScheme9, this.txtScheme10, this.txtScheme11, this.txtScheme12, this.txtScheme13, this.txtScheme14, this.txtScheme15, this.txtScheme16, this.txtScheme17, this.txtScheme18, this.txtScheme19, this.txtScheme20, this.txtScheme21];
        this.slideSizeArr = [[254, 190.5], [254, 143], [254, 158.7], [254, 190.5], [338.3, 253.7], [355.6, 266.7], [275, 190.5], [300.7, 225.5], [199.1, 149.3], [285.7, 190.5], [254, 190.5], [203.2, 25.4]];
        this.currentPageSize = {
            type: -1,
            width: 0,
            height: 0
        };
        this.control({
            "petoolbar": {
                afterrender: function () {
                    var owner = this.getToolbar().ownerCt;
                    if (Ext.isDefined(owner)) {
                        owner.addListener("resize", Ext.bind(this.resizeToolbar, this));
                    }
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
            "#toolbar-menu-horalign": {
                click: this._handleHorizontalAlign
            },
            "#toolbar-menu-vertalign": {
                click: this._handleVerticalAlign
            },
            "#toolbar-menu-horalign menuitem": {
                beforecheckchange: function (item) {
                    if (!item.checked) {
                        this._clearChecked(this.getBtnHorizontalAlign().menu.items.items);
                    }
                }
            },
            "#toolbar-menu-insert-table": {
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "#toolbar-menu-insert-table pedimensionpicker": {
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
                    var win = Ext.create("PE.view.InsertTableDialog", {});
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
            "#toolbar-button-insert-hyperlink": {
                click: function (btn) {
                    this._handleHyperlinkOptions();
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
            "#toolbar-combo-view-themes": {
                select: function (combo, record) {
                    if (this.api) {
                        this.api.ChangeTheme(record.data.data.themeId);
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
                    if (this.themes) {
                        this._onInitEditorThemes(this.themes[0], this.themes[1]);
                        delete this.themes;
                    }
                }
            },
            "#toolbar-button-preview": {
                click: function (btn) {
                    var previewPanel = Ext.getCmp("pe-preview");
                    if (previewPanel) {
                        previewPanel.setPosition(0, 0);
                        previewPanel.setSize(Ext.getBody().getWidth(), Ext.getBody().getHeight());
                        previewPanel.show();
                        Ext.getCmp("pe-applicationUI").hide();
                    }
                    if (this.api) {
                        var current = this.api.getCurrentPage();
                        this.api.StartDemonstration("presentation-preview", Ext.isNumber(current) ? current : 0);
                        Common.component.Analytics.trackEvent("ToolBar", "Preview");
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
                    btn.getEl().on("mousedown", function (event, element, eOpts) {
                        this._toggleFromMenuHide = false;
                    },
                    this);
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
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
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
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                    Common.component.Analytics.trackEvent("ToolBar", "Add Text");
                }
            },
            "#toolbar-menu-color-schemas": {
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            },
            "#toolbar-menu-shape-align": {
                click: this._handleShapeAlign
            },
            "#toolbar-menu-shape-arrange": {
                click: this._handleShapeArrange
            },
            "#toolbar-menu-slide-size": {
                click: function (menu, item, opt) {
                    if (item.slidetype !== undefined) {
                        this.currentPageSize = {
                            type: item.slidetype,
                            width: this.slideSizeArr[item.slidetype][0],
                            height: this.slideSizeArr[item.slidetype][1]
                        };
                        if (this.api) {
                            this.api.changeSlideSize(this.slideSizeArr[item.slidetype][0], this.slideSizeArr[item.slidetype][1]);
                        }
                        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                        Common.component.Analytics.trackEvent("ToolBar", "Slide Size");
                    } else {
                        this._mnuOpenSlideSize();
                    }
                },
                hide: function () {
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
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
                            mnucmp.selectMenu("menuFile", "menuSlides");
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
            "#mnu-hide-bars-toolbar": {
                click: function (item) {
                    this.getToolbar().changeViewMode(item.checked);
                    window.localStorage.setItem("pe-compact-toolbar", item.checked ? 1 : 0);
                    if (this._state.prstyleNoStyles && !item.checked) {
                        if (this.getListTheme().dataMenu.picker.store.getCount() > 0) {
                            this.getListTheme().selectByIndex((this._state.ThemeIdx >= 0) ? this._state.ThemeIdx : 0);
                        }
                    }
                    this._state.prstyleNoStyles = false;
                    this.getToolbar().fireEvent("editcomplete", this.getToolbar());
                }
            }
        });
    },
    _onLongActionBegin: function (type, id) {
        switch (id) {
        case c_oAscAsyncAction.Save:
            this.getToolbar().btnSave.disable();
            Ext.ComponentQuery.query("pefile")[0].btnSave.disable();
            break;
        }
    },
    _onLongActionEnd: function (type, id) {
        switch (id) {
        case c_oAscAsyncAction.Save:
            this.getToolbar().btnSave.enable();
            Ext.ComponentQuery.query("pefile")[0].btnSave.enable();
            break;
        }
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
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        }
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
                var value = [combo.getPicker().getRecord(record).data.sizestring];
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
            this.flg.setFontSize = true;
            combo.getStore().clearFilter(false);
            combo.setRawValue(value);
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
            this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        }
    },
    _onFontSize: function (size) {
        if (!this.flg.setFontSize && size !== undefined) {
            var str_size = String(size);
            if (this.getCmbFontSize().getValue() != str_size) {
                this.getCmbFontSize().setValue(str_size);
            }
        }
    },
    _onBold: function (on) {
        this.getToolbar().btnBold.toggle(on, true);
    },
    _clickBold: function (btn) {
        if (this.api) {
            this.api.put_TextPrBold(btn.pressed);
        }
        this.getToolbar().fireEvent("editcomplete", this);
        Common.component.Analytics.trackEvent("ToolBar", "Bold");
    },
    _onItalic: function (on) {
        this.getToolbar().btnItalic.toggle(on, true);
    },
    _clickItalic: function (btn) {
        if (this.api) {
            this.api.put_TextPrItalic(btn.pressed);
        }
        this.getToolbar().fireEvent("editcomplete", this);
        Common.component.Analytics.trackEvent("ToolBar", "Italic");
    },
    _onUnderline: function (on) {
        this.getToolbar().btnUnderline.toggle(on, true);
    },
    _clickUnderline: function (btn) {
        if (this.api) {
            this.api.put_TextPrUnderline(btn.pressed);
        }
        this.getToolbar().fireEvent("editcomplete", this);
        Common.component.Analytics.trackEvent("ToolBar", "Underline");
    },
    _onStrikeout: function (on) {
        this.getToolbar().btnStrikeout.toggle(on, true);
    },
    _clickStrikeout: function (btn) {
        if (this.api) {
            this.api.put_TextPrStrikeout(btn.pressed);
        }
        this.getToolbar().fireEvent("editcomplete", this);
        Common.component.Analytics.trackEvent("ToolBar", "Strikeout");
    },
    _onSubScript: function (typeBaseline) {
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
        if (me.api && ((opts.action == "copy") && !me.api.Copy()) || ((opts.action == "paste") && !me.api.Paste())) {
            Ext.create("Common.view.CopyWarning", {
                listeners: {
                    close: function (cnt, eOpts) {
                        me.getToolbar().fireEvent("editcomplete", me.getToolbar());
                    }
                }
            }).show();
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
    _onStyleChange: function (v) {
        this.getToolbar().btnCopyStyle.toggle(v, true);
    },
    _onSelectBullets: function (picker, record, id, pressed) {
        this._clearBullets();
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
        this.getToolbar().btnMarkers.menu.picker.selectByIndex(0);
        this.getToolbar().btnNumbers.menu.picker.selectByIndex(0);
    },
    _onBullets: function (v) {
        if (this._state.bullets.type != v.get_ListType() || this._state.bullets.subtype != v.get_ListSubType()) {
            this._state.bullets.type = v.get_ListType();
            this._state.bullets.subtype = v.get_ListSubType();
            this._clearBullets();
            if (this._state.bullets.type == 0) {
                this.getToolbar().btnMarkers.toggle(true, true);
                this.getToolbar().btnMarkers.menu.picker.selectByIndex(this._state.bullets.subtype);
            } else {
                if (this._state.bullets.type == 1) {
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
                }
            }
        }
    },
    _oncanIncreaseIndent: function (value) {
        var need_disable = !value || this._state.prcontrolsdisable;
        if (this.getToolbar().btnIncLeftOffset.isDisabled() !== need_disable) {
            this.getToolbar().btnIncLeftOffset.setDisabled(need_disable);
        }
    },
    _oncanDecreaseIndent: function (value) {
        var need_disable = !value || this._state.prcontrolsdisable;
        if (this.getToolbar().btnDecLeftOffset.isDisabled() !== need_disable) {
            this.getToolbar().btnDecLeftOffset.setDisabled(need_disable);
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
    _clearChecked: function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i].setChecked(false, true);
        }
    },
    _handleHorizontalAlign: function (menu, item, opt) {
        this.getBtnHorizontalAlign().removeCls(this.getBtnHorizontalAlign().icls);
        this.getBtnHorizontalAlign().icls = !item.checked ? "halign-left" : item.icls;
        this.getBtnHorizontalAlign().addCls(this.getBtnHorizontalAlign().icls);
        if (this.api) {
            this.api.put_PrAlign(!item.checked ? "none" : item.halign);
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Horizontal Align");
    },
    _handleVerticalAlign: function (menu, item, opt) {
        this.getBtnVerticalAlign().removeCls(this.getBtnVerticalAlign().icls);
        this.getBtnVerticalAlign().icls = item.icls;
        this.getBtnVerticalAlign().addCls(this.getBtnVerticalAlign().icls);
        if (this.api) {
            this.api.setVerticalAlign(item.valign);
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
        Common.component.Analytics.trackEvent("ToolBar", "Vertical Align");
    },
    _onParagraphAlign: function (v) {
        var index = -1,
        align;
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
    },
    _onVerticalTextAlign: function (v) {
        var index = -1,
        align = "";
        switch (v) {
        case c_oAscVerticalTextAlign.TEXT_ALIGN_TOP:
            index = 0;
            align = "valign-top";
            break;
        case c_oAscVerticalTextAlign.TEXT_ALIGN_CTR:
            index = 1;
            align = "valign-middle";
            break;
        case c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM:
            index = 2;
            align = "valign-bottom";
            break;
        default:
            index = -255;
            align = "valign-middle";
            break;
        }
        if (! (index < 0)) {
            this.getBtnVerticalAlign().menu.items.items[index].setChecked(true);
        } else {
            if (index == -255) {
                this._clearChecked(this.getBtnVerticalAlign().menu.items.items);
            }
        }
        this.getBtnVerticalAlign().removeCls(this.getBtnVerticalAlign().icls);
        this.getBtnVerticalAlign().icls = align;
        this.getBtnVerticalAlign().addCls(align);
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
    _handleHyperlinkOptions: function (btn) {
        var win, props;
        var me = this;
        if (me.api) {
            var text = me.api.can_AddHyperlink();
            if (text !== false) {
                var _arr = [];
                for (var i = 0; i < me.api.getCountPages(); i++) {
                    _arr.push(i + 1);
                }
                win = Ext.create("PE.view.HyperlinkSettings", {
                    slides: _arr
                });
                props = new CHyperlinkProperty();
                props.put_Text(text);
                win.setSettings(props, me.api.getCurrentPage());
            }
        }
        if (win) {
            win.addListener("onmodalresult", function (mr) {
                if (mr == 1) {
                    props = win.getSettings();
                    me.api.add_Hyperlink(props);
                }
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            },
            false);
            win.addListener("close", function () {
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            });
            win.show();
        }
        Common.component.Analytics.trackEvent("ToolBar", "Add Hyperlink");
    },
    _onCanAddHyperlink: function (value) {
        var need_disable = !value || this._state.prcontrolsdisable;
        if (need_disable !== this.getToolbar().btnInsertHyperlink.isDisabled()) {
            this.getToolbar().btnInsertHyperlink.setDisabled(need_disable);
        }
    },
    _onInitEditorThemes: function (EditorThemes, DocumentThemes) {
        var self = this;
        if (!self.getListTheme()) {
            self.themes = [EditorThemes, DocumentThemes];
            return;
        }
        var defaultThemes = [];
        var docThemes = [];
        defaultThemes = defaultThemes.concat(EditorThemes);
        docThemes = docThemes.concat(DocumentThemes);
        self.getListTheme().dataMenu.picker.store.removeAll();
        Ext.each(defaultThemes, function (theme) {
            self.getListTheme().dataMenu.picker.store.add({
                imageUrl: theme.get_Image(),
                uid: Ext.id(),
                data: {
                    themeId: theme.get_Index()
                }
            });
        });
        Ext.each(docThemes, function (theme) {
            self.getListTheme().dataMenu.picker.store.add({
                imageUrl: theme.get_Image(),
                uid: Ext.id(),
                data: {
                    themeId: theme.get_Index()
                }
            });
        });
        var listStylesVisible = (self.getListTheme().rendered && self.getListTheme().getEl() && self.getListTheme().getEl().up("#id-toolbar-full-group-styles") && self.getListTheme().getEl().up("#id-toolbar-full-group-styles").isVisible());
        if (self.getListTheme().dataMenu.picker.store.getCount() > 0 && listStylesVisible) {
            self.getListTheme().fillComboView(self.getListTheme().dataMenu.picker.store.getAt(0), true);
            self.getListTheme().selectByIndex(0);
        }
    },
    _onUpdateThemeIndex: function (v) {
        if (this._state.ThemeIdx !== v) {
            this._state.ThemeIdx = v;
            var listStylesVisible = (this.getListTheme().rendered && this.getListTheme().getEl() && this.getListTheme().getEl().up("#id-toolbar-full-group-styles") && this.getListTheme().getEl().up("#id-toolbar-full-group-styles").isVisible());
            if (listStylesVisible) {
                this.getListTheme().suspendEvents(false);
                if (v < this.getListTheme().dataMenu.picker.store.getCount()) {
                    this.getListTheme().selectByIndex(v);
                }
                this.getListTheme().resumeEvents();
            }
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
                            me.getToolbar().fireEvent("editcomplete", me.getToolbar());
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
    _onSendThemeColorSchemes: function (schemas) {
        var me = this;
        me.getToolbar().btnColorSchemas.menu.removeAll();
        var schemeTpl = Ext.create("Ext.XTemplate", '<a class="x-menu-item-link">', '<span class="colors">', '<tpl for="colors">', '<span class="color" style="background: {color};"></span>', "</tpl>", "</span>", '<span class="text">{text}</span>', "</a>");
        for (var i = 0; i < schemas.length; i++) {
            var schema = schemas[i];
            var colors = schema.get_colors();
            var schemecolors = [];
            for (var j = 2; j < 7; j++) {
                var clr = "#" + this.getHexColor(colors[j].get_r(), colors[j].get_g(), colors[j].get_b());
                schemecolors.push({
                    color: clr
                });
            }
            var mnu = Ext.create("Ext.menu.Item", {
                cls: "menu-item-noicon asc-color-schemas-menu",
                data: {
                    text: (i < 21) ? me.SchemeNames[i] : schema.get_name(),
                    colors: schemecolors
                },
                tpl: schemeTpl,
                schemaType: i,
                listeners: {
                    click: Ext.bind(function (item) {
                        if (me.api) {
                            me.api.ChangeColorScheme(item.schemaType);
                            Common.component.Analytics.trackEvent("ToolBar", "Color Scheme");
                        }
                    },
                    this)
                }
            });
            if (i == 21) {
                me.getToolbar().btnColorSchemas.menu.add(Ext.create("Ext.menu.Separator", {}));
            }
            me.getToolbar().btnColorSchemas.menu.add(mnu);
        }
    },
    _handleShapeAlign: function (menu, item, opt) {
        if (item.halign < 6) {
            if (this.api) {
                this.api.put_ShapesAlign(item.halign);
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape Align");
        } else {
            if (item.halign == 6) {
                if (this.api) {
                    this.api.DistributeHorizontally();
                }
                Common.component.Analytics.trackEvent("ToolBar", "Distribute");
            } else {
                if (this.api) {
                    this.api.DistributeVertically();
                }
                Common.component.Analytics.trackEvent("ToolBar", "Distribute");
            }
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
    },
    _handleShapeArrange: function (menu, item, opt) {
        switch (item.halign) {
        case 1:
            if (this.api) {
                this.api.shapes_bringToFront();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
            break;
        case 2:
            if (this.api) {
                this.api.shapes_bringToBack();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
            break;
        case 3:
            if (this.api) {
                this.api.shapes_bringForward();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
            break;
        case 4:
            if (this.api) {
                this.api.shapes_bringBackward();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
            break;
        case 5:
            if (this.api) {
                this.api.groupShapes();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape Group");
            break;
        case 6:
            if (this.api) {
                this.api.unGroupShapes();
            }
            Common.component.Analytics.trackEvent("ToolBar", "Shape UnGroup");
            break;
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
    },
    _onCanGroup: function (value) {
        this.getToolbar().mnuGroupShapes.setDisabled(!value);
    },
    _onCanUnGroup: function (value) {
        this.getToolbar().mnuUnGroupShapes.setDisabled(!value);
    },
    _mnuOpenSlideSize: function () {
        var win, props;
        var me = this;
        if (this.api) {
            win = Ext.create("PE.view.SlideSizeSettings");
            win.updateMetricUnit();
            win.setSettings(me.currentPageSize.type, me.currentPageSize.width, me.currentPageSize.height);
        }
        if (win) {
            win.addListener("onmodalresult", function (mr) {
                if (mr == 1) {
                    props = win.getSettings();
                    me.currentPageSize = {
                        type: props[0],
                        width: props[1],
                        height: props[2]
                    };
                    me.getToolbar().btnSlideSize.menu.items.items[0].setChecked(props[0] == 0);
                    me.getToolbar().btnSlideSize.menu.items.items[1].setChecked(props[0] == 1);
                    if (me.api) {
                        me.api.changeSlideSize(props[1], props[2]);
                    }
                }
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            },
            false);
            win.addListener("close", function () {
                me.getToolbar().fireEvent("editcomplete", me.getToolbar());
            });
            win.show();
        }
        Common.component.Analytics.trackEvent("ToolBar", "Slide Size");
    },
    _onPresentationSize: function (width, height) {
        this.currentPageSize.width = width;
        this.currentPageSize.height = height;
        this.currentPageSize.type = -1;
        for (var i = 0; i < this.slideSizeArr.length; i++) {
            if (Math.abs(this.slideSizeArr[i][0] - this.currentPageSize.width) < 0.001 && Math.abs(this.slideSizeArr[i][1] - this.currentPageSize.height) < 0.001) {
                this.currentPageSize.type = i;
                break;
            }
        }
        this.getToolbar().btnSlideSize.menu.items.items[0].setChecked(this.currentPageSize.type == 0);
        this.getToolbar().btnSlideSize.menu.items.items[1].setChecked(this.currentPageSize.type == 1);
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
    _onLockDocumentProps: function () {
        this.getToolbar().btnSlideSize.setDisabled(true);
    },
    _onUnLockDocumentProps: function () {
        this.getToolbar().btnSlideSize.setDisabled(false);
    },
    _onLockDocumentTheme: function () {
        this.getListTheme().setDisabled(true);
        this.getToolbar().btnColorSchemas.setDisabled(true);
    },
    _onUnLockDocumentTheme: function () {
        this.getListTheme().setDisabled(false);
        this.getToolbar().btnColorSchemas.setDisabled(false);
    },
    _onFocusObject: function (SelectedObjects) {
        var pr, sh, i = -1,
        type;
        var paragraph_locked = undefined,
        shape_locked = undefined,
        slide_deleted = undefined,
        slide_layout_lock = undefined;
        while (++i < SelectedObjects.length) {
            type = SelectedObjects[i].get_ObjectType();
            pr = SelectedObjects[i].get_ObjectValue();
            if (type == c_oAscTypeSelectElement.Paragraph) {
                paragraph_locked = pr.get_Locked();
            } else {
                if (type == c_oAscTypeSelectElement.Slide) {
                    slide_deleted = pr.get_LockDelete();
                    slide_layout_lock = pr.get_LockLayout();
                } else {
                    if (type == c_oAscTypeSelectElement.Image || type == c_oAscTypeSelectElement.Shape || type == c_oAscTypeSelectElement.Chart) {
                        shape_locked = pr.get_Locked();
                    }
                }
            }
        }
        if ((paragraph_locked !== undefined || slide_deleted !== undefined) && this._state.prcontrolsdisable !== (paragraph_locked || slide_deleted)) {
            this._state.prcontrolsdisable = paragraph_locked || slide_deleted;
            Ext.each(this.getToolbar().paragraphControls, function (item) {
                item.setDisabled(this._state.prcontrolsdisable);
            },
            this);
        }
        if (shape_locked !== undefined && slide_deleted !== undefined && this._state.shapecontrolsdisable !== (shape_locked || slide_deleted)) {
            this._state.shapecontrolsdisable = shape_locked || slide_deleted;
            Ext.each(this.getToolbar().shapeControls, function (item) {
                item.setDisabled(this._state.shapecontrolsdisable);
            },
            this);
        }
        if (slide_deleted !== undefined && slide_layout_lock !== undefined && this._state.slidelayoutdisable !== (slide_layout_lock || slide_deleted)) {
            this._state.slidelayoutdisable = slide_layout_lock || slide_deleted;
            this.getToolbar().btnChangeSlide.setDisabled(this._state.slidelayoutdisable);
        }
        if (slide_deleted !== undefined && this._state.slidecontrolsdisable !== slide_deleted) {
            this._state.slidecontrolsdisable = slide_deleted;
            Ext.each(this.getToolbar().slideOnlyControls, function (item) {
                item.setDisabled(slide_deleted);
            },
            this);
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
        var themes = this.api.get_PropertyEditorThemes();
        if (themes) {
            this._onInitEditorThemes(themes[0], themes[1]);
        }
        this.api.asc_registerCallback("asc_onFontSize", Ext.bind(this._onFontSize, this));
        this.api.asc_registerCallback("asc_onBold", Ext.bind(this._onBold, this));
        this.api.asc_registerCallback("asc_onItalic", Ext.bind(this._onItalic, this));
        this.api.asc_registerCallback("asc_onUnderline", Ext.bind(this._onUnderline, this));
        this.api.asc_registerCallback("asc_onStrikeout", Ext.bind(this._onStrikeout, this));
        this.api.asc_registerCallback("asc_onVerticalAlign", Ext.bind(this._onSubScript, this));
        this.api.asc_registerCallback("asc_onCanUndo", Ext.bind(this._onCanRevert, this, ["undo"], true));
        this.api.asc_registerCallback("asc_onCanRedo", Ext.bind(this._onCanRevert, this, ["redo"], true));
        this.api.asc_registerCallback("asc_onPaintFormatChanged", Ext.bind(this._onStyleChange, this));
        this.api.asc_registerCallback("asc_onListType", Ext.bind(this._onBullets, this));
        this.api.asc_registerCallback("asc_canIncreaseIndent", Ext.bind(this._oncanIncreaseIndent, this));
        this.api.asc_registerCallback("asc_canDecreaseIndent", Ext.bind(this._oncanDecreaseIndent, this));
        this.api.asc_registerCallback("asc_onLineSpacing", Ext.bind(this._onLineSpacing, this));
        this.api.asc_registerCallback("asc_onPrAlign", Ext.bind(this._onParagraphAlign, this));
        this.api.asc_registerCallback("asc_onVerticalTextAlign", Ext.bind(this._onVerticalTextAlign, this));
        this.api.asc_registerCallback("asc_onCanAddHyperlink", Ext.bind(this._onCanAddHyperlink, this));
        this.api.asc_registerCallback("asc_onUpdateThemeIndex", Ext.bind(this._onUpdateThemeIndex, this));
        this.api.asc_registerCallback("asc_onEndAddShape", Ext.bind(this._onEndAddShape, this));
        this.api.asc_registerCallback("asc_onSendThemeColorSchemes", Ext.bind(this._onSendThemeColorSchemes, this));
        this.api.asc_registerCallback("asc_onCanGroup", Ext.bind(this._onCanGroup, this));
        this.api.asc_registerCallback("asc_onCanUnGroup", Ext.bind(this._onCanUnGroup, this));
        this.api.asc_registerCallback("asc_onPresentationSize", Ext.bind(this._onPresentationSize, this));
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        this.api.asc_registerCallback("asc_onZoomChange", Ext.bind(this.onZoomChange, this));
        this.api.asc_registerCallback("asc_onStartAction", Ext.bind(this._onLongActionBegin, this));
        this.api.asc_registerCallback("asc_onEndAction", Ext.bind(this._onLongActionEnd, this));
        this.api.asc_registerCallback("asc_onFocusObject", Ext.bind(this._onFocusObject, this));
        this.api.asc_registerCallback("asc_onLockDocumentProps", Ext.bind(this._onLockDocumentProps, this));
        this.api.asc_registerCallback("asc_onUnLockDocumentProps", Ext.bind(this._onUnLockDocumentProps, this));
        this.api.asc_registerCallback("asc_onLockDocumentTheme", Ext.bind(this._onLockDocumentTheme, this));
        this.api.asc_registerCallback("asc_onUnLockDocumentTheme", Ext.bind(this._onUnLockDocumentTheme, this));
        this._onPresentationSize(this.api.get_PresentationWidth(), this.api.get_PresentationHeight());
    },
    textEmptyImgUrl: "You need to specify image URL.",
    textWarning: "Warning",
    textFontSizeErr: "The entered value must be more than 0",
    txtScheme1: "Office",
    txtScheme2: "Grayscale",
    txtScheme3: "Apex",
    txtScheme4: "Aspect",
    txtScheme5: "Civic",
    txtScheme6: "Concourse",
    txtScheme7: "Equity",
    txtScheme8: "Flow",
    txtScheme9: "Foundry",
    txtScheme10: "Median",
    txtScheme11: "Metro",
    txtScheme12: "Module",
    txtScheme13: "Opulent",
    txtScheme14: "Oriel",
    txtScheme15: "Origin",
    txtScheme16: "Paper",
    txtScheme17: "Solstice",
    txtScheme18: "Technic",
    txtScheme19: "Trek",
    txtScheme20: "Urban",
    txtScheme21: "Verve"
});