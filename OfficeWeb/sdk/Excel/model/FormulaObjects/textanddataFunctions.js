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
 cFormulaFunction.TextAndData = {
    "groupName": "TextAndData",
    "ASC": function () {
        var r = new cBaseFunction("ASC");
        return r;
    },
    "BAHTTEXT": function () {
        var r = new cBaseFunction("BAHTTEXT");
        return r;
    },
    "CHAR": function () {
        var r = new cBaseFunction("CHAR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number )"
            };
        };
        return r;
    },
    "CLEAN": function () {
        var r = new cBaseFunction("CLEAN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string )"
            };
        };
        return r;
    },
    "CODE": function () {
        var r = new cBaseFunction("CODE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string )"
            };
        };
        return r;
    },
    "CONCATENATE": function () {
        var r = new cBaseFunction("CONCATENATE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(text1, text2, ...)"
            };
        };
        return r;
    },
    "DOLLAR": function () {
        var r = new cBaseFunction("DOLLAR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
                var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor(Math.log(Math.abs(quotient)) / Math.log(10)) - cExcelSignificantDigits);
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
                        b = arg1.getElementRowCol(r, c);
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
                        b = arg1;
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
                            b = elem;
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number [ , num-decimal ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "EXACT": function () {
        var r = new cBaseFunction("EXACT");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(text1, text2)"
            };
        };
        return r;
    },
    "FIND": function () {
        var r = new cBaseFunction("FIND");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string-1 , string-2 [ , start-pos ] )"
            };
        };
        return r;
    },
    "FINDB": function () {
        var r = cFormulaFunction.TextAndData["FIND"]();
        r.setName("FINDB");
        return r;
    },
    "FIXED": function () {
        var r = new cBaseFunction("FIXED");
        r.setArgumentsMin(1);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
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
                var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor(Math.log(Math.abs(quotient)) / Math.log(10)) - cExcelSignificantDigits);
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
                        b = arg1.getElementRowCol(r, c);
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
                        b = arg1;
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
                            b = elem;
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number [ , [ num-decimal ] [ , suppress-commas-flag ] ] )"
            };
        };
        return r;
    },
    "JIS": function () {
        var r = new cBaseFunction("JIS");
        return r;
    },
    "LEFT": function () {
        var r = new cBaseFunction("LEFT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string [ , number-chars ] )"
            };
        };
        return r;
    },
    "LEFTB": function () {
        var r = cFormulaFunction.TextAndData["LEFT"]();
        r.setName("LEFTB");
        return r;
    },
    "LEN": function () {
        var r = new cBaseFunction("LEN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string )"
            };
        };
        return r;
    },
    "LENB": function () {
        var r = cFormulaFunction.TextAndData["LEN"]();
        r.setName("LENB");
        return r;
    },
    "LOWER": function () {
        var r = new cBaseFunction("LOWER");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(text)"
            };
        };
        return r;
    },
    "MID": function () {
        var r = new cBaseFunction("MID");
        r.setArgumentsMin(3);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string , start-pos , number-chars )"
            };
        };
        return r;
    },
    "MIDB": function () {
        var r = cFormulaFunction.TextAndData["MID"]();
        r.setName("MIDB");
        return r;
    },
    "PHONETIC": function () {
        var r = new cBaseFunction("PHONETIC");
        return r;
    },
    "PROPER": function () {
        var r = new cBaseFunction("PROPER");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string )"
            };
        };
        return r;
    },
    "REPLACE": function () {
        var r = new cBaseFunction("REPLACE");
        r.setArgumentsMin(4);
        r.setArgumentsMax(4);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string-1, start-pos, number-chars, string-2 )"
            };
        };
        return r;
    },
    "REPLACEB": function () {
        var r = cFormulaFunction.TextAndData["REPLACE"]();
        r.setName("REPLACEB");
        return r;
    },
    "REPT": function () {
        var r = new cBaseFunction("REPT");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(text, number_of_times)"
            };
        };
        return r;
    },
    "RIGHT": function () {
        var r = new cBaseFunction("RIGHT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string [ , number-chars ] )"
            };
        };
        return r;
    },
    "RIGHTB": function () {
        var r = cFormulaFunction.TextAndData["RIGHT"]();
        r.setName("RIGHTB");
        return r;
    },
    "SEARCH": function () {
        var r = new cBaseFunction("SEARCH");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
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
            res = string2.substring(arg2.getValue() - 1).search(valueForSearching) + arg2.getValue() - 1;
            if (res < 0) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.value = new cNumber(res + 1);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string-1 , string-2 [ , start-pos ] )"
            };
        };
        return r;
    },
    "SEARCHB": function () {
        var r = cFormulaFunction.TextAndData["SEARCH"]();
        r.setName("SEARCHB");
        return r;
    },
    "SUBSTITUTE": function () {
        var r = new cBaseFunction("SUBSTITUTE");
        r.setArgumentsMin(3);
        r.setArgumentsMax(4);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string , old-string , new-string [ , occurence ] )"
            };
        };
        return r;
    },
    "T": function () {
        var r = new cBaseFunction("T");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( value )"
            };
        };
        return r;
    },
    "TEXT": function () {
        var r = new cBaseFunction("TEXT");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
            var aText = oFormat.format(arg0.getValue(), arg0 instanceof cNumber ? CellValueType.Number : CellValueType.String, gc_nMaxDigCountView, null);
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
            return this.value = new cString(text);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( value , format )"
            };
        };
        return r;
    },
    "TRIM": function () {
        var r = new cBaseFunction("TRIM");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
            return this.value = new cString(arg0.getValue().replace(/\s/g, function ($0, $1, $2) {
                var r;
                /\s/.test($2[$1 + 1]) ? r = "" : r = $2[$1];
                return r;
            }).replace(/^\s|\s$/g, ""));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string )"
            };
        };
        return r;
    },
    "UPPER": function () {
        var r = new cBaseFunction("UPPER");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(text)"
            };
        };
        return r;
    },
    "VALUE": function () {
        var r = new cBaseFunction("VALUE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( string )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    }
};