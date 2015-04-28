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
function CMathNaryPr() {
    this.chr = undefined;
    this.chrType = NARY_INTEGRAL;
    this.grow = false;
    this.limLoc = undefined;
    this.subHide = false;
    this.supHide = false;
}
CMathNaryPr.prototype.Set_FromObject = function (Obj) {
    this.chr = Obj.chr;
    this.chrType = Obj.chrType;
    if (true === Obj.grow === true || 1 === Obj.grow) {
        this.grow = true;
    }
    if (NARY_UndOvr === Obj.limLoc || NARY_SubSup === Obj.limLoc) {
        this.limLoc = Obj.limLoc;
    }
    if (true === Obj.subHide === true || 1 === Obj.subHide) {
        this.subHide = true;
    }
    if (true === Obj.supHide === true || 1 === Obj.supHide) {
        this.supHide = true;
    }
};
CMathNaryPr.prototype.Copy = function () {
    var NewPr = new CMathNaryPr();
    NewPr.chr = this.chr;
    NewPr.chrType = this.chrType;
    NewPr.grow = this.grow;
    NewPr.limLoc = this.limLoc;
    NewPr.subHide = this.subHide;
    NewPr.supHide = this.supHide;
    return NewPr;
};
CMathNaryPr.prototype.Write_ToBinary = function (Writer) {
    var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
    if (undefined !== this.chr) {
        Writer.WriteLong(this.chr);
        Flags |= 1;
    }
    if (undefined !== this.chrType) {
        Writer.WriteLong(this.chrType);
        Flags |= 2;
    }
    if (undefined !== this.limLoc) {
        Writer.WriteLong(this.limLoc);
        Flags |= 4;
    }
    var EndPos = Writer.GetCurPosition();
    Writer.Seek(StartPos);
    Writer.WriteLong(Flags);
    Writer.Seek(EndPos);
    Writer.WriteBool(this.grow);
    Writer.WriteBool(this.subHide);
    Writer.WriteBool(this.supHide);
};
CMathNaryPr.prototype.Read_FromBinary = function (Reader) {
    var Flags = Reader.GetLong();
    if (Flags & 1) {
        this.chr = Reader.GetLong();
    } else {
        this.chr = undefined;
    }
    if (Flags & 2) {
        this.chrType = Reader.GetLong();
    } else {
        this.chrType = undefined;
    }
    if (Flags & 4) {
        this.limLoc = Reader.GetLong();
    } else {
        this.limLoc = undefined;
    }
    this.grow = Reader.GetBool();
    this.subHide = Reader.GetBool();
    this.supHide = Reader.GetBool();
};
function CNary(props) {
    CNary.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathNaryPr();
    this.Base = null;
    this.Sign = null;
    this.LowerIterator = null;
    this.UpperIterator = null;
    this.Arg = null;
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CNary, CMathBase);
CNary.prototype.ClassType = historyitem_type_nary;
CNary.prototype.kind = MATH_NARY;
CNary.prototype.init = function (props) {
    this.Fill_LogicalContent(3);
    this.setProperties(props);
    this.fillContent();
};
CNary.prototype.fillContent = function () {
    this.LowerIterator = this.Content[0];
    this.UpperIterator = this.Content[1];
    this.Arg = this.Content[2];
};
CNary.prototype.fillBase = function (PropsInfo) {
    this.setDimension(1, 2);
    var base;
    var Sign = PropsInfo.sign;
    var ctrPrp = this.CtrPrp.Copy();
    if (PropsInfo.limLoc === NARY_UndOvr) {
        if (PropsInfo.supHide && PropsInfo.subHide) {
            base = Sign;
        } else {
            if (PropsInfo.supHide && !PropsInfo.subHide) {
                base = new CNaryOvr(true);
                base.setBase(Sign);
                base.setLowerIterator(this.LowerIterator);
            } else {
                if (!PropsInfo.supHide && PropsInfo.subHide) {
                    base = new CNaryUnd(true);
                    base.setBase(Sign);
                    base.setUpperIterator(this.UpperIterator);
                } else {
                    base = new CNaryUndOvr(true);
                    base.setBase(Sign);
                    base.setUpperIterator(this.UpperIterator);
                    base.setLowerIterator(this.LowerIterator);
                }
            }
        }
    } else {
        var prp;
        if (PropsInfo.supHide && !PropsInfo.subHide) {
            prp = {
                type: DEGREE_SUBSCRIPT,
                ctrPrp: ctrPrp
            };
            base = new CDegreeBase(prp, true);
            base.setBase(Sign);
            base.setIterator(this.LowerIterator);
            base.fillContent();
        } else {
            if (!PropsInfo.supHide && PropsInfo.subHide) {
                prp = {
                    type: DEGREE_SUPERSCRIPT,
                    ctrPrp: ctrPrp
                };
                base = new CDegreeBase(prp, true);
                base.setBase(Sign);
                base.setIterator(this.UpperIterator);
                base.fillContent();
            } else {
                if (PropsInfo.supHide && PropsInfo.subHide) {
                    base = Sign;
                } else {
                    prp = {
                        type: DEGREE_SubSup,
                        ctrPrp: ctrPrp
                    };
                    base = new CDegreeSubSupBase(prp, true);
                    base.setBase(Sign);
                    base.setLowerIterator(this.LowerIterator);
                    base.setUpperIterator(this.UpperIterator);
                    base.fillContent();
                }
            }
        }
    }
    this.Base = base;
    this.addMCToContent([base, this.Arg]);
};
CNary.prototype.ApplyProperties = function (RPI) {
    if (this.RecalcInfo.bProps || RPI.bChangeInline == true) {
        var oSign = this.getSign(this.Pr.chr, this.Pr.chrType);
        this.Sign = oSign.operator;
        var limLoc = this.Pr.limLoc;
        if (RPI.bInline == true || RPI.bDecreasedComp == true) {
            limLoc = NARY_SubSup;
            this.Sign = new CMathText(true);
            this.Sign.add(oSign.chrCode);
        }
        if (limLoc == null || typeof(limLoc) == "undefined") {
            var bIntegral = oSign.chrCode > 8746 && oSign.chrCode < 8753;
            if (bIntegral) {
                limLoc = g_oMathSettings.intLim;
            } else {
                limLoc = g_oMathSettings.naryLim;
            }
        }
        var PropsInfo = {
            limLoc: limLoc,
            sign: this.Sign,
            supHide: this.Pr.supHide,
            subHide: this.Pr.subHide
        };
        this.Pr.chrType = oSign.chrType;
        this.fillBase(PropsInfo);
        this.RecalcInfo.bProps = false;
    }
};
CNary.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    var NewRPI = RPI.Copy();
    if (RPI.bInline || RPI.bDecreasedComp) {
        NewRPI.bNaryInline = true;
    }
    CNary.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, NewRPI, GapsInfo);
};
CNary.prototype.getSign = function (chrCode, chrType) {
    var result = {
        chrCode: null,
        chrType: null,
        operator: null
    };
    var bChr = chrCode !== null && chrCode == chrCode + 0;
    if (chrCode == 8747 || chrType == NARY_INTEGRAL) {
        result.chrCode = 8747;
        result.chrType = NARY_INTEGRAL;
        result.operator = new CIntegral();
    } else {
        if (chrCode == 8748 || chrType == NARY_DOUBLE_INTEGRAL) {
            result.chrCode = 8748;
            result.chrType = NARY_DOUBLE_INTEGRAL;
            result.operator = new CDoubleIntegral();
        } else {
            if (chrCode == 8749 || chrType == NARY_TRIPLE_INTEGRAL) {
                result.chrCode = 8749;
                result.chrType = NARY_TRIPLE_INTEGRAL;
                result.operator = new CTripleIntegral();
            } else {
                if (chrCode == 8750 || chrType == NARY_CONTOUR_INTEGRAL) {
                    result.chrCode = 8750;
                    result.chrType = NARY_CONTOUR_INTEGRAL;
                    result.operator = new CContourIntegral();
                } else {
                    if (chrCode == 8751 || chrType == NARY_SURFACE_INTEGRAL) {
                        result.chrCode = 8751;
                        result.chrType = NARY_SURFACE_INTEGRAL;
                        result.operator = new CSurfaceIntegral();
                    } else {
                        if (chrCode == 8752 || chrType == NARY_VOLUME_INTEGRAL) {
                            result.chrCode = 8752;
                            result.chrType = NARY_VOLUME_INTEGRAL;
                            result.operator = new CVolumeIntegral();
                        } else {
                            if (chrCode == 8721 || chrType == NARY_SIGMA) {
                                result.chrCode = 8721;
                                result.chrType = NARY_SIGMA;
                                result.operator = new CSigma();
                            } else {
                                if (chrCode == 8719 || chrType == NARY_PRODUCT) {
                                    result.chrCode = 8719;
                                    result.chrType = NARY_PRODUCT;
                                    result.operator = new CProduct();
                                } else {
                                    if (chrCode == 8720 || chrType == NARY_COPRODUCT) {
                                        result.chrCode = 8720;
                                        result.chrType = NARY_COPRODUCT;
                                        result.operator = new CProduct(-1);
                                    } else {
                                        if (chrCode == 8899 || chrType == NARY_UNION) {
                                            result.chrCode = 8899;
                                            result.chrType = NARY_UNION;
                                            result.operator = new CUnion();
                                        } else {
                                            if (chrCode == 8898 || chrType == NARY_INTERSECTION) {
                                                result.chrCode = 8898;
                                                result.chrType = NARY_INTERSECTION;
                                                result.operator = new CUnion(-1);
                                            } else {
                                                if (chrCode == 8897 || chrType == NARY_LOGICAL_OR) {
                                                    result.chrCode = 8897;
                                                    result.chrType = NARY_LOGICAL_OR;
                                                    result.operator = new CLogicalOr();
                                                } else {
                                                    if (chrCode == 8896 || chrType == NARY_LOGICAL_AND) {
                                                        result.chrCode = 8896;
                                                        result.chrType = NARY_LOGICAL_AND;
                                                        result.operator = new CLogicalOr(-1);
                                                    } else {
                                                        if (bChr) {
                                                            result.chrCode = chrCode;
                                                            result.chrType = NARY_TEXT_OPER;
                                                            result.operator = new CMathText(true);
                                                            result.operator.add(chrCode);
                                                        } else {
                                                            result.chrCode = 8747;
                                                            result.chrType = NARY_INTEGRAL;
                                                            result.operator = new CIntegral();
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
    return result;
};
CNary.prototype.setCtrPrp = function (txtPrp) {
    this.CtrPrp.Merge(txtPrp);
    if (this.elements.length > 0 && !this.elements[0][0].IsJustDraw()) {
        this.elements[0][0].setCtrPrp(this.CtrPrp);
    }
};
CNary.prototype.setDistance = function () {
    this.dW = this.Get_TxtPrControlLetter().FontSize / 36 * 2.45;
};
CNary.prototype.getBase = function () {
    return this.Arg;
};
CNary.prototype.getUpperIterator = function () {
    if (!this.Pr.supHide) {
        return this.UpperIterator;
    }
};
CNary.prototype.getLowerIterator = function () {
    if (!this.Pr.subHide) {
        return this.LowerIterator;
    }
};
CNary.prototype.getBaseMathContent = function () {
    return this.Arg;
};
CNary.prototype.getSupMathContent = function () {
    return this.UpperIterator;
};
CNary.prototype.getSubMathContent = function () {
    return this.LowerIterator;
};
CNary.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.LargeOperator;
    MathProps.Pr = null;
};
CNary.prototype.Is_ContentUse = function (MathContent) {
    if (MathContent === this.getBaseMathContent()) {
        return true;
    }
    if (true !== this.Pr.subHide && MathContent === this.getSubMathContent()) {
        return true;
    }
    if (true !== this.Pr.supHide && MathContent === this.getSupMathContent()) {
        return true;
    }
    return false;
};
function CNaryUnd(bInside) {
    CMathBase.call(this, bInside);
    this.setDimension(2, 1);
}
Asc.extendClass(CNaryUnd, CMathBase);
CNaryUnd.prototype.setDistance = function () {
    var zetta = this.Get_TxtPrControlLetter().FontSize * 25.4 / 96;
    this.dH = zetta * 0.25;
};
CNaryUnd.prototype.getAscent = function () {
    return this.elements[0][0].size.height + this.dH + this.elements[1][0].size.ascent;
};
CNaryUnd.prototype.getUpperIterator = function () {
    return this.elements[0][0];
};
CNaryUnd.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    var ArgSzUnd = ArgSize.Copy();
    ArgSzUnd.decrease();
    var RPIUnd = RPI.Copy();
    RPIUnd.bDecreasedComp = true;
    this.elements[0][0].PreRecalc(this, ParaMath, ArgSzUnd, RPIUnd);
    this.elements[1][0].PreRecalc(this, ParaMath, ArgSize, RPI);
};
CNaryUnd.prototype.setBase = function (base) {
    this.elements[1][0] = base;
};
CNaryUnd.prototype.setUpperIterator = function (iterator) {
    this.elements[0][0] = iterator;
};
function CNaryOvr(bInside) {
    CMathBase.call(this, bInside);
    this.setDimension(2, 1);
}
Asc.extendClass(CNaryOvr, CMathBase);
CNaryOvr.prototype.old_setDistance = function () {
    var zetta = this.Get_TxtPrControlLetter().FontSize * 25.4 / 96;
    this.dH = zetta * 0.1;
};
CNaryOvr.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    var ArgSzOvr = ArgSize.Copy();
    ArgSzOvr.decrease();
    var RPIOvr = RPI.Copy();
    RPIOvr.bDecreasedComp = true;
    this.elements[0][0].PreRecalc(this, ParaMath, ArgSize, RPI);
    this.elements[1][0].PreRecalc(this, ParaMath, ArgSzOvr, RPIOvr);
};
CNaryOvr.prototype.recalculateSize = function () {
    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var zetta = FontSize * 25.4 / 96;
    var minGapBottom = zetta * 0.1,
    DownBaseline = FontSize * 0.23;
    var nOper = this.elements[0][0].size,
    iter = this.elements[1][0].size;
    this.dH = DownBaseline > iter.ascent + minGapBottom ? DownBaseline - iter.ascent : minGapBottom;
    var ascent = nOper.ascent;
    var width = nOper.width > iter.width ? nOper.width : iter.width;
    width += this.GapLeft + this.GapRight;
    var height = nOper.height + this.dH + iter.height;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CNaryOvr.prototype.old_getAscent = function () {
    return this.elements[0][0].size.ascent;
};
CNaryOvr.prototype.getLowerIterator = function () {
    return this.elements[1][0];
};
CNaryOvr.prototype.setBase = function (base) {
    this.elements[0][0] = base;
};
CNaryOvr.prototype.setLowerIterator = function (iterator) {
    this.elements[1][0] = iterator;
};
function CNaryUndOvr(bInside) {
    this.gapTop = 0;
    this.gapBottom = 0;
    CMathBase.call(this, bInside);
    this.setDimension(3, 1);
}
Asc.extendClass(CNaryUndOvr, CMathBase);
CNaryUndOvr.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    var ArgSzIter = ArgSize.Copy();
    ArgSzIter.decrease();
    var RPI_Iter = RPI.Copy();
    RPI_Iter.bDecreasedComp = true;
    this.elements[0][0].PreRecalc(this, ParaMath, ArgSzIter, RPI_Iter);
    this.elements[1][0].PreRecalc(this, ParaMath, ArgSize, RPI);
    this.elements[2][0].PreRecalc(this, ParaMath, ArgSzIter, RPI_Iter);
};
CNaryUndOvr.prototype.recalculateSize = function () {
    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var zetta = FontSize * 25.4 / 96;
    this.gapTop = zetta * 0.25;
    var minGapBottom = zetta * 0.1,
    DownBaseline = FontSize * 0.23;
    var ascLIter = this.elements[2][0].size.ascent;
    this.gapBottom = DownBaseline > ascLIter + minGapBottom ? DownBaseline - ascLIter : minGapBottom;
    var ascent = this.elements[0][0].size.height + this.gapTop + this.elements[1][0].size.ascent;
    var width = 0,
    height = 0;
    for (var i = 0; i < 3; i++) {
        width = width > this.elements[i][0].size.width ? width : this.elements[i][0].size.width;
        height += this.elements[i][0].size.height;
    }
    width += this.GapLeft + this.GapRight;
    height += this.gapTop + this.gapBottom;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CNaryUndOvr.prototype.setPosition = function (pos, PosInfo) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    var PosUpIter = new CMathPosition();
    PosUpIter.x = pos.x + this.GapLeft + this.align(0, 0).x;
    PosUpIter.y = pos.y;
    var PosSign = new CMathPosition();
    PosSign.x = pos.x + this.GapLeft + this.align(1, 0).x;
    PosSign.y = pos.y + this.elements[0][0].size.height + this.gapTop;
    var PosLowIter = new CMathPosition();
    PosLowIter.x = pos.x + this.GapLeft + this.align(2, 0).x;
    PosLowIter.y = PosSign.y + this.elements[1][0].size.height + this.gapBottom;
    this.elements[0][0].setPosition(PosUpIter, PosInfo);
    this.elements[1][0].setPosition(PosSign, PosInfo);
    this.elements[2][0].setPosition(PosLowIter, PosInfo);
};
CNaryUndOvr.prototype.setBase = function (base) {
    this.elements[1][0] = base;
};
CNaryUndOvr.prototype.setUpperIterator = function (iterator) {
    this.elements[0][0] = iterator;
};
CNaryUndOvr.prototype.setLowerIterator = function (iterator) {
    this.elements[2][0] = iterator;
};
CNaryUndOvr.prototype.getLowerIterator = function () {
    return this.elements[2][0];
};
CNaryUndOvr.prototype.getUpperIterator = function () {
    return this.elements[0][0];
};
function CNaryOperator(flip) {
    this.pos = new CMathPosition();
    this.ParaMath = null;
    this.bFlip = (flip == -1);
    this.sizeGlyph = null;
}
CNaryOperator.prototype.draw = function (x, y, pGraphics, PDSE) {
    this.Parent.Make_ShdColor(PDSE, this.Parent.Get_CompiledCtrPrp());
    if (this.Type == para_Math_Text) {
        this.drawTextElem(x, y, pGraphics);
    } else {
        this.drawGlyph(x, y, pGraphics);
    }
};
CNaryOperator.prototype.drawGlyph = function (x, y, pGraphics) {
    var coord = this.getCoord();
    var X = coord.X,
    Y = coord.Y;
    var XX = [],
    YY = [];
    var textScale = this.Get_TxtPrControlLetter().FontSize / 850;
    var alpha = textScale * 25.4 / 96 / 64;
    var a, b;
    if (this.bFlip) {
        a = -1;
        b = this.sizeGlyph.height;
    } else {
        a = 1;
        b = 0;
    }
    for (var i = 0; i < X.length; i++) {
        XX[i] = this.pos.x + x + X[i] * alpha;
        YY[i] = this.pos.y + y + (a * Y[i] * alpha + b);
    }
    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);
    pGraphics.p_width(1000);
    pGraphics._s();
    this.drawPath(pGraphics, XX, YY);
    pGraphics.df();
    pGraphics.SetIntegerGrid(intGrid);
};
CNaryOperator.prototype.drawTextElem = function (x, y, pGraphics) {
    var ctrPrp = this.Get_TxtPrControlLetter();
    var Font = {
        FontSize: ctrPrp.FontSize,
        FontFamily: {
            Name: ctrPrp.FontFamily.Name,
            Index: ctrPrp.FontFamily.Index
        },
        Italic: false,
        Bold: false
    };
    pGraphics.SetFont(Font);
    CNaryOperator.superclass.call.draw(this, x, y, pGraphics);
};
CNaryOperator.prototype.IsJustDraw = function () {
    return true;
};
CNaryOperator.prototype.setPosition = function (pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
};
CNaryOperator.prototype.recalculateSize = function () {
    this.sizeGlyph = this.calculateSizeGlyph();
    var height = this.sizeGlyph.height,
    width = this.sizeGlyph.width,
    ascent = this.sizeGlyph.height / 2 + DIV_CENT * this.Get_TxtPrControlLetter().FontSize;
    this.size = {
        height: height,
        width: width,
        ascent: ascent
    };
};
CNaryOperator.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
};
CNaryOperator.prototype.Resize = function (oMeasure, RPI) {
    this.recalculateSize();
};
CNaryOperator.prototype.Get_TxtPrControlLetter = function () {
    return this.Parent.Get_TxtPrControlLetter();
};
function CSigma() {
    CNaryOperator.call(this);
}
Asc.extendClass(CSigma, CNaryOperator);
CSigma.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]);
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]);
    pGraphics._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]);
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    pGraphics._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    pGraphics._l(XX[15], YY[15]);
    pGraphics._l(XX[16], YY[16]);
    pGraphics._l(XX[17], YY[17]);
    pGraphics._l(XX[18], YY[18]);
    pGraphics._l(XX[19], YY[19]);
    pGraphics._l(XX[20], YY[20]);
    pGraphics._l(XX[21], YY[21]);
    pGraphics._l(XX[22], YY[22]);
    pGraphics._l(XX[23], YY[23]);
    pGraphics._l(XX[24], YY[24]);
    pGraphics._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26]);
    pGraphics._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28]);
    pGraphics._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30]);
    pGraphics._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32]);
    pGraphics._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
    pGraphics._l(XX[35], YY[35]);
};
CSigma.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 16252;
    Y[0] = 5200;
    X[1] = 40602;
    Y[1] = 42154;
    X[2] = 40602;
    Y[2] = 45954;
    X[3] = 13302;
    Y[3] = 83456;
    X[4] = 46202;
    Y[4] = 83456;
    X[5] = 49302;
    Y[5] = 83456;
    X[6] = 50877;
    Y[6] = 83056;
    X[7] = 52452;
    Y[7] = 82656;
    X[8] = 53577;
    Y[8] = 81831;
    X[9] = 54702;
    Y[9] = 81006;
    X[10] = 55627;
    Y[10] = 79531;
    X[11] = 56552;
    Y[11] = 78056;
    X[12] = 57402;
    Y[12] = 75456;
    X[13] = 58252;
    Y[13] = 72856;
    X[14] = 59002;
    Y[14] = 68656;
    X[15] = 64850;
    Y[15] = 68656;
    X[16] = 63400;
    Y[16] = 93056;
    X[17] = 0;
    Y[17] = 93056;
    X[18] = 0;
    Y[18] = 90256;
    X[19] = 30902;
    Y[19] = 47804;
    X[20] = 1902;
    Y[20] = 2850;
    X[21] = 1902;
    Y[21] = 0;
    X[22] = 63652;
    Y[22] = 0;
    X[23] = 63652;
    Y[23] = 22252;
    X[24] = 58252;
    Y[24] = 22252;
    X[25] = 57002;
    Y[25] = 17501;
    X[26] = 55877;
    Y[26] = 14501;
    X[27] = 54752;
    Y[27] = 11501;
    X[28] = 53577;
    Y[28] = 9751;
    X[29] = 52402;
    Y[29] = 8000;
    X[30] = 51177;
    Y[30] = 7075;
    X[31] = 49952;
    Y[31] = 6150;
    X[32] = 48352;
    Y[32] = 5675;
    X[33] = 46752;
    Y[33] = 5200;
    X[34] = 44102;
    Y[34] = 5200;
    X[35] = 16252;
    Y[35] = 5200;
    var textScale = this.Get_TxtPrControlLetter().FontSize / 850;
    var alpha = textScale * 25.4 / 96 / 64;
    var h1 = Y[0] - Y[21],
    h2 = Y[17] - Y[3],
    h3 = Y[2] - Y[1],
    h4 = Y[20] - Y[21],
    h5 = Y[17] - Y[18];
    var H1 = this.sizeGlyph.height / alpha - h1 - h2 - h3;
    var h_middle1 = Y[3] - Y[0] - h3,
    coeff1 = (Y[1] - Y[0]) / h_middle1,
    coeff2 = (Y[3] - Y[2]) / h_middle1;
    var y3 = Y[3],
    y2 = Y[2];
    Y[1] = Y[0] + H1 * coeff1;
    Y[2] = Y[1] + h3;
    Y[3] = Y[2] + H1 * coeff2;
    Y[19] = Y[2] + Y[19] - y2;
    Y[18] = Y[3] + Y[18] - y3;
    for (var i = 4; i < 18; i++) {
        Y[i] = Y[3] + (Y[i] - y3);
    }
    var W = (this.sizeGlyph.width - this.gap) / alpha;
    var c1 = (X[21] - X[17]) / X[15],
    c2 = (X[22] - X[21]) / X[15];
    var x22 = X[22];
    X[21] = X[20] = X[17] + c1 * W;
    X[22] = X[23] = X[21] + c2 * W;
    for (var i = 24; i < 35; i++) {
        X[i] = X[22] + X[i] - x22;
    }
    var c3 = (X[4] - X[3]) / X[15],
    c4 = (X[15] - X[16]) / X[15],
    c5 = (X[15] - X[2]) / X[15];
    var x15 = X[15],
    x2 = X[2];
    X[4] = X[3] + c3 * W;
    X[15] = W;
    X[16] = X[15] - c4 * W;
    X[2] = X[1] = X[15] - c5 * W;
    X[19] = X[2] - (x2 - X[19]);
    for (var i = 5; i < 15; i++) {
        X[i] = X[15] - (x15 - X[i]);
    }
    return {
        X: X,
        Y: Y
    };
};
CSigma.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 8.997900390624999 * betta,
    _height = 11.99444444444444 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = 1.76 * _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CProduct(bFlip) {
    CNaryOperator.call(this, bFlip);
}
Asc.extendClass(CProduct, CNaryOperator);
CProduct.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3]);
    pGraphics._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5]);
    pGraphics._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7]);
    pGraphics._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    pGraphics._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    pGraphics._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);
    pGraphics._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18]);
    pGraphics._l(XX[19], YY[19]);
    pGraphics._l(XX[20], YY[20]);
    pGraphics._l(XX[21], YY[21]);
    pGraphics._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23]);
    pGraphics._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25]);
    pGraphics._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27]);
    pGraphics._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29]);
    pGraphics._l(XX[30], YY[30]);
    pGraphics._l(XX[31], YY[31]);
    pGraphics._l(XX[32], YY[32]);
    pGraphics._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
    pGraphics._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36]);
    pGraphics._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38]);
    pGraphics._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40]);
    pGraphics._l(XX[41], YY[41]);
    pGraphics._l(XX[42], YY[42]);
    pGraphics._l(XX[43], YY[43]);
    pGraphics._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45]);
    pGraphics._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47]);
    pGraphics._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49]);
    pGraphics._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51]);
    pGraphics._l(XX[52], YY[52]);
    pGraphics._c(XX[52], YY[52], XX[53], YY[53], XX[54], YY[54]);
    pGraphics._c(XX[54], YY[54], XX[55], YY[55], XX[56], YY[56]);
    pGraphics._c(XX[56], YY[56], XX[57], YY[57], XX[58], YY[58]);
    pGraphics._c(XX[58], YY[58], XX[59], YY[59], XX[60], YY[60]);
    pGraphics._l(XX[61], YY[61]);
    pGraphics._l(XX[62], YY[62]);
};
CProduct.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 67894;
    Y[0] = 0;
    X[1] = 67894;
    Y[1] = 2245;
    X[2] = 65100;
    Y[2] = 3024;
    X[3] = 63955;
    Y[3] = 3666;
    X[4] = 62810;
    Y[4] = 4307;
    X[5] = 62100;
    Y[5] = 5338;
    X[6] = 61390;
    Y[6] = 6368;
    X[7] = 61092;
    Y[7] = 8338;
    X[8] = 60794;
    Y[8] = 10308;
    X[9] = 60794;
    Y[9] = 14706;
    X[10] = 60794;
    Y[10] = 70551;
    X[11] = 60794;
    Y[11] = 74674;
    X[12] = 61069;
    Y[12] = 76666;
    X[13] = 61345;
    Y[13] = 78659;
    X[14] = 61987;
    Y[14] = 79736;
    X[15] = 62629;
    Y[15] = 80813;
    X[16] = 63798;
    Y[16] = 81523;
    X[17] = 64968;
    Y[17] = 82233;
    X[18] = 67904;
    Y[18] = 83012;
    X[19] = 67904;
    Y[19] = 85257;
    X[20] = 43623;
    Y[20] = 85257;
    X[21] = 43623;
    Y[21] = 83012;
    X[22] = 46368;
    Y[22] = 82279;
    X[23] = 47512;
    Y[23] = 81614;
    X[24] = 48657;
    Y[24] = 80950;
    X[25] = 49343;
    Y[25] = 79896;
    X[26] = 50029;
    Y[26] = 78843;
    X[27] = 50326;
    Y[27] = 76850;
    X[28] = 50624;
    Y[28] = 74857;
    X[29] = 50624;
    Y[29] = 70551;
    X[30] = 50624;
    Y[30] = 4856;
    X[31] = 17165;
    Y[31] = 4856;
    X[32] = 17165;
    Y[32] = 70551;
    X[33] = 17165;
    Y[33] = 74994;
    X[34] = 17463;
    Y[34] = 76918;
    X[35] = 17761;
    Y[35] = 78843;
    X[36] = 18450;
    Y[36] = 79873;
    X[37] = 19139;
    Y[37] = 80904;
    X[38] = 20332;
    Y[38] = 81591;
    X[39] = 21526;
    Y[39] = 82279;
    X[40] = 24326;
    Y[40] = 83012;
    X[41] = 24326;
    Y[41] = 85257;
    X[42] = 0;
    Y[42] = 85257;
    X[43] = 0;
    Y[43] = 83012;
    X[44] = 2743;
    Y[44] = 82279;
    X[45] = 3931;
    Y[45] = 81614;
    X[46] = 5120;
    Y[46] = 80950;
    X[47] = 5783;
    Y[47] = 79873;
    X[48] = 6446;
    Y[48] = 78797;
    X[49] = 6743;
    Y[49] = 76827;
    X[50] = 7040;
    Y[50] = 74857;
    X[51] = 7040;
    Y[51] = 70551;
    X[52] = 7040;
    Y[52] = 14706;
    X[53] = 7040;
    Y[53] = 10400;
    X[54] = 6743;
    Y[54] = 8430;
    X[55] = 6446;
    Y[55] = 6460;
    X[56] = 5806;
    Y[56] = 5429;
    X[57] = 5166;
    Y[57] = 4398;
    X[58] = 4000;
    Y[58] = 3711;
    X[59] = 2834;
    Y[59] = 3024;
    X[60] = 0;
    Y[60] = 2245;
    X[61] = 0;
    Y[61] = 0;
    X[62] = 67894;
    Y[62] = 0;
    var textScale = this.Get_TxtPrControlLetter().FontSize / 850,
    alpha = textScale * 25.4 / 96 / 64;
    var h1 = Y[9],
    h2 = Y[19] - Y[10],
    w1 = X[31];
    var Height = this.sizeGlyph.height / alpha - h1 - h2,
    Width = (this.sizeGlyph.width - this.gap) / alpha - 2 * w1;
    var hh = Height - (Y[10] - Y[9]),
    ww = Width - (X[30] - X[31]);
    for (var i = 0; i < 20; i++) {
        Y[10 + i] += hh;
        Y[32 + i] += hh;
    }
    for (var i = 0; i < 31; i++) {
        X[i] += ww;
    }
    X[62] += ww;
    return {
        X: X,
        Y: Y
    };
};
CProduct.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 10.312548828125 * betta,
    _height = 11.99444444444444 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = 1.76 * _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CUnion(bFlip) {
    CNaryOperator.call(this, bFlip);
}
Asc.extendClass(CUnion, CNaryOperator);
CUnion.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    pGraphics._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11]);
    pGraphics._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13]);
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15]);
    pGraphics._l(XX[16], YY[16]);
    pGraphics._l(XX[17], YY[17]);
    pGraphics._l(XX[18], YY[18]);
    pGraphics._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20]);
    pGraphics._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]);
};
CUnion.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 49526.18456692914;
    Y[0] = 127087.84;
    X[1] = 33974.37429971653;
    Y[1] = 127877.2;
    X[2] = 25226.48102440945;
    Y[2] = 120034.2;
    X[3] = 15996.01617170866;
    Y[3] = 113190.09;
    X[4] = 15301.25;
    Y[4] = 95025.84;
    X[5] = 15301.25;
    Y[5] = 0;
    X[6] = 7100;
    Y[6] = 0;
    X[7] = 7100;
    Y[7] = 94775.84;
    X[8] = 7100;
    Y[8] = 117815.09;
    X[9] = 21524.90275275591;
    Y[9] = 127165.84;
    X[10] = 31605.36420585827;
    Y[10] = 135801.88;
    X[11] = 49526.18456692914;
    Y[11] = 135775.84;
    X[12] = 67447.00492800001;
    Y[12] = 135801.88;
    X[13] = 77527.46638110236;
    Y[13] = 127165.84;
    X[14] = 91952.36913385827;
    Y[14] = 117815.09;
    X[15] = 91952.36913385827;
    Y[15] = 94775.84;
    X[16] = 91952.36913385827;
    Y[16] = 0;
    X[17] = 83751.11913385827;
    Y[17] = 0;
    X[18] = 83751.11913385827;
    Y[18] = 95025.84;
    X[19] = 83056.35296214961;
    Y[19] = 113190.09;
    X[20] = 73825.88810944883;
    Y[20] = 120034.2;
    X[21] = 65077.99483414174;
    Y[21] = 127877.2;
    X[22] = 49526.18456692914;
    Y[22] = 127087.84;
    return {
        X: X,
        Y: Y
    };
};
CUnion.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    this.gap = 0.9300000000000001 * betta;
    var _width = 9.380000000000001 * betta,
    _height = 11.99444444444444 * betta;
    var width = 1.76 * _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CLogicalOr(bFlip) {
    CNaryOperator.call(this, bFlip);
}
Asc.extendClass(CLogicalOr, CNaryOperator);
CLogicalOr.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
};
CLogicalOr.prototype.old_getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 73240;
    Y[0] = 0;
    X[1] = 38428;
    Y[1] = 89801;
    X[2] = 29448;
    Y[2] = 89801;
    X[3] = 0;
    Y[3] = 0;
    X[4] = 10613;
    Y[4] = 0;
    X[5] = 34521;
    Y[5] = 77322;
    X[6] = 63269;
    Y[6] = 0;
    X[7] = 73240;
    Y[7] = 0;
    var textScale = this.params.font.FontSize / 850,
    alpha = textScale * 25.4 / 96 / 64;
    var w1 = X[2],
    w2 = X[1] - X[2],
    w3 = X[0] - X[1],
    w4 = X[2] - X[5],
    w5 = X[7] - X[6];
    var Height = this.sizeGlyph.height / alpha,
    Width = (this.sizeGlyph.width - this.gap) / alpha - w2;
    var _W = X[7] - w2,
    k1 = w1 / _W;
    X[2] = k1 * Width;
    X[1] = X[2] + w2;
    X[5] = X[2] + w4;
    X[7] = X[0] = Width + w2;
    X[6] = Width + w2 - w5;
    var hh = Height - Y[2];
    Y[1] += hh;
    Y[2] += hh;
    Y[5] += hh;
    return {
        X: X,
        Y: Y
    };
};
CLogicalOr.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 0;
    Y[0] = 0;
    X[1] = 34812;
    Y[1] = 89801;
    X[2] = 43792;
    Y[2] = 89801;
    X[3] = 73240;
    Y[3] = 0;
    X[4] = 63269;
    Y[4] = 0;
    X[5] = 38719;
    Y[5] = 77322;
    X[6] = 10613;
    Y[6] = 0;
    X[7] = 0;
    Y[7] = 0;
    var textScale = this.Get_TxtPrControlLetter().FontSize / 850,
    alpha = textScale * 25.4 / 96 / 64;
    var w1 = X[1],
    w2 = X[2] - X[1],
    w4 = X[5] - X[1],
    w5 = X[3] - X[4];
    var Height = this.sizeGlyph.height / alpha,
    Width = (this.sizeGlyph.width - this.gap) / alpha - w2;
    var _W = X[3] - w2,
    k1 = w1 / _W;
    X[1] = k1 * Width;
    X[2] = X[1] + w2;
    X[5] = X[1] + w4;
    X[3] = Width + w2;
    X[4] = Width + w2 - w5;
    var hh = Height - Y[2];
    Y[1] += hh;
    Y[2] += hh;
    Y[5] += hh;
    return {
        X: X,
        Y: Y
    };
};
CLogicalOr.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 9.6159 * betta,
    _height = 11.99444444444444 * betta;
    this.gap = 0.55 * betta;
    var width = 1.76 * _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CIntegral() {
    CNaryOperator.call(this);
}
Asc.extendClass(CIntegral, CNaryOperator);
CIntegral.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 20407;
    Y[0] = 65723;
    X[1] = 20407;
    Y[1] = 60840;
    X[2] = 20407;
    Y[2] = 37013;
    X[3] = 24333;
    Y[3] = 18507;
    X[4] = 28260;
    Y[4] = 0;
    X[5] = 40590;
    Y[5] = 0;
    X[6] = 42142;
    Y[6] = 0;
    X[7] = 43604;
    Y[7] = 383;
    X[8] = 45067;
    Y[8] = 765;
    X[9] = 46215;
    Y[9] = 1305;
    X[10] = 45180;
    Y[10] = 9225;
    X[11] = 41760;
    Y[11] = 9225;
    X[12] = 41512;
    Y[12] = 7335;
    X[13] = 40724;
    Y[13] = 6064;
    X[14] = 39937;
    Y[14] = 4793;
    X[15] = 37935;
    Y[15] = 4793;
    X[16] = 30465;
    Y[16] = 4793;
    X[17] = 28406;
    Y[17] = 23086;
    X[18] = 26347;
    Y[18] = 41378;
    X[19] = 26347;
    Y[19] = 60840;
    X[20] = 26347;
    Y[20] = 65723;
    X[22] = 26347;
    Y[22] = 0;
    X[23] = 26347;
    Y[23] = 4883;
    X[24] = 26325;
    Y[24] = 33368;
    X[25] = 21622;
    Y[25] = 49681;
    X[26] = 16920;
    Y[26] = 65993;
    X[27] = 5467;
    Y[27] = 65993;
    X[28] = 4387;
    Y[28] = 65993;
    X[29] = 2947;
    Y[29] = 65633;
    X[30] = 1507;
    Y[30] = 65273;
    X[31] = 0;
    Y[31] = 64553;
    X[32] = 1147;
    Y[32] = 55665;
    X[33] = 4770;
    Y[33] = 55665;
    X[34] = 4927;
    Y[34] = 58050;
    X[35] = 5782;
    Y[35] = 59412;
    X[36] = 6637;
    Y[36] = 60773;
    X[37] = 8775;
    Y[37] = 60773;
    X[38] = 13365;
    Y[38] = 60773;
    X[39] = 16886;
    Y[39] = 50783;
    X[40] = 20407;
    Y[40] = 40793;
    X[41] = 20407;
    Y[41] = 4883;
    X[42] = 20407;
    Y[42] = 0;
    var shX = X[9] * 0.025;
    for (var i = 0; i < 21; i++) {
        X[i] += shX;
    }
    var shY = Y[26] * 0.3377;
    for (var i = 0; i < 21; i++) {
        Y[22 + i] += shY + Y[20];
    }
    X[21] = (X[20] + X[22]) / 2;
    Y[21] = (Y[20] + Y[22]) / 2;
    X[44] = X[0];
    Y[44] = Y[0];
    X[43] = (X[42] + X[44]) / 2;
    Y[43] = (Y[44] + Y[42]) / 2;
    var W = X[9],
    H = Y[27];
    return {
        X: X,
        Y: Y,
        W: W,
        H: H
    };
};
CIntegral.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3]);
    pGraphics._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5]);
    pGraphics._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7]);
    pGraphics._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
    pGraphics._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13]);
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15]);
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17]);
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]);
    pGraphics._l(XX[20], YY[20]);
    pGraphics._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]);
    pGraphics._l(XX[22], YY[22]);
    pGraphics._l(XX[23], YY[23]);
    pGraphics._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25]);
    pGraphics._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27]);
    pGraphics._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29]);
    pGraphics._c(XX[29], YY[29], XX[30], YY[30], XX[31], YY[31]);
    pGraphics._l(XX[32], YY[32]);
    pGraphics._l(XX[33], YY[33]);
    pGraphics._c(XX[33], YY[33], XX[34], YY[34], XX[35], YY[35]);
    pGraphics._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37]);
    pGraphics._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39]);
    pGraphics._c(XX[39], YY[39], XX[40], YY[40], XX[41], YY[41]);
    pGraphics._l(XX[42], YY[42]);
    pGraphics._c(XX[42], YY[42], XX[43], YY[43], XX[44], YY[44]);
};
CIntegral.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 8.624000000000001 * betta,
    _height = 13.7 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CDoubleIntegral() {
    CIntegral.call(this);
}
Asc.extendClass(CDoubleIntegral, CIntegral);
CDoubleIntegral.prototype.drawPath = function (pGraphics, XX, YY) {
    var XX2 = [],
    YY2 = [];
    var w = (XX[9] - XX[29]) * 0.6;
    for (var i = 0; i < XX.length; i++) {
        XX2[i] = XX[i] + w;
        YY2[i] = YY[i];
    }
    CDoubleIntegral.superclass.drawPath.call(this, pGraphics, XX, YY);
    pGraphics.df();
    pGraphics._s();
    CDoubleIntegral.superclass.drawPath.call(this, pGraphics, XX2, YY2);
};
CDoubleIntegral.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 14.2296 * betta,
    _height = 13.7 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CTripleIntegral() {
    CIntegral.call(this);
}
Asc.extendClass(CTripleIntegral, CIntegral);
CTripleIntegral.prototype.drawPath = function (pGraphics, XX, YY) {
    var XX2 = [],
    YY2 = [];
    var w = (XX[9] - XX[29]) * 0.6;
    var XX3 = [],
    YY3 = [];
    for (var i = 0; i < XX.length; i++) {
        XX2[i] = XX[i] + w;
        YY2[i] = YY[i];
        XX3[i] = XX[i] + 2 * w;
        YY3[i] = YY[i];
    }
    CTripleIntegral.superclass.drawPath.call(this, pGraphics, XX, YY);
    pGraphics.df();
    pGraphics._s();
    CTripleIntegral.superclass.drawPath.call(this, pGraphics, XX2, YY2);
    pGraphics.df();
    pGraphics._s();
    CTripleIntegral.superclass.drawPath.call(this, pGraphics, XX3, YY3);
};
CTripleIntegral.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 18.925368 * betta,
    _height = 13.7 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CCircle() {}
