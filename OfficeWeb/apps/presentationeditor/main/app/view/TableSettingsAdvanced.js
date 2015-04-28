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
 define(["text!presentationeditor/main/app/template/TableSettingsAdvanced.template", "common/main/lib/view/AdvancedSettingsWindow", "common/main/lib/component/MetricSpinner"], function (contentTemplate) {
    PE.Views.TableSettingsAdvanced = Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            alias: "TableSettingsAdvanced",
            contentWidth: 280,
            height: 385
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle,
                template: ['<div class="box" style="height:' + (this.options.height - 85) + 'px;">', '<div class="menu-panel" style="overflow: hidden;">', '<div style="height: 300px; line-height: 300px;" class="div-category">' + this.textWidthSpaces + "</div>", "</div>", '<div class="separator"/>', '<div class="content-panel">' + _.template(contentTemplate)({
                    scope: this
                }) + "</div>", "</div>", '<div class="separator horizontal"/>', '<div class="footer center">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;  width: 86px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel" style="width: 86px;">' + this.cancelButtonText + "</button>", "</div>"].join("")
            },
            options);
            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
            this.spinners = [];
            this._changedProps = null;
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
            this._initialMarginsDefault = false;
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
            this.afterRender();
        },
        afterRender: function () {
            this.updateMetricUnit();
            this._setDefaults(this._originalProps);
        },
        getSettings: function () {
            return {
                tableProps: this._changedProps
            };
        },
        _setDefaults: function (props) {
            if (props) {
                this._allTable = !props.get_CellSelect();
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
                this._changedProps = new CTableProp();
            }
        },
        fillMargins: function (checkMarginsState) {
            if (this._initialMarginsDefault && checkMarginsState == "unchecked") {
                if (this.CellMargins.Left === null) {
                    this.CellMargins.Left = 0;
                }
                if (this.CellMargins.Top === null) {
                    this.CellMargins.Top = 0;
                }
                if (this.CellMargins.Right === null) {
                    this.CellMargins.Right = 0;
                }
                if (this.CellMargins.Bottom === null) {
                    this.CellMargins.Bottom = 0;
                }
            }
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
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        },
        textWidthSpaces: "Margins",
        textMargins: "Cell Margins",
        textTop: "Top",
        textLeft: "Left",
        textBottom: "Bottom",
        textRight: "Right",
        textTitle: "Table - Advanced Settings",
        textDefaultMargins: "Default Margins",
        textCheckMargins: "Use default margins",
        cancelButtonText: "Cancel",
        okButtonText: "Ok"
    },
    PE.Views.TableSettingsAdvanced || {}));
});