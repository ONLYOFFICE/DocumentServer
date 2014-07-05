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
 Ext.define("DE.view.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    alias: "widget.detoolbar",
    cls: "de-toolbar",
    height: 68,
    minWidth: 1175,
    _state: {
        clrhighlight: undefined,
        clrtext: undefined
    },
    layout: {
        type: "hbox",
        align: "middle"
    },
    requires: ["Ext.data.Store", "Ext.data.Model", "Common.component.MenuDataViewPicker", "Common.component.SplitColorButton", "Common.component.ComboDataView", "DE.component.DimensionPicker", "Common.plugin.ComboBoxScrollPane", "Ext.form.field.ComboBox", "Common.view.ComboFonts", "Ext.Array", "Ext.util.Cookies", "Common.component.SynchronizeTip", "Common.component.ThemeColorPalette", "Common.plugin.MenuExpand", "Ext.util.Cookies"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        this.addEvents("editcomplete");
        this.addEvents("inserttable", "insertimage", "insertshape");
        this.paragraphControls = [];
        this.synchTooltip = undefined;
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        this.SchemeNames = [this.txtScheme1, this.txtScheme2, this.txtScheme3, this.txtScheme4, this.txtScheme5, this.txtScheme6, this.txtScheme7, this.txtScheme8, this.txtScheme9, this.txtScheme10, this.txtScheme11, this.txtScheme12, this.txtScheme13, this.txtScheme14, this.txtScheme15, this.txtScheme16, this.txtScheme17, this.txtScheme18, this.txtScheme19, this.txtScheme20, this.txtScheme21];
        var hidetip = window.localStorage.getItem("de-hide-synch");
        this.showSynchTip = !(hidetip && parseInt(hidetip) == 1);
        this.needShowSynchTip = false;
        this.cmbFont = Ext.create("Common.view.ComboFonts", {
            id: "toolbar-combo-fonts",
            margin: "0 4 0 0",
            width: 128,
            cls: "asc-toolbar-combo",
            editable: true,
            selectOnFocus: true,
            tooltip: this.tipFontName,
            showlastused: true,
            enableKeyEvents: true,
            preventMark: true,
            validateOnBlur: false,
            validateOnChange: false,
            plugins: [{
                ptype: "comboboxscrollpane",
                pluginId: "scrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        this.paragraphControls.push(this.cmbFont);
        Ext.define("DE.view.FontSize", {
            extend: "Ext.data.Model",
            fields: [{
                type: "int",
                name: "sizevalue"
            },
            {
                type: "string",
                name: "sizestring"
            }]
        });
        var storesize = Ext.create("Ext.data.Store", {
            model: "DE.view.FontSize",
            data: []
        });
        this.cmbFontSize = Ext.create("Ext.form.field.ComboBox", {
            id: "toolbar-combo-font-size",
            store: storesize,
            displayField: "sizestring",
            queryMode: "local",
            typeAhead: false,
            selectOnFocus: true,
            margin: "0 4 0 0",
            width: 60,
            cls: "asc-toolbar-combo",
            listConfig: {
                maxHeight: 400
            },
            preventMark: true,
            validateOnBlur: false,
            validateOnChange: false,
            listeners: {
                render: {
                    fn: function (cmp) {
                        cmp.el.set({
                            "data-qtip": me.tipFontSize
                        });
                        cmp.validate();
                    }
                }
            }
        });
        this.paragraphControls.push(this.cmbFontSize);
        this.btnBold = Ext.create("Ext.Button", {
            id: "toolbar-button-bold",
            tooltip: this.textBold + " (Ctrl+B)",
            iconCls: "asc-toolbar-btn btn-bold",
            enableToggle: true
        });
        this.paragraphControls.push(this.btnBold);
        this.btnItalic = Ext.create("Ext.Button", {
            id: "toolbar-button-italic",
            tooltip: this.textItalic + " (Ctrl+I)",
            iconCls: "asc-toolbar-btn btn-italic",
            enableToggle: true
        });
        this.paragraphControls.push(this.btnItalic);
        this.btnUnderline = Ext.create("Ext.Button", {
            id: "toolbar-button-underline",
            tooltip: this.textUnderline + " (Ctrl+U)",
            iconCls: "asc-toolbar-btn btn-underline",
            enableToggle: true
        });
        this.paragraphControls.push(this.btnUnderline);
        this.btnStrikeout = Ext.create("Ext.Button", {
            id: "toolbar-strikeout",
            tooltip: this.textStrikeout,
            iconCls: "asc-toolbar-btn btn-strike",
            enableToggle: true
        });
        this.paragraphControls.push(this.btnStrikeout);
        this.btnSuperscript = Ext.create("Ext.Button", {
            id: "toolbar-button-superscript",
            tooltip: this.textSuperscript,
            iconCls: "asc-toolbar-btn btn-superscript",
            enableToggle: true,
            toggleGroup: "subscriptGroup"
        });
        this.paragraphControls.push(this.btnSuperscript);
        this.btnSubscript = Ext.create("Ext.Button", {
            id: "toolbar-button-subscript",
            tooltip: this.textSubscript,
            iconCls: "asc-toolbar-btn btn-subscript",
            enableToggle: true,
            toggleGroup: "subscriptGroup"
        });
        this.paragraphControls.push(this.btnSubscript);
        this.btnPrint = Ext.create("Ext.Button", {
            id: "toolbar-button-print",
            tooltip: this.tipPrint + " (Ctrl+P)",
            iconCls: "asc-toolbar-btn btn-print"
        });
        this.btnSave = Ext.create("Ext.Button", {
            id: "toolbar-button-save",
            tooltip: this.tipSave + " (Ctrl+S)",
            iconCls: "asc-toolbar-btn btn-save"
        });
        this.btnCopy = Ext.create("Ext.Button", {
            id: "toolbar-button-copy",
            tooltip: this.tipCopy + " (Ctrl+C)",
            iconCls: "asc-toolbar-btn btn-copy"
        });
        this.btnPaste = Ext.create("Ext.Button", {
            id: "toolbar-button-paste",
            tooltip: this.tipPaste + " (Ctrl+V)",
            iconCls: "asc-toolbar-btn btn-paste"
        });
        this.btnUndo = Ext.create("Ext.Button", {
            id: "toolbar-button-undo",
            tooltip: this.tipUndo + " (Ctrl+Z)",
            iconCls: "asc-toolbar-btn btn-undo"
        });
        this.btnRedo = Ext.create("Ext.Button", {
            id: "toolbar-button-redo",
            tooltip: this.tipRedo + " (Ctrl+Y)",
            iconCls: "asc-toolbar-btn btn-redo"
        });
        this.btnIncFontSize = Ext.create("Ext.Button", {
            id: "toolbar-button-increase-font",
            tooltip: this.tipIncFont + " (Ctrl+])",
            iconCls: "asc-toolbar-btn btn-incfont"
        });
        this.paragraphControls.push(this.btnIncFontSize);
        this.btnDecFontSize = Ext.create("Ext.Button", {
            id: "toolbar-button-decrease-font",
            tooltip: this.tipDecFont + " (Ctrl+[)",
            iconCls: "asc-toolbar-btn btn-decfont"
        });
        this.paragraphControls.push(this.btnDecFontSize);
        function _setMarkerColor(strcolor, h) {
            if (h === "menu") {
                me.mnuHighlightTransparent.setChecked(false);
                me.btnHighlightColor.setColor(strcolor);
                me.btnHighlightColor.toggle(true, true);
                Ext.menu.Manager.hideAll();
            }
            if (strcolor == "transparent") {
                me.api.SetMarkerFormat(true, false);
            } else {
                var r = strcolor[0] + strcolor[1],
                g = strcolor[2] + strcolor[3],
                b = strcolor[4] + strcolor[5];
                me.api.SetMarkerFormat(true, true, parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
            }
            me.fireEvent("editcomplete", me);
            Common.component.Analytics.trackEvent("ToolBar", "Highlight Color");
        }
        this._clearColorPalette = function (picker) {
            if (picker && picker.getEl()) {
                picker.getEl().down("a.color-" + picker.getValue()).removeCls(picker.selectedCls);
            }
        };
        this.btnHighlightColor = Ext.widget("cmdsplitcolorbutton", {
            id: "toolbar-button-highlight-color",
            tooltip: this.tipHighlightColor,
            color: "FFFF00",
            horizontalOffset: 4,
            verticalOffset: 2,
            enableToggle: true,
            iconCls: "asc-toolbar-btn btn-selectcolor",
            menu: {
                showSeparator: false,
                items: [this.colorsHighlight = Ext.create("Ext.ColorPalette", {
                    id: "menu-palette-highlight-color",
                    cls: "color-palette-highlight",
                    height: 126,
                    width: 132,
                    value: "FFFF00",
                    allowReselect: true,
                    style: "padding: 6px;",
                    colors: ["FFFF00", "00FF00", "00FFFF", "FF00FF", "0000FF", "FF0000", "00008B", "008B8B", "006400", "800080", "8B0000", "808000", "FFFFFF", "D3D3D3", "A9A9A9", "000000"],
                    listeners: {
                        select: function (picker, color, eOpts) {
                            _setMarkerColor(color, "menu");
                        },
                        afterrender: function (ct) {
                            if (me.mnuHighlightTransparent.checked) {
                                me._clearColorPalette(ct);
                            }
                        }
                    }
                }), "-", this.mnuHighlightTransparent = Ext.widget("menucheckitem", {
                    cls: "menu-item-highlightcolor-nocolor",
                    text: this.strMenuNoFill,
                    checked: false,
                    iconCls: "menu-item-nocolor",
                    handler: function onItemClick(item) {
                        _setMarkerColor("transparent", "menu");
                        item.setChecked(true);
                        me._clearColorPalette(me.colorsHighlight);
                    }
                })],
                listeners: {
                    hide: {
                        fn: function () {
                            me.fireEvent("editcomplete", me);
                        }
                    }
                }
            },
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        _setMarkerColor(btn.getColor());
                        Common.component.Analytics.trackEvent("ToolBar", "Highlight Color");
                    } else {
                        me.api.SetMarkerFormat(false);
                    }
                }
            }
        });
        this.paragraphControls.push(this.btnHighlightColor);
        this.hotKeys = new Ext.util.KeyMap(document, [{
            key: Ext.EventObject.ESC,
            ctrl: false,
            shift: false,
            fn: function () {
                if (me.btnHighlightColor.pressed) {
                    me.btnHighlightColor.toggle(false, true);
                    me.api.SetMarkerFormat(false);
                }
            }
        }]);
        this.btnFontColor = Ext.widget("cmdsplitcolorbutton", {
            id: "toolbar-button-font-color",
            tooltip: this.tipFontColor,
            color: "000000",
            horizontalOffset: 3,
            verticalOffset: 2,
            split: true,
            listeners: {
                changecolor: function (btn, color) {
                    me.fireEvent("editcomplete", me);
                },
                click: function (btn) {
                    me.colorsText.fireEvent("select", me.colorsText, me.colorsText.currentColor);
                }
            },
            iconCls: "asc-toolbar-btn btn-fontcolor"
        });
        this.paragraphControls.push(this.btnFontColor);
        this.btnMarkers = Ext.create("Ext.button.Split", {
            id: "toolbar-btn-markers",
            tooltip: this.tipMarkers,
            enableToggle: true,
            toggleGroup: "markersGroup",
            iconCls: "asc-toolbar-btn btn-setmarkers",
            split: true
        });
        this.paragraphControls.push(this.btnMarkers);
        this.btnNumbers = Ext.create("Ext.button.Split", {
            id: "toolbar-btn-numbering",
            tooltip: this.tipNumbers,
            enableToggle: true,
            toggleGroup: "markersGroup",
            iconCls: "asc-toolbar-btn btn-numbering",
            split: true
        });
        this.paragraphControls.push(this.btnNumbers);
        this.btnMultilevels = Ext.create("Ext.Button", {
            id: "toolbar-btn-multilevels",
            tooltip: this.tipMultilevels,
            iconCls: "asc-toolbar-btn btn-multilevels",
            split: true
        });
        this.paragraphControls.push(this.btnMultilevels);
        this.btnAlignLeft = Ext.create("Ext.Button", {
            id: "toolbar-button-align-left",
            tooltip: this.tipAlignLeft + " (Ctrl+L)",
            enableToggle: true,
            toggleGroup: "alignGroup",
            allowDepress: false,
            iconCls: "asc-toolbar-btn btn-align-left"
        });
        this.paragraphControls.push(this.btnAlignLeft);
        this.btnAlignCenter = Ext.create("Ext.Button", {
            id: "toolbar-button-align-center",
            tooltip: this.tipAlignCenter + " (Ctrl+E)",
            enableToggle: true,
            toggleGroup: "alignGroup",
            allowDepress: false,
            iconCls: "asc-toolbar-btn btn-align-center"
        });
        this.paragraphControls.push(this.btnAlignCenter);
        this.btnAlignRight = Ext.create("Ext.Button", {
            id: "toolbar-button-align-right",
            tooltip: this.tipAlignRight + " (Ctrl+R)",
            enableToggle: true,
            toggleGroup: "alignGroup",
            allowDepress: false,
            iconCls: "asc-toolbar-btn btn-align-right"
        });
        this.paragraphControls.push(this.btnAlignRight);
        this.btnAlignJust = Ext.create("Ext.button.Button", {
            id: "toolbar-button-align-just",
            tooltip: this.tipAlignJust + " (Ctrl+J)",
            enableToggle: true,
            toggleGroup: "alignGroup",
            allowDepress: false,
            iconCls: "asc-toolbar-btn btn-align-just"
        });
        this.paragraphControls.push(this.btnAlignJust);
        this.btnHorizontalAlign = Ext.create("Ext.Button", {
            id: "toolbar-button-halign",
            tooltip: this.tipHAligh,
            iconCls: "asc-toolbar-btn btn-halign",
            cls: "halign-left",
            icls: "halign-left",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-horalign",
                defaults: {
                    cls: "toolbar-menu-icon-item",
                    group: "halignGroup",
                    checked: false
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-align-left",
                    text: this.tipAlignLeft + " (Ctrl+L)",
                    icls: "halign-left",
                    halign: 1,
                    checked: true
                },
                {
                    iconCls: "mnu-icon-item mnu-align-center",
                    text: this.tipAlignCenter + " (Ctrl+E)",
                    icls: "halign-center",
                    halign: 2
                },
                {
                    iconCls: "mnu-icon-item mnu-align-right",
                    text: this.tipAlignRight + " (Ctrl+R)",
                    icls: "halign-right",
                    halign: 0
                },
                {
                    iconCls: "mnu-icon-item mnu-align-just",
                    text: this.tipAlignJust + " (Ctrl+J)",
                    icls: "halign-just",
                    halign: 3
                }]
            }
        });
        this.paragraphControls.push(this.btnHorizontalAlign);
        this.btnDecLeftOffset = Ext.create("Ext.button.Button", {
            id: "toolbar-button-dec-left-offset",
            tooltip: this.tipDecPrLeft + " (Ctrl+Shift+M)",
            iconCls: "asc-toolbar-btn btn-decoffset"
        });
        this.paragraphControls.push(this.btnDecLeftOffset);
        this.btnIncLeftOffset = Ext.create("Ext.button.Button", {
            id: "toolbar-button-inc-left-offset",
            tooltip: this.tipIncPrLeft + " (Ctrl+M)",
            iconCls: "asc-toolbar-btn btn-incoffset"
        });
        this.paragraphControls.push(this.btnIncLeftOffset);
        this.btnShowHidenChars = Ext.create("Ext.button.Split", {
            id: "toolbar-button-show-hidden",
            tooltip: this.tipShowHiddenChars,
            enableToggle: true,
            pressed: false,
            iconCls: "asc-toolbar-btn btn-hidenchars",
            menu: {
                listeners: {
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    }
                },
                items: [this.mniShowHiddenChars = Ext.widget("menucheckitem", {
                    text: this.mniHiddenChars,
                    hideOnClick: true,
                    listeners: {
                        checkchange: function (item, checked) {
                            var pressed = checked;
                            me.btnShowHidenChars.toggle(pressed, true);
                            if (me.api) {
                                me.api.put_ShowParaMarks(checked);
                            }
                            me.fireEvent("editcomplete", me);
                            Common.component.Analytics.trackEvent("ToolBar", "Hidden Characters");
                        }
                    }
                }), this.mniShowHiddenBorders = Ext.widget("menucheckitem", {
                    text: this.mniHiddenBorders,
                    hideOnClick: true,
                    listeners: {
                        checkchange: function (item, checked) {
                            if (me.api) {
                                me.api.put_ShowTableEmptyLine(checked);
                            }
                            me.fireEvent("editcomplete", me);
                        }
                    }
                })]
            },
            listeners: {
                toggle: function (btn, pressed) {
                    if (pressed) {
                        me.mniShowHiddenChars.setChecked(true, true);
                        Common.component.Analytics.trackEvent("ToolBar", "Hidden Characters");
                    } else {
                        me.mniShowHiddenChars.setChecked(false, true);
                    }
                    if (me.api) {
                        me.api.put_ShowParaMarks(pressed);
                    }
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        this.btnLineSpace = Ext.create("Ext.button.Button", {
            id: "toolbar-button-line-space",
            tooltip: this.tipLineSpace,
            iconCls: "asc-toolbar-btn btn-linespace",
            menu: {
                id: "toolbar-menu-line-space",
                width: 76,
                defaults: {
                    group: "linespace",
                    checked: false
                },
                items: [{
                    text: "1.0",
                    linespace: 1,
                    checked: true
                },
                {
                    text: "1.15",
                    linespace: 1.15
                },
                {
                    text: "1.5",
                    linespace: 1.5
                },
                {
                    text: "2.0",
                    linespace: 2
                },
                {
                    text: "2.5",
                    linespace: 2.5
                },
                {
                    text: "3.0",
                    linespace: 3
                }]
            }
        });
        this.paragraphControls.push(this.btnLineSpace);
        this.btnInsertTable = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-table",
            tooltip: this.tipInsertTable,
            iconCls: "asc-toolbar-btn btn-inserttable",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-insert-table",
                items: [{
                    xtype: "container",
                    width: 200,
                    items: [{
                        xtype: "dedimensionpicker",
                        minRows: 8,
                        minColumns: 10,
                        maxRows: 8,
                        maxColumns: 10,
                        stalign: "top",
                        padding: "10px"
                    }]
                },
                {
                    text: this.mniCustomTable,
                    id: "toolbar-insert-custom-table",
                    cls: "menu-item-noicon"
                }]
            }
        });
        this.btnInsertImage = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-image",
            tooltip: this.tipInsertImage,
            iconCls: "asc-toolbar-btn btn-insertimage",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-insertimage",
                items: [{
                    text: this.mniImageFromFile,
                    cls: "menu-item-noicon",
                    from: "file"
                },
                {
                    text: this.mniImageFromUrl,
                    cls: "menu-item-noicon",
                    from: "url"
                }]
            }
        });
        this.paragraphControls.push(this.btnInsertImage);
        this.btnPageBreak = Ext.create("Ext.button.Button", {
            id: "toolbar-button-page-break",
            tooltip: this.tipPageBreak,
            iconCls: "asc-toolbar-btn btn-pagebreak"
        });
        this.paragraphControls.push(this.btnPageBreak);
        this.btnEditHeader = Ext.create("Ext.button.Button", {
            id: "toolbar-button-edit-header",
            tooltip: this.tipEditHeader,
            iconCls: "asc-toolbar-btn btn-editheader",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-edit-header",
                items: [{
                    text: this.mniEditHeader,
                    cls: "menu-item-noicon",
                    place: "Header"
                },
                {
                    text: this.mniEditFooter,
                    cls: "menu-item-noicon",
                    place: "Footer"
                },
                {
                    xtype: "menuseparator"
                }]
            }
        });
        this.btnInsertHyperlink = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-hyperlink",
            tooltip: this.tipInsertHyperlink + " (Ctrl+K)",
            iconCls: "asc-toolbar-btn btn-inserthyperlink"
        });
        this.paragraphControls.push(this.btnInsertHyperlink);
        this.btnClearStyle = Ext.create("Ext.button.Button", {
            id: "toolbar-button-clear-style",
            tooltip: this.tipClearStyle,
            iconCls: "asc-toolbar-btn btn-clearstyle"
        });
        this.paragraphControls.push(this.btnClearStyle);
        this.btnCopyStyle = Ext.create("Ext.button.Button", {
            id: "toolbar-button-copy-style",
            tooltip: this.tipCopyStyle + " (Ctrl+Shift+C)",
            iconCls: "asc-toolbar-btn btn-copystyle",
            enableToggle: true
        });
        this.btnPageSize = Ext.create("Ext.button.Button", {
            id: "toolbar-button-pagesize",
            tooltip: this.tipPageSize,
            iconCls: "asc-toolbar-btn btn-pagesize",
            pagesize: [210, 297],
            split: true
        });
        this.btnPageOrient = Ext.create("Ext.button.Button", {
            enableToggle: true,
            tooltip: this.tipPageOrient,
            id: "toolbar-button-pageorient",
            iconCls: "asc-toolbar-btn btn-pageorient"
        });
        me.btnNewDocument = Ext.create("Ext.Button", {
            id: "toolbar-button-newdocument",
            tooltip: this.tipNewDocument,
            iconCls: "asc-toolbar-btn btn-newdocument"
        });
        me.btnOpenDocument = Ext.create("Ext.Button", {
            id: "toolbar-button-opendocument",
            tooltip: this.tipOpenDocument,
            iconCls: "asc-toolbar-btn btn-opendocument"
        });
        this.btnInsertShape = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-shape",
            tooltip: this.tipInsertShape,
            iconCls: "asc-toolbar-btn btn-insertshape",
            enableToggle: true,
            menu: {
                showSeparator: false,
                id: "toolbar-menu-insert-shape",
                items: [],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        this.paragraphControls.push(this.btnInsertShape);
        this.btnInsertText = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-text",
            tooltip: this.tipInsertText,
            iconCls: "asc-toolbar-btn btn-text",
            enableToggle: true
        });
        this.paragraphControls.push(this.btnInsertText);
        this.btnColorSchemas = Ext.create("Ext.button.Button", {
            id: "toolbar-button-color-schemas",
            tooltip: this.tipColorSchemas,
            iconCls: "asc-toolbar-btn btn-colorschemas",
            split: true
        });
        this.btnFitPage = Ext.widget("menucheckitem", {
            id: "toolbar-menu-fit-page",
            text: this.textFitPage,
            checked: false,
            hideOnClick: true
        });
        this.btnFitWidth = Ext.widget("menucheckitem", {
            id: "toolbar-menu-fit-width",
            text: this.textFitWidth,
            checked: false,
            hideOnClick: true
        });
        this.btnZoomIn = Ext.widget("button", {
            id: "toolbar-menu-zoomin",
            cls: "asc-toolbar-btn-zoom",
            iconCls: "asc-statusbar-btn btn-zoomin"
        });
        this.btnZoomOut = Ext.widget("button", {
            id: "toolbar-menu-zoomout",
            cls: "asc-toolbar-btn-zoom",
            iconCls: "asc-statusbar-btn btn-zoomout"
        });
        this.txtZoom = Ext.widget("label", {
            id: "toolbar-menu-zoom-text",
            text: "100%",
            style: "white-space:nowrap; text-align: center;"
        });
        this.btnHide = Ext.create("Ext.button.Button", {
            id: "toolbar-button-hide",
            tooltip: this.tipViewSettings,
            iconCls: "asc-toolbar-btn btn-hidebars",
            split: true
        });
        this.btnAdvSettings = Ext.create("Ext.button.Button", {
            id: "toolbar-button-settings",
            tooltip: this.tipAdvSettings,
            iconCls: "asc-toolbar-btn btn-settings"
        });
        this.btnDropCap = Ext.create("Ext.Button", {
            id: "toolbar-button-dropcap",
            tooltip: this.tipDropCap,
            iconCls: "asc-toolbar-btn btn-dropcap",
            cls: "dropcap-text",
            icls: "dropcap-text",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-dropcap",
                items: [{
                    cls: "toolbar-menu-icon-item",
                    group: "dropcapGroup",
                    iconCls: "mnu-icon-item mnu-dropcap-none",
                    text: this.textNone,
                    icls: "dropcap-none",
                    dropcap: c_oAscDropCap.None,
                    checked: true
                },
                {
                    cls: "toolbar-menu-icon-item",
                    group: "dropcapGroup",
                    iconCls: "mnu-icon-item mnu-dropcap-text",
                    text: this.textInText,
                    icls: "dropcap-text",
                    dropcap: c_oAscDropCap.Drop,
                    checked: false
                },
                {
                    cls: "toolbar-menu-icon-item",
                    group: "dropcapGroup",
                    iconCls: "mnu-icon-item mnu-dropcap-margin",
                    text: this.textInMargin,
                    icls: "dropcap-margin",
                    dropcap: c_oAscDropCap.Margin,
                    checked: false
                },
                {
                    xtype: "menuseparator"
                },
                {
                    id: "mnu-dropcap-advanced",
                    text: this.mniEditDropCap,
                    cls: "menu-item-noicon"
                }]
            }
        });
        this.paragraphControls.push(this.btnDropCap);
        var btnPlaceholderHtml = function (id, iconCls, style) {
            return Ext.String.format('<div class="toolbar-btn-placeholder x-btn-default-toolbar-small-icon x-btn-default-toolbar-small document-loading" id="{0}" style="{2}"><span class="replaceme x-btn-icon asc-toolbar-btn {1}">&nbsp;</span></div>', id, iconCls, style || "");
        };
        var btnSplitPlaceholderHtml = function (id, iconCls, style, extraCls) {
            return Ext.String.format('<div class="toolbar-btn-placeholder x-btn-default-toolbar-small-icon x-btn-default-toolbar-small document-loading x-btn-split x-btn-split-right{3}" id="{0}" style="width: 34px; {2}"><span class="replaceme x-btn-icon asc-toolbar-btn {1}">&nbsp;</span></div>', id, iconCls, style || "", extraCls ? " " + extraCls : "");
        };
        var separatorHtml = function (size, style) {
            return Ext.String.format('<div class="x-toolbar-separator x-toolbar-item x-toolbar-separator-horizontal manual {0}" style="{1}" role="presentation" tabindex="-1"></div>', size, style || "");
        };
        var comboBoxHtml = function (id, text, style) {
            return Ext.String.format('<div id="{0}" class="x-container storage-combodataview x-container-default x-box-layout-ct toolbar-combo-placeholder x-item-disabled" role="presentation" tabindex="-1" style="{2}"><div class="x-trigger-index-0 x-form-trigger x-form-arrow-trigger x-form-trigger-last x-unselectable" role="button"></div>{1}</div>', id, text || "", style || "");
        };
        var comboDataViewHtml = function (id, text, style) {
            return Ext.String.format('<div id="{0}" class="x-container storage-combodataview x-container-default x-box-layout-ct toolbar-dataview-placeholder x-item-disabled" role="presentation" tabindex="-1" style="{1}"><div class="x-btn x-btn-combodataview x-box-item x-btn-default-small" style="height: 44px; margin: 0; top: 4px;"></div></div>', id, style || "");
        };
        var isCompactView = (window.localStorage.getItem("de-compact-toolbar") && parseInt(window.localStorage.getItem("de-compact-toolbar")) == 1) || false;
        this.setHeight(isCompactView ? 38 : 68);
        this.html = ['<div id="id-toolbar-short" style="' + (isCompactView ? "display: table;": "display: none;") + 'width: 100%; height: 22px; margin-top: 3px;" >', '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-short-btn-print", "btn-print", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-save", "btn-save"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-short-btn-undo", "btn-undo", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-redo", "btn-redo", "margin: 0 1px 0 3px;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="width: 200px; margin-top: 2px;">', comboBoxHtml("id-toolbar-short-field-fontname", "Arial", "display: inline; float: left; line-height: 20px; padding: 0; width: 127px; height: 22px; margin-right: 4px;"), comboBoxHtml("id-toolbar-short-field-fontsize", "11", "display: inline; float: left; padding: 0; line-height: 20px; width: 59px; height: 22px; margin-right: 2px;"), "</div>", "</div>", '<div class="toolbar-group" style="padding-left: 0">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-bold", "btn-bold", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-italic", "btn-italic", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-underline", "btn-underline", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-highlight", "btn-selectcolor", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-fontcolor", "btn-fontcolor", "margin: 0 0 0 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-halign", "btn-align-left", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-setmarkers", "btn-setmarkers", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-numbering", "btn-numbering", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-multilevels", "btn-multilevels", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-decoffset", "btn-decoffset", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-incoffset", "btn-incoffset", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-linespace", "btn-linespace", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-hidenchars", "btn-hidenchars", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-inserttable", "btn-inserttable", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-insertimage", "btn-insertimage", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-text", "btn-text", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-pagebreak", "btn-pagebreak", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-inserthyperlink", "btn-inserthyperlink", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-editheader", "btn-editheader", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-insertshape", "btn-insertshape", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-pageorient", "btn-pageorient", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-pagesize", "btn-pagesize", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-clearstyle", "btn-clearstyle", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-copystyle", "btn-copystyle", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group" style="width: 100%;"></div>', '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-hidebars", "btn-hidebars", "margin: 0 4px 0 0;"), "</div>", "</div>", "</div>", '<div id="id-toolbar-full" style="' + (isCompactView ? "display: none;": "display: table;") + 'width: 100%; margin-top: 3px;" >', '<div class="toolbar-group" id="id-toolbar-full-group-native">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-newdocument", "btn-newdocument"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-opendocument", "btn-opendocument"), "</div>", "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-print", "btn-print"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-save", "btn-save"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-copy", "btn-copy", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-paste", "btn-paste"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-undo", "btn-undo", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-redo", "btn-redo"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="width:239px;">', comboBoxHtml("id-toolbar-full-field-fontname", "Arial", "display: inline; float: left; line-height: 20px; padding: 0; width: 127px; height: 22px; margin-right: 4px;"), comboBoxHtml("id-toolbar-full-field-fontsize", "11", "display: inline; float: left; padding: 0; line-height: 20px; width: 59px; height: 22px; margin-right: 2px;"), btnPlaceholderHtml("id-toolbar-full-btn-incfont", "btn-incfont"), btnPlaceholderHtml("id-toolbar-full-btn-decfont", "btn-decfont", "margin: 0 0 0 2px;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-bold", "btn-bold", "margin: 0 1px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-italic", "btn-italic", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-underline", "btn-underline", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-strikeout", "btn-strike", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-superscript", "btn-superscript", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-subscript", "btn-subscript", "margin: 0 10px 0 0;"), separatorHtml("short", "position: absolute; margin-top: 2px;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-highlight", "btn-selectcolor", "margin: 0 4px 0 14px;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-fontcolor", "btn-fontcolor", "margin: 0 0 0 2px;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-setmarkers", "btn-setmarkers", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-numbering", "btn-numbering", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-multilevels", "btn-multilevels", "margin: 0 2px 0 0;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-align-left", "btn-align-left", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-align-center", "btn-align-center", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-align-right", "btn-align-right", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-align-just", "btn-align-just", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-decoffset", "btn-decoffset", "margin: 0 14px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-incoffset", "btn-incoffset"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-linespace", "btn-linespace", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-hidenchars", "btn-hidenchars", "margin: 0 0 0 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-inserttable", "btn-inserttable", "margin: 0 2px 0 0"), btnSplitPlaceholderHtml("id-toolbar-full-btn-insertimage", "btn-insertimage", "margin: 0 2px 0 0"), btnPlaceholderHtml("id-toolbar-full-btn-text", "btn-text", "margin: 0 12px 0 0"), btnSplitPlaceholderHtml("id-toolbar-full-btn-dropcap", "btn-dropcap", undefined, "dropcap-text"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-pagebreak", "btn-pagebreak", "margin: 0 14px 0 0"), btnPlaceholderHtml("id-toolbar-full-btn-inserthyperlink", "btn-inserthyperlink", "margin: 0 14px 0 0"), btnSplitPlaceholderHtml("id-toolbar-full-btn-editheader", "btn-editheader", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-insertshape", "btn-insertshape", "margin: 0 0 0 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-pageorient", "btn-pageorient"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-pagesize", "btn-pagesize"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-clearstyle", "btn-clearstyle"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-copystyle", "btn-copystyle"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-colorschemas", "btn-colorschemas"), "</div>", "</div>", '<div class="toolbar-group" id="id-toolbar-full-group-styles" style="width: 100%;">', comboDataViewHtml("id-toolbar-full-field-styles", "", "margin: 0 10px; height: 54px;"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-hidebars", "btn-hidebars", "margin: 0 5px 0 0;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-settings", "btn-settings"), "</div>", "</div>", "</div>"];
        this.items = [];
        this.listStyles = Ext.create("Common.component.ComboDataView", {
            id: "toolbar-combo-view-styles",
            flex: 1,
            height: 54,
            itemWidth: 80,
            itemHeight: 40,
            menuMaxHeight: 500,
            minWidth: 125,
            repeatedselect: true,
            handleGlobalResize: true,
            viewData: []
        });
        this.paragraphControls.push(this.listStyles);
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onMarkerFormatChanged", Ext.bind(this._onStartHighlight, this));
            this.api.asc_registerCallback("asc_onTextHighLight", Ext.bind(this._onHighlightColor, this));
            this.api.asc_registerCallback("asc_onCollaborativeChanges", Ext.bind(this._onCollaborativeChanges, this));
            return this;
        }
    },
    _onStartHighlight: function (pressed) {
        this.btnHighlightColor.toggle(pressed, true);
    },
    _onHighlightColor: function (c) {
        this.colorsHighlight.suspendEvents(false);
        var textpr = this.api.get_TextProps().get_TextPr();
        if (textpr) {
            c = textpr.get_HighLight();
            if (c == -1) {
                if (this._state.clrhighlight != -1) {
                    this.mnuHighlightTransparent.setChecked(true);
                    if (this.colorsHighlight.getEl()) {
                        this._state.clrhighlight = -1;
                        this._clearColorPalette(this.colorsHighlight);
                    }
                }
            } else {
                if (c !== null) {
                    if (this._state.clrhighlight != c.get_hex()) {
                        this.mnuHighlightTransparent.setChecked(false);
                        this._state.clrhighlight = c.get_hex().toUpperCase();
                        if (Ext.Array.contains(this.colorsHighlight.colors, this._state.clrhighlight)) {
                            this.colorsHighlight.select(this._state.clrhighlight, false);
                        }
                    }
                } else {
                    if (this._state.clrhighlight !== c) {
                        this.mnuHighlightTransparent.setChecked(false);
                        this._clearColorPalette(this.colorsHighlight);
                        this._state.clrhighlight = c;
                    }
                }
            }
        }
        this.colorsHighlight.resumeEvents();
    },
    _onTextColor: function (color) {
        var clr;
        if (color) {
            if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                clr = {
                    color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                    effectValue: color.get_value()
                };
            } else {
                clr = this.getHexColor(color.get_r(), color.get_g(), color.get_b());
            }
        }
        var type1 = typeof(clr),
        type2 = typeof(this._state.clrtext);
        if ((type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrtext.effectValue || this._state.clrtext.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrtext.indexOf(clr) < 0)) {
            this.colorsText.suspendEvents(false);
            if (typeof(clr) == "object") {
                for (var i = 0; i < 10; i++) {
                    if (this.ThemeValues[i] == clr.effectValue) {
                        this.colorsText.select(clr, false);
                        break;
                    }
                }
            } else {
                this.colorsText.select(clr, false);
            }
            this.colorsText.resumeEvents();
            this._state.clrtext = clr;
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
    _onSendThemeColorSchemes: function (schemas) {
        var me = this;
        me.btnColorSchemas.menu.removeAll();
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
                schemaType: i
            });
            if (i == 21) {
                me.btnColorSchemas.menu.add(Ext.create("Ext.menu.Separator", {}));
            }
            me.btnColorSchemas.menu.add(mnu);
        }
    },
    _onSendThemeColors: function (colors, standart_colors) {
        var standartcolors = [];
        if (standart_colors) {
            for (var i = 0; i < standart_colors.length; i++) {
                var item = this.getHexColor(standart_colors[i].get_r(), standart_colors[i].get_g(), standart_colors[i].get_b());
                standartcolors.push(item);
            }
        }
        var effectcolors = [];
        var clr, clrPara;
        for (i = 0; i < 6; i++) {
            for (var j = 0; j < 10; j++) {
                var idx = i + j * 6;
                var item = {
                    color: this.getHexColor(colors[idx].get_r(), colors[idx].get_g(), colors[idx].get_b()),
                    effectId: idx,
                    effectValue: this.ThemeValues[j]
                };
                effectcolors.push(item);
                if (typeof(this.colorsText.currentColor) == "object" && clr === undefined && this.colorsText.currentColor.effectId == idx) {
                    clr = item;
                }
            }
        }
        this.colorsText.updateColors(effectcolors, standartcolors);
        if (this.colorsText.currentColor === undefined) {
            this.btnFontColor.setColor(effectcolors[1].color, false);
            this.colorsText.currentColor = effectcolors[1];
        } else {
            if (clr !== undefined) {
                this.btnFontColor.setColor(clr.color, false);
                this.colorsText.currentColor = clr;
            }
        }
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
    },
    _onInsertPageNumber: function (picker, record) {
        if (this.api) {
            this.api.put_PageNum(record.data.data.type, record.data.data.subtype);
        }
        setTimeout(function () {
            picker.selectByIndex(-1);
        },
        100);
        this.fireEvent("editcomplete", this);
        Ext.menu.Manager.hideAll();
        Common.component.Analytics.trackEvent("ToolBar", "Page Number");
    },
    _onCollaborativeChanges: function () {
        if (!this.btnSave.rendered) {
            this.needShowSynchTip = true;
            return;
        }
        var span = this.btnSave.getEl().down(".asc-toolbar-btn");
        span.removeCls("btn-save");
        span.addCls("btn-synch");
        if (this.showSynchTip && this.isVisible()) {
            this.btnSave.setTooltip("");
            if (this.synchTooltip === undefined) {
                this._createSynchTip();
            }
            this.synchTooltip.show();
        } else {
            this.btnSave.setTooltip(this.tipSynchronize + " (Ctrl+S)");
        }
    },
    _onLockHeaderFooters: function () {
        this.pageNumHeaderFooter.setDisabled(true);
        this.mnuInsertPageNum.setDisabled(this.pageNumCurrentPos.isDisabled());
    },
    _onUnLockHeaderFooters: function () {
        this.pageNumHeaderFooter.setDisabled(false);
        this.mnuInsertPageNum.setDisabled(false);
    },
    _createSynchTip: function () {
        var showxy = this.btnSave.getPosition();
        showxy[0] += this.btnSave.getWidth();
        showxy[1] += this.btnSave.getHeight() / 2;
        this.synchTooltip = Ext.getBody().createChild({
            tag: "div",
            cls: "synch-tip-root",
            style: "top: " + showxy[1] + "px; left: " + showxy[0] + "px; width: 250px;"
        });
        if (this.synchTooltip) {
            var newsynch = Ext.widget("commonsynchronizetip", {
                renderTo: this.synchTooltip
            });
            newsynch.getEl().alignTo(this.synchTooltip, "tl");
            newsynch.addListener("dontshowclick", function () {
                this.showSynchTip = false;
                this.synchTooltip.hide();
                this.btnSave.setTooltip(this.tipSynchronize + " (Ctrl+S)");
                window.localStorage.setItem("de-hide-synch", 1);
            },
            this);
            newsynch.addListener("closeclick", function () {
                this.synchTooltip.hide();
                this.btnSave.setTooltip(this.tipSynchronize + " (Ctrl+S)");
            },
            this);
        }
    },
    setMode: function (mode) {
        if (mode.isDisconnected) {
            this.btnNewDocument.setDisabled(true);
            this.btnOpenDocument.setDisabled(true);
            this.btnSave.setDisabled(true);
            this.btnCopy.setDisabled(true);
            this.btnPaste.setDisabled(true);
            this.btnUndo.setDisabled(true);
            this.btnRedo.setDisabled(true);
            this.btnIncFontSize.setDisabled(true);
            this.btnDecFontSize.setDisabled(true);
            this.btnBold.setDisabled(true);
            this.btnItalic.setDisabled(true);
            this.btnUnderline.setDisabled(true);
            this.btnStrikeout.setDisabled(true);
            this.btnSuperscript.setDisabled(true);
            this.btnSubscript.setDisabled(true);
            this.btnHighlightColor.setDisabled(true);
            this.btnFontColor.setDisabled(true);
            this.btnMarkers.setDisabled(true);
            this.btnNumbers.setDisabled(true);
            this.btnMultilevels.setDisabled(true);
            this.btnAlignLeft.setDisabled(true);
            this.btnAlignCenter.setDisabled(true);
            this.btnAlignRight.setDisabled(true);
            this.btnAlignJust.setDisabled(true);
            this.btnDecLeftOffset.setDisabled(true);
            this.btnIncLeftOffset.setDisabled(true);
            this.btnLineSpace.setDisabled(true);
            this.btnShowHidenChars.setDisabled(true);
            this.btnInsertTable.setDisabled(true);
            this.btnInsertImage.setDisabled(true);
            this.btnInsertText.setDisabled(true);
            this.btnDropCap.setDisabled(true);
            this.btnPageBreak.setDisabled(true);
            this.btnInsertHyperlink.setDisabled(true);
            this.btnEditHeader.setDisabled(true);
            this.btnInsertShape.setDisabled(true);
            this.btnPageOrient.setDisabled(true);
            this.btnPageSize.setDisabled(true);
            this.btnClearStyle.setDisabled(true);
            this.btnCopyStyle.setDisabled(true);
            this.btnColorSchemas.setDisabled(true);
            this.btnHorizontalAlign.setDisabled(true);
            this.cmbFont.setDisabled(true);
            this.cmbFontSize.setDisabled(true);
            this.listStyles.setDisabled(true);
        } else {
            if (this.api) {
                this.mniShowHiddenChars.setChecked(this.api.get_ShowParaMarks(), true);
                this.mniShowHiddenBorders.setChecked(this.api.get_ShowTableEmptyLine(), true);
                this.btnShowHidenChars.toggle(this.mniShowHiddenChars.checked, true);
            }
        }
        if (!mode.nativeApp) {
            var nativeBtnGroup = Ext.get("id-toolbar-full-group-native");
            if (nativeBtnGroup) {
                nativeBtnGroup.setVisibilityMode(Ext.Element.DISPLAY);
                nativeBtnGroup.hide();
            }
        }
    },
    synchronizeChanges: function () {
        var span = this.btnSave.getEl().down(".asc-toolbar-btn");
        if (span.hasCls("btn-synch")) {
            span.removeCls("btn-synch");
            span.addCls("btn-save");
            if (this.synchTooltip) {
                this.synchTooltip.hide();
            }
            this.btnSave.setTooltip(this.tipSave + " (Ctrl+S)");
        }
    },
    _arrangeSlideItems: function () {
        if (!this.needArrangeSlideItems) {
            return;
        }
        var me = this;
        if (this.getEl()) {
            var jspElem = this.getEl().down(".jspPane");
            if (jspElem && jspElem.getHeight() > 0 && this.getEl().getHeight() > 0) {
                var i = 0;
                var updatescroll = setInterval(function () {
                    if (me.needArrangeSlideItems) {
                        me.resizeSlideItems();
                    }
                    if (!me.needArrangeSlideItems) {
                        clearInterval(updatescroll);
                        me.doLayout();
                        return;
                    }
                    if (i++>5) {
                        clearInterval(updatescroll);
                    }
                },
                100);
            }
        }
    },
    _resizeSlideItems: function () {
        var cols = 3;
        var selector = "div.group-item";
        var el = this.getEl();
        var thumbs = el.query(selector);
        var i = 0;
        while (i < thumbs.length) {
            var height = 0;
            for (var j = i; j < i + cols; j++) {
                if (j >= thumbs.length) {
                    break;
                }
                var thEl = Ext.get(thumbs[j]);
                var h = thEl.getHeight();
                if (h < 50) {
                    return;
                }
                if (h < height) {
                    thEl.setHeight(height);
                } else {
                    height = h;
                }
            }
            i += cols;
        }
        if (thumbs.length > 0) {
            this.needArrangeSlideItems = false;
        }
    },
    changeViewMode: function (compact) {
        var me = this,
        toolbarFull = Ext.get("id-toolbar-full"),
        toolbarShort = Ext.get("id-toolbar-short");
        if (toolbarFull && toolbarShort) {
            if (compact) {
                toolbarShort.setStyle({
                    display: "table"
                });
                toolbarFull.setStyle({
                    display: "none"
                });
                this.setHeight(38);
                this.rendererComponents("short");
            } else {
                toolbarShort.setStyle({
                    display: "none"
                });
                toolbarFull.setStyle({
                    display: "table"
                });
                this.setHeight(68);
                this.rendererComponents("full");
                Ext.defer(function () {
                    var listStylesVisible = (me.listStyles.rendered && me.listStyles.getEl() && me.listStyles.getEl().up("#id-toolbar-full-group-styles") && me.listStyles.getEl().up("#id-toolbar-full-group-styles").isVisible());
                    if (me.listStyles.dataMenu.picker.store.getCount() > 0 && listStylesVisible) {
                        me.listStyles.doComponentLayout();
                        me.listStyles.fillComboView(me.listStyles.dataMenu.picker.getSelectedRec(), true);
                    }
                },
                100);
            }
        }
    },
    rendererComponents: function (mode) {
        var me = this;
        var replaceBtn = function (id, btn) {
            var placeholderEl = Ext.get(id);
            if (placeholderEl) {
                if (!placeholderEl.down("button")) {
                    placeholderEl.removeCls(["x-btn-default-toolbar-small-icon", "x-btn-default-toolbar-small", "x-btn-disabled", "x-btn-split", "x-btn-split-right", "document-loading"]);
                    var icon = placeholderEl.down("span");
                    icon && icon.remove();
                    btn.addCls("x-btn-default-toolbar-small x-btn-default-toolbar-small-icon ");
                    if (btn.rendered) {
                        placeholderEl.dom.appendChild(document.getElementById(btn.getId()));
                    } else {
                        btn.render(placeholderEl);
                    }
                    btn.removeCls(["x-btn-default-small", "x-btn-default-small-icon"]);
                }
            }
        };
        var replaceField = function (id, field) {
            var placeholderEl = Ext.get(id);
            if (placeholderEl) {
                if (!placeholderEl.down("input")) {
                    if (/toolbar-combo-placeholder|toolbar-dataview-placeholder/.test(placeholderEl.dom.className)) {
                        for (var i = placeholderEl.dom.childNodes.length, node; i--;) {
                            node = placeholderEl.dom.childNodes[i];
                            node.parentNode.removeChild(node);
                        }
                    }
                    placeholderEl.removeCls(["x-container", "storage-combodataview", "x-container-default", "x-box-layout-ct", "toolbar-combo-placeholder", "toolbar-dataview-placeholder", "x-item-disabled"]);
                    if (field.rendered) {
                        placeholderEl.dom.appendChild(document.getElementById(field.getId()));
                    } else {
                        field.render(placeholderEl);
                    }
                }
            }
        };
        var prefix = (mode === "short") ? "short" : "full";
        replaceBtn("id-toolbar-" + prefix + "-btn-newdocument", me.btnNewDocument);
        replaceBtn("id-toolbar-" + prefix + "-btn-opendocument", me.btnOpenDocument);
        replaceBtn("id-toolbar-" + prefix + "-btn-print", me.btnPrint);
        replaceBtn("id-toolbar-" + prefix + "-btn-save", me.btnSave);
        replaceBtn("id-toolbar-" + prefix + "-btn-copy", me.btnCopy);
        replaceBtn("id-toolbar-" + prefix + "-btn-paste", me.btnPaste);
        replaceBtn("id-toolbar-" + prefix + "-btn-undo", me.btnUndo);
        replaceBtn("id-toolbar-" + prefix + "-btn-redo", me.btnRedo);
        replaceBtn("id-toolbar-" + prefix + "-btn-incfont", me.btnIncFontSize);
        replaceBtn("id-toolbar-" + prefix + "-btn-decfont", me.btnDecFontSize);
        replaceBtn("id-toolbar-" + prefix + "-btn-bold", me.btnBold);
        replaceBtn("id-toolbar-" + prefix + "-btn-italic", me.btnItalic);
        replaceBtn("id-toolbar-" + prefix + "-btn-underline", me.btnUnderline);
        replaceBtn("id-toolbar-" + prefix + "-btn-strikeout", me.btnStrikeout);
        replaceBtn("id-toolbar-" + prefix + "-btn-superscript", me.btnSuperscript);
        replaceBtn("id-toolbar-" + prefix + "-btn-subscript", me.btnSubscript);
        replaceBtn("id-toolbar-" + prefix + "-btn-highlight", me.btnHighlightColor);
        replaceBtn("id-toolbar-" + prefix + "-btn-fontcolor", me.btnFontColor);
        replaceBtn("id-toolbar-" + prefix + "-btn-setmarkers", me.btnMarkers);
        replaceBtn("id-toolbar-" + prefix + "-btn-numbering", me.btnNumbers);
        replaceBtn("id-toolbar-" + prefix + "-btn-multilevels", me.btnMultilevels);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-left", me.btnAlignLeft);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-center", me.btnAlignCenter);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-right", me.btnAlignRight);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-just", me.btnAlignJust);
        replaceBtn("id-toolbar-" + prefix + "-btn-decoffset", me.btnDecLeftOffset);
        replaceBtn("id-toolbar-" + prefix + "-btn-incoffset", me.btnIncLeftOffset);
        replaceBtn("id-toolbar-" + prefix + "-btn-linespace", me.btnLineSpace);
        replaceBtn("id-toolbar-" + prefix + "-btn-hidenchars", me.btnShowHidenChars);
        replaceBtn("id-toolbar-" + prefix + "-btn-inserttable", me.btnInsertTable);
        replaceBtn("id-toolbar-" + prefix + "-btn-insertimage", me.btnInsertImage);
        replaceBtn("id-toolbar-" + prefix + "-btn-text", me.btnInsertText);
        replaceBtn("id-toolbar-" + prefix + "-btn-dropcap", me.btnDropCap);
        replaceBtn("id-toolbar-" + prefix + "-btn-pagebreak", me.btnPageBreak);
        replaceBtn("id-toolbar-" + prefix + "-btn-inserthyperlink", me.btnInsertHyperlink);
        replaceBtn("id-toolbar-" + prefix + "-btn-editheader", me.btnEditHeader);
        replaceBtn("id-toolbar-" + prefix + "-btn-insertshape", me.btnInsertShape);
        replaceBtn("id-toolbar-" + prefix + "-btn-pageorient", me.btnPageOrient);
        replaceBtn("id-toolbar-" + prefix + "-btn-pagesize", me.btnPageSize);
        replaceBtn("id-toolbar-" + prefix + "-btn-clearstyle", me.btnClearStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-copystyle", me.btnCopyStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-colorschemas", me.btnColorSchemas);
        replaceBtn("id-toolbar-" + prefix + "-btn-hidebars", me.btnHide);
        replaceBtn("id-toolbar-" + prefix + "-btn-settings", me.btnAdvSettings);
        replaceBtn("id-toolbar-" + prefix + "-btn-halign", me.btnHorizontalAlign);
        replaceField("id-toolbar-" + prefix + "-field-fontname", me.cmbFont);
        replaceField("id-toolbar-" + prefix + "-field-fontsize", me.cmbFontSize);
        replaceField("id-toolbar-" + prefix + "-field-styles", me.listStyles);
    },
    createDelayedElements: function () {
        var btns_arr = [],
        me = this;
        var isCompactView = (window.localStorage.getItem("de-compact-toolbar") && parseInt(window.localStorage.getItem("de-compact-toolbar")) == 1) || false;
        me.rendererComponents(isCompactView ? "short" : "full");
        var dataTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" style="{imgstyle}" class="{imgcls}"/>', "</div>", "</tpl>");
        var viewData = [{
            offsety: 0,
            data: {
                type: 0,
                subtype: -1
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 38,
            data: {
                type: 0,
                subtype: 1
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 76,
            data: {
                type: 0,
                subtype: 2
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 114,
            data: {
                type: 0,
                subtype: 3
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 152,
            data: {
                type: 0,
                subtype: 4
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 190,
            data: {
                type: 0,
                subtype: 5
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 228,
            data: {
                type: 0,
                subtype: 6
            },
            imgcls: "item-markerlist"
        },
        {
            offsety: 266,
            data: {
                type: 0,
                subtype: 7
            },
            imgcls: "item-markerlist"
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-position: 0 {0}px;", -viewData[i].offsety);
        }
        this.btnMarkers.menu = Ext.create("Common.component.MenuDataViewPicker", {
            width: 194,
            height: 108,
            contentWidth: 174,
            dataTpl: dataTpl,
            viewData: viewData
        });
        btns_arr.push(this.btnMarkers);
        viewData = [{
            offsety: 0,
            data: {
                type: 1,
                subtype: -1
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 518,
            data: {
                type: 1,
                subtype: 4
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 592,
            data: {
                type: 1,
                subtype: 5
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 666,
            data: {
                type: 1,
                subtype: 6
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 296,
            data: {
                type: 1,
                subtype: 1
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 370,
            data: {
                type: 1,
                subtype: 2
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 444,
            data: {
                type: 1,
                subtype: 3
            },
            imgcls: "item-numberlist"
        },
        {
            offsety: 740,
            data: {
                type: 1,
                subtype: 7
            },
            imgcls: "item-numberlist"
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-position:0 {0}px;", -viewData[i].offsety);
        }
        this.btnNumbers.menu = Ext.create("Common.component.MenuDataViewPicker", {
            width: 336,
            height: 180,
            contentWidth: 316,
            dataTpl: dataTpl,
            viewData: viewData
        });
        btns_arr.push(this.btnNumbers);
        viewData = [{
            offsety: 0,
            data: {
                type: 2,
                subtype: -1
            },
            imgcls: "item-multilevellist"
        },
        {
            offsety: 74,
            data: {
                type: 2,
                subtype: 1
            },
            imgcls: "item-multilevellist"
        },
        {
            offsety: 148,
            data: {
                type: 2,
                subtype: 2
            },
            imgcls: "item-multilevellist"
        },
        {
            offsety: 222,
            data: {
                type: 2,
                subtype: 3
            },
            imgcls: "item-multilevellist"
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-position:0 {0}px;", -viewData[i].offsety);
        }
        this.btnMultilevels.menu = Ext.create("Common.component.MenuDataViewPicker", {
            width: 173,
            height: 180,
            contentWidth: 153,
            dataTpl: dataTpl,
            viewData: viewData
        });
        btns_arr.push(this.btnMultilevels);
        this.btnFontColor.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            items: [this.colorsText = Ext.create("Common.component.ThemeColorPalette", {
                id: "menu-palette-font-color",
                value: "000000",
                width: 165,
                height: 214,
                dynamiccolors: true,
                dyncolorscount: 10,
                currentColor: undefined,
                colors: [me.textThemeColors, "-", {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 3
                },
                {
                    color: "FFFFFF",
                    effectId: 4
                },
                {
                    color: "000000",
                    effectId: 5
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 3
                },
                {
                    color: "FFFFFF",
                    effectId: 4
                },
                "-", {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 3
                },
                {
                    color: "FFFFFF",
                    effectId: 4
                },
                {
                    color: "000000",
                    effectId: 5
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                {
                    color: "FFFFFF",
                    effectId: 2
                },
                {
                    color: "000000",
                    effectId: 1
                },
                "-", "--", "-", me.textStandartColors, "-", "3D55FE", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"],
                listeners: {
                    select: {
                        fn: function (picker, color, eOpts) {
                            if (typeof(color) == "object") {
                                me.btnFontColor.setColor(color.color);
                            } else {
                                me.btnFontColor.setColor(color);
                            }
                            Ext.menu.Manager.hideAll();
                            me.colorsText.currentColor = color;
                            me.api.put_TextColor(me.getRgbColor(color));
                            Common.component.Analytics.trackEvent("ToolBar", "Text Color");
                        }
                    }
                }
            }), {
                cls: "menu-item-noicon menu-item-color-palette-theme",
                text: this.textNewColor,
                listeners: {
                    click: function (item, event) {
                        me.colorsText.addNewColor();
                    }
                }
            }],
            listeners: {
                hide: function () {
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        btns_arr.push(this.btnFontColor);
        viewData = [{
            offsety: 132,
            data: {
                type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
            }
        },
        {
            offsety: 99,
            data: {
                type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
            }
        },
        {
            offsety: 66,
            data: {
                type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
            }
        },
        {
            offsety: 33,
            data: {
                type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
            }
        },
        {
            offsety: 0,
            data: {
                type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
            }
        },
        {
            offsety: 165,
            data: {
                type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
            }
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-image:url({0});", "resources/img/toolbar/colontitules.png");
            viewData[i].imgstyle += Ext.String.format("background-image:-webkit-image-set(url({0}) 1x, url({1}) 2x);", "resources/img/toolbar/colontitules.png", "resources/img/toolbar/colontitules@2x.png");
            viewData[i].imgstyle += Ext.String.format("background-position:0 {0}px; width:33px; height:33px;", -viewData[i].offsety);
        }
        this.mnuInsertPageNum = Ext.widget("menuitem", {
            text: this.textInsertPageNumber,
            cls: "menu-item-noicon",
            hideOnClick: false,
            menu: {
                showSeparator: false,
                items: [me.pageNumHeaderFooter = Ext.widget("container", {
                    style: "text-align:center;padding: 8px 0 0 0;",
                    cls: "pagenum-container",
                    items: [{
                        xtype: "cmddataviewpicker",
                        padding: "4px 4px 1px 12px",
                        cls: "menu-insertpagenum",
                        width: 175,
                        height: 110,
                        contentWidth: 155,
                        dataTpl: dataTpl,
                        viewData: viewData,
                        listeners: {
                            select: me._onInsertPageNumber,
                            scope: me
                        }
                    }]
                }), me.pageNumCurrentPos = Ext.widget("menuitem", {
                    text: this.textToCurrent,
                    cls: "menu-item-noicon",
                    listeners: {
                        click: {
                            fn: function () {
                                if (me.api) {
                                    me.api.put_PageNum(-1);
                                }
                                me.fireEvent("editcomplete", me);
                                Common.component.Analytics.trackEvent("ToolBar", "Page Number");
                            }
                        }
                    }
                })],
                listeners: {
                    hide: {
                        fn: function () {
                            me.fireEvent("editcomplete", me);
                        }
                    }
                }
            }
        });
        this.btnEditHeader.menu.add(this.mnuInsertPageNum);
        this.paragraphControls.push(this.pageNumCurrentPos);
        var pagesizeTemplate = Ext.create("Ext.XTemplate", '<tpl if="plain">{text}</tpl>' + '<tpl if="!plain">' + '<a id="{id}-itemEl" class="' + Ext.baseCSSPrefix + 'menu-item-link menu-item-usetitle" href="{href}" hidefocus="true" unselectable="on">' + '<img id="{id}-iconEl" src="{icon}" class="' + Ext.baseCSSPrefix + 'menu-item-icon {iconCls}" />' + '<div class="menu-item-title"><span class="' + Ext.baseCSSPrefix + 'menu-item-text" style="font-weight:bold;">{[this.getTText(values.text)]}</span></div>' + '<div class="menu-item-decript"><span class="' + Ext.baseCSSPrefix + 'menu-item-text">{[this.getDText(values.text)]}</span></div>' + "</a>" + "</tpl>", {
            getTText: function (t) {
                return (/^.*(?=\|)/).exec(t) || t;
            },
            getDText: function (t) {
                var out = (/\|(.*)$/).exec(t);
                return out ? out[1] : "";
            }
        });
        this.btnPageSize.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            id: "menu-page-size",
            defaults: {
                group: "pagesize",
                checked: false,
                renderTpl: pagesizeTemplate,
                checkHandler: function (item, checked) {
                    if (me.api && checked) {
                        me.btnPageSize.pagesize[0] = item.pagesize[0];
                        me.btnPageSize.pagesize[1] = item.pagesize[1];
                        me.api.change_DocSize(item.pagesize[0], item.pagesize[1]);
                        Common.component.Analytics.trackEvent("ToolBar", "Page Size");
                    }
                    me.fireEvent("editcomplete", me);
                }
            },
            items: [{
                text: "US Letter|21,59cm x 27,94cm",
                pagesize: [215.9, 279.4]
            },
            {
                text: "US Legal|21,59cm x 35,56cm",
                pagesize: [215.9, 355.6]
            },
            {
                checked: true,
                text: "A4|21cm x 29,7cm",
                pagesize: [210, 297]
            },
            {
                text: "A5|14,81cm x 20,99cm",
                pagesize: [148.1, 209.9]
            },
            {
                text: "B5|17,6cm x 25,01cm",
                pagesize: [176, 250.1]
            },
            {
                text: "Envelope #10|10,48cm x 24,13cm",
                pagesize: [104.8, 241.3]
            },
            {
                text: "Envelope DL|11,01cm x 22,01cm",
                pagesize: [110.1, 220.1]
            },
            {
                text: "Tabloid|27,94cm x 43,17cm",
                pagesize: [279.4, 431.7]
            },
            {
                text: "A3|29,7cm x 42,01cm",
                pagesize: [297, 420.1]
            },
            {
                text: "Tabloid Oversize|30,48cm x 45,71cm",
                pagesize: [304.8, 457.1]
            },
            {
                text: "ROC 16K|19,68cm x 27,3cm",
                pagesize: [196.8, 273]
            },
            {
                text: "Envelope Choukei 3|11,99cm x 23,49cm",
                pagesize: [119.9, 234.9]
            },
            {
                text: "Super B/A3|33,02cm x 48,25cm",
                pagesize: [330.2, 482.5]
            }]
        });
        btns_arr.push(this.btnPageSize);
        this.btnColorSchemas.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            id: "toolbar-menu-color-schemas",
            items: []
        });
        btns_arr.push(this.btnColorSchemas);
        var value = window.localStorage.getItem("de-compact-toolbar");
        var valueCompact = (value !== null && parseInt(value) == 1);
        value = window.localStorage.getItem("de-hidden-title");
        var valueTitle = (value !== null && parseInt(value) == 1);
        value = window.localStorage.getItem("de-hidden-status");
        var valueStatus = (value !== null && parseInt(value) == 1);
        this.btnHide.menu = Ext.create("Ext.menu.Menu", {
            id: "menu-hide-bars",
            showSeparator: false,
            defaults: {
                checked: false,
                targetbar: undefined,
                hideOnClick: true
            },
            items: [{
                id: "mnu-hide-bars-toolbar",
                text: this.textCompactView,
                checked: valueCompact
            },
            {
                text: this.textHideTitleBar,
                checked: valueTitle,
                checkHandler: function (item, checked) {
                    if (item.targetbar === undefined) {
                        item.targetbar = Ext.ComponentQuery.query("commonheader")[0];
                    }
                    if (item.targetbar) {
                        (checked) ? item.targetbar.hide() : item.targetbar.show();
                    }
                    window.localStorage.setItem("de-hidden-title", checked ? 1 : 0);
                    me.fireEvent("editcomplete", me);
                }
            },
            {
                text: this.textHideStatusBar,
                checked: valueStatus,
                checkHandler: function (item, checked) {
                    if (item.targetbar === undefined) {
                        item.targetbar = Ext.ComponentQuery.query("documentstatusinfo")[0];
                    }
                    if (item.targetbar) {
                        (checked) ? item.targetbar.hide() : item.targetbar.show();
                    }
                    window.localStorage.setItem("de-hidden-status", checked ? 1 : 0);
                    me.fireEvent("editcomplete", me);
                }
            },
            {
                xtype: "menuseparator"
            },
            this.btnFitPage, this.btnFitWidth, {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                width: 165,
                style: "font-size:11px; padding:6px 2px 3px 32px;",
                items: [{
                    xtype: "label",
                    text: me.textZoom
                },
                {
                    xtype: "tbspacer",
                    flex: 1
                },
                this.btnZoomOut, {
                    xtype: "tbspacer",
                    width: 1
                },
                this.txtZoom, this.btnZoomIn, {
                    xtype: "tbspacer",
                    width: 5
                }]
            }]
        });
        btns_arr.push(this.btnHide);
        for (i = 0; i < btns_arr.length; i++) {
            var btn = btns_arr[i];
            btn.menu.ownerCt = btn;
            btn.mon(btns_arr[i].menu, {
                scope: btn,
                show: btn.onMenuShow,
                hide: btn.onMenuHide
            });
            if (btn.rendered) {
                btn.initAria();
            }
        }
        var fontSize = [{
            "sizevalue": 8,
            "sizestring": "8"
        },
        {
            "sizevalue": 9,
            "sizestring": "9"
        },
        {
            "sizevalue": 10,
            "sizestring": "10"
        },
        {
            "sizevalue": 11,
            "sizestring": "11"
        },
        {
            "sizevalue": 12,
            "sizestring": "12"
        },
        {
            "sizevalue": 14,
            "sizestring": "14"
        },
        {
            "sizevalue": 16,
            "sizestring": "16"
        },
        {
            "sizevalue": 18,
            "sizestring": "18"
        },
        {
            "sizevalue": 20,
            "sizestring": "20"
        },
        {
            "sizevalue": 22,
            "sizestring": "22"
        },
        {
            "sizevalue": 24,
            "sizestring": "24"
        },
        {
            "sizevalue": 26,
            "sizestring": "26"
        },
        {
            "sizevalue": 28,
            "sizestring": "28"
        },
        {
            "sizevalue": 36,
            "sizestring": "36"
        },
        {
            "sizevalue": 48,
            "sizestring": "48"
        },
        {
            "sizevalue": 72,
            "sizestring": "72"
        }];
        this.cmbFontSize.store.loadData(fontSize);
        this.cmbFontSize.select(this.cmbFontSize.store.getAt(3));
        if (this.api) {
            this.api.asc_registerCallback("asc_onTextColor", Ext.bind(this._onTextColor, this));
            this.api.asc_registerCallback("asc_onLockHeaderFooters", Ext.bind(this._onLockHeaderFooters, this));
            this.api.asc_registerCallback("asc_onUnLockHeaderFooters", Ext.bind(this._onUnLockHeaderFooters, this));
            var schemes = this.api.get_PropertyThemeColorSchemes();
            if (schemes) {
                this._onSendThemeColorSchemes(schemes);
            }
        }
        if (this.needShowSynchTip) {
            this.needShowSynchTip = false;
            this._onCollaborativeChanges();
        }
    },
    textBold: "Bold",
    textItalic: "Italic",
    textUnderline: "Underline",
    textStrikeout: "Strikeout",
    textSuperscript: "Superscript",
    textSubscript: "Subscript",
    strMenuNoFill: "No Fill",
    tipFontName: "Font Name",
    tipFontSize: "Font Size",
    tipCopy: "Copy",
    tipPaste: "Paste",
    tipUndo: "Undo",
    tipRedo: "Redo",
    tipPrint: "Print",
    tipSave: "Save",
    tipIncFont: "Increment font size",
    tipDecFont: "Decrement font size",
    tipHighlightColor: "Highlight color",
    tipFontColor: "Font color",
    tipMarkers: "Bullets",
    tipNumbers: "Numbering",
    tipMultilevels: "Outline",
    tipAlignLeft: "Align Left",
    tipAlignRight: "Align Right",
    tipAlignCenter: "Align Center",
    tipAlignJust: "Justified",
    tipDecPrLeft: "Decrease Indent",
    tipIncPrLeft: "Increase Indent",
    tipShowHiddenChars: "Nonprinting Characters",
    tipLineSpace: "Paragraph Line Spacing",
    tipPrColor: "Background color",
    tipInsertTable: "Insert Table",
    tipInsertImage: "Insert Picture",
    tipPageBreak: "Insert Page Break",
    tipInsertNum: "Insert Page Number",
    tipClearStyle: "Clear Style",
    tipCopyStyle: "Copy Style",
    tipPageSize: "Page Size",
    tipPageOrient: "Page Orientation",
    tipBack: "Back",
    tipInsertShape: "Insert Autoshape",
    mniImageFromFile: "Picture from file",
    mniImageFromUrl: "Picture from url",
    mniCustomTable: "Insert Custom Table",
    textTitleError: "Error",
    textInsertPageNumber: "Insert page number",
    textToCurrent: "To Current Position",
    tipEditHeader: "Edit Document Header or Footer",
    mniEditHeader: "Edit Document Header",
    mniEditFooter: "Edit Document Footer",
    tipInsertHyperlink: "Add Hyperlink",
    mniHiddenChars: "Nonprinting Characters",
    mniHiddenBorders: "Hidden Table Borders",
    tipNewDocument: "New Document",
    tipOpenDocument: "Open Document",
    tipSynchronize: "The document has been changed by another user. Please click to save your changes and reload the updates.",
    textNewColor: "Add New Custom Color",
    tipInsertChart: "Insert Chart",
    textLine: "Line Chart",
    textColumn: "Column Chart",
    textBar: "Bar Chart",
    textArea: "Area Chart",
    textPie: "Pie Chart",
    textPoint: "Point Chart",
    textStock: "Stock Chart",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    tipColorSchemas: "Change Color Scheme",
    tipInsertText: "Insert Text",
    tipHAligh: "Horizontal Align",
    tipViewSettings: "View Settings",
    tipAdvSettings: "Advanced Settings",
    textCompactView: "View Compact Toolbar",
    textHideTitleBar: "Hide Title Bar",
    textHideStatusBar: "Hide Status Bar",
    textHideLines: "Hide Lines",
    textFitPage: "Fit Page",
    textFitWidth: "Fit Width",
    textZoom: "Zoom",
    mniEditDropCap: "Drop Cap Settings",
    textNone: "None",
    textInText: "In Text",
    textInMargin: "In Margin",
    tipDropCap: "Insert drop cap",
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