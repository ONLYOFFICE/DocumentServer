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
 Ext.define("PE.view.SlideSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.peslidesettings",
    height: 347,
    requires: ["Ext.button.Button", "Ext.form.Label", "Ext.form.field.ComboBox", "Ext.container.Container", "Ext.toolbar.Spacer", "Ext.Array", "Ext.menu.Menu", "Ext.menu.Manager", "Ext.XTemplate", "Ext.Img", "Ext.slider.Single", "Common.component.DataViewPicker", "Common.component.MetricSpinner", "Common.view.ImageFromUrlDialog", "Common.component.ThemeColorPalette", "Common.component.IndeterminateCheckBox", "Common.component.ComboDataView", "Common.component.MultiSliderGradient"],
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
        this._sendUndoPoint = true;
        this._stateDisabled = {
            background: false,
            effects: false,
            timing: false
        };
        this._state = {
            FillType: c_oAscFill.FILL_TYPE_SOLID,
            SlideColor: "ffffff",
            BlipFillType: c_oAscFillBlipType.STRETCH,
            FGColor: "000000",
            BGColor: "ffffff",
            GradColor: "000000",
            GradFillType: c_oAscFillGradType.GRAD_LINEAR
        };
        this.OriginalFillType = c_oAscFill.FILL_TYPE_SOLID;
        this.SlideColor = {
            Value: 1,
            Color: "ffffff"
        };
        this.BlipFillType = c_oAscFillBlipType.STRETCH;
        this.Effect = c_oAscSlideTransitionTypes.None;
        this.EffectType = undefined;
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
        this.textureNames = [this.txtCanvas, this.txtCarton, this.txtDarkFabric, this.txtGrain, this.txtGranite, this.txtGreyPaper, this.txtKnit, this.txtLeather, this.txtBrownPaper, this.txtPapyrus, this.txtWood];
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        this._btnBackColor = Ext.create("Ext.button.Button", {
            id: "slide-button-back-color",
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
                            this.SlideColor = {
                                Value: 1,
                                Color: this._btnBackColor.color
                            };
                            if (this.api) {
                                var props = new CAscSlideProps();
                                var fill = new CAscFill();
                                if (this.SlideColor.Color == "transparent") {
                                    fill.put_type(c_oAscFill.FILL_TYPE_NOFILL);
                                    fill.put_fill(null);
                                } else {
                                    fill.put_type(c_oAscFill.FILL_TYPE_SOLID);
                                    fill.put_fill(new CAscFillSolid());
                                    fill.get_fill().put_color(this.getRgbColor(this.SlideColor.Color));
                                }
                                props.put_background(fill);
                                this.api.SetSlideProps(props);
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
            id: "slide-combo-fill-src",
            width: 190,
            editable: false,
            store: this._arrFillSrc,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    this._ShowHideElem([records[0].index == 0, records[0].index == 2, records[0].index == 3, records[0].index == 1], [this._FillColorContainer, this._FillImageContainer, this._PatternContainer, this._GradientContainer], [this._FillColorContainerHeight, this._FillImageContainerHeight, this._PatternContainerHeight, this._GradientContainerHeight]);
                    switch (records[0].index) {
                    case 0:
                        this._state.FillType = c_oAscFill.FILL_TYPE_SOLID;
                        if (!this._noApply) {
                            var props = new CAscSlideProps();
                            var fill = new CAscFill();
                            if (this.SlideColor.Color == "transparent") {
                                fill.put_type(c_oAscFill.FILL_TYPE_NOFILL);
                                fill.put_fill(null);
                            } else {
                                fill.put_type(c_oAscFill.FILL_TYPE_SOLID);
                                fill.put_fill(new CAscFillSolid());
                                fill.get_fill().put_color(this.getRgbColor(this.SlideColor.Color));
                            }
                            props.put_background(fill);
                            this.api.SetSlideProps(props);
                        }
                        break;
                    case 1:
                        this._state.FillType = c_oAscFill.FILL_TYPE_GRAD;
                        if (!this._noApply) {
                            var props = new CAscSlideProps();
                            var fill = new CAscFill();
                            fill.put_type(c_oAscFill.FILL_TYPE_GRAD);
                            fill.put_fill(new CAscFillGrad());
                            fill.get_fill().put_grad_type(this.GradFillType);
                            if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                fill.get_fill().put_linear_angle(viewDataLinear[this.GradLinearDirectionIdx].data.type * 60000);
                                fill.get_fill().put_linear_scale(true);
                            }
                            if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                                fill.get_fill().put_positions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                                fill.get_fill().put_colors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                            }
                            props.put_background(fill);
                            this.api.SetSlideProps(props);
                        }
                        break;
                    case 2:
                        this._state.FillType = c_oAscFill.FILL_TYPE_BLIP;
                        break;
                    case 3:
                        this._state.FillType = c_oAscFill.FILL_TYPE_PATT;
                        if (!this._noApply) {
                            var props = new CAscSlideProps();
                            var fill = new CAscFill();
                            fill.put_type(c_oAscFill.FILL_TYPE_PATT);
                            fill.put_fill(new CAscFillHatch());
                            fill.get_fill().put_pattern_type(this.PatternFillType);
                            fill.get_fill().put_color_fg(this.getRgbColor(this.FGColor.Color));
                            fill.get_fill().put_color_bg(this.getRgbColor(this.BGColor.Color));
                            props.put_background(fill);
                            this.api.SetSlideProps(props);
                        }
                        break;
                    case 4:
                        this._state.FillType = c_oAscFill.FILL_TYPE_NOFILL;
                        if (!this._noApply) {
                            var props = new CAscSlideProps();
                            var fill = new CAscFill();
                            fill.put_type(c_oAscFill.FILL_TYPE_NOFILL);
                            fill.put_fill(null);
                            props.put_background(fill);
                            this.api.SetSlideProps(props);
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
            id: "slide-button-fill-from-file",
            text: this.textFromFile,
            width: 90,
            listeners: {
                click: function (btn) {
                    if (this.api) {
                        this.api.ChangeSlideImageFromFile();
                    }
                    this.fireEvent("editcomplete", this);
                },
                scope: this
            }
        });
        this._btnInsertFromUrl = Ext.create("Ext.Button", {
            id: "slide-button-fill-from-url",
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
            id: "slide-combo-fill-type",
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
                        var props = new CAscSlideProps();
                        var fill = new CAscFill();
                        fill.put_type(c_oAscFill.FILL_TYPE_BLIP);
                        fill.put_fill(new CAscFillBlip());
                        fill.get_fill().put_type(this.BlipFillType);
                        props.put_background(fill);
                        this.api.SetSlideProps(props);
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
                            var props = new CAscSlideProps();
                            var fill = new CAscFill();
                            fill.put_type(c_oAscFill.FILL_TYPE_BLIP);
                            fill.put_fill(new CAscFillBlip());
                            fill.get_fill().put_type(c_oAscFillBlipType.TILE);
                            fill.get_fill().put_texture_id(record.data.data.type);
                            props.put_background(fill);
                            this.api.SetSlideProps(props);
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
            id: "slide-texture-img",
            width: 50,
            height: 50
        });
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
                height: 80,
                items: [{
                    xtype: "container",
                    layout: "vbox",
                    width: 90,
                    height: 80,
                    items: [this.cmbFillType, {
                        xtype: "tbspacer",
                        height: 15
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
        var patternDataTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" style="{imageStyle}" class="{imageCls}"/>', "</div>", "</tpl>");
        this.patternViewData = [];
        var patternStore = Ext.create("Ext.data.Store", {
            storeId: Ext.id(),
            model: "PE.model.PatternDataModel",
            data: this.patternViewData
        });
        this._cmbPattern = Ext.create("Common.component.ComboDataView", {
            id: "slide-combo-pattern",
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
                        var props = new CAscSlideProps();
                        var fill = new CAscFill();
                        fill.put_type(c_oAscFill.FILL_TYPE_PATT);
                        fill.put_fill(new CAscFillHatch());
                        fill.get_fill().put_pattern_type(record.data.data.type);
                        if (me.OriginalFillType !== c_oAscFill.FILL_TYPE_PATT) {
                            fill.get_fill().put_color_fg(me.getRgbColor(me.FGColor.Color));
                            fill.get_fill().put_color_bg(me.getRgbColor(me.BGColor.Color));
                        }
                        props.put_background(fill);
                        me.api.SetSlideProps(props);
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
            id: "slide-button-foreground-color",
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
                                var props = new CAscSlideProps();
                                var fill = new CAscFill();
                                fill.put_type(c_oAscFill.FILL_TYPE_PATT);
                                fill.put_fill(new CAscFillHatch());
                                fill.get_fill().put_color_fg(this.getRgbColor(this.FGColor.Color));
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_PATT) {
                                    fill.get_fill().put_pattern_type(this.PatternFillType);
                                    fill.get_fill().put_color_bg(this.getRgbColor(this.BGColor.Color));
                                }
                                props.put_background(fill);
                                this.api.SetSlideProps(props);
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
            id: "slide-button-background-color",
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
                                var props = new CAscSlideProps();
                                var fill = new CAscFill();
                                fill.put_type(c_oAscFill.FILL_TYPE_PATT);
                                fill.put_fill(new CAscFillHatch());
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_PATT) {
                                    fill.get_fill().put_pattern_type(this.PatternFillType);
                                    fill.get_fill().put_color_fg(this.getRgbColor(this.FGColor.Color));
                                }
                                fill.get_fill().put_color_bg(this.getRgbColor(this.BGColor.Color));
                                props.put_background(fill);
                                this.api.SetSlideProps(props);
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
            id: "slide-combo-grad-type",
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
                        var props = new CAscSlideProps();
                        var fill = new CAscFill();
                        fill.put_type(c_oAscFill.FILL_TYPE_GRAD);
                        fill.put_fill(new CAscFillGrad());
                        fill.get_fill().put_grad_type(this.GradFillType);
                        if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                            fill.get_fill().put_linear_angle(viewDataLinear[this.GradLinearDirectionIdx].data.type * 60000);
                            fill.get_fill().put_linear_scale(true);
                        }
                        fill.get_fill().put_positions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                        fill.get_fill().put_colors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                        props.put_background(fill);
                        this.api.SetSlideProps(props);
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
            id: "slide-button-direction",
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
                                var props = new CAscSlideProps();
                                var fill = new CAscFill();
                                fill.put_type(c_oAscFill.FILL_TYPE_GRAD);
                                fill.put_fill(new CAscFillGrad());
                                fill.get_fill().put_grad_type(this.GradFillType);
                                fill.get_fill().put_linear_angle(record.data.data.type * 60000);
                                fill.get_fill().put_linear_scale(true);
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                                    fill.get_fill().put_positions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                                    fill.get_fill().put_colors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                                }
                                props.put_background(fill);
                                this.api.SetSlideProps(props);
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
            id: "slide-button-gradient-color",
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
                                var props = new CAscSlideProps();
                                var fill = new CAscFill();
                                fill.put_type(c_oAscFill.FILL_TYPE_GRAD);
                                fill.put_fill(new CAscFillGrad());
                                fill.get_fill().put_grad_type(this.GradFillType);
                                fill.get_fill().put_colors([this.getRgbColor(this.GradColor.colors[0]), this.getRgbColor(this.GradColor.colors[1])]);
                                if (this.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                                    if (this.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                                        fill.get_fill().put_linear_angle(viewDataLinear[this.GradLinearDirectionIdx].data.type * 60000);
                                        fill.get_fill().put_linear_scale(true);
                                    }
                                    fill.get_fill().put_positions([this.GradColor.values[0] * 1000, this.GradColor.values[1] * 1000]);
                                }
                                props.put_background(fill);
                                this.api.SetSlideProps(props);
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
                var props = new CAscSlideProps();
                var fill = new CAscFill();
                fill.put_type(c_oAscFill.FILL_TYPE_GRAD);
                fill.put_fill(new CAscFillGrad());
                fill.get_fill().put_grad_type(me.GradFillType);
                fill.get_fill().put_positions([me.GradColor.values[0] * 1000, me.GradColor.values[1] * 1000]);
                if (me.OriginalFillType !== c_oAscFill.FILL_TYPE_GRAD) {
                    if (me.GradFillType == c_oAscFillGradType.GRAD_LINEAR) {
                        fill.get_fill().put_linear_angle(viewDataLinear[me.GradLinearDirectionIdx].data.type * 60000);
                        fill.get_fill().put_linear_scale(true);
                    }
                    fill.get_fill().put_colors([me.getRgbColor(me.GradColor.colors[0]), me.getRgbColor(me.GradColor.colors[1])]);
                }
                props.put_background(fill);
                me.api.SetSlideProps(props);
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
        this.fillEffectTypeCombo = function (type) {
            var arr = [];
            switch (type) {
            case c_oAscSlideTransitionTypes.Fade:
                arr.push(me._arrEffectType[0], me._arrEffectType[1]);
                break;
            case c_oAscSlideTransitionTypes.Push:
                arr = me._arrEffectType.slice(2, 6);
                break;
            case c_oAscSlideTransitionTypes.Wipe:
                arr = me._arrEffectType.slice(2, 10);
                break;
            case c_oAscSlideTransitionTypes.Split:
                arr = me._arrEffectType.slice(10, 14);
                break;
            case c_oAscSlideTransitionTypes.UnCover:
                arr = me._arrEffectType.slice(2, 10);
                break;
            case c_oAscSlideTransitionTypes.Cover:
                arr = me._arrEffectType.slice(2, 10);
                break;
            case c_oAscSlideTransitionTypes.Clock:
                arr = me._arrEffectType.slice(14, 17);
                break;
            case c_oAscSlideTransitionTypes.Zoom:
                arr = me._arrEffectType.slice(17);
                break;
            }
            if (arr.length > 0) {
                me.cmbEffectType.getStore().loadData(arr);
                me.cmbEffectType.setValue(arr[0][0]);
                me.EffectType = arr[0][0];
            } else {
                me.cmbEffectType.getStore().removeAll();
                me.EffectType = undefined;
            }
            me.cmbEffectType.setDisabled(arr.length < 1);
        };
        this._arrEffectName = [[c_oAscSlideTransitionTypes.None, this.textNone], [c_oAscSlideTransitionTypes.Fade, this.textFade], [c_oAscSlideTransitionTypes.Push, this.textPush], [c_oAscSlideTransitionTypes.Wipe, this.textWipe], [c_oAscSlideTransitionTypes.Split, this.textSplit], [c_oAscSlideTransitionTypes.UnCover, this.textUnCover], [c_oAscSlideTransitionTypes.Cover, this.textCover], [c_oAscSlideTransitionTypes.Clock, this.textClock], [c_oAscSlideTransitionTypes.Zoom, this.textZoom]];
        this.cmbEffectName = Ext.create("Ext.form.field.ComboBox", {
            id: "slide-combo-effect-name",
            width: 190,
            editable: false,
            store: this._arrEffectName,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    var type = records[0].data.field1;
                    if (this.Effect !== type && !((this.Effect === c_oAscSlideTransitionTypes.Wipe || this.Effect === c_oAscSlideTransitionTypes.UnCover || this.Effect === c_oAscSlideTransitionTypes.Cover) && (type === c_oAscSlideTransitionTypes.Wipe || type === c_oAscSlideTransitionTypes.UnCover || type === c_oAscSlideTransitionTypes.Cover))) {
                        this.fillEffectTypeCombo(type);
                    }
                    this.Effect = type;
                    if (this.api && !this._noApply) {
                        var props = new CAscSlideProps();
                        var timing = new CAscSlideTiming();
                        timing.put_TransitionType(type);
                        timing.put_TransitionOption(this.EffectType);
                        props.put_timing(timing);
                        this.api.SetSlideProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.cmbEffectName.setValue(this._arrEffectName[0][0]);
        this._arrEffectType = [[c_oAscSlideTransitionParams.Fade_Smoothly, this.textSmoothly], [c_oAscSlideTransitionParams.Fade_Through_Black, this.textBlack], [c_oAscSlideTransitionParams.Param_Left, this.textLeft], [c_oAscSlideTransitionParams.Param_Top, this.textTop], [c_oAscSlideTransitionParams.Param_Right, this.textRight], [c_oAscSlideTransitionParams.Param_Bottom, this.textBottom], [c_oAscSlideTransitionParams.Param_TopLeft, this.textTopLeft], [c_oAscSlideTransitionParams.Param_TopRight, this.textTopRight], [c_oAscSlideTransitionParams.Param_BottomLeft, this.textBottomLeft], [c_oAscSlideTransitionParams.Param_BottomRight, this.textBottomRight], [c_oAscSlideTransitionParams.Split_VerticalIn, this.textVerticalIn], [c_oAscSlideTransitionParams.Split_VerticalOut, this.textVerticalOut], [c_oAscSlideTransitionParams.Split_HorizontalIn, this.textHorizontalIn], [c_oAscSlideTransitionParams.Split_HorizontalOut, this.textHorizontalOut], [c_oAscSlideTransitionParams.Clock_Clockwise, this.textClockwise], [c_oAscSlideTransitionParams.Clock_Counterclockwise, this.textCounterclockwise], [c_oAscSlideTransitionParams.Clock_Wedge, this.textWedge], [c_oAscSlideTransitionParams.Zoom_In, this.textZoomIn], [c_oAscSlideTransitionParams.Zoom_Out, this.textZoomOut], [c_oAscSlideTransitionParams.Zoom_AndRotate, this.textZoomRotate]];
        this.cmbEffectType = Ext.create("Ext.form.field.ComboBox", {
            id: "slide-combo-effect-type",
            width: 190,
            editable: false,
            store: [[c_oAscSlideTransitionParams.Fade_Smoothly, this.textSmoothly]],
            queryMode: "local",
            triggerAction: "all",
            disabled: true,
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    var type = records[0].data.field1;
                    this.EffectType = type;
                    if (this.api && !this._noApply) {
                        var props = new CAscSlideProps();
                        var timing = new CAscSlideTiming();
                        timing.put_TransitionType(this.Effect);
                        timing.put_TransitionOption(this.EffectType);
                        props.put_timing(timing);
                        this.api.SetSlideProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.cmbEffectName.setValue("");
        this.chStartOnClick = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "slide-checkbox-start-click",
            boxLabel: this.strStartOnClick,
            colspan: 2,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api && !this._noApply) {
                        var props = new CAscSlideProps();
                        var timing = new CAscSlideTiming();
                        timing.put_SlideAdvanceOnMouseClick(field.getValue() == "checked");
                        props.put_timing(timing);
                        this.api.SetSlideProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.chDelay = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "slide-checkbox-delay",
            boxLabel: this.strDelay,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    this.numDelay.setDisabled(field.getValue() !== "checked");
                    if (this.api && !this._noApply) {
                        var props = new CAscSlideProps();
                        var timing = new CAscSlideTiming();
                        timing.put_SlideAdvanceAfter(field.getValue() == "checked");
                        props.put_timing(timing);
                        this.api.SetSlideProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.numDuration = Ext.create("Common.component.MetricSpinner", {
            id: "slide-duration",
            readOnly: false,
            step: 1,
            width: 65,
            defaultUnit: "s",
            value: "2 s",
            maxValue: 300,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api && !this._noApply) {
                        var props = new CAscSlideProps();
                        var timing = new CAscSlideTiming();
                        timing.put_TransitionDuration(field.getNumberValue() * 1000);
                        props.put_timing(timing);
                        this.api.SetSlideProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.numDelay = Ext.create("Common.component.MetricSpinner", {
            id: "slide-delay",
            readOnly: false,
            step: 1,
            width: 70,
            defaultUnit: "s",
            value: "2 s",
            maxValue: 300,
            minValue: 0,
            disabled: true,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api && !this._noApply) {
                        var props = new CAscSlideProps();
                        var timing = new CAscSlideTiming();
                        timing.put_SlideAdvanceDuration(field.getNumberValue() * 1000);
                        props.put_timing(timing);
                        this.api.SetSlideProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.btnPreview = Ext.create("Ext.Button", {
            id: "slide-button-preview",
            text: this.textPreview,
            width: 70,
            listeners: {
                click: function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        this.api.SlideTransitionPlay();
                    }
                    this.fireEvent("editcomplete", this);
                },
                scope: this
            }
        });
        this.btnApplyToAll = Ext.create("Ext.Button", {
            id: "slide-button-apply-all",
            text: this.textApplyAll,
            width: 190,
            listeners: {
                click: function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        this.api.SlideTimingApplyToAll();
                    }
                    this.fireEvent("editcomplete", this);
                },
                scope: this
            }
        });
        this._TransitionPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 250,
            width: 190,
            items: [{
                xtype: "label",
                text: this.strEffect,
                style: "margin-top: 1px;font-weight: bold;"
            },
            {
                xtype: "tbspacer",
                height: 7
            },
            this.cmbEffectName, {
                xtype: "tbspacer",
                height: 7
            },
            this.cmbEffectType, {
                xtype: "tbspacer",
                height: 7
            },
            {
                xtype: "container",
                width: 190,
                layout: {
                    type: "table",
                    columns: 2
                },
                items: [{
                    xtype: "container",
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    width: 120,
                    items: [{
                        xtype: "label",
                        text: this.strDuration
                    },
                    {
                        xtype: "tbspacer",
                        width: 5
                    },
                    this.numDuration]
                },
                this.btnPreview, {
                    xtype: "tbspacer",
                    height: 10,
                    colspan: 2
                },
                {
                    xtype: "tbspacer",
                    width: 190,
                    height: 10,
                    colspan: 2,
                    html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
                },
                this.chStartOnClick, {
                    xtype: "tbspacer",
                    height: 5,
                    colspan: 2
                },
                this.chDelay, this.numDelay]
            },
            {
                xtype: "tbspacer",
                height: 7
            },
            {
                xtype: "tbspacer",
                width: "100%",
                height: 10,
                html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
            },
            {
                xtype: "tbspacer",
                height: 3
            },
            this.btnApplyToAll]
        });
        this.items = [{
            xtype: "tbspacer",
            height: 7
        },
        this._FillPanel, {
            xtype: "tbspacer",
            height: 7
        },
        this._FillColorContainer, this._FillImageContainer, this._PatternContainer, this._GradientContainer, {
            xtype: "tbspacer",
            height: 7
        },
        this._TransitionPanel];
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.SetInterfaceDrawImagePlaceSlide("slide-texture-img");
            var textures = this.api.get_PropertyStandartTextures();
            if (textures) {
                this._onInitStandartTextures(textures);
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
    _onOpenImageFromURL: function (mr) {
        var self = this[0];
        var url = this[1].txtUrl;
        if (mr == 1 && self.api) {
            var checkurl = url.value.replace(/ /g, "");
            if (checkurl != "") {
                if (self.BlipFillType !== null) {
                    var props = new CAscSlideProps();
                    var fill = new CAscFill();
                    fill.put_type(c_oAscFill.FILL_TYPE_BLIP);
                    fill.put_fill(new CAscFillBlip());
                    fill.get_fill().put_type(self.BlipFillType);
                    fill.get_fill().put_url(url.value);
                    props.put_background(fill);
                    self.api.SetSlideProps(props);
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
        if (props) {
            this._originalProps = props;
            this.SuspendEvents();
            this._noApply = true;
            var rec = null;
            var fill = props.get_background();
            var fill_type = fill.get_type();
            var color = null;
            if (fill === null || fill_type === null || fill_type == c_oAscFill.FILL_TYPE_NOFILL) {
                this.OriginalFillType = c_oAscFill.FILL_TYPE_NOFILL;
            } else {
                if (fill_type == c_oAscFill.FILL_TYPE_SOLID) {
                    fill = fill.get_fill();
                    color = fill.get_color();
                    if (color) {
                        if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                            this.SlideColor = {
                                Value: 1,
                                Color: {
                                    color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                    effectValue: color.get_value()
                                }
                            };
                        } else {
                            this.SlideColor = {
                                Value: 1,
                                Color: this.getHexColor(color.get_r(), color.get_g(), color.get_b())
                            };
                        }
                    } else {
                        this.SlideColor = {
                            Value: 0,
                            Color: "transparent"
                        };
                    }
                    this.FGColor = (this.SlideColor.Color !== "transparent") ? {
                        Value: 1,
                        Color: this.colorValue2EffectId(this.SlideColor.Color)
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
                        fill = fill.get_fill();
                        this.BlipFillType = fill.get_type();
                        if (this.BlipFillType == c_oAscFillBlipType.STRETCH) {
                            this.cmbFillType.setValue(this._arrFillType[0]);
                        } else {
                            if (this.BlipFillType == c_oAscFillBlipType.TILE) {
                                this.cmbFillType.setValue(this._arrFillType[1]);
                            } else {
                                this.cmbFillType.setValue("");
                            }
                        }
                        this.OriginalFillType = c_oAscFill.FILL_TYPE_BLIP;
                    } else {
                        if (fill_type == c_oAscFill.FILL_TYPE_PATT) {
                            fill = fill.get_fill();
                            this.PatternFillType = fill.get_pattern_type();
                            if (this._state.PatternFillType !== this.PatternFillType) {
                                var styleIndex = this._cmbPattern.dataMenu.picker.store.findBy(function (record, id) {
                                    return (record.data.data.type === this.PatternFillType);
                                },
                                this);
                                this._cmbPattern.selectByIndex(styleIndex);
                                this._state.PatternFillType = this.PatternFillType;
                            }
                            color = fill.get_color_fg();
                            if (color) {
                                if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                    this.FGColor = {
                                        Value: 1,
                                        Color: {
                                            color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                            effectValue: color.get_value()
                                        }
                                    };
                                } else {
                                    this.FGColor = {
                                        Value: 1,
                                        Color: this.getHexColor(color.get_r(), color.get_g(), color.get_b())
                                    };
                                }
                            } else {
                                this.FGColor = {
                                    Value: 1,
                                    Color: "000000"
                                };
                            }
                            color = fill.get_color_bg();
                            if (color) {
                                if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                    this.BGColor = {
                                        Value: 1,
                                        Color: {
                                            color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                            effectValue: color.get_value()
                                        }
                                    };
                                } else {
                                    this.BGColor = {
                                        Value: 1,
                                        Color: this.getHexColor(color.get_r(), color.get_g(), color.get_b())
                                    };
                                }
                            } else {
                                this.BGColor = {
                                    Value: 1,
                                    Color: "ffffff"
                                };
                            }
                            this.OriginalFillType = c_oAscFill.FILL_TYPE_PATT;
                            this.SlideColor = (this.FGColor.Color !== "transparent") ? {
                                Value: 1,
                                Color: this.colorValue2EffectId(this.FGColor.Color)
                            } : {
                                Value: 1,
                                Color: "ffffff"
                            };
                        } else {
                            if (fill_type == c_oAscFill.FILL_TYPE_GRAD) {
                                fill = fill.get_fill();
                                this.GradFillType = fill.get_grad_type();
                                if (this._state.GradFillType !== this.GradFillType) {
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
                                    var value = Math.floor(fill.get_linear_angle() / 60000);
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
                                var colors = fill.get_colors();
                                if (colors && colors.length > 0) {
                                    color = colors[0];
                                    if (color) {
                                        if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                            this.GradColor.colors[0] = {
                                                color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                                effectValue: color.get_value()
                                            };
                                            this.colorValue2EffectId(this.GradColor.colors[0]);
                                        } else {
                                            this.GradColor.colors[0] = this.getHexColor(color.get_r(), color.get_g(), color.get_b());
                                        }
                                    } else {
                                        this.GradColor.colors[0] = "000000";
                                    }
                                    color = colors[1];
                                    if (color) {
                                        if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                                            this.GradColor.colors[1] = {
                                                color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                                                effectValue: color.get_value()
                                            };
                                            this.colorValue2EffectId(this.GradColor.colors[1]);
                                        } else {
                                            this.GradColor.colors[1] = this.getHexColor(color.get_r(), color.get_g(), color.get_b());
                                        }
                                    } else {
                                        this.GradColor.colors[1] = "ffffff";
                                    }
                                }
                                var positions = fill.get_positions();
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
            var type1 = typeof(this.SlideColor.Color),
            type2 = typeof(this._state.SlideColor);
            if ((type1 !== type2) || (type1 == "object" && (this.SlideColor.Color.effectValue !== this._state.SlideColor.effectValue || this._state.SlideColor.color.indexOf(this.SlideColor.Color.color) < 0)) || (type1 != "object" && this._state.SlideColor.indexOf(this.SlideColor.Color) < 0)) {
                this._btnBackColor.setColor(this.SlideColor.Color);
                if (typeof(this.SlideColor.Color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.SlideColor.Color.effectValue) {
                            this.colorsBack.select(this.SlideColor.Color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsBack.select(this.SlideColor.Color, false);
                }
                this._state.SlideColor = this.SlideColor.Color;
            }
            var timing = props.get_timing();
            if (timing) {
                var value = timing.get_TransitionType();
                var found = false;
                if (this._state.Effect !== value) {
                    for (var i = 0; i < this._arrEffectName.length; i++) {
                        if (value === this._arrEffectName[i][0]) {
                            this.cmbEffectName.setValue(this._arrEffectName[i][0]);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        this.cmbEffectName.setValue("");
                    }
                    this.fillEffectTypeCombo(found ? value : undefined);
                    this.Effect = value;
                    this._state.Effect = value;
                }
                value = timing.get_TransitionOption();
                if (this._state.EffectType !== value || found) {
                    found = false;
                    for (var i = 0; i < this._arrEffectType.length; i++) {
                        if (value === this._arrEffectType[i][0]) {
                            this.cmbEffectType.setValue(this._arrEffectType[i][0]);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        this.cmbEffectType.setValue("");
                    }
                    this._state.EffectType = value;
                }
                value = timing.get_TransitionDuration();
                if (Math.abs(this._state.Duration - value) > 0.001 || (this._state.Duration === null || value === null) && (this._state.Duration !== value) || (this._state.Duration === undefined || value === undefined) && (this._state.Duration !== value)) {
                    this.numDuration.setValue((value !== null && value !== undefined) ? value / 1000 : "");
                    this._state.Duration = value;
                }
                value = timing.get_SlideAdvanceDuration();
                if (Math.abs(this._state.Delay - value) > 0.001 || (this._state.Delay === null || value === null) && (this._state.Delay !== value) || (this._state.Delay === undefined || value === undefined) && (this._state.Delay !== value)) {
                    this.numDelay.setValue((value !== null && value !== undefined) ? value / 1000 : "");
                    this._state.Delay = value;
                }
                value = timing.get_SlideAdvanceOnMouseClick();
                if (this._state.OnMouseClick !== value) {
                    this.chStartOnClick.setValue((value !== null && value !== undefined) ? value : "indeterminate");
                    this._state.OnMouseClick = value;
                }
                value = timing.get_SlideAdvanceAfter();
                if (this._state.AdvanceAfter !== value) {
                    this.chDelay.setValue((value !== null && value !== undefined) ? value : "indeterminate");
                    this._state.AdvanceAfter = value;
                }
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
            this.colorsBack.updateColors(effectcolors, standartcolors);
            this.colorsFG.updateColors(effectcolors, standartcolors);
            this.colorsBG.updateColors(effectcolors, standartcolors);
            this.colorsGrad.updateColors(effectcolors, standartcolors);
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
                        imageUrl: item.get_image(),
                        name: me.textureNames[item.get_id()],
                        data: {
                            type: item.get_id()
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
        this._btnBackColor.hideMenu();
        this._btnTexture.hideMenu();
        this._btnBGColor.hideMenu();
        this._btnFGColor.hideMenu();
        this._cmbPattern.dataMenu.hide();
        this.btnDirection.hideMenu();
        this._btnGradColor.hideMenu();
    },
    setSlideDisabled: function (background, effects, timing) {
        if (background !== this._stateDisabled.background) {
            this.cmbFillSrc.setDisabled(background);
            this._FillColorContainer.setDisabled(background);
            this._FillImageContainer.setDisabled(background);
            this._PatternContainer.setDisabled(background);
            this._GradientContainer.setDisabled(background);
            this._stateDisabled.background = background;
        }
        if (effects !== this._stateDisabled.effects) {
            this.cmbEffectName.setDisabled(effects);
            this.cmbEffectType.setDisabled(effects);
            this.numDuration.setDisabled(effects);
            this.btnPreview.setDisabled(effects);
            this._stateDisabled.effects = effects;
        }
        if (timing !== this._stateDisabled.timing) {
            this.chStartOnClick.setDisabled(timing);
            this.chDelay.setDisabled(timing);
            this.numDelay.setDisabled(timing);
            this.btnApplyToAll.setDisabled(timing);
            this._stateDisabled.timing = timing;
        }
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
        if (this.effectcolors && this.standartcolors) {
            this.colorsBack.updateColors(this.effectcolors, this.standartcolors);
            this.colorsFG.updateColors(this.effectcolors, this.standartcolors);
            this.colorsBG.updateColors(this.effectcolors, this.standartcolors);
            this.colorsGrad.updateColors(this.effectcolors, this.standartcolors);
        }
    },
    txtTitle: "Slide",
    strColor: "Color",
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
    textNoFill: "No Fill",
    textSelectTexture: "Select",
    textNone: "None",
    textFade: "Fade",
    textPush: "Push",
    textWipe: "Wipe",
    textSplit: "Split",
    textUnCover: "UnCover",
    textCover: "Cover",
    textClock: "Clock",
    textZoom: "Zoom",
    textSmoothly: "Smoothly",
    textBlack: "Through Black",
    textLeft: "Left",
    textTop: "Top",
    textRight: "Right",
    textBottom: "Bottom",
    textTopLeft: "Top-Left",
    textTopRight: "Top-Right",
    textBottomLeft: "Bottom-Left",
    textBottomRight: "Bottom-Right",
    textVerticalIn: "Vertical In",
    textVerticalOut: "Vertical Out",
    textHorizontalIn: "Horizontal In",
    textHorizontalOut: "Horizontal Out",
    textClockwise: "Clockwise",
    textCounterclockwise: "Counterclockwise",
    textWedge: "Wedge",
    textZoomIn: "Zoom In",
    textZoomOut: "Zoom Out",
    textZoomRotate: "Zoom and Rotate",
    strStartOnClick: "Start On Click",
    strDelay: "Delay",
    textApplyAll: "Apply to All Slides",
    textPreview: "Preview",
    strEffect: "Effect",
    strDuration: "Duration",
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