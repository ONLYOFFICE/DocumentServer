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
function CMathDegreePr() {
    this.type = DEGREE_SUPERSCRIPT;
}
CMathDegreePr.prototype.Set_FromObject = function (Obj) {
    if (DEGREE_SUPERSCRIPT === Obj.type || DEGREE_SUBSCRIPT === Obj.type) {
        this.type = Obj.type;
    } else {
        this.type = DEGREE_SUPERSCRIPT;
    }
};
CMathDegreePr.prototype.Copy = function () {
    var NewPr = new CMathDegreePr();
    NewPr.type = this.type;
    return NewPr;
};
CMathDegreePr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteLong(this.type);
};
CMathDegreePr.prototype.Read_FromBinary = function (Reader) {
    this.type = Reader.GetLong(Reader);
};
function CDegreeBase(props, bInside) {
    CDegreeBase.superclass.constructor.call(this, bInside);
    this.upBase = 0;
    this.upIter = 0;
    this.Pr = new CMathDegreePr();
    this.baseContent = null;
    this.iterContent = null;
    this.bNaryInline = false;
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
}
Asc.extendClass(CDegreeBase, CMathBase);
CDegreeBase.prototype.init = function (props) {
    this.setProperties(props);
    this.setDimension(1, 2);
};
CDegreeBase.prototype.fillContent = function () {
    this.setDimension(1, 2);
    this.elements[0][0] = this.baseContent;
    this.elements[0][1] = this.iterContent;
};
CDegreeBase.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    this.ApplyProperties(RPI);
    if (this.bInside == false) {
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);
    }
    this.baseContent.PreRecalc(this, ParaMath, ArgSize, RPI);
    var ArgSzDegr = ArgSize.Copy();
    ArgSzDegr.decrease();
    var RPIDegr = RPI.Copy();
    RPIDegr.bDecreasedComp = true;
    this.bNaryInline = RPI.bNaryInline;
    this.iterContent.PreRecalc(this, ParaMath, ArgSzDegr, RPIDegr);
};
CDegreeBase.prototype.Resize = function (oMeasure, RPI) {
    this.baseContent.Resize(oMeasure, RPI);
    this.iterContent.Resize(oMeasure, RPI);
    if (this.Pr.type === DEGREE_SUPERSCRIPT) {
        this.recalculateSup(oMeasure);
    } else {
        if (this.Pr.type === DEGREE_SUBSCRIPT) {
            this.recalculateSubScript(oMeasure);
        }
    }
};
CDegreeBase.prototype.recalculateSup = function (oMeasure) {
    var base = this.elements[0][0].size,
    iter = this.elements[0][1].size;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    this.upBase = 0;
    this.upIter = 0;
    var bTextElement = false,
    lastElem;
    if (!this.baseContent.IsJustDraw()) {
        lastElem = this.baseContent.GetLastElement();
        var BaseRun = lastElem.Type == para_Math_Run && mgCtrPrp.FontSize == lastElem.Get_CompiledPr(false).FontSize;
        bTextElement = BaseRun || (lastElem.Type !== para_Math_Run && lastElem.IsJustDraw());
    }
    var PlH = 0.64 * this.ParaMath.GetPlh(oMeasure, mgCtrPrp);
    var UpBaseline = 0.75 * PlH;
    if (bTextElement) {
        var last = lastElem.size,
        upBaseLast = 0,
        upBaseIter = 0;
        if ((last.ascent - UpBaseline) + (iter.height - iter.ascent) > (last.ascent - 2 / 9 * PlH)) {
            upBaseLast = iter.height - (last.ascent - 2 / 9 * PlH);
        } else {
            if (UpBaseline + iter.ascent > last.ascent) {
                upBaseLast = UpBaseline + iter.ascent - last.ascent;
            } else {
                upBaseIter = last.ascent - UpBaseline - iter.ascent;
            }
        }
        if (upBaseLast + last.ascent > base.ascent) {
            this.upBase = upBaseLast - (base.ascent - last.ascent);
            this.upIter = upBaseIter;
        } else {
            this.upBase = 0;
            this.upIter = (base.ascent - upBaseLast - last.ascent) + upBaseIter;
        }
    } else {
        var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
        if (iter.height - iter.ascent + shCenter > base.ascent) {
            this.upBase = iter.height - (base.ascent - shCenter);
        } else {
            if (iter.ascent > shCenter) {
                this.upBase = iter.ascent - shCenter;
            } else {
                this.upIter = shCenter - iter.ascent;
            }
        }
    }
    var height = this.upBase + base.height;
    var ascent = this.upBase + base.ascent;
    if (this.bNaryInline) {
        this.dW = 0.17 * PlH;
    } else {
        this.dW = 0.056 * PlH;
    }
    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CDegreeBase.prototype.recalculateSubScript = function (oMeasure) {
    var base = this.elements[0][0].size,
    iter = this.elements[0][1].size;
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    var bTextElement = false,
    lastElem;
    if (!this.baseContent.IsJustDraw()) {
        lastElem = this.baseContent.GetLastElement();
        var txtPrpControl = this.ParaMath.GetFirstRPrp();
        var BaseRun = lastElem.Type == para_Math_Run && txtPrpControl.FontSize == lastElem.Get_CompiledPr(false).FontSize;
        bTextElement = BaseRun || (lastElem.Type !== para_Math_Run && lastElem.IsJustDraw());
    }
    var height, ascent, descent;
    var PlH = 0.64 * this.ParaMath.GetPlh(oMeasure, mgCtrPrp);
    if (bTextElement) {
        var DownBaseline = 0.9 * shCenter;
        if (iter.ascent - DownBaseline > 3 / 4 * PlH) {
            this.upIter = 1 / 4 * PlH;
        } else {
            this.upIter = PlH + DownBaseline - iter.ascent;
        }
        if (base.ascent > PlH) {
            this.upIter += base.ascent - PlH;
        }
        var descentBase = base.height - base.ascent,
        descentIter = this.upIter + iter.height - base.ascent;
        descent = descentBase > descentIter ? descentBase : descentIter;
        ascent = base.ascent;
        height = ascent + descent;
    } else {
        this.upIter = base.height + shCenter - iter.ascent;
        if (base.ascent - 1.5 * shCenter > this.upIter) {
            this.upIter = base.ascent - 1.5 * shCenter;
        }
        height = this.upIter + iter.height;
        ascent = base.ascent;
    }
    if (this.bNaryInline) {
        this.dW = 0.17 * PlH;
    } else {
        this.dW = 0.056 * PlH;
    }
    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CDegreeBase.prototype.setPosition = function (pos, PosInfo) {
    this.pos.x = pos.x;
    if (this.bInside === true) {
        this.pos.y = pos.y;
    } else {
        this.pos.y = pos.y - this.size.ascent;
    }
    var PosBase = new CMathPosition();
    PosBase.x = this.pos.x + this.GapLeft;
    PosBase.y = this.pos.y + this.upBase;
    var PosIter = new CMathPosition();
    PosIter.x = this.pos.x + this.GapLeft + this.elements[0][0].size.width + this.dW;
    PosIter.y = this.pos.y + this.upIter;
    this.elements[0][0].setPosition(PosBase, PosInfo);
    this.elements[0][1].setPosition(PosIter, PosInfo);
};
CDegreeBase.prototype.getIterator = function () {
    return this.iterContent;
};
CDegreeBase.prototype.getUpperIterator = function () {
    return this.iterContent;
};
CDegreeBase.prototype.getLowerIterator = function () {
    return this.iterContent;
};
CDegreeBase.prototype.getBase = function () {
    return this.baseContent;
};
CDegreeBase.prototype.IsPlhIterator = function () {
    return this.iterContent.IsPlaceholder();
};
CDegreeBase.prototype.setBase = function (base) {
    this.baseContent = base;
};
CDegreeBase.prototype.setIterator = function (iterator) {
    this.iterContent = iterator;
};
function CDegree(props, bInside) {
    CDegree.superclass.constructor.call(this, props, bInside);
    this.Id = g_oIdCounter.Get_NewId();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CDegree, CDegreeBase);
CDegree.prototype.ClassType = historyitem_type_deg;
CDegree.prototype.kind = MATH_DEGREE;
CDegree.prototype.init = function (props) {
    this.Fill_LogicalContent(2);
    this.setProperties(props);
    this.fillContent();
};
CDegree.prototype.fillContent = function () {
    this.iterContent = this.Content[1];
    this.baseContent = this.Content[0];
    CDegree.superclass.fillContent.apply(this, arguments);
};
CDegree.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Script;
    MathProps.Pr = null;
};
function CIterators(iterUp, iterDn) {
    CIterators.superclass.constructor.call(this, true);
    this.lUp = 0;
    this.lD = 0;
    this.upper = 0;
    this.iterUp = iterUp;
    this.iterDn = iterDn;
}
Asc.extendClass(CIterators, CMathBase);
CIterators.prototype.init = function () {
    this.setDimension(2, 1);
    this.elements[0][0] = this.iterUp;
    this.elements[1][0] = this.iterDn;
};
CIterators.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.ArgSize.SetValue(-1);
    var ArgSzIters = ArgSize.Copy();
    ArgSzIters.Merge(this.ArgSize);
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    var RPI_ITER = RPI.Copy();
    RPI_ITER.bDecreasedComp = true;
    this.iterUp.PreRecalc(this, ParaMath, ArgSzIters, RPI_ITER);
    this.iterDn.PreRecalc(this, ParaMath, ArgSzIters, RPI_ITER);
};
CIterators.prototype.recalculateSize = function (oMeasure, dH, ascent) {
    this.dH = dH;
    var iterUp = this.iterUp.size,
    iterDown = this.iterDn.size;
    this.size.ascent = ascent;
    this.size.height = iterUp.height + dH + iterDown.height;
    this.size.width = iterUp.width > iterDown.width ? iterUp.width : iterDown.width;
};
CIterators.prototype.getUpperIterator = function () {
    return this.elements[0][0];
};
CIterators.prototype.getLowerIterator = function () {
    return this.elements[1][0];
};
CIterators.prototype.setUpperIterator = function (iterator) {
    this.elements[0][0] = iterator;
};
CIterators.prototype.setLowerIterator = function (iterator) {
    this.elements[1][0] = iterator;
};
CIterators.prototype.alignIterators = function (mcJc) {
    this.alignment.wdt[0] = mcJc;
};
function CMathDegreeSubSupPr() {
    this.type = DEGREE_SubSup;
    this.alnScr = false;
}
CMathDegreeSubSupPr.prototype.Set_FromObject = function (Obj) {
    if (true === Obj.alnScr || 1 === Obj.alnScr) {
        this.alnScr = true;
    } else {
        this.alnScr = false;
    }
    if (DEGREE_SubSup === Obj.type || DEGREE_PreSubSup === Obj.type) {
        this.type = Obj.type;
    }
};
CMathDegreeSubSupPr.prototype.Copy = function () {
    var NewPr = new CMathDegreeSubSupPr();
    NewPr.type = this.type;
    NewPr.alnScr = this.alnScr;
    return NewPr;
};
CMathDegreeSubSupPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteLong(this.type);
    Writer.WriteBool(this.alnScr);
};
CMathDegreeSubSupPr.prototype.Read_FromBinary = function (Reader) {
    this.type = Reader.GetLong();
    this.alnScr = Reader.GetBool();
};
function CDegreeSubSupBase(props, bInside) {
    CDegreeSubSupBase.superclass.constructor.call(this, bInside);
    this.gapBase = 0;
    this.bNaryInline = false;
    this.Pr = new CMathDegreeSubSupPr();
    this.baseContent = null;
    this.iters = new CIterators(null, null);
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
}
Asc.extendClass(CDegreeSubSupBase, CMathBase);
CDegreeSubSupBase.prototype.init = function (props) {
    this.setProperties(props);
    this.setDimension(1, 2);
};
CDegreeSubSupBase.prototype.fillContent = function () {
    var oBase = this.baseContent;
    var oIters = this.iters;
    this.setDimension(1, 2);
    oIters.init();
    oIters.lUp = 0;
    oIters.lD = 0;
    if (this.Pr.type == DEGREE_SubSup) {
        oIters.alignIterators(MCJC_LEFT);
        this.addMCToContent([oBase, oIters]);
    } else {
        if (this.Pr.type == DEGREE_PreSubSup) {
            this.addMCToContent([oIters, oBase]);
            oIters.alignIterators(MCJC_RIGHT);
        }
    }
};
CDegreeSubSupBase.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.bNaryInline = RPI.bNaryInline;
    CDegreeSubSupBase.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, RPI, GapsInfo);
};
CDegreeSubSupBase.prototype.recalculateSize = function (oMeasure, RPI) {
    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var iterUp = this.iters.iterUp.size,
    iterDown = this.iters.iterDn.size,
    base = this.baseContent.size;
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.4;
    var PlH = 0.26 * this.ParaMath.GetPlh(oMeasure, mgCtrPrp);
    var height, width, ascent, descent;
    var dH;
    var minGap;
    var TextElement = false;
    if (!this.baseContent.IsJustDraw()) {
        var last = this.baseContent.GetLastElement();
        var BaseRun = last.Type == para_Math_Run && mgCtrPrp.FontSize >= last.Get_CompiledPr(false).FontSize;
        TextElement = BaseRun || (last.Type !== para_Math_Run && last.IsJustDraw());
    }
    if (TextElement) {
        minGap = 0.5 * PlH;
        var DivBaseline = 3.034 * PlH;
        var ascIters, dgrHeight;
        if (DivBaseline > minGap + iterDown.ascent + (iterUp.height - iterUp.ascent)) {
            dH = DivBaseline - iterDown.ascent - (iterUp.height - iterUp.ascent);
        } else {
            dH = minGap;
        }
        var GapDown = PlH;
        ascIters = iterUp.height + dH + GapDown;
        dgrHeight = iterDown.height + iterUp.height + dH;
        ascent = ascIters > base.ascent ? ascIters : base.ascent;
        var dscIter = dgrHeight - ascIters,
        dscBase = base.height - base.ascent;
        descent = dscIter > dscBase ? dscIter : dscBase;
        height = ascent + descent;
        this.iters.recalculateSize(oMeasure, dH, ascIters);
    } else {
        minGap = 0.7 * PlH;
        var lUpBase = base.ascent - shCenter;
        var lDownBase = base.height - lUpBase;
        var DescUpIter = iterUp.height - iterUp.ascent + PlH;
        var AscDownIter = iterDown.ascent - PlH;
        var UpGap, DownGap;
        if (this.bNaryInline) {
            UpGap = 0;
            DownGap = 0;
        } else {
            UpGap = lUpBase > DescUpIter ? lUpBase - DescUpIter : 0;
            DownGap = lDownBase > AscDownIter ? lDownBase - AscDownIter : 0;
        }
        if (UpGap + DownGap > minGap) {
            dH = UpGap + DownGap;
        } else {
            dH = minGap;
        }
        height = iterUp.height + dH + iterDown.height;
        ascent = iterUp.height + UpGap + shCenter;
        this.iters.recalculateSize(oMeasure, dH, ascent);
    }
    if (this.bNaryInline) {
        this.dW = 0.42 * PlH;
    } else {
        this.dW = 0.14 * PlH;
    }
    width = this.iters.size.width + base.width + this.dW;
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CDegreeSubSupBase.prototype.getBase = function () {
    return this.baseContent;
};
CDegreeSubSupBase.prototype.getUpperIterator = function () {
    return this.iters.iterUp;
};
CDegreeSubSupBase.prototype.getLowerIterator = function () {
    return this.iters.iterDn;
};
CDegreeSubSupBase.prototype.setBase = function (base) {
    this.baseContent = base;
};
CDegreeSubSupBase.prototype.setUpperIterator = function (iterator) {
    this.iters.iterUp = iterator;
};
CDegreeSubSupBase.prototype.setLowerIterator = function (iterator) {
    this.iters.iterDn = iterator;
};
function CDegreeSubSup(props, bInside) {
    CDegreeSubSup.superclass.constructor.call(this, props, bInside);
    this.Id = g_oIdCounter.Get_NewId();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CDegreeSubSup, CDegreeSubSupBase);
CDegreeSubSup.prototype.ClassType = historyitem_type_deg_subsup;
CDegreeSubSup.prototype.kind = MATH_DEGREESubSup;
CDegreeSubSup.prototype.init = function (props) {
    this.Fill_LogicalContent(3);
    this.setProperties(props);
    this.fillContent();
};
CDegreeSubSup.prototype.fillContent = function () {
    if (DEGREE_SubSup === this.Pr.type) {
        this.baseContent = this.Content[0];
        this.iters = new CIterators(this.Content[2], this.Content[1]);
    } else {
        this.baseContent = this.Content[2];
        this.iters = new CIterators(this.Content[1], this.Content[0]);
    }
    CDegreeSubSup.superclass.fillContent.apply(this, arguments);
};
CDegreeSubSup.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Script;
    MathProps.Pr = null;
};