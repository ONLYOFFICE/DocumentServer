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
 Ext.define("DE.view.TableSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.detablesettingsadvanced",
    requires: ["Ext.Array", "Ext.Button", "Ext.container.Container", "Ext.form.field.ComboBox", "Ext.window.Window", "Common.component.ThemeColorPalette", "Common.component.MetricSpinner", "DE.component.TableStyler", "Common.component.IndeterminateCheckBox", "Common.plugin.ComboBoxScrollPane"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 466,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this.controls = [];
        this._originalProps = null;
        this._changedProps = null;
        this._cellBackground = null;
        this._state = {
            HAlignTypeIdx: 0,
            HAlignFromIdx: 0,
            HPositionFromIdx: 0,
            VAlignTypeIdx: 0,
            VAlignFromIdx: 0,
            VPositionFromIdx: 0,
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
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        this._marginsChange = function (field, newValue, oldValue, eOpts, source, property) {
            if (source == "table") {
                this.TableMargins[property] = field.getNumberValue();
            } else {
                this.CellMargins[property] = field.getNumberValue();
            }
        };
        this._chWidth = Ext.create("Ext.form.field.Checkbox", {
            id: "tableadv-checkbox-width",
            boxLabel: this.textWidth,
            checked: true,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._nfWidth.setDisabled(!newValue);
                    if (this._changedProps) {
                        if (newValue && this._nfWidth.getNumberValue() > 0) {
                            this._changedProps.put_Width(Common.MetricSettings.fnRecalcToMM(this._nfWidth.getNumberValue()));
                        } else {
                            this._changedProps.put_Width(null);
                        }
                    }
                },
                this)
            }
        });
        this._nfWidth = Ext.widget("commonmetricspinner", {
            id: "tableadv-number-width",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "10 cm",
            maxValue: 55.88,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_Width(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._chAllowSpacing = Ext.create("Ext.form.field.Checkbox", {
            id: "tableadv-checkbox-spacing",
            boxLabel: this.textAllowSpacing,
            checked: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this._nfSpacing.setDisabled(!newValue);
                    this._tableBackContainer.setVisible(newValue || this._allTable);
                    this._cellBackContainer.setVisible(newValue || !this._allTable);
                    this._tablePresetsContainer.setVisible(newValue);
                    this._cellPresetsContainer.setVisible(!newValue);
                    if (newValue) {
                        this.bordersImagePanel.getLayout().setActiveItem(this._tableBordersImageSpacing);
                        this._UpdateBordersSpacing_();
                    } else {
                        this.bordersImagePanel.getLayout().setActiveItem(this._tableBordersImage);
                        this._UpdateBordersNoSpacing_();
                    }
                    if (this._changedProps) {
                        if (newValue && this._nfSpacing.getNumberValue() > 0) {
                            this._changedProps.put_Spacing(Common.MetricSettings.fnRecalcToMM(this._nfSpacing.getNumberValue()));
                        } else {
                            this._changedProps.put_Spacing(null);
                        }
                    }
                },
                this)
            }
        });
        this._nfSpacing = Ext.widget("commonmetricspinner", {
            id: "tableadv-number-spacing",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0.5 cm",
            maxValue: 2.14,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_Spacing(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._chAutofit = Ext.create("Ext.form.field.Checkbox", {
            id: "tableadv-checkbox-autofit",
            boxLabel: this.textAutofit,
            checked: true,
            colspan: 3,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_TableLayout((field.getValue()) ? c_oAscTableLayout.AutoFit : c_oAscTableLayout.Fixed);
                    }
                },
                this)
            }
        });
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
                        this.TableMargins.isChanged = true;
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
                        this.TableMargins.isChanged = true;
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
                        this.TableMargins.isChanged = true;
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
                        this.TableMargins.isChanged = true;
                    }
                },
                this)
            }
        });
        this.controls.push(this._spnTableMarginRight);
        this._spnIndentLeft = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-indent",
            readOnly: false,
            maxValue: 38.09,
            minValue: -38.09,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            style: "margin-bottom: 0;",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_TableIndent(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._btnAlignLeft = Ext.create("Ext.Button", {
            id: "tableadv-button-align-left",
            cls: "asc-right-panel-btn btn-table-align-left",
            posId: c_tableAlign.TABLE_ALIGN_LEFT,
            margin: "2px 2px 2px 0",
            text: "",
            tooltip: this.textLeftTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablealignGroup",
            pressed: true,
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableAlignment(btn.posId);
                    this._changedProps.put_TableIndent(Common.MetricSettings.fnRecalcToMM(this._spnIndentLeft.getNumberValue()));
                    this._spnIndentLeft.setDisabled(!btn.pressed);
                    this._state.alignChanged = true;
                }
            },
            this)
        });
        this._btnAlignCenter = Ext.create("Ext.Button", {
            id: "tableadv-button-align-center",
            cls: "asc-right-panel-btn btn-table-align-center",
            posId: c_tableAlign.TABLE_ALIGN_CENTER,
            margin: "2px",
            text: "",
            tooltip: this.textCenterTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablealignGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableAlignment(btn.posId);
                    this._changedProps.put_TableIndent(0);
                    this._spnIndentLeft.setDisabled(btn.pressed);
                    this._state.alignChanged = true;
                }
            },
            this)
        });
        this._btnAlignRight = Ext.create("Ext.Button", {
            id: "tableadv-button-align-right",
            cls: "asc-right-panel-btn btn-table-align-right",
            posId: c_tableAlign.TABLE_ALIGN_RIGHT,
            margin: "2px",
            text: "",
            tooltip: this.textRightTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablealignGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableAlignment(btn.posId);
                    this._changedProps.put_TableIndent(0);
                    this._spnIndentLeft.setDisabled(btn.pressed);
                    this._state.alignChanged = true;
                }
            },
            this)
        });
        this._btnWrapNone = Ext.create("Ext.Button", {
            id: "tableadv-button-wrap-none",
            cls: "asc-right-panel-btn btn-wrap-none",
            posId: c_tableWrap.TABLE_WRAP_NONE,
            margin: "2px 2px 2px 0",
            text: "",
            tooltip: this.textWrapNoneTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablewrapGroup",
            pressed: true,
            toggleHandler: Ext.bind(function (btn) {
                this._ShowHideElem(!btn.pressed);
                if (this._changedProps && btn.pressed) {
                    if (this._state.alignChanged) {
                        if (this._state.HAlignTypeIdx === 0) {
                            this._btnAlignLeft.toggle(true, false);
                        } else {
                            if (this._state.HAlignTypeIdx == 1) {
                                this._btnAlignCenter.toggle(true, false);
                            } else {
                                if (this._state.HAlignTypeIdx == 2) {
                                    this._btnAlignRight.toggle(true, false);
                                }
                            }
                        }
                        this._state.alignChanged = false;
                    }
                    this._changedProps.put_TableWrap((!btn.pressed) ? c_tableWrap.TABLE_WRAP_PARALLEL : c_tableWrap.TABLE_WRAP_NONE);
                    if (this._btnAlignLeft.pressed) {
                        this._changedProps.put_TableAlignment(c_tableAlign.TABLE_ALIGN_LEFT);
                    } else {
                        if (this._btnAlignCenter.pressed) {
                            this._changedProps.put_TableAlignment(c_tableAlign.TABLE_ALIGN_CENTER);
                        } else {
                            this._changedProps.put_TableAlignment(c_tableAlign.TABLE_ALIGN_RIGHT);
                        }
                    }
                    this._spnIndentLeft.setDisabled(!this._btnAlignLeft.pressed);
                    this._changedProps.put_TableIndent(Common.MetricSettings.fnRecalcToMM(this._spnIndentLeft.getNumberValue()));
                }
            },
            this)
        });
        this._btnWrapParallel = Ext.create("Ext.Button", {
            id: "tableadv-button-wrap-parallel",
            cls: "asc-right-panel-btn btn-wrap-parallel",
            posId: c_tableWrap.TABLE_WRAP_PARALLEL,
            margin: "2px",
            text: "",
            tooltip: this.textWrapParallelTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablewrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._ShowHideElem(btn.pressed);
                if (this._changedProps && btn.pressed) {
                    this._changedProps.put_TableWrap((btn.pressed) ? c_tableWrap.TABLE_WRAP_PARALLEL : c_tableWrap.TABLE_WRAP_NONE);
                    this._changedProps.put_TableAlignment(null);
                    this._changedProps.put_TableIndent(null);
                    if (this._state.fromWrapInline && !this._state.verticalPropChanged) {
                        this.radioVPosition.setValue(true);
                    }
                    if (this._state.alignChanged) {
                        if (this._btnAlignLeft.pressed) {
                            this._state.HAlignTypeIdx = 0;
                        } else {
                            if (this._btnAlignCenter.pressed) {
                                this._state.HAlignTypeIdx = 1;
                            } else {
                                this._state.HAlignTypeIdx = 2;
                            }
                        }
                        this.cmbHAlign.setValue(this._arrHAlign[this._state.HAlignTypeIdx][1]);
                        this.radioHAlign.setValue(true);
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(true);
                        this._changedProps.get_PositionH().put_Align(this._arrHAlign[this._state.HAlignTypeIdx][0]);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HAlignFromIdx][0]);
                        this._state.alignChanged = false;
                        this._state.horizontalPropChanged = true;
                    } else {
                        if (this._state.fromWrapInline && !this._state.horizontalPropChanged) {
                            this.radioHPosition.setValue(true);
                        }
                    }
                }
            },
            this)
        });
        this._spnDistanceTop = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-distance-top",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "1 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_TablePaddings() === undefined) {
                            this._changedProps.put_TablePaddings(new CPaddings());
                        }
                        this._changedProps.get_TablePaddings().put_Top(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnDistanceBottom = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-distance-bottom",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "1 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_TablePaddings() === undefined) {
                            this._changedProps.put_TablePaddings(new CPaddings());
                        }
                        this._changedProps.get_TablePaddings().put_Bottom(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnDistanceLeft = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-distance-left",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "1 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_TablePaddings() === undefined) {
                            this._changedProps.put_TablePaddings(new CPaddings());
                        }
                        this._changedProps.get_TablePaddings().put_Left(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnDistanceRight = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-number-distance-right",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "1 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_TablePaddings() === undefined) {
                            this._changedProps.put_TablePaddings(new CPaddings());
                        }
                        this._changedProps.get_TablePaddings().put_Right(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnX = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-span-x",
            readOnly: false,
            maxValue: 55.87,
            minValue: -55.87,
            step: 0.1,
            defaultUnit: "cm",
            value: "1 cm",
            width: 85,
            disabled: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(false);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HPositionFromIdx][0]);
                        this._changedProps.get_PositionH().put_Value(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this._state.spnXChanged = true;
                    }
                },
                this)
            }
        });
        this._spnY = Ext.create("Common.component.MetricSpinner", {
            id: "tableadv-span-y",
            readOnly: false,
            maxValue: 55.87,
            minValue: -55.87,
            step: 0.1,
            defaultUnit: "cm",
            value: "1 cm",
            width: 85,
            disabled: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CTablePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(false);
                        this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[this._state.VPositionFromIdx][0]);
                        this._changedProps.get_PositionV().put_Value(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this._state.spnYChanged = true;
                    }
                },
                this)
            }
        });
        this._arrHAlign = [[c_oAscXAlign.Left, this.textLeft], [c_oAscXAlign.Center, this.textCenter], [c_oAscXAlign.Right, this.textRight]];
        this.cmbHAlign = Ext.create("Ext.form.field.ComboBox", {
            id: "tableadv-combo-halign",
            width: 115,
            editable: false,
            store: this._arrHAlign,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(true);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HAlignFromIdx][0]);
                        this._changedProps.get_PositionH().put_Align(this._arrHAlign[records[0].index][0]);
                        this._state.HAlignTypeIdx = records[0].index;
                        this._state.alignChanged = true;
                    }
                },
                this)
            }
        });
        this.cmbHAlign.setValue(this._arrHAlign[0][0]);
        this._arrHRelative = [[c_oAscHAnchor.Margin, this.textMargin], [c_oAscHAnchor.Page, this.textPage], [c_oAscHAnchor.Text, this.textAnchorText]];
        this.cmbHRelative = Ext.create("Ext.form.field.ComboBox", {
            id: "tableadv-combo-hrelative",
            width: 115,
            editable: false,
            store: this._arrHRelative,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(true);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[records[0].index][0]);
                        this._changedProps.get_PositionH().put_Align(this._arrHAlign[this._state.HAlignTypeIdx][0]);
                        this._state.HAlignFromIdx = records[0].index;
                    }
                },
                this)
            }
        });
        this.cmbHRelative.setValue(this._arrHRelative[0][0]);
        this.cmbHPosition = Ext.create("Ext.form.field.ComboBox", {
            id: "tableadv-combo-hposition",
            width: 115,
            editable: false,
            store: this._arrHRelative,
            queryMode: "local",
            triggerAction: "all",
            disabled: true,
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(false);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[records[0].index][0]);
                        this._state.HPositionFromIdx = records[0].index;
                        if (!this._state.spnXChanged) {
                            var val = this._originalProps.get_Value_X(this._arrHRelative[records[0].index][0]);
                            this._spnX.suspendEvents(false);
                            this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(val));
                            this._spnX.resumeEvents();
                        }
                        this._changedProps.get_PositionH().put_Value(Common.MetricSettings.fnRecalcToMM(this._spnX.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.cmbHPosition.setValue(this._arrHRelative[0][0]);
        this._arrVAlign = [[c_oAscYAlign.Top, this.textTop], [c_oAscYAlign.Center, this.textCenter], [c_oAscYAlign.Bottom, this.textBottom]];
        this.cmbVAlign = Ext.create("Ext.form.field.ComboBox", {
            id: "tableadv-combo-valign",
            width: 115,
            editable: false,
            store: this._arrVAlign,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CTablePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(true);
                        this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[this._state.VAlignFromIdx][0]);
                        this._changedProps.get_PositionV().put_Align(this._arrVAlign[records[0].index][0]);
                        this._state.VAlignTypeIdx = records[0].index;
                    }
                },
                this)
            }
        });
        this.cmbVAlign.setValue(this._arrVAlign[0][0]);
        this._arrVRelative = [[c_oAscVAnchor.Margin, this.textMargin], [c_oAscVAnchor.Page, this.textPage], [c_oAscVAnchor.Text, this.textAnchorText]];
        this.cmbVRelative = Ext.create("Ext.form.field.ComboBox", {
            id: "tableadv-combo-vrelative",
            width: 115,
            editable: false,
            store: this._arrVRelative,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CTablePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(true);
                        this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[records[0].index][0]);
                        this._changedProps.get_PositionV().put_Align(this._arrVAlign[this._state.VAlignTypeIdx][0]);
                        this._state.VAlignFromIdx = records[0].index;
                        this.chMove.suspendEvents(false);
                        this.chMove.setValue(this._arrVRelative[records[0].index][0] == c_oAscVAnchor.Text);
                        this.chMove.resumeEvents();
                    }
                },
                this)
            }
        });
        this.cmbVRelative.setValue(this._arrVRelative[0][0]);
        this.cmbVPosition = Ext.create("Ext.form.field.ComboBox", {
            id: "tableadv-combo-vposition",
            width: 115,
            editable: false,
            store: this._arrVRelative,
            queryMode: "local",
            triggerAction: "all",
            disabled: true,
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CTablePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(false);
                        this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[records[0].index][0]);
                        this._state.VPositionFromIdx = records[0].index;
                        if (!this._state.spnYChanged) {
                            var val = this._originalProps.get_Value_Y(this._arrVRelative[records[0].index][0]);
                            this._spnY.suspendEvents(false);
                            this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(val));
                            this._spnY.resumeEvents();
                        }
                        this._changedProps.get_PositionV().put_Value(Common.MetricSettings.fnRecalcToMM(this._spnY.getNumberValue()));
                        this.chMove.suspendEvents(false);
                        this.chMove.setValue(this._arrVRelative[records[0].index][0] == c_oAscVAnchor.Text);
                        this.chMove.resumeEvents();
                    }
                },
                this)
            }
        });
        this.cmbVPosition.setValue(this._arrVRelative[0][0]);
        this.radioHAlign = Ext.create("Ext.form.field.Radio", {
            boxLabel: "",
            name: "asc-radio-horizontal",
            checked: true,
            listeners: {
                change: Ext.bind(function (radio, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(radio.getValue());
                        if (radio.getValue()) {
                            this._changedProps.get_PositionH().put_Align(this._arrHAlign[this._state.HAlignTypeIdx][0]);
                            this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HAlignFromIdx][0]);
                        }
                    }
                    if (radio.getValue()) {
                        this.cmbHAlign.setDisabled(false);
                        this.cmbHRelative.setDisabled(false);
                        this._spnX.setDisabled(true);
                        this.cmbHPosition.setDisabled(true);
                        this._state.horizontalPropChanged = true;
                        this._state.alignChanged = true;
                    }
                },
                this)
            }
        });
        this.radioHPosition = Ext.create("Ext.form.field.Radio", {
            boxLabel: "",
            name: "asc-radio-horizontal",
            listeners: {
                change: Ext.bind(function (radio, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CTablePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(!radio.getValue());
                        if (radio.getValue()) {
                            if (!this._state.spnXChanged) {
                                var val = this._originalProps.get_Value_X(this._arrHRelative[this._state.HPositionFromIdx][0]);
                                this._spnX.suspendEvents(false);
                                this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(val));
                                this._spnX.resumeEvents();
                            }
                            this._changedProps.get_PositionH().put_Value(Common.MetricSettings.fnRecalcToMM(this._spnX.getNumberValue()));
                            this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HPositionFromIdx][0]);
                        }
                    }
                    if (radio.getValue()) {
                        this.cmbHAlign.setDisabled(true);
                        this.cmbHRelative.setDisabled(true);
                        this._spnX.setDisabled(false);
                        this.cmbHPosition.setDisabled(false);
                        this._state.alignChanged = false;
                    }
                },
                this)
            }
        });
        this.radioVAlign = Ext.create("Ext.form.field.Radio", {
            boxLabel: "",
            name: "asc-radio-vertical",
            checked: true,
            listeners: {
                change: Ext.bind(function (radio, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CTablePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(radio.getValue());
                        if (radio.getValue()) {
                            this._changedProps.get_PositionV().put_Align(this._arrVAlign[this._state.VAlignTypeIdx][0]);
                            this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[this._state.VAlignFromIdx][0]);
                            this._state.verticalPropChanged = true;
                        }
                    }
                    if (radio.getValue()) {
                        this.cmbVAlign.setDisabled(false);
                        this.cmbVRelative.setDisabled(false);
                        this._spnY.setDisabled(true);
                        this.cmbVPosition.setDisabled(true);
                    }
                },
                this)
            }
        });
        this.radioVPosition = Ext.create("Ext.form.field.Radio", {
            boxLabel: "",
            name: "asc-radio-vertical",
            listeners: {
                change: Ext.bind(function (radio, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CTablePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(!radio.getValue());
                        if (radio.getValue()) {
                            if (!this._state.spnYChanged) {
                                var val = this._originalProps.get_Value_Y(this._arrVRelative[this._state.VPositionFromIdx][0]);
                                this._spnY.suspendEvents(false);
                                this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(val));
                                this._spnY.resumeEvents();
                            }
                            this._changedProps.get_PositionV().put_Value(Common.MetricSettings.fnRecalcToMM(this._spnY.getNumberValue()));
                            this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[this._state.VPositionFromIdx][0]);
                        }
                    }
                    if (radio.getValue()) {
                        this.cmbVAlign.setDisabled(true);
                        this.cmbVRelative.setDisabled(true);
                        this._spnY.setDisabled(false);
                        this.cmbVPosition.setDisabled(false);
                    }
                },
                this)
            }
        });
        this.chMove = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "tableadv-checkbox-move",
            boxLabel: this.textMove,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        var rec = this.cmbVPosition.getStore().getAt((field.getValue() == "checked") ? 2 : 1);
                        if (this.cmbVRelative.isDisabled()) {
                            this.cmbVPosition.select(rec);
                            this.cmbVPosition.fireEvent("select", this.cmbVPosition, [rec]);
                        } else {
                            this.cmbVRelative.select(rec);
                            this.cmbVRelative.fireEvent("select", this.cmbVRelative, [rec]);
                        }
                    }
                },
                this)
            }
        });
        this.chOverlap = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "tableadv-checkbox-overlap",
            boxLabel: this.textOverlap,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_AllowOverlap(field.getValue() == "checked");
                    }
                },
                this)
            }
        });
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        var _arrBorderPresets = [[c_tableBorder.BORDER_INNER, "cm", "asc-advanced-settings-position-btn btn-adv-position-inner", "tableadv-button-border-inner", this.tipInner], [c_tableBorder.BORDER_OUTER, "lrtb", "asc-advanced-settings-position-btn btn-adv-position-outer", "tableadv-button-border-outer", this.tipOuter], [c_tableBorder.BORDER_ALL, "lrtbcm", "asc-advanced-settings-position-btn btn-adv-position-all", "tableadv-button-border-all", this.tipAll], [c_tableBorder.BORDER_NONE, "", "asc-advanced-settings-position-btn btn-adv-position-none", "tableadv-button-border-none", this.tipNone]];
        this._btnsBorderPosition = [];
        Ext.Array.forEach(_arrBorderPresets, function (item, index) {
            var _btn = Ext.create("Ext.Button", {
                id: item[3],
                cls: item[2],
                posId: item[0],
                strId: item[1],
                marginBottom: 4,
                text: "",
                tooltip: item[4],
                listeners: {
                    click: Ext.bind(function (btn, eOpts) {
                        this._ApplyBorderPreset(btn.strId);
                    },
                    this)
                }
            });
            this._btnsBorderPosition.push(_btn);
        },
        this);
        this._tableBordersImageSpacing = Ext.widget("detablestyler", {
            id: "id-detablestyler-spacing",
            width: 200,
            height: 200,
            rows: this.tableStylerRows,
            columns: this.tableStylerColumns,
            spacingMode: true
        });
        this._tableBordersImage = Ext.widget("detablestyler", {
            id: "id-detablestyler",
            width: 200,
            height: 200,
            rows: this.tableStylerRows,
            columns: this.tableStylerColumns,
            spacingMode: false
        });
        var _arrTableBorderPresets = [[c_tableBorder.BORDER_INNER, "cm", "", "asc-advanced-settings-position-btn btn-adv-position-inner-none", "tableadv-button-border-inner-none", this.tipCellInner], [c_tableBorder.BORDER_OUTER, "lrtb", "", "asc-advanced-settings-position-btn btn-adv-position-outer-none", "tableadv-button-border-outer-none", this.tipCellOuter], [c_tableBorder.BORDER_ALL, "lrtbcm", "", "asc-advanced-settings-position-btn btn-adv-position-all-none", "tableadv-button-border-all-none", this.tipCellAll], [c_tableBorder.BORDER_NONE, "", "", "asc-advanced-settings-position-btn btn-adv-position-none-none", "tableadv-button-border-none-none", this.tipNone], [c_tableBorder.BORDER_ALL_TABLE, "lrtbcm", "lrtb", "asc-advanced-settings-position-btn btn-adv-position-all-table", "tableadv-button-border-all-table", this.tipTableOuterCellAll], [c_tableBorder.BORDER_NONE_TABLE, "", "lrtb", "asc-advanced-settings-position-btn btn-adv-position-none-table", "tableadv-button-border-none-table", this.tipOuter], [c_tableBorder.BORDER_INNER_TABLE, "cm", "lrtb", "asc-advanced-settings-position-btn btn-adv-position-inner-table", "tableadv-button-border-inner-table", this.tipTableOuterCellInner], [c_tableBorder.BORDER_OUTER_TABLE, "lrtb", "lrtb", "asc-advanced-settings-position-btn btn-adv-position-outer-table", "tableadv-button-border-outer-table", this.tipTableOuterCellOuter]];
        this._btnsTableBorderPosition = [];
        Ext.Array.forEach(_arrTableBorderPresets, function (item, index) {
            var _btn = Ext.create("Ext.Button", {
                id: item[4],
                cls: item[3],
                posId: item[0],
                strCellId: item[1],
                strTableId: item[2],
                text: "",
                tooltip: item[5],
                listeners: {
                    click: Ext.bind(function (btn, eOpts) {
                        this._ApplyBorderPreset(btn.strCellId, btn.strTableId);
                    },
                    this)
                }
            });
            this._btnsTableBorderPosition.push(_btn);
        },
        this);
        var dataBorders = [{
            borderstyle: "",
            text: this.txtNoBorders,
            value: 0,
            offsety: 0
        },
        {
            text: "0.5 pt",
            value: 0.5,
            pxValue: 0.5,
            offsety: 0
        },
        {
            text: "1 pt",
            value: 1,
            pxValue: 1,
            offsety: 20
        },
        {
            text: "1.5 pt",
            value: 1.5,
            pxValue: 2,
            offsety: 40
        },
        {
            text: "2.25 pt",
            value: 2.25,
            pxValue: 3,
            offsety: 60
        },
        {
            text: "3 pt",
            value: 3,
            pxValue: 4,
            offsety: 80
        },
        {
            text: "4.5 pt",
            value: 4.5,
            pxValue: 5,
            offsety: 100
        },
        {
            text: "6 pt",
            value: 6,
            pxValue: 6,
            offsety: 120
        }];
        for (var i = 1; i < dataBorders.length; i++) {
            dataBorders[i].borderstyle = Ext.String.format("background:url({0}) 0 {1}px; width:69px; height:20px; margin-right:5px;", "resources/img/right-panels/BorderSize.png", -dataBorders[i].offsety);
        }
        var fieldStore = Ext.create("Ext.data.Store", {
            model: "DE.model.ModelBorders",
            data: dataBorders
        });
        var item_tpl = Ext.create("Ext.XTemplate", '<tpl for=".">' + '<span style="display: inline-block; margin-top: 3px; font-size: 11px; height: 17px;">{text}</span>' + '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" align="right" style="{borderstyle}">' + "</tpl>");
        this.cmbBorderSize = Ext.create("Ext.form.field.ComboBox", {
            width: 93,
            height: 21,
            editable: false,
            queryMode: "local",
            matchFieldWidth: false,
            displayField: "text",
            store: fieldStore,
            listConfig: {
                mode: "local",
                width: 145,
                itemTpl: item_tpl
            },
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    this.BorderSize = {
                        ptValue: records[0].data.value,
                        pxValue: records[0].data.pxValue
                    };
                    this._tableBordersImage.setVirtualBorderSize(this.BorderSize.pxValue);
                    this._tableBordersImageSpacing.setVirtualBorderSize(this.BorderSize.pxValue);
                    if (combo.inputEl) {
                        if (records[0].data.value > 0) {
                            combo.inputEl.set({
                                type: "image"
                            });
                            combo.inputEl.set({
                                src: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            });
                            var style = Ext.String.format("background:url({0}) no-repeat scroll 0 {1}px, url({2}) repeat scroll 0 0 white", "resources/img/right-panels/BorderSize.png", -records[0].data.offsety, "resources/img/controls/text-bg.gif");
                            Ext.DomHelper.applyStyles(combo.inputEl, style);
                        } else {
                            var style = Ext.String.format("background: url({0}) repeat scroll 0 0 white", "resources/img/controls/text-bg.gif");
                            Ext.DomHelper.applyStyles(combo.inputEl, style);
                            combo.inputEl.set({
                                type: "text"
                            });
                            combo.inputEl.set({
                                value: me.txtNoBorders
                            });
                            combo.onItemClick(combo.picker, records[0]);
                        }
                    }
                },
                this),
                afterRender: function () {
                    if (this.inputEl) {
                        Ext.DomHelper.applyStyles(this.inputEl, "padding-left:7px");
                        this.inputEl.set({
                            type: "image"
                        });
                        this.inputEl.set({
                            src: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        });
                        var style = Ext.String.format("background:url({0}) repeat scroll 0 {1}px, url({2}) repeat scroll 0 0 white", "resources/img/right-panels/BorderSize.png", -20, "resources/img/controls/text-bg.gif");
                        Ext.DomHelper.applyStyles(this.inputEl, style);
                    }
                }
            },
            plugins: [{
                ptype: "comboboxscrollpane",
                pluginId: "scrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        var rec = this.cmbBorderSize.getStore().getAt(2);
        this.cmbBorderSize.select(rec);
        this.BorderSize = {
            ptValue: rec.data.value,
            pxValue: rec.data.pxValue
        };
        this._btnBorderColor = Ext.create("Ext.button.Button", {
            id: "tableadv-button-border-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "000000",
            menu: {
                showSeparator: false,
                items: [this.colorsBorder = Ext.create("Common.component.ThemeColorPalette", {
                    value: "000000",
                    width: 165,
                    height: 214,
                    dynamiccolors: true,
                    dyncolorscount: 10,
                    colors: [this.textThemeColors, "-", {
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
                        color: "3D55FE",
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
                    "-", "--", "-", this.textStandartColors, "-", "3D55FE", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"],
                    listeners: {
                        select: {
                            fn: function (picker, color, eOpts, id) {
                                Ext.menu.Manager.hideAll();
                                var colorstr = Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color);
                                me._btnBorderColor.color = color;
                                me._tableBordersImage.setVirtualBorderColor(colorstr);
                                me._tableBordersImageSpacing.setVirtualBorderColor(colorstr);
                                if (me._btnBorderColor.btnEl) {
                                    Ext.DomHelper.applyStyles(me._btnBorderColor.btnEl, {
                                        "background-color": colorstr
                                    });
                                }
                            }
                        }
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.colorsBorder.addNewColor();
                        }
                    }
                }]
            },
            listeners: {
                render: function (c) {
                    var colorStyle = Ext.String.format("background-color:#{0}", (typeof(c.color) == "object") ? c.color.color : c.color);
                    Ext.DomHelper.applyStyles(c.btnEl, colorStyle);
                }
            },
            setColor: function (newcolor) {
                var border, clr;
                this.color = newcolor;
                if (newcolor == "transparent" || newcolor.color == "transparent") {
                    border = "1px solid #BEBEBE";
                    clr = newcolor;
                } else {
                    border = "none";
                    clr = Ext.String.format("#{0}", (typeof(newcolor) == "object") ? newcolor.color : newcolor);
                }
                if (this.btnEl !== undefined) {
                    Ext.DomHelper.applyStyles(this.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            }
        });
        this._btnBackColor = Ext.create("Ext.button.Button", {
            id: "tableadv-button-back-color",
            arrowCls: "",
            width: 50,
            height: 22,
            color: "transparent",
            menu: {
                showSeparator: false,
                items: [this.colorsBack = Ext.create("Common.component.ThemeColorPalette", {
                    value: "000000",
                    width: 165,
                    height: 214,
                    dynamiccolors: true,
                    dyncolorscount: 10,
                    colors: [this.textThemeColors, "-", {
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
                    "-", "--", "-", this.textStandartColors, "-", "transparent", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"],
                    listeners: {
                        select: {
                            fn: function (picker, color, eOpts, id) {
                                Ext.menu.Manager.hideAll();
                                var clr, border;
                                if (color == "transparent") {
                                    me._btnBackColor.color = "transparent";
                                    clr = "transparent";
                                    border = "1px solid #BEBEBE";
                                } else {
                                    me._btnBackColor.color = color;
                                    clr = Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color);
                                    border = "none";
                                }
                                if (me._btnBackColor.btnEl) {
                                    Ext.DomHelper.applyStyles(me._btnBackColor.btnEl, {
                                        "background-color": clr,
                                        "border": border
                                    });
                                }
                                me.CellColor = {
                                    Value: 1,
                                    Color: me._btnBackColor.color
                                };
                                if (me._cellBackground === null) {
                                    me._cellBackground = new CBackground();
                                }
                                if (me.CellColor.Color == "transparent") {
                                    me._cellBackground.put_Value(1);
                                    me._cellBackground.put_Color(new CAscColor(0, 0, 0));
                                } else {
                                    me._cellBackground.put_Value(0);
                                    me._cellBackground.put_Color(me.getRgbColor(me.CellColor.Color));
                                }
                            }
                        }
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: me.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.colorsBack.addNewColor();
                        }
                    }
                }]
            },
            listeners: {
                render: function (c) {
                    var border, clr;
                    if (c.color == "transparent") {
                        border = "1px solid #BEBEBE";
                        clr = c.color;
                    } else {
                        border = "none";
                        clr = Ext.String.format("#{0}", (typeof(c.color) == "object") ? c.color.color : c.color);
                    }
                    Ext.DomHelper.applyStyles(c.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            },
            setColor: function (newcolor) {
                var border, clr;
                this.color = newcolor;
                if (newcolor == "transparent") {
                    border = "1px solid #BEBEBE";
                    clr = newcolor;
                } else {
                    border = "none";
                    clr = Ext.String.format("#{0}", (typeof(newcolor) == "object") ? newcolor.color : newcolor);
                }
                if (this.btnEl !== undefined) {
                    Ext.DomHelper.applyStyles(this.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            }
        });
        this._btnTableBackColor = Ext.create("Ext.button.Button", {
            id: "tableadv-button-table-back-color",
            arrowCls: "",
            width: 50,
            height: 22,
            color: "transparent",
            menu: {
                showSeparator: false,
                items: [this.colorsTableBack = Ext.create("Common.component.ThemeColorPalette", {
                    value: "000000",
                    width: 165,
                    height: 214,
                    dynamiccolors: true,
                    dyncolorscount: 10,
                    colors: [this.textThemeColors, "-", {
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
                    "-", "--", "-", this.textStandartColors, "-", "transparent", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"],
                    listeners: {
                        select: {
                            fn: function (picker, color, eOpts, id) {
                                Ext.menu.Manager.hideAll();
                                var clr, border;
                                if (color == "transparent") {
                                    me._btnTableBackColor.color = "transparent";
                                    clr = "transparent";
                                    border = "1px solid #BEBEBE";
                                } else {
                                    me._btnTableBackColor.color = color;
                                    clr = Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color);
                                    border = "none";
                                }
                                if (me._btnTableBackColor.btnEl) {
                                    Ext.DomHelper.applyStyles(me._btnTableBackColor.btnEl, {
                                        "background-color": clr,
                                        "border": border
                                    });
                                }
                                me.TableColor.Color = me._btnTableBackColor.color;
                                if (me._changedProps) {
                                    var background = me._changedProps.get_TableBackground();
                                    if (background === undefined) {
                                        background = new CBackground();
                                        me._changedProps.put_TableBackground(background);
                                    }
                                    if (me.TableColor.Color == "transparent") {
                                        background.put_Value(1);
                                        background.put_Color(new CAscColor(0, 0, 0));
                                    } else {
                                        background.put_Value(0);
                                        background.put_Color(me.getRgbColor(me.TableColor.Color));
                                    }
                                }
                            }
                        }
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: me.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.colorsTableBack.addNewColor();
                        }
                    }
                }]
            },
            listeners: {
                render: function (c) {
                    var border, clr;
                    if (c.color == "transparent") {
                        border = "1px solid #BEBEBE";
                        clr = c.color;
                    } else {
                        border = "none";
                        clr = Ext.String.format("#{0}", (typeof(c.color) == "object") ? c.color.color : c.color);
                    }
                    Ext.DomHelper.applyStyles(c.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            },
            setColor: function (newcolor) {
                var border, clr;
                this.color = newcolor;
                if (newcolor == "transparent") {
                    border = "1px solid #BEBEBE";
                    clr = newcolor;
                } else {
                    border = "none";
                    clr = Ext.String.format("#{0}", (typeof(newcolor) == "object") ? newcolor.color : newcolor);
                }
                if (this.btnEl !== undefined) {
                    Ext.DomHelper.applyStyles(this.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            }
        });
        this.btnWidthSpaces = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textWidthSpaces,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            pressed: true,
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-width");
                    }
                },
                scope: this
            }
        });
        this.btnCellProps = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textCellProps,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-cell");
                        if (this.CellMargins.Flag == "checked" && this.TableMargins.isChanged) {
                            this.CellMargins.Left = this.TableMargins.Left;
                            this.CellMargins.Top = this.TableMargins.Top;
                            this.CellMargins.Right = this.TableMargins.Right;
                            this.CellMargins.Bottom = this.TableMargins.Bottom;
                            this.SuspendEvents();
                            this._spnMarginRight.setValue(this.CellMargins.Right);
                            this._spnMarginLeft.setValue(this.CellMargins.Left);
                            this._spnMarginBottom.setValue(this.CellMargins.Bottom);
                            this._spnMarginTop.setValue(this.CellMargins.Top);
                            this.ResumeEvents();
                        }
                        this.TableMargins.isChanged = false;
                    }
                },
                scope: this
            }
        });
        this.btnTextWrap = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textWrap,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-wrap");
                    }
                },
                scope: this
            }
        });
        this.btnBorders = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            textAlign: "right",
            text: this.textBordersBackgroung,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-borders");
                    }
                },
                scope: this
            }
        });
        this.btnPosition = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textPosition,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            card: "card-position",
            disabled: true,
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-position");
                    }
                },
                scope: this
            }
        });
        this._WidthSpacingContainer = {
            xtype: "container",
            itemId: "card-width",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                height: 86,
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "vertical-align: middle;"
                    }
                },
                items: [this._chWidth, {
                    xtype: "tbspacer",
                    width: 40,
                    height: 1
                },
                this._chAllowSpacing, {
                    xtype: "tbspacer",
                    height: 6
                },
                {
                    xtype: "tbspacer",
                    height: 6
                },
                {
                    xtype: "tbspacer",
                    height: 6
                },
                this._nfWidth, {
                    xtype: "tbspacer",
                    width: 40,
                    height: 1
                },
                this._nfSpacing, {
                    xtype: "tbspacer",
                    height: 8
                },
                {
                    xtype: "tbspacer",
                    height: 8
                },
                {
                    xtype: "tbspacer",
                    height: 8
                },
                this._chAutofit]
            },
            this._spacer.cloneConfig({
                style: "margin: 15px 0 10px 0;"
            }), {
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
        };
        this._CellPropsContainer = {
            xtype: "container",
            itemId: "card-cell",
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
            }]
        };
        this._WrapContainer = {
            xtype: "container",
            itemId: "card-wrap",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                height: 40,
                padding: "0 10",
                layout: "hbox",
                items: [this._btnWrapNone, {
                    xtype: "tbspacer",
                    width: 3
                },
                this._btnWrapParallel]
            },
            this._spacer.cloneConfig({
                style: "margin: 15px 0 10px 0;"
            }), {
                xtype: "container",
                height: 218,
                hidden: true,
                hideId: "element-parallel",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "label",
                    style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                    text: this.textDistance
                },
                {
                    xtype: "tbspacer",
                    height: 10
                },
                {
                    xtype: "container",
                    height: 92,
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
                        height: 3
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnDistanceTop, this._spnDistanceLeft, {
                        xtype: "tbspacer",
                        height: 6
                    },
                    {
                        xtype: "tbspacer",
                        height: 6
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
                        height: 3
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnDistanceBottom, this._spnDistanceRight]
                }]
            },
            {
                xtype: "container",
                height: 100,
                hideId: "element-none",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "label",
                    style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                    text: this.textAlign
                },
                {
                    xtype: "tbspacer",
                    height: 7
                },
                {
                    xtype: "container",
                    height: 45,
                    layout: "hbox",
                    align: "middle",
                    padding: "0 10",
                    items: [this._btnAlignLeft, {
                        xtype: "tbspacer",
                        width: 3
                    },
                    this._btnAlignCenter, {
                        xtype: "tbspacer",
                        width: 3
                    },
                    this._btnAlignRight]
                },
                {
                    xtype: "tbspacer",
                    height: 10
                },
                {
                    xtype: "container",
                    height: 22,
                    padding: "0 10",
                    layout: {
                        type: "table",
                        columns: 2,
                        tdAttrs: {
                            style: "padding-right: 8px;vertical-align: middle;"
                        }
                    },
                    items: [{
                        xtype: "label",
                        text: this.textIndLeft,
                        style: "display: block;"
                    },
                    this._spnIndentLeft]
                }]
            }]
        };
        this._BordersContainer = {
            xtype: "container",
            itemId: "card-borders",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                height: 28,
                padding: "2px 5px 0 10px",
                style: "vertical-align: middle;",
                items: [{
                    xtype: "label",
                    text: this.textBorderWidth
                },
                {
                    xtype: "tbspacer",
                    width: 6
                },
                this.cmbBorderSize, {
                    xtype: "tbspacer",
                    flex: 1
                },
                {
                    xtype: "label",
                    text: this.textBorderColor
                },
                {
                    xtype: "tbspacer",
                    width: 6
                },
                this._btnBorderColor]
            },
            this._spacer.cloneConfig({
                style: "margin: 15px 0 10px 0;"
            }), {
                xtype: "label",
                text: this.textBorderDesc,
                style: "padding-left:10px;height:13px;"
            },
            {
                xtype: "tbspacer",
                height: 20
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "top"
                },
                height: 210,
                width: 200,
                padding: "0 10",
                style: "vertical-align: top;",
                items: [this.bordersImagePanel = Ext.create("Ext.container.Container", {
                    layout: "card",
                    activeItem: 0,
                    width: 200,
                    height: 210,
                    style: "padding-bottom:10px;",
                    items: [this._tableBordersImage, this._tableBordersImageSpacing]
                }), {
                    xtype: "tbspacer",
                    width: 25
                },
                {
                    xtype: "container",
                    layout: "hbox",
                    height: 210,
                    width: 100,
                    items: [this._cellPresetsContainer = Ext.create("Ext.container.Container", {
                        height: 210,
                        width: 100,
                        layout: {
                            type: "table",
                            columns: 1,
                            tdAttrs: {
                                style: "padding-bottom: 4px; vertical-align: middle;"
                            }
                        },
                        items: [{
                            xtype: "tbspacer",
                            height: 5
                        },
                        this._btnsBorderPosition[2], this._btnsBorderPosition[3], this._btnsBorderPosition[0], this._btnsBorderPosition[1]]
                    }), this._tablePresetsContainer = Ext.create("Ext.container.Container", {
                        height: 210,
                        width: 100,
                        layout: {
                            type: "table",
                            columns: 2,
                            tdAttrs: {
                                style: "padding-right: 10px; padding-bottom: 4px; vertical-align: middle;"
                            }
                        },
                        items: [{
                            xtype: "tbspacer",
                            height: 5
                        },
                        {
                            xtype: "tbspacer",
                            height: 5
                        },
                        this._btnsTableBorderPosition[2], this._btnsTableBorderPosition[4], this._btnsTableBorderPosition[3], this._btnsTableBorderPosition[5], this._btnsTableBorderPosition[0], this._btnsTableBorderPosition[6], this._btnsTableBorderPosition[1], this._btnsTableBorderPosition[7]]
                    })]
                }]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                height: 23,
                width: 344,
                padding: "0 0 0 10",
                layout: "hbox",
                items: [this._cellBackContainer = Ext.create("Ext.container.Container", {
                    height: 23,
                    width: 154,
                    layout: "hbox",
                    items: [{
                        xtype: "label",
                        text: this.textBackColor,
                        margin: "2px 2px 0 0"
                    },
                    this._btnBackColor]
                }), this._tableBackContainer = Ext.create("Ext.container.Container", {
                    height: 23,
                    width: 154,
                    margin: "0 0 0 1px",
                    layout: {
                        type: "hbox"
                    },
                    items: [{
                        xtype: "label",
                        text: this.textTableBackColor,
                        margin: "2px 2px 0 0"
                    },
                    this._btnTableBackColor]
                }), {
                    xtype: "tbspacer",
                    flex: 1
                }]
            }]
        };
        this._contPosition = Ext.create("Ext.Container", {
            cls: "tableadv-advanced-container",
            padding: "0 10",
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 238,
            width: 200,
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; height:13px;",
                text: this.textHorizontal
            },
            {
                xtype: "tbspacer",
                height: 12
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 8px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 40,
                    style: "float:left;"
                },
                items: [{
                    width: 15,
                    items: [{
                        xtype: "tbspacer",
                        height: 15
                    },
                    this.radioHAlign]
                },
                {
                    width: 130,
                    items: [{
                        xtype: "label",
                        text: this.textAlignment,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbHAlign]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textRelative,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbHRelative]
                }]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 8px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 40,
                    style: "float:left;"
                },
                items: [{
                    width: 15,
                    items: [{
                        xtype: "tbspacer",
                        height: 15
                    },
                    this.radioHPosition]
                },
                {
                    width: 130,
                    items: [{
                        xtype: "label",
                        text: this.textPosition,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._spnX]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textRightOf,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbHPosition]
                }]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; height:13px;",
                text: this.textVertical
            },
            {
                xtype: "tbspacer",
                height: 12
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 8px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 40,
                    style: "float:left;"
                },
                items: [{
                    width: 15,
                    items: [{
                        xtype: "tbspacer",
                        height: 15
                    },
                    this.radioVAlign]
                },
                {
                    width: 130,
                    items: [{
                        xtype: "label",
                        text: this.textAlignment,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbVAlign]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textRelative,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbVRelative]
                }]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 8px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 40,
                    style: "float:left;"
                },
                items: [{
                    width: 15,
                    items: [{
                        xtype: "tbspacer",
                        height: 15
                    },
                    this.radioVPosition]
                },
                {
                    width: 130,
                    items: [{
                        xtype: "label",
                        text: this.textPosition,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._spnY]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textBelow,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbVPosition]
                }]
            }]
        });
        this._contOptions = Ext.create("Ext.Container", {
            cls: "tableadv-advanced-container",
            padding: "0 10",
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 45,
            width: 200,
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; height:13px;",
                text: this.textOptions
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 30,
                layout: {
                    type: "table",
                    columns: 2,
                    tdAttrs: {
                        style: "padding-right: 25px;vertical-align: middle;"
                    }
                },
                items: [this.chMove, this.chOverlap]
            }]
        });
        var cntrPosition = {
            xtype: "container",
            itemId: "card-position",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [this._contPosition, this._spacer.cloneConfig({
                style: "margin: 16px 0 11px 0;",
                height: 6
            }), this._contOptions]
        };
        this.items = [{
            xtype: "container",
            height: 370,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                width: 160,
                padding: "5px 0 0 0",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                defaults: {
                    xtype: "container",
                    layout: {
                        type: "hbox",
                        align: "middle",
                        pack: "end"
                    }
                },
                items: [{
                    height: 30,
                    items: [this.btnWidthSpaces]
                },
                {
                    height: 30,
                    items: [this.btnTextWrap]
                },
                {
                    height: 30,
                    items: [this.btnBorders]
                },
                {
                    height: 30,
                    items: [this.btnPosition]
                },
                {
                    height: 30,
                    items: [this.btnCellProps]
                }]
            },
            {
                xtype: "box",
                cls: "advanced-settings-separator",
                height: "100%",
                width: 8
            },
            this.mainCard = Ext.create("Ext.container.Container", {
                height: 370,
                flex: 1,
                padding: "12px 18px 0 10px",
                layout: "card",
                items: [this._WidthSpacingContainer, this._WrapContainer, this._BordersContainer, cntrPosition, this._CellPropsContainer]
            })]
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
        if (this.borderProps !== undefined) {
            this._btnBorderColor.setColor(this.borderProps.borderColor);
            var colorstr = Ext.String.format("#{0}", (typeof(this.borderProps.borderColor) == "object") ? this.borderProps.borderColor.color : this.borderProps.borderColor);
            this._tableBordersImageSpacing.setVirtualBorderColor(colorstr);
            this._tableBordersImage.setVirtualBorderColor(colorstr);
            var rec = this.cmbBorderSize.getStore().findRecord("value", this.borderProps.borderSize.ptValue);
            if (rec) {
                this.cmbBorderSize.select(rec);
                this.cmbBorderSize.fireEvent("select", this.cmbBorderSize, [rec]);
            }
            this.colorsBorder.select(this.borderProps.borderColor);
        }
        this.setTitle(this.textTitle);
        if (this.colorProps !== undefined) {
            this.sendThemeColors(this.colorProps[0], this.colorProps[1]);
        }
        for (var i = 0; i < this._tableBordersImageSpacing.rows; i++) {
            for (var j = 0; j < this._tableBordersImageSpacing.columns; j++) {
                this._tableBordersImageSpacing.getCell(j, i).addListener("borderclick", function (ct, border, size, color) {
                    if (this.ChangedCellBorders === undefined) {
                        this.ChangedCellBorders = new CBorders();
                    }
                    this._UpdateCellBordersStyle(ct, border, size, color, this.CellBorders, this.ChangedCellBorders);
                },
                this);
            }
        }
        this._tableBordersImageSpacing.addListener("borderclick", function (ct, border, size, color) {
            if (this.ChangedTableBorders === undefined) {
                this.ChangedTableBorders = new CBorders();
            }
            this._UpdateTableBordersStyle(ct, border, size, color, this.TableBorders, this.ChangedTableBorders);
        },
        this);
        for (i = 0; i < this._tableBordersImage.rows; i++) {
            for (j = 0; j < this._tableBordersImage.columns; j++) {
                this._tableBordersImage.getCell(j, i).addListener("borderclick", function (ct, border, size, color) {
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
        this._tableBordersImage.addListener("borderclick", function (ct, border, size, color) {
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
    setSettings: function (props) {
        this._originalProps = new CTableProp(props.tableProps);
        this.borderProps = props.borderProps;
        this.colorProps = props.colorProps;
        this._changedProps = null;
    },
    _setDefaults: function (props) {
        if (props) {
            this._allTable = !props.get_CellSelect();
            var value;
            var TableWidth = props.get_Width();
            if (TableWidth !== null) {
                this._nfWidth.setValue(Common.MetricSettings.fnRecalcFromMM(TableWidth));
            }
            this._chWidth.setValue(TableWidth !== null);
            this._nfWidth.setDisabled(!this._chWidth.getValue());
            var TableSpacing = props.get_Spacing();
            if (TableSpacing !== null) {
                this._nfSpacing.setValue(Common.MetricSettings.fnRecalcFromMM(TableSpacing));
            }
            this._chAllowSpacing.suspendEvents(false);
            this._chAllowSpacing.setValue(TableSpacing !== null);
            this._nfSpacing.setDisabled(!this._chAllowSpacing.getValue());
            this._chAllowSpacing.resumeEvents();
            var autoFit = props.get_TableLayout();
            this._chAutofit.setDisabled(autoFit === undefined);
            this._chAutofit.setValue(autoFit === c_oAscTableLayout.AutoFit);
            this._TblWrapStyleChanged(props.get_TableWrap());
            this._btnWrapParallel.setDisabled(!props.get_CanBeFlow());
            var tableAlign = props.get_TableAlignment();
            if (tableAlign !== null) {
                this._TblAlignChanged(tableAlign);
                this._spnIndentLeft.setValue(tableAlign !== c_tableAlign.TABLE_ALIGN_LEFT ? 0 : Common.MetricSettings.fnRecalcFromMM(props.get_TableIndent()));
                this._spnIndentLeft.setDisabled(tableAlign !== c_tableAlign.TABLE_ALIGN_LEFT);
            }
            this._state.alignChanged = false;
            var paddings = props.get_TablePaddings();
            if (paddings) {
                this._spnDistanceTop.setValue(Common.MetricSettings.fnRecalcFromMM(paddings.get_Top()));
                this._spnDistanceLeft.setValue(Common.MetricSettings.fnRecalcFromMM(paddings.get_Left()));
                this._spnDistanceBottom.setValue(Common.MetricSettings.fnRecalcFromMM(paddings.get_Bottom()));
                this._spnDistanceRight.setValue(Common.MetricSettings.fnRecalcFromMM(paddings.get_Right()));
            }
            var Position = props.get_PositionH();
            if (Position) {
                value = Position.get_RelativeFrom();
                for (var i = 0; i < this._arrHRelative.length; i++) {
                    if (value == this._arrHRelative[i][0]) {
                        this.cmbHRelative.setValue(this._arrHRelative[i][1]);
                        this.cmbHPosition.setValue(this._arrHRelative[i][1]);
                        this._state.HPositionFromIdx = i;
                        this._state.HAlignFromIdx = i;
                        break;
                    }
                }
                if (Position.get_UseAlign()) {
                    value = Position.get_Align();
                    for (var i = 0; i < this._arrHAlign.length; i++) {
                        if (value == this._arrHAlign[i][0]) {
                            this.cmbHAlign.setValue(this._arrHAlign[i][1]);
                            this._state.HAlignTypeIdx = i;
                            break;
                        }
                    }
                    value = this._originalProps.get_Value_X(this._arrHRelative[this._state.HPositionFromIdx][0]);
                    this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                } else {
                    this.radioHPosition.setValue(true);
                    value = Position.get_Value();
                    this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                }
            } else {
                value = this._originalProps.get_Value_X(this._arrHRelative[this._state.HPositionFromIdx][0]);
                this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(value));
            }
            Position = props.get_PositionV();
            if (Position) {
                value = Position.get_RelativeFrom();
                for (i = 0; i < this._arrVRelative.length; i++) {
                    if (value == this._arrVRelative[i][0]) {
                        this.cmbVRelative.setValue(this._arrVRelative[i][1]);
                        this.cmbVPosition.setValue(this._arrVRelative[i][1]);
                        this._state.VAlignFromIdx = i;
                        this._state.VPositionFromIdx = i;
                        break;
                    }
                }
                if (value == c_oAscVAnchor.Text) {
                    this.chMove.setValue(true);
                }
                if (Position.get_UseAlign()) {
                    value = Position.get_Align();
                    for (i = 0; i < this._arrVAlign.length; i++) {
                        if (value == this._arrVAlign[i][0]) {
                            this.cmbVAlign.setValue(this._arrVAlign[i][1]);
                            this._state.VAlignTypeIdx = i;
                            break;
                        }
                    }
                    value = props.get_Value_Y(this._arrVRelative[this._state.VPositionFromIdx][0]);
                    this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                } else {
                    this.radioVPosition.setValue(true);
                    value = Position.get_Value();
                    this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                }
            } else {
                value = props.get_Value_Y(this._arrVRelative[this._state.VPositionFromIdx][0]);
                this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(value));
            }
            this.chOverlap.setValue((props.get_AllowOverlap() !== null) ? props.get_AllowOverlap() : "indeterminate");
            this._state.verticalPropChanged = false;
            this._state.horizontalPropChanged = false;
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
            var flag = undefined;
            if (margins) {
                this.CellMargins = {
                    Left: (margins.get_Left() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Left()) : null,
                    Right: (margins.get_Right() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Right()) : null,
                    Top: (margins.get_Top() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Top()) : null,
                    Bottom: (margins.get_Bottom() !== null) ? Common.MetricSettings.fnRecalcFromMM(margins.get_Bottom()) : null
                };
                flag = margins.get_Flag();
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
                                color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                effectValue: color.get_value()
                            }
                        };
                    } else {
                        this.TableColor = {
                            Value: 1,
                            Color: this.getHexColor(color.get_r(), color.get_g(), color.get_b())
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
                                    color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                    effectValue: color.get_value()
                                }
                            };
                        } else {
                            this.CellColor = {
                                Value: 1,
                                Color: this.getHexColor(color.get_r(), color.get_g(), color.get_b())
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
            this._btnBackColor.setColor(this.CellColor.Color);
            if (typeof(this.CellColor.Color) == "object") {
                for (var i = 0; i < 10; i++) {
                    if (this.ThemeValues[i] == this.CellColor.Color.effectValue) {
                        this.colorsBack.select(this.CellColor.Color, true);
                        break;
                    }
                }
            } else {
                this.colorsBack.select(this.CellColor.Color, true);
            }
            this._btnTableBackColor.setColor(this.TableColor.Color);
            if (typeof(this.TableColor.Color) == "object") {
                for (var i = 0; i < 10; i++) {
                    if (this.ThemeValues[i] == this.TableColor.Color.effectValue) {
                        this.colorsTableBack.select(this.TableColor.Color, true);
                        break;
                    }
                }
            } else {
                this.colorsTableBack.select(this.TableColor.Color, true);
            }
            this._tableBackContainer.setVisible(this._chAllowSpacing.getValue() || this._allTable);
            this._cellBackContainer.setVisible(this._chAllowSpacing.getValue() || !this._allTable);
            this._tablePresetsContainer.setVisible(this._chAllowSpacing.getValue());
            this._cellPresetsContainer.setVisible(!this._chAllowSpacing.getValue());
            if (this._chAllowSpacing.getValue()) {
                this.bordersImagePanel.getLayout().setActiveItem(this._tableBordersImageSpacing);
                this._UpdateBordersSpacing_();
            } else {
                this.bordersImagePanel.getLayout().setActiveItem(this._tableBordersImage);
                this._UpdateBordersNoSpacing_();
            }
        }
        this._changedProps = new CTableProp();
        this._cellBackground = null;
        this.ChangedTableBorders = undefined;
        this.ChangedCellBorders = undefined;
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
                borderColor: this._btnBorderColor.color
            }
        };
    },
    _ShowHideElem: function (visible) {
        var components = Ext.ComponentQuery.query('[hideId="element-parallel"]', this);
        for (var i = 0; i < components.length; i++) {
            if (visible) {
                components[i].show();
            } else {
                components[i].hide();
            }
        }
        this.btnPosition.setDisabled(!visible);
        components = Ext.ComponentQuery.query('[hideId="element-none"]', this);
        for (i = 0; i < components.length; i++) {
            if (!visible) {
                components[i].show();
            } else {
                components[i].hide();
            }
        }
    },
    _TblWrapStyleChanged: function (style) {
        if (style == c_tableWrap.TABLE_WRAP_NONE) {
            this._btnWrapNone.toggle(true, false);
        } else {
            this._btnWrapParallel.toggle(true, false);
        }
        this._state.fromWrapInline = (style == c_tableWrap.TABLE_WRAP_NONE);
    },
    _TblAlignChanged: function (style) {
        if (style == c_tableAlign.TABLE_ALIGN_LEFT) {
            this._btnAlignLeft.toggle(true, false);
        } else {
            if (style == c_tableAlign.TABLE_ALIGN_CENTER) {
                this._btnAlignCenter.toggle(true, false);
            } else {
                this._btnAlignRight.toggle(true, false);
            }
        }
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
    _UpdateBordersSpacing_: function () {
        this.SuspendEvents();
        var source = this.TableBorders;
        var oldSize = this.BorderSize;
        var oldColor = this._btnBorderColor.color;
        this._UpdateTableBorderSpacing_(source.get_Left(), "l");
        this._UpdateTableBorderSpacing_(source.get_Top(), "t");
        this._UpdateTableBorderSpacing_(source.get_Right(), "r");
        this._UpdateTableBorderSpacing_(source.get_Bottom(), "b");
        source = this.CellBorders;
        for (var i = 0; i < this._tableBordersImageSpacing.rows; i++) {
            this._UpdateCellBorderSpacing_(source.get_Left(), "l", this._tableBordersImageSpacing.getCell(0, i));
        }
        for (i = 0; i < this._tableBordersImageSpacing.rows; i++) {
            this._UpdateCellBorderSpacing_(source.get_Right(), "r", this._tableBordersImageSpacing.getCell(this._tableBordersImageSpacing.columns - 1, i));
        }
        for (i = 0; i < this._tableBordersImageSpacing.columns; i++) {
            this._UpdateCellBorderSpacing_(source.get_Top(), "t", this._tableBordersImageSpacing.getCell(i, 0));
        }
        for (i = 0; i < this._tableBordersImageSpacing.columns; i++) {
            this._UpdateCellBorderSpacing_(source.get_Bottom(), "b", this._tableBordersImageSpacing.getCell(i, this._tableBordersImageSpacing.rows - 1));
        }
        if (this._allTable && source.get_InsideV() === null) {
            source.put_InsideV(new CBorder());
        }
        if (source.get_InsideV() !== null) {
            for (i = 0; i < this._tableBordersImageSpacing.rows; i++) {
                this._UpdateCellBorderSpacing_(source.get_InsideV(), "r", this._tableBordersImageSpacing.getCell(0, i));
                this._UpdateCellBorderSpacing_(source.get_InsideV(), "l", this._tableBordersImageSpacing.getCell(1, i));
            }
        }
        if (this._allTable && source.get_InsideH() === null) {
            source.put_InsideH(new CBorder());
        }
        if (source.get_InsideH() !== null) {
            for (i = 0; i < this._tableBordersImageSpacing.columns; i++) {
                this._UpdateCellBorderSpacing_(source.get_InsideH(), "b", this._tableBordersImageSpacing.getCell(i, 0));
                this._UpdateCellBorderSpacing_(source.get_InsideH(), "t", this._tableBordersImageSpacing.getCell(i, 1));
            }
        }
        this._tableBordersImageSpacing.setVirtualBorderSize(oldSize.pxValue);
        var colorstr = Ext.String.format("#{0}", (typeof(oldColor) == "object") ? oldColor.color : oldColor);
        this._tableBordersImageSpacing.setVirtualBorderColor(colorstr);
        this.ResumeEvents();
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
                    this._tableBordersImageSpacing.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                    this._tableBordersImageSpacing.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                } else {
                    this._tableBordersImageSpacing.setBordersSize(borderName, 0);
                }
            } else {
                this._tableBordersImageSpacing.setBordersSize(borderName, this.IndeterminateSize);
                this._tableBordersImageSpacing.setBordersColor(borderName, this.IndeterminateColor);
            }
        } else {
            this._tableBordersImageSpacing.setBordersSize(borderName, this.IndeterminateSize);
            this._tableBordersImageSpacing.setBordersColor(borderName, this.IndeterminateColor);
        }
    },
    _UpdateBordersNoSpacing_: function () {
        this.SuspendEvents();
        var source = (this._allTable) ? this.TableBorders : this.CellBorders;
        var oldSize = this.BorderSize;
        var oldColor = this._btnBorderColor.color;
        this._UpdateTableBorderNoSpacing_(source.get_Left(), "l");
        this._UpdateTableBorderNoSpacing_(source.get_Top(), "t");
        this._UpdateTableBorderNoSpacing_(source.get_Right(), "r");
        this._UpdateTableBorderNoSpacing_(source.get_Bottom(), "b");
        if (this._allTable && source.get_InsideV() == null) {
            source.put_InsideV(new CBorder());
        }
        if (source.get_InsideV() !== null) {
            for (var i = 0; i < this._tableBordersImage.rows; i++) {
                this._UpdateCellBorderNoSpacing_(source.get_InsideV(), "r", this._tableBordersImage.getCell(0, i));
                this._UpdateCellBorderNoSpacing_(source.get_InsideV(), "l", this._tableBordersImage.getCell(1, i));
            }
        }
        if (this._allTable && source.get_InsideH() == null) {
            source.put_InsideH(new CBorder());
        }
        if (source.get_InsideH() !== null) {
            for (i = 0; i < this._tableBordersImage.columns; i++) {
                this._UpdateCellBorderNoSpacing_(source.get_InsideH(), "b", this._tableBordersImage.getCell(i, 0));
                this._UpdateCellBorderNoSpacing_(source.get_InsideH(), "t", this._tableBordersImage.getCell(i, 1));
            }
        }
        this._tableBordersImage.setVirtualBorderSize(oldSize.pxValue);
        var colorstr = Ext.String.format("#{0}", (typeof(oldColor) == "object") ? oldColor.color : oldColor);
        this._tableBordersImage.setVirtualBorderColor(colorstr);
        this.ResumeEvents();
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
                    this._tableBordersImage.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                    this._tableBordersImage.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
                } else {
                    this._tableBordersImage.setBordersSize(borderName, 0);
                }
            } else {
                this._tableBordersImage.setBordersSize(borderName, this.IndeterminateSize);
                this._tableBordersImage.setBordersColor(borderName, this.IndeterminateColor);
            }
        } else {
            this._tableBordersImage.setBordersSize(borderName, this.IndeterminateSize);
            this._tableBordersImage.setBordersColor(borderName, this.IndeterminateColor);
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
    _ApplyBorderPreset: function (cellborder, tableborder) {
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
            var color = this.getRgbColor(this._btnBorderColor.color);
            border.put_Color(color);
        } else {
            border.put_Color(new CAscColor());
            border.put_Value(0);
        }
        return border.get_Value();
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
    sendThemeColors: function (effectcolors, standartcolors) {
        this.colorsBorder.updateColors(effectcolors, standartcolors);
        this.colorsBack.updateColors(effectcolors, standartcolors);
        this.colorsTableBack.updateColors(effectcolors, standartcolors);
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
});