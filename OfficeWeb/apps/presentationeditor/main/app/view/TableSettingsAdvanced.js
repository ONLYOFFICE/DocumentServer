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
 Ext.define("PE.view.TableSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.petablesettingsadvanced",
    requires: ["Common.component.MetricSpinner", "Ext.window.Window", "Ext.form.field.Checkbox", "Ext.Button", "Ext.container.Container", "Common.component.IndeterminateCheckBox", "Ext.Array"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 396,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {},
    initComponent: function () {
        this.addEvents("onmodalresult");
        this.controls = [];
        this._originalProps = null;
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
        this._marginsChange = function (field, newValue, oldValue, eOpts, source, property) {
            if (source == "table") {
                this.TableMargins[property] = field.getNumberValue();
            } else {
                this.CellMargins[property] = field.getNumberValue();
            }
        };
        this._chCellMargins = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "tableadv-checkbox-margins",
            boxLabel: this.textCheckMargins,
            checked: true,
            style: "margin-left:10px;",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (oldValue == "checked" && this._originalProps && this._originalProps.get_CellMargins().get_Flag() == 1) {
                        field.suspendEvents(false);
                        field.setValue("indeterminate");
                        field.resumeEvents();
                    }
                    this.fillMargins.call(this, field.getValue());
                    this.CellMargins.Flag = field.getValue();
                    if (this._changedProps) {
                        if (this._changedProps.get_CellMargins() === undefined) {
                            this._changedProps.put_CellMargins(new CMargins());
                        }
                        this._changedProps.get_CellMargins().put_Left((this.CellMargins.Left !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Left) : null);
                        this._changedProps.get_CellMargins().put_Top((this.CellMargins.Top !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Top) : null);
                        this._changedProps.get_CellMargins().put_Bottom((this.CellMargins.Bottom !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Bottom) : null);
                        this._changedProps.get_CellMargins().put_Right((this.CellMargins.Right !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Right) : null);
                        if (this.CellMargins.Flag == "indeterminate") {
                            this._changedProps.get_CellMargins().put_Flag(1);
                        } else {
                            if (this.CellMargins.Flag == "checked") {
                                this._changedProps.get_CellMargins().put_Flag(0);
                            } else {
                                this._changedProps.get_CellMargins().put_Flag(2);
                            }
                        }
                    }
                },
                this)
            }
        });
        this.controls.push(this._chCellMargins);
        this._spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-top",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Top");
                    if (this._changedProps) {
                        if (this._changedProps.get_CellMargins() === undefined) {
                            this._changedProps.put_CellMargins(new CMargins());
                        }
                        this._changedProps.get_CellMargins().put_Top((this.CellMargins.Top !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Top) : null);
                        if (this.CellMargins.Flag == "indeterminate") {
                            this._changedProps.get_CellMargins().put_Flag(1);
                        } else {
                            if (this.CellMargins.Flag == "checked") {
                                this._changedProps.get_CellMargins().put_Flag(0);
                            } else {
                                this._changedProps.get_CellMargins().put_Flag(2);
                            }
                        }
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnMarginTop);
        this._spnMarginBottom = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-bottom",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Bottom");
                    if (this._changedProps) {
                        if (this._changedProps.get_CellMargins() === undefined) {
                            this._changedProps.put_CellMargins(new CMargins());
                        }
                        this._changedProps.get_CellMargins().put_Bottom((this.CellMargins.Bottom !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Bottom) : null);
                        if (this.CellMargins.Flag == "indeterminate") {
                            this._changedProps.get_CellMargins().put_Flag(1);
                        } else {
                            if (this.CellMargins.Flag == "checked") {
                                this._changedProps.get_CellMargins().put_Flag(0);
                            } else {
                                this._changedProps.get_CellMargins().put_Flag(2);
                            }
                        }
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnMarginBottom);
        this._spnMarginLeft = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-left",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Left");
                    if (this._changedProps) {
                        if (this._changedProps.get_CellMargins() === undefined) {
                            this._changedProps.put_CellMargins(new CMargins());
                        }
                        this._changedProps.get_CellMargins().put_Left((this.CellMargins.Left !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Left) : null);
                        if (this.CellMargins.Flag == "indeterminate") {
                            this._changedProps.get_CellMargins().put_Flag(1);
                        } else {
                            if (this.CellMargins.Flag == "checked") {
                                this._changedProps.get_CellMargins().put_Flag(0);
                            } else {
                                this._changedProps.get_CellMargins().put_Flag(2);
                            }
                        }
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnMarginLeft);
        this._spnMarginRight = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-right",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "cell", "Right");
                    if (this._changedProps) {
                        if (this._changedProps.get_CellMargins() === undefined) {
                            this._changedProps.put_CellMargins(new CMargins());
                        }
                        this._changedProps.get_CellMargins().put_Right((this.CellMargins.Right !== null) ? Common.MetricSettings.fnRecalcToMM(this.CellMargins.Right) : null);
                        if (this.CellMargins.Flag == "indeterminate") {
                            this._changedProps.get_CellMargins().put_Flag(1);
                        } else {
                            if (this.CellMargins.Flag == "checked") {
                                this._changedProps.get_CellMargins().put_Flag(0);
                            } else {
                                this._changedProps.get_CellMargins().put_Flag(2);
                            }
                        }
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnMarginRight);
        this._spnTableMarginTop = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-table-top",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "table", "Top");
                    if (this._changedProps) {
                        if (this._changedProps.get_DefaultMargins() === undefined) {
                            this._changedProps.put_DefaultMargins(new CPaddings());
                        }
                        this._changedProps.get_DefaultMargins().put_Top((this.TableMargins.Top !== null) ? Common.MetricSettings.fnRecalcToMM(this.TableMargins.Top) : null);
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnTableMarginTop);
        this._spnTableMarginBottom = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-table-bottom",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "table", "Bottom");
                    if (this._changedProps) {
                        if (this._changedProps.get_DefaultMargins() === undefined) {
                            this._changedProps.put_DefaultMargins(new CPaddings());
                        }
                        this._changedProps.get_DefaultMargins().put_Bottom((this.TableMargins.Bottom !== null) ? Common.MetricSettings.fnRecalcToMM(this.TableMargins.Bottom) : null);
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnTableMarginBottom);
        this._spnTableMarginLeft = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-table-left",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "table", "Left");
                    if (this._changedProps) {
                        if (this._changedProps.get_DefaultMargins() === undefined) {
                            this._changedProps.put_DefaultMargins(new CPaddings());
                        }
                        this._changedProps.get_DefaultMargins().put_Left((this.TableMargins.Left !== null) ? Common.MetricSettings.fnRecalcToMM(this.TableMargins.Left) : null);
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnTableMarginLeft);
        this._spnTableMarginRight = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-margin-table-right",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._marginsChange(field, newValue, oldValue, eOpts, "table", "Right");
                    if (this._changedProps) {
                        if (this._changedProps.get_DefaultMargins() === undefined) {
                            this._changedProps.put_DefaultMargins(new CPaddings());
                        }
                        this._changedProps.get_DefaultMargins().put_Right((this.TableMargins.Right !== null) ? Common.MetricSettings.fnRecalcToMM(this.TableMargins.Right) : null);
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnTableMarginRight);
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.items = [{
            xtype: "container",
            height: 300,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                width: 160,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "container",
                    padding: "0 10 0 0",
                    layout: {
                        type: "hbox",
                        align: "middle",
                        pack: "end"
                    },
                    height: 300,
                    items: [{
                        xtype: "label",
                        text: this.textWidthSpaces,
                        style: "font-weight: bold;"
                    }]
                }]
            },
            {
                xtype: "box",
                cls: "advanced-settings-separator",
                height: "100%",
                width: 8
            },
            {
                xtype: "container",
                padding: "18 0 0 10",
                width: 330,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "label",
                    style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                    text: this.textMargins
                },
                {
                    xtype: "tbspacer",
                    height: 8
                },
                this._chCellMargins, {
                    xtype: "tbspacer",
                    height: 5
                },
                {
                    xtype: "container",
                    height: 86,
                    padding: "0 10",
                    layout: {
                        type: "table",
                        columns: 2,
                        tdAttrs: {
                            style: "padding-right: 40px;vertical-align: middle;"
                        }
                    },
                    items: [{
                        xtype: "label",
                        text: this.textTop,
                        width: 85
                    },
                    {
                        xtype: "label",
                        text: this.textLeft,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._spnMarginTop, this._spnMarginLeft, {
                        xtype: "tbspacer",
                        height: 5
                    },
                    {
                        xtype: "tbspacer",
                        height: 5
                    },
                    {
                        xtype: "label",
                        text: this.textBottom,
                        width: 85
                    },
                    {
                        xtype: "label",
                        text: this.textRight,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._spnMarginBottom, this._spnMarginRight]
                },
                {
                    xtype: "tbspacer",
                    height: 12
                },
                {
                    xtype: "label",
                    style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                    text: this.textDefaultMargins
                },
                {
                    xtype: "tbspacer",
                    height: 8
                },
                {
                    xtype: "container",
                    height: 84,
                    padding: "0 10",
                    layout: {
                        type: "table",
                        columns: 2,
                        tdAttrs: {
                            style: "padding-right: 40px;vertical-align: middle;"
                        }
                    },
                    items: [{
                        xtype: "label",
                        text: this.textTop,
                        width: 85
                    },
                    {
                        xtype: "label",
                        text: this.textLeft,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._spnTableMarginTop, this._spnTableMarginLeft, {
                        xtype: "tbspacer",
                        height: 5
                    },
                    {
                        xtype: "tbspacer",
                        height: 5
                    },
                    {
                        xtype: "label",
                        text: this.textBottom,
                        width: 85
                    },
                    {
                        xtype: "label",
                        text: this.textRight,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._spnTableMarginBottom, this._spnTableMarginRight]
                }]
            }]
        },
        this._spacer.cloneConfig({
            style: "margin: 0 18px"
        }), {
            xtype: "container",
            height: 40,
            layout: {
                type: "vbox",
                align: "center",
                pack: "center"
            },
            items: [{
                xtype: "container",
                width: 182,
                height: 24,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [this.btnOk = Ext.widget("button", {
                    cls: "asc-blue-button",
                    width: 86,
                    height: 22,
                    margin: "0 5px 0 0",
                    text: this.okButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 1);
                            this.close();
                        },
                        scope: this
                    }
                }), this.btnCancel = Ext.widget("button", {
                    cls: "asc-darkgray-button",
                    width: 86,
                    height: 22,
                    text: this.cancelButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 0);
                            this.close();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.callParent(arguments);
    },
    afterRender: function () {
        this.callParent(arguments);
        this._setDefaults(this._originalProps);
        this.setTitle(this.textTitle);
    },
    setSettings: function (props) {
        this._originalProps = new CTableProp(props.tableProps);
        this._changedProps = null;
    },
    _setDefaults: function (props) {
        if (props) {
            this._allTable = !props.get_CellSelect();
            var margins = props.get_DefaultMargins();
            if (margins) {
                this.TableMargins = {
                    Left: (margins.get_Left() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Left()) : null,
                    Right: (margins.get_Right() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Right()) : null,
                    Top: (margins.get_Top() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Top()) : null,
                    Bottom: (margins.get_Bottom() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Bottom()) : null
                };
            }
            margins = props.get_CellMargins();
            if (margins) {
                this.CellMargins = {
                    Left: (margins.get_Left() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Left()) : null,
                    Right: (margins.get_Right() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Right()) : null,
                    Top: (margins.get_Top() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Top()) : null,
                    Bottom: (margins.get_Bottom() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Bottom()) : null
                };
                var flag = margins.get_Flag();
                if (flag == 1) {
                    this.CellMargins.Flag = "indeterminate";
                    this._chCellMargins.setValue(this.CellMargins.Flag);
                } else {
                    if (flag == 0) {
                        this.CellMargins.Flag = "checked";
                        this._chCellMargins.setValue(1);
                    } else {
                        this.CellMargins.Flag = "unchecked";
                        this._chCellMargins.setValue(0);
                    }
                }
                this._initialMarginsDefault = (flag == 0);
            }
            this.fillMargins(this.CellMargins.Flag);
        }
        this._changedProps = new CTableProp();
    },
    getSettings: function () {
        return {
            tableProps: this._changedProps
        };
    },
    SuspendEvents: function () {
        for (var i = 0; i < this.controls.length; i++) {
            this.controls[i].suspendEvents(false);
        }
    },
    ResumeEvents: function () {
        for (var i = 0; i < this.controls.length; i++) {
            this.controls[i].resumeEvents();
        }
    },
    fillMargins: function (checkMarginsState) {
        this.SuspendEvents();
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
        this._spnMarginLeft.setValue((this.CellMargins.Left !== null) ? this.CellMargins.Left : "");
        this._spnMarginTop.setValue((this.CellMargins.Top !== null) ? this.CellMargins.Top : "");
        this._spnMarginRight.setValue((this.CellMargins.Right !== null) ? this.CellMargins.Right : "");
        this._spnMarginBottom.setValue((this.CellMargins.Bottom !== null) ? this.CellMargins.Bottom : "");
        var disabled = (checkMarginsState == "checked");
        this._spnMarginTop.setDisabled(disabled);
        this._spnMarginBottom.setDisabled(disabled);
        this._spnMarginLeft.setDisabled(disabled);
        this._spnMarginRight.setDisabled(disabled);
        this._spnTableMarginLeft.setValue((this.TableMargins.Left !== null) ? this.TableMargins.Left : "");
        this._spnTableMarginTop.setValue((this.TableMargins.Top !== null) ? this.TableMargins.Top : "");
        this._spnTableMarginRight.setValue((this.TableMargins.Right !== null) ? this.TableMargins.Right : "");
        this._spnTableMarginBottom.setValue((this.TableMargins.Bottom !== null) ? this.TableMargins.Bottom : "");
        this.ResumeEvents();
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.1 : 1);
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
});