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
 define(["text!documenteditor/main/app/template/ParagraphSettingsAdvanced.template", "common/main/lib/view/AdvancedSettingsWindow", "common/main/lib/component/MetricSpinner", "common/main/lib/component/CheckBox", "common/main/lib/component/RadioBox", "common/main/lib/component/ThemeColorPalette", "common/main/lib/component/ColorButton", "common/main/lib/component/ListView", "common/main/lib/component/TableStyler"], function (contentTemplate) {
    DE.Views.ParagraphSettingsAdvanced = Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            contentWidth: 325,
            height: 390,
            toggleGroup: "paragraph-adv-settings-group"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle,
                items: [{
                    panelId: "id-adv-paragraph-indents",
                    panelCaption: this.strParagraphIndents
                },
                {
                    panelId: "id-adv-paragraph-borders",
                    panelCaption: this.strBorders
                },
                {
                    panelId: "id-adv-paragraph-font",
                    panelCaption: this.strParagraphFont
                },
                {
                    panelId: "id-adv-paragraph-tabs",
                    panelCaption: this.strTabs
                },
                {
                    panelId: "id-adv-paragraph-margins",
                    panelCaption: this.strMargins
                }],
                contentTemplate: _.template(contentTemplate)({
                    scope: this
                })
            },
            options);
            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
            this.Borders = {};
            this.BorderSize = {
                ptValue: 0,
                pxValue: 0
            };
            this.paragraphShade = "transparent";
            this._changedProps = null;
            this.ChangedBorders = undefined;
            this.checkGroup = 0;
            this._noApply = true;
            this._tabListChanged = false;
            this.Margins = undefined;
            this.spinners = [];
            this.tableStylerRows = this.options.tableStylerRows;
            this.tableStylerColumns = this.options.tableStylerColumns;
            this.borderProps = this.options.borderProps;
            this.api = this.options.api;
            this._originalProps = new CParagraphProp(this.options.paragraphProps);
            this.isChart = this.options.isChart;
        },
        render: function () {
            Common.Views.AdvancedSettingsWindow.prototype.render.call(this);
            var me = this;
            this.numFirstLine = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-first-line"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numFirstLine.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                        this._changedProps.put_Ind(new CParagraphInd());
                    }
                    this._changedProps.get_Ind().put_FirstLine(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.numFirstLine);
            this.numIndentsLeft = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-indent-left"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numIndentsLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                        this._changedProps.put_Ind(new CParagraphInd());
                    }
                    this._changedProps.get_Ind().put_Left(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.numIndentsLeft);
            this.numIndentsRight = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-indent-right"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numIndentsRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                        this._changedProps.put_Ind(new CParagraphInd());
                    }
                    this._changedProps.get_Ind().put_Right(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.numIndentsRight);
            this.chBreakBefore = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-break-before"),
                labelText: this.strBreakBefore
            });
            this.chBreakBefore.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_PageBreakBefore(field.getValue() == "checked");
                }
            },
            this));
            this.chKeepLines = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-keep-lines"),
                labelText: this.strKeepLines
            });
            this.chKeepLines.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_KeepLines(field.getValue() == "checked");
                }
            },
            this));
            this.chOrphan = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-orphan"),
                labelText: this.strOrphan
            });
            this.chOrphan.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_WidowControl(field.getValue() == "checked");
                }
            },
            this));
            this.chKeepNext = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-keep-next"),
                labelText: this.strKeepNext
            });
            this.chKeepNext.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_KeepNext(field.getValue() == "checked");
                }
            },
            this));
            this.cmbBorderSize = new Common.UI.ComboBorderSize({
                el: $("#paragraphadv-combo-border-size"),
                style: "width: 93px;"
            });
            var rec = this.cmbBorderSize.store.at(2);
            this.BorderSize = {
                ptValue: rec.get("value"),
                pxValue: rec.get("pxValue")
            };
            this.cmbBorderSize.setValue(this.BorderSize.ptValue);
            this.cmbBorderSize.on("selected", _.bind(this.onBorderSizeSelect, this));
            this.btnBorderColor = new Common.UI.ColorButton({
                style: "width:45px;",
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="paragraphadv-border-color-menu" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="paragraphadv-border-color-new" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            });
            this.btnBorderColor.on("render:after", function (btn) {
                me.colorsBorder = new Common.UI.ThemeColorPalette({
                    el: $("#paragraphadv-border-color-menu"),
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
                me.colorsBorder.on("select", _.bind(me.onColorsBorderSelect, me));
            });
            this.btnBorderColor.render($("#paragraphadv-border-color-btn"));
            this.btnBorderColor.setColor("000000");
            $("#paragraphadv-border-color-new").on("click", _.bind(this.addNewColor, this, this.colorsBorder, this.btnBorderColor));
            this.BordersImage = new Common.UI.TableStyler({
                el: $("#id-deparagraphstyler"),
                width: 200,
                height: 170,
                rows: this.tableStylerRows,
                columns: this.tableStylerColumns,
                spacingMode: false
            });
            var _arrBorderPresets = [["lrtb", "btn-borders-large btn-adv-paragraph-outer", "paragraphadv-button-border-outer", this.tipOuter], ["lrtbm", "btn-borders-large btn-adv-paragraph-all", "paragraphadv-button-border-all", this.tipAll], ["", "btn-borders-large btn-adv-paragraph-none", "paragraphadv-button-border-none", this.tipNone], ["l", "btn-borders-large btn-adv-paragraph-left", "paragraphadv-button-border-left", this.tipLeft], ["r", "btn-borders-large btn-adv-paragraph-right", "paragraphadv-button-border-right", this.tipRight], ["t", "btn-borders-large btn-adv-paragraph-top", "paragraphadv-button-border-top", this.tipTop], ["m", "btn-borders-large btn-adv-paragraph-inner-hor", "paragraphadv-button-border-inner-hor", this.tipInner], ["b", "btn-borders-large btn-adv-paragraph-bottom", "paragraphadv-button-border-bottom", this.tipBottom]];
            this._btnsBorderPosition = [];
            _.each(_arrBorderPresets, function (item, index, list) {
                var _btn = new Common.UI.Button({
                    style: "margin-left: 5px; margin-bottom: 4px;",
                    cls: "btn-options large",
                    iconCls: item[1],
                    strId: item[0],
                    hint: item[3]
                });
                _btn.render($("#" + item[2]));
                _btn.on("click", _.bind(this._ApplyBorderPreset, this));
                this._btnsBorderPosition.push(_btn);
            },
            this);
            this.btnBackColor = new Common.UI.ColorButton({
                style: "width:45px;",
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="paragraphadv-back-color-menu" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="paragraphadv-back-color-new" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            });
            this.btnBackColor.on("render:after", function (btn) {
                me.colorsBack = new Common.UI.ThemeColorPalette({
                    el: $("#paragraphadv-back-color-menu"),
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
                me.colorsBack.on("select", _.bind(me.onColorsBackSelect, me));
            });
            this.btnBackColor.render($("#paragraphadv-back-color-btn"));
            $("#paragraphadv-back-color-new").on("click", _.bind(this.addNewColor, this, this.colorsBack, this.btnBackColor));
            this.chStrike = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-strike"),
                labelText: this.strStrike
            });
            this.chStrike.on("change", _.bind(this.onStrikeChange, this));
            this.chDoubleStrike = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-double-strike"),
                labelText: this.strDoubleStrike
            });
            this.chDoubleStrike.on("change", _.bind(this.onDoubleStrikeChange, this));
            this.chSuperscript = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-superscript"),
                labelText: this.strSuperscript
            });
            this.chSuperscript.on("change", _.bind(this.onSuperscriptChange, this));
            this.chSubscript = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-subscript"),
                labelText: this.strSubscript
            });
            this.chSubscript.on("change", _.bind(this.onSubscriptChange, this));
            this.chSmallCaps = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-small-caps"),
                labelText: this.strSmallCaps
            });
            this.chSmallCaps.on("change", _.bind(this.onSmallCapsChange, this));
            this.chAllCaps = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-all-caps"),
                labelText: this.strAllCaps
            });
            this.chAllCaps.on("change", _.bind(this.onAllCapsChange, this));
            this.numSpacing = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-spacing"),
                step: 0.01,
                width: 100,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numSpacing.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_TextSpacing(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
                if (this.api && !this._noApply) {
                    var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                    properties.put_TextSpacing(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                }
            },
            this));
            this.spinners.push(this.numSpacing);
            this.numPosition = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-position"),
                step: 0.01,
                width: 100,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numPosition.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_Position(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
                if (this.api && !this._noApply) {
                    var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                    properties.put_Position(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                }
            },
            this));
            this.spinners.push(this.numPosition);
            this.numTab = new Common.UI.MetricSpinner({
                el: $("#paraadv-spin-tab"),
                step: 0.1,
                width: 180,
                defaultUnit: "cm",
                value: "1.25 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spinners.push(this.numTab);
            this.numDefaultTab = new Common.UI.MetricSpinner({
                el: $("#paraadv-spin-default-tab"),
                step: 0.1,
                width: 107,
                defaultUnit: "cm",
                value: "1.25 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.numDefaultTab.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_DefaultTab(parseFloat(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()).toFixed(1)));
                }
            },
            this));
            this.spinners.push(this.numDefaultTab);
            this.tabList = new Common.UI.ListView({
                el: $("#paraadv-list-tabs"),
                emptyText: this.noTabs,
                store: new Common.UI.DataViewStore()
            });
            this.tabList.store.comparator = function (rec) {
                return rec.get("tabPos");
            };
            this.tabList.on("item:select", _.bind(this.onSelectTab, this));
            var storechanged = function () {
                if (!me._noApply) {
                    me._tabListChanged = true;
                }
            };
            this.listenTo(this.tabList.store, "add", storechanged);
            this.listenTo(this.tabList.store, "remove", storechanged);
            this.listenTo(this.tabList.store, "reset", storechanged);
            this.radioLeft = new Common.UI.RadioBox({
                el: $("#paragraphadv-radio-left"),
                labelText: this.textTabLeft,
                name: "asc-radio-tab",
                checked: true
            });
            this.radioCenter = new Common.UI.RadioBox({
                el: $("#paragraphadv-radio-center"),
                labelText: this.textTabCenter,
                name: "asc-radio-tab"
            });
            this.radioRight = new Common.UI.RadioBox({
                el: $("#paragraphadv-radio-right"),
                labelText: this.textTabRight,
                name: "asc-radio-tab"
            });
            this.btnAddTab = new Common.UI.Button({
                el: $("#paraadv-button-add-tab")
            });
            this.btnAddTab.on("click", _.bind(this.addTab, this));
            this.btnRemoveTab = new Common.UI.Button({
                el: $("#paraadv-button-remove-tab")
            });
            this.btnRemoveTab.on("click", _.bind(this.removeTab, this));
            this.btnRemoveAll = new Common.UI.Button({
                el: $("#paraadv-button-remove-all")
            });
            this.btnRemoveAll.on("click", _.bind(this.removeAllTabs, this));
            this.spnMarginTop = new Common.UI.MetricSpinner({
                el: $("#paraadv-number-margin-top"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnMarginTop.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (!this._noApply) {
                    if (this.Margins === undefined) {
                        this.Margins = {};
                    }
                    this.Margins.Top = Common.Utils.Metric.fnRecalcToMM(field.getNumberValue());
                }
            },
            this));
            this.spinners.push(this.spnMarginTop);
            this.spnMarginBottom = new Common.UI.MetricSpinner({
                el: $("#paraadv-number-margin-bottom"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnMarginBottom.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (!this._noApply) {
                    if (this.Margins === undefined) {
                        this.Margins = {};
                    }
                    this.Margins.Bottom = Common.Utils.Metric.fnRecalcToMM(field.getNumberValue());
                }
            },
            this));
            this.spinners.push(this.spnMarginBottom);
            this.spnMarginLeft = new Common.UI.MetricSpinner({
                el: $("#paraadv-number-margin-left"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnMarginLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (!this._noApply) {
                    if (this.Margins === undefined) {
                        this.Margins = {};
                    }
                    this.Margins.Left = Common.Utils.Metric.fnRecalcToMM(field.getNumberValue());
                }
            },
            this));
            this.spinners.push(this.spnMarginLeft);
            this.spnMarginRight = new Common.UI.MetricSpinner({
                el: $("#paraadv-number-margin-right"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnMarginRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (!this._noApply) {
                    if (this.Margins === undefined) {
                        this.Margins = {};
                    }
                    this.Margins.Right = Common.Utils.Metric.fnRecalcToMM(field.getNumberValue());
                }
            },
            this));
            this.spinners.push(this.spnMarginRight);
            this.TextOnlySettings = $(".text-only");
            this.afterRender();
        },
        getSettings: function () {
            if (this.ChangedBorders === null) {
                this._changedProps.put_Borders(this.Borders);
            } else {
                if (this.ChangedBorders !== undefined) {
                    this._changedProps.put_Borders(this.ChangedBorders);
                }
            }
            if (this.Margins) {
                var borders = this._changedProps.get_Borders();
                if (borders === undefined || borders === null) {
                    this._changedProps.put_Borders(new CParagraphBorders());
                    borders = this._changedProps.get_Borders();
                }
                if (this.Margins.Left !== undefined) {
                    if (borders.get_Left() === undefined || borders.get_Left() === null) {
                        borders.put_Left(new CBorder(this.Borders.get_Left()));
                    }
                    borders.get_Left().put_Space(this.Margins.Left);
                }
                if (this.Margins.Top !== undefined) {
                    if (borders.get_Top() === undefined || borders.get_Top() === null) {
                        borders.put_Top(new CBorder(this.Borders.get_Top()));
                    }
                    borders.get_Top().put_Space(this.Margins.Top);
                }
                if (this.Margins.Right !== undefined) {
                    if (borders.get_Right() === undefined || borders.get_Right() === null) {
                        borders.put_Right(new CBorder(this.Borders.get_Right()));
                    }
                    borders.get_Right().put_Space(this.Margins.Right);
                }
                if (this.Margins.Bottom !== undefined) {
                    if (borders.get_Bottom() === undefined || borders.get_Bottom() === null) {
                        borders.put_Bottom(new CBorder(this.Borders.get_Bottom()));
                    }
                    borders.get_Bottom().put_Space(this.Margins.Bottom);
                    if (borders.get_Between() === undefined || borders.get_Between() === null) {
                        borders.put_Between(new CBorder(this.Borders.get_Between()));
                    }
                    borders.get_Between().put_Space(this.Margins.Bottom);
                }
            }
            if (this._tabListChanged) {
                if (this._changedProps.get_Tabs() === null || this._changedProps.get_Tabs() === undefined) {
                    this._changedProps.put_Tabs(new CParagraphTabs());
                }
                this.tabList.store.each(function (item, index) {
                    var tab = new CParagraphTab(Common.Utils.Metric.fnRecalcToMM(item.get("tabPos")), item.get("tabAlign"));
                    this._changedProps.get_Tabs().add_Tab(tab);
                },
                this);
            }
            return {
                paragraphProps: this._changedProps,
                borderProps: {
                    borderSize: this.BorderSize,
                    borderColor: this.btnBorderColor.color
                }
            };
        },
        _setDefaults: function (props) {
            if (props) {
                this._originalProps = new CParagraphProp(props);
                this.hideTextOnlySettings(this.isChart);
                this.numFirstLine.setValue((props.get_Ind() !== null && props.get_Ind().get_FirstLine() !== null) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Ind().get_FirstLine()) : "", true);
                this.numIndentsLeft.setValue((props.get_Ind() !== null && props.get_Ind().get_Left() !== null) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Ind().get_Left()) : "", true);
                this.numIndentsRight.setValue((props.get_Ind() !== null && props.get_Ind().get_Right() !== null) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Ind().get_Right()) : "", true);
                this.chKeepLines.setValue((props.get_KeepLines() !== null && props.get_KeepLines() !== undefined) ? props.get_KeepLines() : "indeterminate", true);
                this.chBreakBefore.setValue((props.get_PageBreakBefore() !== null && props.get_PageBreakBefore() !== undefined) ? props.get_PageBreakBefore() : "indeterminate", true);
                this.chKeepNext.setValue((props.get_KeepNext() !== null && props.get_KeepNext() !== undefined) ? props.get_KeepNext() : "indeterminate", true);
                this.chOrphan.setValue((props.get_WidowControl() !== null && props.get_WidowControl() !== undefined) ? props.get_WidowControl() : "indeterminate", true);
                this.Borders = new CParagraphBorders(props.get_Borders());
                if (this.Borders) {
                    var brd = this.Borders.get_Left();
                    var val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.Utils.Metric.fnRecalcFromMM(brd.get_Space()) : "";
                    this.spnMarginLeft.setValue(val, true);
                    brd = this.Borders.get_Top();
                    val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.Utils.Metric.fnRecalcFromMM(brd.get_Space()) : "";
                    this.spnMarginTop.setValue(val, true);
                    brd = this.Borders.get_Right();
                    val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.Utils.Metric.fnRecalcFromMM(brd.get_Space()) : "";
                    this.spnMarginRight.setValue(val, true);
                    brd = this.Borders.get_Bottom();
                    val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.Utils.Metric.fnRecalcFromMM(brd.get_Space()) : "";
                    this.spnMarginBottom.setValue(val, true);
                }
                var shd = props.get_Shade();
                if (shd !== null && shd !== undefined && shd.get_Value() === shd_Clear) {
                    var color = shd.get_Color();
                    if (color) {
                        if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                            this.paragraphShade = {
                                color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                effectValue: color.get_value()
                            };
                        } else {
                            this.paragraphShade = Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                        }
                    } else {
                        this.paragraphShade = "transparent";
                    }
                } else {
                    this.paragraphShade = "transparent";
                }
                this.btnBackColor.setColor(this.paragraphShade);
                if (typeof(this.paragraphShade) == "object") {
                    var isselected = false;
                    for (var i = 0; i < 10; i++) {
                        if (Common.Utils.ThemeColor.ThemeValues[i] == this.paragraphShade.effectValue) {
                            this.colorsBack.select(this.paragraphShade, true);
                            isselected = true;
                            break;
                        }
                    }
                    if (!isselected) {
                        this.colorsBack.clearSelection();
                    }
                } else {
                    this.colorsBack.select(this.paragraphShade, true);
                }
                this._UpdateBorders();
                this._noApply = true;
                this.chStrike.setValue((props.get_Strikeout() !== null && props.get_Strikeout() !== undefined) ? props.get_Strikeout() : "indeterminate", true);
                this.chDoubleStrike.setValue((props.get_DStrikeout() !== null && props.get_DStrikeout() !== undefined) ? props.get_DStrikeout() : "indeterminate", true);
                this.chSubscript.setValue((props.get_Subscript() !== null && props.get_Subscript() !== undefined) ? props.get_Subscript() : "indeterminate", true);
                this.chSuperscript.setValue((props.get_Superscript() !== null && props.get_Superscript() !== undefined) ? props.get_Superscript() : "indeterminate", true);
                this.chSmallCaps.setValue((props.get_SmallCaps() !== null && props.get_SmallCaps() !== undefined) ? props.get_SmallCaps() : "indeterminate", true);
                this.chAllCaps.setValue((props.get_AllCaps() !== null && props.get_AllCaps() !== undefined) ? props.get_AllCaps() : "indeterminate", true);
                this.numSpacing.setValue((props.get_TextSpacing() !== null && props.get_TextSpacing() !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(props.get_TextSpacing()) : "", true);
                this.numPosition.setValue((props.get_Position() !== null && props.get_Position() !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Position()) : "", true);
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", this._originalProps);
                this.numDefaultTab.setValue((props.get_DefaultTab() !== null && props.get_DefaultTab() !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(parseFloat(props.get_DefaultTab().toFixed(1))) : "", true);
                var store = this.tabList.store;
                var tabs = props.get_Tabs();
                if (tabs) {
                    var arr = [];
                    var count = tabs.get_Count();
                    for (var i = 0; i < count; i++) {
                        var tab = tabs.get_Tab(i);
                        var pos = Common.Utils.Metric.fnRecalcFromMM(parseFloat(tab.get_Pos().toFixed(1)));
                        var rec = new Common.UI.DataViewModel();
                        rec.set({
                            tabPos: pos,
                            value: parseFloat(pos.toFixed(3)) + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()],
                            tabAlign: tab.get_Value()
                        });
                        arr.push(rec);
                    }
                    store.reset(arr, {
                        silent: false
                    });
                    this.tabList.selectByIndex(0);
                }
                this._noApply = false;
                this._changedProps = new CParagraphProp();
                this.ChangedBorders = undefined;
            }
        },
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    if (spinner.el.id == "paragraphadv-spin-spacing" || spinner.el.id == "paragraphadv-spin-position") {
                        spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.01 : 1);
                    } else {
                        spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                    }
                }
            }
        },
        updateThemeColors: function () {
            this.colorsBorder.updateColors(Common.Utils.ThemeColor.getEffectColors(), Common.Utils.ThemeColor.getStandartColors());
            this.colorsBack.updateColors(Common.Utils.ThemeColor.getEffectColors(), Common.Utils.ThemeColor.getStandartColors());
        },
        afterRender: function () {
            this.updateMetricUnit();
            this.updateThemeColors();
            this._setDefaults(this._originalProps);
            if (this.borderProps !== undefined) {
                this.btnBorderColor.setColor(this.borderProps.borderColor);
                this.BordersImage.setVirtualBorderColor((typeof(this.borderProps.borderColor) == "object") ? this.borderProps.borderColor.color : this.borderProps.borderColor);
                this.cmbBorderSize.setValue(this.borderProps.borderSize.ptValue);
                var rec = this.cmbBorderSize.getSelectedRecord();
                if (rec) {
                    this.onBorderSizeSelect(this.cmbBorderSize, rec);
                }
                this.colorsBorder.select(this.borderProps.borderColor, true);
            }
            for (var i = 0; i < this.BordersImage.rows; i++) {
                for (var j = 0; j < this.BordersImage.columns; j++) {
                    this.BordersImage.getCell(j, i).on("borderclick", function (ct, border, size, color) {
                        if (this.ChangedBorders === undefined) {
                            this.ChangedBorders = new CParagraphBorders();
                        }
                        this._UpdateCellBordersStyle(ct, border, size, color, this.Borders);
                    },
                    this);
                }
            }
            this.BordersImage.on("borderclick", function (ct, border, size, color) {
                if (this.ChangedBorders === undefined) {
                    this.ChangedBorders = new CParagraphBorders();
                }
                this._UpdateTableBordersStyle(ct, border, size, color, this.Borders);
            },
            this);
        },
        onStrikeChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 1) {
                this._changedProps.put_Strikeout(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 1;
                this.chDoubleStrike.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_DStrikeout(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_Strikeout(field.getValue() == "checked");
                properties.put_DStrikeout(this.chDoubleStrike.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onDoubleStrikeChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 1) {
                this._changedProps.put_DStrikeout(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 1;
                this.chStrike.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_Strikeout(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_DStrikeout(field.getValue() == "checked");
                properties.put_Strikeout(this.chStrike.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onSuperscriptChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 2) {
                this._changedProps.put_Superscript(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 2;
                this.chSubscript.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_Subscript(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_Superscript(field.getValue() == "checked");
                properties.put_Subscript(this.chSubscript.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onSubscriptChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 2) {
                this._changedProps.put_Subscript(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 2;
                this.chSuperscript.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_Superscript(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_Subscript(field.getValue() == "checked");
                properties.put_Superscript(this.chSuperscript.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onSmallCapsChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 3) {
                this._changedProps.put_SmallCaps(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 3;
                this.chAllCaps.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_AllCaps(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_SmallCaps(field.getValue() == "checked");
                properties.put_AllCaps(this.chAllCaps.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onAllCapsChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 3) {
                this._changedProps.put_AllCaps(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 3;
                this.chSmallCaps.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_SmallCaps(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_AllCaps(field.getValue() == "checked");
                properties.put_SmallCaps(this.chSmallCaps.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onBorderSizeSelect: function (combo, record) {
            this.BorderSize = {
                ptValue: record.value,
                pxValue: record.pxValue
            };
            this.BordersImage.setVirtualBorderSize(this.BorderSize.pxValue);
        },
        addNewColor: function (picker, btn) {
            picker.addNewColor((typeof(btn.color) == "object") ? btn.color.color : btn.color);
        },
        onColorsBorderSelect: function (picker, color) {
            this.btnBorderColor.setColor(color);
            this.BordersImage.setVirtualBorderColor((typeof(color) == "object") ? color.color : color);
        },
        onColorsBackSelect: function (picker, color) {
            this.btnBackColor.setColor(color);
            this.paragraphShade = color;
            if (this._changedProps) {
                if (this._changedProps.get_Shade() === undefined || this._changedProps.get_Shade() === null) {
                    this._changedProps.put_Shade(new CParagraphShd());
                }
                if (this.paragraphShade == "transparent") {
                    this._changedProps.get_Shade().put_Value(shd_Nil);
                } else {
                    this._changedProps.get_Shade().put_Value(shd_Clear);
                    this._changedProps.get_Shade().put_Color(Common.Utils.ThemeColor.getRgbColor(this.paragraphShade));
                }
            }
        },
        _ApplyBorderPreset: function (btn) {
            var border = btn.options.strId;
            this.ChangedBorders = null;
            this.Borders.put_Left(this._UpdateBorderStyle(this.Borders.get_Left(), (border.indexOf("l") > -1)));
            this.Borders.put_Top(this._UpdateBorderStyle(this.Borders.get_Top(), (border.indexOf("t") > -1)));
            this.Borders.put_Right(this._UpdateBorderStyle(this.Borders.get_Right(), (border.indexOf("r") > -1)));
            this.Borders.put_Bottom(this._UpdateBorderStyle(this.Borders.get_Bottom(), (border.indexOf("b") > -1)));
            this.Borders.put_Between(this._UpdateBorderStyle(this.Borders.get_Between(), (border.indexOf("m") > -1)));
            this._UpdateBorders();
        },
        _UpdateBorderStyle: function (border, visible) {
            if (null == border) {
                border = new CBorder();
            }
            if (visible && this.BorderSize.ptValue > 0) {
                var size = parseFloat(this.BorderSize.ptValue);
                border.put_Value(1);
                border.put_Size(size * 25.4 / 72);
                var color = Common.Utils.ThemeColor.getRgbColor(this.btnBorderColor.color);
                border.put_Color(color);
            } else {
                border.put_Color(new CAscColor());
                border.put_Value(0);
            }
            return border;
        },
        _UpdateCellBordersStyle: function (ct, border, size, color, destination) {
            var updateBorders = destination;
            if (ct.col == 0 && border.indexOf("l") > -1) {
                updateBorders.put_Left(this._UpdateBorderStyle(updateBorders.get_Left(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Left(new CBorder(updateBorders.get_Left()));
                }
            }
            if (ct.col == this.tableStylerColumns - 1 && border.indexOf("r") > -1) {
                updateBorders.put_Right(this._UpdateBorderStyle(updateBorders.get_Right(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Right(new CBorder(updateBorders.get_Right()));
                }
            }
            if (ct.row == 0 && border.indexOf("t") > -1) {
                updateBorders.put_Top(this._UpdateBorderStyle(updateBorders.get_Top(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Top(new CBorder(updateBorders.get_Top()));
                }
            }
            if (ct.row == this.tableStylerRows - 1 && border.indexOf("b") > -1) {
                updateBorders.put_Bottom(this._UpdateBorderStyle(updateBorders.get_Bottom(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Bottom(new CBorder(updateBorders.get_Bottom()));
                }
            }
            if (ct.row == 0 && border.indexOf("b") > -1 || ct.row == this.tableStylerRows - 1 && border.indexOf("t") > -1) {
                updateBorders.put_Between(this._UpdateBorderStyle(updateBorders.get_Between(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Between(new CBorder(updateBorders.get_Between()));
                }
            }
        },
        _UpdateTableBordersStyle: function (ct, border, size, color, destination) {
            var updateBorders = destination;
            if (border.indexOf("l") > -1) {
                updateBorders.put_Left(this._UpdateBorderStyle(updateBorders.get_Left(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Left(new CBorder(updateBorders.get_Left()));
                }
            }
            if (border.indexOf("t") > -1) {
                updateBorders.put_Top(this._UpdateBorderStyle(updateBorders.get_Top(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Top(new CBorder(updateBorders.get_Top()));
                }
            }
            if (border.indexOf("r") > -1) {
                updateBorders.put_Right(this._UpdateBorderStyle(updateBorders.get_Right(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Right(new CBorder(updateBorders.get_Right()));
                }
            }
            if (border.indexOf("b") > -1) {
                updateBorders.put_Bottom(this._UpdateBorderStyle(updateBorders.get_Bottom(), (size > 0)));
                if (this.ChangedBorders) {
                    this.ChangedBorders.put_Bottom(new CBorder(updateBorders.get_Bottom()));
                }
            }
        },
        _UpdateBorders: function () {
            var oldSize = this.BorderSize;
            var oldColor = this.btnBorderColor.color;
            this._UpdateBorder(this.Borders.get_Left(), "l");
            this._UpdateBorder(this.Borders.get_Top(), "t");
            this._UpdateBorder(this.Borders.get_Right(), "r");
            this._UpdateBorder(this.Borders.get_Bottom(), "b");
            if (this.Borders.get_Between() !== null) {
                for (var i = 0; i < this.BordersImage.columns; i++) {
                    this._UpdateCellBorder(this.Borders.get_Between(), "b", this.BordersImage.getCell(i, 0));
                    this._UpdateCellBorder(this.Borders.get_Between(), "t", this.BordersImage.getCell(i, 1));
                }
            }
            this.BordersImage.setVirtualBorderSize(oldSize.pxValue);
            this.BordersImage.setVirtualBorderColor((typeof(oldColor) == "object") ? oldColor.color : oldColor);
        },
        _UpdateCellBorder: function (BorderParam, borderName, cell) {
            if (null !== BorderParam && undefined !== BorderParam) {
                if (null !== BorderParam.get_Value() && null !== BorderParam.get_Size() && null !== BorderParam.get_Color() && 1 == BorderParam.get_Value()) {
                    cell.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                    cell.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                } else {
                    cell.setBordersSize(borderName, 0);
                }
            } else {
                cell.setBordersSize(borderName, 0);
            }
        },
        _UpdateBorder: function (BorderParam, borderName) {
            if (null !== BorderParam && undefined !== BorderParam) {
                if (null !== BorderParam.get_Value() && null !== BorderParam.get_Size() && null !== BorderParam.get_Color() && 1 == BorderParam.get_Value()) {
                    this.BordersImage.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                    this.BordersImage.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                } else {
                    this.BordersImage.setBordersSize(borderName, 0);
                }
            } else {
                this.BordersImage.setBordersSize(borderName, 0);
            }
        },
        _BorderPt2Px: function (value) {
            if (value == 0) {
                return 0;
            }
            if (value < 0.6) {
                return 0.5;
            }
            if (value <= 1) {
                return 1;
            }
            if (value <= 1.5) {
                return 2;
            }
            if (value <= 2.25) {
                return 3;
            }
            if (value <= 3) {
                return 4;
            }
            if (value <= 4.5) {
                return 5;
            }
            return 6;
        },
        addTab: function (btn, eOpts) {
            var val = this.numTab.getNumberValue();
            var align = this.radioLeft.getValue() ? 1 : (this.radioCenter.getValue() ? 3 : 2);
            var store = this.tabList.store;
            var rec = store.find(function (record) {
                return (Math.abs(record.get("tabPos") - val) < 0.001);
            });
            if (rec) {
                rec.set("tabAlign", align);
            } else {
                rec = new Common.UI.DataViewModel();
                rec.set({
                    tabPos: val,
                    value: val + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()],
                    tabAlign: align
                });
                store.add(rec);
            }
            this.tabList.selectRecord(rec);
            this.tabList.scrollToRecord(rec);
        },
        removeTab: function (btn, eOpts) {
            var rec = this.tabList.getSelectedRec();
            if (rec.length > 0) {
                var store = this.tabList.store;
                var idx = _.indexOf(store.models, rec[0]);
                store.remove(rec[0]);
                if (idx > store.length - 1) {
                    idx = store.length - 1;
                }
                if (store.length > 0) {
                    this.tabList.selectByIndex(idx);
                    this.tabList.scrollToRecord(store.at(idx));
                }
            }
        },
        removeAllTabs: function (btn, eOpts) {
            this.tabList.store.reset();
        },
        onSelectTab: function (lisvView, itemView, record) {
            var rawData = {},
            isViewSelect = _.isFunction(record.toJSON);
            if (isViewSelect) {
                if (record.get("selected")) {
                    rawData = record.toJSON();
                } else {
                    return;
                }
            } else {
                rawData = record;
            }
            this.numTab.setValue(rawData.tabPos);
            (rawData.tabAlign == 1) ? this.radioLeft.setValue(true) : ((rawData.tabAlign == 3) ? this.radioCenter.setValue(true) : this.radioRight.setValue(true));
        },
        hideTextOnlySettings: function (value) {
            this.TextOnlySettings.toggleClass("hidden", value == true);
            this.btnsCategory[1].setVisible(!value);
            this.btnsCategory[4].setVisible(!value);
        },
        textTitle: "Paragraph - Advanced Settings",
        strIndentsFirstLine: "First line",
        strIndentsLeftText: "Left",
        strIndentsRightText: "Right",
        strParagraphIndents: "Indents & Placement",
        strParagraphPosition: "Placement",
        strParagraphFont: "Font",
        strBreakBefore: "Page break before",
        strKeepLines: "Keep lines together",
        strBorders: "Borders & Fill",
        textBorderWidth: "Border Size",
        textBorderColor: "Border Color",
        textBackColor: "Background Color",
        textBorderDesc: "Click on diagramm or use buttons to select borders",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        txtNoBorders: "No borders",
        textNewColor: "Add New Custom Color",
        textEffects: "Effects",
        textCharacterSpacing: "Character Spacing",
        textSpacing: "Spacing",
        textPosition: "Position",
        strDoubleStrike: "Double strikethrough",
        strStrike: "Strikethrough",
        strSuperscript: "Superscript",
        strSubscript: "Subscript",
        strSmallCaps: "Small caps",
        strAllCaps: "All caps",
        textThemeColors: "Theme Colors",
        textStandartColors: "Standart Colors",
        strOrphan: "Orphan control",
        strKeepNext: "Keep with next",
        strTabs: "Tab",
        textSet: "Specify",
        textRemove: "Remove",
        textRemoveAll: "Remove All",
        textTabLeft: "Left",
        textTabRight: "Right",
        textTabCenter: "Center",
        textAlign: "Alignment",
        textTabPosition: "Tab Position",
        textDefault: "Default Tab",
        textTop: "Top",
        textLeft: "Left",
        textBottom: "Bottom",
        textRight: "Right",
        strMargins: "Margins",
        tipTop: "Set Top Border Only",
        tipLeft: "Set Left Border Only",
        tipBottom: "Set Bottom Border Only",
        tipRight: "Set Right Border Only",
        tipAll: "Set Outer Border and All Inner Lines",
        tipNone: "Set No Borders",
        tipInner: "Set Horizontal Inner Lines Only",
        tipOuter: "Set Outer Border Only",
        noTabs: "The specified tabs will appear in this field"
    },
    DE.Views.ParagraphSettingsAdvanced || {}));
});