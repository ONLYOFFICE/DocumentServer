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
function _getRowTitle(row) {
    return "" + (row + 1);
}
cFormulaFunction.LookupAndReference = {
    "groupName": "LookupAndReference",
    "ADDRESS": cADDRESS,
    "AREAS": cAREAS,
    "CHOOSE": cCHOOSE,
    "COLUMN": cCOLUMN,
    "COLUMNS": cCOLUMNS,
    "GETPIVOTDATA": cGETPIVOTDATA,
    "HLOOKUP": cHLOOKUP,
    "HYPERLINK": cHYPERLINK,
    "INDEX": cINDEX,
    "INDIRECT": cINDIRECT,
    "LOOKUP": cLOOKUP,
    "MATCH": cMATCH,
    "OFFSET": cOFFSET,
    "ROW": cROW,
    "ROWS": cROWS,
    "RTD": cRTD,
    "TRANSPOSE": cTRANSPOSE,
    "VLOOKUP": cVLOOKUP
};
function cADDRESS() {
    this.name = "ADDRESS";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cADDRESS.prototype = Object.create(cBaseFunction.prototype);
cADDRESS.prototype.Calculate = function (arg) {
    var rowNumber = arg[0],
    colNumber = arg[1],
    refType = arg[2] ? arg[2] : new cNumber(1),
    A1RefType = arg[3] ? arg[3] : new cBool(true),
    sheetName = arg[4] ? arg[4] : new cEmpty();
    if (rowNumber instanceof cArea || rowNumber instanceof cArea3D) {
        rowNumber = rowNumber.cross(arguments[1].first);
    } else {
        if (rowNumber instanceof cArray) {
            rowNumber = rowNumber.getElementRowCol(0, 0);
        }
    }
    if (colNumber instanceof cArea || colNumber instanceof cArea3D) {
        colNumber = colNumber.cross(arguments[1].first);
    } else {
        if (colNumber instanceof cArray) {
            colNumber = colNumber.getElementRowCol(0, 0);
        }
    }
    if (refType instanceof cArea || refType instanceof cArea3D) {
        refType = refType.cross(arguments[1].first);
    } else {
        if (refType instanceof cArray) {
            refType = refType.getElementRowCol(0, 0);
        }
    }
    if (A1RefType instanceof cArea || A1RefType instanceof cArea3D) {
        A1RefType = A1RefType.cross(arguments[1].first);
    } else {
        if (A1RefType instanceof cArray) {
            A1RefType = A1RefType.getElementRowCol(0, 0);
        }
    }
    if (sheetName instanceof cArea || sheetName instanceof cArea3D) {
        sheetName = sheetName.cross(arguments[1].first);
    } else {
        if (sheetName instanceof cArray) {
            sheetName = sheetName.getElementRowCol(0, 0);
        }
    }
    rowNumber = rowNumber.tocNumber();
    colNumber = colNumber.tocNumber();
    refType = refType.tocNumber();
    A1RefType = A1RefType.tocBool();
    if (rowNumber instanceof cError) {
        return this.value = rowNumber;
    }
    if (colNumber instanceof cError) {
        return this.value = colNumber;
    }
    if (refType instanceof cError) {
        return this.value = refType;
    }
    if (A1RefType instanceof cError) {
        return this.value = A1RefType;
    }
    if (sheetName instanceof cError) {
        return this.value = sheetName;
    }
    if (refType.getValue() > 4 && refType.getValue() < 1 || rowNumber.getValue() < 1 || colNumber.getValue() < 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var strRef;
    switch (refType.getValue()) {
    case 1:
        strRef = "$" + g_oCellAddressUtils.colnumToColstrFromWsView(colNumber.getValue() - 1) + "$" + _getRowTitle(rowNumber.getValue() - 1);
        break;
    case 2:
        strRef = g_oCellAddressUtils.colnumToColstrFromWsView(colNumber.getValue() - 1) + "$" + _getRowTitle(rowNumber.getValue() - 1);
        break;
    case 3:
        strRef = "$" + g_oCellAddressUtils.colnumToColstrFromWsView(colNumber.getValue() - 1) + _getRowTitle(rowNumber.getValue() - 1);
        break;
    case 4:
        strRef = g_oCellAddressUtils.colnumToColstrFromWsView(colNumber.getValue() - 1) + _getRowTitle(rowNumber.getValue() - 1);
        break;
    }
    return this.value = new cString((sheetName instanceof cEmpty) ? strRef : parserHelp.get3DRef(sheetName.toString(), strRef));
};
cADDRESS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( row-number , col-number [ , [ ref-type ] [ , [ A1-ref-style-flag ] [ , sheet-name ] ] ] )"
    };
};
function cAREAS() {
    cBaseFunction.call(this, "AREAS");
}
cAREAS.prototype = Object.create(cBaseFunction.prototype);
function cCHOOSE() {
    this.name = "CHOOSE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 30;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cCHOOSE.prototype = Object.create(cBaseFunction.prototype);
cCHOOSE.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cNumber) {
        if (arg0.getValue() < 1 || arg0.getValue() > this.getArguments()) {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
        return this.value = arg[arg0.getValue()];
    }
    return this.value = new cError(cErrorType.wrong_value_type);
};
cCHOOSE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( index , argument-list )"
    };
};
function cCOLUMN() {
    this.name = "COLUMN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cCOLUMN.prototype = Object.create(cBaseFunction.prototype);
cCOLUMN.prototype.Calculate = function (arg) {
    var arg0;
    if (this.argumentsCurrent == 0) {
        arg0 = arguments[1];
        return this.value = new cNumber(arg0.getFirst().getCol());
    }
    arg0 = arg[0];
    if (arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea) {
        var range = arg0.getRange();
        if (range) {
            return this.value = new cNumber(range.getFirst().getCol());
        } else {
            return this.value = new cError(cErrorType.bad_reference);
        }
    } else {
        if (arg0 instanceof cArea3D) {
            var r = arg0.getRange();
            if (r && r[0] && r[0].getFirst()) {
                return this.value = new cNumber(r[0].getFirst().getCol());
            } else {
                return this.value = new cError(cErrorType.bad_reference);
            }
        } else {
            return this.value = new cError(cErrorType.bad_reference);
        }
    }
};
cCOLUMN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( [ reference ] )"
    };
};
function cCOLUMNS() {
    this.name = "COLUMNS";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cCOLUMNS.prototype = Object.create(cBaseFunction.prototype);
cCOLUMNS.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        return this.value = new cNumber(arg0.getCountElementInRow());
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cRef || arg0 instanceof cRef3D) {
            var range = arg0.getRange();
            return this.value = new cNumber(Math.abs(range.getBBox().c1 - range.getBBox().c2) + 1);
        } else {
            if (arg0 instanceof cArea3D) {
                var range = arg0.getRange();
                if (range.length > 1) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
                return this.value = new cNumber(Math.abs(range[0].getBBox().c1 - range[0].getBBox().c2) + 1);
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
        }
    }
};
cCOLUMNS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array )"
    };
};
function cGETPIVOTDATA() {
    cBaseFunction.call(this, "GETPIVOTDATA");
}
cGETPIVOTDATA.prototype = Object.create(cBaseFunction.prototype);
var g_oHLOOKUPCache = new VHLOOKUPCache(true);
function cHLOOKUP() {
    this.name = "HLOOKUP";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cHLOOKUP.prototype = Object.create(cBaseFunction.prototype);
cHLOOKUP.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool() : new cBool(true);
    var numberRow = arg2.getValue() - 1,
    valueForSearching = arg0.getValue(),
    resC = -1,
    min,
    regexp;
    if (isNaN(numberRow)) {
        return this.value = new cError(cErrorType.bad_reference);
    }
    if (numberRow < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg0 instanceof cString) {
        valueForSearching = arg0.getValue();
        regexp = searchRegExp(valueForSearching);
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            valueForSearching = arg0.getValue();
        }
    }
    var found = false,
    bb;
    if (arg1 instanceof cRef || arg1 instanceof cRef3D || arg1 instanceof cArea) {
        var range = arg1.getRange(),
        ws = arg1.getWS();
        bb = range.getBBox0();
        if (numberRow > bb.r2 - bb.r1) {
            return this.value = new cError(cErrorType.bad_reference);
        }
        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r1, bb.c2);
        var oCache = g_oHLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof cString, arg3.value);
        if (oCache) {
            resC = oCache.index;
            min = oCache.min;
        }
    } else {
        if (arg1 instanceof cArea3D) {
            var range = arg1.getRange()[0],
            ws = arg1.getWS();
            bb = range.getBBox0();
            if (numberRow > bb.r2 - bb.r1) {
                return this.value = new cError(cErrorType.bad_reference);
            }
            var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r1, bb.c2);
            var oCache = g_oHLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof cString, arg3.value);
            if (oCache) {
                resC = oCache.index;
                min = oCache.min;
            }
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    if (c == 0) {
                        min = elem.getValue();
                    }
                    if (arg3.value == true) {
                        if (valueForSearching == elem.getValue()) {
                            resC = c;
                            found = true;
                        } else {
                            if (valueForSearching > elem.getValue() && !found) {
                                resC = c;
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            if (regexp.test(elem.getValue())) {
                                resC = c;
                            }
                        } else {
                            if (valueForSearching == elem.getValue()) {
                                resC = c;
                            }
                        }
                    }
                    min = Math.min(min, elem.getValue());
                });
                if (min > valueForSearching) {
                    return this.value = new cError(cErrorType.not_available);
                }
                if (resC == -1) {
                    return this.value = new cError(cErrorType.not_available);
                }
                if (numberRow > arg1.getRowCount() - 1) {
                    return this.value = new cError(cErrorType.bad_reference);
                }
                return this.value = arg1.getElementRowCol(numberRow, resC);
            }
        }
    }
    if (min > valueForSearching) {
        return this.value = new cError(cErrorType.not_available);
    }
    if (resC == -1) {
        return this.value = new cError(cErrorType.not_available);
    }
    var c = new CellAddress(bb.r1 + numberRow, resC, 0);
    var v = arg1.getWS()._getCellNoEmpty(c.getRow0(), c.getCol0());
    if (v) {
        v = v.getValueWithoutFormat();
    } else {
        v = "";
    }
    return this.value = checkTypeCell(v);
};
cHLOOKUP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( lookup-value  ,  table-array  ,  row-index-num  [  ,  [  range-lookup-flag  ] ] )"
    };
};
function cHYPERLINK() {
    cBaseFunction.call(this, "HYPERLINK");
}
cHYPERLINK.prototype = Object.create(cBaseFunction.prototype);
function cINDEX() {
    this.name = "INDEX";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cINDEX.prototype = Object.create(cBaseFunction.prototype);
cINDEX.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1] && !(arg[1] instanceof cEmpty) ? arg[1] : new cNumber(1),
    arg2 = arg[2] && !(arg[2] instanceof cEmpty) ? arg[2] : new cNumber(1),
    arg3 = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(1),
    res;
    if (arg0 instanceof cArea3D) {
        return this.value = new cError(cErrorType.not_available);
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        }
    }
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocNumber();
    if (arg1 instanceof cError || arg2 instanceof cError || arg3 instanceof cError) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg1.getValue() < 0 || arg2.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg0 instanceof cArray || arg0 instanceof cArea) {
        res = arg0.getValue2(arg1.getValue() - 1, arg2.getValue() - 1);
    } else {
        res = arg0.tryConvert();
    }
    return this.value = res ? res : new cError(cErrorType.bad_reference);
};
cINDEX.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array , [ row-number ] [ , [ column-number ] ] ) " + this.name + "( reference , [ row-number ] [ , [ column-number ] [ , [ area-number ] ] ] )"
    };
};
function cINDIRECT() {
    this.name = "INDIRECT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cINDIRECT.prototype = Object.create(cBaseFunction.prototype);
cINDIRECT.prototype.Calculate = function (arg) {
    var t = this,
    arg0 = arg[0].tocString(),
    arg1 = arg[1] ? arg[1] : new cBool(true),
    r = arguments[1],
    wb = r.worksheet.workbook,
    o = {
        Formula: "",
        pCurrPos: 0
    },
    ref,
    found_operand;
    function parseReference() {
        if ((ref = parserHelp.is3DRef.call(o, o.Formula, o.pCurrPos))[0]) {
            var _wsFrom = ref[1],
            _wsTo = ((ref[2] !== null) && (ref[2] !== undefined)) ? ref[2] : _wsFrom;
            if (! (wb.getWorksheetByName(_wsFrom) && wb.getWorksheetByName(_wsTo))) {
                return t.value = new cError(cErrorType.bad_reference);
            }
            if (parserHelp.isArea.call(o, o.Formula, o.pCurrPos)) {
                found_operand = new cArea3D(o.operand_str.toUpperCase(), _wsFrom, _wsTo, wb);
                if (o.operand_str.indexOf("$") > -1) {
                    found_operand.isAbsolute = true;
                }
            } else {
                if (parserHelp.isRef.call(o, o.Formula, o.pCurrPos)) {
                    if (_wsTo != _wsFrom) {
                        found_operand = new cArea3D(o.operand_str.toUpperCase(), _wsFrom, _wsTo, wb);
                    } else {
                        found_operand = new cRef3D(o.operand_str.toUpperCase(), _wsFrom, wb);
                    }
                    if (o.operand_str.indexOf("$") > -1) {
                        found_operand.isAbsolute = true;
                    }
                }
            }
        } else {
            if (parserHelp.isName.call(o, o.Formula, o.pCurrPos, wb)[0]) {
                found_operand = new cName(o.operand_str, wb);
            } else {
                if (parserHelp.isArea.call(o, o.Formula, o.pCurrPos)) {
                    found_operand = new cArea(o.operand_str.toUpperCase(), r.worksheet);
                    if (o.operand_str.indexOf("$") > -1) {
                        found_operand.isAbsolute = true;
                    }
                } else {
                    if (parserHelp.isRef.call(o, o.Formula, o.pCurrPos, true)) {
                        found_operand = new cRef(o.operand_str.toUpperCase(), r.worksheet);
                        if (o.operand_str.indexOf("$") > -1) {
                            found_operand.isAbsolute = true;
                        }
                    }
                }
            }
        }
    }
    if (arg0 instanceof cArray) {
        var ret = new cArray();
        arg0.foreach(function (elem, r, c) {
            o = {
                Formula: elem.toString(),
                pCurrPos: 0
            };
            parseReference();
            if (!ret.array[r]) {
                ret.addRow();
            }
            ret.addElement(found_operand);
        });
        return this.value = ret;
    } else {
        o.Formula = arg0.toString();
        parseReference();
    }
    if (found_operand) {
        if (found_operand instanceof cName) {
            found_operand = found_operand.toRef();
        }
        var cellName = r.getFirst().getID(),
        wsId = r.worksheet.getId();
        if ((found_operand instanceof cRef || found_operand instanceof cRef3D || found_operand instanceof cArea) && found_operand.isValid()) {
            var nFrom = wb.dependencyFormulas.addNode(wsId, cellName),
            nTo = wb.dependencyFormulas.addNode(found_operand.getWsId(), found_operand._cells);
            found_operand.setNode(nTo);
            wb.dependencyFormulas.addEdge2(nFrom, nTo);
        } else {
            if (found_operand instanceof cArea3D && found_operand.isValid()) {
                var wsR = found_operand.wsRange();
                for (var j = 0; j < wsR.length; j++) {
                    wb.dependencyFormulas.addEdge(wsId, cellName.replace(/\$/g, ""), wsR[j].Id, found_operand._cells.replace(/\$/g, ""));
                }
            }
        }
        return this.value = found_operand;
    }
    return this.value = new cError(cErrorType.bad_reference);
};
cINDIRECT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( ref-text [ , [ A1-ref-style-flag ] ] )"
    };
};
function cLOOKUP() {
    this.name = "LOOKUP";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cLOOKUP.prototype = Object.create(cBaseFunction.prototype);
cLOOKUP.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = this.argumentsCurrent == 2 ? arg1 : arg[2],
    resC = -1,
    resR = -1;
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cRef) {
        arg0 = arg0.tryConvert();
    }
    function arrFinder(arr) {
        if (arr.getRowCount() > arr.getCountElementInRow()) {
            resC = arr.getCountElementInRow() > 1 ? 1 : 0;
            var arrCol = arr.getCol(0);
            resR = _func.binarySearch(arg0, arrCol);
        } else {
            resR = arr.getRowCount() > 1 ? 1 : 0;
            var arrRow = arr.getRow(0);
            resC = _func.binarySearch(arg0, arrRow);
        }
    }
    if (! (arg1 instanceof cArea || arg1 instanceof cArea3D || arg1 instanceof cArray || arg2 instanceof cArea || arg2 instanceof cArea3D || arg2 instanceof cArray)) {
        return this.value = new cError(cErrorType.not_available);
    }
    if (arg1 instanceof cArray && arg2 instanceof cArray) {
        if (arg1.getRowCount() != arg2.getRowCount() && arg1.getCountElementInRow() != arg2.getCountElementInRow()) {
            return this.value = new cError(cErrorType.not_available);
        }
        arrFinder(arg1);
        if (resR <= -1 && resC <= -1 || resR <= -2 || resC <= -2) {
            return this.value = new cError(cErrorType.not_available);
        }
        return this.value = arg2.getElementRowCol(resR, resC);
    } else {
        if (arg1 instanceof cArray || arg2 instanceof cArray) {
            var _arg1, _arg2;
            _arg1 = arg1 instanceof cArray ? arg1 : arg2;
            _arg2 = arg2 instanceof cArray ? arg1 : arg2;
            var BBox = _arg2.getBBox();
            if (_arg1.getRowCount() != (BBox.r2 - BBox.r1) && _arg1.getCountElementInRow() != (BBox.c2 - BBox.c1)) {
                return this.value = new cError(cErrorType.not_available);
            }
            arrFinder(_arg1);
            if (resR <= -1 && resC <= -1 || resR <= -2 || resC <= -2) {
                return this.value = new cError(cErrorType.not_available);
            }
            var c = new CellAddress(BBox.r1 + resR, BBox.c1 + resC);
            return this.value = checkTypeCell(_arg2.getWS()._getCellNoEmpty(c.getRow0(), c.getCol0()).getValueWithoutFormat());
        } else {
            var arg1Range = arg1.getRange(),
            arg2Range = arg2.getRange();
            if (arg1 instanceof cArea3D && arg1Range.length > 1 || arg2 instanceof cArea3D && arg2Range.length > 1) {
                return this.value = new cError(cErrorType.not_available);
            }
            if (arg1 instanceof cArea3D) {
                arg1Range = arg1.getMatrix()[0];
            } else {
                if (arg1 instanceof cArea) {
                    arg1Range = arg1.getMatrix();
                }
            }
            if (arg2 instanceof cArea3D) {
                arg2Range = arg2.getMatrix()[0];
            } else {
                if (arg2 instanceof cArea) {
                    arg2Range = arg2.getMatrix();
                }
            }
            var index = _func.binarySearch(arg0, function () {
                var a = [];
                for (var i = 0; i < arg1Range.length; i++) {
                    a.push(arg1Range[i][0]);
                }
                return a;
            } ());
            if (index < 0) {
                return this.value = new cError(cErrorType.not_available);
            }
            if (this.argumentsCurrent == 2) {
                if (arg1Range[0].length >= 2) {
                    var b = arg1.getBBox();
                    return this.value = new cRef(arg1.ws.getCell3((b.r1 - 1) + index, (b.c1 - 1) + 1).getName(), arg1.ws);
                } else {
                    return this.value = new cRef(arg1.ws.getCell3((b.r1 - 1) + 0, (b.c1 - 1) + index).getName(), arg1.ws);
                }
            } else {
                var b = arg2.getBBox();
                if (arg2Range.length == 1) {
                    return this.value = new cRef(arg1.ws.getCell3((b.r1 - 1) + 0, (b.c1 - 1) + index).getName(), arg1.ws);
                } else {
                    return this.value = new cRef(arg1.ws.getCell3((b.r1 - 1) + index, (b.c1 - 1) + 0).getName(), arg1.ws);
                }
            }
        }
    }
};
cLOOKUP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  lookup-value  ,  lookup-vector  ,  result-vector  )"
    };
};
function cMATCH() {
    this.name = "MATCH";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cMATCH.prototype = Object.create(cBaseFunction.prototype);
cMATCH.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2] ? arg[2] : new cNumber(1);
    function findMatch(a0, a1, a2) {
        var a1RowCount = a1.length,
        a1ColumnCount = a1[0].length,
        a0Value = a0.getValue(),
        a2Value = a2.getValue(),
        arr = [],
        res = new cError(cErrorType.not_available),
        index = -1;
        if (a1RowCount > 1 && a1ColumnCount > 1) {
            return new cError(cErrorType.not_available);
        } else {
            if (a1RowCount == 1 && a1ColumnCount > 1) {
                for (var i = 0; i < a1ColumnCount; i++) {
                    arr[i] = a1[0][i].getValue();
                }
            } else {
                if (a1RowCount > 1 && a1ColumnCount == 1) {
                    for (var i = 0; i < a1RowCount; i++) {
                        arr[i] = a1[i][0].getValue();
                    }
                } else {
                    arr[0] = a1[0][0];
                }
            }
        }
        if (! (a2Value == 1 || a2Value == 0 || a2Value == -1)) {
            return new cError(cErrorType.not_numeric);
        }
        if (a2Value == -1) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] >= a0Value) {
                    index = i;
                } else {
                    break;
                }
            }
        } else {
            if (a2Value == 0) {
                if (a0 instanceof cString) {
                    for (var i = 0; i < arr.length; i++) {
                        if (searchRegExp2(arr[i].toString(), a0Value)) {
                            index = i;
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == a0Value) {
                            index = i;
                            break;
                        }
                    }
                }
            } else {
                if (a2Value == 1) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] <= a0Value) {
                            index = i;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        if (index > -1) {
            res = new cNumber(index + 1);
        }
        return res;
    }
    if (arg0 instanceof cArea3D || arg0 instanceof cArray || arg0 instanceof cArea) {
        return this.value = new cError(cErrorType.not_available);
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        }
    }
    if (arg1 instanceof cArray || arg1 instanceof cArea) {
        arg1 = arg1.getMatrix();
    } else {
        if (arg1 instanceof cArea3D && arg1.wsFrom == arg1.wsTo) {
            arg1 = arg1.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg2 instanceof cNumber || arg2 instanceof cBool) {} else {
        if (arg2 instanceof cError) {
            return this.value = arg2;
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    return this.value = findMatch(arg0, arg1, arg2);
};
cMATCH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  lookup-value  ,  lookup-array [ , [ match-type ]] )"
    };
};
function cOFFSET() {
    this.name = "OFFSET";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cOFFSET.prototype = Object.create(cBaseFunction.prototype);
cOFFSET.prototype.Calculate = function (arg) {
    function validBBOX(bbox) {
        return 0 <= bbox.r1 && bbox.r1 <= gc_nMaxRow0 && 0 <= bbox.c1 && bbox.c1 <= gc_nMaxCol0 && 0 <= bbox.r2 && bbox.r2 <= gc_nMaxRow0 && 0 <= bbox.c2 && bbox.c2 <= gc_nMaxCol0;
    }
    var arg0 = arg[0],
    arg1 = arg[1].tocNumber(),
    arg2 = arg[2].tocNumber(),
    arg3 = new cNumber(-1),
    arg4 = new cNumber(-1);
    if (this.argumentsCurrent >= 4) {
        arg3 = arg[3].tocNumber();
    }
    if (this.argumentsCurrent == 5) {
        arg4 = arg[4].tocNumber();
    }
    if (arg1 instanceof cError || arg2 instanceof cError || arg3 instanceof cError || arg4 instanceof cError) {
        return this.value = new cError(cErrorType.bad_reference);
    }
    arg1 = arg1.getValue();
    arg2 = arg2.getValue();
    arg3 = arg3.getValue();
    arg4 = arg4.getValue();
    if (arg3 < 0) {
        arg3 = 1;
    }
    if (arg4 < 0) {
        arg4 = 1;
    }
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        var range = arg0.getRange(),
        bbox = range.getBBox0(),
        box = {
            r1: 0,
            r2: 0,
            c1: 0,
            c2: 0
        },
        ref;
        box.r1 = bbox.r1 + arg1;
        box.c1 = bbox.c1 + arg2;
        box.r2 = bbox.r1 + arg1 + arg3 - 1;
        box.c2 = bbox.c1 + arg2 + arg4 - 1;
        if (!validBBOX(box)) {
            return this.value = new cError(cErrorType.bad_reference);
        }
        var wsName = arg0.ws.getName();
        if (box.r1 == box.r2 && box.c1 == box.c2) {
            ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1);
            this.value = (arg0 instanceof cRef) ? new cRef(ref, arg0.ws) : new cRef3D(ref, wsName, arg0.wb);
        } else {
            ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1) + ":" + g_oCellAddressUtils.colnumToColstrFromWsView(box.c2 + 1) + _getRowTitle(box.r2);
            this.value = (arg0 instanceof cRef) ? new cArea(ref, arg0.ws) : new cArea3D(ref, wsName, wsName, arg0.wb);
        }
    } else {
        if (arg0 instanceof cArea) {
            var bbox = arg0.getBBox0(),
            box = {
                r1: 0,
                r2: 0,
                c1: 0,
                c2: 0
            },
            ref;
            box.r1 = bbox.r1 + arg1;
            box.c1 = bbox.c1 + arg2;
            box.r2 = bbox.r1 + arg1 + arg3 - 1;
            box.c2 = bbox.c1 + arg2 + arg4 - 1;
            if (!validBBOX(box)) {
                return this.value = new cError(cErrorType.bad_reference);
            }
            if (box.r1 == box.r2 && box.c1 == box.c2) {
                ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1);
                this.value = new cRef(ref, arg0.ws);
            } else {
                ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1) + ":" + g_oCellAddressUtils.colnumToColstrFromWsView(box.c2 + 1) + _getRowTitle(box.r2);
                this.value = new cArea(ref, arg0.ws);
            }
        } else {
            this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    if (this.value instanceof cArea || this.value instanceof cRef || this.value instanceof cRef3D || this.value instanceof cArea3D) {
        var r = arguments[1],
        wb = r.worksheet.workbook,
        cellName = r.getFirst().getID(),
        wsId = r.worksheet.getId();
        if ((this.value instanceof cRef || this.value instanceof cRef3D || this.value instanceof cArea) && this.value.isValid()) {
            var nFrom = wb.dependencyFormulas.addNode(wsId, cellName),
            nTo = wb.dependencyFormulas.addNode(this.value.getWsId(), this.value._cells);
            this.value.setNode(nTo);
            wb.dependencyFormulas.addEdge2(nFrom, nTo);
        } else {
            if (this.value instanceof cArea3D && this.value.isValid()) {
                var wsR = this.value.wsRange();
                for (var j = 0; j < wsR.length; j++) {
                    wb.dependencyFormulas.addEdge(wsId, cellName.replace(/\$/g, ""), wsR[j].Id, this.value._cells.replace(/\$/g, ""));
                }
            }
        }
    }
    return this.value;
};
cOFFSET.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( reference , rows , cols [ , [ height ] [ , [ width ] ] ] )"
    };
};
function cROW() {
    this.name = "ROW";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cROW.prototype = Object.create(cBaseFunction.prototype);
cROW.prototype.Calculate = function (arg) {
    var arg0;
    if (this.argumentsCurrent == 0) {
        arg0 = arguments[1];
        return this.value = new cNumber(arg0.getFirst().getRow());
    }
    arg0 = arg[0];
    if (arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea) {
        var range = arg0.getRange();
        if (range) {
            return this.value = new cNumber(range.getFirst().getRow());
        } else {
            return this.value = new cError(cErrorType.bad_reference);
        }
    } else {
        if (arg0 instanceof cArea3D) {
            var r = arg0.getRange();
            if (r && r[0] && r[0].getFirst()) {
                return this.value = new cNumber(r[0].getFirst().getRow());
            } else {
                return this.value = new cError(cErrorType.bad_reference);
            }
        } else {
            return this.value = new cError(cErrorType.bad_reference);
        }
    }
};
cROW.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( [ reference ] )"
    };
};
function cROWS() {
    this.name = "ROWS";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cROWS.prototype = Object.create(cBaseFunction.prototype);
cROWS.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        return this.value = new cNumber(arg0.getRowCount());
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cRef || arg0 instanceof cRef3D) {
            var range = arg0.getRange();
            return this.value = new cNumber(Math.abs(range.getBBox().r1 - range.getBBox().r2) + 1);
        } else {
            if (arg0 instanceof cArea3D) {
                var range = arg0.getRange();
                if (range.length > 1) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
                return this.value = new cNumber(Math.abs(range[0].getBBox().r1 - range[0].getBBox().r2) + 1);
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
        }
    }
};
cROWS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array )"
    };
};
function cRTD() {
    cBaseFunction.call(this, "RTD");
}
cRTD.prototype = Object.create(cBaseFunction.prototype);
function cTRANSPOSE() {
    this.name = "TRANSPOSE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cTRANSPOSE.prototype = Object.create(cBaseFunction.prototype);
cTRANSPOSE.prototype.Calculate = function (arg) {
    function TransposeMatrix(A) {
        var tMatrix = [],
        res = new cArray();
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (!tMatrix[j]) {
                    tMatrix[j] = [];
                }
                tMatrix[j][i] = A[i][j];
            }
        }
        res.fillFromArray(tMatrix);
        return res;
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cNumber || arg0 instanceof cString || arg0 instanceof cBool || arg0 instanceof cRef || arg0 instanceof cRef3D) {
            return this.value = arg0.getValue();
        } else {
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                return this.value = new cError(cErrorType.not_available);
            }
        }
    }
    return this.value = TransposeMatrix(arg0);
};
cTRANSPOSE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array )"
    };
};
function VHLOOKUPCache(bHor) {
    this.cacheId = {};
    this.cacheRanges = {};
    this.bHor = bHor;
}
VHLOOKUPCache.prototype.get = function (range, valueForSearching, isValueString, arg3Value) {
    var res = null;
    var _this = this;
    var wsId = range.getWorksheet().getId();
    var sRangeName = wsId + cCharDelimiter + range.getName();
    var cacheElem = this.cacheId[sRangeName];
    if (null == cacheElem) {
        cacheElem = {
            id: sRangeName,
            foreachArray: [],
            results: {}
        };
        range._foreachNoEmpty(function (cell, r, c, r1, c1) {
            var cv = cell.getValueWithoutFormat();
            if (_this.bHor) {
                cacheElem.foreachArray.push({
                    cv: cv,
                    cvType: checkTypeCell(cv),
                    index: c,
                    indexStart: c1
                });
            } else {
                cacheElem.foreachArray.push({
                    cv: cv,
                    cvType: checkTypeCell(cv),
                    index: r,
                    indexStart: r1
                });
            }
        });
        this.cacheId[sRangeName] = cacheElem;
        var cacheRange = this.cacheRanges[wsId];
        if (null == cacheRange) {
            cacheRange = new RangeDataManager(null);
            this.cacheRanges[wsId] = cacheRange;
        }
        cacheRange.add(range.getBBox0(), cacheElem);
    }
    var sInputKey = valueForSearching + cCharDelimiter + isValueString + cCharDelimiter + arg3Value;
    res = cacheElem.results[sInputKey];
    if (null == res) {
        res = this._calculate(cacheElem.foreachArray, valueForSearching, isValueString, arg3Value);
        cacheElem.results[sInputKey] = res;
    }
    return res;
};
VHLOOKUPCache.prototype._calculate = function (cacheArray, valueForSearching, isValueString, arg3Value) {
    var res = {
        min: undefined,
        index: -1
    },
    found = false,
    regexp = null;
    for (var i = 0, length = cacheArray.length; i < length; i++) {
        var cache = cacheArray[i];
        var cv = cache.cv;
        var index = cache.index;
        var indexStart = cache.indexStart;
        var cvType = cache.cvType;
        if (index == indexStart) {
            res.min = cv;
        } else {
            if (res.min > cv) {
                res.min = cv;
            }
        }
        if (arg3Value == true) {
            if (isValueString) {
                if (cvType instanceof cString) {
                    if (valueForSearching.localeCompare(cvType.getValue()) == 0) {
                        res.index = index;
                        found = true;
                    } else {
                        if (valueForSearching.localeCompare(cvType.getValue()) == 1 && !found) {
                            res.index = index;
                        }
                    }
                }
            } else {
                if (valueForSearching == cv) {
                    res.index = index;
                    found = true;
                } else {
                    if (valueForSearching > cv && !found) {
                        res.index = index;
                    }
                }
            }
        } else {
            if (isValueString) {
                if (null == regexp) {
                    regexp = searchRegExp(valueForSearching);
                }
                if (regexp.test(cv)) {
                    res.index = index;
                }
            } else {
                if (valueForSearching == cv) {
                    res.index = index;
                }
            }
        }
    }
    return res;
};
VHLOOKUPCache.prototype.remove = function (cell) {
    var wsId = cell.ws.getId();
    var cacheRange = this.cacheRanges[wsId];
    if (null != cacheRange) {
        var oGetRes = cacheRange.get(new Asc.Range(cell.nCol, cell.nRow, cell.nCol, cell.nRow));
        for (var i = 0, length = oGetRes.all.length; i < length; ++i) {
            var elem = oGetRes.all[i];
            elem.data.results = {};
        }
    }
};
VHLOOKUPCache.prototype.clean = function () {
    this.cacheId = {};
    this.cacheRanges = {};
};
var g_oVLOOKUPCache = new VHLOOKUPCache(false);
function cVLOOKUP() {
    this.name = "VLOOKUP";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cVLOOKUP.prototype = Object.create(cBaseFunction.prototype);
cVLOOKUP.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool() : new cBool(true);
    var numberCol = arg2.getValue() - 1,
    valueForSearching,
    resR = -1,
    min,
    regexp;
    if (isNaN(numberCol)) {
        return this.value = new cError(cErrorType.bad_reference);
    }
    if (numberCol < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg0 instanceof cRef) {
        arg0 = arg0.getValue();
    }
    if (arg0 instanceof cString) {
        valueForSearching = arg0.getValue();
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            valueForSearching = arg0.getValue();
        }
    }
    var found = false,
    bb;
    if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
        var range = arg1.getRange(),
        ws = arg1.getWS();
        bb = range.getBBox0();
        if (numberCol > bb.c2 - bb.c1) {
            return this.value = new cError(cErrorType.bad_reference);
        }
        var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);
        var oCache = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof cString, arg3.value);
        if (oCache) {
            resR = oCache.index;
            min = oCache.min;
        }
    } else {
        if (arg1 instanceof cArea) {
            var range = arg1.getRange(),
            ws = arg1.getWS();
            bb = range.getBBox0();
            if (numberCol > bb.c2 - bb.c1) {
                return this.value = new cError(cErrorType.bad_reference);
            }
            var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);
            var oCache = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof cString, arg3.value);
            if (oCache) {
                resR = oCache.index;
                min = oCache.min;
            }
        } else {
            if (arg1 instanceof cArea3D) {
                var range = arg1.getRange()[0],
                ws = arg1.getWS();
                bb = range.getBBox0();
                if (numberCol > bb.c2 - bb.c1) {
                    return this.value = new cError(cErrorType.bad_reference);
                }
                var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);
                var oCache = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg0 instanceof cString, arg3.value);
                if (oCache) {
                    resR = oCache.index;
                    min = oCache.min;
                }
            } else {
                if (arg1 instanceof cArray) {
                    if (arg0 instanceof cString) {
                        regexp = searchRegExp(valueForSearching);
                    }
                    arg1.foreach(function (elem, r, c) {
                        if (r == 0) {
                            min = elem.getValue();
                        }
                        if (arg3.value == true) {
                            if (valueForSearching == elem.getValue()) {
                                resR = r;
                                found = true;
                            } else {
                                if (valueForSearching > elem.getValue() && !found) {
                                    resR = r;
                                }
                            }
                        } else {
                            if (arg0 instanceof cString) {
                                if (regexp.test(elem.getValue())) {
                                    resR = r;
                                }
                            } else {
                                if (valueForSearching == elem.getValue()) {
                                    resR = r;
                                }
                            }
                        }
                        min = Math.min(min, elem.getValue());
                    });
                    if (min > valueForSearching) {
                        return this.value = new cError(cErrorType.not_available);
                    }
                    if (resR == -1) {
                        return this.value = new cError(cErrorType.not_available);
                    }
                    if (numberCol > arg1.getCountElementInRow() - 1) {
                        return this.value = new cError(cErrorType.bad_reference);
                    }
                    return this.value = arg1.getElementRowCol(resR, numberCol);
                }
            }
        }
    }
    if (min > valueForSearching) {
        return this.value = new cError(cErrorType.not_available);
    }
    if (resR == -1) {
        return this.value = new cError(cErrorType.not_available);
    }
    var c = new CellAddress(resR, bb.c1 + numberCol, 0);
    var v = arg1.getWS()._getCellNoEmpty(c.getRow0(), c.getCol0());
    if (v) {
        v = v.getValueWithoutFormat();
    } else {
        v = "";
    }
    return this.value = checkTypeCell(v);
};
cVLOOKUP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( lookup-value  ,  table-array  ,  col-index-num  [  ,  [  range-lookup-flag  ] ] )"
    };
};