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
 Ext.define("PE.component.CellStyler", {
    extend: "Ext.container.Container",
    requires: ["Common.component.util.RGBColor"],
    alias: "widget.pecellstyler",
    clickOffset: 10,
    overwriteStyle: true,
    maxBorderSize: 6,
    halfBorderSize: false,
    defaultBorderSize: 1,
    defaultBorderColor: "#ccc",
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig),
        divContent = undefined,
        virtualBorderSize = me.defaultBorderSize,
        virtualBorderColor = new Common.util.RGBColor(me.defaultBorderColor);
        var borderSize = {
            top: virtualBorderSize,
            right: virtualBorderSize,
            bottom: virtualBorderSize,
            left: virtualBorderSize
        };
        var borderColor = {
            top: virtualBorderColor,
            right: virtualBorderColor,
            bottom: virtualBorderColor,
            left: virtualBorderColor
        };
        var applyStyle = function () {
            if (Ext.isDefined(divContent)) {
                var drawLeftSize = (me.halfBorderSize) ? ((borderSize.left % 2) ? borderSize.left - 1 : borderSize.left) * 0.5 : borderSize.left,
                drawRightSize = (me.halfBorderSize) ? ((borderSize.right > 0 && borderSize.right * 0.5 < 1) ? 1 : ((borderSize.right % 2) ? borderSize.right + 1 : borderSize.right) * 0.5) : borderSize.right,
                drawTopSize = (me.halfBorderSize) ? ((borderSize.top % 2) ? borderSize.top - 1 : borderSize.top) * 0.5 : borderSize.top,
                drawBottomSize = (me.halfBorderSize) ? ((borderSize.bottom > 0 && borderSize.bottom * 0.5 < 1) ? 1 : ((borderSize.bottom % 2) ? borderSize.bottom + 1 : borderSize.bottom) * 0.5) : borderSize.bottom;
                var value = "inset " + drawLeftSize + "px" + " 0" + " 0 " + borderColor.left.toHex() + ", " + "inset " + -1 * drawRightSize + "px " + " 0" + " 0 " + borderColor.right.toHex() + ", " + "inset " + "0 " + drawTopSize + "px" + " 0 " + borderColor.top.toHex() + ", " + "inset " + "0 " + -1 * drawBottomSize + "px" + " 0 " + borderColor.bottom.toHex();
                divContent.setStyle("box-shadow", value);
            }
        };
        me.setBordersSize = function (borders, size) {
            size = (size > me.maxBorderSize) ? me.maxBorderSize : size;
            if (borders.indexOf("t") > -1) {
                borderSize.top = size;
            }
            if (borders.indexOf("r") > -1) {
                borderSize.right = size;
            }
            if (borders.indexOf("b") > -1) {
                borderSize.bottom = size;
            }
            if (borders.indexOf("l") > -1) {
                borderSize.left = size;
            }
            applyStyle();
        };
        me.setBordersColor = function (borders, color) {
            var newColor = new Common.util.RGBColor(color);
            if (borders.indexOf("t") > -1) {
                borderColor.top = newColor;
            }
            if (borders.indexOf("r") > -1) {
                borderColor.right = newColor;
            }
            if (borders.indexOf("b") > -1) {
                borderColor.bottom = newColor;
            }
            if (borders.indexOf("l") > -1) {
                borderColor.left = newColor;
            }
            applyStyle();
        };
        me.getBorderSize = function (border) {
            switch (border) {
            case "t":
                return borderSize.top;
            case "r":
                return borderSize.right;
            case "b":
                return borderSize.bottom;
            case "l":
                return borderSize.left;
            }
            return null;
        };
        me.getBorderColor = function (border) {
            switch (border) {
            case "t":
                return borderColor.top.toHex();
            case "r":
                return borderColor.right.toHex();
            case "b":
                return borderColor.bottom.toHex();
            case "l":
                return borderColor.left.toHex();
            }
            return null;
        };
        me.setVirtualBorderSize = function (size) {
            virtualBorderSize = (size > me.maxBorderSize) ? me.maxBorderSize : size;
        };
        me.setVirtualBorderColor = function (color) {
            var newColor = new Common.util.RGBColor(color);
            if (virtualBorderColor.isEqual(newColor)) {
                return;
            }
            virtualBorderColor = newColor;
        };
        me.getVirtualBorderSize = function () {
            return virtualBorderSize;
        };
        me.getVirtualBorderColor = function () {
            return virtualBorderColor.toHex();
        };
        me.addListener("afterrender", function () {
            var selfEl = me.getEl();
            if (selfEl) {
                divContent = selfEl.down(".cell-content");
                applyStyle();
            }
            selfEl.on("click", function (event) {
                var pos = {
                    x: event.browserEvent.offsetX || (Ext.isDefined(event.browserEvent.layerX) ? event.browserEvent.layerX : 0),
                    y: event.browserEvent.offsetY || (Ext.isDefined(event.browserEvent.layerY) ? event.browserEvent.layerY : 0)
                };
                var ptInPoly = function (npol, xp, yp, x, y) {
                    var i, j, c = 0;
                    for (i = 0, j = npol - 1; i < npol; j = i++) {
                        if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) && (x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
                            c = !c;
                        }
                    }
                    return c;
                };
                var meWidth = selfEl.getWidth();
                var meHeight = selfEl.getHeight();
                if (ptInPoly(4, [0, meWidth, meWidth - me.clickOffset, me.clickOffset], [0, 0, me.clickOffset, me.clickOffset], pos.x, pos.y)) {
                    if (me.overwriteStyle) {
                        if (borderSize.top != virtualBorderSize || !borderColor.top.isEqual(virtualBorderColor)) {
                            borderSize.top = virtualBorderSize;
                            borderColor.top = virtualBorderColor;
                        } else {
                            borderSize.top = 0;
                        }
                    } else {
                        borderSize.top = (borderSize.top > 0) ? 0 : virtualBorderSize;
                        borderColor.top = virtualBorderColor;
                    }
                    me.fireEvent("borderclick", me, "t", borderSize.top, borderColor.top.toHex());
                } else {
                    if (ptInPoly(4, [meWidth, meWidth, meWidth - me.clickOffset, meWidth - me.clickOffset], [0, meHeight, meHeight - me.clickOffset, me.clickOffset], pos.x, pos.y)) {
                        if (me.overwriteStyle) {
                            if (borderSize.right != virtualBorderSize || !borderColor.right.isEqual(virtualBorderColor)) {
                                borderSize.right = virtualBorderSize;
                                borderColor.right = virtualBorderColor;
                            } else {
                                borderSize.right = 0;
                            }
                        } else {
                            borderSize.right = (borderSize.right > 0) ? 0 : virtualBorderSize;
                            borderColor.right = virtualBorderColor;
                        }
                        me.fireEvent("borderclick", me, "r", borderSize.right, borderColor.right.toHex());
                    } else {
                        if (ptInPoly(4, [0, me.clickOffset, meWidth - me.clickOffset, meWidth], [meHeight, meHeight - me.clickOffset, meHeight - me.clickOffset, meHeight], pos.x, pos.y)) {
                            if (me.overwriteStyle) {
                                if (borderSize.bottom != virtualBorderSize || !borderColor.bottom.isEqual(virtualBorderColor)) {
                                    borderSize.bottom = virtualBorderSize;
                                    borderColor.bottom = virtualBorderColor;
                                } else {
                                    borderSize.bottom = 0;
                                }
                            } else {
                                borderSize.bottom = (borderSize.bottom > 0) ? 0 : virtualBorderSize;
                                borderColor.bottom = virtualBorderColor;
                            }
                            me.fireEvent("borderclick", me, "b", borderSize.bottom, borderColor.bottom.toHex());
                        } else {
                            if (ptInPoly(4, [0, me.clickOffset, me.clickOffset, 0], [0, me.clickOffset, meHeight - me.clickOffset, meHeight], pos.x, pos.y)) {
                                if (me.overwriteStyle) {
                                    if (borderSize.left != virtualBorderSize || !borderColor.left.isEqual(virtualBorderColor)) {
                                        borderSize.left = virtualBorderSize;
                                        borderColor.left = virtualBorderColor;
                                    } else {
                                        borderSize.left = 0;
                                    }
                                } else {
                                    borderSize.left = (borderSize.left > 0) ? 0 : virtualBorderSize;
                                    borderColor.left = virtualBorderColor;
                                }
                                me.fireEvent("borderclick", me, "l", borderSize.left, borderColor.left.toHex());
                            }
                        }
                    }
                }
                applyStyle();
            });
        });
        Ext.apply(me, {
            cls: "tablestyler-cell",
            html: '<div class="cell-content" style="width: 100%; height: 100%;"><div class="content-text"></div></div>'
        },
        cfg);
        me.callParent(arguments);
    }
});