CCircle.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 18345.98;
    Y[0] = 0;
    X[1] = 25288.35;
    Y[1] = 1008.1;
    X[2] = 27622.45;
    Y[2] = 2601.85;
    X[3] = 29991.4;
    Y[3] = 4194.75;
    X[4] = 31723.7;
    Y[4] = 6460.85;
    X[5] = 33456.85;
    Y[5] = 8726.950000000001;
    X[6] = 34411.4;
    Y[6] = 11542.15;
    X[7] = 35366.8;
    Y[7] = 14357.35;
    X[8] = 35366.8;
    Y[8] = 17472.6;
    X[9] = 35366.8;
    Y[9] = 21155.65;
    X[10] = 34180.2;
    Y[10] = 24201.2;
    X[11] = 32994.45;
    Y[11] = 27245.9;
    X[12] = 30905.15;
    Y[12] = 29495;
    X[13] = 28816.7;
    Y[13] = 31743.25;
    X[14] = 25949.65;
    Y[14] = 33159.35;
    X[15] = 23294.25;
    Y[15] = 34469.2;
    X[16] = 17035.7;
    Y[16] = 34770.53;
    X[17] = 17035.7;
    Y[17] = 34770.53;
    X[18] = 10029.15;
    Y[18] = 33832.55;
    X[19] = 7655.1;
    Y[19] = 32203.1;
    X[20] = 5209.65;
    Y[20] = 30539.65;
    X[21] = 3525.8;
    Y[21] = 28309.25;
    X[22] = 1842.8;
    Y[22] = 26078;
    X[23] = 921.4;
    Y[23] = 23334.2;
    X[24] = 0;
    Y[24] = 20589.55;
    X[25] = 0;
    Y[25] = 17509.15;
    X[26] = 0;
    Y[26] = 14003.75;
    X[27] = 1133.05;
    Y[27] = 10959.05;
    X[28] = 2266.1;
    Y[28] = 7913.5;
    X[29] = 4318.85;
    Y[29] = 5576.85;
    X[30] = 6372.45;
    Y[30] = 3240.2;
    X[31] = 9275.200000000001;
    Y[31] = 1752.7;
    X[32] = 11930.6;
    Y[32] = 407.15;
    X[33] = 18345.98;
    Y[33] = 0;
    var W = X[7],
    H = Y[16];
    return {
        X: X,
        Y: Y,
        W: W,
        H: H
    };
};
CCircle.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._s();
    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]);
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]);
    pGraphics._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]);
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    pGraphics._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    pGraphics._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]);
    pGraphics._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21]);
    pGraphics._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23]);
    pGraphics._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25]);
    pGraphics._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27]);
    pGraphics._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29]);
    pGraphics._c(XX[29], YY[29], XX[30], YY[30], XX[31], YY[31]);
    pGraphics._c(XX[31], YY[31], XX[32], YY[32], XX[33], YY[33]);
    pGraphics.ds();
};
function CSurface() {}
CSurface.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 24855.55;
    Y[0] = 312.82;
    X[1] = 27995.71;
    Y[1] = 0;
    X[2] = 31359.09;
    Y[2] = 0;
    X[3] = 36162.79;
    Y[3] = 0;
    X[4] = 40559.9;
    Y[4] = 694.89;
    X[5] = 43954.72;
    Y[5] = 1285.5;
    X[6] = 47349.55;
    Y[6] = 1876.11;
    X[7] = 50600.44;
    Y[7] = 2814.59;
    X[8] = 54054.17;
    Y[8] = 4639.82;
    X[9] = 57507.91;
    Y[9] = 6464.21;
    X[10] = 59945.63;
    Y[10] = 10061.28;
    X[11] = 62383.35;
    Y[11] = 13658.35;
    X[12] = 62383.35;
    Y[12] = 18871.27;
    X[13] = 62383.35;
    Y[13] = 24154.26;
    X[14] = 59945.63;
    Y[14] = 27752.16;
    X[15] = 57507.91;
    Y[15] = 31349.23;
    X[16] = 53481.95;
    Y[16] = 33468.93;
    X[17] = 49936.09;
    Y[17] = 35345.88;
    X[18] = 45688.68;
    Y[18] = 36318.56;
    X[19] = 42330.61;
    Y[19] = 36884.98;
    X[20] = 38972.54;
    Y[20] = 37451.41;
    X[21] = 34242.37;
    Y[21] = 37799.27;
    X[22] = 31359.98;
    Y[22] = 37799.27;
    X[23] = 27369.45;
    Y[23] = 37799.27;
    X[24] = 22565.76;
    Y[24] = 37347.13;
    X[25] = 19337.9;
    Y[25] = 36774.04;
    X[26] = 16110.04;
    Y[26] = 36200.94;
    X[27] = 11723.56;
    Y[27] = 35018.88;
    X[28] = 9068.82;
    Y[28] = 33663.3;
    X[29] = 6377.76;
    Y[29] = 32273.53;
    X[30] = 4312.96;
    Y[30] = 30188.03;
    X[31] = 2249.05;
    Y[31] = 28101.69;
    X[32] = 1124.08;
    Y[32] = 25286.27;
    X[33] = 0;
    Y[33] = 22470.84;
    X[34] = 0;
    Y[34] = 18959.69;
    X[35] = 0;
    Y[35] = 13745.94;
    X[36] = 2490.87;
    Y[36] = 10130.52;
    X[37] = 4982.63;
    Y[37] = 6515.1;
    X[38] = 8967.84;
    Y[38] = 4394.56;
    X[39] = 12806.01;
    Y[39] = 2378.3;
    X[40] = 17529.98;
    Y[40] = 1370.59;
    X[41] = 21192.77;
    Y[41] = 841.7000000000001;
    X[42] = 24855.55;
    Y[42] = 312.82;
    var W = X[11],
    H = Y[21];
    return {
        X: X,
        Y: Y,
        W: W,
        H: H
    };
};
CSurface.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._s();
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]);
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]);
    pGraphics._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]);
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    pGraphics._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    pGraphics._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);
    pGraphics._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18]);
    pGraphics._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20]);
    pGraphics._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]);
    pGraphics._c(XX[22], YY[22], XX[23], YY[23], XX[24], YY[24]);
    pGraphics._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26]);
    pGraphics._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28]);
    pGraphics._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30]);
    pGraphics._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32]);
    pGraphics._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
    pGraphics._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36]);
    pGraphics._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38]);
    pGraphics._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40]);
    pGraphics._c(XX[40], YY[40], XX[41], YY[41], XX[42], YY[42]);
    pGraphics.ds();
};
function CVolume() {}
CVolume.prototype.getCoord = function () {
    var X = [],
    Y = [];
    X[0] = 24086.6;
    Y[0] = 1584.99;
    X[1] = 25878.03;
    Y[1] = 1268.19;
    X[2] = 30642.29;
    Y[2] = 669.24;
    X[3] = 35139.13;
    Y[3] = 104.94;
    X[4] = 43028.74;
    Y[4] = 0;
    X[5] = 46945.61;
    Y[5] = 59.9;
    X[6] = 50862.49;
    Y[6] = 119.79;
    X[7] = 57135.73;
    Y[7] = 330.66;
    X[8] = 61811.92;
    Y[8] = 923.67;
    X[9] = 65955.41;
    Y[9] = 1411.74;
    X[10] = 68883.14;
    Y[10] = 2040.39;
    X[11] = 72891.84;
    Y[11] = 3159.09;
    X[12] = 76900.55;
    Y[12] = 4277.79;
    X[13] = 82700.14999999999;
    Y[13] = 6485.49;
    X[14] = 86547.22;
    Y[14] = 10342.53;
    X[15] = 90394.28;
    Y[15] = 14199.57;
    X[16] = 90394.28;
    Y[16] = 19211.94;
    X[17] = 90394.28;
    Y[17] = 24750.99;
    X[18] = 86653.53999999999;
    Y[18] = 28554.57;
    X[19] = 82913.87;
    Y[19] = 32358.15;
    X[20] = 79268.72;
    Y[20] = 33795.63;
    X[21] = 76154.12;
    Y[21] = 35057.88;
    X[22] = 74484.05;
    Y[22] = 35583.57;
    X[23] = 70409.28999999999;
    Y[23] = 36523.08;
    X[24] = 66334.53999999999;
    Y[24] = 37462.59;
    X[25] = 64662.32;
    Y[25] = 37742.76;
    X[26] = 60137.56;
    Y[26] = 38336.76;
    X[27] = 55689.05;
    Y[27] = 38896.11;
    X[28] = 47782.26;
    Y[28] = 39001.05;
    X[29] = 44054.41;
    Y[29] = 38969.37;
    X[30] = 40326.55;
    Y[30] = 38937.69;
    X[31] = 36744.76;
    Y[31] = 38832.75;
    X[32] = 32133.01;
    Y[32] = 38481.3;
    X[33] = 27597.5;
    Y[33] = 38130.84;
    X[34] = 21918.19;
    Y[34] = 37007.19;
    X[35] = 17870.29;
    Y[35] = 35901.36;
    X[36] = 13822.38;
    Y[36] = 34795.53;
    X[37] = 13593.62;
    Y[37] = 34726.23;
    X[38] = 13365.93;
    Y[38] = 34620.3;
    X[39] = 9226.73;
    Y[39] = 33113.52;
    X[40] = 6246.38;
    Y[40] = 30888;
    X[41] = 3266.03;
    Y[41] = 28662.48;
    X[42] = 1632.48;
    Y[42] = 25789.5;
    X[43] = 0;
    Y[43] = 22915.53;
    X[44] = 0;
    Y[44] = 19201.05;
    X[45] = 0;
    Y[45] = 14329.26;
    X[46] = 3746.11;
    Y[46] = 10456.38;
    X[47] = 7493.3;
    Y[47] = 6583.5;
    X[48] = 13503.4;
    Y[48] = 4341.15;
    X[49] = 18795;
    Y[49] = 2963.07;
    X[50] = 24086.6;
    Y[50] = 1584.99;
    var W = X[15],
    H = Y[28];
    return {
        X: X,
        Y: Y,
        W: W,
        H: H
    };
};
CVolume.prototype.drawPath = function (pGraphics, XX, YY) {
    pGraphics._s();
    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]);
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]);
    pGraphics._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]);
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    pGraphics._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    pGraphics._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);
    pGraphics._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18]);
    pGraphics._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20]);
    pGraphics._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]);
    pGraphics._c(XX[22], YY[22], XX[23], YY[23], XX[24], YY[24]);
    pGraphics._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26]);
    pGraphics._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28]);
    pGraphics._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30]);
    pGraphics._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32]);
    pGraphics._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
    pGraphics._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36]);
    pGraphics._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38]);
    pGraphics._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40]);
    pGraphics._c(XX[40], YY[40], XX[41], YY[41], XX[42], YY[42]);
    pGraphics._c(XX[42], YY[42], XX[43], YY[43], XX[44], YY[44]);
    pGraphics._c(XX[44], YY[44], XX[45], YY[45], XX[46], YY[46]);
    pGraphics._c(XX[46], YY[46], XX[47], YY[47], XX[48], YY[48]);
    pGraphics._c(XX[48], YY[48], XX[49], YY[49], XX[50], YY[50]);
    pGraphics.ds();
};
function CContourIntegral() {
    CNaryOperator.call(this);
}
Asc.extendClass(CContourIntegral, CNaryOperator);
CContourIntegral.prototype.draw = function (x, y, pGraphics, PDSE) {
    var circle = new CCircle();
    var coord = circle.getCoord();
    var X = coord.X,
    Y = coord.Y,
    W = coord.W,
    H = coord.H;
    var integr = new CIntegral(),
    coord2 = integr.getCoord();
    var XX = coord2.X,
    YY = coord2.Y,
    WW = coord2.W,
    HH = coord2.H;
    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var textScale = FontSize / 850;
    var alpha = textScale * 25.4 / 96 / 64;
    var shX = (WW - W) * alpha / 2,
    shY = (HH - H) * alpha * 0.48;
    for (var i = 0; i < X.length; i++) {
        X[i] = this.pos.x + x + shX + X[i] * alpha;
        Y[i] = this.pos.y + y + shY + Y[i] * alpha;
    }
    for (var i = 0; i < XX.length; i++) {
        XX[i] = this.pos.x + x + XX[i] * alpha;
        YY[i] = this.pos.y + y + YY[i] * alpha;
    }
    var penCircle = 750 * FontSize / 32;
    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);
    pGraphics.p_width(penCircle);
    this.Parent.Make_ShdColor(PDSE, this.Parent.Get_CompiledCtrPrp());
    circle.drawPath(pGraphics, X, Y);
    pGraphics.p_width(1000);
    pGraphics._s();
    integr.drawPath(pGraphics, XX, YY);
    pGraphics.df();
    pGraphics.SetIntegerGrid(intGrid);
};
CContourIntegral.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 8.624000000000001 * betta,
    _height = 13.7 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CSurfaceIntegral() {
    CNaryOperator.call(this);
}
Asc.extendClass(CSurfaceIntegral, CNaryOperator);
CSurfaceIntegral.prototype.draw = function (x, y, pGraphics, PDSE) {
    var surf = new CSurface();
    var coord = surf.getCoord();
    var X = coord.X,
    Y = coord.Y,
    W = coord.W,
    H = coord.H;
    var integr = new CDoubleIntegral(),
    coord2 = integr.getCoord();
    var XX = coord2.X,
    YY = coord2.Y,
    WW = 1.6 * coord2.W,
    HH = coord2.H;
    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var textScale = FontSize / 850;
    var alpha = textScale * 25.4 / 96 / 64;
    var shX = (WW - W) * alpha / 2,
    shY = (HH - H) * alpha * 0.48;
    for (var i = 0; i < X.length; i++) {
        X[i] = this.pos.x + x + shX + X[i] * alpha;
        Y[i] = this.pos.y + y + shY + Y[i] * alpha;
    }
    for (var i = 0; i < XX.length; i++) {
        XX[i] = this.pos.x + x + XX[i] * alpha;
        YY[i] = this.pos.y + y + YY[i] * alpha;
    }
    var penSurface = 750 * FontSize / 32;
    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);
    pGraphics.p_width(penSurface);
    this.Parent.Make_ShdColor(PDSE, this.Parent.Get_CompiledCtrPrp());
    surf.drawPath(pGraphics, X, Y);
    pGraphics.p_width(1000);
    pGraphics._s();
    integr.drawPath(pGraphics, XX, YY);
    pGraphics.df();
    pGraphics.SetIntegerGrid(intGrid);
};
CSurfaceIntegral.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 14.2296 * betta,
    _height = 13.7 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};
