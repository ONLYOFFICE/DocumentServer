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
cFormulaFunction.Statistical = {
    "groupName": "Statistical",
    "AVEDEV": cAVEDEV,
    "AVERAGE": cAVERAGE,
    "AVERAGEA": cAVERAGEA,
    "AVERAGEIF": cAVERAGEIF,
    "AVERAGEIFS": cAVERAGEIFS,
    "BETADIST": cBETADIST,
    "BETAINV": cBETAINV,
    "BINOMDIST": cBINOMDIST,
    "CHIDIST": cCHIDIST,
    "CHIINV": cCHIINV,
    "CHITEST": cCHITEST,
    "CONFIDENCE": cCONFIDENCE,
    "CORREL": cCORREL,
    "COUNT": cCOUNT,
    "COUNTA": cCOUNTA,
    "COUNTBLANK": cCOUNTBLANK,
    "COUNTIF": cCOUNTIF,
    "COUNTIFS": cCOUNTIFS,
    "COVAR": cCOVAR,
    "CRITBINOM": cCRITBINOM,
    "DEVSQ": cDEVSQ,
    "EXPONDIST": cEXPONDIST,
    "FDIST": cFDIST,
    "FINV": cFINV,
    "FISHER": cFISHER,
    "FISHERINV": cFISHERINV,
    "FORECAST": cFORECAST,
    "FREQUENCY": cFREQUENCY,
    "FTEST": cFTEST,
    "GAMMADIST": cGAMMADIST,
    "GAMMAINV": cGAMMAINV,
    "GAMMALN": cGAMMALN,
    "GEOMEAN": cGEOMEAN,
    "GROWTH": cGROWTH,
    "HARMEAN": cHARMEAN,
    "HYPGEOMDIST": cHYPGEOMDIST,
    "INTERCEPT": cINTERCEPT,
    "KURT": cKURT,
    "LARGE": cLARGE,
    "LINEST": cLINEST,
    "LOGEST": cLOGEST,
    "LOGINV": cLOGINV,
    "LOGNORMDIST": cLOGNORMDIST,
    "MAX": cMAX,
    "MAXA": cMAXA,
    "MEDIAN": cMEDIAN,
    "MIN": cMIN,
    "MINA": cMINA,
    "MODE": cMODE,
    "NEGBINOMDIST": cNEGBINOMDIST,
    "NORMDIST": cNORMDIST,
    "NORMINV": cNORMINV,
    "NORMSDIST": cNORMSDIST,
    "NORMSINV": cNORMSINV,
    "PEARSON": cPEARSON,
    "PERCENTILE": cPERCENTILE,
    "PERCENTRANK": cPERCENTRANK,
    "PERMUT": cPERMUT,
    "POISSON": cPOISSON,
    "PROB": cPROB,
    "QUARTILE": cQUARTILE,
    "RANK": cRANK,
    "RSQ": cRSQ,
    "SKEW": cSKEW,
    "SLOPE": cSLOPE,
    "SMALL": cSMALL,
    "STANDARDIZE": cSTANDARDIZE,
    "STDEV": cSTDEV,
    "STDEVA": cSTDEVA,
    "STDEVP": cSTDEVP,
    "STDEVPA": cSTDEVPA,
    "STEYX": cSTEYX,
    "TDIST": cTDIST,
    "TINV": cTINV,
    "TREND": cTREND,
    "TRIMMEAN": cTRIMMEAN,
    "TTEST": cTTEST,
    "VAR": cVAR,
    "VARA": cVARA,
    "VARP": cVARP,
    "VARPA": cVARPA,
    "WEIBULL": cWEIBULL,
    "ZTEST": cZTEST
};
function cAVEDEV() {
    this.name = "AVEDEV";
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
cAVEDEV.prototype = Object.create(cBaseFunction.prototype);
cAVEDEV.prototype.Calculate = function (arg) {
    var count = 0,
    sum = new cNumber(0),
    arrX = [];
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue();
            if (_argV instanceof cNumber) {
                arrX.push(_argV);
                count++;
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    var __arg = _argAreaValue[j];
                    if (__arg instanceof cNumber) {
                        arrX.push(__arg);
                        count++;
                    }
                }
            } else {
                if (_arg instanceof cArray) {
                    _arg.foreach(function (elem) {
                        var e = elem.tocNumber();
                        if (e instanceof cNumber) {
                            arrX.push(e);
                            count++;
                        }
                    });
                } else {
                    if (_arg instanceof cError) {
                        continue;
                    }
                    arrX.push(_arg);
                    count++;
                }
            }
        }
    }
    for (var i = 0; i < arrX.length; i++) {
        sum = _func[sum.type][arrX[i].type](sum, arrX[i], "+");
    }
    sum = new cNumber(sum.getValue() / count);
    var a = 0;
    for (var i = 0; i < arrX.length; i++) {
        a += Math.abs(_func[sum.type][arrX[i].type](sum, arrX[i], "-").getValue());
    }
    return this.value = new cNumber(a / count);
};
cAVEDEV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cAVERAGE() {
    this.name = "AVERAGE";
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
cAVERAGE.prototype = Object.create(cBaseFunction.prototype);
cAVERAGE.prototype.Calculate = function (arg) {
    var count = 0,
    sum = new cNumber(0);
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue();
            if (_argV instanceof cString || _argV instanceof cEmpty || _argV instanceof cBool) {
                continue;
            } else {
                if (_argV instanceof cNumber) {
                    sum = _func[sum.type][_argV.type](sum, _argV, "+");
                    count++;
                } else {
                    if (_argV instanceof cError) {
                        return this.value = _argV;
                    }
                }
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    var __arg = _argAreaValue[j];
                    if (__arg instanceof cString || __arg instanceof cEmpty || __arg instanceof cBool) {
                        continue;
                    } else {
                        if (__arg instanceof cNumber) {
                            sum = _func[sum.type][__arg.type](sum, __arg, "+");
                            count++;
                        } else {
                            if (__arg instanceof cError) {
                                return this.value = __arg;
                            }
                        }
                    }
                }
            } else {
                if (_arg instanceof cArray) {
                    _arg.foreach(function (elem) {
                        if (elem instanceof cString || elem instanceof cEmpty || elem instanceof cBool) {
                            return false;
                        }
                        var e = elem.tocNumber();
                        if (e instanceof cNumber) {
                            sum = _func[sum.type][e.type](sum, e, "+");
                            count++;
                        }
                    });
                } else {
                    _arg = _arg.tocNumber();
                    if (_arg instanceof cError) {
                        return this.value = _arg;
                    }
                    sum = _func[sum.type][_arg.type](sum, _arg, "+");
                    count++;
                }
            }
        }
    }
    return this.value = new cNumber(sum.getValue() / count);
};
cAVERAGE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cAVERAGEA() {
    this.name = "AVERAGEA";
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
cAVERAGEA.prototype = Object.create(cBaseFunction.prototype);
cAVERAGEA.prototype.Calculate = function (arg) {
    var count = 0,
    sum = new cNumber(0);
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue();
            if (_argV instanceof cNumber || _argV instanceof cBool) {
                sum = _func[sum.type][_argV.type](sum, _argV, "+");
                count++;
            } else {
                if (_argV instanceof cString) {
                    if (parseNum(_argV.getValue())) {
                        sum = _func[sum.type][_argV.type](sum, _argV.tocNumber(), "+");
                    }
                    count++;
                }
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    var __arg = _argAreaValue[j];
                    if (__arg instanceof cNumber || __arg instanceof cBool) {
                        sum = _func[sum.type][__arg.type](sum, __arg, "+");
                        count++;
                    } else {
                        if (__arg instanceof cString) {
                            if (parseNum(__arg.getValue())) {
                                sum = _func[sum.type][__arg.type](sum, __arg.tocNumber(), "+");
                            }
                            count++;
                        }
                    }
                }
            } else {
                if (_arg instanceof cArray) {
                    _arg.foreach(function (elem) {
                        if (elem instanceof cString || elem instanceof cEmpty) {
                            return false;
                        }
                        var e = elem.tocNumber();
                        if (e instanceof cNumber) {
                            sum = _func[sum.type][e.type](sum, e, "+");
                            count++;
                        }
                    });
                } else {
                    _arg = _arg.tocNumber();
                    if (_arg instanceof cError) {
                        return this.value = _arg;
                    }
                    sum = _func[sum.type][_arg.type](sum, _arg, "+");
                    count++;
                }
            }
        }
    }
    return this.value = new cNumber(sum.getValue() / count);
};
cAVERAGEA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cAVERAGEIF() {
    this.name = "AVERAGEIF";
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
cAVERAGEIF.prototype = Object.create(cBaseFunction.prototype);
cAVERAGEIF.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2] ? arg[2] : arg[0],
    _sum = 0,
    _count = 0,
    valueForSearching;
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
        var r = arg0.getRange().first.getRow0(),
        ws = arg0.getWS(),
        c1 = arg2.getRange().first.getCol0(),
        i = 0;
        arg0.foreach2(function (c) {
            if (matching(c, valueForSearching, oper)) {
                var r1 = r + i,
                r2 = new cRef(ws.getRange3(r1, c1, r1, c1).getName(), ws);
                if (r2.getValue() instanceof cNumber) {
                    _sum += r2.getValue().getValue();
                    _count++;
                }
            }
            i++;
        });
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
                _count++;
            }
        }
    }
    if (_count == 0) {
        return new cError(cErrorType.division_by_zero);
    } else {
        return this.value = new cNumber(_sum / _count);
    }
};
cAVERAGEIF.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cell-range, selection-criteria [ , average-range ] )"
    };
};
function cAVERAGEIFS() {
    cBaseFunction.call(this, "AVERAGEIFS");
}
cAVERAGEIFS.prototype = Object.create(cBaseFunction.prototype);
function cBETADIST() {
    cBaseFunction.call(this, "BETADIST");
}
cBETADIST.prototype = Object.create(cBaseFunction.prototype);
function cBETAINV() {
    cBaseFunction.call(this, "BETAINV");
}
cBETAINV.prototype = Object.create(cBaseFunction.prototype);
function cBINOMDIST() {
    this.name = "BINOMDIST";
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
cBINOMDIST.prototype = Object.create(cBaseFunction.prototype);
cBINOMDIST.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    function binomdist(x, n, p) {
        x = parseInt(x);
        n = parseInt(n);
        return Math.binomCoeff(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
        arg3 = arg3.cross(arguments[1].first);
    } else {
        if (arg3 instanceof cArray) {
            arg3 = arg3.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocBool();
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
    if (arg0.getValue() < 0 || arg0.getValue() > arg1.getValue() || arg2.getValue() < 0 || arg2.getValue() > 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    if (arg3.toBool()) {
        var x = parseInt(arg0.getValue()),
        n = parseInt(arg1.getValue()),
        p = arg2.getValue(),
        bm = 0;
        for (var y = 0; y <= x; y++) {
            bm += binomdist(y, n, p);
        }
        return this.value = new cNumber(bm);
    } else {
        return this.value = new cNumber(binomdist(arg0.getValue(), arg1.getValue(), arg2.getValue()));
    }
};
cBINOMDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number-successes , number-trials , success-probability , cumulative-flag )"
    };
};
function cCHIDIST() {
    cBaseFunction.call(this, "CHIDIST");
}
cCHIDIST.prototype = Object.create(cBaseFunction.prototype);
function cCHIINV() {
    cBaseFunction.call(this, "CHIINV");
}
cCHIINV.prototype = Object.create(cBaseFunction.prototype);
function cCHITEST() {
    cBaseFunction.call(this, "CHITEST");
}
cCHITEST.prototype = Object.create(cBaseFunction.prototype);
function cCONFIDENCE() {
    this.name = "CONFIDENCE";
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
cCONFIDENCE.prototype = Object.create(cBaseFunction.prototype);
cCONFIDENCE.prototype.Calculate = function (arg) {
    var alpha = arg[0],
    stdev_sigma = arg[1],
    size = arg[2];
    if (alpha instanceof cArea || alpha instanceof cArea3D) {
        alpha = alpha.cross(arguments[1].first);
    } else {
        if (alpha instanceof cArray) {
            alpha = alpha.getElement(0);
        }
    }
    if (stdev_sigma instanceof cArea || stdev_sigma instanceof cArea3D) {
        stdev_sigma = stdev_sigma.cross(arguments[1].first);
    } else {
        if (stdev_sigma instanceof cArray) {
            stdev_sigma = stdev_sigma.getElement(0);
        }
    }
    if (size instanceof cArea || size instanceof cArea3D) {
        size = size.cross(arguments[1].first);
    } else {
        if (size instanceof cArray) {
            size = size.getElement(0);
        }
    }
    alpha = alpha.tocNumber();
    stdev_sigma = stdev_sigma.tocNumber();
    size = size.tocNumber();
    if (alpha instanceof cError) {
        return this.value = alpha;
    }
    if (stdev_sigma instanceof cError) {
        return this.value = stdev_sigma;
    }
    if (size instanceof cError) {
        return this.value = size;
    }
    if (alpha.getValue() <= 0 || alpha.getValue() >= 1 || stdev_sigma.getValue <= 0 || size.getValue() < 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    return this.value = new cNumber(gaussinv(1 - alpha.getValue() / 2) * stdev_sigma.getValue() / Math.sqrt(size.getValue()));
};
cCONFIDENCE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( alpha , standard-dev , size )"
    };
};
function cCORREL() {
    this.name = "CORREL";
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
cCORREL.prototype = Object.create(cBaseFunction.prototype);
cCORREL.prototype.Calculate = function (arg) {
    function correl(x, y) {
        var s1 = 0,
        s2 = 0,
        s3 = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        if (x.length != y.length) {
            return new cError(cErrorType.not_available);
        }
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            s2 += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            s3 += (y[i].getValue() - _y) * (y[i].getValue() - _y);
        }
        if (s2 == 0 || s3 == 0) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(s1 / Math.sqrt(s2 * s3));
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = correl(arr0, arr1);
};
cCORREL.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cCOUNT() {
    this.name = "COUNT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cCOUNT.prototype = Object.create(cBaseFunction.prototype);
cCOUNT.prototype.Calculate = function (arg) {
    var count = 0;
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue();
            if (_argV instanceof cNumber) {
                count++;
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    if (_argAreaValue[j] instanceof cNumber) {
                        count++;
                    }
                }
            } else {
                if (_arg instanceof cNumber || _arg instanceof cBool || _arg instanceof cEmpty) {
                    count++;
                } else {
                    if (_arg instanceof cString) {
                        if (_arg.tocNumber() instanceof cNumber) {
                            count++;
                        }
                    } else {
                        if (_arg instanceof cArray) {
                            _arg.foreach(function (elem) {
                                var e = elem.tocNumber();
                                if (e instanceof cNumber) {
                                    count++;
                                }
                            });
                        }
                    }
                }
            }
        }
    }
    return this.value = new cNumber(count);
};
cCOUNT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cCOUNTA() {
    this.name = "COUNTA";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cCOUNTA.prototype = Object.create(cBaseFunction.prototype);
cCOUNTA.prototype.Calculate = function (arg) {
    var count = 0;
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue();
            if (! (_argV instanceof cEmpty)) {
                count++;
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    if (! (_argAreaValue[j] instanceof cEmpty)) {
                        count++;
                    }
                }
            } else {
                if (_arg instanceof cArray) {
                    _arg.foreach(function (elem) {
                        if (! (elem instanceof cEmpty)) {
                            count++;
                        }
                    });
                } else {
                    if (! (_arg instanceof cEmpty)) {
                        count++;
                    }
                }
            }
        }
    }
    return this.value = new cNumber(count);
};
cCOUNTA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cCOUNTBLANK() {
    this.name = "COUNTBLANK";
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
cCOUNTBLANK.prototype = Object.create(cBaseFunction.prototype);
cCOUNTBLANK.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        return this.value = arg0.countCells();
    } else {
        if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
            return this.value = new cNumber(1);
        } else {
            return this.value = new cError(cErrorType.bad_reference);
        }
    }
};
cCOUNTBLANK.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cCOUNTIF() {
    this.name = "COUNTIF";
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
cCOUNTIF.prototype = Object.create(cBaseFunction.prototype);
cCOUNTIF.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    _count = 0,
    valueForSearching;
    if (! (arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea || arg0 instanceof cArea3D)) {
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
    search,
    oper,
    val,
    match = arg1.match(operators);
    if (match) {
        search = arg1.substr(match[0].length);
        oper = match[0].replace(/\s/g, "");
    } else {
        search = arg1;
    }
    valueForSearching = parseNum(search) ? new cNumber(search) : new cString(search);
    if (arg0 instanceof cArea) {
        arg0.foreach2(function (_val) {
            _count += matching(_val, valueForSearching, oper);
        });
    } else {
        if (arg0 instanceof cArea3D) {
            val = arg0.getValue();
            for (var i = 0; i < val.length; i++) {
                _count += matching(val[i], valueForSearching, oper);
            }
        } else {
            val = arg0.getValue();
            _count += matching(val, valueForSearching, oper);
        }
    }
    return this.value = new cNumber(_count);
};
cCOUNTIF.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cell-range, selection-criteria )"
    };
};
function cCOUNTIFS() {
    cBaseFunction.call(this, "COUNTIFS");
}
cCOUNTIFS.prototype = Object.create(cBaseFunction.prototype);
function cCOVAR() {
    this.name = "COVAR";
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
cCOVAR.prototype = Object.create(cBaseFunction.prototype);
cCOVAR.prototype.Calculate = function (arg) {
    function covar(x, y) {
        var s1 = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        if (xLength == 0) {
            return new cError(cErrorType.division_by_zero);
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);
        }
        return new cNumber(s1 / xLength);
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = covar(arr0, arr1);
};
cCOVAR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cCRITBINOM() {
    this.name = "CRITBINOM";
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
cCRITBINOM.prototype = Object.create(cBaseFunction.prototype);
cCRITBINOM.prototype.Calculate = function (arg) {
    var n = arg[0],
    p = arg[1],
    alpha = arg[2];
    function critbinom(n, p, alpha) {
        if (n < 0 || alpha <= 0 || alpha >= 1 || p < 0 || p > 1) {
            return new cError(cErrorType.not_numeric);
        } else {
            var q = 1 - p,
            factor = Math.pow(q, n);
            if (factor == 0) {
                factor = Math.pow(p, n);
                if (factor == 0) {
                    return new cError(cErrorType.wrong_value_type);
                } else {
                    var sum = 1 - factor,
                    max = n,
                    i = 0;
                    for (i = 0; i < max && sum >= alpha; i++) {
                        factor *= (n - i) / (i + 1) * q / p;
                        sum -= factor;
                    }
                    return new cNumber(n - i);
                }
            } else {
                var sum = factor,
                max = n,
                i = 0;
                for (i = 0; i < max && sum < alpha; i++) {
                    factor *= (n - i) / (i + 1) * p / q;
                    sum += factor;
                }
                return new cNumber(i);
            }
        }
    }
    if (alpha instanceof cArea || alpha instanceof cArea3D) {
        alpha = alpha.cross(arguments[1].first);
    } else {
        if (alpha instanceof cArray) {
            alpha = alpha.getElement(0);
        }
    }
    if (n instanceof cArea || n instanceof cArea3D) {
        n = n.cross(arguments[1].first);
    } else {
        if (n instanceof cArray) {
            n = n.getElement(0);
        }
    }
    if (p instanceof cArea || p instanceof cArea3D) {
        p = p.cross(arguments[1].first);
    } else {
        if (p instanceof cArray) {
            p = p.getElement(0);
        }
    }
    alpha = alpha.tocNumber();
    n = n.tocNumber();
    p = p.tocNumber();
    if (alpha instanceof cError) {
        return this.value = alpha;
    }
    if (n instanceof cError) {
        return this.value = n;
    }
    if (p instanceof cError) {
        return this.value = p;
    }
    return this.value = critbinom(n, p, alpha);
};
cCRITBINOM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number-trials , success-probability , alpha )"
    };
};
function cDEVSQ() {
    this.name = "DEVSQ";
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
cDEVSQ.prototype = Object.create(cBaseFunction.prototype);
cDEVSQ.prototype.Calculate = function (arg) {
    function devsq(x) {
        var s1 = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                xLength++;
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                s1 += Math.pow(x[i].getValue() - _x, 2);
            }
        }
        return new cNumber(s1);
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            continue;
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = devsq(arr0);
};
cDEVSQ.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cEXPONDIST() {
    this.name = "EXPONDIST";
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
cEXPONDIST.prototype = Object.create(cBaseFunction.prototype);
cEXPONDIST.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    if (arg0.getValue() < 0 || arg2.getValue() <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    if (arg2.toBool()) {
        return this.value = new cNumber(1 - Math.exp(-arg1.getValue() * arg0.getValue()));
    } else {
        return this.value = new cNumber(arg1.getValue() * Math.exp(-arg1.getValue() * arg0.getValue()));
    }
};
cEXPONDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , lambda , cumulative-flag )"
    };
};
function cFDIST() {
    cBaseFunction.call(this, "FDIST");
}
cFDIST.prototype = Object.create(cBaseFunction.prototype);
function cFINV() {
    cBaseFunction.call(this, "FINV");
}
cFINV.prototype = Object.create(cBaseFunction.prototype);
function cFISHER() {
    this.name = "FISHER";
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
cFISHER.prototype = Object.create(cBaseFunction.prototype);
cFISHER.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    function fisher(x) {
        return 0.5 * Math.ln((1 + x) / (1 - x));
    }
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
                    var a = fisher(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = fisher(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cFISHER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number )"
    };
};
function cFISHERINV() {
    this.name = "FISHERINV";
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
cFISHERINV.prototype = Object.create(cBaseFunction.prototype);
cFISHERINV.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    function fisherInv(x) {
        return (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
    }
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
                    var a = fisherInv(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = fisherInv(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cFISHERINV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number )"
    };
};
function cFORECAST() {
    this.name = "FORECAST";
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
cFORECAST.prototype = Object.create(cBaseFunction.prototype);
cFORECAST.prototype.Calculate = function (arg) {
    function forecast(fx, y, x) {
        var fSumDeltaXDeltaY = 0,
        fSumSqrDeltaX = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            var fValX = x[i].getValue();
            var fValY = y[i].getValue();
            fSumDeltaXDeltaY += (fValX - _x) * (fValY - _y);
            fSumSqrDeltaX += (fValX - _x) * (fValX - _x);
        }
        if (fSumDeltaXDeltaY == 0) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(_y + fSumDeltaXDeltaY / fSumSqrDeltaX * (fx.getValue() - _x));
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    if (arg1 instanceof cArea) {
        arr0 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg2 instanceof cArea) {
        arr1 = arg2.getValue();
    } else {
        if (arg2 instanceof cArray) {
            arg2.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = forecast(arg0, arr0, arr1);
};
cFORECAST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , array-1 , array-2 )"
    };
};
function cFREQUENCY() {
    this.name = "FREQUENCY";
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
cFREQUENCY.prototype = Object.create(cBaseFunction.prototype);
cFREQUENCY.prototype.Calculate = function (arg) {
    function frequency(A, B) {
        var tA = [],
        tB = [Number.NEGATIVE_INFINITY];
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cError) {
                    return A[i][j];
                } else {
                    if (A[i][j] instanceof cNumber) {
                        tA.push(A[i][j].getValue());
                    } else {
                        if (A[i][j] instanceof cBool) {
                            tA.push(A[i][j].tocNumber().getValue());
                        }
                    }
                }
            }
        }
        for (var i = 0; i < B.length; i++) {
            for (var j = 0; j < B[i].length; j++) {
                if (B[i][j] instanceof cError) {
                    return B[i][j];
                } else {
                    if (B[i][j] instanceof cNumber) {
                        tB.push(B[i][j].getValue());
                    } else {
                        if (B[i][j] instanceof cBool) {
                            tB.push(B[i][j].tocNumber().getValue());
                        }
                    }
                }
            }
        }
        tA.sort(fSortAscending);
        tB.push(Number.POSITIVE_INFINITY);
        tB.sort(fSortAscending);
        var C = [[]],
        k = 0;
        for (var i = 1; i < tB.length; i++, k++) {
            C[0][k] = new cNumber(0);
            for (var j = 0; j < tA.length; j++) {
                if (tA[j] > tB[i - 1] && tA[j] <= tB[i]) {
                    var a = C[0][k].getValue();
                    C[0][k] = new cNumber(++a);
                }
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
        if (arg0 instanceof cArea3D) {
            arg0 = arg0.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArray) {
        arg1 = arg1.getMatrix();
    } else {
        if (arg1 instanceof cArea3D) {
            arg1 = arg1.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    return this.value = frequency(arg0, arg1);
};
cFREQUENCY.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  data-array , bins-array )"
    };
};
function cFTEST() {
    cBaseFunction.call(this, "FTEST");
}
cFTEST.prototype = Object.create(cBaseFunction.prototype);
function cGAMMADIST() {
    cBaseFunction.call(this, "GAMMADIST");
}
cGAMMADIST.prototype = Object.create(cBaseFunction.prototype);
function cGAMMAINV() {
    cBaseFunction.call(this, "GAMMAINV");
}
cGAMMAINV.prototype = Object.create(cBaseFunction.prototype);
function cGAMMALN() {
    this.name = "GAMMALN";
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
cGAMMALN.prototype = Object.create(cBaseFunction.prototype);
cGAMMALN.prototype.Calculate = function (arg) {
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
                    var a = getLogGamma(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = getLogGamma(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cGAMMALN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number)"
    };
};
function cGEOMEAN() {
    this.name = "GEOMEAN";
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
cGEOMEAN.prototype = Object.create(cBaseFunction.prototype);
cGEOMEAN.prototype.Calculate = function (arg) {
    function geommean(x) {
        var _x = 1,
        xLength = 0,
        _tx;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x *= x[i].getValue();
                xLength++;
            } else {
                if ((x[i] instanceof cString || x[i] instanceof cBool) && (_tx = x[i].tocNumber()) instanceof cNumber) {
                    _x *= _tx.getValue();
                    xLength++;
                }
            }
        }
        if (_x <= 0) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(Math.pow(_x, 1 / xLength));
        }
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString && arg[j].tocNumber() instanceof cNumber) {
                            arr0.push(arg[j].tocNumber());
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = geommean(arr0);
};
cGEOMEAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cGROWTH() {
    cBaseFunction.call(this, "GROWTH");
}
cGROWTH.prototype = Object.create(cBaseFunction.prototype);
function cHARMEAN() {
    this.name = "HARMEAN";
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
cHARMEAN.prototype = Object.create(cBaseFunction.prototype);
cHARMEAN.prototype.Calculate = function (arg) {
    function harmmean(x) {
        var _x = 0,
        xLength = 0,
        _tx;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                if (x[i].getValue() == 0) {
                    return new cError(cErrorType.not_numeric);
                }
                _x += 1 / x[i].getValue();
                xLength++;
            } else {
                if ((x[i] instanceof cString || x[i] instanceof cBool) && (_tx = x[i].tocNumber()) instanceof cNumber) {
                    if (_tx.getValue() == 0) {
                        return new cError(cErrorType.not_numeric);
                    }
                    _x += 1 / _tx.getValue();
                    xLength++;
                }
            }
        }
        if (_x <= 0) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(xLength / _x);
        }
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString && arg[j].tocNumber() instanceof cNumber) {
                            arr0.push(arg[j].tocNumber());
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = harmmean(arr0);
};
cHARMEAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cHYPGEOMDIST() {
    this.name = "HYPGEOMDIST";
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
cHYPGEOMDIST.prototype = Object.create(cBaseFunction.prototype);
cHYPGEOMDIST.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
        arg3 = arg3.cross(arguments[1].first);
    } else {
        if (arg3 instanceof cArray) {
            arg3 = arg3.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
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
    if (arg0.getValue() < 0 || arg0.getValue() > Math.min(arg1.getValue(), arg2.getValue()) || arg0.getValue() < Math.max(0, arg1.getValue() - arg3.getValue() + arg2.getValue()) || arg1.getValue() <= 0 || arg1.getValue() > arg3.getValue() || arg2.getValue() <= 0 || arg2.getValue() > arg3.getValue() || arg3.getValue() <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    return this.value = new cNumber(Math.binomCoeff(arg2.getValue(), arg0.getValue()) * Math.binomCoeff(arg3.getValue() - arg2.getValue(), arg1.getValue() - arg0.getValue()) / Math.binomCoeff(arg3.getValue(), arg1.getValue()));
};
cHYPGEOMDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( sample-successes , number-sample , population-successes , number-population )"
    };
};
function cINTERCEPT() {
    this.name = "INTERCEPT";
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
cINTERCEPT.prototype = Object.create(cBaseFunction.prototype);
cINTERCEPT.prototype.Calculate = function (arg) {
    function intercept(y, x) {
        var fSumDeltaXDeltaY = 0,
        fSumSqrDeltaX = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            var fValX = x[i].getValue();
            var fValY = y[i].getValue();
            fSumDeltaXDeltaY += (fValX - _x) * (fValY - _y);
            fSumSqrDeltaX += (fValX - _x) * (fValX - _x);
        }
        if (fSumDeltaXDeltaY == 0) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(_y - fSumDeltaXDeltaY / fSumSqrDeltaX * _x);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = intercept(arr0, arr1);
};
cINTERCEPT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cKURT() {
    this.name = "KURT";
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
cKURT.prototype = Object.create(cBaseFunction.prototype);
cKURT.prototype.Calculate = function (arg) {
    function kurt(x) {
        var sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0,
        standDev = 0,
        sumSQRDeltaXDivstandDev = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                xLength++;
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                sumSQRDeltaX += Math.pow(x[i].getValue() - _x, 2);
            }
        }
        standDev = Math.sqrt(sumSQRDeltaX / (xLength - 1));
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                sumSQRDeltaXDivstandDev += Math.pow((x[i].getValue() - _x) / standDev, 4);
            }
        }
        return new cNumber(xLength * (xLength + 1) / (xLength - 1) / (xLength - 2) / (xLength - 3) * sumSQRDeltaXDivstandDev - 3 * (xLength - 1) * (xLength - 1) / (xLength - 2) / (xLength - 3));
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            continue;
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = kurt(arr0);
};
cKURT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cLARGE() {
    this.name = "LARGE";
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
cLARGE.prototype = Object.create(cBaseFunction.prototype);
cLARGE.prototype.Calculate = function (arg) {
    function frequency(A, k) {
        var tA = [];
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cError) {
                    return A[i][j];
                } else {
                    if (A[i][j] instanceof cNumber) {
                        tA.push(A[i][j].getValue());
                    } else {
                        if (A[i][j] instanceof cBool) {
                            tA.push(A[i][j].tocNumber().getValue());
                        }
                    }
                }
            }
        }
        tA.sort(fSortDescending);
        if (k.getValue() > tA.length || k.getValue() <= 0) {
            return new cError(cErrorType.not_available);
        } else {
            return new cNumber(tA[k.getValue() - 1]);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cArea3D) {
            arg0 = arg0.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    arg1 = arg1.tocNumber();
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    return this.value = frequency(arg0, arg1);
};
cLARGE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  array , k )"
    };
};
function cLINEST() {
    cBaseFunction.call(this, "LINEST");
}
cLINEST.prototype = Object.create(cBaseFunction.prototype);
function cLOGEST() {
    cBaseFunction.call(this, "LOGEST");
}
cLOGEST.prototype = Object.create(cBaseFunction.prototype);
function cLOGINV() {
    this.name = "LOGINV";
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
cLOGINV.prototype = Object.create(cBaseFunction.prototype);
cLOGINV.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    function loginv(x, mue, sigma) {
        if (sigma <= 0 || x <= 0 || x >= 1) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(Math.exp(mue + sigma * (gaussinv(x))));
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    return this.value = loginv(arg0.getValue(), arg1.getValue(), arg2.getValue());
};
cLOGINV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , mean , standard-deviation )"
    };
};
function cLOGNORMDIST() {
    this.name = "LOGNORMDIST";
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
cLOGNORMDIST.prototype = Object.create(cBaseFunction.prototype);
cLOGNORMDIST.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    function normdist(x, mue, sigma) {
        if (sigma <= 0 || x <= 0) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(0.5 + gauss((Math.ln(x) - mue) / sigma));
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    return this.value = normdist(arg0.getValue(), arg1.getValue(), arg2.getValue());
};
cLOGNORMDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , mean , standard-deviation )"
    };
};
function cMAX() {
    this.name = "MAX";
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
cMAX.prototype = Object.create(cBaseFunction.prototype);
cMAX.prototype.Calculate = function (arg) {
    var argI, argIVal, max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < this.argumentsCurrent; i++) {
        argI = arg[i],
        argIVal = argI.getValue();
        if (argI instanceof cRef || argI instanceof cRef3D) {
            if (argIVal instanceof cError) {
                return this.value = argIVal;
            }
            if (argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty) {
                var v = argIVal.tocNumber();
                if (v.getValue() > max) {
                    max = v.getValue();
                }
            }
        } else {
            if (argI instanceof cArea || argI instanceof cArea3D) {
                var argArr = argI.getValue();
                for (var j = 0; j < argArr.length; j++) {
                    if (argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty) {
                        var v = argArr[j].tocNumber();
                        if (v.getValue() > max) {
                            max = v.getValue();
                        }
                    } else {
                        if (argArr[j] instanceof cError) {
                            return this.value = argArr[j];
                        }
                    }
                }
            } else {
                if (argI instanceof cError) {
                    return this.value = argI;
                } else {
                    if (argI instanceof cString) {
                        var v = argI.tocNumber();
                        if (v instanceof cNumber) {
                            if (v.getValue() > max) {
                                max = v.getValue();
                            }
                        }
                    } else {
                        if (argI instanceof cBool || argI instanceof cEmpty) {
                            var v = argI.tocNumber();
                            if (v.getValue() > max) {
                                max = v.getValue();
                            }
                        } else {
                            if (argI instanceof cArray) {
                                argI.foreach(function (elem) {
                                    if (elem instanceof cNumber) {
                                        if (elem.getValue() > max) {
                                            max = elem.getValue();
                                        }
                                    } else {
                                        if (elem instanceof cError) {
                                            max = elem;
                                            return true;
                                        }
                                    }
                                });
                                if (max instanceof cError) {
                                    return this.value = max;
                                }
                            } else {
                                if (argI.getValue() > max) {
                                    max = argI.getValue();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return this.value = (max.value === Number.NEGATIVE_INFINITY ? new cNumber(0) : new cNumber(max));
};
cMAX.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number1, number2, ...)"
    };
};
function cMAXA() {
    this.name = "MAXA";
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
cMAXA.prototype = Object.create(cBaseFunction.prototype);
cMAXA.prototype.Calculate = function (arg) {
    var argI, argIVal, max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < this.argumentsCurrent; i++) {
        argI = arg[i],
        argIVal = argI.getValue();
        if (argI instanceof cRef || argI instanceof cRef3D) {
            if (argIVal instanceof cError) {
                return this.value = argIVal;
            }
            var v = argIVal.tocNumber();
            if (v instanceof cNumber && v.getValue() > max) {
                max = v.getValue();
            }
        } else {
            if (argI instanceof cArea || argI instanceof cArea3D) {
                var argArr = argI.getValue();
                for (var j = 0; j < argArr.length; j++) {
                    if (argArr[j] instanceof cError) {
                        return this.value = argArr[j];
                    }
                    var v = argArr[j].tocNumber();
                    if (v instanceof cNumber && v.getValue() > max) {
                        max = v.getValue();
                    }
                }
            } else {
                if (argI instanceof cError) {
                    return this.value = argI;
                } else {
                    if (argI instanceof cString) {
                        var v = argI.tocNumber();
                        if (v instanceof cNumber) {
                            if (v.getValue() > max) {
                                max = v.getValue();
                            }
                        }
                    } else {
                        if (argI instanceof cBool || argI instanceof cEmpty) {
                            var v = argI.tocNumber();
                            if (v.getValue() > max) {
                                max = v.getValue();
                            }
                        } else {
                            if (argI instanceof cArray) {
                                argI.foreach(function (elem) {
                                    if (elem instanceof cError) {
                                        max = elem;
                                        return true;
                                    }
                                    elem = elem.tocNumber();
                                    if (elem instanceof cNumber && elem.getValue() > max) {
                                        max = elem.getValue();
                                    }
                                });
                                if (max instanceof cError) {
                                    return this.value = max;
                                }
                            } else {
                                if (argI.getValue() > max) {
                                    max = argI.getValue();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return this.value = (max.value === Number.NEGATIVE_INFINITY ? new cNumber(0) : new cNumber(max));
};
cMAXA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number1, number2, ...)"
    };
};
function cMEDIAN() {
    this.name = "MEDIAN";
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
cMEDIAN.prototype = Object.create(cBaseFunction.prototype);
cMEDIAN.prototype.Calculate = function (arg) {
    function median(x) {
        var res, medArr = [],
        t;
        for (var i = 0; i < x.length; i++) {
            t = x[i].tocNumber();
            if (t instanceof cNumber) {
                medArr.push(t.getValue());
            }
        }
        medArr.sort(fSortAscending);
        if (medArr.length < 1) {
            return cError(cErrorType.wrong_value_type);
        } else {
            if (medArr.length % 2) {
                return new cNumber(medArr[(medArr.length - 1) / 2]);
            } else {
                return new cNumber((medArr[medArr.length / 2 - 1] + medArr[medArr.length / 2]) / 2);
            }
        }
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            continue;
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = median(arr0);
};
cMEDIAN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cMIN() {
    this.name = "MIN";
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
cMIN.prototype = Object.create(cBaseFunction.prototype);
cMIN.prototype.Calculate = function (arg) {
    var argI, argIVal, min = Number.POSITIVE_INFINITY;
    for (var i = 0; i < this.argumentsCurrent; i++) {
        argI = arg[i],
        argIVal = argI.getValue();
        if (argI instanceof cRef || argI instanceof cRef3D) {
            if (argIVal instanceof cError) {
                return this.value = argIVal;
            }
            if (argIVal instanceof cNumber || argIVal instanceof cBool || argIVal instanceof cEmpty) {
                var v = argIVal.tocNumber();
                if (v.getValue() < min) {
                    min = v.getValue();
                }
            }
        } else {
            if (argI instanceof cArea || argI instanceof cArea3D) {
                var argArr = argI.getValue();
                for (var j = 0; j < argArr.length; j++) {
                    if (argArr[j] instanceof cNumber || argArr[j] instanceof cBool || argArr[j] instanceof cEmpty) {
                        var v = argArr[j].tocNumber();
                        if (v.getValue() < min) {
                            min = v.getValue();
                        }
                        continue;
                    } else {
                        if (argArr[j] instanceof cError) {
                            return this.value = argArr[j];
                        }
                    }
                }
            } else {
                if (argI instanceof cError) {
                    return this.value = argI;
                } else {
                    if (argI instanceof cString) {
                        var v = argI.tocNumber();
                        if (v instanceof cNumber) {
                            if (v.getValue() < min) {
                                min = v.getValue();
                            }
                        }
                    } else {
                        if (argI instanceof cBool || argI instanceof cEmpty) {
                            var v = argI.tocNumber();
                            if (v.getValue() < min) {
                                min = v.getValue();
                            }
                        } else {
                            if (argI instanceof cArray) {
                                argI.foreach(function (elem) {
                                    if (elem instanceof cNumber) {
                                        if (elem.getValue() < min) {
                                            min = elem.getValue();
                                        }
                                    } else {
                                        if (elem instanceof cError) {
                                            min = elem;
                                            return true;
                                        }
                                    }
                                });
                                if (min instanceof cError) {
                                    return this.value = min;
                                }
                            } else {
                                if (argI.getValue() < min) {
                                    min = argI.getValue();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return this.value = (min.value === Number.POSITIVE_INFINITY ? new cNumber(0) : new cNumber(min));
};
cMIN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number1, number2, ...)"
    };
};
function cMINA() {
    this.name = "MINA";
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
cMINA.prototype = Object.create(cBaseFunction.prototype);
cMINA.prototype.Calculate = function (arg) {
    var argI, argIVal, min = Number.POSITIVE_INFINITY;
    for (var i = 0; i < this.argumentsCurrent; i++) {
        argI = arg[i],
        argIVal = argI.getValue();
        if (argI instanceof cRef || argI instanceof cRef3D) {
            if (argIVal instanceof cError) {
                return this.value = argIVal;
            }
            var v = argIVal.tocNumber();
            if (v instanceof cNumber && v.getValue() < min) {
                min = v.getValue();
            }
        } else {
            if (argI instanceof cArea || argI instanceof cArea3D) {
                var argArr = argI.getValue();
                for (var j = 0; j < argArr.length; j++) {
                    if (argArr[j] instanceof cError) {
                        return this.value = argArr[j];
                    }
                    var v = argArr[j].tocNumber();
                    if (v instanceof cNumber && v.getValue() < min) {
                        min = v.getValue();
                    }
                }
            } else {
                if (argI instanceof cError) {
                    return this.value = argI;
                } else {
                    if (argI instanceof cString) {
                        var v = argI.tocNumber();
                        if (v instanceof cNumber) {
                            if (v.getValue() < min) {
                                min = v.getValue();
                            }
                        }
                    } else {
                        if (argI instanceof cBool || argI instanceof cEmpty) {
                            var v = argI.tocNumber();
                            if (v.getValue() < min) {
                                min = v.getValue();
                            }
                        } else {
                            if (argI instanceof cArray) {
                                argI.foreach(function (elem) {
                                    if (elem instanceof cError) {
                                        min = elem;
                                        return true;
                                    }
                                    elem = elem.tocNumber();
                                    if (elem instanceof cNumber && elem.getValue() < min) {
                                        min = elem.getValue();
                                    }
                                });
                                if (min instanceof cError) {
                                    return this.value = min;
                                }
                            } else {
                                if (argI.getValue() < min) {
                                    min = argI.getValue();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return this.value = (min.value === Number.POSITIVE_INFINITY ? new cNumber(0) : new cNumber(min));
};
cMINA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number1, number2, ...)"
    };
};
function cMODE() {
    this.name = "MODE";
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
cMODE.prototype = Object.create(cBaseFunction.prototype);
cMODE.prototype.Calculate = function (arg) {
    function mode(x) {
        var medArr = [],
        t;
        for (var i = 0; i < x.length; i++) {
            t = x[i].tocNumber();
            if (t instanceof cNumber) {
                medArr.push(t.getValue());
            }
        }
        medArr.sort(fSortDescending);
        if (medArr.length < 1) {
            return cError(cErrorType.wrong_value_type);
        } else {
            var nMaxIndex = 0,
            nMax = 1,
            nCount = 1,
            nOldVal = medArr[0],
            i;
            for (i = 1; i < medArr.length; i++) {
                if (medArr[i] == nOldVal) {
                    nCount++;
                } else {
                    nOldVal = medArr[i];
                    if (nCount > nMax) {
                        nMax = nCount;
                        nMaxIndex = i - 1;
                    }
                    nCount = 1;
                }
            }
            if (nCount > nMax) {
                nMax = nCount;
                nMaxIndex = i - 1;
            }
            if (nMax == 1 && nCount == 1) {
                return new cError(cErrorType.wrong_value_type);
            } else {
                if (nMax == 1) {
                    return new cNumber(nOldVal);
                } else {
                    return new cNumber(medArr[nMaxIndex]);
                }
            }
        }
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            continue;
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = mode(arr0);
};
cMODE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cNEGBINOMDIST() {
    this.name = "NEGBINOMDIST";
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
cNEGBINOMDIST.prototype = Object.create(cBaseFunction.prototype);
cNEGBINOMDIST.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    function negbinomdist(x, r, p) {
        x = parseInt(x.getValue());
        r = parseInt(r.getValue());
        p = p.getValue();
        if (x < 0 || r < 1 || p < 0 || p > 1) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(Math.binomCoeff(x + r - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, x));
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    return this.value = negbinomdist(arg0, arg1, arg2);
};
cNEGBINOMDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number-failures , number-successes , success-probability )"
    };
};
function cNORMDIST() {
    this.name = "NORMDIST";
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
cNORMDIST.prototype = Object.create(cBaseFunction.prototype);
cNORMDIST.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    function normdist(x, mue, sigma, kum) {
        if (sigma <= 0) {
            return new cError(cErrorType.not_numeric);
        }
        if (kum) {
            return new cNumber(integralPhi((x - mue) / sigma));
        } else {
            return new cNumber(phi((x - mue) / sigma) / sigma);
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
        arg3 = arg3.cross(arguments[1].first);
    } else {
        if (arg3 instanceof cArray) {
            arg3 = arg3.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    arg3 = arg3.tocBool();
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
    return this.value = normdist(arg0.getValue(), arg1.getValue(), arg2.getValue(), arg3.toBool());
};
cNORMDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , mean , standard-deviation , cumulative-flag )"
    };
};
function cNORMINV() {
    this.name = "NORMINV";
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
cNORMINV.prototype = Object.create(cBaseFunction.prototype);
cNORMINV.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    function norminv(x, mue, sigma) {
        if (sigma <= 0 || x <= 0 || x >= 1) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(gaussinv(x) * sigma + mue);
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    return this.value = norminv(arg0.getValue(), arg1.getValue(), arg2.getValue());
};
cNORMINV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , mean , standard-deviation )"
    };
};
function cNORMSDIST() {
    this.name = "NORMSDIST";
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
cNORMSDIST.prototype = Object.create(cBaseFunction.prototype);
cNORMSDIST.prototype.Calculate = function (arg) {
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
                    var a = 0.5 + gauss(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = 0.5 + gauss(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cNORMSDIST.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number)"
    };
};
function cNORMSINV() {
    this.name = "NORMSINV";
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
cNORMSINV.prototype = Object.create(cBaseFunction.prototype);
cNORMSINV.prototype.Calculate = function (arg) {
    function normsinv(x) {
        if (x <= 0 || x >= 1) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber(gaussinv(x));
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
                    var a = normsinv(elem.getValue());
                    this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_available) : new cNumber(a);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            });
        } else {
            var a = normsinv(arg0.getValue());
            return this.value = isNaN(a) ? new cError(cErrorType.not_available) : new cNumber(a);
        }
    }
    return this.value = arg0;
};
cNORMSINV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( probability )"
    };
};
function cPEARSON() {
    this.name = "PEARSON";
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
cPEARSON.prototype = Object.create(cBaseFunction.prototype);
cPEARSON.prototype.Calculate = function (arg) {
    function pearson(x, y) {
        var sumXDeltaYDelta = 0,
        sqrXDelta = 0,
        sqrYDelta = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        if (x.length != y.length) {
            return new cError(cErrorType.not_available);
        }
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);
        }
        if (sqrXDelta == 0 || sqrYDelta == 0) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(sumXDeltaYDelta / Math.sqrt(sqrXDelta * sqrYDelta));
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = pearson(arr0, arr1);
};
cPEARSON.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cPERCENTILE() {
    this.name = "PERCENTILE";
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
cPERCENTILE.prototype = Object.create(cBaseFunction.prototype);
cPERCENTILE.prototype.Calculate = function (arg) {
    function percentile(A, k) {
        var tA = [],
        alpha = k.getValue();
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cError) {
                    return A[i][j];
                } else {
                    if (A[i][j] instanceof cNumber) {
                        tA.push(A[i][j].getValue());
                    } else {
                        if (A[i][j] instanceof cBool) {
                            tA.push(A[i][j].tocNumber().getValue());
                        }
                    }
                }
            }
        }
        tA.sort(fSortAscending);
        var nSize = tA.length;
        if (tA.length < 1 || nSize == 0) {
            return new cError(cErrorType.not_available);
        } else {
            if (nSize == 1) {
                return new cNumber(tA[0]);
            } else {
                var nIndex = Math.floor(alpha * (nSize - 1));
                var fDiff = alpha * (nSize - 1) - Math.floor(alpha * (nSize - 1));
                if (fDiff == 0) {
                    return new cNumber(tA[nIndex]);
                } else {
                    return new cNumber(tA[nIndex] + fDiff * (tA[nIndex + 1] - tA[nIndex]));
                }
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cArea3D) {
            arg0 = arg0.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    arg1 = arg1.tocNumber();
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    return this.value = percentile(arg0, arg1);
};
cPERCENTILE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  array , k )"
    };
};
function cPERCENTRANK() {
    this.name = "PERCEBTRANK";
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
cPERCENTRANK.prototype = Object.create(cBaseFunction.prototype);
cPERCENTRANK.prototype.Calculate = function (arg) {
    function percentrank(A, x, k) {
        var tA = [],
        t;
        k = k.getValue();
        for (var i = 0; i < A.length; i++) {
            t = A[i].tocNumber();
            if (t instanceof cNumber) {
                tA.push(t.getValue());
            }
        }
        var fNum = x.getValue();
        tA.sort(fSortAscending);
        var nSize = tA.length;
        if (tA.length < 1 || nSize == 0) {
            return new cError(cErrorType.not_available);
        } else {
            if (fNum < tA[0] || fNum > tA[nSize - 1]) {
                return new cError(cErrorType.not_available);
            } else {
                if (nSize == 1) {
                    return new cNumber(1);
                } else {
                    var fRes, nOldCount = 0,
                    fOldVal = tA[0],
                    i;
                    for (i = 1; i < nSize && tA[i] < fNum; i++) {
                        if (tA[i] != fOldVal) {
                            nOldCount = i;
                            fOldVal = tA[i];
                        }
                    }
                    if (tA[i] != fOldVal) {
                        nOldCount = i;
                    }
                    if (fNum == tA[i]) {
                        fRes = nOldCount / (nSize - 1);
                    } else {
                        if (nOldCount == 0) {
                            fRes = 0;
                        } else {
                            var fFract = (fNum - tA[nOldCount - 1]) / (tA[nOldCount] - tA[nOldCount - 1]);
                            fRes = (nOldCount - 1 + fFract) / (nSize - 1);
                        }
                    }
                    return new cNumber(fRes.toString().substr(0, fRes.toString().indexOf(".") + 1 + k) - 0);
                }
            }
        }
    }
    var arr0 = [],
    arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2] ? arg[2] : new cNumber(3);
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0.foreach2(function (elem) {
            if (elem instanceof cNumber) {
                arr0.push(elem);
            }
        });
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    return this.value = percentrank(arr0, arg1, arg2);
};
cPERCENTRANK.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array , x [ , significance ]  )"
    };
};
function cPERMUT() {
    this.name = "PERMUT";
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
cPERMUT.prototype = Object.create(cBaseFunction.prototype);
cPERMUT.prototype.Calculate = function (arg) {
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
                    this.array[r][c] = new cNumber(Math.permut(a.getValue(), b.getValue()));
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
                    if (a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue()) {
                        this.array[r][c] = new cError(cErrorType.not_numeric);
                    }
                    this.array[r][c] = new cNumber(Math.permut(a.getValue(), b.getValue()));
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
                        this.array[r][c] = new cNumber(Math.permut(a.getValue(), b.getValue()));
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
    return this.value = new cNumber(Math.permut(arg0.getValue(), arg1.getValue()));
};
cPERMUT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( number , number-chosen )"
    };
};
function cPOISSON() {
    this.name = "POISSON";
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
cPOISSON.prototype = Object.create(cBaseFunction.prototype);
cPOISSON.prototype.Calculate = function (arg) {
    function poisson(x, l, cumulativeFlag) {
        var _x = parseInt(x.getValue()),
        _l = l.getValue(),
        f = cumulativeFlag.toBool();
        if (f) {
            var sum = 0;
            for (var k = 0; k <= x; k++) {
                sum += Math.pow(_l, k) / Math.fact(k);
            }
            sum *= Math.exp(-_l);
            return new cNumber(sum);
        } else {
            return new cNumber(Math.exp(-_l) * Math.pow(_l, _x) / Math.fact(_x));
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    if (arg0.getValue() < 0 || arg1.getValue() <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    return this.value = new cNumber(poisson(arg0, arg1, arg2));
};
cPOISSON.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , mean , cumulative-flag )"
    };
};
function cPROB() {
    this.name = "PROB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPROB.prototype = Object.create(cBaseFunction.prototype);
cPROB.prototype.Calculate = function (arg) {
    function prob(x, p, l, u) {
        var fUp, fLo;
        fLo = l.getValue();
        if (u instanceof cEmpty) {
            fUp = fLo;
        } else {
            fUp = u.getValue();
        }
        if (fLo > fUp) {
            var fTemp = fLo;
            fLo = fUp;
            fUp = fTemp;
        }
        var nC1 = x[0].length,
        nC2 = p[0].length,
        nR1 = x.length,
        nR2 = p.length;
        if (nC1 != nC2 || nR1 != nR2 || nC1 == 0 || nR1 == 0 || nC2 == 0 || nR2 == 0) {
            return new cError(cErrorType.not_available);
        } else {
            var fSum = 0,
            fRes = 0,
            bStop = false,
            fP, fW;
            for (var i = 0; i < nR1 && !bStop; i++) {
                for (var j = 0; j < nC1 && !bStop; j++) {
                    if (x[i][j] instanceof cNumber && p[i][j] instanceof cNumber) {
                        fP = p[i][j].getValue();
                        fW = x[i][j].getValue();
                        if (fP < 0 || fP > 1) {
                            bStop = true;
                        } else {
                            fSum += fP;
                            if (fW >= fLo && fW <= fUp) {
                                fRes += fP;
                            }
                        }
                    } else {
                        return new cError(cErrorType.not_available);
                    }
                }
            }
            if (bStop || Math.abs(fSum - 1) > 1e-07) {
                return new cError(cErrorType.not_available);
            } else {
                return new cNumber(fRes);
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2],
    arg3 = arg[3] ? arg[3] : new cEmpty();
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cArea3D) {
            arg0 = arg0.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArray) {
        arg1 = arg1.getMatrix();
    } else {
        if (arg1 instanceof cArea3D) {
            arg1 = arg1.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
        arg3 = arg3.cross(arguments[1].first);
    } else {
        if (arg3 instanceof cArray) {
            arg3 = arg3.getElement(0);
        }
    }
    arg2 = arg2.tocNumber();
    if (!arg3 instanceof cEmpty) {
        arg3 = arg3.tocNumber();
    }
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    if (arg3 instanceof cError) {
        return this.value = arg3;
    }
    return this.value = prob(arg0, arg1, arg2, arg3);
};
cPROB.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x-range , probability-range , lower-limit [ , upper-limit ] )"
    };
};
function cQUARTILE() {
    this.name = "QUARTILE";
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
cQUARTILE.prototype = Object.create(cBaseFunction.prototype);
cQUARTILE.prototype.Calculate = function (arg) {
    function quartile(A, k) {
        var tA = [],
        fFlag = k.getValue();
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cError) {
                    return A[i][j];
                } else {
                    if (A[i][j] instanceof cNumber) {
                        tA.push(A[i][j].getValue());
                    } else {
                        if (A[i][j] instanceof cBool) {
                            tA.push(A[i][j].tocNumber().getValue());
                        }
                    }
                }
            }
        }
        tA.sort(fSortAscending);
        var nSize = tA.length;
        if (tA.length < 1 || nSize == 0) {
            return new cError(cErrorType.not_available);
        } else {
            if (nSize == 1) {
                return new cNumber(tA[0]);
            } else {
                if (fFlag < 0 || fFlag > 4) {
                    return new cError(cErrorType.not_numeric);
                } else {
                    if (fFlag == 0) {
                        return new cNumber(tA[0]);
                    } else {
                        if (fFlag == 1) {
                            var nIndex = Math.floor(0.25 * (nSize - 1)),
                            fDiff = 0.25 * (nSize - 1) - Math.floor(0.25 * (nSize - 1));
                            if (fDiff == 0) {
                                return new cNumber(tA[nIndex]);
                            } else {
                                return new cNumber(tA[nIndex] + fDiff * (tA[nIndex + 1] - tA[nIndex]));
                            }
                        } else {
                            if (fFlag == 2) {
                                if (nSize % 2 == 0) {
                                    return new cNumber((tA[nSize / 2 - 1] + tA[nSize / 2]) / 2);
                                } else {
                                    return new cNumber(tA[(nSize - 1) / 2]);
                                }
                            } else {
                                if (fFlag == 3) {
                                    var nIndex = Math.floor(0.75 * (nSize - 1)),
                                    fDiff = 0.75 * (nSize - 1) - Math.floor(0.75 * (nSize - 1));
                                    if (fDiff == 0) {
                                        return new cNumber(tA[nIndex]);
                                    } else {
                                        return new cNumber(tA[nIndex] + fDiff * (tA[nIndex + 1] - tA[nIndex]));
                                    }
                                } else {
                                    return new cNumber(tA[nSize - 1]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cArea3D) {
            arg0 = arg0.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    arg1 = arg1.tocNumber();
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    return this.value = quartile(arg0, arg1);
};
cQUARTILE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  array , result-category )"
    };
};
function cRANK() {
    cBaseFunction.call(this, "RANK");
}
cRANK.prototype = Object.create(cBaseFunction.prototype);
function cRSQ() {
    this.name = "RSQ";
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
cRSQ.prototype = Object.create(cBaseFunction.prototype);
cRSQ.prototype.Calculate = function (arg) {
    function rsq(x, y) {
        var sumXDeltaYDelta = 0,
        sqrXDelta = 0,
        sqrYDelta = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        if (x.length != y.length) {
            return new cError(cErrorType.not_available);
        }
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);
        }
        if (sqrXDelta == 0 || sqrYDelta == 0) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(Math.pow(sumXDeltaYDelta / Math.sqrt(sqrXDelta * sqrYDelta), 2));
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = rsq(arr0, arr1);
};
cRSQ.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cSKEW() {
    this.name = "SKEW";
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
cSKEW.prototype = Object.create(cBaseFunction.prototype);
cSKEW.prototype.Calculate = function (arg) {
    function skew(x) {
        var sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0,
        standDev = 0,
        sumSQRDeltaXDivstandDev = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                xLength++;
            }
        }
        if (xLength <= 2) {
            return new cError(cErrorType.not_available);
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                sumSQRDeltaX += Math.pow(x[i].getValue() - _x, 2);
            }
        }
        standDev = Math.sqrt(sumSQRDeltaX / (xLength - 1));
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                sumSQRDeltaXDivstandDev += Math.pow((x[i].getValue() - _x) / standDev, 3);
            }
        }
        return new cNumber(xLength / (xLength - 1) / (xLength - 2) * sumSQRDeltaXDivstandDev);
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            continue;
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = skew(arr0);
};
cSKEW.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSLOPE() {
    this.name = "SLOPE";
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
cSLOPE.prototype = Object.create(cBaseFunction.prototype);
cSLOPE.prototype.Calculate = function (arg) {
    function slope(y, x) {
        var sumXDeltaYDelta = 0,
        sqrXDelta = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        if (x.length != y.length) {
            return new cError(cErrorType.not_available);
        }
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
        }
        if (sqrXDelta == 0) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(sumXDeltaYDelta / sqrXDelta);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = slope(arr0, arr1);
};
cSLOPE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( array-1 , array-2 )"
    };
};
function cSMALL() {
    this.name = "SMALL";
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
cSMALL.prototype = Object.create(cBaseFunction.prototype);
cSMALL.prototype.Calculate = function (arg) {
    function frequency(A, k) {
        var tA = [];
        for (var i = 0; i < A.length; i++) {
            for (var j = 0; j < A[i].length; j++) {
                if (A[i][j] instanceof cError) {
                    return A[i][j];
                } else {
                    if (A[i][j] instanceof cNumber) {
                        tA.push(A[i][j].getValue());
                    } else {
                        if (A[i][j] instanceof cBool) {
                            tA.push(A[i][j].tocNumber().getValue());
                        }
                    }
                }
            }
        }
        tA.sort(fSortAscending);
        if (k.getValue() > tA.length || k.getValue() <= 0) {
            return new cError(cErrorType.not_available);
        } else {
            return new cNumber(tA[k.getValue() - 1]);
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1];
    if (arg0 instanceof cArea || arg0 instanceof cArray) {
        arg0 = arg0.getMatrix();
    } else {
        if (arg0 instanceof cArea3D) {
            arg0 = arg0.getMatrix()[0];
        } else {
            return this.value = new cError(cErrorType.not_available);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    arg1 = arg1.tocNumber();
    if (arg1 instanceof cError) {
        return this.value = arg1;
    }
    return this.value = frequency(arg0, arg1);
};
cSMALL.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(  array , k )"
    };
};
function cSTANDARDIZE() {
    this.name = "STANDARDIZE";
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
cSTANDARDIZE.prototype = Object.create(cBaseFunction.prototype);
cSTANDARDIZE.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    function standardize(x, mue, sigma) {
        if (sigma <= 0) {
            return new cError(cErrorType.not_numeric);
        } else {
            return new cNumber((x - mue) / sigma);
        }
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cArray) {
            arg0 = arg0.getElement(0);
        }
    }
    if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
        arg1 = arg1.cross(arguments[1].first);
    } else {
        if (arg1 instanceof cArray) {
            arg1 = arg1.getElement(0);
        }
    }
    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
        arg2 = arg2.cross(arguments[1].first);
    } else {
        if (arg2 instanceof cArray) {
            arg2 = arg2.getElement(0);
        }
    }
    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
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
    return this.value = standardize(arg0.getValue(), arg1.getValue(), arg2.getValue());
};
cSTANDARDIZE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( x , mean , standard-deviation )"
    };
};
function cSTDEV() {
    this.name = "STDEV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cSTDEV.prototype = Object.create(cBaseFunction.prototype);
cSTDEV.prototype.Calculate = function (arg) {
    var count = 0,
    sum = new cNumber(0),
    member = [];
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue();
            if (_argV instanceof cNumber) {
                member.push(_argV);
                sum = _func[sum.type][_argV.type](sum, _argV, "+");
                count++;
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    var __arg = _argAreaValue[j];
                    if (__arg instanceof cNumber) {
                        member.push(__arg);
                        sum = _func[sum.type][__arg.type](sum, __arg, "+");
                        count++;
                    }
                }
            } else {
                if (_arg instanceof cArray) {
                    _arg.foreach(function (elem) {
                        var e = elem.tocNumber();
                        if (e instanceof cNumber) {
                            member.push(e);
                            sum = _func[sum.type][e.type](sum, e, "+");
                            count++;
                        }
                    });
                } else {
                    _arg = _arg.tocNumber();
                    if (_arg instanceof cNumber) {
                        member.push(_arg);
                        sum = _func[sum.type][_arg.type](sum, _arg, "+");
                        count++;
                    }
                }
            }
        }
    }
    var average = sum.getValue() / count,
    res = 0,
    av;
    for (var i = 0; i < member.length; i++) {
        av = member[i] - average;
        res += av * av;
    }
    return this.value = new cNumber(Math.sqrt(res / (count - 1)));
};
cSTDEV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSTDEVA() {
    this.name = "STDEVA";
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
cSTDEVA.prototype = Object.create(cBaseFunction.prototype);
cSTDEVA.prototype.Calculate = function (arg) {
    var count = 0,
    sum = new cNumber(0),
    member = [];
    for (var i = 0; i < arg.length; i++) {
        var _arg = arg[i];
        if (_arg instanceof cRef || _arg instanceof cRef3D) {
            var _argV = _arg.getValue().tocNumber();
            if (_argV instanceof cNumber) {
                member.push(_argV);
                sum = _func[sum.type][_argV.type](sum, _argV, "+");
                count++;
            }
        } else {
            if (_arg instanceof cArea || _arg instanceof cArea3D) {
                var _argAreaValue = _arg.getValue();
                for (var j = 0; j < _argAreaValue.length; j++) {
                    var __arg = _argAreaValue[j].tocNumber();
                    if (__arg instanceof cNumber) {
                        member.push(__arg);
                        sum = _func[sum.type][__arg.type](sum, __arg, "+");
                        count++;
                    }
                }
            } else {
                if (_arg instanceof cArray) {
                    _arg.foreach(function (elem) {
                        var e = elem.tocNumber();
                        if (e instanceof cNumber) {
                            member.push(e);
                            sum = _func[sum.type][e.type](sum, e, "+");
                            count++;
                        }
                    });
                } else {
                    _arg = _arg.tocNumber();
                    if (_arg instanceof cNumber) {
                        member.push(_arg);
                        sum = _func[sum.type][_arg.type](sum, _arg, "+");
                        count++;
                    }
                }
            }
        }
    }
    var average = sum.getValue() / count,
    res = 0,
    av;
    for (var i = 0; i < member.length; i++) {
        av = member[i] - average;
        res += av * av;
    }
    return this.value = new cNumber(Math.sqrt(res / (count - 1)));
};
cSTDEVA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSTDEVP() {
    this.name = "STDEVP";
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
cSTDEVP.prototype = Object.create(cBaseFunction.prototype);
cSTDEVP.prototype.Calculate = function (arg) {
    function _var(x) {
        var tA = [],
        sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                tA.push(x[i].getValue());
                xLength++;
            } else {
                if (x[i] instanceof cError) {
                    return x[i];
                }
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
        }
        return new cNumber(isNaN(_x) ? new cError(cErrorType.division_by_zero) : Math.sqrt(sumSQRDeltaX / xLength));
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber || elem instanceof cError) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber || a instanceof cError) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber || elem instanceof cError) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString || arg[j] instanceof cEmpty) {
                            arr0.push(new cNumber(0));
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = _var(arr0);
};
cSTDEVP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSTDEVPA() {
    this.name = "STDEVPA";
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
cSTDEVPA.prototype = Object.create(cBaseFunction.prototype);
cSTDEVPA.prototype.Calculate = function (arg) {
    function _var(x) {
        var tA = [],
        sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                tA.push(x[i].getValue());
                xLength++;
            } else {
                if (x[i] instanceof cError) {
                    return x[i];
                }
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
        }
        return new cNumber(Math.sqrt(sumSQRDeltaX / xLength));
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber || elem instanceof cError) {
                    arr0.push(elem);
                } else {
                    if (elem instanceof cBool) {
                        arr0.push(elem.tocNumber());
                    } else {
                        if (elem instanceof cString) {
                            arr0.push(new cNumber(0));
                        }
                    }
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber || a instanceof cError) {
                    arr0.push(a);
                } else {
                    if (a instanceof cBool) {
                        arr0.push(a.tocNumber());
                    } else {
                        if (a instanceof cString) {
                            arr0.push(new cNumber(0));
                        }
                    }
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber || elem instanceof cError) {
                            arr0.push(elem);
                        } else {
                            if (elem instanceof cBool) {
                                arr0.push(elem.tocNumber());
                            } else {
                                if (elem instanceof cString) {
                                    arr0.push(new cNumber(0));
                                }
                            }
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            arr0.push(new cNumber(0));
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = _var(arr0);
};
cSTDEVPA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cSTEYX() {
    this.name = "STEYX";
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
cSTEYX.prototype = Object.create(cBaseFunction.prototype);
cSTEYX.prototype.Calculate = function (arg) {
    function steyx(y, x) {
        var sumXDeltaYDelta = 0,
        sqrXDelta = 0,
        sqrYDelta = 0,
        _x = 0,
        _y = 0,
        xLength = 0;
        if (x.length != y.length) {
            return new cError(cErrorType.not_available);
        }
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            _x += x[i].getValue();
            _y += y[i].getValue();
            xLength++;
        }
        _x /= xLength;
        _y /= xLength;
        for (var i = 0; i < x.length; i++) {
            if (! (x[i] instanceof cNumber && y[i] instanceof cNumber)) {
                continue;
            }
            sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
            sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
            sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);
        }
        if (sqrXDelta == 0 || sqrYDelta == 0 || xLength < 3) {
            return new cError(cErrorType.division_by_zero);
        } else {
            return new cNumber(Math.sqrt((1 / (xLength - 2)) * (sqrYDelta - sumXDeltaYDelta * sumXDeltaYDelta / sqrXDelta)));
        }
    }
    var arg0 = arg[0],
    arg1 = arg[1],
    arr0 = [],
    arr1 = [];
    if (arg0 instanceof cArea) {
        arr0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (elem) {
                arr0.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    if (arg1 instanceof cArea) {
        arr1 = arg1.getValue();
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (elem) {
                arr1.push(elem);
            });
        } else {
            return this.value = cError(cErrorType.wrong_value_type);
        }
    }
    return this.value = steyx(arr0, arr1);
};
cSTEYX.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( known-ys , known-xs )"
    };
};
function cTDIST() {
    cBaseFunction.call(this, "TDIST");
}
cTDIST.prototype = Object.create(cBaseFunction.prototype);
function cTINV() {
    cBaseFunction.call(this, "TINV");
}
cTINV.prototype = Object.create(cBaseFunction.prototype);
function cTREND() {
    cBaseFunction.call(this, "TREND");
}
cTREND.prototype = Object.create(cBaseFunction.prototype);
function cTRIMMEAN() {
    cBaseFunction.call(this, "TRIMMEAN");
}
cTRIMMEAN.prototype = Object.create(cBaseFunction.prototype);
function cTTEST() {
    cBaseFunction.call(this, "TTEST");
}
cTTEST.prototype = Object.create(cBaseFunction.prototype);
function cVAR() {
    this.name = "VAR";
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
cVAR.prototype = Object.create(cBaseFunction.prototype);
cVAR.prototype.Calculate = function (arg) {
    function _var(x) {
        if (x.length < 1) {
            return new cError(cErrorType.division_by_zero);
        }
        var tA = [],
        sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                tA.push(x[i].getValue());
                xLength++;
            } else {
                if (x[i] instanceof cError) {
                    return x[i];
                }
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
        }
        return new cNumber(sumSQRDeltaX / (xLength - 1));
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber || elem instanceof cError) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber || a instanceof cError) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber || elem instanceof cError) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString || arg[j] instanceof cEmpty) {
                            continue;
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = _var(arr0);
};
cVAR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cVARA() {
    this.name = "VARA";
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
cVARA.prototype = Object.create(cBaseFunction.prototype);
cVARA.prototype.Calculate = function (arg) {
    function _var(x) {
        if (x.length < 1) {
            return new cError(cErrorType.division_by_zero);
        }
        var tA = [],
        sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                tA.push(x[i].getValue());
                xLength++;
            } else {
                if (x[i] instanceof cError) {
                    return x[i];
                }
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
        }
        return new cNumber(sumSQRDeltaX / (xLength - 1));
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber || elem instanceof cError) {
                    arr0.push(elem);
                } else {
                    if (elem instanceof cBool) {
                        arr0.push(elem.tocNumber());
                    } else {
                        if (elem instanceof cString) {
                            arr0.push(new cNumber(0));
                        }
                    }
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber || a instanceof cError) {
                    arr0.push(a);
                } else {
                    if (a instanceof cBool) {
                        arr0.push(a.tocNumber());
                    } else {
                        if (a instanceof cString) {
                            arr0.push(new cNumber(0));
                        }
                    }
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber || elem instanceof cError) {
                            arr0.push(elem);
                        } else {
                            if (elem instanceof cBool) {
                                arr0.push(elem.tocNumber());
                            } else {
                                if (a instanceof cString) {
                                    arr0.push(new cNumber(0));
                                }
                            }
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            arr0.push(new cNumber(0));
                        } else {
                            if (arg[j] instanceof cError) {
                                return this.value = cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
            }
        }
    }
    return this.value = _var(arr0);
};
cVARA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cVARP() {
    this.name = "VARP";
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
cVARP.prototype = Object.create(cBaseFunction.prototype);
cVARP.prototype.Calculate = function (arg) {
    function _var(x) {
        if (x.length < 1) {
            return new cError(cErrorType.division_by_zero);
        }
        var tA = [],
        sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                tA.push(x[i].getValue());
                xLength++;
            } else {
                if (x[i] instanceof cError) {
                    return x[i];
                }
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
        }
        return new cNumber(sumSQRDeltaX / xLength);
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber || elem instanceof cError) {
                    arr0.push(elem);
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber || a instanceof cError) {
                    arr0.push(a);
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber || elem instanceof cError) {
                            arr0.push(elem);
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString || arg[j] instanceof cEmpty) {
                            arr0.push(new cNumber(0));
                        } else {
                            return this.value = cError(cErrorType.wrong_value_type);
                        }
                    }
                }
            }
        }
    }
    return this.value = _var(arr0);
};
cVARP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cVARdotP() {
    this.name = "VAR.P";
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
cVARdotP.prototype = Object.create(cBaseFunction.prototype);
cVARdotP.prototype.Calculate = cVARP.prototype.Calculate;
cVARdotP.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cVARPA() {
    this.name = "VARPA";
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
cVARPA.prototype = Object.create(cBaseFunction.prototype);
cVARPA.prototype.Calculate = function (arg) {
    function _var(x) {
        if (x.length < 1) {
            return new cError(cErrorType.division_by_zero);
        }
        var tA = [],
        sumSQRDeltaX = 0,
        _x = 0,
        xLength = 0;
        for (var i = 0; i < x.length; i++) {
            if (x[i] instanceof cNumber) {
                _x += x[i].getValue();
                tA.push(x[i].getValue());
                xLength++;
            } else {
                if (x[i] instanceof cError) {
                    return x[i];
                }
            }
        }
        _x /= xLength;
        for (var i = 0; i < x.length; i++) {
            sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
        }
        return new cNumber(sumSQRDeltaX / xLength);
    }
    var arr0 = [];
    for (var j = 0; j < this.getArguments(); j++) {
        if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
            arg[j].foreach2(function (elem) {
                if (elem instanceof cNumber || elem instanceof cError) {
                    arr0.push(elem);
                } else {
                    if (elem instanceof cBool) {
                        arr0.push(elem.tocNumber());
                    } else {
                        if (elem instanceof cString) {
                            arr0.push(new cNumber(0));
                        }
                    }
                }
            });
        } else {
            if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
                var a = arg[j].getValue();
                if (a instanceof cNumber || a instanceof cError) {
                    arr0.push(a);
                } else {
                    if (a instanceof cBool) {
                        arr0.push(a.tocNumber());
                    } else {
                        if (a instanceof cString) {
                            arr0.push(new cNumber(0));
                        }
                    }
                }
            } else {
                if (arg[j] instanceof cArray) {
                    arg[j].foreach(function (elem) {
                        if (elem instanceof cNumber || elem instanceof cError) {
                            arr0.push(elem);
                        } else {
                            if (elem instanceof cBool) {
                                arr0.push(elem.tocNumber());
                            } else {
                                if (elem instanceof cString) {
                                    arr0.push(new cNumber(0));
                                }
                            }
                        }
                    });
                } else {
                    if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
                        arr0.push(arg[j].tocNumber());
                    } else {
                        if (arg[j] instanceof cString) {
                            arr0.push(new cNumber(0));
                        } else {
                            if (elem instanceof cError) {
                                return this.value = cError(cErrorType.wrong_value_type);
                            }
                        }
                    }
                }
            }
        }
    }
    return this.value = _var(arr0);
};
cVARPA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( argument-list )"
    };
};
function cWEIBULL() {
    cBaseFunction.call(this, "WEIBULL");
}
cWEIBULL.prototype = Object.create(cBaseFunction.prototype);
function cZTEST() {
    cBaseFunction.call(this, "ZTEST");
}
cZTEST.prototype = Object.create(cBaseFunction.prototype);