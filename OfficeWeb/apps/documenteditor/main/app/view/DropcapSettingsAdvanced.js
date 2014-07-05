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
 var c_oAscFrameWrap = {
    None: -1,
    Inline: false,
    Flow: true
};
Ext.define("DE.view.DropcapSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.dedropcapsettingsadvanced",
    requires: ["Ext.Array", "Ext.form.field.ComboBox", "Ext.window.Window", "Common.component.ThemeColorPalette", "Common.component.MetricSpinner", "DE.component.TableStyler", "Common.component.IndeterminateCheckBox", "DE.component.ComboDropFonts", "Common.plugin.ComboBoxScrollPane"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 490,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        show: function () {
            if (!this.isFrame && this.btnNone.pressed) {
                this._DisableElem(c_oAscDropCap.None);
            } else {
                if (this.isFrame && this.btnFrameNone.pressed) {
                    this._DisableElem(c_oAscFrameWrap.None);
                }
            }
        }
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
        this._noApply = true;
        this.Margins = undefined;
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        var _arrBorderPresets = [[c_tableBorder.BORDER_OUTER, "lrtb", "asc-advanced-settings-position-btn btn-adv-paragraph-outer", "paragraphadv-button-border-outer"], [c_tableBorder.BORDER_ALL, "lrtbm", "asc-advanced-settings-position-btn btn-adv-paragraph-all", "paragraphadv-button-border-all"], [c_tableBorder.BORDER_NONE, "", "asc-advanced-settings-position-btn btn-adv-paragraph-none", "paragraphadv-button-border-none"], [c_tableBorder.BORDER_VERTICAL_LEFT, "l", "asc-advanced-settings-position-btn btn-adv-paragraph-left", "paragraphadv-button-border-left"], [c_tableBorder.BORDER_VERTICAL_RIGHT, "r", "asc-advanced-settings-position-btn btn-adv-paragraph-right", "paragraphadv-button-border-right"], [c_tableBorder.BORDER_HORIZONTAL_TOP, "t", "asc-advanced-settings-position-btn btn-adv-paragraph-top", "paragraphadv-button-border-top"], [c_tableBorder.BORDER_HORIZONTAL_CENTER, "m", "asc-advanced-settings-position-btn btn-adv-paragraph-inner-hor", "paragraphadv-button-border-inner-hor"], [c_tableBorder.BORDER_HORIZONTAL_BOTTOM, "b", "asc-advanced-settings-position-btn btn-adv-paragraph-bottom", "paragraphadv-button-border-bottom"]];
        this._btnsBorderPosition = [];
        Ext.Array.forEach(_arrBorderPresets, function (item, index) {
            var _btn = Ext.create("Ext.Button", {
                id: item[3],
                cls: item[2],
                posId: item[0],
                strId: item[1],
                text: "",
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
            id: "id-dedropgraphstyler",
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
            id: "dropadv-button-border-color",
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
            id: "dropadv-button-back-color",
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
        this._spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            id: "dropadv-number-margin-top",
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
            id: "dropadv-number-margin-bottom",
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
            id: "dropadv-number-margin-left",
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
            id: "dropadv-number-margin-right",
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
        this.btnNone = Ext.create("Ext.Button", {
            id: "drop-advanced-button-none",
            cls: "asc-right-panel-wrapbtn btn-drop-none",
            posId: c_oAscDropCap.None,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textNone,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "dropAdvGroup",
            pressed: true,
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._DisableElem(btn.posId);
                    this._changedProps.put_DropCap(btn.posId);
                }
            },
            this)
        });
        this.btnInText = Ext.create("Ext.Button", {
            id: "drop-advanced-button-intext",
            cls: "asc-right-panel-wrapbtn btn-drop-text",
            posId: c_oAscDropCap.Drop,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textInText,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "dropAdvGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._DisableElem(btn.posId);
                    this._changedProps.put_DropCap(btn.posId);
                }
            },
            this)
        });
        this.btnInMargin = Ext.create("Ext.Button", {
            id: "drop-advanced-button-inmargin",
            cls: "asc-right-panel-wrapbtn btn-drop-margin",
            posId: c_oAscDropCap.Margin,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textInMargin,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "dropAdvGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._DisableElem(btn.posId);
                    this._changedProps.put_DropCap(btn.posId);
                }
            },
            this)
        });
        this.spnRowHeight = Ext.widget("numberfield", {
            id: "dropadv-spin-row-height",
            width: 140,
            minValue: 1,
            maxValue: 10,
            value: 3,
            allowDecimals: false,
            step: 1,
            listeners: {
                afterRender: function () {
                    if (this.inputEl) {
                        Ext.DomHelper.applyStyles(this.inputEl, "text-align:right;");
                    }
                },
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && field.isValid()) {
                        this._changedProps.put_Lines(field.getValue());
                    }
                },
                this)
            }
        });
        this.numDistance = Ext.create("Common.component.MetricSpinner", {
            id: "dropadv-spin-dist",
            readOnly: false,
            step: 0.1,
            width: 140,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_HSpace(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.cmbFonts = Ext.create("DE.component.ComboDropFonts", {
            id: "dropadv-combo-fonts",
            margin: "0",
            width: 290,
            colspan: 2,
            cls: "asc-toolbar-combo",
            editable: true,
            selectOnFocus: true,
            showlastused: false,
            enableKeyEvents: true,
            tooltip: this.tipFontName,
            listId: "dropcap-combo-fonts-list",
            store: this.fontStore,
            plugins: [{
                ptype: "comboboxscrollpane",
                pluginId: "scrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }],
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_FontFamily(records[0].data.name);
                    }
                },
                this)
            }
        });
        this.cmbFonts.fillFonts();
        this.btnFrameNone = Ext.create("Ext.Button", {
            id: "drop-advanced-frame-none",
            cls: "asc-right-panel-btn btn-frame-none",
            posId: c_oAscFrameWrap.None,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textNone,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "frameAdvGroup",
            pressed: true,
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._DisableElem(btn.posId);
                    this._changedProps.put_Wrap(btn.posId);
                }
            },
            this)
        });
        this.btnFrameInline = Ext.create("Ext.Button", {
            id: "drop-advanced-frame-inline",
            cls: "asc-right-panel-btn btn-frame-inline",
            posId: c_oAscFrameWrap.Inline,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textInline,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "frameAdvGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._DisableElem(btn.posId);
                    this._changedProps.put_Wrap(btn.posId);
                }
            },
            this)
        });
        this.btnFrameFlow = Ext.create("Ext.Button", {
            id: "drop-advanced-frame-flow",
            cls: "asc-right-panel-btn btn-frame-flow",
            posId: c_oAscFrameWrap.Flow,
            margin: "0 10 0 0",
            text: "",
            tooltip: this.textFlow,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "frameAdvGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this._changedProps && btn.pressed) {
                    this._DisableElem(btn.posId);
                    this._changedProps.put_Wrap(btn.posId);
                }
            },
            this)
        });
        this._arrWidth = [this.textAuto, this.textExact];
        this.cmbWidth = Ext.create("Ext.form.field.ComboBox", {
            id: "dropadv-combo-width",
            width: 120,
            editable: false,
            store: this._arrWidth,
            mode: "local",
            triggerAction: "all",
            style: "margin-bottom: 0;",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._spnWidth.suspendEvents(false);
                        this._spnWidth.setValue((records[0].index == 0) ? "" : 1);
                        this._spnWidth.resumeEvents();
                        this._changedProps.put_W((records[0].index == 0) ? undefined : Common.MetricSettings.fnRecalcToMM(this._spnWidth.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.cmbWidth.setValue(this._arrWidth[0]);
        this._spnWidth = Ext.create("Common.component.MetricSpinner", {
            id: "dropadv-spin-width",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0.02,
            step: 0.1,
            defaultUnit: "cm",
            value: "",
            width: 85,
            style: "margin-bottom: 0;",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this.cmbWidth.suspendEvents(false);
                        this.cmbWidth.setValue(this._arrWidth[1]);
                        this.cmbWidth.resumeEvents();
                        this._changedProps.put_W(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._arrHeight = [this.textAuto, this.textExact, this.textAtLeast];
        this.cmbHeight = Ext.create("Ext.form.field.ComboBox", {
            id: "dropadv-combo-height",
            width: 120,
            editable: false,
            store: this._arrHeight,
            mode: "local",
            triggerAction: "all",
            style: "margin-bottom: 0;",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._spnHeight.suspendEvents(false);
                        this._spnHeight.setValue((records[0].index == 0) ? "" : 1);
                        this._spnHeight.resumeEvents();
                        this._changedProps.put_HRule((records[0].index == 0) ? linerule_Auto : ((records[0].index == 1) ? linerule_Exact : linerule_AtLeast));
                        if (records[0].index > 0) {
                            this._changedProps.put_H(Common.MetricSettings.fnRecalcToMM(this._spnHeight.getNumberValue()));
                        }
                    }
                },
                this)
            }
        });
        this.cmbHeight.setValue(this._arrHeight[0]);
        this._spnHeight = Ext.create("Common.component.MetricSpinner", {
            id: "dropadv-spin-height",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0.02,
            step: 0.1,
            defaultUnit: "cm",
            value: "",
            width: 85,
            style: "margin-bottom: 0;",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        var type = linerule_Auto;
                        if (this.cmbHeight.getValue() == this._arrHeight[1]) {
                            type = linerule_Exact;
                        } else {
                            if (this.cmbHeight.getValue() == this._arrHeight[2]) {
                                type = linerule_AtLeast;
                            }
                        }
                        if (type == linerule_Auto) {
                            this.cmbHeight.suspendEvents(false);
                            this.cmbHeight.setValue(this._arrHeight[2]);
                            type = linerule_AtLeast;
                            this.cmbHeight.resumeEvents();
                        }
                        this._changedProps.put_HRule(type);
                        this._changedProps.put_H(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnX = Ext.create("Common.component.MetricSpinner", {
            id: "dropadv-spin-x",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            style: "margin-bottom: 0;",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_HSpace(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnY = Ext.create("Common.component.MetricSpinner", {
            id: "dropadv-spin-y",
            readOnly: false,
            maxValue: 55.87,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85,
            style: "margin-bottom: 0;",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_VSpace(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._arrHAlign = [[c_oAscXAlign.Left, this.textLeft], [c_oAscXAlign.Center, this.textCenter], [c_oAscXAlign.Right, this.textRight]];
        this.cmbHAlign = Ext.create("Ext.form.field.ComboBox", {
            id: "dropadv-combo-halign",
            width: 120,
            editable: true,
            disableKeyFilter: true,
            store: this._arrHAlign,
            queryMode: "local",
            triggerAction: "all",
            style: "margin-bottom: 0;",
            minChars: 20,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_XAlign(undefined);
                        this._changedProps.put_X(Common.MetricSettings.fnRecalcToMM(parseFloat(field.getValue())));
                    }
                },
                this),
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_XAlign(this._arrHAlign[records[0].index][0]);
                    }
                },
                this)
            }
        });
        this.cmbHAlign.setValue(this._arrHAlign[0][0]);
        this._arrHRelative = [[c_oAscHAnchor.Margin, this.textMargin], [c_oAscHAnchor.Page, this.textPage], [c_oAscHAnchor.Text, this.textColumn]];
        this.cmbHRelative = Ext.create("Ext.form.field.ComboBox", {
            id: "dropadv-combo-hrelative",
            width: 85,
            editable: false,
            store: this._arrHRelative,
            queryMode: "local",
            triggerAction: "all",
            style: "margin-bottom: 0;",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_HAnchor(this._arrHRelative[records[0].index][0]);
                    }
                },
                this)
            }
        });
        this.cmbHRelative.setValue(this._arrHRelative[1][0]);
        this._arrVAlign = [[c_oAscYAlign.Top, this.textTop], [c_oAscYAlign.Center, this.textCenter], [c_oAscYAlign.Bottom, this.textBottom]];
        this.cmbVAlign = Ext.create("Ext.form.field.ComboBox", {
            id: "dropadv-combo-valign",
            width: 120,
            editable: true,
            disableKeyFilter: true,
            store: this._arrVAlign,
            queryMode: "local",
            triggerAction: "all",
            style: "margin-bottom: 0;",
            minChars: 20,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_YAlign(undefined);
                        this._changedProps.put_Y(Common.MetricSettings.fnRecalcToMM(parseFloat(field.getValue())));
                    }
                },
                this),
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_YAlign(this._arrVAlign[records[0].index][0]);
                    }
                },
                this)
            }
        });
        this.cmbVAlign.setValue(this._arrVAlign[0][0]);
        this._arrVRelative = [[c_oAscVAnchor.Margin, this.textMargin], [c_oAscVAnchor.Page, this.textPage], [c_oAscVAnchor.Text, this.textParagraph]];
        this.cmbVRelative = Ext.create("Ext.form.field.ComboBox", {
            id: "dropadv-combo-vrelative",
            width: 85,
            editable: false,
            store: this._arrVRelative,
            queryMode: "local",
            triggerAction: "all",
            style: "margin-bottom: 0;",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_VAnchor(this._arrVRelative[records[0].index][0]);
                        this.chMove.suspendEvents(false);
                        this.chMove.setValue(this._arrVRelative[records[0].index][0] == c_oAscVAnchor.Text);
                        this.chMove.resumeEvents();
                    }
                },
                this)
            }
        });
        this.cmbVRelative.setValue(this._arrVRelative[2][0]);
        this.chMove = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "dropadv-checkbox-move",
            boxLabel: this.textMove,
            colspan: 3,
            checked: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        var rec = this.cmbVRelative.getStore().getAt((field.getValue() == "checked") ? 2 : 1);
                        this.cmbVRelative.select(rec);
                        this.cmbVRelative.fireEvent("select", this.cmbVRelative, [rec]);
                    }
                },
                this)
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
        this.btnFrame = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            textAlign: "right",
            text: this.textFrame,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            pressed: true,
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem((this.isFrame) ? "card-frame" : "card-drop");
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
                    width: 250,
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
        this._MarginsContainer = {
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
        this._DropcapContainer = {
            xtype: "container",
            itemId: "card-drop",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textPosition
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                padding: "0 10",
                items: [this.btnNone, this.btnInText, this.btnInMargin]
            },
            {
                xtype: "tbspacer",
                height: 20
            },
            {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textParameters
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 2,
                    tdAttrs: {
                        style: "padding-right: 10px;vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "label",
                    text: this.textFont,
                    width: 140,
                    colspan: 2
                },
                this.cmbFonts, {
                    xtype: "tbspacer",
                    height: 10,
                    colspan: 2
                },
                {
                    xtype: "label",
                    text: this.textRowHeight,
                    width: 140
                },
                {
                    xtype: "label",
                    text: this.textDistance,
                    width: 140
                },
                {
                    xtype: "tbspacer",
                    height: 2
                },
                {
                    xtype: "tbspacer",
                    height: 2
                },
                this.spnRowHeight, this.numDistance]
            }]
        };
        this._FrameContainer = {
            xtype: "container",
            itemId: "card-frame",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textPosition
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                padding: "0 10",
                items: [this.btnFrameNone, this.btnFrameInline, this.btnFrameFlow]
            },
            this._spacer.cloneConfig({
                style: "margin: 13px 0 8px 0;",
                height: 6
            }), {
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 10px;vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "tbspacer",
                    height: 1,
                    width: 70
                },
                {
                    xtype: "tbspacer",
                    height: 1,
                    colspan: 2
                },
                {
                    xtype: "label",
                    text: this.textWidth,
                    width: 70
                },
                this.cmbWidth, this._spnWidth, {
                    xtype: "tbspacer",
                    height: 8,
                    colspan: 3
                },
                {
                    xtype: "label",
                    text: this.textHeight,
                    width: 70
                },
                this.cmbHeight, this._spnHeight]
            },
            this._spacer.cloneConfig({
                style: "margin: 12px 0 6px 0;",
                height: 6
            }), {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textHorizontal
            },
            {
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 10px;vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "tbspacer",
                    colspan: 2
                },
                {
                    xtype: "label",
                    text: this.textRelative,
                    width: 70
                },
                {
                    xtype: "tbspacer",
                    height: 2,
                    width: 70
                },
                {
                    xtype: "tbspacer",
                    height: 2,
                    colspan: 2
                },
                {
                    xtype: "label",
                    text: this.textPosition,
                    width: 70
                },
                this.cmbHAlign, this.cmbHRelative, {
                    xtype: "tbspacer",
                    height: 8,
                    colspan: 3
                },
                {
                    xtype: "tbspacer",
                    width: 70
                },
                {
                    xtype: "label",
                    text: this.textDistance,
                    width: 120,
                    style: "float: right; text-align: right;"
                },
                this._spnX]
            },
            this._spacer.cloneConfig({
                style: "margin: 13px 0 6px 0;",
                height: 6
            }), {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textVertical
            },
            {
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 10px;vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "tbspacer",
                    colspan: 2
                },
                {
                    xtype: "label",
                    text: this.textRelative,
                    width: 70
                },
                {
                    xtype: "tbspacer",
                    height: 2,
                    width: 70
                },
                {
                    xtype: "tbspacer",
                    height: 2,
                    colspan: 2
                },
                {
                    xtype: "label",
                    text: this.textPosition,
                    width: 70
                },
                this.cmbVAlign, this.cmbVRelative, {
                    xtype: "tbspacer",
                    height: 8,
                    colspan: 3
                },
                {
                    xtype: "tbspacer",
                    width: 70
                },
                {
                    xtype: "label",
                    text: this.textDistance,
                    width: 120,
                    style: "float: right; text-align: right;"
                },
                this._spnY, this.chMove]
            }]
        };
        this.items = [this.mainBody = Ext.create("Ext.container.Container", {
            height: 400,
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
                    items: [this.btnFrame]
                },
                {
                    height: 30,
                    items: [this.btnBorders]
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
                items: [this._FrameContainer, this._DropcapContainer, this._BordersContainer, this._MarginsContainer]
            })]
        }), this._spacer.cloneConfig({
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
        this.setTitle((this.isFrame) ? this.textTitleFrame : this.textTitle);
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
        if (!this.isFrame) {
            this.btnFrame.setText(this.strDropcap);
            this.setHeight(390);
            this.mainBody.setHeight(300);
            this.mainCard.getLayout().setActiveItem("card-drop");
        }
    },
    setSettings: function (props) {
        this._originalProps = new CParagraphProp(props.paragraphProps);
        this.borderProps = props.borderProps;
        this.colorProps = props.colorProps;
        this.isFrame = props.isFrame;
        this._changedProps = null;
        this.api = props.api;
    },
    _setDefaults: function (props) {
        if (props) {
            this._noApply = true;
            this._originalProps = new CParagraphProp(props);
            var frame_props = props.get_FramePr();
            if (frame_props) {
                var value;
                if (this.isFrame) {
                    value = frame_props.get_W();
                    this.cmbWidth.setValue((value === undefined) ? this._arrWidth[0] : this._arrWidth[1]);
                    this._spnWidth.setValue((value !== undefined) ? Common.MetricSettings.fnRecalcFromMM(value) : "");
                    value = frame_props.get_HRule();
                    if (value !== undefined) {
                        this.cmbHeight.setValue((value === linerule_Exact) ? this._arrHeight[1] : this._arrHeight[2]);
                        this._spnHeight.setValue(Common.MetricSettings.fnRecalcFromMM(frame_props.get_H()));
                    } else {
                        this.cmbHeight.setValue(this._arrHeight[0]);
                        this._spnHeight.setValue("");
                    }
                    value = frame_props.get_HSpace();
                    this._spnX.setValue((value !== undefined) ? Common.MetricSettings.fnRecalcFromMM(value) : 0);
                    value = frame_props.get_VSpace();
                    this._spnY.setValue((value !== undefined) ? Common.MetricSettings.fnRecalcFromMM(value) : 0);
                    value = frame_props.get_HAnchor();
                    for (var i = 0; i < this._arrHRelative.length; i++) {
                        if (value == this._arrHRelative[i][0]) {
                            this.cmbHRelative.setValue(this._arrHRelative[i][1]);
                            break;
                        }
                    }
                    value = frame_props.get_XAlign();
                    if (value !== undefined) {
                        for (var i = 0; i < this._arrHAlign.length; i++) {
                            if (value == this._arrHAlign[i][0]) {
                                this.cmbHAlign.setValue(this._arrHAlign[i][1]);
                                break;
                            }
                        }
                    } else {
                        value = frame_props.get_X();
                        this.cmbHAlign.setValue(Common.MetricSettings.fnRecalcFromMM((value !== undefined) ? value : 0) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                    }
                    value = frame_props.get_VAnchor();
                    for (var i = 0; i < this._arrVRelative.length; i++) {
                        if (value == this._arrVRelative[i][0]) {
                            this.cmbVRelative.setValue(this._arrVRelative[i][1]);
                            break;
                        }
                    }
                    this.chMove.setValue(value == c_oAscVAnchor.Text);
                    value = frame_props.get_YAlign();
                    if (value !== undefined) {
                        for (var i = 0; i < this._arrVAlign.length; i++) {
                            if (value == this._arrVAlign[i][0]) {
                                this.cmbVAlign.setValue(this._arrVAlign[i][1]);
                                break;
                            }
                        }
                    } else {
                        value = frame_props.get_Y();
                        this.cmbVAlign.setValue(Common.MetricSettings.fnRecalcFromMM((value !== undefined) ? value : 0) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                    }
                    value = frame_props.get_Wrap();
                    if (value === false) {
                        this.btnFrameInline.toggle(true, false);
                    } else {
                        this.btnFrameFlow.toggle(true, false);
                    }
                } else {
                    this.spnRowHeight.setValue((frame_props.get_Lines() !== null) ? frame_props.get_Lines() : "");
                    this.numDistance.setValue((frame_props.get_HSpace() !== null) ? Common.MetricSettings.fnRecalcFromMM(frame_props.get_HSpace()) : "");
                    value = frame_props.get_DropCap();
                    if (value == c_oAscDropCap.Drop) {
                        this.btnInText.toggle(true, false);
                    } else {
                        if (value == c_oAscDropCap.Margin) {
                            this.btnInMargin.toggle(true, false);
                        } else {
                            this.btnNone.toggle(true, false);
                        }
                    }
                    value = frame_props.get_FontFamily();
                    if (value) {
                        var rec = this.cmbFonts.store.findRecord("name", value.get_Name(), 0, false, false, true);
                        this.cmbFonts.clearValue();
                        if (rec) {
                            this.cmbFonts.select(rec);
                        } else {
                            this.cmbFonts.setRawValue(value.get_Name());
                        }
                    }
                }
                this.Borders = new CParagraphBorders(frame_props.get_Borders());
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
                var shd = frame_props.get_Shade();
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
            }
            this._noApply = false;
            this._changedProps = new CParagraphFrame();
            if (this.isFrame && frame_props && frame_props.get_W() !== undefined) {
                this._changedProps.put_W(frame_props.get_W());
            }
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
        this._changedProps.put_FromDropCapMenu(!this.isFrame);
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
                spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.1 : 1);
            }
        }
    },
    _DisableElem: function (btnId) {
        var disabled = (btnId === c_oAscDropCap.None || btnId === c_oAscFrameWrap.None);
        this.btnBorders.setDisabled(disabled);
        this.btnMargins.setDisabled(disabled);
        if (this.isFrame) {
            disabled = (btnId == c_oAscFrameWrap.None);
            this.cmbHAlign.setDisabled(disabled);
            this.cmbHRelative.setDisabled(disabled);
            this._spnX.setDisabled(disabled);
            this.cmbVAlign.setDisabled(disabled);
            this.cmbVRelative.setDisabled(disabled);
            this._spnY.setDisabled(disabled);
            this.chMove.setDisabled(disabled);
            this.cmbWidth.setDisabled(disabled);
            this.cmbHeight.setDisabled(disabled);
            this._spnWidth.setDisabled(disabled);
            this._spnHeight.setDisabled(disabled);
        } else {
            disabled = (btnId == c_oAscDropCap.None);
            this.spnRowHeight.setDisabled(disabled);
            this.numDistance.setDisabled(disabled);
            this.cmbFonts.setDisabled(disabled);
        }
    },
    textTitle: "Drop Cap - Advanced Settings",
    strBorders: "Borders & Fill",
    textBorderWidth: "Border Size",
    textBorderColor: "Border Color",
    textBackColor: "Background Color",
    textBorderDesc: "Click on diagramm or use buttons to select borders",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtNoBorders: "No borders",
    textNewColor: "Add New Custom Color",
    textPosition: "Position",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    textAlign: "Alignment",
    textTop: "Top",
    textLeft: "Left",
    textBottom: "Bottom",
    textRight: "Right",
    textCenter: "Center",
    strMargins: "Margins",
    strDropcap: "Drop Cap",
    textNone: "None",
    textInText: "In text",
    textInMargin: "In margin",
    textParameters: "Parameters",
    textRowHeight: "Height in rows",
    textDistance: "Distance from text",
    textFont: "Font",
    textInline: "Inline frame",
    textFlow: "Flow frame",
    textFrame: "Frame",
    textWidth: "Width",
    textHeight: "Height",
    textAuto: "Auto",
    textExact: "Exactly",
    textAtLeast: "At least",
    textMove: "Move with text",
    textHorizontal: "Horizontal",
    textVertical: "Vertical",
    textRelative: "Relative to",
    textColumn: "Column",
    textMargin: "Margin",
    textPage: "Page",
    textParagraph: "Paragraph",
    tipFontName: "Font Name",
    textTitleFrame: "Frame - Advanced Settings"
});