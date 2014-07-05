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
 (function ($, window, undefined) {
    var asc = window["Asc"];
    var asc_calcnpt = asc.calcNearestPt;
    var asc_getcvt = asc.getCvtRatio;
    var asc_getprop = asc.getProperty;
    var asc_floor = asc.floor;
    var asc_ceil = asc.ceil;
    var asc_round = asc.round;
    var asc_n2css = asc.numberToCSSColor;
    var asc_n2Color = asc.numberToAscColor;
    var asc_obj2Color = asc.colorObjToAscColor;
    var asc_typeof = asc.typeOf;
    var asc_incDecFonSize = asc.incDecFonSize;
    var asc_debug = asc.outputDebugStr;
    var asc_Range = asc.Range;
    var asc_FP = asc.FontProperties;
    var asc_parsecolor = asc.parseColor;
    var asc_clone = asc.clone;
    var asc_AF = asc.AutoFilters;
    var asc_CCellFlag = asc.asc_CCellFlag;
    var asc_CFont = asc.asc_CFont;
    var asc_CFill = asc.asc_CFill;
    var asc_CBorder = asc.asc_CBorder;
    var asc_CBorders = asc.asc_CBorders;
    var asc_CCellInfo = asc.asc_CCellInfo;
    var asc_CCellRect = asc.asc_CCellRect;
    var asc_CHyperlink = asc.asc_CHyperlink;
    var asc_CPageOptions = asc.asc_CPageOptions;
    var asc_CPageSetup = asc.asc_CPageSetup;
    var asc_CPageMargins = asc.asc_CPageMargins;
    var asc_CPagePrint = asc.CPagePrint;
    var asc_CCollaborativeRange = asc.asc_CCollaborativeRange;
    var asc_CCellCommentator = asc.asc_CCellCommentator;
    var kHeaderDefault = 0;
    var kHeaderActive = 1;
    var kHeaderHighlighted = 2;
    var kHeaderSelected = 3;
    var khaLeft = "left";
    var khaCenter = "center";
    var khaRight = "right";
    var khaJustify = "justify";
    var kvaTop = "top";
    var kvaCenter = "center";
    var kvaBottom = "bottom";
    var kNone = "none";
    var kCurDefault = "default";
    var kCurCorner = "pointer";
    var kCurCells = "cell";
    var kCurColSelect = "pointer";
    var kCurColResize = "col-resize";
    var kCurRowSelect = "pointer";
    var kCurRowResize = "row-resize";
    var kCurFillHandle = "crosshair";
    var kCurHyperlink = "pointer";
    var kCurComment = "cell";
    var kCurMove = "move";
    var kCurSEResize = "se-resize";
    var kCurNEResize = "ne-resize";
    var kcbidLeft = 1;
    var kcbidRight = 2;
    var kcbidTop = 3;
    var kcbidBottom = 4;
    var kcbidDiagonal = 5;
    var kcbidDiagonalDown = 6;
    var kcbidDiagonalUp = 7;
    var kNewLine = "\n";
    function calcDecades(num) {
        return Math.abs(num) < 10 ? 1 : 1 + calcDecades(asc_floor(num * 0.1));
    }
    function CacheElement() {
        if (! (this instanceof CacheElement)) {
            return new CacheElement();
        }
        this.columnsWithText = {};
        this.columns = {};
        this.erasedRB = {};
        this.erasedLB = {};
        return this;
    }
    function CellBorder(style, color, width, isErased, isActive) {
        if (! (this instanceof CellBorder)) {
            return new CellBorder(style, color, width, isErased, isActive);
        }
        this.s = style !== undefined ? style : c_oAscBorderStyles.None;
        this.c = color !== undefined ? color.getRgb() : 0;
        this.w = width !== undefined ? width : 0;
        this.isErased = isErased !== undefined ? isErased : false;
        this.isActive = isActive !== undefined ? isActive : true;
        return this;
    }
    function WorksheetViewSettings() {
        if (! (this instanceof WorksheetViewSettings)) {
            return new WorksheetViewSettings();
        }
        this.header = {
            style: [{
                background: "#F4F4F4",
                border: "#D5D5D5",
                color: "#363636"
            },
            {
                background: "#C1C1C1",
                border: "#929292",
                color: "#363636"
            },
            {
                background: "#DFDFDF",
                border: "#AFAFAF",
                color: "#656A70"
            },
            {
                background: "#AAAAAA",
                border: "#75777A",
                color: "#363636"
            }],
            cornerColor: "#C1C1C1"
        };
        this.cells = {
            fontName: "Calibri",
            fontSize: 11,
            defaultState: {
                background: "#FFF",
                border: "#DADCDD",
                color: "#000",
                colorNumber: 0
            },
            padding: 2
        };
        this.activeCellBorderColor = "rgba(105,119,62,0.7)";
        this.activeCellBackground = "rgba(157,185,85,.2)";
        this.formulaRangeBorderColor = ["rgba(0,53,214,1)", "rgba(216,0,0,1)", "rgba(214,160,0,1)", "rgba(107,214,0,1)", "rgba(0,214,53,1)", "rgba(0,214,214,1)", "rgba(107,0,214,1)", "rgba(214,0,160,1)"];
        this.fillHandleBorderColorSelect = "rgba(255,255,255,1)";
        return this;
    }
    function Cache() {
        if (! (this instanceof Cache)) {
            return new Cache();
        }
        this.rows = {};
        this.sectors = [];
        this.reset = function () {
            this.rows = {};
            this.sectors = [];
        };
    }
    function WorksheetView(model, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings) {
        if (! (this instanceof WorksheetView)) {
            return new WorksheetView(model, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings);
        }
        this.settings = $.extend(true, {},
        this.defaults, settings);
        var cells = this.settings.cells;
        cells.fontName = model.workbook.getDefaultFont();
        cells.fontSize = model.workbook.getDefaultSize();
        this.vspRatio = 1.275;
        this.model = model;
        this.buffers = buffers;
        this.drawingCtx = this.buffers.main;
        this.overlayCtx = this.buffers.overlay;
        this.shapeCtx = this.buffers.shapeCtx;
        this.shapeOverlayCtx = this.buffers.shapeOverlayCtx;
        this.stringRender = stringRender;
        this.updateZoom = false;
        var cnv = $('<canvas width="2" height="2"/>')[0];
        var ctx = cnv.getContext("2d");
        ctx.clearRect(0, 0, 2, 2);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillRect(1, 1, 1, 1);
        this.ptrnLineDotted1 = ctx.createPattern(cnv, "repeat");
        this.cache = new Cache();
        this.maxDigitWidth = maxDigitWidth;
        this.nBaseColWidth = 8;
        this.defaultColWidthChars = 0;
        this.defaultColWidth = 0;
        this.defaultRowHeight = 0;
        this.defaultRowDescender = 0;
        this.headersLeft = 0;
        this.headersTop = 0;
        this.headersWidth = 0;
        this.headersHeight = 0;
        this.headersHeightByFont = 0;
        this.cellsLeft = 0;
        this.cellsTop = 0;
        this.cols = [];
        this.rows = [];
        this.width_1px = 0;
        this.width_2px = 0;
        this.width_3px = 0;
        this.width_4px = 0;
        this.width_padding = 0;
        this.height_1px = 0;
        this.height_2px = 0;
        this.height_3px = 0;
        this.height_4px = 0;
        this.highlightedCol = -1;
        this.highlightedRow = -1;
        this.visibleRange = asc_Range(0, 0, 0, 0);
        this.activeRange = asc_Range(0, 0, 0, 0);
        this.activeRange.type = c_oAscSelectionType.RangeCells;
        this.activeRange.startCol = 0;
        this.activeRange.startRow = 0;
        this.isChanged = false;
        this.isCellEditMode = false;
        this.isFormulaEditMode = false;
        this.isChartAreaEditMode = false;
        this.lockDraw = false;
        this.isSelectOnShape = false;
        this.isSelectionDialogMode = false;
        this.copyOfActiveRange = null;
        this.startCellMoveResizeRange = null;
        this.startCellMoveResizeRange2 = null;
        this.startCellMoveRange = null;
        this.activeMoveRange = null;
        this.fillHandleL = 0;
        this.fillHandleT = 0;
        this.fillHandleR = 0;
        this.fillHandleB = 0;
        this.activeFillHandle = null;
        this.fillHandleDirection = -1;
        this.fillHandleArea = -1;
        this.nRowsCount = 0;
        this.nColsCount = 0;
        this.arrActiveFormulaRanges = [];
        this.arrActiveChartsRanges = [];
        this.collaborativeEditing = collaborativeEditing;
        this.autoFilters = new asc_AF(this);
        this.cellCommentator = new asc_CCellCommentator(this);
        this._init();
        return this;
    }
    WorksheetView.prototype = {
        constructor: WorksheetView,
        defaults: WorksheetViewSettings(),
        option: function (name, value) {
            var old = asc_getprop(name, this.settings);
            if (name !== undefined && value !== undefined) {
                var i = name.lastIndexOf(".");
                if (i < 0) {
                    this.settings[name] = value;
                } else {
                    var p = asc_getprop(name.slice(0, i), this.settings);
                    if (p === undefined) {
                        return false;
                    }
                    p[name.slice(i + 1)] = value;
                }
                return true;
            }
            return old;
        },
        getVisibleRange: function () {
            return this.visibleRange;
        },
        updateVisibleRange: function () {
            return this._updateCellsRange(this.getVisibleRange());
        },
        getFirstVisibleCol: function () {
            return this.visibleRange.c1;
        },
        getLastVisibleCol: function () {
            return this.visibleRange.c2;
        },
        getFirstVisibleRow: function () {
            return this.visibleRange.r1;
        },
        getLastVisibleRow: function () {
            return this.visibleRange.r2;
        },
        getHorizontalScrollRange: function () {
            var ctxW = this.drawingCtx.getWidth() - this.cellsLeft;
            for (var w = 0, i = this.cols.length - 1; i >= 0; --i) {
                w += this.cols[i].width;
                if (w > ctxW) {
                    break;
                }
            }
            return i;
        },
        getVerticalScrollRange: function () {
            var ctxH = this.drawingCtx.getHeight() - this.cellsTop;
            for (var h = 0, i = this.rows.length - 1; i >= 0; --i) {
                h += this.rows[i].height;
                if (h > ctxH) {
                    break;
                }
            }
            return i;
        },
        getCellsOffset: function (units) {
            var u = units >= 0 && units <= 3 ? units : 0;
            return {
                left: this.cellsLeft * asc_getcvt(1, u, this._getPPIX()),
                top: this.cellsTop * asc_getcvt(1, u, this._getPPIY())
            };
        },
        getCellLeft: function (column, units) {
            if (column >= 0 && column < this.cols.length) {
                var u = units >= 0 && units <= 3 ? units : 0;
                return this.cols[column].left * asc_getcvt(1, u, this._getPPIX());
            }
            return null;
        },
        getCellTop: function (row, units) {
            if (row >= 0 && row < this.rows.length) {
                var u = units >= 0 && units <= 3 ? units : 0;
                return this.rows[row].top * asc_getcvt(1, u, this._getPPIY());
            }
            return null;
        },
        getColumnWidth: function (index, units) {
            if (index >= 0 && index < this.cols.length) {
                var u = units >= 0 && units <= 3 ? units : 0;
                return this.cols[index].width * asc_getcvt(1, u, this._getPPIX());
            }
            return null;
        },
        getColumnWidthInSymbols: function (index) {
            if (index >= 0 && index < this.cols.length) {
                return this.cols[index].charCount;
            }
            return null;
        },
        getRowHeight: function (index, units, isHeightReal) {
            if (index >= 0 && index < this.rows.length) {
                var u = units >= 0 && units <= 3 ? units : 0;
                var h = isHeightReal ? this.rows[index].heightReal : this.rows[index].height;
                return h * asc_getcvt(1, u, this._getPPIY());
            }
            return null;
        },
        getSelectedColumnIndex: function () {
            return this.activeRange.startCol;
        },
        getSelectedRowIndex: function () {
            return this.activeRange.startRow;
        },
        getSelectedRange: function () {
            return this._getRange(this.activeRange.c1, this.activeRange.r1, this.activeRange.c2, this.activeRange.r2);
        },
        resize: function () {
            this._initCellsArea(true);
            this._normalizeViewRange();
            this._cleanCellsTextMetricsCache();
            this._prepareCellTextMetricsCache(this.visibleRange);
            return this;
        },
        getZoom: function () {
            return this.drawingCtx.getZoom();
        },
        changeZoom: function (isUpdate) {
            if (isUpdate) {
                this.cleanSelection();
                this._initConstValues();
                this._initCellsArea(false);
                this._normalizeViewRange();
                this._cleanCellsTextMetricsCache();
                this._shiftVisibleRange();
                this._prepareCellTextMetricsCache(this.visibleRange);
                this._shiftVisibleRange();
                this.cellCommentator.updateCommentPosition();
                this.updateZoom = false;
            } else {
                this.updateZoom = true;
            }
            return this;
        },
        getCellTextMetrics: function (col, row) {
            var ct = this._getCellTextCache(col, row);
            return ct ? $.extend({},
            ct.metrics) : undefined;
        },
        getSheetViewSettings: function () {
            return this.model.getSheetViewSettings();
        },
        changeColumnWidth: function (col, x2, mouseX) {
            var t = this;
            x2 *= asc_getcvt(0, 1, t._getPPIX());
            x2 += mouseX;
            var offsetX = t.cols[t.visibleRange.c1].left - t.cellsLeft;
            var x1 = t.cols[col].left - offsetX - this.width_1px;
            var w = Math.max(x2 - x1, 0);
            var cc = Math.min(t._colWidthToCharCount(w), 255);
            var cw = t._charCountToModelColWidth(cc);
            var onChangeWidthCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                t.model.setColWidth(cw, col, col);
                t._cleanCache(asc_Range(0, 0, t.cols.length - 1, t.rows.length - 1));
                t.changeWorksheet("update");
                t._updateVisibleColsCount();
            };
            return this._isLockedAll(onChangeWidthCallback);
        },
        changeRowHeight: function (row, y2, mouseY) {
            var t = this;
            y2 *= asc_getcvt(0, 1, t._getPPIY());
            y2 += mouseY;
            var offsetY = t.rows[t.visibleRange.r1].top - t.cellsTop;
            var y1 = t.rows[row].top - offsetY - this.height_1px;
            var onChangeHeightCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                t.model.setRowHeight(Math.min(t.maxRowHeight, Math.max(y2 - y1 + t.height_1px, 0)), row, row);
                t._cleanCache(asc_Range(0, row, t.cols.length - 1, row));
                t.changeWorksheet("update");
                t._updateVisibleRowsCount();
            };
            return this._isLockedAll(onChangeHeightCallback);
        },
        _hasNumberValueInActiveRange: function () {
            var cell, cellType, isNumberFormat;
            var result = null;
            if (this._rangeIsSingleCell(this.activeRange)) {
                return result;
            }
            var mergedRange = this.model.getMergedByCell(this.activeRange.r1, this.activeRange.c1);
            if (mergedRange && mergedRange.isEqual(this.activeRange)) {
                return result;
            }
            for (var c = this.activeRange.c1; c <= this.activeRange.c2; ++c) {
                for (var r = this.activeRange.r1; r <= this.activeRange.r2; ++r) {
                    cell = this._getCellTextCache(c, r);
                    if (cell) {
                        cellType = cell.cellType;
                        isNumberFormat = (null == cellType || CellValueType.Number === cellType);
                        if (isNumberFormat) {
                            if (null === result) {
                                result = {};
                                result.arrCols = [];
                                result.arrRows = [];
                            }
                            result.arrCols.push(c);
                            result.arrRows.push(r);
                        }
                    }
                }
            }
            if (null !== result) {
                function cmpNum(a, b) {
                    return a - b;
                }
                $.unique(result.arrCols);
                $.unique(result.arrRows);
                result.arrCols = result.arrCols.sort(cmpNum);
                result.arrRows = result.arrRows.sort(cmpNum);
            }
            return result;
        },
        autoCompletFormula: function (functionName) {
            var t = this;
            this.activeRange.normalize();
            var ar = this.activeRange;
            var arCopy = null;
            var arHistorySelect = ar.clone(true);
            var vr = this.visibleRange;
            var topCell = null;
            var leftCell = null;
            var r = ar.startRow - 1;
            var c = ar.startCol - 1;
            var cell, cellType, isNumberFormat;
            var result = {};
            var hasNumber = this._hasNumberValueInActiveRange();
            var val, text;
            if (hasNumber) {
                var i;
                var hasNumberInLastColumn = (ar.c2 === hasNumber.arrCols[hasNumber.arrCols.length - 1]);
                var hasNumberInLastRow = (ar.r2 === hasNumber.arrRows[hasNumber.arrRows.length - 1]);
                var startCol = hasNumber.arrCols[0];
                var startRow = hasNumber.arrRows[0];
                var startColOld = ar.c1;
                var startRowOld = ar.r1;
                var bIsUpdate = false;
                if (startColOld !== startCol || startRowOld !== startRow) {
                    bIsUpdate = true;
                }
                if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
                    bIsUpdate = true;
                }
                if (bIsUpdate) {
                    this.cleanSelection();
                    ar.c1 = startCol;
                    ar.r1 = startRow;
                    if (false === ar.contains(ar.startCol, ar.startRow)) {
                        ar.startCol = startCol;
                        ar.startRow = startRow;
                    }
                    if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
                        if (1 === hasNumber.arrRows.length) {
                            ar.c2 += 1;
                        } else {
                            ar.r2 += 1;
                        }
                    }
                    this._drawSelection();
                }
                arCopy = ar.clone(true);
                var functionAction = null;
                var changedRange = null;
                if (false === hasNumberInLastColumn && false === hasNumberInLastRow) {
                    changedRange = [new asc_Range(hasNumber.arrCols[0], arCopy.r2, hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2), new asc_Range(arCopy.c2, hasNumber.arrRows[0], arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length - 1])];
                    functionAction = function () {
                        for (i = 0; i < hasNumber.arrCols.length; ++i) {
                            c = hasNumber.arrCols[i];
                            cell = t._getVisibleCell(c, arCopy.r2);
                            text = t._getCellTitle(c, arCopy.r1) + ":" + t._getCellTitle(c, arCopy.r2 - 1);
                            val = "=" + functionName + "(" + text + ")";
                            cell.setValue(val);
                        }
                        for (i = 0; i < hasNumber.arrRows.length; ++i) {
                            r = hasNumber.arrRows[i];
                            cell = t._getVisibleCell(arCopy.c2, r);
                            text = t._getCellTitle(arCopy.c1, r) + ":" + t._getCellTitle(arCopy.c2 - 1, r);
                            val = "=" + functionName + "(" + text + ")";
                            cell.setValue(val);
                        }
                        cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
                        text = t._getCellTitle(arCopy.c1, arCopy.r2) + ":" + t._getCellTitle(arCopy.c2 - 1, arCopy.r2);
                        val = "=" + functionName + "(" + text + ")";
                        cell.setValue(val);
                    };
                } else {
                    if (true === hasNumberInLastRow && false === hasNumberInLastColumn) {
                        changedRange = new asc_Range(arCopy.c2, hasNumber.arrRows[0], arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length - 1]);
                        functionAction = function () {
                            for (i = 0; i < hasNumber.arrRows.length; ++i) {
                                r = hasNumber.arrRows[i];
                                cell = t._getVisibleCell(arCopy.c2, r);
                                text = t._getCellTitle(arCopy.c1, r) + ":" + t._getCellTitle(arCopy.c2 - 1, r);
                                val = "=" + functionName + "(" + text + ")";
                                cell.setValue(val);
                            }
                        };
                    } else {
                        if (false === hasNumberInLastRow && true === hasNumberInLastColumn) {
                            changedRange = new asc_Range(hasNumber.arrCols[0], arCopy.r2, hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2);
                            functionAction = function () {
                                for (i = 0; i < hasNumber.arrCols.length; ++i) {
                                    c = hasNumber.arrCols[i];
                                    cell = t._getVisibleCell(c, arCopy.r2);
                                    text = t._getCellTitle(c, arCopy.r1) + ":" + t._getCellTitle(c, arCopy.r2 - 1);
                                    val = "=" + functionName + "(" + text + ")";
                                    cell.setValue(val);
                                }
                            };
                        } else {
                            if (1 === hasNumber.arrRows.length) {
                                changedRange = new asc_Range(arCopy.c2, arCopy.r2, arCopy.c2, arCopy.r2);
                                functionAction = function () {
                                    cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
                                    text = t._getCellTitle(arCopy.c1, arCopy.r2) + ":" + t._getCellTitle(arCopy.c2 - 1, arCopy.r2);
                                    val = "=" + functionName + "(" + text + ")";
                                    cell.setValue(val);
                                };
                            } else {
                                changedRange = new asc_Range(hasNumber.arrCols[0], arCopy.r2, hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2);
                                functionAction = function () {
                                    for (i = 0; i < hasNumber.arrCols.length; ++i) {
                                        c = hasNumber.arrCols[i];
                                        cell = t._getVisibleCell(c, arCopy.r2);
                                        text = t._getCellTitle(c, arCopy.r1) + ":" + t._getCellTitle(c, arCopy.r2 - 1);
                                        val = "=" + functionName + "(" + text + ")";
                                        cell.setValue(val);
                                    }
                                };
                            }
                        }
                    }
                }
                var onAutoCompletFormula = function (isSuccess) {
                    if (false === isSuccess) {
                        return;
                    }
                    History.Create_NewPoint();
                    History.SetSelection(arHistorySelect);
                    History.StartTransaction();
                    if ($.isFunction(functionAction)) {
                        functionAction();
                    }
                    History.EndTransaction();
                };
                this._isLockedCells(changedRange, null, onAutoCompletFormula);
                result.notEditCell = true;
                return result;
            }
            for (; r >= vr.r1; --r) {
                cell = this._getCellTextCache(ar.startCol, r);
                if (cell) {
                    cellType = cell.cellType;
                    isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                    if (isNumberFormat) {
                        topCell = asc_clone(cell);
                        topCell.r = r;
                        topCell.c = ar.startCol;
                        if (topCell.isFormula && r - 1 >= vr.r1) {
                            cell = this._getCellTextCache(ar.startCol, r - 1);
                            if (cell && cell.isFormula) {
                                topCell.isFormulaSeq = true;
                            }
                        }
                        break;
                    }
                }
            }
            if (null === topCell || topCell.r !== ar.startRow - 1 || topCell.isFormula && !topCell.isFormulaSeq) {
                for (; c >= vr.c1; --c) {
                    cell = this._getCellTextCache(c, ar.startRow);
                    if (cell) {
                        cellType = cell.cellType;
                        isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                        if (isNumberFormat) {
                            leftCell = asc_clone(cell);
                            leftCell.r = ar.startRow;
                            leftCell.c = c;
                            break;
                        }
                    }
                    if (null !== topCell) {
                        break;
                    }
                }
            }
            if (leftCell) {
                --c;
                for (; c >= 0; --c) {
                    cell = this._getCellTextCache(c, ar.startRow);
                    if (!cell) {
                        this._addCellTextToCache(c, ar.startRow);
                        cell = this._getCellTextCache(c, ar.startRow);
                        if (!cell) {
                            break;
                        }
                    }
                    cellType = cell.cellType;
                    isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                    if (!isNumberFormat) {
                        break;
                    }
                }++c;
                if (ar.startCol - 1 !== c) {
                    result = asc_Range(c, leftCell.r, ar.startCol - 1, leftCell.r);
                } else {
                    result = asc_Range(c, leftCell.r, c, leftCell.r);
                }
                result.type = c_oAscSelectionType.RangeCells;
                this._fixSelectionOfMergedCells(result);
                result.normalize();
                if (result.c1 === result.c2 && result.r1 === result.r2) {
                    result.text = this._getCellTitle(result.c1, result.r1);
                } else {
                    result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
                }
                return result;
            }
            if (topCell) {
                --r;
                for (; r >= 0; --r) {
                    cell = this._getCellTextCache(ar.startCol, r);
                    if (!cell) {
                        this._addCellTextToCache(ar.startCol, r);
                        cell = this._getCellTextCache(ar.startCol, r);
                        if (!cell) {
                            break;
                        }
                    }
                    cellType = cell.cellType;
                    isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                    if (!isNumberFormat) {
                        break;
                    }
                }++r;
                if (ar.startRow - 1 !== r) {
                    result = asc_Range(topCell.c, r, topCell.c, ar.startRow - 1);
                } else {
                    result = asc_Range(topCell.c, r, topCell.c, r);
                }
                result.type = c_oAscSelectionType.RangeCells;
                this._fixSelectionOfMergedCells(result);
                result.normalize();
                if (result.c1 === result.c2 && result.r1 === result.r2) {
                    result.text = this._getCellTitle(result.c1, result.r1);
                } else {
                    result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
                }
                return result;
            }
        },
        getDrawingContextCharts: function () {
            return this._trigger("getDCForCharts");
        },
        _init: function () {
            this._initConstValues();
            this._initWorksheetDefaultWidth();
            this._initCellsArea(true);
            this.autoFilters.addFiltersAfterOpen();
            this._initConditionalFormatting();
            this._cleanCellsTextMetricsCache();
            this._prepareCellTextMetricsCache(this.visibleRange);
            this._trigger("initialized");
        },
        _initConditionalFormatting: function () {
            var oGradient = null;
            var aCFs = this.model.aConditionalFormatting;
            var aRules, oRule;
            var oRuleElement = null;
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var tmp;
            var arrayCells = [];
            for (var i in aCFs) {
                if (!aCFs.hasOwnProperty(i)) {
                    continue;
                }
                aRules = aCFs[i].aRules;
                if (0 >= aRules.length) {
                    continue;
                }
                for (var j in aRules) {
                    if (!aRules.hasOwnProperty(j)) {
                        continue;
                    }
                    oRule = aRules[j];
                    switch (oRule.Type) {
                    case "colorScale":
                        if (1 !== oRule.aRuleElements.length) {
                            break;
                        }
                        oRuleElement = oRule.aRuleElements[0];
                        if (! (oRuleElement instanceof asc.CColorScale) || null === aCFs[i].SqRefRange) {
                            break;
                        }
                        aCFs[i].SqRefRange._setPropertyNoEmpty(null, null, function (c) {
                            if (CellValueType.Number === c.getType() && false === c.isEmptyTextString()) {
                                tmp = parseFloat(c.getValueWithoutFormat());
                                if (isNaN(tmp)) {
                                    return;
                                }
                                arrayCells.push({
                                    cell: c,
                                    val: tmp
                                });
                                min = Math.min(min, tmp);
                                max = Math.max(max, tmp);
                            }
                        });
                        if (0 < arrayCells.length && 2 === oRuleElement.aColors.length) {
                            oGradient = new asc.CGradient(oRuleElement.aColors[0], oRuleElement.aColors[1]);
                            oGradient.init(min, max);
                            for (var cell in arrayCells) {
                                if (arrayCells.hasOwnProperty(cell)) {
                                    var dxf = new CellXfs();
                                    dxf.fill = new Fill({
                                        bg: oGradient.calculateColor(arrayCells[cell].val)
                                    });
                                    arrayCells[cell].cell.setConditionalFormattingStyle(dxf);
                                }
                            }
                        }
                        arrayCells.splice(0, arrayCells.length);
                        min = Number.MAX_VALUE;
                        max = -Number.MAX_VALUE;
                        break;
                    }
                }
            }
        },
        _prepareComments: function () {
            var commentList = [];
            for (var i = 0; i < this.model.aComments.length; i++) {
                var comment = {
                    "Id": this.model.aComments[i].asc_getId(),
                    "Comment": this.model.aComments[i]
                };
                this.cellCommentator.addCommentSerialize(comment["Comment"]);
                commentList.push(comment);
            }
            if (commentList.length) {
                this.model.workbook.handlers.trigger("asc_onAddComments", commentList);
            }
        },
        _prepareDrawingObjects: function () {
            if (!this.settings.objectRender) {
                this.objectRender = new DrawingObjects();
                this.objectRender.init(this);
            } else {
                this.objectRender = this.settings.objectRender;
            }
        },
        _initWorksheetDefaultWidth: function () {
            this.nBaseColWidth = this.model.nBaseColWidth || this.nBaseColWidth;
            var defaultColWidthChars = this._charCountToModelColWidth(this.nBaseColWidth);
            this.defaultColWidthPx = this._modelColWidthToColWidth(defaultColWidthChars) * asc_getcvt(1, 0, 96);
            this.defaultColWidthPx = asc_ceil(this.defaultColWidthPx / 8) * 8;
            this.defaultColWidthChars = this._colWidthToCharCount(this.defaultColWidthPx * asc_getcvt(0, 1, 96));
            gc_dDefaultColWidthCharsAttribute = this._charCountToModelColWidth(this.defaultColWidthChars, true);
            this.defaultColWidth = this._modelColWidthToColWidth(gc_dDefaultColWidthCharsAttribute);
            this.maxRowHeight = asc_calcnpt(409, this._getPPIY());
            this.defaultRowDescender = this._calcRowDescender(this.settings.cells.fontSize);
            this.defaultRowHeight = asc_calcnpt(this.settings.cells.fontSize * this.vspRatio, this._getPPIY()) + this.height_1px;
            gc_dDefaultRowHeightAttribute = this.model.getDefaultHeight() || this.defaultRowHeight;
            var cells = this.settings.cells;
            this._setFont(undefined, cells.fontName, cells.fontSize);
            var sr = this.stringRender;
            var tm = this._roundTextMetrics(sr.measureString("A"));
            this.headersHeightByFont = tm.height;
        },
        _initConstValues: function () {
            var ppiX = this._getPPIX();
            var ppiY = this._getPPIY();
            this.width_1px = asc_calcnpt(0, ppiX, 1);
            this.width_2px = asc_calcnpt(0, ppiX, 2);
            this.width_3px = asc_calcnpt(0, ppiX, 3);
            this.width_4px = asc_calcnpt(0, ppiX, 4);
            this.width_padding = asc_calcnpt(0, ppiX, this.settings.cells.padding);
            this.height_1px = asc_calcnpt(0, ppiY, 1);
            this.height_2px = asc_calcnpt(0, ppiY, 2);
            this.height_3px = asc_calcnpt(0, ppiY, 3);
            this.height_4px = asc_calcnpt(0, ppiY, 4);
        },
        _initCellsArea: function (fullRecalc) {
            this._calcHeaderRowHeight();
            this._calcRowHeights(fullRecalc ? 1 : 0);
            this.visibleRange.r2 = 0;
            this._calcVisibleRows();
            this._updateVisibleRowsCount(true);
            this._calcHeaderColumnWidth();
            this._calcColumnWidths(fullRecalc ? 1 : 0);
            this.visibleRange.c2 = 0;
            this._calcVisibleColumns();
            this._updateVisibleColsCount(true);
        },
        _charCountToModelColWidth: function (count, displayWidth) {
            if (count <= 0) {
                return 0;
            }
            var maxw = displayWidth ? asc_round(this.maxDigitWidth) : this.maxDigitWidth;
            return asc_floor((count * maxw + 5) / maxw * 256) / 256;
        },
        _modelColWidthToColWidth: function (mcw, displayWidth) {
            var maxw = displayWidth ? asc_round(this.maxDigitWidth) : this.maxDigitWidth;
            var px = asc_floor(((256 * mcw + asc_floor(128 / maxw)) / 256) * maxw);
            return px * asc_getcvt(0, 1, 96);
        },
        _colWidthToCharCount: function (w) {
            var px = w * asc_getcvt(1, 0, 96);
            return px <= 5 ? 0 : asc_floor((px - 5) / asc_round(this.maxDigitWidth) * 100 + 0.5) / 100;
        },
        _calcColWidth: function (w) {
            var t = this;
            var res = {};
            var useDefault = w === undefined || w === null || w === -1;
            var width;
            res.width = useDefault ? t.defaultColWidth : (width = t._modelColWidthToColWidth(w), (width < t.width_1px ? 0 : width));
            res.innerWidth = Math.max(res.width - this.width_padding * 2 - this.width_1px, 0);
            res.charCount = t._colWidthToCharCount(res.width);
            return res;
        },
        _calcRowDescender: function (fontSize) {
            return asc_calcnpt(fontSize * (this.vspRatio - 1), this._getPPIY());
        },
        _calcHeaderColumnWidth: function () {
            if (false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
                this.headersWidth = 0;
            } else {
                var numDigit = Math.max(calcDecades(this.visibleRange.r2 + 1), 3);
                var nCharCount = this._charCountToModelColWidth(numDigit);
                this.headersWidth = this._modelColWidthToColWidth(nCharCount);
            }
            this.cellsLeft = this.headersLeft + this.headersWidth;
        },
        _calcHeaderRowHeight: function () {
            if (false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
                this.headersHeight = 0;
            } else {
                this.headersHeight = this.headersHeightByFont + this.height_1px;
            }
            this.cellsTop = this.headersTop + this.headersHeight;
        },
        _calcColumnWidths: function (fullRecalc) {
            var x = this.cellsLeft;
            var visibleW = this.drawingCtx.getWidth();
            var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {
                maxCol: 0,
                maxRow: 0
            };
            var l = Math.max(this.model.getColsCount(), this.nColsCount, obr.maxCol);
            var i = 0,
            w, column, isBestFit, hiddenW = 0;
            var defaultWidth = this.model.getDefaultWidth();
            defaultWidth = (typeof defaultWidth === "number" && defaultWidth >= 0) ? defaultWidth : -1;
            if (1 === fullRecalc) {
                this.cols = [];
            } else {
                if (2 === fullRecalc) {
                    i = this.cols.length;
                    x = this.cols[i - 1].left + this.cols[i - 1].width;
                }
            }
            for (;
            ((0 !== fullRecalc) ? i < l || x + hiddenW < visibleW : i < this.cols.length) && i <= gc_nMaxCol0; ++i) {
                column = this.model._getColNoEmptyWithAll(i);
                if (!column) {
                    w = defaultWidth;
                    isBestFit = true;
                } else {
                    if (column.hd) {
                        w = 0;
                        isBestFit = false;
                        hiddenW += this._calcColWidth(column.width).width;
                    } else {
                        w = column.width || defaultWidth;
                        isBestFit = !!(column.BestFit || (null === column.BestFit && null === column.CustomWidth));
                    }
                }
                this.cols[i] = this._calcColWidth(w);
                this.cols[i].isCustomWidth = !isBestFit;
                this.cols[i].left = x;
                x += this.cols[i].width;
            }
        },
        _calcRowHeights: function (fullRecalc) {
            var y = this.cellsTop;
            var visibleH = this.drawingCtx.getHeight();
            var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {
                maxCol: 0,
                maxRow: 0
            };
            var l = Math.max(this.model.getRowsCount(), this.nRowsCount, obr.maxRow);
            var defaultH = this.model.getDefaultHeight() || this.defaultRowHeight;
            var i = 0,
            h, hR, isCustomHeight, row, hiddenH = 0;
            if (1 === fullRecalc) {
                this.rows = [];
            } else {
                if (2 === fullRecalc) {
                    i = this.rows.length;
                    y = this.rows[i - 1].top + this.rows[i - 1].height;
                }
            }
            for (;
            (0 !== fullRecalc) ? i < l || y + hiddenH < visibleH : i < this.rows.length; ++i) {
                row = this.model._getRowNoEmpty(i);
                if (!row) {
                    h = -1;
                    isCustomHeight = false;
                } else {
                    if (row.hd) {
                        hR = h = 0;
                        isCustomHeight = true;
                        hiddenH += row.h > 0 ? row.h - this.height_1px : defaultH;
                    } else {
                        isCustomHeight = !!row.CustomHeight;
                        if (row.h > 0 && isCustomHeight) {
                            hR = row.h;
                            h = hR / 0.75;
                            h = (h | h) * 0.75;
                        } else {
                            h = -1;
                        }
                    }
                }
                h = h < 0 ? (hR = defaultH) : h;
                this.rows[i] = {
                    top: y,
                    height: h,
                    heightReal: hR,
                    descender: this.defaultRowDescender,
                    isCustomHeight: isCustomHeight,
                    isDefaultHeight: !(row && row.h > 0 && isCustomHeight)
                };
                y += this.rows[i].height;
            }
        },
        _calcVisibleColumns: function () {
            var l = this.cols.length;
            var w = this.drawingCtx.getWidth();
            var sumW = this.cellsLeft;
            for (var i = this.visibleRange.c1, f = false; i < l && sumW < w; ++i) {
                sumW += this.cols[i].width;
                f = true;
            }
            this.visibleRange.c2 = i - (f ? 1 : 0);
        },
        _calcVisibleRows: function () {
            var l = this.rows.length;
            var h = this.drawingCtx.getHeight();
            var sumH = this.cellsTop;
            for (var i = this.visibleRange.r1, f = false; i < l && sumH < h; ++i) {
                sumH += this.rows[i].height;
                f = true;
            }
            this.visibleRange.r2 = i - (f ? 1 : 0);
        },
        _updateColumnPositions: function () {
            var x = this.cellsLeft;
            for (var l = this.cols.length, i = 0; i < l; ++i) {
                this.cols[i].left = x;
                x += this.cols[i].width;
            }
        },
        _updateRowPositions: function () {
            var y = this.cellsTop;
            for (var l = this.rows.length, i = 0; i < l; ++i) {
                this.rows[i].top = y;
                y += this.rows[i].height;
            }
        },
        _appendColumns: function (rightSide) {
            var i = this.cols.length;
            var lc = this.cols[i - 1];
            var done = false;
            for (var x = lc.left + lc.width; x < rightSide || !done; ++i) {
                if (x >= rightSide) {
                    done = true;
                }
                this.cols[i] = this._calcColWidth(this.model.getColWidth(i));
                this.cols[i].left = x;
                x += this.cols[i].width;
                this.isChanged = true;
            }
        },
        _normalizeViewRange: function () {
            var t = this;
            var vr = t.visibleRange;
            var w = t.drawingCtx.getWidth() - t.cellsLeft;
            var h = t.drawingCtx.getHeight() - t.cellsTop;
            var c = t.cols;
            var r = t.rows;
            var vw = c[vr.c2].left + c[vr.c2].width - c[vr.c1].left;
            var vh = r[vr.r2].top + r[vr.r2].height - r[vr.r1].top;
            var i;
            if (vw < w) {
                for (i = vr.c1 - 1; i >= 0; --i) {
                    vw += c[i].width;
                    if (vw > w) {
                        break;
                    }
                }
                vr.c1 = i + 1;
                if (vr.c1 >= vr.c2) {
                    vr.c1 = vr.c2 - 1;
                }
                if (vr.c1 < 0) {
                    vr.c1 = 0;
                }
            }
            if (vh < h) {
                for (i = vr.r1 - 1; i >= 0; --i) {
                    vh += r[i].height;
                    if (vh > h) {
                        break;
                    }
                }
                vr.r1 = i + 1;
                if (vr.r1 >= vr.r2) {
                    vr.r1 = vr.r2 - 1;
                }
                if (vr.r1 < 0) {
                    vr.r1 = 0;
                }
            }
        },
        _shiftVisibleRange: function () {
            var t = this;
            var vr = t.visibleRange;
            var arn = t.activeRange.clone(true);
            var i;
            do {
                if (arn.r2 > vr.r2) {
                    i = arn.r2 - vr.r2;
                    vr.r1 += i;
                    vr.r2 += i;
                    t._calcVisibleRows();
                    continue;
                }
                if (t._isRowDrawnPartially(arn.r2, vr.r1)) {
                    vr.r1 += 1;
                    t._calcVisibleRows();
                }
                if (arn.r1 < vr.r1) {
                    i = arn.r1 - vr.r1;
                    vr.r1 += i;
                    vr.r2 += i;
                    t._calcVisibleRows();
                }
                break;
            } while (1);
            do {
                if (arn.c2 > vr.c2) {
                    i = arn.c2 - vr.c2;
                    vr.c1 += i;
                    vr.c2 += i;
                    t._calcVisibleColumns();
                    continue;
                }
                if (t._isColDrawnPartially(arn.c2, vr.c1)) {
                    vr.c1 += 1;
                    t._calcVisibleColumns();
                }
                if (arn.c1 < vr.c1) {
                    i = arn.c1 - vr.c1;
                    vr.c1 += i;
                    vr.c2 += i;
                    if (vr.c1 < 0) {
                        vr.c1 = 0;
                        vr.c2 -= vr.c1;
                    }
                    t._calcVisibleColumns();
                }
                break;
            } while (1);
        },
        calcPagesPrint: function (pageOptions, printOnlySelection, indexWorksheet, layoutPageType) {
            var range;
            var maxCols = this.model.getColsCount();
            var maxRows = this.model.getRowsCount();
            var lastC = -1,
            lastR = -1;
            var activeRange = printOnlySelection ? this.activeRange : null;
            if (null === activeRange) {
                range = asc_Range(0, 0, maxCols, maxRows);
                this._prepareCellTextMetricsCache(range);
                for (var c = 0; c < maxCols; ++c) {
                    for (var r = 0; r < maxRows; ++r) {
                        if (!this._isCellEmptyOrMergedOrBackgroundColorOrBorders(c, r)) {
                            var rightSide = 0;
                            var ct = this._getCellTextCache(c, r);
                            if (ct !== undefined) {
                                var isMerged = ct.flags.isMerged,
                                isWrapped = ct.flags.wrapText;
                                if (!isMerged && !isWrapped) {
                                    rightSide = ct.sideR;
                                }
                            }
                            lastC = Math.max(lastC, c + rightSide);
                            lastR = Math.max(lastR, r);
                        }
                    }
                }
                maxCols = lastC + 1;
                maxRows = lastR + 1;
                var maxObjectsCoord = this.objectRender.getDrawingAreaMetrics();
                if (maxObjectsCoord) {
                    maxCols = Math.max(maxCols, maxObjectsCoord.maxCol);
                    maxRows = Math.max(maxRows, maxObjectsCoord.maxRow);
                }
            } else {
                maxCols = activeRange.c2 + 1;
                maxRows = activeRange.r2 + 1;
                range = asc_Range(0, 0, maxCols, maxRows);
                this._prepareCellTextMetricsCache(range);
            }
            var pageMargins, pageSetup, pageGridLines, pageHeadings;
            if (pageOptions instanceof asc_CPageOptions) {
                pageMargins = pageOptions.asc_getPageMargins();
                pageSetup = pageOptions.asc_getPageSetup();
                pageGridLines = pageOptions.asc_getGridLines();
                pageHeadings = pageOptions.asc_getHeadings();
            }
            var pageWidth, pageHeight, pageOrientation;
            if (pageSetup instanceof asc_CPageSetup) {
                pageWidth = pageSetup.asc_getWidth();
                pageHeight = pageSetup.asc_getHeight();
                pageOrientation = pageSetup.asc_getOrientation();
            }
            var pageLeftField, pageRightField, pageTopField, pageBottomField;
            if (pageMargins instanceof asc_CPageMargins) {
                pageLeftField = pageMargins.asc_getLeft();
                pageRightField = pageMargins.asc_getRight();
                pageTopField = pageMargins.asc_getTop();
                pageBottomField = pageMargins.asc_getBottom();
            }
            if (null === pageGridLines || undefined === pageGridLines) {
                pageGridLines = c_oAscPrintDefaultSettings.PageGridLines;
            }
            if (null === pageHeadings || undefined === pageHeadings) {
                pageHeadings = c_oAscPrintDefaultSettings.PageHeadings;
            }
            if (null === pageWidth || undefined === pageWidth) {
                pageWidth = c_oAscPrintDefaultSettings.PageWidth;
            }
            if (null === pageHeight || undefined === pageHeight) {
                pageHeight = c_oAscPrintDefaultSettings.PageHeight;
            }
            if (null === pageOrientation || undefined === pageOrientation) {
                pageOrientation = c_oAscPrintDefaultSettings.PageOrientation;
            }
            if (null === pageLeftField || undefined === pageLeftField) {
                pageLeftField = c_oAscPrintDefaultSettings.PageLeftField;
            }
            if (null === pageRightField || undefined === pageRightField) {
                pageRightField = c_oAscPrintDefaultSettings.PageRightField;
            }
            if (null === pageTopField || undefined === pageTopField) {
                pageTopField = c_oAscPrintDefaultSettings.PageTopField;
            }
            if (null === pageBottomField || undefined === pageBottomField) {
                pageBottomField = c_oAscPrintDefaultSettings.PageBottomField;
            }
            if (c_oAscPageOrientation.PageLandscape === pageOrientation) {
                var tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
            var arrResult = [];
            if (0 === maxCols || 0 === maxRows) {
                return null;
            } else {
                var pageWidthWithFields = pageWidth - pageLeftField - pageRightField;
                var pageHeightWithFields = pageHeight - pageTopField - pageBottomField;
                var leftFieldInPt = pageLeftField / vector_koef;
                var topFieldInPt = pageTopField / vector_koef;
                var rightFieldInPt = pageRightField / vector_koef;
                var bottomFieldInPt = pageBottomField / vector_koef;
                if (pageHeadings) {
                    leftFieldInPt += this.cellsLeft;
                    topFieldInPt += this.cellsTop;
                }
                var pageWidthWithFieldsHeadings = (pageWidth - pageRightField) / vector_koef - leftFieldInPt;
                var pageHeightWithFieldsHeadings = (pageHeight - pageBottomField) / vector_koef - topFieldInPt;
                var currentColIndex = (null !== activeRange) ? activeRange.c1 : 0;
                var currentWidth = 0;
                var currentRowIndex = (null !== activeRange) ? activeRange.r1 : 0;
                var currentHeight = 0;
                var isCalcColumnsWidth = true;
                var bIsAddOffset = false;
                var nCountOffset = 0;
                while (true) {
                    if (currentColIndex === maxCols && currentRowIndex === maxRows) {
                        break;
                    }
                    var newPagePrint = new asc_CPagePrint();
                    var colIndex = currentColIndex,
                    rowIndex = currentRowIndex;
                    newPagePrint.indexWorksheet = indexWorksheet;
                    newPagePrint.pageWidth = pageWidth;
                    newPagePrint.pageHeight = pageHeight;
                    newPagePrint.pageClipRectLeft = pageLeftField / vector_koef;
                    newPagePrint.pageClipRectTop = pageTopField / vector_koef;
                    newPagePrint.pageClipRectWidth = pageWidthWithFields / vector_koef;
                    newPagePrint.pageClipRectHeight = pageHeightWithFields / vector_koef;
                    newPagePrint.leftFieldInPt = leftFieldInPt;
                    newPagePrint.topFieldInPt = topFieldInPt;
                    newPagePrint.rightFieldInPt = rightFieldInPt;
                    newPagePrint.bottomFieldInPt = bottomFieldInPt;
                    for (rowIndex = currentRowIndex; rowIndex < maxRows; ++rowIndex) {
                        var currentRowHeight = this.rows[rowIndex].height;
                        if (currentHeight + currentRowHeight > pageHeightWithFieldsHeadings) {
                            break;
                        }
                        if (isCalcColumnsWidth) {
                            for (colIndex = currentColIndex; colIndex < maxCols; ++colIndex) {
                                var currentColWidth = this.cols[colIndex].width;
                                if (bIsAddOffset) {
                                    newPagePrint.startOffset = ++nCountOffset;
                                    newPagePrint.startOffsetPt = (pageWidthWithFieldsHeadings * newPagePrint.startOffset);
                                    currentColWidth -= newPagePrint.startOffsetPt;
                                }
                                if (c_oAscLayoutPageType.FitToWidth !== layoutPageType && currentWidth + currentColWidth > pageWidthWithFieldsHeadings && colIndex !== currentColIndex) {
                                    break;
                                }
                                currentWidth += currentColWidth;
                                if (c_oAscLayoutPageType.FitToWidth !== layoutPageType && currentWidth > pageWidthWithFieldsHeadings && colIndex === currentColIndex) {
                                    bIsAddOffset = true;
                                    ++colIndex;
                                    break;
                                } else {
                                    bIsAddOffset = false;
                                }
                            }
                            isCalcColumnsWidth = false;
                            if (pageHeadings) {
                                currentWidth += this.cellsLeft;
                            }
                            if (c_oAscLayoutPageType.FitToWidth === layoutPageType) {
                                newPagePrint.pageClipRectWidth = Math.max(currentWidth, newPagePrint.pageClipRectWidth);
                                newPagePrint.pageWidth = newPagePrint.pageClipRectWidth * vector_koef + (pageLeftField + pageRightField);
                            } else {
                                newPagePrint.pageClipRectWidth = Math.min(currentWidth, newPagePrint.pageClipRectWidth);
                            }
                        }
                        currentHeight += currentRowHeight;
                        currentWidth = 0;
                    }
                    isCalcColumnsWidth = true;
                    if (pageGridLines) {
                        newPagePrint.pageGridLines = true;
                    }
                    if (pageHeadings) {
                        newPagePrint.pageHeadings = true;
                    }
                    newPagePrint.pageRange = asc_Range(currentColIndex, currentRowIndex, colIndex - 1, rowIndex - 1);
                    if (bIsAddOffset) {
                        colIndex -= 1;
                    } else {
                        nCountOffset = 0;
                    }
                    if (colIndex < maxCols) {
                        currentColIndex = colIndex;
                        currentHeight = 0;
                    } else {
                        currentColIndex = (null !== activeRange) ? activeRange.c1 : 0;
                        currentRowIndex = rowIndex;
                        currentHeight = 0;
                    }
                    if (rowIndex === maxRows) {
                        if (colIndex < maxCols) {
                            currentColIndex = colIndex;
                            currentHeight = 0;
                        } else {
                            currentColIndex = colIndex;
                            currentRowIndex = rowIndex;
                        }
                    }
                    arrResult.push(newPagePrint);
                }
            }
            return arrResult;
        },
        drawForPrint: function (drawingCtx, printPagesData) {
            var isAppBridge = (undefined != window["appBridge"]);
            if (null === printPagesData) {
                drawingCtx.BeginPage(c_oAscPrintDefaultSettings.PageWidth, c_oAscPrintDefaultSettings.PageHeight);
                drawingCtx.EndPage();
            } else {
                drawingCtx.BeginPage(printPagesData.pageWidth, printPagesData.pageHeight);
                drawingCtx.AddClipRect(printPagesData.pageClipRectLeft, printPagesData.pageClipRectTop, printPagesData.pageClipRectWidth, printPagesData.pageClipRectHeight);
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                var offsetCols = printPagesData.startOffsetPt;
                var range = printPagesData.pageRange;
                var offsetX = this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols;
                var offsetY = this.rows[range.r1].top - printPagesData.topFieldInPt;
                var tmpVisibleRange = this.visibleRange;
                this.visibleRange = range;
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                if (printPagesData.pageHeadings) {
                    this._drawColumnHeaders(drawingCtx, range.c1, range.c2, undefined, offsetX, printPagesData.topFieldInPt - this.cellsTop);
                    this._drawRowHeaders(drawingCtx, range.r1, range.r2, undefined, printPagesData.leftFieldInPt - this.cellsLeft, offsetY);
                }
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                if (printPagesData.pageGridLines) {
                    this._drawGrid(drawingCtx, range, offsetX, offsetY, printPagesData.pageWidth / vector_koef, printPagesData.pageHeight / vector_koef);
                }
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                this._drawCells(drawingCtx, range, offsetX, offsetY);
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                this._drawCellsBorders(drawingCtx, range, undefined, offsetX, offsetY);
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                var drawingPrintOptions = {
                    ctx: drawingCtx,
                    printPagesData: printPagesData
                };
                this.objectRender.showDrawingObjectsEx(false, drawingPrintOptions);
                this.visibleRange = tmpVisibleRange;
                if (isAppBridge) {
                    window["appBridge"]["dummyCommandUpdate"]();
                }
                drawingCtx.RemoveClipRect();
                drawingCtx.EndPage();
            }
        },
        draw: function (lockDraw) {
            if (lockDraw) {
                return this;
            }
            this._clean();
            this._drawCorner();
            this._drawColumnHeaders(undefined);
            this._drawRowHeaders(undefined);
            this._drawGrid(undefined);
            this._drawCells(undefined);
            this._drawCellsBorders(undefined);
            this._fixSelectionOfMergedCells();
            this._fixSelectionOfHiddenCells();
            this._drawGraphic();
            this.objectRender.showDrawingObjectsEx(true);
            if (this.overlayCtx) {
                this._drawSelection();
            }
            return this;
        },
        _clean: function () {
            this.drawingCtx.setFillStyle(this.settings.cells.defaultState.background).fillRect(0, 0, this.drawingCtx.getWidth(), this.drawingCtx.getHeight());
            if (this.overlayCtx) {
                this.overlayCtx.clear();
            }
        },
        drawHighlightedHeaders: function (col, row) {
            this._activateOverlayCtx();
            if (col >= 0 && col !== this.highlightedCol) {
                this._doCleanHighlightedHeaders();
                this.highlightedCol = col;
                this._drawColumnHeaders(undefined, col, col, kHeaderHighlighted);
            } else {
                if (row >= 0 && row !== this.highlightedRow) {
                    this._doCleanHighlightedHeaders();
                    this.highlightedRow = row;
                    this._drawRowHeaders(undefined, row, row, kHeaderHighlighted);
                }
            }
            this._deactivateOverlayCtx();
            return this;
        },
        cleanHighlightedHeaders: function () {
            this._activateOverlayCtx();
            this._doCleanHighlightedHeaders();
            this._deactivateOverlayCtx();
            return this;
        },
        _activateOverlayCtx: function () {
            this.drawingCtx = this.buffers.overlay;
        },
        _deactivateOverlayCtx: function () {
            this.drawingCtx = this.buffers.main;
        },
        _doCleanHighlightedHeaders: function () {
            var hlc = this.highlightedCol,
            hlr = this.highlightedRow,
            arn = this.activeRange.clone(true);
            var hStyle = this.objectRender.selectedGraphicObjectsExists() ? kHeaderDefault : kHeaderActive;
            if (hlc >= 0) {
                if (hlc >= arn.c1 && hlc <= arn.c2) {
                    this._drawColumnHeaders(undefined, hlc, hlc, hStyle);
                } else {
                    this._cleanColumnHeaders(hlc);
                    if (hlc + 1 === arn.c1) {
                        this._drawColumnHeaders(undefined, hlc + 1, hlc + 1, kHeaderActive);
                    } else {
                        if (hlc - 1 === arn.c2) {
                            this._drawColumnHeaders(undefined, hlc - 1, hlc - 1, hStyle);
                        }
                    }
                }
                this.highlightedCol = -1;
            }
            if (hlr >= 0) {
                if (hlr >= arn.r1 && hlr <= arn.r2) {
                    this._drawRowHeaders(undefined, hlr, hlr, hStyle);
                } else {
                    this._cleanRowHeades(hlr);
                    if (hlr + 1 === arn.r1) {
                        this._drawRowHeaders(undefined, hlr + 1, hlr + 1, kHeaderActive);
                    } else {
                        if (hlr - 1 === arn.r2) {
                            this._drawRowHeaders(undefined, hlr - 1, hlr - 1, hStyle);
                        }
                    }
                }
                this.highlightedRow = -1;
            }
        },
        _drawActiveHeaders: function () {
            var arn = this.activeRange.clone(true),
            vr = this.visibleRange,
            c1 = Math.max(vr.c1, arn.c1),
            c2 = Math.min(vr.c2, arn.c2),
            r1 = Math.max(vr.r1, arn.r1),
            r2 = Math.min(vr.r2, arn.r2);
            this._activateOverlayCtx();
            this._drawColumnHeaders(undefined, c1, c2, kHeaderActive);
            this._drawRowHeaders(undefined, r1, r2, kHeaderActive);
            this._deactivateOverlayCtx();
        },
        _drawCorner: function () {
            if (false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
                return;
            }
            var x2 = this.headersLeft + this.headersWidth;
            var x1 = x2 - this.headersHeight;
            var y2 = this.headersTop + this.headersHeight;
            var y1 = this.headersTop;
            var dx = 4 * this.width_1px;
            var dy = 4 * this.height_1px;
            this._drawHeader(undefined, this.headersLeft, this.headersTop, this.headersWidth, this.headersHeight, kHeaderDefault, true, -1);
            this.drawingCtx.beginPath().moveTo(x2 - dx, y1 + dy).lineTo(x2 - dx, y2 - dy).lineTo(x1 + dx, y2 - dy).lineTo(x2 - dx, y1 + dy).setFillPattern(this.settings.header.cornerColor).fill();
        },
        _drawColumnHeaders: function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
            if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
                return;
            }
            var cells = this.settings.cells;
            var vr = this.visibleRange;
            var offsetX = (offsetXForDraw) ? offsetXForDraw : this.cols[vr.c1].left - this.cellsLeft;
            var offsetY = (offsetYForDraw) ? offsetYForDraw : this.headersTop;
            if (asc_typeof(start) !== "number") {
                start = vr.c1;
            }
            if (asc_typeof(end) !== "number") {
                end = vr.c2;
            }
            if (style === undefined) {
                style = kHeaderDefault;
            }
            this._setFont(drawingCtx, cells.fontName, cells.fontSize);
            for (var i = start; i <= end; ++i) {
                this._drawHeader(drawingCtx, this.cols[i].left - offsetX, offsetY, this.cols[i].width, this.headersHeight, style, true, i);
            }
        },
        _drawRowHeaders: function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
            if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
                return;
            }
            var cells = this.settings.cells;
            var vr = this.visibleRange;
            var offsetX = (offsetXForDraw) ? offsetXForDraw : this.headersLeft;
            var offsetY = (offsetYForDraw) ? offsetYForDraw : this.rows[vr.r1].top - this.cellsTop;
            if (asc_typeof(start) !== "number") {
                start = vr.r1;
            }
            if (asc_typeof(end) !== "number") {
                end = vr.r2;
            }
            if (style === undefined) {
                style = kHeaderDefault;
            }
            this._setFont(drawingCtx, cells.fontName, cells.fontSize);
            for (var i = start; i <= end; ++i) {
                this._drawHeader(drawingCtx, offsetX, this.rows[i].top - offsetY, this.headersWidth, this.rows[i].height, style, false, i);
            }
        },
        _drawHeader: function (drawingCtx, x, y, w, h, style, isColHeader, index) {
            var isZeroHeader = false;
            if (-1 !== index) {
                if (isColHeader) {
                    if (w < this.width_1px) {
                        isZeroHeader = true;
                        w = this.width_1px;
                        if (0 < index && 0 === this.cols[index - 1].width) {
                            return;
                        }
                    } else {
                        if (0 < index && 0 === this.cols[index - 1].width) {
                            w -= this.width_1px;
                            x += this.width_1px;
                        }
                    }
                } else {
                    if (h < this.height_1px) {
                        isZeroHeader = true;
                        h = this.height_1px;
                        if (0 < index && 0 === this.rows[index - 1].height) {
                            return;
                        }
                    } else {
                        if (0 < index && 0 === this.rows[index - 1].height) {
                            h -= this.height_1px;
                            y += this.height_1px;
                        }
                    }
                }
            }
            var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
            var st = this.settings.header.style[style];
            var x2 = x + w - this.width_1px;
            var y2 = y + h - this.height_1px;
            if (!isZeroHeader) {
                ctx.setFillStyle(st.background).fillRect(x, y, w, h);
            }
            ctx.setStrokeStyle(st.border).setLineWidth(1).beginPath();
            if (style !== kHeaderDefault && !isColHeader) {
                ctx.lineHor(x, y - this.height_1px, x2 + this.width_1px);
            }
            ctx.lineVer(x2, y, y2);
            ctx.lineHor(x, y2, x2 + this.width_1px);
            if (style !== kHeaderDefault && isColHeader) {
                ctx.lineVer(x - this.width_1px, y, y2 + this.height_1px);
            }
            ctx.stroke();
            if (isZeroHeader || -1 === index) {
                return;
            }
            var text = isColHeader ? this._getColumnTitle(index) : this._getRowTitle(index);
            var sr = this.stringRender;
            var tm = this._roundTextMetrics(sr.measureString(text));
            var bl = y2 - (isColHeader ? this.defaultRowDescender : this.rows[index].descender);
            var textX = this._calcTextHorizPos(x, x2, tm, tm.width < w ? khaCenter : khaLeft);
            var textY = this._calcTextVertPos(y, y2, bl, tm, kvaBottom);
            if (drawingCtx) {
                ctx.AddClipRect(x, y, w, h);
                ctx.setFillStyle(st.color).fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths);
                ctx.RemoveClipRect();
            } else {
                ctx.save().beginPath().rect(x, y, w, h).clip().setFillStyle(st.color).fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths).restore();
            }
        },
        _cleanColumnHeaders: function (colStart, colEnd) {
            var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
            if (colEnd === undefined) {
                colEnd = colStart;
            }
            colStart = Math.max(this.visibleRange.c1, colStart);
            colEnd = Math.min(this.visibleRange.c2, colEnd);
            for (var i = colStart; i <= colEnd; ++i) {
                this.drawingCtx.clearRect(this.cols[i].left - offsetX - this.width_1px, this.headersTop, this.cols[i].width + this.width_1px, this.headersHeight);
            }
        },
        _cleanRowHeades: function (rowStart, rowEnd) {
            var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            if (rowEnd === undefined) {
                rowEnd = rowStart;
            }
            rowStart = Math.max(this.visibleRange.r1, rowStart);
            rowEnd = Math.min(this.visibleRange.r2, rowEnd);
            for (var i = rowStart; i <= rowEnd; ++i) {
                if (this.height_1px > this.rows[i].height) {
                    continue;
                }
                this.drawingCtx.clearRect(this.headersLeft, this.rows[i].top - offsetY - this.height_1px, this.headersWidth, this.rows[i].height + this.height_1px);
            }
        },
        _cleanColumnHeadersRect: function () {
            this.drawingCtx.clearRect(this.cellsLeft, this.headersTop, this.drawingCtx.getWidth() - this.cellsLeft, this.headersHeight);
        },
        _drawGrid: function (drawingCtx, range, leftFieldInPt, topFieldInPt, width, height) {
            if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowGridLines()) {
                return;
            }
            if (range === undefined) {
                range = this.visibleRange;
            }
            var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
            var widthCtx = (width) ? width : ctx.getWidth();
            var heightCtx = (height) ? height : ctx.getHeight();
            var offsetX = (leftFieldInPt) ? leftFieldInPt : this.cols[this.visibleRange.c1].left - this.cellsLeft;
            var offsetY = (topFieldInPt) ? topFieldInPt : this.rows[this.visibleRange.r1].top - this.cellsTop;
            var x1 = this.cols[range.c1].left - offsetX;
            var y1 = this.rows[range.r1].top - offsetY;
            var x2 = Math.min(this.cols[range.c2].left - offsetX + this.cols[range.c2].width, widthCtx);
            var y2 = Math.min(this.rows[range.r2].top - offsetY + this.rows[range.r2].height, heightCtx);
            ctx.setFillStyle(this.settings.cells.defaultState.background).fillRect(x1, y1, x2 - x1, y2 - y1).setStrokeStyle(this.settings.cells.defaultState.border).setLineWidth(1).beginPath();
            var w, h;
            for (var i = range.c1, x = x1 - this.width_1px; i <= range.c2 && x <= x2; ++i) {
                w = this.cols[i].width;
                x += w;
                if (w >= this.width_1px) {
                    ctx.lineVer(x, y1, y2);
                }
            }
            for (var j = range.r1, y = y1 - this.height_1px; j <= range.r2 && y <= y2; ++j) {
                h = this.rows[j].height;
                y += h;
                if (h >= this.height_1px) {
                    ctx.lineHor(x1, y, x2);
                }
            }
            ctx.stroke();
        },
        _drawCells: function (drawingCtx, range, offsetX, offsetY) {
            if (range === undefined) {
                range = this.visibleRange;
            }
            this._prepareCellTextMetricsCache(range);
            var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
            offsetX = (undefined === offsetX) ? this.cols[this.visibleRange.c1].left - this.cellsLeft : offsetX;
            offsetY = (undefined === offsetY) ? this.rows[this.visibleRange.r1].top - this.cellsTop : offsetY;
            var mergedCells = {},
            mc, i;
            if (!drawingCtx) {
                ctx.save().beginPath().rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop).clip();
            }
            for (var row = range.r1; row <= range.r2; ++row) {
                $.extend(mergedCells, this._drawRowBG(drawingCtx, row, range.c1, range.c2, offsetX, offsetY, null), this._drawRowText(drawingCtx, row, range.c1, range.c2, offsetX, offsetY));
            }
            for (i in mergedCells) {
                if (mergedCells.hasOwnProperty(i)) {
                    mc = mergedCells[i];
                    this._drawRowBG(drawingCtx, mc.r1, mc.c1, mc.c1, offsetX, offsetY, mc);
                    this._drawCellText(drawingCtx, mc.c1, mc.r1, range.c1, range.c2, offsetX, offsetY, true);
                }
            }
            if (!drawingCtx) {
                ctx.restore();
            }
        },
        _drawRowBG: function (drawingCtx, row, colStart, colEnd, offsetX, offsetY, oMergedCell) {
            if (this.rows[row].height < this.height_1px && null === oMergedCell) {
                return {};
            }
            var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
            for (var mergedCells = {}, col = colStart; col <= colEnd; ++col) {
                if (this.cols[col].width < this.width_1px && null === oMergedCell) {
                    continue;
                }
                var c = this._getVisibleCell(col, row);
                if (!c) {
                    continue;
                }
                var bg = c.getFill();
                if (null != bg) {
                    bg = bg.getRgb();
                }
                var mc = null;
                var mwidth = 0,
                mheight = 0;
                if (null === oMergedCell) {
                    mc = this.model.getMergedByCell(row, col);
                    if (null !== mc) {
                        mergedCells[mc.r1 + "_" + mc.c1] = {
                            c1: mc.c1,
                            r1: mc.r1,
                            c2: mc.c2,
                            r2: mc.r2
                        };
                        col = mc.c2;
                        continue;
                    }
                } else {
                    mc = oMergedCell;
                }
                if (null !== mc) {
                    if (col !== mc.c1 || row !== mc.r1) {
                        continue;
                    }
                    for (var i = mc.c1 + 1; i <= mc.c2 && i < this.nColsCount; ++i) {
                        mwidth += this.cols[i].width;
                    }
                    for (var j = mc.r1 + 1; j <= mc.r2 && j < this.nRowsCount; ++j) {
                        mheight += this.rows[j].height;
                    }
                } else {
                    if (bg === null) {
                        if (col === colEnd && col < this.cols.length - 1 && row < this.rows.length - 1) {
                            var c2 = this._getVisibleCell(col + 1, row);
                            if (c2) {
                                var bg2 = c2.getFill();
                                if (bg2 !== null) {
                                    ctx.setFillStyle(asc_n2css(bg2.getRgb())).fillRect(this.cols[col + 1].left - offsetX - this.width_1px, this.rows[row].top - offsetY - this.height_1px, this.width_1px, this.rows[row].height + this.height_1px);
                                }
                            }
                            var c3 = this._getVisibleCell(col, row + 1);
                            if (c3) {
                                var bg3 = c3.getFill();
                                if (bg3 !== null) {
                                    ctx.setFillStyle(asc_n2css(bg3.getRgb())).fillRect(this.cols[col].left - offsetX - this.width_1px, this.rows[row + 1].top - offsetY - this.height_1px, this.cols[col].width + this.width_1px, this.height_1px);
                                }
                            }
                        }
                        continue;
                    }
                }
                var x = this.cols[col].left - (bg !== null ? this.width_1px : 0);
                var y = this.rows[row].top - (bg !== null ? this.height_1px : 0);
                var w = this.cols[col].width + this.width_1px * (bg !== null ? +1 : -1) + mwidth;
                var h = this.rows[row].height + this.height_1px * (bg !== null ? +1 : -1) + mheight;
                var color = bg !== null ? asc_n2css(bg) : this.settings.cells.defaultState.background;
                ctx.setFillStyle(color).fillRect(x - offsetX, y - offsetY, w, h);
            }
            return mergedCells;
        },
        _drawRowText: function (drawingCtx, row, colStart, colEnd, offsetX, offsetY) {
            if (this.rows[row].height < this.height_1px) {
                return {};
            }
            var dependentCells = {},
            mergedCells = {},
            i = undefined,
            mc;
            for (var col = colStart; col <= colEnd; ++col) {
                if (this.cols[col].width < this.width_1px) {
                    continue;
                }
                mc = this._drawCellText(drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, false);
                if (mc !== null) {
                    mergedCells[mc.index] = {
                        c1: mc.c1,
                        r1: mc.r1,
                        c2: mc.c2,
                        r2: mc.r2
                    };
                }
                i = this._findSourceOfCellText(col, row);
                if (i >= 0) {
                    dependentCells[i] = (dependentCells[i] || []);
                    dependentCells[i].push(col);
                }
            }
            for (i in dependentCells) {
                if (dependentCells.hasOwnProperty(i)) {
                    var arr = dependentCells[i],
                    j = arr.length - 1;
                    col = parseInt(i, 10);
                    if (col >= arr[0] && col <= arr[j]) {
                        continue;
                    }
                    this._drawCellText(drawingCtx, col, row, arr[0], arr[j], offsetX, offsetY, false);
                }
            }
            return mergedCells;
        },
        _drawCellText: function (drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, drawMergedCells) {
            var ct = this._getCellTextCache(col, row);
            if (ct === undefined) {
                return null;
            }
            var isMerged = ct.flags.isMerged,
            range = undefined,
            isWrapped = ct.flags.wrapText;
            var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
            if (isMerged) {
                range = ct.mc;
                if (!drawMergedCells) {
                    return {
                        c1: range.c1,
                        r1: range.r1,
                        c2: range.c2,
                        r2: range.r2,
                        index: range.r1 + "_" + range.c1
                    };
                }
                if (col !== range.c1 || row !== range.r1) {
                    return null;
                }
            }
            var colL = isMerged ? range.c1 : Math.max(colStart, col - ct.sideL);
            var colR = isMerged ? Math.min(range.c2, this.nColsCount - 1) : Math.min(colEnd, col + ct.sideR);
            var rowT = isMerged ? range.r1 : row;
            var rowB = isMerged ? Math.min(range.r2, this.nRowsCount - 1) : row;
            var isTrimmedR = !isMerged && colR !== col + ct.sideR;
            if (! (ct.angle || 0)) {
                if (!isMerged && !isWrapped) {
                    this._eraseCellRightBorder(drawingCtx, colL, colR + (isTrimmedR ? 1 : 0), row, offsetX, offsetY);
                }
            }
            var x1 = this.cols[colL].left - offsetX;
            var y1 = this.rows[rowT].top - offsetY;
            var w = this.cols[colR].left + this.cols[colR].width - offsetX - x1;
            var h = this.rows[rowB].top + this.rows[rowB].height - offsetY - y1;
            var x2 = x1 + w - (isTrimmedR ? 0 : this.width_1px);
            var y2 = y1 + h - this.height_1px;
            var bl = !isMerged ? (y2 - this.rows[rowB].descender) : (y2 - ct.metrics.height + ct.metrics.baseline);
            var x1ct = isMerged ? x1 : this.cols[col].left - offsetX;
            var x2ct = isMerged ? x2 : x1ct + this.cols[col].width - this.width_1px;
            var textX = this._calcTextHorizPos(x1ct, x2ct, ct.metrics, ct.cellHA);
            var textY = this._calcTextVertPos(y1, y2, bl, ct.metrics, ct.cellVA);
            var textW = this._calcTextWidth(x1ct, x2ct, ct.metrics, ct.cellHA);
            var xb1, yb1, wb, hb, bound, colLeft, colRight, i;
            var txtRotX, txtRotW, clipUse = false;
            if (drawingCtx) {
                if (ct.angle || 0) {
                    xb1 = this.cols[col].left - offsetX;
                    yb1 = this.rows[row].top - offsetY;
                    wb = this.cols[col].width;
                    hb = this.rows[row].height;
                    txtRotX = ct.textBound.sx + xb1;
                    txtRotW = ct.textBound.sw + xb1;
                    if (isMerged) {
                        wb = 0;
                        for (i = colL; i <= colR && i < this.nColsCount; ++i) {
                            wb += this.cols[i].width;
                        }
                        hb = 0;
                        for (i = rowT; i <= rowB && i < this.nRowsCount; ++i) {
                            hb += this.rows[i].height;
                        }
                        ctx.AddClipRect(xb1, yb1, wb, hb);
                        clipUse = true;
                    }
                    this.stringRender.angle = ct.angle;
                    this.stringRender.fontNeedUpdate = true;
                    if (90 === ct.angle || -90 === ct.angle) {
                        if (!isMerged) {
                            ctx.AddClipRect(xb1, yb1, wb, hb);
                            clipUse = true;
                        }
                    } else {
                        if (!isMerged) {
                            ctx.AddClipRect(0, yb1, this.drawingCtx.getWidth(), h);
                            clipUse = true;
                        }
                        if (!isMerged && !isWrapped) {
                            colLeft = col;
                            if (0 !== txtRotX) {
                                while (true) {
                                    if (0 == colLeft) {
                                        break;
                                    }
                                    if (txtRotX >= this.cols[colLeft].left) {
                                        break;
                                    }--colLeft;
                                }
                            }
                            colRight = Math.min(col, this.nColsCount - 1);
                            if (0 !== txtRotW) {
                                while (true) {
                                    ++colRight;
                                    if (colRight >= this.nColsCount) {
                                        --colRight;
                                        break;
                                    }
                                    if (txtRotW <= this.cols[colRight].left) {
                                        --colRight;
                                        break;
                                    }
                                }
                            }
                            colLeft = isMerged ? range.c1 : colLeft;
                            colRight = isMerged ? Math.min(range.c2, this.nColsCount - 1) : colRight;
                            this._eraseCellRightBorder(drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row, offsetX, offsetY);
                        }
                    }
                    this.stringRender.rotateAtPoint(drawingCtx, ct.angle, xb1, yb1, ct.textBound.dx, ct.textBound.dy);
                    this.stringRender.restoreInternalState(ct.state).renderForPrint(drawingCtx, 0, 0, textW, ct.color);
                    this.stringRender.resetTransform(drawingCtx);
                    if (clipUse) {
                        ctx.RemoveClipRect();
                    }
                } else {
                    ctx.AddClipRect(x1, y1, w, h);
                    this.stringRender.restoreInternalState(ct.state).renderForPrint(drawingCtx, textX, textY, textW, ct.color);
                    ctx.RemoveClipRect();
                }
            } else {
                if (ct.angle || 0) {
                    xb1 = this.cols[col].left - offsetX;
                    yb1 = this.rows[row].top - offsetY;
                    wb = this.cols[col].width;
                    hb = this.rows[row].height;
                    txtRotX = ct.textBound.sx + xb1;
                    txtRotW = ct.textBound.sw + xb1;
                    if (isMerged) {
                        wb = 0;
                        for (i = colL; i <= colR && i < this.nColsCount; ++i) {
                            wb += this.cols[i].width;
                        }
                        hb = 0;
                        for (i = rowT; i <= rowB && i < this.nRowsCount; ++i) {
                            hb += this.rows[i].height;
                        }
                        ctx.save().beginPath().rect(xb1, yb1, wb, hb).clip();
                        clipUse = true;
                    }
                    this.stringRender.angle = ct.angle;
                    this.stringRender.fontNeedUpdate = true;
                    if (90 === ct.angle || -90 === ct.angle) {
                        if (!isMerged) {
                            ctx.save().beginPath().rect(xb1, yb1, wb, hb).clip();
                            clipUse = true;
                        }
                    } else {
                        if (!isMerged) {
                            ctx.save().beginPath().rect(0, y1, this.drawingCtx.getWidth(), h).clip();
                            clipUse = true;
                        }
                        if (!isMerged && !isWrapped) {
                            colLeft = col;
                            if (0 !== txtRotX) {
                                while (true) {
                                    if (0 == colLeft) {
                                        break;
                                    }
                                    if (txtRotX >= this.cols[colLeft].left) {
                                        break;
                                    }--colLeft;
                                }
                            }
                            colRight = Math.min(col, this.nColsCount - 1);
                            if (0 !== txtRotW) {
                                while (true) {
                                    ++colRight;
                                    if (colRight >= this.nColsCount) {
                                        --colRight;
                                        break;
                                    }
                                    if (txtRotW <= this.cols[colRight].left) {
                                        --colRight;
                                        break;
                                    }
                                }
                            }
                            colLeft = isMerged ? range.c1 : colLeft;
                            colRight = isMerged ? Math.min(range.c2, this.nColsCount - 1) : colRight;
                            this._eraseCellRightBorder(drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row, offsetX, offsetY);
                        }
                    }
                    this.stringRender.rotateAtPoint(null, ct.angle, xb1, yb1, ct.textBound.dx, ct.textBound.dy);
                    this.stringRender.restoreInternalState(ct.state).render(0, 0, textW, ct.color);
                    this.stringRender.resetTransform(null);
                    if (clipUse) {
                        ctx.restore();
                    }
                } else {
                    ctx.save().beginPath().rect(x1, y1, w, h).clip();
                    this.stringRender.restoreInternalState(ct.state).render(textX, textY, textW, ct.color);
                    ctx.restore();
                }
            }
            return null;
        },
        _eraseCellRightBorder: function (drawingCtx, colBeg, colEnd, row, offsetX, offsetY) {
            if (colBeg >= colEnd) {
                return;
            }
            var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
            ctx.setFillStyle(this.settings.cells.defaultState.background);
            for (var col = colBeg; col < colEnd; ++col) {
                var c = this._getCell(col, row);
                var bg = c !== undefined ? c.getFill() : null;
                if (bg !== null) {
                    continue;
                }
                ctx.fillRect(this.cols[col].left + this.cols[col].width - offsetX - this.width_1px, this.rows[row].top - offsetY, this.width_1px, this.rows[row].height - this.height_1px);
            }
        },
        _drawCellsBorders: function (drawingCtx, range, mergedCellsStage, leftFieldInPt, topFieldInPt) {
            if (range === undefined) {
                range = this.visibleRange;
            }
            var t = this;
            var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
            var offsetX = (leftFieldInPt) ? leftFieldInPt : this.cols[this.visibleRange.c1].left - this.cellsLeft;
            var offsetY = (topFieldInPt) ? topFieldInPt : this.rows[this.visibleRange.r1].top - this.cellsTop;
            var bc = undefined;
            var color = undefined;
            function drawBorderHor(border, x1, y, x2) {
                if (border.s !== c_oAscBorderStyles.None && !border.isErased) {
                    if (bc !== border.c) {
                        bc = border.c;
                        color = asc_n2css(bc);
                        ctx.setStrokeStyle(color);
                    }
                    ctx.setLineWidth(border.w).beginPath().lineHor(x1, y, x2).stroke();
                }
            }
            function drawBorderVer(border, x1, y1, y2) {
                if (border.s !== c_oAscBorderStyles.None && !border.isErased) {
                    if (bc !== border.c) {
                        bc = border.c;
                        color = asc_n2css(bc);
                        ctx.setStrokeStyle(color);
                    }
                    ctx.setLineWidth(border.w).beginPath().lineVer(x1, y1, y2).stroke();
                }
            }
            function drawDiag(border, x1, y1, x2, y2) {
                if (border.s !== c_oAscBorderStyles.None && !border.isErased) {
                    if (bc !== border.c) {
                        bc = border.c;
                        color = asc_n2css(bc);
                        ctx.setStrokeStyle(color);
                    }
                    ctx.setLineWidth(border.w).beginPath().lineDiag(x1, y1, x2, y2).stroke();
                }
            }
            if (!drawingCtx) {
                ctx.save().beginPath().rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop).clip();
            }
            for (var row = range.r1; row <= range.r2 && row < this.nRowsCount; ++row) {
                if (this.rows[row].height < this.height_1px) {
                    continue;
                }
                var isFirstRow = row === range.r1;
                var isLastRow = row === range.r2;
                var y1 = this.rows[row].top - offsetY;
                var y2 = y1 + this.rows[row].height - this.height_1px;
                var mc = null;
                for (var isMerged = false, hasHideCol = false, col = range.c1; col <= range.c2 && col < this.nColsCount; ++col, isMerged = false) {
                    if (this.cols[col].width < this.width_1px) {
                        hasHideCol = true;
                        continue;
                    }
                    var isFirstCol = col === range.c1;
                    if (!mergedCellsStage) {
                        mc = this.model.getMergedByCell(row, col);
                        if (mc) {
                            if ((col === mc.c1 || isFirstCol) && (row === mc.r1 || isFirstRow)) {
                                mc = mc.intersectionSimple(this.visibleRange);
                                if (null === mc) {
                                    break;
                                }
                                this._drawCellsBorders(drawingCtx, mc, true, leftFieldInPt, topFieldInPt);
                            }
                            isMerged = true;
                            col = mc.c2;
                            if (col >= this.nColsCount) {
                                col = this.nColsCount - 1;
                            }
                        }
                    }
                    var x1 = this.cols[col].left - offsetX;
                    var x2 = x1 + this.cols[col].width - this.width_1px;
                    var dd = this._getActiveBorder(col, row, kcbidDiagonalDown);
                    var du = this._getActiveBorder(col, row, kcbidDiagonalUp);
                    var lb = (isFirstCol || hasHideCol) ? this._getActiveBorder(col, row, kcbidLeft) : rb;
                    var lbPrev = (isFirstCol || hasHideCol) ? this._getActiveBorder(col, row - 1, kcbidLeft) : rbPrev;
                    var lbNext = (isFirstCol || hasHideCol) ? this._getActiveBorder(col, row + 1, kcbidLeft) : rbNext;
                    var tbPrev = (isFirstCol || hasHideCol) ? this._getActiveBorder(col - 1, row, kcbidTop) : tb;
                    var bbPrev = (isFirstCol || hasHideCol) ? this._getActiveBorder(col - 1, row, kcbidBottom) : bb;
                    var tb = (isFirstCol || hasHideCol) ? this._getActiveBorder(col, row, kcbidTop) : tbNext;
                    var bb = (isFirstCol || hasHideCol) ? this._getActiveBorder(col, row, kcbidBottom) : bbNext;
                    var rb = this._getActiveBorder(col, row, kcbidRight);
                    var rbPrev = this._getActiveBorder(col, row - 1, kcbidRight);
                    var rbNext = this._getActiveBorder(col, row + 1, kcbidRight);
                    var tbNext = this._getActiveBorder(col + 1, row, kcbidTop);
                    var bbNext = this._getActiveBorder(col + 1, row, kcbidBottom);
                    if (isMerged || mergedCellsStage && row !== range.r1 && row !== range.r2 && col !== range.c1 && col !== range.c2) {
                        continue;
                    }
                    var hasDD = dd.w > 0 && dd.s !== c_oAscBorderStyles.None;
                    var hasDU = du.w > 0 && du.s !== c_oAscBorderStyles.None;
                    if ((hasDD || hasDU) && (!mergedCellsStage || row === range.r1 && col === range.c1)) {
                        ctx.save().beginPath().rect(x1 + this.width_1px * (lb.w < 1 ? -1 : (lb.w < 3 ? 0 : +1)), y1 + this.width_1px * (tb.w < 1 ? -1 : (tb.w < 3 ? 0 : +1)), this.cols[col].width + this.width_1px * (-1 + (lb.w < 1 ? +1 : (lb.w < 3 ? 0 : -1)) + (rb.w < 1 ? +1 : (rb.w < 2 ? 0 : -1))), this.rows[row].height + this.height_1px * (-1 + (tb.w < 1 ? +1 : (tb.w < 3 ? 0 : -1)) + (bb.w < 1 ? +1 : (bb.w < 2 ? 0 : -1)))).clip();
                        if (hasDD) {
                            drawDiag(dd, x1 - this.width_1px, y1 - this.height_1px, x2, y2);
                        }
                        if (hasDU) {
                            drawDiag(du, x1 - this.width_1px, y2, x2, y1 - this.height_1px);
                        }
                        ctx.restore();
                        bc = undefined;
                    }
                    function drawVerticalBorder(bor, tb1, tb2, bb1, bb2, x, y1, y2) {
                        if (bor.w < 1 || bor.isErased) {
                            return;
                        }
                        var tbw = t._calcMaxBorderWidth(tb1, tb2);
                        var bbw = t._calcMaxBorderWidth(bb1, bb2);
                        var dy1 = tbw > bor.w ? tbw - 1 : (tbw > 1 ? -1 : 0);
                        var dy2 = bbw > bor.w ? -2 : (bbw > 2 ? 1 : 0);
                        drawBorderVer(bor, x, y1 + (-1 + dy1) * t.height_1px, y2 + (1 + dy2) * t.height_1px);
                    }
                    function drawHorizontalBorder(bor, lb, lbOther, rb, rbOther, x1, y, x2) {
                        if (bor.w > 0) {
                            var lbw = this._calcMaxBorderWidth(lb, lbOther);
                            var rbw = this._calcMaxBorderWidth(rb, rbOther);
                            var dx1 = bor.w > lbw ? (lbw > 1 ? -1 : 0) : (lbw > 2 ? 2 : 1);
                            var dx2 = bor.w > rbw ? (rbw > 2 ? 1 : 0) : (rbw > 1 ? -2 : -1);
                            drawBorderHor(bor, x1 + (-1 + dx1) * t.width_1px, y, x2 + (1 + dx2) * t.width_1px);
                        }
                    }
                    if (isFirstCol) {
                        drawVerticalBorder.call(this, lb, tb, tbPrev, bb, bbPrev, x1 - this.width_1px, y1, y2);
                        if (lb.w >= 1 && false == lb.isErased && drawingCtx && 0 === col) {
                            drawVerticalBorder.call(this, lb, tb, tbPrev, bb, bbPrev, x1, y1, y2);
                        }
                    }
                    if (!mergedCellsStage || col === range.c2) {
                        drawVerticalBorder.call(this, rb, tb, tbNext, bb, bbNext, x2, y1, y2);
                    }
                    if (isFirstRow) {
                        drawHorizontalBorder.call(this, tb, lb, lbPrev, rb, rbPrev, x1, y1 - this.height_1px, x2);
                        if (tb.w > 0 && drawingCtx && 0 === row) {
                            drawHorizontalBorder.call(this, tb, lb, lbPrev, rb, rbPrev, x1, y1, x2);
                        }
                    }
                    if (!mergedCellsStage || isLastRow) {
                        drawHorizontalBorder.call(this, bb, lb, lbNext, rb, rbNext, x1, y2, x2);
                    }
                }
            }
            if (!drawingCtx) {
                ctx.restore();
            }
        },
        _drawSelection: function (range) {
            if (!this.isSelectionDialogMode) {
                this._drawCollaborativeElements(true);
                this._drawSelectionRange(range);
                if (this.objectRender.selectedGraphicObjectsExists()) {
                    this.objectRender.raiseLayerDrawingObjects();
                }
            } else {
                this._drawSelectionRange(range);
            }
        },
        _drawSelectionRange: function (range) {
            if (asc["editor"].isStartAddShape || this.objectRender.selectedGraphicObjectsExists()) {
                if (this.isChartAreaEditMode) {
                    this._drawFormulaRange(this.arrActiveChartsRanges);
                }
                return;
            }
            if (c_oAscSelectionType.RangeMax === this.activeRange.type) {
                this.activeRange.c2 = this.cols.length - 1;
                this.activeRange.r2 = this.rows.length - 1;
            } else {
                if (c_oAscSelectionType.RangeCol === this.activeRange.type) {
                    this.activeRange.r2 = this.rows.length - 1;
                } else {
                    if (c_oAscSelectionType.RangeRow === this.activeRange.type) {
                        this.activeRange.c2 = this.cols.length - 1;
                    }
                }
            }
            if (!this.isSelectionDialogMode) {
                range = this.activeRange.intersection(range !== undefined ? range : this.visibleRange);
            } else {
                range = this.copyOfActiveRange.intersection(range !== undefined ? range : this.visibleRange);
            }
            var aFH = null;
            var aFHIntersection = null;
            if (this.activeFillHandle !== null) {
                aFH = this.activeFillHandle.clone(true);
                aFHIntersection = this.activeFillHandle.intersection(this.visibleRange);
            }
            if (!range && !aFHIntersection && !this.isFormulaEditMode && !this.activeMoveRange && !this.isChartAreaEditMode) {
                this._drawActiveHeaders();
                if (this.isSelectionDialogMode) {
                    this._drawSelectRange(this.activeRange.clone(true));
                }
                return;
            }
            var ctx = this.overlayCtx;
            var opt = this.settings;
            var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
            var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            var arn = (!this.isSelectionDialogMode) ? this.activeRange.clone(true) : this.copyOfActiveRange.clone(true);
            var x1 = (range) ? (this.cols[range.c1].left - offsetX - this.width_1px) : 0;
            var x2 = (range) ? (this.cols[range.c2].left + this.cols[range.c2].width - offsetX - this.width_1px) : 0;
            var y1 = (range) ? (this.rows[range.r1].top - offsetY) : 0;
            var y2 = (range) ? (this.rows[range.r2].top + this.rows[range.r2].height - offsetY - this.height_1px) : 0;
            var drawLeftSide = (range) ? (range.c1 === arn.c1) : false;
            var drawRightSide = (range) ? (range.c2 === arn.c2) : false;
            var drawTopSide = (range) ? (range.r1 === arn.r1) : false;
            var drawBottomSide = (range) ? (range.r2 === arn.r2) : false;
            var l, t, r, b, cr;
            var fillHandleWidth = 2 * this.width_2px + this.width_1px;
            var fillHandleHeight = 2 * this.height_2px + this.height_1px;
            var xFH1 = 0;
            var xFH2 = 0;
            var yFH1 = 0;
            var yFH2 = 0;
            var drawLeftFillHandle;
            var drawRightFillHandle;
            var drawTopFillHandle;
            var drawBottomFillHandle;
            ctx.save().beginPath().rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop).clip();
            l = drawLeftSide ? -this.width_1px : 0;
            r = drawRightSide ? this.width_1px : 0;
            t = drawTopSide ? -this.height_1px : 0;
            b = drawBottomSide ? this.height_2px : 0;
            ctx.setStrokeStyle(opt.activeCellBorderColor).setLineWidth(3).beginPath();
            if (aFHIntersection) {
                xFH1 = this.cols[aFHIntersection.c1].left - offsetX - this.width_1px;
                xFH2 = this.cols[aFHIntersection.c2].left + this.cols[aFHIntersection.c2].width - offsetX - this.width_1px;
                yFH1 = this.rows[aFHIntersection.r1].top - offsetY;
                yFH2 = this.rows[aFHIntersection.r2].top + this.rows[aFHIntersection.r2].height - offsetY - this.height_1px;
                drawLeftFillHandle = aFHIntersection.c1 === aFH.c1;
                drawRightFillHandle = aFHIntersection.c2 === aFH.c2;
                drawTopFillHandle = aFHIntersection.r1 === aFH.r1;
                drawBottomFillHandle = aFHIntersection.r2 === aFH.r2;
                if (aFHIntersection.c1 !== aFHIntersection.c2 || aFHIntersection.r1 !== aFHIntersection.r2 || 2 !== this.fillHandleArea) {
                    if (drawTopFillHandle) {
                        ctx.lineHor(xFH1 + l, yFH1 - this.height_1px, xFH2 + this.width_1px + r);
                    }
                    if (drawBottomFillHandle) {
                        ctx.lineHor(xFH1 + l, yFH2, xFH2 + this.width_1px + r);
                    }
                    if (drawLeftFillHandle) {
                        ctx.lineVer(xFH1, yFH1 + t, yFH2 + b);
                    }
                    if (drawRightFillHandle) {
                        ctx.lineVer(xFH2, yFH1 + t, yFH2 + b);
                    }
                }
                switch (this.fillHandleArea) {
                case 1:
                    switch (this.fillHandleDirection) {
                    case 0:
                        if (drawLeftSide) {
                            ctx.lineVer(x1, y1 + t, y2 + b);
                        }
                        break;
                    case 1:
                        if (drawTopSide) {
                            ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);
                        }
                        break;
                    }
                    break;
                case 2:
                    if (drawTopSide) {
                        ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);
                    }
                    if (drawBottomSide) {
                        ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r);
                    }
                    if (drawLeftSide) {
                        ctx.lineVer(x1, y1 + t, y2 + b);
                    }
                    if (drawRightSide) {
                        ctx.lineVer(x2, y1 + t, y2 + b);
                    }
                    break;
                case 3:
                    switch (this.fillHandleDirection) {
                    case 0:
                        if (range && aFH.c2 !== range.c2) {
                            if (drawRightSide) {
                                ctx.lineVer(x2, y1 + t, y2 + b);
                            }
                        }
                        break;
                    case 1:
                        if (range && aFH.r2 !== range.r2) {
                            if (drawBottomSide) {
                                ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r);
                            }
                        }
                        break;
                    }
                    break;
                }
                ctx.stroke();
            } else {
                if (drawTopSide) {
                    ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);
                }
                if (drawBottomSide) {
                    ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r - fillHandleWidth);
                }
                if (drawLeftSide) {
                    ctx.lineVer(x1, y1 + t, y2 + b);
                }
                if (drawRightSide) {
                    ctx.lineVer(x2, y1 + t, y2 + b - fillHandleHeight);
                }
            }
            ctx.stroke();
            if (range) {
                var lRect = x1 + (drawLeftSide ? this.width_3px : this.width_1px),
                rRect = x2 - (drawRightSide ? this.width_2px : 0),
                tRect = y1 + (drawTopSide ? this.height_2px : 0),
                bRect = y2 - (drawBottomSide ? this.width_2px : 0);
                ctx.setFillStyle(opt.activeCellBackground).fillRect(lRect, tRect, rRect - lRect, bRect - tRect);
                var firstCell = (!this.isSelectionDialogMode) ? this.activeRange : this.copyOfActiveRange;
                cr = this.model.getMergedByCell(firstCell.startRow, firstCell.startCol);
                cr = range.intersection(null !== cr ? cr : asc_Range(firstCell.startCol, firstCell.startRow, firstCell.startCol, firstCell.startRow));
                if (cr !== null) {
                    ctx.save().beginPath().rect(lRect, tRect, rRect - lRect, bRect - tRect).clip();
                    var _l = this.cols[cr.c1].left - offsetX - this.width_1px,
                    _r = this.cols[cr.c2].left + this.cols[cr.c2].width - offsetX,
                    _t = this.rows[cr.r1].top - offsetY - this.height_1px,
                    _b = this.rows[cr.r2].top + this.rows[cr.r2].height - offsetY;
                    ctx.clearRect(_l, _t, _r - _l, _b - _t).restore();
                }
                cr = range.intersection(asc_Range(range.c2, range.r2, range.c2, range.r2));
                if (cr !== null) {
                    this.fillHandleL = this.cols[cr.c1].left - offsetX + this.cols[cr.c1].width - this.width_1px - this.width_2px;
                    this.fillHandleR = this.fillHandleL + fillHandleWidth;
                    this.fillHandleT = this.rows[cr.r1].top - offsetY + this.rows[cr.r1].height - this.height_1px - this.height_2px;
                    this.fillHandleB = this.fillHandleT + fillHandleHeight;
                    ctx.setFillStyle(opt.activeCellBorderColor).fillRect(this.fillHandleL, this.fillHandleT, this.fillHandleR - this.fillHandleL, this.fillHandleB - this.fillHandleT);
                }
            }
            if (this.activeFillHandle !== null) {
                if (2 === this.fillHandleArea && (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2)) {
                    var lFH = xFH1 + (drawLeftFillHandle ? this.width_3px : this.width_1px),
                    rFH = xFH2 - (drawRightFillHandle ? this.width_2px : 0),
                    tFH = yFH1 + (drawTopFillHandle ? this.height_2px : 0),
                    bFH = yFH2 - (drawBottomFillHandle ? this.width_2px : 0);
                    ctx.setFillStyle(opt.activeCellBackground).fillRect(lFH, tFH, rFH - lFH, bFH - tFH);
                }
                ctx.setStrokeStyle(opt.fillHandleBorderColorSelect).setLineWidth(1).beginPath();
                if (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2 || 2 !== this.fillHandleArea) {
                    if (drawTopFillHandle) {
                        ctx.lineHor(xFH1 + l + this.width_1px, yFH1 - this.height_1px, xFH2 + r);
                    }
                    if (drawBottomFillHandle) {
                        ctx.lineHor(xFH1 + l + this.width_1px, yFH2, xFH2 + r);
                    }
                    if (drawLeftFillHandle) {
                        ctx.lineVer(xFH1, yFH1 + t + this.height_1px, yFH2 + b - this.height_1px);
                    }
                    if (drawRightFillHandle) {
                        ctx.lineVer(xFH2, yFH1 + t + this.height_1px, yFH2 + b - this.height_1px);
                    }
                }
                if (2 === this.fillHandleArea) {
                    if (drawTopSide) {
                        ctx.lineHor(x1 + l + this.width_1px, y1 - this.height_1px, x2 + r - this.width_1px);
                    }
                    if (drawBottomSide) {
                        ctx.lineHor(x1 + l + this.width_1px, y2, x2 + r - this.width_1px);
                    }
                    if (drawLeftSide) {
                        ctx.lineVer(x1, y1 + t + this.height_1px, y2 + b - this.height_1px);
                    }
                    if (drawRightSide) {
                        ctx.lineVer(x2, y1 + t + this.height_1px, y2 + b - this.height_1px);
                    }
                }
                ctx.stroke();
            }
            if (this.isFormulaEditMode) {
                this._drawFormulaRange(this.arrActiveFormulaRanges);
            }
            if (this.isChartAreaEditMode) {
                this._drawFormulaRange(this.arrActiveChartsRanges);
            }
            if (this.isSelectionDialogMode) {
                this._drawSelectRange(this.activeRange.clone(true));
            }
            if (null !== this.activeMoveRange) {
                ctx.setStrokeStyle("rgba(0,0,0,1)").setLineWidth(1).beginPath();
                var aActiveMoveRangeIntersection = this.activeMoveRange.intersection(this.visibleRange);
                if (aActiveMoveRangeIntersection) {
                    var drawLeftSideMoveRange = aActiveMoveRangeIntersection.c1 === this.activeMoveRange.c1;
                    var drawRightSideMoveRange = aActiveMoveRangeIntersection.c2 === this.activeMoveRange.c2;
                    var drawTopSideMoveRange = aActiveMoveRangeIntersection.r1 === this.activeMoveRange.r1;
                    var drawBottomSideMoveRange = aActiveMoveRangeIntersection.r2 === this.activeMoveRange.r2;
                    var xMoveRange1 = this.cols[aActiveMoveRangeIntersection.c1].left - offsetX - this.width_1px;
                    var xMoveRange2 = this.cols[aActiveMoveRangeIntersection.c2].left + this.cols[aActiveMoveRangeIntersection.c2].width - offsetX - this.width_1px;
                    var yMoveRange1 = this.rows[aActiveMoveRangeIntersection.r1].top - offsetY;
                    var yMoveRange2 = this.rows[aActiveMoveRangeIntersection.r2].top + this.rows[aActiveMoveRangeIntersection.r2].height - offsetY - this.height_1px;
                    if (drawTopSideMoveRange) {
                        ctx.lineHor(xMoveRange1, yMoveRange1 - this.height_1px, xMoveRange2 + this.width_1px);
                    }
                    if (drawBottomSideMoveRange) {
                        ctx.lineHor(xMoveRange1, yMoveRange2, xMoveRange2 + this.width_1px);
                    }
                    if (drawLeftSideMoveRange) {
                        ctx.lineVer(xMoveRange1, yMoveRange1, yMoveRange2);
                    }
                    if (drawRightSideMoveRange) {
                        ctx.lineVer(xMoveRange2, yMoveRange1, yMoveRange2);
                    }
                }
                ctx.stroke();
            }
            ctx.restore();
            if (!this.isChartAreaEditMode) {
                this.objectRender.raiseLayerDrawingObjects();
            }
            this._drawActiveHeaders();
        },
        _drawFormulaRange: function (arr) {
            var ctx = this.overlayCtx,
            opt = this.settings,
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft,
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            ctx.setLineWidth(1);
            for (var i in arr) {
                var arFormulaTmp = arr[i].clone(true);
                var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);
                if (aFormulaIntersection) {
                    ctx.beginPath().setStrokeStyle(opt.formulaRangeBorderColor[i % opt.formulaRangeBorderColor.length]).setFillStyle(opt.formulaRangeBorderColor[i % opt.formulaRangeBorderColor.length]);
                    var drawLeftSideFormula = aFormulaIntersection.c1 === arFormulaTmp.c1;
                    var drawRightSideFormula = aFormulaIntersection.c2 === arFormulaTmp.c2;
                    var drawTopSideFormula = aFormulaIntersection.r1 === arFormulaTmp.r1;
                    var drawBottomSideFormula = aFormulaIntersection.r2 === arFormulaTmp.r2;
                    var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX - this.width_1px;
                    var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX - this.width_1px;
                    var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
                    var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY - this.height_1px;
                    if (drawTopSideFormula && aFormulaIntersection.r1 != this.visibleRange.r1) {
                        ctx.lineHor(xFormula1 + this.width_1px, yFormula1 - this.height_1px, xFormula2 + this.width_1px);
                    }
                    if (drawBottomSideFormula) {
                        ctx.lineHor(xFormula1 + this.width_1px, yFormula2, xFormula2 + this.width_1px);
                    }
                    if (drawLeftSideFormula && aFormulaIntersection.c1 != this.visibleRange.c1) {
                        ctx.lineVer(xFormula1, yFormula1 - this.width_1px * (aFormulaIntersection.r1 != this.visibleRange.r1), yFormula2 + this.width_1px);
                    }
                    if (drawRightSideFormula) {
                        ctx.lineVer(xFormula2, yFormula1, yFormula2);
                    }
                    if (drawLeftSideFormula && drawTopSideFormula) {
                        ctx.fillRect(xFormula1 + this.width_1px, yFormula1, this.width_4px, this.height_4px);
                    }
                    if (drawRightSideFormula && drawTopSideFormula) {
                        ctx.fillRect(xFormula2 - this.width_4px, yFormula1, this.width_4px, this.height_4px);
                    }
                    if (drawRightSideFormula && drawBottomSideFormula) {
                        ctx.fillRect(xFormula2 - this.width_4px, yFormula2 - this.height_4px, this.width_4px, this.height_4px);
                    }
                    if (drawLeftSideFormula && drawBottomSideFormula) {
                        ctx.fillRect(xFormula1 + this.width_1px, yFormula2 - this.height_4px, this.width_4px, this.height_4px);
                    }
                    ctx.closePath().stroke();
                }
            }
        },
        _drawSelectRange: function (oSelectRange) {
            var ctx = this.overlayCtx,
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft,
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            ctx.setLineWidth(1);
            var oSelectRangeIntersection = oSelectRange.intersection(this.visibleRange);
            if (oSelectRangeIntersection) {
                ctx.beginPath().setStrokeStyle(c_oAscCoAuthoringOtherBorderColor);
                var drawLeftSideSelectRange = oSelectRangeIntersection.c1 === oSelectRange.c1;
                var drawRightSideSelectRange = oSelectRangeIntersection.c2 === oSelectRange.c2;
                var drawTopSideSelectRange = oSelectRangeIntersection.r1 === oSelectRange.r1;
                var drawBottomSideSelectRange = oSelectRangeIntersection.r2 === oSelectRange.r2;
                var xSelectRange1 = this.cols[oSelectRangeIntersection.c1].left - offsetX;
                var xSelectRange2 = this.cols[oSelectRangeIntersection.c2].left + this.cols[oSelectRangeIntersection.c2].width - offsetX;
                var ySelectRange1 = this.rows[oSelectRangeIntersection.r1].top - offsetY;
                var ySelectRange2 = this.rows[oSelectRangeIntersection.r2].top + this.rows[oSelectRangeIntersection.r2].height - offsetY;
                if (drawTopSideSelectRange) {
                    ctx.dashLineCleverHor(xSelectRange1, ySelectRange1, xSelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                }
                if (drawBottomSideSelectRange) {
                    ctx.dashLineCleverHor(xSelectRange1, ySelectRange2, xSelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                }
                if (drawLeftSideSelectRange) {
                    ctx.dashLineCleverVer(xSelectRange1, ySelectRange1, ySelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                }
                if (drawRightSideSelectRange) {
                    ctx.dashLineCleverVer(xSelectRange2, ySelectRange1, ySelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                }
                ctx.closePath().stroke().fill();
            }
        },
        _drawCollaborativeElements: function (bIsDrawObjects) {
            if (this.collaborativeEditing.getCollaborativeEditing()) {
                this._drawCollaborativeElementsMeOther(c_oAscLockTypes.kLockTypeMine, bIsDrawObjects);
                this._drawCollaborativeElementsMeOther(c_oAscLockTypes.kLockTypeOther, bIsDrawObjects);
                this._drawCollaborativeElementsAllLock();
            }
        },
        _drawCollaborativeElementsAllLock: function () {
            var ctx = this.overlayCtx;
            var currentSheetId = this.model.getId();
            var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
            if (c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
                var styleColor = (c_oAscMouseMoveLockedObjectType.TableProperties === nLockAllType) ? c_oAscCoAuthoringLockTablePropertiesBorderColor : c_oAscCoAuthoringOtherBorderColor;
                ctx.setStrokeStyle(styleColor).setLineWidth(1).beginPath();
                var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
                var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
                var arAllRange = asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
                var aFormulaIntersection = arAllRange.intersection(this.visibleRange);
                if (aFormulaIntersection) {
                    var drawLeftSideFormula = aFormulaIntersection.c1 === arAllRange.c1;
                    var drawRightSideFormula = aFormulaIntersection.c2 === arAllRange.c2;
                    var drawTopSideFormula = aFormulaIntersection.r1 === arAllRange.r1;
                    var drawBottomSideFormula = aFormulaIntersection.r2 === arAllRange.r2;
                    var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
                    var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
                    var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
                    var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;
                    if (drawTopSideFormula) {
                        ctx.dashLineCleverHor(xFormula1, yFormula1, xFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                    if (drawBottomSideFormula) {
                        ctx.dashLineCleverHor(xFormula1, yFormula2, xFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                    if (drawLeftSideFormula) {
                        ctx.dashLineCleverVer(xFormula1, yFormula1, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                    if (drawRightSideFormula) {
                        ctx.dashLineCleverVer(xFormula2, yFormula1, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                }
                ctx.stroke();
                ctx.restore();
            }
        },
        _drawCollaborativeElementsMeOther: function (type, bIsDrawObjects) {
            var ctx = this.overlayCtx;
            var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
            var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            var i;
            var currentSheetId = this.model.getId();
            var styleColor = (c_oAscLockTypes.kLockTypeMine === type) ? c_oAscCoAuthoringMeBorderColor : c_oAscCoAuthoringOtherBorderColor;
            var arrayCells = (c_oAscLockTypes.kLockTypeMine === type) ? this.collaborativeEditing.getLockCellsMe(currentSheetId) : this.collaborativeEditing.getLockCellsOther(currentSheetId);
            if (c_oAscLockTypes.kLockTypeMine === type) {
                arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
                arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));
            }
            if (bIsDrawObjects) {
                var arrayObjects = (c_oAscLockTypes.kLockTypeMine === type) ? this.collaborativeEditing.getLockObjectsMe(currentSheetId) : this.collaborativeEditing.getLockObjectsOther(currentSheetId);
                for (i = 0; i < arrayObjects.length; ++i) {
                    this.objectRender.setGraphicObjectLockState(arrayObjects[i], (c_oAscLockTypes.kLockTypeMine === type) ? c_oAscLockTypes.kLockTypeMine : c_oAscLockTypes.kLockTypeOther);
                }
            }
            ctx.save().beginPath().rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop).clip();
            ctx.setStrokeStyle(styleColor).setLineWidth(1).beginPath();
            for (i = 0; i < arrayCells.length; ++i) {
                var arFormulaTmp = asc_Range(arrayCells[i].c1, arrayCells[i].r1, arrayCells[i].c2, arrayCells[i].r2);
                var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);
                if (aFormulaIntersection) {
                    var drawLeftSideFormula = aFormulaIntersection.c1 === arFormulaTmp.c1;
                    var drawRightSideFormula = aFormulaIntersection.c2 === arFormulaTmp.c2;
                    var drawTopSideFormula = aFormulaIntersection.r1 === arFormulaTmp.r1;
                    var drawBottomSideFormula = aFormulaIntersection.r2 === arFormulaTmp.r2;
                    var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
                    var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
                    var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
                    var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;
                    if (drawTopSideFormula) {
                        ctx.dashLineCleverHor(xFormula1, yFormula1, xFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                    if (drawBottomSideFormula) {
                        ctx.dashLineCleverHor(xFormula1, yFormula2, xFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                    if (drawLeftSideFormula) {
                        ctx.dashLineCleverVer(xFormula1, yFormula1, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                    if (drawRightSideFormula) {
                        ctx.dashLineCleverVer(xFormula2, yFormula1, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
                    }
                }
            }
            ctx.stroke();
            ctx.restore();
        },
        _drawGraphic: function () {
            this.autoFilters.drawAutoF();
            this.cellCommentator.drawCommentCells();
        },
        cleanSelection: function () {
            var ctx = this.overlayCtx;
            var arn = this.activeRange.clone(true);
            var arnIntersection = arn.intersectionSimple(this.visibleRange);
            var width = ctx.getWidth();
            var height = ctx.getHeight();
            var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
            var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            var x1 = Number.MAX_VALUE;
            var x2 = -Number.MAX_VALUE;
            var y1 = Number.MAX_VALUE;
            var y2 = -Number.MAX_VALUE;
            var i;
            if (arnIntersection) {
                x1 = this.cols[arnIntersection.c1].left - offsetX - this.width_2px;
                x2 = this.cols[arnIntersection.c2].left + this.cols[arnIntersection.c2].width - offsetX + this.width_1px + this.width_2px;
                y1 = this.rows[arnIntersection.r1].top - offsetY - this.height_2px;
                y2 = this.rows[arnIntersection.r2].top + this.rows[arnIntersection.r2].height - offsetY + this.height_1px + this.height_2px;
            }
            this._activateOverlayCtx();
            this._cleanColumnHeaders(arn.c1, arn.c2);
            this._cleanRowHeades(arn.r1, arn.r2);
            this._deactivateOverlayCtx();
            if (this.activeFillHandle !== null) {
                var activeFillClone = this.activeFillHandle.clone(true);
                var xFH1 = this.cols[activeFillClone.c1].left - offsetX - this.width_2px;
                var xFH2 = this.cols[activeFillClone.c2].left + this.cols[activeFillClone.c2].width - offsetX + this.width_1px + this.width_2px;
                var yFH1 = this.rows[activeFillClone.r1].top - offsetY - this.height_2px;
                var yFH2 = this.rows[activeFillClone.r2].top + this.rows[activeFillClone.r2].height - offsetY + this.height_1px + this.height_2px;
                x1 = Math.min(x1, xFH1);
                x2 = Math.max(x2, xFH2);
                y1 = Math.min(y1, yFH1);
                y2 = Math.max(y2, yFH2);
            }
            if (this.collaborativeEditing.getCollaborativeEditing()) {
                var currentSheetId = this.model.getId();
                var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
                if (c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
                    this.overlayCtx.clear();
                } else {
                    var arrayElementsMe = this.collaborativeEditing.getLockCellsMe(currentSheetId);
                    var arrayElementsOther = this.collaborativeEditing.getLockCellsOther(currentSheetId);
                    var arrayElements = arrayElementsMe.concat(arrayElementsOther);
                    arrayElements = arrayElements.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
                    arrayElements = arrayElements.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));
                    for (i = 0; i < arrayElements.length; ++i) {
                        var arFormulaTmp = asc_Range(arrayElements[i].c1, arrayElements[i].r1, arrayElements[i].c2, arrayElements[i].r2);
                        var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);
                        if (aFormulaIntersection) {
                            var xCE1 = this.cols[aFormulaIntersection.c1].left - offsetX - this.width_2px;
                            var xCE2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX + this.width_1px + this.width_2px;
                            var yCE1 = this.rows[aFormulaIntersection.r1].top - offsetY - this.height_2px;
                            var yCE2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY + this.height_1px + this.height_2px;
                            x1 = Math.min(x1, xCE1);
                            x2 = Math.max(x2, xCE2);
                            y1 = Math.min(y1, yCE1);
                            y2 = Math.max(y2, yCE2);
                        }
                    }
                }
            }
            if (0 < this.arrActiveFormulaRanges.length) {
                for (i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
                    var activeFormula = this.arrActiveFormulaRanges[i].clone(true);
                    activeFormula = this.visibleRange.intersection(activeFormula);
                    if (null === activeFormula) {
                        continue;
                    }
                    var xF1 = this.cols[activeFormula.c1].left - offsetX - this.width_2px;
                    var xF2 = activeFormula.c2 > this.cols.length ? width : this.cols[activeFormula.c2].left + this.cols[activeFormula.c2].width - offsetX + this.width_1px;
                    var yF1 = this.rows[activeFormula.r1].top - offsetY - this.height_2px;
                    var yF2 = activeFormula.r2 > this.rows.length ? height : this.rows[activeFormula.r2].top + this.rows[activeFormula.r2].height - offsetY + this.height_1px;
                    x1 = Math.min(x1, xF1);
                    x2 = Math.max(x2, xF2);
                    y1 = Math.min(y1, yF1);
                    y2 = Math.max(y2, yF2);
                }
                if (false === this.isFormulaEditMode) {
                    this.arrActiveFormulaRanges = [];
                }
            }
            if (0 < this.arrActiveChartsRanges.length) {
                for (i in this.arrActiveChartsRanges) {
                    var activeFormula = this.arrActiveChartsRanges[i].clone(true);
                    activeFormula = this.visibleRange.intersection(activeFormula);
                    if (null === activeFormula) {
                        continue;
                    }
                    var xF1 = this.cols[activeFormula.c1].left - offsetX - this.width_2px;
                    var xF2 = activeFormula.c2 > this.cols.length ? width : this.cols[activeFormula.c2].left + this.cols[activeFormula.c2].width - offsetX + this.width_1px;
                    var yF1 = this.rows[activeFormula.r1].top - offsetY - this.height_2px;
                    var yF2 = activeFormula.r2 > this.rows.length ? height : this.rows[activeFormula.r2].top + this.rows[activeFormula.r2].height - offsetY + this.height_1px;
                    x1 = Math.min(x1, xF1);
                    x2 = Math.max(x2, xF2);
                    y1 = Math.min(y1, yF1);
                    y2 = Math.max(y2, yF2);
                }
            }
            if (null !== this.activeMoveRange) {
                var activeMoveRangeClone = this.activeMoveRange.clone(true);
                while (!this.cols[activeMoveRangeClone.c2]) {
                    this.expandColsOnScroll(true);
                    this._trigger("reinitializeScrollX");
                }
                while (!this.rows[activeMoveRangeClone.r2]) {
                    this.expandRowsOnScroll(true);
                    this._trigger("reinitializeScrollY");
                }
                var xMR1 = this.cols[activeMoveRangeClone.c1].left - offsetX - this.width_2px;
                var xMR2 = this.cols[activeMoveRangeClone.c2].left + this.cols[activeMoveRangeClone.c2].width - offsetX + this.width_1px + this.width_2px;
                var yMR1 = this.rows[activeMoveRangeClone.r1].top - offsetY - this.height_2px;
                var yMR2 = this.rows[activeMoveRangeClone.r2].top + this.rows[activeMoveRangeClone.r2].height - offsetY + this.height_1px + this.height_2px;
                x1 = Math.min(x1, xMR1);
                x2 = Math.max(x2, xMR2);
                y1 = Math.min(y1, yMR1);
                y2 = Math.max(y2, yMR2);
            }
            if (null !== this.copyOfActiveRange) {
                var xCopyAr1 = this.cols[this.copyOfActiveRange.c1].left - offsetX - this.width_2px;
                var xCopyAr2 = this.cols[this.copyOfActiveRange.c2].left + this.cols[this.copyOfActiveRange.c2].width - offsetX + this.width_1px + this.width_2px;
                var yCopyAr1 = this.rows[this.copyOfActiveRange.r1].top - offsetY - this.height_2px;
                var yCopyAr2 = this.rows[this.copyOfActiveRange.r2].top + this.rows[this.copyOfActiveRange.r2].height - offsetY + this.height_1px + this.height_2px;
                x1 = Math.min(x1, xCopyAr1);
                x2 = Math.max(x2, xCopyAr2);
                y1 = Math.min(y1, yCopyAr1);
                y2 = Math.max(y2, yCopyAr2);
            }
            if (! (Number.MAX_VALUE === x1 && -Number.MAX_VALUE === x2 && Number.MAX_VALUE === y1 && -Number.MAX_VALUE === y2)) {
                ctx.save().beginPath().rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop).clip().clearRect(x1, y1, x2 - x1, y2 - y1).restore();
            }
            return this;
        },
        updateSelection: function () {
            this.cleanSelection();
            this._drawSelection();
        },
        drawColumnGuides: function (col, x, y, mouseX) {
            var t = this;
            x *= asc_getcvt(0, 1, t._getPPIX());
            x += mouseX;
            var ctx = t.overlayCtx;
            var offsetX = t.cols[t.visibleRange.c1].left - t.cellsLeft;
            var x1 = t.cols[col].left - offsetX - this.width_1px;
            var h = ctx.getHeight();
            ctx.clear();
            t._drawSelection();
            ctx.setFillPattern(t.ptrnLineDotted1).fillRect(x1, 0, this.width_1px, h).fillRect(x, 0, this.width_1px, h);
        },
        drawRowGuides: function (row, x, y, mouseY) {
            var t = this;
            y *= asc_getcvt(0, 1, t._getPPIY());
            y += mouseY;
            var ctx = t.overlayCtx;
            var offsetY = t.rows[t.visibleRange.r1].top - t.cellsTop;
            var y1 = t.rows[row].top - offsetY - this.height_1px;
            var w = ctx.getWidth();
            ctx.clear();
            t._drawSelection();
            ctx.setFillPattern(t.ptrnLineDotted1).fillRect(0, y1, w, this.height_1px).fillRect(0, y, w, this.height_1px);
        },
        _cleanCache: function (range) {
            var t = this,
            r, c, row;
            if (range === undefined) {
                range = t.activeRange.clone(true);
            }
            for (r = range.r1; r <= range.r2; ++r) {
                row = t.cache.rows[r];
                for (c = range.c1; c <= range.c2; ++c) {
                    if (row !== undefined) {
                        if (row.columns[c]) {
                            delete row.columns[c];
                        }
                        if (row.columnsWithText[c]) {
                            delete row.columnsWithText[c];
                        }
                        if (row.erasedLB[c]) {
                            delete row.erasedLB[c];
                        }
                        if (row.erasedRB[c - 1]) {
                            delete row.erasedRB[c - 1];
                        }
                    }
                }
                if (row !== undefined) {
                    if (row.erasedLB[c]) {
                        delete row.erasedLB[c];
                    }
                    if (row.erasedRB[c - 1]) {
                        delete row.erasedRB[c - 1];
                    }
                    if (row.columns) {
                        if (row.columns[range.c1 - 1] && row.columns[range.c1 - 1].borders) {
                            delete row.columns[range.c1 - 1].borders.r;
                        }
                        if (row.columns[range.c2 + 1] && row.columns[range.c2 + 1].borders) {
                            delete row.columns[range.c2 + 1].borders.l;
                        }
                    }
                }
            }
            row = t.cache.rows[range.r1 - 1];
            if (row !== undefined) {
                for (c = range.c1; c <= range.c2; ++c) {
                    if (row.columns[c] && row.columns[c].borders) {
                        delete row.columns[c].borders.b;
                    }
                }
            }
            row = t.cache.rows[range.r2 + 1];
            if (row !== undefined) {
                for (c = range.c1; c <= range.c2; ++c) {
                    if (row.columns[c] && row.columns[c].borders) {
                        delete row.columns[c].borders.t;
                    }
                }
            }
        },
        _cleanCellsTextMetricsCache: function () {
            var s = this.cache.sectors = [];
            var vr = this.visibleRange;
            var h = vr.r2 + 1 - vr.r1;
            var rl = this.rows.length;
            var rc = asc_floor(rl / h) + (rl % h > 0 ? 1 : 0);
            var range = new asc_Range(0, 0, this.cols.length - 1, h - 1);
            var j;
            for (j = rc; j > 0; --j, range.r1 += h, range.r2 += h) {
                if (j === 1 && rl % h > 0) {
                    range.r2 = rl - 1;
                }
                s.push(range.clone());
            }
        },
        _prepareCellTextMetricsCache: function (range) {
            var self = this;
            var s = this.cache.sectors;
            var isUpdateRows = false;
            if (s.length < 1) {
                return;
            }
            for (var i = 0; i < s.length;) {
                if (s[i].intersection(range) !== null) {
                    self._calcCellsTextMetrics(s[i]);
                    s.splice(i, 1);
                    isUpdateRows = true;
                    continue;
                }++i;
            }
            if (isUpdateRows) {
                this._updateRowPositions();
                this._calcVisibleRows();
            }
        },
        _calcCellsTextMetrics: function (range) {
            if (range === undefined) {
                range = asc_Range(0, 0, this.cols.length - 1, this.rows.length - 1);
            }
            var rowModel, rowCells, cellColl;
            for (var row = range.r1; row <= range.r2; ++row) {
                if (this.height_1px > this.rows[row].height) {
                    continue;
                }
                rowModel = this.model._getRowNoEmpty(row);
                if (null === rowModel) {
                    continue;
                }
                rowCells = rowModel.getCells();
                for (cellColl in rowCells) {
                    if (!rowCells.hasOwnProperty(cellColl)) {
                        continue;
                    }
                    cellColl = cellColl - 0;
                    if (this.width_1px > this.cols[cellColl].width) {
                        continue;
                    }
                    this._addCellTextToCache(cellColl, row);
                }
            }
            this.isChanged = false;
        },
        _fetchRowCache: function (row) {
            var rc = this.cache.rows[row] = (this.cache.rows[row] || new CacheElement());
            return rc;
        },
        _fetchCellCache: function (col, row) {
            var r = this._fetchRowCache(row),
            c = r.columns[col] = (r.columns[col] || {});
            return c;
        },
        _fetchCellCacheText: function (col, row) {
            var r = this._fetchRowCache(row),
            cwt = r.columnsWithText[col] = (r.columnsWithText[col] || {});
            return cwt;
        },
        _getRowCache: function (row) {
            return this.cache.rows[row];
        },
        _getCellCache: function (col, row) {
            var r = this.cache.rows[row];
            return r ? r.columns[col] : undefined;
        },
        _getCellTextCache: function (col, row, dontLookupMergedCells) {
            var r = this.cache.rows[row],
            c = r ? r.columns[col] : undefined;
            if (c && c.text) {
                return c.text;
            } else {
                if (!dontLookupMergedCells) {
                    var range = this.model.getMergedByCell(row, col);
                    return null !== range ? this._getCellTextCache(range.c1, range.r1, true) : undefined;
                }
            }
            return undefined;
        },
        _addCellTextToCache: function (col, row, canChangeColWidth) {
            var self = this;
            function isFixedWidthCell(frag) {
                for (var i = 0; i < frag.length; ++i) {
                    var f = frag[i].format;
                    if (f && f.repeat) {
                        return true;
                    }
                }
                return false;
            }
            function truncFracPart(frag) {
                var s = frag.reduce(function (prev, val) {
                    return prev + val.text;
                },
                "");
                if (s.search(/E/i) >= 0) {
                    return frag;
                }
                var pos = s.search(/[,\.]/);
                if (pos >= 0) {
                    frag[0].text = s.slice(0, pos);
                    frag.splice(1, frag.length - 1);
                }
                return frag;
            }
            function makeFnIsGoodNumFormat(flags, width) {
                return function (str) {
                    return self.stringRender.measureString(str, flags, width).width <= width;
                };
            }
            function changeColWidth(col, width, pad) {
                var cc = Math.min(self._colWidthToCharCount(width + pad), 255);
                var modelw = self._charCountToModelColWidth(cc, true);
                var colw = self._calcColWidth(modelw);
                if (colw.width > self.cols[col].width) {
                    self.cols[col].width = colw.width;
                    self.cols[col].innerWidth = colw.innerWidth;
                    self.cols[col].charCount = colw.charCount;
                    History.Create_NewPoint();
                    History.SetSelection(null, true);
                    History.StartTransaction();
                    self.model.setColBestFit(true, modelw, col, col);
                    History.EndTransaction();
                    self._updateColumnPositions();
                    self.isChanged = true;
                }
            }
            var c = this._getCell(col, row);
            if (c === undefined) {
                return col;
            }
            var bUpdateScrollX = false;
            var bUpdateScrollY = false;
            if (col >= this.cols.length) {
                bUpdateScrollX = this.expandColsOnScroll(false, true);
            }
            if (row >= this.rows.length) {
                bUpdateScrollY = this.expandRowsOnScroll(false, true);
            }
            if (bUpdateScrollX && bUpdateScrollY) {
                this._trigger("reinitializeScroll");
            } else {
                if (bUpdateScrollX) {
                    this._trigger("reinitializeScrollX");
                } else {
                    if (bUpdateScrollY) {
                        this._trigger("reinitializeScrollY");
                    }
                }
            }
            var mc = this.model.getMergedByCell(row, col);
            var fl = this._getCellFlags(c);
            var fMergedColumns = false;
            var fMergedRows = false;
            if (null !== mc) {
                if (col !== mc.c1 || row !== mc.r1) {
                    return mc.c2;
                }
                if (mc.c1 !== mc.c2) {
                    fMergedColumns = true;
                }
                if (mc.r1 !== mc.r2) {
                    fMergedRows = true;
                }
            }
            if (this._isCellEmpty(c)) {
                return mc ? mc.c2 : col;
            }
            var dDigitsCount = 0;
            var colWidth = 0;
            var cellType = c.getType();
            var isNumberFormat = (!cellType || CellValueType.Number === cellType);
            var numFormatStr = c.getNumFormatStr();
            var pad = this.width_padding * 2 + this.width_1px;
            var sstr, sfl, stm;
            if (!this.cols[col].isCustomWidth && isNumberFormat && !fMergedColumns && (c_oAscCanChangeColWidth.numbers === canChangeColWidth || c_oAscCanChangeColWidth.all === canChangeColWidth)) {
                colWidth = this.cols[col].innerWidth;
                sstr = c.getValue2(gc_nMaxDigCountView, function () {
                    return true;
                });
                if ("General" === numFormatStr) {
                    sstr = truncFracPart(Asc.clone(sstr));
                }
                sfl = asc_clone(fl);
                sfl.wrapText = false;
                stm = this._roundTextMetrics(this.stringRender.measureString(sstr, sfl, colWidth));
                if (stm.width > colWidth) {
                    changeColWidth(col, stm.width, pad);
                }
                dDigitsCount = this.cols[col].charCount;
                colWidth = this.cols[col].innerWidth;
            } else {
                if (null === mc) {
                    dDigitsCount = this.cols[col].charCount;
                    colWidth = this.cols[col].innerWidth;
                    if (!this.cols[col].isCustomWidth && !fMergedColumns && !fl.wrapText && c_oAscCanChangeColWidth.all === canChangeColWidth) {
                        sstr = c.getValue2(gc_nMaxDigCountView, function () {
                            return true;
                        });
                        stm = this._roundTextMetrics(this.stringRender.measureString(sstr, fl, colWidth));
                        if (stm.width > colWidth) {
                            changeColWidth(col, stm.width, pad);
                            dDigitsCount = this.cols[col].charCount;
                            colWidth = this.cols[col].innerWidth;
                        }
                    }
                } else {
                    for (var i = mc.c1; i <= mc.c2 && i < this.nColsCount; ++i) {
                        colWidth += this.cols[i].width;
                    }
                    colWidth -= pad;
                    dDigitsCount = gc_nMaxDigCountView;
                }
            }
            var str = c.getValue2(dDigitsCount, makeFnIsGoodNumFormat(fl, colWidth));
            var ha = c.getAlignHorizontalByValue().toLowerCase();
            var va = c.getAlignVertical().toLowerCase();
            var maxW = fl.wrapText || fl.shrinkToFit || fl.isMerged || isFixedWidthCell(str) ? this._calcMaxWidth(col, row, mc) : undefined;
            var tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
            var angle = c.getAngle();
            var cto = (fl.isMerged || fl.wrapText) ? {
                maxWidth: maxW - this.cols[col].innerWidth + this.cols[col].width,
                leftSide: 0,
                rightSide: 0
            } : this._calcCellTextOffset(col, row, ha, tm.width);
            if (!fl.isMerged) {
                var rside = this.cols[col - cto.leftSide].left + tm.width;
                var lc = this.cols[this.cols.length - 1];
                if (rside > lc.left + lc.width) {
                    this._appendColumns(rside);
                    cto = this._calcCellTextOffset(col, row, ha, tm.width);
                }
            }
            var oFontColor = c.getFontcolor();
            if (null != oFontColor) {
                oFontColor = oFontColor.getRgb();
            }
            var rowInfo = this.rows[row];
            var rowHeight = rowInfo.height;
            var textBound = {};
            if (angle) {
                if (fMergedRows) {
                    rowHeight = 0;
                    for (var j = mc.r1; j <= mc.r2 && j < this.nRowsCount; ++j) {
                        rowHeight += this.rows[j].height;
                    }
                }
                textBound = this.stringRender.getTransformBound(angle, 0, 0, colWidth, rowHeight, tm.width, ha, va, maxW);
            }
            this._fetchCellCache(col, row).text = {
                state: this.stringRender.getInternalState(),
                flags: fl,
                color: (oFontColor || this.settings.cells.defaultState.color),
                metrics: tm,
                cellW: cto.maxWidth,
                cellHA: ha,
                cellVA: va,
                sideL: cto.leftSide,
                sideR: cto.rightSide,
                cellType: cellType,
                isFormula: c.getFormula().length > 0,
                angle: angle,
                textBound: textBound,
                mc: mc
            };
            this._fetchCellCacheText(col, row).hasText = true;
            if (cto.leftSide !== 0 || cto.rightSide !== 0) {
                this._addErasedBordersToCache(col - cto.leftSide, col + cto.rightSide, row);
            }
            if (va !== kvaTop && va !== kvaCenter && !fl.isMerged) {
                rowInfo.descender = Math.max(rowInfo.descender, tm.height - tm.baseline);
            }
            rowHeight = rowInfo.height;
            if (!rowInfo.isCustomHeight) {
                if (!fMergedRows) {
                    var newHeight = tm.height;
                    if (angle) {
                        if (textBound) {
                            newHeight = textBound.height;
                        }
                    }
                    rowInfo.heightReal = rowInfo.height = Math.min(this.maxRowHeight, Math.max(rowInfo.height, newHeight));
                    if (rowHeight !== rowInfo.height) {
                        if (!rowInfo.isDefaultHeight) {
                            this.model.setRowHeight(rowInfo.height + this.height_1px, row, row);
                        }
                        if (angle) {
                            this._fetchCellCache(col, row).text.textBound = this.stringRender.getTransformBound(angle, 0, 0, colWidth, rowInfo.height, tm.width, ha, va, maxW);
                        }
                        this.isChanged = true;
                    }
                }
            }
            return mc ? mc.c2 : col;
        },
        _calcMaxWidth: function (col, row, mc) {
            if (null === mc) {
                return this.cols[col].innerWidth;
            }
            var width = this.cols[mc.c1].innerWidth;
            for (var c = mc.c1 + 1; c <= mc.c2 && c < this.nColsCount; ++c) {
                width += this.cols[c].width;
            }
            return width;
        },
        _calcCellTextOffset: function (col, row, textAlign, textWidth) {
            var sideL = [0],
            sideR = [0],
            i;
            var maxWidth = this.cols[col].width;
            var ls = 0,
            rs = 0;
            var pad = this.settings.cells.padding * asc_getcvt(0, 1, this._getPPIX());
            var textW = textAlign === khaCenter ? (textWidth + maxWidth) * 0.5 : textWidth + pad;
            if (textAlign === khaRight || textAlign === khaCenter) {
                sideL = this._calcCellsWidth(col, 0, row);
                for (i = 0; i < sideL.length && textW > sideL[i]; ++i) {}
                ls = i !== sideL.length ? i : i - 1;
            }
            if (textAlign !== khaRight) {
                sideR = this._calcCellsWidth(col, this.cols.length - 1, row);
                for (i = 0; i < sideR.length && textW > sideR[i]; ++i) {}
                rs = i !== sideR.length ? i : i - 1;
            }
            if (textAlign === khaCenter) {
                maxWidth = (sideL[ls] - sideL[0]) + sideR[rs];
            } else {
                maxWidth = textAlign === khaRight ? sideL[ls] : sideR[rs];
            }
            return {
                maxWidth: maxWidth,
                leftSide: ls,
                rightSide: rs
            };
        },
        _calcCellsWidth: function (colBeg, colEnd, row) {
            var inc = colBeg <= colEnd ? 1 : -1,
            res = [];
            for (var i = colBeg;
            (colEnd - i) * inc >= 0; i += inc) {
                if (i !== colBeg && !this._isCellEmptyOrMerged(i, row)) {
                    break;
                }
                res.push(this.cols[i].width);
                if (res.length > 1) {
                    res[res.length - 1] += res[res.length - 2];
                }
            }
            return res;
        },
        _findSourceOfCellText: function (col, row) {
            var r = this._getRowCache(row);
            if (r) {
                for (var i in r.columnsWithText) {
                    if (!r.columns[i] || 0 === this.cols[i].width) {
                        continue;
                    }
                    var ct = r.columns[i].text;
                    if (!ct) {
                        continue;
                    }
                    i = parseInt(i);
                    var lc = i - ct.sideL,
                    rc = i + ct.sideR;
                    if (col >= lc && col <= rc) {
                        return i;
                    }
                }
            }
            return -1;
        },
        _isMergedCells: function (range) {
            return range.isEqual(this.model.getMergedByCell(range.r1, range.c1));
        },
        _addErasedBordersToCache: function (colBeg, colEnd, row) {
            var rc = this._fetchRowCache(row);
            for (var col = colBeg; col < colEnd; ++col) {
                rc.erasedRB[col] = true;
                rc.erasedLB[col + 1] = true;
            }
        },
        _isLeftBorderErased: function (col, row) {
            return this._fetchRowCache(row).erasedLB[col] === true;
        },
        _isRightBorderErased: function (col, row) {
            return this._fetchRowCache(row).erasedRB[col] === true;
        },
        _getBorderPropById: function (border, border_id) {
            var border_prop = undefined;
            switch (border_id) {
            case kcbidLeft:
                border_prop = border.l;
                break;
            case kcbidRight:
                border_prop = border.r;
                break;
            case kcbidTop:
                border_prop = border.t;
                break;
            case kcbidBottom:
                border_prop = border.b;
                break;
            case kcbidDiagonal:
                border_prop = border.d;
                break;
            case kcbidDiagonalDown:
                border_prop = border.dd;
                break;
            case kcbidDiagonalUp:
                border_prop = border.du;
                break;
            }
            return border_prop;
        },
        _getBordersCache: function (col, row) {
            var self = this;
            if (col < 0 || row < 0) {
                return {
                    l: new CellBorder(),
                    r: new CellBorder(),
                    t: new CellBorder(),
                    b: new CellBorder(),
                    dd: new CellBorder(),
                    du: new CellBorder()
                };
            }
            function makeBorder(border, type, isActive) {
                var tmpBorder = self._getBorderPropById(border, type);
                return new CellBorder(tmpBorder.s, tmpBorder.c, tmpBorder.w, type === kcbidLeft ? self._isLeftBorderErased(col, row) : (type === kcbidRight ? self._isRightBorderErased(col, row) : false), isActive !== undefined ? isActive : false);
            }
            var cc = self._fetchCellCache(col, row);
            var cb = cc.borders = (cc.borders || {});
            var mc;
            if (!cb.l || !cb.r || !cb.t || !cb.b || !cb.dd || !cb.du) {
                mc = this.model.getMergedByCell(row, col);
                var b = self._getVisibleCell(col, row).getBorder();
                if (!cb.l) {
                    cb.l = !mc || col === mc.c1 ? makeBorder(b, kcbidLeft) : new CellBorder();
                }
                if (!cb.r) {
                    cb.r = !mc || col === mc.c2 ? makeBorder(b, kcbidRight) : new CellBorder();
                }
                if (!cb.t) {
                    cb.t = !mc || row === mc.r1 ? makeBorder(b, kcbidTop) : new CellBorder();
                }
                if (!cb.b) {
                    cb.b = !mc || row === mc.r2 ? makeBorder(b, kcbidBottom) : new CellBorder();
                }
                if (!cb.dd) {
                    cb.dd = !mc || col === mc.c1 && row === mc.r1 ? makeBorder(b, kcbidDiagonal, true) : new CellBorder();
                    if (!b.dd) {
                        cb.dd.w = 0;
                    }
                }
                if (!cb.du) {
                    cb.du = !mc || col === mc.c1 && row === mc.r1 ? makeBorder(b, kcbidDiagonal, true) : new CellBorder();
                    if (!b.du) {
                        cb.du.w = 0;
                    }
                }
            }
            return cb;
        },
        _getActiveBorder: function (col, row, type) {
            var bor = this._getBordersCache(col, row);
            var border = this._getBorderPropById(bor, type);
            function calcActiveBorder(prev, next) {
                var ab = next && (next.s !== c_oAscBorderStyles.None || !prev) ? next : prev;
                if (prev && prev !== ab) {
                    prev.s = ab.s;
                    prev.c = ab.c;
                    prev.w = ab.w;
                    prev.isActive = true;
                }
                if (next && next !== ab) {
                    next.s = ab.s;
                    next.c = ab.c;
                    next.w = ab.w;
                    next.isActive = true;
                }
                ab.isActive = true;
                return ab;
            }
            if (!border.isActive && !border.isErased) {
                var side = undefined;
                switch (type) {
                case kcbidLeft:
                    side = this._getBordersCache(col - 1, row).r;
                    calcActiveBorder(side, bor.l);
                    break;
                case kcbidRight:
                    side = this._getBordersCache(col + 1, row).l;
                    calcActiveBorder(bor.r, side);
                    break;
                case kcbidTop:
                    side = this._getBordersCache(col, row - 1).b;
                    calcActiveBorder(side, bor.t);
                    break;
                case kcbidBottom:
                    side = this._getBordersCache(col, row + 1).t;
                    calcActiveBorder(bor.b, side);
                    break;
                }
            }
            return this._getBorderPropById(bor, type);
        },
        _calcMaxBorderWidth: function (b1, b2) {
            return Math.max(b1.isErased ? 0 : b1.w, b2.isErased ? 0 : b2.w);
        },
        _getColumnTitle: function (col) {
            var q = col < 26 ? undefined : asc_floor(col / 26) - 1;
            var r = col % 26;
            var text = String.fromCharCode(("A").charCodeAt(0) + r);
            return col < 26 ? text : this._getColumnTitle(q) + text;
        },
        _getRowTitle: function (row) {
            return "" + (row + 1);
        },
        _getCellTitle: function (col, row) {
            return this._getColumnTitle(col) + this._getRowTitle(row);
        },
        _getCell: function (col, row) {
            this.nRowsCount = Math.max(this.model.getRowsCount(), this.rows.length);
            this.nColsCount = Math.max(this.model.getColsCount(), this.cols.length);
            if (col < 0 || col >= this.nColsCount || row < 0 || row >= this.nRowsCount) {
                return undefined;
            }
            return this.model.getCell3(row, col);
        },
        _getVisibleCell: function (col, row) {
            return this.model.getCell3(row, col);
        },
        _getCellFlags: function (col, row) {
            var c = row !== undefined ? this._getCell(col, row) : col;
            var fl = {
                wrapText: false,
                shrinkToFit: false,
                isMerged: false,
                textAlign: kNone
            };
            if (c !== undefined) {
                fl.wrapText = c.getWrap();
                fl.shrinkToFit = c.getShrinkToFit();
                fl.isMerged = c.hasMerged() !== null;
                fl.textAlign = c.getAlignHorizontalByValue().toLowerCase();
            }
            return fl;
        },
        _isCellEmpty: function (col, row) {
            var c = row !== undefined ? this._getCell(col, row) : col;
            return c === undefined || c.getValue().search(/[^ ]/) < 0;
        },
        _isCellEmptyOrMerged: function (col, row) {
            var c = row !== undefined ? this._getCell(col, row) : col;
            if (undefined === c) {
                return true;
            }
            var fl = this._getCellFlags(c);
            if (fl.isMerged) {
                return false;
            }
            return c.getValue().search(/[^ ]/) < 0;
        },
        _isCellEmptyOrMergedOrBackgroundColorOrBorders: function (col, row) {
            var c = row !== undefined ? this._getCell(col, row) : col;
            if (undefined === c) {
                return true;
            }
            var fl = this._getCellFlags(c);
            if (fl.isMerged) {
                return false;
            }
            var bg = c.getFill();
            if (null !== bg) {
                return false;
            }
            var cb = c.getBorder();
            if ((cb.l && c_oAscBorderStyles.None !== cb.l.s) || (cb.r && c_oAscBorderStyles.None !== cb.r.s) || (cb.t && c_oAscBorderStyles.None !== cb.t.s) || (cb.b && c_oAscBorderStyles.None !== cb.b.s) || (cb.dd && c_oAscBorderStyles.None !== cb.dd.s) || (cb.du && c_oAscBorderStyles.None !== cb.du.s)) {
                return false;
            }
            return c.getValue().search(/[^ ]/) < 0;
        },
        _getRange: function (c1, r1, c2, r2) {
            return this.model.getRange3(r1, c1, r2, c2);
        },
        _selectColumnsByRange: function () {
            var ar = this.activeRange;
            if (c_oAscSelectionType.RangeMax === ar.type) {
                return;
            } else {
                this.cleanSelection();
                if (c_oAscSelectionType.RangeRow === ar.type) {
                    ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
                    ar.type = c_oAscSelectionType.RangeMax;
                } else {
                    ar.type = c_oAscSelectionType.RangeCol;
                    ar.assign(ar.c1, 0, ar.c2, this.rows.length - 1);
                }
                this._drawSelection();
            }
        },
        _selectRowsByRange: function () {
            var ar = this.activeRange;
            if (c_oAscSelectionType.RangeMax === ar.type) {
                return;
            } else {
                this.cleanSelection();
                if (c_oAscSelectionType.RangeCol === ar.type) {
                    ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
                    ar.type = c_oAscSelectionType.RangeMax;
                } else {
                    ar.type = c_oAscSelectionType.RangeRow;
                    ar.assign(0, ar.r1, this.cols.length - 1, ar.r2);
                }
                this._drawSelection();
            }
        },
        _isLargeRange: function (range) {
            var vr = this.visibleRange;
            return range.c2 - range.c1 + 1 > (vr.c2 - vr.c1 + 1) * 3 || range.r2 - range.r1 + 1 > (vr.r2 - vr.r1 + 1) * 3;
        },
        _rangeIsSingleCell: function (range) {
            return range.c1 === range.c2 && range.r1 === range.r2;
        },
        drawDepCells: function () {
            var ctx = this.overlayCtx,
            _cc = this.cellCommentator,
            c, node, that = this;
            ctx.clear();
            this._drawSelection();
            function draw_arrow(context, fromx, fromy, tox, toy) {
                var headlen = 9,
                showArrow = tox > that.getCellLeft(0, 0) && toy > that.getCellTop(0, 0),
                dx = tox - fromx,
                dy = toy - fromy,
                tox = tox > that.getCellLeft(0, 0) ? tox : that.getCellLeft(0, 0),
                toy = toy > that.getCellTop(0, 0) ? toy : that.getCellTop(0, 0),
                angle = Math.atan2(dy, dx),
                _a = Math.PI / 18;
                context.save().setLineWidth(1).beginPath().lineDiag.moveTo(_cc.pxToPt(fromx), _cc.pxToPt(fromy)).lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy));
                if (showArrow) {
                    context.moveTo(_cc.pxToPt(tox - headlen * Math.cos(angle - _a)), _cc.pxToPt(toy - headlen * Math.sin(angle - _a))).lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy)).lineTo(_cc.pxToPt(tox - headlen * Math.cos(angle + _a)), _cc.pxToPt(toy - headlen * Math.sin(angle + _a))).lineTo(_cc.pxToPt(tox - headlen * Math.cos(angle - _a)), _cc.pxToPt(toy - headlen * Math.sin(angle - _a)));
                }
                context.setStrokeStyle("#0000FF").setFillStyle("#0000FF").stroke().fill().closePath().restore();
            }
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
                var mergedRange = _this.model.getMergedByCell(row, col);
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
            for (var id in this.depDrawCells) {
                c = this.depDrawCells[id].from;
                node = this.depDrawCells[id].to;
                var mainCellMetrics = gCM(this, c.getCellAddress().getCol0(), c.getCellAddress().getRow0()),
                nodeCellMetrics,
                _t1,
                _t2;
                for (var id in node) {
                    if (!node[id].isArea) {
                        _t1 = gCM(this, node[id].returnCell().getCellAddress().getCol0(), node[id].returnCell().getCellAddress().getRow0());
                        nodeCellMetrics = {
                            t: _t1.top,
                            l: _t1.left,
                            w: _t1.width,
                            h: _t1.height,
                            apt: _t1.top + _t1.height / 2,
                            apl: _t1.left + _t1.width / 4
                        };
                    } else {
                        var _t1 = gCM(_wsV, me[id].firstCellAddress.getCol0(), me[id].firstCellAddress.getRow0()),
                        _t2 = gCM(_wsV, me[id].lastCellAddress.getCol0(), me[id].lastCellAddress.getRow0());
                        nodeCellMetrics = {
                            t: _t1.top,
                            l: _t1.left,
                            w: _t2.left + _t2.width - _t1.left,
                            h: _t2.top + _t2.height - _t1.top,
                            apt: _t1.top + _t1.height / 2,
                            apl: _t1.left + _t1.width / 4
                        };
                    }
                    var x1 = Math.floor(nodeCellMetrics.apl),
                    y1 = Math.floor(nodeCellMetrics.apt),
                    x2 = Math.floor(mainCellMetrics.left + mainCellMetrics.width / 4),
                    y2 = Math.floor(mainCellMetrics.top + mainCellMetrics.height / 2);
                    if (x1 < 0 && x2 < 0 || y1 < 0 && y2 < 0) {
                        continue;
                    }
                    if (y1 < this.getCellTop(0, 0)) {
                        y1 -= this.getCellTop(0, 0);
                    }
                    if (y1 < 0 && y2 > 0) {
                        var _x1 = Math.floor(Math.sqrt((x1 - x2) * (x1 - x2) * y1 * y1 / ((y2 - y1) * (y2 - y1))));
                        if (x1 > x2) {
                            x1 -= _x1;
                        } else {
                            if (x1 < x2) {
                                x1 += _x1;
                            }
                        }
                    } else {
                        if (y1 > 0 && y2 < 0) {
                            var _x2 = Math.floor(Math.sqrt((x1 - x2) * (x1 - x2) * y2 * y2 / ((y2 - y1) * (y2 - y1))));
                            if (x2 > x1) {
                                x2 -= _x2;
                            } else {
                                if (x2 < x1) {
                                    x2 += _x2;
                                }
                            }
                        }
                    }
                    if (x1 < 0 && x2 > 0) {
                        var _y1 = Math.floor(Math.sqrt((y1 - y2) * (y1 - y2) * x1 * x1 / ((x2 - x1) * (x2 - x1))));
                        if (y1 > y2) {
                            y1 -= _y1;
                        } else {
                            if (y1 < y2) {
                                y1 += _y1;
                            }
                        }
                    } else {
                        if (x1 > 0 && x2 < 0) {
                            var _y2 = Math.floor(Math.sqrt((y1 - y2) * (y1 - y2) * x2 * x2 / ((x2 - x1) * (x2 - x1))));
                            if (y2 > y1) {
                                y2 -= _y2;
                            } else {
                                if (y2 < y1) {
                                    y2 += _y2;
                                }
                            }
                        }
                    }
                    draw_arrow(ctx, x1 < this.getCellLeft(0, 0) ? this.getCellLeft(0, 0) : x1, y1 < this.getCellTop(0, 0) ? this.getCellTop(0, 0) : y1, x2, y2);
                    if (nodeCellMetrics.apl > this.getCellLeft(0, 0) && nodeCellMetrics.apt > this.getCellTop(0, 0)) {
                        ctx.save().beginPath().arc(_cc.pxToPt(Math.floor(nodeCellMetrics.apl)), _cc.pxToPt(Math.floor(nodeCellMetrics.apt)), 3, 0, 2 * Math.PI, false, -0.5, -0.5).setFillStyle("#0000FF").fill().closePath().setLineWidth(1).setStrokeStyle("#0000FF").rect(_cc.pxToPt(nodeCellMetrics.l), _cc.pxToPt(nodeCellMetrics.t), _cc.pxToPt(nodeCellMetrics.w - 1), _cc.pxToPt(nodeCellMetrics.h - 1)).stroke().restore();
                    }
                }
            }
        },
        prepareDepCells: function (se) {
            var activeCell = this.activeRange,
            mc = this.model.getMergedByCell(activeCell.startRow, activeCell.startCol),
            c1 = mc ? mc.c1 : activeCell.startCol,
            r1 = mc ? mc.r1 : activeCell.startRow,
            c = this._getVisibleCell(c1, r1),
            nodes = (se == c_oAscDrawDepOptions.Master) ? this.model.workbook.dependencyFormulas.getMasterNodes(this.model.getId(), c.getName()) : this.model.workbook.dependencyFormulas.getSlaveNodes(this.model.getId(), c.getName());
            if (!nodes) {
                return;
            }
            if (!this.depDrawCells) {
                this.depDrawCells = {};
            }
            if (se == c_oAscDrawDepOptions.Master) {
                c = c.getCells()[0];
                var id = getVertexId(this.model.getId(), c.getName());
                this.depDrawCells[id] = {
                    from: c,
                    to: nodes
                };
            } else {
                var to = {},
                to1, id = getVertexId(this.model.getId(), c.getName());
                to[getVertexId(this.model.getId(), c.getName())] = this.model.workbook.dependencyFormulas.getNode(this.model.getId(), c.getName());
                to1 = this.model.workbook.dependencyFormulas.getNode(this.model.getId(), c.getName());
                for (var id2 in nodes) {
                    if (this.depDrawCells[id2]) {
                        $.extend(this.depDrawCells[id2].to, to);
                    } else {
                        this.depDrawCells[id2] = {};
                        this.depDrawCells[id2].from = nodes[id2].returnCell();
                        this.depDrawCells[id2].to = {};
                        this.depDrawCells[id2].to[id] = to1;
                    }
                }
            }
            this.drawDepCells();
        },
        cleanDepCells: function () {
            this.depDrawCells = null;
            this.drawDepCells();
        },
        _getPPIX: function () {
            return this.drawingCtx.getPPIX();
        },
        _getPPIY: function () {
            return this.drawingCtx.getPPIY();
        },
        _setFont: function (drawingCtx, name, size) {
            var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
            ctx.setFont(new asc_FP(name, size));
        },
        _roundTextMetrics: function (tm) {
            tm.width = asc_calcnpt(tm.width, this._getPPIX());
            tm.height = asc_calcnpt(tm.height, this._getPPIY());
            tm.baseline = asc_calcnpt(tm.baseline, this._getPPIY());
            if (tm.centerline !== undefined) {
                tm.centerline = asc_calcnpt(tm.centerline, this._getPPIY());
            }
            return tm;
        },
        _calcTextHorizPos: function (x1, x2, tm, halign) {
            switch (halign) {
            case khaCenter:
                return asc_calcnpt(0.5 * (x1 + x2 + this.width_1px - tm.width), this._getPPIX());
            case khaRight:
                return x2 + this.width_1px - this.width_padding - tm.width;
            case khaJustify:
                default:
                return x1 + this.width_padding;
            }
        },
        _calcTextVertPos: function (y1, y2, baseline, tm, valign) {
            switch (valign) {
            case kvaCenter:
                return asc_calcnpt(0.5 * (y1 + y2 - tm.height), this._getPPIY()) - this.height_1px;
            case kvaTop:
                return y1 - this.height_1px;
            default:
                return baseline - tm.baseline;
            }
        },
        _calcTextWidth: function (x1, x2, tm, halign) {
            switch (halign) {
            case khaJustify:
                return x2 + this.width_1px - this.width_padding * 2 - x1;
            default:
                return tm.width;
            }
        },
        _trigger: function (eventName) {
            var f = this.settings[eventName];
            return f && asc_typeof(f) === "function" ? f.apply(this, Array.prototype.slice.call(arguments, 1)) : undefined;
        },
        _calcCellPosition: function (c, r, dc, dr) {
            var t = this;
            var vr = t.visibleRange;
            function findNextCell(col, row, dx, dy) {
                var state = t._isCellEmpty(col, row);
                var i = col + dx;
                var j = row + dy;
                while (i >= 0 && i < t.cols.length && j >= 0 && j < t.rows.length) {
                    var newState = t._isCellEmpty(i, j);
                    if (newState !== state) {
                        var ret = {};
                        ret.col = state ? i : i - dx;
                        ret.row = state ? j : j - dy;
                        if (ret.col !== col || ret.row !== row || state) {
                            return ret;
                        }
                        state = newState;
                    }
                    i += dx;
                    j += dy;
                }
                return {
                    col: i - dx,
                    row: j - dy
                };
            }
            function findEnd(col, row) {
                var nc1, nc2 = col;
                do {
                    nc1 = nc2;
                    nc2 = findNextCell(nc1, row, +1, 0).col;
                } while (nc1 !== nc2);
                return nc2;
            }
            function findEOT() {
                var obr = t.objectRender ? t.objectRender.getDrawingAreaMetrics() : {
                    maxCol: 0,
                    maxRow: 0
                };
                var maxCols = t.model.getColsCount();
                var maxRows = t.model.getRowsCount();
                var lastC = -1,
                lastR = -1;
                for (var col = 0; col < maxCols; ++col) {
                    for (var row = 0; row < maxRows; ++row) {
                        if (!t._isCellEmpty(col, row)) {
                            lastC = Math.max(lastC, col);
                            lastR = Math.max(lastR, row);
                        }
                    }
                }
                return {
                    col: Math.max(lastC, obr.maxCol),
                    row: Math.max(lastR, obr.maxRow)
                };
            }
            var eot = dc > +2.0001 && dc < +2.9999 && dr > +2.0001 && dr < +2.9999 ? findEOT() : null;
            var newCol = (function () {
                if (dc > +0.0001 && dc < +0.9999) {
                    return c + (vr.c2 - vr.c1 + 1);
                }
                if (dc < -0.0001 && dc > -0.9999) {
                    return c - (vr.c2 - vr.c1 + 1);
                }
                if (dc > +1.0001 && dc < +1.9999) {
                    return findNextCell(c, r, +1, 0).col;
                }
                if (dc < -1.0001 && dc > -1.9999) {
                    return findNextCell(c, r, -1, 0).col;
                }
                if (dc > +2.0001 && dc < +2.9999) {
                    return !eot ? findEnd(c, r) : eot.col;
                }
                if (dc < -2.0001 && dc > -2.9999) {
                    return 0;
                }
                return c + dc;
            })();
            var newRow = (function () {
                if (dr > +0.0001 && dr < +0.9999) {
                    return r + (vr.r2 - vr.r1 + 1);
                }
                if (dr < -0.0001 && dr > -0.9999) {
                    return r - (vr.r2 - vr.r1 + 1);
                }
                if (dr > +1.0001 && dr < +1.9999) {
                    return findNextCell(c, r, 0, +1).row;
                }
                if (dr < -1.0001 && dr > -1.9999) {
                    return findNextCell(c, r, 0, -1).row;
                }
                if (dr > +2.0001 && dr < +2.9999) {
                    return !eot ? 0 : eot.row;
                }
                if (dr < -2.0001 && dr > -2.9999) {
                    return 0;
                }
                return r + dr;
            })();
            if (newCol >= t.cols.length && newCol <= gc_nMaxCol0) {
                t.nColsCount = newCol + 1;
                t._calcColumnWidths(2);
            }
            if (newRow >= t.rows.length && newRow <= gc_nMaxRow0) {
                t.nRowsCount = newRow + 1;
                t._calcRowHeights(2);
            }
            return {
                col: newCol < 0 ? 0 : Math.min(newCol, t.cols.length - 1),
                row: newRow < 0 ? 0 : Math.min(newRow, t.rows.length - 1)
            };
        },
        _isColDrawnPartially: function (col, leftCol) {
            if (col <= leftCol || col >= this.nColsCount) {
                return false;
            }
            var c = this.cols;
            return c[col].left + c[col].width - c[leftCol].left + this.cellsLeft > this.drawingCtx.getWidth();
        },
        _isRowDrawnPartially: function (row, topRow) {
            if (row <= topRow || row >= this.nRowsCount) {
                return false;
            }
            var r = this.rows;
            return r[row].top + r[row].height - r[topRow].top + this.cellsTop > this.drawingCtx.getHeight();
        },
        _isVisibleX: function (x, leftCol) {
            var c = this.cols;
            return x - c[leftCol].left + this.cellsLeft < this.drawingCtx.getWidth();
        },
        _isVisibleY: function (y, topRow) {
            var r = this.rows;
            return y - r[topRow].top + this.cellsTop < this.drawingCtx.getHeight();
        },
        _updateVisibleRowsCount: function (skipScrolReinit) {
            var vr = this.visibleRange;
            this._calcVisibleRows();
            if (this._isVisibleY(this.rows[vr.r2].top + this.rows[vr.r2].height, vr.r1)) {
                do {
                    this.expandRowsOnScroll(true);
                    this._calcVisibleRows();
                    if (this.rows[this.rows.length - 1].height < 1e-06) {
                        break;
                    }
                } while (this._isVisibleY(this.rows[vr.r2].top + this.rows[vr.r2].height, vr.r1));
                if (!skipScrolReinit) {
                    this._trigger("reinitializeScrollY");
                }
            }
        },
        _updateVisibleColsCount: function (skipScrolReinit) {
            var vr = this.visibleRange;
            this._calcVisibleColumns();
            if (this._isVisibleX(this.cols[vr.c2].left + this.cols[vr.c2].width, vr.c1)) {
                do {
                    this.expandColsOnScroll(true);
                    this._calcVisibleColumns();
                    if (this.cols[this.cols.length - 1].width < 1e-06) {
                        break;
                    }
                } while (this._isVisibleX(this.cols[vr.c2].left + this.cols[vr.c2].width, vr.c1));
                if (!skipScrolReinit) {
                    this._trigger("reinitializeScrollX");
                }
            }
        },
        scrollVertical: function (delta, editor) {
            var vr = this.visibleRange;
            var start = this._calcCellPosition(vr.c1, vr.r1, 0, delta).row;
            var fixStartRow = asc_Range(vr.c1, start, vr.c2, start);
            fixStartRow.startCol = vr.c1;
            fixStartRow.startRow = start;
            this._fixSelectionOfHiddenCells(0, delta >= 0 ? +1 : -1, fixStartRow);
            var reinitScrollY = start !== fixStartRow.r1;
            if (reinitScrollY && 0 > delta) {
                delta += fixStartRow.r1 - start;
            }
            start = fixStartRow.r1;
            if (start === vr.r1) {
                return this;
            }
            this.cleanSelection();
            this.cellCommentator.cleanSelectedComment();
            var ctx = this.drawingCtx;
            var ctxW = ctx.getWidth();
            var ctxH = ctx.getHeight();
            var dy = this.rows[start].top - this.rows[vr.r1].top;
            var oldEnd = vr.r2;
            var oldDec = Math.max(calcDecades(oldEnd + 1), 3);
            var oldVRE_isPartial = this._isRowDrawnPartially(vr.r2, vr.r1);
            if (this.isCellEditMode && editor) {
                editor.move(0, -dy);
            }
            vr.r1 = start;
            this._updateVisibleRowsCount();
            var oldH = ctxH - this.cellsTop - Math.abs(dy);
            var y = this.cellsTop + (dy > 0 && oldH > 0 ? dy : 0);
            var oldW, x, dx;
            this.objectRender.setScrollOffset();
            var widthChanged = Math.max(calcDecades(vr.r2 + 1), 3) !== oldDec;
            if (widthChanged) {
                x = this.cellsLeft;
                this._calcHeaderColumnWidth();
                this._updateColumnPositions();
                this._calcVisibleColumns();
                this._drawCorner();
                this._cleanColumnHeadersRect();
                this._drawColumnHeaders(undefined);
                dx = this.cellsLeft - x;
                oldW = ctxW - x - Math.abs(dx);
            } else {
                dx = 0;
                x = this.headersLeft;
                oldW = ctxW;
            }
            if (oldH > 0) {
                ctx.drawImage(ctx.getCanvas(), x, y, oldW, oldH, x + dx, y - dy, oldW, oldH);
            }
            ctx.setFillStyle(this.settings.cells.defaultState.background).fillRect(this.headersLeft, y + (dy > 0 && oldH > 0 ? oldH - dy : 0), ctxW, ctxH - this.cellsTop - (oldH > 0 ? oldH : 0));
            if (! (dy > 0 && vr.r2 === oldEnd && !oldVRE_isPartial && dx === 0)) {
                var c1 = vr.c1;
                var r1 = dy > 0 && oldH > 0 ? oldEnd + (oldVRE_isPartial ? 0 : 1) : vr.r1;
                var c2 = vr.c2;
                var r2 = dy > 0 || oldH <= 0 ? vr.r2 : vr.r1 - 1 - delta;
                var range = asc_Range(c1, r1, c2, r2);
                this._prepareCellTextMetricsCache(range);
                if (dx === 0) {
                    this._drawRowHeaders(undefined, r1, r2);
                } else {
                    this._drawRowHeaders(undefined);
                    if (dx < 0) {
                        var r1_ = dy > 0 ? vr.r1 : r2 + 1;
                        var r2_ = dy > 0 ? r1 - 1 : vr.r2;
                        var r_ = asc_Range(c2, r1_, c2, r2_);
                        if (r2_ >= r1_) {
                            this._drawGrid(undefined, r_);
                            this._drawCells(undefined, r_);
                            this._drawCellsBorders(undefined, r_);
                        }
                    }
                }
                this._drawGrid(undefined, range);
                this._drawCells(undefined, range);
                this._drawCellsBorders(undefined, range);
                this._fixSelectionOfMergedCells();
                this._drawSelection();
                if (widthChanged) {
                    this._trigger("reinitializeScrollX");
                }
            }
            if (reinitScrollY) {
                this._trigger("reinitializeScrollY");
            }
            this.cellCommentator.updateCommentPosition();
            this._drawGraphic();
            this.objectRender.showDrawingObjects(true);
            return this;
        },
        scrollHorizontal: function (delta, editor) {
            var vr = this.visibleRange;
            var start = this._calcCellPosition(vr.c1, vr.r1, delta, 0).col;
            var fixStartCol = asc_Range(start, vr.r1, start, vr.r2);
            fixStartCol.startCol = start;
            fixStartCol.startRow = vr.r1;
            this._fixSelectionOfHiddenCells(delta >= 0 ? +1 : -1, 0, fixStartCol);
            var reinitScrollX = start !== fixStartCol.c1;
            if (reinitScrollX && 0 > delta) {
                delta += fixStartCol.c1 - start;
            }
            start = fixStartCol.c1;
            if (start === vr.c1) {
                return this;
            }
            this.cleanSelection();
            this.cellCommentator.cleanSelectedComment();
            var ctx = this.drawingCtx;
            var ctxW = ctx.getWidth();
            var ctxH = ctx.getHeight();
            var dx = this.cols[start].left - this.cols[vr.c1].left;
            var oldEnd = vr.c2;
            var oldVCE_isPartial = this._isColDrawnPartially(vr.c2, vr.c1);
            if (this.isCellEditMode && editor) {
                editor.move(-dx, 0);
            }
            vr.c1 = start;
            this._updateVisibleColsCount();
            this.objectRender.setScrollOffset();
            var oldW = ctxW - this.cellsLeft - Math.abs(dx);
            var x = this.cellsLeft + (dx > 0 && oldW > 0 ? dx : 0);
            var y = this.headersTop;
            if (oldW > 0) {
                ctx.drawImage(ctx.getCanvas(), x, y, oldW, ctxH, x - dx, y, oldW, ctxH);
            }
            ctx.setFillStyle(this.settings.cells.defaultState.background).fillRect(x + (dx > 0 && oldW > 0 ? oldW - dx : 0), y, ctxW - this.cellsLeft - (oldW > 0 ? oldW : 0), ctxH);
            if (! (dx > 0 && vr.c2 === oldEnd && !oldVCE_isPartial)) {
                var c1 = dx > 0 && oldW > 0 ? oldEnd + (oldVCE_isPartial ? 0 : 1) : vr.c1;
                var r1 = vr.r1;
                var c2 = dx > 0 || oldW <= 0 ? vr.c2 : vr.c1 - 1 - delta;
                var r2 = vr.r2;
                var range = asc_Range(c1, r1, c2, r2);
                this._drawColumnHeaders(undefined, c1, c2);
                this._drawGrid(undefined, range);
                this._drawCells(undefined, range);
                this._drawCellsBorders(undefined, range);
                this._fixSelectionOfMergedCells();
                this._drawSelection();
            }
            if (reinitScrollX) {
                this._trigger("reinitializeScrollX");
            }
            this.cellCommentator.updateCommentPosition();
            this._drawGraphic();
            this.objectRender.showDrawingObjects(true);
            return this;
        },
        _findColUnderCursor: function (x, canReturnNull, dX) {
            var c = this.visibleRange.c1;
            var offset = this.cols[c].left - this.cellsLeft;
            var c2, x1, x2;
            if (x >= this.cellsLeft) {
                for (x1 = this.cellsLeft, c2 = this.cols.length - 1; c <= c2; ++c, x1 = x2) {
                    x2 = x1 + this.cols[c].width;
                    if (x1 <= x && x < x2) {
                        if (dX) {
                            if (x1 <= x && x < x1 + this.cols[c].width / 2) {
                                --c;
                            }
                        }
                        return {
                            col: c,
                            left: x1,
                            right: x2
                        };
                    }
                }
                if (!canReturnNull) {
                    return {
                        col: c2,
                        left: this.cols[c2].left - offset,
                        right: x2
                    };
                }
            } else {
                for (x2 = this.cellsLeft + this.cols[c].width, c2 = 0; c >= c2; --c, x2 = x1) {
                    x1 = this.cols[c].left - offset;
                    if (x1 <= x && x < x2) {
                        if (dX) {
                            if (x1 <= x && x < x1 + this.cols[c].width / 2) {
                                --c;
                            }
                        }
                        return {
                            col: c,
                            left: x1,
                            right: x2
                        };
                    }
                }
                if (!canReturnNull) {
                    if (dX) {
                        --c2;
                        return {
                            col: c2
                        };
                    }
                    return {
                        col: c2,
                        left: x1,
                        right: x1 + this.cols[c2].width
                    };
                }
            }
            return null;
        },
        _findRowUnderCursor: function (y, canReturnNull, dY) {
            var r = this.visibleRange.r1,
            offset = this.rows[r].top - this.cellsTop,
            r2,
            y1,
            y2;
            if (y >= this.cellsTop) {
                for (y1 = this.cellsTop, r2 = this.rows.length - 1; r <= r2; ++r, y1 = y2) {
                    y2 = y1 + this.rows[r].height;
                    if (y1 <= y && y < y2) {
                        if (dY) {
                            if (y1 <= y && y < y1 + this.rows[r].height / 2) {
                                --r;
                            }
                        }
                        return {
                            row: r,
                            top: y1,
                            bottom: y2
                        };
                    }
                }
                if (!canReturnNull) {
                    return {
                        row: r2,
                        top: this.rows[r2].top - offset,
                        bottom: y2
                    };
                }
            } else {
                for (y2 = this.cellsTop + this.rows[r].height, r2 = 0; r >= r2; --r, y2 = y1) {
                    y1 = this.rows[r].top - offset;
                    if (y1 <= y && y < y2) {
                        if (dY) {
                            if (y1 <= y && y < y1 + this.rows[r].height / 2) {
                                --r;
                            }
                        }
                        return {
                            row: r,
                            top: y1,
                            bottom: y2
                        };
                    }
                }
                if (!canReturnNull) {
                    if (dY) {
                        --r2;
                        return {
                            row: r2
                        };
                    }
                    return {
                        row: r2,
                        top: y1,
                        bottom: y1 + this.rows[r2].height
                    };
                }
            }
            return null;
        },
        getCursorTypeFromXY: function (x, y, isViewerMode) {
            var c, r, f, i, offsetX, offsetY, arNorm, arIntersection;
            var left, top, right, bottom;
            var sheetId = this.model.getId();
            var userId = undefined;
            var lockRangePosLeft = undefined;
            var lockRangePosTop = undefined;
            var lockInfo = undefined;
            var isLocked = false;
            var drawingInfo = this.objectRender.checkCursorDrawingObject(x, y);
            if (asc["editor"].isStartAddShape && CheckIdSatetShapeAdd(this.objectRender.controller.curState.id)) {
                return {
                    cursor: kCurFillHandle,
                    target: "shape",
                    col: -1,
                    row: -1
                };
            }
            if (drawingInfo && drawingInfo.id) {
                lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, drawingInfo.id);
                isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false);
                if (false !== isLocked) {
                    userId = isLocked.UserId;
                    lockRangePosLeft = drawingInfo.object.getVisibleLeftOffset(true);
                    lockRangePosTop = drawingInfo.object.getVisibleTopOffset(true);
                }
                if (drawingInfo.hyperlink && (drawingInfo.hyperlink instanceof ParaHyperlinkStart)) {
                    var oHyperlink = new Hyperlink();
                    oHyperlink.Tooltip = drawingInfo.hyperlink.ToolTip;
                    var spl = drawingInfo.hyperlink.Value.split("!");
                    if (spl.length === 2) {
                        oHyperlink.setLocation(drawingInfo.hyperlink.Value);
                    } else {
                        oHyperlink.Hyperlink = drawingInfo.hyperlink.Value;
                    }
                    var _r = this.activeRange.clone(true);
                    oHyperlink.Ref = this.model.getRange3(_r.r1, _r.c1, _r.r2, _r.c2);
                    var cellCursor = {
                        cursor: drawingInfo.cursor,
                        target: "cells",
                        col: (c ? c.col : -1),
                        row: (r ? r.row : -1),
                        userId: userId,
                        lockRangePosLeft: undefined,
                        lockRangePosTop: undefined,
                        userIdAllProps: undefined,
                        lockAllPosLeft: undefined,
                        lockAllPosTop: undefined,
                        userIdAllSheet: undefined,
                        commentIndexes: undefined,
                        commentCoords: undefined
                    };
                    return {
                        cursor: kCurHyperlink,
                        target: "hyperlink",
                        hyperlink: new asc_CHyperlink(oHyperlink),
                        cellCursor: cellCursor,
                        userId: userId,
                        lockRangePosLeft: undefined,
                        lockRangePosTop: undefined,
                        userIdAllProps: undefined,
                        userIdAllSheet: undefined,
                        lockAllPosLeft: undefined,
                        lockAllPosTop: undefined,
                        commentIndexes: undefined,
                        commentCoords: undefined
                    };
                }
                return {
                    cursor: drawingInfo.cursor,
                    target: "shape",
                    drawingId: drawingInfo.id,
                    col: -1,
                    row: -1,
                    userId: userId,
                    lockRangePosLeft: lockRangePosLeft,
                    lockRangePosTop: lockRangePosTop
                };
            }
            var autoFilterCursor = this.autoFilters.isButtonAFClick(x, y);
            if (autoFilterCursor) {
                return {
                    cursor: autoFilterCursor,
                    target: "aFilterObject",
                    col: -1,
                    row: -1
                };
            }
            x *= asc_getcvt(0, 1, this._getPPIX());
            y *= asc_getcvt(0, 1, this._getPPIY());
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
            if (this.isFormulaEditMode || this.isChartAreaEditMode) {
                var arr = this.isFormulaEditMode ? this.arrActiveFormulaRanges : this.arrActiveChartsRanges,
                targetArr = this.isFormulaEditMode ? 0 : -1;
                for (i in arr) {
                    if (!arr.hasOwnProperty(i)) {
                        continue;
                    }
                    var arFormulaTmp = arr[i].clone(true);
                    var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);
                    if (aFormulaIntersection) {
                        var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
                        var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
                        var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
                        var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;
                        if ((x >= xFormula1 + 5 && x <= xFormula2 - 5) && ((y >= yFormula1 - this.height_2px && y <= yFormula1 + this.height_2px) || (y >= yFormula2 - this.height_2px && y <= yFormula2 + this.height_2px)) || (y >= yFormula1 + 5 && y <= yFormula2 - 5) && ((x >= xFormula1 - this.width_2px && x <= xFormula1 + this.width_2px) || (x >= xFormula2 - this.width_2px && x <= xFormula2 + this.width_2px))) {
                            return {
                                cursor: kCurMove,
                                target: "moveResizeRange",
                                col: -1,
                                row: -1,
                                formulaRange: arFormulaTmp,
                                indexFormulaRange: i,
                                targetArr: targetArr
                            };
                        } else {
                            if (x >= xFormula1 && x < xFormula1 + 5 && y >= yFormula1 && y < yFormula1 + 5) {
                                return {
                                    cursor: kCurSEResize,
                                    target: "moveResizeRange",
                                    col: aFormulaIntersection.c2,
                                    row: aFormulaIntersection.r2,
                                    formulaRange: arFormulaTmp,
                                    indexFormulaRange: i,
                                    targetArr: targetArr
                                };
                            } else {
                                if (x > xFormula2 - 5 && x <= xFormula2 && y > yFormula2 - 5 && y <= yFormula2) {
                                    return {
                                        cursor: kCurSEResize,
                                        target: "moveResizeRange",
                                        col: aFormulaIntersection.c1,
                                        row: aFormulaIntersection.r1,
                                        formulaRange: arFormulaTmp,
                                        indexFormulaRange: i,
                                        targetArr: targetArr
                                    };
                                } else {
                                    if (x > xFormula2 - 5 && x <= xFormula2 && y >= yFormula1 && y < yFormula1 + 5) {
                                        return {
                                            cursor: kCurNEResize,
                                            target: "moveResizeRange",
                                            col: aFormulaIntersection.c1,
                                            row: aFormulaIntersection.r2,
                                            formulaRange: arFormulaTmp,
                                            indexFormulaRange: i,
                                            targetArr: targetArr
                                        };
                                    } else {
                                        if (x >= xFormula1 && x < xFormula1 + 5 && y > yFormula2 - 5 && y <= yFormula2) {
                                            return {
                                                cursor: kCurNEResize,
                                                target: "moveResizeRange",
                                                col: aFormulaIntersection.c2,
                                                row: aFormulaIntersection.r1,
                                                formulaRange: arFormulaTmp,
                                                indexFormulaRange: i,
                                                targetArr: targetArr
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            do {
                var fillHandleEpsilon = this.width_1px;
                if (!isViewerMode && !this.isChartAreaEditMode && x >= (this.fillHandleL - fillHandleEpsilon) && x <= (this.fillHandleR + fillHandleEpsilon) && y >= (this.fillHandleT - fillHandleEpsilon) && y <= (this.fillHandleB + fillHandleEpsilon)) {
                    if (!this.objectRender.selectedGraphicObjectsExists()) {
                        return {
                            cursor: kCurFillHandle,
                            target: "fillhandle",
                            col: -1,
                            row: -1
                        };
                    }
                }
                var xWithOffset = x + offsetX;
                var yWithOffset = y + offsetY;
                arNorm = this.activeRange.clone(true);
                arIntersection = arNorm.intersectionSimple(this.visibleRange);
                if (arIntersection) {
                    left = arNorm.c1 === arIntersection.c1 ? this.cols[arNorm.c1].left : null;
                    right = arNorm.c2 === arIntersection.c2 ? this.cols[arNorm.c2].left + this.cols[arNorm.c2].width : null;
                    top = arNorm.r1 === arIntersection.r1 ? this.rows[arNorm.r1].top : null;
                    bottom = arNorm.r2 === arIntersection.r2 ? this.rows[arNorm.r2].top + this.rows[arNorm.r2].height : null;
                    if (!isViewerMode && ((((null !== left && xWithOffset >= left - this.width_2px && xWithOffset <= left + this.width_2px) || (null !== right && xWithOffset >= right - this.width_2px && xWithOffset <= right + this.width_2px)) && null !== top && null !== bottom && yWithOffset >= top - this.height_2px && yWithOffset <= bottom + this.height_2px) || (((null !== top && yWithOffset >= top - this.height_2px && yWithOffset <= top + this.height_2px) || (null !== bottom && yWithOffset >= bottom - this.height_2px && yWithOffset <= bottom + this.height_2px)) && null !== left && null !== right && xWithOffset >= left - this.width_2px && xWithOffset <= right + this.width_2px))) {
                        if (!this.objectRender.selectedGraphicObjectsExists()) {
                            return {
                                cursor: kCurMove,
                                target: "moveRange",
                                col: -1,
                                row: -1
                            };
                        }
                    }
                }
                if (x < this.cellsLeft && y < this.cellsTop) {
                    return {
                        cursor: kCurCorner,
                        target: "corner",
                        col: -1,
                        row: -1
                    };
                }
                if (x > this.cellsLeft && y > this.cellsTop) {
                    c = this._findColUnderCursor(x, true);
                    r = this._findRowUnderCursor(y, true);
                    if (c === null || r === null) {
                        break;
                    }
                    var lockRange = undefined;
                    var lockAllPosLeft = undefined;
                    var lockAllPosTop = undefined;
                    var userIdAllProps = undefined;
                    var userIdAllSheet = undefined;
                    if (!isViewerMode && this.collaborativeEditing.getCollaborativeEditing()) {
                        var c1Recalc = null,
                        r1Recalc = null;
                        var selectRangeRecalc = asc_Range(c.col, r.row, c.col, r.row);
                        var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, selectRangeRecalc);
                        if (false === isIntersection) {
                            lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, null, sheetId, new asc_CCollaborativeRange(selectRangeRecalc.c1, selectRangeRecalc.r1, selectRangeRecalc.c2, selectRangeRecalc.r2));
                            isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false);
                            if (false !== isLocked) {
                                userId = isLocked.UserId;
                                lockRange = isLocked.Element["rangeOrObjectId"];
                                c1Recalc = this.collaborativeEditing.m_oRecalcIndexColumns[sheetId].getLockOther(lockRange["c1"], c_oAscLockTypes.kLockTypeOther);
                                r1Recalc = this.collaborativeEditing.m_oRecalcIndexRows[sheetId].getLockOther(lockRange["r1"], c_oAscLockTypes.kLockTypeOther);
                                if (null !== c1Recalc && null !== r1Recalc) {
                                    lockRangePosLeft = this.getCellLeft(c1Recalc, 1);
                                    lockRangePosTop = this.getCellTop(r1Recalc, 1);
                                    lockRangePosLeft -= (this.cols[this.visibleRange.c1].left - this.cellsLeft);
                                    lockRangePosTop -= (this.rows[this.visibleRange.r1].top - this.cellsTop);
                                    lockRangePosLeft *= asc_getcvt(1, 0, this._getPPIX());
                                    lockRangePosTop *= asc_getcvt(1, 0, this._getPPIY());
                                }
                            }
                        } else {
                            lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, null, sheetId, null);
                        }
                        lockInfo["type"] = c_oAscLockTypeElem.Sheet;
                        isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, true);
                        if (false !== isLocked) {
                            userIdAllSheet = isLocked.UserId;
                            lockAllPosLeft = this.cellsLeft * asc_getcvt(1, 0, this._getPPIX());
                            lockAllPosTop = this.cellsTop * asc_getcvt(1, 0, this._getPPIY());
                        }
                        if (undefined === userIdAllSheet) {
                            lockInfo["type"] = c_oAscLockTypeElem.Range;
                            lockInfo["subType"] = c_oAscLockTypeElemSubType.InsertRows;
                            isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, true);
                            if (false !== isLocked) {
                                userIdAllProps = isLocked.UserId;
                                lockAllPosLeft = this.cellsLeft * asc_getcvt(1, 0, this._getPPIX());
                                lockAllPosTop = this.cellsTop * asc_getcvt(1, 0, this._getPPIY());
                            }
                        }
                    }
                    var comments = this.cellCommentator.asc_getComments(c.col, r.row);
                    var coords = undefined;
                    var indexes = undefined;
                    if (0 < comments.length) {
                        indexes = [];
                        for (i = 0; i < comments.length; ++i) {
                            indexes.push(comments[i].asc_getId());
                        }
                        coords = this.cellCommentator.getCommentsCoords(comments);
                    }
                    var oHyperlink = this.model.getHyperlinkByCell(r.row, c.col);
                    var cellCursor = {
                        cursor: kCurCells,
                        target: "cells",
                        col: (c ? c.col : -1),
                        row: (r ? r.row : -1),
                        userId: userId,
                        lockRangePosLeft: lockRangePosLeft,
                        lockRangePosTop: lockRangePosTop,
                        userIdAllProps: userIdAllProps,
                        lockAllPosLeft: lockAllPosLeft,
                        lockAllPosTop: lockAllPosTop,
                        userIdAllSheet: userIdAllSheet,
                        commentIndexes: indexes,
                        commentCoords: coords
                    };
                    if (null !== oHyperlink) {
                        return {
                            cursor: kCurHyperlink,
                            target: "hyperlink",
                            hyperlink: new asc_CHyperlink(oHyperlink),
                            cellCursor: cellCursor,
                            userId: userId,
                            lockRangePosLeft: lockRangePosLeft,
                            lockRangePosTop: lockRangePosTop,
                            userIdAllProps: userIdAllProps,
                            userIdAllSheet: userIdAllSheet,
                            lockAllPosLeft: lockAllPosLeft,
                            lockAllPosTop: lockAllPosTop,
                            commentIndexes: indexes,
                            commentCoords: coords
                        };
                    }
                    return cellCursor;
                }
                if (x <= this.cellsLeft && y >= this.cellsTop) {
                    r = this._findRowUnderCursor(y, true);
                    if (r === null) {
                        break;
                    }
                    f = !isViewerMode && (r.row !== this.visibleRange.r1 && y < r.top + 3 || y >= r.bottom - 3);
                    return {
                        cursor: f ? kCurRowResize : kCurRowSelect,
                        target: f ? "rowresize" : "rowheader",
                        col: -1,
                        row: r.row + (r.row !== this.visibleRange.r1 && f && y < r.top + 3 ? -1 : 0),
                        mouseY: f ? ((y < r.top + 3) ? (r.top - y - this.height_1px) : (r.bottom - y - this.height_1px)) : null
                    };
                }
                if (y <= this.cellsTop && x >= this.cellsLeft) {
                    c = this._findColUnderCursor(x, true);
                    if (c === null) {
                        break;
                    }
                    f = !isViewerMode && (c.col !== this.visibleRange.c1 && x < c.left + 3 || x >= c.right - 3);
                    return {
                        cursor: f ? kCurColResize : kCurColSelect,
                        target: f ? "colresize" : "colheader",
                        col: c.col + (c.col !== this.visibleRange.c1 && f && x < c.left + 3 ? -1 : 0),
                        row: -1,
                        mouseX: f ? ((x < c.left + 3) ? (c.left - x - this.width_1px) : (c.right - x - this.width_1px)) : null
                    };
                }
            } while (0);
            return {
                cursor: kCurDefault,
                target: "none",
                col: -1,
                row: -1
            };
        },
        _fixSelectionOfMergedCells: function (fixedRange) {
            var t = this;
            var ar = fixedRange ? fixedRange : ((this.isFormulaEditMode) ? t.arrActiveFormulaRanges[t.arrActiveFormulaRanges.length - 1] : t.activeRange);
            if (!ar) {
                return;
            }
            if (ar.type && ar.type !== c_oAscSelectionType.RangeCells) {
                return;
            }
            var res = this.model.expandRangeByMerged(ar.clone(true));
            if (ar.c1 !== res.c1 && ar.c1 !== res.c2) {
                ar.c1 = ar.c1 <= ar.c2 ? res.c1 : res.c2;
            }
            ar.c2 = ar.c1 === res.c1 ? res.c2 : (res.c1);
            if (ar.r1 !== res.r1 && ar.r1 !== res.r2) {
                ar.r1 = ar.r1 <= ar.r2 ? res.r1 : res.r2;
            }
            ar.r2 = ar.r1 === res.r1 ? res.r2 : res.r1;
        },
        _fixSelectionOfHiddenCells: function (dc, dr, range) {
            var t = this,
            ar = (range) ? range : t.activeRange,
            c1,
            c2,
            r1,
            r2,
            mc,
            i,
            arn = ar.clone(true);
            if (dc === undefined) {
                dc = +1;
            }
            if (dr === undefined) {
                dr = +1;
            }
            function findVisibleCol(from, dc, flag) {
                var to = dc < 0 ? -1 : t.cols.length,
                c;
                for (c = from; c !== to; c += dc) {
                    if (t.cols[c].width > t.width_1px) {
                        return c;
                    }
                }
                return flag ? -1 : findVisibleCol(from, dc * -1, true);
            }
            function findVisibleRow(from, dr, flag) {
                var to = dr < 0 ? -1 : t.rows.length,
                r;
                for (r = from; r !== to; r += dr) {
                    if (t.rows[r].height > t.height_1px) {
                        return r;
                    }
                }
                return flag ? -1 : findVisibleRow(from, dr * -1, true);
            }
            if (ar.c2 === ar.c1) {
                if (t.cols[ar.c1].width < t.width_1px) {
                    c1 = c2 = findVisibleCol(ar.c1, dc);
                }
            } else {
                if (0 !== dc && t.nColsCount > ar.c2 && t.cols[ar.c2].width < t.width_1px) {
                    for (mc = null, i = arn.r1; i <= arn.r2; ++i) {
                        mc = t.model.getMergedByCell(i, ar.c2);
                        if (mc) {
                            break;
                        }
                    }
                    if (!mc) {
                        c2 = findVisibleCol(ar.c2, dc);
                    }
                }
            }
            if (c1 < 0 || c2 < 0) {
                throw "Error: all columns are hidden";
            }
            if (ar.r2 === ar.r1) {
                if (t.rows[ar.r1].height < t.height_1px) {
                    r1 = r2 = findVisibleRow(ar.r1, dr);
                }
            } else {
                if (0 !== dr && t.nRowsCount > ar.r2 && t.rows[ar.r2].height < t.height_1px) {
                    for (mc = null, i = arn.c1; i <= arn.c2; ++i) {
                        mc = t.model.getMergedByCell(ar.r2, i);
                        if (mc) {
                            break;
                        }
                    }
                    if (!mc) {
                        r2 = findVisibleRow(ar.r2, dr);
                    }
                }
            }
            if (r1 < 0 || r2 < 0) {
                throw "Error: all rows are hidden";
            }
            ar.assign(c1 !== undefined ? c1 : ar.c1, r1 !== undefined ? r1 : ar.r1, c2 !== undefined ? c2 : ar.c2, r2 !== undefined ? r2 : ar.r2);
            if (c1 >= 0) {
                ar.startCol = c1;
            }
            if (r1 >= 0) {
                ar.startRow = r1;
            }
            if (t.cols[ar.startCol].width < t.width_1px) {
                c1 = findVisibleCol(ar.startCol, dc);
                if (c1 >= 0) {
                    ar.startCol = c1;
                }
            }
            if (t.rows[ar.startRow].height < t.height_1px) {
                r1 = findVisibleRow(ar.startRow, dr);
                if (r1 >= 0) {
                    ar.startRow = r1;
                }
            }
        },
        _moveActiveCellToXY: function (x, y) {
            var c, r;
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            x *= asc_getcvt(0, 1, this._getPPIX());
            y *= asc_getcvt(0, 1, this._getPPIY());
            if (x < this.cellsLeft && y < this.cellsTop) {
                ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
                ar.type = c_oAscSelectionType.RangeMax;
                ar.startCol = 0;
                ar.startRow = 0;
                this._fixSelectionOfHiddenCells();
            } else {
                if (x < this.cellsLeft) {
                    r = this._findRowUnderCursor(y).row;
                    ar.assign(0, r, this.cols.length - 1, r);
                    ar.type = c_oAscSelectionType.RangeRow;
                    ar.startCol = 0;
                    ar.startRow = r;
                    this._fixSelectionOfHiddenCells();
                } else {
                    if (y < this.cellsTop) {
                        c = this._findColUnderCursor(x).col;
                        ar.assign(c, 0, c, this.rows.length - 1);
                        ar.type = c_oAscSelectionType.RangeCol;
                        ar.startCol = c;
                        ar.startRow = 0;
                        this._fixSelectionOfHiddenCells();
                    } else {
                        c = this._findColUnderCursor(x).col;
                        r = this._findRowUnderCursor(y).row;
                        ar.assign(c, r, c, r);
                        ar.startCol = c;
                        ar.startRow = r;
                        ar.type = c_oAscSelectionType.RangeCells;
                        this._fixSelectionOfMergedCells();
                    }
                }
            }
        },
        _moveActiveCellToOffset: function (dc, dr) {
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);
            var c = mc ? (dc < 0 ? mc.c1 : dc > 0 ? Math.min(mc.c2, this.nColsCount - 1 - dc) : ar.startCol) : ar.startCol;
            var r = mc ? (dr < 0 ? mc.r1 : dr > 0 ? Math.min(mc.r2, this.nRowsCount - 1 - dr) : ar.startRow) : ar.startRow;
            var p = this._calcCellPosition(c, r, dc, dr);
            ar.assign(p.col, p.row, p.col, p.row);
            ar.type = c_oAscSelectionType.RangeCells;
            ar.startCol = p.col;
            ar.startRow = p.row;
            this._fixSelectionOfMergedCells();
            ar.normalize();
            this._fixSelectionOfHiddenCells(dc >= 0 ? +1 : -1, dr >= 0 ? +1 : -1);
        },
        _moveActivePointInSelection: function (dc, dr) {
            var ar = this.activeRange;
            var arn = this.activeRange.clone(true);
            ar.startCol += dc;
            ar.startRow += dr;
            do {
                var done = true;
                if (ar.startCol < arn.c1) {
                    ar.startCol = arn.c2;
                    ar.startRow -= 1;
                    if (ar.startRow < arn.r1) {
                        ar.startRow = arn.r2;
                    }
                } else {
                    if (ar.startCol > arn.c2) {
                        ar.startCol = arn.c1;
                        ar.startRow += 1;
                        if (ar.startRow > arn.r2) {
                            ar.startRow = arn.r1;
                        }
                    }
                }
                if (ar.startRow < arn.r1) {
                    ar.startRow = arn.r2;
                    ar.startCol -= 1;
                    if (ar.startCol < arn.c1) {
                        ar.startCol = arn.c2;
                    }
                } else {
                    if (ar.startRow > arn.r2) {
                        ar.startRow = arn.r1;
                        ar.startCol += 1;
                        if (ar.startCol > arn.c2) {
                            ar.startCol = arn.c1;
                        }
                    }
                }
                var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);
                if (mc) {
                    if (dc > 0 && (ar.startCol > mc.c1 || ar.startRow !== mc.r1)) {
                        ar.startCol = mc.c2 + 1;
                        done = false;
                    } else {
                        if (dc < 0 && (ar.startCol < mc.c2 || ar.startRow !== mc.r1)) {
                            ar.startCol = mc.c1 - 1;
                            done = false;
                        }
                    }
                    if (dr > 0 && (ar.startRow > mc.r1 || ar.startCol !== mc.c1)) {
                        ar.startRow = mc.r2 + 1;
                        done = false;
                    } else {
                        if (dr < 0 && (ar.startRow < mc.r2 || ar.startCol !== mc.c1)) {
                            ar.startRow = mc.r1 - 1;
                            done = false;
                        }
                    }
                }
                if (!done) {
                    continue;
                }
                while (ar.startCol >= arn.c1 && ar.startCol <= arn.c2 && this.cols[ar.startCol].width < 1e-06) {
                    ar.startCol += dc || (dr > 0 ? +1 : -1);
                    done = false;
                }
                if (!done) {
                    continue;
                }
                while (ar.startRow >= arn.r1 && ar.startRow <= arn.r2 && this.rows[ar.startRow].height < 1e-06) {
                    ar.startRow += dr || (dc > 0 ? +1 : -1);
                    done = false;
                }
            } while (!done);
        },
        _calcSelectionEndPointByXY: function (x, y) {
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            x *= asc_getcvt(0, 1, this._getPPIX());
            y *= asc_getcvt(0, 1, this._getPPIY());
            return {
                c2: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? this._findColUnderCursor(x).col : ar.c2,
                r2: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? this._findRowUnderCursor(y).row : ar.r2
            };
        },
        _calcSelectionEndPointByOffset: function (dc, dr) {
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            var mc = this.model.getMergedByCell(ar.r2, ar.c2);
            var c = mc ? (dc <= 0 ? mc.c1 : mc.c2) : ar.c2;
            var r = mc ? (dr <= 0 ? mc.r1 : mc.r2) : ar.r2;
            var p = this._calcCellPosition(c, r, dc, dr);
            return {
                c2: p.col,
                r2: p.row
            };
        },
        _calcActiveRangeOffset: function () {
            var vr = this.visibleRange;
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            if (this.isFormulaEditMode) {
                if (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount) {
                    ar = ar.clone(true);
                    ar.c2 = (ar.c2 >= this.nColsCount) ? this.nColsCount - 1 : ar.c2;
                    ar.r2 = (ar.r2 >= this.nRowsCount) ? this.nRowsCount - 1 : ar.r2;
                }
            }
            var arn = ar.clone(true);
            var isMC = this._isMergedCells(arn);
            var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
            var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
            var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
            var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;
            if (adjustRight) {
                while (this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX)) {
                    ++incX;
                }
            }
            if (adjustBottom) {
                while (this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY)) {
                    ++incY;
                }
            }
            return {
                deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
                deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
            };
        },
        _calcActiveCellOffset: function () {
            var vr = this.visibleRange;
            var ar = this.activeRange;
            var arn = ar.clone(true);
            var isMC = this._isMergedCells(arn);
            var adjustRight = ar.startCol >= vr.c2 || ar.startCol >= vr.c2 && isMC;
            var adjustBottom = ar.startRow >= vr.r2 || ar.startRow >= vr.r2 && isMC;
            var incX = ar.startCol < vr.c1 && isMC ? arn.startCol - vr.c1 : ar.startCol < vr.c1 ? ar.startCol - vr.c1 : 0;
            var incY = ar.startRow < vr.r1 && isMC ? arn.startRow - vr.r1 : ar.startRow < vr.r1 ? ar.startRow - vr.r1 : 0;
            if (adjustRight) {
                while (this._isColDrawnPartially(isMC ? arn.startCol : ar.startCol, vr.c1 + incX)) {
                    ++incX;
                }
            }
            if (adjustBottom) {
                while (this._isRowDrawnPartially(isMC ? arn.startRow : ar.startRow, vr.r1 + incY)) {
                    ++incY;
                }
            }
            return {
                deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
                deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
            };
        },
        _calcFillHandleOffset: function (range) {
            var vr = this.visibleRange;
            var ar = range ? range : this.activeFillHandle;
            var arn = ar.clone(true);
            var isMC = this._isMergedCells(arn);
            var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
            var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
            var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
            var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;
            if (adjustRight) {
                try {
                    while (this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX)) {
                        ++incX;
                    }
                } catch(e) {
                    this.expandColsOnScroll(true);
                    this._trigger("reinitializeScrollX");
                }
            }
            if (adjustBottom) {
                try {
                    while (this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY)) {
                        ++incY;
                    }
                } catch(e) {
                    this.expandRowsOnScroll(true);
                    this._trigger("reinitializeScrollY");
                }
            }
            return {
                deltaX: incX,
                deltaY: incY
            };
        },
        getSelectionMergeInfo: function (options) {
            var t = this;
            var arn = t.activeRange.clone(true);
            var notEmpty = false;
            var r, c;
            switch (options) {
            case c_oAscMergeOptions.Merge:
                case c_oAscMergeOptions.MergeCenter:
                for (r = arn.r1; r <= arn.r2; ++r) {
                    for (c = arn.c1; c <= arn.c2; ++c) {
                        if (false === this._isCellEmpty(c, r)) {
                            if (notEmpty) {
                                return true;
                            }
                            notEmpty = true;
                        }
                    }
                }
                break;
            case c_oAscMergeOptions.MergeAcross:
                for (r = arn.r1; r <= arn.r2; ++r) {
                    notEmpty = false;
                    for (c = arn.c1; c <= arn.c2; ++c) {
                        if (false === this._isCellEmpty(c, r)) {
                            if (notEmpty) {
                                return true;
                            }
                            notEmpty = true;
                        }
                    }
                }
                break;
            }
            return false;
        },
        getSelectionName: function (bRangeText) {
            if (this.isSelectOnShape) {
                return " ";
            }
            var ar = this.activeRange;
            var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);
            var c1 = mc ? mc.c1 : ar.startCol;
            var r1 = mc ? mc.r1 : ar.startRow;
            var selectionSize = !bRangeText ? "" : (function (r) {
                var rc = Math.abs(r.r2 - r.r1) + 1;
                var cc = Math.abs(r.c2 - r.c1) + 1;
                switch (r.type) {
                case c_oAscSelectionType.RangeCells:
                    return rc + "R x " + cc + "C";
                case c_oAscSelectionType.RangeCol:
                    return cc + "C";
                case c_oAscSelectionType.RangeRow:
                    return rc + "R";
                case c_oAscSelectionType.RangeMax:
                    return gc_nMaxRow + "R x " + gc_nMaxCol + "C";
                }
                return "";
            })(ar);
            var cellName = this._getColumnTitle(c1) + this._getRowTitle(r1);
            return selectionSize || cellName;
        },
        getSelectionRangeValue: function () {
            var sListName = this.model.getName();
            return sListName + "!" + this.getActiveRange(this.activeRange.clone(true));
        },
        getSelectionInfo: function (bExt) {
            return this.objectRender.selectedGraphicObjectsExists() ? this._getSelectionInfoObject(bExt) : this._getSelectionInfoCell(bExt);
        },
        _getSelectionInfoCell: function (bExt) {
            var c_opt = this.settings.cells;
            var activeCell = this.activeRange;
            var mc = this.model.getMergedByCell(activeCell.startRow, activeCell.startCol);
            var c1 = mc ? mc.c1 : activeCell.startCol;
            var r1 = mc ? mc.r1 : activeCell.startRow;
            var c = this._getVisibleCell(c1, r1);
            if (c === undefined) {
                asc_debug("log", "Unknown cell's info: col = " + c1 + ", row = " + r1);
                return {};
            }
            var fc = c.getFontcolor();
            var bg = c.getFill();
            var b = this._getBordersCache(c1, r1);
            var fa = c.getFontAlign().toLowerCase();
            var cellType = c.getType();
            var isNumberFormat = (!cellType || CellValueType.Number === cellType);
            var cell_info = new asc_CCellInfo();
            cell_info.name = this._getColumnTitle(c1) + this._getRowTitle(r1);
            cell_info.formula = c.getFormula();
            cell_info.text = c.getValueForEdit();
            cell_info.halign = c.getAlignHorizontalByValue().toLowerCase();
            cell_info.valign = c.getAlignVertical().toLowerCase();
            cell_info.isFormatTable = this.autoFilters.searchRangeInTableParts(activeCell);
            cell_info.styleName = c.getStyleName();
            cell_info.angle = c.getAngle();
            cell_info.flags = new asc_CCellFlag();
            cell_info.flags.shrinkToFit = c.getShrinkToFit();
            cell_info.flags.wrapText = c.getWrap();
            cell_info.flags.selectionType = this.activeRange.type;
            cell_info.flags.lockText = ("" !== cell_info.text && (isNumberFormat || "" !== cell_info.formula));
            cell_info.font = new asc_CFont();
            cell_info.font.name = c.getFontname();
            cell_info.font.size = c.getFontsize();
            cell_info.font.bold = c.getBold();
            cell_info.font.italic = c.getItalic();
            cell_info.font.underline = ("none" !== c.getUnderline());
            cell_info.font.strikeout = c.getStrikeout();
            cell_info.font.subscript = fa === "subscript";
            cell_info.font.superscript = fa === "superscript";
            cell_info.font.color = (fc ? asc_obj2Color(fc) : asc_n2Color(c_opt.defaultState.colorNumber));
            cell_info.fill = new asc_CFill((null !== bg && undefined !== bg) ? asc_obj2Color(bg) : bg);
            cell_info.border = new asc_CBorders();
            cell_info.border.left = new asc_CBorder(b.l.s, b.l.c);
            cell_info.border.top = new asc_CBorder(b.t.s, b.t.c);
            cell_info.border.right = new asc_CBorder(b.r.s, b.r.c);
            cell_info.border.bottom = new asc_CBorder(b.b.s, b.b.c);
            cell_info.border.diagDown = new asc_CBorder(b.dd.s, b.dd.c);
            cell_info.border.diagUp = new asc_CBorder(b.du.s, b.du.c);
            cell_info.numFormatType = c.getNumFormatType();
            var ar = this.activeRange.clone();
            var range = this.model.getRange3(ar.r1, ar.c1, ar.r2, ar.c2);
            var hyperlink = range.getHyperlink();
            var oHyperlink;
            if (null !== hyperlink) {
                oHyperlink = new asc_CHyperlink(hyperlink);
                oHyperlink.asc_setText(cell_info.text);
                cell_info.hyperlink = oHyperlink;
            } else {
                cell_info.hyperlink = null;
            }
            cell_info.comments = this.cellCommentator.asc_getComments(ar.c1, ar.r1);
            cell_info.flags.merge = null !== range.hasMerged();
            if (bExt) {
                cell_info.innertext = c.getValue();
                cell_info.numFormat = c.getNumFormatStr();
            }
            if (false !== this.collaborativeEditing.isCoAuthoringExcellEnable()) {
                var sheetId = this.model.getId();
                var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
                if (false === isIntersection) {
                    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, null, sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));
                    if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                        cell_info.isLocked = true;
                    }
                }
            }
            return cell_info;
        },
        _getSelectionInfoObject: function (bExt) {
            var objectInfo = new asc_CCellInfo();
            var defaults = this.settings.cells;
            var selectionType = c_oAscSelectionType.RangeShape;
            objectInfo.flags = new asc_CCellFlag();
            var graphicObjects = this.objectRender.getSelectedGraphicObjects();
            if (graphicObjects.length) {
                selectionType = objectInfo.flags.selectionType = this.objectRender.getGraphicSelectionType(graphicObjects[0].Id);
            }
            var textPr = this.objectRender.controller.getParagraphTextPr();
            var paraPr = this.objectRender.controller.getParagraphParaPr();
            if (textPr && paraPr) {
                objectInfo.text = this.objectRender.controller.Get_SelectedText();
                var horAlign = "center";
                switch (paraPr.Jc) {
                case align_Left:
                    horAlign = "left";
                    break;
                case align_Right:
                    horAlign = "right";
                    break;
                case align_Center:
                    horAlign = "center";
                    break;
                case align_Justify:
                    horAlign = "justify";
                    break;
                }
                var vertAlign = "center";
                switch (paraPr.anchor) {
                case VERTICAL_ANCHOR_TYPE_BOTTOM:
                    vertAlign = "bottom";
                    break;
                case VERTICAL_ANCHOR_TYPE_CENTER:
                    vertAlign = "center";
                    break;
                case VERTICAL_ANCHOR_TYPE_TOP:
                    case VERTICAL_ANCHOR_TYPE_DISTRIBUTED:
                    case VERTICAL_ANCHOR_TYPE_JUSTIFIED:
                    vertAlign = "top";
                    break;
                }
                objectInfo.halign = horAlign;
                objectInfo.valign = vertAlign;
                objectInfo.font = new asc_CFont();
                objectInfo.font.name = textPr.FontFamily ? textPr.FontFamily.Name : "";
                objectInfo.font.size = textPr.FontSize;
                objectInfo.font.bold = textPr.Bold;
                objectInfo.font.italic = textPr.Italic;
                objectInfo.font.underline = textPr.Underline;
                objectInfo.font.strikeout = textPr.Strikeout;
                objectInfo.font.subscript = textPr.VertAlign == vertalign_SubScript;
                objectInfo.font.superscript = textPr.VertAlign == vertalign_SuperScript;
                if (textPr.Color) {
                    objectInfo.font.color = CreateAscColorCustom(textPr.Color.r, textPr.Color.g, textPr.Color.b);
                }
                var shapeHyperlink = this.objectRender.controller.getHyperlinkInfo();
                if (shapeHyperlink && (shapeHyperlink instanceof ParaHyperlinkStart)) {
                    var hyperlink = new Hyperlink();
                    hyperlink.Tooltip = shapeHyperlink.ToolTip;
                    var spl = shapeHyperlink.Value.split("!");
                    if (spl.length === 2) {
                        hyperlink.setLocation(shapeHyperlink.Value);
                    } else {
                        hyperlink.Hyperlink = shapeHyperlink.Value;
                    }
                    objectInfo.hyperlink = new asc_CHyperlink(hyperlink);
                }
            } else {
                if (c_oAscSelectionType.RangeShape == selectionType) {
                    objectInfo.font = new asc_CFont();
                    objectInfo.font.name = defaults.fontName;
                    objectInfo.font.size = defaults.fontSize;
                }
            }
            objectInfo.fill = new asc_CFill(asc_n2Color(0));
            return objectInfo;
        },
        getActiveCellCoord: function () {
            var xL = this.getCellLeft(this.activeRange.startCol, 1);
            var yL = this.getCellTop(this.activeRange.startRow, 1);
            xL -= (this.cols[this.visibleRange.c1].left - this.cellsLeft);
            yL -= (this.rows[this.visibleRange.r1].top - this.cellsTop);
            xL *= asc_getcvt(1, 0, this._getPPIX());
            yL *= asc_getcvt(1, 0, this._getPPIY());
            var width = this.getColumnWidth(this.activeRange.startCol, 0);
            var height = this.getRowHeight(this.activeRange.startRow, 0);
            return new asc_CCellRect(xL, yL, width, height);
        },
        _checkSelectionShape: function () {
            var isSelectOnShape = this.isSelectOnShape;
            if (this.isSelectOnShape) {
                this.isSelectOnShape = false;
                this.objectRender.unselectDrawingObjects();
            }
            return isSelectOnShape;
        },
        _updateSelectionNameAndInfo: function () {
            this._trigger("selectionNameChanged", this.getSelectionName(false));
            this._trigger("selectionChanged", this.getSelectionInfo());
        },
        getSelectionShape: function () {
            return this.isSelectOnShape;
        },
        setSelectionShape: function (isSelectOnShape) {
            this.isSelectOnShape = isSelectOnShape;
            this._trigger("selectionNameChanged", this.getSelectionName());
            this._trigger("selectionChanged", this.getSelectionInfo());
        },
        setSelection: function (range, validRange) {
            if (validRange && (range.c2 >= this.nColsCount || range.r2 >= this.nRowsCount)) {
                if (range.c2 >= this.nColsCount) {
                    this.expandColsOnScroll(false, true, range.c2 + 1);
                }
                if (range.r2 >= this.nRowsCount) {
                    this.expandRowsOnScroll(false, true, range.r2 + 1);
                }
            }
            this.cleanSelection();
            if (! (range instanceof asc_Range)) {
                range = asc_Range(range.c1, range.r1, range.c2, range.r2);
            }
            if (gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2) {
                range = range.clone();
                if (gc_nMaxCol0 === range.c2) {
                    range.c2 = this.cols.length - 1;
                }
                if (gc_nMaxRow0 === range.r2) {
                    range.r2 = this.rows.length - 1;
                }
            }
            this.activeRange = range;
            this.activeRange.type = c_oAscSelectionType.RangeCells;
            this.activeRange.startCol = range.c1;
            this.activeRange.startRow = range.r1;
            this.activeRange.normalize();
            this._drawSelection();
            this._trigger("selectionNameChanged", this.getSelectionName(false));
            this._trigger("selectionChanged", this.getSelectionInfo());
            return this._calcActiveCellOffset();
        },
        changeSelectionStartPoint: function (x, y, isCoord, isSelectMode) {
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            var sc = ar.startCol,
            sr = ar.startRow,
            ret = {};
            var isChangeSelectionShape = false;
            this.cleanSelection();
            var commentList = this.cellCommentator.getCommentsXY(x, y);
            if (!commentList.length) {
                this.model.workbook.handlers.trigger("asc_onHideComment");
                this.cellCommentator.resetLastSelectedId();
            }
            if (isCoord) {
                this._moveActiveCellToXY(x, y);
                isChangeSelectionShape = this._checkSelectionShape();
            } else {
                this._moveActiveCellToOffset(x, y);
                ret = this._calcActiveRangeOffset();
            }
            if (!this.isCellEditMode && (sc !== ar.startCol || sr !== ar.startRow || isChangeSelectionShape)) {
                if (!this.isSelectionDialogMode) {
                    this._trigger("selectionNameChanged", this.getSelectionName(false));
                    if (!isSelectMode) {
                        this._trigger("selectionChanged", this.getSelectionInfo());
                    }
                } else {
                    this._trigger("selectionRangeChanged", this.getSelectionRangeValue());
                }
            }
            if (!isChangeSelectionShape) {
                this._drawSelection();
            }
            return ret;
        },
        changeSelectionStartPointRightClick: function (x, y) {
            var ar = this.activeRange;
            var isChangeSelectionShape = this._checkSelectionShape();
            this.model.workbook.handlers.trigger("asc_onHideComment");
            var xL = this.getCellLeft(ar.c1, 1);
            var yL = this.getCellTop(ar.r1, 1);
            var xR = this.getCellLeft(ar.c2, 1) + this.cols[ar.c2].width;
            var yR = this.getCellTop(ar.r2, 1) + this.rows[ar.r2].height;
            var _x = x * asc_getcvt(0, 1, this._getPPIX());
            var _y = y * asc_getcvt(0, 1, this._getPPIY());
            var isInSelection = false;
            if ((_x < this.cellsLeft || _y < this.cellsTop) && c_oAscSelectionType.RangeMax === ar.type) {
                isInSelection = true;
            } else {
                if (_x > this.cellsLeft && _y > this.cellsTop) {
                    _x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
                    _y += (this.rows[this.visibleRange.r1].top - this.cellsTop);
                    if (xL <= _x && _x <= xR && yL <= _y && _y <= yR) {
                        isInSelection = true;
                    }
                } else {
                    if (_x <= this.cellsLeft && _y >= this.cellsTop && c_oAscSelectionType.RangeRow === ar.type) {
                        _y += (this.rows[this.visibleRange.r1].top - this.cellsTop);
                        if (yL <= _y && _y <= yR) {
                            isInSelection = true;
                        }
                    } else {
                        if (_y <= this.cellsTop && _x >= this.cellsLeft && c_oAscSelectionType.RangeCol === ar.type) {
                            _x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
                            if (xL <= _x && _x <= xR) {
                                isInSelection = true;
                            }
                        }
                    }
                }
            }
            if (!isInSelection) {
                this.cleanSelection();
                this._moveActiveCellToXY(x, y);
                this._drawSelection();
                this._updateSelectionNameAndInfo();
                return false;
            } else {
                if (isChangeSelectionShape) {
                    this.cleanSelection();
                    this._drawSelection();
                    this._updateSelectionNameAndInfo();
                }
            }
            return true;
        },
        changeSelectionEndPoint: function (x, y, isCoord, isSelectMode) {
            var isChangeSelectionShape = false;
            if (isCoord) {
                isChangeSelectionShape = this._checkSelectionShape();
            }
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            var arOld = ar.clone();
            var arnOld = ar.clone(true);
            var ep = isCoord ? this._calcSelectionEndPointByXY(x, y) : this._calcSelectionEndPointByOffset(x, y);
            var epOld, ret;
            if (ar.c2 !== ep.c2 || ar.r2 !== ep.r2 || isChangeSelectionShape) {
                this.cleanSelection();
                ar.assign(ar.startCol, ar.startRow, ep.c2, ep.r2);
                if (ar.type === c_oAscSelectionType.RangeCells) {
                    this._fixSelectionOfMergedCells();
                    while (!isCoord && arnOld.isEqual(ar.clone(true))) {
                        ar.c2 = ep.c2;
                        ar.r2 = ep.r2;
                        epOld = $.extend({},
                        ep);
                        ep = this._calcSelectionEndPointByOffset(x < 0 ? -1 : x > 0 ? +1 : 0, y < 0 ? -1 : y > 0 ? +1 : 0);
                        ar.assign(ar.startCol, ar.startRow, ep.c2, ep.r2);
                        this._fixSelectionOfMergedCells();
                        if (ep.c2 === epOld.c2 && ep.r2 === epOld.r2) {
                            break;
                        }
                    }
                }
                if (!isCoord) {
                    this._fixSelectionOfHiddenCells(ar.c2 - arOld.c2 >= 0 ? +1 : -1, ar.r2 - arOld.r2 >= 0 ? +1 : -1);
                }
                this._drawSelection();
            }
            ret = this._calcActiveRangeOffset();
            if (!this.isCellEditMode && !arnOld.isEqual(ar.clone(true))) {
                if (!this.isSelectionDialogMode) {
                    this._trigger("selectionNameChanged", this.getSelectionName(true));
                    if (!isSelectMode) {
                        this._trigger("selectionChanged", this.getSelectionInfo(false));
                    }
                } else {
                    this._trigger("selectionRangeChanged", this.getSelectionRangeValue());
                }
            }
            this.model.workbook.handlers.trigger("asc_onHideComment");
            return ret;
        },
        changeSelectionDone: function () {
            if (this.isFormulaEditMode && this.arrActiveFormulaRanges.length > 0) {
                this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1].normalize();
            } else {
                this.activeRange.normalize();
            }
        },
        changeSelectionActivePoint: function (dc, dr) {
            var ret;
            var ar = this.activeRange;
            var mc = this.model.getMergedByCell(ar.r1, ar.c1);
            if (ar.c1 === ar.c2 && ar.r1 === ar.r2 || mc && ar.isEqual(mc)) {
                return this.changeSelectionStartPoint(dc, dr, false, false);
            }
            this.cleanSelection();
            this._moveActivePointInSelection(dc, dr);
            this._drawSelection();
            ret = this._calcActiveCellOffset();
            this._trigger("selectionNameChanged", this.getSelectionName(false));
            this._trigger("selectionChanged", this.getSelectionInfo());
            return ret;
        },
        changeSelectionFillHandle: function (x, y) {
            var ret = null;
            if (null === this.activeFillHandle) {
                this.activeFillHandle = this.activeRange.clone(true);
                this.activeFillHandle.normalize();
                return ret;
            }
            x *= asc_getcvt(0, 1, this._getPPIX());
            y *= asc_getcvt(0, 1, this._getPPIY());
            this.cleanSelection();
            var ar = this.activeRange.clone(true);
            var xL = this.getCellLeft(ar.c1, 1);
            var yL = this.getCellTop(ar.r1, 1);
            var xR = this.getCellLeft(ar.c2, 1) + this.cols[ar.c2].width;
            var yR = this.getCellTop(ar.r2, 1) + this.rows[ar.r2].height;
            var activeFillHandleCopy;
            var colByX = this._findColUnderCursor(x, false, true).col;
            var rowByY = this._findRowUnderCursor(y, false, true).row;
            var colByXNoDX = this._findColUnderCursor(x, false, false).col;
            var rowByYNoDY = this._findRowUnderCursor(y, false, false).row;
            var dCol;
            var dRow;
            x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
            y += (this.rows[this.visibleRange.r1].top - this.cellsTop);
            var dXL = x - xL;
            var dYL = y - yL;
            var dXR = x - xR;
            var dYR = y - yR;
            var dXRMod;
            var dYRMod;
            var _tmpArea = 0;
            if (dXR <= 0) {
                if (dXL <= 0) {
                    if (dYR <= 0) {
                        if (dYL <= 0) {
                            _tmpArea = 1;
                        } else {
                            _tmpArea = 4;
                        }
                    } else {
                        _tmpArea = 7;
                    }
                } else {
                    if (dYR <= 0) {
                        if (dYL <= 0) {
                            _tmpArea = 2;
                        } else {
                            _tmpArea = 5;
                        }
                    } else {
                        _tmpArea = 8;
                    }
                }
            } else {
                if (dYR <= 0) {
                    if (dYL <= 0) {
                        _tmpArea = 3;
                    } else {
                        _tmpArea = 6;
                    }
                } else {
                    _tmpArea = 9;
                }
            }
            switch (_tmpArea) {
            case 2:
                case 8:
                this.fillHandleDirection = 1;
                break;
            case 4:
                case 6:
                this.fillHandleDirection = 0;
                break;
            case 1:
                dXRMod = Math.abs(x - xL);
                dYRMod = Math.abs(y - yL);
                dCol = Math.abs(colByX - ar.c1);
                dRow = Math.abs(rowByY - ar.r1);
                this.fillHandleDirection = -1;
                break;
            case 3:
                dXRMod = Math.abs(x - xR);
                dYRMod = Math.abs(y - yL);
                dCol = Math.abs(colByX - ar.c2);
                dRow = Math.abs(rowByY - ar.r1);
                this.fillHandleDirection = -1;
                break;
            case 7:
                dXRMod = Math.abs(x - xL);
                dYRMod = Math.abs(y - yR);
                dCol = Math.abs(colByX - ar.c1);
                dRow = Math.abs(rowByY - ar.r2);
                this.fillHandleDirection = -1;
                break;
            case 5:
                case 9:
                dXRMod = Math.abs(dXR);
                dYRMod = Math.abs(dYR);
                dCol = Math.abs(colByX - ar.c2);
                dRow = Math.abs(rowByY - ar.r2);
                this.fillHandleDirection = -1;
                break;
            }
            if (-1 === this.fillHandleDirection) {
                if (0 === dCol && 0 !== dRow) {
                    this.fillHandleDirection = 1;
                } else {
                    if (0 !== dCol && 0 === dRow) {
                        this.fillHandleDirection = 0;
                    } else {
                        if (dXRMod >= dYRMod) {
                            this.fillHandleDirection = 0;
                        } else {
                            this.fillHandleDirection = 1;
                        }
                    }
                }
            }
            if (0 === this.fillHandleDirection) {
                if (dXR <= 0) {
                    if (dXL <= 0) {
                        this.fillHandleArea = 1;
                    } else {
                        this.fillHandleArea = 2;
                    }
                } else {
                    this.fillHandleArea = 3;
                }
                this.activeFillHandle.c2 = colByX;
                switch (this.fillHandleArea) {
                case 1:
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;
                    this.activeFillHandle.r2 = ar.r1;
                    this.activeFillHandle.c2 += 1;
                    if (this.activeFillHandle.c2 == ar.c1) {
                        this.fillHandleArea = 2;
                    }
                    break;
                case 2:
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;
                    this.activeFillHandle.r2 = ar.r1;
                    this.activeFillHandle.c2 += 1;
                    if (this.activeFillHandle.c2 > this.activeFillHandle.c1) {
                        this.activeFillHandle.c1 = ar.c1;
                        this.activeFillHandle.r1 = ar.r1;
                        this.activeFillHandle.c2 = ar.c1;
                        this.activeFillHandle.r2 = ar.r1;
                    }
                    break;
                case 3:
                    this.activeFillHandle.c1 = ar.c1;
                    this.activeFillHandle.r1 = ar.r1;
                    this.activeFillHandle.r2 = ar.r2;
                    break;
                }
                activeFillHandleCopy = this.activeFillHandle.clone();
                activeFillHandleCopy.c2 = colByXNoDX;
            } else {
                if (dYR <= 0) {
                    if (dYL <= 0) {
                        this.fillHandleArea = 1;
                    } else {
                        this.fillHandleArea = 2;
                    }
                } else {
                    this.fillHandleArea = 3;
                }
                this.activeFillHandle.r2 = rowByY;
                switch (this.fillHandleArea) {
                case 1:
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;
                    this.activeFillHandle.c2 = ar.c1;
                    this.activeFillHandle.r2 += 1;
                    if (this.activeFillHandle.r2 == ar.r1) {
                        this.fillHandleArea = 2;
                    }
                    break;
                case 2:
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;
                    this.activeFillHandle.c2 = ar.c1;
                    this.activeFillHandle.r2 += 1;
                    if (this.activeFillHandle.r2 > this.activeFillHandle.r1) {
                        this.activeFillHandle.c1 = ar.c1;
                        this.activeFillHandle.r1 = ar.r1;
                        this.activeFillHandle.c2 = ar.c1;
                        this.activeFillHandle.r2 = ar.r1;
                    }
                    break;
                case 3:
                    this.activeFillHandle.c1 = ar.c1;
                    this.activeFillHandle.r1 = ar.r1;
                    this.activeFillHandle.c2 = ar.c2;
                    break;
                }
                activeFillHandleCopy = this.activeFillHandle.clone();
                activeFillHandleCopy.r2 = rowByYNoDY;
            }
            this._drawSelection();
            ret = this._calcFillHandleOffset(activeFillHandleCopy);
            this.model.workbook.handlers.trigger("asc_onHideComment");
            return ret;
        },
        applyFillHandle: function (x, y, ctrlPress) {
            var t = this;
            var arn = t.activeRange.clone(true);
            arn.normalize();
            var range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
            var bIsHaveChanges = false;
            var nIndex = 0;
            if (0 === this.fillHandleDirection) {
                nIndex = this.activeFillHandle.c2 - arn.c1;
                if (2 === this.fillHandleArea) {
                    bIsHaveChanges = arn.c2 !== (this.activeFillHandle.c2 - 1);
                } else {
                    bIsHaveChanges = arn.c2 !== this.activeFillHandle.c2;
                }
            } else {
                nIndex = this.activeFillHandle.r2 - arn.r1;
                if (2 === this.fillHandleArea) {
                    bIsHaveChanges = arn.r2 !== (this.activeFillHandle.r2 - 1);
                } else {
                    bIsHaveChanges = arn.r2 !== this.activeFillHandle.r2;
                }
            }
            if (bIsHaveChanges && (this.activeFillHandle.r1 !== this.activeFillHandle.r2 || this.activeFillHandle.c1 !== this.activeFillHandle.c2)) {
                var changedRange = this.activeRange.clone(true);
                this.cleanSelection();
                if (2 === this.fillHandleArea) {
                    this.activeRange.normalize();
                    this.activeRange.startCol = this.activeRange.c1;
                    this.activeRange.startRow = this.activeRange.r1;
                    if (arn.c1 !== this.activeFillHandle.c2 || arn.r1 !== this.activeFillHandle.r2) {
                        if (0 === this.fillHandleDirection) {
                            this.activeRange.c2 = this.activeFillHandle.c2 - 1;
                            changedRange.c1 = changedRange.c2;
                            changedRange.c2 = this.activeFillHandle.c2;
                        } else {
                            this.activeRange.r2 = this.activeFillHandle.r2 - 1;
                            changedRange.r1 = changedRange.r2;
                            changedRange.r2 = this.activeFillHandle.r2;
                        }
                    }
                } else {
                    if (0 === this.fillHandleDirection) {
                        if (1 === this.fillHandleArea) {
                            this.activeRange.c1 = this.activeFillHandle.c2;
                            changedRange.c2 = changedRange.c1 - 1;
                            changedRange.c1 = this.activeFillHandle.c2;
                        } else {
                            this.activeRange.c2 = this.activeFillHandle.c2;
                            changedRange.c1 = changedRange.c2 + 1;
                            changedRange.c2 = this.activeFillHandle.c2;
                        }
                    } else {
                        if (1 === this.fillHandleArea) {
                            this.activeRange.r1 = this.activeFillHandle.r2;
                            changedRange.r2 = changedRange.r1 - 1;
                            changedRange.r1 = this.activeFillHandle.r2;
                        } else {
                            this.activeRange.r2 = this.activeFillHandle.r2;
                            changedRange.r1 = changedRange.r2 + 1;
                            changedRange.r2 = this.activeFillHandle.r2;
                        }
                    }
                    arn = this.activeRange.clone(true);
                }
                changedRange.normalize();
                var applyFillHandleCallback = function (res) {
                    if (res) {
                        range.promote(ctrlPress, (1 === t.fillHandleDirection), nIndex);
                        t.autoFilters._renameTableColumn(arn);
                    }
                    t.activeFillHandle = null;
                    t.fillHandleDirection = -1;
                    arn.c1 = 0;
                    arn.c2 = gc_nMaxCol0;
                    t.isChanged = true;
                    t._updateCellsRange(arn);
                };
                this._isLockedCells(changedRange, null, applyFillHandleCallback);
            } else {
                this.cleanSelection();
                this.activeFillHandle = null;
                this.fillHandleDirection = -1;
                this._drawSelection();
            }
        },
        changeSelectionMoveRangeHandle: function (x, y, ctrlKey) {
            var ret = null;
            x *= asc_getcvt(0, 1, this._getPPIX());
            y *= asc_getcvt(0, 1, this._getPPIY());
            var ar = this.activeRange.clone(true);
            var colByX = this._findColUnderCursor(x, false, false).col;
            var rowByY = this._findRowUnderCursor(y, false, false).row;
            if (null === this.startCellMoveRange) {
                if (colByX < ar.c1) {
                    colByX = ar.c1;
                } else {
                    if (colByX > ar.c2) {
                        colByX = ar.c2;
                    }
                }
                if (rowByY < ar.r1) {
                    rowByY = ar.r1;
                } else {
                    if (rowByY > ar.r2) {
                        rowByY = ar.r2;
                    }
                }
                this.startCellMoveRange = asc_Range(colByX, rowByY, colByX, rowByY);
                this.startCellMoveRange.isChanged = false;
                return ret;
            }
            var colDelta = colByX - this.startCellMoveRange.c1;
            var rowDelta = rowByY - this.startCellMoveRange.r1;
            if (false === this.startCellMoveRange.isChanged && 0 === colDelta && 0 === rowDelta) {
                return ret;
            }
            this.startCellMoveRange.isChanged = true;
            this.cleanSelection();
            this.activeMoveRange = ar;
            this.activeMoveRange.normalize();
            this.activeMoveRange.c1 += colDelta;
            if (0 > this.activeMoveRange.c1) {
                colDelta -= this.activeMoveRange.c1;
                this.activeMoveRange.c1 = 0;
            }
            this.activeMoveRange.c2 += colDelta;
            this.activeMoveRange.r1 += rowDelta;
            if (0 > this.activeMoveRange.r1) {
                rowDelta -= this.activeMoveRange.r1;
                this.activeMoveRange.r1 = 0;
            }
            this.activeMoveRange.r2 += rowDelta;
            while (!this.cols[this.activeMoveRange.c2]) {
                this.expandColsOnScroll(true);
                this._trigger("reinitializeScrollX");
            }
            while (!this.rows[this.activeMoveRange.r2]) {
                this.expandRowsOnScroll(true);
                this._trigger("reinitializeScrollY");
            }
            this._drawSelection();
            var d = {
                deltaX: this.activeMoveRange.c1 < this.visibleRange.c1 ? this.activeMoveRange.c1 - this.visibleRange.c1 : this.activeMoveRange.c2 > this.visibleRange.c2 ? this.activeMoveRange.c2 - this.visibleRange.c2 : 0,
                deltaY: this.activeMoveRange.r1 < this.visibleRange.r1 ? this.activeMoveRange.r1 - this.visibleRange.r1 : this.activeMoveRange.r2 > this.visibleRange.r2 ? this.activeMoveRange.r2 - this.visibleRange.r2 : 0
            };
            while (this._isColDrawnPartially(this.activeMoveRange.c2, this.visibleRange.c1 + d.deltaX)) {
                ++d.deltaX;
            }
            while (this._isRowDrawnPartially(this.activeMoveRange.r2, this.visibleRange.r1 + d.deltaY)) {
                ++d.deltaY;
            }
            this.model.workbook.handlers.trigger("asc_onHideComment");
            return d;
        },
        changeSelectionMoveResizeRangeHandle: function (x, y, targetInfo) {
            if (!targetInfo) {
                return null;
            }
            var indexFormulaRange = targetInfo.indexFormulaRange,
            d, ret;
            x *= asc_getcvt(0, 1, this._getPPIX());
            y *= asc_getcvt(0, 1, this._getPPIY());
            var ar = 0 == targetInfo.targetArr ? this.arrActiveFormulaRanges[indexFormulaRange].clone(true) : this.arrActiveChartsRanges[indexFormulaRange].clone(true);
            var colByX = this._findColUnderCursor(x, false, false).col;
            var rowByY = this._findRowUnderCursor(y, false, false).row;
            if (null === this.startCellMoveResizeRange) {
                if ((targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize)) {
                    this.startCellMoveResizeRange = ar.clone(true);
                    this.startCellMoveResizeRange2 = asc_Range(targetInfo.col, targetInfo.row, targetInfo.col, targetInfo.row, true);
                } else {
                    this.startCellMoveResizeRange = ar.clone(true);
                    if (colByX < ar.c1) {
                        colByX = ar.c1;
                    } else {
                        if (colByX > ar.c2) {
                            colByX = ar.c2;
                        }
                    }
                    if (rowByY < ar.r1) {
                        rowByY = ar.r1;
                    } else {
                        if (rowByY > ar.r2) {
                            rowByY = ar.r2;
                        }
                    }
                    this.startCellMoveResizeRange2 = asc_Range(colByX, rowByY, colByX, rowByY);
                }
                return null;
            }
            this.overlayCtx.clear();
            if (targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize) {
                if (colByX < this.startCellMoveResizeRange2.c1) {
                    ar.c2 = this.startCellMoveResizeRange2.c1;
                    ar.c1 = colByX;
                } else {
                    if (colByX > this.startCellMoveResizeRange2.c1) {
                        ar.c1 = this.startCellMoveResizeRange2.c1;
                        ar.c2 = colByX;
                    } else {
                        ar.c1 = this.startCellMoveResizeRange2.c1;
                        ar.c2 = this.startCellMoveResizeRange2.c1;
                    }
                }
                if (rowByY < this.startCellMoveResizeRange2.r1) {
                    if (this.visibleRange.r2 > ar.r2) {
                        ar.r2 = this.startCellMoveResizeRange2.r2;
                    }
                    ar.r1 = rowByY;
                } else {
                    if (rowByY > this.startCellMoveResizeRange2.r1) {
                        if (this.visibleRange.r1 < ar.r1) {
                            ar.r1 = this.startCellMoveResizeRange2.r1;
                        }
                        if (this.visibleRange.r2 > ar.r2) {
                            ar.r2 = rowByY;
                        }
                    } else {
                        ar.r1 = this.startCellMoveResizeRange2.r1;
                        ar.r2 = this.startCellMoveResizeRange2.r1;
                    }
                }
            } else {
                this.startCellMoveResizeRange.normalize();
                var colDelta = colByX - this.startCellMoveResizeRange2.c1;
                var rowDelta = rowByY - this.startCellMoveResizeRange2.r1;
                ar.c1 = this.startCellMoveResizeRange.c1 + colDelta;
                if (0 > ar.c1) {
                    colDelta -= ar.c1;
                    ar.c1 = 0;
                }
                ar.c2 = this.startCellMoveResizeRange.c2 + colDelta;
                ar.r1 = this.startCellMoveResizeRange.r1 + rowDelta;
                if (0 > ar.r1) {
                    rowDelta -= ar.r1;
                    ar.r1 = 0;
                }
                ar.r2 = this.startCellMoveResizeRange.r2 + rowDelta;
                d = {
                    deltaX: ar.c1 <= this.visibleRange.c1 ? ar.c1 - this.visibleRange.c1 : ar.c2 >= this.visibleRange.c2 ? ar.c2 - this.visibleRange.c2 : 0,
                    deltaY: ar.r1 <= this.visibleRange.r1 ? ar.r1 - this.visibleRange.r1 : ar.r2 >= this.visibleRange.r2 ? ar.r2 - this.visibleRange.r2 : 0
                };
            }
            if (0 == targetInfo.targetArr) {
                var _p = this.arrActiveFormulaRanges[indexFormulaRange].cursorePos,
                _l = this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength,
                _a = this.arrActiveFormulaRanges[indexFormulaRange].isAbsolute;
                this.arrActiveFormulaRanges[indexFormulaRange] = ar.clone(true);
                this.arrActiveFormulaRanges[indexFormulaRange].cursorePos = _p;
                this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength = _l;
                this.arrActiveFormulaRanges[indexFormulaRange].isAbsolute = _a;
                ret = this.arrActiveFormulaRanges[indexFormulaRange];
            } else {
                this.arrActiveChartsRanges[indexFormulaRange] = ar.clone(true);
                this.moveRangeDrawingObjectTo = ar;
            }
            this._drawSelection();
            this.objectRender.raiseLayerDrawingObjects();
            return {
                ar: ret,
                d: d
            };
        },
        applyMoveRangeHandle: function (ctrlKey) {
            var t = this;
            if (null === t.activeMoveRange) {
                t.startCellMoveRange = null;
                return;
            }
            var arnFrom = t.activeRange.clone(true);
            var arnTo = t.activeMoveRange.clone(true);
            var resmove = t.model._prepareMoveRange(arnFrom, arnTo);
            if (resmove == -2) {
                t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.CannotMoveRange, c_oAscError.Level.NoCritical);
                t.activeMoveRange = null;
                t.startCellMoveRange = null;
                t.isChanged = true;
                t._updateCellsRange(new Range(0, 0, arnFrom.c2 > arnTo.c2 ? arnFrom.c2 : arnTo.c2, arnFrom.r2 > arnTo.r2 ? arnFrom.r2 : arnTo.r2), c_oAscCanChangeColWidth.none);
                t.cleanSelection();
                t._drawSelection();
                return false;
            } else {
                if (resmove == -1) {
                    t.model.workbook.handlers.trigger("asc_onConfirmAction", c_oAscConfirm.ConfirmReplaceRange, function (can) {
                        t.moveRangeHandle(arnFrom, arnTo, can, ctrlKey);
                    });
                } else {
                    t.moveRangeHandle(arnFrom, arnTo, true, ctrlKey);
                }
            }
        },
        applyMoveResizeRangeHandle: function (target) {
            if (-1 == target.targetArr) {
                this.objectRender.moveRangeDrawingObject(this.startCellMoveResizeRange, this.moveRangeDrawingObjectTo, true);
            }
            this.startCellMoveResizeRange = null;
            this.startCellMoveResizeRange2 = null;
        },
        moveRangeHandle: function (arnFrom, arnTo, can, copyRange) {
            var t = this;
            var onApplyMoveRangeHandleCallback = function (isSuccess) {
                t.cleanSelection();
                if (true === isSuccess && !arnFrom.isEqual(arnTo) && can) {
                    History.Create_NewPoint();
                    History.SetSelection(arnFrom.clone());
                    History.SetSelectionRedo(arnTo.clone());
                    History.StartTransaction();
                    t.autoFilters._preMoveAutoFilters(arnFrom);
                    t.model._moveRange(arnFrom, arnTo, copyRange);
                    t._updateCellsRange(arnTo);
                    t.cleanSelection();
                    t.activeRange = arnTo.clone(true);
                    t.activeRange.startRow = t.activeRange.r1;
                    t.activeRange.startCol = t.activeRange.c1;
                    t.cellCommentator.moveRangeComments(arnFrom, arnTo);
                    t.objectRender.moveRangeDrawingObject(arnFrom, arnTo, false);
                    t.autoFilters._moveAutoFilters(arnTo, arnFrom);
                    t.autoFilters._renameTableColumn(arnFrom);
                    t.autoFilters._renameTableColumn(arnTo);
                    t.autoFilters.reDrawFilter(arnFrom);
                    History.EndTransaction();
                }
                t.activeMoveRange = null;
                t.startCellMoveRange = null;
                t.isChanged = true;
                t._updateCellsRange(new Range(0, 0, arnFrom.c2 > arnTo.c2 ? arnFrom.c2 : arnTo.c2, arnFrom.r2 > arnTo.r2 ? arnFrom.r2 : arnTo.r2), c_oAscCanChangeColWidth.none);
                t.cleanSelection();
                t._drawSelection();
            };
            this._isLockedCells([arnFrom, arnTo], null, onApplyMoveRangeHandleCallback);
        },
        emptySelection: function (options) {
            if (this.objectRender.selectedGraphicObjectsExists()) {
                this.objectRender.controller.deleteSelectedObjects();
            } else {
                this.setSelectionInfo("empty", options);
            }
        },
        setSelectionInfo: function (prop, val, onlyActive, isLocal) {
            if (this.collaborativeEditing.getGlobalLock()) {
                return;
            }
            var t = this;
            var checkRange = null;
            var arn = t.activeRange.clone(true);
            arn.startCol = t.activeRange.startCol;
            arn.startRow = t.activeRange.startRow;
            arn.type = t.activeRange.type;
            if (onlyActive) {
                checkRange = new asc_Range(arn.startCol, arn.startRow, arn.startCol, arn.startRow);
            } else {
                if (c_oAscSelectionType.RangeMax === arn.type) {
                    checkRange = new asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
                } else {
                    if (c_oAscSelectionType.RangeCol === arn.type) {
                        checkRange = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
                    } else {
                        if (c_oAscSelectionType.RangeRow === arn.type) {
                            checkRange = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
                        } else {
                            checkRange = arn;
                        }
                    }
                }
            }
            var onSelectionCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                var range;
                var canChangeColWidth = c_oAscCanChangeColWidth.none;
                var selectionRange;
                var bIsUpdate = true;
                if (onlyActive) {
                    range = t.model.getRange3(arn.startRow, arn.startCol, arn.startRow, arn.startCol);
                } else {
                    if (c_oAscSelectionType.RangeMax === arn.type) {
                        range = t.model.getRange3(0, 0, gc_nMaxRow0, gc_nMaxCol0);
                    } else {
                        if (c_oAscSelectionType.RangeCol === arn.type) {
                            range = t.model.getRange3(0, arn.c1, gc_nMaxRow0, arn.c2);
                        } else {
                            if (c_oAscSelectionType.RangeRow === arn.type) {
                                range = t.model.getRange3(arn.r1, 0, arn.r2, gc_nMaxCol0);
                            } else {
                                range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
                            }
                        }
                    }
                }
                var isLargeRange = t._isLargeRange(range),
                callTrigger = false;
                var res;
                var mc, r, c, cell;
                function makeBorder(b) {
                    var border = new BorderProp();
                    if (b === false) {
                        border.setStyle(c_oAscBorderStyles.None);
                    } else {
                        if (b) {
                            if (b.style !== null && b.style !== undefined) {
                                border.setStyle(b.style);
                            }
                            if (b.color !== null && b.color !== undefined) {
                                if (b.color instanceof CAscColor) {
                                    border.c = CorrectAscColor(b.color);
                                }
                            }
                        }
                    }
                    return border;
                }
                selectionRange = arn.clone();
                History.Create_NewPoint();
                History.StartTransaction();
                switch (prop) {
                case "fn":
                    range.setFontname(val);
                    canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                    break;
                case "fs":
                    range.setFontsize(val);
                    canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                    break;
                case "b":
                    range.setBold(val);
                    break;
                case "i":
                    range.setItalic(val);
                    break;
                case "u":
                    range.setUnderline(val);
                    break;
                case "s":
                    range.setStrikeout(val);
                    break;
                case "fa":
                    range.setFontAlign(val);
                    break;
                case "a":
                    range.setAlignHorizontal(val);
                    break;
                case "va":
                    range.setAlignVertical(val);
                    break;
                case "c":
                    range.setFontcolor(val);
                    break;
                case "bc":
                    range.setFill((val) ? (val) : null);
                    break;
                case "wrap":
                    range.setWrap(val);
                    break;
                case "shrink":
                    range.setShrinkToFit(val);
                    break;
                case "value":
                    range.setValue(val);
                    break;
                case "format":
                    range.setNumFormat(val);
                    canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                    break;
                case "angle":
                    range.setAngle(val);
                    break;
                case "border":
                    if (isLargeRange) {
                        callTrigger = true;
                        t._trigger("slowOperation", true);
                    }
                    if (val.length < 1) {
                        range.setBorder(null);
                        break;
                    }
                    res = new Border();
                    res.d = makeBorder(val[c_oAscBorderOptions.DiagD] || val[c_oAscBorderOptions.DiagU]);
                    res.dd = val[c_oAscBorderOptions.DiagD] ? true : false;
                    res.du = val[c_oAscBorderOptions.DiagU] ? true : false;
                    res.l = makeBorder(val[c_oAscBorderOptions.Left]);
                    res.iv = makeBorder(val[c_oAscBorderOptions.InnerV]);
                    res.r = makeBorder(val[c_oAscBorderOptions.Right]);
                    res.t = makeBorder(val[c_oAscBorderOptions.Top]);
                    res.ih = makeBorder(val[c_oAscBorderOptions.InnerH]);
                    res.b = makeBorder(val[c_oAscBorderOptions.Bottom]);
                    range.setBorder(res);
                    break;
                case "merge":
                    if (isLargeRange) {
                        callTrigger = true;
                        t._trigger("slowOperation", true);
                    }
                    switch (val) {
                    case c_oAscMergeOptions.Unmerge:
                        range.unmerge();
                        break;
                    case c_oAscMergeOptions.MergeCenter:
                        range.merge(val);
                        break;
                    case c_oAscMergeOptions.MergeAcross:
                        for (res = arn.r1; res <= arn.r2; ++res) {
                            t.model.getRange3(res, arn.c1, res, arn.c2).merge(val);
                        }
                        break;
                    case c_oAscMergeOptions.Merge:
                        range.merge(val);
                        break;
                    }
                    arn.c1 = 0;
                    arn.c2 = gc_nMaxCol0;
                    break;
                case "sort":
                    if (isLargeRange) {
                        callTrigger = true;
                        t._trigger("slowOperation", true);
                    }
                    var changes = range.sort(val, arn.startCol);
                    t.cellCommentator.sortComments(arn, changes);
                    break;
                case "empty":
                    if (isLargeRange) {
                        callTrigger = true;
                        t._trigger("slowOperation", true);
                    }
                    lockDraw(t.model.workbook);
                    if (val === c_oAscCleanOptions.All) {
                        range.cleanAll();
                    }
                    if (val & c_oAscCleanOptions.Text || val & c_oAscCleanOptions.Formula) {
                        range.cleanText();
                    }
                    if (val & c_oAscCleanOptions.Format) {
                        range.cleanFormat();
                    }
                    t.autoFilters.isEmptyAutoFilters(arn);
                    t.autoFilters._renameTableColumn(arn);
                    t.cellCommentator.deleteCommentsRange(arn);
                    buildRecalc(t.model.workbook);
                    unLockDraw(t.model.workbook);
                    arn.c1 = t.visibleRange.c1;
                    arn.c2 = t.visibleRange.c2;
                    break;
                case "changeDigNum":
                    res = t.cols.slice(arn.c1, arn.c2 + 1).reduce(function (r, c) {
                        r.push(c.charCount);
                        return r;
                    },
                    []);
                    range.shiftNumFormat(val, res);
                    canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                    break;
                case "changeFontSize":
                    mc = t.model.getMergedByCell(arn.startRow, arn.startCol);
                    c = mc ? mc.c1 : arn.startCol;
                    r = mc ? mc.r1 : arn.startRow;
                    cell = t._getVisibleCell(c, r);
                    if (undefined !== cell) {
                        var oldFontSize = cell.getFontsize();
                        var newFontSize = asc_incDecFonSize(val, oldFontSize);
                        if (null !== newFontSize) {
                            range.setFontsize(newFontSize);
                            canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                        }
                    }
                    break;
                case "style":
                    range.setCellStyle(val);
                    canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                    break;
                    break;
                case "paste":
                    var pasteLocal = function () {
                        if (isLargeRange) {
                            callTrigger = true;
                            t._trigger("slowOperation", true);
                        }
                        var selectData;
                        if (isLocal) {
                            selectData = t._pasteFromLS(val);
                        } else {
                            selectData = t._setInfoAfterPaste(val, onlyActive);
                        }
                        if (!selectData) {
                            bIsUpdate = false;
                            History.EndTransaction();
                            return;
                        }
                        t.expandColsOnScroll();
                        t.expandRowsOnScroll();
                        var arrFormula = selectData[1];
                        lockDraw(t.model.workbook);
                        for (var i = 0; i < arrFormula.length; ++i) {
                            var rangeF = arrFormula[i].range;
                            var valF = arrFormula[i].val;
                            if (rangeF.isOneCell()) {
                                rangeF.setValue(valF);
                            } else {
                                var oBBox = rangeF.getBBox0();
                                t.model._getCell(oBBox.r1, oBBox.c1).setValue(valF);
                            }
                        }
                        buildRecalc(t.model.workbook);
                        unLockDraw(t.model.workbook);
                        arn = selectData[0];
                        selectionRange = arn.clone(true);
                        if (isLocal && val.lStorage && val.lStorage.autoFilters && val.lStorage.autoFilters.length) {
                            var aFilters = val.lStorage.autoFilters;
                            var range;
                            for (var aF = 0; aF < aFilters.length; aF++) {
                                range = t.model.getRange3(aFilters[aF].range.r1 + selectionRange.r1, aFilters[aF].range.c1 + selectionRange.c1, aFilters[aF].range.r2 + selectionRange.r1, aFilters[aF].range.c2 + selectionRange.c1);
                                if (aFilters[aF].style) {
                                    range.cleanFormat();
                                }
                                t.autoFilters.addAutoFilter(aFilters[aF].style, range.bbox, null, null, true);
                                if (!aFilters[aF].autoFilter) {
                                    t.autoFilters.addAutoFilter(null, range.bbox, null, null, true);
                                }
                            }
                        }
                        arn.c1 = 0;
                        arn.c2 = gc_nMaxCol0;
                        if (bIsUpdate) {
                            if (callTrigger) {
                                t._trigger("slowOperation", false);
                            }
                            t.isChanged = true;
                            t._updateCellsRange(arn, canChangeColWidth);
                            t._prepareCellTextMetricsCache(arn);
                        }
                        History.EndTransaction();
                        History.SetSelection(selectionRange);
                    };
                    var pasteNoLocal = function () {
                        t._loadFonts(val.fontsNew, function () {
                            pasteLocal();
                            var a_drawings = [];
                            if (val.addImages && val.addImages.length != 0) {
                                var api = asc["editor"];
                                var aImagesSync = [];
                                for (var im = 0; im < val.addImages.length; im++) {
                                    aImagesSync.push(val.addImages[im].tag.src);
                                }
                                t.objectRender.asyncImagesDocumentEndLoaded = function () {
                                    for (var im = 0; im < val.addImages.length; im++) {
                                        var src = val.addImages[im].tag.src;
                                        var binary_shape = val.addImages[im].tag.getAttribute("alt");
                                        var sub;
                                        if (typeof binary_shape === "string") {
                                            sub = binary_shape.substr(0, 18);
                                        }
                                        if (typeof binary_shape === "string" && (sub === "TeamLabShapeSheets" || sub === "TeamLabImageSheets" || sub === "TeamLabChartSheets" || sub === "TeamLabGroupSheets")) {
                                            var reader = CreateBinaryReader(binary_shape, 18, binary_shape.length);
                                            reader.GetLong();
                                            if (isRealObject(reader)) {
                                                reader.oImages = this.oImages;
                                            }
                                            var first_string = null;
                                            if (reader !== null && typeof reader === "object") {
                                                first_string = sub;
                                            }
                                            var positionX = null;
                                            var positionY = null;
                                            if (t.cols && val.addImages[im].curCell && val.addImages[im].curCell.col != undefined && t.cols[val.addImages[im].curCell.col].left != undefined) {
                                                positionX = t.cols[val.addImages[im].curCell.col].left - t.getCellLeft(0, 1);
                                            }
                                            if (t.rows && val.addImages[im].curCell && val.addImages[im].curCell.row != undefined && t.rows[val.addImages[im].curCell.row].top != undefined) {
                                                positionY = t.rows[val.addImages[im].curCell.row].top - t.getCellTop(0, 1);
                                            }
                                            var Drawing;
                                            switch (first_string) {
                                            case "TeamLabImageSheets":
                                                Drawing = new CImageShape(null, t.objectRender);
                                                break;
                                            case "TeamLabShapeSheets":
                                                Drawing = new CShape(null, t.objectRender);
                                                break;
                                            case "TeamLabGroupSheets":
                                                Drawing = new CGroupShape(null, t.objectRender);
                                                break;
                                            case "TeamLabChartSheets":
                                                Drawing = new CChartAsGroup(null, t.objectRender);
                                                break;
                                            default:
                                                Drawing = CreateImageFromBinary(src);
                                                break;
                                            }
                                            if (positionX && positionY && t.objectRender) {
                                                Drawing.readFromBinaryForCopyPaste(reader, null, t.objectRender, t.objectRender.convertMetric(positionX, 1, 3), t.objectRender.convertMetric(positionY, 1, 3));
                                            } else {
                                                Drawing.readFromBinaryForCopyPaste(reader, null, t.objectRender);
                                            }
                                            Drawing.drawingObjects = t.objectRender;
                                            a_drawings.push(Drawing);
                                        } else {
                                            if (src && 0 != src.indexOf("file://")) {
                                                var drawing = CreateImageDrawingObject(src, {
                                                    cell: val.addImages[im].curCell,
                                                    width: val.addImages[im].tag.width,
                                                    height: val.addImages[im].tag.height
                                                },
                                                t.objectRender);
                                                if (drawing && drawing.graphicObject) {
                                                    a_drawings.push(drawing.graphicObject);
                                                }
                                            }
                                        }
                                    }
                                    t.objectRender.objectLocker.reset();
                                    function callbackUngroupedObjects(result) {
                                        if (result) {
                                            for (var j = 0; j < a_drawings.length; ++j) {
                                                a_drawings[j].recalculateTransform();
                                                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(a_drawings[j].Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                                                a_drawings[j].addToDrawingObjects();
                                                a_drawings[j].select(t.objectRender.controller);
                                            }
                                        }
                                    }
                                    for (var j = 0; j < a_drawings.length; ++j) {
                                        t.objectRender.objectLocker.addObjectId(a_drawings[j].Get_Id());
                                    }
                                    t.objectRender.objectLocker.checkObjects(callbackUngroupedObjects);
                                };
                                api.ImageLoader.LoadDocumentImages(aImagesSync);
                            }
                        });
                    };
                    isLocal ? pasteLocal() : pasteNoLocal();
                    return;
                case "hyperlink":
                    if (val && val.hyperlinkModel) {
                        if (c_oAscHyperlinkType.RangeLink === val.asc_getType()) {
                            var hyperlinkRangeTmp = t.model.getRange2(val.asc_getRange());
                            if (null === hyperlinkRangeTmp) {
                                bIsUpdate = false;
                                break;
                            }
                        }
                        val.hyperlinkModel.Ref = range;
                        range.setHyperlink(val.hyperlinkModel);
                        mc = t.model.getMergedByCell(arn.startRow, arn.startCol);
                        c = mc ? mc.c1 : arn.startCol;
                        r = mc ? mc.r1 : arn.startRow;
                        if (null !== val.asc_getText()) {
                            t.model.getRange3(r, c, r, c).setValue(val.asc_getText());
                            t.autoFilters._renameTableColumn(arn);
                        }
                        break;
                    } else {
                        bIsUpdate = false;
                        break;
                    }
                default:
                    bIsUpdate = false;
                    break;
                }
                if (bIsUpdate) {
                    if (callTrigger) {
                        t._trigger("slowOperation", false);
                    }
                    t.isChanged = true;
                    t._updateCellsRange(arn, canChangeColWidth);
                }
                History.EndTransaction();
                History.SetSelection(selectionRange);
            };
            if ("paste" === prop && val.onlyImages !== true) {
                if (isLocal) {
                    checkRange = t._pasteFromLS(val, true);
                } else {
                    checkRange = t._setInfoAfterPaste(val, onlyActive, true);
                }
            }
            if ("paste" === prop && val.onlyImages === true) {
                onSelectionCallback();
            } else {
                this._isLockedCells(checkRange, null, onSelectionCallback);
            }
        },
        _setInfoAfterPaste: function (values, clipboard, isCheckSelection) {
            var t = this;
            var arn = t.activeRange.clone(true);
            var arrFormula = [];
            var numFor = 0;
            var rMax = values.length + values.rowSpanSpCount;
            if (values.rowCount && values.rowCount !== 0 && values.isOneTable) {
                rMax = values.rowCount + arn.r1;
            }
            var cMax = values.cellCount + arn.c1;
            var isMultiple = false;
            var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
            var isMergedFirstCell = firstCell.hasMerged();
            var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
            var isOneMerge = false;
            if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1 && isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 && cMax - arn.c1 === values[arn.r1][arn.c1][0].colSpan && rMax - arn.r1 === values[arn.r1][arn.c1][0].rowSpan) {
                if (!isCheckSelection) {
                    values[arn.r1][arn.c1][0].colSpan = isMergedFirstCell.c2 - isMergedFirstCell.c1 + 1;
                    values[arn.r1][arn.c1][0].rowSpan = isMergedFirstCell.r2 - isMergedFirstCell.r1 + 1;
                }
                isOneMerge = true;
            } else {
                if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1 && values.isOneTable) {
                    var widthArea = arn.c2 - arn.c1 + 1;
                    var heightArea = arn.r2 - arn.r1 + 1;
                    var widthPasteFr = cMax - arn.c1;
                    var heightPasteFr = rMax - arn.r1;
                    if (widthArea % widthPasteFr === 0 && heightArea % heightPasteFr === 0) {
                        isMultiple = true;
                    } else {
                        if (firstCell.hasMerged() !== null) {
                            if (isCheckSelection) {
                                return arn;
                            } else {
                                this._trigger("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
                                return;
                            }
                        }
                    }
                } else {
                    for (var rFirst = arn.r1; rFirst < rMax; ++rFirst) {
                        for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
                            range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
                            var merged = range.hasMerged();
                            if (merged) {
                                if (merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax - 1) {
                                    if (isCheckSelection) {
                                        return arn;
                                    } else {
                                        this._trigger("onErrorEvent", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var rMax2 = rMax;
            var cMax2 = cMax;
            var rMax = values.length;
            var trueArn = t.activeRange;
            if (isCheckSelection) {
                var newArr = arn.clone(true);
                newArr.r2 = rMax2 - 1;
                newArr.c2 = cMax2 - 1;
                if (isMultiple || isOneMerge) {
                    newArr.r2 = trueArn.r2;
                    newArr.c2 = trueArn.c2;
                }
                return newArr;
            }
            rangeUnMerge.unmerge();
            if (!isOneMerge) {
                arn.r2 = (rMax2 - 1 > 0) ? (rMax2 - 1) : 0;
                arn.c2 = (cMax2 - 1 > 0) ? (cMax2 - 1) : 0;
            }
            var mergeArr = [];
            var n = 0;
            if (isMultiple) {
                t.model.getRange3(trueArn.r1, trueArn.c1, trueArn.r2, trueArn.c2).unmerge();
                var maxARow = heightArea / heightPasteFr;
                var maxACol = widthArea / widthPasteFr;
                var plRow = (rMax2 - arn.r1);
                var plCol = (arn.c2 - arn.c1) + 1;
            } else {
                var maxARow = 1;
                var maxACol = 1;
                var plRow = 0;
                var plCol = 0;
            }
            if (isMultiple) {
                var currentObj = values[arn.r1][arn.c1][0];
                var valFormat = "";
                if (currentObj[0] !== undefined) {
                    valFormat = currentObj[0].text;
                }
                if (currentObj.format !== null && currentObj.format !== "" && currentObj.format !== undefined) {
                    var nameFormat = clipboard._decode(currentObj.format.split(";")[0]);
                    valFormat = clipboard._decode(currentObj.format.split(";")[1]);
                }
            }
            for (var autoR = 0; autoR < maxARow; ++autoR) {
                for (var autoC = 0; autoC < maxACol; ++autoC) {
                    for (var r = arn.r1; r < rMax; ++r) {
                        for (var c = arn.c1; c < values[r].length; ++c) {
                            if (undefined !== values[r][c]) {
                                var range = t.model.getRange3(r + autoR * plRow, c + autoC * plCol, r + autoR * plRow, c + autoC * plCol);
                                var currentObj = values[r][c][0];
                                if (currentObj.length === 1) {
                                    var valFormat = currentObj[0].text;
                                    var nameFormat = false;
                                    if (currentObj.format !== null && currentObj.format !== "" && currentObj.format !== undefined) {
                                        nameFormat = clipboard._decode(currentObj.format.split(";")[0]);
                                        valFormat = clipboard._decode(currentObj.format.split(";")[1]);
                                    }
                                    if (currentObj[0].cellFrom) {
                                        var offset = range.getCells()[0].getOffset2(currentObj[0].cellFrom),
                                        assemb,
                                        _p_ = new parserFormula(currentObj[0].text.substring(1), "", range.worksheet);
                                        if (_p_.parse()) {
                                            assemb = _p_.changeOffset(offset).assemble();
                                            arrFormula[numFor] = {};
                                            arrFormula[numFor].range = range;
                                            arrFormula[numFor].val = "=" + assemb;
                                            numFor++;
                                            delete _p_;
                                        } else {
                                            delete _p_;
                                        }
                                    } else {
                                        range.setValue(valFormat);
                                    }
                                    if (nameFormat) {
                                        range.setNumFormat(nameFormat);
                                    }
                                    range.setBold(currentObj[0].format.b);
                                    range.setItalic(currentObj[0].format.i);
                                    range.setStrikeout(currentObj[0].format.s);
                                    if (!isOneMerge && currentObj[0].format && currentObj[0].format.c != null && currentObj[0].format.c != undefined && asc_parsecolor(currentObj[0].format.c) != null) {
                                        range.setFontcolor(new RgbColor(asc_parsecolor(currentObj[0].format.c).binary));
                                    }
                                    range.setUnderline(currentObj[0].format.u);
                                    range.setAlignVertical(currentObj.va);
                                    range.setFontname(currentObj[0].format.fn);
                                    range.setFontsize(currentObj[0].format.fs);
                                } else {
                                    range.setValue2(currentObj);
                                    range.setAlignVertical(currentObj.va);
                                }
                                if (currentObj.length === 1 && currentObj[0].format.fs !== "" && currentObj[0].format.fs !== null && currentObj[0].format.fs !== undefined) {
                                    range.setFontsize(currentObj[0].format.fs);
                                }
                                if (!isOneMerge) {
                                    range.setAlignHorizontal(currentObj.a);
                                }
                                var isMerged = false;
                                for (var mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck) {
                                    if (r + 1 + autoR * plRow <= mergeArr[mergeCheck].r2 && r + 1 + autoR * plRow >= mergeArr[mergeCheck].r1 && c + autoC * plCol + 1 <= mergeArr[mergeCheck].c2 && c + 1 + autoC * plCol >= mergeArr[mergeCheck].c1) {
                                        isMerged = true;
                                    }
                                }
                                if ((currentObj.colSpan > 1 || currentObj.rowSpan > 1) && !isMerged) {
                                    range.setOffsetLast({
                                        offsetCol: currentObj.colSpan - 1,
                                        offsetRow: currentObj.rowSpan - 1
                                    });
                                    mergeArr[n] = {
                                        r1: range.first.row,
                                        r2: range.last.row,
                                        c1: range.first.col,
                                        c2: range.last.col
                                    };
                                    n++;
                                    if (currentObj[0] == undefined) {
                                        range.setValue("");
                                    }
                                    range.merge(c_oAscMergeOptions.Merge);
                                }
                                if (!isOneMerge) {
                                    range.setBorderSrc(currentObj.borders);
                                }
                                range.setWrap(currentObj.wrap);
                                if (currentObj.bc && currentObj.bc != "rgba(0, 0, 0, 0)" && currentObj.bc != "transparent" && "" != currentObj.bc && !isOneMerge) {
                                    range.setFill(new RgbColor(asc_parsecolor(currentObj.bc).binary));
                                }
                                var link = values[r][c][0].hyperLink;
                                if (link) {
                                    var newHyperlink = new Hyperlink();
                                    if (values[r][c][0].hyperLink.search("#") === 0) {
                                        newHyperlink.setLocation(link.replace("#", ""));
                                    } else {
                                        newHyperlink.Hyperlink = link;
                                    }
                                    newHyperlink.Ref = range;
                                    newHyperlink.Tooltip = values[r][c][0].toolTip;
                                    range.setHyperlink(newHyperlink);
                                }
                            }
                        }
                    }
                }
            }
            if (isMultiple) {
                arn.r2 = trueArn.r2;
                arn.c2 = trueArn.c2;
            }
            t.isChanged = true;
            t.activeRange.c2 = arn.c2;
            t.activeRange.r2 = arn.r2;
            var arnFor = [];
            arnFor[0] = arn;
            arnFor[1] = arrFormula;
            return arnFor;
        },
        _pasteFromLS: function (val, isCheckSelection) {
            var t = this;
            var arn = t.activeRange.clone(true);
            var arrFormula = [];
            var numFor = 0;
            var rMax = val.lStorage.length + arn.r1;
            var cMax = val.lStorage[0].length + arn.c1;
            var values = val.lStorage;
            var isMultiple = false;
            var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
            var isMergedFirstCell = firstCell.hasMerged();
            var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
            var isOneMerge = false;
            var firstValuesCol;
            var firstValuesRow;
            if (values[0][0].merge != null) {
                firstValuesCol = values[0][0].merge.c2 - values[0][0].merge.c1;
                firstValuesRow = values[0][0].merge.r2 - values[0][0].merge.r1;
            } else {
                firstValuesCol = 0;
                firstValuesRow = 0;
            }
            if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1 && isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 && cMax - arn.c1 === (firstValuesCol + 1) && rMax - arn.r1 === (firstValuesRow + 1)) {
                if (!isCheckSelection) {}
                isOneMerge = true;
            } else {
                if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1) {
                    var widthArea = arn.c2 - arn.c1 + 1;
                    var heightArea = arn.r2 - arn.r1 + 1;
                    var widthPasteFr = cMax - arn.c1;
                    var heightPasteFr = rMax - arn.r1;
                    if (widthArea % widthPasteFr === 0 && heightArea % heightPasteFr === 0) {
                        isMultiple = true;
                    } else {
                        if (firstCell.hasMerged() !== null) {
                            if (isCheckSelection) {
                                return arn;
                            } else {
                                this._trigger("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
                                return;
                            }
                        }
                    }
                } else {
                    for (var rFirst = arn.r1; rFirst < rMax; ++rFirst) {
                        for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
                            range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
                            var merged = range.hasMerged();
                            if (merged) {
                                if (merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax - 1) {
                                    if (isCheckSelection) {
                                        return arn;
                                    } else {
                                        this._trigger("onErrorEvent", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var rMax2 = rMax;
            var cMax2 = cMax;
            var trueArn = t.activeRange;
            if (isCheckSelection) {
                var newArr = arn.clone(true);
                newArr.r2 = rMax2 - 1;
                newArr.c2 = cMax2 - 1;
                if (isMultiple || isOneMerge) {
                    newArr.r2 = trueArn.r2;
                    newArr.c2 = trueArn.c2;
                }
                return newArr;
            }
            rangeUnMerge.unmerge();
            if (!isOneMerge) {
                arn.r2 = rMax2 - 1;
                arn.c2 = cMax2 - 1;
            }
            var mergeArr = [];
            var n = 0;
            if (isMultiple) {
                t.model.getRange3(trueArn.r1, trueArn.c1, trueArn.r2, trueArn.c2).unmerge();
                var maxARow = heightArea / heightPasteFr;
                var maxACol = widthArea / widthPasteFr;
                var plRow = (rMax2 - arn.r1);
                var plCol = (arn.c2 - arn.c1) + 1;
            } else {
                var maxARow = 1;
                var maxACol = 1;
                var plRow = 0;
                var plCol = 0;
            }
            for (var autoR = 0; autoR < maxARow; ++autoR) {
                for (var autoC = 0; autoC < maxACol; ++autoC) {
                    for (var r = arn.r1; r < rMax; ++r) {
                        for (var c = arn.c1; c < cMax; ++c) {
                            var newVal = values[r - arn.r1][c - arn.c1];
                            if (undefined !== newVal) {
                                var isMerged = false;
                                var range = t.model.getRange3(r + autoR * plRow, c + autoC * plCol, r + autoR * plRow, c + autoC * plCol);
                                if (!isOneMerge) {
                                    for (mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck) {
                                        if (r + autoR * plRow <= mergeArr[mergeCheck].r2 && r + autoR * plRow >= mergeArr[mergeCheck].r1 && c + autoC * plCol <= mergeArr[mergeCheck].c2 && c + autoC * plCol >= mergeArr[mergeCheck].c1) {
                                            isMerged = true;
                                        }
                                    }
                                    if (newVal.merge != null && !isMerged) {
                                        range.setOffsetLast({
                                            offsetCol: (newVal.merge.c2 - newVal.merge.c1),
                                            offsetRow: (newVal.merge.r2 - newVal.merge.r1)
                                        });
                                        range.merge(c_oAscMergeOptions.Merge);
                                        mergeArr[n] = {
                                            r1: newVal.merge.r1 + arn.r1 - values.fromRow + autoR * plRow,
                                            r2: newVal.merge.r2 + arn.r1 - values.fromRow + autoR * plRow,
                                            c1: newVal.merge.c1 + arn.c1 - values.fromCol + autoC * plCol,
                                            c2: newVal.merge.c2 + arn.c1 - values.fromCol + autoC * plCol
                                        };
                                        n++;
                                    }
                                } else {
                                    for (mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck) {
                                        if (r + autoR * plRow <= mergeArr[mergeCheck].r2 && r + autoR * plRow >= mergeArr[mergeCheck].r1 && c + autoC * plCol <= mergeArr[mergeCheck].c2 && c + autoC * plCol >= mergeArr[mergeCheck].c1) {
                                            isMerged = true;
                                        }
                                    }
                                    if (!isMerged) {
                                        range.setOffsetLast({
                                            offsetCol: (isMergedFirstCell.c2 - isMergedFirstCell.c1),
                                            offsetRow: (isMergedFirstCell.r2 - isMergedFirstCell.r1)
                                        });
                                        range.merge(c_oAscMergeOptions.Merge);
                                        mergeArr[n] = {
                                            r1: isMergedFirstCell.r1,
                                            r2: isMergedFirstCell.r2,
                                            c1: isMergedFirstCell.c1,
                                            c2: isMergedFirstCell.c2
                                        };
                                        n++;
                                    }
                                }
                                var numFormula = null;
                                var skipFormat = null;
                                var noSkipVal = null;
                                for (var nF = 0; nF < newVal.value2.length; nF++) {
                                    if (newVal.value2[nF] && newVal.value2[nF].sId) {
                                        numFormula = nF;
                                        break;
                                    } else {
                                        if (newVal.value2[nF] && newVal.value2[nF].format && newVal.value2[nF].format.skip) {
                                            skipFormat = true;
                                        } else {
                                            if (newVal.value2[nF] && newVal.value2[nF].format && !newVal.value2[nF].format.skip) {
                                                noSkipVal = nF;
                                            }
                                        }
                                    }
                                }
                                if (newVal.value2.length == 1 || numFormula != null || (skipFormat != null && noSkipVal != null)) {
                                    if (numFormula == null) {
                                        numFormula = 0;
                                    }
                                    var numStyle = 0;
                                    if (skipFormat != null && noSkipVal != null) {
                                        numStyle = noSkipVal;
                                    }
                                    if (newVal.value2[numFormula].sId) {
                                        var offset = range.getCells()[numFormula].getOffset2(newVal.value2[numFormula].sId),
                                        assemb,
                                        _p_ = new parserFormula(newVal.value2[numFormula].sFormula, "", range.worksheet);
                                        if (_p_.parse()) {
                                            assemb = _p_.changeOffset(offset).assemble();
                                            arrFormula[numFor] = {};
                                            arrFormula[numFor].range = range;
                                            arrFormula[numFor].val = "=" + assemb;
                                            numFor++;
                                            delete _p_;
                                        } else {
                                            delete _p_;
                                        }
                                    } else {
                                        if (newVal.valWithoutFormat) {
                                            range.setValue(newVal.valWithoutFormat);
                                        } else {
                                            range.setValue(newVal.value2[numStyle].text);
                                        }
                                    }
                                    range.setBold(newVal.value2[numStyle].format.b);
                                    range.setItalic(newVal.value2[numStyle].format.i);
                                    range.setStrikeout(newVal.value2[numStyle].format.s);
                                    if (!isOneMerge && newVal.value2[numStyle].format && newVal.value2[numStyle].format.c != null && newVal.value2[numStyle].format.c != undefined) {
                                        range.setFontcolor(new RgbColor(asc_parsecolor(newVal.value2[numStyle].format.c).binary));
                                    }
                                    range.setUnderline(newVal.value2[numStyle].format.u);
                                    range.setFontname(newVal.value2[numStyle].format.fn);
                                    range.setFontsize(newVal.value2[numStyle].format.fs);
                                } else {
                                    range.setValue2(newVal.value2);
                                }
                                range.setAlignVertical(newVal.verAlign);
                                if (!isOneMerge) {
                                    range.setAlignHorizontal(newVal.horAlign);
                                }
                                if (!isOneMerge) {
                                    range.setBorderSrc(newVal.borders);
                                }
                                var nameFormat;
                                if (newVal.format && newVal.format.sFormat) {
                                    nameFormat = newVal.format.sFormat;
                                }
                                if (nameFormat) {
                                    range.setNumFormat(nameFormat);
                                }
                                range.setFill(newVal.fill);
                                range.setWrap(newVal.wrap);
                                if (newVal.angle) {
                                    range.setAngle(newVal.angle);
                                }
                                if (newVal.hyperlink != null) {
                                    newVal.hyperlink.Ref = range;
                                    range.setHyperlink(newVal.hyperlink);
                                }
                            }
                        }
                    }
                }
            }
            if (isMultiple) {
                arn.r2 = trueArn.r2;
                arn.c2 = trueArn.c2;
            }
            t.isChanged = true;
            t.activeRange.c2 = arn.c2;
            t.activeRange.r2 = arn.r2;
            var arnFor = [];
            arnFor[0] = arn;
            arnFor[1] = arrFormula;
            return arnFor;
        },
        _isLockedAll: function (callback) {
            if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
                if ($.isFunction(callback)) {
                    callback(true);
                }
                return;
            }
            var sheetId = this.model.getId();
            var subType = c_oAscLockTypeElemSubType.ChangeProperties;
            var ar = this.activeRange;
            var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, subType, sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));
            if (false === this.collaborativeEditing.getCollaborativeEditing()) {
                if ($.isFunction(callback)) {
                    callback(true);
                }
                callback = undefined;
            }
            if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, true)) {
                if ($.isFunction(callback)) {
                    callback(true);
                }
                return;
            } else {
                if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, true)) {
                    if ($.isFunction(callback)) {
                        callback(false);
                    }
                    return;
                }
            }
            this.collaborativeEditing.onStartCheckLock();
            this.collaborativeEditing.addCheckLock(lockInfo);
            this.collaborativeEditing.onEndCheckLock(callback);
        },
        _recalcRangeByInsertRowsAndColumns: function (sheetId, ar) {
            var isIntersection = false,
            isIntersectionC1 = true,
            isIntersectionC2 = true,
            isIntersectionR1 = true,
            isIntersectionR2 = true;
            do {
                if (isIntersectionC1 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c1)) {
                    ar.c1 += 1;
                } else {
                    isIntersectionC1 = false;
                }
                if (isIntersectionR1 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r1)) {
                    ar.r1 += 1;
                } else {
                    isIntersectionR1 = false;
                }
                if (isIntersectionC2 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c2)) {
                    ar.c2 -= 1;
                } else {
                    isIntersectionC2 = false;
                }
                if (isIntersectionR2 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r2)) {
                    ar.r2 -= 1;
                } else {
                    isIntersectionR2 = false;
                }
                if (ar.c1 > ar.c2 || ar.r1 > ar.r2) {
                    isIntersection = true;
                    break;
                }
            } while (isIntersectionC1 || isIntersectionC2 || isIntersectionR1 || isIntersectionR2);
            if (false === isIntersection) {
                ar.c1 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c1);
                ar.c2 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c2);
                ar.r1 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r1);
                ar.r2 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r2);
            }
            return isIntersection;
        },
        _isLockedCells: function (range, subType, callback) {
            if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
                if ($.isFunction(callback)) {
                    callback(true);
                }
                return true;
            }
            var sheetId = this.model.getId();
            var isIntersection = false;
            var newCallback = callback;
            var t = this;
            this.collaborativeEditing.onStartCheckLock();
            var nLength = ("array" === asc_typeof(range)) ? range.length : 1;
            var nIndex = 0;
            var ar = null;
            for (; nIndex < nLength; ++nIndex) {
                ar = ("array" === asc_typeof(range)) ? range[nIndex].clone(true) : range.clone(true);
                if (c_oAscLockTypeElemSubType.InsertColumns !== subType && c_oAscLockTypeElemSubType.InsertRows !== subType) {
                    isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
                }
                if (false === isIntersection) {
                    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, subType, sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));
                    if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                        if ($.isFunction(callback)) {
                            callback(false);
                        }
                        return false;
                    } else {
                        if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
                            newCallback = function (isSuccess) {
                                if (isSuccess) {
                                    t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                                    t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                                }
                                callback(isSuccess);
                            };
                        } else {
                            if (c_oAscLockTypeElemSubType.InsertRows === subType) {
                                newCallback = function (isSuccess) {
                                    if (isSuccess) {
                                        t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                                        t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                                    }
                                    callback(isSuccess);
                                };
                            } else {
                                if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
                                    newCallback = function (isSuccess) {
                                        if (isSuccess) {
                                            t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                                            t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                                        }
                                        callback(isSuccess);
                                    };
                                } else {
                                    if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
                                        newCallback = function (isSuccess) {
                                            if (isSuccess) {
                                                t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                                                t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                                            }
                                            callback(isSuccess);
                                        };
                                    }
                                }
                            }
                        }
                        this.collaborativeEditing.addCheckLock(lockInfo);
                    }
                } else {
                    if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
                        t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                        t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                    } else {
                        if (c_oAscLockTypeElemSubType.InsertRows === subType) {
                            t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                            t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                        } else {
                            if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
                                t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                            } else {
                                if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
                                    t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                                    t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                                }
                            }
                        }
                    }
                }
            }
            if (false === this.collaborativeEditing.getCollaborativeEditing()) {
                newCallback(true);
                newCallback = undefined;
            }
            this.collaborativeEditing.onEndCheckLock(newCallback);
            return true;
        },
        changeWorksheet: function (prop, val) {
            if (this.collaborativeEditing.getGlobalLock()) {
                return;
            }
            var t = this;
            var arn = t.activeRange.clone(true);
            var range;
            var fullRecalc = undefined;
            var pad, cw;
            var isUpdateCols = false,
            isUpdateRows = false;
            var cleanCacheCols = false,
            cleanCacheRows = false;
            var _updateRangeIns, _updateRangeDel, bUndoRedo;
            var functionModelAction = null;
            var lockDraw = false;
            var onChangeWorksheetCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                if ($.isFunction(functionModelAction)) {
                    functionModelAction();
                }
                t._initCellsArea(fullRecalc);
                if (fullRecalc) {
                    t.cache.reset();
                } else {
                    if (cleanCacheCols) {
                        t._cleanCache(asc_Range(arn.c1, 0, arn.c2, t.rows.length - 1));
                    }
                    if (cleanCacheRows) {
                        t._cleanCache(asc_Range(0, arn.r1, t.cols.length - 1, arn.r2));
                    }
                }
                t._cleanCellsTextMetricsCache();
                t._prepareCellTextMetricsCache(t.visibleRange);
                t.objectRender.setScrollOffset();
                t.draw();
                t._trigger("reinitializeScroll");
                if (isUpdateCols) {
                    t._updateVisibleColsCount();
                }
                if (isUpdateRows) {
                    t._updateVisibleRowsCount();
                }
                t.objectRender.rebuildChartGraphicObjects();
                t.objectRender.showDrawingObjects(true);
            };
            switch (prop) {
            case "colWidth":
                functionModelAction = function () {
                    pad = t.width_padding * 2 + t.width_1px;
                    cw = t._charCountToModelColWidth(val, true);
                    t.model.setColWidth(cw, arn.c1, arn.c2);
                    isUpdateCols = true;
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "insColBefore":
                functionModelAction = function () {
                    fullRecalc = true;
                    t.autoFilters.insertColumn(prop, val, arn);
                    t.model.insertColsBefore(arn.c1, val);
                };
                return this._isLockedCells(new asc_Range(arn.c1, 0, arn.c1 + val - 1, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
            case "insColAfter":
                functionModelAction = function () {
                    fullRecalc = true;
                    t.autoFilters.insertColumn(prop, val, arn);
                    t.model.insertColsAfter(arn.c2, val);
                };
                return this._isLockedCells(new asc_Range(arn.c2, 0, arn.c2 + val - 1, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
            case "delCol":
                functionModelAction = function () {
                    fullRecalc = true;
                    t.model.removeCols(arn.c1, arn.c2);
                };
                return this._isLockedCells(new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0), c_oAscLockTypeElemSubType.DeleteColumns, onChangeWorksheetCallback);
            case "showCols":
                functionModelAction = function () {
                    t.model.setColHidden(false, arn.c1, arn.c2);
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "hideCols":
                functionModelAction = function () {
                    t.model.setColHidden(true, arn.c1, arn.c2);
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "rowHeight":
                functionModelAction = function () {
                    val = val / 0.75;
                    val = (val | val) * 0.75;
                    t.model.setRowHeight(Math.min(val, t.maxRowHeight), arn.r1, arn.r2);
                    isUpdateRows = true;
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "insRowBefore":
                functionModelAction = function () {
                    fullRecalc = true;
                    t.model.insertRowsBefore(arn.r1, val);
                };
                return this._isLockedCells(new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r1 + val - 1), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
            case "insRowAfter":
                functionModelAction = function () {
                    fullRecalc = true;
                    t.model.insertRowsAfter(arn.r2, val);
                };
                return this._isLockedCells(new asc_Range(0, arn.r2, gc_nMaxCol0, arn.r2 + val - 1), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
            case "delRow":
                functionModelAction = function () {
                    fullRecalc = true;
                    t.model.removeRows(arn.r1, arn.r2);
                };
                return this._isLockedCells(new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r1), c_oAscLockTypeElemSubType.DeleteRows, onChangeWorksheetCallback);
            case "showRows":
                functionModelAction = function () {
                    t.model.setRowHidden(false, arn.r1, arn.r2);
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "hideRows":
                functionModelAction = function () {
                    t.model.setRowHidden(true, arn.r1, arn.r2);
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "insCell":
                bUndoRedo = val.range != undefined;
                if (val && val.range) {
                    _updateRangeIns = val.range;
                    val = val.val;
                } else {
                    _updateRangeIns = arn;
                }
                range = t.model.getRange3(_updateRangeIns.r1, _updateRangeIns.c1, _updateRangeIns.r2, _updateRangeIns.c2);
                switch (val) {
                case c_oAscInsertOptions.InsertCellsAndShiftRight:
                    functionModelAction = function () {
                        var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeIns, c_oAscInsertOptions.InsertCellsAndShiftRight, prop, bUndoRedo);
                        if (!isCheckChangeAutoFilter) {
                            return;
                        }
                        if (range.addCellsShiftRight()) {
                            fullRecalc = true;
                            if (isCheckChangeAutoFilter == "changeAutoFilter") {
                                if (gUndoInsDelCellsFlag == true) {
                                    t.autoFilters.insertColumn(prop, _updateRangeIns, arn);
                                } else {
                                    if (gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data) {
                                        t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
                                    }
                                }
                                gUndoInsDelCellsFlag = true;
                            }
                            t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
                            t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
                        }
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(_updateRangeIns.c1, _updateRangeIns.r1, gc_nMaxCol0, _updateRangeIns.r2), null, onChangeWorksheetCallback);
                    }
                    return;
                case c_oAscInsertOptions.InsertCellsAndShiftDown:
                    functionModelAction = function () {
                        var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeIns, c_oAscInsertOptions.InsertCellsAndShiftDown, prop, bUndoRedo);
                        if (!isCheckChangeAutoFilter) {
                            return;
                        }
                        if (range.addCellsShiftBottom()) {
                            fullRecalc = true;
                            if (isCheckChangeAutoFilter == "changeAutoFilter") {
                                if (gUndoInsDelCellsFlag == true) {
                                    t.autoFilters.insertRows(prop, _updateRangeIns, _updateRangeIns);
                                } else {
                                    if (gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data) {
                                        t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
                                    }
                                }
                                gUndoInsDelCellsFlag = true;
                            }
                            t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
                            t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
                        }
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(_updateRangeIns.c1, _updateRangeIns.r1, _updateRangeIns.c2, gc_nMaxRow0), null, onChangeWorksheetCallback);
                    }
                    return;
                case c_oAscInsertOptions.InsertColumns:
                    functionModelAction = function () {
                        fullRecalc = true;
                        t.model.insertColsBefore(_updateRangeIns.c1, _updateRangeIns.c2 - _updateRangeIns.c1 + 1);
                        if (gUndoInsDelCellsFlag == true) {
                            t.autoFilters.insertColumn(prop, _updateRangeIns, arn);
                        } else {
                            if (gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data) {
                                t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
                            }
                        }
                        gUndoInsDelCellsFlag = true;
                        t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
                        t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(_updateRangeIns.c1, 0, _updateRangeIns.c2, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
                    }
                    return;
                case c_oAscInsertOptions.InsertRows:
                    functionModelAction = function () {
                        fullRecalc = true;
                        t.model.insertRowsBefore(_updateRangeIns.r1, _updateRangeIns.r2 - _updateRangeIns.r1 + 1);
                        if (gUndoInsDelCellsFlag == true) {
                            t.autoFilters.insertRows(prop, _updateRangeIns, arn);
                        } else {
                            if (gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data) {
                                t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
                            }
                        }
                        gUndoInsDelCellsFlag = true;
                        t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
                        t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(0, _updateRangeIns.r1, gc_nMaxCol0, _updateRangeIns.r2), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
                    }
                    return;
                default:
                    return;
                }
                break;
            case "delCell":
                bUndoRedo = val.range != undefined;
                if (val && val.range) {
                    _updateRangeDel = val.range;
                    val = val.val;
                } else {
                    _updateRangeDel = arn;
                }
                range = t.model.getRange3(_updateRangeDel.r1, _updateRangeDel.c1, _updateRangeDel.r2, _updateRangeDel.c2);
                switch (val) {
                case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                    var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteCellsAndShiftLeft, prop, bUndoRedo);
                    if (!isCheckChangeAutoFilter) {
                        return;
                    }
                    functionModelAction = function () {
                        History.Create_NewPoint();
                        History.SetSelection(new asc_Range(_updateRangeDel.c1, 0, _updateRangeDel.c2, gc_nMaxRow0));
                        History.StartTransaction();
                        if (range.deleteCellsShiftLeft()) {
                            fullRecalc = true;
                            if (isCheckChangeAutoFilter == "changeAutoFilter") {
                                t.autoFilters.insertColumn(prop, _updateRangeDel, arn, c_oAscDeleteOptions.DeleteCellsAndShiftLeft);
                            }
                            t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
                            t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
                        }
                        History.EndTransaction();
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1, gc_nMaxCol0, _updateRangeDel.r2), null, onChangeWorksheetCallback);
                    }
                    return;
                case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                    var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteCellsAndShiftTop, prop, bUndoRedo);
                    if (!isCheckChangeAutoFilter) {
                        return;
                    }
                    functionModelAction = function () {
                        History.Create_NewPoint();
                        History.SetSelection(new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1, _updateRangeDel.c2, _updateRangeDel.r2));
                        History.StartTransaction();
                        if (range.deleteCellsShiftUp()) {
                            fullRecalc = true;
                            if (isCheckChangeAutoFilter == "changeAutoFilter") {
                                t.autoFilters.insertRows(prop, _updateRangeDel, _updateRangeDel, c_oAscDeleteOptions.DeleteCellsAndShiftTop);
                            }
                            t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
                            t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
                        }
                        History.EndTransaction();
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1, _updateRangeDel.c2, gc_nMaxRow0), null, onChangeWorksheetCallback);
                    }
                    return;
                case c_oAscDeleteOptions.DeleteColumns:
                    var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteColumns, prop, bUndoRedo);
                    if (!isCheckChangeAutoFilter) {
                        return;
                    }
                    functionModelAction = function () {
                        fullRecalc = true;
                        History.Create_NewPoint();
                        History.SetSelection(new asc_Range(_updateRangeDel.c1, 0, _updateRangeDel.c2, gc_nMaxRow0));
                        History.StartTransaction();
                        t.model.removeCols(_updateRangeDel.c1, _updateRangeDel.c2);
                        t.autoFilters.insertColumn(prop, _updateRangeDel, arn, c_oAscDeleteOptions.DeleteColumns);
                        History.EndTransaction();
                        t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
                        t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(_updateRangeDel.c1, 0, _updateRangeDel.c2, gc_nMaxRow0), c_oAscLockTypeElemSubType.DeleteColumns, onChangeWorksheetCallback);
                    }
                    return;
                case c_oAscDeleteOptions.DeleteRows:
                    var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteRows, prop, bUndoRedo);
                    if (!isCheckChangeAutoFilter) {
                        return;
                    }
                    functionModelAction = function () {
                        fullRecalc = true;
                        History.Create_NewPoint();
                        History.SetSelection(new asc_Range(0, _updateRangeDel.r1, gc_nMaxCol0, _updateRangeDel.r2));
                        History.StartTransaction();
                        t.model.removeRows(_updateRangeDel.r1, _updateRangeDel.r2);
                        t.autoFilters.insertRows(prop, _updateRangeDel, arn, c_oAscDeleteOptions.DeleteRows);
                        History.EndTransaction();
                        t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
                        t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
                    };
                    if (bUndoRedo) {
                        onChangeWorksheetCallback(true);
                    } else {
                        this._isLockedCells(new asc_Range(0, _updateRangeDel.r1, gc_nMaxCol0, _updateRangeDel.r2), c_oAscLockTypeElemSubType.DeleteRows, onChangeWorksheetCallback);
                    }
                    return;
                default:
                    return;
                }
                break;
            case "sheetViewSettings":
                functionModelAction = function () {
                    t.model.setSheetViewSettings(val);
                    isUpdateCols = true;
                    isUpdateRows = true;
                    fullRecalc = true;
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "update":
                if (val !== undefined) {
                    fullRecalc = !!val.fullRecalc;
                    lockDraw = true === val.lockDraw;
                }
                break;
            case "updateRange":
                if (val && val.range) {
                    t._updateCellsRange(val.range, val.canChangeColWidth, val.isLockDraw);
                }
                return;
            default:
                return;
            }
            t._initCellsArea(fullRecalc);
            if (fullRecalc) {
                t.cache.reset();
            } else {
                if (cleanCacheCols) {
                    t._cleanCache(asc_Range(arn.c1, 0, arn.c2, t.rows.length - 1));
                }
                if (cleanCacheRows) {
                    t._cleanCache(asc_Range(0, arn.r1, t.cols.length - 1, arn.r2));
                }
            }
            t._cleanCellsTextMetricsCache();
            t._prepareCellTextMetricsCache(t.visibleRange);
            t.draw(lockDraw);
            t._trigger("reinitializeScroll");
            if (isUpdateCols) {
                t._updateVisibleColsCount();
            }
            if (isUpdateRows) {
                t._updateVisibleRowsCount();
            }
            if (false === lockDraw) {
                t.objectRender.showDrawingObjects(true);
            }
        },
        expandColsOnScroll: function (isNotActive, updateColsCount, newColsCount) {
            var t = this;
            var arn;
            var bIsMaxCols = false;
            var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {
                maxCol: 0,
                maxRow: 0
            };
            var maxc = Math.max(this.model.getColsCount(), this.cols.length, obr.maxCol);
            if (newColsCount) {
                maxc = Math.max(maxc, newColsCount);
            }
            var nLastCols = this.nColsCount;
            if (isNotActive) {
                this.nColsCount = maxc + 1;
            } else {
                if (updateColsCount) {
                    this.nColsCount = maxc;
                    if (this.cols.length < this.nColsCount) {
                        nLastCols = this.cols.length;
                    }
                } else {
                    arn = t.activeRange.clone(true);
                    if (arn.c2 >= t.cols.length - 1) {
                        this.nColsCount = maxc;
                        if (arn.c2 >= this.nColsCount - 1) {
                            this.nColsCount = arn.c2 + 2;
                        }
                    }
                }
            }
            if (gc_nMaxCol < this.nColsCount) {
                this.nColsCount = gc_nMaxCol;
                bIsMaxCols = true;
            }
            t._calcColumnWidths(2);
            return (nLastCols !== this.nColsCount || bIsMaxCols);
        },
        expandRowsOnScroll: function (isNotActive, updateRowsCount, newRowsCount) {
            var t = this;
            var arn;
            var bIsMaxRows = false;
            var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {
                maxCol: 0,
                maxRow: 0
            };
            var maxr = Math.max(this.model.getRowsCount(), this.rows.length, obr.maxRow);
            if (newRowsCount) {
                maxr = Math.max(maxr, newRowsCount);
            }
            var nLastRows = this.nRowsCount;
            if (isNotActive) {
                this.nRowsCount = maxr + 1;
            } else {
                if (updateRowsCount) {
                    this.nRowsCount = maxr;
                    if (this.rows.length < this.nRowsCount) {
                        nLastRows = this.rows.length;
                    }
                } else {
                    arn = t.activeRange.clone(true);
                    if (arn.r2 >= t.rows.length - 1) {
                        this.nRowsCount = maxr;
                        if (arn.r2 >= this.nRowsCount - 1) {
                            this.nRowsCount = arn.r2 + 2;
                        }
                    }
                }
            }
            if (gc_nMaxRow < this.nRowsCount) {
                this.nRowsCount = gc_nMaxRow;
                bIsMaxRows = true;
            }
            t._calcRowHeights(2);
            return (nLastRows !== this.nRowsCount || bIsMaxRows);
        },
        optimizeColWidth: function (col) {
            var t = this;
            var onChangeWidthCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                var width = null;
                var row, ct, c, fl, str, maxW, tm, mc;
                var oldWidth;
                var lastHeight = null;
                var filterButton = null;
                for (row = 0; row < t.rows.length; ++row) {
                    ct = t._getCellTextCache(col, row);
                    if (ct === undefined) {
                        continue;
                    }
                    if (ct.flags.isMerged) {
                        mc = ct.mc;
                        if (mc.c1 !== mc.c2) {
                            continue;
                        }
                    }
                    t.cols[col].isCustomWidth = false;
                    t._addCellTextToCache(col, row, c_oAscCanChangeColWidth.all);
                    ct = t._getCellTextCache(col, row);
                    if (ct.metrics.height > t.maxRowHeight) {
                        oldWidth = ct.metrics.width;
                        lastHeight = null;
                        c = t._getCell(col, row);
                        fl = t._getCellFlags(c);
                        if (fl.isMerged) {
                            continue;
                        }
                        str = c.getValue2();
                        maxW = ct.metrics.width + t.maxDigitWidth;
                        while (1) {
                            tm = t._roundTextMetrics(t.stringRender.measureString(str, fl, maxW));
                            if (tm.height <= t.maxRowHeight) {
                                break;
                            }
                            if (lastHeight === tm.height) {
                                tm.width = oldWidth;
                                break;
                            }
                            lastHeight = tm.height;
                            maxW += t.maxDigitWidth;
                        }
                        width = Math.max(width, tm.width);
                    } else {
                        filterButton = t.autoFilters.getSizeButton({
                            c1: col,
                            r1: row
                        });
                        if (null !== filterButton && CellValueType.String === ct.cellType) {
                            width = Math.max(width, ct.metrics.width + filterButton.width);
                        } else {
                            width = Math.max(width, ct.metrics.width);
                        }
                    }
                }
                if (width > 0) {
                    var pad = t.width_padding * 2 + t.width_1px;
                    var cc = Math.min(t._colWidthToCharCount(width + pad), 255);
                    var cw = t._charCountToModelColWidth(cc, true);
                } else {
                    cw = gc_dDefaultColWidthCharsAttribute;
                }
                History.Create_NewPoint();
                History.SetSelection(null, true);
                History.StartTransaction();
                t.model.setColBestFit(true, cw, col, col);
                History.EndTransaction();
                t.nColsCount = 0;
                t._calcColumnWidths(0);
                t._updateVisibleColsCount();
                t._cleanCache(asc_Range(col, 0, col, t.rows.length - 1));
                t.changeWorksheet("update");
            };
            return this._isLockedAll(onChangeWidthCallback);
        },
        optimizeRowHeight: function (row) {
            var t = this;
            var onChangeHeightCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                var height = t.defaultRowHeight;
                var col, ct, mc;
                for (col = 0; col < t.rows.length; ++col) {
                    ct = t._getCellTextCache(col, row);
                    if (ct === undefined) {
                        continue;
                    }
                    if (ct.flags.isMerged) {
                        mc = ct.mc;
                        if (mc.r1 !== mc.r2) {
                            continue;
                        }
                    }
                    height = Math.max(height, ct.metrics.height);
                }
                History.Create_NewPoint();
                History.SetSelection(null, true);
                History.StartTransaction();
                t.model.setRowBestFit(true, Math.min(height + t.height_1px, t.maxRowHeight), row, row);
                History.EndTransaction();
                t.nRowsCount = 0;
                t._calcRowHeights(0);
                t._updateVisibleRowsCount();
                t._cleanCache(asc_Range(0, row, t.cols.length - 1, row));
                t.changeWorksheet("update");
            };
            return this._isLockedAll(onChangeHeightCallback);
        },
        _setActiveCell: function (col, row) {
            var ar = this.activeRange,
            sc = ar.startCol,
            sr = ar.startRow,
            offs;
            this.cleanSelection();
            ar.assign(col, row, col, row);
            ar.type = c_oAscSelectionType.RangeCells;
            ar.startCol = col;
            ar.startRow = row;
            this._fixSelectionOfMergedCells();
            this._fixSelectionOfHiddenCells();
            this._drawSelection();
            offs = this._calcActiveRangeOffset();
            if (sc !== ar.startCol || sr !== ar.startRow) {
                this._trigger("selectionNameChanged", this.getSelectionName(false));
                this._trigger("selectionChanged", this.getSelectionInfo());
            }
            return offs;
        },
        findCellText: function (options) {
            var self = this;
            if (true !== options.isMatchCase) {
                options.text = options.text.toLowerCase();
            }
            var ar = options.activeRange ? options.activeRange : this.activeRange;
            var c = ar.startCol;
            var r = ar.startRow;
            var minC = 0;
            var minR = 0;
            var maxC = this.cols.length - 1;
            var maxR = this.rows.length - 1;
            var inc = options.scanForward ? +1 : -1;
            var ct, mc, excluded = [];
            var _tmpCell, cellText;
            function isExcluded(col, row) {
                for (var i = 0; i < excluded.length; ++i) {
                    if (excluded[i].contains(col, row)) {
                        return true;
                    }
                }
                return false;
            }
            function findNextCell() {
                var ct = undefined;
                do {
                    do {
                        mc = self.model.getMergedByCell(r, c);
                        if (mc) {
                            excluded.push(mc);
                        }
                        if (options.scanByRows) {
                            c += mc ? (options.scanForward ? mc.c2 + 1 - c : mc.c1 - 1 - c) : inc;
                            if (c < minC || c > maxC) {
                                c = options.scanForward ? minC : maxC;
                                r += inc;
                            }
                        } else {
                            r += mc ? (options.scanForward ? mc.r2 + 1 - r : mc.r1 - 1 - r) : inc;
                            if (r < minR || r > maxR) {
                                r = options.scanForward ? minR : maxR;
                                c += inc;
                            }
                        }
                        if (c < minC || c > maxC || r < minR || r > maxR) {
                            return undefined;
                        }
                    } while (isExcluded(c, r));
                    ct = self._getCellTextCache(c, r);
                } while (!ct);
                return ct;
            }
            for (ct = findNextCell(); ct; ct = findNextCell()) {
                mc = this.model.getMergedByCell(r, c);
                if (mc) {
                    _tmpCell = this.model.getCell(new CellAddress(mc.r1, mc.c1, 0));
                } else {
                    _tmpCell = this.model.getCell(new CellAddress(r, c, 0));
                }
                cellText = _tmpCell.getValueForEdit();
                if (true !== options.isMatchCase) {
                    cellText = cellText.toLowerCase();
                }
                if (cellText.indexOf(options.text) >= 0) {
                    if (true !== options.isWholeCell || options.text.length === cellText.length) {
                        return (options.isNotSelect) ? (mc ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(c, r, c, r)) : this._setActiveCell(c, r);
                    }
                }
            }
            excluded = [];
            if (options.scanForward) {
                minC = 0;
                minR = 0;
                if (options.scanByRows) {
                    c = -1;
                    r = 0;
                    maxC = this.cols.length - 1;
                    maxR = ar.startRow;
                } else {
                    c = 0;
                    r = -1;
                    maxC = ar.startCol;
                    maxR = this.rows.length - 1;
                }
            } else {
                c = this.cols.length - 1;
                r = this.rows.length - 1;
                if (options.scanByRows) {
                    minC = 0;
                    minR = ar.startRow;
                } else {
                    minC = ar.startCol;
                    minR = 0;
                }
                maxC = this.cols.length - 1;
                maxR = this.rows.length - 1;
            }
            for (ct = findNextCell(); ct; ct = findNextCell()) {
                mc = this.model.getMergedByCell(r, c);
                if (mc) {
                    _tmpCell = this.model.getCell(new CellAddress(mc.r1, mc.c1, 0));
                } else {
                    _tmpCell = this.model.getCell(new CellAddress(r, c, 0));
                }
                cellText = _tmpCell.getValueForEdit();
                if (true !== options.isMatchCase) {
                    cellText = cellText.toLowerCase();
                }
                if (cellText.indexOf(options.text) >= 0) {
                    if (true !== options.isWholeCell || options.text.length === cellText.length) {
                        return (options.isNotSelect) ? (mc ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(c, r, c, r)) : this._setActiveCell(c, r);
                    }
                }
            }
            return undefined;
        },
        replaceCellText: function (options) {
            var findFlags = "g";
            if (true !== options.isMatchCase) {
                findFlags += "i";
            }
            var valueForSearching = options.findWhat.replace(/(\\)/g, "\\").replace(/(\^)/g, "\\^").replace(/(\()/g, "\\(").replace(/(\))/g, "\\)").replace(/(\+)/g, "\\+").replace(/(\[)/g, "\\[").replace(/(\])/g, "\\]").replace(/(\{)/g, "\\{").replace(/(\})/g, "\\}").replace(/(\$)/g, "\\$").replace(/(~)?\*/g, function ($0, $1) {
                return $1 ? $0 : "(.*)";
            }).replace(/(~)?\?/g, function ($0, $1) {
                return $1 ? $0 : ".";
            }).replace(/(~\*)/g, "\\*").replace(/(~\?)/g, "\\?");
            valueForSearching = new RegExp(valueForSearching, findFlags);
            var t = this;
            var ar = this.activeRange.clone();
            ar.startCol = this.activeRange.startCol;
            ar.startRow = this.activeRange.startRow;
            var aReplaceCells = [];
            if (options.isReplaceAll) {
                t._trigger("slowOperation", true);
                var aReplaceCellsIndex = {};
                var optionsFind = {
                    text: options.findWhat,
                    scanByRows: true,
                    scanForward: true,
                    isMatchCase: options.isMatchCase,
                    isWholeCell: options.isWholeCell,
                    isNotSelect: true,
                    activeRange: ar
                };
                var findResult, index;
                while (true) {
                    findResult = t.findCellText(optionsFind);
                    if (undefined === findResult) {
                        break;
                    }
                    index = findResult.c1 + "-" + findResult.r1;
                    if (aReplaceCellsIndex[index]) {
                        break;
                    }
                    aReplaceCellsIndex[index] = true;
                    aReplaceCells.push(findResult);
                    ar.startCol = findResult.c1;
                    ar.startRow = findResult.r1;
                }
            } else {
                var mc = t.model.getMergedByCell(ar.startRow, ar.startCol);
                var c1 = mc ? mc.c1 : ar.startCol;
                var r1 = mc ? mc.r1 : ar.startRow;
                var c = t._getVisibleCell(c1, r1);
                if (c === undefined) {
                    asc_debug("log", "Unknown cell's info: col = " + c1 + ", row = " + r1);
                    t._trigger("onRenameCellTextEnd", 0, 0);
                    return;
                }
                var cellValue = c.getValueForEdit();
                if ((true === options.isWholeCell && cellValue.length !== options.findWhat.length) || 0 > cellValue.search(valueForSearching)) {
                    t._trigger("onRenameCellTextEnd", 0, 0);
                    return;
                }
                aReplaceCells.push(new asc_Range(c1, r1, c1, r1));
            }
            if (0 > aReplaceCells.length) {
                t._trigger("onRenameCellTextEnd", 0, 0);
                return;
            }
            this._replaceCellsText(aReplaceCells, valueForSearching, options);
        },
        _replaceCellsText: function (aReplaceCells, valueForSearching, options) {
            var oSelectionHistory = this.activeRange.clone();
            History.Create_NewPoint();
            History.SetSelection(oSelectionHistory);
            History.StartTransaction();
            options.indexInArray = 0;
            options.countFind = aReplaceCells.length;
            options.countReplace = 0;
            this._replaceCellText(aReplaceCells, valueForSearching, options);
        },
        _replaceCellText: function (aReplaceCells, valueForSearching, options) {
            var t = this;
            if (options.indexInArray >= aReplaceCells.length) {
                History.EndTransaction();
                if (options.isReplaceAll) {
                    t._trigger("slowOperation", false);
                }
                t._trigger("onRenameCellTextEnd", options.countFind, options.countReplace);
                return;
            }
            var onReplaceCallback = function (isSuccess) {
                var cell = aReplaceCells[options.indexInArray];
                ++options.indexInArray;
                if (false !== isSuccess) {
                    ++options.countReplace;
                    var c = t._getVisibleCell(cell.c1, cell.r1);
                    if (c === undefined) {
                        asc_debug("log", "Unknown cell's info: col = " + cell.c1 + ", row = " + cell.r1);
                    } else {
                        var cellValue = c.getValueForEdit();
                        cellValue = cellValue.replace(valueForSearching, options.replaceWith);
                        var oCellEdit = new asc_Range(cell.c1, cell.r1, cell.c1, cell.r1);
                        var v, newValue;
                        v = c.getValueForEdit2().slice(0, 1);
                        newValue = [];
                        newValue[0] = {
                            text: cellValue,
                            format: v[0].format.clone()
                        };
                        t._saveCellValueAfterEdit(oCellEdit, c, newValue, undefined, false, true);
                    }
                }
                window.setTimeout(function () {
                    t._replaceCellText(aReplaceCells, valueForSearching, options);
                },
                1);
            };
            this._isLockedCells(aReplaceCells[options.indexInArray], null, onReplaceCallback);
        },
        findCell: function (reference) {
            var t = this;
            var match = (/(?:R(\d+)C(\d+)|([A-Z]+[0-9]+))(?::(?:R(\d+)C(\d+)|([A-Z]+[0-9]+)))?/i).exec(reference);
            if (!match) {
                return null;
            }
            function _findCell(match1, match2, match3) {
                var addr = typeof match1 === "string" ? new CellAddress(parseInt(match1), parseInt(match2)) : typeof match3 === "string" ? new CellAddress(match3) : null;
                if (addr && addr.isValid() && addr.getRow0() >= t.rows.length) {
                    t.nRowsCount = addr.getRow0() + 1;
                    t._calcRowHeights(2);
                }
                if (addr && addr.isValid() && addr.getCol0() >= t.cols.length) {
                    t.nColsCount = addr.getCol0() + 1;
                    t._calcColumnWidths(2);
                }
                return addr && addr.isValid() ? addr : null;
            }
            var addr1 = _findCell(match[1], match[2], match[3]);
            var addr2 = _findCell(match[4], match[5], match[6]);
            if (!addr1 && !addr2) {
                return {};
            }
            var delta = t._setActiveCell(addr1.getCol0(), addr1.getRow0());
            return !addr2 ? delta : t.changeSelectionEndPoint(addr2.getCol0() - addr1.getCol0(), addr2.getRow0() - addr1.getRow0(), false, false);
        },
        setCellEditMode: function (isCellEditMode) {
            this.isCellEditMode = isCellEditMode;
        },
        setFormulaEditMode: function (isFormulaEditMode) {
            this.isFormulaEditMode = isFormulaEditMode;
        },
        getFormulaEditMode: function () {
            return this.isFormulaEditMode;
        },
        setSelectionDialogMode: function (isSelectionDialogMode, selectRange) {
            if (isSelectionDialogMode === this.isSelectionDialogMode) {
                return;
            }
            this.isSelectionDialogMode = isSelectionDialogMode;
            this.cleanSelection();
            if (false === this.isSelectionDialogMode) {
                if (null !== this.copyOfActiveRange) {
                    this.activeRange = this.copyOfActiveRange.clone(true);
                    this.activeRange.startCol = this.copyOfActiveRange.startCol;
                    this.activeRange.startRow = this.copyOfActiveRange.startRow;
                }
                this.copyOfActiveRange = null;
            } else {
                this.copyOfActiveRange = this.activeRange.clone(true);
                this.copyOfActiveRange.startCol = this.activeRange.startCol;
                this.copyOfActiveRange.startRow = this.activeRange.startRow;
                if (selectRange) {
                    selectRange = parserHelp.parse3DRef(selectRange);
                    if (selectRange) {
                        selectRange = this.model.getRange2(selectRange.range);
                        if (null !== selectRange) {
                            this.activeRange = selectRange.getBBox0();
                            this.activeRange.startCol = this.activeRange.c1;
                            this.activeRange.startRow = this.activeRange.r1;
                        }
                    }
                }
            }
            this._drawSelection();
        },
        getCellEditMode: function () {
            return this.isCellEditMode;
        },
        _isFormula: function (val) {
            return val.length > 0 && val[0].text.length > 1 && val[0].text.charAt(0) === "=" ? true : false;
        },
        getActiveCell: function (x, y, isCoord) {
            var t = this;
            var col, row;
            if (isCoord) {
                x *= asc_getcvt(0, 1, t._getPPIX());
                y *= asc_getcvt(0, 1, t._getPPIY());
                col = t._findColUnderCursor(x, true);
                row = t._findRowUnderCursor(y, true);
                if (!col || !row) {
                    return false;
                }
                col = col.col;
                row = row.row;
            } else {
                col = t.activeRange.startCol;
                row = t.activeRange.startRow;
            }
            var mergedRange = this.model.getMergedByCell(row, col);
            return mergedRange ? mergedRange : asc_Range(col, row, col, row);
        },
        _saveCellValueAfterEdit: function (oCellEdit, c, val, flags, skipNLCheck, isNotHistory) {
            var t = this;
            var oldMode = t.isFormulaEditMode;
            t.isFormulaEditMode = false;
            if (!isNotHistory) {
                History.Create_NewPoint();
                History.SetSelection(oCellEdit);
                History.StartTransaction();
            }
            var isFormula = t._isFormula(val);
            if (isFormula) {
                var ftext = val.reduce(function (pv, cv) {
                    return pv + cv.text;
                },
                "");
                var ret = true;
                c.setValue(ftext, function (r) {
                    ret = r;
                });
                if (!ret) {
                    t.isFormulaEditMode = oldMode;
                    History.EndTransaction();
                    return false;
                }
                isFormula = c.isFormula();
            } else {
                c.setValue2(val);
                t.autoFilters._renameTableColumn(oCellEdit);
            }
            if (!isFormula) {
                var bIsSetWrap = false;
                if (!skipNLCheck) {
                    for (var key in val) {
                        if (val[key].text.indexOf(kNewLine) >= 0) {
                            bIsSetWrap = true;
                            break;
                        }
                    }
                }
                if (bIsSetWrap) {
                    c.setWrap(true);
                }
                t._updateCellsRange(oCellEdit, c_oAscCanChangeColWidth.numbers);
            }
            if (!isNotHistory) {
                History.EndTransaction();
            }
            return true;
        },
        openCellEditor: function (editor, x, y, isCoord, fragments, cursorPos, isFocus, isClearCell, isHideCursor, activeRange) {
            var t = this,
            vr = t.visibleRange,
            tc = t.cols,
            tr = t.rows,
            col, row, c, fl, mc, bg;
            var ar = t.activeRange;
            if (activeRange) {
                t.activeRange.c1 = activeRange.c1;
                t.activeRange.c2 = activeRange.c2;
                t.activeRange.r1 = activeRange.r1;
                t.activeRange.r2 = activeRange.r2;
                t.activeRange.startCol = activeRange.startCol;
                t.activeRange.startRow = activeRange.startRow;
                t.activeRange.type = activeRange.type;
            }
            if (t.objectRender.checkCursorDrawingObject(x, y)) {
                return false;
            }
            function getLeftSide(col) {
                var i, res = [],
                offs = t.cols[vr.c1].left - t.cols[0].left;
                for (i = col; i >= vr.c1; --i) {
                    res.push(t.cols[i].left - offs);
                }
                return res;
            }
            function getRightSide(col) {
                var i, w, res = [],
                offs = t.cols[vr.c1].left - t.cols[0].left;
                if (fl.isMerged && col > vr.c2) {
                    col = vr.c2;
                }
                for (i = col; i <= vr.c2; ++i) {
                    res.push(t.cols[i].left + t.cols[i].width - offs);
                }
                w = t.drawingCtx.getWidth();
                if (res[res.length - 1] > w) {
                    res[res.length - 1] = w;
                }
                return res;
            }
            function getBottomSide(row) {
                var i, h, res = [],
                offs = t.rows[vr.r1].top - t.rows[0].top;
                if (fl.isMerged && row > vr.r2) {
                    row = vr.r2;
                }
                for (i = row; i <= vr.r2; ++i) {
                    res.push(t.rows[i].top + t.rows[i].height - offs);
                }
                h = t.drawingCtx.getHeight();
                if (res[res.length - 1] > h) {
                    res[res.length - 1] = h;
                }
                return res;
            }
            if (isCoord) {
                x *= asc_getcvt(0, 1, t._getPPIX());
                y *= asc_getcvt(0, 1, t._getPPIY());
                col = t._findColUnderCursor(x, true);
                row = t._findRowUnderCursor(y, true);
                if (!col || !row) {
                    return false;
                }
                col = col.col;
                row = row.row;
            } else {
                col = ar.startCol;
                row = ar.startRow;
            }
            c = t._getVisibleCell(col, row);
            if (!c) {
                throw "Can not get cell data (col=" + col + ", row=" + row + ")";
            }
            fl = t._getCellFlags(c);
            if (fl.isMerged) {
                mc = t.model.getMergedByCell(row, col);
                c = t._getVisibleCell(mc.c1, mc.r1);
                if (!c) {
                    throw "Can not get merged cell data (col=" + mc.c1 + ", row=" + mc.r1 + ")";
                }
                fl = t._getCellFlags(c);
                var bIsUpdateX = false;
                var bIsUpdateY = false;
                if (mc.c1 < vr.c1) {
                    vr.c1 = mc.c1;
                    bIsUpdateX = true;
                    t._calcVisibleColumns();
                }
                if (mc.r1 < vr.r1) {
                    vr.r1 = mc.r1;
                    bIsUpdateY = true;
                    t._calcVisibleRows();
                }
                if (bIsUpdateX && bIsUpdateY) {
                    this._trigger("reinitializeScroll");
                } else {
                    if (bIsUpdateX) {
                        this._trigger("reinitializeScrollX");
                    } else {
                        if (bIsUpdateY) {
                            this._trigger("reinitializeScrollY");
                        }
                    }
                }
                if (bIsUpdateX || bIsUpdateY) {
                    t.draw();
                }
            }
            bg = c.getFill();
            if (null != bg) {
                bg = bg.getRgb();
            }
            t.isFormulaEditMode = false;
            t.arrActiveFormulaRanges = [];
            var oFontColor = c.getFontcolor();
            if (null != oFontColor) {
                oFontColor = oFontColor.getRgb();
            }
            this.model.workbook.handlers.trigger("asc_onHideComment");
            editor.open({
                cellX: t.cellsLeft + tc[!fl.isMerged ? col : mc.c1].left - tc[vr.c1].left,
                cellY: t.cellsTop + tr[!fl.isMerged ? row : mc.r1].top - tr[vr.r1].top,
                leftSide: getLeftSide(!fl.isMerged ? col : mc.c1),
                rightSide: getRightSide(!fl.isMerged ? col : mc.c2),
                bottomSide: getBottomSide(!fl.isMerged ? row : mc.r2),
                fragments: fragments !== undefined ? fragments : c.getValueForEdit2(),
                flags: fl,
                font: new asc_FP(c.getFontname(), c.getFontsize()),
                background: bg !== null ? asc_n2css(bg) : t.settings.cells.defaultState.background,
                hasBackground: bg !== null,
                textColor: oFontColor || t.settings.cells.defaultState.color,
                cursorPos: cursorPos,
                zoom: t.getZoom(),
                focus: isFocus,
                isClearCell: isClearCell,
                isHideCursor: isHideCursor,
                saveValueCallback: function (val, flags, skipNLCheck) {
                    var oCellEdit = fl.isMerged ? new asc_Range(0, mc.r1, gc_nMaxCol0, mc.r1) : new asc_Range(0, row, gc_nMaxCol0, row);
                    return t._saveCellValueAfterEdit(oCellEdit, c, val, flags, skipNLCheck, false);
                }
            });
            t._drawSelection();
            return true;
        },
        openCellEditorWithText: function (editor, text, cursorPos, isFocus, activeRange) {
            var t = this;
            var ar = (activeRange) ? activeRange : t.activeRange;
            var c = t._getVisibleCell(ar.startCol, ar.startRow);
            var v, copyValue;
            if (!c) {
                throw "Can not get cell data (col=" + ar.startCol + ", row=" + ar.startCol + ")";
            }
            v = c.getValueForEdit2().slice(0, 1);
            copyValue = [];
            copyValue[0] = {
                text: text,
                format: v[0].format.clone()
            };
            var bSuccess = t.openCellEditor(editor, 0, 0, false, undefined, undefined, isFocus, true, false, activeRange);
            if (bSuccess) {
                editor.paste(copyValue, cursorPos);
            }
            return bSuccess;
        },
        _updateCellsRange: function (range, canChangeColWidth, lockDraw) {
            var t = this,
            r, c, h, d, ct;
            var mergedRange, bUpdateRowHeight;
            if (range === undefined) {
                range = t.activeRange.clone(true);
            }
            if (gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2) {
                range = range.clone();
                if (gc_nMaxCol0 === range.c2) {
                    range.c2 = this.cols.length - 1;
                }
                if (gc_nMaxRow0 === range.r2) {
                    range.r2 = this.rows.length - 1;
                }
            }
            t._cleanCache(range);
            if (t._isLargeRange(range)) {
                t.changeWorksheet("update", {
                    lockDraw: lockDraw
                });
                return;
            }
            for (r = range.r1; r <= range.r2; ++r) {
                if (t.height_1px > t.rows[r].height) {
                    continue;
                }
                for (c = range.c1; c <= range.c2; ++c) {
                    if (t.width_1px > t.cols[c].width) {
                        continue;
                    }
                    c = t._addCellTextToCache(c, r, canChangeColWidth);
                }
                for (h = t.defaultRowHeight, d = t.defaultRowDescender, c = 0; c < t.cols.length; ++c) {
                    ct = t._getCellTextCache(c, r, true);
                    if (!ct) {
                        continue;
                    }
                    if (!ct.flags.isMerged) {
                        bUpdateRowHeight = true;
                    } else {
                        mergedRange = ct.mc;
                        bUpdateRowHeight = mergedRange.r1 === mergedRange.r2;
                    }
                    if (bUpdateRowHeight) {
                        h = Math.max(h, ct.metrics.height);
                    }
                    if (ct.cellVA !== kvaTop && ct.cellVA !== kvaCenter && !ct.flags.isMerged) {
                        d = Math.max(d, ct.metrics.height - ct.metrics.baseline);
                    }
                }
                if (Math.abs(h - t.rows[r].height) > 1e-06 && !t.rows[r].isCustomHeight) {
                    t.rows[r].heightReal = t.rows[r].height = Math.min(h, t.maxRowHeight);
                    if (!t.rows[r].isDefaultHeight) {
                        t.model.setRowHeight(t.rows[r].height + this.height_1px, r, r);
                    }
                    t.isChanged = true;
                }
                if (Math.abs(d - t.rows[r].descender) > 1e-06) {
                    t.rows[r].descender = d;
                    t.isChanged = true;
                }
            }
            if (t.isChanged) {
                t.isChanged = false;
                t._initCellsArea(true);
                t.cache.reset();
                t._cleanCellsTextMetricsCache();
                t._prepareCellTextMetricsCache(t.visibleRange);
                t._trigger("reinitializeScroll");
                t._trigger("selectionNameChanged", this.getSelectionName(false));
                t._trigger("selectionChanged", t.getSelectionInfo());
            }
            t.objectRender.rebuildChartGraphicObjects();
            t.cellCommentator.updateCommentPosition();
            t.draw(lockDraw);
        },
        enterCellRange: function (editor) {
            var t = this;
            if (!t.isFormulaEditMode) {
                return;
            }
            var ar = t.arrActiveFormulaRanges[t.arrActiveFormulaRanges.length - 1];
            var s = t.getActiveRange(ar);
            editor.enterCellRange(s);
            return true;
        },
        changeCellRange: function (editor, range) {
            var s = this.getActiveRange(range);
            if (range.isAbsolute) {
                var ra = range.isAbsolute.split(":"),
                _s;
                if (ra.length >= 1) {
                    var sa = s.split(":");
                    for (var ind = 0; ind < sa.length; ind++) {
                        if (ra[ra.length > 1 ? ind : 0].indexOf("$") == 0) {
                            sa[ind] = "$" + sa[ind];
                        }
                        if (ra[ra.length > 1 ? ind : 0].lastIndexOf("$") != 0) {
                            for (var i = 0; i < sa[ind].length; i++) {
                                if (sa[ind].charAt(i).match(/[0-9]/gi)) {
                                    _s = i;
                                    break;
                                }
                            }
                            sa[ind] = sa[ind].substr(0, _s) + "$" + sa[ind].substr(_s, sa[ind].length);
                        }
                    }
                    s = "";
                    sa.forEach(function (e, i) {
                        s += (i != 0 ? ":": "");
                        s += e;
                    });
                }
            }
            editor.changeCellRange(range, s);
            return true;
        },
        getActiveRange: function (ar) {
            if (ar.c1 === ar.c2 && ar.r1 === ar.r2) {
                return this._getCellTitle(ar.c1, ar.r1);
            }
            if (ar.c1 === ar.c2 && ar.r1 === 0 && ar.r2 === this.rows.length - 1) {
                var ct = this._getColumnTitle(ar.c1);
                return ct + ":" + ct;
            }
            if (ar.r1 === ar.r2 && ar.c1 === 0 && ar.c2 === this.cols.length - 1) {
                var rt = this._getRowTitle(ar.r1);
                return rt + ":" + rt;
            }
            if (ar.r1 === 0 && ar.r2 === gc_nMaxRow0 || ar.r1 === 1 && ar.r2 === gc_nMaxRow) {
                return this._getColumnTitle(ar.c1) + ":" + this._getColumnTitle(ar.c2);
            }
            if (ar.c1 === 0 && ar.c2 === gc_nMaxCol0 || ar.c1 === 1 && ar.c2 === gc_nMaxCol) {
                return this._getRowTitle(ar.r1) + ":" + this._getRowTitle(ar.r2);
            }
            return this._getCellTitle(ar.c1, ar.r1) + ":" + this._getCellTitle(ar.c2, ar.r2);
        },
        addFormulaRange: function (range) {
            var r = range !== undefined ? range : this.activeRange.clone(true);
            if (r.startCol === undefined || r.startRow === undefined) {
                r.startCol = r.c1;
                r.startRow = r.r1;
            }
            this.arrActiveFormulaRanges.push(r);
        },
        changeFormulaRange: function (range) {
            for (var i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
                if (this.arrActiveFormulaRanges[i].isEqual(range)) {
                    var r = this.arrActiveFormulaRanges[i];
                    this.arrActiveFormulaRanges.splice(i, 1);
                    this.arrActiveFormulaRanges.push(r);
                    return;
                }
            }
        },
        cleanFormulaRanges: function () {
            this.arrActiveFormulaRanges = [];
        },
        addAutoFilter: function (lTable, addFormatTableOptionsObj) {
            var t = this;
            var ar = t.activeRange.clone(true);
            var onChangeAutoFilterCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                return t.autoFilters.addAutoFilter(lTable, ar, undefined, false, addFormatTableOptionsObj);
            };
            this._isLockedAll(onChangeAutoFilterCallback);
        },
        applyAutoFilter: function (type, autoFilterObject) {
            var t = this;
            var ar = t.activeRange.clone(true);
            var onChangeAutoFilterCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                t.autoFilters.applyAutoFilter(type, autoFilterObject, ar);
            };
            this._isLockedAll(onChangeAutoFilterCallback);
        },
        sortColFilter: function (type, cellId) {
            var t = this;
            var ar = this.activeRange.clone(true);
            var onChangeAutoFilterCallback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }
                return t.autoFilters.sortColFilter(type, cellId, ar);
            };
            this._isLockedAll(onChangeAutoFilterCallback);
        },
        getAddFormatTableOptions: function (nameOption) {
            var ar = this.activeRange.clone(true);
            var t = this;
            var result = t.autoFilters.getAddFormatTableOptions(ar);
            return result;
        },
        _loadFonts: function (fontArr, callback) {
            var originFonts = [];
            var i, n, k = 0;
            for (i = 0; i < fontArr.length; ++i) {
                for (n = 0; n < fontArr[i].length; ++n) {
                    if (-1 == $.inArray(fontArr[i][n], originFonts)) {
                        originFonts[k] = fontArr[i][n];
                        k++;
                    }
                }
            }
            var api = window["Asc"]["editor"];
            api._loadFonts(originFonts, callback);
        }
    };
    window["Asc"].WorksheetView = WorksheetView;
})(jQuery, window);