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
 define(["jquery", "underscore", "backbone", "text!spreadsheeteditor/main/app/template/Toolbar.template", "common/main/lib/collection/Fonts", "common/main/lib/component/Button", "common/main/lib/component/ComboBox", "common/main/lib/component/DataView", "common/main/lib/component/ColorPalette", "common/main/lib/component/ThemeColorPalette", "common/main/lib/component/Menu", "common/main/lib/component/DimensionPicker", "common/main/lib/component/Window", "common/main/lib/component/ComboBoxFonts", "common/main/lib/component/ComboDataView", "common/main/lib/component/SynchronizeTip"], function ($, _, Backbone, toolbarTemplate) {
    SSE.enumLock = {
        editCell: "cell-editing",
        editFormula: "is-formula",
        editText: "is-text",
        selImage: "sel-image",
        selShape: "sel-shape",
        selShapeText: "sel-shape-txt",
        selChart: "sel-chart",
        selChartText: "sel-chart-txt",
        selRange: "sel-range",
        lostConnect: "disconnect",
        coAuth: "co-auth",
        ruleMerge: "rule-btn-merge",
        ruleFilter: "rule-filter",
        ruleDelFilter: "rule-clear-filter",
        menuFileOpen: "menu-file-open"
    };
    SSE.Views.Toolbar = Backbone.View.extend(_.extend({
        el: "#toolbar",
        template: _.template(toolbarTemplate),
        events: {},
        initialize: function () {
            var me = this,
            options = {};
            JSON.parse(window.localStorage.getItem("sse-hidden-title")) && (options.title = true);
            JSON.parse(window.localStorage.getItem("sse-hidden-formula")) && (options.formula = true);
            JSON.parse(window.localStorage.getItem("sse-hidden-headings")) && (options.headings = true);
            me.isCompactView = !!JSON.parse(window.localStorage.getItem("sse-toolbar-compact"));
            me.SchemeNames = [me.txtScheme1, me.txtScheme2, me.txtScheme3, me.txtScheme4, me.txtScheme5, me.txtScheme6, me.txtScheme7, me.txtScheme8, me.txtScheme9, me.txtScheme10, me.txtScheme11, me.txtScheme12, me.txtScheme13, me.txtScheme14, me.txtScheme15, me.txtScheme16, me.txtScheme17, me.txtScheme18, me.txtScheme19, me.txtScheme20, me.txtScheme21];
            me._state = {
                hasCollaborativeChanges: undefined
            };
            me.btnSaveCls = "btn-save";
            me.btnSaveTip = this.tipSave + Common.Utils.String.platformKey("Ctrl+S");
            me.ascFormatOptions = {
                General: "General",
                Number: "0.00",
                Currency: "$#,##0.00",
                Accounting: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
                DateShort: "m/d/yyyy",
                DateLong: "[$-F800]dddd, mmmm dd, yyyy",
                Time: "[$-F400]h:mm:ss AM/PM",
                Percentage: "0.00%",
                Percent: "0%",
                Fraction: "# ?/?",
                Scientific : "0.00E+00",
                Text : "@"
            };
            me.numFormatTypes = {};
            me.numFormatTypes[c_oAscNumFormatType.General] = me.txtGeneral;
            me.numFormatTypes[c_oAscNumFormatType.Custom] = me.txtCustom;
            me.numFormatTypes[c_oAscNumFormatType.Text] = me.txtText;
            me.numFormatTypes[c_oAscNumFormatType.Number] = me.txtNumber;
            me.numFormatTypes[c_oAscNumFormatType.Integer] = me.txtInteger;
            me.numFormatTypes[c_oAscNumFormatType.Scientific] = me.txtScientific;
            me.numFormatTypes[c_oAscNumFormatType.Currency] = me.txtCurrency;
            me.numFormatTypes[c_oAscNumFormatType.Accounting] = me.txtAccounting;
            me.numFormatTypes[c_oAscNumFormatType.Date] = me.txtDate;
            me.numFormatTypes[c_oAscNumFormatType.Time] = me.txtTime;
            me.numFormatTypes[c_oAscNumFormatType.Percent] = me.txtPercentage;
            me.numFormatTypes[c_oAscNumFormatType.Fraction] = "Fraction";
            function dummyCmp() {
                return {
                    isDummy: true,
                    on: function () {}
                };
            }
            var _set = SSE.enumLock;
            me.cmbFontSize = new Common.UI.ComboBox({
                cls: "input-group-nr",
                menuStyle: "min-width: 55px;",
                hint: me.tipFontSize,
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                data: [{
                    value: 8,
                    displayValue: "8"
                },
                {
                    value: 9,
                    displayValue: "9"
                },
                {
                    value: 10,
                    displayValue: "10"
                },
                {
                    value: 11,
                    displayValue: "11"
                },
                {
                    value: 12,
                    displayValue: "12"
                },
                {
                    value: 14,
                    displayValue: "14"
                },
                {
                    value: 16,
                    displayValue: "16"
                },
                {
                    value: 18,
                    displayValue: "18"
                },
                {
                    value: 20,
                    displayValue: "20"
                },
                {
                    value: 22,
                    displayValue: "22"
                },
                {
                    value: 24,
                    displayValue: "24"
                },
                {
                    value: 26,
                    displayValue: "26"
                },
                {
                    value: 28,
                    displayValue: "28"
                },
                {
                    value: 36,
                    displayValue: "36"
                },
                {
                    value: 48,
                    displayValue: "48"
                },
                {
                    value: 72,
                    displayValue: "72"
                }]
            });
            me.btnNewDocument = new Common.UI.Button({
                id: "id-toolbar-btn-newdocument",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-newdocument",
                lock: [_set.lostConnect],
                hint: me.tipNewDocument
            });
            me.btnOpenDocument = new Common.UI.Button({
                id: "id-toolbar-btn-opendocument",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-opendocument",
                lock: [_set.lostConnect],
                hint: me.tipOpenDocument
            });
            me.cmbFontName = new Common.UI.ComboBoxFonts({
                cls: "input-group-nr",
                menuCls: "scrollable-menu",
                menuStyle: "min-width: 325px;",
                hint: me.tipFontName,
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                store: new Common.Collections.Fonts()
            });
            me.btnPrint = new Common.UI.Button({
                id: "id-toolbar-btn-print",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-print",
                split: true,
                hint: me.tipPrint + Common.Utils.String.platformKey("Ctrl+P"),
                lock: [_set.editCell],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textPrint,
                        value: "print"
                    },
                    {
                        caption: me.textPrintOptions,
                        value: "options"
                    }]
                })
            });
            me.btnSave = new Common.UI.Button({
                id: "id-toolbar-btn-save",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: me.btnSaveCls,
                hint: me.btnSaveTip
            });
            me.btnCopy = new Common.UI.Button({
                id: "id-toolbar-btn-copy",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-copy",
                hint: me.tipCopy + Common.Utils.String.platformKey("Ctrl+C")
            });
            me.btnPaste = new Common.UI.Button({
                id: "id-toolbar-btn-paste",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-paste",
                lock: [_set.coAuth, _set.lostConnect],
                hint: me.tipPaste + Common.Utils.String.platformKey("Ctrl+V")
            });
            me.btnUndo = new Common.UI.Button({
                id: "id-toolbar-btn-undo",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-undo",
                disabled: true,
                lock: [_set.lostConnect],
                hint: me.tipUndo + Common.Utils.String.platformKey("Ctrl+Z")
            });
            me.btnRedo = new Common.UI.Button({
                id: "id-toolbar-btn-redo",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-redo",
                disabled: true,
                lock: [_set.lostConnect],
                hint: me.tipRedo + Common.Utils.String.platformKey("Ctrl+Y")
            });
            me.btnIncFontSize = new Common.UI.Button({
                id: "id-toolbar-btn-incfont",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-incfont",
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                hint: me.tipIncFont
            });
            me.btnDecFontSize = new Common.UI.Button({
                id: "id-toolbar-btn-decfont",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-decfont",
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                hint: me.tipDecFont
            });
            me.btnBold = new Common.UI.Button({
                id: "id-toolbar-btn-bold",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-bold",
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                hint: me.textBold + Common.Utils.String.platformKey("Ctrl+B"),
                enableToggle: true
            });
            me.btnItalic = new Common.UI.Button({
                id: "id-toolbar-btn-italic",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-italic",
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                hint: me.textItalic + Common.Utils.String.platformKey("Ctrl+I"),
                enableToggle: true
            });
            me.btnUnderline = new Common.UI.Button({
                id: "id-toolbar-btn-underline",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-underline",
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                hint: me.textUnderline + Common.Utils.String.platformKey("Ctrl+U"),
                enableToggle: true
            });
            me.mnuTextColorPicker = dummyCmp();
            me.btnTextColor = new Common.UI.Button({
                id: "id-toolbar-btn-fontcolor",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-fontcolor",
                hint: me.tipFontColor,
                split: true,
                lock: [_set.selImage, _set.editFormula, _set.selRange, _set.coAuth, _set.lostConnect],
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-fontcolor" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="id-toolbar-menu-new-fontcolor" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            }).on("render:after", function (btn) {
                var colorVal = $('<div class="btn-color-value-line"></div>');
                $("button:first-child", btn.cmpEl).append(colorVal);
                colorVal.css("background-color", btn.currentColor || "transparent");
                me.mnuTextColorPicker = new Common.UI.ThemeColorPalette({
                    el: $("#id-toolbar-menu-fontcolor"),
                    dynamiccolors: 10,
                    colors: [me.textThemeColors, "-", {
                        color: "3366FF",
                        effectId: 1
                    },
                    {
                        color: "0000FF",
                        effectId: 2
                    },
                    {
                        color: "000090",
                        effectId: 3
                    },
                    {
                        color: "660066",
                        effectId: 4
                    },
                    {
                        color: "800000",
                        effectId: 5
                    },
                    {
                        color: "FF0000",
                        effectId: 1
                    },
                    {
                        color: "FF6600",
                        effectId: 1
                    },
                    {
                        color: "FFFF00",
                        effectId: 2
                    },
                    {
                        color: "CCFFCC",
                        effectId: 3
                    },
                    {
                        color: "008000",
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
                });
            });
            me.mnuBackColorPicker = dummyCmp();
            me.btnBackColor = new Common.UI.Button({
                id: "id-toolbar-btn-fillparag",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-fillparag",
                hint: me.tipPrColor,
                split: true,
                lock: [_set.selImage, _set.editCell, _set.coAuth, _set.lostConnect],
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-paracolor" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="id-toolbar-menu-new-paracolor" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            }).on("render:after", function (btn) {
                var colorVal = $('<div class="btn-color-value-line"></div>');
                $("button:first-child", btn.cmpEl).append(colorVal);
                colorVal.css("background-color", btn.currentColor || "transparent");
                me.mnuBackColorPicker = new Common.UI.ThemeColorPalette({
                    el: $("#id-toolbar-menu-paracolor"),
                    dynamiccolors: 10,
                    colors: [me.textThemeColors, "-", {
                        color: "3366FF",
                        effectId: 1
                    },
                    {
                        color: "0000FF",
                        effectId: 2
                    },
                    {
                        color: "000090",
                        effectId: 3
                    },
                    {
                        color: "660066",
                        effectId: 4
                    },
                    {
                        color: "800000",
                        effectId: 5
                    },
                    {
                        color: "FF0000",
                        effectId: 1
                    },
                    {
                        color: "FF6600",
                        effectId: 1
                    },
                    {
                        color: "FFFF00",
                        effectId: 2
                    },
                    {
                        color: "CCFFCC",
                        effectId: 3
                    },
                    {
                        color: "008000",
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
                    "-", "--", "-", me.textStandartColors, "-", "transparent", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"]
                });
            });
            me.mnuBorderColorPicker = dummyCmp();
            me.btnBorders = new Common.UI.Button({
                id: "id-toolbar-btn-borders",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-border-out",
                icls: "btn-border-out",
                borderId: "outer",
                borderswidth: "thin",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                hint: me.tipBorders,
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textOutBorders,
                        iconCls: "mnu-border-out",
                        icls: "btn-border-out",
                        borderId: "outer"
                    },
                    {
                        caption: me.textAllBorders,
                        iconCls: "mnu-border-all",
                        icls: "btn-border-all",
                        borderId: "all"
                    },
                    {
                        caption: me.textTopBorders,
                        iconCls: "mnu-border-top",
                        icls: "btn-border-top",
                        borderId: c_oAscBorderOptions.Top
                    },
                    {
                        caption: me.textBottomBorders,
                        iconCls: "mnu-border-bottom",
                        icls: "btn-border-bottom",
                        borderId: c_oAscBorderOptions.Bottom
                    },
                    {
                        caption: me.textLeftBorders,
                        iconCls: "mnu-border-left",
                        icls: "btn-border-left",
                        borderId: c_oAscBorderOptions.Left
                    },
                    {
                        caption: me.textRightBorders,
                        iconCls: "mnu-border-right",
                        icls: "btn-border-right",
                        borderId: c_oAscBorderOptions.Right
                    },
                    {
                        caption: me.textNoBorders,
                        iconCls: "mnu-border-no",
                        icls: "btn-border-no",
                        borderId: "none"
                    },
                    {
                        caption: "--"
                    },
                    {
                        caption: me.textInsideBorders,
                        iconCls: "mnu-border-center",
                        icls: "btn-border-center",
                        borderId: "inner"
                    },
                    {
                        caption: me.textCenterBorders,
                        iconCls: "mnu-border-vmiddle",
                        icls: "btn-border-vmiddle",
                        borderId: c_oAscBorderOptions.InnerV
                    },
                    {
                        caption: me.textMiddleBorders,
                        iconCls: "mnu-border-hmiddle",
                        icls: "btn-border-hmiddle",
                        borderId: c_oAscBorderOptions.InnerH
                    },
                    {
                        caption: me.textDiagUpBorder,
                        iconCls: "mnu-border-diagup",
                        icls: "btn-border-diagup",
                        borderId: c_oAscBorderOptions.DiagU
                    },
                    {
                        caption: me.textDiagDownBorder,
                        iconCls: "mnu-border-diagdown",
                        icls: "btn-border-diagdown",
                        borderId: c_oAscBorderOptions.DiagD
                    },
                    {
                        caption: "--"
                    },
                    {
                        id: "id-toolbar-mnu-item-border-width",
                        caption: me.textBordersWidth,
                        iconCls: "mnu-icon-item mnu-border-width",
                        template: _.template('<a id="<%= id %>" tabindex="-1" type="menuitem"><span class="menu-item-icon" style="background-image: none; width: 11px; height: 11px; margin: 2px 7px 0 -9px; border-style: solid; border-width: 1px; border-color: #000;"></span><%= caption %></a>'),
                        menu: (function () {
                            var itemTemplate = _.template('<a id="<%= id %>" tabindex="-1" type="menuitem"><div class="border-size-item" style="background-position: 0 -<%= options.offsety %>px;"></div></a>');
                            me.mnuBorderWidth = new Common.UI.Menu({
                                style: "min-width: 100px;",
                                menuAlign: "tl-tr",
                                id: "toolbar-menu-borders-width",
                                items: [{
                                    template: itemTemplate,
                                    stopPropagation: true,
                                    checkable: true,
                                    toggleGroup: "border-width",
                                    value: "thin",
                                    offsety: 0,
                                    checked: true
                                },
                                {
                                    template: itemTemplate,
                                    stopPropagation: true,
                                    checkable: true,
                                    toggleGroup: "border-width",
                                    value: "medium",
                                    offsety: 20
                                },
                                {
                                    template: itemTemplate,
                                    stopPropagation: true,
                                    checkable: true,
                                    toggleGroup: "border-width",
                                    value: "thick",
                                    offsety: 40
                                }]
                            });
                            return me.mnuBorderWidth;
                        })()
                    },
                    {
                        id: "id-toolbar-mnu-item-border-color",
                        caption: me.textBordersColor,
                        iconCls: "mnu-icon-item mnu-border-color",
                        template: _.template('<a id="<%= id %>"tabindex="-1" type="menuitem"><span class="menu-item-icon" style="background-image: none; width: 11px; height: 11px; margin: 2px 7px 0 -9px; border-style: solid; border-width: 3px; border-color: #000;"></span><%= caption %></a>'),
                        menu: new Common.UI.Menu({
                            menuAlign: "tl-tr",
                            items: [{
                                template: _.template('<div id="id-toolbar-menu-bordercolor" style="width: 165px; height: 220px; margin: 10px;"></div>'),
                                stopPropagation: true
                            },
                            {
                                template: _.template('<a id="id-toolbar-menu-new-bordercolor" style="padding-left:12px;">' + me.textNewColor + "</a>"),
                                stopPropagation: true
                            }]
                        })
                    }]
                })
            }).on("render:after", function (btn) {
                var colorVal = $('<div class="btn-color-value-line"></div>');
                $("button:first-child", btn.cmpEl).append(colorVal);
                colorVal.css("background-color", btn.currentColor || "transparent");
                me.mnuBorderColorPicker = new Common.UI.ThemeColorPalette({
                    el: $("#id-toolbar-menu-bordercolor"),
                    dynamiccolors: 10,
                    colors: [me.textThemeColors, "-", {
                        color: "3366FF",
                        effectId: 1
                    },
                    {
                        color: "0000FF",
                        effectId: 2
                    },
                    {
                        color: "000090",
                        effectId: 3
                    },
                    {
                        color: "660066",
                        effectId: 4
                    },
                    {
                        color: "800000",
                        effectId: 5
                    },
                    {
                        color: "FF0000",
                        effectId: 1
                    },
                    {
                        color: "FF6600",
                        effectId: 1
                    },
                    {
                        color: "FFFF00",
                        effectId: 2
                    },
                    {
                        color: "CCFFCC",
                        effectId: 3
                    },
                    {
                        color: "008000",
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
                });
            });
            me.btnAlignLeft = new Common.UI.Button({
                id: "id-toolbar-btn-align-left",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-left",
                hint: me.tipAlignLeft,
                enableToggle: true,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                toggleGroup: "alignGroup"
            });
            me.btnAlignCenter = new Common.UI.Button({
                id: "id-toolbar-btn-align-center",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-center",
                hint: me.tipAlignCenter,
                enableToggle: true,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                toggleGroup: "alignGroup"
            });
            me.btnAlignRight = new Common.UI.Button({
                id: "id-toolbar-btn-align-right",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-right",
                hint: me.tipAlignRight,
                enableToggle: true,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                toggleGroup: "alignGroup"
            });
            me.btnAlignJust = new Common.UI.Button({
                id: "id-toolbar-btn-align-just",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-just",
                hint: me.tipAlignJust,
                enableToggle: true,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                toggleGroup: "alignGroup"
            });
            me.btnMerge = new Common.UI.Button({
                id: "id-toolbar-rtn-merge",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-merge",
                hint: me.tipMerge,
                enableToggle: true,
                allowDepress: true,
                split: true,
                lock: [_set.editCell, _set.selShape, _set.selShapeText, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleMerge],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.txtMergeCenter,
                        value: c_oAscMergeOptions.MergeCenter
                    },
                    {
                        caption: me.txtMergeAcross,
                        value: c_oAscMergeOptions.MergeAcross
                    },
                    {
                        caption: me.txtMergeCells,
                        value: c_oAscMergeOptions.Merge
                    },
                    {
                        caption: me.txtUnmerge,
                        value: c_oAscMergeOptions.Unmerge
                    }]
                })
            });
            me.btnAlignTop = new Common.UI.Button({
                id: "id-toolbar-rtn-valign-top",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-valign-top",
                hint: me.tipAlignTop,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                enableToggle: true,
                toggleGroup: "vAlignGroup"
            });
            me.btnAlignMiddle = new Common.UI.Button({
                id: "id-toolbar-rtn-valign-middle",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-valign-middle",
                hint: me.tipAlignMiddle,
                enableToggle: true,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                toggleGroup: "vAlignGroup"
            });
            me.btnAlignBottom = new Common.UI.Button({
                id: "id-toolbar-rtn-valign-bottom",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-valign-bottom",
                hint: me.tipAlignBottom,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                enableToggle: true,
                toggleGroup: "vAlignGroup"
            });
            me.btnWrap = new Common.UI.Button({
                id: "id-toolbar-rtn-wrap",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-wrap",
                hint: me.tipWrap,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                enableToggle: true,
                allowDepress: true
            });
            me.btnTextOrient = new Common.UI.Button({
                id: "id-toolbar-rtn-textorient",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-text-orient",
                hint: me.tipTextOrientation,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textHorizontal,
                        iconCls: "mnu-direct-horiz",
                        checkable: true,
                        toggleGroup: "textorientgroup",
                        value: "horiz"
                    },
                    {
                        caption: me.textCounterCw,
                        iconCls: "mnu-direct-ccw",
                        checkable: true,
                        toggleGroup: "textorientgroup",
                        value: "countcw"
                    },
                    {
                        caption: me.textClockwise,
                        iconCls: "mnu-direct-cw",
                        checkable: true,
                        toggleGroup: "textorientgroup",
                        value: "clockwise"
                    },
                    {
                        caption: me.textRotateUp,
                        iconCls: "mnu-direct-rup",
                        checkable: true,
                        toggleGroup: "textorientgroup",
                        value: "rotateup"
                    },
                    {
                        caption: me.textRotateDown,
                        iconCls: "mnu-direct-rdown",
                        checkable: true,
                        toggleGroup: "textorientgroup",
                        value: "rotatedown"
                    }]
                })
            });
            me.btnInsertImage = new Common.UI.Button({
                id: "id-toolbar-btn-insertimage",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertimage",
                hint: me.tipInsertImage,
                lock: [_set.editCell, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.mniImageFromFile,
                        value: "file"
                    },
                    {
                        caption: me.mniImageFromUrl,
                        value: "url"
                    }]
                })
            });
            me.btnInsertHyperlink = new Common.UI.Button({
                id: "id-toolbar-btn-inserthyperlink",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-inserthyperlink",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selImage, _set.selShape, _set.lostConnect, _set.coAuth],
                hint: me.tipInsertHyperlink + Common.Utils.String.platformKey("Ctrl+K")
            });
            me.btnInsertChart = new Common.UI.Button({
                id: "id-toolbar-btn-insertchart",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertchart",
                lock: [_set.editCell, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                hint: me.tipInsertChart
            });
            me.btnEditChart = new Common.UI.Button({
                id: "id-toolbar-rtn-edit-chart",
                cls: "btn-toolbar btn-toolbar-default btn-text-value",
                caption: me.tipEditChart,
                lock: [_set.lostConnect],
                style: "width: 120px;"
            });
            me.btnInsertShape = new Common.UI.Button({
                id: "id-toolbar-btn-insertshape",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertshape",
                hint: me.tipInsertShape,
                enableToggle: true,
                lock: [_set.editCell, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    cls: "menu-shapes"
                })
            });
            me.btnInsertText = new Common.UI.Button({
                id: "id-toolbar-btn-inserttext",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-text",
                hint: me.tipInsertText,
                lock: [_set.editCell, _set.selChartText, _set.selImage, _set.lostConnect, _set.coAuth],
                enableToggle: true
            });
            me.btnSortDown = new Common.UI.Button({
                id: "id-toolbar-btn-sort-down",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-sort-down",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter],
                hint: me.txtSortAZ
            });
            me.btnSortUp = new Common.UI.Button({
                id: "id-toolbar-btn-sort-up",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-sort-up",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter],
                hint: me.txtSortZA
            });
            me.btnSetAutofilter = new Common.UI.Button({
                id: "id-toolbar-btn-setautofilter",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-autofilter",
                hint: me.txtFilter + " (Ctrl+Shift+L)",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter],
                enableToggle: true
            });
            me.btnClearAutofilter = new Common.UI.Button({
                id: "id-toolbar-btn-clearfilter",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-clear-filter",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleDelFilter],
                hint: me.txtClearFilter
            });
            me.btnTableTemplate = new Common.UI.Button({
                id: "id-toolbar-btn-ttempl",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-ttempl",
                hint: me.txtTableTemplate,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter],
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-table-templates" style="width: 285px; height: 300px; margin: 3px 10px;"></div>')
                    }]
                })
            });
            me.listStyles = new Common.UI.ComboDataView({
                cls: "combo-styles",
                enableKeyEvents: true,
                itemWidth: 104,
                itemHeight: 38,
                hint: this.tipCellStyle,
                menuMaxHeight: 226,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                beforeOpenHandler: function (e) {
                    var cmp = this,
                    menu = cmp.openButton.menu,
                    minMenuColumn = 6;
                    if (menu.cmpEl) {
                        var itemEl = $(cmp.cmpEl.find(".dataview.inner .style").get(0)).parent();
                        var itemMargin = -1;
                        var itemWidth = itemEl.is(":visible") ? parseInt(itemEl.css("width")) : 112;
                        var minCount = cmp.menuPicker.store.length >= minMenuColumn ? minMenuColumn : cmp.menuPicker.store.length,
                        columnCount = Math.min(cmp.menuPicker.store.length, Math.round($(".dataview", $(cmp.fieldPicker.el)).width() / (itemMargin + itemWidth) + 0.5));
                        columnCount = columnCount < minCount ? minCount : columnCount;
                        menu.menuAlignEl = cmp.cmpEl;
                        menu.menuAlign = "tl-tl";
                        menu.setOffset(cmp.cmpEl.width() - cmp.openButton.$el.width() - columnCount * (itemMargin + itemWidth) - 1);
                        menu.cmpEl.css({
                            "width": columnCount * (itemWidth + itemMargin),
                            "min-height": cmp.cmpEl.height()
                        });
                    }
                }
            });
            var formatTemplate = _.template('<a id="<%= id %>" style="white-space: normal;"><%= caption %><span style="float: right; color: silver;"><%= options.tplval ? options.tplval : options.value %></span></a>');
            me.btnNumberFormat = new Common.UI.Button({
                id: "id-toolbar-btn-num-format",
                cls: "btn-toolbar btn-toolbar-default btn-text-value",
                hint: me.tipNumFormat,
                caption: me.txtGeneral,
                style: "width: 100%;",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selRange, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    style: "margin-left: -1px;",
                    items: [{
                        caption: me.txtGeneral,
                        value: me.ascFormatOptions.General
                    },
                    {
                        caption: me.txtNumber,
                        value: me.ascFormatOptions.Number
                    },
                    {
                        caption: me.txtInteger,
                        value: "#0"
                    },
                    {
                        caption: me.txtScientific,
                        value: me.ascFormatOptions.Scientific
                    },
                    {
                        caption: me.txtAccounting,
                        menu: new Common.UI.Menu({
                            style: "min-width: 120px;",
                            menuAlign: "tl-tr",
                            items: [{
                                caption: me.txtDollar,
                                value: me.ascFormatOptions.Accounting
                            },
                            {
                                caption: me.txtEuro,
                                value: '_(€* #,##0.00_);_(€* (#,##0.00);_(€* "-"??_);_(@_)'
                            },
                            {
                                caption: me.txtPound,
                                value: '_(£* #,##0.00_);_(£* (#,##0.00);_(£* "-"??_);_(@_)'
                            },
                            {
                                caption: me.txtRouble,
                                value: '_-* #,##0.00[$р.-419]_-;-* #,##0.00[$р.-419]_-;_-* "-"??[$р.-419]_-;_-@_-'
                            },
                            {
                                caption: me.txtYen,
                                value: '_(¥* #,##0.00_);_(¥* (#,##0.00);_(¥* "-"??_);_(@_)'
                            }]
                        })
                    },
                    {
                        caption: me.txtCurrency,
                        menu: new Common.UI.Menu({
                            style: "min-width: 120px;",
                            menuAlign: "tl-tr",
                            items: [{
                                caption: me.txtDollar,
                                value: me.ascFormatOptions.Currency
                            },
                            {
                                caption: me.txtEuro,
                                value: "€#,##0.00"
                            },
                            {
                                caption: me.txtPound,
                                value: "£#,##0.00"
                            },
                            {
                                caption: me.txtRouble,
                                value: "#,##0.00р."
                            },
                            {
                                caption: me.txtYen,
                                value: "¥#,##0.00"
                            }]
                        })
                    },
                    {
                        caption: me.txtDate,
                        menu: new Common.UI.Menu({
                            style: "min-width: 200px;",
                            menuAlign: "tl-tr",
                            items: [{
                                caption: "07-24-88",
                                value: "MM-dd-yy",
                                template: formatTemplate
                            },
                            {
                                caption: "07-24-1988",
                                value: "MM-dd-yyyy",
                                template: formatTemplate
                            },
                            {
                                caption: "24-07-88",
                                value: "dd-MM-yy",
                                template: formatTemplate
                            },
                            {
                                caption: "24-07-1988",
                                value: "dd-MM-yyyy",
                                template: formatTemplate
                            },
                            {
                                caption: "24-Jul-1988",
                                value: "dd-MMM-yyyy",
                                template: formatTemplate
                            },
                            {
                                caption: "24-Jul",
                                value: "dd-MMM",
                                template: formatTemplate
                            },
                            {
                                caption: "Jul-88",
                                value: "MMM-yy",
                                template: formatTemplate
                            }]
                        })
                    },
                    {
                        caption: me.txtTime,
                        menu: new Common.UI.Menu({
                            style: "min-width: 200px;",
                            menuAlign: "tl-tr",
                            showSeparator: false,
                            items: [{
                                caption: "10:56",
                                value: "HH:mm",
                                template: formatTemplate
                            },
                            {
                                caption: "21:56:00",
                                value: "HH:MM:ss",
                                template: formatTemplate
                            },
                            {
                                caption: "05:56 AM",
                                tplval: "hh:mm tt",
                                value: "hh:mm AM/PM",
                                template: formatTemplate
                            },
                            {
                                caption: "05:56:00 AM",
                                tplval: "hh:mm:ss tt",
                                value: "hh:mm:ss AM/PM",
                                template: formatTemplate
                            },
                            {
                                caption: "38:56:00",
                                value: "[h]:mm:ss",
                                template: formatTemplate
                            }]
                        })
                    },
                    {
                        caption: me.txtPercentage,
                        value: me.ascFormatOptions.Percentage
                    },
                    {
                        caption: me.txtText,
                        value: me.ascFormatOptions.Text
                    }]
                })
            });
            me.btnPercentStyle = new Common.UI.Button({
                id: "id-toolbar-btn-percent-style",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-percent-style",
                hint: me.tipDigStylePercent,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                formatId: me.ascFormatOptions.Percent
            });
            me.btnCurrencyStyle = new Common.UI.Button({
                id: "id-toolbar-btn-accounting-style",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-currency-style",
                hint: me.tipDigStyleAccounting,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                formatId: me.ascFormatOptions.Accounting,
                split: true,
                menu: new Common.UI.Menu({
                    style: "min-width: 120px;",
                    items: [{
                        caption: me.txtDollar,
                        value: me.ascFormatOptions.Accounting
                    },
                    {
                        caption: me.txtEuro,
                        value: '_(€* #,##0.00_);_(€* (#,##0.00);_(€* "-"??_);_(@_)'
                    },
                    {
                        caption: me.txtPound,
                        value: '_(£* #,##0.00_);_(£* (#,##0.00);_(£* "-"??_);_(@_)'
                    },
                    {
                        caption: me.txtRouble,
                        value: '_-* #,##0.00[$р.-419]_-;-* #,##0.00[$р.-419]_-;_-* "-"??[$р.-419]_-;_-@_-'
                    },
                    {
                        caption: me.txtYen,
                        value: '_(¥* #,##0.00_);_(¥* (#,##0.00);_(¥* "-"??_);_(@_)'
                    }]
                })
            });
            me.btnDecDecimal = new Common.UI.Button({
                id: "id-toolbar-btn-decdecimal",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-decdecimal",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                hint: me.tipDecDecimal
            });
            me.btnIncDecimal = new Common.UI.Button({
                id: "id-toolbar-btn-incdecimal",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-incdecimal",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                hint: me.tipIncDecimal
            });
            me.btnInsertFormula = new Common.UI.Button({
                id: "id-toolbar-btn-insertformula",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-formula",
                hint: me.txtFormula,
                split: true,
                lock: [_set.editText, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.selRange, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    style: "min-width: 110px",
                    items: [{
                        caption: "SUM",
                        value: "SUM"
                    },
                    {
                        caption: "MIN",
                        value: "MIN"
                    },
                    {
                        caption: "MAX",
                        value: "MAX"
                    },
                    {
                        caption: "COUNT",
                        value: "COUNT"
                    },
                    {
                        caption: "--"
                    },
                    {
                        caption: me.txtAdditional,
                        value: "more"
                    }]
                })
            });
            me.btnClearStyle = new Common.UI.Button({
                id: "id-toolbar-btn-clear",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-clearstyle",
                hint: me.tipClearStyle,
                lock: [_set.lostConnect, _set.coAuth, _set.selRange],
                menu: new Common.UI.Menu({
                    style: "min-width: 110px",
                    items: [{
                        caption: me.txtClearAll,
                        value: c_oAscCleanOptions.All
                    },
                    {
                        caption: me.txtClearText,
                        lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth],
                        value: c_oAscCleanOptions.Text
                    },
                    {
                        caption: me.txtClearFormat,
                        lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth],
                        value: c_oAscCleanOptions.Format
                    },
                    {
                        caption: me.txtClearComments,
                        lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth],
                        value: c_oAscCleanOptions.Comments
                    },
                    {
                        caption: me.txtClearHyper,
                        lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth],
                        value: c_oAscCleanOptions.Hyperlinks
                    }]
                })
            });
            me.btnCopyStyle = new Common.UI.Button({
                id: "id-toolbar-btn-copystyle",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-copystyle",
                hint: this.tipCopyStyle,
                lock: [_set.editCell, _set.lostConnect, _set.coAuth, _set.selChart],
                enableToggle: true
            });
            me.btnAddCell = new Common.UI.Button({
                id: "id-toolbar-btn-addcell",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-addcell",
                hint: me.tipInsertOpt,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textInsRight,
                        value: c_oAscInsertOptions.InsertCellsAndShiftRight
                    },
                    {
                        caption: me.textInsDown,
                        value: c_oAscInsertOptions.InsertCellsAndShiftDown
                    },
                    {
                        caption: me.textEntireRow,
                        value: c_oAscInsertOptions.InsertRows
                    },
                    {
                        caption: me.textEntireCol,
                        value: c_oAscInsertOptions.InsertColumns
                    }]
                })
            });
            me.btnDeleteCell = new Common.UI.Button({
                id: "id-toolbar-btn-delcell",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-delcell",
                hint: me.tipDeleteOpt,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textDelLeft,
                        value: c_oAscDeleteOptions.DeleteCellsAndShiftLeft
                    },
                    {
                        caption: me.textDelUp,
                        value: c_oAscDeleteOptions.DeleteCellsAndShiftTop
                    },
                    {
                        caption: me.textEntireRow,
                        value: c_oAscDeleteOptions.DeleteRows
                    },
                    {
                        caption: me.textEntireCol,
                        value: c_oAscDeleteOptions.DeleteColumns
                    }]
                })
            });
            me.btnColorSchemas = new Common.UI.Button({
                id: "id-toolbar-btn-colorschemas",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-colorschemas",
                hint: me.tipColorSchemas,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [],
                    maxHeight: 600,
                    restoreHeight: 600
                }).on("render:after", function (mnu) {
                    this.scroller = new Common.UI.Scroller({
                        el: $(this.el).find(".dropdown-menu "),
                        useKeyboard: this.enableKeyEvents && !this.handleSelect,
                        minScrollbarLength: 40,
                        alwaysVisibleY: true
                    });
                }).on("show:after", function (btn, e) {
                    var mnu = $(this.el).find(".dropdown-menu "),
                    docH = $(document).height(),
                    menuH = mnu.outerHeight(),
                    top = parseInt(mnu.css("top"));
                    if (menuH > docH) {
                        mnu.css("max-height", (docH - parseInt(mnu.css("padding-top")) - parseInt(mnu.css("padding-bottom")) - 5) + "px");
                        this.scroller.update({
                            minScrollbarLength: 40
                        });
                    } else {
                        if (mnu.height() < this.options.restoreHeight) {
                            mnu.css("max-height", (Math.min(docH - parseInt(mnu.css("padding-top")) - parseInt(mnu.css("padding-bottom")) - 5, this.options.restoreHeight)) + "px");
                            menuH = mnu.outerHeight();
                            if (top + menuH > docH) {
                                mnu.css("top", 0);
                            }
                            this.scroller.update({
                                minScrollbarLength: 40
                            });
                        }
                    }
                })
            });
            me.mnuZoomIn = dummyCmp();
            me.mnuZoomOut = dummyCmp();
            me.btnShowMode = new Common.UI.Button({
                id: "id-toolbar-btn-showmode",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-showmode",
                hint: me.tipViewSettings,
                lock: [_set.menuFileOpen, _set.editCell],
                menu: new Common.UI.Menu({
                    items: [me.mnuitemCompactToolbar = new Common.UI.MenuItem({
                        caption: me.textCompactToolbar,
                        checkable: true,
                        checked: me.isCompactView,
                        value: "compact"
                    }), me.mnuitemHideTitleBar = new Common.UI.MenuItem({
                        caption: me.textHideTBar,
                        checkable: true,
                        checked: !!options.title,
                        value: "title"
                    }), {
                        caption: me.textHideFBar,
                        checkable: true,
                        checked: !!options.formula,
                        value: "formula"
                    },
                    {
                        caption: me.textHideHeadings,
                        checkable: true,
                        checked: !!options.headings,
                        value: "headings"
                    },
                    {
                        caption: me.textHideGridlines,
                        checkable: true,
                        checked: false,
                        value: "gridlines"
                    },
                    {
                        caption: this.textFreezePanes,
                        checkable: true,
                        checked: false,
                        value: "freezepanes"
                    },
                    {
                        caption: "--"
                    },
                    (new Common.UI.MenuItem({
                        template: _.template(['<div id="id-toolbar-menu-zoom" class="menu-zoom" style="height: 25px;" ', "<% if(!_.isUndefined(options.stopPropagation)) { %>", 'data-stopPropagation="true"', "<% } %>", ">", '<label class="title">' + me.textZoom + "</label>", '<button id="id-menu-zoom-in" type="button" style="float:right; margin: 2px 5px 0 0;" class="btn small btn-toolbar btn-toolbar-default"><span class="btn-icon btn-zoomin">&nbsp;</span></button>', '<label class="zoom">100%</label>', '<button id="id-menu-zoom-out" type="button" style="float:right; margin-top: 2px;" class="btn small btn-toolbar btn-toolbar-default"><span class="btn-icon btn-zoomout">&nbsp;</span></button>', "</div>"].join("")),
                        stopPropagation: true
                    }))]
                })
            }).on("render:after", _.bind(function (cmp) {
                me.mnuZoomOut = new Common.UI.Button({
                    el: $("#id-menu-zoom-out"),
                    cls: "btn-toolbar btn-toolbar-default"
                });
                me.mnuZoomIn = new Common.UI.Button({
                    el: $("#id-menu-zoom-in"),
                    cls: "btn-toolbar btn-toolbar-default"
                });
            }), me);
            me.btnSettings = new Common.UI.Button({
                id: "id-toolbar-btn-settings",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-settings",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth],
                hint: me.tipAdvSettings
            });
            me.btnHorizontalAlign = new Common.UI.Button({
                id: "id-toolbar-btn-halign",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-left",
                hint: me.tipHAligh,
                icls: "btn-align-left",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.tipAlignLeft,
                        iconCls: "mnu-align-left",
                        icls: "btn-align-left",
                        checkable: true,
                        allowDepress: true,
                        toggleGroup: "halignGroup",
                        checked: true,
                        value: "left"
                    },
                    {
                        caption: me.tipAlignCenter,
                        iconCls: "mnu-align-center",
                        icls: "btn-align-center",
                        checkable: true,
                        allowDepress: true,
                        toggleGroup: "halignGroup",
                        value: "center"
                    },
                    {
                        caption: me.tipAlignRight,
                        iconCls: "mnu-align-right",
                        icls: "btn-align-right",
                        checkable: true,
                        allowDepress: true,
                        toggleGroup: "halignGroup",
                        value: "right"
                    },
                    {
                        caption: me.tipAlignJust,
                        iconCls: "mnu-align-just",
                        icls: "btn-align-just",
                        checkable: true,
                        allowDepress: true,
                        toggleGroup: "halignGroup",
                        value: "justify"
                    }]
                })
            });
            me.btnVerticalAlign = new Common.UI.Button({
                id: "id-toolbar-btn-valign",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-valign-bottom",
                hint: me.tipVAligh,
                icls: "btn-valign-bottom",
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.lostConnect, _set.coAuth],
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.tipAlignTop,
                        iconCls: "mnu-valign-top",
                        icls: "btn-valign-top",
                        checkable: true,
                        allowDepress: true,
                        toggleGroup: "valignGroup",
                        value: "top"
                    },
                    {
                        caption: me.tipAlignCenter,
                        iconCls: "mnu-valign-middle",
                        icls: "btn-valign-middle",
                        checkable: true,
                        allowDepress: true,
                        toggleGroup: "valignGroup",
                        value: "center"
                    },
                    {
                        caption: me.tipAlignBottom,
                        iconCls: "mnu-valign-bottom",
                        icls: "btn-valign-bottom",
                        checkable: true,
                        allowDepress: true,
                        checked: true,
                        toggleGroup: "valignGroup",
                        value: "bottom"
                    }]
                })
            });
            me.btnAutofilter = new Common.UI.Button({
                id: "id-toolbar-btn-autofilter",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-autofilter",
                hint: me.tipAutofilter,
                lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.lostConnect, _set.coAuth, _set.ruleFilter],
                menu: new Common.UI.Menu({
                    items: [me.mnuitemSortAZ = new Common.UI.MenuItem({
                        caption: me.txtSortAZ,
                        iconCls: "mnu-sort-asc",
                        lock: [_set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth, _set.ruleFilter],
                        value: "ascending"
                    }), me.mnuitemSortZA = new Common.UI.MenuItem({
                        caption: me.txtSortZA,
                        iconCls: "mnu-sort-desc",
                        lock: [_set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth, _set.ruleFilter],
                        value: "descending"
                    }), me.mnuitemAutoFilter = new Common.UI.MenuItem({
                        caption: me.txtFilter,
                        iconCls: "mnu-filter-add",
                        checkable: true,
                        lock: [_set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth, _set.ruleFilter],
                        value: "set-filter"
                    }), me.mnuitemClearFilter = new Common.UI.MenuItem({
                        caption: me.txtClearFilter,
                        iconCls: "mnu-filter-clear",
                        lock: [_set.editCell, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.selImage, _set.coAuth, _set.ruleDelFilter],
                        value: "clear-filter"
                    })]
                })
            });
            me.mnuPrint = me.btnPrint.menu;
            me.lockControls = [me.cmbFontName, me.cmbFontSize, me.btnIncFontSize, me.btnDecFontSize, me.btnBold, me.btnItalic, me.btnUnderline, me.btnTextColor, me.btnHorizontalAlign, me.btnAlignLeft, me.btnAlignCenter, me.btnAlignRight, me.btnAlignJust, me.btnVerticalAlign, me.btnAlignTop, me.btnAlignMiddle, me.btnAlignBottom, me.btnWrap, me.btnTextOrient, me.btnBackColor, me.btnMerge, me.btnInsertFormula, me.btnIncDecimal, me.btnInsertShape, me.btnInsertText, me.btnSortUp, me.btnSortDown, me.btnSetAutofilter, me.btnClearAutofilter, me.btnTableTemplate, me.btnPercentStyle, me.btnCurrencyStyle, me.btnDecDecimal, me.btnAddCell, me.btnDeleteCell, me.btnNumberFormat, me.btnBorders, me.btnInsertImage, me.btnInsertHyperlink, me.btnInsertChart, me.btnColorSchemas, me.btnAutofilter, me.btnCopy, me.btnPaste, me.btnSettings, me.listStyles, me.btnPrint, me.btnShowMode, me.btnClearStyle, me.btnCopyStyle];
            var hidetip = window.localStorage.getItem("sse-hide-synch");
            me.showSynchTip = !(hidetip && parseInt(hidetip) == 1);
            me.needShowSynchTip = false;
            var _temp_array = [me.cmbFontName, me.cmbFontSize, me.btnAlignLeft, me.btnAlignCenter, me.btnAlignRight, me.btnAlignJust, me.btnAlignTop, me.btnAlignMiddle, me.btnAlignBottom, me.btnHorizontalAlign, me.btnVerticalAlign, me.btnInsertImage, me.btnInsertText, me.btnInsertShape, me.btnIncFontSize, me.btnDecFontSize, me.btnBold, me.btnItalic, me.btnUnderline, me.btnTextColor, me.btnBackColor, me.btnInsertHyperlink, me.btnBorders, me.btnTextOrient, me.btnPercentStyle, me.btnCurrencyStyle, me.btnColorSchemas, me.btnSettings, me.btnInsertFormula, me.btnDecDecimal, me.btnIncDecimal, me.btnNumberFormat, me.btnWrap, me.btnInsertChart, me.btnMerge, me.btnAddCell, me.btnDeleteCell, me.btnShowMode, me.btnPrint, me.btnAutofilter, me.btnSortUp, me.btnSortDown, me.btnTableTemplate, me.btnSetAutofilter, me.btnClearAutofilter, me.btnSave, me.btnClearStyle, me.btnCopyStyle, me.btnCopy, me.btnPaste];
            _.each(_temp_array, function (cmp) {
                if (cmp && _.isFunction(cmp.setDisabled)) {
                    cmp.setDisabled(true);
                }
            });
            return this;
        },
        lockToolbar: function (causes, lock, opts) { ! opts && (opts = {});
            var controls = opts.array || this.lockControls;
            opts.merge && (controls = _.union(this.lockControls, controls));
            function doLock(cmp, cause) {
                if (_.contains(cmp.options.lock, cause)) {
                    var index = cmp.keepState.indexOf(cause);
                    if (lock) {
                        if (index < 0) {
                            cmp.keepState.push(cause);
                        }
                    } else {
                        if (! (index < 0)) {
                            cmp.keepState.splice(index, 1);
                        }
                    }
                }
            }
            _.each(controls, function (item) {
                if (_.isFunction(item.setDisabled)) { ! item.keepState && (item.keepState = []);
                    if (opts.clear && opts.clear.length > 0 && item.keepState.length > 0) {
                        item.keepState = _.difference(item.keepState, opts.clear);
                    }
                    _.isArray(causes) ? _.each(causes, function (c) {
                        doLock(item, c);
                    }) : doLock(item, causes);
                    if (! (item.keepState.length > 0)) {
                        item.isDisabled() && item.setDisabled(false);
                    } else { ! item.isDisabled() && item.setDisabled(true);
                    }
                }
            });
        },
        render: function (isEditDiagram) {
            var me = this,
            el = $(this.el);
            this.trigger("render:before", this);
            el.html(this.template({
                isEditDiagram: isEditDiagram,
                isCompactView: this.isCompactView
            }));
            me.rendererComponents(isEditDiagram ? "diagram" : this.isCompactView ? "short" : "full");
            this.trigger("render:after", this);
            return this;
        },
        rendererComponents: function (mode) {
            var replacePlacholder = function (id, cmp) {
                var placeholderEl = $(id),
                placeholderDom = placeholderEl.get(0);
                if (placeholderDom) {
                    if (cmp.rendered) {
                        cmp.el = document.getElementById(cmp.id);
                        placeholderDom.appendChild(document.getElementById(cmp.id));
                    } else {
                        cmp.render(placeholderEl);
                    }
                }
            };
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-field-fontname", this.cmbFontName);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-field-fontsize", this.cmbFontSize);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-newdocument", this.btnNewDocument);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-opendocument", this.btnOpenDocument);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-print", this.btnPrint);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-save", this.btnSave);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-undo", this.btnUndo);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-redo", this.btnRedo);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-copy", this.btnCopy);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-paste", this.btnPaste);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-incfont", this.btnIncFontSize);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-decfont", this.btnDecFontSize);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-bold", this.btnBold);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-italic", this.btnItalic);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-underline", this.btnUnderline);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-fontcolor", this.btnTextColor);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-fillparag", this.btnBackColor);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-borders", this.btnBorders);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-align-left", this.btnAlignLeft);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-align-center", this.btnAlignCenter);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-align-right", this.btnAlignRight);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-align-just", this.btnAlignJust);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-merge", this.btnMerge);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-top", this.btnAlignTop);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-middle", this.btnAlignMiddle);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-bottom", this.btnAlignBottom);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-wrap", this.btnWrap);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-text-orient", this.btnTextOrient);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-insertimage", this.btnInsertImage);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-inserthyperlink", this.btnInsertHyperlink);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-insertshape", this.btnInsertShape);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-text", this.btnInsertText);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-sortdesc", this.btnSortDown);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-sortasc", this.btnSortUp);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-setfilter", this.btnSetAutofilter);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-clear-filter", this.btnClearAutofilter);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-table-tpl", this.btnTableTemplate);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-format", this.btnNumberFormat);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-percents", this.btnPercentStyle);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-currency", this.btnCurrencyStyle);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-digit-dec", this.btnDecDecimal);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-digit-inc", this.btnIncDecimal);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-formula", this.btnInsertFormula);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-clear", this.btnClearStyle);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-copystyle", this.btnCopyStyle);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-cell-ins", this.btnAddCell);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-cell-del", this.btnDeleteCell);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-colorschemas", this.btnColorSchemas);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-hidebars", this.btnShowMode);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-settings", this.btnSettings);
            replacePlacholder("#id-toolbar-" + mode + "-placeholder-btn-insertchart", this.btnInsertChart);
            replacePlacholder("#id-toolbar-diagram-placeholder-btn-chart", this.btnEditChart);
            replacePlacholder("#id-toolbar-short-placeholder-btn-halign", this.btnHorizontalAlign);
            replacePlacholder("#id-toolbar-short-placeholder-btn-valign", this.btnVerticalAlign);
            replacePlacholder("#id-toolbar-short-placeholder-btn-filter", this.btnAutofilter);
            replacePlacholder("#id-toolbar-full-placeholder-field-styles", this.listStyles);
        },
        setApi: function (api) {
            this.api = api;
            if (!this.mode.isEditDiagram) {
                this.api.asc_registerCallback("asc_onCollaborativeChanges", _.bind(this.onApiCollaborativeChanges, this));
                this.api.asc_registerCallback("asc_onSendThemeColorSchemes", _.bind(this.onApiSendThemeColorSchemes, this));
                this.api.asc_registerCallback("asc_onAuthParticipantsChanged", _.bind(this.onApiUsersChanged, this));
                this.api.asc_registerCallback("asc_onParticipantsChanged", _.bind(this.onApiUsersChanged, this));
            }
            return this;
        },
        setMode: function (mode) {
            if (mode.isDisconnected) {
                this.lockToolbar(SSE.enumLock.lostConnect, true);
                this.lockToolbar(SSE.enumLock.lostConnect, true, {
                    array: [this.btnEditChart, this.btnUndo, this.btnRedo, this.btnOpenDocument, this.btnNewDocument, this.btnSave]
                });
            } else {
                this.mode = mode;
                if (!mode.nativeApp) {
                    var nativeBtnGroup = $(".toolbar-group-native");
                    if (nativeBtnGroup) {
                        nativeBtnGroup.hide();
                    }
                }
                if (mode.isDesktopApp) {
                    $(".toolbar-group-native").hide();
                    this.mnuitemHideTitleBar.hide();
                }
            }
        },
        onApiSendThemeColorSchemes: function (schemas) {
            var me = this;
            this.mnuColorSchema = this.btnColorSchemas.menu;
            if (this.mnuColorSchema && this.mnuColorSchema.items.length > 0) {
                _.each(this.mnuColorSchema.items, function (item) {
                    item.remove();
                });
            }
            if (this.mnuColorSchema == null) {
                this.mnuColorSchema = new Common.UI.Menu({
                    maxHeight: 600,
                    restoreHeight: 600
                }).on("render:after", function (mnu) {
                    this.scroller = new Common.UI.Scroller({
                        el: $(this.el).find(".dropdown-menu "),
                        useKeyboard: this.enableKeyEvents && !this.handleSelect,
                        minScrollbarLength: 40
                    });
                });
            }
            this.mnuColorSchema.items = [];
            var itemTemplate = _.template(['<a id="<%= id %>" class="<%= options.cls %>" tabindex="-1" type="menuitem">', '<span class="colors">', "<% _.each(options.colors, function(color) { %>", '<span class="color" style="background: <%= color %>;"></span>', "<% }) %>", "</span>", '<span class="text"><%= caption %></span>', "</a>"].join(""));
            _.each(schemas, function (schema, index) {
                var colors = schema.get_colors();
                var schemecolors = [];
                for (var j = 2; j < 7; j++) {
                    var clr = "#" + Common.Utils.ThemeColor.getHexColor(colors[j].get_r(), colors[j].get_g(), colors[j].get_b());
                    schemecolors.push(clr);
                }
                if (index == 21) {
                    this.mnuColorSchema.addItem({
                        caption: "--"
                    });
                } else {
                    this.mnuColorSchema.addItem({
                        template: itemTemplate,
                        cls: "color-schemas-menu",
                        colors: schemecolors,
                        caption: (index < 21) ? (me.SchemeNames[index] || schema.get_name()) : schema.get_name(),
                        value: index
                    });
                }
            },
            this);
        },
        onApiCollaborativeChanges: function () {
            if (this._state.hasCollaborativeChanges) {
                return;
            }
            if (!this.btnSave.rendered) {
                this.needShowSynchTip = true;
                return;
            }
            this._state.hasCollaborativeChanges = true;
            var iconEl = $(".btn-icon", this.btnSave.cmpEl);
            iconEl.removeClass(this.btnSaveCls);
            iconEl.addClass("btn-synch");
            if (this.showSynchTip) {
                this.btnSave.updateHint("");
                if (this.synchTooltip === undefined) {
                    this.createSynchTip();
                }
                this.synchTooltip.show();
            } else {
                this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey("Ctrl+S"));
            }
            this.btnSave.setDisabled(false);
        },
        createSynchTip: function () {
            this.synchTooltip = new Common.UI.SynchronizeTip({
                target: $("#id-toolbar-btn-save")
            });
            this.synchTooltip.on("dontshowclick", function () {
                this.showSynchTip = false;
                this.synchTooltip.hide();
                this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey("Ctrl+S"));
                window.localStorage.setItem("sse-hide-synch", 1);
            },
            this);
            this.synchTooltip.on("closeclick", function () {
                this.synchTooltip.hide();
                this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey("Ctrl+S"));
            },
            this);
        },
        synchronizeChanges: function () {
            if (this.btnSave.rendered) {
                var iconEl = $(".btn-icon", this.btnSave.cmpEl);
                if (iconEl.hasClass("btn-synch")) {
                    iconEl.removeClass("btn-synch");
                    iconEl.addClass(this.btnSaveCls);
                    if (this.synchTooltip) {
                        this.synchTooltip.hide();
                    }
                    this.btnSave.updateHint(this.btnSaveTip);
                    this.btnSave.setDisabled(true);
                    this._state.hasCollaborativeChanges = false;
                }
            }
        },
        onApiUsersChanged: function (users) {
            var length = _.size(users);
            var cls = (length > 1) ? "btn-save-coauth" : "btn-save";
            if (cls !== this.btnSaveCls && this.btnSave.rendered) {
                this.btnSaveTip = ((length > 1) ? this.tipSaveCoauth : this.tipSave) + Common.Utils.String.platformKey("Ctrl+S");
                var iconEl = $(".btn-icon", this.btnSave.cmpEl);
                if (!iconEl.hasClass("btn-synch")) {
                    iconEl.removeClass(this.btnSaveCls);
                    iconEl.addClass(cls);
                    this.btnSave.updateHint(this.btnSaveTip);
                }
                this.btnSaveCls = cls;
            }
        },
        textBold: "Bold",
        textItalic: "Italic",
        textUnderline: "Underline",
        tipFontName: "Font Name",
        tipFontSize: "Font Size",
        tipCellStyle: "Cell Style",
        tipCopy: "Copy",
        tipPaste: "Paste",
        tipUndo: "Undo",
        tipRedo: "Redo",
        tipPrint: "Print",
        tipSave: "Save",
        tipFontColor: "Font color",
        tipPrColor: "Background color",
        tipClearStyle: "Clear",
        tipCopyStyle: "Copy Style",
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
        txtCustom: "Custom",
        txtCurrency: "Currency",
        txtDollar: "$ Dollar",
        txtEuro: "€ Euro",
        txtRouble: "р. Rouble",
        txtPound: "£ Pound",
        txtYen: "¥ Yen",
        txtAccounting: "Accounting",
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
        textDiagDownBorder: "Diagonal Down Border",
        textDiagUpBorder: "Diagonal Up Border",
        tipWrap: "Wrap Text",
        txtClearAll: "All",
        txtClearText: "Text",
        txtClearFormat: "Format",
        txtClearFormula: "Formula",
        txtClearHyper: "Hyperlink",
        txtClearComments: "Comments",
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
        tipDigStyleAccounting: "Accounting Style",
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
        tipInsertChart: "Insert Chart",
        tipEditChart: "Edit Chart",
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
        textFreezePanes: "Freeze Panes",
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
        txtScheme21: "Verve",
        txtClearFilter: "Clear Filter",
        tipSaveCoauth: "Save your changes for the other users to see them."
    },
    SSE.Views.Toolbar || {}));
});