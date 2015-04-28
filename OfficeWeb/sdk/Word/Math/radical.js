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
function CSignRadical() {
    this.Parent = null;
    this.pos = null;
    this.size = null;
    this.gapArg = 0;
    this.gapSign = 0;
    this.measure = {
        heightTick: 0,
        widthTick: 0,
        widthSlash: 0,
        bHigh: false
    };
}
CSignRadical.prototype.new_draw = function (x, y, pGraphics) {
    var txtPrp = this.Parent.Get_CompiledCtrPrp();
    var penW = txtPrp.FontSize * g_dKoef_pt_to_mm * 0.042;
    y += this.gapTop + penW / 2;
    var x1 = this.pos.x + x,
    x2 = x1 + 0.048 * txtPrp.FontSize;
    var Height = this.size.height - this.gapTop;
    var y2 = this.pos.y + y + Height - this.measure.heightTick,
    y1 = y2 + 0.0242 * txtPrp.FontSize;
    var tg = 0.048 / 0.0242;
    var tX = tg * 0.85 * penW,
    tY = 0.92 * penW / tg;
    var x3 = x2,
    y3 = y2 - tY;
    var sin = 0.876,
    cos = 0.474;
    var y4 = this.pos.y + y + Height - penW;
    var y5 = y4 + penW / 2 * cos;
    var x4, x5;
    if (!this.measure.bHigh) {
        x4 = x3 + (y4 - y3) / tg;
        x5 = x4 + penW / 2 * sin;
    } else {
        x4 = x1 + this.measure.widthSlash - penW / 3 * sin;
        x5 = x1 + this.measure.widthSlash;
    }
    var x6 = x1 + this.measure.widthSlash,
    x7 = this.pos.x + x + this.size.width;
    var y6 = this.pos.y + y,
    y7 = this.pos.y + y;
    pGraphics.p_width(penW * 0.8 * 1000);
    pGraphics.p_color(0, 0, 0, 255);
    pGraphics.b_color1(0, 0, 0, 255);
    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();
    pGraphics.p_width(1.7 * penW * 1000);
    pGraphics._s();
    pGraphics._m(x3, y3);
    pGraphics._l(x4, y4);
    pGraphics.ds();
    pGraphics.p_width(penW * 1000);
    pGraphics.p_color(0, 0, 0, 255);
    pGraphics.b_color1(0, 0, 0, 255);
    pGraphics.p_width(penW * 1000);
    pGraphics._s();
    pGraphics._m(x5, y5);
    pGraphics._l(x6, y6);
    pGraphics._l(x7, y7);
    pGraphics.ds();
    pGraphics.p_color(0, 0, 0, 255);
    pGraphics.b_color1(0, 0, 0, 255);
    pGraphics._s();
    pGraphics._m(x4 - penW * 0.6 * sin, y4 - penW / 5);
    pGraphics._l(x5 + penW / 3 * sin, y4 - penW / 5);
    pGraphics.ds();
};
CSignRadical.prototype.draw = function (x, y, pGraphics, PDSE) {
    var txtPrp = this.Parent.Get_CompiledCtrPrp();
    var penW = txtPrp.FontSize * g_dKoef_pt_to_mm * 0.042;
    y += penW / 2 + this.gapSign;
    var x1 = this.pos.x + x,
    x2 = x1 + 0.048 * txtPrp.FontSize;
    var Height = this.size.height - this.gapSign;
    var y2 = this.pos.y + y + Height - this.measure.heightTick,
    y1 = y2 + 0.0242 * txtPrp.FontSize;
    var tg = 0.048 / 0.0242;
    var tX = tg * 0.85 * penW,
    tY = 0.92 * penW / tg;
    var x3 = x2,
    y3 = y2 - tY;
    var sin = 0.876,
    cos = 0.474;
    var y4 = this.pos.y + y + Height - penW;
    var y7 = y4 + penW / 2 * cos;
    var x4, x7;
    if (!this.measure.bHigh) {
        x4 = x3 + (y4 - y3) / tg;
        x7 = x4 + penW / 2 * sin;
    } else {
        x4 = x1 + this.measure.widthSlash - penW / 3 * sin;
        x7 = x1 + this.measure.widthSlash;
    }
    var x5 = x4 - penW * 0.6 * sin,
    y5 = y4 - penW / 5,
    x6 = x7 + penW / 3 * sin,
    y6 = y5;
    var x8 = x1 + this.measure.widthSlash,
    x9 = this.pos.x + x + this.size.width;
    var y8 = this.pos.y + y,
    y9 = this.pos.y + y;
    pGraphics.p_width(penW * 0.8 * 1000);
    this.Parent.Make_ShdColor(PDSE, txtPrp);
    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();
    pGraphics.p_width(1.7 * penW * 1000);
    pGraphics._s();
    pGraphics._m(x3, y3);
    pGraphics._l(x4, y4);
    pGraphics.ds();
    pGraphics.p_width(penW * 1000);
    pGraphics._s();
    pGraphics._m(x5, y5);
    pGraphics._l(x6, y6);
    pGraphics.ds();
    pGraphics.p_width(penW * 1000);
    pGraphics._s();
    pGraphics._m(x7, y7);
    pGraphics._l(x8, y8);
    pGraphics._l(x9, y9);
    pGraphics.ds();
};
CSignRadical.prototype.recalculateSize = function (oMeasure, sizeArg) {
    var txtPrp = this.Parent.Get_CompiledCtrPrp();
    var height, width;
    var plH = 9.877777777777776 * txtPrp.FontSize / 36;
    this.gapArg = txtPrp.FontSize * g_dKoef_pt_to_mm * 0.077108;
    this.gapSign = txtPrp.FontSize * g_dKoef_pt_to_mm * 0.09449200000000001;
    var heightArg = sizeArg.height + this.gapArg,
    widthArg = sizeArg.width;
    var H0 = plH * 1.07,
    H1 = plH * 1.623478883321404,
    H2 = plH * 2.8,
    H3 = plH * 4.08,
    H4 = plH * 5.7,
    H5 = plH * 7.15;
    this.measure.bHigh = false;
    var bDescentArg = sizeArg.height - sizeArg.ascent > 0.4 * txtPrp.FontSize / 11;
    if (heightArg < H0 && !bDescentArg) {
        height = H0 * 1.12;
    } else {
        if (heightArg < H1) {
            height = H1;
        } else {
            if (heightArg < H2) {
                height = H2;
            } else {
                if (heightArg < H3) {
                    height = H3 * 1.04;
                } else {
                    if (heightArg < H4) {
                        height = H4;
                    } else {
                        if (heightArg < H5) {
                            height = H5;
                        } else {
                            height = heightArg;
                            this.measure.bHigh = true;
                        }
                    }
                }
            }
        }
    }
    var minHgtRad = plH * 1.130493164,
    maxHgtRad = plH * 7.029296875;
    var minHgtTick = plH * 0.6,
    maxHgtTick = 1.2 * plH;
    var heightTick, widthSlash, gapLeft;
    if (heightArg > maxHgtRad) {
        heightTick = maxHgtTick;
        widthSlash = plH * 0.67;
        gapLeft = 0.2 * plH;
    } else {
        var H;
        if (heightArg < H1) {
            H = H1;
            var zetta = height < H1 ? 0.75 : 0.82;
            widthSlash = plH * zetta;
        } else {
            H = height;
            widthSlash = plH * 0.8681086138556986;
        }
        var alpha = (H - minHgtRad) / (2 * maxHgtRad);
        heightTick = minHgtTick * (1 + alpha);
        gapLeft = 0.1268310546875002 * plH;
    }
    this.measure.widthSlash = widthSlash;
    this.measure.heightTick = heightTick;
    this.measure.widthTick = 0.1196002747872799 * txtPrp.FontSize;
    width = widthSlash + gapLeft + widthArg;
    height += this.gapSign;
    this.size = {
        height: height,
        width: width
    };
};
CSignRadical.prototype.setPosition = function (pos) {
    this.pos = pos;
};
CSignRadical.prototype.relate = function (parent) {
    this.Parent = parent;
};
function CMathRadicalPr() {
    this.type = DEGREE_RADICAL;
    this.degHide = false;
}
CMathRadicalPr.prototype.Set_FromObject = function (Obj) {
    if (SQUARE_RADICAL === Obj.type || DEGREE_RADICAL === Obj.type) {
        this.type = Obj.type;
    }
    if (true === Obj.degHide || 1 === Obj.degHide) {
        this.degHide = true;
        this.type = SQUARE_RADICAL;
    } else {
        if (false === Obj.degHide || 0 === Obj.degHide) {
            this.degHide = false;
            this.type = DEGREE_RADICAL;
        }
    }
};
CMathRadicalPr.prototype.Copy = function () {
    var NewPr = new CMathRadicalPr();
    NewPr.type = this.type;
    NewPr.degHide = this.degHide;
    return NewPr;
};
CMathRadicalPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteLong(this.type);
    Writer.WriteBool(this.degHide);
};
CMathRadicalPr.prototype.Read_FromBinary = function (Reader) {
    this.type = Reader.GetLong();
    this.degHide = Reader.GetBool();
};
function CRadical(props) {
    CRadical.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Iterator = null;
    this.Base = null;
    this.RealBase = null;
    this.signRadical = new CSignRadical();
    this.signRadical.relate(this);
    this.Pr = new CMathRadicalPr();
    this.gapDegree = 0;
    this.gapWidth = 0;
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CRadical, CMathBase);
CRadical.prototype.ClassType = historyitem_type_rad;
CRadical.prototype.kind = MATH_RADICAL;
CRadical.prototype.init = function (props) {
    this.setProperties(props);
    this.Fill_LogicalContent(2);
    this.fillContent();
};
CRadical.prototype.fillContent = function () {
    this.Iterator = this.getDegree();
    this.Base = this.getBase();
};
CRadical.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    this.ApplyProperties(RPI);
    if (this.Pr.type == SQUARE_RADICAL) {
        this.RealBase.PreRecalc(this, ParaMath, ArgSize, RPI);
    } else {
        var ArgSzIter = new CMathArgSize();
        ArgSzIter.SetValue(-2);
        this.Iterator.PreRecalc(this, ParaMath, ArgSzIter, RPI);
        this.RealBase.PreRecalc(this, ParaMath, ArgSize, RPI);
    }
    if (this.bInside == false) {
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);
    }
};
CRadical.prototype.ApplyProperties = function (RPI) {
    if (this.RecalcInfo.bProps) {
        if (this.Pr.degHide == true) {
            this.setDimension(1, 1);
            this.elements[0][0] = this.Base;
            this.RealBase = this.elements[0][0];
        } else {
            this.setDimension(1, 2);
            this.elements[0][0] = this.Iterator;
            this.elements[0][1] = this.Base;
            this.RealBase = this.Base;
        }
        this.RecalcInfo.bProps = false;
    }
};
CRadical.prototype.Resize = function (oMeasure, RPI) {
    if (this.Pr.type == SQUARE_RADICAL) {
        this.RealBase.Resize(oMeasure, RPI);
    } else {
        this.Iterator.Resize(oMeasure, RPI);
        this.RealBase.Resize(oMeasure, RPI);
    }
    var shTop, height, width, ascent;
    this.signRadical.recalculateSize(oMeasure, this.RealBase.size);
    var txtPrp = this.Get_CompiledCtrPrp();
    var sign = this.signRadical.size,
    gSign = this.signRadical.gapSign,
    gArg = this.signRadical.gapArg > 2 * g_dKoef_pt_to_mm ? this.signRadical.gapArg : 2 * g_dKoef_pt_to_mm;
    var gapBase = gSign + gArg;
    if (this.Pr.type == SQUARE_RADICAL) {
        shTop = (sign.height - gSign - this.RealBase.size.height) / 2;
        shTop = shTop > 0 ? shTop : 0;
        ascent = gapBase + shTop + this.RealBase.size.ascent;
        height = sign.height > ascent - this.RealBase.size.ascent + this.RealBase.size.height ? sign.height : ascent - this.RealBase.size.ascent + this.RealBase.size.height;
        width = sign.width;
        width += this.GapLeft + this.GapRight;
        this.size = {
            width: width,
            height: height,
            ascent: ascent
        };
    } else {
        if (this.Pr.type == DEGREE_RADICAL) {
            var wTick = this.signRadical.measure.widthTick,
            hTick = this.signRadical.measure.heightTick;
            var plH = 9.877777777777776 * txtPrp.FontSize / 36;
            var gapHeight = 0.011 * txtPrp.FontSize;
            this.gapWidth = 0.011 * txtPrp.FontSize;
            var wDegree = this.Iterator.size.width > wTick ? this.Iterator.size.width - wTick : 0;
            width = wDegree + sign.width + this.gapWidth;
            width += this.GapLeft + this.GapRight;
            var gapDegree;
            if (this.RealBase.size.height < plH) {
                gapDegree = 1.5 * txtPrp.FontSize / 36;
            } else {
                gapDegree = 3 * txtPrp.FontSize / 36;
            }
            var h1 = gapHeight + this.Iterator.size.height + gapDegree + hTick,
            h2 = sign.height;
            shTop = (sign.height - gSign - this.RealBase.size.height) / 2;
            if (h1 > h2) {
                height = h1;
                ascent = height - sign.height + gapBase + shTop + this.RealBase.size.ascent;
            } else {
                height = h2;
                ascent = gapBase + shTop + this.RealBase.size.ascent;
            }
            this.gapDegree = height - h1 + gapHeight;
            this.size = {
                width: width,
                height: height,
                ascent: ascent
            };
        }
    }
};
CRadical.prototype.setPosition = function (pos, PosInfo) {
    this.pos.x = pos.x;
    this.pos.y = pos.y - this.size.ascent;
    var PosBase = new CMathPosition(),
    PosRadical = new CMathPosition();
    if (this.Pr.type == SQUARE_RADICAL) {
        var gapLeft = this.size.width - this.RealBase.size.width - this.GapRight;
        var gapTop = this.size.ascent - this.RealBase.size.ascent;
        PosRadical.x = this.pos.x + this.GapLeft;
        PosRadical.y = this.pos.y;
        PosBase.x = this.pos.x + gapLeft;
        PosBase.y = this.pos.y + gapTop;
        this.signRadical.setPosition(PosRadical);
        this.RealBase.setPosition(PosBase, PosInfo);
    } else {
        if (this.Pr.type == DEGREE_RADICAL) {
            var wTick = this.signRadical.measure.widthTick;
            var PosDegree = new CMathPosition();
            PosDegree.x = this.pos.x + this.GapLeft + this.gapWidth;
            PosDegree.y = this.pos.y + this.gapDegree;
            this.Iterator.setPosition(PosDegree, PosInfo);
            var wDegree = this.Iterator.size.width > wTick ? this.Iterator.size.width - wTick : 0;
            PosRadical.x = this.pos.x + this.GapLeft + wDegree;
            PosRadical.y = this.pos.y + this.size.height - this.signRadical.size.height;
            this.signRadical.setPosition(PosRadical);
            PosBase.x = this.pos.x + this.size.width - this.RealBase.size.width - this.GapRight;
            PosBase.y = this.pos.y + this.size.ascent - this.RealBase.size.ascent;
            this.RealBase.setPosition(PosBase, PosInfo);
        }
    }
};
CRadical.prototype.draw = function (x, y, pGraphics, PDSE) {
    this.signRadical.draw(x, y, pGraphics, PDSE);
    CRadical.superclass.draw.call(this, x, y, pGraphics, PDSE);
};
CRadical.prototype.getBase = function () {
    return this.Content[1];
};
CRadical.prototype.getDegree = function () {
    return this.Content[0];
};
CRadical.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Radical;
    MathProps.Pr = null;
};
CRadical.prototype.Is_ContentUse = function (MathContent) {
    if (MathContent === this.Content[1]) {
        return true;
    }
    if (DEGREE_RADICAL === this.Pr.type && MathContent === this.Content[0]) {
        return true;
    }
    return false;
};