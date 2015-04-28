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
cFormulaFunction.Mathematic = {
    "groupName": "Mathematic",
    "ABS": cABS,
    "ACOS": cACOS,
    "ACOSH": cACOSH,
    "ASIN": cASIN,
    "ASINH": cASINH,
    "ATAN": cATAN,
    "ATAN2": cATAN2,
    "ATANH": cATANH,
    "CEILING": cCEILING,
    "COMBIN": cCOMBIN,
    "COS": cCOS,
    "COSH": cCOSH,
    "DEGREES": cDEGREES,
    "ECMA.CEILING": cECMA_CEILING,
    "EVEN": cEVEN,
    "EXP": cEXP,
    "FACT": cFACT,
    "FACTDOUBLE": cFACTDOUBLE,
    "FLOOR": cFLOOR,
    "GCD": cGCD,
    "INT": cINT,
    "ISO.CEILING": cISO_CEILING,
    "LCM": cLCM,
    "LN": cLN,
    "LOG": cLOG,
    "LOG10": cLOG10,
    "MDETERM": cMDETERM,
    "MINVERSE": cMINVERSE,
    "MMULT": cMMULT,
    "MOD": cMOD,
    "MROUND": cMROUND,
    "MULTINOMIAL": cMULTINOMIAL,
    "ODD": cODD,
    "PI": cPI,
    "POWER": cPOWER,
    "PRODUCT": cPRODUCT,
    "QUOTIENT": cQUOTIENT,
    "RADIANS": cRADIANS,
    "RAND": cRAND,
    "RANDBETWEEN": cRANDBETWEEN,
    "ROMAN": cROMAN,
    "ROUND": cROUND,
    "ROUNDDOWN": cROUNDDOWN,
    "ROUNDUP": cROUNDUP,
    "SERIESSUM": cSERIESSUM,
    "SIGN": cSIGN,
    "SIN": cSIN,
    "SINH": cSINH,
    "SQRT": cSQRT,
    "SQRTPI": cSQRTPI,
    "SUBTOTAL": cSUBTOTAL,
    "SUM": cSUM,
    "SUMIF": cSUMIF,
    "SUMIFS": cSUMIFS,
    "SUMPRODUCT": cSUMPRODUCT,
    "SUMSQ": cSUMSQ,
    "SUMX2MY2": cSUMX2MY2,
    "SUMX2PY2": cSUMX2PY2,
    "SUMXMY2": cSUMXMY2,
    "TAN": cTAN,
    "TANH": cTANH,
    "TRUNC": cTRUNC
};
function cABS() {
    this.name = "ABS";
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
cABS.prototype = Object.create(cBaseFunction.prototype);
cABS.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    this.array[r][c] = new cNumber(Math.abs(elem.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            return this.value = new cNumber(Math.abs(arg0.getValue()));
        }
    }
    return this.value = arg0;
};
cABS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cACOS() {
    this.name = "ACOS";
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
cACOS.prototype = Object.create(cBaseFunction.prototype);
cACOS.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.acos(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.acos(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cACOS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cACOSH() {
    this.name = "ACOSH";
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
cACOSH.prototype = Object.create(cBaseFunction.prototype);
cACOSH.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.acosh(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.acosh(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cACOSH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cASIN() {
    this.name = "ASIN";
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
cASIN.prototype = Object.create(cBaseFunction.prototype);
cASIN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.asin(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.asin(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cASIN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cASINH() {
    this.name = "ASINH";
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
cASINH.prototype = Object.create(cBaseFunction.prototype);
cASINH.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.asinh(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.asinh(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cASINH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cATAN() {
    this.name = "ATAN";
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
cATAN.prototype = Object.create(cBaseFunction.prototype);
cATAN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.atan(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            var a = Math.atan(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cATAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cATAN2() {
    this.name = "ATAN2";
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
cATAN2.prototype = Object.create(cBaseFunction.prototype);
cATAN2.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(b.getValue(), a.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(b.getValue(), a.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0,
                    b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        this.array[r][c] = a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(b.getValue(), a.getValue()));
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    return this.value = (arg0 instanceof cError ? arg0 : arg1 instanceof cError ? arg1 : arg1.getValue() == 0 && arg0.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(arg1.getValue(), arg0.getValue())));
};
cATAN2.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x, y )"
    };
};
function cATANH() {
    this.name = "ATANH";
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
cATANH.prototype = Object.create(cBaseFunction.prototype);
cATANH.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.atanh(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.atanh(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cATANH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cCEILING() {
    this.name = "CEILING";
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
cCEILING.prototype = Object.create(cBaseFunction.prototype);
cCEILING.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg[0].tocNumber();
    arg1 = arg[1].tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    function ceilingHelper(number, significance) {
        if (significance == 0) {
            return new cNumber(0);
        }
        if ((number > 0 && significance < 0) || (number < 0 && significance > 0)) {
            return new cError(cErrorType.not_numeric);
        } else {
            if (number / significance === Infinity) {
                return new cError(cErrorType.not_numeric);
            } else {
                var quotient = number / significance;
                if (quotient == 0) {
                    return new cNumber(0);
                }
                var quotientTr = Math.floor(quotient);
                var nolpiat = 5 * (quotient < 0 ? -1 : quotient > 0 ? 1 : 0) * Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);
                if (Math.abs(quotient - quotientTr) > nolpiat) {
                    ++quotientTr;
                }
                return new cNumber(quotientTr * significance);
            }
        }
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = ceilingHelper(a.getValue(), b.getValue());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = ceilingHelper(a.getValue(), b.getValue());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0,
                    b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        this.array[r][c] = ceilingHelper(a.getValue(), b.getValue());
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    return this.value = ceilingHelper(arg0.getValue(), arg1.getValue());
};
cCEILING.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x, significance )"
    };
};
function cCOMBIN() {
    this.name = "COMBIN";
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
cCOMBIN.prototype = Object.create(cBaseFunction.prototype);
cCOMBIN.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    if (a.getValue() <= 0 || b.getValue() <= 0) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    }
                    this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0,
                    b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        if (a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue()) {
                            this.array[r][c] = new cError(cErrorType.not_numeric);
                        }
                        this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    if (arg0.getValue() <= 0 || arg1.getValue() <= 0 || arg0.getValue() < arg1.getValue()) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    return this.value = new cNumber(Math.binomCoeff(arg0.getValue(), arg1.getValue()));
};
cCOMBIN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number , number-chosen )"
    };
};
function cCOS() {
    this.name = "COS";
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
cCOS.prototype = Object.create(cBaseFunction.prototype);
cCOS.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.cos(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.cos(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cCOS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cCOSH() {
    this.name = "COSH";
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
cCOSH.prototype = Object.create(cBaseFunction.prototype);
cCOSH.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.cosh(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.cosh(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cCOSH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cDEGREES() {
    this.name = "DEGREES";
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
cDEGREES.prototype = Object.create(cBaseFunction.prototype);
cDEGREES.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = elem.getValue();
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a * 180 / Math.PI);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = arg0.getValue();
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a * 180 / Math.PI);
        }
    }
    return this.value = arg0;
};
cDEGREES.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( angle )"
    };
};
function cECMA_CEILING() {
    cBaseFunction.call(this, "ECMA_CEILING");
}
cECMA_CEILING.prototype = Object.create(cBaseFunction.prototype);
function cEVEN() {
    this.name = "EVEN";
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
cEVEN.prototype = Object.create(cBaseFunction.prototype);
cEVEN.prototype.Calculate = function (arg) {
    function evenHelper(arg) {
        var arg0 = arg.getValue();
        if (arg0 >= 0) {
            arg0 = Math.ceil(arg0);
            if ((arg0 & 1) == 0) {
                return new cNumber(arg0);
            } else {
                return new cNumber(arg0 + 1);
            }
        } else {
            arg0 = Math.floor(arg0);
            if ((arg0 & 1) == 0) {
                return new cNumber(arg0);
            } else {
                return new cNumber(arg0 - 1);
            }
        }
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cArray) {
        arg0.foreach(function (elem, r, c) {
            if (elem instanceof cNumber) {
                this.array[r][c] = evenHelper(elem);
            } else {
                this.array[r][c] = new cError(cErrorType.wrong_value_type);
            }
        });
        return this.value = arg0;
    } else {
        if (arg0 instanceof cNumber) {
            return this.value = evenHelper(arg0);
        }
    }
    return this.value = new cError(cErrorType.wrong_value_type);
};
cEVEN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cEXP() {
    this.name = "EXP";
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
cEXP.prototype = Object.create(cBaseFunction.prototype);
cEXP.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.exp(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        }
    }
    if (! (arg0 instanceof cNumber)) {
        return this.value = new cError(cErrorType.not_numeric);
    } else {
        var a = Math.exp(arg0.getValue());
        return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
    }
    return this.value = arg0;
};
cEXP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cFACT() {
    this.name = "FACT";
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
cFACT.prototype = Object.create(cBaseFunction.prototype);
cFACT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    if (elem.getValue() < 0) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    } else {
                        var a = Math.fact(elem.getValue());
                        this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                    }
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            if (arg0.getValue() < 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var a = Math.fact(arg0.getValue());
            return this.value = isNaN(a) || a == Infinity ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cFACT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cFACTDOUBLE() {
    this.name = "FACTDOUBLE";
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
cFACTDOUBLE.prototype = Object.create(cBaseFunction.prototype);
cFACTDOUBLE.prototype.Calculate = function (arg) {
    function factDouble(n) {
        if (n == 0) {
            return 0;
        } else {
            if (n < 0) {
                return Number.NaN;
            } else {
                if (n > 300) {
                    return Number.Infinity;
                }
            }
        }
        n = Math.floor(n);
        var k = 1,
        res = n,
        _n = n,
        ost = -(_n & 1);
        n -= 2;
        while (n != ost) {
            res *= n;
            n -= 2;
        }
        return res;
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    if (elem.getValue() < 0) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    } else {
                        var a = factDouble(elem.getValue());
                        this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                    }
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            if (arg0.getValue() < 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var a = factDouble(arg0.getValue());
            return this.value = isNaN(a) || a == Infinity ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cFACTDOUBLE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cFLOOR() {
    this.name = "FLOOR";
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
cFLOOR.prototype = Object.create(cBaseFunction.prototype);
cFLOOR.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg[0].tocNumber();
    arg1 = arg[1].tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    function floorHelper(number, significance) {
        if (significance == 0) {
            return new cNumber(0);
        }
        if ((number > 0 && significance < 0) || (number < 0 && significance > 0)) {
            return new cError(cErrorType.not_numeric);
        } else {
            if (number / significance === Infinity) {
                return new cError(cErrorType.not_numeric);
            } else {
                var quotient = number / significance;
                if (quotient == 0) {
                    return new cNumber(0);
                }
                var nolpiat = 5 * (quotient < 0 ? -1 : quotient > 0 ? 1 : 0) * Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);
                return new cNumber(Math.floor(quotient + nolpiat) * significance);
            }
        }
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = floorHelper(a.getValue(), b.getValue());
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
                    this.array[r][c] = floorHelper(a.getValue(), b.getValue());
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
                        this.array[r][c] = floorHelper(a.getValue(), b.getValue());
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    if (arg0 instanceof cString || arg1 instanceof cString) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = floorHelper(arg0.getValue(), arg1.getValue());
};
cFLOOR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x, significance )"
    };
};
function cGCD() {
    this.name = "GCD";
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
cGCD.prototype = Object.create(cBaseFunction.prototype);
cGCD.prototype.Calculate = function (arg) {
    var _gcd = 0;
    function gcd(a, b) {
        var _a = parseInt(a),
        _b = parseInt(b);
        while (_b != 0) {
            _b = _a % (_a = _b);
        }
        return _a;
    }
    for (var i = 0; i < this.getArguments(); i++) {
        var argI = arg[i];
        if (argI instanceof cArea || argI instanceof cArea3D) {
            var argArr = argI.getValue();
            for (var j = 0; j < argArr.length; j++) {
                if (argArr[j] instanceof cError) {
                    return this.value = argArr[j];
                }
                if (argArr[j] instanceof cString) {
                    continue;
                }
                if (argArr[j] instanceof cBool) {
                    argArr[j] = argArr[j].tocNumber();
                }
                if (argArr[j].getValue() < 0) {
                    return this.value = new cError(cErrorType.not_numeric);
                }
                _gcd = gcd(_gcd, argArr[j].getValue());
            }
        } else {
            if (argI instanceof cArray) {
                var argArr = argI.tocNumber();
                if (argArr.foreach(function (arrElem) {
                    if (arrElem instanceof cError) {
                        _gcd = arrElem;
                        return true;
                    }
                    if (arrElem instanceof cBool) {
                        arrElem = arrElem.tocNumber();
                    }
                    if (arrElem instanceof cString) {
                        return;
                    }
                    if (arrElem.getValue() < 0) {
                        _gcd = new cError(cErrorType.not_numeric);
                        return true;
                    }
                    _gcd = gcd(_gcd, arrElem.getValue());
                })) {
                    return this.value = _gcd;
                }
            } else {
                argI = argI.tocNumber();
                if (argI.getValue() < 0) {
                    return this.value = new cError(cErrorType.not_numeric);
                }
                if (argI instanceof cError) {
                    return this.value = argI;
                }
                _gcd = gcd(_gcd, argI.getValue());
            }
        }
    }
    return this.value = new cNumber(_gcd);
};
cGCD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cINT() {
    this.name = "INT";
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
cINT.prototype = Object.create(cBaseFunction.prototype);
cINT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cString) {
        this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg0 instanceof cArray) {
        arg0.foreach(function (elem, r, c) {
            if (elem instanceof cNumber) {
                this.array[r][c] = new cNumber(Math.floor(elem.getValue()));
            } else {
                this.array[r][c] = new cError(cErrorType.wrong_value_type);
            }
        });
    } else {
        return this.value = new cNumber(Math.floor(arg0.getValue()));
    }
    return this.value = new cNumber(Math.floor(arg0.getValue()));
};
cINT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cISO_CEILING() {
    cBaseFunction.call(this, "ISO_CEILING");
}
cISO_CEILING.prototype = Object.create(cBaseFunction.prototype);
function cLCM() {
    this.name = "LCM";
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
cLCM.prototype = Object.create(cBaseFunction.prototype);
cLCM.prototype.Calculate = function (arg) {
    var _lcm = 1;
    function gcd(a, b) {
        var _a = parseInt(a),
        _b = parseInt(b);
        while (_b != 0) {
            _b = _a % (_a = _b);
        }
        return _a;
    }
    function lcm(a, b) {
        return Math.abs(parseInt(a) * parseInt(b)) / gcd(a, b);
    }
    for (var i = 0; i < this.getArguments(); i++) {
        var argI = arg[i];
        if (argI instanceof cArea || argI instanceof cArea3D) {
            var argArr = argI.getValue();
            for (var j = 0; j < argArr.length; j++) {
                if (argArr[j] instanceof cError) {
                    return this.value = argArr[j];
                }
                if (argArr[j] instanceof cString) {
                    continue;
                }
                if (argArr[j] instanceof cBool) {
                    argArr[j] = argArr[j].tocNumber();
                }
                if (argArr[j].getValue() <= 0) {
                    return this.value = new cError(cErrorType.not_numeric);
                }
                _lcm = lcm(_lcm, argArr[j].getValue());
            }
        } else {
            if (argI instanceof cArray) {
                var argArr = argI.tocNumber();
                if (argArr.foreach(function (arrElem) {
                    if (arrElem instanceof cError) {
                        _lcm = arrElem;
                        return true;
                    }
                    if (arrElem instanceof cBool) {
                        arrElem = arrElem.tocNumber();
                    }
                    if (arrElem instanceof cString) {
                        return;
                    }
                    if (arrElem.getValue() <= 0) {
                        _lcm = new cError(cErrorType.not_numeric);
                        return true;
                    }
                    _lcm = lcm(_lcm, arrElem.getValue());
                })) {
                    return this.value = _lcm;
                }
            } else {
                argI = argI.tocNumber();
                if (argI.getValue() <= 0) {
                    return this.value = new cError(cErrorType.not_numeric);
                }
                if (argI instanceof cError) {
                    return this.value = argI;
                }
                _lcm = lcm(_lcm, argI.getValue());
            }
        }
    }
    return this.value = new cNumber(_lcm);
};
cLCM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cLN() {
    this.name = "LN";
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
cLN.prototype = Object.create(cBaseFunction.prototype);
cLN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cString) {
        return this.value = new cError(cErrorType.wrong_value_type);
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    if (elem.getValue() <= 0) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    } else {
                        this.array[r][c] = new cNumber(Math.log(elem.getValue()));
                    }
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            if (arg0.getValue() <= 0) {
                return this.value = new cError(cErrorType.not_numeric);
            } else {
                return this.value = new cNumber(Math.log(arg0.getValue()));
            }
        }
    }
};
cLN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cLOG() {
    this.name = "LOG";
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
cLOG.prototype = Object.create(cBaseFunction.prototype);
cLOG.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1] ? arg[1] : new cNumber(10);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1 ? arg1 : new cNumber(10);
                if (a instanceof cNumber && b instanceof cNumber) {
                    if (a.getValue() <= 0 || a.getValue() <= 0) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    }
                    this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0,
                    b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        if (a.getValue() <= 0 || a.getValue() <= 0) {
                            this.array[r][c] = new cError(cErrorType.not_numeric);
                        }
                        this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg0.getValue() <= 0 || (arg1 && arg1.getValue() <= 0)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    return this.value = new cNumber(Math.log(arg0.getValue()) / Math.log(arg1.getValue()));
};
cLOG.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x [ , base ] )"
    };
};
function cLOG10() {
    this.name = "LOG10";
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
cLOG10.prototype = Object.create(cBaseFunction.prototype);
cLOG10.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cString) {
        return this.value = new cError(cErrorType.wrong_value_type);
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    if (elem.getValue() <= 0) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    } else {
                        this.array[r][c] = new cNumber(Math.log10(elem.getValue()));
                    }
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            if (arg0.getValue() <= 0) {
                return this.value = new cError(cErrorType.not_numeric);
            } else {
                return this.value = new cNumber(Math.log10(arg0.getValue()));
            }
        }
    }
};
cLOG10.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cMDETERM() {
    this.name = "MDETERM";
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
cMDETERM.prototype = Object.create(cBaseFunction.prototype);
cMDETERM.prototype.Calculate = function (arg) {
    function determ(A) {
        var N = A.length,
        denom = 1,
        exchanges = 0;
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
                    return NaN;
                }
            }
        }
        for (var i = 0; i < N - 1; i++) {
            var maxN = i,
            maxValue = Math.abs(A[i][i] instanceof cEmpty ? NaN : A[i][i]);
            for (var j = i + 1; j < N; j++) {
                var value = Math.abs(A[j][i] instanceof cEmpty ? NaN : A[j][i]);
                if (value > maxValue) {
                    maxN = j;
                    maxValue = value;
                }
            }
            if (maxN > i) {
                var temp = A[i];
                A[i] = A[maxN];
                A[maxN] = temp;
                exchanges++;
            } else {
                if (maxValue == 0) {
                    return maxValue;
                }
            }
            var value1 = A[i][i] instanceof cEmpty ? NaN : A[i][i];
            for (var j = i + 1; j < N; j++) {
                var value2 = A[j][i] instanceof cEmpty ? NaN : A[j][i];
                A[j][i] = 0;
                for (var k = i + 1; k < N; k++) {
                    A[j][k] = (A[j][k] * value1 - A[i][k] * value2) / denom;
                }
            }
            denom = value1;
        }
        if (exchanges % 2) {
            return -A[N - 1][N - 1];
        } else {
            return A[N - 1][N - 1];
        }
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        return this.value = new cError(cErrorType.not_available);
    }
    if (arg0[0].length != arg0.length) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    arg0 = determ(arg0);
    if (!isNaN(arg0)) {
        return this.value = new cNumber(arg0);
    } else {
        return this.value = new cError(cErrorType.not_available);
    }
};
cMDETERM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array )"
    };
};
function cMINVERSE() {
    this.name = "MINVERSE";
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
cMINVERSE.prototype = Object.create(cBaseFunction.prototype);
cMINVERSE.prototype.Calculate = function (arg) {
    function Determinant(A) {
        var N = A.length,
        B = [],
        denom = 1,
        exchanges = 0;
        for (var i = 0; i < N; ++i) {
            B[i] = [];
            for (var j = 0; j < N; ++j) {
                B[i][j] = A[i][j];
            }
        }
        for (var i = 0; i < N - 1; ++i) {
            var maxN = i,
            maxValue = Math.abs(B[i][i]);
            for (var j = i + 1; j < N; ++j) {
                var value = Math.abs(B[j][i]);
                if (value > maxValue) {
                    maxN = j;
                    maxValue = value;
                }
            }
            if (maxN > i) {
                var temp = B[i];
                B[i] = B[maxN];
                B[maxN] = temp;
                ++exchanges;
            } else {
                if (maxValue == 0) {
                    return maxValue;
                }
            }
            var value1 = B[i][i];
            for (var j = i + 1; j < N; ++j) {
                var value2 = B[j][i];
                B[j][i] = 0;
                for (var k = i + 1; k < N; ++k) {
                    B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
                }
            }
            denom = value1;
        }
        if (exchanges % 2) {
            return -B[N - 1][N - 1];
        } else {
            return B[N - 1][N - 1];
        }
    }
    function MatrixCofactor(i, j, __A) {
        var N = __A.length,
        sign = ((i + j) % 2 == 0) ? 1 : -1;
        for (var m = 0; m < N; m++) {
            for (var n = j + 1; n < N; n++) {
                __A[m][n - 1] = __A[m][n];
            }
            __A[m].length--;
        }
        for (var k = (i + 1); k < N; k++) {
            __A[k - 1] = __A[k];
        }
        __A.length--;
        return sign * Determinant(__A);
    }
    function AdjugateMatrix(_A) {
        var N = _A.length,
        B = [],
        adjA = [];
        for (var i = 0; i < N; i++) {
            adjA[i] = [];
            for (var j = 0; j < N; j++) {
                for (var m = 0; m < N; m++) {
                    B[m] = [];
                    for (var n = 0; n < N; n++) {
                        B[m][n] = _A[m][n];
                    }
                }
                adjA[i][j] = MatrixCofactor(j, i, B);
            }
        }
        return adjA;
    }
    function InverseMatrix(A) {
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
                    return new cError(cErrorType.not_available);
                } else {
                    A[i][j] = A[i][j].getValue();
                }
            }
        }
        var detA = Determinant(A),
        invertA,
        res;
        if (detA != 0) {
            invertA = AdjugateMatrix(A);
            var datA = 1 / detA;
            for (var i = 0; i < invertA.length; i++) {
                for (var j = 0; j < invertA[i].length; j++) {
                    invertA[i][j] = new cNumber(datA * invertA[i][j]);
                }
            }
            res = new cArray();
            res.fillFromArray(invertA);
        } else {
            res = new cError(cErrorType.not_available);
        }
        return res;
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        return this.value = new cError(cErrorType.not_available);
    }
    if (arg0[0].length != arg0.length) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = InverseMatrix(arg0);
};
cMINVERSE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array )"
    };
};
function cMMULT() {
    this.name = "MMULT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cMMULT.prototype = Object.create(cBaseFunction.prototype);
cMMULT.prototype.Calculate = function (arg) {
    function mult(A, B) {
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
                    return new cError(cErrorType.not_available);
                }
            }
        }
        for (var i = 0; i < B.length; i++) {
            for (var j = 0; j < B[i].length; j++) {
                if (B[i][j] instanceof cEmpty || B[i][j] instanceof cString) {
                    return new cError(cErrorType.not_available);
                }
            }
        }
        if (A.length != B[0].length) {
            return new cError(cErrorType.wrong_value_type);
        }
        var C = new Array(A.length);
        for (var i = 0; i < A.length; i++) {
            C[i] = new Array(B[0].length);
            for (var j = 0; j < B[0].length; j++) {
                C[i][j] = 0;
                for (var k = 0; k < B.length; k++) {
                    C[i][j] += A[i][k].getValue() * B[k][j].getValue();
                }
                C[i][j] = new cNumber(C[i][j]);
            }
        }
        var res = new cArray();
        res.fillFromArray(C);
        return res;
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        return this.value = new cError(cErrorType.not_available);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArray) {
        arg1 = arg1.getMatrix();
    } else {
        return this.value = new cError(cErrorType.not_available);
    }
    return this.value = mult(arg0, arg1);
};
cMMULT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array1, array2 )"
    };
};
function cMOD() {
    this.name = "MOD";
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
cMOD.prototype = Object.create(cBaseFunction.prototype);
cMOD.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = new cNumber((b.getValue() < 0 ? -1 : 1) * (Math.abs(a.getValue()) % Math.abs(b.getValue())));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = new cNumber((b.getValue() < 0 ? -1 : 1) * (Math.abs(a.getValue()) % Math.abs(b.getValue())));
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0,
                    b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        this.array[r][c] = new cNumber((b.getValue() < 0 ? -1 : 1) * (Math.abs(a.getValue()) % Math.abs(b.getValue())));
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg1.getValue() == 0) {
        return this.value = new cError(cErrorType.division_by_zero);
    }
    return this.value = new cNumber((arg1.getValue() < 0 ? -1 : 1) * (Math.abs(arg0.getValue()) % Math.abs(arg1.getValue())));
};
cMOD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x, y )"
    };
};
function cMROUND() {
    this.name = "MROUND";
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
cMROUND.prototype = Object.create(cBaseFunction.prototype);
cMROUND.prototype.Calculate = function (arg) {
    var multiple;
    function mroundHelper(num) {
        var multiplier = Math.pow(10, Math.floor(Math.log10(Math.abs(num))) - cExcelSignificantDigits + 1);
        var nolpiat = 0.5 * (num > 0 ? 1 : num < 0 ? -1 : 0) * multiplier;
        var y = (num + nolpiat) / multiplier;
        y = y / Math.abs(y) * Math.floor(Math.abs(y));
        var x = y * multiplier / multiple;
        var nolpiat = 5 * (x / Math.abs(x)) * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - cExcelSignificantDigits);
        x = x + nolpiat;
        x = x | x;
        return x * multiple;
    }
    function f(a, b, r, c) {
        if (a instanceof cNumber && b instanceof cNumber) {
            if (a.getValue() == 0) {
                this.array[r][c] = new cNumber(0);
            } else {
                if (a.getValue() < 0 && b.getValue() > 0 || arg0.getValue() > 0 && b.getValue() < 0) {
                    this.array[r][c] = new cError(cErrorType.not_numeric);
                } else {
                    multiple = b.getValue();
                    this.array[r][c] = new cNumber(mroundHelper(a.getValue() + b.getValue() / 2));
                }
            }
        } else {
            this.array[r][c] = new cError(cErrorType.wrong_value_type);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cString || arg1 instanceof cString) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1, r, c);
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    f.call(this, arg0, elem, r, c);
                });
                return this.value = arg1;
            }
        }
    }
    if (arg1.getValue() == 0) {
        return this.value = new cNumber(0);
    }
    if (arg0.getValue() < 0 && arg1.getValue() > 0 || arg0.getValue() > 0 && arg1.getValue() < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    multiple = arg1.getValue();
    return this.value = new cNumber(mroundHelper(arg0.getValue() + arg1.getValue() / 2));
};
cMROUND.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x, multiple )"
    };
};
function cMULTINOMIAL() {
    this.name = "MULTINOMIAL";
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
cMULTINOMIAL.prototype = Object.create(cBaseFunction.prototype);
cMULTINOMIAL.prototype.Calculate = function (arg) {
    var arg0 = new cNumber(0),
    fact = 1;
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
            var _arrVal = arg[i].getValue();
            for (var j = 0; j < _arrVal.length; j++) {
                if (_arrVal[j] instanceof cNumber) {
                    if (_arrVal[j].getValue() < 0) {
                        return this.value = new cError(cError.not_numeric);
                    }
                    arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "+");
                    fact *= Math.fact(_arrVal[j].getValue());
                } else {
                    if (_arrVal[j] instanceof cError) {
                        return this.value = _arrVal[j];
                    } else {
                        return this.value = new cError(cError.wrong_value_type);
                    }
                }
            }
        } else {
            if (arg[i] instanceof cArray) {
                if (arg[i].foreach(function (arrElem) {
                    if (arrElem instanceof cNumber) {
                        if (arrElem.getValue() < 0) {
                            return true;
                        }
                        arg0 = _func[arg0.type][arrElem.type](arg0, arrElem, "+");
                        fact *= Math.fact(arrElem.getValue());
                    } else {
                        return true;
                    }
                })) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            } else {
                if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                    var _arg = arg[i].getValue();
                    if (_arg.getValue() < 0) {
                        return this.value = new cError(cErrorType.not_numeric);
                    }
                    if (_arg instanceof cNumber) {
                        if (_arg.getValue() < 0) {
                            return this.value = new cError(cError.not_numeric);
                        }
                        arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
                        fact *= Math.fact(_arg.getValue());
                    } else {
                        if (_arg instanceof cError) {
                            return this.value = _arg;
                        } else {
                            return this.value = new cError(cErrorType.wrong_value_type);
                        }
                    }
                } else {
                    if (arg[i] instanceof cNumber) {
                        if (arg[i].getValue() < 0) {
                            return this.value = new cError(cErrorType.not_numeric);
                        }
                        arg0 = _func[arg0.type][arg[i].type](arg0, arg[i], "+");
                        fact *= Math.fact(arg[i].getValue());
                    } else {
                        if (arg[i] instanceof cError) {
                            return this.value = arg[i];
                        } else {
                            return this.value = new cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
        if (arg0 instanceof cError) {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    if (arg0.getValue() > 170) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = new cNumber(Math.fact(arg0.getValue()) / fact);
};
cMULTINOMIAL.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cODD() {
    this.name = "ODD";
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
cODD.prototype = Object.create(cBaseFunction.prototype);
cODD.prototype.Calculate = function (arg) {
    function oddHelper(arg) {
        var arg0 = arg.getValue();
        if (arg0 >= 0) {
            arg0 = Math.ceil(arg0);
            if ((arg0 & 1) == 1) {
                return new cNumber(arg0);
            } else {
                return new cNumber(arg0 + 1);
            }
        } else {
            arg0 = Math.floor(arg0);
            if ((arg0 & 1) == 1) {
                return new cNumber(arg0);
            } else {
                return new cNumber(arg0 - 1);
            }
        }
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg0 instanceof cArray) {
        arg0.foreach(function (elem, r, c) {
            if (elem instanceof cNumber) {
                this.array[r][c] = oddHelper(elem);
            } else {
                this.array[r][c] = new cError(cErrorType.wrong_value_type);
            }
        });
        return this.value = arg0;
    } else {
        if (arg0 instanceof cNumber) {
            return this.value = oddHelper(arg0);
        }
    }
    return this.value = new cError(cErrorType.wrong_value_type);
};
cODD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cPI() {
    this.name = "PI";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cPI.prototype = Object.create(cBaseFunction.prototype);
cPI.prototype.Calculate = function () {
    return new cNumber(Math.PI);
};
cPI.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "()"
    };
};
function cPOWER() {
    this.name = "POWER";
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
cPOWER.prototype = Object.create(cBaseFunction.prototype);
cPOWER.prototype.Calculate = function (arg) {
    function powerHelper(a, b) {
        if (a == 0 && b < 0) {
            return new cError(cErrorType.division_by_zero);
        }
        if (a == 0 && b == 0) {
            return new cError(cErrorType.not_numeric);
        }
        return new cNumber(Math.pow(a, b));
    }
    function f(a, b, r, c) {
        if (a instanceof cNumber && b instanceof cNumber) {
            this.array[r][c] = powerHelper(a.getValue(), b.getValue());
        } else {
            this.array[r][c] = new cError(cErrorType.wrong_value_type);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1, r, c);
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    f.call(this, arg0, elem, r, c);
                });
                return this.value = arg1;
            }
        }
    }
    if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = powerHelper(arg0.getValue(), arg1.getValue());
};
cPOWER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x, y )"
    };
};
function cPRODUCT() {
    this.name = "PRODUCT";
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
cPRODUCT.prototype = Object.create(cBaseFunction.prototype);
cPRODUCT.prototype.Calculate = function (arg) {
    var arg0 = new cNumber(1);
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
            var _arrVal = arg[i].getValue();
            for (var j = 0; j < _arrVal.length; j++) {
                arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "*");
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                }
            }
        } else {
            if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                var _arg = arg[i].getValue();
                arg0 = _func[arg0.type][_arg.type](arg0, _arg, "*");
            } else {
                if (arg[i] instanceof cArray) {
                    arg[i].foreach(function (elem) {
                        if (elem instanceof cString || elem instanceof cBool || elem instanceof cEmpty) {
                            return;
                        }
                        arg0 = _func[arg0.type][elem.type](arg0, elem, "*");
                    });
                } else {
                    arg0 = _func[arg0.type][arg[i].type](arg0, arg[i], "*");
                }
            }
        }
        if (arg0 instanceof cError) {
            return this.value = arg0;
        }
    }
    return this.value = arg0;
};
cPRODUCT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cQUOTIENT() {
    this.name = "QUOTIENT";
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
cQUOTIENT.prototype = Object.create(cBaseFunction.prototype);
cQUOTIENT.prototype.Calculate = function (arg) {
    function quotient(a, b) {
        if (b.getValue() != 0) {
            return new cNumber(parseInt(a.getValue() / b.getValue()));
        } else {
            return new cError(cErrorType.division_by_zero);
        }
    }
    function f(a, b, r, c) {
        if (a instanceof cNumber && b instanceof cNumber) {
            this.array[r][c] = quotient(a, b);
        } else {
            this.array[r][c] = new cError(cErrorType.wrong_value_type);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1, r, c);
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    f.call(this, arg0, elem, r, c);
                });
                return this.value = arg1;
            }
        }
    }
    if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.setCA(quotient(arg0, arg1), true);
};
cQUOTIENT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( dividend , divisor )"
    };
};
function cRADIANS() {
    this.name = "RADIANS";
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
cRADIANS.prototype = Object.create(cBaseFunction.prototype);
cRADIANS.prototype.Calculate = function (arg) {
    function radiansHelper(ang) {
        return ang * Math.PI / 180;
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cArray) {
        arg0.foreach(function (elem, r, c) {
            if (elem instanceof cNumber) {
                this.array[r][c] = new cNumber(radiansHelper(elem.getValue()));
            } else {
                this.array[r][c] = new cError(cErrorType.wrong_value_type);
            }
        });
    } else {
        return this.value = (arg0 instanceof cError ? arg0 : new cNumber(radiansHelper(arg0.getValue())));
    }
    return this.value = arg0;
};
cRADIANS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( angle )"
    };
};
function cRAND() {
    this.name = "RAND";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cRAND.prototype = Object.create(cBaseFunction.prototype);
cRAND.prototype.Calculate = function () {
    return this.setCA(new cNumber(Math.random()), true);
};
cRAND.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "()"
    };
};
function cRANDBETWEEN() {
    this.name = "RANDBETWEEN";
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
cRANDBETWEEN.prototype = Object.create(cBaseFunction.prototype);
cRANDBETWEEN.prototype.Calculate = function (arg) {
    function randBetween(a, b) {
        return new cNumber(Math.round(Math.random() * Math.abs(a - b)) + a);
    }
    function f(a, b, r, c) {
        if (a instanceof cNumber && b instanceof cNumber) {
            this.array[r][c] = randBetween(a.getValue(), b.getValue());
        } else {
            this.array[r][c] = new cError(cErrorType.wrong_value_type);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                f.call(this, elem, arg1, r, c);
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    f.call(this, arg0, elem, r, c);
                });
                return this.value = arg1;
            }
        }
    }
    if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.setCA(new cNumber(randBetween(arg0.getValue(), arg1.getValue())), true);
};
cRANDBETWEEN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( lower-bound , upper-bound )"
    };
};
function cROMAN() {
    this.name = "ROMAN";
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
cROMAN.prototype = Object.create(cBaseFunction.prototype);
cROMAN.prototype.Calculate = function (arg) {
    function roman(num, mode) {
        if ((mode >= 0) && (mode < 5) && (num >= 0) && (num < 4000)) {
            var chars = ["M", "D", "C", "L", "X", "V", "I"],
            values = [1000, 500, 100, 50, 10, 5, 1],
            maxIndex = values.length - 1,
            aRoman = "",
            index,
            digit,
            index2,
            steps;
            for (var i = 0; i <= maxIndex / 2; i++) {
                index = 2 * i;
                digit = parseInt(num / values[index]);
                if ((digit % 5) == 4) {
                    index2 = (digit == 4) ? index - 1 : index - 2;
                    steps = 0;
                    while ((steps < mode) && (index < maxIndex)) {
                        steps++;
                        if (values[index2] - values[index + 1] <= num) {
                            index++;
                        } else {
                            steps = mode;
                        }
                    }
                    aRoman += chars[index];
                    aRoman += chars[index2];
                    num = (num + values[index]);
                    num = (num - values[index2]);
                } else {
                    if (digit > 4) {
                        aRoman += chars[index - 1];
                    }
                    for (var j = digit % 5; j > 0; j--) {
                        aRoman += chars[index];
                    }
                    num %= values[index];
                }
            }
            return new cString(aRoman);
        } else {
            return new cError(cErrorType.wrong_value_type);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D || arg1 instanceof cArea || arg1 instanceof cArea3D) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg0 instanceof cArray && arg1 instanceof cArray) {
        if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
            return this.value = new cError(cErrorType.not_available);
        } else {
            arg0.foreach(function (elem, r, c) {
                var a = elem;
                var b = arg1.getElementRowCol(r, c);
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = roman(a.getValue(), b.getValue());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        }
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                var a = elem,
                b = arg1;
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = roman(a.getValue(), b.getValue());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
            return this.value = arg0;
        } else {
            if (arg1 instanceof cArray) {
                arg1.foreach(function (elem, r, c) {
                    var a = arg0,
                    b = elem;
                    if (a instanceof cNumber && b instanceof cNumber) {
                        this.array[r][c] = roman(a.getValue(), b.getValue());
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    return this.value = roman(arg0.getValue(), arg1.getValue());
};
cROMAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number, form )"
    };
};
function cROUND() {
    this.name = "ROUND";
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
cROUND.prototype = Object.create(cBaseFunction.prototype);
cROUND.prototype.Calculate = function (arg) {
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
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
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
                    this.array[r][c] = roundHelper(a.getValue(), b.getValue());
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
                    this.array[r][c] = roundHelper(a.getValue(), b.getValue());
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
                        this.array[r][c] = roundHelper(a.getValue(), b.getValue());
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
    return this.value = roundHelper(number, num_digits);
};
cROUND.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , number-digits )"
    };
};
function cROUNDDOWN() {
    this.name = "ROUNDDOWN";
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
cROUNDDOWN.prototype = Object.create(cBaseFunction.prototype);
cROUNDDOWN.prototype.Calculate = function (arg) {
    function rounddownHelper(number, num_digits) {
        if (num_digits > cExcelMaxExponent) {
            if (Math.abs(number) >= 1e-100 || num_digits <= 98303) {
                return new cNumber(number);
            }
            return new cNumber(0);
        } else {
            if (num_digits < cExcelMinExponent) {
                if (Math.abs(number) >= 1e+100) {
                    return new cNumber(number);
                }
                return new cNumber(0);
            }
        }
        var significance = Math.pow(10, -(num_digits | num_digits));
        if (Number.POSITIVE_INFINITY == Math.abs(number / significance)) {
            return new cNumber(number);
        }
        var x = number * Math.pow(10, num_digits);
        x = x | x;
        return new cNumber(x * significance);
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
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
                    this.array[r][c] = rounddownHelper(a.getValue(), b.getValue());
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
                    this.array[r][c] = rounddownHelper(a.getValue(), b.getValue());
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
                        this.array[r][c] = rounddownHelper(a.getValue(), b.getValue());
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
    return this.value = rounddownHelper(number, num_digits);
};
cROUNDDOWN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , number-digits )"
    };
};
function cROUNDUP() {
    this.name = "ROUNDUP";
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
cROUNDUP.prototype = Object.create(cBaseFunction.prototype);
cROUNDUP.prototype.Calculate = function (arg) {
    function roundupHelper(number, num_digits) {
        if (num_digits > cExcelMaxExponent) {
            if (Math.abs(number) >= 1e-100 || num_digits <= 98303) {
                return new cNumber(number);
            }
            return new cNumber(0);
        } else {
            if (num_digits < cExcelMinExponent) {
                if (Math.abs(number) >= 1e+100) {
                    return new cNumber(number);
                }
                return new cNumber(0);
            }
        }
        var significance = Math.pow(10, -(num_digits | num_digits));
        if (Number.POSITIVE_INFINITY == Math.abs(number / significance)) {
            return new cNumber(number);
        }
        var x = number * Math.pow(10, num_digits);
        x = (x | x) + (x > 0 ? 1 : x < 0 ? -1 : 0) * 1;
        return new cNumber(x * significance);
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
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
                    this.array[r][c] = roundupHelper(a.getValue(), b.getValue());
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
                    this.array[r][c] = roundupHelper(a.getValue(), b.getValue());
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
                        this.array[r][c] = roundupHelper(a.getValue(), b.getValue());
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
    return this.value = roundupHelper(number, num_digits);
};
cROUNDUP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , number-digits )"
    };
};
function cSERIESSUM() {
    this.name = "SERIESSUM";
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
cSERIESSUM.prototype = Object.create(cBaseFunction.prototype);
cSERIESSUM.prototype.Calculate = function (arg) {
    function SERIESSUM(x, n, m, a) {
        x = x.getValue();
        n = n.getValue();
        m = m.getValue();
        for (var i = 0; i < a.length; i++) {
            if (! (a[i] instanceof cNumber)) {
                return new cError(cErrorType.wrong_value_type);
            }
            a[i] = a[i].getValue();
        }
        function sumSeries(x, n, m, a) {
            var sum = 0;
            for (var i = 0; i < a.length; i++) {
                sum += a[i] * Math.pow(x, n + i * m);
            }
            return sum;
        }
        return new cNumber(sumSeries(x, n, m, a));
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    if (arg0 instanceof cNumber || arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.tocNumber();
    } else {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg1 instanceof cNumber || arg1 instanceof cRef || arg1 instanceof cRef3D) {
        arg1 = arg1.tocNumber();
    } else {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg2 instanceof cNumber || arg2 instanceof cRef || arg2 instanceof cRef3D) {
        arg2 = arg2.tocNumber();
    } else {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg3 instanceof cNumber || arg3 instanceof cRef || arg3 instanceof cRef3D) {
        arg3 = [arg3.tocNumber()];
    } else {
        if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
            arg3 = arg3.getValue();
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = SERIESSUM(arg0, arg1, arg2, arg3);
};
cSERIESSUM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( input-value , initial-power , step , coefficients )"
    };
};
function cSIGN() {
    this.name = "SIGN";
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
cSIGN.prototype = Object.create(cBaseFunction.prototype);
cSIGN.prototype.Calculate = function (arg) {
    function signHelper(arg) {
        if (arg < 0) {
            return new cNumber(-1);
        } else {
            if (arg == 0) {
                return new cNumber(0);
            } else {
                return new cNumber(1);
            }
        }
    }
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = elem.getValue();
                    this.array[r][c] = signHelper(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = arg0.getValue();
            return this.value = signHelper(a);
        }
    }
    return this.value = arg0;
};
cSIGN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cSIN() {
    this.name = "SIN";
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
cSIN.prototype = Object.create(cBaseFunction.prototype);
cSIN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.sin(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.sin(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cSIN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cSINH() {
    this.name = "SINH";
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
cSINH.prototype = Object.create(cBaseFunction.prototype);
cSINH.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.sinh(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.sinh(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cSINH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cSQRT() {
    this.name = "SQRT";
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
cSQRT.prototype = Object.create(cBaseFunction.prototype);
cSQRT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.sqrt(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.sqrt(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cSQRT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cSQRTPI() {
    this.name = "SQRTPI";
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
cSQRTPI.prototype = Object.create(cBaseFunction.prototype);
cSQRTPI.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.sqrt(elem.getValue() * Math.PI);
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.sqrt(arg0.getValue() * Math.PI);
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cSQRTPI.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cSUBTOTAL() {
    cBaseFunction.call(this, "SUBTOTAL");
}
cSUBTOTAL.prototype = Object.create(cBaseFunction.prototype);
function cSUM() {
    this.name = "SUM";
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
cSUM.prototype = Object.create(cBaseFunction.prototype);
cSUM.prototype.Calculate = function (arg) {
    var arg0 = new cNumber(0);
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
            var _arrVal = arg[i].getValue();
            for (var j = 0; j < _arrVal.length; j++) {
                if (! (_arrVal[j] instanceof cBool || _arrVal[j] instanceof cString)) {
                    arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "+");
                }
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                }
            }
        } else {
            if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                var _arg = arg[i].getValue();
                if (! (_arg instanceof cBool || _arg instanceof cString)) {
                    arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
                }
            } else {
                if (arg[i] instanceof cArray) {
                    arg[i].foreach(function (arrElem) {
                        if (! (arrElem instanceof cBool || arrElem instanceof cString || arrElem instanceof cEmpty)) {
                            arg0 = _func[arg0.type][arrElem.type](arg0, arrElem, "+");
                        }
                    });
                } else {
                    var _arg = arg[i].tocNumber();
                    arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
                }
            }
        }
        if (arg0 instanceof cError) {
            return this.value = arg0;
        }
    }
    return this.value = arg0;
};
cSUM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSUMIF() {
    this.name = "SUMIF";
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
cSUMIF.prototype = Object.create(cBaseFunction.prototype);
cSUMIF.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2] ? arg[2] : arg[0],
    _sum = 0,
    valueForSearching,
    regexpSearch;
    if (! (arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea)) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (! (arg2 instanceof cRef || arg2 instanceof cRef3D || arg2 instanceof cArea)) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElementRowCol(0, 0);
        }
    }
    arg1 = arg1.tocString();
    if (! (arg1 instanceof cString)) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    arg1 = arg1.toString();
    var operators = new RegExp("^ *[<=> ]+ *"),
    match = arg1.match(operators),
    search,
    oper,
    val;
    if (match) {
        search = arg1.substr(match[0].length);
        oper = match[0].replace(/\s/g, "");
    } else {
        search = arg1;
    }
    valueForSearching = parseNum(search) ? new cNumber(search) : new cString(search);
    if (arg0 instanceof cArea) {
        var arg0Matrix = arg0.getMatrix(),
        arg2Matrix = arg2.getMatrix(),
        valMatrix0,
        valMatrix2;
        for (var i = 0; i < arg0Matrix.length; i++) {
            for (var j = 0; j < arg0Matrix[i].length; j++) {
                valMatrix0 = arg0Matrix[i][j];
                valMatrix2 = arg2Matrix[i][j] ? arg2Matrix[i][j] : new cEmpty();
                if (matching(valMatrix0, valueForSearching, oper)) {
                    if (valMatrix2 instanceof cNumber) {
                        _sum += valMatrix2.getValue();
                    }
                }
            }
        }
    } else {
        val = arg0.getValue();
        if (matching(val, valueForSearching, oper)) {
            var r = arg0.getRange(),
            ws = arg0.getWS(),
            r1 = r.first.getRow0() + 0,
            c1 = arg2.getRange().first.getCol0();
            r = new cRef(ws.getRange3(r1, c1, r1, c1).getName(), ws);
            if (r.getValue() instanceof cNumber) {
                _sum += r.getValue().getValue();
            }
        }
    }
    return this.value = new cNumber(_sum);
};
cSUMIF.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cell-range, selection-criteria [ , sum-range ] )"
    };
};
function cSUMIFS() {
    cBaseFunction.call(this, "SUMIFS");
}
cSUMIFS.prototype = Object.create(cBaseFunction.prototype);
function cSUMPRODUCT() {
    this.name = "SUMPRODUCT";
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
cSUMPRODUCT.prototype = Object.create(cBaseFunction.prototype);
cSUMPRODUCT.prototype.Calculate = function (arg) {
    var arg0 = new cNumber(0),
    resArr = [],
    col = 0,
    row = 0,
    res = 1,
    _res = [];
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea3D) {
            return this.value = new cError(cErrorType.bad_reference);
        }
        if (arg[i] instanceof cArea || arg[i] instanceof cArray) {
            resArr[i] = arg[i].getMatrix();
        } else {
            if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                resArr[i] = [[arg[i].getValue()]];
            } else {
                resArr[i] = [[arg[i]]];
            }
        }
        row = Math.max(resArr[0].length, row);
        col = Math.max(resArr[0][0].length, col);
        if (row != resArr[i].length || col != resArr[i][0].length) {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
        if (arg[i] instanceof cError) {
            return this.value = arg[i];
        }
    }
    for (var iRow = 0; iRow < row; iRow++) {
        for (var iCol = 0; iCol < col; iCol++) {
            res = 1;
            for (var iRes = 0; iRes < resArr.length; iRes++) {
                arg0 = resArr[iRes][iRow][iCol];
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    if (arg0 instanceof cString) {
                        if (arg0.tocNumber() instanceof cError) {
                            res *= 0;
                        } else {
                            res *= arg0.tocNumber().getValue();
                        }
                    } else {
                        res *= arg0.tocNumber().getValue();
                    }
                }
            }
            _res.push(res);
        }
    }
    res = 0;
    for (var i = 0; i < _res.length; i++) {
        res += _res[i];
    }
    return this.value = new cNumber(res);
};
cSUMPRODUCT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSUMSQ() {
    this.name = "SUMSQ";
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
cSUMSQ.prototype = Object.create(cBaseFunction.prototype);
cSUMSQ.prototype.Calculate = function (arg) {
    var arg0 = new cNumber(0);
    function sumsqHelper(a, b) {
        var c = _func[b.type][b.type](b, b, "*");
        return _func[a.type][c.type](a, c, "+");
    }
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
            var _arrVal = arg[i].getValue();
            for (var j = 0; j < _arrVal.length; j++) {
                if (_arrVal[j] instanceof cNumber) {
                    arg0 = sumsqHelper(arg0, _arrVal[j]);
                } else {
                    if (_arrVal[j] instanceof cError) {
                        return this.value = _arrVal[j];
                    }
                }
            }
        } else {
            if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                var _arg = arg[i].getValue();
                if (_arg instanceof cNumber) {
                    arg0 = sumsqHelper(arg0, _arg);
                }
            } else {
                if (arg[i] instanceof cArray) {
                    arg[i].foreach(function (arrElem) {
                        if (arrElem instanceof cNumber) {
                            arg0 = sumsqHelper(arg0, arrElem);
                        }
                    });
                } else {
                    var _arg = arg[i].tocNumber();
                    arg0 = sumsqHelper(arg0, _arg);
                }
            }
        }
        if (arg0 instanceof cError) {
            return this.value = arg0;
        }
    }
    return this.value = arg0;
};
cSUMSQ.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSUMX2MY2() {
    this.name = "SUMX2MY2";
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
cSUMX2MY2.prototype = Object.create(cBaseFunction.prototype);
cSUMX2MY2.prototype.Calculate = function (arg) {
    function sumX2MY2(a, b, _3d) {
        var sum = 0;
        function a2Mb2(a, b) {
            return a * a - b * b;
        }
        if (!_3d) {
            if (a.length == b.length && a[0].length == b[0].length) {
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[0].length; j++) {
                        if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
                            sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue());
                        } else {
                            return new cError(cErrorType.wrong_value_type);
                        }
                    }
                }
                return new cNumber(sum);
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        } else {
            if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[0].length; j++) {
                        for (var k = 0; k < a[0][0].length; k++) {
                            if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
                                sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue());
                            } else {
                                return new cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
                return new cNumber(sum);
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
        return this.value = sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
    }
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
        arg1 = arg1.getMatrix();
    } else {
        if (arg1 instanceof cError) {
            return this.value = arg1;
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = sumX2MY2(arg0, arg1, false);
};
cSUMX2MY2.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cSUMX2PY2() {
    this.name = "SUMX2PY2";
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
cSUMX2PY2.prototype = Object.create(cBaseFunction.prototype);
cSUMX2PY2.prototype.Calculate = function (arg) {
    function sumX2MY2(a, b, _3d) {
        var sum = 0;
        function a2Mb2(a, b) {
            return a * a + b * b;
        }
        if (!_3d) {
            if (a.length == b.length && a[0].length == b[0].length) {
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[0].length; j++) {
                        if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
                            sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue());
                        } else {
                            return new cError(cErrorType.wrong_value_type);
                        }
                    }
                }
                return new cNumber(sum);
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        } else {
            if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[0].length; j++) {
                        for (var k = 0; k < a[0][0].length; k++) {
                            if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
                                sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue());
                            } else {
                                return new cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
                return new cNumber(sum);
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
        return this.value = sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
    }
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
        arg1 = arg1.getMatrix();
    } else {
        if (arg1 instanceof cError) {
            return this.value = arg1;
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = sumX2MY2(arg0, arg1, false);
};
cSUMX2PY2.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cSUMXMY2() {
    this.name = "SUMXMY2";
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
cSUMXMY2.prototype = Object.create(cBaseFunction.prototype);
cSUMXMY2.prototype.Calculate = function (arg) {
    function sumX2MY2(a, b, _3d) {
        var sum = 0;
        function a2Mb2(a, b) {
            return (a - b) * (a - b);
        }
        if (!_3d) {
            if (a.length == b.length && a[0].length == b[0].length) {
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[0].length; j++) {
                        if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
                            sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue());
                        } else {
                            return new cError(cErrorType.wrong_value_type);
                        }
                    }
                }
                return new cNumber(sum);
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        } else {
            if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < a[0].length; j++) {
                        for (var k = 0; k < a[0][0].length; k++) {
                            if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
                                sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue());
                            } else {
                                return new cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
                return new cNumber(sum);
            } else {
                return new cError(cErrorType.wrong_value_type);
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
        return this.value = sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
    }
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
        arg1 = arg1.getMatrix();
    } else {
        if (arg1 instanceof cError) {
            return this.value = arg1;
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = sumX2MY2(arg0, arg1, false);
};
cSUMXMY2.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cTAN() {
    this.name = "TAN";
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
cTAN.prototype = Object.create(cBaseFunction.prototype);
cTAN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.tan(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.tan(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cTAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cTANH() {
    this.name = "TANH";
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
cTANH.prototype = Object.create(cBaseFunction.prototype);
cTANH.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem, r, c) {
                if (elem instanceof cNumber) {
                    var a = Math.tanh(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = Math.tanh(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cTANH.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x )"
    };
};
function cTRUNC() {
    this.name = "TRUNC";
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
cTRUNC.prototype = Object.create(cBaseFunction.prototype);
cTRUNC.prototype.Calculate = function (arg) {
    function truncHelper(a, b) {
        var c = a < 0 ? 1 : 0;
        if (b == 0) {
            return new cNumber(a.toString().substr(0, 1 + c));
        } else {
            if (b > 0) {
                return new cNumber(a.toString().substr(0, b + 2 + c));
            } else {
                return new cNumber(0);
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1] ? arg[1] : new cNumber(0);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cError) {
        return this.value = arg1;
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
                    this.array[r][c] = truncHelper(a.getValue(), b.getValue());
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
                    this.array[r][c] = truncHelper(a.getValue(), b.getValue());
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
                        this.array[r][c] = truncHelper(a.getValue(), b.getValue());
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg1;
            }
        }
    }
    return this.value = truncHelper(arg0.getValue(), arg1.getValue());
};
cTRUNC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x [ , number-digits ] )"
    };
};