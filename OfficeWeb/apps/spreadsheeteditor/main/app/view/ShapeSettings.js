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
 Ext.define("SSE.model.ModelBorders", {
    extend: "Ext.data.Model",
    fields: [{
        type: "string",
        name: "borderstyle"
    },
    {
        type: "string",
        name: "text"
    },
    {
        type: "string",
        name: "url"
    },
    {
        type: "float",
        name: "value"
    },
    {
        type: "int",
        name: "imagewidth"
    },
    {
        type: "int",
        name: "imageheight"
    }]
});
Ext.define("SSE.view.ShapeSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.sseshapesettings",
    height: 316,
    requires: ["Ext.button.Button", "Ext.form.Label", "Ext.form.field.ComboBox", "Ext.container.Container", "Ext.toolbar.Spacer", "Ext.Array", "Ext.menu.Menu", "Ext.menu.Manager", "Ext.data.Model", "Ext.data.Store", "Ext.XTemplate", "Ext.Img", "Ext.slider.Single", "Common.component.DataViewPicker", "Common.component.MetricSpinner", "Common.view.ImageFromUrlDialog", "Common.component.ThemeColorPalette", "SSE.view.ShapeSettingsAdvanced", "Common.plugin.MenuExpand", "Common.component.ComboDataView", "Common.component.MultiSliderGradient", "Common.plugin.ComboBoxScrollPane"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.title = this.txtTitle;
        this._initSettings = true;
        var me = this;
        this._originalProps = null;
        this._noApply = true;
        this.imgprops = null;
        this._sendUndoPoint = true;
        this._state = {
            Transparency: null,
            FillType: c_oAscFill.FILL_TYPE_SOLID,
            ShapeColor: "ffffff",
            BlipFillType: c_oAscFillBlipType.STRETCH,
            StrokeType: c_oAscStrokeType.STROKE_COLOR,
            StrokeWidth: this._pt2mm(1),
            StrokeColor: "000000",
            FGColor: "000000",
            BGColor: "ffffff",
            GradColor: "000000",
            GradFillType: c_oAscFillGradType.GRAD_LINEAR,
            DisabledFillPanels: false
        };
        this.OriginalFillType = c_oAscFill.FILL_TYPE_SOLID;
        this.ShapeColor = {
            Value: 1,
            Color: "ffffff"
        };
        this.BlipFillType = c_oAscFillBlipType.STRETCH;
        this.GradFillType = c_oAscFillGradType.GRAD_LINEAR;
        this.GradColor = {
            values: [0, 100],
            colors: ["000000", "ffffff"],
            currentIdx: 0
        };
        this.GradLinearDirectionIdx = 3;
        this.GradRadialDirectionIdx = 0;
        this.PatternFillType = 0;
        this.FGColor = {
            Value: 1,
            Color: "000000"
        };
        this.BGColor = {
            Value: 1,
            Color: "ffffff"
        };
        this.BorderColor = {
            Value: 1,
            Color: "transparent"
        };
        this.BorderSize = 0;
        this.textureNames = [this.txtCanvas, this.txtCarton, this.txtDarkFabric, this.txtGrain, this.txtGranite, this.txtGreyPaper, this.txtKnit, this.txtLeather, this.txtBrownPaper, this.txtPapyrus, this.txtWood];
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        var dataBorders = [{
            borderstyle: "",
            text: this.txtNoBorders,
            value: 0,
            offsety: -1
        },
        {
            text: "0.5 pt",
            value: 0.5,
            offsety: 0
        },
        {
            text: "1 pt",
            value: 1,
            offsety: 20
        },
        {
            text: "1.5 pt",
            value: 1.5,
            offsety: 40
        },
        {
            text: "2.25 pt",
            value: 2.25,
            offsety: 60
        },
        {
            text: "3 pt",
            value: 3,
            offsety: 80
        },
        {
            text: "4.5 pt",
            value: 4.5,
            offsety: 100
        },
        {
            text: "6 pt",
            value: 6,
            offsety: 120
        }];
        for (var i = 1; i < dataBorders.length; i++) {
            dataBorders[i].borderstyle = Ext.String.format("background:url({0}) 0 {1}px; width:69px; height:20px; margin-right:5px;", "resources/img/right-panels/BorderSize.png", -dataBorders[i].offsety);
        }
        var fieldStore = Ext.create("Ext.data.Store", {
            model: "SSE.model.ModelBorders",
            data: dataBorders
        });
        var item_tpl = Ext.create("Ext.XTemplate", '<tpl for=".">' + '<span style="display: inline-block; margin-top: 3px; font-size: 11px; height: 17px;">{text}</span>' + '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" align="right" style="{borderstyle}">' + "</tpl>");
        this.cmbBorderSize = Ext.create("Ext.form.field.ComboBox", {
            width: 92,
            height: 21,
            editable: false,
            queryMode: "local",
            matchFieldWidth: false,
            displayField: "text",
            store: fieldStore,
            style: "margin-right: 8px;",
            listConfig: {
                mode: "local",
                width: 145,
                itemTpl: item_tpl
            },
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    this.BorderSize = records[0].data.value;
                    if (this.api && !this._noApply) {
                        var props = new Asc.asc_CShapeProperty();
                        var stroke = new Asc.asc_CStroke();
                        if (this.BorderSize < 0.01) {
                            stroke.asc_putType(c_oAscStrokeType.STROKE_NONE);
                        } else {
                            stroke.asc_putType(c_oAscStrokeType.STROKE_COLOR);
                            if (this.BorderColor.Color == "transparent" || this.BorderColor.Color.color == "transparent") {
                                stroke.asc_putColor(this.getRgbColor({
                                    color: "000000",
                                    effectId: 0
                                }));
                            } else {
                                if (this._state.StrokeType == c_oAscStrokeType.STROKE_NONE) {
                                    stroke.asc_putColor(this.getRgbColor(this.colorValue2EffectId(this.BorderColor.Color)));
                                }
                            }
                            stroke.asc_putWidth(this._pt2mm(this.BorderSize));
                        }
                        props.asc_putStroke(stroke);
                        this.imgprops.asc_putShapeProperties(props);
                        this.api.asc_setGraphicObjectProps(this.imgprops);
                    }
                    if (combo.inputEl) {
                        if (records[0].data.offsety < 0) {
                            var style = Ext.String.format("background: url({0}) repeat scroll 0 0 white", "resources/img/controls/text-bg.gif");
                            Ext.DomHelper.applyStyles(combo.inputEl, style);
                            combo.inputEl.set({
                                type: "text"
                            });
                            combo.inputEl.set({
                                value: me.txtNoBorders
                            });
                            combo.onItemClick(combo.picker, records[0]);
                        } else {
                            combo.inputEl.set({
                                type: "image"
                            });
                            combo.inputEl.set({
                                src: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            });
                            var style = Ext.String.format("background:url({0}) no-repeat scroll 0 {1}px, url({2}) repeat scroll 0 0 white", "resources/img/right-panels/BorderSize.png", -records[0].data.offsety, "resources/img/controls/text-bg.gif");
                            Ext.DomHelper.applyStyles(combo.inputEl, style);
                        }
                    }
                    this.fireEvent("editcomplete", this);
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
        this.BorderSize = rec.data.value;
        this._btnBorderColor = Ext.create("Ext.button.Button", {
            id: "shape-button-border-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "000000",
            style: "margin-bottom:5px;",
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
                        select: Ext.bind(function (picker, color, eOpts) {
                            Ext.menu.Manager.hideAll();
                            this._btnBorderColor.color = color;
                            if (this._btnBorderColor.btnEl) {
                                Ext.DomHelper.applyStyles(this._btnBorderColor.btnEl, {
                                    "background-color": Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color)
                                });
                            }
                            this.BorderColor = {
                                Value: 1,
                                Color: color
                            };
                            if (this.api && this.BorderSize > 0 && !this._noApply) {
                                var props = new Asc.asc_CShapeProperty();
                                var stroke = new Asc.asc_CStroke();
                                if (this.BorderSize < 0.01) {
                                    stroke.asc_putType(c_oAscStrokeType.STROKE_NONE);
                                } else {
                                    stroke.asc_putType(c_oAscStrokeType.STROKE_COLOR);
                                    stroke.asc_putColor(this.getRgbColor(this.BorderColor.Color));
                                    stroke.asc_putWidth(this._pt2mm(this.BorderSize));
                                }
                                props.asc_putStroke(stroke);
                                this.imgprops.asc_putShapeProperties(props);
                                this.api.asc_setGraphicObjectProps(this.imgprops);
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        this)
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
        this.controls.push(this.colorsBorder);
        this._btnBackColor = Ext.create("Ext.button.Button", {
            id: "shape-button-back-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "ffffff",
            menu: {
                showSeparator: false,
                items: [this.colorsBack = Ext.create("Common.component.ThemeColorPalette", {
                    value: "ffffff",
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
                        select: Ext.bind(function (picker, color, eOpts) {
                            Ext.menu.Manager.hideAll();
                            var clr, border;
                            if (color == "transparent") {
                                this._btnBackColor.color = "transparent";
                                clr = "transparent";
                                border = "1px solid #BEBEBE";
                            } else {
                                this._btnBackColor.color = color;
                                clr = Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color);
                                border = "none";
                            }
                            if (this._btnBackColor.btnEl) {
                                Ext.DomHelper.applyStyles(this._btnBackColor.btnEl, {
                                    "background-color": clr,
                                    "border": border
                                });
                            }
                            this.ShapeColor = {
                                Value: 1,
                                Color: this._btnBackColor.color
                            };
                            if (this.api && !this._noApply) {
                                var props = new Asc.asc_CShapeProperty();
                                var fill = new Asc.asc_CShapeFill();
                                if (this.ShapeColor.Color == "transparent") {
                                    fill.asc_putType(c_oAscFill.FILL_TYPE_NOFILL);
                                    fill.asc_putFill(null);
                                } else {
                                    fill.asc_putType(c_oAscFill.FILL_TYPE_SOLID);
                                    fill.asc_putFill(new Asc.asc_CFillSolid());
                                    fill.asc_getFill().asc_putColor(this.getRgbColor(this.ShapeColor.Color));
                                }
                                props.asc_putFill(fill);
                                this.imgprops.asc_putShapeProperties(props);
                                this.api.asc_setGraphicObjectProps(this.imgprops);
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        this)
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
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
        this.controls.push(this.colorsBack);
        this._arrFillSrc = [this.textColor, this.textGradientFill, this.textImageTexture, this.textPatternFill, this.textNoFill];
        this.cmbFillSrc = Ext.create("Ext.form.field.ComboBox", {
            id: "shape-combo-fill-src",
            width: 190,
            editable: false,
            store: this._arrFillSrc,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    this._ShowHideElem([records[0].index == 0, records[0].index == 2, records[0].index == 3, records[0].index == 1, records[0].index >= 0 && records[0].index < 4], [this._FillColorContainer, this._FillImageContainer, this._PatternContainer, this._GradientContainer, this._TransparencyContainer], [this._FillColorContainerHeight, this._FillImageContainerHeight, this._PatternContainerHeight, this._GradientContainerHeight, this._TransparencyContainerHeight]);
                    switch (records[0].index) {
                    case 0:
                        this._state.FillType = c_oAscFill.FILL_TYPE_SOLID;
                        if (!this._noApply) {
                            var props = new Asc.asc_CShapeProperty();
                            var fill = new Asc.asc_CShapeFill();
                            if (this.ShapeColor.Color == "transparent") {
                                fill.asc_putType(c_oAscFill.FILL_TYPE_NOFILL);
                                fill.asc_putFill(null);
                            } else {
                                fill.asc_putType(c_oAscFill.FILL_TYPE_SOLID);
                                fill.asc_putFill(new Asc.asc_CFillSolid());
                                fill.asc_getFill().asc_putColor(this.getRgbColor(this.ShapeColor.Color));
                            }
                            props.asc_putFill(fill);
                            this.imgprops.asc_putShapeProperties(props);
                            this.api.asc_setGraphicObjectProps(this.imgprops);
                        }
                        break;
                    case 1:
                        this._state.FillType = c_oAscFill.FILL_TYPE_GRAD;
                        if (!this._noApply) {
                            var props = new Asc.asc_CShapeProperty();
                            var fill = new Asc.asc_CShapeFill();
                            fill.asc_putType(c_oAscFill.FILL_TYPE_GRAD);
                            fill.asc_putFill(new Asc.asc_CFillGrad());
                            fill.asc_getFill().asc_putGradType(this.GradFillType);
                            if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                fill.asc_getFill().asc_putLinearAngle(viewDataLinear[this.GradLinearDirectionIdx].data.type * 60000);
                                fill.asc_getFill().asc_putLinearScale(true);
                            }
                            if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                                fill.asc_getFill().asc_putPositions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                                fill.asc_getFill().asc_putColors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                            }
                            props.asc_putFill(fill);
                            this.imgprops.asc_putShapeProperties(props);
                            this.api.asc_setGraphicObjectProps(this.imgprops);
                        }
                        break;
                    case 2:
                        this._state.FillType = c_oAscFill.FILL_TYPE_BLIP;
                        break;
                    case 3:
                        this._state.FillType = c_oAscFill.FILL_TYPE_PATT;
                        if (!this._noApply) {
                            var props = new Asc.asc_CShapeProperty();
                            var fill = new Asc.asc_CShapeFill();
                            fill.asc_putType(c_oAscFill.FILL_TYPE_PATT);
                            fill.asc_putFill(new Asc.asc_CFillHatch());
                            fill.asc_getFill().asc_putPatternType(this.PatternFillType);
                            fill.asc_getFill().asc_putColorFg(this.getRgbColor(this.FGColor.Color));
                            fill.asc_getFill().asc_putColorBg(this.getRgbColor(this.BGColor.Color));
                            props.asc_putFill(fill);
                            this.imgprops.asc_putShapeProperties(props);
                            this.api.asc_setGraphicObjectProps(this.imgprops);
                        }
                        break;
                    case 4:
                        this._state.FillType = c_oAscFill.FILL_TYPE_NOFILL;
                        if (!this._noApply) {
                            var props = new Asc.asc_CShapeProperty();
                            var fill = new Asc.asc_CShapeFill();
                            fill.asc_putType(c_oAscFill.FILL_TYPE_NOFILL);
                            fill.asc_putFill(null);
                            props.asc_putFill(fill);
                            this.imgprops.asc_putShapeProperties(props);
                            this.api.asc_setGraphicObjectProps(this.imgprops);
                        }
                        break;
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.cmbFillSrc.setValue(this._arrFillSrc[0]);
        this._FillColorContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 25,
            width: 190,
            items: [this._btnBackColor]
        });
        this._FillColorContainerHeight = this._FillColorContainer.height;
        this._btnInsertFromFile = Ext.create("Ext.Button", {
            id: "shape-button-fill-from-file",
            text: this.textFromFile,
            width: 90,
            listeners: {
                click: function (btn) {
                    if (this.api) {
                        this.api.asc_changeShapeImageFromFile();
                    }
                    this.fireEvent("editcomplete", this);
                },
                scope: this
            }
        });
        this._btnInsertFromUrl = Ext.create("Ext.Button", {
            id: "shape-button-fill-from-url",
            text: this.textFromUrl,
            width: 90,
            listeners: {
                click: function (btn) {
                    var w = Ext.create("Common.view.ImageFromUrlDialog");
                    w.addListener("onmodalresult", Ext.bind(this._onOpenImageFromURL, [this, w]), false);
                    w.addListener("close", Ext.bind(function (cnt, eOpts) {
                        this.fireEvent("editcomplete", this);
                    },
                    this));
                    w.show();
                },
                scope: this
            }
        });
        this._arrFillType = [this.textStretch, this.textTile];
        this.cmbFillType = Ext.create("Ext.form.field.ComboBox", {
            id: "shape-combo-fill-type",
            width: 90,
            editable: false,
            store: this._arrFillType,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (records[0].index == 0) {
                        this.BlipFillType = c_oAscFillBlipType.STRETCH;
                    } else {
                        if (records[0].index == 1) {
                            this.BlipFillType = c_oAscFillBlipType.TILE;
                        }
                    }
                    if (this.api && this._fromTextureCmb !== true && this.OriginalFillType == c_oAscFill.FILL_TYPE_BLIP) {
                        var props = new Asc.asc_CShapeProperty();
                        var fill = new Asc.asc_CShapeFill();
                        fill.asc_putType(c_oAscFill.FILL_TYPE_BLIP);
                        fill.asc_putFill(new Asc.asc_CFillBlip());
                        fill.asc_getFill().asc_putType(this.BlipFillType);
                        props.asc_putFill(fill);
                        this.imgprops.asc_putShapeProperties(props);
                        this.api.asc_setGraphicObjectProps(this.imgprops);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.cmbFillType.setValue(this._arrFillType[0]);
        this.controls.push(this.cmbFillType);
        this._btnTexture = Ext.create("Ext.button.Button", {
            text: this.textSelectTexture,
            width: 90,
            cls: "btn-combo-style",
            pressedCls: "",
            textAlign: "left",
            menu: this.textureMenu = Ext.create("Common.component.MenuDataViewPicker", {
                width: 242,
                height: 182,
                cls: "texture-view",
                viewData: [],
                contentWidth: 222,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        this._fromTextureCmb = true;
                        this.cmbFillType.setValue(this._arrFillType[1]);
                        this._fromTextureCmb = false;
                        if (this.api) {
                            var props = new Asc.asc_CShapeProperty();
                            var fill = new Asc.asc_CShapeFill();
                            fill.asc_putType(c_oAscFill.FILL_TYPE_BLIP);
                            fill.asc_putFill(new Asc.asc_CFillBlip());
                            fill.asc_getFill().asc_putType(c_oAscFillBlipType.TILE);
                            fill.asc_getFill().asc_putTextureId(record.data.data.type);
                            props.asc_putFill(fill);
                            this.imgprops.asc_putShapeProperties(props);
                            this.api.asc_setGraphicObjectProps(this.imgprops);
                        }
                        this._btnTexture.setText(record.data.name);
                        this.fireEvent("editcomplete", this);
                    },
                    this),
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    },
                    show: function (cmp) {
                        cmp.picker.selectByIndex(-1, false);
                    }
                }
            })
        });
        this.controls.push(this._btnTexture);
        this.textureImage = Ext.create("Ext.container.Container", {
            id: "shape-texture-img",
            width: 50,
            height: 50
        });
        Ext.define("SSE.model.PatternDataModel", {
            extend: "Ext.data.Model",
            fields: [{
                name: "imageUrl"
            },
            {
                name: "imageStyle"
            },
            {
                name: "imageCls"
            },
            {
                name: "title"
            },
            {
                name: "data"
            },
            {
                name: "uid"
            }]
        });
        var patternDataTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" style="{imageStyle}" class="{imageCls}"/>', "</div>", "</tpl>");
        this.patternViewData = [];
        var patternStore = Ext.create("Ext.data.Store", {
            storeId: Ext.id(),
            model: "SSE.model.PatternDataModel",
            data: this.patternViewData
        });
        this._cmbPattern = Ext.create("Common.component.ComboDataView", {
            id: "shape-combo-pattern",
            width: 190,
            height: 42,
            itemWidth: 28,
            itemHeight: 28,
            menuMaxHeight: 300,
            repeatedselect: true,
            store: patternStore,
            dataTpl: patternDataTpl,
            viewData: [],
            emptyComboText: this.textEmptyPattern,
            listeners: {
                select: function (combo, record) {
                    if (me.api && !me._noApply) {
                        me.PatternFillType = record.data.data.type;
                        var props = new Asc.asc_CShapeProperty();
                        var fill = new Asc.asc_CShapeFill();
                        fill.asc_putType(c_oAscFill.FILL_TYPE_PATT);
                        fill.asc_putFill(new Asc.asc_CFillHatch());
                        fill.asc_getFill().asc_putPatternType(record.data.data.type);
                        if (me.OriginalFillType !== c_oAscFill.FILL_TYPE_PATT) {
                            fill.asc_getFill().asc_putColorFg(me.getRgbColor(me.FGColor.Color));
                            fill.asc_getFill().asc_putColorBg(me.getRgbColor(me.BGColor.Color));
                        }
                        props.asc_putFill(fill);
                        me.imgprops.asc_putShapeProperties(props);
                        me.api.asc_setGraphicObjectProps(me.imgprops);
                    }
                    me.fireEvent("editcomplete", me);
                },
                menuhide: function () {
                    me.fireEvent("editcomplete", me);
                },
                releasecapture: function (cnt) {
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        this.controls.push(this._cmbPattern);
        this._cmbPattern.addCls("shape-pattern");
        this._cmbPattern.dataMenu.picker.contentWidth = 170;
        this._cmbPattern.dataMenu.picker.needArrangeSlideItems = true;
        this._cmbPattern.dataMenu.picker.arrangeItems = this._arrangeSlideItems;
        this._cmbPattern.dataMenu.picker.resizeSlideItems = this._resizeSlideItems;
        this._btnFGColor = Ext.create("Ext.button.Button", {
            id: "shape-button-foreground-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "000000",
            style: "margin-bottom:5px;",
            menu: {
                showSeparator: false,
                items: [this.colorsFG = Ext.create("Common.component.ThemeColorPalette", {
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
                        select: Ext.bind(function (picker, color, eOpts) {
                            Ext.menu.Manager.hideAll();
                            this._btnFGColor.color = color;
                            if (this._btnFGColor.btnEl) {
                                Ext.DomHelper.applyStyles(this._btnFGColor.btnEl, {
                                    "background-color": Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color)
                                });
                            }
                            this.FGColor = {
                                Value: 1,
                                Color: color
                            };
                            if (this.api && !this._noApply) {
                                var props = new Asc.asc_CShapeProperty();
                                var fill = new Asc.asc_CShapeFill();
                                fill.asc_putType(c_oAscFill.FILL_TYPE_PATT);
                                fill.asc_putFill(new Asc.asc_CFillHatch());
                                fill.asc_getFill().asc_putColorFg(this.getRgbColor(this.FGColor.Color));
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_PATT) {
                                    fill.asc_getFill().asc_putPatternType(this.PatternFillType);
                                    fill.asc_getFill().asc_putColorBg(this.getRgbColor(this.BGColor.Color));
                                }
                                props.asc_putFill(fill);
                                this.imgprops.asc_putShapeProperties(props);
                                this.api.asc_setGraphicObjectProps(this.imgprops);
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        this)
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.colorsFG.addNewColor();
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
        this.controls.push(this.colorsFG);
        this._btnBGColor = Ext.create("Ext.button.Button", {
            id: "shape-button-background-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "ffffff",
            style: "margin-bottom:5px;",
            menu: {
                showSeparator: false,
                items: [this.colorsBG = Ext.create("Common.component.ThemeColorPalette", {
                    value: "ffffff",
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
                        select: Ext.bind(function (picker, color, eOpts) {
                            Ext.menu.Manager.hideAll();
                            this._btnBGColor.color = color;
                            if (this._btnBGColor.btnEl) {
                                Ext.DomHelper.applyStyles(this._btnBGColor.btnEl, {
                                    "background-color": Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color)
                                });
                            }
                            this.BGColor = {
                                Value: 1,
                                Color: color
                            };
                            if (this.api && !this._noApply) {
                                var props = new Asc.asc_CShapeProperty();
                                var fill = new Asc.asc_CShapeFill();
                                fill.asc_putType(c_oAscFill.FILL_TYPE_PATT);
                                fill.asc_putFill(new Asc.asc_CFillHatch());
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_PATT) {
                                    fill.asc_getFill().asc_putPatternType(this.PatternFillType);
                                    fill.asc_getFill().asc_putColorFg(this.getRgbColor(this.FGColor.Color));
                                }
                                fill.asc_getFill().asc_putColorBg(this.getRgbColor(this.BGColor.Color));
                                props.asc_putFill(fill);
                                this.imgprops.asc_putShapeProperties(props);
                                this.api.asc_setGraphicObjectProps(this.imgprops);
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        this)
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.colorsBG.addNewColor();
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
        this.controls.push(this.colorsBG);
        this._PatternContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 141,
            width: 190,
            hidden: true,
            items: [{
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "label",
                text: this.strPattern
            },
            {
                xtype: "tbspacer",
                height: 2
            },
            this._cmbPattern, {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                width: 190,
                height: 27,
                items: [{
                    xtype: "label",
                    text: this.strForeground,
                    flex: 1
                },
                this._btnFGColor]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                width: 190,
                height: 27,
                items: [{
                    xtype: "label",
                    text: this.strBackground,
                    flex: 1
                },
                this._btnBGColor]
            }]
        });
        this._PatternContainerHeight = this._PatternContainer.height;
        var onShowPattern = Ext.bind(function (cmp) {
            if (this._cmbPattern.dataMenu.picker.store.getCount() > 0) {
                this._cmbPattern.fillComboView(this._cmbPattern.dataMenu.picker.store.getAt(0), true);
                this.PatternFillType = this.patternViewData[0].data.type;
                this._cmbPattern.dataMenu.picker.updateScrollPane();
                this._PatternContainer.un("show", onShowPattern);
            }
        },
        this);
        this._PatternContainer.on("show", onShowPattern);
        this._arrGradType = [this.textLinear, this.textRadial];
        this.cmbGradType = Ext.create("Ext.form.field.ComboBox", {
            id: "shape-combo-grad-type",
            width: 90,
            editable: false,
            store: this._arrGradType,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (records[0].index == 0) {
                        this.GradFillType = c_oAscFillGradType.GRAD_LINEAR;
                        this.btnDirection.menu.picker.store.loadData(viewDataLinear);
                        this.btnDirection.menu.picker.selectByIndex(this.GradLinearDirectionIdx);
                        if (this.GradLinearDirectionIdx >= 0) {
                            this.btnDirection.setIconCls(viewDataLinear[this.GradLinearDirectionIdx].iconcls);
                        } else {
                            this.btnDirection.setIconCls("");
                        }
                    } else {
                        if (records[0].index == 1) {
                            this.GradFillType = c_oAscFillGradType.GRAD_PATH;
                            this.btnDirection.menu.picker.store.loadData(viewDataRadial);
                            this.btnDirection.menu.picker.selectByIndex(this.GradRadialDirectionIdx);
                            if (this.GradRadialDirectionIdx >= 0) {
                                this.btnDirection.setIconCls(viewDataRadial[this.GradRadialDirectionIdx].iconcls);
                            } else {
                                this.btnDirection.setIconCls("");
                            }
                        }
                    }
                    if (this.api && !this._noApply) {
                        var props = new Asc.asc_CShapeProperty();
                        var fill = new Asc.asc_CShapeFill();
                        fill.asc_putType(c_oAscFill.FILL_TYPE_GRAD);
                        fill.asc_putFill(new Asc.asc_CFillGrad());
                        fill.asc_getFill().asc_putGradType(this.GradFillType);
                        if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                            fill.asc_getFill().asc_putLinearAngle(viewDataLinear[this.GradLinearDirectionIdx].data.type * 60000);
                            fill.asc_getFill().asc_putLinearScale(true);
                        }
                        fill.asc_getFill().asc_putPositions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                        fill.asc_getFill().asc_putColors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                        props.asc_putFill(fill);
                        this.imgprops.asc_putShapeProperties(props);
                        this.api.asc_setGraphicObjectProps(this.imgprops);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.cmbGradType.setValue(this._arrGradType[0]);
        var dataTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" style="{imgstyle}" class="item-gradient"/>', "</div>", '<tpl if="separator">', '<div class="gradient-separator"></div>', "</tpl>", "</tpl>");
        var viewDataLinear = [{
            offsetx: 0,
            offsety: 0,
            data: {
                type: 45,
                subtype: -1
            },
            iconcls: "gradient-subtype gradient-left-top"
        },
        {
            offsetx: 50,
            offsety: 0,
            data: {
                type: 90,
                subtype: 4
            },
            iconcls: "gradient-subtype gradient-top"
        },
        {
            offsetx: 100,
            offsety: 0,
            data: {
                type: 135,
                subtype: 5
            },
            iconcls: "gradient-subtype gradient-right-top"
        },
        {
            offsetx: 0,
            offsety: 50,
            data: {
                type: 0,
                subtype: 6
            },
            iconcls: "gradient-subtype gradient-left",
            separator: true
        },
        {
            offsetx: 100,
            offsety: 50,
            data: {
                type: 180,
                subtype: 1
            },
            iconcls: "gradient-subtype gradient-right"
        },
        {
            offsetx: 0,
            offsety: 100,
            data: {
                type: 315,
                subtype: 2
            },
            iconcls: "gradient-subtype gradient-left-bottom"
        },
        {
            offsetx: 50,
            offsety: 100,
            data: {
                type: 270,
                subtype: 3
            },
            iconcls: "gradient-subtype gradient-bottom"
        },
        {
            offsetx: 100,
            offsety: 100,
            data: {
                type: 225,
                subtype: 7
            },
            iconcls: "gradient-subtype gradient-right-bottom"
        }];
        for (var i = 0; i < viewDataLinear.length; i++) {
            viewDataLinear[i].imgstyle = Ext.String.format("background-position: {0}px {1}px;", -viewDataLinear[i].offsetx, -viewDataLinear[i].offsety);
        }
        var viewDataRadial = [{
            offsetx: 100,
            offsety: 150,
            data: {
                type: 2,
                subtype: 5
            },
            iconcls: "gradient-subtype gradient-radial-center"
        }];
        for (var i = 0; i < viewDataRadial.length; i++) {
            viewDataRadial[i].imgstyle = Ext.String.format("background-position: {0}px {1}px;", -viewDataRadial[i].offsetx, -viewDataRadial[i].offsety);
        }
        this.btnDirection = Ext.widget("button", {
            id: "shape-button-direction",
            width: 72,
            height: 58,
            cls: "btn-wrap-types",
            iconCls: "gradient-subtype gradient-left",
            pressedCls: "disablepressed",
            menuAlign: "tl-bl?",
            menu : Ext.create("Common.component.MenuDataViewPicker", {
                width: 195,
                height: 190,
                minWidth: 50,
                cls: "gradient-view",
                dataTpl: dataTpl,
                viewData: viewDataLinear,
                contentWidth: 175,
                listeners: {
                    select: Ext.bind(function (picker, record, htmlItem, index) {
                        this.btnDirection.setIconCls(record.data.iconcls);
                        (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) ? this.GradLinearDirectionIdx = index : this.GradRadialDirectionIdx = index;
                        if (this.api && !this._noApply) {
                            if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                var props = new Asc.asc_CShapeProperty();
                                var fill = new Asc.asc_CShapeFill();
                                fill.asc_putType(c_oAscFill.FILL_TYPE_GRAD);
                                fill.asc_putFill(new Asc.asc_CFillGrad());
                                fill.asc_getFill().asc_putGradType(this.GradFillType);
                                fill.asc_getFill().asc_putLinearAngle(record.data.data.type * 60000);
                                fill.asc_getFill().asc_putLinearScale(true);
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                                    fill.asc_getFill().asc_putPositions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                                    fill.asc_getFill().asc_putColors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                                }
                                props.asc_putFill(fill);
                                this.imgprops.asc_putShapeProperties(props);
                                this.api.asc_setGraphicObjectProps(this.imgprops);
                            }
                            Ext.menu.Manager.hideAll();
                        }
                        this.fireEvent("editcomplete", this);
                    },
                    this),
                    hide: Ext.bind(function () {
                        this.fireEvent("editcomplete", this);
                    },
                    this),
                    beforeshow: Ext.bind(function (cnt) {
                        if (cnt.rendered) {
                            var h = cnt.getHeight();
                            if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR && Math.abs(h - 190) > 0) {
                                cnt.picker.contentWidth = 175;
                                cnt.setSize(195, 190);
                            }
                            if (this.GradFillType == c_oAscFillGradType.GRAD_PATH && Math.abs(h - 70) > 0) {
                                cnt.picker.contentWidth = 50;
                                cnt.setSize(70, 70);
                            }
                        }
                    },
                    this)
                }
            })
        });
        this.btnDirection.menu.picker.selectByIndex(this.GradLinearDirectionIdx);
        this.controls.push(this.btnDirection);
        this._btnGradColor = Ext.create("Ext.button.Button", {
            id: "shape-button-gradient-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "000000",
            style: "margin-bottom:5px;",
            menu: {
                showSeparator: false,
                items: [this.colorsGrad = Ext.create("Common.component.ThemeColorPalette", {
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
                        select: Ext.bind(function (picker, color, eOpts) {
                            Ext.menu.Manager.hideAll();
                            this._btnGradColor.color = color;
                            if (this._btnGradColor.btnEl) {
                                Ext.DomHelper.applyStyles(this._btnGradColor.btnEl, {
                                    "background-color": Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color)
                                });
                            }
                            this.GradColor.colors[this.GradColor.currentIdx] = color;
                            this.sldrGradient.setColorValue(Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color));
                            if (this.api && !this._noApply) {
                                var props = new Asc.asc_CShapeProperty();
                                var fill = new Asc.asc_CShapeFill();
                                fill.asc_putType(c_oAscFill.FILL_TYPE_GRAD);
                                fill.asc_putFill(new Asc.asc_CFillGrad());
                                fill.asc_getFill().asc_putGradType(this.GradFillType);
                                fill.asc_getFill().asc_putColors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                                    if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                        fill.asc_getFill().asc_putLinearAngle(viewDataLinear[this.GradLinearDirectionIdx].data.type * 60000);
                                        fill.asc_getFill().asc_putLinearScale(true);
                                    }
                                    fill.asc_getFill().asc_putPositions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                                }
                                props.asc_putFill(fill);
                                this.imgprops.asc_putShapeProperties(props);
                                this.api.asc_setGraphicObjectProps(this.imgprops);
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        this)
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.colorsGrad.addNewColor();
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
        this.controls.push(this.colorsGrad);
        var _sliderChanged = false;
        var updateslider;
        var _gradientApplyFunc = function () {
            if (_sliderChanged) {
                var props = new Asc.asc_CShapeProperty();
                var fill = new Asc.asc_CShapeFill();
                fill.asc_putType(c_oAscFill.FILL_TYPE_GRAD);
                fill.asc_putFill(new Asc.asc_CFillGrad());
                fill.asc_getFill().asc_putGradType(me.GradFillType);
                fill.asc_getFill().asc_putPositions([me.GradColor.values[0] * 1000, me.GradColor.values[1] * 1000]);
                if (me.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                    if (me.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                        fill.asc_getFill().asc_putLinearAngle(viewDataLinear[me.GradLinearDirectionIdx].data.type * 60000);
                        fill.asc_getFill().asc_putLinearScale(true);
                    }
                    fill.asc_getFill().asc_putColors([me.getRgbColor(me.GradColor.colors[0]), me.getRgbColor(me.GradColor.colors[1])]);
                }
                props.asc_putFill(fill);
                me.imgprops.asc_putShapeProperties(props);
                me.api.asc_setGraphicObjectProps(me.imgprops);
                _sliderChanged = false;
            }
        };
        this.sldrGradient = Ext.create("Common.component.MultiSliderGradient", {
            animate: false,
            width: 140,
            values: [0, 100],
            increment: 1,
            minValue: 0,
            maxValue: 100,
            useTips: false,
            hideLabel: true,
            cls: "asc-multi-slider-gradient",
            listeners: {
                change: Ext.bind(function (slider, newvalue, thumb) {
                    this.GradColor.values = slider.getValues();
                    _sliderChanged = true;
                    if (this.api && !this._noApply) {
                        if (this._sendUndoPoint) {
                            this.api.setStartPointHistory();
                            this._sendUndoPoint = false;
                            updateslider = setInterval(_gradientApplyFunc, 100);
                        }
                    }
                },
                this),
                changecomplete: Ext.bind(function (slider, newvalue, thumb) {
                    clearInterval(updateslider);
                    _gradientApplyFunc();
                    this.api.setEndPointHistory();
                    this._sendUndoPoint = true;
                    Ext.menu.Manager.hideAll();
                },
                this),
                thumbclick: Ext.bind(function (cmp, index) {
                    this.GradColor.currentIdx = index;
                    var color = this.GradColor.colors[this.GradColor.currentIdx];
                    this._btnGradColor.setColor(color);
                    this.colorsGrad.select(color, false);
                },
                this),
                thumbdblclick: Ext.bind(function (cmp) {
                    this._btnGradColor.showMenu();
                },
                this)
            }
        });
        this.controls.push(this.sldrGradient);
        this._GradientContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 150,
            width: 190,
            hidden: true,
            items: [{
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "container",
                layout: "hbox",
                width: 190,
                items: [{
                    xtype: "container",
                    layout: "vbox",
                    width: 100,
                    height: 80,
                    items: [{
                        xtype: "label",
                        text: this.textStyle
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.cmbGradType, {
                        xtype: "tbspacer",
                        flex: 1
                    }]
                },
                {
                    xtype: "tbspacer",
                    flex: 1
                },
                {
                    xtype: "container",
                    layout: "vbox",
                    height: 80,
                    items: [{
                        xtype: "label",
                        text: this.textDirection
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this.btnDirection]
                }]
            },
            {
                xtype: "tbspacer",
                height: 3
            },
            {
                xtype: "label",
                text: this.textGradient,
                style: "margin-top: 1px;font-weight: bold;"
            },
            {
                xtype: "tbspacer",
                height: 7
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "top"
                },
                width: 190,
                height: 35,
                items: [this.sldrGradient, {
                    xtype: "tbspacer",
                    flex: 1
                },
                this._btnGradColor]
            }]
        });
        this._GradientContainerHeight = this._GradientContainer.height;
        var _transparencyApplyFunc = function () {
            if (_sliderChanged !== undefined) {
                var props = new Asc.asc_CShapeProperty();
                var fill = new Asc.asc_CShapeFill();
                fill.asc_putTransparent(_sliderChanged * 2.55);
                props.asc_putFill(fill);
                me.imgprops.asc_putShapeProperties(props);
                me.api.asc_setGraphicObjectProps(me.imgprops);
                _sliderChanged = undefined;
            }
        };
        this.numTransparency = Ext.create("Common.component.MetricSpinner", {
            id: "shape-spin-transparency",
            readOnly: false,
            step: 1,
            width: 65,
            defaultUnit: "%",
            value: "100 %",
            maxValue: 100,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this.sldrTransparency.suspendEvents(false);
                    this.sldrTransparency.setValue(field.getNumberValue());
                    this.sldrTransparency.resumeEvents();
                    if (this.api) {
                        var num = field.getNumberValue();
                        var props = new Asc.asc_CShapeProperty();
                        var fill = new Asc.asc_CShapeFill();
                        fill.asc_putTransparent(num * 2.55);
                        props.asc_putFill(fill);
                        this.imgprops.asc_putShapeProperties(props);
                        this.api.asc_setGraphicObjectProps(this.imgprops);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this.numTransparency);
        this.sldrTransparency = Ext.create("Ext.slider.Single", {
            animate: false,
            width: 80,
            value: 100,
            increment: 1,
            minValue: 0,
            maxValue: 100,
            useTips: false,
            hideLabel: true,
            cls: "asc-slider",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    _sliderChanged = newValue;
                    this.numTransparency.suspendEvents(false);
                    this.numTransparency.setValue(newValue);
                    this.numTransparency.resumeEvents();
                    if (this._sendUndoPoint) {
                        this.api.setStartPointHistory();
                        this._sendUndoPoint = false;
                        updateslider = setInterval(_transparencyApplyFunc, 100);
                    }
                },
                this),
                changecomplete: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    clearInterval(updateslider);
                    _transparencyApplyFunc();
                    this.api.setEndPointHistory();
                    this._sendUndoPoint = true;
                },
                this)
            }
        });
        this.controls.push(this.sldrTransparency);
        this._TransparencyContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 55,
            width: 190,
            items: [{
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "label",
                text: this.strTransparency,
                style: "margin-top: 1px;font-weight: bold;"
            },
            {
                xtype: "tbspacer",
                height: 2
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                width: 190,
                height: 27,
                items: [{
                    xtype: "label",
                    text: "0",
                    style: "margin: 2px 3px 0 0"
                },
                this.sldrTransparency, {
                    xtype: "label",
                    text: "100",
                    style: "margin: 2px 0 0 3px"
                },
                {
                    xtype: "tbspacer",
                    flex: 1
                },
                this.numTransparency]
            }]
        });
        this._TransparencyContainerHeight = this._TransparencyContainer.height;
        this._FillImageContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 120,
            width: 190,
            hidden: true,
            items: [{
                xtype: "container",
                layout: "hbox",
                width: 190,
                items: [this._btnInsertFromFile, {
                    xtype: "tbspacer",
                    flex: 1
                },
                this._btnInsertFromUrl]
            },
            {
                xtype: "tbspacer",
                height: 11
            },
            {
                xtype: "container",
                layout: "hbox",
                width: 190,
                items: [{
                    xtype: "container",
                    layout: "vbox",
                    width: 90,
                    height: 80,
                    items: [this.cmbFillType, {
                        xtype: "tbspacer",
                        flex: 1
                    },
                    {
                        xtype: "label",
                        text: this.textTexture
                    },
                    {
                        xtype: "tbspacer",
                        height: 2
                    },
                    this._btnTexture]
                },
                {
                    xtype: "tbspacer",
                    flex: 1
                },
                {
                    xtype: "container",
                    cls: "texture-img-container",
                    layout: "vbox",
                    width: 90,
                    height: 80,
                    items: [this.textureImage]
                }]
            }]
        });
        this._FillImageContainerHeight = this._FillImageContainer.height;
        this._FillPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 45,
            width: 190,
            items: [{
                xtype: "label",
                text: this.strFill,
                style: "margin-top: 1px;font-weight: bold;"
            },
            {
                xtype: "tbspacer",
                height: 7
            },
            this.cmbFillSrc]
        });
        this._btnChangeShape = Ext.create("Ext.button.Button", {
            id: "shape-button-change",
            width: 45,
            iconCls: "btn-icon-change-shape",
            cls: "asc-right-panel-edit-btn",
            tooltip: this.tipShapeArrange,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [],
                listeners: {
                    hide: {
                        fn: function () {
                            me.fireEvent("editcomplete", me);
                        }
                    }
                },
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        this._StrokePanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 51,
            width: 190,
            items: [{
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 41,
                layout: {
                    type: "table",
                    columns: 2,
                    tdAttrs: {
                        style: "vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "label",
                    text: this.strSize,
                    style: "display: block;",
                    width: 80
                },
                {
                    xtype: "label",
                    text: this.strColor,
                    style: "display: block;",
                    width: 80
                },
                {
                    xtype: "tbspacer",
                    height: 2
                },
                {
                    xtype: "tbspacer",
                    height: 2
                },
                this.cmbBorderSize, this._btnBorderColor]
            }]
        });
        this._ChangeContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 36,
            width: "100%",
            items: [{
                xtype: "tbspacer",
                height: 3
            },
            {
                xtype: "container",
                height: 30,
                width: 190,
                layout: "hbox",
                items: [{
                    xtype: "label",
                    text: this.strChange,
                    margin: "2px 0 0 0",
                    style: "font-weight: bold;margin-top: 1px;",
                    flex: 1
                },
                {
                    xtype: "tbspacer",
                    width: 7
                },
                this._btnChangeShape, {
                    xtype: "tbspacer",
                    width: 5
                }]
            }]
        });
        this.items = [{
            xtype: "tbspacer",
            height: 7
        },
        this._FillPanel, {
            xtype: "tbspacer",
            height: 7
        },
        this._FillColorContainer, this._FillImageContainer, this._PatternContainer, this._GradientContainer, this._TransparencyContainer, {
            xtype: "tbspacer",
            height: 5
        },
        {
            xtype: "tbspacer",
            width: "100%",
            height: 10,
            style: "padding-right: 10px;",
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        {
            xtype: "label",
            style: "font-weight: bold;margin-top: 1px;",
            text: this.strStroke
        },
        this._StrokePanel, {
            xtype: "tbspacer",
            height: 5
        },
        {
            xtype: "tbspacer",
            width: "100%",
            height: 10,
            style: "padding-right: 10px;",
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        this._ChangeContainer, {
            xtype: "tbspacer",
            width: "100%",
            height: 10,
            style: "padding-right: 10px;",
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "container",
            height: 20,
            width: 195,
            items: [{
                xtype: "box",
                html: '<div style="width:100%;text-align:center;padding-right:15px;"><label id="shape-advanced-link" class="asc-advanced-link">' + this.textAdvanced + "</label></div>",
                listeners: {
                    afterrender: function (cmp) {
                        document.getElementById("shape-advanced-link").onclick = Ext.bind(this._openAdvancedSettings, this);
                    },
                    scope: this
                }
            }]
        }];
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_setInterfaceDrawImagePlaceShape("shape-texture-img");
            this.api.asc_registerCallback("asc_onInitStandartTextures", Ext.bind(this._onInitStandartTextures, this));
        }
    },
    getRgbColor: function (clr) {
        var color = (typeof(clr) == "object") ? clr.color : clr;
        color = color.replace(/#/, "");
        if (color.length == 3) {
            color = color.replace(/(.)/g, "$1$1");
        }
        color = parseInt(color, 16);
        var c = new Asc.asc_CColor();
        c.asc_putType((typeof(clr) == "object") ? c_oAscColor.COLOR_TYPE_SCHEME : c_oAscColor.COLOR_TYPE_SRGB);
        c.asc_putR(color >> 16);
        c.asc_putG((color & 65280) >> 8);
        c.asc_putB(color & 255);
        c.asc_putA(255);
        if (clr.effectId !== undefined) {
            c.asc_putValue(clr.effectId);
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
    colorValue2EffectId: function (clr) {
        if (typeof(clr) == "object" && clr.effectValue !== undefined && this.effectcolors) {
            var effectval = clr.effectValue;
            for (var i = 0; i < this.effectcolors.length; i++) {
                if (this.effectcolors[i].effectValue === clr.effectValue && clr.color.toUpperCase() === this.effectcolors[i].color.toUpperCase()) {
                    clr.effectId = this.effectcolors[i].effectId;
                    break;
                }
            }
        }
        return clr;
    },
    _pt2mm: function (value) {
        return (value * 25.4 / 72);
    },
    _mm2pt: function (value) {
        return (value * 72 / 25.4);
    },
    FillAutoShapes: function () {
        var shapesStore = Ext.getStore("ShapeGroups");
        var me = this;
        var count = shapesStore.getCount();
        me._btnChangeShape.menu.removeAll();
        for (var i = 0; i < count; i++) {
            if (i == count - 2) {
                continue;
            }
            var shapeGroup = shapesStore.getAt(i);
            var mnu = Ext.widget("menuitem", {
                text: shapeGroup.data.groupName,
                hideOnClick: false,
                cls: "menu-item-noicon",
                menuAlign: "tl-tl?",
                menu : Ext.create("Common.component.MenuDataViewPicker", {
                    width: shapeGroup.data.groupWidth,
                    height: shapeGroup.data.groupHeight,
                    store: shapeGroup.data.groupStore,
                    viewData: [],
                    contentWidth: shapeGroup.data.groupWidth - 20,
                    listeners: {
                        select: Ext.bind(function (picker, record) {
                            if (me.api) {
                                me.api.asc_changeShapeType(record.data.data.shapeType);
                            }
                        },
                        this),
                        hide: function () {
                            me.fireEvent("editcomplete", me);
                        },
                        show: function (cmp) {
                            cmp.picker.selectByIndex(-1, false);
                        }
                    },
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }),
                deferExpandMenu: function () {
                    if (!this.menu.rendered || !this.menu.isVisible()) {
                        this.parentMenu.activeChild = this.menu;
                        this.menu.parentItem = this;
                        this.menu.parentMenu = this.menu.ownerCt = this.parentMenu;
                        this.menu.showBy(this, this.menuAlign, [-this.menu.width, 0]);
                    }
                }
            });
            me._btnChangeShape.menu.add(mnu);
        }
    },
    _onOpenImageFromURL: function (mr) {
        var self = this[0];
        var url = this[1].txtUrl;
        if (mr == 1 && self.api) {
            var checkurl = url.value.replace(/ /g, "");
            if (checkurl != "") {
                if (self.BlipFillType !== null) {
                    var props = new Asc.asc_CShapeProperty();
                    var fill = new Asc.asc_CShapeFill();
                    fill.asc_putType(c_oAscFill.FILL_TYPE_BLIP);
                    fill.asc_putFill(new Asc.asc_CFillBlip());
                    fill.asc_getFill().asc_putType(self.BlipFillType);
                    fill.asc_getFill().asc_putUrl(url.value);
                    props.asc_putFill(fill);
                    self.imgprops.asc_putShapeProperties(props);
                    self.api.asc_setGraphicObjectProps(self.imgprops);
                }
            }
        }
    },
    _ShowHideElem: function (visible, components, heights) {
        var height = this.getHeight();
        var diff = 0;
        for (var i = 0; i < visible.length; i++) {
            if (visible[i] && !components[i].isVisible()) {
                components[i].show();
                diff += heights[i];
            }
            if (!visible[i] && components[i].isVisible()) {
                diff -= heights[i];
                components[i].hide();
            }
        }
        this.setHeight(height + diff);
        this.initialHeight = height + diff;
        this.ownerCt.setHeight(this.initialHeight);
    },
    ChangeSettings: function (props) {
        if (this._initSettings) {
            this.createDelayedElements();
        }
        this._initSettings = false;
        if (this.imgprops == null) {
            this.imgprops = new Asc.asc_CImgProperty();
        }
        if (props && props.asc_getShapeProperties()) {
            var shapeprops = props.asc_getShapeProperties();
            this._originalProps = shapeprops;
            this.SuspendEvents();
            this._noApply = true;
            this.disableFillPanels(!shapeprops.asc_getCanFill());
            var rec = null;
            var fill = shapeprops.asc_getFill();
            var fill_type = fill.asc_getType();
            var color = null;
            var transparency = fill.asc_getTransparent();
            if (Math.abs(this._state.Transparency - transparency) > 0.001 || Math.abs(this.numTransparency.getNumberValue() - transparency) > 0.001 || (this._state.Transparency === null || transparency === null) && (this._state.Transparency !== transparency || this.numTransparency.getNumberValue() !== transparency)) {
                if (transparency !== undefined) {
                    this.sldrTransparency.setValue((transparency === null) ? 100 : transparency / 255 * 100);
                    this.numTransparency.setValue(this.sldrTransparency.getValue());
                }
                this._state.Transparency = transparency;
            }
            if (fill === null || fill_type === null || fill_type == c_oAscFill.FILL_TYPE_NOFILL) {
                this.OriginalFillType = c_oAscFill.FILL_TYPE_NOFILL;
            } else {
                if (fill_type == c_oAscFill.FILL_TYPE_SOLID) {
                    fill = fill.asc_getFill();
                    color = fill.asc_getColor();
                    if (color) {
                        if (color.asc_getType() == c_oAscColor.COLOR_TYPE_SCHEME) {
                            this.ShapeColor = {
                                Value: 1,
                                Color: {
                                    color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB()),
                                    effectValue: color.asc_getValue()
                                }
                            };
                        } else {
                            this.ShapeColor = {
                                Value: 1,
                                Color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB())
                            };
                        }
                    } else {
                        this.ShapeColor = {
                            Value: 0,
                            Color: "transparent"
                        };
                    }
                    this.FGColor = (this.ShapeColor.Color !== "transparent") ? {
                        Value: 1,
                        Color: this.colorValue2EffectId(this.ShapeColor.Color)
                    } : {
                        Value: 1,
                        Color: "000000"
                    };
                    this.BGColor = {
                        Value: 1,
                        Color: "ffffff"
                    };
                    this.OriginalFillType = c_oAscFill.FILL_TYPE_SOLID;
                } else {
                    if (fill_type == c_oAscFill.FILL_TYPE_BLIP) {
                        fill = fill.asc_getFill();
                        this.BlipFillType = fill.asc_getType();
                        if (this._state.BlipFillType !== this.BlipFillType) {
                            if (this.BlipFillType == c_oAscFillBlipType.STRETCH) {
                                this.cmbFillType.setValue(this._arrFillType[0]);
                            } else {
                                if (this.BlipFillType == c_oAscFillBlipType.TILE) {
                                    this.cmbFillType.setValue(this._arrFillType[1]);
                                } else {
                                    this.cmbFillType.setValue("");
                                }
                            }
                            this._state.BlipFillType = this.BlipFillType;
                        }
                        this.OriginalFillType = c_oAscFill.FILL_TYPE_BLIP;
                    } else {
                        if (fill_type == c_oAscFill.FILL_TYPE_PATT) {
                            fill = fill.asc_getFill();
                            this.PatternFillType = fill.asc_getPatternType();
                            if (this._state.PatternFillType !== this.PatternFillType) {
                                var styleIndex = this._cmbPattern.dataMenu.picker.store.findBy(function (record, id) {
                                    return (record.data.data.type === this.PatternFillType);
                                },
                                this);
                                this._cmbPattern.selectByIndex(styleIndex);
                                this._state.PatternFillType = this.PatternFillType;
                            }
                            color = fill.asc_getColorFg();
                            if (color) {
                                if (color.asc_getType() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                    this.FGColor = {
                                        Value: 1,
                                        Color: {
                                            color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB()),
                                            effectValue: color.asc_getValue()
                                        }
                                    };
                                } else {
                                    this.FGColor = {
                                        Value: 1,
                                        Color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB())
                                    };
                                }
                            } else {
                                this.FGColor = {
                                    Value: 1,
                                    Color: "000000"
                                };
                            }
                            color = fill.asc_getColorBg();
                            if (color) {
                                if (color.asc_getType() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                    this.BGColor = {
                                        Value: 1,
                                        Color: {
                                            color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB()),
                                            effectValue: color.asc_getValue()
                                        }
                                    };
                                } else {
                                    this.BGColor = {
                                        Value: 1,
                                        Color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB())
                                    };
                                }
                            } else {
                                this.BGColor = {
                                    Value: 1,
                                    Color: "ffffff"
                                };
                            }
                            this.OriginalFillType = c_oAscFill.FILL_TYPE_PATT;
                            this.ShapeColor = (this.FGColor.Color !== "transparent") ? {
                                Value: 1,
                                Color: this.colorValue2EffectId(this.FGColor.Color)
                            } : {
                                Value: 1,
                                Color: "ffffff"
                            };
                        } else {
                            if (fill_type == c_oAscFill.FILL_TYPE_GRAD) {
                                fill = fill.asc_getFill();
                                var gradfilltype = fill.asc_getGradType();
                                if (this._state.GradFillType !== gradfilltype || this.GradFillType !== gradfilltype) {
                                    this.GradFillType = gradfilltype;
                                    rec = undefined;
                                    if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                        rec = this.cmbGradType.getStore().getAt(0);
                                    } else {
                                        if (this.GradFillType == c_oAscFillGradType.GRAD_PATH) {
                                            rec = this.cmbGradType.getStore().getAt(1);
                                        } else {
                                            this.cmbGradType.setValue("");
                                            this.btnDirection.setIconCls("");
                                        }
                                    }
                                    if (rec) {
                                        this.cmbGradType.select(rec);
                                        this.cmbGradType.fireEvent("select", this.cmbGradType, [rec]);
                                    }
                                    this._state.GradFillType = this.GradFillType;
                                }
                                if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                    var value = Math.floor(fill.asc_getLinearAngle() / 60000);
                                    var icon;
                                    var idx = this.btnDirection.menu.picker.store.findBy(function (record, id) {
                                        icon = record.data.iconcls;
                                        return (record.data.data.type === value);
                                    },
                                    this);
                                    if (idx !== this.GradLinearDirectionIdx) {
                                        this.GradLinearDirectionIdx = idx;
                                        this.btnDirection.menu.picker.selectByIndex(this.GradLinearDirectionIdx, false);
                                        if (this.GradLinearDirectionIdx >= 0) {
                                            this.btnDirection.setIconCls(icon);
                                        } else {
                                            this.btnDirection.setIconCls("");
                                        }
                                    }
                                }
                                var colors = fill.asc_getColors();
                                if (colors && colors.length > 0) {
                                    color = colors[0];
                                    if (color) {
                                        if (color.asc_getType() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                            this.GradColor.colors[0] = {
                                                color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB()),
                                                effectValue: color.asc_getValue()
                                            };
                                            this.colorValue2EffectId(this.GradColor.colors[0]);
                                        } else {
                                            this.GradColor.colors[0] = this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB());
                                        }
                                    } else {
                                        this.GradColor.colors[0] = "000000";
                                    }
                                    color = colors[1];
                                    if (color) {
                                        if (color.asc_getType() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                            this.GradColor.colors[1] = {
                                                color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB()),
                                                effectValue: color.asc_getValue()
                                            };
                                            this.colorValue2EffectId(this.GradColor.colors[1]);
                                        } else {
                                            this.GradColor.colors[1] = this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB());
                                        }
                                    } else {
                                        this.GradColor.colors[1] = "ffffff";
                                    }
                                }
                                var positions = fill.asc_getPositions();
                                if (positions && positions.length > 0) {
                                    var position = positions[0];
                                    if (position !== null) {
                                        position = position / 1000;
                                        this.GradColor.values[0] = position;
                                    }
                                    position = positions[1];
                                    if (position !== null) {
                                        position = position / 1000;
                                        this.GradColor.values[1] = position;
                                    }
                                }
                                this.sldrGradient.setColorValue(Ext.String.format("#{0}", (typeof(this.GradColor.colors[0]) == "object") ? this.GradColor.colors[0].color : this.GradColor.colors[0]), 0);
                                this.sldrGradient.setColorValue(Ext.String.format("#{0}", (typeof(this.GradColor.colors[1]) == "object") ? this.GradColor.colors[1].color : this.GradColor.colors[1]), 1);
                                this.sldrGradient.setValue(0, this.GradColor.values[0]);
                                this.sldrGradient.setValue(1, this.GradColor.values[1]);
                                this.OriginalFillType = c_oAscFill.FILL_TYPE_GRAD;
                            }
                        }
                    }
                }
            }
            if (this._state.FillType !== this.OriginalFillType) {
                switch (this.OriginalFillType) {
                case c_oAscFill.FILL_TYPE_SOLID:
                    rec = this.cmbFillSrc.getStore().getAt(0);
                    break;
                case c_oAscFill.FILL_TYPE_GRAD:
                    rec = this.cmbFillSrc.getStore().getAt(1);
                    break;
                case c_oAscFill.FILL_TYPE_BLIP:
                    rec = this.cmbFillSrc.getStore().getAt(2);
                    break;
                case c_oAscFill.FILL_TYPE_PATT:
                    rec = this.cmbFillSrc.getStore().getAt(3);
                    break;
                case c_oAscFill.FILL_TYPE_NOFILL:
                    rec = this.cmbFillSrc.getStore().getAt(4);
                    break;
                }
                if (rec) {
                    this.cmbFillSrc.select(rec);
                    this.cmbFillSrc.fireEvent("select", this.cmbFillSrc, [rec]);
                }
                this._state.FillType = this.OriginalFillType;
            }
            this._btnTexture.setText(this.textSelectTexture);
            var type1 = typeof(this.ShapeColor.Color),
            type2 = typeof(this._state.ShapeColor);
            if ((type1 !== type2) || (type1 == "object" && (this.ShapeColor.Color.effectValue !== this._state.ShapeColor.effectValue || this._state.ShapeColor.color.indexOf(this.ShapeColor.Color.color) < 0)) || (type1 != "object" && this._state.ShapeColor.indexOf(this.ShapeColor.Color) < 0)) {
                this._btnBackColor.setColor(this.ShapeColor.Color);
                if (typeof(this.ShapeColor.Color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.ShapeColor.Color.effectValue) {
                            this.colorsBack.select(this.ShapeColor.Color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsBack.select(this.ShapeColor.Color, false);
                }
                this._state.ShapeColor = this.ShapeColor.Color;
            }
            var stroke = shapeprops.asc_getStroke();
            var strokeType = stroke.asc_getType();
            if (stroke) {
                if (strokeType == c_oAscStrokeType.STROKE_COLOR) {
                    color = stroke.asc_getColor();
                    if (color) {
                        if (color.asc_getType() == c_oAscColor.COLOR_TYPE_SCHEME) {
                            this.BorderColor = {
                                Value: 1,
                                Color: {
                                    color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB()),
                                    effectValue: color.asc_getValue()
                                }
                            };
                        } else {
                            this.BorderColor = {
                                Value: 1,
                                Color: this.getHexColor(color.asc_getR(), color.asc_getG(), color.asc_getB())
                            };
                        }
                    } else {
                        this.BorderColor = {
                            Value: 1,
                            Color: "transparent"
                        };
                    }
                } else {
                    this.BorderColor = {
                        Value: 1,
                        Color: "transparent"
                    };
                }
            } else {
                strokeType = null;
                this.BorderColor = {
                    Value: 0,
                    Color: "transparent"
                };
            }
            type1 = typeof(this.BorderColor.Color);
            type2 = typeof(this._state.StrokeColor);
            if ((type1 !== type2) || (type1 == "object" && (this.BorderColor.Color.effectValue !== this._state.StrokeColor.effectValue || this._state.StrokeColor.color.indexOf(this.BorderColor.Color.color) < 0)) || (type1 != "object" && (this._state.StrokeColor.indexOf(this.BorderColor.Color) < 0 || typeof(this._btnBorderColor.color) == "object"))) {
                this._btnBorderColor.setColor(this.BorderColor.Color);
                if (typeof(this.BorderColor.Color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.BorderColor.Color.effectValue) {
                            this.colorsBorder.select(this.BorderColor.Color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsBorder.select(this.BorderColor.Color, false);
                }
                this._state.StrokeColor = this.BorderColor.Color;
            }
            if (this._state.StrokeType !== strokeType || strokeType == c_oAscStrokeType.STROKE_COLOR) {
                if (strokeType == c_oAscStrokeType.STROKE_COLOR) {
                    var w = stroke.asc_getWidth();
                    if (Math.abs(this._state.StrokeWidth - w) > 0.001 || (this._state.StrokeWidth === null || w === null) && (this._state.StrokeWidth !== w)) {
                        this._state.StrokeWidth = w;
                        var idx = -1;
                        if (w !== null) {
                            w = this._mm2pt(w);
                            Ext.each(this.cmbBorderSize.getStore().data.items, function (item, index) {
                                if (w < item.data.value + 0.01 && w > item.data.value - 0.01) {
                                    idx = index;
                                    return false;
                                }
                            });
                        }
                        if (idx > -1) {
                            rec = this.cmbBorderSize.getStore().getAt(idx);
                            this.cmbBorderSize.select(rec);
                            this.cmbBorderSize.fireEvent("select", this.cmbBorderSize, [rec]);
                        } else {
                            rec = {
                                borderstyle: "",
                                text: "",
                                value: w,
                                offsety: -1
                            };
                            rec = this.cmbBorderSize.getStore().add(rec);
                            this.cmbBorderSize.select(rec[0]);
                            this.cmbBorderSize.fireEvent("select", this.cmbBorderSize, [rec[0]]);
                            this.cmbBorderSize.getStore().remove(rec[0]);
                        }
                    }
                } else {
                    if (strokeType == c_oAscStrokeType.STROKE_NONE) {
                        this._state.StrokeWidth = 0;
                        rec = this.cmbBorderSize.getStore().getAt(0);
                        this.cmbBorderSize.select(rec);
                        this.cmbBorderSize.fireEvent("select", this.cmbBorderSize, [rec]);
                    } else {
                        this._state.StrokeWidth = null;
                        rec = {
                            borderstyle: "",
                            text: "",
                            value: -1,
                            offsety: -1
                        };
                        rec = this.cmbBorderSize.getStore().add(rec);
                        this.cmbBorderSize.select(rec[0]);
                        this.cmbBorderSize.fireEvent("select", this.cmbBorderSize, [rec[0]]);
                        this.cmbBorderSize.getStore().remove(rec[0]);
                    }
                }
                this._state.StrokeType = strokeType;
            }
            type1 = typeof(this.FGColor.Color);
            type2 = typeof(this._state.FGColor);
            if ((type1 !== type2) || (type1 == "object" && (this.FGColor.Color.effectValue !== this._state.FGColor.effectValue || this._state.FGColor.color.indexOf(this.FGColor.Color.color) < 0)) || (type1 != "object" && this._state.FGColor.indexOf(this.FGColor.Color) < 0)) {
                this._btnFGColor.setColor(this.FGColor.Color);
                if (typeof(this.FGColor.Color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.FGColor.Color.effectValue) {
                            this.colorsFG.select(this.FGColor.Color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsFG.select(this.FGColor.Color, false);
                }
                this._state.FGColor = this.FGColor.Color;
            }
            type1 = typeof(this.BGColor.Color);
            type2 = typeof(this._state.BGColor);
            if ((type1 !== type2) || (type1 == "object" && (this.BGColor.Color.effectValue !== this._state.BGColor.effectValue || this._state.BGColor.color.indexOf(this.BGColor.Color.color) < 0)) || (type1 != "object" && this._state.BGColor.indexOf(this.BGColor.Color) < 0)) {
                this._btnBGColor.setColor(this.BGColor.Color);
                if (typeof(this.BGColor.Color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.BGColor.Color.effectValue) {
                            this.colorsBG.select(this.BGColor.Color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsBG.select(this.BGColor.Color, false);
                }
                this._state.BGColor = this.BGColor.Color;
            }
            color = this.GradColor.colors[this.GradColor.currentIdx];
            type1 = typeof(color);
            type2 = typeof(this._state.GradColor);
            if ((type1 !== type2) || (type1 == "object" && (color.effectValue !== this._state.GradColor.effectValue || this._state.GradColor.color.indexOf(color.color) < 0)) || (type1 != "object" && this._state.GradColor.indexOf(color) < 0)) {
                this._btnGradColor.setColor(color);
                if (typeof(color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == color.effectValue) {
                            this.colorsGrad.select(color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsGrad.select(color, false);
                }
                this._state.GradColor = color;
            }
            this._noApply = false;
            this.ResumeEvents();
        }
    },
    SendThemeColors: function (effectcolors, standartcolors) {
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
        if (!this._initSettings) {
            this.colorsBorder.updateColors(effectcolors, standartcolors);
            this.colorsBack.updateColors(effectcolors, standartcolors);
            this.colorsFG.updateColors(effectcolors, standartcolors);
            this.colorsBG.updateColors(effectcolors, standartcolors);
            this.colorsGrad.updateColors(effectcolors, standartcolors);
        }
    },
    _openAdvancedSettings: function (e) {
        var me = this;
        var win;
        if (me.api) {
            var selectedElements = me.api.asc_getGraphicObjectProps();
            if (selectedElements && Ext.isArray(selectedElements)) {
                var elType, elValue;
                for (var i = selectedElements.length - 1; i >= 0; i--) {
                    elType = selectedElements[i].asc_getObjectType();
                    if (c_oAscTypeSelectElement.Image == elType) {
                        elValue = selectedElements[i].asc_getObjectValue();
                        win = Ext.create("SSE.view.ShapeSettingsAdvanced", {});
                        win.updateMetricUnit();
                        win.setSettings(elValue);
                        break;
                    }
                }
            }
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr == 1 && s) {
                    this.api.asc_setGraphicObjectProps(s);
                }
                this.fireEvent("editcomplete", this);
            },
            this), false);
            win.show();
        }
    },
    _onInitStandartTextures: function (texture) {
        var me = this;
        if (!Ext.isEmpty(texture)) {
            var textureStore = this.textureMenu.picker.store;
            if (textureStore) {
                if (textureStore.count() > 0) {
                    return;
                }
                var texturearray = [];
                Ext.each(texture, function (item) {
                    texturearray.push({
                        imageUrl: item.asc_getImage(),
                        name: me.textureNames[item.asc_getId()],
                        data: {
                            type: item.asc_getId()
                        }
                    });
                });
                textureStore.add(texturearray);
            }
        }
    },
    _arrangeSlideItems: function () {
        if (!this.needArrangeSlideItems) {
            return;
        }
        var me = this;
        if (this.getEl()) {
            var jspElem = this.getEl().down(".jspPane");
            if (jspElem && jspElem.getHeight() > 0 && this.getEl().getHeight() > 0) {
                var i = 0;
                var updatescroll = setInterval(function () {
                    if (me.needArrangeSlideItems) {
                        me.resizeSlideItems();
                    }
                    if (!me.needArrangeSlideItems) {
                        clearInterval(updatescroll);
                        me.doLayout();
                        return;
                    }
                    if (i++>5) {
                        clearInterval(updatescroll);
                    }
                },
                100);
            }
        }
    },
    _resizeSlideItems: function () {
        var cols = 5;
        var selector = "div.thumb-wrap";
        var el = this.getEl();
        var thumbs = el.query(selector);
        var i = 0;
        while (i < thumbs.length) {
            var height = 0;
            for (var j = i; j < i + cols; j++) {
                if (j >= thumbs.length) {
                    break;
                }
                var thEl = Ext.get(thumbs[j]);
                var h = thEl.getHeight();
                if (h < 28) {
                    return;
                }
                if (h < height) {
                    thEl.setHeight(height);
                } else {
                    height = h;
                }
            }
            i += cols;
        }
        if (thumbs.length > 0) {
            this.needArrangeSlideItems = false;
        }
    },
    hideMenus: function () {
        this._btnBorderColor.hideMenu();
        this._btnBackColor.hideMenu();
        this._btnTexture.hideMenu();
        this._btnChangeShape.hideMenu();
        this._btnBGColor.hideMenu();
        this._btnFGColor.hideMenu();
        this._cmbPattern.dataMenu.hide();
        this.btnDirection.hideMenu();
        this._btnGradColor.hideMenu();
    },
    createDelayedElements: function () {
        var global_hatch_menu_map = [0, 1, 3, 2, 4, 53, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 49, 50, 51, 52];
        this.patternViewData = [];
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 4; j++) {
                var num = i * 4 + j;
                this.patternViewData[num] = {
                    offsetx: j * 28,
                    offsety: i * 28,
                    data: {
                        type: global_hatch_menu_map[num]
                    }
                };
            }
        }
        this.patternViewData.splice(this.patternViewData.length - 2, 2);
        for (var i = 0; i < this.patternViewData.length; i++) {
            this.patternViewData[i].imageCls = "item-combo-pattern";
            this.patternViewData[i].imageStyle = Ext.String.format("background-position: {0}px {1}px;", -this.patternViewData[i].offsetx, -this.patternViewData[i].offsety);
            this.patternViewData[i].uid = Ext.id();
        }
        this._cmbPattern.dataMenu.picker.store.loadData(this.patternViewData);
        this.FillAutoShapes();
        if (this.effectcolors && this.standartcolors) {
            this.colorsBorder.updateColors(this.effectcolors, this.standartcolors);
            this.colorsBack.updateColors(this.effectcolors, this.standartcolors);
            this.colorsFG.updateColors(this.effectcolors, this.standartcolors);
            this.colorsBG.updateColors(this.effectcolors, this.standartcolors);
            this.colorsGrad.updateColors(this.effectcolors, this.standartcolors);
        }
    },
    disableFillPanels: function (disable) {
        if (this._state.DisabledFillPanels !== disable) {
            this._state.DisabledFillPanels = disable;
            this._FillPanel.setDisabled(disable);
            this._FillColorContainer.setDisabled(disable);
            this._FillImageContainer.setDisabled(disable);
            this._PatternContainer.setDisabled(disable);
            this._GradientContainer.setDisabled(disable);
            this._TransparencyContainer.setDisabled(disable);
        }
    },
    txtTitle: "Autoshape",
    txtNoBorders: "No Line",
    strStroke: "Stroke",
    strColor: "Color",
    strSize: "Size",
    strChange: "Change Autoshape",
    strFill: "Fill",
    textColor: "Color Fill",
    textImageTexture: "Picture or Texture",
    textTexture: "From Texture",
    textFromUrl: "From URL",
    textFromFile: "From File",
    textStretch: "Stretch",
    textTile: "Tile",
    txtCanvas: "Canvas",
    txtCarton: "Carton",
    txtDarkFabric: "Dark Fabric",
    txtGrain: "Grain",
    txtGranite: "Granite",
    txtGreyPaper: "Grey Paper",
    txtKnit: "Knit",
    txtLeather: "Leather",
    txtBrownPaper: "Brown Paper",
    txtPapyrus: "Papyrus",
    txtWood: "Wood",
    textNewColor: "Add New Custom Color",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    textAdvanced: "Show advanced settings",
    strTransparency: "Opacity",
    textNoFill: "No Fill",
    textSelectTexture: "Select",
    textGradientFill: "Gradient Fill",
    textPatternFill: "Pattern",
    strBackground: "Background color",
    strForeground: "Foreground color",
    strPattern: "Pattern",
    textEmptyPattern: "No Pattern",
    textLinear: "Linear",
    textRadial: "Radial",
    textDirection: "Direction",
    textStyle: "Style",
    textGradient: "Gradient"
});