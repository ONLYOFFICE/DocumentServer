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
 Ext.define("DE.model.ModelBorders", {
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
Ext.define("DE.view.TableSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.detablesettings",
    height: 612,
    requires: ["Common.component.ThemeColorPalette", "Ext.button.Button", "Ext.form.Label", "Ext.form.field.ComboBox", "Ext.container.Container", "Ext.toolbar.Spacer", "Ext.Array", "Ext.menu.Menu", "Ext.menu.Manager", "DE.view.InsertTableDialog", "Ext.data.Model", "Ext.data.Store", "Ext.XTemplate", "DE.view.TableSettingsAdvanced", "Common.component.ComboDataView", "Common.plugin.ComboBoxScrollPane"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.title = this.txtTitle;
        this._initedSettings = false;
        this._state = {
            TemplateId: 0,
            CheckHeader: false,
            CheckTotal: false,
            CheckBanded: false,
            CheckFirst: false,
            CheckLast: false,
            CheckColBanded: false,
            WrapStyle: -1,
            CanBeFlow: true,
            TableAlignment: -1,
            TableIndent: 0,
            BackColor: "#000000",
            RepeatRow: false
        };
        this._originalLook = new CTablePropLook();
        var me = this;
        var fullwidth = 218;
        this._originalProps = null;
        this.CellBorders = {};
        this.CellColor = {
            Value: 1,
            Color: "transparent"
        };
        this.BorderSize = 0;
        this._noApply = false;
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        var _wrapHandled = false;
        this._cmbTableTemplate = Ext.create("Common.component.ComboDataView", {
            id: "table-combo-template",
            width: 185,
            height: 64,
            itemWidth: 70,
            itemHeight: 50,
            menuMaxHeight: 300,
            repeatedselect: true,
            viewData: [],
            emptyComboText: this.textEmptyTemplate,
            listeners: {
                select: function (combo, record) {
                    if (me.api && !me._noApply) {
                        var properties = new CTableProp();
                        properties.put_TableStyle(record.data.data.templateId);
                        me.api.tblApply(properties);
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
        this.controls.push(this._cmbTableTemplate);
        this._chHeader = Ext.create("Ext.form.field.Checkbox", {
            id: "table-checkbox-header",
            boxLabel: this.textHeader,
            checked: false,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (me.api) {
                        var properties = new CTableProp();
                        var look = (me._originalLook) ? me._originalLook : new CTablePropLook();
                        look.put_FirstRow(newValue);
                        properties.put_TableLook(look);
                        me.api.tblApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me)
            }
        });
        this.controls.push(this._chHeader);
        this._chTotal = Ext.create("Ext.form.field.Checkbox", {
            id: "table-checkbox-total",
            boxLabel: this.textTotal,
            checked: false,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (me.api) {
                        var properties = new CTableProp();
                        var look = (me._originalLook) ? me._originalLook : new CTablePropLook();
                        look.put_LastRow(newValue);
                        properties.put_TableLook(look);
                        me.api.tblApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me)
            }
        });
        this.controls.push(this._chTotal);
        this._chBanded = Ext.create("Ext.form.field.Checkbox", {
            id: "table-checkbox-banded",
            boxLabel: this.textBanded,
            checked: false,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (me.api) {
                        var properties = new CTableProp();
                        var look = (me._originalLook) ? me._originalLook : new CTablePropLook();
                        look.put_BandHor(newValue);
                        properties.put_TableLook(look);
                        me.api.tblApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me)
            }
        });
        this.controls.push(this._chBanded);
        this._chFirst = Ext.create("Ext.form.field.Checkbox", {
            id: "table-checkbox-first",
            boxLabel: this.textFirst,
            checked: false,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (me.api) {
                        var properties = new CTableProp();
                        var look = (me._originalLook) ? me._originalLook : new CTablePropLook();
                        look.put_FirstCol(newValue);
                        properties.put_TableLook(look);
                        me.api.tblApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me)
            }
        });
        this.controls.push(this._chFirst);
        this._chLast = Ext.create("Ext.form.field.Checkbox", {
            id: "table-checkbox-last",
            boxLabel: this.textLast,
            checked: false,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (me.api) {
                        var properties = new CTableProp();
                        var look = (me._originalLook) ? me._originalLook : new CTablePropLook();
                        look.put_LastCol(newValue);
                        properties.put_TableLook(look);
                        me.api.tblApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me)
            }
        });
        this.controls.push(this._chLast);
        this._chColBanded = Ext.create("Ext.form.field.Checkbox", {
            id: "table-checkbox-col-banded",
            boxLabel: this.textBanded,
            checked: false,
            width: 85,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (me.api) {
                        var properties = new CTableProp();
                        var look = (me._originalLook) ? me._originalLook : new CTablePropLook();
                        look.put_BandVer(newValue);
                        properties.put_TableLook(look);
                        me.api.tblApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me)
            }
        });
        this.controls.push(this._chColBanded);
        this._TemplatePanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 185,
            width: "100%",
            items: [{
                xtype: "container",
                height: 86,
                layout: {
                    type: "table",
                    columns: 2,
                    tdAttrs: {
                        style: "padding-right: 8px;vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "label",
                    text: this.textRows,
                    style: "display: block;font-weight: bold;",
                    width: 85
                },
                {
                    xtype: "label",
                    text: this.textColumns,
                    style: "display: block;font-weight: bold;",
                    width: 85
                },
                {
                    xtype: "tbspacer",
                    height: 4
                },
                {
                    xtype: "tbspacer",
                    height: 4
                },
                this._chHeader, this._chFirst, this._chTotal, this._chLast, this._chBanded, this._chColBanded]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "label",
                text: this.textTemplate,
                style: "font-weight: bold;margin-bottom: 8px;"
            },
            this._cmbTableTemplate]
        });
        this._btnWrapNone = Ext.create("Ext.Button", {
            id: "table-button-wrap-none",
            cls: "asc-right-panel-btn btn-wrap-none",
            posId: c_tableWrap.TABLE_WRAP_NONE,
            margin: "2px 2px 2px 0",
            text: "",
            tooltip: this.textWrapNoneTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "tablewrapGroup",
            pressed: true,
            toggleHandler: Ext.bind(function (btn) {
                if (this.api && btn.pressed && !this._noApply) {
                    var properties = new CTableProp();
                    properties.put_TableWrap((!btn.pressed) ? c_tableWrap.TABLE_WRAP_PARALLEL : c_tableWrap.TABLE_WRAP_NONE);
                    if (this._state.TableAlignment < 0) {
                        this._state.TableAlignment = c_tableAlign.TABLE_ALIGN_LEFT;
                    }
                    properties.put_TableAlignment(this._state.TableAlignment);
                    properties.put_TableIndent(this._state.TableIndent);
                    properties.put_CellSelect(true);
                    this.api.tblApply(properties);
                }
                if (_wrapHandled) {
                    _wrapHandled = false;
                    return;
                }
                _wrapHandled = true;
                this.fireEvent("editcomplete", this);
            },
            this)
        });
        this.controls.push(this._btnWrapNone);
        this._btnWrapParallel = Ext.create("Ext.Button", {
            id: "table-button-wrap-parallel",
            cls: "asc-right-panel-btn btn-wrap-parallel",
            posId: c_tableWrap.TABLE_WRAP_PARALLEL,
            margin: "2px",
            text: "",
            tooltip: this.textWrapParallelTooltip,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "tablewrapGroup",
            toggleHandler: Ext.bind(function (btn) {
                if (this.api && btn.pressed && !this._noApply) {
                    var properties = new CTableProp();
                    properties.put_TableWrap((btn.pressed) ? c_tableWrap.TABLE_WRAP_PARALLEL : c_tableWrap.TABLE_WRAP_NONE);
                    properties.put_CellSelect(true);
                    this.api.tblApply(properties);
                }
                if (_wrapHandled) {
                    _wrapHandled = false;
                    return;
                }
                _wrapHandled = true;
                this.fireEvent("editcomplete", this);
            },
            this)
        });
        this.controls.push(this._btnWrapParallel);
        var _arrBorderPosition = [[c_tableBorder.BORDER_VERTICAL_LEFT, "l", "asc-right-panel-small-btn btn-position-left", "table-button-border-left", this.tipLeft], [c_tableBorder.BORDER_VERTICAL_CENTER, "c", "asc-right-panel-small-btn btn-position-inner-vert", "table-button-border-inner-vert", this.tipInnerVert], [c_tableBorder.BORDER_VERTICAL_RIGHT, "r", "asc-right-panel-small-btn btn-position-right", "table-button-border-right", this.tipRight], [c_tableBorder.BORDER_HORIZONTAL_TOP, "t", "asc-right-panel-small-btn btn-position-top", "table-button-border-top", this.tipTop], [c_tableBorder.BORDER_HORIZONTAL_CENTER, "m", "asc-right-panel-small-btn btn-position-inner-hor", "table-button-border-inner-hor", this.tipInnerHor], [c_tableBorder.BORDER_HORIZONTAL_BOTTOM, "b", "asc-right-panel-small-btn btn-position-bottom", "table-button-border-bottom", this.tipBottom], [c_tableBorder.BORDER_INNER, "cm", "asc-right-panel-small-btn btn-position-inner", "table-button-border-inner", this.tipInner], [c_tableBorder.BORDER_OUTER, "lrtb", "asc-right-panel-small-btn btn-position-outer", "table-button-border-outer", this.tipOuter], [c_tableBorder.BORDER_ALL, "lrtbcm", "asc-right-panel-small-btn btn-position-all", "table-button-border-all", this.tipAll], [c_tableBorder.BORDER_NONE, "", "asc-right-panel-small-btn btn-position-none", "table-button-border-none", this.tipNone]];
        this._btnsBorderPosition = [];
        Ext.Array.forEach(_arrBorderPosition, function (item, index) {
            var _btn = Ext.create("Ext.Button", {
                id: item[3],
                cls: item[2],
                posId: item[0],
                strId: item[1],
                text: "",
                tooltip: item[4],
                enableToggle: false,
                listeners: {
                    click: Ext.bind(function (btn, eOpts) {
                        this._UpdateBordersStyle(btn.strId, true);
                        if (this.api) {
                            var properties = new CTableProp();
                            properties.put_CellBorders(this.CellBorders);
                            properties.put_CellSelect(true);
                            this.api.tblApply(properties);
                        }
                        this.fireEvent("editcomplete", this);
                    },
                    this)
                }
            });
            this._btnsBorderPosition.push(_btn);
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
                    this.BorderSize = records[0].data.value;
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
        this.BorderSize = rec.data.value;
        this._btnBorderColor = Ext.create("Ext.button.Button", {
            id: "table-button-border-color",
            arrowCls: "",
            width: 45,
            height: 22,
            color: "000000",
            menu: {
                showSeparator: false,
                items: [this.borderColor = Ext.create("Common.component.ThemeColorPalette", {
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
                                me._btnBorderColor.color = color;
                                if (me._btnBorderColor.btnEl) {
                                    Ext.DomHelper.applyStyles(me._btnBorderColor.btnEl, {
                                        "background-color": Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color)
                                    });
                                }
                                Ext.menu.Manager.hideAll();
                            }
                        }
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
                    listeners: {
                        click: function (item, event) {
                            me.borderColor.addNewColor();
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
            id: "table-button-back-color",
            arrowCls: "",
            width: 45,
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
                                if (me.api) {
                                    var properties = new CTableProp();
                                    var background = new CBackground();
                                    properties.put_CellsBackground(background);
                                    if (me.CellColor.Color == "transparent") {
                                        background.put_Value(1);
                                    } else {
                                        background.put_Value(0);
                                        background.put_Color(me.getRgbColor(me.CellColor.Color));
                                    }
                                    properties.put_CellSelect(true);
                                    me.api.tblApply(properties);
                                }
                                me.fireEvent("editcomplete", me);
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
        this.controls.push(this.colorsBack);
        this.chRepeatRow = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "table-checkbox-repeat-row",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        var properties = new CTableProp();
                        properties.put_RowsInHeader((field.getValue() == "checked") ? 1 : 0);
                        this.api.tblApply(properties);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this.chRepeatRow);
        this._WrapPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 49,
            width: "100%",
            items: [{
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "container",
                height: 43,
                width: "100%",
                layout: "hbox",
                items: [this._btnWrapNone, {
                    xtype: "tbspacer",
                    width: 3
                },
                this._btnWrapParallel]
            }]
        });
        this._BordersPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 167,
            width: "100%",
            items: [{
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                height: 26,
                width: 190,
                style: "vertical-align: middle;",
                items: [this.cmbBorderSize, {
                    xtype: "tbspacer",
                    flex: 1
                },
                {
                    xtype: "label",
                    text: this.textBorderColor
                },
                {
                    xtype: "tbspacer",
                    width: 7
                },
                this._btnBorderColor, {
                    xtype: "tbspacer",
                    width: 5
                }]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 30,
                width: 190,
                layout: "hbox",
                items: [{
                    xtype: "label",
                    height: 30,
                    flex: 1,
                    text: this.textSelectBorders
                },
                {
                    xtype: "tbspacer",
                    width: 5
                }]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                width: 190,
                items: [this._btnsBorderPosition[8], this._btnsBorderPosition[9], this._btnsBorderPosition[6], this._btnsBorderPosition[7], {
                    xtype: "tbspacer",
                    flex: 1
                }]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                width: 190,
                items: [this._btnsBorderPosition[0], this._btnsBorderPosition[1], this._btnsBorderPosition[2], this._btnsBorderPosition[3], this._btnsBorderPosition[4], this._btnsBorderPosition[5], {
                    xtype: "tbspacer",
                    flex: 1
                }]
            },
            {
                xtype: "tbspacer",
                height: 12
            },
            {
                xtype: "container",
                height: 25,
                width: 190,
                layout: "hbox",
                items: [{
                    xtype: "label",
                    text: this.textBackColor,
                    margin: "2px 0 0 0",
                    style: "text-align: right;",
                    flex: 1
                },
                {
                    xtype: "tbspacer",
                    width: 7
                },
                this._btnBackColor, {
                    xtype: "tbspacer",
                    width: 5
                }]
            }]
        });
        var tableMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                },
                show: function (cnt, eOpt) {
                    if (me.api) {
                        me.mnuMerge.setDisabled(!me.api.CheckBeforeMergeCells());
                        me.mnuSplit.setDisabled(!me.api.CheckBeforeSplitCells());
                    }
                }
            },
            items: [{
                text: me.selectRowText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.selectRow();
                        }
                    }
                }
            },
            {
                text: me.selectColumnText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.selectColumn();
                        }
                    }
                }
            },
            {
                text: me.selectCellText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.selectCell();
                        }
                    }
                }
            },
            {
                text: me.selectTableText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.selectTable();
                        }
                    }
                }
            },
            {
                xtype: "menuseparator"
            },
            {
                text: me.insertRowAboveText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.addRowAbove();
                        }
                    }
                }
            },
            {
                text: me.insertRowBelowText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.addRowBelow();
                        }
                    }
                }
            },
            {
                text: me.insertColumnLeftText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.addColumnLeft();
                        }
                    }
                }
            },
            {
                text: me.insertColumnRightText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.addColumnRight();
                        }
                    }
                }
            },
            {
                xtype: "menuseparator"
            },
            {
                text: me.deleteRowText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.remRow();
                        }
                    }
                }
            },
            {
                text: me.deleteColumnText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.remColumn();
                        }
                    }
                }
            },
            {
                text: me.deleteTableText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.remTable();
                        }
                    }
                }
            },
            {
                xtype: "menuseparator"
            },
            me.mnuMerge = Ext.create("Ext.menu.Item", {
                text: me.mergeCellsText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            me.api.MergeCells();
                        }
                    }
                }
            }), me.mnuSplit = Ext.create("Ext.menu.Item", {
                text: me.splitCellsText,
                listeners: {
                    click: function (item) {
                        if (me.api) {
                            var win = Ext.create("DE.view.InsertTableDialog", {
                                labelTitle: this.splitCellTitleText
                            });
                            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                                if (mr) {
                                    me.api.SplitCell(s[0], s[1]);
                                }
                                me.fireEvent("editcomplete", me);
                            },
                            this), false);
                            win.show();
                        }
                    }
                }
            })]
        });
        this._btnEdit = Ext.create("Ext.button.Button", {
            id: "table-button-edit",
            width: 45,
            iconCls: "btn-edit-table",
            cls: "asc-right-panel-edit-btn",
            menu: tableMenu
        });
        this._EditContainer = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 38,
            width: "100%",
            items: [{
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "container",
                height: 40,
                width: 200,
                layout: "hbox",
                items: [{
                    xtype: "label",
                    text: this.textEdit,
                    margin: "2px 0 0 0",
                    style: "font-weight: bold;margin-top: 1px;",
                    flex: 1
                },
                {
                    xtype: "tbspacer",
                    width: 7
                },
                this._btnEdit, {
                    xtype: "tbspacer",
                    width: 20
                }]
            }]
        });
        this._HeaderContainer = Ext.create("Ext.container.Container", {
            height: 40,
            width: "100%",
            layout: "hbox",
            items: [this.chRepeatRow, {
                xtype: "label",
                text: this.strRepeatRow,
                margin: "1 5 0 4",
                flex: 1,
                listeners: {
                    afterrender: Ext.bind(function (ct) {
                        ct.getEl().on("click", Ext.bind(function () {
                            this.chRepeatRow.setValue((this.chRepeatRow.getValue() == "indeterminate") ? false : !(this.chRepeatRow.getValue() == "checked"));
                        },
                        this), this);
                        ct.getEl().on("dblclick", Ext.bind(function () {
                            this.chRepeatRow.setValue((this.chRepeatRow.getValue() == "indeterminate") ? false : !(this.chRepeatRow.getValue() == "checked"));
                        },
                        this), this);
                    },
                    this)
                }
            },
            {
                xtype: "tbspacer",
                width: 5
            }]
        });
        this.items = [{
            xtype: "tbspacer",
            height: 7
        },
        this._TemplatePanel, {
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
            text: this.textBorders
        },
        this._BordersPanel, {
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
            text: this.textWrap
        },
        this._WrapPanel, {
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
        this._EditContainer, {
            xtype: "tbspacer",
            width: "100%",
            height: 10,
            style: "padding-right: 10px;",
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        this._HeaderContainer, {
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
            width: "100%",
            items: [{
                xtype: "box",
                html: '<div style="width:100%;text-align:center;padding-right:15px"><label id="table-advanced-link" class="asc-advanced-link">' + this.textAdvanced + "</label></div>",
                listeners: {
                    afterrender: function (cmp) {
                        document.getElementById("table-advanced-link").onclick = Ext.bind(this._openAdvancedSettings, this);
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
        if (o) {
            this.api.asc_registerCallback("asc_onTblWrapStyleChanged", Ext.bind(this._TblWrapStyleChanged, this));
            this.api.asc_registerCallback("asc_onTblAlignChanged", Ext.bind(this._TblAlignChanged, this));
            this.api.asc_registerCallback("asc_onInitTableTemplates", Ext.bind(this._onInitTemplates, this));
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
    ChangeSettings: function (props) {
        if (!this._initedSettings && this.effectcolors && this.standartcolors) {
            this.borderColor.updateColors(this.effectcolors, this.standartcolors);
            this.colorsBack.updateColors(this.effectcolors, this.standartcolors);
        }
        this._initedSettings = true;
        if (props) {
            this._originalProps = new CTableProp(props);
            this._originalProps.put_CellSelect(true);
            this._TblWrapStyleChanged(props.get_TableWrap());
            var value = props.get_CanBeFlow();
            if (this._state.CanBeFlow !== value) {
                this._btnWrapParallel.setDisabled(!value);
                this._state.CanBeFlow = value;
            }
            this._TblAlignChanged(props.get_TableAlignment());
            this._state.TableIndent = (props.get_TableAlignment() !== c_tableAlign.TABLE_ALIGN_LEFT) ? 0 : props.get_TableIndent();
            this.SuspendEvents();
            value = props.get_TableStyle();
            if (this._state.TemplateId !== value || this._isTemplatesChanged) {
                var styleIndex = this._cmbTableTemplate.dataMenu.picker.store.findBy(function (record, id) {
                    return (record.data.data.templateId === value);
                },
                this);
                this._cmbTableTemplate.selectByIndex(styleIndex);
                if (this._isTemplatesChanged) {
                    if (styleIndex >= 0) {
                        this._cmbTableTemplate.fillComboView(this._cmbTableTemplate.dataMenu.picker.store.getAt(styleIndex), true, true);
                    } else {
                        this._cmbTableTemplate.fillComboView(this._cmbTableTemplate.dataMenu.picker.store.getAt(0), false, true);
                    }
                }
                this._state.TemplateId = value;
            }
            this._isTemplatesChanged = false;
            var look = props.get_TableLook();
            if (look) {
                value = look.get_FirstRow();
                if (this._state.CheckHeader !== value) {
                    this._chHeader.setValue(value);
                    this._state.CheckHeader = value;
                    this._originalLook.put_FirstRow(value);
                }
                value = look.get_LastRow();
                if (this._state.CheckTotal !== value) {
                    this._chTotal.setValue(value);
                    this._state.CheckTotal = value;
                    this._originalLook.put_LastRow(value);
                }
                value = look.get_BandHor();
                if (this._state.CheckBanded !== value) {
                    this._chBanded.setValue(value);
                    this._state.CheckBanded = value;
                    this._originalLook.put_BandHor(value);
                }
                value = look.get_FirstCol();
                if (this._state.CheckFirst !== value) {
                    this._chFirst.setValue(value);
                    this._state.CheckFirst = value;
                    this._originalLook.put_FirstCol(value);
                }
                value = look.get_LastCol();
                if (this._state.CheckLast !== value) {
                    this._chLast.setValue(value);
                    this._state.CheckLast = value;
                    this._originalLook.put_LastCol(value);
                }
                value = look.get_BandVer();
                if (this._state.CheckColBanded !== value) {
                    this._chColBanded.setValue(value);
                    this._state.CheckColBanded = value;
                    this._originalLook.put_BandVer(value);
                }
            }
            var background = props.get_CellsBackground();
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
            var type1 = typeof(this.CellColor.Color),
            type2 = typeof(this._state.BackColor);
            if ((type1 !== type2) || (type1 == "object" && (this.CellColor.Color.effectValue !== this._state.BackColor.effectValue || this._state.BackColor.color.indexOf(this.CellColor.Color.color) < 0)) || (type1 != "object" && this._state.BackColor.indexOf(this.CellColor.Color) < 0)) {
                this._btnBackColor.setColor(this.CellColor.Color);
                if (typeof(this.CellColor.Color) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.CellColor.Color.effectValue) {
                            this.colorsBack.select(this.CellColor.Color, false);
                            break;
                        }
                    }
                } else {
                    this.colorsBack.select(this.CellColor.Color, false);
                }
                this._state.BackColor = this.CellColor.Color;
            }
            value = props.get_RowsInHeader();
            if (this._state.RepeatRow !== value) {
                if (value !== null) {
                    this.chRepeatRow.setValue((value > 0) ? 1 : 0);
                } else {
                    this.chRepeatRow.setValue("indeterminate");
                }
                this._state.RepeatRow = value;
            }
            this.ResumeEvents();
        }
    },
    _UpdateBordersStyle: function (border) {
        this.CellBorders = new CBorders();
        var updateBorders = this.CellBorders;
        var visible = (border != "");
        if (border.indexOf("l") > -1 || !visible) {
            if (updateBorders.get_Left() === null || updateBorders.get_Left() === undefined) {
                updateBorders.put_Left(new CBorder());
            }
            this._UpdateBorderStyle(updateBorders.get_Left(), visible);
        }
        if (border.indexOf("t") > -1 || !visible) {
            if (updateBorders.get_Top() === null || updateBorders.get_Top() === undefined) {
                updateBorders.put_Top(new CBorder());
            }
            this._UpdateBorderStyle(updateBorders.get_Top(), visible);
        }
        if (border.indexOf("r") > -1 || !visible) {
            if (updateBorders.get_Right() === null || updateBorders.get_Right() === undefined) {
                updateBorders.put_Right(new CBorder());
            }
            this._UpdateBorderStyle(updateBorders.get_Right(), visible);
        }
        if (border.indexOf("b") > -1 || !visible) {
            if (updateBorders.get_Bottom() === null || updateBorders.get_Bottom() === undefined) {
                updateBorders.put_Bottom(new CBorder());
            }
            this._UpdateBorderStyle(updateBorders.get_Bottom(), visible);
        }
        if (border.indexOf("c") > -1 || !visible) {
            if (updateBorders.get_InsideV() === null || updateBorders.get_InsideV() === undefined) {
                updateBorders.put_InsideV(new CBorder());
            }
            this._UpdateBorderStyle(updateBorders.get_InsideV(), visible);
        }
        if (border.indexOf("m") > -1 || !visible) {
            if (updateBorders.get_InsideH() === null || updateBorders.get_InsideH() === undefined) {
                updateBorders.put_InsideH(new CBorder());
            }
            this._UpdateBorderStyle(updateBorders.get_InsideH(), visible);
        }
    },
    _UpdateBorderStyle: function (border, visible) {
        if (null == border) {
            border = new CBorder();
        }
        if (visible && this.BorderSize > 0) {
            var size = parseFloat(this.BorderSize);
            border.put_Value(1);
            border.put_Size(size * 25.4 / 72);
            var color = this.getRgbColor(this._btnBorderColor.color);
            border.put_Color(color);
        } else {
            border.put_Value(0);
        }
    },
    _TblWrapStyleChanged: function (style) {
        if (this._state.WrapStyle !== style) {
            this._noApply = true;
            this._btnWrapNone.toggle((style == c_tableWrap.TABLE_WRAP_NONE), true);
            this._btnWrapParallel.toggle((style == c_tableWrap.TABLE_WRAP_PARALLEL), true);
            this._noApply = false;
            this._state.WrapStyle = style;
        }
    },
    _TblAlignChanged: function (style) {
        this._state.TableAlignment = style;
    },
    _openAdvancedSettings: function (e) {
        var me = this;
        var win;
        if (me.api) {
            var selectedElements = me.api.getSelectedElements();
            if (selectedElements && Ext.isArray(selectedElements)) {
                var elType, elValue;
                for (var i = selectedElements.length - 1; i >= 0; i--) {
                    elType = selectedElements[i].get_ObjectType();
                    elValue = selectedElements[i].get_ObjectValue();
                    if (c_oAscTypeSelectElement.Table == elType) {
                        var table_config = {
                            tableStylerRows: (elValue.get_CellBorders().get_InsideH() === null && elValue.get_CellSelect() == true) ? 1 : 2,
                            tableStylerColumns: (elValue.get_CellBorders().get_InsideV() === null && elValue.get_CellSelect() == true) ? 1 : 2
                        };
                        win = Ext.create("DE.view.TableSettingsAdvanced", table_config);
                        win.updateMetricUnit();
                        win.setSettings({
                            tableProps: elValue,
                            borderProps: me.borderAdvancedProps,
                            colorProps: [this.effectcolors, this.standartcolors]
                        });
                        break;
                    }
                }
            }
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr == 1) {
                    var props = win.getSettings();
                    me.borderAdvancedProps = props.borderProps;
                    me.api.tblApply(props.tableProps);
                }
                me.fireEvent("editcomplete", me);
            },
            this), false);
            win.addListener("close", function () {
                me.fireEvent("editcomplete", me);
            },
            false);
            win.show();
        }
    },
    _onInitTemplates: function (Templates) {
        var self = this;
        this._isTemplatesChanged = true;
        var count = self._cmbTableTemplate.dataMenu.picker.store.getCount();
        if (count > 0 && count == Templates.length) {
            var data = self._cmbTableTemplate.dataMenu.picker.store.data.items;
            Ext.each(Templates, function (template, index) {
                data[index].data.imageUrl = template.get_Image();
            });
            self._cmbTableTemplate.dataMenu.picker.store.fireEvent("datachanged", self._cmbTableTemplate.dataMenu.picker.store);
        } else {
            self._cmbTableTemplate.dataMenu.picker.store.removeAll();
            var arr = [];
            Ext.each(Templates, function (template) {
                arr.push({
                    imageUrl: template.get_Image(),
                    uid: Ext.id(),
                    data: {
                        templateId: template.get_Id()
                    }
                });
            });
            self._cmbTableTemplate.dataMenu.picker.store.loadData(arr);
        }
    },
    SendThemeColors: function (effectcolors, standartcolors) {
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
        if (this._initedSettings) {
            this.borderColor.updateColors(effectcolors, standartcolors);
            this.colorsBack.updateColors(effectcolors, standartcolors);
        }
    },
    textWrap: "Text Wrapping",
    textBorders: "Border's Style",
    textBorderColor: "Color",
    textBackColor: "Background color",
    textWrapParallelTooltip: "Flow table",
    textWrapNoneTooltip: "Inline table",
    textUndock: "Undock from panel",
    textEdit: "Rows & Columns",
    selectRowText: "Select Row",
    selectColumnText: "Select Column",
    selectCellText: "Select Cell",
    selectTableText: "Select Table",
    insertRowAboveText: "Insert Row Above",
    insertRowBelowText: "Insert Row Below",
    insertColumnLeftText: "Insert Column Left",
    insertColumnRightText: "Insert Column Right",
    deleteRowText: "Delete Row",
    deleteColumnText: "Delete Column",
    deleteTableText: "Delete Table",
    mergeCellsText: "Merge Cells",
    splitCellsText: "Split Cell...",
    splitCellTitleText: "Split Cell",
    textSelectBorders: "Select borders that you want to change",
    textAdvanced: "Show advanced settings",
    txtTitle: "Table",
    txtNoBorders: "No borders",
    textOK: "OK",
    textCancel: "Cancel",
    textNewColor: "Add New Custom Color",
    textTemplate: "Select From Template",
    textRows: "Rows",
    textColumns: "Columns",
    textHeader: "Header",
    textTotal: "Total",
    textBanded: "Banded",
    textFirst: "First",
    textLast: "Last",
    textEmptyTemplate: "No templates",
    strRepeatRow: "Repeat as header row at the top of each page",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    tipTop: "Set Outer Top Border Only",
    tipLeft: "Set Outer Left Border Only",
    tipBottom: "Set Outer Bottom Border Only",
    tipRight: "Set Outer Right Border Only",
    tipAll: "Set Outer Border and All Inner Lines",
    tipNone: "Set No Borders",
    tipInner: "Set Inner Lines Only",
    tipInnerVert: "Set Vertical Inner Lines Only",
    tipInnerHor: "Set Horizontal Inner Lines Only",
    tipOuter: "Set Outer Border Only"
});