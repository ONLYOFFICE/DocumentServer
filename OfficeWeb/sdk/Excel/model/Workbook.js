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
 var d1, d2, d3;
var g_nHSLMaxValue = 240;
var g_nVerticalTextAngle = 255;
var gc_dDefaultColWidthCharsAttribute;
var gc_dDefaultRowHeightAttribute;
var g_nNextWorksheetId = 1;
var g_sNewSheetNamePattern = "Sheet";
var g_nSheetNameMaxLength = 31;
var g_nAllColIndex = -1;
var History;
var aStandartNumFormats;
var aStandartNumFormatsId;
var start, end, cCharDelimiter = String.fromCharCode(5),
arrRecalc = {},
lc = 0;
var c_oRangeType = {
    Range: 0,
    Col: 1,
    Row: 2,
    All: 3
};
function getRangeType(oBBox) {
    if (null == oBBox) {
        oBBox = this.bbox;
    }
    if (oBBox.c1 == 0 && gc_nMaxCol0 == oBBox.c2 && oBBox.r1 == 0 && gc_nMaxRow0 == oBBox.r2) {
        return c_oRangeType.All;
    }
    if (oBBox.c1 == 0 && gc_nMaxCol0 == oBBox.c2) {
        return c_oRangeType.Row;
    } else {
        if (oBBox.r1 == 0 && gc_nMaxRow0 == oBBox.r2) {
            return c_oRangeType.Col;
        } else {
            return c_oRangeType.Range;
        }
    }
}
function consolelog(text) {
    if (window.g_debug_mode && console && console.log) {
        console.log(text);
    }
}
function DependencyGraph(wb) {
    var nodes = {},
    badRes = [],
    result = [],
    nodeslength = 0,
    nodesfirst,
    __nodes = {},
    areaNodes = {},
    thas = this;
    this.wb = wb;
    this.clear = function () {
        nodes = {};
        __nodes = {};
        areaNodes = {};
        badRes = [];
        result = [];
        nodeslength = 0;
        nodesfirst = null;
    };
    this.nodeExist = function (node) {
        return nodes[node.nodeId] !== undefined;
    };
    this.nodeExist2 = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId);
        var exist = nodes[n.nodeId] !== undefined;
        if (!exist) {
            for (var id in areaNodes) {
                if (areaNodes[id].containCell(n)) {
                    return true;
                }
            }
        }
        return exist;
    };
    this.addNode = function (sheetId, cellId) {
        var node = new Vertex(sheetId, cellId, this.wb);
        if (nodes[node.nodeId] === undefined) {
            if (nodeslength == 0) {
                nodesfirst = node.nodeId;
            }
            nodes[node.nodeId] = node;
            nodeslength++;
            if (node.isArea && !areaNodes[node.nodeId]) {
                areaNodes[node.nodeId] = node;
            }
        }
    };
    this.addNode2 = function (node) {
        if (nodes[node.nodeId] === undefined) {
            if (nodeslength == 0) {
                nodesfirst = node.nodeId;
            }
            nodes[node.nodeId] = node;
            nodeslength++;
            if (node.isArea && !areaNodes[node.nodeId]) {
                areaNodes[node.nodeId] = node;
                for (var id in nodes) {
                    if (!nodes[id].isArea) {
                        if (node.containCell(nodes[id])) {
                            node.addMasterEdge(nodes[id]);
                            nodes[id].addSlaveEdge(node);
                        }
                    }
                }
                return;
            }
            for (var id2 in areaNodes) {
                if (areaNodes[id2].containCell(node) && id2 != node.nodeId) {
                    areaNodes[id2].addMasterEdge(node);
                    node.addSlaveEdge(areaNodes[id2]);
                }
            }
        }
    };
    this.addEdge = function (sheetIdFrom, cellIdFrom, sheetIdTo, cellIdTo) {
        var n1 = new Vertex(sheetIdFrom, cellIdFrom, this.wb),
        n2 = new Vertex(sheetIdTo, cellIdTo, this.wb);
        if (!this.nodeExist(n1)) {
            this.addNode2(n1);
        }
        if (!this.nodeExist(n2)) {
            this.addNode2(n2);
        }
        nodes[n1.nodeId].addMasterEdge(nodes[n2.nodeId]);
        nodes[n2.nodeId].addSlaveEdge(nodes[n1.nodeId]);
    };
    this.addEdge2 = function (nodeFrom, nodeTo) {
        if (!this.nodeExist(nodeFrom)) {
            this.addNode2(nodeFrom);
        }
        if (!this.nodeExist(nodeTo)) {
            this.addNode2(nodeTo);
        }
        nodes[nodeFrom.nodeId].addMasterEdge(nodes[nodeTo.nodeId]);
        nodes[nodeTo.nodeId].addSlaveEdge(nodes[nodeFrom.nodeId]);
    };
    this.renameNode = function (sheetIdFrom, cellIdFrom, sheetIdTo, cellIdTo) {
        if (sheetIdFrom == sheetIdTo && cellIdFrom == cellIdTo) {
            return;
        }
        nodes[getVertexId(sheetIdTo, cellIdTo)] = nodes[getVertexId(sheetIdFrom, cellIdFrom)];
        if (!nodes[getVertexId(sheetIdTo, cellIdTo)]) {
            return;
        }
        nodes[getVertexId(sheetIdFrom, cellIdFrom)] = undefined;
        delete nodes[getVertexId(sheetIdFrom, cellIdFrom)];
        nodes[getVertexId(sheetIdTo, cellIdTo)].changeCellId(cellIdTo);
    };
    this.getNode = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId);
        if (this.nodeExist(n)) {
            return nodes[n.nodeId];
        }
    };
    this.getNode2 = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId);
        var exist = nodes[n.nodeId] !== undefined,
        res = [];
        if (exist) {
            res.push(nodes[n.nodeId]);
        } else {
            for (var id in areaNodes) {
                if (areaNodes[id].containCell(n)) {
                    res.push(areaNodes[id]);
                }
            }
        }
        return res.length > 0 ? res : null;
    };
    this.getNodeByNodeId = function (nodeId) {
        if (nodes[nodeId]) {
            return nodes[nodeId];
        }
    };
    this.getNodeBySheetId = function (sheetId) {
        var arr = [];
        for (var id in nodes) {
            if (nodes[id].sheetId == sheetId && nodes[id].getSlaveEdges()) {
                arr.push(nodes[id]);
                var n = nodes[id].getSlaveEdges();
                for (var id2 in n) {
                    n[id2].weightNode++;
                }
            }
        }
        return arr;
    };
    this.deleteNode = function (n) {
        if (this.nodeExist(n)) {
            var _n = nodes[n.nodeId];
            _n.deleteAllMasterEdges();
            _n.deleteAllSlaveEdges();
            if (areaNodes[_n.nodeId]) {
                areaNodes[_n.nodeId] = null;
                delete areaNodes[_n.nodeId];
            }
            nodes[_n.nodeId] = null;
            delete nodes[_n.nodeId];
            nodeslength--;
        }
    };
    this.deleteMasterNodes = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId);
        if (this.nodeExist(n)) {
            var arr = nodes[n.nodeId].deleteAllMasterEdges();
            for (var i = 0; i < arr.length; i++) {
                if (nodes[arr[i]].refCount <= 0) {
                    nodes[arr[i]] = null;
                    delete nodes[arr[i]];
                    nodeslength--;
                }
            }
        }
    };
    this.deleteSlaveNodes = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId);
        if (this.nodeExist(n)) {
            nodes[n.nodeId].deleteAllSlaveEdges();
        }
    };
    this.getSlaveNodes = function (sheetId, cellId) {
        var node = new Vertex(sheetId, cellId);
        if (this.nodeExist(node)) {
            return nodes[node.nodeId].getSlaveEdges();
        } else {
            var _t = {},
            f = false;
            for (var id in areaNodes) {
                if (areaNodes[id].containCell(node)) {
                    _t[id] = areaNodes[id];
                    f = true;
                }
            }
            if (f) {
                return _t;
            }
        }
        return null;
    };
    this.getMasterNodes = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId);
        if (this.nodeExist(n)) {
            return nodes[n.nodeId].getMasterEdges();
        }
        return null;
    };
    this.addN = function (sheetId, cellId) {
        var n = new Vertex(sheetId, cellId, this.wb);
        if (! (n.nodeId in __nodes)) {
            __nodes[n.nodeId] = n;
        }
    };
    this.t_sort_slave = function (sheetId, cellId) {
        function getFirstNode(sheetId, cellId) {
            var n = new Vertex(sheetId, cellId, thas.wb);
            if (!nodes[n.nodeId]) {
                var a = [];
                for (var id in areaNodes) {
                    if (areaNodes[id].containCell(n)) {
                        a.push(areaNodes[id]);
                    }
                }
                if (a.length > 0) {
                    for (var i in a) {
                        n.addSlaveEdge(a[i]);
                    }
                    n.valid = false;
                    return n;
                } else {
                    return undefined;
                }
            } else {
                return nodes[n.nodeId];
            }
        }
        function getNextNode(node) {
            for (var id in node.slaveEdges) {
                var n = nodes[id];
                if (n !== undefined) {
                    if ((n.isBlack === undefined || !n.isBlack) && !n.isBad) {
                        return n;
                    }
                } else {
                    delete node.slaveEdges[id];
                }
            }
            return undefined;
        }
        var stack = [],
        n = getFirstNode(sheetId, cellId),
        __t = true,
        next,
        badResS = [],
        resultS = [];
        if (!n) {
            return {
                depF: resultS.reverse(),
                badF: badResS
            };
        }
        while (1) {
            if (n.isGray && !n.isArea) {
                for (var i = stack.length - 1; i >= 0; i--) {
                    var bad = stack.pop();
                    bad.isBad = true;
                    badResS.push(bad);
                    if (stack[i] == n) {
                        break;
                    }
                }
                if (stack.length < 1) {
                    for (var id in __nodes) {
                        if (nodes[id] !== undefined && ((nodes[id].isBlack === undefined || !nodes[id].isBlack) && !nodes[id].isBad)) {
                            n = nodes[id];
                            delete __nodes[id];
                        }
                    }
                }
            }
            next = getNextNode(n);
            if (next !== undefined) {
                n.isGray = true;
                stack.push(n);
                n = next;
            } else {
                n.isBlack = true;
                n.isGray = false;
                resultS.push(n);
                if (stack.length < 1) {
                    break;
                }
                n = stack.pop();
                n.isGray = false;
            }
        }
        for (var i = 0; i < resultS.length; i++) {
            resultS[i].isBlack = false;
            resultS[i].isBad = false;
            resultS[i].isGray = false;
        }
        for (var i = 0; i < badResS.length; i++) {
            badResS[i].isBlack = false;
            badResS[i].isBad = false;
            badResS[i].isGray = false;
        }
        return {
            depF: resultS.reverse(),
            badF: badResS
        };
    };
    this.t_sort_master = function (sheetId, cellId) {
        function getFirstNode(sheetId, cellId) {
            var n = new Vertex(sheetId, cellId, thas.wb);
            if (!nodes[n.nodeId]) {
                var a = [];
                for (var id in areaNodes) {
                    if (areaNodes[id].containCell(n)) {
                        a.push(areaNodes[id]);
                    }
                }
                if (a.length > 0) {
                    for (var i in a) {
                        n.addSlaveEdge(a[i]);
                    }
                    n.valid = false;
                    return n;
                } else {
                    return undefined;
                }
            } else {
                return nodes[n.nodeId];
            }
        }
        function getNextNode(node) {
            if (node) {
                for (var id in node.masterEdges) {
                    var n = nodes[id];
                    if (n !== undefined) {
                        if ((n.isBlack === undefined || !n.isBlack) && !n.isBad) {
                            return n;
                        }
                    } else {
                        delete node.masterEdges[id];
                    }
                }
            }
            return undefined;
        }
        var stack = [],
        n = getFirstNode(sheetId, cellId),
        __t = true,
        next,
        badResS = [],
        resultS = [];
        if (!n) {
            return {
                depF: resultS,
                badF: badResS
            };
        }
        while (1) {
            if (n) {
                if (n.isGray && !n.isArea) {
                    for (var i = stack.length - 1; i >= 0; i--) {
                        var bad = stack.pop();
                        bad.isBad = true;
                        badResS.push(bad);
                    }
                }
            }
            if (n.valid && !n.isArea) {
                for (var id in areaNodes) {
                    if (areaNodes[id].containCell(n)) {
                        areaNodes[id].addMasterEdge(n);
                        n.addSlaveEdge(areaNodes[id]);
                    }
                }
                n.valid = false;
            }
            next = getNextNode(n);
            if (next !== undefined) {
                n.isGray = true;
                stack.push(n);
                n = next;
            } else {
                n.isBlack = true;
                n.isGray = false;
                resultS.push(n);
                if (stack.length < 1) {
                    break;
                }
                n = stack.pop();
                n.isGray = false;
            }
        }
        for (var i = 0; i < resultS.length; i++) {
            resultS[i].isBlack = false;
            resultS[i].isBad = false;
            resultS[i].isGray = false;
        }
        for (var i = 0; i < badResS.length; i++) {
            badResS[i].isBlack = false;
            badResS[i].isBad = false;
            badResS[i].isGray = false;
        }
        return {
            depF: resultS,
            badF: badResS
        };
    };
    this.t_sort = function () {
        for (var i in nodes) {
            nodes[i].isBlack = false;
            nodes[i].isBad = false;
            nodes[i].isGray = false;
        }
        function getFirstNode() {
            return nodes[nodesfirst];
        }
        function getNextNode(node) {
            for (var id in node.masterEdges) {
                var n = nodes[id];
                if (n !== undefined) {
                    if ((n.isBlack === undefined || !n.isBlack) && !n.isBad) {
                        return n;
                    }
                } else {
                    delete node.masterEdges[id];
                }
            }
            return undefined;
        }
        var stack = [],
        n = getFirstNode(),
        __t = true,
        next;
        while (1) {
            if (n.isGray) {
                for (var i = stack.length - 1; i >= 0; i--) {
                    var bad = stack.pop();
                    bad.isBad = true;
                    badRes.push(bad);
                    if (stack[i] == n) {
                        break;
                    }
                }
                if (stack.length < 1) {
                    for (var id in __nodes) {
                        if (nodes[id] !== undefined && ((nodes[id].isBlack === undefined || !nodes[id].isBlack) && !nodes[id].isBad)) {
                            n = nodes[id];
                            delete __nodes[id];
                        }
                    }
                }
            }
            next = getNextNode(n);
            if (next !== undefined) {
                n.isGray = true;
                stack.push(n);
                n = next;
            } else {
                n.isBlack = true;
                n.isGray = false;
                result.push(n);
                if (stack.length < 1) {
                    n = undefined;
                    for (var id in __nodes) {
                        if (nodes[id] !== undefined && ((nodes[id].isBlack === undefined || !nodes[id].isBlack) && !nodes[id].isBad)) {
                            n = nodes[id];
                            delete __nodes[id];
                            break;
                        } else {
                            delete __nodes[id];
                        }
                    }
                    if (n) {
                        continue;
                    } else {
                        break;
                    }
                }
                n = stack.pop();
                n.isGray = false;
            }
        }
        return {
            depF: result,
            badF: badRes
        };
    };
    this.returnNode = function () {
        return nodes;
    };
    this.getNodesLength = function () {
        return nodeslength;
    };
    this.getResult = function () {
        return {
            depF: result,
            badF: badRes
        };
    };
    this.checkOffset = function (BBox, offset, wsId, noDelete) {
        var move = {},
        stretch = {},
        recalc = {};
        for (var id in nodes) {
            if (nodes[id].sheetId != wsId) {
                continue;
            }
            var n = {
                r1: nodes[id].firstCellAddress.getRow0(),
                c1: nodes[id].firstCellAddress.getCol0(),
                r2: nodes[id].lastCellAddress.getRow0(),
                c2: nodes[id].lastCellAddress.getCol0()
            };
            if (nodes[id].isArea) {
                var n1 = {
                    r1: n.r1 - n.r1,
                    c1: n.c1 - n.c1,
                    r2: n.r2 - n.r1,
                    c2: n.c2 - n.c1
                };
                n1.height = n1.r2 - n1.r1;
                n1.width = n1.c2 - n1.c1;
                var BBox1 = {
                    r1: BBox.r1 - n.r1,
                    c1: BBox.c1 - n.c1,
                    r2: BBox.r2 - n.r1,
                    c2: BBox.c2 - n.c1
                };
                n1.height = BBox1.r2 - BBox1.r1;
                n1.width = BBox1.c2 - BBox1.c1;
                if (BBox1.r1 > n1.r2 || BBox1.c1 > n1.c2 || (BBox.r2 < 0 && BBox1.c2 < 0)) {
                    continue;
                } else {
                    if (offset.offsetRow == 0) {
                        if (offset.offsetCol == 0) {
                            continue;
                        } else {
                            if (BBox1.r2 < n1.r1) {
                                continue;
                            } else {
                                if (BBox1.r2 < n1.r2 || BBox1.r1 > n1.r1) {
                                    recalc[id] = nodes[id];
                                } else {
                                    if (offset.offsetCol > 0) {
                                        if (BBox1.r1 <= n1.r1 && BBox1.r2 >= n1.r2) {
                                            if (BBox1.c2 <= n1.c2 && BBox1.c1 <= n1.c1 || BBox1.c1 == n1.c1 && BBox1.c2 > n1.c2) {
                                                move[id] = {
                                                    node: nodes[id],
                                                    offset: offset
                                                };
                                            } else {
                                                if (BBox1.c1 > n1.c1 && BBox1.c1 <= n1.c2) {
                                                    stretch[id] = {
                                                        node: nodes[id],
                                                        offset: offset
                                                    };
                                                }
                                            }
                                        }
                                    } else {
                                        if (BBox1.r1 <= n1.r1 && BBox1.r2 >= n1.r2) {
                                            if (BBox1.c2 < n1.c1) {
                                                move[id] = {
                                                    node: nodes[id],
                                                    offset: offset
                                                };
                                            } else {
                                                if (BBox1.c2 >= n1.c1 && BBox1.c1 <= n1.c1) {
                                                    if (n1.r1 >= BBox1.r1 && n1.r2 <= BBox1.r2 && n1.c1 >= BBox1.c1 && n1.c2 <= BBox1.c2) {
                                                        move[id] = {
                                                            node: nodes[id],
                                                            offset: offset,
                                                            toDelete: !noDelete
                                                        };
                                                        recalc[id] = nodes[id];
                                                    } else {
                                                        move[id] = {
                                                            node: nodes[id],
                                                            offset: {
                                                                offsetCol: -Math.abs(n1.c1 - BBox1.c1),
                                                                offsetRow: offset.offsetRow
                                                            }
                                                        };
                                                        stretch[id] = {
                                                            node: nodes[id],
                                                            offset: {
                                                                offsetCol: -Math.abs(n1.c1 - BBox1.c2) - 1,
                                                                offsetRow: offset.offsetRow
                                                            }
                                                        };
                                                        recalc[id] = nodes[id];
                                                    }
                                                } else {
                                                    if (BBox1.c1 > n1.c1 && BBox1.c1 <= n1.c2 || BBox1.c1 == n1.c1 && BBox1.c2 >= n1.c1) {
                                                        if (BBox1.c2 > n1.c2) {
                                                            stretch[id] = {
                                                                node: nodes[id],
                                                                offset: {
                                                                    offsetCol: -Math.abs(n1.c2 - BBox1.c1) - 1,
                                                                    offsetRow: offset.offsetRow
                                                                }
                                                            };
                                                            recalc[id] = nodes[id];
                                                        } else {
                                                            stretch[id] = {
                                                                node: nodes[id],
                                                                offset: offset
                                                            };
                                                            recalc[id] = nodes[id];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (BBox1.c2 < n1.c1) {
                            continue;
                        } else {
                            if (BBox1.c2 < n1.c2 || BBox1.c1 > n1.c1) {
                                recalc[id] = nodes[id];
                            } else {
                                if (offset.offsetRow > 0) {
                                    if (BBox1.c1 <= n1.c1 && BBox1.c2 >= n1.c2) {
                                        if (BBox1.r2 <= n1.r2 && BBox1.r1 <= n1.r1 || BBox1.r1 == n1.r1 && BBox1.r2 > n1.r2) {
                                            move[id] = {
                                                node: nodes[id],
                                                offset: offset
                                            };
                                        } else {
                                            if (BBox1.r1 > n1.r1 && BBox1.r1 <= n1.r2) {
                                                stretch[id] = {
                                                    node: nodes[id],
                                                    offset: offset
                                                };
                                            }
                                        }
                                    }
                                } else {
                                    if (BBox1.c1 <= n1.c1 && BBox1.c2 >= n1.c2) {
                                        if (BBox1.r2 < n1.r1) {
                                            move[id] = {
                                                node: nodes[id],
                                                offset: offset
                                            };
                                        } else {
                                            if (BBox1.r2 >= n1.r1 && BBox1.r1 <= n1.r1) {
                                                if (n1.r1 >= BBox1.r1 && n1.r2 <= BBox1.r2 && n1.c1 >= BBox1.c1 && n1.c2 <= BBox1.c2) {
                                                    move[id] = {
                                                        node: nodes[id],
                                                        offset: offset,
                                                        toDelete: !noDelete
                                                    };
                                                    recalc[id] = nodes[id];
                                                } else {
                                                    move[id] = {
                                                        node: nodes[id],
                                                        offset: {
                                                            offsetRow: -Math.abs(n1.r1 - BBox1.r1),
                                                            offsetCol: offset.offsetCol
                                                        }
                                                    };
                                                    stretch[id] = {
                                                        node: nodes[id],
                                                        offset: {
                                                            offsetRow: -Math.abs(n1.r1 - BBox1.r2) - 1,
                                                            offsetCol: offset.offsetCol
                                                        }
                                                    };
                                                    recalc[id] = nodes[id];
                                                }
                                            } else {
                                                if (BBox1.r1 > n1.r1 && BBox1.r1 <= n1.r2 || BBox1.r1 == n1.r1 && BBox1.r2 >= n1.r1) {
                                                    if (BBox1.r2 > n1.r2) {
                                                        stretch[id] = {
                                                            node: nodes[id],
                                                            offset: {
                                                                offsetRow: -Math.abs(n1.r2 - BBox1.r1) - 1,
                                                                offsetCol: offset.offsetCol
                                                            }
                                                        };
                                                        recalc[id] = nodes[id];
                                                    } else {
                                                        stretch[id] = {
                                                            node: nodes[id],
                                                            offset: offset
                                                        };
                                                        recalc[id] = nodes[id];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if ((n.r1 >= BBox.r1 && n.r1 <= BBox.r2 && n.c1 >= BBox.c2 && offset.offsetCol != 0) || (n.c1 >= BBox.c1 && n.c1 <= BBox.c2 && n.r1 >= BBox.r2 && offset.offsetRow != 0) || (n.r1 >= BBox.r1 && n.r2 <= BBox.r2 && n.c1 >= BBox.c1 && n.c2 <= BBox.c2)) {
                    move[id] = {
                        node: nodes[id],
                        offset: offset,
                        toDelete: false
                    };
                    if (n.r1 >= BBox.r1 && n.r2 <= BBox.r2 && n.c1 >= BBox.c1 && n.c2 <= BBox.c2 && !noDelete && (offset.offsetCol < 0 || offset.offsetRow < 0)) {
                        move[id].toDelete = true;
                        recalc[id] = nodes[id];
                    }
                }
            }
        }
        return {
            move: move,
            stretch: stretch,
            recalc: recalc
        };
    };
    this.helper = function (BBox, wsId) {
        var move = {},
        recalc = {},
        range = this.wb.getWorksheetById(wsId).getRange(new CellAddress(BBox.r1, BBox.c1, 0), new CellAddress(BBox.r2, BBox.c2, 0)),
        n = new Vertex(range.getWorksheet().getId(), range.getName());
        if (n.isArea) {
            if (n.nodeId in nodes) {
                move[n.nodeId] = nodes[n.nodeId];
            } else {
                for (var id2 in areaNodes) {
                    if (n.containCell(areaNodes[id2])) {
                        move[areaNodes[id2].nodeId] = nodes[areaNodes[id2].nodeId];
                    }
                }
                range = range.getCells();
                for (var id in range) {
                    n = new Vertex(wsId, range[id].getName());
                    if (n.nodeId in nodes) {
                        move[n.nodeId] = nodes[n.nodeId];
                    }
                    for (var id2 in areaNodes) {
                        if (areaNodes[id2].containCell(n)) {
                            recalc[id2] = areaNodes[id2];
                        }
                    }
                }
            }
        } else {
            if (n.nodeId in nodes) {
                move[n.nodeId] = nodes[n.nodeId];
            }
            for (var id in areaNodes) {
                if (areaNodes[id].containCell(n)) {
                    recalc[id] = areaNodes[id];
                }
            }
        }
        return {
            move: move,
            recalc: recalc
        };
    };
    this.drawDep = function (cellId, se) {
        if (!cellId) {
            return;
        }
        var _wsV = this.wb.oApi.wb.getWorksheet(),
        _getCellMetrics = _wsV.cellCommentator.getCellMetrics,
        _cc = _wsV.cellCommentator,
        ctx = _wsV.overlayCtx,
        _wsVM = _wsV.model,
        nodeId = getVertexId(_wsVM.getId(), cellId),
        node = this.getNode(_wsVM.getId(), cellId),
        cell;
        function gCM(_this, col, row) {
            var metrics = {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                result: false
            };
            var fvr = _this.getFirstVisibleRow();
            var fvc = _this.getFirstVisibleCol();
            var mergedRange = _wsVM.getMergedByCell(row, col);
            if (mergedRange && (fvc < mergedRange.c2) && (fvr < mergedRange.r2)) {
                var startCol = (mergedRange.c1 > fvc) ? mergedRange.c1 : fvc;
                var startRow = (mergedRange.r1 > fvr) ? mergedRange.r1 : fvr;
                metrics.top = _this.getCellTop(startRow, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
                metrics.left = _this.getCellLeft(startCol, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);
                for (var i = startCol; i <= mergedRange.c2; i++) {
                    metrics.width += _this.getColumnWidth(i, 0);
                }
                for (var i = startRow; i <= mergedRange.r2; i++) {
                    metrics.height += _this.getRowHeight(i, 0);
                }
                metrics.result = true;
            } else {
                metrics.top = _this.getCellTop(row, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
                metrics.left = _this.getCellLeft(col, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);
                metrics.width = _this.getColumnWidth(col, 0);
                metrics.height = _this.getRowHeight(row, 0);
                metrics.result = true;
            }
            return metrics;
        }
        if (!node) {
            return;
        }
        cell = node.returnCell();
        if (!cell) {
            return;
        }
        var m = [cell.getCellAddress().getRow0(), cell.getCellAddress().getCol0()],
        rc = [],
        me = se ? node.getSlaveEdges() : node.getMasterEdges();
        for (var id in me) {
            if (me[id].sheetId != node.sheetId) {
                return;
            }
            if (!me[id].isArea) {
                var _t1 = gCM(_wsV, me[id].returnCell().getCellAddress().getCol0(), me[id].returnCell().getCellAddress().getRow0());
                rc.push({
                    t: _t1.top,
                    l: _t1.left,
                    w: _t1.width,
                    h: _t1.height,
                    apt: _t1.top + _t1.height / 2,
                    apl: _t1.left + _t1.width / 4
                });
            } else {
                var _t1 = gCM(_wsV, me[id].firstCellAddress.getCol0(), me[id].firstCellAddress.getRow0()),
                _t2 = gCM(_wsV, me[id].lastCellAddress.getCol0(), me[id].lastCellAddress.getRow0());
                rc.push({
                    t: _t1.top,
                    l: _t1.left,
                    w: _t2.left + _t2.width - _t1.left,
                    h: _t2.top + _t2.height - _t1.top,
                    apt: _t1.top + _t1.height / 2,
                    apl: _t1.left + _t1.width / 4
                });
            }
        }
        if (rc.length == 0) {
            return;
        }
        function draw_arrow(context, fromx, fromy, tox, toy) {
            var headlen = 9;
            var dx = tox - fromx;
            var dy = toy - fromy;
            var angle = Math.atan2(dy, dx),
            _a = Math.PI / 18;
            context.save().setLineWidth(1).beginPath().moveTo(_cc.pxToPt(fromx), _cc.pxToPt(fromy)).lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy));
            context.moveTo(_cc.pxToPt(tox - headlen * Math.cos(angle - _a)), _cc.pxToPt(toy - headlen * Math.sin(angle - _a))).lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy)).lineTo(_cc.pxToPt(tox - headlen * Math.cos(angle + _a)), _cc.pxToPt(toy - headlen * Math.sin(angle + _a))).lineTo(_cc.pxToPt(tox - headlen * Math.cos(angle - _a)), _cc.pxToPt(toy - headlen * Math.sin(angle - _a))).setStrokeStyle("#0000FF").setFillStyle("#0000FF").stroke().fill().closePath().restore();
        }
        function h(m, rc) {
            var m = gCM(_wsV, m[1], m[0]);
            var arrowPointTop = 10,
            arrowPointLeft = 10;
            for (var i = 0; i < rc.length; i++) {
                var m2 = rc[i],
                x1 = Math.floor(m2.apl),
                y1 = Math.floor(m2.apt),
                x2 = Math.floor(m.left + m.width / 4),
                y2 = Math.floor(m.top + m.height / 2);
                if (x1 < 0 && x2 < 0 || y1 < 0 && y2 < 0) {
                    continue;
                }
                if (m2.apl > 0 && m2.apt > 0) {
                    ctx.save().setLineWidth(1).setStrokeStyle("#0000FF").rect(_cc.pxToPt(m2.l), _cc.pxToPt(m2.t), _cc.pxToPt(m2.w - 1), _cc.pxToPt(m2.h - 1)).stroke().restore();
                }
                if (y1 < 0 && x1 != x2) {
                    x1 = x1 - Math.floor(Math.sqrt(((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) * y1 * y1 / ((y2 - y1) * (y2 - y1))) / 2);
                }
                if (x1 < 0 && y1 != y2) {
                    y1 = y1 - Math.floor(Math.sqrt(((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2)) * x1 * x1 / ((x2 - x1) * (x2 - x1))) / 2);
                }
                draw_arrow(ctx, x1 < 0 ? _wsV.getCellLeft(0, 0) : x1, y1 < 0 ? _wsV.getCellTop(0, 0) : y1, x2, y2);
                if (m2.apl > 0 && m2.apt > 0) {
                    ctx.save().beginPath().arc(_cc.pxToPt(Math.floor(m2.apl)), _cc.pxToPt(Math.floor(m2.apt)), 3, 0, 2 * Math.PI, false, -0.5, -0.5).setFillStyle("#0000FF").fill().closePath().restore();
                }
            }
        }
        ctx.clear();
        _wsV._drawSelection();
        if (se) {
            for (var i = 0; i < rc.length; i++) {
                h(rc[i], [m]);
            }
        } else {
            h(m, rc);
        }
    };
    this.removeNodeBySheetId = function (sheetId) {
        var arr = false;
        this.wb.needRecalc = [];
        this.wb.needRecalc.length = 0;
        for (var id in nodes) {
            if (nodes[id].sheetId == sheetId) {
                var se = nodes[id].getSlaveEdges();
                for (var id2 in se) {
                    if (se[id2].sheetId != sheetId) {
                        if (!arr) {
                            arr = true;
                        }
                        this.wb.needRecalc[id2] = [se[id2].sheetId, se[id2].cellId];
                        this.wb.needRecalc.length++;
                    }
                }
                nodes[id].deleteAllMasterEdges();
                nodes[id].deleteAllSlaveEdges();
                nodes[id] = null;
                delete nodes[id];
                nodeslength--;
            }
        }
        return arr;
    };
}
function Vertex(sheetId, cellId, wb) {
    this.sheetId = sheetId;
    this.cellId = cellId;
    this.valid = true;
    this.nodeId = sheetId + cCharDelimiter + cellId;
    var nIndex = cellId.indexOf(":");
    if (this.isArea = (nIndex > -1)) {
        var sFirstCell = cellId.substring(0, nIndex);
        var sLastCell = cellId.substring(nIndex + 1);
        if (!sFirstCell.match(/[^a-z]/ig)) {
            this.firstCellAddress = new CellAddress(sFirstCell + "1");
            this.lastCellAddress = new CellAddress(sLastCell + gc_nMaxRow.toString());
        } else {
            if (!sFirstCell.match(/[^0-9]/ig)) {
                this.firstCellAddress = new CellAddress("A" + sFirstCell);
                this.lastCellAddress = new CellAddress(g_oCellAddressUtils.colnumToColstr(gc_nMaxCol) + sLastCell);
            } else {
                this.firstCellAddress = new CellAddress(sFirstCell);
                this.lastCellAddress = new CellAddress(sLastCell);
            }
        }
        this.containCell = function (node) {
            if (this.sheetId != node.sheetId) {
                return false;
            }
            if (node.firstCellAddress.row >= this.firstCellAddress.row && node.firstCellAddress.col >= this.firstCellAddress.col && node.lastCellAddress.row <= this.lastCellAddress.row && node.lastCellAddress.col <= this.lastCellAddress.col) {
                return true;
            }
            return false;
        };
    } else {
        this.firstCellAddress = this.lastCellAddress = new CellAddress(cellId);
    }
    if (wb && !this.isArea) {
        this.wb = wb;
        var c = new CellAddress(this.cellId);
        this.cell = this.wb.getWorksheetById(this.sheetId)._getCellNoEmpty(c.getRow0(), c.getCol0());
    }
    this.isBlack = false;
    this.isGray = false;
    this.isBad = false;
    this.masterEdges = null;
    this.helpMasterEdges = {};
    this.slaveEdges = null;
    this.refCount = 0;
    this.weightNode = 0;
}
Vertex.prototype = {
    constructor: Vertex,
    changeCellId: function (cellId) {
        var lastId = this.nodeId;
        this.cellId = cellId;
        this.nodeId = this.sheetId + cCharDelimiter + cellId;
        for (var id in this.masterEdges) {
            if (lastId in this.masterEdges[id].slaveEdges) {
                this.masterEdges[id].slaveEdges[this.nodeId] = this.masterEdges[id].slaveEdges[lastId];
                this.masterEdges[id].slaveEdges[lastId] = null;
                delete this.masterEdges[id].slaveEdges[lastId];
            }
        }
        for (var id in this.slaveEdges) {
            if (lastId in this.slaveEdges[id].masterEdges) {
                this.slaveEdges[id].masterEdges[this.nodeId] = this.slaveEdges[id].masterEdges[lastId];
                this.slaveEdges[id].masterEdges[lastId] = null;
                delete this.slaveEdges[id].masterEdges[lastId];
            }
        }
    },
    addMasterEdge: function (node) {
        if (!this.masterEdges) {
            this.masterEdges = {};
        }
        this.masterEdges[node.nodeId] = node;
        this.refCount++;
    },
    addHelpMasterEdge: function (node) {
        this.helpMasterEdges[node.nodeId] = node;
    },
    addSlaveEdge: function (node) {
        if (!this.slaveEdges) {
            this.slaveEdges = {};
        }
        this.slaveEdges[node.nodeId] = node;
        this.refCount++;
    },
    getMasterEdges: function () {
        return this.masterEdges;
    },
    getHelpMasterEdges: function () {
        return this.helpMasterEdges;
    },
    getSlaveEdges: function () {
        return this.slaveEdges;
    },
    getSlaveEdges2: function () {
        var ret = {},
        count = 0;
        for (var id in this.slaveEdges) {
            ret[id] = this.slaveEdges[id];
            count++;
        }
        if (count > 0) {
            return ret;
        } else {
            return null;
        }
    },
    deleteMasterEdge: function (node) {
        this.masterEdges[node.nodeId] = null;
        delete this.masterEdges[node.nodeId];
        this.refCount--;
    },
    deleteHelpMasterEdge: function (node) {
        delete this.helpMasterEdges[node.nodeId];
    },
    deleteSlaveEdge: function (node) {
        this.slaveEdges[node.nodeId] = null;
        delete this.slaveEdges[node.nodeId];
        this.refCount--;
    },
    deleteAllMasterEdges: function () {
        var ret = [];
        for (var id in this.masterEdges) {
            this.masterEdges[id].deleteSlaveEdge(this);
            this.masterEdges[id] = null;
            delete this.masterEdges[id];
            this.refCount--;
            ret.push(id);
        }
        this.masterEdges = null;
        return ret;
    },
    deleteAllSlaveEdges: function () {
        var ret = [];
        for (var id in this.slaveEdges) {
            this.slaveEdges[id].deleteMasterEdge(this);
            this.slaveEdges[id] = null;
            delete this.slaveEdges[id];
            this.refCount--;
            ret.push(id);
        }
        this.slaveEdges = null;
        return ret;
    },
    returnCell: function () {
        return this.cell;
    }
};
function getVertexId(sheetId, cellId) {
    return sheetId + cCharDelimiter + cellId;
}
function lockDraw(wb) {
    lc++;
    wb.isNeedCacheClean = false;
    if (lc == 0) {
        arrRecalc = {};
    }
}
function unLockDraw(wb) {
    lc > 0 ? lc--:true;
    if (lc == 0) {
        wb.isNeedCacheClean = true;
        arrRecalc = {};
    }
}
function buildRecalc(_wb, notrec) {
    var ws;
    if (lc > 1) {
        return;
    }
    for (var id in arrRecalc) {
        ws = _wb.getWorksheetById(id);
        if (ws) {
            ws._BuildDependencies(arrRecalc[id]);
        }
    }
    if (!notrec) {
        recalc(_wb);
    }
}
function searchCleenCacheArea(o1, o2) {
    var o3 = {};
    for (var _item in o2) {
        if (o1 && o1.hasOwnProperty(_item)) {
            if (o1[_item].min.getRow() > o2[_item].min.getRow()) {
                o1[_item].min = new CellAddress(o2[_item].min.getRow(), o1[_item].min.getCol());
            }
            if (o1[_item].min.getCol() > o2[_item].min.getCol()) {
                o1[_item].min = new CellAddress(o1[_item].min.getRow(), o2[_item].min.getCol());
            }
            if (o1[_item].max.getRow() < o2[_item].max.getRow()) {
                o1[_item].max = new CellAddress(o2[_item].max.getRow(), o1[_item].max.getCol());
            }
            if (o1[_item].max.getCol() < o2[_item].max.getCol()) {
                o1[_item].max = new CellAddress(o1[_item].max.getRow(), o2[_item].max.getCol());
            }
            o3[_item] = o1[_item];
        } else {
            o3[_item] = o2[_item];
        }
    }
    for (var _item in o1) {
        if (o3 && o3.hasOwnProperty(_item)) {
            if (o1[_item].min.getRow() > o3[_item].min.getRow()) {
                o1[_item].min = new CellAddress(o3[_item].min.getRow(), o1[_item].min.getCol());
            }
            if (o1[_item].min.getCol() > o3[_item].min.getCol()) {
                o1[_item].min = new CellAddress(o1[_item].min.getRow(), o3[_item].min.getCol());
            }
            if (o1[_item].max.getRow() < o3[_item].max.getRow()) {
                o1[_item].max = new CellAddress(o3[_item].max.getRow(), o1[_item].max.getCol());
            }
            if (o1[_item].max.getCol() < o3[_item].max.getCol()) {
                o1[_item].max = new CellAddress(o1[_item].max.getRow(), o3[_item].max.getCol());
            }
            o3[_item] = o1[_item];
        } else {
            o3[_item] = o1[_item];
        }
    }
    return o3;
}
function helpRecalc(dep1, nR, calculatedCells, wb) {
    var sr1, sr2;
    for (var i = 0; i < dep1.badF.length; i++) {
        for (var j = 0; j < dep1.depF.length; j++) {
            if (dep1.badF[i] == dep1.depF[j]) {
                dep1.depF.splice(j, 1);
            }
        }
    }
    for (var j = 0; j < dep1.depF.length; j++) {
        if (dep1.depF[j].nodeId in nR) {
            nR[dep1.depF[j].nodeId] = undefined;
            delete nR[dep1.depF[j].nodeId];
            nR.length--;
        }
    }
    for (var j = 0; j < dep1.badF.length; j++) {
        if (dep1.badF[j].nodeId in nR) {
            nR[dep1.badF[j].nodeId] = undefined;
            delete nR[dep1.badF[j].nodeId];
            nR.length--;
        }
    }
    sr1 = wb.recalcDependency(dep1.badF, true);
    sr2 = wb.recalcDependency(dep1.depF, false);
    return searchCleenCacheArea(sr1, sr2);
}
function sortDependency(ws, ar) {
    var wb = ws.workbook,
    dep, sr1, sr2, sr, calculatedCells = {};
    ws._BuildDependencies(ar);
    for (var id in ar) {
        if (!wb.dependencyFormulas.nodeExist2(ws.Id, ar[id])) {
            continue;
        }
        dep = wb.dependencyFormulas.t_sort_slave(ws.Id, ar[id]);
        for (var i = 0; i < dep.badF.length; i++) {
            for (var j = 0; j < dep.depF.length; j++) {
                if (dep.badF[i] == dep.depF[j]) {
                    dep.depF.splice(j, 1);
                }
            }
        }
        sr1 = helpRecalc(dep, wb.needRecalc, calculatedCells, wb);
        sr = searchCleenCacheArea(sr, sr1);
    }
    for (var _item in sr) {
        wb.handlers.trigger("cleanCellCache", _item, new Asc.Range(0, sr[_item].min.getRow0(), wb.getWorksheetById(_item).getColsCount() - 1, sr[_item].max.getRow0()), c_oAscCanChangeColWidth.numbers);
    }
}
function recalc(wb) {
    var nR = wb.needRecalc,
    thas = wb,
    calculatedCells = new Object(),
    nRLength = nR.length,
    first = true,
    startActionOn = false,
    timerID,
    timeStart,
    timeEnd,
    timeCount = 0,
    timeoutID1,
    timeoutID2,
    sr = new Object();
    function R() {
        if (nR.length > 0) {
            timeStart = (new Date()).getTime();
            var dep1, f = false,
            id;
            for (var id1 in nR) {
                if (id1 == "length") {
                    continue;
                }
                id = id1;
                break;
            }
            if (id === undefined) {
                nR.length = 0;
            }
            if (id in nR) {
                var nRId0 = nR[id][0],
                nRId1 = nR[id][1],
                sr1,
                sr2;
                dep1 = thas.dependencyFormulas.t_sort_master(nRId0, nRId1);
                sr1 = helpRecalc(dep1, nR, calculatedCells, thas);
                dep1 = thas.dependencyFormulas.t_sort_slave(nRId0, nRId1);
                sr2 = helpRecalc(dep1, nR, calculatedCells, thas);
                sr = searchCleenCacheArea(sr, searchCleenCacheArea(sr1, sr2));
                if (nR[id]) {
                    delete nR[id];
                    nR.length--;
                }
                id = undefined;
            }
            clearTimeout(timerID);
            timeEnd = (new Date()).getTime();
            timeCount += (timeEnd - timeStart);
            if (first) {
                timeoutID1 = setTimeout(function () {
                    var pr = Math.round((nRLength - nR.length) / nRLength * 10000) / 100;
                    if (pr == 0 || timeCount * 100 / pr > 2000) {
                        timeoutID2 = setTimeout(function () {
                            startActionOn = true;
                            thas.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
                        },
                        0);
                    }
                },
                500);
                first = false;
            }
            timerID = setTimeout(R, 0);
        } else {
            first = false;
            thas.isNeedCacheClean = true;
            for (var _item in sr) {
                thas.handlers.trigger("cleanCellCache", _item, new Asc.Range(0, sr[_item].min.getRow0(), thas.getWorksheetById(_item).getColsCount() - 1, sr[_item].max.getRow0()), c_oAscCanChangeColWidth.numbers);
            }
            clearTimeout(timeoutID1);
            clearTimeout(timeoutID2);
            if (startActionOn) {
                thas.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
            }
            nR.length = 0;
        }
    }
    if (nR.length > 0) {
        R();
    }
}
function angleFormatToInterface(val) {
    var nRes = 0;
    if (0 <= val && val <= 180) {
        nRes = val <= 90 ? val : 90 - val;
    }
    return nRes;
}
function angleFormatToInterface2(val) {
    if (g_nVerticalTextAngle == val) {
        return val;
    } else {
        return angleFormatToInterface(val);
    }
}
function angleInterfaceToFormat(val) {
    var nRes = val;
    if (-90 <= val && val <= 90) {
        if (val < 0) {
            nRes = 90 - val;
        }
    } else {
        if (g_nVerticalTextAngle != val) {
            nRes = 0;
        }
    }
    return nRes;
}
$(function () {
    aStandartNumFormats = new Array();
    aStandartNumFormats[0] = "General";
    aStandartNumFormats[1] = "0";
    aStandartNumFormats[2] = "0.00";
    aStandartNumFormats[3] = "#,##0";
    aStandartNumFormats[4] = "#,##0.00";
    aStandartNumFormats[9] = "0%";
    aStandartNumFormats[10] = "0.00%";
    aStandartNumFormats[11] = "0.00E+00";
    aStandartNumFormats[12] = "# ?/?";
    aStandartNumFormats[13] = "# ??/??";
    aStandartNumFormats[14] = "m/d/yyyy";
    aStandartNumFormats[15] = "d-mmm-yy";
    aStandartNumFormats[16] = "d-mmm";
    aStandartNumFormats[17] = "mmm-yy";
    aStandartNumFormats[18] = "h:mm AM/PM";
    aStandartNumFormats[19] = "h:mm:ss AM/PM";
    aStandartNumFormats[20] = "h:mm";
    aStandartNumFormats[21] = "h:mm:ss";
    aStandartNumFormats[22] = "m/d/yyyy h:mm";
    aStandartNumFormats[37] = "#,##0_);(#,##0)";
    aStandartNumFormats[38] = "#,##0_);[Red](#,##0)";
    aStandartNumFormats[39] = "#,##0.00_);(#,##0.00)";
    aStandartNumFormats[40] = "#,##0.00_);[Red](#,##0.00)";
    aStandartNumFormats[45] = "mm:ss";
    aStandartNumFormats[46] = "[h]:mm:ss";
    aStandartNumFormats[47] = "mm:ss.0";
    aStandartNumFormats[48] = "##0.0E+0";
    aStandartNumFormats[49] = "@";
    aStandartNumFormatsId = new Object();
    for (var i in aStandartNumFormats) {
        aStandartNumFormatsId[aStandartNumFormats[i]] = i - 0;
    }
});
function Workbook(sUrlPath, eventsHandlers, oApi) {
    this.oApi = oApi;
    this.sUrlPath = sUrlPath;
    this.handlers = eventsHandlers;
    this.needRecalc = {
        length: 0
    };
    this.dependencyFormulas = new DependencyGraph(this);
    this.nActive = 0;
    History = new CHistory(this);
    g_oIdCounter = new CIdCounter();
    g_oTableId = new CTableId();
    this.theme = null;
    this.clrSchemeMap = null;
    this.DefinedNames = new Object();
    this.oRealDefinedNames = new Object();
    this.oNameGenerator = new NameGenerator(this);
    this.CellStyles = new CCellStyles();
    this.TableStyles = new CTableStyles();
    this.oStyleManager = new StyleManager(this);
    this.calcChain = new Array();
    this.aWorksheets = new Array();
    this.aWorksheetsById = new Object();
    this.cwf = {};
    this.isNeedCacheClean = true;
    this.startActionOn = false;
    this.aCollaborativeActions = new Array();
    this.bCollaborativeChanges = false;
    this.bUndoChanges = false;
    this.bRedoChanges = false;
    this.aCollaborativeChangeElements = new Array();
}
Workbook.prototype.initGlobalObjects = function () {
    g_oUndoRedoCell = new UndoRedoCell(this);
    g_oUndoRedoWorksheet = new UndoRedoWoorksheet(this);
    g_oUndoRedoWorkbook = new UndoRedoWorkbook(this);
    g_oUndoRedoCol = new UndoRedoRowCol(this, false);
    g_oUndoRedoRow = new UndoRedoRowCol(this, true);
    g_oUndoRedoComment = new UndoRedoComment(this);
    g_oUndoRedoAutoFilters = new UndoRedoAutoFilters(this);
    g_oUndoRedoGraphicObjects = new UndoRedoGraphicObjects(this);
    g_oIdCounter.Set_Load(false);
};
Workbook.prototype.init = function () {
    if (this.nActive < 0) {
        this.nActive = 0;
    }
    if (this.nActive >= this.aWorksheets.length) {
        this.nActive = this.aWorksheets.length - 1;
    }
    this.buildDependency();
    var nR = this.needRecalc,
    thas = this,
    calculatedCells = {},
    nRLength = nR.length,
    timeStart, timeEnd, timeCount = 0,
    first = true,
    sr;
    if (nR.length > 0) {
        for (var id in nR) {
            var sr1, sr2;
            timeStart = (new Date()).getTime();
            var dep1, f = false;
            if (id == "length") {
                continue;
            }
            dep1 = thas.dependencyFormulas.t_sort_master(nR[id][0], nR[id][1]);
            for (var i = 0; i < dep1.badF.length; i++) {
                for (var j = 0; j < dep1.depF.length; j++) {
                    if (dep1.badF[i] == dep1.depF[j]) {
                        dep1.depF.splice(j, 1);
                    }
                }
            }
            for (var j = 0; j < dep1.depF.length; j++) {
                if (dep1.depF[j].nodeId in nR) {
                    nR[dep1.depF[j].nodeId] = undefined;
                    delete nR[dep1.depF[j].nodeId];
                    nR.length--;
                }
            }
            for (var j = 0; j < dep1.badF.length; j++) {
                if (dep1.badF[j].nodeId in nR) {
                    nR[dep1.badF[j].nodeId] = undefined;
                    delete nR[dep1.badF[j].nodeId];
                    nR.length--;
                }
            }
            sr1 = thas.recalcDependency(dep1.badF, true, true);
            for (var k = 0; k < dep1.depF.length; k++) {
                if (dep1.depF[k].nodeId in calculatedCells) {
                    dep1.depF.splice(k, 1);
                    k--;
                }
            }
            sr2 = thas.recalcDependency(dep1.depF, false);
            for (var k = 0; k < dep1.depF.length; k++) {
                calculatedCells[dep1.depF[k].nodeId] = dep1.depF[k].nodeId;
            }
            sr = searchCleenCacheArea(sr, searchCleenCacheArea(sr1, sr2));
            timeEnd = (new Date()).getTime();
            timeCount += (timeEnd - timeStart);
        }
        first = false;
        thas.isNeedCacheClean = true;
        var ws = thas.getWorksheet(thas.getActive());
        thas.handlers.trigger("cleanCellCache", ws.getId(), new Asc.Range(0, 0, ws.getColsCount() - 1, ws.getRowsCount() - 1), c_oAscCanChangeColWidth.numbers);
        thas.startActionOn = false;
        thas.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
    }
    for (var i = 0, length = this.aWorksheets.length; i < length; ++i) {
        var ws = this.aWorksheets[i];
        ws.initPostOpen();
    }
};
Workbook.prototype.rebuildColors = function () {
    g_oColorManager.rebuildColors();
    for (var i = 0, length = this.aWorksheets.length; i < length; ++i) {
        this.aWorksheets[i].rebuildColors();
    }
};
Workbook.prototype.getDefaultFont = function () {
    return g_oDefaultFont.fn;
};
Workbook.prototype.getDefaultSize = function () {
    return g_oDefaultFont.fs;
};
Workbook.prototype.getActive = function () {
    return this.nActive;
};
Workbook.prototype.setActive = function (index) {
    if (index >= 0 && index < this.aWorksheets.length) {
        this.nActive = index;
        return true;
    }
    return false;
};
Workbook.prototype.getWorksheet = function (index) {
    if (index >= 0 && index < this.aWorksheets.length) {
        return this.aWorksheets[index];
    }
    return null;
};
Workbook.prototype.getWorksheetById = function (id) {
    return this.aWorksheetsById[id];
};
Workbook.prototype.getWorksheetByName = function (name) {
    for (var i = 0; i < this.aWorksheets.length; i++) {
        if (this.aWorksheets[i].getName() == name) {
            return this.aWorksheets[i];
        }
    }
    return null;
};
Workbook.prototype.getWorksheetIndexByName = function (name) {
    for (var i = 0; i < this.aWorksheets.length; i++) {
        if (this.aWorksheets[i].getName() == name) {
            return i;
        }
    }
    return null;
};
Workbook.prototype.getWorksheetCount = function () {
    return this.aWorksheets.length;
};
Workbook.prototype.createWorksheet = function (indexBefore, sName, sId) {
    History.TurnOff();
    var oNewWorksheet = new Woorksheet(this, this.aWorksheets.length, true, sId);
    if (null != sName) {
        if (true == this.checkValidSheetName(sName)) {
            oNewWorksheet.sName = sName;
        }
    }
    oNewWorksheet.init();
    oNewWorksheet.initPostOpen();
    if (indexBefore >= 0 && indexBefore < this.aWorksheets.length) {
        this.aWorksheets.splice(indexBefore, 0, oNewWorksheet);
    } else {
        indexBefore = this.aWorksheets.length;
        this.aWorksheets.push(oNewWorksheet);
    }
    this.aWorksheetsById[oNewWorksheet.getId()] = oNewWorksheet;
    this._updateWorksheetIndexes();
    this.setActive(oNewWorksheet.index);
    if (indexBefore > 0 && indexBefore < this.aWorksheets.length - 1) {
        var sheetStart = this.getWorksheet(indexBefore - 1).getId(),
        sheetStop = this.getWorksheet(indexBefore + 1).getId(),
        nodesSheetStart = this.dependencyFormulas.getNodeBySheetId(sheetStart),
        nodesSheetStop = this.dependencyFormulas.getNodeBySheetId(sheetStop),
        arr = {};
        for (var i = 0; i < nodesSheetStart.length; i++) {
            var n = nodesSheetStart[i].getSlaveEdges();
            for (var id in n) {
                if (n[id].weightNode == 2) {
                    arr[n[id].nodeId] = n[id];
                }
                n[id].weightNode = 0;
            }
        }
        for (var i = 0; i < nodesSheetStop.length; i++) {
            var n = nodesSheetStop[i].getSlaveEdges();
            for (var id in n) {
                if (n[id].weightNode == 2) {
                    arr[n[id].nodeId] = n[id];
                }
                n[id].weightNode = 0;
            }
        }
        for (var id in arr) {
            arr[id].cell.formulaParsed.buildDependencies();
        }
    }
    History.TurnOn();
    History.Create_NewPoint();
    History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetAdd, null, null, new UndoRedoData_SheetAdd(indexBefore, oNewWorksheet.getName(), null, oNewWorksheet.getId()));
    return oNewWorksheet.index;
};
Workbook.prototype.copyWorksheet = function (index, insertBefore, sName, sId, bFromRedo) {
    if (index >= 0 && index < this.aWorksheets.length) {
        History.TurnOff();
        var wsFrom = this.aWorksheets[index];
        var nameSheet = wsFrom.getName();
        var newSheet = wsFrom.clone(sId, bFromRedo);
        if (null != sName) {
            if (true == this.checkValidSheetName(sName)) {
                newSheet.sName = sName;
            }
        }
        newSheet.init();
        newSheet.initPostOpen();
        if (null != insertBefore && insertBefore >= 0 && insertBefore < this.aWorksheets.length) {
            this.aWorksheets.splice(insertBefore, 0, newSheet);
        } else {
            this.aWorksheets.push(newSheet);
        }
        this.aWorksheetsById[newSheet.getId()] = newSheet;
        this._updateWorksheetIndexes();
        if (this.cwf[wsFrom.getId()]) {
            this.cwf[newSheet.getId()] = {
                cells: {}
            };
            for (var id in this.cwf[wsFrom.getId()].cells) {
                this.cwf[newSheet.getId()].cells[id] = this.cwf[wsFrom.getId()].cells[id];
            }
            this.buildDependency();
        }
        History.TurnOn();
        History.Create_NewPoint();
        History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetAdd, null, null, new UndoRedoData_SheetAdd(insertBefore, newSheet.getName(), wsFrom.getId(), newSheet.getId()));
        if (! (bFromRedo === true)) {
            wsFrom.copyDrawingObjects(newSheet);
        }
    }
};
Workbook.prototype.insertWorksheet = function (index, sheet, cwf) {
    if (null != index && index >= 0 && index < this.aWorksheets.length) {
        this.aWorksheets.splice(index, 0, sheet);
    } else {
        this.aWorksheets.push(sheet);
    }
    this.aWorksheetsById[sheet.getId()] = sheet;
    this._updateWorksheetIndexes();
    this.cwf[sheet.getId()] = cwf;
    this.buildDependency();
};
Workbook.prototype.replaceWorksheet = function (indexFrom, indexTo) {
    if (indexFrom >= 0 && indexFrom < this.aWorksheets.length && indexTo >= 0 && indexTo < this.aWorksheets.length) {
        History.TurnOff();
        var oWsTo = this.aWorksheets[indexTo];
        var tempW = {
            wFN: this.aWorksheets[indexFrom].getName(),
            wFI: indexFrom,
            wFId: this.aWorksheets[indexFrom].getId(),
            wTN: oWsTo.getName(),
            wTI: indexTo,
            wTId: oWsTo.getId()
        };
        var movedSheet = this.aWorksheets.splice(indexFrom, 1);
        this.aWorksheets.splice(indexTo, 0, movedSheet[0]);
        this._updateWorksheetIndexes();
        lockDraw(this);
        var a = this.dependencyFormulas.getNodeBySheetId(movedSheet[0].getId());
        for (var i = 0; i < a.length; i++) {
            var se = a[i].getSlaveEdges();
            if (se) {
                for (var id in se) {
                    var cID = se[id].cellId,
                    _ws = this.getWorksheetById(se[id].sheetId),
                    f = _ws.getCell2(cID).getCells()[0].sFormula;
                    if (f == null || f == undefined) {
                        continue;
                    }
                    if (f.indexOf(tempW.wFN + ":") > 0 || f.indexOf(":" + tempW.wFN) > 0) {
                        var _c = _ws.getCell2(cID).getCells()[0];
                        _c.setFormula(_c.formulaParsed.moveSheet(tempW).assemble());
                        this.dependencyFormulas.deleteMasterNodes(_ws.Id, cID);
                        if (!arrRecalc[_ws.getId()]) {
                            arrRecalc[_ws.getId()] = {};
                        }
                        arrRecalc[_ws.getId()][cID] = cID;
                        this.needRecalc[getVertexId(_ws.getId(), cID)] = [_ws.getId(), cID];
                        if (this.needRecalc.length < 0) {
                            this.needRecalc.length = 0;
                        }
                        this.needRecalc.length++;
                    } else {
                        if (f.indexOf(_ws.getName()) < 0) {
                            this.dependencyFormulas.deleteMasterNodes(_ws.Id, cID);
                            _ws._BuildDependencies({
                                id: cID
                            });
                            if (!arrRecalc[_ws.getId()]) {
                                arrRecalc[_ws.getId()] = {};
                            }
                            arrRecalc[_ws.getId()][cID] = cID;
                            this.needRecalc[getVertexId(_ws.getId(), cID)] = [_ws.getId(), cID];
                            if (this.needRecalc.length < 0) {
                                this.needRecalc.length = 0;
                            }
                            this.needRecalc.length++;
                        }
                    }
                }
            }
        }
        History.TurnOn();
        History.Create_NewPoint();
        History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetMove, null, null, new UndoRedoData_FromTo(indexFrom, indexTo), true);
        buildRecalc(this);
        unLockDraw(this);
    }
};
Workbook.prototype.removeWorksheet = function (nIndex, outputParams) {
    var bEmpty = true;
    for (var i = 0, length = this.aWorksheets.length; i < length; ++i) {
        var worksheet = this.aWorksheets[i];
        if (false == worksheet.getHidden() && i != nIndex) {
            bEmpty = false;
            break;
        }
    }
    if (bEmpty) {
        return -1;
    }
    var nNewActive = this.nActive;
    var removedSheet = this.aWorksheets.splice(nIndex, 1);
    if (removedSheet.length > 0) {
        History.TurnOff();
        var _cwf;
        for (var i = 0; i < removedSheet.length; i++) {
            var name = removedSheet[i];
            _cwf = this.cwf[name.getId()];
            this.cwf[name.getId()] = null;
            delete this.cwf[name.getId()];
            delete this.aWorksheetsById[name.getId()];
        }
        lockDraw(this);
        var a = this.dependencyFormulas.getNodeBySheetId(removedSheet[0].getId());
        for (var i = 0; i < a.length; i++) {
            var se = a[i].getSlaveEdges();
            if (se) {
                for (var id in se) {
                    if (se[id].sheetId != removedSheet[0].getId()) {
                        var _ws = this.getWorksheetById(se[id].sheetId),
                        f = _ws.getCell2(se[id].cellId).getCells()[0].sFormula,
                        cID = se[id].cellId;
                        if (!arrRecalc[_ws.getId()]) {
                            arrRecalc[_ws.getId()] = {};
                        }
                        arrRecalc[_ws.getId()][cID] = cID;
                        this.needRecalc[getVertexId(_ws.getId(), cID)] = [_ws.getId(), cID];
                        if (this.needRecalc.length < 0) {
                            this.needRecalc.length = 0;
                        }
                        this.needRecalc.length++;
                    }
                }
            }
        }
        this.dependencyFormulas.removeNodeBySheetId(name.getId());
        var bFind = false;
        if (nNewActive < this.aWorksheets.length) {
            for (var i = nNewActive; i < this.aWorksheets.length; ++i) {
                if (false == this.aWorksheets[i].getHidden()) {
                    bFind = true;
                    nNewActive = i;
                    break;
                }
            }
        }
        if (false == bFind) {
            for (var i = nNewActive - 1; i >= 0; --i) {
                if (false == this.aWorksheets[i].getHidden()) {
                    nNewActive = i;
                    break;
                }
            }
        }
        History.TurnOn();
        History.Create_NewPoint();
        var oRemovedSheet = removedSheet[0];
        History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetRemove, null, null, new UndoRedoData_SheetRemove(nIndex, oRemovedSheet.getId(), oRemovedSheet, _cwf));
        if (null != outputParams) {
            outputParams.sheet = oRemovedSheet;
            outputParams.cwf = _cwf;
        }
        this._updateWorksheetIndexes();
        this.nActive = nNewActive;
        buildRecalc(this);
        unLockDraw(this);
        return nNewActive;
    }
    return -1;
};
Workbook.prototype._updateWorksheetIndexes = function () {
    for (var i = 0, length = this.aWorksheets.length; i < length; ++i) {
        this.aWorksheets[i]._setIndex(i);
    }
};
Workbook.prototype.checkUniqueSheetName = function (name) {
    var workbookSheetCount = this.getWorksheetCount();
    for (var i = 0; i < workbookSheetCount; i++) {
        if (this.getWorksheet(i).getName() == name) {
            return i;
        }
    }
    return -1;
};
Workbook.prototype.checkValidSheetName = function (name) {
    return name.length < g_nSheetNameMaxLength;
};
Workbook.prototype.getUniqueSheetNameFrom = function (name, bCopy) {
    var nIndex = 1;
    var sNewName = "";
    var fGetPostfix = null;
    if (bCopy) {
        var result = /^(.*)\((\d)\)$/.exec(name);
        if (result) {
            fGetPostfix = function (nIndex) {
                return "(" + nIndex + ")";
            };
            name = result[1];
        } else {
            fGetPostfix = function (nIndex) {
                return " (" + nIndex + ")";
            };
            name = name;
        }
    } else {
        fGetPostfix = function (nIndex) {
            return nIndex.toString();
        };
    }
    var workbookSheetCount = this.getWorksheetCount();
    while (nIndex < 10000) {
        var sPosfix = fGetPostfix(nIndex);
        sNewName = name + sPosfix;
        if (sNewName.length > g_nSheetNameMaxLength) {
            name = name.substring(0, g_nSheetNameMaxLength - sPosfix.length);
            sNewName = name + sPosfix;
        }
        var bUniqueName = true;
        for (var i = 0; i < workbookSheetCount; i++) {
            if (this.getWorksheet(i).getName() == sNewName) {
                bUniqueName = false;
                break;
            }
        }
        if (bUniqueName) {
            break;
        }
        nIndex++;
    }
    return sNewName;
};
Workbook.prototype.generateFontMap = function () {
    var oFontMap = new Object();
    oFontMap["Calibri"] = 1;
    oFontMap["Arial"] = 1;
    if (null != g_oDefaultFont.fn) {
        oFontMap[g_oDefaultFont.fn] = 1;
    }
    for (var i = 0, length = this.aWorksheets.length; i < length; ++i) {
        this.aWorksheets[i].generateFontMap(oFontMap);
    }
    if (this.theme && this.theme.themeElements && this.theme.themeElements.fontScheme) {
        var majorFont = this.theme.themeElements.fontScheme.majorFont;
        if (oFontMap["+mj-lt"]) {
            if (majorFont && typeof majorFont.latin === "string" && majorFont.latin.length > 0) {
                oFontMap[majorFont.latin] = 1;
            }
        }
        if (oFontMap["+mj-ea"]) {
            if (majorFont && typeof majorFont.ea === "string" && majorFont.ea.length > 0) {
                oFontMap[majorFont.ea] = 1;
            }
        }
        if (oFontMap["+mj-cs"]) {
            if (majorFont && typeof majorFont.cs === "string" && majorFont.cs.length > 0) {
                oFontMap[majorFont.cs] = 1;
            }
        }
        var minorFont = this.theme.themeElements.fontScheme.minorFont;
        if (oFontMap["+mn-lt"]) {
            if (minorFont && typeof minorFont.latin === "string" && minorFont.latin.length > 0) {
                oFontMap[minorFont.latin] = 1;
            }
        }
        if (oFontMap["+mn-ea"]) {
            if (minorFont && typeof minorFont.ea === "string" && minorFont.ea.length > 0) {
                oFontMap[minorFont.ea] = 1;
            }
        }
        if (oFontMap["+mn-cs"]) {
            if (minorFont && typeof minorFont.cs === "string" && minorFont.cs.length > 0) {
                oFontMap[minorFont.cs] = 1;
            }
        }
    }
    delete oFontMap["+mj-lt"];
    delete oFontMap["+mj-ea"];
    delete oFontMap["+mj-cs"];
    delete oFontMap["+mn-lt"];
    delete oFontMap["+mn-ea"];
    delete oFontMap["+mn-cs"];
    this.CellStyles.generateFontMap(oFontMap);
    var aRes = new Array();
    for (var i in oFontMap) {
        aRes.push(i);
    }
    return aRes;
};
Workbook.prototype.recalcWB = function (is3D) {
    var dep1, thas = this,
    sr, sr1, sr2;
    if (this.dependencyFormulas.getNodesLength() > 0) {
        if (is3D) {
            for (var i = 0; i < this.getWorksheetCount(); i++) {
                __ws = this.getWorksheet(i);
                for (var id in this.cwf[__ws.Id].cells) {
                    var c = new CellAddress(id);
                    if (__ws._getCellNoEmpty(c.getRow0(), c.getCol0()).formulaParsed.is3D) {
                        dep1 = this.dependencyFormulas.t_sort_slave(__ws.Id, id);
                        sr1 = thas.recalcDependency(dep1.badF, true);
                        sr2 = thas.recalcDependency(dep1.depF, false);
                        sr = searchCleenCacheArea(sr, searchCleenCacheArea(sr1, sr2));
                    }
                }
            }
        } else {
            dep1 = this.dependencyFormulas.t_sort();
            sr1 = thas.recalcDependency(dep1.badF, true);
            sr2 = thas.recalcDependency(dep1.depF, false);
            sr = searchCleenCacheArea(sr, searchCleenCacheArea(sr1, sr2));
        }
        for (var _item in sr) {
            this.handlers.trigger("cleanCellCache", _item, new Asc.Range(0, sr[_item].min.getRow0(), this.getWorksheetById(_item).getColsCount() - 1, sr[_item].max.getRow0()), c_oAscCanChangeColWidth.numbers);
        }
    }
};
Workbook.prototype.isDefinedNamesExists = function (name, sheetId) {
    if (null != sheetId) {
        var ws = this.getWorksheetById(sheetId);
        if (null != ws) {
            var bExist = false;
            if (ws.DefinedNames) {
                bExist = !!ws.DefinedNames[name];
            }
            if (bExist) {
                return bExist;
            }
        }
    }
    if (this.DefinedNames) {
        return !! this.DefinedNames[name];
    }
    return false;
};
Workbook.prototype.getDefinesNames = function (name, sheetId) {
    if (null != sheetId) {
        var ws = this.getWorksheetById(sheetId);
        if (null != ws) {
            if (ws.DefinedNames) {
                var oDefName = ws.DefinedNames[name];
                if (null != oDefName) {
                    return oDefName;
                }
            }
        }
    }
    if (this.DefinedNames) {
        var oDefName = this.DefinedNames[name];
        if (null != oDefName) {
            return oDefName;
        }
    }
    return false;
};
Workbook.prototype.buildDependency = function () {
    dep = null;
    this.dependencyFormulas.clear();
    this.dependencyFormulas = null;
    this.dependencyFormulas = new DependencyGraph(this);
    for (var i in this.cwf) {
        this.getWorksheetById(i)._BuildDependencies(this.cwf[i].cells);
    }
};
Workbook.prototype.recalcDependency = function (f, bad, notRecalc) {
    if (f.length > 0) {
        var sr = {};
        for (var i = 0; i < f.length; i++) {
            if (f[i].cellId.indexOf(":") > -1) {
                continue;
            }
            var l = new CellAddress(f[i].cellId);
            if (! (f[i].sheetId in sr)) {
                sr[f[i].sheetId] = {
                    max: new CellAddress(f[i].cellId),
                    min: new CellAddress(f[i].cellId)
                };
            }
            if (sr[f[i].sheetId].min.getRow() > l.getRow()) {
                sr[f[i].sheetId].min = new CellAddress(l.getRow(), sr[f[i].sheetId].min.getCol());
            }
            if (sr[f[i].sheetId].min.getCol() > l.getCol()) {
                sr[f[i].sheetId].min = new CellAddress(sr[f[i].sheetId].min.getRow(), l.getCol());
            }
            if (sr[f[i].sheetId].max.getRow() < l.getRow()) {
                sr[f[i].sheetId].max = new CellAddress(l.getRow(), sr[f[i].sheetId].max.getCol());
            }
            if (sr[f[i].sheetId].max.getCol() < l.getCol()) {
                sr[f[i].sheetId].max = new CellAddress(sr[f[i].sheetId].max.getRow(), l.getCol());
            }
            if (!notRecalc) {
                this.getWorksheetById(f[i].sheetId)._RecalculatedFunctions(f[i].cellId, bad);
            }
        }
        return sr;
    }
};
Workbook.prototype.SerializeHistory = function () {
    var aRes = new Array();
    var wsViews = this.oApi.wb.wsViews;
    for (var i in wsViews) {
        if (isRealObject(wsViews[i]) && isRealObject(wsViews[i].objectRender) && isRealObject(wsViews[i].objectRender.controller)) {
            wsViews[i].objectRender.controller.refreshContentChanges();
        }
    }
    var aActions = this.aCollaborativeActions.concat(History.GetSerializeArray());
    if (aActions.length > 0) {
        var oMemory = new CMemory();
        var oThis = this;
        var oSheetPlaceData = new Array();
        for (var i = 0, length = this.aWorksheets.length; i < length; ++i) {
            oSheetPlaceData.push(this.aWorksheets[i].getId());
        }
        aActions.push(new UndoRedoItemSerializable(g_oUndoRedoWorkbook, historyitem_Workbook_SheetPositions, null, null, new UndoRedoData_SheetPositions(oSheetPlaceData)));
        for (var i = 0, length = aActions.length; i < length; ++i) {
            var nPosStart = oMemory.GetCurPosition();
            var item = aActions[i];
            item.Serialize(oMemory, this.oApi.collaborativeEditing);
            var nPosEnd = oMemory.GetCurPosition();
            var nLen = nPosEnd - nPosStart;
            if (nLen > 0) {
                aRes.push(nLen + ";" + oMemory.GetBase64Memory2(nPosStart, nLen));
            }
        }
        aRes.push("0;fontmap" + this.generateFontMap().join(","));
        this.aCollaborativeActions = new Array();
    }
    return aRes;
};
Workbook.prototype.DeserializeHistory = function (aChanges, fCallback) {
    var bRes = false;
    var oThis = this;
    this.aCollaborativeActions = this.aCollaborativeActions.concat(History.GetSerializeArray());
    if (aChanges.length > 0) {
        this.bCollaborativeChanges = true;
        var dstLen = 0;
        var aIndexes = new Array();
        for (var i = 0, length = aChanges.length; i < length; ++i) {
            var sChange = aChanges[i];
            var nIndex = sChange.indexOf(";");
            if (-1 != nIndex) {
                dstLen += parseInt(sChange.substring(0, nIndex));
                nIndex++;
            }
            aIndexes.push(nIndex);
        }
        var pointer = g_memory.Alloc(dstLen);
        var stream = new FT_Stream2(pointer.data, dstLen);
        stream.obj = pointer.obj;
        var nCurOffset = 0;
        var oFontMap = new Object();
        var sFontMapString = "0;fontmap";
        for (var i = 0, length = aChanges.length; i < length; ++i) {
            var sChange = aChanges[i];
            if (sFontMapString == sChange.substring(0, sFontMapString.length)) {
                var sFonts = sChange.substring(sFontMapString.length);
                var aFonts = sFonts.split(",");
                for (var j = 0, length2 = aFonts.length; j < length2; ++j) {
                    oFontMap[aFonts[j]] = 1;
                }
            }
        }
        var aFontMap = new Array();
        for (var i in oFontMap) {
            aFontMap.push(i);
        }
        window["Asc"]["editor"]._loadFonts(aFontMap, function () {
            History.Clear();
            History.Create_NewPoint();
            History.SetSelection(null, true);
            var oHistoryPositions = null;
            var oRedoObjectParam = new Asc.RedoObjectParam();
            History.RedoPrepare(oRedoObjectParam);
            for (var i = 0, length = aChanges.length; i < length; ++i) {
                var sChange = aChanges[i];
                if (sFontMapString != sChange.substring(0, sFontMapString.length)) {
                    var oBinaryFileReader = new BinaryFileReader();
                    nCurOffset = oBinaryFileReader.getbase64DecodedData2(sChange, aIndexes[i], stream, nCurOffset);
                    var item = new UndoRedoItemSerializable();
                    item.Deserialize(stream);
                    if (null != item.oClass && null != item.nActionType) {
                        if (g_oUndoRedoWorkbook == item.oClass && historyitem_Workbook_SheetPositions == item.nActionType) {
                            oHistoryPositions = item;
                        } else {
                            if (g_oUndoRedoGraphicObjects == item.oClass && item.oData.drawingData) {
                                item.oData.drawingData.bCollaborativeChanges = true;
                            }
                            History.RedoAdd(oRedoObjectParam, item.oClass, item.nActionType, item.nSheetId, item.oRange, item.oData);
                        }
                    }
                }
            }
            if (null != oHistoryPositions) {
                History.RedoAdd(oRedoObjectParam, oHistoryPositions.oClass, oHistoryPositions.nActionType, oHistoryPositions.nSheetId, oHistoryPositions.oRange, oHistoryPositions.oData);
            }
            History.RedoEnd(null, oRedoObjectParam);
            oThis.bCollaborativeChanges = false;
            History.Clear();
            if (null != fCallback) {
                fCallback();
            }
        });
    }
};
function Woorksheet(wb, _index, bAddUserId, sId) {
    this.workbook = wb;
    this.DefinedNames = new Object();
    this.sName = this.workbook.getUniqueSheetNameFrom(g_sNewSheetNamePattern, false);
    this.bHidden = false;
    this.dDefaultColWidth = null;
    this.dDefaultheight = null;
    this.nBaseColWidth = null;
    this.index = _index;
    this.Id = null;
    if (null != sId) {
        this.Id = sId;
    } else {
        if (bAddUserId) {
            this.Id = this.workbook.oApi.User.asc_getId() + "_" + g_nNextWorksheetId++;
        } else {
            this.Id = g_nNextWorksheetId++;
        }
    }
    this.nRowsCount = 0;
    this.nColsCount = 0;
    this.aGCells = new Object();
    this.aCols = new Array();
    this.Drawings = new Array();
    this.TableParts = new Array();
    this.AutoFilter = null;
    this.oAllCol = null;
    this.objForRebuldFormula = {};
    this.aComments = new Array();
    this.aCommentsCoords = new Array();
    var oThis = this;
    this.mergeManager = new RangeDataManager(false, function (data, from, to) {
        if (History.Is_On() && (null != from || null != to)) {
            if (null != from) {
                from = from.clone();
            }
            if (null != to) {
                to = to.clone();
            }
            var oHistoryRange = from;
            if (null == oHistoryRange) {
                oHistoryRange = to;
            }
            History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ChangeMerge, oThis.getId(), oHistoryRange, new UndoRedoData_FromTo(new UndoRedoData_BBox(from), new UndoRedoData_BBox(to)));
        }
    });
    this.hyperlinkManager = new RangeDataManager(true, function (data, from, to) {
        if (History.Is_On() && (null != from || null != to)) {
            if (null != from) {
                from = from.clone();
            }
            if (null != to) {
                to = to.clone();
            }
            var oHistoryRange = from;
            if (null == oHistoryRange) {
                oHistoryRange = to;
            }
            var oHistoryData = null;
            if (null == from || null == to) {
                oHistoryData = data.clone();
            }
            History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ChangeHyperlink, oThis.getId(), oHistoryRange, new UndoRedoData_FromToHyperlink(from, to, oHistoryData));
        }
        if (null != to) {
            data.Ref = oThis.getRange3(to.r1, to.c1, to.r2, to.c2);
        }
    });
    this.hyperlinkManager.setDependenceManager(this.mergeManager);
    this.sheetViews = [];
    this.aConditionalFormatting = [];
    this.sheetPr = null;
    this.nMaxRowId = 1;
    this.nMaxColId = 1;
}
Woorksheet.prototype.rebuildColors = function () {
    this._forEachCell(function (cell) {
        cell.cleanCache();
    });
};
Woorksheet.prototype.generateFontMap = function (oFontMap) {
    for (var i = 0, length = this.Drawings.length; i < length; ++i) {
        var drawing = this.Drawings[i];
        if (drawing) {
            drawing.getAllFonts(oFontMap);
        }
    }
    for (var i in this.aCols) {
        var col = this.aCols[i];
        if (null != col && null != col.xfs && null != col.xfs.font && null != col.xfs.font.fn) {
            oFontMap[col.xfs.font.fn] = 1;
        }
    }
    if (null != this.oAllCol && null != this.oAllCol.xfs && null != this.oAllCol.xfs.font && null != this.oAllCol.xfs.font.fn) {
        oFontMap[this.oAllCol.xfs.font.fn] = 1;
    }
    for (var i in this.aGCells) {
        var row = this.aGCells[i];
        if (null != row && null != row.xfs && null != row.xfs.font && null != row.xfs.font.fn) {
            oFontMap[row.xfs.font.fn] = 1;
        }
        for (var j in row.c) {
            var cell = row.c[j];
            if (null != cell) {
                if (null != cell.xfs && null != cell.xfs.font && null != cell.xfs.font.fn) {
                    oFontMap[cell.xfs.font.fn] = 1;
                }
                if (null != cell.oValue && null != cell.oValue.multiText) {
                    for (var k = 0, length3 = cell.oValue.multiText.length; k < length3; ++k) {
                        var part = cell.oValue.multiText[k];
                        if (null != part.format && null != part.format.fn) {
                            oFontMap[part.format.fn] = 1;
                        }
                    }
                }
            }
        }
    }
};
Woorksheet.prototype.clone = function (sNewId, bFromRedo) {
    var oNewWs;
    if (null != sNewId) {
        oNewWs = new Woorksheet(this.workbook, this.workbook.aWorksheets.length, true, sNewId);
    } else {
        oNewWs = new Woorksheet(this.workbook, this.workbook.aWorksheets.length, true);
    }
    oNewWs.sName = this.workbook.getUniqueSheetNameFrom(this.sName, true);
    oNewWs.bHidden = this.bHidden;
    oNewWs.nBaseColWidth = this.nBaseColWidth;
    oNewWs.dDefaultColWidth = this.dDefaultColWidth;
    oNewWs.dDefaultheight = this.dDefaultheight;
    oNewWs.index = this.index;
    oNewWs.nRowsCount = this.nRowsCount;
    oNewWs.nColsCount = this.nColsCount;
    if (this.TableParts) {
        oNewWs.TableParts = Asc.clone(this.TableParts);
    }
    if (this.AutoFilter) {
        oNewWs.AutoFilter = Asc.clone(this.AutoFilter);
    }
    for (var i in this.aCols) {
        oNewWs.aCols[i] = this.aCols[i].clone();
    }
    if (null != this.oAllCol) {
        oNewWs.oAllCol = this.oAllCol.clone();
    }
    for (var i in this.aGCells) {
        oNewWs.aGCells[i] = this.aGCells[i].clone();
    }
    var aMerged = this.mergeManager.getAll();
    oNewWs.mergeManager.stopRecalculate();
    for (var i in aMerged) {
        var elem = aMerged[i];
        var range = oNewWs.getRange3(elem.bbox.r1, elem.bbox.c1, elem.bbox.r2, elem.bbox.c2);
        range.mergeOpen();
    }
    oNewWs.mergeManager.startRecalculate();
    var aHyperlinks = this.hyperlinkManager.getAll();
    oNewWs.hyperlinkManager.stopRecalculate();
    for (var i in aHyperlinks) {
        var elem = aHyperlinks[i];
        var range = oNewWs.getRange3(elem.bbox.r1, elem.bbox.c1, elem.bbox.r2, elem.bbox.c2);
        range.setHyperlinkOpen(elem.data);
    }
    oNewWs.hyperlinkManager.startRecalculate();
    if (null != this.aComments) {
        for (var i = 0; i < this.aComments.length; i++) {
            var comment = new asc_CCommentData(this.aComments[i]);
            comment.wsId = oNewWs.getId();
            comment.setId();
            oNewWs.aComments.push(comment);
        }
    }
    return oNewWs;
};
Woorksheet.prototype.copyDrawingObjects = function (oNewWs) {
    if (null != this.Drawings && this.Drawings.length > 0) {
        oNewWs.Drawings = [];
        var w = new CMemory();
        for (var i = 0; i < this.Drawings.length; ++i) {
            this.Drawings[i].graphicObject.writeToBinaryForCopyPaste(w);
        }
        var binary = w.pos + ";" + w.GetBase64Memory();
        var stream = CreateBinaryReader(binary, 0, binary.length);
        var drawingObjects;
        if (this.Drawings[0] && this.Drawings[0].graphicObject && this.Drawings[0].graphicObject.drawingObjects) {
            drawingObjects = this.Drawings[0].graphicObject.drawingObjects;
        } else {
            drawingObjects = new DrawingObjects();
            drawingObjects.drawingDocument = new CDrawingDocument(drawingObjects);
        }
        for (var i = 0; i < this.Drawings.length; ++i) {
            var obj = null;
            var objectType = stream.GetLong();
            switch (objectType) {
            case CLASS_TYPE_SHAPE:
                obj = new CShape(null, null, null);
                break;
            case CLASS_TYPE_IMAGE:
                obj = new CImageShape(null, null);
                break;
            case CLASS_TYPE_GROUP:
                obj = new CGroupShape(null, null);
                break;
            case CLASS_TYPE_CHART_AS_GROUP:
                obj = new CChartAsGroup(null, null);
                break;
            }
            if (isRealObject(obj)) {
                var drawingObject = drawingObjects.cloneDrawingObject(this.Drawings[i]);
                obj.readFromBinaryForCopyPaste2(stream, null, drawingObjects, null, null);
                drawingObject.graphicObject = obj;
                oNewWs.Drawings.push(drawingObject);
            }
        }
    }
};
Woorksheet.prototype.init = function () {
    this.workbook.cwf[this.Id] = {
        cells: {}
    };
    var formulaShared = {};
    for (var rowid in this.aGCells) {
        var row = this.aGCells[rowid];
        for (var cellid in row.c) {
            var oCell = row.c[cellid];
            var sCellId = oCell.oId.getID();
            if (null != oCell.oFormulaExt) {
                if (oCell.oFormulaExt.t == ECellFormulaType.cellformulatypeShared) {
                    if (null != oCell.oFormulaExt.si) {
                        if (null != oCell.oFormulaExt.ref) {
                            formulaShared[oCell.oFormulaExt.si] = {
                                fVal: new parserFormula(oCell.oFormulaExt.v, "", this),
                                fRef: function (t) {
                                    var r = t.getRange2(oCell.oFormulaExt.ref);
                                    return {
                                        c: r,
                                        first: r.first
                                    };
                                } (this)
                            };
                            formulaShared[oCell.oFormulaExt.si].fVal.parse();
                        } else {
                            if (formulaShared[oCell.oFormulaExt.si]) {
                                var fr = formulaShared[oCell.oFormulaExt.si].fRef;
                                if (fr.c.containCell(oCell.oId)) {
                                    if (formulaShared[oCell.oFormulaExt.si].fVal.isParsed) {
                                        var off = oCell.getOffset3(fr.first);
                                        formulaShared[oCell.oFormulaExt.si].fVal.changeOffset(off);
                                        oCell.oFormulaExt.v = formulaShared[oCell.oFormulaExt.si].fVal.assemble();
                                        off.offsetCol *= -1;
                                        off.offsetRow *= -1;
                                        formulaShared[oCell.oFormulaExt.si].fVal.changeOffset(off);
                                    }
                                    this.workbook.cwf[this.Id].cells[sCellId] = sCellId;
                                }
                            }
                        }
                    }
                }
                if (oCell.oFormulaExt.v) {
                    oCell.setFormula(oCell.oFormulaExt.v);
                }
                if (oCell.oFormulaExt.ca) {
                    oCell.sFormulaCA = true;
                }
                if (oCell.sFormula) {
                    this.workbook.cwf[this.Id].cells[sCellId] = sCellId;
                }
                if (oCell.sFormula && (oCell.oFormulaExt.ca || !oCell.oValue.getValueWithoutFormat())) {
                    this.workbook.needRecalc[getVertexId(this.Id, sCellId)] = [this.Id, sCellId];
                    this.workbook.needRecalc.length++;
                }
                delete oCell.oFormulaExt;
            }
        }
    }
};
Woorksheet.prototype.initPostOpen = function () {
    this.mergeManager.startRecalculate();
    this.hyperlinkManager.startRecalculate();
    if (null != this.Drawings) {
        var oThis = this;
        for (var i = this.Drawings.length - 1; i >= 0; --i) {
            var obj = this.Drawings[i];
            if (obj.graphicObject && obj.graphicObject.chart) {
                var chart = obj.graphicObject.chart;
                if (chart.range.interval) {
                    var oRefParsed = parserHelp.parse3DRef(chart.range.interval);
                    if (null !== oRefParsed) {
                        var ws = oThis.workbook.getWorksheetByName(oRefParsed.sheet);
                        if (ws) {
                            chart.range.intervalObject = ws.getRange2(oRefParsed.range);
                        }
                    }
                }
                if (null == chart.range.intervalObject) {
                    this.Drawings.splice(i, 1);
                }
            }
        }
    }
    if (!this.PagePrintOptions) {
        this.PagePrintOptions = new Asc.asc_CPageOptions();
    }
    if (null != this.PagePrintOptions) {
        var oPageMargins = this.PagePrintOptions.asc_getPageMargins();
        if (null == oPageMargins) {
            oPageMargins = new Asc.asc_CPageMargins();
            this.PagePrintOptions.asc_setPageMargins(oPageMargins);
        }
        if (null == oPageMargins.asc_getLeft()) {
            oPageMargins.asc_setLeft(c_oAscPrintDefaultSettings.PageLeftField);
        }
        if (null == oPageMargins.asc_getTop()) {
            oPageMargins.asc_setTop(c_oAscPrintDefaultSettings.PageTopField);
        }
        if (null == oPageMargins.asc_getRight()) {
            oPageMargins.asc_setRight(c_oAscPrintDefaultSettings.PageRightField);
        }
        if (null == oPageMargins.asc_getBottom()) {
            oPageMargins.asc_setBottom(c_oAscPrintDefaultSettings.PageBottomField);
        }
        var oPageSetup = this.PagePrintOptions.asc_getPageSetup();
        if (null == oPageSetup) {
            oPageSetup = new Asc.asc_CPageSetup();
            this.PagePrintOptions.asc_setPageSetup(oPageSetup);
        }
        if (null == oPageSetup.asc_getOrientation()) {
            oPageSetup.asc_setOrientation(c_oAscPrintDefaultSettings.PageOrientation);
        }
        if (null == oPageSetup.asc_getWidth()) {
            oPageSetup.asc_setWidth(c_oAscPrintDefaultSettings.PageWidth);
        }
        if (null == oPageSetup.asc_getHeight()) {
            oPageSetup.asc_setHeight(c_oAscPrintDefaultSettings.PageHeight);
        }
        if (null == this.PagePrintOptions.asc_getGridLines()) {
            this.PagePrintOptions.asc_setGridLines(c_oAscPrintDefaultSettings.PageGridLines);
        }
        if (null == this.PagePrintOptions.asc_getHeadings()) {
            this.PagePrintOptions.asc_setHeadings(c_oAscPrintDefaultSettings.PageHeadings);
        }
    }
    if (0 === this.sheetViews.length) {
        this.sheetViews[0] = new asc.asc_CSheetViewSettings();
    }
};
Woorksheet.prototype._forEachCell = function (fAction) {
    for (var rowInd in this.aGCells) {
        var row = this.aGCells[rowInd];
        if (row) {
            for (var cellInd in row.c) {
                var cell = row.c[cellInd];
                if (cell) {
                    fAction(cell);
                }
            }
        }
    }
};
Woorksheet.prototype.getNextRowId = function () {
    return this.nMaxRowId++;
};
Woorksheet.prototype.getNextColId = function () {
    return this.nMaxColId++;
};
Woorksheet.prototype.getId = function () {
    return this.Id;
};
Woorksheet.prototype.getIndex = function () {
    return this.index;
};
Woorksheet.prototype.getName = function () {
    return this.sName !== undefined && this.sName.length > 0 ? this.sName : "";
};
Woorksheet.prototype.setName = function (name) {
    if (name.length <= g_nSheetNameMaxLength) {
        var lastName = this.sName;
        this.sName = name;
        History.Create_NewPoint();
        History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Rename, this.getId(), null, new UndoRedoData_FromTo(lastName, name));
        for (var id in this.workbook.cwf) {
            this.workbook.getWorksheetById(id)._ReBuildFormulas(this.workbook.cwf[id].cells, lastName, this.sName);
        }
        if (this.Drawings) {
            for (var i = 0; i < this.Drawings.length; i++) {
                var drawingObject = this.Drawings[i];
                if (drawingObject.graphicObject && drawingObject.isChart()) {
                    var _lastName = !rx_test_ws_name.test(lastName) ? "'" + lastName + "'" : lastName;
                    if (drawingObject.graphicObject.chart.range.interval.indexOf(_lastName + "!") >= 0) {
                        drawingObject.graphicObject.chart.range.interval = drawingObject.graphicObject.chart.range.interval.replace(_lastName, !rx_test_ws_name.test(this.sName) ? "'" + this.sName + "'" : this.sName);
                        drawingObject.graphicObject.chart.rebuildSeries();
                    }
                }
            }
        }
    }
};
Woorksheet.prototype.renameWsToCollaborate = function (name) {
    var lastname = this.getName();
    var aFormulas = new Array();
    for (var i = 0, length = this.workbook.aCollaborativeActions.length; i < length; ++i) {
        var action = this.workbook.aCollaborativeActions[i];
        if (g_oUndoRedoWorkbook == action.oClass) {
            if (historyitem_Workbook_SheetAdd == action.nActionType) {
                if (lastname == action.oData.name) {
                    action.oData.name = name;
                }
            }
        } else {
            if (g_oUndoRedoWorksheet == action.oClass) {
                if (historyitem_Worksheet_Rename == action.nActionType) {
                    if (lastname == action.oData.to) {
                        action.oData.to = name;
                    }
                }
            } else {
                if (g_oUndoRedoCell == action.oClass) {
                    if (action.oData instanceof UndoRedoData_CellSimpleData) {
                        if (action.oData.oNewVal instanceof UndoRedoData_CellValueData) {
                            var oNewVal = action.oData.oNewVal;
                            if (null != oNewVal.formula && -1 != oNewVal.formula.indexOf(lastname)) {
                                var oParser = new parserFormula(oNewVal.formula, "A1", this);
                                oParser.parse();
                                aFormulas.push({
                                    formula: oParser,
                                    value: oNewVal
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    this.setName(name);
    for (var i = 0, length = aFormulas.length; i < length; ++i) {
        var item = aFormulas[i];
        item.value.formula = item.formula.assemble();
    }
};
Woorksheet.prototype.getHidden = function () {
    if (null != this.bHidden) {
        return false != this.bHidden;
    }
    return false;
};
Woorksheet.prototype.setHidden = function (hidden) {
    if (this.bHidden != hidden) {
        History.Create_NewPoint();
        History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Hide, this.getId(), null, new UndoRedoData_FromTo(this.bHidden, hidden));
    }
    this.bHidden = hidden;
    if (true == this.bHidden && this.getIndex() == this.workbook.getActive()) {
        var activeWorksheet = this.getIndex();
        var countWorksheets = this.workbook.getWorksheetCount();
        var i, ws;
        for (i = activeWorksheet + 1; i < countWorksheets; ++i) {
            ws = this.workbook.getWorksheet(i);
            if (false === ws.getHidden()) {
                this.workbook.handlers.trigger("undoRedoHideSheet", i);
                return;
            }
        }
        for (i = activeWorksheet - 1; i >= 0; --i) {
            ws = this.workbook.getWorksheet(i);
            if (false === ws.getHidden()) {
                this.workbook.handlers.trigger("undoRedoHideSheet", i);
                return;
            }
        }
    }
};
Woorksheet.prototype.getSheetViewSettings = function () {
    return this.sheetViews[0].clone();
};
Woorksheet.prototype.setSheetViewSettings = function (options) {
    var current = this.getSheetViewSettings();
    if (current.isEqual(options)) {
        return;
    }
    History.Create_NewPoint();
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_SetViewSettings, this.getId(), null, new UndoRedoData_FromTo(current, options.clone()));
    this.sheetViews[0].setSettings(options);
};
Woorksheet.prototype.getRowsCount = function () {
    return this.nRowsCount;
};
Woorksheet.prototype.removeRows = function (start, stop) {
    var oRange = this.getRange(new CellAddress(start, 0, 0), new CellAddress(stop, gc_nMaxCol0, 0));
    oRange.deleteCellsShiftUp();
};
Woorksheet.prototype._removeRows = function (start, stop) {
    lockDraw(this.workbook);
    History.Create_NewPoint();
    History.SetSelection(null, true);
    var nDif = -(stop - start + 1);
    var aIndexes = new Array();
    for (var i in this.aGCells) {
        var nIndex = i - 0;
        if (nIndex >= start) {
            aIndexes.push(nIndex);
        }
    }
    aIndexes.sort(fSortAscending);
    var oDefRowPr = new UndoRedoData_RowProp();
    for (var i = 0, length = aIndexes.length; i < length; ++i) {
        var nIndex = aIndexes[i];
        var row = this.aGCells[nIndex];
        if (nIndex > stop) {
            if (false == row.isEmpty()) {
                var oTargetRow = this._getRow(nIndex + nDif);
                oTargetRow.copyProperty(row);
            }
            for (var j in row.c) {
                this._moveCellVer(nIndex, j - 0, nDif);
            }
        } else {
            var oOldProps = row.getHeightProp();
            if (false == Asc.isEqual(oOldProps, oDefRowPr)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, nIndex, gc_nMaxCol0, nIndex), new UndoRedoData_IndexSimpleProp(nIndex, true, oOldProps, oDefRowPr));
            }
            row.setStyle(null);
            for (var j in row.c) {
                var nColIndex = j - 0;
                this._removeCell(nIndex, nColIndex);
            }
            delete this.aGCells[nIndex];
        }
    }
    var oActualRange = {
        r1: start,
        c1: 0,
        r2: stop,
        c2: gc_nMaxCol0
    };
    var res = this.renameDependencyNodes({
        offsetRow: nDif,
        offsetCol: 0
    },
    oActualRange);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveRows, this.getId(), new Asc.Range(0, start, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(true, start, stop));
    return true;
};
Woorksheet.prototype.insertRowsBefore = function (index, count) {
    var oRange = this.getRange(new CellAddress(index, 0, 0), new CellAddress(index + count - 1, gc_nMaxCol0, 0));
    oRange.addCellsShiftBottom();
};
Woorksheet.prototype._insertRowsBefore = function (index, count) {
    lockDraw(this.workbook);
    var oActualRange = {
        r1: index,
        c1: 0,
        r2: index + count - 1,
        c2: gc_nMaxCol0
    };
    History.Create_NewPoint();
    History.SetSelection(null, true);
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddRows, this.getId(), new Asc.Range(0, index, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(true, index, index + count - 1));
    History.TurnOff();
    var aIndexes = new Array();
    for (var i in this.aGCells) {
        var nIndex = i - 0;
        if (nIndex >= index) {
            aIndexes.push(nIndex);
        }
    }
    var oPrevRow = null;
    if (index > 0) {
        oPrevRow = this.aGCells[index - 1];
    }
    aIndexes.sort(fSortDescending);
    for (var i = 0, length = aIndexes.length; i < length; ++i) {
        var nIndex = aIndexes[i];
        var row = this.aGCells[nIndex];
        if (false == row.isEmpty()) {
            var oTargetRow = this._getRow(nIndex + count);
            oTargetRow.copyProperty(row);
        }
        for (var j in row.c) {
            this._moveCellVer(nIndex, j - 0, count);
        }
        delete this.aGCells[nIndex];
    }
    if (null != oPrevRow && false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges) {
        for (var i = 0; i < count; ++i) {
            var row = this._getRow(index + i);
            row.copyProperty(oPrevRow);
            row.hd = null;
        }
    }
    var res = this.renameDependencyNodes({
        offsetRow: count,
        offsetCol: 0
    },
    oActualRange);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    this.nRowsCount += count;
    History.TurnOn();
    return true;
};
Woorksheet.prototype.insertRowsAfter = function (index, count) {
    return this.insertRowsBefore(index + 1, count);
};
Woorksheet.prototype.getColsCount = function () {
    return this.nColsCount;
};
Woorksheet.prototype.removeCols = function (start, stop) {
    var oRange = this.getRange(new CellAddress(0, start, 0), new CellAddress(gc_nMaxRow0, stop, 0));
    oRange.deleteCellsShiftLeft();
};
Woorksheet.prototype._removeCols = function (start, stop) {
    lockDraw(this.workbook);
    History.Create_NewPoint();
    History.SetSelection(null, true);
    var nDif = -(stop - start + 1);
    for (var i in this.aGCells) {
        var nRowIndex = i - 0;
        var row = this.aGCells[i];
        var aIndexes = new Array();
        for (var j in row.c) {
            var nIndex = j - 0;
            if (nIndex >= start) {
                aIndexes.push(nIndex);
            }
        }
        aIndexes.sort(fSortAscending);
        for (var j = 0, length = aIndexes.length; j < length; ++j) {
            var nIndex = aIndexes[j];
            if (nIndex > stop) {
                this._moveCellHor(nRowIndex, nIndex, nDif, {
                    r1: 0,
                    c1: start,
                    r2: gc_nMaxRow0,
                    c2: stop
                });
            } else {
                this._removeCell(nRowIndex, nIndex);
            }
        }
    }
    var oActualRange = {
        r1: 0,
        c1: start,
        r2: gc_nMaxRow0,
        c2: stop
    };
    var res = this.renameDependencyNodes({
        offsetRow: 0,
        offsetCol: nDif
    },
    oActualRange);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    var oDefColPr = new UndoRedoData_ColProp();
    for (var i = start; i <= stop; ++i) {
        var col = this.aCols[i];
        if (null != col) {
            var oOldProps = col.getWidthProp();
            if (false == Asc.isEqual(oOldProps, oDefColPr)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(i, false, oOldProps, oDefColPr));
            }
            col.setStyle(null);
        }
    }
    this.aCols.splice(start, stop - start + 1);
    for (var i = start, length = this.aCols.length; i < length; ++i) {
        var elem = this.aCols[i];
        if (null != elem) {
            elem.moveHor(nDif);
        }
    }
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCols, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(false, start, stop));
    return true;
};
Woorksheet.prototype.insertColsBefore = function (index, count) {
    var oRange = this.getRange(new CellAddress(0, index, 0), new CellAddress(gc_nMaxRow0, index + count - 1, 0));
    oRange.addCellsShiftRight();
};
Woorksheet.prototype._insertColsBefore = function (index, count) {
    lockDraw(this.workbook);
    var oActualRange = {
        r1: 0,
        c1: index,
        r2: gc_nMaxRow0,
        c2: index + count - 1
    };
    History.Create_NewPoint();
    History.SetSelection(null, true);
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddCols, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(false, index, index + count - 1));
    History.TurnOff();
    for (var i in this.aGCells) {
        var nRowIndex = i - 0;
        var row = this.aGCells[i];
        var aIndexes = new Array();
        for (var j in row.c) {
            var nIndex = j - 0;
            if (nIndex >= index) {
                aIndexes.push(nIndex);
            }
        }
        aIndexes.sort(fSortDescending);
        for (var j = 0, length2 = aIndexes.length; j < length2; ++j) {
            var nIndex = aIndexes[j];
            this._moveCellHor(nRowIndex, nIndex, count, oActualRange);
        }
    }
    var res = this.renameDependencyNodes({
        offsetRow: 0,
        offsetCol: count
    },
    oActualRange);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    var oPrevCol = null;
    if (index > 0) {
        oPrevCol = this.aCols[index - 1];
    }
    if (null != this.oAllCol) {
        oPrevCol = this.oAllCol;
    }
    for (var i = 0; i < count; ++i) {
        var oNewCol = null;
        if (null != oPrevCol && false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges) {
            oNewCol = oPrevCol.clone();
            oNewCol.hd = null;
            oNewCol.BestFit = null;
            oNewCol.index = index + i;
        }
        this.aCols.splice(index, 0, oNewCol);
    }
    for (var i = index + count, length = this.aCols.length; i < length; ++i) {
        var elem = this.aCols[i];
        if (null != elem) {
            elem.moveHor(count);
        }
    }
    this.nColsCount += count;
    History.TurnOn();
    return true;
};
Woorksheet.prototype.insertColsAfter = function (index, count) {
    return this.insertColsBefore(index + 1, count);
};
Woorksheet.prototype.getDefaultWidth = function () {
    return this.dDefaultColWidth;
};
Woorksheet.prototype.getColWidth = function (index) {
    var col = this._getColNoEmptyWithAll(index);
    if (null != col && null != col.width) {
        return col.width;
    }
    var dResult = this.dDefaultColWidth;
    if (dResult === undefined || dResult === null || dResult == 0) {
        dResult = -1;
    }
    return dResult;
};
Woorksheet.prototype.setColWidth = function (width, start, stop) {
    if (0 == width) {
        return this.setColHidden(true, start, stop);
    }
    if (null == start) {
        return;
    }
    if (null == stop) {
        stop = start;
    }
    History.Create_NewPoint();
    History.SetSelection(null, true);
    var oThis = this;
    var fProcessCol = function (col) {
        if (col.width != width) {
            var oOldProps = col.getWidthProp();
            col.width = width;
            col.CustomWidth = true;
            col.BestFit = null;
            col.hd = null;
            var oNewProps = col.getWidthProp();
            if (false == oOldProps.isEqual(oNewProps)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
            }
        }
    };
    if (0 == start && gc_nMaxCol0 == stop) {
        var col = this.getAllCol();
        fProcessCol(col);
    } else {
        for (var i = start; i <= stop; i++) {
            var col = this._getCol(i);
            fProcessCol(col);
        }
    }
};
Woorksheet.prototype.setColHidden = function (bHidden, start, stop) {
    if (null == start) {
        return;
    }
    if (null == stop) {
        stop = start;
    }
    History.Create_NewPoint();
    History.SetSelection(null, true);
    var oThis = this;
    var fProcessCol = function (col) {
        if (col.hd != bHidden) {
            var oOldProps = col.getWidthProp();
            if (bHidden) {
                col.hd = bHidden;
                if (null == col.width || true != col.CustomWidth) {
                    col.width = 0;
                }
                col.CustomWidth = true;
                col.BestFit = null;
            } else {
                col.hd = null;
                if (0 == col.width) {
                    col.width = null;
                }
            }
            var oNewProps = col.getWidthProp();
            if (false == oOldProps.isEqual(oNewProps)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
            }
        }
    };
    if (0 != start && gc_nMaxCol0 == stop) {
        var col = null;
        if (false == bHidden) {
            col = this.oAllCol;
        } else {
            col = this.getAllCol();
        }
        if (null != col) {
            fProcessCol(col);
        }
    } else {
        for (var i = start; i <= stop; i++) {
            var col = null;
            if (false == bHidden) {
                col = this._getColNoEmpty(i);
            } else {
                col = this._getCol(i);
            }
            if (null != col) {
                fProcessCol(col);
            }
        }
    }
};
Woorksheet.prototype.setColBestFit = function (bBestFit, width, start, stop) {
    if (null == start) {
        return;
    }
    if (null == stop) {
        stop = start;
    }
    History.Create_NewPoint();
    History.SetSelection(null, true);
    var oThis = this;
    var fProcessCol = function (col) {
        var oOldProps = col.getWidthProp();
        if (bBestFit) {
            col.BestFit = bBestFit;
            col.hd = null;
        } else {
            col.BestFit = null;
        }
        col.width = width;
        var oNewProps = col.getWidthProp();
        if (false == oOldProps.isEqual(oNewProps)) {
            History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
        }
    };
    if (0 != start && gc_nMaxCol0 == stop) {
        var col = null;
        if (bBestFit && gc_dDefaultColWidthCharsAttribute == width) {
            col = this.oAllCol;
        } else {
            col = this.getAllCol();
        }
        if (null != col) {
            fProcessCol(col);
        }
    } else {
        for (var i = start; i <= stop; i++) {
            var col = null;
            if (bBestFit && gc_dDefaultColWidthCharsAttribute == width) {
                col = this._getColNoEmpty(i);
            } else {
                col = this._getCol(i);
            }
            if (null != col) {
                fProcessCol(col);
            }
        }
    }
};
Woorksheet.prototype.getDefaultHeight = function () {
    return this.dDefaultheight;
};
Woorksheet.prototype.getRowHeight = function (index) {
    var row = this.aGCells[index];
    if (null != row && null != row.h) {
        return row.h;
    } else {
        return -1;
    }
};
Woorksheet.prototype.setRowHeight = function (height, start, stop) {
    if (0 == height) {
        return this.setRowHidden(true, start, stop);
    }
    if (null == start) {
        return;
    }
    if (null == stop) {
        stop = start;
    }
    History.Create_NewPoint();
    History.SetSelection(null, true);
    for (var i = start; i <= stop; i++) {
        var oCurRow = this._getRow(i);
        if (oCurRow.h != height) {
            var oOldProps = oCurRow.getHeightProp();
            oCurRow.h = height;
            oCurRow.CustomHeight = true;
            oCurRow.hd = null;
            var oNewProps = oCurRow.getHeightProp();
            if (false == Asc.isEqual(oOldProps, oNewProps)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
            }
        }
    }
};
Woorksheet.prototype.setRowHidden = function (bHidden, start, stop) {
    if (null == start) {
        return;
    }
    if (null == stop) {
        stop = start;
    }
    History.Create_NewPoint();
    History.SetSelection(null, true);
    for (var i = start; i <= stop; i++) {
        var oCurRow = null;
        if (false == bHidden) {
            oCurRow = this._getRowNoEmpty(i);
        } else {
            oCurRow = this._getRow(i);
        }
        if (null != oCurRow && oCurRow.hd != bHidden) {
            var oOldProps = oCurRow.getHeightProp();
            if (bHidden) {
                oCurRow.hd = bHidden;
            } else {
                oCurRow.hd = null;
            }
            var oNewProps = oCurRow.getHeightProp();
            if (false == Asc.isEqual(oOldProps, oNewProps)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
            }
        }
    }
};
Woorksheet.prototype.setRowBestFit = function (bBestFit, height, start, stop) {
    if (null == start) {
        return;
    }
    if (null == stop) {
        stop = start;
    }
    History.Create_NewPoint();
    History.SetSelection(null, true);
    for (var i = start; i <= stop; i++) {
        var oCurRow = null;
        if (true == bBestFit && gc_dDefaultRowHeightAttribute == height) {
            oCurRow = this._getRowNoEmpty(i);
        } else {
            oCurRow = this._getRow(i);
        }
        if (null != oCurRow) {
            var oOldProps = oCurRow.getHeightProp();
            if (true == bBestFit) {
                oCurRow.CustomHeight = null;
            } else {
                oCurRow.CustomHeight = true;
            }
            oCurRow.height = height;
            var oNewProps = oCurRow.getHeightProp();
            if (false == oOldProps.isEqual(oNewProps)) {
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
            }
        }
    }
};
Woorksheet.prototype.getCell = function (oCellAdd) {
    return this.getRange(oCellAdd, oCellAdd);
};
Woorksheet.prototype.getCell2 = function (sCellAdd) {
    if (sCellAdd.indexOf("$") > -1) {
        sCellAdd = sCellAdd.replace(/\$/g, "");
    }
    return this.getRange2(sCellAdd);
};
Woorksheet.prototype.getCell3 = function (r1, c1) {
    return this.getRange3(r1, c1, r1, c1);
};
Woorksheet.prototype.getRange = function (cellAdd1, cellAdd2) {
    var nRow1 = cellAdd1.getRow0();
    var nCol1 = cellAdd1.getCol0();
    var nRow2 = cellAdd2.getRow0();
    var nCol2 = cellAdd2.getCol0();
    return this.getRange3(nRow1, nCol1, nRow2, nCol2);
};
Woorksheet.prototype.getRange2 = function (sRange) {
    if (sRange.indexOf("$") > -1) {
        sRange = sRange.replace(/\$/g, "");
    }
    var nIndex = sRange.indexOf(":");
    if (-1 != nIndex) {
        var sFirstCell = sRange.substring(0, nIndex);
        var sLastCell = sRange.substring(nIndex + 1);
        var oFirstAddr, oLastAddr;
        if (sFirstCell == sLastCell) {
            if (!sFirstCell.match(/[^a-z]/ig)) {
                oFirstAddr = new CellAddress(sFirstCell + "1");
                oLastAddr = new CellAddress(sLastCell + (gc_nMaxRow + ""));
            } else {
                if (!sFirstCell.match(/[^0-9]/)) {
                    oFirstAddr = new CellAddress("A" + sFirstCell);
                    oLastAddr = new CellAddress(g_oCellAddressUtils.colnumToColstr(gc_nMaxCol) + sLastCell);
                } else {
                    oFirstAddr = new CellAddress(sFirstCell);
                    oLastAddr = new CellAddress(sLastCell);
                }
            }
        } else {
            oFirstAddr = new CellAddress(sFirstCell);
            oLastAddr = new CellAddress(sLastCell);
        }
        if (oFirstAddr.isValid() && oLastAddr.isValid()) {
            if ((gc_nMaxCol == oFirstAddr.getCol() || gc_nMaxRow == oFirstAddr.getRow()) && oFirstAddr.id != sRange.toUpperCase()) {
                if (gc_nMaxRow == oFirstAddr.getRow()) {
                    return this.getRange(new CellAddress(1, oFirstAddr.getCol()), new CellAddress(gc_nMaxRow, oLastAddr.getCol()));
                } else {
                    return this.getRange(new CellAddress(oFirstAddr.getRow(), 1), new CellAddress(oLastAddr.getRow(), gc_nMaxCol));
                }
            } else {
                return this.getRange(oFirstAddr, oLastAddr);
            }
        }
        return null;
    } else {
        var oCellAddr = new CellAddress(sRange);
        if (oCellAddr.isValid()) {
            if ((gc_nMaxCol == oCellAddr.getCol() || gc_nMaxRow == oCellAddr.getRow()) && oCellAddr.id != sRange.toUpperCase()) {
                if (gc_nMaxRow == oCellAddr.getRow()) {
                    return this.getRange(new CellAddress(1, oCellAddr.getCol()), new CellAddress(gc_nMaxRow, oCellAddr.getCol()));
                } else {
                    return this.getRange(new CellAddress(oCellAddr.getRow(), 1), new CellAddress(oCellAddr.getRow(), gc_nMaxCol));
                }
            } else {
                return this.getRange(oCellAddr, oCellAddr);
            }
        }
    }
    return null;
};
Woorksheet.prototype.getRange3 = function (r1, c1, r2, c2) {
    var nRowMin = r1;
    var nRowMax = r2;
    var nColMin = c1;
    var nColMax = c2;
    if (r1 > r2) {
        nRowMax = r1;
        nRowMin = r2;
    }
    if (c1 > c2) {
        nColMax = c1;
        nColMin = c2;
    }
    return new Range(this, nRowMin, nColMin, nRowMax, nColMax);
};
Woorksheet.prototype._getRows = function () {
    return this.aGCells;
};
Woorksheet.prototype._getCols = function () {
    return this.aCols;
};
Woorksheet.prototype._removeCell = function (nRow, nCol, cell) {
    if (null != cell) {
        nRow = cell.oId.getRow0();
        nCol = cell.oId.getCol0();
    }
    var row = this.aGCells[nRow];
    if (null != row) {
        var cell = row.c[nCol];
        if (null != cell) {
            if (false == cell.isEmpty()) {
                var oUndoRedoData_CellData = new UndoRedoData_CellData(cell.getValueData(), null);
                if (null != cell.xfs) {
                    oUndoRedoData_CellData.style = cell.xfs.clone();
                }
                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, nRow, gc_nMaxCol0, nRow), new UndoRedoData_CellSimpleData(nRow, nCol, oUndoRedoData_CellData, null));
            }
            this.helperRebuildFormulas(cell, cell.getName(), cell.getName());
            var node = this.workbook.dependencyFormulas.getNode2(this.Id, cell.getName());
            if (node) {
                for (var i = 0; i < node.length; i++) {
                    var n = node[i].getSlaveEdges();
                    if (n) {
                        for (var id in n) {
                            if (n[id].cell && n[id].cell.sFormula) {
                                History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCellFormula, n[id].sheetId, new Asc.Range(n[id].cell.oId.getCol0(), n[id].cell.oId.getRow0(), n[id].cell.oId.getCol0(), n[id].cell.oId.getRow0()), new UndoRedoData_CellSimpleData(n[id].cell.oId.getRow0(), n[id].cell.oId.getCol0(), null, null, n[id].cell.sFormula));
                            }
                        }
                    }
                }
            }
            if (!arrRecalc[this.getId()]) {
                arrRecalc[this.getId()] = {};
            }
            arrRecalc[this.getId()][cell.getName()] = cell.getName();
            if (this.workbook.dependencyFormulas.getNode(this.getId(), this.getName()) && !this.workbook.needRecalc[getVertexId(this.getId(), cell.getName())]) {
                this.workbook.needRecalc[getVertexId(this.getId(), cell.getName())] = [this.getId(), cell.getName()];
                if (this.workbook.needRecalc.length < 0) {
                    this.workbook.needRecalc.length = 0;
                }
                this.workbook.needRecalc.length++;
            }
            delete row.c[nCol];
            if (row.isEmpty()) {
                delete this.aGCells[nRow];
            }
        }
    }
};
Woorksheet.prototype._getCell = function (row, col) {
    var oCurRow = this._getRow(row);
    var oCurCell = oCurRow.c[col];
    if (null == oCurCell) {
        oCurCell = new Cell(this);
        var oRow = this._getRowNoEmpty(row);
        var oCol = this._getColNoEmptyWithAll(col);
        var xfs = null;
        if (null != oRow && null != oRow.xfs) {
            xfs = oRow.xfs.clone();
        } else {
            if (null != oCol && null != oCol.xfs) {
                xfs = oCol.xfs.clone();
            }
        }
        oCurCell.create(xfs, new CellAddress(row, col, 0));
        oCurRow.c[col] = oCurCell;
        if (row + 1 > this.nRowsCount) {
            this.nRowsCount = row + 1;
        }
        if (col + 1 > this.nColsCount) {
            this.nColsCount = col + 1;
        }
    }
    return oCurCell;
};
Woorksheet.prototype._getCell2 = function (cellId) {
    var oCellAddress = new CellAddress(cellId);
    return this._getCell(oCellAddress.getRow0(), oCellAddress.getCow0());
};
Woorksheet.prototype._getCellNoEmpty = function (row, col) {
    var oCurCell;
    var oCurRow = this.aGCells[row];
    if (oCurRow) {
        var cell = oCurRow.c[col];
        return cell ? cell : null;
    }
    return null;
};
Woorksheet.prototype._getRowNoEmpty = function (row) {
    var oCurRow = this.aGCells[row];
    if (oCurRow) {
        return oCurRow;
    }
    return null;
};
Woorksheet.prototype._getColNoEmpty = function (col) {
    var oCurCol = this.aCols[col];
    if (oCurCol) {
        return oCurCol;
    }
    return null;
};
Woorksheet.prototype._getColNoEmptyWithAll = function (col) {
    var oRes = this._getColNoEmpty(col);
    if (null == oRes) {
        oRes = this.oAllCol;
    }
    return oRes;
};
Woorksheet.prototype._getRow = function (row) {
    var oCurRow = this.aGCells[row];
    if (!oCurRow) {
        oCurRow = new Row(this);
        oCurRow.create(row + 1);
        if (null != this.oAllCol && null != this.oAllCol.xfs) {
            oCurRow.xfs = this.oAllCol.xfs.clone();
        }
        this.aGCells[row] = oCurRow;
        this.nRowsCount = row > this.nRowsCount ? row : this.nRowsCount;
    }
    return oCurRow;
};
Woorksheet.prototype._removeRow = function (index) {
    delete this.aGCells[index];
};
Woorksheet.prototype._getCol = function (index) {
    var oCurCol;
    if (-1 == index) {
        oCurCol = this.getAllCol();
    } else {
        oCurCol = this.aCols[index];
        if (null == oCurCol) {
            if (null != this.oAllCol) {
                oCurCol = this.oAllCol.clone();
                oCurCol.index = index;
            } else {
                oCurCol = new Col(this, index);
            }
            this.aCols[index] = oCurCol;
            this.nColsCount = index > this.nColsCount ? index : this.nColsCount;
        }
    }
    return oCurCol;
};
Woorksheet.prototype._removeCol = function (index) {
    delete this.aCols[index];
};
Woorksheet.prototype._moveCellHor = function (nRow, nCol, dif) {
    var cell = this._getCellNoEmpty(nRow, nCol);
    if (cell) {
        var lastName = cell.getName();
        cell.moveHor(dif);
        var newName = cell.getName();
        var row = this._getRow(nRow);
        row.c[nCol + dif] = cell;
        delete row.c[nCol];
        if (arrRecalc[this.Id] && arrRecalc[this.Id][lastName]) {
            arrRecalc[this.Id][lastName] = null;
            delete arrRecalc[this.Id][lastName];
            arrRecalc[this.Id][cell.getName()] = cell.getName();
            this.workbook.needRecalc[getVertexId(this.Id, lastName)] = null;
            delete this.workbook.needRecalc[getVertexId(this.Id, lastName)];
            this.workbook.needRecalc[getVertexId(this.Id, cell.getName())] = [this.Id, cell.getName()];
        }
        this.helperRebuildFormulas(cell, lastName, cell.getName());
    }
};
Woorksheet.prototype._moveCellVer = function (nRow, nCol, dif) {
    var cell = this._getCellNoEmpty(nRow, nCol);
    if (cell) {
        var lastName = cell.getName();
        cell.moveVer(dif);
        var oCurRow = this._getRow(nRow);
        var oTargetRow = this._getRow(nRow + dif);
        delete oCurRow.c[nCol];
        oTargetRow.c[nCol] = cell;
        if (oCurRow.isEmpty()) {
            delete this.aGCells[nRow];
        }
        if (arrRecalc[this.Id] && arrRecalc[this.Id][lastName]) {
            arrRecalc[this.Id][lastName] = null;
            delete arrRecalc[this.Id][lastName];
            arrRecalc[this.Id][cell.getName()] = cell.getName();
            this.workbook.needRecalc[getVertexId(this.Id, lastName)] = null;
            delete this.workbook.needRecalc[getVertexId(this.Id, lastName)];
            this.workbook.needRecalc[getVertexId(this.Id, cell.getName())] = [this.Id, cell.getName()];
        }
        this.helperRebuildFormulas(cell, lastName, cell.getName());
    }
};
Woorksheet.prototype._prepareMoveRangeGetCleanRanges = function (oBBoxFrom, oBBoxTo) {
    var intersection = oBBoxFrom.intersectionSimple(oBBoxTo);
    var aRangesToCheck = [];
    if (null != intersection) {
        var oThis = this;
        var fAddToRangesToCheck = function (aRangesToCheck, r1, c1, r2, c2) {
            if (r1 <= r2 && c1 <= c2) {
                aRangesToCheck.push(oThis.getRange3(r1, c1, r2, c2));
            }
        };
        if (intersection.r1 == oBBoxTo.r1 && intersection.c1 == oBBoxTo.c1) {
            fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, intersection.c2 + 1, intersection.r2, oBBoxTo.c2);
            fAddToRangesToCheck(aRangesToCheck, intersection.r2 + 1, oBBoxTo.c1, oBBoxTo.r2, oBBoxTo.c2);
        } else {
            if (intersection.r2 == oBBoxTo.r2 && intersection.c1 == oBBoxTo.c1) {
                fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, oBBoxTo.c1, intersection.r1 - 1, oBBoxTo.c2);
                fAddToRangesToCheck(aRangesToCheck, intersection.r1, intersection.c2 + 1, oBBoxTo.r2, oBBoxTo.c2);
            } else {
                if (intersection.r1 == oBBoxTo.r1 && intersection.c2 == oBBoxTo.c2) {
                    fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, oBBoxTo.c1, intersection.r2, intersection.c1 - 1);
                    fAddToRangesToCheck(aRangesToCheck, intersection.r2 + 1, oBBoxTo.c1, oBBoxTo.r2, oBBoxTo.c2);
                } else {
                    if (intersection.r2 == oBBoxTo.r2 && intersection.c2 == oBBoxTo.c2) {
                        fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, oBBoxTo.c1, intersection.r1 - 1, oBBoxTo.c2);
                        fAddToRangesToCheck(aRangesToCheck, intersection.r1, oBBoxTo.c1, oBBoxTo.r2, intersection.c1 - 1);
                    }
                }
            }
        }
    } else {
        aRangesToCheck.push(this.getRange3(oBBoxTo.r1, oBBoxTo.c1, oBBoxTo.r2, oBBoxTo.c2));
    }
    return aRangesToCheck;
};
Woorksheet.prototype._prepareMoveRange = function (oBBoxFrom, oBBoxTo) {
    var res = 0;
    if (oBBoxFrom.isEqual(oBBoxTo)) {
        return res;
    }
    var aRangesToCheck = this._prepareMoveRangeGetCleanRanges(oBBoxFrom, oBBoxTo);
    for (var i = 0, length = aRangesToCheck.length; i < length; i++) {
        var range = aRangesToCheck[i];
        var aMerged = this.mergeManager.get(range.getBBox0());
        if (aMerged.outer.length > 0) {
            return -2;
        }
        range._foreachNoEmpty(function (cell) {
            if (!cell.isEmptyTextString()) {
                res = -1;
                return res;
            }
        });
        if (0 != res) {
            return res;
        }
    }
    return res;
};
Woorksheet.prototype._moveRecalcGraph = function (oBBoxFrom, offset) {
    var move = this.workbook.dependencyFormulas.helper(oBBoxFrom, this.Id),
    rec = {
        length: 0
    };
    for (var id in move.recalc) {
        var n = move.recalc[id];
        var _sn = n.getSlaveEdges2();
        for (var _id in _sn) {
            rec[_sn[_id].nodeId] = [_sn[_id].sheetId, _sn[_id].cellId];
            rec.length++;
        }
    }
    for (var id in move.move) {
        var n = move.move[id];
        var _sn = n.getSlaveEdges2();
        for (var _id in _sn) {
            var cell = _sn[_id].returnCell();
            if (undefined == cell || null == cell) {
                continue;
            }
            if (cell.formulaParsed) {
                cell.formulaParsed.shiftCells(offset, oBBoxFrom, n, this.Id, false);
                cell.setFormula(cell.formulaParsed.assemble());
                rec[cell.getName()] = [cell.ws.getId(), cell.getName()];
                rec.length++;
            }
        }
    }
    return rec;
};
Woorksheet.prototype._moveRange = function (oBBoxFrom, oBBoxTo) {
    if (oBBoxFrom.isEqual(oBBoxTo)) {
        return;
    }
    var oThis = this;
    History.Create_NewPoint();
    History.SetSelection(new Asc.Range(oBBoxFrom.c1, oBBoxFrom.r1, oBBoxFrom.c2, oBBoxFrom.r2));
    History.SetSelectionRedo(new Asc.Range(oBBoxTo.c1, oBBoxTo.r1, oBBoxTo.c2, oBBoxTo.r2));
    History.StartTransaction();
    var offset = {
        offsetRow: oBBoxTo.r1 - oBBoxFrom.r1,
        offsetCol: oBBoxTo.c1 - oBBoxFrom.c1
    };
    var aTempObj = {
        cells: {},
        merged: null,
        hyperlinks: null
    };
    for (var i = oBBoxFrom.r1; i <= oBBoxFrom.r2; i++) {
        var row = this._getRowNoEmpty(i);
        if (null != row) {
            var oTempRow = {};
            aTempObj.cells[i + offset.offsetRow] = oTempRow;
            for (var j = oBBoxFrom.c1; j <= oBBoxFrom.c2; j++) {
                var cell = row.c[j];
                if (null != cell) {
                    oTempRow[j + offset.offsetCol] = cell;
                }
            }
        }
    }
    if (false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges) {
        var aMerged = this.mergeManager.get(oBBoxFrom);
        if (aMerged.inner.length > 0) {
            aTempObj.merged = aMerged.inner;
            for (var i = 0, length = aTempObj.merged.length; i < length; i++) {
                var elem = aTempObj.merged[i];
                this.mergeManager.remove(elem.bbox, elem);
            }
        }
        var aHyperlinks = this.hyperlinkManager.get(oBBoxFrom);
        if (aHyperlinks.inner.length > 0) {
            aTempObj.hyperlinks = aHyperlinks.inner;
            for (var i = 0, length = aTempObj.hyperlinks.length; i < length; i++) {
                var elem = aTempObj.hyperlinks[i];
                this.hyperlinkManager.remove(elem.bbox, elem);
            }
        }
    }
    var aRangesToCheck = this._prepareMoveRangeGetCleanRanges(oBBoxFrom, oBBoxTo);
    for (var i = 0, length = aRangesToCheck.length; i < length; i++) {
        aRangesToCheck[i].cleanAll();
    }
    History.TurnOff();
    var oRangeFrom = this.getRange3(oBBoxFrom.r1, oBBoxFrom.c1, oBBoxFrom.r2, oBBoxFrom.c2);
    oRangeFrom._setPropertyNoEmpty(null, null, function (cell, nRow0, nCol0, nRowStart, nColStart) {
        var row = oThis._getRowNoEmpty(nRow0);
        if (null != row) {
            delete row.c[nCol0];
        }
    });
    var rec = this._moveRecalcGraph(oBBoxFrom, offset);
    for (var i in aTempObj.cells) {
        var oTempRow = aTempObj.cells[i];
        var row = this._getRow(i - 0);
        for (var j in oTempRow) {
            var oTempCell = oTempRow[j];
            if (null != oTempCell) {
                oTempCell.moveHor(offset.offsetCol);
                oTempCell.moveVer(offset.offsetRow);
                row.c[j] = oTempCell;
                if (oTempCell.sFormula) {
                    this.workbook.cwf[this.Id].cells[oTempCell.getName()] = oTempCell.getName();
                    rec[oTempCell.getName()] = [this.Id, oTempCell.getName()];
                    rec.length++;
                }
            }
        }
    }
    var move = this.workbook.dependencyFormulas.helper(oBBoxTo, this.Id);
    for (var id in move.recalc) {
        var n = move.recalc[id];
        var _sn = n.getSlaveEdges2();
        for (var _id in _sn) {
            rec[_sn[_id].nodeId] = [_sn[_id].sheetId, _sn[_id].cellId];
            rec.length++;
        }
    }
    this.workbook.buildDependency();
    this.workbook.needRecalc = rec;
    recalc(this.workbook);
    History.TurnOn();
    if (false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges) {
        if (null != aTempObj.merged) {
            for (var i = 0, length = aTempObj.merged.length; i < length; i++) {
                var elem = aTempObj.merged[i];
                elem.bbox.setOffset(offset);
                this.mergeManager.add(elem.bbox, elem.data);
            }
        }
        if (null != aTempObj.hyperlinks) {
            for (var i = 0, length = aTempObj.hyperlinks.length; i < length; i++) {
                var elem = aTempObj.hyperlinks[i];
                elem.bbox.setOffset(offset);
                this.hyperlinkManager.add(elem.bbox, elem.data);
            }
        }
    }
    if (oBBoxFrom.r2 > this.nRowsCount) {
        this.nRowsCount = oBBoxFrom.r2 + 1;
    }
    if (oBBoxFrom.c2 > this.nColsCount) {
        this.nColsCount = oBBoxFrom.c2 + 1;
    }
    if (oBBoxTo.r2 > this.nRowsCount) {
        this.nRowsCount = oBBoxTo.r2 + 1;
    }
    if (oBBoxTo.c2 > this.nColsCount) {
        this.nColsCount = oBBoxTo.c2 + 1;
    }
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_MoveRange, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromTo(new UndoRedoData_BBox(oBBoxFrom), new UndoRedoData_BBox(oBBoxTo)));
    History.EndTransaction();
    return true;
};
Woorksheet.prototype._shiftCellsLeft = function (oBBox) {
    lockDraw(this.workbook);
    var nLeft = oBBox.c1;
    var nRight = oBBox.c2;
    var dif = nLeft - nRight - 1;
    for (var i = oBBox.r1; i <= oBBox.r2; i++) {
        var row = this.aGCells[i];
        if (row) {
            var aIndexes = new Array();
            for (var cellInd in row.c) {
                var nIndex = cellInd - 0;
                if (nIndex >= nLeft) {
                    aIndexes.push(nIndex);
                }
            }
            aIndexes.sort(fSortAscending);
            for (var j = 0, length2 = aIndexes.length; j < length2; ++j) {
                var nCellInd = aIndexes[j];
                if (nCellInd <= nRight) {
                    this._removeCell(i, nCellInd);
                } else {
                    this._moveCellHor(i, nCellInd, dif, oBBox);
                }
            }
        }
    }
    var res = this.renameDependencyNodes({
        offsetRow: 0,
        offsetCol: dif
    },
    oBBox);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsLeft, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, oBBox.r1), new UndoRedoData_BBox(oBBox));
};
Woorksheet.prototype._shiftCellsUp = function (oBBox) {
    lockDraw(this.workbook);
    var nTop = oBBox.r1;
    var nBottom = oBBox.r2;
    var dif = nTop - nBottom - 1;
    var aIndexes = new Array();
    for (var i in this.aGCells) {
        var rowInd = i - 0;
        if (rowInd >= nTop) {
            aIndexes.push(rowInd);
        }
    }
    aIndexes.sort(fSortAscending);
    for (var i = 0, length = aIndexes.length; i < length; ++i) {
        var rowInd = aIndexes[i];
        var row = this.aGCells[rowInd];
        if (row) {
            if (rowInd <= nBottom) {
                for (var j = oBBox.c1; j <= oBBox.c2; j++) {
                    this._removeCell(rowInd, j);
                }
            } else {
                var nIndex = rowInd + dif;
                var rowTop = this._getRow(nIndex);
                for (var j = oBBox.c1; j <= oBBox.c2; j++) {
                    this._moveCellVer(rowInd, j, dif);
                }
            }
        }
    }
    var res = this.renameDependencyNodes({
        offsetRow: dif,
        offsetCol: 0
    },
    oBBox);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsTop, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_BBox(oBBox));
};
Woorksheet.prototype._shiftCellsRight = function (oBBox) {
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsRight, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, oBBox.r1), new UndoRedoData_BBox(oBBox));
    History.TurnOff();
    var nLeft = oBBox.c1;
    var nRight = oBBox.c2;
    var dif = nRight - nLeft + 1;
    for (var i = oBBox.r1; i <= oBBox.r2; i++) {
        var row = this.aGCells[i];
        if (row) {
            var aIndexes = new Array();
            for (var cellInd in row.c) {
                var nIndex = cellInd - 0;
                if (nIndex >= nLeft) {
                    aIndexes.push(nIndex);
                }
            }
            aIndexes.sort(fSortDescending);
            for (var j = 0, length2 = aIndexes.length; j < length2; ++j) {
                var nCellInd = aIndexes[j];
                var cell = row.c[nCellInd];
                if (cell) {
                    if (nCellInd + dif > this.nColsCount) {
                        this.nColsCount = nCellInd + dif;
                    }
                    this._moveCellHor(i, nCellInd, dif, oBBox);
                }
            }
        }
    }
    var res = this.renameDependencyNodes({
        offsetRow: 0,
        offsetCol: dif
    },
    oBBox);
    History.TurnOn();
};
Woorksheet.prototype._shiftCellsBottom = function (oBBox) {
    lockDraw(this.workbook);
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsBottom, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_BBox(oBBox));
    History.TurnOff();
    var nTop = oBBox.r1;
    var nBottom = oBBox.r2;
    var dif = nBottom - nTop + 1;
    var aIndexes = new Array();
    for (var i in this.aGCells) {
        var rowInd = i - 0;
        if (rowInd >= nTop) {
            aIndexes.push(rowInd);
        }
    }
    aIndexes.sort(fSortDescending);
    for (var i = 0, length = aIndexes.length; i < length; ++i) {
        rowInd = aIndexes[i];
        var row = this.aGCells[rowInd];
        if (row) {
            var nIndex = rowInd + dif;
            if (nIndex + dif > this.nRowsCount) {
                this.nRowsCount = nIndex + dif;
            }
            var rowTop = this._getRow(nIndex);
            for (var j = oBBox.c1; j <= oBBox.c2; j++) {
                this._moveCellVer(rowInd, j, dif);
            }
        }
    }
    var res = this.renameDependencyNodes({
        offsetRow: dif,
        offsetCol: 0
    },
    oBBox);
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    History.TurnOn();
};
Woorksheet.prototype._setIndex = function (ind) {
    this.index = ind;
};
Woorksheet.prototype._BuildDependencies = function (cellRange) {
    var c, ca;
    for (var i in cellRange) {
        ca = new CellAddress(i);
        c = this._getCellNoEmpty(ca.getRow0(), ca.getCol0());
        if (c && c.sFormula) {
            c.formulaParsed = new parserFormula(c.sFormula, c.oId.getID(), this);
            c.formulaParsed.parse();
            c.formulaParsed.buildDependencies();
        }
    }
};
Woorksheet.prototype._RecalculatedFunctions = function (cell, bad) {
    var thas = this;
    function adjustCellFormat(c, ftext) {
        var match = (/[^a-z0-9:]([a-z]+\d+:[a-z]+\d+|[a-z]+:[a-z]+|\d+:\d+|[a-z]+\d+)/i).exec("=" + ftext);
        if (!match) {
            return;
        }
        var m = match[1].split(":")[0];
        if (m.search(/^[a-z]+$/i) >= 0) {
            m = m + "1";
        } else {
            if (m.search(/^\d+$/) >= 0) {
                m = "A" + m;
            }
        }
        var ca = new CellAddress(m);
        if (g_oDefaultNum.f == c.getNumFormatStr()) {
            c.setNumFormat(thas.getCell(ca).getNumFormatStr());
        }
    }
    if (cell.indexOf(":") > -1) {
        return;
    }
    var celladd = this.getRange2(cell).getFirst(),
    __cell = this._getCellNoEmpty(celladd.getRow0(), celladd.getCol0()),
    res;
    if (!__cell || !__cell.sFormula) {
        return;
    }
    if (!bad) {
        res = __cell.formulaParsed.calculate();
    } else {
        res = new cError(cErrorType.bad_reference);
    }
    if (res) {
        if (res.type == cElementType.cell) {
            var nF = res.numFormat;
            res = res.getValue();
            res.numFormat = nF;
        } else {
            if (res.type == cElementType.array) {
                var nF = res.numFormat;
                res = res.getElement(0);
                res.numFormat = nF;
            } else {
                if (res.type == cElementType.cellsRange) {
                    var nF = res.numFormat;
                    res = res.cross(new CellAddress(cell));
                    res.numFormat = nF;
                }
            }
        }
        __cell.oValue.clean();
        switch (res.type) {
        case cElementType.number:
            __cell.oValue.type = CellValueType.Number;
            __cell.oValue.number = res.getValue();
            break;
        case cElementType.bool:
            __cell.oValue.type = CellValueType.Bool;
            __cell.oValue.number = res.value ? 1 : 0;
            break;
        case cElementType.error:
            __cell.oValue.type = CellValueType.Error;
            __cell.oValue.text = res.getValue().toString();
            break;
        case cElementType.name:
            __cell.oValue.type = CellValueType.Error;
            __cell.oValue.text = res.getValue().toString();
            break;
        default:
            __cell.oValue.type = CellValueType.String;
            __cell.oValue.text = res.getValue().toString();
        }
        __cell.setFormulaCA(res.ca);
        if (res.numFormat !== undefined && res.numFormat >= 0) {
            if (aStandartNumFormatsId[__cell.getNumFormatStr()] == 0) {
                __cell.setNumFormat(aStandartNumFormats[res.numFormat]);
            }
        } else {
            if (res.numFormat !== undefined && res.numFormat == -1) {
                adjustCellFormat(__cell, __cell.sFormula);
            }
        }
    }
};
Woorksheet.prototype._ReBuildFormulas = function (cellRange) {
    var c, ca;
    for (var i in cellRange) {
        ca = new CellAddress(i);
        c = this._getCellNoEmpty(ca.getRow0(), ca.getCol0());
        if (c && c.formulaParsed && c.formulaParsed.is3D) {
            c.setFormula(c.formulaParsed.assemble());
        }
    }
};
Woorksheet.prototype.renameDependencyNodes = function (offset, oBBox, rec, noDelete) {
    var objForRebuldFormula = this.workbook.dependencyFormulas.checkOffset(oBBox, offset, this.Id, noDelete);
    var c = {};
    for (var id in objForRebuldFormula.move) {
        var n = objForRebuldFormula.move[id].node;
        var _sn = n.getSlaveEdges2();
        for (var _id in _sn) {
            var cell = _sn[_id].returnCell(),
            cellName;
            if (undefined == cell) {
                continue;
            }
            cellName = cell.getName();
            if (cell.formulaParsed) {
                cell.formulaParsed.shiftCells(objForRebuldFormula.move[id].offset, oBBox, n, this.Id, objForRebuldFormula.move[id].toDelete);
                cell.setFormula(cell.formulaParsed.assemble());
                c[cellName] = cell;
            }
        }
        if (n.cellId.indexOf(":") < 0) {
            var cell = n.returnCell();
            if (cell && cell.formulaParsed) {
                c[cell.getName()] = cell;
            }
        }
    }
    for (var id in objForRebuldFormula.stretch) {
        var n = objForRebuldFormula.stretch[id].node;
        var _sn = n.getSlaveEdges2();
        if (_sn == null) {
            if (n.newCellId) {
                n = this.workbook.dependencyFormulas.getNode(n.sheetId, n.newCellId);
                _sn = n.getSlaveEdges2();
            }
        }
        for (var _id in _sn) {
            var cell = _sn[_id].returnCell(),
            cellName = cell.getName();
            if (cell && cell.formulaParsed) {
                cell.formulaParsed.stretchArea(objForRebuldFormula.stretch[id].offset, oBBox, n, this.Id);
                cell.setFormula(cell.formulaParsed.assemble());
                c[cellName] = cell;
            }
        }
    }
    var id = null;
    for (id in objForRebuldFormula) {
        if (id == "recalc") {
            continue;
        }
        for (var _id in objForRebuldFormula[id]) {
            this.workbook.dependencyFormulas.deleteNode(objForRebuldFormula[id][_id].node);
        }
    }
    for (var i in c) {
        var ws = c[i].ws;
        if (ws.getCell2(c[i].getName()).getCells()[0].formulaParsed) {
            var n = c[i].getName();
            c[i].formulaParsed.setCellId(n);
            this.workbook.cwf[c[i].ws.Id].cells[n] = n;
            c[i].formulaParsed.buildDependencies();
            this.workbook.needRecalc[getVertexId(c[i].ws.Id, n)] = [c[i].ws.Id, n];
            this.workbook.needRecalc.length++;
        }
        c[i] = null;
        delete c[i];
    }
    for (var id in objForRebuldFormula.recalc) {
        var n = objForRebuldFormula.recalc[id];
        var _sn = n.getSlaveEdges();
        for (var _id in _sn) {
            if (!_sn[_id].isArea) {
                this.workbook.needRecalc[_sn[_id].nodeId] = [_sn[_id].sheetId, _sn[_id].cellId];
                this.workbook.needRecalc.length++;
            }
        }
    }
    if (false !== rec && lc <= 1) {
        recalc(this.workbook);
    }
};
Woorksheet.prototype.helperRebuildFormulas = function (cell, lastName) {
    if (cell.sFormula) {
        this.workbook.cwf[this.Id].cells[lastName] = null;
        delete this.workbook.cwf[this.Id].cells[lastName];
    }
};
Woorksheet.prototype.getAllCol = function () {
    if (null == this.oAllCol) {
        this.oAllCol = new Col(this, g_nAllColIndex);
    }
    return this.oAllCol;
};
Woorksheet.prototype.getHyperlinkByCell = function (row, col) {
    var oHyperlink = this.hyperlinkManager.getByCell(row, col);
    return oHyperlink ? oHyperlink.data : null;
};
Woorksheet.prototype.getMergedByCell = function (row, col) {
    var oMergeInfo = this.mergeManager.getByCell(row, col);
    return oMergeInfo ? oMergeInfo.bbox : null;
};
Woorksheet.prototype._expandRangeByMergedAddToOuter = function (aOuter, range, aMerged) {
    for (var i = 0, length = aMerged.all.length; i < length; i++) {
        var elem = aMerged.all[i];
        if (!range.containsRange(elem.bbox)) {
            aOuter.push(elem);
        }
    }
};
Woorksheet.prototype._expandRangeByMergedGetOuter = function (range) {
    var aOuter = [];
    this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({
        r1: range.r1,
        c1: range.c1,
        r2: range.r2,
        c2: range.c1
    }));
    if (range.c1 != range.c2) {
        this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({
            r1: range.r1,
            c1: range.c2,
            r2: range.r2,
            c2: range.c2
        }));
        if (range.c2 - range.c1 > 1) {
            this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({
                r1: range.r1,
                c1: range.c1 + 1,
                r2: range.r1,
                c2: range.c2 - 1
            }));
            if (range.r1 != range.r2) {
                this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({
                    r1: range.r2,
                    c1: range.c1 + 1,
                    r2: range.r2,
                    c2: range.c2 - 1
                }));
            }
        }
    }
    return aOuter;
};
Woorksheet.prototype.expandRangeByMerged = function (range) {
    if (null != range) {
        var aOuter = this._expandRangeByMergedGetOuter(range);
        if (aOuter.length > 0) {
            range = range.clone();
            while (aOuter.length > 0) {
                for (var i = 0, length = aOuter.length; i < length; i++) {
                    range.union2(aOuter[i].bbox);
                }
                aOuter = this._expandRangeByMergedGetOuter(range);
            }
        }
    }
    return range;
};
function Cell(worksheet) {
    this.ws = worksheet;
    this.sm = worksheet.workbook.oStyleManager;
    this.cs = worksheet.workbook.CellStyles;
    this.oValue = new CCellValue(this);
    this.xfs = null;
    this.tableXfs = null;
    this.conditionalFormattingXfs = null;
    this.bNeedCompileXfs = true;
    this.compiledXfs = null;
    this.oId = null;
    this.oFormulaExt = null;
    this.sFormula = null;
    this.formulaParsed = null;
}
Cell.prototype.getStyle = function () {
    if (this.bNeedCompileXfs) {
        this.bNeedCompileXfs = false;
        this.compileXfs();
    }
    return this.compiledXfs;
};
Cell.prototype.compileXfs = function () {
    this.compiledXfs = null;
    if (null != this.xfs || null != this.tableXfs || null != this.conditionalFormattingXfs) {
        if (null != this.tableXfs) {
            this.compiledXfs = this.tableXfs;
        }
        if (null != this.xfs) {
            if (null != this.compiledXfs) {
                this.compiledXfs = this.xfs.merge(this.compiledXfs);
            } else {
                this.compiledXfs = this.xfs;
            }
        }
        if (null != this.conditionalFormattingXfs) {
            if (null != this.compiledXfs) {
                this.compiledXfs = this.conditionalFormattingXfs.merge(this.compiledXfs);
            } else {
                this.compiledXfs = this.xfs;
            }
        }
    }
};
Cell.prototype.clone = function () {
    var oNewCell = new Cell(this.ws);
    oNewCell.oId = new CellAddress(this.oId.getRow(), this.oId.getCol());
    if (null != this.xfs) {
        oNewCell.xfs = this.xfs.clone();
    }
    oNewCell.oValue = this.oValue.clone(oNewCell);
    if (null != this.sFormula) {
        oNewCell.sFormula = this.sFormula;
    }
    return oNewCell;
};
Cell.prototype.create = function (xfs, oId) {
    this.xfs = xfs;
    this.oId = oId;
};
Cell.prototype.isEmptyText = function () {
    if (false == this.oValue.isEmpty()) {
        return false;
    }
    if (null != this.sFormula) {
        return false;
    }
    return true;
};
Cell.prototype.isEmptyTextString = function () {
    return this.oValue.isEmpty();
};
Cell.prototype.isEmpty = function () {
    if (false == this.isEmptyText()) {
        return false;
    }
    if (null != this.xfs) {
        return false;
    }
    return true;
};
Cell.prototype.isFormula = function () {
    return this.sFormula ? true : false;
};
Cell.prototype.Remove = function () {
    this.ws._removeCell(null, null, this);
};
Cell.prototype.getName = function () {
    return this.oId.getID();
};
Cell.prototype.cleanCache = function () {
    this.oValue.cleanCache();
};
Cell.prototype.setFormula = function (val) {
    this.sFormula = val;
    this.oValue.cleanCache();
};
Cell.prototype.setValue = function (val, callback) {
    var ret = true;
    var DataOld = null;
    if (History.Is_On()) {
        DataOld = this.getValueData();
    }
    var sNumFormat;
    if (null != this.xfs && null != this.xfs.num) {
        sNumFormat = this.xfs.num.f;
    } else {
        sNumFormat = g_oDefaultNum.f;
    }
    var numFormat = oNumFormatCache.get(sNumFormat);
    var wb = this.ws.workbook;
    var ws = this.ws;
    if (false == numFormat.isTextFormat()) {
        if (null != val && val[0] == "=" && val.length > 1) {
            var oldFP = undefined;
            if (this.formulaParsed) {
                oldFP = this.formulaParsed;
            }
            this.formulaParsed = new parserFormula(val.substring(1), this.oId.getID(), this.ws);
            if (!this.formulaParsed.parse()) {
                switch (this.formulaParsed.error[this.formulaParsed.error.length - 1]) {
                case c_oAscError.ID.FrmlWrongFunctionName:
                    break;
                default:
                    wb.handlers.trigger("asc_onError", this.formulaParsed.error[this.formulaParsed.error.length - 1], c_oAscError.Level.NoCritical);
                    if (callback) {
                        callback(false);
                    }
                    if (oldFP !== undefined) {
                        this.formulaParsed = oldFP;
                    }
                    return;
                }
            } else {
                val = "=" + this.formulaParsed.assemble();
            }
        }
    }
    this.oValue.clean();
    var needRecalc = false;
    var ar = {};
    if (null != val && val[0] != "=" || true == numFormat.isTextFormat()) {
        if (this.sFormula) {
            if (this.oId.getID() in wb.cwf[ws.Id].cells) {
                wb.dependencyFormulas.deleteMasterNodes(ws.Id, this.oId.getID());
                delete wb.cwf[ws.Id].cells[this.oId.getID()];
            }
            needRecalc = true;
            ar[this.oId.getID()] = this.oId.getID();
        } else {
            if (wb.dependencyFormulas.nodeExist2(ws.Id, this.oId.getID())) {
                needRecalc = true;
                ar[this.oId.getID()] = this.oId.getID();
            }
        }
    } else {
        wb.dependencyFormulas.deleteMasterNodes(ws.Id, this.oId.getID());
        needRecalc = true;
        wb.cwf[ws.Id].cells[this.oId.getID()] = this.oId.getID();
        ar[this.oId.getID()] = this.oId.getID();
        if (!arrRecalc[this.ws.getId()]) {
            arrRecalc[this.ws.getId()] = {};
        }
        arrRecalc[this.ws.getId()][this.oId.getID()] = this.oId.getID();
        wb.needRecalc[getVertexId(this.ws.getId(), this.oId.getID())] = [this.ws.getId(), this.oId.getID()];
        wb.needRecalc.length++;
    }
    this.sFormula = null;
    this.setFormulaCA(false);
    if (val) {
        if (false == numFormat.isTextFormat() && val[0] == "=" && val.length > 1) {
            this.setFormula(val.substring(1));
        } else {
            this.oValue.setValue(val);
        }
    }
    if (needRecalc && this.ws.workbook.isNeedCacheClean) {
        sortDependency(this.ws, ar);
    } else {
        if (this.ws.workbook.isNeedCacheClean == false) {
            if (ws.workbook.dependencyFormulas.nodeExist2(this.ws.getId(), this.getName())) {
                if (!arrRecalc[this.ws.getId()]) {
                    arrRecalc[this.ws.getId()] = {};
                }
                arrRecalc[this.ws.getId()][this.oId.getID()] = this.oId.getID();
                wb.needRecalc[getVertexId(this.ws.getId(), this.oId.getID())] = [this.ws.getId(), this.oId.getID()];
                wb.needRecalc.length++;
            }
        }
    }
    var DataNew = null;
    if (History.Is_On()) {
        DataNew = this.getValueData();
    }
    if (History.Is_On() && false == DataOld.isEqual(DataNew)) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), DataOld, DataNew));
    }
    if (this.isEmptyTextString()) {
        var cell = this.ws.getCell(this.oId);
        cell.removeHyperlink();
    }
    return ret;
};
Cell.prototype.setValue2 = function (array) {
    var DataOld = null;
    if (History.Is_On()) {
        DataOld = this.getValueData();
    }
    var ws = this.ws;
    var wb = this.ws.workbook;
    var needRecalc = false;
    var ar = new Array();
    if (this.sFormula) {
        if (this.oId.getID() in wb.cwf[ws.Id].cells) {
            wb.dependencyFormulas.deleteMasterNodes(ws.Id, this.oId.getID());
            delete wb.cwf[ws.Id].cells[this.oId.getID()];
        }
        needRecalc = true;
        ar.push(this.oId.getID());
    } else {
        if (wb.dependencyFormulas.nodeExist2(ws.Id, this.oId.getID())) {
            needRecalc = true;
            ar.push(this.oId.getID());
        }
    }
    this.sFormula = null;
    this.oValue.clean();
    this.setFormulaCA(false);
    this.oValue.setValue2(array);
    if (needRecalc) {
        sortDependency(this.ws, ar);
    }
    var DataNew = null;
    if (History.Is_On()) {
        DataNew = this.getValueData();
    }
    if (History.Is_On() && false == DataOld.isEqual(DataNew)) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), DataOld, DataNew));
    }
    if (this.isEmptyTextString()) {
        var cell = this.ws.getCell(this.oId);
        cell.removeHyperlink();
    }
};
Cell.prototype.setType = function (type) {
    return this.oValue.type = type;
};
Cell.prototype.getType = function () {
    return this.oValue.type;
};
Cell.prototype.setCellStyle = function (val) {
    var newVal = this.cs._prepareCellStyle(val);
    var oRes = this.sm.setCellStyle(this, newVal);
    if (History.Is_On()) {
        var oldStyleName = this.cs.getStyleNameByXfId(oRes.oldVal);
        History.Add(g_oUndoRedoCell, historyitem_Cell_Style, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldStyleName, val));
        var oStyle = this.cs.getStyleByXfId(oRes.newVal);
        if (oStyle.ApplyFont) {
            this.setFont(oStyle.getFont());
        }
        if (oStyle.ApplyFill) {
            this.setFill(oStyle.getFill());
        }
        if (oStyle.ApplyBorder) {
            this.setBorder(oStyle.getBorder());
        }
        if (oStyle.ApplyNumberFormat) {
            this.setNumFormat(oStyle.getNumFormatStr());
        }
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setNumFormat = function (val) {
    var oRes;
    if (val == aStandartNumFormats[0] && this.formulaParsed && this.formulaParsed.value && this.formulaParsed.value.numFormat !== null && this.formulaParsed.value.numFormat !== undefined && aStandartNumFormats[this.formulaParsed.value.numFormat]) {
        oRes = this.sm.setNumFormat(this, aStandartNumFormats[this.formulaParsed.value.numFormat]);
    } else {
        oRes = this.sm.setNumFormat(this, val);
    }
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Numformat, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.shiftNumFormat = function (nShift, dDigitsCount) {
    var bRes = false;
    var bGeneral = true;
    var sNumFormat;
    if (null != this.xfs && null != this.xfs.num) {
        sNumFormat = this.xfs.num.f;
    } else {
        sNumFormat = g_oDefaultNum.f;
    }
    if ("General" != sNumFormat) {
        var oCurNumFormat = oNumFormatCache.get(sNumFormat);
        if (null != oCurNumFormat && false == oCurNumFormat.isGeneralFormat()) {
            bGeneral = false;
            var output = new Object();
            bRes = oCurNumFormat.shiftFormat(output, nShift);
            if (true == bRes) {
                this.setNumFormat(output.format);
            }
        }
    }
    if (bGeneral) {
        if (CellValueType.Number == this.oValue.type) {
            var sGeneral = DecodeGeneralFormat(this.oValue.number, this.oValue.type, dDigitsCount);
            var oGeneral = oNumFormatCache.get(sGeneral);
            if (null != oGeneral && false == oGeneral.isGeneralFormat()) {
                var output = new Object();
                bRes = oGeneral.shiftFormat(output, nShift);
                if (true == bRes) {
                    this.setNumFormat(output.format);
                }
            }
        }
    }
    this.oValue.cleanCache();
    return bRes;
};
Cell.prototype.setFont = function (val, bModifyValue) {
    if (false != bModifyValue) {
        if (null != this.oValue.multiText) {
            var oldVal = null;
            if (History.Is_On()) {
                oldVal = this.getValueData();
            }
            this.oValue.makeSimpleText();
            if (History.Is_On()) {
                var newVal = this.getValueData();
                History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
            }
        }
    }
    var oRes = this.sm.setFont(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        var oldVal = null;
        if (null != oRes.oldVal) {
            oldVal = oRes.oldVal.clone();
        }
        var newVal = null;
        if (null != oRes.newVal) {
            newVal = oRes.newVal.clone();
        }
        History.Add(g_oUndoRedoCell, historyitem_Cell_SetFont, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setFontname = function (val) {
    this.oValue.setFontname(val);
    var oRes = this.sm.setFontname(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontname, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setFontsize = function (val) {
    this.oValue.setFontsize(val);
    var oRes = this.sm.setFontsize(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontsize, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setFontcolor = function (val) {
    this.oValue.setFontcolor(val);
    var oRes = this.sm.setFontcolor(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontcolor, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setBold = function (val) {
    this.oValue.setBold(val);
    var oRes = this.sm.setBold(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Bold, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setItalic = function (val) {
    this.oValue.setItalic(val);
    var oRes = this.sm.setItalic(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Italic, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setUnderline = function (val) {
    this.oValue.setUnderline(val);
    var oRes = this.sm.setUnderline(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Underline, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setStrikeout = function (val) {
    this.oValue.setStrikeout(val);
    var oRes = this.sm.setStrikeout(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Strikeout, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setFontAlign = function (val) {
    this.oValue.setFontAlign(val);
    var oRes = this.sm.setFontAlign(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_FontAlign, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setAlignVertical = function (val) {
    var oRes = this.sm.setAlignVertical(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_AlignVertical, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setAlignHorizontal = function (val) {
    var oRes = this.sm.setAlignHorizontal(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_AlignHorizontal, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setFill = function (val) {
    var oRes = this.sm.setFill(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fill, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setBorder = function (val) {
    var oRes = this.sm.setBorder(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        var oldVal = null;
        if (null != oRes.oldVal) {
            oldVal = oRes.oldVal.clone();
        }
        var newVal = null;
        if (null != oRes.newVal) {
            newVal = oRes.newVal.clone();
        }
        History.Add(g_oUndoRedoCell, historyitem_Cell_Border, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setShrinkToFit = function (val) {
    var oRes = this.sm.setShrinkToFit(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_ShrinkToFit, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setWrap = function (val) {
    var oRes = this.sm.setWrap(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Wrap, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setAngle = function (val) {
    var oRes = this.sm.setAngle(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Angle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setVerticalText = function (val) {
    var oRes = this.sm.setVerticalText(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_Angle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.bNeedCompileXfs = true;
};
Cell.prototype.setQuotePrefix = function (val) {
    var oRes = this.sm.setQuotePrefix(this, val);
    if (History.Is_On() && oRes.oldVal != oRes.newVal) {
        History.Add(g_oUndoRedoCell, historyitem_Cell_SetQuotePrefix, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    }
    this.oValue.cleanCache();
};
Cell.prototype.setConditionalFormattingStyle = function (xfs) {
    this.conditionalFormattingXfs = xfs;
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setTableStyle = function (xfs) {
    this.tableXfs = xfs;
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
};
Cell.prototype.setStyle = function (xfs) {
    var oldVal = this.xfs;
    var newVal = null;
    this.xfs = null;
    if (null != xfs) {
        this.xfs = xfs.clone();
        newVal = this.xfs;
    }
    this.bNeedCompileXfs = true;
    this.oValue.cleanCache();
    if (History.Is_On() && false == ((null == oldVal && null == newVal) || (null != oldVal && null != newVal && true == oldVal.isEqual(newVal)))) {
        if (null != oldVal) {
            oldVal = oldVal.clone();
        }
        if (null != newVal) {
            newVal = newVal.clone();
        }
        History.Add(g_oUndoRedoCell, historyitem_Cell_SetStyle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
    }
};
Cell.prototype.getFormula = function () {
    if (null != this.sFormula) {
        return this.sFormula;
    } else {
        return "";
    }
};
Cell.prototype.getValueForEdit = function (numFormat) {
    return this.oValue.getValueForEdit();
};
Cell.prototype.getValueForEdit2 = function (numFormat) {
    return this.oValue.getValueForEdit2();
};
Cell.prototype.getValueWithoutFormat = function () {
    return this.oValue.getValueWithoutFormat();
};
Cell.prototype.getValue = function (numFormat, dDigitsCount) {
    return this.oValue.getValue();
};
Cell.prototype.getValue2 = function (dDigitsCount, fIsFitMeasurer) {
    if (null == fIsFitMeasurer) {
        fIsFitMeasurer = function (aText) {
            return true;
        };
    }
    if (null == dDigitsCount) {
        dDigitsCount = gc_nMaxDigCountView;
    }
    return this.oValue.getValue2(dDigitsCount, fIsFitMeasurer);
};
Cell.prototype.getNumFormatStr = function () {
    if (null != this.xfs && null != this.xfs.num) {
        return this.xfs.num.f;
    }
    return g_oDefaultNum.f;
};
Cell.prototype.moveHor = function (val) {
    this.oId.moveCol(val);
};
Cell.prototype.moveVer = function (val) {
    this.oId.moveRow(val);
};
Cell.prototype.getOffset = function (cell) {
    var cAddr1 = this.oId,
    cAddr2 = cell.oId;
    return {
        offsetCol: (cAddr1.col - cAddr2.col),
        offsetRow: (cAddr1.row - cAddr2.row)
    };
};
Cell.prototype.getOffset2 = function (cellId) {
    var cAddr1 = this.oId,
    cAddr2 = new CellAddress(cellId);
    return {
        offsetCol: (cAddr1.col - cAddr2.col),
        offsetRow: (cAddr1.row - cAddr2.row)
    };
};
Cell.prototype.getOffset3 = function (cellAddr) {
    var cAddr1 = this.oId,
    cAddr2 = cellAddr;
    return {
        offsetCol: (cAddr1.col - cAddr2.col),
        offsetRow: (cAddr1.row - cAddr2.row)
    };
};
Cell.prototype.getCellAddress = function () {
    return this.oId;
};
Cell.prototype.getValueData = function () {
    return new UndoRedoData_CellValueData(this.sFormula, this.oValue.clone(null));
};
Cell.prototype.setValueData = function (Val) {
    if (null != Val.formula) {
        this.setValue("=" + Val.formula);
    } else {
        if (null != Val.value) {
            if (null != Val.value.number) {
                this.setValue(Val.value.number.toString());
            } else {
                if (null != Val.value.text) {
                    this.setValue(Val.value.text);
                } else {
                    if (null != Val.value.multiText) {
                        this.setValue2(Val.value._cloneMultiText());
                    } else {
                        this.setValue("");
                    }
                }
            }
        } else {
            this.setValue("");
        }
    }
};
Cell.prototype.setFormulaCA = function (ca) {
    if (ca) {
        this.sFormulaCA = true;
    } else {
        if (this.sFormulaCA) {
            delete this.sFormulaCA;
        }
    }
};
function Range(worksheet, r1, c1, r2, c2) {
    this.worksheet = worksheet;
    this.bbox = new Asc.Range(c1, r1, c2, r2);
    this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
    this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
}
Range.prototype.clone = function () {
    return new Range(this.worksheet, this.bbox.r1, this.bbox.c1, this.bbox.r2, this.bbox.c2);
};
Range.prototype.getFirst = function () {
    return this.first;
};
Range.prototype.getLast = function () {
    return this.last;
};
Range.prototype._foreach = function (action) {
    if (null != action) {
        var oBBox = this.bbox;
        for (var i = oBBox.r1; i <= oBBox.r2; i++) {
            for (var j = oBBox.c1; j <= oBBox.c2; j++) {
                var oCurCell = this.worksheet._getCell(i, j);
                action(oCurCell, i, j, oBBox.r1, oBBox.c1);
            }
        }
    }
};
Range.prototype._foreach2 = function (action) {
    if (null != action) {
        var oBBox = this.bbox,
        minC = Math.min(this.worksheet.getColsCount(), oBBox.c2),
        minR = Math.min(this.worksheet.getRowsCount(), oBBox.r2);
        for (var i = oBBox.r1; i <= minR; i++) {
            for (var j = oBBox.c1; j <= minC; j++) {
                var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                var oRes = action(oCurCell, i, j, oBBox.r1, oBBox.c1);
                if (null != oRes) {
                    return oRes;
                }
            }
        }
    }
};
Range.prototype._foreachNoEmpty = function (action) {
    if (null != action) {
        var oBBox = this.bbox,
        minC = Math.min(this.worksheet.getColsCount(), oBBox.c2),
        minR = Math.min(this.worksheet.getRowsCount(), oBBox.r2);
        for (var i = oBBox.r1; i <= minR; i++) {
            for (var j = oBBox.c1; j <= minC; j++) {
                var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                if (null != oCurCell) {
                    var oRes = action(oCurCell, i, j, oBBox.r1, oBBox.c1);
                    if (null != oRes) {
                        return oRes;
                    }
                }
            }
        }
    }
};
Range.prototype._foreachRow = function (actionRow, actionCell) {
    var oBBox = this.bbox;
    for (var i = oBBox.r1; i <= oBBox.r2; i++) {
        var row = this.worksheet._getRow(i);
        if (row) {
            if (null != actionRow) {
                actionRow(row);
            }
            if (null != actionCell) {
                for (var j in row.c) {
                    var oCurCell = row.c[j];
                    if (null != oCurCell) {
                        actionCell(oCurCell, i, j - 0, oBBox.r1, oBBox.c1);
                    }
                }
            }
        }
    }
};
Range.prototype._foreachRowNoEmpty = function (actionRow, actionCell) {
    var oBBox = this.bbox;
    if (0 == oBBox.r1 && gc_nMaxRow0 == oBBox.r2) {
        var aRows = this.worksheet._getRows();
        for (var i in aRows) {
            var row = aRows[i];
            if (null != actionRow) {
                var oRes = actionRow(row);
                if (null != oRes) {
                    return oRes;
                }
            }
            if (null != actionCell) {
                for (var j in row.c) {
                    var oCurCell = row.c[j];
                    if (null != oCurCell) {
                        var oRes = actionCell(oCurCell, i, j - 0, oBBox.r1, oBBox.c1);
                        if (null != oRes) {
                            return oRes;
                        }
                    }
                }
            }
        }
    } else {
        var minR = Math.min(oBBox.r2, this.worksheet.getRowsCount());
        for (var i = oBBox.r1; i <= minR; i++) {
            var row = this.worksheet._getRowNoEmpty(i);
            if (row) {
                if (null != actionRow) {
                    var oRes = actionRow(row);
                    if (null != oRes) {
                        return oRes;
                    }
                }
                if (null != actionCell) {
                    for (var j in row.c) {
                        var oCurCell = row.c[j];
                        if (null != oCurCell) {
                            var oRes = actionCell(oCurCell, i, j - 0, oBBox.r1, oBBox.c1);
                            if (null != oRes) {
                                return oRes;
                            }
                        }
                    }
                }
            }
        }
    }
};
Range.prototype._foreachCol = function (actionCol, actionCell) {
    var oBBox = this.bbox;
    if (null != actionCol) {
        for (var i = oBBox.c1; i <= oBBox.c2; ++i) {
            var col = this.worksheet._getCol(i);
            if (null != col) {
                actionCol(col);
            }
        }
    }
    if (null != actionCell) {
        var nRangeType = this._getRangeType();
        var aRows = this.worksheet._getRows();
        for (var i in aRows) {
            var row = aRows[i];
            if (row) {
                if (0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2) {
                    for (var j in row.c) {
                        var oCurCell = row.c[j];
                        if (null != oCurCell) {
                            actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
                        }
                    }
                } else {
                    for (var j = oBBox.c1; j <= oBBox.c2; ++j) {
                        var oCurCell = row.c[j];
                        if (null != oCurCell) {
                            actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
                        }
                    }
                }
            }
        }
    }
};
Range.prototype._foreachColNoEmpty = function (actionCol, actionCell) {
    var oBBox = this.bbox;
    var minC = Math.min(oBBox.c2, this.worksheet.getColsCount());
    if (0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2) {
        if (null != actionCol) {
            var aCols = this.worksheet._getCols();
            for (var i in aCols) {
                var nIndex = i - 0;
                if (nIndex >= oBBox.c1 && nIndex <= minC) {
                    var col = this.worksheet._getColNoEmpty(nIndex);
                    if (null != col) {
                        var oRes = actionCol(col);
                        if (null != oRes) {
                            return oRes;
                        }
                    }
                }
            }
        }
        if (null != actionCell) {
            var aRows = this.worksheet._getRows();
            for (var i in aRows) {
                var row = aRows[i];
                if (row) {
                    for (var j in row.c) {
                        var nIndex = j - 0;
                        if (nIndex >= oBBox.c1 && nIndex <= minC) {
                            var oCurCell = row.c[j];
                            if (null != oCurCell) {
                                var oRes = actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
                                if (null != oRes) {
                                    return oRes;
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (null != actionCol) {
            for (var i = oBBox.c1; i <= minC; ++i) {
                var col = this.worksheet._getColNoEmpty(i);
                if (null != col) {
                    var oRes = actionCol(col);
                    if (null != oRes) {
                        return oRes;
                    }
                }
            }
        }
        if (null != actionCell) {
            var aRows = this.worksheet._getRows();
            for (var i in aRows) {
                var row = aRows[i];
                if (row) {
                    for (var j = oBBox.c1; j <= minC; ++j) {
                        var oCurCell = row.c[j];
                        if (null != oCurCell) {
                            var oRes = actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
                            if (null != oRes) {
                                return oRes;
                            }
                        }
                    }
                }
            }
        }
    }
};
Range.prototype._foreachIndex = function (action) {
    var oBBox = this.bbox;
    for (var i = oBBox.r1; i <= oBBox.r2; i++) {
        for (var j = oBBox.c1; j <= oBBox.c2; j++) {
            var res = action(i, j);
            if (null != res) {
                return res;
            }
        }
    }
    return null;
};
Range.prototype._getRangeType = function (oBBox) {
    if (null == oBBox) {
        oBBox = this.bbox;
    }
    return getRangeType(oBBox);
};
Range.prototype._setProperty = function (actionRow, actionCol, actionCell) {
    var nRangeType = this._getRangeType();
    if (c_oRangeType.Range == nRangeType) {
        this._foreach(actionCell);
    } else {
        if (c_oRangeType.Row == nRangeType) {
            this._foreachRow(actionRow, actionCell);
        } else {
            if (c_oRangeType.Col == nRangeType) {
                this._foreachCol(actionCol, actionCell);
            } else {}
        }
    }
};
Range.prototype._setPropertyNoEmpty = function (actionRow, actionCol, actionCell) {
    var nRangeType = this._getRangeType();
    if (c_oRangeType.Range == nRangeType) {
        this._foreachNoEmpty(actionCell);
    } else {
        if (c_oRangeType.Row == nRangeType) {
            this._foreachRowNoEmpty(actionRow, actionCell);
        } else {
            if (c_oRangeType.Col == nRangeType) {
                this._foreachColNoEmpty(actionCol, actionCell);
            } else {
                this._foreachRowNoEmpty(actionRow, actionCell);
                if (null != actionCol) {
                    this._foreachColNoEmpty(actionCol, null);
                }
            }
        }
    }
};
Range.prototype.containCell = function (cellId) {
    var cellAddress = cellId;
    return cellAddress.getRow0() >= this.bbox.r1 && cellAddress.getCol0() >= this.bbox.c1 && cellAddress.getRow0() <= this.bbox.r2 && cellAddress.getCol0() <= this.bbox.c2;
};
Range.prototype.cross = function (cellAddress) {
    if (cellAddress.getRow0() >= this.bbox.r1 && cellAddress.getRow0() <= this.bbox.r2 && this.bbox.c1 == this.bbox.c2) {
        return {
            r: cellAddress.getRow()
        };
    }
    if (cellAddress.getCol0() >= this.bbox.c1 && cellAddress.getCol0() <= this.bbox.c2 && this.bbox.r1 == this.bbox.r2) {
        return {
            c: cellAddress.getCol()
        };
    }
    return undefined;
};
Range.prototype.getWorksheet = function () {
    return this.worksheet;
};
Range.prototype.isFormula = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    return cell.isFormula();
};
Range.prototype.isOneCell = function () {
    var oBBox = this.bbox;
    return oBBox.r1 == oBBox.r2 && oBBox.c1 == oBBox.c2;
};
Range.prototype.isColumn = function () {
    if (this.first.getRow() == 1 && this.last.getRow() == gc_nMaxRow) {
        return true;
    } else {
        return false;
    }
};
Range.prototype.isRow = function () {
    if (this.first.getCol() == 1 && this.last.getCol() == gc_nMaxCol) {
        return true;
    } else {
        return false;
    }
};
Range.prototype.getBBox = function () {
    return {
        r1: this.bbox.r1 + 1,
        r2: this.bbox.r2 + 1,
        c1: this.bbox.c1 + 1,
        c2: this.bbox.c2 + 1
    };
};
Range.prototype.getBBox0 = function () {
    return this.bbox;
};
Range.prototype.getName = function () {
    var first = this.getFirst();
    var sRes = first.getID();
    if (false == this.isOneCell()) {
        var last = this.getLast();
        sRes = sRes + ":" + last.getID();
    }
    return sRes;
};
Range.prototype.getCells = function () {
    var aResult = new Array();
    var oBBox = this.bbox;
    if (! ((0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2) || (0 == oBBox.r1 && gc_nMaxRow0 == oBBox.r2))) {
        for (var i = oBBox.r1; i <= oBBox.r2; i++) {
            for (var j = oBBox.c1; j <= oBBox.c2; j++) {
                aResult.push(this.worksheet._getCell(i, j));
            }
        }
    }
    return aResult;
};
Range.prototype.setValue = function (val, callback) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    var oThis = this;
    this._foreach(function (cell) {
        cell.setValue(val, callback);
    });
    History.EndTransaction();
};
Range.prototype.setValue2 = function (array) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    var wb = this.worksheet.workbook,
    ws = this.worksheet,
    needRecalc = false,
    ar = [];
    var oThis = this;
    this._foreach(function (cell) {
        cell.setValue2(array);
    });
    History.EndTransaction();
};
Range.prototype.setCellStyle = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setCellStyle(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setCellStyle(val);
    },
    function (col) {
        col.setCellStyle(val);
    },
    function (cell) {
        cell.setCellStyle(val);
    });
};
Range.prototype.setTableStyle = function (val) {
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
    },
    function (col) {},
    function (cell) {
        cell.setTableStyle(val);
    });
};
Range.prototype.setNumFormat = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setNumFormat(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setNumFormat(val);
    },
    function (col) {
        col.setNumFormat(val);
    },
    function (cell) {
        cell.setNumFormat(val);
    });
};
Range.prototype.shiftNumFormat = function (nShift, aDigitsCount) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    var bRes = false;
    var oThis = this;
    this._setPropertyNoEmpty(null, null, function (cell, nRow0, nCol0, nRowStart, nColStart) {
        bRes |= cell.shiftNumFormat(nShift, aDigitsCount[nCol0 - nColStart] || 8);
    });
    return bRes;
};
Range.prototype.setFont = function (val) {
    History.Create_NewPoint();
    History.SetSelection(this.bbox.clone());
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setFont(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setFont(val);
    },
    function (col) {
        col.setFont(val);
    },
    function (cell) {
        cell.setFont(val);
    });
};
Range.prototype.setFontname = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setFontname(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setFontname(val);
    },
    function (col) {
        col.setFontname(val);
    },
    function (cell) {
        cell.setFontname(val);
    });
};
Range.prototype.setFontsize = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setFontsize(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setFontsize(val);
    },
    function (col) {
        col.setFontsize(val);
    },
    function (cell) {
        cell.setFontsize(val);
    });
};
Range.prototype.setFontcolor = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setFontcolor(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setFontcolor(val);
    },
    function (col) {
        col.setFontcolor(val);
    },
    function (cell) {
        cell.setFontcolor(val);
    });
};
Range.prototype.setBold = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setBold(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setBold(val);
    },
    function (col) {
        col.setBold(val);
    },
    function (cell) {
        cell.setBold(val);
    });
};
Range.prototype.setItalic = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setItalic(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setItalic(val);
    },
    function (col) {
        col.setItalic(val);
    },
    function (cell) {
        cell.setItalic(val);
    });
};
Range.prototype.setUnderline = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setUnderline(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setUnderline(val);
    },
    function (col) {
        col.setUnderline(val);
    },
    function (cell) {
        cell.setUnderline(val);
    });
};
Range.prototype.setStrikeout = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setStrikeout(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setStrikeout(val);
    },
    function (col) {
        col.setStrikeout(val);
    },
    function (cell) {
        cell.setStrikeout(val);
    });
};
Range.prototype.setFontAlign = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setFontAlign(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setFontAlign(val);
    },
    function (col) {
        col.setFontAlign(val);
    },
    function (cell) {
        cell.setFontAlign(val);
    });
};
Range.prototype.setAlignVertical = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    if ("none" == val) {
        val = null;
    }
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setAlignVertical(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setAlignVertical(val);
    },
    function (col) {
        col.setAlignVertical(val);
    },
    function (cell) {
        cell.setAlignVertical(val);
    });
};
Range.prototype.setAlignHorizontal = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setAlignHorizontal(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setAlignHorizontal(val);
    },
    function (col) {
        col.setAlignHorizontal(val);
    },
    function (cell) {
        cell.setAlignHorizontal(val);
    });
};
Range.prototype.setFill = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setFill(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setFill(val);
    },
    function (col) {
        col.setFill(val);
    },
    function (cell) {
        cell.setFill(val);
    });
};
Range.prototype.setBorderSrc = function (border) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    if (null == border) {
        border = new Border();
    }
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setBorder(border.clone());
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setBorder(border.clone());
    },
    function (col) {
        col.setBorder(border.clone());
    },
    function (cell) {
        cell.setBorder(border.clone());
    });
    History.EndTransaction();
};
Range.prototype.setBorder = function (border) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    var nRangeType = this._getRangeType();
    var oThis = this;
    var fSetBorder = function (nRow, nCol, oNewBorder) {
        if (null == oNewBorder) {
            var cell = oThis.worksheet._getCellNoEmpty(nRow, nCol);
            if (null != cell) {
                cell.setBorder(oNewBorder);
            }
        } else {
            if (oNewBorder.isEqual(g_oDefaultBorderAbs)) {
                return;
            }
            var _cell = oThis.worksheet.getCell(new CellAddress(nRow, nCol, 0));
            var oCurBorder = _cell.getBorderSrc().clone();
            oCurBorder.mergeInner(oNewBorder);
            var cell = oThis.worksheet._getCell(nRow, nCol);
            cell.setBorder(oCurBorder);
        }
    };
    var fSetBorderRowCol = function (rowcol, oNewBorder) {
        if (null == oNewBorder) {
            rowcol.setBorder(null);
        } else {
            if (oNewBorder.isEqual(g_oDefaultBorderAbs)) {
                return;
            }
            var oCurBorder;
            if (null != rowcol.xfs && null != rowcol.xfs.border) {
                oCurBorder = rowcol.xfs.border.clone();
            } else {
                oCurBorder = new Border();
            }
            oCurBorder.mergeInner(oNewBorder);
            rowcol.setBorder(oNewBorder);
        }
    };
    var nEdgeTypeLeft = 1;
    var nEdgeTypeTop = 2;
    var nEdgeTypeRight = 3;
    var nEdgeTypeBottom = 4;
    var fSetBorderEdge = function (nRow, nCol, oNewBorder, type) {
        var _cell = oThis.worksheet.getCell(new CellAddress(nRow, nCol, 0));
        var oCurBorder = _cell.getBorderSrc().clone();
        var oCurBorderProp;
        var oNewBorderProp = null;
        if (null == oNewBorder) {
            oNewBorderProp = new BorderProp();
        }
        switch (type) {
        case nEdgeTypeLeft:
            oCurBorderProp = oCurBorder.r;
            if (null != oNewBorder) {
                oNewBorderProp = oNewBorder.l;
            }
            break;
        case nEdgeTypeTop:
            oCurBorderProp = oCurBorder.b;
            if (null != oNewBorder) {
                oNewBorderProp = oNewBorder.t;
            }
            break;
        case nEdgeTypeRight:
            oCurBorderProp = oCurBorder.l;
            if (null != oNewBorder) {
                oNewBorderProp = oNewBorder.r;
            }
            break;
        case nEdgeTypeBottom:
            oCurBorderProp = oCurBorder.t;
            if (null != oNewBorder) {
                oNewBorderProp = oNewBorder.b;
            }
            break;
        }
        if (null != oNewBorderProp && null != oCurBorderProp && c_oAscBorderStyles.None != oCurBorderProp.s && (null == oNewBorder || c_oAscBorderStyles.None != oNewBorderProp.s) && (oNewBorderProp.s != oCurBorderProp.s || oNewBorderProp.getRgbOrNull() != oCurBorderProp.getRgbOrNull())) {
            switch (type) {
            case nEdgeTypeLeft:
                oCurBorder.r = new BorderProp();
                break;
            case nEdgeTypeTop:
                oCurBorder.b = new BorderProp();
                break;
            case nEdgeTypeRight:
                oCurBorder.l = new BorderProp();
                break;
            case nEdgeTypeBottom:
                oCurBorder.t = new BorderProp();
                break;
            }
            var cell = oThis.worksheet._getCell(nRow, nCol);
            cell.setBorder(oCurBorder);
        }
    };
    var fSetBorderRowColEdge = function (rowcol, oNewBorder, type) {
        if (null != rowcol.xfs && null != rowcol.xfs.border) {
            var oCurBorder = rowcol.xfs.border.clone();
            var oCurBorderProp;
            var oNewBorderProp;
            if (null == oNewBorder) {
                oNewBorderProp = new BorderProp();
            }
            switch (type) {
            case nEdgeTypeLeft:
                oCurBorderProp = oCurBorder.r;
                if (null != oNewBorder) {
                    oNewBorderProp = oNewBorder.l;
                }
                break;
            case nEdgeTypeTop:
                oCurBorderProp = oCurBorder.b;
                if (null != oNewBorder) {
                    oNewBorderProp = oNewBorder.t;
                }
                break;
            case nEdgeTypeRight:
                oCurBorderProp = oCurBorder.l;
                if (null != oNewBorder) {
                    oNewBorderProp = oNewBorder.r;
                }
                break;
            case nEdgeTypeBottom:
                oCurBorderProp = oCurBorder.t;
                if (null != oNewBorder) {
                    oNewBorderProp = oNewBorder.b;
                }
                break;
            }
            if (null != oNewBorderProp && null != oCurBorderProp && c_oAscBorderStyles.None != oCurBorderProp.s && (null == oNewBorder || c_oAscBorderStyles.None != oNewBorderProp.s) && (oNewBorderProp.s != oCurBorderProp.s || oNewBorderProp.getRgbOrNull() != oCurBorderProp.getRgbOrNull())) {
                switch (type) {
                case nEdgeTypeLeft:
                    oCurBorder.r = new BorderProp();
                    break;
                case nEdgeTypeTop:
                    oCurBorder.b = new BorderProp();
                    break;
                case nEdgeTypeRight:
                    oCurBorder.l = new BorderProp();
                    break;
                case nEdgeTypeBottom:
                    oCurBorder.t = new BorderProp();
                    break;
                }
                rowcol.setBorder(oCurBorder);
            }
        }
    };
    if (null != border && border.isEqual(g_oDefaultBorderAbs)) {
        border = null;
    }
    if (nRangeType == c_oRangeType.Col) {
        var oLeftOuter = null;
        var oLeftInner = null;
        var oInner = null;
        var oRightInner = null;
        var oRightOuter = null;
        var nWidth = oBBox.c2 - oBBox.c1 + 1;
        if (null != border) {
            if (oBBox.c1 > 0 && null != border.l) {
                oLeftOuter = new Border();
                oLeftOuter.l = border.l;
            }
            if (oBBox.c2 < gc_nMaxCol0 && null != border.r) {
                oRightOuter = new Border();
                oRightOuter.r = border.r;
            }
            oLeftInner = new Border();
            oLeftInner.l = border.l;
            oLeftInner.t = border.ih;
            if (nWidth > 1) {
                oLeftInner.r = border.iv;
            } else {
                oLeftInner.r = border.r;
            }
            oLeftInner.b = border.ih;
            oLeftInner.d = border.d;
            oLeftInner.dd = border.dd;
            oLeftInner.du = border.du;
            if (oLeftInner.isEqual(g_oDefaultBorderAbs)) {
                oLeftInner = null;
            }
            if (nWidth > 1) {
                oRightInner = new Border();
                oRightInner.l = border.iv;
                oRightInner.t = border.ih;
                oRightInner.r = border.r;
                oRightInner.b = border.ih;
                oRightInner.d = border.d;
                oRightInner.dd = border.dd;
                oRightInner.du = border.du;
                if (oRightInner.isEqual(g_oDefaultBorderAbs)) {
                    oRightInner = null;
                }
            }
            if (nWidth > 2) {
                oInner = new Border();
                oInner.l = border.iv;
                oInner.t = border.ih;
                oInner.r = border.iv;
                oInner.b = border.ih;
                oInner.d = border.d;
                oInner.dd = border.dd;
                oInner.du = border.du;
                if (oInner.isEqual(g_oDefaultBorderAbs)) {
                    oInner = null;
                }
            }
        }
        if (oBBox.c1 > 0) {
            var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1 - 1, 0), new CellAddress(gc_nMaxRow0, oBBox.c1 - 1, 0));
            oTempRange._foreachColNoEmpty(function (col) {
                if (null != col.xfs) {
                    fSetBorderRowColEdge(col, oLeftOuter, nEdgeTypeLeft);
                }
            },
            function (cell, nRow, nCol, nRowStart, nColStart) {
                fSetBorderEdge(nRow, nCol, oLeftOuter, nEdgeTypeLeft);
            });
        }
        var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1, 0), new CellAddress(gc_nMaxRow0, oBBox.c1, 0));
        oTempRange._foreachCol(function (col) {
            fSetBorderRowCol(col, oLeftInner);
        },
        function (cell, nRow, nCol, nRowStart, nColStart) {
            fSetBorder(nRow, nCol, oLeftInner);
        });
        if (nWidth > 2) {
            var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1 + 1, 0), new CellAddress(gc_nMaxRow0, oBBox.c2 - 1, 0));
            oTempRange._foreachCol(function (col) {
                fSetBorderRowCol(col, oInner);
            },
            function (cell, nRow, nCol, nRowStart, nColStart) {
                fSetBorder(nRow, nCol, oInner);
            });
        }
        if (nWidth > 1) {
            var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c2, 0), new CellAddress(gc_nMaxRow0, oBBox.c2, 0));
            oTempRange._foreachCol(function (col) {
                fSetBorderRowCol(col, oRightInner);
            },
            function (cell, nRow, nCol, nRowStart, nColStart) {
                fSetBorder(nRow, nCol, oRightInner);
            });
        }
        if (oBBox.c2 < gc_nMaxCol0) {
            var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c2 + 1, 0), new CellAddress(gc_nMaxRow0, oBBox.c2 + 1, 0));
            oTempRange._foreachColNoEmpty(function (col) {
                if (null != col.xfs) {
                    fSetBorderRowColEdge(col, oRightOuter, nEdgeTypeRight);
                }
            },
            function (cell, nRow, nCol, nRowStart, nColStart) {
                fSetBorderEdge(nRow, nCol, oRightOuter, nEdgeTypeRight);
            });
        }
    } else {
        if (nRangeType == c_oRangeType.Row) {
            var oTopOuter = null;
            var oTopInner = null;
            var oInner = null;
            var oBottomInner = null;
            var oBottomOuter = null;
            var nHeight = oBBox.r2 - oBBox.r1 + 1;
            if (null != border) {
                if (oBBox.r1 > 0 && null != border.t) {
                    oTopOuter = new Border();
                    oTopOuter.t = border.t;
                }
                if (oBBox.r2 < gc_nMaxRow0 && null != border.b) {
                    oBottomOuter = new Border();
                    oBottomOuter.b = border.b;
                }
                oTopInner = new Border();
                oTopInner.l = border.iv;
                oTopInner.t = border.t;
                oTopInner.r = border.iv;
                if (nHeight > 1) {
                    oTopInner.b = border.ih;
                } else {
                    oTopInner.b = border.b;
                }
                oTopInner.d = border.d;
                oTopInner.dd = border.dd;
                oTopInner.du = border.du;
                if (oTopInner.isEqual(g_oDefaultBorderAbs)) {
                    oTopInner = null;
                }
                if (nHeight > 1) {
                    oBottomInner = new Border();
                    oBottomInner.l = border.iv;
                    oBottomInner.t = border.ih;
                    oBottomInner.r = border.iv;
                    oBottomInner.b = border.b;
                    oBottomInner.d = border.d;
                    oBottomInner.dd = border.dd;
                    oBottomInner.du = border.du;
                    if (oBottomInner.isEqual(g_oDefaultBorderAbs)) {
                        oBottomInner = null;
                    }
                }
                if (nHeight > 2) {
                    oInner = new Border();
                    oInner.l = border.iv;
                    oInner.t = border.ih;
                    oInner.r = border.iv;
                    oInner.b = border.ih;
                    oInner.d = border.d;
                    oInner.dd = border.dd;
                    oInner.du = border.du;
                    if (oInner.isEqual(g_oDefaultBorderAbs)) {
                        oInner = null;
                    }
                }
            }
            if (oBBox.r1 > 0) {
                var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r1 - 1, 0, 0), new CellAddress(oBBox.r1 - 1, gc_nMaxCol0, 0));
                oTempRange._foreachRowNoEmpty(function (row) {
                    if (null != row.xfs) {
                        fSetBorderRowColEdge(row, oTopOuter, nEdgeTypeTop);
                    }
                },
                function (cell, nRow, nCol, nRowStart, nColStart) {
                    fSetBorderEdge(nRow, nCol, oTopOuter, nEdgeTypeTop);
                });
            }
            var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r1, 0, 0), new CellAddress(oBBox.r1, gc_nMaxCol0, 0));
            oTempRange._foreachRow(function (row) {
                fSetBorderRowCol(row, oTopInner);
            },
            function (cell, nRow, nCol, nRowStart, nColStart) {
                fSetBorder(nRow, nCol, oTopInner);
            });
            if (nHeight > 2) {
                var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r1 + 1, 0, 0), new CellAddress(oBBox.r2 - 1, gc_nMaxCol0, 0));
                oTempRange._foreachRow(function (row) {
                    fSetBorderRowCol(row, oInner);
                },
                function (cell, nRow, nCol, nRowStart, nColStart) {
                    fSetBorder(nRow, nCol, oInner);
                });
            }
            if (nHeight > 1) {
                var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r2, 0, 0), new CellAddress(oBBox.r2, gc_nMaxCol0, 0));
                oTempRange._foreachRow(function (row) {
                    fSetBorderRowCol(row, oBottomInner);
                },
                function (cell, nRow, nCol, nRowStart, nColStart) {
                    fSetBorder(nRow, nCol, oBottomInner);
                });
            }
            if (oBBox.r2 < gc_nMaxRow0) {
                var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r2 + 1, 0, 0), new CellAddress(oBBox.r2 + 1, gc_nMaxCol0, 0));
                oTempRange._foreachRowNoEmpty(function (row) {
                    if (null != row.xfs) {
                        fSetBorderRowColEdge(row, oBottomOuter, nEdgeTypeBottom);
                    }
                },
                function (cell, nRow, nCol, nRowStart, nColStart) {
                    fSetBorderEdge(nRow, nCol, oBottomOuter, nEdgeTypeBottom);
                });
            }
        } else {
            if (nRangeType == c_oRangeType.Range) {
                var bLeftBorder = false;
                var bTopBorder = false;
                var bRightBorder = false;
                var bBottomBorder = false;
                if (null == border) {
                    this._foreachNoEmpty(function (cell) {
                        cell.setBorder(border);
                    });
                    bLeftBorder = true;
                    bTopBorder = true;
                    bRightBorder = true;
                    bBottomBorder = true;
                } else {
                    bLeftBorder = null != border.l;
                    bTopBorder = null != border.t;
                    bRightBorder = null != border.r;
                    bBottomBorder = null != border.b;
                    var bInnerHBorder = null != border.ih;
                    var bInnerVBorder = null != border.iv;
                    var bDiagonal = null != border.d;
                    if (oBBox.c1 == oBBox.c2 && oBBox.r1 == oBBox.r2) {
                        fSetBorder(oBBox.r1, oBBox.c1, border);
                    } else {
                        if (oBBox.c1 == oBBox.c2) {
                            if (bLeftBorder || bTopBorder || bRightBorder || bInnerHBorder || bDiagonal) {
                                var oLTBorder = new Border();
                                oLTBorder.l = border.l;
                                oLTBorder.t = border.t;
                                oLTBorder.r = border.r;
                                oLTBorder.b = border.ih;
                                oLTBorder.d = border.d;
                                oLTBorder.dd = border.dd;
                                oLTBorder.du = border.du;
                                fSetBorder(oBBox.r1, oBBox.c1, oLTBorder);
                            }
                            if (bLeftBorder || bBottomBorder || bRightBorder || bInnerHBorder || bDiagonal) {
                                var oLBBorder = new Border();
                                oLBBorder.l = border.l;
                                oLBBorder.t = border.ih;
                                oLBBorder.r = border.r;
                                oLBBorder.b = border.b;
                                oLBBorder.d = border.d;
                                oLBBorder.dd = border.dd;
                                oLBBorder.du = border.du;
                                fSetBorder(oBBox.r2, oBBox.c1, oLBBorder);
                            }
                        } else {
                            if (bLeftBorder || bTopBorder || bInnerVBorder || (oBBox.r1 == oBBox.r2 ? bBottomBorder : bInnerHBorder) || bDiagonal) {
                                var oLTBorder = new Border();
                                oLTBorder.l = border.l;
                                oLTBorder.t = border.t;
                                oLTBorder.r = border.iv;
                                if (oBBox.r1 == oBBox.r2) {
                                    oLTBorder.b = border.b;
                                } else {
                                    oLTBorder.b = border.ih;
                                }
                                oLTBorder.d = border.d;
                                oLTBorder.dd = border.dd;
                                oLTBorder.du = border.du;
                                fSetBorder(oBBox.r1, oBBox.c1, oLTBorder);
                            }
                            if (oBBox.r1 != oBBox.r2 && (bLeftBorder || bInnerVBorder || bInnerHBorder || bBottomBorder || bDiagonal)) {
                                var oLBBorder = new Border();
                                oLBBorder.l = border.l;
                                oLBBorder.t = border.ih;
                                oLBBorder.r = border.iv;
                                oLBBorder.b = border.b;
                                oLBBorder.d = border.d;
                                oLBBorder.dd = border.dd;
                                oLBBorder.du = border.du;
                                fSetBorder(oBBox.r2, oBBox.c1, oLBBorder);
                            }
                            if (bRightBorder || bTopBorder || bInnerVBorder || (oBBox.r1 == oBBox.r2 ? bBottomBorder : bInnerHBorder) || bDiagonal) {
                                var oRTBorder = new Border();
                                oRTBorder.l = border.iv;
                                oRTBorder.t = border.t;
                                oRTBorder.r = border.r;
                                if (oBBox.r1 == oBBox.r2) {
                                    oRTBorder.b = border.b;
                                } else {
                                    oRTBorder.b = border.ih;
                                }
                                oRTBorder.d = border.d;
                                oRTBorder.dd = border.dd;
                                oRTBorder.du = border.du;
                                fSetBorder(oBBox.r1, oBBox.c2, oRTBorder);
                            }
                            if (oBBox.r1 != oBBox.r2 && (bRightBorder || bInnerHBorder || bInnerVBorder || bBottomBorder || bDiagonal)) {
                                var oRBBorder = new Border();
                                oRBBorder.l = border.iv;
                                oRBBorder.t = border.ih;
                                oRBBorder.r = border.r;
                                oRBBorder.b = border.b;
                                oRBBorder.d = border.d;
                                oRBBorder.dd = border.dd;
                                oRBBorder.du = border.du;
                                fSetBorder(oBBox.r2, oBBox.c2, oRBBorder);
                            }
                        }
                        if (bTopBorder || bInnerVBorder || (oBBox.r1 == oBBox.r2 ? bBottomBorder : bInnerHBorder) || bDiagonal) {
                            for (var i = oBBox.c1 + 1; i < oBBox.c2; i++) {
                                var oTopBorder = new Border();
                                oTopBorder.l = border.iv;
                                oTopBorder.t = border.t;
                                oTopBorder.r = border.iv;
                                if (oBBox.r1 == oBBox.r2) {
                                    oTopBorder.b = border.b;
                                } else {
                                    oTopBorder.b = border.ih;
                                }
                                oTopBorder.d = border.d;
                                oTopBorder.dd = border.dd;
                                oTopBorder.du = border.du;
                                fSetBorder(oBBox.r1, i, oTopBorder);
                            }
                        }
                        if (oBBox.r1 != oBBox.r2 && (bBottomBorder || bInnerVBorder || bInnerHBorder || bDiagonal)) {
                            for (var i = oBBox.c1 + 1; i < oBBox.c2; i++) {
                                var oBottomBorder = new Border();
                                oBottomBorder.l = border.iv;
                                oBottomBorder.t = border.ih;
                                oBottomBorder.r = border.iv;
                                oBottomBorder.b = border.b;
                                oBottomBorder.d = border.d;
                                oBottomBorder.dd = border.dd;
                                oBottomBorder.du = border.du;
                                fSetBorder(oBBox.r2, i, oBottomBorder);
                            }
                        }
                        if (bLeftBorder || bInnerHBorder || (oBBox.c1 == oBBox.c2 ? bRightBorder : bInnerVBorder) || bDiagonal) {
                            for (var i = oBBox.r1 + 1; i < oBBox.r2; i++) {
                                var oLeftBorder = new Border();
                                oLeftBorder.l = border.l;
                                oLeftBorder.t = border.ih;
                                if (oBBox.c1 == oBBox.c2) {
                                    oLeftBorder.r = border.r;
                                } else {
                                    oLeftBorder.r = border.iv;
                                }
                                oLeftBorder.b = border.ih;
                                oLeftBorder.d = border.d;
                                oLeftBorder.dd = border.dd;
                                oLeftBorder.du = border.du;
                                fSetBorder(i, oBBox.c1, oLeftBorder);
                            }
                        }
                        if (oBBox.c1 != oBBox.c2 && (bRightBorder || bInnerVBorder || bInnerHBorder || bDiagonal)) {
                            for (var i = oBBox.r1 + 1; i < oBBox.r2; i++) {
                                var oRightBorder = new Border();
                                oRightBorder.l = border.iv;
                                oRightBorder.t = border.ih;
                                oRightBorder.r = border.r;
                                oRightBorder.b = border.ih;
                                oRightBorder.d = border.d;
                                oRightBorder.dd = border.dd;
                                oRightBorder.du = border.du;
                                fSetBorder(i, oBBox.c2, oRightBorder);
                            }
                        }
                        if (bInnerHBorder || bInnerVBorder || bDiagonal) {
                            for (var i = oBBox.r1 + 1; i < oBBox.r2; i++) {
                                for (var j = oBBox.c1 + 1; j < oBBox.c2; j++) {
                                    var oInnerBorder = new Border();
                                    oInnerBorder.l = border.iv;
                                    oInnerBorder.t = border.ih;
                                    oInnerBorder.r = border.iv;
                                    oInnerBorder.b = border.ih;
                                    oInnerBorder.d = border.d;
                                    oInnerBorder.dd = border.dd;
                                    oInnerBorder.du = border.du;
                                    fSetBorder(i, j, oInnerBorder);
                                }
                            }
                        }
                    }
                }
                if (bLeftBorder && oBBox.c1 > 0) {
                    var nCol = oBBox.c1 - 1;
                    for (var i = oBBox.r1; i <= oBBox.r2; i++) {
                        fSetBorderEdge(i, nCol, border, nEdgeTypeLeft);
                    }
                }
                if (bTopBorder && oBBox.r1 > 0) {
                    var nRow = oBBox.r1 - 1;
                    for (var i = oBBox.c1; i <= oBBox.c2; i++) {
                        fSetBorderEdge(nRow, i, border, nEdgeTypeTop);
                    }
                }
                if (bRightBorder && oBBox.c2 + 1 < this.worksheet.getColsCount()) {
                    var nCol = oBBox.c2 + 1;
                    for (var i = oBBox.r1; i <= oBBox.r2; i++) {
                        fSetBorderEdge(i, nCol, border, nEdgeTypeRight);
                    }
                }
                if (bBottomBorder && oBBox.r2 + 1 < this.worksheet.getRowsCount()) {
                    var nRow = oBBox.r2 + 1;
                    for (var i = oBBox.c1; i <= oBBox.c2; i++) {
                        fSetBorderEdge(nRow, i, border, nEdgeTypeBottom);
                    }
                }
            } else {
                this.worksheet.getAllCol().setBorder(border);
                this._setPropertyNoEmpty(function (row) {
                    row.setBorder(border);
                },
                function (col) {
                    col.setBorder(border);
                },
                function (cell) {
                    cell.setBorder(border);
                });
            }
        }
    }
};
Range.prototype.setShrinkToFit = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setShrinkToFit(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setShrinkToFit(val);
    },
    function (col) {
        col.setShrinkToFit(val);
    },
    function (cell) {
        cell.setShrinkToFit(val);
    });
};
Range.prototype.setWrap = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setWrap(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setWrap(val);
    },
    function (col) {
        col.setWrap(val);
    },
    function (cell) {
        cell.setWrap(val);
    });
};
Range.prototype.setAngle = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setAngle(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setAngle(val);
    },
    function (col) {
        col.setAngle(val);
    },
    function (cell) {
        cell.setAngle(val);
    });
};
Range.prototype.setVerticalText = function (val) {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    this.createCellOnRowColCross();
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        this.worksheet.getAllCol().setVerticalText(val);
        fSetProperty = this._setPropertyNoEmpty;
    }
    fSetProperty.call(this, function (row) {
        if (c_oRangeType.All == nRangeType && null == row.xfs) {
            return;
        }
        row.setVerticalText(val);
    },
    function (col) {
        col.setVerticalText(val);
    },
    function (cell) {
        cell.setVerticalText(val);
    });
};
Range.prototype.getType = function () {
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        return cell.getType();
    } else {
        return null;
    }
};
Range.prototype.getFormula = function () {
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        return cell.getFormula();
    } else {
        return "";
    }
};
Range.prototype.getValueForEdit = function () {
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        var numFormat = this.getNumFormat();
        return cell.getValueForEdit(numFormat);
    } else {
        return "";
    }
};
Range.prototype.getValueForEdit2 = function () {
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        var numFormat = this.getNumFormat();
        return cell.getValueForEdit2(numFormat);
    } else {
        var oRow = this.worksheet._getRowNoEmpty(this.bbox.r1);
        var oCol = this.worksheet._getColNoEmptyWithAll(this.bbox.c1);
        var xfs = null;
        if (null != oRow && null != oRow.xfs) {
            xfs = oRow.xfs.clone();
        } else {
            if (null != oCol && null != oCol.xfs) {
                xfs = oCol.xfs.clone();
            }
        }
        var oTempCell = new Cell(this.worksheet);
        oTempCell.create(xfs, this.getFirst());
        return oTempCell.getValueForEdit2();
    }
};
Range.prototype.getValueWithoutFormat = function () {
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        return cell.getValueWithoutFormat();
    } else {
        return "";
    }
};
Range.prototype.getValue = function () {
    return this.getValueWithoutFormat();
};
Range.prototype.getValueWithFormat = function () {
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        return cell.getValue();
    } else {
        return "";
    }
};
Range.prototype.getValue2 = function (dDigitsCount, fIsFitMeasurer) {
    var nRow0 = this.bbox.r1;
    var nCol0 = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
    if (null != cell) {
        return cell.getValue2(dDigitsCount, fIsFitMeasurer);
    } else {
        var oRow = this.worksheet._getRowNoEmpty(this.bbox.r1);
        var oCol = this.worksheet._getColNoEmptyWithAll(this.bbox.c1);
        var xfs = null;
        if (null != oRow && null != oRow.xfs) {
            xfs = oRow.xfs.clone();
        } else {
            if (null != oCol && null != oCol.xfs) {
                xfs = oCol.xfs.clone();
            }
        }
        var oTempCell = new Cell(this.worksheet);
        oTempCell.create(xfs, this.getFirst());
        return oTempCell.getValue2(dDigitsCount, fIsFitMeasurer);
    }
};
Range.prototype.getXfId = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.XfId) {
            return xfs.XfId;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.XfId) {
            return row.xfs.XfId;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.XfId) {
            return col.xfs.XfId;
        }
    }
    return g_oDefaultXfId;
};
Range.prototype.getStyleName = function () {
    var res = this.worksheet.workbook.CellStyles.getStyleNameByXfId(this.getXfId());
    return res || this.worksheet.workbook.CellStyles.getStyleNameByXfId(g_oDefaultXfId);
};
Range.prototype.getNumFormat = function () {
    return oNumFormatCache.get(this.getNumFormatStr());
};
Range.prototype.getNumFormatStr = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.num) {
            return xfs.num.f;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.num) {
            return row.xfs.num.f;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.num) {
            return col.xfs.num.f;
        }
    }
    return g_oDefaultNum.f;
};
Range.prototype.getNumFormatType = function () {
    return this.getNumFormat().getType();
};
Range.prototype.getFont = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font;
        }
    }
    return g_oDefaultFont;
};
Range.prototype.getFontname = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.fn;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.fn;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.fn;
        }
    }
    return g_oDefaultFont.fn;
};
Range.prototype.getFontsize = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.fs;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.fs;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.fs;
        }
    }
    return g_oDefaultFont.fs;
};
Range.prototype.getFontcolor = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.c;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.c;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.c;
        }
    }
    return g_oDefaultFont.c;
};
Range.prototype.getBold = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.b;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.b;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.b;
        }
    }
    return g_oDefaultFont.b;
};
Range.prototype.getItalic = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.i;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.i;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.i;
        }
    }
    return g_oDefaultFont.i;
};
Range.prototype.getUnderline = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.u;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.u;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.u;
        }
    }
    return g_oDefaultFont.u;
};
Range.prototype.getStrikeout = function (val) {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.s;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.s;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.s;
        }
    }
    return g_oDefaultFont.s;
};
Range.prototype.getFontAlign = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.font) {
            return xfs.font.va;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.font) {
            return row.xfs.font.va;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.font) {
            return col.xfs.font.va;
        }
    }
    return g_oDefaultFont.va;
};
Range.prototype.getQuotePrefix = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.QuotePrefix) {
            return xfs.QuotePrefix;
        }
    }
    return false;
};
Range.prototype.getAlignVertical = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs) {
            if (null != xfs.align) {
                return xfs.align.ver;
            } else {
                return g_oDefaultAlignAbs.ver;
            }
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.align) {
            return row.xfs.align.ver;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.align) {
            return col.xfs.align.ver;
        }
    }
    return g_oDefaultAlign.ver;
};
Range.prototype.getAlignHorizontal = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs) {
            if (null != xfs.align) {
                return xfs.align.hor;
            } else {
                return g_oDefaultAlignAbs.hor;
            }
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.align) {
            return row.xfs.align.hor;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.align) {
            return col.xfs.align.hor;
        }
    }
    return g_oDefaultAlign.hor;
};
Range.prototype.getAlignHorizontalByValue = function () {
    var align = this.getAlignHorizontal();
    if ("none" == align) {
        var nRow = this.bbox.r1;
        var nCol = this.bbox.c1;
        var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
        if (cell) {
            switch (cell.getType()) {
            case CellValueType.String:
                align = "left";
                break;
            case CellValueType.Bool:
                case CellValueType.Error:
                align = "center";
                break;
            default:
                if (this.getValueWithoutFormat()) {
                    var oNumFmt = this.getNumFormat();
                    if (true == oNumFmt.isTextFormat()) {
                        align = "left";
                    } else {
                        align = "right";
                    }
                } else {
                    align = "left";
                }
                break;
            }
        }
        if ("none" == align) {
            align = "left";
        }
    }
    return align;
};
Range.prototype.getFill = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.fill) {
            return xfs.fill.bg;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.fill) {
            return row.xfs.fill.bg;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.fill) {
            return col.xfs.fill.bg;
        }
    }
    return g_oDefaultFill.bg;
};
Range.prototype.getBorderSrc = function (_cell) {
    if (null == _cell) {
        _cell = this.getFirst();
    }
    var nRow = _cell.getRow0();
    var nCol = _cell.getCol0();
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs && null != xfs.border) {
            return xfs.border;
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.border) {
            return row.xfs.border;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.border) {
            return col.xfs.border;
        }
    }
    return g_oDefaultBorder;
};
Range.prototype.getBorder = function (_cell) {
    var oRes = this.getBorderSrc(_cell);
    if (null != oRes) {
        return oRes;
    } else {
        return g_oDefaultBorder;
    }
};
Range.prototype.getBorderFull = function () {
    var borders = this.getBorder(this.getFirst()).clone();
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    if (c_oAscBorderStyles.None === borders.l.s) {
        if (nCol > 1) {
            var left = this.getBorder(new CellAddress(nRow, nCol - 1, 0));
            if (c_oAscBorderStyles.None !== left.r.s) {
                borders.l = left.r;
            }
        }
    }
    if (c_oAscBorderStyles.None === borders.t.s) {
        if (nRow > 1) {
            var top = this.getBorder(new CellAddress(nRow - 1, nCol, 0));
            if (c_oAscBorderStyles.None !== top.b.s) {
                borders.t = top.b;
            }
        }
    }
    if (c_oAscBorderStyles.None === borders.r.s) {
        var right = this.getBorder(new CellAddress(nRow, nCol + 1, 0));
        if (c_oAscBorderStyles.None !== right.l.s) {
            borders.r = right.l;
        }
    }
    if (c_oAscBorderStyles.None === borders.b.s) {
        var bottom = this.getBorder(new CellAddress(nRow + 1, nCol, 0));
        if (c_oAscBorderStyles.None !== bottom.t.s) {
            borders.b = bottom.t;
        }
    }
    return borders;
};
Range.prototype.getShrinkToFit = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs) {
            if (null != xfs.align) {
                return xfs.align.shrink;
            } else {
                return g_oDefaultAlignAbs.shrink;
            }
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.align) {
            return row.xfs.align.shrink;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.align) {
            return col.xfs.align.shrink;
        }
    }
    return g_oDefaultAlign.shrink;
};
Range.prototype.getWrapByAlign = function (align) {
    return "justify" === align.hor ? true : align.wrap;
};
Range.prototype.getWrap = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs) {
            if (null != xfs.align) {
                return this.getWrapByAlign(xfs.align);
            } else {
                return this.getWrapByAlign(g_oDefaultAlignAbs);
            }
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.align) {
            return this.getWrapByAlign(row.xfs.align);
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.align) {
            return this.getWrapByAlign(col.xfs.align);
        }
    }
    return this.getWrapByAlign(g_oDefaultAlign);
};
Range.prototype.getAngle = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs) {
            if (null != xfs.align) {
                return angleFormatToInterface(xfs.align.angle);
            } else {
                return angleFormatToInterface(g_oDefaultAlignAbs.angle);
            }
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.align) {
            return angleFormatToInterface(row.xfs.align.angle);
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.align) {
            return angleFormatToInterface(col.xfs.align.angle);
        }
    }
    return angleFormatToInterface(g_oDefaultAlign.angle);
};
Range.prototype.getVerticalText = function () {
    var nRow = this.bbox.r1;
    var nCol = this.bbox.c1;
    var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
    if (null != cell) {
        var xfs = cell.getStyle();
        if (null != xfs) {
            if (null != xfs.align) {
                return g_nVerticalTextAngle == xfs.align.angle;
            } else {
                return g_nVerticalTextAngle == g_oDefaultAlignAbs.angle;
            }
        }
    } else {
        var row = this.worksheet._getRowNoEmpty(nRow);
        if (null != row && null != row.xfs && null != row.xfs.align) {
            return g_nVerticalTextAngle == row.xfs.align.angle;
        }
        var col = this.worksheet._getColNoEmptyWithAll(nCol);
        if (null != col && null != col.xfs && null != col.xfs.align) {
            return g_nVerticalTextAngle == col.xfs.align.angle;
        }
    }
    return g_nVerticalTextAngle == g_oDefaultAlign.angle;
};
Range.prototype.hasMerged = function () {
    var oThis = this;
    var aMerged = this.worksheet.mergeManager.get(this.bbox);
    if (aMerged.all.length > 0) {
        return aMerged.all[0].bbox;
    }
    return null;
};
Range.prototype.mergeOpen = function () {
    this.worksheet.mergeManager.add(this.bbox, 1);
};
Range.prototype.merge = function (type) {
    if (null == type) {
        type = c_oAscMergeOptions.Merge;
    }
    var oBBox = this.bbox;
    if (oBBox.r1 == oBBox.r2 && oBBox.c1 == oBBox.c2) {
        return;
    }
    History.Create_NewPoint();
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    if (this.hasMerged()) {
        this.unmerge();
        if (type == c_oAscMergeOptions.MergeCenter) {
            this.setAlignHorizontal("none");
            History.EndTransaction();
            return;
        }
    }
    var oLeftBorder = null;
    var oTopBorder = null;
    var oRightBorder = null;
    var oBottomBorder = null;
    var nRangeType = this._getRangeType(oBBox);
    if (c_oRangeType.Range == nRangeType) {
        var oThis = this;
        var fGetBorder = function (bRow, v1, v2, v3, type) {
            var oRes = null;
            for (var i = v1; i <= v2; ++i) {
                var bNeedDelete = true;
                var oCurCell;
                if (bRow) {
                    oCurCell = oThis.worksheet._getCellNoEmpty(v3, i);
                } else {
                    oCurCell = oThis.worksheet._getCellNoEmpty(i, v3);
                }
                if (null != oCurCell && null != oCurCell.xfs && null != oCurCell.xfs.border) {
                    var border = oCurCell.xfs.border;
                    var oBorderProp;
                    switch (type) {
                    case 1:
                        oBorderProp = border.l;
                        break;
                    case 2:
                        oBorderProp = border.t;
                        break;
                    case 3:
                        oBorderProp = border.r;
                        break;
                    case 4:
                        oBorderProp = border.b;
                        break;
                    }
                    if (false == oBorderProp.isEmpty()) {
                        if (null == oRes) {
                            oRes = oBorderProp;
                            bNeedDelete = false;
                        } else {
                            if (true == oRes.isEqual(oBorderProp)) {
                                bNeedDelete = false;
                            }
                        }
                    }
                }
                if (bNeedDelete) {
                    oRes = null;
                    break;
                }
            }
            return oRes;
        };
        oLeftBorder = fGetBorder(false, oBBox.r1, oBBox.r2, oBBox.c1, 1);
        oTopBorder = fGetBorder(true, oBBox.c1, oBBox.c2, oBBox.r1, 2);
        oRightBorder = fGetBorder(false, oBBox.r1, oBBox.r2, oBBox.c2, 3);
        oBottomBorder = fGetBorder(true, oBBox.c1, oBBox.c2, oBBox.r2, 4);
    } else {
        if (c_oRangeType.Row == nRangeType) {
            var oTopRow = this.worksheet._getRowNoEmpty(oBBox.r1);
            if (null != oTopRow && null != oTopRow.xfs && null != oTopRow.xfs.border && false == oTopRow.xfs.border.t.isEmpty()) {
                oTopBorder = oTopRow.xfs.border.t;
            }
            if (oBBox.r1 != oBBox.r2) {
                var oBottomRow = this.worksheet._getRowNoEmpty(oBBox.r2);
                if (null != oBottomRow && null != oBottomRow.xfs && null != oBottomRow.xfs.border && false == oBottomRow.xfs.border.b.isEmpty()) {
                    oBottomBorder = oBottomRow.xfs.border.b;
                }
            }
        } else {
            var oLeftCol = this.worksheet._getColNoEmptyWithAll(oBBox.c1);
            if (null != oLeftCol && null != oLeftCol.xfs && null != oLeftCol.xfs.border && false == oLeftCol.xfs.border.l.isEmpty()) {
                oLeftBorder = oLeftCol.xfs.border.l;
            }
            if (oBBox.c1 != oBBox.c2) {
                var oRightCol = this.worksheet._getColNoEmptyWithAll(oBBox.c2);
                if (null != oRightCol && null != oRightCol.xfs && null != oRightCol.xfs.border && false == oRightCol.xfs.border.r.isEmpty()) {
                    oRightBorder = oRightCol.xfs.border.r;
                }
            }
        }
    }
    var bFirst = true;
    var oThis = this;
    var oLeftTopCellStyle = null;
    var oFirstCellStyle = null;
    var oFirstCellValue = null;
    var oFirstCellRow = null;
    var oFirstCellCol = null;
    var oFirstCellHyperlink = null;
    this._setPropertyNoEmpty(null, null, function (cell, nRow0, nCol0, nRowStart, nColStart) {
        if (bFirst && false == cell.isEmptyText()) {
            bFirst = false;
            oFirstCellStyle = cell.getStyle();
            oFirstCellValue = cell.getValueData();
            oFirstCellRow = cell.oId.getRow0();
            oFirstCellCol = cell.oId.getCol0();
            var oCurHyp = oThis.worksheet.hyperlinkManager.getByCell(oFirstCellRow, oFirstCellCol);
            if (null != oCurHyp && oCurHyp.data.Ref.isOneCell()) {
                oFirstCellHyperlink = oCurHyp.data;
            }
        }
        if (nRow0 == nRowStart && nCol0 == nColStart) {
            oLeftTopCellStyle = cell.getStyle();
        }
        cell.setValue("");
    });
    var oTargetStyle = null;
    if (null != oFirstCellValue && null != oFirstCellRow && null != oFirstCellCol) {
        if (null != oFirstCellStyle) {
            oTargetStyle = oFirstCellStyle.clone();
        }
        var oLeftTopCell = this.worksheet._getCell(oBBox.r1, oBBox.c1);
        oLeftTopCell.setValueData(oFirstCellValue);
        if (null != oFirstCellHyperlink) {
            var oLeftTopRange = this.worksheet.getCell(new CellAddress(oBBox.r1, oBBox.c1, 0));
            oLeftTopRange.setHyperlink(oFirstCellHyperlink, true);
        }
    } else {
        if (null != oLeftTopCellStyle) {
            oTargetStyle = oLeftTopCellStyle.clone();
        }
    }
    if (null != oTargetStyle) {
        if (null != oTargetStyle.border) {
            oTargetStyle.border = null;
        }
    } else {
        if (null != oLeftBorder || null != oTopBorder || null != oRightBorder || null != oBottomBorder) {
            oTargetStyle = new CellXfs();
        }
    }
    var bEmptyStyle = true;
    var bEmptyBorder = true;
    var fSetProperty = this._setProperty;
    var nRangeType = this._getRangeType();
    if (c_oRangeType.All == nRangeType) {
        fSetProperty = this._setPropertyNoEmpty;
        oTargetStyle = null;
    }
    fSetProperty.call(this, function (row) {
        if (null == oTargetStyle) {
            row.setStyle(null);
        } else {
            var oNewStyle = oTargetStyle.clone();
            if (row.index == oBBox.r1 && null != oTopBorder) {
                oNewStyle.border = new Border();
                oNewStyle.border.t = oTopBorder.clone();
            } else {
                if (row.index == oBBox.r2 && null != oBottomBorder) {
                    oNewStyle.border = new Border();
                    oNewStyle.border.b = oBottomBorder.clone();
                }
            }
            row.setStyle(oNewStyle);
        }
    },
    function (col) {
        if (null == oTargetStyle) {
            col.setStyle(null);
        } else {
            var oNewStyle = oTargetStyle.clone();
            if (col.index == oBBox.c1 && null != oLeftBorder) {
                oNewStyle.border = new Border();
                oNewStyle.border.l = oLeftBorder.clone();
            } else {
                if (col.index == oBBox.c2 && null != oRightBorder) {
                    oNewStyle.border = new Border();
                    oNewStyle.border.r = oRightBorder.clone();
                }
            }
            col.setStyle(oNewStyle);
        }
    },
    function (cell, nRow, nCol, nRowStart, nColStart) {
        if (null == oTargetStyle) {
            cell.setStyle(null);
        } else {
            var oNewStyle = oTargetStyle.clone();
            if (oBBox.r1 == nRow && oBBox.c1 == nCol) {
                if (null != oLeftBorder || null != oTopBorder || (oBBox.r1 == oBBox.r2 && null != oBottomBorder) || (oBBox.c1 == oBBox.c2 && null != oRightBorder)) {
                    oNewStyle.border = new Border();
                    if (null != oLeftBorder) {
                        oNewStyle.border.l = oLeftBorder.clone();
                    }
                    if (null != oTopBorder) {
                        oNewStyle.border.t = oTopBorder.clone();
                    }
                    if (oBBox.r1 == oBBox.r2 && null != oBottomBorder) {
                        oNewStyle.border.b = oBottomBorder.clone();
                    }
                    if (oBBox.c1 == oBBox.c2 && null != oRightBorder) {
                        oNewStyle.border.r = oRightBorder.clone();
                    }
                }
            } else {
                if (oBBox.r1 == nRow && oBBox.c2 == nCol) {
                    if (null != oRightBorder || null != oTopBorder || (oBBox.r1 == oBBox.r2 && null != oBottomBorder)) {
                        oNewStyle.border = new Border();
                        if (null != oRightBorder) {
                            oNewStyle.border.r = oRightBorder.clone();
                        }
                        if (null != oTopBorder) {
                            oNewStyle.border.t = oTopBorder.clone();
                        }
                        if (oBBox.r1 == oBBox.r2 && null != oBottomBorder) {
                            oNewStyle.border.b = oBottomBorder.clone();
                        }
                    }
                } else {
                    if (oBBox.r2 == nRow && oBBox.c1 == nCol) {
                        if (null != oLeftBorder || null != oBottomBorder || (oBBox.c1 == oBBox.c2 && null != oRightBorder)) {
                            oNewStyle.border = new Border();
                            if (null != oLeftBorder) {
                                oNewStyle.border.l = oLeftBorder.clone();
                            }
                            if (null != oBottomBorder) {
                                oNewStyle.border.b = oBottomBorder.clone();
                            }
                            if (oBBox.c1 == oBBox.c2 && null != oRightBorder) {
                                oNewStyle.border.r = oRightBorder.clone();
                            }
                        }
                    } else {
                        if (oBBox.r2 == nRow && oBBox.c2 == nCol) {
                            if (null != oRightBorder || null != oBottomBorder) {
                                oNewStyle.border = new Border();
                                if (null != oRightBorder) {
                                    oNewStyle.border.r = oRightBorder.clone();
                                }
                                if (null != oBottomBorder) {
                                    oNewStyle.border.b = oBottomBorder.clone();
                                }
                            }
                        } else {
                            if (oBBox.r1 == nRow) {
                                if (null != oTopBorder || (oBBox.r1 == oBBox.r2 && null != oBottomBorder)) {
                                    oNewStyle.border = new Border();
                                    if (null != oTopBorder) {
                                        oNewStyle.border.t = oTopBorder.clone();
                                    }
                                    if (oBBox.r1 == oBBox.r2 && null != oBottomBorder) {
                                        oNewStyle.border.b = oBottomBorder.clone();
                                    }
                                }
                            } else {
                                if (oBBox.r2 == nRow) {
                                    if (null != oBottomBorder) {
                                        oNewStyle.border = new Border();
                                        oNewStyle.border.b = oBottomBorder.clone();
                                    }
                                } else {
                                    if (oBBox.c1 == nCol) {
                                        if (null != oLeftBorder || (oBBox.c1 == oBBox.c2 && null != oRightBorder)) {
                                            oNewStyle.border = new Border();
                                            if (null != oLeftBorder) {
                                                oNewStyle.border.l = oLeftBorder.clone();
                                            }
                                            if (oBBox.c1 == oBBox.c2 && null != oRightBorder) {
                                                oNewStyle.border.r = oRightBorder.clone();
                                            }
                                        }
                                    } else {
                                        if (oBBox.c2 == nCol) {
                                            if (null != oRightBorder) {
                                                oNewStyle.border = new Border();
                                                oNewStyle.border.r = oRightBorder.clone();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            cell.setStyle(oNewStyle);
        }
    });
    if (type == c_oAscMergeOptions.MergeCenter) {
        this.setAlignHorizontal("center");
    }
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        this.worksheet.mergeManager.add(this.bbox, 1);
    }
    History.EndTransaction();
};
Range.prototype.unmerge = function (bOnlyInRange) {
    History.Create_NewPoint();
    History.SetSelection(this.bbox.clone());
    History.StartTransaction();
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        this.worksheet.mergeManager.remove(this.bbox, null);
    }
    History.EndTransaction();
};
Range.prototype._getHyperlinks = function () {
    var nRangeType = this._getRangeType();
    var result = [];
    var oThis = this;
    if (c_oRangeType.Range == nRangeType) {
        var oTempRows = {};
        var fAddToTempRows = function (oTempRows, bbox, data) {
            if (null != bbox) {
                for (var i = bbox.r1; i <= bbox.r2; i++) {
                    var row = oTempRows[i];
                    if (null == row) {
                        row = {};
                        oTempRows[i] = row;
                    }
                    for (var j = bbox.c1; j <= bbox.c2; j++) {
                        var cell = row[j];
                        if (null == cell) {
                            row[j] = data;
                        }
                    }
                }
            }
        };
        var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
        for (var i = 0, length = aHyperlinks.all.length; i < length; i++) {
            var hyp = aHyperlinks.all[i];
            var hypBBox = hyp.bbox.intersectionSimple(this.bbox);
            fAddToTempRows(oTempRows, hypBBox, hyp.data);
            var aMerged = this.worksheet.mergeManager.get(hyp.bbox);
            for (var j = 0, length2 = aMerged.all.length; j < length2; j++) {
                var merge = aMerged.all[j];
                var mergeBBox = merge.bbox.intersectionSimple(this.bbox);
                fAddToTempRows(oTempRows, mergeBBox, hyp.data);
            }
        }
        for (var i in oTempRows) {
            var nRowIndex = i - 0;
            var row = oTempRows[i];
            for (var j in row) {
                var nColIndex = j - 0;
                var oCurHyp = row[j];
                result.push({
                    hyperlink: oCurHyp,
                    col: nColIndex,
                    row: nRowIndex
                });
            }
        }
    }
    return result;
};
Range.prototype.getHyperlink = function () {
    var aHyperlinks = this._getHyperlinks();
    if (null != aHyperlinks && aHyperlinks.length > 0) {
        return aHyperlinks[0].hyperlink;
    }
    return null;
};
Range.prototype.getHyperlinks = function () {
    return this._getHyperlinks();
};
Range.prototype.setHyperlinkOpen = function (val) {
    if (null != val && false == val.isValid()) {
        return;
    }
    this.worksheet.hyperlinkManager.add(val.Ref.getBBox0(), val);
};
Range.prototype.setHyperlink = function (val, bWithoutStyle) {
    if (null != val && false == val.isValid()) {
        return;
    }
    var bExist = false;
    var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
    for (var i = 0, length = aHyperlinks.all.length; i < length; i++) {
        var hyp = aHyperlinks.all[i];
        if (hyp.data.isEqual(val)) {
            bExist = true;
            break;
        }
    }
    if (false == bExist) {
        var oThis = this;
        History.Create_NewPoint();
        History.SetSelection(this.bbox.clone());
        History.StartTransaction();
        if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
            for (var i = 0, length = aHyperlinks.all.length; i < length; i++) {
                var hyp = aHyperlinks.all[i];
                if (hyp.bbox.isEqual(this.bbox)) {
                    this.worksheet.hyperlinkManager.remove(hyp.bbox, hyp);
                }
            }
        }
        if (true != bWithoutStyle) {
            var oHyperlinkFont = new Font();
            oHyperlinkFont.fn = this.worksheet.workbook.getDefaultFont();
            oHyperlinkFont.fs = this.worksheet.workbook.getDefaultSize();
            oHyperlinkFont.u = "single";
            oHyperlinkFont.c = g_oColorManager.getThemeColor(g_nColorHyperlink);
            this.setFont(oHyperlinkFont);
        }
        if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
            this.worksheet.hyperlinkManager.add(val.Ref.getBBox0(), val);
        }
        History.EndTransaction();
    }
};
Range.prototype.removeHyperlink = function (val) {
    var bbox = this.bbox;
    var elem = null;
    if (null != val) {
        bbox = val.Ref.getBBox0();
        elem = new RangeDataManagerElem(bbox, val);
    }
    History.Create_NewPoint();
    History.SetSelection(bbox.clone());
    History.StartTransaction();
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        this.worksheet.hyperlinkManager.remove(bbox, elem);
    }
    History.EndTransaction();
};
Range.prototype.deleteCellsShiftUp = function () {
    return this._shiftUpDown(true);
};
Range.prototype.addCellsShiftBottom = function () {
    return this._shiftUpDown(false);
};
Range.prototype.addCellsShiftRight = function () {
    return this._shiftLeftRight(false);
};
Range.prototype.deleteCellsShiftLeft = function () {
    return this._shiftLeftRight(true);
};
Range.prototype._shiftLeftRight = function (bLeft) {
    lockDraw(this.worksheet.workbook);
    var oBBox = this.bbox;
    var nWidth = oBBox.c2 - oBBox.c1 + 1;
    var nRangeType = this._getRangeType(oBBox);
    if (c_oRangeType.Range != nRangeType && c_oRangeType.Col != nRangeType) {
        return false;
    }
    var mergeManager = this.worksheet.mergeManager;
    History.Create_NewPoint();
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        var oShiftGet = mergeManager.shiftGet(this.bbox, true);
        var aMerged = oShiftGet.elems;
        if (null != aMerged.outer && aMerged.outer.length > 0) {
            var bChanged = false;
            for (var i = 0, length = aMerged.outer.length; i < length; i++) {
                var elem = aMerged.outer[i];
                if (! (elem.bbox.c1 < oShiftGet.bbox.c1 && oShiftGet.bbox.r1 <= elem.bbox.r1 && elem.bbox.r2 <= oShiftGet.bbox.r2)) {
                    mergeManager.remove(elem.bbox, elem);
                    bChanged = true;
                }
            }
            if (bChanged) {
                oShiftGet = null;
            }
        }
    }
    if (bLeft) {
        if (c_oRangeType.Range == nRangeType) {
            this.worksheet._shiftCellsLeft(oBBox);
        } else {
            this.worksheet._removeCols(oBBox.c1, oBBox.c2);
        }
    } else {
        if (c_oRangeType.Range == nRangeType) {
            this.worksheet._shiftCellsRight(oBBox);
        } else {
            this.worksheet._insertColsBefore(oBBox.c1, nWidth);
        }
    }
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        mergeManager.shift(this.bbox, !bLeft, true, oShiftGet);
        this.worksheet.hyperlinkManager.shift(this.bbox, !bLeft, true);
    }
    History.EndTransaction();
    buildRecalc(this.worksheet.workbook);
    unLockDraw(this.worksheet.workbook);
    return true;
};
Range.prototype._shiftUpDown = function (bUp) {
    var oBBox = this.bbox;
    var nHeight = oBBox.r2 - oBBox.r1 + 1;
    var nRangeType = this._getRangeType(oBBox);
    if (c_oRangeType.Range != nRangeType && c_oRangeType.Row != nRangeType) {
        return false;
    }
    var mergeManager = this.worksheet.mergeManager;
    History.Create_NewPoint();
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        var oShiftGet = mergeManager.shiftGet(this.bbox, false);
        var aMerged = oShiftGet.elems;
        if (null != aMerged.outer && aMerged.outer.length > 0) {
            var bChanged = false;
            for (var i = 0, length = aMerged.outer.length; i < length; i++) {
                var elem = aMerged.outer[i];
                if (! (elem.bbox.r1 < oShiftGet.bbox.r1 && oShiftGet.bbox.c1 <= elem.bbox.c1 && elem.bbox.c2 <= oShiftGet.bbox.c2)) {
                    mergeManager.remove(elem.bbox, elem);
                    bChanged = true;
                }
            }
            if (bChanged) {
                oShiftGet = null;
            }
        }
    }
    if (bUp) {
        if (c_oRangeType.Range == nRangeType) {
            this.worksheet._shiftCellsUp(oBBox);
        } else {
            this.worksheet._removeRows(oBBox.r1, oBBox.r2);
        }
    } else {
        if (c_oRangeType.Range == nRangeType) {
            this.worksheet._shiftCellsBottom(oBBox);
        } else {
            this.worksheet._insertRowsBefore(oBBox.r1, nHeight);
        }
    }
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        mergeManager.shift(this.bbox, !bUp, false, oShiftGet);
        this.worksheet.hyperlinkManager.shift(this.bbox, !bUp, false);
    }
    History.EndTransaction();
    return true;
};
Range.prototype.setOffset = function (offset) {
    this.bbox.c1 += offset.offsetCol;
    if (this.bbox.c1 < 0) {
        this.bbox.c1 = 0;
    }
    this.bbox.r1 += offset.offsetRow;
    if (this.bbox.r1 < 0) {
        this.bbox.r1 = 0;
    }
    this.bbox.c2 += offset.offsetCol;
    if (this.bbox.c2 < 0) {
        this.bbox.c2 = 0;
    }
    this.bbox.r2 += offset.offsetRow;
    if (this.bbox.r2 < 0) {
        this.bbox.r2 = 0;
    }
    this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
    this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
};
Range.prototype.setOffsetFirst = function (offset) {
    this.bbox.c1 += offset.offsetCol;
    if (this.bbox.c1 < 0) {
        this.bbox.c1 = 0;
    }
    this.bbox.r1 += offset.offsetRow;
    if (this.bbox.r1 < 0) {
        this.bbox.r1 = 0;
    }
    this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
};
Range.prototype.setOffsetLast = function (offset) {
    this.bbox.c2 += offset.offsetCol;
    if (this.bbox.c2 < 0) {
        this.bbox.c2 = 0;
    }
    this.bbox.r2 += offset.offsetRow;
    if (this.bbox.r2 < 0) {
        this.bbox.r2 = 0;
    }
    this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
};
Range.prototype.intersect = function (range) {
    var oBBox1 = this.bbox;
    var oBBox2 = range.bbox;
    var r1 = Math.max(oBBox1.r1, oBBox2.r1);
    var c1 = Math.max(oBBox1.c1, oBBox2.c1);
    var r2 = Math.min(oBBox1.r2, oBBox2.r2);
    var c2 = Math.min(oBBox1.c2, oBBox2.c2);
    if (r1 <= r2 && c1 <= c2) {
        return this.worksheet.getRange3(r1, c1, r2, c2);
    }
    return null;
};
Range.prototype.cleanCache = function () {
    this._setPropertyNoEmpty(null, null, function (cell, nRow0, nCol0, nRowStart, nColStart) {
        cell.cleanCache();
    });
};
Range.prototype.cleanFormat = function () {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    this.unmerge();
    var oThis = this;
    this._setPropertyNoEmpty(function (row) {
        row.setStyle(null);
    },
    function (col) {
        col.setStyle(null);
    },
    function (cell, nRow0, nCol0, nRowStart, nColStart) {
        cell.setStyle(null);
    });
    History.EndTransaction();
};
Range.prototype.cleanText = function () {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    var oThis = this;
    this._setPropertyNoEmpty(null, null, function (cell, nRow0, nCol0, nRowStart, nColStart) {
        cell.setValue("");
    });
    History.EndTransaction();
};
Range.prototype.cleanAll = function () {
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    this.unmerge();
    var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
    for (var i = 0, length = aHyperlinks.inner.length; i < length; ++i) {
        this.removeHyperlink(aHyperlinks.inner[i].data);
    }
    var oThis = this;
    this._setPropertyNoEmpty(function (row) {
        row.setStyle(null);
    },
    function (col) {
        col.setStyle(null);
    },
    function (cell, nRow0, nCol0, nRowStart, nColStart) {
        oThis.worksheet._removeCell(nRow0, nCol0);
    });
    buildRecalc(this.worksheet.workbook);
    History.EndTransaction();
};
Range.prototype.sort = function (nOption, nStartCol) {
    lockDraw(this.worksheet.workbook);
    if (null != this.hasMerged()) {
        return null;
    }
    var oRes = null;
    var oThis = this;
    var bAscent = false;
    if (nOption == c_oAscSortOptions.Ascending) {
        bAscent = true;
    }
    var nRowFirst0 = this.bbox.r1;
    var nRowLast0 = this.bbox.r2;
    var nColFirst0 = this.bbox.c1;
    var nColLast0 = this.bbox.c2;
    var bWholeCol = false;
    var bWholeRow = false;
    if (0 == nRowFirst0 && gc_nMaxRow0 == nRowLast0) {
        bWholeCol = true;
    }
    if (0 == nColFirst0 && gc_nMaxCol0 == nColLast0) {
        bWholeRow = true;
    }
    var oRangeCol = this.worksheet.getRange(new CellAddress(nRowFirst0, nStartCol, 0), new CellAddress(nRowLast0, nStartCol, 0));
    var nLastRow0 = 0;
    var nLastCol0 = nColLast0;
    if (true == bWholeRow) {
        nLastCol0 = 0;
        this._foreachRowNoEmpty(function () {},
        function (cell) {
            var nCurCol0 = cell.oId.getCol0();
            if (nCurCol0 > nLastCol0) {
                nLastCol0 = nCurCol0;
            }
        });
    }
    var aSortElems = new Array();
    var aHiddenRow = new Object();
    var fAddSortElems = function (oCell, nRow0, nCol0, nRowStart0, nColStart0) {
        var row = oThis.worksheet._getRowNoEmpty(nRow0);
        if (null != row) {
            if (true == row.hd) {
                aHiddenRow[nRow0] = 1;
            } else {
                if (nLastRow0 < nRow0) {
                    nLastRow0 = nRow0;
                }
                var val = oCell.getValueWithoutFormat();
                var nNumber = null;
                var sText = null;
                if ("" != val) {
                    var nVal = val - 0;
                    if (nVal == val) {
                        nNumber = nVal;
                    } else {
                        sText = val;
                    }
                    aSortElems.push({
                        row: nRow0,
                        num: nNumber,
                        text: sText
                    });
                }
            }
        }
    };
    if (nColFirst0 == nStartCol) {
        while (0 == aSortElems.length && nStartCol <= nLastCol0) {
            if (false == bWholeCol) {
                oRangeCol._foreachNoEmpty(fAddSortElems);
            } else {
                oRangeCol._foreachColNoEmpty(null, fAddSortElems);
            }
            if (0 == aSortElems.length) {
                nStartCol++;
                oRangeCol = this.worksheet.getRange(new CellAddress(nRowFirst0, nStartCol, 0), new CellAddress(nRowLast0, nStartCol, 0));
            }
        }
    } else {
        if (false == bWholeCol) {
            oRangeCol._foreachNoEmpty(fAddSortElems);
        } else {
            oRangeCol._foreachColNoEmpty(null, fAddSortElems);
        }
    }
    function strcmp(str1, str2) {
        return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
    }
    aSortElems.sort(function (a, b) {
        var res = 0;
        if (null != a.text) {
            if (null != b.text) {
                res = strcmp(a.text, b.text);
            } else {
                res = 1;
            }
        } else {
            if (null != a.num) {
                if (null != b.num) {
                    res = a.num - b.num;
                } else {
                    res = -1;
                }
            }
        }
        if (0 == res) {
            res = a.row - b.row;
        } else {
            if (!bAscent) {
                res = -res;
            }
        }
        return res;
    });
    var aSortData = new Array();
    var nHiddenCount = 0;
    var oFromArray = new Object();
    var nRowMax = 0;
    var nRowMin = gc_nMaxRow0;
    var nToMax = 0;
    for (var i = 0, length = aSortElems.length; i < length; ++i) {
        var item = aSortElems[i];
        var nNewIndex = i + nRowFirst0 + nHiddenCount;
        while (null != aHiddenRow[nNewIndex]) {
            nHiddenCount++;
            nNewIndex = i + nRowFirst0 + nHiddenCount;
        }
        var oNewElem = new UndoRedoData_FromToRowCol(true, item.row, nNewIndex);
        oFromArray[item.row] = 1;
        if (nRowMax < item.row) {
            nRowMax = item.row;
        }
        if (nRowMax < nNewIndex) {
            nRowMax = nNewIndex;
        }
        if (nRowMin > item.row) {
            nRowMin = item.row;
        }
        if (nRowMin > nNewIndex) {
            nRowMin = nNewIndex;
        }
        if (nToMax < nNewIndex) {
            nToMax = nNewIndex;
        }
        if (oNewElem.from != oNewElem.to) {
            aSortData.push(oNewElem);
        }
    }
    if (aSortData.length > 0) {
        for (var i = nRowMin; i <= nRowMax; ++i) {
            if (null == oFromArray[i] && null == aHiddenRow[i]) {
                var nFrom = i;
                var nTo = ++nToMax;
                while (null != aHiddenRow[nTo]) {
                    nTo = ++nToMax;
                }
                if (nFrom != nTo) {
                    var oNewElem = new UndoRedoData_FromToRowCol(true, nFrom, nTo);
                    aSortData.push(oNewElem);
                }
            }
        }
        History.Create_NewPoint();
        History.SetSelection(new Asc.Range(nColFirst0, nRowFirst0, nLastCol0, nLastRow0));
        var oUndoRedoBBox = new UndoRedoData_BBox({
            r1: nRowFirst0,
            c1: nColFirst0,
            r2: nLastRow0,
            c2: nLastCol0
        });
        oRes = new UndoRedoData_SortData(oUndoRedoBBox, aSortData);
        History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Sort, this.worksheet.getId(), new Asc.Range(0, nRowFirst0, gc_nMaxCol0, nLastRow0), oRes);
        this._sortByArray(oUndoRedoBBox, aSortData, false);
    }
    buildRecalc(this.worksheet.workbook, true);
    unLockDraw(this.worksheet.workbook);
    return oRes;
};
Range.prototype._sortByArray = function (oBBox, aSortData, bUndo) {
    var rec = {
        length: 0
    };
    var oSortedIndexes = new Object();
    for (var i = 0, length = aSortData.length; i < length; ++i) {
        var item = aSortData[i];
        var nFrom = item.from;
        var nTo = item.to;
        if (bUndo) {
            nFrom = item.to;
            nTo = item.from;
        }
        oSortedIndexes[nFrom] = nTo;
    }
    var aSortedHyperlinks = new Array();
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
        for (var i = 0, length = aHyperlinks.inner.length; i < length; i++) {
            var elem = aHyperlinks.inner[i];
            var hyp = elem.data;
            if (hyp.Ref.isOneCell()) {
                var nFrom = elem.bbox.r1;
                var nTo = oSortedIndexes[nFrom];
                if (null != nTo) {
                    var oTempBBox = hyp.Ref.getBBox0();
                    this.worksheet.hyperlinkManager.remove(oTempBBox, new RangeDataManagerElem(oTempBBox, hyp));
                    var oNewHyp = hyp.clone();
                    oNewHyp.Ref.setOffset({
                        offsetCol: 0,
                        offsetRow: nTo - nFrom
                    });
                    aSortedHyperlinks.push(oNewHyp);
                }
            }
        }
    }
    var nColFirst0 = oBBox.c1;
    var nLastCol0 = oBBox.c2;
    for (var i = nColFirst0; i <= nLastCol0; ++i) {
        var oTempCellsTo = new Object();
        for (var j in oSortedIndexes) {
            var nIndexFrom = j - 0;
            var nIndexTo = oSortedIndexes[j];
            var shift = nIndexTo - nIndexFrom;
            var rowFrom = this.worksheet._getRow(nIndexFrom);
            var rowTo = this.worksheet._getRow(nIndexTo);
            var oCurCell;
            var oTempCell = oTempCellsTo[nIndexFrom];
            if (oTempCellsTo.hasOwnProperty(nIndexFrom)) {
                oCurCell = oTempCell;
            } else {
                oCurCell = rowFrom.c[i];
            }
            oTempCellsTo[nIndexTo] = rowTo.c[i];
            if (null != oCurCell) {
                var lastName = oCurCell.getName();
                oCurCell.moveVer(shift);
                rowTo.c[i] = oCurCell;
                var sNewName = oCurCell.getName();
                if (oCurCell.sFormula) {
                    oCurCell.setFormula(oCurCell.formulaParsed.changeOffset({
                        offsetCol: 0,
                        offsetRow: shift
                    }).assemble());
                    this.worksheet.workbook.dependencyFormulas.deleteMasterNodes(this.worksheet.Id, lastName);
                    delete this.worksheet.workbook.cwf[this.worksheet.Id].cells[lastName];
                    if (!arrRecalc[this.worksheet.getId()]) {
                        arrRecalc[this.worksheet.getId()] = {};
                    }
                    arrRecalc[this.worksheet.getId()][sNewName] = sNewName;
                } else {}
            } else {
                if (null != rowTo.c[i]) {
                    delete rowTo.c[i];
                    var sNewName = (new CellAddress(nIndexTo, i, 0)).getID();
                    if (!arrRecalc[this.worksheet.getId()]) {
                        arrRecalc[this.worksheet.getId()] = {};
                    }
                    arrRecalc[this.worksheet.getId()][sNewName] = sNewName;
                }
            }
        }
    }
    if (false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges) {
        if (aSortedHyperlinks.length > 0) {
            for (var i = 0, length = aSortedHyperlinks.length; i < length; i++) {
                var hyp = aSortedHyperlinks[i];
                this.worksheet.hyperlinkManager.add(hyp.Ref.getBBox0(), hyp);
            }
        }
    }
};
Range.prototype.promote = function (bCtrl, bVertical, nIndex) {
    var oBBox = this.bbox;
    var nWidth = oBBox.c2 - oBBox.c1 + 1;
    var nHeight = oBBox.r2 - oBBox.r1 + 1;
    var bWholeCol = false;
    var bWholeRow = false;
    if (0 == oBBox.r1 && gc_nMaxRow0 == oBBox.r2) {
        bWholeCol = true;
    }
    if (0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2) {
        bWholeRow = true;
    }
    if ((bWholeCol && bWholeRow) || (true == bVertical && bWholeCol) || (false == bVertical && bWholeRow)) {
        return;
    }
    var oPromoteRange = null;
    if (bVertical) {
        if (nHeight < nIndex) {
            oPromoteRange = this.worksheet.getRange3(oBBox.r2 + 1, oBBox.c1, oBBox.r2 + nIndex - nHeight, oBBox.c2);
        } else {
            if (nIndex < 0) {
                oPromoteRange = this.worksheet.getRange3(oBBox.r1 - 1, oBBox.c1, oBBox.r1 + nIndex, oBBox.c2);
            }
        }
    } else {
        if (nWidth < nIndex) {
            oPromoteRange = this.worksheet.getRange3(oBBox.r1, oBBox.c2 + 1, oBBox.r2, oBBox.c2 + nIndex - nWidth);
        } else {
            if (nIndex < 0) {
                oPromoteRange = this.worksheet.getRange3(oBBox.r1, oBBox.c1 - 1, oBBox.r2, oBBox.c1 + nIndex);
            }
        }
    }
    if (null != oPromoteRange && oPromoteRange.hasMerged()) {
        return;
    }
    lockDraw(this.worksheet.workbook);
    History.Create_NewPoint();
    var recalcArr = [];
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
    History.StartTransaction();
    if ((true == bVertical && 1 == nHeight) || (false == bVertical && 1 == nWidth)) {
        bCtrl = !bCtrl;
    }
    var fFinishSection = function (param, oPromoteHelper) {
        if (null != param && null != param.prefix) {
            if (false == oPromoteHelper.isOnlyIntegerSequence()) {
                param.valid = false;
                oPromoteHelper.removeLast();
            }
        }
        oPromoteHelper.finishSection();
    };
    if (true == bVertical) {
        var nLastCol = oBBox.c2;
        if (bWholeRow) {
            nLastCol = 0;
            this._foreachRowNoEmpty(function () {},
            function (cell) {
                var nCurCol0 = cell.oId.getCol0();
                if (nCurCol0 > nLastCol0) {
                    nLastCol0 = nCurCol0;
                }
            });
        }
        if (nIndex >= 0 && nHeight > nIndex) {
            for (var i = oBBox.c1; i <= nLastCol; ++i) {
                for (var j = oBBox.r1 + nIndex; j <= oBBox.r2; ++j) {
                    var oCurCell = this.worksheet._getCellNoEmpty(j, i);
                    if (null != oCurCell) {
                        oCurCell.setValue("");
                    }
                }
            }
        } else {
            for (var i = oBBox.c1; i <= nLastCol; ++i) {
                var aCells = new Array();
                var oPromoteHelper = new PromoteHelper();
                var oDigParams = null;
                for (var j = oBBox.r1; j <= oBBox.r2; ++j) {
                    var oCurCell = this.worksheet._getCellNoEmpty(j, i);
                    var nVal = null,
                    nF = null;
                    var sCurPrefix = null;
                    if (null != oCurCell) {
                        if (!oCurCell.sFormula) {
                            var nType = oCurCell.getType();
                            if (CellValueType.Number == nType || CellValueType.String == nType) {
                                var sValue = oCurCell.getValueWithoutFormat();
                                if ("" != sValue) {
                                    if (CellValueType.Number == nType) {
                                        nVal = sValue - 0;
                                    } else {
                                        var nEndIndex = sValue.length;
                                        for (var k = sValue.length - 1; k >= 0; --k) {
                                            var sCurChart = sValue[k];
                                            if ("0" <= sCurChart && sCurChart <= "9") {
                                                nEndIndex--;
                                            } else {
                                                break;
                                            }
                                        }
                                        if (sValue.length != nEndIndex) {
                                            sCurPrefix = sValue.substring(0, nEndIndex);
                                            nVal = sValue.substring(nEndIndex) - 0;
                                        }
                                    }
                                    if (null != nVal) {
                                        if (null == oDigParams) {
                                            oDigParams = {
                                                valid: true,
                                                prefix: sCurPrefix
                                            };
                                        } else {
                                            if (sCurPrefix != oDigParams.prefix) {
                                                fFinishSection(oDigParams, oPromoteHelper);
                                                oDigParams = {
                                                    valid: true,
                                                    prefix: sCurPrefix
                                                };
                                            }
                                        }
                                        oPromoteHelper.add(nVal);
                                    } else {
                                        fFinishSection(oDigParams, oPromoteHelper);
                                        oDigParams = null;
                                    }
                                }
                            }
                        } else {
                            fFinishSection(oDigParams, oPromoteHelper);
                            oDigParams = null;
                            nF = true;
                        }
                    }
                    if (null == nVal) {
                        aCells.push({
                            digparams: null,
                            cell: oCurCell,
                            formula: nF
                        });
                    } else {
                        aCells.push({
                            digparams: oDigParams,
                            cell: oCurCell,
                            formula: nF
                        });
                    }
                }
                fFinishSection(oDigParams, oPromoteHelper);
                oPromoteHelper.finishAdd();
                var bExistDigit = false;
                if (false == bCtrl && false == oPromoteHelper.isEmpty()) {
                    bExistDigit = true;
                    oPromoteHelper.calc();
                }
                var nCellsLength = aCells.length;
                var nCellsIndex;
                var nStart;
                var nEnd;
                var nDj;
                var nDCellsIndex;
                var fCondition;
                if (nIndex > 0) {
                    nStart = oBBox.r2 + 1;
                    nEnd = oBBox.r2 + (nIndex - nHeight + 1);
                    nCellsIndex = 0;
                    nDj = 1;
                    nDCellsIndex = 1;
                    fCondition = function (j, nEnd) {
                        return j <= nEnd;
                    };
                } else {
                    oPromoteHelper.reverse();
                    nStart = oBBox.r1 - 1;
                    nEnd = oBBox.r1 + nIndex;
                    if (nEnd < 0) {
                        nEnd = 0;
                    }
                    nCellsIndex = nCellsLength - 1;
                    nDj = -1;
                    nDCellsIndex = -1;
                    fCondition = function (j, nEnd) {
                        return j >= nEnd;
                    };
                }
                for (var j = nStart; fCondition(j, nEnd); j += nDj) {
                    var oCurItem = aCells[nCellsIndex];
                    var oCurCell = this.worksheet._getCellNoEmpty(j, i);
                    if (null != oCurCell) {
                        this.worksheet._removeCell(j, i);
                    }
                    if (null != oCurItem.cell) {
                        var oCopyCell = this.worksheet._getCell(j, i);
                        oCopyCell.setStyle(oCurItem.cell.getStyle());
                        oCopyCell.setType(oCurItem.cell.getType());
                        if (bExistDigit && null != oCurItem.digparams && true == oCurItem.digparams.valid) {
                            var dNewValue = oPromoteHelper.getNext();
                            var sVal = "";
                            if (null != oCurItem.digparams.prefix) {
                                sVal += oCurItem.digparams.prefix;
                            }
                            sVal += dNewValue;
                            oCopyCell.setValue(sVal);
                        } else {
                            if (!oCurItem.formula) {
                                var DataOld = oCopyCell.getValueData();
                                oCopyCell.oValue = oCurItem.cell.oValue.clone(oCopyCell);
                                var DataNew = oCopyCell.getValueData();
                                if (false == DataOld.isEqual(DataNew)) {
                                    History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.worksheet.getId(), new Asc.Range(0, oCopyCell.oId.getRow0(), gc_nMaxCol0, oCopyCell.oId.getRow0()), new UndoRedoData_CellSimpleData(oCopyCell.oId.getRow0(), oCopyCell.oId.getCol0(), DataOld, DataNew));
                                }
                                if (!arrRecalc[this.worksheet.getId()]) {
                                    arrRecalc[this.worksheet.getId()] = {};
                                }
                                arrRecalc[this.worksheet.getId()][oCopyCell.getName()] = oCopyCell.getName();
                                this.worksheet.workbook.needRecalc[getVertexId(this.worksheet.getId(), oCopyCell.getName())] = [this.worksheet.getId(), oCopyCell.getName()];
                                if (this.worksheet.workbook.needRecalc.length < 0) {
                                    this.worksheet.workbook.needRecalc.length = 0;
                                }
                                this.worksheet.workbook.needRecalc.length++;
                            } else {
                                var assemb;
                                var _p_ = new parserFormula(oCurItem.cell.sFormula, oCopyCell.getName(), this.worksheet);
                                if (_p_.parse()) {
                                    assemb = _p_.changeOffset(oCopyCell.getOffset2(oCurItem.cell.getName())).assemble();
                                    oCopyCell.setValue("=" + assemb);
                                }
                                this.worksheet.workbook.needRecalc[getVertexId(this.worksheet.getId(), oCopyCell.getName())] = [this.worksheet.getId(), oCopyCell.getName()];
                                if (this.worksheet.workbook.needRecalc.length < 0) {
                                    this.worksheet.workbook.needRecalc.length = 0;
                                }
                                this.worksheet.workbook.needRecalc.length++;
                            }
                        }
                    }
                    nCellsIndex += nDCellsIndex;
                    if (nDCellsIndex > 0 && nCellsIndex >= nCellsLength) {
                        nCellsIndex = 0;
                    } else {
                        if (nCellsIndex < 0) {
                            nCellsIndex = nCellsLength - 1;
                        }
                    }
                }
            }
        }
    } else {
        var nLastRow = oBBox.r2;
        if (bWholeCol) {
            nLastRow = 0;
            this._foreachColNoEmpty(function () {},
            function (cell) {
                var nCurRow0 = cell.oId.getRow0();
                if (nCurRow0 > nLastRow) {
                    nLastRow = nCurRow0;
                }
            });
        }
        if (nIndex >= 0 && nWidth > nIndex) {
            for (var i = oBBox.r1; i <= nLastRow; ++i) {
                for (var j = oBBox.c1 + nIndex; j <= oBBox.c2; ++j) {
                    var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                    if (null != oCurCell) {
                        oCurCell.setValue("");
                    }
                }
            }
        } else {
            for (var i = oBBox.r1; i <= nLastRow; ++i) {
                var aCells = new Array();
                var oPromoteHelper = new PromoteHelper();
                var oDigParams = null;
                for (var j = oBBox.c1; j <= oBBox.c2; ++j) {
                    var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                    var nVal = null,
                    nF = null;
                    var sCurPrefix = null;
                    if (null != oCurCell) {
                        if (!oCurCell.sFormula) {
                            var nType = oCurCell.getType();
                            if (CellValueType.Number == nType || CellValueType.String == nType) {
                                var sValue = oCurCell.getValueWithoutFormat();
                                if ("" != sValue) {
                                    if (CellValueType.Number == nType) {
                                        nVal = sValue - 0;
                                    } else {
                                        var nEndIndex = sValue.length;
                                        for (var k = sValue.length - 1; k >= 0; --k) {
                                            var sCurChart = sValue[k];
                                            if ("0" <= sCurChart && sCurChart <= "9") {
                                                nEndIndex--;
                                            } else {
                                                break;
                                            }
                                        }
                                        if (sValue.length != nEndIndex) {
                                            sCurPrefix = sValue.substring(0, nEndIndex);
                                            nVal = sValue.substring(nEndIndex) - 0;
                                        }
                                    }
                                    if (null != nVal) {
                                        if (null == oDigParams) {
                                            oDigParams = {
                                                valid: true,
                                                prefix: sCurPrefix
                                            };
                                        } else {
                                            if (sCurPrefix != oDigParams.prefix) {
                                                fFinishSection(oDigParams, oPromoteHelper);
                                                oDigParams = {
                                                    valid: true,
                                                    prefix: sCurPrefix
                                                };
                                            }
                                        }
                                        oPromoteHelper.add(nVal);
                                    } else {
                                        fFinishSection(oDigParams, oPromoteHelper);
                                        oDigParams = null;
                                    }
                                }
                            }
                        } else {
                            fFinishSection(oDigParams, oPromoteHelper);
                            oDigParams = null;
                            nF = true;
                        }
                    }
                    if (null == nVal) {
                        aCells.push({
                            digparams: null,
                            cell: oCurCell,
                            formula: nF
                        });
                    } else {
                        aCells.push({
                            digparams: oDigParams,
                            cell: oCurCell,
                            formula: nF
                        });
                    }
                }
                fFinishSection(oDigParams, oPromoteHelper);
                oPromoteHelper.finishAdd();
                var bExistDigit = false;
                if (false == bCtrl && false == oPromoteHelper.isEmpty()) {
                    bExistDigit = true;
                    oPromoteHelper.calc();
                }
                var nCellsLength = aCells.length;
                var nCellsIndex;
                var nStart;
                var nEnd;
                var nDj;
                var nDCellsIndex;
                var fCondition;
                if (nIndex > 0) {
                    nStart = oBBox.c2 + 1;
                    nEnd = oBBox.c2 + (nIndex - nWidth + 1);
                    nCellsIndex = 0;
                    nDj = 1;
                    nDCellsIndex = 1;
                    fCondition = function (j, nEnd) {
                        return j <= nEnd;
                    };
                } else {
                    oPromoteHelper.reverse();
                    nStart = oBBox.c1 - 1;
                    nEnd = oBBox.c1 + nIndex;
                    if (nEnd < 0) {
                        nEnd = 0;
                    }
                    nCellsIndex = nCellsLength - 1;
                    nDj = -1;
                    nDCellsIndex = -1;
                    fCondition = function (j, nEnd) {
                        return j >= nEnd;
                    };
                }
                for (var j = nStart; fCondition(j, nEnd); j += nDj) {
                    var oCurItem = aCells[nCellsIndex];
                    var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                    if (null != oCurCell) {
                        this.worksheet._removeCell(i, j);
                    }
                    if (null != oCurItem.cell) {
                        var oCopyCell = this.worksheet._getCell(i, j);
                        oCopyCell.setStyle(oCurItem.cell.getStyle());
                        oCopyCell.setType(oCurItem.cell.getType());
                        if (bExistDigit && null != oCurItem.digparams && true == oCurItem.digparams.valid) {
                            var dNewValue = oPromoteHelper.getNext();
                            var sVal = "";
                            if (null != oCurItem.digparams.prefix) {
                                sVal += oCurItem.digparams.prefix;
                            }
                            sVal += dNewValue;
                            oCopyCell.setValue(sVal);
                        } else {
                            if (!oCurItem.formula) {
                                var DataOld = oCopyCell.getValueData();
                                oCopyCell.oValue = oCurItem.cell.oValue.clone(oCopyCell);
                                var DataNew = oCopyCell.getValueData();
                                if (false == DataOld.isEqual(DataNew)) {
                                    History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.worksheet.getId(), new Asc.Range(0, oCopyCell.oId.getRow0(), gc_nMaxCol0, oCopyCell.oId.getRow0()), new UndoRedoData_CellSimpleData(oCopyCell.oId.getRow0(), oCopyCell.oId.getCol0(), DataOld, DataNew));
                                }
                                if (!arrRecalc[this.worksheet.getId()]) {
                                    arrRecalc[this.worksheet.getId()] = {};
                                }
                                arrRecalc[this.worksheet.getId()][oCopyCell.getName()] = oCopyCell.getName();
                                this.worksheet.workbook.needRecalc[getVertexId(this.worksheet.getId(), oCopyCell.getName())] = [this.worksheet.getId(), oCopyCell.getName()];
                                if (this.worksheet.workbook.needRecalc.length < 0) {
                                    this.worksheet.workbook.needRecalc.length = 0;
                                }
                                this.worksheet.workbook.needRecalc.length++;
                            } else {
                                var assemb;
                                var _p_ = new parserFormula(oCurItem.cell.sFormula, oCopyCell.getName(), this.worksheet);
                                if (_p_.parse()) {
                                    assemb = _p_.changeOffset(oCopyCell.getOffset2(oCurItem.cell.getName())).assemble();
                                    oCopyCell.setValue("=" + assemb);
                                }
                                this.worksheet.workbook.needRecalc[getVertexId(this.worksheet.getId(), oCopyCell.getName())] = [this.worksheet.getId(), oCopyCell.getName()];
                                if (this.worksheet.workbook.needRecalc.length < 0) {
                                    this.worksheet.workbook.needRecalc.length = 0;
                                }
                                this.worksheet.workbook.needRecalc.length++;
                            }
                        }
                    }
                    nCellsIndex += nDCellsIndex;
                    if (nDCellsIndex > 0 && nCellsIndex >= nCellsLength) {
                        nCellsIndex = 0;
                    } else {
                        if (nCellsIndex < 0) {
                            nCellsIndex = nCellsLength - 1;
                        }
                    }
                }
            }
        }
    }
    History.EndTransaction();
    buildRecalc(this.worksheet.workbook);
    unLockDraw(this.worksheet.workbook);
};
Range.prototype.createCellOnRowColCross = function () {
    var oThis = this;
    var bbox = this.bbox;
    var nRangeType = this._getRangeType(bbox);
    if (c_oRangeType.Row == nRangeType) {
        this._foreachColNoEmpty(function (col) {
            for (var i = bbox.r1; i <= bbox.r2; ++i) {
                oThis.worksheet._getCell(i, col.index);
            }
        },
        null);
    } else {
        if (c_oRangeType.Col == nRangeType) {
            this._foreachRowNoEmpty(function (row) {
                for (var i = bbox.c1; i <= bbox.c2; ++i) {
                    oThis.worksheet._getCell(row.index, i);
                }
            },
            null);
        }
    }
};
function PromoteHelper() {
    this.aCurDigits = new Array();
    this.nCurSequence = 0;
    this.nCurSequenceIndex = 0;
    this.nDx = 1;
    this.aSequence = new Array();
    this.nSequenceLength = 0;
}
PromoteHelper.prototype = {
    add: function (dVal) {
        this.aCurDigits.push(dVal);
    },
    finishSection: function () {
        if (this.aCurDigits.length > 0) {
            this.aSequence.push({
                digits: this.aCurDigits,
                a0: 0,
                a1: 0,
                nX: 0,
                length: this.aCurDigits.length
            });
            this.aCurDigits = new Array();
        }
    },
    isOnlyIntegerSequence: function () {
        var bRes = true;
        var nPrevValue = null;
        var nDiff = null;
        for (var i = 0, length = this.aCurDigits.length; i < length; ++i) {
            var nCurValue = this.aCurDigits[i];
            if (null != nPrevValue) {
                if (null == nDiff) {
                    nDiff = nCurValue - nPrevValue;
                } else {
                    if (nCurValue != nPrevValue + nDiff) {
                        bRes = false;
                        break;
                    }
                }
            }
            nPrevValue = nCurValue;
        }
        return bRes;
    },
    removeLast: function () {
        this.aCurDigits = new Array();
    },
    finishAdd: function () {
        if (this.aCurDigits.length > 0) {
            this.aSequence.push({
                digits: this.aCurDigits,
                a0: 0,
                a1: 0,
                nX: 0,
                length: this.aCurDigits.length
            });
        }
        this.nSequenceLength = this.aSequence.length;
    },
    isEmpty: function () {
        return 0 == this.nSequenceLength;
    },
    calc: function () {
        for (var i = 0, length = this.aSequence.length; i < length; ++i) {
            var sequence = this.aSequence[i];
            var sequenceParams = this._promoteSequence(sequence.digits);
            sequence.a0 = sequenceParams.a0;
            sequence.a1 = sequenceParams.a1;
            sequence.nX = sequenceParams.nX;
        }
    },
    reverse: function () {
        if (this.isEmpty()) {
            return;
        }
        this.nCurSequence = this.nSequenceLength - 1;
        this.nCurSequenceIndex = this.aSequence[this.nCurSequence].length - 1;
        this.nDx = -1;
        for (var i = 0, length = this.aSequence.length; i < length; ++i) {
            this.aSequence[i].nX = -1;
        }
    },
    getNext: function () {
        var sequence = this.aSequence[this.nCurSequence];
        var dNewVal = sequence.a1 * sequence.nX + sequence.a0;
        sequence.nX += this.nDx;
        this.nCurSequenceIndex += this.nDx;
        if (this.nDx > 0) {
            if (this.nCurSequenceIndex >= sequence.length) {
                this.nCurSequenceIndex = 0;
                this.nCurSequence++;
                if (this.nCurSequence >= this.nSequenceLength) {
                    this.nCurSequence = 0;
                }
            }
        } else {
            if (this.nCurSequenceIndex < 0) {
                this.nCurSequence--;
                if (this.nCurSequence < 0) {
                    this.nCurSequence = this.nSequenceLength - 1;
                }
                this.nCurSequenceIndex = this.aSequence[this.nCurSequence].length - 1;
            }
        }
        return dNewVal;
    },
    _promoteSequence: function (aDigits) {
        var a0 = 0;
        var a1 = 0;
        var nX = 0;
        if (1 == aDigits.length) {
            nX = 1;
            a1 = 1;
            a0 = aDigits[0];
        } else {
            var nN = aDigits.length;
            var nXi = 0;
            var nXiXi = 0;
            var dYi = 0;
            var dYiXi = 0;
            for (var i = 0, length = aDigits.length; i < length; ++i, ++nX) {
                var dValue = aDigits[i];
                nXi += nX;
                nXiXi += nX * nX;
                dYi += dValue;
                dYiXi += dValue * nX;
            }
            var dD = nN * nXiXi - nXi * nXi;
            var dD1 = dYi * nXiXi - nXi * dYiXi;
            var dD2 = nN * dYiXi - dYi * nXi;
            a0 = dD1 / dD;
            a1 = dD2 / dD;
        }
        return {
            a0: a0,
            a1: a1,
            nX: nX
        };
    }
};
function DefinedName() {
    this.Name = null;
    this.Ref = null;
    this.LocalSheetId = null;
    this.bTable = false;
}
function NameGenerator(wb) {
    this.wb = wb;
    this.aExistNames = new Object();
    this.sTableNamePattern = "Table";
    this.nTableNameMaxIndex = 0;
}
NameGenerator.prototype = {
    addName: function (sName) {
        this.aExistNames[sName] = 1;
    },
    addLocalDefinedName: function (oDefinedName) {
        this.addName(oDefinedName.Name);
    },
    addDefinedName: function (oDefinedName) {
        this.wb.DefinedNames[oDefinedName.Name] = oDefinedName;
        this.addName(oDefinedName.Name);
    },
    addTableName: function (sName, ws, Ref) {
        var sDefinedNameRef = ws.getName();
        if (false == rx_test_ws_name.test(sDefinedNameRef)) {
            sDefinedNameRef = "'" + sDefinedNameRef + "'";
        }
        sDefinedNameRef += "!" + Ref;
        var oNewDefinedName = new DefinedName();
        oNewDefinedName.Name = sName;
        oNewDefinedName.Ref = sDefinedNameRef;
        oNewDefinedName.bTable = true;
        this.addDefinedName(oNewDefinedName);
    },
    isExist: function (sName) {
        return null != this.aExistNames[sName];
    },
    getNextTableName: function (ws, Ref) {
        this.nTableNameMaxIndex++;
        var sNewName = this.sTableNamePattern + this.nTableNameMaxIndex;
        while (null != this.aExistNames[sNewName]) {
            this.nTableNameMaxIndex++;
            sNewName = this.sTableNamePattern + this.nTableNameMaxIndex;
        }
        this.addTableName(sNewName, ws, Ref);
        return sNewName;
    }
};