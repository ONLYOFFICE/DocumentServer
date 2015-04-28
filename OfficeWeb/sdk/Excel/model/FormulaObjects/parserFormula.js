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
var cElementType = {
    number: 0,
    string: 1,
    bool: 2,
    error: 3,
    empty: 4,
    cellsRange: 5,
    cell: 6,
    date: 7,
    func: 8,
    operator: 9,
    name: 10,
    array: 11,
    cell3D: 12,
    cellsRange3D: 13
};
var cErrorType = {
    unsupported_function: 0,
    null_value: 1,
    division_by_zero: 2,
    wrong_value_type: 3,
    bad_reference: 4,
    wrong_name: 5,
    not_numeric: 6,
    not_available: 7,
    getting_data: 8
};
var cExcelSignificantDigits = 15,
cExcelMaxExponent = 308,
cExcelMinExponent = -308,
cExcelDateTimeDigits = 8,
c_Date1904Const = 24107,
c_Date1900Const = 25568,
c_DateCorrectConst = c_Date1900Const,
c_sPerDay = 86400,
c_msPerDay = c_sPerDay * 1000;
Date.prototype.excelNullDate1900 = Date.UTC(1899, 11, 30, 0, 0, 0);
Date.prototype.excelNullDate1904 = Date.UTC(1904, 0, 1, 0, 0, 0);
Date.prototype.getExcelNullDate = function () {
    return g_bDate1904 ? Date.prototype.excelNullDate1904 : Date.prototype.excelNullDate1900;
};
Date.prototype.isLeapYear = function () {
    var y = this.getUTCFullYear();
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
};
Date.prototype.getDaysInMonth = function () {
    return this.isLeapYear() ? this.getDaysInMonth.L[this.getMonth()] : this.getDaysInMonth.R[this.getMonth()];
};
Date.prototype.getDaysInMonth.R = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.prototype.getDaysInMonth.L = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.prototype.truncate = function () {
    this.setUTCHours(0, 0, 0, 0);
    return this;
};
Date.prototype.getExcelDate = function () {
    var year = this.getUTCFullYear(),
    month = this.getUTCMonth(),
    date = this.getUTCDate(),
    res;
    if (1900 < year || (1900 == year && 1 < month)) {
        res = (Date.UTC(year, month, date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()) - this.getExcelNullDate()) / c_msPerDay;
    } else {
        if (1900 == year && 1 == month && 29 == date) {
            res = 60;
        } else {
            res = (Date.UTC(year, month, date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()) - this.getExcelNullDate()) / c_msPerDay - 1;
        }
    }
    return Math.floor(res);
};
Date.prototype.getDateFromExcel = function (val) {
    val = Math.floor(val);
    if (g_bDate1904) {
        return new Date(val * c_msPerDay + this.getExcelNullDate());
    } else {
        if (val < 60) {
            return new Date(val * c_msPerDay + this.getExcelNullDate());
        } else {
            if (val === 60) {
                return new Date(Date.UTC(1900, 1, 29));
            } else {
                return new Date(val * c_msPerDay + this.getExcelNullDate());
            }
        }
    }
};
Date.prototype.addYears = function (counts) {
    this.setUTCFullYear(this.getUTCFullYear() + Math.floor(counts));
};
Date.prototype.addMonths = function (counts) {
    if (this.lastDayOfMonth()) {
        this.setUTCDate(1);
        this.setUTCMonth(this.getUTCMonth() + Math.floor(counts));
        this.setUTCDate(this.getDaysInMonth());
    } else {
        this.setUTCMonth(this.getUTCMonth() + Math.floor(counts));
    }
};
Date.prototype.addDays = function (counts) {
    this.setUTCDate(this.getUTCDate() + Math.floor(counts));
};
Date.prototype.lastDayOfMonth = function () {
    return this.getDaysInMonth() == this.getUTCDate();
};
Math.sinh = function (arg) {
    return (this.pow(this.E, arg) - this.pow(this.E, -arg)) / 2;
};
Math.cosh = function (arg) {
    return (this.pow(this.E, arg) + this.pow(this.E, -arg)) / 2;
};
Math.tanh = function (arg) {
    return this.sinh(arg) / this.cosh(arg);
};
Math.asinh = function (arg) {
    return this.log(arg + this.sqrt(arg * arg + 1));
};
Math.acosh = function (arg) {
    return this.log(arg + this.sqrt(arg + 1) * this.sqrt(arg - 1));
};
Math.atanh = function (arg) {
    return 0.5 * this.log((1 + arg) / (1 - arg));
};
Math.fact = function (n) {
    var res = 1;
    n = this.floor(n);
    if (n < 0) {
        return NaN;
    } else {
        if (n > 170) {
            return Infinity;
        }
    }
    while (n !== 0) {
        res *= n--;
    }
    return res;
};
Math.doubleFact = function (n) {
    var res = 1;
    n = this.floor(n);
    if (n < 0) {
        return NaN;
    } else {
        if (n > 170) {
            return Infinity;
        }
    }
    while (n > 0) {
        res *= n;
        n -= 2;
    }
    return res;
};
Math.factor = function (n) {
    var res = 1;
    n = this.floor(n);
    while (n !== 0) {
        res = res * n--;
    }
    return res;
};
Math.ln = Math.log;
Math.log10 = function (x) {
    return this.log(x) / this.log(10);
};
Math.fmod = function (a, b) {
    return Number((a - (this.floor(a / b) * b)).toPrecision(cExcelSignificantDigits));
};
Math.binomCoeff = function (n, k) {
    return this.fact(n) / (this.fact(k) * this.fact(n - k));
};
Math.permut = function (n, k) {
    return this.floor(this.fact(n) / this.fact(n - k) + 0.5);
};
Math.approxEqual = function (a, b) {
    if (a === b) {
        return true;
    }
    return this.abs(a - b) < 1e-15;
};
Math.sign = function (x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
};
String.prototype.repeat = function (s, n) {
    var a = [];
    while (a.length < n) {
        a.push(s);
    }
    return a.join("");
};
function cBaseType(val, type) {
    this.needRecalc = false;
    this.numFormat = null;
    this.ca = false;
    this.node = undefined;
    this.type = type;
    this.value = val;
}
cBaseType.prototype = {
    constructor: cBaseType,
    cloneTo: function (oRes) {
        oRes.needRecalc = this.needRecalc;
        oRes.numFormat = this.numFormat;
        oRes.type = this.type;
        oRes.value = this.value;
        oRes.ca = this.ca;
        oRes.node = this.node;
    },
    tryConvert: function () {
        return this;
    },
    getValue: function () {
        return this.value;
    },
    toString: function () {
        return this.value.toString();
    },
    setNode: function (node) {
        this.node = node;
    }
};
function cNumber(val) {
    this.constructor.call(this, parseFloat(val), cElementType.number);
    var res;
    if (!isNaN(this.value) && Math.abs(this.value) !== Infinity) {
        res = this;
    } else {
        if (val instanceof cError) {
            res = val;
        } else {
            res = new cError(cErrorType.not_numeric);
        }
    }
    return res;
}
cNumber.prototype = Object.create(cBaseType.prototype);
cNumber.prototype.tocString = function () {
    return new cString("" + this.value);
};
cNumber.prototype.tocNumber = function () {
    return this;
};
cNumber.prototype.tocBool = function () {
    return new cBool(this.value !== 0);
};
function cString(val) {
    this.constructor.call(this, val, cElementType.string);
}
cString.prototype = Object.create(cBaseType.prototype);
cString.prototype.tocNumber = function () {
    var res, m = this.value;
    if (this.value === "") {
        res = new cNumber(0);
    }
    if (!parseNum(m)) {
        res = new cError(cErrorType.wrong_value_type);
    } else {
        var numberValue = parseFloat(m);
        if (!isNaN(numberValue)) {
            res = new cNumber(numberValue);
        }
    }
    return res;
};
cString.prototype.tocBool = function () {
    var res;
    if (parserHelp.isBoolean(this.value, 0)) {
        res = new cBool(parserHelp.operand_str === "TRUE");
    } else {
        res = this;
    }
    return res;
};
cString.prototype.tocString = function () {
    return this;
};
cString.prototype.tryConvert = function () {
    var res = checkTypeCell("" + this.value);
    if (res instanceof cEmpty) {
        return this;
    } else {
        return res;
    }
};
function cBool(val) {
    this.constructor.call(this, val.toString().toUpperCase() === "TRUE", cElementType.bool);
}
cBool.prototype = Object.create(cBaseType.prototype);
cBool.prototype.toString = function () {
    return this.value.toString().toUpperCase();
};
cBool.prototype.getValue = function () {
    return this.toString();
};
cBool.prototype.tocNumber = function () {
    return new cNumber(this.value ? 1 : 0);
};
cBool.prototype.tocString = function () {
    return new cString(this.value ? "TRUE" : "FALSE");
};
cBool.prototype.tocBool = function () {
    return this;
};
cBool.prototype.toBool = function () {
    return this.value;
};
function cError(val) {
    this.constructor.call(this, val, cElementType.error);
    this.errorType = -1;
    switch (val) {
    case "#VALUE!":
        case cErrorType.wrong_value_type:
        this.value = "#VALUE!";
        this.errorType = cErrorType.wrong_value_type;
        break;
    case "#NULL!":
        case cErrorType.null_value:
        this.value = "#NULL!";
        this.errorType = cErrorType.null_value;
        break;
    case "#DIV/0!":
        case cErrorType.division_by_zero:
        this.value = "#DIV/0!";
        this.errorType = cErrorType.division_by_zero;
        break;
    case "#REF!":
        case cErrorType.bad_reference:
        this.value = "#REF!";
        this.errorType = cErrorType.bad_reference;
        break;
    case "#NAME?":
        case cErrorType.wrong_name:
        this.value = "#NAME?";
        this.errorType = cErrorType.wrong_name;
        break;
    case "#NUM!":
        case cErrorType.not_numeric:
        this.value = "#NUM!";
        this.errorType = cErrorType.not_numeric;
        break;
    case "#N/A":
        case cErrorType.not_available:
        this.value = "#N/A";
        this.errorType = cErrorType.not_available;
        break;
    case "#GETTING_DATA":
        case cErrorType.getting_data:
        this.value = "#GETTING_DATA";
        this.errorType = cErrorType.getting_data;
        break;
    case "#UNSUPPORTED_FUNCTION!":
        case cErrorType.unsupported_function:
        this.value = "#UNSUPPORTED_FUNCTION!";
        this.errorType = cErrorType.unsupported_function;
        break;
    }
    return this;
}
cError.prototype = Object.create(cBaseType.prototype);
cError.prototype.tocNumber = cError.prototype.tocString = cError.prototype.tocBool = cError.prototype.tocEmpty = function () {
    return this;
};
function cArea(val, ws) {
    this.constructor.call(this, val, cElementType.cellsRange);
    this.ws = ws;
    this.wb = ws.workbook;
    this._cells = val;
    this.isAbsolute = false;
    this.range = null;
}
cArea.prototype = Object.create(cBaseType.prototype);
cArea.prototype.clone = function () {
    var oRes = new cArea(this._cells, this.ws);
    this.constructor.prototype.cloneTo.call(this, oRes);
    oRes.isAbsolute = this.isAbsolute;
    return oRes;
};
cArea.prototype.getWsId = function () {
    return this.ws.Id;
};
cArea.prototype.getValue = function () {
    var val = [],
    r = this.getRange();
    if (!r) {
        val.push(new cError(cErrorType.bad_reference));
    } else {
        r._foreachNoEmpty(function (cell) {
            var cellType = cell.getType();
            switch (cellType) {
            case CellValueType.Number:
                cell.getValueWithoutFormat() === "" ? val.push(new cEmpty()) : val.push(new cNumber(cell.getValueWithoutFormat()));
                break;
            case CellValueType.Bool:
                val.push(new cBool(cell.getValueWithoutFormat()));
                break;
            case CellValueType.Error:
                val.push(new cError(cell.getValueWithoutFormat()));
                break;
            case CellValueType.String:
                val.push(new cString(cell.getValueWithoutFormat()));
                break;
            default:
                if (cell.getValueWithoutFormat() && cell.getValueWithoutFormat() !== "") {
                    val.push(new cNumber(cell.getValueWithoutFormat()));
                } else {
                    val.push(checkTypeCell("" + cell.getValueWithoutFormat()));
                }
            }
        });
    }
    return val;
};
cArea.prototype.getValue2 = function (i, j) {
    var r = this.getRange();
    var cell = r.worksheet._getCellNoEmpty(r.bbox.r1 + i, r.bbox.c1 + j);
    return this._parseCellValue(cell);
};
cArea.prototype.getRange = function () {
    if (!this.range) {
        this.range = this.ws.getRange2(this._cells);
    }
    return this.range;
};
cArea.prototype.tocNumber = function () {
    var v = this.getValue()[0];
    if (!v) {
        v = new cNumber(0);
    } else {
        v = v.tocNumber();
    }
    return v;
};
cArea.prototype.tocString = function () {
    return this.getValue()[0].tocString();
};
cArea.prototype.tocBool = function () {
    return this.getValue()[0].tocBool();
};
cArea.prototype.toString = function () {
    var _c;
    if (this.getRange()) {
        _c = this.getRange().getName();
    } else {
        _c = this._cells;
    }
    if (_c.indexOf(":") < 0) {
        _c = _c + ":" + _c;
    }
    return _c;
};
cArea.prototype.setRange = function (cell) {
    this._cells = this.value = cell;
    this.range = this.ws.getRange2(cell);
    this._valid = this.range ? true : false;
};
cArea.prototype.getWS = function () {
    return this.ws;
};
cArea.prototype.getBBox = function () {
    return this.getRange().getBBox();
};
cArea.prototype.getBBox0 = function () {
    return this.getRange().getBBox0();
};
cArea.prototype.cross = function (arg) {
    var r = this.getRange(),
    cross;
    if (!r) {
        return new cError(cErrorType.wrong_name);
    }
    cross = r.cross(arg);
    if (cross) {
        if (cross.r != undefined) {
            return this.getValue2(cross.r - this.getBBox().r1, 0);
        } else {
            if (cross.c != undefined) {
                return this.getValue2(0, cross.c - this.getBBox().c1);
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
cArea.prototype.isValid = function () {
    var r = this.getRange();
    return !! r;
};
cArea.prototype.countCells = function () {
    var r = this.getRange(),
    bbox = r.bbox,
    count = (Math.abs(bbox.c1 - bbox.c2) + 1) * (Math.abs(bbox.r1 - bbox.r2) + 1);
    r._foreachNoEmpty(function () {
        count--;
    });
    return new cNumber(count);
};
cArea.prototype.foreach = function (action) {
    var r = this.getRange();
    if (r) {
        r._foreach2(action);
    }
};
cArea.prototype._parseCellValue = function (cell) {
    var result, cellType, cellValue;
    if (cell) {
        cellType = cell.getType();
        cellValue = cell.getValueWithoutFormat();
        if (cellType === CellValueType.Number) {
            result = cell.isEmptyTextString() ? new cEmpty() : new cNumber(cellValue);
        } else {
            if (cellType === CellValueType.Bool) {
                result = new cBool(cellValue);
            } else {
                if (cellType === CellValueType.Error) {
                    result = new cError(cellValue);
                } else {
                    if (cellType === CellValueType.String) {
                        result = new cString(cellValue);
                    } else {
                        result = cell.isEmptyTextString() ? checkTypeCell("" + cellValue) : new cNumber(cellValue);
                    }
                }
            }
        }
    } else {
        result = new cEmpty();
    }
    return result;
};
cArea.prototype.foreach2 = function (action) {
    var t = this,
    r = this.getRange();
    if (r) {
        r._foreach2(function (cell) {
            action(t._parseCellValue(cell));
        });
    }
};
cArea.prototype.getMatrix = function () {
    var t = this,
    arr = [],
    r = this.getRange();
    r._foreach2(function (cell, i, j, r1, c1) {
        if (!arr[i - r1]) {
            arr[i - r1] = [];
        }
        arr[i - r1][j - c1] = t._parseCellValue(cell);
    });
    return arr;
};
cArea.prototype.index = function (r, c, n) {
    var bbox = this.getBBox();
    bbox.normalize();
    var box = {
        c1: 1,
        c2: bbox.c2 - bbox.c1 + 1,
        r1: 1,
        r2: bbox.r2 - bbox.r1 + 1
    };
    if (r < box.r1 || r > box.r2 || c < box.c1 || c > box.c2) {
        return new cError(cErrorType.bad_reference);
    }
};
function cArea3D(val, wsFrom, wsTo, wb) {
    this.constructor.call(this, val, cElementType.cellsRange);
    this._wb = wb;
    this._cells = val;
    this.isAbsolute = false;
    this.wsFrom = this._wb.getWorksheetByName(wsFrom).getId();
    this.wsTo = this._wb.getWorksheetByName(wsTo).getId();
}
cArea3D.prototype = Object.create(cBaseType.prototype);
cArea3D.prototype.clone = function () {
    var wsFrom = this._wb.getWorksheetById(this.wsFrom).getName(),
    wsTo = this._wb.getWorksheetById(this.wsTo).getName(),
    oRes = new cArea3D(this._cells, wsFrom, wsTo, this._wb);
    this.constructor.prototype.cloneTo.call(this, oRes);
    oRes.isAbsolute = this.isAbsolute;
    return oRes;
};
cArea3D.prototype.wsRange = function () {
    if (!this.wsTo) {
        this.wsTo = this.wsFrom;
    }
    var wsF = this._wb.getWorksheetById(this.wsFrom).getIndex(),
    wsL = this._wb.getWorksheetById(this.wsTo).getIndex(),
    r = [];
    for (var i = wsF; i <= wsL; i++) {
        r.push(this._wb.getWorksheet(i));
    }
    return r;
};
cArea3D.prototype.range = function (wsRange) {
    if (!wsRange) {
        return [null];
    }
    var r = [];
    for (var i = 0; i < wsRange.length; i++) {
        if (!wsRange[i]) {
            r.push(null);
        } else {
            r.push(wsRange[i].getRange2(this._cells));
        }
    }
    return r;
};
cArea3D.prototype.getRange = function () {
    return this.range(this.wsRange());
};
cArea3D.prototype.getValue = function () {
    var _wsA = this.wsRange();
    var _val = [];
    if (_wsA.length < 1) {
        _val.push(new cError(cErrorType.bad_reference));
        return _val;
    }
    for (var i = 0; i < _wsA.length; i++) {
        if (!_wsA[i]) {
            _val.push(new cError(cErrorType.bad_reference));
            return _val;
        }
    }
    var _r = this.range(_wsA);
    for (var i = 0; i < _r.length; i++) {
        if (!_r[i]) {
            _val.push(new cError(cErrorType.bad_reference));
            return _val;
        }
        _r[i]._foreachNoEmpty(function (_cell) {
            var cellType = _cell.getType();
            switch (cellType) {
            case CellValueType.Number:
                _cell.getValueWithoutFormat() === "" ? _val.push(new cEmpty()) : _val.push(new cNumber(_cell.getValueWithoutFormat()));
                break;
            case CellValueType.Bool:
                _val.push(new cBool(_cell.getValueWithoutFormat()));
                break;
            case CellValueType.Error:
                _val.push(new cError(_cell.getValueWithoutFormat()));
                break;
            case CellValueType.String:
                _val.push(new cString(_cell.getValueWithoutFormat()));
                break;
            default:
                if (_cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() !== "") {
                    _val.push(new cNumber(_cell.getValueWithoutFormat()));
                } else {
                    _val.push(checkTypeCell("" + _cell.getValueWithoutFormat()));
                }
            }
        });
    }
    return _val;
};
cArea3D.prototype.getValue2 = function (cell) {
    var _wsA = this.wsRange(),
    _val = [],
    cellType,
    _r;
    if (_wsA.length < 1) {
        _val.push(new cError(cErrorType.bad_reference));
        return _val;
    }
    for (var i = 0; i < _wsA.length; i++) {
        if (!_wsA[i]) {
            _val.push(new cError(cErrorType.bad_reference));
            return _val;
        }
    }
    _r = this.range(_wsA);
    if (!_r[0]) {
        _val.push(new cError(cErrorType.bad_reference));
        return _val;
    }
    _r[0]._foreachNoEmpty(function (_cell) {
        if (cell.getID() === _cell.getName()) {
            var cellType = _cell.getType();
            switch (cellType) {
            case CellValueType.Number:
                _cell.getValueWithoutFormat() === "" ? _val.push(new cEmpty()) : _val.push(new cNumber(_cell.getValueWithoutFormat()));
                break;
            case CellValueType.Bool:
                _val.push(new cBool(_cell.getValueWithoutFormat()));
                break;
            case CellValueType.Error:
                _val.push(new cError(_cell.getValueWithoutFormat()));
                break;
            case CellValueType.String:
                _val.push(new cString(_cell.getValueWithoutFormat()));
                break;
            default:
                if (_cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() !== "") {
                    _val.push(new cNumber(_cell.getValueWithoutFormat()));
                } else {
                    _val.push(checkTypeCell("" + _cell.getValueWithoutFormat()));
                }
            }
        }
    });
    if (_val[0] === undefined || _val[0] === null) {
        return new cEmpty();
    } else {
        return _val[0];
    }
};
cArea3D.prototype.changeSheet = function (lastName, newName) {
    if (this.wsFrom === this._wb.getWorksheetByName(lastName).getId() && this.wsTo === this._wb.getWorksheetByName(lastName).getId()) {
        this.wsFrom = this.wsTo = this._wb.getWorksheetByName(newName).getId();
    } else {
        if (this.wsFrom === this._wb.getWorksheetByName(lastName).getId()) {
            this.wsFrom = this._wb.getWorksheetByName(newName).getId();
        } else {
            if (this.wsTo === this._wb.getWorksheetByName(lastName).getId()) {
                this.wsTo = this._wb.getWorksheetByName(newName).getId();
            }
        }
    }
};
cArea3D.prototype.toString = function () {
    var wsFrom = this._wb.getWorksheetById(this.wsFrom).getName(),
    wsTo = this._wb.getWorksheetById(this.wsTo).getName(),
    name = Asc.g_oRangeCache.getActiveRange(this._cells);
    name = name && name.getName ? name.getName() : this._cells;
    return parserHelp.get3DRef(wsFrom !== wsTo ? wsFrom + ":" + wsTo: wsFrom, name);
};
cArea3D.prototype.tocNumber = function () {
    return this.getValue()[0].tocNumber();
};
cArea3D.prototype.tocString = function () {
    return this.getValue()[0].tocString();
};
cArea3D.prototype.tocBool = function () {
    return this.getValue()[0].tocBool();
};
cArea3D.prototype.getWS = function () {
    return this.wsRange()[0];
};
cArea3D.prototype.cross = function (arg) {
    if (this.wsFrom !== this.wsTo) {
        return new cError(cErrorType.wrong_value_type);
    }
    var r = this.getRange();
    if (!r) {
        return new cError(cErrorType.wrong_name);
    }
    var cross = r[0].cross(arg);
    if (cross) {
        if (cross.r != undefined) {
            return this.getValue2(new CellAddress(cross.r, this.getBBox().c1));
        } else {
            if (cross.c != undefined) {
                return this.getValue2(new CellAddress(this.getBBox().r1, cross.c));
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        }
    } else {
        return new cError(cErrorType.wrong_value_type);
    }
};
cArea3D.prototype.getBBox = function () {
    return this.getRange()[0].getBBox();
};
cArea3D.prototype.getBBox0 = function () {
    return this.getRange()[0].getBBox0();
};
cArea3D.prototype.isValid = function () {
    var r = this.getRange();
    for (var i = 0; i < r.length; i++) {
        if (!r[i]) {
            return false;
        }
    }
    return true;
};
cArea3D.prototype.countCells = function () {
    var _wsA = this.wsRange();
    var _val = [];
    if (_wsA.length < 1) {
        _val.push(new cError(cErrorType.bad_reference));
        return _val;
    }
    for (var i = 0; i < _wsA.length; i++) {
        if (!_wsA[i]) {
            _val.push(new cError(cErrorType.bad_reference));
            return _val;
        }
    }
    var _r = this.range(_wsA),
    bbox = _r[0].bbox,
    count = (Math.abs(bbox.c1 - bbox.c2) + 1) * (Math.abs(bbox.r1 - bbox.r2) + 1);
    count = _r.length * count;
    for (var i = 0; i < _r.length; i++) {
        _r[i]._foreachNoEmpty(function (_cell) {
            if (_cell.getType() === CellValueType.Number && _cell.getValueWithoutFormat() === "") {
                return null;
            }
            count--;
            return !null;
        });
    }
    return new cNumber(count);
};
cArea3D.prototype.getMatrix = function () {
    var arr = [],
    r = this.getRange(),
    res;
    for (var k = 0; k < r.length; k++) {
        arr[k] = [];
        r[k]._foreach2(function (cell, i, j, r1, c1) {
            if (!arr[k][i - r1]) {
                arr[k][i - r1] = [];
            }
            if (cell) {
                var cellType = cell.getType();
                if (cellType === CellValueType.Number) {
                    res = cell.isEmptyTextString() ? new cEmpty() : new cNumber(cell.getValueWithoutFormat());
                } else {
                    if (cellType === CellValueType.Bool) {
                        res = new cBool(cell.getValueWithoutFormat());
                    } else {
                        if (cellType === CellValueType.Error) {
                            res = new cError(cell.getValueWithoutFormat());
                        } else {
                            if (cellType === CellValueType.String) {
                                res = new cString(cell.getValueWithoutFormat());
                            } else {
                                if (cell.isEmptyTextString()) {
                                    res = new cNumber(cell.getValueWithoutFormat());
                                } else {
                                    res = checkTypeCell("" + cell.getValueWithoutFormat());
                                }
                            }
                        }
                    }
                }
            } else {
                res = new cEmpty();
            }
            arr[k][i - r1][j - c1] = res;
        });
    }
    return arr;
};
cArea3D.prototype.foreach2 = function (action) {
    var _wsA = this.wsRange();
    if (_wsA.length >= 1) {
        var _r = this.range(_wsA);
        for (var i = 0; i < _r.length; i++) {
            if (_r[i]) {
                _r[i]._foreach2(function (_cell) {
                    var val;
                    if (_cell) {
                        var cellType = _cell.getType();
                        switch (cellType) {
                        case CellValueType.Number:
                            if (_cell.getValueWithoutFormat() === "") {
                                val = new cEmpty();
                            } else {
                                val = new cNumber(_cell.getValueWithoutFormat());
                            }
                            break;
                        case CellValueType.Bool:
                            val = new cBool(_cell.getValueWithoutFormat());
                            break;
                        case CellValueType.Error:
                            val = new cError(_cell.getValueWithoutFormat());
                            break;
                        case CellValueType.String:
                            val = new cString(_cell.getValueWithoutFormat());
                            break;
                        default:
                            if (_cell.getValueWithoutFormat() && _cell.getValueWithoutFormat() !== "") {
                                val = new cNumber(_cell.getValueWithoutFormat());
                            } else {
                                val = checkTypeCell("" + _cell.getValueWithoutFormat());
                            }
                            break;
                        }
                    } else {
                        val = new cEmpty();
                    }
                    action(val);
                });
            }
        }
    }
};
function cRef(val, ws) {
    this.constructor.call(this, val, cElementType.cell);
    this._cells = val;
    this.ws = ws;
    this.wb = this._wb = ws.workbook;
    this.isAbsolute = false;
    var ca = g_oCellAddressUtils.getCellAddress(val.replace(rx_space_g, ""));
    this.range = null;
    this._valid = ca.isValid();
    if (this._valid) {
        this.range = this.ws.getRange3(ca.getRow0(), ca.getCol0(), ca.getRow0(), ca.getCol0());
    } else {
        this.range = this.ws.getRange3(0, 0, 0, 0);
    }
}
cRef.prototype = Object.create(cBaseType.prototype);
cRef.prototype.clone = function () {
    var oRes = new cRef(this._cells, this.ws);
    this.constructor.prototype.cloneTo.call(this, oRes);
    oRes.isAbsolute = this.isAbsolute;
    return oRes;
};
cRef.prototype.getWsId = function () {
    return this.ws.Id;
};
cRef.prototype.getValue = function () {
    if (!this._valid) {
        return new cError(cErrorType.bad_reference);
    }
    var cellType = this.range.getType(),
    v,
    res;
    if (cellType === CellValueType.Number) {
        v = this.range.getValueWithoutFormat();
        if (v === "") {
            res = new cEmpty();
        } else {
            res = new cNumber("" + v);
        }
    } else {
        if (cellType === CellValueType.Bool) {
            res = new cBool("" + this.range.getValueWithoutFormat());
        } else {
            if (cellType === CellValueType.Error) {
                res = new cError("" + this.range.getValueWithoutFormat());
            } else {
                if (cellType === CellValueType.String) {
                    res = new cString(this.range.getValueWithoutFormat());
                } else {
                    res = checkTypeCell("" + this.range.getValueWithoutFormat());
                }
            }
        }
    }
    return res;
};
cRef.prototype.tocNumber = function () {
    return this.getValue().tocNumber();
};
cRef.prototype.tocString = function () {
    return this.getValue().tocString();
};
cRef.prototype.tocBool = function () {
    return this.getValue().tocBool();
};
cRef.prototype.tryConvert = function () {
    return this.getValue();
};
cRef.prototype.toString = function () {
    return this._cells;
};
cRef.prototype.getRange = function () {
    return this.range;
};
cRef.prototype.getWS = function () {
    return this.ws;
};
cRef.prototype.isValid = function () {
    return this._valid;
};
function cRef3D(val, _wsFrom, wb) {
    this.constructor.call(this, val, cElementType.cell);
    this.wb = this._wb = wb;
    this._cells = val;
    this.isAbsolute = false;
    this.ws = this._wb.getWorksheetByName(_wsFrom);
    this.range = null;
}
cRef3D.prototype = Object.create(cBaseType.prototype);
cRef3D.prototype.clone = function () {
    var oRes = new cRef3D(this._cells, this.ws.getName(), this._wb);
    this.constructor.prototype.cloneTo.call(this, oRes);
    oRes.isAbsolute = this.isAbsolute;
    return oRes;
};
cRef3D.prototype.getWsId = function () {
    return this.ws.Id;
};
cRef3D.prototype.getRange = function () {
    if (this.ws) {
        if (this.range) {
            return this.range;
        }
        return this.range = this.ws.getRange2(this._cells);
    } else {
        return this.range = null;
    }
};
cRef3D.prototype.isValid = function () {
    return !! this.getRange();
};
cRef3D.prototype.getValue = function () {
    var _r = this.getRange();
    if (!_r) {
        return new cError(cErrorType.bad_reference);
    }
    var cellType = _r.getType();
    if (cellType === CellValueType.Number) {
        var v = _r.getValueWithoutFormat();
        if (v === "") {
            return new cEmpty();
        } else {
            return new cNumber("" + v);
        }
    } else {
        if (cellType === CellValueType.String) {
            return new cString("" + _r.getValueWithoutFormat());
        } else {
            if (cellType === CellValueType.Bool) {
                return new cBool("" + _r.getValueWithoutFormat());
            } else {
                if (cellType === CellValueType.Error) {
                    return new cError("" + _r.getValueWithoutFormat());
                } else {
                    return checkTypeCell("" + _r.getValueWithoutFormat());
                }
            }
        }
    }
};
cRef3D.prototype.tocBool = function () {
    return this.getValue().tocBool();
};
cRef3D.prototype.tocNumber = function () {
    return this.getValue().tocNumber();
};
cRef3D.prototype.tocString = function () {
    return this.getValue().tocString();
};
cRef3D.prototype.tryConvert = function () {
    return this.getValue();
};
cRef3D.prototype.changeSheet = function (lastName, newName) {
    if (this.ws.getName() === lastName) {
        this.ws = this._wb.getWorksheetByName(newName);
    }
};
cRef3D.prototype.toString = function () {
    return parserHelp.get3DRef(this.ws.getName(), this._cells);
};
cRef3D.prototype.getWS = function () {
    return this.ws;
};
function cEmpty() {
    this.constructor.call(this, "", cElementType.empty);
}
cEmpty.prototype = Object.create(cBaseType.prototype);
cEmpty.prototype.tocNumber = function () {
    return new cNumber(0);
};
cEmpty.prototype.tocBool = function () {
    return new cBool(false);
};
cEmpty.prototype.tocString = function () {
    return new cString("");
};
cEmpty.prototype.toString = function () {
    return "";
};
function cName(val, wb) {
    this.constructor.call(this, val, cElementType.name);
    this.wb = wb;
}
cName.prototype = Object.create(cBaseType.prototype);
cName.prototype.toRef = function (wsID) {
    var _3DRefTmp, ref = this.wb.getDefinesNames(this.value, wsID).Ref;
    if (ref && (_3DRefTmp = parserHelp.is3DRef(ref, 0))[0]) {
        var _wsFrom, _wsTo;
        _wsFrom = _3DRefTmp[1];
        _wsTo = ((_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined)) ? _3DRefTmp[2] : _wsFrom;
        if (parserHelp.isArea(ref, ref.indexOf("!") + 1)) {
            if (_wsFrom === _wsTo) {
                return new cArea(parserHelp.operand_str, this.wb.getWorksheetByName(_wsFrom));
            } else {
                return new cArea3D(parserHelp.operand_str, _wsFrom, _wsTo, this.wb);
            }
        } else {
            if (parserHelp.isRef(ref, ref.indexOf("!") + 1)) {
                return new cRef3D(parserHelp.operand_str, _wsFrom, this.wb);
            }
        }
    }
    return new cError("#NAME?");
};
function cArray() {
    this.constructor.call(this, undefined, cElementType.array);
    this.array = [];
    this.rowCount = 0;
    this.countElementInRow = [];
    this.countElement = 0;
}
cArray.prototype = Object.create(cBaseType.prototype);
cArray.prototype.addRow = function () {
    this.array[this.array.length] = [];
    this.countElementInRow[this.rowCount++] = 0;
};
cArray.prototype.addElement = function (element) {
    if (this.array.length === 0) {
        this.addRow();
    }
    var arr = this.array,
    subArr = arr[this.rowCount - 1];
    subArr[subArr.length] = element;
    this.countElementInRow[this.rowCount - 1]++;
    this.countElement++;
};
cArray.prototype.getRow = function (rowIndex) {
    if (rowIndex < 0 || rowIndex > this.array.length - 1) {
        return null;
    }
    return this.array[rowIndex];
};
cArray.prototype.getCol = function (colIndex) {
    var col = [];
    for (var i = 0; i < this.rowCount; i++) {
        col.push(this.array[i][colIndex]);
    }
    return col;
};
cArray.prototype.getElementRowCol = function (row, col) {
    if (row > this.rowCount || col > this.getCountElementInRow()) {
        return new cError(cErrorType.not_available);
    }
    return this.array[row][col];
};
cArray.prototype.getElement = function (index) {
    for (var i = 0; i < this.rowCount; i++) {
        if (index > this.countElementInRow[i].length) {
            index -= this.countElementInRow[i].length;
        } else {
            return this.array[i][index];
        }
    }
    return null;
};
cArray.prototype.foreach = function (action) {
    if (typeof(action) !== "function") {
        return true;
    }
    for (var ir = 0; ir < this.rowCount; ir++) {
        for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
            if (action.call(this, this.array[ir][ic], ir, ic)) {
                return true;
            }
        }
    }
    return undefined;
};
cArray.prototype.getCountElement = function () {
    return this.countElement;
};
cArray.prototype.getCountElementInRow = function () {
    return this.countElementInRow[0];
};
cArray.prototype.getRowCount = function () {
    return this.rowCount;
};
cArray.prototype.tocNumber = function () {
    var retArr = new cArray();
    for (var ir = 0; ir < this.rowCount; ir++, retArr.addRow()) {
        for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
            retArr.addElement(this.array[ir][ic].tocNumber());
        }
        if (ir === this.rowCount - 1) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.tocString = function () {
    var retArr = new cArray();
    for (var ir = 0; ir < this.rowCount; ir++, retArr.addRow()) {
        for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
            retArr.addElement(this.array[ir][ic].tocString());
        }
        if (ir === this.rowCount - 1) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.tocBool = function () {
    var retArr = new cArray();
    for (var ir = 0; ir < this.rowCount; ir++, retArr.addRow()) {
        for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
            retArr.addElement(this.array[ir][ic].tocBool());
        }
        if (ir === this.rowCount - 1) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.toString = function () {
    var ret = "";
    for (var ir = 0; ir < this.rowCount; ir++, ret += ";") {
        for (var ic = 0; ic < this.countElementInRow[ir]; ic++, ret += ",") {
            if (this.array[ir][ic] instanceof cString) {
                ret += '"' + this.array[ir][ic].toString() + '"';
            } else {
                ret += this.array[ir][ic].toString() + "";
            }
        }
        if (ret[ret.length - 1] === ",") {
            ret = ret.substring(0, ret.length - 1);
        }
    }
    if (ret[ret.length - 1] === ";") {
        ret = ret.substring(0, ret.length - 1);
    }
    return "{" + ret + "}";
};
cArray.prototype.isValidArray = function () {
    if (this.countElement < 1) {
        return false;
    }
    for (var i = 0; i < this.rowCount - 1; i++) {
        if (this.countElementInRow[i] - this.countElementInRow[i + 1] !== 0) {
            return false;
        }
    }
    return true;
};
cArray.prototype.getValue2 = function (i, j) {
    var result = this.array[i];
    return result ? result[j] : result;
};
cArray.prototype.getMatrix = function () {
    return this.array;
};
cArray.prototype.fillFromArray = function (arr) {
    this.array = arr;
    this.rowCount = arr.length;
    for (var i = 0; i < arr.length; i++) {
        this.countElementInRow[i] = arr[i].length;
        this.countElement += arr[i].length;
    }
};
function cUndefined() {
    this.value = undefined;
}
cUndefined.prototype = Object.create(cBaseType.prototype);
function checkTypeCell(val) {
    if (val === "") {
        return new cEmpty();
    } else {
        if (parseNum(val)) {
            return new cNumber(val - 0);
        } else {
            if (parserHelp.isString(val, 0)) {
                return new cString(parserHelp.operand_str);
            } else {
                if (parserHelp.isBoolean(val, 0)) {
                    return new cBool(parserHelp.operand_str);
                } else {
                    if (parserHelp.isError(val, 0)) {
                        return new cError(parserHelp.operand_str);
                    } else {
                        return new cString(val);
                    }
                }
            }
        }
    }
}
function cBaseOperator(name, priority, argumentCount) {
    if (name) {
        this.name = name;
    } else {
        this.name = "";
    }
    if (priority !== undefined) {
        this.priority = priority;
    } else {
        this.priority = 10;
    }
    this.type = cElementType.operator;
    this.isRightAssociative = false;
    if (argumentCount !== undefined) {
        this.argumentsCurrent = argumentCount;
    } else {
        this.argumentsCurrent = 2;
    }
    this.value = null;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cBaseOperator.prototype = {
    constructor: cBaseOperator,
    getArguments: function () {
        return this.argumentsCurrent;
    },
    toString: function () {
        return this.name;
    },
    Calculate: function () {
        return null;
    },
    Assemble: function (arg) {
        var str = "";
        if (this.argumentsCurrent === 2) {
            str = arg[0] + "" + this.name + "" + arg[1];
        } else {
            str = this.name + "" + arg[0];
        }
        return new cString(str);
    },
    Assemble2: function (arg, start, count) {
        var str = "";
        if (this.argumentsCurrent === 2) {
            str += arg[start + count - 2] + this.name + arg[start + count - 1];
        } else {
            str += this.name + arg[start];
        }
        return new cString(str);
    }
};
function cBaseFunction(name, argMin, argMax) {
    this.name = name;
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = argMin ? argMin : 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = argMax ? argMax : 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cBaseFunction.prototype = {
    constructor: cBaseFunction,
    Calculate: function () {
        this.value = new cError(cErrorType.wrong_name);
        return this.value;
    },
    setArgumentsMin: function (count) {
        this.argumentsMin = count;
    },
    setArgumentsMax: function (count) {
        this.argumentsMax = count;
    },
    DecrementArguments: function () {
        --this.argumentsCurrent;
    },
    IncrementArguments: function () {
        ++this.argumentsCurrent;
    },
    setName: function (name) {
        this.name = name;
    },
    setArgumentsCount: function (count) {
        this.argumentsCurrent = count;
    },
    getArguments: function () {
        return this.argumentsCurrent;
    },
    getMaxArguments: function () {
        return this.argumentsMax;
    },
    getMinArguments: function () {
        return this.argumentsMin;
    },
    Assemble: function (arg) {
        var str = "";
        for (var i = 0; i < arg.length; i++) {
            str += arg[i].toString();
            if (i !== arg.length - 1) {
                str += ",";
            }
        }
        return new cString(this.name + "(" + str + ")");
    },
    Assemble2: function (arg, start, count) {
        var str = "",
        c = start + count - 1;
        for (var i = start; i <= c; i++) {
            str += arg[i].toString();
            if (i !== c) {
                str += ",";
            }
        }
        return new cString(this.name + "(" + str + ")");
    },
    toString: function () {
        return this.name;
    },
    setCA: function (arg, ca, numFormat) {
        this.value = arg;
        if (ca) {
            this.value.ca = true;
        }
        if (numFormat !== null && numFormat !== undefined) {
            this.value.numFormat = numFormat;
        }
        return this.value;
    },
    setFormat: function (f) {
        this.numFormat = f;
    }
};
function parentLeft() {
    this.name = "(";
    this.type = cElementType.operator;
    this.argumentsCurrent = 1;
}
parentLeft.prototype.constructor = parentLeft;
parentLeft.prototype.DecrementArguments = function () {
    --this.argumentsCurrent;
};
parentLeft.prototype.IncrementArguments = function () {
    ++this.argumentsCurrent;
};
parentLeft.prototype.toString = function () {
    return this.name;
};
parentLeft.prototype.getArguments = function () {
    return this.argumentsCurrent;
};
parentLeft.prototype.Assemble = function (arg) {
    return new cString("(" + arg + ")");
};
parentLeft.prototype.Assemble2 = function (arg, start, count) {
    return new cString("(" + arg[start + count - 1] + ")");
};
function parentRight() {
    this.name = ")";
    this.type = cElementType.operator;
}
parentRight.prototype.constructor = parentRight;
parentRight.prototype.toString = function () {
    return this.name;
};
function cUnarMinusOperator() {
    cBaseOperator.apply(this, ["un_minus", 50, 1]);
    this.isRightAssociative = true;
}
cUnarMinusOperator.prototype = Object.create(cBaseOperator.prototype);
cUnarMinusOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (arrElem, r, c) {
                arrElem = arrElem.tocNumber();
                arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber(-arrElem.getValue());
            });
            return this.value = arg0;
        }
    }
    arg0 = arg0.tocNumber();
    return this.value = arg0 instanceof cError ? arg0 : new cNumber(-arg0.getValue());
};
cUnarMinusOperator.prototype.toString = function () {
    return "-";
};
cUnarMinusOperator.prototype.Assemble = function (arg) {
    return new cString("-" + arg[0]);
};
cUnarMinusOperator.prototype.Assemble2 = function (arg, start, count) {
    return new cString("-" + arg[start + count - 1]);
};
function cUnarPlusOperator() {
    cBaseOperator.apply(this, ["un_plus", 50, 1]);
    this.isRightAssociative = true;
}
cUnarPlusOperator.prototype = Object.create(cBaseOperator.prototype);
cUnarPlusOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg[0].tryConvert();
    return this.value = arg0;
};
cUnarPlusOperator.prototype.toString = function () {
    return "+";
};
cUnarPlusOperator.prototype.Assemble = function (arg) {
    return new cString("+" + arg[0]);
};
cUnarPlusOperator.prototype.Assemble2 = function (arg, start, count) {
    return new cString("+" + arg[start + count - 1]);
};
function cAddOperator() {
    cBaseOperator.apply(this, ["+", 20]);
}
cAddOperator.prototype = Object.create(cBaseOperator.prototype);
cAddOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber(),
    arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "+", arguments[1].first);
};
function cMinusOperator() {
    cBaseOperator.apply(this, ["-", 20]);
}
cMinusOperator.prototype = Object.create(cBaseOperator.prototype);
cMinusOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber(),
    arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "-", arguments[1].first);
};
function cPercentOperator() {
    cBaseOperator.apply(this, ["%", 45, 1]);
    this.isRightAssociative = true;
}
cPercentOperator.prototype = Object.create(cBaseOperator.prototype);
cPercentOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (arrElem, r, c) {
                arrElem = arrElem.tocNumber();
                arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber(arrElem.getValue() / 100);
            });
            return this.value = arg0;
        }
    }
    arg0 = arg0.tocNumber();
    this.value = arg0 instanceof cError ? arg0 : new cNumber(arg0.getValue() / 100);
    this.value.numFormat = 9;
    return this.value;
};
cPercentOperator.prototype.Assemble = function (arg) {
    return new cString(arg[0] + this.name);
};
cPercentOperator.prototype.Assemble2 = function (arg, start, count) {
    return new cString(arg[start + count - 1] + this.name);
};
function cPowOperator() {
    cBaseOperator.apply(this, ["^", 40]);
}
cPowOperator.prototype = Object.create(cBaseOperator.prototype);
cPowOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    var _v = Math.pow(arg0.getValue(), arg1.getValue());
    if (isNaN(_v)) {
        return this.value = new cError(cErrorType.not_numeric);
    } else {
        if (_v === Number.POSITIVE_INFINITY) {
            return this.value = new cError(cErrorType.division_by_zero);
        }
    }
    return this.value = new cNumber(_v);
};
function cMultOperator() {
    cBaseOperator.apply(this, ["*", 30]);
}
cMultOperator.prototype = Object.create(cBaseOperator.prototype);
cMultOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber(),
    arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "*", arguments[1].first);
};
function cDivOperator() {
    cBaseOperator.apply(this, ["/", 30]);
}
cDivOperator.prototype = Object.create(cBaseOperator.prototype);
cDivOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber(),
    arg1 = arg1.tocNumber();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "/", arguments[1].first);
};
function cConcatSTROperator() {
    cBaseOperator.apply(this, ["&", 15]);
}
cConcatSTROperator.prototype = Object.create(cBaseOperator.prototype);
cConcatSTROperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg1 = arg1.tocString();
    return this.value = arg0 instanceof cError ? arg0 : arg1 instanceof cError ? arg1 : new cString(arg0.toString().concat(arg1.toString()));
};
function cEqualsOperator() {
    cBaseOperator.apply(this, ["=", 10]);
}
cEqualsOperator.prototype = Object.create(cBaseOperator.prototype);
cEqualsOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tryConvert(),
    arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "=", arguments[1].first);
};
function cNotEqualsOperator() {
    cBaseOperator.apply(this, ["<>", 10]);
}
cNotEqualsOperator.prototype = Object.create(cBaseOperator.prototype);
cNotEqualsOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tryConvert(),
    arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "<>", arguments[1].first);
};
function cLessOperator() {
    cBaseOperator.apply(this, ["<", 10]);
}
cLessOperator.prototype = Object.create(cBaseOperator.prototype);
cLessOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tryConvert(),
    arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "<", arguments[1].first);
};
function cLessOrEqualOperator() {
    cBaseOperator.apply(this, ["<=", 10]);
}
cLessOrEqualOperator.prototype = Object.create(cBaseOperator.prototype);
cLessOrEqualOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tryConvert(),
    arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, "<=", arguments[1].first);
};
function cGreaterOperator() {
    cBaseOperator.apply(this, [">", 10]);
}
cGreaterOperator.prototype = Object.create(cBaseOperator.prototype);
cGreaterOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tryConvert(),
    arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, ">", arguments[1].first);
};
function cGreaterOrEqualOperator() {
    cBaseOperator.apply(this, [">=", 10]);
}
cGreaterOrEqualOperator.prototype = Object.create(cBaseOperator.prototype);
cGreaterOrEqualOperator.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tryConvert(),
    arg1 = arg1.tryConvert();
    return this.value = _func[arg0.type][arg1.type](arg0, arg1, ">=", arguments[1].first);
};
var cFormulaOperators = {
    "(": parentLeft,
    ")": parentRight,
    "{": function () {
        var r = {};
        r.name = "{";
        r.toString = function () {
            return this.name;
        };
        return r;
    },
    "}": function () {
        var r = {};
        r.name = "}";
        r.toString = function () {
            return this.name;
        };
        return r;
    },
    "un_minus": cUnarMinusOperator,
    "un_plus": cUnarPlusOperator,
    "%": cPercentOperator,
    "^": cPowOperator,
    "*": cMultOperator,
    "/": cDivOperator,
    "+": cAddOperator,
    "-": cMinusOperator,
    "&": cConcatSTROperator,
    "=": cEqualsOperator,
    "<>": cNotEqualsOperator,
    "<": cLessOperator,
    "<=": cLessOrEqualOperator,
    ">": cGreaterOperator,
    ">=": cGreaterOrEqualOperator
};
var cFormulaFunction = {};
function getFormulasInfo() {
    var list = [],
    a,
    b;
    for (var type in cFormulaFunction) {
        b = new Asc.asc_CFormulaGroup(cFormulaFunction[type]["groupName"]);
        for (var f in cFormulaFunction[type]) {
            if (f != "groupName") {
                a = new cFormulaFunction[type][f]();
                if (a.getInfo) {
                    b.asc_addFormulaElement(new Asc.asc_CFormula(a.getInfo()));
                }
            }
        }
        list.push(b);
    }
    return list;
}
var _func = [];
_func[cElementType.number] = [];
_func[cElementType.string] = [];
_func[cElementType.bool] = [];
_func[cElementType.error] = [];
_func[cElementType.cellsRange] = [];
_func[cElementType.empty] = [];
_func[cElementType.array] = [];
_func[cElementType.cell] = [];
_func[cElementType.number][cElementType.number] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(arg0.getValue() > arg1.getValue());
    } else {
        if (what === ">=") {
            return new cBool(arg0.getValue() >= arg1.getValue());
        } else {
            if (what === "<") {
                return new cBool(arg0.getValue() < arg1.getValue());
            } else {
                if (what === "<=") {
                    return new cBool(arg0.getValue() <= arg1.getValue());
                } else {
                    if (what === "=") {
                        return new cBool(arg0.getValue() === arg1.getValue());
                    } else {
                        if (what === "<>") {
                            return new cBool(arg0.getValue() !== arg1.getValue());
                        } else {
                            if (what === "-") {
                                return new cNumber(arg0.getValue() - arg1.getValue());
                            } else {
                                if (what === "+") {
                                    return new cNumber(arg0.getValue() + arg1.getValue());
                                } else {
                                    if (what === "/") {
                                        if (arg1.getValue() !== 0) {
                                            return new cNumber(arg0.getValue() / arg1.getValue());
                                        } else {
                                            return new cError(cErrorType.division_by_zero);
                                        }
                                    } else {
                                        if (what === "*") {
                                            return new cNumber(arg0.getValue() * arg1.getValue());
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.number][cElementType.string] = function (arg0, arg1, what) {
    if (what === ">" || what === ">=") {
        return new cBool(false);
    } else {
        if (what === "<" || what === "<=") {
            return new cBool(true);
        } else {
            if (what === "=") {
                return new cBool(false);
            } else {
                if (what === "<>") {
                    return new cBool(true);
                } else {
                    if (what === "-" || what === "+" || what === "/" || what === "*") {
                        return new cError(cErrorType.wrong_value_type);
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.number][cElementType.bool] = function (arg0, arg1, what) {
    var _arg;
    if (what === ">" || what === ">=") {
        return new cBool(false);
    } else {
        if (what === "<" || what === "<=") {
            return new cBool(true);
        } else {
            if (what === "=") {
                return new cBool(false);
            } else {
                if (what === "<>") {
                    return new cBool(true);
                } else {
                    if (what === "-") {
                        _arg = arg1.tocNumber();
                        if (_arg instanceof cError) {
                            return _arg;
                        }
                        return new cNumber(arg0.getValue() - _arg.getValue());
                    } else {
                        if (what === "+") {
                            _arg = arg1.tocNumber();
                            if (_arg instanceof cError) {
                                return _arg;
                            }
                            return new cNumber(arg0.getValue() + _arg.getValue());
                        } else {
                            if (what === "/") {
                                _arg = arg1.tocNumber();
                                if (_arg instanceof cError) {
                                    return _arg;
                                }
                                if (_arg.getValue() !== 0) {
                                    return new cNumber(arg0.getValue() / _arg.getValue());
                                } else {
                                    return new cError(cErrorType.division_by_zero);
                                }
                            } else {
                                if (what === "*") {
                                    _arg = arg1.tocNumber();
                                    if (_arg instanceof cError) {
                                        return _arg;
                                    }
                                    return new cNumber(arg0.getValue() * _arg.getValue());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.number][cElementType.error] = function (arg0, arg1) {
    return arg1;
};
_func[cElementType.number][cElementType.empty] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(arg0.getValue() > 0);
    } else {
        if (what === ">=") {
            return new cBool(arg0.getValue() >= 0);
        } else {
            if (what === "<") {
                return new cBool(arg0.getValue() < 0);
            } else {
                if (what === "<=") {
                    return new cBool(arg0.getValue() <= 0);
                } else {
                    if (what === "=") {
                        return new cBool(arg0.getValue() === 0);
                    } else {
                        if (what === "<>") {
                            return new cBool(arg0.getValue() !== 0);
                        } else {
                            if (what === "-") {
                                return new cNumber(arg0.getValue() - 0);
                            } else {
                                if (what === "+") {
                                    return new cNumber(arg0.getValue() + 0);
                                } else {
                                    if (what === "/") {
                                        return new cError(cErrorType.division_by_zero);
                                    } else {
                                        if (what === "*") {
                                            return new cNumber(0);
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.string][cElementType.number] = function (arg0, arg1, what) {
    if (what === ">" || what === ">=") {
        return new cBool(true);
    } else {
        if (what === "<" || what === "<=" || what === "=") {
            return new cBool(false);
        } else {
            if (what === "<>") {
                return new cBool(true);
            } else {
                if (what === "-" || what === "+" || what === "/" || what === "*") {
                    return new cError(cErrorType.wrong_value_type);
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.string][cElementType.string] = function (arg0, arg1, what) {
    var _arg0, _arg1;
    if (what === ">") {
        return new cBool(arg0.getValue() > arg1.getValue());
    } else {
        if (what === ">=") {
            return new cBool(arg0.getValue() >= arg1.getValue());
        } else {
            if (what === "<") {
                return new cBool(arg0.getValue() < arg1.getValue());
            } else {
                if (what === "<=") {
                    return new cBool(arg0.getValue() <= arg1.getValue());
                } else {
                    if (what === "=") {
                        return new cBool(arg0.getValue() === arg1.getValue());
                    } else {
                        if (what === "<>") {
                            return new cBool(arg0.getValue() !== arg1.getValue());
                        } else {
                            if (what === "-") {
                                _arg0 = arg0.tocNumber();
                                _arg1 = arg1.tocNumber();
                                if (_arg0 instanceof cError) {
                                    return _arg0;
                                }
                                if (_arg1 instanceof cError) {
                                    return _arg1;
                                }
                                return new cNumber(_arg0.getValue() - _arg1.getValue());
                            } else {
                                if (what === "+") {
                                    _arg0 = arg0.tocNumber();
                                    _arg1 = arg1.tocNumber();
                                    if (_arg0 instanceof cError) {
                                        return _arg0;
                                    }
                                    if (_arg1 instanceof cError) {
                                        return _arg1;
                                    }
                                    return new cNumber(_arg0.getValue() + _arg1.getValue());
                                } else {
                                    if (what === "/") {
                                        _arg0 = arg0.tocNumber();
                                        _arg1 = arg1.tocNumber();
                                        if (_arg0 instanceof cError) {
                                            return _arg0;
                                        }
                                        if (_arg1 instanceof cError) {
                                            return _arg1;
                                        }
                                        if (_arg1.getValue() !== 0) {
                                            return new cNumber(_arg0.getValue() / _arg1.getValue());
                                        }
                                        return new cError(cErrorType.division_by_zero);
                                    } else {
                                        if (what === "*") {
                                            _arg0 = arg0.tocNumber();
                                            _arg1 = arg1.tocNumber();
                                            if (_arg0 instanceof cError) {
                                                return _arg0;
                                            }
                                            if (_arg1 instanceof cError) {
                                                return _arg1;
                                            }
                                            return new cNumber(_arg0.getValue() * _arg1.getValue());
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.string][cElementType.bool] = function (arg0, arg1, what) {
    var _arg0, _arg1;
    if (what === ">" || what === ">=") {
        return new cBool(false);
    } else {
        if (what === "<" || what === "<=") {
            return new cBool(true);
        } else {
            if (what === "=") {
                return new cBool(false);
            } else {
                if (what === "<>") {
                    return new cBool(true);
                } else {
                    if (what === "-") {
                        _arg0 = arg0.tocNumber();
                        _arg1 = arg1.tocNumber();
                        if (_arg0 instanceof cError) {
                            return _arg0;
                        }
                        if (_arg1 instanceof cError) {
                            return _arg1;
                        }
                        return new cNumber(_arg0.getValue() - _arg1.getValue());
                    } else {
                        if (what === "+") {
                            _arg0 = arg0.tocNumber();
                            _arg1 = arg1.tocNumber();
                            if (_arg0 instanceof cError) {
                                return _arg0;
                            }
                            if (_arg1 instanceof cError) {
                                return _arg1;
                            }
                            return new cNumber(_arg0.getValue() + _arg1.getValue());
                        } else {
                            if (what === "/") {
                                _arg0 = arg0.tocNumber();
                                _arg1 = arg1.tocNumber();
                                if (_arg0 instanceof cError) {
                                    return _arg0;
                                }
                                if (_arg1 instanceof cError) {
                                    return _arg1;
                                }
                                if (_arg1.getValue() !== 0) {
                                    return new cNumber(_arg0.getValue() / _arg1.getValue());
                                }
                                return new cError(cErrorType.division_by_zero);
                            } else {
                                if (what === "*") {
                                    _arg0 = arg0.tocNumber();
                                    _arg1 = arg1.tocNumber();
                                    if (_arg0 instanceof cError) {
                                        return _arg0;
                                    }
                                    if (_arg1 instanceof cError) {
                                        return _arg1;
                                    }
                                    return new cNumber(_arg0.getValue() * _arg1.getValue());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.string][cElementType.error] = function (arg0, arg1) {
    return arg1;
};
_func[cElementType.string][cElementType.empty] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(arg0.getValue().length !== 0);
    } else {
        if (what === ">=") {
            return new cBool(arg0.getValue().length >= 0);
        } else {
            if (what === "<") {
                return new cBool(false);
            } else {
                if (what === "<=") {
                    return new cBool(arg0.getValue().length <= 0);
                } else {
                    if (what === "=") {
                        return new cBool(arg0.getValue().length === 0);
                    } else {
                        if (what === "<>") {
                            return new cBool(arg0.getValue().length !== 0);
                        } else {
                            if (what === "-" || what === "+" || what === "/" || what === "*") {
                                return new cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.bool][cElementType.number] = function (arg0, arg1, what) {
    var _arg;
    if (what === ">" || what === ">=") {
        return new cBool(true);
    } else {
        if (what === "<" || what === "<=") {
            return new cBool(false);
        } else {
            if (what === "=") {
                return new cBool(false);
            } else {
                if (what === "<>") {
                    return new cBool(true);
                } else {
                    if (what === "-") {
                        _arg = arg0.tocNumber();
                        if (_arg instanceof cError) {
                            return _arg;
                        }
                        return new cNumber(_arg.getValue() - arg1.getValue());
                    } else {
                        if (what === "+") {
                            _arg = arg1.tocNumber();
                            if (_arg instanceof cError) {
                                return _arg;
                            }
                            return new cNumber(_arg.getValue() + arg1.getValue());
                        } else {
                            if (what === "/") {
                                _arg = arg1.tocNumber();
                                if (_arg instanceof cError) {
                                    return _arg;
                                }
                                if (arg1.getValue() !== 0) {
                                    return new cNumber(_arg.getValue() / arg1.getValue());
                                } else {
                                    return new cError(cErrorType.division_by_zero);
                                }
                            } else {
                                if (what === "*") {
                                    _arg = arg1.tocNumber();
                                    if (_arg instanceof cError) {
                                        return _arg;
                                    }
                                    return new cNumber(_arg.getValue() * arg1.getValue());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.bool][cElementType.string] = function (arg0, arg1, what) {
    var _arg0, _arg1;
    if (what === ">" || what === ">=") {
        return new cBool(true);
    } else {
        if (what === "<" || what === "<=") {
            return new cBool(false);
        } else {
            if (what === "=") {
                return new cBool(false);
            } else {
                if (what === "<>") {
                    return new cBool(true);
                } else {
                    if (what === "-") {
                        _arg0 = arg0.tocNumber();
                        _arg1 = arg1.tocNumber();
                        if (_arg1 instanceof cError) {
                            return _arg1;
                        }
                        return new cNumber(_arg0.getValue() - _arg1.getValue());
                    } else {
                        if (what === "+") {
                            _arg0 = arg0.tocNumber();
                            _arg1 = arg1.tocNumber();
                            if (_arg1 instanceof cError) {
                                return _arg1;
                            }
                            return new cNumber(_arg0.getValue() + _arg1.getValue());
                        } else {
                            if (what === "/") {
                                _arg0 = arg0.tocNumber();
                                _arg1 = arg1.tocNumber();
                                if (_arg1 instanceof cError) {
                                    return _arg1;
                                }
                                if (_arg1.getValue() !== 0) {
                                    return new cNumber(_arg0.getValue() / _arg1.getValue());
                                }
                                return new cError(cErrorType.division_by_zero);
                            } else {
                                if (what === "*") {
                                    _arg0 = arg0.tocNumber();
                                    _arg1 = arg1.tocNumber();
                                    if (_arg1 instanceof cError) {
                                        return _arg1;
                                    }
                                    return new cNumber(_arg0.getValue() * _arg1.getValue());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.bool][cElementType.bool] = function (arg0, arg1, what) {
    var _arg0, _arg1;
    if (what === ">") {
        return new cBool(arg0.value > arg1.value);
    } else {
        if (what === ">=") {
            return new cBool(arg0.value >= arg1.value);
        } else {
            if (what === "<") {
                return new cBool(arg0.value < arg1.value);
            } else {
                if (what === "<=") {
                    return new cBool(arg0.value <= arg1.value);
                } else {
                    if (what === "=") {
                        return new cBool(arg0.value === arg1.value);
                    } else {
                        if (what === "<>") {
                            return new cBool(arg0.value !== arg1.value);
                        } else {
                            if (what === "-") {
                                _arg0 = arg0.tocNumber();
                                _arg1 = arg1.tocNumber();
                                return new cNumber(_arg0.getValue() - _arg1.getValue());
                            } else {
                                if (what === "+") {
                                    _arg0 = arg0.tocNumber();
                                    _arg1 = arg1.tocNumber();
                                    return new cNumber(_arg0.getValue() + _arg1.getValue());
                                } else {
                                    if (what === "/") {
                                        if (!arg1.value) {
                                            return new cError(cErrorType.division_by_zero);
                                        }
                                        _arg0 = arg0.tocNumber();
                                        _arg1 = arg1.tocNumber();
                                        return new cNumber(_arg0.getValue() / _arg1.getValue());
                                    } else {
                                        if (what === "*") {
                                            _arg0 = arg0.tocNumber();
                                            _arg1 = arg1.tocNumber();
                                            return new cNumber(_arg0.getValue() * _arg1.getValue());
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.bool][cElementType.error] = function (arg0, arg1) {
    return arg1;
};
_func[cElementType.bool][cElementType.empty] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(arg0.value > false);
    } else {
        if (what === ">=") {
            return new cBool(arg0.value >= false);
        } else {
            if (what === "<") {
                return new cBool(arg0.value < false);
            } else {
                if (what === "<=") {
                    return new cBool(arg0.value <= false);
                } else {
                    if (what === "=") {
                        return new cBool(arg0.value === false);
                    } else {
                        if (what === "<>") {
                            return new cBool(arg0.value !== false);
                        } else {
                            if (what === "-") {
                                return new cNumber(arg0.value ? 1 : 0);
                            } else {
                                if (what === "+") {
                                    return new cNumber(arg0.value ? 1 : 0);
                                } else {
                                    if (what === "/") {
                                        return new cError(cErrorType.division_by_zero);
                                    } else {
                                        if (what === "*") {
                                            return new cNumber(0);
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.error][cElementType.number] = _func[cElementType.error][cElementType.string] = _func[cElementType.error][cElementType.bool] = _func[cElementType.error][cElementType.error] = _func[cElementType.error][cElementType.empty] = function (arg0) {
    return arg0;
};
_func[cElementType.empty][cElementType.number] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(0 > arg1.getValue());
    } else {
        if (what === ">=") {
            return new cBool(0 >= arg1.getValue());
        } else {
            if (what === "<") {
                return new cBool(0 < arg1.getValue());
            } else {
                if (what === "<=") {
                    return new cBool(0 <= arg1.getValue());
                } else {
                    if (what === "=") {
                        return new cBool(0 === arg1.getValue());
                    } else {
                        if (what === "<>") {
                            return new cBool(0 !== arg1.getValue());
                        } else {
                            if (what === "-") {
                                return new cNumber(0 - arg1.getValue());
                            } else {
                                if (what === "+") {
                                    return new cNumber(0 + arg1.getValue());
                                } else {
                                    if (what === "/") {
                                        if (arg1.getValue() === 0) {
                                            return new cError(cErrorType.not_numeric);
                                        }
                                        return new cNumber(0);
                                    } else {
                                        if (what === "*") {
                                            return new cNumber(0);
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.empty][cElementType.string] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(0 > arg1.getValue().length);
    } else {
        if (what === ">=") {
            return new cBool(0 >= arg1.getValue().length);
        } else {
            if (what === "<") {
                return new cBool(0 < arg1.getValue().length);
            } else {
                if (what === "<=") {
                    return new cBool(0 <= arg1.getValue().length);
                } else {
                    if (what === "=") {
                        return new cBool(0 === arg1.getValue().length);
                    } else {
                        if (what === "<>") {
                            return new cBool(0 !== arg1.getValue().length);
                        } else {
                            if (what === "-" || what === "+" || what === "/" || what === "*") {
                                return new cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.empty][cElementType.bool] = function (arg0, arg1, what) {
    if (what === ">") {
        return new cBool(false > arg1.value);
    } else {
        if (what === ">=") {
            return new cBool(false >= arg1.value);
        } else {
            if (what === "<") {
                return new cBool(false < arg1.value);
            } else {
                if (what === "<=") {
                    return new cBool(false <= arg1.value);
                } else {
                    if (what === "=") {
                        return new cBool(arg1.value === false);
                    } else {
                        if (what === "<>") {
                            return new cBool(arg1.value !== false);
                        } else {
                            if (what === "-") {
                                return new cNumber(0 - arg1.value ? 1 : 0);
                            } else {
                                if (what === "+") {
                                    return new cNumber(arg1.value ? 1 : 0);
                                } else {
                                    if (what === "/") {
                                        if (arg1.value) {
                                            return new cNumber(0);
                                        }
                                        return new cError(cErrorType.not_numeric);
                                    } else {
                                        if (what === "*") {
                                            return new cNumber(0);
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
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.empty][cElementType.error] = function (arg0, arg1) {
    return arg1;
};
_func[cElementType.empty][cElementType.empty] = function (arg0, arg1, what) {
    if (what === ">" || what === "<" || what === "<>") {
        return new cBool(false);
    } else {
        if (what === ">=" || what === "<=" || what === "=") {
            return new cBool(true);
        } else {
            if (what === "-" || what === "+") {
                return new cNumber(0);
            } else {
                if (what === "/") {
                    return new cError(cErrorType.not_numeric);
                } else {
                    if (what === "*") {
                        return new cNumber(0);
                    }
                }
            }
        }
    }
    return new cError(cErrorType.wrong_value_type);
};
_func[cElementType.cellsRange][cElementType.number] = _func[cElementType.cellsRange][cElementType.string] = _func[cElementType.cellsRange][cElementType.bool] = _func[cElementType.cellsRange][cElementType.error] = _func[cElementType.cellsRange][cElementType.array] = _func[cElementType.cellsRange][cElementType.empty] = function (arg0, arg1, what, cellAddress) {
    var cross = arg0.cross(cellAddress);
    return _func[cross.type][arg1.type](cross, arg1, what);
};
_func[cElementType.number][cElementType.cellsRange] = _func[cElementType.string][cElementType.cellsRange] = _func[cElementType.bool][cElementType.cellsRange] = _func[cElementType.error][cElementType.cellsRange] = _func[cElementType.array][cElementType.cellsRange] = _func[cElementType.empty][cElementType.cellsRange] = function (arg0, arg1, what, cellAddress) {
    var cross = arg1.cross(cellAddress);
    return _func[arg0.type][cross.type](arg0, cross, what);
};
_func[cElementType.cellsRange][cElementType.cellsRange] = function (arg0, arg1, what, cellAddress) {
    var cross1 = arg0.cross(cellAddress),
    cross2 = arg1.cross(cellAddress);
    return _func[cross1.type][cross2.type](cross1, cross2, what);
};
_func[cElementType.array][cElementType.array] = function (arg0, arg1, what) {
    if (arg0.getRowCount() !== arg1.getRowCount() || arg0.getCountElementInRow() !== arg1.getCountElementInRow()) {
        return new cError(cErrorType.wrong_value_type);
    }
    var retArr = new cArray(),
    _arg0,
    _arg1;
    for (var iRow = 0; iRow < arg0.getRowCount(); iRow++, iRow < arg0.getRowCount() ? retArr.addRow() : true) {
        for (var iCol = 0; iCol < arg0.getCountElementInRow(); iCol++) {
            _arg0 = arg0.getElementRowCol(iRow, iCol);
            _arg1 = arg1.getElementRowCol(iRow, iCol);
            retArr.addElement(_func[_arg0.type][_arg1.type](_arg0, _arg1, what));
        }
    }
    return retArr;
};
_func[cElementType.array][cElementType.number] = _func[cElementType.array][cElementType.string] = _func[cElementType.array][cElementType.bool] = _func[cElementType.array][cElementType.error] = _func[cElementType.array][cElementType.empty] = function (arg0, arg1, what) {
    var res = new cArray();
    arg0.foreach(function (elem, r) {
        if (!res.array[r]) {
            res.addRow();
        }
        res.addElement(_func[elem.type][arg1.type](elem, arg1, what));
    });
    return res;
};
_func[cElementType.number][cElementType.array] = _func[cElementType.string][cElementType.array] = _func[cElementType.bool][cElementType.array] = _func[cElementType.error][cElementType.array] = _func[cElementType.empty][cElementType.array] = function (arg0, arg1, what) {
    var res = new cArray();
    arg1.foreach(function (elem, r) {
        if (!res.array[r]) {
            res.addRow();
        }
        res.addElement(_func[arg0.type][elem.type](arg0, elem, what));
    });
    return res;
};
_func.binarySearch = function (sElem, arrTagert, regExp) {
    var first = 0,
    last = arrTagert.length - 1,
    mid;
    var arrTagertOneType = [],
    isString = false;
    for (var i = 0; i < arrTagert.length; i++) {
        if ((arrTagert[i] instanceof cString || sElem instanceof cString) && !isString) {
            i = 0;
            isString = true;
            sElem = new cString(sElem.value.toLowerCase());
        }
        if (isString) {
            arrTagertOneType[i] = new cString(arrTagert[i].getValue().toLowerCase());
        } else {
            arrTagertOneType[i] = arrTagert[i].tocNumber();
        }
    }
    if (arrTagert.length === 0) {
        return -1;
    } else {
        if (arrTagert[0].value > sElem.value) {
            return -2;
        } else {
            if (arrTagert[arrTagert.length - 1].value < sElem.value) {
                return arrTagert.length - 1;
            }
        }
    }
    while (first < last) {
        mid = Math.floor(first + (last - first) / 2);
        if (sElem.value <= arrTagert[mid].value || (regExp && regExp.test(arrTagert[mid].value))) {
            last = mid;
        } else {
            first = mid + 1;
        }
    }
    if (arrTagert[last].value === sElem.value) {
        return last;
    } else {
        return last - 1;
    }
};
_func[cElementType.number][cElementType.cell] = function (arg0, arg1, what, cellAddress) {
    var ar1 = arg1.tocNumber();
    switch (what) {
    case ">":
        return new cBool(arg0.getValue() > ar1.getValue());
    case ">=":
        return new cBool(arg0.getValue() >= ar1.getValue());
    case "<":
        return new cBool(arg0.getValue() < ar1.getValue());
    case "<=":
        return new cBool(arg0.getValue() <= ar1.getValue());
    case "=":
        return new cBool(arg0.getValue() === ar1.getValue());
    case "<>":
        return new cBool(arg0.getValue() !== ar1.getValue());
    case "-":
        return new cNumber(arg0.getValue() - ar1.getValue());
    case "+":
        return new cNumber(arg0.getValue() + ar1.getValue());
    case "/":
        if (arg1.getValue() !== 0) {
            return new cNumber(arg0.getValue() / ar1.getValue());
        } else {
            return new cError(cErrorType.division_by_zero);
        }
    case "*":
        return new cNumber(arg0.getValue() * ar1.getValue());
    default:
        return new cError(cErrorType.wrong_value_type);
    }
};
_func[cElementType.cell][cElementType.number] = function (arg0, arg1, what, cellAddress) {
    var ar0 = arg0.tocNumber();
    switch (what) {
    case ">":
        return new cBool(ar0.getValue() > arg1.getValue());
    case ">=":
        return new cBool(ar0.getValue() >= arg1.getValue());
    case "<":
        return new cBool(ar0.getValue() < arg1.getValue());
    case "<=":
        return new cBool(ar0.getValue() <= arg1.getValue());
    case "=":
        return new cBool(ar0.getValue() === arg1.getValue());
    case "<>":
        return new cBool(ar0.getValue() !== arg1.getValue());
    case "-":
        return new cNumber(ar0.getValue() - arg1.getValue());
    case "+":
        return new cNumber(ar0.getValue() + arg1.getValue());
    case "/":
        if (arg1.getValue() !== 0) {
            return new cNumber(ar0.getValue() / arg1.getValue());
        } else {
            return new cError(cErrorType.division_by_zero);
        }
    case "*":
        return new cNumber(ar0.getValue() * arg1.getValue());
    default:
        return new cError(cErrorType.wrong_value_type);
    }
};
_func[cElementType.cell][cElementType.cell] = function (arg0, arg1, what, cellAddress) {
    var ar0 = arg0.tocNumber();
    switch (what) {
    case ">":
        return new cBool(ar0.getValue() > arg1.getValue());
    case ">=":
        return new cBool(ar0.getValue() >= arg1.getValue());
    case "<":
        return new cBool(ar0.getValue() < arg1.getValue());
    case "<=":
        return new cBool(ar0.getValue() <= arg1.getValue());
    case "=":
        return new cBool(ar0.getValue() === arg1.getValue());
    case "<>":
        return new cBool(ar0.getValue() !== arg1.getValue());
    case "-":
        return new cNumber(ar0.getValue() - arg1.getValue());
    case "+":
        return new cNumber(ar0.getValue() + arg1.getValue());
    case "/":
        if (arg1.getValue() !== 0) {
            return new cNumber(ar0.getValue() / arg1.getValue());
        } else {
            return new cError(cErrorType.division_by_zero);
        }
    case "*":
        return new cNumber(ar0.getValue() * arg1.getValue());
    default:
        return new cError(cErrorType.wrong_value_type);
    }
};
function parserFormula(formula, _cellId, _ws) {
    this.is3D = false;
    this.cellId = _cellId;
    this.cellAddress = g_oCellAddressUtils.getCellAddress(this.cellId);
    this.ws = _ws;
    this.wb = this.ws.workbook;
    this.value = null;
    this.outStack = [];
    this.error = [];
    this.Formula = formula;
    this.isParsed = false;
    this.pCurrPos = 0;
    this.elemArr = [];
    this.RefPos = [];
    this.operand_str = null;
    this.parenthesesNotEnough = false;
    this.f = [];
    this.reRowCol = new RegExp("^(ROW|ROWS|COLUMN|COLUMNS)$", "gi");
}
parserFormula.prototype = {
    constructor: parserFormula,
    clone: function (formula, cellId, ws) {
        if (null == formula) {
            formula = this.Formula;
        }
        if (null == cellId) {
            cellId = this.cellId;
        }
        if (null == ws) {
            ws = this.ws;
        }
        var oRes = new parserFormula(formula, cellId, ws);
        oRes.is3D = this.is3D;
        oRes.value = this.value;
        oRes.pCurrPos = this.pCurrPos;
        oRes.elemArr = [];
        for (var i = 0, length = this.outStack.length; i < length; i++) {
            var oCurElem = this.outStack[i];
            if (oCurElem.clone) {
                oRes.outStack.push(oCurElem.clone());
            } else {
                oRes.outStack.push(oCurElem);
            }
        }
        oRes.RefPos = [];
        oRes.operand_str = this.operand_str;
        oRes.error = this.error.concat();
        oRes.isParsed = this.isParsed;
        return oRes;
    },
    setFormula: function (formula) {
        this.Formula = formula;
        this.value = null;
        this.pCurrPos = 0;
        this.elemArr = [];
        this.outStack = [];
        this.RefPos = [];
        this.operand_str = null;
    },
    setCellId: function (cellId) {
        this.cellId = cellId;
        this.cellAddress = g_oCellAddressUtils.getCellAddress(cellId);
    },
    parse: function () {
        if (this.isParsed) {
            return this.isParsed;
        }
        var operand_expected = true,
        wasLeftParentheses = false,
        wasRigthParentheses = false,
        found_operand = null,
        _3DRefTmp = null;
        while (this.pCurrPos < this.Formula.length) {
            if (parserHelp.isOperator.call(this, this.Formula, this.pCurrPos)) {
                wasLeftParentheses = false;
                wasRigthParentheses = false;
                found_operator = null;
                if (operand_expected) {
                    if (this.operand_str == "-") {
                        operand_expected = true;
                        found_operator = new cFormulaOperators["un_minus"]();
                    } else {
                        if (this.operand_str == "+") {
                            operand_expected = true;
                            found_operator = new cFormulaOperators["un_plus"]();
                        } else {
                            this.error.push(c_oAscError.ID.FrmlWrongOperator);
                            this.outStack = [];
                            this.elemArr = [];
                            return false;
                        }
                    }
                } else {
                    if (!operand_expected) {
                        if (this.operand_str == "-") {
                            operand_expected = true;
                            found_operator = new cFormulaOperators["-"]();
                        } else {
                            if (this.operand_str == "+") {
                                operand_expected = true;
                                found_operator = new cFormulaOperators["+"]();
                            } else {
                                if (this.operand_str == "%") {
                                    operand_expected = false;
                                    found_operator = new cFormulaOperators["%"]();
                                } else {
                                    if (this.operand_str in cFormulaOperators) {
                                        found_operator = new cFormulaOperators[this.operand_str]();
                                        operand_expected = true;
                                    } else {
                                        this.error.push(c_oAscError.ID.FrmlWrongOperator);
                                        this.outStack = [];
                                        this.elemArr = [];
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                while (this.elemArr.length != 0 && (found_operator.isRightAssociative ? (found_operator.priority < this.elemArr[this.elemArr.length - 1].priority) : (found_operator.priority <= this.elemArr[this.elemArr.length - 1].priority))) {
                    this.outStack.push(this.elemArr.pop());
                }
                this.elemArr.push(found_operator);
                this.f.push(found_operator);
                found_operand = null;
            } else {
                if (parserHelp.isLeftParentheses.call(this, this.Formula, this.pCurrPos)) {
                    if (wasRigthParentheses || found_operand) {
                        this.elemArr.push(new cMultOperator());
                    }
                    operand_expected = true;
                    wasLeftParentheses = true;
                    wasRigthParentheses = false;
                    found_operand = null;
                    this.elemArr.push(new cFormulaOperators[this.operand_str]());
                    this.f.push(new cFormulaOperators[this.operand_str]());
                } else {
                    if (parserHelp.isRightParentheses.call(this, this.Formula, this.pCurrPos)) {
                        this.f.push(new cFormulaOperators[this.operand_str]());
                        wasRigthParentheses = true;
                        var top_elem = null;
                        if (this.elemArr.length != 0 && ((top_elem = this.elemArr[this.elemArr.length - 1]).name == "(") && operand_expected) {
                            if (top_elem.getArguments() > 1) {
                                this.outStack.push(new cEmpty());
                            } else {
                                top_elem.DecrementArguments();
                            }
                        } else {
                            while (this.elemArr.length != 0 && !((top_elem = this.elemArr[this.elemArr.length - 1]).name == "(")) {
                                if (top_elem.name in cFormulaOperators && operand_expected) {
                                    this.error.push(c_oAscError.ID.FrmlOperandExpected);
                                    this.outStack = [];
                                    this.elemArr = [];
                                    return false;
                                }
                                this.outStack.push(this.elemArr.pop());
                            }
                        }
                        if (this.elemArr.length == 0 || top_elem == null) {
                            this.outStack = [];
                            this.elemArr = [];
                            this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
                            return false;
                        }
                        var p = top_elem,
                        func;
                        this.elemArr.pop();
                        if (this.elemArr.length != 0 && (func = this.elemArr[this.elemArr.length - 1]).type == cElementType.func) {
                            p = this.elemArr.pop();
                            if (top_elem.getArguments() > func.getMaxArguments()) {
                                this.outStack = [];
                                this.elemArr = [];
                                this.error.push(c_oAscError.ID.FrmlWrongMaxArgument);
                                return false;
                            } else {
                                if (top_elem.getArguments() >= func.getMinArguments()) {
                                    func.setArgumentsCount(top_elem.getArguments());
                                } else {
                                    this.outStack = [];
                                    this.elemArr = [];
                                    this.error.push(c_oAscError.ID.FrmlWrongCountArgument);
                                    return false;
                                }
                            }
                        } else {
                            if (wasLeftParentheses && (!this.elemArr[this.elemArr.length - 1] || this.elemArr[this.elemArr.length - 1].name == "(")) {
                                this.outStack = [];
                                this.elemArr = [];
                                this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
                                return false;
                            }
                        }
                        this.outStack.push(p);
                        operand_expected = false;
                        wasLeftParentheses = false;
                    } else {
                        if (parserHelp.isComma.call(this, this.Formula, this.pCurrPos)) {
                            wasLeftParentheses = false;
                            wasRigthParentheses = false;
                            var wasLeftParentheses = false;
                            var stackLength = this.elemArr.length;
                            var top_elem = null;
                            if (this.elemArr.length != 0 && this.elemArr[stackLength - 1].name == "(" && operand_expected) {
                                this.outStack.push(new cEmpty());
                                top_elem = this.elemArr[stackLength - 1];
                                wasLeftParentheses = true;
                            } else {
                                while (stackLength != 0) {
                                    top_elem = this.elemArr[stackLength - 1];
                                    if (top_elem.name == "(") {
                                        wasLeftParentheses = true;
                                        break;
                                    } else {
                                        this.outStack.push(this.elemArr.pop());
                                        stackLength = this.elemArr.length;
                                    }
                                }
                            }
                            if (!wasLeftParentheses) {
                                this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
                                this.outStack = [];
                                this.elemArr = [];
                                return false;
                            }
                            top_elem.IncrementArguments();
                            operand_expected = true;
                        } else {
                            if (parserHelp.isArray.call(this, this.Formula, this.pCurrPos)) {
                                wasLeftParentheses = false;
                                wasRigthParentheses = false;
                                var pH = new parserHelper(),
                                tO = {
                                    pCurrPos: 0,
                                    Formula: this.operand_str,
                                    operand_str: ""
                                };
                                var arr = new cArray(),
                                operator = {
                                    isOperator: false,
                                    operatorName: ""
                                };
                                while (tO.pCurrPos < tO.Formula.length) {
                                    if (pH.isComma.call(tO, tO.Formula, tO.pCurrPos)) {
                                        if (tO.operand_str == ";") {
                                            arr.addRow();
                                        }
                                    } else {
                                        if (pH.isBoolean.call(tO, tO.Formula, tO.pCurrPos)) {
                                            arr.addElement(new cBool(tO.operand_str));
                                        } else {
                                            if (pH.isString.call(tO, tO.Formula, tO.pCurrPos)) {
                                                arr.addElement(new cString(tO.operand_str));
                                            } else {
                                                if (pH.isError.call(tO, tO.Formula, tO.pCurrPos)) {
                                                    arr.addElement(new cError(tO.operand_str));
                                                } else {
                                                    if (pH.isNumber.call(tO, tO.Formula, tO.pCurrPos)) {
                                                        if (operator.isOperator) {
                                                            if (operator.operatorName == "+" || operator.operatorName == "-") {
                                                                tO.operand_str = operator.operatorName + "" + tO.operand_str;
                                                            } else {
                                                                this.outStack = [];
                                                                this.elemArr = [];
                                                                this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
                                                                return false;
                                                            }
                                                        }
                                                        arr.addElement(new cNumber(parseFloat(tO.operand_str)));
                                                        operator = {
                                                            isOperator: false,
                                                            operatorName: ""
                                                        };
                                                    } else {
                                                        if (pH.isOperator.call(tO, tO.Formula, tO.pCurrPos)) {
                                                            operator.isOperator = true;
                                                            operator.operatorName = tO.operand_str;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!arr.isValidArray()) {
                                    this.outStack = [];
                                    this.elemArr = [];
                                    this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
                                    return false;
                                }
                                this.outStack.push(arr);
                                operand_expected = false;
                            } else {
                                found_operand = null;
                                if (wasRigthParentheses) {
                                    operand_expected = true;
                                }
                                if (!operand_expected) {
                                    this.error.push(c_oAscError.ID.FrmlWrongOperator);
                                    this.outStack = [];
                                    this.elemArr = [];
                                    return false;
                                }
                                if (parserHelp.isBoolean.call(this, this.Formula, this.pCurrPos)) {
                                    found_operand = new cBool(this.operand_str);
                                } else {
                                    if (parserHelp.isString.call(this, this.Formula, this.pCurrPos)) {
                                        found_operand = new cString(this.operand_str);
                                    } else {
                                        if (parserHelp.isError.call(this, this.Formula, this.pCurrPos)) {
                                            found_operand = new cError(this.operand_str);
                                        } else {
                                            if ((_3DRefTmp = parserHelp.is3DRef.call(this, this.Formula, this.pCurrPos))[0]) {
                                                this.is3D = true;
                                                var _wsFrom = _3DRefTmp[1],
                                                _wsTo = ((_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined)) ? _3DRefTmp[2] : _wsFrom;
                                                if (! (this.wb.getWorksheetByName(_wsFrom) && this.wb.getWorksheetByName(_wsTo))) {
                                                    this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
                                                    this.outStack = [];
                                                    this.elemArr = [];
                                                    return false;
                                                }
                                                if (parserHelp.isArea.call(this, this.Formula, this.pCurrPos)) {
                                                    this.RefPos.push({
                                                        start: this.pCurrPos - this.operand_str.length,
                                                        end: this.pCurrPos,
                                                        index: this.outStack.length
                                                    });
                                                    found_operand = new cArea3D(this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb);
                                                    if (this.operand_str.indexOf("$") > -1) {
                                                        found_operand.isAbsolute = true;
                                                    }
                                                } else {
                                                    if (parserHelp.isRef.call(this, this.Formula, this.pCurrPos)) {
                                                        this.RefPos.push({
                                                            start: this.pCurrPos - this.operand_str.length,
                                                            end: this.pCurrPos,
                                                            index: this.outStack.length
                                                        });
                                                        if (_wsTo != _wsFrom) {
                                                            found_operand = new cArea3D(this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb);
                                                        } else {
                                                            found_operand = new cRef3D(this.operand_str.toUpperCase(), _wsFrom, this.wb);
                                                        }
                                                        if (this.operand_str.indexOf("$") > -1) {
                                                            found_operand.isAbsolute = true;
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (parserHelp.isName.call(this, this.Formula, this.pCurrPos, this.wb, this.ws)[0]) {
                                                    found_operand = new cName(this.operand_str, this.wb);
                                                } else {
                                                    if (parserHelp.isArea.call(this, this.Formula, this.pCurrPos)) {
                                                        this.RefPos.push({
                                                            start: this.pCurrPos - this.operand_str.length,
                                                            end: this.pCurrPos,
                                                            index: this.outStack.length
                                                        });
                                                        found_operand = new cArea(this.operand_str.toUpperCase(), this.ws);
                                                        if (this.operand_str.indexOf("$") > -1) {
                                                            found_operand.isAbsolute = true;
                                                        }
                                                    } else {
                                                        if (parserHelp.isRef.call(this, this.Formula, this.pCurrPos, true)) {
                                                            this.RefPos.push({
                                                                start: this.pCurrPos - this.operand_str.length,
                                                                end: this.pCurrPos,
                                                                index: this.outStack.length
                                                            });
                                                            found_operand = new cRef(this.operand_str.toUpperCase(), this.ws);
                                                            if (this.operand_str.indexOf("$") > -1) {
                                                                found_operand.isAbsolute = true;
                                                            }
                                                        } else {
                                                            if (parserHelp.isNumber.call(this, this.Formula, this.pCurrPos)) {
                                                                if (this.operand_str != ".") {
                                                                    found_operand = new cNumber(parseFloat(this.operand_str));
                                                                } else {
                                                                    this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
                                                                    this.outStack = [];
                                                                    this.elemArr = [];
                                                                    return false;
                                                                }
                                                            } else {
                                                                if (parserHelp.isFunc.call(this, this.Formula, this.pCurrPos)) {
                                                                    if (wasRigthParentheses && operand_expected) {
                                                                        this.elemArr.push(new cMultOperator());
                                                                    }
                                                                    var found_operator = null;
                                                                    if (this.operand_str.toUpperCase() in cFormulaFunction.Mathematic) {
                                                                        found_operator = new cFormulaFunction.Mathematic[this.operand_str.toUpperCase()]();
                                                                    } else {
                                                                        if (this.operand_str.toUpperCase() in cFormulaFunction.Logical) {
                                                                            found_operator = new cFormulaFunction.Logical[this.operand_str.toUpperCase()]();
                                                                        } else {
                                                                            if (this.operand_str.toUpperCase() in cFormulaFunction.Information) {
                                                                                found_operator = new cFormulaFunction.Information[this.operand_str.toUpperCase()]();
                                                                            } else {
                                                                                if (this.operand_str.toUpperCase() in cFormulaFunction.Statistical) {
                                                                                    found_operator = new cFormulaFunction.Statistical[this.operand_str.toUpperCase()]();
                                                                                } else {
                                                                                    if (this.operand_str.toUpperCase() in cFormulaFunction.TextAndData) {
                                                                                        found_operator = new cFormulaFunction.TextAndData[this.operand_str.toUpperCase()]();
                                                                                    } else {
                                                                                        if (this.operand_str.toUpperCase() in cFormulaFunction.Cube) {
                                                                                            found_operator = new cFormulaFunction.Cube[this.operand_str.toUpperCase()]();
                                                                                        } else {
                                                                                            if (this.operand_str.toUpperCase() in cFormulaFunction.Database) {
                                                                                                found_operator = new cFormulaFunction.Database[this.operand_str.toUpperCase()]();
                                                                                            } else {
                                                                                                if (this.operand_str.toUpperCase() in cFormulaFunction.DateAndTime) {
                                                                                                    found_operator = new cFormulaFunction.DateAndTime[this.operand_str.toUpperCase()]();
                                                                                                } else {
                                                                                                    if (this.operand_str.toUpperCase() in cFormulaFunction.Engineering) {
                                                                                                        found_operator = new cFormulaFunction.Engineering[this.operand_str.toUpperCase()]();
                                                                                                    } else {
                                                                                                        if (this.operand_str.toUpperCase() in cFormulaFunction.Financial) {
                                                                                                            found_operator = new cFormulaFunction.Financial[this.operand_str.toUpperCase()]();
                                                                                                        } else {
                                                                                                            if (this.operand_str.toUpperCase() in cFormulaFunction.LookupAndReference) {
                                                                                                                found_operator = new cFormulaFunction.LookupAndReference[this.operand_str.toUpperCase()]();
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
                                                                    }
                                                                    if (found_operator !== null && found_operator !== undefined) {
                                                                        this.elemArr.push(found_operator);
                                                                        this.f.push(found_operator);
                                                                    } else {
                                                                        this.error.push(c_oAscError.ID.FrmlWrongFunctionName);
                                                                        this.outStack = [];
                                                                        this.elemArr = [];
                                                                        return false;
                                                                    }
                                                                    operand_expected = false;
                                                                    wasRigthParentheses = false;
                                                                    continue;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (found_operand != null && found_operand != undefined) {
                                    this.outStack.push(found_operand);
                                    this.f.push(found_operand);
                                    operand_expected = false;
                                    found_operand = null;
                                } else {
                                    this.outStack.push(new cName(this.operand_str, this.wb));
                                    operand_expected = false;
                                    if (this.operand_str != null) {
                                        this.pCurrPos += this.operand_str.length;
                                    }
                                }
                                if (wasRigthParentheses) {
                                    this.elemArr.push(new cMultOperator());
                                }
                                wasLeftParentheses = false;
                                wasRigthParentheses = false;
                            }
                        }
                    }
                }
            }
        }
        if (operand_expected) {
            this.outStack = [];
            this.elemArr = [];
            this.error.push(c_oAscError.ID.FrmlOperandExpected);
            return false;
        }
        var operand, parenthesesNotEnough = false;
        while (this.elemArr.length != 0) {
            operand = this.elemArr.pop();
            if (operand.name == "(" && !this.parenthesesNotEnough) {
                this.Formula += ")";
                parenthesesNotEnough = true;
            } else {
                if (operand.name == "(" || operand.name == ")") {
                    this.outStack = [];
                    this.elemArr = [];
                    this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
                    return false;
                } else {
                    this.outStack.push(operand);
                }
            }
        }
        this.parenthesesNotEnough = parenthesesNotEnough;
        if (this.parenthesesNotEnough) {
            this.error.push(c_oAscError.ID.FrmlParenthesesCorrectCount);
            return this.isParsed = false;
        }
        if (this.outStack.length != 0) {
            return this.isParsed = true;
        } else {
            return this.isParsed = false;
        }
    },
    calculate: function () {
        if (this.outStack.length < 1) {
            return this.value = new cError(cErrorType.wrong_name);
        }
        var elemArr = [],
        stack = [],
        _tmp,
        numFormat = -1;
        for (var i = 0; i < this.outStack.length; i++) {
            _tmp = this.outStack[i];
            if (_tmp instanceof cName) {
                _tmp = _tmp.toRef(this.ws.getId());
            }
            stack[i] = _tmp;
        }
        var currentElement = null;
        while (stack.length != 0) {
            currentElement = stack.shift();
            if (currentElement.name == "(") {
                continue;
            }
            if (currentElement.type == cElementType.operator || currentElement.type == cElementType.func) {
                if (elemArr.length < currentElement.getArguments()) {
                    elemArr = [];
                    return this.value = new cError(cErrorType.unsupported_function);
                } else {
                    var arg = [];
                    for (var ind = 0; ind < currentElement.getArguments(); ind++) {
                        arg.unshift(elemArr.pop());
                    }
                    _tmp = currentElement.Calculate(arg, this.ws.getCell(this.cellAddress));
                    if (_tmp.numFormat !== undefined && _tmp.numFormat !== null) {
                        numFormat = _tmp.numFormat;
                    } else {
                        if (numFormat < 0 || currentElement.numFormat < currentElement.formatType.def) {
                            numFormat = currentElement.numFormat;
                        }
                    }
                    elemArr.push(_tmp);
                }
            } else {
                elemArr.push(currentElement);
            }
        }
        this.value = elemArr.pop();
        this.value.numFormat = numFormat;
        return this.value;
    },
    getRef: function () {
        var aOutRef = [];
        for (var i = 0; i < this.outStack.length; i++) {
            var ref = this.outStack[i];
            if (ref instanceof cName) {
                ref = ref.toRef(this.ws.getId());
                if (ref instanceof cError) {
                    continue;
                }
            }
            if (ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea) {
                aOutRef.push({
                    wsId: ref.ws.getWsId(),
                    cell: ref._cells
                });
            } else {
                if (ref instanceof cArea3D) {
                    var wsR = ref.wsRange();
                    for (var j = 0; j < wsR.length; j++) {
                        aOutRef.push({
                            wsId: wsR[a].Id,
                            cell: ref._cells
                        });
                    }
                }
            }
        }
        return aOutRef;
    },
    changeOffset: function (offset) {
        for (var i = 0; i < this.outStack.length; i++) {
            if (this.outStack[i] instanceof cRef || this.outStack[i] instanceof cRef3D || this.outStack[i] instanceof cArea) {
                var r = this.outStack[i].getRange();
                if (!r) {
                    break;
                }
                if (this.outStack[i].isAbsolute) {
                    this._changeOffsetHelper(this.outStack[i], offset);
                } else {
                    var a, b;
                    if (this.outStack[i] instanceof cArea && (r.isColumn() && offset.offsetRow != 0 || r.isRow() && offset.offsetCol != 0)) {
                        continue;
                    }
                    r.setOffset(offset);
                    if (r.isColumn()) {
                        a = r.first.getColLetter();
                        b = r.last.getColLetter();
                    } else {
                        if (r.isRow()) {
                            a = r.first.getRow();
                            b = r.last.getRow();
                        } else {
                            a = r.first.getID();
                            b = r.last.getID();
                        }
                    }
                    if (a != b || this.outStack[i] instanceof cArea) {
                        this.outStack[i].value = this.outStack[i]._cells = a + ":" + b;
                    } else {
                        this.outStack[i].value = this.outStack[i]._cells = a;
                    }
                }
                continue;
            }
            if (this.outStack[i] instanceof cArea3D) {
                var r = this.outStack[i]._cells.indexOf(":") > -1 ? (new cArea(this.outStack[i]._cells, this.ws)) : (new cRef(this.outStack[i]._cells, this.ws));
                var _r = r.getRange();
                if (!_r) {
                    break;
                }
                if (this.outStack[i].isAbsolute) {
                    this._changeOffsetHelper(r, offset);
                } else {
                    _r.setOffset(offset);
                    var a = _r.first.getID(),
                    b = _r.last.getID();
                    if (a != b) {
                        r.value = r._cells = a + ":" + b;
                    } else {
                        r.value = r._cells = a;
                    }
                }
                this.outStack[i]._cells = r._cells;
            }
        }
        return this;
    },
    setRefError: function (node) {
        for (var i = 0; i < this.outStack.length; i++) {
            var elem = this.outStack[i];
            if (elem instanceof cRef || elem instanceof cArea || elem instanceof cRef3D) {
                if (node.sheetId == elem.ws.getId() && node.cellId == elem._cells) {
                    this.outStack[i] = new cError(cErrorType.bad_reference);
                }
            } else {
                if (elem instanceof cArea3D) {
                    if (elem.wsFrom == elem.wsTo && node.sheetId == elem.wsFrom && node.cellId == elem._cells) {
                        this.outStack[i] = new cError(cErrorType.bad_reference);
                    }
                }
            }
        }
    },
    shiftCells: function (node, from, to) {
        var sFromName = from.getName();
        for (var i = 0; i < this.outStack.length; i++) {
            var elem = this.outStack[i];
            if (elem instanceof cRef || elem instanceof cArea) {
                if (node.sheetId == elem.ws.getId() && sFromName == elem._cells) {
                    elem.value = elem._cells = node.cellId;
                    elem.range = elem.ws.getRange3(to.r1, to.c1, to.r2, to.c2);
                }
            } else {
                if (elem instanceof cRef3D) {
                    if (node.sheetId == elem.ws.getId() && sFromName == elem._cells) {
                        elem.value = elem._cells = node.cellId;
                    }
                } else {
                    if (elem instanceof cArea3D) {
                        if (elem.wsFrom == elem.wsTo && node.sheetId == elem.wsFrom && sFromName == elem._cells) {
                            elem.value = elem._cells = node.cellId;
                        }
                    }
                }
            }
        }
    },
    stretchArea: function (node, from, to) {
        var sFromName = from.getName();
        for (var i = 0; i < this.outStack.length; i++) {
            var elem = this.outStack[i];
            if (elem instanceof cArea) {
                if (node.sheetId == elem.ws.getId() && sFromName == elem._cells) {
                    elem.value = elem._cells = node.cellId;
                    elem.range = elem.ws.getRange3(to.r1, to.c1, to.r2, to.c2);
                }
            } else {
                if (elem instanceof cArea3D) {
                    if (elem.wsFrom == elem.wsTo && node.sheetId == elem.wsFrom && sFromName == elem._cells) {
                        elem.value = elem._cells = node.cellId;
                    }
                }
            }
        }
    },
    changeSheet: function (lastName, newName) {
        if (this.is3D) {
            for (var i = 0; i < this.outStack.length; i++) {
                if (this.outStack[i] instanceof cRef3D && this.outStack[i].ws.getName() == lastName) {
                    this.outStack[i].changeSheet(lastName, newName);
                }
                if (this.outStack[i] instanceof cArea3D) {
                    this.outStack[i].changeSheet(lastName, newName);
                }
            }
        }
        return this;
    },
    assemble: function (rFormula) {
        if (!rFormula && this.outStack.length == 1 && this.outStack[this.outStack.length - 1] instanceof cError) {
            return this.Formula;
        }
        var currentElement = null,
        _count = this.outStack.length,
        elemArr = new Array(_count),
        res = undefined;
        for (var i = 0, j = 0; i < _count; i++, j++) {
            currentElement = this.outStack[i];
            if (currentElement.type == cElementType.operator || currentElement.type == cElementType.func) {
                var _count_arg = currentElement.getArguments();
                res = currentElement.Assemble2(elemArr, j - _count_arg, _count_arg);
                j -= _count_arg;
                elemArr[j] = res;
            } else {
                if (currentElement instanceof cString) {
                    currentElement = new cString('"' + currentElement.toString() + '"');
                }
                res = currentElement;
                elemArr[j] = res;
            }
        }
        if (res != undefined && res != null) {
            return res.toString();
        } else {
            return this.Formula;
        }
    },
    _changeOffsetHelper: function (ref, offset) {
        var m = ref._cells.match(/\$/g);
        if (m.length == 1) {
            if (! (ref instanceof cArea)) {
                if (ref._cells.indexOf("$") == 0) {
                    r = ref.getRange();
                    r.setOffset({
                        offsetCol: 0,
                        offsetRow: offset.offsetRow
                    });
                    ref.value = ref._cells = "$" + r.first.getID();
                } else {
                    r = ref.getRange();
                    r.setOffset({
                        offsetCol: offset.offsetCol,
                        offsetRow: 0
                    });
                    ref.value = ref._cells = r.first.getColLetter() + "$" + r.first.getRow();
                }
            } else {
                var r = ref.getRange();
                var c = ref._cells.split(":");
                if (c[0].indexOf("$") > -1) {
                    if (c[0].indexOf("$") == 0) {
                        r.first.moveRow(offset.offsetRow);
                        r.last.moveCol(offset.offsetCol);
                        r.last.moveRow(offset.offsetRow);
                        ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow());
                    } else {
                        r.first.moveCol(offset.offsetCol);
                        r.last.moveCol(offset.offsetCol);
                        r.last.moveRow(offset.offsetRow);
                        ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow());
                    }
                } else {
                    if (c[1].indexOf("$") == 0) {
                        r.first.moveCol(offset.offsetCol);
                        r.first.moveRow(offset.offsetRow);
                        r.last.moveRow(offset.offsetRow);
                        ref.setRange(r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow());
                    } else {
                        r.first.moveCol(offset.offsetCol);
                        r.first.moveRow(offset.offsetRow);
                        r.last.moveCol(offset.offsetCol);
                        ref.setRange(r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
                    }
                }
            }
        } else {
            if (m.length == 2) {
                if (ref instanceof cArea) {
                    var r = ref.getRange();
                    var c = ref._cells.split(":");
                    if (c[1].indexOf("$") < 0) {
                        r.last.moveCol(offset.offsetCol);
                        r.last.moveRow(offset.offsetRow);
                        ref.setRange("$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + r.last.getRow());
                    } else {
                        if (c[0].indexOf("$") < 0) {
                            r.first.moveCol(offset.offsetCol);
                            r.first.moveRow(offset.offsetRow);
                            ref.setRange(r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow());
                        } else {
                            if (c[0].indexOf("$") == 0 && c[1].indexOf("$") == 0) {
                                r.first.moveRow(offset.offsetRow);
                                r.last.moveRow(offset.offsetRow);
                                ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow());
                            } else {
                                if (c[0].indexOf("$") == 0 && c[1].indexOf("$") > 0) {
                                    r.first.moveRow(offset.offsetRow);
                                    r.last.moveCol(offset.offsetCol);
                                    ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
                                } else {
                                    if (c[0].indexOf("$") > 0 && c[1].indexOf("$") == 0) {
                                        r.first.moveCol(offset.offsetCol);
                                        r.last.moveRow(offset.offsetRow);
                                        ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow());
                                    } else {
                                        r.first.moveCol(offset.offsetCol);
                                        r.last.moveCol(offset.offsetCol);
                                        ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (m.length == 3) {
                    if (ref instanceof cArea) {
                        var r = ref.getRange();
                        var c = ref._cells.split(":");
                        if (c[0].match(/\$/g).length == 2 && c[1].indexOf("$") == 0) {
                            r.last.moveRow(offset.offsetRow);
                            ref.setRange("$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + r.last.getRow());
                        } else {
                            if (c[0].match(/\$/g).length == 2 && c[1].indexOf("$") > 0) {
                                r.last.moveCol(offset.offsetCol);
                                ref.setRange("$" + r.first.getColLetter() + "$" + r.first.getRow() + ":" + r.last.getColLetter() + "$" + r.last.getRow());
                            } else {
                                if (c[1].match(/\$/g).length == 2 && c[0].indexOf("$") == 0) {
                                    r.first.moveRow(offset.offsetRow);
                                    ref.setRange("$" + r.first.getColLetter() + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow());
                                } else {
                                    if (c[1].match(/\$/g).length == 2 && c[0].indexOf("$") > 0) {
                                        r.first.moveCol(offset.offsetCol);
                                        ref.setRange(r.first.getColLetter() + "$" + r.first.getRow() + ":" + "$" + r.last.getColLetter() + "$" + r.last.getRow());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    insertSheet: function (index) {
        var bRes = false;
        for (var i = 0; i < this.outStack.length; i++) {
            var elem = this.outStack[i];
            if (elem instanceof cArea3D) {
                var wsTo = this.wb.getWorksheetById(elem.wsTo);
                var wsToIndex = wsTo.getIndex();
                var wsFrom = this.wb.getWorksheetById(elem.wsFrom);
                var wsFromIndex = wsFrom.getIndex();
                if (wsFromIndex <= index && index <= wsToIndex) {
                    bRes = true;
                }
            }
        }
        return bRes;
    },
    moveSheet: function (tempW) {
        var nRes = 0;
        for (var i = 0; i < this.outStack.length; i++) {
            var elem = this.outStack[i];
            if (elem instanceof cArea3D) {
                var wsTo = this.wb.getWorksheetById(elem.wsTo);
                var wsToIndex = wsTo.getIndex();
                var wsFrom = this.wb.getWorksheetById(elem.wsFrom);
                var wsFromIndex = wsFrom.getIndex();
                if (wsFromIndex <= tempW.wFI && tempW.wFI <= wsToIndex && 0 == nRes) {
                    nRes = 1;
                }
                if (elem.wsFrom == tempW.wFId) {
                    if (tempW.wTI > wsToIndex) {
                        nRes = 2;
                        var wsNext = this.wb.getWorksheet(wsFromIndex + 1);
                        if (wsNext) {
                            this.outStack[i].changeSheet(tempW.wFN, wsNext.getName());
                        } else {
                            this.outStack[i] = new cError(cErrorType.bad_reference);
                        }
                    }
                } else {
                    if (elem.wsTo == tempW.wFId) {
                        if (tempW.wTI <= wsFromIndex) {
                            nRes = 2;
                            var wsPrev = this.wb.getWorksheet(wsToIndex - 1);
                            if (wsPrev) {
                                this.outStack[i].changeSheet(tempW.wFN, wsPrev.getName());
                            } else {
                                this.outStack[i] = new cError(cErrorType.bad_reference);
                            }
                        }
                    }
                }
            }
        }
        return nRes;
    },
    removeSheet: function (sheetId) {
        var bRes = false;
        var ws = this.wb.getWorksheetById(sheetId);
        if (ws) {
            var wsIndex = ws.getIndex();
            var wsPrev = null;
            if (wsIndex > 0) {
                wsPrev = this.wb.getWorksheet(wsIndex - 1);
            }
            var wsNext = null;
            if (wsIndex < this.wb.getWorksheetCount() - 1) {
                wsNext = this.wb.getWorksheet(wsIndex + 1);
            }
            for (var i = 0; i < this.outStack.length; i++) {
                var elem = this.outStack[i];
                if (elem instanceof cArea3D) {
                    bRes = true;
                    if (elem.wsFrom == sheetId) {
                        if (elem.wsTo != sheetId && null != wsNext) {
                            this.outStack[i].changeSheet(ws.getName(), wsNext.getName());
                        } else {
                            this.outStack[i] = new cError(cErrorType.bad_reference);
                        }
                    } else {
                        if (elem.wsTo == sheetId && null != wsPrev) {
                            this.outStack[i].changeSheet(ws.getName(), wsPrev.getName());
                        }
                    }
                }
            }
        }
        return bRes;
    },
    buildDependencies: function () {
        var node = this.wb.dependencyFormulas.addNode(this.ws.Id, this.cellId),
        ref,
        nTo,
        wsR;
        for (var i = 0; i < this.outStack.length; i++) {
            ref = this.outStack[i];
            if (ref instanceof cName) {
                ref = ref.toRef(this.ws.getId());
                if (ref instanceof cError) {
                    continue;
                }
            }
            if ((ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea || ref instanceof cArea3D) && ref.isValid() && this.outStack[i + 1] && this.outStack[i + 1] instanceof cBaseFunction && this.reRowCol.test(this.outStack[i + 1].name)) {
                this.reRowCol.lastIndex = 0;
                continue;
            }
            if ((ref instanceof cRef || ref instanceof cRef3D || ref instanceof cArea) && ref.isValid()) {
                nTo = this.wb.dependencyFormulas.addNode(ref.getWsId(), ref._cells.replace(/\$/g, ""));
                this.wb.dependencyFormulas.addEdge2(node, nTo);
            } else {
                if (ref instanceof cArea3D && ref.isValid()) {
                    wsR = ref.wsRange();
                    for (var j = 0; j < wsR.length; j++) {
                        this.wb.dependencyFormulas.addEdge(this.ws.Id, this.cellId.replace(/\$/g, ""), wsR[j].Id, ref._cells.replace(/\$/g, ""));
                    }
                }
            }
        }
    },
    parseDiagramRef: function () {
        var res = [[]];
        while (this.pCurrPos < this.Formula.length) {
            if (parserHelp.isComma.call(this, this.Formula, this.pCurrPos)) {
                if (this.operand_str == ";") {
                    res.push([]);
                }
            } else {
                var _3DRefTmp = null;
                if ((_3DRefTmp = parserHelp.is3DRef.call(this, this.Formula, this.pCurrPos))[0]) {
                    this.is3D = true;
                    var _wsFrom = _3DRefTmp[1],
                    _wsTo = ((_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined)) ? _3DRefTmp[2] : _wsFrom;
                    if (parserHelp.isArea.call(this, this.Formula, this.pCurrPos)) {
                        res[res.length - 1].push({
                            sheetNameFrom: _wsFrom,
                            sheetNameTo: _wsTo,
                            ref: this.operand_str.toUpperCase()
                        });
                    } else {
                        if (parserHelp.isRef.call(this, this.Formula, this.pCurrPos)) {
                            res[res.length - 1].push({
                                sheetNameFrom: _wsFrom,
                                sheetNameTo: _wsTo,
                                ref: this.operand_str.toUpperCase()
                            });
                        }
                    }
                }
            }
        }
        return res;
    }
};
function parseNum(str) {
    if (str.indexOf("x") > -1 || str == "" || str.match(/\s+/)) {
        return false;
    }
    return !isNaN(str);
}
function matching(x, y, oper) {
    var res = false,
    rS;
    if (y instanceof cString) {
        rS = searchRegExp2(x.value, y.toString());
        switch (oper) {
        case "<>":
            res = !rS;
            break;
        case "=":
            default:
            res = rS;
            break;
        }
    } else {
        if (typeof x === typeof y) {
            switch (oper) {
            case "<>":
                res = (x.value != y.value);
                break;
            case ">":
                res = (x.value > y.value);
                break;
            case "<":
                res = (x.value < y.value);
                break;
            case ">=":
                res = (x.value >= y.value);
                break;
            case "<=":
                res = (x.value <= y.value);
                break;
            case "=":
                default:
                res = (x.value == y.value);
                break;
            }
        }
    }
    return res;
}
function GetDiffDate360(nDay1, nMonth1, nYear1, nDay2, nMonth2, nYear2, bUSAMethod) {
    var nDayDiff;
    var startTime = new Date(nYear1, nMonth1 - 1, nDay1),
    endTime = new Date(nYear2, nMonth2 - 1, nDay2),
    nY,
    nM,
    nD;
    if (startTime > endTime) {
        nY = nYear1;
        nYear1 = nYear2;
        nYear2 = nY;
        nM = nMonth1;
        nMonth1 = nMonth2;
        nMonth2 = nM;
        nD = nDay1;
        nDay1 = nDay2;
        nDay2 = nD;
    }
    if (bUSAMethod) {
        if (nDay1 == 31) {
            nDay1--;
        }
        if (nDay1 == 30 && nDay2 == 31) {
            nDay2--;
        } else {
            if (nMonth1 == 2 && nDay1 == (new Date(nYear1, 0, 1).isLeapYear() ? 29 : 28)) {
                nDay1 = 30;
                if (nMonth2 == 2 && nDay2 == (new Date(nYear2, 0, 1).isLeapYear() ? 29 : 28)) {
                    nDay2 = 30;
                }
            }
        }
    } else {
        if (nDay1 == 31) {
            nDay1--;
        }
        if (nDay2 == 31) {
            nDay2--;
        }
    }
    nDayDiff = (nYear2 - nYear1) * 360 + (nMonth2 - nMonth1) * 30 + (nDay2 - nDay1);
    return nDayDiff;
}
function searchRegExp(str, flags) {
    var vFS = str.replace(/(\\)/g, "\\").replace(/(\^)/g, "\\^").replace(/(\()/g, "\\(").replace(/(\))/g, "\\)").replace(/(\+)/g, "\\+").replace(/(\[)/g, "\\[").replace(/(\])/g, "\\]").replace(/(\{)/g, "\\{").replace(/(\})/g, "\\}").replace(/(\$)/g, "\\$").replace(/(~)?\*/g, function ($0, $1) {
        return $1 ? $0 : "(.*)";
    }).replace(/(~)?\?/g, function ($0, $1) {
        return $1 ? $0 : ".{1}";
    }).replace(/(~\*)/g, "\\*").replace(/(~\?)/g, "\\?");
    return new RegExp(vFS + "$", flags ? flags : "i");
}
function searchRegExp2(s, mask) {
    var bRes = true;
    var s = s.toString().toLowerCase();
    var mask = mask.toString().toLowerCase();
    var nSIndex = 0;
    var nMaskIndex = 0;
    var nSLastIndex = 0;
    var nMaskLastIndex = 0;
    var nSLength = s.length;
    var nMaskLength = mask.length;
    var t = false;
    for (; nSIndex < nSLength; nMaskIndex++, nSIndex++, t = false) {
        var cCurMask = mask[nMaskIndex];
        if ("~" == cCurMask) {
            nMaskIndex++;
            cCurMask = mask[nMaskIndex];
            t = true;
        } else {
            if ("*" == cCurMask) {
                break;
            }
        }
        if ((cCurMask != s[nSIndex] && "?" != cCurMask) || (cCurMask != s[nSIndex] && t)) {
            bRes = false;
            break;
        }
    }
    if (bRes) {
        while (1) {
            var cCurMask = mask[nMaskIndex];
            if (nSIndex >= nSLength) {
                while ("*" == cCurMask && nMaskIndex < nMaskLength) {
                    nMaskIndex++;
                    cCurMask = mask[nMaskIndex];
                }
                bRes = nMaskIndex >= nMaskLength;
                break;
            } else {
                if ("*" == cCurMask) {
                    nMaskIndex++;
                    if (nMaskIndex >= nMaskLength) {
                        bRes = true;
                        break;
                    }
                    nSLastIndex = nSIndex + 1;
                    nMaskLastIndex = nMaskIndex;
                } else {
                    if (cCurMask != s[nSIndex] && "?" != cCurMask) {
                        nMaskIndex = nMaskLastIndex;
                        nSIndex = nSLastIndex++;
                    } else {
                        nSIndex++;
                        nMaskIndex++;
                    }
                }
            }
        }
    }
    return bRes;
}
var maxGammaArgument = 171.624376956302;
function lcl_Erf0065(x) {
    var pn = [1.128379167095513, 0.1358948876272779, 0.04032594885317953, 0.001203393808630795, 6.492545564819044e-05],
    qn = [1, 0.4537670417800025, 0.08699362226153859, 0.008497173711686934, 0.0003649152806293511];
    var pSum = 0,
    qSum = 0,
    xPow = 1;
    for (var i = 0; i <= 4; ++i) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow *= x * x;
    }
    return x * pSum / qSum;
}
function lcl_Erfc0600(x) {
    var pSum = 0,
    qSum = 0,
    xPow = 1,
    pn, qn;
    if (x < 2.2) {
        pn = [0.9999999920497991, 1.331541639367653, 0.8781158041558818, 0.3318995595782132, 0.07141938325067761, 0.007069408437632531];
        qn = [1, 2.459920701442455, 2.653839728697757, 1.618766555438714, 0.5946513112864815, 0.126579413030178, 0.01253049365494134];
    } else {
        pn = [0.9999211400097144, 1.623565844893667, 1.267399014558732, 0.5815285741777412, 0.1572896207428387, 0.02257169829192176];
        qn = [1, 2.751438706763762, 3.373673346572845, 2.385741947853444, 1.050740046148272, 0.278788439273629, 0.04000729645268614];
    }
    for (var i = 0; i < 6; ++i) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow *= x;
    }
    qSum += qn[6] * xPow;
    return Math.exp(-1 * x * x) * pSum / qSum;
}
function lcl_Erfc2654(x) {
    var pn = [0.5641895835477561, 8.802537461055257, 38.46831037161173, 47.72099658744364, 8.080407290523016],
    qn = [1, 16.1020914205869, 75.48435056659548, 112.123870801026, 37.39975701450408];
    var pSum = 0,
    qSum = 0,
    xPow = 1;
    for (var i = 0; i <= 4; ++i) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow /= x * x;
    }
    return Math.exp(-1 * x * x) * pSum / (x * qSum);
}
function rtl_math_erf(x) {
    if (x == 0) {
        return 0;
    }
    var bNegative = false;
    if (x < 0) {
        x = Math.abs(x);
        bNegative = true;
    }
    var res = 1;
    if (x < 1e-10) {
        res = parseFloat(x * 1.128379167095513);
    } else {
        if (x < 0.65) {
            res = lcl_Erf0065(x);
        } else {
            res = 1 - rtl_math_erfc(x);
        }
    }
    if (bNegative) {
        res *= -1;
    }
    return res;
}
function rtl_math_erfc(x) {
    if (x == 0) {
        return 1;
    }
    var bNegative = false;
    if (x < 0) {
        x = Math.abs(x);
        bNegative = true;
    }
    var fErfc = 0;
    if (x >= 0.65) {
        if (x < 6) {
            fErfc = lcl_Erfc0600(x);
        } else {
            fErfc = lcl_Erfc2654(x);
        }
    } else {
        fErfc = 1 - rtl_math_erf(x);
    }
    if (bNegative) {
        fErfc = 2 - fErfc;
    }
    return fErfc;
}
function integralPhi(x) {
    return 0.5 * rtl_math_erfc(-x * 0.7071067811865475);
}
function phi(x) {
    return 0.3989422804014327 * Math.exp(-(x * x) / 2);
}
function taylor(pPolynom, nMax, x) {
    var nVal = pPolynom[nMax];
    for (var i = nMax - 1; i >= 0; i--) {
        nVal = pPolynom[i] + (nVal * x);
    }
    return nVal;
}
function gauss(x) {
    var t0 = [0.3989422804014327, -0.06649038006690546, 0.00997355701003582, -0.00118732821548045, 0.00011543468761616, -9.4446562595e-06, 6.6596935163e-07, -4.122667415e-08, 2.27352982e-09, 1.1301172e-10, 5.11243e-12, -2.1218e-13],
    t2 = [0.4772498680518208, 0.05399096651318805, -0.05399096651318805, 0.02699548325659403, -0.00449924720943234, -0.00224962360471617, 0.0013497741628297, -0.0001178374269137, -0.00011515930357476, 3.704737285544e-05, 2.82690796889e-06, -3.54513195524e-06, 3.7669563126e-07, 1.9202407921e-07, -5.22690859e-08, -4.91799345e-09, 3.66377919e-09, -1.5981997e-10, -1.7381238e-10, 2.624031e-11, 5.60919e-12, -1.72127e-12, -8.634e-14, 7.894e-14],
    t4 = [0.4999683287581669, 0.00013383022576489, -0.00026766045152977, 0.00033457556441221, -0.00028996548915725, 0.00018178605666397, -8.252863922168e-05, 2.551802519049e-05, -3.91665839292e-06, -7.4018205222e-07, 6.4422023359e-07, -1.737015534e-07, 9.095954650000001e-09, 9.44943118e-09, -3.29957075e-09, 2.9492075e-10, 1.1874477e-10, -4.420396e-11, 3.61422e-12, 1.43638e-12, -4.5848e-13];
    var asympt = [-1, 1, -3, 15, -105],
    xabs = Math.abs(x),
    xshort = Math.floor(xabs),
    nval = 0;
    if (xshort == 0) {
        nval = taylor(t0, 11, (xabs * xabs)) * xabs;
    } else {
        if ((xshort >= 1) && (xshort <= 2)) {
            nval = taylor(t2, 23, (xabs - 2));
        } else {
            if ((xshort >= 3) && (xshort <= 4)) {
                nval = taylor(t4, 20, (xabs - 4));
            } else {
                nval = 0.5 + phi(xabs) * taylor(asympt, 4, 1 / (xabs * xabs)) / xabs;
            }
        }
    }
    if (x < 0) {
        return -nval;
    } else {
        return nval;
    }
}
function gaussinv(x) {
    var q, t, z;
    q = x - 0.5;
    if (Math.abs(q) <= 0.425) {
        t = 0.180625 - q * q;
        z = q * (((((((t * 2509.080928730123 + 33430.57558358813) * t + 67265.77092700871) * t + 45921.95393154987) * t + 13731.69376550946) * t + 1971.590950306551) * t + 133.1416678917844) * t + 3.387132872796367) / (((((((t * 5226.495278852854 + 28729.08573572194) * t + 39307.89580009271) * t + 21213.7943015866) * t + 5394.196021424751) * t + 687.1870074920579) * t + 42.31333070160091) * t + 1);
    } else {
        if (q > 0) {
            t = 1 - x;
        } else {
            t = x;
        }
        t = Math.sqrt(-Math.log(t));
        if (t <= 5) {
            t += -1.6;
            z = (((((((t * 0.0007745450142783414 + 0.02272384498926918) * t + 0.2417807251774506) * t + 1.270458252452368) * t + 3.647848324763205) * t + 5.769497221460691) * t + 4.630337846156546) * t + 1.423437110749684) / (((((((t * 1.050750071644417e-09 + 0.0005475938084995346) * t + 0.01519866656361646) * t + 0.1481039764274801) * t + 0.6897673349851) * t + 1.676384830183804) * t + 2.053191626637759) * t + 1);
        } else {
            t += -5;
            z = (((((((t * 2.010334399292288e-07 + 2.711555568743488e-05) * t + 0.001242660947388078) * t + 0.02653218952657612) * t + 0.2965605718285049) * t + 1.784826539917291) * t + 5.463784911164114) * t + 6.657904643501103) / (((((((t * 2.04426310338994e-15 + 1.421511758316446e-07) * t + 1.846318317510055e-05) * t + 0.0007868691311456133) * t + 0.01487536129085062) * t + 0.1369298809227358) * t + 0.599832206555888) * t + 1);
        }
        if (q < 0) {
            z = -z;
        }
    }
    return z;
}
function getLanczosSum(fZ) {
    var num = [23531376880.41076, 42919803642.6491, 35711959237.35567, 17921034426.03721, 6039542586.352028, 1439720407.311722, 248874557.8620542, 31426415.58540019, 2876370.628935373, 186056.2653952235, 8071.672002365816, 210.8242777515794, 2.506628274631],
    denom = [0, 39916800, 120543840, 150917976, 105258076, 45995730, 13339535, 2637558, 357423, 32670, 1925, 66, 1];
    var sumNum, sumDenom, i, zInv;
    if (fZ <= 1) {
        sumNum = num[12];
        sumDenom = denom[12];
        for (i = 11; i >= 0; --i) {
            sumNum *= fZ;
            sumNum += num[i];
            sumDenom *= fZ;
            sumDenom += denom[i];
        }
    } else {
        zInv = 1 / fZ;
        sumNum = num[0];
        sumDenom = denom[0];
        for (i = 1; i <= 12; ++i) {
            sumNum *= zInv;
            sumNum += num[i];
            sumDenom *= zInv;
            sumDenom += denom[i];
        }
    }
    return sumNum / sumDenom;
}
function getGammaHelper(fZ) {
    var gamma = getLanczosSum(fZ),
    fg = 6.02468004077673,
    zgHelp = fZ + fg - 0.5;
    var halfpower = Math.pow(zgHelp, fZ / 2 - 0.25);
    gamma *= halfpower;
    gamma /= Math.exp(zgHelp);
    gamma *= halfpower;
    if (fZ <= 20 && fZ == Math.floor(fZ)) {
        gamma = Math.round(gamma);
    }
    return gamma;
}
function getLogGammaHelper(fZ) {
    var _fg = 6.02468004077673,
    zgHelp = fZ + _fg - 0.5;
    return Math.log(getLanczosSum(fZ)) + (fZ - 0.5) * Math.log(zgHelp) - zgHelp;
}
function getLogGamma(fZ) {
    if (fZ >= maxGammaArgument) {
        return getLogGammaHelper(fZ);
    }
    if (fZ >= 0) {
        return Math.log(getGammaHelper(fZ));
    }
    if (fZ >= 0.5) {
        return Math.log(getGammaHelper(fZ + 1) / fZ);
    }
    return getLogGammaHelper(fZ + 2) - Math.log(fZ + 1) - Math.log(fZ);
}