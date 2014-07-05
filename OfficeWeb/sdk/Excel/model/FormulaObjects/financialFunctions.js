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
 cFormulaFunction.Financial = {
    "groupName": "Financial",
    "ACCRINT": function () {
        var r = new cBaseFunction("ACCRINT");
        return r;
    },
    "ACCRINTM": function () {
        var r = new cBaseFunction("ACCRINTM");
        return r;
    },
    "AMORDEGRC": function () {
        var r = new cBaseFunction("AMORDEGRC");
        return r;
    },
    "AMORLINC": function () {
        var r = new cBaseFunction("AMORLINC");
        return r;
    },
    "COUPDAYBS": function () {
        var r = new cBaseFunction("COUPDAYBS");
        return r;
    },
    "COUPDAYS": function () {
        var r = new cBaseFunction("COUPDAYS");
        return r;
    },
    "COUPDAYSNC": function () {
        var r = new cBaseFunction("COUPDAYSNC");
        return r;
    },
    "COUPNCD": function () {
        var r = new cBaseFunction("COUPNCD");
        return r;
    },
    "COUPNUM": function () {
        var r = new cBaseFunction("COUPNUM");
        return r;
    },
    "COUPPCD": function () {
        var r = new cBaseFunction("COUPPCD");
        return r;
    },
    "CUMIPMT": function () {
        var r = new cBaseFunction("CUMIPMT");
        return r;
    },
    "CUMPRINC": function () {
        var r = new cBaseFunction("CUMPRINC");
        return r;
    },
    "DB": function () {
        var r = new cBaseFunction("DB");
        return r;
    },
    "DDB": function () {
        var r = new cBaseFunction("DDB");
        return r;
    },
    "DISC": function () {
        var r = new cBaseFunction("DISC");
        return r;
    },
    "DOLLARDE": function () {
        var r = new cBaseFunction("DOLLARDE");
        return r;
    },
    "DOLLARFR": function () {
        var r = new cBaseFunction("DOLLARFR");
        return r;
    },
    "DURATION": function () {
        var r = new cBaseFunction("DURATION");
        return r;
    },
    "EFFECT": function () {
        var r = new cBaseFunction("EFFECT");
        return r;
    },
    "FV": function () {
        var r = new cBaseFunction("FV");
        r.setArgumentsMin(3);
        r.setArgumentsMax(5);
        r.Calculate = function (arg) {
            var rate = arg[0],
            nper = arg[1],
            pmt = arg[2],
            pv = arg[3] ? arg[3] : new cNumber(0),
            type = arg[4] ? arg[4] : new cNumber(0);
            if (rate instanceof cArea || rate instanceof cArea3D) {
                rate = rate.cross(arguments[1].first);
            } else {
                if (rate instanceof cArray) {
                    rate = rate.getElementRowCol(0, 0);
                }
            }
            if (nper instanceof cArea || nper instanceof cArea3D) {
                nper = nper.cross(arguments[1].first);
            } else {
                if (nper instanceof cArray) {
                    nper = nper.getElementRowCol(0, 0);
                }
            }
            if (pmt instanceof cArea || pmt instanceof cArea3D) {
                pmt = pmt.cross(arguments[1].first);
            } else {
                if (pmt instanceof cArray) {
                    pmt = pmt.getElementRowCol(0, 0);
                }
            }
            if (pv instanceof cArea || pv instanceof cArea3D) {
                pv = pv.cross(arguments[1].first);
            } else {
                if (pv instanceof cArray) {
                    pv = pv.getElementRowCol(0, 0);
                }
            }
            if (type instanceof cArea || type instanceof cArea3D) {
                type = type.cross(arguments[1].first);
            } else {
                if (type instanceof cArray) {
                    type = type.getElementRowCol(0, 0);
                }
            }
            rate = rate.tocNumber();
            nper = nper.tocNumber();
            pmt = pmt.tocNumber();
            pv = pv.tocNumber();
            type = type.tocNumber();
            if (rate instanceof cError) {
                return this.value = rate;
            }
            if (nper instanceof cError) {
                return this.value = nper;
            }
            if (pmt instanceof cError) {
                return this.value = pmt;
            }
            if (pv instanceof cError) {
                return this.value = pv;
            }
            if (type instanceof cError) {
                return this.value = type;
            }
            if (type.getValue() != 1 && type.getValue() != 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var res;
            if (rate.getValue() != 0) {
                res = -1 * (pv.getValue() * Math.pow(1 + rate.getValue(), nper.getValue()) + pmt.getValue() * (1 + rate.getValue() * type.getValue()) * (Math.pow((1 + rate.getValue()), nper.getValue()) - 1) / rate.getValue());
            } else {
                res = -1 * (pv.getValue() + pmt.getValue() * nper.getValue());
            }
            return this.value = new cNumber(res);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( rate , nper , pmt [ , [ pv ] [ ,[ type ] ] ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "FVSCHEDULE": function () {
        var r = new cBaseFunction("FVSCHEDULE");
        return r;
    },
    "INTRATE": function () {
        var r = new cBaseFunction("INTRATE");
        return r;
    },
    "IPMT": function () {
        var r = new cBaseFunction("IPMT");
        return r;
    },
    "IRR": function () {
        var r = new cBaseFunction("IRR");
        return r;
    },
    "ISPMT": function () {
        var r = new cBaseFunction("ISPMT");
        return r;
    },
    "MDURATION": function () {
        var r = new cBaseFunction("MDURATION");
        return r;
    },
    "MIRR": function () {
        var r = new cBaseFunction("MIRR");
        return r;
    },
    "NOMINAL": function () {
        var r = new cBaseFunction("NOMINAL");
        return r;
    },
    "NPER": function () {
        var r = new cBaseFunction("NPER");
        r.setArgumentsMin(3);
        r.setArgumentsMax(5);
        r.Calculate = function (arg) {
            var rate = arg[0],
            pmt = arg[1],
            pv = arg[2],
            fv = arg[3] ? arg[3] : new cNumber(0),
            type = arg[4] ? arg[4] : new cNumber(0);
            if (rate instanceof cArea || rate instanceof cArea3D) {
                rate = rate.cross(arguments[1].first);
            } else {
                if (rate instanceof cArray) {
                    rate = rate.getElementRowCol(0, 0);
                }
            }
            if (pmt instanceof cArea || pmt instanceof cArea3D) {
                pmt = pmt.cross(arguments[1].first);
            } else {
                if (pmt instanceof cArray) {
                    pmt = pmt.getElementRowCol(0, 0);
                }
            }
            if (pv instanceof cArea || pv instanceof cArea3D) {
                pv = pv.cross(arguments[1].first);
            } else {
                if (pv instanceof cArray) {
                    pv = pv.getElementRowCol(0, 0);
                }
            }
            if (fv instanceof cArea || fv instanceof cArea3D) {
                fv = fv.cross(arguments[1].first);
            } else {
                if (fv instanceof cArray) {
                    fv = fv.getElementRowCol(0, 0);
                }
            }
            if (type instanceof cArea || type instanceof cArea3D) {
                type = type.cross(arguments[1].first);
            } else {
                if (type instanceof cArray) {
                    type = type.getElementRowCol(0, 0);
                }
            }
            rate = rate.tocNumber();
            pmt = pmt.tocNumber();
            pv = pv.tocNumber();
            fv = fv.tocNumber();
            type = type.tocNumber();
            if (rate instanceof cError) {
                return this.value = rate;
            }
            if (pmt instanceof cError) {
                return this.value = pmt;
            }
            if (pmt instanceof cError) {
                return this.value = pv;
            }
            if (fv instanceof cError) {
                return this.value = fv;
            }
            if (type instanceof cError) {
                return this.value = type;
            }
            if (type.getValue() != 1 && type.getValue() != 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var res;
            if (rate.getValue() != 0) {
                rate = rate.getValue();
                pmt = pmt.getValue();
                pv = pv.getValue();
                fv = fv.getValue();
                type = type.getValue();
                res = (-fv * rate + pmt * (1 + rate * type)) / (rate * pv + pmt * (1 + rate * type));
                res = Math.log(res) / Math.log(1 + rate);
            } else {
                res = -pv.getValue() - fv.getValue() / pmt.getValue();
            }
            return this.value = new cNumber(res);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( rate , pmt , pv [ , [ fv ] [ , [ type ] ] ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "NPV": function () {
        var r = new cBaseFunction("NPV");
        r.setArgumentsMin(2);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            iStart = 1,
            res = 0,
            rate;
            function elemCalc(rate, value, step) {
                return value / Math.pow(1 + rate, step);
            }
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            } else {
                if (arg0 instanceof cArray) {
                    arg0 = arg0.getElementRowCol(0, 0);
                }
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            rate = arg0.getValue();
            if (rate == -1) {
                return this.value = new cError(cErrorType.division_by_zero);
            }
            for (var i = 1; i < this.getArguments(); i++) {
                var argI = arg[i];
                if (argI instanceof cArea || argI instanceof cArea3D) {
                    var argIArr = argI.getValue();
                    for (var j = 0; j < argIArr.length; j++) {
                        if (argIArr[j] instanceof cNumber) {
                            res += elemCalc(rate, argIArr[j].getValue(), iStart++);
                        }
                    }
                    continue;
                } else {
                    if (argI instanceof cArray) {
                        argI.foreach(function (elem, r, c) {
                            if (elem instanceof cNumber) {
                                res += elemCalc(rate, elem.getValue(), iStart++);
                            }
                        });
                        continue;
                    }
                }
                argI = argI.tocNumber();
                if (argI instanceof cError) {
                    continue;
                }
                res += elemCalc(rate, argI.getValue(), iStart++);
            }
            return this.value = new cNumber(res);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( rate , argument-list )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "ODDFPRICE": function () {
        var r = new cBaseFunction("ODDFPRICE");
        return r;
    },
    "ODDFYIELD": function () {
        var r = new cBaseFunction("ODDFYIELD");
        return r;
    },
    "ODDLPRICE": function () {
        var r = new cBaseFunction("ODDLPRICE");
        return r;
    },
    "ODDLYIELD": function () {
        var r = new cBaseFunction("ODDLYIELD");
        return r;
    },
    "PMT": function () {
        var r = new cBaseFunction("PMT");
        r.setArgumentsMin(3);
        r.setArgumentsMax(5);
        r.Calculate = function (arg) {
            var rate = arg[0],
            nper = arg[1],
            pv = arg[2],
            fv = arg[3] ? arg[3] : new cNumber(0),
            type = arg[4] ? arg[4] : new cNumber(0);
            if (rate instanceof cArea || rate instanceof cArea3D) {
                rate = rate.cross(arguments[1].first);
            } else {
                if (rate instanceof cArray) {
                    rate = rate.getElementRowCol(0, 0);
                }
            }
            if (nper instanceof cArea || nper instanceof cArea3D) {
                nper = nper.cross(arguments[1].first);
            } else {
                if (nper instanceof cArray) {
                    nper = nper.getElementRowCol(0, 0);
                }
            }
            if (pv instanceof cArea || pv instanceof cArea3D) {
                pv = pv.cross(arguments[1].first);
            } else {
                if (pv instanceof cArray) {
                    pv = pv.getElementRowCol(0, 0);
                }
            }
            if (fv instanceof cArea || fv instanceof cArea3D) {
                fv = fv.cross(arguments[1].first);
            } else {
                if (fv instanceof cArray) {
                    fv = fv.getElementRowCol(0, 0);
                }
            }
            if (type instanceof cArea || type instanceof cArea3D) {
                type = type.cross(arguments[1].first);
            } else {
                if (type instanceof cArray) {
                    type = type.getElementRowCol(0, 0);
                }
            }
            rate = rate.tocNumber();
            nper = nper.tocNumber();
            pv = pv.tocNumber();
            fv = fv.tocNumber();
            type = type.tocNumber();
            if (rate instanceof cError) {
                return this.value = rate;
            }
            if (nper instanceof cError) {
                return this.value = nper;
            }
            if (nper.getValue() == 0) {
                return this.value = new cError(cErrorType.division_by_zero);
            }
            if (pv instanceof cError) {
                return this.value = pv;
            }
            if (fv instanceof cError) {
                return this.value = fv;
            }
            if (type instanceof cError) {
                return this.value = type;
            }
            if (type.getValue() != 1 && type.getValue() != 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var res;
            if (rate.getValue() != 0) {
                res = -1 * (pv.getValue() * Math.pow(1 + rate.getValue(), nper.getValue()) + fv.getValue()) / ((1 + rate.getValue() * type.getValue()) * (Math.pow((1 + rate.getValue()), nper.getValue()) - 1) / rate.getValue());
            } else {
                res = -1 * (pv.getValue() + fv.getValue()) / nper.getValue();
            }
            return this.value = new cNumber(res);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( rate , nper , pv [ , [ fv ] [ ,[ type ] ] ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "PPMT": function () {
        var r = new cBaseFunction("PPMT");
        return r;
    },
    "PRICE": function () {
        var r = new cBaseFunction("PRICE");
        return r;
    },
    "PRICEDISC": function () {
        var r = new cBaseFunction("PRICEDISC");
        return r;
    },
    "PRICEMAT": function () {
        var r = new cBaseFunction("PRICEMAT");
        return r;
    },
    "PV": function () {
        var r = new cBaseFunction("PV");
        r.setArgumentsMin(3);
        r.setArgumentsMax(5);
        r.Calculate = function (arg) {
            var rate = arg[0],
            nper = arg[1],
            pmt = arg[2],
            fv = arg[3] ? arg[3] : new cNumber(0),
            type = arg[4] ? arg[4] : new cNumber(0);
            if (rate instanceof cArea || rate instanceof cArea3D) {
                rate = rate.cross(arguments[1].first);
            } else {
                if (rate instanceof cArray) {
                    rate = rate.getElementRowCol(0, 0);
                }
            }
            if (nper instanceof cArea || nper instanceof cArea3D) {
                nper = nper.cross(arguments[1].first);
            } else {
                if (nper instanceof cArray) {
                    nper = nper.getElementRowCol(0, 0);
                }
            }
            if (pmt instanceof cArea || pmt instanceof cArea3D) {
                pmt = pmt.cross(arguments[1].first);
            } else {
                if (pmt instanceof cArray) {
                    pmt = pmt.getElementRowCol(0, 0);
                }
            }
            if (fv instanceof cArea || fv instanceof cArea3D) {
                fv = fv.cross(arguments[1].first);
            } else {
                if (fv instanceof cArray) {
                    fv = fv.getElementRowCol(0, 0);
                }
            }
            if (type instanceof cArea || type instanceof cArea3D) {
                type = type.cross(arguments[1].first);
            } else {
                if (type instanceof cArray) {
                    type = type.getElementRowCol(0, 0);
                }
            }
            rate = rate.tocNumber();
            nper = nper.tocNumber();
            pmt = pmt.tocNumber();
            fv = fv.tocNumber();
            type = type.tocNumber();
            if (rate instanceof cError) {
                return this.value = rate;
            }
            if (nper instanceof cError) {
                return this.value = nper;
            }
            if (pmt instanceof cError) {
                return this.value = pmt;
            }
            if (fv instanceof cError) {
                return this.value = fv;
            }
            if (type instanceof cError) {
                return this.value = type;
            }
            if (type.getValue() != 1 && type.getValue() != 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            var res;
            if (rate.getValue() != 0) {
                res = -1 * (fv.getValue() + pmt.getValue() * (1 + rate.getValue() * type.getValue()) * ((Math.pow((1 + rate.getValue()), nper.getValue()) - 1) / rate.getValue())) / Math.pow(1 + rate.getValue(), nper.getValue());
            } else {
                res = -1 * (fv.getValue() + pmt.getValue() * nper.getValue());
            }
            return this.value = new cNumber(res);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( rate , nper , pmt [ , [ fv ] [ ,[ type ] ] ] )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "RATE": function () {
        var r = new cBaseFunction("RATE");
        return r;
    },
    "RECEIVED": function () {
        var r = new cBaseFunction("RECEIVED");
        return r;
    },
    "SLN": function () {
        var r = new cBaseFunction("SLN");
        return r;
    },
    "SYD": function () {
        var r = new cBaseFunction("SYD");
        return r;
    },
    "TBILLEQ": function () {
        var r = new cBaseFunction("TBILLEQ");
        return r;
    },
    "TBILLPRICE": function () {
        var r = new cBaseFunction("TBILLPRICE");
        return r;
    },
    "TBILLYIELD": function () {
        var r = new cBaseFunction("TBILLYIELD");
        return r;
    },
    "VDB": function () {
        var r = new cBaseFunction("VDB");
        return r;
    },
    "XIRR": function () {
        var r = new cBaseFunction("XIRR");
        return r;
    },
    "XNPV": function () {
        var r = new cBaseFunction("XNPV");
        return r;
    },
    "YIELD": function () {
        var r = new cBaseFunction("YIELD");
        return r;
    },
    "YIELDDISC": function () {
        var r = new cBaseFunction("YIELDDISC");
        return r;
    },
    "YIELDMAT": function () {
        var r = new cBaseFunction("YIELDMAT");
        return r;
    }
};