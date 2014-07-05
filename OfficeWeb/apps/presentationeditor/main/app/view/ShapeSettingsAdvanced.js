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
 Ext.define("PE.view.ShapeSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.peshapesettingsadvanced",
    requires: ["Ext.form.field.ComboBox", "Ext.window.Window", "Ext.data.Model", "Ext.data.Store", "Ext.Array", "Ext.button.Button"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 340,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._originalProps = null;
        this._changedProps = null;
        this._beginSizeIdx = 0;
        this._endSizeIdx = 0;
        this._nRatio = 1;
        this._spnWidth = Ext.create("Common.component.MetricSpinner", {
            id: "shape-advanced-spin-width",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._btnRatio.pressed) {
                        var w = field.getNumberValue();
                        var h = w / this._nRatio;
                        if (h > this._spnHeight.maxValue) {
                            h = this._spnHeight.maxValue;
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
            id: "shape-advanced-span-height",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 100,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    var h = field.getNumberValue(),
                    w = null;
                    if (this._btnRatio.pressed) {
                        w = h * this._nRatio;
                        if (w > this._spnWidth.maxValue) {
                            w = this._spnWidth.maxValue;
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
        this._btnRatio = Ext.create("Ext.Button", {
            id: "shape-advanced-button-ratio",
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
        this._arrCapType = [[c_oAscLineCapType.Flat, this.textFlat], [c_oAscLineCapType.Round, this.textRound], [c_oAscLineCapType.Square, this.textSquare]];
        this.cmbCapType = Ext.create("Ext.form.field.ComboBox", {
            id: "shape-advanced-cap-type",
            width: 100,
            editable: false,
            store: this._arrCapType,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_stroke() === null) {
                            this._changedProps.put_stroke(new CAscStroke());
                        }
                        this._changedProps.get_stroke().put_linecap(me._arrCapType[records[0].index][0]);
                    }
                },
                this)
            }
        });
        this.cmbCapType.setValue(this._arrCapType[0][1]);
        this._arrJoinType = [[c_oAscLineJoinType.Round, this.textRound], [c_oAscLineJoinType.Bevel, this.textBevel], [c_oAscLineJoinType.Miter, this.textMiter]];
        this.cmbJoinType = Ext.create("Ext.form.field.ComboBox", {
            id: "shape-advanced-join-type",
            width: 100,
            editable: false,
            store: this._arrJoinType,
            queryMode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_stroke() === null) {
                            this._changedProps.put_stroke(new CAscStroke());
                        }
                        this._changedProps.get_stroke().put_linejoin(me._arrJoinType[records[0].index][0]);
                    }
                },
                this)
            }
        });
        this.cmbJoinType.setValue(this._arrJoinType[0][1]);
        this.styleURL = "resources/img/right-panels/Begin-EndStyle.png";
        this.styleURL2x = "resources/img/right-panels/Begin-EndStyle@2x.png";
        var _arrStyles = [],
        _arrSize = [];
        var _styleTypes = [c_oAscLineBeginType.None, c_oAscLineBeginType.Triangle, c_oAscLineBeginType.Arrow, c_oAscLineBeginType.Stealth, c_oAscLineBeginType.Diamond, c_oAscLineBeginType.Oval];
        var _sizeTypes = [c_oAscLineBeginSize.small_small, c_oAscLineBeginSize.small_mid, c_oAscLineBeginSize.small_large, c_oAscLineBeginSize.mid_small, c_oAscLineBeginSize.mid_mid, c_oAscLineBeginSize.mid_large, c_oAscLineBeginSize.large_small, c_oAscLineBeginSize.large_mid, c_oAscLineBeginSize.large_large];
        for (var i = 0; i < 6; i++) {
            var item = {
                value: i,
                imagewidth: 44,
                imageheight: 20,
                offsetx: 80 * i + 10,
                offsety: 0
            };
            item.borderstyle = Ext.String.format("background:url({0}) {3}px {4}px; width:{1}px; height:{2}px; background-image: -webkit-image-set(url({0}) 1x, url({5}) 2x);", this.styleURL, item.imagewidth, item.imageheight, -item.offsetx, -item.offsety, this.styleURL2x);
            _arrStyles.push(item);
        }
        _arrStyles[0].type = c_oAscLineBeginType.None;
        _arrStyles[1].type = c_oAscLineBeginType.Triangle;
        _arrStyles[2].type = c_oAscLineBeginType.Arrow;
        _arrStyles[3].type = c_oAscLineBeginType.Stealth;
        _arrStyles[4].type = c_oAscLineBeginType.Diamond;
        _arrStyles[5].type = c_oAscLineBeginType.Oval;
        for (i = 0; i < 9; i++) {
            var item = {
                value: i,
                imagewidth: 44,
                imageheight: 20,
                offsetx: 80 + 10,
                offsety: 20 * (i + 1)
            };
            item.borderstyle = Ext.String.format("background:url({0}) {3}px {4}px; width:{1}px; height:{2}px; background-image: -webkit-image-set(url({0}) 1x, url({5}) 2x);", this.styleURL, item.imagewidth, item.imageheight, -item.offsetx, -item.offsety, this.styleURL2x);
            _arrSize.push(item);
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
        var beginStyleStore = Ext.create("Ext.data.Store", {
            model: "PE.model.ModelBorders",
            data: _arrStyles
        });
        var beginSizeStore = Ext.create("Ext.data.Store", {
            model: "PE.model.ModelBorders",
            data: _arrSize
        });
        for (i = 0; i < _arrStyles.length; i++) {
            var item = _arrStyles[i];
            item.borderstyle = Ext.String.format("background:url({0}) {3}px {4}px; width:{1}px; height:{2}px; background-image: -webkit-image-set(url({0}) 1x, url({5}) 2x);", this.styleURL, item.imagewidth, item.imageheight, -item.offsetx, -(item.offsety + 200), this.styleURL2x);
        }
        for (i = 0; i < _arrSize.length; i++) {
            var item = _arrSize[i];
            item.borderstyle = Ext.String.format("background:url({0}) {3}px {4}px; width:{1}px; height:{2}px; background-image: -webkit-image-set(url({0}) 1x, url({5}) 2x);", this.styleURL, item.imagewidth, item.imageheight, -item.offsetx, -(item.offsety + 200), this.styleURL2x);
        }
        var endStyleStore = Ext.create("Ext.data.Store", {
            model: "PE.model.ModelBorders",
            data: _arrStyles
        });
        var endSizeStore = Ext.create("Ext.data.Store", {
            model: "PE.model.ModelBorders",
            data: _arrSize
        });
        this._updateSizeArr = function (sizecombo, record, type, sizeidx) {
            var style = Ext.String.format("background:url({0}) repeat scroll 0 -1px", "resources/img/controls/text-bg.gif");
            if (record.data.value > 0) {
                for (var i = 0; i < _arrSize.length; i++) {
                    _arrSize[i].offsetx = record.data.value * 80 + 10;
                    _arrSize[i].borderstyle = Ext.String.format("background:url({0}) {3}px {4}px; width:{1}px; height:{2}px; background-image: -webkit-image-set(url({0}) 1x, url({5}) 2x);", me.styleURL, _arrSize[i].imagewidth, _arrSize[i].imageheight, -_arrSize[i].offsetx, -(_arrSize[i].offsety + 200 * type), this.styleURL2x);
                }
                sizecombo.menu.picker.store.loadData(_arrSize);
                sizecombo.setDisabled(false);
                if (sizeidx !== null) {
                    sizecombo.menu.picker.selectByIndex(sizeidx, true);
                    me._selectStyleItem(sizecombo, sizecombo.menu.picker.store.getAt(sizeidx), type);
                } else {
                    Ext.DomHelper.applyStyles(sizecombo.btnEl, style);
                }
            } else {
                Ext.DomHelper.applyStyles(sizecombo.btnEl, style);
                sizecombo.setDisabled(true);
            }
        };
        this._selectStyleItem = function (stylecombo, record, type) {
            var style;
            if (stylecombo.btnEl) {
                style = Ext.String.format("background:url({0}) repeat scroll {1}px {2}px, url({3}) repeat scroll 0 -1px;", me.styleURL, -(record.data.offsetx - 20), -(record.data.offsety + 200 * type), "resources/img/controls/text-bg.gif");
                style += Ext.String.format("background-image: -webkit-image-set(url({0}) 1x, url({1}) 2x), -webkit-image-set(url({2}) 1x, url({3}) 2x);", me.styleURL, me.styleURL2x, "resources/img/controls/text-bg.gif", "resources/img/controls/text-bg@2x.gif");
                Ext.DomHelper.applyStyles(stylecombo.btnEl, style);
            }
        };
        var endStyleTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" align="left" style="{borderstyle}"" />', "</div>", "</tpl>");
        this._btnBeginStyle = Ext.create("Ext.button.Button", {
            width: 100,
            cls: "btn-combo-style",
            pressedCls: "",
            menu: this.BeginStyleMenu = Ext.create("Common.component.MenuDataViewPicker", {
                width: 115,
                height: 92,
                cls: "arrow-view",
                dataTpl: endStyleTpl,
                viewData: [],
                store: beginStyleStore,
                contentWidth: 95,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        if (me._changedProps) {
                            if (this._changedProps.get_stroke() === null) {
                                this._changedProps.put_stroke(new CAscStroke());
                            }
                            this._changedProps.get_stroke().put_linebeginstyle(record.data.type);
                        }
                        if (this._beginSizeIdx === null || this._beginSizeIdx === undefined) {
                            this._beginSizeIdx = 4;
                        }
                        me._updateSizeArr(me._btnBeginSize, record, 0, this._beginSizeIdx);
                        me._selectStyleItem(me._btnBeginStyle, record, 0);
                    },
                    me),
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    }
                }
            }),
            listeners: {
                afterRender: function () {
                    me._selectStyleItem(this, this.menu.picker.store.getAt(1), 0);
                }
            }
        });
        this._btnEndStyle = Ext.create("Ext.button.Button", {
            width: 100,
            cls: "btn-combo-style",
            pressedCls: "",
            menu: this.EndStyleMenu = Ext.create("Common.component.MenuDataViewPicker", {
                width: 115,
                height: 92,
                cls: "arrow-view",
                dataTpl: endStyleTpl,
                viewData: [],
                store: endStyleStore,
                contentWidth: 95,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        if (me._changedProps) {
                            if (this._changedProps.get_stroke() === null) {
                                this._changedProps.put_stroke(new CAscStroke());
                            }
                            this._changedProps.get_stroke().put_lineendstyle(record.data.type);
                        }
                        if (this._endSizeIdx === null || this._endSizeIdx === undefined) {
                            this._endSizeIdx = 4;
                        }
                        me._updateSizeArr(me._btnEndSize, record, 1, this._endSizeIdx);
                        me._selectStyleItem(me._btnEndStyle, record, 1);
                    },
                    me),
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    }
                }
            }),
            listeners: {
                afterRender: function () {
                    me._selectStyleItem(this, this.menu.picker.store.getAt(1), 1);
                }
            }
        });
        this._btnBeginSize = Ext.create("Ext.button.Button", {
            width: 100,
            cls: "btn-combo-style",
            pressedCls: "",
            menu: this.BeginSizeMenu = Ext.create("Common.component.MenuDataViewPicker", {
                width: 167,
                height: 92,
                cls: "arrow-view",
                dataTpl: endStyleTpl,
                viewData: [],
                store: beginSizeStore,
                contentWidth: 147,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        if (me._changedProps) {
                            if (this._changedProps.get_stroke() === null) {
                                this._changedProps.put_stroke(new CAscStroke());
                            }
                            this._changedProps.get_stroke().put_linebeginsize(record.data.type);
                        }
                        this._beginSizeIdx = record.data.value;
                        me._selectStyleItem(me._btnBeginSize, record, 0);
                    },
                    me),
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    }
                }
            }),
            listeners: {
                afterRender: function () {
                    me._selectStyleItem(this, this.menu.picker.store.getAt(1), 0);
                }
            }
        });
        this._btnEndSize = Ext.create("Ext.button.Button", {
            width: 100,
            cls: "btn-combo-style",
            pressedCls: "",
            menu: this.BeginSizeMenu = Ext.create("Common.component.MenuDataViewPicker", {
                width: 167,
                height: 92,
                cls: "arrow-view",
                dataTpl: endStyleTpl,
                viewData: [],
                store: endSizeStore,
                contentWidth: 147,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        if (me._changedProps) {
                            if (this._changedProps.get_stroke() === null) {
                                this._changedProps.put_stroke(new CAscStroke());
                            }
                            this._changedProps.get_stroke().put_lineendsize(record.data.type);
                        }
                        this._endSizeIdx = record.data.value;
                        me._selectStyleItem(me._btnEndSize, record, 1);
                    },
                    me),
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    }
                }
            }),
            listeners: {
                afterRender: function () {
                    me._selectStyleItem(this, this.menu.picker.store.getAt(1), 1);
                }
            }
        });
        this._spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            id: "shape-advanced-margin-top",
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
                        if (this._changedProps.get_paddings() === null || this._changedProps.get_paddings() === undefined) {
                            this._changedProps.put_paddings(new CPaddings());
                        }
                        this._changedProps.get_paddings().put_Top(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnMarginBottom = Ext.create("Common.component.MetricSpinner", {
            id: "shape-advanced-margin-bottom",
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
                        if (this._changedProps.get_paddings() === null || this._changedProps.get_paddings() === undefined) {
                            this._changedProps.put_paddings(new CPaddings());
                        }
                        this._changedProps.get_paddings().put_Bottom(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnMarginLeft = Ext.create("Common.component.MetricSpinner", {
            id: "shape-advanced-margin-left",
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
                        if (this._changedProps.get_paddings() === null || this._changedProps.get_paddings() === undefined) {
                            this._changedProps.put_paddings(new CPaddings());
                        }
                        this._changedProps.get_paddings().put_Left(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spnMarginRight = Ext.create("Common.component.MetricSpinner", {
            id: "shape-advanced-margin-right",
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
                        if (this._changedProps.get_paddings() === null || this._changedProps.get_paddings() === undefined) {
                            this._changedProps.put_paddings(new CPaddings());
                        }
                        this._changedProps.get_paddings().put_Right(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
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
            toggleGroup: "shapeadvanced",
            pressed: true,
            card: "card-size",
            listeners: {
                click: _changeCard
            }
        });
        this.btnShape = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.textWeightArrows,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "shapeadvanced",
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
            toggleGroup: "shapeadvanced",
            card: "card-margins",
            listeners: {
                click: _changeCard
            }
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
                    width: 128,
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
                        width: 128,
                        layout: {
                            type: "hbox"
                        },
                        items: [this._spnWidth, this._btnRatio]
                    }]
                },
                {
                    width: 175,
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
                        width: 175,
                        layout: {
                            type: "hbox"
                        },
                        items: [this._spnHeight]
                    }]
                }]
            }]
        };
        var cntrShape = {
            xtype: "container",
            itemId: "card-shape",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textLineStyle
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 40,
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
                    text: this.textCapType,
                    width: 85
                },
                {
                    xtype: "label",
                    text: this.textJoinType,
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
                this.cmbCapType, this.cmbJoinType]
            },
            this._spacer.cloneConfig({
                style: "margin: 16px 0 11px 0;",
                height: 6
            }), {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textArrows
            },
            {
                xtype: "tbspacer",
                height: 8
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
                    text: this.textBeginStyle,
                    width: 85
                },
                {
                    xtype: "label",
                    text: this.textEndStyle,
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
                this._btnBeginStyle, this._btnEndStyle, {
                    xtype: "tbspacer",
                    height: 5
                },
                {
                    xtype: "tbspacer",
                    height: 5
                },
                {
                    xtype: "label",
                    text: this.textBeginSize,
                    width: 85
                },
                {
                    xtype: "label",
                    text: this.textEndSize,
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
                this._btnBeginSize, this._btnEndSize]
            }]
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
            items: [cntrSize, cntrShape, cntrMargins]
        });
        this.items = [{
            xtype: "container",
            height: 244,
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
        this._setDefaults(this._originalProps);
        this.setTitle(this.textTitle);
    },
    setSettings: function (props) {
        this._originalProps = props;
        this._changedProps = null;
    },
    _setDefaults: function (props) {
        if (props) {
            var stroke = props.get_stroke();
            if (stroke) {
                var value = stroke.get_linejoin();
                for (var i = 0; i < this._arrJoinType.length; i++) {
                    if (value == this._arrJoinType[i][0]) {
                        this.cmbJoinType.setValue(this._arrJoinType[i][1]);
                        break;
                    }
                }
                value = stroke.get_linecap();
                for (i = 0; i < this._arrCapType.length; i++) {
                    if (value == this._arrCapType[i][0]) {
                        this.cmbCapType.setValue(this._arrCapType[i][1]);
                        break;
                    }
                }
                var canchange = stroke.get_canChangeArrows();
                this._btnBeginStyle.setDisabled(!canchange);
                this._btnEndStyle.setDisabled(!canchange);
                this._btnBeginSize.setDisabled(!canchange);
                this._btnEndSize.setDisabled(!canchange);
                var style = Ext.String.format("background:url({0}) repeat scroll 0 -1px", "resources/img/controls/text-bg.gif");
                if (canchange) {
                    value = stroke.get_linebeginsize();
                    var rec = this._btnBeginSize.menu.picker.store.findRecord("type", value);
                    if (rec !== null) {
                        this._beginSizeIdx = rec.data.value;
                    } else {
                        this._beginSizeIdx = null;
                        Ext.DomHelper.applyStyles(this._btnBeginSize.btnEl, style);
                    }
                    value = stroke.get_linebeginstyle();
                    rec = this._btnBeginStyle.menu.picker.store.findRecord("type", value);
                    if (rec !== null) {
                        this._btnBeginStyle.menu.picker.selectByIndex(rec.data.value, false);
                        this._updateSizeArr(this._btnBeginSize, rec, 0, this._beginSizeIdx);
                        this._selectStyleItem(this._btnBeginStyle, rec, 0);
                    } else {
                        Ext.DomHelper.applyStyles(this._btnBeginStyle.btnEl, style);
                    }
                    value = stroke.get_lineendsize();
                    rec = this._btnEndSize.menu.picker.store.findRecord("type", value);
                    if (rec !== null) {
                        this._endSizeIdx = rec.data.value;
                    } else {
                        this._endSizeIdx = null;
                        Ext.DomHelper.applyStyles(this._btnEndSize.btnEl, style);
                    }
                    value = stroke.get_lineendstyle();
                    rec = this._btnEndStyle.menu.picker.store.findRecord("type", value);
                    if (rec !== null) {
                        this._btnEndStyle.menu.picker.selectByIndex(rec.data.value, false);
                        this._updateSizeArr(this._btnEndSize, rec, 1, this._endSizeIdx);
                        this._selectStyleItem(this._btnEndStyle, rec, 1);
                    } else {
                        Ext.DomHelper.applyStyles(this._btnEndStyle.btnEl, style);
                    }
                } else {
                    Ext.DomHelper.applyStyles(this._btnBeginStyle.btnEl, style);
                    Ext.DomHelper.applyStyles(this._btnEndStyle.btnEl, style);
                    Ext.DomHelper.applyStyles(this._btnBeginSize.btnEl, style);
                    Ext.DomHelper.applyStyles(this._btnEndSize.btnEl, style);
                }
            }
            this._spnWidth.suspendEvents(false);
            this._spnHeight.suspendEvents(false);
            this._spnWidth.setValue(Common.MetricSettings.fnRecalcFromMM(props.get_Width()).toFixed(2));
            this._spnHeight.setValue(Common.MetricSettings.fnRecalcFromMM(props.get_Height()).toFixed(2));
            this._spnWidth.resumeEvents();
            this._spnHeight.resumeEvents();
            if (props.get_Height() > 0) {
                this._nRatio = props.get_Width() / props.get_Height();
            }
            value = window.localStorage.getItem("pe-settings-shaperatio");
            if (value !== null && parseInt(value) == 1) {
                this._btnRatio.toggle(true);
            }
            var margins = props.get_paddings();
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
        }
        this._changedProps = new CAscShapeProp();
    },
    getSettings: function () {
        window.localStorage.setItem("pe-settings-shaperatio", (this._btnRatio.pressed) ? 1 : 0);
        return this._changedProps;
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
    },
    textRound: "Round",
    textMiter: "Miter",
    textSquare: "Square",
    textFlat: "Flat",
    textBevel: "Bevel",
    textTitle: "Shape - Advanced Settings",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtNone: "None",
    textWeightArrows: "Weights & Arrows",
    textArrows: "Arrows",
    textLineStyle: "Line Style",
    textCapType: "Cap Type",
    textJoinType: "Join Type",
    textBeginStyle: "Begin Style",
    textBeginSize: "Begin Size",
    textEndStyle: "End Style",
    textEndSize: "End Size",
    textSize: "Size",
    textWidth: "Width",
    textHeight: "Height",
    textKeepRatio: "Constant Proportions",
    textTop: "Top",
    textLeft: "Left",
    textBottom: "Bottom",
    textRight: "Right",
    strMargins: "Margins"
});