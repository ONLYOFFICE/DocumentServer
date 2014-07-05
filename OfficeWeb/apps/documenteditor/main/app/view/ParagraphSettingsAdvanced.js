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
 Ext.define("DE.view.ParagraphSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.deparagraphsettingsadvanced",
    requires: ["Ext.Array", "Ext.form.field.ComboBox", "Ext.window.Window", "Common.component.ThemeColorPalette", "Common.component.MetricSpinner", "DE.component.TableStyler", "Common.component.IndeterminateCheckBox", "Common.plugin.GridScrollPane", "Ext.grid.Panel", "Common.plugin.ComboBoxScrollPane"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 390,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
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
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        this.numFirstLine = Ext.create("Common.component.MetricSpinner", {
            id: "paragraphadv-spin-first-line",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                            this._changedProps.put_Ind(new CParagraphInd());
                        }
                        this._changedProps.get_Ind().put_FirstLine(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.numIndentsLeft = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-indent-left",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                            this._changedProps.put_Ind(new CParagraphInd());
                        }
                        this._changedProps.get_Ind().put_Left(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.numIndentsRight = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-indent-right",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                            this._changedProps.put_Ind(new CParagraphInd());
                        }
                        this._changedProps.get_Ind().put_Right(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
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
        this.chBreakBefore = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-break-before",
            boxLabel: this.strBreakBefore,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_PageBreakBefore(field.getValue() == "checked");
                    }
                },
                this)
            }
        });
        this.chKeepLines = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-keep-lines",
            boxLabel: this.strKeepLines,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_KeepLines(field.getValue() == "checked");
                    }
                },
                this)
            }
        });
        this.chOrphan = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-orphan",
            boxLabel: this.strOrphan,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_WidowControl(field.getValue() == "checked");
                    }
                },
                this)
            }
        });
        this.chKeepNext = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-keep-next",
            boxLabel: this.strKeepNext,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_KeepNext(field.getValue() == "checked");
                    }
                },
                this)
            }
        });
        var _arrBorderPresets = [[c_tableBorder.BORDER_OUTER, "lrtb", "asc-advanced-settings-position-btn btn-adv-paragraph-outer", "paragraphadv-button-border-outer", this.tipOuter], [c_tableBorder.BORDER_ALL, "lrtbm", "asc-advanced-settings-position-btn btn-adv-paragraph-all", "paragraphadv-button-border-all", this.tipAll], [c_tableBorder.BORDER_NONE, "", "asc-advanced-settings-position-btn btn-adv-paragraph-none", "paragraphadv-button-border-none", this.tipNone], [c_tableBorder.BORDER_VERTICAL_LEFT, "l", "asc-advanced-settings-position-btn btn-adv-paragraph-left", "paragraphadv-button-border-left", this.tipLeft], [c_tableBorder.BORDER_VERTICAL_RIGHT, "r", "asc-advanced-settings-position-btn btn-adv-paragraph-right", "paragraphadv-button-border-right", this.tipRight], [c_tableBorder.BORDER_HORIZONTAL_TOP, "t", "asc-advanced-settings-position-btn btn-adv-paragraph-top", "paragraphadv-button-border-top", this.tipTop], [c_tableBorder.BORDER_HORIZONTAL_CENTER, "m", "asc-advanced-settings-position-btn btn-adv-paragraph-inner-hor", "paragraphadv-button-border-inner-hor", this.tipInner], [c_tableBorder.BORDER_HORIZONTAL_BOTTOM, "b", "asc-advanced-settings-position-btn btn-adv-paragraph-bottom", "paragraphadv-button-border-bottom", this.tipBottom]];
        this._btnsBorderPosition = [];
        Ext.Array.forEach(_arrBorderPresets, function (item, index) {
            var _btn = Ext.create("Ext.Button", {
                id: item[3],
                cls: item[2],
                posId: item[0],
                strId: item[1],
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
        this._BordersImage = Ext.widget("detablestyler", {
            id: "id-deparagraphstyler",
            width: 200,
            height: 170,
            rows: this.tableStylerRows,
            columns: this.tableStylerColumns,
            spacingMode: false
        });
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
                    this._BordersImage.setVirtualBorderSize(this.BorderSize.pxValue);
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
            id: "paragraphadv-button-border-color",
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
                                me._BordersImage.setVirtualBorderColor(colorstr);
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
            id: "paragraphadv-button-back-color",
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
                                me._btnBackColor.color = color;
                                if (color == "transparent") {
                                    clr = "transparent";
                                    border = "1px solid #BEBEBE";
                                } else {
                                    clr = Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color);
                                    border = "none";
                                }
                                if (me._btnBackColor.btnEl) {
                                    Ext.DomHelper.applyStyles(me._btnBackColor.btnEl, {
                                        "background-color": clr,
                                        "border": border
                                    });
                                }
                                me.paragraphShade = me._btnBackColor.color;
                                if (me._changedProps) {
                                    if (me._changedProps.get_Shade() === undefined || me._changedProps.get_Shade() === null) {
                                        me._changedProps.put_Shade(new CParagraphShd());
                                    }
                                    if (me._btnBackColor.color == "transparent") {
                                        me._changedProps.get_Shade().put_Value(shd_Nil);
                                    } else {
                                        me._changedProps.get_Shade().put_Value(shd_Clear);
                                        me._changedProps.get_Shade().put_Color(me.getRgbColor(me._btnBackColor.color));
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
        this.chStrike = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-strike",
            width: 140,
            boxLabel: this.strStrike,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
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
                this)
            }
        });
        this.chDoubleStrike = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-double-strike",
            width: 140,
            boxLabel: this.strDoubleStrike,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
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
                this)
            }
        });
        this.chSuperscript = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-superscript",
            width: 140,
            boxLabel: this.strSuperscript,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
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
                this)
            }
        });
        this.chSubscript = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-subscript",
            width: 140,
            boxLabel: this.strSubscript,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
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
                this)
            }
        });
        this.chSmallCaps = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-small-caps",
            width: 140,
            boxLabel: this.strSmallCaps,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
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
                this)
            }
        });
        this.chAllCaps = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-all-caps",
            width: 140,
            boxLabel: this.strAllCaps,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
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
                this)
            }
        });
        this.numSpacing = Ext.create("Common.component.MetricSpinner", {
            id: "paragraphadv-spin-spacing",
            readOnly: false,
            step: 0.01,
            width: 100,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_TextSpacing(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_TextSpacing(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.numPosition = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-position",
            readOnly: false,
            step: 0.01,
            width: 100,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_Position(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_Position(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.fontImage = Ext.create("Ext.container.Container", {
            id: "paragraphadv-font-img",
            width: "100%",
            height: 80,
            style: "background-color:#ffffff; border:1px solid #CDCDCD;"
        });
        this.numTab = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-tab",
            readOnly: false,
            step: 0.1,
            width: 180,
            defaultUnit: "cm",
            value: "1.25 cm",
            maxValue: 55.87,
            minValue: 0
        });
        this.numDefaultTab = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-default-tab",
            readOnly: false,
            step: 0.1,
            width: 107,
            defaultUnit: "cm",
            value: "1.25 cm",
            maxValue: 55.87,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_DefaultTab(parseFloat(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()).toFixed(1)));
                    }
                },
                this)
            }
        });
        this.btnAddTab = Ext.create("Ext.Button", {
            width: 90,
            text: this.textSet,
            enableToggle: false,
            listeners: {
                click: Ext.bind(function (btn, eOpts) {
                    var val = this.numTab.getNumberValue();
                    var align = this.radioLeft.getValue() ? 1 : (this.radioCenter.getValue() ? 3 : 2);
                    var idx = fieldStore.findBy(function (record, id) {
                        return (Math.abs(record.data.tabPos - val) < 0.001);
                    },
                    this);
                    if (idx < 0) {
                        var rec = fieldStore.add({
                            tabPos: val,
                            tabStr: val + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()],
                            tabAlign: align
                        });
                        fieldStore.sort();
                        this.tabList.getSelectionModel().select(rec);
                    } else {
                        var rec = fieldStore.getAt(idx);
                        rec.set("tabAlign", align);
                    }
                },
                this)
            }
        });
        this.btnRemoveTab = Ext.create("Ext.Button", {
            width: 90,
            text: this.textRemove,
            enableToggle: false,
            listeners: {
                click: Ext.bind(function (btn, eOpts) {
                    var rec = this.tabList.getSelectionModel().getSelection();
                    if (rec.length > 0) {
                        var idx = rec[0].index;
                        fieldStore.remove(rec);
                        if (idx > fieldStore.count() - 1) {
                            idx = fieldStore.count() - 1;
                        }
                        if (idx > -1) {
                            this.tabList.getSelectionModel().select(idx);
                        }
                    }
                },
                this)
            }
        });
        this.btnRemoveAll = Ext.create("Ext.Button", {
            width: 90,
            text: this.textRemoveAll,
            enableToggle: false,
            listeners: {
                click: Ext.bind(function (btn, eOpts) {
                    fieldStore.removeAll();
                },
                this)
            }
        });
        this.radioLeft = Ext.create("Ext.form.field.Radio", {
            boxLabel: this.textTabLeft,
            name: "asc-radio-tab",
            checked: true
        });
        this.radioCenter = Ext.create("Ext.form.field.Radio", {
            boxLabel: this.textTabCenter,
            name: "asc-radio-tab",
            checked: false
        });
        this.radioRight = Ext.create("Ext.form.field.Radio", {
            boxLabel: this.textTabRight,
            name: "asc-radio-tab",
            checked: false
        });
        Ext.define("DE.model.TabDataModel", {
            extend: "Ext.data.Model",
            fields: [{
                name: "tabPos",
                name: "tabStr",
                name: "tabAlign"
            }]
        });
        var fieldStore = Ext.create("Ext.data.Store", {
            model: "DE.model.TabDataModel",
            data: [],
            sorters: ["tabPos"],
            listeners: {
                datachanged: Ext.bind(function (btn, eOpts) {
                    if (!this._noApply) {
                        this._tabListChanged = true;
                    }
                },
                this),
                update: Ext.bind(function (btn, eOpts) {
                    if (!this._noApply) {
                        this._tabListChanged = true;
                    }
                },
                this),
                clear: Ext.bind(function (btn, eOpts) {
                    if (!this._noApply) {
                        this._tabListChanged = true;
                    }
                },
                this)
            }
        });
        this.tabList = Ext.create("Ext.grid.Panel", {
            activeItem: 0,
            id: "paragraphadv-tab-list",
            store: fieldStore,
            mode: "local",
            scroll: false,
            columns: [{
                flex: 1,
                dataIndex: "tabStr"
            }],
            height: 80,
            width: 180,
            hideHeaders: true,
            viewConfig: {
                stripeRows: false
            },
            plugins: [{
                pluginId: "scrollpane",
                ptype: "gridscrollpane"
            }],
            listeners: {
                select: function (o, record, index, eOpts) {
                    this.numTab.setValue(record.data.tabPos);
                    (record.data.tabAlign == 1) ? this.radioLeft.setValue(true) : ((record.data.tabAlign == 3) ? this.radioCenter.setValue(true) : this.radioRight.setValue(true));
                },
                scope: this
            }
        });
        this._spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            id: "paraadv-number-margin-top",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (!this._noApply) {
                        if (this.Margins === undefined) {
                            this.Margins = {};
                        }
                        this.Margins.Top = Common.MetricSettings.fnRecalcToMM(field.getNumberValue());
                    }
                },
                this)
            }
        });
        this._spnMarginBottom = Ext.create("Common.component.MetricSpinner", {
            id: "paraadv-number-margin-bottom",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (!this._noApply) {
                        if (this.Margins === undefined) {
                            this.Margins = {};
                        }
                        this.Margins.Bottom = Common.MetricSettings.fnRecalcToMM(field.getNumberValue());
                    }
                },
                this)
            }
        });
        this._spnMarginLeft = Ext.create("Common.component.MetricSpinner", {
            id: "paraadv-number-margin-left",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (!this._noApply) {
                        if (this.Margins === undefined) {
                            this.Margins = {};
                        }
                        this.Margins.Left = Common.MetricSettings.fnRecalcToMM(field.getNumberValue());
                    }
                },
                this)
            }
        });
        this._spnMarginRight = Ext.create("Common.component.MetricSpinner", {
            id: "paraadv-number-margin-right",
            readOnly: false,
            maxValue: 9.34,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (!this._noApply) {
                        if (this.Margins === undefined) {
                            this.Margins = {};
                        }
                        this.Margins.Right = Common.MetricSettings.fnRecalcToMM(field.getNumberValue());
                    }
                },
                this)
            }
        });
        this.btnIndents = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.strParagraphIndents,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            pressed: true,
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-indents");
                    }
                },
                scope: this
            }
        });
        this.btnFont = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.strParagraphFont,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-font");
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
            text: this.strBorders,
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
        this.btnTabs = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            textAlign: "right",
            text: this.strTabs,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-tabs");
                        this.tabList.getPlugin("scrollpane").updateScrollPane();
                    }
                },
                scope: this
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
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-margins");
                    }
                },
                scope: this
            }
        });
        this._BordersContainer = {
            xtype: "container",
            itemId: "card-borders",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            height: 285,
            items: [{
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                height: 28,
                padding: "2px 10px 0 10px",
                style: "vertical-align: middle;",
                items: [{
                    xtype: "label",
                    text: this.textBorderWidth
                },
                {
                    xtype: "tbspacer",
                    width: 4
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
                    width: 4
                },
                this._btnBorderColor]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
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
                height: 180,
                width: 200,
                padding: "0 10",
                style: "vertical-align: top;",
                items: [this.bordersImagePanel = Ext.create("Ext.container.Container", {
                    layout: "card",
                    activeItem: 0,
                    width: 200,
                    height: 180,
                    style: "padding-bottom:10px;",
                    items: [this._BordersImage]
                }), {
                    xtype: "tbspacer",
                    width: 25
                },
                {
                    xtype: "container",
                    layout: "hbox",
                    height: 180,
                    width: 100,
                    items: [this._PresetsContainer = Ext.create("Ext.container.Container", {
                        height: 180,
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
                        this._btnsBorderPosition[5], this._btnsBorderPosition[6], this._btnsBorderPosition[7], this._btnsBorderPosition[0], this._btnsBorderPosition[3], this._btnsBorderPosition[1], this._btnsBorderPosition[4], this._btnsBorderPosition[2]]
                    })]
                }]
            },
            {
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "container",
                height: 23,
                padding: "0 10",
                layout: "hbox",
                items: [this._BackContainer = Ext.create("Ext.container.Container", {
                    height: 23,
                    width: 150,
                    layout: "hbox",
                    margin: "0 4px 0 0",
                    items: [{
                        xtype: "label",
                        text: this.textBackColor,
                        margin: "2px 4px 0 0"
                    },
                    this._btnBackColor]
                })]
            }]
        };
        this._IndentsContainer = {
            xtype: "container",
            itemId: "card-indents",
            width: 340,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 5
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
                    items: [{
                        xtype: "label",
                        text: this.strIndentsFirstLine,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numFirstLine]
                },
                {
                    xtype: "tbspacer",
                    width: 23,
                    height: 3
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.strIndentsLeftText,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numIndentsLeft]
                },
                {
                    xtype: "tbspacer",
                    width: 23,
                    height: 3
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.strIndentsRightText,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numIndentsRight]
                }]
            },
            this._spacer.cloneConfig({
                style: "margin: 16px 0 11px 0;",
                height: 6
            }), {
                xtype: "container",
                height: 25,
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "vertical-align: middle;"
                    }
                },
                items: [this.chBreakBefore, {
                    xtype: "tbspacer",
                    width: 10,
                    height: 3
                },
                this.chKeepLines, this.chOrphan, {
                    xtype: "tbspacer",
                    width: 10,
                    height: 3
                },
                this.chKeepNext]
            }]
        };
        this._FontContainer = {
            xtype: "container",
            itemId: "card-font",
            width: 340,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textEffects
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 85,
                width: "100%",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "vertical-align: middle;"
                    }
                },
                items: [this.chStrike, {
                    xtype: "tbspacer",
                    width: 20,
                    height: 2
                },
                this.chSubscript, this.chDoubleStrike, {
                    xtype: "tbspacer",
                    width: 20,
                    height: 2
                },
                this.chSmallCaps, this.chSuperscript, {
                    xtype: "tbspacer",
                    width: 20,
                    height: 2
                },
                this.chAllCaps]
            },
            {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textCharacterSpacing
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 46,
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "label",
                    text: this.textSpacing,
                    width: 85
                },
                {
                    xtype: "tbspacer",
                    width: 60,
                    height: 2
                },
                {
                    xtype: "label",
                    text: this.textPosition,
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
                {
                    xtype: "tbspacer",
                    height: 2
                },
                this.numSpacing, {
                    xtype: "tbspacer",
                    width: 60,
                    height: 2
                },
                this.numPosition]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                height: 85,
                padding: "0 10",
                items: [this.fontImage]
            }]
        };
        this._TabsContainer = {
            xtype: "container",
            itemId: "card-tabs",
            width: 340,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                padding: "0 0 0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 7px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    style: "float:left;"
                },
                items: [{
                    height: 50,
                    colspan: 2,
                    items: [{
                        xtype: "label",
                        text: this.textTabPosition,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numTab]
                },
                {
                    height: 50,
                    items: [{
                        xtype: "label",
                        text: this.textDefault,
                        width: 107
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numDefaultTab]
                },
                {
                    height: 95,
                    colspan: 3,
                    items: [this.tabList]
                },
                {
                    height: 100,
                    colspan: 3,
                    items: [{
                        xtype: "label",
                        text: this.textAlign,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.radioLeft, this.radioCenter, this.radioRight]
                },
                this.btnAddTab, this.btnRemoveTab, this.btnRemoveAll]
            }]
        };
        this._MarginsContainer = {
            xtype: "container",
            itemId: "card-margins",
            width: 340,
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
                    items: [this.btnIndents]
                },
                {
                    height: 30,
                    items: [this.btnBorders]
                },
                {
                    height: 30,
                    items: [this.btnFont]
                },
                {
                    height: 30,
                    items: [this.btnTabs]
                },
                {
                    height: 30,
                    items: [this.btnMargins]
                }]
            },
            {
                xtype: "box",
                cls: "advanced-settings-separator",
                height: "100%",
                width: 8
            },
            this.mainCard = Ext.create("Ext.container.Container", {
                height: 300,
                flex: 1,
                padding: "12px 18px 0 10px",
                layout: "card",
                items: [this._IndentsContainer, this._BordersContainer, this._FontContainer, this._TabsContainer, this._MarginsContainer]
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
        this._setDefaults(this._originalProps);
        if (this.borderProps !== undefined) {
            this._btnBorderColor.setColor(this.borderProps.borderColor);
            var colorstr = Ext.String.format("#{0}", (typeof(this.borderProps.borderColor) == "object") ? this.borderProps.borderColor.color : this.borderProps.borderColor);
            this._BordersImage.setVirtualBorderColor(colorstr);
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
        for (var i = 0; i < this._BordersImage.rows; i++) {
            for (var j = 0; j < this._BordersImage.columns; j++) {
                this._BordersImage.getCell(j, i).addListener("borderclick", function (ct, border, size, color) {
                    if (this.ChangedBorders === undefined) {
                        this.ChangedBorders = new CParagraphBorders();
                    }
                    this._UpdateCellBordersStyle(ct, border, size, color, this.Borders);
                },
                this);
            }
        }
        this._BordersImage.addListener("borderclick", function (ct, border, size, color) {
            if (this.ChangedBorders === undefined) {
                this.ChangedBorders = new CParagraphBorders();
            }
            this._UpdateTableBordersStyle(ct, border, size, color, this.Borders);
        },
        this);
    },
    setSettings: function (props) {
        this._originalProps = new CParagraphProp(props.paragraphProps);
        this.borderProps = props.borderProps;
        this.colorProps = props.colorProps;
        this._changedProps = null;
        this.api = props.api;
    },
    _setDefaults: function (props) {
        if (props) {
            this._originalProps = new CParagraphProp(props);
            this.numFirstLine.setValue((props.get_Ind() !== null && props.get_Ind().get_FirstLine() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Ind().get_FirstLine()) : "");
            this.numIndentsLeft.setValue((props.get_Ind() !== null && props.get_Ind().get_Left() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Ind().get_Left()) : "");
            this.numIndentsRight.setValue((props.get_Ind() !== null && props.get_Ind().get_Right() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Ind().get_Right()) : "");
            this.chKeepLines.setValue((props.get_KeepLines() !== null && props.get_KeepLines() !== undefined) ? props.get_KeepLines() : "indeterminate");
            this.chBreakBefore.setValue((props.get_PageBreakBefore() !== null && props.get_PageBreakBefore() !== undefined) ? props.get_PageBreakBefore() : "indeterminate");
            this.chKeepNext.setValue((props.get_KeepNext() !== null && props.get_KeepNext() !== undefined) ? props.get_KeepNext() : "indeterminate");
            this.chOrphan.setValue((props.get_WidowControl() !== null && props.get_WidowControl() !== undefined) ? props.get_WidowControl() : "indeterminate");
            this.Borders = new CParagraphBorders(props.get_Borders());
            if (this.Borders) {
                var brd = this.Borders.get_Left();
                var val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.MetricSettings.fnRecalcFromMM(brd.get_Space()) : "";
                this._spnMarginLeft.setValue(val);
                brd = this.Borders.get_Top();
                val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.MetricSettings.fnRecalcFromMM(brd.get_Space()) : "";
                this._spnMarginTop.setValue(val);
                brd = this.Borders.get_Right();
                val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.MetricSettings.fnRecalcFromMM(brd.get_Space()) : "";
                this._spnMarginRight.setValue(val);
                brd = this.Borders.get_Bottom();
                val = (null !== brd && undefined !== brd && null !== brd.get_Space() && undefined !== brd.get_Space()) ? Common.MetricSettings.fnRecalcFromMM(brd.get_Space()) : "";
                this._spnMarginBottom.setValue(val);
            }
            var shd = props.get_Shade();
            if (shd !== null && shd !== undefined && shd.get_Value() === shd_Clear) {
                var color = shd.get_Color();
                if (color) {
                    if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                        this.paragraphShade = {
                            color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                            effectValue: color.get_value()
                        };
                    } else {
                        this.paragraphShade = this.getHexColor(color.get_r(), color.get_g(), color.get_b());
                    }
                } else {
                    this.paragraphShade = "transparent";
                }
            } else {
                this.paragraphShade = "transparent";
            }
            this._btnBackColor.setColor(this.paragraphShade);
            if (typeof(this.paragraphShade) == "object") {
                for (var i = 0; i < 10; i++) {
                    if (this.ThemeValues[i] == this.paragraphShade.effectValue) {
                        this.colorsBack.select(this.paragraphShade, true);
                        break;
                    }
                }
            } else {
                this.colorsBack.select(this.paragraphShade, true);
            }
            this._UpdateBorders();
            this._noApply = true;
            this.chStrike.setValue((props.get_Strikeout() !== null && props.get_Strikeout() !== undefined) ? props.get_Strikeout() : "indeterminate");
            this.chDoubleStrike.setValue((props.get_DStrikeout() !== null && props.get_DStrikeout() !== undefined) ? props.get_DStrikeout() : "indeterminate");
            this.chSubscript.setValue((props.get_Subscript() !== null && props.get_Subscript() !== undefined) ? props.get_Subscript() : "indeterminate");
            this.chSuperscript.setValue((props.get_Superscript() !== null && props.get_Superscript() !== undefined) ? props.get_Superscript() : "indeterminate");
            this.chSmallCaps.setValue((props.get_SmallCaps() !== null && props.get_SmallCaps() !== undefined) ? props.get_SmallCaps() : "indeterminate");
            this.chAllCaps.setValue((props.get_AllCaps() !== null && props.get_AllCaps() !== undefined) ? props.get_AllCaps() : "indeterminate");
            this.numSpacing.setValue((props.get_TextSpacing() !== null && props.get_TextSpacing() !== undefined) ? Common.MetricSettings.fnRecalcFromMM(props.get_TextSpacing()) : "");
            this.numPosition.setValue((props.get_Position() !== null && props.get_Position() !== undefined) ? Common.MetricSettings.fnRecalcFromMM(props.get_Position()) : "");
            this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", this._originalProps);
            this.numDefaultTab.setValue((props.get_DefaultTab() !== null && props.get_DefaultTab() !== undefined) ? Common.MetricSettings.fnRecalcFromMM(parseFloat(props.get_DefaultTab().toFixed(1))) : "");
            var tabs = props.get_Tabs();
            if (tabs) {
                var arr = [];
                var count = tabs.get_Count();
                for (var i = 0; i < count; i++) {
                    var tab = tabs.get_Tab(i);
                    var rec = {
                        tabPos: Common.MetricSettings.fnRecalcFromMM(parseFloat(tab.get_Pos().toFixed(1))),
                        tabAlign: tab.get_Value()
                    };
                    rec.tabStr = parseFloat(Ext.Number.toFixed(rec.tabPos, 3)) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()];
                    arr.push(rec);
                }
                this.tabList.getStore().loadData(arr);
                this.tabList.getStore().sort();
                if (this.tabList.getStore().count() > 0) {
                    this.tabList.getSelectionModel().select(0);
                }
            }
            this._noApply = false;
            this._changedProps = new CParagraphProp();
            this.ChangedBorders = undefined;
        }
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
            this.tabList.getStore().each(function (item, index) {
                var tab = new CParagraphTab(Common.MetricSettings.fnRecalcToMM(item.data.tabPos), item.data.tabAlign);
                this._changedProps.get_Tabs().add_Tab(tab);
            },
            this);
        }
        return {
            paragraphProps: this._changedProps,
            borderProps: {
                borderSize: this.BorderSize,
                borderColor: this._btnBorderColor.color
            }
        };
    },
    _UpdateBorders: function () {
        var oldSize = this.BorderSize;
        var oldColor = this._btnBorderColor.color;
        this._UpdateBorder(this.Borders.get_Left(), "l");
        this._UpdateBorder(this.Borders.get_Top(), "t");
        this._UpdateBorder(this.Borders.get_Right(), "r");
        this._UpdateBorder(this.Borders.get_Bottom(), "b");
        if (this.Borders.get_Between() !== null) {
            for (var i = 0; i < this._BordersImage.columns; i++) {
                this._UpdateCellBorder(this.Borders.get_Between(), "b", this._BordersImage.getCell(i, 0));
                this._UpdateCellBorder(this.Borders.get_Between(), "t", this._BordersImage.getCell(i, 1));
            }
        }
        this._BordersImage.setVirtualBorderSize(oldSize.pxValue);
        var colorstr = Ext.String.format("#{0}", (typeof(oldColor) == "object") ? oldColor.color : oldColor);
        this._BordersImage.setVirtualBorderColor(colorstr);
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
                this._BordersImage.setBordersSize(borderName, this._BorderPt2Px(BorderParam.get_Size() * 72 / 25.4));
                this._BordersImage.setBordersColor(borderName, "rgb(" + BorderParam.get_Color().get_r() + "," + BorderParam.get_Color().get_g() + "," + BorderParam.get_Color().get_b() + ")");
            } else {
                this._BordersImage.setBordersSize(borderName, 0);
            }
        } else {
            this._BordersImage.setBordersSize(borderName, 0);
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
    _ApplyBorderPreset: function (border) {
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
            var color = this.getRgbColor(this._btnBorderColor.color);
            border.put_Color(color);
        } else {
            border.put_Color(new CColor());
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
        if (standartcolors && effectcolors) {
            this.colorsBorder.updateColors(effectcolors, standartcolors);
            this.colorsBack.updateColors(effectcolors, standartcolors);
        }
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                if (spinner.id == "paragraphadv-spin-spacing" || spinner.id == "paragraphadv-spin-position") {
                    spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.01 : 1);
                } else {
                    spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        }
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
    tipOuter: "Set Outer Border Only"
});