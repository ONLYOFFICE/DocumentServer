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
function CMathFractionPr() {
    this.type = BAR_FRACTION;
}
CMathFractionPr.prototype.Set_FromObject = function (Obj) {
    if (undefined !== Obj.type && null !== Obj.type) {
        this.type = Obj.type;
    }
};
CMathFractionPr.prototype.Copy = function (Obj) {
    var NewPr = new CMathFractionPr();
    NewPr.type = this.type;
    return NewPr;
};
CMathFractionPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteLong(this.type);
};
CMathFractionPr.prototype.Read_FromBinary = function (Reader) {
    this.type = Reader.GetLong();
};
function CFraction(props) {
    CFraction.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Numerator = null;
    this.Denominator = null;
    this.Pr = new CMathFractionPr();
    this.bHideBar = false;
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CFraction, CMathBase);
CFraction.prototype.ClassType = historyitem_type_frac;
CFraction.prototype.kind = MATH_FRACTION;
CFraction.prototype.init = function (props) {
    this.Fill_LogicalContent(2);
    this.setProperties(props);
    this.fillContent();
};
CFraction.prototype.getType = function () {
    return this.Pr.type;
};
CFraction.prototype.draw = function (x, y, pGraphics, PDSE) {
    if (this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION) {
        this.drawBarFraction(x, y, pGraphics, PDSE);
    } else {
        if (this.Pr.type == SKEWED_FRACTION) {
            this.drawSkewedFraction(x, y, pGraphics, PDSE);
        } else {
            if (this.Pr.type == LINEAR_FRACTION) {
                this.drawLinearFraction(x, y, pGraphics, PDSE);
            }
        }
    }
};
CFraction.prototype.drawBarFraction = function (x, y, pGraphics, PDSE) {
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var penW = mgCtrPrp.FontSize * 25.4 / 96 * 0.08;
    var numHeight = this.elements[0][0].size.height;
    var width = this.size.width - this.GapLeft - this.GapRight;
    var x1 = this.pos.x + x + this.GapLeft,
    x2 = x1 + width,
    y1 = this.pos.y + y + numHeight - penW;
    if (!this.bHideBar) {
        pGraphics.SetFont(mgCtrPrp);
        this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }
    CFraction.superclass.draw.call(this, x, y, pGraphics, PDSE);
};
CFraction.prototype.drawSkewedFraction = function (x, y, pGraphics, PDSE) {
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var penW = mgCtrPrp.FontSize / 12.5 * g_dKoef_pix_to_mm;
    var gap = this.dW / 2 - penW / 7.5;
    var plh = 9.877777777777776 * mgCtrPrp.FontSize / 36;
    var minHeight = 2 * this.dW,
    middleHeight = plh * 4 / 3,
    maxHeight = (3 * this.dW + 5 * plh) * 2 / 3;
    var tg;
    var tg1 = -2.22,
    tg2 = -3.7;
    var X = this.pos.x + x + this.GapLeft,
    Y = this.pos.y + y;
    var heightSlash = this.size.height * 2 / 3;
    if (heightSlash < maxHeight) {
        if (heightSlash < minHeight) {
            heightSlash = minHeight;
            tg = tg1;
        } else {
            heightSlash = this.size.height * 2 / 3;
            tg = (heightSlash - maxHeight) * (tg1 - tg2) / (middleHeight - maxHeight) + tg2;
        }
        var b = this.elements[0][0].size.height - tg * (this.elements[0][0].size.width + gap);
        var y1 = this.elements[0][0].size.height / 3,
        y2 = this.elements[0][0].size.height / 3 + heightSlash;
        var x1 = (y1 - b) / tg,
        x2 = (y2 - b) / tg;
        var xx1 = X + x1,
        xx2 = X + x2;
        var yy1 = Y + y1,
        yy2 = Y + y2;
    } else {
        heightSlash = maxHeight;
        tg = tg2;
        var coeff = this.elements[0][0].size.height / this.size.height;
        var shift = heightSlash * coeff;
        var minVal = plh / 2,
        maxVal = heightSlash - minVal;
        if (shift < minVal) {
            shift = minVal;
        } else {
            if (shift > maxVal) {
                shift = maxVal;
            }
        }
        var y0 = this.elements[0][0].size.height - shift;
        var b = this.elements[0][0].size.height - tg * (this.elements[0][0].size.width + gap);
        var y1 = y0,
        y2 = y0 + heightSlash;
        var x1 = (y1 - b) / tg,
        x2 = (y2 - b) / tg;
        var xx1 = X + x1,
        xx2 = X + x2;
        var yy1 = Y + y1,
        yy2 = Y + y2;
    }
    pGraphics.SetFont(mgCtrPrp);
    pGraphics.p_width(penW * 1000);
    this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());
    pGraphics._s();
    pGraphics._m(xx1, yy1);
    pGraphics._l(xx2, yy2);
    pGraphics.ds();
    CFraction.superclass.draw.call(this, x, y, pGraphics, PDSE);
};
CFraction.prototype.drawLinearFraction = function (x, y, pGraphics, PDSE) {
    var shift = 0.1 * this.dW;
    var X = this.pos.x + x + this.GapLeft,
    Y = this.pos.y + y;
    var x1 = X + this.elements[0][0].size.width + this.dW - shift,
    y1 = Y,
    x2 = X + this.elements[0][0].size.width + shift,
    y2 = Y + this.size.height;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var penW = mgCtrPrp.FontSize / 12.5 * g_dKoef_pix_to_mm;
    pGraphics.SetFont(mgCtrPrp);
    pGraphics.p_width(penW * 1000);
    this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());
    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();
    CFraction.superclass.draw.call(this, x, y, pGraphics, PDSE);
};
CFraction.prototype.getNumerator = function () {
    var numerator;
    if (this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION) {
        numerator = this.elements[0][0].getElement();
    } else {
        numerator = this.elements[0][0];
    }
    return numerator;
};
CFraction.prototype.getDenominator = function () {
    var denominator;
    if (this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION) {
        denominator = this.elements[1][0].getElement();
    } else {
        denominator = this.elements[0][1];
    }
    return denominator;
};
CFraction.prototype.getNumeratorMathContent = function () {
    return this.Content[0];
};
CFraction.prototype.getDenominatorMathContent = function () {
    return this.Content[1];
};
CFraction.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    var ArgSzNumDen = ArgSize.Copy();
    if (RPI.bInline == true && (this.Pr.type === BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)) {
        ArgSzNumDen.decrease();
        this.ArgSize.SetValue(-1);
    } else {
        if (RPI.bDecreasedComp == true) {
            this.ArgSize.SetValue(-1);
        } else {
            this.ArgSize.SetValue(0);
        }
    }
    this.RecalcInfo.bCtrPrp = true;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    this.ApplyProperties(RPI);
    var NewRPI = RPI.Copy();
    if (this.Pr.type !== LINEAR_FRACTION) {
        NewRPI.bDecreasedComp = true;
    }
    if (this.bInside == false) {
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);
    }
    this.Numerator.PreRecalc(this, ParaMath, ArgSzNumDen, NewRPI);
    this.Denominator.PreRecalc(this, ParaMath, ArgSzNumDen, NewRPI);
};
CFraction.prototype.recalculateSize = function (oMeasure) {
    if (this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION) {
        this.recalculateBarFraction(oMeasure);
    } else {
        if (this.Pr.type == SKEWED_FRACTION) {
            this.recalculateSkewed(oMeasure);
        } else {
            if (this.Pr.type == LINEAR_FRACTION) {
                this.recalculateLinear(oMeasure);
            }
        }
    }
};
CFraction.prototype.recalculateBarFraction = function (oMeasure) {
    var num = this.elements[0][0].size,
    den = this.elements[1][0].size;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var width = num.width > den.width ? num.width : den.width;
    var height = num.height + den.height;
    var ascent = num.height + this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CFraction.prototype.recalculateSkewed = function (oMeasure) {
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    this.dW = 5.011235894097222 * mgCtrPrp.FontSize / 36;
    var width = this.elements[0][0].size.width + this.dW + this.elements[0][1].size.width;
    var height = this.elements[0][0].size.height + this.elements[0][1].size.height;
    var ascent = this.elements[0][0].size.height + this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CFraction.prototype.recalculateLinear = function () {
    var AscentFirst = this.elements[0][0].size.ascent,
    DescentFirst = this.elements[0][0].size.height - this.elements[0][0].size.ascent,
    AscentSecond = this.elements[0][1].size.ascent,
    DescentSecond = this.elements[0][1].size.height - this.elements[0][1].size.ascent;
    var H = AscentFirst + DescentSecond;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var gap = 5.011235894097222 * mgCtrPrp.FontSize / 36;
    var H3 = gap * 4.942252165543792,
    H4 = gap * 7.913378248315688,
    H5 = gap * 9.884504331087584;
    if (H < H3) {
        this.dW = gap;
    } else {
        if (H < H4) {
            this.dW = 2 * gap;
        } else {
            if (H < H5) {
                this.dW = 2.8 * gap;
            } else {
                this.dW = 3.4 * gap;
            }
        }
    }
    var ascent = AscentFirst > AscentSecond ? AscentFirst : AscentSecond;
    var descent = DescentFirst > DescentSecond ? DescentFirst : DescentSecond;
    var height = ascent + descent;
    var width = this.elements[0][0].size.width + this.dW + this.elements[0][1].size.width;
    width += this.GapLeft + this.GapRight;
    this.size = {
        height: height,
        width: width,
        ascent: ascent
    };
};
CFraction.prototype.setPosition = function (pos, PosInfo) {
    if (this.Pr.type == SKEWED_FRACTION) {
        this.pos.x = pos.x;
        this.pos.y = pos.y - this.size.ascent;
        var X = this.pos.x + this.GapLeft,
        Y = this.pos.y;
        var PosNum = new CMathPosition();
        PosNum.x = X;
        PosNum.y = Y;
        var PosDen = new CMathPosition();
        PosDen.x = X + this.elements[0][0].size.width + this.dW;
        PosDen.y = Y + this.elements[0][0].size.height;
        this.elements[0][0].setPosition(PosNum, PosInfo);
        this.elements[0][1].setPosition(PosDen, PosInfo);
    } else {
        CFraction.superclass.setPosition.call(this, pos, PosInfo);
    }
};
CFraction.prototype.fillContent = function () {
    this.Numerator = new CNumerator(this.Content[0]);
    this.Denominator = new CDenominator(this.Content[1]);
    if (this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION) {
        this.setDimension(2, 1);
        if (this.Pr.type == NO_BAR_FRACTION) {
            this.bHideBar = true;
        }
        this.elements[0][0] = this.Numerator;
        this.elements[1][0] = this.Denominator;
    } else {
        if (this.Pr.type == SKEWED_FRACTION) {
            this.setDimension(1, 2);
            this.elements[0][0] = this.Numerator.getElement();
            this.elements[0][1] = this.Denominator.getElement();
        } else {
            if (this.Pr.type == LINEAR_FRACTION) {
                this.setDimension(1, 2);
                this.elements[0][0] = this.Numerator.getElement();
                this.elements[0][1] = this.Denominator.getElement();
            }
        }
    }
};
CFraction.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Fraction;
    MathProps.Pr = null;
};
function CFractionBase(bInside, MathContent) {
    CFractionBase.superclass.constructor.call(this, bInside);
    this.gap = 0;
    this.init(MathContent);
}
Asc.extendClass(CFractionBase, CMathBase);
CFractionBase.prototype.init = function (MathContent) {
    this.setDimension(1, 1);
    this.elements[0][0] = MathContent;
};
CFractionBase.prototype.getElement = function () {
    return this.elements[0][0];
};
CFractionBase.prototype.setElement = function (Element) {
    this.elements[0][0] = Element;
};
CFractionBase.prototype.getPropsForWrite = function () {
    return {};
};
CFractionBase.prototype.Get_Id = function () {
    return this.elements[0][0].Get_Id();
};
function CNumerator(MathContent) {
    CNumerator.superclass.constructor.call(this, true, MathContent);
}
Asc.extendClass(CNumerator, CFractionBase);
CNumerator.prototype.recalculateSize = function () {
    var arg = this.elements[0][0].size;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var Descent = arg.height - arg.ascent;
    g_oTextMeasurer.SetFont(mgCtrPrp);
    var Height = g_oTextMeasurer.GetHeight();
    var gapNum, minGap;
    if (this.Parent.kind == MATH_LIMIT || this.Parent.kind == MATH_GROUP_CHARACTER) {
        gapNum = Height / 4.14;
        minGap = Height / 13.8;
        var delta = gapNum - Descent;
        this.gap = delta > minGap ? delta : minGap;
    } else {
        gapNum = Height / 3.05;
        minGap = Height / 9.77;
        var delta = gapNum - Descent;
        this.gap = delta > minGap ? delta : minGap;
    }
    var width = arg.width;
    var height = arg.height + this.gap;
    var ascent = arg.ascent;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CNumerator.prototype.setPosition = function (pos, PosInfo) {
    this.elements[0][0].setPosition(pos, PosInfo);
};
function CDenominator(MathContent) {
    CDenominator.superclass.constructor.call(this, true, MathContent);
}
Asc.extendClass(CDenominator, CFractionBase);
CDenominator.prototype.recalculateSize = function () {
    var arg = this.elements[0][0].size;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var Ascent = arg.ascent - 4.938888888888888 * mgCtrPrp.FontSize / 36;
    g_oTextMeasurer.SetFont(mgCtrPrp);
    var Height = g_oTextMeasurer.GetHeight();
    var gapDen, minGap;
    if (this.Parent.kind == MATH_LIMIT || this.Parent.kind == MATH_GROUP_CHARACTER) {
        gapDen = Height / 2.6;
        minGap = Height / 10;
    } else {
        gapDen = Height / 2.03;
        minGap = Height / 6.1;
    }
    var delta = gapDen - Ascent;
    this.gap = delta > minGap ? delta : minGap;
    var width = arg.width;
    var height = arg.height + this.gap;
    var ascent = arg.ascent + this.gap;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CDenominator.prototype.setPosition = function (pos, PosInfo) {
    var NewPos = new CMathPosition();
    NewPos.x = pos.x;
    NewPos.y = pos.y + this.gap;
    this.elements[0][0].setPosition(NewPos, PosInfo);
};