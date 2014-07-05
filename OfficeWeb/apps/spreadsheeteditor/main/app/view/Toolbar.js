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
 Ext.define("SSE.view.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    alias: "widget.ssetoolbar",
    cls: "sse-toolbar",
    layout: {
        type: "hbox",
        align: "top"
    },
    height: 70,
    minWidth: 1175,
    requires: ["Ext.data.Store", "Common.plugin.ComboBoxScrollPane", "Common.component.SplitColorButton", "Common.component.ThemeColorPalette", "Common.component.ComboDataView", "Ext.window.MessageBox", "Ext.Array", "Ext.Button", "Ext.XTemplate", "Common.plugin.MenuExpand"],
    uses: ["SSE.view.FormulaDialog", "Common.component.SynchronizeTip", "Common.component.MenuDataViewPicker"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.addEvents("editcomplete");
        var me = this;
        this.synchTooltip = undefined;
        var hidetip = window.localStorage.getItem("sse-hide-synch");
        this.showSynchTip = !(hidetip && parseInt(hidetip) == 1);
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        this.SchemeNames = [this.txtScheme1, this.txtScheme2, this.txtScheme3, this.txtScheme4, this.txtScheme5, this.txtScheme6, this.txtScheme7, this.txtScheme8, this.txtScheme9, this.txtScheme10, this.txtScheme11, this.txtScheme12, this.txtScheme13, this.txtScheme14, this.txtScheme15, this.txtScheme16, this.txtScheme17, this.txtScheme18, this.txtScheme19, this.txtScheme20, this.txtScheme21];
        this.ascFormatOptions = {
            General: "General",
            Number: "0.00",
            Currency: "$#,##0.00",
            Accounting: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
            DateShort: "m/d/yyyy",
            DateLong: "[$-F800]dddd, mmmm dd, yyyy",
            Time: "[$-F400]h:mm:ss AM/PM",
            Percentage: "0%",
            Fraction: "# ?/?",
            Scientific : "0.00E+00",
            Text : "@"
        };
        this.numFormatTypes = {};
        this.numFormatTypes[c_oAscNumFormatType.General] = this.txtGeneral;
        this.numFormatTypes[c_oAscNumFormatType.Custom] = "Custom";
        this.numFormatTypes[c_oAscNumFormatType.Text] = this.txtText;
        this.numFormatTypes[c_oAscNumFormatType.Number] = this.txtNumber;
        this.numFormatTypes[c_oAscNumFormatType.Integer] = this.txtInteger;
        this.numFormatTypes[c_oAscNumFormatType.Scientific] = this.txtScientific;
        this.numFormatTypes[c_oAscNumFormatType.Currency] = this.txtCurrency;
        this.numFormatTypes[c_oAscNumFormatType.Date] = this.txtDate;
        this.numFormatTypes[c_oAscNumFormatType.Time] = this.txtTime;
        this.numFormatTypes[c_oAscNumFormatType.Percent] = this.txtPercentage;
        this.numFormatTypes[c_oAscNumFormatType.Fraction] = "Fraction";
        this.cmbFont = Ext.create("Common.view.ComboFonts", {
            id: "toolbar-combo-fonts",
            width: 128,
            editable: true,
            tooltip: this.tipFontName,
            enableKeyEvents: true,
            showlastused: true,
            plugins: [{
                ptype: "comboboxscrollpane",
                pluginId: "scrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        Ext.define("SSE.view.FontSize", {
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
            model: "SSE.view.FontSize",
            data: []
        });
        this.cmbFontSize = Ext.create("Ext.form.field.ComboBox", {
            id: "toolbar-combo-font-size",
            store: storesize,
            displayField: "sizestring",
            queryMode: "local",
            typeAhead: false,
            selectOnFocus: true,
            width: 50,
            listConfig: {
                maxHeight: 400
            }
        });
        this.btnBold = Ext.create("Ext.Button", {
            tooltip: this.textBold + " (Ctrl+B)",
            iconCls: "asc-toolbar-btn btn-bold",
            enableToggle: true,
            group: "simple-toggle",
            action: "Bold"
        });
        this.btnItalic = Ext.create("Ext.Button", {
            tooltip: this.textItalic + " (Ctrl+I)",
            iconCls: "asc-toolbar-btn btn-italic",
            enableToggle: true,
            group: "simple-toggle",
            action: "Italic"
        });
        this.btnUnderline = Ext.create("Ext.Button", {
            tooltip: this.textUnderline + " (Ctrl+U)",
            iconCls: "asc-toolbar-btn btn-underline",
            enableToggle: true,
            group: "simple-toggle",
            action: "Underline"
        });
        this.btnPrint = Ext.create("Ext.button.Split", {
            tooltip: this.tipPrint + " (Ctrl+P)",
            iconCls: "asc-toolbar-btn btn-print",
            action: "Print",
            group: "simple-click"
        });
        this.btnSave = Ext.create("Ext.Button", {
            tooltip: this.tipSave + " (Ctrl+S)",
            iconCls: "asc-toolbar-btn btn-save",
            group: "simple-click",
            action: "Save"
        });
        this.btnCopy = Ext.create("Ext.Button", {
            tooltip: this.tipCopy,
            iconCls: "asc-toolbar-btn btn-copy",
            group: "copy-paste",
            action: "copy"
        });
        this.btnPaste = Ext.create("Ext.Button", {
            tooltip: this.tipPaste,
            iconCls: "asc-toolbar-btn btn-paste",
            group: "copy-paste",
            action: "paste"
        });
        this.btnUndo = Ext.create("Ext.Button", {
            tooltip: this.tipUndo + " (Ctrl+Z)",
            iconCls: "asc-toolbar-btn btn-undo",
            disabled: true,
            group: "simple-click",
            action: "Undo"
        });
        this.btnRedo = Ext.create("Ext.Button", {
            tooltip: this.tipRedo + " (Ctrl+Y)",
            iconCls: "asc-toolbar-btn btn-redo",
            disabled: true,
            group: "simple-click",
            action: "Redo"
        });
        this.btnFontColor = Ext.widget("cmdsplitcolorbutton", {
            id: "toolbar-button-font-color",
            iconCls: "asc-toolbar-btn btn-fontcolor",
            tooltip: this.tipFontColor,
            color: "ff0000",
            horizontalOffset: 3,
            verticalOffset: 2,
            listeners: {
                click: function (btn) {
                    me.colorsText.fireEvent("select", me.colorsText, me.colorsText.currentColor);
                }
            }
        });
        this.btnHorizontalAlign = Ext.create("Ext.button.Button", {
            id: "toolbar-button-halign",
            tooltip: this.tipHAligh,
            iconCls: "asc-toolbar-btn btn-halign",
            cls: "halign-left",
            icls: "halign-left",
            split: true
        });
        this.btnVerticalAlign = Ext.create("Ext.button.Button", {
            id: "toolbar-button-valign",
            tooltip: this.tipVAligh,
            iconCls: "asc-toolbar-btn btn-vertalign",
            cls: "valign-bottom",
            icls: "valign-bottom",
            split: true
        });
        this.btnWrap = Ext.create("Ext.Button", {
            tooltip: this.tipWrap,
            iconCls: "asc-toolbar-btn btn-wrap",
            enableToggle: true,
            group: "simple-toggle",
            action: "Wrap"
        });
        this.btnParagraphColor = Ext.widget("cmdsplitcolorbutton", {
            id: "toolbar-button-paragraph-color",
            iconCls: "asc-toolbar-btn btn-fillparag",
            tooltip: this.tipPrColor,
            horizontalOffset: 3,
            verticalOffset: 2,
            color: "ffff00",
            listeners: {
                changecolor: function (btn, color) {
                    me.fireEvent("editcomplete", me);
                },
                click: function (btn) {
                    me.colorsBack.fireEvent("select", me.colorsBack, me.colorsBack.currentColor);
                }
            }
        });
        this.btnClearStyle = Ext.create("Ext.button.Button", {
            id: "toolbar-button-clear",
            tooltip: this.tipClearStyle,
            iconCls: "asc-toolbar-btn btn-clearstyle",
            split: true
        });
        this.btnMerge = Ext.create("Ext.button.Split", {
            id: "toolbar-button-merge",
            tooltip: this.tipMerge,
            iconCls: "asc-toolbar-btn btn-merge",
            enableToggle: true,
            handler: function (btn) {
                btn.menu.fireEvent("click", btn.menu, btn.menu.items.items[0]);
            }
        });
        this.btnInsertFormula = Ext.create("Ext.button.Split", {
            id: "toolbar-button-insertformula",
            tooltip: this.txtFormula,
            iconCls: "asc-toolbar-btn btn-formula"
        });
        this.btnDecDecimal = Ext.create("Ext.button.Button", {
            tooltip: this.tipDecDecimal,
            iconCls: "asc-toolbar-btn btn-decdecimal",
            group: "simple-click",
            action: "Decrement"
        });
        this.btnIncDecimal = Ext.create("Ext.button.Button", {
            tooltip: this.tipIncDecimal,
            iconCls: "asc-toolbar-btn btn-incdecimal",
            group: "simple-click",
            action: "Increment"
        });
        this.btnNumberFormat = Ext.create("Ext.button.Button", {
            id: "toolbar-button-num-format",
            tooltip: this.tipNumFormat,
            text: this.txtGeneral,
            width: 100,
            style: "border-color:#B9B9B9;",
            split: true
        });
        this.btnBorders = Ext.create("Ext.button.Split", {
            id: "toolbar-button-borders",
            tooltip: this.tipBorders,
            iconCls: "asc-toolbar-btn btn-borders",
            icls: "borders-noborders",
            cls: "borders-noborders",
            borderswidth: "thin"
        });
        this.btnInsertImage = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-image",
            tooltip: this.tipInsertImage,
            iconCls: "asc-toolbar-btn btn-insertimage",
            split: true
        });
        this.btnInsertHyperlink = Ext.create("Ext.button.Button", {
            id: "toolbar-button-insert-hyperlink",
            tooltip: this.tipInsertHyperlink + " (Ctrl+K)",
            iconCls: "asc-toolbar-btn btn-inserthyperlink"
        });
        this.btnAutofilter = Ext.create("Ext.button.Button", {
            tooltip: this.tipAutofilter,
            iconCls: "asc-toolbar-btn btn-autofilter",
            split: true
        });
        this.btnColorSchemas = Ext.create("Ext.button.Button", {
            id: "toolbar-button-color-schemas",
            tooltip: this.tipColorSchemas,
            iconCls: "asc-toolbar-btn btn-colorschemas",
            menu: {
                showSeparator: false,
                id: "toolbar-menu-color-schemas",
                items: []
            }
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
        this.btnInsertText = Ext.create("Ext.Button", {
            id: "toolbar-button-inserttext",
            tooltip: this.tipInsertText,
            iconCls: "asc-toolbar-btn btn-inserttext",
            enableToggle: true
        });
        this.btnInsertShape = Ext.create("Ext.Button", {
            id: "toolbar-button-insertshape",
            tooltip: this.tipInsertShape,
            iconCls: "asc-toolbar-btn btn-insertshape",
            enableToggle: true,
            menu: {
                showSeparator: false,
                id: "toolbar-menu-insertshape",
                items: [],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        this.btnIncFontSize = Ext.create("Ext.Button", {
            tooltip: this.tipIncFont,
            iconCls: "asc-toolbar-btn btn-incfont",
            group: "font-size",
            action: "inc"
        });
        this.btnDecFontSize = Ext.create("Ext.Button", {
            tooltip: this.tipDecFont,
            iconCls: "asc-toolbar-btn btn-decfont",
            group: "font-size",
            action: "dec"
        });
        this.btnPercentStyle = Ext.create("Ext.Button", {
            tooltip: this.tipDigStylePercent,
            iconCls: "asc-toolbar-btn btn-percent-style",
            action: "number-format",
            formatId: this.ascFormatOptions.Percentage
        });
        this.btnCurrencyStyle = Ext.create("Ext.Button", {
            tooltip: this.tipDigStyleCurrency,
            iconCls: "asc-toolbar-btn btn-currency-style",
            action: "number-format",
            formatId: this.ascFormatOptions.Currency
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
        this.btnShowMode = Ext.create("Ext.Button", {
            tooltip: this.tipViewSettings,
            iconCls: "asc-toolbar-btn btn-showmode",
            menu: {}
        });
        this.btnSettings = Ext.create("Ext.Button", {
            id: "toolbar-button-settings",
            tooltip: this.tipAdvSettings,
            iconCls: "asc-toolbar-btn btn-settings"
        });
        this.btnTextOrient = Ext.create("Ext.Button", {
            tooltip: this.tipTextOrientation,
            iconCls: "asc-toolbar-btn btn-textorient",
            menu: {}
        });
        this.btnAddCell = Ext.create("Ext.Button", {
            tooltip: this.tipInsertOpt,
            iconCls: "asc-toolbar-btn btn-addcell",
            menu: {}
        });
        this.btnDeleteCell = Ext.create("Ext.Button", {
            tooltip: this.tipDeleteOpt,
            iconCls: "asc-toolbar-btn btn-delcell",
            menu: {}
        });
        this.btnAlignLeft = Ext.create("Ext.Button", {
            tooltip: this.tipAlignLeft,
            enableToggle: true,
            toggleGroup: "alignGroup",
            allowDepress: false,
            iconCls: "asc-toolbar-btn btn-halign",
            cls: "halign-left"
        });
        this.btnAlignCenter = Ext.create("Ext.Button", {
            tooltip: this.tipAlignCenter,
            enableToggle: true,
            toggleGroup: "alignGroup",
            iconCls: "asc-toolbar-btn btn-halign",
            cls: "halign-center"
        });
        this.btnAlignRight = Ext.create("Ext.Button", {
            tooltip: this.tipAlignRight,
            enableToggle: true,
            toggleGroup: "alignGroup",
            iconCls: "asc-toolbar-btn btn-halign",
            cls: "halign-right"
        });
        this.btnAlignJust = Ext.create("Ext.button.Button", {
            tooltip: this.tipAlignJust,
            enableToggle: true,
            toggleGroup: "alignGroup",
            iconCls: "asc-toolbar-btn btn-halign",
            cls: "halign-just"
        });
        this.btnAlignTop = Ext.create("Ext.button.Button", {
            tooltip: this.tipAlignTop,
            enableToggle: true,
            toggleGroup: "vAlignGroup",
            iconCls: "asc-toolbar-btn btn-vertalign",
            cls: "valign-top"
        });
        this.btnAlignMiddle = Ext.create("Ext.button.Button", {
            tooltip: this.tipAlignMiddle,
            enableToggle: true,
            toggleGroup: "vAlignGroup",
            iconCls: "asc-toolbar-btn btn-vertalign",
            cls: "valign-middle"
        });
        this.btnAlignBottom = Ext.create("Ext.button.Button", {
            tooltip: this.tipAlignBottom,
            enableToggle: true,
            toggleGroup: "vAlignGroup",
            allowDepress: false,
            iconCls: "asc-toolbar-btn btn-vertalign",
            cls: "valign-bottom"
        });
        this.btnSortDown = Ext.create("Ext.button.Button", {
            tooltip: this.txtSortAZ,
            group: "sort",
            direction: "ascending",
            iconCls: "asc-toolbar-btn btn-sort-down"
        });
        this.btnSortUp = Ext.create("Ext.button.Button", {
            tooltip: this.txtSortZA,
            group: "sort",
            direction: "descending",
            iconCls: "asc-toolbar-btn btn-sort-up"
        });
        var slideTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="main-thumb">', '<div class="thumb-wrap" style="height:50px;">', '<img src="{imageUrl}" />', "</div>", "</div>", "</tpl>");
        this.btnTableTemplate = Ext.create("Ext.button.Button", {
            tooltip: this.txtTableTemplate,
            iconCls: "asc-toolbar-btn btn-ttempl",
            menu: Ext.create("Common.component.MenuDataViewPicker", {
                action: "table-templates",
                width: 330,
                height: 320,
                dataTpl: slideTpl,
                cls: "table-templates-picker",
                store: Ext.getStore("TableTemplates"),
                viewData: [],
                contentWidth: 310
            })
        });
        this.btnSetAutofilter = Ext.create("Ext.button.Button", {
            tooltip: this.txtFilter,
            iconCls: "asc-toolbar-btn btn-autofilter",
            group: "simple-click",
            action: "Filter"
        });
        this.listStyles = Ext.create("Common.component.ComboDataView", {
            id: "toolbar-combo-viewstyles",
            height: 54,
            flex: 1,
            itemWidth: 80,
            itemHeight: 18,
            menuMaxHeight: 300,
            minWidth: 110,
            repeatedselect: true,
            handleGlobalResize: true,
            viewData: []
        });
        this.coauthControls = [this.cmbFont, this.cmbFontSize, this.btnIncFontSize, this.btnDecFontSize, this.btnBold, this.btnItalic, this.btnUnderline, this.btnHorizontalAlign, this.btnAlignLeft, this.btnAlignCenter, this.btnAlignRight, this.btnAlignJust, this.btnVerticalAlign, this.btnAlignTop, this.btnAlignMiddle, this.btnAlignBottom, this.btnWrap, this.btnTextOrient, this.btnClearStyle, this.btnMerge, this.btnInsertFormula, this.btnIncDecimal, this.btnInsertShape, this.btnInsertText, this.btnSortUp, this.btnSortDown, this.btnSetAutofilter, this.btnTableTemplate, this.btnPercentStyle, this.btnCurrencyStyle, this.btnDecDecimal, this.btnAddCell, this.btnDeleteCell, this.btnNumberFormat, this.btnBorders, this.btnInsertImage, this.btnInsertHyperlink, this.btnColorSchemas, this.btnAutofilter, this.listStyles];
        var btnPlaceholderHtml = function (id, iconCls, style, extraCls) {
            return Ext.String.format('<div class="toolbar-btn-placeholder x-btn-default-toolbar-small-icon x-btn-default-toolbar-small document-loading{3}" id="{0}" style="{2}"><span class="replaceme x-btn-icon asc-toolbar-btn {1}">&nbsp;</span></div>', id, iconCls, style || "", extraCls ? " " + extraCls : "");
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
        this.isCompactView = !!JSON.parse(localStorage.getItem("sse-toolbar-compact"));
        this.setHeight((this.isCompactView) ? 38 : 68);
        this.html = ['<div id="id-toolbar-short" style="' + ((this.isCompactView) ? "display: table;": "display: none;") + 'width: 100%; height: 22px; margin-top: 3px;" >', '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-short-btn-print", "btn-print", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-save", "btn-save"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-short-btn-undo", "btn-undo", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-redo", "btn-redo"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="width: 190px; margin-top: 2px;">', comboBoxHtml("id-toolbar-short-field-fontname", "Calibri", "display: inline; float: left; line-height: 20px; padding: 0; width: 127px; height: 22px; margin-right: 4px;"), comboBoxHtml("id-toolbar-short-field-fontsize", "11", "display: inline; float: left; padding: 0; line-height: 20px; width: 49px; height: 22px; margin-right: 2px;"), "</div>", "</div>", '<div class="toolbar-group" style="padding-left: 0">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-bold", "btn-bold", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-italic", "btn-italic", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-underline", "btn-underline"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group" style="padding-left: 0">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-fontcolor", "btn-fontcolor", "margin: 0 4px 0 7px;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-highlight", "btn-fillparag"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-borders", "btn-borders", "margin:0", "borders-noborders"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("short"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-halign", "btn-halign", "margin: 0 2px 0 0;", "halign-left"), btnSplitPlaceholderHtml("id-toolbar-short-btn-valign", "btn-vertalign", "margin: 0 2px 0 0;", "valign-bottom"), btnSplitPlaceholderHtml("id-toolbar-short-btn-merge", "btn-merge", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-wrap", "btn-wrap"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-insertimage", "btn-insertimage", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-inserthyperlink", "btn-inserthyperlink", "margin: 0 4px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-insertshape", "btn-insertshape", "margin: 0;"), btnPlaceholderHtml("id-toolbar-short-btn-text", "btn-inserttext", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-filter", "btn-autofilter"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnPlaceholderHtml("id-toolbar-short-btn-digit-dec", "btn-decdecimal", "margin: 0 5px 0 0;"), btnPlaceholderHtml("id-toolbar-short-btn-digit-inc", "btn-incdecimal", "margin: 0 5px 0 0;"), '<div id="id-toolbar-short-btn-format" class="toolbar-btn-placeholder x-btn-default-toolbar-small-noicon x-btn-default-toolbar-small document-loading x-btn-split x-btn-split-right" style="width:100px;border-color:#B9B9B9;"><span class="replaceme x-btn-inner" style="text-align:center;padding-right:0;">General</span></div>', "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-formula", "btn-formula", "margin: 0 5px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-clear", "btn-clearstyle"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("short") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-cell-ins", "btn-addcell", "margin: 0 5px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-short-btn-cell-del", "btn-delcell"), "</div>", "</div>", '<div class="toolbar-group" style="width: 100%;"></div>', '<div class="toolbar-group">', '<div class="toolbar-row" style="margin-top: 2px;">', btnSplitPlaceholderHtml("id-toolbar-short-btn-hidebars", "btn-showmode", "margin: 0 4px 0 0;"), "</div>", "</div>", "</div>", '<div id="id-toolbar-full" style="' + ((!this.isCompactView) ? "display: table;": "display: none;") + 'width: 100%; margin-top: 3px;" >', '<div class="toolbar-group" id="id-toolbar-full-group-native">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-newdocument", "btn-newdocument"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-opendocument", "btn-opendocument"), "</div>", "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-print", "btn-print"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-save", "btn-save"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("long") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-copy", "btn-copy", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-paste", "btn-paste"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-undo", "btn-undo", "margin: 0 6px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-redo", "btn-redo"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("long") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row" style="width:230px;">', comboBoxHtml("id-toolbar-full-field-fontname", "Calibri", "display: inline; float: left; line-height: 20px; padding: 0; width: 127px; height: 22px; margin-right: 4px;"), comboBoxHtml("id-toolbar-full-field-fontsize", "11", "display: inline; float: left; padding: 0; line-height: 20px; width: 49px; height: 22px; margin-right: 5px;"), btnPlaceholderHtml("id-toolbar-full-btn-incfont", "btn-incfont"), btnPlaceholderHtml("id-toolbar-full-btn-decfont", "btn-decfont", "margin: 0 0 0 2px;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-bold", "btn-bold", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-italic", "btn-italic", "margin: 0 4px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-underline", "btn-underline", "margin: 0 7px 0 0;"), separatorHtml("short", "position: absolute; margin-top: 2px;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-fontcolor", "btn-fontcolor", "margin: 0 0 0 12px;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-highlight", "btn-fillparag", "margin: 0 12px 0 4px;"), separatorHtml("short", "position: absolute; margin-top: 2px;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-borders", "btn-borders", "margin: 0 0 0 11px;", "borders-noborders"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-align-left", "btn-halign", "margin: 0 5px 0 0;", "halign-left"), btnPlaceholderHtml("id-toolbar-full-btn-align-center", "btn-halign", "margin: 0 5px 0 0;", "halign-center"), btnPlaceholderHtml("id-toolbar-full-btn-align-right", "btn-halign", "margin: 0 5px 0 0;", "halign-right"), btnPlaceholderHtml("id-toolbar-full-btn-align-just", "btn-halign", "margin: 0 5px 0 0;", "halign-just"), btnSplitPlaceholderHtml("id-toolbar-full-btn-merge", "btn-merge"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-align-top", "btn-vertalign", "margin: 0 5px 0 0;", "valign-top"), btnPlaceholderHtml("id-toolbar-full-btn-align-middle", "btn-vertalign", "margin: 0 5px 0 0;", "valign-middle"), btnPlaceholderHtml("id-toolbar-full-btn-align-bottom", "btn-vertalign", "margin: 0 5px 0 0;", "valign-bottom"), btnPlaceholderHtml("id-toolbar-full-btn-wrap", "btn-wrap", "margin: 0 5px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-text-orient", "btn-textorient"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-insertimage", "btn-insertimage", "margin: 0 2px 0 0"), btnPlaceholderHtml("id-toolbar-full-btn-inserthyperlink", "btn-inserthyperlink", "margin: 0 6px 0 0"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-insertshape", "btn-insertshape", "margin: 0 2px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-text", "btn-inserttext", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("long") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-sortdesc", "btn-sort-down", "margin: 0 5px 0 0;", "valign-top"), btnPlaceholderHtml("id-toolbar-full-btn-sortasc", "btn-sort-up", "margin: 0;", "valign-top"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-setfilter", "btn-autofilter", "margin: 0 5px 0 0;"), btnSplitPlaceholderHtml("id-toolbar-full-btn-table-tpl", "btn-ttempl", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', '<div id="id-toolbar-full-btn-format" class="toolbar-btn-placeholder x-btn-default-toolbar-small-noicon x-btn-default-toolbar-small document-loading x-btn-split x-btn-split-right" style="width:100px;border-color:#B9B9B9;"><span class="replaceme x-btn-inner" style="text-align:center;padding-right:0;">General</span></div>', "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-percents", "btn-percent-style", "margin: 0 5px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-currency", "btn-currency-style", "margin: 0 5px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-digit-dec", "btn-decdecimal", "margin: 0 5px 0 0;"), btnPlaceholderHtml("id-toolbar-full-btn-digit-inc", "btn-incdecimal", "margin: 0;"), "</div>", "</div>", '<div class="toolbar-group separator">', separatorHtml("long"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-formula", "btn-formula"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-clear", "btn-clearstyle"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("long") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-cell-ins", "btn-addcell"), "</div>", '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-cell-del", "btn-delcell"), "</div>", "</div>", '<div class="toolbar-group separator">' + separatorHtml("long") + "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-colorschemas", "btn-colorschemas"), "</div>", "</div>", '<div class="toolbar-group" id="id-toolbar-full-group-styles" style="width: 100%;">', comboDataViewHtml("id-toolbar-full-field-styles", "", "height: 54px;"), "</div>", '<div class="toolbar-group">', '<div class="toolbar-row">', btnSplitPlaceholderHtml("id-toolbar-full-btn-hidebars", "btn-showmode", "margin: 0 5px 0 0;"), "</div>", '<div class="toolbar-row">', btnPlaceholderHtml("id-toolbar-full-btn-settings", "btn-settings"), "</div>", "</div>", "</div>"];
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onCollaborativeChanges", Ext.bind(this._onCollaborativeChanges, this));
        this.api.asc_registerCallback("asc_onSendThemeColorSchemes", Ext.bind(this._onSendThemeColorSchemes, this));
        return this;
    },
    parseColor: function (color) {
        var result = /#([0-9,aA-fF]{3,6})|rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})/.exec(color);
        if (result && result.length) {
            result = result[1] || Number(result[2]).toString(16) + Number(result[3]).toString(16) + Number(result[4]).toString(16);
            if (result.length < 6) {
                result = result[0] + result[0] + result[1] + result[1] + result[2] + result[2];
            }
            return result.toUpperCase();
        }
        return undefined;
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
                schemaType: i,
                listeners: {
                    click: Ext.bind(function (item) {
                        if (me.api) {
                            me.api.asc_ChangeColorScheme(item.schemaType);
                            Common.component.Analytics.trackEvent("ToolBar", "Color Scheme");
                        }
                    },
                    this)
                }
            });
            if (i == 21) {
                me.btnColorSchemas.menu.add(Ext.create("Ext.menu.Separator", {}));
            }
            me.btnColorSchemas.menu.add(mnu);
        }
    },
    _onSendThemeColors: function (colors, standart_colors) {
        if (!this.colorsText || !this.colorsBack || !this.colorsBorder) {
            this.themeColors = {
                user: colors,
                standart: standart_colors
            };
            return;
        }
        var standartcolors = [];
        if (standart_colors) {
            for (var i = 0; i < standart_colors.length; i++) {
                var item = this.getHexColor(standart_colors[i].get_r(), standart_colors[i].get_g(), standart_colors[i].get_b());
                standartcolors.push(item);
            }
        }
        var effectcolors = [];
        var clr, clrPara, clrBorder;
        for (i = 0; i < 6; i++) {
            for (var j = 0; j < 10; j++) {
                var idx = i + j * 6;
                item = {
                    color: this.getHexColor(colors[idx].get_r(), colors[idx].get_g(), colors[idx].get_b()),
                    effectId: idx,
                    effectValue: this.ThemeValues[j]
                };
                effectcolors.push(item);
                if (typeof(this.colorsText.currentColor) == "object" && clr === undefined && this.colorsText.currentColor.effectId == idx) {
                    clr = item;
                }
                if (typeof(this.colorsBack.currentColor) == "object" && clrPara === undefined && this.colorsBack.currentColor.effectId == idx) {
                    clrPara = item;
                }
                if (typeof(this.colorsBorder.currentColor) == "object" && clrBorder === undefined && this.colorsBorder.currentColor.effectId == idx) {
                    clrBorder = item;
                }
            }
        }
        this.colorsText.updateColors(effectcolors, standartcolors);
        this.colorsBack.updateColors(effectcolors, standartcolors);
        this.colorsBorder.updateColors(effectcolors, standartcolors);
        if (this.colorsText.currentColor === undefined) {
            this.btnFontColor.setColor(standartcolors[1], false);
            this.colorsText.currentColor = standartcolors[1];
        } else {
            if (clr !== undefined) {
                this.btnFontColor.setColor(clr.color, false);
                this.colorsText.currentColor = clr;
            }
        }
        if (this.colorsBack.currentColor === undefined) {
            this.btnParagraphColor.setColor(standartcolors[3], false);
            this.colorsBack.currentColor = standartcolors[3];
        } else {
            if (clrPara !== undefined) {
                this.btnParagraphColor.setColor(clrPara.color, false);
                this.colorsBack.currentColor = clrPara;
            }
        }
        if (this.colorsBorder.currentColor === undefined) {
            this.colorsBorder.fireEvent("select", this.colorsBorder, effectcolors[1]);
        } else {
            if (clrBorder !== undefined) {
                this.colorsBorder.fireEvent("select", this.colorsBorder, clrBorder);
            }
        }
    },
    setMode: function (mode) {
        if (mode.isDisconnected) {
            this.btnOpenDocument.setDisabled(true);
            this.btnNewDocument.setDisabled(true);
            this.btnSave.setDisabled(true);
            this.btnPaste.setDisabled(true);
            this.btnUndo.setDisabled(true);
            this.btnRedo.setDisabled(true);
            this.cmbFont.setDisabled(true);
            this.cmbFontSize.setDisabled(true);
            this.btnIncFontSize.setDisabled(true);
            this.btnDecFontSize.setDisabled(true);
            this.btnBold.setDisabled(true);
            this.btnItalic.setDisabled(true);
            this.btnUnderline.setDisabled(true);
            this.btnFontColor.setDisabled(true);
            this.btnParagraphColor.setDisabled(true);
            this.btnBorders.setDisabled(true);
            this.btnHorizontalAlign.setDisabled(true);
            this.btnAlignLeft.setDisabled(true);
            this.btnAlignCenter.setDisabled(true);
            this.btnAlignRight.setDisabled(true);
            this.btnAlignJust.setDisabled(true);
            this.btnAlignTop.setDisabled(true);
            this.btnAlignMiddle.setDisabled(true);
            this.btnAlignBottom.setDisabled(true);
            this.btnMerge.setDisabled(true);
            this.btnWrap.setDisabled(true);
            this.btnTextOrient.setDisabled(true);
            this.btnInsertImage.setDisabled(true);
            this.btnInsertHyperlink.setDisabled(true);
            this.btnInsertShape.setDisabled(true);
            this.btnInsertText.setDisabled(true);
            this.btnSortDown.setDisabled(true);
            this.btnSortUp.setDisabled(true);
            this.btnSetAutofilter.setDisabled(true);
            this.btnTableTemplate.setDisabled(true);
            this.btnAutofilter.setDisabled(true);
            this.btnNumberFormat.setDisabled(true);
            this.btnPercentStyle.setDisabled(true);
            this.btnCurrencyStyle.setDisabled(true);
            this.btnIncDecimal.setDisabled(true);
            this.btnDecDecimal.setDisabled(true);
            this.btnInsertFormula.setDisabled(true);
            this.btnClearStyle.setDisabled(true);
            this.btnAddCell.setDisabled(true);
            this.btnDeleteCell.setDisabled(true);
            this.btnColorSchemas.setDisabled(true);
            this.listStyles.setDisabled(true);
        } else {
            this.mode = mode;
            if (!mode.nativeApp) {
                var nativeBtnGroup = Ext.get("id-toolbar-full-group-native");
                if (nativeBtnGroup) {
                    nativeBtnGroup.setVisibilityMode(Ext.Element.DISPLAY);
                    nativeBtnGroup.hide();
                }
            }
        }
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
                window.localStorage.setItem("sse-hide-synch", 1);
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
    rendererComponents: function (mode) {
        var me = this;
        var replaceBtn = function (id, btn, textbtn) {
            var placeholderEl = Ext.get(id);
            if (placeholderEl) {
                if (!placeholderEl.down("button")) {
                    placeholderEl.removeCls(["x-btn-default-toolbar-small-icon", "x-btn-default-toolbar-small-noicon", "x-btn-default-toolbar-small", "x-btn-disabled", "x-btn-split", "x-btn-split-right", "document-loading", "valign-bottom"]);
                    var icon = placeholderEl.down("span");
                    icon && icon.remove();
                    btn.addCls("x-btn-default-toolbar-small x-btn-default-toolbar-small-" + (textbtn ? "noicon " : "icon "));
                    btn.rendered ? placeholderEl.dom.appendChild(document.getElementById(btn.getId())) : btn.render(placeholderEl);
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
                    field.rendered ? placeholderEl.dom.appendChild(document.getElementById(field.getId())) : field.render(placeholderEl);
                }
            }
        };
        var prefix = "full";
        switch (mode) {
        case "short":
            prefix = "short";
            break;
        }
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
        replaceBtn("id-toolbar-" + prefix + "-btn-fontcolor", me.btnFontColor);
        replaceBtn("id-toolbar-" + prefix + "-btn-highlight", me.btnParagraphColor);
        replaceBtn("id-toolbar-" + prefix + "-btn-borders", me.btnBorders);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-left", me.btnAlignLeft);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-center", me.btnAlignCenter);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-right", me.btnAlignRight);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-just", me.btnAlignJust);
        replaceBtn("id-toolbar-" + prefix + "-btn-halign", me.btnHorizontalAlign);
        replaceBtn("id-toolbar-" + prefix + "-btn-merge", me.btnMerge);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-top", me.btnAlignTop);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-middle", me.btnAlignMiddle);
        replaceBtn("id-toolbar-" + prefix + "-btn-align-bottom", me.btnAlignBottom);
        replaceBtn("id-toolbar-" + prefix + "-btn-valign", me.btnVerticalAlign);
        replaceBtn("id-toolbar-" + prefix + "-btn-wrap", me.btnWrap);
        replaceBtn("id-toolbar-" + prefix + "-btn-text-orient", me.btnTextOrient);
        replaceBtn("id-toolbar-" + prefix + "-btn-insertimage", me.btnInsertImage);
        replaceBtn("id-toolbar-" + prefix + "-btn-inserthyperlink", me.btnInsertHyperlink);
        replaceBtn("id-toolbar-" + prefix + "-btn-insertshape", me.btnInsertShape);
        replaceBtn("id-toolbar-" + prefix + "-btn-text", me.btnInsertText);
        replaceBtn("id-toolbar-" + prefix + "-btn-sortdesc", me.btnSortDown);
        replaceBtn("id-toolbar-" + prefix + "-btn-sortasc", me.btnSortUp);
        replaceBtn("id-toolbar-" + prefix + "-btn-setfilter", me.btnSetAutofilter);
        replaceBtn("id-toolbar-" + prefix + "-btn-filter", me.btnAutofilter);
        replaceBtn("id-toolbar-" + prefix + "-btn-table-tpl", me.btnTableTemplate);
        replaceBtn("id-toolbar-" + prefix + "-btn-format", me.btnNumberFormat, true);
        replaceBtn("id-toolbar-" + prefix + "-btn-percents", me.btnPercentStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-currency", me.btnCurrencyStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-digit-dec", me.btnDecDecimal);
        replaceBtn("id-toolbar-" + prefix + "-btn-digit-inc", me.btnIncDecimal);
        replaceBtn("id-toolbar-" + prefix + "-btn-formula", me.btnInsertFormula);
        replaceBtn("id-toolbar-" + prefix + "-btn-clear", me.btnClearStyle);
        replaceBtn("id-toolbar-" + prefix + "-btn-cell-ins", me.btnAddCell);
        replaceBtn("id-toolbar-" + prefix + "-btn-cell-del", me.btnDeleteCell);
        replaceBtn("id-toolbar-" + prefix + "-btn-colorschemas", me.btnColorSchemas);
        replaceBtn("id-toolbar-" + prefix + "-btn-settings", me.btnSettings);
        replaceBtn("id-toolbar-" + prefix + "-btn-hidebars", me.btnShowMode);
        replaceField("id-toolbar-" + prefix + "-field-fontname", me.cmbFont);
        replaceField("id-toolbar-" + prefix + "-field-fontsize", me.cmbFontSize);
        replaceField("id-toolbar-" + prefix + "-field-styles", me.listStyles);
    },
    createDelayedElements: function () {
        var btns_arr = [],
        me = this;
        me.rendererComponents(this.isCompactView ? "short" : "full");
        this.btnPrint.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            items: [{
                text: me.textPrint,
                id: "toolbar-menuitem-print",
                cls: "menu-item-noicon"
            },
            {
                text: me.textPrintOptions,
                id: "toolbar-menuitem-print-options",
                cls: "menu-item-noicon"
            }]
        });
        btns_arr.push(this.btnPrint);
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
                        fn: function (picker, color, eOpts, id) {
                            me.btnFontColor.setColor(typeof(color) == "object" ? color.color : color);
                            Ext.menu.Manager.hideAll();
                            me.colorsText.currentColor = color;
                            if (me.api) {
                                me.btnFontColor.ischanged = true;
                                me.api.asc_setCellTextColor(me.getRgbColor(color));
                                me.btnFontColor.ischanged = false;
                            }
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
                    me.fireEvent("editcomplete", me, {
                        checkorder: true
                    });
                }
            }
        });
        btns_arr.push(this.btnFontColor);
        this.btnHorizontalAlign.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-horalign",
            showSeparator: false,
            defaults: {
                cls: "toolbar-menu-icon-item",
                checked: false,
                hideOnClick: true
            },
            items: [{
                iconCls: "mnu-icon-item mnu-align-left",
                text: this.textAlignLeft,
                icls: "halign-left",
                halign: "left",
                checked: true
            },
            {
                iconCls: "mnu-icon-item mnu-align-center",
                text: this.textAlignCenter,
                icls: "halign-center",
                halign: "center"
            },
            {
                iconCls: "mnu-icon-item mnu-align-right",
                text: this.textAlignRight,
                icls: "halign-right",
                halign: "right"
            },
            {
                iconCls: "mnu-icon-item mnu-align-just",
                text: this.textAlignJust,
                icls: "halign-just",
                halign: "justify"
            }]
        });
        btns_arr.push(this.btnHorizontalAlign);
        this.btnVerticalAlign.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-vertalign",
            showSeparator: false,
            defaults: {
                cls: "toolbar-menu-icon-item",
                group: "valignGroup",
                checked: false
            },
            items: [{
                iconCls: "mnu-icon-item mnu-align-top",
                text: this.textAlignTop,
                icls: "valign-top",
                valign: "top",
                checked: true
            },
            {
                iconCls: "mnu-icon-item mnu-align-middle",
                text: this.textAlignMiddle,
                icls: "valign-middle",
                valign: "center"
            },
            {
                iconCls: "mnu-icon-item mnu-align-bottom",
                text: this.textAlignBottom,
                icls: "valign-bottom",
                valign: "bottom"
            }]
        });
        btns_arr.push(this.btnVerticalAlign);
        this.btnParagraphColor.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            items: [this.colorsBack = Ext.create("Common.component.ThemeColorPalette", {
                id: "menu-palette-paragraph-color",
                value: "FF0000",
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
                "-", "--", "-", me.textStandartColors, "-", "transparent", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"],
                listeners: {
                    select: {
                        fn: function (picker, color, eOpts, id) {
                            me.btnParagraphColor.setColor(typeof(color) == "object" ? color.color : color);
                            Ext.menu.Manager.hideAll();
                            me.colorsBack.currentColor = color;
                            if (me.api) {
                                me.btnParagraphColor.ischanged = true;
                                me.api.asc_setCellBackgroundColor(color == "transparent" ? null : me.getRgbColor(color));
                                me.btnParagraphColor.ischanged = false;
                            }
                            Common.component.Analytics.trackEvent("ToolBar", "Background Color");
                        }
                    }
                }
            }), {
                cls: "menu-item-noicon menu-item-color-palette-theme",
                text: this.textNewColor,
                listeners: {
                    click: function (item, e) {
                        me.colorsBack.addNewColor();
                    }
                }
            }],
            listeners: {
                hide: function () {
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        btns_arr.push(this.btnParagraphColor);
        this.btnClearStyle.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-clearstyle",
            width: 90,
            minWidth: 90,
            showSeparator: false,
            defaults: {
                cls: "menu-item-noicon"
            },
            items: [{
                text: this.txtClearAll,
                action: c_oAscCleanOptions.All
            },
            {
                text: this.txtClearText,
                action: c_oAscCleanOptions.Text
            },
            {
                text: this.txtClearFormat,
                action: c_oAscCleanOptions.Format
            }]
        });
        btns_arr.push(this.btnClearStyle);
        this.btnMerge.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-merge",
            showSeparator: false,
            defaults: {
                cls: "menu-item-noicon"
            },
            items: [{
                text: this.txtMergeCenter,
                action: c_oAscMergeOptions.MergeCenter
            },
            {
                text: this.txtMergeAcross,
                action: c_oAscMergeOptions.MergeAcross
            },
            {
                text: this.txtMergeCells,
                action: c_oAscMergeOptions.Merge
            },
            {
                text: this.txtUnmerge,
                action: c_oAscMergeOptions.Unmerge
            }]
        });
        btns_arr.push(this.btnMerge);
        this.btnInsertFormula.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-insertformula",
            width: 100,
            minWidth: 100,
            showSeparator: false,
            defaults: {
                cls: "menu-item-noicon"
            },
            items: [{
                text: "SUM",
                func: "SUM"
            },
            {
                text: "MIN",
                func: "MIN"
            },
            {
                text: "MAX",
                func: "MAX"
            },
            {
                text: "COUNT",
                func: "COUNT"
            },
            {
                xtype: "menuseparator"
            },
            {
                text: this.txtAdditional,
                func: "more"
            }]
        });
        btns_arr.push(this.btnInsertFormula);
        var datetimeTemplate = Ext.create("Ext.XTemplate", '<tpl if="plain">{text}</tpl>' + '<tpl if="!plain">' + '<a id="{id}-itemEl" class="' + Ext.baseCSSPrefix + 'menu-item-link menu-item-datetime-format" href="{href}" hidefocus="true" unselectable="on">' + '<img id="{id}-iconEl" src="{icon}" class="' + Ext.baseCSSPrefix + 'menu-item-icon {iconCls}" />' + '<div class="menu-item-format">{[this.getTText(values.text)]}<span class="' + Ext.baseCSSPrefix + 'menu-item-text menu-item-description"">{[this.getDText(values.text)]}</span></div>' + "</a>" + "</tpl>", {
            getTText: function (t) {
                return (/^.*(?=\|)/).exec(t) || t;
            },
            getDText: function (t) {
                var out = (/\|(.*)$/).exec(t);
                return out ? out[1] : "";
            }
        });
        this.btnNumberFormat.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            action: "number-format",
            defaults: {
                cls: "menu-item-noicon"
            },
            items: [{
                text: this.txtGeneral,
                formatId: this.ascFormatOptions.General
            },
            {
                text: this.txtNumber,
                formatId: this.ascFormatOptions.Number
            },
            {
                text: this.txtInteger,
                formatId: "#0"
            },
            {
                text: this.txtScientific,
                formatId: this.ascFormatOptions.Scientific
            },
            {
                text: this.txtCurrency,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    action: "number-format",
                    defaults: {
                        cls: "menu-item-noicon"
                    },
                    items: [{
                        text: this.txtDollar,
                        formatId: this.ascFormatOptions.Currency
                    },
                    {
                        text: this.txtEuro,
                        formatId: "€#,##0.00"
                    },
                    {
                        text: this.txtPound,
                        formatId: "£#,##0.00"
                    },
                    {
                        text: this.txtRouble,
                        formatId: "#,##0.00р."
                    },
                    {
                        text: this.txtYen,
                        formatId: "¥#,##0.00"
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                text: this.txtDate,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    action: "number-format",
                    defaults: {
                        cls: "menu-item-noicon",
                        renderTpl: datetimeTemplate
                    },
                    items: [{
                        text: "07-24-88 |MM-dd-yy",
                        formatId: "MM-dd-yy"
                    },
                    {
                        text: "07-24-1988 |MM-dd-yyyy",
                        formatId: "MM-dd-yyyy"
                    },
                    {
                        text: "24-07-88 |dd-MM-yy",
                        formatId: "dd-MM-yy"
                    },
                    {
                        text: "24-07-1988 |dd-MM-yyyy",
                        formatId: "dd-MM-yyyy"
                    },
                    {
                        text: "24-Jul-1988 |dd-MMM-yyyy",
                        formatId: "dd-MMM-yyyy"
                    },
                    {
                        text: "24-Jul |dd-MMM",
                        formatId: "dd-MMM"
                    },
                    {
                        text: "Jul-88 |MMM-yy",
                        formatId: "MMM-yy",
                        width: 180
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                text: this.txtTime,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    action: "number-format",
                    defaults: {
                        cls: "menu-item-noicon",
                        renderTpl: datetimeTemplate
                    },
                    items: [{
                        text: "10:56 |HH:mm",
                        formatId: "HH:mm"
                    },
                    {
                        text: "21:56:00 |HH:MM:ss",
                        formatId: "HH:MM:ss"
                    },
                    {
                        text: "05:56 AM |hh:mm tt",
                        formatId: "hh:mm AM/PM"
                    },
                    {
                        text: "05:56:00 AM |hh:mm:ss tt",
                        formatId: "hh:mm:ss AM/PM",
                        width: 180
                    },
                    {
                        text: "38:56:00 |[h]:mm:ss",
                        formatId: "[h]:mm:ss"
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                text: this.txtPercentage,
                formatId: this.ascFormatOptions.Percentage
            },
            {
                text: this.txtText,
                formatId: this.ascFormatOptions.Text
            }],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        btns_arr.push(this.btnNumberFormat);
        var dataBorders = [{
            text: "1 pt",
            value: "thin",
            offsety: 0,
            checked: true
        },
        {
            text: "2.25 pt",
            value: "medium",
            offsety: 20
        },
        {
            text: "3 pt",
            value: "thick",
            offsety: 40
        }];
        for (i = 0; i < dataBorders.length; i++) {
            dataBorders[i].text += ("|" + Ext.String.format("background:url({0}) no-repeat scroll 0 {1}px;", "resources/img/toolbar/BorderSize.png", -dataBorders[i].offsety));
        }
        var borderSizeTemplate = Ext.create("Ext.XTemplate", '<tpl if="plain">{text}</tpl>' + '<tpl if="!plain">' + '<a id="{id}-itemEl" class="' + Ext.baseCSSPrefix + 'menu-item-link" href="{href}" hidefocus="true" unselectable="on" style="padding-left:16px;">' + '<img id="{id}-iconEl" src="{icon}" class="' + Ext.baseCSSPrefix + 'menu-item-icon {iconCls}" style="margin-left:2px" />' + '<div><img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" align="top" style="{[this.getSText(values.text)]}"/></div>' + "</a>" + "</tpl>", {
            getSText: function (t) {
                var out = (/\|(.*)$/).exec(t);
                return out ? out[1] : "";
            }
        });
        this.btnBorders.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-borders",
            showSeparator: false,
            defaults: {
                cls: "toolbar-menu-icon-item"
            },
            items: [{
                iconCls: "mnu-icon-item mnu-border-out",
                text: this.textOutBorders,
                icls: "borders-outer",
                borderId: "outer"
            },
            {
                iconCls: "mnu-icon-item mnu-border-all",
                text: this.textAllBorders,
                icls: "borders-all",
                borderId: "all"
            },
            {
                iconCls: "mnu-icon-item mnu-border-top",
                text: this.textTopBorders,
                icls: "borders-top",
                borderId: c_oAscBorderOptions.Top
            },
            {
                iconCls: "mnu-icon-item mnu-border-bottom",
                text: this.textBottomBorders,
                icls: "borders-bottom",
                borderId: c_oAscBorderOptions.Bottom
            },
            {
                iconCls: "mnu-icon-item mnu-border-left",
                text: this.textLeftBorders,
                icls: "borders-left",
                borderId: c_oAscBorderOptions.Left
            },
            {
                iconCls: "mnu-icon-item mnu-border-right",
                text: this.textRightBorders,
                icls: "borders-right",
                borderId: c_oAscBorderOptions.Right
            },
            {
                iconCls: "mnu-icon-item mnu-border-no",
                icls: "borders-noborders",
                text: this.textNoBorders,
                borderId: "none"
            },
            {
                xtype: "menuseparator"
            },
            {
                iconCls: "mnu-icon-item mnu-border-center",
                icls: "borders-inside",
                text: this.textInsideBorders,
                borderId: "inner"
            },
            {
                iconCls: "mnu-icon-item mnu-border-vmiddle",
                text: this.textCenterBorders,
                icls: "borders-inver",
                borderId: c_oAscBorderOptions.InnerV
            },
            {
                iconCls: "mnu-icon-item mnu-border-hmiddle",
                text: this.textMiddleBorders,
                icls: "borders-inhor",
                borderId: c_oAscBorderOptions.InnerH
            },
            {
                xtype: "menuseparator"
            },
            {
                iconCls: "mnu-icon-item mnu-border-width",
                hideOnClick: false,
                text: this.textBordersWidth,
                listeners: {},
                menu: {
                    id: "toolbar-menu-borders-width",
                    showSeparator: false,
                    defaults: {
                        cls: "menu-item-border-size",
                        group: "border-width",
                        checked: false,
                        hideOnClick: false,
                        renderTpl: borderSizeTemplate
                    },
                    items: dataBorders,
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                iconCls: "mnu-icon-item mnu-border-color",
                text: this.textBordersColor,
                hideOnClick: false,
                renderTpl: Ext.create("Ext.XTemplate", '<tpl if="plain">{text}</tpl>' + '<tpl if="!plain">' + '<a id="{id}-itemEl" class="' + Ext.baseCSSPrefix + 'menu-item-link" href="{href}" <tpl if="hrefTarget">target="{hrefTarget}"</tpl> hidefocus="true" unselectable="on">' + '<div class="' + Ext.baseCSSPrefix + 'menu-item-icon mnu-icon-item" style="background-image:none !important;">' + '<span id="{[this.iid]}" style="position:absolute;width:14px;height:14px;margin:3px 5px;border:2px solid #000;"></span>' + "</div>" + '<span id="{id}-textEl" class="' + Ext.baseCSSPrefix + 'menu-item-text" <tpl if="menu">style="margin-right: 17px;"</tpl> >{text}</span>' + '<tpl if="menu"><img id="{id}-arrowEl" src="{blank}" class="' + Ext.baseCSSPrefix + 'menu-item-arrow" /></tpl>' + "</a>" + "</tpl>", {
                    iid: "picker-borders-color"
                }),
                menu: {
                    showSeparator: false,
                    items: [me.colorsBorder = Ext.create("Common.component.ThemeColorPalette", {
                        id: "toolbar-menu-borders-color",
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
                        "-", "--", "-", me.textStandartColors, "-", "3D55FE", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"]
                    }), {
                        cls: "menu-item-noicon menu-item-color-palette-theme",
                        text: this.textNewColor,
                        listeners: {
                            click: function (item, e) {
                                me.colorsBorder.addNewColor();
                            }
                        }
                    }]
                }
            }],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        btns_arr.push(this.btnBorders);
        this.btnInsertImage.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-insertimage",
            showSeparator: false,
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
        });
        btns_arr.push(this.btnInsertImage);
        var slideTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="main-thumb">', '<div class="thumb-wrap" style="height:50px;">', '<img src="{imageUrl}" />', "</div>", "</div>", "</tpl>");
        this.btnAutofilter.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-autofilter",
            showSeparator: false,
            defaults: {
                cls: "toolbar-menu-icon-item"
            },
            items: [{
                iconCls: "mnu-icon-item mnu-sort-asc",
                text: me.txtSortAZ,
                direction: "ascending"
            },
            {
                iconCls: "mnu-icon-item mnu-sort-desc",
                text: me.txtSortZA,
                direction: "descending"
            },
            {
                iconCls: "mnu-icon-item mnu-filter-add",
                text: me.txtFilter,
                hideOnClick: true,
                action: "set-filter",
                checked: false
            },
            {
                iconCls: "mnu-icon-item mnu-filter-clear",
                text: me.txtTableTemplate,
                hideOnClick: false,
                menu: Ext.create("Common.component.MenuDataViewPicker", {
                    action: "table-templates",
                    width: 330,
                    height: 320,
                    dataTpl: slideTpl,
                    cls: "table-templates-picker",
                    store: Ext.getStore("TableTemplates"),
                    viewData: [],
                    contentWidth: 310
                })
            }]
        });
        btns_arr.push(this.btnAutofilter);
        var options = {};
        JSON.parse(window.localStorage.getItem("sse-hidden-title")) && (options.title = true);
        JSON.parse(window.localStorage.getItem("sse-hidden-formula")) && (options.formula = true);
        JSON.parse(window.localStorage.getItem("sse-hidden-headings")) && (options.headings = true);
        this.btnShowMode.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-app-hide",
            showSeparator: false,
            defaults: {
                hideOnClick: true
            },
            items: [{
                text: this.textCompactToolbar,
                action: "compact",
                checked: this.isCompactView
            },
            {
                text: this.textHideTBar,
                action: "title",
                checked: !!options.title
            },
            {
                text: this.textHideFBar,
                action: "formula",
                checked: !!options.formula
            },
            {
                text: this.textHideHeadings,
                action: "headings",
                checked: !!options.headings
            },
            {
                text: this.textHideGridlines,
                action: "gridlines",
                checked: false
            },
            {
                xtype: "menuseparator"
            },
            {
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
        btns_arr.push(this.btnShowMode);
        this.btnTextOrient.menu = Ext.create("Ext.menu.Menu", {
            id: "toolbar-menu-text-orientation",
            showSeparator: false,
            defaults: {
                cls: "toolbar-menu-icon-item",
                checked: false,
                hideOnClick: true
            },
            items: [{
                iconCls: "mnu-icon-item mnu-direct-horiz",
                text: this.textHorizontal,
                angle: "horiz"
            },
            {
                iconCls: "mnu-icon-item mnu-direct-ccw",
                text: this.textCounterCw,
                angle: "countcw"
            },
            {
                iconCls: "mnu-icon-item mnu-direct-cw",
                text: this.textClockwise,
                angle: "clockwise"
            },
            {
                iconCls: "mnu-icon-item mnu-direct-rup",
                text: this.textRotateUp,
                angle: "rotateup"
            },
            {
                iconCls: "mnu-icon-item mnu-direct-rdown",
                text: this.textRotateDown,
                angle: "rotatedown"
            }]
        });
        btns_arr.push(this.btnTextOrient);
        this.btnAddCell.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            action: "insert-cells",
            defaults: {
                cls: "menu-item-noicon"
            },
            items: [{
                text: this.textInsRight,
                kind: c_oAscInsertOptions.InsertCellsAndShiftRight
            },
            {
                text: this.textInsDown,
                kind: c_oAscInsertOptions.InsertCellsAndShiftDown
            },
            {
                text: this.textEntireRow,
                kind: c_oAscInsertOptions.InsertRows
            },
            {
                text: this.textEntireCol,
                kind: c_oAscInsertOptions.InsertColumns
            }]
        });
        btns_arr.push(this.btnAddCell);
        this.btnDeleteCell.menu = Ext.create("Ext.menu.Menu", {
            showSeparator: false,
            action: "delete-cells",
            defaults: {
                cls: "menu-item-noicon"
            },
            items: [{
                text: this.textDelLeft,
                kind: c_oAscDeleteOptions.DeleteCellsAndShiftLeft
            },
            {
                text: this.textDelUp,
                kind: c_oAscDeleteOptions.DeleteCellsAndShiftTop
            },
            {
                text: this.textEntireRow,
                kind: c_oAscDeleteOptions.DeleteRows
            },
            {
                text: this.textEntireCol,
                kind: c_oAscDeleteOptions.DeleteColumns
            }]
        });
        btns_arr.push(this.btnDeleteCell);
        for (var i = btns_arr.length; i--;) {
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
        if (this.cmbFontSize.rendered) {
            this.cmbFontSize.getEl().set({
                "data-qtip": me.tipFontSize
            });
            this.cmbFontSize.validate();
        }
        if (this.needShowSynchTip) {
            this.needShowSynchTip = false;
            this._onCollaborativeChanges();
        }
        if (this.themeColors) {
            this._onSendThemeColors(this.themeColors.user, this.themeColors.standart);
        }
    },
    textBold: "Bold",
    textItalic: "Italic",
    textUnderline: "Underline",
    tipFontName: "Font Name",
    tipFontSize: "Font Size",
    tipCopy: "Copy",
    tipPaste: "Paste",
    tipUndo: "Undo",
    tipRedo: "Redo",
    tipPrint: "Print",
    tipSave: "Save",
    tipFontColor: "Font color",
    tipPrColor: "Background color",
    tipClearStyle: "Clear",
    tipBack: "Back",
    tipHAligh: "Horizontal Align",
    tipVAligh: "Vertical Align",
    tipAlignLeft: "Align Left",
    tipAlignRight: "Align Right",
    tipAlignCenter: "Align Center",
    tipAlignJust: "Justified",
    textAlignTop: "Align text to the top",
    textAlignMiddle: "Align text to the middle",
    textAlignBottom: "Align text to the bottom",
    tipNumFormat: "Number Format",
    txtNumber: "Number",
    txtInteger: "Integer",
    txtGeneral: "General",
    txtCurrency: "Currency",
    txtDollar: "$ Dollar",
    txtEuro: "€ Euro",
    txtRouble: "р. Rouble",
    txtPound: "£ Pound",
    txtYen: "¥ Yen",
    txtDate: "Date",
    txtTime: "Time",
    txtDateTime: "Date & Time",
    txtPercentage: "Percentage",
    txtScientific: "Scientific",
    txtText: "Text",
    tipBorders: "Borders",
    textOutBorders: "Outside Borders",
    textAllBorders: "All Borders",
    textTopBorders: "Top Borders",
    textBottomBorders: "Bottom Borders",
    textLeftBorders: "Left Borders",
    textRightBorders: "Right Borders",
    textNoBorders: "No Borders",
    textInsideBorders: "Inside Borders",
    textMiddleBorders: "Inside Horizontal Borders",
    textCenterBorders: "Inside Vertical Borders",
    tipWrap: "Wrap Text",
    txtClearAll: "All",
    txtClearText: "Text",
    txtClearFormat: "Format",
    txtClearFormula: "Formula",
    txtClearHyper: "Hyperlink",
    tipMerge: "Merge",
    txtMergeCenter: "Merge Center",
    txtMergeAcross: "Merge Across",
    txtMergeCells: "Merge Cells",
    txtUnmerge: "Unmerge Cells",
    tipIncDecimal: "Increase Decimal",
    tipDecDecimal: "Decrease Decimal",
    tipAutofilter: "Set Autofilter",
    tipInsertImage: "Insert Picture",
    tipInsertHyperlink: "Add Hyperlink",
    tipSynchronize: "The document has been changed by another user. Please click to save your changes and reload the updates.",
    tipIncFont: "Increment font size",
    tipDecFont: "Decrement font size",
    tipInsertText: "Insert Text",
    tipInsertShape: "Insert Autoshape",
    tipDigStylePercent: "Percent Style",
    tipDigStyleCurrency: "Currency Style",
    tipViewSettings: "View Settings",
    tipAdvSettings: "Advanced Settings",
    tipTextOrientation: "Orientation",
    tipInsertOpt: "Insert Cells",
    tipDeleteOpt: "Delete Cells",
    tipAlignTop: "Align Top",
    tipAlignMiddle: "Align Middle",
    tipAlignBottom: "Align Bottom",
    textBordersWidth: "Borders Width",
    textBordersColor: "Borders Color",
    textAlignLeft: "Left align text",
    textAlignRight: "Right align text",
    textAlignCenter: "Center text",
    textAlignJust: "Justify",
    txtSort: "Sort",
    txtFormula: "Insert Function",
    txtNoBorders: "No borders",
    txtAdditional: "Additional",
    mniImageFromFile: "Picture from file",
    mniImageFromUrl: "Picture from url",
    textNewColor: "Add New Custom Color",
    textPrint: "Print",
    textPrintOptions: "Print Options",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    tipColorSchemas: "Change Color Scheme",
    tipNewDocument: "New Document",
    tipOpenDocument: "Open Document",
    txtSortAZ: "Sort A to Z",
    txtSortZA: "Sort Z to A",
    txtFilter: "Filter",
    txtTableTemplate: "Format As Table Template",
    textHorizontal: "Horizontal Text",
    textCounterCw: "Angle Counterclockwise",
    textClockwise: "Angle Clockwise",
    textRotateUp: "Rotate Text Up",
    textRotateDown: "Rotate Text Down",
    textInsRight: "Shift Cells Right",
    textInsDown: "Shift Cells Down",
    textEntireRow: "Entire Row",
    textEntireCol: "Entire Column",
    textDelLeft: "Shift Cells Left",
    textDelUp: "Shift Cells Up",
    textZoom: "Zoom",
    textCompactToolbar: "Compact Toolbar",
    textHideTBar: "Hide Title Bar",
    textHideFBar: "Hide Formula Bar",
    textHideHeadings: "Hide Headings",
    textHideGridlines: "Hide Gridlines",
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