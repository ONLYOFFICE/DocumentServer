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
 define(["text!documenteditor/main/app/template/TableSettingsAdvanced.template", "common/main/lib/view/AdvancedSettingsWindow", "common/main/lib/component/ComboBox", "common/main/lib/component/MetricSpinner", "common/main/lib/component/CheckBox", "common/main/lib/component/RadioBox", "common/main/lib/component/ThemeColorPalette", "common/main/lib/component/ColorButton", "common/main/lib/component/ListView", "common/main/lib/component/TableStyler"], function (contentTemplate) {
    DE.Views.TableSettingsAdvanced = Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            contentWidth: 340,
            height: 436,
            toggleGroup: "table-adv-settings-group"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle,
                items: [{
                    panelId: "id-adv-table-width",
                    panelCaption: this.textWidthSpaces
                },
                {
                    panelId: "id-adv-table-wrap",
                    panelCaption: this.textWrap
                },
                {
                    panelId: "id-adv-table-borders",
                    panelCaption: this.textBordersBackgroung
                },
                {
                    panelId: "id-adv-table-position",
                    panelCaption: this.textPosition
                },
                {
                    panelId: "id-adv-table-cell-props",
                    panelCaption: this.textCellProps
                }],
                contentTemplate: _.template(contentTemplate)({
                    scope: this
                })
            },
            options);
            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
            this.spinners = [];
            this._changedProps = null;
            this._cellBackground = null;
            this._state = {
                HAlignType: c_oAscXAlign.Left,
                HAlignFrom: c_oAscHAnchor.Margin,
                HPositionFrom: c_oAscHAnchor.Margin,
                VAlignType: c_oAscYAlign.Top,
                VAlignFrom: c_oAscVAnchor.Margin,
                VPositionFrom: c_oAscVAnchor.Margin,
                spnXChanged: false,
                spnYChanged: false,
                fromWrapInline: false,
                verticalPropChanged: false,
                horizontalPropChanged: false,
                alignChanged: false
            };
            this._allTable = false;
            this.TableMargins = {
                Left: 0.19,
                Right: 0.19,
                Top: 0,
                Bottom: 0
            };
            this.CellMargins = {
                Left: 0.19,
                Right: 0.19,
                Top: null,
                Bottom: null,
                Flag: 0
            };
            this.TableBorders = {};
            this.CellBorders = {};
            this.ChangedTableBorders = undefined;
            this.ChangedCellBorders = undefined;
            this.BorderSize = {
                ptValue: 0,
                pxValue: 0
            };
            this.TableColor = {
                Value: 1,
                Color: "transparent"
            };
            this.CellColor = {
                Value: 1,
                Color: "transparent"
            };
            this.IndeterminateColor = "#C8C8C8";
            this.IndeterminateSize = 4.5;
            this.tableStylerRows = this.options.tableStylerRows;
            this.tableStylerColumns = this.options.tableStylerColumns;
            this.borderProps = this.options.borderProps;
            this._originalProps = new CTableProp(this.options.tableProps);
        },
        render: function () {
            Common.Views.AdvancedSettingsWindow.prototype.render.call(this);
            var me = this;
            this._marginsChange = function (field, newValue, oldValue, eOpts, source, property) {
                if (source == "table") {
                    this.TableMargins[property] = field.getNumberValue();
                } else {
                    this.CellMargins[property] = field.getNumberValue();
                }
            };
            this.chWidth = new Common.UI.CheckBox({
                el: $("#tableadv-checkbox-width"),
                value: true,
                labelText: this.textWidth
            });
            this.chWidth.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                var value = (newValue == "checked");
                this.nfWidth.setDisabled(!value);
                if (this._changedProps) {
                    if (value && this.nfWidth.getNumberValue() > 0) {
                        this._changedProps.put_Width(Common.Utils.Metric.fnRecalcToMM(this.nfWidth.getNumberValue()));
                    } else {
                        this._changedProps.put_Width(null);
                    }
                }
            },
            this));
            this.nfWidth = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-width"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "10 cm",
                maxValue: 55.88,
                minValue: 0
            });
            this.nfWidth.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_Width(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.nfWidth);
            this.chAllowSpacing = new Common.UI.CheckBox({
                el: $("#tableadv-checkbox-spacing"),
                value: true,
                labelText: this.textAllowSpacing
            });
            this.chAllowSpacing.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                var value = (newValue == "checked");
                if (this._changedProps) {
                    this.nfSpacing.setDisabled(!value);
                    this.ShowHideSpacing(value);
                    if (this._changedProps) {
                        if (value && this.nfSpacing.getNumberValue() > 0) {
                            this._changedProps.put_Spacing(Common.Utils.Metric.fnRecalcToMM(this.nfSpacing.getNumberValue()));
                        } else {
                            this._changedProps.put_Spacing(null);
                        }
                    }
                }
            },
            this));
            this.nfSpacing = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-spacing"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.5 cm",
                maxValue: 2.14,
                minValue: 0
            });
            this.nfSpacing.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_Spacing(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.nfSpacing);
            this.chAutofit = new Common.UI.CheckBox({
                el: $("#tableadv-checkbox-autofit"),
                value: true,
                labelText: this.textAutofit
            });
            this.chAutofit.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_TableLayout((field.getValue() == "checked") ? c_oAscTableLayout.AutoFit : c_oAscTableLayout.Fixed);
                }
            },
            this));
            this.spnTableMarginTop = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-table-top"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnTableMarginTop.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "table", "Top");
                if (this._changedProps) {
                    if (this._changedProps.get_DefaultMargins() === undefined) {
                        this._changedProps.put_DefaultMargins(new CPaddings());
                    }
                    this._changedProps.get_DefaultMargins().put_Top((this.TableMargins.Top !== null) ? Common.Utils.Metric.fnRecalcToMM(this.TableMargins.Top) : null);
                    this.TableMargins.isChanged = true;
                }
            },
            this));
            this.spinners.push(this.spnTableMarginTop);
            this.spnTableMarginBottom = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-table-bottom"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnTableMarginBottom.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "table", "Bottom");
                if (this._changedProps) {
                    if (this._changedProps.get_DefaultMargins() === undefined) {
                        this._changedProps.put_DefaultMargins(new CPaddings());
                    }
                    this._changedProps.get_DefaultMargins().put_Bottom((this.TableMargins.Bottom !== null) ? Common.Utils.Metric.fnRecalcToMM(this.TableMargins.Bottom) : null);
                    this.TableMargins.isChanged = true;
                }
            },
            this));
            this.spinners.push(this.spnTableMarginBottom);
            this.spnTableMarginLeft = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-table-left"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnTableMarginLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "table", "Left");
                if (this._changedProps) {
                    if (this._changedProps.get_DefaultMargins() === undefined) {
                        this._changedProps.put_DefaultMargins(new CPaddings());
                    }
                    this._changedProps.get_DefaultMargins().put_Left((this.TableMargins.Left !== null) ? Common.Utils.Metric.fnRecalcToMM(this.TableMargins.Left) : null);
                    this.TableMargins.isChanged = true;
                }
            },
            this));
            this.spinners.push(this.spnTableMarginLeft);
            this.spnTableMarginRight = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-table-right"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnTableMarginRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "table", "Right");
                if (this._changedProps) {
                    if (this._changedProps.get_DefaultMargins() === undefined) {
                        this._changedProps.put_DefaultMargins(new CPaddings());
                    }
                    this._changedProps.get_DefaultMargins().put_Right((this.TableMargins.Right !== null) ? Common.Utils.Metric.fnRecalcToMM(this.TableMargins.Right) : null);
                    this.TableMargins.isChanged = true;
                }
            },
            this));
            this.spinners.push(this.spnTableMarginRight);
            var setCellFlag = function () {
                if (me.CellMargins.Flag == "indeterminate") {
                    me._changedProps.get_CellMargins().put_Flag(1);
                } else {
                    if (me.CellMargins.Flag == "checked") {
                        me._changedProps.get_CellMargins().put_Flag(0);
                    } else {
                        me._changedProps.get_CellMargins().put_Flag(2);
                    }
                }
            };
            this.chCellMargins = new Common.UI.CheckBox({
                el: $("#tableadv-checkbox-margins"),
                value: true,
                labelText: this.textCheckMargins
            });
            this.chCellMargins.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (oldValue == "checked" && this._originalProps && this._originalProps.get_CellMargins().get_Flag() == 1) {
                    field.setValue("indeterminate", true);
                }
                this.fillMargins.call(this, field.getValue());
                this.CellMargins.Flag = field.getValue();
                if (this._changedProps) {
                    if (this._changedProps.get_CellMargins() === undefined) {
                        this._changedProps.put_CellMargins(new CMargins());
                    }
                    this._changedProps.get_CellMargins().put_Left((this.CellMargins.Left !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Left) : null);
                    this._changedProps.get_CellMargins().put_Top((this.CellMargins.Top !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Top) : null);
                    this._changedProps.get_CellMargins().put_Bottom((this.CellMargins.Bottom !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Bottom) : null);
                    this._changedProps.get_CellMargins().put_Right((this.CellMargins.Right !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Right) : null);
                    setCellFlag();
                }
            },
            this));
            this.spnMarginTop = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-top"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnMarginTop.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Top");
                if (this._changedProps) {
                    if (this._changedProps.get_CellMargins() === undefined) {
                        this._changedProps.put_CellMargins(new CMargins());
                    }
                    this._changedProps.get_CellMargins().put_Top((this.CellMargins.Top !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Top) : null);
                    setCellFlag();
                }
            },
            this));
            this.spinners.push(this.spnMarginTop);
            this.spnMarginBottom = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-bottom"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnMarginBottom.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Bottom");
                if (this._changedProps) {
                    if (this._changedProps.get_CellMargins() === undefined) {
                        this._changedProps.put_CellMargins(new CMargins());
                    }
                    this._changedProps.get_CellMargins().put_Bottom((this.CellMargins.Bottom !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Bottom) : null);
                    setCellFlag();
                }
            },
            this));
            this.spinners.push(this.spnMarginBottom);
            this.spnMarginLeft = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-left"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnMarginLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Left");
                if (this._changedProps) {
                    if (this._changedProps.get_CellMargins() === undefined) {
                        this._changedProps.put_CellMargins(new CMargins());
                    }
                    this._changedProps.get_CellMargins().put_Left((this.CellMargins.Left !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Left) : null);
                    setCellFlag();
                }
            },
            this));
            this.spinners.push(this.spnMarginLeft);
            this.spnMarginRight = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-margin-right"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnMarginRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Right");
                if (this._changedProps) {
                    if (this._changedProps.get_CellMargins() === undefined) {
                        this._changedProps.put_CellMargins(new CMargins());
                    }
                    this._changedProps.get_CellMargins().put_Right((this.CellMargins.Right !== null) ? Common.Utils.Metric.fnRecalcToMM(this.CellMargins.Right) : null);
                    setCellFlag();
                }
            },
            this));
            this.spinners.push(this.spnMarginRight);
            this.btnWrapNone = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-wrap-none",
                posId: c_tableWrap.TABLE_WRAP_NONE,
                hint: this.textWrapNoneTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "advtablewrapGroup"
            });
            this.btnWrapNone.render($("#tableadv-button-wrap-none"));
            this.btnWrapNone.on("click", _.bind(this.onBtnInlineWrapClick, this));
            this.btnWrapParallel = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-wrap-parallel",
                posId: c_tableWrap.TABLE_WRAP_PARALLEL,
                hint: this.textWrapParallelTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "advtablewrapGroup"
            });
            this.btnWrapParallel.render($("#tableadv-button-wrap-parallel"));
            this.btnWrapParallel.on("click", _.bind(this.onBtnFlowWrapClick, this));
            this.btnAlignLeft = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-table-align-left",
                posId: c_tableAlign.TABLE_ALIGN_LEFT,
                hint: this.textLeftTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "advtablealignGroup"
            });
            this.btnAlignLeft.render($("#tableadv-button-align-left"));
            this.btnAlignLeft.on("click", _.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableAlignment(btn.options.posId);
                    this._changedProps.put_TableIndent(Common.Utils.Metric.fnRecalcToMM(this.spnIndentLeft.getNumberValue()));
                    this.spnIndentLeft.setDisabled(!btn.pressed);
                    this._state.alignChanged = true;
                }
            },
            this));
            this.btnAlignCenter = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-table-align-center",
                posId: c_tableAlign.TABLE_ALIGN_CENTER,
                hint: this.textCenterTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "advtablealignGroup"
            });
            this.btnAlignCenter.render($("#tableadv-button-align-center"));
            this.btnAlignCenter.on("click", _.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableAlignment(btn.options.posId);
                    this._changedProps.put_TableIndent(0);
                    this.spnIndentLeft.setDisabled(btn.pressed);
                    this._state.alignChanged = true;
                }
            },
            this));
            this.btnAlignRight = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-table-align-right",
                posId: c_tableAlign.TABLE_ALIGN_RIGHT,
                hint: this.textRightTooltip,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "advtablealignGroup"
            });
            this.btnAlignRight.render($("#tableadv-button-align-right"));
            this.btnAlignRight.on("click", _.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableAlignment(btn.options.posId);
                    this._changedProps.put_TableIndent(0);
                    this.spnIndentLeft.setDisabled(btn.pressed);
                    this._state.alignChanged = true;
                }
            },
            this));
            this.spnIndentLeft = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-indent"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 38.09,
                minValue: -38.09
            });
            this.spnIndentLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_TableIndent(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnIndentLeft);
            this.spnDistanceTop = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-distance-top"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "1 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnDistanceTop.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_TablePaddings() === undefined) {
                        this._changedProps.put_TablePaddings(new CPaddings());
                    }
                    this._changedProps.get_TablePaddings().put_Top(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnDistanceTop);
            this.spnDistanceBottom = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-distance-bottom"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "1 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spnDistanceBottom.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_TablePaddings() === undefined) {
                        this._changedProps.put_TablePaddings(new CPaddings());
                    }
                    this._changedProps.get_TablePaddings().put_Bottom(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnDistanceBottom);
            this.spnDistanceLeft = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-distance-left"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "1 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnDistanceLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_TablePaddings() === undefined) {
                        this._changedProps.put_TablePaddings(new CPaddings());
                    }
                    this._changedProps.get_TablePaddings().put_Left(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnDistanceLeft);
            this.spnDistanceRight = new Common.UI.MetricSpinner({
                el: $("#tableadv-number-distance-right"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                value: "0.19 cm",
                maxValue: 9.34,
                minValue: 0
            });
            this.spnDistanceRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_TablePaddings() === undefined) {
                        this._changedProps.put_TablePaddings(new CPaddings());
                    }
                    this._changedProps.get_TablePaddings().put_Right(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.spnDistanceRight);
            this.spnX = new Common.UI.MetricSpinner({
                el: $("#tableadv-spin-x"),
                step: 0.1,
                width: 115,
                disabled: true,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "1 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.spnX.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                        this._changedProps.put_PositionH(new CTablePositionH());
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
                el: $("#tableadv-spin-y"),
                step: 0.1,
                width: 115,
                disabled: true,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "1 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.spnY.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                        this._changedProps.put_PositionV(new CTablePositionV());
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
                value: c_oAscXAlign.Left
            },
            {
                displayValue: this.textCenter,
                value: c_oAscXAlign.Center
            },
            {
                displayValue: this.textRight,
                value: c_oAscXAlign.Right
            }];
            this.cmbHAlign = new Common.UI.ComboBox({
                el: $("#tableadv-combo-halign"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrHAlign
            });
            this.cmbHAlign.setValue(this._state.HAlignType);
            this.cmbHAlign.on("selected", _.bind(this.onHAlignSelect, this));
            this._arrHRelative = [{
                displayValue: this.textMargin,
                value: c_oAscHAnchor.Margin
            },
            {
                displayValue: this.textPage,
                value: c_oAscHAnchor.Page
            },
            {
                displayValue: this.textAnchorText,
                value: c_oAscHAnchor.Text
            }];
            this.cmbHRelative = new Common.UI.ComboBox({
                el: $("#tableadv-combo-hrelative"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrHRelative
            });
            this.cmbHRelative.setValue(this._state.HAlignFrom);
            this.cmbHRelative.on("selected", _.bind(this.onHRelativeSelect, this));
            this.cmbHPosition = new Common.UI.ComboBox({
                el: $("#tableadv-combo-hposition"),
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
                value: c_oAscYAlign.Top
            },
            {
                displayValue: this.textCenter,
                value: c_oAscYAlign.Center
            },
            {
                displayValue: this.textBottom,
                value: c_oAscYAlign.Bottom
            }];
            this.cmbVAlign = new Common.UI.ComboBox({
                el: $("#tableadv-combo-valign"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrVAlign
            });
            this.cmbVAlign.setValue(this._state.VAlignType);
            this.cmbVAlign.on("selected", _.bind(this.onVAlignSelect, this));
            this._arrVRelative = [{
                displayValue: this.textMargin,
                value: c_oAscVAnchor.Margin
            },
            {
                displayValue: this.textPage,
                value: c_oAscVAnchor.Page
            },
            {
                displayValue: this.textAnchorText,
                value: c_oAscVAnchor.Text
            }];
            this.cmbVRelative = new Common.UI.ComboBox({
                el: $("#tableadv-combo-vrelative"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrVRelative
            });
            this.cmbVRelative.setValue(this._state.VAlignFrom);
            this.cmbVRelative.on("selected", _.bind(this.onVRelativeSelect, this));
            this.cmbVPosition = new Common.UI.ComboBox({
                el: $("#tableadv-combo-vposition"),
                cls: "input-group-nr",
                menuStyle: "min-width: 115px;",
                editable: false,
                data: this._arrVRelative
            });
            this.cmbVPosition.setDisabled(true);
            this.cmbVPosition.setValue(this._state.VPositionFrom);
            this.cmbVPosition.on("selected", _.bind(this.onVPositionSelect, this));
            this.radioHAlign = new Common.UI.RadioBox({
                el: $("#tableadv-radio-halign"),
                name: "asc-radio-horizontal",
                checked: true
            });
            this.radioHAlign.on("change", _.bind(this.onRadioHAlignChange, this));
            this.radioHPosition = new Common.UI.RadioBox({
                el: $("#tableadv-radio-hposition"),
                name: "asc-radio-horizontal"
            });
            this.radioHPosition.on("change", _.bind(this.onRadioHPositionChange, this));
            this.radioVAlign = new Common.UI.RadioBox({
                el: $("#tableadv-radio-valign"),
                name: "asc-radio-vertical",
                checked: true
            });
            this.radioVAlign.on("change", _.bind(this.onRadioVAlignChange, this));
            this.radioVPosition = new Common.UI.RadioBox({
                el: $("#tableadv-radio-vposition"),
                name: "asc-radio-vertical"
            });
            this.radioVPosition.on("change", _.bind(this.onRadioVPositionChange, this));
            this.chMove = new Common.UI.CheckBox({
                el: $("#tableadv-checkbox-move"),
                labelText: this.textMove
            });
            this.chMove.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    var value = this._arrVRelative[(field.getValue() == "checked") ? 2 : 1].value;
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
                el: $("#tableadv-checkbox-overlap"),
                labelText: this.textOverlap
            });
            this.chOverlap.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_AllowOverlap(field.getValue() == "checked");
                }
            },
            this));
            this.cmbBorderSize = new Common.UI.ComboBorderSize({
                el: $("#tableadv-combo-border-size"),
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
                        template: _.template('<div id="tableadv-border-color-menu" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="tableadv-border-color-new" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            });
            this.btnBorderColor.on("render:after", function (btn) {
                me.colorsBorder = new Common.UI.ThemeColorPalette({
                    el: $("#tableadv-border-color-menu"),
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
            this.btnBorderColor.render($("#tableadv-border-color-btn"));
            this.btnBorderColor.setColor("000000");
            $("#tableadv-border-color-new").on("click", _.bind(this.addNewColor, this, this.colorsBorder, this.btnBorderColor));
            this.btnBackColor = new Common.UI.ColorButton({
                style: "width:45px;",
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="tableadv-back-color-menu" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="tableadv-back-color-new" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            });
            this.btnBackColor.on("render:after", function (btn) {
                me.colorsBack = new Common.UI.ThemeColorPalette({
                    el: $("#tableadv-back-color-menu"),
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
            this.btnBackColor.render($("#tableadv-button-back-color"));
            $("#tableadv-back-color-new").on("click", _.bind(this.addNewColor, this, this.colorsBack, this.btnBackColor));
            this.btnTableBackColor = new Common.UI.ColorButton({
                style: "width:45px;",
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="tableadv-table-back-color-menu" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="tableadv-table-back-color-new" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            });
            this.btnTableBackColor.on("render:after", function (btn) {
                me.colorsTableBack = new Common.UI.ThemeColorPalette({
                    el: $("#tableadv-table-back-color-menu"),
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
                me.colorsTableBack.on("select", _.bind(me.onColorsTableBackSelect, me));
            });
            this.btnTableBackColor.render($("#tableadv-button-table-back-color"));
            $("#tableadv-table-back-color-new").on("click", _.bind(this.addNewColor, this, this.colorsTableBack, this.btnTableBackColor));
            this.tableBordersImageSpacing = new Common.UI.TableStyler({
                el: $("#id-detablestyler-spacing"),
                width: 200,
                height: 200,
                rows: this.tableStylerRows,
                columns: this.tableStylerColumns,
                spacingMode: true
            });
            this.tableBordersImage = new Common.UI.TableStyler({
                el: $("#id-detablestyler"),
                width: 200,
                height: 200,
                rows: this.tableStylerRows,
                columns: this.tableStylerColumns,
                spacingMode: false
            });
            var _arrBorderPresets = [["cm", "btn-borders-large btn-adv-position-inner", "tableadv-button-border-inner", this.tipInner], ["lrtb", "btn-borders-large btn-adv-position-outer", "tableadv-button-border-outer", this.tipOuter], ["lrtbcm", "btn-borders-large btn-adv-position-all", "tableadv-button-border-all", this.tipAll], ["", "btn-borders-large btn-adv-position-none", "tableadv-button-border-none", this.tipNone]];
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
            var _arrTableBorderPresets = [["cm", "", "btn-borders-large btn-adv-position-inner-none", "tableadv-button-border-inner-none", this.tipCellInner], ["lrtb", "", "btn-borders-large btn-adv-position-outer-none", "tableadv-button-border-outer-none", this.tipCellOuter], ["lrtbcm", "", "btn-borders-large btn-adv-position-all-none", "tableadv-button-border-all-none", this.tipCellAll], ["", "", "btn-borders-large btn-adv-position-none-none", "tableadv-button-border-none-none", this.tipNone], ["lrtbcm", "lrtb", "btn-borders-large btn-adv-position-all-table", "tableadv-button-border-all-table", this.tipTableOuterCellAll], ["", "lrtb", "btn-borders-large btn-adv-position-none-table", "tableadv-button-border-none-table", this.tipOuter], ["cm", "lrtb", "btn-borders-large btn-adv-position-inner-table", "tableadv-button-border-inner-table", this.tipTableOuterCellInner], ["lrtb", "lrtb", "btn-borders-large btn-adv-position-outer-table", "tableadv-button-border-outer-table", this.tipTableOuterCellOuter]];
            this._btnsTableBorderPosition = [];
            _.each(_arrTableBorderPresets, function (item, index, list) {
                var _btn = new Common.UI.Button({
                    style: "margin-left: 5px; margin-bottom: 4px;",
                    cls: "btn-options large",
                    iconCls: item[2],
                    strCellId: item[0],
                    strTableId: item[1],
                    hint: item[4]
                });
                _btn.render($("#" + item[3]));
                _btn.on("click", _.bind(this._ApplyBorderPreset, this));
                this._btnsTableBorderPosition.push(_btn);
            },
            this);
            this.AlignContainer = $("#tableadv-panel-align");
            this.DistanceContainer = $("#tableadv-panel-distance");
            this.BordersContainer = $("#tableadv-panel-borders");
            this.BordersSpacingContainer = $("#tableadv-panel-borders-spacing");
            this.CellBackContainer = $("#tableadv-panel-cell-back");
            this.TableBackContainer = $("#tableadv-panel-table-back");
            this.btnsCategory[4].on("click", _.bind(this.onCellCategoryClick, this));
            this.afterRender();
        },
        afterRender: function () {
            this.updateMetricUnit();
            this.updateThemeColors();
            this._setDefaults(this._originalProps);
            if (this.borderProps !== undefined) {
                this.btnBorderColor.setColor(this.borderProps.borderColor);
                var colorstr = (typeof(this.borderProps.borderColor) == "object") ? this.borderProps.borderColor.color : this.borderProps.borderColor;
                this.tableBordersImageSpacing.setVirtualBorderColor(colorstr);
                this.tableBordersImage.setVirtualBorderColor(colorstr);
                this.cmbBorderSize.setValue(this.borderProps.borderSize.ptValue);
                var rec = this.cmbBorderSize.getSelectedRecord();
                if (rec) {
                    this.onBorderSizeSelect(this.cmbBorderSize, rec);
                }
                this.colorsBorder.select(this.borderProps.borderColor, true);
            }
            for (var i = 0; i < this.tableBordersImageSpacing.rows; i++) {
                for (var j = 0; j < this.tableBordersImageSpacing.columns; j++) {
                    this.tableBordersImageSpacing.getCell(j, i).on("borderclick", function (ct, border, size, color) {
                        if (this.ChangedCellBorders === undefined) {
                            this.ChangedCellBorders = new CBorders();
                        }
                        this._UpdateCellBordersStyle(ct, border, size, color, this.CellBorders, this.ChangedCellBorders);
                    },
                    this);
                }
            }
            this.tableBordersImageSpacing.on("borderclick", function (ct, border, size, color) {
                if (this.ChangedTableBorders === undefined) {
                    this.ChangedTableBorders = new CBorders();
                }
                this._UpdateTableBordersStyle(ct, border, size, color, this.TableBorders, this.ChangedTableBorders);
            },
            this);
            for (i = 0; i < this.tableBordersImage.rows; i++) {
                for (j = 0; j < this.tableBordersImage.columns; j++) {
                    this.tableBordersImage.getCell(j, i).on("borderclick", function (ct, border, size, color) {
                        if (this._allTable) {
                            if (this.ChangedTableBorders === undefined) {
                                this.ChangedTableBorders = new CBorders();
                            }
                        } else {
                            if (this.ChangedCellBorders === undefined) {
                                this.ChangedCellBorders = new CBorders();
                            }
                        }
                        this._UpdateCellBordersStyle(ct, border, size, color, (this._allTable) ? this.TableBorders : this.CellBorders, (this._allTable) ? this.ChangedTableBorders : this.ChangedCellBorders);
                    },
                    this);
                }
            }
            this.tableBordersImage.on("borderclick", function (ct, border, size, color) {
                if (this._allTable) {
                    if (this.ChangedTableBorders === undefined) {
                        this.ChangedTableBorders = new CBorders();
                    }
                } else {
                    if (this.ChangedCellBorders === undefined) {
                        this.ChangedCellBorders = new CBorders();
                    }
                }
                this._UpdateTableBordersStyle(ct, border, size, color, (this._allTable) ? this.TableBorders : this.CellBorders, (this._allTable) ? this.ChangedTableBorders : this.ChangedCellBorders);
            },
            this);
        },
        getSettings: function () {
            if (this._cellBackground) {
                if (this._allTable) {
                    if (this._changedProps.get_Spacing() === null || (this._changedProps.get_Spacing() === undefined && this._originalProps.get_Spacing() === null)) {
                        this._changedProps.put_CellsBackground(null);
                    } else {
                        this._changedProps.put_CellsBackground(this._cellBackground);
                    }
                } else {
                    this._changedProps.put_CellsBackground(this._cellBackground);
                }
            }
            if (this.ChangedTableBorders === null) {
                this._changedProps.put_TableBorders(this.TableBorders);
            } else {
                if (this.ChangedTableBorders !== undefined) {
                    this._changedProps.put_TableBorders(this.ChangedTableBorders);
                }
            }
            if (this.ChangedCellBorders === null) {
                this._changedProps.put_CellBorders(this.CellBorders);
            } else {
                if (this.ChangedCellBorders !== undefined) {
                    this._changedProps.put_CellBorders(this.ChangedCellBorders);
                }
            }
            return {
                tableProps: this._changedProps,
                borderProps: {
                    borderSize: this.BorderSize,
                    borderColor: this.btnBorderColor.color
                }
            };
        },
        _setDefaults: function (props) {
            if (props) {
                this._allTable = !props.get_CellSelect();
                var value;
                var TableWidth = props.get_Width();
                if (TableWidth !== null) {
                    this.nfWidth.setValue(Common.Utils.Metric.fnRecalcFromMM(TableWidth), true);
                }
                this.chWidth.setValue(TableWidth !== null, true);
                this.nfWidth.setDisabled(this.chWidth.getValue() !== "checked");
                var TableSpacing = props.get_Spacing();
                if (TableSpacing !== null) {
                    this.nfSpacing.setValue(Common.Utils.Metric.fnRecalcFromMM(TableSpacing), true);
                }
                this.chAllowSpacing.setValue(TableSpacing !== null, true);
                this.nfSpacing.setDisabled(this.chAllowSpacing.getValue() !== "checked");
                var autoFit = props.get_TableLayout();
                this.chAutofit.setDisabled(autoFit === undefined);
                this.chAutofit.setValue(autoFit === c_oAscTableLayout.AutoFit, true);
                var margins = props.get_DefaultMargins();
                if (margins) {
                    this.TableMargins = {
                        Left: (margins.get_Left() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Left()) : null,
                        Right: (margins.get_Right() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Right()) : null,
                        Top: (margins.get_Top() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Top()) : null,
                        Bottom: (margins.get_Bottom() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Bottom()) : null
                    };
                }
                margins = props.get_CellMargins();
                var flag = undefined;
                if (margins) {
                    this.CellMargins = {
                        Left: (margins.get_Left() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Left()) : null,
                        Right: (margins.get_Right() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Right()) : null,
                        Top: (margins.get_Top() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Top()) : null,
                        Bottom: (margins.get_Bottom() !== null) ? Common.Utils.Metric.fnRecalcFromMM(margins.get_Bottom()) : null
                    };
                    flag = margins.get_Flag();
                    this.CellMargins.Flag = (flag == 1) ? "indeterminate" : ((flag == 0) ? "checked" : "unchecked");
                    this.chCellMargins.setValue(this.CellMargins.Flag, true);
                }
                if (flag === 0) {
                    if (this.CellMargins.Left === null) {
                        this.CellMargins.Left = this.TableMargins.Left;
                    }
                    if (this.CellMargins.Top === null) {
                        this.CellMargins.Top = this.TableMargins.Top;
                    }
                    if (this.CellMargins.Right === null) {
                        this.CellMargins.Right = this.TableMargins.Right;
                    }
                    if (this.CellMargins.Bottom === null) {
                        this.CellMargins.Bottom = this.TableMargins.Bottom;
                    }
                }
                this.fillMargins(this.CellMargins.Flag);
                this._TblWrapStyleChanged(props.get_TableWrap());
                this.ShowHideWrap(props.get_TableWrap() === c_tableWrap.TABLE_WRAP_NONE);
                this.btnWrapParallel.setDisabled(!props.get_CanBeFlow());
                var tableAlign = props.get_TableAlignment();
                if (tableAlign !== null) {
                    this._TblAlignChanged(tableAlign);
                    this.spnIndentLeft.setValue(tableAlign !== c_tableAlign.TABLE_ALIGN_LEFT ? 0 : Common.Utils.Metric.fnRecalcFromMM(props.get_TableIndent()), true);
                    this.spnIndentLeft.setDisabled(tableAlign !== c_tableAlign.TABLE_ALIGN_LEFT);
                }
                this._state.alignChanged = false;
                var paddings = props.get_TablePaddings();
                if (paddings) {
                    this.spnDistanceTop.setValue(Common.Utils.Metric.fnRecalcFromMM(paddings.get_Top()), true);
                    this.spnDistanceLeft.setValue(Common.Utils.Metric.fnRecalcFromMM(paddings.get_Left()), true);
                    this.spnDistanceBottom.setValue(Common.Utils.Metric.fnRecalcFromMM(paddings.get_Bottom()), true);
                    this.spnDistanceRight.setValue(Common.Utils.Metric.fnRecalcFromMM(paddings.get_Right()), true);
                }
                var Position = props.get_PositionH();
                if (Position) {
                    value = Position.get_RelativeFrom();
                    for (var i = 0; i < this._arrHRelative.length; i++) {
                        if (value == this._arrHRelative[i].value) {
                            this.cmbHRelative.setValue(value);
                            this.cmbHPosition.setValue(value);
                            this._state.HPositionFrom = value;
                            this._state.HAlignFrom = value;
                            break;
                        }
                    }
                    if (Position.get_UseAlign()) {
                        value = Position.get_Align();
                        for (var i = 0; i < this._arrHAlign.length; i++) {
                            if (value == this._arrHAlign[i].value) {
                                this.cmbHAlign.setValue(value);
                                this._state.HAlignType = value;
                                break;
                            }
                        }
                        value = this._originalProps.get_Value_X(this._state.HPositionFrom);
                        this.spnX.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                    } else {
                        this.radioHPosition.setValue(true);
                        value = Position.get_Value();
                        this.spnX.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                    }
                } else {
                    value = this._originalProps.get_Value_X(this._state.HPositionFrom);
                    this.spnX.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                }
                Position = props.get_PositionV();
                if (Position) {
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
                    if (value == c_oAscVAnchor.Text) {
                        this.chMove.setValue(true, true);
                    }
                    if (Position.get_UseAlign()) {
                        value = Position.get_Align();
                        for (i = 0; i < this._arrVAlign.length; i++) {
                            if (value == this._arrVAlign[i].value) {
                                this.cmbVAlign.setValue(value);
                                this._state.VAlignType = value;
                                break;
                            }
                        }
                        value = props.get_Value_Y(this._state.VPositionFrom);
                        this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                    } else {
                        this.radioVPosition.setValue(true);
                        value = Position.get_Value();
                        this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                    }
                } else {
                    value = props.get_Value_Y(this._state.VPositionFrom);
                    this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(value));
                }
                this.chOverlap.setValue((props.get_AllowOverlap() !== null) ? props.get_AllowOverlap() : "indeterminate", true);
                this._state.verticalPropChanged = false;
                this._state.horizontalPropChanged = false;
                this.TableBorders = new CBorders(props.get_TableBorders());
                this.CellBorders = new CBorders(props.get_CellBorders());
                this._UpdateBordersNoSpacing_();
                this._UpdateBordersSpacing_();
                var disable_inner = (this.CellBorders.get_InsideV() === null && this.CellBorders.get_InsideH() === null);
                this._btnsBorderPosition[0].setDisabled(disable_inner && !this._allTable);
                this._btnsTableBorderPosition[0].setDisabled(disable_inner && !this._allTable);
                this._btnsTableBorderPosition[6].setDisabled(disable_inner && !this._allTable);
                var background = props.get_TableBackground();
                if (background && background.get_Value() == 0) {
                    var color = background.get_Color();
                    if (color) {
                        if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                            this.TableColor = {
                                Value: 1,
                                Color: {
                                    color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                    effectValue: color.get_value()
                                }
                            };
                        } else {
                            this.TableColor = {
                                Value: 1,
                                Color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b())
                            };
                        }
                    } else {
                        this.TableColor = {
                            Value: 1,
                            Color: "transparent"
                        };
                    }
                } else {
                    this.TableColor = {
                        Value: 0,
                        Color: "transparent"
                    };
                }
                background = props.get_CellsBackground();
                if (background) {
                    if (background.get_Value() == 0) {
                        var color = background.get_Color();
                        if (color) {
                            if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                this.CellColor = {
                                    Value: 1,
                                    Color: {
                                        color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                        effectValue: color.get_value()
                                    }
                                };
                            } else {
                                this.CellColor = {
                                    Value: 1,
                                    Color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b())
                                };
                            }
                        } else {
                            this.CellColor = {
                                Value: 1,
                                Color: "transparent"
                            };
                        }
                    } else {
                        this.CellColor = {
                            Value: 1,
                            Color: "transparent"
                        };
                    }
                } else {
                    this.CellColor = {
                        Value: 0,
                        Color: "transparent"
                    };
                }
                this.btnBackColor.setColor(this.CellColor.Color);
                if (typeof(this.CellColor.Color) == "object") {
                    var isselected = false;
                    for (var i = 0; i < 10; i++) {
                        if (Common.Utils.ThemeColor.ThemeValues[i] == this.CellColor.Color.effectValue) {
                            this.colorsBack.select(this.CellColor.Color, true);
                            isselected = true;
                            break;
                        }
                    }
                    if (!isselected) {
                        this.colorsBack.clearSelection();
                    }
                } else {
                    this.colorsBack.select(this.CellColor.Color, true);
                }
                this.btnTableBackColor.setColor(this.TableColor.Color);
                if (typeof(this.TableColor.Color) == "object") {
                    var isselected = false;
                    for (var i = 0; i < 10; i++) {
                        if (Common.Utils.ThemeColor.ThemeValues[i] == this.TableColor.Color.effectValue) {
                            this.colorsTableBack.select(this.TableColor.Color, true);
                            isselected = true;
                            break;
                        }
                    }
                    if (!isselected) {
                        this.colorsTableBack.clearSelection();
                    }
                } else {
                    this.colorsTableBack.select(this.TableColor.Color, true);
                }
                this.ShowHideSpacing(this.chAllowSpacing.getValue() === "checked");
            }
            this._changedProps = new CTableProp();
            this._cellBackground = null;
            this.ChangedTableBorders = undefined;
            this.ChangedCellBorders = undefined;
        },
        fillMargins: function (checkMarginsState) {
            this.spnMarginLeft.setValue((this.CellMargins.Left !== null) ? this.CellMargins.Left : "", true);
            this.spnMarginTop.setValue((this.CellMargins.Top !== null) ? this.CellMargins.Top : "", true);
            this.spnMarginRight.setValue((this.CellMargins.Right !== null) ? this.CellMargins.Right : "", true);
            this.spnMarginBottom.setValue((this.CellMargins.Bottom !== null) ? this.CellMargins.Bottom : "", true);
            var disabled = (checkMarginsState == "checked");
            this.spnMarginTop.setDisabled(disabled);
            this.spnMarginBottom.setDisabled(disabled);
            this.spnMarginLeft.setDisabled(disabled);
            this.spnMarginRight.setDisabled(disabled);
            this.spnTableMarginLeft.setValue((this.TableMargins.Left !== null) ? this.TableMargins.Left : "", true);
            this.spnTableMarginTop.setValue((this.TableMargins.Top !== null) ? this.TableMargins.Top : "", true);
            this.spnTableMarginRight.setValue((this.TableMargins.Right !== null) ? this.TableMargins.Right : "", true);
            this.spnTableMarginBottom.setValue((this.TableMargins.Bottom !== null) ? this.TableMargins.Bottom : "", true);
        },
        _TblWrapStyleChanged: function (style) {
            if (style == c_tableWrap.TABLE_WRAP_NONE) {
                this.btnWrapNone.toggle(true);
            } else {
                this.btnWrapParallel.toggle(true);
            }
            this._state.fromWrapInline = (style == c_tableWrap.TABLE_WRAP_NONE);
        },
        _TblAlignChanged: function (style) {
            if (style == c_tableAlign.TABLE_ALIGN_LEFT) {
                this.btnAlignLeft.toggle(true, true);
            } else {
                if (style == c_tableAlign.TABLE_ALIGN_CENTER) {
                    this.btnAlignCenter.toggle(true, true);
                } else {
                    this.btnAlignRight.toggle(true, true);
                }
            }
        },
        onBtnInlineWrapClick: function (btn, e) {
            this.ShowHideWrap(true);
            if (this._changedProps && btn.pressed) {
                if (this._state.alignChanged) {
                    if (this._state.HAlignType === c_oAscXAlign.Left) {
                        this.btnAlignLeft.toggle(true, true);
                    } else {
                        if (this._state.HAlignType == c_oAscXAlign.Center) {
                            this.btnAlignCenter.toggle(true, true);
                        } else {
                            if (this._state.HAlignType == c_oAscXAlign.Right) {
                                this.btnAlignRight.toggle(true, true);
                            }
                        }
                    }
                    this._state.alignChanged = false;
                }
                this._changedProps.put_TableWrap(btn.options.posId);
                if (this.btnAlignLeft.pressed) {
                    this._changedProps.put_TableAlignment(c_tableAlign.TABLE_ALIGN_LEFT);
                } else {
                    if (this.btnAlignCenter.pressed) {
                        this._changedProps.put_TableAlignment(c_tableAlign.TABLE_ALIGN_CENTER);
                    } else {
                        this._changedProps.put_TableAlignment(c_tableAlign.TABLE_ALIGN_RIGHT);
                    }
                }
                this.spnIndentLeft.setDisabled(!this.btnAlignLeft.pressed);
                this._changedProps.put_TableIndent(Common.Utils.Metric.fnRecalcToMM(this.spnIndentLeft.getNumberValue()));
            }
        },
        onBtnFlowWrapClick: function (btn, e) {
            this.ShowHideWrap(false);
            if (this._changedProps && btn.pressed) {
                this._changedProps.put_TableWrap(btn.options.posId);
                this._changedProps.put_TableAlignment(null);
                this._changedProps.put_TableIndent(null);
                if (this._state.fromWrapInline && !this._state.verticalPropChanged) {
                    this.radioVPosition.setValue(true);
                }
                if (this._state.alignChanged) {
                    if (this.btnAlignLeft.pressed) {
                        this._state.HAlignType = c_oAscXAlign.Left;
                    } else {
                        if (this.btnAlignCenter.pressed) {
                            this._state.HAlignType = c_oAscXAlign.Center;
                        } else {
                            this._state.HAlignType = c_oAscXAlign.Right;
                        }
                    }
                    this.cmbHAlign.setValue(this._state.HAlignType);
                    this.radioHAlign.setValue(true);
                    if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                        this._changedProps.put_PositionH(new CTablePositionH());
                    }
                    this._changedProps.get_PositionH().put_UseAlign(true);
                    this._changedProps.get_PositionH().put_Align(this._state.HAlignType);
                    this._changedProps.get_PositionH().put_RelativeFrom(this._state.HAlignFrom);
                    this._state.alignChanged = false;
                    this._state.horizontalPropChanged = true;
                } else {
                    if (this._state.fromWrapInline && !this._state.horizontalPropChanged) {
                        this.radioHPosition.setValue(true);
                    }
                }
            }
        },
        onHAlignSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CTablePositionH());
                }
                this._state.HAlignType = record.value;
                this._changedProps.get_PositionH().put_UseAlign(true);
                this._changedProps.get_PositionH().put_RelativeFrom(this._state.HAlignFrom);
                this._changedProps.get_PositionH().put_Align(this._state.HAlignType);
                this._state.alignChanged = true;
            }
        },
        onHRelativeSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CTablePositionH());
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
                    this._changedProps.put_PositionH(new CTablePositionH());
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
                    this._changedProps.put_PositionV(new CTablePositionV());
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
                    this._changedProps.put_PositionV(new CTablePositionV());
                }
                this._state.VAlignFrom = record.value;
                this._changedProps.get_PositionV().put_UseAlign(true);
                this._changedProps.get_PositionV().put_RelativeFrom(this._state.VAlignFrom);
                this._changedProps.get_PositionV().put_Align(this._state.VAlignType);
                this.chMove.setValue(this._state.VAlignFrom == c_oAscVAnchor.Text, true);
            }
        },
        onVPositionSelect: function (combo, record) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CTablePositionV());
                }
                this._state.VPositionFrom = record.value;
                this._changedProps.get_PositionV().put_UseAlign(false);
                this._changedProps.get_PositionV().put_RelativeFrom(this._state.VPositionFrom);
                if (!this._state.spnYChanged) {
                    var val = this._originalProps.get_Value_Y(this._state.VPositionFrom);
                    this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(val), true);
                }
                this._changedProps.get_PositionV().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnY.getNumberValue()));
                this.chMove.setValue(this._state.VPositionFrom == c_oAscVAnchor.Text, true);
            }
        },
        onRadioHAlignChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CTablePositionH());
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
                this._state.horizontalPropChanged = true;
                this._state.alignChanged = true;
            }
        },
        onRadioHPositionChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                    this._changedProps.put_PositionH(new CTablePositionH());
                }
                this._changedProps.get_PositionH().put_UseAlign(!newValue);
                if (newValue) {
                    if (!this._state.spnXChanged) {
                        var val = this._originalProps.get_Value_X(this._state.HPositionFrom);
                        this.spnX.setValue(Common.Utils.Metric.fnRecalcFromMM(val));
                    }
                    this._changedProps.get_PositionH().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnX.getNumberValue()));
                    this._changedProps.get_PositionH().put_RelativeFrom(this._state.HPositionFrom);
                }
            }
            if (newValue) {
                this.cmbHAlign.setDisabled(true);
                this.cmbHRelative.setDisabled(true);
                this.spnX.setDisabled(false);
                this.cmbHPosition.setDisabled(false);
                this._state.alignChanged = false;
            }
        },
        onRadioVAlignChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CTablePositionV());
                }
                this._changedProps.get_PositionV().put_UseAlign(newValue);
                if (newValue) {
                    this._changedProps.get_PositionV().put_Align(this._state.VAlignType);
                    this._changedProps.get_PositionV().put_RelativeFrom(this._state.VAlignFrom);
                    this._state.verticalPropChanged = true;
                }
            }
            if (newValue) {
                this.cmbVAlign.setDisabled(false);
                this.cmbVRelative.setDisabled(false);
                this.spnY.setDisabled(true);
                this.cmbVPosition.setDisabled(true);
                this.chMove.setValue(this._state.VAlignFrom == c_oAscVAnchor.Text, true);
            }
        },
        onRadioVPositionChange: function (field, newValue, eOpts) {
            if (this._changedProps) {
                if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                    this._changedProps.put_PositionV(new CTablePositionV());
                }
                this._changedProps.get_PositionV().put_UseAlign(!newValue);
                if (newValue) {
                    if (!this._state.spnYChanged) {
                        var val = this._originalProps.get_Value_Y(this._state.VPositionFrom);
                        this.spnY.setValue(Common.Utils.Metric.fnRecalcFromMM(val));
                    }
                    this._changedProps.get_PositionV().put_Value(Common.Utils.Metric.fnRecalcToMM(this.spnY.getNumberValue()));
                    this._changedProps.get_PositionV().put_RelativeFrom(this._state.VPositionFrom);
                }
            }
            if (newValue) {
                this.cmbVAlign.setDisabled(true);
                this.cmbVRelative.setDisabled(true);
                this.spnY.setDisabled(false);
                this.cmbVPosition.setDisabled(false);
                this.chMove.setValue(this._state.VPositionFrom == c_oAscVAnchor.Text, true);
            }
        },
        onBorderSizeSelect: function (combo, record) {
            this.BorderSize = {
                ptValue: record.value,
                pxValue: record.pxValue
            };
            this.tableBordersImage.setVirtualBorderSize(this.BorderSize.pxValue);
            this.tableBordersImageSpacing.setVirtualBorderSize(this.BorderSize.pxValue);
        },
        addNewColor: function (picker, btn) {
            picker.addNewColor((typeof(btn.color) == "object") ? btn.color.color : btn.color);
        },
        onColorsBorderSelect: function (picker, color) {
            this.btnBorderColor.setColor(color);
            var colorstr = (typeof(color) == "object") ? color.color : color;
            this.tableBordersImage.setVirtualBorderColor(colorstr);
            this.tableBordersImageSpacing.setVirtualBorderColor(colorstr);
        },
        onColorsBackSelect: function (picker, color) {
            this.btnBackColor.setColor(color);
            this.CellColor = {
                Value: 1,
                Color: color
            };
            if (this._cellBackground === null) {
                this._cellBackground = new CBackground();
            }
            if (this.CellColor.Color == "transparent") {
                this._cellBackground.put_Value(1);
                this._cellBackground.put_Color(new CAscColor(0, 0, 0));
            } else {
                this._cellBackground.put_Value(0);
                this._cellBackground.put_Color(Common.Utils.ThemeColor.getRgbColor(this.CellColor.Color));
            }
        },
        onColorsTableBackSelect: function (picker, color) {
            this.btnTableBackColor.setColor(color);
            this.TableColor.Color = color;
            if (this._changedProps) {
                var background = this._changedProps.get_TableBackground();
                if (background === undefined) {
                    background = new CBackground();
                    this._changedProps.put_TableBackground(background);
                }
                if (this.TableColor.Color == "transparent") {
                    background.put_Value(1);
                    background.put_Color(new CAscColor(0, 0, 0));
                } else {
                    background.put_Value(0);
                    background.put_Color(Common.Utils.ThemeColor.getRgbColor(this.TableColor.Color));
                }
            }
        },
        _UpdateBordersSpacing_: function () {
            var source = this.TableBorders;
            var oldSize = this.BorderSize;
            var oldColor = this.btnBorderColor.color;
            this._UpdateTableBorderSpacing_(source.get_Left(), "l");
            this._UpdateTableBorderSpacing_(source.get_Top(), "t");
            this._UpdateTableBorderSpacing_(source.get_Right(), "r");
            this._UpdateTableBorderSpacing_(source.get_Bottom(), "b");
            source = this.CellBorders;
            for (var i = 0; i < this.tableBordersImageSpacing.rows; i++) {
                this._UpdateCellBorderSpacing_(source.get_Left(), "l", this.tableBordersImageSpacing.getCell(0, i));
            }
            for (i = 0; i < this.tableBordersImageSpacing.rows; i++) {
                this._UpdateCellBorderSpacing_(source.get_Right(), "r", this.tableBordersImageSpacing.getCell(this.tableBordersImageSpacing.columns - 1, i));
            }
            for (i = 0; i < this.tableBordersImageSpacing.columns; i++) {
                this._UpdateCellBorderSpacing_(source.get_Top(), "t", this.tableBordersImageSpacing.getCell(i, 0));
            }
            for (i = 0; i < this.tableBordersImageSpacing.columns; i++) {
                this._UpdateCellBorderSpacing_(source.get_Bottom(), "b", this.tableBordersImageSpacing.getCell(i, this.tableBordersImageSpacing.rows - 1));
            }
            if (this._allTable && source.get_InsideV() === null) {
                source.put_InsideV(new CBorder());
            }
            if (source.get_InsideV() !== null) {
                for (i = 0; i < this.tableBordersImageSpacing.rows; i++) {
                    this._UpdateCellBorderSpacing_(source.get_InsideV(), "r", this.tableBordersImageSpacing.getCell(0, i));
                    this._UpdateCellBorderSpacing_(source.get_InsideV(), "l", this.tableBordersImageSpacing.getCell(1, i));
                }
            }
            if (this._allTable && source.get_InsideH() === null) {
                source.put_InsideH(new CBorder());
            }
            if (source.get_InsideH() !== null) {
                for (i = 0; i < this.tableBordersImageSpacing.columns; i++) {
                    this._UpdateCellBorderSpacing_(source.get_InsideH(), "b", this.tableBordersImageSpacing.getCell(i, 0));
                    this._UpdateCellBorderSpacing_(source.get_InsideH(), "t", this.tableBordersImageSpacing.getCell(i, 1));
                }
            }
            this.tableBordersImageSpacing.setVirtualBorderSize(oldSize.pxValue);
            this.tableBordersImageSpacing.setVirtualBorderColor((typeof(oldColor) == "object") ? oldColor.color : oldColor);
        },
        _UpdateCellBorderSpacing_: function (BorderParam, borderName, cell) {
            if (null !== BorderParam && undefined !== BorderParam) {
                if (null !== BorderParam.get_Value() && null !== BorderParam.get_Size() && null !== BorderParam.get_Color()) {
                    if (1 == BorderParam.get_Value()) {
                        cell.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                        cell.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                    } else {
                        cell.setBordersSize(borderName, 0);
                    }
                } else {
                    cell.setBordersSize(borderName, this.IndeterminateSize);
                    cell.setBordersColor(borderName, this.IndeterminateColor);
                }
            } else {
                cell.setBordersSize(borderName, this.IndeterminateSize);
                cell.setBordersColor(borderName, this.IndeterminateColor);
            }
        },
        _UpdateTableBorderSpacing_: function (BorderParam, borderName) {
            if (null !== BorderParam && undefined !== BorderParam) {
                if (null !== BorderParam.get_Value() && null !== BorderParam.get_Size() && null !== BorderParam.get_Color()) {
                    if (1 == BorderParam.get_Value()) {
                        this.tableBordersImageSpacing.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                        this.tableBordersImageSpacing.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                    } else {
                        this.tableBordersImageSpacing.setBordersSize(borderName, 0);
                    }
                } else {
                    this.tableBordersImageSpacing.setBordersSize(borderName, this.IndeterminateSize);
                    this.tableBordersImageSpacing.setBordersColor(borderName, this.IndeterminateColor);
                }
            } else {
                this.tableBordersImageSpacing.setBordersSize(borderName, this.IndeterminateSize);
                this.tableBordersImageSpacing.setBordersColor(borderName, this.IndeterminateColor);
            }
        },
        _UpdateBordersNoSpacing_: function () {
            var source = (this._allTable) ? this.TableBorders : this.CellBorders;
            var oldSize = this.BorderSize;
            var oldColor = this.btnBorderColor.color;
            this._UpdateTableBorderNoSpacing_(source.get_Left(), "l");
            this._UpdateTableBorderNoSpacing_(source.get_Top(), "t");
            this._UpdateTableBorderNoSpacing_(source.get_Right(), "r");
            this._UpdateTableBorderNoSpacing_(source.get_Bottom(), "b");
            if (this._allTable && source.get_InsideV() == null) {
                source.put_InsideV(new CBorder());
            }
            if (source.get_InsideV() !== null) {
                for (var i = 0; i < this.tableBordersImage.rows; i++) {
                    this._UpdateCellBorderNoSpacing_(source.get_InsideV(), "r", this.tableBordersImage.getCell(0, i));
                    this._UpdateCellBorderNoSpacing_(source.get_InsideV(), "l", this.tableBordersImage.getCell(1, i));
                }
            }
            if (this._allTable && source.get_InsideH() == null) {
                source.put_InsideH(new CBorder());
            }
            if (source.get_InsideH() !== null) {
                for (i = 0; i < this.tableBordersImage.columns; i++) {
                    this._UpdateCellBorderNoSpacing_(source.get_InsideH(), "b", this.tableBordersImage.getCell(i, 0));
                    this._UpdateCellBorderNoSpacing_(source.get_InsideH(), "t", this.tableBordersImage.getCell(i, 1));
                }
            }
            this.tableBordersImage.setVirtualBorderSize(oldSize.pxValue);
            this.tableBordersImage.setVirtualBorderColor((typeof(oldColor) == "object") ? oldColor.color : oldColor);
        },
        _UpdateCellBorderNoSpacing_: function (BorderParam, borderName, cell) {
            if (null !== BorderParam && undefined !== BorderParam) {
                if (null !== BorderParam.get_Value() && null !== BorderParam.get_Size() && null !== BorderParam.get_Color()) {
                    if (1 == BorderParam.get_Value()) {
                        cell.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                        cell.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                    } else {
                        cell.setBordersSize(borderName, 0);
                    }
                } else {
                    cell.setBordersSize(borderName, this.IndeterminateSize);
                    cell.setBordersColor(borderName, this.IndeterminateColor);
                }
            } else {
                cell.setBordersSize(borderName, this.IndeterminateSize);
                cell.setBordersColor(borderName, this.IndeterminateColor);
            }
        },
        _UpdateTableBorderNoSpacing_: function (BorderParam, borderName) {
            if (null !== BorderParam && undefined !== BorderParam) {
                if (null !== BorderParam.get_Value() && null !== BorderParam.get_Size() && null !== BorderParam.get_Color()) {
                    if (1 == BorderParam.get_Value()) {
                        this.tableBordersImage.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                        this.tableBordersImage.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                    } else {
                        this.tableBordersImage.setBordersSize(borderName, 0);
                    }
                } else {
                    this.tableBordersImage.setBordersSize(borderName, this.IndeterminateSize);
                    this.tableBordersImage.setBordersColor(borderName, this.IndeterminateColor);
                }
            } else {
                this.tableBordersImage.setBordersSize(borderName, this.IndeterminateSize);
                this.tableBordersImage.setBordersColor(borderName, this.IndeterminateColor);
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
        _ApplyBorderPreset: function (btn) {
            var cellborder = (btn.options.strId !== undefined) ? btn.options.strId : btn.options.strCellId;
            var tableborder = btn.options.strTableId;
            var updateBorders;
            if (this._allTable && tableborder === undefined) {
                updateBorders = this.TableBorders;
                this.ChangedTableBorders = null;
            } else {
                updateBorders = this.CellBorders;
                this.ChangedCellBorders = null;
            }
            this._UpdateBorderStyle(updateBorders.get_Left(), (cellborder.indexOf("l") > -1));
            this._UpdateBorderStyle(updateBorders.get_Top(), (cellborder.indexOf("t") > -1));
            this._UpdateBorderStyle(updateBorders.get_Right(), (cellborder.indexOf("r") > -1));
            this._UpdateBorderStyle(updateBorders.get_Bottom(), (cellborder.indexOf("b") > -1));
            this._UpdateBorderStyle(updateBorders.get_InsideV(), (cellborder.indexOf("c") > -1));
            this._UpdateBorderStyle(updateBorders.get_InsideH(), (cellborder.indexOf("m") > -1));
            if (tableborder === undefined) {
                this._UpdateBordersNoSpacing_();
                if (this._allTable) {
                    updateBorders = this.CellBorders;
                    this.ChangedCellBorders = null;
                    this._UpdateBorderStyle(updateBorders.get_Left(), (cellborder.indexOf("l") > -1));
                    this._UpdateBorderStyle(updateBorders.get_Top(), (cellborder.indexOf("t") > -1));
                    this._UpdateBorderStyle(updateBorders.get_Right(), (cellborder.indexOf("r") > -1));
                    this._UpdateBorderStyle(updateBorders.get_Bottom(), (cellborder.indexOf("b") > -1));
                    this._UpdateBorderStyle(updateBorders.get_InsideV(), (cellborder.indexOf("c") > -1));
                    this._UpdateBorderStyle(updateBorders.get_InsideH(), (cellborder.indexOf("m") > -1));
                }
                return;
            }
            updateBorders = this.TableBorders;
            this.ChangedTableBorders = null;
            this._UpdateBorderStyle(updateBorders.get_Left(), (tableborder.indexOf("l") > -1));
            this._UpdateBorderStyle(updateBorders.get_Top(), (tableborder.indexOf("t") > -1));
            this._UpdateBorderStyle(updateBorders.get_Right(), (tableborder.indexOf("r") > -1));
            this._UpdateBorderStyle(updateBorders.get_Bottom(), (tableborder.indexOf("b") > -1));
            this._UpdateBordersSpacing_();
        },
        _UpdateCellBordersStyle: function (ct, border, size, color, destination, changed_destination) {
            var updateBorders = destination;
            if (ct.col == 0 && border.indexOf("l") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Left(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Left(new CBorder(updateBorders.get_Left()));
                }
            }
            if (ct.col == this.tableStylerColumns - 1 && border.indexOf("r") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Right(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Right(new CBorder(updateBorders.get_Right()));
                }
            }
            if (ct.row == 0 && border.indexOf("t") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Top(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Top(new CBorder(updateBorders.get_Top()));
                }
            }
            if (ct.row == this.tableStylerRows - 1 && border.indexOf("b") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Bottom(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Bottom(new CBorder(updateBorders.get_Bottom()));
                }
            }
            if (ct.col == 0 && border.indexOf("r") > -1 || ct.col == this.tableStylerColumns - 1 && border.indexOf("l") > -1) {
                this._UpdateBorderStyle(updateBorders.get_InsideV(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_InsideV(new CBorder(updateBorders.get_InsideV()));
                }
            }
            if (ct.row == 0 && border.indexOf("b") > -1 || ct.row == this.tableStylerRows - 1 && border.indexOf("t") > -1) {
                this._UpdateBorderStyle(updateBorders.get_InsideH(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_InsideH(new CBorder(updateBorders.get_InsideH()));
                }
            }
        },
        _UpdateTableBordersStyle: function (ct, border, size, color, destination, changed_destination) {
            var updateBorders = destination;
            if (border.indexOf("l") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Left(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Left(new CBorder(updateBorders.get_Left()));
                }
            }
            if (border.indexOf("t") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Top(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Top(new CBorder(updateBorders.get_Top()));
                }
            }
            if (border.indexOf("r") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Right(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Right(new CBorder(updateBorders.get_Right()));
                }
            }
            if (border.indexOf("b") > -1) {
                this._UpdateBorderStyle(updateBorders.get_Bottom(), (size > 0));
                if (changed_destination) {
                    changed_destination.put_Bottom(new CBorder(updateBorders.get_Bottom()));
                }
            }
        },
        _UpdateBorderStyle: function (border, visible) {
            if (null == border) {
                return 0;
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
            return border.get_Value();
        },
        onCellCategoryClick: function (btn) {
            if (this.CellMargins.Flag == "checked" && this.TableMargins.isChanged) {
                this.CellMargins.Left = this.TableMargins.Left;
                this.CellMargins.Top = this.TableMargins.Top;
                this.CellMargins.Right = this.TableMargins.Right;
                this.CellMargins.Bottom = this.TableMargins.Bottom;
                this.spnMarginRight.setValue(this.CellMargins.Right, true);
                this.spnMarginLeft.setValue(this.CellMargins.Left, true);
                this.spnMarginBottom.setValue(this.CellMargins.Bottom, true);
                this.spnMarginTop.setValue(this.CellMargins.Top, true);
            }
            this.TableMargins.isChanged = false;
        },
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        },
        updateThemeColors: function () {
            this.colorsBorder.updateColors(Common.Utils.ThemeColor.getEffectColors(), Common.Utils.ThemeColor.getStandartColors());
            this.colorsBack.updateColors(Common.Utils.ThemeColor.getEffectColors(), Common.Utils.ThemeColor.getStandartColors());
            this.colorsTableBack.updateColors(Common.Utils.ThemeColor.getEffectColors(), Common.Utils.ThemeColor.getStandartColors());
        },
        ShowHideWrap: function (inline) {
            this.AlignContainer.toggleClass("settings-hidden", !inline);
            this.DistanceContainer.toggleClass("settings-hidden", inline);
            this.btnsCategory[3].setDisabled(inline);
        },
        ShowHideSpacing: function (spacing) {
            this.BordersContainer.toggleClass("settings-hidden", spacing);
            this.BordersSpacingContainer.toggleClass("settings-hidden", !spacing);
            this.TableBackContainer.css("display", (!spacing && !this._allTable) ? "none" : "inline-block");
            this.CellBackContainer.css("display", (!spacing && this._allTable) ? "none" : "inline-block");
            this.TableBackContainer.css("float", (!spacing && this._allTable) ? "none" : "right");
            (spacing) ? this._UpdateBordersSpacing_() : this._UpdateBordersNoSpacing_();
        },
        textWidth: "Width",
        textAllowSpacing: "Allow spacing between cells",
        textAlign: "Alignment",
        textIndLeft: "Indent from Left",
        textWidthSpaces: "Width & Spaces",
        textWrap: "Text Wrapping",
        textMargins: "Cell Margins",
        textTop: "Top",
        textLeft: "Left",
        textBottom: "Bottom",
        textRight: "Right",
        textDistance: "Distance From Text",
        textPosition: "Position",
        textWrapParallelTooltip: "Flow table",
        textWrapNoneTooltip: "Inline table",
        textLeftTooltip: "Left",
        textRightTooltip: "Right",
        textCenterTooltip: "Center",
        textTitle: "Table - Advanced Settings",
        textDefaultMargins: "Default Margins",
        textCheckMargins: "Use default margins",
        textBordersBackgroung: "Borders & Background",
        textOnlyCells: "For selected cells only",
        textBorderWidth: "Border Size",
        textBorderColor: "Border Color",
        textBackColor: "Cell Background",
        textPreview: "Preview",
        textBorderDesc: "Click on diagramm or use buttons to select borders",
        textTableBackColor: "Table Background",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        txtNoBorders: "No borders",
        textNewColor: "Add New Custom Color",
        textThemeColors: "Theme Colors",
        textStandartColors: "Standart Colors",
        textCenter: "Center",
        textMargin: "Margin",
        textPage: "Page",
        textHorizontal: "Horizontal",
        textVertical: "Vertical",
        textAlignment: "Alignment",
        textRelative: "relative to",
        textRightOf: "to the right Of",
        textBelow: "below",
        textOverlap: "Allow overlap",
        textMove: "Move object with text",
        textOptions: "Options",
        textAnchorText: "Text",
        textAutofit: "Automatically resize to fit contents",
        textCellProps: "Cell Properties",
        tipAll: "Set Outer Border and All Inner Lines",
        tipNone: "Set No Borders",
        tipInner: "Set Inner Lines Only",
        tipOuter: "Set Outer Border Only",
        tipCellAll: "Set Borders for Inner Cells Only",
        tipTableOuterCellAll: "Set Outer Border and Borders for All Inner Cells",
        tipCellInner: "Set Vertical and Horizontal Lines for Inner Cells Only",
        tipTableOuterCellInner: "Set Outer Border and Vertical and Horizontal Lines for Inner Cells",
        tipCellOuter: "Set Outer Borders for Inner Cells Only",
        tipTableOuterCellOuter: "Set Table Outer Border and Outer Borders for Inner Cells"
    },
    DE.Views.TableSettingsAdvanced || {}));
});