function CVolumeIntegral() {
    CNaryOperator.call(this);
}
Asc.extendClass(CVolumeIntegral, CNaryOperator);
CVolumeIntegral.prototype.draw = function (x, y, pGraphics, PDSE) {
    var volume = new CVolume();
    var coord = volume.getCoord();
    var X = coord.X,
    Y = coord.Y,
    W = coord.W,
    H = coord.H;
    var integr = new CTripleIntegral(),
    coord2 = integr.getCoord();
    var XX = coord2.X,
    YY = coord2.Y,
    WW = 2.1 * coord2.W,
    HH = coord2.H;
    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var textScale = FontSize / 850;
    var alpha = textScale * 25.4 / 96 / 64;
    var shX = (WW - W) * alpha / 2,
    shY = (HH - H) * alpha * 0.47;
    for (var i = 0; i < X.length; i++) {
        X[i] = this.pos.x + x + shX + X[i] * alpha;
        Y[i] = this.pos.y + y + shY + Y[i] * alpha;
    }
    for (var i = 0; i < XX.length; i++) {
        XX[i] = this.pos.x + x + XX[i] * alpha;
        YY[i] = this.pos.y + y + YY[i] * alpha;
    }
    var penVolume = 750 * FontSize / 32;
    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);
    pGraphics.p_width(penVolume);
    this.Parent.Make_ShdColor(PDSE, this.Parent.Get_CompiledCtrPrp());
    volume.drawPath(pGraphics, X, Y);
    pGraphics.p_width(1000);
    pGraphics._s();
    integr.drawPath(pGraphics, XX, YY);
    pGraphics.df();
    pGraphics.SetIntegerGrid(intGrid);
};
CVolumeIntegral.prototype.calculateSizeGlyph = function () {
    var betta = this.Get_TxtPrControlLetter().FontSize / 36;
    var _width = 18.925368 * betta,
    _height = 13.7 * betta;
    this.gap = 0.9300000000000001 * betta;
    var width = _width + this.gap,
    height = 2 * _height;
    return {
        width: width,
        height: height
    };
};