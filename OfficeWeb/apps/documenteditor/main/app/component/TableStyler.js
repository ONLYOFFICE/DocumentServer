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
 Ext.define("DE.component.TableStyler", {
    extend: "Ext.container.Container",
    requires: ["Ext.util.CSS", "Common.component.util.RGBColor"],
    uses: ["DE.component.CellStyler"],
    alias: "widget.detablestyler",
    rows: 2,
    columns: 2,
    cellPadding: 10,
    tablePadding: 10,
    overwriteStyle: true,
    maxBorderSize: 6,
    spacingMode: false,
    defaultBorderSize: 1,
    defaultBorderColor: "#ccc",
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig),
        virtualBorderSize = (me.defaultBorderSize > me.maxBorderSize) ? me.maxBorderSize : me.defaultBorderSize,
        virtualBorderColor = new Common.component.util.RGBColor(me.defaultBorderColor),
        topBorder,
        rightBorder,
        bottomBorder,
        leftBorder,
        topBorderSelector,
        rightBorderSelector,
        bottomBorderSelector,
        leftBorderSelector;
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
        var cfgItems = [];
        for (var row = 0; row < this.rows; row++) {
            if (row > 0) {
                cfgItems.push({
                    xtype: "container",
                    height: (me.spacingMode) ? this.cellPadding : 0
                });
            }
            var addRow = cfgItems.push({
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                flex: 1,
                items: []
            });
            for (var col = 0; col < this.columns; col++) {
                if (col > 0) {
                    cfgItems[addRow - 1].items.push({
                        xtype: "container",
                        width: (me.spacingMode) ? this.cellPadding : 0
                    });
                }
                cfgItems[addRow - 1].items.push({
                    xtype: "decellstyler",
                    overwriteStyle: me.overwriteStyle,
                    halfBorderSize: !me.spacingMode,
                    defaultBorderSize: me.spacingMode ? virtualBorderSize : 0,
                    defaultBorderColor: virtualBorderColor.toHex(),
                    id: me.getId() + "-cell-" + col + "-" + row,
                    col: col,
                    row: row,
                    flex: 1,
                    listeners: {
                        borderclick: function (cell, type, size, color) {
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
                        }
                    }
                });
            }
        }
        var applyStyles = function () {
            topBorder && topBorder.setStyle("border-bottom", ((borderSize.top > 0.1 && borderSize.top < 1) ? 1 : borderSize.top) + "pt solid " + borderColor.top.toRGBA((borderSize.top < 1) ? 0.2 : 1));
            rightBorder && rightBorder.setStyle("border-right", ((borderSize.right > 0.1 && borderSize.right < 1) ? 1 : borderSize.right) + "pt solid " + borderColor.right.toRGBA((borderSize.right < 1) ? 0.2 : 1));
            bottomBorder && bottomBorder.setStyle("border-bottom", ((borderSize.bottom > 0.1 && borderSize.bottom < 1) ? 1 : borderSize.bottom) + "pt solid " + borderColor.bottom.toRGBA((borderSize.bottom < 1) ? 0.2 : 1));
            leftBorder && leftBorder.setStyle("border-right", ((borderSize.left > 0.1 && borderSize.left < 1) ? 1 : borderSize.left) + "pt solid " + borderColor.left.toRGBA((borderSize.left < 1) ? 0.2 : 1));
        };
        me.addListener("afterrender", function () {
            var meId = me.getId();
            topBorder = Ext.get(meId + "-table-top-border");
            rightBorder = Ext.get(meId + "-table-right-border");
            bottomBorder = Ext.get(meId + "-table-bottom-border");
            leftBorder = Ext.get(meId + "-table-left-border");
            topBorderSelector = Ext.get(meId + "-table-top-border-selector");
            rightBorderSelector = Ext.get(meId + "-table-right-border-selector");
            bottomBorderSelector = Ext.get(meId + "-table-bottom-border-selector");
            leftBorderSelector = Ext.get(meId + "-table-left-border-selector");
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
                topBorder.setStyle("border-bottom", ((borderSize.top > 0.1 && borderSize.top < 1) ? 1 : borderSize.top) + "pt solid " + borderColor.top.toRGBA((borderSize.top < 1) ? 0.2 : 1));
                me.fireEvent("borderclick", me, "t", borderSize.top, borderColor.top.toHex());
            },
            me);
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
                rightBorder.setStyle("border-right", ((borderSize.right > 0.1 && borderSize.right < 1) ? 1 : borderSize.right) + "pt solid " + borderColor.right.toRGBA((borderSize.right < 1) ? 0.2 : 1));
                me.fireEvent("borderclick", me, "r", borderSize.right, borderColor.right.toHex());
            },
            me);
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
                bottomBorder.setStyle("border-bottom", ((borderSize.bottom > 0.1 && borderSize.bottom < 1) ? 1 : borderSize.bottom) + "pt solid " + borderColor.bottom.toRGBA((borderSize.bottom < 1) ? 0.2 : 1));
                me.fireEvent("borderclick", me, "b", borderSize.bottom, borderColor.bottom.toHex());
            },
            me);
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
                leftBorder.setStyle("border-right", ((borderSize.left > 0.1 && borderSize.left < 1) ? 1 : borderSize.left) + "pt solid " + borderColor.left.toRGBA((borderSize.left < 1) ? 0.2 : 1));
                me.fireEvent("borderclick", me, "l", borderSize.left, borderColor.left.toHex());
            },
            me);
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
            var newColor = new Common.component.util.RGBColor(color);
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
            var newColor = new Common.component.util.RGBColor(color);
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
        Ext.apply(me, {
            layout: {
                type: "vbox",
                align: "stretch"
            },
            cls: "table-styler",
            style: "background-color: #fff;",
            items: [{
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                height: this.tablePadding,
                style: "overflow: visible;",
                items: [{
                    xtype: "container",
                    style: "border-bottom: 1pt dotted gray; border-right: 1pt dotted gray;",
                    width: this.tablePadding
                },
                {
                    xtype: "container",
                    layout: "absolute",
                    flex: 1,
                    items: [{
                        xtype: "container",
                        style: "z-index: 1;",
                        id: me.getId() + "-table-top-border-selector",
                        x: 0,
                        y: me.tablePadding * 0.5,
                        height: me.tablePadding,
                        anchor: "100%",
                        html: '<table width="100%" height="100%">' + "<tr>" + '<td id="' + me.getId() + "-table-top-border" + '" style="height:50%; border-bottom: ' + borderSize.top + "px solid " + borderColor.top.toHex() + ';"></td>' + "</tr>" + "<tr>" + "<td></td>" + "</tr>" + "</table>"
                    }]
                },
                {
                    xtype: "container",
                    style: "border-bottom: 1pt dotted gray; border-left: 1pt dotted gray;",
                    width: this.tablePadding
                }]
            },
            {
                xtype: "container",
                flex: 1,
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                style: "overflow: visible;",
                items: [{
                    xtype: "container",
                    layout: "absolute",
                    width: this.tablePadding,
                    items: [{
                        xtype: "container",
                        style: "z-index: 1;",
                        id: me.getId() + "-table-left-border-selector",
                        x: me.tablePadding * 0.5,
                        y: 0,
                        width: me.tablePadding,
                        anchor: "auto 100%",
                        html: '<table width="100%" height="100%">' + "<tr>" + '<td id="' + me.getId() + "-table-left-border" + '" style="border-right: ' + borderSize.left + "pt solid " + borderColor.left.toHex() + ';"></td>' + '<td width="50%"></td>' + "</tr>" + "</table>"
                    }]
                },
                {
                    xtype: "container",
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    padding: (me.spacingMode) ? this.cellPadding : 0,
                    flex: 1,
                    items: cfgItems
                },
                {
                    xtype: "container",
                    layout: "absolute",
                    width: this.tablePadding,
                    items: [{
                        xtype: "container",
                        style: "z-index: 1;",
                        id: me.getId() + "-table-right-border-selector",
                        x: -1 * me.tablePadding * 0.5,
                        y: 0,
                        width: me.tablePadding,
                        anchor: "auto 100%",
                        html: '<table width="100%" height="100%">' + "<tr>" + '<td id="' + me.getId() + "-table-right-border" + '" style="border-right: ' + borderSize.right + "pt solid " + borderColor.right.toHex() + ';"></td>' + '<td width="50%"></td>' + "</tr>" + "</table>"
                    }]
                }]
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                style: "overflow: visible;",
                height: this.tablePadding,
                items: [{
                    xtype: "container",
                    style: "border-top: 1pt dotted gray; border-right: 1pt dotted gray;",
                    width: this.tablePadding
                },
                {
                    xtype: "container",
                    layout: "absolute",
                    flex: 1,
                    items: [{
                        xtype: "container",
                        style: "z-index: 1;",
                        id: me.getId() + "-table-bottom-border-selector",
                        x: 0,
                        y: -1 * me.tablePadding * 0.5,
                        height: me.tablePadding,
                        anchor: "100%",
                        html: '<table width="100%" height="100%">' + "<tr>" + '<td id="' + me.getId() + "-table-bottom-border" + '" style="height:50%; border-bottom: ' + borderSize.bottom + "px solid " + borderColor.bottom.toHex() + ';"></td>' + "</tr>" + "<tr>" + "<td></td>" + "</tr>" + "</table>"
                    }]
                },
                {
                    xtype: "container",
                    style: "border-top: 1pt dotted gray; border-left: 1pt dotted gray;",
                    width: this.tablePadding
                }]
            }]
        },
        cfg);
        this.callParent(arguments);
    },
    getCell: function (col, row) {
        return Ext.getCmp(this.getId() + "-cell-" + col + "-" + row);
    }
});