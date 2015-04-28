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
function CRPI() {
    this.NeedResize = true;
    this.bDecreasedComp = false;
    this.bInline = false;
    this.bChangeInline = false;
    this.bNaryInline = false;
    this.bEqqArray = false;
    this.bMathFunc = false;
    this.bRecalcCtrPrp = false;
    this.PRS = null;
}
CRPI.prototype.Copy = function () {
    var RPI = new CRPI();
    RPI.NeedResize = this.NeedResize;
    RPI.bInline = this.bInline;
    RPI.bDecreasedComp = this.bDecreasedComp;
    RPI.bChangeInline = this.bChangeInline;
    RPI.bNaryInline = this.bNaryInline;
    RPI.bEqqArray = this.bEqqArray;
    RPI.bMathFunc = this.bMathFunc;
    RPI.bRecalcCtrPrp = this.bRecalcCtrPrp;
    RPI.PRS = this.PRS;
    return RPI;
};
CRPI.prototype.MergeMathInfo = function (MathInfo) {
    this.bInline = MathInfo.bInline;
    this.NeedResize = MathInfo.NeedResize;
    this.bRecalcCtrPrp = MathInfo.bRecalcCtrPrp;
    this.bChangeInline = MathInfo.bChangeInline;
};
function CMathPointInfo() {
    this.x = 0;
    this.y = 0;
    this.bEven = true;
    this.CurrPoint = 0;
    this.InfoPoints = {};
}
CMathPointInfo.prototype.SetInfoPoints = function (InfoPoints) {
    this.InfoPoints.GWidths = InfoPoints.GWidths;
    this.InfoPoints.GPoints = InfoPoints.GPoints;
    this.InfoPoints.ContentPoints = InfoPoints.ContentPoints.Widths;
    this.InfoPoints.GMaxDimWidths = InfoPoints.GMaxDimWidths;
};
CMathPointInfo.prototype.NextAlignRange = function () {
    if (this.bEven) {
        this.bEven = false;
    } else {
        this.CurrPoint++;
        this.bEven = true;
    }
};
CMathPointInfo.prototype.GetAlign = function () {
    var align = 0;
    if (this.bEven) {
        var alignEven, alignGeneral, alignOdd;
        var Len = this.InfoPoints.ContentPoints.length,
        Point = this.InfoPoints.ContentPoints[this.CurrPoint];
        var GWidth = this.InfoPoints.GWidths[this.CurrPoint],
        GPoint = this.InfoPoints.GPoints[this.CurrPoint];
        if (this.CurrPoint == Len - 1 && Point.odd == -1) {
            var GMaxDimWidth = this.InfoPoints.GMaxDimWidths[this.CurrPoint];
            alignGeneral = (GMaxDimWidth - Point.even) / 2;
            alignEven = 0;
        } else {
            alignGeneral = (GWidth - GPoint.even - GPoint.odd) / 2;
            alignEven = GPoint.even - Point.even;
        }
        if (this.CurrPoint > 0) {
            var PrevGenPoint = this.InfoPoints.GPoints[this.CurrPoint - 1],
            PrevGenWidth = this.InfoPoints.GWidths[this.CurrPoint - 1],
            PrevPoint = this.InfoPoints.ContentPoints[this.CurrPoint - 1];
            var alignPrevGen = (PrevGenWidth - PrevGenPoint.even - PrevGenPoint.odd) / 2;
            alignOdd = alignPrevGen + PrevGenPoint.odd - PrevPoint.odd;
        } else {
            alignOdd = 0;
        }
        align = alignGeneral + alignEven + alignOdd;
    }
    return align;
};
function CInfoPoints() {
    this.GWidths = null;
    this.GPoints = null;
    this.GMaxDimWidths = null;
    this.ContentPoints = new AmperWidths();
}
CInfoPoints.prototype.SetDefault = function () {
    this.GWidths = null;
    this.GPoints = null;
    this.GMaxDimWidths = null;
    this.ContentPoints.SetDefault();
};
function CMathPosition() {
    this.x = 0;
    this.y = 0;
}
function AmperWidths() {
    this.bEven = true;
    this.Widths = [];
}
AmperWidths.prototype.UpdatePoint = function (value) {
    var len = this.Widths.length;
    if (len == 0) {
        var NewPoint = new CMathPoint();
        NewPoint.even = value;
        this.Widths.push(NewPoint);
        this.bEven = true;
    } else {
        if (this.bEven) {
            this.Widths[len - 1].even += value;
        } else {
            this.Widths[len - 1].odd += value;
        }
    }
};
AmperWidths.prototype.AddNewAlignRange = function () {
    var len = this.Widths.length;
    if (!this.bEven || len == 0) {
        var NewPoint = new CMathPoint();
        NewPoint.even = 0;
        this.Widths.push(NewPoint);
    }
    if (this.bEven) {
        len = this.Widths.length;
        this.Widths[len - 1].odd = 0;
    }
    this.bEven = !this.bEven;
};
AmperWidths.prototype.SetDefault = function () {
    this.bEven = true;
    this.Widths.length = 0;
};
function CGaps(oSign, oEqual, oZeroOper, oLett) {
    this.sign = oSign;
    this.equal = oEqual;
    this.zeroOper = oZeroOper;
    this.letters = oLett;
}
function CCoeffGaps() {
    this.Sign = {
        left: new CGaps(0.52, 0.26, 0, 0.52),
        right: new CGaps(0.49, 0, 0, 0.49)
    };
    this.Mult = {
        left: new CGaps(0, 0, 0, 0.46),
        right: new CGaps(0, 0, 0, 0.49)
    };
    this.Equal = {
        left: new CGaps(0, 0, 0, 0.7),
        right: new CGaps(0, 0, 0, 0.5)
    };
    this.Default = {
        left: new CGaps(0, 0, 0, 0),
        right: new CGaps(0, 0, 0, 0)
    };
}
CCoeffGaps.prototype = {
    getCoeff: function (codeCurr, codeLR, direct) {
        var operator = null;
        if (this.checkEqualSign(codeCurr)) {
            operator = this.Equal;
        } else {
            if (this.checkOperSign(codeCurr)) {
                operator = this.Sign;
            } else {
                if (codeCurr == 42) {
                    operator = this.Mult;
                } else {
                    operator = this.Default;
                }
            }
        }
        var part = direct == -1 ? operator.left : operator.right;
        var coeff = 0;
        if (codeLR == -1) {
            coeff = part.letters;
        } else {
            if (this.checkOperSign(codeLR)) {
                coeff = part.sign;
            } else {
                if (this.checkEqualSign(codeLR)) {
                    coeff = part.equal;
                } else {
                    if (this.checkZeroSign(codeLR, direct)) {
                        coeff = part.zeroOper;
                    } else {
                        coeff = part.letters;
                    }
                }
            }
        }
        return coeff;
    },
    checkOperSign: function (code) {
        var PLUS = 43,
        MINUS = 45,
        PLUS_MINUS = 177,
        MINUS_PLUS = 8723;
        return code == PLUS || code == MINUS || code == PLUS_MINUS || code == MINUS_PLUS;
    },
    checkEqualSign: function (code) {
        var COMPARE = code == 60 || code == 62;
        var ARROWS = (code >= 8592 && code <= 8627) || (code == 8630) || (code == 8631) || (code >= 8634 && code <= 8681) || (code >= 8692 && code <= 8703);
        var INTERSECTION = code >= 8739 && code <= 8746;
        var EQUALS = code == 61 || (code >= 8756 && code <= 8893) || (code >= 8900 && code <= 8959);
        var ARR_FISHES = (code >= 10202 && code <= 10213) || (code >= 10220 && code <= 10623);
        var TRIANGLE_SYMB = code >= 10702 && code <= 10711;
        var OTH_SYMB = code == 10719 || (code >= 10721 && code <= 10727) || (code >= 10740 && code <= 10744) || (code >= 10786 && code <= 10992) || (code >= 10994 && code <= 11003) || code == 11005 || code == 11006;
        return COMPARE || ARROWS || INTERSECTION || EQUALS || ARR_FISHES || TRIANGLE_SYMB || OTH_SYMB;
    },
    checkZeroSign: function (code, direct) {
        var MULT = 42,
        DIVISION = 47,
        B_SLASH = 92;
        var bOper = code == MULT || code == DIVISION || code == B_SLASH;
        var bLeftBracket = direct == -1 && (code == 40 || code == 91 || code == 123);
        var bRightBracket = direct == 1 && (code == 41 || code == 93 || code == 125);
        return bOper || bLeftBracket || bRightBracket;
    }
};
var COEFF_GAPS = new CCoeffGaps();
function CMathArgSize() {
    this.value = undefined;
}
CMathArgSize.prototype = {
    decrease: function () {
        if (this.value == undefined) {
            this.value = 0;
        }
        if (this.value > -2) {
            this.value--;
        }
    },
    increase: function () {
        if (this.value == undefined) {
            this.value = 0;
        }
        if (this.value < 2) {
            this.value++;
        }
    },
    Set: function (ArgSize) {
        this.value = ArgSize.value;
    },
    SetValue: function (val) {
        if (val < -2) {
            this.value = -2;
        } else {
            if (val > 2) {
                this.value = 2;
            } else {
                this.value = val;
            }
        }
    },
    Copy: function () {
        var ArgSize = new CMathArgSize();
        ArgSize.value = this.value;
        return ArgSize;
    },
    Merge: function (ArgSize) {
        if (this.value == undefined) {
            this.value = 0;
        }
        if (ArgSize.value == undefined) {
            ArgSize.value = 0;
        }
        this.SetValue(this.value + ArgSize.value);
    }
};
function CMathGapsInfo(argSize) {
    this.argSize = argSize;
    this.Left = null;
    this.Current = null;
    this.LeftFontSize = null;
    this.CurrentFontSize = null;
}
CMathGapsInfo.prototype = {
    setGaps: function (Current, CurrentFontSize) {
        this.Left = this.Current;
        this.LeftFontSize = this.CurrentFontSize;
        this.Current = Current;
        this.CurrentFontSize = CurrentFontSize;
        if (this.argSize < 0) {
            this.Current.GapLeft = 0;
            if (this.Left !== null) {
                this.Left.GapRight = 0;
            }
        } else {
            var leftCoeff = 0,
            rightCoeff = 0;
            var leftCode;
            if (this.Current.IsText()) {
                var currCode = this.Current.getCodeChr();
                if (this.Left !== null) {
                    if (this.Left.Type == para_Math_Composition) {
                        rightCoeff = this.getGapsMComp(this.Left, 1);
                        leftCoeff = COEFF_GAPS.getCoeff(currCode, -1, -1);
                        if (leftCoeff > rightCoeff) {
                            leftCoeff -= rightCoeff;
                        }
                    } else {
                        if (this.Left.IsText()) {
                            leftCode = this.Left.getCodeChr();
                            leftCoeff = COEFF_GAPS.getCoeff(currCode, leftCode, -1);
                            rightCoeff = COEFF_GAPS.getCoeff(leftCode, currCode, 1);
                        }
                    }
                } else {
                    this.Current.GapLeft = 0;
                }
            } else {
                if (this.Current.Type == para_Math_Composition) {
                    leftCoeff = this.getGapsMComp(this.Current, -1);
                    if (this.Left != null) {
                        if (this.Left.Type == para_Math_Composition) {
                            rightCoeff = this.getGapsMComp(this.Left, 1);
                            if (rightCoeff / 2 > leftCoeff) {
                                rightCoeff -= leftCoeff;
                            } else {
                                rightCoeff /= 2;
                            }
                            if (leftCoeff < rightCoeff / 2) {
                                leftCoeff = rightCoeff / 2;
                            } else {
                                leftCoeff -= rightCoeff / 2;
                            }
                        } else {
                            if (this.Left.IsText()) {
                                leftCode = this.Left.getCodeChr();
                                rightCoeff = COEFF_GAPS.getCoeff(leftCode, -1, 1);
                                if (rightCoeff > leftCoeff) {
                                    rightCoeff -= leftCoeff;
                                }
                            }
                        }
                    } else {
                        leftCoeff = 0;
                    }
                }
            }
            leftCoeff = Math.ceil(leftCoeff * 10) / 10;
            rightCoeff = Math.ceil(rightCoeff * 10) / 10;
            var LGapSign = 0.1513 * this.CurrentFontSize;
            this.Current.GapLeft = Math.ceil(leftCoeff * LGapSign * 10) / 10;
            if (this.Left != null) {
                var RGapSign = 0.1513 * this.LeftFontSize;
                this.Left.GapRight = Math.ceil(rightCoeff * RGapSign * 10) / 10;
            }
        }
    },
    getGapsMComp: function (MComp, direct) {
        var kind = MComp.kind;
        var checkGap = this.checkGapKind(kind);
        var bNeedGap = !checkGap.bEmptyGaps && !checkGap.bChildGaps;
        var coeffLeft = 0.001,
        coeffRight = 0;
        var bDegree = kind == MATH_DEGREE;
        if (checkGap.bChildGaps) {
            if (bDegree) {
                coeffLeft = 0.03;
                if (MComp.IsPlhIterator()) {
                    coeffRight = 0.12;
                } else {
                    coeffRight = 0.16;
                }
            }
            var gapsChild = MComp.getGapsInside(this);
            coeffLeft = coeffLeft < gapsChild.left ? gapsChild.left : coeffLeft;
            coeffRight = coeffRight < gapsChild.right ? gapsChild.right : coeffRight;
        } else {
            if (bNeedGap) {
                coeffLeft = 0.4;
                coeffRight = 0.3;
            }
        }
        return direct == -1 ? coeffLeft : coeffRight;
    },
    checkGapKind: function (kind) {
        var bEmptyGaps = kind == MATH_DELIMITER || kind == MATH_MATRIX,
        bChildGaps = kind == MATH_DEGREE || kind == MATH_DEGREESubSup || kind == MATH_ACCENT || kind == MATH_RADICAL || kind == MATH_BOX || kind == MATH_BORDER_BOX || (kind == MATH_DELIMITER);
        return {
            bEmptyGaps: bEmptyGaps,
            bChildGaps: bChildGaps
        };
    }
};
function CMPrp() {
    this.sty = undefined;
    this.scr = undefined;
    this.nor = undefined;
    this.aln = undefined;
    this.brk = undefined;
    this.lit = undefined;
}
CMPrp.prototype = {
    getPropsForWrite: function () {
        var props = {
            aln: this.aln,
            brk: this.brk,
            lit: this.lit,
            nor: this.nor,
            sty: this.sty,
            scr: this.scr
        };
        return props;
    },
    GetTxtPrp: function () {
        var textPrp = new CTextPr();
        if (this.sty == undefined) {
            textPrp.Italic = true;
            textPrp.Bold = false;
        } else {
            textPrp.Italic = this.sty == STY_BI || this.sty == STY_ITALIC;
            textPrp.Bold = this.sty == STY_BI || this.sty == STY_BOLD;
        }
        return textPrp;
    },
    Copy: function () {
        var NewMPrp = new CMPrp();
        NewMPrp.aln = this.aln;
        NewMPrp.lit = this.lit;
        NewMPrp.nor = this.nor;
        NewMPrp.sty = this.sty;
        NewMPrp.scr = this.scr;
        if (this.brk !== undefined) {
            NewMPrp.brk = this.brk.Copy();
        }
        return NewMPrp;
    },
    GetCompiled_ScrStyles: function () {
        var nor = this.nor == undefined ? false : this.nor;
        var scr = this.scr == undefined ? TXT_ROMAN : this.scr;
        var sty = this.sty == undefined ? STY_ITALIC : this.sty;
        return {
            nor: nor,
            scr: scr,
            sty: sty
        };
    },
    SetStyle: function (Bold, Italic) {
        if (Bold == true && Italic == true) {
            this.sty = STY_BI;
        } else {
            if (Italic == true) {
                this.sty = STY_ITALIC;
            } else {
                if (Bold == true) {
                    this.sty = STY_BOLD;
                } else {
                    if (Bold == false && Italic == false) {
                        this.sty = STY_PLAIN;
                    } else {
                        this.sty = undefined;
                    }
                }
            }
        }
    },
    GetBoldItalic: function () {
        var Object = {
            Italic: undefined,
            Bold: undefined
        };
        if (this.sty == STY_BI) {
            Object.Bold = true;
        } else {
            if (this.sty == STY_BOLD) {
                Object.Bold = true;
                Object.Italic = false;
            }
        }
        return Object;
    }
};
function CMathContent() {
    this.Id = g_oIdCounter.Get_NewId();
    this.Content = [];
    this.CurPos = 0;
    this.WidthToElement = [];
    this.pos = new CMathPosition();
    this.ParaMath = null;
    this.ArgSize = new CMathArgSize();
    this.Compiled_ArgSz = new CMathArgSize();
    this.InfoPoints = new CInfoPoints();
    this.plhHide = false;
    this.bRoot = false;
    this.Selection = {
        Start: 0,
        End: 0,
        Use: false
    };
    this.RecalcInfo = {
        TextPr: true,
        bEqqArray: false,
        bChangeInfoPoints: false
    };
    this.NearPosArray = [];
    this.ParentElement = null;
    this.size = new CMathSize();
    g_oTableId.Add(this, this.Id);
}
CMathContent.prototype = {
    constructor: CMathContent,
    init: function () {},
    addElementToContent: function (obj) {
        this.Internal_Content_Add(this.Content.length, obj, false);
        this.CurPos = this.Content.length - 1;
    },
    fillPlaceholders: function () {
        this.Content.length = 0;
        var oMRun = new ParaRun(null, true);
        oMRun.fillPlaceholders();
        this.addElementToContent(oMRun);
    },
    PreRecalc: function (Parent, ParaMath, ArgSize, RPI) {
        if (ArgSize !== null && ArgSize !== undefined) {
            this.Compiled_ArgSz.value = this.ArgSize.value;
            this.Compiled_ArgSz.Merge(ArgSize);
        }
        this.ParaMath = ParaMath;
        if (Parent !== null) {
            this.bRoot = false;
            this.Parent = Parent;
        }
        if (ArgSize !== null && ArgSize !== undefined) {
            this.Compiled_ArgSz.value = this.ArgSize.value;
            this.Compiled_ArgSz.Merge(ArgSize);
        }
        var lng = this.Content.length;
        var GapsInfo = new CMathGapsInfo(this.Compiled_ArgSz.value);
        for (var pos = 0; pos < lng; pos++) {
            if (this.Content[pos].Type == para_Math_Composition) {
                this.Content[pos].PreRecalc(this, ParaMath, this.Compiled_ArgSz, RPI, GapsInfo);
            } else {
                if (this.Content[pos].Type == para_Math_Run) {
                    this.Content[pos].Math_PreRecalc(this, ParaMath, this.Compiled_ArgSz, RPI, GapsInfo);
                }
            }
        }
        if (GapsInfo.Current !== null) {
            GapsInfo.Current.GapRight = 0;
        }
    },
    Resize: function (oMeasure, RPI) {
        this.WidthToElement.length = 0;
        this.RecalcInfo.bEqqArray = RPI.bEqqArray;
        var lng = this.Content.length;
        this.size.SetZero();
        this.InfoPoints.SetDefault();
        for (var pos = 0; pos < lng; pos++) {
            if (this.Content[pos].Type == para_Math_Composition) {
                var NewRPI = RPI.Copy();
                NewRPI.bEqqArray = false;
                this.Content[pos].Resize(oMeasure, NewRPI);
                if (RPI.bEqqArray) {
                    this.InfoPoints.ContentPoints.UpdatePoint(this.Content[pos].size.width);
                }
            } else {
                if (this.Content[pos].Type == para_Math_Run) {
                    this.Content[pos].Math_Recalculate(oMeasure, RPI, this.InfoPoints.ContentPoints);
                }
            }
            this.WidthToElement[pos] = this.size.width;
            var oSize = this.Content[pos].size;
            this.size.width += oSize.width;
            var oDescent = oSize.height - oSize.ascent,
            SizeDescent = this.size.height - this.size.ascent;
            this.size.ascent = this.size.ascent > oSize.ascent ? this.size.ascent : oSize.ascent;
            this.size.height = SizeDescent < oDescent ? oDescent + this.size.ascent : SizeDescent + this.size.ascent;
        }
    },
    Resize_2: function (oMeasure, Parent, ParaMath, RPI, ArgSize) {
        var lng = this.Content.length;
        for (var i = 0; i < lng; i++) {
            if (this.Content[i].Type == para_Math_Composition) {
                this.Content[i].Resize_2(oMeasure, this, ParaMath, RPI, ArgSize);
            } else {
                this.Content[i].Math_Recalculate(oMeasure, RPI, null);
            }
        }
    },
    getWidthsPoints: function () {
        return this.InfoPoints.ContentPoints.Widths;
    },
    IsEqqArray: function () {
        return this.Parent.IsEqqArray();
    },
    Get_CompiledArgSize: function () {
        return this.Compiled_ArgSz;
    },
    getGapsInside: function (GapsInfo) {
        var gaps = {
            left: 0,
            right: 0
        };
        var bFirstComp = false,
        bLastComp = false;
        var len = this.Content.length;
        if (len > 1) {
            var bFRunEmpty = this.Content[0].Is_Empty();
            bFirstComp = bFRunEmpty && this.Content[1].Type == para_Math_Composition;
            var bLastRunEmpty = this.Content[len - 1].Is_Empty();
            bLastComp = bLastRunEmpty && this.Content[len - 2].Type == para_Math_Composition;
        }
        var checkGap;
        if (bFirstComp) {
            checkGap = GapsInfo.checkGapKind(this.Content[1].kind);
            if (!checkGap.bChildGaps) {
                gaps.left = GapsInfo.getGapsMComp(this.Content[1], -1);
            }
        }
        if (bLastComp) {
            checkGap = GapsInfo.checkGapKind(this.Content[len - 1].kind);
            if (!checkGap.bChildGaps) {
                gaps.right = GapsInfo.getGapsMComp(this.Content[len - 1], 1);
            }
        }
        return gaps;
    },
    IsOneLineText: function () {
        var bOneLineText = true;
        for (var i = 0; i < this.Content.length; i++) {
            if (this.Content[i].Type == para_Math_Composition) {
                bOneLineText = false;
            }
        }
        return bOneLineText;
    },
    draw: function (x, y, pGraphics, PDSE) {
        var bHidePlh = this.plhHide && this.IsPlaceholder();
        if (!bHidePlh) {
            for (var i = 0; i < this.Content.length; i++) {
                if (this.Content[i].Type == para_Math_Composition) {
                    this.Content[i].draw(x, y, pGraphics, PDSE);
                } else {
                    this.Content[i].Draw_Elements(PDSE);
                }
            }
        }
    },
    setCtrPrp: function () {},
    getInfoLetter: function (Info) {
        if (this.Content.length == 1) {
            this.Content[0].Math_GetInfoLetter(Info);
        } else {
            Info.Result = false;
        }
    },
    IsPlaceholder: function () {
        var flag = false;
        if (!this.bRoot && this.Content.length == 1) {
            flag = this.Content[0].IsPlaceholder();
        }
        return flag;
    },
    IsJustDraw: function () {
        return false;
    },
    ApplyPoints: function (WidthsPoints, Points, MaxDimWidths) {
        this.InfoPoints.GWidths = WidthsPoints;
        this.InfoPoints.GPoints = Points;
        this.InfoPoints.GMaxDimWidths = MaxDimWidths;
        var PosInfo = new CMathPointInfo();
        PosInfo.SetInfoPoints(this.InfoPoints);
        this.size.width = 0;
        for (var i = 0; i < this.Content.length; i++) {
            if (this.Content[i].Type === para_Math_Run) {
                this.Content[i].ApplyPoints(PosInfo);
            }
            this.size.width += this.Content[i].size.width;
        }
    },
    setPosition: function (pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        var w = 0;
        if (this.RecalcInfo.bEqqArray) {
            var PosInfo = new CMathPointInfo();
            PosInfo.SetInfoPoints(this.InfoPoints);
            this.pos.x += PosInfo.GetAlign();
        }
        for (var i = 0; i < this.Content.length; i++) {
            var NewPos = new CMathPosition();
            NewPos.x = this.pos.x + w;
            NewPos.y = this.pos.y + this.size.ascent;
            if (this.Content[i].Type == para_Math_Run) {
                this.Content[i].Math_SetPosition(NewPos);
            } else {
                this.Content[i].setPosition(NewPos);
            }
            w += this.Content[i].size.width;
        }
    },
    SetParent: function (Parent, ParaMath) {
        this.Parent = Parent;
        this.ParaMath = ParaMath;
    },
    hidePlaceholder: function (flag) {
        this.plhHide = flag;
    },
    getFirstRPrp: function (ParaMath) {
        return this.Content[0].Get_CompiledPr(true);
    },
    GetCtrPrp: function () {
        var ctrPrp = new CTextPr();
        if (!this.bRoot) {
            ctrPrp.Merge(this.Parent.Get_CompiledCtrPrp_2());
        }
        return ctrPrp;
    },
    IsAccent: function () {
        var result = false;
        if (!this.bRoot) {
            result = this.Parent.IsAccent();
        }
        return result;
    },
    GetParent: function () {
        return this.Parent.GetParent();
    },
    SetArgSize: function (val) {
        this.ArgSize.SetValue(val);
    },
    GetArgSize: function () {
        return this.ArgSize.value;
    },
    Is_SelectedAll: function (Props) {
        var bFirst = false,
        bEnd = false;
        if (this.Selection.Start == 0 && this.Selection.End == this.Content.length - 1) {
            if (this.Content[this.Selection.Start].Type == para_Math_Run) {
                bFirst = this.Content[this.Selection.Start].Is_SelectedAll(Props);
            } else {
                bFirst = true;
            }
            if (this.Content[this.Selection.End].Type == para_Math_Run) {
                bEnd = this.Content[this.Selection.End].Is_SelectedAll(Props);
            } else {
                bEnd = true;
            }
        }
        return bFirst && bEnd;
    },
    Get_Id: function () {
        return this.GetId();
    },
    GetId: function () {
        return this.Id;
    },
    private_CorrectContent: function () {
        var len = this.Content.length;
        var current = null;
        var emptyRun;
        var currPos = 0;
        while (currPos < len) {
            current = this.Content[currPos];
            if (currPos < len && para_Math_Run === current.Type) {
                current.Math_Correct_Content();
            }
            var bLeftRun = currPos > 0 ? this.Content[currPos - 1].Type == para_Math_Run : false,
            bRightRun = currPos < len - 1 ? this.Content[currPos + 1].Type === para_Math_Run : false;
            var bLeftEmptyRun = bLeftRun ? this.Content[currPos - 1].Is_Empty() : false;
            var bCurrComp = current.Type == para_Math_Composition,
            bCurrEmptyRun = current.Type == para_Math_Run && current.Is_Empty();
            var bDeleteEmptyRun = bCurrEmptyRun && (bLeftRun || bRightRun);
            if (bCurrComp && !bLeftRun) {
                emptyRun = new ParaRun(null, true);
                emptyRun.Set_RFont_ForMathRun();
                this.Apply_TextPrForRunEmpty(emptyRun, current);
                this.Internal_Content_Add(currPos, emptyRun);
                currPos += 2;
            } else {
                if (bCurrComp && bLeftEmptyRun) {
                    emptyRun = this.Content[currPos - 1];
                    this.Apply_TextPrForRunEmpty(emptyRun, current);
                    currPos++;
                } else {
                    if (bDeleteEmptyRun) {
                        this.Remove_FromContent(currPos, 1);
                        if (this.CurPos === currPos) {
                            if (bLeftRun) {
                                this.CurPos = currPos - 1;
                                this.Content[this.CurPos].Cursor_MoveToEndPos(false);
                            } else {
                                this.CurPos = currPos;
                                this.Content[this.CurPos].Cursor_MoveToStartPos();
                            }
                        }
                    } else {
                        currPos++;
                    }
                }
            }
            len = this.Content.length;
        }
        if (len > 1) {
            var bLastComp = this.Content[len - 1].Type == para_Math_Composition,
            bLastRunEmpty = this.Content[len - 2].Type == para_Math_Composition && this.Content[len - 1].Type == para_Math_Run && this.Content[len - 1].Is_Empty();
            if (bLastComp) {
                emptyRun = new ParaRun(null, true);
                emptyRun.Set_RFont_ForMathRun();
                this.Apply_TextPrForRunEmpty(emptyRun, this.Content[len - 1]);
                this.Internal_Content_Add(currPos, emptyRun);
            } else {
                if (bLastRunEmpty) {
                    emptyRun = this.Content[len - 1];
                    this.Apply_TextPrForRunEmpty(emptyRun, this.Content[len - 2]);
                }
            }
        }
    },
    Apply_TextPrForRunEmpty: function (emptyRun, Composition) {
        var ctrPrp = Composition.Get_CtrPrp();
        var mathPrp = new CMPrp();
        mathPrp.SetStyle(ctrPrp.Bold, ctrPrp.Italic);
        emptyRun.Set_MathPr(mathPrp);
        ctrPrp.Bold = undefined;
        ctrPrp.Italic = undefined;
        emptyRun.Set_Pr(ctrPrp);
    },
    Correct_Content: function (bInnerCorrection) {
        if (true === bInnerCorrection) {
            for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++) {
                if (para_Math_Composition === this.Content[nPos].Type) {
                    this.Content[nPos].Correct_Content(true);
                }
            }
        }
        this.private_CorrectContent();
        if (this.Content.length < 1) {
            var NewMathRun = new ParaRun(null, true);
            NewMathRun.Set_RFont_ForMathRun();
            this.Add_ToContent(0, NewMathRun);
        }
        for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++) {
            if (para_Math_Run === this.Content[nPos].Type) {
                this.Content[nPos].Math_Correct_Content();
            }
        }
        if (this.Content.length == 1) {
            if (this.Content[0].Is_Empty()) {
                this.Content[0].fillPlaceholders();
            }
        }
    },
    Correct_ContentPos: function (nDirection) {
        var nCurPos = this.CurPos;
        if (nCurPos < 0) {
            this.CurPos = 0;
            this.Content[0].Cursor_MoveToStartPos();
        } else {
            if (nCurPos > this.Content.length - 1) {
                this.CurPos = this.Content.length - 1;
                this.Content[this.CurPos].Cursor_MoveToEndPos();
            } else {
                if (para_Math_Run !== this.Content[nCurPos].Type) {
                    if (nDirection > 0) {
                        this.CurPos = nCurPos + 1;
                        this.Content[this.CurPos].Cursor_MoveToStartPos();
                    } else {
                        this.CurPos = nCurPos - 1;
                        this.Content[this.CurPos].Cursor_MoveToEndPos();
                    }
                }
            }
        }
    },
    Cursor_Is_Start: function () {
        var result = false;
        if (!this.Is_Empty()) {
            if (this.CurPos == 0) {
                result = this.Content[0].Cursor_Is_Start();
            }
        }
        return result;
    },
    Cursor_Is_End: function () {
        var result = false;
        if (!this.Is_Empty()) {
            var len = this.Content.length - 1;
            if (this.CurPos == len) {
                result = this.Content[len].Cursor_Is_End();
            }
        }
        return result;
    },
    Get_TextPr: function (ContentPos, Depth) {
        var pos = ContentPos.Get(Depth);
        var TextPr;
        if (this.IsPlaceholder()) {
            TextPr = this.Parent.Get_CtrPrp();
        } else {
            TextPr = this.Content[pos].Get_TextPr(ContentPos, Depth + 1);
        }
        return TextPr;
    },
    Get_CompiledTextPr: function (Copy, bAll) {
        var TextPr = null;
        if (this.IsPlaceholder()) {
            TextPr = this.Parent.Get_CompiledCtrPrp_2();
        } else {
            if (this.Selection.Use || bAll == true) {
                var StartPos, EndPos;
                if (bAll == true) {
                    StartPos = 0;
                    EndPos = this.Content.length - 1;
                } else {
                    StartPos = this.Selection.Start;
                    EndPos = this.Selection.End;
                    if (StartPos > EndPos) {
                        StartPos = this.Selection.End;
                        EndPos = this.Selection.Start;
                    }
                }
                while (null === TextPr && StartPos <= EndPos) {
                    var bComp = this.Content[StartPos].Type == para_Math_Composition,
                    bEmptyRun = this.Content[StartPos].Type == para_Math_Run && true === this.Content[StartPos].Selection_IsEmpty();
                    if (bComp || !bEmptyRun || bAll) {
                        TextPr = this.Content[StartPos].Get_CompiledTextPr(true);
                    }
                    StartPos++;
                }
                while (this.Content[EndPos].Type == para_Math_Run && true === this.Content[EndPos].Selection_IsEmpty() && StartPos < EndPos + 1 && bAll == false) {
                    EndPos--;
                }
                for (var CurPos = StartPos; CurPos < EndPos + 1; CurPos++) {
                    var CurTextPr = this.Content[CurPos].Get_CompiledTextPr(false);
                    if (null !== CurTextPr) {
                        TextPr = TextPr.Compare(CurTextPr);
                    }
                }
            } else {
                var CurPos = this.CurPos;
                if (CurPos >= 0 && CurPos < this.Content.length) {
                    TextPr = this.Content[CurPos].Get_CompiledTextPr(Copy);
                }
            }
        }
        return TextPr;
    },
    GetMathTextPrForMenu: function (ContentPos, Depth) {
        var pos = ContentPos.Get(Depth);
        return this.Content[pos].GetMathTextPrForMenu(ContentPos, Depth + 1);
    },
    Apply_TextPr: function (TextPr, IncFontSize, ApplyToAll, PosForMenu) {
        if (true === ApplyToAll) {
            for (var i = 0; i < this.Content.length; i++) {
                this.Content[i].Apply_TextPr(TextPr, IncFontSize, true);
            }
        } else {
            var StartPos, EndPos, bMenu = false;
            if (PosForMenu !== undefined) {
                StartPos = PosForMenu.StartPos;
                EndPos = PosForMenu.EndPos;
                bMenu = true;
            } else {
                StartPos = this.Selection.Start;
                EndPos = this.Selection.End;
            }
            var NewRuns;
            var LRun, CRun, RRun;
            var bSelectOneElement = this.Selection.Use && StartPos == EndPos;
            var FirstPos = this.Selection.Use ? Math.min(StartPos, EndPos) : this.CurPos;
            if (FirstPos == 0 && this.bRoot) {
                this.ParaMath.SetRecalcCtrPrp(this.Content[0]);
            }
            if ((!this.Selection.Use && !bMenu) || (bSelectOneElement && this.Content[StartPos].Type == para_Math_Run)) {
                var Pos = !this.Selection.Use ? this.CurPos : StartPos;
                NewRuns = this.Content[Pos].Apply_TextPr(TextPr, IncFontSize, false);
                LRun = NewRuns[0];
                CRun = NewRuns[1];
                RRun = NewRuns[2];
                var CRunPos = Pos;
                if (LRun !== null) {
                    this.Internal_Content_Add(Pos + 1, CRun);
                    CRunPos = Pos + 1;
                }
                if (RRun !== null) {
                    this.Internal_Content_Add(CRunPos + 1, RRun);
                }
                this.CurPos = CRunPos;
                this.Selection.Start = CRunPos;
                this.Selection.End = CRunPos;
            } else {
                if (bSelectOneElement && this.Content[StartPos].Type == para_Math_Composition) {
                    this.Content[StartPos].Apply_TextPr(TextPr, IncFontSize, true);
                } else {
                    if (StartPos > EndPos) {
                        var temp = StartPos;
                        StartPos = EndPos;
                        EndPos = temp;
                    }
                    for (var i = StartPos + 1; i < EndPos; i++) {
                        this.Content[i].Apply_TextPr(TextPr, IncFontSize, true);
                    }
                    if (this.Content[EndPos].Type == para_Math_Run) {
                        NewRuns = this.Content[EndPos].Apply_TextPr(TextPr, IncFontSize, false);
                        CRun = NewRuns[1];
                        RRun = NewRuns[2];
                        if (RRun !== null) {
                            this.Internal_Content_Add(EndPos + 1, RRun);
                        }
                    } else {
                        this.Content[EndPos].Apply_TextPr(TextPr, IncFontSize, true);
                    }
                    if (this.Content[StartPos].Type == para_Math_Run) {
                        NewRuns = this.Content[StartPos].Apply_TextPr(TextPr, IncFontSize, false);
                        LRun = NewRuns[0];
                        CRun = NewRuns[1];
                        if (LRun !== null) {
                            this.Internal_Content_Add(StartPos + 1, CRun);
                        }
                    } else {
                        this.Content[StartPos].Apply_TextPr(TextPr, IncFontSize, true);
                    }
                    var bStartComposition = this.Content[StartPos].Type == para_Math_Composition || (this.Content[StartPos].Is_Empty() && this.Content[StartPos + 1].Type == para_Math_Composition);
                    var bEndCompostion = this.Content[EndPos].Type == para_Math_Composition || (this.Content[EndPos].Is_Empty() && this.Content[EndPos - 1].Type == para_Math_Composition);
                    if (!bStartComposition) {
                        if (this.Selection.Start < this.Selection.End && true === this.Content[this.Selection.Start].Selection_IsEmpty(true)) {
                            this.Selection.Start++;
                        } else {
                            if (this.Selection.End < this.Selection.Start && true === this.Content[this.Selection.End].Selection_IsEmpty(true)) {
                                this.Selection.End++;
                            }
                        }
                    }
                    if (!bEndCompostion) {
                        if (this.Selection.Start < this.Selection.End && true === this.Content[this.Selection.End].Selection_IsEmpty(true)) {
                            this.Selection.End--;
                        } else {
                            if (this.Selection.End < this.Selection.Start && true === this.Content[this.Selection.Start].Selection_IsEmpty(true)) {
                                this.Selection.Start--;
                            }
                        }
                    }
                }
            }
        }
    },
    Set_MathTextPr2: function (TextPr, MathPr, bAll, StartPos, Count) {
        if (bAll) {
            StartPos = 0;
            Count = this.Content.length - 1;
        }
        if (Count < 0 || StartPos + Count > this.Content.length - 1) {
            return;
        }
        for (var pos = StartPos; pos <= StartPos + Count; pos++) {
            this.Content[pos].Set_MathTextPr2(TextPr, MathPr, true);
        }
    },
    IsNormalTextInRuns: function () {
        var flag = true;
        if (this.Selection.Use) {
            var StartPos = this.Selection.Start,
            EndPos = this.Selection.End;
            if (StartPos > EndPos) {
                StartPos = this.Selection.End;
                EndPos = this.Selection.Start;
            }
            for (var i = StartPos; i < EndPos + 1; i++) {
                var curr = this.Content[i],
                currType = curr.Type;
                if (currType == para_Math_Composition || (currType == para_Math_Run && false == curr.IsNormalText())) {
                    flag = false;
                    break;
                }
            }
        } else {
            flag = false;
        }
        return flag;
    },
    Internal_Content_Add: function (Pos, Item, bUpdatePosition) {
        Item.Set_ParaMath(this.ParaMath);
        Item.Parent = this;
        History.Add(this, {
            Type: historyitem_Math_AddItem,
            Pos: Pos,
            EndPos: Pos,
            Items: [Item]
        });
        this.Content.splice(Pos, 0, Item);
        this.private_UpdatePosOnAdd(Pos, bUpdatePosition);
    },
    private_UpdatePosOnAdd: function (Pos, bUpdatePosition) {
        if (bUpdatePosition !== false) {
            if (this.CurPos >= Pos) {
                this.CurPos++;
            }
            if (this.Selection.Start >= Pos) {
                this.Selection.Start++;
            }
            if (this.Selection.End >= Pos) {
                this.Selection.End++;
            }
            this.private_CorrectSelectionPos();
            this.private_CorrectCurPos();
        }
        var NearPosLen = this.NearPosArray.length;
        for (var Index = 0; Index < NearPosLen; Index++) {
            var HyperNearPos = this.NearPosArray[Index];
            var ContentPos = HyperNearPos.NearPos.ContentPos;
            var Depth = HyperNearPos.Depth;
            if (ContentPos.Data[Depth] >= Pos) {
                ContentPos.Data[Depth]++;
            }
        }
    },
    private_CorrectSelectionPos: function () {
        this.Selection.Start = Math.max(0, Math.min(this.Content.length - 1, this.Selection.Start));
        this.Selection.End = Math.max(0, Math.min(this.Content.length - 1, this.Selection.End));
    },
    private_CorrectCurPos: function () {
        if (this.CurPos > this.Content.length - 1) {
            this.CurPos = this.Content.length - 1;
            if (para_Math_Run === this.Content[this.CurPos].Type) {
                this.Content[this.CurPos].Cursor_MoveToEndPos(false);
            }
        }
        if (this.CurPos < 0) {
            this.CurPos = this.Content.length - 1;
            if (para_Math_Run === this.Content[this.CurPos].Type) {
                this.Content[this.CurPos].Cursor_MoveToStartPos();
            }
        }
    },
    SplitContent: function (NewContent, ContentPos, Depth) {
        var Pos = ContentPos.Get(Depth);
        if (para_Math_Run === this.Content[Pos].Type) {
            var NewRun = this.Content[Pos].Split(ContentPos, Depth + 1);
            NewContent.Add_ToContent(0, NewRun);
            var len = this.Content.length;
            if (Pos < len - 1) {
                NewContent.Concat_ToContent(this.Content.slice(Pos + 1));
                this.Remove_FromContent(Pos + 1, len - Pos - 1);
            }
        }
        this.private_SetNeedResize();
    },
    Add_ToContent: function (Pos, Item) {
        this.Internal_Content_Add(Pos, Item);
    },
    Concat_ToContent: function (NewItems) {
        var StartPos = this.Content.length;
        this.Content = this.Content.concat(NewItems);
        History.Add(this, {
            Type: historyitem_Math_AddItem,
            Pos: StartPos,
            EndPos: this.Content.length - 1,
            Items: NewItems
        });
    },
    Remove_FromContent: function (Pos, Count) {
        var DeletedItems = this.Content.splice(Pos, Count);
        History.Add(this, {
            Type: historyitem_Math_RemoveItem,
            Pos: Pos,
            EndPos: Pos + Count - 1,
            Items: DeletedItems
        });
        if (this.CurPos > Pos + Count) {
            this.CurPos -= Count;
        } else {
            if (this.CurPos > Pos) {
                this.CurPos = Pos;
            }
        }
        this.private_CorrectCurPos();
        this.private_UpdatePosOnRemove(Pos, Count);
    },
    private_UpdatePosOnRemove: function (Pos, Count) {
        if (true === this.Selection.Use) {
            if (this.Selection.Start <= this.Selection.End) {
                if (this.Selection.Start > Pos + Count) {
                    this.Selection.Start -= Count;
                } else {
                    if (this.Selection.Start > Pos) {
                        this.Selection.Start = Pos;
                    }
                }
                if (this.Selection.End >= Pos + Count) {
                    this.Selection.End -= Count;
                } else {
                    if (this.Selection.End >= Pos) {
                        this.Selection.End = Math.max(0, Pos - 1);
                    }
                }
            } else {
                if (this.Selection.Start >= Pos + Count) {
                    this.Selection.Start -= Count;
                } else {
                    if (this.Selection.Start >= Pos) {
                        this.Selection.Start = Math.max(0, Pos - 1);
                    }
                }
                if (this.Selection.End > Pos + Count) {
                    this.Selection.End -= Count;
                } else {
                    if (this.Selection.End > Pos) {
                        this.Selection.End = Pos;
                    }
                }
            }
        }
        var NearPosLen = this.NearPosArray.length;
        for (var Index = 0; Index < NearPosLen; Index++) {
            var HyperNearPos = this.NearPosArray[Index];
            var ContentPos = HyperNearPos.NearPos.ContentPos;
            var Depth = HyperNearPos.Depth;
            if (ContentPos.Data[Depth] > Pos + Count) {
                ContentPos.Data[Depth] -= Count;
            } else {
                if (ContentPos.Data[Depth] > Pos) {
                    ContentPos.Data[Depth] = Math.max(0, Pos);
                }
            }
        }
    },
    Get_Default_TPrp: function () {
        return this.ParaMath.Get_Default_TPrp();
    },
    Is_Empty: function () {
        return this.Content.length == 0;
    },
    Copy: function (Selected) {
        var NewContent = new CMathContent();
        this.CopyTo(NewContent, Selected);
        return NewContent;
    },
    CopyTo: function (OtherContent, Selected) {
        var nStartPos, nEndPos;
        if (true === Selected) {
            if (this.Selection.Start < this.Selection.End) {
                nStartPos = this.Selection.Start;
                nEndPos = this.Selection.End;
            } else {
                nStartPos = this.Selection.End;
                nEndPos = this.Selection.Start;
            }
        } else {
            nStartPos = 0;
            nEndPos = this.Content.length - 1;
        }
        OtherContent.plHid = this.plhHide;
        for (var nPos = nStartPos; nPos <= nEndPos; nPos++) {
            var oElement;
            if (this.Content[nPos].Type == para_Math_Run) {
                oElement = this.Content[nPos].Copy(Selected);
            } else {
                oElement = this.Content[nPos].Copy(false);
            }
            OtherContent.Internal_Content_Add(OtherContent.Content.length, oElement);
        }
    },
    getElem: function (nNum) {
        return this.Content[nNum];
    },
    Is_FirstComposition: function () {
        var result = false;
        if (this.Content.length > 1) {
            var bEmptyRun = this.Content[0].Is_Empty(),
            bMathComp = this.Content[1].Type == para_Math_Composition;
            if (bEmptyRun && bMathComp) {
                result = true;
            }
        }
        return result;
    },
    GetLastElement: function () {
        var pos = this.Content.length - 1;
        while (this.Content[pos].Type == para_Math_Run && this.Content[pos].Is_Empty() && pos > 0) {
            pos--;
        }
        var last = this.Content[pos].Type == para_Math_Run ? this.Content[pos] : this.Content[pos].GetLastElement();
        return last;
    },
    GetFirstElement: function () {
        var pos = 0;
        while (this.Content[pos].Type == para_Math_Run && this.Content[pos].Is_Empty() && pos < this.Content.length - 1) {
            pos++;
        }
        var first = this.Content[pos].Type == para_Math_Run ? this.Content[pos] : this.Content[pos].GetFirstElement();
        return first;
    },
    Undo: function (Data) {
        var type = Data.Type;
        switch (type) {
        case historyitem_Math_AddItem:
            this.Content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);
            if (null !== this.ParaMath) {
                this.ParaMath.SetNeedResize();
            }
            break;
        case historyitem_Math_RemoveItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            if (null !== this.ParaMath) {
                this.ParaMath.SetNeedResize();
            }
            break;
        }
    },
    Redo: function (Data) {
        var type = Data.Type;
        switch (type) {
        case historyitem_Math_AddItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            if (null !== this.ParaMath) {
                this.ParaMath.SetNeedResize();
            }
            break;
        case historyitem_Math_RemoveItem:
            this.Content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);
            if (null !== this.ParaMath) {
                this.ParaMath.SetNeedResize();
            }
            break;
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_MathContent);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Math_AddItem:
            var Count = Data.Items.length;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                Writer.WriteLong(Data.Pos + Index);
                Writer.WriteString2(Data.Items[Index].Get_Id());
            }
            break;
        case historyitem_Math_RemoveItem:
            var Count = Data.Items.length;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                Writer.WriteLong(Data.Pos);
            }
            break;
        }
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_MathContent != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Math_AddItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = Reader.GetLong();
                var Element = g_oTableId.Get_ById(Reader.GetString2());
                if (null != Element) {
                    this.Content.splice(Pos, 0, Element);
                }
            }
            this.private_SetNeedResize();
            break;
        case historyitem_Math_RemoveItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var ChangesPos = Reader.GetLong();
                this.Content.splice(ChangesPos, 1);
            }
            this.private_SetNeedResize();
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_MathContent);
        Writer.WriteString2(this.Id);
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
    },
    Refresh_RecalcData: function () {
        if (this.ParaMath !== null) {
            this.ParaMath.Refresh_RecalcData();
        }
    },
    Insert_MathContent: function (oMathContent, Pos, bSelect) {
        if (null === this.ParaMath || null === this.ParaMath.Paragraph) {
            bSelect = false;
        }
        if (undefined === Pos) {
            Pos = this.CurPos;
        }
        var nCount = oMathContent.Content.length;
        for (var nIndex = 0; nIndex < nCount; nIndex++) {
            this.Internal_Content_Add(Pos + nIndex, oMathContent.Content[nIndex], false);
            if (true === bSelect) {
                oMathContent.Content[nIndex].Select_All();
            }
        }
        if (null !== this.ParaMath) {
            this.ParaMath.SetNeedResize();
        }
        this.CurPos = Pos + nCount;
        if (true === bSelect) {
            this.Selection.Use = true;
            this.Selection.Start = Pos;
            this.Selection.End = Pos + nCount - 1;
            if (!this.bRoot) {
                this.ParentElement.Select_MathContent(this);
            } else {
                this.ParaMath.bSelectionUse = true;
            }
            this.ParaMath.Paragraph.Select_Math(this.ParaMath);
        }
        this.Correct_Content(true);
        this.Correct_ContentPos(-1);
    }
};
CMathContent.prototype.Set_Paragraph = ParaHyperlink.prototype.Set_Paragraph;
CMathContent.prototype.Get_ElementByPos = ParaHyperlink.prototype.Get_ElementByPos;
CMathContent.prototype.Set_ParaMath = function (ParaMath, Parent) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    for (var Index = 0, Count = this.Content.length; Index < Count; Index++) {
        this.Content[Index].Set_ParaMath(ParaMath, this);
    }
};
CMathContent.prototype.Load_FromMenu = function (Type, Paragraph) {
    this.Paragraph = Paragraph;
    var Pr = {
        ctrPrp: new CTextPr()
    };
    var MainType = Type >> 24;
    if (MainType === c_oAscMathMainType.Symbol) {
        this.private_LoadFromMenuSymbol(Type, Pr);
    } else {
        if (MainType === c_oAscMathMainType.Fraction) {
            this.private_LoadFromMenuFraction(Type, Pr);
        } else {
            if (MainType === c_oAscMathMainType.Script) {
                this.private_LoadFromMenuScript(Type, Pr);
            } else {
                if (MainType === c_oAscMathMainType.Radical) {
                    this.private_LoadFromMenuRadical(Type, Pr);
                } else {
                    if (MainType === c_oAscMathMainType.Integral) {
                        this.private_LoadFromMenuIntegral(Type, Pr);
                    } else {
                        if (MainType === c_oAscMathMainType.LargeOperator) {
                            this.private_LoadFromMenuLargeOperator(Type, Pr);
                        } else {
                            if (MainType === c_oAscMathMainType.Bracket) {
                                this.private_LoadFromMenuBracket(Type, Pr);
                            } else {
                                if (MainType === c_oAscMathMainType.Function) {
                                    this.private_LoadFromMenuFunction(Type, Pr);
                                } else {
                                    if (MainType === c_oAscMathMainType.Accent) {
                                        this.private_LoadFromMenuAccent(Type, Pr);
                                    } else {
                                        if (MainType === c_oAscMathMainType.LimitLog) {
                                            this.private_LoadFromMenuLimitLog(Type, Pr);
                                        } else {
                                            if (MainType === c_oAscMathMainType.Operator) {
                                                this.private_LoadFromMenuOperator(Type, Pr);
                                            } else {
                                                if (MainType === c_oAscMathMainType.Matrix) {
                                                    this.private_LoadFromMenuMatrix(Type, Pr);
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
CMathContent.prototype.private_LoadFromMenuSymbol = function (Type, Pr) {
    var Code = -1;
    switch (Type) {
    case c_oAscMathType.Symbol_pm:
        Code = 177;
        break;
    case c_oAscMathType.Symbol_infinity:
        Code = 8734;
        break;
    case c_oAscMathType.Symbol_equals:
        Code = 61;
        break;
    case c_oAscMathType.Symbol_neq:
        Code = 8800;
        break;
    case c_oAscMathType.Symbol_about:
        Code = 126;
        break;
    case c_oAscMathType.Symbol_times:
        Code = 215;
        break;
    case c_oAscMathType.Symbol_div:
        Code = 247;
        break;
    case c_oAscMathType.Symbol_factorial:
        Code = 33;
        break;
    case c_oAscMathType.Symbol_propto:
        Code = 8733;
        break;
    case c_oAscMathType.Symbol_less:
        Code = 60;
        break;
    case c_oAscMathType.Symbol_ll:
        Code = 8810;
        break;
    case c_oAscMathType.Symbol_greater:
        Code = 62;
        break;
    case c_oAscMathType.Symbol_gg:
        Code = 8811;
        break;
    case c_oAscMathType.Symbol_leq:
        Code = 8804;
        break;
    case c_oAscMathType.Symbol_geq:
        Code = 8805;
        break;
    case c_oAscMathType.Symbol_mp:
        Code = 8723;
        break;
    case c_oAscMathType.Symbol_cong:
        Code = 8773;
        break;
    case c_oAscMathType.Symbol_approx:
        Code = 8776;
        break;
    case c_oAscMathType.Symbol_equiv:
        Code = 8801;
        break;
    case c_oAscMathType.Symbol_forall:
        Code = 8704;
        break;
    case c_oAscMathType.Symbol_additional:
        Code = 8705;
        break;
    case c_oAscMathType.Symbol_partial:
        Code = 120597;
        break;
    case c_oAscMathType.Symbol_sqrt:
        this.Add_Radical(Pr, null, null);
        break;
    case c_oAscMathType.Symbol_cbrt:
        this.Add_Radical({
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_RADICAL
        },
        null, "3");
        break;
    case c_oAscMathType.Symbol_qdrt:
        this.Add_Radical({
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_RADICAL
        },
        null, "4");
        break;
    case c_oAscMathType.Symbol_cup:
        Code = 8746;
        break;
    case c_oAscMathType.Symbol_cap:
        Code = 8745;
        break;
    case c_oAscMathType.Symbol_emptyset:
        Code = 8709;
        break;
    case c_oAscMathType.Symbol_percent:
        Code = 37;
        break;
    case c_oAscMathType.Symbol_degree:
        Code = 176;
        break;
    case c_oAscMathType.Symbol_fahrenheit:
        Code = 8457;
        break;
    case c_oAscMathType.Symbol_celsius:
        Code = 8451;
        break;
    case c_oAscMathType.Symbol_inc:
        Code = 8710;
        break;
    case c_oAscMathType.Symbol_nabla:
        Code = 8711;
        break;
    case c_oAscMathType.Symbol_exists:
        Code = 8707;
        break;
    case c_oAscMathType.Symbol_notexists:
        Code = 8708;
        break;
    case c_oAscMathType.Symbol_in:
        Code = 8712;
        break;
    case c_oAscMathType.Symbol_ni:
        Code = 8715;
        break;
    case c_oAscMathType.Symbol_leftarrow:
        Code = 8592;
        break;
    case c_oAscMathType.Symbol_uparrow:
        Code = 8593;
        break;
    case c_oAscMathType.Symbol_rightarrow:
        Code = 8594;
        break;
    case c_oAscMathType.Symbol_downarrow:
        Code = 8595;
        break;
    case c_oAscMathType.Symbol_leftrightarrow:
        Code = 8596;
        break;
    case c_oAscMathType.Symbol_therefore:
        Code = 8756;
        break;
    case c_oAscMathType.Symbol_plus:
        Code = 43;
        break;
    case c_oAscMathType.Symbol_minus:
        Code = 8722;
        break;
    case c_oAscMathType.Symbol_not:
        Code = 172;
        break;
    case c_oAscMathType.Symbol_ast:
        Code = 8727;
        break;
    case c_oAscMathType.Symbol_bullet:
        Code = 8729;
        break;
    case c_oAscMathType.Symbol_vdots:
        Code = 8942;
        break;
    case c_oAscMathType.Symbol_cdots:
        Code = 8943;
        break;
    case c_oAscMathType.Symbol_rddots:
        Code = 8944;
        break;
    case c_oAscMathType.Symbol_ddots:
        Code = 8945;
        break;
    case c_oAscMathType.Symbol_aleph:
        Code = 8501;
        break;
    case c_oAscMathType.Symbol_beth:
        Code = 8502;
        break;
    case c_oAscMathType.Symbol_QED:
        Code = 8718;
        break;
    case c_oAscMathType.Symbol_alpha:
        Code = 120572;
        break;
    case c_oAscMathType.Symbol_beta:
        Code = 120573;
        break;
    case c_oAscMathType.Symbol_gamma:
        Code = 120574;
        break;
    case c_oAscMathType.Symbol_delta:
        Code = 120575;
        break;
    case c_oAscMathType.Symbol_varepsilon:
        Code = 120576;
        break;
    case c_oAscMathType.Symbol_epsilon:
        Code = 120598;
        break;
    case c_oAscMathType.Symbol_zeta:
        Code = 120577;
        break;
    case c_oAscMathType.Symbol_eta:
        Code = 120578;
        break;
    case c_oAscMathType.Symbol_theta:
        Code = 120579;
        break;
    case c_oAscMathType.Symbol_vartheta:
        Code = 120599;
        break;
    case c_oAscMathType.Symbol_iota:
        Code = 120580;
        break;
    case c_oAscMathType.Symbol_kappa:
        Code = 120581;
        break;
    case c_oAscMathType.Symbol_lambda:
        Code = 120582;
        break;
    case c_oAscMathType.Symbol_mu:
        Code = 120583;
        break;
    case c_oAscMathType.Symbol_nu:
        Code = 120584;
        break;
    case c_oAscMathType.Symbol_xsi:
        Code = 120585;
        break;
    case c_oAscMathType.Symbol_o:
        Code = 120586;
        break;
    case c_oAscMathType.Symbol_pi:
        Code = 120587;
        break;
    case c_oAscMathType.Symbol_varpi:
        Code = 120603;
        break;
    case c_oAscMathType.Symbol_rho:
        Code = 120588;
        break;
    case c_oAscMathType.Symbol_varrho:
        Code = 120602;
        break;
    case c_oAscMathType.Symbol_sigma:
        Code = 120590;
        break;
    case c_oAscMathType.Symbol_varsigma:
        Code = 120589;
        break;
    case c_oAscMathType.Symbol_tau:
        Code = 120591;
        break;
    case c_oAscMathType.Symbol_upsilon:
        Code = 120592;
        break;
    case c_oAscMathType.Symbol_varphi:
        Code = 120593;
        break;
    case c_oAscMathType.Symbol_phi:
        Code = 120601;
        break;
    case c_oAscMathType.Symbol_chi:
        Code = 120594;
        break;
    case c_oAscMathType.Symbol_psi:
        Code = 120595;
        break;
    case c_oAscMathType.Symbol_omega:
        Code = 120596;
        break;
    case c_oAscMathType.Symbol_Alpha:
        Code = 913;
        break;
    case c_oAscMathType.Symbol_Beta:
        Code = 914;
        break;
    case c_oAscMathType.Symbol_Gamma:
        Code = 915;
        break;
    case c_oAscMathType.Symbol_Delta:
        Code = 916;
        break;
    case c_oAscMathType.Symbol_Epsilon:
        Code = 917;
        break;
    case c_oAscMathType.Symbol_Zeta:
        Code = 918;
        break;
    case c_oAscMathType.Symbol_Eta:
        Code = 919;
        break;
    case c_oAscMathType.Symbol_Theta:
        Code = 920;
        break;
    case c_oAscMathType.Symbol_Iota:
        Code = 921;
        break;
    case c_oAscMathType.Symbol_Kappa:
        Code = 922;
        break;
    case c_oAscMathType.Symbol_Lambda:
        Code = 923;
        break;
    case c_oAscMathType.Symbol_Mu:
        Code = 924;
        break;
    case c_oAscMathType.Symbol_Nu:
        Code = 925;
        break;
    case c_oAscMathType.Symbol_Xsi:
        Code = 926;
        break;
    case c_oAscMathType.Symbol_O:
        Code = 927;
        break;
    case c_oAscMathType.Symbol_Pi:
        Code = 928;
        break;
    case c_oAscMathType.Symbol_Rho:
        Code = 929;
        break;
    case c_oAscMathType.Symbol_Sigma:
        Code = 931;
        break;
    case c_oAscMathType.Symbol_Tau:
        Code = 932;
        break;
    case c_oAscMathType.Symbol_Upsilon:
        Code = 933;
        break;
    case c_oAscMathType.Symbol_Phi:
        Code = 934;
        break;
    case c_oAscMathType.Symbol_Chi:
        Code = 935;
        break;
    case c_oAscMathType.Symbol_Psi:
        Code = 936;
        break;
    case c_oAscMathType.Symbol_Omega:
        Code = 937;
        break;
    }
    if (-1 !== Code) {
        this.Add_Symbol(Code);
    }
};
CMathContent.prototype.private_LoadFromMenuFraction = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.FractionVertical:
        this.Add_Fraction(Pr, null, null);
        break;
    case c_oAscMathType.FractionDiagonal:
        this.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: SKEWED_FRACTION
        },
        null, null);
        break;
    case c_oAscMathType.FractionHorizontal:
        this.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: LINEAR_FRACTION
        },
        null, null);
        break;
    case c_oAscMathType.FractionSmall:
        var oBox = new CBox(Pr);
        this.Add_Element(oBox);
        var BoxMathContent = oBox.getBase();
        BoxMathContent.Add_Fraction(Pr, null, null);
        break;
    case c_oAscMathType.FractionDifferential_1:
        this.Add_Fraction(Pr, "dx", "dy");
        break;
    case c_oAscMathType.FractionDifferential_2:
        this.Add_Fraction(Pr, String.fromCharCode(916) + "y", String.fromCharCode(916) + "x");
        break;
    case c_oAscMathType.FractionDifferential_3:
        this.Add_Fraction(Pr, String.fromCharCode(8706) + "y", String.fromCharCode(8706) + "x");
        break;
    case c_oAscMathType.FractionDifferential_4:
        this.Add_Fraction(Pr, String.fromCharCode(948) + "y", String.fromCharCode(948) + "x");
        break;
    case c_oAscMathType.FractionPi_2:
        this.Add_Fraction(Pr, String.fromCharCode(960), "2");
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuScript = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.ScriptSup:
        this.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        null, null, null);
        break;
    case c_oAscMathType.ScriptSub:
        this.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUBSCRIPT
        },
        null, null, null);
        break;
    case c_oAscMathType.ScriptSubSup:
        this.Add_Script(true, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SubSup
        },
        null, null, null);
        break;
    case c_oAscMathType.ScriptSubSupLeft:
        this.Add_Script(true, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_PreSubSup
        },
        null, null, null);
        break;
    case c_oAscMathType.ScriptCustom_1:
        Pr.type = DEGREE_SUBSCRIPT;
        var Script = this.Add_Script(false, Pr, "x", null, null);
        var SubMathContent = Script.getLowerIterator();
        Pr.type = DEGREE_SUPERSCRIPT;
        SubMathContent.Add_Script(false, Pr, "y", "2", null);
        break;
    case c_oAscMathType.ScriptCustom_2:
        this.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "e", "-i" + String.fromCharCode(969) + "t", null);
        break;
    case c_oAscMathType.ScriptCustom_3:
        this.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "x", "2", null);
        break;
    case c_oAscMathType.ScriptCustom_4:
        this.Add_Script(true, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_PreSubSup
        },
        "Y", "n", "1");
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuRadical = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.RadicalSqrt:
        Pr.type = SQUARE_RADICAL;
        Pr.degHide = true;
        this.Add_Radical(Pr, null, null);
        break;
    case c_oAscMathType.RadicalRoot_n:
        Pr.type = DEGREE_RADICAL;
        this.Add_Radical(Pr, null, null);
        break;
    case c_oAscMathType.RadicalRoot_2:
        Pr.type = DEGREE_RADICAL;
        this.Add_Radical(Pr, null, "2");
        break;
    case c_oAscMathType.RadicalRoot_3:
        Pr.type = DEGREE_RADICAL;
        this.Add_Radical(Pr, null, "3");
        break;
    case c_oAscMathType.RadicalCustom_1:
        var Fraction = this.Add_Fraction(Pr, null, null);
        var NumMathContent = Fraction.getNumeratorMathContent();
        var DenMathContent = Fraction.getDenominatorMathContent();
        NumMathContent.Add_Text("-b" + String.fromCharCode(177));
        Pr.type = SQUARE_RADICAL;
        Pr.degHide = true;
        var Radical = NumMathContent.Add_Radical(Pr, null, null);
        var RadicalBaseMathContent = Radical.getBase();
        RadicalBaseMathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "b", "2", null);
        RadicalBaseMathContent.Add_Text("-4ac");
        DenMathContent.Add_Text("2a");
        break;
    case c_oAscMathType.RadicalCustom_2:
        Pr.type = SQUARE_RADICAL;
        Pr.degHide = true;
        var Radical = this.Add_Radical(Pr, null, null);
        var BaseMathContent = Radical.getBase();
        var ScriptPr = {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        };
        BaseMathContent.Add_Script(false, ScriptPr, "a", "2", null);
        BaseMathContent.Add_Text("+");
        BaseMathContent.Add_Script(false, ScriptPr, "b", "2", null);
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuIntegral = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.Integral:
        this.Add_Integral(1, false, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralSubSup:
        this.Add_Integral(1, false, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralCenterSubSup:
        this.Add_Integral(1, false, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralDouble:
        this.Add_Integral(2, false, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralDoubleSubSup:
        this.Add_Integral(2, false, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralDoubleCenterSubSup:
        this.Add_Integral(2, false, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralTriple:
        this.Add_Integral(3, false, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralTripleSubSup:
        this.Add_Integral(3, false, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralTripleCenterSubSup:
        this.Add_Integral(3, false, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOriented:
        this.Add_Integral(1, true, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedSubSup:
        this.Add_Integral(1, true, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedCenterSubSup:
        this.Add_Integral(1, true, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedDouble:
        this.Add_Integral(2, true, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedDoubleSubSup:
        this.Add_Integral(2, true, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedDoubleCenterSubSup:
        this.Add_Integral(2, true, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedTriple:
        this.Add_Integral(3, true, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedTripleSubSup:
        this.Add_Integral(3, true, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.IntegralOrientedTripleCenterSubSup:
        this.Add_Integral(3, true, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.Integral_dx:
        Pr.diff = 1;
        this.Add_Box(Pr, "dx");
        break;
    case c_oAscMathType.Integral_dy:
        Pr.diff = 1;
        this.Add_Box(Pr, "dy");
        break;
    case c_oAscMathType.Integral_dtheta:
        Pr.diff = 1;
        this.Add_Box(Pr, "d" + String.fromCharCode(952));
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuLargeOperator = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.LargeOperator_Sum:
        this.Add_LargeOperator(1, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Sum_CenterSubSup:
        this.Add_LargeOperator(1, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Sum_SubSup:
        this.Add_LargeOperator(1, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Sum_CenterSub:
        this.Add_LargeOperator(1, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Sum_Sub:
        this.Add_LargeOperator(1, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Prod:
        this.Add_LargeOperator(2, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Prod_CenterSubSup:
        this.Add_LargeOperator(2, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Prod_SubSup:
        this.Add_LargeOperator(2, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Prod_CenterSub:
        this.Add_LargeOperator(2, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Prod_Sub:
        this.Add_LargeOperator(2, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_CoProd:
        this.Add_LargeOperator(3, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_CoProd_CenterSubSup:
        this.Add_LargeOperator(3, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_CoProd_SubSup:
        this.Add_LargeOperator(3, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_CoProd_CenterSub:
        this.Add_LargeOperator(3, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_CoProd_Sub:
        this.Add_LargeOperator(3, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Union:
        this.Add_LargeOperator(4, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Union_CenterSubSup:
        this.Add_LargeOperator(4, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Union_SubSup:
        this.Add_LargeOperator(4, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Union_CenterSub:
        this.Add_LargeOperator(4, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Union_Sub:
        this.Add_LargeOperator(4, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Intersection:
        this.Add_LargeOperator(5, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Intersection_CenterSubSup:
        this.Add_LargeOperator(5, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Intersection_SubSup:
        this.Add_LargeOperator(5, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Intersection_CenterSub:
        this.Add_LargeOperator(5, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Intersection_Sub:
        this.Add_LargeOperator(5, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Disjunction:
        this.Add_LargeOperator(6, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Disjunction_CenterSubSup:
        this.Add_LargeOperator(6, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Disjunction_SubSup:
        this.Add_LargeOperator(6, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Disjunction_CenterSub:
        this.Add_LargeOperator(6, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Disjunction_Sub:
        this.Add_LargeOperator(6, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Conjunction:
        this.Add_LargeOperator(7, NARY_UndOvr, true, true, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Conjunction_CenterSubSup:
        this.Add_LargeOperator(7, NARY_UndOvr, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Conjunction_SubSup:
        this.Add_LargeOperator(7, NARY_SubSup, false, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Conjunction_CenterSub:
        this.Add_LargeOperator(7, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Conjunction_Sub:
        this.Add_LargeOperator(7, NARY_SubSup, true, false, Pr.ctrPrp, null, null, null);
        break;
    case c_oAscMathType.LargeOperator_Custom_1:
        var Sum = this.Add_LargeOperator(1, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, "k");
        var BaseMathContent = Sum.getBaseMathContent();
        var Delimiter = BaseMathContent.Add_Delimiter({
            ctrPrp: Pr.ctrPrp,
            column: 1
        },
        1, [null]);
        var DelimiterMathContent = Delimiter.getElementMathContent(0);
        DelimiterMathContent.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: NO_BAR_FRACTION
        },
        "n", "k");
        break;
    case c_oAscMathType.LargeOperator_Custom_2:
        this.Add_LargeOperator(1, NARY_UndOvr, false, false, Pr.ctrPrp, null, "n", "i=0");
        break;
    case c_oAscMathType.LargeOperator_Custom_3:
        var Sum = this.Add_LargeOperator(1, NARY_UndOvr, true, false, Pr.ctrPrp, null, null, null);
        var SubMathContent = Sum.getSubMathContent();
        SubMathContent.Add_EqArray({
            ctrPrp: Pr.ctrPrp,
            row: 2
        },
        2, ["0≤ i ≤ m", "0< j < n"]);
        var BaseMathContent = Sum.getBaseMathContent();
        BaseMathContent.Add_Text("P");
        BaseMathContent.Add_Delimiter({
            ctrPrp: Pr.ctrPrp,
            column: 1
        },
        1, ["i, j"]);
        break;
    case c_oAscMathType.LargeOperator_Custom_4:
        var Prod = this.Add_LargeOperator(2, NARY_UndOvr, false, false, Pr.ctrPrp, null, "n", "k=1");
        var BaseMathContent = Prod.getBaseMathContent();
        BaseMathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUBSCRIPT
        },
        "A", null, "k");
        break;
    case c_oAscMathType.LargeOperator_Custom_5:
        var Union = this.Add_LargeOperator(4, NARY_UndOvr, false, false, Pr.ctrPrp, null, "m", "n=1");
        var BaseMathContent = Union.getBaseMathContent();
        var Delimiter = BaseMathContent.Add_Delimiter({
            ctrPrp: Pr.ctrPrp,
            column: 1
        },
        1, [null]);
        BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUBSCRIPT
        },
        "X", null, "n");
        BaseMathContent.Add_Text(String.fromCharCode(8898));
        BaseMathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUBSCRIPT
        },
        "Y", null, "n");
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuBracket = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.Bracket_Round:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], null, null);
        break;
    case c_oAscMathType.Bracket_Square:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 91, 93);
        break;
    case c_oAscMathType.Bracket_Curve:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 123, 125);
        break;
    case c_oAscMathType.Bracket_Angle:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 10216, 10217);
        break;
    case c_oAscMathType.Bracket_LowLim:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 8970, 8971);
        break;
    case c_oAscMathType.Bracket_UppLim:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 8968, 8969);
        break;
    case c_oAscMathType.Bracket_Line:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 124, 124);
        break;
    case c_oAscMathType.Bracket_LineDouble:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 8214, 8214);
        break;
    case c_oAscMathType.Bracket_Square_OpenOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 91, 91);
        break;
    case c_oAscMathType.Bracket_Square_CloseClose:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 93, 93);
        break;
    case c_oAscMathType.Bracket_Square_CloseOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 93, 91);
        break;
    case c_oAscMathType.Bracket_SquareDouble:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 10214, 10215);
        break;
    case c_oAscMathType.Bracket_Round_Delimiter_2:
        this.Add_DelimiterEx(Pr.ctrPrp, 2, [null, null], null, null);
        break;
    case c_oAscMathType.Bracket_Curve_Delimiter_2:
        this.Add_DelimiterEx(Pr.ctrPrp, 2, [null, null], 123, 125);
        break;
    case c_oAscMathType.Bracket_Angle_Delimiter_2:
        this.Add_DelimiterEx(Pr.ctrPrp, 2, [null, null], 10216, 10217);
        break;
    case c_oAscMathType.Bracket_Angle_Delimiter_3:
        this.Add_DelimiterEx(Pr.ctrPrp, 3, [null, null, null], 10216, 10217);
        break;
    case c_oAscMathType.Bracket_Round_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], null, -1);
        break;
    case c_oAscMathType.Bracket_Round_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, null);
        break;
    case c_oAscMathType.Bracket_Square_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 91, -1);
        break;
    case c_oAscMathType.Bracket_Square_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 93);
        break;
    case c_oAscMathType.Bracket_Curve_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 123, -1);
        break;
    case c_oAscMathType.Bracket_Curve_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 125);
        break;
    case c_oAscMathType.Bracket_Angle_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 10216, -1);
        break;
    case c_oAscMathType.Bracket_Angle_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 10217);
        break;
    case c_oAscMathType.Bracket_LowLim_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 8970, -1);
        break;
    case c_oAscMathType.Bracket_LowLim_NoneNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 8971);
        break;
    case c_oAscMathType.Bracket_UppLim_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 8968, -1);
        break;
    case c_oAscMathType.Bracket_UppLim_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 8969);
        break;
    case c_oAscMathType.Bracket_Line_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 124, -1);
        break;
    case c_oAscMathType.Bracket_Line_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 124);
        break;
    case c_oAscMathType.Bracket_LineDouble_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 8214, -1);
        break;
    case c_oAscMathType.Bracket_LineDouble_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 8214);
        break;
    case c_oAscMathType.Bracket_SquareDouble_OpenNone:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 10214, -1);
        break;
    case c_oAscMathType.Bracket_SquareDouble_NoneOpen:
        this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], -1, 10215);
        break;
    case c_oAscMathType.Bracket_Custom_1:
        var Delimiter = this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 123, -1);
        var BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_EqArray({
            ctrPrp: Pr.ctrPrp,
            row: 2
        },
        2, [null, null]);
        break;
    case c_oAscMathType.Bracket_Custom_2:
        var Delimiter = this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 123, -1);
        var BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_EqArray({
            ctrPrp: Pr.ctrPrp,
            row: 3
        },
        3, [null, null, null]);
        break;
    case c_oAscMathType.Bracket_Custom_3:
        this.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: NO_BAR_FRACTION
        },
        null, null);
        break;
    case c_oAscMathType.Bracket_Custom_4:
        var Delimiter = this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], null, null);
        var BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: NO_BAR_FRACTION
        },
        null, null);
        break;
    case c_oAscMathType.Bracket_Custom_5:
        this.Add_Text("f");
        this.Add_DelimiterEx(Pr.ctrPrp, 1, ["x"], null, null);
        this.Add_Text("=");
        var Delimiter = this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 123, -1);
        var BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_EqArray({
            ctrPrp: Pr.ctrPrp,
            row: 2
        },
        2, ["-x,  &x<0", "x,  &x" + String.fromCharCode(8805) + "0"]);
        break;
    case c_oAscMathType.Bracket_Custom_6:
        var Delimiter = this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], null, null);
        var BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: NO_BAR_FRACTION
        },
        "n", "k");
        break;
    case c_oAscMathType.Bracket_Custom_7:
        var Delimiter = this.Add_DelimiterEx(Pr.ctrPrp, 1, [null], 10216, 10217);
        var BaseMathContent = Delimiter.getElementMathContent(0);
        BaseMathContent.Add_Fraction({
            ctrPrp: Pr.ctrPrp,
            type: NO_BAR_FRACTION
        },
        "n", "k");
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuFunction = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.Function_Sin:
        this.Add_Function(Pr, "sin", null);
        break;
    case c_oAscMathType.Function_Cos:
        this.Add_Function(Pr, "cos", null);
        break;
    case c_oAscMathType.Function_Tan:
        this.Add_Function(Pr, "tan", null);
        break;
    case c_oAscMathType.Function_Csc:
        this.Add_Function(Pr, "csc", null);
        break;
    case c_oAscMathType.Function_Sec:
        this.Add_Function(Pr, "sec", null);
        break;
    case c_oAscMathType.Function_Cot:
        this.Add_Function(Pr, "cot", null);
        break;
    case c_oAscMathType.Function_1_Sin:
        this.Add_Function_1(Pr, "sin", null);
        break;
    case c_oAscMathType.Function_1_Cos:
        this.Add_Function_1(Pr, "cos", null);
        break;
    case c_oAscMathType.Function_1_Tan:
        this.Add_Function_1(Pr, "tan", null);
        break;
    case c_oAscMathType.Function_1_Csc:
        this.Add_Function_1(Pr, "csc", null);
        break;
    case c_oAscMathType.Function_1_Sec:
        this.Add_Function_1(Pr, "sec", null);
        break;
    case c_oAscMathType.Function_1_Cot:
        this.Add_Function_1(Pr, "cot", null);
        break;
    case c_oAscMathType.Function_Sinh:
        this.Add_Function(Pr, "sinh", null);
        break;
    case c_oAscMathType.Function_Cosh:
        this.Add_Function(Pr, "cosh", null);
        break;
    case c_oAscMathType.Function_Tanh:
        this.Add_Function(Pr, "tanh", null);
        break;
    case c_oAscMathType.Function_Csch:
        this.Add_Function(Pr, "csch", null);
        break;
    case c_oAscMathType.Function_Sech:
        this.Add_Function(Pr, "sech", null);
        break;
    case c_oAscMathType.Function_Coth:
        this.Add_Function(Pr, "coth", null);
        break;
    case c_oAscMathType.Function_1_Sinh:
        this.Add_Function_1(Pr, "sinh", null);
        break;
    case c_oAscMathType.Function_1_Cosh:
        this.Add_Function_1(Pr, "cosh", null);
        break;
    case c_oAscMathType.Function_1_Tanh:
        this.Add_Function_1(Pr, "tanh", null);
        break;
    case c_oAscMathType.Function_1_Csch:
        this.Add_Function_1(Pr, "csch", null);
        break;
    case c_oAscMathType.Function_1_Sech:
        this.Add_Function_1(Pr, "sech", null);
        break;
    case c_oAscMathType.Function_1_Coth:
        this.Add_Function_1(Pr, "coth", null);
        break;
    case c_oAscMathType.Function_Custom_1:
        this.Add_Function(Pr, "sin", String.fromCharCode(952));
        break;
    case c_oAscMathType.Function_Custom_2:
        this.Add_Function(Pr, "cos", "2x");
        break;
    case c_oAscMathType.Function_Custom_3:
        var Theta = String.fromCharCode(952);
        this.Add_Function(Pr, "tan", Theta);
        this.Add_Text("=");
        var Fraction = this.Add_Fraction(Pr, null, null);
        var NumMathContent = Fraction.getNumeratorMathContent();
        var DenMathContent = Fraction.getDenominatorMathContent();
        NumMathContent.Add_Function(Pr, "sin", Theta);
        DenMathContent.Add_Function(Pr, "cos", Theta);
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuAccent = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.Accent_Dot:
        this.Add_Accent(Pr.ctrPrp, 775, null);
        break;
    case c_oAscMathType.Accent_DDot:
        this.Add_Accent(Pr.ctrPrp, 776, null);
        break;
    case c_oAscMathType.Accent_DDDot:
        this.Add_Accent(Pr.ctrPrp, 8411, null);
        break;
    case c_oAscMathType.Accent_Hat:
        this.Add_Accent(Pr.ctrPrp, null, null);
        break;
    case c_oAscMathType.Accent_Check:
        this.Add_Accent(Pr.ctrPrp, 780, null);
        break;
    case c_oAscMathType.Accent_Accent:
        this.Add_Accent(Pr.ctrPrp, 769, null);
        break;
    case c_oAscMathType.Accent_Grave:
        this.Add_Accent(Pr.ctrPrp, 768, null);
        break;
    case c_oAscMathType.Accent_Smile:
        this.Add_Accent(Pr.ctrPrp, 774, null);
        break;
    case c_oAscMathType.Accent_Tilde:
        this.Add_Accent(Pr.ctrPrp, 771, null);
        break;
    case c_oAscMathType.Accent_Bar:
        this.Add_Accent(Pr.ctrPrp, 773, null);
        break;
    case c_oAscMathType.Accent_DoubleBar:
        this.Add_Accent(Pr.ctrPrp, 831, null);
        break;
    case c_oAscMathType.Accent_CurveBracketTop:
        this.Add_GroupCharacter({
            ctrPrp: Pr.ctrPrp,
            chr: 9182,
            pos: VJUST_TOP,
            vertJc: VJUST_BOT
        },
        null);
        break;
    case c_oAscMathType.Accent_CurveBracketBot:
        this.Add_GroupCharacter({
            ctrPrp: Pr.ctrPrp
        },
        null);
        break;
    case c_oAscMathType.Accent_GroupTop:
        var Limit = this.Add_Limit({
            ctrPrp: Pr.ctrPrp,
            type: LIMIT_UP
        },
        null, null);
        var MathContent = Limit.getFName();
        MathContent.Add_GroupCharacter({
            ctrPrp: Pr.ctrPrp,
            chr: 9182,
            pos: VJUST_TOP,
            vertJc: VJUST_BOT
        },
        null);
        break;
    case c_oAscMathType.Accent_GroupBot:
        var Limit = this.Add_Limit({
            ctrPrp: Pr.ctrPrp,
            type: LIMIT_LOW
        },
        null, null);
        var MathContent = Limit.getFName();
        MathContent.Add_GroupCharacter({
            ctrPrp: Pr.ctrPrp
        },
        null);
        break;
    case c_oAscMathType.Accent_ArrowL:
        this.Add_Accent(Pr.ctrPrp, 8406, null);
        break;
    case c_oAscMathType.Accent_ArrowR:
        this.Add_Accent(Pr.ctrPrp, 8407, null);
        break;
    case c_oAscMathType.Accent_ArrowD:
        this.Add_Accent(Pr.ctrPrp, 8417, null);
        break;
    case c_oAscMathType.Accent_HarpoonL:
        this.Add_Accent(Pr.ctrPrp, 8400, null);
        break;
    case c_oAscMathType.Accent_HarpoonR:
        this.Add_Accent(Pr.ctrPrp, 8401, null);
        break;
    case c_oAscMathType.Accent_BorderBox:
        this.Add_BorderBox(Pr, null);
        break;
    case c_oAscMathType.Accent_BorderBoxCustom:
        var BorderBox = this.Add_BorderBox(Pr, null);
        var MathContent = BorderBox.getBase();
        MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "a", "2", null);
        MathContent.Add_Text("=");
        MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "b", "2", null);
        MathContent.Add_Text("+");
        MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "c", "2", null);
        break;
    case c_oAscMathType.Accent_BarTop:
        this.Add_Bar({
            ctrPrp: Pr.ctrPrp,
            pos: LOCATION_TOP
        },
        null);
        break;
    case c_oAscMathType.Accent_BarBot:
        this.Add_Bar({
            ctrPrp: Pr.ctrPrp,
            pos: LOCATION_BOT
        },
        null);
        break;
    case c_oAscMathType.Accent_Custom_1:
        this.Add_Bar({
            ctrPrp: Pr.ctrPrp,
            pos: LOCATION_TOP
        },
        "A");
        break;
    case c_oAscMathType.Accent_Custom_2:
        this.Add_Bar({
            ctrPrp: Pr.ctrPrp,
            pos: LOCATION_TOP
        },
        "ABC");
        break;
    case c_oAscMathType.Accent_Custom_3:
        this.Add_Bar({
            ctrPrp: Pr.ctrPrp,
            pos: LOCATION_TOP
        },
        "x" + String.fromCharCode(8853) + "y");
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuLimitLog = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.LimitLog_LogBase:
        var Function = this.Add_Function(Pr, null, null);
        var MathContent = Function.getFName();
        var Script = MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUBSCRIPT
        },
        null, null, null);
        MathContent = Script.getBase();
        MathContent.Add_Text("log", STY_PLAIN);
        break;
    case c_oAscMathType.LimitLog_Log:
        this.Add_Function(Pr, "log", null);
        break;
    case c_oAscMathType.LimitLog_Lim:
        this.Add_FunctionWithLimit(Pr, "lim", null, null);
        break;
    case c_oAscMathType.LimitLog_Min:
        this.Add_FunctionWithLimit(Pr, "min", null, null);
        break;
    case c_oAscMathType.LimitLog_Max:
        this.Add_FunctionWithLimit(Pr, "max", null, null);
        break;
    case c_oAscMathType.LimitLog_Ln:
        this.Add_Function(Pr, "ln", null);
        break;
    case c_oAscMathType.LimitLog_Custom_1:
        var Function = this.Add_FunctionWithLimit(Pr, "lim", "n" + String.fromCharCode(8594, 8734), null);
        var MathContent = Function.getArgument();
        var Script = MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        null, "n", null);
        MathContent = Script.getBase();
        var Delimiter = MathContent.Add_Delimiter({
            ctrPrp: Pr.ctrPrp,
            column: 1
        },
        1, [null]);
        MathContent = Delimiter.getElementMathContent(0);
        MathContent.Add_Text("1+");
        MathContent.Add_Fraction({
            ctrPrp: Pr.ctrPrp
        },
        "1", "n");
        break;
    case c_oAscMathType.LimitLog_Custom_2:
        var Function = this.Add_FunctionWithLimit(Pr, "max", "0" + String.fromCharCode(8804) + "x" + String.fromCharCode(8804) + "1", null);
        var MathContent = Function.getArgument();
        MathContent.Add_Text("x");
        var Script = MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "e", null, null);
        MathContent = Script.getUpperIterator();
        MathContent.Add_Text("-");
        MathContent.Add_Script(false, {
            ctrPrp: Pr.ctrPrp,
            type: DEGREE_SUPERSCRIPT
        },
        "x", "2", null);
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuOperator = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.Operator_ColonEquals:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        String.fromCharCode(8788));
        break;
    case c_oAscMathType.Operator_EqualsEquals:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        "==");
        break;
    case c_oAscMathType.Operator_PlusEquals:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        "+=");
        break;
    case c_oAscMathType.Operator_MinusEquals:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        "-=");
        break;
    case c_oAscMathType.Operator_Definition:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        String.fromCharCode(8797));
        break;
    case c_oAscMathType.Operator_UnitOfMeasure:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        String.fromCharCode(8798));
        break;
    case c_oAscMathType.Operator_DeltaEquals:
        this.Add_Box({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        String.fromCharCode(8796));
        break;
    case c_oAscMathType.Operator_ArrowL_Top:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_TOP, 8592, null);
        break;
    case c_oAscMathType.Operator_ArrowR_Top:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_TOP, 8594, null);
        break;
    case c_oAscMathType.Operator_ArrowL_Bot:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8592, null);
        break;
    case c_oAscMathType.Operator_ArrowR_Bot:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8594, null);
        break;
    case c_oAscMathType.Operator_DoubleArrowL_Top:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_TOP, 8656, null);
        break;
    case c_oAscMathType.Operator_DoubleArrowR_Top:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_TOP, 8658, null);
        break;
    case c_oAscMathType.Operator_DoubleArrowL_Bot:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8656, null);
        break;
    case c_oAscMathType.Operator_DoubleArrowR_Bot:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8658, null);
        break;
    case c_oAscMathType.Operator_ArrowD_Top:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_TOP, 8596, null);
        break;
    case c_oAscMathType.Operator_ArrowD_Bot:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8596, null);
        break;
    case c_oAscMathType.Operator_DoubleArrowD_Top:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_TOP, 8660, null);
        break;
    case c_oAscMathType.Operator_DoubleArrowD_Bot:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8660, null);
        break;
    case c_oAscMathType.Operator_Custom_1:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8594, "yields");
        break;
    case c_oAscMathType.Operator_Custom_2:
        this.Add_BoxWithGroupChar({
            ctrPrp: Pr.ctrPrp,
            opEmu: 1
        },
        VJUST_BOT, 8594, String.fromCharCode(8710));
        break;
    }
};
CMathContent.prototype.private_LoadFromMenuMatrix = function (Type, Pr) {
    switch (Type) {
    case c_oAscMathType.Matrix_1_2:
        this.Add_Matrix(Pr.ctrPrp, 1, 2, false, []);
        break;
    case c_oAscMathType.Matrix_2_1:
        this.Add_Matrix(Pr.ctrPrp, 2, 1, false, []);
        break;
    case c_oAscMathType.Matrix_1_3:
        this.Add_Matrix(Pr.ctrPrp, 1, 3, false, []);
        break;
    case c_oAscMathType.Matrix_3_1:
        this.Add_Matrix(Pr.ctrPrp, 3, 1, false, []);
        break;
    case c_oAscMathType.Matrix_2_2:
        this.Add_Matrix(Pr.ctrPrp, 2, 2, false, []);
        break;
    case c_oAscMathType.Matrix_2_3:
        this.Add_Matrix(Pr.ctrPrp, 2, 3, false, []);
        break;
    case c_oAscMathType.Matrix_3_2:
        this.Add_Matrix(Pr.ctrPrp, 3, 2, false, []);
        break;
    case c_oAscMathType.Matrix_3_3:
        this.Add_Matrix(Pr.ctrPrp, 3, 3, false, []);
        break;
    case c_oAscMathType.Matrix_Dots_Center:
        this.Add_Text(String.fromCharCode(8943));
        break;
    case c_oAscMathType.Matrix_Dots_Baseline:
        this.Add_Text(String.fromCharCode(8230));
        break;
    case c_oAscMathType.Matrix_Dots_Vertical:
        this.Add_Text(String.fromCharCode(8942));
        break;
    case c_oAscMathType.Matrix_Dots_Diagonal:
        this.Add_Text(String.fromCharCode(8945));
        break;
    case c_oAscMathType.Matrix_Identity_2:
        this.Add_Matrix(Pr.ctrPrp, 2, 2, false, ["1", "0", "0", "1"]);
        break;
    case c_oAscMathType.Matrix_Identity_2_NoZeros:
        this.Add_Matrix(Pr.ctrPrp, 2, 2, true, ["1", null, null, "1"]);
        break;
    case c_oAscMathType.Matrix_Identity_3:
        this.Add_Matrix(Pr.ctrPrp, 3, 3, false, ["1", "0", "0", "0", "1", "0", "0", "0", "1"]);
        break;
    case c_oAscMathType.Matrix_Identity_3_NoZeros:
        this.Add_Matrix(Pr.ctrPrp, 3, 3, true, ["1", null, null, null, "1", null, null, null, "1"]);
        break;
    case c_oAscMathType.Matrix_2_2_RoundBracket:
        this.Add_MatrixWithBrackets(null, null, Pr.ctrPrp, 2, 2, false, []);
        break;
    case c_oAscMathType.Matrix_2_2_SquareBracket:
        this.Add_MatrixWithBrackets(91, 93, Pr.ctrPrp, 2, 2, false, []);
        break;
    case c_oAscMathType.Matrix_2_2_LineBracket:
        this.Add_MatrixWithBrackets(124, 124, Pr.ctrPrp, 2, 2, false, []);
        break;
    case c_oAscMathType.Matrix_2_2_DLineBracket:
        this.Add_MatrixWithBrackets(8214, 8214, Pr.ctrPrp, 2, 2, false, []);
        break;
    case c_oAscMathType.Matrix_Flat_Round:
        this.Add_MatrixWithBrackets(null, null, Pr.ctrPrp, 3, 3, false, [null, String.fromCharCode(8943), null, String.fromCharCode(8942), String.fromCharCode(8945), String.fromCharCode(8942), null, String.fromCharCode(8943), null]);
        break;
    case c_oAscMathType.Matrix_Flat_Square:
        this.Add_MatrixWithBrackets(91, 93, Pr.ctrPrp, 3, 3, false, [null, String.fromCharCode(8943), null, String.fromCharCode(8942), String.fromCharCode(8945), String.fromCharCode(8942), null, String.fromCharCode(8943), null]);
        break;
    }
};
CMathContent.prototype.Add_Element = function (Element) {
    this.Internal_Content_Add(this.CurPos, Element, false);
    this.CurPos++;
};
CMathContent.prototype.Add_Text = function (sText, MathStyle) {
    if (sText) {
        var MathRun = new ParaRun(this.Paragraph, true);
        for (var nCharPos = 0, nTextLen = sText.length; nCharPos < nTextLen; nCharPos++) {
            var oText = null;
            if (38 == sText.charCodeAt(nCharPos)) {
                oText = new CMathAmp();
            } else {
                oText = new CMathText(false);
                oText.addTxt(sText[nCharPos]);
            }
            MathRun.Add(oText, true);
        }
        MathRun.Set_RFont_ForMathRun();
        if (undefined !== MathStyle && null !== MathStyle) {
            MathRun.Math_Apply_Style(MathStyle);
        }
        this.Internal_Content_Add(this.CurPos, MathRun, false);
        this.CurPos++;
    }
};
CMathContent.prototype.Add_Symbol = function (Code) {
    var MathRun = new ParaRun(this.Paragraph, true);
    var Symbol = new CMathText(false);
    Symbol.add(Code);
    MathRun.Add(Symbol, true);
    this.Internal_Content_Add(this.CurPos, MathRun, false);
    this.CurPos++;
};
CMathContent.prototype.Add_Fraction = function (Pr, NumText, DenText) {
    var Fraction = new CFraction(Pr);
    this.Add_Element(Fraction);
    var DenMathContent = Fraction.getDenominatorMathContent();
    DenMathContent.Add_Text(DenText);
    var NumMathContent = Fraction.getNumeratorMathContent();
    NumMathContent.Add_Text(NumText);
    return Fraction;
};
CMathContent.prototype.Add_Script = function (bSubSup, Pr, BaseText, SupText, SubText) {
    var Script = null;
    if (bSubSup) {
        Script = new CDegreeSubSup(Pr);
    } else {
        Script = new CDegree(Pr);
    }
    this.Add_Element(Script);
    var MathContent = Script.getBase();
    MathContent.Add_Text(BaseText);
    MathContent = Script.getUpperIterator();
    MathContent.Add_Text(SupText);
    MathContent = Script.getLowerIterator();
    MathContent.Add_Text(SubText);
    return Script;
};
CMathContent.prototype.Add_Radical = function (Pr, BaseText, DegreeText) {
    var Radical = new CRadical(Pr);
    this.Add_Element(Radical);
    var MathContent = Radical.getBase();
    MathContent.Add_Text(BaseText);
    MathContent = Radical.getDegree();
    MathContent.Add_Text(DegreeText);
    return Radical;
};
CMathContent.prototype.Add_NAry = function (Pr, BaseText, SupText, SubText) {
    var NAry = new CNary(Pr);
    this.Add_Element(NAry);
    var MathContent = NAry.getBase();
    MathContent.Add_Text(BaseText);
    MathContent = NAry.getSubMathContent();
    MathContent.Add_Text(SubText);
    MathContent = NAry.getSupMathContent();
    MathContent.Add_Text(SupText);
    return NAry;
};
CMathContent.prototype.Add_Integral = function (Dim, bOriented, limLoc, supHide, subHide, ctrPr, BaseText, SupText, SubText) {
    var Pr = {
        ctrPrp: ctrPr
    };
    if (null !== limLoc) {
        Pr.limLoc = limLoc;
    }
    if (null !== supHide) {
        Pr.supHide = supHide;
    }
    if (null !== subHide) {
        Pr.subHide = subHide;
    }
    var chr = null;
    switch (Dim) {
    case 3:
        chr = (bOriented ? 8752 : 8749);
        break;
    case 2:
        chr = (bOriented ? 8751 : 8748);
        break;
    default:
        case 1:
        chr = (bOriented ? 8750 : null);
        break;
    }
    if (null !== chr) {
        Pr.chr = chr;
    }
    return this.Add_NAry(Pr, BaseText, SupText, SubText);
};
CMathContent.prototype.Add_LargeOperator = function (Type, limLoc, supHide, subHide, ctrPr, BaseText, SupText, SubText) {
    var Pr = {
        ctrPrp: ctrPr
    };
    if (null !== limLoc) {
        Pr.limLoc = limLoc;
    }
    if (null !== supHide) {
        Pr.supHide = supHide;
    }
    if (null !== subHide) {
        Pr.subHide = subHide;
    }
    var chr = null;
    switch (Type) {
    default:
        case 1:
        chr = 8721;
        break;
    case 2:
        chr = 8719;
        break;
    case 3:
        chr = 8720;
        break;
    case 4:
        chr = 8899;
        break;
    case 5:
        chr = 8898;
        break;
    case 6:
        chr = 8897;
        break;
    case 7:
        chr = 8896;
        break;
    }
    if (null !== chr) {
        Pr.chr = chr;
    }
    return this.Add_NAry(Pr, BaseText, SupText, SubText);
};
CMathContent.prototype.Add_Delimiter = function (Pr, Count, aText) {
    var Del = new CDelimiter(Pr);
    this.Add_Element(Del);
    for (var Index = 0; Index < Count; Index++) {
        var MathContent = Del.getElementMathContent(Index);
        MathContent.Add_Text(aText[Index]);
    }
    return Del;
};
CMathContent.prototype.Add_DelimiterEx = function (ctrPr, Count, aText, begChr, endChr) {
    var Pr = {
        ctrPrp: ctrPr,
        column: Count,
        begChr: begChr,
        endChr: endChr
    };
    return this.Add_Delimiter(Pr, Count, aText);
};
CMathContent.prototype.Add_EqArray = function (Pr, Count, aText) {
    var EqArray = new CEqArray(Pr);
    this.Add_Element(EqArray);
    for (var Index = 0; Index < Count; Index++) {
        var MathContent = EqArray.getElementMathContent(Index);
        MathContent.Add_Text(aText[Index]);
    }
    return EqArray;
};
CMathContent.prototype.Add_Box = function (Pr, BaseText) {
    var Box = new CBox(Pr);
    this.Add_Element(Box);
    var MathContent = Box.getBase();
    MathContent.Add_Text(BaseText);
    return Box;
};
CMathContent.prototype.Add_BoxWithGroupChar = function (BoxPr, GroupPos, GroupChr, BaseText) {
    var Box = this.Add_Box(BoxPr, null);
    var MathContent = Box.getBase();
    if (GroupPos === VJUST_TOP) {
        MathContent.Add_GroupCharacter({
            ctrPrp: BoxPr.ctrPrp,
            pos: GroupPos,
            chr: GroupChr
        },
        BaseText);
    } else {
        MathContent.Add_GroupCharacter({
            ctrPrp: BoxPr.ctrPrp,
            vertJc: GroupPos,
            chr: GroupChr
        },
        BaseText);
    }
    return Box;
};
CMathContent.prototype.Add_BorderBox = function (Pr, BaseText) {
    var Box = new CBorderBox(Pr);
    this.Add_Element(Box);
    var MathContent = Box.getBase();
    MathContent.Add_Text(BaseText);
    return Box;
};
CMathContent.prototype.Add_Bar = function (Pr, BaseText) {
    var Bar = new CBar(Pr);
    this.Add_Element(Bar);
    var MathContent = Bar.getBase();
    MathContent.Add_Text(BaseText);
    return Bar;
};
CMathContent.prototype.Add_Function = function (Pr, FName, BaseText) {
    var MathFunc = new CMathFunc(Pr);
    this.Add_Element(MathFunc);
    var MathContent = MathFunc.getFName();
    MathContent.Add_Text(FName, STY_PLAIN);
    MathContent = MathFunc.getArgument();
    MathContent.Add_Text(BaseText);
    return MathFunc;
};
CMathContent.prototype.Add_Function_1 = function (Pr, FName, BaseText) {
    var MathFunc = new CMathFunc(Pr);
    this.Add_Element(MathFunc);
    var MathContent = MathFunc.getFName();
    var Script = MathContent.Add_Script(false, {
        ctrPrp: Pr.ctrPrp,
        type: DEGREE_SUPERSCRIPT
    },
    null, "-1", null);
    MathContent = Script.getBase();
    MathContent.Add_Text(FName, STY_PLAIN);
    MathContent = MathFunc.getArgument();
    MathContent.Add_Text(BaseText);
    return MathFunc;
};
CMathContent.prototype.Add_FunctionWithLimit = function (Pr, FName, LimitText, BaseText) {
    var MathFunc = new CMathFunc(Pr);
    this.Add_Element(MathFunc);
    var MathContent = MathFunc.getFName();
    var Limit = MathContent.Add_Limit({
        ctrPrp: Pr.ctrPrp,
        type: LIMIT_LOW
    },
    null, LimitText);
    MathContent = Limit.getFName();
    MathContent.Add_Text(FName, STY_PLAIN);
    MathContent = MathFunc.getArgument();
    MathContent.Add_Text(BaseText);
    return MathFunc;
};
CMathContent.prototype.Add_Accent = function (ctrPr, chr, BaseText) {
    var Pr = {
        ctrPrp: ctrPr,
        chr: chr
    };
    var Accent = new CAccent(Pr);
    this.Add_Element(Accent);
    var MathContent = Accent.getBase();
    MathContent.Add_Text(BaseText);
    return Accent;
};
CMathContent.prototype.Add_GroupCharacter = function (Pr, BaseText) {
    var Group = new CGroupCharacter(Pr);
    this.Add_Element(Group);
    var MathContent = Group.getBase();
    MathContent.Add_Text(BaseText);
    return Group;
};
CMathContent.prototype.Add_Limit = function (Pr, BaseText, LimitText) {
    var Limit = new CLimit(Pr);
    this.Add_Element(Limit);
    var MathContent = Limit.getFName();
    MathContent.Add_Text(BaseText);
    MathContent = Limit.getIterator();
    MathContent.Add_Text(LimitText);
    return Limit;
};
CMathContent.prototype.Add_Matrix = function (ctrPr, RowsCount, ColsCount, plcHide, aText) {
    var Pr = {
        ctrPrp: ctrPr,
        row: RowsCount,
        mcs: [{
            count: ColsCount,
            mcJc: MCJC_CENTER
        }],
        plcHide: plcHide
    };
    var Matrix = new CMathMatrix(Pr);
    this.Add_Element(Matrix);
    for (var RowIndex = 0; RowIndex < RowsCount; RowIndex++) {
        for (var ColIndex = 0; ColIndex < ColsCount; ColIndex++) {
            var MathContent = Matrix.getContentElement(RowIndex, ColIndex);
            MathContent.Add_Text(aText[RowIndex * ColsCount + ColIndex]);
        }
    }
    return Matrix;
};
CMathContent.prototype.Add_MatrixWithBrackets = function (begChr, endChr, ctrPr, RowsCount, ColsCount, plcHide, aText) {
    var Delimiter = this.Add_DelimiterEx(ctrPr, 1, [null], begChr, endChr);
    var MathContent = Delimiter.getElementMathContent(0);
    return MathContent.Add_Matrix(ctrPr, RowsCount, ColsCount, plcHide, aText);
};
CMathContent.prototype.Recalculate_Reset = function (StartRange, StartLine) {
    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++) {
        this.Content[nPos].Recalculate_Reset(StartRange, StartLine);
    }
};
CMathContent.prototype.Get_Bounds = function () {
    var X = 0,
    Y = 0,
    W = 0,
    H = 0;
    if (null !== this.ParaMath) {
        X = this.ParaMath.X + this.pos.x;
        Y = this.ParaMath.Y + this.pos.y;
        W = this.size.width;
        H = this.size.height;
    }
    return {
        X: X,
        Y: Y,
        W: W,
        H: H
    };
};
CMathContent.prototype.Recalculate_CurPos = function (_X, _Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget) {
    var X = this.pos.x + this.ParaMath.X;
    var Y = this.pos.y + this.ParaMath.Y + this.size.ascent;
    if (this.RecalcInfo.bEqqArray) {
        for (var nPos = 0; nPos < this.CurPos; nPos++) {
            if (para_Math_Run === this.Content[nPos].Type) {
                X = this.Content[nPos].Recalculate_CurPos(X, Y, false, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget).X;
            } else {
                X += this.Content[nPos].size.width;
            }
        }
    } else {
        X += this.WidthToElement[this.CurPos];
    }
    return this.Content[this.CurPos].Recalculate_CurPos(X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
};
CMathContent.prototype.Get_ParaContentPosByXY = function (SearchPos, Depth, _CurLine, _CurRange, StepEnd) {
    var nLength = this.Content.length;
    if (nLength <= 0) {
        return false;
    }
    var bResult = false;
    for (var nPos = 0; nPos < nLength; nPos++) {
        var CurX = SearchPos.CurX;
        if (true === this.Content[nPos].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd)) {
            SearchPos.Pos.Update2(nPos, Depth);
            bResult = true;
        }
        SearchPos.CurX = CurX + this.Content[nPos].size.width;
    }
    return bResult;
};
CMathContent.prototype.Get_ParaContentPos = function (bSelection, bStart, ContentPos) {
    var nPos = (true !== bSelection ? this.CurPos : (false !== bStart ? this.Selection.Start : this.Selection.End));
    ContentPos.Add(nPos);
    if (undefined !== this.Content[nPos]) {
        this.Content[nPos].Get_ParaContentPos(bSelection, bStart, ContentPos);
    }
};
CMathContent.prototype.Set_ParaContentPos = function (ContentPos, Depth) {
    var CurPos = ContentPos.Get(Depth);
    if (undefined === CurPos || CurPos < 0) {
        this.CurPos = 0;
        this.Content[this.CurPos].Cursor_MoveToStartPos();
    } else {
        if (CurPos > this.Content.length - 1) {
            this.CurPos = this.Content.length - 1;
            this.Content[this.CurPos].Cursor_MoveToEndPos(false);
        } else {
            this.CurPos = ContentPos.Get(Depth);
            this.Content[this.CurPos].Set_ParaContentPos(ContentPos, Depth + 1);
        }
    }
};
CMathContent.prototype.Set_SelectionContentPos = function (StartContentPos, EndContentPos, Depth, StartFlag, EndFlag) {
    var OldStartPos = this.Selection.Start;
    var OldEndPos = this.Selection.End;
    if (OldStartPos > OldEndPos) {
        OldStartPos = this.Selection.End;
        OldEndPos = this.Selection.Start;
    }
    OldStartPos = Math.min(this.Content.length - 1, Math.max(0, OldStartPos));
    OldEndPos = Math.min(this.Content.length - 1, Math.max(0, OldEndPos));
    var StartPos = 0;
    switch (StartFlag) {
    case 1:
        StartPos = 0;
        break;
    case -1:
        StartPos = this.Content.length - 1;
        break;
    case 0:
        StartPos = StartContentPos.Get(Depth);
        break;
    }
    var EndPos = 0;
    switch (EndFlag) {
    case 1:
        EndPos = 0;
        break;
    case -1:
        EndPos = this.Content.length - 1;
        break;
    case 0:
        EndPos = EndContentPos.Get(Depth);
        break;
    }
    if (OldStartPos < StartPos && OldStartPos < EndPos) {
        var TempLimit = Math.min(StartPos, EndPos);
        for (var CurPos = OldStartPos; CurPos < TempLimit; CurPos++) {
            this.Content[CurPos].Selection_Remove();
        }
    }
    if (OldEndPos > StartPos && OldEndPos > EndPos) {
        var TempLimit = Math.max(StartPos, EndPos);
        for (var CurPos = TempLimit + 1; CurPos <= OldEndPos; CurPos++) {
            this.Content[CurPos].Selection_Remove();
        }
    }
    this.Selection.Use = true;
    this.Selection.Start = StartPos;
    this.Selection.End = EndPos;
    if (StartPos !== EndPos) {
        this.Content[StartPos].Set_SelectionContentPos(StartContentPos, null, Depth + 1, StartFlag, StartPos > EndPos ? 1 : -1);
        this.Content[EndPos].Set_SelectionContentPos(null, EndContentPos, Depth + 1, StartPos > EndPos ? -1 : 1, EndFlag);
        var _StartPos = StartPos;
        var _EndPos = EndPos;
        var Direction = 1;
        if (_StartPos > _EndPos) {
            _StartPos = EndPos;
            _EndPos = StartPos;
            Direction = -1;
        }
        for (var CurPos = _StartPos + 1; CurPos < _EndPos; CurPos++) {
            this.Content[CurPos].Select_All(Direction);
        }
    } else {
        this.Content[StartPos].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth + 1, StartFlag, EndFlag);
    }
};
CMathContent.prototype.Selection_IsEmpty = function () {
    if (true !== this.Selection.Use) {
        return true;
    }
    if (this.Selection.Start === this.Selection.End) {
        return this.Content[this.Selection.Start].Selection_IsEmpty();
    }
    return false;
};
CMathContent.prototype.GetSelectContent = function () {
    if (false === this.Selection.Use) {
        if (para_Math_Composition === this.Content[this.CurPos].Type) {
            return this.Content[this.CurPos].GetSelectContent();
        } else {
            return {
                Content: this,
                Start: this.CurPos,
                End: this.CurPos
            };
        }
    } else {
        var StartPos = this.Selection.Start;
        var EndPos = this.Selection.End;
        if (StartPos > EndPos) {
            StartPos = this.Selection.End;
            EndPos = this.Selection.Start;
        }
        if (StartPos === EndPos && para_Math_Composition === this.Content[StartPos].Type && true === this.Content[StartPos].Is_InnerSelection()) {
            return this.Content[StartPos].GetSelectContent();
        }
        return {
            Content: this,
            Start: StartPos,
            End: EndPos
        };
    }
};
CMathContent.prototype.Get_LeftPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    if (true !== this.ParentElement.Is_ContentUse(this)) {
        return false;
    }
    if (false === UseContentPos && para_Math_Run === this.Content[this.Content.length - 1].Type) {
        var CurPos = this.Content.length - 1;
        this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        return true;
    }
    var CurPos = UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1;
    var bStepStart = false;
    if (CurPos > 0 || !this.Content[0].Cursor_Is_Start()) {
        bStepStart = true;
    }
    this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
    SearchPos.Pos.Update(CurPos, Depth);
    if (true === SearchPos.Found) {
        return true;
    }
    CurPos--;
    if (true === UseContentPos && para_Math_Composition === this.Content[CurPos + 1].Type) {
        this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        return true;
    }
    while (CurPos >= 0) {
        this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, false);
        SearchPos.Pos.Update(CurPos, Depth);
        if (true === SearchPos.Found) {
            return true;
        }
        CurPos--;
    }
    if (true === bStepStart) {
        this.Content[0].Get_StartPos(SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(0, Depth);
        SearchPos.Found = true;
        return true;
    }
    return false;
};
CMathContent.prototype.Get_RightPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    if (true !== this.ParentElement.Is_ContentUse(this)) {
        return false;
    }
    if (false === UseContentPos && para_Math_Run === this.Content[0].Type) {
        this.Content[0].Get_StartPos(SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(0, Depth);
        SearchPos.Found = true;
        return true;
    }
    var CurPos = true === UseContentPos ? ContentPos.Get(Depth) : 0;
    var Count = this.Content.length;
    var bStepEnd = false;
    if (CurPos < Count - 1 || !this.Content[Count - 1].Cursor_Is_End()) {
        bStepEnd = true;
    }
    this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);
    SearchPos.Pos.Update(CurPos, Depth);
    if (true === SearchPos.Found) {
        return true;
    }
    CurPos++;
    if (true === UseContentPos && para_Math_Composition === this.Content[CurPos - 1].Type) {
        this.Content[CurPos].Get_StartPos(SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        return true;
    }
    while (CurPos < Count) {
        this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
        SearchPos.Pos.Update(CurPos, Depth);
        if (true === SearchPos.Found) {
            return true;
        }
        CurPos++;
    }
    if (true === bStepEnd) {
        this.Content[Count - 1].Get_EndPos(false, SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(Count - 1, Depth);
        SearchPos.Found = true;
        return true;
    }
    return false;
};
CMathContent.prototype.Get_WordStartPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    if (true !== this.ParentElement.Is_ContentUse(this)) {
        return false;
    }
    if (false === UseContentPos && para_Math_Run === this.Content[this.Content.length - 1].Type) {
        var CurPos = this.Content.length - 1;
        this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
        return true;
    }
    var CurPos = true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1;
    var bStepStart = false;
    if (CurPos > 0 || !this.Content[0].Cursor_Is_Start()) {
        bStepStart = true;
    }
    this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
    if (true === SearchPos.UpdatePos) {
        SearchPos.Pos.Update(CurPos, Depth);
    }
    if (true === SearchPos.Found) {
        return;
    }
    CurPos--;
    var bStepStartRun = false;
    if (true === UseContentPos && para_Math_Composition === this.Content[CurPos + 1].Type) {
        this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
        return true;
    } else {
        if (para_Math_Run === this.Content[CurPos + 1].Type && true === SearchPos.Shift) {
            bStepStartRun = true;
        }
    }
    while (CurPos >= 0) {
        if (true !== bStepStartRun || para_Math_Run === this.Content[CurPos].Type) {
            var OldUpdatePos = SearchPos.UpdatePos;
            this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, false);
            if (true === SearchPos.UpdatePos) {
                SearchPos.Pos.Update(CurPos, Depth);
            } else {
                SearchPos.UpdatePos = OldUpdatePos;
            }
            if (true === SearchPos.Found) {
                return;
            }
            if (true === SearchPos.Shift) {
                bStepStartRun = true;
            }
        } else {
            this.Content[CurPos + 1].Get_StartPos(SearchPos.Pos, Depth + 1);
            SearchPos.Pos.Update(CurPos + 1, Depth);
            SearchPos.Found = true;
            SearchPos.UpdatePos = true;
            return true;
        }
        CurPos--;
    }
    if (true === bStepStart) {
        this.Content[0].Get_StartPos(SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(0, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
        return true;
    }
};
CMathContent.prototype.Get_WordEndPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    if (true !== this.ParentElement.Is_ContentUse(this)) {
        return false;
    }
    if (false === UseContentPos && para_Math_Run === this.Content[0].Type) {
        this.Content[0].Get_StartPos(SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(0, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
        return true;
    }
    var CurPos = true === UseContentPos ? ContentPos.Get(Depth) : 0;
    var Count = this.Content.length;
    var bStepEnd = false;
    if (CurPos < Count - 1 || !this.Content[Count - 1].Cursor_Is_End()) {
        bStepEnd = true;
    }
    this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);
    if (true === SearchPos.UpdatePos) {
        SearchPos.Pos.Update(CurPos, Depth);
    }
    if (true === SearchPos.Found) {
        return;
    }
    CurPos++;
    var bStepEndRun = false;
    if (true === UseContentPos && para_Math_Composition === this.Content[CurPos - 1].Type) {
        this.Content[CurPos].Get_StartPos(SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
        return true;
    } else {
        if (para_Math_Run === this.Content[CurPos - 1].Type && true === SearchPos.Shift) {
            bStepEndRun = true;
        }
    }
    while (CurPos < Count) {
        if (true !== bStepEndRun || para_Math_Run === this.Content[CurPos].Type) {
            var OldUpdatePos = SearchPos.UpdatePos;
            this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
            if (true === SearchPos.UpdatePos) {
                SearchPos.Pos.Update(CurPos, Depth);
            } else {
                SearchPos.UpdatePos = OldUpdatePos;
            }
            if (true === SearchPos.Found) {
                return;
            }
            if (true === SearchPos.Shift) {
                bStepEndRun = true;
            }
        } else {
            this.Content[CurPos - 1].Get_EndPos(false, SearchPos.Pos, Depth + 1);
            SearchPos.Pos.Update(CurPos - 1, Depth);
            SearchPos.Found = true;
            SearchPos.UpdatePos = true;
            return true;
        }
        CurPos++;
    }
    if (true === bStepEnd) {
        this.Content[Count - 1].Get_EndPos(false, SearchPos.Pos, Depth + 1);
        SearchPos.Pos.Update(Count - 1, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
        return true;
    }
};
CMathContent.prototype.Get_StartPos = function (ContentPos, Depth) {
    ContentPos.Update(0, Depth);
    this.Content[0].Get_StartPos(ContentPos, Depth + 1);
};
CMathContent.prototype.Get_EndPos = function (BehindEnd, ContentPos, Depth) {
    var nLastPos = this.Content.length - 1;
    ContentPos.Update(nLastPos, Depth);
    if (undefined !== this.Content[nLastPos]) {
        this.Content[nLastPos].Get_EndPos(BehindEnd, ContentPos, Depth + 1);
    }
};
CMathContent.prototype.Draw_HighLights = function (PDSH, bAll) {
    PDSH.X = this.ParaMath.X + this.pos.x;
    var len = this.Content.length;
    var H = 0;
    var Y0 = PDSH.Y0,
    Y1 = PDSH.Y1;
    var FirstRootRunNotShd = this.bRoot && this.Content.length > 0 && !this.Content[0].IsShade();
    if (FirstRootRunNotShd || !this.bRoot) {
        Y0 = this.ParaMath.Y + this.pos.y;
        Y1 = this.ParaMath.Y + this.pos.y + this.size.height;
    }
    for (var CurPos = 0; CurPos < len; CurPos++) {
        PDSH.Y0 = Y0;
        PDSH.Y1 = Y1;
        if (bAll && this.Content[CurPos].Type == para_Math_Run) {
            this.Content[CurPos].Select_All();
        }
        this.Content[CurPos].Draw_HighLights(PDSH, bAll);
    }
};
CMathContent.prototype.Draw_Lines = function (PDSL) {
    var lng = this.Content.length;
    var X = PDSL.X = this.pos.x + this.ParaMath.X,
    Y = PDSL.Baseline = this.pos.y + this.ParaMath.Y + this.size.ascent;
    for (var CurPos = 0; CurPos < lng; CurPos++) {
        this.Content[CurPos].Draw_Lines(PDSL);
        PDSL.Baseline = Y;
    }
};
CMathContent.prototype.Selection_Remove = function () {
    var StartPos = this.Selection.Start;
    var EndPos = this.Selection.End;
    if (StartPos > EndPos) {
        StartPos = this.Selection.End;
        EndPos = this.Selection.Start;
    }
    StartPos = Math.max(0, StartPos);
    EndPos = Math.min(this.Content.length - 1, EndPos);
    for (var nPos = StartPos; nPos <= EndPos; nPos++) {
        this.Content[nPos].Selection_Remove();
    }
    this.Selection.Use = false;
    this.Selection.Start = 0;
    this.Selection.End = 0;
};
CMathContent.prototype.Select_All = function (Direction) {
    this.Selection.Use = true;
    this.Selection.Start = 0;
    this.Selection.End = this.Content.length - 1;
    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++) {
        this.Content[nPos].Select_All(Direction);
    }
};
CMathContent.prototype.Selection_DrawRange = function (_CurLine, _CurRange, SelectionDraw) {
    var Start = this.Selection.Start;
    var End = this.Selection.End;
    if (Start > End) {
        Start = this.Selection.End;
        End = this.Selection.Start;
    }
    SelectionDraw.StartX += this.pos.x;
    var PointsInfo = new CMathPointInfo();
    PointsInfo.SetInfoPoints(this.InfoPoints);
    var bDrawSelection = false;
    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++) {
        bDrawSelection = nPos >= Start && nPos <= End ? true : false;
        if (para_Math_Run === this.Content[nPos].Type) {
            this.Content[nPos].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw, PointsInfo);
        } else {
            if (true === bDrawSelection) {
                SelectionDraw.W += this.Content[nPos].size.width;
                SelectionDraw.FindStart = false;
            } else {
                if (true === SelectionDraw.FindStart) {
                    SelectionDraw.StartX += this.Content[nPos].size.width;
                }
            }
        }
    }
    if (true !== this.bRoot) {
        SelectionDraw.StartY = this.ParaMath.Y + this.pos.y;
        SelectionDraw.H = this.size.height;
    }
};
CMathContent.prototype.Select_ElementByPos = function (nPos, bWhole) {
    this.Selection.Use = true;
    this.Selection.Start = nPos;
    this.Selection.End = nPos;
    this.Content[nPos].Select_All();
    if (bWhole) {
        this.Correct_Selection();
    }
    if (!this.bRoot) {
        this.ParentElement.Select_MathContent(this);
    } else {
        this.ParaMath.bSelectionUse = true;
    }
};
CMathContent.prototype.Select_Element = function (Element, bWhole) {
    var nPos = -1;
    for (var nCurPos = 0, nCount = this.Content.length; nCurPos < nCount; nCurPos++) {
        if (this.Content[nCurPos] === Element) {
            nPos = nCurPos;
            break;
        }
    }
    if (-1 !== nPos) {
        this.Selection.Use = true;
        this.Selection.Start = nPos;
        this.Selection.End = nPos;
        if (bWhole) {
            this.Correct_Selection();
        }
        if (!this.bRoot) {
            this.ParentElement.Select_MathContent(this);
        } else {
            this.ParaMath.bSelectionUse = true;
        }
    }
};
CMathContent.prototype.Correct_Selection = function () {
    if (true !== this.Selection.Use) {
        return;
    }
    var nContentLen = this.Content.length;
    var nStartPos = Math.max(0, Math.min(this.Selection.Start, nContentLen - 1));
    var nEndPos = Math.max(0, Math.min(this.Selection.End, nContentLen - 1));
    if (nStartPos > nEndPos) {
        var nTemp = nStartPos;
        nStartPos = nEndPos;
        nEndPos = nTemp;
    }
    var oStartElement = this.Content[nStartPos];
    if (para_Math_Run !== oStartElement.Type) {
        this.Selection.Start = nStartPos - 1;
        this.Content[this.Selection.Start].Set_SelectionAtEndPos();
    }
    var oEndElement = this.Content[nEndPos];
    if (para_Math_Run !== oEndElement.Type) {
        this.Selection.End = nEndPos + 1;
        this.Content[this.Selection.End].Set_SelectionAtStartPos();
    }
};
CMathContent.prototype.Create_FontMap = function (Map) {
    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++) {
        this.Content[nIndex].Create_FontMap(Map, this.Compiled_ArgSz);
    }
};
CMathContent.prototype.Get_AllFontNames = function (AllFonts) {
    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++) {
        this.Content[nIndex].Get_AllFontNames(AllFonts);
    }
};
CMathContent.prototype.Selection_CheckParaContentPos = function (ContentPos, Depth, bStart, bEnd) {
    var CurPos = ContentPos.Get(Depth);
    if (this.Selection.Start <= CurPos && CurPos <= this.Selection.End) {
        return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, Depth + 1, bStart && this.Selection.Start === CurPos, bEnd && CurPos === this.Selection.End);
    } else {
        if (this.Selection.End <= CurPos && CurPos <= this.Selection.Start) {
            return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, Depth + 1, bStart && this.Selection.End === CurPos, bEnd && CurPos === this.Selection.Start);
        }
    }
    return false;
};
CMathContent.prototype.Check_NearestPos = function (ParaNearPos, Depth) {
    var HyperNearPos = new CParagraphElementNearPos();
    HyperNearPos.NearPos = ParaNearPos.NearPos;
    HyperNearPos.Depth = Depth;
    this.NearPosArray.push(HyperNearPos);
    ParaNearPos.Classes.push(this);
    var CurPos = ParaNearPos.NearPos.ContentPos.Get(Depth);
    this.Content[CurPos].Check_NearestPos(ParaNearPos, Depth + 1);
};
CMathContent.prototype.private_SetNeedResize = function () {
    if (null !== this.ParaMath) {
        this.ParaMath.SetNeedResize();
    }
};
CMathContent.prototype.Is_CheckingNearestPos = ParaHyperlink.prototype.Is_CheckingNearestPos;
CMathContent.prototype.Search = ParaHyperlink.prototype.Search;
CMathContent.prototype.Add_SearchResult = ParaHyperlink.prototype.Add_SearchResult;
CMathContent.prototype.Clear_SearchResults = ParaHyperlink.prototype.Clear_SearchResults;
CMathContent.prototype.Remove_SearchResult = ParaHyperlink.prototype.Remove_SearchResult;
CMathContent.prototype.Search_GetId = ParaHyperlink.prototype.Search_GetId;
CMathContent.prototype.Recalc_RunsCompiledPr = ParaHyperlink.prototype.Recalc_RunsCompiledPr;
CMathContent.prototype.Get_SelectionDirection = function () {
    if (true !== this.Selection.Use) {
        return 0;
    }
    if (this.Selection.Start < this.Selection.End) {
        return 1;
    } else {
        if (this.Selection.Start > this.Selection.End) {
            return -1;
        }
    }
    return this.Content[this.Selection.Start].Get_SelectionDirection();
};
CMathContent.prototype.Cursor_MoveToStartPos = function () {
    this.CurPos = 0;
    this.Content[0].Cursor_MoveToStartPos();
};
CMathContent.prototype.Cursor_MoveToEndPos = function (SelectFromEnd) {
    this.CurPos = this.Content.length - 1;
    this.Content[this.CurPos].Cursor_MoveToEndPos(SelectFromEnd);
};
CMathContent.prototype.Process_AutoCorrect = function (ActionElement) {
    if (false === this.private_NeedAutoCorrect(ActionElement)) {
        return;
    }
    var AutoCorrectEngine = new CMathAutoCorrectEngine(ActionElement);
    var nCount = this.Content.length;
    for (var nPos = 0; nPos < nCount; nPos++) {
        var Element = this.Content[nPos];
        if (para_Math_Run === Element.Type) {
            Element.Get_TextForAutoCorrect(AutoCorrectEngine, nPos);
        } else {
            AutoCorrectEngine.Add_Element(Element, nPos);
        }
        if (false === AutoCorrectEngine.CollectText) {
            break;
        }
    }
    if (null == AutoCorrectEngine.TextPr) {
        AutoCorrectEngine.TextPr = new CTextPr();
    }
    if (null == AutoCorrectEngine.MathPr) {
        AutoCorrectEngine.MathPr = new CMPrp();
    }
    History.Create_NewPoint(historydescription_Document_MathAutoCorrect);
    var bCursorStepRight = false;
    var CanMakeAutoCorrect = this.private_CanAutoCorrectText(AutoCorrectEngine, false);
    if (false === CanMakeAutoCorrect) {
        if (32 === ActionElement.value) {
            CanMakeAutoCorrect = this.private_CanAutoCorrectText(AutoCorrectEngine, true);
        } else {
            AutoCorrectEngine.Elements.splice(AutoCorrectEngine.Elements.length - 1, 1);
            CanMakeAutoCorrect = this.private_CanAutoCorrectText(AutoCorrectEngine, false);
            bCursorStepRight = true;
        }
    }
    if (false === CanMakeAutoCorrect) {
        CanMakeAutoCorrect = this.private_CanAutoCorrectEquation(AutoCorrectEngine);
    }
    if (true === CanMakeAutoCorrect) {
        var ElementsCount = AutoCorrectEngine.Elements.length;
        var LastElement = null;
        var FirstElement = AutoCorrectEngine.Elements[ElementsCount - 1];
        var FirstElementPos = FirstElement.ElementPos;
        FirstElement.Pos++;
        for (var nPos = 0, nCount = AutoCorrectEngine.RemoveCount; nPos < nCount; nPos++) {
            LastElement = AutoCorrectEngine.Elements[ElementsCount - nPos - 1];
            if (undefined !== LastElement.Run) {
                if (FirstElement.Run === LastElement.Run) {
                    FirstElement.Pos--;
                }
                LastElement.Run.Remove_FromContent(LastElement.Pos, 1);
            } else {
                this.Remove_FromContent(LastElement.ElementPos, 1);
                FirstElementPos--;
            }
        }
        var NewRun = FirstElement.Run.Split2(FirstElement.Pos);
        this.Internal_Content_Add(FirstElementPos + 1, NewRun, false);
        var NewElementsCount = AutoCorrectEngine.ReplaceContent.length;
        for (var nPos = 0; nPos < NewElementsCount; nPos++) {
            this.Internal_Content_Add(nPos + FirstElementPos + 1, AutoCorrectEngine.ReplaceContent[nPos], false);
        }
        this.CurPos = FirstElementPos + NewElementsCount + 1;
        this.Content[this.CurPos].Cursor_MoveToStartPos();
        if (true === bCursorStepRight) {
            if (this.Content[this.CurPos].Content.length >= 1) {
                this.Content[this.CurPos].State.ContentPos = 1;
            }
        }
    } else {
        History.Remove_LastPoint();
    }
};
CMathContent.prototype.private_NeedAutoCorrect = function (ActionElement) {
    var CharCode = ActionElement.value;
    if (1 === g_aMathAutoCorrectTriggerCharCodes[CharCode]) {
        return true;
    }
    return false;
};
CMathContent.prototype.private_CanAutoCorrectText = function (AutoCorrectionEngine, bSkipLast) {
    var IndexAdd = (true === bSkipLast ? 1 : 0);
    var ElementsCount = AutoCorrectionEngine.Elements.length;
    if (ElementsCount < 2 + IndexAdd) {
        return false;
    }
    var Result = false;
    var RemoveCount = 0;
    var ReplaceChars = [32];
    var AutoCorrectCount = g_aAutoCorrectMathSymbols.length;
    for (var nIndex = 0; nIndex < AutoCorrectCount; nIndex++) {
        var AutoCorrectElement = g_aAutoCorrectMathSymbols[nIndex];
        var CheckString = AutoCorrectElement[0];
        var CheckStringLen = CheckString.length;
        if (ElementsCount < CheckStringLen) {
            continue;
        }
        var Found = true;
        for (var nStringPos = 0; nStringPos < CheckStringLen; nStringPos++) {
            var LastElement = AutoCorrectionEngine.Elements[ElementsCount - nStringPos - 1 - IndexAdd];
            if (undefined === LastElement.Text || LastElement.Text !== CheckString.charAt(CheckStringLen - nStringPos - 1)) {
                Found = false;
                break;
            }
        }
        if (true === Found) {
            RemoveCount = CheckStringLen + IndexAdd;
            if (undefined === AutoCorrectElement[1].length) {
                ReplaceChars[0] = AutoCorrectElement[1];
            } else {
                for (var Index = 0, Len = AutoCorrectElement[1].length; Index < Len; Index++) {
                    ReplaceChars[Index] = AutoCorrectElement[1][Index];
                }
            }
        }
    }
    if (RemoveCount > 0) {
        var MathRun = new ParaRun(this.ParaMath.Paragraph, true);
        MathRun.Set_Pr(AutoCorrectionEngine.TextPr.Copy());
        MathRun.Set_MathPr(AutoCorrectionEngine.MathPr.Copy());
        for (var Index = 0, Count = ReplaceChars.length; Index < Count; Index++) {
            var ReplaceText = new CMathText();
            ReplaceText.add(ReplaceChars[Index]);
            MathRun.Add(ReplaceText, true);
        }
        AutoCorrectionEngine.RemoveCount = RemoveCount;
        AutoCorrectionEngine.ReplaceContent.push(MathRun);
        Result = true;
    }
    return Result;
};
CMathContent.prototype.private_CanAutoCorrectEquation = function (AutoCorrectionEngine) {
    var ElementsCount = AutoCorrectionEngine.Elements.length;
    if (ElementsCount < 2) {
        return false;
    }
    var TempElements = [];
    var CurPos = ElementsCount - 1;
    var Element = AutoCorrectionEngine.Elements[CurPos];
    if (" " === Element.Text) {
        CurPos--;
    }
    while (CurPos >= 0) {
        var Element = AutoCorrectionEngine.Elements[CurPos];
        if (undefined === Element.Text) {
            TempElements.splice(0, 0, Element);
        } else {
            if ("(" === Element.Text) {
                TempElements.splice(0, 0, Element);
            } else {
                if (")" === Element.Text) {
                    TempElements.splice(0, 0, Element);
                } else {
                    if ("/" === Element.Text) {
                        AutoCorrectionEngine.Type = MATH_FRACTION;
                        CurPos--;
                        break;
                    } else {
                        if ("^" === Element.Text) {
                            TempElements.Type = DEGREE_SUPERSCRIPT;
                            AutoCorrectionEngine.Kind = DEGREE_SUPERSCRIPT;
                            AutoCorrectionEngine.Type = MATH_DEGREE;
                            CurPos--;
                            break;
                        } else {
                            if ("_" === Element.Text) {
                                TempElements.Type = DEGREE_SUBSCRIPT;
                                AutoCorrectionEngine.Kind = DEGREE_SUBSCRIPT;
                                AutoCorrectionEngine.Type = MATH_DEGREE;
                                CurPos--;
                                break;
                            } else {
                                if (g_aMathAutoCorrectTriggerCharCodes[Element.Text.charCodeAt(0)]) {
                                    return false;
                                } else {
                                    TempElements.splice(0, 0, Element);
                                }
                            }
                        }
                    }
                }
            }
        }
        CurPos--;
    }
    var TempElements2 = [];
    while (CurPos >= 0) {
        var Element = AutoCorrectionEngine.Elements[CurPos];
        if (undefined === Element.Text) {
            TempElements2.splice(0, 0, Element);
        } else {
            if ("(" === Element.Text) {
                TempElements2.splice(0, 0, Element);
            } else {
                if (")" === Element.Text) {
                    TempElements2.splice(0, 0, Element);
                } else {
                    if ("_" === Element.Text) {
                        if (TempElements2.length == 0) {
                            break;
                        }
                        TempElements2.Type = DEGREE_SUBSCRIPT;
                        AutoCorrectionEngine.Kind = DEGREE_SubSup;
                        AutoCorrectionEngine.Type = MATH_DEGREESubSup;
                        CurPos--;
                        break;
                    } else {
                        if ("^" === Element.Text) {
                            if (TempElements2.length == 0) {
                                break;
                            }
                            TempElements2.Type = DEGREE_SUPERSCRIPT;
                            AutoCorrectionEngine.Kind = DEGREE_SubSup;
                            AutoCorrectionEngine.Type = MATH_DEGREESubSup;
                            CurPos--;
                            break;
                        } else {
                            if (g_aMathAutoCorrectTriggerCharCodes[Element.Text.charCodeAt(0)]) {
                                break;
                            } else {
                                TempElements2.splice(0, 0, Element);
                            }
                        }
                    }
                }
            }
        }
        CurPos--;
    }
    var TempElements3 = [];
    if (AutoCorrectionEngine.Type == MATH_DEGREESubSup) {
        while (CurPos >= 0) {
            var Element = AutoCorrectionEngine.Elements[CurPos];
            if (undefined === Element.Text) {
                TempElements3.splice(0, 0, Element);
            } else {
                if (g_aMathAutoCorrectTriggerCharCodes[Element.Text.charCodeAt(0)]) {
                    break;
                } else {
                    TempElements3.splice(0, 0, Element);
                }
            }
            CurPos--;
        }
    }
    if (AutoCorrectionEngine.Type == MATH_FRACTION) {
        if (TempElements2.length > 0) {
            var props = new CMathFractionPr();
            props.ctrPrp = AutoCorrectionEngine.TextPr.Copy();
            var Fraction = new CFraction(props);
            var DenMathContent = Fraction.Content[0];
            var NumMathContent = Fraction.Content[1];
            this.PackTextToContent(DenMathContent, TempElements2, AutoCorrectionEngine);
            this.PackTextToContent(NumMathContent, TempElements, AutoCorrectionEngine);
            AutoCorrectionEngine.RemoveCount = ElementsCount - CurPos - 1;
            AutoCorrectionEngine.ReplaceContent.push(Fraction);
            return true;
        }
    } else {
        if (AutoCorrectionEngine.Type == MATH_DEGREE) {
            var props = new CMathDegreePr();
            props.ctrPrp = AutoCorrectionEngine.TextPr.Copy();
            props.type = AutoCorrectionEngine.Kind;
            var oDegree = new CDegree(props);
            var BaseContent = oDegree.Content[0];
            var IterContent = oDegree.Content[1];
            this.PackTextToContent(BaseContent, TempElements2, AutoCorrectionEngine);
            this.PackTextToContent(IterContent, TempElements, AutoCorrectionEngine);
            AutoCorrectionEngine.RemoveCount = ElementsCount - CurPos - 1;
            AutoCorrectionEngine.ReplaceContent.push(oDegree);
            return true;
        } else {
            if (AutoCorrectionEngine.Type == MATH_DEGREESubSup) {
                if (TempElements2.length > 0 || TempElements3.length > 0) {
                    var props = new CMathDegreePr();
                    props.ctrPrp = AutoCorrectionEngine.TextPr.Copy();
                    props.type = AutoCorrectionEngine.Kind;
                    var oDegree = new CDegreeSubSup(props);
                    var BaseContent = oDegree.Content[0];
                    var IterUpContent = oDegree.Content[1];
                    var IterDnContent = oDegree.Content[2];
                    if (TempElements.Type == DEGREE_SUPERSCRIPT) {
                        this.PackTextToContent(IterUpContent, TempElements2, AutoCorrectionEngine);
                        this.PackTextToContent(IterDnContent, TempElements, AutoCorrectionEngine);
                    } else {
                        if (TempElements.Type == DEGREE_SUBSCRIPT) {
                            this.PackTextToContent(IterUpContent, TempElements, AutoCorrectionEngine);
                            this.PackTextToContent(IterDnContent, TempElements2, AutoCorrectionEngine);
                        }
                    }
                    this.PackTextToContent(BaseContent, TempElements3, AutoCorrectionEngine);
                    AutoCorrectionEngine.RemoveCount = ElementsCount - CurPos - 1;
                    AutoCorrectionEngine.ReplaceContent.push(oDegree);
                    return true;
                }
            }
        }
    }
    return false;
};
CMathContent.prototype.PackTextToContent = function (Element, TempElements, AutoCorrectionEngine) {
    var len = TempElements.length;
    if (len > 1) {
        if (TempElements[0].Text === "(" && TempElements[len - 1].Text === ")") {
            TempElements.splice(len - 1, 1);
            TempElements.splice(0, 1);
            len -= 2;
        }
    }
    for (var nPos = 0; nPos < len; nPos++) {
        if (undefined === TempElements[nPos].Text) {
            Element.Internal_Content_Add(nPos, TempElements[nPos].Element);
        } else {
            var MathRun = new ParaRun(this.ParaMath.Paragraph, true);
            MathRun.Set_Pr(AutoCorrectionEngine.TextPr.Copy());
            MathRun.Set_MathPr(AutoCorrectionEngine.MathPr.Copy());
            var MathText = new CMathText();
            MathText.add(TempElements[nPos].Text.charCodeAt(0));
            MathRun.Add_ToContent(nPos, MathText);
            Element.Internal_Content_Add(nPos, MathRun);
        }
    }
};
function CMathAutoCorrectEngine(Element) {
    this.ActionElement = Element;
    this.Elements = [];
    this.CollectText = true;
    this.Type = null;
    this.Kind = null;
    this.RemoveCount = 0;
    this.ReplaceContent = [];
    this.TextPr = null;
    this.MathPr = null;
}
CMathAutoCorrectEngine.prototype.Add_Element = function (Element, ElementPos) {
    this.Elements.push({
        Element: Element,
        ElementPos: ElementPos
    });
};
CMathAutoCorrectEngine.prototype.Add_Text = function (Text, Run, Pos, ElementPos) {
    this.Elements.push({
        Text: Text,
        Run: Run,
        Pos: Pos,
        ElementPos: ElementPos
    });
};
CMathAutoCorrectEngine.prototype.Get_ActionElement = function () {
    return this.ActionElement;
};
CMathAutoCorrectEngine.prototype.Stop_CollectText = function () {
    this.CollectText = false;
};
var g_aAutoCorrectMathSymbols = [["!!", 8252], ["...", 8230], ["::", 8759], [":=", 8788], ["\\above", 9524], ["\\acute", 769], ["\\aleph", 8501], ["\\alpha", 945], ["\\Alpha", 913], ["\\amalg", 8720], ["\\angle", 8736], ["\\aoint", 8755], ["\\approx", 8776], ["\\asmash", 11014], ["\\ast", 8727], ["\\asymp", 8781], ["\\atop", 166], ["\\bar", 773], ["\\Bar", 831], ["\\because", 8757], ["\\begin", 12310], ["\\below", 9516], ["\\bet", 8502], ["\\beta", 946], ["\\Beta", 914], ["\\beth", 8502], ["\\bigcap", 8898], ["\\bigcup", 8899], ["\\bigodot", 10752], ["\\bigoplus", 10753], ["\\bigotimes", 10754], ["\\bigsqcup", 10758], ["\\biguplus", 10756], ["\\bigvee", 8897], ["\\bigwedge", 8896], ["\\bot", 8869], ["\\bowtie", 8904], ["\\box", 9633], ["\\bra", 10216], ["\\breve", 774], ["\\bullet", 8729], ["\\cap", 8745], ["\\cbrt", 8731], ["\\cdot", 8901], ["\\cdots", 8943], ["\\check", 780], ["\\chi", 967], ["\\Chi", 935], ["\\circ", 8728], ["\\close", 9508], ["\\clubsuit", 9827], ["\\coint", 8754], ["\\cong", 8773], ["\\coprod", 8720], ["\\cup", 8746], ["\\dalet", 8504], ["\\daleth", 8504], ["\\dashv", 8867], ["\\dd", 8518], ["\\Dd", 8517], ["\\ddddot", 8412], ["\\dddot", 8411], ["\\ddot", 776], ["\\ddots", 8945], ["\\degree", 176], ["\\delta", 948], ["\\Delta", 916], ["\\diamond", 8900], ["\\diamondsuit", 9826], ["\\div", 247], ["\\dot", 775], ["\\doteq", 8784], ["\\dots", 8230], ["\\doublea", 120146], ["\\doubleA", 120120], ["\\doubleb", 120147], ["\\doubleB", 120121], ["\\doublec", 120148], ["\\doubleC", 8450], ["\\doubled", 120149], ["\\doubleD", 120123], ["\\doublee", 120150], ["\\doubleE", 120124], ["\\doublef", 120151], ["\\doubleF", 120125], ["\\doubleg", 120152], ["\\doubleG", 120126], ["\\doubleh", 120153], ["\\doubleH", 8461], ["\\doublei", 120154], ["\\doubleI", 120128], ["\\doublej", 120155], ["\\doubleJ", 120129], ["\\doublek", 120156], ["\\doubleK", 120130], ["\\doublel", 120157], ["\\doubleL", 120131], ["\\doublem", 120158], ["\\doubleM", 120132], ["\\doublen", 120159], ["\\doubleN", 8469], ["\\doubleo", 120160], ["\\doubleO", 120134], ["\\doublep", 120161], ["\\doubleP", 8473], ["\\doubleq", 120162], ["\\doubleQ", 8474], ["\\doubler", 120163], ["\\doubleR", 8477], ["\\doubles", 120164], ["\\doubleS", 120138], ["\\doublet", 120165], ["\\doubleT", 120139], ["\\doubleu", 120166], ["\\doubleU", 120140], ["\\doublev", 120167], ["\\doubleV", 120141], ["\\doublew", 120168], ["\\doubleW", 120142], ["\\doublex", 120169], ["\\doubleX", 120143], ["\\doubley", 120170], ["\\doubleY", 120144], ["\\doublez", 120171], ["\\doubleZ", 8484], ["\\downarrow", 8595], ["\\Downarrow", 8659], ["\\dsmash", 11015], ["\\ee", 8519], ["\\ell", 8467], ["\\emptyset", 8709], ["\\end", 12311], ["\\ensp", 8194], ["\\epsilon", 1013], ["\\Epsilon", 917], ["\\eqarray", 9608], ["\\equiv", 8801], ["\\eta", 951], ["\\Eta", 919], ["\\exists", 8707], ["\\forall", 8704], ["\\fraktura", 120094], ["\\frakturA", 120068], ["\\frakturb", 120095], ["\\frakturB", 120069], ["\\frakturc", 120096], ["\\frakturC", 8493], ["\\frakturd", 120097], ["\\frakturD", 120071], ["\\frakture", 120098], ["\\frakturE", 120072], ["\\frakturf", 120099], ["\\frakturF", 120073], ["\\frakturg", 120100], ["\\frakturG", 120074], ["\\frakturh", 120101], ["\\frakturH", 8460], ["\\frakturi", 120102], ["\\frakturI", 8465], ["\\frakturj", 120103], ["\\frakturJ", 120077], ["\\frakturk", 120104], ["\\frakturK", 120078], ["\\frakturl", 120105], ["\\frakturL", 120079], ["\\frakturm", 120106], ["\\frakturM", 120080], ["\\frakturn", 120107], ["\\frakturN", 120081], ["\\frakturo", 120108], ["\\frakturO", 120082], ["\\frakturp", 120109], ["\\frakturP", 120083], ["\\frakturq", 120110], ["\\frakturQ", 120084], ["\\frakturr", 120111], ["\\frakturR", 8476], ["\\frakturs", 120112], ["\\frakturS", 120086], ["\\frakturt", 120113], ["\\frakturT", 120087], ["\\frakturu", 120114], ["\\frakturU", 120088], ["\\frakturv", 120115], ["\\frakturV", 120089], ["\\frakturw", 120116], ["\\frakturW", 120090], ["\\frakturx", 120117], ["\\frakturX", 120091], ["\\fraktury", 120118], ["\\frakturY", 120092], ["\\frakturz", 120119], ["\\frakturZ", 8488], ["\\funcapply", 8289], ["\\gamma", 947], ["\\Gamma", 915], ["\\ge", 8805], ["\\geq", 8805], ["\\gets", 8592], ["\\gg", 8811], ["\\gimel", 8503], ["\\grave", 768], ["\\hairsp", 8202], ["\\hat", 770], ["\\hbar", 8463], ["\\heartsuit", 9825], ["\\hookleftarrow", 8617], ["\\hookrightarrow", 8618], ["\\hphantom", 11012], ["\\hvec", 8401], ["\\ii", 8520], ["\\iiint", 8749], ["\\iint", 8748], ["\\Im", 8465], ["\\in", 8712], ["\\inc", 8710], ["\\infty", 8734], ["\\int", 8747], ["\\iota", 953], ["\\Iota", 921], ["\\jj", 8521], ["\\kappa", 954], ["\\Kappa", 922], ["\\ket", 10217], ["\\lambda", 955], ["\\Lambda", 923], ["\\langle", 9001], ["\\lbrace", 123], ["\\lbrack", 91], ["\\lceil", 8968], ["\\ldiv", 8725], ["\\ldivide", 8725], ["\\ldots", 8230], ["\\le", 8804], ["\\left", 9500], ["\\leftarrow", 8592], ["\\Leftarrow", 8656], ["\\leftharpoondown", 8637], ["\\leftharpoonup", 8636], ["\\leftrightarrow", 8596], ["\\Leftrightarrow", 8660], ["\\leq", 8804], ["\\lfloor", 8970], ["\\ll", 8810], ["\\mapsto", 8614], ["\\matrix", 9632], ["\\medsp", 8287], ["\\mid", 8739], ["\\models", 8872], ["\\mp", 8723], ["\\mu", 956], ["\\Mu", 924], ["\\nabla", 8711], ["\\naryand", 9618], ["\\nbsp", 160], ["\\ne", 8800], ["\\nearrow", 8599], ["\\neq", 8800], ["\\ni", 8715], ["\\norm", 8214], ["\\notcontain", 8716], ["\\notelement", 8713], ["\\nu", 957], ["\\Nu", 925], ["\\nwarrow", 8598], ["\\o", 959], ["\\O", 927], ["\\odot", 8857], ["\\of", 9618], ["\\oiiint", 8752], ["\\oiint", 8751], ["\\oint", 8750], ["\\omega", 969], ["\\Omega", 937], ["\\ominus", 8854], ["\\open", 9500], ["\\oplus", 8853], ["\\otimes", 8855], ["\\over", 47], ["\\overbar", 175], ["\\overbrace", 9182], ["\\overparen", 9180], ["\\parallel", 8741], ["\\partial", 8706], ["\\phantom", 10209], ["\\phi", 981], ["\\Phi", 934], ["\\pi", 960], ["\\Pi", 928], ["\\pm", 177], ["\\pppprime", 8279], ["\\ppprime", 8244], ["\\pprime", 8243], ["\\prec", 8826], ["\\preceq", 8828], ["\\prime", 8242], ["\\prod", 8719], ["\\propto", 8733], ["\\psi", 968], ["\\Psi", 936], ["\\qdrt", 8732], ["\\quadratic", [120, 61, 40, 45, 98, 177, 8730, 32, 40, 98, 94, 50, 45, 52, 97, 99, 41, 41, 47, 50, 97]], ["\\rangle", 9002], ["\\ratio", 8758], ["\\rbrace", 125], ["\\rbrack", 93], ["\\rceil", 8969], ["\\rddots", 8944], ["\\Re", 8476], ["\\rect", 9645], ["\\rfloor", 8971], ["\\rho", 961], ["\\Rho", 929], ["\\right", 9508], ["\\rightarrow", 8594], ["\\Rightarrow", 8658], ["\\rightharpoondown", 8641], ["\\rightharpoonup", 8640], ["\\scripta", 119990], ["\\scriptA", 119964], ["\\scriptb", 119991], ["\\scriptB", 8492], ["\\scriptc", 119992], ["\\scriptC", 119966], ["\\scriptd", 119993], ["\\scriptD", 119967], ["\\scripte", 8495], ["\\scriptE", 8496], ["\\scriptf", 119995], ["\\scriptF", 8497], ["\\scriptg", 8458], ["\\scriptG", 119970], ["\\scripth", 119997], ["\\scriptH", 8459], ["\\scripti", 119998], ["\\scriptI", 8464], ["\\scriptj", 119999], ["\\scriptJ", 119973], ["\\scriptk", 120000], ["\\scriptK", 119974], ["\\scriptl", 8467], ["\\scriptL", 8466], ["\\scriptm", 120002], ["\\scriptM", 8499], ["\\scriptn", 120003], ["\\scriptN", 119977], ["\\scripto", 8500], ["\\scriptO", 119978], ["\\scriptp", 120005], ["\\scriptP", 119979], ["\\scriptq", 120006], ["\\scriptQ", 119980], ["\\scriptr", 120007], ["\\scriptR", 8475], ["\\scripts", 120008], ["\\scriptS", 119982], ["\\scriptt", 120009], ["\\scriptT", 119983], ["\\scriptu", 120010], ["\\scriptU", 119984], ["\\scriptv", 120011], ["\\scriptV", 119985], ["\\scriptw", 120012], ["\\scriptW", 119986], ["\\scriptx", 120013], ["\\scriptX", 119987], ["\\scripty", 120014], ["\\scriptY", 119988], ["\\scriptz", 120015], ["\\scriptZ", 119989], ["\\sdiv", 8260], ["\\sdivide", 8260], ["\\searrow", 8600], ["\\setminus", 8726], ["\\sigma", 963], ["\\Sigma", 931], ["\\sim", 8764], ["\\simeq", 8771], ["\\smash", 11021], ["\\spadesuit", 9824], ["\\sqcap", 8851], ["\\sqcup", 8852], ["\\sqrt", 8730], ["\\sqsubseteq", 8849], ["\\sqsuperseteq", 8850], ["\\star", 8902], ["\\subset", 8834], ["\\subseteq", 8838], ["\\succ", 8827], ["\\succeq", 8829], ["\\sum", 8721], ["\\superset", 8835], ["\\superseteq", 8839], ["\\swarrow", 8601], ["\\tau", 964], ["\\Tau", 932], ["\\therefore", 8756], ["\\theta", 952], ["\\Theta", 920], ["\\thicksp", 8197], ["\\thinsp", 8198], ["\\tilde", 771], ["\\times", 215], ["\\to", 8594], ["\\top", 8868], ["\\tvec", 8417], ["\\ubar", 818], ["\\Ubar", 819], ["\\underbar", 9601], ["\\underbrace", 9183], ["\\underparen", 9181], ["\\uparrow", 8593], ["\\Uparrow", 8657], ["\\updownarrow", 8597], ["\\Updownarrow", 8661], ["\\uplus", 8846], ["\\upsilon", 965], ["\\Upsilon", 933], ["\\varepsilon", 949], ["\\varphi", 966], ["\\varpi", 982], ["\\varrho", 1009], ["\\varsigma", 962], ["\\vartheta", 977], ["\\vbar", 9474], ["\\vdash", 8866], ["\\vdots", 8942], ["\\vec", 8407], ["\\vee", 8744], ["\\vert", 124], ["\\Vert", 8214], ["\\vphantom", 8691], ["\\vthicksp", 8196], ["\\wedge", 8743], ["\\wp", 8472], ["\\wr", 8768], ["\\xi", 958], ["\\Xi", 926], ["\\zeta", 950], ["\\Zeta", 918], ["\\zwnj", 8204], ["\\zwsp", 8203], ["~=", 8773], ["-+", 8723], ["+-", 177], ["<<", 8810], ["<=", 8804], ["->", 8594], [">=", 8805], [">>", 8811]];
var g_aMathAutoCorrectTriggerCharCodes = {
    32: 1,
    33: 1,
    34: 1,
    35: 1,
    36: 1,
    37: 1,
    38: 1,
    39: 1,
    40: 1,
    41: 1,
    42: 1,
    43: 1,
    44: 1,
    45: 1,
    46: 1,
    47: 1,
    58: 1,
    59: 1,
    60: 1,
    61: 1,
    62: 1,
    63: 1,
    64: 1,
    91: 1,
    92: 1,
    93: 1,
    94: 1,
    95: 1,
    96: 1,
    123: 1,
    124: 1,
    125: 1,
    126: 1
};