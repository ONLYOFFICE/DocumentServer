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
 Ext.define("Common.component.MultiSliderGradient", {
    extend: "Ext.slider.Multi",
    requires: ([]),
    uses: [],
    alias: "widget.cmdmultislidergradient",
    cls: "asc-multi-slider-gradient",
    values: [0, 100],
    increment: 1,
    minValue: 0,
    maxValue: 100,
    clickRange: [1, 20],
    colorValues: ["#000000", "#ffffff"],
    currentThumb: 0,
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig);
        if (me.initialConfig.listeners && me.initialConfig.listeners.change) {
            var f = me.initialConfig.listeners.change;
            me.initialConfig.listeners.change = function (slider, newvalue, thumb) {
                me.changeGradientStyle();
                f.call(me, slider, newvalue, thumb);
            };
        }
        this.styleStr = "";
        if (Ext.isChrome && Ext.chromeVersion < 10 || Ext.isSafari && Ext.safariVersion < 5.1) {
            this.styleStr = "-webkit-gradient(linear, left top, right top, color-stop({1}%,{0}), color-stop({3}%,{2})); /* Chrome,Safari4+ */";
        } else {
            if (Ext.isChrome || Ext.isSafari) {
                this.styleStr = "-webkit-linear-gradient(left, {0} {1}%, {2} {3}%)";
            } else {
                if (Ext.isGecko) {
                    this.styleStr = "-moz-linear-gradient(left, {0} {1}%, {2} {3}%)";
                } else {
                    if (Ext.isOpera && Ext.operaVersion > 11) {
                        this.styleStr = "-o-linear-gradient(left, {0} {1}%, {2} {3}%)";
                    } else {
                        if (Ext.isIE) {
                            this.styleStr = "-ms-linear-gradient(left, {0} {1}%, {2} {3}%)";
                        }
                    }
                }
            }
        }
        this.callParent(arguments);
        this.addEvents("thumbclick");
        this.addEvents("thumbdblclick");
    },
    listeners: {
        afterrender: function (cmp) {
            var me = this,
            style = "";
            if (me.thumbs) {
                for (var i = 0; i < me.thumbs.length; i++) {
                    if (me.thumbs[i] && me.thumbs[i].tracker) {
                        me.thumbs[i].tracker.addListener("mousedown", Ext.bind(me.setActiveThumb, me, [i, true]), me);
                        me.thumbs[i].tracker.el.addListener("dblclick", function () {
                            me.fireEvent("thumbdblclick", me);
                        },
                        me);
                    }
                }
                me.setActiveThumb(0);
                if (me.innerEl) {
                    if (!Ext.isEmpty(me.styleStr)) {
                        style = Ext.String.format(me.styleStr, me.colorValues[0], 0, me.colorValues[1], 100);
                        me.innerEl.setStyle("background", style);
                    }
                    if (Ext.isIE) {
                        style = Ext.String.format("progid:DXImageTransform.Microsoft.gradient( startColorstr={0}, endColorstr={1},GradientType=1 )", me.colorValues[0], me.colorValues[1]);
                        me.innerEl.setStyle("filter", style);
                    }
                    style = Ext.String.format("linear-gradient(to right, {0} {1}%, {2} {3}%)", me.colorValues[0], 0, me.colorValues[1], 100);
                    me.innerEl.setStyle("background", style);
                }
            }
        }
    },
    setActiveThumb: function (index, fireevent) {
        this.currentThumb = index;
        this.thumbs[index].el.addCls("active-thumb");
        for (var j = 0; j < this.thumbs.length; j++) {
            if (index == j) {
                continue;
            }
            this.thumbs[j].el.removeCls("active-thumb");
        }
        if (fireevent) {
            this.fireEvent("thumbclick", this, index);
        }
    },
    setColorValue: function (color, index) {
        var ind = (index !== undefined) ? index : this.currentThumb;
        this.colorValues[ind] = color;
        this.changeGradientStyle();
    },
    getColorValue: function (index) {
        var ind = (index !== undefined) ? index : this.currentThumb;
        return this.colorValues[ind];
    },
    changeGradientStyle: function () {
        if (this.innerEl) {
            var style;
            if (!Ext.isEmpty(this.styleStr)) {
                style = Ext.String.format(this.styleStr, this.colorValues[0], this.getValue(0), this.colorValues[1], this.getValue(1));
                this.innerEl.setStyle("background", style);
            }
            if (Ext.isIE) {
                style = Ext.String.format("progid:DXImageTransform.Microsoft.gradient( startColorstr={0}, endColorstr={1},GradientType=1 )", this.colorValues[0], this.colorValues[1]);
                this.innerEl.setStyle("filter", style);
            }
            style = Ext.String.format("linear-gradient(to right, {0} {1}%, {2} {3}%)", this.colorValues[0], this.getValue(0), this.colorValues[1], this.getValue(1));
            this.innerEl.setStyle("background", style);
        }
    },
    getNearest: function (local, prop) {
        var me = this,
        localValue = prop == "top" ? me.innerEl.getHeight() - local[prop] : local[prop],
        clickValue = me.reverseValue(localValue),
        nearestDistance = (me.maxValue - me.minValue) + 5,
        index = 0,
        nearest = null,
        thumbs = me.thumbs,
        i = 0,
        len = thumbs.length,
        thumb,
        value,
        dist;
        for (; i < len; i++) {
            thumb = me.thumbs[i];
            value = thumb.value;
            dist = Math.abs(value - clickValue);
            if (Math.abs(dist <= nearestDistance)) {
                if (me.constrainThumbs) {
                    var above = me.thumbs[i + 1];
                    var below = me.thumbs[i - 1];
                    if (below !== undefined && clickValue < below.value) {
                        continue;
                    }
                    if (above !== undefined && clickValue > above.value) {
                        continue;
                    }
                }
                nearest = thumb;
                index = i;
                nearestDistance = dist;
            }
        }
        return nearest;
    }
});