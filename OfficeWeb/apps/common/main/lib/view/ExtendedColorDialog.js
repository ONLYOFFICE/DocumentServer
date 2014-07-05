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
 Ext.define("Common.view.ExtendedColorDialog", {
    extend: "Ext.window.Window",
    alias: "widget.commonextendedcolordialog",
    cls: "common-extendedcolordialog",
    requires: ["Ext.window.Window", "Common.component.HSBColorPicker"],
    modal: true,
    closable: true,
    resizable: false,
    preventHeader: true,
    closeAction: "destroy",
    plain: true,
    height: 276,
    width: 326,
    minWidth: 188,
    padding: "16px",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        beforehide: function () {
            if (this._modalresult === undefined) {
                this.fireEvent("onmodalresult", 0);
            }
        },
        show: function () {
            this.textColor.focus(false, 500);
        }
    },
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        var _btnOk = Ext.create("Ext.Button", {
            text: this.addButtonText,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    this._modalresult = 1;
                    this.fireEvent("onmodalresult", this._modalresult);
                    this.close();
                },
                scope: this
            }
        });
        var _btnCancel = Ext.create("Ext.Button", {
            text: this.cancelButtonText,
            width: 80,
            cls: "asc-darkgray-button",
            listeners: {
                click: function () {
                    this._modalresult = 0;
                    this.fireEvent("onmodalresult", this._modalresult);
                    this.close();
                },
                scope: this
            }
        });
        var me = this;
        me.hexRe = /\s*#?([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)\s*/;
        this.colorsPicker = Ext.widget("hsbcolorpicker", {
            height: 198,
            color: "#000000",
            width: 220,
            changeSaturation: true,
            showCurrentColor: false,
            style: "margin-top:2px;margin-right:6px;",
            listeners: {
                render: function (o) {
                    $("." + this.baseCls + "-cnt-root").css("margin-right", "0");
                },
                changecolor: function (o, color) {
                    me.colorNew.getEl().setStyle("background-color", color);
                    me.stopevents = true;
                    var values = color.match(me.hexRe);
                    me.spinR.setValue(parseInt(values[1], 16));
                    me.spinG.setValue(parseInt(values[2], 16));
                    me.spinB.setValue(parseInt(values[3], 16));
                    me.textColor.setValue((values[1] + values[2] + values[3]).toUpperCase());
                    me.stopevents = false;
                }
            }
        });
        function showColor(exlude) {
            if (!me.stopevents) {
                var r = (me.spinR.getValue() == null ? 0 : me.spinR.getValue()).toString(16);
                var g = (me.spinG.getValue() == null ? 0 : me.spinG.getValue()).toString(16);
                var b = (me.spinB.getValue() == null ? 0 : me.spinB.getValue()).toString(16);
                var color = (r.length == 1 ? "0" + r : r) + (g.length == 1 ? "0" + g : g) + (b.length == 1 ? "0" + b : b);
                me.colorsPicker.setColor("#" + color);
                if (exlude != "hex") {
                    me.textColor.setValue(color.toUpperCase());
                }
                me.colorNew.getEl().setStyle("background-color", "#" + color);
            }
        }
        this.spinR = Ext.widget("numberfield", {
            fieldLabel: "R",
            labelWidth: 10,
            width: 80,
            minValue: 0,
            maxValue: 255,
            value: 0,
            style: "margin-bottom:4px;",
            listeners: {
                change: showColor
            }
        });
        this.spinG = Ext.widget("numberfield", {
            fieldLabel: "G",
            labelWidth: 10,
            width: 80,
            minValue: 0,
            maxValue: 255,
            value: 0,
            style: "margin-bottom:4px;",
            listeners: {
                change: showColor
            }
        });
        this.spinB = Ext.widget("numberfield", {
            fieldLabel: "B",
            labelWidth: 10,
            width: 80,
            minValue: 0,
            maxValue: 255,
            value: 0,
            style: "margin-bottom:16px;",
            listeners: {
                change: showColor
            }
        });
        this.colorSaved = Ext.widget("box", {
            id: "field-start-color",
            height: 20
        });
        this.colorNew = Ext.widget("box", {
            height: 20
        });
        this.textColor = Ext.widget("textfield", {
            fieldLabel: "#",
            labelWidth: 10,
            maskRe: /[a-fA-F0-9]/,
            maxLength: 6,
            enforceMaxLength: true,
            validator: function (value) {
                if (!/^[a-fA-F0-9]{0,6}$/.test(value)) {
                    return "Incorrect color value";
                } else {
                    value = "000000" + value;
                    var colors = value.match(/([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/i);
                    me.stopevents = true;
                    me.spinR.setValue(parseInt(colors[1], 16));
                    me.spinG.setValue(parseInt(colors[2], 16));
                    me.spinB.setValue(parseInt(colors[3], 16));
                    me.stopevents = false;
                    if (this.rendered) {
                        showColor("hex");
                    }
                }
                return true;
            },
            listeners: {
                afterrender: function (cmp) {
                    cmp.inputEl.setStyle("text-align", "right");
                }
            }
        });
        this.addEvents("onmodalresult");
        this.items = [{
            xtype: "container",
            height: 202,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [this.colorsPicker, {
                xtype: "container",
                width: 68,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "label",
                    text: this.textNew,
                    style: "text-align:center;width:100%;margin-bottom:2px;"
                },
                this.colorNew, this.colorSaved, {
                    xtype: "label",
                    text: this.textCurrent,
                    style: "text-align:center;width:100%;margin-top:2px;margin-bottom:14px;"
                },
                this.spinR, this.spinG, this.spinB, this.textColor]
            }]
        },
        {
            xtype: "tbspacer",
            height: 14
        },
        {
            xtype: "container",
            layout: {
                type: "hbox",
                align: "middle",
                pack: "center"
            },
            items: [_btnOk, {
                xtype: "tbspacer",
                width: 10
            },
            _btnCancel]
        }];
        this.callParent(arguments);
    },
    getColor: function () {
        var color = /#?([a-fA-F0-9]{6})/.exec(this.colorsPicker.getColor());
        return color ? color[1] : null;
    },
    setColor: function (cl) {
        var me = this;
        var color = /#?([a-fA-F0-9]{6})/.test(cl) ? cl : "ff0000";
        me.colorsPicker.setColor("#" + color);
        function keepcolor() {
            if (cl == "transparent") {
                me.colorSaved.addCls("color-transparent");
            } else {
                me.colorSaved.removeCls("color-transparent");
                me.colorSaved.getEl().setStyle("background-color", "#" + cl);
            }
            me.colorNew.getEl().setStyle("background-color", "#" + color);
        }
        if (!me.colorSaved.rendered) {
            me.colorSaved.on("afterrender", keepcolor, {
                single: true
            });
        } else {
            keepcolor();
        }
        me.stopevents = true;
        var values = me.hexRe.exec(color);
        me.spinR.setValue(parseInt(values[1], 16));
        me.spinG.setValue(parseInt(values[2], 16));
        me.spinB.setValue(parseInt(values[3], 16));
        me.textColor.setValue((values[1] + values[2] + values[3]).toUpperCase());
        me.stopevents = false;
    },
    cancelButtonText: "Cancel",
    addButtonText: "Add",
    textNew: "New",
    textCurrent: "Current"
});