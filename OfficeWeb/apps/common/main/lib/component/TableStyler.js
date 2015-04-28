/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 if (Common === undefined) {
    var Common = {};
}
define(["common/main/lib/component/BaseView"], function () {
    Common.UI.CellStyler = Common.UI.BaseView.extend({
        options: {
            clickOffset: 10,
            overwriteStyle: true,
            maxBorderSize: 6,
            halfBorderSize: false,
            defaultBorderSize: 1,
            defaultBorderColor: "#ccc"
        },
        template: _.template(['<div id="<%=id%>" class="tablestyler-cell" style="">', '<div class="cell-content" style="">', '<div class="content-text"></div>', "</div>", "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            divContent = undefined,
            virtualBorderSize, virtualBorderColor, borderSize = {},
            borderColor = {},
            borderAlfa = {};
            me.id = me.options.id || Common.UI.getId();
            me.clickOffset = me.options.clickOffset;
            me.overwriteStyle = me.options.overwriteStyle;
            me.maxBorderSize = me.options.maxBorderSize;
            me.halfBorderSize = me.options.halfBorderSize;
            me.defaultBorderSize = me.options.defaultBorderSize;
            me.defaultBorderColor = me.options.defaultBorderColor;
            me.col = me.options.col;
            me.row = me.options.row;
            virtualBorderSize = me.defaultBorderSize;
            virtualBorderColor = new Common.Utils.RGBColor(me.defaultBorderColor);
            borderSize = {
                top: virtualBorderSize,
                right: virtualBorderSize,
                bottom: virtualBorderSize,
                left: virtualBorderSize
            };
            borderColor = {
                top: virtualBorderColor,
                right: virtualBorderColor,
                bottom: virtualBorderColor,
                left: virtualBorderColor
            };
            borderAlfa = {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            };
            me.rendered = false;
            var applyStyle = function () {
                if (!_.isUndefined(divContent)) {
                    var brd = (borderSize.left > 0.1 && borderSize.left < 1) ? 1 : borderSize.left;
                    var drawLeftSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd - 1 : brd) * 0.5 : brd);
                    brd = (borderSize.right > 0.1 && borderSize.right < 1) ? 1 : borderSize.right;
                    var drawRightSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd + 1 : brd) * 0.5 : brd);
                    brd = (borderSize.top > 0.1 && borderSize.top < 1) ? 1 : borderSize.top;
                    var drawTopSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd - 1 : brd) * 0.5 : brd);
                    brd = (borderSize.bottom > 0.1 && borderSize.bottom < 1) ? 1 : borderSize.bottom;
                    var drawBottomSize = Math.abs((me.halfBorderSize) ? ((brd % 2) ? brd + 1 : brd) * 0.5 : brd);
                    var value = "inset " + ((drawLeftSize > 0.1 && drawLeftSize < 1) ? 1 : drawLeftSize) + "px" + " 0" + " 0 " + borderColor.left.toRGBA(borderAlfa.left) + ", " + "inset " + -1 * ((drawRightSize > 0.1 && drawRightSize < 1) ? 1 : drawRightSize) + "px" + " 0" + " 0 " + borderColor.right.toRGBA(borderAlfa.right) + ", " + "inset " + "0 " + ((drawTopSize > 0.1 && drawTopSize < 1) ? 1 : drawTopSize) + "px" + " 0 " + borderColor.top.toRGBA(borderAlfa.top) + ", " + "inset " + "0 " + -1 * ((drawBottomSize > 0.1 && drawBottomSize < 1) ? 1 : drawBottomSize) + "px" + " 0 " + borderColor.bottom.toRGBA(borderAlfa.bottom);
                    divContent.css("box-shadow", value);
                }
            };
            me.on("render:after", function (cmp) {
                if (this.cmpEl) {
                    divContent = this.cmpEl.find(".cell-content");
                    applyStyle();
                }
                this.cmpEl.on("click", function (event) {
                    var pos = {
                        x: event.pageX - me.cmpEl.offset().left,
                        y: event.pageY - me.cmpEl.offset().top
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
                    var meWidth = me.cmpEl.outerWidth();
                    var meHeight = me.cmpEl.outerHeight();
                    if (ptInPoly(4, [0, meWidth, meWidth - me.clickOffset, me.clickOffset], [0, 0, me.clickOffset, me.clickOffset], pos.x, pos.y)) {
                        if (me.overwriteStyle) {
                            if (borderSize.top != virtualBorderSize || !borderColor.top.isEqual(virtualBorderColor)) {
                                borderSize.top = virtualBorderSize;
                                borderColor.top = virtualBorderColor;
                                borderAlfa.top = (virtualBorderSize < 1) ? 0.3 : 1;
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
                                    borderAlfa.right = (virtualBorderSize < 1) ? 0.3 : 1;
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
                                        borderAlfa.bottom = (virtualBorderSize < 1) ? 0.3 : 1;
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
                                            borderAlfa.left = (virtualBorderSize < 1) ? 0.3 : 1;
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
            me.setBordersSize = function (borders, size) {
                size = (size > this.maxBorderSize) ? this.maxBorderSize : size;
                if (borders.indexOf("t") > -1) {
                    borderSize.top = size;
                    borderAlfa.top = (size < 1) ? 0.3 : 1;
                }
                if (borders.indexOf("r") > -1) {
                    borderSize.right = size;
                    borderAlfa.right = (size < 1) ? 0.3 : 1;
                }
                if (borders.indexOf("b") > -1) {
                    borderSize.bottom = size;
                    borderAlfa.bottom = (size < 1) ? 0.3 : 1;
                }
                if (borders.indexOf("l") > -1) {
                    borderSize.left = size;
                    borderAlfa.left = (size < 1) ? 0.3 : 1;
                }
                applyStyle();
            };
            me.setBordersColor = function (borders, color) {
                var newColor = new Common.Utils.RGBColor(color);
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
                virtualBorderSize = (size > this.maxBorderSize) ? this.maxBorderSize : size;
            };
            me.setVirtualBorderColor = function (color) {
                var newColor = new Common.Utils.RGBColor(color);
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
            if (me.options.el) {
                me.render();
            }
        },
        render: function (parentEl) {
            var me = this;
            this.trigger("render:before", this);
            if (!me.rendered) {
                this.cmpEl = $(this.template({
                    id: this.id
                }));
                if (parentEl) {
                    this.setElement(parentEl, false);
                    parentEl.html(this.cmpEl);
                } else {
                    $(this.el).html(this.cmpEl);
                }
            } else {
                this.cmpEl = $(this.el);
            }
            me.rendered = true;
            this.trigger("render:after", this);
            return this;
        }
    });
    Common.UI.TableStyler = Common.UI.BaseView.extend({
        options: {
            width: 200,
            height: 200,
            rows: 2,
            columns: 2,
            cellPadding: 10,
            tablePadding: 10,
            overwriteStyle: true,
            maxBorderSize: 6,
            spacingMode: false,
            defaultBorderSize: 1,
            defaultBorderColor: "#ccc"
        },
        template: _.template(['<div id="<%=scope.id%>" class="table-styler" style="position: relative; width: <%=scope.width%>px; height:<%=scope.height%>px;">', '<div style="position: absolute; left: 0; top: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px; border-bottom: 1px dotted gray; border-right: 1px dotted gray;"></div>', '<div style="position: absolute; left: <%=scope.tablePadding%>px; top: 0; right: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;">', '<div id="<%=scope.id%>-table-top-border-selector" style="position: absolute; z-index: 1; height: <%=scope.tablePadding%>px; left: 0; right: 0; top:  <%=scope.tablePadding * .5%>px;">', '<table width="100%" height="100%">', "<tr>", '<td id="<%=scope.id%>-table-top-border" style="height:50%; border-bottom: <%=borderSize.top%>px solid <%borderColor.top.toHex()%>;"></td>', "</tr>", "<tr>", "<td></td>", "</tr>", "</table>", "</div>", "</div>", '<div style="position: absolute; top: 0; right: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px; border-bottom: 1px dotted gray; border-left: 1px dotted gray;"></div>', '<div style="position: absolute; left: 0; top: <%=scope.tablePadding%>px; width: <%=scope.tablePadding%>px; height: <%=scope.height - 2 * scope.tablePadding%>px;">', '<div id="<%=scope.id%>-table-left-border-selector" style="position: absolute; z-index: 1; left: <%=scope.tablePadding * .5%>px; top: 0; bottom: 0; width: <%=scope.tablePadding%>px;">', '<table width="100%" height="100%">', "<tr>", '<td id="<%=scope.id%>-table-left-border" style="border-right: <%=borderSize.left%>px solid <%=borderColor.left.toHex()%>;"></td>', '<td width="50%"></td>', "</tr>", "</table>", "</div>", "</div>", '<div style="position: absolute; left: <%=scope.tablePadding%>px; top: <%=scope.tablePadding%>px; right: <%=scope.tablePadding%>px; bottom: <%=scope.tablePadding%>px;">', '<table cols="<%=scope.columns%>" width="100%" height="100%" style="border-collapse: inherit; border-spacing: <%= scope.spacingMode ? scope.cellPadding : 0 %>px;">', "<% for (var row = 0; row < scope.rows; row++) { %>", "<tr>", "<% for (var col = 0; col < scope.columns; col++) { %>", '<td id="<%=scope.id%>-cell-container-<%=col%>-<%=row%>" class="content-box"></td>', "<% } %>", "</tr>", "<% } %>", "</table>", "</div>", '<div style="position: absolute; right: 0; top: <%=scope.tablePadding%>px; width: <%=scope.tablePadding%>px; height: <%=scope.height - 2 * scope.tablePadding%>px;">', '<div id="<%=scope.id%>-table-right-border-selector" style="position: absolute; z-index: 1; right: <%=scope.tablePadding * .5%>px; top: 0; bottom: 0; width: <%=scope.tablePadding%>px;">', '<table width="100%" height="100%">', "<tr>", '<td id="<%=scope.id%>-table-right-border" style="border-right: <%=borderSize.right%>px solid <%=borderColor.right.toHex()%>;"></td>', '<td width="50%"></td>', "</tr>", "</table>", "</div>", "</div>", '<div style="position: absolute; left: 0; bottom: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px; border-top: 1pt dotted gray; border-right: 1pt dotted gray;"></div>', '<div style="position: absolute; left: <%=scope.tablePadding%>px; bottom: 0; right: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px;">', '<div id="<%=scope.id%>-table-bottom-border-selector" style="position: absolute; z-index: 1; height: <%=scope.tablePadding%>px; left: 0; right: 0; bottom:  <%=scope.tablePadding * .5%>px;">', '<table width="100%" height="100%">', "<tr>", '<td id="<%=scope.id%>-table-bottom-border" style="height:50%; border-bottom: <%=borderSize.bottom%>px solid <%=borderColor.bottom.toHex()%>;"></td>', "</tr>", "<tr>", "<td></td>", "</tr>", "</table>", "</div>", "</div>", '<div style="position: absolute; bottom: 0; right: 0; width: <%=scope.tablePadding%>px; height: <%=scope.tablePadding%>px; border-top: 1pt dotted gray; border-left: 1pt dotted gray;"></div>', "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            topBorder, rightBorder, bottomBorder, leftBorder, topBorderSelector, rightBorderSelector, bottomBorderSelector, leftBorderSelector, virtualBorderSize, virtualBorderColor;
            me.id = me.options.id || Common.UI.getId();
            me.width = me.options.width;
            me.height = me.options.height;
            me.rows = me.options.rows;
            me.columns = me.options.columns;
            me.cellPadding = me.options.cellPadding;
            me.tablePadding = me.options.tablePadding;
            me.overwriteStyle = me.options.overwriteStyle;
            me.maxBorderSize = me.options.maxBorderSize;
            me.spacingMode = me.options.spacingMode;
            me.defaultBorderSize = me.options.defaultBorderSize;
            me.defaultBorderColor = me.options.defaultBorderColor;
            virtualBorderSize = (me.defaultBorderSize > me.maxBorderSize) ? me.maxBorderSize : me.defaultBorderSize;
            virtualBorderColor = new Common.Utils.RGBColor(me.defaultBorderColor);
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
            me.rendered = false;
            var applyStyles = function () {
                topBorder && topBorder.css("border-bottom", ((borderSize.top > 0.1 && borderSize.top < 1) ? 1 : borderSize.top) + "px solid " + borderColor.top.toRGBA((borderSize.top < 1) ? 0.2 : 1));
                rightBorder && rightBorder.css("border-right", ((borderSize.right > 0.1 && borderSize.right < 1) ? 1 : borderSize.right) + "px solid " + borderColor.right.toRGBA((borderSize.right < 1) ? 0.2 : 1));
                bottomBorder && bottomBorder.css("border-bottom", ((borderSize.bottom > 0.1 && borderSize.bottom < 1) ? 1 : borderSize.bottom) + "px solid " + borderColor.bottom.toRGBA((borderSize.bottom < 1) ? 0.2 : 1));
                leftBorder && leftBorder.css("border-right", ((borderSize.left > 0.1 && borderSize.left < 1) ? 1 : borderSize.left) + "px solid " + borderColor.left.toRGBA((borderSize.left < 1) ? 0.2 : 1));
                redraw(topBorderSelector);
                redraw(rightBorderSelector);
                redraw(bottomBorderSelector);
                redraw(leftBorderSelector);
            };
            var redraw = function (el) {
                return el.hide(0, function () {
                    $(this).show();
                });
            };
            me.on("render:after", function (cmp) {
                var meId = me.id;
                topBorder = $("#" + meId + "-table-top-border");
                rightBorder = $("#" + meId + "-table-right-border");
                bottomBorder = $("#" + meId + "-table-bottom-border");
                leftBorder = $("#" + meId + "-table-left-border");
                topBorderSelector = $("#" + meId + "-table-top-border-selector");
                rightBorderSelector = $("#" + meId + "-table-right-border-selector");
                bottomBorderSelector = $("#" + meId + "-table-bottom-border-selector");
                leftBorderSelector = $("#" + meId + "-table-left-border-selector");
                topBorderSelector.on("click", function (e) {
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
                    topBorder.css("border-bottom", ((borderSize.top > 0.1 && borderSize.top < 1) ? 1 : borderSize.top) + "px solid " + borderColor.top.toRGBA((borderSize.top < 1) ? 0.2 : 1));
                    redraw(topBorderSelector);
                    me.fireEvent("borderclick", me, "t", borderSize.top, borderColor.top.toHex());
                });
                rightBorderSelector.on("click", function (e) {
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
                    rightBorder.css("border-right", ((borderSize.right > 0.1 && borderSize.right < 1) ? 1 : borderSize.right) + "px solid " + borderColor.right.toRGBA((borderSize.right < 1) ? 0.2 : 1));
                    redraw(rightBorderSelector);
                    me.fireEvent("borderclick", me, "r", borderSize.right, borderColor.right.toHex());
                });
                bottomBorderSelector.on("click", function (e) {
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
                    bottomBorder.css("border-bottom", ((borderSize.bottom > 0.1 && borderSize.bottom < 1) ? 1 : borderSize.bottom) + "px solid " + borderColor.bottom.toRGBA((borderSize.bottom < 1) ? 0.2 : 1));
                    redraw(bottomBorderSelector);
                    me.fireEvent("borderclick", me, "b", borderSize.bottom, borderColor.bottom.toHex());
                });
                leftBorderSelector.on("click", function (e) {
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
                    leftBorder.css("border-right", ((borderSize.left > 0.1 && borderSize.left < 1) ? 1 : borderSize.left) + "px solid " + borderColor.left.toRGBA((borderSize.left < 1) ? 0.2 : 1));
                    redraw(leftBorderSelector);
                    me.fireEvent("borderclick", me, "l", borderSize.left, borderColor.left.toHex());
                });
            });
            me.getVirtualBorderSize = function () {
                return virtualBorderSize;
            };
            me.getVirtualBorderColor = function () {
                return virtualBorderColor.toHex();
            };
            me.setVirtualBorderSize = function (size) {
                size = (size > me.maxBorderSize) ? me.maxBorderSize : size;
                virtualBorderSize = size;
                for (var row = 0; row < me.rows; row++) {
                    for (var col = 0; col < me.columns; col++) {
                        var cell = me.getCell(col, row);
                        cell.setVirtualBorderSize(size);
                    }
                }
            };
            me.setVirtualBorderColor = function (color) {
                var newColor = new Common.Utils.RGBColor(color);
                if (virtualBorderColor.isEqual(newColor)) {
                    return;
                }
                virtualBorderColor = newColor;
                for (var row = 0; row < me.rows; row++) {
                    for (var col = 0; col < me.columns; col++) {
                        var cell = me.getCell(col, row);
                        cell.setVirtualBorderColor(virtualBorderColor.toHex());
                    }
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
                applyStyles();
            };
            me.setBordersColor = function (borders, color) {
                var newColor = new Common.Utils.RGBColor(color);
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
                applyStyles();
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
            if (me.options.el) {
                me.render(null, {
                    borderSize: borderSize,
                    borderColor: borderColor,
                    virtualBorderSize: virtualBorderSize,
                    virtualBorderColor: virtualBorderColor
                });
            }
        },
        render: function (parentEl) {
            var me = this,
            cfg = arguments[1];
            this.trigger("render:before", this);
            if (!me.rendered) {
                this.cmpEl = $(this.template(_.extend({
                    scope: me
                },
                cfg)));
                if (parentEl) {
                    this.setElement(parentEl, false);
                    this.setElement(parentEl, false);
                    parentEl.html(this.cmpEl);
                } else {
                    $(this.el).html(this.cmpEl);
                }
            } else {
                this.cmpEl = $(this.el);
            }
            if (!me.rendered) {
                var el = this.cmpEl;
                this._cells = [];
                for (var row = 0; row < me.rows; row++) {
                    for (var col = 0; col < me.columns; col++) {
                        var cellStyler = new Common.UI.CellStyler({
                            el: $("#" + me.id + "-cell-container-" + col + "-" + row),
                            overwriteStyle: me.overwriteStyle,
                            halfBorderSize: !me.spacingMode,
                            defaultBorderSize: me.spacingMode ? cfg.virtualBorderSize : 0,
                            defaultBorderColor: cfg.virtualBorderColor.toHex(),
                            id: me.id + "-cell-" + col + "-" + row,
                            col: col,
                            row: row
                        });
                        this._cells.push(cellStyler);
                        cellStyler.on("borderclick", function (cell, type, size, color) {
                            var cellCol, cellRow, curCell;
                            if (type == "t") {
                                if (cell.row > 0) {
                                    for (cellCol = 0; cellCol < me.columns; cellCol++) {
                                        curCell = me.getCell(cellCol, cell.row - 1);
                                        curCell.setBordersSize("b", size);
                                        curCell.setBordersColor("b", color);
                                    }
                                }
                                for (cellCol = 0; cellCol < me.columns; cellCol++) {
                                    curCell = me.getCell(cellCol, cell.row);
                                    if (cell.halfBorderSize && cell.row < 1) {
                                        curCell.setBordersSize("t", 0);
                                    } else {
                                        curCell.setBordersSize("t", size);
                                    }
                                    curCell.setBordersColor("t", color);
                                }
                            } else {
                                if (type == "b") {
                                    if (cell.row < me.rows - 1) {
                                        for (cellCol = 0; cellCol < me.columns; cellCol++) {
                                            curCell = me.getCell(cellCol, cell.row + 1);
                                            curCell.setBordersSize("t", size);
                                            curCell.setBordersColor("t", color);
                                        }
                                    }
                                    for (cellCol = 0; cellCol < me.columns; cellCol++) {
                                        curCell = me.getCell(cellCol, cell.row);
                                        if (cell.halfBorderSize && cell.row >= me.rows - 1) {
                                            curCell.setBordersSize("b", 0);
                                        } else {
                                            curCell.setBordersSize("b", size);
                                        }
                                        curCell.setBordersColor("b", color);
                                    }
                                } else {
                                    if (type == "l") {
                                        if (cell.col > 0) {
                                            for (cellRow = 0; cellRow < me.rows; cellRow++) {
                                                curCell = me.getCell(cell.col - 1, cellRow);
                                                curCell.setBordersSize("r", size);
                                                curCell.setBordersColor("r", color);
                                            }
                                        }
                                        for (cellRow = 0; cellRow < me.rows; cellRow++) {
                                            curCell = me.getCell(cell.col, cellRow);
                                            if (cell.halfBorderSize && cell.col < 1) {
                                                curCell.setBordersSize("l", 0);
                                            } else {
                                                curCell.setBordersSize("l", size);
                                            }
                                            curCell.setBordersColor("l", color);
                                        }
                                    } else {
                                        if (type == "r") {
                                            if (cell.col < me.columns - 1) {
                                                for (cellRow = 0; cellRow < me.rows; cellRow++) {
                                                    curCell = me.getCell(cell.col + 1, cellRow);
                                                    curCell.setBordersSize("l", size);
                                                    curCell.setBordersColor("l", color);
                                                }
                                            }
                                            for (cellRow = 0; cellRow < me.rows; cellRow++) {
                                                curCell = me.getCell(cell.col, cellRow);
                                                if (cell.halfBorderSize && cell.col >= me.columns - 1) {
                                                    curCell.setBordersSize("r", 0);
                                                } else {
                                                    curCell.setBordersSize("r", size);
                                                }
                                                curCell.setBordersColor("r", color);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
            me.rendered = true;
            this.trigger("render:after", this);
            return this;
        },
        getCell: function (col, row) {
            return _.findWhere(this._cells, {
                id: this.id + "-cell-" + col + "-" + row
            });
        }
    });
});