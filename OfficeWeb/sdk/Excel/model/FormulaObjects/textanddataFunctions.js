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
cFormulaFunction.TextAndData = {
    "groupName": "TextAndData",
    "ASC": cASC,
    "BAHTTEXT": cBAHTTEXT,
    "CHAR": cCHAR,
    "CLEAN": cCLEAN,
    "CODE": cCODE,
    "CONCATENATE": cCONCATENATE,
    "DOLLAR": cDOLLAR,
    "EXACT": cEXACT,
    "FIND": cFIND,
    "FINDB": cFINDB,
    "FIXED": cFIXED,
    "JIS": cJIS,
    "LEFT": cLEFT,
    "LEFTB": cLEFTB,
    "LEN": cLEN,
    "LENB": cLENB,
    "LOWER": cLOWER,
    "MID": cMID,
    "MIDB": cMIDB,
    "PHONETIC": cPHONETIC,
    "PROPER": cPROPER,
    "REPLACE": cREPLACE,
    "REPLACEB": cREPLACEB,
    "REPT": cREPT,
    "RIGHT": cRIGHT,
    "RIGHTB": cRIGHTB,
    "SEARCH": cSEARCH,
    "SEARCHB": cSEARCHB,
    "SUBSTITUTE": cSUBSTITUTE,
    "T": cT,
    "TEXT": cTEXT,
    "TRIM": cTRIM,
    "UPPER": cUPPER,
    "VALUE": cVALUE
};
function cASC() {
    cBaseFunction.call(this, "ASC");
}
cASC.prototype = Object.create(cBaseFunction.prototype);
function cBAHTTEXT() {
    cBaseFunction.call(this, "BAHTTEXT");
}
cBAHTTEXT.prototype = Object.create(cBaseFunction.prototype);
function cCHAR() {
    this.name = "CHAR";
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
cCHAR.prototype = Object.create(cBaseFunction.prototype);
cCHAR.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocNumber();
    } else {
        if (arg0 instanceof cArray) {
            var ret = new cArray();
            arg0.foreach(function (elem, r, c) {
                var _elem = elem.tocNumber();
                if (!ret.array[r]) {
                    ret.addRow();
                }
                if (_elem instanceof cError) {
                    ret.addElement(_elem);
                } else {
                    ret.addElement(new cString(String.fromCharCode(_elem.getValue())));
                }
            });
            return this.value = ret;
        }
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cString(String.fromCharCode(arg0.getValue()));
};
cCHAR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number )"
    };
};
function cCLEAN() {
    this.name = "CLEAN";
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
cCLEAN.prototype = Object.create(cBaseFunction.prototype);
cCLEAN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocNumber();
    }
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
    }
    arg0 = arg0.tocString();
    var v = arg0.getValue(),
    l = v.length,
    res = "";
    for (var i = 0; i < l; i++) {
        if (v.charCodeAt(i) > 31) {
            res += v[i];
        }
    }
    return this.value = new cString(res);
};
cCLEAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string )"
    };
};
function cCODE() {
    this.name = "CODE";
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
cCODE.prototype = Object.create(cBaseFunction.prototype);
cCODE.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocString();
    } else {
        if (arg0 instanceof cArray) {
            var ret = new cArray();
            arg0.foreach(function (elem, r, c) {
                var _elem = elem.tocString();
                if (!ret.array[r]) {
                    ret.addRow();
                }
                if (_elem instanceof cError) {
                    ret.addElement(_elem);
                } else {
                    ret.addElement(new cNumber(_elem.toString().charCodeAt()));
                }
            });
            return this.value = ret;
        }
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cNumber(arg0.toString().charCodeAt());
};
cCODE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string )"
    };
};
function cCONCATENATE() {
    this.name = "CONCATENATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cCONCATENATE.prototype = Object.create(cBaseFunction.prototype);
cCONCATENATE.prototype.Calculate = function (arg) {
    var arg0 = new cString(""),
    argI;
    for (var i = 0; i < this.argumentsCurrent; i++) {
        argI = arg[i];
        if (argI instanceof cArea || argI instanceof cArea3D) {
            argI = argI.cross(arguments[1].first);
        }
        argI = argI.tocString();
        if (argI instanceof cError) {
            return this.value = argI;
        } else {
            if (argI instanceof cArray) {
                argI.foreach(function (elem) {
                    if (elem instanceof cError) {
                        arg0 = elem;
                        return true;
                    }
                    arg0 = new cString(arg0.toString().concat(elem.toString()));
                });
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                }
            } else {
                arg0 = new cString(arg0.toString().concat(argI.toString()));
            }
        }
    }
    return this.value = arg0;
};
cCONCATENATE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(text1, text2, ...)"
    };
};
function cDOLLAR() {
    this.name = "DOLLAR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cDOLLAR.prototype = Object.create(cBaseFunction.prototype);
cDOLLAR.prototype.Calculate = function (arg) {
    function SignZeroPositive(number) {
        return number < 0 ? -1 : 1;
    }
    function truncate(n) {
        return Math[n > 0 ? "floor" : "ceil"](n);
    }
    function sign(n) {
        return n == 0 ? 0 : n < 0 ? -1 : 1;
    }
    function Floor(number, significance) {
        var quotient = number / significance;
        if (quotient == 0) {
            return 0;
        }
        var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);
        return truncate(quotient + nolpiat) * significance;
    }
    function roundHelper(number, num_digits) {
        if (num_digits > cExcelMaxExponent) {
            if (Math.abs(number) < 1 || num_digits < 10000000000) {
                return new cNumber(number);
            }
            return new cNumber(0);
        } else {
            if (num_digits < cExcelMinExponent) {
                if (Math.abs(number) < 0.01) {
                    return new cNumber(number);
                }
                return new cNumber(0);
            }
        }
        var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));
        number += significance / 2;
        if (number / significance == Infinity) {
            return new cNumber(number);
        }
        return new cNumber(Floor(number, significance));
    }
    function toFix(str, skip) {
        var res, _int, _dec, _tmp = "";
        if (skip) {
            return str;
        }
        res = str.split(".");
        _int = res[0];
        if (res.length == 2) {
            _dec = res[1];
        }
        _int = _int.split("").reverse().join("").match(/([^]{1,3})/ig);
        for (var i = _int.length - 1; i >= 0; i--) {
            _tmp += _int[i].split("").reverse().join("");
            if (i != 0) {
                _tmp += ",";
            }
        }
        if (undefined != _dec) {
            while (_dec.length < arg1.getValue()) {
                _dec += "0";
            }
        }
        return "" + _tmp + (res.length == 2 ? "." + _dec + "" : "");
    }
    var arg0 = arg[0],
    arg1 = arg[1] ? arg[1] : new cNumber(2),
    arg2 = arg[2] ? arg[2] : new cBool(false);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.getValue();
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            if (arg0 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                arg0 = arg0.tocNumber();
            }
        }
    } else {
        arg0 = arg0.tocNumber();
    }
    if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
        arg1 = arg1.getValue();
        if (arg1 instanceof cError) {
            return this.value = arg1;
        } else {
            if (arg1 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                arg1 = arg1.tocNumber();
            }
        }
    } else {
        arg1 = arg1.tocNumber();
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    var res = roundHelper(a.getValue(), b.getValue());
                    this.array[r][c] = toFix(res.toString(), arg2.toBool());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    var res = roundHelper(a.getValue(), b.getValue());
                    this.array[r][c] = toFix(res.toString(), arg2.toBool());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0;
                    var b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        var res = roundHelper(a.getValue(), b.getValue());
                        this.array[r][c] = toFix(res.toString(), arg2.toBool());
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    var number = arg0.getValue(),
    num_digits = arg1.getValue();
    this.value = roundHelper(number, num_digits).getValue();
    var cNull = "";
    if (num_digits > 0) {
        cNull = ".";
        for (var i = 0; i < num_digits; i++, cNull += "0") {}
    }
    this.value = new cString(oNumFormatCache.get("$#,##0" + cNull + ";($#,##0" + cNull + ")").format(roundHelper(number, num_digits).getValue(), CellValueType.Number, gc_nMaxDigCount)[0].text);
    return this.value;
};
cDOLLAR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number [ , num-decimal ] )"
    };
};
function cEXACT() {
    this.name = "EXACT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cEXACT.prototype = Object.create(cBaseFunction.prototype);
cEXACT.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    arg1 = arg1.tocString();
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
        arg1 = arg1.getElementRowCol(0, 0);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElementRowCol(0, 0);
        } else {
            if (arg1 instanceof cArray) {
                arg1 = arg1.getElementRowCol(0, 0);
            }
        }
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    var arg0val = arg0.getValue(),
    arg1val = arg1.getValue();
    return this.value = new cBool(arg0val === arg1val);
};
cEXACT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(text1, text2)"
    };
};
function cFIND() {
    this.name = "FIND";
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
cFIND.prototype = Object.create(cBaseFunction.prototype);
cFIND.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = this.getArguments() == 3 ? arg[2] : null,
    res,
    str,
    searchStr,
    pos = -1;
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    arg1 = arg1.tocString();
    if (arg2 !== null) {
        if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
            arg2 = arg2.cross(arguments[1].first);
        }
        arg2 = arg2.tocNumber();
        if (arg2 instanceof cArray) {
            arg2 = arg1.getElementRowCol(0, 0);
        }
        if (arg2 instanceof cError) {
            return this.value = arg2;
        }
        pos = arg2.getValue();
        pos = pos > 0 ? pos - 1 : pos;
    }
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
    }
    if (arg1 instanceof cArray) {
        arg1 = arg1.getElementRowCol(0, 0);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    str = arg1.getValue();
    searchStr = arg0.getValue();
    if (arg2) {
        if (pos > str.length || pos < 0) {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
        str = str.substring(pos);
        res = str.search(searchStr);
        if (res >= 0) {
            res += pos;
        }
    } else {
        res = str.search(searchStr);
    }
    if (res < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = new cNumber(res + 1);
};
cFIND.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string-1 , string-2 [ , start-pos ] )"
    };
};
function cFINDB() {
    var r = new cFormulaFunction.TextAndData["FIND"]();
    r.setName("FINDB");
    return r;
}
function cFIXED() {
    this.name = "FIXED";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cFIXED.prototype = Object.create(cBaseFunction.prototype);
cFIXED.prototype.Calculate = function (arg) {
    function SignZeroPositive(number) {
        return number < 0 ? -1 : 1;
    }
    function truncate(n) {
        return Math[n > 0 ? "floor" : "ceil"](n);
    }
    function sign(n) {
        return n == 0 ? 0 : n < 0 ? -1 : 1;
    }
    function Floor(number, significance) {
        var quotient = number / significance;
        if (quotient == 0) {
            return 0;
        }
        var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);
        return truncate(quotient + nolpiat) * significance;
    }
    function roundHelper(number, num_digits) {
        if (num_digits > cExcelMaxExponent) {
            if (Math.abs(number) < 1 || num_digits < 10000000000) {
                return new cNumber(number);
            }
            return new cNumber(0);
        } else {
            if (num_digits < cExcelMinExponent) {
                if (Math.abs(number) < 0.01) {
                    return new cNumber(number);
                }
                return new cNumber(0);
            }
        }
        var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));
        number += significance / 2;
        if (number / significance == Infinity) {
            return new cNumber(number);
        }
        return new cNumber(Floor(number, significance));
    }
    function toFix(str, skip) {
        var res, _int, _dec, _tmp = "";
        if (skip) {
            return str;
        }
        res = str.split(".");
        _int = res[0];
        if (res.length == 2) {
            _dec = res[1];
        }
        _int = _int.split("").reverse().join("").match(/([^]{1,3})/ig);
        for (var i = _int.length - 1; i >= 0; i--) {
            _tmp += _int[i].split("").reverse().join("");
            if (i != 0) {
                _tmp += ",";
            }
        }
        if (undefined != _dec) {
            while (_dec.length < arg1.getValue()) {
                _dec += "0";
            }
        }
        return "" + _tmp + (res.length == 2 ? "." + _dec + "" : "");
    }
    var arg0 = arg[0],
    arg1 = arg[1] ? arg[1] : new cNumber(2),
    arg2 = arg[2] ? arg[2] : new cBool(false);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    }
    arg2 = arg2.tocBool();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.getValue();
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            if (arg0 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                arg0 = arg0.tocNumber();
            }
        }
    } else {
        arg0 = arg0.tocNumber();
    }
    if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
        arg1 = arg1.getValue();
        if (arg1 instanceof cError) {
            return this.value = arg1;
        } else {
            if (arg1 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                arg1 = arg1.tocNumber();
            }
        }
    } else {
        arg1 = arg1.tocNumber();
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    var res = roundHelper(a.getValue(), b.getValue());
                    this.array[r][c] = toFix(res.toString(), arg2.toBool());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    var res = roundHelper(a.getValue(), b.getValue());
                    this.array[r][c] = toFix(res.toString(), arg2.toBool());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0;
                    var b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        var res = roundHelper(a.getValue(), b.getValue());
                        this.array[r][c] = toFix(res.toString(), arg2.toBool());
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    var number = arg0.getValue(),
    num_digits = arg1.getValue();
    var cNull = "";
    if (num_digits > 0) {
        cNull = ".";
        for (var i = 0; i < num_digits; i++, cNull += "0") {}
    }
    return this.value = new cString(oNumFormatCache.get("#" + (arg2.toBool() ? "" : ",") + "##0" + cNull).format(roundHelper(number, num_digits).getValue(), CellValueType.Number, gc_nMaxDigCount)[0].text);
};
cFIXED.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number [ , [ num-decimal ] [ , suppress-commas-flag ] ] )"
    };
};
function cJIS() {
    cBaseFunction.call(this, "JIS");
}
cJIS.prototype = Object.create(cBaseFunction.prototype);
function cLEFT() {
    this.name = "LEFT";
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
cLEFT.prototype = Object.create(cBaseFunction.prototype);
cLEFT.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = this.argumentsCurrent == 1 ? new cNumber(1) : arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
        arg1 = arg1.getElementRowCol(0, 0);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElementRowCol(0, 0);
        } else {
            if (arg1 instanceof cArray) {
                arg1 = arg1.getElementRowCol(0, 0);
            }
        }
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg1.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = new cString(arg0.getValue().substring(0, arg1.getValue()));
};
cLEFT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string [ , number-chars ] )"
    };
};
function cLEFTB() {
    var r = new cFormulaFunction.TextAndData["LEFT"]();
    r.setName("LEFTB");
    return r;
}
function cLEN() {
    this.name = "LEN";
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
cLEN.prototype = Object.create(cBaseFunction.prototype);
cLEN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cNumber(arg0.getValue().length);
};
cLEN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string )"
    };
};
function cLENB() {
    var r = new cFormulaFunction.TextAndData["LEN"]();
    r.setName("LENB");
    return r;
}
function cLOWER() {
    this.name = "LOWER";
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
cLOWER.prototype = Object.create(cBaseFunction.prototype);
cLOWER.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cString(arg0.getValue().toLowerCase());
};
cLOWER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(text)"
    };
};
function cMID() {
    this.name = "MID";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cMID.prototype = Object.create(cBaseFunction.prototype);
cMID.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
    }
    if (arg1 instanceof cArray) {
        arg1 = arg1.getElementRowCol(0, 0);
    }
    if (arg2 instanceof cArray) {
        arg2 = arg2.getElementRowCol(0, 0);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg1.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg2.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    var l = arg0.getValue().length;
    if (arg1.getValue() > l) {
        return this.value = new cString("");
    }
    return this.value = new cString(arg0.getValue().substr(arg1.getValue() == 0 ? 0 : arg1.getValue() - 1, arg2.getValue()));
};
cMID.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string , start-pos , number-chars )"
    };
};
function cMIDB() {
    var r = new cFormulaFunction.TextAndData["MID"]();
    r.setName("MIDB");
    return r;
}
function cPHONETIC() {
    cBaseFunction.call(this, "PHONETIC");
}
cPHONETIC.prototype = Object.create(cBaseFunction.prototype);
function cPROPER() {
    this.name = "PROPER";
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
cPROPER.prototype = Object.create(cBaseFunction.prototype);
cPROPER.prototype.Calculate = function (arg) {
    var reg_PROPER = new RegExp("[-#$+*/^&%<\\[\\]='?_\\@!~`\">: ;.\\)\\(,]|\\d|\\s"),
    arg0 = arg[0];
    function proper(str) {
        var canUpper = true,
        retStr = "",
        regTest;
        for (var i = 0; i < str.length; i++) {
            regTest = reg_PROPER.test(str[i]);
            if (regTest) {
                canUpper = true;
            } else {
                if (canUpper) {
                    retStr += str[i].toUpperCase();
                    canUpper = false;
                    continue;
                }
            }
            retStr += str[i].toLowerCase();
        }
        return retStr;
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocString();
    } else {
        if (arg0 instanceof cArray) {
            var ret = new cArray();
            arg0.foreach(function (elem, r, c) {
                var _elem = elem.tocString();
                if (!ret.array[r]) {
                    ret.addRow();
                }
                if (_elem instanceof cError) {
                    ret.addElement(_elem);
                } else {
                    ret.addElement(new cString(proper(_elem.toString())));
                }
            });
            return this.value = ret;
        }
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cString(proper(arg0.toString()));
};
cPROPER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string )"
    };
};
function cREPLACE() {
    this.name = "REPLACE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cREPLACE.prototype = Object.create(cBaseFunction.prototype);
cREPLACE.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocString();
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0).tocString();
        }
    }
    arg0 = arg0.tocString();
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first).tocNumber();
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0).tocNumber();
        }
    }
    arg1 = arg1.tocNumber();
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first).tocNumber();
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0).tocNumber();
        }
    }
    arg2 = arg2.tocNumber();
    if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
        arg3 = arg3.cross(arguments[1].first).tocString();
    } else {
        if (arg3 instanceof cArray) {
            arg3 = arg3.getElement(0).tocString();
        }
    }
    arg3 = arg3.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg3 instanceof cError) {
        return this.value = arg3;
    }
    if (arg1.getValue() < 1 || arg2.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    var string1 = arg0.getValue(),
    string2 = arg3.getValue(),
    res = "";
    string1 = string1.split("");
    string1.splice(arg1.getValue() - 1, arg2.getValue(), string2);
    for (var i = 0; i < string1.length; i++) {
        res += string1[i];
    }
    return this.value = new cString(res);
};
cREPLACE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string-1, start-pos, number-chars, string-2 )"
    };
};
function cREPLACEB() {
    var r = new cFormulaFunction.TextAndData["REPLACE"]();
    r.setName("REPLACEB");
    return r;
}
function cREPT() {
    this.name = "REPT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cREPT.prototype = Object.create(cBaseFunction.prototype);
cREPT.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    res = "";
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
        arg1 = arg1.getElementRowCol(0, 0);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElementRowCol(0, 0);
        } else {
            if (arg1 instanceof cArray) {
                arg1 = arg1.getElementRowCol(0, 0);
            }
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first).tocNumber();
    } else {
        if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
            arg1 = arg1.getValue();
        }
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    } else {
        if (arg1 instanceof cString) {
            return this.value = new cError(cErrorType.wrong_value_type);
        } else {
            arg1 = arg1.tocNumber();
        }
    }
    if (arg1.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    for (var i = 0; i < arg1.getValue(); i++) {
        res = res.concat(arg0.getValue());
    }
    return this.value = new cString(res);
};
cREPT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(text, number_of_times)"
    };
};
function cRIGHT() {
    this.name = "RIGHT";
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
cRIGHT.prototype = Object.create(cBaseFunction.prototype);
cRIGHT.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = this.argumentsCurrent == 1 ? new cNumber(1) : arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocString();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
        arg1 = arg1.getElementRowCol(0, 0);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElementRowCol(0, 0);
        } else {
            if (arg1 instanceof cArray) {
                arg1 = arg1.getElementRowCol(0, 0);
            }
        }
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg1.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    var l = arg0.getValue().length,
    _number = l - arg1.getValue();
    return this.value = new cString(arg0.getValue().substring(_number < 0 ? 0 : _number, l));
};
cRIGHT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string [ , number-chars ] )"
    };
};
function cRIGHTB() {
    var r = new cFormulaFunction.TextAndData["RIGHT"]();
    r.setName("RIGHTB");
    return r;
}
function cSEARCH() {
    this.name = "SEARCH";
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
cSEARCH.prototype = Object.create(cBaseFunction.prototype);
cSEARCH.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2] ? arg[2] : new cNumber(1);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocString();
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0).tocString();
        }
    }
    arg0 = arg0.tocString();
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first).tocString();
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0).tocString();
        }
    }
    arg1 = arg1.tocString();
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first).tocNumber();
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0).tocNumber();
        }
    }
    arg2 = arg2.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg2.getValue() < 1 || arg2.getValue() > arg1.getValue().length) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    var string1 = arg0.getValue(),
    string2 = arg1.getValue(),
    valueForSearching = string1.replace(/(\\)/g, "\\").replace(/(\^)/g, "\\^").replace(/(\()/g, "\\(").replace(/(\))/g, "\\)").replace(/(\+)/g, "\\+").replace(/(\[)/g, "\\[").replace(/(\])/g, "\\]").replace(/(\{)/g, "\\{").replace(/(\})/g, "\\}").replace(/(\$)/g, "\\$").replace(/(~)?\*/g, function ($0, $1) {
        return $1 ? $0 : "(.*)";
    }).replace(/(~)?\?/g, function ($0, $1) {
        return $1 ? $0 : ".";
    }).replace(/(~\*)/g, "\\*").replace(/(~\?)/g, "\\?");
    valueForSearching = new RegExp(valueForSearching, "ig");
    if (string1 == "") {
        return this.value = arg2;
    }
    var res = string2.substring(arg2.getValue() - 1).search(valueForSearching) + arg2.getValue() - 1;
    if (res < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = new cNumber(res + 1);
};
cSEARCH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string-1 , string-2 [ , start-pos ] )"
    };
};
function cSEARCHB() {
    var r = new cFormulaFunction.TextAndData["SEARCH"]();
    r.setName("SEARCHB");
    return r;
}
function cSUBSTITUTE() {
    this.name = "SUBSTITUTE";
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
cSUBSTITUTE.prototype = Object.create(cBaseFunction.prototype);
cSUBSTITUTE.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3] ? arg[3] : new cNumber(0);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocString();
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0).tocString();
        }
    }
    arg0 = arg0.tocString();
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first).tocString();
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0).tocString();
        }
    }
    arg1 = arg1.tocString();
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first).tocString();
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0).tocString();
        }
    }
    arg2 = arg2.tocString();
    if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
        arg3 = arg3.cross(arguments[1].first).tocNumber();
    } else {
        if (arg3 instanceof cArray) {
            arg3 = arg3.getElement(0).tocNumber();
        }
    }
    arg3 = arg3.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg3 instanceof cError) {
        return this.value = arg3;
    }
    if (arg3.getValue() < 0) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    var string = arg0.getValue(),
    old_string = arg1.getValue(),
    new_string = arg2.getValue(),
    index = 0,
    res;
    res = string.replace(new RegExp(old_string, "g"), function (equal, p1, source) {
        index++;
        if (arg3.getValue() == 0 || arg3.getValue() > source.length) {
            return new_string;
        } else {
            if (arg3.getValue() == index) {
                return new_string;
            }
        }
        return equal;
    });
    return this.value = new cString(res);
};
cSUBSTITUTE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string , old-string , new-string [ , occurence ] )"
    };
};
function cT() {
    this.name = "T";
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
cT.prototype = Object.create(cBaseFunction.prototype);
cT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.getValue();
    } else {
        if (arg0 instanceof cString || arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg[0] instanceof cArray) {
                    arg0 = arg[0].getElementRowCol(0, 0);
                }
            }
        }
    }
    if (arg0 instanceof cString || arg0 instanceof cError) {
        return this.value = arg[0];
    } else {
        return this.value = new cEmpty();
    }
};
cT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( value )"
    };
};
function cTEXT() {
    this.name = "TEXT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cTEXT.prototype = Object.create(cBaseFunction.prototype);
cTEXT.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElementRowCol(0, 0);
            }
        }
    }
    if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
        arg1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
            arg1 = arg1.cross(arguments[1].first);
        } else {
            if (arg1 instanceof cArray) {
                arg1 = arg1.getElementRowCol(0, 0);
            }
        }
    }
    arg1 = arg1.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    var _tmp = arg0.tocNumber();
    if (_tmp instanceof cNumber) {
        arg0 = _tmp;
    }
    var oFormat = oNumFormatCache.get(arg1.toString());
    var a = g_oFormatParser.parse(arg0.getValue() + ""),
    aText;
    aText = oFormat.format(a ? a.value : arg0.getValue(), arg0 instanceof cNumber || a ? CellValueType.Number : CellValueType.String, gc_nMaxDigCountView, null);
    var text = "";
    for (var i = 0, length = aText.length; i < length; ++i) {
        if (aText[i].format && aText[i].format.skip) {
            text += " ";
            continue;
        }
        if (aText[i].format && aText[i].format.repeat) {
            continue;
        }
        text += aText[i].text;
    }
    this.value = new cString(text);
    this.value.numFormat = this.formatType.noneFormat;
    return this.value;
};
cTEXT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( value , format )"
    };
};
function cTRIM() {
    this.name = "TRIM";
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
cTRIM.prototype = Object.create(cBaseFunction.prototype);
cTRIM.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first).tocString();
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0).tocString();
        }
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cString(arg0.getValue().replace(rx_space_g, function ($0, $1, $2) {
        var res;
        rx_space.test($2[$1 + 1]) ? res = "" : res = $2[$1];
        return res;
    }).replace(/^\s|\s$/g, ""));
};
cTRIM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string )"
    };
};
function cUPPER() {
    this.name = "UPPER";
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
cUPPER.prototype = Object.create(cBaseFunction.prototype);
cUPPER.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElementRowCol(0, 0);
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    return this.value = new cString(arg0.getValue().toUpperCase());
};
cUPPER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(text)"
    };
};
function cVALUE() {
    this.name = "VALUE";
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
cVALUE.prototype = Object.create(cBaseFunction.prototype);
cVALUE.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElementRowCol(0, 0);
        }
    }
    arg0 = arg0.tocString();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    var res = g_oFormatParser.parse(arg0.getValue());
    if (res) {
        return this.value = new cNumber(res.value);
    } else {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
};
cVALUE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( string )"
    };
};