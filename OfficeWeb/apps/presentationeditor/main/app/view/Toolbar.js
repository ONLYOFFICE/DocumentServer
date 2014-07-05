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
 Ext.define("PE.view.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    alias: "widget.petoolbar",
    cls: "pe-toolbar",
    height: 68,
    minWidth: 1080,
    requires: ["Ext.data.Store", "Ext.Array", "Common.component.MenuDataViewPicker", "Common.component.SplitColorButton", "Common.plugin.ComboBoxScrollPane", "Common.view.ComboFonts", "Common.component.ThemeColorPalette", "PE.component.DimensionPicker", "Common.component.ComboDataView", "Common.plugin.MenuExpand", "Ext.util.Cookies", "Common.component.SynchronizeTip"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        this.addEvents("editcomplete");
        this.addEvents("inserttable", "insertimage", "insertshape");
        this._state = {
            clrtext: undefined
        };
        this.paragraphControls = [];
        this.shapeControls = [];
        this.slideOnlyControls = [];
        this.synchTooltip = undefined;
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        var hidetip = window.localStorage.getItem("pe-hide-synch");
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
        Ext.define("PE.view.FontSize", {
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
            model: "PE.view.FontSize",
            data: []
        });
        this.cmbFontSize = Ext.create("Ext.form.field.ComboBox", {
            id: "toolbar-combo-font-size",
            store: storesize,
            displayField: "sizestring",
            queryMode: "local",
            typeAhead: false,
            selectOnFocus: true,
            margin: "0 0 0 0",
            width: 60,
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
            margin: "0 2 0 0",
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
        this.slideOnlyControls.push(this.btnCopy);
        this.btnPaste = Ext.create("Ext.Button", {
            id: "toolbar-button-paste",
            tooltip: this.tipPaste + " (Ctrl+V)",
            iconCls: "asc-toolbar-btn btn-paste"
        });
        this.slideOnlyControls.push(this.btnPaste);
        this.btnUndo = Ext.create("Ext.Button", {
            id: "toolbar-button-undo",
            tooltip: this.tipUndo + " (Ctrl+Z)",
            iconCls: "asc-toolbar-btn btn-undo",
            disabled: true
        });
        this.slideOnlyControls.push(this.btnUndo);
        this.btnRedo = Ext.create("Ext.Button", {
            id: "toolbar-button-redo",
            tooltip: this.tipRedo + " (Ctrl+Y)",
            iconCls: "asc-toolbar-btn btn-redo",
            disabled: true
        });
        this.slideOnlyControls.push(this.btnRedo);
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
        this.slideOnlyControls.push(this.btnCopyStyle);
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
                    text: this.textAlignLeft,
                    icls: "halign-left",
                    halign: 1,
                    checked: true
                },
                {
                    iconCls: "mnu-icon-item mnu-align-center",
                    text: this.textAlignCenter,
                    icls: "halign-center",
                    halign: 2
                },
                {
                    iconCls: "mnu-icon-item mnu-align-right",
                    text: this.textAlignRight,
                    icls: "halign-right",
                    halign: 0
                },
                {
                    iconCls: "mnu-icon-item mnu-align-just",
                    text: this.textAlignJust,
                    icls: "halign-just",
                    halign: 3
                }]
            }
        });
        this.paragraphControls.push(this.btnHorizontalAlign);
        this.btnVerticalAlign = Ext.create("Ext.button.Button", {
            id: "toolbar-button-valign",
            tooltip: this.tipVAligh,
            iconCls: "asc-toolbar-btn btn-vertalign",
            cls: "valign-middle",
            icls: "valign-middle",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-vertalign",
                defaults: {
                    cls: "toolbar-menu-icon-item",
                    group: "valignGroup",
                    checked: false
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-align-top",
                    text: this.textAlignTop,
                    icls: "valign-top",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                },
                {
                    iconCls: "mnu-icon-item mnu-align-middle",
                    text: this.textAlignMiddle,
                    icls: "valign-middle",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR,
                    checked: true
                },
                {
                    iconCls: "mnu-icon-item mnu-align-bottom",
                    text: this.textAlignBottom,
                    icls: "valign-bottom",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                }]
            }
        });
        this.paragraphControls.push(this.btnVerticalAlign);
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
                        xtype: "pedimensionpicker",
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
        this.slideOnlyControls.push(this.btnInsertTable);
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
        this.slideOnlyControls.push(this.btnInsertImage);
        this.btnInsertHyperlink = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-hyperlink",
            tooltip: this.tipInsertHyperlink,
            iconCls: "asc-toolbar-btn btn-inserthyperlink"
        });
        this.paragraphControls.push(this.btnInsertHyperlink);
        this.btnInsertText = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-text",
            tooltip: this.tipInsertText,
            iconCls: "asc-toolbar-btn btn-text",
            enableToggle: true
        });
        this.slideOnlyControls.push(this.btnInsertText);
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
        this.slideOnlyControls.push(this.btnInsertShape);
        this.btnColorSchemas = Ext.create("Ext.button.Button", {
            id: "toolbar-button-color-schemas",
            tooltip: this.tipColorSchemas,
            iconCls: "asc-toolbar-btn btn-colorschemas",
            split: true
        });
        this.btnAddSlide = Ext.create("Ext.button.Button", {
            id: "toolbar-button-add-slide",
            tooltip: this.tipAddSlide,
            iconCls: "asc-toolbar-btn btn-addslide",
            scale: "large",
            split: true
        });
        this.btnChangeSlide = Ext.create("Ext.button.Button", {
            id: "toolbar-button-change-slide",
            tooltip: this.tipChangeSlide,
            iconCls: "asc-toolbar-btn btn-changeslide",
            split: true
        });
        this.btnPreview = Ext.create("Ext.Button", {
            id: "toolbar-button-preview",
            tooltip: this.tipPreview,
            iconCls: "asc-toolbar-btn btn-preview"
        });
        this.btnNewDocument = Ext.create("Ext.Button", {
            id: "toolbar-button-newdocument",
            tooltip: this.tipNewDocument,
            iconCls: "asc-toolbar-btn btn-newdocument"
        });
        this.btnOpenDocument = Ext.create("Ext.Button", {
            id: "toolbar-button-opendocument",
            tooltip: this.tipOpenDocument,
            iconCls: "asc-toolbar-btn btn-opendocument"
        });
        this.btnShapeAlign = Ext.create("Ext.Button", {
            id: "toolbar-button-shape-align",
            tooltip: this.tipShapeAlign,
            iconCls: "asc-toolbar-btn btn-align-shape",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-shape-align",
                defaults: {
                    cls: "toolbar-menu-icon-item"
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-shape-align-left",
                    text: this.textShapeAlignLeft,
                    halign: c_oAscAlignShapeType.ALIGN_LEFT
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-center",
                    text: this.textShapeAlignCenter,
                    halign: c_oAscAlignShapeType.ALIGN_CENTER
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-right",
                    text: this.textShapeAlignRight,
                    halign: c_oAscAlignShapeType.ALIGN_RIGHT
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-top",
                    text: this.textShapeAlignTop,
                    halign: c_oAscAlignShapeType.ALIGN_TOP
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-middle",
                    text: this.textShapeAlignMiddle,
                    halign: c_oAscAlignShapeType.ALIGN_MIDDLE
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-bottom",
                    text: this.textShapeAlignBottom,
                    halign: c_oAscAlignShapeType.ALIGN_BOTTOM
                },
                {
                    xtype: "menuseparator"
                },
                {
                    iconCls: "mnu-icon-item mnu-distrib-hor",
                    text: this.txtDistribHor,
                    halign: 6
                },
                {
                    iconCls: "mnu-icon-item mnu-distrib-vert",
                    text: this.txtDistribVert,
                    halign: 7
                }]
            }
        });
        this.shapeControls.push(this.btnShapeAlign);
        this.slideOnlyControls.push(this.btnShapeAlign);
        this.btnShapeArrange = Ext.create("Ext.Button", {
            id: "toolbar-button-shape-arrange",
            tooltip: this.tipShapeArrange,
            iconCls: "asc-toolbar-btn btn-arrange-shape",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-shape-arrange",
                defaults: {
                    cls: "toolbar-menu-icon-item"
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-arrange-front",
                    text: this.textArrangeFront,
                    halign: 1
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-back",
                    text: this.textArrangeBack,
                    halign: 2
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-forward",
                    text: this.textArrangeForward,
                    halign: 3
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-backward",
                    text: this.textArrangeBackward,
                    halign: 4
                },
                {
                    xtype: "menuseparator"
                },
                this.mnuGroupShapes = Ext.widget("menuitem", {
                    iconCls: "mnu-icon-item mnu-group",
                    text: this.txtGroup,
                    halign: 5
                }), this.mnuUnGroupShapes = Ext.widget("menuitem", {
                    iconCls: "mnu-icon-item mnu-ungroup",
                    text: this.txtUngroup,
                    halign: 6
                })]
            }
        });
        this.slideOnlyControls.push(this.btnShapeArrange);
        this.btnSlideSize = Ext.create("Ext.button.Button", {
            id: "toolbar-button-slide-size",
            tooltip: this.tipSlideSize,
            iconCls: "asc-toolbar-btn btn-slidesize",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-slide-size",
                items: [{
                    text: this.mniSlideStandard,
                    cls: "menu-item-noicon",
                    slidetype: 0,
                    checked: false,
                    group: "slidesize"
                },
                {
                    text: this.mniSlideWide,
                    cls: "menu-item-noicon",
                    slidetype: 1,
                    checked: false,
                    group: "slidesize"
                },
                Ext.widget("menuseparator"), {
                    text: this.mniSlideAdvanced,
                    cls: "menu-item-noicon"
                }]
            }
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
        var btnPlaceholderHtml = function (id, iconCls, style) {
            return Ext.String.format('<div class="toolbar-btn-placeholder x-btn-default-toolbar-small-icon x-btn-default-toolbar-small document-loading" id="{0}" style="{2}"><span class="replaceme x-btn-icon asc-toolbar-btn {1}">&nbsp;</span></div>', id, iconCls, style || "");
        };
        var btnSplitPlaceholderHtml = function (id, iconCls, style, extraCls) {
            return Ext.String.format('<div class="toolbar-btn-placeholder x-btn-default-toolbar-small-icon x-btn-default-toolbar-small document-loading x-btn-split x-btn-split-right{3}" id="{0}" style="width: 34px; {2}"><span class="replaceme x-btn-icon asc-toolbar-btn {1}">&nbsp;</span></div>', id, iconCls, style || "", extraCls ? " " + extraCls : "");
        };
        var btnSplitLargePlaceholderHtml = function (id, iconCls, style, extraCls) {
            return Ext.String.format('<div class="toolbar-btn-large-placeholder x-btn-default-toolbar-large-icon x-btn-default-toolbar-large document-loading x-btn-split x-btn-split-right{3}" id="{0}" style="{2}"><span class="replaceme x-btn-icon asc-toolbar-btn {1}">&nbsp;</span></div>', id, iconCls, style || "", extraCls ? " " + extraCls : "");
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
        var isCompactView = (window.localStorage.getItem("pe-compact-toolbar") && parseInt(window.localStorage.getItem("pe-compact-toolbar")) == 1) || false;
        this.setHeight(isCompactView ? 38 : 68);
        this.html = ['<div id="id-toolbar-short" style="' + (isCompactView ? "display: table;": "display: none;") + 'width: 100%; height: 22px; margin-top: 3px;" >', '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-short-btn-addslide", "btn-addslide", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-changeslide", "btn-changeslide", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-preview", "btn-preview", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-short-btn-print", "btn-print", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-save", "btn-save"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-short-btn-undo", "btn-undo", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-redo", "btn-redo", "margin: 0 1px 0 3px;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="width: 200px; margin-top: 2px;">', comboBoxHtml("id-toolbar-short-field-fontname", "", "display: inline; float: left; line-height: 20px; padding: 0; width: 127px; height: 22px; margin-right: 4px;"), comboBoxHtml("id-toolbar-short-field-fontsize", "", "display: inline; float: left; padding: 0; line-height: 20px; width: 59px; height: 22px; margin-right: 2px;"), "</div>", "</div>", '<div class="toolbar-group" style="padding-left: 0">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-bold", "btn-bold", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-italic", "btn-italic", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-underline", "btn-underline", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-fontcolor", "btn-fontcolor", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-clearstyle", "btn-clearstyle", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-copystyle", "btn-copystyle", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-setmarkers", "btn-setmarkers", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-numbering", "btn-numbering", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-decoffset", "btn-decoffset", "margin: 0 4px 0 2px;"), btnPlaceholderHtml("id-toolbar-short-btn-incoffset", "btn-incoffset", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-halign", "btn-align-left", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-vertalign", "btn-valign-middle", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-linespace", "btn-linespace", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-arrange-shape", "btn-arrange-shape", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-align-shape", "btn-align-shape", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-insertshape", "btn-insertshape", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-text", "btn-text", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-inserttable", "btn-inserttable", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-insertimage", "btn-insertimage", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-inserthyperlink", "btn-inserthyperlink", "margin: 0 4px 0 0;"), "</div>", "</div>", '<div class="toolbar-group" style="width: 100%;"></div>', '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-hidebars", "btn-hidebars", "margin: 0 4px 0 0;"), "</div>", "</div>", "</div>", '<div id="id-toolbar-full" style="' + (isCompactView ? "display: none;": "display: table;") + 'width: 100%; margin-top: 3px;" >', '<div class="toolbar-group" id="id-toolbar-full-group-native">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-newdocument", "btn-newdocument"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-opendocument", "btn-opendocument"), "</div>", "</div>", '<div class="toolbar-group separator" id="id-toolbar-full-separator-native">', separatorHtml("long"), "</div>", '<div class="toolbar-group" style="vertical-align: middle;">', btnSplitLargePlaceholderHtml("id-toolbar-full-btn-addslide", "btn-addslide"), "</div>", '<div class="toolbar-group" style="padding-left: 4px;">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-changeslide", "btn-changeslide"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-preview", "btn-preview"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-print", "btn-print"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-save", "btn-save"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-copy", "btn-copy", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-paste", "btn-paste"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-undo", "btn-undo", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-redo", "btn-redo"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', comboBoxHtml("id-toolbar-full-field-fontname", "", "display: inline; float: left; line-height: 20px; padding: 0; width: 127px; height: 22px; margin-right: 4px;"), comboBoxHtml("id-toolbar-full-field-fontsize", "", "display: inline; float: left; padding: 0; line-height: 20px; width: 59px; height: 22px;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-bold", "btn-bold", "margin: 0 1px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-italic", "btn-italic", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-underline", "btn-underline", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-strikeout", "btn-strike", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-fontcolor", "btn-fontcolor", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-superscript", "btn-superscript", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-subscript", "btn-subscript", "margin: 0 18px 0 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-clearstyle", "btn-clearstyle"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-copystyle", "btn-copystyle"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="width:144px;">', btnSplitPlaceholderHtml("id-toolbar-full-btn-setmarkers", "btn-setmarkers", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-numbering", "btn-numbering", "margin: 0 8px 0 0;"), separatorHtml("short", "position: absolute; margin-top: 2px;"), btnPlaceholderHtml("id-toolbar-full-btn-decoffset", "btn-decoffset", "margin: 0 8px 0 14px;"), btnPlaceholderHtml("id-toolbar-full-btn-incoffset", "btn-incoffset"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-halign", "btn-align-left", "margin: 0 2px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-vertalign", "btn-valign-middle", "margin: 0 8px 0 0;"), separatorHtml("short", "position: absolute; margin-top: 2px;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-linespace", "btn-linespace", "margin: 0 2px 0 14px;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-arrange-shape", "btn-arrange-shape"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-align-shape", "btn-align-shape"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-insertshape", "btn-insertshape", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-text", "btn-text", "margin: 0 14px 0 0"), btnPlaceholderHtml("id-toolbar-full-btn-inserthyperlink", "btn-inserthyperlink", "margin: 0 0 0 0"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-inserttable", "btn-inserttable", "margin: 0 2px 0 0"), btnSplitPlaceholderHtml("id-toolbar-full-btn-insertimage", "btn-insertimage", "margin: 0 2px 0 0"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-colorschemas", "btn-colorschemas"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-slidesize", "btn-slidesize"), "</div>", "</div>", '<div class="toolbar-group" id="id-toolbar-full-group-styles" style="width: 100%;">', comboDataViewHtml("id-toolbar-full-field-styles", "", "margin: 0 10px; height: 54px;"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-hidebars", "btn-hidebars", "margin: 0 5px 0 0;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-settings", "btn-settings"), "</div>", "</div>", "</div>"];
        this.items = [];
        this.listTheme = Ext.create("Common.component.ComboDataView", {
            id: "toolbar-combo-view-themes",
            flex: 1,
            height: 54,
            itemWidth: 71,
            itemHeight: 40,
            menuMaxHeight: 500,
            minWidth: 100,
            repeatedselect: true,
            handleGlobalResize: true,
            viewData: []
        });
        this.listTheme.dataMenu.applyContentWidth = true;
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onCollaborativeChanges", Ext.bind(this._onCollaborativeChanges, this));
        }
        return this;
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
    _onSendThemeColors: function (colors, standart_colors) {
        var standartcolors = [];
        if (standart_colors) {
            for (var i = 0; i < standart_colors.length; i++) {
                var item = this.getHexColor(standart_colors[i].get_r(), standart_colors[i].get_g(), standart_colors[i].get_b());
                standartcolors.push(item);
            }
        }
        var effectcolors = [];
        var clr;
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
    },
    _onSlideStoreDataChanged: function () {
        this.btnAddSlide.menu.picker.needArrangeSlideItems = true;
        this.btnChangeSlide.menu.picker.needArrangeSlideItems = true;
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
        var selector = "div.main-thumb";
        var el = this.getEl();
        var thumbs = el.query(selector);
        var i = 0;
        var limit_height = (this.itemHeight !== undefined) ? this.itemHeight : 50;
        while (i < thumbs.length) {
            var height = 0;
            for (var j = i; j < i + cols; j++) {
                if (j >= thumbs.length) {
                    break;
                }
                var thEl = Ext.get(thumbs[j]);
                var h = thEl.getHeight();
                if (h < limit_height) {
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
    setMode: function (mode) {
        if (mode.isDisconnected) {
            this.btnNewDocument.setDisabled(true);
            this.btnOpenDocument.setDisabled(true);
            this.btnAddSlide.setDisabled(true);
            this.btnChangeSlide.setDisabled(true);
            this.btnSave.setDisabled(true);
            this.btnCopy.setDisabled(true);
            this.btnPaste.setDisabled(true);
            this.btnUndo.setDisabled(true);
            this.btnRedo.setDisabled(true);
            this.cmbFont.setDisabled(true);
            this.cmbFontSize.setDisabled(true);
            this.btnBold.setDisabled(true);
            this.btnItalic.setDisabled(true);
            this.btnUnderline.setDisabled(true);
            this.btnStrikeout.setDisabled(true);
            this.btnSuperscript.setDisabled(true);
            this.btnSubscript.setDisabled(true);
            this.btnFontColor.setDisabled(true);
            this.btnClearStyle.setDisabled(true);
            this.btnCopyStyle.setDisabled(true);
            this.btnMarkers.setDisabled(true);
            this.btnNumbers.setDisabled(true);
            this.btnDecLeftOffset.setDisabled(true);
            this.btnIncLeftOffset.setDisabled(true);
            this.btnLineSpace.setDisabled(true);
            this.btnHorizontalAlign.setDisabled(true);
            this.btnVerticalAlign.setDisabled(true);
            this.btnShapeArrange.setDisabled(true);
            this.btnShapeAlign.setDisabled(true);
            this.btnInsertTable.setDisabled(true);
            this.btnInsertImage.setDisabled(true);
            this.btnInsertText.setDisabled(true);
            this.btnInsertHyperlink.setDisabled(true);
            this.btnInsertShape.setDisabled(true);
            this.btnColorSchemas.setDisabled(true);
            this.btnSlideSize.setDisabled(true);
            this.listTheme.setDisabled(true);
        }
        if (!mode.nativeApp) {
            var nativeBtnGroup = Ext.get("id-toolbar-full-group-native");
            if (nativeBtnGroup) {
                nativeBtnGroup.setVisibilityMode(Ext.Element.DISPLAY);
                nativeBtnGroup.hide();
            }
            var nativeSeparator = Ext.get("id-toolbar-full-separator-native");
            if (nativeSeparator) {
                nativeSeparator.setVisibilityMode(Ext.Element.DISPLAY);
                nativeSeparator.hide();
            }
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
                    var listStylesVisible = (me.listTheme.rendered && me.listTheme.getEl() && me.listTheme.getEl().up("#id-toolbar-full-group-styles") && me.listTheme.getEl().up("#id-toolbar-full-group-styles").isVisible());
                    if (me.listTheme.dataMenu.picker.store.getCount() > 0 && listStylesVisible) {
                        me.listTheme.doComponentLayout();
                        me.listTheme.fillComboView(me.listTheme.dataMenu.picker.getSelectedRec(), true);
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
        var replaceLargeBtn = function (id, btn) {
            var placeholderEl = Ext.get(id);
            if (placeholderEl) {
                if (!placeholderEl.down("button")) {
                    placeholderEl.removeCls(["x-btn-default-toolbar-large-icon", "x-btn-default-toolbar-large", "x-btn-disabled", "x-btn-split", "x-btn-split-right", "document-loading"]);
                    var icon = placeholderEl.down("span");
                    icon && icon.remove();
                    btn.addCls("x-btn-default-toolbar-large x-btn-default-toolbar-large-icon ");
                    if (btn.rendered) {
                        placeholderEl.dom.appendChild(document.getElementById(btn.getId()));
                    } else {
                        btn.render(placeholderEl);
                    }
                    btn.removeCls(["x-btn-default-large", "x-btn-default-large-icon"]);
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
        if (mode === "short") {
            replaceBtn("id-toolbar-" + prefix + "-btn-addslide", me.btnAddSlide);
            this.btnAddSlide.removeCls("x-btn-default-large");
            this.btnAddSlide.removeCls("x-btn-default-large-icon");
            this.btnAddSlide.removeCls("x-btn-default-toolbar-large");
            this.btnAddSlide.removeCls("x-btn-default-toolbar-large-icon");
        } else {
            replaceLargeBtn("id-toolbar-" + prefix + "-btn-addslide", me.btnAddSlide);
            this.btnAddSlide.removeCls("x-btn-default-small");
            this.btnAddSlide.removeCls("x-btn-default-small-icon");
            this.btnAddSlide.removeCls("x-btn-default-toolbar-small");
            this.btnAddSlide.removeCls("x-btn-default-toolbar-small-icon");
        }
        replaceBtn("id-toolbar-" + prefix + "-btn-changeslide", me.btnChangeSlide);
        replaceBtn("id-toolbar-" + prefix + "-btn-preview", me.btnPreview);
        replaceBtn("id-toolbar-" + prefix + "-btn-print", me.btnPrint);
        replaceBtn("id-toolbar-" + prefix + "-btn-save", me.btnSave);
        replaceBtn("id-toolbar-" + prefix + "-btn-copy", me.btnCopy);
        replaceBtn("id-toolbar-" + prefix + "-btn-paste", me.btnPaste);
        replaceBtn("id-toolbar-" + prefix + "-btn-undo", me.btnUndo);
        replaceBtn("id-toolbar-" + prefix + "-btn-redo", me.btnRedo);
        replaceBtn("id-toolbar-" + prefix + "-btn-bold", me.btnBold);
        replaceBtn("id-toolbar-" + prefix + "-btn-italic", me.btnItalic);
        replaceBtn("id-toolbar-" + prefix + "-btn-underline", me.btnUnderline);
        replaceBtn("id-toolbar-" + prefix + "-btn-strikeout", me.btnStrikeout);
        replaceBtn("id-toolbar-" + prefix + "-btn-superscript", me.btnSuperscript);
        replaceBtn("id-toolbar-" + prefix + "-btn-subscript", me.btnSubscript);
        replaceBtn("id-toolbar-" + prefix + "-btn-fontcolor", me.btnFontColor);
        replaceBtn("id-toolbar-" + prefix + "-btn-setmarkers", me.btnMarkers);
        replaceBtn("id-toolbar-" + prefix + "-btn-numbering", me.btnNumbers);
        replaceBtn("id-toolbar-" + prefix + "-btn-halign", me.btnHorizontalAlign);
        replaceBtn("id-toolbar-" + prefix + "-btn-vertalign", me.btnVerticalAlign);
        replaceBtn("id-toolbar-" + prefix + "-btn-arrange-shape", me.btnShapeArrange);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-shape", me.btnShapeAlign);
        replaceBtn("id-toolbar-" + prefix + "-btn-decoffset", me.btnDecLeftOffset);
        replaceBtn("id-toolbar-" + prefix + "-btn-incoffset", me.btnIncLeftOffset);
        replaceBtn("id-toolbar-" + prefix + "-btn-linespace", me.btnLineSpace);
        replaceBtn("id-toolbar-" + prefix + "-btn-inserttable", me.btnInsertTable);
        replaceBtn("id-toolbar-" + prefix + "-btn-insertimage", me.btnInsertImage);
        replaceBtn("id-toolbar-" + prefix + "-btn-text", me.btnInsertText);
        replaceBtn("id-toolbar-" + prefix + "-btn-inserthyperlink", me.btnInsertHyperlink);
        replaceBtn("id-toolbar-" + prefix + "-btn-insertshape", me.btnInsertShape);
        replaceBtn("id-toolbar-" + prefix + "-btn-clearstyle", me.btnClearStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-copystyle", me.btnCopyStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-colorschemas", me.btnColorSchemas);
        replaceBtn("id-toolbar-" + prefix + "-btn-slidesize", me.btnSlideSize);
        replaceBtn("id-toolbar-" + prefix + "-btn-hidebars", me.btnHide);
        replaceBtn("id-toolbar-" + prefix + "-btn-settings", me.btnAdvSettings);
        replaceField("id-toolbar-" + prefix + "-field-fontname", me.cmbFont);
        replaceField("id-toolbar-" + prefix + "-field-fontsize", me.cmbFontSize);
        replaceField("id-toolbar-" + prefix + "-field-styles", me.listTheme);
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
                window.localStorage.setItem("pe-hide-synch", 1);
            },
            this);
            newsynch.addListener("closeclick", function () {
                this.synchTooltip.hide();
                this.btnSave.setTooltip(this.tipSynchronize + " (Ctrl+S)");
            },
            this);
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
    createDelayedElements: function () {
        var btns_arr = [],
        me = this;
        var isCompactView = (window.localStorage.getItem("pe-compact-toolbar") && parseInt(window.localStorage.getItem("pe-compact-toolbar")) == 1) || false;
        me.rendererComponents(isCompactView ? "short" : "full");
        var dataTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" style="{imgstyle}" />', '<tpl if="title">', '<span class="title">{title}</span>', "</tpl>", "</div>", "</tpl>");
        var viewData = [{
            offsety: 0,
            data: {
                type: 0,
                subtype: -1
            }
        },
        {
            offsety: 38,
            data: {
                type: 0,
                subtype: 1
            }
        },
        {
            offsety: 76,
            data: {
                type: 0,
                subtype: 2
            }
        },
        {
            offsety: 114,
            data: {
                type: 0,
                subtype: 3
            }
        },
        {
            offsety: 152,
            data: {
                type: 0,
                subtype: 4
            }
        },
        {
            offsety: 190,
            data: {
                type: 0,
                subtype: 5
            }
        },
        {
            offsety: 228,
            data: {
                type: 0,
                subtype: 6
            }
        },
        {
            offsety: 266,
            data: {
                type: 0,
                subtype: 7
            }
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-image:url({0});", "resources/img/toolbar/bullets.png");
            viewData[i].imgstyle += Ext.String.format("background-image:-webkit-image-set(url({0}) 1x, url({1}) 2x);", "resources/img/toolbar/bullets.png", "resources/img/toolbar/bullets@2x.png");
            viewData[i].imgstyle += Ext.String.format("background-position:0 {0}px; width:38px; height:38px;", -viewData[i].offsety);
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
            }
        },
        {
            offsety: 296,
            data: {
                type: 1,
                subtype: 4
            }
        },
        {
            offsety: 370,
            data: {
                type: 1,
                subtype: 5
            }
        },
        {
            offsety: 444,
            data: {
                type: 1,
                subtype: 6
            }
        },
        {
            offsety: 74,
            data: {
                type: 1,
                subtype: 1
            }
        },
        {
            offsety: 148,
            data: {
                type: 1,
                subtype: 2
            }
        },
        {
            offsety: 222,
            data: {
                type: 1,
                subtype: 3
            }
        },
        {
            offsety: 518,
            data: {
                type: 1,
                subtype: 7
            }
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-image:url({0});", "resources/img/toolbar/numbering.png");
            viewData[i].imgstyle += Ext.String.format("background-image:-webkit-image-set(url({0}) 1x, url({1}) 2x);", "resources/img/toolbar/numbering.png", "resources/img/toolbar/numbering@2x.png");
            viewData[i].imgstyle += Ext.String.format("background-position:0 {0}px; width:74px; height:74px;", -viewData[i].offsety);
        }
        this.btnNumbers.menu = Ext.create("Common.component.MenuDataViewPicker", {
            width: 336,
            height: 180,
            contentWidth: 316,
            dataTpl: dataTpl,
            viewData: viewData
        });
        btns_arr.push(this.btnNumbers);
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
        this.btnColorSchemas.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            id: "toolbar-menu-color-schemas",
            items: []
        });
        btns_arr.push(this.btnColorSchemas);
        var slideTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="main-thumb">', '<div class="thumb-wrap">', '<img src="{imageUrl}" />', "</div>", '<tpl if="title">', '<div class="caption"', '<tpl if="itemWidth">', ' style="width:' + "{itemWidth}" + 'px;"', "</tpl>", "><span>{title}</span></div>", "</tpl>", "</div>", "</tpl>");
        var slidestore = Ext.getStore("SlideLayouts");
        slidestore.on("datachanged", me._onSlideStoreDataChanged, me);
        this.btnAddSlide.menu = Ext.create("Common.component.MenuDataViewPicker", {
            width: 421,
            height: 320,
            dataTpl: slideTpl,
            cls: "slide-picker",
            store: slidestore,
            viewData: [],
            contentWidth: 401,
            arrangeItems: me._arrangeSlideItems,
            resizeSlideItems: me._resizeSlideItems,
            listeners: {
                select: Ext.bind(function (picker, record) {
                    if (this.api) {
                        this.api.AddSlide(record.data.data.idx);
                        this.fireEvent("editcomplete", this);
                        Common.component.Analytics.trackEvent("ToolBar", "Add Slide");
                    }
                },
                this),
                hide: function () {
                    me.fireEvent("editcomplete", me);
                },
                show: function (cmp) {
                    cmp.picker.selectByIndex(-1, false);
                },
                beforeshow: Ext.bind(function (cnt) {
                    if (cnt.rendered) {
                        var w_old = cnt.picker.contentWidth;
                        var rec = (cnt.picker.store.getCount() > 0) ? cnt.picker.store.getAt(0) : null;
                        if (rec) {
                            var w = rec.data.itemWidth * 3 + 64;
                            if (w_old !== (w - 20)) {
                                cnt.picker.itemHeight = rec.data.itemHeight;
                                cnt.picker.contentWidth = w - 20;
                                cnt.setWidth(w);
                            }
                        }
                    }
                },
                me)
            }
        });
        btns_arr.push(this.btnAddSlide);
        this.btnChangeSlide.menu = Ext.create("Common.component.MenuDataViewPicker", {
            width: 421,
            height: 320,
            dataTpl: slideTpl,
            cls: "slide-picker",
            store: slidestore,
            viewData: [],
            contentWidth: 401,
            arrangeItems: me._arrangeSlideItems,
            resizeSlideItems: me._resizeSlideItems,
            listeners: {
                select: Ext.bind(function (picker, record) {
                    if (this.api) {
                        this.api.ChangeLayout(record.data.data.idx);
                        this.fireEvent("editcomplete", this);
                        Common.component.Analytics.trackEvent("ToolBar", "Change Layout");
                    }
                },
                this),
                hide: function () {
                    me.fireEvent("editcomplete", me);
                },
                show: function (cmp) {
                    cmp.picker.selectByIndex(-1, false);
                },
                beforeshow: Ext.bind(function (cnt) {
                    if (cnt.rendered) {
                        var w_old = cnt.picker.contentWidth;
                        var rec = (cnt.picker.store.getCount() > 0) ? cnt.picker.store.getAt(0) : null;
                        if (rec) {
                            var w = rec.data.itemWidth * 3 + 64;
                            if (w_old !== (w - 20)) {
                                cnt.picker.itemHeight = rec.data.itemHeight;
                                cnt.picker.contentWidth = w - 20;
                                cnt.setWidth(w);
                            }
                        }
                    }
                },
                me)
            }
        });
        btns_arr.push(this.btnChangeSlide);
        var value = window.localStorage.getItem("pe-compact-toolbar");
        var valueCompact = (value !== null && parseInt(value) == 1);
        value = window.localStorage.getItem("pe-hidden-title");
        var valueTitle = (value !== null && parseInt(value) == 1);
        value = window.localStorage.getItem("pe-hidden-status");
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
                    window.localStorage.setItem("pe-hidden-title", checked ? 1 : 0);
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
                    window.localStorage.setItem("pe-hidden-status", checked ? 1 : 0);
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
        if (this.api) {
            this.api.asc_registerCallback("asc_onTextColor", Ext.bind(this._onTextColor, this));
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
    tipFontName: "Font Name",
    tipFontSize: "Font Size",
    tipCopy: "Copy",
    tipPaste: "Paste",
    tipUndo: "Undo",
    tipRedo: "Redo",
    tipPrint: "Print",
    tipSave: "Save",
    tipFontColor: "Font color",
    tipMarkers: "Bullets",
    tipNumbers: "Numbering",
    tipBack: "Back",
    tipClearStyle: "Clear Style",
    tipCopyStyle: "Copy Style",
    textTitleError: "Error",
    tipHAligh: "Horizontal Align",
    tipVAligh: "Vertical Align",
    textAlignTop: "Align text to the top",
    textAlignMiddle: "Align text to the middle",
    textAlignBottom: "Align text to the bottom",
    textAlignLeft: "Left align text",
    textAlignRight: "Right align text",
    textAlignCenter: "Center text",
    textAlignJust: "Justify",
    tipDecPrLeft: "Decrease Indent",
    tipIncPrLeft: "Increase Indent",
    tipLineSpace: "Line Spacing",
    tipInsertTable: "Insert Table",
    tipInsertImage: "Insert Picture",
    mniImageFromFile: "Picture from file",
    mniImageFromUrl: "Picture from url",
    mniCustomTable: "Insert Custom Table",
    tipInsertHyperlink: "Add Hyperlink",
    tipInsertText: "Insert Text",
    tipInsertShape: "Insert Autoshape",
    tipPreview: "Start Preview",
    tipAddSlide: "Add Slide",
    tipNewDocument: "New Document",
    tipOpenDocument: "Open Document",
    tipShapeAlign: "Align Shape",
    tipShapeArrange: "Arrange Shape",
    textShapeAlignLeft: "Align Left",
    textShapeAlignRight: "Align Right",
    textShapeAlignCenter: "Align Center",
    textShapeAlignTop: "Align Top",
    textShapeAlignBottom: "Align Bottom",
    textShapeAlignMiddle: "Align Middle",
    textArrangeFront: "Bring To Front",
    textArrangeBack: "Send To Back",
    textArrangeForward: "Bring Forward",
    textArrangeBackward: "Send Backward",
    txtGroup: "Group",
    txtUngroup: "Ungroup",
    txtDistribHor: "Distribute Horizontally",
    txtDistribVert: "Distribute Vertically",
    tipChangeSlide: "Change Slide Layout",
    textOK: "OK",
    textCancel: "Cancel",
    tipColorSchemas: "Change Color Scheme",
    textNewColor: "Add New Custom Color",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    mniSlideStandard: "Standard (4:3)",
    mniSlideWide: "Widescreen (16:9)",
    mniSlideAdvanced: "Advanced Settings",
    tipSlideSize: "Select Slide Size",
    tipViewSettings: "View Settings",
    tipAdvSettings: "Advanced Settings",
    textCompactView: "View Compact Toolbar",
    textHideTitleBar: "Hide Title Bar",
    textHideStatusBar: "Hide Status Bar",
    textFitPage: "Fit Slide",
    textFitWidth: "Fit Width",
    textZoom: "Zoom",
    tipInsertChart: "Insert Chart",
    textLine: "Line Chart",
    textColumn: "Column Chart",
    textBar: "Bar Chart",
    textArea: "Area Chart",
    textPie: "Pie Chart",
    textPoint: "Point Chart",
    textStock: "Stock Chart",
    tipSynchronize: "The document has been changed by another user. Please click to save your changes and reload the updates."
});