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
 var numFormat_Text = 0;
var numFormat_TextPlaceholder = 1;
var numFormat_Bracket = 2;
var numFormat_Digit = 3;
var numFormat_DigitNoDisp = 4;
var numFormat_DigitSpace = 5;
var numFormat_DecimalPoint = 6;
var numFormat_DecimalFrac = 7;
var numFormat_Thousand = 8;
var numFormat_Scientific = 9;
var numFormat_Repeat = 10;
var numFormat_Skip = 11;
var numFormat_Year = 12;
var numFormat_Month = 13;
var numFormat_Minute = 14;
var numFormat_Hour = 15;
var numFormat_Day = 16;
var numFormat_Second = 17;
var numFormat_Milliseconds = 18;
var numFormat_AmPm = 19;
var numFormat_MonthMinute = 101;
var numFormat_Percent = 102;
var oNumFormatCache;
var FormatStates = {
    Decimal: 1,
    Frac: 2,
    Scientific: 3,
    Slash: 4
};
var SignType = {
    Positive: 1,
    Negative: 2,
    Null: 3
};
var monthCut = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthShort = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var gc_nMaxDigCount = 15;
var gc_nMaxDigCountView = 11;
var gc_nMaxMantissa = Math.pow(10, gc_nMaxDigCount);
var NumComporationOperators = {
    equal: 1,
    greater: 2,
    less: 3,
    greaterorequal: 4,
    lessorequal: 5,
    notequal: 6
};
function getNumberParts(x) {
    var sig = SignType.Null;
    if (x > 0) {
        sig = SignType.Positive;
    } else {
        if (x < 0) {
            sig = SignType.Negative;
            x = Math.abs(x);
        }
    }
    var exp = Math.floor(Math.log(x) * Math.LOG10E) - gc_nMaxDigCount + 1;
    var man = Math.round(x / Math.pow(10, exp));
    if (man >= gc_nMaxMantissa) {
        exp++;
        man /= 10;
    }
    return {
        mantissa: man,
        exponent: exp,
        sign: sig
    };
}
function FormatObj(type, val) {
    this.type = type;
    this.val = val;
}
function FormatObjScientific(val, format, sign) {
    this.type = numFormat_Scientific;
    this.val = val;
    this.format = format;
    this.sign = sign;
}
function FormatObjDecimalFrac(aLeft, aRight) {
    this.type = numFormat_DecimalFrac;
    this.aLeft = aLeft;
    this.aRight = aRight;
    this.bNumRight = false;
}
function FormatObjDateVal(type, nCount, bElapsed) {
    this.type = type;
    this.val = nCount;
    this.bElapsed = bElapsed;
}
function FormatObjDateAmPm(sAm, sPm) {
    this.type = numFormat_AmPm;
    this.sAm = sAm;
    this.sPm = sPm;
}
function FormatObjBracket(sData) {
    this.type = numFormat_Bracket;
    this.val = sData;
    this.parse = function (data) {
        var length = data.length;
        if (length > 0) {
            var first = data[0];
            if ("$" == first) {
                var aParams = data.substring(1).split("-");
                if (2 == aParams.length) {
                    var sFirstParam = aParams[0];
                    var sSecondParam = aParams[1];
                    if (null != sFirstParam && sFirstParam.length > 0 && null != sSecondParam && sSecondParam.length > 0) {
                        this.CurrencyString = sFirstParam;
                        this.Lid = sSecondParam;
                    }
                }
            } else {
                if ("y" == first || "m" == first || "d" == first || "h" == first || "s" == first || "Y" == first || "M" == first || "D" == first || "H" == first || "S" == first) {
                    var bSame = true;
                    var nCount = 1;
                    for (var i = 1; i < length; ++i) {
                        if (first != data[i]) {
                            bSame = false;
                            break;
                        }
                        nCount++;
                    }
                    if (true == bSame) {
                        switch (first) {
                        case "Y":
                            case "y":
                            this.dataObj = new FormatObjDateVal(numFormat_Year, nCount, true);
                            break;
                        case "M":
                            case "m":
                            this.dataObj = new FormatObjDateVal(numFormat_MonthMinute, nCount, true);
                            break;
                        case "D":
                            case "d":
                            this.dataObj = new FormatObjDateVal(numFormat_Day, nCount, true);
                            break;
                        case "H":
                            case "h":
                            this.dataObj = new FormatObjDateVal(numFormat_Hour, nCount, true);
                            break;
                        case "S":
                            case "s":
                            this.dataObj = new FormatObjDateVal(numFormat_Second, nCount, true);
                            break;
                        }
                    }
                } else {
                    if ("=" == first || ">" == first || "<" == first) {
                        var nIndex = 1;
                        var sOperator = first;
                        if (length > 1 && (">" == first || "<" == first)) {
                            var second = data[1];
                            if ("=" == second || (">" == second && "<" == first)) {
                                sOperator += second;
                                nIndex = 2;
                            }
                        }
                        switch (sOperator) {
                        case "=":
                            this.operator = NumComporationOperators.equal;
                            break;
                        case ">":
                            this.operator = NumComporationOperators.greater;
                            break;
                        case "<":
                            this.operator = NumComporationOperators.less;
                            break;
                        case ">=":
                            this.operator = NumComporationOperators.greaterorequal;
                            break;
                        case "<=":
                            this.operator = NumComporationOperators.lessorequal;
                            break;
                        case "<>":
                            this.operator = NumComporationOperators.notequal;
                            break;
                        }
                        this.operatorValue = parseInt(data.substring(nIndex));
                    } else {
                        var sLowerColor = data.toLowerCase();
                        if ("black" == sLowerColor) {
                            this.color = 0;
                        } else {
                            if ("blue" == sLowerColor) {
                                this.color = 255;
                            } else {
                                if ("cyan" == sLowerColor) {
                                    this.color = 65535;
                                } else {
                                    if ("green" == sLowerColor) {
                                        this.color = 65280;
                                    } else {
                                        if ("magenta" == sLowerColor) {
                                            this.color = 16711935;
                                        } else {
                                            if ("red" == sLowerColor) {
                                                this.color = 16711680;
                                            } else {
                                                if ("white" == sLowerColor) {
                                                    this.color = 16777215;
                                                } else {
                                                    if ("yellow" == sLowerColor) {
                                                        this.color = 16776960;
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
        }
    };
    this.parse(sData);
}
function NumFormat(bAddMinusIfNes) {
    this.formatString = "";
    this.length = this.formatString.length;
    this.index = 0;
    this.EOF = -1;
    this.aRawFormat = new Array();
    this.aDecFormat = new Array();
    this.aFracFormat = new Array();
    this.bDateTime = false;
    this.bDate = false;
    this.bTime = false;
    this.nPercent = 0;
    this.bScientific = false;
    this.bThousandSep = false;
    this.nThousandScale = 0;
    this.bTextFormat = false;
    this.bTimePeriod = false;
    this.bMillisec = false;
    this.bSlash = false;
    this.bWhole = false;
    this.bCurrency = false;
    this.bNumber = false;
    this.bInteger = false;
    this.Color = -1;
    this.ComporationOperator = null;
    this.bGeneral = false;
    this.bAddMinusIfNes = bAddMinusIfNes;
}
NumFormat.prototype = {
    _getChar: function () {
        if (this.index < this.length) {
            return this.formatString[this.index];
        }
        return this.EOF;
    },
    _readChar: function () {
        var curChar = this._getChar();
        if (this.index < this.length) {
            this.index++;
        }
        return curChar;
    },
    _skip: function (val) {
        var nNewIndex = this.index + val;
        if (nNewIndex >= 0 && nNewIndex < this.length) {
            this.index = nNewIndex;
        }
    },
    _addToFormat: function (type, val) {
        var oFormatObj = new FormatObj(type, val);
        this.aRawFormat.push(oFormatObj);
    },
    _addToFormat2: function (oFormatObj) {
        this.aRawFormat.push(oFormatObj);
    },
    _ReadText: function () {
        var sText = "";
        while (true) {
            var next = this._readChar();
            if (this.EOF == next || '"' == next) {
                break;
            } else {
                sText += next;
            }
        }
        this._addToFormat(numFormat_Text, sText);
    },
    _ReadChar: function () {
        var next = this._readChar();
        if (this.EOF != next) {
            this._addToFormat(numFormat_Text, next);
        }
    },
    _ReadBracket: function () {
        var sBracket = "";
        while (true) {
            var next = this._readChar();
            if (this.EOF == next || "]" == next) {
                break;
            } else {
                sBracket += next;
            }
        }
        var oFormatObjBracket = new FormatObjBracket(sBracket);
        if (null != oFormatObjBracket.operator) {
            this.ComporationOperator = oFormatObjBracket;
        }
        this._addToFormat2(oFormatObjBracket);
    },
    _ReadAmPm: function (next) {
        var sAm = next;
        var sPm = "";
        var bAm = true;
        while (true) {
            next = this._readChar();
            if (this.EOF == next) {
                break;
            } else {
                if ("/" == next) {
                    bAm = false;
                } else {
                    if ("A" == next || "a" == next || "P" == next || "p" == next || "M" == next || "m" == next) {
                        if (true == bAm) {
                            sAm += next;
                        } else {
                            sPm += next;
                        }
                    } else {
                        this._skip(-1);
                        break;
                    }
                }
            }
        }
        if ("" != sAm && "" != sPm) {
            this._addToFormat2(new FormatObjDateAmPm(sAm, sPm));
            this.bTimePeriod = true;
            this.bDateTime = true;
        }
    },
    _parseFormat: function (format) {
        while (true) {
            var next = this._readChar();
            if (this.EOF == next) {
                break;
            } else {
                if ("[" == next) {
                    this._ReadBracket();
                } else {
                    if ('"' == next) {
                        this._ReadText();
                    } else {
                        if ("\\" == next) {
                            this._ReadChar();
                        } else {
                            if ("%" == next) {
                                this._addToFormat(numFormat_Percent);
                            } else {
                                if ("$" == next || "+" == next || "-" == next || "(" == next || ")" == next || " " == next || ":" == next) {
                                    this._addToFormat(numFormat_Text, next);
                                } else {
                                    if (0 <= next && next <= 9) {
                                        this._addToFormat(numFormat_Digit, next - 0);
                                    } else {
                                        if ("#" == next) {
                                            this._addToFormat(numFormat_DigitNoDisp);
                                        } else {
                                            if ("?" == next) {
                                                this._addToFormat(numFormat_DigitSpace);
                                            } else {
                                                if ("." == next) {
                                                    this._addToFormat(numFormat_DecimalPoint);
                                                } else {
                                                    if ("/" == next) {
                                                        this._addToFormat2(new FormatObjDecimalFrac(new Array(), new Array()));
                                                    } else {
                                                        if ("," == next) {
                                                            this._addToFormat(numFormat_Thousand, 1);
                                                        } else {
                                                            if ("E" == next || "e" == next) {
                                                                var nextnext = this._readChar();
                                                                if (this.EOF != nextnext && "+" == nextnext || "-" == nextnext) {
                                                                    var sign = ("+" == nextnext) ? SignType.Positive : SignType.Negative;
                                                                    this._addToFormat2(new FormatObjScientific(next, "", sign));
                                                                }
                                                            } else {
                                                                if ("*" == next) {
                                                                    var nextnext = this._readChar();
                                                                    if (this.EOF != nextnext) {
                                                                        this._addToFormat(numFormat_Repeat, nextnext);
                                                                    }
                                                                } else {
                                                                    if ("_" == next) {
                                                                        var nextnext = this._readChar();
                                                                        if (this.EOF != nextnext) {
                                                                            this._addToFormat(numFormat_Skip, nextnext);
                                                                        }
                                                                    } else {
                                                                        if ("@" == next) {
                                                                            this._addToFormat(numFormat_TextPlaceholder);
                                                                        } else {
                                                                            if ("Y" == next || "y" == next) {
                                                                                this._addToFormat2(new FormatObjDateVal(numFormat_Year, 1, false));
                                                                            } else {
                                                                                if ("M" == next || "m" == next) {
                                                                                    this._addToFormat2(new FormatObjDateVal(numFormat_MonthMinute, 1, false));
                                                                                } else {
                                                                                    if ("D" == next || "d" == next) {
                                                                                        this._addToFormat2(new FormatObjDateVal(numFormat_Day, 1, false));
                                                                                    } else {
                                                                                        if ("H" == next || "h" == next) {
                                                                                            this._addToFormat2(new FormatObjDateVal(numFormat_Hour, 1, false));
                                                                                        } else {
                                                                                            if ("S" == next || "s" == next) {
                                                                                                this._addToFormat2(new FormatObjDateVal(numFormat_Second, 1, false));
                                                                                            } else {
                                                                                                if ("A" == next || "a" == next) {
                                                                                                    this._ReadAmPm(next);
                                                                                                } else {
                                                                                                    this._addToFormat(numFormat_Text, next);
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
        }
        return true;
    },
    _getDateTimeBracket: function (val) {
        var res = null;
        var length = val.length;
        if (length > 0) {
            var first = val[0];
            if ("y" == first || "m" == first || "d" == first || "h" == first || "s" == first) {
                var bSame = true;
                var nCount = 1;
                for (var i = 1; i < length; ++i) {
                    if (first != val[i]) {
                        bSame = false;
                        break;
                    }
                    nCount++;
                }
                if (true == bSame) {
                    switch (first) {
                    case "y":
                        res = new FormatObjDateVal(numFormat_Year, nCount, true);
                        break;
                    case "m":
                        res = new FormatObjDateVal(numFormat_MonthMinute, nCount, true);
                        break;
                    case "d":
                        res = new FormatObjDateVal(numFormat_Day, nCount, true);
                        break;
                    case "h":
                        res = new FormatObjDateVal(numFormat_Hour, nCount, true);
                        break;
                    case "s":
                        res = new FormatObjDateVal(numFormat_Second, nCount, true);
                        break;
                    }
                }
            }
        }
        return res;
    },
    _prepareFormat: function () {
        for (var i = 0, length = this.aRawFormat.length; i < length; ++i) {
            var oCurItem = this.aRawFormat[i];
            if (numFormat_Bracket == oCurItem.type && null != oCurItem.color) {
                this.Color = oCurItem.color;
            }
        }
        var bRepeat = false;
        var nFormatLength = this.aRawFormat.length;
        for (var i = 0; i < nFormatLength; ++i) {
            var item = this.aRawFormat[i];
            if (numFormat_Repeat == item.type) {
                if (false == bRepeat) {
                    bRepeat = true;
                } else {
                    this.aRawFormat.splice(i, 1);
                    nFormatLength--;
                }
            } else {
                if (numFormat_Bracket == item.type) {
                    var oNewObj = item.dataObj;
                    if (null != oNewObj) {
                        this.aRawFormat.splice(i, 1, oNewObj);
                        this.bDateTime = true;
                        if (numFormat_Hour == oNewObj.type || numFormat_Minute == oNewObj.type || numFormat_Second == oNewObj.type || numFormat_Milliseconds == oNewObj.type) {
                            this.bTime = true;
                        } else {
                            if (numFormat_Year == oNewObj.type || numFormat_Month == oNewObj.type || numFormat_Day == oNewObj.type) {
                                this.bDate = true;
                            }
                        }
                    }
                } else {
                    if (numFormat_Year == item.type || numFormat_MonthMinute == item.type || numFormat_Day == item.type || numFormat_Hour == item.type || numFormat_Second == item.type || numFormat_Thousand == item.type) {
                        var nStartType = item.type;
                        var nEndIndex = i;
                        for (var j = i + 1; j < nFormatLength; ++j) {
                            if (nStartType == this.aRawFormat[j].type) {
                                nEndIndex = j;
                            } else {
                                break;
                            }
                        }
                        if (i != nEndIndex) {
                            item.val = nEndIndex - i + 1;
                            var nDelCount = item.val - 1;
                            this.aRawFormat.splice(i + 1, nDelCount);
                            nFormatLength -= nDelCount;
                        }
                        if (numFormat_Thousand != item.type) {
                            this.bDateTime = true;
                            if (numFormat_Hour == item.type || numFormat_Minute == item.type || numFormat_Second == item.type || numFormat_Milliseconds == item.type) {
                                this.bTime = true;
                            } else {
                                if (numFormat_Year == item.type || numFormat_Month == item.type || numFormat_Day == item.type) {
                                    this.bDate = true;
                                }
                            }
                        }
                    } else {
                        if (numFormat_Scientific == item.type) {
                            var bAsText = false;
                            if (true == this.bScientific) {
                                bAsText = true;
                            } else {
                                var aDigitArray = new Array();
                                for (var j = i + 1; j < nFormatLength; ++j) {
                                    var nextItem = this.aRawFormat[j];
                                    if (numFormat_Digit == nextItem.type || numFormat_DigitNoDisp == nextItem.type || numFormat_DigitSpace == nextItem.type) {
                                        aDigitArray.push(nextItem);
                                    }
                                }
                                if (aDigitArray.length > 0) {
                                    item.format = aDigitArray;
                                    this.bScientific = true;
                                } else {
                                    bAsText = true;
                                }
                            }
                            if (false != bAsText) {
                                item.type = numFormat_Text;
                                item.val = item.val + "+";
                            }
                        } else {
                            if (numFormat_DecimalFrac == item.type) {
                                var bValid = false;
                                var nLeft = i;
                                for (var j = i - 1; j >= 0; --j) {
                                    var subitem = this.aRawFormat[j];
                                    if (numFormat_Digit == subitem.type || numFormat_DigitNoDisp == subitem.type || numFormat_DigitSpace == subitem.type) {
                                        nLeft = j;
                                    } else {
                                        break;
                                    }
                                }
                                var nRight = i;
                                if (nLeft < i) {
                                    for (var j = i + 1; j < nFormatLength; ++j) {
                                        var subitem = this.aRawFormat[j];
                                        if (numFormat_Digit == subitem.type || numFormat_DigitNoDisp == subitem.type || numFormat_DigitSpace == subitem.type) {
                                            nRight = j;
                                        } else {
                                            break;
                                        }
                                    }
                                    if (nRight > i) {
                                        bValid = true;
                                        item.aRight = this.aRawFormat.splice(i + 1, nRight - i);
                                        item.aLeft = this.aRawFormat.splice(nLeft, i - nLeft);
                                        nFormatLength -= nRight - nLeft;
                                        i -= i - nLeft;
                                        this.bSlash = true;
                                        var flag = (item.aRight.length > 0) && (item.aRight[0].type == numFormat_Digit) && (item.aRight[0].val > 0);
                                        if (flag) {
                                            var rPart = 0;
                                            for (var j = 0; j < item.aRight.length; j++) {
                                                if (item.aRight[j].type == numFormat_Digit) {
                                                    rPart = rPart * 10 + item.aRight[j].val;
                                                } else {
                                                    bValid = false;
                                                    this.bSlash = false;
                                                    break;
                                                }
                                            }
                                            if (bValid == true) {
                                                item.aRight = [];
                                                item.aRight.push(new FormatObj(numFormat_Digit, rPart));
                                                item.bNumRight = true;
                                            }
                                        }
                                    }
                                }
                                if (false == bValid) {
                                    item.type = numFormat_Text;
                                    item.val = "/";
                                }
                            }
                        }
                    }
                }
            }
        }
        var nReadState = FormatStates.Decimal;
        var bDecimal = true;
        nFormatLength = this.aRawFormat.length;
        for (var i = 0; i < nFormatLength; ++i) {
            var item = this.aRawFormat[i];
            if (numFormat_DecimalPoint == item.type) {
                if (this.bDateTime) {
                    var nStartIndex = i;
                    var nEndIndex = nStartIndex;
                    for (var j = i + 1; j < nFormatLength; ++j) {
                        var subItem = this.aRawFormat[j];
                        if (numFormat_Digit == subItem.type) {
                            nEndIndex = j;
                        } else {
                            break;
                        }
                    }
                    if (nStartIndex < nEndIndex) {
                        var nDigCount = nEndIndex - nStartIndex;
                        var oNewItem = new FormatObjDateVal(numFormat_Milliseconds, nDigCount, false);
                        var nDelCount = nDigCount;
                        oNewItem.format = this.aRawFormat.splice(i + 1, nDelCount, oNewItem);
                        nFormatLength -= (nDigCount - 1);
                        i++;
                        this.bMillisec = true;
                    }
                    item.type = numFormat_Text;
                    item.val = ".";
                } else {
                    if (FormatStates.Decimal == nReadState) {
                        nReadState = FormatStates.Frac;
                    }
                }
            } else {
                if (numFormat_MonthMinute == item.type) {
                    var bRightCond = false;
                    for (var j = i + 1; j < nFormatLength; ++j) {
                        var subItem = this.aRawFormat[j];
                        if (numFormat_Year == subItem.type || numFormat_Month == subItem.type || numFormat_Day == subItem.type || numFormat_MonthMinute == subItem.type || numFormat_Hour == subItem.type || numFormat_Minute == subItem.type || numFormat_Second == subItem.type || numFormat_Milliseconds == subItem.type) {
                            if (numFormat_Second == subItem.type) {
                                bRightCond = true;
                            }
                            break;
                        }
                    }
                    var bLeftCond = false;
                    if (false == bRightCond) {
                        var bFindSec = false;
                        for (var j = i - 1; j >= 0; --j) {
                            var subItem = this.aRawFormat[j];
                            if (numFormat_Hour == subItem.type) {
                                bLeftCond = true;
                                break;
                            } else {
                                if (numFormat_Second == subItem.type) {
                                    bFindSec = true;
                                } else {
                                    if (numFormat_Minute == subItem.type || numFormat_Month == subItem.type || numFormat_MonthMinute == subItem.type) {
                                        if (true == bFindSec && numFormat_Minute == subItem.type) {
                                            bFindSec = false;
                                        }
                                        break;
                                    } else {
                                        if (numFormat_Year == subItem.type || numFormat_Day == subItem.type || numFormat_Hour == subItem.type || numFormat_Second == subItem.type || numFormat_Milliseconds == subItem.type) {
                                            if (true == bFindSec) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (true == bFindSec) {
                            bLeftCond = true;
                        }
                    }
                    if (true == bLeftCond || true == bRightCond) {
                        item.type = numFormat_Minute;
                        this.bTime = true;
                    } else {
                        item.type = numFormat_Month;
                        this.bDate = true;
                    }
                } else {
                    if (numFormat_Percent == item.type) {
                        this.nPercent++;
                        item.type = numFormat_Text;
                        item.val = "%";
                    } else {
                        if (numFormat_Thousand == item.type) {
                            if (FormatStates.Decimal == nReadState) {
                                var bStartCondition = false;
                                if (i > 0) {
                                    var prevItem = this.aRawFormat[i - 1];
                                    if (numFormat_Digit == prevItem.type || numFormat_DigitNoDisp == prevItem.type || numFormat_DigitSpace == prevItem.type) {
                                        bStartCondition = true;
                                    }
                                }
                                var bEndCondition = false;
                                if (i + 1 < nFormatLength) {
                                    var nextItem = this.aRawFormat[i + 1];
                                    if (numFormat_Digit == nextItem.type || numFormat_DigitNoDisp == nextItem.type || numFormat_DigitSpace == nextItem.type) {
                                        bEndCondition = true;
                                    }
                                }
                                if (true == bStartCondition && true == bEndCondition) {
                                    this.bThousandSep = true;
                                } else {
                                    if (bEndCondition == true) {
                                        item.type = numFormat_Text;
                                        item.val = ",";
                                    }
                                }
                            }
                            var bStartCondition = false;
                            if (i > 0) {
                                var prevItem = this.aRawFormat[i - 1];
                                if (numFormat_Digit == prevItem.type || numFormat_DigitNoDisp == prevItem.type || numFormat_DigitSpace == prevItem.type) {
                                    bStartCondition = true;
                                }
                            }
                            var bEndCondition = true;
                            for (var j = i + 1; j < nFormatLength; ++j) {
                                var nextItem = this.aRawFormat[j];
                                if (numFormat_Digit == nextItem.type || numFormat_DigitNoDisp == nextItem.type || numFormat_DigitSpace == nextItem.type || numFormat_DecimalPoint == nextItem.type) {
                                    bEndCondition = false;
                                    break;
                                }
                            }
                            if (true == bStartCondition && true == bEndCondition) {
                                this.nThousandScale = item.val;
                            }
                        } else {
                            if (numFormat_Digit == item.type || numFormat_DigitNoDisp == item.type || numFormat_DigitSpace == item.type) {
                                if (FormatStates.Decimal == nReadState) {
                                    this.aDecFormat.push(item);
                                    if (this.bSlash === true) {
                                        this.bWhole = true;
                                    }
                                } else {
                                    if (FormatStates.Frac == nReadState) {
                                        this.aFracFormat.push(item);
                                    }
                                }
                            } else {
                                if (numFormat_Scientific == item.type) {
                                    nReadState = FormatStates.Scientific;
                                } else {
                                    if (numFormat_TextPlaceholder == item.type) {
                                        this.bTextFormat = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    },
    _calsScientific: function (nDecLen, nRealExp) {
        var nKoef = 0;
        if (true == this.bThousandSep) {
            nKoef = 4;
        }
        if (nDecLen > nKoef) {
            nKoef = nDecLen;
        }
        if (nRealExp > 0 && nKoef > 0) {
            var nTemp = nRealExp % nKoef;
            if (0 == nTemp) {
                nTemp = nKoef;
            }
            nKoef = nTemp;
        }
        return nKoef;
    },
    _parseNumber: function (number, aDecFormat, nFracLen, nValType) {
        var res = {
            bDigit: false,
            dec: 0,
            frac: 0,
            exponent: 0,
            exponentFrac: 0,
            scientific: 0,
            sign: SignType.Positive,
            date: new Object()
        };
        if (CellValueType.String != nValType) {
            res.bDigit = (number == number - 0);
        }
        if (res.bDigit) {
            var parts = getNumberParts(number);
            res.sign = parts.sign;
            var nRealExp = gc_nMaxDigCount + parts.exponent;
            if (SignType.Null != parts.sign) {
                if (true == this.bScientific) {
                    var nKoef = this._calsScientific(aDecFormat.length, nRealExp);
                    res.scientific = nRealExp - nKoef;
                    nRealExp = nKoef;
                } else {
                    for (var i = 0; i < this.nPercent; ++i) {
                        nRealExp += 2;
                    }
                    for (var i = 0; i < this.nThousandScale; ++i) {
                        nRealExp -= 3;
                    }
                }
                if (false == this.bSlash) {
                    var nOldRealExp = nRealExp;
                    var dTemp = parts.mantissa * Math.pow(10, nFracLen + nRealExp - gc_nMaxDigCount);
                    dTemp = Math.round(dTemp);
                    dTemp /= Math.pow(10, nFracLen);
                    parts = getNumberParts(dTemp);
                    if (SignType.Null != parts.sign) {
                        nRealExp = gc_nMaxDigCount + parts.exponent;
                        if (nOldRealExp != nRealExp && true == this.bScientific) {
                            var nKoef = this._calsScientific(aDecFormat.length, nRealExp);
                            res.scientific += nRealExp - nOldRealExp;
                            nRealExp = nKoef;
                        }
                    }
                }
                res.exponent = nRealExp;
                res.exponentFrac = nRealExp;
                if (nRealExp > 0 && nRealExp < gc_nMaxDigCount) {
                    var sNumber = parts.mantissa.toString();
                    var nExponentFrac = 0;
                    for (var i = nRealExp, length = sNumber.length; i < length; ++i) {
                        if ("0" == sNumber[i]) {
                            nExponentFrac++;
                        } else {
                            break;
                        }
                    }
                    if (nRealExp + nExponentFrac < sNumber.length) {
                        res.exponentFrac = -nExponentFrac;
                    }
                }
                if (SignType.Null != parts.sign) {
                    if (nRealExp <= 0) {
                        if (this.bSlash == true) {
                            res.dec = 0;
                            res.frac = parts.mantissa;
                        } else {
                            if (nFracLen > 0) {
                                res.dec = 0;
                                res.frac = 0;
                                if (nFracLen + nRealExp > 0) {
                                    var sTemp = parts.mantissa.toString();
                                    res.frac = sTemp.substring(0, nFracLen + nRealExp) - 0;
                                }
                            } else {
                                res.dec = 0;
                                res.frac = 0;
                            }
                        }
                    } else {
                        if (nRealExp >= gc_nMaxDigCount) {
                            res.dec = parts.mantissa;
                            res.frac = 0;
                        } else {
                            var sTemp = parts.mantissa.toString();
                            if (this.bSlash == true) {
                                res.dec = sTemp.substring(0, nRealExp) - 0;
                                if (nRealExp < sTemp.length) {
                                    res.frac = sTemp.substring(nRealExp) - 0;
                                } else {
                                    res.frac = 0;
                                }
                            } else {
                                if (nFracLen > 0) {
                                    res.dec = sTemp.substring(0, nRealExp) - 0;
                                    res.frac = 0;
                                    var nStart = nRealExp;
                                    var nEnd = nRealExp + nFracLen;
                                    if (nStart < sTemp.length) {
                                        res.frac = sTemp.substring(nStart, nEnd) - 0;
                                    }
                                } else {
                                    res.dec = sTemp.substring(0, nRealExp) - 0;
                                    res.frac = 0;
                                }
                            }
                        }
                    }
                }
                if (0 == res.frac && 0 == res.dec) {
                    res.sign = SignType.Null;
                }
            }
            if (this.bDateTime === true) {
                res.date = this.parseDate(number);
            }
        }
        return res;
    },
    parseDate: function (number) {
        var d = {
            val: 0,
            coeff: 1
        },
        h = {
            val: 0,
            coeff: 24
        },
        min = {
            val: 0,
            coeff: 60
        },
        s = {
            val: 0,
            coeff: 60
        },
        ms = {
            val: 0,
            coeff: 1000
        };
        var tmp = +number;
        var ttimes = [d, h, min, s, ms];
        for (var i = 0; i < 4; i++) {
            var v = tmp * ttimes[i].coeff;
            ttimes[i].val = Math.floor(v);
            tmp = v - ttimes[i].val;
        }
        ms.val = Math.round(tmp * 1000);
        for (i = 4; i > 0 && (ttimes[i].val === ttimes[i].coeff); i--) {
            ttimes[i].val = 0;
            ttimes[i - 1].val++;
        }
        var stDate, day, month, year, dayWeek;
        if (g_bDate1904) {
            stDate = new Date(Date.UTC(1904, 0, 1, 0, 0, 0));
            if (d.val) {
                stDate.setUTCDate(stDate.getUTCDate() + d.val);
            }
            day = stDate.getUTCDate();
            dayWeek = (stDate.getUTCDay() > 0) ? stDate.getUTCDay() - 1 : 6;
            month = stDate.getUTCMonth();
            year = stDate.getUTCFullYear();
        } else {
            if (number === 60) {
                day = 29;
                month = 1;
                year = 1900;
                dayWeek = 3;
            } else {
                if (number < 60) {
                    stDate = new Date(Date.UTC(1899, 11, 31, 0, 0, 0));
                    if (d.val) {
                        stDate.setUTCDate(stDate.getUTCDate() + d.val);
                    }
                    day = stDate.getUTCDate();
                    dayWeek = (stDate.getUTCDay() > 0) ? stDate.getUTCDay() - 1 : 6;
                    month = stDate.getUTCMonth();
                    year = stDate.getUTCFullYear();
                } else {
                    stDate = new Date(Date.UTC(1899, 11, 30, 0, 0, 0));
                    if (d.val) {
                        stDate.setUTCDate(stDate.getUTCDate() + d.val);
                    }
                    day = stDate.getUTCDate();
                    dayWeek = stDate.getUTCDay();
                    month = stDate.getUTCMonth();
                    year = stDate.getUTCFullYear();
                }
            }
        }
        return {
            d: day,
            month: month,
            year: year,
            dayWeek: dayWeek,
            hour: h.val,
            min: min.val,
            sec: s.val,
            ms: ms.val,
            countDay: d.val
        };
    },
    _FormatNumber: function (number, exponent, format, nReadState) {
        var aRes = new Array();
        var aNoDisplay = new Array();
        var nFormatLen = format.length;
        if (nFormatLen > 0) {
            if (FormatStates.Frac != nReadState) {
                var sNumber = number + "";
                var nNumberLen = sNumber.length;
                if (exponent > nNumberLen) {
                    for (var i = 0; i < exponent - nNumberLen; ++i) {
                        sNumber += "0";
                    }
                    nNumberLen = sNumber.length;
                }
                var bIsNUll = false;
                if ("0" == sNumber) {
                    bIsNUll = true;
                }
                if (nNumberLen > nFormatLen) {
                    if (false == bIsNUll) {
                        var nSplitIndex = nNumberLen - nFormatLen + 1;
                        aRes.push(new FormatObj(numFormat_Text, sNumber.slice(0, nSplitIndex)));
                        sNumber = sNumber.substring(nSplitIndex);
                        format.shift();
                    }
                } else {
                    if (nNumberLen < nFormatLen) {
                        for (var i = 0, length = nFormatLen - nNumberLen; i < length; ++i) {
                            var item = format.shift();
                            aRes.push(new FormatObj(item.type));
                        }
                    }
                }
                var bFirstNotNull = false;
                for (var i = 0, length = sNumber.length; i < length; ++i) {
                    var sCurNumber = sNumber[i];
                    var item = format.shift();
                    if (true == bIsNUll && null != item && numFormat_DigitNoDisp == item.type && FormatStates.Scientific != nReadState) {
                        sCurNumber = "";
                    }
                    aRes.push(new FormatObj(numFormat_Text, sCurNumber));
                }
                if (true == this.bThousandSep && FormatStates.Slash != nReadState) {
                    var nIndex = 0;
                    for (var i = aRes.length - 1; i >= 0; --i) {
                        var item = aRes[i];
                        if (numFormat_Text == item.type) {
                            var aNewText = new Array();
                            var nTextLength = item.val.length;
                            for (var j = nTextLength - 1; j >= 0; --j) {
                                if (3 == nIndex) {
                                    aNewText.push(",");
                                    nTextLength++;
                                }
                                aNewText.push(item.val[j]);
                                if (0 != j) {
                                    nIndex++;
                                    if (4 == nIndex) {
                                        nIndex = 1;
                                    }
                                }
                            }
                            if (nTextLength > 1) {
                                aNewText.reverse();
                            }
                            item.val = aNewText.join("");
                        } else {
                            if (numFormat_DigitNoDisp != item.type) {
                                if (3 == nIndex) {
                                    item.val = ",";
                                    aRes[i] = item;
                                }
                            }
                        }
                        nIndex++;
                        if (4 == nIndex) {
                            nIndex = 1;
                        }
                    }
                }
            } else {
                var val = number;
                var exp = exponent;
                var nStartNulls = 0;
                if (exp < 0) {
                    nStartNulls = Math.abs(exp);
                }
                var sNumber = val.toString();
                var nNumberLen = sNumber.length;
                var nLastNoNull = nNumberLen;
                for (var i = nNumberLen - 1; i >= 0; --i) {
                    if ("0" != sNumber[i]) {
                        break;
                    }
                    nLastNoNull = i;
                }
                if (nLastNoNull < nNumberLen) {
                    sNumber = sNumber.substring(0, nLastNoNull);
                    nNumberLen = sNumber.length;
                }
                for (var i = 0; i < nStartNulls; ++i) {
                    aRes.push(new FormatObj(numFormat_Text, "0"));
                }
                for (var i = 0, length = nNumberLen; i < length; ++i) {
                    aRes.push(new FormatObj(numFormat_Text, sNumber[i]));
                }
                for (var i = nNumberLen + nStartNulls; i < nFormatLen; ++i) {
                    var item = format[i];
                    aRes.push(new FormatObj(item.type));
                }
            }
        }
        return aRes;
    },
    _AddDigItem: function (res, oCurText, item) {
        if (numFormat_Text == item.type) {
            oCurText.text += item.val;
        } else {
            if (numFormat_Digit == item.type) {
                oCurText.text += "0";
                if (null != item.val) {
                    oCurText.text += item.val;
                }
            } else {
                if (numFormat_DigitNoDisp == item.type) {
                    oCurText.text += "";
                    if (null != item.val) {
                        oCurText.text += item.val;
                    }
                } else {
                    if (numFormat_DigitSpace == item.type) {
                        var oNewFont = new Font();
                        oNewFont.clean();
                        oNewFont.skip = true;
                        this._CommitText(res, oCurText, "0", oNewFont);
                        if (null != item.val) {
                            oCurText.text += item.val;
                        }
                    }
                }
            }
        }
    },
    _ZeroPad: function (n) {
        return (n < 10) ? "0" + n : n;
    },
    _CommitText: function (res, oCurText, textVal, format) {
        if (null != oCurText && oCurText.text.length > 0) {
            this._CommitText(res, null, oCurText.text, null);
            oCurText.text = "";
        }
        if (null != textVal && textVal.length > 0) {
            var length = res.length;
            var prev = null;
            if (length > 0) {
                prev = res[length - 1];
            }
            if (-1 != this.Color) {
                if (null == format) {
                    format = new Font();
                    format.clean();
                }
                format.c = new RgbColor(this.Color);
            }
            if (null != prev && ((null == prev.format && null == format) || (null != prev.format && null != format && format.isEqual(prev.format)))) {
                prev.text += textVal;
            } else {
                if (null == format) {
                    prev = {
                        text: textVal
                    };
                } else {
                    prev = {
                        text: textVal,
                        format: format
                    };
                }
                res.push(prev);
            }
        }
    },
    setFormat: function (format) {
        this.formatString = format;
        this.length = this.formatString.length;
        if ("general" == this.formatString.toLowerCase()) {
            this.valid = true;
            this.bGeneral = true;
            return true;
        } else {
            this.valid = this._parseFormat();
            if (true == this.valid) {
                this.valid = this._prepareFormat();
                if (this.valid) {
                    var aCurrencySymbols = ["$", "€", "£", "¥", "р."];
                    var sText = "";
                    for (var i = 0, length = this.aRawFormat.length; i < length; ++i) {
                        var item = this.aRawFormat[i];
                        if (numFormat_Text == item.type) {
                            sText += item.val;
                        } else {
                            if (numFormat_Bracket == item.type) {
                                if (null != item.CurrencyString) {
                                    sText += item.CurrencyString;
                                }
                            } else {
                                if (numFormat_DecimalPoint == item.type) {
                                    sText += ".";
                                }
                            }
                        }
                    }
                    if ("" != sText) {
                        for (var i = 0, length = aCurrencySymbols.length; i < length; ++i) {
                            if (-1 != sText.indexOf(aCurrencySymbols[i])) {
                                this.bCurrency = true;
                                break;
                            }
                        }
                    }
                    var rxNumber = new RegExp("^[0#?]+(.[0#?]+)?$");
                    var match = this.formatString.match(rxNumber);
                    if (null != match) {
                        if (null != match[1]) {
                            this.bNumber = true;
                        } else {
                            this.bInteger = true;
                        }
                    }
                }
            }
            return this.valid;
        }
    },
    isInvalidDateValue: function (number) {
        return (number == number - 0) && ((number < 0 && false == g_bDate1904) || number > 2958465.9999884);
    },
    format: function (number, nValType, dDigitsCount, oAdditionalResult) {
        if (null == nValType) {
            nValType = CellValueType.Number;
        }
        var res = new Array();
        var oCurText = {
            text: ""
        };
        if (true == this.valid) {
            if (true === this.bDateTime) {
                if (this.isInvalidDateValue(number)) {
                    var oNewFont = new Font();
                    oNewFont.clean();
                    oNewFont.repeat = true;
                    this._CommitText(res, null, "#", oNewFont);
                    return res;
                }
            }
            var oParsedNumber = this._parseNumber(number, this.aDecFormat, this.aFracFormat.length, nValType);
            if (true == this.bGeneral || (true == oParsedNumber.bDigit && true == this.bTextFormat) || (false == oParsedNumber.bDigit && false == this.bTextFormat)) {
                if (null != oAdditionalResult) {
                    oAdditionalResult.bGeneral = true;
                }
                var sGeneral = DecodeGeneralFormat(number, nValType, dDigitsCount);
                if (null != sGeneral) {
                    numFormat = oNumFormatCache.get(sGeneral);
                    if (null != numFormat) {
                        return numFormat.format(number, nValType, dDigitsCount, oAdditionalResult);
                    }
                }
                return [{
                    text: number
                }];
            }
            var aDec = new Array();
            var aFrac = new Array();
            var aScientific = new Array();
            if (true == oParsedNumber.bDigit) {
                aDec = this._FormatNumber(oParsedNumber.dec, oParsedNumber.exponent, this.aDecFormat.concat(), FormatStates.Decimal);
                aFrac = this._FormatNumber(oParsedNumber.frac, oParsedNumber.exponentFrac, this.aFracFormat.concat(), FormatStates.Frac);
            }
            if (true == this.bAddMinusIfNes && SignType.Negative == oParsedNumber.sign) {
                oCurText.text += "-";
            }
            var bNoDecFormat = false;
            if (null == aDec || 0 == aDec.length && 0 != oParsedNumber.dec) {
                bNoDecFormat = true;
            }
            var nReadState = FormatStates.Decimal;
            var nFormatLength = this.aRawFormat.length;
            for (var i = 0; i < nFormatLength; ++i) {
                var item = this.aRawFormat[i];
                if (numFormat_Bracket == item.type) {
                    if (null != item.CurrencyString) {
                        oCurText.text += item.CurrencyString;
                    }
                } else {
                    if (numFormat_DecimalPoint == item.type) {
                        if (bNoDecFormat && null != oParsedNumber.dec && FormatStates.Decimal == nReadState) {
                            oCurText.text += oParsedNumber.dec;
                        }
                        oCurText.text += ".";
                        nReadState = FormatStates.Frac;
                    } else {
                        if (numFormat_Digit == item.type || numFormat_DigitNoDisp == item.type || numFormat_DigitSpace == item.type) {
                            var text = null;
                            if (nReadState == FormatStates.Decimal) {
                                text = aDec.shift();
                            } else {
                                if (nReadState == FormatStates.Frac) {
                                    text = aFrac.shift();
                                } else {
                                    if (nReadState == FormatStates.Scientific) {
                                        text = aScientific.shift();
                                    }
                                }
                            }
                            if (null != text) {
                                this._AddDigItem(res, oCurText, text);
                            }
                        } else {
                            if (numFormat_Text == item.type) {
                                oCurText.text += item.val;
                            } else {
                                if (numFormat_TextPlaceholder == item.type) {
                                    oCurText.text += number;
                                } else {
                                    if (numFormat_Scientific == item.type) {
                                        if (null != item.format) {
                                            oCurText.text += item.val;
                                            if (oParsedNumber.scientific < 0) {
                                                oCurText.text += "-";
                                            } else {
                                                if (item.sign == SignType.Positive) {
                                                    oCurText.text += "+";
                                                }
                                            }
                                            aScientific = this._FormatNumber(Math.abs(oParsedNumber.scientific), 0, item.format.concat(), FormatStates.Scientific);
                                            nReadState = FormatStates.Scientific;
                                        }
                                    } else {
                                        if (numFormat_DecimalFrac == item.type) {
                                            if (oParsedNumber.frac !== 0 || this.bWhole === false) {
                                                var frac = oParsedNumber.frac;
                                                var fracExp = -frac.toString().length;
                                                if (oParsedNumber.exponent < 0) {
                                                    fracExp -= oParsedNumber.exponent;
                                                }
                                                frac *= Math.pow(10, fracExp);
                                                var numerator;
                                                var denominator;
                                                if (item.bNumRight === true) {
                                                    denominator = item.aRight[0].val;
                                                    numerator = Math.round(denominator * frac);
                                                    if (this.bWhole === false) {
                                                        numerator += denominator * oParsedNumber.dec;
                                                    }
                                                } else {
                                                    if (frac == 0) {
                                                        numerator = oParsedNumber.dec;
                                                        denominator = 1;
                                                    } else {
                                                        var d = n = frac;
                                                        var a0 = 0,
                                                        a1 = 1;
                                                        var b0 = 1,
                                                        b1 = 0;
                                                        var eps = Math.pow(10, -15),
                                                        arr = Math.pow(10, item.aRight.length),
                                                        delta = 1,
                                                        a = 0,
                                                        b = 0;
                                                        while ((b < arr) && (delta > eps)) {
                                                            N = Math.floor(d);
                                                            a = N * a1 + a0;
                                                            b = N * b1 + b0;
                                                            a0 = a1;
                                                            a1 = a;
                                                            b0 = b1;
                                                            b1 = b;
                                                            d = 1 / (d - N);
                                                            delta = Math.abs(n - a / b);
                                                        }
                                                        if (b > arr || b == arr) {
                                                            numerator = a0;
                                                            denominator = b0;
                                                        } else {
                                                            numerator = a;
                                                            denominator = b;
                                                        }
                                                        if (this.bWhole === false) {
                                                            numerator += denominator * oParsedNumber.dec;
                                                        }
                                                    }
                                                }
                                                var aLeft = this._FormatNumber(numerator, 0, item.aLeft.concat(), FormatStates.Slash);
                                                for (var j = 0, length = aLeft.length; j < length; ++j) {
                                                    var subitem = aLeft[j];
                                                    if (numFormat_Text == subitem.type) {
                                                        oCurText.text += subitem.val;
                                                    } else {
                                                        this._AddDigItem(res, oCurText, subitem);
                                                    }
                                                }
                                                oCurText.text += "/";
                                                if (item.bNumRight === true) {
                                                    oCurText.text += item.aRight[0].val;
                                                } else {
                                                    var aRight = this._FormatNumber(denominator, 0, item.aRight.concat(), FormatStates.Slash);
                                                    for (var j = 0, length = aRight.length; j < length; ++j) {
                                                        var subitem = aRight[j];
                                                        if (numFormat_Text == subitem.type) {
                                                            oCurText.text += subitem.val;
                                                        } else {
                                                            this._AddDigItem(res, oCurText, subitem);
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if (numFormat_Repeat == item.type) {
                                                var oNewFont = new Font();
                                                oNewFont.clean();
                                                oNewFont.repeat = true;
                                                this._CommitText(res, oCurText, item.val, oNewFont);
                                            } else {
                                                if (numFormat_Skip == item.type) {
                                                    var oNewFont = new Font();
                                                    oNewFont.clean();
                                                    oNewFont.skip = true;
                                                    this._CommitText(res, oCurText, item.val, oNewFont);
                                                } else {
                                                    if (numFormat_Year == item.type) {
                                                        if (item.val == 2) {
                                                            oCurText.text += (oParsedNumber.date.year + "").substring(2);
                                                        } else {
                                                            if (item.val == 4) {
                                                                oCurText.text += oParsedNumber.date.year;
                                                            }
                                                        }
                                                    } else {
                                                        if (numFormat_Month == item.type) {
                                                            var m = oParsedNumber.date.month;
                                                            if (item.val == 1) {
                                                                oCurText.text += m + 1;
                                                            } else {
                                                                if (item.val == 2) {
                                                                    oCurText.text += this._ZeroPad(m + 1);
                                                                } else {
                                                                    if (item.val == 3) {
                                                                        oCurText.text += monthCut[m];
                                                                    } else {
                                                                        if (item.val == 4) {
                                                                            oCurText.text += month[m];
                                                                        } else {
                                                                            if (item.val == 5) {
                                                                                oCurText.text += monthShort[m];
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            if (numFormat_Day == item.type) {
                                                                if (item.val == 1) {
                                                                    oCurText.text += oParsedNumber.date.d;
                                                                } else {
                                                                    if (item.val == 2) {
                                                                        oCurText.text += this._ZeroPad(oParsedNumber.date.d);
                                                                    } else {
                                                                        if (item.val == 3) {
                                                                            oCurText.text += dayShort[oParsedNumber.date.dayWeek];
                                                                        } else {
                                                                            if (item.val == 4) {
                                                                                oCurText.text += day[oParsedNumber.date.dayWeek];
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if (numFormat_Hour == item.type) {
                                                                    var h = oParsedNumber.date.hour;
                                                                    if (item.bElapsed === true) {
                                                                        h = oParsedNumber.date.countDay * 24 + oParsedNumber.date.hour;
                                                                    }
                                                                    if (this.bTimePeriod === true) {
                                                                        h = h % 12 || 12;
                                                                    }
                                                                    if (item.val == 1) {
                                                                        oCurText.text += h;
                                                                    } else {
                                                                        if (item.val == 2) {
                                                                            oCurText.text += this._ZeroPad(h);
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (numFormat_Minute == item.type) {
                                                                        var min = oParsedNumber.date.min;
                                                                        if (item.bElapsed === true) {
                                                                            min = oParsedNumber.date.countDay * 24 * 60 + oParsedNumber.date.hour * 60 + oParsedNumber.date.min;
                                                                        }
                                                                        if (item.val == 1) {
                                                                            oCurText.text += min;
                                                                        } else {
                                                                            if (item.val == 2) {
                                                                                oCurText.text += this._ZeroPad(min);
                                                                            }
                                                                        }
                                                                    } else {
                                                                        if (numFormat_Second == item.type) {
                                                                            var s = oParsedNumber.date.sec;
                                                                            if (this.bMillisec === false) {
                                                                                s = oParsedNumber.date.sec + Math.round(oParsedNumber.date.ms / 1000);
                                                                            }
                                                                            if (item.bElapsed === true) {
                                                                                s = oParsedNumber.date.countDay * 24 * 60 * 60 + oParsedNumber.date.hour * 60 * 60 + oParsedNumber.date.min * 60 + s;
                                                                            }
                                                                            if (item.val == 1) {
                                                                                oCurText.text += s;
                                                                            } else {
                                                                                if (item.val == 2) {
                                                                                    oCurText.text += this._ZeroPad(s);
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if (numFormat_AmPm == item.type) {
                                                                                oCurText.text += (oParsedNumber.date.hour < 12) ? item.sAm : item.sPm;
                                                                            } else {
                                                                                if (numFormat_Milliseconds == item.type) {
                                                                                    var nMsFormatLength = item.format.length;
                                                                                    var dMs = oParsedNumber.date.ms;
                                                                                    if (nMsFormatLength < 3) {
                                                                                        var dTemp = dMs / Math.pow(10, 3 - nMsFormatLength);
                                                                                        dTemp = Math.round(dTemp);
                                                                                        dMs = dTemp * Math.pow(10, 3 - nMsFormatLength);
                                                                                    }
                                                                                    var nExponent = 0;
                                                                                    if (dMs < 10) {
                                                                                        nExponent = -2;
                                                                                    } else {
                                                                                        if (dMs < 100) {
                                                                                            nExponent = -1;
                                                                                        }
                                                                                    }
                                                                                    var aMilSec = this._FormatNumber(dMs, nExponent, item.format.concat(), FormatStates.Frac);
                                                                                    for (var k = 0; k < aMilSec.length; k++) {
                                                                                        this._AddDigItem(res, oCurText, aMilSec[k]);
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
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this._CommitText(res, oCurText, null, null);
            if (0 == res.length) {
                res = [{
                    text: ""
                }];
            }
        } else {
            if (0 == res.length) {
                res = [{
                    text: number
                }];
            }
        }
        return res;
    },
    toString: function (output, nShift) {
        var bRes = true;
        if (this.bDateTime || this.bSlash || this.bTextFormat || (nShift < 0 && 0 == this.aFracFormat.length)) {
            return false;
        }
        var nDecLength = this.aDecFormat.length;
        var nDecIndex = 0;
        var nFracLength = this.aFracFormat.length;
        var nFracIndex = 0;
        var nNewFracLength = nFracLength + nShift;
        if (nNewFracLength < 0) {
            nNewFracLength = 0;
        }
        var nReadState = FormatStates.Decimal;
        var res = "";
        var fFormatToString = function (aFormat) {
            var res = "";
            for (var i = 0, length = aFormat.length; i < length; ++i) {
                var item = aFormat[i];
                if (numFormat_Digit == item.type) {
                    if (null != item.val) {
                        res += item.val;
                    } else {
                        res += "0";
                    }
                } else {
                    if (numFormat_DigitNoDisp == item.type) {
                        res += "#";
                    } else {
                        if (numFormat_DigitSpace == item.type) {
                            res += "?";
                        }
                    }
                }
            }
            return res;
        };
        if (null != this.Color) {
            switch (this.Color) {
            case 0:
                res += "[Black]";
                break;
            case 255:
                res += "[Blue]";
                break;
            case 65535:
                res += "[Cyan]";
                break;
            case 65280:
                res += "[Green]";
                break;
            case 16711935:
                res += "[Magenta]";
                break;
            case 16711680:
                res += "[Red]";
                break;
            case 16777215:
                res += "[White]";
                break;
            case 16776960:
                res += "[Yellow]";
                break;
            }
        }
        if (null != this.ComporationOperator) {
            switch (this.ComporationOperator.operator) {
            case NumComporationOperators.equal:
                res += "[=" + this.ComporationOperator.operatorValue + "]";
                break;
            case NumComporationOperators.greater:
                res += "[>" + this.ComporationOperator.operatorValue + "]";
                break;
            case NumComporationOperators.less:
                res += "[<" + this.ComporationOperator.operatorValue + "]";
                break;
            case NumComporationOperators.greaterorequal:
                res += "[>=" + this.ComporationOperator.operatorValue + "]";
                break;
            case NumComporationOperators.lessorequal:
                res += "[<=" + this.ComporationOperator.operatorValue + "]";
                break;
            case NumComporationOperators.notequal:
                res += "[<>" + this.ComporationOperator.operatorValue + "]";
                break;
            }
        }
        var bAddThousandSep = this.bThousandSep;
        var nThousandScale = this.nThousandScale;
        var nFormatLength = this.aRawFormat.length;
        for (var i = 0; i < nFormatLength; ++i) {
            var item = this.aRawFormat[i];
            if (numFormat_Bracket == item.type) {
                if (null != item.CurrencyString || null != item.Lid) {
                    res += "[$";
                    if (null != item.CurrencyString) {
                        res += item.CurrencyString;
                    }
                    res += "-";
                    if (null != item.Lid) {
                        res += item.Lid;
                    }
                    res += "]";
                }
            } else {
                if (numFormat_DecimalPoint == item.type) {
                    nReadState = FormatStates.Frac;
                    if (0 != nNewFracLength && 0 != nShift) {
                        res += ".";
                    }
                } else {
                    if (numFormat_Thousand == item.type) {
                        for (var j = 0; j < item.val; ++j) {
                            res += ",";
                        }
                    } else {
                        if (numFormat_Digit == item.type || numFormat_DigitNoDisp == item.type || numFormat_DigitSpace == item.type) {
                            if (FormatStates.Decimal == nReadState) {
                                nDecIndex++;
                            } else {
                                nFracIndex++;
                            }
                            if (nReadState == FormatStates.Frac && nFracIndex > nNewFracLength) {} else {
                                var sCurSimbol;
                                if (numFormat_Digit == item.type) {
                                    sCurSimbol = "0";
                                } else {
                                    if (numFormat_DigitNoDisp == item.type) {
                                        sCurSimbol = "#";
                                    } else {
                                        if (numFormat_DigitSpace == item.type) {
                                            sCurSimbol = "?";
                                        }
                                    }
                                }
                                res += sCurSimbol;
                                if (nReadState == FormatStates.Frac && nFracIndex == nFracLength) {
                                    for (var j = 0; j < nShift; ++j) {
                                        res += sCurSimbol;
                                    }
                                }
                            }
                            if (0 == nFracLength && nShift > 0 && FormatStates.Decimal == nReadState && nDecIndex == nDecLength) {
                                res += ".";
                                for (var j = 0; j < nShift; ++j) {
                                    res += "0";
                                }
                            }
                        } else {
                            if (numFormat_Text == item.type) {
                                if ("%" == item.val) {
                                    res += item.val;
                                } else {
                                    res += '"' + item.val + '"';
                                }
                            } else {
                                if (numFormat_TextPlaceholder == item.type) {
                                    res += "@";
                                } else {
                                    if (numFormat_Scientific == item.type) {
                                        nReadState = FormatStates.Scientific;
                                        res += item.val;
                                        if (item.sign == SignType.Positive) {
                                            res += "+";
                                        } else {
                                            res += "-";
                                        }
                                    } else {
                                        if (numFormat_DecimalFrac == item.type) {
                                            res += fFormatToString(item.aLeft);
                                            res += "/";
                                            res += fFormatToString(item.aRight);
                                        } else {
                                            if (numFormat_Repeat == item.type) {
                                                res += "*" + item.val;
                                            } else {
                                                if (numFormat_Skip == item.type) {
                                                    res += "_" + item.val;
                                                } else {
                                                    if (numFormat_Year == item.type) {
                                                        for (var j = 0; j < item.val; ++j) {
                                                            res += "y";
                                                        }
                                                    } else {
                                                        if (numFormat_Month == item.type) {
                                                            for (var j = 0; j < item.val; ++j) {
                                                                res += "m";
                                                            }
                                                        } else {
                                                            if (numFormat_Day == item.type) {
                                                                for (var j = 0; j < item.val; ++j) {
                                                                    res += "d";
                                                                }
                                                            } else {
                                                                if (numFormat_Hour == item.type) {
                                                                    for (var j = 0; j < item.val; ++j) {
                                                                        res += "h";
                                                                    }
                                                                } else {
                                                                    if (numFormat_Minute == item.type) {
                                                                        for (var j = 0; j < item.val; ++j) {
                                                                            res += "m";
                                                                        }
                                                                    } else {
                                                                        if (numFormat_Second == item.type) {
                                                                            for (var j = 0; j < item.val; ++j) {
                                                                                res += "s";
                                                                            }
                                                                        } else {
                                                                            if (numFormat_AmPm == item.type) {
                                                                                res += item.sAm + "/" + item.sPm;
                                                                            } else {
                                                                                if (numFormat_Milliseconds == item.type) {
                                                                                    res += fFormatToString(item.format);
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        output.format = res;
        return true;
    },
    getType: function () {
        var nType = c_oAscNumFormatType.Custom;
        if (this.bGeneral) {
            nType = c_oAscNumFormatType.General;
        } else {
            if (this.bTextFormat) {
                nType = c_oAscNumFormatType.Text;
            } else {
                if (this.bDateTime) {
                    if (this.bDate) {
                        nType = c_oAscNumFormatType.Date;
                    } else {
                        nType = c_oAscNumFormatType.Time;
                    }
                } else {
                    if (this.nPercent > 0) {
                        nType = c_oAscNumFormatType.Percent;
                    } else {
                        if (this.bScientific) {
                            nType = c_oAscNumFormatType.Scientific;
                        } else {
                            if (this.bCurrency) {
                                nType = c_oAscNumFormatType.Currency;
                            } else {
                                if (this.bSlash) {
                                    nType = c_oAscNumFormatType.Fraction;
                                } else {
                                    if (this.bNumber) {
                                        nType = c_oAscNumFormatType.Number;
                                    } else {
                                        if (this.bInteger) {
                                            nType = c_oAscNumFormatType.Integer;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return nType;
    }
};
function NumFormatCache() {
    this.oNumFormats = new Object();
}
NumFormatCache.prototype = {
    get: function (format) {
        var res = this.oNumFormats[format];
        if (null == res) {
            res = new CellFormat(format);
            this.oNumFormats[format] = res;
        }
        return res;
    },
    set: function (format) {
        var res = new CellFormat(format);
        this.oNumFormats[format] = res;
    }
};
oNumFormatCache = new NumFormatCache();
function CellFormat(format) {
    this.sFormat = format;
    this.oPositiveFormat = null;
    this.oNegativeFormat = null;
    this.oNullFormat = null;
    this.oTextFormat = null;
    this.aComporationFormats = null;
    var aFormats = format.split(";");
    var nFormatsLength = aFormats.length;
    var aParsedFormats = new Array();
    for (var i = 0; i < nFormatsLength; ++i) {
        var oNewFormat = new NumFormat(false);
        oNewFormat.setFormat(aFormats[i]);
        aParsedFormats.push(oNewFormat);
    }
    var bComporationOperator = false;
    if (nFormatsLength > 0) {
        var oFirstFormat = aParsedFormats[0];
        if (null != oFirstFormat.ComporationOperator) {
            bComporationOperator = true;
            if (3 == nFormatsLength) {
                var oPositive = null;
                var oNegative = null;
                var oNull = null;
                for (var i = 0; i < nFormatsLength; ++i) {
                    var oCurFormat = aParsedFormats[i];
                    if (null == oCurFormat.ComporationOperator) {
                        if (null == oPositive) {
                            oPositive = oCurFormat;
                        } else {
                            if (null == oNegative) {
                                oNegative = oCurFormat;
                            } else {
                                if (null == oNull) {
                                    oNull = oCurFormat;
                                }
                            }
                        }
                    } else {
                        var oComporationOperator = oCurFormat.ComporationOperator;
                        if (0 == oComporationOperator.operatorValue) {
                            switch (oComporationOperator.operator) {
                            case NumComporationOperators.greater:
                                oPositive = oCurFormat;
                                break;
                            case NumComporationOperators.less:
                                oNegative = oCurFormat;
                                break;
                            case NumComporationOperators.equal:
                                oNull = oCurFormat;
                                break;
                            }
                        } else {
                            oPositive = oNegative = oNull = null;
                            break;
                        }
                    }
                }
            }
            this.oTextFormat = new NumFormat(false);
            this.oTextFormat.setFormat("@");
            if (null == oPositive || null == oNegative || null == oNull) {
                for (var i = 0, length = aParsedFormats.length; i < length; ++i) {
                    var oCurFormat = aParsedFormats[i];
                    if (null == oCurFormat.ComporationOperator) {
                        oCurFormat.bAddMinusIfNes = true;
                    } else {
                        var oComporationOperator = oCurFormat.ComporationOperator;
                        if (0 < oComporationOperator.operatorValue && (oComporationOperator.operator == NumComporationOperators.less || oComporationOperator.operator == NumComporationOperators.lessorequal)) {
                            oCurFormat.bAddMinusIfNes = true;
                        } else {
                            if (0 > oComporationOperator.operatorValue && (oComporationOperator.operator == NumComporationOperators.greater || oComporationOperator.operator == NumComporationOperators.greaterorequal)) {
                                oCurFormat.bAddMinusIfNes = true;
                            }
                        }
                    }
                }
                this.aComporationFormats = aParsedFormats;
            } else {
                this.oPositiveFormat = oPositive;
                this.oNegativeFormat = oNegative;
                this.oNullFormat = oNull;
            }
        }
    }
    if (false == bComporationOperator) {
        if (4 <= nFormatsLength) {
            this.oPositiveFormat = aParsedFormats[0];
            this.oNegativeFormat = aParsedFormats[1];
            this.oNullFormat = aParsedFormats[2];
            this.oTextFormat = aParsedFormats[3];
        } else {
            if (3 == nFormatsLength) {
                this.oPositiveFormat = aParsedFormats[0];
                this.oNegativeFormat = aParsedFormats[1];
                this.oNullFormat = aParsedFormats[2];
                this.oTextFormat = this.oPositiveFormat;
            } else {
                if (2 == nFormatsLength) {
                    this.oPositiveFormat = aParsedFormats[0];
                    this.oNegativeFormat = aParsedFormats[1];
                    this.oNullFormat = this.oPositiveFormat;
                    this.oTextFormat = this.oPositiveFormat;
                } else {
                    this.oPositiveFormat = aParsedFormats[0];
                    this.oPositiveFormat.bAddMinusIfNes = true;
                    this.oNegativeFormat = this.oPositiveFormat;
                    this.oNullFormat = this.oPositiveFormat;
                    this.oTextFormat = this.oPositiveFormat;
                }
            }
        }
    }
    this.formatCache = new Object();
}
CellFormat.prototype = {
    isTextFormat: function () {
        if (null != this.oPositiveFormat) {
            return this.oPositiveFormat.bTextFormat;
        } else {
            if (null != this.aComporationFormats && this.aComporationFormats.length > 0) {
                return this.aComporationFormats[0].bTextFormat;
            }
        }
        return false;
    },
    isGeneralFormat: function () {
        if (null != this.oPositiveFormat) {
            return this.oPositiveFormat.bGeneral;
        } else {
            if (null != this.aComporationFormats && this.aComporationFormats.length > 0) {
                return this.aComporationFormats[0].bGeneral;
            }
        }
        return false;
    },
    isDateTimeFormat: function () {
        if (null != this.oPositiveFormat) {
            return this.oPositiveFormat.bDateTime;
        } else {
            if (null != this.aComporationFormats && this.aComporationFormats.length > 0) {
                return this.aComporationFormats[0].bDateTime;
            }
        }
        return false;
    },
    getFormatByValue: function (dNumber) {
        var oRes = null;
        if (null == this.aComporationFormats) {
            if (dNumber > 0 && null != this.oPositiveFormat) {
                oRes = this.oPositiveFormat;
            } else {
                if (dNumber < 0 && null != this.oNegativeFormat) {
                    oRes = this.oNegativeFormat;
                } else {
                    if (null != this.oNullFormat) {
                        oRes = this.oNullFormat;
                    }
                }
            }
        } else {
            var nLength = this.aComporationFormats.length;
            var oDefaultComporationFormat = null;
            for (var i = 0, length = nLength; i < length; ++i) {
                var oCurFormat = this.aComporationFormats[i];
                if (null != oCurFormat.ComporationOperator) {
                    var bOperationResult = false;
                    var oOperationValue = oCurFormat.ComporationOperator.operatorValue;
                    switch (oCurFormat.ComporationOperator.operator) {
                    case NumComporationOperators.equal:
                        bOperationResult = (dNumber == oOperationValue);
                        break;
                    case NumComporationOperators.greater:
                        bOperationResult = (dNumber > oOperationValue);
                        break;
                    case NumComporationOperators.less:
                        bOperationResult = (dNumber < oOperationValue);
                        break;
                    case NumComporationOperators.greaterorequal:
                        bOperationResult = (dNumber >= oOperationValue);
                        break;
                    case NumComporationOperators.lessorequal:
                        bOperationResult = (dNumber <= oOperationValue);
                        break;
                    case NumComporationOperators.notequal:
                        bOperationResult = (dNumber != oOperationValue);
                        break;
                    }
                    if (true == bOperationResult) {
                        oRes = oCurFormat;
                    }
                } else {
                    if (null == oDefaultComporationFormat) {
                        oDefaultComporationFormat = oCurFormat;
                    }
                }
            }
            if (null == oRes && null != oDefaultComporationFormat) {
                oRes = oDefaultComporationFormat;
            }
        }
        return oRes;
    },
    format: function (number, nValType, dDigitsCount, oAdditionalResult) {
        var cacheVal = this.formatCache[number];
        if (null != cacheVal) {
            cacheVal = cacheVal[nValType];
            if (null != cacheVal) {
                cacheVal = cacheVal[dDigitsCount];
                if (null != cacheVal) {
                    return cacheVal;
                }
            }
        }
        var res = [{
            text: number
        }];
        var dNumber = number - 0;
        if (CellValueType.String != nValType && number == dNumber) {
            var oFormat = this.getFormatByValue(dNumber);
            if (null != oFormat) {
                res = oFormat.format(number, nValType, dDigitsCount, oAdditionalResult);
            } else {
                if (null != this.aComporationFormats) {
                    var oNewFont = new Font();
                    oNewFont.clean();
                    oNewFont.repeat = true;
                    res = [{
                        text: "#",
                        format: oNewFont
                    }];
                }
            }
        } else {
            if (null != this.oTextFormat) {
                res = this.oTextFormat.format(number, nValType, dDigitsCount, oAdditionalResult);
            }
        }
        var cacheVal = this.formatCache[number];
        if (null == cacheVal) {
            cacheVal = new Object();
            this.formatCache[number] = cacheVal;
        }
        var cacheType = cacheVal[nValType];
        if (null == cacheType) {
            cacheType = new Object();
            cacheVal[nValType] = cacheType;
        }
        cacheType[dDigitsCount] = res;
        return res;
    },
    shiftFormat: function (output, nShift) {
        var bRes = false;
        var bCurRes = true;
        if (null == this.aComporationFormats) {
            bCurRes = this.oPositiveFormat.toString(output, nShift);
            if (false == bCurRes) {
                output.format = this.oPositiveFormat.formatString;
            }
            bRes |= bCurRes;
            if (null != this.oNegativeFormat && this.oPositiveFormat != this.oNegativeFormat) {
                var oTempOutput = new Object();
                bCurRes = this.oNegativeFormat.toString(oTempOutput, nShift);
                if (false == bCurRes) {
                    output.format += ";" + this.oNegativeFormat.formatString;
                } else {
                    output.format += ";" + oTempOutput.format;
                }
                bRes |= bCurRes;
            }
            if (null != this.oNullFormat && this.oPositiveFormat != this.oNullFormat) {
                var oTempOutput = new Object();
                bCurRes = this.oNullFormat.toString(oTempOutput, nShift);
                if (false == bCurRes) {
                    output.format += ";" + this.oNullFormat.formatString;
                } else {
                    output.format += ";" + oTempOutput.format;
                }
                bRes |= bCurRes;
            }
            if (null != this.oTextFormat && this.oPositiveFormat != this.oTextFormat) {
                var oTempOutput = new Object();
                bCurRes = this.oTextFormat.toString(oTempOutput, nShift);
                if (false == bCurRes) {
                    output.format += ";" + this.oTextFormat.formatString;
                } else {
                    output.format += ";" + oTempOutput.format;
                }
                bRes |= bCurRes;
            }
        } else {
            var length = this.aComporationFormats.length;
            output.format = "";
            for (var i = 0; i < length; ++i) {
                var oTempOutput = new Object();
                var oCurFormat = this.aComporationFormats[i];
                var bCurRes = oCurFormat.toString(oTempOutput, nShift);
                if (0 != i) {
                    output.format += ";";
                }
                if (false == bCurRes) {
                    output.format += oCurFormat.formatString;
                } else {
                    output.format += oTempOutput.format;
                }
                bRes |= bCurRes;
            }
        }
        return bRes;
    },
    getType: function () {
        if (null != this.oPositiveFormat) {
            return this.oPositiveFormat.getType();
        } else {
            if (null != this.aComporationFormats && this.aComporationFormats.length > 0) {
                return this.aComporationFormats[0].getType();
            }
        }
        return c_oAscNumFormatType.General;
    }
};
var oDecodeGeneralFormatCache = new Object();
function DecodeGeneralFormat(val, nValType, dDigitsCount) {
    var cacheVal = oDecodeGeneralFormatCache[val];
    if (null != cacheVal) {
        cacheVal = cacheVal[nValType];
        if (null != cacheVal) {
            cacheVal = cacheVal[dDigitsCount];
            if (null != cacheVal) {
                return cacheVal;
            }
        }
    }
    var res = DecodeGeneralFormat_Raw(val, nValType, dDigitsCount);
    var cacheVal = oDecodeGeneralFormatCache[val];
    if (null == cacheVal) {
        cacheVal = new Object();
        oDecodeGeneralFormatCache[val] = cacheVal;
    }
    var cacheType = cacheVal[nValType];
    if (null == cacheType) {
        cacheType = new Object();
        cacheVal[nValType] = cacheType;
    }
    cacheType[dDigitsCount] = res;
    return res;
}
function DecodeGeneralFormat_Raw(val, nValType, dDigitsCount) {
    if (CellValueType.String == nValType) {
        return "@";
    }
    var number = val - 0;
    if (number != val) {
        return "@";
    }
    if (0 == number) {
        return "0";
    }
    var nDigitsCount;
    if (null == dDigitsCount || dDigitsCount > gc_nMaxDigCountView) {
        nDigitsCount = gc_nMaxDigCountView;
    } else {
        nDigitsCount = parseInt(dDigitsCount);
    }
    if (number < 0) {
        number = -number;
    }
    if (nDigitsCount < 1) {
        return "0";
    }
    var bContinue = true;
    var parts = getNumberParts(number);
    while (bContinue) {
        bContinue = false;
        var nRealExp = gc_nMaxDigCount + parts.exponent;
        var nRealExpAbs = Math.abs(nRealExp);
        var nExpMinDigitsCount;
        if (nRealExpAbs < 100) {
            nExpMinDigitsCount = 4;
        } else {
            nExpMinDigitsCount = 2 + nRealExpAbs.toString().length;
        }
        var suffix = "";
        if (nRealExp > 0) {
            if (nRealExp > nDigitsCount) {
                if (nDigitsCount >= nExpMinDigitsCount + 1) {
                    suffix = "E+";
                    for (var i = 2; i < nExpMinDigitsCount; ++i) {
                        suffix += "0";
                    }
                    nDigitsCount -= nExpMinDigitsCount;
                } else {
                    return "0";
                }
            }
        } else {
            var nVarian1 = nDigitsCount - 2 + nRealExp;
            var nVarian2 = nDigitsCount - nExpMinDigitsCount;
            if (nVarian2 > 2) {
                nVarian2--;
            } else {
                if (nVarian2 > 0) {
                    nVarian2 = 1;
                }
            }
            if (nVarian1 <= 0 && nVarian2 <= 0) {
                return "0";
            }
            if (nVarian1 < nVarian2) {
                var bUseVarian1 = false;
                if (nVarian1 > 0) {
                    var sTempNumber = parts.mantissa.toString();
                    sTempNumber = sTempNumber.substring(nVarian1, nVarian2);
                    var nTempNumberLength = sTempNumber.length;
                    bUseVarian1 = true;
                    for (var i = 0; i < nTempNumberLength; ++i) {
                        if ("0" != sTempNumber[i]) {
                            bUseVarian1 = false;
                            break;
                        }
                    }
                }
                if (false == bUseVarian1) {
                    if (nDigitsCount >= nExpMinDigitsCount + 1) {
                        suffix = "E+";
                        for (var i = 2; i < nExpMinDigitsCount; ++i) {
                            suffix += "0";
                        }
                        nDigitsCount -= nExpMinDigitsCount;
                    } else {
                        return "0";
                    }
                }
            }
        }
        var dec_num_digits = nRealExp;
        if (suffix) {
            dec_num_digits = 1;
        }
        var nRoundDigCount = 0;
        if (dec_num_digits <= 0) {
            var nTemp = nDigitsCount + dec_num_digits - 2;
            if (nTemp > 0) {
                nRoundDigCount = nTemp;
            }
        } else {
            if (dec_num_digits < gc_nMaxDigCount) {
                if (dec_num_digits <= nDigitsCount) {
                    if (dec_num_digits + 1 < nDigitsCount) {
                        nRoundDigCount = nDigitsCount - 1;
                    } else {
                        nRoundDigCount = dec_num_digits;
                    }
                }
            }
        }
        if (nRoundDigCount > 0) {
            var nTemp = Math.pow(10, gc_nMaxDigCount - nRoundDigCount);
            number = Math.round(parts.mantissa / nTemp) * nTemp * Math.pow(10, parts.exponent);
            var oNewParts = getNumberParts(number);
            if (oNewParts.exponent != parts.exponent) {
                bContinue = true;
            } else {
                bContinue = false;
            }
            parts = oNewParts;
        }
    }
    var frac_num_digits;
    if (dec_num_digits > 0) {
        frac_num_digits = nDigitsCount - 1 - dec_num_digits;
    } else {
        frac_num_digits = nDigitsCount - 2 + dec_num_digits;
    }
    if (frac_num_digits > 0) {
        var sTempNumber = parts.mantissa.toString();
        var sTempNumber;
        if (dec_num_digits > 0) {
            sTempNumber = sTempNumber.substring(dec_num_digits, dec_num_digits + frac_num_digits);
        } else {
            sTempNumber = sTempNumber.substring(0, frac_num_digits);
        }
        var nTempNumberLength = sTempNumber.length;
        var nreal_frac_num_digits = frac_num_digits;
        for (var i = frac_num_digits - 1; i >= 0; --i) {
            if ("0" == sTempNumber[i]) {
                nreal_frac_num_digits--;
            } else {
                break;
            }
        }
        frac_num_digits = nreal_frac_num_digits;
        if (dec_num_digits < 0) {
            frac_num_digits += (-dec_num_digits);
        }
    }
    if (frac_num_digits <= 0) {
        return "0" + suffix;
    }
    var number_format_string = "0.";
    for (var i = 0; i < frac_num_digits; ++i) {
        number_format_string += "0";
    }
    number_format_string += suffix;
    return number_format_string;
}
function GeneralEditFormatCache() {
    this.oCache = new Object();
}
GeneralEditFormatCache.prototype = {
    format: function (number) {
        var value = this.oCache[number];
        if (null == value) {
            if (0 == number) {
                value = "0";
            } else {
                var sRes = "";
                var parts = getNumberParts(number);
                var nRealExp = gc_nMaxDigCount + parts.exponent;
                if (parts.exponent >= 0) {
                    if (nRealExp <= 21) {
                        sRes = parts.mantissa.toString();
                        for (var i = 0; i < parts.exponent; ++i) {
                            sRes += "0";
                        }
                    } else {
                        sRes = this._removeTileZeros(parts.mantissa.toString());
                        if (sRes.length > 1) {
                            var temp = sRes.substring(0, 1);
                            temp += ".";
                            temp += sRes.substring(1);
                            sRes = temp;
                        }
                        sRes += "E+" + (nRealExp - 1);
                    }
                } else {
                    if (nRealExp > 0) {
                        sRes = parts.mantissa.toString();
                        if (sRes.length > nRealExp) {
                            var temp = sRes.substring(0, nRealExp);
                            temp += ".";
                            temp += sRes.substring(nRealExp);
                            sRes = temp;
                        }
                        sRes = this._removeTileZeros(sRes);
                    } else {
                        if (nRealExp >= -18) {
                            sRes = "0";
                            sRes += ".";
                            for (var i = 0; i < -nRealExp; ++i) {
                                sRes += "0";
                            }
                            var sTemp = parts.mantissa.toString();
                            sTemp = sTemp.substring(0, 19 + nRealExp);
                            sRes += this._removeTileZeros(sTemp);
                        } else {
                            sRes = parts.mantissa.toString();
                            if (sRes.length > 1) {
                                var temp = sRes.substring(0, 1);
                                temp += ".";
                                temp += sRes.substring(1);
                                temp = this._removeTileZeros(temp);
                                sRes = temp;
                            }
                            sRes += "E-" + (1 - nRealExp);
                        }
                    }
                }
                if (SignType.Negative == parts.sign) {
                    value = "-" + sRes;
                } else {
                    value = sRes;
                }
            }
            this.oCache[number] = value;
        }
        return value;
    },
    _removeTileZeros: function (val) {
        var res = val;
        var nLength = val.length;
        var nLastNoZero = nLength - 1;
        for (var i = val.length - 1; i >= 0; --i) {
            nLastNoZero = i;
            if ("0" != val[i]) {
                break;
            }
        }
        if (nLastNoZero != nLength - 1) {
            if ("." == res[nLastNoZero]) {
                res = res.substring(0, nLastNoZero);
            } else {
                res = res.substring(0, nLastNoZero + 1);
            }
        }
        return res;
    }
};
var oGeneralEditFormatCache = new GeneralEditFormatCache();
function FormatParser() {
    this.rx_percent = new RegExp("^([+-]?)(\\d+\\.?\\d*|\\.\\d+)%$");
    this.rx_date = new RegExp("^ *((\\d{1,2}) *[/-] *(\\d{1,2}) *[/-] *(\\d{2,4}))? *((\\d{1,2}) *: *(\\d{1,2})? *(: *(\\d{1,2})?)? *(AM|PM)?)?$");
    this.rx_date2 = new RegExp("^ *((\\d{1,2}) *[/-])? *(\\w{3}) *([/-]|[/-](\\w{2,4}))?$");
    this.rx_currency = new RegExp("^([+-]?)([$€£¥])?(\\d+\\.?\\d*|\\.\\d+)(р.)?$");
    this.days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.daysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
}
FormatParser.prototype = {
    parse: function (value) {
        var res = null;
        var match = value.match(this.rx_percent);
        if (null != match) {
            var sSing1 = match[1];
            var sV1 = match[2];
            var dVal = parseFloat(sV1);
            if ("-" == sSing1) {
                dVal = -dVal;
            }
            dVal /= 100;
            res = {
                format: "0.00%",
                value: dVal
            };
        } else {
            match = value.match(this.rx_currency);
            if (null != match) {
                var sSing1 = match[1];
                var bRubble = false;
                var sSing2 = match[2];
                var sSing3 = match[4];
                if ("р." == sSing3) {
                    bRubble = true;
                }
                var sV1 = match[3];
                var dVal = parseFloat(sV1);
                if ("-" == sSing1) {
                    dVal = -dVal;
                }
                if (bRubble) {
                    res = {
                        format: "#,##0.00р.",
                        value: dVal
                    };
                } else {
                    res = {
                        format: "\\" + sSing2 + "#,##0.00_);[Red](\\" + sSing2 + "#,##0.00)",
                        value: dVal
                    };
                }
            } else {
                res = this.parseDate(value);
            }
        }
        return res;
    },
    parseDate: function (value) {
        var res = null;
        match = value.match(this.rx_date);
        if (null != (match = value.match(this.rx_date))) {
            var d = match[3];
            var m = match[2];
            var y = match[4];
            var h = match[6];
            var min = match[7];
            var s = match[9];
            var ampm = match[10];
            var bDate = false;
            var bTime = false;
            var nDay;
            var nMounth;
            var nYear;
            if (g_bDate1904) {
                nDay = 1;
                nMounth = 0;
                nYear = 1904;
            } else {
                nDay = 31;
                nMounth = 11;
                nYear = 1899;
            }
            var nHour = 0;
            var nHour = 0;
            var nMinute = 0;
            var nSecond = 0;
            var dValue = 0;
            var bValidDate = true;
            if (null != d && null != m && null != y) {
                bDate = true;
                var nDay = d - 0;
                var nMounth = m - 1;
                var nYear = y - 0;
                if (nYear < 100) {
                    nYear = 2000 + nYear;
                }
                bValidDate = this.isValidDate(nYear, nMounth, nDay);
            }
            if (null != h) {
                bTime = true;
                nHour = h - 0;
                if (null != ampm) {
                    nHour = nHour % 12;
                    if ("PM" == ampm) {
                        nHour += 12;
                    }
                }
                if (null != min) {
                    nMinute = min - 0;
                }
                if (null != s) {
                    nSecond = s - 0;
                }
            }
            if (true == bValidDate && (true == bDate || true == bTime)) {
                if (g_bDate1904) {
                    dValue = (Date.UTC(nYear, nMounth, nDay, nHour, nMinute, nSecond) - Date.UTC(1904, 0, 1, 0, 0, 0)) / (86400 * 1000);
                } else {
                    if (1900 < nYear || (1900 == nYear && 2 < nMounth)) {
                        dValue = (Date.UTC(nYear, nMounth, nDay, nHour, nMinute, nSecond) - Date.UTC(1899, 11, 30, 0, 0, 0)) / (86400 * 1000);
                    } else {
                        if (1900 == nYear && 2 == nMounth && 29 == nDay) {
                            dValue = 60;
                        } else {
                            dValue = (Date.UTC(nYear, nMounth, nDay, nHour, nMinute, nSecond) - Date.UTC(1899, 11, 31, 0, 0, 0)) / (86400 * 1000);
                        }
                    }
                }
                if (dValue > 0) {
                    var sFormat;
                    if (true == bDate && true == bTime) {
                        sFormat = "m/d/yyyy h:mm:ss AM/PM";
                    } else {
                        if (true == bDate) {
                            sFormat = "m/d/yyyy";
                        } else {
                            if (dValue > 1) {
                                sFormat = "[h]:mm:ss";
                            } else {
                                if (null != ampm) {
                                    sFormat = "h:mm:ss AM/PM";
                                } else {
                                    sFormat = "h:mm:ss";
                                }
                            }
                        }
                    }
                    res = {
                        format: sFormat,
                        value: dValue,
                        bDateTime: true
                    };
                }
            }
        } else {
            if (null != (match = this.rx_date2.exec(value))) {
                var sDD = match[2],
                sMM = match[3],
                sYY = match[5],
                nDay,
                nMounth,
                nYear,
                sFormat,
                bValidDate = false;
                if (g_bDate1904) {
                    nDay = 1;
                    nMounth = 0;
                    nYear = 1904;
                } else {
                    nDay = 31;
                    nMounth = 11;
                    nYear = 1899;
                }
                if (undefined != sDD) {
                    if (undefined != sYY) {
                        if (sYY.length == 4) {
                            sFormat = "d-mmm-yyyy";
                        } else {
                            sFormat = "d-mmm-yy";
                        }
                    } else {
                        sFormat = "d-mmm";
                    }
                } else {
                    if (undefined != sYY) {
                        if (sYY.length == 4) {
                            sFormat = "mmm-yyyy";
                        } else {
                            sFormat = "mmm-yy";
                        }
                    } else {
                        return res;
                    }
                }
                var nDD = 1;
                if (undefined != sDD) {
                    nDD = parseInt(sDD);
                }
                var nMM = 0;
                switch (sMM.toLowerCase()) {
                case "jan":
                    nMM = 1;
                    break;
                case "feb":
                    nMM = 2;
                    break;
                case "mar":
                    nMM = 3;
                    break;
                case "apr":
                    nMM = 4;
                    break;
                case "may":
                    nMM = 5;
                    break;
                case "jun":
                    nMM = 6;
                    break;
                case "jul":
                    nMM = 7;
                    break;
                case "aug":
                    nMM = 8;
                    break;
                case "sep":
                    nMM = 9;
                    break;
                case "oct":
                    nMM = 10;
                    break;
                case "nov":
                    nMM = 11;
                    break;
                case "dec":
                    nMM = 12;
                    break;
                default:
                    return res;
                }
                var nYY = -1;
                if (undefined != sYY) {
                    nYY = parseInt(sYY);
                } else {
                    nYY = new Date().getFullYear();
                }
                if (0 <= nDD && 0 < nMM && 0 <= nYY) {
                    nDay = nDD - 0;
                    nMounth = nMM - 1;
                    nYear = nYY - 0;
                    if (nYear < 100) {
                        nYear = 2000 + nYear;
                    }
                    bValidDate = this.isValidDate(nYear, nMounth, nDay);
                }
                if (true == bValidDate) {
                    if (g_bDate1904) {
                        dValue = (Date.UTC(nYear, nMounth, nDay, nHour, nMinute, nSecond) - Date.UTC(1904, 0, 1, 0, 0, 0)) / (86400 * 1000);
                    } else {
                        if (1900 < nYear || (1900 == nYear && 2 < nMounth)) {
                            dValue = (Date.UTC(nYear, nMounth, nDay, nHour, nMinute, nSecond) - Date.UTC(1899, 11, 30, 0, 0, 0)) / (86400 * 1000);
                        } else {
                            if (1900 == nYear && 2 == nMounth && 29 == nDay) {
                                dValue = 60;
                            } else {
                                dValue = (Date.UTC(nYear, nMounth, nDay, nHour, nMinute, nSecond) - Date.UTC(1899, 11, 31, 0, 0, 0)) / (86400 * 1000);
                            }
                        }
                    }
                    if (dValue > 0) {
                        res = {
                            format: sFormat,
                            value: dValue,
                            bDateTime: true
                        };
                    }
                }
            }
        }
        return res;
    },
    isValidDate: function (nYear, nMounth, nDay) {
        if (nYear < 1900) {
            return false;
        } else {
            if (nMounth < 0 || nMounth > 11) {
                return false;
            } else {
                if (this.isLeapYear(nYear)) {
                    if (nDay <= 0 || nDay > this.daysLeap[nMounth]) {
                        return false;
                    }
                } else {
                    if (nDay <= 0 || nDay > this.days[nMounth]) {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    isLeapYear: function (year) {
        return (0 == (year % 4)) && (0 != (year % 100) || 0 == (year % 400));
    }
};
var g_oFormatParser = new FormatParser();