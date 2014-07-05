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
 cFormulaFunction.LookupAndReference = {
    "groupName": "LookupAndReference",
    "ADDRESS": function () {
        var r = new cBaseFunction("ADDRESS");
        r.setArgumentsMin(2);
        r.setArgumentsMax(5);
        r.Calculate = function (arg) {
            function _getColumnTitle(col) {
                var q = col < 26 ? undefined : Asc.floor(col / 26) - 1;
                var r = col % 26;
                var text = String.fromCharCode(("A").charCodeAt(0) + r);
                return col < 26 ? text : _getColumnTitle(q) + text;
            }
            function _getRowTitle(row) {
                return "" + (row + 1);
            }
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
                strRef = "$" + _getColumnTitle(colNumber.getValue() - 1) + "$" + _getRowTitle(rowNumber.getValue() - 1);
                break;
            case 2:
                strRef = _getColumnTitle(colNumber.getValue() - 1) + "$" + _getRowTitle(rowNumber.getValue() - 1);
                break;
            case 3:
                strRef = "$" + _getColumnTitle(colNumber.getValue() - 1) + _getRowTitle(rowNumber.getValue() - 1);
                break;
            case 4:
                strRef = _getColumnTitle(colNumber.getValue() - 1) + _getRowTitle(rowNumber.getValue() - 1);
                break;
            }
            if (sheetName instanceof cEmpty) {
                return this.value = new cString(strRef);
            } else {
                if (!rx_test_ws_name.test(sheetName.toString())) {
                    return this.value = new cString("'" + sheetName.toString().replace(/'/g, "''") + "'" + "!" + strRef);
                } else {
                    return this.value = new cString(sheetName.toString() + "!" + strRef);
                }
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( row-number , col-number [ , [ ref-type ] [ , [ A1-ref-style-flag ] [ , sheet-name ] ] ] )"
            };
        };
        return r;
    },
    "AREAS": function () {
        var r = new cBaseFunction("AREAS");
        return r;
    },
    "CHOOSE": function () {
        var r = new cBaseFunction("CHOOSE");
        r.setArgumentsMin(2);
        r.setArgumentsMax(30);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( index , argument-list )"
            };
        };
        return r;
    },
    "COLUMN": function () {
        var r = new cBaseFunction("COLUMN");
        r.setArgumentsMin(0);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( [ reference ] )"
            };
        };
        return r;
    },
    "COLUMNS": function () {
        var r = new cBaseFunction("COLUMNS");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array )"
            };
        };
        return r;
    },
    "GETPIVOTDATA": function () {
        var r = new cBaseFunction("GETPIVOTDATA");
        return r;
    },
    "HLOOKUP": function () {
        var r = new cBaseFunction("HLOOKUP");
        r.setArgumentsMin(3);
        r.setArgumentsMax(4);
        r.Calculate = function (arg) {
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
            bb, f = function (cell, r, c, r1, c1) {
                if (r == r1) {
                    var cv = cell.getValueWithoutFormat(),
                    cvType = checkTypeCell(cv);
                    if (c == c1) {
                        min = cv;
                    } else {
                        if (min > cv) {
                            min = cv;
                        }
                    }
                    if (arg3.value == true) {
                        if (arg0 instanceof cString) {
                            if (cvType instanceof cString) {
                                if (valueForSearching.localeCompare(cvType.getValue()) == 0) {
                                    resC = c;
                                    found = true;
                                } else {
                                    if (valueForSearching.localeCompare(cvType.getValue()) == 1 && !found) {
                                        resC = c;
                                    }
                                }
                            }
                        } else {
                            if (valueForSearching == cv) {
                                resC = c;
                                found = true;
                            } else {
                                if (valueForSearching > cv && !found) {
                                    resC = c;
                                }
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            if (regexp.test(cv)) {
                                resC = c;
                            }
                        } else {
                            if (valueForSearching == cv) {
                                resC = c;
                            }
                        }
                    }
                }
            };
            if (arg1 instanceof cRef || arg1 instanceof cRef3D || arg1 instanceof cArea) {
                var range = arg1.getRange();
                bb = range.getBBox0();
                if (numberRow > bb.r2 - bb.r1) {
                    return this.value = new cError(cErrorType.bad_reference);
                }
                range._foreachColNoEmpty(null, f);
            } else {
                if (arg1 instanceof cArea3D) {
                    var range = arg1.getRange()[0];
                    bb = range.getBBox0();
                    if (numberRow > bb.r2 - bb.r1) {
                        return this.value = new cError(cErrorType.bad_reference);
                    }
                    range._foreachColNoEmpty(null, f);
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( lookup-value  ,  table-array  ,  row-index-num  [  ,  [  range-lookup-flag  ] ] )"
            };
        };
        return r;
    },
    "HYPERLINK": function () {
        var r = new cBaseFunction("HYPERLINK");
        return r;
    },
    "INDEX": function () {
        var r = new cBaseFunction("INDEX");
        return r;
    },
    "INDIRECT": function () {
        var r = new cBaseFunction("INDIRECT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0].tocString(),
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
                        return this.value = new cError(cErrorType.bad_reference);
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
                var cellName = r.getCells()[0].getName(),
                wsId = r.worksheet.getId();
                if ((found_operand instanceof cRef || found_operand instanceof cRef3D || found_operand instanceof cArea) && found_operand.isValid()) {
                    var nFrom = new Vertex(wsId, cellName.replace(/\$/g, ""), this.wb),
                    nTo = new Vertex(found_operand.getWsId(), found_operand._cells.replace(/\$/g, ""), this.wb);
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( ref-text [ , [ A1-ref-style-flag ] ] )"
            };
        };
        return r;
    },
    "LOOKUP": function () {
        var r = new cBaseFunction("LOOKUP");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
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
                    index = _func.binarySearch(arg0, function () {
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
                    return this.value = arg2.getValue()[index];
                }
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(  lookup-value  ,  lookup-vector  ,  result-vector  )"
            };
        };
        return r;
    },
    "MATCH": function () {
        var r = new cBaseFunction("MATCH");
        return r;
    },
    "OFFSET": function () {
        var r = new cBaseFunction("OFFSET");
        return r;
    },
    "ROW": function () {
        var r = new cBaseFunction("ROW");
        r.setArgumentsMin(0);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( [ reference ] )"
            };
        };
        return r;
    },
    "ROWS": function () {
        var r = new cBaseFunction("ROWS");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array )"
            };
        };
        return r;
    },
    "RTD": function () {
        var r = new cBaseFunction("RTD");
        return r;
    },
    "TRANSPOSE": function () {
        var r = new cBaseFunction("TRANSPOSE");
        return r;
    },
    "VLOOKUP": function () {
        var r = new cBaseFunction("VLOOKUP");
        r.setArgumentsMin(3);
        r.setArgumentsMax(4);
        r.Calculate = function (arg) {
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
                regexp = searchRegExp(valueForSearching);
            } else {
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    valueForSearching = arg0.getValue();
                }
            }
            var found = false,
            bb, f = function (cell, r, c, r1, c1) {
                if (c == c1) {
                    var cv = cell.getValueWithoutFormat(),
                    cvType = checkTypeCell(cv);
                    if (r == r1) {
                        min = cv;
                    } else {
                        if (min > cv) {
                            min = cv;
                        }
                    }
                    if (arg3.value == true) {
                        if (arg0 instanceof cString) {
                            if (cvType instanceof cString) {
                                if (valueForSearching.localeCompare(cvType.getValue()) == 0) {
                                    resR = r;
                                    found = true;
                                } else {
                                    if (valueForSearching.localeCompare(cvType.getValue()) == 1 && !found) {
                                        resR = r;
                                    }
                                }
                            }
                        } else {
                            if (valueForSearching == cv) {
                                resR = r;
                                found = true;
                            } else {
                                if (valueForSearching > cv && !found) {
                                    resR = r;
                                }
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            if (regexp.test(cv)) {
                                resR = r;
                            }
                        } else {
                            if (valueForSearching == cv) {
                                resR = r;
                            }
                        }
                    }
                }
            };
            if (arg1 instanceof cRef || arg1 instanceof cRef3D || arg1 instanceof cArea) {
                var range = arg1.getRange();
                bb = range.getBBox0();
                if (numberCol > bb.c2 - bb.c1) {
                    return this.value = new cError(cErrorType.bad_reference);
                }
                range._foreachRowNoEmpty(null, f);
            } else {
                if (arg1 instanceof cArea3D) {
                    var range = arg1.getRange()[0];
                    bb = range.getBBox0();
                    if (numberCol > bb.c2 - bb.c1) {
                        return this.value = new cError(cErrorType.bad_reference);
                    }
                    range._foreachRowNoEmpty(null, f);
                } else {
                    if (arg1 instanceof cArray) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( lookup-value  ,  table-array  ,  col-index-num  [  ,  [  range-lookup-flag  ] ] )"
            };
        };
        return r;
    }
};