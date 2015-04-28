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
 "use strict";
(function ($, window, undefined) {
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var prot;
    var kLeftLim1 = 0.999999999999999;
    var MAX_EXCEL_INT = 1e+308;
    var MIN_EXCEL_INT = -MAX_EXCEL_INT;
    var kUndefinedL = "undefined";
    var kNullL = "null";
    var kObjectL = "object";
    var kFunctionL = "function";
    var kNumberL = "number";
    var kArrayL = "array";
    function applyFunction(callback) {
        if (kFunctionL === typeof callback) {
            callback.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    }
    function typeOf(obj) {
        if (obj === undefined) {
            return kUndefinedL;
        }
        if (obj === null) {
            return kNullL;
        }
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
    function lastIndexOf(s, regExp, fromIndex) {
        var end = fromIndex >= 0 && fromIndex <= s.length ? fromIndex : s.length;
        for (var i = end - 1; i >= 0; --i) {
            var j = s.slice(i, end).search(regExp);
            if (j >= 0) {
                return i + j;
            }
        }
        return -1;
    }
    function search(arr, fn) {
        for (var i = 0; i < arr.length; ++i) {
            if (fn(arr[i])) {
                return i;
            }
        }
        return -1;
    }
    function getUniqueRangeColor(arrRanges, curElem, tmpColors) {
        var colorIndex, j, range = arrRanges[curElem];
        for (j = 0; j < curElem; ++j) {
            if (range.isEqual(arrRanges[j])) {
                colorIndex = tmpColors[j];
                break;
            }
        }
        return colorIndex;
    }
    function getMinValueOrNull(val1, val2) {
        return null === val2 ? val1 : (null === val1 ? val2 : Math.min(val1, val2));
    }
    function round(x) {
        var y = x + (x >= 0 ? 0.5 : -0.5);
        return y | y;
    }
    function floor(x) {
        var y = x | x;
        y -= x < 0 && y > x ? 1 : 0;
        return y + (x - y > kLeftLim1 ? 1 : 0);
    }
    function ceil(x) {
        var y = x | x;
        y += x > 0 && y < x ? 1 : 0;
        return y - (y - x > kLeftLim1 ? 1 : 0);
    }
    function incDecFonSize(bIncrease, oValue) {
        var aSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        var nLength = aSizes.length;
        var i;
        if (true === bIncrease) {
            if (oValue >= aSizes[nLength - 1]) {
                return null;
            }
            for (i = 0; i < nLength; ++i) {
                if (aSizes[i] > oValue) {
                    break;
                }
            }
        } else {
            if (oValue <= aSizes[0]) {
                return null;
            }
            for (i = nLength - 1; i >= 0; --i) {
                if (aSizes[i] < oValue) {
                    break;
                }
            }
        }
        return aSizes[i];
    }
    function profileTime(fn) {
        var start, end, arg = [],
        i;
        if (arguments.length) {
            if (arguments.length > 1) {
                for (i = 1; i < arguments.length; ++i) {
                    arg.push(arguments[i]);
                }
                start = new Date();
                fn.apply(window, arg);
                end = new Date();
            } else {
                start = new Date();
                fn();
                end = new Date();
            }
            return end.getTime() - start.getTime();
        }
        return undefined;
    }
    function Range(c1, r1, c2, r2, normalize) {
        if (! (this instanceof Range)) {
            return new Range(c1, r1, c2, r2, normalize);
        }
        this.c1 = c1;
        this.r1 = r1;
        this.c2 = c2;
        this.r2 = r2;
        this.r1Abs = false;
        this.c1Abs = false;
        this.r2Abs = false;
        this.c2Abs = false;
        return normalize ? this.normalize() : this;
    }
    Range.prototype = {
        constructor: Range,
        assign: function (c1, r1, c2, r2, normalize) {
            if (typeOf(c1) !== kNumberL || typeOf(c2) !== kNumberL || typeOf(r1) !== kNumberL || typeOf(r2) !== kNumberL) {
                throw "Error: range.assign(" + c1 + "," + r1 + "," + c2 + "," + r2 + ") - numerical args are expected";
            }
            this.c1 = c1;
            this.r1 = r1;
            this.c2 = c2;
            this.r2 = r2;
            return normalize ? this.normalize() : this;
        },
        assign2: function (range) {
            return this.assign(range.c1, range.r1, range.c2, range.r2);
        },
        clone: function (normalize) {
            var oRes = new Range(this.c1, this.r1, this.c2, this.r2, normalize);
            oRes.r1Abs = this.r1Abs;
            oRes.c1Abs = this.c1Abs;
            oRes.r2Abs = this.r2Abs;
            oRes.c2Abs = this.c2Abs;
            return oRes;
        },
        normalize: function () {
            var tmp;
            if (this.c1 > this.c2) {
                tmp = this.c1;
                this.c1 = this.c2;
                this.c2 = tmp;
            }
            if (this.r1 > this.r2) {
                tmp = this.r1;
                this.r1 = this.r2;
                this.r2 = tmp;
            }
            return this;
        },
        isEqual: function (range) {
            return range && this.c1 === range.c1 && this.r1 === range.r1 && this.c2 === range.c2 && this.r2 === range.r2;
        },
        isEqualAll: function (range) {
            return this.isEqual(range) && this.r1Abs === range.r1Abs && this.r2Abs === range.r2Abs && this.c1Abs === range.c1Abs && this.c2Abs === range.c2Abs;
        },
        contains: function (c, r) {
            return this.c1 <= c && c <= this.c2 && this.r1 <= r && r <= this.r2;
        },
        containsRange: function (range) {
            return this.contains(range.c1, range.r1) && this.contains(range.c2, range.r2);
        },
        intersection: function (range) {
            var s1 = this.clone(true),
            s2 = range instanceof Range ? range.clone(true) : new Range(range.c1, range.r1, range.c2, range.r2, true);
            if (s2.c1 > s1.c2 || s2.c2 < s1.c1 || s2.r1 > s1.r2 || s2.r2 < s1.r1) {
                return null;
            }
            return new Range(s2.c1 >= s1.c1 && s2.c1 <= s1.c2 ? s2.c1 : s1.c1, s2.r1 >= s1.r1 && s2.r1 <= s1.r2 ? s2.r1 : s1.r1, Math.min(s1.c2, s2.c2), Math.min(s1.r2, s2.r2));
        },
        intersectionSimple: function (range) {
            var oRes = null;
            var r1 = Math.max(this.r1, range.r1);
            var c1 = Math.max(this.c1, range.c1);
            var r2 = Math.min(this.r2, range.r2);
            var c2 = Math.min(this.c2, range.c2);
            if (r1 <= r2 && c1 <= c2) {
                oRes = new Range(c1, r1, c2, r2);
            }
            return oRes;
        },
        isIntersect: function (range) {
            var bRes = true;
            if (range.r2 < this.r1 || this.r2 < range.r1) {
                bRes = false;
            } else {
                if (range.c2 < this.c1 || this.c2 < range.c1) {
                    bRes = false;
                }
            }
            return bRes;
        },
        isOneCell: function () {
            return this.r1 == this.r2 && this.c1 == this.c2;
        },
        union: function (range) {
            var s1 = this.clone(true),
            s2 = range instanceof Range ? range.clone(true) : new Range(range.c1, range.r1, range.c2, range.r2, true);
            return new Range(Math.min(s1.c1, s2.c1), Math.min(s1.r1, s2.r1), Math.max(s1.c2, s2.c2), Math.max(s1.r2, s2.r2));
        },
        union2: function (range) {
            this.c1 = Math.min(this.c1, range.c1);
            this.c2 = Math.max(this.c2, range.c2);
            this.r1 = Math.min(this.r1, range.r1);
            this.r2 = Math.max(this.r2, range.r2);
        },
        setOffset: function (offset) {
            this.setOffsetFirst(offset);
            this.setOffsetLast(offset);
        },
        setOffsetFirst: function (offset) {
            this.c1 += offset.offsetCol;
            if (this.c1 < 0) {
                this.c1 = 0;
            }
            this.r1 += offset.offsetRow;
            if (this.r1 < 0) {
                this.r1 = 0;
            }
        },
        setOffsetLast: function (offset) {
            this.c2 += offset.offsetCol;
            if (this.c2 < 0) {
                this.c2 = 0;
            }
            this.r2 += offset.offsetRow;
            if (this.r2 < 0) {
                this.r2 = 0;
            }
        },
        getName: function () {
            var sRes = "";
            if (0 == this.c1 && gc_nMaxCol0 == this.c2 && false == this.c1Abs && false == this.c2Abs) {
                if (this.r1Abs) {
                    sRes += "$";
                }
                sRes += (this.r1 + 1) + ":";
                if (this.r2Abs) {
                    sRes += "$";
                }
                sRes += (this.r2 + 1);
            } else {
                if (0 == this.r1 && gc_nMaxRow0 == this.r2 && false == this.r1Abs && false == this.r2Abs) {
                    if (this.c1Abs) {
                        sRes += "$";
                    }
                    sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1) + ":";
                    if (this.c2Abs) {
                        sRes += "$";
                    }
                    sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
                } else {
                    if (this.c1Abs) {
                        sRes += "$";
                    }
                    sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1);
                    if (this.r1Abs) {
                        sRes += "$";
                    }
                    sRes += (this.r1 + 1);
                    if (!this.isOneCell()) {
                        sRes += ":";
                        if (this.c2Abs) {
                            sRes += "$";
                        }
                        sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
                        if (this.r2Abs) {
                            sRes += "$";
                        }
                        sRes += (this.r2 + 1);
                    }
                }
            }
            return sRes;
        },
        getAllRange: function () {
            var result;
            if (c_oAscSelectionType.RangeMax === this.type) {
                result = new Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
            } else {
                if (c_oAscSelectionType.RangeCol === this.type) {
                    result = new Range(this.c1, 0, this.c2, gc_nMaxRow0);
                } else {
                    if (c_oAscSelectionType.RangeRow === this.type) {
                        result = new Range(0, this.r1, gc_nMaxCol0, this.r2);
                    } else {
                        result = this.clone();
                    }
                }
            }
            return result;
        }
    };
    function ActiveRange() {
        if (1 == arguments.length) {
            var range = arguments[0];
            ActiveRange.superclass.constructor.call(this, range.c1, range.r1, range.c2, range.r2);
            this.r1Abs = range.r1Abs;
            this.c1Abs = range.c1Abs;
            this.r2Abs = range.r2Abs;
            this.c2Abs = range.c2Abs;
        } else {
            if (arguments.length > 1) {
                ActiveRange.superclass.constructor.apply(this, arguments);
            } else {
                ActiveRange.superclass.constructor.call(this, 0, 0, 0, 0);
            }
        }
        this.type = c_oAscSelectionType.RangeCells;
        this.startCol = 0;
        this.startRow = 0;
        this._updateAdditionalData();
    }
    asc.extendClass(ActiveRange, Range);
    ActiveRange.prototype.assign = function () {
        ActiveRange.superclass.assign.apply(this, arguments);
        this._updateAdditionalData();
        return this;
    };
    ActiveRange.prototype.assign2 = function () {
        ActiveRange.superclass.assign2.apply(this, arguments);
        this._updateAdditionalData();
        return this;
    };
    ActiveRange.prototype.clone = function () {
        var oRes = new ActiveRange(ActiveRange.superclass.clone.apply(this, arguments));
        oRes.type = this.type;
        oRes.startCol = this.startCol;
        oRes.startRow = this.startRow;
        return oRes;
    };
    ActiveRange.prototype.normalize = function () {
        ActiveRange.superclass.normalize.apply(this, arguments);
        this._updateAdditionalData();
        return this;
    };
    ActiveRange.prototype.isEqualAll = function () {
        var bRes = ActiveRange.superclass.isEqual.apply(this, arguments);
        if (bRes && arguments.length > 0) {
            var range = arguments[0];
            bRes = this.type == range.type && this.startCol == range.startCol && this.startRow == range.startRow;
        }
        return bRes;
    };
    ActiveRange.prototype.contains = function () {
        return ActiveRange.superclass.contains.apply(this, arguments);
    };
    ActiveRange.prototype.containsRange = function () {
        return ActiveRange.superclass.containsRange.apply(this, arguments);
    };
    ActiveRange.prototype.intersection = function () {
        var oRes = ActiveRange.superclass.intersection.apply(this, arguments);
        if (null != oRes) {
            oRes = new ActiveRange(oRes);
            oRes._updateAdditionalData();
        }
        return oRes;
    };
    ActiveRange.prototype.intersectionSimple = function () {
        var oRes = ActiveRange.superclass.intersectionSimple.apply(this, arguments);
        if (null != oRes) {
            oRes = new ActiveRange(oRes);
            oRes._updateAdditionalData();
        }
        return oRes;
    };
    ActiveRange.prototype.union = function () {
        var oRes = new ActiveRange(ActiveRange.superclass.union.apply(this, arguments));
        oRes._updateAdditionalData();
        return oRes;
    };
    ActiveRange.prototype.union2 = function () {
        ActiveRange.superclass.union2.apply(this, arguments);
        this._updateAdditionalData();
        return this;
    };
    ActiveRange.prototype.setOffset = function (offset) {
        this.setOffsetFirst(offset);
        this.setOffsetLast(offset);
    };
    ActiveRange.prototype.setOffsetFirst = function (offset) {
        ActiveRange.superclass.setOffsetFirst.apply(this, arguments);
        this._updateAdditionalData();
        return this;
    };
    ActiveRange.prototype.setOffsetLast = function (offset) {
        ActiveRange.superclass.setOffsetLast.apply(this, arguments);
        this._updateAdditionalData();
        return this;
    };
    ActiveRange.prototype._updateAdditionalData = function () {
        if (!this.contains(this.startCol, this.startRow)) {
            this.startCol = this.c1;
            this.startRow = this.r1;
        }
    };
    function FormulaRange() {
        if (1 == arguments.length) {
            var range = arguments[0];
            FormulaRange.superclass.constructor.call(this, range.c1, range.r1, range.c2, range.r2);
        } else {
            if (arguments.length > 1) {
                FormulaRange.superclass.constructor.apply(this, arguments);
            } else {
                FormulaRange.superclass.constructor.call(this, 0, 0, 0, 0);
            }
        }
        this.r1Abs = false;
        this.c1Abs = false;
        this.r2Abs = false;
        this.c2Abs = false;
    }
    asc.extendClass(FormulaRange, Range);
    FormulaRange.prototype.clone = function () {
        var oRes = new FormulaRange(FormulaRange.superclass.clone.apply(this, arguments));
        oRes.r1Abs = this.r1Abs;
        oRes.c1Abs = this.c1Abs;
        oRes.r2Abs = this.r2Abs;
        oRes.c2Abs = this.c2Abs;
        return oRes;
    };
    FormulaRange.prototype.intersection = function () {
        var oRes = FormulaRange.superclass.intersection.apply(this, arguments);
        if (null != oRes) {
            oRes = new FormulaRange(oRes);
        }
        return oRes;
    };
    FormulaRange.prototype.intersectionSimple = function () {
        var oRes = FormulaRange.superclass.intersectionSimple.apply(this, arguments);
        if (null != oRes) {
            oRes = new FormulaRange(oRes);
        }
        return oRes;
    };
    FormulaRange.prototype.union = function () {
        return new FormulaRange(FormulaRange.superclass.union.apply(this, arguments));
    };
    FormulaRange.prototype.getName = function () {
        var sRes = "";
        if (0 == this.c1 && gc_nMaxCol0 == this.c2) {
            if (this.r1Abs) {
                sRes += "$";
            }
            sRes += (this.r1 + 1) + ":";
            if (this.r2Abs) {
                sRes += "$";
            }
            sRes += (this.r2 + 1);
        } else {
            if (0 == this.r1 && gc_nMaxRow0 == this.r2) {
                if (this.c1Abs) {
                    sRes += "$";
                }
                sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1) + ":";
                if (this.c2Abs) {
                    sRes += "$";
                }
                sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
            } else {
                if (this.c1Abs) {
                    sRes += "$";
                }
                sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1);
                if (this.r1Abs) {
                    sRes += "$";
                }
                sRes += (this.r1 + 1);
                if (!this.isOneCell()) {
                    sRes += ":";
                    if (this.c2Abs) {
                        sRes += "$";
                    }
                    sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
                    if (this.r2Abs) {
                        sRes += "$";
                    }
                    sRes += (this.r2 + 1);
                }
            }
        }
        return sRes;
    };
    function VisibleRange(visibleRange, offsetX, offsetY) {
        this.visibleRange = visibleRange;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    function RangeCache() {
        this.oCache = {};
    }
    RangeCache.prototype = {
        getAscRange: function (sRange) {
            return this._getRange(sRange, 1);
        },
        getActiveRange: function (sRange) {
            return this._getRange(sRange, 2);
        },
        getFormulaRange: function (sRange) {
            return this._getRange(sRange, 3);
        },
        _getRange: function (sRange, type) {
            var oRes = null;
            var oCacheVal = this.oCache[sRange];
            if (null == oCacheVal) {
                var oFirstAddr, oLastAddr;
                var bIsSingle = true;
                var nIndex = sRange.indexOf(":");
                if (-1 != nIndex) {
                    bIsSingle = false;
                    oFirstAddr = g_oCellAddressUtils.getCellAddress(sRange.substring(0, nIndex));
                    oLastAddr = g_oCellAddressUtils.getCellAddress(sRange.substring(nIndex + 1));
                } else {
                    oFirstAddr = oLastAddr = g_oCellAddressUtils.getCellAddress(sRange);
                }
                oCacheVal = {
                    first: null,
                    last: null,
                    ascRange: null,
                    formulaRange: null,
                    activeRange: null
                };
                if (oFirstAddr.isValid() && oLastAddr.isValid() && (!bIsSingle || (!oFirstAddr.getIsRow() && !oFirstAddr.getIsCol()))) {
                    oCacheVal.first = oFirstAddr;
                    oCacheVal.last = oLastAddr;
                }
                this.oCache[sRange] = oCacheVal;
            }
            if (1 == type) {
                oRes = oCacheVal.ascRange;
            } else {
                if (2 == type) {
                    oRes = oCacheVal.activeRange;
                } else {
                    oRes = oCacheVal.formulaRange;
                }
            }
            if (null == oRes && null != oCacheVal.first && null != oCacheVal.last) {
                var r1 = oCacheVal.first.getRow0(),
                r2 = oCacheVal.last.getRow0(),
                c1 = oCacheVal.first.getCol0(),
                c2 = oCacheVal.last.getCol0();
                if (oCacheVal.first.getIsRow() && oCacheVal.last.getIsRow()) {
                    c1 = 0;
                    c2 = gc_nMaxCol0;
                }
                if (oCacheVal.first.getIsCol() && oCacheVal.last.getIsCol()) {
                    r1 = 0;
                    r2 = gc_nMaxRow0;
                }
                if (r1 > r2) {
                    var temp = r1;
                    r1 = r2;
                    r2 = temp;
                }
                if (c1 > c2) {
                    var temp = c1;
                    c1 = c2;
                    c2 = temp;
                }
                if (1 == type) {
                    if (null == oCacheVal.ascRange) {
                        var oAscRange = new Asc.Range(c1, r1, c2, r2);
                        oAscRange.r1Abs = oCacheVal.first.getRowAbs();
                        oAscRange.c1Abs = oCacheVal.first.getColAbs();
                        oAscRange.r2Abs = oCacheVal.last.getRowAbs();
                        oAscRange.c2Abs = oCacheVal.last.getColAbs();
                        oCacheVal.ascRange = oAscRange;
                    }
                    oRes = oCacheVal.ascRange;
                } else {
                    if (2 == type) {
                        if (null == oCacheVal.activeRange) {
                            var oActiveRange = new Asc.ActiveRange(c1, r1, c2, r2);
                            oActiveRange.r1Abs = oCacheVal.first.getRowAbs();
                            oActiveRange.c1Abs = oCacheVal.first.getColAbs();
                            oActiveRange.r2Abs = oCacheVal.last.getRowAbs();
                            oActiveRange.c2Abs = oCacheVal.last.getColAbs();
                            var bCol = 0 == r1 && gc_nMaxRow0 == r2;
                            var bRow = 0 == c1 && gc_nMaxCol0 == c2;
                            if (bCol && bRow) {
                                oActiveRange.type = c_oAscSelectionType.RangeMax;
                            } else {
                                if (bCol) {
                                    oActiveRange.type = c_oAscSelectionType.RangeCol;
                                } else {
                                    if (bRow) {
                                        oActiveRange.type = c_oAscSelectionType.RangeRow;
                                    } else {
                                        oActiveRange.type = c_oAscSelectionType.RangeCells;
                                    }
                                }
                            }
                            oActiveRange.startCol = oActiveRange.c1;
                            oActiveRange.startRow = oActiveRange.r1;
                            oCacheVal.activeRange = oActiveRange;
                        }
                        oRes = oCacheVal.activeRange;
                    } else {
                        if (null == oCacheVal.formulaRange) {
                            var oFormulaRange = new Asc.FormulaRange(c1, r1, c2, r2);
                            oFormulaRange.r1Abs = oCacheVal.first.getRowAbs();
                            oFormulaRange.c1Abs = oCacheVal.first.getColAbs();
                            oFormulaRange.r2Abs = oCacheVal.last.getRowAbs();
                            oFormulaRange.c2Abs = oCacheVal.last.getColAbs();
                            oCacheVal.formulaRange = oFormulaRange;
                        }
                        oRes = oCacheVal.formulaRange;
                    }
                }
            }
            return oRes;
        }
    };
    var g_oRangeCache = new RangeCache();
    function HandlersList(handlers) {
        if (! (this instanceof HandlersList)) {
            return new HandlersList(handlers);
        }
        this.handlers = handlers || {};
        return this;
    }
    HandlersList.prototype = {
        constructor: HandlersList,
        trigger: function (eventName) {
            var h = this.handlers[eventName],
            t = typeOf(h),
            a = Array.prototype.slice.call(arguments, 1),
            i;
            if (t === kFunctionL) {
                return h.apply(this, a);
            }
            if (t === kArrayL) {
                for (i = 0; i < h.length; i += 1) {
                    if (typeOf(h[i]) === kFunctionL) {
                        h[i].apply(this, a);
                    }
                }
                return true;
            }
            return false;
        },
        add: function (eventName, eventHandler, replaceOldHandler) {
            var th = this.handlers,
            h, old, t;
            if (replaceOldHandler || !th.hasOwnProperty(eventName)) {
                th[eventName] = eventHandler;
            } else {
                old = h = th[eventName];
                t = typeOf(old);
                if (t !== kArrayL) {
                    h = th[eventName] = [];
                    if (t === kFunctionL) {
                        h.push(old);
                    }
                }
                h.push(eventHandler);
            }
        },
        remove: function (eventName, eventHandler) {
            var th = this.handlers,
            h = th[eventName],
            i;
            if (th.hasOwnProperty(eventName)) {
                if (typeOf(h) !== kArrayL || typeOf(eventHandler) !== kFunctionL) {
                    delete th[eventName];
                    return true;
                }
                for (i = h.length - 1; i >= 0; i -= 1) {
                    if (h[i] === eventHandler) {
                        delete h[i];
                        return true;
                    }
                }
            }
            return false;
        }
    };
    function outputDebugStr(channel) {
        var c = window.console;
        if (asc.g_debug_mode && c && c[channel] && c[channel].apply) {
            c[channel].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
    function trim(val) {
        if (!String.prototype.trim) {
            return val.trim();
        } else {
            return val.replace(/^\s+|\s+$/g, "");
        }
    }
    function isNumber(val) {
        var valTrim = trim(val);
        return (valTrim - 0) == valTrim && valTrim.length > 0;
    }
    function isNumberInfinity(val) {
        var valTrim = trim(val);
        var valInt = valTrim - 0;
        return valInt == valTrim && valTrim.length > 0 && MIN_EXCEL_INT < valInt && valInt < MAX_EXCEL_INT;
    }
    function arrayToLowerCase(array) {
        var result = [];
        for (var i = 0, length = array.length; i < length; ++i) {
            result.push(array[i].toLowerCase());
        }
        return result;
    }
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
    function getEndValueRange(dx, start, v1, v2) {
        var x1, x2;
        if (0 !== dx) {
            if (start === v1) {
                x1 = v1;
                x2 = v2;
            } else {
                if (start === v2) {
                    x1 = v2;
                    x2 = v1;
                } else {
                    if (0 > dx) {
                        x1 = v2;
                        x2 = v1;
                    } else {
                        x1 = v1;
                        x2 = v2;
                    }
                }
            }
        } else {
            x1 = v1;
            x2 = v2;
        }
        return {
            x1: x1,
            x2: x2
        };
    }
    function asc_CMouseMoveData(obj) {
        if (! (this instanceof asc_CMouseMoveData)) {
            return new asc_CMouseMoveData(obj);
        }
        if (obj) {
            this.type = obj.type;
            this.x = obj.x;
            this.reverseX = obj.reverseX;
            this.y = obj.y;
            this.hyperlink = obj.hyperlink;
            this.aCommentIndexes = obj.aCommentIndexes;
            this.userId = obj.userId;
            this.lockedObjectType = obj.lockedObjectType;
            this.sizeCCOrPt = obj.sizeCCOrPt;
            this.sizePx = obj.sizePx;
        }
        return this;
    }
    asc_CMouseMoveData.prototype = {
        constructor: asc_CMouseMoveData,
        asc_getType: function () {
            return this.type;
        },
        asc_getX: function () {
            return this.x;
        },
        asc_getReverseX: function () {
            return this.reverseX;
        },
        asc_getY: function () {
            return this.y;
        },
        asc_getHyperlink: function () {
            return this.hyperlink;
        },
        asc_getCommentIndexes: function () {
            return this.aCommentIndexes;
        },
        asc_getUserId: function () {
            return this.userId;
        },
        asc_getLockedObjectType: function () {
            return this.lockedObjectType;
        },
        asc_getSizeCCOrPt: function () {
            return this.sizeCCOrPt;
        },
        asc_getSizePx: function () {
            return this.sizePx;
        }
    };
    function asc_CHyperlink(obj) {
        if (! (this instanceof asc_CHyperlink)) {
            return new asc_CHyperlink(obj);
        }
        this.hyperlinkModel = null != obj ? obj : new Hyperlink();
        this.text = null;
        return this;
    }
    asc_CHyperlink.prototype = {
        constructor: asc_CHyperlink,
        asc_getType: function () {
            return this.hyperlinkModel.getHyperlinkType();
        },
        asc_getHyperlinkUrl: function () {
            return this.hyperlinkModel.Hyperlink;
        },
        asc_getTooltip: function () {
            return this.hyperlinkModel.Tooltip;
        },
        asc_getLocation: function () {
            return this.hyperlinkModel.getLocation();
        },
        asc_getSheet: function () {
            return this.hyperlinkModel.LocationSheet;
        },
        asc_getRange: function () {
            return this.hyperlinkModel.LocationRange;
        },
        asc_getText: function () {
            return this.text;
        },
        asc_setType: function (val) {
            switch (val) {
            case c_oAscHyperlinkType.WebLink:
                this.hyperlinkModel.setLocation(null);
                break;
            case c_oAscHyperlinkType.RangeLink:
                this.hyperlinkModel.Hyperlink = null;
                break;
            }
        },
        asc_setHyperlinkUrl: function (val) {
            this.hyperlinkModel.Hyperlink = val;
        },
        asc_setTooltip: function (val) {
            this.hyperlinkModel.Tooltip = val ? val.slice(0, c_oAscMaxTooltipLength) : val;
        },
        asc_setLocation: function (val) {
            this.hyperlinkModel.setLocation(val);
        },
        asc_setSheet: function (val) {
            this.hyperlinkModel.setLocationSheet(val);
        },
        asc_setRange: function (val) {
            this.hyperlinkModel.setLocationRange(val);
        },
        asc_setText: function (val) {
            this.text = val;
        }
    };
    function asc_CPageMargins(obj) {
        if (! (this instanceof asc_CPageMargins)) {
            return new asc_CPageMargins(obj);
        }
        if (obj) {
            this.left = obj.left;
            this.right = obj.right;
            this.top = obj.top;
            this.bottom = obj.bottom;
        }
        return this;
    }
    asc_CPageMargins.prototype = {
        asc_getLeft: function () {
            return this.left;
        },
        asc_getRight: function () {
            return this.right;
        },
        asc_getTop: function () {
            return this.top;
        },
        asc_getBottom: function () {
            return this.bottom;
        },
        asc_setLeft: function (val) {
            this.left = val;
        },
        asc_setRight: function (val) {
            this.right = val;
        },
        asc_setTop: function (val) {
            this.top = val;
        },
        asc_setBottom: function (val) {
            this.bottom = val;
        }
    };
    function asc_CPageSetup(obj) {
        if (! (this instanceof asc_CPageSetup)) {
            return new asc_CPageSetup(obj);
        }
        if (obj) {
            this.orientation = obj.orientation;
            this.width = obj.width;
            this.height = obj.height;
        }
        return this;
    }
    asc_CPageSetup.prototype = {
        asc_getOrientation: function () {
            return this.orientation;
        },
        asc_getWidth: function () {
            return this.width;
        },
        asc_getHeight: function () {
            return this.height;
        },
        asc_setOrientation: function (val) {
            this.orientation = val;
        },
        asc_setWidth: function (val) {
            this.width = val;
        },
        asc_setHeight: function (val) {
            this.height = val;
        }
    };
    function asc_CPageOptions(obj) {
        if (! (this instanceof asc_CPageOptions)) {
            return new asc_CPageOptions(obj);
        }
        if (obj) {
            this.pageMargins = obj.pageMargins;
            this.pageSetup = obj.pageSetup;
            this.gridLines = obj.gridLines;
            this.headings = obj.headings;
        }
        return this;
    }
    asc_CPageOptions.prototype = {
        asc_getPageMargins: function () {
            return this.pageMargins;
        },
        asc_getPageSetup: function () {
            return this.pageSetup;
        },
        asc_getGridLines: function () {
            return this.gridLines;
        },
        asc_getHeadings: function () {
            return this.headings;
        },
        asc_setPageMargins: function (val) {
            this.pageMargins = val;
        },
        asc_setPageSetup: function (val) {
            this.pageSetup = val;
        },
        asc_setGridLines: function (val) {
            this.gridLines = val;
        },
        asc_setHeadings: function (val) {
            this.headings = val;
        }
    };
    function CPagePrint() {
        if (! (this instanceof CPagePrint)) {
            return new CPagePrint();
        }
        this.pageWidth = 0;
        this.pageHeight = 0;
        this.pageClipRectLeft = 0;
        this.pageClipRectTop = 0;
        this.pageClipRectWidth = 0;
        this.pageClipRectHeight = 0;
        this.pageRange = null;
        this.leftFieldInPt = 0;
        this.topFieldInPt = 0;
        this.rightFieldInPt = 0;
        this.bottomFieldInPt = 0;
        this.pageGridLines = false;
        this.pageHeadings = false;
        this.indexWorksheet = -1;
        this.startOffset = 0;
        this.startOffsetPt = 0;
        return this;
    }
    function CPrintPagesData() {
        if (! (this instanceof CPrintPagesData)) {
            return new CPrintPagesData();
        }
        this.arrPages = null;
        this.currentIndex = 0;
        this.c_maxPagesCount = 10;
        return this;
    }
    function asc_CAdjustPrint() {
        if (! (this instanceof asc_CAdjustPrint)) {
            return new asc_CAdjustPrint();
        }
        this.printType = c_oAscPrintType.ActiveSheets;
        this.layoutPageType = c_oAscLayoutPageType.ActualSize;
        return this;
    }
    asc_CAdjustPrint.prototype = {
        constructor: asc_CAdjustPrint,
        asc_getPrintType: function () {
            return this.printType;
        },
        asc_getLayoutPageType: function () {
            return this.layoutPageType;
        },
        asc_setPrintType: function (val) {
            this.printType = val;
        },
        asc_setLayoutPageType: function (val) {
            this.layoutPageType = val;
        }
    };
    function asc_CLockInfo() {
        this["sheetId"] = null;
        this["type"] = null;
        this["subType"] = null;
        this["guid"] = null;
        this["rangeOrObjectId"] = null;
    }
    function asc_CCollaborativeRange(c1, r1, c2, r2) {
        this["c1"] = c1;
        this["r1"] = r1;
        this["c2"] = c2;
        this["r2"] = r2;
    }
    var g_oCSheetViewSettingsProperties = {
        showGridLines: 0,
        showRowColHeaders: 1
    };
    function asc_CSheetViewSettings() {
        if (! (this instanceof asc_CSheetViewSettings)) {
            return new asc_CSheetViewSettings();
        }
        this.Properties = g_oCSheetViewSettingsProperties;
        this.showGridLines = null;
        this.showRowColHeaders = null;
        this.pane = null;
        return this;
    }
    asc_CSheetViewSettings.prototype = {
        constructor: asc_CSheetViewSettings,
        clone: function () {
            var result = new asc_CSheetViewSettings();
            result.showGridLines = this.showGridLines;
            result.showRowColHeaders = this.showRowColHeaders;
            if (this.pane) {
                result.pane = this.pane.clone();
            }
            return result;
        },
        isEqual: function (settings) {
            return this.asc_getShowGridLines() === settings.asc_getShowGridLines() && this.asc_getShowRowColHeaders() === settings.asc_getShowRowColHeaders();
        },
        setSettings: function (settings) {
            this.showGridLines = settings.showGridLines;
            this.showRowColHeaders = settings.showRowColHeaders;
        },
        asc_getShowGridLines: function () {
            return false !== this.showGridLines;
        },
        asc_getShowRowColHeaders: function () {
            return false !== this.showRowColHeaders;
        },
        asc_getIsFreezePane: function () {
            return null !== this.pane && this.pane.isInit();
        },
        asc_setShowGridLines: function (val) {
            this.showGridLines = val;
        },
        asc_setShowRowColHeaders: function (val) {
            this.showRowColHeaders = val;
        },
        getType: function () {
            return UndoRedoDataTypes.SheetViewSettings;
        },
        getProperties: function () {
            return this.Properties;
        },
        getProperty: function (nType) {
            switch (nType) {
            case this.Properties.showGridLines:
                return this.showGridLines;
                break;
            case this.Properties.showRowColHeaders:
                return this.showRowColHeaders;
                break;
            }
        },
        setProperty: function (nType, value) {
            switch (nType) {
            case this.Properties.showGridLines:
                this.showGridLines = value;
                break;
            case this.Properties.showRowColHeaders:
                this.showRowColHeaders = value;
                break;
            }
        }
    };
    function asc_CPane() {
        if (! (this instanceof asc_CPane)) {
            return new asc_CPane();
        }
        this.state = null;
        this.topLeftCell = null;
        this.xSplit = 0;
        this.ySplit = 0;
        this.topLeftFrozenCell = null;
        return this;
    }
    asc_CPane.prototype.isInit = function () {
        return null !== this.topLeftFrozenCell;
    };
    asc_CPane.prototype.clone = function () {
        var res = new asc_CPane();
        res.state = this.state;
        res.topLeftCell = this.topLeftCell;
        res.xSplit = this.xSplit;
        res.ySplit = this.ySplit;
        res.topLeftFrozenCell = this.topLeftFrozenCell ? new CellAddress(this.topLeftFrozenCell.row, this.topLeftFrozenCell.col) : null;
        return res;
    };
    asc_CPane.prototype.init = function () {
        if ((c_oAscPaneState.Frozen === this.state || c_oAscPaneState.FrozenSplit === this.state) && (0 < this.xSplit || 0 < this.ySplit)) {
            this.topLeftFrozenCell = new CellAddress(this.ySplit, this.xSplit, 0);
            if (!this.topLeftFrozenCell.isValid()) {
                this.topLeftFrozenCell = null;
            }
        }
    };
    function RedoObjectParam() {
        if (! (this instanceof RedoObjectParam)) {
            return new RedoObjectParam();
        }
        this.bIsOn = false;
        this.bIsReInit = false;
        this.oChangeWorksheetUpdate = {};
        this.bUpdateWorksheetByModel = false;
        this.bOnSheetsChanged = false;
        this.oOnUpdateTabColor = {};
        this.oOnUpdateSheetViewSettings = {};
        this.bAddRemoveRowCol = false;
    }
    function asc_CStyleImage(name, thumbnailOffset, type) {
        this.name = name;
        this.thumbnailOffset = thumbnailOffset;
        this.type = type;
    }
    asc_CStyleImage.prototype = {
        constructor: asc_CStyleImage,
        asc_getName: function () {
            return this.name;
        },
        asc_getThumbnailOffset: function () {
            return this.thumbnailOffset;
        },
        asc_getType: function () {
            return this.type;
        }
    };
    function asc_CStylesPainter() {
        this.defaultStylesImage = "";
        this.defaultStyles = null;
        this.docStylesImage = "";
        this.docStyles = null;
        this.styleThumbnailWidth = 112;
        this.styleThumbnailHeight = 38;
        this.styleThumbnailWidthPt = this.styleThumbnailWidth * 72 / 96;
        this.styleThumbnailHeightPt = this.styleThumbnailHeight * 72 / 96;
        this.styleThumbnailWidthWithRetina = this.styleThumbnailWidth;
        this.styleThumbnailHeightWithRetina = this.styleThumbnailHeight;
        if (AscBrowser.isRetina) {
            this.styleThumbnailWidthWithRetina <<= 1;
            this.styleThumbnailHeightWithRetina <<= 1;
        }
    }
    asc_CStylesPainter.prototype = {
        constructor: asc_CStylesPainter,
        asc_getStyleThumbnailWidth: function () {
            return this.styleThumbnailWidthWithRetina;
        },
        asc_getStyleThumbnailHeight: function () {
            return this.styleThumbnailHeightWithRetina;
        },
        asc_getDefaultStyles: function () {
            return this.defaultStyles;
        },
        asc_getDocStyles: function () {
            return this.docStyles;
        },
        asc_getDefaultStylesImage: function () {
            return this.defaultStylesImage;
        },
        asc_getDocStylesImage: function () {
            return this.docStylesImage;
        },
        generateStylesAll: function (cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
            this.generateDefaultStyles(cellStylesAll, fmgrGraphics, oFont, stringRenderer);
            this.generateDocumentStyles(cellStylesAll, fmgrGraphics, oFont, stringRenderer);
        },
        generateDefaultStyles: function (cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
            var nDefaultStylesCount = cellStylesAll.getDefaultStylesCount();
            var cellStyles = cellStylesAll.DefaultStyles;
            var nLength = cellStyles.length;
            var oCanvas = document.createElement("canvas");
            oCanvas.width = this.styleThumbnailWidthWithRetina;
            oCanvas.height = nDefaultStylesCount * this.styleThumbnailHeightWithRetina;
            var oGraphics = new asc.DrawingContext({
                canvas: oCanvas,
                units: 1,
                fmgrGraphics: fmgrGraphics,
                font: oFont
            });
            var oStyle, oCustomStyle;
            this.defaultStyles = [];
            for (var i = 0, styleIndex = 0; i < nLength; ++i) {
                oStyle = cellStyles[i];
                if (oStyle.Hidden) {
                    continue;
                }
                oCustomStyle = cellStylesAll.getCustomStyleByBuiltinId(oStyle.BuiltinId);
                this.defaultStyles[i] = new asc_CStyleImage(oStyle.Name, styleIndex, c_oAscStyleImage.Default);
                this.drawStyle(oGraphics, stringRenderer, oCustomStyle || oStyle, oStyle.Name, styleIndex);
                ++styleIndex;
            }
            this.defaultStylesImage = (0 === styleIndex) ? "" : oCanvas.toDataURL("image/png");
        },
        generateDocumentStyles: function (cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
            var nDocumentStylesCount = cellStylesAll.getCustomStylesCount();
            var cellStyles = cellStylesAll.CustomStyles;
            var nLength = cellStyles.length;
            var oCanvas = document.createElement("canvas");
            oCanvas.width = this.styleThumbnailWidthWithRetina;
            oCanvas.height = nDocumentStylesCount * this.styleThumbnailHeightWithRetina;
            var oGraphics = new asc.DrawingContext({
                canvas: oCanvas,
                units: 1,
                fmgrGraphics: fmgrGraphics,
                font: oFont
            });
            var oStyle;
            this.docStyles = [];
            for (var i = 0, styleIndex = 0; i < nLength; ++i) {
                oStyle = cellStyles[i];
                if (oStyle.Hidden || null != oStyle.BuiltinId) {
                    continue;
                }
                this.docStyles[styleIndex] = new asc_CStyleImage(oStyle.Name, styleIndex, c_oAscStyleImage.Document);
                this.drawStyle(oGraphics, stringRenderer, oStyle, oStyle.Name, styleIndex);
                ++styleIndex;
            }
            this.docStylesImage = (0 === styleIndex) ? "" : oCanvas.toDataURL("image/png");
        },
        drawStyle: function (oGraphics, stringRenderer, oStyle, sStyleName, nIndex) {
            var nOffsetY = nIndex * this.styleThumbnailHeightPt;
            var oColor = oStyle.getFill();
            oGraphics.save().beginPath();
            if (null !== oColor) {
                oGraphics.setFillStyle(oColor);
            }
            oGraphics.rect(0, nOffsetY, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt).clip();
            if (null !== oColor) {
                oGraphics.fill();
            }
            var drawBorder = function (b, x1, y1, x2, y2) {
                if (null != b && c_oAscBorderStyles.None !== b.s) {
                    oGraphics.setStrokeStyle(b.c);
                    oGraphics.setLineWidth(b.w).beginPath().moveTo(x1, y1).lineTo(x2, y2).stroke();
                }
            };
            var oBorders = oStyle.getBorder();
            drawBorder(oBorders.l, 0, nOffsetY, 0, nOffsetY + this.styleThumbnailHeightPt);
            drawBorder(oBorders.r, this.styleThumbnailWidthPt, nOffsetY, this.styleThumbnailWidthPt, nOffsetY + this.styleThumbnailHeightPt);
            drawBorder(oBorders.t, 0, nOffsetY, this.styleThumbnailWidthPt, nOffsetY);
            drawBorder(oBorders.b, 0, nOffsetY + this.styleThumbnailHeightPt, this.styleThumbnailWidthPt, nOffsetY + this.styleThumbnailHeightPt);
            var fc = oStyle.getFontColor();
            var oFontColor = fc !== null ? fc : new CColor(0, 0, 0);
            var format = oStyle.getFont();
            var oFont = new asc.FontProperties(format.fn, (16 < format.fs) ? 16 : format.fs, format.b, format.i, format.u, format.s);
            var width_padding = 3;
            var tm = stringRenderer.measureString(sStyleName);
            var textY = 0.5 * (nOffsetY + (nOffsetY + this.styleThumbnailHeightPt) - tm.height);
            oGraphics.setFont(oFont);
            oGraphics.setFillStyle(oFontColor);
            oGraphics.fillText(sStyleName, width_padding, textY + tm.baseline);
            oGraphics.restore();
        }
    };
    function asc_CSheetPr() {
        if (! (this instanceof asc_CSheetPr)) {
            return new asc_CSheetPr();
        }
        this.CodeName = null;
        this.EnableFormatConditionsCalculation = null;
        this.FilterMode = null;
        this.Published = null;
        this.SyncHorizontal = null;
        this.SyncRef = null;
        this.SyncVertical = null;
        this.TransitionEntry = null;
        this.TransitionEvaluation = null;
        this.TabColor = null;
        return this;
    }
    asc_CSheetPr.prototype.clone = function () {
        var res = new asc_CSheetPr();
        res.CodeName = this.CodeName;
        res.EnableFormatConditionsCalculation = this.EnableFormatConditionsCalculation;
        res.FilterMode = this.FilterMode;
        res.Published = this.Published;
        res.SyncHorizontal = this.SyncHorizontal;
        res.SyncRef = this.SyncRef;
        res.SyncVertical = this.SyncVertical;
        res.TransitionEntry = this.TransitionEntry;
        res.TransitionEvaluation = this.TransitionEvaluation;
        if (this.TabColor) {
            res.TabColor = this.TabColor.clone();
        }
        return res;
    };
    function asc_CSelectionMathInfo() {
        this.count = 0;
        this.countNumbers = 0;
        this.sum = null;
        this.average = null;
        this.min = null;
        this.max = null;
    }
    asc_CSelectionMathInfo.prototype = {
        constructor: asc_CSelectionMathInfo,
        asc_getCount: function () {
            return this.count;
        },
        asc_getCountNumbers: function () {
            return this.countNumbers;
        },
        asc_getSum: function () {
            return this.sum;
        },
        asc_getAverage: function () {
            return this.average;
        },
        asc_getMin: function () {
            return this.min;
        },
        asc_getMax: function () {
            return this.max;
        }
    };
    function asc_CFindOptions() {
        this.findWhat = "";
        this.scanByRows = true;
        this.scanForward = true;
        this.isMatchCase = false;
        this.isWholeCell = false;
        this.scanOnOnlySheet = true;
        this.lookIn = c_oAscFindLookIn.Formulas;
        this.replaceWith = "";
        this.isReplaceAll = false;
        this.activeRange = null;
        this.indexInArray = 0;
        this.countFind = 0;
        this.countReplace = 0;
        this.countFindAll = 0;
        this.countReplaceAll = 0;
        this.sheetIndex = -1;
    }
    asc_CFindOptions.prototype.clone = function () {
        var result = new asc_CFindOptions();
        result.findWhat = this.findWhat;
        result.scanByRows = this.scanByRows;
        result.scanForward = this.scanForward;
        result.isMatchCase = this.isMatchCase;
        result.isWholeCell = this.isWholeCell;
        result.scanOnOnlySheet = this.scanOnOnlySheet;
        result.lookIn = this.lookIn;
        result.replaceWith = this.replaceWith;
        result.isReplaceAll = this.isReplaceAll;
        result.activeRange = this.activeRange ? this.activeRange.clone() : null;
        result.indexInArray = this.indexInArray;
        result.countFind = this.countFind;
        result.countReplace = this.countReplace;
        result.countFindAll = this.countFindAll;
        result.countReplaceAll = this.countReplaceAll;
        result.sheetIndex = this.sheetIndex;
        return result;
    };
    asc_CFindOptions.prototype.isEqual = function (obj) {
        return null != obj && this.findWhat === obj.findWhat && this.scanByRows === obj.scanByRows && this.scanForward === obj.scanForward && this.isMatchCase === obj.isMatchCase && this.isWholeCell === obj.isWholeCell && this.scanOnOnlySheet === obj.scanOnOnlySheet && this.lookIn === obj.lookIn;
    };
    asc_CFindOptions.prototype.clearFindAll = function () {
        this.countFindAll = 0;
        this.countReplaceAll = 0;
    };
    asc_CFindOptions.prototype.updateFindAll = function () {
        this.countFindAll += this.countFind;
        this.countReplaceAll += this.countReplace;
    };
    asc_CFindOptions.prototype.asc_setFindWhat = function (val) {
        this.findWhat = val;
    };
    asc_CFindOptions.prototype.asc_setScanByRows = function (val) {
        this.scanByRows = val;
    };
    asc_CFindOptions.prototype.asc_setScanForward = function (val) {
        this.scanForward = val;
    };
    asc_CFindOptions.prototype.asc_setIsMatchCase = function (val) {
        this.isMatchCase = val;
    };
    asc_CFindOptions.prototype.asc_setIsWholeCell = function (val) {
        this.isWholeCell = val;
    };
    asc_CFindOptions.prototype.asc_setScanOnOnlySheet = function (val) {
        this.scanOnOnlySheet = val;
    };
    asc_CFindOptions.prototype.asc_setLookIn = function (val) {
        this.lookIn = val;
    };
    asc_CFindOptions.prototype.asc_setReplaceWith = function (val) {
        this.replaceWith = val;
    };
    asc_CFindOptions.prototype.asc_setIsReplaceAll = function (val) {
        this.isReplaceAll = val;
    };
    window["Asc"].applyFunction = applyFunction;
    window["Asc"].typeOf = typeOf;
    window["Asc"].lastIndexOf = lastIndexOf;
    window["Asc"].search = search;
    window["Asc"].getUniqueRangeColor = getUniqueRangeColor;
    window["Asc"].getMinValueOrNull = getMinValueOrNull;
    window["Asc"].round = round;
    window["Asc"].floor = floor;
    window["Asc"].ceil = ceil;
    window["Asc"].incDecFonSize = incDecFonSize;
    window["Asc"].outputDebugStr = outputDebugStr;
    window["Asc"].profileTime = profileTime;
    window["Asc"].isNumber = isNumber;
    window["Asc"].isNumberInfinity = isNumberInfinity;
    window["Asc"].trim = trim;
    window["Asc"].arrayToLowerCase = arrayToLowerCase;
    window["Asc"].isFixedWidthCell = isFixedWidthCell;
    window["Asc"].truncFracPart = truncFracPart;
    window["Asc"].getEndValueRange = getEndValueRange;
    window["Asc"].Range = Range;
    window["Asc"].ActiveRange = ActiveRange;
    window["Asc"].FormulaRange = FormulaRange;
    window["Asc"].VisibleRange = VisibleRange;
    window["Asc"].g_oRangeCache = g_oRangeCache;
    window["Asc"].HandlersList = HandlersList;
    window["Asc"].RedoObjectParam = RedoObjectParam;
    window["Asc"]["asc_CMouseMoveData"] = window["Asc"].asc_CMouseMoveData = asc_CMouseMoveData;
    prot = asc_CMouseMoveData.prototype;
    prot["asc_getType"] = prot.asc_getType;
    prot["asc_getX"] = prot.asc_getX;
    prot["asc_getReverseX"] = prot.asc_getReverseX;
    prot["asc_getY"] = prot.asc_getY;
    prot["asc_getHyperlink"] = prot.asc_getHyperlink;
    prot["asc_getCommentIndexes"] = prot.asc_getCommentIndexes;
    prot["asc_getUserId"] = prot.asc_getUserId;
    prot["asc_getLockedObjectType"] = prot.asc_getLockedObjectType;
    prot["asc_getSizeCCOrPt"] = prot.asc_getSizeCCOrPt;
    prot["asc_getSizePx"] = prot.asc_getSizePx;
    window["Asc"]["asc_CHyperlink"] = window["Asc"].asc_CHyperlink = asc_CHyperlink;
    prot = asc_CHyperlink.prototype;
    prot["asc_getType"] = prot.asc_getType;
    prot["asc_getHyperlinkUrl"] = prot.asc_getHyperlinkUrl;
    prot["asc_getTooltip"] = prot.asc_getTooltip;
    prot["asc_getLocation"] = prot.asc_getLocation;
    prot["asc_getSheet"] = prot.asc_getSheet;
    prot["asc_getRange"] = prot.asc_getRange;
    prot["asc_getText"] = prot.asc_getText;
    prot["asc_setType"] = prot.asc_setType;
    prot["asc_setHyperlinkUrl"] = prot.asc_setHyperlinkUrl;
    prot["asc_setTooltip"] = prot.asc_setTooltip;
    prot["asc_setLocation"] = prot.asc_setLocation;
    prot["asc_setSheet"] = prot.asc_setSheet;
    prot["asc_setRange"] = prot.asc_setRange;
    prot["asc_setText"] = prot.asc_setText;
    window["Asc"]["asc_CPageMargins"] = window["Asc"].asc_CPageMargins = asc_CPageMargins;
    prot = asc_CPageMargins.prototype;
    prot["asc_getLeft"] = prot.asc_getLeft;
    prot["asc_getRight"] = prot.asc_getRight;
    prot["asc_getTop"] = prot.asc_getTop;
    prot["asc_getBottom"] = prot.asc_getBottom;
    prot["asc_setLeft"] = prot.asc_setLeft;
    prot["asc_setRight"] = prot.asc_setRight;
    prot["asc_setTop"] = prot.asc_setTop;
    prot["asc_setBottom"] = prot.asc_setBottom;
    window["Asc"]["asc_CPageSetup"] = window["Asc"].asc_CPageSetup = asc_CPageSetup;
    prot = asc_CPageSetup.prototype;
    prot["asc_getOrientation"] = prot.asc_getOrientation;
    prot["asc_getWidth"] = prot.asc_getWidth;
    prot["asc_getHeight"] = prot.asc_getHeight;
    prot["asc_setOrientation"] = prot.asc_setOrientation;
    prot["asc_setWidth"] = prot.asc_setWidth;
    prot["asc_setHeight"] = prot.asc_setHeight;
    window["Asc"]["asc_CPageOptions"] = window["Asc"].asc_CPageOptions = asc_CPageOptions;
    prot = asc_CPageOptions.prototype;
    prot["asc_getPageMargins"] = prot.asc_getPageMargins;
    prot["asc_getPageSetup"] = prot.asc_getPageSetup;
    prot["asc_getGridLines"] = prot.asc_getGridLines;
    prot["asc_getHeadings"] = prot.asc_getHeadings;
    prot["asc_setPageMargins"] = prot.asc_setPageMargins;
    prot["asc_setPageSetup"] = prot.asc_setPageSetup;
    prot["asc_setGridLines"] = prot.asc_setGridLines;
    prot["asc_setHeadings"] = prot.asc_setHeadings;
    window["Asc"].CPagePrint = CPagePrint;
    window["Asc"].CPrintPagesData = CPrintPagesData;
    window["Asc"]["asc_CAdjustPrint"] = window["Asc"].asc_CAdjustPrint = asc_CAdjustPrint;
    prot = asc_CAdjustPrint.prototype;
    prot["asc_getPrintType"] = prot.asc_getPrintType;
    prot["asc_getLayoutPageType"] = prot.asc_getLayoutPageType;
    prot["asc_setPrintType"] = prot.asc_setPrintType;
    prot["asc_setLayoutPageType"] = prot.asc_setLayoutPageType;
    window["Asc"].asc_CLockInfo = asc_CLockInfo;
    window["Asc"].asc_CCollaborativeRange = asc_CCollaborativeRange;
    window["Asc"]["asc_CSheetViewSettings"] = window["Asc"].asc_CSheetViewSettings = asc_CSheetViewSettings;
    prot = asc_CSheetViewSettings.prototype;
    prot["asc_getShowGridLines"] = prot.asc_getShowGridLines;
    prot["asc_getShowRowColHeaders"] = prot.asc_getShowRowColHeaders;
    prot["asc_getIsFreezePane"] = prot.asc_getIsFreezePane;
    prot["asc_setShowGridLines"] = prot.asc_setShowGridLines;
    prot["asc_setShowRowColHeaders"] = prot.asc_setShowRowColHeaders;
    window["Asc"]["asc_CPane"] = window["Asc"].asc_CPane = asc_CPane;
    window["Asc"]["asc_CStyleImage"] = window["Asc"].asc_CStyleImage = asc_CStyleImage;
    prot = asc_CStyleImage.prototype;
    prot["asc_getName"] = prot.asc_getName;
    prot["asc_getThumbnailOffset"] = prot.asc_getThumbnailOffset;
    prot["asc_getType"] = prot.asc_getType;
    window["Asc"]["asc_CStylesPainter"] = window["Asc"].asc_CStylesPainter = asc_CStylesPainter;
    prot = asc_CStylesPainter.prototype;
    prot["asc_getStyleThumbnailWidth"] = prot.asc_getStyleThumbnailWidth;
    prot["asc_getStyleThumbnailHeight"] = prot.asc_getStyleThumbnailHeight;
    prot["asc_getDefaultStyles"] = prot.asc_getDefaultStyles;
    prot["asc_getDocStyles"] = prot.asc_getDocStyles;
    prot["asc_getDefaultStylesImage"] = prot.asc_getDefaultStylesImage;
    prot["asc_getDocStylesImage"] = prot.asc_getDocStylesImage;
    window["Asc"]["asc_CSheetPr"] = window["Asc"].asc_CSheetPr = asc_CSheetPr;
    window["Asc"]["asc_CSelectionMathInfo"] = window["Asc"].asc_CSelectionMathInfo = asc_CSelectionMathInfo;
    prot = asc_CSelectionMathInfo.prototype;
    prot["asc_getCount"] = prot.asc_getCount;
    prot["asc_getCountNumbers"] = prot.asc_getCountNumbers;
    prot["asc_getSum"] = prot.asc_getSum;
    prot["asc_getAverage"] = prot.asc_getAverage;
    prot["asc_getMin"] = prot.asc_getMin;
    prot["asc_getMax"] = prot.asc_getMax;
    window["Asc"]["asc_CFindOptions"] = window["Asc"].asc_CFindOptions = asc_CFindOptions;
    prot = asc_CFindOptions.prototype;
    prot["asc_setFindWhat"] = prot.asc_setFindWhat;
    prot["asc_setScanByRows"] = prot.asc_setScanByRows;
    prot["asc_setScanForward"] = prot.asc_setScanForward;
    prot["asc_setIsMatchCase"] = prot.asc_setIsMatchCase;
    prot["asc_setIsWholeCell"] = prot.asc_setIsWholeCell;
    prot["asc_setScanOnOnlySheet"] = prot.asc_setScanOnOnlySheet;
    prot["asc_setLookIn"] = prot.asc_setLookIn;
    prot["asc_setReplaceWith"] = prot.asc_setReplaceWith;
    prot["asc_setIsReplaceAll"] = prot.asc_setIsReplaceAll;
})(jQuery, window);