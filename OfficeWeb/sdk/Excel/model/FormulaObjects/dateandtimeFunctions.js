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
 function GetDiffDate360(nDay1, nMonth1, nYear1, bLeapYear1, nDay2, nMonth2, nYear2, bUSAMethod) {
    if (nDay1 == 31) {
        nDay1--;
    } else {
        if (bUSAMethod && (nMonth1 == 2 && (nDay1 == 29 || (nDay1 == 28 && !bLeapYear1)))) {
            nDay1 = 30;
        }
    }
    if (nDay2 == 31) {
        if (bUSAMethod && nDay1 != 30) {
            nDay2 = 1;
            if (nMonth2 == 12) {
                nYear2++;
                nMonth2 = 1;
            } else {
                nMonth2++;
            }
        } else {
            nDay2 = 30;
        }
    }
    return nDay2 + nMonth2 * 30 + nYear2 * 360 - nDay1 - nMonth1 * 30 - nYear1 * 360;
}
cFormulaFunction.DateAndTime = {
    "groupName": "DateAndTime",
    "DATE": function () {
        var r = new cBaseFunction("DATE");
        r.setArgumentsMin(3);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2],
            year,
            month,
            day;
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
                return this.setCA(arg0, true);
            }
            if (arg1 instanceof cError) {
                return this.setCA(arg1, true);
            }
            if (arg2 instanceof cError) {
                return this.setCA(arg2, true);
            }
            year = arg0.getValue();
            month = arg1.getValue();
            day = arg2.getValue();
            if (year >= 0 && year <= 1899) {
                year += 1900;
            }
            if (month == 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            }
            this.value = new cNumber(Math.round(new Date(year, month - 1, day).getExcelDate()));
            this.value.numFormat = 14;
            this.value.ca = true;
            return this.value;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( year, month, day )"
            };
        };
        return r;
    },
    "DATEDIF": function () {
        var r = new cBaseFunction("DATEDIF");
        r.setArgumentsMin(3);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
                arg2 = arg2.cross(arguments[1].first);
            } else {
                if (arg2 instanceof cArray) {
                    arg2 = arg2.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            arg2 = arg2.tocString();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg2 instanceof cError) {
                return this.value = arg2;
            }
            var val0 = arg0.getValue(),
            val1 = arg1.getValue();
            if (val0 < 0 || val1 < 0 || val0 >= val1) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            }
            val0 = Date.prototype.getDateFromExcel(val0);
            val1 = Date.prototype.getDateFromExcel(val1);
            function dateDiff(date1, date2) {
                var years = date2.getFullYear() - date1.getFullYear();
                var months = years * 12 + date2.getMonth() - date1.getMonth();
                var days = date2.getDate() - date1.getDate();
                years -= date2.getMonth() < date1.getMonth();
                months -= date2.getDate() < date1.getDate();
                days += days < 0 ? new Date(date2.getFullYear(), date2.getMonth() - 1, 0).getDate() + 1 : 0;
                return [years, months, days];
            }
            switch (arg2.getValue().toUpperCase()) {
            case "Y":
                return this.value = new cNumber(dateDiff(val0, val1)[0]);
                break;
            case "M":
                return this.value = new cNumber(dateDiff(val0, val1)[1]);
                break;
            case "D":
                return this.value = new cNumber(parseInt((val1 - val0) / c_msPerDay));
                break;
            case "MD":
                if (val0.getDate() > val1.getDate()) {
                    this.value = new cNumber(Math.abs(new Date(val0.getFullYear(), val0.getMonth(), val0.getDate()) - new Date(val0.getFullYear(), val0.getMonth() + 1, val1.getDate())) / c_msPerDay);
                } else {
                    this.value = new cNumber(val1.getDate() - val0.getDate());
                }
                return this.value;
                break;
            case "YM":
                var d = dateDiff(val0, val1);
                return this.value = new cNumber(d[1] - d[0] * 12);
                break;
            case "YD":
                if (val0.getMonth() > val1.getMonth()) {
                    this.value = new cNumber(Math.abs(new Date(val0.getFullYear(), val0.getMonth(), val0.getDate()) - new Date(val0.getFullYear() + 1, val1.getMonth(), val1.getDate())) / c_msPerDay);
                } else {
                    this.value = new cNumber(Math.abs(new Date(val0.getFullYear(), val0.getMonth(), val0.getDate()) - new Date(val0.getFullYear(), val1.getMonth(), val1.getDate())) / c_msPerDay);
                }
                return this.value;
                break;
            default:
                return this.value = new cError(cErrorType.not_numeric);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( start-date , end-date , unit )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "DATEVALUE": function () {
        var r = new cBaseFunction("DATEVALUE");
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
            if (arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0) {
                return this.value = new cNumber(parseInt(arg0.tocNumber().getValue()));
            }
            var res = g_oFormatParser.parse(arg0.getValue());
            if (res && res.bDateTime) {
                return this.value = new cNumber(parseInt(res.value));
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( date-time-string )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "DAY": function () {
        var r = new cBaseFunction("DAY");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            val;
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElement(0);
            } else {
                if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                    val = arg0.tocNumber().getValue();
                }
            }
            if (arg0 instanceof cError) {
                return this.setCA(arg0, true);
            } else {
                if (arg0 instanceof cNumber || arg0 instanceof cBool) {
                    val = arg0.tocNumber().getValue();
                } else {
                    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                        val = arg0.getValue().tocNumber();
                        if (val instanceof cNumber || val instanceof cBool) {
                            val = arg0.tocNumber().getValue();
                        } else {
                            return this.setCA(new cError(cErrorType.wrong_value_type), true);
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            val = arg0.tocNumber();
                            if (val instanceof cError || val instanceof cEmpty) {
                                var d = new Date(arg0.getValue());
                                if (isNaN(d)) {
                                    return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                } else {
                                    val = Math.floor((d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1)));
                                }
                            } else {
                                val = arg0.tocNumber().getValue();
                            }
                        }
                    }
                }
            }
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                if (!g_bDate1904) {
                    if (val < 60) {
                        return this.setCA(new cNumber((new Date((val - c_DateCorrectConst) * c_msPerDay)).getUTCDate()), true, 0);
                    } else {
                        if (val == 60) {
                            return this.setCA(new cNumber((new Date((val - c_DateCorrectConst - 1) * c_msPerDay)).getUTCDate() + 1), true, 0);
                        } else {
                            return this.setCA(new cNumber((new Date((val - c_DateCorrectConst - 1) * c_msPerDay)).getUTCDate()), true, 0);
                        }
                    }
                } else {
                    return this.setCA(new cNumber((new Date((val - c_DateCorrectConst) * c_msPerDay)).getUTCDate()), true, 0);
                }
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( date-value )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "DAYS360": function () {
        var r = new cBaseFunction("DAYS360");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2] ? arg[2] : new cBool(false);
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
                arg2 = arg2.cross(arguments[1].first);
            } else {
                if (arg2 instanceof cArray) {
                    arg2 = arg2.getElementRowCol(0, 0);
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
            if (arg0.getValue() < 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            if (arg1.getValue() < 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var date1 = Date.prototype.getDateFromExcel(arg0.getValue()),
            date2 = Date.prototype.getDateFromExcel(arg1.getValue());
            return this.value = new cNumber(GetDiffDate360(date1.getDate(), date1.getMonth() + 1, date1.getFullYear(), date1.isLeapYear(), date2.getDate(), date2.getMonth() + 1, date2.getFullYear(), !arg2.toBool()));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(  start-date , end-date [ , method-flag ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "EDATE": function () {
        var r = new cBaseFunction("EDATE");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            var val = arg0.getValue(),
            date,
            _date;
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                if (!g_bDate1904) {
                    if (val < 60) {
                        val = new Date((val - c_DateCorrectConst) * c_msPerDay);
                    } else {
                        if (val == 60) {
                            val = new Date((val - c_DateCorrectConst - 1) * c_msPerDay);
                        } else {
                            val = new Date((val - c_DateCorrectConst - 1) * c_msPerDay);
                        }
                    }
                } else {
                    val = new Date((val - c_DateCorrectConst) * c_msPerDay);
                }
            }
            date = new Date(val);
            if (0 <= date.getDate() && 28 >= date.getDate()) {
                val = new Date(val.setMonth(val.getMonth() + arg1.getValue()));
            } else {
                if (29 <= date.getDate() && 31 >= date.getDate()) {
                    date.setDate(1);
                    date.setMonth(date.getMonth() + arg1.getValue());
                    if (val.getDate() > (_date = date.getDaysInMonth())) {
                        val.setDate(_date);
                    }
                    val = new Date(val.setMonth(val.getMonth() + arg1.getValue()));
                }
            }
            return this.value = new cNumber(Math.floor((val.getTime() / 1000 - val.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + 1)));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( start-date , month-offset )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "EOMONTH": function () {
        var r = new cBaseFunction("EOMONTH");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            var val = arg0.getValue(),
            date,
            _date;
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                if (!g_bDate1904) {
                    if (val < 60) {
                        val = new Date((val - c_DateCorrectConst) * c_msPerDay);
                    } else {
                        if (val == 60) {
                            val = new Date((val - c_DateCorrectConst - 1) * c_msPerDay);
                        } else {
                            val = new Date((val - c_DateCorrectConst - 1) * c_msPerDay);
                        }
                    }
                } else {
                    val = new Date((val - c_DateCorrectConst) * c_msPerDay);
                }
            }
            date = new Date(val);
            val.setDate(1);
            val.setMonth(val.getMonth() + arg1.getValue());
            val.setDate(val.getDaysInMonth());
            return this.value = new cNumber(Math.floor((val.getTime() / 1000 - val.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + 1)));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( start-date , month-offset )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "HOUR": function () {
        var r = new cBaseFunction("HOUR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            val;
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElement(0);
            } else {
                if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }
            }
            if (arg0 instanceof cError) {
                return this.setCA(arg0, true);
            } else {
                if (arg0 instanceof cNumber || arg0 instanceof cBool) {
                    val = arg0.tocNumber().getValue();
                } else {
                    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                        val = arg0.getValue();
                        if (val instanceof cError) {
                            return this.setCA(val, true);
                        } else {
                            if (val instanceof cNumber || val instanceof cBool) {
                                val = arg0.tocNumber().getValue();
                            } else {
                                return this.setCA(new cError(cErrorType.wrong_value_type), true);
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            val = arg0.tocNumber();
                            if (val instanceof cError || val instanceof cEmpty) {
                                var d = new Date(arg0.getValue());
                                if (isNaN(d)) {
                                    d = g_oFormatParser.parseDate(arg0.getValue());
                                    if (d == null) {
                                        return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                    }
                                    val = d.value;
                                } else {
                                    val = (d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1));
                                }
                            } else {
                                val = arg0.tocNumber().getValue();
                            }
                        }
                    }
                }
            }
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                return this.setCA(new cNumber(parseInt(((val - Math.floor(val)) * 24).toFixed(cExcelDateTimeDigits))), true, 0);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( time-value )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "MINUTE": function () {
        var r = new cBaseFunction("MINUTE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            val;
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElement(0);
            } else {
                if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }
            }
            if (arg0 instanceof cError) {
                return this.setCA(arg0, true);
            } else {
                if (arg0 instanceof cNumber || arg0 instanceof cBool) {
                    val = arg0.tocNumber().getValue();
                } else {
                    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                        val = arg0.getValue();
                        if (val instanceof cError) {
                            return this.setCA(val, true);
                        } else {
                            if (val instanceof cNumber || val instanceof cBool) {
                                val = arg0.tocNumber().getValue();
                            } else {
                                return this.setCA(new cError(cErrorType.wrong_value_type), true);
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            val = arg0.tocNumber();
                            if (val instanceof cError || val instanceof cEmpty) {
                                var d = new Date(arg0.getValue());
                                if (isNaN(d)) {
                                    d = g_oFormatParser.parseDate(arg0.getValue());
                                    if (d == null) {
                                        return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                    }
                                    val = d.value;
                                } else {
                                    val = (d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1));
                                }
                            } else {
                                val = arg0.tocNumber().getValue();
                            }
                        }
                    }
                }
            }
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                val = parseInt(((val * 24 - Math.floor(val * 24)) * 60).toFixed(cExcelDateTimeDigits)) % 60;
                return this.setCA(new cNumber(val), true, 0);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( time-value )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "MONTH": function () {
        var r = new cBaseFunction("MONTH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            val;
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElement(0);
            } else {
                if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }
            }
            if (arg0 instanceof cError) {
                return this.setCA(arg0, true);
            } else {
                if (arg0 instanceof cNumber || arg0 instanceof cBool) {
                    val = arg0.tocNumber().getValue();
                } else {
                    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                        val = arg0.getValue();
                        if (val instanceof cError) {
                            return this.setCA(val, true);
                        } else {
                            if (val instanceof cNumber || val instanceof cBool) {
                                val = arg0.tocNumber().getValue();
                            } else {
                                return this.setCA(new cError(cErrorType.wrong_value_type), true);
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            val = arg0.tocNumber();
                            if (val instanceof cError || val instanceof cEmpty) {
                                var d = new Date(arg0.getValue());
                                if (isNaN(d)) {
                                    return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                } else {
                                    val = Math.floor((d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1)));
                                }
                            } else {
                                val = arg0.tocNumber().getValue();
                            }
                        }
                    }
                }
            }
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            }
            if (!g_bDate1904) {
                if (val == 60) {
                    return this.setCA(new cNumber(2), true, 0);
                } else {
                    return this.setCA(new cNumber((new Date(((val == 0 ? 1 : val) - c_DateCorrectConst - 1) * c_msPerDay)).getUTCMonth() + 1), true, 0);
                }
            } else {
                return this.setCA(new cNumber((new Date(((val == 0 ? 1 : val) - c_DateCorrectConst) * c_msPerDay)).getUTCMonth() + 1), true, 0);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( date-value )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "NETWORKDAYS": function () {
        var r = new cBaseFunction("NETWORKDAYS");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2],
            arrDateIncl = [];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            var val0 = arg0.getValue(),
            val1 = arg1.getValue(),
            dif,
            count = 0;
            if (val0 < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                if (!g_bDate1904) {
                    if (val0 < 60) {
                        val0 = new Date((val0 - c_DateCorrectConst) * c_msPerDay);
                    } else {
                        if (val0 == 60) {
                            val0 = new Date((val0 - c_DateCorrectConst - 1) * c_msPerDay);
                        } else {
                            val0 = new Date((val0 - c_DateCorrectConst - 1) * c_msPerDay);
                        }
                    }
                } else {
                    val0 = new Date((val0 - c_DateCorrectConst) * c_msPerDay);
                }
            }
            if (val1 < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                if (!g_bDate1904) {
                    if (val1 < 60) {
                        val1 = new Date((val1 - c_DateCorrectConst) * c_msPerDay);
                    } else {
                        if (val1 == 60) {
                            val1 = new Date((val1 - c_DateCorrectConst - 1) * c_msPerDay);
                        } else {
                            val1 = new Date((val1 - c_DateCorrectConst - 1) * c_msPerDay);
                        }
                    }
                } else {
                    val1 = new Date((val1 - c_DateCorrectConst) * c_msPerDay);
                }
            }
            var holidays = [];
            if (arg2) {
                if (arg2 instanceof cRef) {
                    var a = arg2.getValue();
                    if (a instanceof cNumber && a.getValue() >= 0) {
                        holidays.push(a);
                    }
                } else {
                    if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
                        var arr = arg2.getValue();
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] instanceof cNumber && arr[i].getValue() >= 0) {
                                holidays.push(arr[i]);
                            }
                        }
                    } else {
                        if (arg2 instanceof cArray) {
                            arg2.foreach(function (elem, r, c) {
                                if (elem instanceof cNumber) {
                                    holidays.push(elem);
                                } else {
                                    if (elem instanceof cString) {
                                        var res = g_oFormatParser.parse(elem.getValue());
                                        if (res && res.bDateTime && res.value >= 0) {
                                            holidays.push(new cNumber(parseInt(res.value)));
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
            for (var i = 0; i < holidays.length; i++) {
                holidays[i] = Date.prototype.getDateFromExcel(holidays[i].getValue());
            }
            function includeInHolidays(date) {
                for (var i = 0; i < holidays.length; i++) {
                    if (date.getTime() == holidays[i].getTime()) {
                        return false;
                    }
                }
                return true;
            }
            dif = (val1 - val0);
            dif = (dif + (dif >= 0 ? c_msPerDay : 0)) / c_msPerDay;
            for (var i = 0; i < Math.abs(dif); i++) {
                var date = new Date(val0);
                date.setDate(val0.getDate() + i);
                if (date.getDay() != 6 && date.getDay() != 0 && includeInHolidays(date)) {
                    count++;
                }
            }
            return this.value = new cNumber((dif < 0 ? -1 : 1) * count);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( start-date , end-date [ , holidays ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "NETWORKDAYS.INTL": function () {
        var r = new cBaseFunction("NETWORKDAYS.INTL");
        return r;
    },
    "NOW": function () {
        var r = new cBaseFunction("NOW");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function () {
            var d = new Date();
            this.value = new cNumber(Math.floor((d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + 1)) + ((d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds()) / c_sPerDay));
            this.value.numFormat = 22;
            return this.setCA(this.value, true);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "()"
            };
        };
        return r;
    },
    "SECOND": function () {
        var r = new cBaseFunction("SECOND");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            val;
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElement(0);
            } else {
                if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }
            }
            if (arg0 instanceof cError) {
                return this.setCA(arg0, true);
            } else {
                if (arg0 instanceof cNumber || arg0 instanceof cBool) {
                    val = arg0.tocNumber().getValue();
                } else {
                    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                        val = arg0.getValue();
                        if (val instanceof cError) {
                            return this.setCA(val, true);
                        } else {
                            if (val instanceof cNumber || val instanceof cBool) {
                                val = arg0.tocNumber().getValue();
                            } else {
                                return this.setCA(new cError(cErrorType.wrong_value_type), true);
                            }
                        }
                    } else {
                        if (arg0 instanceof cString) {
                            val = arg0.tocNumber();
                            if (val instanceof cError || val instanceof cEmpty) {
                                var d = new Date(arg0.getValue());
                                if (isNaN(d)) {
                                    d = g_oFormatParser.parseDate(arg0.getValue());
                                    if (d == null) {
                                        return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                    }
                                    val = d.value;
                                } else {
                                    val = (d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1));
                                }
                            } else {
                                val = arg0.tocNumber().getValue();
                            }
                        }
                    }
                }
            }
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                val = parseInt(((val * 24 * 60 - Math.floor(val * 24 * 60)) * 60).toFixed(cExcelDateTimeDigits)) % 60;
                return this.setCA(new cNumber(val), true, 0);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( time-value )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "TIME": function () {
        var r = new cBaseFunction("TIME");
        r.setArgumentsMin(3);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var hour = arg[0],
            minute = arg[1],
            second = arg[2];
            if (hour instanceof cArea || hour instanceof cArea3D) {
                hour = hour.cross(arguments[1].first);
            } else {
                if (hour instanceof cArray) {
                    hour = hour.getElement(0);
                }
            }
            if (minute instanceof cArea || minute instanceof cArea3D) {
                minute = minute.cross(arguments[1].first);
            } else {
                if (minute instanceof cArray) {
                    minute = minute.getElement(0);
                }
            }
            if (second instanceof cArea || second instanceof cArea3D) {
                second = second.cross(arguments[1].first);
            } else {
                if (second instanceof cArray) {
                    second = second.getElement(0);
                }
            }
            hour = hour.tocNumber();
            minute = minute.tocNumber();
            second = second.tocNumber();
            if (hour instanceof cError) {
                return this.setCA(hour, true);
            }
            if (minute instanceof cError) {
                return this.setCA(minute, true);
            }
            if (second instanceof cError) {
                return this.setCA(second, true);
            }
            hour = hour.getValue();
            minute = minute.getValue();
            second = second.getValue();
            var v = (hour * 60 * 60 + minute * 60 + second) / c_sPerDay;
            this.setCA(new cNumber(v - Math.floor(v)), true);
            if (arguments[1].getNumFormatStr().toLowerCase() === "general") {
                this.value.numFormat = 18;
            }
            return this.value;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( hour, minute, second )"
            };
        };
        return r;
    },
    "TIMEVALUE": function () {
        var r = new cBaseFunction("TIMEVALUE");
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
            if (arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0) {
                return this.value = new cNumber(parseInt(arg0.tocNumber().getValue()));
            }
            var res = g_oFormatParser.parse(arg0.getValue());
            if (res && res.bDateTime) {
                return this.value = new cNumber(res.value - parseInt(res.value));
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( date-time-string )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "TODAY": function () {
        var r = new cBaseFunction("TODAY");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function () {
            this.setCA(new cNumber(new Date().getExcelDate()), true);
            if (arguments[1].getNumFormatStr().toLowerCase() === "general") {
                this.value.numFormat = 14;
            }
            return this.value;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "()"
            };
        };
        return r;
    },
    "WEEKDAY": function () {
        var r = new cBaseFunction("WEEKDAY");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1] ? arg[1] : new cNumber(1);
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            var weekday;
            switch (arg1.getValue()) {
            case 1:
                case 17:
                weekday = [1, 2, 3, 4, 5, 6, 7];
                break;
            case 2:
                case 11:
                weekday = [7, 1, 2, 3, 4, 5, 6];
                break;
            case 3:
                weekday = [6, 0, 1, 2, 3, 4, 5];
                break;
            case 12:
                weekday = [6, 7, 1, 2, 3, 4, 5];
                break;
            case 13:
                weekday = [5, 6, 7, 1, 2, 3, 4];
                break;
            case 14:
                weekday = [4, 5, 6, 7, 1, 2, 3];
                break;
            case 15:
                weekday = [3, 4, 5, 6, 7, 1, 2];
                break;
            case 16:
                weekday = [2, 3, 4, 5, 6, 7, 1];
                break;
            default:
                return this.value = new cError(cErrorType.not_numeric);
            }
            if (arg0.getValue() < 0) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.value = new cNumber(weekday[new Date((arg0.getValue() - (c_DateCorrectConst + 1)) * c_msPerDay).getDay()]);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( serial-value [ , weekday-start-flag ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "WEEKNUM": function () {
        var r = new cBaseFunction("WEEKNUM");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1] ? arg[1] : new cNumber(1),
            type = 0;
            function WeekNumber(dt, iso, type) {
                dt.setHours(0, 0, 0);
                var startOfYear = new Date(dt.getFullYear(), 0, 1);
                var endOfYear = new Date(dt);
                endOfYear.setMonth(11);
                endOfYear.setDate(31);
                var wk = parseInt(((dt - startOfYear) / c_msPerDay + iso[startOfYear.getDay()]) / 7);
                if (type) {
                    switch (wk) {
                    case 0:
                        startOfYear.setDate(0);
                        return WeekNumber(startOfYear, iso, type);
                    case 53:
                        if (endOfYear.getDay() < 4) {
                            return new cNumber(1);
                        } else {
                            return new cNumber(wk);
                        }
                    default:
                        return new cNumber(wk);
                    }
                } else {
                    wk = parseInt(((dt - startOfYear) / c_msPerDay + iso[startOfYear.getDay()] + 7) / 7);
                    return new cNumber(wk);
                }
            }
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0.getValue() < 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var weekdayStartDay;
            switch (arg1.getValue()) {
            case 1:
                case 17:
                weekdayStartDay = [0, 1, 2, 3, 4, 5, 6];
                break;
            case 2:
                case 11:
                weekdayStartDay = [6, 0, 1, 2, 3, 4, 5];
                break;
            case 12:
                weekdayStartDay = [5, 6, 0, 1, 2, 3, 4];
                break;
            case 13:
                weekdayStartDay = [4, 5, 6, 0, 1, 2, 3];
                break;
            case 14:
                weekdayStartDay = [3, 4, 5, 6, 0, 1, 2];
                break;
            case 15:
                weekdayStartDay = [2, 3, 4, 5, 6, 0, 1];
                break;
            case 16:
                weekdayStartDay = [1, 2, 3, 4, 5, 6, 0];
                break;
            case 21:
                weekdayStartDay = [6, 7, 8, 9, 10, 4, 5];
                type = 1;
                break;
            default:
                return this.value = new cError(cErrorType.not_numeric);
            }
            return this.value = new cNumber(WeekNumber(new Date((arg0.getValue() - (c_DateCorrectConst + 1)) * c_msPerDay), weekdayStartDay, type));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( serial-value [ , weekday-start-flag ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "WORKDAY": function () {
        var r = new cBaseFunction("WORKDAY");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2],
            arrDateIncl = [];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            var val0 = arg0.getValue(),
            val1 = arg1.getValue(),
            holidays = [];
            if (val0 < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            } else {
                if (!g_bDate1904) {
                    if (val0 < 60) {
                        val0 = new Date((val0 - c_DateCorrectConst) * c_msPerDay);
                    } else {
                        if (val0 == 60) {
                            val0 = new Date((val0 - c_DateCorrectConst - 1) * c_msPerDay);
                        } else {
                            val0 = new Date((val0 - c_DateCorrectConst - 1) * c_msPerDay);
                        }
                    }
                } else {
                    val0 = new Date((val0 - c_DateCorrectConst) * c_msPerDay);
                }
            }
            if (arg2) {
                if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
                    var arr = arg2.getValue();
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] instanceof cNumber && arr[i].getValue() >= 0) {
                            holidays.push(arr[i]);
                        }
                    }
                } else {
                    if (arg2 instanceof cArray) {
                        arg2.foreach(function (elem, r, c) {
                            if (elem instanceof cNumber) {
                                holidays.push(elem);
                            } else {
                                if (elem instanceof cString) {
                                    var res = g_oFormatParser.parse(elem.getValue());
                                    if (res && res.bDateTime && res.value >= 0) {
                                        holidays.push(new cNumber(parseInt(res.value)));
                                    }
                                }
                            }
                        });
                    }
                }
            }
            for (var i = 0; i < holidays.length; i++) {
                if (!g_bDate1904) {
                    if (holidays[i].getValue() < 60) {
                        holidays[i] = new Date((holidays[i].getValue() - c_DateCorrectConst) * c_msPerDay);
                    } else {
                        if (holidays[i] == 60) {
                            holidays[i] = new Date((holidays[i].getValue() - c_DateCorrectConst - 1) * c_msPerDay);
                        } else {
                            holidays[i] = new Date((holidays[i].getValue() - c_DateCorrectConst - 1) * c_msPerDay);
                        }
                    }
                } else {
                    holidays[i] = new Date((holidays[i].getValue() - c_DateCorrectConst) * c_msPerDay);
                }
            }
            function notAHolidays(date) {
                for (var i = 0; i < holidays.length; i++) {
                    if (date.getTime() == holidays[i].getTime()) {
                        return false;
                    }
                }
                return true;
            }
            var dif = arg1.getValue(),
            count = 1,
            dif1 = dif > 0 ? 1 : dif < 0 ? -1 : 0,
            val,
            date = val0;
            while (Math.abs(dif) > count) {
                date = new Date(val0.getTime() + dif1 * c_msPerDay);
                if (date.getDay() != 6 && date.getDay() != 0 && notAHolidays(date)) {
                    count++;
                }
                dif >= 0 ? dif1++:dif1--;
            }
            date = new Date(val0.getTime() + dif1 * c_msPerDay);
            val = parseInt((date.getTime() / 1000 - date.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1)));
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            }
            if (arguments[1].getNumFormatStr().toLowerCase() === "general") {
                return this.setCA(new cNumber(val), true, 14);
            } else {
                return this.setCA(new cNumber(val), true);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( start-date , day-offset [ , holidays ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "WORKDAY.INTL": function () {
        var r = new cBaseFunction("WORKDAY.INTL");
        return r;
    },
    "YEAR": function () {
        var r = new cBaseFunction("YEAR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            val;
            if (arg0 instanceof cArray) {
                arg0 = arg0.getElement(0);
            } else {
                if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }
            }
            if (arg0 instanceof cError) {
                return this.setCA(arg0, true);
            } else {
                if (arg0 instanceof cNumber || arg0 instanceof cBool) {
                    val = arg0.tocNumber().getValue();
                } else {
                    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                        return this.setCA(new cError(cErrorType.wrong_value_type), true);
                    } else {
                        if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                            val = arg0.getValue();
                            if (val instanceof cError) {
                                return this.setCA(val, true);
                            } else {
                                if (val instanceof cNumber || val instanceof cBool) {
                                    val = arg0.tocNumber().getValue();
                                } else {
                                    return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                }
                            }
                        } else {
                            if (arg0 instanceof cString) {
                                val = arg0.tocNumber();
                                if (val instanceof cError || val instanceof cEmpty) {
                                    var d = new Date(arg0.getValue());
                                    if (isNaN(d)) {
                                        return this.setCA(new cError(cErrorType.wrong_value_type), true);
                                    } else {
                                        val = Math.floor((d.getTime() / 1000 - d.getTimezoneOffset() * 60) / c_sPerDay + (c_DateCorrectConst + (g_bDate1904 ? 0 : 1)));
                                    }
                                } else {
                                    val = arg0.tocNumber().getValue();
                                }
                            }
                        }
                    }
                }
            }
            if (val < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true, 0);
            } else {
                return this.setCA(new cNumber((new Date((val - (c_DateCorrectConst + 1)) * c_msPerDay)).getUTCFullYear()), true, 0);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( date-value )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "YEARFRAC": function () {
        var r = new cBaseFunction("YEARFRAC");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2] ? arg[2] : new cNumber(0);
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
                arg2 = arg2.cross(arguments[1].first);
            } else {
                if (arg2 instanceof cArray) {
                    arg2 = arg2.getElementRowCol(0, 0);
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
            var val0 = arg0.getValue(),
            val1 = arg1.getValue();
            if (val0 < 0 || val1 < 0) {
                return this.setCA(new cError(cErrorType.not_numeric), true);
            }
            val0 = Date.prototype.getDateFromExcel(val0);
            val1 = Date.prototype.getDateFromExcel(val1);
            var date1 = val0.getDate(),
            date2 = val1.getDate(),
            month1 = val0.getMonth(),
            month2 = val1.getMonth(),
            year1 = val0.getFullYear(),
            year2 = val1.getFullYear();
            switch (arg2.getValue()) {
            case 0:
                return this.value = new cNumber(Math.abs(GetDiffDate360(date1, month1, year1, val1.isLeapYear(), date2, month2, year2, false)) / 360);
                break;
            case 1:
                var yc = Math.abs(year2 - year1),
                sd = year1 > year2 ? val1 : val0,
                yearAverage = sd.isLeapYear() ? 366 : 365,
                dayDiff = Math.abs(val1 - val0);
                for (var i = 0; i < yc; i++) {
                    sd.addYears(1);
                    yearAverage += sd.isLeapYear() ? 366 : 365;
                }
                yearAverage /= (yc + 1);
                dayDiff /= (yearAverage * c_msPerDay);
                return this.value = new cNumber(dayDiff);
                break;
            case 2:
                var dayDiff = Math.abs(val1 - val0);
                dayDiff /= (360 * c_msPerDay);
                return this.value = new cNumber(dayDiff);
                break;
            case 3:
                var dayDiff = Math.abs(val1 - val0);
                dayDiff /= (365 * c_msPerDay);
                return this.value = new cNumber(dayDiff);
                break;
            case 4:
                return this.value = new cNumber(Math.abs(GetDiffDate360(date1, month1, year1, val1.isLeapYear(), date2, month2, year2, true)) / 360);
                break;
            default:
                return this.value = new cError(cErrorType.not_numeric);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(  start-date , end-date [ , basis ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    }
};