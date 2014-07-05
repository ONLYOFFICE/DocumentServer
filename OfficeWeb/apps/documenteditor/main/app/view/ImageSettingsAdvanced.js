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
 Ext.define("DE.view.ImageSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.deimagesettingsadvanced",
    requires: ["Common.component.MetricSpinner", "Ext.window.Window", "Ext.form.field.Radio", "DE.view.ShapeSettingsAdvancedCnt", "Ext.util.Cookies"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 442,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    _defaults: {
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
    listeners: {
        show: function () {
            if (this.btnWrapInline.pressed) {
                this._DisableElem(c_oAscWrapStyle2.Inline);
            }
        }
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._state = {
            HAlignTypeIdx: 0,
            HAlignFromIdx: 0,
            HPositionFromIdx: 0,
            VAlignTypeIdx: 0,
            VAlignFromIdx: 0,
            VPositionFromIdx: 0,
            spnXChanged: false,
            spnYChanged: false
        };
        this._changedProps = null;
        this._objectType = c_oAscTypeSelectElement.Image;
        this.Margins = undefined;
        this._nRatio = 1;
        this._spnWidth = Ext.create("Common.component.MetricSpinner", {
            id: "image-advanced-spin-width",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 80,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._btnRatio.pressed) {
                        var w = field.getNumberValue();
                        var h = w / this._nRatio;
                        if (h > this._defaults.sizeMax.height) {
                            h = this._defaults.sizeMax.height;
                            w = h * this._nRatio;
                            this._spnWidth.suspendEvents(false);
                            this._spnWidth.setValue(w);
                            this._spnWidth.resumeEvents();
                        }
                        this._spnHeight.suspendEvents(false);
                        this._spnHeight.setValue(h);
                        this._spnHeight.resumeEvents();
                    }
                    if (this._changedProps) {
                        this._changedProps.put_Width(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this._changedProps.put_Height(Common.MetricSettings.fnRecalcToMM(this._spnHeight.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnHeight = Ext.create("Common.component.MetricSpinner", {
            id: "image-advanced-span-height",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 80,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    var h = field.getNumberValue(),
                    w = null;
                    if (this._btnRatio.pressed) {
                        w = h * this._nRatio;
                        if (w > this._defaults.sizeMax.width) {
                            w = this._defaults.sizeMax.width;
                            h = w / this._nRatio;
                            this._spnHeight.suspendEvents(false);
                            this._spnHeight.setValue(h);
                            this._spnHeight.resumeEvents();
                        }
                        this._spnWidth.suspendEvents(false);
                        this._spnWidth.setValue(w);
                        this._spnWidth.resumeEvents();
                    }
                    if (this._changedProps) {
                        this._changedProps.put_Height(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this._changedProps.put_Width(Common.MetricSettings.fnRecalcToMM(this._spnWidth.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._btnOriginalSize = Ext.create("Ext.Button", {
            id: "image-advanced-button-original-size",
            text: this.textOriginalSize,
            width: 100,
            height: 22,
            style: "margin: 0 0 0 7px",
            listeners: {
                click: function (o, e) {
                    this._spnWidth.suspendEvents(false);
                    this._spnHeight.suspendEvents(false);
                    this._spnWidth.setValue(this._defaults.sizeOriginal.width);
                    this._spnHeight.setValue(this._defaults.sizeOriginal.height);
                    this._spnWidth.resumeEvents();
                    this._spnHeight.resumeEvents();
                    this._nRatio = this._defaults.sizeOriginal.width / this._defaults.sizeOriginal.height;
                    if (this._changedProps) {
                        this._changedProps.put_Height(Common.MetricSettings.fnRecalcToMM(this._spnHeight.getNumberValue()));
                        this._changedProps.put_Width(Common.MetricSettings.fnRecalcToMM(this._spnWidth.getNumberValue()));
                    }
                },
                scope: this
            }
        });
        this._btnRatio = Ext.create("Ext.Button", {
            id: "image-advanced-button-ratio",
            iconCls: "advanced-btn-ratio",
            enableToggle: true,
            width: 22,
            height: 22,
            style: "margin: 0 0 0 6px;",
            tooltip: this.textKeepRatio,
            toggleHandler: Ext.bind(function (btn) {
                if (btn.pressed && this._spnHeight.getNumberValue() > 0) {
                    this._nRatio = this._spnWidth.getNumberValue() / this._spnHeight.getNumberValue();
                }
            },
            this)
        });
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.btnWrapInline = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-inline",
            cls: "asc-right-panel-wrapbtn btn-wrap-inline",
            posId: c_oAscWrapStyle2.Inline,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapInlineTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            pressed: true,
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this.btnWrapSquare = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-square",
            cls: "asc-right-panel-wrapbtn btn-wrap-square",
            posId: c_oAscWrapStyle2.Square,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapSquareTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this.btnWrapTight = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-tight",
            cls: "asc-right-panel-wrapbtn btn-wrap-tight",
            posId: c_oAscWrapStyle2.Tight,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapTightTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this.btnWrapThrough = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-through",
            cls: "asc-right-panel-wrapbtn btn-wrap-through",
            posId: c_oAscWrapStyle2.Through,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapThroughTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this.btnWrapTopBottom = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-topbottom",
            cls: "asc-right-panel-wrapbtn btn-wrap-topbottom",
            posId: c_oAscWrapStyle2.TopAndBottom,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapNoneTopbottom,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this.btnWrapBehind = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-behind",
            cls: "asc-right-panel-wrapbtn btn-wrap-behind",
            posId: c_oAscWrapStyle2.Behind,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapBehindTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this.btnWrapInFront = Ext.create("Ext.Button", {
            id: "image-advanced-button-wrap-infront",
            cls: "asc-right-panel-wrapbtn btn-wrap-infront",
            posId: c_oAscWrapStyle2.InFront,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textWrapInFrontTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imgAdvWrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                this._DisableElem(btn.posId);
                if (this._changedProps) {
                    this._changedProps.put_WrappingStyle(btn.posId);
                }
            },
            this)
        });
        this._spnTop = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-top",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                            this._changedProps.put_Paddings(new CPaddings());
                        }
                        this._changedProps.get_Paddings().put_Top(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnBottom = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-bottom",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                            this._changedProps.put_Paddings(new CPaddings());
                        }
                        this._changedProps.get_Paddings().put_Bottom(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnLeft = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-left",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.32 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                            this._changedProps.put_Paddings(new CPaddings());
                        }
                        this._changedProps.get_Paddings().put_Left(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnRight = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-right",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.32 cm",
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Paddings() === null || this._changedProps.get_Paddings() === undefined) {
                            this._changedProps.put_Paddings(new CPaddings());
                        }
                        this._changedProps.get_Paddings().put_Right(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnX = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-x",
            readOnly: false,
            maxValue: 55.87,
            minValue: -55.87,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 115,
            disabled: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CImagePositionH());
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
            id: "image-span-y",
            readOnly: false,
            maxValue: 55.87,
            minValue: -55.87,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 115,
            disabled: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CImagePositionV());
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
        this._arrHAlign = [[c_oAscAlignH.Left, this.textLeft], [c_oAscAlignH.Center, this.textCenter], [c_oAscAlignH.Right, this.textRight]];
        this.cmbHAlign = Ext.create("Ext.form.field.ComboBox", {
            id: "image-combo-halign",
            width: 115,
            editable: false,
            store: this._arrHAlign,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CImagePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(true);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HAlignFromIdx][0]);
                        this._changedProps.get_PositionH().put_Align(this._arrHAlign[records[0].index][0]);
                        this._state.HAlignTypeIdx = records[0].index;
                    }
                },
                this)
            }
        });
        this.cmbHAlign.setValue(this._arrHAlign[0][0]);
        this._arrHRelative = [[c_oAscRelativeFromH.Character, this.textCharacter], [c_oAscRelativeFromH.Column, this.textColumn], [c_oAscRelativeFromH.LeftMargin, this.textLeftMargin], [c_oAscRelativeFromH.Margin, this.textMargin], [c_oAscRelativeFromH.Page, this.textPage], [c_oAscRelativeFromH.RightMargin, this.textRightMargin]];
        this.cmbHRelative = Ext.create("Ext.form.field.ComboBox", {
            id: "image-combo-hrelative",
            width: 115,
            editable: false,
            store: this._arrHRelative,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionH() === null || this._changedProps.get_PositionH() === undefined) {
                            this._changedProps.put_PositionH(new CImagePositionH());
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
            id: "image-combo-hposition",
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
                            this._changedProps.put_PositionH(new CImagePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(false);
                        this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[records[0].index][0]);
                        this._state.HPositionFromIdx = records[0].index;
                        if (!this._state.spnXChanged) {
                            var val = this._defaults.properties.get_Value_X(this._arrHRelative[records[0].index][0]);
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
        this._arrVAlign = [[c_oAscAlignV.Top, this.textTop], [c_oAscAlignV.Center, this.textCenter], [c_oAscAlignV.Bottom, this.textBottom]];
        this.cmbVAlign = Ext.create("Ext.form.field.ComboBox", {
            id: "image-combo-valign",
            width: 115,
            editable: false,
            store: this._arrVAlign,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CImagePositionV());
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
        this._arrVRelative = [[c_oAscRelativeFromV.Line, this.textLine], [c_oAscRelativeFromV.Margin, this.textMargin], [c_oAscRelativeFromV.BottomMargin, this.textBottomMargin], [c_oAscRelativeFromV.Paragraph, this.textParagraph], [c_oAscRelativeFromV.Page, this.textPage], [c_oAscRelativeFromV.TopMargin, this.textTopMargin]];
        this.cmbVRelative = Ext.create("Ext.form.field.ComboBox", {
            id: "image-combo-vrelative",
            width: 115,
            editable: false,
            store: this._arrVRelative,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_PositionV() === null || this._changedProps.get_PositionV() === undefined) {
                            this._changedProps.put_PositionV(new CImagePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(true);
                        this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[records[0].index][0]);
                        this._changedProps.get_PositionV().put_Align(this._arrVAlign[this._state.VAlignTypeIdx][0]);
                        this._state.VAlignFromIdx = records[0].index;
                        this.chMove.suspendEvents(false);
                        this.chMove.setValue(this._arrVRelative[records[0].index][0] == c_oAscRelativeFromV.Line || this._arrVRelative[records[0].index][0] == c_oAscRelativeFromV.Paragraph);
                        this.chMove.resumeEvents();
                    }
                },
                this)
            }
        });
        this.cmbVRelative.setValue(this._arrVRelative[0][0]);
        this.cmbVPosition = Ext.create("Ext.form.field.ComboBox", {
            id: "image-combo-vposition",
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
                            this._changedProps.put_PositionV(new CImagePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(false);
                        this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[records[0].index][0]);
                        this._state.VPositionFromIdx = records[0].index;
                        if (!this._state.spnYChanged) {
                            var val = this._defaults.properties.get_Value_Y(this._arrVRelative[records[0].index][0]);
                            this._spnY.suspendEvents(false);
                            this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(val));
                            this._spnY.resumeEvents();
                        }
                        this._changedProps.get_PositionV().put_Value(Common.MetricSettings.fnRecalcToMM(this._spnY.getNumberValue()));
                        this.chMove.suspendEvents(false);
                        this.chMove.setValue(this._arrVRelative[records[0].index][0] == c_oAscRelativeFromV.Line || this._arrVRelative[records[0].index][0] == c_oAscRelativeFromV.Paragraph);
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
                            this._changedProps.put_PositionH(new CImagePositionH());
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
                            this._changedProps.put_PositionH(new CImagePositionH());
                        }
                        this._changedProps.get_PositionH().put_UseAlign(!radio.getValue());
                        if (radio.getValue()) {
                            this._changedProps.get_PositionH().put_Value(Common.MetricSettings.fnRecalcToMM(this._spnX.getNumberValue()));
                            this._changedProps.get_PositionH().put_RelativeFrom(this._arrHRelative[this._state.HPositionFromIdx][0]);
                        }
                    }
                    if (radio.getValue()) {
                        this.cmbHAlign.setDisabled(true);
                        this.cmbHRelative.setDisabled(true);
                        this._spnX.setDisabled(false);
                        this.cmbHPosition.setDisabled(false);
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
                            this._changedProps.put_PositionV(new CImagePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(radio.getValue());
                        if (radio.getValue()) {
                            this._changedProps.get_PositionV().put_Align(this._arrVAlign[this._state.VAlignTypeIdx][0]);
                            this._changedProps.get_PositionV().put_RelativeFrom(this._arrVRelative[this._state.VAlignFromIdx][0]);
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
                            this._changedProps.put_PositionV(new CImagePositionV());
                        }
                        this._changedProps.get_PositionV().put_UseAlign(!radio.getValue());
                        if (radio.getValue()) {
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
            id: "image-checkbox-move",
            boxLabel: this.textMove,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        var rec = this.cmbVPosition.getStore().getAt((field.getValue() == "checked") ? 3 : 4);
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
            id: "image-checkbox-overlap",
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
        this._spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            id: "image-margin-top",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this.Margins === undefined) {
                            this.Margins = new CPaddings();
                        }
                        this.Margins.put_Top(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnMarginBottom = Ext.create("Common.component.MetricSpinner", {
            id: "image-margin-bottom",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this.Margins === undefined) {
                            this.Margins = new CPaddings();
                        }
                        this.Margins.put_Bottom(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnMarginLeft = Ext.create("Common.component.MetricSpinner", {
            id: "image-margin-left",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this.Margins === undefined) {
                            this.Margins = new CPaddings();
                        }
                        this.Margins.put_Left(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnMarginRight = Ext.create("Common.component.MetricSpinner", {
            id: "image-margin-right",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this.Margins === undefined) {
                            this.Margins = new CPaddings();
                        }
                        this.Margins.put_Right(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        function _changeCard(btn) {
            if (btn.pressed) {
                mainCard.getLayout().setActiveItem(btn.card);
            }
        }
        var btnSize = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textSize,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imageadvanced",
            pressed: true,
            card: "card-size",
            listeners: {
                click: _changeCard
            }
        });
        this.btnTextWrap = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textBtnWrap,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imageadvanced",
            card: "card-wrap",
            listeners: {
                click: _changeCard
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
            toggleGroup: "imageadvanced",
            card: "card-position",
            listeners: {
                click: _changeCard
            }
        });
        this.btnShape = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textShape,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imageadvanced",
            card: "card-shape",
            listeners: {
                click: _changeCard
            }
        });
        this.btnMargins = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            textAlign: "right",
            text: this.strMargins,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "imageadvanced",
            card: "card-margins",
            listeners: {
                click: _changeCard
            }
        });
        this._contDistance = Ext.create("Ext.Container", {
            cls: "image-advanced-container",
            padding: "0 10",
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 104,
            width: 200,
            items: [{
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 2,
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
                    width: 113,
                    items: [{
                        xtype: "label",
                        text: this.textTop,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnTop]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textLeft,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnLeft]
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
                    columns: 2,
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
                    width: 113,
                    items: [{
                        xtype: "label",
                        text: this.textBottom,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnBottom]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textRight,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnRight]
                }]
            },
            {
                xtype: "tbspacer",
                height: 7
            }]
        });
        this._contPosition = Ext.create("Ext.Container", {
            cls: "image-advanced-container",
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
            cls: "image-advanced-container",
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
        var cntrSize = {
            xtype: "container",
            itemId: "card-size",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 2
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 43,
                    style: "float:left;"
                },
                items: [{
                    width: 108,
                    items: [{
                        xtype: "label",
                        text: this.textWidth,
                        width: 80
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    {
                        xtype: "container",
                        width: 108,
                        layout: {
                            type: "hbox"
                        },
                        items: [this._spnWidth, this._btnRatio]
                    }]
                },
                {
                    width: 195,
                    margin: "0 0 0 7",
                    items: [{
                        xtype: "label",
                        text: this.textHeight,
                        width: 80
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    {
                        xtype: "container",
                        width: 195,
                        layout: {
                            type: "hbox"
                        },
                        items: [this._spnHeight, this._btnOriginalSize]
                    }]
                }]
            }]
        };
        var cntrTextWrap = {
            xtype: "container",
            itemId: "card-wrap",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textWrap
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                padding: "0 10",
                items: [this.btnWrapInline, this.btnWrapSquare, this.btnWrapTight, this.btnWrapThrough]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                padding: "0 10",
                items: [this.btnWrapTopBottom, this.btnWrapInFront, this.btnWrapBehind]
            },
            this._spacer.cloneConfig({
                style: "margin: 13px 0 11px 0;",
                height: 6
            }), {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textDistance
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            this._contDistance]
        };
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
        var cntrShape = {
            xtype: "container",
            itemId: "card-shape",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [this._contShape = Ext.create("DE.view.ShapeSettingsAdvancedCnt")]
        };
        var cntrMargins = {
            xtype: "container",
            itemId: "card-margins",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
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
        var mainCard = Ext.create("Ext.container.Container", {
            height: 330,
            flex: 1,
            padding: "12px 18px 0 10px",
            layout: "card",
            items: [cntrSize, cntrTextWrap, cntrPosition, cntrShape, cntrMargins]
        });
        this.items = [{
            xtype: "container",
            height: 346,
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
                    items: btnSize
                },
                {
                    height: 30,
                    items: this.btnTextWrap
                },
                {
                    height: 30,
                    items: this.btnPosition
                },
                {
                    height: 30,
                    items: this.btnShape
                },
                {
                    height: 30,
                    items: this.btnMargins
                }]
            },
            {
                xtype: "box",
                cls: "advanced-settings-separator",
                height: "100%",
                width: 8
            },
            mainCard]
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
                            this.fireEvent("onmodalresult", this, 1, this.getSettings());
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
        this._setDefaults(this._defaults.properties);
    },
    setSizeOriginal: function (p) {
        this._defaults.sizeOriginal.width = Common.MetricSettings.fnRecalcFromMM(p.width);
        this._defaults.sizeOriginal.height = Common.MetricSettings.fnRecalcFromMM(p.height);
    },
    setSizeMax: function (p) {
        this._defaults.sizeMax.width = Common.MetricSettings.fnRecalcFromMM(p.width);
        this._defaults.sizeMax.height = Common.MetricSettings.fnRecalcFromMM(p.height);
    },
    setSettings: function (props) {
        this._defaults.properties = props;
        this._changedProps = null;
    },
    _setDefaults: function (props) {
        if (props) {
            this._objectType = c_oAscTypeSelectElement.Image;
            var value = props.get_WrappingStyle();
            if (props.get_CanBeFlow()) {
                switch (value) {
                case c_oAscWrapStyle2.Inline:
                    this.btnWrapInline.toggle(true, false);
                    break;
                case c_oAscWrapStyle2.Square:
                    this.btnWrapSquare.toggle(true, false);
                    break;
                case c_oAscWrapStyle2.Tight:
                    this.btnWrapTight.toggle(true, false);
                    break;
                case c_oAscWrapStyle2.Through:
                    this.btnWrapThrough.toggle(true, false);
                    break;
                case c_oAscWrapStyle2.TopAndBottom:
                    this.btnWrapTopBottom.toggle(true, false);
                    break;
                case c_oAscWrapStyle2.Behind:
                    this.btnWrapBehind.toggle(true, false);
                    break;
                case c_oAscWrapStyle2.InFront:
                    this.btnWrapInFront.toggle(true, false);
                    break;
                default:
                    this.btnWrapInline.toggle(false, false);
                    this.btnWrapSquare.toggle(false, false);
                    this.btnWrapTight.toggle(false, false);
                    this.btnWrapThrough.toggle(false, false);
                    this.btnWrapTopBottom.toggle(false, false);
                    this.btnWrapBehind.toggle(false, false);
                    this.btnWrapInFront.toggle(false, false);
                    break;
                }
            } else {
                this.btnWrapInline.toggle(true, false);
                this.btnWrapSquare.setDisabled(true);
                this.btnWrapTight.setDisabled(true);
                this.btnWrapThrough.setDisabled(true);
                this.btnWrapTopBottom.setDisabled(true);
                this.btnWrapBehind.setDisabled(true);
                this.btnWrapInFront.setDisabled(true);
            }
            this._spnWidth.suspendEvents(false);
            this._spnHeight.suspendEvents(false);
            this._spnWidth.setMaxValue(this._defaults.sizeMax.width);
            this._spnHeight.setMaxValue(this._defaults.sizeMax.height);
            this._spnWidth.setValue(Common.MetricSettings.fnRecalcFromMM(props.get_Width()).toFixed(2));
            this._spnHeight.setValue(Common.MetricSettings.fnRecalcFromMM(props.get_Height()).toFixed(2));
            this._spnWidth.resumeEvents();
            this._spnHeight.resumeEvents();
            if (props.get_Paddings()) {
                var Paddings = {
                    Top: props.get_Paddings().get_Top(),
                    Right: props.get_Paddings().get_Right(),
                    Bottom: props.get_Paddings().get_Bottom(),
                    Left: props.get_Paddings().get_Left()
                };
                if (Paddings.Top !== null && Paddings.Top !== undefined) {
                    this._spnTop.setValue(Common.MetricSettings.fnRecalcFromMM(Paddings.Top));
                }
                if (Paddings.Left !== null && Paddings.Left !== undefined) {
                    this._spnLeft.setValue(Common.MetricSettings.fnRecalcFromMM(Paddings.Left));
                }
                if (Paddings.Bottom !== null && Paddings.Bottom !== undefined) {
                    this._spnBottom.setValue(Common.MetricSettings.fnRecalcFromMM(Paddings.Bottom));
                }
                if (Paddings.Right !== null && Paddings.Right !== undefined) {
                    this._spnRight.setValue(Common.MetricSettings.fnRecalcFromMM(Paddings.Right));
                }
            }
            var Position = props.get_PositionH();
            if (Position) {
                if (Position.get_UseAlign()) {
                    value = Position.get_Align();
                    for (var i = 0; i < this._arrHAlign.length; i++) {
                        if (value == this._arrHAlign[i][0]) {
                            this.cmbHAlign.setValue(this._arrHAlign[i][1]);
                            this._state.HAlignTypeIdx = i;
                            break;
                        }
                    }
                    value = Position.get_RelativeFrom();
                    for (i = 0; i < this._arrHRelative.length; i++) {
                        if (value == this._arrHRelative[i][0]) {
                            this.cmbHRelative.setValue(this._arrHRelative[i][1]);
                            this._state.HAlignFromIdx = i;
                            break;
                        }
                    }
                } else {
                    this.radioHPosition.setValue(true);
                    value = Position.get_Value();
                    this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                    value = Position.get_RelativeFrom();
                    for (i = 0; i < this._arrHRelative.length; i++) {
                        if (value == this._arrHRelative[i][0]) {
                            this.cmbHPosition.setValue(this._arrHRelative[i][1]);
                            this._state.HPositionFromIdx = i;
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
                        if (value == this._arrVAlign[i][0]) {
                            this.cmbVAlign.setValue(this._arrVAlign[i][1]);
                            this._state.VAlignTypeIdx = i;
                            break;
                        }
                    }
                } else {
                    this.radioVPosition.setValue(true);
                    value = Position.get_Value();
                    this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                }
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
                if (value == c_oAscRelativeFromV.Line || value == c_oAscRelativeFromV.Paragraph) {
                    this.chMove.setValue(true);
                }
            }
            this.chOverlap.setValue((props.get_AllowOverlap() !== null && props.get_AllowOverlap() !== undefined) ? props.get_AllowOverlap() : "indeterminate");
            if (props.get_Height() > 0) {
                this._nRatio = props.get_Width() / props.get_Height();
            }
            var shapeprops = props.get_ShapeProperties();
            this._btnOriginalSize.setVisible(!(shapeprops));
            this._btnOriginalSize.setDisabled(props.get_ImageUrl() === null || props.get_ImageUrl() === undefined);
            this.btnShape.setVisible(shapeprops !== null);
            this.btnMargins.setVisible(shapeprops !== null);
            this.btnTextWrap.setDisabled(props.get_FromGroup());
            if (shapeprops) {
                this._objectType = c_oAscTypeSelectElement.Shape;
                this._contShape._setDefaults(shapeprops);
                this.setTitle(this.textTitleShape);
                value = window.localStorage.getItem("de-settings-shaperatio");
                var margins = shapeprops.get_paddings();
                if (margins) {
                    var val = margins.get_Left();
                    this._spnMarginLeft.setValue((null !== val && undefined !== val) ? Common.MetricSettings.fnRecalcFromMM(val) : "");
                    val = margins.get_Top();
                    this._spnMarginTop.setValue((null !== val && undefined !== val) ? Common.MetricSettings.fnRecalcFromMM(val) : "");
                    val = margins.get_Right();
                    this._spnMarginRight.setValue((null !== val && undefined !== val) ? Common.MetricSettings.fnRecalcFromMM(val) : "");
                    val = margins.get_Bottom();
                    this._spnMarginBottom.setValue((null !== val && undefined !== val) ? Common.MetricSettings.fnRecalcFromMM(val) : "");
                }
            } else {
                this.setTitle(this.textTitle);
                value = window.localStorage.getItem("de-settings-imageratio");
                if (value === null) {
                    value = 1;
                }
            }
            if (value !== null && parseInt(value) == 1) {
                this._btnRatio.toggle(true);
            }
            this._changedProps = new CImgProperty();
        }
    },
    getSettings: function () {
        var value = (this._btnRatio.pressed) ? 1 : 0;
        if (this._objectType == c_oAscTypeSelectElement.Shape) {
            window.localStorage.setItem("de-settings-shaperatio", value);
        } else {
            window.localStorage.setItem("de-settings-imageratio", value);
        }
        var properties = this._changedProps;
        if (this._objectType == c_oAscTypeSelectElement.Shape) {
            properties.put_ShapeProperties(this._contShape.getSettings());
            if (this.Margins) {
                if (properties.get_ShapeProperties() === null || properties.get_ShapeProperties() === undefined) {
                    properties.put_ShapeProperties(new CAscShapeProp);
                }
                properties.get_ShapeProperties().put_paddings(this.Margins);
            }
        }
        if (this._defaults.properties.get_WrappingStyle() === c_oAscWrapStyle2.Inline && properties.get_WrappingStyle() !== undefined && properties.get_WrappingStyle() !== c_oAscWrapStyle2.Inline) {
            if (properties.get_PositionH() === null || properties.get_PositionH() === undefined) {
                properties.put_PositionH(new CImagePositionH());
                properties.get_PositionH().put_UseAlign(false);
                properties.get_PositionH().put_RelativeFrom(c_oAscRelativeFromH.Column);
                var val = this._defaults.properties.get_Value_X(c_oAscRelativeFromH.Column);
                properties.get_PositionH().put_Value(val);
            }
            if (properties.get_PositionV() === null || properties.get_PositionV() === undefined) {
                properties.put_PositionV(new CImagePositionV());
                properties.get_PositionV().put_UseAlign(false);
                properties.get_PositionV().put_RelativeFrom(c_oAscRelativeFromV.Paragraph);
                val = this._defaults.properties.get_Value_Y(c_oAscRelativeFromV.Paragraph);
                properties.get_PositionV().put_Value(val);
            }
        }
        return properties;
    },
    _DisableElem: function (btnId) {
        var disabledLR = (btnId == c_oAscWrapStyle2.Inline || btnId == c_oAscWrapStyle2.Behind || btnId == c_oAscWrapStyle2.InFront || btnId == c_oAscWrapStyle2.TopAndBottom);
        var disabledTB = (btnId == c_oAscWrapStyle2.Inline || btnId == c_oAscWrapStyle2.Behind || btnId == c_oAscWrapStyle2.InFront || btnId == c_oAscWrapStyle2.Tight || btnId == c_oAscWrapStyle2.Through);
        var disabledPos = (btnId == c_oAscWrapStyle2.Inline);
        this._spnLeft.setDisabled(disabledLR);
        this._spnRight.setDisabled(disabledLR);
        this._spnTop.setDisabled(disabledTB);
        this._spnBottom.setDisabled(disabledTB);
        this._contPosition.setDisabled(disabledPos);
        this._contOptions.setDisabled(disabledPos);
        this.btnPosition.setDisabled(btnId == c_oAscWrapStyle2.Inline);
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.01 : 1);
            }
        }
        this._defaults.sizeMax.width = Common.MetricSettings.fnRecalcFromMM(this._defaults.sizeMax.width * 10);
        this._defaults.sizeMax.height = Common.MetricSettings.fnRecalcFromMM(this._defaults.sizeMax.height * 10);
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
    textWrapNoneTopbottom: "Top and Bottom",
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
    strMargins: "Margins"
});