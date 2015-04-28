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
 define(["text!documenteditor/main/app/template/ImageSettingsAdvanced.template", "common/main/lib/view/AdvancedSettingsWindow", "common/main/lib/component/ComboBox", "common/main/lib/component/MetricSpinner", "common/main/lib/component/CheckBox", "common/main/lib/component/RadioBox"], function (contentTemplate) {
    DE.Views.ImageSettingsAdvanced = Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            contentWidth: 340,
            height: 422,
            toggleGroup: "image-adv-settings-group",
            sizeOriginal: {
                width: 0,
                height: 0
            },
            sizeMax: {
                width: 55.88,
                height: 55.88
            },
            properties: null
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle,
                items: [{
                    panelId: "id-adv-image-width",
                    panelCaption: this.textSize
                },
                {
                    panelId: "id-adv-image-wrap",
                    panelCaption: this.textBtnWrap
                },
                {
                    panelId: "id-adv-image-position",
                    panelCaption: this.textPosition
                },
                {
                    panelId: "id-adv-image-shape",
                    panelCaption: this.textShape
                },
                {
                    panelId: "id-adv-image-margins",
                    panelCaption: this.strMargins
                }],
                contentTemplate: _.template(contentTemplate)({
                    scope: this
                })
            },
            options);
            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
            this.spinners = [];
            this._state = {
                HAlignType: c_oAscAlignH.Left,
                HAlignFrom: c_oAscRelativeFromH.Character,
                HPositionFrom: c_oAscRelativeFromH.Character,
                VAlignType: c_oAscAlignV.Top,
                VAlignFrom: c_oAscRelativeFromV.Line,
                VPositionFrom: c_oAscRelativeFromV.Line,
                spnXChanged: false,
                spnYChanged: false
            };
            this._objectType = c_oAscTypeSelectElement.Image;
            this.Margins = undefined;
            this._nRatio = 1;
            this._originalProps = this.options.imageProps;
            this._changedProps = null;
            this._changedShapeProps = null;
        },
        render: function () {
            Common.Views.AdvancedSettingsWindow.prototype.render.call(this);
            var me = this;
            this.spnWidth = new Common.UI.MetricSpinner({
                el: $("#image-advanced-spin-width"),
                step: 0.1,
                width: 80,
                defaultUnit: "cm",
                value: "3 cm",
                maxValue: 55.88,
                minValue: 0
            });
            this.spnWidth.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this.btnRatio.pressed) {
                    var w = field.getNumberValue();
                    var h = w / this._nRatio;
                    if (h > this.sizeMax.height) {
                        h = this.sizeMax.height;
                        w = h * this._nRatio;
                        this.spnWidth.setValue(w, true);
                    }
                    this.spnHeight.setValue(h, true);
                }
                if (this._changedProps) {
                    this._changedProps.put_Width(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this._changedProps.put_Height(Common.Utils.Metric.fnRecalcToMM(this.spnHeight.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnWidth);
            this.spnHeight = new Common.UI.MetricSpinner({
                el: $("#image-advanced-spin-height"),
                step: 0.1,
                width: 80,
                defaultUnit: "cm",
                value: "3 cm",
                maxValue: 55.88,
                minValue: 0
            });
            this.spnHeight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                var h = field.getNumberValue(),
                w = null;
                if (this.btnRatio.pressed) {
                    w = h * this._nRatio;
                    if (w > this.sizeMax.width) {
                        w = this.sizeMax.width;
                        h = w / this._nRatio;
                        this.spnHeight.setValue(h, true);
                    }
                    this.spnWidth.setValue(w, true);
                }
                if (this._changedProps) {
                    this._changedProps.put_Height(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this._changedProps.put_Width(Common.Utils.Metric.fnRecalcToMM(this.spnWidth.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnHeight);
            this.btnOriginalSize = new Common.UI.Button({
                el: $("#image-advanced-button-original-size")
            });
            this.btnOriginalSize.on("click", _.bind(function (btn, e) {
                this.spnWidth.setValue(this.sizeOriginal.width, true);
                this.spnHeight.setValue(this.sizeOriginal.height, true);
                this._nRatio = this.sizeOriginal.width / this.sizeOriginal.height;
                if (this._changedProps) {
                    this._changedProps.put_Height(Common.Utils.Metric.fnRecalcToMM(this.spnHeight.getNumberValue()));
                    this._changedProps.put_Width(Common.Utils.Metric.fnRecalcToMM(this.spnWidth.getNumberValue()));
                }
            },
            this));
            this.btnRatio = new Common.UI.Button({
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "advanced-btn-ratio",
                style: "margin-bottom: 1px;",
                enableToggle: true,
                hint: this.textKeepRatio
            });
            this.btnRatio.render($("#image-advanced-button-ratio"));
            this.btnRatio.on("click", _.bind(function (btn, e) {
                if (btn.pressed && this.spnHeight.getNumberValue() > 0) {
                    this._nRatio = this.spnWidth.getNumberValue() / this.spnHeight.getNumberValue();
                }
            },
            this));
            this.btnWrapInline = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-inline",
                posId: c_oAscWrapStyle2.Inline,
                hint: this.textWrapInlineTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapInline.render($("#image-advanced-button-wrap-inline"));
            this.btnWrapInline.on("click", _.bind(this.onBtnWrapClick, this));
            this.btnWrapSquare = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-square",
                posId: c_oAscWrapStyle2.Square,
                hint: this.textWrapSquareTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapSquare.render($("#image-advanced-button-wrap-square"));
            this.btnWrapSquare.on("click", _.bind(this.onBtnWrapClick, this));
            this.btnWrapTight = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-tight",
                posId: c_oAscWrapStyle2.Tight,
                hint: this.textWrapTightTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapTight.render($("#image-advanced-button-wrap-tight"));
            this.btnWrapTight.on("click", _.bind(this.onBtnWrapClick, this));
            this.btnWrapThrough = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-through",
                posId: c_oAscWrapStyle2.Through,
                hint: this.textWrapThroughTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapThrough.render($("#image-advanced-button-wrap-through"));
            this.btnWrapThrough.on("click", _.bind(this.onBtnWrapClick, this));
            this.btnWrapTopBottom = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-topbottom",
                posId: c_oAscWrapStyle2.TopAndBottom,
                hint: this.textWrapTopbottomTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapTopBottom.render($("#image-advanced-button-wrap-topbottom"));
            this.btnWrapTopBottom.on("click", _.bind(this.onBtnWrapClick, this));
            this.btnWrapBehind = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-behind",
                posId: c_oAscWrapStyle2.Behind,
                hint: this.textWrapBehindTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapBehind.render($("#image-advanced-button-wrap-behind"));
            this.btnWrapBehind.on("click", _.bind(this.onBtnWrapClick, this));
            this.btnWrapInFront = new Common.UI.Button({
                cls: "btn-options x-huge",
                iconCls: "icon-advanced-wrap btn-wrap-infront",
                posId: c_oAscWrapStyle2.InFront,
                hint: this.textWrapInFrontTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "imgAdvWrapGroup"
            });
            this.btnWrapInFront.render($("#image-advanced-button-wrap-infront"));
            this.btnWrapInFront.on("click", _.bind(this.onBtnWrapClick, this));
            this.spnTop = new Common.UI.MetricSpinner({
                el: $("#image-advanced-distance-top"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnTop.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                        this._changedProps.put_Paddings(new CPaddings());
                    }
                    this._changedProps.get_Paddings().put_Top(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnTop);
            this.spnBottom = new Common.UI.MetricSpinner({
                el: $("#image-advanced-distance-bottom"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnBottom.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                        this._changedProps.put_Paddings(new CPaddings());
                    }
                    this._changedProps.get_Paddings().put_Bottom(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnBottom);
            this.spnLeft = new Common.UI.MetricSpinner({
                el: $("#image-advanced-distance-left"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.32 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                        this._changedProps.put_Paddings(new CPaddings());
                    }
                    this._changedProps.get_Paddings().put_Left(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnLeft);
            this.spnRight = new Common.UI.MetricSpinner({
                el: $("#image-advanced-distance-right"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.32 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                        this._changedProps.put_Paddings(new CPaddings());
                    }
                    this._changedProps.get_Paddings().put_Right(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnRight);
            this.spnX = new Common.UI.MetricSpinner({
                el: $("#image-spin-x"),
                step: 0.1,
                width: 115,
                disabled: true,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.spnX.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                        this._changedProps.put_PositionH(new CImagePositionH());
                    }
                    this._changedProps.get_PositionH().put_UseAlign(false);
                    this._changedProps.get_PositionH().put_RelativeFrom(this._state.HPositionFrom);
                    this._changedProps.get_PositionH().put_Value(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this._state.spnXChanged = true;
                }
            },
            this));
            this.spinners.push(this.spnX);
            this.spnY = new Common.UI.MetricSpinner({
                el: $("#image-spin-y"),
                step: 0.1,
                width: 115,
                disabled: true,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.spnY.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                        this._changedProps.put_PositionV(new CImagePositionV());
                    }
                    this._changedProps.get_PositionV().put_UseAlign(false);
                    this._changedProps.get_PositionV().put_RelativeFrom(this._state.VPositionFrom);
                    this._changedProps.get_PositionV().put_Value(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this._state.spnYChanged = true;
                }
            },
            this));
            this.spinners.push(this.spnY);
            this._arrHAlign = [{
                displayValue: this.textLeft,
                value: c_oAscAlignH.Left
            },
            {
                displayValue: this.textCenter,
                value: c_oAscAlignH.Center
            },
            {
                displayValue: this.textRight,
                value: c_oAscAlignH.Right
            }];
            this.cmbHAlign = new Common.UI.ComboBox({
                el: $("#image-combo-halign"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrHAlign
            });
            this.cmbHAlign.setValue(this._state.HAlignType);
            this.cmbHAlign.on("selected", _.bind(this.onHAlignSelect, this));
            this._arrHRelative = [{
                displayValue: this.textCharacter,
                value: c_oAscRelativeFromH.Character
            },
            {
                displayValue: this.textColumn,
                value: c_oAscRelativeFromH.Column
            },
            {
                displayValue: this.textLeftMargin,
                value: c_oAscRelativeFromH.LeftMargin
            },
            {
                displayValue: this.textMargin,
                value: c_oAscRelativeFromH.Margin
            },
            {
                displayValue: this.textPage,
                value: c_oAscRelativeFromH.Page
            },
            {
                displayValue: this.textRightMargin,
                value: c_oAscRelativeFromH.RightMargin
            }];
            this.cmbHRelative = new Common.UI.ComboBox({
                el: $("#image-combo-hrelative"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrHRelative
            });
            this.cmbHRelative.setValue(this._state.HAlignFrom);
            this.cmbHRelative.on("selected", _.bind(this.onHRelativeSelect, this));
            this.cmbHPosition = new Common.UI.ComboBox({
                el: $("#image-combo-hposition"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrHRelative
            });
            this.cmbHPosition.setDisabled(true);
            this.cmbHPosition.setValue(this._state.HPositionFrom);
            this.cmbHPosition.on("selected", _.bind(this.onHPositionSelect, this));
            this._arrVAlign = [{
                displayValue: this.textTop,
                value: c_oAscAlignV.Top
            },
            {
                displayValue: this.textCenter,
                value: c_oAscAlignV.Center
            },
            {
                displayValue: this.textBottom,
                value: c_oAscAlignV.Bottom
            }];
            this.cmbVAlign = new Common.UI.ComboBox({
                el: $("#image-combo-valign"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrVAlign
            });
            this.cmbVAlign.setValue(this._state.VAlignType);
            this.cmbVAlign.on("selected", _.bind(this.onVAlignSelect, this));
            this._arrVRelative = [{
                displayValue: this.textLine,
                value: c_oAscRelativeFromV.Line
            },
            {
                displayValue: this.textMargin,
                value: c_oAscRelativeFromV.Margin
            },
            {
                displayValue: this.textBottomMargin,
                value: c_oAscRelativeFromV.BottomMargin
            },
            {
                displayValue: this.textParagraph,
                value: c_oAscRelativeFromV.Paragraph
            },
            {
                displayValue: this.textPage,
                value: c_oAscRelativeFromV.Page
            },
            {
                displayValue: this.textTopMargin,
                value: c_oAscRelativeFromV.TopMargin
            }];
            this.cmbVRelative = new Common.UI.ComboBox({
                el: $("#image-combo-vrelative"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrVRelative
            });
            this.cmbVRelative.setValue(this._state.VAlignFrom);
            this.cmbVRelative.on("selected", _.bind(this.onVRelativeSelect, this));
            this.cmbVPosition = new Common.UI.ComboBox({
                el: $("#image-combo-vposition"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrVRelative
            });
            this.cmbVPosition.setDisabled(true);
            this.cmbVPosition.setValue(this._state.VPositionFrom);
            this.cmbVPosition.on("selected", _.bind(this.onVPositionSelect, this));
            this.radioHAlign = new Common.UI.RadioBox({
                el: $("#image-radio-halign"),
                name: "asc-radio-horizontal",
                checked: true
            });
            this.radioHAlign.on("change", _.bind(this.onRadioHAlignChange, this));
            this.radioHPosition = new Common.UI.RadioBox({
                el: $("#image-radio-hposition"),
                name: "asc-radio-horizontal"
            });
            this.radioHPosition.on("change", _.bind(this.onRadioHPositionChange, this));
            this.radioVAlign = new Common.UI.RadioBox({
                el: $("#image-radio-valign"),
                name: "asc-radio-vertical",
                checked: true
            });
            this.radioVAlign.on("change", _.bind(this.onRadioVAlignChange, this));
            this.radioVPosition = new Common.UI.RadioBox({
                el: $("#image-radio-vposition"),
                name: "asc-radio-vertical"
            });
            this.radioVPosition.on("change", _.bind(this.onRadioVPositionChange, this));
            this.chMove = new Common.UI.CheckBox({
                el: $("#image-checkbox-move"),
                labelText: this.textMove
            });
            this.chMove.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    var value = this._arrVRelative[(field.getValue() == "checked") ? 3 : 4].value;
                    if (this.cmbVRelative.isDisabled()) {
                        this.cmbVPosition.setValue(value);
                        var rec = this.cmbVPosition.getSelectedRecord();
                        if (rec) {
                            this.onVPositionSelect(this.cmbVPosition, rec);
                        }
                    } else {
                        this.cmbVRelative.setValue(value);
                        var rec = this.cmbVRelative.getSelectedRecord();
                        if (rec) {
                            this.onVRelativeSelect(this.cmbVRelative, rec);
                        }
                    }
                }
            },
            this));
            this.chOverlap = new Common.UI.CheckBox({
                el: $("#image-checkbox-overlap"),
                labelText: this.textOverlap
            });
            this.chOverlap.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_AllowOverlap(field.getValue() == "checked");
                }
            },
            this));
            this.spnMarginTop = new Common.UI.MetricSpinner({
                el: $("#image-margin-top"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnMarginTop.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this.Margins === undefined) {
                        this.Margins = new CPaddings();
                    }
                    this.Margins.put_Top(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnMarginTop);
            this.spnMarginBottom = new Common.UI.MetricSpinner({
                el: $("#image-margin-bottom"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnMarginBottom.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this.Margins === undefined) {
                        this.Margins = new CPaddings();
                    }
                    this.Margins.put_Bottom(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnMarginBottom);
            this.spnMarginLeft = new Common.UI.MetricSpinner({
                el: $("#image-margin-left"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnMarginLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this.Margins === undefined) {
                        this.Margins = new CPaddings();
                    }
                    this.Margins.put_Left(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnMarginLeft);
            this.spnMarginRight = new Common.UI.MetricSpinner({
                el: $("#image-margin-right"),
                step: 0.1,
                width: 100,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnMarginRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this.Margins === undefined) {
                        this.Margins = new CPaddings();
                    }
                    this.Margins.put_Right(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnMarginRight);
            this._arrCapType = [{
                displayValue: this.textFlat,
                value: c_oAscLineCapType.Flat
            },
            {
                displayValue: this.textRound,
                value: c_oAscLineCapType.Round
            },
            {
                displayValue: this.textSquare,
                value: c_oAscLineCapType.Square
            }];
            this.cmbCapType = new Common.UI.ComboBox({
                el: $("#shape-advanced-cap-type"),
                cls: "input-group-nr",
                menuStyle: "min-width: 100px;",
                editable: false,
                data: this._arrCapType
            });
            this.cmbCapType.setValue(c_oAscLineCapType.Flat);
            this.cmbCapType.on("selected", _.bind(function (combo, record) {
                if (this._changedShapeProps) {
                    if (this._changedShapeProps.get_stroke() === null) {
                        this._changedShapeProps.put_stroke(new CAscStroke());
                    }
                    this._changedShapeProps.get_stroke().put_linecap(record.value);
                }
            },
            this));
            this._arrJoinType = [{
                displayValue: this.textRound,
                value: c_oAscLineJoinType.Round
            },
            {
                displayValue: this.textBevel,
                value: c_oAscLineJoinType.Bevel
            },
            {
                displayValue: this.textMiter,
                value: c_oAscLineJoinType.Miter
            }];
            this.cmbJoinType = new Common.UI.ComboBox({
                el: $("#shape-advanced-join-type"),
                cls: "input-group-nr",
                menuStyle: "min-width: 100px;",
                editable: false,
                data: this._arrJoinType
            });
            this.cmbJoinType.setValue(c_oAscLineJoinType.Round);
            this.cmbJoinType.on("selected", _.bind(function (combo, record) {
                if (this._changedShapeProps) {
                    if (this._changedShapeProps.get_stroke() === null) {
                        this._changedShapeProps.put_stroke(new CAscStroke());
                    }
                    this._changedShapeProps.get_stroke().put_linejoin(record.value);
                }
            },
            this));
            var _arrStyles = [],
            _arrSize = [];
            for (var i = 0; i < 6; i++) {
                _arrStyles.push({
                    value: i,
                    offsetx: 80 * i + 10,
                    offsety: 0
                });
            }
            _arrStyles[0].type = c_oAscLineBeginType.None;
            _arrStyles[1].type = c_oAscLineBeginType.Triangle;
            _arrStyles[2].type = c_oAscLineBeginType.Arrow;
            _arrStyles[3].type = c_oAscLineBeginType.Stealth;
            _arrStyles[4].type = c_oAscLineBeginType.Diamond;
            _arrStyles[5].type = c_oAscLineBeginType.Oval;
            for (i = 0; i < 9; i++) {
                _arrSize.push({
                    value: i,
                    offsetx: 80 + 10,
                    offsety: 20 * (i + 1)
                });
            }
            _arrSize[0].type = c_oAscLineBeginSize.small_small;
            _arrSize[1].type = c_oAscLineBeginSize.small_mid;
            _arrSize[2].type = c_oAscLineBeginSize.small_large;
            _arrSize[3].type = c_oAscLineBeginSize.mid_small;
            _arrSize[4].type = c_oAscLineBeginSize.mid_mid;
            _arrSize[5].type = c_oAscLineBeginSize.mid_large;
            _arrSize[6].type = c_oAscLineBeginSize.large_small;
            _arrSize[7].type = c_oAscLineBeginSize.large_mid;
            _arrSize[8].type = c_oAscLineBeginSize.large_large;
            this.btnBeginStyle = new Common.UI.ComboBox({
                el: $("#shape-advanced-begin-style"),
                template: _.template(['<div class="input-group combobox combo-dataview-menu input-group-nr dropdown-toggle combo-arrow-style"  data-toggle="dropdown">', '<div class="form-control image" style="width: 100px;"></div>', '<div style="display: table-cell;"></div>', '<button type="button" class="btn btn-default"><span class="caret"></span></button>', "</div>"].join(""))
            });
            (new Common.UI.Menu({
                style: "min-width: 105px;",
                items: [{
                    template: _.template('<div id="shape-advanced-menu-begin-style" style="width: 105px; margin: 0 5px;"></div>')
                }]
            })).render($("#shape-advanced-begin-style"));
            this.mnuBeginStylePicker = new Common.UI.DataView({
                el: $("#shape-advanced-menu-begin-style"),
                parentMenu: me.btnBeginStyle.menu,
                store: new Common.UI.DataViewStore(_arrStyles),
                itemTemplate: _.template('<div id="<%= id %>" class="item-arrow" style="background-position: -<%= offsetx %>px -<%= offsety %>px;"></div>')
            });
            this.mnuBeginStylePicker.on("item:click", _.bind(this.onSelectBeginStyle, this));
            this._selectStyleItem(this.btnBeginStyle, null);
            this.btnBeginSize = new Common.UI.ComboBox({
                el: $("#shape-advanced-begin-size"),
                template: _.template(['<div class="input-group combobox combo-dataview-menu input-group-nr dropdown-toggle combo-arrow-style"  data-toggle="dropdown">', '<div class="form-control image" style="width: 100px;"></div>', '<div style="display: table-cell;"></div>', '<button type="button" class="btn btn-default"><span class="caret"></span></button>', "</div>"].join(""))
            });
            (new Common.UI.Menu({
                style: "min-width: 160px;",
                items: [{
                    template: _.template('<div id="shape-advanced-menu-begin-size" style="width: 160px; margin: 0 5px;"></div>')
                }]
            })).render($("#shape-advanced-begin-size"));
            this.mnuBeginSizePicker = new Common.UI.DataView({
                el: $("#shape-advanced-menu-begin-size"),
                parentMenu: me.btnBeginSize.menu,
                store: new Common.UI.DataViewStore(_arrSize),
                itemTemplate: _.template('<div id="<%= id %>" class="item-arrow" style="background-position: -<%= offsetx %>px -<%= offsety %>px;"></div>')
            });
            this.mnuBeginSizePicker.on("item:click", _.bind(this.onSelectBeginSize, this));
            this._selectStyleItem(this.btnBeginSize, null);
            for (i = 0; i < _arrStyles.length; i++) {
                _arrStyles[i].offsety += 200;
            }
            for (i = 0; i < _arrSize.length; i++) {
                _arrSize[i].offsety += 200;
            }
            this.btnEndStyle = new Common.UI.ComboBox({
                el: $("#shape-advanced-end-style"),
                template: _.template(['<div class="input-group combobox combo-dataview-menu input-group-nr dropdown-toggle combo-arrow-style"  data-toggle="dropdown">', '<div class="form-control image" style="width: 100px;"></div>', '<div style="display: table-cell;"></div>', '<button type="button" class="btn btn-default"><span class="caret"></span></button>', "</div>"].join(""))
            });
            (new Common.UI.Menu({
                style: "min-width: 105px;",
                items: [{
                    template: _.template('<div id="shape-advanced-menu-end-style" style="width: 105px; margin: 0 5px;"></div>')
                }]
            })).render($("#shape-advanced-end-style"));
            this.mnuEndStylePicker = new Common.UI.DataView({
                el: $("#shape-advanced-menu-end-style"),
                parentMenu: me.btnEndStyle.menu,
                store: new Common.UI.DataViewStore(_arrStyles),
                itemTemplate: _.template('<div id="<%= id %>" class="item-arrow" style="background-position: -<%= offsetx %>px -<%= offsety %>px;"></div>')
            });
            this.mnuEndStylePicker.on("item:click", _.bind(this.onSelectEndStyle, this));
            this._selectStyleItem(this.btnEndStyle, null);
            this.btnEndSize = new Common.UI.ComboBox({
                el: $("#shape-advanced-end-size"),
                template: _.template(['<div class="input-group combobox combo-dataview-menu input-group-nr dropdown-toggle combo-arrow-style"  data-toggle="dropdown">', '<div class="form-control image" style="width: 100px;"></div>', '<div style="display: table-cell;"></div>', '<button type="button" class="btn btn-default"><span class="caret"></span></button>', "</div>"].join(""))
            });
            (new Common.UI.Menu({
                style: "min-width: 160px;",
                items: [{
                    template: _.template('<div id="shape-advanced-menu-end-size" style="width: 160px; margin: 0 5px;"></div>')
                }]
            })).render($("#shape-advanced-end-size"));
            this.mnuEndSizePicker = new Common.UI.DataView({
                el: $("#shape-advanced-menu-end-size"),
                parentMenu: me.btnEndSize.menu,
                store: new Common.UI.DataViewStore(_arrSize),
                itemTemplate: _.template('<div id="<%= id %>" class="item-arrow" style="background-position: -<%= offsetx %>px -<%= offsety %>px;"></div>')
            });
            this.mnuEndSizePicker.on("item:click", _.bind(this.onSelectEndSize, this));
            this._selectStyleItem(this.btnEndSize, null);
            this.afterRender();
        },
        afterRender: function () {
            this.updateMetricUnit();
            this._setDefaults(this._originalProps);
        },
        _setDefaults: function (props) {
            if (props) {
                this._objectType = c_oAscTypeSelectElement.Image;
                var value = props.get_WrappingStyle();
                if (props.get_CanBeFlow()) {
                    switch (value) {
                    case c_oAscWrapStyle2.Inline:
                        this.btnWrapInline.toggle(true);
                        break;
                    case c_oAscWrapStyle2.Square:
                        this.btnWrapSquare.toggle(true);
                        break;
                    case c_oAscWrapStyle2.Tight:
                        this.btnWrapTight.toggle(true);
                        break;
                    case c_oAscWrapStyle2.Through:
                        this.btnWrapThrough.toggle(true);
                        break;
                    case c_oAscWrapStyle2.TopAndBottom:
                        this.btnWrapTopBottom.toggle(true);
                        break;
                    case c_oAscWrapStyle2.Behind:
                        this.btnWrapBehind.toggle(true);
                        break;
                    case c_oAscWrapStyle2.InFront:
                        this.btnWrapInFront.toggle(true);
                        break;
                    default:
                        this.btnWrapInline.toggle(false);
                        this.btnWrapSquare.toggle(false);
                        this.btnWrapTight.toggle(false);
                        this.btnWrapThrough.toggle(false);
                        this.btnWrapTopBottom.toggle(false);
                        this.btnWrapBehind.toggle(false);
                        this.btnWrapInFront.toggle(false);
                        break;
                    }
                    this._DisableElem(value);
                } else {
                    this.btnWrapInline.toggle(true);
                    this.btnWrapSquare.setDisabled(true);
                    this.btnWrapTight.setDisabled(true);
                    this.btnWrapThrough.setDisabled(true);
                    this.btnWrapTopBottom.setDisabled(true);
                    this.btnWrapBehind.setDisabled(true);
                    this.btnWrapInFront.setDisabled(true);
                    this._DisableElem(c_oAscWrapStyle2.Inline);
                }
                this.spnWidth.setMaxValue(this.sizeMax.width);
                this.spnHeight.setMaxValue(this.sizeMax.height);
                value = props.get_Width();
                this.spnWidth.setValue((value !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(value).toFixed(2) : "", true);
                value = props.get_Height();
                this.spnHeight.setValue((value !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(value).toFixed(2) : "", true);
                if (props.get_Paddings()) {
                    var Paddings = {
                        Top: props.get_Paddings().get_Top(),
                        Right: props.get_Paddings().get_Right(),
                        Bottom: props.get_Paddings().get_Bottom(),
                        Left: props.get_Paddings().get_Left()
                    };
                    if (Paddings.Top !== null && Paddings.Top !== undefined) {
                        this.spnTop.setValue(Common.Utils.Metric.fnRecalcFromMM(Paddings.Top), true);
                    }
                    if (Paddings.Left !== null && Paddings.Left !== undefined) {
                        this.spnLeft.setValue(Common.Utils.Metric.fnRecalcFromMM(Paddings.Left), true);
                    }
                    if (Paddings.Bottom !== null && Paddings.Bottom !== undefined) {
                        this.spnBottom.setValue(Common.Utils.Metric.fnRecalcFromMM(Paddings.Bottom), true);
                    }
                    if (Paddings.Right !== null && Paddings.Right !== undefined) {
                        this.spnRight.setValue(Common.Utils.Metric.fnRecalcFromMM(Paddings.Right), true);
                    }
                }
                var Position = props.get_PositionH();
                if (Position) {
                    if (Position.get_UseAlign()) {
                        value = Position.get_Align();
                        for (var i = 0; i < this._arrHAlign.length; i++) {
                            if (value == this._arrHAlign[i].value) {
                                this.cmbHAlign.setValue(value);
                                this._state.HAlignType = value;
                                break;
                            }
                        }
                        value = Position.get_RelativeFrom();
                        for (var i = 0; i < this._arrHRelative.length; i++) {
                            if (value == this._arrHRelative[i].value) {
                                this.cmbHRelative.setValue(value);
                                this._state.HAlignFrom = value;
                                break;
                            }
                        }
                    } else {
                        this.radioHPosition.setValue(true);
                        value = Position.get_Value();
                        this.spnX.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                        value = Position.get_RelativeFrom();
                        for (i = 0; i < this._arrHRelative.length; i++) {
                            if (value == this._arrHRelative[i].value) {
                                this.cmbHPosition.setValue(value);
                                this._state.HPositionFrom = value;
                                break;
                            }
                        }
                    }
                }
                Position = props.get_PositionV();
                if (Position) {
                    if (Position.get_UseAlign()) {
                        value = Position.get_Align();
                        for (i = 0; i < this._arrVAlign.length; i++) {
                            if (value == this._arrVAlign[i].value) {
                                this.cmbVAlign.setValue(value);
                                this._state.VAlignType = value;
                                break;
                            }
                        }
                    } else {
                        this.radioVPosition.setValue(true);
                        value = Position.get_Value();
                        this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                    }
                    value = Position.get_RelativeFrom();
                    for (i = 0; i < this._arrVRelative.length; i++) {
                        if (value == this._arrVRelative[i].value) {
                            this.cmbVRelative.setValue(value);
                            this.cmbVPosition.setValue(value);
                            this._state.VAlignFrom = value;
                            this._state.VPositionFrom = value;
                            break;
                        }
                    }
                    this.chMove.setValue((value == c_oAscRelativeFromV.Line || value == c_oAscRelativeFromV.Paragraph), true);
                }
                this.chOverlap.setValue((props.get_AllowOverlap() !== null && props.get_AllowOverlap() !== undefined) ? props.get_AllowOverlap() : "indeterminate", true);
                if (props.get_Height() > 0) {
                    this._nRatio = props.get_Width() / props.get_Height();
                }
                var shapeprops = props.get_ShapeProperties();
                var chartprops = props.get_ChartProperties();
                this.btnOriginalSize.setVisible(!(shapeprops || chartprops));
                this.btnOriginalSize.setDisabled(props.get_ImageUrl() === null || props.get_ImageUrl() === undefined);
                this.btnsCategory[3].setVisible(shapeprops !== null && !shapeprops.get_FromChart());
                this.btnsCategory[4].setVisible(shapeprops !== null && !shapeprops.get_FromChart());
                this.btnsCategory[1].setDisabled(props.get_FromGroup());
                if (shapeprops) {
                    this._objectType = c_oAscTypeSelectElement.Shape;
                    this._setShapeDefaults(shapeprops);
                    this.setTitle(this.textTitleShape);
                    value = window.localStorage.getItem("de-settings-shaperatio");
                    var margins = shapeprops.get_paddings();
                    if (margins) {
                        var val = margins.get_Left();
                        this.spnMarginLeft.setValue((null !== val && undefined !== val) ? Common.Utils.Metric.fnRecalcFromMM(val) : "", true);
                        val = margins.get_Top();
                        this.spnMarginTop.setValue((null !== val && undefined !== val) ? Common.Utils.Metric.fnRecalcFromMM(val) : "", true);
                        val = margins.get_Right();
                        this.spnMarginRight.setValue((null !== val && undefined !== val) ? Common.Utils.Metric.fnRecalcFromMM(val) : "", true);
                        val = margins.get_Bottom();
                        this.spnMarginBottom.setValue((null !== val && undefined !== val) ? Common.Utils.Metric.fnRecalcFromMM(val) : "", true);
                    }
                    this.btnsCategory[4].setDisabled(null === margins);
                } else {
                    if (chartprops) {
                        this._objectType = c_oAscTypeSelectElement.Chart;
                        this.setTitle(this.textTitleChart);
                        value = window.localStorage.getItem("de-settings-chartratio");
                    } else {
                        this.setTitle(this.textTitle);
                        value = window.localStorage.getItem("de-settings-imageratio");
                        if (value === null) {
                            value = 1;
                        }
                    }
                }
                if (value !== null && parseInt(value) == 1) {
                    this.btnRatio.toggle(true);
                }
                this._changedProps = new CImgProperty();
            }
        },
        getSettings: function () {
            var value = (this.btnRatio.pressed) ? 1 : 0;
            if (this._objectType == c_oAscTypeSelectElement.Shape) {
                window.localStorage.setItem("de-settings-shaperatio", value);
            } else {
                if (this._objectType == c_oAscTypeSelectElement.Chart) {
                    window.localStorage.setItem("de-settings-chartratio", value);
                } else {
                    window.localStorage.setItem("de-settings-imageratio", value);
                }
            }
            var properties = this._changedProps;
            if (this._objectType == c_oAscTypeSelectElement.Shape) {
                properties.put_ShapeProperties(this._changedShapeProps);
                if (this.Margins) {
                    if (properties.get_ShapeProperties() === null || properties.get_ShapeProperties() === undefined) {
                        properties.put_ShapeProperties(new CAscShapeProp);
                    }
                    properties.get_ShapeProperties().put_paddings(this.Margins);
                }
            }
            if (this._originalProps.get_WrappingStyle() === c_oAscWrapStyle2.Inline && properties.get_WrappingStyle() !== undefined && properties.get_WrappingStyle() !== c_oAscWrapStyle2.Inline) {
                if (properties.get_PositionH() === null || properties.get_PositionH() === undefined) {
                    properties.put_PositionH(new CImagePositionH());
                    properties.get_PositionH().put_UseAlign(false);
                    properties.get_PositionH().put_RelativeFrom(c_oAscRelativeFromH.Column);
                    var val = this._originalProps.get_Value_X(c_oAscRelativeFromH.Column);
                    properties.get_PositionH().put_Value(val);
                }
                if (properties.get_PositionV() === null || properties.get_PositionV() === undefined) {
                    properties.put_PositionV(new CImagePositionV());
                    properties.get_PositionV().put_UseAlign(false);
                    properties.get_PositionV().put_RelativeFrom(c_oAscRelativeFromV.Paragraph);
                    val = this._originalProps.get_Value_Y(c_oAscRelativeFromV.Paragraph);
                    properties.get_PositionV().put_Value(val);
                }
            }
            return {
                imageProps: properties
            };
        },
        _setShapeDefaults: function (props) {
            if (props) {
                var stroke = props.get_stroke();
                if (stroke) {
                    var value = stroke.get_linejoin();
                    for (var i = 0; i < this._arrJoinType.length; i++) {
                        if (value == this._arrJoinType[i].value) {
                            this.cmbJoinType.setValue(value);
                            break;
                        }
                    }
                    value = stroke.get_linecap();
                    for (i = 0; i < this._arrCapType.length; i++) {
                        if (value == this._arrCapType[i].value) {
                            this.cmbCapType.setValue(value);
                            break;
                        }
                    }
                    var canchange = stroke.get_canChangeArrows();
                    this.btnBeginStyle.setDisabled(!canchange);
                    this.btnEndStyle.setDisabled(!canchange);
                    this.btnBeginSize.setDisabled(!canchange);
                    this.btnEndSize.setDisabled(!canchange);
                    if (canchange) {
                        value = stroke.get_linebeginsize();
                        var rec = this.mnuBeginSizePicker.store.findWhere({
                            type: value
                        });
                        if (rec) {
                            this._beginSizeIdx = rec.get("value");
                        } else {
                            this._beginSizeIdx = null;
                            this._selectStyleItem(this.btnBeginSize, null);
                        }
                        value = stroke.get_linebeginstyle();
                        rec = this.mnuBeginStylePicker.store.findWhere({
                            type: value
                        });
                        if (rec) {
                            this.mnuBeginStylePicker.selectRecord(rec, true);
                            this._updateSizeArr(this.btnBeginSize, this.mnuBeginSizePicker, rec, this._beginSizeIdx);
                            this._selectStyleItem(this.btnBeginStyle, rec);
                        } else {
                            this._selectStyleItem(this.btnBeginStyle, null);
                        }
                        value = stroke.get_lineendsize();
                        rec = this.mnuEndSizePicker.store.findWhere({
                            type: value
                        });
                        if (rec) {
                            this._endSizeIdx = rec.get("value");
                        } else {
                            this._endSizeIdx = null;
                            this._selectStyleItem(this.btnEndSize, null);
                        }
                        value = stroke.get_lineendstyle();
                        rec = this.mnuEndStylePicker.store.findWhere({
                            type: value
                        });
                        if (rec) {
                            this.mnuEndStylePicker.selectRecord(rec, true);
                            this._updateSizeArr(this.btnEndSize, this.mnuEndSizePicker, rec, this._endSizeIdx);
                            this._selectStyleItem(this.btnEndStyle, rec);
                        } else {
                            this._selectStyleItem(this.btnEndStyle, null);
                        }
                    } else {
                        this._selectStyleItem(this.btnBeginStyle);
                        this._selectStyleItem(this.btnEndStyle);
                        this._selectStyleItem(this.btnBeginSize);
                        this._selectStyleItem(this.btnEndSize);
                    }
                }
            }
            this._changedShapeProps = new CAscShapeProp();
        },
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.01 : 1);
                }
            }
            this.sizeMax = {
                width: Common.Utils.Metric.fnRecalcFromMM(this.options.sizeMax.width * 10),
                height: Common.Utils.Metric.fnRecalcFromMM(this.options.sizeMax.height * 10)
            };
            if (this.options.sizeOriginal) {
                this.sizeOriginal = {
                    width: Common.Utils.Metric.fnRecalcFromMM(this.options.sizeOriginal.width),
                    height: Common.Utils.Metric.fnRecalcFromMM(this.options.sizeOriginal.height)
                };
            }
        },
        onBtnWrapClick: function (btn, e) {
            this._DisableElem(btn.options.posId);
            if (this._changedProps) {
                this._changedProps.put_WrappingStyle(btn.options.posId);
            }
        },
        _DisableElem: function (btnId) {
            var disabledLR = (btnId == c_oAscWrapStyle2.Inline || btnId == c_oAscWrapStyle2.Behind || btnId == c_oAscWrapStyle2.InFront || btnId == c_oAscWrapStyle2.TopAndBottom);
            var disabledTB = (btnId == c_oAscWrapStyle2.Inline || btnId == c_oAscWrapStyle2.Behind || btnId == c_oAscWrapStyle2.InFront || btnId == c_oAscWrapStyle2.Tight || btnId == c_oAscWrapStyle2.Through);
            this.spnLeft.setDisabled(disabledLR);
            this.spnRight.setDisabled(disabledLR);
            this.spnTop.setDisabled(disabledTB);
            this.spnBottom.setDisabled(disabledTB);
            this.btnsCategory[2].setDisabled(btnId == c_oAscWrapStyle2.Inline);
        },
        onHAlignSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CImagePositionH());
                }
                this._state.HAlignType = record.value;
                this._changedProps.get_PositionH().put_UseAlign(true);
                this._changedProps.get_PositionH().put_RelativeFrom(this._state.HAlignFrom);
                this._changedProps.get_PositionH().put_Align(this._state.HAlignType);
            }
        },
        onHRelativeSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CImagePositionH());
                }
                this._state.HAlignFrom = record.value;
                this._changedProps.get_PositionH().put_UseAlign(true);
                this._changedProps.get_PositionH().put_RelativeFrom(this._state.HAlignFrom);
                this._changedProps.get_PositionH().put_Align(this._state.HAlignType);
            }
        },
        onHPositionSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CImagePositionH());
                }
                this._state.HPositionFrom = record.value;
                this._changedProps.get_PositionH().put_UseAlign(false);
                this._changedProps.get_PositionH().put_RelativeFrom(this._state.HPositionFrom);
                if (!this._state.spnXChanged) {
                    var val = this._originalProps.get_Value_X(this._state.HPositionFrom);
                    this.spnX.setValue(Common.Utils.Metric.fnRecalcFromMM(val), true);
                }
                this._changedProps.get_PositionH().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnX.getNumberValue()));
            }
        },
        onVAlignSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CImagePositionV());
                }
                this._state.VAlignType = record.value;
                this._changedProps.get_PositionV().put_UseAlign(true);
                this._changedProps.get_PositionV().put_RelativeFrom(this._state.VAlignFrom);
                this._changedProps.get_PositionV().put_Align(this._state.VAlignType);
            }
        },
        onVRelativeSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CImagePositionV());
                }
                this._state.VAlignFrom = record.value;
                this._changedProps.get_PositionV().put_UseAlign(true);
                this._changedProps.get_PositionV().put_RelativeFrom(this._state.VAlignFrom);
                this._changedProps.get_PositionV().put_Align(this._state.VAlignType);
                this.chMove.setValue(this._state.VAlignFrom == c_oAscRelativeFromV.Line || this._state.VAlignFrom == c_oAscRelativeFromV.Paragraph, true);
            }
        },
        onVPositionSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CImagePositionV());
                }
                this._state.VPositionFrom = record.value;
                this._changedProps.get_PositionV().put_UseAlign(false);
                this._changedProps.get_PositionV().put_RelativeFrom(this._state.VPositionFrom);
                if (!this._state.spnYChanged) {
                    var val = this._originalProps.get_Value_Y(this._state.VPositionFrom);
                    this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(val), true);
                }
                this._changedProps.get_PositionV().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnY.getNumberValue()));
                this.chMove.setValue(this._state.VPositionFrom == c_oAscRelativeFromV.Line || this._state.VPositionFrom == c_oAscRelativeFromV.Paragraph, true);
            }
        },
        onRadioHAlignChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CImagePositionH());
                }
                this._changedProps.get_PositionH().put_UseAlign(newValue);
                if (newValue) {
                    this._changedProps.get_PositionH().put_Align(this._state.HAlignType);
                    this._changedProps.get_PositionH().put_RelativeFrom(this._state.HAlignFrom);
                }
            }
            if (newValue) {
                this.cmbHAlign.setDisabled(false);
                this.cmbHRelative.setDisabled(false);
                this.spnX.setDisabled(true);
                this.cmbHPosition.setDisabled(true);
            }
        },
        onRadioHPositionChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CImagePositionH());
                }
                this._changedProps.get_PositionH().put_UseAlign(!newValue);
                if (newValue) {
                    this._changedProps.get_PositionH().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnX.getNumberValue()));
                    this._changedProps.get_PositionH().put_RelativeFrom(this._state.HPositionFrom);
                }
            }
            if (newValue) {
                this.cmbHAlign.setDisabled(true);
                this.cmbHRelative.setDisabled(true);
                this.spnX.setDisabled(false);
                this.cmbHPosition.setDisabled(false);
            }
        },
        onRadioVAlignChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CImagePositionV());
                }
                this._changedProps.get_PositionV().put_UseAlign(newValue);
                if (newValue) {
                    this._changedProps.get_PositionV().put_Align(this._state.VAlignType);
                    this._changedProps.get_PositionV().put_RelativeFrom(this._state.VAlignFrom);
                }
            }
            if (newValue) {
                this.cmbVAlign.setDisabled(false);
                this.cmbVRelative.setDisabled(false);
                this.spnY.setDisabled(true);
                this.cmbVPosition.setDisabled(true);
                this.chMove.setValue(this._state.VAlignFrom == c_oAscRelativeFromV.Line || this._state.VAlignFrom == c_oAscRelativeFromV.Paragraph, true);
            }
        },
        onRadioVPositionChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CImagePositionV());
                }
                this._changedProps.get_PositionV().put_UseAlign(!newValue);
                if (newValue) {
                    this._changedProps.get_PositionV().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnY.getNumberValue()));
                    this._changedProps.get_PositionV().put_RelativeFrom(this._state.VPositionFrom);
                }
            }
            if (newValue) {
                this.cmbVAlign.setDisabled(true);
                this.cmbVRelative.setDisabled(true);
                this.spnY.setDisabled(false);
                this.cmbVPosition.setDisabled(false);
                this.chMove.setValue(this._state.VPositionFrom == c_oAscRelativeFromV.Line || this._state.VPositionFrom == c_oAscRelativeFromV.Paragraph, true);
            }
        },
        _updateSizeArr: function (combo, picker, record, sizeidx) {
            if (record.get("value") > 0) {
                picker.store.each(function (rec) {
                    rec.set({
                        offsetx: record.get("value") * 80 + 10
                    });
                },
                this);
                combo.setDisabled(false);
                if (sizeidx !== null) {
                    picker.selectByIndex(sizeidx, true);
                    this._selectStyleItem(combo, picker.store.at(sizeidx));
                } else {
                    this._selectStyleItem(combo, null);
                }
            } else {
                this._selectStyleItem(combo, null);
                combo.setDisabled(true);
            }
        },
        _selectStyleItem: function (combo, record) {
            var formcontrol = $(combo.el).find(".form-control");
            formcontrol.css("background-position", ((record) ? (-record.get("offsetx") + 20) + "px" : "0") + " " + ((record) ? "-" + record.get("offsety") + "px" : "-30px"));
        },
        onSelectBeginStyle: function (picker, view, record) {
            if (this._changedShapeProps) {
                if (this._changedShapeProps.get_stroke() === null) {
                    this._changedShapeProps.put_stroke(new CAscStroke());
                }
                this._changedShapeProps.get_stroke().put_linebeginstyle(record.get("type"));
            }
            if (this._beginSizeIdx === null || this._beginSizeIdx === undefined) {
                this._beginSizeIdx = 4;
            }
            this._updateSizeArr(this.btnBeginSize, this.mnuBeginSizePicker, record, this._beginSizeIdx);
            this._selectStyleItem(this.btnBeginStyle, record);
        },
        onSelectBeginSize: function (picker, view, record) {
            if (this._changedShapeProps) {
                if (this._changedShapeProps.get_stroke() === null) {
                    this._changedShapeProps.put_stroke(new CAscStroke());
                }
                this._changedShapeProps.get_stroke().put_linebeginsize(record.get("type"));
            }
            this._beginSizeIdx = record.get("value");
            this._selectStyleItem(this.btnBeginSize, record);
        },
        onSelectEndStyle: function (picker, view, record) {
            if (this._changedShapeProps) {
                if (this._changedShapeProps.get_stroke() === null) {
                    this._changedShapeProps.put_stroke(new CAscStroke());
                }
                this._changedShapeProps.get_stroke().put_lineendstyle(record.get("type"));
            }
            if (this._endSizeIdx === null || this._endSizeIdx === undefined) {
                this._endSizeIdx = 4;
            }
            this._updateSizeArr(this.btnEndSize, this.mnuEndSizePicker, record, this._endSizeIdx);
            this._selectStyleItem(this.btnEndStyle, record);
        },
        onSelectEndSize: function (picker, view, record) {
            if (this._changedShapeProps) {
                if (this._changedShapeProps.get_stroke() === null) {
                    this._changedShapeProps.put_stroke(new CAscStroke());
                }
                this._changedShapeProps.get_stroke().put_lineendsize(record.get("type"));
            }
            this._endSizeIdx = record.get("value");
            this._selectStyleItem(this.btnEndSize, record);
        },
        textTop: "Top",
        textLeft: "Left",
        textBottom: "Bottom",
        textRight: "Right",
        textOriginalSize: "Default Size",
        textPosition: "Position",
        textDistance: "Distance From Text",
        textSize: "Size",
        textWrap: "Wrapping Style",
        textWidth: "Width",
        textHeight: "Height",
        textWrapInlineTooltip: "Inline",
        textWrapSquareTooltip: "Square",
        textWrapTightTooltip: "Tight",
        textWrapThroughTooltip: "Through",
        textWrapTopbottomTooltip: "Top and Bottom",
        textWrapBehindTooltip: "Behind",
        textWrapInFrontTooltip: "In Front",
        textTitle: "Image - Advanced Settings",
        textKeepRatio: "Constant Proportions",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        textBtnWrap: "Text Wrapping",
        textCenter: "Center",
        textCharacter: "Character",
        textColumn: "Column",
        textLeftMargin: "Left Margin",
        textMargin: "Margin",
        textPage: "Page",
        textRightMargin: "Right Margin",
        textLine: "Line",
        textBottomMargin: "Bottom Margin",
        textParagraph: "Paragraph",
        textTopMargin: "Top Margin",
        textHorizontal: "Horizontal",
        textVertical: "Vertical",
        textAlignment: "Alignment",
        textRelative: "relative to",
        textRightOf: "to the right Of",
        textBelow: "below",
        textOverlap: "Allow overlap",
        textMove: "Move object with text",
        textOptions: "Options",
        textShape: "Shape Settings",
        textTitleShape: "Shape - Advanced Settings",
        textTitleChart: "Chart - Advanced Settings",
        strMargins: "Text Padding",
        textRound: "Round",
        textMiter: "Miter",
        textSquare: "Square",
        textFlat: "Flat",
        textBevel: "Bevel",
        textArrows: "Arrows",
        textLineStyle: "Line Style",
        textCapType: "Cap Type",
        textJoinType: "Join Type",
        textBeginStyle: "Begin Style",
        textBeginSize: "Begin Size",
        textEndStyle: "End Style",
        textEndSize: "End Size"
    },
    DE.Views.ImageSettingsAdvanced || {}));
});