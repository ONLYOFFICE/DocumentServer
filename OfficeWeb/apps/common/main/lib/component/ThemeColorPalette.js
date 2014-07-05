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
 Ext.define("Common.component.ThemeColorPalette", {
    extend: "Ext.ColorPalette",
    alias: "widget.cmpthemecolorpalette",
    allowReselect: true,
    dyncolorscount: 12,
    width: 193,
    maxWidth: 200,
    baseCls: "cmp-theme-colorpalette",
    requires: ["Common.view.ExtendedColorDialog"],
    renderTpl: ['<div style="padding: 12px;">', '<tpl for="colors">', '<tpl if="this.isBlankSeparator(values)"><div class="palette-color-spacer" style="width:100%;height:8px;float:left;"></div></tpl>', '<tpl if="this.isSeparator(values)"></div><div class="palette-color-separator" style="width:100%;height:1px;float:left;border-bottom: 1px solid #E0E0E0"></div><div style="padding: 12px;"></tpl>', '<tpl if="this.isColor(values)">', '<a href="#" class="palette-color color-{.}" style="background:#{.} "hidefocus="on">', '<em><span style="background:#{.}; border: 1px solid rgba(0, 0, 0, 0.2);" unselectable="on">&#160;</span></em>', "</a>", "</tpl>", '<tpl if="this.isTransparent(values)">', '<a href="#" class="color-{.}" hidefocus="on">', '<em><span unselectable="on">&#160;</span></em>', "</a>", "</tpl>", '<tpl if="this.isCustom(values)">', '<a href="#" id="{id}" class="palette-color-custom {cls}" hidefocus="on">', '<em><span style="background:#FFFFFF;background-image:url({image});" unselectable="on">&#160;</span></em>', "</a>", "</tpl>", '<tpl if="this.isEffect(values)">', '<a href="#" effectid="{effectId}" effectvalue="{effectValue}" class="palette-color-effect color-{color}" style="background:#{color}" hidefocus="on">', '<em><span style="background:#{color}; border: 1px solid rgba(0, 0, 0, 0.2);" unselectable="on">&#160;</span></em>', "</a>", "</tpl>", '<tpl if="this.isCaption(values)"><div class="palette-color-caption" style="width:100%;float:left;font-size: 11px;">{.}</div></tpl>', "</tpl>", "</div>", {
        isBlankSeparator: function (v) {
            return typeof(v) == "string" && v == "-";
        },
        isSeparator: function (v) {
            return typeof(v) == "string" && v == "--";
        },
        isColor: function (v) {
            return typeof(v) == "string" && (/[0-9A-F]{6}/).test(v);
        },
        isTransparent: function (v) {
            return typeof(v) == "string" && (v == "transparent");
        },
        isCaption: function (v) {
            return (typeof(v) == "string" && v != "-" && v != "--" && !(/[0-9A-F]{6}|transparent/).test(v));
        },
        isEffect: function (v) {
            return (typeof(v) == "object" && v.effectId !== undefined);
        },
        isCustom: function (v) {
            return (typeof(v) == "object" && v.effectId === undefined);
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
                colors = '<div class="palette-color-spacer" style="width:100%;height:8px;float:left;"></div><div style="padding: 12px;">';
                while (++i < this.dyncolorscount) {
                    colors += Ext.String.format('<a href="#" class="color-dynamic-{0} dynamic-empty-color" style="background:#ffffff" color="" hidefocus="on">' + '<em><span unselectable="on">&#160;</span></em></a>', i);
                }
                colors += "</div>";
                Ext.DomHelper.insertHtml("beforeEnd", picker.dom, colors);
            }
        }
        var menu = this.el.up(".x-menu");
        if (menu) {
            Ext.menu.Manager.menus[menu.id].addListener("beforeshow", this.updateCustomColors, this);
        }
        this.updateCustomColors();
    },
    afterRender: function (o) {
        this.callParent(arguments);
        if (this.updateColorsArr) {
            this.updateColors(this.updateColorsArr[0], this.updateColorsArr[1]);
        }
        if (this.lastvalue) {
            this.select(this.lastvalue, true);
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
        if (!this.rendered) {
            this.lastvalue = color;
            return;
        }
        var el = this.getEl();
        if (el) {
            $("#" + el.id + " a." + this.selectedCls).removeClass(this.selectedCls);
        }
        if (typeof(color) == "object") {
            var effectEl;
            if (color.effectId !== undefined) {
                effectEl = el.down('a[effectid="' + color.effectId + '"]');
                if (effectEl) {
                    effectEl.addCls(this.selectedCls);
                    this.value = effectEl.dom.className.match(this.colorRe)[1].toUpperCase();
                } else {
                    this.value = false;
                }
            } else {
                if (color.effectValue !== undefined) {
                    effectEl = el.down('a[effectvalue="' + color.effectValue + '"].color-' + color.color.toUpperCase());
                    if (effectEl) {
                        effectEl.addCls(this.selectedCls);
                        this.value = effectEl.dom.className.match(this.colorRe)[1].toUpperCase();
                    } else {
                        this.value = false;
                    }
                }
            }
        } else {
            if (/#?[a-fA-F0-9]{6}/.test(color)) {
                color = /#?([a-fA-F0-9]{6})/.exec(color)[1].toUpperCase();
                this.value = color;
            }
            if (/^[a-fA-F0-9]{6}|transparent$/.test(color) && Ext.Array.contains(this.colors, color)) {
                if (!Ext.Array.contains(this.colors, this.value)) {
                    this.value = false;
                }
                if (color != this.value || this.allowReselect) {
                    if (this.value) {
                        (this.value == "transparent") ? el.down("a.color-transparent").removeCls(this.selectedCls) : el.down("a.palette-color.color-" + this.value).removeCls(this.selectedCls);
                    } (color == "transparent") ? el.down("a.color-transparent").addCls(this.selectedCls) : el.down("a.palette-color.color-" + color).addCls(this.selectedCls);
                    this.value = color;
                    if (suppressEvent !== true) {
                        this.fireEvent("select", this, color);
                    }
                }
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
                            if (this.dynamiccolors) {}
                        }
                    }
                } else {
                    this.lastvalue = color;
                }
            }
        }
    },
    handleClick: function (event, target) {
        var me = this;
        var color, cmp;
        if (! (target.className.search("palette-color-custom") < 0)) {
            event.stopEvent();
            cmp = Ext.get(target.parentNode).down("a." + me.selectedCls);
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
                cmp = Ext.get(target.parentNode).down("a." + me.selectedCls);
                if (!cmp || cmp.id != target.id) {
                    if (cmp) {
                        cmp.removeCls(me.selectedCls);
                    }
                    Ext.get(target).addCls(me.selectedCls);
                    me.value = "transparent";
                }
                me.fireEvent("select", me, "transparent");
            } else {
                if (! (target.className.search("color-dynamic") < 0)) {
                    if (!/dynamic-empty-color/.test(target.className)) {
                        color = target.getAttribute("color");
                        if (color) {
                            me.fireEvent("select", me, color);
                        }
                        this.value = color.toUpperCase();
                        $("#" + this.getEl().id + " a." + me.selectedCls).removeClass(me.selectedCls);
                        Ext.get(target).addCls(me.selectedCls);
                    } else {
                        setTimeout(function () {
                            me.addNewColor();
                            Ext.menu.Manager.hideAll();
                        },
                        10);
                    }
                } else {
                    cmp = Ext.get(target.parentNode).down("a.palette-color-custom");
                    if (cmp) {
                        cmp.removeCls(me.selectedCls);
                    }
                    if (!/^[a-fA-F0-9]{6}$/.test(this.value) || !Ext.Array.contains(this.colors, this.value)) {
                        this.value = false;
                    }
                    if (! (target.className.search("palette-color-effect") < 0)) {
                        color = target.className.match(me.colorRe)[1];
                        var effectId = target.getAttribute("effectid");
                        if (color) {
                            me.fireEvent("select", me, {
                                color: color,
                                effectId: effectId
                            });
                            this.value = color.toUpperCase();
                        }
                        $("#" + this.getEl().id + " a." + me.selectedCls).removeClass(me.selectedCls);
                        Ext.get(target).addCls(me.selectedCls);
                    } else {
                        this.callParent(arguments);
                    }
                }
            }
        }
    },
    addNewColor: function () {
        var me = this;
        var win = Ext.create("Common.view.ExtendedColorDialog", {});
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
    updateColors: function (effectcolors, standartcolors) {
        if (!this.rendered) {
            this.updateColorsArr = [effectcolors, (standartcolors.length == 0 && this.updateColorsArr) ? this.updateColorsArr[1] : standartcolors];
            return;
        }
        var me = this,
        el = this.getEl();
        if (me.aColorElements === undefined) {
            me.aColorElements = el.query("a.palette-color");
        }
        if (me.aEffectElements === undefined) {
            me.aEffectElements = el.query("a.palette-color-effect");
        }
        var aEl;
        var aColorIdx = 0,
        aEffectIdx = 0;
        for (var i = 0; i < me.colors.length; i++) {
            if (typeof(me.colors[i]) == "string" && (/[0-9A-F]{6}/).test(me.colors[i])) {
                if (aColorIdx >= standartcolors.length) {
                    continue;
                }
                aEl = Ext.get(me.aColorElements[aColorIdx]);
                aEl.removeCls("color-" + me.colors[i]);
                me.colors[i] = standartcolors[aColorIdx].toUpperCase();
                aEl.addCls("color-" + me.colors[i]);
                aEl.applyStyles({
                    background: "#" + me.colors[i]
                });
                aEl.down("span").applyStyles({
                    background: "#" + me.colors[i]
                });
                aColorIdx++;
            } else {
                if (typeof(me.colors[i]) == "object" && me.colors[i].effectId !== undefined) {
                    if (aEffectIdx >= effectcolors.length) {
                        continue;
                    }
                    aEl = Ext.get(me.aEffectElements[aEffectIdx]);
                    effectcolors[aEffectIdx].color = effectcolors[aEffectIdx].color.toUpperCase();
                    if (me.colors[i].color !== effectcolors[aEffectIdx].color) {
                        aEl.removeCls("color-" + me.colors[i].color);
                        aEl.addCls("color-" + effectcolors[aEffectIdx].color);
                        aEl.applyStyles({
                            background: "#" + effectcolors[aEffectIdx].color
                        });
                        aEl.down("span").applyStyles({
                            background: "#" + effectcolors[aEffectIdx].color
                        });
                    }
                    if (me.colors[i].effectId !== effectcolors[aEffectIdx].effectId) {
                        aEl.set({
                            effectid: effectcolors[aEffectIdx].effectId
                        });
                    }
                    if (me.colors[i].effectValue !== effectcolors[aEffectIdx].effectValue) {
                        aEl.set({
                            effectvalue: effectcolors[aEffectIdx].effectValue
                        });
                    }
                    me.colors[i] = effectcolors[aEffectIdx];
                    aEffectIdx++;
                }
            }
        }
        this.updateColorsArr = undefined;
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