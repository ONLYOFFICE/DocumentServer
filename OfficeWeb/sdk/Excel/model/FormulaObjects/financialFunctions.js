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
var startRangeCurrentDateSystem = 1;
function getPMT(rate, nper, pv, fv, flag) {
    var res, part;
    if (rate === 0) {
        res = (pv + fv) / nper;
    } else {
        part = Math.pow(1 + rate, nper);
        if (flag > 0) {
            res = (fv * rate / (part - 1) + pv * rate / (1 - 1 / part)) / (1 + rate);
        } else {
            res = fv * rate / (part - 1) + pv * rate / (1 - 1 / part);
        }
    }
    return -res;
}
function getFV(rate, nper, pmt, pv, type) {
    var res, part;
    if (rate === 0) {
        res = pv + pmt * nper;
    } else {
        part = Math.pow(1 + rate, nper);
        if (type > 0) {
            res = pv * part + pmt * (1 + rate) * (part - 1) / rate;
        } else {
            res = pv * part + pmt * (part - 1) / rate;
        }
    }
    return -res;
}
function getDDB(cost, salvage, life, period, factor) {
    var ddb, ipmt, oldCost, newCost;
    ipmt = factor / life;
    if (ipmt >= 1) {
        ipmt = 1;
        if (period === 1) {
            oldCost = cost;
        } else {
            oldCost = 0;
        }
    } else {
        oldCost = cost * Math.pow(1 - ipmt, period - 1);
    }
    newCost = cost * Math.pow(1 - ipmt, period);
    if (newCost < salvage) {
        ddb = oldCost - salvage;
    } else {
        ddb = oldCost - newCost;
    }
    if (ddb < 0) {
        ddb = 0;
    }
    return ddb;
}
function getIPMT(rate, per, pv, type, pmt) {
    var ipmt;
    if (per === 1) {
        if (type > 0) {
            ipmt = 0;
        } else {
            ipmt = -pv;
        }
    } else {
        if (type > 0) {
            ipmt = getFV(rate, per - 2, pmt, pv, 1) - pmt;
        } else {
            ipmt = getFV(rate, per - 1, pmt, pv, 0);
        }
    }
    return ipmt * rate;
}
function RateIteration(nper, payment, pv, fv, payType, guess) {
    var valid = true,
    found = false,
    x, xnew, term, termDerivation, geoSeries, geoSeriesDerivation, iterationMax = 150,
    nCount = 0,
    minEps = 1e-14,
    eps = 1e-07,
    powN, powNminus1;
    fv = fv - payment * payType;
    pv = pv + payment * payType;
    if (nper === Math.round(nper)) {
        x = guess;
        while (!found && nCount < iterationMax) {
            powNminus1 = Math.pow(1 + x, nper - 1);
            powN = powNminus1 * (1 + x);
            if (Math.approxEqual(Math.abs(x), 0)) {
                geoSeries = nper;
                geoSeriesDerivation = nper * (nper - 1) / 2;
            } else {
                geoSeries = (powN - 1) / x;
                geoSeriesDerivation = (nper * powNminus1 - geoSeries) / x;
            }
            term = fv + pv * powN + payment * geoSeries;
            termDerivation = pv * nper * powNminus1 + payment * geoSeriesDerivation;
            if (Math.abs(term) < minEps) {
                found = true;
            } else {
                if (Math.approxEqual(Math.abs(termDerivation), 0)) {
                    xnew = x + 1.1 * eps;
                } else {
                    xnew = x - term / termDerivation;
                }
                nCount++;
                found = (Math.abs(xnew - x) < eps);
                x = xnew;
            }
        }
        valid = (x >= -1);
    } else {
        x = (guess < -1) ? -1 : guess;
        while (valid && !found && nCount < iterationMax) {
            if (Math.approxEqual(Math.abs(x), 0)) {
                geoSeries = nper;
                geoSeriesDerivation = nper * (nper - 1) / 2;
            } else {
                geoSeries = (Math.pow(1 + x, nper) - 1) / x;
                geoSeriesDerivation = nper * Math.pow(1 + x, nper - 1) / x - geoSeries / x;
            }
            term = fv + pv * Math.pow(1 + x, nper) + payment * geoSeries;
            termDerivation = pv * nper * Math.pow(1 + x, nper - 1) + payment * geoSeriesDerivation;
            if (Math.abs(term) < minEps) {
                found = true;
            } else {
                if (Math.approxEqual(Math.abs(termDerivation), 0)) {
                    xnew = x + 1.1 * eps;
                } else {
                    xnew = x - term / termDerivation;
                }
                nCount++;
                found = (Math.abs(xnew - x) < eps);
                x = xnew;
                valid = (x >= -1);
            }
        }
    }
    if (valid && found) {
        return new cNumber(x);
    } else {
        return new cError(cErrorType.not_numeric);
    }
}
function lcl_GetCouppcd(settl, matur, freq) {
    var n = new Date(matur);
    n.setUTCFullYear(settl.getUTCFullYear());
    if (n < settl) {
        n.addYears(1);
    }
    while (n > settl) {
        n.addMonths(-12 / freq);
    }
    return n;
}
function lcl_GetCoupncd(settl, matur, freq) {
    matur.setUTCFullYear(settl.getUTCFullYear());
    if (matur > settl) {
        matur.addYears(-1);
    }
    while (matur < settl) {
        matur.addMonths(12 / freq);
    }
}
function getcoupdaybs(settl, matur, frequency, basis) {
    var n = lcl_GetCouppcd(settl, matur, frequency);
    return diffDate(n, settl, basis);
}
function getcoupdays(settl, matur, frequency, basis) {
    if (basis == DayCountBasis.ActualActual) {
        var m = lcl_GetCouppcd(settl, matur, frequency),
        n = new Date(m);
        n.addMonths(12 / frequency);
        return diffDate(m, n, basis);
    }
    return new cNumber(daysInYear(0, basis) / frequency);
}
function getcoupnum(settl, matur, frequency) {
    var n = lcl_GetCouppcd(settl, matur, frequency),
    months = (matur.getUTCFullYear() - n.getUTCFullYear()) * 12 + matur.getUTCMonth() - n.getUTCMonth();
    return Math.ceil(months * frequency / 12);
}
function getcoupdaysnc(settl, matur, frequency, basis) {
    if ((basis !== 0) && (basis !== 4)) {
        lcl_GetCoupncd(settl, matur, frequency);
        return diffDate(settl, matur, basis);
    }
    return getcoupdays(new Date(settl), new Date(matur), frequency, basis) - getcoupdaybs(new Date(settl), new Date(matur), frequency, basis);
}
function getcoupncd(settl, matur, frequency) {
    var s = new Date(settl),
    m = new Date(matur);
    lcl_GetCoupncd(s, m, frequency);
    return m;
}
function getprice(settle, mat, rate, yld, redemp, freq, base) {
    var cdays = getcoupdays(new Date(settle), new Date(mat), freq, base),
    cnum = getcoupnum(new Date(settle), new Date(mat), freq),
    cdaybs = getcoupdaybs(new Date(settle), new Date(mat), freq, base),
    cdaysnc = (cdays - cdaybs) / cdays,
    fT1 = 100 * rate / freq,
    fT2 = 1 + yld / freq,
    res = redemp / (Math.pow(1 + yld / freq, cnum - 1 + cdaysnc));
    if (cnum == 1) {
        return (redemp + fT1) / (1 + cdaysnc * yld / freq) - 100 * rate / freq * cdaybs / cdays;
    }
    res -= 100 * rate / freq * cdaybs / cdays;
    for (var i = 0; i < cnum; i++) {
        res += fT1 / Math.pow(fT2, i + cdaysnc);
    }
    return res;
}
function getYield(settle, mat, coup, price, redemp, freq, base) {
    var priceN = 0,
    yield1 = 0,
    yield2 = 1,
    price1 = getprice(settle, mat, coup, yield1, redemp, freq, base),
    price2 = getprice(settle, mat, coup, yield2, redemp, freq, base),
    yieldN = (yield2 - yield1) * 0.5;
    for (var i = 0; i < 100 && priceN != price; i++) {
        priceN = getprice(settle, mat, coup, yieldN, redemp, freq, base);
        if (price == price1) {
            return yield1;
        } else {
            if (price == price2) {
                return yield2;
            } else {
                if (price == priceN) {
                    return yieldN;
                } else {
                    if (price < price2) {
                        yield2 *= 2;
                        price2 = getprice(settle, mat, coup, yield2, redemp, freq, base);
                        yieldN = (yield2 - yield1) * 0.5;
                    } else {
                        if (price < priceN) {
                            yield1 = yieldN;
                            price1 = priceN;
                        } else {
                            yield2 = yieldN;
                            price2 = priceN;
                        }
                        yieldN = yield2 - (yield2 - yield1) * ((price - price2) / (price1 - price2));
                    }
                }
            }
        }
    }
    if (Math.abs(price - priceN) > price / 100) {
        return new cError(cErrorType.not_numeric);
    }
    return new cNumber(yieldN);
}
function getyieldmat(settle, mat, issue, rate, price, base) {
    var issMat = yearFrac(issue, mat, base);
    var issSet = yearFrac(issue, settle, base);
    var setMat = yearFrac(settle, mat, base);
    var y = (1 + issMat * rate) / (price / 100 + issSet * rate) - 1;
    y /= setMat;
    return y;
}
function getduration(settlement, maturity, coupon, yld, frequency, basis) {
    var dbc = getcoupdaybs(new Date(settlement), new Date(maturity), frequency, basis),
    coupD = getcoupdays(new Date(settlement), new Date(maturity), frequency, basis),
    numCoup = getcoupnum(new Date(settlement), new Date(maturity), frequency);
    var duration = 0,
    p = 0;
    var dsc = coupD - dbc;
    var diff = dsc / coupD - 1;
    yld = yld / frequency + 1;
    coupon *= 100 / frequency;
    for (var index = 1; index <= numCoup; index++) {
        var di = index + diff;
        var yldPOW = Math.pow(yld, di);
        duration += di * coupon / yldPOW;
        p += coupon / yldPOW;
    }
    duration += (diff + numCoup) * 100 / Math.pow(yld, diff + numCoup);
    p += 100 / Math.pow(yld, diff + numCoup);
    return duration / p / frequency;
}
function oddFPrice(settl, matur, iss, firstCoup, rate, yld, redemption, frequency, basis) {
    function positiveDaysBetween(d1, d2, b) {
        var res = diffDate(d1, d2, b).getValue();
        return res > 0 ? res : 0;
    }
    function addMonth(orgDate, numMonths, returnLastDay) {
        var newDate = new Date(orgDate);
        newDate.addMonths(numMonths);
        if (returnLastDay) {
            newDate.setUTCDate(newDate.getDaysInMonth());
        }
        return newDate;
    }
    function coupNumber(startDate, endDate, countMonths, isWholeNumber) {
        var my = startDate.getUTCFullYear(),
        mm = startDate.getUTCMonth(),
        md = startDate.getUTCDate(),
        endOfMonthTemp = startDate.lastDayOfMonth(),
        endOfMonth = (!endOfMonthTemp && mm != 1 && md > 28 && md < new Date(my, mm).getDaysInMonth()) ? endDate.lastDayOfMonth() : endOfMonthTemp,
        startDate = addMonth(endDate, 0, endOfMonth),
        coupons = (isWholeNumber - 0) + (endDate < startDate),
        frontDate = addMonth(startDate, countMonths, endOfMonth);
        while (! (countMonths > 0 ? frontDate >= endDate : frontDate <= endDate)) {
            frontDate = addMonth(frontDate, countMonths, endOfMonth);
            coupons++;
        }
        return coupons;
    }
    var res = 0,
    DSC, numMonths = 12 / frequency,
    numMonthsNeg = -numMonths,
    E = getcoupdays(settl, new Date(firstCoup), frequency, basis).getValue(),
    coupNums = getcoupnum(settl, new Date(matur), frequency),
    dfc = positiveDaysBetween(new Date(iss), new Date(firstCoup), basis);
    if (dfc < E) {
        DSC = positiveDaysBetween(settl, firstCoup, basis);
        rate *= 100 / frequency;
        yld /= frequency;
        yld++;
        DSC /= E;
        res = redemption / Math.pow(yld, (coupNums - 1 + DSC));
        res += rate * dfc / E / Math.pow(yld, DSC);
        res -= rate * positiveDaysBetween(iss, settl, basis) / E;
        for (var i = 1; i < coupNums; i++) {
            res += rate / Math.pow(yld, (i + DSC));
        }
    } else {
        var nc = getcoupnum(iss, firstCoup, frequency),
        lateCoupon = new Date(firstCoup),
        DCdivNL = 0,
        AdivNL = 0,
        startDate,
        endDate,
        earlyCoupon,
        NLi,
        DCi;
        for (var index = nc; index >= 1; index--) {
            earlyCoupon = addMonth(lateCoupon, numMonthsNeg, false);
            NLi = basis == DayCountBasis.ActualActual ? positiveDaysBetween(earlyCoupon, lateCoupon, basis) : E;
            DCi = index > 1 ? NLi : positiveDaysBetween(iss, lateCoupon, basis);
            startDate = iss > earlyCoupon ? iss : earlyCoupon;
            endDate = settl < lateCoupon ? settl : lateCoupon;
            lateCoupon = new Date(earlyCoupon);
            DCdivNL += DCi / NLi;
            AdivNL += positiveDaysBetween(startDate, endDate, basis) / NLi;
        }
        if (basis == DayCountBasis.Actual360 || basis == DayCountBasis.Actual365) {
            DSC = positiveDaysBetween(settl, getcoupncd(settl, firstCoup, frequency), basis);
        } else {
            DSC = E - diffDate(lcl_GetCouppcd(settl, firstCoup, frequency), settl, basis);
        }
        var Nq = coupNumber(firstCoup, settl, numMonths, true);
        coupNums = getcoupnum(firstCoup, matur, frequency);
        yld /= frequency;
        yld++;
        DSC /= E;
        rate *= 100 / frequency;
        for (var i = 1; i <= coupNums; i++) {
            res += 1 / Math.pow(yld, (i + Nq + DSC));
        }
        res *= rate;
        res += redemption / Math.pow(yld, (DSC + Nq + coupNums));
        res += rate * DCdivNL / Math.pow(yld, (Nq + DSC));
        res -= rate * AdivNL;
    }
    return res;
}
cFormulaFunction.Financial = {
    "groupName": "Financial",
    "ACCRINT": cACCRINT,
    "ACCRINTM": cACCRINTM,
    "AMORDEGRC": cAMORDEGRC,
    "AMORLINC": cAMORLINC,
    "COUPDAYBS": cCOUPDAYBS,
    "COUPDAYS": cCOUPDAYS,
    "COUPDAYSNC": cCOUPDAYSNC,
    "COUPNCD": cCOUPNCD,
    "COUPNUM": cCOUPNUM,
    "COUPPCD": cCOUPPCD,
    "CUMIPMT": cCUMIPMT,
    "CUMPRINC": cCUMPRINC,
    "DB": cDB,
    "DDB": cDDB,
    "DISC": cDISC,
    "DOLLARDE": cDOLLARDE,
    "DOLLARFR": cDOLLARFR,
    "DURATION": cDURATION,
    "EFFECT": cEFFECT,
    "FV": cFV,
    "FVSCHEDULE": cFVSCHEDULE,
    "INTRATE": cINTRATE,
    "IPMT": cIPMT,
    "IRR": cIRR,
    "ISPMT": cISPMT,
    "MDURATION": cMDURATION,
    "MIRR": cMIRR,
    "NOMINAL": cNOMINAL,
    "NPER": cNPER,
    "NPV": cNPV,
    "ODDFPRICE": cODDFPRICE,
    "ODDFYIELD": cODDFYIELD,
    "ODDLPRICE": cODDLPRICE,
    "ODDLYIELD": cODDLYIELD,
    "PMT": cPMT,
    "PPMT": cPPMT,
    "PRICE": cPRICE,
    "PRICEDISC": cPRICEDISC,
    "PRICEMAT": cPRICEMAT,
    "PV": cPV,
    "RATE": cRATE,
    "RECEIVED": cRECEIVED,
    "SLN": cSLN,
    "SYD": cSYD,
    "TBILLEQ": cTBILLEQ,
    "TBILLPRICE": cTBILLPRICE,
    "TBILLYIELD": cTBILLYIELD,
    "VDB": cVDB,
    "XIRR": cXIRR,
    "XNPV": cXNPV,
    "YIELD": cYIELD,
    "YIELDDISC": cYIELDDISC,
    "YIELDMAT": cYIELDMAT
};
function cACCRINT() {
    this.name = "ACCRINT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 8;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cACCRINT.prototype = Object.create(cBaseFunction.prototype);
cACCRINT.prototype.Calculate = function (arg) {
    var issue = arg[0],
    firstInterest = arg[1],
    settlement = arg[2],
    rate = arg[3],
    par = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(1000),
    frequency = arg[5],
    basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber(0),
    calcMethod = arg[7] && !(arg[7] instanceof cEmpty) ? arg[7] : new cBool(true);
    if (issue instanceof cArea || issue instanceof cArea3D) {
        issue = issue.cross(arguments[1].first);
    } else {
        if (issue instanceof cArray) {
            issue = issue.getElementRowCol(0, 0);
        }
    }
    if (firstInterest instanceof cArea || firstInterest instanceof cArea3D) {
        firstInterest = firstInterest.cross(arguments[1].first);
    } else {
        if (firstInterest instanceof cArray) {
            firstInterest = firstInterest.getElementRowCol(0, 0);
        }
    }
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (par instanceof cArea || par instanceof cArea3D) {
        par = par.cross(arguments[1].first);
    } else {
        if (par instanceof cArray) {
            par = par.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    if (calcMethod instanceof cArea || calcMethod instanceof cArea3D) {
        calcMethod = calcMethod.cross(arguments[1].first);
    } else {
        if (calcMethod instanceof cArray) {
            calcMethod = calcMethod.getElementRowCol(0, 0);
        }
    }
    issue = issue.tocNumber();
    firstInterest = firstInterest.tocNumber();
    settlement = settlement.tocNumber();
    rate = rate.tocNumber();
    par = par.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    calcMethod = calcMethod.tocBool();
    if (issue instanceof cError) {
        return this.value = issue;
    }
    if (firstInterest instanceof cError) {
        return this.value = firstInterest;
    }
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (par instanceof cError) {
        return this.value = par;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    if (calcMethod instanceof cError) {
        return this.value = calcMethod;
    }
    issue = Math.floor(issue.getValue());
    firstInterest = Math.floor(firstInterest.getValue());
    settlement = Math.floor(settlement.getValue());
    rate = rate.getValue();
    par = par.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    calcMethod = calcMethod.toBool();
    if (issue < startRangeCurrentDateSystem || firstInterest < startRangeCurrentDateSystem || settlement < startRangeCurrentDateSystem || issue >= settlement || rate <= 0 || par <= 0 || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    function addMonth(orgDate, numMonths, returnLastDay) {
        var newDate = new Date(orgDate);
        newDate.addMonths(numMonths);
        if (returnLastDay) {
            newDate.setUTCDate(newDate.getDaysInMonth());
        }
        return newDate;
    }
    var iss = Date.prototype.getDateFromExcel(issue),
    fInter = Date.prototype.getDateFromExcel(firstInterest),
    settl = Date.prototype.getDateFromExcel(settlement),
    numMonths = 12 / frequency,
    numMonthsNeg = -numMonths,
    endMonth = fInter.lastDayOfMonth(),
    coupPCD,
    firstDate,
    startDate,
    endDate,
    res,
    days,
    coupDays;
    if (settl > fInter && calcMethod) {
        coupPCD = new Date(fInter);
        startDate = endDate = new Date(settl);
        while (! (numMonths > 0 ? coupPCD >= startDate : coupPCD <= startDate)) {
            endDate = coupPCD;
            coupPCD = addMonth(coupPCD, numMonths, endMonth);
        }
    } else {
        coupPCD = addMonth(fInter, numMonthsNeg, endMonth);
    }
    firstDate = new Date(iss > coupPCD ? iss : coupPCD);
    days = days360(firstDate, settl, basis);
    coupDays = getcoupdays(coupPCD, fInter, frequency, basis).getValue();
    res = days / coupDays;
    startDate = new Date(coupPCD);
    endDate = iss;
    while (! (numMonthsNeg > 0 ? startDate >= iss : startDate <= iss)) {
        endDate = startDate;
        startDate = addMonth(startDate, numMonthsNeg, endMonth);
        firstDate = iss > startDate ? iss : startDate;
        if (basis == DayCountBasis.UsPsa30_360) {
            days = days360(firstDate, endDate, !(iss > startDate));
            coupDays = getcoupdays(startDate, endDate, frequency, basis).getValue();
        } else {
            days = diffDate(firstDate, endDate, basis).getValue();
            coupDays = (basis == DayCountBasis.Actual365) ? (365 / frequency) : diffDate(startDate, endDate, basis).getValue();
        }
        res += (iss <= startDate) ? calcMethod : days / coupDays;
    }
    res *= par * rate / frequency;
    return this.value = new cNumber(res);
};
cACCRINT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( issue , first-interest , settlement , rate , [ par ] , frequency [ , [ basis ] ] )"
    };
};
function cACCRINTM() {
    this.name = "ACCRINTM";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cACCRINTM.prototype = Object.create(cBaseFunction.prototype);
cACCRINTM.prototype.Calculate = function (arg) {
    var issue = arg[0],
    settlement = arg[1],
    rate = arg[2],
    par = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(1000),
    basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0);
    if (issue instanceof cArea || issue instanceof cArea3D) {
        issue = issue.cross(arguments[1].first);
    } else {
        if (issue instanceof cArray) {
            issue = issue.getElementRowCol(0, 0);
        }
    }
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (par instanceof cArea || par instanceof cArea3D) {
        par = par.cross(arguments[1].first);
    } else {
        if (par instanceof cArray) {
            par = par.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    issue = issue.tocNumber();
    settlement = settlement.tocNumber();
    rate = rate.tocNumber();
    par = par.tocNumber();
    basis = basis.tocNumber();
    if (issue instanceof cError) {
        return this.value = issue;
    }
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (par instanceof cError) {
        return this.value = par;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    issue = Math.floor(issue.getValue());
    settlement = Math.floor(settlement.getValue());
    rate = rate.getValue();
    par = par.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || issue < startRangeCurrentDateSystem || issue >= settlement || rate <= 0 || par <= 0 || basis < 0 || basis > 4) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var res = yearFrac(Date.prototype.getDateFromExcel(issue), Date.prototype.getDateFromExcel(settlement), basis);
    res *= rate * par;
    return this.value = new cNumber(res);
};
cACCRINTM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( issue , settlement , rate , [ [ par ] [ , [ basis ] ] ] )"
    };
};
function cAMORDEGRC() {
    this.name = "AMORDEGRC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cAMORDEGRC.prototype = Object.create(cBaseFunction.prototype);
cAMORDEGRC.prototype.Calculate = function (arg) {
    var cost = arg[0],
    datePurch = arg[1],
    firstPer = arg[2],
    salvage = arg[3],
    period = arg[4],
    rate = arg[5],
    basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber(0);
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (datePurch instanceof cArea || datePurch instanceof cArea3D) {
        datePurch = datePurch.cross(arguments[1].first);
    } else {
        if (datePurch instanceof cArray) {
            datePurch = datePurch.getElementRowCol(0, 0);
        }
    }
    if (firstPer instanceof cArea || firstPer instanceof cArea3D) {
        firstPer = firstPer.cross(arguments[1].first);
    } else {
        if (firstPer instanceof cArray) {
            firstPer = firstPer.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (period instanceof cArea || period instanceof cArea3D) {
        period = period.cross(arguments[1].first);
    } else {
        if (period instanceof cArray) {
            period = period.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    datePurch = datePurch.tocNumber();
    firstPer = firstPer.tocNumber();
    salvage = salvage.tocNumber();
    period = period.tocNumber();
    rate = rate.tocNumber();
    basis = basis.tocNumber();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (datePurch instanceof cError) {
        return this.value = datePurch;
    }
    if (firstPer instanceof cError) {
        return this.value = firstPer;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (period instanceof cError) {
        return this.value = period;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    rate = rate.getValue();
    cost = cost.getValue();
    salvage = salvage.getValue();
    period = period.getValue();
    basis = Math.floor(basis.getValue());
    datePurch = datePurch.getValue();
    firstPer = firstPer.getValue();
    if (cost < 0 || salvage < 0 || period < 0 || rate <= 0 || basis == 2 || basis < 0 || basis > 4 || firstPer < 0 || datePurch < 0 || datePurch > firstPer || cost < salvage) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    if (cost == salvage) {
        return this.value = new cNumber(0);
    }
    datePurch = Date.prototype.getDateFromExcel(datePurch);
    firstPer = Date.prototype.getDateFromExcel(firstPer);
    function findDepr(countedPeriod, depr, rate, cost) {
        if (countedPeriod > period) {
            return new cNumber(Math.round(depr));
        } else {
            countedPeriod++;
        }
        var calcT = assetLife - countedPeriod,
        deprTemp = calcT == 2 ? cost * 0.5 : rate * cost;
        rate = (calcT == 2 ? 1 : rate);
        if (cost < salvage) {
            if (cost - salvage < 0) {
                depr = 0;
            } else {
                depr = cost - salvage;
            }
        } else {
            depr = deprTemp;
        }
        cost -= depr;
        return findDepr(countedPeriod, depr, rate, cost);
    }
    function firstDeprLinc(cost, datePurch, firstP, salvage, rate, per, basis) {
        function fix29February(d) {
            if ((basis == DayCountBasis.ActualActual || basis == DayCountBasis.Actual365) && d.isLeapYear() && d.getUTCMonth() == 2 && d.getUTCDate() >= 28) {
                return new Date(d.getUTCFullYear(), d.getUTCMonth(), 28);
            } else {
                return d;
            }
        }
        var firstLen = diffDate(fix29February(datePurch), fix29February(firstP), basis),
        firstDeprTemp = firstLen / daysInYear(datePurch, basis) * rate * cost,
        firstDepr = firstDeprTemp == 0 ? cost * rate : firstDeprTemp,
        period = firstDeprTemp == 0 ? per : per + 1,
        availDepr = cost - salvage;
        if (firstDepr > availDepr) {
            return [availDepr, period];
        } else {
            return [firstDepr, period];
        }
    }
    var per = Math.ceil(1 / rate),
    coeff;
    if (cost == salvage || period > per) {
        this.value = new cNumber(0);
    } else {
        if (per >= 3 && per < 5) {
            coeff = 1.5;
        } else {
            if (per >= 5 && per < 6) {
                coeff = 2;
            } else {
                if (per >= 6) {
                    coeff = 2.5;
                } else {
                    this.value = new cError(cErrorType.not_numeric);
                }
            }
        }
        var deprR = rate * coeff,
        o = firstDeprLinc(cost, datePurch, firstPer, salvage, deprR, per, basis);
        var firstDeprLinc = o[0],
        assetLife = o[1],
        firstDepr = Math.round(firstDeprLinc);
        if (period == 0) {
            this.value = new cNumber(firstDepr);
        } else {
            this.value = findDepr(1, 0, deprR, (cost - firstDepr));
        }
    }
    return this.value;
};
cAMORDEGRC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , date-purchased , first-period , salvage , period , rate [ , [ basis ] ] )"
    };
};
function cAMORLINC() {
    this.name = "AMORLINC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cAMORLINC.prototype = Object.create(cBaseFunction.prototype);
cAMORLINC.prototype.Calculate = function (arg) {
    var cost = arg[0],
    datePurch = arg[1],
    firstPer = arg[2],
    salvage = arg[3],
    period = arg[4],
    rate = arg[5],
    basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber(0);
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (datePurch instanceof cArea || datePurch instanceof cArea3D) {
        datePurch = datePurch.cross(arguments[1].first);
    } else {
        if (datePurch instanceof cArray) {
            datePurch = datePurch.getElementRowCol(0, 0);
        }
    }
    if (firstPer instanceof cArea || firstPer instanceof cArea3D) {
        firstPer = firstPer.cross(arguments[1].first);
    } else {
        if (firstPer instanceof cArray) {
            firstPer = firstPer.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (period instanceof cArea || period instanceof cArea3D) {
        period = period.cross(arguments[1].first);
    } else {
        if (period instanceof cArray) {
            period = period.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    datePurch = datePurch.tocNumber();
    firstPer = firstPer.tocNumber();
    salvage = salvage.tocNumber();
    period = period.tocNumber();
    rate = rate.tocNumber();
    basis = basis.tocNumber();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (datePurch instanceof cError) {
        return this.value = datePurch;
    }
    if (firstPer instanceof cError) {
        return this.value = firstPer;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (period instanceof cError) {
        return this.value = period;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    cost = cost.getValue();
    datePurch = datePurch.getValue();
    firstPer = firstPer.getValue();
    salvage = salvage.getValue();
    period = period.getValue();
    rate = rate.getValue();
    basis = Math.floor(basis.getValue());
    var val0 = Date.prototype.getDateFromExcel(datePurch),
    val1 = Date.prototype.getDateFromExcel(firstPer);
    if (cost < 0 || salvage < 0 || period < 0 || rate <= 0 || basis == 2 || basis < 0 || basis > 4 || datePurch < 0 || firstPer < 0 || datePurch > firstPer || cost < salvage) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var fDepTime = yearFrac(val0, val1, basis).getValue() * rate * cost,
    fDep,
    depr = rate * cost,
    availDepr,
    availDeprTemp,
    countedPeriod = 1,
    c = 0,
    maxIter = 10000;
    fDep = fDepTime == 0 ? cost * rate : fDepTime;
    availDepr = (cost - salvage - fDep);
    rate = Math.ceil(1 / rate);
    if (cost == salvage || period > rate) {
        return new cNumber(0);
    } else {
        if (period == 0) {
            return new cNumber(fDep);
        } else {
            while (countedPeriod <= period && c < maxIter) {
                depr = depr > availDepr ? availDepr : depr;
                availDeprTemp = availDepr - depr;
                availDepr = availDeprTemp < 0 ? 0 : availDeprTemp;
                countedPeriod++;
                c++;
            }
            return new cNumber(Math.floor(depr));
        }
    }
};
cAMORLINC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , date-purchased , first-period , salvage , period , rate [ , [ basis ] ] )"
    };
};
function cCOUPDAYBS() {
    this.name = "COUPDAYBS";
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
cCOUPDAYBS.prototype = Object.create(cBaseFunction.prototype);
cCOUPDAYBS.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    frequency = arg[2],
    basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    basis = Math.floor(basis.getValue());
    frequency = Math.floor(frequency.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    return this.value = new cNumber(getcoupdaybs(settl, matur, frequency, basis));
};
cCOUPDAYBS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};
function cCOUPDAYS() {
    this.name = "COUPDAYS";
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
cCOUPDAYS.prototype = Object.create(cBaseFunction.prototype);
cCOUPDAYS.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    frequency = arg[2],
    basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    return this.value = new cNumber(getcoupdays(settl, matur, frequency, basis));
};
cCOUPDAYS.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};
function cCOUPDAYSNC() {
    this.name = "COUPDAYSNC";
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
cCOUPDAYSNC.prototype = Object.create(cBaseFunction.prototype);
cCOUPDAYSNC.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    frequency = arg[2],
    basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    return this.value = new cNumber(getcoupdaysnc(new Date(settl), new Date(matur), frequency, basis));
};
cCOUPDAYSNC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};
function cCOUPNCD() {
    this.name = "COUPNCD";
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
cCOUPNCD.prototype = Object.create(cBaseFunction.prototype);
cCOUPNCD.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    frequency = arg[2],
    basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    this.value = new cNumber(getcoupncd(settl, matur, frequency).getExcelDate());
    this.value.numFormat = 14;
    return this.value;
};
cCOUPNCD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};
function cCOUPNUM() {
    this.name = "COUPNUM";
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
cCOUPNUM.prototype = Object.create(cBaseFunction.prototype);
cCOUPNUM.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    frequency = arg[2],
    basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    var res = getcoupnum(settl, matur, frequency);
    return this.value = new cNumber(res);
};
cCOUPNUM.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};
function cCOUPPCD() {
    this.name = "COUPPCD";
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
cCOUPPCD.prototype = Object.create(cBaseFunction.prototype);
cCOUPPCD.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    frequency = arg[2],
    basis = arg[3] && !(arg[3] instanceof cEmpty) ? arg[3] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    var n = lcl_GetCouppcd(settl, matur, frequency);
    this.value = new cNumber(n.getExcelDate());
    this.value.numFormat = 14;
    return this.value;
};
cCOUPPCD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , frequency [ , [ basis ] ] )"
    };
};
function cCUMIPMT() {
    this.name = "CUMIPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cCUMIPMT.prototype = Object.create(cBaseFunction.prototype);
cCUMIPMT.prototype.Calculate = function (arg) {
    var rate = arg[0],
    nper = arg[1],
    pv = arg[2],
    startPeriod = arg[3],
    endPeriod = arg[4],
    type = arg[5];
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
    if (startPeriod instanceof cArea || startPeriod instanceof cArea3D) {
        startPeriod = startPeriod.cross(arguments[1].first);
    } else {
        if (startPeriod instanceof cArray) {
            startPeriod = startPeriod.getElementRowCol(0, 0);
        }
    }
    if (endPeriod instanceof cArea || endPeriod instanceof cArea3D) {
        endPeriod = endPeriod.cross(arguments[1].first);
    } else {
        if (endPeriod instanceof cArray) {
            endPeriod = endPeriod.getElementRowCol(0, 0);
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
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    type = type.tocNumber();
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (nper instanceof cError) {
        return this.value = nper;
    }
    if (pv instanceof cError) {
        return this.value = pv;
    }
    if (startPeriod instanceof cError) {
        return this.value = startPeriod;
    }
    if (endPeriod instanceof cError) {
        return this.value = endPeriod;
    }
    if (type instanceof cError) {
        return this.value = type;
    }
    rate = rate.getValue();
    nper = nper.getValue();
    pv = pv.getValue();
    startPeriod = startPeriod.getValue();
    endPeriod = endPeriod.getValue();
    type = type.getValue();
    var fv, ipmt = 0;
    if (startPeriod < 1 || endPeriod < startPeriod || rate <= 0 || endPeriod > nper || nper <= 0 || pv <= 0 || (type != 0 && type != 1)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    fv = getPMT(rate, nper, pv, 0, type);
    if (startPeriod == 1) {
        if (type <= 0) {
            ipmt = -pv;
        }
        startPeriod++;
    }
    for (var i = startPeriod; i <= endPeriod; i++) {
        if (type > 0) {
            ipmt += getFV(rate, i - 2, fv, pv, 1) - fv;
        } else {
            ipmt += getFV(rate, i - 1, fv, pv, 0);
        }
    }
    ipmt *= rate;
    return this.value = new cNumber(ipmt);
};
cCUMIPMT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , nper , pv , start-period , end-period , type )"
    };
};
function cCUMPRINC() {
    this.name = "CUMPRINC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cCUMPRINC.prototype = Object.create(cBaseFunction.prototype);
cCUMPRINC.prototype.Calculate = function (arg) {
    var rate = arg[0],
    nper = arg[1],
    pv = arg[2],
    startPeriod = arg[3],
    endPeriod = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0),
    type = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(0);
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
    if (startPeriod instanceof cArea || startPeriod instanceof cArea3D) {
        startPeriod = startPeriod.cross(arguments[1].first);
    } else {
        if (startPeriod instanceof cArray) {
            startPeriod = startPeriod.getElementRowCol(0, 0);
        }
    }
    if (endPeriod instanceof cArea || endPeriod instanceof cArea3D) {
        endPeriod = endPeriod.cross(arguments[1].first);
    } else {
        if (endPeriod instanceof cArray) {
            endPeriod = endPeriod.getElementRowCol(0, 0);
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
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    type = type.tocNumber();
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (nper instanceof cError) {
        return this.value = nper;
    }
    if (pv instanceof cError) {
        return this.value = pv;
    }
    if (startPeriod instanceof cError) {
        return this.value = startPeriod;
    }
    if (endPeriod instanceof cError) {
        return this.value = endPeriod;
    }
    if (type instanceof cError) {
        return this.value = type;
    }
    rate = rate.getValue();
    nper = nper.getValue();
    pv = pv.getValue();
    startPeriod = startPeriod.getValue();
    endPeriod = endPeriod.getValue();
    type = type.getValue();
    var fv, res = 0,
    nStart = startPeriod;
    if (startPeriod < 1 || endPeriod < startPeriod || endPeriod < 1 || rate <= 0 || nper <= 0 || pv <= 0 || (type != 0 && type != 1)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    fv = getPMT(rate, nper, pv, 0, type);
    if (nStart == 1) {
        if (type <= 0) {
            res = fv + pv * rate;
        } else {
            res = fv;
        }
        nStart++;
    }
    for (var i = nStart; i <= endPeriod; i++) {
        if (type > 0) {
            res += fv - (getFV(rate, i - 2, fv, pv, 1) - fv) * rate;
        } else {
            res += fv - getFV(rate, i - 1, fv, pv, 0) * rate;
        }
    }
    return this.value = new cNumber(res);
};
cCUMPRINC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , nper , pv , start-period , end-period , type )"
    };
};
function cDB() {
    this.name = "DB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cDB.prototype = Object.create(cBaseFunction.prototype);
cDB.prototype.Calculate = function (arg) {
    var cost = arg[0],
    salvage = arg[1],
    life = arg[2],
    period = arg[3],
    month = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(12);
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (life instanceof cArea || life instanceof cArea3D) {
        life = life.cross(arguments[1].first);
    } else {
        if (life instanceof cArray) {
            life = life.getElementRowCol(0, 0);
        }
    }
    if (period instanceof cArea || period instanceof cArea3D) {
        period = period.cross(arguments[1].first);
    } else {
        if (period instanceof cArray) {
            period = period.getElementRowCol(0, 0);
        }
    }
    if (month instanceof cArea || month instanceof cArea3D) {
        month = month.cross(arguments[1].first);
    } else {
        if (month instanceof cArray) {
            month = month.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    period = period.tocNumber();
    month = month.tocNumber();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (life instanceof cError) {
        return this.value = life;
    }
    if (period instanceof cError) {
        return this.value = period;
    }
    if (month instanceof cError) {
        return this.value = month;
    }
    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    period = period.getValue();
    month = Math.floor(month.getValue());
    if (salvage >= cost) {
        return this.value = new cNumber(0);
    }
    if (month < 1 || month > 12 || salvage < 0 || life < 0 || period < 0 || life + 1 < period || cost < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var rate = 1 - Math.pow(salvage / cost, 1 / life);
    rate = Math.floor((rate * 1000) + 0.5) / 1000;
    var firstRate = cost * rate * month / 12;
    var res = 0;
    if (Math.floor(period) == 1) {
        res = firstRate;
    } else {
        var sum = firstRate,
        min = life;
        if (min > period) {
            min = period;
        }
        var max = Math.floor(min);
        for (var i = 2; i <= max; i++) {
            res = (cost - sum) * rate;
            sum += res;
        }
        if (period > life) {
            res = ((cost - sum) * rate * (12 - month)) / 12;
        }
    }
    this.value = new cNumber(res);
    return this.value;
};
cDB.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , salvage , life , period [ , [ month ] ] )"
    };
};
function cDDB() {
    this.name = "DDB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cDDB.prototype = Object.create(cBaseFunction.prototype);
cDDB.prototype.Calculate = function (arg) {
    var cost = arg[0],
    salvage = arg[1],
    life = arg[2],
    period = arg[3],
    factor = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(2);
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (life instanceof cArea || life instanceof cArea3D) {
        life = life.cross(arguments[1].first);
    } else {
        if (life instanceof cArray) {
            life = life.getElementRowCol(0, 0);
        }
    }
    if (period instanceof cArea || period instanceof cArea3D) {
        period = period.cross(arguments[1].first);
    } else {
        if (period instanceof cArray) {
            period = period.getElementRowCol(0, 0);
        }
    }
    if (factor instanceof cArea || factor instanceof cArea3D) {
        factor = factor.cross(arguments[1].first);
    } else {
        if (factor instanceof cArray) {
            factor = factor.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    period = period.tocNumber();
    factor = factor.tocNumber();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (life instanceof cError) {
        return this.value = life;
    }
    if (period instanceof cError) {
        return this.value = period;
    }
    if (factor instanceof cError) {
        return this.value = factor;
    }
    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    period = period.getValue();
    factor = factor.getValue();
    if (cost == 0 || salvage == 0) {
        return this.value = new cNumber(0);
    }
    if (cost < salvage || cost <= 0 || salvage < 0 || factor <= 0 || life <= 0 || period <= 0 || life < period) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    this.value = new cNumber(getDDB(cost, salvage, life, period, factor));
    return this.value;
};
cDDB.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , salvage , life , period [ , factor ] )"
    };
};
function cDISC() {
    this.name = "DISC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cDISC.prototype = Object.create(cBaseFunction.prototype);
cDISC.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    pr = arg[2],
    redemption = arg[3],
    basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    pr = pr.getValue();
    redemption = redemption.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || pr <= 0 || redemption <= 0 || basis < 0 || basis > 4) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var res = (1 - pr / redemption) / yearFrac(Date.prototype.getDateFromExcel(settlement), Date.prototype.getDateFromExcel(maturity), basis);
    this.value = new cNumber(res);
    this.value.numFormat = 9;
    return this.value;
};
cDISC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , pr , redemption [ , [ basis ] ] )"
    };
};
function cDOLLARDE() {
    this.name = "DOLLARDE";
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
cDOLLARDE.prototype = Object.create(cBaseFunction.prototype);
cDOLLARDE.prototype.Calculate = function (arg) {
    var fractionalDollar = arg[0],
    fraction = arg[1];
    if (fractionalDollar instanceof cArea || fractionalDollar instanceof cArea3D) {
        fractionalDollar = fractionalDollar.cross(arguments[1].first);
    } else {
        if (fractionalDollar instanceof cArray) {
            fractionalDollar = fractionalDollar.getElementRowCol(0, 0);
        }
    }
    if (fraction instanceof cArea || fraction instanceof cArea3D) {
        fraction = fraction.cross(arguments[1].first);
    } else {
        if (fraction instanceof cArray) {
            fraction = fraction.getElementRowCol(0, 0);
        }
    }
    fractionalDollar = fractionalDollar.tocNumber();
    fraction = fraction.tocNumber();
    if (fractionalDollar instanceof cError) {
        return this.value = fractionalDollar;
    }
    if (fraction instanceof cError) {
        return this.value = fraction;
    }
    fractionalDollar = fractionalDollar.getValue();
    fraction = fraction.getValue();
    if (fraction < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    } else {
        if (fraction == 0) {
            return this.value = new cError(cErrorType.division_by_zero);
        }
    }
    fraction = Math.floor(fraction);
    var fInt = Math.floor(fractionalDollar),
    res = fractionalDollar - fInt;
    res /= fraction;
    res *= Math.pow(10, Math.ceil(Math.log10(fraction)));
    res += fInt;
    return this.value = new cNumber(res);
};
cDOLLARDE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( fractional-dollar , fraction )"
    };
};
function cDOLLARFR() {
    this.name = "DOLLARFR";
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
cDOLLARFR.prototype = Object.create(cBaseFunction.prototype);
cDOLLARFR.prototype.Calculate = function (arg) {
    var decimalDollar = arg[0],
    fraction = arg[1];
    if (decimalDollar instanceof cArea || decimalDollar instanceof cArea3D) {
        decimalDollar = decimalDollar.cross(arguments[1].first);
    } else {
        if (decimalDollar instanceof cArray) {
            decimalDollar = decimalDollar.getElementRowCol(0, 0);
        }
    }
    if (fraction instanceof cArea || fraction instanceof cArea3D) {
        fraction = fraction.cross(arguments[1].first);
    } else {
        if (fraction instanceof cArray) {
            fraction = fraction.getElementRowCol(0, 0);
        }
    }
    decimalDollar = decimalDollar.tocNumber();
    fraction = fraction.tocNumber();
    if (decimalDollar instanceof cError) {
        return this.value = decimalDollar;
    }
    if (fraction instanceof cError) {
        return this.value = fraction;
    }
    decimalDollar = decimalDollar.getValue();
    fraction = fraction.getValue();
    if (fraction < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    } else {
        if (fraction == 0) {
            return this.value = new cError(cErrorType.division_by_zero);
        }
    }
    fraction = Math.floor(fraction);
    var fInt = Math.floor(decimalDollar),
    res = decimalDollar - fInt;
    res *= fraction;
    res *= Math.pow(10, -Math.ceil(Math.log10(fraction)));
    res += fInt;
    return this.value = new cNumber(res);
};
cDOLLARFR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( decimal-dollar , fraction )"
    };
};
function cDURATION() {
    this.name = "DURATION";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cDURATION.prototype = Object.create(cBaseFunction.prototype);
cDURATION.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    coupon = arg[2],
    yld = arg[3],
    frequency = arg[4],
    basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (coupon instanceof cArea || coupon instanceof cArea3D) {
        coupon = coupon.cross(arguments[1].first);
    } else {
        if (coupon instanceof cArray) {
            coupon = coupon.getElementRowCol(0, 0);
        }
    }
    if (yld instanceof cArea || yld instanceof cArea3D) {
        yld = yld.cross(arguments[1].first);
    } else {
        if (yld instanceof cArray) {
            yld = yld.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    coupon = coupon.tocNumber();
    yld = yld.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (coupon instanceof cError) {
        return this.value = coupon;
    }
    if (yld instanceof cError) {
        return this.value = yld;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    coupon = coupon.getValue();
    yld = yld.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4) || yld < 0 || coupon < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    return this.value = new cNumber(getduration(settl, matur, coupon, yld, frequency, basis));
};
cDURATION.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , coupon , yld , frequency [ , [ basis ] ] )"
    };
};
function cEFFECT() {
    this.name = "EFFECT";
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
cEFFECT.prototype = Object.create(cBaseFunction.prototype);
cEFFECT.prototype.Calculate = function (arg) {
    var nominalRate = arg[0],
    npery = arg[1];
    if (nominalRate instanceof cArea || nominalRate instanceof cArea3D) {
        nominalRate = nominalRate.cross(arguments[1].first);
    } else {
        if (nominalRate instanceof cArray) {
            nominalRate = nominalRate.getElementRowCol(0, 0);
        }
    }
    if (npery instanceof cArea || npery instanceof cArea3D) {
        npery = npery.cross(arguments[1].first);
    } else {
        if (npery instanceof cArray) {
            npery = npery.getElementRowCol(0, 0);
        }
    }
    nominalRate = nominalRate.tocNumber();
    npery = npery.tocNumber();
    if (nominalRate instanceof cError) {
        return this.value = nominalRate;
    }
    if (npery instanceof cError) {
        return this.value = npery;
    }
    nominalRate = nominalRate.getValue();
    npery = Math.floor(npery.getValue());
    if (nominalRate <= 0 || npery < 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    return this.value = new cNumber(Math.pow((1 + nominalRate / npery), npery) - 1);
};
cEFFECT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( nominal-rate , npery )"
    };
};
function cFV() {
    this.name = "FV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cFV.prototype = Object.create(cBaseFunction.prototype);
cFV.prototype.Calculate = function (arg) {
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
cFV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , nper , pmt [ , [ pv ] [ ,[ type ] ] ] )"
    };
};
function cFVSCHEDULE() {
    this.name = "FVSCHEDULE";
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
cFVSCHEDULE.prototype = Object.create(cBaseFunction.prototype);
cFVSCHEDULE.prototype.Calculate = function (arg) {
    var principal = arg[0],
    schedule = arg[1],
    shedList = [];
    if (principal instanceof cArea || principal instanceof cArea3D) {
        principal = principal.cross(arguments[1].first);
    } else {
        if (principal instanceof cArray) {
            principal = principal.getElementRowCol(0, 0);
        }
    }
    if (schedule instanceof cArea || schedule instanceof cArea3D) {
        schedule.foreach2(function (v) {
            shedList.push(v.tocNumber());
        });
    } else {
        if (schedule instanceof cArray) {
            schedule.foreach(function (v) {
                shedList.push(v.tocNumber());
            });
        } else {
            shedList.push(schedule.tocNumber());
        }
    }
    principal = principal.tocNumber();
    if (principal instanceof cError) {
        return this.value = principal;
    }
    var princ = principal.getValue();
    for (var i = 0; i < shedList.length; i++) {
        if (shedList[i] instanceof cError) {
            return this.value = new cError(cErrorType.wrong_value_type);
        } else {
            princ *= 1 + shedList[i].getValue();
        }
    }
    return this.value = new cNumber(princ);
};
cFVSCHEDULE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( principal , schedule )"
    };
};
function cINTRATE() {
    this.name = "INTRATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cINTRATE.prototype = Object.create(cBaseFunction.prototype);
cINTRATE.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    investment = arg[2],
    redemption = arg[3],
    basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (investment instanceof cArea || investment instanceof cArea3D) {
        investment = investment.cross(arguments[1].first);
    } else {
        if (investment instanceof cArray) {
            investment = investment.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    investment = investment.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (investment instanceof cError) {
        return this.value = investment;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    investment = investment.getValue();
    redemption = redemption.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || investment <= 0 || redemption <= 0 || basis < 0 || basis > 4) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var res = ((redemption / investment) - 1) / yearFrac(Date.prototype.getDateFromExcel(settlement), Date.prototype.getDateFromExcel(maturity), basis);
    this.value = new cNumber(res);
    this.value.numFormat = 9;
    return this.value;
};
cINTRATE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , pr , redemption [ , [ basis ] ] )"
    };
};
function cIPMT() {
    this.name = "IPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cIPMT.prototype = Object.create(cBaseFunction.prototype);
cIPMT.prototype.Calculate = function (arg) {
    var rate = arg[0],
    per = arg[1],
    nper = arg[2],
    pv = arg[3],
    fv = arg[4] ? arg[4] : new cNumber(0),
    type = arg[5] ? arg[5] : new cNumber(0);
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (per instanceof cArea || per instanceof cArea3D) {
        per = per.cross(arguments[1].first);
    } else {
        if (per instanceof cArray) {
            per = per.getElementRowCol(0, 0);
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
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (per instanceof cError) {
        return this.value = per;
    }
    if (nper instanceof cError) {
        return this.value = nper;
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
    rate = rate.getValue();
    per = per.getValue();
    nper = nper.getValue();
    pv = pv.getValue();
    fv = fv.getValue();
    type = type.getValue();
    var res;
    if (per < 1 || per > nper || type != 0 && type != 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    res = getPMT(rate, nper, pv, fv, type);
    this.value = new cNumber(getIPMT(rate, per, pv, type, res));
    return this.value;
};
cIPMT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , per , nper , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
};
function cIRR() {
    this.name = "IRR";
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
cIRR.prototype = Object.create(cBaseFunction.prototype);
cIRR.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1] ? arg[1] : new cNumber(0.1);
    function npv(r, cf) {
        var res = 0;
        for (var i = 1; i <= cf.length; i++) {
            res += cf[i - 1].getValue() / Math.pow(1 + r, i);
        }
        return res;
    }
    function irr2(x, arr) {
        var g_Eps = 1e-07,
        nIM = 500,
        eps = 1,
        nMC = 0,
        xN, guess = x;
        while (eps > g_Eps && nMC < nIM) {
            xN = x - npv(x, arr) / ((npv(x + g_Eps, arr) - npv(x - g_Eps, arr)) / (2 * g_Eps));
            nMC++;
            eps = Math.abs(xN - x);
            x = xN;
        }
        if (isNaN(x) || Infinity == Math.abs(x)) {
            var max = Number.MAX_VALUE,
            min = -Number.MAX_VALUE,
            step = 1.6,
            low = guess - 0.01 <= min ? min + g_Eps : guess - 0.01,
            high = guess + 0.01 >= max ? max - g_Eps : guess + 0.01,
            i,
            xBegin,
            xEnd,
            x,
            y,
            currentIter = 0;
            if (guess <= min || guess >= max) {
                return new cError(cErrorType.not_numeric);
            }
            for (i = 0; i < nIM; i++) {
                xBegin = low <= min ? min + g_Eps : low;
                xEnd = high >= max ? max - g_Eps : high;
                x = npv(xBegin, arr);
                y = npv(xEnd, arr);
                if (x * y <= 0) {
                    break;
                } else {
                    if (x * y > 0) {
                        low = (xBegin + step * (xBegin - xEnd));
                        high = (xEnd + step * (xEnd - xBegin));
                    } else {
                        return new cError(cErrorType.not_numeric);
                    }
                }
            }
            if (i == nIM) {
                return new cError(cErrorType.not_numeric);
            }
            var fXbegin = npv(xBegin, arr),
            fXend = npv(xEnd, arr),
            fXi,
            xI;
            if (Math.abs(fXbegin) < g_Eps) {
                return new cNumber(fXbegin);
            }
            if (Math.abs(fXend) < g_Eps) {
                return new cNumber(fXend);
            }
            do {
                xI = xBegin + (xEnd - xBegin) / 2;
                fXi = npv(xI, arr);
                if (fXbegin * fXi < 0) {
                    xEnd = xI;
                } else {
                    xBegin = xI;
                }
                fXbegin = npv(xBegin, arr);
                currentIter++;
            } while (Math.abs(fXi) > g_Eps && currentIter < nIM);
            return new cNumber(xI);
        } else {
            return new cNumber(x);
        }
    }
    var arr = [];
    if (arg0 instanceof cArray) {
        arg0.foreach(function (v) {
            if (v instanceof cNumber) {
                arr.push(v);
            }
        });
    } else {
        if (arg0 instanceof cArea) {
            arg0.foreach2(function (v) {
                if (v instanceof cNumber) {
                    arr.push(v);
                }
            });
        }
    }
    arg1 = arg1.tocNumber();
    if (arg1 instanceof cError) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var wasNeg = false,
    wasPos = false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getValue() > 0) {
            wasNeg = true;
        }
        if (arr[i].getValue() < 0) {
            wasPos = true;
        }
    }
    if (! (wasNeg && wasPos)) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    this.value = irr2(arg1.getValue(), arr);
    this.value.numFormat = 9;
    return this.value;
};
cIRR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( values [ , [ guess ] ] )"
    };
};
function cISPMT() {
    this.name = "ISPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cISPMT.prototype = Object.create(cBaseFunction.prototype);
cISPMT.prototype.Calculate = function (arg) {
    var rate = arg[0],
    per = arg[1],
    nper = arg[2],
    pv = arg[3];
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (per instanceof cArea || per instanceof cArea3D) {
        per = per.cross(arguments[1].first);
    } else {
        if (per instanceof cArray) {
            per = per.getElementRowCol(0, 0);
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
    rate = rate.tocNumber();
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (per instanceof cError) {
        return this.value = per;
    }
    if (nper instanceof cError) {
        return this.value = nper;
    }
    if (pv instanceof cError) {
        return this.value = pv;
    }
    if (nper.getValue() == 0) {
        return this.value = new cError(cErrorType.division_by_zero);
    }
    return this.value = new cNumber(pv.getValue() * rate.getValue() * (per.getValue() / nper.getValue() - 1));
};
cISPMT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , per , nper , pv )"
    };
};
function cMDURATION() {
    this.name = "MDURATION";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cMDURATION.prototype = Object.create(cBaseFunction.prototype);
cMDURATION.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    coupon = arg[2],
    yld = arg[3],
    frequency = arg[4],
    basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (coupon instanceof cArea || coupon instanceof cArea3D) {
        coupon = coupon.cross(arguments[1].first);
    } else {
        if (coupon instanceof cArray) {
            coupon = coupon.getElementRowCol(0, 0);
        }
    }
    if (yld instanceof cArea || yld instanceof cArea3D) {
        yld = yld.cross(arguments[1].first);
    } else {
        if (yld instanceof cArray) {
            yld = yld.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    coupon = coupon.tocNumber();
    yld = yld.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (coupon instanceof cError) {
        return this.value = coupon;
    }
    if (yld instanceof cError) {
        return this.value = yld;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    coupon = coupon.getValue();
    yld = yld.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4) || yld < 0 || coupon < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    var duration = getduration(settl, matur, coupon, yld, frequency, basis);
    duration /= 1 + yld / frequency;
    return this.value = new cNumber(duration);
};
cMDURATION.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , coupon , yld , frequency [ , [ basis ] ] )"
    };
};
function cMIRR() {
    this.name = "MIRR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cMIRR.prototype = Object.create(cBaseFunction.prototype);
cMIRR.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    invest = arg[1],
    reinvest = arg[2];
    var valueArray = [];
    if (arg0 instanceof cArea) {
        arg0.foreach2(function (c) {
            if (c instanceof cNumber || c instanceof cError) {
                valueArray.push(c);
            }
        });
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (c) {
                if (c instanceof cNumber || c instanceof cError) {
                    valueArray.push(c);
                }
            });
        } else {
            if (arg0 instanceof cArea3D) {
                if (arg0.wsFrom == arg0.wsTo) {
                    valueArray = arg0.getMatrix()[0];
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            } else {
                if (arg0 instanceof cError) {
                    return this.value = new cError(cErrorType.not_numeric);
                } else {
                    if (arg0 instanceof cNumber) {
                        valueArray.push(arg0);
                    }
                }
            }
        }
    }
    if (invest instanceof cArea || invest instanceof cArea3D) {
        invest = invest.cross(arguments[1].first);
    } else {
        if (invest instanceof cArray) {
            invest = invest.getElementRowCol(0, 0);
        }
    }
    if (reinvest instanceof cArea || reinvest instanceof cArea3D) {
        reinvest = reinvest.cross(arguments[1].first);
    } else {
        if (reinvest instanceof cArray) {
            reinvest = reinvest.getElementRowCol(0, 0);
        }
    }
    invest = invest.tocNumber();
    reinvest = reinvest.tocNumber();
    if (invest instanceof cError) {
        return this.value = invest;
    }
    if (reinvest instanceof cError) {
        return this.value = reinvest;
    }
    invest = invest.getValue() + 1;
    reinvest = reinvest.getValue() + 1;
    var NPVreinvest = 0,
    POWreinvest = 1,
    NPVinvest = 0,
    POWinvest = 1,
    cellValue, wasNegative = false,
    wasPositive = false;
    for (var i = 0; i < valueArray.length; i++) {
        cellValue = valueArray[i];
        if (cellValue instanceof cError) {
            return this.value = cellValue;
        }
        cellValue = valueArray[i].getValue();
        if (cellValue > 0) {
            wasPositive = true;
            NPVreinvest += cellValue * POWreinvest;
        } else {
            if (cellValue < 0) {
                wasNegative = true;
                NPVinvest += cellValue * POWinvest;
            }
        }
        POWreinvest /= reinvest;
        POWinvest /= invest;
    }
    if (! (wasNegative && wasPositive)) {
        return this.value = new cError(cErrorType.division_by_zero);
    }
    var res = -NPVreinvest / NPVinvest;
    res *= Math.pow(reinvest, valueArray.length - 1);
    res = Math.pow(res, 1 / (valueArray.length - 1));
    this.value = new cNumber(res - 1);
    this.value.numFormat = 9;
    return this.value;
};
cMIRR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( values , finance-rate , reinvest-rate )"
    };
};
function cNOMINAL() {
    this.name = "NOMINAL";
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
cNOMINAL.prototype = Object.create(cBaseFunction.prototype);
cNOMINAL.prototype.Calculate = function (arg) {
    var effectRate = arg[0],
    npery = arg[1];
    if (effectRate instanceof cArea || effectRate instanceof cArea3D) {
        effectRate = effectRate.cross(arguments[1].first);
    } else {
        if (effectRate instanceof cArray) {
            effectRate = effectRate.getElementRowCol(0, 0);
        }
    }
    if (npery instanceof cArea || npery instanceof cArea3D) {
        npery = npery.cross(arguments[1].first);
    } else {
        if (npery instanceof cArray) {
            npery = npery.getElementRowCol(0, 0);
        }
    }
    effectRate = effectRate.tocNumber();
    npery = npery.tocNumber();
    if (effectRate instanceof cError) {
        return this.value = effectRate;
    }
    if (npery instanceof cError) {
        return this.value = npery;
    }
    effectRate = effectRate.getValue();
    npery = npery.getValue();
    npery = Math.floor(npery);
    if (effectRate <= 0 || npery < 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    this.value = new cNumber((Math.pow(effectRate + 1, 1 / npery) - 1) * npery);
    return this.value;
};
cNOMINAL.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( effect-rate , npery )"
    };
};
function cNPER() {
    this.name = "NPER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cNPER.prototype = Object.create(cBaseFunction.prototype);
cNPER.prototype.Calculate = function (arg) {
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
cNPER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , pmt , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
};
function cNPV() {
    this.name = "NPV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cNPV.prototype = Object.create(cBaseFunction.prototype);
cNPV.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
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
                argI.foreach(function (elem) {
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
cNPV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , argument-list )"
    };
};
function cODDFPRICE() {
    this.name = "ODDFPRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 8;
    this.argumentsCurrent = 0;
    this.argumentsMax = 9;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cODDFPRICE.prototype = Object.create(cBaseFunction.prototype);
cODDFPRICE.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    issue = arg[2],
    first_coupon = arg[3],
    rate = arg[4],
    yld = arg[5],
    redemption = arg[6],
    frequency = arg[7],
    basis = arg[8] && !(arg[8] instanceof cEmpty) ? arg[8] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (issue instanceof cArea || issue instanceof cArea3D) {
        issue = issue.cross(arguments[1].first);
    } else {
        if (issue instanceof cArray) {
            issue = issue.getElementRowCol(0, 0);
        }
    }
    if (first_coupon instanceof cArea || first_coupon instanceof cArea3D) {
        first_coupon = first_coupon.cross(arguments[1].first);
    } else {
        if (first_coupon instanceof cArray) {
            first_coupon = first_coupon.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (yld instanceof cArea || yld instanceof cArea3D) {
        yld = yld.cross(arguments[1].first);
    } else {
        if (yld instanceof cArray) {
            yld = yld.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    first_coupon = first_coupon.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (issue instanceof cError) {
        return this.value = issue;
    }
    if (first_coupon instanceof cError) {
        return this.value = first_coupon;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (yld instanceof cError) {
        return this.value = yld;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    issue = Math.floor(issue.getValue());
    first_coupon = Math.floor(first_coupon.getValue());
    rate = rate.getValue();
    yld = yld.getValue();
    redemption = redemption.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (maturity < startRangeCurrentDateSystem || settlement < startRangeCurrentDateSystem || first_coupon < startRangeCurrentDateSystem || issue < startRangeCurrentDateSystem || maturity <= first_coupon || first_coupon <= settlement || settlement <= issue || basis < 0 || basis > 4 || yld < 0 || rate < 0 || redemption < 0 || frequency != 1 && frequency != 2 && frequency != 4) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity),
    iss = Date.prototype.getDateFromExcel(issue),
    firstCoup = Date.prototype.getDateFromExcel(first_coupon);
    this.value = new cNumber(oddFPrice(settl, matur, iss, firstCoup, rate, yld, redemption, frequency, basis));
    return this.value;
};
cODDFPRICE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , issue , first-coupon , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
};
function cODDFYIELD() {
    this.name = "ODDFYIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 8;
    this.argumentsCurrent = 0;
    this.argumentsMax = 9;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cODDFYIELD.prototype = Object.create(cBaseFunction.prototype);
cODDFYIELD.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    issue = arg[2],
    first_coupon = arg[3],
    rate = arg[4],
    pr = arg[5],
    redemption = arg[6],
    frequency = arg[7],
    basis = arg[8] && !(arg[8] instanceof cEmpty) ? arg[8] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (issue instanceof cArea || issue instanceof cArea3D) {
        issue = issue.cross(arguments[1].first);
    } else {
        if (issue instanceof cArray) {
            issue = issue.getElementRowCol(0, 0);
        }
    }
    if (first_coupon instanceof cArea || first_coupon instanceof cArea3D) {
        first_coupon = first_coupon.cross(arguments[1].first);
    } else {
        if (first_coupon instanceof cArray) {
            first_coupon = first_coupon.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    first_coupon = first_coupon.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (issue instanceof cError) {
        return this.value = issue;
    }
    if (first_coupon instanceof cError) {
        return this.value = first_coupon;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    issue = Math.floor(issue.getValue());
    first_coupon = Math.floor(first_coupon.getValue());
    rate = rate.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || issue < startRangeCurrentDateSystem || first_coupon < startRangeCurrentDateSystem || maturity <= first_coupon || first_coupon <= settlement || settlement <= issue || basis < 0 || basis > 4 || pr < 0 || rate < 0 || redemption < 0 || frequency != 1 && frequency != 2 && frequency != 4) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity),
    iss = Date.prototype.getDateFromExcel(issue),
    firstCoup = Date.prototype.getDateFromExcel(first_coupon);
    var years = diffDate(settl, matur, basis),
    px = pr - 100,
    num = rate * years * 100 - px,
    denum = px * 0.25 * (1 + 2 * years) + years * 100,
    guess = num / denum,
    x = guess,
    g_Eps = 1e-07,
    nIM = 500,
    eps = 1,
    nMC = 0,
    xN;
    function iterF(yld) {
        return pr - oddFPrice(settl, matur, iss, firstCoup, rate, yld, redemption, frequency, basis);
    }
    while (eps > g_Eps && nMC < nIM) {
        xN = x - iterF(x) / ((iterF(x + g_Eps) - iterF(x - g_Eps)) / (2 * g_Eps));
        nMC++;
        eps = Math.abs(xN - x);
        x = xN;
    }
    if (isNaN(x) || Infinity == Math.abs(x)) {
        var max = Number.MAX_VALUE,
        min = -Number.MAX_VALUE,
        step = 1.6,
        low = guess - 0.01 <= min ? min + g_Eps : guess - 0.01,
        high = guess + 0.01 >= max ? max - g_Eps : guess + 0.01,
        i,
        xBegin,
        xEnd,
        x,
        y,
        currentIter = 0;
        if (guess <= min || guess >= max) {
            return this.value = new cError(cErrorType.not_numeric);
        }
        for (i = 0; i < nIM; i++) {
            xBegin = low <= min ? min + g_Eps : low;
            xEnd = high >= max ? max - g_Eps : high;
            x = iterF(xBegin);
            y = iterF(xEnd);
            if (x * y <= 0) {
                break;
            } else {
                if (x * y > 0) {
                    low = (xBegin + step * (xBegin - xEnd));
                    high = (xEnd + step * (xEnd - xBegin));
                } else {
                    return this.value = new cError(cErrorType.not_numeric);
                }
            }
        }
        if (i == nIM) {
            return this.value = new cError(cErrorType.not_numeric);
        }
        var fXbegin = iterF(xBegin),
        fXend = iterF(xEnd),
        fXi,
        xI;
        if (Math.abs(fXbegin) < g_Eps) {
            return this.value = new cNumber(fXbegin);
        }
        if (Math.abs(fXend) < g_Eps) {
            return this.value = new cNumber(fXend);
        }
        do {
            xI = xBegin + (xEnd - xBegin) / 2;
            fXi = iterF(xI);
            if (fXbegin * fXi < 0) {
                xEnd = xI;
            } else {
                xBegin = xI;
            }
            fXbegin = iterF(xBegin);
            currentIter++;
        } while (Math.abs(fXi) > g_Eps && currentIter < nIM);
        this.value = new cNumber(xI);
    } else {
        this.value = new cNumber(x);
    }
    return this.value;
};
cODDFYIELD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , issue , first-coupon , rate , pr , redemption , frequency [ , [ basis ] ] )"
    };
};
function cODDLPRICE() {
    this.name = "ODDLPRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 7;
    this.argumentsCurrent = 0;
    this.argumentsMax = 8;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cODDLPRICE.prototype = Object.create(cBaseFunction.prototype);
cODDLPRICE.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    last_interest = arg[2],
    rate = arg[3],
    yld = arg[4],
    redemption = arg[5],
    frequency = arg[6],
    basis = arg[7] && !(arg[7] instanceof cEmpty) ? arg[7] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (last_interest instanceof cArea || last_interest instanceof cArea3D) {
        last_interest = last_interest.cross(arguments[1].first);
    } else {
        if (last_interest instanceof cArray) {
            last_interest = last_interest.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (yld instanceof cArea || yld instanceof cArea3D) {
        yld = yld.cross(arguments[1].first);
    } else {
        if (yld instanceof cArray) {
            yld = yld.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    last_interest = last_interest.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (last_interest instanceof cError) {
        return this.value = last_interest;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (yld instanceof cError) {
        return this.value = yld;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    last_interest = Math.floor(last_interest.getValue());
    rate = rate.getValue();
    yld = yld.getValue();
    redemption = redemption.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || last_interest < startRangeCurrentDateSystem || maturity <= settlement || settlement <= last_interest || basis < 0 || basis > 4 || yld < 0 || rate < 0 || frequency != 1 && frequency != 2 && frequency != 4 || redemption <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity),
    lastInt = Date.prototype.getDateFromExcel(last_interest);
    var fDCi = yearFrac(lastInt, matur, basis) * frequency;
    var fDSCi = yearFrac(settl, matur, basis) * frequency;
    var fAi = yearFrac(lastInt, settl, basis) * frequency;
    var res = redemption + fDCi * 100 * rate / frequency;
    res /= fDSCi * yld / frequency + 1;
    res -= fAi * 100 * rate / frequency;
    this.value = new cNumber(res);
    return this.value;
};
cODDLPRICE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , last-interest , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
};
function cODDLYIELD() {
    this.name = "ODDLYIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 7;
    this.argumentsCurrent = 0;
    this.argumentsMax = 8;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cODDLYIELD.prototype = Object.create(cBaseFunction.prototype);
cODDLYIELD.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    last_interest = arg[2],
    rate = arg[3],
    pr = arg[4],
    redemption = arg[5],
    frequency = arg[6],
    basis = arg[7] && !(arg[7] instanceof cEmpty) ? arg[7] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (last_interest instanceof cArea || last_interest instanceof cArea3D) {
        last_interest = last_interest.cross(arguments[1].first);
    } else {
        if (last_interest instanceof cArray) {
            last_interest = last_interest.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    last_interest = last_interest.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (last_interest instanceof cError) {
        return this.value = last_interest;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    last_interest = Math.floor(last_interest.getValue());
    rate = rate.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || last_interest < startRangeCurrentDateSystem || maturity <= settlement || settlement <= last_interest || basis < 0 || basis > 4 || pr < 0 || rate < 0 || frequency != 1 && frequency != 2 && frequency != 4 || redemption <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity),
    lastInt = Date.prototype.getDateFromExcel(last_interest);
    var fDCi = yearFrac(lastInt, matur, basis) * frequency;
    var fDSCi = yearFrac(settl, matur, basis) * frequency;
    var fAi = yearFrac(lastInt, settl, basis) * frequency;
    var res = redemption + fDCi * 100 * rate / frequency;
    res /= pr + fAi * 100 * rate / frequency;
    res--;
    res *= frequency / fDSCi;
    this.value = new cNumber(res);
    return this.value;
};
cODDLYIELD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , last-interest , rate , pr , redemption , frequency [ , [ basis ] ] )"
    };
};
function cPMT() {
    this.name = "PMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPMT.prototype = Object.create(cBaseFunction.prototype);
cPMT.prototype.Calculate = function (arg) {
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
    rate = rate.getValue();
    nper = nper.getValue();
    fv = fv.getValue();
    type = type.getValue();
    pv = pv.getValue();
    var res;
    if (rate != 0) {
        res = -1 * (pv * Math.pow(1 + rate, nper) + fv) / ((1 + rate * type) * (Math.pow((1 + rate), nper) - 1) / rate);
    } else {
        res = -1 * (pv + fv) / nper;
    }
    return this.value = new cNumber(res);
};
cPMT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , nper , pv [ , [ fv ] [ ,[ type ] ] ] )"
    };
};
function cPPMT() {
    this.name = "PPMT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPPMT.prototype = Object.create(cBaseFunction.prototype);
cPPMT.prototype.Calculate = function (arg) {
    var rate = arg[0],
    per = arg[1],
    nper = arg[2],
    pv = arg[3],
    fv = arg[4] ? arg[4] : new cNumber(0),
    type = arg[5] ? arg[5] : new cNumber(0);
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (per instanceof cArea || per instanceof cArea3D) {
        per = per.cross(arguments[1].first);
    } else {
        if (per instanceof cArray) {
            per = per.getElementRowCol(0, 0);
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
    per = per.tocNumber();
    nper = nper.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (per instanceof cError) {
        return this.value = per;
    }
    if (nper instanceof cError) {
        return this.value = nper;
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
    rate = rate.getValue();
    per = per.getValue();
    nper = nper.getValue();
    pv = pv.getValue();
    fv = fv.getValue();
    type = type.getValue();
    var res;
    if (per < 1 || per > nper || type != 0 && type != 1) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var fRmz = getPMT(rate, nper, pv, fv, type);
    res = fRmz - getIPMT(rate, per, pv, type, fRmz);
    this.value = new cNumber(res);
    return this.value;
};
cPPMT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , per , nper , pv [ , [ fv ] [ , [ type ] ] ] )"
    };
};
function cPRICE() {
    this.name = "PRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPRICE.prototype = Object.create(cBaseFunction.prototype);
cPRICE.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    rate = arg[2],
    yld = arg[3],
    redemption = arg[4],
    frequency = arg[5],
    basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (yld instanceof cArea || yld instanceof cArea3D) {
        yld = yld.cross(arguments[1].first);
    } else {
        if (yld instanceof cArray) {
            yld = yld.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (yld instanceof cError) {
        return this.value = yld;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    rate = rate.getValue();
    yld = yld.getValue();
    redemption = redemption.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4) || rate < 0 || yld < 0 || redemption <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    return this.value = new cNumber(getprice(settl, matur, rate, yld, redemption, frequency, basis));
};
cPRICE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , rate , yld , redemption , frequency [ , [ basis ] ] )"
    };
};
function cPRICEDISC() {
    this.name = "PRICEDISC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPRICEDISC.prototype = Object.create(cBaseFunction.prototype);
cPRICEDISC.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    discount = arg[2],
    redemption = arg[3],
    basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (discount instanceof cArea || discount instanceof cArea3D) {
        discount = discount.cross(arguments[1].first);
    } else {
        if (discount instanceof cArray) {
            discount = discount.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (discount instanceof cError) {
        return this.value = discount;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    discount = discount.getValue();
    redemption = redemption.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement >= maturity || settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || basis < 0 || basis > 4 || discount <= 0 || redemption <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    var res = redemption * (1 - discount * yearFrac(settl, matur, basis));
    return this.value = new cNumber(res);
};
cPRICEDISC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , discount , redemption [ , [ basis ] ] )"
    };
};
function cPRICEMAT() {
    this.name = "PRICEMAT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPRICEMAT.prototype = Object.create(cBaseFunction.prototype);
cPRICEMAT.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    issue = arg[2],
    rate = arg[3],
    yld = arg[4],
    basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (issue instanceof cArea || issue instanceof cArea3D) {
        issue = issue.cross(arguments[1].first);
    } else {
        if (issue instanceof cArray) {
            issue = issue.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (yld instanceof cArea || yld instanceof cArea3D) {
        yld = yld.cross(arguments[1].first);
    } else {
        if (yld instanceof cArray) {
            yld = yld.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    rate = rate.tocNumber();
    yld = yld.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (issue instanceof cError) {
        return this.value = issue;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (yld instanceof cError) {
        return this.value = yld;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    issue = Math.floor(issue.getValue());
    rate = rate.getValue();
    yld = yld.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || issue < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || rate < 0 || yld < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity),
    iss = Date.prototype.getDateFromExcel(issue);
    var fIssMat = yearFrac(new Date(iss), new Date(matur), basis);
    var fIssSet = yearFrac(new Date(iss), new Date(settl), basis);
    var fSetMat = yearFrac(new Date(settl), new Date(matur), basis);
    var res = 1 + fIssMat * rate;
    res /= 1 + fSetMat * yld;
    res -= fIssSet * rate;
    res *= 100;
    return this.value = new cNumber(res);
};
cPRICEMAT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , issue , rate , yld [ , [ basis ] ] )"
    };
};
function cPV() {
    this.name = "PV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cPV.prototype = Object.create(cBaseFunction.prototype);
cPV.prototype.Calculate = function (arg) {
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
cPV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , nper , pmt [ , [ fv ] [ ,[ type ] ] ] )"
    };
};
function cRATE() {
    this.name = "RATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cRATE.prototype = Object.create(cBaseFunction.prototype);
cRATE.prototype.Calculate = function (arg) {
    var nper = arg[0],
    pmt = arg[1],
    pv = arg[2],
    fv = arg[3] ? arg[3] : new cNumber(0),
    type = arg[4] ? arg[4] : new cNumber(0),
    quess = arg[5] ? arg[5] : new cNumber(0.1);
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
    if (quess instanceof cArea || quess instanceof cArea3D) {
        quess = quess.cross(arguments[1].first);
    } else {
        if (quess instanceof cArray) {
            quess = quess.getElementRowCol(0, 0);
        }
    }
    nper = nper.tocNumber();
    pmt = pmt.tocNumber();
    pv = pv.tocNumber();
    fv = fv.tocNumber();
    type = type.tocNumber();
    quess = quess.tocNumber();
    if (nper instanceof cError) {
        return this.value = nper;
    }
    if (pmt instanceof cError) {
        return this.value = pmt;
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
    if (quess instanceof cError) {
        return this.value = quess;
    }
    nper = nper.getValue();
    pmt = pmt.getValue();
    pv = pv.getValue();
    fv = fv.getValue();
    type = type.getValue();
    quess = quess.getValue();
    if (type != 1 && type != 0 || nper <= 0 || pmt >= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    this.value = new cNumber(RateIteration(nper, pmt, pv, fv, type, quess));
    this.value.numFormat = 9;
    return this.value;
};
cRATE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( nper , pmt , pv  [ , [ [ fv ] [ , [ [ type ] [ , [ guess ] ] ] ] ] ] )"
    };
};
function cRECEIVED() {
    this.name = "RECEIVED";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cRECEIVED.prototype = Object.create(cBaseFunction.prototype);
cRECEIVED.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    investment = arg[2],
    discount = arg[3],
    basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (investment instanceof cArea || investment instanceof cArea3D) {
        investment = investment.cross(arguments[1].first);
    } else {
        if (investment instanceof cArray) {
            investment = investment.getElementRowCol(0, 0);
        }
    }
    if (discount instanceof cArea || discount instanceof cArea3D) {
        discount = discount.cross(arguments[1].first);
    } else {
        if (discount instanceof cArray) {
            discount = discount.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    investment = investment.tocNumber();
    discount = discount.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (investment instanceof cError) {
        return this.value = investment;
    }
    if (discount instanceof cError) {
        return this.value = discount;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    investment = investment.getValue();
    discount = discount.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement >= maturity || investment <= 0 || discount <= 0 || settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || basis < 0 || basis > 4) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var res = investment / (1 - (discount * yearFrac(Date.prototype.getDateFromExcel(settlement), Date.prototype.getDateFromExcel(maturity), basis)));
    this.value = res >= 0 ? new cNumber(res) : new cError(cErrorType.not_numeric);
    return this.value;
};
cRECEIVED.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , investment , discount [ , [ basis ] ] )"
    };
};
function cSLN() {
    this.name = "SLN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cSLN.prototype = Object.create(cBaseFunction.prototype);
cSLN.prototype.Calculate = function (arg) {
    var cost = arg[0],
    salvage = arg[1],
    life = arg[2];
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (life instanceof cArea || life instanceof cArea3D) {
        life = life.cross(arguments[1].first);
    } else {
        if (life instanceof cArray) {
            life = life.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (life instanceof cError) {
        return this.value = life;
    }
    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    if (life == 0) {
        return this.value = new cError(cErrorType.division_by_zero);
    }
    this.value = new cNumber((cost - salvage) / life);
    return this.value;
};
cSLN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , salvage , life )"
    };
};
function cSYD() {
    this.name = "SYD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 4;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cSYD.prototype = Object.create(cBaseFunction.prototype);
cSYD.prototype.Calculate = function (arg) {
    var cost = arg[0],
    salvage = arg[1],
    life = arg[2],
    per = arg[3];
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (life instanceof cArea || life instanceof cArea3D) {
        life = life.cross(arguments[1].first);
    } else {
        if (life instanceof cArray) {
            life = life.getElementRowCol(0, 0);
        }
    }
    if (per instanceof cArea || per instanceof cArea3D) {
        per = per.cross(arguments[1].first);
    } else {
        if (per instanceof cArray) {
            per = per.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    per = per.tocNumber();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (life instanceof cError) {
        return this.value = life;
    }
    if (per instanceof cError) {
        return this.value = per;
    }
    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    per = per.getValue();
    if (life == 1 || life <= 0 || salvage < 0 || per < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var res = 2;
    res *= cost - salvage;
    res *= life + 1 - per;
    res /= (life + 1) * life;
    return this.value = new cNumber(res);
};
cSYD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , salvage , life , per )"
    };
};
function cTBILLEQ() {
    this.name = "TBILLEQ";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cTBILLEQ.prototype = Object.create(cBaseFunction.prototype);
cTBILLEQ.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    discount = arg[2];
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (discount instanceof cArea || discount instanceof cArea3D) {
        discount = discount.cross(arguments[1].first);
    } else {
        if (discount instanceof cArray) {
            discount = discount.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (discount instanceof cError) {
        return this.value = discount;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    discount = discount.getValue();
    if (settlement >= maturity || settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || discount <= 0 || nDiff > 360) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var nMat = maturity + 1;
    var d1 = Date.prototype.getDateFromExcel(settlement);
    var d2 = Date.prototype.getDateFromExcel(nMat);
    var date1 = d1.getUTCDate(),
    month1 = d1.getUTCMonth(),
    year1 = d1.getUTCFullYear(),
    date2 = d2.getUTCDate(),
    month2 = d2.getUTCMonth(),
    year2 = d2.getUTCFullYear();
    var nDiff = GetDiffDate360(date1, month1, year1, date2, month2, year2, true);
    if (nDiff > 360) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    this.value = new cNumber((365 * discount) / (360 - (discount * nDiff)));
    this.value.numFormat = 9;
    return this.value;
};
cTBILLEQ.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , discount )"
    };
};
function cTBILLPRICE() {
    this.name = "TBILLPRICE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cTBILLPRICE.prototype = Object.create(cBaseFunction.prototype);
cTBILLPRICE.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    discount = arg[2];
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (discount instanceof cArea || discount instanceof cArea3D) {
        discount = discount.cross(arguments[1].first);
    } else {
        if (discount instanceof cArray) {
            discount = discount.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    discount = discount.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (discount instanceof cError) {
        return this.value = discount;
    }
    settlement = Math.floor(Math.floor(settlement.getValue()));
    maturity = Math.floor(Math.floor(maturity.getValue()));
    discount = discount.getValue();
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || discount <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var d1 = Date.prototype.getDateFromExcel(settlement),
    d2 = Date.prototype.getDateFromExcel(maturity),
    d3 = new Date(d1);
    d3.addYears(1);
    if (d2 > d3) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    discount *= diffDate(d1, d2, DayCountBasis.ActualActual);
    this.value = new cNumber(100 * (1 - discount / 360));
    return this.value;
};
cTBILLPRICE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , discount )"
    };
};
function cTBILLYIELD() {
    this.name = "TBILLYIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cTBILLYIELD.prototype = Object.create(cBaseFunction.prototype);
cTBILLYIELD.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    pr = arg[2];
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    pr = pr.getValue();
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || pr <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var d1 = Date.prototype.getDateFromExcel(settlement),
    d2 = Date.prototype.getDateFromExcel(maturity),
    date1 = d1.getUTCDate(),
    month1 = d1.getUTCMonth(),
    year1 = d1.getUTCFullYear(),
    date2 = d2.getUTCDate(),
    month2 = d2.getUTCMonth(),
    year2 = d2.getUTCFullYear();
    var nDiff = GetDiffDate360(date1, month1, year1, date2, month2, year2, true);
    nDiff++;
    if (nDiff > 360) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    this.value = new cNumber(((100 - pr) / pr) * (360 / nDiff));
    this.value.numFormat = 9;
    return this.value;
};
cTBILLYIELD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , pr )"
    };
};
function cVDB() {
    this.name = "VDB";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cVDB.prototype = Object.create(cBaseFunction.prototype);
cVDB.prototype.Calculate = function (arg) {
    var cost = arg[0],
    salvage = arg[1],
    life = arg[2],
    startPeriod = arg[3],
    endPeriod = arg[4],
    factor = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(2),
    flag = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cBool(false);
    function getVDB(cost, fRest, life, life1, startPeriod, factor) {
        var res = 0,
        loopEnd = end = Math.ceil(startPeriod),
        temp,
        sln = 0,
        rest = cost - fRest,
        sln1 = false,
        ddb;
        for (var i = 1; i <= loopEnd; i++) {
            if (!sln1) {
                ddb = getDDB(cost, fRest, life, i, factor);
                sln = rest / (life1 - (i - 1));
                if (sln > ddb) {
                    temp = sln;
                    sln1 = true;
                } else {
                    temp = ddb;
                    rest -= ddb;
                }
            } else {
                temp = sln;
            }
            if (i == loopEnd) {
                temp *= (startPeriod + 1 - end);
            }
            res += temp;
        }
        return res;
    }
    if (cost instanceof cArea || cost instanceof cArea3D) {
        cost = cost.cross(arguments[1].first);
    } else {
        if (cost instanceof cArray) {
            cost = cost.getElementRowCol(0, 0);
        }
    }
    if (salvage instanceof cArea || salvage instanceof cArea3D) {
        salvage = salvage.cross(arguments[1].first);
    } else {
        if (salvage instanceof cArray) {
            salvage = salvage.getElementRowCol(0, 0);
        }
    }
    if (life instanceof cArea || life instanceof cArea3D) {
        life = life.cross(arguments[1].first);
    } else {
        if (life instanceof cArray) {
            life = life.getElementRowCol(0, 0);
        }
    }
    if (startPeriod instanceof cArea || startPeriod instanceof cArea3D) {
        startPeriod = startPeriod.cross(arguments[1].first);
    } else {
        if (startPeriod instanceof cArray) {
            startPeriod = startPeriod.getElementRowCol(0, 0);
        }
    }
    if (endPeriod instanceof cArea || endPeriod instanceof cArea3D) {
        endPeriod = endPeriod.cross(arguments[1].first);
    } else {
        if (endPeriod instanceof cArray) {
            endPeriod = endPeriod.getElementRowCol(0, 0);
        }
    }
    if (factor instanceof cArea || factor instanceof cArea3D) {
        factor = factor.cross(arguments[1].first);
    } else {
        if (factor instanceof cArray) {
            factor = factor.getElementRowCol(0, 0);
        }
    }
    if (flag instanceof cArea || flag instanceof cArea3D) {
        flag = flag.cross(arguments[1].first);
    } else {
        if (flag instanceof cArray) {
            flag = flag.getElementRowCol(0, 0);
        }
    }
    cost = cost.tocNumber();
    salvage = salvage.tocNumber();
    life = life.tocNumber();
    startPeriod = startPeriod.tocNumber();
    endPeriod = endPeriod.tocNumber();
    factor = factor.tocNumber();
    flag = flag.tocBool();
    if (cost instanceof cError) {
        return this.value = cost;
    }
    if (salvage instanceof cError) {
        return this.value = salvage;
    }
    if (life instanceof cError) {
        return this.value = life;
    }
    if (startPeriod instanceof cError) {
        return this.value = startPeriod;
    }
    if (endPeriod instanceof cError) {
        return this.value = endPeriod;
    }
    if (factor instanceof cError) {
        return this.value = factor;
    }
    if (flag instanceof cError) {
        return this.value = flag;
    }
    cost = cost.getValue();
    salvage = salvage.getValue();
    life = life.getValue();
    startPeriod = startPeriod.getValue();
    endPeriod = endPeriod.getValue();
    factor = factor.getValue();
    flag = flag.getValue();
    if (cost < salvage || life < 0 || startPeriod < 0 || life < startPeriod || startPeriod > endPeriod || life < endPeriod || factor < 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var start = Math.floor(startPeriod),
    end = Math.ceil(endPeriod);
    var res = 0;
    if (flag) {
        for (var i = start + 1; i <= end; i++) {
            var ddb = getDDB(cost, salvage, life, i, factor);
            if (i == start + 1) {
                ddb *= (Math.min(endPeriod, start + 1) - startPeriod);
            } else {
                if (i == end) {
                    ddb *= (endPeriod + 1 - end);
                }
            }
            res += ddb;
        }
    } else {
        var life1 = life;
        if (!Math.approxEqual(startPeriod, Math.floor(startPeriod))) {
            if (factor > 1) {
                if (startPeriod > life / 2 || Math.approxEqual(startPeriod, life / 2)) {
                    var fPart = startPeriod - life / 2;
                    startPeriod = life / 2;
                    endPeriod -= fPart;
                    life1 += 1;
                }
            }
        }
        cost -= getVDB(cost, salvage, life, life1, startPeriod, factor);
        res = getVDB(cost, salvage, life, life - startPeriod, endPeriod - startPeriod, factor);
    }
    return this.value = new cNumber(res);
};
cVDB.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( cost , salvage , life , start-period , end-period [ , [ [ factor ] [ , [ no-switch-flag ] ] ] ] ] )"
    };
};
function cXIRR() {
    this.name = "XIRR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cXIRR.prototype = Object.create(cBaseFunction.prototype);
cXIRR.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2] ? arg[2] : new cNumber(0.1);
    function xirrFunction(values, dates, rate) {
        var D_0 = dates[0],
        r = rate + 1,
        res = values[0];
        for (var i = 1, count = values.length; i < count; i++) {
            res += values[i] / Math.pow(r, (dates[i] - D_0) / 365);
        }
        return res;
    }
    function xirrDeriv(values, dates, rate) {
        var D_0 = dates[0],
        r = rate + 1,
        res = 0,
        sumDerivI;
        for (var i = 1, count = values.length; i < count; i++) {
            sumDerivI = (dates[i] - D_0) / 365;
            res -= sumDerivI * values[i] / Math.pow(r, sumDerivI + 1);
        }
        return res;
    }
    function xirr(valueArray, dateArray, rate) {
        var arr0 = valueArray[0],
        arr1 = dateArray[0];
        if (arr0 instanceof cError) {
            return arr0;
        }
        if (arr1 instanceof cError) {
            return arr1;
        }
        if (arr0.getValue() == 0) {
            return new cError(cErrorType.not_numeric);
        }
        if (valueArray.length < 2 || (dateArray.length != valueArray.length)) {
            return new cError(cErrorType.not_numeric);
        }
        var res = rate.getValue();
        if (res <= -1) {
            return new cError(cErrorType.not_numeric);
        }
        var deltaEps = 1e-06,
        maxIter = 100,
        wasNeg = false,
        wasPos = false,
        newXirrRes, eps, xirrRes, bContLoop = true;
        for (var i = 0; i < dateArray.length; i++) {
            dateArray[i] = dateArray[i].tocNumber();
            valueArray[i] = valueArray[i].tocNumber();
            if (dateArray[i] instanceof cError || valueArray[i] instanceof cError) {
                return new cError(cErrorType.wrong_value_type);
            }
            dateArray[i] = Math.floor(dateArray[i].getValue());
            valueArray[i] = valueArray[i].getValue();
            if (dateArray[0] > dateArray[i]) {
                return new cError(cErrorType.not_numeric);
            }
            if (valueArray[i] < 0) {
                wasNeg = true;
            } else {
                wasPos = true;
            }
        }
        if (! (wasNeg && wasPos)) {
            return new cError(cErrorType.not_numeric);
        }
        do {
            xirrRes = xirrFunction(valueArray, dateArray, res);
            newXirrRes = res - xirrRes / xirrDeriv(valueArray, dateArray, res);
            eps = Math.abs(newXirrRes - res);
            res = newXirrRes;
            bContLoop = (eps > deltaEps) && (Math.abs(xirrRes) > deltaEps);
        } while (--maxIter && bContLoop);
        if (bContLoop) {
            return new cError(cErrorType.not_numeric);
        }
        return new cNumber(res);
    }
    var dateArray = [],
    valueArray = [];
    if (arg0 instanceof cArea) {
        arg0.foreach2(function (c) {
            if (c instanceof cNumber) {
                valueArray.push(c);
            } else {
                if (c instanceof cEmpty) {
                    valueArray.push(c.tocNumber());
                } else {
                    valueArray.push(new cError(cErrorType.wrong_value_type));
                }
            }
        });
    } else {
        if (arg0 instanceof cArray) {
            arg0.foreach(function (c) {
                if (c instanceof cNumber) {
                    valueArray.push(c);
                } else {
                    if (c instanceof cEmpty) {
                        valueArray.push(c.tocNumber());
                    } else {
                        valueArray.push(new cError(cErrorType.wrong_value_type));
                    }
                }
            });
        } else {
            if (arg0 instanceof cArea3D) {
                if (arg0.wsFrom == arg0.wsTo) {
                    valueArray = arg0.getMatrix()[0];
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            } else {
                if (! (arg0 instanceof cNumber)) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                } else {
                    valueArray[0] = arg0;
                }
            }
        }
    }
    if (arg1 instanceof cArea) {
        arg1.foreach2(function (c) {
            if (c instanceof cNumber) {
                dateArray.push(c);
            } else {
                if (c instanceof cEmpty) {
                    dateArray.push(c.tocNumber());
                } else {
                    dateArray.push(new cError(cErrorType.wrong_value_type));
                }
            }
        });
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (c) {
                if (c instanceof cNumber) {
                    dateArray.push(c);
                } else {
                    if (c instanceof cEmpty) {
                        dateArray.push(c.tocNumber());
                    } else {
                        dateArray.push(new cError(cErrorType.wrong_value_type));
                    }
                }
            });
        } else {
            if (arg1 instanceof cArea3D) {
                if (arg1.wsFrom == arg1.wsTo) {
                    dateArray = arg1.getMatrix()[0];
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            } else {
                if (! (arg1 instanceof cNumber)) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                } else {
                    dateArray[0] = arg1;
                }
            }
        }
    }
    if (arg2 instanceof cRef || arg2 instanceof cRef3D) {
        arg2 = arg2.getValue();
        if (! (arg2 instanceof cNumber)) {
            return this.value = new cError(cErrorType.wrong_value_type);
        }
    } else {
        if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
            arg2 = arg2.cross(arguments[1].first);
            if (! (arg2 instanceof cNumber)) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
        } else {
            if (arg2 instanceof cArray) {
                arg2 = arg2.getElement(0);
                if (! (arg2 instanceof cNumber)) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
        }
    }
    arg2 = arg2.tocNumber();
    if (arg2 instanceof cError) {
        return this.value = arg2;
    }
    this.value = xirr(valueArray, dateArray, arg2);
    this.value.numFormat = 9;
    return this.value;
};
cXIRR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( values , dates [ , [ guess ] ] )"
    };
};
function cXNPV() {
    this.name = "XNPV";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cXNPV.prototype = Object.create(cBaseFunction.prototype);
cXNPV.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    function xnpv(rate, valueArray, dateArray) {
        var res = 0,
        vaTmp, daTmp, r = rate.getValue();
        if (dateArray.length != valueArray.length) {
            return new cError(cErrorType.not_numeric);
        }
        if (! (dateArray[0] instanceof cNumber) || !(valueArray[0] instanceof cNumber)) {
            return new cError(cErrorType.wrong_value_type);
        }
        var d1 = Math.floor(dateArray[0].getValue()),
        wasNeg = false,
        wasPos = false;
        for (var i = 0; i < dateArray.length; i++) {
            vaTmp = valueArray[i].tocNumber();
            daTmp = dateArray[i].tocNumber();
            if (vaTmp instanceof cError || daTmp instanceof cError) {
                return new cError(cErrorType.not_numeric);
            }
            res += vaTmp.getValue() / (Math.pow((1 + r), (Math.floor(daTmp.getValue()) - d1) / 365));
        }
        return new cNumber(res);
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    }
    arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    var dateArray = [],
    valueArray = [];
    if (arg1 instanceof cArea) {
        arg1.foreach2(function (c) {
            if (c instanceof cNumber) {
                valueArray.push(c);
            } else {
                valueArray.push(new cError(cErrorType.not_numeric));
            }
        });
    } else {
        if (arg1 instanceof cArray) {
            arg1.foreach(function (c) {
                if (c instanceof cNumber) {
                    valueArray.push(c);
                } else {
                    valueArray.push(new cError(cErrorType.not_numeric));
                }
            });
        } else {
            if (arg1 instanceof cArea3D) {
                if (arg1.wsFrom == arg1.wsTo) {
                    valueArray = arg1.getMatrix()[0];
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            } else {
                arg1 = arg1.tocNumber();
                if (arg1 instanceof cError) {
                    return this.value = new cError(cErrorType.not_numeric);
                } else {
                    valueArray[0] = arg1;
                }
            }
        }
    }
    if (arg2 instanceof cArea) {
        arg2.foreach2(function (c) {
            if (c instanceof cNumber) {
                dateArray.push(c);
            } else {
                dateArray.push(new cError(cErrorType.not_numeric));
            }
        });
    } else {
        if (arg2 instanceof cArray) {
            arg2.foreach(function (c) {
                if (c instanceof cNumber) {
                    dateArray.push(c);
                } else {
                    dateArray.push(new cError(cErrorType.not_numeric));
                }
            });
        } else {
            if (arg2 instanceof cArea3D) {
                if (arg2.wsFrom == arg2.wsTo) {
                    dateArray = arg2.getMatrix()[0];
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            } else {
                arg2 = arg2.tocNumber();
                if (arg2 instanceof cError) {
                    return this.value = new cError(cErrorType.not_numeric);
                } else {
                    dateArray[0] = arg2;
                }
            }
        }
    }
    return this.value = xnpv(arg0, valueArray, dateArray);
};
cXNPV.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( rate , values , dates  )"
    };
};
function cYIELD() {
    this.name = "YIELD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 6;
    this.argumentsCurrent = 0;
    this.argumentsMax = 7;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cYIELD.prototype = Object.create(cBaseFunction.prototype);
cYIELD.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    rate = arg[2],
    pr = arg[3],
    redemption = arg[4],
    frequency = arg[5],
    basis = arg[6] && !(arg[6] instanceof cEmpty) ? arg[6] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (frequency instanceof cArea || frequency instanceof cArea3D) {
        frequency = frequency.cross(arguments[1].first);
    } else {
        if (frequency instanceof cArray) {
            frequency = frequency.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    frequency = frequency.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (frequency instanceof cError) {
        return this.value = frequency;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    rate = rate.getValue();
    pr = pr.getValue();
    redemption = redemption.getValue();
    frequency = Math.floor(frequency.getValue());
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || (frequency != 1 && frequency != 2 && frequency != 4) || rate < 0 || pr <= 0 || redemption <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    this.value = new cNumber(getYield(settl, matur, rate, pr, redemption, frequency, basis));
    return this.value;
};
cYIELD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , rate , pr , redemption , frequency [ , [ basis ] ] )"
    };
};
function cYIELDDISC() {
    this.name = "YIELDDISC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 4;
    this.argumentsCurrent = 0;
    this.argumentsMax = 5;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cYIELDDISC.prototype = Object.create(cBaseFunction.prototype);
cYIELDDISC.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    pr = arg[2],
    redemption = arg[3],
    basis = arg[4] && !(arg[4] instanceof cEmpty) ? arg[4] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    if (redemption instanceof cArea || redemption instanceof cArea3D) {
        redemption = redemption.cross(arguments[1].first);
    } else {
        if (redemption instanceof cArray) {
            redemption = redemption.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    pr = pr.tocNumber();
    redemption = redemption.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    if (redemption instanceof cError) {
        return this.value = redemption;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    pr = pr.getValue();
    redemption = redemption.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || pr <= 0 || redemption <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity);
    var fRet = (redemption / pr) - 1;
    fRet /= yearFrac(settl, matur, basis);
    this.value = new cNumber(fRet);
    this.value.numFormat = 10;
    return this.value;
};
cYIELDDISC.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , pr , redemption , [ , [ basis ] ] )"
    };
};
function cYIELDMAT() {
    this.name = "YIELDMAT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 5;
    this.argumentsCurrent = 0;
    this.argumentsMax = 6;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cYIELDMAT.prototype = Object.create(cBaseFunction.prototype);
cYIELDMAT.prototype.Calculate = function (arg) {
    var settlement = arg[0],
    maturity = arg[1],
    issue = arg[2],
    rate = arg[3],
    pr = arg[4],
    basis = arg[5] && !(arg[5] instanceof cEmpty) ? arg[5] : new cNumber(0);
    if (settlement instanceof cArea || settlement instanceof cArea3D) {
        settlement = settlement.cross(arguments[1].first);
    } else {
        if (settlement instanceof cArray) {
            settlement = settlement.getElementRowCol(0, 0);
        }
    }
    if (maturity instanceof cArea || maturity instanceof cArea3D) {
        maturity = maturity.cross(arguments[1].first);
    } else {
        if (maturity instanceof cArray) {
            maturity = maturity.getElementRowCol(0, 0);
        }
    }
    if (issue instanceof cArea || issue instanceof cArea3D) {
        issue = issue.cross(arguments[1].first);
    } else {
        if (issue instanceof cArray) {
            issue = issue.getElementRowCol(0, 0);
        }
    }
    if (rate instanceof cArea || rate instanceof cArea3D) {
        rate = rate.cross(arguments[1].first);
    } else {
        if (rate instanceof cArray) {
            rate = rate.getElementRowCol(0, 0);
        }
    }
    if (pr instanceof cArea || pr instanceof cArea3D) {
        pr = pr.cross(arguments[1].first);
    } else {
        if (pr instanceof cArray) {
            pr = pr.getElementRowCol(0, 0);
        }
    }
    if (basis instanceof cArea || basis instanceof cArea3D) {
        basis = basis.cross(arguments[1].first);
    } else {
        if (basis instanceof cArray) {
            basis = basis.getElementRowCol(0, 0);
        }
    }
    settlement = settlement.tocNumber();
    maturity = maturity.tocNumber();
    issue = issue.tocNumber();
    rate = rate.tocNumber();
    pr = pr.tocNumber();
    basis = basis.tocNumber();
    if (settlement instanceof cError) {
        return this.value = settlement;
    }
    if (maturity instanceof cError) {
        return this.value = maturity;
    }
    if (issue instanceof cError) {
        return this.value = issue;
    }
    if (rate instanceof cError) {
        return this.value = rate;
    }
    if (pr instanceof cError) {
        return this.value = pr;
    }
    if (basis instanceof cError) {
        return this.value = basis;
    }
    settlement = Math.floor(settlement.getValue());
    maturity = Math.floor(maturity.getValue());
    issue = Math.floor(issue.getValue());
    rate = rate.getValue();
    pr = pr.getValue();
    basis = Math.floor(basis.getValue());
    if (settlement < startRangeCurrentDateSystem || maturity < startRangeCurrentDateSystem || issue < startRangeCurrentDateSystem || settlement >= maturity || basis < 0 || basis > 4 || pr <= 0 || rate <= 0) {
        return this.value = new cError(cErrorType.not_numeric);
    }
    var settl = Date.prototype.getDateFromExcel(settlement),
    matur = Date.prototype.getDateFromExcel(maturity),
    iss = Date.prototype.getDateFromExcel(issue),
    res = getyieldmat(settl, matur, iss, rate, pr, basis);
    this.value = new cNumber(res);
    this.value.numFormat = 10;
    return this.value;
};
cYIELDMAT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "( settlement , maturity , issue , rate , pr [ , [ basis ] ] )"
    };
};