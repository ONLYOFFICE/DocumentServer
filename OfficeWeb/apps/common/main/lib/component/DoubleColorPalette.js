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
 Ext.define("Common.component.DoubleColorPalette", {
    extend: "Ext.ColorPalette",
    alias: "widget.cmddoublecolorpalette",
    allowReselect: true,
    dyncolorscount: 12,
    width: 180,
    maxWidth: 180,
    baseCls: "cmp-double-colorpalette",
    requires: ["Common.view.ExtendedColorDialog"],
    renderTpl: ['<tpl for="colors">', '<tpl if="this.isSeparator(values)"><div class="palette-color-spacer" style="width:100%;height:10px;float:left;"></div></tpl>', '<tpl if="this.isColor(values)">', '<a href="#" class="color-{.}" style="background:#{.} "hidefocus="on">', '<em><span style="background:#{.}" unselectable="on">&#160;</span></em>', "</a>", "</tpl>", '<tpl if="this.isCustom(values)">', '<a href="#" id="{id}" class="palette-color-custom {cls}" hidefocus="on">', '<em><span style="background:#FFFFFF;background-image:url({image});" unselectable="on">&#160;</span></em>', "</a>", "</tpl>", "</tpl>", {
        isSeparator: function (v) {
            return typeof(v) == "string" && v == "-";
        },
        isColor: function (v) {
            return typeof(v) == "string" && (/[0-9A-F]{6}|transparent/).test(v);
        },
        isCustom: function (v) {
            return typeof(v) == "object";
        }
    }],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.callParent(arguments);
    },
    onRender: function (o) {
        this.callParent(arguments);
        if (this.dynamiccolors) {
            var picker = o.down(".x-color-picker");
            if (picker) {
                var i = -1,
                colors = '<div class="palette-color-spacer" style="width:100%;height:10px;float:left;"></div>';
                while (++i < this.dyncolorscount) {
                    colors += Ext.String.format('<a href="#" class="color-dynamic-{0} dynamic-empty-color" style="background:#ffffff" color="ffffff" hidefocus="on">' + '<em><span unselectable="on">&#160;</span></em></a>', i);
                }
                Ext.DomHelper.insertHtml("beforeEnd", picker.dom, colors);
            }
            var menu = this.el.up(".x-menu");
            if (menu) {
                Ext.menu.Manager.menus[menu.id].addListener("beforeshow", this.updateCustomColors, this);
            }
            this.updateCustomColors();
        }
    },
    afterRender: function (o) {
        this.callParent(arguments);
        if (this.lastvalue) {
            this.select(this.lastvalue);
        }
    },
    setCustomColor: function (color) {
        color = /#?([a-fA-F0-9]{6})/.exec(color);
        if (color) {
            var el = this.getEl();
            if (el) {
                this._saveCustomColor(color[1]);
                $("#" + el.id + " a." + this.selectedCls).removeClass(this.selectedCls);
                var child = el.down(".dynamic-empty-color");
                if (!child) {
                    this.updateCustomColors();
                    child = el.down(".color-dynamic-" + (this.dyncolorscount - 1));
                }
                child.removeCls("dynamic-empty-color").addCls(this.selectedCls).dom.setAttribute("color", color[1]);
                child.down("span").setStyle("background-color", "#" + color[1]).setStyle("border", "none");
            }
        }
    },
    select: function (color, suppressEvent) {
        var el = this.getEl();
        if (el) {
            $("#" + el.id + " a." + this.selectedCls).removeClass(this.selectedCls);
        }
        if (/#?[a-fA-F0-9]{6}/.test(color)) {
            color = /#?([a-fA-F0-9]{6})/.exec(color)[1].toUpperCase();
        }
        if (/^[a-fA-F0-9]{6}|transparent$/.test(color) && Ext.Array.contains(this.colors, color)) {
            if (!Ext.Array.contains(this.colors, this.value)) {
                this.value = false;
            }
            this.callParent(arguments);
        } else {
            if (el) {
                var co = el.down("#" + color) || el.down('a[color="' + color + '"]');
                if (co) {
                    co.addCls(this.selectedCls);
                    this.value = color.toUpperCase();
                } else {
                    if (el.down("a." + this.selectedCls)) {
                        this.value = false;
                    } else {
                        if (this.dynamiccolors) {
                            this.setCustomColor(color);
                        }
                    }
                }
            } else {
                this.lastvalue = color;
            }
        }
    },
    handleClick: function (event, target) {
        var me = this;
        if (! (target.className.search("palette-color-custom") < 0)) {
            event.stopEvent();
            cmp = Ext.get(target.parentNode.id).down("a." + me.selectedCls);
            if (!cmp || cmp.id != target.id) {
                if (cmp) {
                    cmp.removeCls(me.selectedCls);
                }
                Ext.get(target.id).addCls(me.selectedCls);
                me.value = false;
                me.fireEvent("select", me, target.id);
            } else {
                me.fireEvent("select", me, cmp.id);
            }
        } else {
            if (! (target.className.search("color-transparent") < 0)) {
                event.stopEvent();
                cmp = Ext.get(target.parentNode.id).down("a." + me.selectedCls);
                if (!cmp || cmp.id != target.id) {
                    if (cmp) {
                        cmp.removeCls(me.selectedCls);
                    }
                    Ext.get(target.id).addCls(me.selectedCls);
                    me.value = "transparent";
                }
                me.fireEvent("select", me, "transparent");
            } else {
                if (! (target.className.search("color-dynamic") < 0)) {
                    if (!/dynamic-empty-color/.test(target.className)) {
                        var color = target.getAttribute("color");
                        if (color) {
                            me.fireEvent("select", me, color);
                        }
                        this.value = color.toUpperCase();
                        $("#" + this.getEl().id + " a." + me.selectedCls).removeClass(me.selectedCls);
                        Ext.get(target.id).addCls(me.selectedCls);
                    } else {
                        setTimeout(function () {
                            me.addNewColor();
                            Ext.menu.Manager.hideAll();
                        },
                        10);
                    }
                } else {
                    var cmp = Ext.get(target.parentNode.id).down("a.palette-color-custom");
                    if (cmp) {
                        cmp.removeCls(me.selectedCls);
                    }
                    if (!/^[a-fA-F0-9]{6}$/.test(this.value) || !Ext.Array.contains(this.colors, this.value)) {
                        this.value = false;
                    }
                    this.callParent(arguments);
                }
            }
        }
    },
    addNewColor: function () {
        var me = this;
        var win = Ext.widget("commonextendedcolordialog", {});
        win.addListener("onmodalresult", function (mr) {
            me._isdlgopen = false;
            if (mr == 1) {
                me.setCustomColor(win.getColor());
                me.fireEvent("select", me, win.getColor());
            }
        },
        false);
        me._isdlgopen = true;
        win.setColor(me.value);
        win.show();
    },
    isDialogOpen: function () {
        return this._isdlgopen == true;
    },
    updateCustomColors: function () {
        var picker = this.getEl();
        if (picker) {
            var colors = localStorage["asc." + window.storagename + ".colors.custom"];
            colors = colors ? colors.split(",") : [];
            var i = -1,
            colorEl, c = colors.length < this.dyncolorscount ? colors.length : this.dyncolorscount;
            while (++i < c) {
                colorEl = picker.down(".color-dynamic-" + i);
                colorEl.removeCls("dynamic-empty-color").dom.setAttribute("color", colors[i]);
                colorEl.down("span").setStyle("background-color", "#" + colors[i]).setStyle("border", "none");
            }
        }
    },
    _saveCustomColor: function (color) {
        var colors = localStorage["asc." + window.storagename + ".colors.custom"];
        colors = colors ? colors.split(",") : [];
        if (colors.push(color) > this.dyncolorscount) {
            colors.shift();
        }
        localStorage["asc." + window.storagename + ".colors.custom"] = colors.join().toUpperCase();
    },
    _menuBeforeShow: function () {
        this.updateCustomColors();
    }
});